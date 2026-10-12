"""Publish changed asset ZIPs to the dedicated repository, then update its beta catalogue."""
import hashlib, json, os, subprocess, urllib.request, urllib.error
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
REPO = 'Kaal31/deckthemes-assets'
def token():
    if os.environ.get('GH_TOKEN'): return os.environ['GH_TOKEN']
    result = subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',text=True,capture_output=True,check=True)
    return dict(line.split('=',1) for line in result.stdout.splitlines() if '=' in line)['password']
TOKEN=token()
def api(path, method='GET', data=None, binary=False):
    url=path if path.startswith('https://') else 'https://api.github.com'+path
    body=data if binary else json.dumps(data).encode() if data is not None else None
    req=urllib.request.Request(url,data=body,method=method,headers={'Authorization':'Bearer '+TOKEN,'User-Agent':'DeckThemes-assets','Accept':'application/vnd.github+json','Content-Type':'application/zip' if binary else 'application/json'})
    with urllib.request.urlopen(req,timeout=180) as r:
        content=r.read();return json.loads(content) if content else None
try: api('/repos/'+REPO)
except urllib.error.HTTPError as e:
    if e.code!=404:raise
    api('/user/repos','POST',{'name':'deckthemes-assets','description':'Versioned theme resources and cached Hub previews for Deck Home Themes.','private':False,'auto_init':True})
catalog=json.loads((ROOT/'out/themes/theme-catalog.json').read_text(encoding='utf-8'))
def publish(tag,name,file):
    try:r=api('/repos/'+REPO+'/releases/tags/'+tag)
    except urllib.error.HTTPError as e:
        if e.code!=404:raise
        r=api('/repos/'+REPO+'/releases','POST',{'tag_name':tag,'name':name,'prerelease':True,'draft':True})
    existing = next((a for a in r['assets'] if a['name']==file.name), None)
    if not existing:
        api(r['upload_url'].split('{')[0]+'?name='+file.name,'POST',file.read_bytes(),True)
        print('Uploaded '+file.name,flush=True)
    else:
        expected = 'sha256:' + hashlib.sha256(file.read_bytes()).hexdigest()
        if existing.get('digest') != expected:
            raise ValueError('Existing immutable asset has a different or unavailable checksum: '+file.name)
        print('Reused '+file.name,flush=True)
    if r['draft']:api('/repos/'+REPO+'/releases/'+str(r['id']),'PATCH',{'draft':False,'prerelease':True})
for pack in catalog['themes']:
    name=pack['url'].rsplit('/',1)[1]
    publish(pack['id']+'-v'+pack['version'],pack['name']+' assets '+pack['version'],ROOT/'out/themes'/name)
publish('gallery-'+catalog['gallery']['sha256'][:16],'Hub preview gallery',ROOT/'out/themes/HubPreviews.zip')
try:r=api('/repos/'+REPO+'/releases/tags/beta-catalog')
except urllib.error.HTTPError as e:
    if e.code!=404:raise
    r=api('/repos/'+REPO+'/releases','POST',{'tag_name':'beta-catalog','name':'Beta theme catalogue','prerelease':True})
for a in r['assets']:
    if a['name']=='theme-catalog.json':api('/repos/'+REPO+'/releases/assets/'+str(a['id']),'DELETE')
api(r['upload_url'].split('{')[0]+'?name=theme-catalog.json','POST',(ROOT/'out/themes/theme-catalog.json').read_bytes(),True)
(ROOT/'asset-catalog.json').write_text(json.dumps(catalog,indent=2)+'\n',encoding='utf-8')
print('Published beta catalogue and saved asset-catalog.json',flush=True)
