"""Original Xbox texture archives: LZO, every pixel format, XBMC Textures.xpr, XPR0, XBTF, and skins that use them."""
import os, sys, struct, tempfile, time, zipfile, zlib, base64
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "py_modules"))
import xbox_skins as X
import xbox_textures as T

XBMC_SKIN = b"<skin><defaultresolution>720p</defaultresolution><credits><skinname>Cool</skinname></credits></skin>"
PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")


def put(root, rel, data):
    p = os.path.join(root, *rel.split("/"))
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "wb").write(data)


def png_pixels(data_or_url):
    """PNG (bytes or data URL) -> (w, h, rgba); reads the filter-0 files xbox_textures writes."""
    b = base64.b64decode(data_or_url.split(",", 1)[1]) if isinstance(data_or_url, str) else data_or_url
    assert b[:8] == b"\x89PNG\r\n\x1a\n"
    pos, idat = 8, b""
    while pos < len(b):
        n, k = struct.unpack(">I4s", b[pos:pos + 8])
        body = b[pos + 8:pos + 8 + n]
        if k == b"IHDR":
            w, h, _depth, ctype = struct.unpack(">IIBB", body[:10])
        if k == b"IDAT":
            idat += body
        pos += 12 + n
    raw = zlib.decompress(idat)
    cn = 4 if ctype == 6 else 3
    out = bytearray()
    for y in range(h):
        row = raw[y * (w * cn + 1):(y + 1) * (w * cn + 1)]
        assert row[0] == 0
        for x in range(w):
            px = row[1 + x * cn:1 + x * cn + cn]
            out += px if cn == 4 else px + b"\xff"
    return w, h, bytes(out)


def morton(x, y, w, h):
    """Independent Xbox swizzle: interleave x and y bits (x first) until the short side runs out."""
    o, bit, ob = 0, 1, 1
    while bit < max(w, h):
        if bit < w:
            o |= ob if x & bit else 0
            ob <<= 1
        if bit < h:
            o |= ob if y & bit else 0
            ob <<= 1
        bit <<= 1
    return o


def swz(bpp, w, h, f):
    out = bytearray(w * h * bpp)
    for y in range(h):
        for x in range(w):
            o = morton(x, y, w, h) * bpp
            out[o:o + bpp] = f(x, y)
    return bytes(out)


def rgba(w, h, f):
    return b"".join(bytes(f(x, y)) for y in range(h) for x in range(w))


v565 = lambda r, g, b: ((r << 11) | (g << 5) | b).to_bytes(2, "little")
BLK = v565(31, 0, 0) + v565(0, 0, 31) + bytes((0b11_10_01_00,)) * 4  # DXT1 block: red, blue, 2/3 mix, 1/3 mix
PAL = b"".join(bytes((i, 0, 255 - i, 255)) for i in range(256))  # BGRA palette

# ───────────────────────── LZO ─────────────────────────
# the real 45 byte LZO block of blue.png from the Mosaic skin: 1280 bytes (an 8x8 paletted texture)
REAL = bytes.fromhex("13010066000300e300010004010104af01290b31810308440020370200ff8009000020000000005e0000110000")
raw = T.lzo1x_decompress(REAL, 1280)
assert len(raw) == 1280 and raw[128:132] == b"\xff\x80\x00\xff" and raw[:4] == b"\x01\x00\x01\x00"
w, h, px = T._xbmc_entry_to_rgba(raw)
assert (w, h) == (8, 8) and px[:4] == bytes((0, 128, 255, 255)), px[:4]
assert T.lzo1x_decompress(bytes([17 + 2]) + b"ab" + bytes([0x64, 0x00]) + b"\x11\x00\x00", 6) == b"ababab"  # overlapping match
for bad in (b"", b"\x00", b"\xff" * 40, REAL[:20], REAL[:-1], bytes(300)):
    try:
        T.lzo1x_decompress(bad, 1280)
    except ValueError:
        pass
try:  # an endless expansion stops at the limit
    T.lzo1x_decompress(bytes([17 + 4]) + b"abcd" + bytes([0x64, 0x00]) * 5000, limit=1000)
    assert False
except ValueError:
    pass

# ───────────────────────── pixel formats ─────────────────────────
px = T.decode_pixels(T.F_A8R8G8B8, swz(4, 8, 8, lambda x, y: bytes((x * 30, y * 30, 200, 255 - x))), 8, 8)  # BGRA in memory
assert px == rgba(8, 8, lambda x, y: (200, y * 30, x * 30, 255 - x)), "A8R8G8B8 swizzled"
px = T.decode_pixels(T.F_X8R8G8B8, swz(4, 8, 4, lambda x, y: bytes((1, 2, 3, 9))), 8, 4)
assert px[:4] == bytes((3, 2, 1, 255)), "X8R8G8B8 ignores alpha; non square swizzle"
lin = b"".join(bytes((10, 20, 30, 40)) * 5 + b"\0" * 12 for _ in range(3))  # pitch 32, width 5
assert T.decode_pixels(T.F_LIN_A8R8G8B8, lin, 5, 3, 32)[:8] == bytes((30, 20, 10, 40, 30, 20, 10, 40)), "linear with pitch"
px = T.decode_pixels(T.F_R5G6B5, swz(2, 4, 4, lambda x, y: v565(31, 0, 0) if x < 2 else v565(0, 63, 31)), 4, 4)
assert px[:4] == bytes((255, 0, 0, 255)) and px[8:12] == bytes((0, 255, 255, 255)), "R5G6B5"
px = T.decode_pixels(T.F_A1R5G5B5, swz(2, 4, 4, lambda x, y: (0x8000 | 31 << 10).to_bytes(2, "little") if y else (31).to_bytes(2, "little")), 4, 4)
assert px[:4] == bytes((0, 0, 255, 0)) and px[16:20] == bytes((255, 0, 0, 255)), "A1R5G5B5"
px = T.decode_pixels(T.F_A4R4G4B4, swz(2, 4, 4, lambda x, y: (0x8F00).to_bytes(2, "little")), 4, 4)
assert px[:4] == bytes((255, 0, 0, 136)), "A4R4G4B4"
assert T.decode_pixels(T.F_L8, swz(1, 4, 4, lambda x, y: bytes((x * 80,))), 4, 4)[4:8] == bytes((80, 80, 80, 255)), "L8"
assert T.decode_pixels(T.F_A8, swz(1, 4, 4, lambda x, y: bytes((7,))), 4, 4)[:4] == bytes((255, 255, 255, 7)), "A8"
assert T.decode_pixels(T.F_LIN_A8, bytes(range(16)), 4, 4)[20:24] == bytes((255, 255, 255, 5)), "linear A8"
assert T.decode_pixels(T.F_P8, swz(1, 4, 4, lambda x, y: bytes((x,))), 4, 4, palette=PAL)[4:8] == bytes((254, 0, 1, 255)), "P8"
px = T.decode_pixels(T.F_DXT1, BLK, 4, 4)
assert px[:16] == bytes((255, 0, 0, 255, 0, 0, 255, 255, 170, 0, 85, 255, 85, 0, 170, 255)) or px[:16] == bytes((255, 0, 0, 255, 0, 0, 255, 255, 85, 0, 170, 255, 170, 0, 85, 255)), px[:16]
assert T.decode_pixels(T.F_DXT1, v565(0, 0, 31) + v565(31, 0, 0) + bytes((0xFF,)) * 4, 4, 4)[3] == 0, "DXT1 punch-through alpha"
px = T.decode_pixels(T.F_DXT3, bytes((0x0F, 0x00)) + bytes(6) + BLK, 4, 4)
assert px[:4] == bytes((255, 0, 0, 255)) and px[4:8] == bytes((0, 0, 255, 0)), "DXT3 explicit alpha"
px = T.decode_pixels(T.F_DXT5, bytes((255, 0)) + bytes((0b00_001_000, 0, 0, 0, 0, 0)) + BLK, 4, 4)
assert px[3] == 255 and px[7] == 0, "DXT5 interpolated alpha"
big = T.decode_pixels(T.F_DXT1, BLK * 4, 8, 8)
assert len(big) == 8 * 8 * 4 and big[:4] == bytes((255, 0, 0, 255)) and big[4 * 4:4 * 4 + 4] == bytes((255, 0, 0, 255)), "DXT block order"
for bad in ((T.F_A8R8G8B8, b"x", 8, 8), (T.F_DXT1, b"x", 8, 8), (0x7F, bytes(64), 4, 4), (T.F_R5G6B5, bytes(64), 5, 5),
            (T.F_R5G6B5, bytes(64), 0, 4), (T.F_L8, bytes(64), 9999, 4), (T.F_P8, bytes(16), 4, 4)):
    try:
        T.decode_pixels(*bad)
        assert False, bad
    except ValueError:
        pass
assert png_pixels(T.rgba_to_png(2, 1, bytes((1, 2, 3, 255, 4, 5, 6, 7)))) == (2, 1, bytes((1, 2, 3, 255, 4, 5, 6, 7)))
assert png_pixels(T.rgba_to_png(1, 1, bytes((1, 2, 3, 255))))[2] == bytes((1, 2, 3, 255))


# ───────────────────────── XBMC Textures.xpr ─────────────────────────
def xbmc_raw(code, w, h, pixels, real=None, pal=None):
    """128 byte XBMC texture header (+ 1024 byte palette) + pixels."""
    if code >= 0x10 or code in (0x0C, 0x0E, 0x0F):
        size, fmt = (w - 1) | ((h - 1) << 12) | ((max(w * 4 // 64, 1) - 1) << 24), 0x29 | (code << 8)
    else:
        size, fmt = 0, 0x29 | (code << 8) | (1 << 16) | ((w.bit_length() - 1) << 20) | ((h.bit_length() - 1) << 24)
    head = struct.pack("<I", 0x10001 if pal else 0x10000) + b"\x01\x00\x01\x00" + bytes(8) + (bytes(12) if pal else b"")
    head += struct.pack("<II", fmt, size) + struct.pack("<HH", *(real or (w, h)))
    return head.ljust(128, b"\0") + (pal or b"") + pixels


def lzo_literals(raw):
    assert 4 <= len(raw) <= 238
    return bytes([17 + len(raw)]) + raw + b"\x11\x00\x00"


def xbmc_xpr(entries):
    """[(name, raw texture, packed)] -> Textures.xpr bytes."""
    hsize = 12 + 128 * len(entries)
    off = (hsize + 511) // 512 * 512
    table, blobs = b"", b""
    for name, raw, pack in entries:
        blob = lzo_literals(raw) if pack else raw
        table += name.encode().ljust(116, b"\0") + struct.pack("<III", off + len(blobs), len(raw), len(blob))
        blobs += blob + b"\0" * (-len(blob) % 512)
    return b"XPR\xb2" + struct.pack("<II", off + len(blobs), hsize) + table + b"\0" * (off - hsize) + blobs


bgw, bgh = 640, 64
bg_pix = b"".join(bytes((20 + x * 200 // bgw, 100, 10, 255)) for y in range(bgh) for x in range(bgw))  # BGRA
crop = xbmc_raw(T.F_A8R8G8B8, 4, 4, swz(4, 4, 4, lambda x, y: bytes((x * 30, y * 30, 200, 255))), real=(3, 2))  # 192 bytes: packs
pal_tex = xbmc_raw(T.F_P8, 8, 8, swz(1, 8, 8, lambda x, y: bytes((x,))), pal=PAL)
dxt_tex = xbmc_raw(0x0C, 8, 8, BLK * 4)
archive = xbmc_xpr([("background-main.png", xbmc_raw(0x12, bgw, bgh, bg_pix), False), ("icons\\crop.png", crop, True),
                    ("pal.png", pal_tex, False), ("dxt.png", dxt_tex, False)])
assert [e[0] for e in T.xbmc_xpr_entries(archive)] == ["background-main.png", "icons\\crop.png", "pal.png", "dxt.png"]
got = {n: (w, h, px) for n, w, h, px in T.iter_xbmc_xpr(archive)}
assert sorted(got) == ["background-main.png", "dxt.png", "icons\\crop.png", "pal.png"], sorted(got)
w, h, px = got["background-main.png"]
assert (w, h) == (640, 64) and px[:4] == bytes((10, 100, 20, 255)), px[:4]
w, h, px = got["icons\\crop.png"]
assert (w, h) == (3, 2) and px[4:8] == bytes((200, 0, 30, 255)), "packed entry, cropped to the real size"
w, h, px = got["pal.png"]
assert (w, h) == (8, 8) and px[4:8] == bytes((254, 0, 1, 255)), "paletted entry"
assert got["dxt.png"][2][:4] == bytes((255, 0, 0, 255)), "DXT entry"
only = list(T.iter_xbmc_xpr(archive, wanted=lambda n, u: n == "pal.png"))
assert [o[0] for o in only] == ["pal.png"]
for junk in (b"", b"XPR", b"XPR\xb2" + bytes(8), b"XPR0" + bytes(300), b"XPR\xb2" + struct.pack("<II", 99, 12 + 128 * 5000) + bytes(300)):
    assert list(T.iter_xbmc_xpr(junk)) == []
list(T.iter_xbmc_xpr(archive[:200])); list(T.iter_xbmc_xpr(archive[:5000]))  # truncated: never raises
broken = bytearray(archive)  # one corrupt entry is skipped, the others still decode
off = T.xbmc_xpr_entries(archive)[1][1]
broken[off + 3:off + 20] = b"\xff" * 17
assert "background-main.png" in [r[0] for r in T.iter_xbmc_xpr(bytes(broken))]

# ───────────────────────── XBTF (Kodi Textures.xbt) ─────────────────────────
def xbtf(files):
    head, data = b"", b""
    for path, frames in files:
        head += path.encode().ljust(256, b"\0") + struct.pack("<II", 0, len(frames))
        for w, h, fmt, payload in frames:
            head += struct.pack("<IIIQQIQ", w, h, fmt, len(payload), len(payload), 0, len(data))
            data += payload
    return b"XBTF2" + struct.pack("<I", len(files)) + head + data


xbt = xbtf([("backgrounds/bg.png", [(8, 8, 0x10001, BLK * 4)]), ("pic.png", [(2, 2, 16, bytes((1, 2, 3, 4)) * 4)])])
ent = {n: (w, h, px) for n, w, h, px in T.iter_xbt(xbt)}
assert ent["backgrounds/bg.png"][0] == 8 and ent["backgrounds/bg.png"][2][:4] == bytes((255, 0, 0, 255))
assert ent["pic.png"][2][:4] == bytes((3, 2, 1, 4))
assert list(T.iter_xbt(b"XBTF2" + bytes(3))) == [] and list(T.iter_xbt(xbt[:60])) == [] and list(T.iter_xbt(b"nope")) == []
assert list(T.iter_xbt(b"XBTF2" + struct.pack("<I", 999999) + bytes(40))) == []


# ───────────────────────── XPR0 ─────────────────────────
def xpr0(code, w, h, pixels, lin=False):
    size = ((w - 1) | ((h - 1) << 12) | ((w * 4 // 64 - 1) << 24)) if lin else 0
    fmt = 0x29 | (code << 8) | (1 << 16) | ((w.bit_length() - 1) << 20) | ((h.bit_length() - 1) << 24)
    head = struct.pack("<4sII", b"XPR0", 4096 + len(pixels), 4096) + struct.pack("<5I", 0x40001, 0, 0, fmt, size) + struct.pack("<I", 0xFFFFFFFF)
    return head.ljust(4096, b"\0") + pixels


tex = T.xpr0_textures(xpr0(T.F_LIN_A8R8G8B8, 32, 24, bytes((1, 2, 3, 255)) * 32 * 24, True))
assert len(tex) == 1 and tex[0][:2] == (32, 24) and tex[0][2][:4] == bytes((3, 2, 1, 255))
tex = T.xpr0_textures(xpr0(T.F_A4R4G4B4, 16, 16, swz(2, 16, 16, lambda x, y: (0xF0F0).to_bytes(2, "little"))))
assert tex[0][2][:4] == bytes((0, 255, 0, 255)), "swizzled A4R4G4B4 (the format of UnleashX font sheets)"
assert T.xpr0_textures(b"XPR0") == [] and T.xpr0_textures(bytes(100)) == [] and T.xpr0_textures(xpr0(T.F_A8, 8, 8, b"")) == []

# ───────────────────────── skins ─────────────────────────
with tempfile.TemporaryDirectory() as t:
    a = os.path.join(t, "arch")
    put(a, "skin.xml", XBMC_SKIN); put(a, "media/Textures.xpr", archive)
    t0 = time.time()
    r = X.read_xbox_skin(a)
    assert time.time() - t0 < 5
    assert r["background"] and r["background"].startswith("data:image/png;base64,"), r["errors"]
    assert "background-main.png" in r["images"] and len(r["images"]) == 1, list(r["images"])  # the tiny ones are dropped
    assert png_pixels(r["background"])[:2] == (640, 64) and png_pixels(r["background"])[2][:4] == bytes((10, 100, 20, 255))
    assert not [e for e in r["errors"] if "not shown" in e]
    put(a, "backgrounds/default.png", T.rgba_to_png(300, 4, bytes(300 * 16)))  # a wallpaper file wins over the archive
    r2 = X.read_xbox_skin(a)
    assert r2["background"] == r2["backgrounds"][0] and png_pixels(r2["background"])[:2] != (640, 64) and "background-main.png" in r2["images"]
    z = os.path.join(t, "arch.zip")
    with zipfile.ZipFile(z, "w") as f:
        f.writestr("Skin/skin.xml", XBMC_SKIN); f.writestr("Skin/media/Textures.xpr", archive)
    assert X.read_xbox_skin(z)["background"]
    put(a, "media/Textures.xbt", xbt)  # both archives side by side
    assert "pic.png" not in X.read_xbox_skin(a)["images"]  # 2x2 pictures are too small to keep
    for data in (b"XPR\xb2" + bytes(400), archive[:3000], b"XBTF2" + struct.pack("<I", 999999) + bytes(40), bytes(range(256)) * 20):
        put(a, "media/Textures.xpr", data)
        r = X.read_xbox_skin(a)
        assert r is not None and r["name"] == "Cool", data[:8]

    UX = b'<Skin name="Xp"><Main><Background>wall.xpr</Background><Text Font="f.xpr" /></Main></Skin>'
    u = os.path.join(t, "ux")
    put(u, "skin.xml", UX)
    put(u, "wall.xpr", xpr0(T.F_LIN_A8R8G8B8, 64, 48, bytes((9, 8, 7, 255)) * 64 * 48, True))
    r = X.read_xbox_skin(u)
    assert r["background"] and png_pixels(r["background"])[:2] == (64, 48), r["errors"]
    assert png_pixels(r["background"])[2][:4] == bytes((7, 8, 9, 255))
    put(u, "wall.xpr", b"XPR0" + bytes(50))
    assert X.read_xbox_skin(u)["background"] is None
assert X.READER_VERSION >= 2
print("xbox texture tests passed")
