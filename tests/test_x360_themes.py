"""Synthetic STFS packages: checks x360_themes against a package built here (no Microsoft data).
Run: python tests/test_x360_themes.py   (real console packages still have to be tried by the owner)"""
import os, struct, sys, tempfile, zlib
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "py_modules"))
import x360_themes as X


def png(w, h, rgb):
    return X._png(w, h, bytes(rgb) * (w * h))


def dds(w, h, c565):
    hdr = bytearray(128)
    hdr[:4] = b"DDS "; struct.pack_into("<I", hdr, 4, 124)
    struct.pack_into("<II", hdr, 12, h, w); hdr[84:88] = b"DXT1"
    blocks = ((w + 3) // 4) * ((h + 3) // 4)
    return bytes(hdr) + (struct.pack("<HHI", c565, c565, 0) * blocks)


def build(path, ctype, files, sep=1, name="Test theme", thumb=b"", first=0xA000, hsize=0x971A, magic=b"LIVE"):
    blocks = []                      # data blocks
    entries = []
    for nm, data in files:
        start = len(blocks)
        n = max(1, (len(data) + 0xFFF) // 0x1000)
        for i in range(n):
            blocks.append(data[i * 0x1000:(i + 1) * 0x1000].ljust(0x1000, b"\0"))
        entries.append((nm, len(data), start, n))
    ft_start = len(blocks)
    ft = b""
    for nm, size, start, n in entries:
        e = bytearray(0x40)
        e[:len(nm)] = nm.encode(); e[0x28] = len(nm) | 0x40
        e[0x29:0x2C] = n.to_bytes(3, "little"); e[0x2C:0x2F] = n.to_bytes(3, "little"); e[0x2F:0x32] = start.to_bytes(3, "little")
        struct.pack_into(">H", e, 0x32, 0xFFFF); struct.pack_into(">I", e, 0x34, size)
        ft += bytes(e)
    blocks.append(ft.ljust(0x1000, b"\0"))
    hdr = bytearray(first)
    hdr[:4] = magic
    struct.pack_into(">I", hdr, 0x340, hsize); struct.pack_into(">I", hdr, 0x344, ctype)
    hdr[0x379] = 0x24; hdr[0x37B] = 1 if sep == 1 else 0
    struct.pack_into("<H", hdr, 0x37C, 1); hdr[0x37E:0x381] = ft_start.to_bytes(3, "little")
    struct.pack_into(">I", hdr, 0x395, len(blocks))
    hdr[0x411:0x411 + 2 * len(name)] = name.encode("utf-16-be")
    struct.pack_into(">II", hdr, 0x1712, len(thumb), 0); hdr[0x171A:0x171A + len(thumb)] = thumb
    out = bytes(hdr)
    # one hash table (sep blocks) in front of every 0xAA data blocks
    for g in range(0, len(blocks), 0xAA):
        out += b"\0" * (0x1000 * sep) + b"".join(blocks[g:g + 0xAA])
    open(path, "wb").write(out)


def real_layouts(d):
    """Classes of failure seen on real console packages (names / layout copied from them, no Microsoft data)."""
    wp = lambda c: png(1280, 720, c)
    w1, w2, w3, w4 = wp((200, 0, 0)), wp((0, 200, 0)), wp((0, 0, 200)), wp((9, 9, 9))
    ds = struct.pack(">I", 1)
    # 1. real theme: content type 0x00030000, header size 0xAD0E (data starts at 0xC000), file names without extension
    assert X.CT_THEME == 0x00030000
    p = os.path.join(d, "real1")
    build(p, X.CT_THEME, [("DashStyle", ds), ("GuideTile.png", png(128, 128, (5, 5, 5))), ("Wallpaper1", w1), ("Wallpaper2", w2), ("Wallpaper3", w3), ("Wallpaper4", w4)], 1, first=0xB000, hsize=0xAD0E, magic=b"PIRS")
    r = X.read_x360(p)
    assert r and r["kind"] == "theme" and r["package"] == "PIRS" and r["dashStyle"] == 1, r
    assert list(r["sections"]) == ["home", "games", "media", "system"] and len(r["backgrounds"]) == 4 and not r["premium"], r
    assert "guideTile" in r["icons"], r["icons"]
    assert X.peek_name(p) == "Test theme" and X.peek_name(os.path.join(d, "nothing")) == "" and X.peek(p) == "theme"
    # 2. wallpapers come out in file-name order (Wallpaper1 first), not biggest first; the files are stored 10, 2, 1 on purpose
    big = png(1600, 900, (1, 1, 1))
    p = os.path.join(d, "real2")
    build(p, X.CT_THEME, [("Wallpaper10", big), ("Wallpaper2", w2), ("Wallpaper1", w1)], 1)
    r = X.read_x360(p)
    assert [X._png_size(__import__("base64").b64decode(u.split(",", 1)[1])) for u in r["backgrounds"]] == [(1280, 720), (1280, 720), (1600, 900)], X.summary(r)
    # 3. premium (layered) theme: 45 layer pictures stored BEFORE the wallpapers must not push the wallpapers out of the picture cap,
    #    and layer pictures (700x420, widescreen-ish) are not wallpapers
    layers = [(f"BackgroundLayer{i}.png", png(700, 420, (i, 0, 0))) for i in range(1, 46)]
    p = os.path.join(d, "real3")
    build(p, X.CT_THEME, layers + [("DashStyle", struct.pack(">I", 2)), ("parameters.ini", b"SphereColor=10\r\nAvatarLightingAmbient=0x787878FF\r\n"), ("Wallpaper1", w1), ("Wallpaper2", w2)], 1)
    r = X.read_x360(p)
    assert r["premium"] and len(r["backgrounds"]) == 2 and r["dashStyle"] == 2 and r["params"]["SphereColor"] == "10", X.summary(r)
    # 4. no Wallpaper files at all: widescreen pictures that are not layers are still found
    p = os.path.join(d, "real4")
    build(p, X.CT_THEME, [("ForegroundLayer1.png", png(900, 500, (1, 1, 1))), ("hero.png", wp((3, 3, 3)))], 1)
    r = X.read_x360(p)
    assert len(r["backgrounds"]) == 1 and r["files"][0]["path"] == "ForegroundLayer1.png", X.summary(r)
    # 5. gamer picture pack: every picture comes twice (32 px and 64 px); the 64 px one is chosen, one entry per picture
    pics = []
    for i in range(3):
        pics += [(f"32_00{i}.png", png(32, 32, (i, 9, 9))), (f"64_00{i}.png", png(64, 64, (i, 9, 9)))]
    p = os.path.join(d, "real5")
    build(p, X.CT_GAMER_PICTURE, pics, 1, first=0xB000, hsize=0xAD0E)
    r = X.read_x360(p)
    assert r["kind"] == "gamerpic" and len(r["gamerpics"]) == 3 and X._png_size(__import__("base64").b64decode(r["gamerpic"].split(",", 1)[1])) == (64, 64), X.summary(r)
    # 6. a corrupt hash-table area or file-table pointer never raises or hangs
    raw = open(os.path.join(d, "real3"), "rb").read()
    for k, mut in enumerate((lambda b: b[:0xC800], lambda b: b[:0x379 + 5] + b"\xff\xff\xff" + b[0x379 + 8:], lambda b: b[:0x379 + 3] + b"\xff\xff" + b[0x379 + 5:], lambda b: b[:0xB000] + os.urandom(0x3000) + b[0xE000:])):
        q = os.path.join(d, f"fz{k}"); open(q, "wb").write(mut(raw))
        X.read_x360(q)


def main():
    d = tempfile.mkdtemp(prefix="x360test_")
    try:
        wall = dds(1280, 720, 0xF800)
        big = png(64, 64, (10, 200, 30))
        for sep in (1, 2):
            p = os.path.join(d, f"theme{sep}.bin")
            junk = b"XUIZ" + b"\0" * 50 + png(1024, 576, (1, 2, 3)) + b"\0" * 20
            build(p, X.CT_THEME, [("wall.dds", wall), ("pack.xzp", junk), ("readme.txt", b"hello")], sep, thumb=big)
            r = X.read_x360(p)
            assert r and r["kind"] == "theme" and r["name"] == "Test theme", r
            assert r["preview"] and len(r["files"]) == 3, r["files"]
            assert len(r["backgrounds"]) == 2, X.summary(r)   # dds wallpaper + picture carved out of the .xzp
            print(f"sep={sep}:", X.summary(r))
        p = os.path.join(d, "pic.bin")
        build(p, X.CT_GAMER_PICTURE, [("pic.png", big)], 1, name="Pic", thumb=big)
        r = X.read_x360(p); assert r and r["kind"] == "gamerpic" and r["gamerpic"]
        # not matching / broken input never raises
        for name, data in (("a.txt", b"hello"), ("b.bin", b"LIVE" + b"\0" * 100), ("c.bin", open(p, "rb").read()[:0x3000]), ("d.bin", b"")):
            q = os.path.join(d, name); open(q, "wb").write(data)
            assert X.read_x360(q) is None, name
        assert X.read_x360(os.path.join(d, "missing")) is None
        build(os.path.join(d, "e.bin"), 0x9000, [("x", b"1")]); assert X.read_x360(os.path.join(d, "e.bin")) is None  # other content type
        # the preview thumbnail keeps its own mime type
        jpg = b"\xff\xd8\xff\xc0\x00\x0b\x08\x00\x40\x00\x40\x01\x01\x11\x00" + b"\0" * 20
        build(os.path.join(d, "j.bin"), X.CT_THEME, [("readme.txt", b"x")], 1, thumb=jpg)
        r = X.read_x360(os.path.join(d, "j.bin")); assert r and r["preview"].startswith("data:image/jpeg;base64,"), r and r["preview"][:30]
        build(os.path.join(d, "k.bin"), X.CT_THEME, [("readme.txt", b"x")], 1, thumb=big)
        r = X.read_x360(os.path.join(d, "k.bin")); assert r["preview"].startswith("data:image/png;base64,")
        # a file name longer than 40 characters is not a valid entry
        build(os.path.join(d, "n.bin"), X.CT_THEME, [("a" * 41, b"1")], 1)
        assert X.read_x360(os.path.join(d, "n.bin")) is None
        build(os.path.join(d, "n2.bin"), X.CT_THEME, [("a" * 40, b"1")], 1)
        assert X.read_x360(os.path.join(d, "n2.bin")) is not None
        # DDS bigger than the cap is skipped, not decoded
        assert X.dds_to_png(dds(X.MAX_DDS_SIDE, 8, 0xF800)) is not None
        assert X.dds_to_png(dds(X.MAX_DDS_SIDE + 1, 8, 0xF800)) is None
        assert X.dds_to_png(dds(4096, 4096, 0xF800)) is None
        real_layouts(d)
        print("ok")
    finally:
        import shutil; shutil.rmtree(d, ignore_errors=True)


if __name__ == "__main__":
    main()
