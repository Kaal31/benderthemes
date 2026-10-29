"""Optional, checksum-pinned console artwork. Missing packs always leave UI fallbacks usable."""
import hashlib,json,os,stat,threading,zipfile
from pathlib import Path,PurePosixPath
from urllib.request import Request
from theme_network import urlopen
MANIFEST=Path(__file__).with_name('console-assets.json')
GROUPS={'x360':['x360-blades-original','x360-kinect-dash','x360-metro-dash','x360-nxe-dash'],'xbox':['xbox-original'],'ps3':['xmb-ps3'],'psp':['xmb-ps3']}
_lock=threading.Lock();_progress={'busy':False,'percent':0,'message':''}
def manifest():return json.loads(MANIFEST.read_text(encoding='utf-8'))
def spec(name):return next((p for p in manifest()['packs'] if p['id']==name),None)
def root():
 import decky
 return Path(decky.DECKY_PLUGIN_SETTINGS_DIR)/'console-artwork'
def destination(pack):return root()/pack['id']/pack['sha256'][:16]
def resource_dir(name):
 pack=spec(name)
 if not pack:return None
 folder=destination(pack)
 try:
  if json.loads((folder/'ready.json').read_text(encoding='utf-8')).get('sha256')==pack['sha256']:return folder/'assets'/name
 except (OSError,ValueError):pass
 return None
def status():
 data=manifest()
 return {**_progress,'repository':data['repository'],'packs':[{**{k:p[k] for k in ['id','bytes','files']},'installed':resource_dir(p['id']) is not None} for p in data['packs']]}
def _fetch(url):return urlopen(Request(url,headers={'User-Agent':'ThemeHub/console-artwork'}),timeout=40)
def _download(pack,path):
 url=pack['url']
 if not url.startswith('https://gitflic.ru/project/spon4ik67/themehubconsoleassets/release/'):raise ValueError('Untrusted console artwork URL')
 if path.is_file() and path.stat().st_size==pack['bytes'] and hashlib.sha256(path.read_bytes()).hexdigest()==pack['sha256']:return
 partial=path.with_suffix('.part');digest=hashlib.sha256();size=0
 with _fetch(url) as response,partial.open('wb') as out:
  while True:
   block=response.read(128*1024)
   if not block:break
   size+=len(block)
   if size>pack['bytes']:raise ValueError('Artwork download exceeds expected size')
   digest.update(block);out.write(block)
 if size!=pack['bytes'] or digest.hexdigest()!=pack['sha256']:raise ValueError('Artwork checksum mismatch')
 os.replace(partial,path)
def _extract(pack,archive,staging):
 prefix=PurePosixPath('assets')/pack['id'];total=0;seen=set()
 with zipfile.ZipFile(archive) as z:
  entries=z.infolist()
  if len(entries)!=pack['files']:raise ValueError('Unexpected artwork entry count')
  for entry in entries:
   p=PurePosixPath(entry.filename)
   if p.is_absolute() or '..' in p.parts or '\\' in entry.filename or p.parent!=prefix or ':' in p.name or '\x00' in p.name or p.suffix.lower() not in {'.png','.jpg','.jpeg','.webp','.gif'} or stat.S_ISLNK(entry.external_attr>>16) or entry.filename.casefold() in seen:raise ValueError('Invalid artwork entry')
   seen.add(entry.filename.casefold());total+=entry.file_size
   if total>pack['unpackedBytes']:raise ValueError('Expanded artwork exceeds expected size')
   target=staging.joinpath(*p.parts);target.parent.mkdir(parents=True,exist_ok=True)
   with z.open(entry) as source,target.open('wb') as out:
    remaining=entry.file_size
    while remaining:
     block=source.read(min(remaining,128*1024))
     if not block:raise ValueError('Truncated artwork entry')
     remaining-=len(block);out.write(block)
  if total!=pack['unpackedBytes']:raise ValueError('Unexpected artwork size')
def install(theme):
 global _progress
 if not isinstance(theme,str) or theme not in GROUPS:return {'success':False,'error':'Unknown console theme'}
 if not _lock.acquire(blocking=False):return {'success':False,'error':'Artwork download already running'}
 staging=None
 try:
  import tempfile,shutil
  packs=[p for p in manifest()['packs'] if p['id'] in GROUPS[theme]]
  _progress={'busy':True,'percent':0,'message':'Downloading console artwork'}
  for i,pack in enumerate(packs):
   _progress.update(percent=round(i*100/len(packs)),message=pack['id'])
   if resource_dir(pack['id']):continue
   cache=root()/'archives';cache.mkdir(parents=True,exist_ok=True);archive=cache/(pack['sha256']+'.zip')
   _download(pack,archive)
   dest=destination(pack);dest.parent.mkdir(parents=True,exist_ok=True)
   staging=Path(tempfile.mkdtemp(prefix='.install-',dir=dest.parent));_extract(pack,archive,staging)
   (staging/'ready.json').write_text(json.dumps({'sha256':pack['sha256']}),encoding='utf-8')
   if dest.exists():shutil.rmtree(dest)
   os.replace(staging,dest);staging=None
  _progress={'busy':False,'percent':100,'message':'Original console artwork ready'}
  return {'success':True,**status()}
 except Exception as e:
  _progress={'busy':False,'percent':0,'message':str(e)}
  return {'success':False,'error':str(e),**status()}
 finally:
  if staging and staging.exists():
   import shutil
   shutil.rmtree(staging)
  _lock.release()
