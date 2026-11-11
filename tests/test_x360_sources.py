import io,json,os,struct,sys,tempfile,unittest,zipfile
from pathlib import Path
sys.path.insert(0,os.path.join(os.path.dirname(__file__),'..','py_modules'))
import x360_sources as S
from x360_coverflow import read_layout
from x360_xur import inspect_xur
from test_x360_xzp import package

def archive(path,files):
 with zipfile.ZipFile(path,'w') as z:
  for n,d in files:z.writestr(n,d)
class SourceTests(unittest.TestCase):
 def test_collection_all_members(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d,'skins.zip');archive(p,[('A.xzp',package([('skin.xml',b'<skin><settings><Skin>A</Skin></settings></skin>')])),('B.xzp',package([('skin.xml',b'<skin><settings><Skin>B</Skin></settings></skin>')]))])
   choices=S.variants(p);self.assertEqual(len(choices),2);self.assertIsNone(S.read_source(p));self.assertEqual([S.read_source(p,v['id'])['name'] for v in choices],['A','B'])
 def test_nested_zip(self):
  with tempfile.TemporaryDirectory() as d:
   inner=io.BytesIO()
   with zipfile.ZipFile(inner,'w') as z:z.writestr('Skins/Default.xzp',package([('skin.xml',b'<skin/>')]))
   p=Path(d,'outer.zip');archive(p,[('release.zip',inner.getvalue())]);v=S.variants(p);self.assertEqual(len(v),1);self.assertTrue(S.read_source(p,v[0]['id']))
 def test_extracted_zip_and_folder(self):
  with tempfile.TemporaryDirectory() as d:
   root=Path(d,'loose');root.mkdir();(root/'skin.xml').write_text('<skin><settings><Skin>Loose</Skin></settings></skin>')
   v=S.variants(root);self.assertEqual(S.read_source(root,v[0]['id'])['name'],'Loose')
   p=Path(d,'folder.zip');archive(p,[('Skin/skin.xml',b'<skin><settings><Skin>Zipped</Skin></settings></skin>')]);v=S.variants(p);self.assertEqual(S.read_source(p,v[0]['id'])['name'],'Zipped')
 def test_bad_archive_and_member(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d,'bad.zip');archive(p,[('../skin.xml',b'<skin/>')])
   with self.assertRaises(ValueError):S.variants(p)
   p=Path(d,'good.zip');archive(p,[('a.xzp',b'XUIZ')])
   with self.assertRaises(ValueError):
    with S.selected(p,'zip:../a.xzp'):pass
 def test_layout(self):
  data={'info':{'name':'Test'},'properties':{'rows':1,'columns':7,'pagesize':4},'modes':[{'name':'Normal','covers':{'position':{'center':[0,0,-3]},'scale':{'center':[1,1,1]}}}]}
  self.assertEqual(read_layout(json.dumps(data))['info']['name'],'Test')
  data['modes'][0]['covers']['position']['center']=[float('nan'),0,0]
  with self.assertRaises(ValueError):read_layout(json.dumps(data))
 def test_standalone_layout_and_archive(self):
  import x360_themes as X
  data=json.dumps({'info':{'name':'Direct layout'},'properties':{'rows':1,'columns':5,'pagesize':3},'modes':[{'name':'Normal','covers':{}}]}).encode()
  with tempfile.TemporaryDirectory() as d:
   p=Path(d,'test.cfljson');p.write_bytes(data)
   self.assertEqual(X.peek(p),'theme');self.assertEqual(X.read_x360(p)['name'],'Direct layout')
   z=Path(d,'layout.zip');archive(z,[('Layouts/Test.cfljson',data)])
   choice=S.variants(z)[0];self.assertEqual(S.read_source(z,choice['id'])['name'],'Direct layout')
 def test_zip_symlink_rejected(self):
  with tempfile.TemporaryDirectory() as d:
   p=Path(d,'linked.zip')
   with zipfile.ZipFile(p,'w') as z:
    entry=zipfile.ZipInfo('skin.xml');entry.create_system=3;entry.external_attr=0o120777<<16;z.writestr(entry,'../outside')
   with self.assertRaises(ValueError):S.variants(p)
 def test_xur_bounds_and_strings(self):
  strings=struct.pack('>H',8)+'XuiScene'.encode('utf-16-be');length=32+len(strings)
  data=b'XUIB'+struct.pack('>IIHIH',5,0,12,length,1)+struct.pack('>4sII',b'STRN',32,len(strings))+strings
  self.assertEqual(inspect_xur(data)['classes'],['XuiScene'])
  with self.assertRaises(ValueError):inspect_xur(data[:-1])
if __name__=='__main__':unittest.main()
