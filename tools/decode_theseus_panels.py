from pathlib import Path
import struct,zlib

def write_png(path,w,h,rgba):
 def chunk(k,v):return struct.pack('>I',len(v))+k+v+struct.pack('>I',zlib.crc32(k+v)&0xffffffff)
 path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>2I5B',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(b'\0'+rgba[y*w*4:(y+1)*w*4] for y in range(h))))+chunk(b'IEND',b''))
def decode(src,dst):
 b=Path(src).read_bytes();hdr=struct.unpack_from('<I',b,8)[0];f=struct.unpack_from('<I',b,24)[0];fmt=(f>>8)&255;w=1<<((f>>20)&15);h=1<<((f>>24)&15);out=bytearray(w*h*4)
 def rgb(c):return ((c>>11)*255//31,((c>>5)&63)*255//63,(c&31)*255//31)
 assert fmt in [12,14]
 for by in range(h//4):
  for bx in range(w//4):
   off=hdr+(by*(w//4)+bx)*(8 if fmt==12 else 16);alpha=int.from_bytes(b[off:off+8],'little') if fmt==14 else None
   a,z,bits=struct.unpack_from('<HHI',b,off+(8 if fmt==14 else 0));c0=rgb(a);c1=rgb(z)
   colors=[c0,c1,tuple((2*a+b)//3 for a,b in zip(c0,c1)),tuple((a+2*b)//3 for a,b in zip(c0,c1))] if a>z or fmt==14 else [c0,c1,tuple((a+b)//2 for a,b in zip(c0,c1)),(0,0,0)]
   for j in range(16):
    x=bx*4+j%4;y=by*4+j//4;k=(bits>>(2*j))&3;op=((alpha>>(4*j))&15)*17 if fmt==14 else 0 if a<=z and k==3 else 255;out[(y*w+x)*4:(y*w+x)*4+4]=bytes((*colors[k],op))
 write_png(Path(dst),w,h,out)
decode('work/theseus/Data/Skins/Stock/GameHilite_01.xbx','bundle/assets/xbox-original/menu-highlight.png')
decode('work/theseus/xips-source/settings3/settings_home_bgpanel.xbx','bundle/assets/xbox-original/settings-panel.png')
