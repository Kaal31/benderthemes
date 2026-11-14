"""Prepare and publish verified Wii U stock bases and extracted runtime artwork."""
import sys,json,zipfile,hashlib,os,subprocess
from pathlib import Path
sys.path.insert(0,'py_modules');sys.path.insert(0,'tools')
import wiiu_themes as w
import publish_console_assets_gitflic as p
source=Path(r'D:\QbitTorrents\wiiu-original-theme');stock=w.stock_status(str(source))
assert stock['Men.pack']['crc']=='b9a4343a' and stock['Men2.pack']['crc']=='946cd8a2'
art=p.ROOT/'work/wiiu-stock-verified';packs={n:w.sarc((source/(n+'.pack')).read_bytes()) for n in ['Men','Men2']}
for slot,(pack,arc,tex) in w.SLOTS.items():
 raw=w.layout_textures(packs[pack],arc).get(tex);rgba=w.bflim_rgba(raw) if raw else None
 if rgba:(art/(slot+'.png')).write_bytes(w.png(*rgba))
for slot,(arc,tex,width) in w.BACKGROUNDS.items():
 rgba=w.background_picture(packs['Men2'],arc,tex)
 if rgba:(art/(slot+'.png')).write_bytes(w.png(*w._shrink(*rgba,width)))
items=[]
for ident,version,files in [('wiiu-stock-menu','v1',[source/'Men.pack',source/'Men2.pack']),('wiiu-native-ui','v2',[art/(slot+'.png') for slot in [*w.SLOTS,*w.BACKGROUNDS] if (art/(slot+'.png')).is_file()])]:
 target=p.OUT/'packs'/f'{ident}-{version}.zip'
 with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
  for file in files:
   info=zipfile.ZipInfo(f'assets/{ident}/{file.name}',date_time=(2026,11,12,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,file.read_bytes())
 item=dict(id=ident,file=target.name,files=len(files),unpackedBytes=sum(f.stat().st_size for f in files),bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),sourceVersion='Wii U Menu 5.5.x; checksum-verified Men.pack / Men2.pack')
 if ident=='wiiu-stock-menu':item.update(stockChecksums={k:v['crc'] for k,v in stock.items()},note='Patch bases cached locally for .utheme imports. No cafe_barista_men.bfsar audio base included.')
 items.append(item)
metadata=p.OUT/'wiiu-stock-runtime-packs.json';metadata.write_text(json.dumps(dict(schema=1,packs=items),indent=2)+'\n',encoding='utf-8')
print('Prepared',[(i['id'],i['bytes'],i['files']) for i in items],flush=True)
if '--publish' not in sys.argv:sys.exit(0)
if not os.environ.get('GITFLIC_TOKEN'):
 r=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=gitflic.ru\n\n',text=True,capture_output=True,env={**os.environ,'GIT_TERMINAL_PROMPT':'0','GCM_INTERACTIVE':'Never'});v=dict(l.split('=',1) for l in r.stdout.splitlines() if '=' in l)
 if v.get('password'):os.environ['GITFLIC_TOKEN']=v['password']
if not os.environ.get('GITFLIC_TOKEN'):raise SystemExit('GitFlic credential unavailable; prepared packs were not uploaded.')
base=f'/project/{p.OWNER}/{p.PROJECT}';p.api(base)
p.git('add',metadata.name)
if p.git('diff','--cached','--name-only').strip():p.git('commit','-m','Prepare checksum-verified Wii U stock bases and focus artwork')
p.git('push','origin','master');tag='wiiu-stock-menu-v1'
if not p.git('tag','--list',tag).strip():p.git('tag',tag)
p.git('push','origin',tag)
rels=p.api(base+'/release?size=100').get('_embedded',{}).get('releaseTagModelList',[]);rel=next((r for r in rels if r['tagName']==tag),None)
if not rel:rel=p.api(base+'/release',dict(title='Wii U stock menu resources v1',tagName=tag,description='Checksum-verified Men.pack and Men2.pack patch bases for custom .utheme imports, plus extracted runtime artwork with native selection frames. No audio base, executables, keys or credentials included. Original resources retain their ownership.',preRelease=False,attachProjectArchive=False))
rel=p.api(base+'/release/'+rel['id'])
for item in items:
 attachment=next((a for a in rel.get('attachmentFiles',[]) if a['name']==item['file']),None)
 if not attachment:rel=p.upload(rel,p.OUT/'packs'/item['file']);attachment=next(a for a in rel['attachmentFiles'] if a['name']==item['file'])
 assert attachment['size']==item['bytes'] and attachment.get('hashSha256','').lower()==item['sha256']
 item['url']=f"https://gitflic.ru/project/{p.OWNER}/{p.PROJECT}/release/{rel['id']}/{attachment['uuid']}/download";print('Verified upload:',item['id'],flush=True)
metadata.write_text(json.dumps(dict(schema=1,packs=items),indent=2)+'\n',encoding='utf-8')
runtime=p.ROOT/'py_modules/console-assets.json';data=json.loads(runtime.read_text(encoding='utf-8'));ids={i['id'] for i in items};data['packs']=[i for i in data['packs'] if i['id'] not in ids]+items;runtime.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
p.git('add',metadata.name)
if p.git('diff','--cached','--name-only').strip():p.git('commit','-m','Record verified Wii U stock resource download URLs')
p.git('push','origin','master')
