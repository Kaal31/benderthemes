"""Optional local assembly engine for Metro; the legacy avatar remains independent."""
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import threading
import urllib.request
import zipfile

_instances = {}
_instances_lock = threading.Lock()
GUID = __import__('re').compile(r'^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$')


def instance(data_dir, settings_dir):
    key = (str(data_dir), str(settings_dir))
    with _instances_lock:
        if key not in _instances:
            _instances[key] = Engine(Path(data_dir), Path(settings_dir))
        return _instances[key]


def sha(path):
    h = hashlib.sha256()
    with path.open('rb') as f:
        for chunk in iter(lambda: f.read(1024 * 1024), b''): h.update(chunk)
    return h.hexdigest()


def validate(desc):
    if not isinstance(desc, dict) or len(json.dumps(desc).encode()) > 65536:
        raise ValueError('Invalid avatar description')
    if desc.get('gender') not in ('male', 'female'): raise ValueError('Invalid body type')
    if len(desc.get('worn', [])) > 13 or len(desc.get('face', [])) > 6: raise ValueError('Too many items')
    ids = [desc.get(k) for k in ('body', 'head', 'chin', 'nose', 'ears')]
    ids += [r.get('id') for r in desc.get('worn', []) + desc.get('face', [])]
    if not desc.get('body') or not desc.get('head') or any(not isinstance(i, str) or not GUID.fullmatch(i) for i in ids if i is not None):
        raise ValueError('Invalid asset identifier')
    colours = list(desc.get('palette', [])) + [c for r in desc.get('worn', []) for c in r.get('colours') or []]
    if any(not isinstance(c, str) or not __import__('re').fullmatch(r'#[0-9a-f]{6}', c) for c in colours):
        raise ValueError('Invalid colour')
    for key in ('height', 'weight'):
        value = desc.get(key, 0)
        if not isinstance(value, (int, float)) or not -1 <= value <= 1: raise ValueError('Invalid body shape')


class Engine:
    def __init__(self, data, settings):
        override = os.environ.get('AVATAR_ASSETS_DIR')
        self.root = Path(override).expanduser().resolve() if override else data / 'avatars' / 'assets-v1'
        self.external = bool(override)
        self.state_file = settings / 'metro-avatar.json'
        self.lock = threading.Lock()
        self.build_lock = threading.Lock()
        self.progress = {'installing': False, 'pack': '', 'completed': 0, 'total': 73, 'error': ''}
        self.library = self.props = None

    def ready(self):
        files = ('catalogue/index.sqlite', 'decoded/index.sqlite', 'decoded/assembled/dependencies.json', 'viewer/public/data/seed-presets.json', 'viewer/public/reference.json')
        return all((self.root / p).is_file() for p in files) and (self.external or (self.root / 'installed-release.json').is_file())

    def state(self):
        try:
            value = json.loads(self.state_file.read_text())
            if value.get('description'): validate(value['description'])
            return value
        except FileNotFoundError: return {'mode': 'auto', 'description': None}
        except (OSError, ValueError, TypeError, AttributeError): return {'mode': 'legacy', 'description': None}

    def status(self):
        with self.lock: progress = dict(self.progress)
        return {**progress, **self.state(), 'ready': self.ready(), 'version': 'assets-v1', 'downloadBytes': 3272136918}

    def save(self, desc=None, mode='engine'):
        if mode == 'engine':
            if not self.ready(): raise ValueError('Avatar assets are not installed')
            validate(desc)
            self.build(desc)  # do not replace the saved selection with an outfit that cannot build
        else: desc = self.state().get('description')
        self.state_file.parent.mkdir(parents=True, exist_ok=True)
        temporary = self.state_file.with_suffix('.part')
        temporary.write_text(json.dumps({'mode': mode, 'description': desc}))
        os.replace(temporary, self.state_file)
        return self.status()

    def build(self, desc):
        validate(desc)
        if not self.ready(): raise ValueError('Avatar assets are not installed')
        with self.build_lock:
            if self.library is None:
                from avatar_engine.avatar_build import Library
                self.library = Library(self.root)
            from avatar_engine.avatar_build import build
            return build(self.library, desc)

    def resource(self, tail):
        """Return an allowlisted static path or an API byte response, never arbitrary plugin files."""
        if tail == 'client/engine.js':
            return Path(__file__).parent / 'avatar_engine/client/engine.js'
        if not self.ready(): raise ValueError('Avatar assets are not installed')
        if tail == 'reference.json': return self.root / 'viewer/public/reference.json'
        if tail.startswith('data/'):
            base = (self.root / 'viewer/public/data').resolve()
            target = (base / tail[5:]).resolve()
            if target.is_relative_to(base) and target.is_file(): return target
        raise ValueError('Unknown avatar resource')

    def texture(self, guid, index, frame):
        if not GUID.fullmatch(guid) or (index != 'face' and not index.isdigit()) or not frame.isdigit(): raise ValueError('Invalid texture')
        with self.build_lock:
            if self.library is None:
                from avatar_engine.avatar_build import Library
                self.library = Library(self.root)
            return self.library.texture(guid, index, frame)

    def prop(self, guid):
        if not GUID.fullmatch(guid): raise ValueError('Invalid prop')
        from avatar_engine.avatar_props import PropLibrary, to_json
        with self.build_lock:
            if self.props is None: self.props = PropLibrary(self.root)
            return to_json(self.props.prop(guid), include_body=False)

    def install(self):
        with self.lock:
            if self.progress['installing'] or self.ready(): return self.status_unlocked()
            self.progress.update(installing=True, completed=0, pack='', error='')
        threading.Thread(target=self._install, daemon=True, name='metro-avatar-install').start()
        return self.status()

    def status_unlocked(self):
        return {**self.progress, **self.state(), 'ready': self.ready(), 'version': 'assets-v1', 'downloadBytes': 3272136918}

    def _install(self):
        try:
            if self.external: raise ValueError('The configured external asset folder is incomplete')
            self.root.mkdir(parents=True, exist_ok=True)
            if shutil.disk_usage(self.root).free < 7 * 1024**3: raise ValueError('At least 7 GiB of free space is needed to install avatar assets')
            pin = json.loads((Path(__file__).parent / 'avatar_engine/assets-release.json').read_text())
            with urllib.request.urlopen(pin['manifestUrl'], timeout=60) as response: raw = response.read()
            with zipfile.ZipFile(io.BytesIO(raw)) as z: manifest = json.loads(z.read('packs.json'))
            if manifest.get('version') != 'assets-v1' or manifest.get('schema') != 'avatar-assets/packs@1': raise ValueError('Unsupported asset release')
            cache = self.root / '.downloads'; cache.mkdir(exist_ok=True)
            with self.lock: self.progress['total'] = len(manifest['packs'])
            for i, pack in enumerate(manifest['packs']):
                name = pack['name']
                if Path(name).name != name or '\\' in name: raise ValueError('Invalid pack name')
                with self.lock: self.progress.update(pack=name, completed=i)
                archive = cache / name
                if not archive.is_file() or sha(archive) != pack['sha256']:
                    if not pack['url'].startswith('https://gitflic.ru/'): raise ValueError('Unexpected pack host')
                    temporary = archive.with_suffix('.part')
                    with urllib.request.urlopen(pack['url'], timeout=120) as response, temporary.open('wb') as output: shutil.copyfileobj(response, output, 1024*1024)
                    if temporary.stat().st_size != pack['bytes'] or sha(temporary) != pack['sha256']: raise ValueError('Pack checksum failed: ' + name)
                    os.replace(temporary, archive)
                with zipfile.ZipFile(archive) as z:
                    for entry in z.infolist():
                        rel = PurePosixPath(entry.filename); target = (self.root / entry.filename).resolve()
                        if rel.is_absolute() or '..' in rel.parts or '\\' in entry.filename or not target.is_relative_to(self.root.resolve()) or target.is_relative_to(cache.resolve()): raise ValueError('Invalid pack path')
                        if (entry.external_attr >> 16) & 0o170000 == 0o120000: raise ValueError('Symlinks are not supported')
                        if entry.is_dir(): target.mkdir(parents=True, exist_ok=True); continue
                        target.parent.mkdir(parents=True, exist_ok=True)
                        temporary = target.with_name(target.name + '.part')
                        with z.open(entry) as source, temporary.open('wb') as output: shutil.copyfileobj(source, output)
                        os.replace(temporary, target)
            (self.root / 'installed-release.json').write_text(json.dumps({'version': 'assets-v1'}))
            with self.lock: self.progress.update(completed=len(manifest['packs']), pack='')
        except Exception as error:
            with self.lock: self.progress['error'] = str(error)
        finally:
            with self.lock: self.progress['installing'] = False
