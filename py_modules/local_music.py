"""Copy a user-selected audio file into a reusable local music pack."""
import hashlib
import json
import os
from pathlib import Path
import shutil
import tempfile

EXTENSIONS = {".mp3", ".ogg", ".oga", ".opus", ".wav", ".flac", ".m4a"}
MAX_SIZE = 128 * 1024 * 1024


def folders(home):
    home = Path(home).resolve()
    result = {"downloads": str(home / "Downloads"), "music": str(home / "Music")}
    try:
        for line in (home / ".config/user-dirs.dirs").read_text(encoding="utf-8").splitlines():
            for key, variable in (("downloads", "XDG_DOWNLOAD_DIR"), ("music", "XDG_MUSIC_DIR")):
                if line.startswith(variable + '="') and line.endswith('"'):
                    value = line.split('="', 1)[1][:-1].replace("$HOME", str(home))
                    if Path(value).is_absolute():
                        result[key] = value
    except OSError:
        pass
    return result


def import_file(path, home, sounds_dir):
    source = Path(path).resolve(strict=True)
    roots = [Path(p).resolve() for p in folders(home).values()]
    if not source.is_file() or not any(source.is_relative_to(root) for root in roots):
        raise ValueError("Choose a music file inside Downloads or Music.")
    ext = source.suffix.lower()
    if ext not in EXTENSIONS:
        raise ValueError("Choose MP3, Ogg, Opus, WAV, FLAC or M4A audio.")
    size = source.stat().st_size
    if size == 0 or size > MAX_SIZE:
        raise ValueError("Choose a non-empty music file smaller than 128 MB.")
    sounds = Path(sounds_dir)
    sounds.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix=".themehub-music-", dir=sounds) as temporary:
        copied = Path(temporary) / ("menu_music" + ext)
        digest = hashlib.sha256()
        total = 0
        with source.open("rb") as src, copied.open("wb") as dst:
            while chunk := src.read(1024 * 1024):
                total += len(chunk)
                if total > MAX_SIZE:
                    raise ValueError("Music file exceeds 128 MB.")
                digest.update(chunk)
                dst.write(chunk)
        header = copied.open("rb")
        with header:
            magic = header.read(32)
        valid = (ext == ".mp3" and (magic.startswith(b"ID3") or len(magic) > 1 and magic[0] == 255 and magic[1] & 224 == 224)
                 or ext in {".ogg", ".oga", ".opus"} and magic.startswith(b"OggS")
                 or ext == ".wav" and magic.startswith(b"RIFF") and magic[8:12] == b"WAVE"
                 or ext == ".flac" and magic.startswith(b"fLaC")
                 or ext == ".m4a" and magic[4:8] == b"ftyp")
        if not valid:
            raise ValueError("The file does not contain the expected audio format.")
        folder = "ThemeHub-Local-Music-" + digest.hexdigest() + ext.replace(".", "-")
        destination = sounds / folder
        if destination.is_symlink():
            raise ValueError("Unsafe music destination.")
        if not destination.exists():
            (Path(temporary) / "pack.json").write_text(json.dumps({"name": "Local music · " + source.name,
                "author": "Local file", "music": True, "mappings": {}, "ignore": []}), encoding="utf-8")
            shutil.copytree(temporary, destination)
    return {"ok": True, "folder": folder, "name": source.name}
