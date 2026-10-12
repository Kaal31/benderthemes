"""Theme files shipped in the plugin (defaults/skins/<kind>, e.g. a private test build) are listed and read in place:
read-only, never copied into the user's folder, and a user's file of the same name wins."""
import asyncio, os, sys, tempfile, types, unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "py_modules"))
sys.path.insert(0, str(ROOT))


def snapshot_modules():
    """sys.modules as it is now; restore_modules() puts it back, so a test that installs its own fake `decky`
    (and re-imports main / py_modules against it) cannot leak that into the other test files of one process
    (`python -m unittest discover -s tests`)."""
    return dict(sys.modules)


def restore_modules(saved):
    for name in [n for n in sys.modules if n not in saved]:
        del sys.modules[name]
    sys.modules.update(saved)


def load(plugin_dir, data_dir):
    fake = types.ModuleType("decky")
    fake.DECKY_PLUGIN_DIR = plugin_dir
    for k in ("DECKY_PLUGIN_SETTINGS_DIR", "DECKY_PLUGIN_RUNTIME_DIR", "DECKY_PLUGIN_LOG_DIR", "DECKY_USER_HOME", "DECKY_HOME"):
        setattr(fake, k, data_dir)
    fake.logger = types.SimpleNamespace(**{k: (lambda *a, **k: None) for k in ("info", "error", "warning", "debug")})
    sys.modules["decky"] = fake
    for name, mod in list(sys.modules.items()):  # modules that captured an earlier fake decky
        # real paths: another test may have put "tests/../py_modules" on sys.path, which would never match a plain prefix
        if name == "main" or os.path.realpath(str(getattr(mod, "__file__", "") or "/nonexistent")).startswith(str(ROOT / "py_modules")):
            sys.modules.pop(name, None)
    import main
    return main


def write(path, data=b"x"):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "wb") as f:
        f.write(data)


class BundledSkinsTests(unittest.TestCase):
    def setUp(self):
        saved = snapshot_modules()
        self.addCleanup(restore_modules, saved)
        self.tmp = tempfile.TemporaryDirectory()
        self.plugin = os.path.join(self.tmp.name, "plugin")
        self.data = os.path.join(self.tmp.name, "data")
        self.main = load(self.plugin, self.data)
        self.bundled = os.path.join(self.plugin, "defaults", "skins")
        self.user = os.path.join(self.data, "skins")

    def tearDown(self):
        self.tmp.cleanup()

    def test_merge_and_user_wins(self):
        write(os.path.join(self.bundled, "wii", "A.mym"), b"bundled")
        write(os.path.join(self.bundled, "wii", "B.mym"), b"bundled")
        write(os.path.join(self.bundled, "xbox", "Skin", "skin.xml"), b"<skin/>")
        write(os.path.join(self.user, "wii", "B.mym"), b"mine")
        write(os.path.join(self.user, "wii", "C.mym"), b"mine")
        entries = dict(self.main._skin_entries("wii"))
        self.assertEqual(sorted(entries), ["A.mym", "B.mym", "C.mym"])
        self.assertTrue(entries["A.mym"].startswith(self.bundled))
        self.assertTrue(entries["B.mym"].startswith(self.user))     # the user's own file wins
        self.assertTrue(self.main._skin_path("xbox", "Skin").startswith(self.bundled))
        self.assertTrue(self.main._skin_path("wii", "../../etc/passwd").endswith(os.path.join("wii", "passwd")))

    def test_wiiu_list_and_main_do_not_copy(self):
        write(os.path.join(self.bundled, "wiiu", "T.utheme"))
        write(os.path.join(self.bundled, "wiiu", "notes.txt"))
        P = self.main.Plugin()
        asyncio.run(P._main())
        self.assertEqual(asyncio.run(P.list_wiiu_themes())["themes"], ["T.utheme"])
        self.assertEqual(os.listdir(os.path.join(self.user, "wiiu")), [])   # nothing copied into the user's folder

    def test_switch_folders_merge(self):
        import switch_themes
        write(os.path.join(self.bundled, "switch", "Bundled", "Menu.nxtheme"))
        write(os.path.join(self.bundled, "switch", "Same", "Menu.nxtheme"))
        write(os.path.join(self.user, "switch", "Same", "Menu.nxtheme"))

        def scan(folder, cache=None):
            return [{"id": n, "name": n.split("/")[0], "author": "", "files": {"home": n}, "primary": n} for n in switch_themes._list_files(folder)]
        old = switch_themes.scan_folder
        switch_themes.scan_folder = scan
        try:
            got = [t["name"] for t in self.main._switch_list()]
        finally:
            switch_themes.scan_folder = old
        self.assertEqual(sorted(got), ["Bundled", "Same"])   # the bundled "Same" is hidden behind the user's
        self.assertEqual(self.main._switch_folders()[0][0], os.path.join(self.user, "switch"))


if __name__ == "__main__":
    unittest.main()
