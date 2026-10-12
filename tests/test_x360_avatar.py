"""Importing your own avatar model (a 360sona MyAvatar.glb) for the Xbox 360 dashboards: synthetic GLBs only.
Run: python3 -I tests/test_x360_avatar.py"""
import json, os, struct, sys, tempfile, unittest
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "py_modules"))
import x360_avatar as A


def glb(doc, bin_=b"\0" * 16):
    js = json.dumps(doc).encode()
    js += b" " * (-len(js) % 4)
    body = struct.pack("<II", len(js), 0x4E4F534A) + js + struct.pack("<II", len(bin_), 0x004E4942) + bin_
    return b"glTF" + struct.pack("<II", 2, 12 + len(body)) + body


AVATAR = {"asset": {"version": "2.0", "generator": "360sona"}, "meshes": [{}], "skins": [{}], "nodes": [{}, {}],
          "animations": [{"name": "Idle"}, {"name": "Hello there"}]}
PNG = b"\x89PNG\r\n\x1a\n" + b"\0" * 32


class AvatarImport(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.dir = self.tmp.name
        self.dest = os.path.join(self.dir, "data", "assets", A.SET)

    def tearDown(self):
        self.tmp.cleanup()

    def write(self, name, data):
        p = os.path.join(self.dir, "Downloads", name)
        os.makedirs(os.path.dirname(p), exist_ok=True)
        with open(p, "wb") as f:
            f.write(data)
        return p

    def test_info(self):
        info = A.glb_info(glb(AVATAR))
        self.assertEqual(info["meshes"], 1)
        self.assertEqual(info["animations"], ["Idle", "Hello there"])
        self.assertIsNone(A.glb_info(b"glTF" + b"\0" * 40))
        self.assertIsNone(A.glb_info(glb({"asset": {"version": "1.0"}})))
        bad = bytearray(glb(AVATAR))
        struct.pack_into("<I", bad, 8, len(bad) + 100)  # claims more than there is
        self.assertIsNone(A.glb_info(bytes(bad)))
        self.assertIsNone(A.glb_info(b"not a model"))

    def test_install_model_and_picture(self):
        p = self.write("MyAvatar.glb", glb(AVATAR))
        r = A.install(p, self.dest)
        self.assertTrue(r["success"], r)
        self.assertEqual(r["kind"], "model")
        with open(os.path.join(self.dest, "avatar.glb"), "rb") as f:
            self.assertEqual(f.read(), glb(AVATAR))
        r = A.install(self.write("gamerpic.png", PNG), self.dest)
        self.assertEqual(r["kind"], "picture")
        st = A.status(self.dest)
        self.assertEqual(st["model"]["animations"], 2)
        self.assertTrue(st["picture"])
        A.remove(self.dest, "model")
        self.assertIsNone(A.status(self.dest)["model"])
        self.assertTrue(A.status(self.dest)["picture"])

    def test_rejects(self):
        self.assertFalse(A.install(self.write("x.glb", b"hello"), self.dest)["success"])
        self.assertFalse(A.install(self.write("empty.glb", glb({"asset": {"version": "2.0"}})), self.dest)["success"])  # no mesh
        self.assertFalse(A.install(os.path.join(self.dir, "missing.glb"), self.dest)["success"])
        self.assertFalse(os.path.exists(os.path.join(self.dest, "avatar.glb")))
        self.assertFalse(A.install_url("http://example.com/a.glb", self.dest, None)["success"])

    def test_scan(self):
        self.write("MyAvatar.glb", glb(AVATAR))
        self.write("broken.glb", b"nope")
        self.write("holiday.png", PNG)  # not named like a gamerpic
        self.write("gamerpic (1).png", PNG)
        found = A.scan([os.path.join(self.dir, "Downloads")])
        names = sorted(f["name"] for f in found)
        self.assertEqual(names, ["MyAvatar.glb", "gamerpic (1).png"])
        model = next(f for f in found if f["kind"] == "model")
        self.assertTrue(model["sona"])
        self.assertEqual(model["animations"], 2)

    def test_url(self):
        data = glb(AVATAR)

        class R:
            def __init__(self, d): self.d = d
            def __enter__(self): return self
            def __exit__(self, *a): return False
            def read(self, n): return self.d[:n]

        r = A.install_url("https://example.com/MyAvatar.glb", self.dest, lambda req, timeout: R(data))
        self.assertTrue(r["success"], r)


if __name__ == "__main__":
    unittest.main()
