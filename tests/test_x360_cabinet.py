import sys,tempfile,json,unittest
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import x360_cabinet as C
class Response:
 def __init__(self,data):self.data=data
 def __enter__(self):return self
 def __exit__(self,*args):pass
 def read(self,limit):return self.data[:limit]
class CabinetTests(unittest.TestCase):
 def test_unknown_id_never_fetches(self):
  with tempfile.TemporaryDirectory() as root,patch.object(C.urllib.request,'urlopen') as request:
   self.assertIn('error',C.wallpaper(root,'../escape'));request.assert_not_called()
 def test_cache_works_offline(self):
  raw=b'\xff\xd8\xfffixture'
  with tempfile.TemporaryDirectory() as root:
   with patch.object(C.urllib.request,'urlopen',return_value=Response(raw)) as request:
    self.assertTrue(C.wallpaper(root,'NAC')['background'].startswith('data:image/jpeg;base64,'));self.assertEqual(request.call_count,1)
   with patch.object(C.urllib.request,'urlopen',side_effect=OSError('offline')):
    self.assertIn('background',C.wallpaper(root,'NAC'))
 def test_bad_image_not_cached(self):
  with tempfile.TemporaryDirectory() as root,patch.object(C.urllib.request,'urlopen',return_value=Response(b'<html>error</html>')):
   self.assertIn('error',C.wallpaper(root,'NAC'));self.assertFalse((Path(root)/'wallpapers/x360-cabinet/NAC.jpg').exists())
 def test_oversized_rejected(self):
  with tempfile.TemporaryDirectory() as root,patch.object(C.urllib.request,'urlopen',return_value=Response(b'\xff\xd8\xff'+b'0'*C.MAX_BYTES)):
   self.assertIn('error',C.wallpaper(root,'NAC'))
 def test_catalog_matches_frontend(self):
  text=(Path(__file__).resolve().parents[1]/'src/x360CabinetCatalog.ts').read_text();items=json.loads(text.split('=',1)[1].strip().rstrip(';'))
  self.assertEqual(items,C.CATALOG['items'])
if __name__=='__main__':unittest.main()
