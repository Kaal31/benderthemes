import json,struct,sys,os,unittest
sys.path.insert(0,os.path.join(os.path.dirname(__file__),'..','py_modules'))
from x360_scene import decode_xur
from x360_themes import _png

def scene(strings,body,vectors=b''):
 blocks={'STRN':b''.join(struct.pack('>H',len(s))+s.encode('utf-16-be') for s in strings),'VECT':vectors,'DATA':body};offset=20+12*len(blocks);table=b'';payload=b''
 for name,data in blocks.items():table+=struct.pack('>4sII',name.encode(),offset,len(data));payload+=data;offset+=len(data)
 return b'XUIB'+struct.pack('>IIHIH',5,0,12,offset,len(blocks))+table+payload
class SceneTests(unittest.TestCase):
 def test_geometry_and_text(self):
  # XuiText: Element Width and Position, Text.Text string.
  body=struct.pack('>HBH',1,1,3)+bytes([1,10])+struct.pack('>fI',123,0)+bytes([1,1])+struct.pack('>H',2)
  r=decode_xur(scene(['XuiText','Hello'],body,struct.pack('>fff',10,20,0)))
  self.assertEqual(r['root']['properties'],{'Width':123,'Position':[10,20,0],'Text':'Hello'})
 def test_duplicate_child_id_scope_and_timeline(self):
  # Timeline targets the immediate XuiText child named SAME, not its parent with the same ID.
  root=struct.pack('>HBH',1,7,1)+bytes([1,1])+struct.pack('>H',2)+bytes([0])+struct.pack('>I',1)
  child=struct.pack('>HBH',3,1,1)+bytes([1,1])+struct.pack('>H',2)+bytes([0])
  frames=struct.pack('>I',0)
  timeline=struct.pack('>IHI',1,2,1)+bytes([1,1,6])+struct.pack('>II',1,0)+bytes([0,0,0,0])+struct.pack('>f',.5)
  r=decode_xur(scene(['XuiCanvas','SAME','XuiText'],root+child+frames+timeline))
  self.assertEqual(r['root']['timelines'][0]['keys'][0]['values'][0]['path'],['Opacity'])
 def test_truncation_and_unknown_class(self):
  d=scene(['NotRegistered'],struct.pack('>HBH',1,1,0))
  with self.assertRaisesRegex(ValueError,'Unknown XUI class'):decode_xur(d)
  with self.assertRaises(ValueError):decode_xur(d[:-1])
 def test_horizontal_blur_inheritance(self):
  # Element ID followed by XuiEffect's string reference, then an empty blur-class block.
  body=struct.pack('>HBH',1,1,2)+bytes([1,1])+struct.pack('>H',2)+bytes([1,1])+struct.pack('>H',2)+bytes([0])
  r=decode_xur(scene(['XuiHBlurEffect','HorizontalBlur'],body))
  self.assertEqual(r['root']['properties'],{'Id':'HorizontalBlur','EffectReference':'HorizontalBlur'})
 def test_nonfinite_float(self):
  body=struct.pack('>HBH',1,1,1)+bytes([1,2])+struct.pack('>f',float('inf'))+bytes([0])
  with self.assertRaisesRegex(ValueError,'Invalid XUR float'):decode_xur(scene(['XuiCanvas'],body))
if __name__=='__main__':unittest.main()
