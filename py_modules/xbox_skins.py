"""Original Xbox dashboard skins: UnleashX (Skin.xml) and XBMC / XBMC4Xbox (addon.xml or skin.xml).

A skin is a folder or a .zip in skins/xbox/. We read the parts the Deck home can show:
the wallpaper, a few pictures, the colours and the names. Texture archives (XBMC media/Textures.xpr,
.xbt, UnleashX .xpr pictures) are decoded to PNG by xbox_textures. Video (.wmv/.xmv) and fonts (.xpr) are only noted.

read_xbox_skin() returns None for anything that is not a skin and never raises.
"""
import base64
import io
import os
import re
import struct
import xml.etree.ElementTree as ET
from html.parser import HTMLParser
import time
import zipfile

import xbox_textures as XT

READER_VERSION = 2  # 2: texture archives (Textures.xpr / .xbt / UnleashX .xpr pictures) are decoded

_PIC = (".png", ".jpg", ".jpeg", ".bmp", ".gif", ".tga")
_MIME = {".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".gif": "image/gif"}
MAX_PIC = 3 * 1024 * 1024      # larger pictures are skipped
MAX_PICS = 40
MAX_XML = 2 * 1024 * 1024
MAX_ZIP_FILES = 4000
MAX_ARCHIVE = 64 * 1024 * 1024  # biggest Textures.xpr / .xbt read
ARCHIVE_BUDGET = 10.0           # seconds spent decoding textures of one skin
MAX_ARCHIVE_BYTES = 8 * 1024 * 1024  # PNG bytes kept from one archive


# ───────────────────────── a folder or a zip, read through one small interface ─────────────────────────
class _Src:
    """Files of a skin by relative path ('/' separators, case-insensitive lookup)."""

    def __init__(self, path):
        self.path = path
        self.zip = None
        self.root = ""  # prefix inside the zip / sub folder that holds the skin
        self.names = {}  # lower-case relative path -> real relative path
        if os.path.isdir(path):
            base = path
            for dp, dn, fn in os.walk(base):
                depth = dp[len(base):].count(os.sep)
                if depth >= 4:
                    dn[:] = []
                for f in fn:
                    rel = os.path.relpath(os.path.join(dp, f), base).replace(os.sep, "/")
                    self.names[rel.lower()] = rel
                if len(self.names) > MAX_ZIP_FILES:
                    break
        else:
            self.zip = zipfile.ZipFile(path)
            for i in self.zip.infolist()[:MAX_ZIP_FILES]:
                if not i.is_dir() and ".." not in i.filename.split("/") and not i.filename.startswith("/"):
                    self.names[i.filename.lower()] = i.filename
        self._find_root()

    def close(self):
        if self.zip:
            self.zip.close()

    def _find_root(self):
        """The folder that holds skin.xml / addon.xml (the top, or one folder down; the shallowest wins)."""
        best = None
        for low in self.names:
            base = low.rsplit("/", 1)[-1]
            if base in ("skin.xml", "addon.xml"):
                d = low[: -len(base)]
                if best is None or d.count("/") < best.count("/"):
                    best = d
        self.root = best or ""

    def has(self, rel):
        return (self.root + rel).lower() in self.names

    def size(self, rel):
        real = self.names.get((self.root + rel).lower())
        if real is None:
            return 0
        if self.zip:
            return self.zip.getinfo(real).file_size
        return os.path.getsize(os.path.join(self.path, real))

    def read(self, rel, limit=MAX_PIC):
        real = self.names.get((self.root + rel).lower())
        if real is None:
            return None
        if self.size(rel) > limit:
            return None
        if self.zip:
            return self.zip.read(real)
        with open(os.path.join(self.path, real), "rb") as f:
            return f.read()

    def listdir(self, folder=""):
        """Files directly inside `folder` (relative names)."""
        pre = (self.root + folder).lower()
        if pre and not pre.endswith("/"):
            pre += "/"
        out = []
        for low, real in self.names.items():
            if low.startswith(pre) and "/" not in low[len(pre):]:
                out.append(real[len(self.root):])
        return sorted(out, key=str.lower)

    def find(self, rel):
        """The real relative path of a file whose name matches `rel` ignoring case, or None."""
        real = self.names.get((self.root + rel).lower())
        return real[len(self.root):] if real else None


class _Lenient(HTMLParser):
    """Builds an element tree from sloppy skin XML (stray ampersands, unmatched or missing end tags)."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = ET.Element("_top")
        self.stack = [self.root]
        self.count = 0

    def handle_starttag(self, tag, attrs):
        self.count += 1
        if self.count > 50000:
            raise ValueError("too many elements")
        e = ET.SubElement(self.stack[-1], tag)
        for k, v in attrs:
            e.set(k, v or "")
        self.stack.append(e)

    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        self.stack.pop()

    def handle_endtag(self, tag):
        for i in range(len(self.stack) - 1, 0, -1):
            if self.stack[i].tag == tag:
                del self.stack[i:]
                return  # an end tag that matches nothing is ignored

    def handle_data(self, data):
        cur = self.stack[-1]
        cur.text = (cur.text or "") + data


def _parse(text):
    """Strict XML first, the lenient reader when the file is not well formed."""
    try:
        return ET.fromstring(text)
    except ET.ParseError:
        pass
    p = _Lenient()
    p.feed(text)
    p.close()
    kids = list(p.root)
    return kids[0] if kids else None


def _xml(src, rel):
    data = src.read(rel, MAX_XML)
    if data is None:
        return None
    head = data[:4096].lower()
    if b"<!doctype" in head or b"<!entity" in head:  # no entity tricks
        return None
    try:
        for enc in ("utf-8-sig", "utf-16", "latin-1"):
            try:
                text = data.decode(enc)
                break
            except UnicodeError:
                continue
        text = re.sub(r"^<\?xml[^>]*\?>", "", text.lstrip("\ufeff \t\r\n"))
        return _parse(text)
    except Exception:
        return None


def _local(tag):
    return tag.rsplit("}", 1)[-1].lower() if isinstance(tag, str) else ""


def _kids(el, name):
    return [c for c in el if _local(c.tag) == name.lower()]


def _kid(el, name):
    k = _kids(el, name)
    return k[0] if k else None


def _txt(el):
    return (el.text or "").strip() if el is not None else ""


def _attr(el, name, default=""):
    if el is None:
        return default
    for k, v in el.attrib.items():
        if k.lower() == name.lower():
            return v
    return default


# ───────────────────────── pictures ─────────────────────────
def _png_size(data):
    if data[:8] == b"\x89PNG\r\n\x1a\n" and len(data) >= 24:
        return struct.unpack(">II", data[16:24])
    return None


def _jpeg_size(data):
    if data[:2] != b"\xff\xd8":
        return None
    i = 2
    while i + 9 < len(data):
        if data[i] != 0xFF:
            i += 1
            continue
        m = data[i + 1]
        if m in (0xC0, 0xC1, 0xC2):
            h, w = struct.unpack(">HH", data[i + 5:i + 9])
            return w, h
        if m in (0xD8, 0x01) or 0xD0 <= m <= 0xD7:
            i += 2
            continue
        i += 2 + struct.unpack(">H", data[i + 2:i + 4])[0]
    return None


def _bmp_to_png(data):
    """Uncompressed 24/32-bit BMP -> PNG bytes (None for anything else)."""
    try:
        if data[:2] != b"BM":
            return None
        off, hdr, w, h, planes, bpp, comp = struct.unpack("<IIiiHHI", data[10:34])
        if comp not in (0, 3) or bpp not in (24, 32) or w <= 0 or w * abs(h) > 4096 * 4096:
            return None
        flip = h > 0
        h = abs(h)
        bytespp = bpp // 8
        stride = (w * bytespp + 3) & ~3
        rows = []
        for y in range(h):
            r = (h - 1 - y) if flip else y
            line = data[off + r * stride: off + r * stride + w * bytespp]
            if len(line) < w * bytespp:
                return None
            out = bytearray()
            for x in range(w):
                b, g, rr = line[x * bytespp], line[x * bytespp + 1], line[x * bytespp + 2]
                out += bytes((rr, g, b))
            rows.append(b"\x00" + bytes(out))
        import zlib

        def chunk(t, d):
            c = struct.pack(">I", len(d)) + t + d
            return c + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
        return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 2, 0, 0, 0))
                + chunk(b"IDAT", zlib.compress(b"".join(rows), 6)) + chunk(b"IEND", b""))
    except Exception:
        return None


def _data_url(src, rel, errors):
    """A picture of the skin as a data URL, or None. Unsupported formats are noted in `errors`."""
    ext = os.path.splitext(rel)[1].lower()
    if ext not in _PIC and ext != ".xpr":
        return None
    data = src.read(rel)
    if not data:
        return None
    if ext == ".xpr":  # UnleashX picture stored as an XPR0 texture (fonts are never shown)
        tex = [t for t in XT.xpr0_textures(data) if t[0] >= 16 and t[1] >= 16]
        if not tex:
            errors.append(f"{rel}: no picture in XPR")
            return None
        png = XT.rgba_to_png(tex[0][0], tex[0][1], tex[0][2], 3)
        if len(png) > MAX_PIC:
            return None
        return "data:image/png;base64," + base64.b64encode(png).decode("ascii")
    if ext == ".bmp":
        data = _bmp_to_png(data)
        ext = ".png"
        if not data:
            errors.append(f"{rel}: unsupported BMP")
            return None
    elif ext == ".tga":
        errors.append(f"{rel}: TGA not shown")
        return None
    mime = _MIME.get(ext)
    if data[:4] == b"\x89PNG":  # the content decides, some skins name PNG files .jpg
        mime = "image/png"
    elif data[:2] == b"\xff\xd8":
        mime = "image/jpeg"
    elif mime in ("image/png", "image/jpeg"):
        return None
    if mime is None:
        return None
    return f"data:{mime};base64," + base64.b64encode(data).decode("ascii")


def _pic_dims(src, rel):
    data = src.read(rel)
    if not data:
        return None
    if data[:4] == b"XPR0":
        tex = XT.xpr0_textures(data)
        return (tex[0][0], tex[0][1]) if tex else None
    return _png_size(data) or _jpeg_size(data)


def _color(v):
    """'0xAARRGGBB' / 'AARRGGBB' / '#RRGGBB' -> '#rrggbb' (alpha dropped); None when not a colour."""
    if not isinstance(v, str):
        return None
    t = v.strip().lower()
    if t.startswith("0x"):
        t = t[2:]
    elif t.startswith("#"):
        t = t[1:]
    if not re.fullmatch(r"[0-9a-f]{8}|[0-9a-f]{6}", t):
        return None
    return "#" + t[-6:]


def _luma(hexcol):
    r, g, b = int(hexcol[1:3], 16), int(hexcol[3:5], 16), int(hexcol[5:7], 16)
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255


# ───────────────────────── detection ─────────────────────────
def _kind(src):
    sk = src.find("skin.xml")
    if sk is None:
        ad = src.find("addon.xml")
        if ad is not None:
            root = _xml(src, ad)
            if root is not None and any(_attr(e, "point") == "xbmc.gui.skin" for e in root.iter()):
                return "xbmc"
        return None
    root = _xml(src, sk)
    if root is None:
        return None
    tag = _local(root.tag)
    if tag == "skin":
        if _kid(root, "main") is not None or _kid(root, "information") is not None or _kid(root, "filemanager") is not None:
            return "unleashx"
        if _kid(root, "defaultresolution") is not None or _kid(root, "credits") is not None:
            return "xbmc"
        return "unleashx" if root.attrib else None
    return None


def peek(path):
    """'unleashx', 'xbmc', or None; cheap (never decodes pictures)."""
    try:
        if os.path.isdir(path):
            pass
        elif not (os.path.isfile(path) and path.lower().endswith(".zip")):
            return None
        src = _Src(path)
        try:
            return _kind(src)
        finally:
            src.close()
    except Exception:
        return None


# ───────────────────────── readers ─────────────────────────
def _read_unleashx(src, res, errors):
    root = _xml(src, src.find("skin.xml"))
    res["name"] = _attr(root, "name") or res["name"]
    info = _kid(root, "information")
    if info is not None:
        res["author"] = _txt(_kid(info, "author"))
        res["version"] = _txt(_kid(info, "version"))
        res["description"] = _txt(_kid(info, "copyright"))
    main = _kid(root, "main")
    colors, pics, videos, fonts = [], [], [], []

    def note(name, tag=""):
        low = name.lower()
        if low.endswith((".wmv", ".xmv", ".avi", ".mpg", ".mp4")):
            videos.append(name)
        elif low.endswith(".xpr"):
            (pics if tag in ("background", "image") else fonts).append(name)
        elif low.endswith(_PIC):
            pics.append(name)

    # picture names mentioned by the screens, in order: Main first, then File Manager, Loading
    for scope, key in ((main, "main"), (_kid(root, "filemanager"), "filemanager"), (_kid(root, "loadingscreen"), "loading")):
        if scope is None:
            continue
        for e in scope.iter():
            t = _local(e.tag)
            if t in ("background", "image") and _txt(e):
                note(_txt(e), t)
                if t == "background" and _txt(e).lower().endswith(_PIC + (".xpr",)):
                    res["screens"].setdefault(key, _txt(e))
            for a in ("BackColor", "Color", "ForeColor", "BorderColor", "BackColor2"):
                c = _color(_attr(e, a))
                if c:
                    colors.append((t, a.lower(), c))
    shapes_bg = [c for (t, a, c) in colors if t == "shape" and a == "backcolor"]

    # wallpaper: the Main background picture, else the biggest Main picture, else the File Manager one
    cand = []
    if main is not None:
        b = _kid(main, "background")
        if b is not None and _txt(b).lower().endswith(_PIC + (".xpr",)):
            cand.append(_txt(b))
    for k in ("main", "filemanager", "loading"):
        if res["screens"].get(k):
            cand.append(res["screens"][k])
    for n in cand:
        u = _data_url(src, n, errors)
        if u:
            res["background"] = u
            res["backgrounds"].append(u)
            break
    if not res["background"] and main is not None:  # a solid first rectangle is the wallpaper (e.g. Grid)
        for e in main.iter():
            if _local(e.tag) == "shape" and _attr(e, "Type").lower() == "rectangle":
                w, h = _attr(e, "Width"), _attr(e, "Height")
                c = _color(_attr(e, "BackColor"))
                if c and w.isdigit() and h.isdigit() and int(w) >= 600 and int(h) >= 440:
                    res["bgColor"] = c
                    break
    # extra pictures
    for n in pics:
        if len(res["images"]) >= MAX_PICS:
            break
        u = _data_url(src, n, errors)
        if u and n not in res["images"]:
            res["images"][n] = u
            if u not in res["backgrounds"] and len(res["backgrounds"]) < 6:
                d = _pic_dims(src, n)
                if d and d[0] >= 480:
                    res["backgrounds"].append(u)
    # preview / screenshots
    for n in ("Preview.jpg", "preview.png", "preview.jpg"):
        if src.has(n):
            res["preview"] = _data_url(src, n, errors)
            break
    if not res["preview"]:
        for f in src.listdir("screenshots"):
            if f.lower().endswith(_PIC):
                res["preview"] = _data_url(src, f, errors)
                if res["preview"]:
                    break
    # menu text colour: the Menu's Color attributes
    menu = _kid(main, "menu") if main is not None else None
    for e in (menu.iter() if menu is not None else []):
        for a in ("Color", "TextColor", "ForeColor"):
            c = _color(_attr(e, a))
            if c and "text" not in res["colors"]:
                res["colors"]["text"] = c
        for a in ("HighLightColor", "HighlightColor", "SelectedColor", "FocusColor"):
            c = _color(_attr(e, a))
            if c and "highlight" not in res["colors"]:
                res["colors"]["highlight"] = c
    if "text" not in res["colors"]:
        txt = [c for (t, a, c) in colors if t == "text" and a == "color"]
        if txt:
            res["colors"]["text"] = txt[0]
    if shapes_bg:
        res["colors"].setdefault("accent", next((c for c in shapes_bg if 0.08 < _luma(c) < 0.95), shapes_bg[0]))
    res["font"] = fonts[0] if fonts else ""
    res["video"] = videos[0] if videos else ""


def _read_xbmc(src, res, errors):
    ad = src.find("addon.xml")
    if ad is not None:
        root = _xml(src, ad)
        if root is not None:
            res["name"] = _attr(root, "name") or res["name"]
            res["author"] = _attr(root, "provider-name")
            res["version"] = _attr(root, "version")
            for e in root.iter():
                if _local(e.tag) == "summary" and _txt(e):
                    res["description"] = _txt(e)
                    break
    sk = src.find("skin.xml")
    if sk is not None:
        root = _xml(src, sk)
        if root is not None:
            cr = _kid(root, "credits")
            if cr is not None:
                res["name"] = _txt(_kid(cr, "skinname")) or res["name"]
                names = [_txt(n) for n in _kids(cr, "name") if _txt(n)]
                if names and not res["author"]:
                    res["author"] = names[0]
            v = _txt(_kid(root, "version"))
            if v and not res["version"]:
                res["version"] = v
    # colours: colors/defaults.xml names -> '#rrggbb'
    cols = {}
    for f in ("colors/defaults.xml", "colors/Defaults.xml"):
        croot = _xml(src, f) if src.find(f) else None
        if croot is not None:
            for e in croot.iter():
                if _local(e.tag) == "color":
                    c = _color(_txt(e))
                    if c and _attr(e, "name"):
                        cols[_attr(e, "name").lower()] = c
            break
    for key, names in (("text", ("white", "text", "textcolor", "focusedcolor")),
                       ("highlight", ("highlight", "selected", "blue", "green", "orange", "accent", "focus")),
                       ("accent", ("accent", "highlight", "blue", "green", "orange", "red"))):
        for n in names:
            if n in cols:
                res["colors"][key] = cols[n]
                break
    # wallpapers: backgrounds/ (default first), then big pictures in media/ and the skin root
    cands = []
    for f in src.listdir("backgrounds"):
        if f.lower().endswith(_PIC) and "alpha" not in f.lower():
            cands.append(f)
    cands.sort(key=lambda f: (0 if os.path.basename(f).lower().startswith(("default", "home", "background")) else 1, f.lower()))
    cands += [f for f in src.listdir("media") if f.lower().endswith(_PIC)]
    cands += [f for f in src.listdir("") if f.lower().endswith(_PIC) and not f.lower().startswith("default.tbn")]
    for f in cands:
        if len(res["images"]) >= MAX_PICS:
            break
        u = _data_url(src, f, errors)
        if not u:
            continue
        res["images"][f] = u
        d = _pic_dims(src, f)
        in_bg = f.lower().startswith("backgrounds/")
        if d and (d[0] >= 640 or (in_bg and d[0] >= 256)) and len(res["backgrounds"]) < 6:
            res["backgrounds"].append(u)
    if res["backgrounds"]:
        res["background"] = res["backgrounds"][0]
    # preview: default.tbn is a PNG/JPEG with another extension
    for n in ("preview.png", "preview.jpg", "screenshot.png", "screenshot.jpg", "default.tbn"):
        real = src.find(n)
        if not real:
            for f in src.listdir("screenshots"):
                if f.lower().endswith(_PIC):
                    real = f
                    break
        if real:
            data = src.read(real)
            if data and data[:4] == b"\x89PNG":
                res["preview"] = "data:image/png;base64," + base64.b64encode(data).decode("ascii")
            elif data and data[:2] == b"\xff\xd8":
                res["preview"] = "data:image/jpeg;base64," + base64.b64encode(data).decode("ascii")
            if res["preview"]:
                break
    # console texture archives: Textures.xpr / Textures.xbt (the wallpaper only when no picture file gave one)
    try:
        _read_archives(src, res, errors)
    except Exception as e:
        errors.append(f"texture archive stopped: {e}")


_BG_NAME = re.compile(r"background|bkgd|wallpaper|fanart|splash|^bg|^home|^default\.|^default[-_]?(?:bg|background)", re.I)
_NOT_BG = re.compile(r"overlay|wash|mask|fade|shadow|alpha|tile|focus|nofocus|-nf|-fo|_nf|_fo|button|icon|logo|dialog|arrow|scroll|fallback", re.I)


def _archive_files(src):
    return [f for f in src.listdir("media") if f.lower().endswith((".xpr", ".xbt"))]


def _read_archives(src, res, errors):
    arch = _archive_files(src)
    if not arch:
        return
    t0 = time.time()
    kept = 0
    got_any = False
    seen_bg = []
    for f in arch:
        if src.size(f) > MAX_ARCHIVE:
            errors.append(f"{os.path.basename(f)}: archive too large")
            continue
        data = src.read(f, MAX_ARCHIVE)
        if not data:
            continue
        if data[:4] == b"XBTF":
            names = [(n, fr[0][0] * fr[0][1]) for n, fr in (XT.xbt_entries(data) or []) if fr]
            iterate = XT.iter_xbt
        elif data[:3] == b"XPR" and data[:4] != b"XPR0":
            names = [(n, u) for n, _o, u, _p in (XT.xbmc_xpr_entries(data) or [])]
            iterate = XT.iter_xbmc_xpr
        elif data[:4] == b"XPR0":
            for i, (w, h, rgba) in enumerate(XT.xpr0_textures(data)):
                if w >= 16 and h >= 16 and len(res["images"]) < MAX_PICS:
                    png = XT.rgba_to_png(w, h, rgba, 3)
                    if len(png) <= MAX_PIC:
                        res["images"][f"{os.path.splitext(os.path.basename(f))[0]}-{i}.png"] = "data:image/png;base64," + base64.b64encode(png).decode("ascii")
                        got_any = True
            continue
        else:
            errors.append(f"{os.path.basename(f)}: unknown texture archive")
            continue
        if not names:
            errors.append(f"{os.path.basename(f)}: empty or unreadable archive")
            continue
        # which textures to decode: wallpaper candidates first, then the biggest others
        def key(item):
            n, sz = item
            base = n.replace("\\", "/").rsplit("/", 1)[-1]
            bg = n.replace("\\", "/").lower().startswith("backgrounds/") or (bool(_BG_NAME.search(base)) and not _NOT_BG.search(base))
            return (0 if bg else 1, -sz)
        order = [n for n, _ in sorted(names, key=key)]
        want = set(order[:MAX_PICS * 2])
        for name, w, h, rgba in iterate(data, wanted=lambda n, u: n in want):
            if time.time() - t0 > ARCHIVE_BUDGET or len(res["images"]) >= MAX_PICS or kept > MAX_ARCHIVE_BYTES:
                break
            if w < 24 or h < 24:
                continue
            png = XT.rgba_to_png(w, h, rgba, 3)
            if len(png) > MAX_PIC:
                errors.append(f"{name}: too large to show")
                continue
            kept += len(png)
            nm = name.replace("\\", "/")
            url = "data:image/png;base64," + base64.b64encode(png).decode("ascii")
            res["images"][nm] = url
            got_any = True
            base = nm.rsplit("/", 1)[-1]
            if w >= 640 and (nm.lower().startswith("backgrounds/") or (_BG_NAME.search(base) and not _NOT_BG.search(base))):
                seen_bg.append((0 if nm.lower().startswith("backgrounds/") else 1, -w * h, nm, url))
        if not got_any:
            errors.append(f"{os.path.basename(f)}: no texture could be decoded")
    seen_bg.sort()
    for _p, _a, nm, url in seen_bg[:6]:
        if url not in res["backgrounds"]:
            res["backgrounds"].append(url)
    if seen_bg and not res["background"]:
        res["background"] = seen_bg[0][3]


def read_xbox_skin(path):
    """The skin at `path` (folder or .zip) as a dict, or None. Never raises."""
    src = None
    try:
        if os.path.isdir(path):
            pass
        elif not (os.path.isfile(path) and path.lower().endswith(".zip")):
            return None
        src = _Src(path)
        kind = _kind(src)
        if kind is None:
            return None
        nm = os.path.basename(path.rstrip("/\\"))
        nm = re.sub(r"\.zip$", "", nm, flags=re.I)
        res = {"kind": kind, "name": nm, "author": "", "version": "", "description": "", "background": None, "bgColor": None,
               "backgrounds": [], "images": {}, "colors": {}, "font": "", "video": "", "preview": None, "screens": {}, "errors": []}
        errors = res["errors"]
        try:
            (_read_unleashx if kind == "unleashx" else _read_xbmc)(src, res, errors)
        except Exception as e:  # keep what was read
            errors.append(f"skin read stopped: {e}")
        res["images"] = {k: v for k, v in list(res["images"].items())[:MAX_PICS]}
        res.pop("screens", None)
        return res
    except Exception:
        return None
    finally:
        if src is not None:
            src.close()
