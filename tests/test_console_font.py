import io
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import console_font as font


class ConsoleFontTests(unittest.TestCase):
    def test_unavailable_font_does_not_activate(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(font,'root',return_value=Path(directory)), patch.object(font,'urlopen',side_effect=OSError('Offline')):
            self.assertFalse(font.install()['success'])
            self.assertIsNone(font.font_path())

    def test_changed_upstream_download_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory, patch.object(font,'root',return_value=Path(directory)), patch.object(font,'urlopen',return_value=io.BytesIO(b'not the pinned archive')):
            self.assertIn('checksum',font.install()['error'])
            self.assertIsNone(font.font_path())
            self.assertFalse((Path(directory)/'convection.ttf').exists())

    def test_invalid_font_container_is_rejected(self):
        with self.assertRaises(ValueError):font.convert(b'not a font')

if __name__=='__main__':unittest.main()
