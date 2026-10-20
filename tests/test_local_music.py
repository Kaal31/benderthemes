import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "py_modules"))
import local_music


class LocalMusicTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.addCleanup(self.tmp.cleanup)
        self.home = Path(self.tmp.name)
        self.sounds = self.home / "homebrew/sounds"
        for folder in ("Downloads", "Music"):
            (self.home / folder).mkdir()

    def import_file(self, source):
        return local_music.import_file(str(source), self.home, self.sounds)

    def test_copy_and_reuse_music_without_source_file(self):
        for directory in ("Downloads", "Music"):
            source = self.home / directory / "A song.MP3"
            source.write_bytes(b"ID3" + b"audio fixture" * 10)
            result = self.import_file(source)
            destination = self.sounds / result["folder"]
            self.assertEqual((destination / "menu_music.mp3").read_bytes(), source.read_bytes())
            self.assertTrue(json.loads((destination / "pack.json").read_text(encoding="utf-8"))["music"])
            self.assertEqual(self.import_file(source)["folder"], result["folder"])
            source.unlink()
            self.assertTrue((destination / "menu_music.mp3").is_file())

    def test_nested_and_localized_folders(self):
        config = self.home / ".config"
        config.mkdir()
        (config / "user-dirs.dirs").write_text('XDG_MUSIC_DIR="$HOME/My Songs"\n')
        source = self.home / "My Songs/Album/song.flac"
        source.parent.mkdir(parents=True)
        source.write_bytes(b"fLaC" + b"fixture")
        self.assertTrue(self.import_file(source)["ok"])

    def test_reject_missing_outside_or_fake_audio(self):
        outside = self.home / "private.mp3"
        outside.write_bytes(b"ID3fixture")
        for source in (outside, self.home / "Downloads/missing.mp3"):
            with self.assertRaises((ValueError, OSError)):
                self.import_file(source)
        fake = self.home / "Music/fake.mp3"
        fake.write_bytes(b"not audio")
        with self.assertRaises(ValueError):
            self.import_file(fake)

    def test_reject_oversized_empty_and_unsupported(self):
        source = self.home / "Music/file.mp3"
        source.write_bytes(b"ID3" + b"x" * 20)
        with patch.object(local_music, "MAX_SIZE", 10), self.assertRaises(ValueError):
            self.import_file(source)
        source.write_bytes(b"")
        with self.assertRaises(ValueError):
            self.import_file(source)
        other = source.with_suffix(".txt")
        other.write_bytes(b"ID3fixture")
        with self.assertRaises(ValueError):
            self.import_file(other)

    def test_formats_and_changed_file_get_distinct_packs(self):
        samples = {"wav": b"RIFFxxxxWAVEdata", "ogg": b"OggSfixture", "opus": b"OggSfixture", "oga": b"OggSfixture", "m4a": b"xxxxftypM4A fixture", "flac": b"fLaCfixture"}
        for ext, data in samples.items():
            source = self.home / "Downloads" / ("track." + ext)
            source.write_bytes(data)
            before = self.import_file(source)["folder"]
            source.write_bytes(data + b"changed")
            self.assertNotEqual(before, self.import_file(source)["folder"])


if __name__ == "__main__":
    unittest.main()
