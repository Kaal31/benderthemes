"""Read numeric pane/parts/text/material metadata, without exporting resources."""
import json
import struct
import sys
from pathlib import Path

sys.path.insert(0,str(Path(__file__).resolve().parents[1]/'py_modules'))
from switch_effects import convert_effect,slot

USD={'C_W','C_B','C_Id','S_RoundRadius','S_BorderSize','S_BorderDrawMode','S_BorderVolume','S_BorderColorSelect0','S_BorderColor0','S_DropShadowDrawMode','S_DropShadowVolume','S_DropShadowColorSelect','S_DropShadowColor','S_DropShadowAngle','S_DropShadowDistance','S_DropShadowSize','S_DropShadowFunction'}

def part_overrides(body,endian,layout,file,depth=0):
 overrides={}
 count=struct.unpack_from(endian+'I',body,76)[0]
 for i in range(count):
  entry=88+i*40;child=body[entry:entry+24].split(b'\0')[0].decode();prop=struct.unpack_from(endian+'I',body,entry+28)[0];basic=body[entry+25];info=struct.unpack_from(endian+'I',body,entry+36)[0]
  override={};geometry={}
  # Cross-checked against 22.5.0's pane constructor at 0x1c6fc4:
  # the flags select fields from the 52-byte pane-info record; unflagged
  # fields retain the referenced layout's own geometry.
  if basic&1:geometry['Visible']=bool(basic&2)
  if info:
   base=info-8
   for flag,field_offset,key,axes in [(8,8,'Position','XYZ'),(64,20,'Rotation','XYZ'),(32,32,'Scale','XY'),(16,40,'Size','XY')]:
    if basic&flag:geometry[key]=dict(zip(axes,struct.unpack_from(endian+'f'*len(axes),body,base+field_offset)))
   if basic&128:override['alpha']=body[base+48]
  if geometry:override['geometry']=geometry
  if not prop:
   if override:overrides[child]=override
   continue
  start=prop-8;kind=body[start:start+4];payload=body[start+8:]
  if kind==b'prt1' and depth<12:
   nested=part_overrides(payload,endian,layout,file,depth+1)
   if nested:override['partOverrides']=nested
   if override:overrides[child]=override
   continue
  if kind not in (b'pic1',b'txt1'):
   if override:overrides[child]=override
   continue
  material=layout['materials'][struct.unpack_from(endian+'H',payload,92 if kind==b'pic1' else 80)[0]]
  effect={'white':material['white'],'black':material['black']}
  if kind==b'pic1':effect['corners']=dict(zip(('ColorTL','ColorTR','ColorBL','ColorBR'),[list(payload[o:o+4]) for o in (76,80,84,88)]))
  else:effect['corners']={'ColorTL':list(payload[96:100]),'ColorTR':list(payload[96:100]),'ColorBL':list(payload[100:104]),'ColorBR':list(payload[100:104])}
  # Nonzero material usage flags request selected material fields rather
  # than whole replacement. Do not interpret them as an entire material.
  if body[entry+26]==0:override.update(material=file+':'+material['name'],effect=effect)
  if override:overrides[child]=override
 return overrides

def numeric_layout(root,analysis,file,slot_for):
 found=next(((k,v) for k,v in analysis.items() if k.endswith('/'+file+'.bflyt')),None)
 if not found:return None
 key,layout=found;data=(root/key).read_bytes();endian='<' if data[4:6]==b'\xff\xfe' else '>'
 offset=struct.unpack_from(endian+'H',data,6)[0];extra={};name=''
 while offset+8<=len(data):
  tag=data[offset:offset+4];length=struct.unpack_from(endian+'I',data,offset+4)[0];body=data[offset+8:offset+length]
  if length<8:raise ValueError('Invalid section length')
  if tag in (b'pan1',b'pic1',b'txt1',b'prt1',b'bnd1',b'wnd1'):
   name=body[4:28].split(b'\0')[0].decode();extra[name]={'influenceAlpha':bool(body[0]&2)}
   if tag==b'txt1':
    extra[name]['text']={'fontSize':list(struct.unpack_from(endian+'ff',body,104)),'alignment':body[84],'lineAlignment':body[85],'characterSpace':struct.unpack_from(endian+'f',body,112)[0],'lineSpace':struct.unpack_from(endian+'f',body,116)[0]}
    extra[name]['materialIndex']=struct.unpack_from(endian+'H',body,80)[0]
    extra[name]['fontCorners']={'ColorTL':list(body[96:100]),'ColorTR':list(body[96:100]),'ColorBL':list(body[100:104]),'ColorBR':list(body[100:104])}
   if tag==b'prt1':
    count=struct.unpack_from(endian+'I',body,76)[0]
    extra[name]['partMagnify']=list(struct.unpack_from(endian+'ff',body,80))
    extra[name]['part']=body[88+count*40:].split(b'\0')[0].decode().removesuffix('.bflyt')
    # Embedded part pictures/text can reference materials in the containing
    # layout. Their identity is not the referenced file's material identity.
    overrides=part_overrides(body,endian,layout,file)
    if overrides:extra[name]['partOverrides']=overrides
  elif tag==b'usd1':
   props=[]
   for i in range(struct.unpack_from(endian+'H',body)[0]):
    entry=4+i*12;no,vo,count,kind,_=struct.unpack_from(endian+'IIHBB',body,entry);prop=body[entry+no:].split(b'\0')[0].decode()
    if kind in (1,2) and prop in USD:
     values=struct.unpack_from(endian+('i' if kind==1 else 'f')*count,body,entry+vo)
     props.append({'PropName':prop,'PropValues':[str(v) for v in values],'type':kind})
   result={'effects':{},'converted':0};convert_effect(result,set(),file+'.bflyt',{'PaneName':name,'UsdPatches':props},{},native_target=name)
   extra.setdefault(name,{})['effect']=result['effects'].get(name,{})
  offset+=length
 panes=[]
 for p in layout['panes']:
  node={k:p[k] for k in ('name','parent','type','position','rotation','scale','size','alpha','visible','origin')};node['slot']=slot_for(file,p['name'])
  legacy=slot(file+'.bflyt',p['name'])
  if legacy:node['legacySlot']=legacy
  additions=extra.get(p['name'],{});node.update({k:v for k,v in additions.items() if k in ('text','part','influenceAlpha','partOverrides','partMagnify')})
  mi=additions.get('materialIndex',p.get('materialIndex'))
  if mi is not None:
   material=layout['materials'][mi];node['material']=file+':'+material['name'];node['effect']={'white':material['white'],'black':material['black']}
   if 'fontCorners' in additions:node['effect']['corners']=additions['fontCorners']
   if 'corners' in p:node['effect']['corners']=dict(zip(('ColorTL','ColorTR','ColorBL','ColorBR'),p['corners']))
  node.setdefault('effect',{}).update(additions.get('effect',{}))
  # The native loader skips these shader blocks when their DrawMode USD is
  # absent. Adding size/color/function alone must not enable a new effect.
  node['effect'].setdefault('shadowDraw',False);node['effect'].setdefault('borderDraw',False)
  panes.append(node)
 return key,layout,panes
