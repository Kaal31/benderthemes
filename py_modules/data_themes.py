"""Data themes: folders with a theme.json manifest plus files (see docs/THEME-FORMAT.md).

Themes are looked up in two places:
  <plugin>/themes/<id>/            shipped with the plugin (examples, test themes)
  <runtime dir>/themes/<id>/       added by the user (community themes)
  <runtime dir>/themes/<name>.zip  the same, as a zip: unpacked (checked, with size limits)
                                   into <runtime dir>/themes/.unpacked/<name>/ by list_themes

Nothing here runs theme code. Files are only listed and served by the plugin's
local media server, under /<token>/t/<id>/<path>. Interface (frame) themes are
served with a Content-Security-Policy that seals them off (see frame_csp).
"""
import json
import os
from pathlib import PurePosixPath
import re
import shutil
import stat
import tempfile
import threading
import time
import zipfile

import decky

SCHEMA = 1
ID = re.compile(r"^[a-z0-9][a-z0-9:-]{0,63}$")
SEG = re.compile(r"^[\w .()&'+,-]+$")
MAX_MANIFEST = 64 * 1024
SLOT_FOLDERS = ("sounds", "music")
SLOT_FILES = ("wallpaper", "bootVideo", "launchVideo", "font")
ICON_EXT = (".png", ".svg", ".webp", ".gif")
ICON_NAME = re.compile(r"^[a-z0-9][a-z0-9-]{0,40}$")
MAX_ICONS = 300
AUDIO = (".wav", ".mp3", ".ogg", ".oga", ".flac", ".m4a", ".opus")
# The browser may load game art from these places only (Steam's own UI and CDNs).
ART_HOSTS = (
    "https://steamloopback.host",
    "https://cdn.cloudflare.steamstatic.com",
    "https://shared.cloudflare.steamstatic.com",
    "https://cdn.akamai.steamstatic.com",
    "https://shared.akamai.steamstatic.com",
    "https://cdn.fastly.steamstatic.com",
    "https://shared.fastly.steamstatic.com",
)


def user_root():
    return os.path.join(decky.DECKY_PLUGIN_RUNTIME_DIR, "themes")


def roots():
    plugin = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    return [
        ("bundled", os.path.join(plugin, "themes")),
        ("user", user_root()),
        # zips the user dropped into the themes folder, unpacked by unpack_zips()
        ("user", os.path.join(user_root(), UNPACKED)),
        ("user", os.path.join(user_root(), ".community", "current")),
    ]


# ───── theme zips ─────
UNPACKED = ".unpacked"
ZIP_MAX_BYTES = 256 * 1024 * 1024  # the .zip itself
ZIP_MAX_FILES = 2000
ZIP_MAX_TOTAL = 256 * 1024 * 1024  # everything unpacked
ZIP_MAX_FILE = 128 * 1024 * 1024  # one file (a boot video)
ZIP_MAX_RATIO = 200  # unpacked / packed, per file: refuses zip bombs
# what a theme may contain: pages, styles, scripts, data, pictures, fonts, sounds, videos, notices
ZIP_EXT = {
    ".html", ".htm", ".css", ".js", ".mjs", ".json", ".txt", ".md",
    ".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".avif", ".ico",
    ".woff", ".woff2", ".ttf", ".otf",
    ".wav", ".mp3", ".ogg", ".oga", ".opus", ".flac", ".m4a",
    ".mp4", ".webm", ".m4v",
}
ZIP_NOTICES = {"LICENSE", "LICENCE", "COPYING", "NOTICE", "AUTHORS", "CREDITS", "README"}
_unpack_lock = threading.Lock()
_zip_errors = {}  # zip name -> why it was refused (shown in Quick Access)


def _zip_plan(z, manifest_name="theme.json"):
    """The files of a theme zip as (info, parts inside the theme), or raises ValueError.
    theme.json may sit at the top of the zip or in one folder (how most zip tools pack a folder)."""
    entries = z.infolist()
    if len(entries) > ZIP_MAX_FILES:
        raise ValueError(f"more than {ZIP_MAX_FILES} files")
    files, total, seen = [], 0, set()
    for info in entries:
        name = info.filename
        p = PurePosixPath(name)
        mode = info.external_attr >> 16
        if (not p.parts or p.is_absolute() or "\\" in name or ":" in name or any(x in (".", "..") for x in p.parts)
                or stat.S_ISLNK(mode) or stat.S_IFMT(mode) not in (0, stat.S_IFREG, stat.S_IFDIR)):
            raise ValueError(f"unsafe path {name[:80]!r}")
        if info.is_dir() or p.parts[0] == "__MACOSX" or p.name in (".DS_Store", "Thumbs.db"):
            continue
        if any(x.startswith(".") for x in p.parts) or not all(SEG.match(x) for x in p.parts):
            raise ValueError(f"file name not allowed: {name[:80]!r}")
        if p.suffix.lower() not in ZIP_EXT and p.stem.upper() not in ZIP_NOTICES:
            raise ValueError(f"file type not allowed: {p.name[:60]!r}")
        if info.file_size > ZIP_MAX_FILE or info.file_size > max(info.compress_size, 1) * ZIP_MAX_RATIO + 4096:
            raise ValueError(f"file too large: {p.name[:60]!r}")
        if name.casefold() in seen:
            raise ValueError(f"duplicate file {name[:80]!r}")
        seen.add(name.casefold())
        total += info.file_size
        if total > ZIP_MAX_TOTAL:
            raise ValueError("unpacks to more than 256 MB")
        files.append((info, p.parts))
    tops = {parts[0] for _, parts in files}
    if any(parts == (manifest_name,) for _, parts in files):
        return files
    if len(tops) == 1 and any(parts[1:] == (manifest_name,) for _, parts in files):
        return [(info, parts[1:]) for info, parts in files]
    raise ValueError(f"no {manifest_name} at the top of the zip; publish a compiled theme ZIP, not plugin source")


def _unpack(zpath, dest):
    """Unpack one theme zip into dest (replaced only when the new copy is complete)."""
    if os.path.getsize(zpath) > ZIP_MAX_BYTES:
        raise ValueError("zip larger than 256 MB")
    parent = os.path.dirname(dest)
    os.makedirs(parent, exist_ok=True)
    tmp = tempfile.mkdtemp(prefix=".new-", dir=parent)
    try:
        with zipfile.ZipFile(zpath) as z:
            for info, parts in _zip_plan(z):
                target = os.path.join(tmp, *parts)
                os.makedirs(os.path.dirname(target), exist_ok=True)
                written = 0
                with z.open(info) as src, open(target, "wb") as out:
                    while True:
                        chunk = src.read(1 << 20)
                        if not chunk:
                            break
                        written += len(chunk)
                        if written > info.file_size:  # the header lied about the size
                            raise ValueError("file larger than its zip header says")
                        out.write(chunk)
        _read_manifest(tmp) or _bad_manifest()
        st = os.stat(zpath)
        with open(os.path.join(tmp, ".source"), "w", encoding="utf-8") as f:
            json.dump({"size": st.st_size, "mtime": st.st_mtime}, f)
        if os.path.isdir(dest):
            shutil.rmtree(dest)
        os.rename(tmp, dest)
    except BaseException:
        shutil.rmtree(tmp, ignore_errors=True)
        raise


def _bad_manifest():
    raise ValueError("theme.json is not a schema 1 manifest with a valid id")


def unpack_zips():
    """Unpack every new or changed <runtime>/themes/*.zip; drop copies of zips that are gone. Slow: call off the event loop."""
    root = user_root()
    if not os.path.isdir(root):
        return
    out = os.path.join(root, UNPACKED)
    zips = {}
    for n in sorted(os.listdir(root)):
        stem, ext = os.path.splitext(n)
        if ext.lower() == ".zip" and SEG.match(stem) and not stem.startswith(".") and os.path.isfile(os.path.join(root, n)):
            zips[stem] = os.path.join(root, n)
    if os.path.isdir(out):
        for n in os.listdir(out):
            if n not in zips:
                shutil.rmtree(os.path.join(out, n), ignore_errors=True)
    for stem, zpath in zips.items():
        dest = os.path.join(out, stem)
        try:
            st = os.stat(zpath)
            with open(os.path.join(dest, ".source"), encoding="utf-8") as f:
                stamp = json.load(f)
            if stamp.get("size") == st.st_size and stamp.get("mtime") == st.st_mtime:
                _zip_errors.pop(stem, None)
                continue
        except Exception:
            pass
        try:
            _unpack(zpath, dest)
            _zip_errors.pop(stem, None)
        except Exception as e:
            _zip_errors[stem] = str(e)[:200]
            shutil.rmtree(dest, ignore_errors=True)
            decky.logger.warning(f"theme zip {stem}.zip refused: {e}")


def import_file(path):
    """Copy a theme .zip the user picked (Quick Access → Add a theme) into the themes folder, after checking it."""
    if not isinstance(path, str) or not path.lower().endswith(".zip") or not os.path.isfile(path):
        return {"ok": False, "error": "Pick a .zip file"}
    if os.path.getsize(path) > ZIP_MAX_BYTES:
        return {"ok": False, "error": "The zip is larger than 256 MB"}
    stem = re.sub(r"[^\w .()&'+,-]+", "_", os.path.splitext(os.path.basename(path))[0]).strip(" .") or "theme"
    root = user_root()
    os.makedirs(root, exist_ok=True)
    check = tempfile.mkdtemp(prefix=".check-", dir=root)
    try:
        _unpack(path, os.path.join(check, "t"))
        manifest = _read_manifest(os.path.join(check, "t"))
    except Exception as e:
        return {"ok": False, "error": str(e)[:200]}
    finally:
        shutil.rmtree(check, ignore_errors=True)
    shutil.copyfile(path, os.path.join(root, stem + ".zip"))
    with _unpack_lock:
        unpack_zips()
    _cache.clear()
    return {"ok": True, "id": manifest["id"], "name": str(manifest.get("name", ""))[:64]}


def safe_path(rel):
    """A relative path inside a theme ('a/b.png'), or None."""
    if not isinstance(rel, str) or not rel or len(rel) > 300 or rel.startswith("/") or "\\" in rel:
        return None
    parts = rel.split("/")
    if any(not p or p.startswith(".") or not SEG.match(p) for p in parts):  # no hidden files (.source stamps, .git)
        return None
    return parts


def _read_manifest(folder):
    path = os.path.join(folder, "theme.json")
    if not os.path.isfile(path) or os.path.getsize(path) > MAX_MANIFEST:
        return None
    with open(path, "r", encoding="utf-8") as f:
        m = json.load(f)
    if not isinstance(m, dict) or m.get("schema") != SCHEMA or not isinstance(m.get("id"), str) or not ID.match(m["id"]):
        return None
    return m


_cache = {}
SCAN_TTL = 2.0  # seconds: every served file looks its theme up, so the folders aren't read again for each one


def _scan():
    """id -> (manifest, folder, source). A user theme with the same id replaces a bundled one."""
    hit = _cache.get("scan")
    if hit and time.monotonic() - hit[0] < SCAN_TTL:
        return hit[1]
    found = _scan_now()
    _cache["scan"] = (time.monotonic(), found)
    return found


def _scan_now():
    found = {}
    for source, root in roots():
        if not os.path.isdir(root):
            continue
        for entry in sorted(os.listdir(root)):
            folder = os.path.join(root, entry)
            if entry.startswith(".") or not os.path.isdir(folder):
                continue
            try:
                m = _read_manifest(folder)
            except Exception as e:
                decky.logger.warning(f"data theme {entry}: {e}")
                continue
            if m:
                found[m["id"]] = (m, os.path.realpath(folder), source)
    return found


def resolve(ident, rel):
    """Absolute path of a file inside theme `ident`, or None (never outside the theme folder)."""
    hit = _scan().get(ident)
    parts = safe_path(rel)
    if not parts:
        return None
    if not hit:
        # Native layouts have no data-theme manifest. Only explicitly listed media is exposed.
        import frame_media
        return frame_media.resolve(ident, "/".join(parts))
    folder = hit[1]
    path = os.path.realpath(os.path.join(folder, *parts))
    if not path.startswith(folder + os.sep):
        return None
    if os.path.isfile(path):
        return path
    if hit[2] == "bundled":
        import frame_media
        return frame_media.resolve(ident, "/".join(parts))
    return None


def _pack(folder, rel):
    parts = safe_path(rel)
    if not parts:
        return None
    d = os.path.realpath(os.path.join(folder, *parts))
    if not d.startswith(folder + os.sep) or not os.path.isdir(d):
        return None
    meta = {}
    pj = os.path.join(d, "pack.json")
    if os.path.isfile(pj):
        try:
            with open(pj, "r", encoding="utf-8") as f:
                meta = json.load(f)
        except Exception:
            meta = {}
    files = sorted(n for n in os.listdir(d) if n.lower().endswith(AUDIO) and SEG.match(n))
    return {"files": files, "mappings": meta.get("mappings") or {}, "ignore": meta.get("ignore") or []}


def _icons(folder, rel):
    """The icons slot: a folder of pictures named after the spot they fill (gear.svg, store.png, moon.png...)."""
    parts = safe_path(rel)
    if not parts:
        return None
    d = os.path.realpath(os.path.join(folder, *parts))
    if not d.startswith(folder + os.sep) or not os.path.isdir(d):
        return None
    out = {}
    for n in sorted(os.listdir(d)):
        stem, ext = os.path.splitext(n)
        if ext.lower() in ICON_EXT and ICON_NAME.match(stem) and stem not in out and os.path.isfile(os.path.join(d, n)):
            out[stem] = "/".join(parts + [n])
            if len(out) >= MAX_ICONS:
                break
    return out


def zip_errors():
    """Theme zips that were refused, and why."""
    return [{"file": f"{k}.zip", "error": v} for k, v in sorted(_zip_errors.items())]


def list_themes():
    """Manifests as the frontend needs them; the frontend validates them again."""
    with _unpack_lock:
        unpack_zips()
    _cache.clear()
    out = []
    for ident, (m, folder, source) in _scan().items():
        entry = dict(m)
        if entry.get("layout") == "native":
            # Downloaded/local manifests cannot grant themselves native execution.
            approved = False
            managed = os.path.realpath(os.path.join(user_root(), ".community", "current"))
            if os.path.dirname(folder) == managed:
                try:
                    with open(os.path.join(folder, ".install.json"), encoding="utf-8") as f:
                        install = json.load(f)
                    approved = (install.get("themeId") == ident and bool(install.get("nativeSha256"))
                                and install.get("nativeSha256") == entry.get("nativeSha256"))
                except (OSError, ValueError, AttributeError):
                    pass
            entry["nativeInstalled"] = approved
        entry["source"] = source
        packs = {}
        for slot in SLOT_FOLDERS:
            rel = (m.get("slots") or {}).get(slot)
            p = _pack(folder, rel) if rel else None
            if rel and source == "bundled":
                import frame_media
                prefix = rel.rstrip("/") + "/"
                files = [name[len(prefix):] for name in frame_media.catalog().get(ident, {}).get("files", [])
                         if name.startswith(prefix) and "/" not in name[len(prefix):]
                         and name.lower().endswith(AUDIO) and frame_media.resolve(ident, name)]
                if files:
                    p = {**(p or {"mappings": {}, "ignore": []}), "files": sorted(set((p or {}).get("files", []) + files))}
            if p:
                packs[slot] = p
        entry["packs"] = packs
        rel = (m.get("slots") or {}).get("icons")
        icons = _icons(folder, rel) if rel else None
        if icons:
            entry["icons"] = icons
        out.append(entry)
    return out


# The page FrameHome actually opens: a small page of ours that holds the theme's page in a second sandboxed
# frame and passes messages through. Its frame-src lets that inner frame show only the theme's own folder, so
# an interface can't send the library away by navigating itself to another address (connect-src doesn't cover
# navigation). The same page is built by preview/server.mjs (frameWrapper) for the browser preview.
WRAPPER = """<!doctype html><html><head><meta charset="utf-8"><meta name="referrer" content="no-referrer">
<style>html,body{margin:0;height:100%;background:#000;overflow:hidden}iframe{position:absolute;inset:0;width:100%;height:100%;border:0}</style></head>
<body><iframe sandbox="allow-scripts" referrerpolicy="no-referrer" allow="" src="__SRC__"></iframe><script>
(function(){var f=document.querySelector("iframe");
addEventListener("message",function(e){if(e.source===parent){f.contentWindow&&f.contentWindow.postMessage(e.data,"*");}else if(f.contentWindow&&e.source===f.contentWindow){parent.postMessage(e.data,"*");}});
})();</script></body></html>"""


def frame_wrapper(origin, ident, entry):
    """(html, csp) of the wrapper page for theme `ident`'s interface `entry` (already checked with resolve)."""
    from urllib.parse import quote
    own = f"{origin}/t/{quote(ident, safe='')}/"
    src = own + "/".join(quote(p, safe="") for p in entry.split("/"))
    html = WRAPPER.replace("__SRC__", src.replace("&", "&amp;").replace('"', "&quot;"))
    csp = "; ".join([
        "sandbox allow-scripts",
        "default-src 'none'",
        "script-src 'unsafe-inline'",
        "style-src 'unsafe-inline'",
        f"frame-src {own}",
        "connect-src 'none'",
        "form-action 'none'",
        "base-uri 'none'",
    ])
    return html, csp


def frame_csp(origin, ident):
    """The policy a community interface runs under: no network, nothing outside its own folder and Steam's art."""
    own = f"{origin}/t/{ident}/"
    themes = f"{origin}/t/"  # pictures, sounds and fonts of any data theme (for mix and match)
    art = " ".join(ART_HOSTS)
    return "; ".join([
        "sandbox allow-scripts",
        "default-src 'none'",
        f"script-src {own} 'unsafe-inline'",
        f"style-src {own} 'unsafe-inline'",
        f"img-src {themes} {art} data: blob:",
        f"media-src {themes} blob:" + (f" {origin}/f/" if ident == "blue-glass" else ""),
        f"font-src {themes} data:",
        f"connect-src {origin}/r/" if ident == "blue-glass" else "connect-src 'none'",
        "frame-src 'none'",
        "worker-src 'none'",
        "form-action 'none'",
        "base-uri 'none'",
    ])
