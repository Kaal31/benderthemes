import base64, os, struct, sys, tempfile, unittest, unittest.mock, zlib
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'py_modules'))
import console_themes as ct
import psp_scene


class CategoryBarTests(unittest.TestCase):
    def test_same_width_wide_strips_are_one_bar(self):
        keys = ct.CTF_CATEGORY_ORDER_8
        self.assertEqual(ct.category_bar({k: (337, 53) for k in keys[:1] + keys[2:]}), {"w": 337, "h": 53})
        # Persona 3: one width, two heights; the extras "+" strip is also wide
        sizes = {k: (382, 90) for k in keys[2:7]}
        sizes.update({keys[0]: (382, 20), keys[1]: (382, 20)})
        self.assertEqual(ct.category_bar(sizes), {"w": 382, "h": 90})

    def test_normal_and_per_word_icons_are_not_a_bar(self):
        keys = ct.CTF_CATEGORY_ORDER_8
        self.assertIsNone(ct.category_bar({k: (64, 48) for k in keys}))
        self.assertIsNone(ct.category_bar({k: (61, 37) for k in keys}))  # square-ish, one odd icon
        self.assertIsNone(ct.category_bar({keys[0]: (480, 80), keys[1]: (480, 80), keys[2]: (480, 80)}))  # fewer than four
        # words of different widths (Large Original XMB) keep the word look
        self.assertIsNone(ct.category_bar({k: (w, 58) for k, w in zip(keys, (350, 338, 313, 289, 93, 271, 330, 350))}))


class CategoryRowTests(unittest.TestCase):
    """Large Original XMB: one icon per picture, pictures of different widths, the icon at its own baked place."""

    def test_row_from_icon_offsets(self):
        keys = ct.CTF_CATEGORY_ORDER_8
        widths = (350, 338, 313, 289, 93, 271, 330, 350)
        offs = (-155.5, -119.5, -75.5, -29.5, 19.5, 71, 115, 154.5)
        sizes = {k: (w, 58) for k, w in zip(keys, widths)}
        self.assertEqual(ct.category_bar(sizes, dict(zip(keys, offs))), {"w": 350, "h": 58, "row": True})
        # words of different widths whose pictures are centred stay words
        self.assertIsNone(ct.category_bar(sizes, {k: 0.0 for k in keys}))
        self.assertIsNone(ct.category_bar(sizes, {k: 3.0 * i for i, k in enumerate(keys)}))

    def test_icon_offset_from_png(self):
        w, h = 20, 4
        px = bytearray(w * h * 4)
        for y in range(h):
            for x in range(2, 6):  # opaque columns 2..5 -> centre 4, picture centre 10
                px[(y * w + x) * 4:(y * w + x) * 4 + 4] = b"\xff\xff\xff\xff"
        url = "data:image/png;base64," + base64.b64encode(ct.png(w, h, bytes(px))).decode()
        self.assertEqual(ct._png_icon_offset(url), -6.0)


class CategoryTiltTests(unittest.TestCase):
    def scene(self, rot=-0.3):
        T = {"k": "obj4", "n": "T", "x": -264.0, "y": 0.0, "init": ("event", "native:/U"), "ch": []}
        base = {"k": "plane", "n": "basetop", "x": 0.0, "y": -135.0, "init": ("anim", "topRT"), "ch": [T]}
        return {"pages": {"R": [base]}, "anims": {"topRT": [{"t": "rotate", "o": "basetop", "d": 0.0, "e": 0, "v": [0.0, 0.0, rot]}]}}

    def test_persona3_tilt(self):
        t = psp_scene.category_tilt(self.scene())
        self.assertAlmostEqual(t["tilt"], 17.19, places=2)  # clockwise on screen
        self.assertEqual((t["dx"], t["dy"]), (-264.0, -1.0))
        self.assertEqual(psp_scene.category_origin(self.scene()), (-264.0, -135.0))

    def test_persona3_item_list_place(self):
        # the selected row: the container's x, the height of the container turned about its parent's place (-135 + 78)
        t = psp_scene.category_tilt(self.scene())
        self.assertEqual((t["ix"], t["iy"]), (-264.0, -57.0))

    def test_plain_themes_have_no_tilt(self):
        T = {"k": "obj4", "n": "T", "x": -1.0, "y": 0.0, "init": ("event", "native:/U"), "ch": []}
        self.assertIsNone(psp_scene.category_tilt({"pages": {"R": [T]}, "anims": {}}))
        self.assertIsNone(psp_scene.category_tilt(self.scene(0.0)))
        self.assertIsNone(psp_scene.category_tilt(None))
        self.assertEqual(psp_scene.category_origin({"pages": {"R": [T]}, "anims": {}}), (-1.0, 0.0))


class IconMarkTests(unittest.TestCase):
    def test_icon_info_place_and_colour(self):
        w, h = 20, 8
        px = bytearray(w * h * 4)
        for y in range(3, 7):  # a 4 × 4 icon, columns 2..5, rows 3..6, dark; one soft reflection row (alpha 100) is not counted for the colour
            for x in range(2, 6):
                px[(y * w + x) * 4:(y * w + x) * 4 + 4] = bytes((10, 20, 30, 255 if y < 6 else 100))
        url = "data:image/png;base64," + base64.b64encode(ct.png(w, h, bytes(px))).decode()
        off, top, colour = ct._png_icon_info(url)
        self.assertEqual((off, top, colour), (-6.0, 3, "rgb(10,20,30)"))
        self.assertEqual(ct._png_icon_offset(url), -6.0)
        self.assertIsNone(ct._png_icon_info("data:image/png;base64," + base64.b64encode(ct.png(w, h, bytes(w * h * 4))).decode()))


class BatteryBannerTests(unittest.TestCase):
    """Persona 3 draws its battery as words sliding down a line turned 17 degrees (system_plugin_fg.rco)."""

    def scene(self, rotated=True):
        def plane(n, x, y, w, h, img=None, init=None, kids=()):
            d = {"k": "plane", "n": n, "x": x, "y": y, "w": w, "h": h, "sx": 1.0, "sy": 1.0, "r": 1.0, "g": 1.0, "b": 1.0, "a": 1.0, "ch": list(kids)}
            if img:
                d["img"] = img
            if init:
                d["init"] = ("anim", init)
            return d
        pages = {"page_indicator": [
            plane("batbg", -190.0, 110.0, 250.0, 20.0, "bg", "bgRT"),
            plane("batbase", -50.0, 153.0, 0.0, 0.0, None, "baseRT", [plane("battery", 0.0, 0.0, 50.0, 20.0, "tex_battery")]),
            plane("battx1", -50.0, 153.0, 88.0, 15.0, "tx1", "tx1RT"),
            plane("battx2a", -50.0, 153.0, 88.0, 15.0, "tx2"),
        ]}
        pages["page_indicator"][1]["ch"][0].update(sx=1.1, sy=1.1)
        z = 0.3 if rotated else 0.0
        anims = {
            "bgRT": [{"t": "rotate", "o": "batbg", "d": 0.0, "e": 0, "v": [0.0, 0.0, z]}],
            "baseRT": [{"t": "rotate", "o": "batbase", "d": 0.0, "e": 0, "v": [0.0, 0.0, z]}, {"t": "delay", "d": 4160.0}, {"t": "fire", "a": "baseMT", "kind": "anim"}],
            "baseMT": [{"t": "move", "o": "batbase", "d": 6000.0, "e": 0, "v": [-280.0, 82.0, 0.0]}],
            "tx1RT": [{"t": "rotate", "o": "battx1", "d": 0.0, "e": 0, "v": [0.0, 0.0, z]}, {"t": "rotate", "o": "battx2a", "d": 0.0, "e": 0, "v": [0.0, 0.0, z]}, {"t": "fire", "a": "tx1MT", "kind": "anim"}],
            "tx1MT": [{"t": "move", "o": "battx1", "d": 6000.0, "e": 0, "v": [-280.0, 82.0, 0.0]}, {"t": "move", "o": "battx2a", "d": 6000.0, "e": 0, "v": [-280.0, 82.0, 0.0]}],
            "anim_battery_charging": [{"t": "color", "o": "battx1", "d": 250.0, "e": 0, "v": [1.0, 1.0, 1.0, 0.0]}, {"t": "color", "o": "battx2a", "d": 250.0, "e": 0, "v": [1.0, 1.0, 1.0, 1.0]}],
            "anim_battery_not_charging": [{"t": "color", "o": "battx2a", "d": 250.0, "e": 0, "v": [1.0, 1.0, 1.0, 0.0]}, {"t": "color", "o": "battx1", "d": 250.0, "e": 0, "v": [1.0, 1.0, 1.0, 1.0]}],
        }
        return {"pages": pages, "anims": anims, "images": {}, "models": {}}

    def banner(self, scene):
        gim = {k: b"MIG.00.1PSP" for k in ("bg", "tex_battery", "tx1", "tx2")}
        fake_png = ct.png(1, 1, b"\x00\x40\x60\xff")
        with unittest.mock.patch.object(psp_scene, "rco_scene", return_value=scene), unittest.mock.patch.object(ct, "gim_png", return_value=fake_png):
            return ct.battery_banner(b"x", gim)

    def test_rotated_words_slide_and_swap_while_charging(self):
        b = self.banner(self.scene())
        by = {(i["w"], i["delay"], i["show"]): i for i in b["items"]}
        self.assertEqual(len(b["items"]), 3)
        pct = by[(55.0, 4160.0, "always")]  # the percentage picture, 4 frames stacked, 10% bigger than its 50 × 20
        self.assertEqual((pct["frames"], pct["h"], pct["x"], pct["y"]), (4, 22.0, -50.0, 153.0))
        self.assertEqual((pct["dx"], pct["dy"], pct["dur"], pct["rot"]), (-230.0, -71.0, 6000.0, -17.19))  # z +0.3 turns counter-clockwise
        self.assertIn((88.0, 0.0, "idle"), by)  # "BATTERY" is hidden while charging…
        self.assertIn((88.0, 0.0, "charging"), by)  # …and the other word shows instead
        self.assertEqual(b["bg"]["rot"], -17.19)
        self.assertEqual(b["bg"]["color"], "rgba(0,64,96,1.0)")  # the band's colour: its picture's middle row times the plane's own colour

    def test_usual_battery_has_no_banner(self):
        self.assertIsNone(self.banner(self.scene(rotated=False)))


class TextStyleTests(unittest.TestCase):
    def style(self, sx, alpha=1.0):
        f = [0.0] * 41
        f[0], f[1], f[3], f[4], f[5], f[6], f[10], f[11], f[22] = 203.0, 123.0, 1.0, 1.0, 1.0, alpha, sx, sx, 7.6
        f[23] = f[24] = f[25] = 1.0
        return struct.pack("<41f", *f)

    def read(self, sx, alpha=1.0):
        with unittest.mock.patch.object(ct, "rco_objects", return_value=[(13, "clock", self.style(sx, alpha))]):
            return ct.rco_text_styles(b"x")["clock"]

    def test_object_scale_is_kept_when_not_one(self):
        self.assertEqual(self.read(0.7)["scale"], 0.7)  # Large Original Midnight Black, Organ, Blackstorm
        self.assertNotIn("scale", self.read(1.0))  # Persona 3 and the console's own: size 7.6 at scale 1
        self.assertEqual(self.read(0.7, 0.44)["alpha"], 0.44)

    def test_odd_scales_are_ignored(self):
        self.assertNotIn("scale", self.read(50.0))  # a layout that scales its whole page by 50 is not a clock size


def _ptf(sections, cut=0):
    """A .ptf with the given {object index: {sub index: zlib payload}}; cut = bytes removed from the end."""
    body, offs = b"", []
    base = 0x120
    for oi, subs in sections.items():
        sec = struct.pack("<HH", oi, len(subs)).ljust(0x20, b"\0")
        for si, raw in subs.items():
            z = zlib.compress(raw)
            sec += struct.pack("<HHHHII", si, 0, 5, 2, len(z), len(raw)).ljust(0x20, b"\0") + z
        offs.append(base + len(body))
        body += sec
    head = (b"\0PTF\0\1\0\0" + b"Wallpaper only").ljust(0x100, b"\0") + struct.pack("<8I", *(offs + [0] * 8)[:8])
    d = head + body
    return d[:len(d) - cut] if cut else d


class WallpaperOnlyThemeTests(unittest.TestCase):
    """GT Theme (NPEW00051).PTF lists only two sections (preview, wallpaper): no icons, still a theme."""

    def read(self, data):
        with tempfile.TemporaryDirectory() as dir:
            path = os.path.join(dir, "gt.ptf")
            with open(path, "wb") as f:
                f.write(data)
            return ct.read_psp(path)

    def test_two_sections_only(self):
        bmp = b"BM" + b"\0" * 60
        r = self.read(_ptf({0: {0: b"x" * 40, 1: b"MIG.00.1PSP", 2: b"\0\0\0\0"}, 1: {0: bmp}}))
        self.assertEqual(r["name"], "Wallpaper only")
        self.assertEqual(r["icons"], {})
        self.assertEqual(len(r["backgrounds"]), 1)

    def test_cut_off_file_gives_what_is_there(self):
        bmp = b"BM" + bytes(range(256)) * 40
        full = _ptf({0: {0: b"x" * 40}, 1: {0: bmp}})
        r = self.read(full[:-20])
        self.assertIsNotNone(r)  # the wallpaper's stream is cut: partial or nothing, never an error
        self.assertEqual(self.read(full[:0x130])["icons"], {})
        self.assertIsNone(self.read(b"nope"))

    def test_wallpaper_is_marked(self):
        r = self.read(_ptf({0: {0: b"x" * 40}, 1: {0: b"BM" + b"\0" * 60}}))
        self.assertTrue(r.get("wallpaper"))  # shown on the wallpaper page, without the wave
        self.assertNotIn("wallpaper", self.read(_ptf({0: {0: b"x" * 40}})))


def _module_patch_ctf(records):
    """A file whose trailing table names /vsh/module/vshmain.prx: [path 64][u32 offset][u32 record count], the records
    [i32 offset][u32 length][bytes] (how CTF themes patch the firmware's own modules)."""
    body = b"\0" * 256
    blob = b"".join(struct.pack("<iI", o, len(b)) + b for o, b in records)
    off = len(body)
    body += blob
    name = b"/vsh/module/vshmain.prx".ljust(64, b"\0")
    pad = b"\0" * (len(body) + 16)  # the table sits in the file's second half
    return body + pad + name + struct.pack("<II", off, len(records))


class ModulePatchTests(unittest.TestCase):
    def test_records_are_read(self):
        d = _module_patch_ctf([(-0xA0, b"\x0c\x00"), (0x31108, b"\x57"), (0x31044, b"\x12\xc3")])
        p = ct.ctf_module_patches(d)["vshmain.prx"]
        self.assertEqual(p[0x31108], b"\x57")
        self.assertEqual(p[0x31044], b"\x12\xc3")

    def test_patched_floats(self):
        # one byte: the low byte of the stock constant's upper half (Midnight Black: 0x57 under 0x43 = 215, the clock's right end)
        self.assertEqual(ct._patched_float({0x31108: b"\x57"}, 0x31108, 0x43), 215.0)
        self.assertEqual(ct._patched_float({0x31044: b"\xfc"}, 0x31044, 0x42), 126.0)
        # two bytes: the whole upper half (Organ v2: 0xc312 = -146, a clock at the top left)
        self.assertEqual(ct._patched_float({0x31108: b"\x12\xc3"}, 0x31108), -146.0)
        self.assertIsNone(ct._patched_float({}, 0x31108))


def _rgba_png(w, h, pixel):
    px = bytearray(w * h * 4)
    for y in range(h):
        for x in range(w):
            px[(y * w + x) * 4:(y * w + x) * 4 + 4] = bytes(pixel(x, y))
    return "data:image/png;base64," + base64.b64encode(ct.png(w, h, bytes(px))).decode()


class BakedNameTests(unittest.TestCase):
    """Large Original family: an item picture with its name under the icon; Organ: letters inside a dark tile."""

    def test_name_under_the_icon(self):
        def px(x, y):
            if 4 <= y < 50 and 20 <= x < 92:
                return (0, 0, 0, 255)  # the icon
            if 60 <= y < 70 and 30 <= x < 82 and x % 4 != 0:
                return (10, 100, 235, 255)  # letters: blue, in runs
            return (0, 0, 0, 0)
        n = ct._baked_name(ct._png_rows(_rgba_png(112, 77, px)))
        self.assertEqual((n["top"], n["bottom"], n["color"], n["h"]), (60, 70, "rgb(10,100,235)", 77))
        self.assertNotIn("fill", n)

    def test_letters_in_a_tile(self):
        def px(x, y):
            if not (4 <= x < 68 and 4 <= y < 80):
                return (0, 0, 0, 0)
            if 20 <= y < 50 and 20 <= x < 52:
                return (200, 200, 200, 255)  # the glyph
            if 68 <= y < 73 and 18 <= x < 54 and x % 3 != 0:
                return (160, 160, 160, 255)  # the letters
            return (2, 2, 2, 150)  # the see-through tile
        n = ct._baked_name(ct._png_rows(_rgba_png(72, 84, px)))
        self.assertEqual((n["top"], n["bottom"]), (67, 74))
        self.assertEqual(n["color"], "rgb(160,160,160)")
        self.assertTrue(n["fill"].startswith("rgba(2,2,2,0.5"))
        self.assertLessEqual(n["x0"], 17)
        self.assertGreaterEqual(n["x1"], 55)

    def test_plain_icons_have_no_name(self):
        self.assertIsNone(ct._baked_name(ct._png_rows(_rgba_png(48, 48, lambda x, y: (255, 255, 255, 255 if 8 <= x < 40 and 8 <= y < 40 else 0)))))
        # a solid shadow under the icon is not a name (one run)
        self.assertIsNone(ct._baked_name(ct._png_rows(_rgba_png(64, 64, lambda x, y: (0, 0, 0, 255 if (4 <= y < 44 or 50 <= y < 56) and 10 <= x < 54 else 0)))))


if __name__ == "__main__":
    unittest.main()
