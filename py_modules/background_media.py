"""Ensure the installed cinematic pack includes the current portable video files."""
import json
from pathlib import Path
import threading
import decky
_lock = threading.Lock()
def catalog():
    path = Path(decky.DECKY_PLUGIN_DIR) / 'theme-catalog.json'
    return {p['id']: p for p in json.loads(path.read_text(encoding='utf-8')).get('themes', []) if p.get('backgroundVideos')}
def ensure(ident):
    import theme_store
    pack = catalog().get(ident)
    if not pack:
        return {'success': True}
    with _lock:
        installed = theme_store.local_inventory().get(ident)
        if installed == pack['version'] and all(Path(theme_store.resource(name)).is_file() for name in pack['backgroundVideos']):
            return {'success': True}
        return theme_store.install(ident)
