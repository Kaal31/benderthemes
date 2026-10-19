import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import types
import unittest
from unittest.mock import patch
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "tools"))
from channel_build import identity, manifest


class ChannelBuildTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.data = identity("1.10.9", "experimental", 12, 2, "a" * 40)

    def package(self):
        (self.root / "out").mkdir(exist_ok=True)
        (self.root / "release-channel.json").write_text(json.dumps(self.data))
        (self.root / "asset-catalog.json").write_text('{"schema":1}')
        with zipfile.ZipFile(self.root / "out" / self.data["assetName"], "w") as z:
            z.writestr("DeckHomeThemes/release-channel.json", json.dumps(self.data))
            z.writestr("DeckHomeThemes/package.json", '{"version":"1.10.9"}')
            z.writestr("DeckHomeThemes/theme-catalog.json", '{"schema":1}')

    def test_numbered_builds_and_retries_have_distinct_tags(self):
        self.assertEqual(self.data["tag"], "experimental-v1.10.9-12-2")
        self.assertNotEqual(self.data["tag"], identity("1.10.9", "experimental", 12, 1, "a" * 40)["tag"])
        self.assertNotIn("latest", self.data["assetUrl"])

    def test_reject_invalid_identity(self):
        for values in [("1.10.9-beta", "experimental", 1, 1, "a" * 40), ("1.10.9", "../beta", 1, 1, "a" * 40), ("1.10.9", "experimental", 0, 1, "a" * 40), ("1.10.9", "experimental", 1, 1, "bad")]:
            with self.assertRaises(ValueError):
                identity(*values)

    def test_manifest_matches_installable_zip(self):
        self.package()
        result = manifest(self.root)
        self.assertEqual(result["channel"], "experimental")
        self.assertEqual(len(result["sha256"]), 64)
        self.assertGreater(result["size"], 0)
        self.assertEqual(json.loads((self.root / "out/channel-release.json").read_text()), result)
        (self.root / "asset-catalog.json").write_text('{"schema":2}')
        with self.assertRaises(ValueError):
            manifest(self.root)

    def test_build_metadata_keeps_shared_asset_source_unchanged(self):
        fake = types.SimpleNamespace(DECKY_PLUGIN_DIR=str(self.root))
        spec = importlib.util.spec_from_file_location("channel_asset_source", ROOT / "py_modules/asset_source.py")
        source = importlib.util.module_from_spec(spec)
        with patch.dict(sys.modules, {"decky": fake}):
            spec.loader.exec_module(source)
        self.assertIn("/beta-catalog/", source.catalog_url())
        self.assertIn("/ps4-v1.0.0/", source.pack_url("ps4", "1.0.0", "test.zip"))
        (self.root / "release-channel.json").write_text(json.dumps(self.data))
        self.assertIn("/beta-catalog/", source.catalog_url())
        self.assertIn("/ps4-v1.0.0/", source.pack_url("ps4", "1.0.0", "test.zip"))
        self.data["tag"] = "../../other"
        (self.root / "release-channel.json").write_text(json.dumps(self.data))
        self.assertIn("/beta-catalog/", source.catalog_url())

    def test_workflow_reuses_published_assets_without_asset_writes(self):
        beta = (ROOT / ".github/workflows/beta.yml").read_text()
        experimental = (ROOT / ".github/workflows/experimental.yml").read_text()
        for line in beta.splitlines():
            if line.strip().startswith("- run:") and "package" not in line:
                if "verify-audio-packaging.py" not in line:
                    self.assertIn(line, experimental)
        self.assertIn("branches: [experimental]", experimental)
        self.assertIn("USE_PUBLISHED_ASSETS: '1'", experimental)
        self.assertIn("SKIP_THEME_PACK_BUILD: '1'", experimental)
        self.assertNotIn("publish_assets.py", experimental)
        self.assertNotIn("package_themes.py", experimental)
        self.assertNotIn("ASSETS_PUBLISH_TOKEN", experimental)
        self.assertNotIn("git push", experimental)
        self.assertNotIn("experimental-latest", experimental)


if __name__ == "__main__":
    unittest.main()
