"""Wii U Menu theme files, read on the Deck.

  * .utheme (Theme Café / Themezer): a zip with metadata.json and BPS patches for
    Men.pack / Men2.pack / cafe_barista_men.bfsar. A patch only applies to the console's own
    stock file, so the user supplies those once (see find_stock / import_stock).
  * The patched .pack files are SARC archives of Yaz0-compressed layout archives
    (.szs = Yaz0 + SARC), holding BFLYT layouts and BFLIM textures.
  * BFLIM textures are GX2 surfaces (tiled), decoded here to PNG in pure Python.
Nothing from Nintendo ships with the plugin.
"""
import json
import os
import shutil
import struct
import zlib
from array import array

try:
    import zipfile
except Exception:  # pragma: no cover
    zipfile = None


# ───────────── BPS patches ─────────────
BPS_MAX_OUT = 512 * 1024 * 1024  # a patched menu file is never close to this; guards against bogus headers


def _vint(d, i):
    data, shift = 0, 1
    while True:
        x = d[i]
        i += 1
        data += (x & 0x7F) * shift
        if x & 0x80:
            return data, i
        shift <<= 7
        data += shift
        if shift > 1 << 48:
            raise ValueError("corrupt patch")


def bps_crcs(patch: bytes):
    """(source CRC32, target CRC32) recorded at the end of a BPS patch."""
    if patch[:4] != b"BPS1" or len(patch) < 19:
        raise ValueError("not a BPS patch")
    return struct.unpack("<II", patch[-12:-4])


def bps_apply(src: bytes, patch: bytes) -> bytes:
    """Applies a BPS patch (byuu's format). Raises ValueError for anything that is not a valid patch for exactly this source."""
    want_src, want_out = bps_crcs(patch)
    if zlib.crc32(patch[:-4]) != struct.unpack("<I", patch[-4:])[0]:
        raise ValueError("the patch file is damaged")
    if zlib.crc32(src) != want_src:
        raise ValueError("patch is for a different source file")
    try:
        i = 4
        src_size, i = _vint(patch, i)
        out_size, i = _vint(patch, i)
        meta, i = _vint(patch, i)
        i += meta
        if src_size != len(src) or out_size > BPS_MAX_OUT:
            raise ValueError("patch is for a different source file")
        out = bytearray(out_size)
        o = sr = tr = 0
        end = len(patch) - 12
        while i < end:
            d, i = _vint(patch, i)
            cmd, n = d & 3, (d >> 2) + 1
            if o + n > out_size:
                raise ValueError("corrupt patch")
            if cmd == 0:  # SourceRead
                if o + n > src_size:
                    raise ValueError("corrupt patch")
                out[o:o + n] = src[o:o + n]
            elif cmd == 1:  # TargetRead
                if i + n > end:
                    raise ValueError("corrupt patch")
                out[o:o + n] = patch[i:i + n]
                i += n
            elif cmd == 2:  # SourceCopy
                v, i = _vint(patch, i)
                sr += -(v >> 1) if v & 1 else v >> 1
                if sr < 0 or sr + n > src_size:
                    raise ValueError("corrupt patch")
                out[o:o + n] = src[sr:sr + n]
                sr += n
            else:  # TargetCopy (may overlap the bytes being written: repeat the pattern)
                v, i = _vint(patch, i)
                tr += -(v >> 1) if v & 1 else v >> 1
                if tr < 0 or tr >= o:
                    raise ValueError("corrupt patch")
                if tr + n <= o:
                    out[o:o + n] = out[tr:tr + n]
                else:
                    pat = bytes(out[tr:o])
                    out[o:o + n] = (pat * (n // len(pat) + 1))[:n]
                tr += n
            o += n
    except (IndexError, struct.error):
        raise ValueError("corrupt patch")
    out = bytes(out)
    if o != out_size or zlib.crc32(out) != want_out:
        raise ValueError("patched file does not match the theme")
    return out


# ───────────── archives ─────────────

YAZ0_MAX = 256 * 1024 * 1024
YAZ0_MAX_RATIO = 100  # a Yaz0 byte stream expands at most ~87x (273 bytes per 3-byte back-reference)


def yaz0(d: bytes) -> bytes:
    if d[:4] != b"Yaz0":
        return d
    if len(d) < 16:
        raise ValueError("corrupt archive")
    size = struct.unpack(">I", d[4:8])[0]
    if size > YAZ0_MAX or size > (len(d) - 16) * YAZ0_MAX_RATIO:
        raise ValueError("archive too large")  # also: a tiny file may not claim hundreds of MB (no allocation for a bogus header)
    out = bytearray(size)
    i, o = 16, 0
    try:
        while o < size:
            code = d[i]
            i += 1
            for bit in range(7, -1, -1):
                if o >= size:
                    break
                if code >> bit & 1:
                    out[o] = d[i]
                    o += 1
                    i += 1
                else:
                    b1, b2 = d[i], d[i + 1]
                    i += 2
                    dist = ((b1 & 0x0F) << 8 | b2) + 1
                    n = b1 >> 4
                    if n == 0:
                        n = d[i] + 0x12
                        i += 1
                    else:
                        n += 2
                    s = o - dist
                    if s < 0:
                        raise ValueError("corrupt archive")
                    n = min(n, size - o)
                    if dist >= n:
                        out[o:o + n] = out[s:s + n]
                    else:
                        pat = bytes(out[s:o])
                        out[o:o + n] = (pat * (n // dist + 1))[:n]
                    o += n
    except IndexError:
        raise ValueError("corrupt archive")
    return bytes(out)


def sarc(d: bytes) -> dict:
    """{path: bytes} of a SARC archive (Yaz0 handled)."""
    d = yaz0(d)
    if d[:4] != b"SARC":
        raise ValueError("not a SARC archive")
    try:
        E = ">" if d[6:8] == b"\xfe\xff" else "<"
        hl = struct.unpack(E + "H", d[4:6])[0]
        data_start = struct.unpack(E + "I", d[0xC:0x10])[0]
        o = hl
        if d[o:o + 4] != b"SFAT":
            raise ValueError("bad SARC")
        n = struct.unpack(E + "H", d[o + 6:o + 8])[0]
        o += 12
        ents = [struct.unpack(E + "IIII", d[o + 16 * k:o + 16 * k + 16]) for k in range(n)]
        o += 16 * n
        if d[o:o + 4] != b"SFNT":
            raise ValueError("bad SARC")
        names = o + 8
        out = {}
        for _h, attr, s, e in ents:
            if attr >> 24:
                no = names + (attr & 0xFFFFFF) * 4
                name = d[no:d.index(b"\0", no)].decode("utf-8", "replace")
            else:
                name = "%08x" % _h
            if e < s or data_start + e > len(d):
                raise ValueError("bad SARC")
            out[name] = d[data_start + s:data_start + e]
        return out
    except (struct.error, IndexError):
        raise ValueError("bad SARC")
    except ValueError as e:
        raise ValueError("bad SARC") if "substring" in str(e) else e


# ───────────── GX2 surface addressing (Wii U Latte: 2 pipes, 4 banks) ─────────────
_PIPES, _BANKS, _GROUP_BYTES, _GROUP_BITS, _PIPE_BITS, _BANK_BITS = 2, 4, 256, 8, 1, 2


def _thickness(tm):
    return 4 if tm in (3, 7, 11, 13, 15) else 8 if tm in (16, 17) else 1


def _pixel_index(x, y, bpp):
    if bpp == 8:
        b = (x & 1, x >> 1 & 1, x >> 2 & 1, y >> 1 & 1, y & 1, y >> 2 & 1)
    elif bpp == 16:
        b = (x & 1, x >> 1 & 1, x >> 2 & 1, y & 1, y >> 1 & 1, y >> 2 & 1)
    elif bpp in (32, 96):
        b = (x & 1, x >> 1 & 1, y & 1, x >> 2 & 1, y >> 1 & 1, y >> 2 & 1)
    elif bpp == 64:
        b = (x & 1, y & 1, x >> 1 & 1, x >> 2 & 1, y >> 1 & 1, y >> 2 & 1)
    elif bpp == 128:
        b = (y & 1, x & 1, x >> 1 & 1, x >> 2 & 1, y >> 1 & 1, y >> 2 & 1)
    else:
        b = (x & 1, x >> 1 & 1, x >> 2 & 1, y >> 1 & 1, y & 1, y >> 2 & 1)
    return b[0] | b[1] << 1 | b[2] << 2 | b[3] << 3 | b[4] << 4 | b[5] << 5


def _addr_micro(x, y, bpp, pitch):
    micro_bytes = 64 * bpp // 8
    tile = (x >> 3) + (y >> 3) * (pitch >> 3)
    return tile * micro_bytes + (bpp * _pixel_index(x, y, bpp) >> 3)


def _addr_macro(x, y, bpp, pitch, height, tm, swizzle):
    pixel = _pixel_index(x, y, bpp)
    elem = (bpp * pixel + 7) // 8
    return _addr_macro_tile(x, y, bpp, pitch, height, tm, swizzle, elem)


def _addr_macro_tile(x, y, bpp, pitch, height, tm, swizzle, elem):
    """Address of the element at byte offset `elem` of the 8x8 micro tile that holds (x, y).
    Bank, pipe and macro tile only depend on the tile, so a whole tile can share one call's arithmetic."""
    pipe = ((y >> 3) ^ (x >> 3)) & 1
    bank = (((y // (16 * _PIPES)) ^ (x >> 3)) & 1) | 2 * (((y // (8 * _PIPES)) ^ (x >> 4)) & 1)
    bank_pipe = pipe + _PIPES * bank
    pipe_sw, bank_sw = swizzle >> 8 & 1, swizzle >> 9 & 3
    bank_pipe ^= pipe_sw + _PIPES * bank_sw
    bank_pipe %= _PIPES * _BANKS
    pipe, bank = bank_pipe % _PIPES, bank_pipe // _PIPES
    mt_pitch, mt_height = 8 * _BANKS, 8 * _PIPES
    if tm in (5, 9):
        mt_pitch, mt_height = mt_pitch >> 1, mt_height * 2
    elif tm in (6, 10):
        mt_pitch, mt_height = mt_pitch >> 2, mt_height * 4
    mt_bytes = (bpp * mt_height * mt_pitch + 7) // 8
    mt_offset = ((x // mt_pitch) + (pitch // mt_pitch) * (y // mt_height)) * mt_bytes
    total = elem + (mt_offset >> (_BANK_BITS + _PIPE_BITS))
    high = (total & ~(_GROUP_BYTES - 1)) << (_BANK_BITS + _PIPE_BITS)
    low = total & (_GROUP_BYTES - 1)
    return bank << (_PIPE_BITS + _GROUP_BITS) | pipe << _GROUP_BITS | low | high


def _round(v, a):
    return (v + a - 1) // a * a


def _surface(width, height, bpp, tm):
    """(effective tile mode, pitch, padded height) for mip level 0."""
    if tm in (2, 3):
        pitch_align = max(8, _GROUP_BYTES * 8 // (bpp * 8 * _thickness(tm)))
        return tm, _round(width, pitch_align), _round(height, 8)
    if tm in (4, 5, 6, 7):
        aspect = 2 if tm == 5 else 4 if tm == 6 else 1
        mtw, mth = 8 * _BANKS // aspect, aspect * 8 * _PIPES
        pitch_align = max(mtw, mtw * (_GROUP_BYTES // bpp // (8 * _thickness(tm))))
        return tm, _round(width, pitch_align), _round(height, mth)
    return tm, width, height  # linear


def deswizzle(data, width, height, bpp, tm, swizzle):
    """Untile a GX2 surface; width/height in elements (pixels, or 4×4 blocks), bpp in bits."""
    tm, pitch, ph = _surface(width, height, bpp, tm)
    eb = bpp // 8
    out = bytearray(width * height * eb)
    if tm >= 4 and eb and bpp != 96:  # macro tiled: bank, pipe and macro tile are per 8x8 tile, so work tile by tile
        elems = [[(bpp * _pixel_index(px, py, bpp) + 7) // 8 for px in range(8)] for py in range(8)]
        for ty in range(0, height, 8):
            for tx in range(0, width, 8):
                a0 = _addr_macro_tile(tx, ty, bpp, pitch, ph, tm, swizzle, 0)
                bp, m = a0 & 0x700, (a0 & 255) | ((a0 & ~0x7FF) >> 3)
                for py in range(min(8, height - ty)):
                    row, er = ((ty + py) * width + tx) * eb, elems[py]
                    for px in range(min(8, width - tx)):
                        t = er[px] + m
                        a = bp | (t & 255) | ((t & ~255) << 3)
                        o = row + px * eb
                        out[o:o + eb] = data[a:a + eb]
        return bytes(out)
    for y in range(height):
        row = y * width * eb
        for x in range(width):
            if tm in (0, 1):
                a = (y * pitch + x) * eb
            elif tm in (2, 3):
                a = _addr_micro(x, y, bpp, pitch)
            else:
                a = _addr_macro(x, y, bpp, pitch, ph, tm, swizzle)
            out[row + x * eb:row + x * eb + eb] = data[a:a + eb]
    return bytes(out)


# ───────────── pixel formats ─────────────

def _c565(v):
    return ((v >> 11 & 31) * 255 // 31, (v >> 5 & 63) * 255 // 63, (v & 31) * 255 // 31)


def _bc1_colors(blk, opaque):
    c0, c1 = struct.unpack("<HH", blk[:4])
    a, b = _c565(c0), _c565(c1)
    if c0 > c1 or opaque:
        cs = [a + (255,), b + (255,), tuple((2 * p + q) // 3 for p, q in zip(a, b)) + (255,), tuple((p + 2 * q) // 3 for p, q in zip(a, b)) + (255,)]
    else:
        cs = [a + (255,), b + (255,), tuple((p + q) // 2 for p, q in zip(a, b)) + (255,), (0, 0, 0, 0)]
    bits = struct.unpack("<I", blk[4:8])[0]
    return [cs[bits >> 2 * i & 3] for i in range(16)]


def _bc4(blk):
    a0, a1 = blk[0], blk[1]
    if a0 > a1:
        t = [a0, a1] + [((7 - i) * a0 + i * a1) // 7 for i in range(1, 7)]
    else:
        t = [a0, a1] + [((5 - i) * a0 + i * a1) // 5 for i in range(1, 5)] + [0, 255]
    bits = int.from_bytes(blk[2:8], "little")
    return [t[bits >> 3 * i & 7] for i in range(16)]


def _blocks_to_rgba(data, w, h, fmt):
    bw, bh = (w + 3) // 4, (h + 3) // 4
    size = 8 if fmt in ("bc1", "bc4") else 16
    out = bytearray(w * h * 4)
    for by in range(bh):
        for bx in range(bw):
            blk = data[(by * bw + bx) * size:(by * bw + bx + 1) * size]
            if fmt == "bc1":
                px = _bc1_colors(blk, False)
            elif fmt == "bc2":
                cols = _bc1_colors(blk[8:], True)
                al = int.from_bytes(blk[:8], "little")
                px = [c[:3] + ((al >> 4 * i & 15) * 17,) for i, c in enumerate(cols)]
            elif fmt == "bc3":
                cols = _bc1_colors(blk[8:], True)
                px = [c[:3] + (a,) for c, a in zip(cols, _bc4(blk[:8]))]
            elif fmt == "bc4":
                px = [(v, v, v, 255) for v in _bc4(blk)]
            else:  # bc5: red/green → treat as luminance + alpha (layouts use it for masks)
                r, g = _bc4(blk[:8]), _bc4(blk[8:])
                px = [(a, a, a, b) for a, b in zip(r, g)]
            for i, p in enumerate(px):
                x, y = bx * 4 + (i & 3), by * 4 + (i >> 2)
                if x < w and y < h:
                    o = (y * w + x) * 4
                    out[o:o + 4] = bytes(p)
    return bytes(out)


# BFLIM format code → (name, bits per element, block-compressed)
_FLIM = {0: ("l8", 8, 0), 1: ("a8", 8, 0), 2: ("la4", 8, 0), 3: ("la8", 16, 0), 5: ("rgb565", 16, 0),
         6: ("rgbx8", 32, 0), 7: ("rgb5a1", 16, 0), 8: ("rgba4", 16, 0), 9: ("rgba8", 32, 0),
         0xC: ("bc1", 64, 1), 0xD: ("bc2", 128, 1), 0xE: ("bc3", 128, 1), 0xF: ("bc4", 64, 1),
         0x10: ("bc4a", 64, 1), 0x11: ("bc5", 128, 1), 0x14: ("rgba8", 32, 0), 0x15: ("bc1", 64, 1),
         0x16: ("bc2", 128, 1), 0x17: ("bc3", 128, 1)}


def _plain_to_rgba(lin, w, h, fmt):
    out = bytearray(w * h * 4)
    n = w * h
    if fmt in ("rgba8", "rgbx8"):
        out[:] = lin[:n * 4]
        if fmt == "rgbx8":
            out[3::4] = b"\xff" * n
    elif fmt == "l8":
        for c in range(3):
            out[c::4] = lin[:n]
        out[3::4] = b"\xff" * n
    elif fmt == "a8":
        out[0::4] = out[1::4] = out[2::4] = b"\xff" * n
        out[3::4] = lin[:n]
    elif fmt == "la8":
        for c in range(3):
            out[c::4] = lin[0:2 * n:2]
        out[3::4] = lin[1:2 * n:2]
    elif fmt == "la4":
        for i in range(n):
            v = lin[i]
            l, a = (v >> 4) * 17, (v & 15) * 17
            out[4 * i:4 * i + 4] = bytes((l, l, l, a))
    else:  # 16-bit packed, big endian on the Wii U
        for i in range(n):
            v = lin[2 * i] << 8 | lin[2 * i + 1]
            if fmt == "rgb565":
                p = _c565(v) + (255,)
            elif fmt == "rgb5a1":
                p = ((v >> 11 & 31) * 255 // 31, (v >> 6 & 31) * 255 // 31, (v >> 1 & 31) * 255 // 31, 255 if v & 1 else 0)
            else:  # rgba4
                p = ((v >> 12 & 15) * 17, (v >> 8 & 15) * 17, (v >> 4 & 15) * 17, (v & 15) * 17)
            out[4 * i:4 * i + 4] = bytes(p)
    return bytes(out)


def bflim_info(d: bytes):
    if len(d) < 0x28 or d[-0x28:-0x24] != b"FLIM" or d[-0x14:-0x10] != b"imag":
        return None
    w, h, _align, fmt, swz_tm = struct.unpack(">HHHBB", d[-0xC:-0x4])
    size = struct.unpack(">I", d[-0x4:])[0]
    return {"width": w, "height": h, "format": fmt, "tileMode": swz_tm & 0x1F, "swizzle": (swz_tm >> 5) << 8, "size": size}


BFLIM_MAX_PIXELS = 2048 * 2048


def bflim_rgba(d: bytes):
    """(width, height, RGBA bytes) or None for formats we don't decode."""
    info = bflim_info(d)
    if not info or info["format"] not in _FLIM:
        return None
    name, bpp, block = _FLIM[info["format"]]
    w, h = info["width"], info["height"]
    if not (0 < w <= 4096 and 0 < h <= 4096) or w * h > BFLIM_MAX_PIXELS:
        return None  # pure-Python untiling: very large pictures are skipped, never half-decoded
    if name == "bc4a":
        name = "bc4"
    ew, eh = ((w + 3) // 4, (h + 3) // 4) if block else (w, h)
    _t, pitch, ph = _surface(ew, eh, bpp, info["tileMode"])
    need = pitch * ph * (bpp // 8) + 65536  # a truncated picture decodes as black instead of failing halfway
    raw = d[:min(info["size"], len(d) - 0x28)]
    lin = deswizzle(raw + bytes(max(0, need - len(raw))), ew, eh, bpp, info["tileMode"], info["swizzle"])
    rgba = _blocks_to_rgba(lin, w, h, name) if block else _plain_to_rgba(lin, w, h, name)
    if _FLIM[info["format"]][0] == "bc4a":  # alpha-only BC4: white with alpha
        rgba = bytes(b for i in range(w * h) for b in (255, 255, 255, rgba[4 * i]))
    return w, h, rgba


def png(w, h, rgba, opaque=False):
    """PNG bytes of RGBA pixels; opaque=True drops the alpha channel (smaller; only for pictures without transparency)."""
    def chunk(t, data):
        c = t + data
        return struct.pack(">I", len(data)) + c + struct.pack(">I", zlib.crc32(c))
    if opaque:
        rgb = bytearray(w * h * 3)
        for c in range(3):
            rgb[c::3] = rgba[c::4]
        raw = b"".join(b"\0" + bytes(rgb[y * w * 3:(y + 1) * w * 3]) for y in range(h))
        ctype = 2
    else:
        raw = b"".join(b"\0" + rgba[y * w * 4:(y + 1) * w * 4] for y in range(h))
        ctype = 6
    return b"\x89PNG\r\n\x1a\n" + chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, ctype, 0, 0, 0)) + chunk(b"IDAT", zlib.compress(raw, 6)) + chunk(b"IEND", b"")


# ───────────── BFRES models (gsys.bfres): the FTEX textures ─────────────
# Wii U FRES v3: big endian; group offsets are relative to their own field; an FTEX is a GX2 surface
# header (dim, size, format, tile mode, swizzle …) followed by relative pointers to its name and pixel data.
_GX2 = {0x01: ("l8", 8, 0), 0x07: ("la8", 16, 0), 0x08: ("rgb565", 16, 0), 0x1A: ("rgba8", 32, 0),
        0x31: ("bc1", 64, 1), 0x32: ("bc2", 128, 1), 0x33: ("bc3", 128, 1), 0x34: ("bc4", 64, 1), 0x35: ("bc5", 128, 1)}
FTEX_MAX_PIXELS = 2048 * 2048  # anything larger is skipped, never half decoded (pure Python untiling)


def fres_textures(d: bytes) -> dict:
    """{texture name: header info} for the FTEX textures of a Wii U BFRES (empty when there are none)."""
    if d[:4] != b"FRES" or d[8:10] != b"\xfe\xff" or len(d) < 0x60:
        raise ValueError("not a BFRES")
    s32 = lambda o: struct.unpack(">i", d[o:o + 4])[0]
    out = {}
    try:
        rel = s32(0x24)
        if not rel:
            return out
        g = 0x24 + rel
        count = s32(g + 4)
        if not 0 <= count <= 512:
            raise ValueError("bad BFRES")
        for i in range(1, count + 1):
            b = g + 8 + 16 * i
            a = b + 12 + s32(b + 12)
            if d[a:a + 4] != b"FTEX":
                continue
            name_at = a + 0xA8 + s32(a + 0xA8)
            name = d[name_at:d.index(b"\0", name_at)].decode("utf-8", "replace")
            dim, w, h, depth, mips, fmt, aa, use, size = struct.unpack(">9I", d[a + 4:a + 40])
            tm, swz, _align, pitch = struct.unpack(">4I", d[a + 0x34:a + 0x44])
            out[name] = {"dim": dim, "width": w, "height": h, "depth": depth, "mips": mips, "format": fmt,
                         "size": size, "tileMode": tm, "swizzle": swz, "pitch": pitch, "data": a + 0xB0 + s32(a + 0xB0)}
    except (struct.error, ValueError, IndexError):
        raise ValueError("bad BFRES")
    return out


def ftex_rgba(d: bytes, info: dict):
    """(width, height, RGBA bytes) of an FTEX's first mip level, or None for formats / sizes we don't decode."""
    code = info["format"] & 0x3F
    if info["dim"] != 1 or info["depth"] != 1 or code not in _GX2:
        return None
    name, bpp, block = _GX2[code]
    w, h = info["width"], info["height"]
    if not (0 < w <= 4096 and 0 < h <= 4096) or w * h > FTEX_MAX_PIXELS or info["tileMode"] > 7:
        return None
    ew, eh = ((w + 3) // 4, (h + 3) // 4) if block else (w, h)
    _t, pitch, ph = _surface(ew, eh, bpp, info["tileMode"])
    start = info["data"]
    if start < 0 or start + info["size"] > len(d):
        raise ValueError("bad BFRES")
    raw = d[start:start + info["size"]]
    need = pitch * ph * (bpp // 8) + 65536
    lin = deswizzle(raw + bytes(max(0, need - len(raw))), ew, eh, bpp, info["tileMode"], info["swizzle"])
    return w, h, (_blocks_to_rgba(lin, w, h, name) if block else _plain_to_rgba(lin, w, h, name))


def _archive_key(pack: dict, archive: str):
    """The pack's own spelling of a layout archive: exact path first, then any folder prefix (docs write 'Layout/X.szs')."""
    if archive in pack:
        return archive
    tail = "/" + archive.rsplit("/", 1)[-1].lower()
    for k in pack:
        if ("/" + k.lower()).endswith(tail):
            return k
    return None


def layout_textures(pack: dict, archive: str) -> dict:
    """{texture name: BFLIM bytes} inside one layout archive (e.g. 'Common/Layout/LauncherIcon.szs')."""
    key = _archive_key(pack, archive)
    raw = pack.get(key) if key else None
    if raw is None:
        return {}
    out = {}

    def walk(blob, depth=0):
        for k, v in sarc(blob).items():
            low = k.lower()
            if low.endswith(".bflim"):
                out.setdefault(k.rsplit("/", 1)[-1][:-6].split("^")[0], v)  # "Name^f" carries the format letter
            elif depth < 3 and (low.endswith((".arc", ".szs", ".sarc")) or v[:4] in (b"SARC", b"Yaz0")):
                walk(v, depth + 1)
    walk(raw)
    return out


# ───────────── stock menu files (the user's own, supplied once) ─────────────
READER_VERSION = 4  # 4: swap-button, swap-icon slots
STOCK = ("Men.pack", "Men2.pack", "cafe_barista_men.bfsar")
USED = ("Men", "Men2")  # the packs whose pictures we read; the sound archive and text patches are never needed
# Checksums of the menu files the Theme Café docs list for patching (every Themezer theme checked targets these).
# The docs give one set for all regions, so no region is named.
KNOWN_STOCK = {0xB9A4343A: "5.5.x", 0x946CD8A2: "5.5.x", 0xC9C16521: "5.5.x"}
UTHEME_MAX = 200 * 1024 * 1024
SCAN_MAX = 10 * 1024 ** 3
MEMBER_MAX = {"bps": 160 * 1024 * 1024, "meta": 256 * 1024}
STOCK_MAX = 512 * 1024 * 1024
_crc_memo = {}


def _file_crc(path):
    st = os.stat(path)
    key = (path, st.st_size, st.st_mtime_ns)
    hit = _crc_memo.get(key)
    if hit is None:
        crc = 0
        with open(path, "rb") as h:
            for chunk in iter(lambda: h.read(1 << 20), b""):
                crc = zlib.crc32(chunk, crc)
        hit = _crc_memo[key] = crc
    return hit


def _stock_member(names):
    """{stock file: archive member} for one archive's (or folder's) file list."""
    found = {}
    for n in names:
        low = n.replace("\\", "/").lower()
        for f in STOCK:
            if low.endswith("/" + f.lower()) or low == f.lower():
                # prefer the real menu path (…/Common/Package/Men.pack) over loose copies
                if f not in found or "/common/" in low:
                    found[f] = n
    return found if "Men.pack" in found and "Men2.pack" in found else {}


def stock_status(stock_dir):
    out = {}
    for f in STOCK:
        p = os.path.join(stock_dir, f)
        if os.path.isfile(p):
            try:
                crc = _file_crc(p)
            except OSError:
                continue
            out[f] = {"crc": "%08x" % crc, "version": KNOWN_STOCK.get(crc, "")}
    return out


def _looks_like_pack(path):
    try:
        with open(path, "rb") as h:
            return h.read(4) in (b"SARC", b"Yaz0")
    except OSError:
        return False


def import_stock(source, stock_dir):
    """Copies Men.pack, Men2.pack (and cafe_barista_men.bfsar) out of a menu dump: zip or folder."""
    os.makedirs(stock_dir, exist_ok=True)
    got = []

    def keep(f, tmp):
        if f.endswith(".pack") and not _looks_like_pack(tmp):
            os.remove(tmp)  # not a real menu file: leave what we already have alone
            return
        os.replace(tmp, os.path.join(stock_dir, f))
        got.append(f)
    if os.path.isdir(source):
        names = []
        for root, _dirs, files in os.walk(source):
            names += [os.path.join(root, n) for n in files if n in STOCK]
        for f, p in _stock_member(names).items():
            if os.path.getsize(p) > STOCK_MAX:
                continue
            tmp = os.path.join(stock_dir, f + ".tmp")
            shutil.copyfile(p, tmp)
            keep(f, tmp)
    elif zipfile is not None and zipfile.is_zipfile(source):
        with zipfile.ZipFile(source) as z:
            for f, m in _stock_member(z.namelist()).items():
                if z.getinfo(m).file_size > STOCK_MAX:
                    continue
                tmp = os.path.join(stock_dir, f + ".tmp")
                with z.open(m) as src, open(tmp, "wb") as dst:
                    shutil.copyfileobj(src, dst)
                keep(f, tmp)
    if "Men.pack" not in got or "Men2.pack" not in got:
        raise ValueError("no Wii U menu files found there")
    return stock_status(stock_dir)


# ───────────── .utheme → pictures the Wii U screen uses ─────────────
# slot → (pack, layout archive, texture). Slots match the file names in bundle/assets/wiiu.
SLOTS = {
    "tile-glass": ("Men2", "Common/Layout/LauncherIcon.szs", "LauncherBtnSpecGlass"),
    "empty-slot": ("Men2", "Common/Layout/LauncherIcon.szs", "EmptyAppIcon_00"),
    "downloads": ("Men2", "Common/Layout/OverlayAppBase.szs", "HBMIconL_006"),
    "icon-browser": ("Men2", "Common/Layout/OverlayAppBase.szs", "HBMIconL_000"),
    "icon-shop": ("Men2", "Common/Layout/OverlayAppBase.szs", "HBMIconL_001"),
    "icon-friends": ("Men2", "Common/Layout/OverlayAppBase.szs", "HBMIconL_002"),
    "icon-messages": ("Men2", "Common/Layout/OverlayAppBase.szs", "HBMIconL_003"),
    "icon-tvii": ("Men2", "Common/Layout/OverlayAppBase.szs", "HBMIconL_004"),
    "icon-mii": ("Men2", "Common/Layout/OverlayAppBase.szs", "HBMIconL_005"),
    "page-arrow": ("Men2", "Common/Layout/BtnSlideLauncher.szs", "BtnLauncherR_00"),
    "network-mark": ("Men2", "Common/Layout/BtnAccountSelect.szs", "NetworkMark_01"),
    "account-frame": ("Men2", "Common/Layout/BtnAccountSelect.szs", "BtnAccountSpec_00"),
    "swap-arrow": ("Men", "Common/Layout/BtnSwap_00.szs", "SwapArrow"),
    "swap-button": ("Men", "Common/Layout/BtnSwap_00.szs", "BtnSwap_00"),  # the round GamePad-corner body (226 px)
    "swap-icon": ("Men", "Common/Layout/BtnSwap_00.szs", "SwapIcon_01"),  # TV over GamePad picture (142 x 160)
}


# Backgrounds come from the menu's 3D models (gsys.bfres inside Men2.pack): the home wallpaper is LoungeVR's
# "bg02" (animated themes ship numbered frames 1..n instead and keep a placeholder in bg02; frame 1 is used),
# the Wara Wara Plaza floor is LoungeFloor's "Floor_Alb". slot -> (archive, picture, widest size kept)
BACKGROUNDS = {
    "grid-background": ("Common/Model/LoungeVR.szs", "bg02", 1280),
    "plaza-floor": ("Common/Model/LoungeFloor.szs", "Floor_Alb", 1024),
}


def _shrink(w, h, rgba, widest):
    """Nearest-neighbour downscale so the picture is at most `widest` wide (bigger ones only cost memory)."""
    if w <= widest:
        return w, h, rgba
    nw, nh = widest, max(1, h * widest // w)
    src = memoryview(rgba).cast("I")
    xs = [x * w // nw for x in range(nw)]
    out = array("I")
    for y in range(nh):
        base = (y * h // nh) * w
        out.extend([src[base + x] for x in xs])
    return nw, nh, out.tobytes()


def background_picture(pack, archive, tex):
    """(w, h, rgba) of one background texture of a Men2-style pack, or None when it has none we can read."""
    key = _archive_key(pack, archive)
    if key is None:
        return None
    inner = sarc(pack[key])
    name = next((k for k in inner if k.lower().endswith(".bfres")), None)
    if name is None:
        return None
    fres = inner[name]
    found = fres_textures(fres)
    pick = tex
    if tex == "bg02" and "1" in found and found["1"]["width"] >= 640:
        pick = "1"
    if pick not in found:
        return None
    return ftex_rgba(fres, found[pick])


def _read_member(z, info, limit):
    """Bytes of one zip member, never more than limit (the declared size is not trusted)."""
    with z.open(info) as f:
        data = f.read(limit + 1)
    if len(data) > limit:
        raise ValueError("file too large")
    return data


def _members(z):
    """Normalised view of a .utheme's files: patches by stock name, metadata."""
    infos = {i.filename: i for i in z.infolist() if not i.is_dir()}
    meta = {}
    mname = next((n for n in infos if n.rsplit("/", 1)[-1].lower() == "metadata.json"), None)
    if mname:
        try:
            meta = json.loads(_read_member(z, infos[mname], MEMBER_MAX["meta"]).decode("utf-8", "replace"))
        except Exception:
            meta = {}
    if not isinstance(meta, dict):
        meta = {}
    # Theme Café's tool also records where each patch applies ("Patches": {"Men.bps": "Common/Package/Men.pack"});
    # Themezer's files leave it out and name the patch after the file instead.
    where = meta.get("Patches") if isinstance(meta.get("Patches"), dict) else {}
    patches = {}
    for n in infos:
        if not n.lower().endswith(".bps"):
            continue
        base = n.rsplit("/", 1)[-1]
        target = str(where.get(base) or where.get(n) or "").replace("\\", "/").rsplit("/", 1)[-1] or base[:-4]
        stem = target.rsplit(".", 1)[0] if target.lower().endswith((".pack", ".bfsar")) else target
        patches.setdefault(stem, n)
    return infos, meta, patches


def utheme_info(path):
    """Name, author and which stock files (by checksum) a .utheme needs. None if it isn't one."""
    if zipfile is None or not zipfile.is_zipfile(path):
        return None
    with zipfile.ZipFile(path) as z:
        infos, meta, patches = _members(z)
        if not patches:
            return None
        md = meta.get("Metadata") if isinstance(meta.get("Metadata"), dict) else {}
        needs, other = {}, []
        for stem, n in patches.items():
            if stem not in USED:
                other.append(stem)  # sound archive, text, fonts: nothing we show
                continue
            needs[stem] = "%08x" % bps_crcs(_read_member(z, infos[n], MEMBER_MAX["bps"]))[0]
        low = {n.lower(): n for n in infos}
        pic = lambda stem: next((n for k, n in low.items() if k.rsplit("/", 1)[-1].startswith(stem) and k.endswith((".jpg", ".jpeg", ".png"))), None)
        return {"name": str(md.get("themeName") or os.path.splitext(os.path.basename(path))[0])[:80],
                "author": str(md.get("themeAuthor") or "")[:80], "id": str(md.get("themeID") or "")[:60],
                "version": str(md.get("themeVersion") or "")[:40], "region": str(md.get("themeRegion") or "")[:12],
                "needs": needs, "other": sorted(other), "patches": patches,
                "preview": pic("preview-launcher") or pic("preview"), "previewPlaza": pic("preview-warawara"),
                "previewCollage": pic("preview-collage"), "splash": low.get("splash.png")}


def _mime(raw):
    return "image/png" if raw[:4] == b"\x89PNG" else "image/jpeg"


def read_utheme(path, stock_dir, data_url):
    """The theme's pictures for the Wii U screen, or what's missing to show them.

    data_url(raw, mime) builds the data: URLs (main.py's helper). A broken part never loses the rest;
    what failed is listed in "errors"."""
    info = utheme_info(path)
    if info is None:
        return None
    res = {"name": info["name"], "author": info["author"], "id": info["id"], "version": info["version"],
           "region": info["region"], "art": {}, "changed": [], "errors": [], "ignored": info["other"]}
    stock = stock_status(stock_dir)
    have = {f.rsplit(".", 1)[0]: v["crc"] for f, v in stock.items()}
    missing = [b for b, crc in info["needs"].items() if have.get(b) != crc]
    if missing:
        res["needsStock"] = not any(b in have for b in USED)
        res["stockMismatch"] = [] if res["needsStock"] else sorted(missing)
        res["stockVersion"] = next((v["version"] for v in stock.values() if v["version"]), "")
    packs = {}
    with zipfile.ZipFile(path) as z:
        infos = {i.filename: i for i in z.infolist()}
        for key, limit in (("preview", 6), ("previewPlaza", 6), ("previewCollage", 6), ("splash", 12)):
            if info.get(key):
                try:
                    raw = _read_member(z, infos[info[key]], limit * 1024 * 1024)
                    res[key] = data_url(raw, _mime(raw))
                except Exception:
                    res["errors"].append(key)
        if missing:
            return res
        for base in USED:
            if base not in info["needs"]:
                continue
            try:
                with open(os.path.join(stock_dir, base + ".pack"), "rb") as f:
                    src = f.read()
                patch = _read_member(z, infos[info["patches"][base]], MEMBER_MAX["bps"])
                packs[base] = (sarc(src), sarc(bps_apply(src, patch)))
            except Exception as e:
                res["errors"].append("%s: %s" % (base, str(e)[:80]))
    memo = {}  # a layout archive is decompressed once however many pictures come from it

    def textures(base, which, archive):
        k = (base, which, archive)
        if k not in memo:
            try:
                memo[k] = layout_textures(packs[base][which], archive)
            except Exception:
                memo[k] = {}
        return memo[k]
    for slot, (base, archive, tex) in SLOTS.items():
        if base not in packs:
            continue
        stock_pack, themed = packs[base]
        try:
            ka, kb = _archive_key(stock_pack, archive), _archive_key(themed, archive)
            if kb is None or themed.get(kb) == stock_pack.get(ka):
                continue
            new = textures(base, 1, archive).get(tex)
            if new is None or new == textures(base, 0, archive).get(tex):
                continue
            r = bflim_rgba(new)
            if r:
                res["art"][slot] = data_url(png(*r), "image/png")
        except Exception:
            continue  # one broken picture never loses the whole theme
    if "Men2" in packs:  # wallpaper and plaza floor: a changed model archive whose picture decodes
        stock_pack, themed = packs["Men2"]
        for slot, (archive, tex, widest) in BACKGROUNDS.items():
            try:
                ka, kb = _archive_key(stock_pack, archive), _archive_key(themed, archive)
                if kb is None or themed.get(kb) == stock_pack.get(ka):
                    continue
                r = background_picture(themed, archive, tex)
                if r:
                    w, h, px = _shrink(*r, widest)
                    res["art"][slot] = data_url(png(w, h, px, opaque=all(px[3::4])), "image/png")
            except Exception as e:
                res["errors"].append("%s: %s" % (slot, str(e)[:60]))
    for base, (a, b) in packs.items():
        res["changed"] += sorted(k for k in b if a.get(k) != b[k])
    return res


# ───────────── finding files in Downloads / SD cards ─────────────

def scan_roots(home):
    roots = [os.path.join(home, "Downloads"), os.path.join(home, "Desktop")]
    media = "/run/media"
    try:
        for user in os.listdir(media):
            p = os.path.join(media, user)
            roots += [os.path.join(p, d) for d in os.listdir(p)] if os.path.isdir(p) and not os.path.ismount(p) else [p]
    except OSError:
        pass
    return [r for r in roots if os.path.isdir(r)]


def _classify(path):
    """'theme', 'stock' or '' for one file or folder (cheap: only reads file lists)."""
    low = path.lower()
    if os.path.isdir(path):
        names = []
        for root, _dirs, files in os.walk(path):
            if root[len(path):].count(os.sep) > 8:
                continue
            names += [os.path.join(root, n) for n in files if n in STOCK]
        return "stock" if _stock_member(names) else ""
    size = os.path.getsize(path)
    if size > SCAN_MAX:
        return ""
    if low.endswith(".utheme"):
        return "theme" if size <= UTHEME_MAX and utheme_info(path) else ""
    if low.endswith(".zip") and zipfile is not None and zipfile.is_zipfile(path):
        with zipfile.ZipFile(path) as z:
            return "stock" if _stock_member(z.namelist()) else ""
    return ""


_DUMP_DIRS = {"mlc01", "sys", "title", "00050010", "content", "common", "package"}


def _dump_looking(name):
    """A folder name worth following below the depth limit: a menu dump's own folders, or what a dump is usually called."""
    low = name.lower()
    return low in _DUMP_DIRS or low.startswith(("1004", "mlc01")) or "wiiu" in low.replace(" ", "").replace("_", "").replace("-", "") and "menu" in low


def scan(roots, state, max_depth=3):
    """New or changed candidates since the last scan. state is {path: {size, mtime, kind, decision}}
    and is updated in place; files already seen are not opened again."""
    found = []
    for root in roots:
        base = root.rstrip(os.sep).count(os.sep)
        for cur, dirs, files in os.walk(root):
            depth = cur.rstrip(os.sep).count(os.sep) - base
            # past max_depth only follow a Wii U menu dump's own folders (mlc01/sys/title/…/content/Common/Package)
            dirs[:] = [d for d in dirs if not d.startswith(".") and (depth < max_depth or _dump_looking(d))]
            cands = [os.path.join(cur, f) for f in files if f.lower().endswith((".utheme", ".zip"))]
            if "Men.pack" in files:
                title = os.path.dirname(os.path.dirname(os.path.dirname(cur)))  # …/<title>/content/Common/Package
                cands.append(title if cur.replace("\\", "/").lower().endswith("content/common/package") else cur)
            for p in cands:
                try:
                    st = os.stat(p)
                except OSError:
                    continue
                key = os.path.realpath(p)
                old = state.get(key)
                sig = {"size": st.st_size, "mtime": int(st.st_mtime)}
                if old and old.get("size") == sig["size"] and old.get("mtime") == sig["mtime"]:
                    if old.get("kind") and not old.get("decision"):
                        found.append({"path": key, "kind": old["kind"], "name": old.get("name", "")})
                    continue
                try:
                    kind = _classify(p)
                except Exception:
                    kind = ""
                entry = dict(sig, kind=kind)
                if kind == "theme":
                    entry["name"] = (utheme_info(p) or {}).get("name", "")
                state[key] = entry
                if kind:
                    found.append({"path": key, "kind": kind, "name": entry.get("name", "")})
    seen = set()
    return [f for f in found if not (f["path"] in seen or seen.add(f["path"]))]
