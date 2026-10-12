"""Synthetic .nxtheme files (Yaz0 + SARC, built here, no Nintendo data): checks switch_themes.
Run: python tests/test_switch_themes.py   (real files: test-themes/_dl-switch, see the final report)"""
import base64, json, os, struct, sys, tempfile
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "py_modules"))
import switch_themes as S
import wiiu_themes as W

du = lambda raw, m: "data:%s;base64,%s" % (m, base64.b64encode(raw).decode())


def yaz0_store(d):
    out = bytearray(b"Yaz0" + struct.pack(">I", len(d)) + b"\0" * 8)
    for i in range(0, len(d), 8):
        chunk = d[i:i + 8]
        out.append((0xFF << (8 - len(chunk))) & 0xFF if len(chunk) < 8 else 0xFF)
        out += chunk
    return bytes(out)


def sarc(files):
    names = b"".join(n.encode() + b"\0" + b"\0" * ((-len(n) - 1) % 4) for n, _ in files)
    data, ents, pos = b"", [], 0
    for k, (n, d) in enumerate(files):
        pos += (-pos) % 4
        ents.append((0, 0x01000000 | (sum(len(m.encode()) + 1 + (-len(m) - 1) % 4 for m, _ in files[:k])) // 4, pos, pos + len(d)))
        data += b"\0" * ((-len(data)) % 4) + d
        pos = len(data)
    sfat = b"SFAT" + struct.pack(">HHI", 12, len(files), 0x65) + b"".join(struct.pack(">IIII", *e) for e in ents)
    sfnt = b"SFNT" + struct.pack(">HH", 8, 0) + names
    head = 0x14
    start = head + len(sfat) + len(sfnt)
    start += (-start) % 4
    blob = b"SARC" + struct.pack(">HHIIHH", head, 0xFEFF, start + len(data), start, 0x100, 0) + sfat + sfnt
    return blob.ljust(start, b"\0") + data


def dds(w, h, c565):
    hdr = bytearray(128)
    hdr[:4] = b"DDS "; struct.pack_into("<I", hdr, 4, 124)
    struct.pack_into("<II", hdr, 12, h, w); hdr[80:84] = struct.pack("<I", 4); hdr[84:88] = b"DXT1"
    return bytes(hdr) + struct.pack("<HHI", c565, c565, 0) * (((w + 3) // 4) * ((h + 3) // 4))


def make(path, name, target, extra=(), image=("image.dds", None)):
    info = json.dumps({"Version": 15, "ThemeName": name, "Author": "tester", "Target": target}).encode()
    files = [("info.json", info), ("layout.json", b'{"Files":[]}'), (image[0], image[1] or dds(8, 8, 0xF800))] + list(extra)
    with open(path, "wb") as f:
        f.write(yaz0_store(sarc(files)))


def main():
    with tempfile.TemporaryDirectory() as t:
        make(os.path.join(t, "a [Menu].nxtheme"), "Red [Menu]", "home", [("album.dds", dds(8, 8, 0x07E0)), ("junk.bin", b"1234")])
        make(os.path.join(t, "a [Lock].nxtheme"), "Red [Lock]", "lock")
        os.makedirs(os.path.join(t, "Blue pack"))
        make(os.path.join(t, "Blue pack", "x.nxtheme"), "Blue", "home", image=("image.jpg", b"\xff\xd8\xff\xe0jpegdata"))
        open(os.path.join(t, "bad.nxtheme"), "wb").write(b"not a theme at all")
        open(os.path.join(t, "bad2.nxtheme"), "wb").write(b"Yaz0" + b"\xff" * 40)
        idx = os.path.join(t, "idx", "i.json")
        groups = S.scan_folder(t, idx)
        assert [g["name"] for g in groups] == ["Blue", "Red"], groups
        red = next(g for g in groups if g["name"] == "Red")
        assert sorted(red["files"]) == ["home", "lock"] and red["primary"].endswith("[Menu].nxtheme")
        assert S.scan_folder(t, idx) == groups  # second run served from the index
        r = S.read_theme(t, red["id"], du, idx)
        assert r and sorted(r["screens"]) == ["home", "lock"] and r["otherScreens"] == [] and r["name"] == "Red", r
        assert sorted(S.read_theme(t, red["id"], du, idx, only=None)["screens"]) == ["home", "lock"]
        lock_first = S.read_theme(t, red["files"]["lock"], du, idx)  # opened through its lock screen file
        assert "lock" in lock_first["screens"]
        news = S.read_theme(t, red["id"], du, idx, only=("home",))  # a narrower set keeps the rest listed only
        assert sorted(news["screens"]) == ["home"] and news["otherScreens"] == ["lock"]
        h = r["screens"]["home"]
        assert h["background"].startswith("data:image/png;base64,") and h["size"] == [8, 8] and "album" in r["icons"]
        assert h["extras"] == ["junk.bin"] and not h["errors"]
        b = S.read_theme(t, "Blue pack/x.nxtheme", du)
        assert b["screens"]["home"]["background"].startswith("data:image/jpeg")
        assert S.read_theme(t, "bad.nxtheme", du) is None and S.read_theme(t, "bad2.nxtheme", du) is None
        # a file without a target is "?" everywhere (never "" in otherScreens, never listed twice)
        make(os.path.join(t, "none.nxtheme"), "Untargeted", "")
        n = S.read_theme(t, "none.nxtheme", du)
        assert n and "" not in n["screens"] and "" not in n["otherScreens"], n
        assert n["otherScreens"] == ["?"] and n["screens"] == {}, n
        assert len(n["otherScreens"]) + len(n["screens"]) == 1
        for evil in ("../x.nxtheme", "/etc/passwd", "a/b/c.nxtheme", "..\\x", ""):
            assert S.safe_rel(t, evil) is None, evil
    # Themezer serves .nxtheme as a plain zip with the same members (layout.json, image.jpg, info.json)
    import io, zipfile
    with tempfile.TemporaryDirectory() as t:
        b = io.BytesIO()
        with zipfile.ZipFile(b, "w") as z:
            z.writestr("info.json", json.dumps({"Version": 17, "ThemeName": "Zipped", "Author": "Z", "Target": "home"}))
            z.writestr("image.jpg", b"\xff\xd8\xff\xe0jpeg")
            z.writestr("album.png", b"\x89PNG\r\n\x1a\nxx")
            z.writestr("sub/evil.jpg", b"x")
        open(os.path.join(t, "zipped.nxtheme"), "wb").write(b.getvalue())
        i = S.file_info(os.path.join(t, "zipped.nxtheme"))
        assert i and i["name"] == "Zipped" and i["target"] == "home", i
        r = S.read_screen(os.path.join(t, "zipped.nxtheme"), lambda raw, mime: mime)
        assert r and r["background"] == "image/jpeg" and r["icons"].get("album") == "image/png", r
        open(os.path.join(t, "nozip.nxtheme"), "wb").write(b"PK\x03\x04broken")
        assert S.file_info(os.path.join(t, "nozip.nxtheme")) is None
    # a screen word is not part of the theme name
    assert S.group_key("Persona 5 Makoto - Lock Screen 3", "A") == S.group_key("Persona 5 Makoto Home Screen", "A")
    print("switch theme tests passed")


main()
