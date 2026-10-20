"""First-run flow: get_settings reports onboardingDone=False only when there is no settings file at all.
An existing file (an update) or a corrupt / unreadable one must never send the user through the welcome again."""
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


def load_plugin(settings_dir):
    fake = types.ModuleType("decky")
    fake.DECKY_PLUGIN_SETTINGS_DIR = settings_dir
    fake.DECKY_PLUGIN_DIR = str(ROOT)
    fake.DECKY_PLUGIN_RUNTIME_DIR = settings_dir
    fake.DECKY_PLUGIN_LOG_DIR = settings_dir
    fake.DECKY_USER_HOME = settings_dir
    fake.DECKY_HOME = settings_dir
    fake.logger = types.SimpleNamespace(**{k: (lambda *a, **k: None) for k in ("info", "error", "warning", "debug")})
    sys.modules["decky"] = fake
    for name, mod in list(sys.modules.items()):  # main and every py_modules file that captured another test's fake decky
        if name == "main" or os.path.realpath(str(getattr(mod, "__file__", "") or "/nonexistent")).startswith(str(ROOT / "py_modules")):
            sys.modules.pop(name, None)
    import main
    return main.Plugin()


class OnboardingSettingsTests(unittest.TestCase):
    def setUp(self):
        saved = snapshot_modules()
        self.addCleanup(restore_modules, saved)

    def run_get(self, content):
        with tempfile.TemporaryDirectory() as d:
            path = os.path.join(d, "settings.json")
            if content is not None:
                with open(path, "wb") as f:
                    f.write(content)
            return asyncio.run(load_plugin(d).get_settings())

    def test_fresh_install_shows_onboarding(self):
        self.assertIs(self.run_get(None)["onboardingDone"], False)

    def test_existing_settings_do_not(self):
        got = self.run_get(b'{"theme": "ps4"}')
        self.assertEqual(got, {"theme": "ps4", "explicitThemeDownloads": True})  # no flag: the front end treats a missing flag as done

    def test_corrupt_or_odd_files_do_not(self):
        for raw in (b"{not json", b"", b"[1, 2]", b"\xff\xfe\x00bad"):
            got = self.run_get(raw)
            self.assertTrue(got is None or got.get("onboardingDone") is not False, raw)


if __name__ == "__main__":
    unittest.main()
