from pathlib import Path
import sys,json,hashlib,zipfile,collections
sys.path.insert(0,str(Path(__file__).resolve().parents[1]))
from py_modules import wii_themes as w
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'work/console-assets-repository';STAGE=ROOT/'work/nintendo-asset-staging'
records=[];errors=[]
def pack(ident,version,files,note):
 target=OUT/'packs'/(ident+'-v1.zip');target.parent.mkdir(parents=True,exist_ok=True)
 entries=[]
 with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
  for name,data,source in sorted(files):
   if '..' in Path(name).parts or Path(name).is_absolute():raise ValueError(name)
   z.writestr('assets/'+ident+'/'+name,data)
   entries.append(dict(path=name,bytes=len(data),sha256=hashlib.sha256(data).hexdigest(),source=source))
  provenance=dict(id=ident,sourceVersion=version,note=note,files=entries)
  z.writestr('assets/'+ident+'/provenance.json',json.dumps(provenance,indent=2))
 records.append(dict(id=ident,sourceVersion=version,file=target.name,files=len(entries),bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),note=note))
 print(ident,len(entries),target.stat().st_size,flush=True)
source=ROOT/'work/wii-firmware-reference/extracted';ui=[];mii=[]
def walk(data,label,depth=0):
 if depth>8:return
 try:data=w.unwrap(data)
 except ValueError as e:errors.append(dict(source=label,error=str(e)));return
 if data[:4]==w.U8_MAGIC:
  for name,b in w.u8(data).items():walk(b,label+'/'+name,depth+1)
  return
 ext=Path(label).suffix.lower();name=label.split('.app/',1)[-1]
 if Path(name).name=='RFL_Res.dat':mii.append((name,data,label));return
 if ext not in {'.tpl','.brlyt','.brlan','.png','.jpg','.jpeg'}:return
 ui.append((name,data,label))
 if ext=='.tpl':
  try:ui.append((name+'.png',w.tpl_to_png(data)[0],label+' (decoded TPL)'))
  except (ValueError,IndexError) as e:errors.append(dict(source=label,error=str(e)))
for p in source.glob('*.app'):
 if p.name in {'0000009a.app','0000000b.app'}:walk(p.read_bytes(),p.name)
pack('wii-system-menu-v514','Wii System Menu v514 (EU)',ui,'Native menu textures, layouts and animations; TPL originals plus PNG conversions. No executable, keys or fonts.')
pack('wii-mii-rfl-v514','Wii System Menu v514 (EU)',mii,'Original RFL face-library resource archive; requires a compatible parser/renderer. Not a ready-to-use GLB.')
u=ROOT.parents[1]/'publish/benderthemes/work/wiiu-inspection'
ui=[]
for folder in ['unpacked','png']:
 for p in (u/folder).rglob('*'):
  if p.is_file() and p.suffix.lower() in {'.bflim','.bflyt','.bflan','.png'}:ui.append((p.relative_to(u).as_posix(),p.read_bytes(),str(p)))
pack('wiiu-menu-local-reference','Wii U Menu local extraction; firmware version unverified',ui,'Extracted subset only; source firmware version was not recorded. No firmware containers or executables.')
models=[]
for p in u.iterdir():
 if p.is_file() and (p.name.startswith('Mii') and p.suffix.lower() in {'.bfres','.png'}):models.append((p.name,p.read_bytes(),str(p)))
pack('wiiu-mii-local-reference','Wii U Menu local extraction; firmware version unverified',models,'Original Mii body and animation resources with decoded textures. Does not include a complete FFL face library.')
s=ROOT/'work/switch-base-analysis/firmware-20.0.0';files=[]
for folder in ['common','ResidentMenu']:
 for p in (s/folder).rglob('*'):
  if p.is_file() and p.suffix.lower() in {'.bflyt','.bflan'}:files.append((p.relative_to(s).as_posix(),p.read_bytes(),str(p.relative_to(ROOT))))
pack('switch-home-20-0-0','Switch firmware 20.0.0',files,'Extracted layouts and animations only; no texture set is available in this extraction. No NCA, firmware ZIP or binaries.')
manifest=dict(schema=1,version='nintendo-local-v1',packs=records,extractionErrors=errors)
(OUT/'nintendo-packs.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
print('Extraction errors:',len(errors))
