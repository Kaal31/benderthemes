"""Xbox 360 theme packages (STFS: CON / LIVE / PIRS) -> plain dict for the frontend.

Our own minimal reader, written from the public STFS layout notes (Free60 wiki); no code
was taken from other readers. It only READS: it lists the package's files, takes the title
and thumbnail from the header and pulls pictures out of the files.

Content types handled: Theme (0x00030000) and Gamer Picture (0x00020000).
Anything else, or a file that is not STFS, gives None. Nothing here raises to the caller.

Status: checked against ~230 real packages (LIVE / PIRS / CON; Blades-era, NXE, premium layered and Metro/Kinect-era
themes; single and multi-picture gamer picture packs). What the real ones taught us:
  * the Theme content type is 0x00030000 (not 0x00050000) -- every real theme was rejected before that;
  * a theme is a handful of files: DashStyle (4 bytes, big-endian: 1 = Blades-era, 2 = NXE-only, 0 = any),
    GuideTile.png, Wallpaper1..4 (Home, Game Library, Media, System Settings), plus for the premium (layered) ones
    Background/Midground/Foreground/Banner/FloorLayerN.png, ChannelBackgroundBanner.png and parameters.ini;
  * wallpapers are PNG or JPEG files without an extension; the layer pictures are NOT wallpapers;
  * gamer picture packs hold a 32 px and a 64 px copy of each picture (and sometimes 10-20 pictures).

Pictures:
  * PNG / JPEG / BMP files are used as they are;
  * DDS files (DXT1 / DXT3 / DXT5, linear) are decoded to PNG;
  * files in other containers (for example the .xzp / .xur UI archives of premium themes)
    are scanned for embedded PNG / JPEG / DDS pictures, because their own layout is not
    documented well enough for us to parse safely.
Xenos-tiled textures are not decoded here (tools/decode_xbox_texture.py is the starting point).
"""
import base64
import struct
import zlib

READER_VERSION = 2

CT_GAMER_PICTURE = 0x00020000
CT_THEME = 0x00030000   # STFS content type "Theme" (real Marketplace themes checked: 0x30000; 0x50000 is "Storage Download")
_MAGICS = (b"CON ", b"LIVE", b"PIRS")
BLOCK = 0x1000
MAX_FILE = 48 * 1024 * 1024   # never read more than this per file
MAX_PICS = 40
MAX_PIC_FILE = 24 * 1024 * 1024
SECTIONS = ("home", "games", "media", "system")   # Wallpaper1..4
_LAYER_WORDS = ("layer", "banner", "guidetile", "gameimage")


# ───────────────────────── STFS container ─────────────────────────
class _Stfs:
    def __init__(self, f):
        self.f = f
        f.seek(0)
        h = f.read(0x6000)
        if len(h) < 0x400 or h[:4] not in _MAGICS:
            raise ValueError("not STFS")
        h = h.ljust(0x6000, b"\x00")          # a cut-off header just reads as zeros
        self.magic = h[:4].decode("ascii")
        self.header_size = struct.unpack(">I", h[0x340:0x344])[0]
        self.content_type = struct.unpack(">I", h[0x344:0x348])[0]
        self.title_id = struct.unpack(">I", h[0x360:0x364])[0]
        vd = 0x379
        self.block_sep = h[vd + 2]
        self.ft_blocks = struct.unpack("<H", h[vd + 3:vd + 5])[0]
        self.ft_start = int.from_bytes(h[vd + 5:vd + 8], "little")
        self.total_blocks = struct.unpack(">I", h[vd + 0x1C:vd + 0x20])[0]
        self.name = _utf16(h[0x411:0x411 + 0x80])
        self.description = _utf16(h[0xD11:0xD11 + 0x80])
        self.publisher = _utf16(h[0x1611:0x1611 + 0x80])
        self.title_name = _utf16(h[0x1691:0x1691 + 0x80])
        t_sz, tt_sz = struct.unpack(">II", h[0x1712:0x171A])
        self.thumb = h[0x171A:0x171A + t_sz] if 0 < t_sz <= 0x4000 else b""
        self.first = (self.header_size + 0xFFF) & ~0xFFF
        if not 0x2000 <= self.first <= 0x10000:      # nonsense header size: the usual one
            self.first = 0xA000
        f.seek(0, 2)
        self.size = f.tell()
        self.est_blocks = max((self.size - 0x2000) // BLOCK, 0)   # no chain can point past the end of the file
        self.files = []
        self._layout = None
        self._open_file_table()

    # one hash-table block (or two, in the "male" layout) sits in front of every 0xAA data blocks
    def _addr(self, n, sep):
        b = n + ((n // 0xAA) + 1) * sep
        if n >= 0xAA:
            b += ((n // 0x70E4) + 1) * sep
        if n >= 0x70E4:
            b += sep
        return self.first + b * BLOCK

    def _read_block(self, n, sep):
        a = self._addr(n, sep)
        if a + BLOCK > self.size or n < 0:
            return b""
        self.f.seek(a)
        return self.f.read(BLOCK)

    def _next(self, n, sep):
        """Next block of a chain, from the level-0 hash table in front of block n's group.

        None = unknown (entry unused, table missing or the pointer is nonsense).  With two-block tables
        there are two copies of each table: the one named by bit 1 of the block-separation byte is the
        current one, the other is tried when that entry is unused."""
        if n < 0:
            return None
        grp = (n // 0xAA) * 0xAA
        base = self._addr(grp, sep) - sep * BLOCK
        alts = list(range(sep))
        if sep == 2 and (self.block_sep >> 1) & 1:
            alts.reverse()
        for alt in alts:
            a = base + alt * BLOCK
            if a < 0 or a + BLOCK > self.size:
                continue
            self.f.seek(a + (n - grp) * 0x18 + 0x14)
            e = self.f.read(4)
            if len(e) < 4 or e[0] == 0:           # status 0 = entry not in use
                continue
            nxt = int.from_bytes(e[1:4], "big")
            if nxt == 0xFFFFFF or nxt < self.est_blocks:
                return nxt
        return None

    def _chain(self, start, count, consecutive, sep):
        """The `count` blocks of a file: a straight run, or followed through the hash tables."""
        if count <= 0:
            return []
        if consecutive:
            return list(range(start, start + count))
        out, seen, n = [], set(), start
        while n != 0xFFFFFF and len(out) < count and 0 <= n < 0xFFFFF0 and n not in seen:
            out.append(n)
            seen.add(n)
            n = self._next(n, sep)
            if n is None:
                break
        if len(out) < count:      # chain not readable: fall back to "in a row"
            return list(range(start, start + count))
        return out

    def _open_file_table(self):
        seps = [1, 2] if self.block_sep & 1 else [2, 1]
        rounded = self.first
        tried = []
        for sep in seps:
            # data block 0 is at 0xC000 in every package seen so far; the header size says the same for the usual headers
            for first in (rounded, 0xC000 - sep * BLOCK):
                if (first, sep) in tried:
                    continue
                tried.append((first, sep))
                self.first = first
                try:
                    files = self._parse_table(sep)
                except Exception:
                    files = None
                if files:
                    self.files, self._layout = files, sep
                    return
        self.first = rounded
        raise ValueError("no readable file table")

    def _parse_table(self, sep):
        n_blocks = min(self.ft_blocks or 1, 512)
        parts = []
        for i in self._chain(self.ft_start, n_blocks, False, sep):
            b = self._read_block(i, sep)
            if not b:
                break
            parts.append(b)
        data = b"".join(parts)
        files, ok = [], 0
        for i in range(0, len(data) - 0x3F, 0x40):
            e = data[i:i + 0x40]
            nl = e[0x28] & 0x3F
            if nl == 0:
                break
            name = e[:nl].decode("latin-1", "replace")
            if nl > 40 or not all(32 <= ord(c) < 127 for c in name):
                if not files:
                    return None       # the very first entry is nonsense: wrong layout
                break                 # later nonsense: keep what was read
            files.append({
                "name": name,
                "dir": bool(e[0x28] & 0x80),
                "consecutive": bool(e[0x28] & 0x40),
                "blocks": int.from_bytes(e[0x29:0x2C], "little"),
                "start": int.from_bytes(e[0x2F:0x32], "little"),
                "parent": struct.unpack(">H", e[0x32:0x34])[0],
                "size": struct.unpack(">I", e[0x34:0x38])[0],
            })
            ok += 1
        if not ok:
            return None
        for i, fl in enumerate(files):          # full paths
            parts, cur, guard = [fl["name"]], fl["parent"], 0
            while cur != 0xFFFF and 0 <= cur < len(files) and guard < 16:
                parts.append(files[cur]["name"])
                cur = files[cur]["parent"]
                guard += 1
            fl["path"] = "/".join(reversed(parts))
        # sanity check: the first real file must start inside the package
        for fl in files:
            if not fl["dir"] and fl["size"]:
                if self._addr(fl["start"], sep) + BLOCK > self.size + BLOCK * 2:
                    return None
        return files

    def read(self, fl, limit=MAX_FILE):
        if fl["dir"] or fl["size"] <= 0 or fl["size"] > limit:
            return b""
        sep = self._layout
        count = (fl["size"] + BLOCK - 1) // BLOCK
        out = bytearray()
        for n in self._chain(fl["start"], count, fl["consecutive"], sep):
            out += self._read_block(n, sep)
            if len(out) >= fl["size"]:
                break
        return bytes(out[:fl["size"]])


def _utf16(b):
    try:
        return b.decode("utf-16-be", "ignore").split("\x00")[0].strip()
    except Exception:
        return ""


# ───────────────────────── pictures ─────────────────────────
def _png(w, h, rgba):
    def chunk(t, d):
        c = struct.pack(">I", len(d)) + t + d
        return c + struct.pack(">I", zlib.crc32(t + d) & 0xFFFFFFFF)
    raw = b"".join(b"\x00" + rgba[y * w * 4:(y + 1) * w * 4] for y in range(h))
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, 6, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 6)) + chunk(b"IEND", b"")


def _c565(c):
    r, g, b = (c >> 11) & 31, (c >> 5) & 63, c & 31
    return (r * 255 // 31, g * 255 // 63, b * 255 // 31)


MAX_DDS_SIDE = 2048


def dds_to_png(d):
    """Linear DXT1 / DXT3 / DXT5 / uncompressed 32-bit DDS -> PNG bytes (None if not supported)."""
    if len(d) < 128 or d[:4] != b"DDS ":
        return None
    h, w = struct.unpack("<II", d[12:20])
    if not (0 < w <= MAX_DDS_SIDE and 0 < h <= MAX_DDS_SIDE):
        return None      # the pure-Python decode of anything bigger takes far too long
    fcc = d[84:88]
    pos = 128
    out = bytearray(w * h * 4)
    if fcc in (b"DXT1", b"DXT3", b"DXT5"):
        bs = 8 if fcc == b"DXT1" else 16
        bw, bh = (w + 3) // 4, (h + 3) // 4
        if len(d) < pos + bw * bh * bs:
            return None
        for by in range(bh):
            for bx in range(bw):
                o = pos + (by * bw + bx) * bs
                cb = o if bs == 8 else o + 8
                c0, c1 = struct.unpack("<HH", d[cb:cb + 4])
                p0, p1 = _c565(c0), _c565(c1)
                if c0 > c1 or fcc != b"DXT1":
                    pal = [p0 + (255,), p1 + (255,),
                           tuple((2 * a + b) // 3 for a, b in zip(p0, p1)) + (255,),
                           tuple((a + 2 * b) // 3 for a, b in zip(p0, p1)) + (255,)]
                else:
                    pal = [p0 + (255,), p1 + (255,), tuple((a + b) // 2 for a, b in zip(p0, p1)) + (255,), (0, 0, 0, 0)]
                idx = struct.unpack("<I", d[cb + 4:cb + 8])[0]
                alpha = None
                if fcc == b"DXT3":
                    alpha = int.from_bytes(d[o:o + 8], "little")
                elif fcc == b"DXT5":
                    a0, a1 = d[o], d[o + 1]
                    ap = [a0, a1] + ([(( 6 - i) * a0 + (1 + i) * a1) // 7 for i in range(6)] if a0 > a1 else [((4 - i) * a0 + (1 + i) * a1) // 5 for i in range(4)] + [0, 255])
                    abits = int.from_bytes(d[o + 2:o + 8], "little")
                for py in range(4):
                    for px in range(4):
                        x, y = bx * 4 + px, by * 4 + py
                        if x >= w or y >= h:
                            continue
                        k = py * 4 + px
                        r, g, b, a = pal[(idx >> (2 * k)) & 3]
                        if fcc == b"DXT3":
                            a = ((alpha >> (4 * k)) & 15) * 17
                        elif fcc == b"DXT5":
                            a = ap[(abits >> (3 * k)) & 7]
                        q = (y * w + x) * 4
                        out[q:q + 4] = bytes((r, g, b, a))
        return _png(w, h, bytes(out))
    bpp = struct.unpack("<I", d[88:92])[0]
    if bpp == 32 and len(d) >= pos + w * h * 4:
        rm, gm, bm, am = struct.unpack("<IIII", d[92:108])
        px = d[pos:pos + w * h * 4]
        sh = lambda m: {0xFF: 0, 0xFF00: 8, 0xFF0000: 16, 0xFF000000: 24}.get(m, 0)
        for i in range(0, w * h * 4, 4):
            v = int.from_bytes(px[i:i + 4], "little")
            out[i:i + 4] = bytes(((v >> sh(rm)) & 255, (v >> sh(gm)) & 255, (v >> sh(bm)) & 255, ((v >> sh(am)) & 255) if am else 255))
        return _png(w, h, bytes(out))
    return None


def _png_size(d):
    if len(d) > 24 and d[:8] == b"\x89PNG\r\n\x1a\n":
        return struct.unpack(">II", d[16:24])
    return None


def _jpeg_size(d):
    if d[:3] != b"\xff\xd8\xff":
        return None
    i = 2
    while i + 9 < len(d):
        if d[i] != 0xFF:
            i += 1
            continue
        m = d[i + 1]
        if m in (0xD8, 0x01) or 0xD0 <= m <= 0xD7:
            i += 2
            continue
        ln = struct.unpack(">H", d[i + 2:i + 4])[0]
        if 0xC0 <= m <= 0xCF and m not in (0xC4, 0xC8, 0xCC):
            h, w = struct.unpack(">HH", d[i + 5:i + 9])
            return w, h
        i += 2 + ln
    return None


def _as_picture(d):
    """(mime, bytes, w, h) for PNG / JPEG / DDS data, else None."""
    s = _png_size(d)
    if s:
        return "image/png", d, s[0], s[1]
    s = _jpeg_size(d)
    if s:
        return "image/jpeg", d, s[0], s[1]
    if d[:4] == b"DDS ":
        p = dds_to_png(d)
        if p:
            s = _png_size(p)
            return "image/png", p, s[0], s[1]
    if d[:2] == b"BM" and len(d) > 26:       # BMP: leave it to the browser
        w, h = struct.unpack("<ii", d[18:26])
        return "image/bmp", d, abs(w), abs(h)
    return None


def _carve(d, limit=12):
    """Pictures embedded in an unknown container: look for PNG / JPEG / DDS signatures."""
    out = []
    i = 0
    while len(out) < limit:
        hits = [(d.find(m, i), m) for m in (b"\x89PNG\r\n\x1a\n", b"\xff\xd8\xff\xe0", b"\xff\xd8\xff\xdb", b"DDS |\x00\x00\x00")]
        hits = [h for h in hits if h[0] >= 0]
        if not hits:
            break
        pos, m = min(hits)
        i = pos + 4
        if m.startswith(b"\x89PNG"):
            e = d.find(b"IEND", pos)
            chunk = d[pos:e + 8] if e > 0 else b""
        elif m.startswith(b"\xff\xd8"):
            e = d.find(b"\xff\xd9", pos + 100)
            chunk = d[pos:e + 2] if e > 0 else b""
        else:
            # DDS: header 128 bytes + the main level; take what fits for DXT sizes
            h, w = struct.unpack("<II", d[pos + 12:pos + 20]) if pos + 20 <= len(d) else (0, 0)
            bs = 8 if d[pos + 84:pos + 88] == b"DXT1" else 16
            n = 128 + ((w + 3) // 4) * ((h + 3) // 4) * bs if d[pos + 84:pos + 88] in (b"DXT1", b"DXT3", b"DXT5") else 128 + w * h * 4
            chunk = d[pos:pos + n]
        if chunk:
            try:
                p = _as_picture(chunk)
            except Exception:
                p = None
            if p:
                out.append(p)
                i = pos + max(len(chunk), 4)
    return out


def _url(mime, data):
    return f"data:{mime};base64," + base64.b64encode(data).decode("ascii")


# ───────────────────────── public ─────────────────────────
def read_x360(path):
    """Read an Xbox 360 theme / gamer picture package. Returns a dict, or None if it is not one."""
    try:
        with open(path, "rb") as f:
            try:
                pk = _Stfs(f)
            except Exception:
                return None
            if pk.content_type not in (CT_THEME, CT_GAMER_PICTURE):
                return None
            kind = "gamerpic" if pk.content_type == CT_GAMER_PICTURE else "theme"
            res = {
                "kind": kind, "name": pk.name or pk.title_name or "", "description": pk.description,
                "titleName": pk.title_name, "publisher": pk.publisher, "titleId": f"{pk.title_id:08X}",
                "package": pk.magic.strip(), "files": [], "pictures": [], "backgrounds": [], "icons": {},
                "preview": None, "gamerpic": None, "gamerpics": [], "background": None, "sections": {}, "dashStyle": None,
                "params": {}, "premium": False, "errors": [],
            }
            tp = _as_picture(pk.thumb) if pk.thumb else None
            if tp:
                res["preview"] = _url(tp[0], tp[1])
            pics = []
            # wallpapers first, so the picture cap can never cut them off
            order = sorted((fl for fl in pk.files if not fl["dir"]), key=lambda fl: (not _is_wall_name(fl["name"]), _natural(fl["name"])))
            for fl in order:
                res["files"].append({"path": fl["path"], "size": fl["size"]})
            res["files"].sort(key=lambda x: _natural(x["path"]))
            small = {}
            for fl in order:
                nm = fl["name"].lower()
                try:
                    if nm == "dashstyle" and fl["size"] == 4:
                        res["dashStyle"] = int.from_bytes(pk.read(fl)[:4], "big")
                        continue
                    if nm.endswith(".ini") and fl["size"] <= 4096:
                        res["params"] = _parse_ini(pk.read(fl, 4096))
                        continue
                    if len(pics) >= MAX_PICS or fl["size"] > MAX_PIC_FILE:
                        continue
                    d = pk.read(fl)
                    p = _as_picture(d) if d else None
                    if p:
                        pics.append((fl["path"],) + p)
                    elif d and not nm.endswith((".ini", ".xlast", ".txt", ".xml")):
                        for j, c in enumerate(_carve(d)):
                            pics.append((f"{fl['path']}#{j}",) + c)
                except Exception as e:
                    res["errors"].append(f"{fl['path']}: {e}")
            pics = pics[:MAX_PICS]
            res["pictures"] = [{"path": p[0], "w": p[3], "h": p[4]} for p in pics]
            if kind == "gamerpic":
                cand = [p for p in pics if 32 <= p[3] <= 512 and abs(p[3] - p[4]) <= p[3] // 4]
                if cand:
                    big = max(p[3] for p in cand)
                    best = next(p for p in cand if p[3] == big)
                    res["gamerpic"] = _url(best[1], best[2])
                    res["gamerpics"] = [_url(p[1], p[2]) for p in cand if p[3] == big][:MAX_PICS]
                elif res["preview"]:
                    res["gamerpic"] = res["preview"]
                    res["gamerpics"] = [res["preview"]]
                return res
            # theme: Wallpaper1..4 = Home, Game Library, Media Library, System Settings (in file-name order)
            named = [p for p in pics if _is_wall_name(p[0]) and p[3] >= 320]
            named.sort(key=lambda p: _natural(p[0]))
            if named:
                walls = named
            else:       # no such files: the large, roughly widescreen pictures that are not layers (biggest first)
                walls = [p for p in pics if p[3] >= 640 and 1.2 <= p[3] / max(p[4], 1) <= 2.4 and not any(w in p[0].lower() for w in _LAYER_WORDS)]
                walls.sort(key=lambda p: -p[3] * p[4])
            res["backgrounds"] = [_url(p[1], p[2]) for p in walls[:6]]
            res["background"] = res["backgrounds"][0] if res["backgrounds"] else None
            res["sections"] = {SECTIONS[i]: res["backgrounds"][i] for i in range(min(len(SECTIONS), len(res["backgrounds"])))}
            res["premium"] = sum(1 for p in pics if "layer" in p[0].lower()) >= 3
            gt = next((p for p in pics if p[0].lower().startswith("guidetile")), None)
            if gt:
                res["icons"]["guideTile"] = _url(gt[1], gt[2])
            return res
    except Exception:
        return None


def _is_wall_name(n):
    n = n.lower().rsplit("/", 1)[-1]
    return n.startswith("wallpaper") and n[9:].split(".")[0].isdigit()


def _natural(n):
    import re
    return [int(t) if t.isdigit() else t for t in re.split(r"(\d+)", n.lower())]


def _parse_ini(d):
    out = {}
    for ln in d.decode("latin-1", "replace").splitlines()[:40]:
        k, sep, v = ln.partition("=")
        if sep and k.strip():
            out[k.strip()[:40]] = v.strip()[:80]
    return out


def peek(path):
    """Cheap check for lists: "theme", "gamerpic" or None (reads 4 KB, no decoding)."""
    try:
        with open(path, "rb") as f:
            h = f.read(0x348)
        if len(h) < 0x348 or h[:4] not in _MAGICS:
            return None
        ct = struct.unpack(">I", h[0x344:0x348])[0]
        return {CT_THEME: "theme", CT_GAMER_PICTURE: "gamerpic"}.get(ct)
    except Exception:
        return None


def peek_name(path):
    """Display name from the package header (4 KB read), "" when there is none: real packages are named like F8E5B41D... on disk."""
    try:
        with open(path, "rb") as f:
            h = f.read(0x500)
        if len(h) < 0x500 or h[:4] not in _MAGICS:
            return ""
        return _utf16(h[0x411:0x411 + 0x80])[:80]
    except Exception:
        return ""


def summary(res):
    """One line for corpus runs."""
    if not res:
        return "not a theme package"
    return f"{res['kind']} '{res['name']}' files={len(res['files'])} pics={len(res['pictures'])} walls={len(res['backgrounds'])} preview={bool(res['preview'])}"
