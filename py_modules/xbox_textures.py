"""Original Xbox texture archives -> PNG, pure Python (no PIL / numpy).

Containers
  * XBMC4Xbox "XPR" archives (media/Textures.xpr): a 12 byte header (magic 'XPR' + a version byte, total size,
    header size) followed by 128 byte entries {name[116], offset, unpacked size, packed size}. Every entry is an
    LZO1X stream that unpacks to a 128 byte texture header plus the pixels.
  * Microsoft "XPR0" resource files (UnleashX skins, fonts): header {magic, total size, header size} then D3D
    texture headers {Common, Data, Lock, Format, Size}; pixels follow at header size + Data.
  * XBMC / Kodi "XBTF" archives (Textures.xbt): file table of frames, LZO1X packed, formats DXT1/3/5, ARGB, A8.

Pixel formats: A8R8G8B8, X8R8G8B8, R5G6B5, A1R5G5B5, X1R5G5B5, A4R4G4B4, DXT1/DXT3/DXT5, L8, A8, A8L8, P8
(swizzled / Morton order and the linear variants).

Everything here is capped (sizes, counts) and returns None / [] on bad data instead of raising.
"""
import struct
import zlib

MAX_DIM = 2048
MAX_UNPACKED = 24 * 1024 * 1024
MAX_PNG = 3 * 1024 * 1024


# ───────────────────────── LZO1X decompression (minilzo structure) ─────────────────────────
def lzo1x_decompress(src, expected=None, limit=MAX_UNPACKED):
    """LZO1X data -> bytes. Raises ValueError on malformed input."""
    out = bytearray()
    n = len(src)
    ip = 0
    if n < 3:
        raise ValueError("short")
    limit = min(limit, expected + 64) if expected else limit

    def copy_match(dist, length):
        if dist <= 0 or dist > len(out):
            raise ValueError("bad distance")
        start = len(out) - dist
        if dist >= length:
            out.extend(out[start:start + length])
        else:
            pat = bytes(out[start:])
            reps = length // dist + 1
            out.extend((pat * reps)[:length])

    state = 0  # 0 = top of loop, 1 = first literal run done, 2 = match, 3 = match_next(t literals)
    t = src[0]
    if t > 17:
        ip = 1
        t -= 17
        out.extend(src[ip:ip + t])
        ip += t
        state = 5 if t < 4 else 1
    try:
        while True:
            if len(out) > limit:
                raise ValueError("too big")
            if state == 0:
                t = src[ip]
                ip += 1
                if t >= 16:
                    state = 2
                    continue
                if t == 0:
                    while src[ip] == 0:
                        t += 255
                        ip += 1
                    t += 15 + src[ip]
                    ip += 1
                out.extend(src[ip:ip + t + 3])
                ip += t + 3
                state = 1
                continue
            if state == 1:  # first_literal_run
                t = src[ip]
                ip += 1
                if t >= 16:
                    state = 2
                    continue
                dist = 1 + 0x0800 + (t >> 2) + (src[ip] << 2)
                ip += 1
                copy_match(dist, 3)
                state = 4
                continue
            if state == 2:  # match, t >= 16 (or <16 after match_next)
                if t >= 64:
                    dist = 1 + ((t >> 2) & 7) + (src[ip] << 3)
                    ip += 1
                    copy_match(dist, (t >> 5) - 1 + 2)
                elif t >= 32:
                    t &= 31
                    if t == 0:
                        while src[ip] == 0:
                            t += 255
                            ip += 1
                        t += 31 + src[ip]
                        ip += 1
                    d = (src[ip] >> 2) + (src[ip + 1] << 6)
                    ip += 2
                    copy_match(1 + d, t + 2)
                elif t >= 16:
                    hi = (t & 8) << 11
                    t &= 7
                    if t == 0:
                        while src[ip] == 0:
                            t += 255
                            ip += 1
                        t += 7 + src[ip]
                        ip += 1
                    d = (src[ip] >> 2) + (src[ip + 1] << 6)
                    ip += 2
                    if hi + d == 0:
                        break  # end of stream
                    copy_match(hi + d + 0x4000, t + 2)
                else:
                    dist = 1 + (t >> 2) + (src[ip] << 2)
                    ip += 1
                    copy_match(dist, 2)
                state = 4
                continue
            if state == 4:  # match_done
                t = src[ip - 2] & 3
                if t == 0:
                    state = 0
                    continue
                state = 3
            if state == 3:  # match_next
                out.extend(src[ip:ip + t])
                ip += t
                state = 5
            if state == 5:
                t = src[ip]
                ip += 1
                state = 2
                continue
    except IndexError:
        raise ValueError("truncated")
    return bytes(out)


# ───────────────────────── PNG ─────────────────────────
def _chunk(k, v):
    return struct.pack(">I", len(v)) + k + v + struct.pack(">I", zlib.crc32(k + v) & 0xFFFFFFFF)


def rgba_to_png(w, h, rgba, level=6):
    """RGBA bytes (w*h*4) -> PNG bytes (colour type 6, or 2 when there is no transparency)."""
    opaque = rgba[3::4].count(255) == w * h
    if opaque:
        rows = []
        for y in range(h):
            line = rgba[y * w * 4:(y + 1) * w * 4]
            px = bytearray(w * 3)
            px[0::3] = line[0::4]
            px[1::3] = line[1::4]
            px[2::3] = line[2::4]
            rows.append(b"\x00" + bytes(px))
        ctype = 2
    else:
        rows = [b"\x00" + rgba[y * w * 4:(y + 1) * w * 4] for y in range(h)]
        ctype = 6
    return (b"\x89PNG\r\n\x1a\n" + _chunk(b"IHDR", struct.pack(">IIBBBBB", w, h, 8, ctype, 0, 0, 0))
            + _chunk(b"IDAT", zlib.compress(b"".join(rows), level)) + _chunk(b"IEND", b""))


# ───────────────────────── pixel decoding ─────────────────────────
# D3D8 (Xbox) format codes. Swizzled formats first, then the linear (pitch) variants.
F_L8, F_AL8, F_A1R5G5B5, F_X1R5G5B5, F_A4R4G4B4, F_R5G6B5, F_A8R8G8B8, F_X8R8G8B8 = 0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07
F_P8, F_DXT1, F_DXT3, F_DXT5, F_A8, F_A8L8 = 0x0B, 0x0C, 0x0E, 0x0F, 0x19, 0x1A
F_LIN_A1R5G5B5, F_LIN_R5G6B5, F_LIN_A8R8G8B8, F_LIN_L8, F_LIN_A4R4G4B4, F_LIN_X8R8G8B8 = 0x10, 0x11, 0x12, 0x13, 0x1D, 0x1E
F_LIN_A8, F_LIN_A8L8, F_LIN_X1R5G5B5 = 0x1F, 0x20, 0x1C

_BPP = {F_L8: 1, F_AL8: 1, F_A1R5G5B5: 2, F_X1R5G5B5: 2, F_A4R4G4B4: 2, F_R5G6B5: 2, F_A8R8G8B8: 4, F_X8R8G8B8: 4,
        F_P8: 1, F_A8: 1, F_A8L8: 2,
        F_LIN_A1R5G5B5: 2, F_LIN_R5G6B5: 2, F_LIN_A8R8G8B8: 4, F_LIN_L8: 1, F_LIN_A4R4G4B4: 2, F_LIN_X8R8G8B8: 4,
        F_LIN_A8: 1, F_LIN_A8L8: 2, F_LIN_X1R5G5B5: 2}
_LINEAR = {F_LIN_A1R5G5B5, F_LIN_R5G6B5, F_LIN_A8R8G8B8, F_LIN_L8, F_LIN_A4R4G4B4, F_LIN_X8R8G8B8, F_LIN_A8, F_LIN_A8L8,
           F_LIN_X1R5G5B5}
_BASE = {F_LIN_A1R5G5B5: F_A1R5G5B5, F_LIN_R5G6B5: F_R5G6B5, F_LIN_A8R8G8B8: F_A8R8G8B8, F_LIN_L8: F_L8,
         F_LIN_A4R4G4B4: F_A4R4G4B4, F_LIN_X8R8G8B8: F_X8R8G8B8, F_LIN_A8: F_A8, F_LIN_A8L8: F_A8L8,
         F_LIN_X1R5G5B5: F_X1R5G5B5}
_DXT = {F_DXT1, F_DXT3, F_DXT5}


def _morton_tables(w, h):
    """Per-x and per-y offsets (in texels) of the Xbox swizzle: x and y bits interleaved, x first; the longer
    side keeps its extra high bits above the interleaved part."""
    xs, ys = [0] * w, [0] * h
    masks_x, masks_y = [], []
    bit, out = 1, 1
    while bit < max(w, h):
        if bit < w:
            masks_x.append((bit, out))
            out <<= 1
        if bit < h:
            masks_y.append((bit, out))
            out <<= 1
        bit <<= 1
    for x in range(w):
        xs[x] = sum(o for b, o in masks_x if x & b)
    for y in range(h):
        ys[y] = sum(o for b, o in masks_y if y & b)
    return xs, ys


def _expand(v, bits):
    return (v * 255 + ((1 << bits) - 1) // 2) // ((1 << bits) - 1)


_LUT5 = [_expand(i, 5) for i in range(32)]
_LUT6 = [_expand(i, 6) for i in range(64)]
_LUT4 = [i * 17 for i in range(16)]


def _unpack16(fmt, v):
    if fmt == F_R5G6B5:
        return _LUT5[v >> 11], _LUT6[(v >> 5) & 63], _LUT5[v & 31], 255
    if fmt == F_A1R5G5B5:
        return _LUT5[(v >> 10) & 31], _LUT5[(v >> 5) & 31], _LUT5[v & 31], 255 if v & 0x8000 else 0
    if fmt == F_X1R5G5B5:
        return _LUT5[(v >> 10) & 31], _LUT5[(v >> 5) & 31], _LUT5[v & 31], 255
    if fmt == F_A4R4G4B4:
        return _LUT4[(v >> 8) & 15], _LUT4[(v >> 4) & 15], _LUT4[v & 15], _LUT4[v >> 12]
    return v & 255, v & 255, v & 255, v >> 8  # A8L8


def _rgb565(c):
    return _LUT5[c >> 11], _LUT6[(c >> 5) & 63], _LUT5[c & 31]


def _decode_dxt(fmt, data, w, h):
    bw, bh = (w + 3) // 4, (h + 3) // 4
    bsize = 8 if fmt == F_DXT1 else 16
    if len(data) < bw * bh * bsize:
        raise ValueError("short dxt data")
    out = bytearray(w * h * 4)
    pos = 0
    for by in range(bh):
        for bx in range(bw):
            if fmt == F_DXT1:
                a = None
                cpos = pos
            else:
                a = data[pos:pos + 8]
                cpos = pos + 8
            c0v, c1v, bits = struct.unpack_from("<HHI", data, cpos)
            c0, c1 = _rgb565(c0v), _rgb565(c1v)
            if c0v > c1v or fmt != F_DXT1:
                cols = [c0 + (255,), c1 + (255,),
                        tuple((2 * p + q) // 3 for p, q in zip(c0, c1)) + (255,),
                        tuple((p + 2 * q) // 3 for p, q in zip(c0, c1)) + (255,)]
            else:
                cols = [c0 + (255,), c1 + (255,), tuple((p + q) // 2 for p, q in zip(c0, c1)) + (255,), (0, 0, 0, 0)]
            if fmt == F_DXT3:
                abits = int.from_bytes(a, "little")
            elif fmt == F_DXT5:
                a0, a1 = a[0], a[1]
                if a0 > a1:
                    pal = [a0, a1] + [((7 - i) * a0 + i * a1) // 7 for i in range(1, 7)]
                else:
                    pal = [a0, a1] + [((5 - i) * a0 + i * a1) // 5 for i in range(1, 5)] + [0, 255]
                abits = int.from_bytes(a[2:8], "little")
            for j in range(16):
                x, y = bx * 4 + (j & 3), by * 4 + (j >> 2)
                if x >= w or y >= h:
                    continue
                r, g, b, al = cols[(bits >> (2 * j)) & 3]
                if fmt == F_DXT3:
                    al = _LUT4[(abits >> (4 * j)) & 15]
                elif fmt == F_DXT5:
                    al = pal[(abits >> (3 * j)) & 7]
                o = (y * w + x) * 4
                out[o:o + 4] = bytes((r, g, b, al))
            pos += bsize
    return bytes(out)


def decode_pixels(fmt, data, w, h, pitch=None, palette=None):
    """Raw texture bytes -> RGBA bytes (w*h*4), or raise ValueError. `fmt` is the D3D8 format code."""
    if w <= 0 or h <= 0 or w > MAX_DIM or h > MAX_DIM:
        raise ValueError("size")
    if fmt in _DXT:  # block compressed: always stored in 4x4 block order
        return _decode_dxt(fmt, data, w, h)
    linear = fmt in _LINEAR
    base = _BASE.get(fmt, fmt)
    bpp = _BPP.get(fmt)
    if bpp is None:
        raise ValueError("format 0x%02x" % fmt)
    if linear:
        stride = pitch or w * bpp
        if stride < w * bpp or len(data) < stride * (h - 1) + w * bpp:
            raise ValueError("short linear data")
        offs = None
    else:
        tw = 1 << max(0, (w - 1).bit_length())  # swizzled textures are power-of-two sized
        th = 1 << max(0, (h - 1).bit_length())
        if tw != w or th != h:
            raise ValueError("swizzled non power of two")
        if len(data) < w * h * bpp:
            raise ValueError("short data")
        xs, ys = _morton_tables(w, h)
    out = bytearray(w * h * 4)
    if base in (F_A8R8G8B8, F_X8R8G8B8):
        if linear:
            rows = [data[y * stride:y * stride + w * 4] for y in range(h)]
        else:
            mv = memoryview(bytes(data[:w * h * 4])).cast("I")
            rows = []
            for y in range(h):
                yo = ys[y]
                ba = bytearray(w * 4)
                ba[:] = struct.pack("<%dI" % w, *[mv[xs[x] + yo] for x in range(w)])
                rows.append(ba)
        for y, row in enumerate(rows):
            line = bytearray(row)
            line[0::4], line[2::4] = row[2::4], row[0::4]  # BGRA -> RGBA
            if base == F_X8R8G8B8:
                line[3::4] = b"\xff" * w
            out[y * w * 4:(y + 1) * w * 4] = line
        return bytes(out)
    for y in range(h):
        for x in range(w):
            if linear:
                o = y * stride + x * bpp
            else:
                o = (xs[x] + ys[y]) * bpp
            if bpp == 2:
                px = _unpack16(base, data[o] | (data[o + 1] << 8))
            else:
                v = data[o]
                if base == F_A8:
                    px = (255, 255, 255, v)
                elif base == F_P8:
                    if not palette or v * 4 + 4 > len(palette):
                        raise ValueError("palette")
                    p = palette[v * 4:v * 4 + 4]
                    px = (p[2], p[1], p[0], p[3])
                elif base == F_AL8:
                    px = ((v & 15) * 17, (v & 15) * 17, (v & 15) * 17, (v >> 4) * 17)
                else:
                    px = (v, v, v, 255)
            i = (y * w + x) * 4
            out[i:i + 4] = bytes(px)
    return bytes(out)


# ───────────────────────── XBMC4Xbox Textures.xpr ─────────────────────────
def _xbmc_entry_to_rgba(raw):
    """Unpacked XBMC texture (128 byte header + pixels) -> (w, h, rgba).
    Header: u32 flags (bit 0 = paletted, bit 1 = animated), a D3D texture header {Common, Data, Lock, Format, Size}
    at offset 4 (shifted by 12 bytes for paletted textures), then the real width / height as two u16."""
    flags = struct.unpack_from("<I", raw)[0]
    if flags & 2:
        raise ValueError("animated")
    paletted = bool(flags & 1)
    base = 28 if paletted else 16
    fmt_word, size = struct.unpack_from("<II", raw, base)
    rw, rh = struct.unpack_from("<HH", raw, base + 8)
    code = (fmt_word >> 8) & 255
    palette, pix, pitch = None, raw[128:], None
    if paletted:
        palette, pix = raw[128:1152], raw[1152:]
    if code in _LINEAR or code in _DXT:
        tw, th = (size & 0xFFF) + 1, ((size >> 12) & 0xFFF) + 1
        if code in _LINEAR:
            pitch = (((size >> 24) & 0xFF) + 1) * 64
    else:
        tw, th = 1 << ((fmt_word >> 20) & 15), 1 << ((fmt_word >> 24) & 15)
    full = decode_pixels(code, pix, tw, th, pitch, palette)
    if rw <= 0 or rh <= 0:
        rw, rh = tw, th
    rw, rh = min(rw, tw), min(rh, th)
    if (rw, rh) == (tw, th):
        return tw, th, full
    return rw, rh, b"".join(full[y * tw * 4:y * tw * 4 + rw * 4] for y in range(rh))


def xbmc_xpr_entries(data):
    """List of (name, offset, unpacked, packed) of an XBMC4Xbox Textures.xpr, or None when it is not one."""
    if len(data) < 12 + 128 or data[:3] != b"XPR" or data[3:4] == b"0":
        return None
    total, hsize = struct.unpack_from("<II", data, 4)
    if hsize < 12 + 128 or hsize > len(data) or (hsize - 12) // 128 > 20000:
        return None
    out = []
    for i in range((hsize - 12) // 128):
        o = 12 + i * 128
        raw = data[o:o + 116]
        name = raw.split(b"\0")[0]
        if not name:
            continue
        try:
            nm = name.decode("latin-1")
        except Exception:
            continue
        off, unp, pack = struct.unpack_from("<III", data, o + 116)
        out.append((nm, off, unp, pack))
    return out


def iter_xbmc_xpr(data, wanted=None, max_unpacked=MAX_UNPACKED):
    """Yield (name, w, h, rgba) for entries of an XBMC4Xbox Textures.xpr that decode; skips the rest.
    `wanted(name, unpacked_size)` may veto an entry before it is unpacked."""
    ents = xbmc_xpr_entries(data)
    for name, off, unp, pack in ents or []:
        try:
            if unp < 128 + 16 or unp > max_unpacked or off + pack > len(data):
                continue
            if wanted is not None and not wanted(name, unp):
                continue
            blob = data[off:off + pack]
            raw = blob if pack == unp else lzo1x_decompress(blob, unp)
            if len(raw) < 128:
                continue
            w, h, rgba = _xbmc_entry_to_rgba(raw)
            yield name, w, h, rgba
        except Exception:
            continue


# ───────────────────────── Microsoft XPR0 ─────────────────────────
def xpr0_textures(data):
    """Textures of an XPR0 resource file as [(w, h, rgba)]. Never raises."""
    out = []
    try:
        if len(data) < 32 or data[:4] != b"XPR0":
            return out
        total, hsize = struct.unpack_from("<II", data, 4)
        if hsize < 32 or hsize > len(data):
            return out
        pos = 12
        while pos + 20 <= hsize and len(out) < 16:
            common = struct.unpack_from("<I", data, pos)[0]
            if common == 0xFFFFFFFF:
                break
            if (common & 0x00070000) != 0x00040000:  # not a texture: user data entry {type, offset, size}
                pos += 12
                continue
            _c, doff, _lock, fmt_word, size = struct.unpack_from("<5I", data, pos)
            pos += 20
            code = (fmt_word >> 8) & 255
            try:
                if code == F_P8:
                    continue  # palettes live elsewhere in XPR0 files; not used by skins
                pitch = None
                if (code in _LINEAR or code in _DXT) and size:
                    w, h = (size & 0xFFF) + 1, ((size >> 12) & 0xFFF) + 1
                    if code in _LINEAR:
                        pitch = (((size >> 24) & 0xFF) + 1) * 64
                else:
                    w, h = 1 << ((fmt_word >> 20) & 15), 1 << ((fmt_word >> 24) & 15)
                start = hsize + doff
                out.append((w, h, decode_pixels(code, data[start:], w, h, pitch)))
            except Exception:
                continue
    except Exception:
        pass
    return out


# ───────────────────────── Kodi XBTF (Textures.xbt) ─────────────────────────
XB_FMT = {1: F_DXT1, 2: F_DXT3, 4: F_DXT5}


def xbt_entries(data):
    """[(path, [frames])] of an XBTF archive; each frame (w, h, fmt, packed, unpacked, offset). None if not XBTF."""
    if len(data) < 9 or data[:4] != b"XBTF":
        return None
    count = struct.unpack_from("<I", data, 5)[0]
    pos = 9
    out = []
    for _ in range(min(count, 20000)):
        path = data[pos:pos + 256].split(b"\0")[0].decode("latin-1")
        loop, nframes = struct.unpack_from("<II", data, pos + 256)
        pos += 264
        frames = []
        for _f in range(min(nframes, 64)):
            w, h, fmt, packed, unpacked, dur, off = struct.unpack_from("<IIIQQIQ", data, pos)
            pos += 40
            frames.append((w, h, fmt, packed, unpacked, off))
        out.append((path, frames))
    return out


def iter_xbt(data, wanted=None, max_unpacked=MAX_UNPACKED):
    """Yield (name, w, h, rgba) for the first frame of every XBTF entry that decodes."""
    try:
        ents = xbt_entries(data)
        if ents is None:
            return
        pos0 = 9
        for path, frames in ents:
            pos0 += 264 + 40 * len(frames)
        for path, frames in ents:
            try:
                if not frames:
                    continue
                w, h, fmt, packed, unpacked, off = frames[0]
                fmt &= 0xFFFF  # 0x10000 is the 'opaque' flag
                if unpacked > max_unpacked or w > MAX_DIM or h > MAX_DIM:
                    continue
                if wanted is not None and not wanted(path, unpacked):
                    continue
                blob = data[pos0 + off:pos0 + off + packed]
                raw = blob if packed == unpacked else lzo1x_decompress(blob, unpacked)
                if fmt in XB_FMT:
                    rgba = _decode_dxt(XB_FMT[fmt], raw, w, h)
                elif fmt == 16:  # A8R8G8B8, linear (BGRA byte order)
                    if len(raw) < w * h * 4:
                        continue
                    rgba = bytearray(raw[:w * h * 4])
                    rgba[0::4], rgba[2::4] = raw[2:w * h * 4:4], raw[0:w * h * 4:4]
                    rgba = bytes(rgba)
                elif fmt == 32:  # A8
                    rgba = b"".join(b"\xff\xff\xff" + raw[i:i + 1] for i in range(w * h))
                elif fmt == 64:  # RGBA8
                    rgba = raw[:w * h * 4]
                elif fmt == 128:  # RGB8
                    px = bytearray(w * h * 4)
                    px[0::4], px[1::4], px[2::4], px[3::4] = raw[0:w * h * 3:3], raw[1:w * h * 3:3], raw[2:w * h * 3:3], b"\xff" * (w * h)
                    rgba = bytes(px)
                else:
                    continue
                yield path, w, h, rgba
            except Exception:
                continue
    except Exception:
        return
