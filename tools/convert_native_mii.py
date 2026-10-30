"""Convert locally supplied Nintendo meshes to an external, data-only runtime pack.
No resource bytes are written into plugin source. Requires the local bfparse reference tool.
"""
from pathlib import Path
import sys,io,json,math,struct,zipfile,hashlib
ROOT=Path(__file__).resolve().parents[1]
base=ROOT.parents[1]/'publish/benderthemes/work'
sys.path[:0]=[str(base/'python-libs'),str(base/'wiiu-inspection')]
import numpy as np
from bfparse.bfres_file import BfresFile
result={'schema':1,'source':'Wii U MiiBodyMiddle.bfres and Wii System Menu v514 RFL_Res.dat','bodies':{},'heads':{},'hair':{}}
f=BfresFile(io.BytesIO((base/'wiiu-inspection/MiiBodyMiddle.bfres').read_bytes()))
for node in f.fmdl_index_group:
 name=node.name_offset.name
 if not node.data or name not in ['MaleBody','FemaleBody','MaleBody_lod','FemaleBody_lod']:continue
 m=node.data;bones={b.data.index:b.data for b in m.fskl.bone_index_group if b.data};matrices={}
 def matrix(idx):
  if idx in matrices:return matrices[idx]
  b=bones[idx];x,y,z=b.rotation[:3]
  if b.name_offset.name=='arm_l1':z=-1.15
  if b.name_offset.name=='arm_r1':z=1.15
  rx=np.array([[1,0,0],[0,math.cos(x),-math.sin(x)],[0,math.sin(x),math.cos(x)]])
  ry=np.array([[math.cos(y),0,math.sin(y)],[0,1,0],[-math.sin(y),0,math.cos(y)]])
  rz=np.array([[math.cos(z),-math.sin(z),0],[math.sin(z),math.cos(z),0],[0,0,1]])
  a=np.eye(4);a[:3,:3]=rz@ry@rx@np.diag(b.scale);a[:3,3]=b.translation
  if b.child_indices[0]!=65535:a=matrix(b.child_indices[0])@a
  matrices[idx]=a;return a
 out=dict(positions=[],normals=[],indices=[],regions=[],bones=[],balls=[],ao=[])
 # Uniform scale aligns the native neck with the existing animation rig.
 scale=7.4/10.9
 for sn in m.fshp_index_group:
  if not sn.data or 'mask' in sn.name_offset.name:continue
  sh=sn.data;lod=sh.lod_models[0];vs=m.fvtx_array[sh.header.buffer_index].get_vertices();indices=list(lod.index_buffer.indices);vs=vs[lod.skip_vertices:lod.skip_vertices+max(indices)+1];offset=len(out['positions'])//3
  for v in vs:
   bi=m.fskl.inv_indices[int(v.i0 if isinstance(v.i0,int) else v.i0[0])] if v.i0 is not None else sh.header.bone_index
   p=matrix(bi)@np.array([*map(float,v.p0[:3]),1]);bn=bones[bi].name_offset.name
   side=1 if '_l' in bn else -1
   part=(2 if side>0 else 1) if 'arm_' in bn and bn.endswith('1') else (6 if side>0 else 5) if 'arm_' in bn or 'wrist' in bn else (4 if side>0 else 3) if 'foot' in bn or 'ankle' in bn else 0
   region=1 if any(k in bn for k in ['hip','foot']) else 3 if 'ankle' in bn else 0
   out['positions'].extend(round(float(q)*scale,6) for q in p[:3]);out['normals'].extend([0,0,0]);out['regions'].append(region);out['bones'].append(part);out['balls'].extend([0,0,0,0]);out['ao'].append(1)
  out['indices'].extend(i+offset for i in indices)
 result['bodies'][name]=out
# RFL files use compact GX primitive lists. Parse only geometry (never executable code).
z=zipfile.ZipFile(ROOT/'work/console-assets-repository/packs/wii-mii-rfl-v514-v1.zip');b=z.read(next(n for n in z.namelist() if n.endswith('.dat')))
u16=lambda o:struct.unpack_from('>H',b,o)[0];u32=lambda o:struct.unpack_from('>I',b,o)[0]
def rfl(section,index):
 arc=u32(4+section*4);count=u16(arc);start=arc+8+count*4+u32(arc+4+index*4);o=start+4;kind=b[start:start+4];trans=None
 if kind==b'face':trans=struct.unpack_from('>9f',b,o);o+=36
 n=u16(o);o+=2
 if not n:return None
 p=list(struct.unpack_from('>'+str(n*3)+'h',b,o));o+=n*6
 n=u16(o);o+=2;norm=list(struct.unpack_from('>'+str(n*3)+'h',b,o));o+=n*6
 uv=kind not in [b'frhd',b'hair',b'berd',b'nose']
 if uv:n=u16(o);o+=2+n*4
 primitives=b[o];o+=1;out=dict(positions=[],normals=[],indices=[],regions=[],bones=[],balls=[],ao=[])
 for _ in range(primitives):
  n,mode=b[o:o+2];o+=2;verts=[]
  for j in range(n):
   pi,ni=b[o:o+2];o+=3 if uv else 2
   i=len(out['positions'])//3;verts.append(i);out['positions'].extend(q/256 for q in p[pi*3:pi*3+3]);out['normals'].extend(q/16384 for q in norm[ni*3:ni*3+3]);out['regions'].append(2);out['bones'].append(0);out['balls'].extend([0]*4);out['ao'].append(1)
  if mode==0x90:out['indices'].extend(verts)
  elif mode==0x98:
   for j in range(2,n):out['indices'].extend([verts[j-2],verts[j-1],verts[j]] if j%2==0 else [verts[j-1],verts[j-2],verts[j]])
  elif mode==0xa0:
   for j in range(2,n):out['indices'].extend([verts[0],verts[j-1],verts[j]])
  elif mode==0x80:
   for j in range(0,n,4):out['indices'].extend([verts[j],verts[j+1],verts[j+2],verts[j],verts[j+2],verts[j+3]])
  else:raise ValueError('Unsupported GX primitive '+hex(mode))
 # GX primitives use the opposite front-face winding to Three.js.
 for i in range(0,len(out["indices"]),3):out["indices"][i+1],out["indices"][i+2]=out["indices"][i+2],out["indices"][i+1]
 return out,trans
heads=[rfl(3,i) for i in range(8)]
# Keep every native component in one consistent head coordinate system.
h=heads[0][0]['positions'];ys=h[1::3];xs=h[::3];scale=5.2/(max(xs)-min(xs));ymin=min(ys)
def fit(shape,translation=(0,0,0)):
 for i in range(0,len(shape['positions']),3):
  for j in range(3):shape['positions'][i+j]=round((shape['positions'][i+j]+translation[j]-(ymin if j==1 else 0))*scale,6)
 return shape
for i,item in enumerate(heads):
 if item:result['heads'][str(i)]=fit(item[0])
trans=heads[0][1][6:9]
for i in range(72):
 item=rfl(8,i)
 if item:result['hair'][str(i)]=fit(item[0],trans)
folder=ROOT/'work/native-mii-runtime';folder.mkdir(exist_ok=True)
(folder/'models.json').write_text(json.dumps(result,separators=(',',':')),encoding='utf-8')
out=ROOT/'work/console-assets-repository';target=out/'packs/nintendo-mii-runtime-v2.zip'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:z.write(folder/'models.json','assets/nintendo-mii-runtime/models.json')
pack=dict(id='nintendo-mii-runtime',file=target.name,files=1,unpackedBytes=(folder/'models.json').stat().st_size,bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),sourceVersion='Wii v514 / local Wii U Menu extraction',note='Native body and head/hair geometry. Independent motion, facial features and materials. No complete FFL face renderer.')
(out/'mii-runtime-pack.json').write_text(json.dumps(pack,indent=2),encoding='utf-8')
print('Bodies',[(k,len(v['positions'])//3) for k,v in result['bodies'].items()],'heads',len(result['heads']),'hair',len(result['hair']),'pack',pack['bytes'])
