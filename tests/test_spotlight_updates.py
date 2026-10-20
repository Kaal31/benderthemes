import io
import json
import sys
import tempfile
import time
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import spotlight_updates as updates


class SpotlightUpdatesTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.plugins = self.root / "plugins"
        self.folder = self.plugins / "fixture"
        self.folder.mkdir(parents=True)
        self.cache = self.root / "cache"
        self.source = {"repo": "owner/fixture", "name": "Fixture", "authors": ["Author"], "asset": "fixture.zip"}
        self.manifest = {"name": "Fixture", "author": "Author", "flags": []}
        updates.write(self.folder / "plugin.json", self.manifest)
        updates.write(self.folder / "package.json", {"name": "fixture", "version": "1.0.0"})
        self.patcher = patch.object(updates, "sources", return_value=[self.source])
        self.patcher.start()
        self.addCleanup(self.patcher.stop)
        self.calls = []

    def archive(self, name="Fixture", author="Author", version="1.1.0", built=True):
        raw = io.BytesIO()
        with zipfile.ZipFile(raw, "w") as z:
            z.writestr("fixture/plugin.json", json.dumps({"name": name, "author": author, "flags": ["root"]}))
            z.writestr("fixture/package.json", json.dumps({"version": version}))
            if built:
                z.writestr("fixture/dist/index.js", "")
        return raw.getvalue()

    def fetch(self, url, limit):
        self.calls.append(url)
        if "api.github.com" in url:
            return json.dumps([{"tag_name": "v1.0.0", "assets": [{"name": "fixture.zip", "browser_download_url": "https://github.com/owner/fixture/releases/download/v1.0.0/fixture.zip"}]}]).encode()
        return self.archive()

    def status(self, **kwargs):
        return updates.status(self.cache, self.plugins, fetch=self.fetch, now=time.time, **kwargs)

    def test_updates_use_zip_version_and_deckyup_metadata(self):
        row = self.status()["plugins"][0]
        self.assertEqual(row["version"], "1.1.0")  # tag is intentionally different
        self.assertTrue(row["updateAvailable"])
        self.assertTrue(row["root"])
        self.assertEqual(updates.read(self.folder / "plugin.json")["repository"], "https://github.com/owner/fixture")
        self.status()
        self.assertEqual(len(self.calls), 2)

    def test_underscore_root_flag(self):
        self.manifest["flags"] = ["_root"]
        updates.write(self.folder / "plugin.json", self.manifest)
        self.assertTrue(updates.installed(self.plugins, [self.source])[0]["root"])

    def test_deckyup_install_updates_are_detected(self):
        self.status()
        updates.write(self.folder / "package.json", {"version": "1.1.0"})
        self.assertFalse(self.status()["updateAvailable"])

    def test_no_downgrade(self):
        updates.write(self.folder / "package.json", {"version": "9.0.0"})
        self.assertFalse(self.status()["updateAvailable"])

    def test_deckyup_detection_preserves_updates_and_tracks_removal(self):
        folder = self.plugins / "renamed-updater-folder"
        folder.mkdir()
        updates.write(folder / "plugin.json", {"name": "Decky Direct Updater", "author": "nukeador"})
        value = self.status()
        self.assertTrue(value["deckyUpInstalled"])
        self.assertTrue(value["updateAvailable"])
        (folder / "plugin.json").unlink()
        self.assertFalse(self.status()["deckyUpInstalled"])

    def test_similar_plugin_does_not_suppress_prompts(self):
        updates.write(self.folder / "plugin.json", {"name": "Decky Direct Updater", "author": "Someone else"})
        self.assertFalse(self.status()["deckyUpInstalled"])

    def test_semver_prerelease_ordering(self):
        versions = ["1.0.0-alpha.1", "1.0.0-alpha.2", "1.0.0-alpha.10", "1.0.0-beta", "1.0.0", "1.0.1"]
        self.assertEqual(sorted(versions, key=updates.version_key), versions)
        self.assertEqual(updates.version_key("1.0.0+build.1"), updates.version_key("v1.0.0"))

    def test_tag_prefix_ignores_app_releases(self):
        def fetch(url, limit):
            if "matching-refs" in url:
                return json.dumps([{"ref": "refs/tags/decky-v1.0.0"}]).encode()
            if "/releases/tags/" in url:
                release = json.loads(self.fetch("https://api.github.com", limit))[0]
                release.update(tag_name="decky-v1.0.0", prerelease=True)
                return json.dumps(release).encode()
            return self.archive()
        plugin = {**self.source, "author": "Author", "currentVersion": "1.0.0", "tagPrefix": "decky-v", "prerelease": True}
        self.assertEqual(updates.latest(plugin, fetch)["version"], "1.1.0")

    def test_conflicting_sources_and_other_authors_are_not_tracked(self):
        updates.write(self.folder / "package.json", {"version": "1.0.0", "repository": "https://github.com/fork/fixture"})
        self.assertEqual(self.status()["plugins"], [])
        self.assertEqual(self.calls, [])
        updates.write(self.folder / "package.json", {"version": "1.0.0"})
        updates.write(self.folder / "plugin.json", {**self.manifest, "author": "Other"})
        self.assertEqual(self.status()["plugins"], [])

    def test_symlinks_are_ignored(self):
        with patch.object(Path, "is_symlink", return_value=True):
            self.assertEqual(self.status()["plugins"], [])

    def test_invalid_or_foreign_packages_are_rejected(self):
        plugin = {**self.source, "author": "Author"}
        for raw in (self.archive(name="Other"), self.archive(author="Other"), self.archive(built=False)):
            with self.assertRaises(ValueError):
                updates.inspect_zip(raw, plugin)
        bad = self.fetch("https://api.github.com", 100000).replace(b"owner/fixture/releases", b"attacker/fixture/releases")
        with self.assertRaises(ValueError):
            updates.latest({**plugin, "currentVersion": "1.0.0"}, lambda url, limit: bad)

    def test_offline_refresh_does_not_offer_stale_update(self):
        self.status()
        def offline(url, limit):
            raise OSError("Offline")
        value = updates.status(self.cache, self.plugins, refresh=True, fetch=offline)
        self.assertFalse(value["updateAvailable"])
        self.assertIn("Offline", value["plugins"][0]["error"])

    def test_recorded_explorer_source_survives_restart(self):
        with patch.object(updates, "sources", return_value=[]):
            self.assertTrue(updates.remember(self.cache, "owner/fixture", "Fixture", "Author", "https://github.com/owner/fixture/releases/download/v1/fixture.zip")["success"])
            self.assertEqual(self.status()["plugins"][0]["name"], "Fixture")
        self.assertFalse(updates.remember(self.cache, "owner/fixture", "Fixture", "Author", "https://github.com/other/fixture/releases/download/v1/fixture.zip")["success"])

    def test_prepare_rechecks_install_and_rejects_changed_url(self):
        row = self.status()["plugins"][0]
        with patch.object(updates, "download", self.fetch):
            self.assertTrue(updates.prepare(self.cache, self.plugins, row["id"], row["version"], row["zipUrl"])["success"])
            self.assertFalse(updates.prepare(self.cache, self.plugins, row["id"], row["version"], row["zipUrl"] + "?other")["success"])
            updates.write(self.folder / "package.json", {"version": "1.1.0"})
            self.assertFalse(updates.prepare(self.cache, self.plugins, row["id"], row["version"], row["zipUrl"])["success"])


if __name__ == "__main__":
    unittest.main()
