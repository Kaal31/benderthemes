"""Fetch real Themezer fixtures and regenerate honest conversion reports."""
import argparse
import base64
from concurrent.futures import ThreadPoolExecutor
import html
import json
from pathlib import Path
import re
import sys
import urllib.request

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / 'py_modules'))
import switch_themes
from switch_layout import convert_layout

out = ROOT / 'work/themezer-validation'
out.mkdir(parents=True, exist_ok=True)
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('--refresh-pages', action='store_true')
parser.add_argument('--ids', help='Comma-separated fixture IDs; preserve other cached manifest entries')
args = parser.parse_args()
cases = json.loads((ROOT / 'tests/fixtures/switch/themezer-cases.json').read_text())
manifest_path = out / 'manifest.json'
previous = json.loads(manifest_path.read_text()) if manifest_path.exists() else []
cached = {x['id']: x for x in previous if 'fetchError' not in x}
selected = {x.strip().upper() for x in args.ids.split(',') if x.strip()} if args.ids else set()
if selected - {x['id'] for x in cases}:
    parser.error('Unknown fixture IDs: ' + ', '.join(sorted(selected - {x['id'] for x in cases})))

def get(url):
    request = urllib.request.Request(url, headers={'User-Agent': 'ThemeHub-conversion-validation/1.0'})
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read()

def fetch(case):
    ident = case['id']
    page = 'https://themezer.net/switch/themes/' + case['slug'] + '-' + ident
    item = {**case, 'page': page}
    try:
        if ident in cached and not args.refresh_pages:
            item.update(title=cached[ident]['title'], reference=cached[ident]['reference'])
        else:
            source = get(page).decode('utf-8')
            ref = re.search(r'<meta property="og:image" content="([^"]+)', source)
            title = re.search(r'<h1[^>]*>(.*?)</h1>', source, re.S)
            if not ref or not title:
                raise ValueError('Theme page has no author screenshot or title')
            item.update(title=html.unescape(re.sub('<[^>]+>', '', title[1])), reference=html.unescape(ref[1]))
        target = out / (ident + '.nxtheme')
        if not target.exists():
            data = get('https://api.themezer.net/switch/themes/' + ident + '/download')
            if len(data) > switch_themes.MAX_FILE:
                raise ValueError('Theme exceeds converter size limit')
            target.write_bytes(data)
        skin = switch_themes.read_theme(str(out), target.name, lambda d,m: 'data:' + m + ';base64,' + base64.b64encode(d).decode())
        if not skin or 'home' not in skin.get('screens', {}):
            raise ValueError('Fixture did not decode as a Home Menu theme')
        archive = switch_themes._archive(target)
        conversion = convert_layout(archive, 'home', warning_limit=None)
        from switch_resources import read_resources
        resources=read_resources(out,lambda d,m:'data:'+m+';base64,'+base64.b64encode(d).decode())
        conversion['nativePictures']=resources['pictures']
        conversion['nativeTextures']=resources['textures']
        conversion['nativeFonts']=resources['fonts']
        conversion['resourceWarnings']=resources['warnings']
        if len(conversion['warnings']) != conversion['warningCount']:
            raise ValueError('Diagnostic warning list is incomplete')
        skin['screens']['home']['conversion'] = conversion
        # Keep diagnostic pages complete even when the product UI truncates warnings.
        (out / (ident + '.json')).write_text(json.dumps(skin), encoding='utf-8')
        item.update(converted=conversion.get('converted', 0), warnings=conversion.get('warnings', []), warningCount=conversion.get('warningCount', 0))
        item['artworkOnly'] = not conversion.get('converted') and not conversion.get('warningCount')
        item['animationCount'] = len(conversion.get('animations', []))
        item['ignoredTargets'] = conversion.get('ignoredTargets', [])
        item['ignoredProperties'] = conversion.get('ignoredProperties', [])
        item['ignoredProperties'] = conversion.get('ignoredProperties', [])
        item['ignoredAssignments'] = conversion.get('ignoredAssignments', [])
        item['notes'] = conversion.get('notes', [])
        print(ident, item['title'], 'converted', item['converted'], 'warnings', item['warningCount'], flush=True)
    except Exception as error:
        item['fetchError'] = str(error)
        print(ident, 'FETCH FAILED:', str(error), flush=True)
    return item

with ThreadPoolExecutor(max_workers=4) as executor:
    fetched = list(executor.map(fetch, [x for x in cases if not selected or x['id'] in selected]))
updates = {x['id']: x for x in fetched}
prior = {x['id']: x for x in previous}
manifest = [updates.get(x['id'], prior.get(x['id'], x)) for x in cases]
manifest_path.write_text(json.dumps(manifest, indent=2), encoding='utf-8')
print('Fetched', sum('fetchError' not in x for x in fetched), 'of', len(fetched), 'selected themes; manifest contains', len(manifest))
if any('fetchError' in x for x in fetched):
    sys.exit(1)
