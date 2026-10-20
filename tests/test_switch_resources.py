import hashlib,json,struct,sys,tempfile,unittest,zlib
from unittest.mock import patch
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
from switch_resources import _bc4,_linear,decode_texture,decode_bntx,import_resources,read_resources,decode_font,font_cell_ratio

def pixels(png):
 w,h=struct.unpack_from('>II',png,16);offset=8;parts=[]
 while offset<len(png):
  size=struct.unpack_from('>I',png,offset)[0]
  if png[offset+4:offset+8]==b'IDAT':parts.append(png[offset+8:offset+8+size])
  offset+=12+size
 raw=zlib.decompress(b''.join(parts));return w,h,b''.join(raw[y*(w*4+1)+1:(y+1)*(w*4+1)] for y in range(h))

class ResourceTests(unittest.TestCase):
 def test_native_font_cell_ratio_uses_sfnt_metrics(self):
  head=bytearray(20);struct.pack_into('>H',head,18,1024)
  os2=bytearray(78);struct.pack_into('>HH',os2,74,1158,378)
  data=struct.pack('>IHHHH',0x10000,2,0,0,0)+struct.pack('>4sIII',b'head',0,44,20)+struct.pack('>4sIII',b'OS/2',0,64,78)+head+os2
  self.assertEqual(font_cell_ratio(decode_font(data)),1.5)
  struct.pack_into('>HH',os2,74,700,324)
  self.assertEqual(font_cell_ratio(decode_font(data[:64]+os2)),1)
 def test_bc4_both_endpoint_orders_and_packed_indices(self):
  indices=sum((i%8)<<(3*i) for i in range(16))
  self.assertEqual(_bc4(bytes([210,0])+indices.to_bytes(6,'little'))[:8],[210,0,180,150,120,90,60,30])
  self.assertEqual(_bc4(bytes([0,250])+indices.to_bytes(6,'little'))[:8],[0,250,50,100,150,200,0,255])
 def test_block_linear_gob_crossing(self):
  # Independent scatter coordinates across horizontal/vertical GOB boundaries.
  w,h,bpp,bh=10,18,8,2;data=bytearray(4096)
  def address(x,y):
   xb=x*8;return (y//16)*2048+(xb//64)*1024+(y%16//8)*512+(xb%64//32)*256+(y%8//2)*64+(xb%32//16)*32+(y%2)*16+xb%16
  for y in range(h):
   for x in range(w):data[address(x,y):address(x,y)+8]=bytes([(y*w+x)%256])*8
  result=_linear(data,w,h,bpp,0,bh)
  self.assertEqual(result,b''.join(bytes([i%256])*8 for i in range(w*h)))
 def test_channel_swizzle_and_linear_pitch(self):
  d=bytearray(512);d[:4]=b'BRTI';struct.pack_into('<H',d,18,1);struct.pack_into('<I',d,28,0xb01);struct.pack_into('<IIIII',d,36,2,1,1,1,0);struct.pack_into('<IIII',d,80,32,32,0x02010101,1);struct.pack_into('<QQQ',d,96,128,0,144);struct.pack_into('<H',d,128,4);d[130:134]=b'Mask';struct.pack_into('<Q',d,144,256);d[256:264]=bytes([17,20,30,40,231,50,60,70])
  name,image,warning=decode_texture(bytes(d),0);self.assertEqual(name,'Mask');self.assertIsNone(warning);self.assertEqual(pixels(image),(2,1,bytes([255,255,255,17,255,255,255,231])))
 def test_font_wrapper_roundtrip_and_corruption(self):
  sfnt=struct.pack('>IHHHH',0x10000,1,0,0,0)+struct.pack('>4sIII',b'test',0,28,4)+b'data'
  mask=1231165446
  wrapped=bytes.fromhex('36f81a1e')+struct.pack('>I',len(sfnt)^mask)+b''.join(struct.pack('>I',int.from_bytes(sfnt[i:i+4],'big')^mask) for i in range(0,len(sfnt),4))
  self.assertEqual(decode_font(wrapped),sfnt);self.assertEqual(decode_font(sfnt),sfnt)
  for bad in [wrapped[:-1],sfnt[:27],sfnt[:24]+struct.pack('>I',400)+sfnt[28:],b'not a font']:
   with self.assertRaises(ValueError):decode_font(bad)
  with tempfile.TemporaryDirectory() as root:
   source=Path(root)/'nintendo_ext2.bfttf';source.write_bytes(wrapped)
   result=import_resources(source,root);self.assertTrue(result['success'],result);self.assertEqual(result['resource'],'FontExtended2')
   fonts=read_resources(root,lambda data,mime:(data,mime))['fonts'];self.assertEqual(fonts['extended2']['source'],(sfnt,'font/ttf'))
   dest=Path(root)/'.resources/FontExtended2.json'
   for font in ['invalid',{'role':'standard','asset':42,'family':'DHTSwitchFontTest'}]:
    dest.write_text(json.dumps({'pictures':{},'font':font}));self.assertTrue(read_resources(root,lambda d,m:'unused')['warnings'])
 def test_corrupt_inputs_and_no_key_processing(self):
  with self.assertRaises(ValueError):decode_bntx(b'keys are not a menu archive')
  with tempfile.TemporaryDirectory() as root:
   source=Path(root)/'broken.szs';source.write_bytes(b'not an archive');result=import_resources(source,root)
   self.assertFalse(result['success']);self.assertFalse((Path(root)/'.resources').exists())
 def test_resource_manifest_blocks_asset_path_traversal(self):
  with tempfile.TemporaryDirectory() as root:
   dest=Path(root)/'.resources';dest.mkdir();(dest/'common.json').write_text(json.dumps({'pictures':{'F':{'P':{'asset':'../secret.png'}}},'textures':{'x':'../secret.png'}}))
   result=read_resources(root,lambda d,m:'unexpected');self.assertEqual(result['pictures'],{});self.assertEqual(result['textures'],{})
 def test_shared_assets_are_encoded_once_and_verified(self):
  with tempfile.TemporaryDirectory() as root:
   dest=Path(root)/'.resources';dest.mkdir();data=b'texture';asset=hashlib.sha256(data).hexdigest()+'.png';(dest/asset).write_bytes(data)
   binding={'asset':asset,'texture':'T','material':'M','uv':[0,0,1,0,0,1,1,1],'transform':[0,0,0,1,1],'wrapS':0,'wrapT':0}
   (dest/'common.json').write_text(json.dumps({'pictures':{'F':{'P':binding,'Q':binding}},'textures':{'T':asset}}))
   calls=[];result=read_resources(root,lambda d,m:calls.append((d,m)) or 'decoded')
   self.assertEqual(len(calls),1);self.assertFalse(result['warnings']);self.assertEqual(result['pictures']['F']['Q']['source'],'decoded')
   (dest/asset).write_bytes(b'corrupted')
   invalid=read_resources(root,lambda d,m:self.fail('Corrupted content must not be encoded'))
   self.assertFalse(invalid['pictures']);self.assertTrue(invalid['warnings'])
 def test_manifest_rejects_nonfinite_uv_and_invalid_shape(self):
  with tempfile.TemporaryDirectory() as root:
   dest=Path(root)/'.resources';dest.mkdir();data=b'texture';asset=hashlib.sha256(data).hexdigest()+'.png';(dest/asset).write_bytes(data)
   for manifest in [[],{'pictures':{'F':{'P':{'asset':asset,'uv':[float('inf')]*8,'transform':[0,0,0,1,1],'wrapS':0,'wrapT':0}}}},{'pictures':{'F':[]}}]:
    (dest/'common.json').write_text(json.dumps(manifest));result=read_resources(root,lambda d,m:'decoded');self.assertTrue(result['warnings']);self.assertFalse(result['pictures'])
 def test_external_theme_uses_shared_resources_with_local_precedence(self):
  import switch_themes
  with tempfile.TemporaryDirectory() as root:
   theme=Path(root)/'themes';shared=Path(root)/'shared';theme.mkdir();shared.mkdir();(theme/'theme.nxtheme').write_bytes(b'fixture')
   def resources(folder,data_url):
    return {'pictures':{'F':{'P':{'source':'local' if Path(folder)==theme else 'shared'}}},'textures':{'T':'local' if Path(folder)==theme else 'shared'},'fonts':{'standard':{'family':'Local','source':'font'}},'warnings':[]}
   screen={'target':'home','name':'Test','author':'Author','icons':{},'conversion':{}}
   with patch.object(switch_themes,'read_screen',return_value=screen),patch.object(switch_themes,'scan_folder',return_value=[]),patch('switch_resources.read_resources',side_effect=resources):
    result=switch_themes.read_theme(str(theme),'theme.nxtheme',lambda d,m:'unused',resource_folder=str(shared))
   self.assertEqual(result['screens']['home']['conversion']['nativePictures']['F']['P']['source'],'local')
 def test_local_firmware_masks_keep_native_alpha_and_uvs(self):
  root=Path(__file__).resolve().parents[1]/'work/switch-base-analysis/firmware-22.5.0/home-romfs'
  if not root.exists():self.skipTest('Optional local firmware input is unavailable')
  with tempfile.TemporaryDirectory() as folder:
   for resource in ['common','ResidentMenu']:
    result=import_resources(root/(resource+'.szs'),folder);self.assertTrue(result['success'],result);self.assertGreater(result['panes'],150)
   resources=read_resources(folder,lambda d,m:d)
   picture=resources['pictures']['RdtBtnPvr']['P_Pict_00'];w,h,rgba=pixels(picture['source'])
   self.assertEqual((w,h),(52,45));self.assertEqual(min(rgba[3::4]),0);self.assertEqual(max(rgba[3::4]),255)
   self.assertEqual(resources['pictures']['GTNumL']['P_GTNum_00']['uv'][5],.10000000149011612)
   self.assertFalse(resources['warnings']);self.assertIn('CursorEff_08^w',resources['textures']);self.assertEqual(resources['textures']['CursorEff_08^w'][:4],b'DAST')

if __name__=='__main__':unittest.main()
