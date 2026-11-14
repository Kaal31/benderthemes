"""Conservative Rainmeter skin package inspection and portable scene compiler.

No extracted code, installer or Rainmeter bang is executed. Does not access files
outside the supplied archive or skin root. Compiled scene is a *subset* of Rainmeter.
"""
from __future__ import annotations
import hashlib
import json
import os
import re
import shutil
import tempfile
import zipfile
from dataclasses import dataclass
from pathlib import Path, PurePosixPath
from typing import Iterable

MAX_FILES = 2000
MAX_UNCOMPRESSED = 256 * 1024 * 1024
MAX_FILE = 128 * 1024 * 1024
MAX_RATIO = 200
MAX_INCLUDES = 24
MAX_BYTES_INI = 1024 * 1024
ALLOWED_IMAGES = {'.png', '.jpg', '.jpeg', '.gif', '.webp'}
ALLOWED_PLACES = {'library', 'store', 'settings', 'downloads', 'search', 'friends', 'options', 'steamHome', 'power', 'mainmenu'}
MAX_BINDINGS = 256
VAR = re.compile(r'#([^#\r\n]+)#')
MEASURE = re.compile(r'\[([^\]\r\n]+)\]')
NUMBER = re.compile(r'^\s*[-+]?(?:\d+(?:\.\d*)?|\.\d+)\s*$')

class ImportErrorRM(ValueError):
    pass

@dataclass
class Entry:
    name: str
    content: bytes


def canonical(path: str) -> str:
    """Normalize package-internal Windows paths; prevent traversal and ambiguity."""
    if '\x00' in path or path.startswith(('/', '\\')) or re.match(r'^[a-zA-Z]:', path):
        raise ImportErrorRM(f'Unsafe absolute path: {path!r}')
    chunks = path.replace('\\', '/').split('/')
    if any(c in ('.', '..', '') for c in chunks):
        raise ImportErrorRM(f'Unsafe path component: {path!r}')
    return '/'.join(chunks)


def inspect(source: Path) -> dict[str, bytes]:
    source = Path(source)
    if source.is_symlink(): raise ImportErrorRM('Choose a real file or folder')
    if source.is_file() and source.stat().st_size > MAX_UNCOMPRESSED: raise ImportErrorRM('Source exceeds size limit')
    files: dict[str, bytes] = {}
    seen: set[str] = set()
    total = 0
    if source.is_dir():
        for path in sorted(source.rglob('*')):
            if path.is_symlink():
                raise ImportErrorRM('Symlinks are forbidden')
            if not path.is_file():
                continue
            rel = canonical(path.relative_to(source).as_posix())
            if path.stat().st_size > MAX_FILE:
                raise ImportErrorRM(f'Oversize file: {rel}')
            contents = path.read_bytes()
            total += len(contents)
            if total > MAX_UNCOMPRESSED:
                raise ImportErrorRM('Package exceeds uncompressed size limit')
            if rel.casefold() in seen:
                raise ImportErrorRM('Case-colliding filename: ' + rel)
            files[rel] = contents
            seen.add(rel.casefold())
            if len(files) > MAX_FILES:
                raise ImportErrorRM('Too many files')
    else:
        if not zipfile.is_zipfile(source):
            raise ImportErrorRM('Expected .rmskin/.zip or a folder')
        with zipfile.ZipFile(source) as z:
            for i in z.infolist():
                if i.is_dir():
                    continue
                name = canonical(i.filename)
                # Unix mode symlink, regular files only when mode is set.
                mode = (i.external_attr >> 16) & 0o170000
                if mode not in (0, 0o100000):
                    raise ImportErrorRM('Archive links/special files forbidden: ' + name)
                if i.flag_bits & 1:
                    raise ImportErrorRM('Encrypted archives unsupported')
                if i.file_size > MAX_FILE or (i.compress_size and i.file_size > MAX_RATIO * i.compress_size):
                    raise ImportErrorRM('Oversize or high-compression entry: ' + name)
                total += i.file_size
                if total > MAX_UNCOMPRESSED or len(files) >= MAX_FILES:
                    raise ImportErrorRM('Archive exceeds limits')
                if name.casefold() in seen:
                    raise ImportErrorRM('Case-colliding filename: ' + name)
                files[name] = z.read(i)
                seen.add(name.casefold())
    return files


def decode_ini(raw: bytes, path: str) -> str:
    if len(raw) > MAX_BYTES_INI:
        raise ImportErrorRM('Oversize INI: ' + path)
    if raw.startswith((b'\xff\xfe', b'\xfe\xff')):
        return raw.decode('utf-16')
    if raw.startswith(b'\xef\xbb\xbf'):
        return raw.decode('utf-8-sig')
    try:
        return raw.decode('utf-8')
    except UnicodeDecodeError:
        # Rainmeter skins commonly use legacy Windows encodings.
        return raw.decode('cp1252')


def sections(text: str) -> list[dict]:
    result: list[dict] = []
    current = None
    for line_no, raw in enumerate(text.splitlines(), 1):
        line = raw.strip()
        if not line or line.startswith((';', '#')):
            continue
        if line.startswith('[') and line.endswith(']'):
            name = line[1:-1].strip()
            if not name:
                continue
            current = {'name': name, 'line': line_no, 'items': []}
            result.append(current)
        elif current is not None and '=' in line:
            key, value = line.split('=', 1)
            current['items'].append({'key': key.strip(), 'value': value.strip(), 'line': line_no})
    return result


def options(section: dict) -> dict[str, str]:
    # Rainmeter options are case-insensitive; last assignment wins.
    return {item['key'].casefold(): item['value'] for item in section['items']}


def option(section: dict, key: str, default: str = '') -> str:
    return options(section).get(key.casefold(), default)


def resolve_variables(value: str, variables: dict[str, str], max_rounds: int = 12) -> str:
    for _ in range(max_rounds):
        new = VAR.sub(lambda m: variables.get(m.group(1).casefold(), m.group(0)), value)
        if len(new)>65536: raise ImportErrorRM('Expanded variable exceeds limit')
        if new == value:
            return value
        value = new
    return value


def safe_relative(base: str, value: str) -> str | None:
    """Return package-local canonical asset path, or None."""
    if re.match(r'^[a-zA-Z]:', value) or value.startswith(('/', '\\')):
        return None
    parts = list(PurePosixPath(base.replace('\\', '/')).parent.parts)
    for part in value.replace('\\', '/').split('/'):
        if part in ('', '.'):
            continue
        if part == '..':
            if not parts:
                return None
            parts.pop()
        else:
            parts.append(part)
    if not parts:
        return None
    return '/'.join(parts)


def find_case(index: dict[str, str], path: str | None) -> str | None:
    return index.get(path.casefold()) if path else None


def resources_path(path: str, files: dict[str, bytes]) -> str:
    parent = PurePosixPath(path).parent
    while str(parent) != '.':
        prefix = parent.as_posix() + '/@Resources/'
        if any(p.casefold().startswith(prefix.casefold()) for p in files): return prefix
        parent = parent.parent
    return '@Resources/'


def included_sections(path: str, files: dict[str, bytes], index: dict[str, str], warnings: list, stack: tuple[str, ...] = (), budget: list[int] | None = None) -> list[dict]:
    budget = [512] if budget is None else budget
    budget[0]-=1
    if budget[0]<0:raise ImportErrorRM('Include expansion exceeds limit')
    if len(stack) >= MAX_INCLUDES or path in stack:
        warnings.append({'file': path, 'reason': 'Include cycle or maximum depth exceeded'})
        return []
    content = decode_ini(files[path], path)
    parsed = sections(content)
    variables: dict[str, str] = {}
    for s in parsed:
        if s['name'].casefold() == 'variables':
            variables.update(options(s))
    variables['@'] = resources_path(path, files)
    variables['currentpath'] = path.rsplit('/', 1)[0] + '/' if '/' in path else ''
    output: list[dict] = []
    for s in parsed:
        # Rainmeter @Include can occur in any section and should be expanded in order.
        for item in s['items']:
            if item['key'].casefold().startswith('@include'):
                requested = resolve_variables(item['value'], variables)
                folder = path.rsplit('/', 1)[0] if '/' in path else ''
                if requested.startswith(variables['@']):
                    candidate = requested
                elif requested.startswith(variables['currentpath']):
                    candidate = requested
                else:
                    candidate = safe_relative(path, requested)
                actual = find_case(index, candidate)
                if actual and actual.lower().endswith(('.inc', '.ini')):
                    output.extend(included_sections(actual, files, index, warnings, (*stack, path), budget))
                else:
                    warnings.append({'file': path, 'line': item['line'], 'reason': 'Unresolved/unsafe include: ' + requested})
        output.append({**s, 'file': path})
    return output


def make_scene(source: Path, configs: list[str] | None = None) -> tuple[dict, dict, dict[str, bytes]]:
    files = inspect(source)
    index = {p.casefold(): p for p in files}
    skins = [p for p in files if p.lower().endswith('.ini') and not p.startswith(('__MACOSX/',)) and not p.lower().endswith('rainstaller.cfg') and '/@resources/' not in p.lower()]
    if configs is not None:
        if not configs or any(p not in skins for p in configs): raise ImportErrorRM('Choose available skin configs')
        skins = [p for p in skins if p in configs]
    if len(skins)>256:raise ImportErrorRM('Choose a smaller skin folder (maximum 256 configs)')
    include_budget=[512]
    # Archives often wrap skins in Skins/Suite/. Prefer relevant configs rather than metadata.
    warnings: list[dict] = []
    suite = {'schema': 1, 'kind': 'rainmeter', 'source': source.name, 'configs': [], 'assets': {}}
    assets: dict[str, bytes] = {}
    for skin in sorted(skins):
        parsed = included_sections(skin, files, index, warnings, budget=include_budget)
        variables = {}
        for section in parsed:
            if section['name'].casefold()=='rainmeter' and option(section,'Update','1000')!='1000':warnings.append({'file':skin,'reason':'Custom Update interval is not supported; measures update once per second'})
        for sec in parsed:
            if sec['name'].casefold() == 'variables':
                variables.update(options(sec))
        folder = skin.rsplit('/', 1)[0] if '/' in skin else ''
        variables.update({'@': resources_path(skin, files), 'currentpath': folder + '/' if folder else ''})
        meters = []
        measures = []
        styles = {sec['name'].casefold(): options(sec) for sec in parsed}
        for sec in parsed:
            opts = options(sec)
            name = sec['name']
            if opts.get('measure'):
                kind = opts['measure'].casefold()
                if kind not in {'time', 'calc', 'string'}:
                    warnings.append({'file': sec['file'], 'section': name, 'reason': 'Unsupported measure: '+kind})
                measures.append({'name': name, 'kind': kind, 'options': {k: resolve_variables(v, variables) for k,v in opts.items()}})
                if kind == 'calc' and not NUMBER.match(resolve_variables(opts.get('formula',''),variables)):
                    warnings.append({'file':skin,'section':name,'reason':'Only numeric Calc formulas are supported'})
            if opts.get('meter'):
                kind = opts['meter'].casefold()
                if kind not in {'string', 'image', 'shape'}:
                    warnings.append({'file': sec['file'], 'section': name, 'reason': 'Unsupported meter: '+kind})
                merged = {}
                for style_name in opts.get('meterstyle', '').split('|'):
                    merged.update(styles.get(style_name.strip().casefold(), {}))
                merged.update(opts)
                meter = {'name': name, 'kind': kind, 'options': {k: resolve_variables(v, variables) for k, v in merged.items()}, 'source': sec['file']}
                if kind == 'image':
                    raw = meter['options'].get('imagename', '')
                    candidate = safe_relative(sec['file'], raw)
                    if raw.startswith(variables['@']):
                        candidate = raw
                    actual = find_case(index, candidate)
                    if actual and Path(actual).suffix.lower() in ALLOWED_IMAGES:
                        asset_id = 'assets/' + hashlib.sha256(actual.encode()).hexdigest()[:16] + Path(actual).suffix.lower()
                        raw_image=files[actual]
                        if not (raw_image.startswith((b'\x89PNG\r\n\x1a\n',b'\xff\xd8\xff',b'GIF87a',b'GIF89a')) or (raw_image[:4]==b'RIFF' and raw_image[8:12]==b'WEBP')):
                            warnings.append({'file':skin,'section':name,'reason':'Invalid image: '+actual})
                            continue
                        assets[asset_id] = raw_image
                        suite['assets'][actual] = asset_id
                        meter['options']['imagename'] = asset_id
                    elif not raw and meter['options'].get('solidcolor'):
                        # Rainmeter image meters can also be used as solid-color separators.
                        meter['kind'] = 'shape'
                    else:
                        warnings.append({'file': sec['file'], 'section': name, 'reason': 'Missing/unsupported image: '+raw})
                for key in opts:
                    if key.endswith('action') or key in ('dynamicvariables','transformationmatrix','shape','shape2','container'):
                        warnings.append({'file':skin,'section':name,'reason':'Unsupported option: '+key})
                meters.append(meter)
        if meters:
            suite['configs'].append({'id': hashlib.sha256(skin.encode()).hexdigest()[:12], 'source': skin, 'variables': variables, 'measures': measures, 'meters': meters})
    if sum(len(c['meters']) for c in suite['configs'])>4096:raise ImportErrorRM('Choose fewer configs (maximum 4096 meters)')
    if len(suite['configs'])>1:warnings.append({'file':source.name,'reason':'Multiple configs use a horizontal suite layout; original desktop window positions are not imported'})
    warning_counts = {}
    for w in warnings:
        warning_counts[w['reason']] = warning_counts.get(w['reason'], 0) + 1
    report = {'status': 'partial' if warnings else 'subset-compatible', 'configs': len(suite['configs']), 'meters': sum(len(c['meters']) for c in suite['configs']), 'measures': sum(len(c['measures']) for c in suite['configs']), 'warnings': warnings, 'inventory': {'files': len(files), 'images': len(assets)}, 'configChoices': [c['source'] for c in suite['configs']], 'controls': [{'key':c['source']+'::'+m['name'],'name':m['name']} for c in suite['configs'] for m in c['meters'] if m['kind'] in ('string','image','shape')], 'disclaimer': 'Supported Rainmeter subset; original launcher actions and native plugins are not executed.'}
    return suite, report, assets


def apply_bindings(scene: dict, bindings: dict) -> dict:
    """Opt-in, data-only mappings. Never execute original Rainmeter shell actions."""
    if not isinstance(bindings, dict) or len(bindings) > MAX_BINDINGS:
        raise ImportErrorRM('Bindings must be a JSON object with at most 256 entries')
    available = {f"{c['source']}::{m['name']}": m for c in scene['configs'] for m in c['meters']}
    for key, binding in bindings.items():
        if key not in available:
            raise ImportErrorRM('Unknown meter binding: '+str(key))
        if not isinstance(binding, dict):
            raise ImportErrorRM('Binding must be an object: '+key)
        kind = binding.get('type')
        if kind == 'open' and set(binding) == {'type', 'place'} and binding.get('place') in ALLOWED_PLACES:
            validated = dict(binding)
        elif kind == 'recent-game' and set(binding) == {'type', 'index'} and type(binding.get('index')) is int and 0 <= binding['index'] < 20:
            validated = dict(binding)
        elif kind == 'game' and set(binding) == {'type', 'appid'} and type(binding.get('appid')) is int and 0 < binding['appid'] < 2**32:
            validated = dict(binding)
        else:
            raise ImportErrorRM('Unsupported or unsafe binding: '+key)
        available[key]['binding'] = validated
    return scene


def export(source: Path, target: Path, bindings: dict | None = None, configs: list[str] | None = None) -> dict:
    scene, report, assets = make_scene(source, configs)
    if bindings is not None:
        apply_bindings(scene, bindings)
        report['steam_bindings'] = len(bindings)
    if not scene['configs']:
        raise ImportErrorRM('No renderable Rainmeter configs found')
    # Single staged directory, atomic replace when output doesn't already exist.
    if target.exists():
        raise ImportErrorRM('Output already exists; select a new destination')
    target.parent.mkdir(parents=True, exist_ok=True)
    stage = Path(tempfile.mkdtemp(prefix='.rainmeter-', dir=target.parent))
    try:
        manifest = {'schema': 1, 'id': 'rm-' + hashlib.sha256(json.dumps(scene, sort_keys=True).encode()).hexdigest()[:12], 'name': 'Rainmeter: '+source.stem[:40], 'company': 'Community', 'layout': 'frame', 'frame': {'entry': 'index.html'}}
        (stage / 'theme.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
        (stage / 'runtime.json').write_text(json.dumps(scene, indent=2), encoding='utf-8')
        (stage / 'compatibility.json').write_text(json.dumps(report, indent=2), encoding='utf-8')
        for relative, data in assets.items():
            destination = stage / relative
            destination.parent.mkdir(parents=True, exist_ok=True)
            destination.write_bytes(data)
        # Runtime intentionally has no network, host APIs or executable Rainmeter actions.
        runtime_source = Path(__file__).with_name('runtime.js').read_text(encoding='utf-8')
        (stage / 'runtime.js').write_text('const RAINMETER_SCENE = ' + json.dumps(scene, ensure_ascii=True).replace('</', '<\\/') + ';\n' + runtime_source, encoding='utf-8')
        (stage / 'index.html').write_text(INDEX, encoding='utf-8')
        os.replace(stage, target)
    except Exception:
        shutil.rmtree(stage, ignore_errors=True)
        raise
    return report

INDEX = '''<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><style>html,body{margin:0;width:100%;height:100%;overflow:hidden;background:#101218;color:white}#stage{position:absolute;inset:0;transform-origin:top left}.meter{position:absolute;white-space:pre-wrap}.rm-control{cursor:pointer;border-radius:2px;outline:none}.rm-control[data-focused=true],.rm-control:focus-visible{outline:3px solid #66dcff;outline-offset:3px;box-shadow:0 0 12px #66dcff80}#notice{position:absolute;right:1rem;bottom:1rem;font:12px system-ui;color:#aaa}</style></head><body><div id="stage"></div><div id="notice">Rainmeter compatibility preview</div><script src="runtime.js"></script></body></html>'''
