import json
from pathlib import Path
import sys
import tempfile
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import theme_screensavers as saver

class Screensavers(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.root = Path(self.tmp.name)
        self.runtime = self.root / "runtime"
        self.steam = self.root / "Steam"; self.steam.mkdir()
        self.plugin = Path(__file__).resolve().parents[1]
    def media(self, ext, header):
        source = self.root / ("sample" + ext); source.write_bytes(header + b"fixture")
        return saver.import_media(self.runtime, source)["file"]
    def test_supported_media_and_multiple_photos_export(self):
        files = [self.media(".gif", b"GIF89a"), self.media(".mp4", b"\x00\x00\x00\x18ftypisom"),
                 self.media(".png", b"\x89PNG\r\n\x1a\n"), self.media(".jpg", b"\xff\xd8\xff")]
        result = saver.export(self.runtime, self.steam, self.plugin, files, {"duration": 10, "shuffle": True, "fit": "cover"})
        self.assertTrue(result["installed"])
        target = self.steam / "config/uioverrides/screensavers" / saver.NAME
        catalog = json.loads((target / "catalog.json").read_text())
        self.assertEqual(len(catalog["media"]), 4)
        self.assertEqual(sum(x["video"] for x in catalog["media"]), 1)
        self.assertTrue(catalog["shuffle"])
        # Refreshing active theme replaces playlist and removes stale exported media.
        saver.export(self.runtime, self.steam, self.plugin, files[2:], {})
        self.assertEqual(len(list((target / "media").iterdir())), 2)
        self.assertEqual(len(list((self.runtime / "screensavers").iterdir())), 4)
        saver.cleanup(self.steam)
        self.assertFalse(target.exists())
    def test_invalid_import_and_traversal_preserve_export(self):
        with self.assertRaises(ValueError): self.media(".mp4", b"not a movie")
        valid = self.media(".gif", b"GIF89a")
        saver.export(self.runtime, self.steam, self.plugin, [valid], {})
        target = self.steam / "config/uioverrides/screensavers" / saver.NAME
        before = (target / "catalog.json").read_bytes()
        with self.assertRaises(ValueError): saver.export(self.runtime, self.steam, self.plugin, ["../secret.gif"], {})
        self.assertEqual((target / "catalog.json").read_bytes(), before)
    def test_unowned_directory_is_preserved(self):
        target = self.steam / "config/uioverrides/screensavers" / saver.NAME
        target.mkdir(parents=True); (target / "mine").write_text("keep")
        valid = self.media(".gif", b"GIF89a")
        with self.assertRaises(ValueError): saver.export(self.runtime, self.steam, self.plugin, [valid], {})
        saver.cleanup(self.steam)
        self.assertEqual((target / "mine").read_text(), "keep")
