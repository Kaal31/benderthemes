import sys,tempfile,zipfile,unittest,copy,base64,struct,zlib
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
import wii_themes as W
import wii_standard as S
class StandardTests(unittest.TestCase):
 def test_original_standard_runtime(self):
  r=S.standard_skin();s=r['scene'];self.assertFalse(r['compatibility']['baseRequired']);self.assertEqual(r['baseType'],'built-in')
  main=next(l for l in s['layouts'] if l['id']=='chansel/my_ipltop_a');self.assertEqual(len([p for p in main['panes'] if p['name'].startswith('N_Ch_c')]),12)
  self.assertTrue(s['assets']['chansel/my_clock_a1']['ink']);self.assertEqual(s['assets']['chansel/my_clock_aa']['ink'],[])
  r['scene']['layouts'].clear();self.assertGreater(len(S.standard_skin()['scene']['layouts']),5)
 def test_mirrored_resource_contract(self):
  def pixels(name):
   a=S.artwork('chansel/'+name,W);data=base64.b64decode(a['url'].split(',')[1]);pos=8;packed=b''
   while pos<len(data):
    n=struct.unpack_from('>I',data,pos)[0]
    if data[pos+4:pos+8]==b'IDAT':packed+=data[pos+8:pos+8+n]
    pos+=n+12
   raw=zlib.decompress(packed);w=a['width'];stride=w*4+1
   return a,lambda x,y:raw[y*stride+1+x*4+3]
  mask,alpha=pixels('ipltopmask16x9');self.assertEqual((mask['width'],mask['height']),(128,64));self.assertGreater(alpha(0,0),200);self.assertEqual(alpha(90,40),0)
  _,edge=pixels('ipltopmaskedge16x9');self.assertEqual(edge(90,40),0)
  fill,alpha=pixels('my_tvsheet_e');self.assertEqual((fill['width'],fill['height']),(256,64));self.assertGreater(alpha(220,40),200);self.assertEqual(alpha(20,40),0)
  focus,_=pixels('my_tv_f');self.assertEqual((focus['width'],focus['height']),(64,64))
 def test_image_patch_works_without_console_base(self):
  with tempfile.TemporaryDirectory() as d:
   path=Path(d)/'custom.mym';png=W.png_encode(8,8,bytes([30,100,120,255])*64)
   with zipfile.ZipFile(path,'w') as z:
    z.writestr('mym.ini','[simg1]\nfile=layout/common/chansel_ash_out/arc/timg/my_TVSheet_b.tpl\nsource=custom.png\n');z.writestr('custom.png',png)
   r=W.read_wii_theme(str(path));self.assertIsNotNone(r);self.assertFalse(r['compatibility']['baseRequired']);self.assertFalse(r['baseApplied']);self.assertEqual(r['baseType'],'built-in')
   self.assertEqual(r['scene']['assets']['chansel/my_tvsheet_b']['url'],W._data_url(png));self.assertGreater(r['compatibility']['standardLayouts'],0)
   stale=W.read_wii_theme(str(path),base_path=str(Path(d)/'deleted.app'));self.assertEqual(stale['baseType'],'built-in');self.assertTrue(stale['errors']);self.assertFalse(stale['compatibility']['baseRequired'])
 def test_supplied_layout_is_not_replaced(self):
  supplied=copy.deepcopy(S.standard_skin()['scene']);supplied['layouts'][0]['size']=[640,480];before=copy.deepcopy(supplied['layouts'][0]);S.complete(supplied,W);self.assertEqual(supplied['layouts'][0],before)
if __name__=='__main__':unittest.main()
