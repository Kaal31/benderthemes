import importlib.util
import json
from pathlib import Path
import tempfile
import types
import sys
import unittest

ROOT = Path(__file__).resolve().parents[1]
sys.modules.setdefault("decky", types.SimpleNamespace())
spec = importlib.util.spec_from_file_location("theme_uninstall_tests", ROOT / "py_modules/theme_uninstall.py")
cleanup = importlib.util.module_from_spec(spec)
spec.loader.exec_module(cleanup)


class UninstallTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.home = Path(self.temp.name)
        self.settings = self.home / "settings/ThemeHub"
        self.runtime = self.home / "data/ThemeHub"
        self.settings.mkdir(parents=True)
        self.runtime.mkdir(parents=True)
        self.original = cleanup.decky
        cleanup.decky = types.SimpleNamespace(DECKY_HOME=str(self.home),
            DECKY_PLUGIN_SETTINGS_DIR=str(self.settings), DECKY_PLUGIN_RUNTIME_DIR=str(self.runtime))
        self.addCleanup(setattr, cleanup, "decky", self.original)

    def test_removes_packs_imports_and_caches_preserves_exact_settings(self):
        preferences = '{"theme":"x360","footer":"hide"}'
        (self.settings / "settings.json").write_text(preferences)
        (self.settings / "theme-packs/x360").mkdir(parents=True)
        (self.settings / "theme-packs/x360/art.png").write_bytes(b"art")
        (self.settings / "plugin-releases-cache.json").write_text('{}')
        (self.runtime / "skins").mkdir()
        (self.runtime / "skins/import.zip").write_bytes(b"skin")
        cleanup.cleanup()
        self.assertEqual((self.settings / "settings.json").read_text(), preferences)
        self.assertEqual([p.name for p in self.settings.iterdir()], ["settings.json"])
        self.assertFalse(self.runtime.exists())
        cleanup.cleanup()  # repeated uninstall is harmless

    def test_only_recorded_shared_resources_removed(self):
        for name in ("owned", "other-plugin"):
            (self.home / "sounds" / name).mkdir(parents=True)
        cleanup.record_shared("sounds", "owned")
        cleanup.cleanup()
        self.assertFalse((self.home / "sounds/owned").exists())
        self.assertTrue((self.home / "sounds/other-plugin").is_dir())

    def test_refuses_broad_root(self):
        cleanup.decky.DECKY_PLUGIN_RUNTIME_DIR = str(self.home)
        with self.assertRaises(ValueError):
            cleanup.cleanup()
        self.assertTrue(self.settings.exists())

    def test_malformed_shared_paths_do_not_escape(self):
        outside = self.home / "keep"
        outside.write_text("keep")
        (self.settings / "owned-shared.json").write_text(json.dumps([["sounds", "../keep"], ["unknown", "keep"]]))
        cleanup.cleanup()
        self.assertEqual(outside.read_text(), "keep")
