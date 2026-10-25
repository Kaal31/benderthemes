"""Wii System Menu themes: MyMenuify .mym packages and .csm theme files.

A .mym is a ZIP with `mym.ini` plus (a) packed layout archives such as `ash/board.ash`, or (b) loose
pictures and layout files that the installer patches into the user's own menu. A .csm is a raw U8
archive of the whole menu (layout/common/*.ash, ...). Both end in the same containers:

  * LZ77  : the 4 ASCII bytes "LZ77" and then a Nintendo type-0x10 stream
  * Yaz0  : the Wii U / GameCube LZ variant, used by a few theme tools
  * ASH0  : Nintendo's Huffman + LZ archive compression (two bit streams of big-endian words)
  * U8    : the archive format (big endian, 12 byte nodes, string table)
  * TPL   : Wii textures (I4 I8 IA4 IA8 RGB565 RGB5A3 RGBA32 C4 C8 C14X2 CMPR)

We read the parts the Deck home can show: the menu wallpaper (`my_BackPic_a.tpl` in board.ash, or a loose
tpl / png) and the pointer hand pictures (`defcursor_final64_a/b/c`). Channel-menu layouts and animation data are converted by wii_layout / wii_scene.
A theme is modified Nintendo data: this module only reads the user's own file and never ships any.

read_wii_theme(path) returns None for anything that is not a Wii theme and never raises; a damaged part
is skipped and named in `errors`. All decoders raise ValueError on bad input and are bounded:
output sizes are capped, trees and archives are walked without recursion, and archive paths that try to
leave their folder ("..", absolute) are ignored. Nothing is ever written to disk here.
"""
import base64
import io
import os
import re
import struct
import zipfile
import zlib

READER_VERSION = 9

U8_MAGIC = b"U\xaa8-"
MAX_FILE = 128 * 1024 * 1024     # biggest theme file read into memory
MAX_OUT = 48 * 1024 * 1024       # biggest decompressed archive
MAX_MEMBER = 48 * 1024 * 1024    # biggest file taken out of a zip
MAX_ZIP_FILES = 6000
MAX_U8_FILES = 20000
MAX_PIXELS = 3 * 1024 * 1024     # biggest picture decoded (a wallpaper is 544x408)
MAX_PNG = 6 * 1024 * 1024        # biggest loose wallpaper picture passed through
MAX_CURSOR_PNG = 1024 * 1024

STOCK_TOP = (197, 205, 213)      # colour at the top of the stock 8x456 menu gradient (measured, not copied data)
STOCK_MID = (238, 238, 238)


# ───────────────────────────────── compression ─────────────────────────────────
def lz77(data, max_out=MAX_OUT):
    """Nintendo LZ77 type 0x10 (the stream after the "LZ77" tag): flag byte per 8 blocks, MSB first."""
    if len(data) < 4 or data[0] != 0x10:
        raise ValueError("not an LZ77 (0x10) stream")
    size = data[1] | data[2] << 8 | data[3] << 16
    p = 4
    if size == 0:
        if len(data) < 8:
            raise ValueError("truncated LZ77 header")
        size = struct.unpack_from("<I", data, 4)[0]
        p = 8
    if size > max_out:
        raise ValueError("LZ77 output too large")
    out = bytearray()
    n = len(data)
    try:
        while len(out) < size:
            flags = data[p]
            p += 1
            for bit in (0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01):
                if len(out) >= size:
                    break
                if flags & bit:
                    b0 = data[p]
                    b1 = data[p + 1]
                    p += 2
                    ln = (b0 >> 4) + 3
                    disp = ((b0 & 15) << 8 | b1) + 1
                    if disp > len(out):
                        raise ValueError("LZ77 distance before the start")
                    if disp >= ln:
                        s = len(out) - disp
                        out += out[s:s + ln]
                    else:
                        for _ in range(ln):
                            out.append(out[-disp])
                else:
                    out.append(data[p])
                    p += 1
    except IndexError:
        raise ValueError("truncated LZ77 stream") from None
    if p > n:
        raise ValueError("truncated LZ77 stream")
    return bytes(out[:size])


def _ash_tree(words, pos, nwords, width):
    """Read one pre-order Huffman tree from a bit stream. Bit 1 = internal node (left, then right);
    bit 0 = leaf followed by `width` bits. Returns (root, children, bit position after the tree);
    leaf values are < 1<<width, internal nodes are (1<<width) + index into children (2 entries each)."""
    base = 1 << width
    limit = base * 2  # a Huffman tree over 2**width symbols never needs more internal nodes than leaves
    bitpos = pos

    def bit():
        nonlocal bitpos
        w = bitpos >> 5
        if w >= nwords:
            raise ValueError("ASH0 tree runs past the data")
        v = (words[w] >> (31 - (bitpos & 31))) & 1
        bitpos += 1
        return v

    def leaf():
        v = 0
        for _ in range(width):
            v = v << 1 | bit()
        return v

    if not bit():
        return leaf(), [], bitpos
    children = [0, 0]
    stack = [(0, 1), (0, 0)]  # (internal node, slot) still to fill; the last entry is filled first
    while stack:
        node, slot = stack.pop()
        if bit():
            if len(children) // 2 >= limit:
                raise ValueError("ASH0 tree too big")
            idx = len(children) // 2
            children += [0, 0]
            children[node * 2 + slot] = base + idx
            stack.append((idx, 1))
            stack.append((idx, 0))
        else:
            children[node * 2 + slot] = leaf()
    return base, children, bitpos


def ash0(data, max_out=MAX_OUT):
    """ASH0: u32 BE (low 24 bits = output size), u32 BE (offset of the second stream), then two streams of
    big-endian 32-bit words read MSB first. Stream 1 holds a 9-bit symbol tree and the symbols (< 0x100 a
    literal, otherwise a match of length symbol-0x100+3); stream 2 holds an 11-bit distance tree and the
    distances (+1). Matches copy from the output already written."""
    if len(data) < 16 or data[:4] != b"ASH0":
        raise ValueError("not ASH0")
    size = struct.unpack_from(">I", data, 4)[0] & 0xFFFFFF
    off2 = struct.unpack_from(">I", data, 8)[0] & 0xFFFFFF
    if size > max_out:
        raise ValueError("ASH0 output too large")
    if off2 < 12 or off2 >= len(data) or off2 & 3:
        raise ValueError("bad ASH0 second stream offset")
    n1 = (off2 - 12) // 4
    w1 = struct.unpack_from(">%dI" % n1, data, 12)
    n2 = (len(data) - off2) // 4
    w2 = struct.unpack_from(">%dI" % n2, data, off2)
    sroot, schild, p1 = _ash_tree(w1, 0, n1, 9)
    droot, dchild, p2 = _ash_tree(w2, 0, n2, 11)
    if sroot < 0x100:  # a one-symbol tree uses no bits: the whole output is that byte
        return bytes((sroot,)) * size
    out = bytearray()
    sbase, dbase = 0x200, 0x800
    end1, end2 = n1 * 32, n2 * 32
    try:
        while len(out) < size:
            node = sroot
            while node >= sbase:
                node = schild[((node - sbase) << 1) | ((w1[p1 >> 5] >> (31 - (p1 & 31))) & 1)]
                p1 += 1
            if p1 > end1:
                raise ValueError("ASH0 symbol stream ends early")
            if node < 0x100:
                out.append(node)
                continue
            ln = node - 0x100 + 3
            m = droot
            while m >= dbase:
                m = dchild[((m - dbase) << 1) | ((w2[p2 >> 5] >> (31 - (p2 & 31))) & 1)]
                p2 += 1
            if p2 > end2:
                raise ValueError("ASH0 distance stream ends early")
            disp = m + 1
            if disp > len(out):
                raise ValueError("ASH0 distance before the start")
            if disp >= ln:
                s = len(out) - disp
                out += out[s:s + ln]
            else:
                for _ in range(ln):
                    out.append(out[-disp])
    except IndexError:
        raise ValueError("truncated ASH0 stream") from None
    return bytes(out[:size])


def yaz0(data, max_out=MAX_OUT):
    """Yaz0 (some theme tools wrap .ash files in it): "Yaz0", u32 BE size, 8 bytes padding, then flag bytes."""
    if len(data) < 16 or data[:4] != b"Yaz0":
        raise ValueError("not Yaz0")
    size = struct.unpack_from(">I", data, 4)[0]
    if size > max_out:
        raise ValueError("Yaz0 output too large")
    out = bytearray()
    p = 16
    try:
        while len(out) < size:
            code = data[p]
            p += 1
            for bit in (0x80, 0x40, 0x20, 0x10, 0x08, 0x04, 0x02, 0x01):
                if len(out) >= size:
                    break
                if code & bit:
                    out.append(data[p])
                    p += 1
                    continue
                b1, b2 = data[p], data[p + 1]
                p += 2
                disp = ((b1 & 15) << 8 | b2) + 1
                n = b1 >> 4
                if n == 0:
                    n = data[p] + 0x12
                    p += 1
                else:
                    n += 2
                if disp > len(out):
                    raise ValueError("Yaz0 distance before the start")
                if disp >= n:
                    s = len(out) - disp
                    out += out[s:s + n]
                else:
                    for _ in range(n):
                        out.append(out[-disp])
    except IndexError:
        raise ValueError("truncated Yaz0 stream") from None
    return bytes(out[:size])


def unwrap(data, max_out=MAX_OUT):
    """Peel LZ77 / ASH0 / Yaz0 layers until a U8 archive (or any other data) is left; at most 4 layers."""
    for _ in range(4):
        head = data[:4]
        if head == U8_MAGIC:
            return data
        if head == b"LZ77":
            data = lz77(data[4:], max_out)
        elif head == b"ASH0":
            data = ash0(data, max_out)
        elif head == b"Yaz0":
            data = yaz0(data, max_out)
        elif data[:1] == b"\x10":
            data = lz77(data, max_out)
        else:
            return data
    raise ValueError("compression nested too deep")


# ───────────────────────────────── U8 archive ─────────────────────────────────
def u8(data, max_files=MAX_U8_FILES, max_total=MAX_OUT):
    """Files of a U8 archive as {path: bytes} ('/' separators, names as stored). Directories are walked
    with a stack, never recursion. Entries whose name is empty, '.', '..', or holds a slash / backslash /
    NUL are dropped together with everything below them; files that point outside the data are dropped."""
    if len(data) < 0x20 or data[:4] != U8_MAGIC:
        raise ValueError("not a U8 archive")
    root, hsize, _doff = struct.unpack_from(">III", data, 4)
    if root < 0x20 or root + 12 > len(data):
        raise ValueError("bad U8 header")
    count = struct.unpack_from(">I", data, root + 8)[0]
    if count < 1 or count - 1 > max_files or root + count * 12 > len(data):
        raise ValueError("bad U8 node count")
    strtab = root + count * 12
    strend = len(data)
    if 0 < hsize <= len(data) - root and root + hsize >= strtab:
        strend = root + hsize

    def name_at(off):
        s = strtab + off
        if s >= strend:
            return None
        e = data.find(b"\0", s, min(strend, s + 256))
        if e < 0:
            return None
        return data[s:e].decode("utf-8", "replace")

    files = {}
    total = 0
    stack = [(count, "")]  # (index after the last child, path prefix or None while skipping)
    for i in range(1, count):
        o = root + i * 12
        typ = data[o]
        noff = int.from_bytes(data[o + 1:o + 4], "big")
        a, b = struct.unpack_from(">II", data, o + 4)
        while len(stack) > 1 and i >= stack[-1][0]:
            stack.pop()
        prefix = stack[-1][1]
        name = name_at(noff)
        bad = name is None or name in ("", ".", "..") or any(c in name for c in "/\\\0")
        if typ == 1:
            if len(stack) >= 64:
                raise ValueError("U8 folders nested too deep")
            stack.append((min(max(b, i + 1), count), None if bad or prefix is None else prefix + name + "/"))
        elif typ == 0:
            if bad or prefix is None or a > len(data) or b > len(data) - a:
                continue
            total += b
            if total > max_total:
                raise ValueError("U8 contents too large")
            files.setdefault(prefix + name, bytes(data[a:a + b]))
    return files


# ───────────────────────────────── PNG output ─────────────────────────────────
def png_encode(w, h, rgba):
    """RGBA bytes -> PNG bytes (RGB when every pixel is opaque, so wallpapers stay small)."""
    rgba = bytes(rgba)
    if w * h * 4 != len(rgba) or w < 1 or h < 1:
        raise ValueError("bad picture size")
    opaque = rgba[3::4].count(255) == w * h
    if opaque:
        rgb = bytearray(w * h * 3)
        rgb[0::3], rgb[1::3], rgb[2::3] = rgba[0::4], rgba[1::4], rgba[2::4]
        raw, bpp, ctype = bytes(rgb), 3, 2
    else:
        raw, bpp, ctype = rgba, 4, 6
    stride = w * bpp
    body = b"".join(b"\0" + raw[y * stride:(y + 1) * stride] for y in range(h))

    def chunk(tag, payload):
        return struct.pack(">I", len(payload)) + tag + payload + struct.pack(">I", zlib.crc32(tag + payload) & 0xFFFFFFFF)

    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, ctype, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(body, 6)) + chunk(b"IEND", b"")


def _data_url(png):
    return "data:image/png;base64," + base64.b64encode(png).decode("ascii")


# ───────────────────────────────── TPL textures ─────────────────────────────────
TPL_FORMATS = {0: "I4", 1: "I8", 2: "IA4", 3: "IA8", 4: "RGB565", 5: "RGB5A3", 6: "RGBA32", 8: "C4", 9: "C8", 10: "C14X2", 14: "CMPR"}
# block size in texels (width, height) and bytes per block
_BLOCK = {0: (8, 8, 32), 1: (8, 4, 32), 2: (8, 4, 32), 3: (4, 4, 32), 4: (4, 4, 32), 5: (4, 4, 32), 6: (4, 4, 64), 8: (8, 8, 32), 9: (8, 4, 32), 10: (4, 4, 32), 14: (8, 8, 32)}
_LUT = {}


def _c565(v):
    return bytes(((v >> 11 & 31) * 255 // 31, (v >> 5 & 63) * 255 // 63, (v & 31) * 255 // 31, 255))


def _c5a3(v):
    if v & 0x8000:
        return bytes(((v >> 10 & 31) * 255 // 31, (v >> 5 & 31) * 255 // 31, (v & 31) * 255 // 31, 255))
    return bytes(((v >> 8 & 15) * 17, (v >> 4 & 15) * 17, (v & 15) * 17, (v >> 12 & 7) * 255 // 7))


def _lut(kind):
    """Texel lookup tables (built on first use): kind -> list indexed by the raw value."""
    t = _LUT.get(kind)
    if t is None:
        if kind == "565":
            t = [_c565(v) for v in range(65536)]
        elif kind == "5a3":
            t = [_c5a3(v) for v in range(65536)]
        elif kind == "ia8":  # high byte alpha, low byte intensity
            t = [bytes((v & 255, v & 255, v & 255, v >> 8)) for v in range(65536)]
        elif kind == "i4":   # one byte = two texels, high nibble first; GX expands intensity into alpha too
            t = [bytes(((v >> 4) * 17,)) * 4 + bytes(((v & 15) * 17,)) * 4 for v in range(256)]
        elif kind == "i8":
            t = [bytes((v, v, v, v)) for v in range(256)]
        elif kind == "ia4":  # high nibble alpha, low nibble intensity
            t = [bytes(((v & 15) * 17, (v & 15) * 17, (v & 15) * 17, (v >> 4) * 17)) for v in range(256)]
        else:
            raise ValueError("no such table")
        _LUT[kind] = t
    return t


def _palette(data, poff):
    if poff <= 0 or poff + 12 > len(data):
        raise ValueError("palette missing")
    cnt, _unpacked, pfmt, pdata = struct.unpack_from(">HHII", data, poff)
    if cnt < 1 or cnt > 16384 or pdata + cnt * 2 > len(data):
        raise ValueError("bad palette")
    vals = struct.unpack_from(">%dH" % cnt, data, pdata)
    if pfmt == 0:
        t = _lut("ia8")
    elif pfmt == 1:
        t = _lut("565")
    elif pfmt == 2:
        t = _lut("5a3")
    else:
        raise ValueError("bad palette format %d" % pfmt)
    return [t[v] for v in vals]


def _cmpr_block(blk, o):
    c0, c1 = struct.unpack_from(">HH", blk, o)
    a, b = _c565(c0), _c565(c1)
    if c0 > c1:
        cols = [a, b, bytes((2 * a[i] + b[i]) // 3 for i in range(3)) + b"\xff", bytes((a[i] + 2 * b[i]) // 3 for i in range(3)) + b"\xff"]
    else:
        cols = [a, b, bytes((a[i] + b[i]) // 2 for i in range(3)) + b"\xff", b"\0\0\0\0"]
    rows = []
    for r in range(4):
        v = blk[o + 4 + r]
        rows.append(cols[v >> 6 & 3] + cols[v >> 4 & 3] + cols[v >> 2 & 3] + cols[v & 3])
    return rows


def tpl_info(data, index=0):
    """(width, height, format) of image `index` in a TPL, or raises ValueError."""
    if len(data) < 12 or struct.unpack_from(">I", data, 0)[0] != 0x0020AF30:
        raise ValueError("not a TPL")
    count, table = struct.unpack_from(">II", data, 4)
    if not 0 <= index < count or count > 4096 or table + (index + 1) * 8 > len(data):
        raise ValueError("TPL image index out of range")
    ioff, _poff = struct.unpack_from(">II", data, table + index * 8)
    if ioff + 12 > len(data):
        raise ValueError("bad TPL image header")
    h, w, fmt = struct.unpack_from(">HHI", data, ioff)
    return w, h, fmt


def tpl_decode(data, index=0, max_pixels=MAX_PIXELS):
    """Decode image `index` of a TPL texture file to (width, height, RGBA bytes)."""
    w, h, fmt = tpl_info(data, index)
    count, table = struct.unpack_from(">II", data, 4)
    ioff, poff = struct.unpack_from(">II", data, table + index * 8)
    dat = struct.unpack_from(">I", data, ioff + 8)[0]
    if fmt not in _BLOCK:
        raise ValueError("TPL format %d is not supported" % fmt)
    if w < 1 or h < 1 or w * h > max_pixels:
        raise ValueError("TPL picture size %dx%d is not usable" % (w, h))
    bw, bh, bsz = _BLOCK[fmt]
    pw, ph = -(-w // bw) * bw, -(-h // bh) * bh
    if dat + pw // bw * (ph // bh) * bsz > len(data):
        raise ValueError("TPL pixel data is cut off")
    pal = _palette(data, poff) if fmt in (8, 9, 10) else None
    blank = b"\0\0\0\0"
    out = bytearray(pw * ph * 4)
    stride = pw * 4
    p = dat
    t565, t5a3, tia8 = (_lut("565") if fmt == 4 else None), (_lut("5a3") if fmt == 5 else None), (_lut("ia8") if fmt == 3 else None)
    ti4, ti8, tia4 = (_lut("i4") if fmt == 0 else None), (_lut("i8") if fmt == 1 else None), (_lut("ia4") if fmt == 2 else None)
    npal = len(pal) if pal else 0
    for by in range(0, ph, bh):
        for bx in range(0, pw, bw):
            blk = data[p:p + bsz]
            p += bsz
            if fmt == 14:
                rows = [b""] * 8
                for k, (sx, sy) in enumerate(((0, 0), (4, 0), (0, 4), (4, 4))):
                    sub = _cmpr_block(blk, k * 8)
                    for r in range(4):
                        rows[sy + r] += sub[r]
            elif fmt == 0:
                rows = [b"".join(ti4[x] for x in blk[r * 4:r * 4 + 4]) for r in range(8)]
            elif fmt == 1:
                rows = [b"".join(ti8[x] for x in blk[r * 8:r * 8 + 8]) for r in range(4)]
            elif fmt == 2:
                rows = [b"".join(tia4[x] for x in blk[r * 8:r * 8 + 8]) for r in range(4)]
            elif fmt in (3, 4, 5):
                t = tia8 if fmt == 3 else t565 if fmt == 4 else t5a3
                v = struct.unpack(">16H", blk)
                rows = [t[v[r * 4]] + t[v[r * 4 + 1]] + t[v[r * 4 + 2]] + t[v[r * 4 + 3]] for r in range(4)]
            elif fmt == 6:
                rows = []
                for r in range(4):
                    row = bytearray()
                    for k in range(r * 4, r * 4 + 4):
                        row += bytes((blk[2 * k + 1], blk[32 + 2 * k], blk[32 + 2 * k + 1], blk[2 * k]))
                    rows.append(bytes(row))
            elif fmt == 8:
                rows = []
                for r in range(8):
                    row = []
                    for x in blk[r * 4:r * 4 + 4]:
                        for i in (x >> 4, x & 15):
                            row.append(pal[i] if i < npal else blank)
                    rows.append(b"".join(row))
            elif fmt == 9:
                rows = [b"".join(pal[x] if x < npal else blank for x in blk[r * 8:r * 8 + 8]) for r in range(4)]
            else:  # 10: C14X2
                v = struct.unpack(">16H", blk)
                rows = []
                for r in range(4):
                    rows.append(b"".join(pal[i] if i < npal else blank for i in (x & 0x3FFF for x in v[r * 4:r * 4 + 4])))
            o = by * stride + bx * 4
            for r in range(bh):
                out[o:o + bw * 4] = rows[r]
                o += stride
    if pw != w:
        out = bytearray(b"".join(out[y * stride:y * stride + w * 4] for y in range(h)))
    else:
        out = out[:w * h * 4]
    return w, h, bytes(out)


def tpl_to_png(data, index=0, max_pixels=MAX_PIXELS):
    """TPL -> (PNG bytes, width, height, rgba) for image `index`."""
    w, h, rgba = tpl_decode(data, index, max_pixels)
    return png_encode(w, h, rgba), w, h, rgba


# ───────────────────────────────── theme files ─────────────────────────────────
def _norm(p):
    return p.replace("\\", "/").strip("/").lower()


def _safe(name):
    parts = name.replace("\\", "/").split("/")
    return not name.startswith(("/", "\\")) and ".." not in parts and "\0" not in name


_PIC_RANK = {"tpl": 0, "png": 1, "jpg": 2, "jpeg": 2}


class _Zip:
    """A .mym: lower-case path lookup, bounded reads, mym.ini mapping of install targets to zip paths."""

    def __init__(self, path):
        self.z = zipfile.ZipFile(path)
        self.names = {}
        for i in self.z.infolist()[:MAX_ZIP_FILES]:
            if i.is_dir() or not _safe(i.filename) or i.filename.lower().startswith("__macosx/"):
                continue
            self.names.setdefault(_norm(i.filename), i)
        self.targets = {}  # install target (lower, '/') -> source path inside the zip (lower, '/')
        ini = self.names.get("mym.ini")
        if ini:
            try:
                self.targets = _parse_ini(self.read(ini).decode("latin-1"))
            except Exception:
                pass

    def read(self, info):
        if info.file_size > MAX_MEMBER:
            raise ValueError("%s is too large" % info.filename)
        with self.z.open(info) as f:
            data = f.read(MAX_MEMBER + 1)
        if len(data) > MAX_MEMBER:
            raise ValueError("%s is too large" % info.filename)
        return data

    def archive(self, ash):
        """Zip entry of the archive `ash` (e.g. 'board.ash'): the file mym.ini installs under that name,
        else any entry called that (the shallowest path wins)."""
        ash = ash.lower()
        for tgt, src in self.targets.items():
            if tgt.rsplit("/", 1)[-1] == ash and src in self.names:
                return self.names[src]
        hits = sorted((k for k in self.names if k.rsplit("/", 1)[-1] == ash), key=lambda k: (k.count("/"), k))
        return self.names[hits[0]] if hits else None

    def pictures(self, stem, area):
        """Loose pictures (tpl, png, jpg) for texture `stem` inside the layout archive whose folder name holds
        `area` ('board' -> board_ash_out/..., 'cursor'). A picture named like the texture in another archive's
        folder (the Disc Channel banner has its own my_BackPic_a) is not ours. Best format first:
        [(ext, zip entry)]. mym.ini's install targets decide where a picture goes; folder names are the fallback."""
        stem, hits, seen = stem.lower(), [], set()

        def take(folder, name, key):
            base, _, ext = name.rpartition(".")
            if base == stem and ext in _PIC_RANK and area in folder and key in self.names and key not in seen:
                seen.add(key)
                hits.append((ext, self.names[key]))

        for tgt, src in self.targets.items():
            folder, _, name = tgt.rpartition("/")
            if name.rpartition(".")[0] == stem and area in folder and src in self.names:
                seen_ext = src.rpartition(".")[2]
                if seen_ext in _PIC_RANK and src not in seen:
                    seen.add(src)
                    hits.append((seen_ext, self.names[src]))
        for key in self.names:
            folder, _, name = key.rpartition("/")
            take(folder, name, key)
        hits.sort(key=lambda h: _PIC_RANK[h[0]])
        return hits

    def close(self):
        self.z.close()


def _parse_ini(text):
    """mym.ini: [sdtaN] / [contN] sections with file= (where it installs) and source= (path in the zip)."""
    out, cur = {}, {}

    def flush():
        f, s = cur.get("file"), cur.get("source")
        if f and s:
            out[_norm(f)] = _norm(s)

    for line in text.splitlines():
        line = line.strip()
        if not line or line[0] == ";":
            continue
        if line[0] == "[":
            flush()
            cur = {}
        elif "=" in line:
            k, v = line.split("=", 1)
            cur[k.strip().lower()] = v.strip()
    flush()
    return out


def _png_size(data):
    if len(data) >= 24 and data[:8] == b"\x89PNG\r\n\x1a\n" and data[12:16] == b"IHDR":
        return struct.unpack_from(">II", data, 16)
    raise ValueError("not a PNG")


def _jpeg_size(data):
    if data[:2] != b"\xff\xd8":
        raise ValueError("not a JPEG")
    p, n = 2, len(data)
    while p + 4 <= n:
        if data[p] != 0xFF:
            p += 1
            continue
        m = data[p + 1]
        if m == 0xFF:
            p += 1
            continue
        if m in (0xD8, 0x01) or 0xD0 <= m <= 0xD7:
            p += 2
            continue
        ln = struct.unpack_from(">H", data, p + 2)[0]
        if 0xC0 <= m <= 0xCF and m not in (0xC4, 0xC8, 0xCC) and p + 9 <= n:
            h, w = struct.unpack_from(">HH", data, p + 5)
            return w, h
        p += 2 + ln
    raise ValueError("JPEG size not found")


def _is_stock(w, h, rgba):
    """The unmodified menu background: a narrow, pale grey-blue strip, light at the middle and a little darker at the ends."""
    if w > 16 or h < 128:
        return False

    def near(y, ref, tol=7):
        o = (y * w) * 4
        return all(abs(rgba[o + i] - ref[i]) <= tol for i in range(3))

    return near(0, STOCK_TOP) and near(h // 2, STOCK_MID)


def _kind(path):
    """'mym' for a zip, 'csm' for a U8 archive (raw or wrapped), else None. Cheap."""
    try:
        with open(path, "rb") as f:
            head = f.read(4)
        if head[:2] == b"PK":
            return "mym"
        if head in (U8_MAGIC, b"LZ77", b"ASH0", b"Yaz0"):
            return "csm"
    except Exception:
        pass
    return None


def peek(path):
    """What a file is for list_skins: 'mym', 'csm' or None. A zip must hold a mym.ini or a Wii menu archive."""
    try:
        if not os.path.isfile(path):
            return None
        k = _kind(path)
        if k != "mym":
            return k if os.path.getsize(path) > 64 else None
        with zipfile.ZipFile(path) as z:
            for n in z.namelist()[:MAX_ZIP_FILES]:
                low = n.lower().replace("\\", "/")
                if low.endswith(("mym.ini", ".ash", ".tpl", ".mym", ".csm", ".app")):
                    return "mym"
        return None
    except Exception:
        return None


def _clean_name(path):
    stem = os.path.splitext(os.path.basename(path))[0]
    return re.sub(r"\s+", " ", stem.replace("_", " ")).strip() or stem


def _archive(raw):
    return u8(unwrap(raw))


def _ci(files, suffix):
    """First file of a U8 listing whose lower-case path ends with `suffix` (shortest path first)."""
    s = suffix.lower()
    hits = sorted((k for k in files if k.lower().endswith(s)), key=lambda k: (k.count("/"), k))
    return files[hits[0]] if hits else None


def read_wii_theme(path, member="", base_path=""):
    """Read a .mym / .csm into one plain dict for the Wii home, or None when `path` is not a Wii theme.
    {kind, name, id, wallpaper (image data URL or None), wallpaperSize [w,h], wallpaperFit ('cover' | 'stretch'),
     stockWallpaper (True when the file only carries the unmodified menu gradient), cursors {a,b,c: data URLs},
     cursorSize, errors [..]}. Never raises."""
    try:
        from wii_scene import read_package
        return read_package(path, member, base_path)
    except Exception:
        return None


class _Source:
    """What the reader needs from either kind of theme file."""

    def __init__(self, err):
        self.err = err
        self._ash = {}

    def archive_files(self, ash):  # U8 listing of board.ash / cursor.ash, read once
        if ash not in self._ash:
            files = None
            try:
                raw = self.archive_bytes(ash)
                if raw is not None:
                    files = _archive(raw)
            except Exception as e:
                self.err.append("%s: %s" % (ash, e))
            self._ash[ash] = files
        return self._ash[ash]

    def archive_bytes(self, ash):
        return None

    def pictures(self, stem, area):  # [(ext, bytes)] loose pictures, best first
        return []


class _MymSource(_Source):
    def __init__(self, z, err):
        super().__init__(err)
        self.z = z

    def archive_bytes(self, ash):
        info = self.z.archive(ash)
        return self.z.read(info) if info is not None else None

    def pictures(self, stem, area):
        out = []
        for ext, info in self.z.pictures(stem, area):
            try:
                out.append((ext, self.z.read(info)))
            except Exception as e:
                self.err.append("%s: %s" % (stem, e))
        return out


class _CsmSource(_Source):
    def __init__(self, top, err):
        super().__init__(err)
        self.top = top

    def archive_bytes(self, ash):
        ash = ash.lower()
        hits = sorted((k for k in self.top if k.lower().rsplit("/", 1)[-1] == ash), key=lambda k: (not k.lower().startswith("layout/common/"), k.count("/"), k))
        return self.top[hits[0]] if hits else None


def _read(path):
    kind = _kind(path)
    if not kind or os.path.getsize(path) > MAX_FILE:
        return None
    res = {"kind": kind, "name": _clean_name(path), "id": "", "wallpaper": None, "wallpaperSize": None, "wallpaperFit": "cover",
           "stockWallpaper": False, "cursors": {}, "cursorSize": 0, "errors": []}
    err = res["errors"]
    if kind == "mym":
        try:
            z = _Zip(path)
        except Exception:
            return None
        try:
            if not z.targets and not any(k.endswith((".ash", ".tpl", "mym.ini")) for k in z.names):
                return None
            idt = z.names.get("id.txt")
            if idt:
                try:
                    t = z.read(idt)[:64].decode("latin-1").strip()
                    res["id"] = t if t.isprintable() else ""
                except Exception:
                    pass
            _fill(res, _MymSource(z, err), err)
        finally:
            z.close()
        return res
    try:
        with open(path, "rb") as f:
            top = _archive(f.read(MAX_FILE + 1))
    except Exception:
        return None
    if not top:
        return None
    _fill(res, _CsmSource(top, err), err)
    return res


def _fill(res, src, err):
    # wallpaper: a loose picture (in the board archive's folder) wins over the texture packed in board.ash
    try:
        pics = src.pictures("my_BackPic_a", "board")
        if pics:
            ext, raw = pics[0]
            _wallpaper(res, ext, raw)
        else:
            board = src.archive_files("board.ash") or src.archive_files("board2.ash")  # board2: the Korean menu's name
            tpl = _ci(board, "/my_backpic_a.tpl") if board else None
            if tpl is not None:
                _wallpaper(res, "tpl", tpl)
    except Exception as e:
        err.append("wallpaper: %s" % e)
    # pointer hands: the three that show in the menu (open hand, pressed, grabbing)
    for letter in ("a", "b", "c"):
        name = "defcursor_final64_" + letter
        try:
            raw, ext = None, "tpl"
            for e, r in src.pictures(name, "cursor"):
                if e not in ("jpg", "jpeg"):  # a pointer needs transparency
                    ext, raw = e, r
                    break
            if raw is None:
                cur = src.archive_files("cursor.ash")
                raw = _ci(cur, "/%s.tpl" % name) if cur else None
            if raw is None:
                continue
            if ext == "tpl":
                png, w, h, _ = tpl_to_png(raw)
            else:
                if len(raw) > MAX_CURSOR_PNG:
                    raise ValueError("pointer picture is too large")
                w, h = _png_size(raw)
                png = raw
            if not 1 <= w <= 1024 or not 1 <= h <= 1024:
                raise ValueError("pointer picture size %dx%d is not usable" % (w, h))
            res["cursors"][letter] = _data_url(png)
            res["cursorSize"] = max(res["cursorSize"], w)
        except Exception as e:
            err.append("%s: %s" % (name, e))


def _wallpaper(res, ext, raw):
    if ext == "tpl":
        png, w, h, rgba = tpl_to_png(raw)
        if _is_stock(w, h, rgba):
            res["stockWallpaper"] = True
            return
        url = _data_url(png)
    else:
        if len(raw) > MAX_PNG:
            raise ValueError("wallpaper picture is too large")
        if ext == "png":
            w, h = _png_size(raw)
            mime = "image/png"
        else:
            w, h = _jpeg_size(raw)
            mime = "image/jpeg"
        if not 1 <= w * h <= 16 * 1024 * 1024:
            raise ValueError("wallpaper picture size is not usable")
        url = "data:%s;base64,%s" % (mime, base64.b64encode(raw).decode("ascii"))
    res["wallpaper"] = url
    res["wallpaperSize"] = [w, h]
    # menu backdrops are 4:3 pictures; thin gradient strips only make sense stretched over the screen
    res["wallpaperFit"] = "stretch" if min(w, h) < 32 else "cover"
