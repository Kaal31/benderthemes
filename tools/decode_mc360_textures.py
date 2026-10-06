from pathlib import Path
import struct,zlib,re

def png(path,w,h,data):
 def chunk(k,v):return struct.pack('>I',len(v))+k+v+struct.pack('>I',zlib.crc32(k+v)&0xffffffff)
 path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>2I5B',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(b'\0'+data[y*w*4:(y+1)*w*4] for y in range(h))))+chunk(b'IEND',b''))
for p in Path('work/xbmc-textures').glob('*.raw'):
 if not re.match(r'(?:blades-|background-(?!intro)|bkgd-whitewash|bkgd_frames_|gamecard|gamercard_|homebutton|systemhomebutton|guide-|button-|button_|dvdtray|ad-button|divider|icon-|haze-|middle-panel|home_logo|mc360_logo|xbmclive_home)',p.name,re.I):continue
 b=p.read_bytes();flag=struct.unpack_from('<I',b)[0]
 if flag&2:continue
 paletted=bool(flag&1)
 fmt=struct.unpack_from('<I',b,28 if paletted else 16)[0];w=1<<((fmt>>20)&15);h=1<<((fmt>>24)&15);rw,rh=struct.unpack_from('<HH',b,36 if paletted else 24)
 if (fmt>>8)&255 not in (6,11):print('Skip fmt',p.name,hex(fmt));continue
 data=bytearray(rw*rh*4)
 masks=[];bit=1;outbit=1
 while bit<max(w,h):
  if bit<w:masks.append(('x',bit,outbit));outbit<<=1
  if bit<h:masks.append(('y',bit,outbit));outbit<<=1
  bit<<=1
 for y in range(rh):
  for x in range(rw):
   idx=sum(dst for axis,bit,dst in masks if (x if axis=='x' else y)&bit);off=128+4*b[1152+idx] if paletted else 128+4*idx;pix=b[off:off+4];data[(y*rw+x)*4:(y*rw+x)*4+4]=bytes([pix[2],pix[1],pix[0],pix[3]])
 png(Path('work/xbmc-textures/png')/Path(p.name.removesuffix('.raw')).with_suffix('.png'),rw,rh,data)
print('decoded',len(list(Path('work/xbmc-textures/png').glob('*.png'))))
