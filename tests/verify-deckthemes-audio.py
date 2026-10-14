import io
import json
from pathlib import Path
import sys
import tempfile
import unittest
import zipfile
import ast
import asyncio
import types
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import deckthemes_audio as audio

IDENT = "72cb45a8-bf25-40c3-8eb3-959a5e7308e7"
BLOB = "11111111-1111-4111-8111-111111111111"


def archive(extra=None):
    output = io.BytesIO()
    with zipfile.ZipFile(output, "w") as z:
        z.writestr("PSP/pack.json", json.dumps({"id": IDENT, "manifest_version": 2, "name": "PSP Sounds", "ignore": []}))
        z.writestr("PSP/deck_ui_navigation.wav", b"audio fixture")
        if extra:
            z.writestr(*extra)
    return output.getvalue()


class Downloads(unittest.TestCase):
    def fetch(self, path, limit):
        self.calls.append(path)
        if path.startswith("/themes/"):
            return json.dumps({"id": IDENT, "type": "Audio", "manifestVersion": 2, "download": {"id": BLOB}}).encode()
        return self.data

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.calls = []
        self.data = archive()

    def test_install_cached_and_overrides(self):
        first = audio.install(IDENT, self.temp.name, fetch=self.fetch)
        self.assertFalse(first["reused"])
        manifest = json.loads((Path(self.temp.name) / first["folder"] / "pack.json").read_text())
        self.assertEqual(manifest["ignore"], audio.entry(IDENT)["override"]["ignore"])
        second = audio.install(IDENT, self.temp.name, fetch=self.fetch)
        self.assertTrue(second["reused"])
        self.assertEqual(len(self.calls), 2)

    def test_reuse_installed_prefer_verified(self):
        result = audio.install(IDENT, self.temp.name, [{"id": IDENT, "name": "PSP Sounds", "folder": "original"}, {"id": IDENT, "name": "DHT Verified PSP", "folder": "verified"}], self.fetch)
        self.assertEqual(result["folder"], "verified")
        self.assertEqual(self.calls, [])

    def test_traversal_and_symlink_rejected_atomically(self):
        for name in ("../outside.wav", "/outside.wav", "PSP/../../outside.wav", "C:/outside.wav"):
            self.data = archive((name, b"bad"))
            with self.assertRaises(ValueError):
                audio.install(IDENT, self.temp.name, fetch=self.fetch)
            self.assertEqual(list(Path(self.temp.name).iterdir()), [])
        self.data = archive(("PSP/outside.wav", b"bad")).replace(b"PSP/outside.wav", b"PSP\\outside.wav")
        with self.assertRaises(ValueError):
            audio.install(IDENT, self.temp.name, fetch=self.fetch)
        info = zipfile.ZipInfo("PSP/link.wav")
        info.external_attr = 0o120777 << 16
        self.data = archive((info, b"/outside"))
        with self.assertRaises(ValueError):
            audio.install(IDENT, self.temp.name, fetch=self.fetch)

    def test_failure_preserves_existing(self):
        folder = Path(self.temp.name) / ("DeckThemes-" + IDENT)
        folder.mkdir()
        (folder / "personal.wav").write_bytes(b"mine")
        with self.assertRaises(ValueError):
            audio.install(IDENT, self.temp.name, fetch=self.fetch)
        self.assertEqual((folder / "personal.wav").read_bytes(), b"mine")
        self.assertEqual(self.calls, [])

    def test_unknown_and_bad_archives(self):
        with self.assertRaises(ValueError):
            audio.install("https://evil.example", self.temp.name, fetch=self.fetch)
        self.data = b"broken"
        with self.assertRaises(zipfile.BadZipFile):
            audio.install(IDENT, self.temp.name, fetch=self.fetch)
        self.assertEqual(list(Path(self.temp.name).iterdir()), [])

    def test_catalog_scope(self):
        specs = audio.catalog()
        self.assertEqual(len(specs), 37)
        self.assertEqual(len({s["id"] for s in specs}), 37)
        self.assertEqual(sum(bool(s.get("folders")) for s in specs), 20)
        folders = {f for s in specs for f in s.get("folders", [])}
        self.assertNotIn("DHT Verified Republic", folders)
        self.assertNotIn("Theseus Xbox Dashboard", folders)
        self.assertNotIn("DHT Verified Xbox 360 Metro Dashboard", folders)

    def test_theme_install_dependencies_and_failure_fallback(self):
        tree = ast.parse((Path(__file__).resolve().parents[1] / "main.py").read_text(encoding="utf-8"))
        method = next(n for cls in tree.body if isinstance(cls, ast.ClassDef) for n in cls.body if isinstance(n, ast.AsyncFunctionDef) and n.name == "theme_install")
        scope = {"asyncio": asyncio}
        exec(compile(ast.Module(body=[method], type_ignores=[]), "theme_install", "exec"), scope)
        store = types.ModuleType("theme_store")
        store.install = lambda ident: {"success": True}
        store.catalog = lambda: {"themes": [{"id": "psp", "audioPacks": [IDENT]}]}
        calls = []
        class Host:
            async def install_deckthemes_audio(self, ident):
                calls.append(ident)
                return {"ok": False, "error": "offline"}
        with patch.dict(sys.modules, {"theme_store": store}):
            result = asyncio.run(scope["theme_install"](Host(), "psp"))
            self.assertTrue(result["success"], "artwork remains installed if optional audio fails")
            self.assertIn("offline", result["audioWarning"])
            self.assertEqual(calls, [IDENT])
            calls.clear()
            store.install = lambda ident: {"success": False, "error": "art failed"}
            asyncio.run(scope["theme_install"](Host(), "psp"))
            self.assertEqual(calls, [])


if __name__ == "__main__":
    unittest.main()
