"""Per-theme square artwork, outside Steam's shared artwork configuration."""
import base64
import hashlib
import json
import re
import struct
import threading
from pathlib import Path
from urllib.parse import quote, urlencode, urlparse
from urllib.request import Request
from theme_network import urlopen

LOCK = threading.RLock()
LIMIT = 8 * 1024 * 1024


def folder(root, theme):
    if not isinstance(theme, str) or not 0 < len(theme) <= 160:
        raise ValueError('Invalid theme')
    path = Path(root) / 'square-artwork' / hashlib.sha256(theme.encode()).hexdigest()[:24]
    path.mkdir(parents=True, exist_ok=True)
    return path


def game_id(appid):
    value = str(appid)
    if not re.fullmatch(r'[0-9]{1,20}', value):
        raise ValueError('Invalid game ID')
    return value


def _read(path, default):
    try:
        value = json.loads(path.read_text('utf-8'))
        return value if isinstance(value, dict) else default
    except (OSError, ValueError):
        return default


def _write(path, data):
    with LOCK:
        tmp = path.with_suffix(path.suffix + '.tmp')
        tmp.write_bytes(data)
        tmp.replace(path)


def images(root, theme):
    path = folder(root, theme)
    with LOCK:
        records = _read(path / 'choices.json', {})
    result = {}
    for appid, name in records.items():
        if re.fullmatch(r'[0-9]{1,20}', appid) and isinstance(name, str) and re.fullmatch(r'[a-f0-9]{64}\.png', name):
            file = path / name
            if file.is_file():
                result[appid] = str(file)
    return result


def save(root, theme, appid, data, automatic=False):
    """UI normalizes images to a square PNG before saving; bound decoder input."""
    ident = game_id(appid)
    if not isinstance(data, str) or len(data) > LIMIT * 2 or not data.startswith('data:image/png;base64,'):
        raise ValueError('Choose a square PNG image smaller than 8 MB')
    raw = base64.b64decode(data.split(',', 1)[1], validate=True)
    if len(raw) > LIMIT or not raw.startswith(b'\x89PNG\r\n\x1a\n') or len(raw) < 33 or raw[12:16] != b'IHDR':
        raise ValueError('Invalid PNG image')
    width, height = struct.unpack('>II', raw[16:24])
    if width != height or not 32 <= width <= 2048:
        raise ValueError('Use a square image between 32 and 2048 pixels')
    path = folder(root, theme)
    name = hashlib.sha256(raw).hexdigest() + '.png'
    with LOCK:
        records = _read(path / 'choices.json', {})
        if automatic and ident in records:
            return images(root, theme)
        _write(path / name, raw)
        records[ident] = name
        _write(path / 'choices.json', json.dumps(records).encode())
    return images(root, theme)


def remove(root, theme, appid):
    ident = game_id(appid)
    with LOCK:
        path = folder(root, theme) / 'choices.json'
        records = _read(path, {})
        records.pop(ident, None)
        _write(path, json.dumps(records).encode())
    return images(root, theme)


def configure(root, key=None):
    path = Path(root) / 'square-artwork' / 'provider-key.json'
    if key is not None:
        key = str(key).strip()
        if key and not re.fullmatch(r'[a-fA-F0-9]{32}', key):
            raise ValueError('Enter your 32-character SteamGridDB API key')
        path.parent.mkdir(parents=True, exist_ok=True)
        _write(path, json.dumps({'key': key}).encode())
        path.chmod(0o600)
    return {'configured': bool(_read(path, {}).get('key'))}


def search(root, appid, name='', steam=True, provider_game=''):
    game_id(appid)
    key = _read(Path(root) / 'square-artwork' / 'provider-key.json', {}).get('key')
    if not key:
        return {'images': [], 'games': [], 'error': 'Add a SteamGridDB API key below, or import a local square image.'}
    def read(path):
        request = Request('https://www.steamgriddb.com/api/v2/' + path, headers={'Authorization': 'Bearer ' + key, 'User-Agent': 'ThemeHub/square-artwork'})
        with urlopen(request, timeout=15) as response:
            raw = response.read(2 * 1024 * 1024 + 1)
        if len(raw) > 2 * 1024 * 1024:
            raise ValueError('Artwork response too large')
        data = json.loads(raw)
        if not data.get('success'):
            raise ValueError('SteamGridDB lookup failed')
        return data.get('data', [])
    if provider_game:
        endpoint = 'grids/game/' + game_id(provider_game)
    elif steam:
        endpoint = 'grids/steam/' + game_id(appid)
    else:
        # Non-Steam title matches always require user confirmation.
        rows = read('search/autocomplete/' + quote(str(name)[:160], safe=''))
        return {'images': [], 'games': [{'id': str(row['id']), 'name': str(row['name'])[:200]} for row in rows[:20]]}
    rows = read(endpoint + '?' + urlencode({'dimensions': '512x512,1024x1024', 'types': 'static', 'nsfw': 'false', 'humor': 'false'}))
    images = []
    for row in rows[:40]:
        url = row.get('url', '')
        if row.get('width') != row.get('height') or not isinstance(url, str):
            continue
        parsed = urlparse(url)
        if parsed.scheme == 'https' and parsed.hostname in ('cdn2.steamgriddb.com', 'cdn.steamgriddb.com'):
            images.append({'url': url, 'author': str((row.get('author') or {}).get('name', ''))[:100], 'id': str(row.get('id', ''))})
    return {'images': images, 'games': []}


def download(url):
    parsed = urlparse(str(url))
    if parsed.scheme != 'https' or parsed.hostname not in ('cdn2.steamgriddb.com', 'cdn.steamgriddb.com') or parsed.username or parsed.password or parsed.port not in (None, 443):
        raise ValueError('Invalid SteamGridDB artwork URL')
    with urlopen(Request(url, headers={'User-Agent': 'ThemeHub/square-artwork'}), timeout=15) as response:
        raw = response.read(LIMIT + 1)
    if len(raw) > LIMIT:
        raise ValueError('Image exceeds 8 MB')
    mime = 'image/png' if raw.startswith(b'\x89PNG\r\n\x1a\n') else 'image/jpeg' if raw.startswith(b'\xff\xd8') else 'image/webp' if raw[:4] == b'RIFF' and raw[8:12] == b'WEBP' else None
    if not mime:
        raise ValueError('Unsupported artwork image')
    return {'image': 'data:' + mime + ';base64,' + base64.b64encode(raw).decode()}
