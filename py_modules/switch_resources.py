"""Optional local Switch menu picture resources. No firmware/key material ships.

Reads decompressed menu SZS/SARC containers. Supported BNTX formats cover the
monochrome UI masks; undecoded GPU formats remain explicitly reported.
"""
import hashlib
import json
import os
import struct
import tempfile
from pathlib import Path
from wiiu_themes import sarc,png

MAX_RESOURCE=48*1024*1024
RESOURCE_NAMES=('common','ResidentMenu','FontStandard','FontExtended','FontExtended2')
ASTC_BLOCKS=[(4,4),(5,4),(5,5),(6,5),(6,6),(8,5),(8,6),(8,8),(10,5),(10,6),(10,8),(10,10),(12,10),(12,12)]

def _asset(data):
 return hashlib.sha256(data).hexdigest()+('.astc' if data[:4]==b'DAST' else '.png')

def _valid_asset(name):
 return isinstance(name,str) and name[64:] in ('.png','.astc','.ttf','.otf') and all(c in '0123456789abcdef' for c in name[:64]) and len(name[:64])==64

def _mime(name):return 'application/x-dht-astc' if name.endswith('.astc') else 'font/ttf' if name.endswith('.ttf') else 'font/otf' if name.endswith('.otf') else 'image/png'

def decode_font(data):
 """Read a local SFNT or NX BFTTF wrapper, without any console keyset.

 Wrapper format cross-checked with CHEMI6DER/BFTTFutil's public reader.
 """
 if len(data)>16*1024*1024:raise ValueError('Font exceeds limit')
 if data[:4]==b'\x36\xf8\x1a\x1e':
  if len(data)<12 or len(data)%4:raise ValueError('Invalid BFTTF length')
  mask=1231165446;length=struct.unpack_from('>I',data,4)[0]^mask
  if not 12<=length<=len(data)-8 or len(data)-8-length>3:raise ValueError('Invalid BFTTF payload')
  data=b''.join(struct.pack('>I',struct.unpack_from('>I',data,i)[0]^mask) for i in range(8,len(data),4))[:length]
 if len(data)<12 or data[:4] not in (b'\0\1\0\0',b'OTTO',b'true'):raise ValueError('Select a TrueType/OpenType or NX BFTTF font')
 count=struct.unpack_from('>H',data,4)[0]
 if not 1<=count<=256 or 12+16*count>len(data):raise ValueError('Invalid font table directory')
 for i in range(count):
  start,size=struct.unpack_from('>II',data,12+16*i+8)
  if start>len(data) or start+size>len(data):raise ValueError('Truncated font table')
 return data

def font_cell_ratio(data):
 """SFNT layout cell height in em units, used by the native font scaler."""
 units=0;height=0
 for i in range(struct.unpack_from('>H',data,4)[0]):
  tag,_,start,size=struct.unpack_from('>4sIII',data,12+16*i)
  if tag==b'head' and size>=20:units=struct.unpack_from('>H',data,start+18)[0]
  if tag==b'OS/2' and size>=78:
   ascent,descent=struct.unpack_from('>HH',data,start+74);height=ascent+descent
 ratio=height/units if units else 1.5
 return ratio if .25<=ratio<=8 else 1.5

def _save_manifest(dest,resource,manifest):
 fd,temp=tempfile.mkstemp(dir=dest,suffix='.json');os.close(fd)
 try:Path(temp).write_text(json.dumps(manifest),encoding='utf-8');os.replace(temp,dest/(resource+'.json'))
 finally:
  if os.path.exists(temp):os.unlink(temp)

def import_font(path,folder):
 source=Path(path);data=decode_font(source.read_bytes());digest=hashlib.sha256(data).hexdigest();asset=digest+('.otf' if data[:4]==b'OTTO' else '.ttf')
 role='extended2' if 'ext2' in source.stem.lower() else 'extended' if 'ext' in source.stem.lower() else 'standard';resource={'standard':'FontStandard','extended':'FontExtended','extended2':'FontExtended2'}[role]
 dest=Path(folder)/'.resources';dest.mkdir(parents=True,exist_ok=True);(dest/asset).write_bytes(data)
 _save_manifest(dest,resource,{'version':2,'resource':resource,'pictures':{},'textures':{},'font':{'role':role,'family':'DHTSwitch'+resource+digest[:12],'asset':asset,'cellRatio':font_cell_ratio(data)},'warnings':[]})
 return {'success':True,'resource':resource,'fonts':1,'textures':0,'panes':0,'warnings':[]}

def _u(data,offset,fmt):
 size=struct.calcsize('<'+fmt)
 if offset<0 or offset+size>len(data):raise ValueError('Truncated resource')
 return struct.unpack_from('<'+fmt,data,offset)

def _bc4(block):
 a,b=block[:2];values=[a,b]
 values+=([(a*(7-i)+b*i)//7 for i in range(1,7)] if a>b else [(a*(5-i)+b*i)//5 for i in range(1,5)]+[0,255])
 indices=int.from_bytes(block[2:8],'little')
 return [values[(indices>>(3*i))&7] for i in range(16)]

def _linear(data,w,h,bpp,tile,block_height):
 out=bytearray(w*h*bpp);pitch=(w*bpp+31)//32*32
 for y in range(h):
  for x in range(w):
   xb=x*bpp
   address=y*pitch+xb if tile==1 else (y//(8*block_height))*512*block_height*((w*bpp+63)//64)+(xb//64)*512*block_height+(y%(8*block_height)//8)*512+(xb%64//32)*256+(y%8//2)*64+(xb%32//16)*32+(y%2)*16+xb%16
   if address+bpp>len(data):raise ValueError('Truncated tiled texture')
   start=(y*w+x)*bpp;out[start:start+bpp]=data[address:address+bpp]
 return out

def decode_texture(data,offset):
 if data[offset:offset+4]!=b'BRTI':raise ValueError('Invalid BRTI')
 tile=_u(data,offset+18,'H')[0];fmt=_u(data,offset+28,'I')[0];w,h,depth,arrays,log2=_u(data,offset+36,'IIIII')
 length,_,channels,_=_u(data,offset+80,'IIII');name_address,_,ptrs=_u(data,offset+96,'QQQ')
 count=_u(data,name_address,'H')[0];name=data[name_address+2:name_address+2+count].decode('utf-8');start=_u(data,ptrs,'Q')[0]
 kind=fmt>>8
 if not 0<w<=2048 or not 0<h<=2048 or w*h>2048*2048 or depth!=1 or arrays!=1 or log2>5 or tile not in (0,1):raise ValueError('Unsupported texture dimensions')
 if 0x2d<=kind<=0x3a and fmt&255 in (1,6):
  bw,bh=ASTC_BLOCKS[kind-0x2d];raw=_linear(data[start:start+length],(w+bw-1)//bw,(h+bh-1)//bh,16,tile,1<<log2)
  return name,struct.pack('<4sHHBBI',b'DAST',w,h,bw,bh,channels)+raw,None
 if kind not in (2,9,11,0x1d,0x1e) or fmt&255!=1:return name,None,'Unsupported BNTX format '+hex(fmt)
 compressed=kind in (0x1d,0x1e);bw,bh=((w+3)//4,(h+3)//4) if compressed else (w,h)
 bpp={2:1,9:2,11:4,0x1d:8,0x1e:16}[kind]
 raw=_linear(data[start:start+length],bw,bh,bpp,tile,1<<log2);pixels=bytearray(w*h*4)
 for by in range(bh):
  for bx in range(bw):
   p=(by*bw+bx)*bpp;block=raw[p:p+bpp]
   red=_bc4(block[:8]) if compressed else [block[0]];green=_bc4(block[8:16]) if kind==0x1e else red
   for i in range(16 if compressed else 1):
    x,y=(bx*4+i%4,by*4+i//4) if compressed else (bx,by)
    if x>=w or y>=h:continue
    source=[0,255,red[i],green[i],0,255] if compressed else [0,255,block[0],block[1] if bpp>=2 else 0,block[2] if bpp==4 else 0,block[3] if bpp==4 else 255]
    for c in range(4):
     selector=(channels>>(8*c))&255
     if selector>5:raise ValueError('Invalid texture channel selector')
     pixels[(y*w+x)*4+c]=source[selector]
 return name,png(w,h,pixels),None

def decode_bntx(data):
 if data[:4]!=b'BNTX' or data[32:36]!=b'NX  ':raise ValueError('Invalid BNTX')
 count=_u(data,36,'I')[0];pointers=_u(data,40,'Q')[0]
 if count>4096:raise ValueError('Texture count exceeds limit')
 textures={};warnings=[];seen=set();pixels=0
 for i in range(count):
  offset=_u(data,pointers+8*i,'Q')[0]
  if offset in seen:continue
  seen.add(offset);width,height=_u(data,offset+36,'II');pixels+=width*height
  if pixels>32*1024*1024:raise ValueError('Texture resource budget exceeded')
  name,picture,warning=decode_texture(data,offset)
  if warning:warnings.append(name+': '+warning)
  else:textures[name]=picture
 return textures,warnings

def layout_pictures(data):
 if data[:4]!=b'FLYT' or data[4:6]!=b'\xff\xfe':raise ValueError('Unsupported layout byte order')
 version=_u(data,8,'I')[0];off=_u(data,6,'H')[0];textures=[];materials=[];panes=[]
 while off+8<=len(data):
  length=_u(data,off+4,'I')[0]
  if length<8 or off+length>len(data):raise ValueError('Invalid layout section')
  tag=data[off:off+4];body=data[off+8:off+length]
  if tag==b'txl1':
   for i in range(_u(body,0,'H')[0]):
    pos=4+_u(body,4+4*i,'I')[0];textures.append(body[pos:body.index(b'\0',pos)].decode())
  elif tag==b'mat1':
   for i in range(_u(body,0,'H')[0]):
    pos=_u(body,4+4*i,'I')[0]-8;flags=_u(body,pos+(28 if version>=0x08000000 else 36),'I')[0];cursor=pos+(44 if version>=0x08000000 else 40)
    refs=[_u(body,cursor+j*4,'HBB') for j in range(flags&3)];cursor+=4*(flags&3)
    transforms=[list(_u(body,cursor+j*20,'fffff')) for j in range((flags>>2)&3)]
    materials.append({'name':body[pos:pos+28].split(b'\0')[0].decode(),'refs':refs,'transforms':transforms})
  elif tag==b'pic1':
   name=body[4:28].split(b'\0')[0].decode();index=_u(body,92,'H')[0];coords=list(_u(body,96,'8f')) if len(body)>=128 and body[94] else [0,0,1,0,0,1,1,1];panes.append((name,index,coords))
  off+=length
 out={}
 for name,index,coords in panes:
  if index>=len(materials):continue
  material=materials[index]
  if len(material['refs'])!=1:continue
  texture,wrap_s,wrap_t=material['refs'][0]
  if texture>=len(textures):continue
  out[name]={'texture':textures[texture],'material':material['name'],'uv':coords,'wrapS':wrap_s,'wrapT':wrap_t,'transform':material['transforms'][0] if material['transforms'] else [0,0,0,1,1]}
 return out

def import_resources(path,folder):
 try:
  source=Path(path)
  if not source.is_file() or source.stat().st_size>MAX_RESOURCE:raise ValueError('Invalid or oversized menu archive')
  if source.suffix.lower() in ('.ttf','.otf','.bfttf','.bfotf'):return import_font(source,folder)
  archive=sarc(source.read_bytes());layouts={k:v for k,v in archive.items() if k.startswith('blyt/') and k.endswith('.bflyt')}
  if not layouts or 'timg/__Combined.bntx' not in archive:raise ValueError('Select an extracted ResidentMenu.szs or common.szs')
  resource='ResidentMenu' if 'blyt/RdtBase.bflyt' in layouts else 'common'
  textures,warnings=decode_bntx(archive['timg/__Combined.bntx']);pictures={};assets={}
  for name,data in textures.items():
   key=_asset(data);assets[key]=data
  for file,data in layouts.items():
   bindings=layout_pictures(data)
   pictures[Path(file).stem]={name:{**value,'asset':_asset(textures[value['texture']])} for name,value in bindings.items() if value['texture'] in textures}
  dest=Path(folder)/'.resources';dest.mkdir(parents=True,exist_ok=True)
  for name,data in assets.items():
   if not (dest/name).exists():(dest/name).write_bytes(data)
  manifest={'version':2,'resource':resource,'sha256':hashlib.sha256(source.read_bytes()).hexdigest(),'textures':{name:_asset(data) for name,data in textures.items()},'pictures':pictures,'warnings':warnings}
  _save_manifest(dest,resource,manifest)
  return {'success':True,'resource':resource,'textures':len(textures),'panes':sum(len(x) for x in pictures.values()),'warnings':warnings}
 except (OSError,ValueError,IndexError,KeyError,struct.error,UnicodeError) as error:return {'success':False,'error':str(error)}

def read_resources(folder,data_url):
 root=Path(folder)/'.resources';pictures={};textures={};fonts={};warnings=[]
 assets={};budget=0
 def source_for(asset):
  nonlocal budget
  if not _valid_asset(asset):return None
  if asset not in assets:
   path=root/asset;size=path.stat().st_size
   if size>MAX_RESOURCE or budget+size>MAX_RESOURCE:raise ValueError('Picture resource budget exceeded')
   data=path.read_bytes()
   if hashlib.sha256(data).hexdigest()!=asset[:64]:raise ValueError('Picture resource checksum mismatch')
   budget+=size;assets[asset]=data_url(data,_mime(asset))
  return assets[asset]
 for resource in RESOURCE_NAMES:
  path=root/(resource+'.json')
  if not path.is_file():continue
  try:
   if path.stat().st_size>4*1024*1024:raise ValueError('Picture resource manifest exceeds limit')
   manifest=json.loads(path.read_text(encoding='utf-8'))
   if not isinstance(manifest,dict) or not isinstance(manifest.get('pictures'),dict) or not isinstance(manifest.get('textures',{}),dict):raise ValueError('Invalid picture resource manifest')
   warnings.extend(w for w in manifest.get('warnings',[])[:4096] if isinstance(w,str))
   if len(manifest['pictures'])>1024 or len(manifest.get('textures',{}))>4096:raise ValueError('Picture resource count exceeds limit')
   font=manifest.get('font')
   if font:
    if not isinstance(font,dict):raise ValueError('Invalid font resource')
    role=font.get('role');asset=font.get('asset','');family=font.get('family','')
    if role not in ('standard','extended','extended2') or not isinstance(family,str) or not family.startswith('DHTSwitchFont') or not family.isalnum() or len(family)>96 or not isinstance(asset,str) or not asset.endswith(('.ttf','.otf')):raise ValueError('Invalid font resource')
    source=source_for(asset)
    if source is not None:
     ratio=font.get('cellRatio',1.5)
     if not isinstance(ratio,(int,float)) or isinstance(ratio,bool) or not .25<=ratio<=8:raise ValueError('Invalid font cell ratio')
     fonts[role]={'source':source,'family':family,'cellRatio':ratio}
   for name,asset in manifest.get('textures',{}).items():
    source=source_for(asset)
    if source is not None:textures[name]=source
   for file,panes in manifest['pictures'].items():
    if not isinstance(panes,dict) or len(panes)>4096:raise ValueError('Invalid picture bindings')
    for name,binding in panes.items():
     if not isinstance(binding,dict):raise ValueError('Invalid picture binding')
     asset=binding.get('asset','')
     source=source_for(asset)
     if source is None:continue
     uv=binding.get('uv');transform=binding.get('transform')
     if not isinstance(uv,list) or len(uv)!=8 or not isinstance(transform,list) or len(transform)!=5:raise ValueError('Invalid texture coordinates')
     import math
     if any(not isinstance(v,(int,float)) or isinstance(v,bool) or not math.isfinite(v) or abs(v)>1e7 for v in uv+transform):raise ValueError('Invalid texture coordinates')
     if any(not isinstance(binding.get(k),int) or not 0<=binding[k]<=255 for k in ('wrapS','wrapT')):raise ValueError('Invalid texture wrapping')
     pictures.setdefault(file,{})[name]={**{k:v for k,v in binding.items() if k!='asset'},'source':source}
  except (OSError,ValueError,KeyError,TypeError):warnings.append('Could not load '+resource+' picture resources')
 return {'pictures':pictures,'textures':textures,'fonts':fonts,'warnings':warnings}
