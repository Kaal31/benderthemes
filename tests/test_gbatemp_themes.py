import sys
import unittest
from unittest.mock import patch
from pathlib import Path
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'py_modules'))
import gbatemp_themes as gt
import theme_sources as ts

FIXTURE = '''<article data-author="Alice"><div class="bbWrapper">
<b><span>1* Green</span></b><br><img src="https://example.org/green.png">
4:3 Yes / 16:9 Yes<br>Version 2<br><a href="https://mediafire.com/file/green.zip">Download</a>
<b><span>2* Blue</span></b><br><img data-src="https://example.org/blue.png">
Version 3<br><a href="javascript:alert(1)">bad</a></div></article>
<article><div class="bbWrapper">Reply must not become an entry</div></article>'''

class CatalogTests(unittest.TestCase):
    def test_entries_keep_images_metadata_and_separate_downloads(self):
        items = gt.parse(FIXTURE, gt.THREADS[0])
        self.assertEqual([i['name'] for i in items], ['Green', 'Blue'])
        self.assertEqual(items[0]['image'], 'https://example.org/green.png')
        self.assertIn('Version 2', items[0]['description'])
        self.assertEqual(items[0]['externalLinks'], ['https://mediafire.com/file/green.zip'])
        self.assertEqual(items[1]['externalLinks'], [])
        self.assertEqual(items[0]['files'], [])

    def test_browse_search_cache_and_no_direct_download(self):
        calls = []
        def fetch(source, url):
            calls.append(url)
            return FIXTURE
        ts._cache.clear()
        result = ts.browse('wiiflow', 'gbatemp', 'Blue', fetch_text=fetch)
        self.assertEqual(len(result['items']), len(gt.THREADS))
        ts.browse('wiiflow', 'gbatemp', fetch_text=fetch)
        self.assertEqual(len(calls), len(gt.THREADS))
        with self.assertRaises(ValueError): ts.download_url('wiiflow', 'gbatemp', '180497-0')

    def test_block_pages_and_unsafe_links(self):
        with self.assertRaises(ValueError): gt.parse('<html>Forbidden</html>', gt.THREADS[0])
        self.assertEqual(gt.public_url('http://127.0.0.1/test'), '')
        self.assertEqual(gt.public_url('javascript:alert(1)'), '')

    def test_default_browse_does_not_wait_for_remote_threads(self):
        ts._cache.clear()
        with patch.object(ts, "_fetch", side_effect=AssertionError("must not wait for live GBAtemp")):
            result = ts.browse("wiiflow", "gbatemp")
        self.assertGreater(result["total"], 0)
        self.assertNotIn("error", result)

    def test_unavailable_source_uses_labeled_snapshot(self):
        ts._cache.clear()
        def unavailable(*args): raise OSError('403')
        result = ts.browse('wiiflow', 'gbatemp', fetch_text=unavailable)
        self.assertGreater(result['total'], 0)
        self.assertIn('saved index', result['warning'])
        self.assertTrue(all(i['externalOnly'] for i in result['items']))

if __name__ == '__main__': unittest.main()
