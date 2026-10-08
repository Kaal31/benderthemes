"""Deck Home Themes backend.

Settings storage, plus readers for user-supplied files that live on the Deck:
  * AudioLoader sound packs  (~/homebrew/sounds/<pack>/pack.json)
  * wallpapers               (<data>/wallpapers/*.png|jpg|webp)
  * PS3 .p3t themes           (<data>/skins/p3t/*.p3t)
  * PS Vita custom themes     (<data>/skins/vita/<folder or .zip> with theme.xml)
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
import shutil
import struct
try:  # Decky ships a trimmed Python; never let one missing module stop the backend
    import zipfile
except Exception:  # pragma: no cover
    zipfile = None
import zlib
import re
import asyncio
import time
try:
    import secrets
except Exception:  # pragma: no cover
    secrets = None

import decky

IMAGE_EXT = (".png", ".jpg", ".jpeg", ".webp", ".gif")


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
    be = b[:4] == b".GIM"
    E = ">" if be else "<"

    def walk(start, end):
        p = start
        while p + 16 <= end:
            bid, _, size, nxt, doff = struct.unpack(E + "HHIII", b[p:p + 16])
            if bid == 4:
                return p
            if bid in (2, 3):
                r = walk(p + doff, p + size)
                if r is not None:
                    return r
            if nxt == 0:
                break
            p += nxt
        return None

    ib = walk(16, len(b))
    if ib is None:
        return None
    _, _, _, _, doff = struct.unpack(E + "HHIII", b[ib:ib + 16])
    h0 = ib + doff
    _, _, fmt, order, w, h, _ = struct.unpack(E + "HHHHHHH", b[h0:h0 + 14])
    pix_off = struct.unpack(E + "I", b[h0 + 28:h0 + 32])[0]
    data = b[h0 + pix_off:]
    if fmt == 3 and order == 0 and len(data) >= w * h * 4:  # RGBA8888, linear
        return _png(w, h, data[: w * h * 4])
    if fmt in (0, 1, 2) and order == 0 and len(data) >= w * h * 2:  # 16-bit formats
        out = bytearray(w * h * 4)
        for i in range(w * h):
            v = struct.unpack(E + "H", data[i * 2:i * 2 + 2])[0]
            if fmt == 0:  # RGBA5650
                r, g, bb, a = (v & 31) << 3, ((v >> 5) & 63) << 2, ((v >> 11) & 31) << 3, 255
            elif fmt == 1:  # RGBA5551
                r, g, bb, a = (v & 31) << 3, ((v >> 5) & 31) << 3, ((v >> 10) & 31) << 3, 255 if v >> 15 else 0
            else:  # RGBA4444
                r, g, bb, a = (v & 15) << 4, ((v >> 4) & 15) << 4, ((v >> 8) & 15) << 4, ((v >> 12) & 15) << 4
            out[i * 4:i * 4 + 4] = bytes((r, g, bb, a))
        return _png(w, h, bytes(out))
    return None


# ───────────── .p3t (PS3 theme) reader ─────────────
def _read_p3t(path: str):
    with open(path, "rb") as f:
        d = f.read()
    if d[:4] != b"P3TF":
        return None
    (_, _, tree_off, _, id_off, _, str_off, _, _, _, _, _, file_off, _) = struct.unpack(">4s13I", d[:56])

    def cstr(off):
        e = d.index(b"\0", off)
        return d[off:e].decode("latin1")

    nodes = []

    def elem(o):
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

    name = os.path.basename(path)
    icons = {}
    backgrounds = []
    for tag, a in nodes:
        try:
            if tag == "info" and isinstance(a.get("name"), str):
                name = a["name"]
            elif tag == "icon" and "src" in a and "id" in a:
                url = image(a["src"], a.get("size"))
                if url:
                    icons[a["id"]] = url
            elif tag == "bgimage":
                ref = a.get("hd") or a.get("sd")
                if ref:
                    url = image(ref, a.get("size"))
                    if url:
                        backgrounds.append(url)
        except Exception as e:  # one broken entry shouldn't sink the theme
            decky.logger.warning(f"p3t entry {tag} failed: {e}")
    return {"name": name, "backgrounds": backgrounds[:3], "icons": icons}


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
    bar = _argb_to_css(value("m_barColor", block("InfomationBarProperty", xml)))
    return {"name": name, "pages": pages[:10], "icons": icons, "barColor": bar}


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


AUDIO_EXT = {".wav": "audio/wav", ".mp3": "audio/mpeg", ".ogg": "audio/ogg", ".oga": "audio/ogg", ".flac": "audio/flac", ".m4a": "audio/mp4", ".opus": "audio/ogg"}


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
        if method not in ("GET", "HEAD") or not fpath or not os.path.isfile(fpath):
            await _send(writer, "404 Not Found", {**base, "Content-Length": "0"})
            return
        size = os.path.getsize(fpath)
        ext = os.path.splitext(fpath)[1].lower()
        ctype = VIDEO_EXT.get(ext) or AUDIO_EXT.get(ext) or ("video/iso.segment" if ext == ".m4s" else _mime(fpath))
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
        with open(fpath, "rb") as f:
            f.seek(start)
            left = end - start + 1
            while left > 0:
                buf = f.read(min(262144, left))
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
        if await _ensure_server():
            for pack in result["themes"]:
                if not theme_store.ID.fullmatch(pack["id"]):
                    continue
                for key, ext in (("preview", "gif"), ("poster", "jpg")):
                    path = os.path.join(decky.DECKY_PLUGIN_DIR, "hub-previews", f"{pack['id']}.{ext}")
                    pack[key] = None
                    if os.path.isfile(path):
                        ident = f"hub-{pack['id']}-{ext}"
                        _vi.files[ident] = path
                        pack[key] = _vi.url(f"f/{ident}")
        return result

    async def theme_install(self, ident: str):
        import theme_store
        return await asyncio.to_thread(theme_store.install, ident)

    async def theme_remove(self, ident: str):
        import theme_store
        return await asyncio.to_thread(theme_store.remove, ident)

    async def theme_download_progress(self):
        import theme_store
        return theme_store.progress()

    async def plugin_update_status(self):
        import theme_updates
        return await asyncio.get_running_loop().run_in_executor(None, theme_updates.status)

    async def plugin_prepare_replacement(self, version: str, url: str):
        import theme_updates
        return theme_updates.prepare_replacement(version, url)

    async def plugin_cancel_replacement(self):
        import theme_updates
        theme_updates.clear_replacement()
        return True

    # ───── settings ─────
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
            return first or None
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
    async def list_sound_packs(self):
        out = []
        root = _sounds_dir()
        entries = set(os.listdir(root) if os.path.isdir(root) else []) | set(_resource_names("sounds"))
        for entry in sorted(entries):
            downloaded = _resource("sounds/" + entry)
            folder = downloaded if os.path.isdir(downloaded) else os.path.join(root, entry)
            pj = os.path.join(folder, "pack.json")
            if not os.path.isfile(pj):
                continue
            try:
                with open(pj, "r", encoding="utf-8") as f:
                    meta = json.load(f)
                out.append(
                    {
                        "name": meta.get("name") or entry,
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
        files = sorted(n for n in set(os.listdir(d)) | set(_resource_names("wallpapers")) if n.lower().endswith(IMAGE_EXT))
        return {"dir": d, "files": files}

    async def get_wallpaper(self, name: str):
        p = _user_resource(_wall_dir(), name, "wallpapers")
        if not os.path.isfile(p):
            return None
        with open(p, "rb") as f:
            return _data_url(f.read(), _mime(p))

    # ───── console skins ─────
    async def list_skins(self):
        base = _skin_dir()
        p3t_dir = os.path.join(base, "p3t")
        vita_dir = os.path.join(base, "vita")
        os.makedirs(p3t_dir, exist_ok=True)
        os.makedirs(vita_dir, exist_ok=True)
        p3t = sorted(n for n in set(os.listdir(p3t_dir)) | set(_resource_names("skins/p3t")) if n.lower().endswith(".p3t"))
        vita = sorted(
            n for n in set(os.listdir(vita_dir)) | set(_resource_names("skins/vita"))
            if n.lower().endswith(".zip") or os.path.isfile(os.path.join(_user_resource(vita_dir, n, "skins/vita"), "theme.xml"))
        )
        return {"p3t": p3t, "vita": vita, "dir": base}

    async def get_p3t(self, name: str):
        p = _user_resource(os.path.join(_skin_dir(), "p3t"), name, "skins/p3t")
        if not os.path.isfile(p):
            return None
        try:
            return _read_p3t(p)
        except Exception as e:
            decky.logger.error(f"p3t read failed: {e}")
            return None

    async def get_vita_skin(self, name: str):
        p = _user_resource(os.path.join(_skin_dir(), "vita"), name, "skins/vita")
        if not os.path.exists(p):
            return None
        try:
            return _read_vita(p)
        except Exception as e:
            decky.logger.error(f"vita theme read failed: {e}")
            return None

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
        folder = _resource("assets/" + _safe_name(name))
        out = {}
        try:
            for n in sorted(os.listdir(folder)):
                if n.lower().endswith(IMAGE_EXT):
                    with open(os.path.join(folder, n), "rb") as f:
                        out[os.path.splitext(n)[0]] = _data_url(f.read(), _mime(n))
        except Exception:
            pass
        return out

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
                ident = "cinematic-" + name + "-" + key
                _vi.files[ident] = path
                result[key] = f"http://127.0.0.1:{_vi.port}/{_vi.token}/f/{ident}"
        return result

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

    # ───── lifecycle ─────
    async def _main(self):
        import theme_updates
        theme_updates.clear_replacement()
        import theme_store
        theme_store.recover()
        theme_store.migrate_legacy_resources()
        os.makedirs(_wall_dir(), exist_ok=True)
        os.makedirs(os.path.join(_skin_dir(), "p3t"), exist_ok=True)
        os.makedirs(os.path.join(_skin_dir(), "vita"), exist_ok=True)
        # Copy any skins bundled in the zip into the user's skins folder (never overwrites).
        for kind in ("p3t", "vita"):
            src = os.path.join(decky.DECKY_PLUGIN_DIR, "defaults", "skins", kind)
            if not os.path.isdir(src):
                continue
            for n in os.listdir(src):
                dst = os.path.join(_skin_dir(), kind, n)
                if os.path.exists(dst):
                    continue
                try:
                    sp = os.path.join(src, n)
                    if os.path.isdir(sp):
                        shutil.copytree(sp, dst)
                    else:
                        shutil.copyfile(sp, dst)
                except Exception as e:
                    decky.logger.warning(f"could not copy bundled skin {n}: {e}")
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
        try:
            if _vi.server is not None:
                _vi.server.close()
                _vi.server = None
        except Exception:
            pass

    async def _uninstall(self):
        # Decky also invokes this for manual ZIP reinstalls. User preferences and
        # installed theme resources deliberately outlive the plugin directory.
        await self._unload()
