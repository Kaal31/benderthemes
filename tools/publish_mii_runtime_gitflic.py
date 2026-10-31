from pathlib import Path
import sys,json
sys.path.insert(0,'tools')
import publish_console_assets_gitflic as p
pack=json.loads((p.OUT/'mii-runtime-pack.json').read_text())
base=f'/project/{p.OWNER}/{p.PROJECT}';tag=pack['file'].removesuffix('.zip')
p.git('add','mii-runtime-pack.json')
if p.git('diff','--cached','--name-only').strip():p.git('commit','-m','Prepare native Mii runtime mesh pack')
p.git('push','origin','master')
if not p.git('tag','--list',tag).strip():p.git('tag',tag)
p.git('push','origin',tag)
releases=p.api(base+'/release?size=100').get('_embedded',{}).get('releaseTagModelList',[])
rel=next((r for r in releases if r['tagName']==tag),None)
if not rel:rel=p.api(base+'/release',dict(title='Native Mii runtime meshes v1',tagName=tag,description='External native Wii U bodies and Wii RFL head/hair geometry, converted for the independent ThemeHub renderer. Facial features and motion remain reconstructed. No firmware, keys or executable code.',preRelease=False,attachProjectArchive=False))
rel=p.api(base+'/release/'+rel['id']);a=next((a for a in rel.get('attachmentFiles',[]) if a['name']==pack['file']),None)
if not a:rel=p.upload(rel,p.OUT/'packs'/pack['file']);a=next(a for a in rel['attachmentFiles'] if a['name']==pack['file'])
assert a['size']==pack['bytes'] and a.get('hashSha256','').lower()==pack['sha256']
pack['url']=f"https://gitflic.ru/project/{p.OWNER}/{p.PROJECT}/release/{rel['id']}/{a['uuid']}/download"
(p.OUT/'mii-runtime-pack.json').write_text(json.dumps(pack,indent=2)+'\n',encoding='utf-8')
runtime=p.ROOT/'py_modules/console-assets.json';manifest=json.loads(runtime.read_text());manifest['packs']=[x for x in manifest['packs'] if x['id']!=pack['id']]+[pack];runtime.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
p.git('add','mii-runtime-pack.json');p.git('commit','-m','Record verified native Mii download URL');p.git('push','origin','master')
print('Native Mii runtime uploaded and SHA-256 verified')
