"""Publish the user-supplied language-selector song as a separate GitFlic pack."""
import argparse,hashlib,json,os,subprocess,zipfile
from pathlib import Path
import publish_console_assets_gitflic as p

def main():
 ap=argparse.ArgumentParser();ap.add_argument('source',type=Path);ap.add_argument('--publish',action='store_true');ap.add_argument('--release-tag',default='console-ui-v1');args=ap.parse_args()
 raw=args.source.read_bytes();target=p.OUT/'packs/ps2-language-music-v1.zip';target.parent.mkdir(parents=True,exist_ok=True)
 with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED) as z:
  info=zipfile.ZipInfo('assets/ps2-language-music/infant-joy.mp3',(2026,11,21,0,0,0));info.compress_type=zipfile.ZIP_DEFLATED;z.writestr(info,raw)
 item=dict(id='ps2-language-music',name='PS2 language select — Infant Joy',file=target.name,sha256=hashlib.sha256(target.read_bytes()).hexdigest(),bytes=target.stat().st_size,unpackedBytes=len(raw),files=1)
 metadata=p.OUT/'ps2-language-music.json'
 if not args.publish:print(json.dumps(item));return
 if not os.environ.get('GITFLIC_TOKEN'):
  result=subprocess.run(['git','credential','fill'],input='protocol=https\nhost=gitflic.ru\n\n',text=True,capture_output=True,env={**os.environ,'GIT_TERMINAL_PROMPT':'0','GCM_INTERACTIVE':'Never'})
  credential=dict(line.split('=',1) for line in result.stdout.splitlines() if '=' in line)
  if credential.get('password'):os.environ['GITFLIC_TOKEN']=credential['password']
 if not os.environ.get('GITFLIC_TOKEN'):raise SystemExit('GitFlic credential unavailable; audio prepared locally.')
 base=f'/project/{p.OWNER}/{p.PROJECT}';p.api(base)
 metadata.write_text(json.dumps(dict(schema=1,packs=[item]),indent=2)+'\n',encoding='utf-8')
 releases=p.api(base+'/release?size=100').get('_embedded',{}).get('releaseTagModelList',[]);release=next((r for r in releases if r['tagName']==args.release_tag),None)
 if not release:raise SystemExit('Existing asset release not found; no new release or tag created.')
 release=p.api(base+'/release/'+release['id']);attachment=next((a for a in release.get('attachmentFiles',[]) if a['name']==item['file']),None)
 if not attachment:release=p.upload(release,target);attachment=next(a for a in release['attachmentFiles'] if a['name']==item['file'])
 assert attachment['size']==item['bytes'] and attachment.get('hashSha256','').lower()==item['sha256']
 item['url']=f"https://gitflic.ru/project/{p.OWNER}/{p.PROJECT}/release/{release['id']}/{attachment['uuid']}/download"
 metadata.write_text(json.dumps(dict(schema=1,packs=[item]),indent=2)+'\n',encoding='utf-8')
 runtime=p.ROOT/'py_modules/console-assets.json';manifest=json.loads(runtime.read_text(encoding='utf-8'));manifest['packs']=[x for x in manifest['packs'] if x['id']!=item['id']]+[item];runtime.write_text(json.dumps(manifest,indent=2)+'\n',encoding='utf-8')
 print('Asset ZIP attached and checksum verified:',item['url'])

if __name__=='__main__':main()
