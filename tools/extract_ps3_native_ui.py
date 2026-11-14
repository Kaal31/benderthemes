"""Offline extraction of native PS3 RCO images from user-supplied dev_flash.
Requires extracted local firmware; never executes firmware code.
"""
from pathlib import Path
import struct,zlib,sys,json
sys.path.insert(0,'py_modules');import console_themes as c
root=Path('work/stock-firmware/tools/rpcs3/dev_flash/vsh/resource');out=Path('work/ps3-native-4.91');out.mkdir(exist_ok=True);inventory={};errors=[]
def unpack(b):
 if b[:4]!=b'FRP\0':raise ValueError('Not PS3 RCO')
 if struct.unpack_from('>I',b,12)[0]&0xf0==0x10:
  lp,lu=struct.unpack_from('>II',b,0xa4);t=zlib.decompress(b[0xb0:0xb0+lp]);assert len(t)==lu;b=bytearray(b[:0xa4])+t+b[0xb0+((lp+3)&~3):];delta=lu-(12+((lp+3)&~3))
  for o in [0x80,0x88,0x90]:
   v=struct.unpack_from('>I',b,o)[0]
   if v!=0xffffffff:struct.pack_into('>I',b,o,v+delta)
 return b
for p in root.glob('*.rco'):
 try:
  b=unpack(p.read_bytes());u=lambda o:struct.unpack_from('>I',b,o)[0];plab,pdat=u(0x40),u(0x80);table=u(0x24)
  if table==0xffffffff:continue
  n=u(table+0x10);o=table+0x28;names=[]
  for i in range(n):
   labeloff=plab+u(o+4);label=b[labeloff:b.find(b'\0',labeloff)].decode('latin1');comp=struct.unpack_from('>H',b,o+0x2a)[0];size,off=u(o+0x2c),u(o+0x30);raw=b[pdat+off:pdat+off+size];raw=zlib.decompress(raw) if comp==1 else raw
   png=c.gim_png(raw)
   if png:
    name=p.stem+'--'+label+'.png';(out/name).write_bytes(png);names.append(label)
   nxt=u(o+0x14)
   if not nxt:break
   o+=nxt
  inventory[p.name]=names
 except Exception as e:errors.append((p.name,str(e)))
(out/'inventory.json').write_text(json.dumps(inventory,indent=2),encoding='utf-8');print('PS3 extracted',sum(map(len,inventory.values())),'images;errors',errors)
print('XMB icons',[(k,v) for k,v in inventory.items() if 'xmb_plugin' in k])
