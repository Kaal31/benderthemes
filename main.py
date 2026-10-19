"""ThemeHub backend.

Settings storage, plus readers for user-supplied files that live on the Deck:
  * AudioLoader sound packs  (~/homebrew/sounds/<pack>/pack.json)
  * wallpapers               (<data>/wallpapers/*.png|jpg|webp)
  * PS3 .p3t themes           (<data>/skins/p3t/*.p3t)
  * PS Vita custom themes     (<data>/skins/vita/<folder or .zip> with theme.xml)
  * PSP themes                (<data>/skins/psp/*.ptf|*.ctf)
  * Wii U Menu themes         (<data>/skins/wiiu/*.utheme, + the user's own menu files)
  * Nintendo Switch themes    (<data>/skins/switch/*.nxtheme, also one folder level down)
Nothing from these files ships with the plugin; they are read at runtime.
"""
try:
    import base64

    def _b64(raw: bytes) -> str:
        return base64.b64encode(raw).decode("ascii")
except Exception:  # pragma: no cover
    import binascii

    def _b64(raw: bytes) -> str:
        return binascii.b2a_base64(raw, newline=False).decode("ascii")
import io
import json
import os
import pathlib
import shutil
import struct
try:  # Decky ships a trimmed Python; never let one missing module stop the backend
    import zipfile
except Exception:  # pragma: no cover
    zipfile = None
import zlib
import re
import asyncio
import subprocess
import tempfile
import threading
import time
try:
    import secrets
except Exception:  # pragma: no cover
    secrets = None

import decky

IMAGE_EXT = (".png", ".jpg", ".jpeg", ".webp", ".gif")
WALLPAPER_VIDEO_EXT = (".mp4", ".webm")


def _settings_path() -> str:
    return os.path.join(decky.DECKY_PLUGIN_SETTINGS_DIR, "settings.json")


def _data_dir() -> str:
    return decky.DECKY_PLUGIN_RUNTIME_DIR


def _wall_dir() -> str:
    return os.path.join(_data_dir(), "wallpapers")


def _skin_dir() -> str:
    return os.path.join(_data_dir(), "skins")


def _bundled_dir(kind: str) -> str:
    # Optional extras shipped inside the plugin zip (test builds): <plugin>/defaults/skins/<kind>
    return _resource("skins/" + kind)


def _resource(relative: str) -> str:
    import theme_store
    return theme_store.resource(relative)


def _resource_names(relative: str):
    import theme_store
    return theme_store.names(relative)


def _user_resource(folder, name, relative):
    path = os.path.join(folder, _safe_name(name))
    return path if os.path.exists(path) else _resource(relative + "/" + _safe_name(name))


def _skin_entries(kind: str):
    """[(name, path)] of skins/<kind>: the user's own files plus the read-only ones shipped in the plugin
    (defaults/skins/<kind>, e.g. a test build's themes) or a downloaded pack. The user's file of the same name wins.
    Bundled files are only read, never copied or written."""
    user = os.path.join(_skin_dir(), kind)
    try:
        names = set(os.listdir(user))
    except OSError:
        names = set()
    names |= set(_resource_names("skins/" + kind))
    return [(n, _user_resource(user, n, "skins/" + kind)) for n in sorted(names) if not n.startswith(".")]


def _skin_path(kind: str, name: str) -> str:
    """Path of one skins/<kind> entry: the user's own file, else the bundled one."""
    return _user_resource(os.path.join(_skin_dir(), kind), name, "skins/" + kind)


def _sounds_dir() -> str:
    return os.path.join(decky.DECKY_HOME, "sounds")


def _steamui_dir() -> str:
    for p in (
        os.path.join(decky.DECKY_USER_HOME, ".local/share/Steam/steamui"),
        os.path.join(decky.DECKY_USER_HOME, ".steam/steam/steamui"),
    ):
        if os.path.isdir(p):
            return p
    return ""


def _mime(name: str) -> str:
    n = name.lower()
    if n.endswith(".mp4"):
        return "video/mp4"
    if n.endswith(".png"):
        return "image/png"
    if n.endswith(".webp"):
        return "image/webp"
    if n.endswith(".gif"):
        return "image/gif"
    return "image/jpeg"


def _data_url(raw: bytes, mime: str) -> str:
    return f"data:{mime};base64," + _b64(raw)


def _safe_name(name: str) -> str:
    # Only plain file names inside our folders.
    return os.path.basename(name or "")


# ───────────── PNG writer (no third-party libs on the Deck) ─────────────
def _png(w: int, h: int, rgba: bytes) -> bytes:
    stride = w * 4
    raw = b"".join(b"\0" + rgba[y * stride:(y + 1) * stride] for y in range(h))

    def chunk(t: bytes, data: bytes) -> bytes:
        c = struct.pack(">I", len(data)) + t + data
        return c + struct.pack(">I", zlib.crc32(t + data) & 0xFFFFFFFF)

    return (
        b"\x89PNG\r\n\x1a\n"
        + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0))
        + chunk(b"IDAT", zlib.compress(raw, 6))
        + chunk(b"IEND", b"")
    )


# ───────────── GIM textures (used for .p3t icons) ─────────────
def _gim_to_png(b: bytes):
    import console_themes
    try:
        return console_themes.gim_png(b, 1)
    except Exception:
        return None


# ───────────── .p3t (PS3 theme) reader ─────────────
def _read_p3t(path: str):
    with open(path, "rb") as f:
        d = f.read()
    if d[:4] != b"P3TF" or len(d) < 56:
        return None
    (_, _, tree_off, _, id_off, _, str_off, _, _, _, _, _, file_off, _) = struct.unpack(">4s13I", d[:56])

    def cstr(off):
        e = d.index(b"\0", off)
        return d[off:e].decode("latin1")

    nodes = []

    def elem(o):
        if len(nodes) > 100000:
            raise ValueError("p3t tree too large (loop?)")
        p = tree_off + o
        name, nattr, _, _, nxt, fc, _ = struct.unpack(">7i", d[p:p + 28])
        attrs = {}
        for i in range(nattr):
            a = p + 28 + i * 16
            an, at, v1, v2 = struct.unpack(">4i", d[a:a + 16])
            key = cstr(str_off + an)
            if at == 1:
                attrs[key] = v1
            elif at == 3:
                attrs[key] = cstr(str_off + v1)
            elif at == 6:
                attrs[key] = ("file", v1, v2)
            elif at in (7, 8):
                attrs[key] = cstr(id_off + v1 + 4)
        nodes.append((cstr(str_off + name), attrs))
        c = fc
        while c != -1:
            c = elem(c)
        return nxt

    elem(0)

    def blob(ref, size=None):
        _, off, ln = ref
        raw = d[file_off + off:file_off + off + ln]
        if size and size != ln:
            try:
                raw = zlib.decompress(raw)
            except Exception:
                pass
        return raw

    def image(ref, size=None):
        raw = blob(ref, size)
        if raw[:3] == b"\xff\xd8\xff":
            return _data_url(raw, "image/jpeg")
        if raw[:8] == b"\x89PNG\r\n\x1a\n":
            return _data_url(raw, "image/png")
        if raw[:4] in (b".GIM", b"MIG."):
            png = _gim_to_png(raw)
            return _data_url(png, "image/png") if png else None
        return None

    def image_raw(ref, size=None):
        """(file extension, bytes) of a picture, GIM converted to PNG; None if it isn't one."""
        raw = blob(ref, size)
        if raw[:3] == b"\xff\xd8\xff":
            return "jpg", raw
        if raw[:8] == b"\x89PNG\r\n\x1a\n":
            return "png", raw
        if raw[:4] in (b".GIM", b"MIG."):
            png = _gim_to_png(raw)
            return ("png", png) if png else None
        return None

    name = os.path.basename(path)
    icons = {}
    backgrounds = []
    bgraw = []  # every picture of a slideshow theme (static pictures, no .raf), as (extension, bytes)
    bgseen = set()
    visuals = {}
    raf = []
    look = {}
    author = ""
    for tag, a in nodes:
        try:
            if tag == "color" and isinstance(a.get("selection"), int):  # the theme's XMB colour setting
                look["color"] = a["selection"]
            elif tag == "font" and isinstance(a.get("selection"), int):  # the theme's font style setting (1–4)
                look["font"] = a["selection"]
            elif tag == "info" and isinstance(a.get("author"), str):
                author = a["author"]
            if tag == "info" and isinstance(a.get("name"), str):
                name = a["name"]
            elif tag == "icon" and "src" in a and "id" in a:
                url = image(a["src"], a.get("size"))
                if url:
                    icons[a["id"]] = url
            elif tag == "bgimage" and isinstance(a.get("anim"), tuple) and not raf:
                _, off, ln = a["anim"]
                raf.append((file_off + off, ln))
            elif tag == "bgimage":
                ref = a.get("hd") or a.get("sd")
                if ref and (ref[1], ref[2]) not in bgseen:
                    bgseen.add((ref[1], ref[2]))
                    if not backgrounds:
                        url = image(ref, a.get("size"))
                        if url:
                            backgrounds.append(url)
                    if len(bgraw) < 12:
                        pic = image_raw(ref, a.get("size"))
                        if pic:
                            bgraw.append(pic)
            elif tag == "notification" and "src" in a and "notice" not in visuals:  # the picture of the PS3's notification box
                url = image(a["src"], a.get("size"))
                if url:
                    visuals["notice"] = url
        except Exception as e:  # one broken entry shouldn't sink the theme
            decky.logger.warning(f"p3t entry {tag} failed: {e}")
    sounds = {}
    try:
        import console_themes
        sounds = console_themes.p3t_sounds(d, nodes, lambda ref: blob(ref))
    except Exception as e:
        decky.logger.warning(f"p3t sounds failed: {e}")
    return {"name": name, "author": author, "look": look, "backgrounds": backgrounds[:1], "icons": icons, "visuals": visuals, "_raf": raf[0] if raf else None, "_bgraw": bgraw if len(bgraw) > 1 and not raf else None, "_sounds": sounds}


_P3T_READER = 2  # bump when _read_p3t's output changes: cached reads are made again


def _pickle_cached(subfolder: str, key_text: str, make, keep: int = 12, store=None):
    """make(), remembered on disk as a pickle named by the hash of key_text (the `keep` newest are kept).
    A cache file that can't be read is rebuilt and overwritten; a result of None is never stored,
    nor one that store(result) (when given) rejects."""
    import hashlib, pickle, uuid
    cache = folder = None
    try:
        key = hashlib.sha1(key_text.encode("utf-8", "surrogateescape")).hexdigest()[:20]
        folder = os.path.join(_cache_root(), subfolder)
        cache = os.path.join(folder, key + ".pkl")
        if os.path.isfile(cache):
            try:
                with open(cache, "rb") as f:
                    return pickle.load(f)
            except Exception:
                pass  # corrupt: rebuilt below and overwritten
    except Exception:
        cache = None
    r = make()
    if r is not None and cache and (store is None or store(r)):
        try:
            os.makedirs(folder, exist_ok=True)
            tmp = f"{cache}.{uuid.uuid4().hex[:8]}.tmp"  # unique, so two threads never share a temp file
            with open(tmp, "wb") as f:
                pickle.dump(r, f, protocol=4)
            os.replace(tmp, cache)
            olds = sorted((os.path.join(folder, n) for n in os.listdir(folder) if n.endswith(".pkl")), key=os.path.getmtime, reverse=True)
            for o in olds[keep:]:
                os.remove(o)
        except Exception:
            pass
    return r


def _read_p3t_cached(path: str):
    """_read_p3t, remembered on disk (keyed by file, size, time and reader version)."""
    try:
        import console_themes
        st = os.stat(path)
        text = f"{os.path.realpath(path)}|{st.st_size}|{st.st_mtime_ns}|{_P3T_READER}|{getattr(console_themes, 'READER_VERSION', 0)}"
    except Exception:
        return _read_p3t(path)
    return _pickle_cached("p3tskin", text, lambda: _read_p3t(path))


def _p3t_static_slides(path: str, pics):
    """(cache key, file names): the pictures of a slideshow theme without a .raf, written once into the cache."""
    key = _skin_key(path)
    folder = os.path.join(_cache_root(), key)
    os.makedirs(folder, exist_ok=True)
    names = []
    for i, (ext, data) in enumerate(pics):
        n = f"bg{i:02d}.{ext}"
        out = os.path.join(folder, n)
        if not (os.path.isfile(out) and os.path.getsize(out) == len(data)):
            with open(out + ".tmp", "wb") as f:
                f.write(data)
            os.replace(out + ".tmp", out)
        names.append(n)
    return key, names


# ───────────── extracted theme extras (slideshows, sound packs) ─────────────
def _cache_root() -> str:
    return os.path.join(_data_dir(), "theme-cache")


def _theme_sound_root() -> str:
    return os.path.join(_data_dir(), "theme-sounds")


def _skin_key(path: str) -> str:
    import hashlib
    st = os.stat(path)
    return hashlib.sha1(f"{os.path.basename(path)}|{st.st_size}|{int(st.st_mtime)}".encode("utf-8", "replace")).hexdigest()[:16]


_slide_jobs = set()


def _decode_slides(folder: str, textures, key: str):
    import console_themes
    try:
        os.makedirs(folder, exist_ok=True)
        for i, g in enumerate(textures):
            out = os.path.join(folder, f"slide{i:02d}.png")
            if os.path.isfile(out):
                continue
            p = console_themes.gtf_png(g)
            if p:
                with open(out + ".tmp", "wb") as f:
                    f.write(p)
                os.replace(out + ".tmp", out)
        with open(os.path.join(folder, "count"), "w") as f:
            f.write(str(len(textures)))
    except Exception as e:
        decky.logger.error(f"slideshow decode failed: {e}")
    finally:
        _slide_jobs.discard(key)


def _p3t_slides(path: str, raf):
    """(cache key, image count). Images are decoded once, in the background, into the cache."""
    key = _skin_key(path)
    folder = os.path.join(_cache_root(), key)
    try:
        with open(os.path.join(folder, "count")) as f:
            return key, int(f.read().strip() or 0)
    except Exception:
        pass
    import console_themes
    with open(path, "rb") as f:
        f.seek(raf[0])
        textures = console_themes.raf_textures(f.read(raf[1]))
    if textures and key not in _slide_jobs:
        _slide_jobs.add(key)
        threading.Thread(target=_decode_slides, args=(folder, textures, key), daemon=True).start()
    return key, len(textures)


_scene_jobs = set()
_SCENE_FILE = "scene5.json"  # bump when the scene format changes


def _build_p3t_scene(path: str, raf, folder: str, key: str):
    """PS3 dynamic theme → cache/<key>/scene3.json + one raw .bin per GTF texture (first mip),
    so the frontend never waits on Python texture decoding and later loads are instant."""
    import base64
    import json
    import console_themes
    import ps3_raf
    try:
        os.makedirs(folder, exist_ok=True)
        with open(path, "rb") as f:
            f.seek(raf[0])
            blob = f.read(raf[1])
        scene = ps3_raf.read_raf(blob, console_themes._xml_tree, console_themes.gtf_png, _data_url, raw_textures=True)
        if not scene or not scene.get("actors"):
            scene = {"actors": []}
        for i, t in enumerate(scene.get("textures", {}).values()):
            data = t.pop("data", None)
            if data:
                name = f"tex{i:03d}.bin"
                with open(os.path.join(folder, name + ".tmp"), "wb") as f:
                    f.write(base64.b64decode(data))
                os.replace(os.path.join(folder, name + ".tmp"), os.path.join(folder, name))
                t["bin"] = name
        out = os.path.join(folder, _SCENE_FILE)
        with open(out + ".tmp", "w") as f:
            json.dump(scene, f, separators=(",", ":"))
        os.replace(out + ".tmp", out)
    except Exception as e:
        decky.logger.error(f"p3t scene build failed: {e}")
    finally:
        _scene_jobs.discard(key)


def _p3t_scene(path: str, raf):
    """(cache key, ready). The dynamic scene is built once, in the background, into the cache."""
    key = _skin_key(path)
    folder = os.path.join(_cache_root(), key)
    if os.path.isfile(os.path.join(folder, _SCENE_FILE)):
        return key, True
    if key not in _scene_jobs:
        _scene_jobs.add(key)
        threading.Thread(target=_build_p3t_scene, args=(path, raf, folder, key), daemon=True).start()
    return key, False


SOUND_EXT = (".ogg", ".mp3", ".wav", ".m4a", ".at3")


def _decode_at3(src: str, out: str) -> bool:
    """ATRAC3plus (.at3) → WAV with the music decoder (vgmstream), or a system ffmpeg if there is one."""
    tools = []
    if _vgm_ready():
        tools.append([_vgm_path(), "-o", out, src])
    ff = shutil.which("ffmpeg")
    if ff:
        tools.append([ff, "-v", "error", "-y", "-i", src, out])
    for cmd in tools:
        try:
            subprocess.run(cmd, capture_output=True, timeout=60)
            if os.path.isfile(out) and os.path.getsize(out) > 256:
                return True
        except Exception:
            pass
    return False


def _can_decode_at3() -> bool:
    return _vgm_ready() or bool(shutil.which("ffmpeg"))


def _psp_boot_sounds(path: str, embedded: dict) -> dict:
    """Boot ("coldboot") and game-start ("gameboot") sounds for a PSP theme, cached for the UI.
    From the theme file itself, else from files you put beside it: "<theme name>.coldboot.ogg",
    "<theme name>.gameboot.ogg" (or for every theme: "coldboot.ogg" / "gameboot.ogg"); .mp3, .wav,
    .m4a and .at3 work too (.at3 needs the music decoder). A theme's boot clip (GAMEBOOT.PMF) brings
    its own game-start sound."""
    key = _skin_key(path)
    folder = os.path.join(_cache_root(), key)
    stem, here = os.path.splitext(os.path.basename(path))[0], os.path.dirname(path)
    files, needs = {}, False
    for kind in ("coldboot", "gameboot"):
        src, ext = None, None
        for name in [f"{stem}.{kind}", kind]:
            for e in SOUND_EXT:
                if os.path.isfile(os.path.join(here, name + e)):
                    src, ext = os.path.join(here, name + e), e
                    break
            if src:
                break
        data = None
        if not src and embedded.get(kind):
            data, ext = embedded[kind], ".at3"
        if not src and data is None:
            continue
        out_ext = ".wav" if ext == ".at3" else ext
        out = os.path.join(folder, kind + out_ext)
        if not os.path.isfile(out) or (src and os.path.getmtime(src) > os.path.getmtime(out)):
            os.makedirs(folder, exist_ok=True)
            if ext != ".at3":
                shutil.copyfile(src, out + ".tmp")
                os.replace(out + ".tmp", out)
            elif _can_decode_at3():
                with tempfile.TemporaryDirectory(dir=folder) as tmp:
                    at3 = os.path.join(tmp, kind + ".at3")
                    if data is not None:
                        with open(at3, "wb") as f:
                            f.write(data)
                    else:
                        shutil.copyfile(src, at3)
                    wav = os.path.join(tmp, kind + ".wav")
                    if not _decode_at3(at3, wav):
                        continue
                    os.replace(wav, out)
            else:
                needs = True
                continue
        files[kind] = kind + out_ext
    return {"key": key, "files": files, "needsDecoder": needs}


def _psp_gameboot(path: str, pmf: bytes):
    """Theme's game-launch clip (GAMEBOOT.PMF), remuxed once into an MP4 in the cache."""
    key = _skin_key(path)
    folder = os.path.join(_cache_root(), key)
    out = os.path.join(folder, "gameboot.mp4")
    if os.path.isfile(out):
        return key
    import psp_movie
    mp4 = psp_movie.pmf_to_mp4(pmf)
    if not mp4:
        return None
    os.makedirs(folder, exist_ok=True)
    with open(out + ".tmp", "wb") as f:
        f.write(mp4)
    os.replace(out + ".tmp", out)
    return key


# ───────── music decoder (vgmstream), downloaded only when the user asks ─────────
VGM_RELEASES = "https://api.github.com/repos/vgmstream/vgmstream/releases/latest"
VGM_ASSET = "vgmstream-linux.zip"


def _tools_dir() -> str:
    return os.path.join(_data_dir(), "tools")


def _vgm_path() -> str:
    return os.path.join(_tools_dir(), "vgmstream-cli")


def _vgm_version(path: str) -> str:
    try:
        out = subprocess.run([path, "-V"], capture_output=True, timeout=15).stdout
        return str(json.loads(out.decode("utf-8", "replace")).get("version") or "")
    except Exception:
        return ""


def _vgm_ready() -> bool:
    return os.path.isfile(_vgm_path()) and os.access(_vgm_path(), os.X_OK)


def _install_vgmstream():
    from urllib.request import Request
    from theme_network import urlopen
    headers = {"User-Agent": "DeckHomeThemes/music-decoder", "Accept": "application/vnd.github+json"}
    with urlopen(Request(VGM_RELEASES, headers=headers), timeout=20) as r:
        rel = json.loads(r.read(2 * 1024 * 1024))
    asset = next((a for a in rel.get("assets", []) if a.get("name") == VGM_ASSET), None)
    if not asset or not asset.get("browser_download_url", "").startswith("https://github.com/vgmstream/vgmstream/releases/download/"):
        raise ValueError("vgmstream release has no Linux build")
    size = int(asset.get("size") or 0)
    if not 0 < size <= 64 * 1024 * 1024:
        raise ValueError("unexpected download size")
    os.makedirs(_tools_dir(), exist_ok=True)
    with tempfile.TemporaryDirectory(dir=_tools_dir()) as tmp:
        zpath = os.path.join(tmp, VGM_ASSET)
        got = 0
        with urlopen(Request(asset["browser_download_url"], headers={"User-Agent": headers["User-Agent"]}), timeout=60) as r, open(zpath, "wb") as f:
            while True:
                chunk = r.read(262144)
                if not chunk:
                    break
                got += len(chunk)
                if got > size:
                    raise ValueError("download larger than announced")
                f.write(chunk)
        if got != size:
            raise ValueError("incomplete download")
        with zipfile.ZipFile(zpath) as z:
            member = next((n for n in z.namelist() if os.path.basename(n) == "vgmstream-cli"), None)
            if not member:
                raise ValueError("vgmstream-cli missing from archive")
            exe = os.path.join(tmp, "vgmstream-cli")
            with z.open(member) as src, open(exe, "wb") as dst:
                shutil.copyfileobj(src, dst)
        os.chmod(exe, 0o755)
        version = _vgm_version(exe)
        if not version:
            raise ValueError("downloaded decoder does not run on this system")
        os.replace(exe, _vgm_path())
    return {"installed": True, "version": version}


def _theme_music_pack(label: str, bgm) -> dict:
    """Decode a Vita theme's ATRAC9 music once into a music pack. {} when there is none."""
    if not bgm:
        return {}
    folder = "Theme - " + (re.sub(r"[^\w.-]+", "_", os.path.splitext(label)[0]).strip("_")[:60] or "music")
    full = os.path.join(_theme_sound_root(), folder)
    music = os.path.join(full, "menu_music.wav")
    if os.path.isfile(os.path.join(full, "menu_music.ogg")):
        return {"musicPack": folder}
    if os.path.isfile(music):
        return {"musicPack": folder, "musicNeedsCompress": True}
    if not _vgm_ready():
        return {"musicNeedsDecoder": True}
    os.makedirs(full, exist_ok=True)
    with tempfile.TemporaryDirectory(dir=full) as tmp:
        src = os.path.join(tmp, "bgm.at9")
        out = os.path.join(tmp, "menu_music.wav")
        with open(src, "wb") as f:
            f.write(bgm)
        subprocess.run([_vgm_path(), "-i", "-o", out, src], capture_output=True, timeout=120)
        if not os.path.isfile(out) or os.path.getsize(out) < 1024:
            raise ValueError("music could not be decoded")
        os.replace(out, music)
    compact = _ffmpeg_ogg(music, os.path.join(full, "menu_music.ogg"))
    pj = os.path.join(full, "pack.json")
    if not os.path.isfile(pj):
        with open(pj, "w", encoding="utf-8") as f:
            json.dump({"name": f"{os.path.splitext(label)[0]} (theme music)", "author": "theme file", "music": True, "mappings": {}, "ignore": []}, f)
    return {"musicPack": folder} if compact else {"musicPack": folder, "musicNeedsCompress": True}


def _ffmpeg_ogg(wav: str, ogg: str) -> bool:
    """Uses a system ffmpeg when one is installed (not part of stock SteamOS)."""
    ff = shutil.which("ffmpeg")
    if not ff:
        return False
    for codec in (["-c:a", "libopus", "-b:a", "128k"], ["-c:a", "libvorbis", "-q:a", "4"]):
        tmp = ogg + ".tmp.ogg"
        try:
            r = subprocess.run([ff, "-v", "error", "-y", "-i", wav, *codec, tmp], capture_output=True, timeout=180)
            if r.returncode == 0 and os.path.getsize(tmp) > 1024:
                os.replace(tmp, ogg)
                os.remove(wav)
                return True
        except Exception:
            pass
        try:
            os.remove(tmp)
        except OSError:
            pass
    return False


def _store_theme_music(folder: str, b64: str) -> bool:
    """Saves Ogg Opus encoded by the UI next to (and instead of) the decoded WAV."""
    root = os.path.realpath(_theme_sound_root())
    full = os.path.realpath(os.path.join(root, folder))
    if not folder or os.sep in folder or "/" in folder or not full.startswith(root + os.sep) or not os.path.isdir(full):
        return False
    raw = base64.b64decode(b64 or "")
    if raw[:4] != b"OggS" or b"OpusHead" not in raw[:200] or not 1024 < len(raw) <= 32 * 1024 * 1024:
        return False
    ogg = os.path.join(full, "menu_music.ogg")
    with open(ogg + ".tmp", "wb") as f:
        f.write(raw)
    os.replace(ogg + ".tmp", ogg)
    try:
        os.remove(os.path.join(full, "menu_music.wav"))
    except OSError:
        pass
    return True


def _theme_sound_pack(label: str, cues) -> str:
    """Writes the theme's sounds as a pack once; returns its folder name or ""."""
    if not cues:
        return ""
    import console_themes
    folder = "Theme - " + (re.sub(r"[^\w.-]+", "_", os.path.splitext(label)[0]).strip("_")[:60] or "sounds")
    full = os.path.join(_theme_sound_root(), folder)
    try:
        with open(os.path.join(full, "pack.json"), encoding="utf-8") as f:
            current = json.load(f).get("dhtVersion", 1) >= console_themes.SOUND_PACK_VERSION
    except Exception:
        current = False
    if not current:
        if not console_themes.write_sound_pack(full, f"{os.path.splitext(label)[0]} (theme sounds)", cues):
            return ""
    return folder


# ───────────── PS Vita custom theme reader ─────────────
VITA_ICON_KEYS = ["browser", "calendar", "camera", "email", "friend", "hostCollabo", "message", "music", "near", "parental", "party", "ps3Link", "ps4Link", "power", "settings", "trophy", "video"]


def _argb_to_css(v: str):
    v = (v or "").strip()
    if len(v) != 8:
        return None
    try:
        a, r, g, b = (int(v[i:i + 2], 16) for i in (0, 2, 4, 6))
        return f"rgba({r},{g},{b},{a / 255:.3f})"
    except ValueError:
        return None


def _read_vita(path: str):
    if os.path.isdir(path):
        base = path

        def read(rel):
            p = os.path.normpath(os.path.join(base, rel))
            if not p.startswith(os.path.normpath(base)) or not os.path.isfile(p):
                return None
            with open(p, "rb") as f:
                return f.read()
    elif zipfile is not None and zipfile.is_zipfile(path):
        z = zipfile.ZipFile(path)
        names = {n.lower(): n for n in z.namelist()}
        xml_name = next((n for n in z.namelist() if n.lower().endswith("theme.xml")), None)
        prefix = xml_name[: -len("theme.xml")] if xml_name else ""

        def read(rel):
            n = names.get((prefix + rel).lower()) or names.get(rel.lower())
            return z.read(n) if n else None
    else:
        return None
    xml_raw = read("theme.xml")
    if not xml_raw:
        return None
    # Decky's Python has no xml.etree, and theme.xml is simple: read it with regexes.
    xml = re.sub(r"<!--.*?-->", "", xml_raw.decode("utf-8", "replace"), flags=re.S)

    def block(tag, text):
        m = re.search(rf"<{tag}\b[^>]*>(.*?)</{tag}>", text, re.S)
        return m.group(1) if m else ""

    def value(tag, text):
        m = re.search(rf"<{tag}>\s*([^<]*?)\s*</{tag}>", text, re.S)
        return m.group(1).strip() if m else ""

    def url_of(rel):
        if not rel:
            return None
        raw = read(rel.strip())
        return _data_url(raw, _mime(rel)) if raw else None

    name = value("m_default", block("m_title", block("InfomationProperty", xml))) or os.path.basename(path)
    home = block("HomeProperty", xml)
    pages = []
    for rel in re.findall(r"<m_imageFilePath>\s*([^<]+?)\s*</m_imageFilePath>", block("m_bgParam", home) or home):
        u = url_of(rel)
        if u:
            pages.append(u)
    icons = {}
    for key in VITA_ICON_KEYS:
        rel = value("m_iconFilePath", block(f"m_{key}", home))
        u = url_of(rel)
        if u:
            icons[key] = u
    # Icons a theme ships by conventional file name but doesn't list in theme.xml.
    for key, fname in (("store", "icon_store.png"), ("welcome", "icon_welcome.png"), ("maps", "icon_maps.png"), ("trophy", "icon_trophies.png")):
        if key not in icons:
            u = url_of(fname)
            if u:
                icons[key] = u
    info_bar = block("InfomationBarProperty", xml)
    bar = _argb_to_css(value("m_barColor", info_bar))
    # Lock (start) screen and per-page label colours.
    start = block("StartScreenProperty", xml)
    lock = url_of(value("m_filePath", start))
    try:
        layout = int(value("m_dateLayout", start) or 0)
    except ValueError:
        layout = 0
    params = re.findall(r"<BackgroundParam>(.*?)</BackgroundParam>", block("m_bgParam", home) or "", re.S)
    font_colors = [_argb_to_css(value("m_fontColor", p)) for p in params][:10]
    bgm_rel = value("m_bgmFilePath", xml)
    bgm = read(bgm_rel) if bgm_rel else None
    return {"_bgm": bgm, "name": name, "pages": pages[:10], "icons": icons, "barColor": bar, "lock": lock,
            "lockDateColor": _argb_to_css(value("m_dateColor", start)), "lockDateLayout": layout,
            "indicatorColor": _argb_to_css(value("m_indicatorColor", info_bar)), "fontColors": font_colors}


# ───────────── Wii U Menu themes (.utheme) ─────────────
# Patches for the user's own Wii U menu files (Men.pack, Men2.pack), supplied once from a
# menu dump and kept in <data>/skins/wiiu-stock. See py_modules/wiiu_themes.py.
_wiiu_lock = threading.Lock()


def _wiiu_stock_user_dir() -> str:
    """Where imported menu files are written (the user's own data folder)."""
    return os.path.join(_skin_dir(), "wiiu-stock")


def _wiiu_stock_dir() -> str:
    """Where menu files are read from: the user's own import, else (TEST builds only, packaged with
    INCLUDE_TEST_STOCK=1) the copy bundled in defaults/skins/wiiu-stock. Default builds have no bundled copy."""
    user = _wiiu_stock_user_dir()
    try:
        import wiiu_themes
        if wiiu_themes.stock_status(user):
            return user
    except Exception:
        pass
    bundled = os.path.join(decky.DECKY_PLUGIN_DIR, "defaults", "skins", "wiiu-stock")
    if os.path.isfile(os.path.join(bundled, "Men.pack")) and os.path.isfile(os.path.join(bundled, "Men2.pack")):
        return bundled
    return user


def _wiiu_scan_state_path() -> str:
    return os.path.join(_skin_dir(), "wiiu-scan.json")


def _wiiu_load_state() -> dict:
    try:
        with open(_wiiu_scan_state_path(), encoding="utf-8") as f:
            s = json.load(f)
        return s if isinstance(s, dict) else {}
    except Exception:
        return {}


def _wiiu_save_state(state: dict):
    os.makedirs(_skin_dir(), exist_ok=True)
    tmp = _wiiu_scan_state_path() + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(state, f)
    os.replace(tmp, _wiiu_scan_state_path())


def _read_wiiu_cached(path: str):
    """read_utheme, remembered on disk (patching and decoding take a few seconds on the Deck).
    The key covers the file, the user's menu files (their checksums) and the reader version;
    answers that only say "menu files missing / wrong" are not stored."""
    import wiiu_themes
    make = lambda: wiiu_themes.read_utheme(path, _wiiu_stock_dir(), _data_url)
    try:
        stock = wiiu_themes.stock_status(_wiiu_stock_dir())
        st = os.stat(path)
        text = f"{os.path.realpath(path)}|{st.st_size}|{st.st_mtime_ns}|{wiiu_themes.READER_VERSION}|{sorted((k, v['crc']) for k, v in stock.items())}"
    except Exception:
        return make()
    return _pickle_cached("wiiuskin", text, make, store=lambda r: not r.get("needsStock") and not r.get("stockMismatch"))


def _switch_dir() -> str:
    return os.path.join(_skin_dir(), "switch")


def _switch_folders():
    """[(folder, index cache)]: the user's skins/switch first, then the read-only bundled one (test builds)."""
    out = [(_switch_dir(), os.path.join(_cache_root(), "switch-index.json"))]
    bundled = _bundled_dir("switch")
    if os.path.isdir(bundled) and os.path.realpath(bundled) != os.path.realpath(_switch_dir()):
        out.append((bundled, os.path.join(_cache_root(), "switch-index-bundled.json")))
    return out


def _switch_list():
    """Themes of every switch folder; a bundled theme is hidden when the user has a file or folder of the same name."""
    import switch_themes
    res, taken = [], set()
    for folder, index in _switch_folders():
        try:
            tops = set(os.listdir(folder)) if os.path.isdir(folder) else set()
        except OSError:
            tops = set()
        for t in switch_themes.scan_folder(folder, index):
            if not any(f.split("/", 1)[0].lower() in taken for f in t["files"].values()):
                res.append(t)
        taken |= {n.lower() for n in tops}
    return sorted(res, key=lambda g: g["name"].lower())


def _read_switch_cached(name: str):
    """switch_themes.read_theme, remembered on disk (decoding the DDS wallpapers takes a few seconds on the Deck)."""
    import switch_themes
    folder_src = index = None
    for folder, idx in _switch_folders():
        if switch_themes.safe_rel(folder, name):
            folder_src, index = folder, idx
            break
    if not folder_src:
        return None
    make = lambda: switch_themes.read_theme(folder_src, name, _data_url, index)
    try:
        # the key covers every file of the theme's folder level, so adding a screen refreshes it
        parts = []
        for n in switch_themes._list_files(folder_src):
            st = os.stat(os.path.join(folder_src, *n.split("/")))
            parts.append(f"{n}:{st.st_size}:{st.st_mtime_ns}")
        text = f"{folder_src}|{name}|{switch_themes.READER_VERSION}|{'|'.join(parts)}"
    except Exception:
        return make()
    return _pickle_cached("switchskin", text, make)


def _wiiu_scan() -> list:
    import wiiu_themes
    with _wiiu_lock:
        state = _wiiu_load_state()
        found = wiiu_themes.scan(wiiu_themes.scan_roots(decky.DECKY_USER_HOME), state)
        _wiiu_save_state(state)
    themes = {n for n, _ in _skin_entries("wiiu")}
    have_stock = bool(wiiu_themes.stock_status(_wiiu_stock_dir()))
    # Skip what's already in place: a theme copied under the same name, or menu files when we have some.
    return [f for f in found if not (f["kind"] == "theme" and os.path.basename(f["path"]) in themes) and not (f["kind"] == "stock" and have_stock)]


def _wiiu_decide(path: str, accept: bool) -> dict:
    import wiiu_themes
    with _wiiu_lock:
        state = _wiiu_load_state()
        entry = state.get(path)
        if not entry or not entry.get("kind"):
            return {"success": False, "error": "unknown file"}
        result = {"success": True}
        if accept:
            if entry["kind"] == "stock":
                result["stock"] = wiiu_themes.import_stock(path, _wiiu_stock_user_dir())
                for other, e in state.items():  # one set of menu files is enough: other copies of the dump stop asking
                    if other != path and isinstance(e, dict) and e.get("kind") == "stock" and not e.get("decision"):
                        e["decision"] = "superseded"
            else:
                if not path.lower().endswith(".utheme") or not os.path.isfile(path) or os.path.getsize(path) > wiiu_themes.UTHEME_MAX or not wiiu_themes.utheme_info(path):
                    return {"success": False, "error": "that file is no longer a Wii U theme"}
                dst_dir = os.path.join(_skin_dir(), "wiiu")
                os.makedirs(dst_dir, exist_ok=True)
                dst = os.path.join(dst_dir, os.path.basename(path))
                shutil.copyfile(path, dst + ".tmp")
                os.replace(dst + ".tmp", dst)
                result["theme"] = os.path.basename(dst)
        entry["decision"] = "accepted" if accept else "dismissed"
        _wiiu_save_state(state)
    return result


# ───────────── local videos ─────────────
# The Video category shows videos stored on the Deck: Steam game recordings
# (clips and recordings, kept as DASH segments) and ordinary video files in the
# usual folders and on SD cards. They are streamed to the UI by a tiny HTTP
# server bound to 127.0.0.1 with a random token; it only serves files that the
# last scan found.
VIDEO_EXT = {".mp4": "video/mp4", ".m4v": "video/mp4", ".mov": "video/mp4", ".webm": "video/webm", ".mkv": "video/x-matroska"}
_SEG = re.compile(r"^[\w.-]+$")


class _VideoIndex:
    def __init__(self):
        self.token = secrets.token_hex(12) if secrets is not None else os.urandom(12).hex()
        self.port = 0
        self.files = {}  # id -> absolute file path (plain videos, thumbnails)
        self.dirs = {}  # id -> recording folder (DASH segments)
        self.server = None

    def url(self, path: str) -> str:
        return f"http://127.0.0.1:{self.port}/{self.token}/{path}"


_vi = _VideoIndex()


def _vid(path: str) -> str:
    return f"{zlib.crc32(path.encode('utf-8', 'surrogateescape')) & 0xFFFFFFFF:08x}{len(path):03x}"


def _video_roots():
    home = decky.DECKY_USER_HOME
    roots = [os.path.join(home, n) for n in ("Videos", "Downloads", "Desktop", "Movies")]
    for media in ("/run/media", "/run/media/" + os.path.basename(home), "/media"):
        try:
            for n in os.listdir(media):
                p = os.path.join(media, n)
                if os.path.isdir(p) and p not in roots and n != os.path.basename(home):
                    roots.append(p)
        except Exception:
            pass
    return [r for r in roots if os.path.isdir(r)]


def _recording_roots():
    out = []
    home = decky.DECKY_USER_HOME
    for steam in (os.path.join(home, ".local/share/Steam"), os.path.join(home, ".steam/steam")):
        ud = os.path.join(steam, "userdata")
        try:
            for u in os.listdir(ud):
                g = os.path.join(ud, u, "gamerecordings")
                if os.path.isdir(g) and os.path.realpath(g) not in [os.path.realpath(x) for x in out]:
                    out.append(g)
        except Exception:
            pass
    return out


def _parse_stamp(text: str):
    """appid and unix time from Steam folder names like clip_1245620_20240305_123456."""
    m = re.search(r"_(\d+)_(\d{8})_(\d{6})", text)
    if not m:
        return 0, 0
    try:
        t = time.mktime(time.strptime(m.group(2) + m.group(3), "%Y%m%d%H%M%S"))
    except Exception:
        t = 0
    return int(m.group(1)), int(t)


def _read_session(folder: str):
    """Streams of one Steam recording folder (session.mpd + init/chunk .m4s)."""
    mpd_path = os.path.join(folder, "session.mpd")
    try:
        with open(mpd_path, "r", encoding="utf-8", errors="replace") as f:
            mpd = f.read()
    except Exception:
        return None
    names = os.listdir(folder)
    streams = []
    for m in re.finditer(r"<Representation([^>]*)>", mpd):
        a = m.group(1)
        rid = (re.search(r'\bid="([^"]*)"', a) or [None, ""])[1]
        codecs = (re.search(r'codecs="([^"]*)"', a) or [None, ""])[1]
        mime = (re.search(r'mimeType="([^"]*)"', a) or [None, ""])[1]
        if not mime:
            head = mpd[: m.start()]
            sets = head.rsplit("<AdaptationSet", 1)
            sm = re.search(r'(?:mimeType|contentType)="([^"]*)"', sets[-1]) if len(sets) > 1 else None
            mime = sm.group(1) if sm else ""
        kind = "audio" if "audio" in mime or codecs.startswith(("mp4a", "opus")) else "video"
        init = f"init-stream{rid}.m4s"
        chunks = sorted(n for n in names if n.startswith(f"chunk-stream{rid}-") and n.endswith(".m4s"))
        if init in names and chunks and codecs:
            container = mime if re.match(r"^(video|audio)/[\w.-]+$", mime or "") else f"{kind}/mp4"
            streams.append({"kind": kind, "codecs": codecs, "mime": container, "init": init, "chunks": chunks})
    if not any(s["kind"] == "video" for s in streams):
        return None
    dur = 0.0
    dm = re.search(r'mediaPresentationDuration="PT(?:([\d.]+)H)?(?:([\d.]+)M)?(?:([\d.]+)S)?"', mpd)
    if dm:
        dur = float(dm.group(1) or 0) * 3600 + float(dm.group(2) or 0) * 60 + float(dm.group(3) or 0)
    return {"streams": streams, "duration": dur}


def _scan_recordings(root: str, out: list):
    for sub, kind in (("clips", "clip"), ("video", "recording")):
        base = os.path.join(root, sub)
        try:
            entries = os.listdir(base)
        except Exception:
            continue
        for e in entries:
            top = os.path.join(base, e)
            # clips/<clip>/video/<bg_...>/session.mpd ; video/<bg_...>/session.mpd
            folders = []
            if os.path.isfile(os.path.join(top, "session.mpd")):
                folders = [top]
            else:
                vd = os.path.join(top, "video")
                try:
                    folders = [os.path.join(vd, n) for n in sorted(os.listdir(vd)) if os.path.isfile(os.path.join(vd, n, "session.mpd"))]
                except Exception:
                    folders = []
            parts = []
            for f in folders:
                sess = _read_session(f)
                if not sess:
                    continue
                did = _vid(f)
                _vi.dirs[did] = f
                for st in sess["streams"]:
                    st["init"] = _vi.url(f"r/{did}/{st['init']}")
                    st["chunks"] = [_vi.url(f"r/{did}/{c}") for c in st["chunks"]]
                parts.append(sess)
            if not parts:
                continue
            appid, created = _parse_stamp(e)
            if not created:
                try:
                    created = int(os.path.getmtime(top))
                except Exception:
                    created = 0
            thumb = ""
            for n in ("thumbnail.jpg", "thumbnail.png", "thumb.jpg"):
                tp = os.path.join(top, n)
                if os.path.isfile(tp):
                    tid = _vid(tp)
                    _vi.files[tid] = tp
                    thumb = _vi.url(f"f/{tid}")
                    break
            out.append(
                {
                    "id": _vid(top),
                    "kind": kind,
                    "name": "",
                    "appid": appid,
                    "created": created,
                    "duration": sum(p["duration"] for p in parts),
                    "size": 0,
                    "thumb": thumb,
                    "parts": parts,
                    "folder": sub,
                }
            )


def _scan_files(root: str, out: list, depth: int = 0, budget=None):
    if budget is None:
        budget = [4000]
    if depth > 4 or budget[0] <= 0:
        return
    try:
        entries = sorted(os.listdir(root))
    except Exception:
        return
    for n in entries:
        budget[0] -= 1
        if budget[0] <= 0 or n.startswith("."):
            continue
        p = os.path.join(root, n)
        if os.path.isdir(p):
            if n in ("steamapps", "compatdata", "shadercache", "node_modules", "proc", "sys"):
                continue
            if n == "gamerecordings":
                _scan_recordings(p, out)
                continue
            _scan_files(p, out, depth + 1, budget)
            continue
        ext = os.path.splitext(n)[1].lower()
        if ext not in VIDEO_EXT:
            continue
        try:
            st = os.stat(p)
        except Exception:
            continue
        if st.st_size < 64 * 1024:
            continue
        vid = _vid(p)
        _vi.files[vid] = p
        out.append(
            {
                "id": vid,
                "kind": "file",
                "name": os.path.splitext(n)[0],
                "appid": 0,
                "created": int(st.st_mtime),
                "duration": 0,
                "size": st.st_size,
                "thumb": "",
                "url": _vi.url(f"f/{vid}"),
                "mime": VIDEO_EXT[ext],
                "folder": os.path.basename(root),
            }
        )


def _list_videos():
    _vi.files = {}
    _vi.dirs = {}
    out = []
    for r in _recording_roots():
        _scan_recordings(r, out)
    seen = set()
    for r in _video_roots():
        rp = os.path.realpath(r)
        if rp in seen:
            continue
        seen.add(rp)
        _scan_files(r, out)
    out.sort(key=lambda v: -v["created"])
    return out[:500]


WEB_EXT = {".html": "text/html; charset=utf-8", ".htm": "text/html; charset=utf-8", ".css": "text/css; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".json": "application/json", ".svg": "image/svg+xml",
           ".woff2": "font/woff2", ".woff": "font/woff", ".ttf": "font/ttf", ".otf": "font/otf", ".webp": "image/webp", ".png": "image/png", ".gif": "image/gif"}
AUDIO_EXT = {".wav": "audio/wav", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".oga": "audio/ogg", ".flac": "audio/flac", ".m4a": "audio/mp4", ".opus": "audio/ogg"}


# The Music category: Steam soundtracks (steamapps/music in every library) and music files in
# ~/Music and on SD cards, one album per folder. Served by the media server under m/<id>.
_music_files = {}  # id -> absolute path (tracks, covers)
_MUSIC_EXT = {".mp3", ".flac", ".ogg", ".oga", ".opus", ".m4a", ".wav"}
_COVER_NAMES = ("cover", "folder", "front", "album", "albumart")


def _steam_libraries():
    home = decky.DECKY_USER_HOME
    out = []
    for steam in (os.path.join(home, ".local/share/Steam"), os.path.join(home, ".steam/steam")):
        vdf = os.path.join(steam, "steamapps", "libraryfolders.vdf")
        cands = [steam]
        try:
            with open(vdf, encoding="utf-8", errors="replace") as f:
                cands += re.findall(r'"path"\s+"([^"]+)"', f.read())
        except Exception:
            pass
        for c in cands:
            c = c.replace("\\\\", "/")
            sa = os.path.join(c, "steamapps")
            if os.path.isdir(sa) and os.path.realpath(sa) not in [os.path.realpath(x) for x in out]:
                out.append(sa)
    return out


def _soundtrack_ids(steamapps: str):
    """{install folder name: appid} from the library's app manifests."""
    ids = {}
    try:
        for n in os.listdir(steamapps):
            if n.startswith("appmanifest_") and n.endswith(".acf"):
                try:
                    with open(os.path.join(steamapps, n), encoding="utf-8", errors="replace") as f:
                        m = re.search(r'"installdir"\s+"([^"]+)"', f.read())
                    if m:
                        ids[m.group(1).lower()] = int(n[12:-4])
                except Exception:
                    pass
    except Exception:
        pass
    return ids


def _track_title(name: str):
    t = os.path.splitext(name)[0].replace("_", " ")
    t = re.sub(r"^\s*(?:\d{1,2}[-.]\s*)?\d{1,3}\s*[-._)]?\s+", "", t)  # "01 - ", "1-02. "
    return t.strip() or os.path.splitext(name)[0]


# A soundtrack shipped in several formats (Steam: "MP3/01 Title.mp3" next to "FLAC/01 Title.flac") is one album:
# a title found in more than one format keeps only the first format of this list.
_MUSIC_PREFER = (".flac", ".mp3", ".m4a", ".ogg", ".opus", ".oga", ".wav")


def _drop_format_copies(tracks):
    by_title = {}
    for t in tracks:
        by_title.setdefault(t["title"].casefold(), []).append(t)
    keep = set()
    for group in by_title.values():
        exts = {os.path.splitext(t["file"])[1].lower() for t in group}
        if len(exts) > 1:
            best = min(exts, key=lambda e: _MUSIC_PREFER.index(e) if e in _MUSIC_PREFER else 99)
            group = [t for t in group if os.path.splitext(t["file"])[1].lower() == best]
        keep.update(id(t) for t in group)
    return [t for t in tracks if id(t) in keep]


def _music_album(folder: str, name: str, source: str, appid: int = 0, budget=None, files_out=None, top_only=False):
    """One album: the music files in `folder` and its subfolders (up to three levels; a subfolder's name is the
    track's "disc"). Track ids are registered in `files_out` (default: the served table)."""
    files_out = _music_files if files_out is None else files_out
    tracks, covers = [], []
    for root, dirs, files in os.walk(folder):
        if budget is not None and budget[0] <= 0:
            break
        dirs[:] = sorted(d for d in dirs if not d.startswith("."))
        if top_only or root[len(folder):].count(os.sep) > 2:
            dirs[:] = []
        for n in sorted(files):
            if budget is not None:
                budget[0] -= 1
                if budget[0] <= 0:
                    break
            ext = os.path.splitext(n)[1].lower()
            p = os.path.join(root, n)
            if ext in _MUSIC_EXT:
                try:
                    size = os.path.getsize(p)
                except Exception:
                    continue
                if size < 16 * 1024:
                    continue
                tid = _vid(p)
                files_out[tid] = p
                tracks.append({"id": tid, "title": _track_title(n), "file": n, "url": _vi.url(f"m/{tid}"), "size": size,
                               "disc": os.path.relpath(root, folder) if root != folder else ""})
            elif ext in (".jpg", ".jpeg", ".png", ".webp"):
                covers.append(p)
    tracks = _drop_format_copies(tracks)
    if not tracks:
        return None
    cover = ""
    if covers:
        best = sorted(covers, key=lambda c: (not os.path.splitext(os.path.basename(c))[0].lower().startswith(_COVER_NAMES), len(c)))[0]
        cid = _vid(best)
        files_out[cid] = best
        cover = _vi.url(f"m/{cid}")
    return {"id": _vid(folder), "name": name, "source": source, "appid": appid, "cover": cover, "tracks": tracks[:400]}


def _list_music():
    # The scan runs in a worker thread while the media server keeps serving: the served table is replaced in one
    # step at the end (ids are stable, they come from the path), never emptied first. Emptying it at the start made
    # every track URL a 404 for the length of a scan, so a track that ended (or Chromium's next range request)
    # during one failed, and the player skipped through the rest of the album to its end.
    global _music_files
    found = {}
    albums = _scan_music(found)
    _music_files = {**_music_files, **found} if len(_music_files) < 50000 else found
    return albums


def _scan_music(found):
    albums, seen = [], set()
    budget = [20000]
    for sa in _steam_libraries():
        mdir = os.path.join(sa, "music")
        try:
            names = sorted(os.listdir(mdir))
        except Exception:
            continue
        ids = _soundtrack_ids(sa)
        for n in names:
            p = os.path.join(mdir, n)
            if os.path.isdir(p) and os.path.realpath(p) not in seen:
                seen.add(os.path.realpath(p))
                a = _music_album(p, n, "steam", ids.get(n.lower(), 0), budget, found)
                if a:
                    albums.append(a)
    home = decky.DECKY_USER_HOME
    roots = [os.path.join(home, "Music")]
    for r in _video_roots():
        if r.startswith(("/run/media", "/media")):
            roots += [os.path.join(r, "Music"), os.path.join(r, "MUSIC"), os.path.join(r, "PSP", "MUSIC")]
    for r in roots:
        if not os.path.isdir(r) or os.path.realpath(r) in seen:
            continue
        seen.add(os.path.realpath(r))
        loose = _music_album(r, os.path.basename(r), "local", 0, [400], found, top_only=True) if any(
            os.path.splitext(n)[1].lower() in _MUSIC_EXT for n in os.listdir(r)) else None
        try:
            subs = sorted(n for n in os.listdir(r) if not n.startswith(".") and os.path.isdir(os.path.join(r, n)))
        except Exception:
            subs = []
        if loose:  # files right in the folder: one album named after it (without its subfolders)
            albums.append(loose)
        for n in subs:
            a = _music_album(os.path.join(r, n), n, "local", 0, budget, found)
            if a:
                albums.append(a)
    return albums[:300]


def _read_psp_cached(path: str):
    """read_psp, remembered on disk: themes packed with LZR take seconds to unpack in Python."""
    import console_themes
    try:
        st = os.stat(path)
        text = f"{os.path.realpath(path)}|{st.st_size}|{st.st_mtime_ns}|{getattr(console_themes, 'READER_VERSION', 0)}"
    except Exception:
        return console_themes.read_psp(path)
    return _pickle_cached("pspskin", text, lambda: console_themes.read_psp(path))


def _read_x360_cached(path: str):
    """x360_themes.read_x360, remembered on disk (pictures are decoded)."""
    import x360_themes
    try:
        st = os.stat(path)
        text = f"{os.path.realpath(path)}|{st.st_size}|{st.st_mtime_ns}|{x360_themes.READER_VERSION}"
    except Exception:
        return x360_themes.read_x360(path)
    return _pickle_cached("x360skin", text, lambda: x360_themes.read_x360(path))


def _read_xbox_cached(path: str):
    """xbox_skins.read_xbox_skin, remembered on disk."""
    import xbox_skins
    try:
        st = os.stat(path)
        text = f"{os.path.realpath(path)}|{st.st_size}|{st.st_mtime_ns}|{xbox_skins.READER_VERSION}"
    except Exception:
        return xbox_skins.read_xbox_skin(path)
    return _pickle_cached("xboxskin", text, lambda: xbox_skins.read_xbox_skin(path))


def _read_wii_cached(path: str):
    """wii_themes.read_wii_theme, remembered on disk."""
    import wii_themes
    try:
        st = os.stat(path)
        text = f"{os.path.realpath(path)}|{st.st_size}|{st.st_mtime_ns}|{wii_themes.READER_VERSION}"
    except Exception:
        return wii_themes.read_wii_theme(path)
    return _pickle_cached("wiiskin", text, lambda: wii_themes.read_wii_theme(path))

def _read_3ds_cached(path: str):
    """n3ds_themes.read_3ds_theme, remembered on disk (the wallpapers are decoded to PNG)."""
    import n3ds_themes
    try:
        st = os.stat(path)
        text = f"{os.path.realpath(path)}|{st.st_size}|{st.st_mtime_ns}|{n3ds_themes.READER_VERSION}"
    except Exception:
        return n3ds_themes.read_3ds_theme(path)
    return _pickle_cached("n3dsskin", text, lambda: n3ds_themes.read_3ds_theme(path))


def _sound_file(folder: str, name: str):
    """A file inside an AudioLoader pack (~/homebrew/sounds/<pack>/<file>), or None."""
    try:
        from urllib.parse import unquote
    except Exception:  # pragma: no cover
        def unquote(x):
            return x
    folder, name = unquote(folder), unquote(name)
    if not folder or not name or "/" in folder or "/" in name or folder in (".", "..") or name in (".", ".."):
        return None
    if os.path.splitext(name)[1].lower() not in AUDIO_EXT:
        return None
    root = os.path.realpath(_sounds_dir())
    p = os.path.realpath(os.path.join(root, folder, name))
    if not p.startswith(root + os.sep):
        return None
    downloaded = _resource("sounds/" + folder + "/" + name)
    themed = os.path.realpath(os.path.join(_theme_sound_root(), folder, name))
    if themed.startswith(os.path.realpath(_theme_sound_root()) + os.sep) and os.path.isfile(themed):
        return themed
    return downloaded if os.path.isfile(downloaded) else p


async def _send(writer, status: str, headers: dict, body: bytes = b""):
    head = f"HTTP/1.1 {status}\r\n" + "".join(f"{k}: {v}\r\n" for k, v in headers.items()) + "\r\n"
    writer.write(head.encode("latin-1") + body)
    await writer.drain()


async def _serve(reader, writer):
    try:
        line = (await asyncio.wait_for(reader.readline(), 15)).decode("latin-1").strip()
        req_headers = {}
        while True:
            h = (await asyncio.wait_for(reader.readline(), 15)).decode("latin-1")
            if h in ("\r\n", "\n", ""):
                break
            k, _, v = h.partition(":")
            req_headers[k.strip().lower()] = v.strip()
        parts = line.split(" ")
        method = parts[0] if parts else ""
        path = parts[1].split("?", 1)[0] if len(parts) > 1 else "/"
        base = {"Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "Range", "Access-Control-Expose-Headers": "Content-Length, Content-Range", "Connection": "close", "Cache-Control": "no-store"}
        if method == "OPTIONS":
            await _send(writer, "204 No Content", base)
            return
        seg = path.strip("/").split("/")
        fpath = None
        if len(seg) >= 3 and seg[0] == _vi.token:
            if seg[1] == "f" and len(seg) == 3:
                fpath = _vi.files.get(seg[2])
            elif seg[1] == "r" and len(seg) == 4 and _SEG.match(seg[3]) and seg[2] in _vi.dirs:
                fpath = os.path.join(_vi.dirs[seg[2]], seg[3])
            elif seg[1] == "s" and len(seg) == 4:
                fpath = _sound_file(seg[2], seg[3])
            elif seg[1] == "m" and len(seg) == 3:
                fpath = _music_files.get(seg[2])
            elif seg[1] == "td" and len(seg) == 4 and seg[2].isdigit():
                import themedeck
                fpath = await asyncio.to_thread(themedeck.resolve, decky.DECKY_PLUGIN_SETTINGS_DIR, int(seg[2]), seg[3])
            elif seg[1] == "k" and len(seg) == 4 and _SEG.match(seg[2]) and _SEG.match(seg[3]):
                fpath = os.path.join(_cache_root(), seg[2], seg[3])
            elif seg[1] == "w" and len(seg) >= 4:
                # a community interface's wrapper page (data_themes.frame_wrapper): keeps the interface on its own folder
                import data_themes
                from urllib.parse import unquote
                theme_id, entry = unquote(seg[2]), "/".join(unquote(x) for x in seg[3:])
                if method == "GET" and entry.lower().endswith((".html", ".htm")) and data_themes.resolve(theme_id, entry):
                    html, csp = data_themes.frame_wrapper(f"http://127.0.0.1:{_vi.port}/{_vi.token}", theme_id, entry)
                    body = html.encode("utf-8")
                    await _send(writer, "200 OK", {**base, "Content-Type": "text/html; charset=utf-8", "Content-Length": str(len(body)), "Content-Security-Policy": csp, "X-Content-Type-Options": "nosniff", "Referrer-Policy": "no-referrer"}, body)
                    return
            elif seg[1] == "t" and len(seg) >= 4:
                # data themes: /<token>/t/<theme id>/<path inside the theme>
                import data_themes
                from urllib.parse import unquote
                theme_id = unquote(seg[2])
                fpath = data_themes.resolve(theme_id, "/".join(unquote(x) for x in seg[3:]))
                if fpath and fpath.lower().endswith((".html", ".htm")):
                    # every theme page runs sealed: no network, no access to Steam's page
                    base["Content-Security-Policy"] = data_themes.frame_csp(f"http://127.0.0.1:{_vi.port}/{_vi.token}", theme_id)
                    base["X-Content-Type-Options"] = "nosniff"
                    base["Referrer-Policy"] = "no-referrer"
        if method not in ("GET", "HEAD") or not fpath or not os.path.isfile(fpath):
            await _send(writer, "404 Not Found", {**base, "Content-Length": "0"})
            return
        stat = await asyncio.to_thread(os.stat, fpath)
        size = stat.st_size
        etag = f'"{stat.st_mtime_ns:x}-{size:x}"'
        base.update({"Cache-Control": "private, no-cache", "ETag": etag})
        if req_headers.get("if-none-match") == etag:
            await _send(writer, "304 Not Modified", base)
            return
        ext = os.path.splitext(fpath)[1].lower()
        ctype = VIDEO_EXT.get(ext) or AUDIO_EXT.get(ext) or WEB_EXT.get(ext) or {".m4s": "video/iso.segment", ".json": "application/json", ".bin": "application/octet-stream"}.get(ext) or _mime(fpath)
        start, end = 0, size - 1
        status = "200 OK"
        rng = re.match(r"bytes=(\d*)-(\d*)", req_headers.get("range", ""))
        if rng and size:
            if rng.group(1):
                start = int(rng.group(1))
                if rng.group(2):
                    end = min(int(rng.group(2)), size - 1)
            elif rng.group(2):
                start = max(0, size - int(rng.group(2)))
            if start > end:
                await _send(writer, "416 Range Not Satisfiable", {**base, "Content-Range": f"bytes */{size}", "Content-Length": "0"})
                return
            status = "206 Partial Content"
        hdr = {**base, "Content-Type": ctype, "Accept-Ranges": "bytes", "Content-Length": str(end - start + 1)}
        if status.startswith("206"):
            hdr["Content-Range"] = f"bytes {start}-{end}/{size}"
        await _send(writer, status, hdr)
        if method == "HEAD":
            return
        with await asyncio.to_thread(open, fpath, "rb") as f:
            await asyncio.to_thread(f.seek, start)
            left = end - start + 1
            while left > 0:
                buf = await asyncio.to_thread(f.read, min(262144, left))
                if not buf:
                    break
                writer.write(buf)
                await writer.drain()
                left -= len(buf)
    except Exception:
        pass
    finally:
        try:
            writer.close()
        except Exception:
            pass


async def _ensure_server():
    if _vi.server is not None:
        return True
    try:
        _vi.server = await asyncio.start_server(_serve, "127.0.0.1", 0)
        _vi.port = _vi.server.sockets[0].getsockname()[1]
        return True
    except Exception as e:
        decky.logger.error(f"video server failed: {e}")
        _vi.server = None
        return False


class Plugin:
    async def theme_inventory(self):
        import theme_store
        return theme_store.local_inventory()

    async def theme_catalog(self, refresh: bool = False):
        import theme_store
        result = await asyncio.to_thread(theme_store.catalog, bool(refresh))
        gallery = await asyncio.to_thread(theme_store.gallery)
        # art: every theme in the gallery, also the built-in ones without a pack (Wii, iiSU), keyed by theme id
        art = {}
        if gallery and await _ensure_server():
            for name in sorted(os.listdir(gallery)):
                ident, _, ext = name.rpartition(".")
                if ext in ("gif", "jpg") and theme_store.ID.fullmatch(ident):
                    key = f"hub-{ident}-{ext}"
                    _vi.files[key] = os.path.join(gallery, name)
                    art.setdefault(ident, {})["preview" if ext == "gif" else "poster"] = _vi.url(f"f/{key}")
            for pack in result["themes"]:
                pack["preview"] = art.get(pack["id"], {}).get("preview")
                pack["poster"] = art.get(pack["id"], {}).get("poster")
        result["art"] = art
        return result

    async def theme_install(self, ident: str):
        import theme_store
        result = await asyncio.to_thread(theme_store.install, ident)
        if result.get("success"):
            pack = next((p for p in theme_store.catalog()["themes"] if p["id"] == ident), {})
            warnings = []
            for audio_id in pack.get("audioPacks", []):
                audio = await self.install_deckthemes_audio(audio_id)
                if not audio.get("ok"):
                    warnings.append(audio.get("error", "Audio download failed"))
            if warnings:
                result["audioWarning"] = "Some audio could not be downloaded. Steam sounds remain available; retry through Customize: " + "; ".join(warnings)
        return result

    async def theme_remove(self, ident: str):
        import theme_store
        return await asyncio.to_thread(theme_store.remove, ident)

    async def theme_download_progress(self):
        import theme_store
        return theme_store.progress()

    async def achievement_popup_status(self):
        import achievement_popups
        return await asyncio.to_thread(achievement_popups.installed_finally,
                                       os.path.dirname(decky.DECKY_PLUGIN_DIR))

    async def plugin_catalog(self, refresh: bool = False):
        # Plugin Spotlight search: Decky Plugins Explorer data, cached 24 h (py_modules/plugin_catalog.py)
        import plugin_catalog
        return await asyncio.to_thread(plugin_catalog.catalog, os.path.join(_data_dir(), "plugin-catalog"), bool(refresh),
                                       os.path.dirname(decky.DECKY_PLUGIN_DIR))

    # Hub > Theme files: theme files for the importers from online sources (py_modules/theme_sources.py)
    async def theme_sources(self):
        import theme_sources
        return theme_sources.kinds()

    async def theme_sources_browse(self, kind: str, source: str, query: str = "", page: int = 1, refresh: bool = False):
        import theme_sources
        return await asyncio.to_thread(theme_sources.browse, str(kind), str(source), str(query or ""), page, bool(refresh))

    async def theme_sources_files(self, kind: str, ident: str):
        import theme_sources
        return await asyncio.to_thread(theme_sources.archive_files, str(kind), str(ident))

    async def theme_sources_download(self, kind: str, source: str, ident: str, file: str = "", name: str = ""):
        """Only called after the user confirmed the download in the Hub."""
        import theme_sources
        return await asyncio.to_thread(theme_sources.download, _skin_dir(), str(kind), str(source), str(ident), str(file or ""), str(name or ""))

    async def theme_sources_progress(self):
        import theme_sources
        return theme_sources.progress()

    async def plugin_update_status(self):
        import theme_updates
        return await asyncio.get_running_loop().run_in_executor(None, theme_updates.status)

    async def spotlight_update_status(self, refresh: bool = False):
        import spotlight_updates
        return await asyncio.to_thread(spotlight_updates.status, os.path.join(_data_dir(), "spotlight-updates"),
                                       os.path.dirname(decky.DECKY_PLUGIN_DIR), bool(refresh))

    async def spotlight_remember_source(self, repo: str, name: str, author: str, url: str):
        import spotlight_updates
        return await asyncio.to_thread(spotlight_updates.remember, os.path.join(_data_dir(), "spotlight-updates"),
                                       repo, name, author, url)

    async def spotlight_prepare_update(self, ident: str, version: str, url: str):
        import spotlight_updates
        return await asyncio.to_thread(spotlight_updates.prepare, os.path.join(_data_dir(), "spotlight-updates"),
                                       os.path.dirname(decky.DECKY_PLUGIN_DIR), ident, version, url)

    async def plugin_prepare_replacement(self, version: str, url: str):
        import theme_updates
        return theme_updates.prepare_replacement(version, url)

    async def plugin_cancel_replacement(self):
        import theme_updates
        theme_updates.clear_replacement()
        return True

    # ───── settings ─────
    async def read_profile_picture(self, path):
        try:
            target = pathlib.Path(str(path)).expanduser().resolve()
            if target.suffix.lower() not in (".png", ".jpg", ".jpeg", ".webp") or not target.is_file():
                return {"error": "Choose a PNG, JPEG or WebP image."}
            if target.stat().st_size > 10 * 1024 * 1024:
                return {"error": "Choose an image smaller than 10 MB."}
            raw = await asyncio.to_thread(target.read_bytes)
            mime = "image/png" if raw.startswith(b"\x89PNG\r\n\x1a\n") else "image/jpeg" if raw.startswith(b"\xff\xd8\xff") else "image/webp" if raw[:4] == b"RIFF" and raw[8:12] == b"WEBP" else None
            return {"image": _data_url(raw, mime)} if mime else {"error": "This image could not be opened."}
        except Exception:
            return {"error": "This image could not be opened."}

    async def get_settings(self):
        try:
            with open(_settings_path(), "r", encoding="utf-8") as f:
                data = json.load(f)
            return data if isinstance(data, dict) else None
        except FileNotFoundError:
            # First run: if the zip came with a bundled .p3t, preselect it for the PS3 theme.
            bundled = sorted(n for n in os.listdir(_bundled_dir("p3t")) if n.lower().endswith(".p3t")) if os.path.isdir(_bundled_dir("p3t")) else []
            first = {}
            if bundled:
                first["xmb"] = {"p3t": bundled[0]}
            vdir = _bundled_dir("vita")
            vita = sorted(os.listdir(vdir)) if os.path.isdir(vdir) else []
            if vita:
                first["vita"] = {"skin": vita[0]}
            first["onboardingDone"] = False  # fresh install: the first-run flow shows once
            return first
        except Exception as e:
            decky.logger.error(f"failed to read settings: {e}")
            return None

    async def set_settings(self, settings: dict) -> bool:
        if not isinstance(settings, dict):
            return False
        path = _settings_path()
        tmp = path + ".tmp"
        try:
            os.makedirs(os.path.dirname(path), exist_ok=True)
            with open(tmp, "w", encoding="utf-8") as f:
                json.dump(settings, f, ensure_ascii=False, indent=2)
            os.replace(tmp, path)
            return True
        except Exception as e:
            decky.logger.error(f"failed to write settings: {e}")
            return False

    # ───── frontend log (shown in ~/homebrew/logs/DeckHomeThemes/) ─────
    async def log_frontend(self, level: str, msg: str):
        (decky.logger.error if level == "error" else decky.logger.info)(f"[frontend] {msg}")

    # ───── AudioLoader packs ─────
    async def deckthemes_audio_catalog(self):
        import deckthemes_audio
        return [{k: v for k, v in p.items() if k in ("id", "name", "kind", "themes")} for p in deckthemes_audio.catalog()]

    async def install_deckthemes_audio(self, ident: str):
        import deckthemes_audio
        try:
            installed = await self.list_sound_packs()
            result = await asyncio.to_thread(deckthemes_audio.install, ident, _sounds_dir(), installed)
            return {"ok": True, **result}
        except Exception as error:
            decky.logger.warning(f"DeckThemes audio install failed: {error}")
            return {"ok": False, "error": str(error)}

    async def local_music_folders(self):
        import local_music
        return local_music.folders(decky.DECKY_USER_HOME)

    async def import_local_music(self, path: str):
        import local_music
        try:
            return await asyncio.to_thread(local_music.import_file, str(path), decky.DECKY_USER_HOME, _sounds_dir())
        except Exception as error:
            return {"ok": False, "error": str(error)}

    async def list_sound_packs(self):
        out = []
        root = _sounds_dir()
        themed_root = _theme_sound_root()
        entries = set(os.listdir(root) if os.path.isdir(root) else []) | set(_resource_names("sounds")) | set(os.listdir(themed_root) if os.path.isdir(themed_root) else [])
        for entry in sorted(entries):
            downloaded = _resource("sounds/" + entry)
            themed = os.path.join(themed_root, entry)
            folder = downloaded if os.path.isdir(downloaded) else themed if os.path.isdir(themed) else os.path.join(root, entry)
            pj = os.path.join(folder, "pack.json")
            if not os.path.isfile(pj):
                continue
            try:
                with open(pj, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                out.append(
                    {
                        "name": meta.get("name") or entry,
                        "id": meta.get("id"),
                        "folder": entry,
                        "files": [n for n in os.listdir(folder) if not n.endswith(".json")],
                        "mappings": meta.get("mappings") or {},
                        "ignore": meta.get("ignore") or [],
                        "music": bool(meta.get("music")),
                        "author": meta.get("author") or "",
                    }
                )
            except Exception as e:
                decky.logger.warning(f"bad pack {entry}: {e}")
        return out

    # ───── wallpapers ─────
    async def list_wallpapers(self):
        d = _wall_dir()
        os.makedirs(d, exist_ok=True)
        files = sorted(n for n in set(os.listdir(d)) | set(_resource_names("wallpapers")) if n.lower().endswith(IMAGE_EXT + WALLPAPER_VIDEO_EXT))
        return {"dir": d, "files": files}

    async def get_wallpaper(self, name: str):
        p = _user_resource(_wall_dir(), name, "wallpapers")
        if not os.path.isfile(p):
            return None
        ext = os.path.splitext(p)[1].lower()
        if ext in WALLPAPER_VIDEO_EXT:
            if not await _ensure_server():
                return None
            import hashlib
            ident = "wallpaper-" + hashlib.sha256(os.path.realpath(p).encode()).hexdigest()[:24] + ext
            _vi.files[ident] = p
            return f"http://127.0.0.1:{_vi.port}/{_vi.token}/f/{ident}"
        if ext not in IMAGE_EXT:
            return None
        def read_wallpaper():
            with open(p, "rb") as f:
                return _data_url(f.read(), _mime(p))
        return await asyncio.to_thread(read_wallpaper)

    # ───── console skins ─────
    async def list_skins(self):
        base = _skin_dir()
        p3t_dir = os.path.join(base, "p3t")
        vita_dir = os.path.join(base, "vita")
        psp_dir = os.path.join(base, "psp")
        os.makedirs(p3t_dir, exist_ok=True)
        os.makedirs(vita_dir, exist_ok=True)
        os.makedirs(psp_dir, exist_ok=True)
        psp = sorted(n for n in set(os.listdir(psp_dir)) | set(_resource_names("skins/psp")) if n.lower().endswith((".ptf", ".ctf")))
        p3t = sorted(n for n in set(os.listdir(p3t_dir)) | set(_resource_names("skins/p3t")) if n.lower().endswith(".p3t"))
        vita = sorted(
            n for n in set(os.listdir(vita_dir)) | set(_resource_names("skins/vita"))
            if n.lower().endswith(".zip") or os.path.isfile(os.path.join(_user_resource(vita_dir, n, "skins/vita"), "theme.xml"))
        )
        x360, x360pics, x360names = [], [], {}
        try:
            import x360_themes
            os.makedirs(os.path.join(base, "x360"), exist_ok=True)
            for n, p in _skin_entries("x360"):
                k = x360_themes.peek(p) if os.path.isfile(p) else None
                if k == "theme":
                    x360.append(n)
                elif k == "gamerpic":
                    x360pics.append(n)
                if k:
                    t = x360_themes.peek_name(p)
                    if t:
                        x360names[n] = t      # real package files are called F8E5B41D... : the menu shows the title instead
        except Exception as e:
            decky.logger.warning(f"x360 list failed: {e}")
        xbox = []
        try:
            import xbox_skins
            os.makedirs(os.path.join(base, "xbox"), exist_ok=True)
            for n, p in _skin_entries("xbox"):
                if xbox_skins.peek(p):
                    xbox.append(n)
        except Exception as e:
            decky.logger.warning(f"xbox skin list failed: {e}")
        wii = []
        try:
            import wii_themes
            os.makedirs(os.path.join(base, "wii"), exist_ok=True)
            for n, p in _skin_entries("wii"):
                if n.lower().endswith((".mym", ".csm", ".zip")) and wii_themes.peek(p):
                    wii.append(n)
        except Exception as e:
            decky.logger.warning(f"wii theme list failed: {e}")
        n3ds = []
        try:
            import n3ds_themes
            os.makedirs(os.path.join(base, "3ds"), exist_ok=True)
            for n, p in _skin_entries("3ds"):
                if n3ds_themes.peek(p):
                    n3ds.append(n)
        except Exception as e:
            decky.logger.warning(f"3ds theme list failed: {e}")
        return {"p3t": p3t, "vita": vita, "psp": psp, "x360": x360, "x360pics": x360pics, "x360names": x360names, "xbox": xbox, "wii": wii, "n3ds": n3ds, "dir": base}

    async def get_wii_skin(self, name: str):
        """Wii System Menu theme (.mym / .csm / .zip) from skins/wii/, or None."""
        p = _skin_path("wii", name)
        if not name or not os.path.isfile(p):
            return None
        try:
            return await asyncio.to_thread(_read_wii_cached, p)
        except Exception as e:
            decky.logger.error(f"wii theme read failed: {e}")

    async def get_3ds_skin(self, name: str):
        """Nintendo 3DS theme (.zip, folder or loose body_LZ.bin) from skins/3ds/, or None."""
        p = _skin_path("3ds", name)
        if not name or not (os.path.isfile(p) or os.path.isdir(p)):
            return None
        try:
            return await asyncio.to_thread(_read_3ds_cached, p)
        except Exception as e:
            decky.logger.error(f"3ds theme read failed: {e}")
            return None

    async def list_3ds_badges(self):
        """The user's 3DS home badges: pictures in skins/3ds-badges/<set>/ (plus a bundled copy), grouped by set."""
        user = os.path.join(_skin_dir(), "3ds-badges")
        try:
            os.makedirs(user, exist_ok=True)
            import n3ds_themes
            res = await asyncio.to_thread(n3ds_themes.list_badges, [user, _bundled_dir("3ds-badges")])
        except Exception as e:
            decky.logger.warning(f"3ds badge list failed: {e}")
            res = {"sets": []}
        res["dir"] = user
        return res

    async def get_xbox_skin(self, name: str):
        """Original Xbox skin (UnleashX or XBMC folder / .zip) from skins/xbox/, or None."""
        p = _skin_path("xbox", name)
        if not name or not (os.path.isfile(p) or os.path.isdir(p)):
            return None
        try:
            return await asyncio.to_thread(_read_xbox_cached, p)
        except Exception as e:
            decky.logger.error(f"xbox skin read failed: {e}")
            return None

    async def get_x360_skin(self, name: str):
        """Xbox 360 theme / gamer picture package from skins/x360/ (any file name), or None."""
        p = _skin_path("x360", name)
        if not name or not os.path.isfile(p):
            return None
        try:
            return await asyncio.to_thread(_read_x360_cached, p)
        except Exception as e:
            decky.logger.error(f"x360 theme read failed: {e}")
            return None

    async def get_p3t(self, name: str):
        p = _user_resource(os.path.join(_skin_dir(), "p3t"), name, "skins/p3t")
        if not os.path.isfile(p):
            return None
        try:
            r = await asyncio.to_thread(_read_p3t_cached, p)
        except Exception as e:
            decky.logger.error(f"p3t read failed: {e}")
            return None
        if not r:
            return None
        raf, sounds, bgraw = r.pop("_raf", None), r.pop("_sounds", None), r.pop("_bgraw", None)
        try:
            r["soundPack"] = await asyncio.to_thread(_theme_sound_pack, name, sounds)
        except Exception as e:
            decky.logger.warning(f"p3t sound pack failed: {e}")
        if bgraw and not raf:
            # a slideshow theme made of static pictures: all of them rotate like a dynamic theme's frames
            try:
                key, names = await asyncio.to_thread(_p3t_static_slides, p, bgraw)
                if names and await _ensure_server():
                    r["slides"] = [_vi.url(f"k/{key}/{n}") for n in names]
                    r["staticSlides"] = True
            except Exception as e:
                decky.logger.warning(f"p3t picture slideshow failed: {e}")
        if raf:
            try:
                key, count = await asyncio.to_thread(_p3t_slides, p, raf)
                if count and await _ensure_server():
                    r["slides"] = [_vi.url(f"k/{key}/slide{i:02d}.png") for i in range(count)]
            except Exception as e:
                decky.logger.warning(f"p3t slideshow failed: {e}")
            try:
                key, ready = await asyncio.to_thread(_p3t_scene, p, raf)
                if await _ensure_server():
                    # a URL once built; "" while the first build runs (ask again shortly)
                    r["rafScene"] = _vi.url(f"k/{key}/{_SCENE_FILE}") if ready else ""
            except Exception as e:
                decky.logger.warning(f"p3t scene failed: {e}")
        return r

    async def get_psp_skin(self, name: str):
        p = _user_resource(os.path.join(_skin_dir(), "psp"), name, "skins/psp")
        if not os.path.isfile(p):
            return None
        try:
            import console_themes
            r = await asyncio.to_thread(_read_psp_cached, p)
        except Exception as e:
            decky.logger.error(f"psp theme read failed: {e}")
            return None
        if not r:
            return None
        sounds = r.pop("sounds", None)
        try:
            r["soundPack"] = await asyncio.to_thread(_theme_sound_pack, name, sounds)
        except Exception as e:
            decky.logger.warning(f"psp sound pack failed: {e}")
        emb = r.pop("_bootsnd", None) or {}
        if r.get("_gameboot") and "gameboot" not in emb:
            try:
                import psp_movie
                at3 = await asyncio.to_thread(psp_movie.pmf_audio_at3, r["_gameboot"])
                if at3:
                    emb["gameboot"] = at3  # the boot clip's own sound
            except Exception as e:
                decky.logger.warning(f"psp boot clip sound failed: {e}")
        try:
            snd = await asyncio.to_thread(_psp_boot_sounds, p, emb)
            if snd.get("files") and await _ensure_server():
                r["bootSound"] = {k: _vi.url(f"k/{snd['key']}/{f}") for k, f in snd["files"].items()}
            if snd.get("needsDecoder"):
                r["bootSoundNeedsDecoder"] = True
        except Exception as e:
            decky.logger.warning(f"psp boot sounds failed: {e}")
        pmf = r.pop("_gameboot", None)
        if pmf:
            try:
                key = await asyncio.to_thread(_psp_gameboot, p, pmf)
                if key and await _ensure_server():
                    r["gameboot"] = _vi.url(f"k/{key}/gameboot.mp4")
            except Exception as e:
                decky.logger.warning(f"psp game-launch video failed: {e}")
        return r

    async def get_vita_skin(self, name: str):
        p = _user_resource(os.path.join(_skin_dir(), "vita"), name, "skins/vita")
        if not os.path.exists(p):
            return None
        try:
            r = await asyncio.to_thread(_read_vita, p)
        except Exception as e:
            decky.logger.error(f"vita theme read failed: {e}")
            return None
        if not r:
            return None
        bgm = r.pop("_bgm", None)
        try:
            r.update(await asyncio.to_thread(_theme_music_pack, name, bgm))
        except Exception as e:
            decky.logger.warning(f"vita theme music failed: {e}")
        return r

    async def list_switch_themes(self):
        folder = _switch_dir()
        os.makedirs(folder, exist_ok=True)
        try:
            themes = await asyncio.to_thread(_switch_list)
        except Exception as e:
            decky.logger.warning(f"switch theme list failed: {e}")
            themes = []
        return {"themes": [{"id": t["id"], "name": t["name"], "author": t["author"], "screens": sorted(t["files"])} for t in themes], "dir": folder}

    async def get_switch_skin(self, name: str):
        if not name:
            return None
        try:
            return await asyncio.to_thread(_read_switch_cached, name)
        except Exception as e:
            decky.logger.error(f"switch theme read failed: {e}")
            return None

    async def list_wiiu_themes(self):
        import wiiu_themes
        folder = os.path.join(_skin_dir(), "wiiu")
        os.makedirs(folder, exist_ok=True)
        names = [n for n, p in _skin_entries("wiiu") if n.lower().endswith(".utheme") and os.path.isfile(p)]
        return {"themes": names, "stock": wiiu_themes.stock_status(_wiiu_stock_dir()), "dir": folder}

    async def get_wiiu_skin(self, name: str):
        p = _skin_path("wiiu", name)
        if not name or not p.lower().endswith(".utheme") or not os.path.isfile(p):
            return None
        try:
            return await asyncio.to_thread(_read_wiiu_cached, p)
        except Exception as e:
            decky.logger.error(f"wii u theme read failed: {e}")
            return None

    async def wiiu_scan(self):
        try:
            return await asyncio.to_thread(_wiiu_scan)
        except Exception as e:
            decky.logger.warning(f"wii u scan failed: {e}")
            return []

    async def wiiu_decide(self, path: str, accept: bool):
        try:
            return await asyncio.to_thread(_wiiu_decide, path, bool(accept))
        except Exception as e:
            decky.logger.error(f"wii u import failed: {e}")
            return {"success": False, "error": str(e)}

    async def store_theme_music(self, folder: str, data: str):
        try:
            return await asyncio.to_thread(_store_theme_music, folder, data)
        except Exception as e:
            decky.logger.warning(f"store theme music failed: {e}")
            return False

    async def music_decoder_status(self):
        ready = _vgm_ready()
        return {"installed": ready, "version": await asyncio.to_thread(_vgm_version, _vgm_path()) if ready else ""}

    async def install_music_decoder(self):
        try:
            return await asyncio.to_thread(_install_vgmstream)
        except Exception as e:
            decky.logger.error(f"music decoder install failed: {e}")
            return {"installed": False, "error": str(e)}

    # ───── image sets shipped with the plugin (defaults/assets/<set>/*.png) ─────
    async def get_dial_asset(self, name: str):
        # Only curated theme files; do not expose arbitrary plugin paths.
        allowed = {"wake.wav", "switch.wav", "launch.wav", "back.wav"}
        if not isinstance(name, str) or name not in allowed:
            return None
        path = _resource("dial/" + name)
        if not os.path.isfile(path) or os.path.getsize(path) > 12 * 1024 * 1024:
            return None
        with open(path, "rb") as f:
            payload = _b64(f.read())
        mime = "audio/wav"
        return "data:" + mime + ";base64," + payload

    async def get_assets(self, name: str):
        folder = _user_resource(os.path.join(_data_dir(), "assets"), name, "assets")  # your own files on the Deck come first
        out = {}
        try:
            for n in sorted(os.listdir(folder)):
                if n.lower().endswith(IMAGE_EXT + (".glb", ".mp4",)):
                    with open(os.path.join(folder, n), "rb") as f:
                        out[os.path.splitext(n)[0]] = _data_url(f.read(), "model/gltf-binary" if n.lower().endswith(".glb") else _mime(n))
        except Exception:
            pass
        return out

    # ───── your own Xbox 360 avatar (a 360sona export): assets/my-avatar/avatar.glb + gamerpic.png ─────
    def _x360_avatar_dir(self):
        import x360_avatar
        return os.path.join(_data_dir(), "assets", x360_avatar.SET)

    async def x360_avatar_scan(self):
        import x360_avatar, wiiu_themes
        try:
            return await asyncio.to_thread(x360_avatar.scan, wiiu_themes.scan_roots(decky.DECKY_USER_HOME))
        except Exception as e:
            decky.logger.warning(f"avatar scan failed: {e}")
            return []

    async def x360_avatar_import(self, path: str):
        import x360_avatar
        if not isinstance(path, str) or not os.path.isabs(path) or not path.lower().endswith((".glb", ".png")):
            return {"success": False, "error": "Pick a .glb model or a .png picture"}
        try:
            return await asyncio.to_thread(x360_avatar.install, os.path.realpath(path), self._x360_avatar_dir())
        except Exception as e:
            decky.logger.error(f"avatar import failed: {e}")
            return {"success": False, "error": str(e)[:200]}

    async def x360_avatar_import_url(self, url: str):
        import x360_avatar
        from theme_network import urlopen
        try:
            return await asyncio.to_thread(x360_avatar.install_url, str(url or ""), self._x360_avatar_dir(), urlopen)
        except Exception as e:
            decky.logger.error(f"avatar download failed: {e}")
            return {"success": False, "error": str(e)[:200]}

    async def x360_avatar_remove(self, what: str = "all"):
        import x360_avatar
        return await asyncio.to_thread(x360_avatar.remove, self._x360_avatar_dir(), str(what))

    async def x360_avatar_status(self):
        import x360_avatar
        return await asyncio.to_thread(x360_avatar.status, self._x360_avatar_dir())

    # ───── local media server (sounds, music, videos) ─────
    async def castle_weather(self):
        """Opt-in IP-based weather; HTTPS only, cached ten minutes, no location persisted."""
        cached = getattr(self, "_castle_weather_cache", None)
        if cached and time.monotonic() - cached[0] < (60 if cached[1].get("error") else 600):
            return cached[1]
        def fetch():
            from urllib.request import Request
            from theme_network import urlopen
            from urllib.parse import urlencode
            import math
            def read(url):
                with urlopen(Request(url, headers={"User-Agent": "DeckHomeThemes/1.9"}), timeout=8) as response:
                    return json.loads(response.read(65536))
            geo = read("https://ipwho.is/?fields=success,city,country_code,latitude,longitude")
            if not geo.get("success"):
                raise ValueError("Location unavailable")
            lat, lon = float(geo["latitude"]), float(geo["longitude"])
            if not (-90 <= lat <= 90 and -180 <= lon <= 180):
                raise ValueError("Invalid location")
            data = read("https://api.open-meteo.com/v1/forecast?" + urlencode({"latitude":lat,"longitude":lon,"current":"temperature_2m,weather_code,is_day","temperature_unit":"celsius","timezone":"auto"}))
            cur = data["current"]
            temp = float(cur["temperature_2m"])
            if not math.isfinite(temp):
                raise ValueError("Invalid temperature")
            return {"temperature":temp,"code":int(cur["weather_code"]),"day":bool(cur["is_day"]),"city":str(geo.get("city") or geo.get("country_code") or "Nearby"),"updated":str(cur["time"]),"source":"Open-Meteo"}
        try:
            result = await asyncio.to_thread(fetch)
        except Exception:
            result = {"error":"Weather unavailable"}
        self._castle_weather_cache = (time.monotonic(), result)
        return result

    async def cinematic_assets(self, name: str):
        if name not in ("castle", "republic") or not await _ensure_server():
            return {}
        result = {}
        for key, ext in (("video", ".mp4"), ("poster", ".jpg")):
            path = _resource("cinematic/" + name + ext)
            if os.path.isfile(path):
                ident = "cinematic-" + name + "-" + key + ext
                _vi.files[ident] = path
                result[key] = f"http://127.0.0.1:{_vi.port}/{_vi.token}/f/{ident}"
        return result

    # ───── data themes (theme.json folders; docs/THEME-FORMAT.md) ─────
    async def list_data_themes(self):
        import data_themes
        base = f"http://127.0.0.1:{_vi.port}/{_vi.token}/t" if await _ensure_server() else None
        try:
            themes = await asyncio.to_thread(data_themes.list_themes)
        except Exception as e:
            decky.logger.error(f"data themes: {e}")
            themes = []
        wrap = base[:-2] + "/w" if base else None  # community interfaces open through their wrapper page
        return {"base": base, "wrap": wrap, "themes": themes, "dir": data_themes.user_root(), "errors": data_themes.zip_errors()}

    async def import_data_theme(self, path):
        """Quick Access → Add a theme: copy a picked theme .zip into the themes folder (checked first)."""
        import data_themes
        try:
            return await asyncio.to_thread(data_themes.import_file, path)
        except Exception as e:
            decky.logger.error(f"import theme: {e}")
            return {"ok": False, "error": str(e)[:200]}

    async def community_themes(self):
        import community_themes
        return await asyncio.to_thread(community_themes.listing)

    async def community_source(self, repo: str, action: str):
        import community_themes
        try:
            return {"ok": True, **await asyncio.to_thread(community_themes.source_action, repo, action)}
        except Exception as e:
            return {"ok": False, "error": str(e)[:250]}

    async def community_package(self, repo: str, ident: str, action: str):
        import community_themes
        try:
            return await asyncio.to_thread(community_themes.package_action, repo, ident, action)
        except Exception as e:
            return {"ok": False, "error": str(e)[:250]}

    async def community_progress(self):
        import community_themes
        return community_themes.progress()

    async def community_update_status(self, force: bool = False):
        import community_themes
        return await asyncio.to_thread(community_themes.check_updates, bool(force))

    async def _community_update_loop(self):
        import community_themes
        while True:
            try:
                await asyncio.to_thread(community_themes.check_updates)
            except Exception as e:
                decky.logger.warning(f"community update check: {e}")
            await asyncio.sleep(30 * 60)

    async def media_server(self):
        if not await _ensure_server():
            return None
        return {"base": f"http://127.0.0.1:{_vi.port}/{_vi.token}"}

    # ───── videos on the Deck ─────
    async def list_videos(self):
        if not await _ensure_server():
            return {"ok": False, "videos": []}
        try:
            loop = asyncio.get_event_loop()
            vids = await loop.run_in_executor(None, _list_videos)
            return {"ok": True, "videos": vids}
        except Exception as e:
            decky.logger.error(f"video scan failed: {e}")
            return {"ok": False, "videos": []}

    # ───── music on the Deck ─────
    async def themedeck_track(self, appid: int):
        import themedeck
        track = await asyncio.to_thread(themedeck.assignment, decky.DECKY_PLUGIN_SETTINGS_DIR, appid)
        if not track or not await _ensure_server():
            return None
        track.pop("path", None)
        signature = track.pop("signature")
        return {**track, "url": f"http://127.0.0.1:{_vi.port}/{_vi.token}/td/{appid}/{signature}"}

    async def list_music(self):
        if not await _ensure_server():
            return {"ok": False, "albums": []}
        try:
            albums = await asyncio.get_event_loop().run_in_executor(None, _list_music)
            return {"ok": True, "albums": albums}
        except Exception as e:
            decky.logger.error(f"music scan failed: {e}")
            return {"ok": False, "albums": []}

    # ───── lifecycle ─────
    async def _main(self):
        import theme_updates
        theme_updates.clear_replacement()
        import theme_store
        theme_store.recover()
        import community_themes
        community_themes.recover()
        self._community_updates = asyncio.create_task(self._community_update_loop())
        theme_store.migrate_legacy_resources()
        os.makedirs(_wall_dir(), exist_ok=True)
        os.makedirs(os.path.join(_skin_dir(), "p3t"), exist_ok=True)
        os.makedirs(os.path.join(_skin_dir(), "vita"), exist_ok=True)
        os.makedirs(os.path.join(_skin_dir(), "psp"), exist_ok=True)
        os.makedirs(os.path.join(_skin_dir(), "wiiu"), exist_ok=True)
        os.makedirs(_switch_dir(), exist_ok=True)
        for kind in ("xbox", "wii", "3ds", "x360"):
            os.makedirs(os.path.join(_skin_dir(), kind), exist_ok=True)
        # Skins shipped in the zip (defaults/skins/<kind>, e.g. a private test build's themes) are not copied:
        # every importer lists and reads them in place (_skin_entries / _skin_path / _switch_folders), read-only,
        # and a file of the same name in the user's own folder wins.
        # Wallpapers bundled in the zip (personal test builds) → wallpapers folder (never overwrites).
        try:
            wsrc = os.path.join(decky.DECKY_PLUGIN_DIR, "defaults", "wallpapers")
            if os.path.isdir(wsrc):
                for n in os.listdir(wsrc):
                    dst = os.path.join(_wall_dir(), n)
                    if not os.path.exists(dst):
                        shutil.copyfile(os.path.join(wsrc, n), dst)
        except Exception as e:
            decky.logger.warning(f"could not copy bundled wallpapers: {e}")
        # Sound packs shipped in the zip → ~/homebrew/sounds (AudioLoader's folder; never overwrites).
        try:
            ssrc = os.path.join(decky.DECKY_PLUGIN_DIR, "defaults", "sounds")
            if os.path.isdir(ssrc):
                os.makedirs(_sounds_dir(), exist_ok=True)
                for n in os.listdir(ssrc):
                    dst = os.path.join(_sounds_dir(), n)
                    if not os.path.exists(dst):
                        shutil.copytree(os.path.join(ssrc, n), dst)
                        import theme_uninstall
                        theme_uninstall.record_shared("sounds", n)
        except Exception as e:
            decky.logger.warning(f"could not install bundled sound packs: {e}")
        # Example CSS Loader themes shipped in the zip → ~/homebrew/themes (never overwrites).
        try:
            src_root = os.path.join(decky.DECKY_PLUGIN_DIR, "defaults", "css-themes")
            dst_root = os.path.join(decky.DECKY_HOME, "themes")
            if os.path.isdir(src_root):
                os.makedirs(dst_root, exist_ok=True)
                for n in os.listdir(src_root):
                    dst = os.path.join(dst_root, n)
                    if not os.path.exists(dst):
                        shutil.copytree(os.path.join(src_root, n), dst)
                        import theme_uninstall
                        theme_uninstall.record_shared("themes", n)
        except Exception as e:
            decky.logger.warning(f"could not install example CSS themes: {e}")
        # Same link AudioLoader makes, so pack sounds are reachable from Steam's UI
        # even when AudioLoader itself isn't installed.
        try:
            steamui = _steamui_dir()
            link = os.path.join(steamui, "sounds_custom") if steamui else ""
            if link and os.path.isdir(_sounds_dir()) and not os.path.lexists(link):
                os.symlink(_sounds_dir(), link)
        except Exception as e:
            decky.logger.warning(f"could not link sounds: {e}")

    async def _unload(self):
        task = getattr(self, "_community_updates", None)
        if task is not None:
            task.cancel()
            try:
                await task
            except asyncio.CancelledError:
                pass
        try:
            if _vi.server is not None:
                _vi.server.close()
                _vi.server = None
        except Exception:
            pass

    async def _uninstall(self):
        await self._unload()
        import theme_updates
        if theme_updates.replacement_pending():
            return  # Preserve resources during a ThemeHub update/channel switch.
        import theme_uninstall
        theme_uninstall.cleanup()
