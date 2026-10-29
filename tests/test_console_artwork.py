import hashlib,io,json,sys,tempfile,unittest,zipfile
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import console_artwork as art
class ConsoleArtworkTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
  raw=io.BytesIO()
  with zipfile.ZipFile(raw,'w') as z:z.writestr('assets/x360-nxe-dash/icon-disc.png',b'image')
  self.payload=raw.getvalue();self.pack=dict(id='x360-nxe-dash',url='https://gitflic.ru/project/spon4ik67/themehubconsoleassets/release/test/pack/download',bytes=len(self.payload),sha256=hashlib.sha256(self.payload).hexdigest(),unpackedBytes=5,files=1)
  self.patches=[patch.object(art,'root',return_value=self.root),patch.object(art,'manifest',return_value={'repository':'test','packs':[self.pack]})]
  for p in self.patches:p.start()
 def tearDown(self):
  for p in self.patches:p.stop()
  self.tmp.cleanup()
 def test_install_and_retry_uses_verified_cache(self):
  with patch.object(art,'_fetch',return_value=io.BytesIO(self.payload)) as fetch:
   self.assertTrue(art.install('x360')['success']);self.assertEqual(fetch.call_count,1)
   self.assertEqual((art.resource_dir(self.pack['id'])/'icon-disc.png').read_bytes(),b'image')
   self.assertTrue(art.install('x360')['success']);self.assertEqual(fetch.call_count,1)
 def test_corrupt_download_does_not_activate(self):
  with patch.object(art,'_fetch',return_value=io.BytesIO(self.payload[:-1])):
   self.assertFalse(art.install('x360')['success']);self.assertIsNone(art.resource_dir(self.pack['id']))
 def test_traversal_and_duplicates_rejected(self):
  for names in [('assets/x360-nxe-dash/../../../escape.png',),('assets/x360-nxe-dash/icon-disc.png','assets/x360-nxe-dash/ICON-DISC.png')]:
   archive=self.root/'bad.zip'
   with zipfile.ZipFile(archive,'w') as z:
    for n in names:z.writestr(n,b'image')
   with self.assertRaises(ValueError):art._extract({**self.pack,'files':len(names),'unpackedBytes':5*len(names)},archive,self.root/'stage')
  self.assertFalse((self.root/'escape.png').exists())
 def test_unknown_console_and_host_rejected(self):
  self.assertFalse(art.install('unknown')['success'])
  self.pack['url']='https://example.com/data.zip'
  self.assertFalse(art.install('x360')['success'])
if __name__=='__main__':unittest.main()
