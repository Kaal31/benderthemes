"""Shipped frame-theme media served through the existing verified asset store."""
import json
from pathlib import Path
import threading

_lock = threading.Lock()


def catalog():
    return json.loads(Path(__file__).with_name("frame_media_catalog.json").read_text(encoding="utf-8"))


def resolve(ident, relative):
    spec = catalog().get(ident)
    if not spec or relative not in spec["files"]:
        return None
    import theme_store
    path = Path(theme_store.resource("assets/frame-themes/" + ident + "/" + relative))
    return str(path) if path.is_file() else None


def ensure(ident):
    spec = catalog().get(ident)
    if not spec:
        return {"success": True}
    with _lock:
        import theme_store
        present = theme_store.local_inventory().get(spec["pack"])
        if present == spec["version"] and all(resolve(ident, name) for name in spec["files"]) and all(Path(theme_store.resource(name)).is_file() for name in spec.get("soundResources", [])):
            return {"success": True}
        return theme_store.install(spec["pack"])
