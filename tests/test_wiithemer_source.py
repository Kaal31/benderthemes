import sys,unittest,io,zipfile,tempfile
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import theme_sources as T
from wiithemer_catalog import parse
CATALOG='const themes=[\n{name:"Matrix",ID:"MATRX1",mym:"matrix.mym",mainimg:"matrix.avif",secondaryimg:"matrix.png"},\n{name:"Stages",ID:"STAGE1",mym:"stages_stage1.mym",mainimg:"stages.avif"},\n{name:"Bad",ID:"BAD",mym:"../bad.mym",mainimg:"https://evil/x.png"},\n{name:"Duplicate",ID:"DUP",mym:"matrix.mym"}\n];'
class SourceTests(unittest.TestCase):
 def setUp(self):T._cache.clear()
 def test_source_search_and_safe_catalog(self):
  self.assertIn('wiithemer',T.KINDS['wii']['sources']);items=parse(CATALOG);self.assertEqual(len(items),2);self.assertEqual(items[0]['author'],'');self.assertTrue(items[1]['externalOnly']);self.assertEqual(items[1]['files'],[])
  result=T.browse('wii','wiithemer','matrix',fetch_text=lambda *a:CATALOG);self.assertEqual(result['total'],1);self.assertEqual(result['items'][0]['id'],'matrix.mym')
 def test_download_rebuilt_and_checked(self):
  self.assertEqual(T.download_url('wii','wiithemer','matrix.mym'),'https://www.wiithemer.org/resources/mym/matrix.mym')
  for bad in ['../a.mym','https://evil/a.mym','a.mym?x=1','a.exe','a_stage1.mym']:
   with self.assertRaises(ValueError):T.download_url('wii','wiithemer',bad)
  self.assertFalse(T._allowed_host('wiithemer','evil.wiithemer.org'));self.assertTrue(T._allowed_host('wiithemer','www.wiithemer.org'))
 def test_offline_metadata_notice(self):
  result=T.browse('wii','wiithemer',fetch_text=lambda *a:(_ for _ in ()).throw(OSError('offline')))
  self.assertGreater(result['total'],100);self.assertIn('saved catalog',result['warning'])
 def test_parser_never_executes_script(self):
  with self.assertRaises(ValueError):parse('__import__("os").system("bad")')
if __name__=='__main__':unittest.main()
