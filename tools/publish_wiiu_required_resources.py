"""Package the supplied EU Wii U Menu data for persistent custom-theme resources."""
import sys,json,zipfile,hashlib,zlib,os,subprocess
from pathlib import Path
sys.path.insert(0,'tools');import publish_console_assets_gitflic as p
source=Path(r'C:/Users/levmi/Downloads/Финансовый партнер в действующий проект/mlc01_WiiUMenu_5.5.5EU.zip')
prefix='mlc01/sys/title/00050010/10040200/content/';ident='wiiu-stock-menu';records=[];blobs={}
with zipfile.ZipFile(source) as z:
 for item in z.infolist():
  if item.is_dir() or not item.filename.startswith(prefix):continue
  relative=item.filename[len(prefix):]
  if Path(relative).suffix.lower() not in {'.pack','.bfsar','.bfstm','.szs','.xml','.txt'}:raise ValueError('Unexpected content type')
  raw=z.read(item);name=Path(relative).name
  cache=name if name in {'Men.pack','Men2.pack','cafe_barista_men.bfsar'} else 'content/'+relative
  blobs[cache]=raw;records.append(dict(source=relative,cached=cache,bytes=len(raw),crc32=f'{zlib.crc32(raw):08x}',sha256=hashlib.sha256(raw).hexdigest()))
assert len(records)==29
for name,crc in [('Men.pack','b9a4343a'),('Men2.pack','946cd8a2'),('cafe_barista_men.bfsar','c9c16521')]:assert f'{zlib.crc32(blobs[name]):08x}'==crc
inventory=dict(schema=1,region='EU',version='5.5.5',files=records,note='Only supplied EU Wii U Menu content data; no code, keys, account data or credentials. Other-region patch bases are not included.')
blobs['resources.json']=(json.dumps(inventory,indent=2)+'\n').encode()
target=p.OUT/'packs/required resources.zip'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
 for name,raw in sorted(blobs.items()):
  info=zipfile.ZipInfo(f'assets/{ident}/{name}',(2026,11,12,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,raw)
item=dict(id=ident,file=target.name,files=len(blobs),unpackedBytes=sum(map(len,blobs.values())),bytes=target.stat().st_size,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),sourceVersion='Wii U Menu 5.5.5 EU',stockChecksums={r['cached']:r['crc32'] for r in records if '/' not in r['cached']},note='Complete supplied EU Menu content resources and checksum inventory. Original US/JP bases are not included; text/layout patches still require importer support.')
metadata=p.OUT/'wiiu-required-resources.json';metadata.write_text(json.dumps(dict(schema=1,packs=[item]),indent=2)+'\n',encoding='utf-8')
print('Prepared required resources.zip:',item['bytes'],'bytes;',len(records),'resources + inventory',flush=True)
if '--publish' not in sys.argv:sys.exit(0)
if not os.environ.get('GITFLIC_TOKEN'):
 r=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=gitflic.ru\n\n',text=True,capture_output=True,env={**os.environ,'GIT_TERMINAL_PROMPT':'0','GCM_INTERACTIVE':'Never'});v=dict(l.split('=',1) for l in r.stdout.splitlines() if '=' in l)
 if v.get('password'):os.environ['GITFLIC_TOKEN']=v['password']
if not os.environ.get('GITFLIC_TOKEN'):raise SystemExit('GitFlic credential unavailable')
base=f'/project/{p.OWNER}/{p.PROJECT}';p.api(base)
p.git('add',metadata.name)
if p.git('diff','--cached','--name-only').strip():p.git('commit','-m','Prepare required Wii U EU menu resources')
p.git('push','origin','master');tag='wiiu-required-resources-v1'
if not p.git('tag','--list',tag).strip():p.git('tag',tag)
p.git('push','origin',tag)
rels=p.api(base+'/release?size=100').get('_embedded',{}).get('releaseTagModelList',[]);rel=next((r for r in rels if r['tagName']==tag),None)
if not rel:rel=p.api(base+'/release',dict(title='Wii U required resources',tagName=tag,description='Required resources.zip: complete supplied EU 5.5.5 Wii U Menu content data, including visual packs, audio, stream and European language messages with checksum inventory. Excludes code, keys, accounts and credentials. US/JP bases are not included. Original ownership is retained.',preRelease=False,attachProjectArchive=False))
rel=p.api(base+'/release/'+rel['id']);attachment=next((a for a in rel.get('attachmentFiles',[]) if a['name']==item['file']),None)
if not attachment:rel=p.upload(rel,target);attachment=next(a for a in rel['attachmentFiles'] if a['name']==item['file'])
assert attachment['size']==item['bytes'] and attachment.get('hashSha256','').lower()==item['sha256']
item['url']=f"https://gitflic.ru/project/{p.OWNER}/{p.PROJECT}/release/{rel['id']}/{attachment['uuid']}/download"
metadata.write_text(json.dumps(dict(schema=1,packs=[item]),indent=2)+'\n',encoding='utf-8')
runtime=p.ROOT/'py_modules/console-assets.json';data=json.loads(runtime.read_text(encoding='utf-8'));data['packs']=[item if i['id']==ident else i for i in data['packs']];runtime.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
p.git('add',metadata.name)
if p.git('diff','--cached','--name-only').strip():p.git('commit','-m','Record verified required resources archive URL')
p.git('push','origin','master');print('Uploaded and SHA-256 verified:',item['url'],flush=True)
