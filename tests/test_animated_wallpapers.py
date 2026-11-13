import json,sys,tempfile,unittest,zipfile
from pathlib import Path
from unittest.mock import patch
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import animated_wallpapers as aw
import wallpaper_workshop as ww
from rainmeter.compiler import make_scene,export,ImportErrorRM,canonical
ROOT=Path(__file__).resolve().parents[1]

class AnimatedWallpapersTests(unittest.TestCase):
 def test_real_gif_webm_import_offline_and_remove(self):
  with tempfile.TemporaryDirectory() as folder:
   for file in ['animated-wallpaper.gif','animated-wallpaper.webm']:
    source=ROOT/'tests/fixtures/media'/file
    r=aw.import_source(folder,source)
    self.assertEqual(len(aw.list_items(folder)),1)
    self.assertTrue((Path(folder)/'wallpapers'/r['file']).is_file())
    self.assertTrue(source.is_file())
    again=aw.import_source(folder,source);self.assertEqual(again['id'],r['id'])
    aw.remove(folder,r['id']);self.assertEqual(aw.list_items(folder),[])
 def test_reject_fake_media_and_static_gif(self):
  with tempfile.TemporaryDirectory() as folder:
   p=Path(folder)/'bad.mp4';p.write_bytes(b'not a movie')
   with self.assertRaises(ValueError):aw.media_info(p)
   # One-frame transparent GIF.
   import base64
   p=Path(folder)/'static.gif';p.write_bytes(base64.b64decode('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'))
   with self.assertRaisesRegex(ValueError,'static'):aw.media_info(p)
 def test_workshop_project_type_and_path_validation(self):
  with tempfile.TemporaryDirectory() as folder:
   p=Path(folder);(p/'loop.webm').write_bytes((ROOT/'tests/fixtures/media/animated-wallpaper.webm').read_bytes())
   project=p/'project.json'
   for kind in ['scene','web']:
    project.write_text(json.dumps({'type':kind,'file':'loop.webm','preview':'preview.gif'}))
    with self.assertRaisesRegex(ValueError,'video projects'):aw.project_media(p)
   for file in ['../outside.mp4','C:\\outside.mp4','/outside.mp4']:
    project.write_text(json.dumps({'type':'video','file':file}))
    with self.assertRaises(ValueError):aw.project_media(p)
   project.write_text(json.dumps({'type':'video','title':'Workshop Loop','file':'loop.webm'}))
   r=aw.import_source(p/'data',project);self.assertEqual(r['source'],'wallpaper-engine');self.assertEqual(r['format'],'WebM')
 def test_rainmeter_root_resources_variants_and_bindings(self):
  with tempfile.TemporaryDirectory() as folder:
   p=Path(folder);source=p/'skin';(source/'Suite/Clock').mkdir(parents=True);(source/'Suite/@Resources').mkdir()
   (source/'Suite/@Resources/icon.png').write_bytes(bytes.fromhex('89504e470d0a1a0a')+b'fixture')
   (source/'Suite/@Resources/Style.inc').write_text('[Variables]\nAccent=100,200,250,255\n')
   skin='[Rainmeter]\n@Include=#@#Style.inc\n[Title]\nMeter=String\nText=Library\nFontColor=#Accent#\n[Icon]\nMeter=Image\nImageName=#@#icon.png\nW=20\nH=20\n'
   (source/'Suite/Clock/Light.ini').write_text(skin);(source/'Suite/Clock/Dark.ini').write_text(skin)
   info=aw.inspect_source(source);self.assertEqual(len(info['configs']),2)
   chosen='Suite/Clock/Light.ini';bindings={chosen+'::Title':{'type':'open','place':'library'}}
   r=aw.import_source(p/'data',source,[chosen],bindings)
   scene=json.loads((p/'data/themes'/r['themeId']/'runtime.json').read_text())
   self.assertEqual(len(scene['configs']),1);self.assertEqual(scene['configs'][0]['source'],chosen)
   self.assertEqual(len(scene['assets']),1)
   self.assertEqual(scene['configs'][0]['meters'][0]['binding']['place'],'library')
   self.assertFalse(any('Unresolved' in w['reason'] for w in r['report']['warnings']))
   with self.assertRaises(ValueError):aw.import_source(p/'data',source,[])
 def test_archive_traversal_and_actions_stay_inert(self):
  with tempfile.TemporaryDirectory() as folder:
   p=Path(folder)/'bad.rmskin'
   with zipfile.ZipFile(p,'w') as z:z.writestr('../outside.ini','[X]')
   with self.assertRaises(ImportErrorRM):aw.inspect_source(p)
   p=Path(folder)/'skin';p.mkdir();(p/'Panel.ini').write_text('[Rainmeter]\n[Button]\nMeter=String\nText=Open\nLeftMouseUpAction=[notepad.exe]\n')
   report=aw.inspect_source(p)['report'];self.assertTrue(any('action' in w['reason'] for w in report['warnings']))
   with self.assertRaises(ImportErrorRM):aw.import_source(Path(folder)/'data',p,None,{'Panel.ini::Button':{'type':'shell','command':'bad'}})
 def test_remove_id_does_not_escape_storage(self):
  with tempfile.TemporaryDirectory() as folder:
   outside=Path(folder)/'keep';outside.write_text('keep')
   with self.assertRaises(ValueError):aw.remove(folder,'../keep')
   self.assertTrue(outside.exists())
 def test_partial_provider_failure_keeps_other_source(self):
  with tempfile.TemporaryDirectory() as folder,patch.object(aw,'wallspace_page',return_value={'items':[{'id':'wallspace:1'}],'hasMore':False}),patch.object(aw,'workshop_page',side_effect=ValueError('offline')):
   r=aw.browse(folder);self.assertEqual(len(r['items']),1);self.assertEqual(r['errors'][0]['source'],'wallpaper-engine')
 def test_download_command_is_argument_array(self):
  args=ww.command('DepotDownloader','123456','target folder','user',True)
  self.assertIn('-pubfile',args);self.assertIn('-qr',args);self.assertNotIn('-password',args)
  with self.assertRaises(ValueError):ww.command('tool','123;whoami','dest')
 def test_workshop_discovery_from_libraryfolders(self):
  with tempfile.TemporaryDirectory() as folder:
   home=Path(folder);steam=home/'.local/share/Steam/steamapps';steam.mkdir(parents=True)
   sd=home/'sd/steamapps';project=sd/'workshop/content/431960/123456';project.mkdir(parents=True)
   (steam/'libraryfolders.vdf').write_text('"libraryfolders" { "0" { "path" "'+str(home/'sd').replace('\\','/')+'" } }')
   (project/'project.json').write_text(json.dumps({'type':'video','file':'loop.webm'}))
   (project/'loop.webm').write_bytes((ROOT/'tests/fixtures/media/animated-wallpaper.webm').read_bytes())
   self.assertEqual(len(aw.discover_workshop(home)),1)

 def test_mp4_audio_only_or_truncated_rejected(self):
  with tempfile.TemporaryDirectory() as folder:
   p=Path(folder)/'fake.mp4';p.write_bytes(b'\x00\x00\x00\x18ftypisom'+b'\0'*12)
   with self.assertRaises(ValueError):aw.media_info(p)
 def test_provider_cursors_are_independent(self):
  with tempfile.TemporaryDirectory() as folder,patch.object(aw,'wallspace_page',return_value={'items':[{'id':'w'}],'hasMore':False}) as w,patch.object(aw,'workshop_page',return_value={'items':[{'id':'s'}],'hasMore':True}) as s:
   r=aw.browse(folder,page={'wallspace':1,'wallpaper-engine':3})
   self.assertEqual(r['cursors'],{'wallspace':None,'wallpaper-engine':4})
   aw.browse(folder,page=r['cursors']);self.assertEqual(w.call_count,1);self.assertEqual(s.call_args.args[1],4)
 def test_wallspace_metadata_validated_before_download(self):
  with patch.object(aw,'wallspace_api',return_value={'wallpapers':[{'key':123456,'is_pro':True}]}):
   with self.assertRaisesRegex(ValueError,'Pro'):aw.wallspace_media('123456')
  with self.assertRaises(ValueError):aw.wallspace_media('../123456')
  with patch.object(aw,'wallspace_api',return_value={'wallpapers':[{'key':123456,'title':'Free item','is_pro':False}]}):
   self.assertEqual(aw.wallspace_media('123456')['url'],'https://s4.wallspace.app/wallpaper/123456/master.mp4')
 def test_thumbnail_validation_and_format(self):
  with tempfile.TemporaryDirectory() as folder:
   item=aw.import_source(folder,ROOT/'tests/fixtures/media/animated-wallpaper.gif')
   with self.assertRaises(ValueError):aw.save_poster(folder,item['id'],'data:text/html;base64,AAA')
   with self.assertRaises(ValueError):aw.save_poster(folder,'../../oops','data:image/png;base64,AAA')
 def test_worker_rejects_second_job(self):
  with patch.object(ww,'_worker_running',True):
   self.assertFalse(ww.start('unused','123456')['ok']);self.assertFalse(ww.start_wallspace('unused','123456')['ok'])

if __name__=='__main__':unittest.main()
