"""Remove plugin-owned data on Decky uninstall, keeping user preferences."""
import json
import os
from pathlib import Path
import shutil

import decky


def _remove(path):
    # Unlink symlinks themselves; never recurse into their targets.
    if path.is_symlink() or path.is_file():
        path.unlink()
    elif path.is_dir():
        shutil.rmtree(path)


def record_shared(kind, name):
    if kind not in ("sounds", "themes") or Path(name).name != name:
        raise ValueError("Invalid shared resource")
    manifest = Path(decky.DECKY_PLUGIN_SETTINGS_DIR) / "owned-shared.json"
    try:
        entries = json.loads(manifest.read_text())
    except (OSError, ValueError):
        entries = []
    entry = [kind, name]
    if entry not in entries:
        entries.append(entry)
    manifest.parent.mkdir(parents=True, exist_ok=True)
    temp = manifest.with_suffix(".tmp")
    temp.write_text(json.dumps(entries), encoding="utf-8")
    os.replace(temp, manifest)


def cleanup():
    settings = Path(decky.DECKY_PLUGIN_SETTINGS_DIR)
    runtime = Path(decky.DECKY_PLUGIN_RUNTIME_DIR)
    # Validate plugin-specific roots before touching any files.
    home = Path(decky.DECKY_HOME).resolve()
    for root in (settings, runtime):
        resolved = root.resolve()
        if root.is_symlink() or resolved == home or home not in resolved.parents:
            raise ValueError("Refusing cleanup outside plugin data directories")
    if settings.resolve() == runtime.resolve() or settings.resolve() in runtime.resolve().parents or runtime.resolve() in settings.resolve().parents:
        raise ValueError("Plugin settings and runtime directories must be separate")
    try:
        entries = json.loads((settings / "owned-shared.json").read_text())
    except (OSError, ValueError):
        entries = []
    for entry in entries:
        if not isinstance(entry, list) or len(entry) != 2:
            continue
        kind, name = entry
        if kind not in ("sounds", "themes") or not isinstance(name, str) or name in ("", ".", "..") or Path(name).name != name:
            continue
        parent = home / kind
        if parent.is_symlink():
            raise ValueError("Shared resource directory is a symlink")
        _remove(parent / name)
    if runtime.exists():
        _remove(runtime)
    if settings.exists():
        for path in settings.iterdir():
            if path.name != "settings.json":
                _remove(path)
    # Keep Decky plugin logs for diagnosing uninstall/reinstall and update failures.
