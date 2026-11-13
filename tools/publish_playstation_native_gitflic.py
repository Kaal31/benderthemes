"""Upload prepared PlayStation UI ZIPs; credentials are environment-only."""
import sys,json
from pathlib import Path
sys.path.insert(0,'tools');import publish_console_assets_gitflic as p
path=p.OUT/'playstation-native-packs.json';manifest=json.loads(path.read_text());base=f'/project/{p.OWNER}/{p.PROJECT}';tag='playstation-native-ui-v1'
p.git('add',path.name)
if p.git('diff','--cached','--name-only').strip():p.git('commit','-m','Prepare native PlayStation UI runtime artwork')
p.git('push','origin','master')
if not p.git('tag','--list',tag).strip():p.git('tag',tag)
p.git('push','origin',tag)
rels=p.api(base+'/release?size=100').get('_embedded',{}).get('releaseTagModelList',[]);rel=next((r for r in rels if r['tagName']==tag),None)
if not rel:rel=p.api(base+'/release',dict(title='Native PlayStation UI icons v1',tagName=tag,description='Extracted PS3 OFW 4.91 and PSP OFW 6.61 dashboard icon PNGs from user-supplied firmware sources. No firmware executables, keys or account data.',preRelease=False,attachProjectArchive=False))
rel=p.api(base+'/release/'+rel['id'])
for pack in manifest['packs']:
 a=next((a for a in rel.get('attachmentFiles',[]) if a['name']==pack['file']),None)
 if not a:rel=p.upload(rel,p.OUT/'packs'/pack['file']);a=next(a for a in rel['attachmentFiles'] if a['name']==pack['file'])
 assert a['size']==pack['bytes'] and a.get('hashSha256','').lower()==pack['sha256']
 pack['url']=f"https://gitflic.ru/project/{p.OWNER}/{p.PROJECT}/release/{rel['id']}/{a['uuid']}/download";print('Verified',pack['id'],flush=True)
path.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
runtime=p.ROOT/'py_modules/console-assets.json';data=json.loads(runtime.read_text());ids={x['id'] for x in manifest['packs']};data['packs']=[x for x in data['packs'] if x['id'] not in ids]+manifest['packs'];runtime.write_text(json.dumps(data,indent=2)+'\n',encoding='utf-8')
p.git('add',path.name);p.git('commit','-m','Record verified native PlayStation UI URLs');p.git('push','origin','master')
