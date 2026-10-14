"""Read installed plugin identities without importing or changing other plugins."""
import json
from pathlib import Path

def installed_finally(plugin_root):
    root = Path(plugin_root)
    try:
        entries = list(root.iterdir())
    except OSError:
        return {"verified": False, "finallyInstalled": False}
    for entry in entries:
        if not entry.is_dir():
            continue
        normalized = entry.name.lower().replace("-", " ").replace("_", " ")
        if "finally" in normalized and "achievement" in normalized:
            return {"verified": True, "finallyInstalled": True}
        manifest = entry / "plugin.json"
        if not manifest.is_file():
            continue
        try:
            name = str(json.loads(manifest.read_text(encoding="utf-8")).get("name", "")).lower()
        except (OSError, ValueError):
            return {"verified": False, "finallyInstalled": False}
        if "finally" in name and "achievement" in name:
            return {"verified": True, "finallyInstalled": True}
    return {"verified": True, "finallyInstalled": False}
