import base64
import json
import struct
import sys
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'py_modules'))
import square_artwork as art


def image(width=512, height=512):
    raw = b'\x89PNG\r\n\x1a\n' + struct.pack('>I', 13) + b'IHDR' + struct.pack('>II', width, height) + b'\x08\x06\0\0\0' + b'\0' * 4
    return 'data:image/png;base64,' + base64.b64encode(raw).decode()


class SquareArtworkTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.root = self.temp.name

    def tearDown(self):
        self.temp.cleanup()

    def test_theme_isolation_and_remove_without_affecting_other_themes(self):
        art.save(self.root, 'wiiu', '620', image())
        self.assertIn('620', art.images(self.root, 'wiiu'))
        self.assertEqual(art.images(self.root, 'vita'), {})
        art.save(self.root, 'vita', '620', image(256, 256))
        art.remove(self.root, 'wiiu', '620')
        self.assertEqual(art.images(self.root, 'wiiu'), {})
        self.assertTrue(Path(art.images(self.root, 'vita')['620']).is_file())

    def test_bounds_and_ids(self):
        for value in (image(300, 500), image(4096, 4096), 'data:image/png;base64,@@@', 'file:///secret'):
            with self.assertRaises((ValueError, TypeError)):
                art.save(self.root, 'wiiu', '620', value)
        with self.assertRaises(ValueError):
            art.save(self.root, 'wiiu', '../x', image())

    def test_background_artwork_cannot_replace_a_manual_image(self):
        first = art.save(self.root, 'wiiu', '620', image(256, 256))['620']
        second = art.save(self.root, 'wiiu', '620', image(), automatic=True)['620']
        self.assertEqual(first, second)

    def test_key_is_not_returned_and_no_key_requires_no_network(self):
        key = 'a' * 32
        self.assertEqual(art.configure(self.root, key), {'configured': True})
        self.assertNotIn(key, json.dumps(art.configure(self.root)))
        art.configure(self.root, '')
        with patch.object(art, 'urlopen') as fetch:
            self.assertIn('API key', art.search(self.root, '620')['error'])
            fetch.assert_not_called()

    def test_invalid_remote_urls_never_fetch(self):
        with patch.object(art, 'urlopen') as fetch:
            for url in ('http://cdn2.steamgriddb.com/image.png', 'https://example.com/image.png', 'https://cdn2.steamgriddb.com:8000/image.png', 'https://name:secret@cdn2.steamgriddb.com/image.png'):
                with self.assertRaises(ValueError):
                    art.download(url)
            fetch.assert_not_called()


if __name__ == '__main__':
    unittest.main()
