"""PSP theme fonts: .pgf (the PSP's own bitmap font format) → TrueType.

read_pgf() decodes the glyph bitmaps (4-bit anti-aliased) and metrics (26.6 fixed point);
build_ttf() traces every glyph at its 50 % coverage line into smooth outlines, so the
theme's font works as a normal web font at any size."""
import struct

_HDR = struct.Struct("<HH4siiiiii2sB1siiii1s64s64s1sHH26siiiiiiiiiiHH2sBBBB102siif8s8s")


def _bits_reader(buf):
    n = len(buf) // 4
    words = struct.unpack("<%dI" % n, buf[:n * 4]) + (0, 0)

    def get(nbits, pos):
        wp, off = pos >> 5, pos & 31
        v = words[wp] >> off
        if off + nbits > 32:
            v |= words[wp + 1] << (32 - off)
        return v & ((1 << nbits) - 1)
    return get


def _table(buf, off, bpe, count):
    size = ((count * bpe + 31) & ~31) // 8
    get = _bits_reader(buf[off:off + size + 8])
    return [get(bpe, i * bpe) for i in range(count)], off + size


def read_pgf(d, chars=None):
    if len(d) < _HDR.size or d[4:8] != b"PGF0":
        return None
    h = _HDR.unpack_from(d, 0)
    (hoff, hsize, magic, rev, ver, cm_len, cp_len, cm_bpe, cp_bpe, _p1, bpp, _p2, hs, vs, hr, vr, _p3, name, ftype, _p4,
     first, last, _p5, max_asc, max_desc, max_lx, max_by, min_cx, max_ty, adv0, adv1, size0, size1, mgw, mgh, _p6,
     dim_len, xa_len, ya_len, adv_len, _p7, sh_len, sh_bpe, _unk, _sscale, _p8) = h
    if not (0 < cp_len <= 0x100000 and 0 <= cm_len <= 0x100000 and 0 < cm_bpe <= 32 and 0 < cp_bpe <= 32):
        return None
    p = _HDR.size
    c1 = c2 = 0
    if rev == 3:
        _b1, c1, _b2, c2, _u = struct.unpack_from("<iiiiI", d, p)
        c1 &= 0xFFFF
        c2 &= 0xFFFF
        p += 20

    def pairs(n):
        nonlocal p
        a = struct.unpack_from("<%dI" % (2 * n), d, p) if n else ()
        p += 8 * n
        return a[0::2], a[1::2]

    dim = pairs(dim_len)
    xadj = pairs(xa_len)
    yadj = pairs(ya_len)
    advt = pairs(adv_len)
    _shadow, p = _table(d, p, sh_bpe, sh_len) if sh_len and sh_bpe else ([], p)
    if rev == 3:
        p += (c1 + c2) * 4
    charmap, p = _table(d, p, cm_bpe, cm_len)
    charptr, p = _table(d, p, cp_bpe, cp_len)
    font = d[p:]
    get = _bits_reader(font)
    nbits = len(font) * 8
    s32 = lambda v: v - (1 << 32) if v >= 1 << 31 else v

    def glyph(gi):
        pos = charptr[gi] * 32
        if pos + 200 > nbits:
            return None
        pos += 14
        w = get(7, pos); h_ = get(7, pos + 7); left = get(7, pos + 14); top = get(7, pos + 21)
        pos += 28
        left = left - 128 if left >= 64 else left
        top = top - 128 if top >= 64 else top
        flags = get(6, pos); pos += 6 + 2 + 2 + 3 + 9
        m = {}
        for bit, key, tab in ((4, "dim", dim), (8, "xadj", xadj), (16, "yadj", yadj), (32, "adv", advt)):
            if flags & bit:
                i = get(8, pos); pos += 8
                m[key] = (tab[0][i], tab[1][i]) if i < len(tab[0]) else (0, 0)
            else:
                m[key] = (s32(get(32, pos)), s32(get(32, pos + 32))); pos += 64
        px = bytearray(w * h_)
        k = 0
        while k < w * h_ and pos + 8 < nbits:
            nb = get(4, pos); pos += 4
            if nb < 8:
                v = get(4, pos); pos += 4
                for _ in range(nb + 1):
                    if k < len(px):
                        px[k] = v; k += 1
            else:
                for _ in range(16 - nb):
                    if k < len(px):
                        px[k] = get(4, pos); k += 1
                    pos += 4
        if (flags & 3) == 2:  # stored column by column
            t = bytearray(w * h_)
            for x in range(w):
                for y in range(h_):
                    t[y * w + x] = px[x * h_ + y]
            px = t
        return {"w": w, "h": h_, "left": left, "top": top, "adv": m["adv"][0] / 64.0, "px": bytes(px)}

    out = {}
    for code in (chars if chars is not None else range(first, min(last, first + cm_len - 1) + 1)):
        i = code - first
        if not (0 <= i < len(charmap)):
            continue
        gi = charmap[i]
        if gi >= len(charptr):
            continue
        g = glyph(gi)
        if g:
            out[code] = g
    return {"name": name.split(b"\0")[0].decode("latin1"), "size": (hs / 64.0, vs / 64.0), "res": (hr / 64.0, vr / 64.0),
            "ascender": max_asc / 64.0, "descender": max_desc / 64.0, "glyphs": out, "rev": rev}



def _trace(px, w, h):
    """Closed polygons (lists of (x, y) in pixel units, y down) around coverage ≥ 0.5."""
    W, H = w + 2, h + 2
    f = [[0.0] * W for _ in range(H)]
    for y in range(h):
        for x in range(w):
            f[y + 1][x + 1] = px[y * w + x] / 15.0
    T = 0.5
    segs = {}

    def interp(ax, ay, av, bx, by, bv):
        t = (T - av) / (bv - av) if bv != av else 0.5
        return (ax + (bx - ax) * t, ay + (by - ay) * t)

    edges = []
    for y in range(H - 1):
        for x in range(W - 1):
            a, b, c, d = f[y][x], f[y][x + 1], f[y + 1][x + 1], f[y + 1][x]
            idx = (a >= T) | ((b >= T) << 1) | ((c >= T) << 2) | ((d >= T) << 3)
            if idx in (0, 15):
                continue
            # edge midpoints: top (a-b), right (b-c), bottom (d-c), left (a-d); pixel centres at +0.5
            P = {
                "t": lambda: interp(x, y, a, x + 1, y, b),
                "r": lambda: interp(x + 1, y, b, x + 1, y + 1, c),
                "b": lambda: interp(x, y + 1, d, x + 1, y + 1, c),
                "l": lambda: interp(x, y, a, x, y + 1, d),
            }
            # segments oriented with the inside on the right (y down), so outer loops come out clockwise on screen
            table = {1: [("l", "t")], 2: [("t", "r")], 3: [("l", "r")], 4: [("r", "b")], 5: [("l", "b"), ("r", "t")] if (a + b + c + d) / 4 < T else [("l", "t"), ("r", "b")],
                     6: [("t", "b")], 7: [("l", "b")], 8: [("b", "l")], 9: [("b", "t")], 10: [("b", "r"), ("t", "l")] if (a + b + c + d) / 4 < T else [("t", "r"), ("b", "l")],
                     11: [("b", "r")], 12: [("r", "l")], 13: [("r", "t")], 14: [("t", "l")]}
            for s, e in table[idx]:
                key = lambda p: (round(p[0], 5), round(p[1], 5))
                ps, pe = P[s](), P[e]()
                edges.append((key(ps), key(pe)))
    nxt = {}
    for s, e in edges:
        nxt.setdefault(s, []).append(e)
    loops = []
    used = set()
    for s, e in edges:
        if (s, e) in used:
            continue
        loop = [s]
        cur, to = s, e
        while True:
            used.add((cur, to))
            if to == loop[0]:
                break
            loop.append(to)
            cands = [n for n in nxt.get(to, []) if (to, n) not in used]
            if not cands:
                break
            cur, to = to, cands[0]
        if len(loop) >= 3:
            loops.append([(x - 0.5, y - 0.5) for x, y in loop])  # field index → pixel coords (centres at +0.5)
    return loops


def _simplify(pts, tol=0.06):
    if len(pts) < 4:
        return pts

    def dp(a, b):
        (x1, y1), (x2, y2) = pts[a], pts[b]
        dx, dy = x2 - x1, y2 - y1
        L = (dx * dx + dy * dy) ** 0.5 or 1e-9
        best, bi = 0.0, -1
        for i in range(a + 1, b):
            d = abs(dy * (pts[i][0] - x1) - dx * (pts[i][1] - y1)) / L
            if d > best:
                best, bi = d, i
        if best > tol:
            return dp(a, bi)[:-1] + dp(bi, b)
        return [pts[a], pts[b]]

    n = len(pts)
    half = n // 2
    return dp(0, half)[:-1] + dp(half, n - 1)[:-1] + [pts[-1]] if n > 4 else pts


def _checksum(b):
    b += b"\0" * ((4 - len(b) % 4) % 4)
    return sum(struct.unpack(">%dI" % (len(b) // 4), b)) & 0xFFFFFFFF


def build_ttf(font, family="ThemeFont"):
    """font: read_pgf() result → TrueType bytes."""
    asc, desc = font["ascender"], font["descender"]
    em = 1024
    S = em / max(1.0, asc - desc)
    codes = sorted(c for c in font["glyphs"] if 32 <= c <= 0xFFFF)
    glyf, loca, hmtx = [], [], []
    # glyph 0: .notdef (empty)
    entries = [(None, 0)]
    for c in codes:
        entries.append((c, font["glyphs"][c]))
    off = 0
    xmin_all = ymin_all = 32767
    xmax_all = ymax_all = -32768
    max_pts = max_ctrs = 0
    for c, g in entries:
        loca.append(off)
        if not g or not g["w"] or not g["h"]:
            adv = int(round((g["adv"] if g else asc * 0.5) * S))
            hmtx.append((adv, 0))
            continue
        loops = [_simplify(l) for l in _trace(g["px"], g["w"], g["h"])]
        loops = [l for l in loops if len(l) >= 3]
        if not loops:
            hmtx.append((int(round(g["adv"] * S)), 0))
            continue
        pts, ends = [], []
        for l in loops:
            for x, y in l:
                pts.append((int(round((g["left"] + x) * S)), int(round((g["top"] - y) * S))))
            ends.append(len(pts) - 1)
        xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
        bb = (min(xs), min(ys), max(xs), max(ys))
        xmin_all, ymin_all = min(xmin_all, bb[0]), min(ymin_all, bb[1])
        xmax_all, ymax_all = max(xmax_all, bb[2]), max(ymax_all, bb[3])
        max_pts, max_ctrs = max(max_pts, len(pts)), max(max_ctrs, len(ends))
        b = struct.pack(">hhhhh", len(ends), *bb)
        b += struct.pack(">%dH" % len(ends), *ends) + struct.pack(">H", 0)
        b += bytes([1]) * len(pts)  # all on-curve, 16-bit deltas
        px_, py_ = 0, 0
        dx = b"".join(struct.pack(">h", x - px_) for (x, _), px_ in zip(pts, [0] + xs[:-1]))
        dy = b"".join(struct.pack(">h", y - py_) for (_, y), py_ in zip(pts, [0] + ys[:-1]))
        b += dx + dy
        b += b"\0" * ((4 - len(b) % 4) % 4)
        glyf.append(b)
        off += len(b)
        hmtx.append((int(round(g["adv"] * S)), bb[0]))
    loca.append(off)
    n = len(entries)
    if xmin_all > xmax_all:
        xmin_all = ymin_all = xmax_all = ymax_all = 0
    A, D = int(round(asc * S)), int(round(-desc * S))
    adv_max = max(a for a, _ in hmtx)
    head = struct.pack(">IIIIHHqqhhhhHHhhh", 0x00010000, 0x00010000, 0, 0x5F0F3CF5, 0b1011, em, 0, 0,
                       xmin_all, ymin_all, xmax_all, ymax_all, 0, 8, 2, 1, 0)
    hhea = struct.pack(">IhhhHhhhhhhhhhhhH", 0x00010000, A, -D, 0, adv_max, min(l for _, l in hmtx), 0, xmax_all, 1, 0, 0, 0, 0, 0, 0, 0, n)
    maxp = struct.pack(">IHHHHHHHHHHHHHH", 0x00010000, n, max_pts, max_ctrs, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0)
    hm = b"".join(struct.pack(">Hh", a, l) for a, l in hmtx)
    loca_b = struct.pack(">%dI" % len(loca), *loca)
    glyf_b = b"".join(glyf) or b"\0\0\0\0"
    # cmap format 4
    gid = {c: i + 1 for i, c in enumerate(codes)}
    segs = []
    for c in codes:
        if segs and c == segs[-1][1] + 1 and gid[c] == gid[segs[-1][1]] + 1:
            segs[-1][1] = c
        else:
            segs.append([c, c])
    segs.append([0xFFFF, 0xFFFF])
    sc = len(segs)
    ends_ = [e for _, e in segs]; starts = [s for s, _ in segs]
    deltas = [((gid[s] - s) & 0xFFFF) if s != 0xFFFF else 1 for s, _ in segs]
    sr = 2 ** (sc.bit_length() - 1) * 2
    sub = struct.pack(">HHHHHHH", 4, 0, 0, sc * 2, sr, (sr // 2).bit_length() - 1, sc * 2 - sr)
    sub += struct.pack(">%dH" % sc, *ends_) + b"\0\0" + struct.pack(">%dH" % sc, *starts)
    sub += struct.pack(">%dH" % sc, *deltas) + struct.pack(">%dH" % sc, *([0] * sc))
    sub = sub[:2] + struct.pack(">H", len(sub)) + sub[4:]
    cmap = struct.pack(">HHHHI", 0, 1, 3, 1, 12) + sub
    os2 = struct.pack(">HhHHHhhhhhhhhhhh10sIIIIIHHHhhhHHII", 3, adv_max // 2, 400, 5, 0, 650, 700, 0, 140, 650, 700, 0, 480, 50, 300, 0,
                      b"\0" * 10, 0, 0, 0, 0, 0x20202020, 0x40, min(codes) if codes else 32, max(codes) if codes else 32,
                      A, -D, 0, A, D, 1, 0)
    os2 += struct.pack(">hhHHH", int(asc * S * 0.5), int(asc * S * 0.7), 0, 32, 0)
    names = {1: family, 2: "Regular", 3: family + " PSP", 4: family, 6: family.replace(" ", "")}
    recs, strs = [], b""
    for nid, s in names.items():
        u = s.encode("utf-16-be")
        recs.append(struct.pack(">HHHHHH", 3, 1, 0x409, nid, len(u), len(strs)))
        strs += u
    name = struct.pack(">HHH", 0, len(recs), 6 + 12 * len(recs)) + b"".join(recs) + strs
    post = struct.pack(">IIhhIIIII", 0x00030000, 0, -100, 50, 0, 0, 0, 0, 0)
    tables = {b"OS/2": os2, b"cmap": cmap, b"glyf": glyf_b, b"head": head, b"hhea": hhea, b"hmtx": hm,
              b"loca": loca_b, b"maxp": maxp, b"name": name, b"post": post}
    tags = sorted(tables)
    nt = len(tags)
    es = 2 ** (nt.bit_length() - 1)
    hdr = struct.pack(">IHHHH", 0x00010000, nt, es * 16, es.bit_length() - 1, nt * 16 - es * 16)
    offset = 12 + 16 * nt
    dirs, body = b"", b""
    for t in tags:
        data = tables[t]
        dirs += struct.pack(">4sIII", t, _checksum(data), offset + len(body), len(data))
        body += data + b"\0" * ((4 - len(data) % 4) % 4)
    out = bytearray(hdr + dirs + body)
    adj = (0xB1B0AFBA - _checksum(bytes(out))) & 0xFFFFFFFF
    hpos = 12 + 16 * tags.index(b"head")
    ho = struct.unpack(">I", out[hpos + 8:hpos + 12])[0]
    out[ho + 8:ho + 12] = struct.pack(">I", adj)
    return bytes(out)


PGF_CHARS = list(range(32, 127)) + list(range(160, 256)) + [0x2122, 0x2026, 0x2022, 0x201C, 0x201D, 0x2018, 0x2019, 0x2013, 0x2014, 0x00B7]


# extra scripts taken from a theme's other font files (Latin Extended, Greek, Cyrillic, kana)
EXTRA_RANGES = [(0x0100, 0x024F), (0x0370, 0x03FF), (0x0400, 0x052F), (0x3000, 0x30FF), (0xFF01, 0xFF5E)]


def pgf_webfont(data, extra=()):
    """(family name, TrueType bytes) for a theme's main .pgf, or None. Characters it lacks are
    taken from the theme's other .pgf files (extra), within EXTRA_RANGES."""
    f = read_pgf(data, PGF_CHARS)
    if not f or len(f["glyphs"]) < 40:
        return None
    want = [c for a, b in EXTRA_RANGES for c in range(a, b + 1)]
    for other in extra:
        try:
            o = read_pgf(other, [c for c in want if c not in f["glyphs"]])
        except Exception:
            o = None
        if not o:
            continue
        k = (f["ascender"] - f["descender"]) / max(1.0, o["ascender"] - o["descender"])
        for c, g in o["glyphs"].items():
            if c in f["glyphs"]:
                continue
            if abs(k - 1) > 0.15:  # a different size: skip rather than mix scales
                break
            f["glyphs"][c] = g
    return f["name"] or "PSP theme font", build_ttf(f, f["name"] or "PSP theme font")
