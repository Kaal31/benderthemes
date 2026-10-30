import json,os,sys,zipfile
from pathlib import Path
sys.path.insert(0,str(Path(__file__).resolve().parent))
import publish_console_assets_gitflic as p
manifest=json.loads((p.OUT/'nintendo-packs.json').read_text(encoding='utf-8'))
base=f'/project/{p.OWNER}/{p.PROJECT}'
# Reuse the Windows credential store without printing credential values.
import subprocess
if not os.environ.get('GITFLIC_TOKEN'):
 r=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=gitflic.ru\n\n',text=True,capture_output=True,env={**os.environ,'GIT_TERMINAL_PROMPT':'0','GCM_INTERACTIVE':'Never'})
 values=dict(line.split('=',1) for line in r.stdout.splitlines() if '=' in line)
 if values.get('password'):os.environ['GITFLIC_TOKEN']=values['password']
if not os.environ.get('GITFLIC_TOKEN'):
 print('UPLOAD_BLOCKED: No GitFlic credential found in environment or Windows credential store.');sys.exit(2)
p.api(base)
p.git('add','nintendo-packs.json')
if p.git('diff','--cached','--name-only').strip():p.git('commit','-m','Prepare separate Nintendo menu and Mii resource packs')
p.git('push','origin','master')
tag='nintendo-local-v1'
if not p.git('tag','--list',tag).strip():p.git('tag',tag)
p.git('push','origin',tag)
releases=p.api(base+'/release?size=100').get('_embedded',{}).get('releaseTagModelList',[])
rel=next((r for r in releases if r['tagName']==tag),None)
if not rel:rel=p.api(base+'/release',dict(title='Nintendo local reference resources v1',tagName=tag,description='Version-labelled extracted UI data and separate Mii resource packs. See nintendo-packs.json for scope and limitations. No firmware executables or keys.',preRelease=False,attachProjectArchive=False))
rel=p.api(base+'/release/'+rel['id'])
for pack in manifest['packs']:
 a=next((a for a in rel.get('attachmentFiles',[]) if a['name']==pack['file']),None)
 if a is None:
  print('Uploading',pack['id'],flush=True);rel=p.upload(rel,p.OUT/'packs'/pack['file']);a=next(a for a in rel['attachmentFiles'] if a['name']==pack['file'])
 if a['size']!=pack['bytes'] or a.get('hashSha256','').lower()!=pack['sha256']:raise ValueError('Remote verification failed: '+pack['id'])
 pack['url']=f"https://gitflic.ru/project/{p.OWNER}/{p.PROJECT}/release/{rel['id']}/{a['uuid']}/download"
 print('Verified',pack['id'],flush=True)
(p.OUT/'nintendo-packs.json').write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
p.git('add','nintendo-packs.json');p.git('commit','-m','Record verified Nintendo resource download URLs');p.git('push','origin','master')
print('Published Nintendo packs')
