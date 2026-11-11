import struct,sys,unittest
sys.path.insert(0,'py_modules')
from x360_fonts import browser_font
class Fonts(unittest.TestCase):
 def test_stripped_font_metadata(self):
  head=bytearray(54);struct.pack_into('>h',head,50,1)
  hhea=bytearray(36);struct.pack_into('>hhh',hhea,4,800,-200,0)
  tables={b'head':bytes(head),b'hhea':bytes(hhea),b'hmtx':b'\0'*8,b'loca':b'\0'*12,b'glyf':b'',b'cmap':b'\0'*4,b'name':b'\0'*6}
  out=bytearray(struct.pack('>IHHHH',0x10000,len(tables),0,0,0));payload=bytearray()
  for tag,value in tables.items():out+=struct.pack('>4sIII',tag,0,12+16*len(tables)+len(payload),len(value));payload+=value
  fixed=browser_font(bytes(out+payload));count=struct.unpack_from('>H',fixed,4)[0];decoded={}
  for i in range(count):
   tag,_,off,n=struct.unpack_from('>4sIII',fixed,12+16*i);decoded[tag]=fixed[off:off+n]
  self.assertEqual(decoded[b'glyf'],b'');self.assertEqual(decoded[b'hmtx'],tables[b'hmtx']);self.assertEqual(struct.unpack_from('>H',decoded[b'maxp'],4)[0],2)
  self.assertIn(b'OS/2',decoded);self.assertIn(b'post',decoded);self.assertEqual(browser_font(fixed),fixed)
 def test_passthrough(self):self.assertEqual(browser_font(b'not a font'),b'not a font')
if __name__=='__main__':unittest.main()
