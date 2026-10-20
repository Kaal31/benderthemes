"""Read numeric BFLAN channels from a local base layout for validation extraction."""
from pathlib import Path
import struct,json

def read(path):
 d=path.read_bytes();endian='<' if d[4:6]==b'\xff\xfe' else '>';u16=lambda o:struct.unpack_from(endian+'H',d,o)[0];u32=lambda o:struct.unpack_from(endian+'I',d,o)[0];off=u16(6)
 while off+8<=len(d):
  if d[off:off+4]==b'pai1':
   frames=u16(off+8);flags=d[off+10];count=u16(off+14);table=off+u32(off+16);entries=[]
   for i in range(count):
    start=off+u32(table+4*i);name=d[start:start+28].split(b'\0')[0].decode();tags=[]
    for j in range(d[start+28]):
     tag=start+u32(start+32+4*j)+(4 if d[start+29]==2 else 0);typ=d[tag:tag+4].decode();tracks=[]
     for k in range(u32(tag+4)):
      t=tag+u32(tag+8+4*k);dt=u16(t+2);keys=t+u32(t+8);frames2=[]
      if dt not in (1,2):continue
      for n in range(u16(t+4)):
       vals=struct.unpack_from(endian+('fff' if dt==2 else 'fhh'),d,keys+n*(12 if dt==2 else 8));frames2.append(dict(zip(['frame','value','slope'],vals)))
      track={'property':d[t+1],'interpolation':'hermite' if dt==2 else 'step','keys':frames2}
      if typ=='FLEU':
       tail=keys+u16(t+4)*(12 if dt==2 else 8)
       if tail+4<=len(d):
        name_at=tail+u32(tail)
        if tail+4<=name_at<len(d):track['usd']=d[name_at:name_at+256].split(b'\0')[0].decode('utf-8')
      tracks.append(track)
     tags.append({'type':typ,'tracks':tracks})
    entries.append({'name':name,'tags':tags})
   return {'frames':frames,'loop':bool(flags&1),'entries':entries}
  off+=u32(off+4)
