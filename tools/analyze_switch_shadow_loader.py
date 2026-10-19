"""Local-only material-loader experiment. No firmware code/resources exported.

Executes the measured ARM64 loader, with explicit SDK accessor shims. Records
only named property queries and hashes of output buffers, never raw resources.
"""
from pathlib import Path
from collections import Counter
import sys,json,struct,hashlib
ANALYSIS_ROOT=Path(__file__).resolve().parents[1]/'work/switch-base-analysis'
sys.path.insert(0,str(ANALYSIS_ROOT/'python-libs'))
from unicorn import Uc,UC_ARCH_ARM64,UC_MODE_ARM,UC_HOOK_CODE
from unicorn.arm64_const import *
from capstone import Cs,CS_ARCH_ARM64,CS_MODE_ARM

version=sys.argv[1] if len(sys.argv)>1 else '22.5.0'
root=ANALYSIS_ROOT/('firmware-'+version)
start={'22.5.0':0xb97ca0,'19.0.1':0x9d0230}[version]
md=Cs(CS_ARCH_ARM64,CS_MODE_ARM)
text=(root/'home-segment0.bin').read_bytes()
instructions=[]
for instruction in md.disasm(text[start:start+0x2000],start):
 instructions.append(instruction)
 if instruction.mnemonic=='ret':break
end=instructions[-1].address+4
calls={i.address:i for i in instructions if i.mnemonic in ('bl','blr')}
direct=[int(i.op_str[1:],16) for i in calls.values() if i.mnemonic=='bl']
lookup=Counter(direct).most_common(1)[0][0]
storage,memset,_,geometry_storage=list(dict.fromkeys(direct))
virtual=[i.address for i in calls.values() if i.mnemonic=='blr']
def properties(path,pane):
 data=path.read_bytes();off=struct.unpack_from('<H',data,6)[0];name='';out={}
 while off+8<=len(data):
  tag=data[off:off+4];length=struct.unpack_from('<I',data,off+4)[0];body=data[off+8:off+length]
  if tag in (b'pan1',b'pic1',b'txt1',b'prt1'):name=body[4:28].split(b'\0')[0].decode()
  if tag==b'usd1' and name==pane:
   for n in range(struct.unpack_from('<H',body)[0]):
    at=4+n*12;no,vo,count,kind,_=struct.unpack_from('<IIHBB',body,at);key=body[at+no:].split(b'\0')[0].decode()
    if kind in (1,2):out[key]=(kind,list(struct.unpack_from('<'+('i' if kind==1 else 'f')*count,body,at+vo)))
  off+=length
 return out

def run(knockout,shadow_size=4,function=0):
 u=Uc(UC_ARCH_ARM64,UC_MODE_ARM)
 u.mem_map(0,0x2000000)
 for seg in json.loads((root/'home-executable-index.json').read_text())['segments']:
  u.mem_write(seg['memoryOffset'],(root/f"home-segment{seg['index']}.bin").read_bytes())
 heap=0x5000000;u.mem_map(heap,0x200000);u.mem_map(0x425a000,0x2000)
 pane,material,userdata,geometry,context=heap+0x1000,heap+0x2000,heap+0x3000,heap+0x4000,heap+0x5000
 def write(address,fmt,*values):u.mem_write(address,struct.pack('<'+fmt,*values))
 write(pane+0x48,'ffff',1,1,64,40);write(material+0x38,'Q',1)
 write(0x425abe8,'Q',heap+0x10000)
 props=properties(root/'ResidentMenu/blyt/Cursor3.bflyt','P_Grow')
 for name,(kind,values) in list(props.items()):
  if 'ColorSelect' in name:props[name]=(kind,[0]*len(values))
 props.update({'S_DropShadowColorSelect':(1,[0]),'S_DropShadowSize':(2,[shadow_size]),'S_DropShadowFunction':(1,[function])})
 if knockout is not None:props['S_DropShadowKnockout']=(1,[knockout])
 pointers={};cursor=heap+0x20000
 for name,(kind,values) in props.items():
  pointers[name]=cursor;write(cursor,'IIII',0,16,len(values),kind);write(cursor+16,('i' if kind==1 else 'f')*len(values),*values);cursor+=128
 queries=[];post=[]
 def step(u,address,size,_):
  instruction=calls.get(address)
  if not instruction:return
  x0,x1,x2=[u.reg_read(r) for r in (UC_ARM64_REG_X0,UC_ARM64_REG_X1,UC_ARM64_REG_X2)]
  if instruction.mnemonic=='blr':
   if address==virtual[0]:result=1
   elif address==virtual[1]:result=material
   elif address==virtual[2]:post.append((x0,x1,x2,u.reg_read(UC_ARM64_REG_X3)));result=0
   else:raise RuntimeError('Unrecognized virtual call')
  else:
   target=int(instruction.op_str[1:],16)
   if target==storage:result=userdata
   elif target==geometry_storage:result=geometry
   elif target==memset:u.mem_write(x0,bytes([x1&255])*x2);result=x0
   elif target==lookup:
    name=bytes(u.mem_read(x1,160)).split(b'\0')[0].decode();queries.append(name);result=pointers.get(name,0)
   else:raise RuntimeError('Unrecognized direct call '+hex(target))
  u.reg_write(UC_ARM64_REG_X0,result);u.reg_write(UC_ARM64_REG_PC,address+4)
 u.hook_add(UC_HOOK_CODE,step,begin=start,end=end)
 u.reg_write(UC_ARM64_REG_CPACR_EL1,3<<20)
 u.reg_write(UC_ARM64_REG_X0,0);u.reg_write(UC_ARM64_REG_X1,pane);u.reg_write(UC_ARM64_REG_X2,context)
 u.reg_write(UC_ARM64_REG_SP,heap+0x1f0000);u.reg_write(UC_ARM64_REG_LR,end)
 try:u.emu_start(start,end,count=20000)
 except Exception as error:raise RuntimeError('Loader stopped at '+hex(u.reg_read(UC_ARM64_REG_PC))+': '+str(error)) from error
 if u.reg_read(UC_ARM64_REG_PC)!=end:raise RuntimeError('Instruction bound reached')
 output=bytes(u.mem_read(userdata,0x104))+bytes(u.mem_read(geometry,0x14))
 uniforms={'paneSize':list(struct.unpack_from('<ff',output,0x80)),'shadowDraw':struct.unpack_from('<I',output,0x90)[0],'shadowVolume':struct.unpack_from('<f',output,0x94)[0],'shadowSize':struct.unpack_from('<f',output,0x98)[0],'shadowFunction':struct.unpack_from('<I',output,0x9c)[0]}
 return {'knockout':knockout,'size':shadow_size,'function':function,'uniforms':uniforms,'queries':sorted(set(queries)),'outputSha256':hashlib.sha256(output).hexdigest(),'postCallbackCount':len(post)}

rows=[run(value) for value in (None,0,1,2)]+[run(0,8),run(0,4,5)]
assert len({r['outputSha256'] for r in rows[:4]})==1
assert rows[0]['outputSha256']!=rows[4]['outputSha256']!=rows[5]['outputSha256']
assert all(r['uniforms']['shadowSize']==r['size'] and r['uniforms']['shadowFunction']==r['function'] for r in rows)
string_scan={str(seg['index']):{enc:(root/f"home-segment{seg['index']}.bin").read_bytes().count('Knockout'.encode(enc)) for enc in ('ascii','utf-16-le')} for seg in json.loads((root/'home-executable-index.json').read_text())['segments']}
assert not any(value for counts in string_scan.values() for value in counts.values())
assert all(row['postCallbackCount']==0 for row in rows)
record={'knockoutNameOccurrences':string_scan,'firmware':version,'entry':hex(start),'executableSha256':hashlib.sha256(text).hexdigest(),'accessorShims':['material count/index','shader userdata storage','USD named lookup','memset','post callback capture'],'runs':rows,'scope':'Material shader uniform/geometry loader only; does not execute the captured post callback or later draw code.'}
(root/'shadow-loader-emulation.json').write_text(json.dumps(record,indent=2)+'\n')
print(json.dumps({'runs':[{k:v for k,v in r.items() if k!='queries'} for r in rows],'propertyQueries':rows[0]['queries']},indent=2))
