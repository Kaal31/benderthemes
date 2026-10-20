import hashlib
import io
import json
from pathlib import Path
import sys
import tempfile
import types
import unittest
from unittest.mock import patch
from urllib.error import HTTPError
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "py_modules"))
sys.modules.setdefault("decky", types.SimpleNamespace())
import community_themes as community
import data_themes


def archive(files):
    out = io.BytesIO()
    with zipfile.ZipFile(out, "w", zipfile.ZIP_DEFLATED) as z:
        for name, content in files.items():
            z.writestr(name, json.dumps(content) if isinstance(content, dict) else content)
    return out.getvalue()


class CommunityThemes(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = Path(self.tmp.name)
        community.decky.DECKY_PLUGIN_RUNTIME_DIR = str(self.root / "runtime")
        community.decky.DECKY_PLUGIN_SETTINGS_DIR = str(self.root / "settings")
        community.decky.logger = types.SimpleNamespace(warning=lambda *a: None)
        import theme_store
        store_paths = patch.dict(vars(theme_store.decky), {
            "DECKY_PLUGIN_DIR": self.tmp.name,
            "DECKY_PLUGIN_RUNTIME_DIR": self.tmp.name,
            "DECKY_PLUGIN_SETTINGS_DIR": str(Path(self.tmp.name) / "settings"),
        })
        store_paths.start()
        self.addCleanup(store_paths.stop)
        data_themes._cache.clear()
        self.version = patch.object(community, "current_version", return_value="1.10.8")
        self.version.start()
        self.repo = "alice/themes"
        self.commit = "a" * 40
        self.api = f"https://api.github.com/repos/{self.repo}"
        self.responses = {self.api: {"default_branch": "main", "name": "Themes"},
                          self.api + "/commits/main": {"sha": self.commit}}
        self.catalog_url = f"https://raw.githubusercontent.com/{self.repo}/{self.commit}/themehub-catalog.json"

    def tearDown(self):
        self.version.stop()
        self.tmp.cleanup()

    def network(self, repo, url, dest=None, expected_size=None, sha256=None):
        value = self.responses.get(url)
        if value is None:
            raise HTTPError(url, 404, "Not found", {}, None)
        if isinstance(value, Exception):
            raise value
        if dest:
            if expected_size is not None and len(value) != expected_size:
                raise ValueError("size mismatch")
            if sha256 and hashlib.sha256(value).hexdigest() != sha256:
                raise ValueError("checksum mismatch")
            Path(dest).write_bytes(value)
            return None
        return value

    def package(self, ident="neon", version="1.0.0", files=None):
        files = files or {"theme.json": {"schema": 1, "id": "neon", "name": "Neon", "layout": "frame", "frame": {"entry": "index.html"}}, "index.html": "<h1>Neon</h1>"}
        payload = archive(files)
        url = f"https://github.com/{self.repo}/releases/download/v{version}/{ident}.zip"
        self.responses[url] = payload
        return {"id": ident, "name": ident, "version": version, "minPluginVersion": "1.10.8", "size": len(payload), "sha256": hashlib.sha256(payload).hexdigest(), "url": url}

    def add_catalog(self, themes=None, assets=None):
        self.responses[self.catalog_url] = {"schema": 1, "themes": themes or [self.package()], "assets": assets or []}
        community.source_action(self.repo, "add")

    def test_repository_input_and_network_boundaries(self):
        self.assertEqual(community.repository("https://github.com/Alice/Themes.git/"), self.repo)
        for value in ("alice/themes/tree/main", "http://github.com/alice/themes", "alice/..", "alice/themes?token=x", "https://evil.test/alice/themes"):
            with self.assertRaises(ValueError):
                community.repository(value)
        for url in ("http://github.com/alice/themes/releases/download/v1/a.zip", "https://github.com/bob/themes/releases/download/v1/a.zip", "https://github.com.evil.test/alice/themes/releases/download/v1/a.zip", "https://localhost/a.zip", "https://github.com:444/alice/themes/releases/download/v1/a.zip"):
            self.assertFalse(community._allowed(url, self.repo))
        self.assertFalse(community._allowed("https://release-assets.githubusercontent.com/a", self.repo))
        self.assertTrue(community._allowed("https://release-assets.githubusercontent.com/a", self.repo, True))
        self.assertTrue(community._allowed(self.api, self.repo))
        with self.assertRaises(ValueError):
            community._Redirect(self.repo).redirect_request(None, None, 302, "", {}, "https://127.0.0.1/private")

    def test_real_download_checks_stream_size_and_checksum(self):
        url = f"https://github.com/{self.repo}/releases/download/v1/theme.zip"
        class Opener:
            def open(self, *args, **kwargs):
                return io.BytesIO(b"abcdef")
        with patch.object(community, "build_opener", return_value=Opener()):
            dest = self.root / "download.zip"
            community._fetch(self.repo, url, dest, 6, hashlib.sha256(b"abcdef").hexdigest())
            self.assertEqual(dest.read_bytes(), b"abcdef")
            for size, sha in ((5, None), (7, None), (6, "0" * 64)):
                with self.assertRaises(ValueError):
                    community._fetch(self.repo, url, dest, size, sha)
            with patch.object(data_themes, "ZIP_MAX_BYTES", 3), self.assertRaises(ValueError):
                community._fetch(self.repo, url, dest)

    def test_install_assets_update_rollback_remove_and_isolation(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            theme = self.package()
            music = self.package("music", files={"asset-pack.json": {"schema": 1, "id": "music", "version": "1.0.0"}, "song.mp3": b"audio"})
            theme["assets"] = ["music"]
            self.add_catalog([theme], [music])
            result = community.package_action(self.repo, "neon", "install")
            theme_id = result["themeId"]
            self.assertNotEqual(theme_id, community._theme_id("bob/themes", "neon"))
            self.assertNotEqual(theme_id, "neon")
            listed = {t["id"] for t in data_themes.list_themes()}
            self.assertIn(theme_id, listed)
            self.assertEqual(Path(data_themes.resolve(theme_id, "assets/music/song.mp3")).read_bytes(), b"audio")
            with self.assertRaises(ValueError):
                community.source_action(self.repo, "remove")
            self.add_catalog([self.package(version="1.1.0")])
            self.assertTrue(community.listing()["sources"][0]["themes"][0]["updateAvailable"])
            community.package_action(self.repo, "neon", "install")
            community.package_action(self.repo, "neon", "rollback")
            self.assertEqual(community._installed(self.repo, "neon")["version"], "1.0.0")
            self.assertTrue(data_themes.resolve(theme_id, "assets/music/song.mp3"))
            community.package_action(self.repo, "neon", "remove")
            self.assertIsNone(data_themes.resolve(theme_id, "index.html"))
            community.source_action(self.repo, "remove")
            self.assertEqual(community.listing()["sources"], [])

    def test_no_catalog_single_release_theme(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            pack = self.package()
            self.responses[self.api + "/releases/latest"] = {"tag_name": "v1.0.0", "assets": [{"id": 123, "name": "theme.zip", "size": pack["size"], "browser_download_url": pack["url"], "digest": "sha256:" + pack["sha256"]}]}
            community.source_action(self.repo, "add")
            result = community.listing()["sources"][0]
            self.assertEqual(result["mode"], "single")
            self.assertEqual(len(result["themes"]), 1)
            self.assertTrue(community.package_action(self.repo, "theme", "install")["ok"])

    def test_no_catalog_repository_root_and_ambiguous_release(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            manifest = {"schema": 1, "id": "root-theme", "name": "Root", "layout": "ps4"}
            self.responses[f"https://raw.githubusercontent.com/{self.repo}/{self.commit}/theme.json"] = manifest
            self.responses[self.api + "/zipball/" + self.commit] = archive({"alice-themes-sha/theme.json": manifest, "alice-themes-sha/bg.png": b"image"})
            community.source_action(self.repo, "add")
            community.package_action(self.repo, "theme", "install")
            self.assertEqual(community._installed(self.repo, "theme")["version"], self.commit[:12])
            self.responses[self.api + "/releases/latest"] = {"assets": [{"name": "a.zip"}, {"name": "b.zip"}]}
            with self.assertRaisesRegex(ValueError, "Multiple release ZIPs"):
                community.discover(self.repo)

    def test_missing_theme_and_bad_catalog_do_not_fall_back(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            with self.assertRaisesRegex(ValueError, "No theme found"):
                community.source_action(self.repo, "add")
            self.responses[self.catalog_url] = {"schema": 99, "themes": []}
            with self.assertRaisesRegex(ValueError, "Unsupported community catalog"):
                community.source_action(self.repo, "add")
            self.responses[self.catalog_url] = HTTPError(self.catalog_url, 500, "Error", {}, None)
            with self.assertRaises(HTTPError):
                community.discover(self.repo)

    def test_offline_refresh_preserves_catalog_and_removed_upstream_installs(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            self.add_catalog()
            community.package_action(self.repo, "neon", "install")
            self.responses[self.api] = OSError("offline")
            result = community.source_action(self.repo, "refresh")["sources"][0]
            self.assertIn("showing saved catalog", result["error"])
            self.assertEqual(result["themes"][0]["installedVersion"], "1.0.0")
            self.responses[self.api] = {"default_branch": "main"}
            self.add_catalog([self.package("different")])
            self.assertIn("neon", [p["id"] for p in community.listing()["sources"][0]["themes"]])

    def test_failed_update_keeps_current_and_progress_finishes(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            self.add_catalog()
            community.package_action(self.repo, "neon", "install")
            bad = self.package(version="1.1.0", files={"theme.json": {"schema": 1, "id": "neon", "name": "Bad", "layout": "frame", "frame": {"entry": "missing.html"}}})
            self.add_catalog([bad])
            with self.assertRaisesRegex(ValueError, "compiled HTML"):
                community.package_action(self.repo, "neon", "install")
            self.assertEqual(community._installed(self.repo, "neon")["version"], "1.0.0")
            self.assertFalse(community.progress()["busy"])
            self.responses[bad["url"]] += b"corrupt"
            with self.assertRaises(ValueError):
                community.package_action(self.repo, "neon", "install")
            self.assertEqual(community._installed(self.repo, "neon")["version"], "1.0.0")

    def test_catalog_validation(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            base = self.package()
            for changes in ({"url": "https://github.com/bob/themes/releases/download/v1/a.zip"}, {"sha256": "bad"}, {"size": True}, {"assets": ["missing"]}, {"version": "latest"}):
                self.responses[self.catalog_url] = {"schema": 1, "themes": [{**base, **changes}]}
                with self.assertRaises(ValueError):
                    community.discover(self.repo)
            self.responses[self.catalog_url] = {"schema": 1, "themes": [base, base]}
            with self.assertRaisesRegex(ValueError, "Duplicate"):
                community.discover(self.repo)

    def test_sdk_requirement_and_repository_preview(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            theme = self.package()
            theme["minSdkVersion"] = 2
            theme["preview"] = f"https://raw.githubusercontent.com/{self.repo}/{self.commit}/preview.png"
            self.add_catalog([theme])
            listed = community.listing()["sources"][0]["themes"][0]
            self.assertFalse(listed["compatible"])
            self.assertEqual(listed["preview"], theme["preview"])
            with self.assertRaisesRegex(ValueError, "Update ThemeHub"):
                community.package_action(self.repo, "neon", "install")
            for invalid in ("https://evil.test/preview.png", "https://raw.githubusercontent.com/bob/themes/main/p.png", "https://raw.githubusercontent.com/alice/themes/main/page.html"):
                theme["preview"] = invalid
                self.responses[self.catalog_url] = {"schema": 1, "themes": [theme]}
                with self.assertRaises(ValueError):
                    community.discover(self.repo)

    def test_asset_code_and_zip_traversal_rejected(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            theme = self.package()
            for extra in ({"evil.js": "alert(1)"}, {"../escape.png": b"bad"}, {"theme.json": {"schema": 1}}):
                asset = self.package("media", files={"asset-pack.json": {"schema": 1, "id": "media", "version": "1.0.0"}, **extra})
                theme["assets"] = ["media"]
                self.add_catalog([theme], [asset])
                with self.assertRaises(ValueError):
                    community.package_action(self.repo, "neon", "install")
                self.assertFalse(community._installed(self.repo, "neon"))

    def test_compatibility_and_combined_asset_limit(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            theme = self.package()
            theme["minPluginVersion"] = "99.0.0"
            self.add_catalog([theme])
            self.assertFalse(community.listing()["sources"][0]["themes"][0]["compatible"])
            with self.assertRaisesRegex(ValueError, "Update ThemeHub"):
                community.package_action(self.repo, "neon", "install")
            self.add_catalog()
            with patch.object(data_themes, "ZIP_MAX_FILES", 2), self.assertRaisesRegex(ValueError, "combined"):
                community.package_action(self.repo, "neon", "install")

    def test_interrupted_update_recovery(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            self.add_catalog()
            community.package_action(self.repo, "neon", "install")
            key = community._key(self.repo, "neon")
            current = community._root() / "current" / key
            previous = community._root() / "previous" / key
            current.rename(previous)
            community.recover()
            self.assertTrue(current.is_dir())
            self.assertFalse(previous.exists())
            current.rename(previous.with_name(key + ".swap"))
            community.recover()
            self.assertTrue(current.is_dir())

    def test_native_installs_directly_and_shows_ui_overhaul_badge(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            files = {"theme.json": {"schema": 1, "id": "native-demo", "name": "Native Demo", "layout": "native", "native": {"api": 1, "entry": "native.js"}, "nativeInstalled": True, "nativeSha256": "0" * 64},
                     "native.js": "return {Home: function Home(){ return host.React.createElement('h1', null, 'Native'); }};"}
            self.add_catalog([self.package(files=files)])
            installed = community.package_action(self.repo, "neon", "install")
            self.assertTrue(installed["ok"])
            self.assertFalse(community.progress()["busy"])
            self.assertTrue(community.listing()["sources"][0]["themes"][0]["uiOverhaul"])
            theme = next(t for t in data_themes.list_themes() if t["id"] == installed["themeId"])
            self.assertTrue(theme["nativeInstalled"])
            self.assertEqual(theme["nativeSha256"], hashlib.sha256(files["native.js"].encode()).hexdigest())
            files["native.js"] += "\n// updated code"
            self.add_catalog([self.package(version="1.1.0", files=files)])
            changed = community.package_action(self.repo, "neon", "install")
            self.assertTrue(changed["ok"])
            self.assertEqual(community._installed(self.repo, "neon")["version"], "1.1.0")

    def test_local_manifest_cannot_self_approve_native_execution(self):
        folder = Path(data_themes.user_root()) / "untrusted"
        folder.mkdir(parents=True)
        (folder / "theme.json").write_text(json.dumps({"schema": 1, "id": "untrusted", "name": "Untrusted", "layout": "native", "native": {"api": 1, "entry": "native.js"}, "nativeInstalled": True, "nativeSha256": "a" * 64}))
        theme = next(t for t in data_themes.list_themes() if t["id"] == "untrusted")
        self.assertFalse(theme["nativeInstalled"])

    def test_periodic_and_forced_update_checks_never_install(self):
        with patch.object(community, "_fetch", side_effect=self.network) as network:
            self.add_catalog()
            community.package_action(self.repo, "neon", "install")
            before = network.call_count
            self.responses[self.catalog_url] = {"schema": 1, "themes": [self.package(version="1.1.0")]}
            self.assertEqual(community.check_updates()["updateCount"], 0)
            self.assertEqual(network.call_count, before)
            result = community.check_updates(True)
            self.assertEqual(result["updateCount"], 1)
            self.assertEqual(result["updates"][0]["version"], "1.1.0")
            self.assertEqual(community._installed(self.repo, "neon")["version"], "1.0.0")
            with patch.object(community.time, "time", return_value=community.time.time() + community.CHECK_INTERVAL + 1):
                before = network.call_count
                community.check_updates()
                self.assertGreater(network.call_count, before)
            self.responses[self.api] = OSError("offline")
            result = community.check_updates(True)
            self.assertEqual(result["updateCount"], 1)
            self.assertTrue(result["errors"])

    def test_asset_only_updates_and_no_catalog_downgrades(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            theme = self.package()
            music = self.package("music", files={"asset-pack.json": {"schema": 1, "id": "music", "version": "1.0.0"}, "song.mp3": b"audio"})
            theme["assets"] = ["music"]
            self.add_catalog([theme], [music])
            community.package_action(self.repo, "neon", "install")
            music = self.package("music", "1.1.0", files={"asset-pack.json": {"schema": 1, "id": "music", "version": "1.1.0"}, "song.mp3": b"new audio"})
            self.responses[self.catalog_url] = {"schema": 1, "themes": [theme], "assets": [music]}
            self.assertEqual(community.check_updates(True)["updateCount"], 1)
            community.package_action(self.repo, "neon", "install")
            self.assertEqual(community.update_status()["updateCount"], 0)
            older = self.package(version="0.9.0")
            self.responses[self.catalog_url] = {"schema": 1, "themes": [older]}
            self.assertEqual(community.check_updates(True)["updateCount"], 0)

    def test_maintainer_repositories_are_discovered_for_everyone(self):
        import community_catalog
        with patch.object(community, "_fetch", side_effect=self.network), patch.object(community_catalog, "REPOSITORIES", [self.repo]):
            self.responses[self.catalog_url] = {"schema": 1, "themes": [self.package()]}
            source = community.check_updates()["sources"][0]
            self.assertTrue(source["featured"])
            self.assertEqual(source["themes"][0]["id"], "neon")
            with self.assertRaisesRegex(ValueError, "maintainer"):
                community.source_action(self.repo, "remove")

    def test_automatic_checks_skip_uninstalled_custom_sources(self):
        with patch.object(community, "_fetch", side_effect=self.network) as network:
            self.add_catalog()
            with patch.object(community.time, "time", return_value=community.time.time() + community.CHECK_INTERVAL + 1):
                before = network.call_count
                community.check_updates()
                self.assertEqual(network.call_count, before)

    def test_metadata_edits_do_not_offer_package_updates(self):
        with patch.object(community, "_fetch", side_effect=self.network):
            theme = self.package()
            self.add_catalog([theme])
            community.package_action(self.repo, "neon", "install")
            theme["description"] = "Updated description only"
            self.responses[self.catalog_url] = {"schema": 1, "themes": [theme]}
            self.assertEqual(community.check_updates(True)["updateCount"], 0)


if __name__ == "__main__":
    unittest.main()
