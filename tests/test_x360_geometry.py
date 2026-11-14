import struct,sys,os,unittest,zlib
sys.path.insert(0,os.path.join(os.path.dirname(__file__),'..','py_modules'))
from x360_geometry import read_xbg7,read_xpr2

def mesh():
 system=584;video=104;data=bytearray(16+system+video);data[:4]=b'XBG\x07';struct.pack_into('>III',data,4,system,video,1);struct.pack_into('>16f',data,80,*[1 if i%5==0 else 0 for i in range(16)]);struct.pack_into('>I',data,144,160);m=160
 struct.pack_into('>I',data,m+24,11);struct.pack_into('>I',data,m+32,3);struct.pack_into('>I',data,m+60,0);struct.pack_into('>I',data,m+68,3)
 for i,(offset,kind,usage) in enumerate([(0,0x2a23b9,0),(12,0x2a23b9,3),(24,0x2c23a5,5)]):struct.pack_into('>HHIBBH',data,m+72+i*12,0,offset,kind,0,usage,0)
 struct.pack_into('>III',data,m+268,32,4,1);sub=m+280;struct.pack_into('>4f',data,sub,1,1,1,1);data[sub+72:sub+84]=b'CoverTexture';struct.pack_into('>5I',data,sub+136,0,3,0,3,1);base=16+system;struct.pack_into('>3H',data,base,0,1,2)
 for i,(x,y,u,v) in enumerate([(0,0,0,0),(1,0,1,0),(0,1,0,1)]):struct.pack_into('>8f',data,base+8+i*32,x,y,0,0,0,1,u,v)
 return bytes(data)
def texture():
 syslen=256;d=bytearray(12+syslen+64);d[:4]=b'XPR2';struct.pack_into('>III',d,4,syslen,64,1);struct.pack_into('>4sIII',d,16,b'TX2D',64,52,24);d[36:41]=b'Test\0';struct.pack_into('>6I',d,12+64+28,(1<<22)|2,18|64,3|(3<<13),0xd10,0,0x400);block=bytearray(struct.pack('<HHI',0xf800,0xf800,0));block[0::2],block[1::2]=block[1::2],block[0::2];d[12+syslen:12+syslen+8]=block;return bytes(d)
class GeometryTests(unittest.TestCase):
 def test_mesh_groups_and_uv(self):
  r=read_xbg7(mesh());self.assertEqual(r['indices'],[0,1,2]);self.assertEqual(r['positions'],[0,0,0,1,0,0,0,1,0]);self.assertEqual(r['groups'][0]['texture'],'CoverTexture')
 def test_mesh_bounds(self):
  d=bytearray(mesh());struct.pack_into('>I',d,160+24,0xfffffff0)
  with self.assertRaises(ValueError):read_xbg7(d)
  with self.assertRaises(ValueError):read_xbg7(mesh()[:-1])
 def test_linear_dxt_endianness_and_padding(self):
  textures,failures=read_xpr2(texture());self.assertEqual(failures,[]);r=textures['Test'];self.assertEqual((r['w'],r['h']),(4,4));png=r['png'];p=8;raw=b''
  while p<len(png):
   n=struct.unpack_from('>I',png,p)[0]
   if png[p+4:p+8]==b'IDAT':raw+=png[p+8:p+8+n]
   p+=12+n
  pixels=zlib.decompress(raw);self.assertEqual(pixels[1:5],bytes([255,0,0,255]))
 def test_tiled_format_reported(self):
  d=bytearray(texture());struct.pack_into('>I',d,12+64+28,0x80000000|(1<<22)|2);r,failures=read_xpr2(bytes(d));self.assertFalse(r);self.assertEqual(len(failures),1)
if __name__=='__main__':unittest.main()
