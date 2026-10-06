from pathlib import Path
import re,json,struct,math,base64,urllib.request
root=Path('work/theseus/xips-source/settings3');root.mkdir(parents=True,exist_ok=True)
if not (root/'default.xap').exists():(root/'default.xap').write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/MrMilenko/Theseus/main/xips-source/settings3/default.xap').read())
text=(root/'default.xap').read_text();text=re.sub(r'//[^\n]*','',text)
tokens=re.findall(r'"[^"\n]*"|[-+]?(?:\d*\.\d+|\d+)(?:[eE][-+]?\d+)?|[\w/#.-]+|[{}\[\]]',text);i=0;defs={}
vec={'translation':3,'scale':3,'rotation':4,'scaleOrientation':4,'axis':3,'diffuseColor':3,'emissiveColor':3}
def value():
 global i
 t=tokens[i]
 if t=='[':
  i+=1;arr=[]
  while tokens[i]!=']':arr.append(value())
  i+=1;return arr
 if t=='USE':i+=2;return defs.get(tokens[i-1],{})
 name=''
 if t=='DEF':name=tokens[i+1];i+=2;t=tokens[i]
 if i+1<len(tokens) and tokens[i+1]=='{':
  i+=2;o={'type':t,'id':name}
  while tokens[i]!='}':
   k=tokens[i];i+=1
   if k in vec:o[k]=[float(tokens[i+j]) for j in range(vec[k])];i+=vec[k]
   else:o[k]=value()
  i+=1
  if name:defs[name]=o
  return o
 i+=1
 if t.startswith('"'):return t[1:-1]
 try:return float(t)
 except:return t
nodes=[]
while i<len(tokens):nodes.append(value())
Path('work/theseus-settings-scene.json').write_text(json.dumps(defs))
I=lambda:[[1 if x==y else 0 for x in range(4)] for y in range(4)]
def mul(a,b):return [[sum(a[r][k]*b[k][c] for k in range(4)) for c in range(4)] for r in range(4)]
def matrix(n):
 m=I();t=n.get('translation',[0,0,0]);m[0][3],m[1][3],m[2][3]=t
 aa=n.get('rotation',[0,1,0,0]);x,y,z,a=aa;l=math.sqrt(x*x+y*y+z*z) or 1;x/=l;y/=l;z/=l;c=math.cos(a);s=math.sin(a);k=1-c
 r=[[c+x*x*k,x*y*k-z*s,x*z*k+y*s,0],[y*x*k+z*s,c+y*y*k,y*z*k-x*s,0],[z*x*k-y*s,z*y*k+x*s,c+z*z*k,0],[0,0,0,1]];m=mul(m,r);scale=n.get('scale',[1,1,1]);d=I()
 for j in range(3):d[j][j]=scale[j]
 return mul(m,d)
def point(m,p,w=1):return [sum(m[r][k]*p[k] for k in range(3))+m[r][3]*w for r in range(3)]
output={}
for label in ['ClockIcon','GlobeIcon','StereoIcon','FullscreenIcon','network_icon','AutoOffIcon','ConsoleIcon','LockIcon','Icon_live']:
 parts=[]
 def walk(n,parent,role=''):
  if not isinstance(n,dict):return
  mat=mul(parent,matrix(n));role=n.get('id') if n.get('id') in ['ClockMinuteHand','ClockHourHand'] else role
  geo=n.get('geometry',{})
  if n.get('type')=='Shape' and geo.get('type')=='Mesh':
   filename=geo['url'];p=root/filename
   if not p.exists():p.write_bytes(urllib.request.urlopen('https://raw.githubusercontent.com/MrMilenko/Theseus/main/xips-source/settings3/'+filename).read())
   b=p.read_bytes();prim,faces,fvf,stride,count,ic=struct.unpack_from('<6I',b);vs=[]
   for j in range(count):
    v=struct.unpack_from('<3f',b,24+j*stride);pos=point(mat,v)
    if stride>=32:norm=struct.unpack_from('<3f',b,24+j*stride+12)
    else:
     packed=struct.unpack_from('<I',b,24+j*stride+12)[0];norm=[]
     for shift,bits in [(0,11),(11,11),(22,10)]:
      z=(packed>>shift)&((1<<bits)-1);z=z-(1<<bits) if z&(1<<(bits-1)) else z;norm.append(z/((1<<(bits-1))-1))
    norm=point(mat,norm,0);l=math.sqrt(sum(v*v for v in norm)) or 1;norm=[v/l for v in norm];vs.extend(pos+norm+[0,0])
   parts.append({'verts':vs,'i':base64.b64encode(b[24+count*stride:24+count*stride+ic*2]).decode(),'material':n.get('appearance',{}).get('material',{}).get('name',''),'role':role})
  for c in n.get('children',[]):walk(c,mat,role)
 node=dict(defs[label]);node.pop('translation',None);node.pop('rotation',None);node.pop('scale',None);walk(node,I())
 if not parts:continue
 mins=[min(p['verts'][j] for p in parts for j in range(k,len(p['verts']),8)) for k in range(3)];maxs=[max(p['verts'][j] for p in parts for j in range(k,len(p['verts']),8)) for k in range(3)];center=[(a+b)/2 for a,b in zip(mins,maxs)];radius=max(maxs[0]-mins[0],maxs[1]-mins[1])/2
 for p in parts:
  vs=p.pop('verts')
  for j in range(0,len(vs),8):
   for k in range(3):vs[j+k]=(vs[j+k]-center[k])/radius
  p['v']=base64.b64encode(struct.pack('<'+'f'*len(vs),*vs)).decode()
 output[label]=parts
 print(label,len(parts))
Path('src/themes/theseusSettingsGeometry.ts').write_text('// Native Theseus settings3 meshes; converted for the browser renderer.\nexport const THESEUS_SETTINGS = '+json.dumps(output,separators=(',',':'))+';\n')
