import struct,sys,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
from x360_directx import read_x_mesh

def fixture(bad_index=False):
 def token(n):return struct.pack('<H',n)
 def name(s):return token(1)+struct.pack('<I',len(s))+s.encode()
 def ints(xs):return token(6)+struct.pack('<I',len(xs))+struct.pack('<'+'I'*len(xs),*xs)
 def floats(xs):return token(7)+struct.pack('<I',len(xs))+struct.pack('<'+'f'*len(xs),*xs)
 def obj(kind,body):return name(kind)+token(10)+body+token(11)
  # Inline material also works; the material filename drives the cover surface group.
 texture=obj('TextureFilename',token(2)+struct.pack('<I',len(b'CoverTexture.dds\0'))+b'CoverTexture.dds\0')
 material=obj('Material',floats([1,1,1,1])+texture)
 mesh=ints([3])+floats([0,0,0,1,0,0,0,1,0])+ints([1,3,0,1,99 if bad_index else 2])
 mesh+=obj('MeshTextureCoords',ints([3])+floats([0,0,1,0,0,1]))
 mesh+=obj('MeshNormals',ints([3])+floats([0,0,1]*3)+ints([1,3,0,1,2]))
 mesh+=obj('MeshMaterialList',ints([1,1,0])+material)
 return b'xof 0302bin 0032'+obj('Mesh',mesh)

class DirectXTests(unittest.TestCase):
 def test_triangle_uv_and_material(self):
  result=read_x_mesh(fixture());self.assertEqual(result['indices'],[0,1,2]);self.assertEqual(result['uv'],[0,0,1,0,0,1]);self.assertEqual(result['groups'][0]['texture'],'CoverTexture')
 def test_invalid_index_and_truncation(self):
  for raw in [fixture(True),fixture()[:-1],b'xof 0302bin 0032'+struct.pack('<HI',7,0xffffffff)]:
   with self.assertRaises(ValueError):read_x_mesh(raw)
 def test_encoding(self):
  with self.assertRaises(ValueError):read_x_mesh(b'xof 0302txt 0032')
if __name__=='__main__':unittest.main()
