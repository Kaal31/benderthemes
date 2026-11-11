import io,os,struct,sys,tempfile,unittest
sys.path.insert(0,os.path.join(os.path.dirname(__file__),'..','py_modules'))
import x360_xzp as Z
import x360_themes as X

def package(files):
 table=b'';payload=b''
 for name,data in files:
  encoded=name.encode('utf-16-be');table+=struct.pack('>IIB',len(data),len(payload),len(encoded)//2)+encoded;payload+=data
 return b'XUIZ'+struct.pack('>IIIIH',1,22+len(table)+len(payload),0,len(table),len(files))+table+payload

class XzpTests(unittest.TestCase):
 def test_settings_trailing_editor_bytes_recovered(self):
  xml=b'<Coverflow><Count data="24" /></Coverflow>'
  clean,recovered=Z.settings_payload(xml+b'\x82\x82stale buffer')
  self.assertEqual(clean,xml)
  self.assertTrue(recovered)
 def test_settings_recovery_does_not_accept_broken_tree_or_entities(self):
  for xml in [b'<root><bad></root>\x82',b'<root><!ENTITY x "y"></root>junk']:
   with self.assertRaises(ValueError):Z.settings_payload(xml)
 def read(self,data):
  with tempfile.NamedTemporaryFile(delete=False,suffix='.xzp') as f:f.write(data);path=f.name
  try:return X.read_x360(path),X.peek(path)
  finally:os.unlink(path)
 def test_missing_quickview_placeholder_uses_declared_skin_fallback(self):
  png=X._png(8,8,bytes([20,40,60])*64)
  xml=b'<skin><settings><QuickView><MISSING>Images/Icons/QuickView/Aurora.Skin.QV.White.MissingIcon.dds</MISSING><ICON>Images/Icons/DVDPanel/Aurora.Skin.Missing.Icon.Small.png</ICON></QuickView></settings></skin>'
  r,_=self.read(package([('skin.xml',xml),('Images/Icons/DVDPanel/Aurora.Skin.Missing.Icon.Small.png',png)]))
  key='images/icons/quickview/aurora.skin.qv.white.missingicon.dds'
  self.assertIn(key,r['sceneResourceFallbacks'])
  self.assertIn(key,r['sceneAssets'])
  self.assertNotIn(key,r['missingSceneAssets'])
 def test_skin_runtime_configuration_is_preserved(self):
  xml=b'<skin><settings><CoverFlow><Instance id="CoverFlow"><ENABLEDEFAULT>TRUE</ENABLEDEFAULT><LAYOUTCOUNT>0</LAYOUTCOUNT><GAMECOVERXBGBOXARTID>1</GAMECOVERXBGBOXARTID></Instance></CoverFlow></settings></skin>'
  r,_=self.read(package([('skin.xml',xml)]))
  rows=r['sceneSettings']['skin.xml'];instance=next(x for x in rows if x['tag']=='instance')
  self.assertEqual(instance['values']['enabledefault'],'TRUE')
  self.assertEqual(instance['values']['layoutcount'],'0')
  self.assertEqual(instance['values']['gamecoverxbgboxartid'],'1')
 def test_fsd_wallpaper(self):
  png=X._png(640,360,bytes([20,40,60])*640*360)
  r,kind=self.read(package([('skin.xml',b'<skin><settings><Skin>Sample FSD</Skin><Author>Test</Author></settings></skin>'),('Images\\Wallpapers\\one.png',png)]))
  self.assertEqual(kind,'theme');self.assertEqual(r['family'],'fsd');self.assertEqual(r['name'],'Sample FSD');self.assertTrue(r['background']);self.assertFalse(r['compatibility']['layout']);self.assertEqual(len(r['backgroundDigest']),64)
 def test_aurora_preview_is_not_wallpaper(self):
  png=X._png(640,360,bytes([40,20,60])*640*360)
  r,_=self.read(package([('skin.xml',b'<skin/>'),('skin.meta',b'{"skinname":"Test Aurora","author":"Tester"}'),('Preview.png',png)]))
  self.assertEqual(r['family'],'aurora');self.assertTrue(r['preview']);self.assertIsNone(r['background'])
 def test_malformed_metadata_falls_back(self):
  r,_=self.read(package([('skin.xml',b'<skin/>'),('skin.meta',b'{}junk')]))
  self.assertIsNotNone(r);self.assertTrue(any('malformed' in w for w in r['warnings']))
 def test_no_skin(self):self.assertEqual(self.read(package([('code.xur',b'not executed')])),(None,None))
 def test_traversal_duplicate_and_absolute(self):
  for name in ['../skin.xml','/skin.xml','C:/skin.xml','a//skin.xml']:
   self.assertEqual(self.read(package([(name,b'<skin/>')])),(None,None))
  self.assertEqual(self.read(package([('skin.xml',b'<skin/>'),('SKIN.XML',b'<skin/>')])),(None,None))
 def test_truncated_and_corrupt_offsets(self):
  valid=package([('skin.xml',b'<skin/>')]);bad=bytearray(valid);struct.pack_into('>I',bad,26,0xffffff)
  for data in [valid[:21],valid[:-1],bytes(bad),b'nope']:
   self.assertEqual(self.read(data),(None,None))
 def test_xml_visual_resources_and_case_layout(self):
  png=X._png(2,2,bytes([20,40,60])*4)
  r,_=self.read(package([('skin.xml',b'<skin><fonts><font default="true" name="DifferentAlias" file="Font/custom.ttf"/></fonts></skin>'),('XML/VisualList.xml',b'<visuallist><visual path="XML/SonicVisual.xml"/></visuallist>'),('XML/SonicVisual.xml',b'<visual><iconlist><icon name="Disc"><iconpath>Images/custom.png</iconpath></icon></iconlist></visual>'),('Images/custom.png',png),('XML/CLayout.xml',b'<Coverflow><Layout><CameraPos x="0" y="0.5" z="5"/><CenterPos x="0" y="0" z="1"/></Layout></Coverflow>')]))
  self.assertEqual(r['sceneFonts']['__default'],'font/custom.ttf');self.assertIn('images/custom.png',r['sceneAssets']);self.assertEqual(r['sceneSettings']['xml/sonicvisual.xml'][2]['values']['iconpath'],'Images/custom.png');self.assertEqual(r['coverflow']['modes'][0]['camera']['position'],[0,.5,-5])
 def test_bare_resource_names_are_unambiguous(self):
  entries={'images/disc/icon.png':{'path':'Images/Disc/Icon.png'},'other/icon.png':{'path':'Other/Icon.png'}}
  self.assertEqual(Z.resolve_resource('Images\\Disc\\ICON.png',entries),entries['images/disc/icon.png'])
  self.assertIsNone(Z.resolve_resource('icon.png',entries))
  self.assertIsNone(Z.resolve_resource('stale/icon.png',entries))
  del entries['other/icon.png']
  self.assertEqual(Z.resolve_resource('ICON.png',entries),entries['images/disc/icon.png'])
 def test_background_subfolder_repair_is_unique_and_scoped(self):
  entries={'images/background/squad/1.png':{'path':'Images/Background/Squad/1.png'}}
  self.assertEqual(Z.resolve_resource('Images/Background/1.png',entries),entries['images/background/squad/1.png'])
  self.assertIsNone(Z.resolve_resource('Other/1.png',entries))
  entries['images/background/other/1.png']={'path':'Images/Background/Other/1.png'}
  self.assertIsNone(Z.resolve_resource('Images/Background/1.png',entries))
 def test_entities_rejected(self):
  self.assertIsNone(self.read(package([('skin.xml',b'<!DOCTYPE skin [<!ENTITY a "foo">]><skin>&a;</skin>')]))[0])
if __name__=='__main__':unittest.main()
