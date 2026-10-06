from pathlib import Path
import struct,zlib

def png(path,w,h,rgba):
 def chunk(k,v):return struct.pack('>I',len(v))+k+v+struct.pack('>I',zlib.crc32(k+v)&0xffffffff)
 path.parent.mkdir(parents=True,exist_ok=True);path.write_bytes(b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>2I5B',w,h,8,6,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(b'\0'+rgba[y*w*4:(y+1)*w*4] for y in range(h))))+chunk(b'IEND',b''))
b=Path('work/theseus/Data/Skins/Stock/xbox4.xbx').read_bytes();hdr=struct.unpack_from('<I',b,8)[0];f=struct.unpack_from('<I',b,24)[0];w=1<<((f>>20)&15);h=1<<((f>>24)&15);data=bytearray(w*h*4)
for y in range(h):
 for x in range(w):
  offset=sum(((x>>i)&1)<<(2*i) | ((y>>i)&1)<<(2*i+1) for i in range(8));pix=b[hdr+offset*4:hdr+offset*4+4];data[(y*w+x)*4:(y*w+x)*4+4]=bytes([pix[2],pix[1],pix[0],pix[3]])
png(Path('bundle/assets/xbox-original/orb.png'),w,h,data)
print(w,h)

b=Path('work/theseus/xips-source/default-xbox/cellwall.xbx').read_bytes();hdr=struct.unpack_from('<I',b,8)[0];f=struct.unpack_from('<I',b,24)[0];w=1<<((f>>20)&15);h=1<<((f>>24)&15);out=bytearray(w*h*4)
def rgb565(c):return ((c>>11)*255//31,((c>>5)&63)*255//63,(c&31)*255//31)
for by in range(h//4):
 for bx in range(w//4):
  off=hdr+(by*(w//4)+bx)*16;alpha=int.from_bytes(b[off:off+8],'little');a,z,bits=struct.unpack_from('<HHI',b,off+8);c0=rgb565(a);c1=rgb565(z);colors=[c0,c1,tuple((2*a+b)//3 for a,b in zip(c0,c1)),tuple((a+2*b)//3 for a,b in zip(c0,c1))]
  for j in range(16):
   x=bx*4+j%4;y=by*4+j//4;rgb=colors[(bits>>(2*j))&3];out[(y*w+x)*4:(y*w+x)*4+4]=bytes((*rgb,((alpha>>(4*j))&15)*17))
png(Path('bundle/assets/xbox-original/cellwall.png'),w,h,out)
