"""Read ThemeDeck assignments without modifying its settings or music files.

Source format: BrenticusMaximus/ThemeDeck v3.0.2, main.py tracks.json.
Only an assigned numeric app id can be resolved; callers cannot supply a path.
"""
import hashlib
import json
import math
from pathlib import Path

MAX_MANIFEST = 2 * 1024 * 1024
MAX_AUDIO = 512 * 1024 * 1024
EXTENSIONS = {".mp3", ".aac", ".flac", ".ogg", ".wav", ".m4a"}


def manifest_path(settings_dir):
    return Path(settings_dir).parent / "ThemeDeck" / "tracks.json"


def _number(value, default, upper):
    if isinstance(value, bool) or not isinstance(value, (int, float)) or not math.isfinite(value):
        return default
    return min(upper, max(0, value))


def assignment(settings_dir, appid):
    if type(appid) is not int or appid <= 0 or appid > 2**32 - 1:
        return None
    try:
        manifest = manifest_path(settings_dir)
        if manifest.stat().st_size > MAX_MANIFEST:
            return None
        data = json.loads(manifest.read_text(encoding="utf-8"))
        track = data.get(str(appid)) if isinstance(data, dict) else None
        if not isinstance(track, dict) or not isinstance(track.get("path"), str):
            return None
        path = Path(track["path"]).expanduser().resolve()
        if not path.is_file() or path.suffix.lower() not in EXTENSIONS:
            return None
        stat = path.stat()
        if stat.st_size <= 0 or stat.st_size > MAX_AUDIO:
            return None
        signature = hashlib.sha256(f"{path}:{stat.st_mtime_ns}:{stat.st_size}".encode()).hexdigest()[:24]
        return {"path": str(path), "signature": signature,
                "filename": str(track.get("filename") or path.name)[:256],
                "volume": _number(track.get("volume"), 1, 1),
                "startOffset": _number(track.get("start_offset"), 0, 30),
                "loop": track.get("loop") is not False}
    except (OSError, ValueError, TypeError, RuntimeError):
        return None


def resolve(settings_dir, appid, signature):
    track = assignment(settings_dir, appid)
    return track["path"] if track and track["signature"] == signature else None
