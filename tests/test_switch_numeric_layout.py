import struct,sys,tempfile,unittest
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'tools'))
from switch_numeric_layout import numeric_layout

class NumericPartTests(unittest.TestCase):
 def decode(self,basic,material_usage=0):
  body=bytearray(344);body[0]=1;body[2]=255;body[4:12]=b'Instance';struct.pack_into('<Iff',body,76,1,1,1)
  body[88:91]=b'ink';body[113]=basic;body[114]=material_usage;struct.pack_into('<III',body,116,144,0,284)
  body[128:133]=b'Part\0';body[136:140]=b'pic1';struct.pack_into('<I',body,140,136)
  # An embedded picture supplies material data; unflagged basic geometry
  # comes from the referenced layout, even when its embedded sizes differ.
  body[144]=1;body[146]=255;body[148:151]=b'ink';struct.pack_into('<10f',body,180,90,91,92,0,0,0,1,1,999,999)
  for offset in (220,224,228,232):body[offset:offset+4]=bytes([255]*4)
  struct.pack_into('<H',body,236,0)
  info=276;struct.pack_into('<3f',body,info+8,7,-8,9);struct.pack_into('<3f',body,info+20,10,20,30);struct.pack_into('<2f',body,info+32,.5,2);struct.pack_into('<2f',body,info+40,840,2);body[info+48]=192
  following=bytearray(76);following[0]=1;following[2]=255;following[4:8]=b'Next'
  data=bytearray(20);data[:4]=b'FLYT';data[4:6]=b'\xff\xfe';struct.pack_into('<HI',data,6,20,0x09000000)
  data+=b'prt1'+struct.pack('<I',len(body)+8)+body+b'pan1'+struct.pack('<I',84)+following
  def pane(name,type):return dict(name=name,parent=None,type=type,position=[0,0,0],rotation=[0,0,0],scale=[1,1],size=[10,10],alpha=255,visible=True,origin=0)
  analysis={'a/F.bflyt':{'panes':[pane('Instance','prt1'),pane('Next','pan1')],'materials':[{'name':'embedded','white':[200,201,202,203],'black':[0,0,0,0]}]}}
  with tempfile.TemporaryDirectory() as root:
   path=Path(root)/'a';path.mkdir();(path/'F.bflyt').write_bytes(data)
   return numeric_layout(Path(root),analysis,'F',lambda f,n:f+':'+n)[2]
 def test_only_flagged_instance_fields_override_geometry(self):
  nodes=self.decode(1|8|16|32|64|128);self.assertEqual(len(nodes),2)
  override=nodes[0]['partOverrides']['ink'];self.assertEqual(override['geometry'],{'Visible':False,'Position':{'X':7,'Y':-8,'Z':9},'Rotation':{'X':10,'Y':20,'Z':30},'Scale':{'X':.5,'Y':2},'Size':{'X':840,'Y':2}})
  self.assertEqual(override['alpha'],192);self.assertEqual(override['material'],'F:embedded')
 def test_zero_flags_preserve_referenced_geometry_and_full_material(self):
  nodes=self.decode(0);override=nodes[0]['partOverrides']['ink'];self.assertNotIn('geometry',override);self.assertNotIn('alpha',override);self.assertEqual(override['effect']['white'],[200,201,202,203])
  self.assertTrue(all(node['effect']['shadowDraw'] is False and node['effect']['borderDraw'] is False for node in nodes),'Absent DrawMode fields must not enable a shader effect')
 def test_partial_material_usage_does_not_replace_the_entire_material(self):
  override=self.decode(16,1)[0]['partOverrides']['ink'];self.assertNotIn('material',override);self.assertNotIn('effect',override);self.assertEqual(override['geometry']['Size'],{'X':840,'Y':2})

if __name__=='__main__':unittest.main()
