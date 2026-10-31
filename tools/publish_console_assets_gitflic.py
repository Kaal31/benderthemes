"""Publish data-only console UI packs to GitFlic; credentials are environment-only."""
import argparse,base64,hashlib,json,os,subprocess,urllib.request,urllib.error,zipfile
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
OWNER='spon4ik67';PROJECT='themehubconsoleassets';BASE='https://api.gitflic.ru'
SETS=['x360-blades-original','x360-kinect-dash','x360-metro-dash','x360-nxe-dash','xbox-original','xmb-ps3']
OUT=ROOT/'work/console-assets-repository'
def api(path,data=None):
 req=urllib.request.Request(BASE+path,data=json.dumps(data).encode() if data is not None else None,headers={'Authorization':'token '+os.environ['GITFLIC_TOKEN'],'Content-Type':'application/json'})
 with urllib.request.urlopen(req,timeout=45) as r:return json.load(r)
def git(*args):
 env=os.environ.copy();auth=base64.b64encode((OWNER+':'+env['GITFLIC_TOKEN']).encode()).decode()
 env.update(GIT_TERMINAL_PROMPT='0',GIT_CONFIG_COUNT='1',GIT_CONFIG_KEY_0='http.extraHeader',GIT_CONFIG_VALUE_0='Authorization: Basic '+auth)
 r=subprocess.run(['git',*args],cwd=OUT,env=env,capture_output=True,text=True)
 if r.returncode:raise RuntimeError('Git '+args[0]+' failed (credentials withheld)')
 return r.stdout

def build():
 OUT.mkdir(parents=True,exist_ok=True);(OUT/'packs').mkdir(exist_ok=True)
 items=[]
 for name in SETS:
  files=sorted((ROOT/'bundle/assets'/name).glob('*'));files=[p for p in files if p.is_file() and p.suffix.lower() in {'.png','.jpg','.jpeg','.webp','.gif'}]
  if not files:continue
  target=OUT/'packs'/(name+'-v1.zip')
  with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
   for p in files:z.write(p,'assets/'+name+'/'+p.name)
  items.append(dict(id=name,name=name,file=target.name,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),bytes=target.stat().st_size,unpackedBytes=sum(p.stat().st_size for p in files),files=len(files)))
 manifest=dict(schema=1,version='console-ui-v1',repository=f'https://gitflic.ru/project/{OWNER}/{PROJECT}',packs=items)
 (OUT/'packs.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
 (OUT/'README.md').write_text('# ThemeHub console UI asset packs\n\nOptional, data-only artwork for the independently implemented ThemeHub layouts. Download and extract a pack into a separate asset directory. The plugin keeps original SVG/procedural fallbacks when these packs are unavailable.\n\nConsole artwork retains its original ownership. These packs do not relicense original console resources. Local sources: the Xbox 360 dashboard reference packs and original Xbox texture conversions already used in this project; xmb-ps3 is the current local PS3 interface set. Avatar meshes/animations remain in MetroAvatarAssets. No firmware executables, keys, account data or credentials are included. This is the locally available UI snapshot, not every asset from every console firmware.\n\nSee packs.json for public download URLs and SHA-256 values.\n',encoding='utf-8')
 (OUT/'.gitignore').write_text('packs/\n.publish-*\n',encoding='utf-8')
 print('Prepared',len(items),'packs;',sum(p['bytes'] for p in items),'bytes',flush=True)
 return manifest

def upload(release,path):
 response=OUT/('.publish-'+path.name+'.json')
 config='header = "Authorization: token '+os.environ['GITFLIC_TOKEN']+'"\n'
 r=subprocess.run(['curl.exe' if os.name=='nt' else 'curl','--config','-','--silent','--show-error','--fail','--connect-timeout','30','--max-time','600','--output',str(response),'--form','files=@'+str(path)+';type=application/octet-stream',BASE+f'/project/{OWNER}/{PROJECT}/release/'+release['id']+'/file'],input=config,text=True,capture_output=True)
 if r.returncode:raise RuntimeError('Upload failed for '+path.name+' (credentials withheld)')
 return json.loads(response.read_text(encoding='utf-8'))

def publish(manifest):
 try:api(f'/project/{OWNER}/{PROJECT}')
 except urllib.error.HTTPError as e:
  if e.code!=404:raise
  api('/project',dict(title='ThemeHub Console Assets',alias=PROJECT,ownerAlias=OWNER,ownerAliasType='USER',isPrivate=False,language='Markdown',description='Optional console interface artwork packs for ThemeHub; independently implemented layouts remain separate.'))
 if not (OUT/'.git').exists():
  git('init','-b','master');git('remote','add','origin',f'https://gitflic.ru/project/{OWNER}/{PROJECT}.git')
 git('add','README.md','.gitignore','packs.json')
 if git('status','--porcelain').strip():git('commit','-m','Prepare optional console UI asset packs')
 git('push','-u','origin','master')
 if not git('tag','--list','console-ui-v1').strip():git('tag','console-ui-v1')
 git('push','origin','console-ui-v1')
 base=f'/project/{OWNER}/{PROJECT}'
 releases=api(base+'/release?size=100').get('_embedded',{}).get('releaseTagModelList',[])
 rel=next((r for r in releases if r['tagName']=='console-ui-v1'),None)
 if not rel:rel=api(base+'/release',dict(title='Console UI artwork v1',tagName='console-ui-v1',description='Optional console artwork packs. Independently implemented fallback UI remains available in ThemeHub.',preRelease=False,attachProjectArchive=False))
 rel=api(base+'/release/'+rel['id'])
 for pack in manifest['packs']:
  attachment=next((a for a in rel.get('attachmentFiles',[]) if a['name']==pack['file']),None)
  if attachment is None:
   print('Uploading',pack['file'],flush=True);rel=upload(rel,OUT/'packs'/pack['file']);attachment=next(a for a in rel['attachmentFiles'] if a['name']==pack['file'])
  if attachment['size']!=pack['bytes'] or attachment.get('hashSha256','').lower()!=pack['sha256']:raise ValueError('Remote checksum mismatch: '+pack['file'])
  pack['url']=f"https://gitflic.ru/project/{OWNER}/{PROJECT}/release/{rel['id']}/{attachment['uuid']}/download"
  print('Verified',pack['id'],flush=True)
 (OUT/'packs.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
 with zipfile.ZipFile(OUT/'packs/packs-manifest.zip','w',zipfile.ZIP_DEFLATED) as z:z.write(OUT/'packs.json','packs.json')
 rel=upload(rel,OUT/'packs/packs-manifest.zip')
 # Runtime has pinned public URLs/checksums; no login is needed for downloading.
 (ROOT/'py_modules/console-assets.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
 git('add','packs.json')
 if git('status','--porcelain').strip():git('commit','-m','Record verified public console pack URLs')
 git('push','origin','master');print('Published',manifest['repository'],flush=True)
if __name__=='__main__':
 p=argparse.ArgumentParser();p.add_argument('--publish',action='store_true');args=p.parse_args();manifest=build()
 if args.publish:publish(manifest)
