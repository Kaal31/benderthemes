"""Verified, data-only theme packs kept outside Decky's replaceable plugin folder."""
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import tempfile
import threading
from urllib.request import Request, urlopen
import zipfile

import decky
from theme_updates import REPO, current_version, version_key

CATALOG_URL = f"https://github.com/{REPO}/releases/latest/download/theme-catalog.json"
MAX_DOWNLOAD = 256 * 1024 * 1024
MAX_EXPANDED = 512 * 1024 * 1024
_lock = threading.Lock()
_migration_lock = threading.Lock()
_progress = {"busy": False, "id": "", "percent": 0, "message": ""}
_catalog = None
_catalog_error = None
ID = re.compile(r"^[a-z][a-z0-9-]{0,47}$")
EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".webp", ".wav", ".mp3", ".ogg", ".oga", ".flac", ".m4a", ".opus", ".mp4", ".webm", ".json", ".txt", ".md", ".xml", ".p3t", ".zip", ".ttf", ".otf", ".woff", ".woff2", ".css"}
ROOTS = {"assets", "cinematic", "sounds", "skins", "wallpapers", "dial", "notices", "css-themes"}


def root():
    return Path(decky.DECKY_PLUGIN_SETTINGS_DIR) / "theme-packs"


def read_json(path):
    try:
        return json.loads(Path(path).read_text(encoding="utf-8"))
    except (OSError, ValueError):
        return {}


def validate_catalog(data):
    if not isinstance(data, dict) or data.get("schema") != 1 or not isinstance(data.get("themes"), list):
        raise ValueError("Unsupported theme catalog")
    seen = set()
    for pack in data["themes"]:
        ident = pack.get("id", "")
        if not ID.fullmatch(ident) or ident in seen:
            raise ValueError("Invalid or duplicate theme ID")
        seen.add(ident)
        version_key(pack["version"])
        version_key(pack["minPluginVersion"])
        expected = f"https://github.com/{REPO}/releases/download/v{pack['version']}/theme-{ident}-v{pack['version']}.zip"
        if pack.get("url") != expected or not re.fullmatch(r"[0-9a-f]{64}", pack.get("sha256", "")):
            raise ValueError("Untrusted theme download")
        if not 0 < pack.get("size", 0) <= MAX_DOWNLOAD or not 0 < pack.get("unpackedSize", 0) <= MAX_EXPANDED:
            raise ValueError("Theme pack is too large")
    return data


def catalog(refresh=False):
    global _catalog, _catalog_error
    error = _catalog_error
    if refresh or _catalog is None:
        try:
            with urlopen(Request(CATALOG_URL, headers={"User-Agent": "DeckHomeThemes/store"}), timeout=20) as response:
                payload = response.read(2 * 1024 * 1024 + 1)
            if len(payload) > 2 * 1024 * 1024:
                raise ValueError("Catalog is too large")
            _catalog = validate_catalog(json.loads(payload))
            error = None
            cache = root() / "catalog.json"
            cache.parent.mkdir(parents=True, exist_ok=True)
            cache.write_text(json.dumps(_catalog), encoding="utf-8")
        except Exception as exc:
            error = f"Live catalog unavailable: {exc}"
            for path in (root() / "catalog.json", Path(decky.DECKY_PLUGIN_DIR) / "theme-catalog.json"):
                try:
                    _catalog = validate_catalog(read_json(path))
                    break
                except (ValueError, KeyError, TypeError):
                    continue
        _catalog_error = error
    themes = []
    installed_themes = local_inventory()
    for pack in (_catalog or {}).get("themes", []):
        try:
            compatible = version_key(current_version()) >= version_key(pack["minPluginVersion"])
        except ValueError:
            compatible = False
        themes.append({**pack, "installedVersion": installed_themes.get(pack["id"]), "compatible": compatible})
    return {"themes": themes, "error": error, "progress": progress()}


def progress():
    return dict(_progress)


def _extract(archive, dest, expected_size):
    with zipfile.ZipFile(archive) as z:
        entries = z.infolist()
        if len(entries) > 10000 or sum(i.file_size for i in entries) != expected_size:
            raise ValueError("Theme archive size does not match its catalog")
        names = set()
        for info in entries:
            p = PurePosixPath(info.filename)
            mode = info.external_attr >> 16
            if (not p.parts or p.is_absolute() or ".." in p.parts or "\\" in info.filename
                    or ":" in info.filename or any(part.startswith(".") for part in p.parts)
                    or p.parts[0] not in ROOTS or stat.S_ISLNK(mode)
                    or (stat.S_IFMT(mode) not in (0, stat.S_IFREG, stat.S_IFDIR))):
                raise ValueError("Unsafe path in theme archive")
            if info.is_dir():
                continue
            if (p.suffix.lower() not in EXTENSIONS and p.name.upper() not in {"LICENSE", "COPYING", "NOTICE", "AUTHORS", "COPYRIGHT"}) or info.filename.casefold() in names:
                raise ValueError("Unsupported or duplicate theme file")
            names.add(info.filename.casefold())
            target = dest.joinpath(*p.parts)
            target.parent.mkdir(parents=True, exist_ok=True)
            with z.open(info) as src, target.open("wb") as out:
                shutil.copyfileobj(src, out)


def install(ident):
    global _progress
    if not _lock.acquire(blocking=False):
        return {"success": False, "error": "Another theme operation is running"}
    _progress = {"busy": True, "id": ident, "percent": 0, "message": "Preparing download…"}
    try:
        pack = next((p for p in catalog()["themes"] if p["id"] == ident), None)
        if not pack or not pack["compatible"]:
            raise ValueError("Theme is unavailable or requires a newer plugin")
        root().mkdir(parents=True, exist_ok=True)
        if shutil.disk_usage(root()).free < pack["size"] + pack["unpackedSize"] + 16 * 1024 * 1024:
            raise ValueError("Not enough free space to install this theme")
        with tempfile.TemporaryDirectory(prefix=".download-", dir=root()) as temp:
            archive = Path(temp) / "pack.zip"
            checksum = hashlib.sha256()
            size = 0
            with urlopen(Request(pack["url"], headers={"User-Agent": "DeckHomeThemes/store"}), timeout=30) as response, archive.open("wb") as f:
                while True:
                    chunk = response.read(262144)
                    if not chunk:
                        break
                    size += len(chunk)
                    if size > pack["size"]:
                        raise ValueError("Theme download exceeds its catalog size")
                    checksum.update(chunk)
                    f.write(chunk)
                    _progress.update(percent=int(size * 90 / pack["size"]), message="Downloading…")
            if size != pack["size"] or checksum.hexdigest() != pack["sha256"]:
                raise ValueError("Theme download failed integrity verification")
            _progress.update(percent=92, message="Installing…")
            staged = Path(temp) / "content"
            staged.mkdir()
            _extract(archive, staged, pack["unpackedSize"])
            (staged / "installed.json").write_text(json.dumps({"id": ident, "version": pack["version"]}), encoding="utf-8")
            destination = root() / ident
            backup = root() / (".backup-" + ident)
            if backup.exists():
                raise ValueError("An interrupted installation needs recovery; restart the plugin")
            if destination.exists():
                destination.rename(backup)
            try:
                staged.rename(destination)
            except Exception:
                if backup.exists():
                    backup.rename(destination)
                raise
            if backup.exists():
                shutil.rmtree(backup)
        _progress.update(percent=100, message="Theme installed")
        return {"success": True}
    except Exception as exc:
        _progress.update(message=str(exc))
        return {"success": False, "error": str(exc)}
    finally:
        _progress["busy"] = False
        _lock.release()


def remove(ident):
    if not isinstance(ident, str) or not ID.fullmatch(ident):
        return {"success": False, "error": "Invalid theme ID"}
    if not _lock.acquire(blocking=False):
        return {"success": False, "error": "Another theme operation is running"}
    try:
        target = root() / ident
        if target.is_symlink():
            raise ValueError("Invalid theme directory")
        if target.is_dir():
            shutil.rmtree(target)
        return {"success": True}
    except Exception as exc:
        return {"success": False, "error": str(exc)}
    finally:
        _lock.release()


def recover():
    if not root().is_dir():
        return
    for staging in root().glob(".download-*"):
        if staging.is_dir() and not staging.is_symlink() and staging.resolve().parent == root().resolve():
            shutil.rmtree(staging)
    for backup in root().glob(".backup-*"):
        ident = backup.name[len(".backup-"):]
        if not ID.fullmatch(ident) or backup.is_symlink():
            continue
        target = root() / ident
        if target.exists():
            shutil.rmtree(backup)
        else:
            backup.rename(target)


def resource_roots():
    if not root().is_dir():
        return []
    return [p for p in sorted(root().iterdir(), key=lambda p: (p.name == "legacy-resources", p.name)) if ID.fullmatch(p.name) and p.is_dir()
            and not p.is_symlink() and (p / "installed.json").is_file()]


def local_inventory():
    migrate_legacy_resources()
    installed = {p.name: read_json(p / "installed.json").get("version", "") for p in resource_roots() if p.name != "legacy-resources"}
    bundled = Path(decky.DECKY_PLUGIN_DIR) / "defaults"
    if bundled.is_dir():
        local = read_json(Path(decky.DECKY_PLUGIN_DIR) / "theme-catalog.json")
        for pack in local.get("themes", []):
            files = pack.get("resources", [])
            if files and all((bundled / f).is_file() for f in files):
                installed.setdefault(pack["id"], "legacy")
    return installed


def migrate_legacy_resources():
    with _migration_lock:
        _migrate_legacy_resources()


def _migrate_legacy_resources():
    """Partition already-downloaded legacy files once, without a network request."""
    legacy = root() / "legacy-resources"
    if not legacy.is_dir() or legacy.is_symlink():
        return
    local = read_json(Path(decky.DECKY_PLUGIN_DIR) / "theme-catalog.json")
    if not local.get("themes"):
        return
    covered = set()
    for pack in local["themes"]:
        ident = pack["id"]
        files = pack.get("resources", [])
        if not ID.fullmatch(ident) or not files:
            continue
        for name in files:
            p = PurePosixPath(name)
            if p.is_absolute() or ".." in p.parts or "\\" in name:
                raise ValueError("Invalid legacy resource path")
        destination = root() / ident
        if not (destination / "installed.json").exists():
            for name in files:
                src = legacy / name
                if not src.is_file():
                    continue
                dst = destination / name
                dst.parent.mkdir(parents=True, exist_ok=True)
                if not dst.exists():
                    try:
                        os.link(src, dst)
                    except OSError:
                        shutil.copy2(src, dst)
            if any((destination / name).is_file() for name in files):
                (destination / "installed.json").write_text(json.dumps({"id": ident, "version": "legacy"}), encoding="utf-8")
        covered.update(files)
    # Keep unknown user additions and notices; they are never treated as a theme.
    for src in legacy.rglob("*"):
        if src.is_file():
            relative = src.relative_to(legacy).as_posix()
            if relative not in covered and relative != "installed.json":
                dst = Path(decky.DECKY_PLUGIN_SETTINGS_DIR) / "legacy-extras" / relative
                dst.parent.mkdir(parents=True, exist_ok=True)
                if not dst.exists():
                    shutil.copy2(src, dst)
    if legacy.resolve().parent != root().resolve():
        raise ValueError("Invalid migration directory")
    shutil.rmtree(legacy)


def resource(relative):
    """Downloaded resources take precedence over old bundled defaults."""
    p = PurePosixPath(relative)
    if p.is_absolute() or ".." in p.parts or "\\" in relative:
        raise ValueError("Invalid resource path")
    for base in resource_roots():
        candidate = base.joinpath(*p.parts)
        if candidate.exists():
            return str(candidate)
    return str(Path(decky.DECKY_PLUGIN_DIR) / "defaults" / relative)


def names(relative):
    found = set()
    for base in [Path(decky.DECKY_PLUGIN_DIR) / "defaults", *resource_roots()]:
        folder = base / relative
        if folder.is_dir():
            found.update(p.name for p in folder.iterdir())
    return sorted(found)
