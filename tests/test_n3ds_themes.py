"""Nintendo 3DS theme reader: a small synthetic LZ11 body (built here, no real theme is needed), zips, folders,
loose files, case-insensitive names, placeholder bodies and bad input."""
import base64, io, os, struct, sys, tempfile, zipfile, zlib
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "py_modules"))
import n3ds_themes as N


# ───────── builders ─────────
def lz11_compress(data):
    """A simple LZ11 compressor: runs of one byte become back references (all three length forms get used)."""
    out = bytearray([0x11]) + len(data).to_bytes(3, "little")
    i, n = 0, len(data)
    while i < n:
        flag_pos = len(out)
        out.append(0)
        for bit in range(8):
            if i >= n:
                break
            run = 0
            if i > 0:
                while i + run < n and data[i + run] == data[i - 1] and run < 0x10110:
                    run += 1
            if run >= 3:
                disp = 0  # distance 1
                if run >= 0x111:
                    ln = min(run, 0x10110)
                    v = ln - 0x111
                    out += bytes([0x10 | (v >> 12), (v >> 4) & 0xFF, ((v & 15) << 4) | (disp >> 8), disp & 0xFF])
                elif run >= 0x11:
                    ln = run
                    v = ln - 0x11
                    out += bytes([v >> 4, ((v & 15) << 4) | (disp >> 8), disp & 0xFF])
                else:
                    ln = run if run <= 16 else 16
                    out += bytes([((ln - 1) << 4) | (disp >> 8), disp & 0xFF])
                out[flag_pos] |= 0x80 >> bit
                i += ln
            else:
                out.append(data[i])
                i += 1
    return bytes(out)


def morton_xy(k):
    x = y = 0
    for b in range(3):
        x |= ((k >> (2 * b)) & 1) << b
        y |= ((k >> (2 * b + 1)) & 1) << b
    return x, y


def tile(w, h, bpp, pix):
    """Raw tiled bytes; pix(x, y) -> bytes of length bpp."""
    buf = bytearray(w * h * bpp)
    q = 0
    for t in range((w // 8) * (h // 8)):
        bx, by = (t % (w // 8)) * 8, (t // (w // 8)) * 8
        for k in range(64):
            mx, my = morton_xy(k)
            buf[q:q + bpp] = pix(bx + mx, by + my)
            q += bpp
    return bytes(buf)


def rgb565(r, g, b):
    return struct.pack("<H", (r >> 3) << 11 | (g >> 2) << 5 | (b >> 3))


def wall(w, h):
    # left part red, right part blue, so crops can be told apart
    return tile(w, h, 2, lambda x, y: rgb565(248, 0, 0) if x < 100 else rgb565(0, 0, 248))


def build_body(top_scroll=False, with_art=True):
    tw = 1024 if top_scroll else 512
    top = wall(tw, 256)
    bot = wall(512, 256)
    folder = tile(128, 64, 3, lambda x, y: bytes((0, 0, 255)))  # BGR -> red
    folder2 = tile(128, 64, 3, lambda x, y: bytes((255, 0, 0)))  # BGR -> blue
    big = tile(64, 128, 3, lambda x, y: bytes((0, 255, 0)))
    small = tile(32, 64, 3, lambda x, y: bytes((0, 255, 0)))
    colours = {"cursor": bytes.fromhex("0a2e14" "48b448" "c8f8a8" "78e868"), "folder": bytes.fromhex("050d08" "122c16" "40803b" "020604"),
               "text": bytes.fromhex("ffffff" "102030")}
    head = bytearray(0xD0)
    struct.pack_into("<I", head, 0, 1)
    head[4], head[5] = 0, 1
    body = bytearray()
    pos = 0xD0

    def add(b):
        nonlocal pos
        o = pos
        body.extend(b)
        pos += len(b)
        return o

    struct.pack_into("<I", head, 0x0C, 3)
    struct.pack_into("<I", head, 0x10, 0 if top_scroll else 1)
    struct.pack_into("<I", head, 0x18, add(top))
    struct.pack_into("<I", head, 0x20, 3)
    struct.pack_into("<I", head, 0x24, 1)
    struct.pack_into("<I", head, 0x28, add(bot))
    struct.pack_into("<II", head, 0x2C, 1, add(colours["cursor"]))
    struct.pack_into("<II", head, 0x34, 1, add(colours["folder"]))
    struct.pack_into("<II", head, 0x78, 1, add(colours["text"]))
    if with_art:
        struct.pack_into("<I", head, 0x3C, 1)
        struct.pack_into("<II", head, 0x40, add(folder), add(folder2))
        struct.pack_into("<I", head, 0x50, 1)
        struct.pack_into("<II", head, 0x54, add(big), add(small))
    return bytes(head) + bytes(body)


def decode_png(url):
    assert url.startswith("data:image/png;base64,"), url[:30]
    b = base64.b64decode(url.split(",", 1)[1])
    assert b[:8] == b"\x89PNG\r\n\x1a\n"
    w, h = struct.unpack(">II", b[16:24])
    pos, idat = 8, b""
    while pos < len(b):
        ln = struct.unpack(">I", b[pos:pos + 4])[0]
        if b[pos + 4:pos + 8] == b"IDAT":
            idat += b[pos + 8:pos + 8 + ln]
        pos += 12 + ln
    raw = zlib.decompress(idat)
    rows = [raw[y * (w * 3 + 1) + 1:(y + 1) * (w * 3 + 1)] for y in range(h)]
    return w, h, rows


def px(rows, x, y):
    return tuple(rows[y][3 * x:3 * x + 3])


def put(root, rel, data):
    p = os.path.join(root, *rel.split("/"))
    os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, "wb").write(data)


PNG = base64.b64decode("iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==")

# ───────── the LZ11 layer ─────────
raw = build_body()
comp = lz11_compress(raw)
assert N.lz11(comp) == raw
long_run = bytes([7]) + bytes([9]) * 70000
assert N.lz11(lz11_compress(long_run)) == long_run  # the 4 byte form
for bad in (b"", b"\x11", b"\x10abc", b"\x11\x10\x00\x00" + b"\x80\xff\xff", b"\x11\xff\xff\xff\x00"):
    try:
        N.lz11(bad)
        assert False, bad
    except ValueError:
        pass

# ───────── a theme body ─────────
r = N.parse_body(comp)
assert r["bgm"] and r["errors"] == [], r["errors"]
assert r["top"]["mode"] == "texture" and not r["top"]["scroll"] and r["bottom"]["mode"] == "texture"
w, h, rows = decode_png(r["top"]["image"])
assert (w, h) == (400, 240) and px(rows, 5, 5)[0] > 240 and px(rows, 300, 100)[2] > 240, "top crop 400x240"
w, h, rows = decode_png(r["bottom"]["image"])
assert (w, h) == (320, 240)
assert r["cursor"] == {"dark": "#0a2e14", "main": "#48b448", "light": "#c8f8a8", "glow": "#78e868"}, r["cursor"]
assert r["folder"]["main"] == "#122c16" and r["text"] == {"main": "#ffffff", "alt": "#102030"}
assert r["file"] is None and r["bottom_inner"] is None  # blocks the theme does not have stay None
fw, fh, rows = decode_png(r["folder_art"]["closed"])
assert (fw, fh) == (74, 64) and px(rows, 3, 3) == (255, 0, 0)
fw, fh, rows = decode_png(r["folder_art"]["open"])
assert (fw, fh) == (82, 64) and px(rows, 3, 3) == (0, 0, 255)
assert decode_png(r["file_art"]["large"])[:2] == (36, 72) and decode_png(r["file_art"]["small"])[:2] == (25, 49)

s = N.parse_body(lz11_compress(build_body(top_scroll=True, with_art=False)))
assert s["top"]["scroll"] and s["top"]["frame"] == "fast" and decode_png(s["top"]["image"])[:2] == (400, 240)
assert decode_png(s["top"]["wide"])[:2] == (1024, 240) and "folder_art" not in s

# a truncated texture only loses that part
cut = raw[:0xD0 + 512 * 256 * 2 + 100]
d = N.parse_body(cut)
assert d["top"]["image"] and d["bottom"]["image"] is None and any("bottom" in e for e in d["errors"]), d["errors"]

# ───────── files: loose, zip (odd case), folder ─────────
with tempfile.TemporaryDirectory() as t:
    loose = os.path.join(t, "My Theme.bin")
    open(loose, "wb").write(comp)
    lr = N.read_3ds_theme(loose)
    assert lr and lr["name"] == "My Theme" and lr["top"]["image"] and not lr["bgm_only"], lr and lr["name"]
    assert N.peek(loose)

    smdh = bytearray(0x36C0)
    smdh[:4] = b"SMDH"
    o = 8 + 1 * 0x200  # English
    smdh[o:o + 12] = "Cool Theme".encode("utf-16-le")
    smdh[o + 0x80:o + 0x80 + 14] = "A long text".encode("utf-16-le")
    smdh[o + 0x180:o + 0x180 + 10] = "Some One".encode("utf-16-le")
    z = os.path.join(t, "pack.zip")
    with zipfile.ZipFile(z, "w") as f:
        f.writestr("Sub/BODY_lz.BIN", comp)
        f.writestr("Sub/Preview.PNG", PNG)
        f.writestr("Sub/INFO.smdh", bytes(smdh))
        f.writestr("Sub/bgm.BCSTM", b"CSTM")
    zr = N.read_3ds_theme(z)
    assert zr["name"] == "Cool Theme" and zr["author"] == "Some One" and zr["description"] == "A long text", zr["name"]
    assert zr["preview"].startswith("data:image/png") and zr["bgm"] and zr["bgm_file"] == "Sub/bgm.BCSTM"
    assert zr["icon"] and decode_png(zr["icon"])[:2] == (48, 48)

    fo = os.path.join(t, "folder")
    put(fo, "body_LZ.bin", comp)
    put(fo, "name.txt", "From Name Txt\nsecond line".encode())
    fr = N.read_3ds_theme(fo)
    assert fr["name"] == "From Name Txt" and fr["top"]["image"]

    # a 64 byte placeholder body with music: music only, no crash
    stub = os.path.join(t, "stub")
    put(stub, "body_LZ.bin", b"\x11\x00\x00\x00" + bytes(60))
    put(stub, "bgm.bcstm", b"CSTM")
    sr = N.read_3ds_theme(stub)
    assert sr and sr["bgm_only"] and sr["bgm"] and sr["top"]["image"] is None and sr["cursor"] is None
    stub2 = os.path.join(t, "stub2.bin")
    open(stub2, "wb").write(bytes(64))
    assert N.read_3ds_theme(stub2)["bgm_only"]

    # not themes: None, never an exception
    put(t, "plain/readme.txt", b"hi")
    junk = os.path.join(t, "junk.bin")
    open(junk, "wb").write(os.urandom(400))
    badzip = os.path.join(t, "bad.zip")
    open(badzip, "wb").write(b"not a zip")
    lying = os.path.join(t, "lying.bin")
    open(lying, "wb").write(b"\x11\xff\xff\x7f" + b"\x00" * 200)
    for bad in (os.path.join(t, "plain"), os.path.join(t, "missing"), os.path.join(t, "plain", "readme.txt"), junk, badzip, lying, "", None):
        assert N.read_3ds_theme(bad) is None, bad
        assert not N.peek(bad) or bad in (junk, lying)

    # a body with an unsupported version
    v2 = bytearray(raw)
    struct.pack_into("<I", v2, 0, 2)
    odd = os.path.join(t, "v2.bin")
    open(odd, "wb").write(lz11_compress(bytes(v2)))
    assert N.read_3ds_theme(odd) is None

    # home badges: sets = subfolders, loose pictures = "My badges", cells from the file name or the shape
    def png(w, h):
        return N._png(w, h, bytes(w * h * 4), alpha=True)
    broot, bundled = os.path.join(t, "badges"), os.path.join(t, "bundled-badges")
    put(broot, "Stars/star.png", png(64, 64))
    put(broot, "Stars/banner.png", png(128, 64))
    put(broot, "Stars/tower.png", png(64, 128))
    put(broot, "Stars/big@2x2.png", png(64, 64))
    put(broot, "Stars/fake.png", b"not a png")
    put(broot, "Stars/notes.txt", b"hi")
    put(broot, "loose_1x2.png", png(32, 32))
    put(broot, "Empty/readme.txt", b"")
    put(bundled, "Stars/star.png", png(10, 50))  # the user's own picture of the same name wins
    put(bundled, "Extra/one.png", png(64, 64))
    res = N.list_badges([broot, bundled, os.path.join(t, "nope"), None])
    names = [s["name"] for s in res["sets"]]
    assert names == ["My badges", "Extra", "Stars"], names
    stars = {b["name"]: b for b in res["sets"][2]["badges"]}
    assert set(stars) == {"star", "banner", "tower", "big"}, stars.keys()
    assert (stars["star"]["w"], stars["star"]["h"]) == (1, 1)
    assert (stars["banner"]["w"], stars["banner"]["h"]) == (2, 1)
    assert (stars["tower"]["w"], stars["tower"]["h"]) == (1, 2)
    assert (stars["big"]["w"], stars["big"]["h"]) == (2, 2)
    assert stars["star"]["url"].startswith("data:image/png;base64,") and stars["star"]["id"] == "Stars/star.png"
    loose = res["sets"][0]["badges"][0]
    assert loose["name"] == "loose" and (loose["w"], loose["h"]) == (1, 2)
    put(broot, "Huge/huge.png", b"\x89PNG\r\n\x1a\n" + bytes(N.MAX_BADGE + 10))
    assert "Huge" not in [s["name"] for s in N.list_badges([broot])["sets"]]
    assert N.list_badges([]) == {"sets": []}
print("3ds theme tests passed")
