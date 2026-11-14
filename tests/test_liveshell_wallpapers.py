import json,sys,tempfile,unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import liveshell_wallpapers as ls
class CatalogueTests(unittest.TestCase):
 def fixture(self):
  return {'v':2,'src':{'c':{'u':'https://huggingface.co/datasets/ZiZc3/liveshell-community/resolve/main/media/'}},'items':[{'o':'c','u':'sunset.mp4','t':'Sunset','c':'games','j':'sunset.jpg'},{'o':'c','u':'../escape.mp4','t':'Bad'},{'o':'c','u':'%2e%2e/escape.mp4','t':'Bad'},{'o':'c','u':'file.exe','t':'Bad'}]}
 def test_mapping_filtering_and_stable_id(self):
  with patch.object(ls,'catalogue',return_value=self.fixture()):
   entries=ls.entries('');self.assertEqual(len(entries),1)
   item=ls.browse('','games')['items'][0];self.assertNotIn('_url',item)
   self.assertTrue(ls.media('',item['providerId'])['url'].endswith('/sunset.mp4'))
   self.assertEqual(ls.browse('','missing')['items'],[])
 def test_untrusted_origins_and_paths(self):
  for base,path in [('https://evil.test/','x.mp4'),('https://huggingface.co.evil.test/','x.mp4'),('https://huggingface.co/datasets/ZiZc3/liveshell-community/resolve/main/','%2fetc/passwd')]:
   with self.assertRaises(ValueError):ls.asset_url(base,path)
  for url in ['http://huggingface.co/x','https://127.0.0.1/x','https://huggingface.co.evil.test/x','https://huggingface.co:123/x']:
   self.assertFalse(ls.allowed_download(url))
 def test_offline_cached_catalogue(self):
  with tempfile.TemporaryDirectory() as root:
   cache=Path(root)/'animated-wallpapers/liveshell-catalog.json';cache.parent.mkdir();cache.write_text(json.dumps(self.fixture()))
   with patch.object(ls,'urlopen',side_effect=OSError('offline')):self.assertEqual(len(ls.browse(root)['items']),1)
if __name__=='__main__':unittest.main()
