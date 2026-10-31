"""Optional cabinet wallpaper downloads; originals stay outside the plugin bundle."""
import base64
import json
from pathlib import Path
import urllib.request

CATALOG = json.loads(Path(__file__).with_name('x360-cabinet-wallpapers.json').read_text(encoding='utf-8'))
MAX_BYTES = 5 * 1024 * 1024

def wallpaper(data_dir, ident):
    entry = next((item for item in CATALOG['items'] if item['id'] == ident), None)
    if not entry:
        return {'error': 'Unknown cabinet wallpaper'}
    root = Path(data_dir) / 'wallpapers' / 'x360-cabinet'
    target = root / entry['file']
    try:
        if target.is_file():
            if target.stat().st_size > MAX_BYTES:
                raise ValueError('Wallpaper is too large')
            raw = target.read_bytes()
        else:
            url = 'https://emphatic.se/360_themes/' + entry['file']
            with urllib.request.urlopen(url, timeout=30) as response:
                raw = response.read(MAX_BYTES + 1)
        if len(raw) > MAX_BYTES or not raw.startswith(b'\xff\xd8\xff'):
            raise ValueError('Invalid wallpaper image')
        if not target.is_file():
            root.mkdir(parents=True, exist_ok=True)
            temporary = target.with_suffix('.part')
            temporary.write_bytes(raw)
            temporary.replace(target)
        return {'background': 'data:image/jpeg;base64,' + base64.b64encode(raw).decode(), 'name': entry['name'], 'source': CATALOG['source']}
    except (OSError, ValueError) as exc:
        return {'error': str(exc)}
