"""Publish only the Hub preview gallery and the beta catalogue (no theme packs) to Kaal31/deckthemes-assets.

Uses out/themes/HubPreviews.zip and asset-catalog.json (whose "gallery" entry must match the zip). Same login as
tools/publish_assets.py: GH_TOKEN, or the GitHub credential git has stored.
"""
import hashlib, json, os, subprocess, sys, urllib.request, urllib.error
from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
REPO = 'Kaal31/deckthemes-assets'
ZIP = ROOT / 'out/themes/HubPreviews.zip'
catalog_bytes = (ROOT / 'asset-catalog.json').read_bytes()
gallery = json.loads(catalog_bytes)['gallery']
data = ZIP.read_bytes()
if hashlib.sha256(data).hexdigest() != gallery['sha256'] or len(data) != gallery['size']:
    raise SystemExit('HubPreviews.zip does not match the gallery entry in asset-catalog.json')
def token():
    if os.environ.get('GH_TOKEN'): return os.environ['GH_TOKEN']
    result = subprocess.run(['git','credential','fill'],input='protocol=https\nhost=github.com\n\n',text=True,capture_output=True,check=True)
    return dict(line.split('=',1) for line in result.stdout.splitlines() if '=' in line)['password']
TOKEN = token()
def api(path, method='GET', body=None, binary=False):
    url = path if path.startswith('https://') else 'https://api.github.com' + path
    payload = body if binary else json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=payload, method=method, headers={'Authorization': 'Bearer ' + TOKEN, 'User-Agent': 'DeckThemes-assets',
        'Accept': 'application/vnd.github+json', 'Content-Type': 'application/zip' if binary else 'application/json'})
    with urllib.request.urlopen(req, timeout=180) as r:
        content = r.read(); return json.loads(content) if content else None
def release(tag, name):
    try: return api(f'/repos/{REPO}/releases/tags/{tag}')
    except urllib.error.HTTPError as e:
        if e.code != 404: raise
        return api(f'/repos/{REPO}/releases', 'POST', {'tag_name': tag, 'name': name, 'prerelease': True})
def upload(r, name, body):
    api(r['upload_url'].split('{')[0] + '?name=' + name, 'POST', body, True)

tag = 'gallery-' + gallery['sha256'][:16]
r = release(tag, 'Hub preview gallery')
if not any(a['name'] == 'HubPreviews.zip' for a in r['assets']):
    upload(r, 'HubPreviews.zip', data); print('Uploaded HubPreviews.zip to ' + tag, flush=True)
else: print('HubPreviews.zip already on ' + tag, flush=True)
# --gallery-only keeps experimental IDs out of the shared legacy catalogue.
if "--gallery-only" in sys.argv:
    print("Published immutable gallery; shared catalogue unchanged", flush=True)
    raise SystemExit(0)
# the catalogue goes live only once its gallery is downloadable
r = release('beta-catalog', 'Beta theme catalogue')
for a in r['assets']:
    if a['name'] == 'theme-catalog.json': api(f'/repos/{REPO}/releases/assets/{a["id"]}', 'DELETE')
upload(r, 'theme-catalog.json', catalog_bytes)
print('Published beta catalogue pointing at ' + gallery['url'], flush=True)
