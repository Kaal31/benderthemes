import io
import json
import struct
import sys
import tempfile
import unittest
import zipfile
from pathlib import Path
from unittest.mock import patch

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'py_modules'))
import cover_wraps as c


def png(w=1500, h=1000):
    return b'\x89PNG\r\n\x1a\n' + b'\0' * 8 + struct.pack('>II', w, h)


class CoverWrapTests(unittest.TestCase):
    def setUp(self):
        self.tmp = tempfile.TemporaryDirectory()
        self.root = self.tmp.name

    def tearDown(self):
        self.tmp.cleanup()

    def test_manual_is_durable_and_generated_removes_override(self):
        source = Path(self.root) / 'wrap.png'
        source.write_bytes(png())
        value = c.import_file(self.root, '620', source)
        self.assertEqual(value['mode'], 'manual')
        source.unlink()
        self.assertTrue(Path(c.status(self.root, '620')['path']).exists())
        with patch.object(c, 'search') as search:
            self.assertEqual(c.resolve(self.root, '620', 'Portal 2', True)['mode'], 'manual')
            search.assert_not_called()
        c.set_mode(self.root, '620', 'generated')
        self.assertNotIn('path', c.resolve(self.root, '620', 'Portal 2', True))

    def test_rejects_portrait_html_oversized_images_and_bad_ids(self):
        for raw in (png(600, 900), png(20000, 1000), b'<html>Not an image</html>'):
            with self.assertRaises(ValueError):
                c.image_info(raw)
        for ident in ('../x', '-1', 'not-a-game'):
            with self.assertRaises(ValueError):
                c.status(self.root, ident)
        with self.assertRaises(ValueError):
            c.select(self.root, '620', 'gametdb', 'ps3', '../x')

    def test_fuzzy_and_ambiguous_matches_never_auto_select(self):
        for candidates in ([{'score': .95, 'provider': 'xboxunity'}],
                           [{'score': 1, 'provider': 'gametdb'}, {'score': 1, 'provider': 'gametdb'}]):
            c.set_mode(self.root, '620', 'auto')
            with patch.object(c, 'search', return_value={'candidates': candidates, 'errors': []}), patch.object(c, 'select') as select:
                result = c.resolve(self.root, '620', 'Portal 2', True)
                select.assert_not_called()
                self.assertEqual(result['matchCount'], len(candidates))

    def test_exact_unity_download_and_provider_failure_backoff(self):
        candidate = {'score': 1, 'provider': 'xboxunity', 'platform': 'xbox360', 'id': '45410912', 'name': 'Portal 2'}
        with patch.object(c, 'search', return_value={'candidates': [candidate], 'errors': []}), patch.object(c, '_json', return_value={'Covers': [{'CoverID': '2336', 'Official': '1'}]}), patch.object(c, '_fetch', return_value=png()):
            result = c.resolve(self.root, '620', 'Portal 2', True)
            self.assertEqual(result['mode'], 'auto')
            self.assertEqual(result['source'], 'xboxunity')
            self.assertTrue(Path(result['path']).is_file())
        c.set_mode(self.root, '620', 'auto')
        with patch.object(c, 'search', return_value={'candidates': [], 'errors': ['offline']}) as search:
            c.resolve(self.root, '620', 'Portal 2', True)
            c.resolve(self.root, '620', 'Portal 2', True)
            self.assertEqual(search.call_count, 1)

    def test_automatic_download_cannot_replace_manual_choice(self):
        c._save(self.root, '620', png(), {'mode': 'manual'})
        result = c._save(self.root, '620', png(1600, 1000), {'mode': 'auto'})
        self.assertEqual(result['mode'], 'manual')
        self.assertEqual(result['width'], 1500)

    def test_unavailable_unity_wrap_can_fall_through_to_unique_tdb_match(self):
        candidates = [
            {'score': 1, 'provider': 'xboxunity', 'platform': 'xbox360', 'id': '45410912', 'name': 'Portal 2'},
            {'score': 1, 'provider': 'gametdb', 'platform': 'ps3', 'id': 'BLUS30732', 'name': 'Portal 2'},
        ]
        with patch.object(c, 'search', return_value={'candidates': candidates, 'errors': []}), patch.object(c, 'select', side_effect=[ValueError('No Unity wrap'), {'mode': 'auto', 'source': 'gametdb'}]) as select:
            result = c.resolve(self.root, '620', 'Portal 2', True)
            self.assertEqual(result['source'], 'gametdb')
            self.assertEqual(select.call_count, 2)

    def test_tdb_english_title_and_cached_catalog(self):
        raw = io.BytesIO()
        with zipfile.ZipFile(raw, 'w') as archive:
            archive.writestr('ps3tdb.xml', '<datafile><game name="Portal 2 (USA) (EN)"><id>BLUS30732</id><locale lang="EN"><title>Portal 2</title></locale></game></datafile>')
        with patch.object(c, '_fetch', return_value=raw.getvalue()) as fetch:
            rows = c._tdb_index(self.root, 'ps3')
            self.assertEqual(rows, [['BLUS30732', 'Portal 2']])
            c._tdb_index(self.root, 'ps3')
            self.assertEqual(fetch.call_count, 1)
        self.assertEqual(c.score('Portal™ 2', 'Portal 2'), 1)
        self.assertLess(c.score('Portal 2', 'Portal'), 1)


if __name__ == '__main__':
    unittest.main()
