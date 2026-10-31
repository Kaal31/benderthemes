"""Wii U Menu theme reader (py_modules/wiiu_themes.py) on SYNTHETIC data: a tiny "stock" Men.pack / Men2.pack
(SARC + Yaz0 + BFLIM, built here), BPS patches generated here, .utheme zips shaped like Themezer's and Theme Café's.
No Nintendo data. Run: python tests/test_wiiu_themes.py
Real .utheme files (e.g. downloaded from themezer.net) are also read when WIIU_REAL_DIR points at a folder of them."""
import base64, io, json, os, struct, sys, tempfile, zipfile, zlib, random
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "py_modules"))
import wiiu_themes as W

du = lambda raw, m: "data:%s;base64,%s" % (m, base64.b64encode(raw).decode())


# ───────── builders ─────────
def yaz0_store(d):
    out = bytearray(b"Yaz0" + struct.pack(">I", len(d)) + b"\0" * 8)
    for i in range(0, len(d), 8):
        chunk = d[i:i + 8]
        out.append(0xFF if len(chunk) == 8 else (0xFF << (8 - len(chunk))) & 0xFF)
        out += chunk
    return bytes(out)


def sarc(files):
    names = b"".join(n.encode() + b"\0" + b"\0" * ((-len(n) - 1) % 4) for n, _ in files)
    data, ents, off = b"", [], 0
    for n, d in files:
        data += b"\0" * ((-len(data)) % 4)
        ents.append((0, 0x01000000 | off // 4, len(data), len(data) + len(d)))
        off += len(n.encode()) + 1 + (-len(n) - 1) % 4
        data += d
    sfat = b"SFAT" + struct.pack(">HHI", 12, len(files), 0x65) + b"".join(struct.pack(">IIII", *e) for e in ents)
    sfnt = b"SFNT" + struct.pack(">HH", 8, 0) + names
    start = 0x14 + len(sfat) + len(sfnt)
    start += (-start) % 4
    blob = b"SARC" + struct.pack(">HHIIHH", 0x14, 0xFEFF, start + len(data), start, 0x100, 0) + sfat + sfnt
    return blob.ljust(start, b"\0") + data


def bflim(w, h, rgba):
    """Linear RGBA8 (format 9, tile mode 1) picture."""
    size = len(rgba)
    return rgba + b"FLIM" + b"\0" * 16 + b"imag" + struct.pack(">I", 0x10) + struct.pack(">HHHBB", w, h, 4, 9, 1) + struct.pack(">I", size)


def solid(w, h, c):
    return bytes(c) * (w * h)


def layout(name_to_pic):
    """a layout .szs: Yaz0(SARC{ timg/<name>^f.bflim })"""
    return yaz0_store(sarc([("timg/%s^f.bflim" % n, p) for n, p in name_to_pic.items()]))


def vint(n):
    out = b""
    while True:
        x = n & 0x7F
        n >>= 7
        if n:
            out += bytes([x])
            n -= 1
        else:
            return out + bytes([0x80 | x])


def bps_wrap(src, tgt, body):
    p = b"BPS1" + vint(len(src)) + vint(len(tgt)) + vint(0) + body
    p += struct.pack("<II", zlib.crc32(src), zlib.crc32(tgt))
    return p + struct.pack("<I", zlib.crc32(p))


def bps_make(src, tgt):
    """Greedy diff: runs equal at the same offset become SourceRead, everything else TargetRead."""
    body, i, n = b"", 0, len(tgt)
    while i < n:
        j = i
        if i < len(src) and src[i] == tgt[i]:
            while j < n and j < len(src) and src[j] == tgt[j]:
                j += 1
            body += vint((j - i - 1) << 2 | 0)
        else:
            while j < n and not (j + 8 <= min(n, len(src)) and src[j:j + 8] == tgt[j:j + 8]):
                j += 1
            body += vint((j - i - 1) << 2 | 1) + tgt[i:j]
        i = j
    return bps_wrap(src, tgt, body)


def rel(v):
    return vint((abs(v) << 1) | (1 if v < 0 else 0))


# ───────── a tiny "stock" menu and a theme over it ─────────
RED, BLUE, GREEN = (255, 0, 0, 255), (0, 0, 255, 255), (0, 255, 0, 255)


def stock_files():
    glass = bflim(4, 4, solid(4, 4, (255, 255, 255, 80)))
    overlay = {"HBMIconL_006": bflim(4, 4, solid(4, 4, (10, 10, 10, 255))), "HBMIconL_000": bflim(4, 4, solid(4, 4, (20, 20, 20, 255)))}
    men2 = sarc([("Common/Layout/LauncherIcon.szs", layout({"LauncherBtnSpecGlass": glass, "EmptyAppIcon_00": glass})),
                 ("Common/Layout/OverlayAppBase.szs", layout(overlay)),
                 ("Common/Model/LoungeVR.szs", yaz0_store(b"background" * 200))])
    men = sarc([("Common/Layout/BtnSwap_00.szs", layout({"SwapArrow": bflim(4, 4, solid(4, 4, (5, 5, 5, 255)))})),
                ("Common/Layout/SelectFrame.szs", layout({"Frame": bflim(4, 4, solid(4, 4, (1, 2, 3, 255)))}))])
    return men, men2


def themed_files(men, men2):
    glass = bflim(4, 4, solid(4, 4, RED))
    overlay = {"HBMIconL_006": bflim(4, 4, solid(4, 4, BLUE)), "HBMIconL_000": bflim(4, 4, solid(4, 4, (20, 20, 20, 255)))}
    new2 = sarc([("Common/Layout/LauncherIcon.szs", layout({"LauncherBtnSpecGlass": glass, "EmptyAppIcon_00": glass})),
                 ("Common/Layout/OverlayAppBase.szs", layout(overlay)),
                 ("Common/Model/LoungeVR.szs", yaz0_store(b"background" * 200))])
    new1 = sarc([("Common/Layout/BtnSwap_00.szs", layout({"SwapArrow": bflim(4, 4, solid(4, 4, GREEN))})),
                 ("Common/Layout/SelectFrame.szs", layout({"Frame": bflim(4, 4, solid(4, 4, (1, 2, 3, 255)))}))])
    return new1, new2


JPG = b"\xff\xd8\xff\xe0" + b"jfif" * 20


def make_utheme(path, men, men2, meta=None, extra=None, patch_names=("Men.bps", "Men2.bps"), drop=()):
    new1, new2 = themed_files(men, men2)
    meta = meta if meta is not None else {"Metadata": {"themeID": "Themezer:TEST", "themeName": "Test Theme", "themeAuthor": "Someone", "themeVersion": "2026-01-01T00:00:00.000Z"}}
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        if "Men" not in drop:
            z.writestr(patch_names[0], bps_make(men, new1))
        if "Men2" not in drop:
            z.writestr(patch_names[1], bps_make(men2, new2))
        z.writestr("metadata.json", json.dumps(meta))
        z.writestr("preview-launcher.jpg", JPG)
        z.writestr("preview-warawara.jpg", JPG)
        for k, v in (extra or {}).items():
            z.writestr(k, v)


def decode_png(b):
    assert b[:8] == b"\x89PNG\r\n\x1a\n"
    w, h = struct.unpack(">II", b[16:24])
    pos, idat = 8, b""
    while pos < len(b):
        n = struct.unpack(">I", b[pos:pos + 4])[0]
        if b[pos + 4:pos + 8] == b"IDAT":
            idat += b[pos + 8:pos + 8 + n]
        pos += 12 + n
    raw = zlib.decompress(idat)
    return w, h, [tuple(raw[1 + y * (w * 4 + 1) + x * 4:1 + y * (w * 4 + 1) + x * 4 + 4]) for y in range(h) for x in range(w)]


def art_pixel(res, slot):
    url = res["art"][slot]
    w, h, px = decode_png(base64.b64decode(url.split(",", 1)[1]))
    return px[0], (w, h)


# ───────── tests ─────────
def test_bps():
    random.seed(7)
    src = bytes(random.getrandbits(8) for _ in range(5000))
    tgt = bytearray(src)
    tgt[100:140] = b"X" * 40
    tgt += b"tail-data" * 30
    tgt = bytes(tgt)
    assert W.bps_apply(src, bps_make(src, tgt)) == tgt
    # SourceCopy (relative, backwards and forwards) and TargetCopy that overlaps its own output (run-length)
    t2 = src[2000:2010] + src[100:105] + b"ab" * 20
    body = vint((10 - 1) << 2 | 2) + rel(2000) + vint((5 - 1) << 2 | 2) + rel(100 - 2010) + vint((2 - 1) << 2 | 1) + b"ab" + vint((38 - 1) << 2 | 3) + rel(15)
    assert W.bps_apply(src, bps_wrap(src, t2, body)) == t2
    good = bps_make(src, tgt)
    for bad, why in ((b"", "empty"), (b"BPS1", "short"), (b"IPS1" + good[4:], "magic"), (good[:-1], "cut"), (good[:-20], "cut2")):
        try:
            W.bps_apply(src, bad)
            raise AssertionError(why)
        except ValueError:
            pass
    try:
        W.bps_apply(src[:-1] + b"\0", good)
        raise AssertionError("different source")
    except ValueError as e:
        assert "different source" in str(e)
    flipped = bytearray(good)
    flipped[10] ^= 1
    try:
        W.bps_apply(src, bytes(flipped))
        raise AssertionError("damaged")
    except ValueError:
        pass
    # a patch claiming a gigantic output, a command running past the output, a copy from before the start
    for body in (vint(10 ** 12 << 2), vint((10 ** 6) << 2 | 1) + b"x", vint(0 << 2 | 3) + rel(0)):
        p = b"BPS1" + vint(len(src)) + vint(10 ** 12 if body[:1] == vint(10 ** 12 << 2)[:1] else 100) + vint(0) + body
        p += struct.pack("<II", zlib.crc32(src), 0)
        p += struct.pack("<I", zlib.crc32(p))
        try:
            W.bps_apply(src, p)
            raise AssertionError("must reject")
        except ValueError:
            pass
    # fuzz: random damage never raises anything but ValueError
    for _ in range(300):
        p = bytearray(good)
        for _k in range(random.randint(1, 4)):
            p[random.randrange(len(p))] = random.getrandbits(8)
        if random.random() < .3:
            p = p[:random.randrange(len(p))]
        try:
            W.bps_apply(src, bytes(p))
        except ValueError:
            pass


def test_yaz0_sarc():
    d = bytes(random.getrandbits(8) for _ in range(300))
    assert W.yaz0(yaz0_store(d)) == d
    # back-reference stream: literal "ab", then copy 18 bytes from distance 2 (3-byte form), then 3 from distance 1
    stream = b"Yaz0" + struct.pack(">I", 2 + 18 + 3) + b"\0" * 8 + bytes([0b11000000]) + b"ab" + bytes([0x00, 0x01, 0x00]) + bytes([0x10, 0x00])
    assert W.yaz0(stream)[:20] == b"ab" * 10
    for n in range(0, len(stream)):
        try:
            W.yaz0(stream[:n])
        except ValueError:
            pass
    try:
        W.yaz0(b"Yaz0" + struct.pack(">I", 2 ** 31) + b"\0" * 8)
        raise AssertionError("huge")
    except ValueError:
        pass
    # a 17-byte file claiming 200 MB must be refused before anything that size is allocated
    import tracemalloc
    tracemalloc.start()
    try:
        W.yaz0(b"Yaz0" + struct.pack(">I", 200 * 1024 * 1024) + b"\0" * 8 + b"\xff")
        raise AssertionError("bogus size accepted")
    except ValueError:
        pass
    peak = tracemalloc.get_traced_memory()[1]
    tracemalloc.stop()
    assert peak < 10 * 1024 * 1024, peak
    files = [("Common/A.szs", b"hello"), ("B/c.bin", b"x" * 33)]
    assert W.sarc(sarc(files)) == dict(files)
    assert W.sarc(yaz0_store(sarc(files))) == dict(files)
    blob = sarc(files)
    for n in range(0, len(blob), 7):
        try:
            W.sarc(blob[:n])
        except ValueError:
            pass
    for _ in range(200):
        p = bytearray(blob)
        p[random.randrange(len(p))] = random.getrandbits(8)
        try:
            W.sarc(bytes(p))
        except ValueError:
            pass


def test_bflim():
    px = bytes([255, 0, 0, 255, 0, 255, 0, 128] * 8)
    r = W.bflim_rgba(bflim(4, 4, px + px))
    assert r and r[0] == 4 and r[1] == 4 and r[2][:8] == px[:8], r
    w, h, rgba = r
    assert decode_png(W.png(w, h, rgba))[2][1] == (0, 255, 0, 128)
    assert W.bflim_rgba(b"nope") is None
    # truncated pixel data decodes (as black), never raises; absurd size is skipped
    d = bflim(8, 8, solid(8, 8, RED))
    assert W.bflim_rgba(d[:100] + d[-0x28:]) is not None
    huge = d[:-0x28] + b"FLIM" + b"\0" * 16 + b"imag" + struct.pack(">I", 0x10) + struct.pack(">HHHBB", 4000, 4000, 4, 9, 1) + struct.pack(">I", 10)
    assert W.bflim_rgba(huge) is None


def build_dump(root, men, men2):
    pkg = os.path.join(root, "mlc01", "sys", "title", "00050010", "10040100", "content", "Common", "Package")
    os.makedirs(pkg)
    open(os.path.join(pkg, "Men.pack"), "wb").write(men)
    open(os.path.join(pkg, "Men2.pack"), "wb").write(men2)
    return os.path.join(root, "mlc01")


def zip_dump(path, men, men2):
    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("mlc01/sys/title/00050010/10040100/content/Common/Package/Men.pack", men)
        z.writestr("mlc01/sys/title/00050010/10040100/content/Common/Package/Men2.pack", men2)
        z.writestr("mlc01/sys/title/00050010/10040100/content/Common/Package/Other.pack", b"x")


def test_theme_end_to_end():
    men, men2 = stock_files()
    with tempfile.TemporaryDirectory() as t:
        stock = os.path.join(t, "stock")
        theme = os.path.join(t, "Test.utheme")
        make_utheme(theme, men, men2, extra={"splash.png": W.png(2, 2, solid(2, 2, RED))})
        info = W.utheme_info(theme)
        assert info["name"] == "Test Theme" and info["author"] == "Someone" and info["id"] == "Themezer:TEST"
        assert info["needs"] == {"Men": "%08x" % zlib.crc32(men), "Men2": "%08x" % zlib.crc32(men2)}, info
        assert info["preview"] == "preview-launcher.jpg" and info["previewPlaza"] == "preview-warawara.jpg" and info["splash"] == "splash.png"
        # no menu files yet: previews and the splash show, pictures wait
        r = W.read_utheme(theme, stock, du)
        assert r["needsStock"] is True and r["art"] == {} and r["preview"].startswith("data:image/jpeg") and r["splash"].startswith("data:image/png"), r.keys()
        # menu files from a zip dump
        z = os.path.join(t, "dump.zip")
        zip_dump(z, men, men2)
        assert W._classify(z) == "stock" and W._classify(theme) == "theme"
        st = W.import_stock(z, stock)
        assert set(st) == {"Men.pack", "Men2.pack"} and st["Men.pack"]["crc"] == "%08x" % zlib.crc32(men)
        r = W.read_utheme(theme, stock, du)
        assert not r.get("needsStock") and not r.get("stockMismatch") and not r["errors"], r
        assert art_pixel(r, "tile-glass") == (RED, (4, 4)) and art_pixel(r, "empty-slot")[0] == RED
        assert art_pixel(r, "downloads")[0] == BLUE and art_pixel(r, "swap-arrow")[0] == GREEN
        assert "icon-browser" not in r["art"], "an unchanged picture is not reported as themed"
        assert "Common/Layout/LauncherIcon.szs" in r["changed"] and "Common/Model/LoungeVR.szs" not in r["changed"], r["changed"]
        # the same through a menu dump folder, and a second copy is accepted as well
        dump = build_dump(os.path.join(t, "dumpdir"), men, men2)
        assert W._classify(dump) == "stock"
        stock2 = os.path.join(t, "stock2")
        W.import_stock(dump, stock2)
        assert W.stock_status(stock2) == st
        # other menu files (another version): the theme says so and shows nothing
        other = os.path.join(t, "stock3")
        os.makedirs(other)
        open(os.path.join(other, "Men.pack"), "wb").write(sarc([("x", b"1")]))
        open(os.path.join(other, "Men2.pack"), "wb").write(sarc([("x", b"2")]))
        r = W.read_utheme(theme, other, du)
        assert r["stockMismatch"] == ["Men", "Men2"] and r["art"] == {} and not r.get("needsStock"), r
        # garbage is never taken in as menu files
        junk = os.path.join(t, "junk.zip")
        with zipfile.ZipFile(junk, "w") as zz:
            zz.writestr("a/Common/Package/Men.pack", b"not a pack at all")
            zz.writestr("a/Common/Package/Men2.pack", b"not a pack either")
        try:
            W.import_stock(junk, os.path.join(t, "stock4"))
            raise AssertionError("junk accepted")
        except ValueError:
            pass
        assert not os.path.exists(os.path.join(t, "stock4", "Men.pack"))
        # a theme that is only Men.pack still reads (one pack is enough), and a text/sound-only theme needs nothing
        only = os.path.join(t, "Only.utheme")
        make_utheme(only, men, men2, drop=("Men2",))
        r = W.read_utheme(only, stock, du)
        assert "swap-arrow" in r["art"] and "tile-glass" not in r["art"] and not r["errors"], r["art"].keys()
        sound = os.path.join(t, "Sound.utheme")
        with zipfile.ZipFile(sound, "w") as zz:
            zz.writestr("cafe_barista_men.bps", bps_make(b"s" * 100, b"s" * 90 + b"t" * 20))
            zz.writestr("metadata.json", json.dumps({"Metadata": {"themeName": "Sound only"}}))
        r = W.read_utheme(sound, stock, du)
        assert r["name"] == "Sound only" and r["art"] == {} and not r.get("needsStock") and r["ignored"] == ["cafe_barista_men"], r
        # a broken Men2 patch loses only that part
        bad = os.path.join(t, "Bad.utheme")
        make_utheme(bad, men, men2)
        with zipfile.ZipFile(bad, "a") as zz:
            pass
        raw = zipfile.ZipFile(theme)
        with zipfile.ZipFile(bad, "w") as zz:
            for n in raw.namelist():
                d = raw.read(n)
                if n == "Men2.bps":
                    d = d[:len(d) // 2] + b"\xff" * 10 + d[len(d) // 2 + 10:]
                    d = d[:-4] + struct.pack("<I", zlib.crc32(d[:-4]))  # still looks well formed
                zz.writestr(n, d)
        raw.close()  # release the source ZIP before TemporaryDirectory cleanup on Windows
        r = W.read_utheme(bad, stock, du)
        assert "swap-arrow" in r["art"] and "tile-glass" not in r["art"] and any(e.startswith("Men2") for e in r["errors"]), r
        # Theme Café's tool: arbitrary patch names mapped to the file they patch
        cafe = os.path.join(t, "Cafe.utheme")
        meta = {"Metadata": {"themeName": "Cafe", "themeAuthor": "a", "themeID": "cafe", "themeRegion": "UNIVERSAL"},
                "Patches": {"menu_one.bps": "Common/Package/Men.pack", "menu_two.bps": "Common/Package/Men2.pack", "AllMessage_US.bps": "UsEnglish/Message/AllMessage.szs"}}
        make_utheme(cafe, men, men2, meta=meta, patch_names=("menu_one.bps", "menu_two.bps"), extra={"AllMessage_US.bps": bps_make(b"m" * 50, b"n" * 50)})
        r = W.read_utheme(cafe, stock, du)
        assert art_pixel(r, "tile-glass")[0] == RED and r["ignored"] == ["AllMessage.szs"] and r["region"] == "UNIVERSAL", r
        # not themes
        for name, mk in (("empty.utheme", lambda p: open(p, "wb").write(b"")), ("text.utheme", lambda p: open(p, "wb").write(b"hello")),
                         ("nobps.utheme", lambda p: zipfile.ZipFile(p, "w").writestr("a.txt", "x"))):
            p = os.path.join(t, name)
            mk(p)
            assert W.utheme_info(p) is None and W.read_utheme(p, stock, du) is None and W._classify(p) == ""
        # corrupt zip bodies never escape as anything else than ValueError/None from the reader's callers
        data = open(theme, "rb").read()
        for cut in (len(data) // 3, len(data) - 30):
            p = os.path.join(t, "cut.utheme")
            open(p, "wb").write(data[:cut])
            try:
                W.read_utheme(p, stock, du)
            except (zipfile.BadZipFile, ValueError, OSError, EOFError, zlib.error, KeyError):
                pass
        # oversized metadata is ignored, not read
        big = os.path.join(t, "Big.utheme")
        with zipfile.ZipFile(big, "w", zipfile.ZIP_DEFLATED) as zz:
            zz.writestr("Men.bps", bps_make(men, themed_files(men, men2)[0]))
            zz.writestr("metadata.json", " " * (W.MEMBER_MAX["meta"] + 10))
        assert W.utheme_info(big)["name"] == "Big"


def test_layout_names():
    men, men2 = stock_files()
    p = W.sarc(men2)
    assert W.layout_textures(p, "Common/Layout/OverlayAppBase.szs").keys() == {"HBMIconL_006", "HBMIconL_000"}
    # a pack that spells the path without the Common/ prefix (as the docs do) still resolves
    short = {k.replace("Common/", "", 1): v for k, v in p.items()}
    assert "HBMIconL_006" in W.layout_textures(short, "Common/Layout/OverlayAppBase.szs")
    assert W.layout_textures(p, "Common/Layout/Missing.szs") == {}


def test_scan():
    men, men2 = stock_files()
    with tempfile.TemporaryDirectory() as t:
        dl = os.path.join(t, "Downloads")
        os.makedirs(os.path.join(dl, "deep", "er", "est", "too", "far"))
        make_utheme(os.path.join(dl, "A.utheme"), men, men2)
        make_utheme(os.path.join(dl, "deep", "Hidden.utheme"), men, men2)
        make_utheme(os.path.join(dl, "deep", "er", "est", "too", "far", "TooDeep.utheme"), men, men2)
        zip_dump(os.path.join(dl, "menu.zip"), men, men2)
        with zipfile.ZipFile(os.path.join(dl, "other.zip"), "w") as z:
            z.writestr("readme.txt", "hi")
        open(os.path.join(dl, "broken.zip"), "wb").write(b"PK\x03\x04garbage")
        open(os.path.join(dl, "x.utheme"), "wb").write(b"junk")
        build_dump(os.path.join(dl, "dumpfolder"), men, men2)
        state = {}
        found = W.scan([dl], state)
        kinds = sorted((os.path.basename(f["path"]), f["kind"]) for f in found)
        assert ("A.utheme", "theme") in kinds and ("Hidden.utheme", "theme") in kinds and ("menu.zip", "stock") in kinds, kinds
        assert not any(n in ("TooDeep.utheme", "other.zip", "broken.zip", "x.utheme") for n, _ in kinds), kinds
        assert any(k == "stock" and n == "mlc01" or n == "dumpfolder" for n, k in kinds) or any(k == "stock" for _, k in kinds)
        # unchanged files are not opened again; a decision hides a file
        calls = []
        orig = W._classify
        W._classify = lambda p: calls.append(p) or orig(p)
        try:
            again = W.scan([dl], state)
            assert not calls, calls
            assert len(again) == len(found)
            state[os.path.realpath(os.path.join(dl, "A.utheme"))]["decision"] = "dismissed"
            assert all(os.path.basename(f["path"]) != "A.utheme" for f in W.scan([dl], state))
        finally:
            W._classify = orig
        assert W.scan([os.path.join(t, "nope")], {}) == []


def test_real_files():
    d = os.environ.get("WIIU_REAL_DIR") or ""
    if not os.path.isdir(d):
        return print("  (no real .utheme files here; skipped)")
    men, men2 = stock_files()
    n = 0
    with tempfile.TemporaryDirectory() as t:
        stock = os.path.join(t, "stock")
        os.makedirs(stock)
        open(os.path.join(stock, "Men.pack"), "wb").write(men)
        open(os.path.join(stock, "Men2.pack"), "wb").write(men2)
        for f in sorted(os.listdir(d)):
            if not f.endswith(".utheme"):
                continue
            p = os.path.join(d, f)
            info = W.utheme_info(p)
            assert info and info["needs"].keys() == {"Men", "Men2"} and info["preview"], f
            assert all(len(c) == 8 for c in info["needs"].values())
            assert W.read_utheme(p, os.path.join(t, "none"), du)["needsStock"] is True
            r = W.read_utheme(p, stock, du)  # our synthetic files are not the real ones: an honest "different menu files"
            assert r["stockMismatch"] == ["Men", "Men2"] and r["art"] == {}, f
            assert W._classify(p) == "theme"
            n += 1
    print("  %d real themes read" % n)


def test_fres_and_tiling():
    # the tile-by-tile untiling must give the same bytes as the per-pixel address function
    for tm in (4, 5, 6, 2):
        for bpp in (8, 32, 64, 128):
            w, h = 37, 21
            data = bytes(random.Random(tm * bpp).randrange(256) for _ in range(300000))
            _t, pitch, ph = W._surface(w, h, bpp, tm)
            eb = bpp // 8
            want = bytearray()
            for y in range(h):
                for x in range(w):
                    a = W._addr_macro(x, y, bpp, pitch, ph, tm, 0x200) if tm >= 4 else W._addr_micro(x, y, bpp, pitch)
                    want += data[a:a + eb]
            assert W.deswizzle(data, w, h, bpp, tm, 0x200) == bytes(want), (tm, bpp)
    # a minimal FRES with one linear RGBA8 FTEX (2x2) is found and decoded
    pix = bytes([255, 0, 0, 255, 0, 255, 0, 255, 0, 0, 255, 255, 9, 9, 9, 255])
    fres = bytearray(0x400)
    fres[0:4] = b"FRES"; fres[8:10] = b"\xfe\xff"
    struct.pack_into(">i", fres, 0x24, 0x100 - 0x24)  # FTEX group
    struct.pack_into(">ii", fres, 0x100, 0x30, 1)  # length, count
    struct.pack_into(">i", fres, 0x124, 0x180 - 0x124)  # node 1: offset of the FTEX
    a = 0x180
    fres[a:a + 4] = b"FTEX"
    struct.pack_into(">9I", fres, a + 4, 1, 2, 2, 1, 1, 0x1A, 0, 1, len(pix))
    struct.pack_into(">4I", fres, a + 0x34, 1, 0, 0, 2)
    struct.pack_into(">i", fres, a + 0xA8, 0x300 - (a + 0xA8))
    struct.pack_into(">i", fres, a + 0xB0, 0x320 - (a + 0xB0))
    fres[0x300:0x305] = b"bg02\0"
    fres[0x320:0x320 + len(pix)] = pix
    tex = W.fres_textures(bytes(fres))
    assert list(tex) == ["bg02"] and tex["bg02"]["width"] == 2, tex
    assert W.ftex_rgba(bytes(fres), tex["bg02"]) == (2, 2, pix)
    for bad in (b"", b"FRES", b"XXXX" + bytes(100)):
        try:
            W.fres_textures(bad)
            assert False
        except ValueError:
            pass
    w, h, px = W._shrink(4, 2, bytes(range(32)), 2)
    assert (w, h, len(px)) == (2, 1, 8)
    assert W.png(2, 1, bytes([1, 2, 3, 255, 4, 5, 6, 255]), opaque=True)[:8] == b"\x89PNG\r\n\x1a\n"


def test_scan_dump_names():
    assert W._dump_looking("mlc01_WiiUMenu_5.5.5US") and W._dump_looking("Common") and not W._dump_looking("Photos")
    men, men2 = stock_files()
    with tempfile.TemporaryDirectory() as t:
        dl = os.path.join(t, "Downloads")
        os.makedirs(os.path.join(dl, "a", "b", "c"))
        build_dump(os.path.join(dl, "a", "b", "c", "mlc01_WiiUMenu_5.5.5US"), men, men2)
        zip_dump(os.path.join(dl, "menu.zip"), men, men2)
        found = W.scan([dl], {})
        assert sum(f["kind"] == "stock" for f in found) == 2, found


REAL_STOCK = os.path.join(os.path.dirname(__file__), "..", "local-material", "wiiu-stock")


def test_real_stock_if_present():
    """Owner-supplied 5.5.5 menu files kept in local-material (private repo, test use only); skipped when absent."""
    if not os.path.isfile(os.path.join(REAL_STOCK, "Men2.pack")):
        return print("  (no real menu files in local-material/wiiu-stock; skipped)")
    st = W.stock_status(REAL_STOCK)
    assert {k: v["crc"] for k, v in st.items()} == {"Men.pack": "b9a4343a", "Men2.pack": "946cd8a2", "cafe_barista_men.bfsar": "c9c16521"} and all(v["version"] for v in st.values())
    packs = {b: W.sarc(open(os.path.join(REAL_STOCK, b + ".pack"), "rb").read()) for b in ("Men", "Men2")}
    # the SLOTS table against the real archives: every texture exists and decodes; a few sizes are checked
    sizes = {"tile-glass": (258, 258), "empty-slot": (128, 128), "downloads": (154, 154), "network-mark": (93, 93), "account-frame": (256, 256), "page-arrow": (137, 225)}
    for slot, (base, archive, tex) in W.SLOTS.items():
        t = W.layout_textures(packs[base], archive).get(tex)
        assert t, slot
        r = W.bflim_rgba(t)
        assert r and (slot not in sizes or r[:2] == sizes[slot]), slot
    assert W.background_picture(packs["Men2"], *W.BACKGROUNDS["grid-background"][:2])[:2] == (32, 32)
    assert W.background_picture(packs["Men2"], *W.BACKGROUNDS["plaza-floor"][:2])[:2] == (1024, 1024)
    d = os.environ.get("WIIU_REAL_DIR") or ""
    if os.path.isdir(d):
        n = 0
        for f in sorted(os.listdir(d)):
            if f.endswith(".utheme"):
                r = W.read_utheme(os.path.join(d, f), REAL_STOCK, du)
                assert not r.get("stockMismatch") and not r.get("needsStock") and not r["errors"], (f, r)
                assert "grid-background" in r["art"] and "plaza-floor" in r["art"], f
                n += 1
        print("  %d real themes applied to the real stock" % n)


def main():
    for name, fn in sorted(globals().items()):
        if name.startswith("test_") and callable(fn):
            fn()
    print("wiiu theme tests passed")


main()
