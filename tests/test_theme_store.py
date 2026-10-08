import hashlib
import http.server
import importlib.util
import io
import json
from pathlib import Path
import shutil
import sys
import tempfile
import threading
import types
import unittest
from unittest.mock import patch
import urllib.request
import zipfile

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / "py_modules"))
sys.modules.setdefault("decky", types.SimpleNamespace())
import theme_store as store



def archive(files):
    stream = io.BytesIO()
    with zipfile.ZipFile(stream, "w") as z:
        for name, content in files.items(): z.writestr(name, content)
    return stream.getvalue()


class ThemeStoreTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.base = Path(self.temp.name)
        self.plugin = self.base / "plugins/DeckHomeThemes"
        self.plugin.mkdir(parents=True)
        self.settings = self.base / "settings/Deck Home Themes"
        self.settings.mkdir(parents=True)
        self.plugin.joinpath("package.json").write_text('{"version":"1.10.0"}')
        store.decky.DECKY_PLUGIN_DIR = str(self.plugin)
        store.decky.DECKY_PLUGIN_SETTINGS_DIR = str(self.settings)
        store._catalog = None
        store._catalog_error = None
        self.payload = archive({"assets/vita/test.png": b"test-image", "sounds/Vita/pack.json": b'{"name":"Vita"}'})
        self.size = len(b"test-image") + len(b'{"name":"Vita"}')
        self.pack = {"id": "vita", "theme": "vita", "name": "PS Vita", "version": "1.10.0", "minPluginVersion": "1.10.0",
            "url": "https://github.com/Kaal31/benderthemes/releases/download/v1.10.0/theme-vita-v1.10.0.zip",
            "sha256": hashlib.sha256(self.payload).hexdigest(), "size": len(self.payload), "unpackedSize": self.size}
        store._catalog = {"schema": 1, "themes": [self.pack]}

    def test_real_http_download_install_and_reinstall_persistence(self):
        payload = self.payload
        class Handler(http.server.BaseHTTPRequestHandler):
            def do_GET(self):
                self.send_response(200); self.end_headers(); self.wfile.write(payload)
            def log_message(self, *_): pass
        server = http.server.ThreadingHTTPServer(("127.0.0.1", 0), Handler)
        thread = threading.Thread(target=server.serve_forever, daemon=True)
        thread.start()
        real_urlopen = urllib.request.urlopen
        try:
            # Only routing is replaced: actual HTTP streaming, hashing, extraction and activation paths run.
            def route(_request, timeout):
                return real_urlopen(f"http://127.0.0.1:{server.server_port}/theme.zip", timeout=timeout)
            with patch.object(store, "urlopen", side_effect=route):
                result = store.install("vita")
            self.assertTrue(result["success"], result)
        finally:
            server.shutdown(); server.server_close(); thread.join()
        self.assertEqual(Path(store.resource("assets/vita/test.png")).read_bytes(), b"test-image")
        self.settings.joinpath("settings.json").write_text('{"theme":"vita","musicVolume":25}')
        # Decky's installer replaces the entire plugin directory, including obsolete files.
        (self.plugin / "obsolete.py").write_text("old")
        shutil.rmtree(self.plugin)
        self.plugin.mkdir()
        (self.plugin / "package.json").write_text('{"version":"1.10.1"}')
        self.assertFalse((self.plugin / "obsolete.py").exists())
        self.assertEqual(store.local_inventory(), {"vita": "1.10.0"})
        self.assertEqual(json.loads((self.settings / "settings.json").read_text())["musicVolume"], 25)

    def test_corrupt_download_keeps_previous_install(self):
        with patch.object(store, "urlopen", return_value=io.BytesIO(self.payload)):
            self.assertTrue(store.install("vita")["success"])
        with patch.object(store, "urlopen", return_value=io.BytesIO(b"broken")):
            self.assertFalse(store.install("vita")["success"])
        self.assertEqual(Path(store.resource("assets/vita/test.png")).read_bytes(), b"test-image")

    def test_archive_traversal_and_code_rejected(self):
        for name in ("../outside.txt", "/etc/config.txt", "assets/../../bad.txt", "assets\\..\\bad.png", "assets/code.py", "C:/bad.txt"):
            with self.subTest(name=name), self.assertRaises(ValueError):
                store._extract(io.BytesIO(archive({name: b"bad"})), self.base / "extract", 3)

    def test_untrusted_catalog_and_version_gate(self):
        with self.assertRaises(ValueError):
            store.validate_catalog({"schema": 1, "themes": [{**self.pack, "url": "https://evil.example/pack.zip"}]})
        self.pack["minPluginVersion"] = "99.0.0"
        self.assertFalse(store.install("vita")["success"])

    def test_no_space_and_concurrent_install(self):
        with patch.object(store.shutil, "disk_usage", return_value=types.SimpleNamespace(free=1)):
            self.assertFalse(store.install("vita")["success"])
        store._lock.acquire()
        try: self.assertFalse(store.install("vita")["success"])
        finally: store._lock.release()

    def test_remove_preserves_preferences_and_other_theme(self):
        self.settings.joinpath("settings.json").write_text('{"theme":"vita"}')
        with patch.object(store, "urlopen", return_value=io.BytesIO(self.payload)):
            store.install("vita")
        self.assertTrue(store.remove("vita")["success"])
        self.assertTrue(self.settings.joinpath("settings.json").exists())
        self.assertFalse(store.remove("../settings")["success"])

    def test_interrupted_swap_recovery(self):
        backup = store.root() / ".backup-vita"
        backup.mkdir(parents=True)
        (backup / "installed.json").write_text('{"version":"1.10.0"}')
        store.recover()
        self.assertEqual(store.local_inventory(), {"vita": "1.10.0"})

    def test_legacy_partition_allows_delete_without_redownloading_or_resurrection(self):
        source = store.root() / "legacy-resources/assets/xmb"
        source.mkdir(parents=True)
        (source / "icon.png").write_bytes(b"shared")
        source.parent.parent.joinpath("installed.json").write_text('{"version":"legacy"}')
        self.plugin.joinpath("theme-catalog.json").write_text(json.dumps({"themes": [
            {"id": "ps3", "resources": ["assets/xmb/icon.png"]}, {"id": "psp", "resources": ["assets/xmb/icon.png"]}]}))
        self.assertEqual(store.local_inventory(), {"ps3": "legacy", "psp": "legacy"})
        self.assertFalse((store.root() / "legacy-resources").exists())
        self.assertTrue(store.remove("ps3")["success"])
        self.assertEqual(store.local_inventory(), {"psp": "legacy"})
        self.assertEqual(Path(store.resource("assets/xmb/icon.png")).read_bytes(), b"shared")


if __name__ == "__main__": unittest.main()
