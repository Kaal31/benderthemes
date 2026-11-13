import hashlib,io,json,sys,tempfile,unittest,zipfile
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import console_artwork as art
import console_font
class ConsoleArtworkTests(unittest.TestCase):
 def setUp(self):
  self.tmp=tempfile.TemporaryDirectory();self.root=Path(self.tmp.name)
  raw=io.BytesIO()
  with zipfile.ZipFile(raw,'w') as z:z.writestr('assets/x360-nxe-dash/icon-disc.png',b'image')
  self.payload=raw.getvalue();self.pack=dict(id='x360-nxe-dash',url='https://gitflic.ru/project/spon4ik67/themehubconsoleassets/release/test/pack/download',bytes=len(self.payload),sha256=hashlib.sha256(self.payload).hexdigest(),unpackedBytes=5,files=1)
  self.patches=[patch.object(art,'root',return_value=self.root),patch.object(art,'manifest',return_value={'repository':'test','packs':[self.pack]}),patch.object(console_font,'install',return_value={'success':True})]
  for p in self.patches:p.start()
 def tearDown(self):
  for p in self.patches:p.stop()
  self.tmp.cleanup()
 def test_install_and_retry_uses_verified_cache(self):
  with patch.object(art,'_fetch',return_value=io.BytesIO(self.payload)) as fetch:
   self.assertTrue(art.install('x360')['success']);self.assertEqual(fetch.call_count,1)
   self.assertEqual((art.resource_dir(self.pack['id'])/'icon-disc.png').read_bytes(),b'image')
   self.assertTrue(art.install('x360')['success']);self.assertEqual(fetch.call_count,1)
 def test_wiiu_stock_bases_are_cached_and_reusable(self):
  raw=io.BytesIO()
  with zipfile.ZipFile(raw,'w') as z:
   z.writestr('assets/wiiu-stock-menu/Men.pack',b'SARC-one')
   z.writestr('assets/wiiu-stock-menu/Men2.pack',b'SARC-two')
  payload=raw.getvalue();self.pack.update(id='wiiu-stock-menu',bytes=len(payload),sha256=hashlib.sha256(payload).hexdigest(),files=2,unpackedBytes=16)
  with patch.object(art,'_fetch',return_value=io.BytesIO(payload)) as fetch:
   self.assertTrue(art.install('wiiu-stock')['success'])
   folder=art.resource_dir('wiiu-stock-menu')
   self.assertEqual((folder/'Men.pack').read_bytes(),b'SARC-one')
   self.assertEqual((folder/'Men2.pack').read_bytes(),b'SARC-two')
   self.assertTrue(art.install('wiiu-stock')['success'])
   self.assertEqual(fetch.call_count,1)
 def test_required_resources_keep_audio_and_language_paths(self):
  payloads={'Men.pack':b'SARC', 'cafe_barista_men.bfsar':b'FSAR', 'content/EuEnglish/Message/AllMessage.szs':b'Yaz0', 'resources.json':b'{}'}
  archive=self.root/'required.zip'
  with zipfile.ZipFile(archive,'w') as z:
   for name,raw in payloads.items():z.writestr('assets/wiiu-stock-menu/'+name,raw)
  pack=dict(id='wiiu-stock-menu',files=len(payloads),unpackedBytes=sum(map(len,payloads.values())))
  art._extract(pack,archive,self.root/'stage')
  for name,raw in payloads.items():self.assertEqual((self.root/'stage/assets/wiiu-stock-menu'/name).read_bytes(),raw)
  self.assertNotIn('wiiu-stock-menu',art.GROUPS['wiiu'])
  self.assertEqual(art.GROUPS['wiiu-stock'],['wiiu-stock-menu'])
 def test_required_resources_reject_code_and_nested_traversal(self):
  for name in ['content/../escape.szs','content/code/men.rpx','content/Other.dll']:
   archive=self.root/'bad-data.zip'
   with zipfile.ZipFile(archive,'w') as z:z.writestr('assets/wiiu-stock-menu/'+name,b'data')
   with self.assertRaises(ValueError):art._extract(dict(id='wiiu-stock-menu',files=1,unpackedBytes=4),archive,self.root/'stage')
 def test_wiiu_stock_rejects_unexpected_pack_names(self):
  archive=self.root/'bad-stock.zip'
  with zipfile.ZipFile(archive,'w') as z:z.writestr('assets/wiiu-stock-menu/Other.pack',b'data')
  with self.assertRaises(ValueError):art._extract(dict(id='wiiu-stock-menu',files=1,unpackedBytes=4),archive,self.root/'stage')
 def test_corrupt_download_does_not_activate(self):
  with patch.object(art,'_fetch',return_value=io.BytesIO(self.payload[:-1])):
   self.assertFalse(art.install('x360')['success']);self.assertIsNone(art.resource_dir(self.pack['id']))
 def test_font_failure_keeps_installed_artwork(self):
  with patch.object(art,'_fetch',return_value=io.BytesIO(self.payload)),patch.object(console_font,'install',return_value={'success':False,'error':'Offline'}):
   result=art.install('x360')
   self.assertTrue(result['success']);self.assertFalse(result['font']['success'])
   self.assertIsNotNone(art.resource_dir(self.pack['id']))
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
