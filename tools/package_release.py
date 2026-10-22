"""Create a self-contained Decky installation ZIP after npm run build."""
from pathlib import Path
import json, zipfile, py_compile, os, shutil
from package_themes import build as build_themes, offline_catalog
root=Path(__file__).resolve().parent.parent
version=json.loads((root/'package.json').read_text())['version']
py_compile.compile(str(root/'main.py'),doraise=True)
assert (root/'dist/index.js').is_file(), 'Run npm run build first'
# OFFLINE=1: every theme's artwork, sounds and music go inside the plugin ZIP (as bundled
# defaults), so a test build works without the Hub or any hosted asset packs.
OFFLINE = os.environ.get("OFFLINE") == "1"
# ONLINE_ASSETS=1: PRIVATE ONLINE TEST builds. Theme packs are not in the ZIP; the Hub downloads them from the private
# Kaal31/assets-data repository (asset-catalog-online.json, published with tools/publish_assets_data.py) using the
# read-only token in ASSETS_READ_TOKEN, written to asset-source.json inside the ZIP. Never publish such a build.
ONLINE = os.environ.get("ONLINE_ASSETS") == "1"
ASSET_SOURCE = None
if ONLINE:
    assert not OFFLINE, 'ONLINE_ASSETS and OFFLINE exclude each other'
    token = os.environ.get("ASSETS_READ_TOKEN", "").strip()
    assert token, 'ASSETS_READ_TOKEN (read-only token for Kaal31/assets-data) is missing'
    shutil.copyfile(root/'asset-catalog-online.json', root/'theme-catalog.json')
    ASSET_SOURCE = json.dumps({"repo": "Kaal31/assets-data", "ref": "main", "token": token})
elif OFFLINE:
    offline_catalog()
elif os.environ.get("USE_PUBLISHED_ASSETS") == "1":
    shutil.copyfile(root/'asset-catalog.json', root/'theme-catalog.json')
else:
    build_themes()
# INCLUDE_TEST_STOCK=1: TEST builds only. Puts the owner's own Wii U menu files (5.5.5 US, local-material/wiiu-stock,
# Nintendo data) into the ZIP as defaults/skins/wiiu-stock, so Wii U themes work without importing a dump.
# Never publish such a build; default builds do not include them.
TEST_STOCK = os.environ.get("INCLUDE_TEST_STOCK") == "1"
if TEST_STOCK:
    assert (root/'local-material/wiiu-stock/Men.pack').is_file(), 'local-material/wiiu-stock is missing'
    print('WARNING: this build contains Nintendo data (Wii U menu files). TEST BUILD ONLY: do not publish or share it.')
# INCLUDE_TEST_THEMES=1: PRIVATE TEST BUILDS only. Copies the curated third-party theme files from the (uncommitted) staging
# folder (TEST_THEMES_DIR, default local-material/test-release-themes/<kind>/...) into defaults/skins/<kind>/. Never publish.
# The plugin reads them there in place, read-only (main.py _skin_entries / _switch_folders); the user's own files win.
TEST_THEMES = os.environ.get("INCLUDE_TEST_THEMES") == "1"
TEST_THEMES_DIR = Path(os.environ.get("TEST_THEMES_DIR") or root/'local-material/test-release-themes').resolve()
# staging folder -> plugin skins/<kind> folder (the PS3 importer's folder is "p3t")
TEST_THEME_KINDS = {'p3t': 'p3t', 'ps3': 'p3t', 'psp': 'psp', 'vita': 'vita', 'switch': 'switch', 'wii': 'wii', 'wiiu': 'wiiu',
                    '3ds': '3ds', 'n3ds': '3ds', 'xbox': 'xbox', 'x360': 'x360'}
if TEST_THEMES:
    assert TEST_THEMES_DIR.is_dir(), f'{TEST_THEMES_DIR} is missing (collect the staging folder first)'
    unknown = [p.name for p in TEST_THEMES_DIR.iterdir() if p.is_dir() and p.name not in TEST_THEME_KINDS]
    assert not unknown, f'unknown kind folders in {TEST_THEMES_DIR}: {unknown}'
    print('=' * 78)
    print('WARNING: PRIVATE TEST BUILD. This ZIP contains THIRD-PARTY theme files and (with INCLUDE_TEST_STOCK) Nintendo data.')
    print('         NEVER publish it, attach it to a release or share it.')
    print('=' * 78)
# TEST_TAG=test12 -> DeckHomeThemes-v1.10.2-test12-FULLTEST.zip (only the file name changes, not package.json)
TEST_TAG = os.environ.get("TEST_TAG", "").strip()
if ONLINE:
    name_tail = (f'-{TEST_TAG}' if TEST_TAG else '') + '-ONLINETEST'
elif OFFLINE and TEST_STOCK and TEST_THEMES:
    name_tail = (f'-{TEST_TAG}' if TEST_TAG else '') + '-FULLTEST'
else:
    name_tail = (f'-{TEST_TAG}' if TEST_TAG else '') + ("-offline" if OFFLINE else "") + ("-TESTSTOCK" if TEST_STOCK else "") + ("-TESTTHEMES" if TEST_THEMES else "")
# Downloadable theme media stays in its published asset pack, even when present in a developer checkout.
media_catalog=json.loads((root/'py_modules/frame_media_catalog.json').read_text(encoding='utf-8'))
migrated_media={f'themes/{ident}/{name}' for ident,spec in media_catalog.items() for name in spec['files']}
out=root/'out'; out.mkdir(exist_ok=True)
target=out/f'DeckHomeThemes-v{version}{name_tail}.zip'
with zipfile.ZipFile(target,'w',zipfile.ZIP_DEFLATED,compresslevel=6) as z:
    for name in ['main.py','plugin.json','package.json','README.md','dist/index.js','theme-catalog.json']:
        z.write(root/name,'DeckHomeThemes/'+name)
    if ASSET_SOURCE:
        z.writestr('DeckHomeThemes/asset-source.json', ASSET_SOURCE)
    if os.environ.get("RELEASE_CHANNEL"):
        from channel_build import identity
        metadata = json.loads((root/'release-channel.json').read_text(encoding='utf-8'))
        assert metadata == identity(version, os.environ['RELEASE_CHANNEL'], metadata['build'], metadata['attempt'], metadata['commit'])
        z.write(root/'release-channel.json','DeckHomeThemes/release-channel.json')
    # defaults/: themes shipped inside the plugin (e.g. the PSP "Default theme", made from a PSP firmware)
    folders=[('screensaver-player','screensaver-player'),('third-party','third-party'),('py_modules','py_modules'),('defaults','defaults'),('themes','themes'),('sdk','sdk')]
    if OFFLINE: folders.append(('bundle','defaults'))
    if TEST_STOCK: folders.append(('local-material/wiiu-stock','defaults/skins/wiiu-stock'))
    if TEST_THEMES:
        folders += [(TEST_THEMES_DIR/k,'defaults/skins/'+TEST_THEME_KINDS[k]) for k in sorted(TEST_THEME_KINDS) if (TEST_THEMES_DIR/k).is_dir()]
        if (TEST_THEMES_DIR/'SOURCES.txt').is_file():  # where each bundled theme came from
            z.write(TEST_THEMES_DIR/'SOURCES.txt','DeckHomeThemes/defaults/skins/TEST-THEMES-SOURCES.txt')
    for folder,destination in folders:
        folder=Path(folder) if Path(folder).is_absolute() else root/folder
        if not folder.is_dir(): continue
        for p in sorted(folder.rglob('*')):
            if p.is_file() and '__pycache__' not in p.parts and not p.name.startswith('.git'):
                if not OFFLINE and p.is_relative_to(root) and p.relative_to(root).as_posix() in migrated_media:
                    continue
                # pictures, sounds and videos are already compressed
                stored=p.suffix.lower() in ('.png','.jpg','.jpeg','.webp','.gif','.mp3','.ogg','.opus','.mp4','.webm','.zip','.p3t','.ctf','.ptf','.nxtheme','.utheme','.mym','.csm')
                z.write(p,'DeckHomeThemes/'+destination+'/'+p.relative_to(folder).as_posix(),compress_type=zipfile.ZIP_STORED if stored else zipfile.ZIP_DEFLATED)
with zipfile.ZipFile(target) as z:
    assert z.testzip() is None
    assert len(z.namelist())==len(set(z.namelist()))
    assert 'DeckHomeThemes/LICENSE' not in z.namelist()
    if TEST_THEMES:
        for kind in sorted(set(TEST_THEME_KINDS.values())):
            n = len({x.split('/')[4] for x in z.namelist() if x.startswith(f'DeckHomeThemes/defaults/skins/{kind}/')})
            if n: print(f'  defaults/skins/{kind}: {n} entries')
print(target)
print(f'{target.stat().st_size/1048576:.1f} MB; archive verified')
if TEST_THEMES or TEST_STOCK:
    print('=' * 78)
    print('REMINDER: PRIVATE TEST BUILD (third-party themes / Nintendo data inside). Never publish or share it.')
    print('=' * 78)
