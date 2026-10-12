"""Wii System Menu theme reader: LZ77 / ASH0 / Yaz0 / U8 / TPL decoders against synthetic data made here,
synthetic .mym and .csm files, and hostile input (bombs, path tricks, bad trees, broken parts)."""
import base64, heapq, io, os, random, struct, sys, tempfile, zipfile, zlib
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "py_modules"))
import wii_themes as W


def raises(fn, *a, **k):
    try:
        fn(*a, **k)
    except ValueError:
        return True
    except Exception as e:  # anything else is a bug: decoders must only raise ValueError
        raise AssertionError("expected ValueError, got %r" % e)
    return False


# ───────────────────────── encoders (the test's own, independent of the reader) ─────────────────────────
def lz77_enc(data, tag=True):
    out, i = bytearray(), 0
    toks = []
    while i < len(data):
        best = (0, 0)
        for d in range(1, min(i, 600) + 1):
            n = 0
            while n < 18 and i + n < len(data) and data[i + n - d] == data[i + n]:
                n += 1
            if n > best[0]:
                best = (n, d)
        if best[0] >= 3:
            toks.append(best); i += best[0]
        else:
            toks.append(data[i]); i += 1
    body = bytearray()
    for k in range(0, len(toks), 8):
        chunk = toks[k:k + 8]
        flag, blk = 0, bytearray()
        for j, t in enumerate(chunk):
            if isinstance(t, tuple):
                flag |= 0x80 >> j
                n, d = t
                blk += bytes(((n - 3) << 4 | (d - 1) >> 8, (d - 1) & 255))
            else:
                blk.append(t)
        body.append(flag); body += blk
    hdr = bytes((0x10, len(data) & 255, len(data) >> 8 & 255, len(data) >> 16 & 255))
    return (b"LZ77" if tag else b"") + hdr + bytes(body)


def yaz0_enc(data):
    out = bytearray(b"Yaz0" + struct.pack(">I", len(data)) + bytes(8))
    for k in range(0, len(data), 8):
        chunk = data[k:k + 8]
        out.append((0xFF << (8 - len(chunk))) & 0xFF)
        out += chunk
    return bytes(out)


def yaz0_enc_match(lit, n, dist):
    """Literal bytes then one back-reference (n >= 3), to exercise the copy path."""
    out = bytearray(b"Yaz0" + struct.pack(">I", len(lit) + n) + bytes(8))
    out.append(((1 << len(lit)) - 1) << (8 - len(lit)) & 0xFF)
    out += lit
    if n - 2 <= 15:
        out += bytes(((n - 2) << 4 | (dist - 1) >> 8, (dist - 1) & 255))
    else:
        out += bytes(((dist - 1) >> 8, (dist - 1) & 255, n - 0x12))
    return bytes(out)


def huff(freq):
    heap = [(f, i, s) for i, (s, f) in enumerate(sorted(freq.items()))]
    heapq.heapify(heap)
    nxt = len(heap)
    if len(heap) == 1:
        return heap[0][2]  # a single leaf
    while len(heap) > 1:
        a, b = heapq.heappop(heap), heapq.heappop(heap)
        heapq.heappush(heap, (a[0] + b[0], nxt, (a[2], b[2]))); nxt += 1
    return heap[0][2]


def codes(tree, pre=""):
    if not isinstance(tree, tuple):
        return {tree: pre}
    out = codes(tree[0], pre + "0")
    out.update(codes(tree[1], pre + "1"))
    return out


def tree_bits(tree, width):
    if isinstance(tree, tuple):
        return "1" + tree_bits(tree[0], width) + tree_bits(tree[1], width)
    return "0" + format(tree, "0%db" % width)


def words(bits):
    bits += "0" * (-len(bits) % 32)
    return b"".join(struct.pack(">I", int(bits[i:i + 32], 2)) for i in range(0, len(bits), 32))


def ash0_enc(data):
    toks, i = [], 0
    while i < len(data):
        best = (0, 0)
        for d in range(1, min(i, 600) + 1):
            n = 0
            while n < 258 and i + n < len(data) and i + n - d >= 0 and data[i + n - d] == data[i + n]:
                n += 1
            if n > best[0]:
                best = (n, d)
        if best[0] >= 3:
            toks.append(best); i += best[0]
        else:
            toks.append(data[i]); i += 1
    sf, df = {}, {}
    for t in toks:
        s = 0x100 + t[0] - 3 if isinstance(t, tuple) else t
        sf[s] = sf.get(s, 0) + 1
        if isinstance(t, tuple):
            df[t[1] - 1] = df.get(t[1] - 1, 0) + 1
    st, dt = huff(sf), (huff(df) if df else 0)
    sc, dc = codes(st), codes(dt) if df else {}
    b1, b2 = tree_bits(st, 9), tree_bits(dt, 11)
    for t in toks:
        if isinstance(t, tuple):
            b1 += sc[0x100 + t[0] - 3]; b2 += dc[t[1] - 1]
        else:
            b1 += sc[t]
    w1, w2 = words(b1), words(b2)
    return b"ASH0" + struct.pack(">II", 0x30000000 | len(data), 12 + len(w1)) + w1 + w2


def u8_enc(tree):
    """tree: {name: bytes | dict}. Names are written as given (so tests can plant '..')."""
    nodes, names = [], bytearray(b"\0")
    blobs = []

    def walk(d, parent):
        for name, v in d.items():
            off = len(names); names.extend(name.encode() + b"\0")
            if isinstance(v, dict):
                idx = len(nodes) + 1
                nodes.append([1, off, parent, None])
                walk(v, idx)
                nodes[idx - 1][3] = len(nodes) + 1
            else:
                nodes.append([0, off, None, v])
    walk(tree, 0)
    total = len(nodes) + 1
    root = 0x20
    hsize = total * 12 + len(names)
    data_off = (root + hsize + 0x3F) & ~0x3F
    out_nodes = [struct.pack(">III", 1 << 24, 0, total)]
    blob = bytearray()
    for t, off, a, b in nodes:
        if t == 1:
            out_nodes.append(struct.pack(">I", 1 << 24 | off) + struct.pack(">II", a, b))
        else:
            pos = data_off + len(blob)
            blob += b + bytes(-len(b) % 32)
            out_nodes.append(struct.pack(">I", off) + struct.pack(">II", pos, len(b)))
    head = b"U\xaa8-" + struct.pack(">III", root, hsize, data_off) + bytes(16)
    body = b"".join(out_nodes) + bytes(names)
    return head + body + bytes(data_off - (root + len(body))) + bytes(blob)


def rgb5a3(r, g, b, a=255):
    if a == 255:
        return 0x8000 | (r >> 3) << 10 | (g >> 3) << 5 | b >> 3
    return (a >> 5) << 12 | (r >> 4) << 8 | (g >> 4) << 4 | b >> 4


def tpl_file(w, h, fmt, data, palette=None):
    """One-image TPL; palette = (format, [u16 entries]) for C4/C8/C14X2."""
    pal_hdr_off = 0x14 if palette else 0
    img_off = 0x20
    pal_data = b""
    if palette:
        pal_data = struct.pack(">%dH" % len(palette[1]), *palette[1])
    pal_off = img_off + 0x24
    data_off = pal_off + len(pal_data)
    out = struct.pack(">IIII", 0x0020AF30, 1, 12, 0)[:12]
    out += struct.pack(">II", img_off, pal_hdr_off)
    if palette:
        out += struct.pack(">HBBII", len(palette[1]), 0, 0, palette[0], pal_off)
    out += bytes(img_off - len(out))
    out += struct.pack(">HHII", h, w, fmt, data_off) + bytes(0x24 - 12)
    return out + pal_data + data


BLOCK = {0: (8, 8), 1: (8, 4), 2: (8, 4), 3: (4, 4), 4: (4, 4), 5: (4, 4), 8: (8, 8), 9: (8, 4), 10: (4, 4)}


def layout(w, h, fmt, val, pack):
    """Blocks in order, rows inside; val(x, y) is the raw texel (0 outside the picture); pack(list) -> bytes of one block."""
    bw, bh = BLOCK[fmt]
    out = bytearray()
    for by in range(0, -(-h // bh) * bh, bh):
        for bx in range(0, -(-w // bw) * bw, bw):
            out += pack([val(bx + x, by + y) if bx + x < w and by + y < h else 0 for y in range(bh) for x in range(bw)])
    return bytes(out)


def nib(v):
    return bytes(v[i] << 4 | v[i + 1] for i in range(0, len(v), 2))


def u16s(v):
    return struct.pack(">%dH" % len(v), *v)


def png_decode(png):
    assert png[:8] == b"\x89PNG\r\n\x1a\n"
    pos, idat, hdr = 8, b"", None
    while pos < len(png):
        n = struct.unpack_from(">I", png, pos)[0]
        tag, body = png[pos + 4:pos + 8], png[pos + 8:pos + 8 + n]
        assert zlib.crc32(tag + body) & 0xFFFFFFFF == struct.unpack_from(">I", png, pos + 8 + n)[0]
        if tag == b"IHDR":
            hdr = struct.unpack(">IIBB", body[:10])
        elif tag == b"IDAT":
            idat += body
        pos += 12 + n
    w, h, depth, ctype = hdr
    bpp = {2: 3, 6: 4}[ctype]
    raw = zlib.decompress(idat)
    rows = [raw[y * (w * bpp + 1) + 1:(y + 1) * (w * bpp + 1)] for y in range(h)]
    assert all(raw[y * (w * bpp + 1)] == 0 for y in range(h))
    px = b"".join(rows)
    if bpp == 3:
        px = b"".join(px[i:i + 3] + b"\xff" for i in range(0, len(px), 3))
    return w, h, px


def data_png(url):
    assert url.startswith("data:image/png;base64,")
    return png_decode(base64.b64decode(url.split(",", 1)[1]))


# ───────────────────────── compression ─────────────────────────
rnd = random.Random(7)
sample = bytes(rnd.choice(b"abcde") for _ in range(900)) + b"x" * 300 + bytes(range(256)) * 3 + b"abcabcabcabc" * 40
for data in (b"", b"a", b"abc", b"a" * 500, sample):
    if data:
        assert W.lz77(lz77_enc(data, tag=False)) == data
        assert W.unwrap(lz77_enc(data)) == data  # "LZ77" tag
        assert W.ash0(ash0_enc(data)) == data, len(data)
        assert W.yaz0(yaz0_enc(data)) == data
assert W.yaz0(yaz0_enc_match(b"ab", 20, 2)) == b"ab" * 11 and W.yaz0(yaz0_enc_match(b"abc", 40, 3)) == b"abc" * 14 + b"a"

# bad / hostile compressed data: ValueError only, never a hang, a crash or a huge allocation
assert raises(W.lz77, b"\x11\x01\x00\x00a")
assert raises(W.lz77, b"\x10\xff\xff\xff" + b"\x00")                      # promises 16 MB, has nothing (and is capped below)
assert raises(W.lz77, b"\x10\x05\x00\x00\x80\x00\x00")                    # match before the start
assert raises(W.lz77, lz77_enc(sample, tag=False)[:-5])                   # cut off
assert raises(W.lz77, b"\x10\x00\x00\x00\xff\xff\xff\xff", )              # 32-bit size form, cut off
assert raises(W.lz77, b"\x10\x00\x00\x00\xff\xff\xff\x7f" + bytes(20))    # 2 GB claimed
assert raises(W.ash0, ash0_enc(sample), max_out=1000)                      # output cap
assert W.ash0(b"ASH0" + struct.pack(">II", 0x30000010, 16) + bytes(8)) == bytes(16)  # single-leaf trees: no bits used, no loop
assert raises(W.lz77, lz77_enc(sample, tag=False), max_out=1000)
assert raises(W.ash0, b"ASH0" + struct.pack(">II", 0x30000010, 99) + bytes(16))  # second stream outside
assert raises(W.ash0, b"ASH0" + struct.pack(">II", 0x30000010, 14) + bytes(16))   # second stream not on a word
assert raises(W.ash0, ash0_enc(sample)[:100])
assert raises(W.ash0, b"ASH0" + struct.pack(">II", 0x30000010, 12 + 4 * 2000) + b"\xff" * (4 * 2000) + b"\xff" * 64)  # tree that never ends: no recursion error
deep = b"ASH0" + struct.pack(">II", 0x30000010, 12 + 4 * 50000) + b"\xff" * (4 * 50000) + b"\xff" * 64
assert raises(W.ash0, deep)
assert raises(W.yaz0, b"Yaz0" + struct.pack(">I", 1 << 30) + bytes(8))
assert raises(W.yaz0, b"Yaz0" + struct.pack(">I", 10) + bytes(8) + b"\x00\x20\x00")  # copy before the start
assert raises(W.unwrap, b"LZ77" * 2)  # layers that are not valid streams
assert W.unwrap(b"hello") == b"hello"

# ───────────────────────── U8 ─────────────────────────
tree = {"layout": {"common": {"board.ash": b"BOARD", "x": {"deep.bin": b"D" * 70}}, "other.txt": b"O"}, "top.bin": b"T"}
files = W.u8(u8_enc(tree))
assert files == {"layout/common/board.ash": b"BOARD", "layout/common/x/deep.bin": b"D" * 70, "layout/other.txt": b"O", "top.bin": b"T"}, files
# names that leave their folder are dropped, with everything below them
evil = {"..": {"pwn.txt": b"1"}, "a": {"..": b"2", "ok.txt": b"3"}, "b/c": b"4", "ok": b"5", "": b"6", "back\\slash": b"7"}
assert W.u8(u8_enc(evil)) == {"a/ok.txt": b"3", "ok": b"5"}
assert raises(W.u8, b"not u8" * 20)
raw = bytearray(u8_enc(tree))
struct.pack_into(">I", raw, 0x20 + 8, 0x7FFFFFFF)  # node count far too big
assert raises(W.u8, bytes(raw))
raw = bytearray(u8_enc({"f": b"data"}))
struct.pack_into(">II", raw, 0x20 + 12 + 4, 0x10, 0x7FFFFFF0)  # file points outside the data: dropped, not a crash
assert W.u8(bytes(raw)) == {}
raw = bytearray(u8_enc({"f": b"data"}))
raw[0x20 + 12 + 1:0x20 + 12 + 4] = b"\xff\xff\xff"  # name offset outside the string table
assert W.u8(bytes(raw)) == {}
assert raises(W.u8, W.U8_MAGIC + struct.pack(">III", 0x20, 0x100000, 0x40) + bytes(40))
# a directory chain deeper than the cap
chain = {}
cur = chain
for i in range(80):
    cur["d"] = {}
    cur = cur["d"]
cur["f"] = b"x"
assert raises(W.u8, u8_enc(chain))
# directories whose end index points backwards or past the node table cannot loop
raw = bytearray(u8_enc({"d": {"f": b"1"}, "g": b"2"}))
struct.pack_into(">I", raw, 0x20 + 12 + 8, 0)
W.u8(bytes(raw))
assert raises(W.u8, u8_enc({"a": b"1" * 100}), max_total=50)

# ───────────────────────── TPL: every format ─────────────────────────
def rnd_val(bits):
    r = random.Random(bits)
    return lambda x, y: r.randrange(1 << bits)


def expect_rgba(fmt, w, h, rgb_of):
    return b"".join(bytes(rgb_of(x, y)) for y in range(h) for x in range(w))


def check(name, w, h, fmt, data, expected, palette=None):
    got = W.tpl_decode(tpl_file(w, h, fmt, data, palette))
    assert got[0] == w and got[1] == h, name
    assert got[2] == expected, "%s: pixels differ" % name
    png, pw, ph, rgba = W.tpl_to_png(tpl_file(w, h, fmt, data, palette))
    assert png_decode(png) == (w, h, rgba) and rgba == expected, name


W_, H_ = 19, 11  # not a multiple of any block size: padding must be cut off
for fmt in (0, 1, 2, 3, 4, 5, 8, 9, 10):
    bw, bh = BLOCK[fmt]
    vals = {}
    r = random.Random(fmt)
    maxv = {0: 16, 1: 256, 2: 256, 3: 65536, 4: 65536, 5: 65536, 8: 16, 9: 256, 10: 16384}[fmt]
    for y in range(H_):
        for x in range(W_):
            vals[x, y] = r.randrange(maxv)
    val = lambda x, y: vals.get((x, y), 0)
    pal16 = None
    if fmt in (8, 9, 10):
        n = {8: 16, 9: 256, 10: 16384}[fmt]
        for pfmt in (0, 1, 2):
            pr = random.Random(100 + pfmt)
            pv = [pr.randrange(65536) for _ in range(n)]
            def pcol(v, pfmt=pfmt):
                if pfmt == 0:
                    return (v & 255, v & 255, v & 255, v >> 8)
                if pfmt == 1:
                    return ((v >> 11) * 255 // 31, (v >> 5 & 63) * 255 // 63, (v & 31) * 255 // 31, 255)
                if v & 0x8000:
                    return ((v >> 10 & 31) * 255 // 31, (v >> 5 & 31) * 255 // 31, (v & 31) * 255 // 31, 255)
                return ((v >> 8 & 15) * 17, (v >> 4 & 15) * 17, (v & 15) * 17, (v >> 12 & 7) * 255 // 7)
            pack = {8: nib, 9: bytes, 10: u16s}[fmt]
            data = layout(W_, H_, fmt, val, pack)
            check("fmt %d palette %d" % (fmt, pfmt), W_, H_, fmt, data, expect_rgba(fmt, W_, H_, lambda x, y: pcol(pv[vals[x, y]])), (pfmt, pv))
        continue
    if fmt == 0:
        pack, rgb = nib, lambda v: (v * 17,) * 4
    elif fmt == 1:
        pack, rgb = bytes, lambda v: (v,) * 4
    elif fmt == 2:
        pack, rgb = bytes, lambda v: ((v & 15) * 17,) * 3 + ((v >> 4) * 17,)
    elif fmt == 3:
        pack = lambda v: b"".join(bytes((x >> 8, x & 255)) for x in v)
        rgb = lambda v: (v & 255,) * 3 + (v >> 8,)
    elif fmt == 4:
        pack, rgb = u16s, lambda v: ((v >> 11) * 255 // 31, (v >> 5 & 63) * 255 // 63, (v & 31) * 255 // 31, 255)
    else:
        pack = u16s
        rgb = lambda v: ((v >> 10 & 31) * 255 // 31, (v >> 5 & 31) * 255 // 31, (v & 31) * 255 // 31, 255) if v & 0x8000 else ((v >> 8 & 15) * 17, (v >> 4 & 15) * 17, (v & 15) * 17, (v >> 12 & 7) * 255 // 7)
    check("fmt %d" % fmt, W_, H_, fmt, layout(W_, H_, fmt, val, pack), expect_rgba(fmt, W_, H_, lambda x, y: rgb(vals[x, y])))

# RGBA32: a block holds 16 (A,R) pairs and then 16 (G,B) pairs
r = random.Random(32)
px = {(x, y): tuple(r.randrange(256) for _ in range(4)) for y in range(H_) for x in range(W_)}  # r, g, b, a
data = bytearray()
for by in range(0, 12, 4):
    for bx in range(0, 20, 4):
        blk = [px.get((bx + x, by + y), (0, 0, 0, 0)) for y in range(4) for x in range(4)]
        data += b"".join(bytes((p[3], p[0])) for p in blk) + b"".join(bytes((p[1], p[2])) for p in blk)
check("fmt 6", W_, H_, 6, bytes(data), expect_rgba(6, W_, H_, lambda x, y: px[x, y]))

# CMPR: 8x8 blocks of four 4x4 sub-blocks (left to right, top to bottom); both the 4-colour and the 3-colour + transparent modes
def c565(v):
    return ((v >> 11) * 255 // 31, (v >> 5 & 63) * 255 // 63, (v & 31) * 255 // 31)


def cmpr_expect(c0, c1, idx):
    a, b = c565(c0), c565(c1)
    if c0 > c1:
        cols = [a + (255,), b + (255,), tuple((2 * a[i] + b[i]) // 3 for i in range(3)) + (255,), tuple((a[i] + 2 * b[i]) // 3 for i in range(3)) + (255,)]
    else:
        cols = [a + (255,), b + (255,), tuple((a[i] + b[i]) // 2 for i in range(3)) + (255,), (0, 0, 0, 0)]
    return [cols[i] for i in idx]


r = random.Random(14)
cw, ch = 24, 16
cpx = {}
data = bytearray()
for by in range(0, ch, 8):
    for bx in range(0, cw, 8):
        for k, (sx, sy) in enumerate(((0, 0), (4, 0), (0, 4), (4, 4))):
            c0, c1 = r.randrange(65536), r.randrange(65536)
            if (bx // 8 + by // 8) % 2:
                c0, c1 = min(c0, c1), max(c0, c1)  # c0 <= c1: 3 colours + transparent
            idx = [r.randrange(4) for _ in range(16)]
            data += struct.pack(">HH", c0, c1) + bytes(idx[i] << 6 | idx[i + 1] << 4 | idx[i + 2] << 2 | idx[i + 3] for i in range(0, 16, 4))
            for j, col in enumerate(cmpr_expect(c0, c1, idx)):
                cpx[bx + sx + j % 4, by + sy + j // 4] = col
check("fmt 14", cw, ch, 14, bytes(data), expect_rgba(14, cw, ch, lambda x, y: cpx[x, y]))
# cropped CMPR (not a multiple of 8)
got = W.tpl_decode(tpl_file(21, 13, 14, bytes(data) + bytes(8 * 4 * 4 * 3)))
assert got[0] == 21 and got[1] == 13 and len(got[2]) == 21 * 13 * 4

# TPL errors
good = tpl_file(8, 8, 1, bytes(64))
assert raises(W.tpl_decode, b"nope" * 8)
assert raises(W.tpl_decode, good[:-5])                                     # pixel data cut off
assert raises(W.tpl_decode, good, 3)                                       # no such image
assert raises(W.tpl_decode, tpl_file(8, 8, 7, bytes(64)))                  # format 7 is not a texture format we know
assert raises(W.tpl_decode, tpl_file(60000, 60000, 1, bytes(64)))          # picture too large for the cap
assert raises(W.tpl_decode, tpl_file(8, 8, 9, bytes(64)))                  # palette format without a palette
assert raises(W.tpl_decode, tpl_file(8, 8, 9, bytes(64), (7, [0] * 256)))  # unknown palette format
bad = bytearray(good); struct.pack_into(">II", bad, 4, 99999, 12)
assert raises(W.tpl_decode, bytes(bad))
assert W.tpl_info(good) == (8, 8, 1)
# a palette entry past the end of the palette is transparent black, never an error
pal_img = tpl_file(8, 4, 9, bytes([200]) * 32, (2, [0x8000 | 31] * 4))
assert W.tpl_decode(pal_img)[2] == bytes(8 * 4 * 4)

# ───────────────────────── theme files ─────────────────────────
def gradient_tpl(w, h, top, bottom):
    vals = {}
    for y in range(h):
        t = y / max(1, h - 1)
        c = tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3))
        for x in range(w):
            vals[x, y] = rgb5a3(*c)
    return tpl_file(w, h, 5, layout(w, h, 5, lambda x, y: vals.get((x, y), 0), u16s)), vals


def picture_tpl(w, h, seed):
    r = random.Random(seed)
    vals = {(x, y): rgb5a3(r.randrange(256), r.randrange(256), r.randrange(256)) for y in range(h) for x in range(w)}
    return tpl_file(w, h, 5, layout(w, h, 5, lambda x, y: vals.get((x, y), 0), u16s)), vals


def decoded_5a3(vals, w, h):
    return b"".join(W._c5a3(vals[x, y]) for y in range(h) for x in range(w))


wall_tpl, wall_vals = picture_tpl(48, 36, 1)
cur_tpls = {l: picture_tpl(16, 16, 10 + i) for i, l in enumerate("abc")}
board_u8 = u8_enc({"arc": {"timg": {"my_BackPic_a.tpl": wall_tpl, "other.tpl": picture_tpl(8, 8, 3)[0]}, "blyt": {"x.brlyt": b"RLYT"}}})
cursor_u8 = u8_enc({"arc": {"timg": {"defcursor_final64_%s.tpl" % l: cur_tpls[l][0] for l in "abc"}}})
INI = "[sdta1]\r\nfile=\\layout\\common\\board.ash\r\nsource=\\ash\\board.ash\r\n\r\n[sdta2]\r\nfile=\\layout\\common\\cursor.ash\r\nsource=\\ash\\cursor.ash\r\n"


def make_zip(path, entries):
    with zipfile.ZipFile(path, "w") as z:
        for k, v in entries.items():
            z.writestr(k, v)


with tempfile.TemporaryDirectory() as t:
    p = os.path.join(t, "My_Theme.mym")
    make_zip(p, {"mym.ini": INI, "ID.txt": "TEST01", "ash/board.ash": ash0_enc(board_u8), "ash/cursor.ash": lz77_enc(cursor_u8)})
    assert W.peek(p) == "mym"
    r = W.read_wii_theme(p)
    assert r["kind"] == "mym" and r["name"] == "My Theme" and r["id"] == "TEST01" and r["errors"] == [], r["errors"]
    w, h, px = data_png(r["wallpaper"])
    assert (w, h) == (48, 36) and px == decoded_5a3(wall_vals, 48, 36) and r["wallpaperSize"] == [48, 36] and r["wallpaperFit"] == "cover" and not r["stockWallpaper"]
    assert sorted(r["cursors"]) == ["a", "b", "c"] and r["cursorSize"] == 16
    for l in "abc":
        assert data_png(r["cursors"][l]) == (16, 16, decoded_5a3(cur_tpls[l][1], 16, 16))

    # the same theme with other wrappers and names: Yaz0, plain U8, backslash zip names, board2.ash (Korean menu), mixed case
    p2 = os.path.join(t, "wrapped.mym")
    make_zip(p2, {"MYM.INI": INI.replace("board.ash", "board2.ash").replace("ash\\board2.ash", "ASH\\Board2.ASH"), "ASH\\Board2.ASH": yaz0_enc(board_u8), "ash\\cursor.ash": cursor_u8})
    r = W.read_wii_theme(p2)
    assert r["wallpaper"] and sorted(r["cursors"]) == ["a", "b", "c"] and r["errors"] == [], r

    # loose pictures: a picture in the board archive's folder wins over board.ash; another archive's my_BackPic_a is not a wallpaper
    loose, lvals = picture_tpl(24, 20, 99)
    p3 = os.path.join(t, "loose.mym")
    make_zip(p3, {"mym.ini": INI, "ash/board.ash": ash0_enc(board_u8), "layout/common/board_ash_out/arc/timg/my_BackPic_a.tpl": loose,
                  "layout/common/diskbann_ash_out/arc/timg/my_BackPic_a.tpl": picture_tpl(30, 30, 5)[0]})
    r = W.read_wii_theme(p3)
    assert data_png(r["wallpaper"])[:2] == (24, 20)
    p4 = os.path.join(t, "otherarchive.mym")
    make_zip(p4, {"mym.ini": "", "layout/common/diskbann_ash_out/arc/timg/my_BackPic_a.tpl": picture_tpl(30, 30, 5)[0], "x.ash": b"junk"})
    r = W.read_wii_theme(p4)
    assert r["wallpaper"] is None and r["cursors"] == {} and r["errors"] == []

    # loose png and jpeg through mym.ini targets; transparent pointer png is kept, a pointer jpeg is not
    png = W.png_encode(4, 3, bytes(range(48)))
    ini5 = "[sdta1]\nfile=\\layout\\common\\board_ash_out\\arc\\timg\\my_BackPic_a.tpl\nsource=\\Backgrounds\\wall.png\n[sdta2]\nfile=\\layout\\common\\cursor_ash_out\\arc\\timg\\defcursor_final64_a.tpl\nsource=\\pics\\hand.png\n"
    jpg = b"\xff\xd8\xff\xe0\x00\x10JFIF\x00\x01\x01\x00\x00\x01\x00\x01\x00\x00\xff\xc0\x00\x11\x08\x01\x40\x02\x80\x03\x01\x22\x00\x02\x11\x01\x03\x11\x01\xff\xd9"
    p5 = os.path.join(t, "png.mym")
    make_zip(p5, {"mym.ini": ini5, "Backgrounds/wall.png": png, "pics/hand.png": png, "cursor/defcursor_final64_b.jpg": jpg})
    r = W.read_wii_theme(p5)
    assert data_png(r["wallpaper"]) == (4, 3, bytes(range(48))) and r["wallpaperSize"] == [4, 3]
    assert list(r["cursors"]) == ["a"] and r["errors"] == [], r
    p6 = os.path.join(t, "jpg.mym")
    make_zip(p6, {"mym.ini": "", "board/my_BackPic_a.jpg": jpg})
    r = W.read_wii_theme(p6)
    assert r["wallpaperSize"] == [640, 320] and r["wallpaper"].startswith("data:image/jpeg;base64,"), r

    # a thin gradient is a real wallpaper when it is not the stock one (dark themes ship an all-black strip), and is stretched
    dark, _ = gradient_tpl(8, 456, (0, 0, 0), (0, 0, 0))
    p7 = os.path.join(t, "dark.mym")
    make_zip(p7, {"mym.ini": INI, "ash/board.ash": ash0_enc(u8_enc({"arc": {"timg": {"my_BackPic_a.tpl": dark}}}))})
    r = W.read_wii_theme(p7)
    assert r["wallpaperSize"] == [8, 456] and r["wallpaperFit"] == "stretch" and not r["stockWallpaper"], r

    # no board.ash at all: fine, no wallpaper, the cursors still load; a broken board.ash is reported and does not stop the cursors
    p8 = os.path.join(t, "nob.mym")
    make_zip(p8, {"mym.ini": INI, "ash/cursor.ash": lz77_enc(cursor_u8)})
    r = W.read_wii_theme(p8)
    assert r["wallpaper"] is None and len(r["cursors"]) == 3 and r["errors"] == []
    p9 = os.path.join(t, "broken.mym")
    make_zip(p9, {"mym.ini": INI, "ash/board.ash": ash0_enc(board_u8)[:90], "ash/cursor.ash": lz77_enc(cursor_u8)})
    r = W.read_wii_theme(p9)
    assert r["wallpaper"] is None and len(r["cursors"]) == 3 and r["errors"] and "board.ash" in r["errors"][0], r["errors"]
    # one broken pointer picture does not lose the others
    bad_cur = u8_enc({"arc": {"timg": {"defcursor_final64_a.tpl": b"garbage", "defcursor_final64_b.tpl": cur_tpls["b"][0]}}})
    p10 = os.path.join(t, "badcur.mym")
    make_zip(p10, {"mym.ini": INI, "ash/cursor.ash": lz77_enc(bad_cur)})
    r = W.read_wii_theme(p10)
    assert list(r["cursors"]) == ["b"] and any("defcursor_final64_a" in e for e in r["errors"])
    # a broken picture inside an otherwise good board.ash
    badw = u8_enc({"arc": {"timg": {"my_BackPic_a.tpl": wall_tpl[:60]}}})
    p11 = os.path.join(t, "badwall.mym")
    make_zip(p11, {"mym.ini": INI, "ash/board.ash": lz77_enc(badw), "ash/cursor.ash": lz77_enc(cursor_u8)})
    r = W.read_wii_theme(p11)
    assert r["wallpaper"] is None and len(r["cursors"]) == 3 and any(e.startswith("wallpaper") for e in r["errors"])

    # members that are too large are refused, not read
    old = W.MAX_MEMBER
    W.MAX_MEMBER = 100
    try:
        r = W.read_wii_theme(p)
        assert r["wallpaper"] is None and r["errors"]
    finally:
        W.MAX_MEMBER = old

    # zip path tricks never matter (nothing is extracted) and are ignored
    p12 = os.path.join(t, "trick.mym")
    make_zip(p12, {"mym.ini": INI, "../../board/my_BackPic_a.png": png, "/abs/board/my_BackPic_a.png": png, "ash/board.ash": ash0_enc(board_u8)})
    r = W.read_wii_theme(p12)
    assert data_png(r["wallpaper"])[:2] == (48, 36)

    # .csm: a raw U8 of the whole menu; the stock 8x456 gradient is recognised and is not a wallpaper
    # make it a symmetric gradient: light at the middle, as the real one is (top and bottom darker)
    vals = {}
    for y in range(456):
        t_ = 1 - abs(y - 227.5) / 227.5
        c = tuple(round(W.STOCK_TOP[i] + (W.STOCK_MID[i] - W.STOCK_TOP[i]) * t_) for i in range(3))
        for x in range(8):
            vals[x, y] = rgb5a3(*c)
    stock = tpl_file(8, 456, 5, layout(8, 456, 5, lambda x, y: vals[x, y], u16s))
    csm_stock = u8_enc({"layout": {"common": {"board.ash": ash0_enc(u8_enc({"arc": {"timg": {"my_BackPic_a.tpl": stock}}})), "cursor.ash": lz77_enc(cursor_u8)}}, "font": {"font.ash": b"x"}})
    c1 = os.path.join(t, "Stock Menu.csm")
    open(c1, "wb").write(csm_stock)
    assert W.peek(c1) == "csm"
    r = W.read_wii_theme(c1)
    assert r["kind"] == "csm" and r["name"] == "Stock Menu" and r["stockWallpaper"] and r["wallpaper"] is None and len(r["cursors"]) == 3 and r["errors"] == [], r
    csm_custom = u8_enc({"layout": {"common": {"board.ash": ash0_enc(board_u8), "cursor.ash": cursor_u8}}})
    c2 = os.path.join(t, "custom.csm")
    open(c2, "wb").write(csm_custom)
    r = W.read_wii_theme(c2)
    assert data_png(r["wallpaper"])[:2] == (48, 36) and len(r["cursors"]) == 3 and not r["stockWallpaper"]
    c3 = os.path.join(t, "wrapped.csm")  # the whole menu LZ77-wrapped
    open(c3, "wb").write(lz77_enc(csm_custom))
    assert W.read_wii_theme(c3)["wallpaper"]

    # not Wii themes: None, never an exception
    junk = os.path.join(t, "junk.mym"); open(junk, "wb").write(b"not a zip at all")
    emptyz = os.path.join(t, "empty.mym"); make_zip(emptyz, {})
    plainz = os.path.join(t, "plain.zip"); make_zip(plainz, {"readme.txt": "hi"})
    shortu = os.path.join(t, "short.csm"); open(shortu, "wb").write(W.U8_MAGIC + b"\0" * 8)
    badlz = os.path.join(t, "badlz.csm"); open(badlz, "wb").write(b"LZ77\x10\xff\xff\xff")
    for bad in (junk, emptyz, plainz, shortu, badlz, os.path.join(t, "missing.mym"), t):
        assert W.read_wii_theme(bad) is None, bad
    assert W.peek(junk) is None and W.peek(plainz) is None and W.peek(os.path.join(t, "missing")) is None and W.peek(t) is None
    # an empty zip or a zip without Wii content still reads as "nothing here" if forced through
    assert W.peek(emptyz) is None

print("wii theme tests passed")
