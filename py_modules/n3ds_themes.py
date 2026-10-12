"""Nintendo 3DS HOME Menu themes: body_LZ.bin (the theme body), alone or inside a .zip / folder with
name.txt, preview.png, info.smdh and bgm.bcstm.

read_3ds_theme(path) returns one plain dict for the Deck home (pictures are PNG data URLs) or None for
anything that is not a 3DS theme. It never raises: every part is read on its own, and a part that fails
is left out and noted in "errors".

Format (checked against real themes):
  * the whole body is one LZ11 stream; decompressed it starts with a little-endian header (version 1)
    with draw types, offsets of colour blocks (3 byte RGB entries) and of raw textures;
  * textures have no header: 8x8 tiles in row order, Morton order inside a tile. Wallpapers are RGB565
    (512x256, or 1024x256 when they scroll), the visible part is the top-left 400x240 (top screen) and
    320x240 (bottom screen). Folder (128x64) and file (64x128, 32x64) textures are BGR888 and hold their
    art in the top-left corner (see _ART);
  * a 64 byte body is only a placeholder for a theme that has music alone.
No Nintendo asset is used or shipped: the reader only decodes what the user brings.
"""
import base64
import os
import struct
import zlib
import zipfile

READER_VERSION = 1

MAX_BODY = 16 * 1024 * 1024      # biggest compressed or decompressed body accepted
MAX_PIC = 3 * 1024 * 1024        # preview / icon pictures larger than this are skipped
MAX_ZIP_FILES = 2000

TOP_W, TOP_H, BOT_W, BOT_H = 400, 240, 320, 240
# art rectangle (w, h) inside each texture, measured from the template theme's guide pictures
_ART = {"folder_closed": (74, 64), "folder_open": (82, 64), "file_large": (36, 72), "file_small": (25, 49)}

_DRAW = {0: "none", 1: "solid", 2: "pattern", 3: "texture"}
_FRAME = {0: "fast", 1: "single", 2: "page", 3: "slow", 4: "bounce"}


# ───────────────────────── LZ11 ─────────────────────────
def lz11(data):
    """Decompress a Nintendo LZ11 stream (first byte 0x11). Raises ValueError on bad input."""
    if len(data) < 8 or data[0] != 0x11:
        raise ValueError("not LZ11")
    size = data[1] | data[2] << 8 | data[3] << 16
    p = 4
    if size == 0:
        size = struct.unpack_from("<I", data, 4)[0]
        p = 8
    if size > MAX_BODY:
        raise ValueError("body too large")
    out = bytearray()
    n = len(data)
    while len(out) < size:
        if p >= n:
            raise ValueError("truncated")
        flags = data[p]
        p += 1
        for i in range(8):
            if len(out) >= size:
                break
            if flags & (0x80 >> i):
                if p >= n:
                    raise ValueError("truncated")
                b0 = data[p]
                t = b0 >> 4
                if t == 0:
                    b1, b2 = data[p + 1], data[p + 2]
                    p += 3
                    ln = (((b0 & 15) << 4) | (b1 >> 4)) + 0x11
                    disp = ((b1 & 15) << 8 | b2) + 1
                elif t == 1:
                    b1, b2, b3 = data[p + 1], data[p + 2], data[p + 3]
                    p += 4
                    ln = (((b0 & 15) << 12) | (b1 << 4) | (b2 >> 4)) + 0x111
                    disp = ((b2 & 15) << 8 | b3) + 1
                else:
                    b1 = data[p + 1]
                    p += 2
                    ln = t + 1
                    disp = ((b0 & 15) << 8 | b1) + 1
                if disp > len(out):
                    raise ValueError("bad reference")
                if disp >= ln:
                    s = len(out) - disp
                    out += out[s:s + ln]
                else:
                    for _ in range(ln):
                        out.append(out[-disp])
            else:
                out.append(data[p])
                p += 1
    return bytes(out[:size])


# ───────────────────────── pictures ─────────────────────────
def _png(w, h, rgb, alpha=False):
    """A PNG file (bytes) from raw 8-bit RGB or RGBA rows."""
    ch = 4 if alpha else 3
    raw = bytearray()
    for y in range(h):
        raw.append(0)
        raw += rgb[y * w * ch:(y + 1) * w * ch]

    def chunk(t, d):
        return struct.pack(">I", len(d)) + t + d + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)

    return (b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6 if alpha else 2, 0, 0, 0))
            + chunk(b"IDAT", zlib.compress(bytes(raw), 6)) + chunk(b"IEND", b""))


def _url(png_bytes):
    return "data:image/png;base64," + base64.b64encode(png_bytes).decode("ascii")


_MORTON = []
for _i in range(64):
    _x = _y = 0
    for _b in range(3):
        _x |= ((_i >> (2 * _b)) & 1) << _b
        _y |= ((_i >> (2 * _b + 1)) & 1) << _b
    _MORTON.append((_x, _y))


def untile(data, off, w, h, bpp, kind):
    """Decode an 8x8 tiled, Morton ordered texture to RGB bytes. kind: '565' (little endian), '888' (BGR)."""
    if off < 0 or off + w * h * bpp > len(data):
        raise ValueError("texture outside the body")
    out = bytearray(w * h * 3)
    tiles_w = w // 8
    q = off
    for t in range((w // 8) * (h // 8)):
        bx, by = (t % tiles_w) * 8, (t // tiles_w) * 8
        for mx, my in _MORTON:
            if kind == "565":
                px = data[q] | data[q + 1] << 8
                r = (px >> 11 & 31) << 3
                g = (px >> 5 & 63) << 2
                b = (px & 31) << 3
                r |= r >> 5
                g |= g >> 6
                b |= b >> 5
            else:
                b, g, r = data[q], data[q + 1], data[q + 2]
            q += bpp
            o = 3 * ((by + my) * w + bx + mx)
            out[o] = r
            out[o + 1] = g
            out[o + 2] = b
    return bytes(out)


def _crop(rgb, w, cw, ch, ox=0, oy=0):
    rows = bytearray()
    for y in range(oy, oy + ch):
        s = (y * w + ox) * 3
        rows += rgb[s:s + cw * 3]
    return bytes(rows)


# ───────────────────────── files: zip, folder or loose body ─────────────────────────
class _Src:
    """Files by relative path with case-insensitive names (a zip, a folder, or one loose file)."""

    def __init__(self, path):
        self.zip = None
        self.single = None
        self.base = path
        self.names = {}  # lower-case relative path -> real relative path
        if os.path.isdir(path):
            for dp, dn, fn in os.walk(path):
                if dp[len(path):].count(os.sep) >= 3:
                    dn[:] = []
                for f in fn:
                    rel = os.path.relpath(os.path.join(dp, f), path).replace(os.sep, "/")
                    self.names[rel.lower()] = rel
                if len(self.names) > MAX_ZIP_FILES:
                    break
        elif zipfile.is_zipfile(path):
            self.zip = zipfile.ZipFile(path)
            for i in self.zip.infolist()[:MAX_ZIP_FILES]:
                f = i.filename
                if not i.is_dir() and ".." not in f.split("/") and not f.startswith("/"):
                    self.names[f.lower()] = f
        else:
            self.single = os.path.basename(path)
            self.names[self.single.lower()] = self.single

    def close(self):
        if self.zip:
            self.zip.close()

    def find(self, base, depth=2):
        """The shallowest file whose base name is `base` (lower case)."""
        best = None
        for low, real in self.names.items():
            if low.rsplit("/", 1)[-1] == base and low.count("/") <= depth:
                if best is None or low.count("/") < best.lower().count("/"):
                    best = real
        return best

    def read(self, rel, limit=MAX_BODY):
        if self.single is not None:
            with open(self.base, "rb") as f:
                return f.read(limit + 1)[:limit + 1]
        if self.zip:
            i = self.zip.getinfo(rel)
            if i.file_size > limit:
                raise ValueError("file too large")
            return self.zip.read(rel)
        with open(os.path.join(self.base, *rel.split("/")), "rb") as f:
            return f.read(limit + 1)


def _body_name(src):
    n = src.find("body_lz.bin")
    if n:
        return n
    for low, real in src.names.items():  # a body saved under another name (loose .bin, zip with one .bin)
        if low.endswith(".bin") and low.count("/") <= 2 and "bgm" not in low:
            return real
    return None


def peek(path):
    """True when the path looks like a 3DS theme (a body_LZ.bin / .bin / zip or folder holding one)."""
    try:
        s = _Src(path)
    except Exception:
        return False
    try:
        return _body_name(s) is not None
    except Exception:
        return False
    finally:
        s.close()


# ───────────────────────── meta: name.txt, info.smdh, pictures ─────────────────────────
def _utf16(b):
    return b.decode("utf-16-le", "replace").split("\0", 1)[0].strip()


def _smdh(b):
    """(title, description, publisher, icon48 rgb bytes or None) from an SMDH."""
    if len(b) < 0x2040 or b[:4] != b"SMDH":
        raise ValueError("not smdh")
    # 16 language blocks of 0x200 bytes from 0x08: short title 0x80, long title 0x100, publisher 0x80; English is 1
    title = desc = pub = ""
    for lang in (1, 0):
        o = 8 + lang * 0x200
        title, desc, pub = _utf16(b[o:o + 0x80]), _utf16(b[o + 0x80:o + 0x180]), _utf16(b[o + 0x180:o + 0x200])
        if title or desc:
            break
    icon = None
    if len(b) >= 0x24C0 + 0x1200:
        icon = untile(b, 0x24C0, 48, 48, 2, "565")
    return title, desc, pub, icon


def _pic_url(data):
    if data[:8] == b"\x89PNG\r\n\x1a\n":
        return "data:image/png;base64," + base64.b64encode(data).decode("ascii")
    if data[:3] == b"\xff\xd8\xff":
        return "data:image/jpeg;base64," + base64.b64encode(data).decode("ascii")
    return None


# ───────────────────────── the body ─────────────────────────
def _u32(d, o):
    if o < 0 or o + 4 > len(d):
        raise ValueError("header outside the body")
    return struct.unpack_from("<I", d, o)[0]


def _hex(d, o, count):
    """`count` RGB entries at offset o as '#rrggbb' strings, or None when they do not fit."""
    if o <= 0 or o + 3 * count > len(d):
        return None
    return ["#%02x%02x%02x" % (d[o + 3 * i], d[o + 3 * i + 1], d[o + 3 * i + 2]) for i in range(count)]


def _block(d, flag_off, count):
    """Colour block whose flag is at flag_off and offset right after it (None when the theme has no such block)."""
    if _u32(d, flag_off) == 0:
        return None
    return _hex(d, _u32(d, flag_off + 4), count)


def _named(vals, names):
    return dict(zip(names, vals)) if vals else None


def parse_body(body):
    """Decode a body (LZ11 compressed or already decompressed). Returns the result dict; raises ValueError."""
    d = lz11(body) if body[:1] == b"\x11" else body
    if len(d) < 0xD0 or _u32(d, 0) != 1:
        raise ValueError("not a theme body")
    errors = []
    r = {"kind": "3ds", "errors": errors, "preferred_row": d[4], "bgm": bool(d[5]), "sfx": bool(_u32(d, 0xB8))}

    def part(name, fn):
        try:
            return fn()
        except Exception as e:  # one broken part must not lose the theme
            errors.append(f"{name}: {e}")
            return None

    def screen(prefix, draw_off, frame_off, tex_off, w, h, color_off):
        draw = _DRAW.get(_u32(d, draw_off), "none")
        frame = _FRAME.get(_u32(d, frame_off), "single")
        s = {"mode": draw, "frame": frame, "scroll": frame in ("fast", "slow"), "image": None, "wide": None, "color": None}
        if draw == "texture":
            tw = 1024 if s["scroll"] else 512
            rgb = untile(d, _u32(d, tex_off), tw, 256, 2, "565")
            s["image"] = _url(_png(w, h, _crop(rgb, tw, w, h)))
            if s["scroll"]:
                s["wide"] = _url(_png(tw, h, _crop(rgb, tw, tw, h)))
        if draw in ("solid", "pattern") and color_off:
            o = _u32(d, color_off)
            c = _hex(d, o, 1)
            if c:
                s["color"] = c[0]
                if o + 5 <= len(d):
                    s["gradient"], s["opacity"] = d[o + 3], d[o + 4]
        return s

    r["top"] = part("top screen", lambda: screen("top", 0x0C, 0x10, 0x18, TOP_W, TOP_H, 0x14)) or {"mode": "none", "image": None}
    r["bottom"] = part("bottom screen", lambda: screen("bottom", 0x20, 0x24, 0x28, BOT_W, BOT_H, 0)) or {"mode": "none", "image": None}
    # colours (cursor: dark, main, light, glow; folder / file: dark, main, light, shadow; text: normal, selected)
    r["cursor"] = part("cursor colours", lambda: _named(_block(d, 0x2C, 4), ("dark", "main", "light", "glow")))
    r["folder"] = part("folder colours", lambda: _named(_block(d, 0x34, 4), ("dark", "main", "light", "shadow")))
    r["file"] = part("file colours", lambda: _named(_block(d, 0x48, 4), ("dark", "main", "light", "shadow")))
    r["text"] = part("text colours", lambda: _named(_block(d, 0x78, 2), ("main", "alt")))
    r["bottom_inner"] = part("bottom colours", lambda: _block(d, 0x80, 3))
    r["bottom_outer"] = part("bottom colours", lambda: _block(d, 0x88, 3))
    r["folder_bg"] = part("folder background", lambda: _block(d, 0x90, 3))
    if r["bottom"].get("mode") == "solid" and not r["bottom"].get("color"):
        c = r["bottom_inner"] or r["bottom_outer"]
        if c:
            r["bottom"]["color"] = c[0]

    def art(key, off_at, w, h):
        o = _u32(d, off_at)
        if not o:
            return None
        rgb = untile(d, o, w, h, 3, "888")
        aw, ah = _ART[key]
        return _url(_png(aw, ah, _crop(rgb, w, aw, ah)))

    if _u32(d, 0x3C):
        fa = {"closed": part("folder picture", lambda: art("folder_closed", 0x40, 128, 64)),
              "open": part("open folder picture", lambda: art("folder_open", 0x44, 128, 64))}
        r["folder_art"] = fa if any(fa.values()) else None
    if _u32(d, 0x50):
        fa = {"large": part("file picture", lambda: art("file_large", 0x54, 64, 128)),
              "small": part("small file picture", lambda: art("file_small", 0x58, 32, 64))}
        r["file_art"] = fa if any(fa.values()) else None
    return r


# ───────────────────────── entry point ─────────────────────────
def read_3ds_theme(path):
    """Read a .zip / folder / loose body_LZ.bin. Returns a dict, or None when it is not a 3DS theme. Never raises."""
    try:
        return _read(path)
    except Exception:
        return None


def _read(path):
    if not path or not os.path.exists(path):
        return None
    src = _Src(path)
    try:
        bn = _body_name(src)
        bgm_name = src.find("bgm.bcstm")
        if not bn:
            return None
        body = src.read(bn)
        res = None
        errors = []
        try:
            if len(body) > MAX_BODY:
                raise ValueError("body too large")
            res = parse_body(body)
        except Exception as e:
            errors.append(f"body: {e}")
        if res is None:
            # a short placeholder body means the "theme" is only music
            if len(body) <= 64:
                res = {"kind": "3ds", "bgm_only": True, "bgm": bool(bgm_name), "sfx": False, "top": {"mode": "none", "image": None},
                       "bottom": {"mode": "none", "image": None}, "cursor": None, "folder": None, "file": None, "text": None,
                       "bottom_inner": None, "bottom_outer": None, "folder_bg": None, "preferred_row": 0, "errors": []}
            else:
                return None
        res["errors"] = list(res.get("errors", [])) + errors
        res.setdefault("bgm_only", False)
        if bgm_name:
            res["bgm"] = True
            res["bgm_file"] = bgm_name
        # name, author, description, picture
        name = author = desc = ""
        icon = None
        n = src.find("name.txt")
        if n:
            try:
                name = src.read(n, 4096).decode("utf-8", "replace").strip().splitlines()[0][:120]
            except Exception:
                pass
        s = src.find("info.smdh")
        if s:
            try:
                t, desc, author, rgb = _smdh(src.read(s, 64 * 1024))
                name = name or t
                if rgb:
                    icon = _url(_png(48, 48, rgb))
            except Exception as e:
                res["errors"].append(f"smdh: {e}")
        for key, base in (("preview", "preview.png"), ("icon_png", "icon.png")):
            f = src.find(base)
            val = None
            if f:
                try:
                    val = _pic_url(src.read(f, MAX_PIC))
                except Exception:
                    val = None
            if key == "preview":
                res["preview"] = val
            elif val:
                icon = val
        res["icon"] = icon
        base = os.path.basename(path.rstrip("/\\"))
        res["name"] = name or os.path.splitext(base)[0]
        res["author"] = author
        res["description"] = desc
        return res
    finally:
        src.close()


# ───────────────────────── home badges (user pictures) ─────────────────────────
# skins/3ds-badges/<set>/<picture>: the user's own badge pictures for the 3DS home, one subfolder per set
# (loose pictures form the set "My badges"). Nothing is shipped: the home draws its own starter badges.
BADGE_EXT = {".png": "image/png", ".webp": "image/webp", ".gif": "image/gif", ".jpg": "image/jpeg", ".jpeg": "image/jpeg"}
MAX_BADGE = 512 * 1024           # bytes per picture
MAX_BADGES = 1000                # the console's own limit of unique badges
MAX_BADGE_SETS = 100             # and of badge sets
_CELLS = ((1, 1), (2, 1), (1, 2), (2, 2))


def _img_size(data):
    """(w, h) from a PNG / GIF / WebP header, or None."""
    try:
        if data[:8] == b"\x89PNG\r\n\x1a\n":
            return struct.unpack(">II", data[16:24])
        if data[:6] in (b"GIF87a", b"GIF89a"):
            return struct.unpack("<HH", data[6:10])
        if data[:4] == b"RIFF" and data[8:12] == b"WEBP":
            kind = data[12:16]
            if kind == b"VP8X":
                return 1 + int.from_bytes(data[24:27], "little"), 1 + int.from_bytes(data[27:30], "little")
            if kind == b"VP8 ":
                w, h = struct.unpack("<HH", data[26:30])
                return w & 0x3FFF, h & 0x3FFF
            if kind == b"VP8L":
                b = int.from_bytes(data[21:25], "little")
                return 1 + (b & 0x3FFF), 1 + ((b >> 14) & 0x3FFF)
    except Exception:
        pass
    return None


def _cells_suffix(stem):
    s = stem.lower()
    for sep in ("@", "_", "-", " "):
        for w, h in _CELLS:
            if s.endswith(f"{sep}{w}x{h}"):
                return w, h
    return None


def badge_cells(name, size):
    """Grid cells (w, h) a badge takes: a "@2x1" / "_1x2" / "-2x2" suffix in the file name wins, else the
    picture's shape (wide = 2x1, tall = 1x2, anything squarer = 1x1)."""
    cells = _cells_suffix(os.path.splitext(name)[0])
    if cells:
        return cells
    if size and size[0] > 0 and size[1] > 0:
        r = size[0] / size[1]
        if r >= 1.6:
            return 2, 1
        if r <= 0.625:
            return 1, 2
    return 1, 1


def _badge_title(name):
    stem = os.path.splitext(name)[0]
    if _cells_suffix(stem):
        stem = stem[:-4]
    return stem.replace("_", " ").strip() or name


def list_badges(roots):
    """{"sets": [{"name", "badges": [{"id", "name", "w", "h", "url"}]}]} from the badge folders in `roots`
    (the user's folder first: a picture of the same set and name there wins). Pictures are data URLs;
    unreadable, oversized or unknown files are skipped. Never raises."""
    found = {}  # set name -> {file name -> path}
    for root in roots:
        try:
            entries = sorted(os.listdir(root)) if root and os.path.isdir(root) else []
        except OSError:
            entries = []
        for e in entries:
            if e.startswith("."):
                continue
            p = os.path.join(root, e)
            if os.path.isdir(p):
                try:
                    files = sorted(os.listdir(p))
                except OSError:
                    continue
                for f in files:
                    if not f.startswith(".") and os.path.splitext(f)[1].lower() in BADGE_EXT:
                        found.setdefault(e, {}).setdefault(f, os.path.join(p, f))
            elif os.path.splitext(e)[1].lower() in BADGE_EXT:
                found.setdefault("My badges", {}).setdefault(e, p)
    sets, total = [], 0
    for set_name in sorted(found, key=lambda s: (s != "My badges", s.lower()))[:MAX_BADGE_SETS]:
        badges = []
        for f in sorted(found[set_name], key=str.lower):
            if total >= MAX_BADGES:
                break
            p = found[set_name][f]
            try:
                if not os.path.isfile(p) or os.path.getsize(p) > MAX_BADGE:
                    continue
                with open(p, "rb") as fh:
                    data = fh.read(MAX_BADGE + 1)
            except OSError:
                continue
            ext = os.path.splitext(f)[1].lower()
            size = _img_size(data)
            if size is None and ext not in (".jpg", ".jpeg"):
                continue  # not the picture its name says
            w, h = badge_cells(f, size)
            badges.append({"id": f"{set_name}/{f}", "name": _badge_title(f), "w": w, "h": h,
                           "url": f"data:{BADGE_EXT[ext]};base64," + base64.b64encode(data).decode("ascii")})
            total += 1
        if badges:
            sets.append({"name": set_name, "badges": badges})
    return {"sets": sets}
