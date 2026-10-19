"""Curated DeckThemes downloads. Audio is cached locally, never streamed remotely during playback."""
import io
import json
import os
from pathlib import Path, PurePosixPath
import shutil
import tempfile
import threading
import urllib.request
import zipfile

API = "https://api.deckthemes.com"
MAX_DOWNLOAD = 32 * 1024 * 1024
MAX_EXPANDED = 128 * 1024 * 1024
_lock = threading.Lock()


def catalog():
    return json.loads(Path(__file__).with_name("deckthemes_audio_catalog.json").read_text(encoding="utf-8"))


def entry(ident):
    return next((p for p in catalog() if p["id"] == ident), None)


def request(path, limit):
    req = urllib.request.Request(API + path, headers={"User-Agent": "ThemeHub/1.10 DeckThemes-Audio", "Origin": "https://deckthemes.com", "Accept": "application/json, application/zip"})
    with urllib.request.urlopen(req, timeout=30) as response:
        if not response.geturl().startswith(API + "/"):
            raise ValueError("Unexpected audio download redirect")
        if int(response.headers.get("Content-Length", "0")) > limit:
            raise ValueError("Audio download is too large")
        data = response.read(limit + 1)
        if len(data) > limit:
            raise ValueError("Audio download is too large")
        return data


def install(ident, root, installed=(), fetch=request):
    spec = entry(ident)
    if not spec:
        raise ValueError("Unknown DeckThemes audio pack")
    with _lock:
        # Preserve AudioLoader installations and any already audited copies.
        matches = [p for p in installed if p.get("id") == ident]
        matches.sort(key=lambda p: not p.get("name", "").startswith("DHT Verified"))
        if matches:
            return {"folder": matches[0]["folder"], "reused": True}
        root = Path(root)
        root.mkdir(parents=True, exist_ok=True)
        target = root / ("DeckThemes-" + ident)
        if target.exists():
            try:
                if json.loads((target / "pack.json").read_text())["id"] == ident:
                    return {"folder": target.name, "reused": True}
            except (OSError, ValueError, KeyError):
                pass
            raise ValueError("Audio destination already exists; existing files were preserved")
        meta = json.loads(fetch("/themes/" + ident, 2 * 1024 * 1024))
        if meta.get("id") != ident or meta.get("type", "").lower() != "audio" or meta.get("disabled") or meta.get("manifestVersion", 999) > 3:
            raise ValueError("Unavailable or incompatible DeckThemes audio pack")
        blob = meta["download"]["id"]
        import uuid
        uuid.UUID(blob)
        data = fetch("/blobs/" + blob, MAX_DOWNLOAD)
        with zipfile.ZipFile(io.BytesIO(data)) as archive:
            infos = archive.infolist()
            if len(infos) > 2048 or sum(i.file_size for i in infos) > MAX_EXPANDED:
                raise ValueError("Audio archive is too large")
            names = set()
            for info in infos:
                path = PurePosixPath(info.filename)
                if path.is_absolute() or ".." in path.parts or "\\" in info.orig_filename or ":" in info.filename or (info.external_attr >> 16) & 0o170000 == 0o120000:
                    raise ValueError("Unsafe audio archive path")
                if info.filename in names:
                    raise ValueError("Duplicate audio archive path")
                names.add(info.filename)
            manifests = [i for i in infos if not i.is_dir() and PurePosixPath(i.filename).name == "pack.json"]
            if len(manifests) != 1:
                raise ValueError("Expected one audio pack manifest")
            manifest = json.loads(archive.read(manifests[0]))
            if manifest.get("manifest_version", 999) > 3 or manifest.get("id", ident) != ident:
                raise ValueError("Incompatible audio manifest")
            prefix = PurePosixPath(manifests[0].filename).parent
            allowed = {".json", ".wav", ".mp3", ".ogg", ".oga", ".opus", ".flac", ".m4a", ".png", ".jpg", ".jpeg", ".txt", ".md"}
            with tempfile.TemporaryDirectory(prefix=".themehub-audio-", dir=root) as temp:
                stage = Path(temp) / "pack"
                stage.mkdir()
                for info in infos:
                    if info.is_dir():
                        continue
                    path = PurePosixPath(info.filename)
                    if not path.is_relative_to(prefix):
                        continue
                    relative = path.relative_to(prefix)
                    if relative.suffix.lower() not in allowed and relative.name.upper() not in {"LICENSE", "COPYING", "NOTICE"}:
                        continue
                    dest = stage.joinpath(*relative.parts)
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    with archive.open(info) as source, dest.open("wb") as output:
                        shutil.copyfileobj(source, output)
                if not any(p.suffix.lower() in allowed - {".json", ".png", ".jpg", ".jpeg", ".txt", ".md"} for p in stage.rglob("*")):
                    raise ValueError("Audio pack contains no audio")
                manifest["id"] = ident
                manifest.update(spec.get("override", {}))
                (stage / "pack.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")
                stage.rename(target)
        return {"folder": target.name, "reused": False}
