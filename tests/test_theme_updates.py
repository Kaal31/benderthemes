import asyncio
import importlib.util
import io
import json
import logging
from pathlib import Path
import sys
import tempfile
import time
import types
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "py_modules"))
sys.modules["decky"] = types.SimpleNamespace(logger=logging.getLogger("test"))
import theme_updates as updates


def release(version, **extra):
    return {"tag_name": "v" + version, "assets": [{
        "name": f"DeckHomeThemes-v{version}.zip", "browser_download_url": updates.asset_url(version)
    }], **extra}


class UpdateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        updates.decky.DECKY_PLUGIN_DIR = str(self.root)
        updates.decky.DECKY_PLUGIN_SETTINGS_DIR = str(self.root / "settings")
        (self.root / "package.json").write_text('{"version":"1.9.9"}')

    def test_numeric_sort_and_only_real_numbered_packages(self):
        raw = [release("1.9.9"), release("1.10.0"), release("1.9.10"),
               release("2.0.0", draft=True), release("3.0.0", prerelease=True),
               release("4.0.0", assets=[]), {"tag_name": "main-latest"}]
        bad = release("5.0.0")
        bad["assets"][0]["browser_download_url"] = "https://example.com/file.zip"
        self.assertEqual([r["version"] for r in updates.normalise(raw + [bad])], ["1.10.0", "1.9.10", "1.9.9"])

    def test_check_cache_and_offline_are_distinct(self):
        response = io.BytesIO(json.dumps([release("1.9.10")]).encode())
        with patch.object(updates, "urlopen", return_value=response):
            result = updates.status()
        self.assertTrue(result["success"])
        self.assertTrue(result["updateAvailable"])
        with patch.object(updates, "urlopen", side_effect=OSError("offline")):
            cached = updates.status()
        self.assertFalse(cached["success"])
        self.assertTrue(cached["stale"])
        self.assertEqual(cached["latest"]["version"], "1.9.10")

    def test_current_and_newer_local_version_are_not_updates(self):
        for version in ("1.9.9", "1.9.8"):
            with patch.object(updates, "urlopen", return_value=io.BytesIO(json.dumps([release(version)]).encode())):
                self.assertFalse(updates.status()["updateAvailable"])

    def test_pagination(self):
        first = [release("1.9.9")] * 100
        responses = [io.BytesIO(json.dumps(first).encode()), io.BytesIO(json.dumps([release("1.9.10")]).encode())]
        with patch.object(updates, "urlopen", side_effect=responses) as fetch:
            self.assertEqual(updates.status()["latest"]["version"], "1.9.10")
            self.assertEqual(fetch.call_count, 2)

    def test_rejects_url_and_version_mismatch_and_expired_marker(self):
        for url in ("https://example.com/a.zip", updates.asset_url("1.9.8"), updates.asset_url("1.9.9") + "?other=1"):
            self.assertFalse(updates.prepare_replacement("1.9.9", url)["success"])
        self.assertTrue(updates.prepare_replacement("1.9.9", updates.asset_url("1.9.9"))["success"])
        self.assertTrue(updates.replacement_pending())
        with patch.object(updates.time, "time", return_value=time.time() + 301):
            self.assertFalse(updates.replacement_pending())

    def test_updater_and_manual_reinstall_both_preserve_settings(self):
        spec = importlib.util.spec_from_file_location("themes_backend", ROOT / "main.py")
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        settings = self.root / "settings/settings.json"
        settings.parent.mkdir()
        settings.write_text('{"theme":"minecraft"}')
        updates.prepare_replacement("1.9.10", updates.asset_url("1.9.10"))
        asyncio.run(module.Plugin()._uninstall())
        self.assertEqual(json.loads(settings.read_text()), {"theme": "minecraft"})
        updates.clear_replacement()
        asyncio.run(module.Plugin()._uninstall())
        self.assertEqual(json.loads(settings.read_text()), {"theme": "minecraft"})


if __name__ == "__main__":
    unittest.main()
