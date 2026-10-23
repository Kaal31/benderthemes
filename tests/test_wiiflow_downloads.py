"""Actual runtime conversion, delayed Downloads discovery and identity persistence."""
from pathlib import Path
import sys,tempfile,types,unittest,zipfile,json
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
sys.modules.setdefault('decky',types.SimpleNamespace())
import wiiflow_downloads as downloads
import data_themes
class RuntimeImportTests(unittest.TestCase):
 def test_installs_every_theme_and_keeps_separate_archive_names(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);source=root/'pack.zip'
   with zipfile.ZipFile(source,'w') as z:
    for name in ('Blue','Red'):z.writestr(name+'.ini','[MAIN/BG]\n[_COVERFLOW_1]\ncenter_pos=0,0,2\n')
   media=types.SimpleNamespace(ensure=lambda _:{'success':True},catalog=lambda:{'wiiflow-default':{'files':[]}})
   with patch.dict(sys.modules,{'frame_media':media}),patch.object(data_themes,'user_root',return_value=str(root/'installed')):
    result=downloads.install(source)
    self.assertEqual(len(result),2)
    archives=list((root/'installed').glob('*.zip'));self.assertEqual(len(archives),2)
    self.assertEqual({p.stem for p in archives},{i['id'] for i in result})
    for archive in archives:
     with zipfile.ZipFile(archive) as z:self.assertEqual(json.loads(z.read('theme.json'))['layout'],'frame')
 def test_oversized_download_explains_why_it_is_not_imported(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);folder=root/'Downloads';folder.mkdir();(folder/'Big-theme.zip').write_bytes(b'oversized')
   state=root/'state.json'
   with patch.object(downloads.converter,'MAX_BYTES',3),patch.object(downloads.time,'time',return_value=100):downloads.scan([folder],state)
   with patch.object(downloads.converter,'MAX_BYTES',3),patch.object(downloads.time,'time',return_value=104):
    self.assertIn('theme-only',downloads.scan([folder],state)['errors'][0])

 def test_unrelated_general_ini_is_not_imported_as_a_theme(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);source=root/'unrelated.zip'
   with zipfile.ZipFile(source,'w') as archive:archive.writestr('settings.ini','[GENERAL]\nname=Other application\n')
   self.assertEqual(downloads.install(source),[])

 def test_generic_add_theme_action_converts_raw_wiiflow_zip(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);source=root/'Downloaded.zip'
   with zipfile.ZipFile(source,'w') as archive:archive.writestr('Blue.ini','[MAIN/BG]\n[_COVERFLOW_1]\ncenter_pos=0,0,2\n')
   media=types.SimpleNamespace(ensure=lambda _:{'success':True},catalog=lambda:{'wiiflow-default':{'files':[]}})
   with patch.dict(sys.modules,{'frame_media':media}),patch.object(data_themes,'user_root',return_value=str(root/'installed')):
    result=data_themes.import_file(str(source));self.assertTrue(result['ok'],result);self.assertTrue(result['id'].startswith('wiiflow-'))

 def test_waits_for_file_stability_and_retries_after_completion(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);folder=root/'Downloads';folder.mkdir();state=root/'state.json'
   partial=folder/'Theme.zip.crdownload';partial.write_bytes(b'partial')
   self.assertEqual(downloads.scan([folder],state)['pending'],0)
   target=folder/'Theme.zip';partial.rename(target)
   with patch.object(downloads.time,'time',return_value=100):self.assertEqual(downloads.scan([folder],state)['pending'],1)
   with patch.object(downloads.time,'time',return_value=104):self.assertEqual(downloads.scan([folder],state)['pending'],1)
   with zipfile.ZipFile(target,'w') as z:z.writestr('A.ini','[MAIN/BG]\n')
   with patch.object(downloads.time,'time',return_value=105):self.assertEqual(downloads.scan([folder],state)['pending'],1)
   with patch.object(downloads,'install',return_value=[{'id':'wiiflow-test','name':'Test'}]) as install,patch.object(downloads.time,'time',return_value=108):
    self.assertEqual(len(downloads.scan([folder],state)['imported']),1)
    self.assertEqual(downloads.scan([folder],state)['imported'],[]);self.assertEqual(install.call_count,1)
 def test_extracted_folders_and_rar_have_actionable_status(self):
  with tempfile.TemporaryDirectory() as temp:
   root=Path(temp);folder=root/'Downloads';(folder/'Blue').mkdir(parents=True);(folder/'Blue/BLUE.INI').write_text('[MAIN/BG]\n');(folder/'a.rar').write_bytes(b'rar')
   state=root/'state.json'
   with patch.object(downloads.time,'time',return_value=100):downloads.scan([folder],state)
   with patch.object(downloads,'install',side_effect=lambda path: [{'id':'blue','name':'Blue'}] if path.is_dir() else (_ for _ in ()).throw(ValueError('extract this archive'))),patch.object(downloads.time,'time',return_value=104):
    result=downloads.scan([folder],state);self.assertEqual(len(result['imported']),1);self.assertIn('extract',result['errors'][0])
if __name__=='__main__':unittest.main()
