import json
import os
from pathlib import Path
import sys
import tempfile
import types
import unittest
import zipfile
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "py_modules"))
sys.modules.setdefault("decky", types.SimpleNamespace())
import data_themes


class DataThemes(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.user = Path(self.tmp.name) / "themes"
        self.user.mkdir()
        decky = data_themes.decky
        decky.DECKY_PLUGIN_RUNTIME_DIR = self.tmp.name
        decky.logger = types.SimpleNamespace(warning=lambda *a: None, error=lambda *a: None)
        import theme_store
        store_paths = patch.dict(vars(theme_store.decky), {
            "DECKY_PLUGIN_DIR": self.tmp.name,
            "DECKY_PLUGIN_RUNTIME_DIR": self.tmp.name,
            "DECKY_PLUGIN_SETTINGS_DIR": str(Path(self.tmp.name) / "settings"),
        })
        store_paths.start()
        self.addCleanup(store_paths.stop)
        data_themes._cache.clear()
        data_themes._zip_errors.clear()

    def tearDown(self):
        self.tmp.cleanup()

    def theme(self, folder, manifest, files=()):
        d = self.user / folder
        d.mkdir(parents=True)
        (d / "theme.json").write_text(json.dumps(manifest))
        for name in files:
            p = d / name
            p.parent.mkdir(parents=True, exist_ok=True)
            p.write_bytes(b"x")
        return d

    def test_shipped_themes_exclude_import_only_test_skins(self):
        ids = {t["id"]: t for t in data_themes.list_themes()}
        self.assertEqual(ids["gamecube"]["source"], "bundled")
        self.assertEqual(ids["ios6"]["source"], "bundled")
        self.assertNotIn("midnight-ps4", ids)
        self.assertNotIn("frame-test", ids)

    def test_wrapper_keeps_the_interface_in_its_folder(self):
        html, csp = data_themes.frame_wrapper("http://127.0.0.1:1234/tok", "my-ui", "pages/start page.html")
        self.assertIn('src="http://127.0.0.1:1234/tok/t/my-ui/pages/start%20page.html"', html)
        self.assertIn('sandbox="allow-scripts"', html)
        self.assertNotIn("allow-same-origin", html + csp)
        self.assertIn("frame-src http://127.0.0.1:1234/tok/t/my-ui/", csp)
        self.assertIn("sandbox allow-scripts", csp)
        self.assertIn("connect-src 'none'", csp)
        # a hostile id or entry can't break out of the attribute
        html, _ = data_themes.frame_wrapper("http://h", 'x"><script>', 'a"b.html')
        self.assertNotIn('"><script>', html)

    def test_native_media_without_data_manifest(self):
        import frame_media
        target = Path(self.tmp.name) / "native.png"
        target.write_bytes(b"verified image")
        spec = {"old-big-picture": {"pack": "old-big-picture", "version": "1.0.1", "files": ["assets/home.png"]}}
        fake = types.SimpleNamespace(resource=lambda _: str(target))
        with patch.object(frame_media, "catalog", return_value=spec), patch.dict(sys.modules, {"theme_store": fake}):
            self.assertEqual(data_themes.resolve("old-big-picture", "assets/home.png"), str(target))
            self.assertIsNone(data_themes.resolve("old-big-picture", "../secret"))
            self.assertIsNone(data_themes.resolve("old-big-picture", "unknown.png"))
            self.assertIsNone(data_themes.resolve("unknown-layout", "assets/home.png"))

    def test_user_theme_and_files(self):
        self.theme("mine", {"schema": 1, "id": "mine", "name": "Mine", "layout": "ps4", "slots": {"wallpaper": "art/bg.jpg", "sounds": "sfx"}}, ["art/bg.jpg", "sfx/deck_ui_navigation.wav", "sfx/notes.txt"])
        t = next(t for t in data_themes.list_themes() if t["id"] == "mine")
        self.assertEqual(t["source"], "user")
        self.assertEqual(t["packs"]["sounds"]["files"], ["deck_ui_navigation.wav"])
        self.assertTrue(data_themes.resolve("mine", "art/bg.jpg").endswith(os.path.join("mine", "art", "bg.jpg")))

    def test_paths_never_leave_the_theme(self):
        self.theme("mine", {"schema": 1, "id": "mine", "name": "Mine", "layout": "ps4"}, ["a.png"])
        (Path(self.tmp.name) / "secret.txt").write_text("no")
        for bad in ["../secret.txt", "../../secret.txt", "/etc/passwd", "a/../../secret.txt", "", ".", "theme.json/../../secret.txt", "a\\..\\secret.txt"]:
            self.assertIsNone(data_themes.resolve("mine", bad), bad)
        self.assertIsNone(data_themes.resolve("nope", "a.png"))
        if hasattr(os, "symlink"):
            try:
                os.symlink(Path(self.tmp.name) / "secret.txt", self.user / "mine" / "link.png")
            except OSError as error:
                if getattr(error, "winerror", None) != 1314:
                    raise
                self.skipTest("Windows account lacks symlink privileges; traversal checks passed")
            self.assertIsNone(data_themes.resolve("mine", "link.png"))

    def test_bad_manifests_are_skipped(self):
        self.theme("a", {"schema": 2, "id": "a", "name": "A", "layout": "ps4"})
        self.theme("b", {"schema": 1, "id": "B!", "name": "B", "layout": "ps4"})
        (self.user / "c").mkdir()
        (self.user / "c" / "theme.json").write_text("{not json")
        ids = {t["id"] for t in data_themes.list_themes()}
        self.assertFalse({"a", "B!"} & ids)

    # ── theme zips (<runtime>/themes/*.zip and Quick Access → Add a theme from a file) ──
    def make_zip(self, path, files, prefix=""):
        with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
            for name, data in files.items():
                z.writestr(prefix + name, data)
        return path

    def frame_files(self, ident="zipped"):
        return {
            "theme.json": json.dumps({"schema": 1, "id": ident, "name": "Zipped", "layout": "frame", "frame": {"entry": "index.html"}, "slots": {"sounds": "sounds"}}),
            "index.html": "<!doctype html><script src=app.js></script>",
            "app.js": "parent.postMessage({dht:1,type:'ready',handles:[]},'*')",
            "sounds/deck_ui_navigation.wav": b"RIFF",
            "LICENSE": "CC0",
        }

    def test_zip_in_the_themes_folder_is_unpacked_and_served(self):
        self.make_zip(self.user / "My Theme.zip", self.frame_files(), prefix="my-theme/")  # zipped as a folder
        t = next(t for t in data_themes.list_themes() if t["id"] == "zipped")
        self.assertEqual(t["source"], "user")
        self.assertEqual(t["packs"]["sounds"]["files"], ["deck_ui_navigation.wav"])
        path = data_themes.resolve("zipped", "app.js")
        self.assertTrue(path and path.endswith(os.path.join(".unpacked", "My Theme", "app.js")), path)
        self.assertIsNone(data_themes.resolve("zipped", ".source"))
        # unchanged zip: not unpacked again; zip removed: its copy goes too
        stamp = os.path.getmtime(path)
        data_themes.list_themes()
        self.assertEqual(os.path.getmtime(path), stamp)
        (self.user / "My Theme.zip").unlink()
        self.assertNotIn("zipped", {t["id"] for t in data_themes.list_themes()})
        self.assertFalse((self.user / ".unpacked" / "My Theme").exists())

    def test_unsafe_zips_are_refused(self):
        bad = {
            "traversal": {**self.frame_files("a"), "../evil.js": "x"},
            "absolute": {**self.frame_files("b"), "/etc/evil.js": "x"},
            "program": {**self.frame_files("c"), "run.sh": "rm -rf ~"},
            "python": {**self.frame_files("d"), "main.py": "import os"},
            "hidden": {**self.frame_files("e"), ".git/config": "x"},
            "no-manifest": {"index.html": "x"},
            "bad-manifest": {"theme.json": "{\"schema\": 1, \"id\": \"Bad Id\"}"},
        }
        for name, files in bad.items():
            self.make_zip(self.user / f"{name}.zip", files)
        # a zip bomb: one highly compressible file far larger than its packed size allows
        with zipfile.ZipFile(self.user / "bomb.zip", "w", zipfile.ZIP_DEFLATED) as z:
            z.writestr("theme.json", self.frame_files("f")["theme.json"])
            z.writestr("big.json", b"0" * (8 * 1024 * 1024))
        # a symlink entry
        with zipfile.ZipFile(self.user / "link.zip", "w") as z:
            z.writestr("theme.json", self.frame_files("g")["theme.json"])
            info = zipfile.ZipInfo("secret.png")
            info.external_attr = (0o120777 << 16)
            z.writestr(info, "/etc/passwd")
        ids = {t["id"] for t in data_themes.list_themes()}
        self.assertFalse(set("abcdefg") & ids, ids)
        refused = {e["file"] for e in data_themes.zip_errors()}
        self.assertEqual(refused, {f"{n}.zip" for n in [*bad, "bomb", "link"]})
        self.assertFalse((Path(self.tmp.name) / "evil.js").exists())
        self.assertEqual([p.name for p in (self.user / ".unpacked").iterdir()] if (self.user / ".unpacked").exists() else [], [])

    def test_import_file_checks_then_copies(self):
        src = Path(self.tmp.name) / "Downloads"
        src.mkdir()
        good = self.make_zip(src / "Poster Wall.zip", self.frame_files("poster-wall"))
        r = data_themes.import_file(str(good))
        self.assertEqual((r["ok"], r["id"]), (True, "poster-wall"))
        self.assertTrue((self.user / "Poster Wall.zip").is_file())
        self.assertIn("poster-wall", {t["id"] for t in data_themes.list_themes()})
        evil = self.make_zip(src / "evil.zip", {**self.frame_files("evil"), "../../x.js": "x"})
        r = data_themes.import_file(str(evil))
        self.assertFalse(r["ok"])
        self.assertFalse((self.user / "evil.zip").exists())
        self.assertFalse(data_themes.import_file(str(src))["ok"])
        self.assertFalse(data_themes.import_file("/etc/passwd")["ok"])
        self.assertEqual([p.name for p in self.user.iterdir() if p.name.startswith(".check")], [])

    def test_frame_policy_blocks_network(self):
        csp = data_themes.frame_csp("http://127.0.0.1:1234/tok", "frame-test")
        self.assertIn("sandbox allow-scripts", csp)
        self.assertIn("connect-src 'none'", csp)
        self.assertIn("default-src 'none'", csp)
        self.assertIn("script-src http://127.0.0.1:1234/tok/t/frame-test/ ", csp)
        self.assertNotIn("allow-same-origin", csp)
        self.assertNotIn("https:", csp.replace("https://", ""))


if __name__ == "__main__":
    unittest.main()
