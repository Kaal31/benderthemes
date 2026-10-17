"""Owned native Steam screensaver export. No Steam configuration file edits."""
import hashlib
import json
import os
import re
from pathlib import Path
import shutil
import tempfile

EXTENSIONS = {".gif", ".mp4", ".webm", ".png", ".jpg", ".jpeg", ".webp"}
NAME = "themehub-active"
MARKER = ".themehub-screensaver"

def config(value):
    v = value if isinstance(value, dict) else {}
    return {"duration": max(3, min(300, int(v.get("duration", 15)))),
            "shuffle": v.get("shuffle") is True,
            "fit": "cover" if v.get("fit") == "cover" else "contain",
            "transition": "none" if v.get("transition") == "none" else "fade"}

def import_media(runtime, source):
    src = Path(source).expanduser().resolve()
    if not src.is_file() or src.suffix.lower() not in EXTENSIONS:
        raise ValueError("Choose GIF, MP4, WebM, PNG, JPEG or WebP media.")
    if not 0 < src.stat().st_size <= 512 * 1024 * 1024:
        raise ValueError("Choose a file between 1 byte and 512 MB.")
    with src.open("rb") as f:
        header = f.read(32)
        f.seek(0)
        valid = (header.startswith((b"GIF87a", b"GIF89a")) if src.suffix.lower() == ".gif" else
                 b"ftyp" in header if src.suffix.lower() == ".mp4" else
                 header.startswith(b"\x1aE\xdf\xa3") if src.suffix.lower() == ".webm" else
                 header.startswith(b"\x89PNG\r\n\x1a\n") if src.suffix.lower() == ".png" else
                 header.startswith(b"\xff\xd8\xff") if src.suffix.lower() in (".jpg", ".jpeg") else
                 header[:4] == b"RIFF" and header[8:12] == b"WEBP")
        if not valid:
            raise ValueError("The file contents do not match its media type.")
        digest = hashlib.file_digest(f, "sha256").hexdigest()
    folder = Path(runtime) / "screensavers"
    folder.mkdir(parents=True, exist_ok=True)
    dest = folder / (digest + src.suffix.lower())
    if not dest.exists():
        fd, tmp = tempfile.mkstemp(dir=folder)
        os.close(fd)
        try:
            shutil.copyfile(src, tmp)
            os.replace(tmp, dest)
        finally:
            if os.path.exists(tmp): os.unlink(tmp)
    return {"file": dest.name, "name": src.name}

def export(runtime, steam_root, plugin, files, options):
    if not isinstance(files, list) or not 1 <= len(files) <= 100:
        raise ValueError("Choose between 1 and 100 media files.")
    root = Path(steam_root).resolve()
    if not root.is_dir(): raise ValueError("Steam directory is unavailable.")
    parent = root
    for part in ("config", "uioverrides", "screensavers"):
        parent = parent / part
        if parent.is_symlink(): raise ValueError("Screensaver directory contains a symlink.")
        parent.mkdir(exist_ok=True)
    target = parent / NAME
    if target.is_symlink() or target.exists() and ((target / MARKER).is_symlink() or not (target / MARKER).is_file() or (target / MARKER).read_text(encoding="utf-8") != "ThemeHub"):
        raise ValueError("Refusing to replace an unowned screensaver.")
    stage = Path(tempfile.mkdtemp(prefix=".themehub-", dir=parent))
    try:
        (stage / MARKER).write_text("ThemeHub", encoding="utf-8")
        media = stage / "media"; media.mkdir()
        catalog = []
        for name in files:
            if not isinstance(name, str) or not re.fullmatch(r"[a-f0-9]{64}\.(gif|mp4|webm|png|jpe?g|webp)", name):
                raise ValueError("Invalid screensaver media reference.")
            src = Path(runtime) / "screensavers" / name
            if src.is_symlink() or src.suffix.lower() not in EXTENSIONS or not src.is_file():
                raise ValueError("Screensaver media is missing. Import it again.")
            cached = target / "media" / name
            if (target / "media").is_symlink():
                raise ValueError("Unsafe media directory.")
            if not (cached.is_file() and not cached.is_symlink() and cached.stat().st_size == src.stat().st_size):
                shutil.copyfile(src, media / name)
            catalog.append({"file": "media/" + name, "video": src.suffix.lower() in (".mp4", ".webm")})
        for name in ("index.html", "player.js"):
            shutil.copyfile(Path(plugin) / "screensaver-player" / name, stage / name)
        (stage / "catalog.json").write_text(json.dumps({"media": catalog, **config(options)}), encoding="utf-8")
        # Update individual owned files without removing an existing export before staging succeeds.
        target.mkdir(exist_ok=True)
        for entry in stage.iterdir():
            if entry.is_file() and entry.name != "catalog.json": os.replace(entry, target / entry.name)
        if (target / "media").is_symlink(): raise ValueError("Unsafe media directory.")
        (target / "media").mkdir(exist_ok=True)
        for entry in media.iterdir(): os.replace(entry, target / "media" / entry.name)
        wanted = set(files)
        for entry in (target / "media").iterdir():
            if entry.is_file() and entry.name not in wanted: entry.unlink()
        os.replace(stage / "catalog.json", target / "catalog.json")
        return {"installed": True, "folder": NAME}
    finally:
        shutil.rmtree(stage)


def cleanup(steam_root):
    root = Path(steam_root).resolve()
    parent = root
    for part in ("config", "uioverrides", "screensavers", NAME):
        parent = parent / part
        if parent.is_symlink(): return
    marker = parent / MARKER
    if marker.is_file() and not marker.is_symlink() and marker.read_text(encoding="utf-8") == "ThemeHub":
        shutil.rmtree(parent)
