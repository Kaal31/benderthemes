"""Read-only FSD/Aurora XUIZ resource packages. No XUR, Lua or shaders execute.

XUIZ layout cross-checked against rene0/xbox360 extract360.py and real packages:
big-endian 22-byte header, variable UTF-16BE index, relative payload offsets.
Only metadata, explicit wallpapers and package previews are imported initially.
"""
import json
import os
import struct
from pathlib import PurePosixPath
from theme_xml import parse_xml, ThemeXmlError

READER_VERSION = 1
MAX_PACKAGE = 256 * 1024 * 1024
MAX_TABLE = 8 * 1024 * 1024
MAX_ENTRY = 24 * 1024 * 1024


def settings_payload(payload):
    """Recover a complete XML document followed by stale editor buffer bytes.

    Validate the prefix strictly; never repair malformed interior XML or DTDs.
    Some XUI skin editors save extra bytes after the root closing tag.
    """
    import re
    if b'<!DOCTYPE' in payload.upper() or b'<!ENTITY' in payload.upper():
        raise ValueError('Unsupported settings declarations')
    match = re.match(br'\s*(?:<\?xml[^>]*\?>\s*)?<([A-Za-z_][\w:.-]*)(?:\s|>)', payload)
    if match:
        close = b'</' + match.group(1) + b'>'
        end = payload.find(close, match.end())
        if end >= 0 and payload[end + len(close):].strip():
            prefix = payload[:end + len(close)]
            parse_xml(prefix)
            return prefix, True
    return payload, False


def index(f):
    """Validated resource index, without writing any archive paths to disk."""
    f.seek(0, 2)
    length = f.tell()
    f.seek(0)
    h = f.read(22)
    if len(h) != 22 or h[:4] != b'XUIZ':
        raise ValueError('Not an XUIZ package')
    flags, declared, reserved, table_size, count = struct.unpack('>IIIIH', h[4:])
    if flags != 1 or reserved != 0:
        raise ValueError('Unsupported XUIZ flags/version')
    if length != declared or length > MAX_PACKAGE:
        raise ValueError('Invalid XUIZ package size')
    if not 0 < count <= 20000 or not count * 11 <= table_size <= min(MAX_TABLE, length - 22):
        raise ValueError('Invalid XUIZ index size')
    table = f.read(table_size)
    pos, entries, seen = 0, [], set()
    for _ in range(count):
        if pos + 9 > len(table):
            raise ValueError('Truncated XUIZ index')
        size, offset, chars = struct.unpack_from('>IIB', table, pos)
        pos += 9
        if not chars or pos + 2 * chars > len(table):
            raise ValueError('Invalid XUIZ filename')
        name = table[pos:pos + 2 * chars].decode('utf-16-be').replace('\\', '/')
        pos += 2 * chars
        if '\x00' in name or ':' in name or name.startswith('/') or any(p in ('', '.', '..') for p in name.split('/')):
            raise ValueError('Unsafe XUIZ resource path')
        key = name.casefold()
        if key in seen:
            raise ValueError('Duplicate XUIZ resource path')
        seen.add(key)
        start = 22 + table_size + offset
        if start + size > length:
            raise ValueError('XUIZ resource outside package')
        entries.append({'path': name, 'size': size, 'offset': start})
    if pos != table_size:
        raise ValueError('Unexpected XUIZ index padding')
    return entries


def _read(f, entry, limit=MAX_ENTRY):
    if entry['size'] > limit:
        raise ValueError('Resource exceeds import limit')
    f.seek(entry['offset'])
    data = f.read(entry['size'])
    if len(data) != entry['size']:
        raise ValueError('Truncated resource')
    return data


def resolve_resource(name, by_name):
    """Resolve exact paths, or an unambiguous package-local bare filename."""
    key = name.replace('\\', '/').lower()
    if key in by_name:
        return by_name[key]
    # XUI visuals embedded beside their images can use bare resource names.
    # Never repair a stale qualified path by selecting unrelated same-name art.
    if '/' in key:
        # Some animated wallpapers moved their frames into one extra package-local
        # subfolder without updating XUR references. Require the same background
        # subtree and a unique basename; do not repair arbitrary qualified paths.
        if key.startswith('images/background/'):
            parent, basename = key.rsplit('/', 1)
            matches = [entry for path, entry in by_name.items()
                       if path.startswith(parent + '/') and PurePosixPath(path).name == basename]
            if len(matches) == 1:
                return matches[0]
        return None
    matches = [entry for path, entry in by_name.items() if PurePosixPath(path).name == key]
    return matches[0] if len(matches) == 1 else None


def read_xzp(path):
    """Return the existing X360 theme contract plus explicit partial-support details."""
    from x360_themes import _as_picture, _url
    try:
        with open(path, 'rb') as f:
            entries = index(f)
            by_name = {e['path'].lower(): e for e in entries}
            if 'skin.xml' not in by_name:
                return None  # XUI packages also include non-skin resources
            xml = _read(f, by_name['skin.xml'], 1024 * 1024)
            if b'<!DOCTYPE' in xml.upper() or b'<!ENTITY' in xml.upper():
                raise ValueError('XML declarations are unsupported')
            # Some shipped FSD skins have mismatched tags; preserve validated package metadata.
            warnings = []
            try:
                tree = parse_xml(xml)
            except ThemeXmlError:
                tree = None
                warnings.append('Skin XML is malformed; layout settings were not read.')
            meta = {}
            if 'skin.meta' in by_name:
                try:
                    meta = json.loads(_read(f, by_name['skin.meta'], 256 * 1024).decode('utf-8-sig').rstrip('\x00 \r\n\t'))
                    if not isinstance(meta, dict):
                        meta = {}
                except (ValueError, UnicodeError):
                    warnings.append('Skin metadata is malformed; using the package filename.')
            family = 'aurora' if 'skin.meta' in by_name or any(e['path'].lower().startswith('aurora_') for e in entries) else 'fsd'
            def text(tag):
                return (tree.findtext('.//' + tag) or '').strip()[:200] if tree is not None else ''
            result = {'kind': 'theme', 'package': 'XUIZ', 'family': family,
                      'name': str(meta.get('skinname') or text('Skin') or os.path.basename(path))[:200],
                      'publisher': str(meta.get('author') or text('Author'))[:200],
                      'description': str(meta.get('description') or '')[:2000],
                      'version': str(meta.get('revision') or text('Version'))[:80],
                      'files': [{'path': e['path'], 'size': e['size']} for e in entries],
                      'pictures': [], 'backgrounds': [], 'background': None, 'preview': None,
                      'sections': {}, 'icons': {}, 'dashStyle': None, 'premium': False, 'params': {},
                      'errors': [], 'warnings': warnings,
                      'compatibility': {'mode': 'artwork-only', 'layout': False, 'animation': False,
                                        'scripts': False, 'shaders': False}}
            result['sceneSettings'] = {}
            result['sceneFonts'] = {}
            # Retain runtime configuration as well as auxiliary XML; layout paths,
            # material slot IDs and default-layout policy live in skin.xml.
            if tree is not None:
                result['sceneSettings']['skin.xml'] = [{'tag': n.tag, 'attributes': dict(n.attrib),
                    'text': (n.text or '').strip(), 'values': {child.tag: (child.text or '').strip() for child in n}}
                    for n in tree.iter()]
            if tree is not None:
                for font in tree.findall('.//font'):
                    if font.get('name') and font.get('file'):
                        result['sceneFonts'][font.get('name')] = font.get('file').replace('\\', '/').lower()
                        if font.get('default', '').lower() == 'true':
                            result['sceneFonts']['__default'] = result['sceneFonts'][font.get('name')]
            for settings_name in ['settings/menusettings.xml', 'settings/skinsettings.xml'] + [name for name in by_name if name.startswith('xml/') and name.endswith('.xml')][:128]:
                if settings_name not in by_name:
                    continue
                try:
                    payload, recovered = settings_payload(_read(f, by_name[settings_name], 1024 * 1024))
                    if recovered:
                        warnings.append(settings_name + ': ignored trailing bytes after complete XML root.')
                    if b'<!DOCTYPE' in payload.upper() or b'<!ENTITY' in payload.upper():
                        raise ValueError('Unsupported settings declarations')
                    import re
                    payload = re.sub(br'<\?xml[^>]*\?>', b'', payload)
                    settings_tree = parse_xml(b'<package-settings>' + payload + b'</package-settings>')
                    result['sceneSettings'][settings_name] = [{'tag': n.tag, 'attributes': dict(n.attrib),
                        'text': (n.text or '').strip(), 'values': {child.tag: (child.text or '').strip() for child in n}}
                        for n in settings_tree.iter() if n is not settings_tree]
                except (ValueError, ThemeXmlError) as exc:
                    warnings.append(settings_name + ': ' + str(exc))
            result['scenes'] = []
            result['sceneAssets'] = {}
            result['sceneEffects'] = {}
            result['sceneAudio'] = {}
            result['audioNeedsDecoder'] = []
            audio_budget = 0
            audio_count = 0
            for sound in entries:
                if not sound['path'].lower().endswith(('.xma','.wav','.ogg','.mp3')):continue
                audio_count+=1
                if audio_count>32 or sound['size']>MAX_ENTRY or audio_budget+sound['size']>32*1024*1024:
                    warnings.append(sound['path']+': audio budget exceeded');continue
                audio_budget+=sound['size']
                try:
                    payload=_read(f,sound)
                    if sound['path'].lower().endswith('.xma'):
                        from x360_audio import decode
                        url=decode(payload,sound['path'])
                        if url is None:result['audioNeedsDecoder'].append(sound['path']);continue
                    else:url=_url({'.wav':'audio/wav','.ogg':'audio/ogg','.mp3':'audio/mpeg'}[PurePosixPath(sound['path']).suffix.lower()],payload)
                    result['sceneAudio'][sound['path'].lower()]=url
                except (ValueError,OSError) as error:warnings.append(sound['path']+': '+str(error))
            result['runtimeFeatures'] = {'scripts': [], 'plugins': [], 'shaders': []}
            for resource in entries:
                name = resource['path']
                if name.lower().endswith('.lua'):
                    result['runtimeFeatures']['scripts'].append(name)
                elif name.lower().endswith(('.xex', '.dll')):
                    result['runtimeFeatures']['plugins'].append(name)
                elif name.lower().endswith('.fx'):
                    result['runtimeFeatures']['shaders'].append({'path': name, 'status': 'unsupported'})
            result['coverResources'] = {'textures': {}, 'diagnostics': []}
            from x360_geometry import read_xbg7, read_xpr2
            from x360_directx import read_x_mesh
            for entry in entries:
                if entry['path'].lower().endswith('/fullcover.x') and entry['size'] <= 16 * 1024 * 1024:
                    try:
                        result['coverResources']['mesh'] = read_x_mesh(_read(f, entry, 16 * 1024 * 1024))
                        result['coverResources']['meshPath'] = entry['path']
                    except (ValueError, struct.error, UnicodeError) as exc:
                        result['coverResources']['diagnostics'].append(entry['path'] + ': ' + str(exc))
                elif entry['path'].lower().endswith('.xbg') and entry['size'] <= 16 * 1024 * 1024:
                    try:
                        result['coverResources']['mesh'] = read_xbg7(_read(f, entry, 16 * 1024 * 1024))
                        result['coverResources']['meshPath'] = entry['path']
                    except (ValueError, struct.error, UnicodeError) as exc:
                        result['coverResources']['diagnostics'].append(entry['path'] + ': ' + str(exc))
                elif entry['path'].lower().endswith('.xpr') and 'coverflow' in entry['path'].lower():
                    try:
                        textures, failures = read_xpr2(_read(f, entry, 64 * 1024 * 1024))
                        result['coverResources']['textures'].update({name: _url('image/png', texture['png']) for name, texture in textures.items()})
                        result['coverResources']['diagnostics'].extend(failures)
                    except (ValueError, struct.error, UnicodeError) as exc:
                        result['coverResources']['diagnostics'].append(entry['path'] + ': ' + str(exc))

            from x360_effects import wallpaper_effect
            shader = by_name.get('shaders/wallpapershader.fx')
            if shader and shader['size'] <= 128 * 1024:
                effect = wallpaper_effect(_read(f, shader, 128 * 1024))
                if effect:
                    result['sceneEffects']['wallpaper'] = effect
                else:
                    result['warnings'].append('The custom wallpaper shader is not recognized; its static wallpaper is retained.')
            result['sceneFailures'] = []
            result['sceneRoots'] = {}
            from x360_scene import decode_xur
            scene_nodes = 0

            from x360_xur import inspect_xur
            from x360_coverflow import read_layout
            for entry in entries:
                if entry['path'].lower().endswith('.xur') and len(result['scenes']) < 256:
                    try:
                        scene = inspect_xur(_read(f, entry, 8 * 1024 * 1024))
                        result['scenes'].append({'path': entry['path'], **scene})
                        try:
                            decoded = decode_xur(_read(f, entry, 8 * 1024 * 1024))
                            scene_nodes += decoded['objects']
                            if scene_nodes > 40000:
                                raise ValueError('Total scene object budget exceeded')
                            result['sceneRoots'][entry['path']] = decoded['root']
                        except (ValueError, UnicodeError, struct.error) as exc:
                            result['sceneFailures'].append({'path': entry['path'], 'reason': str(exc)})

                    except (ValueError, UnicodeError, struct.error) as exc:
                        result['warnings'].append(entry['path'] + ': ' + str(exc))
                elif entry['path'].lower().endswith('.cfljson'):
                    try:
                        result['coverflow'] = read_layout(_read(f, entry, 512 * 1024))
                    except (ValueError, UnicodeError) as exc:
                        result['warnings'].append(entry['path'] + ': ' + str(exc))
            # FSD stores its case cameras and transforms in XML rather than Aurora CFL JSON.
            if 'coverflow' not in result and 'xml/clayout.xml' in by_name:
                try:
                    layout_tree = parse_xml(settings_payload(_read(f, by_name['xml/clayout.xml'], 512 * 1024))[0])
                    modes = []
                    def vector(node, tag, fallback):
                        item = next((c for c in node if c.tag == tag), None)
                        if item is None: return fallback
                        values = [float(item.get(axis, fallback[i])) for i, axis in enumerate(('x','y','z'))]
                        import math
                        if not all(math.isfinite(v) and abs(v)<=500 for v in values): raise ValueError('Invalid FSD layout vector')
                        return values
                    for node in layout_tree.findall('.//layout')[:64]:
                        camera=vector(node,'camerapos',[0,.5,5]); aim=vector(node,'cameraaim',[0,0,-2])
                        camera[2]*=-1; aim[2]*=-1
                        modes.append({'name':'FSD layout '+str(len(modes)+1),'covers':{
                            'position':{side:vector(node,side+'pos',[0,0,0]) for side in ('left','right','center')},
                            'angle':{side:vector(node,side+'angle',[0,0,0]) for side in ('left','right','center')},
                            'spacer':{side:vector(node,side+'space',[-1 if side=='left' else 1,0,0]) for side in ('left','right')}},
                            'camera':{'position':camera,'aim':aim},'mirror':{'enabled':True,'offset':[0,0,0]}})
                    if modes: result['coverflow']={'info':{'name':'FSD imported case layouts'},'properties':{'rows':1,'columns':13,'pagesize':5},'modes':modes}
                except (ValueError, ThemeXmlError) as exc:
                    warnings.append('XML/CLayout.xml: '+str(exc))
            # Resolve actual scene resource references; unknown formats stay explicit diagnostics.
            references = {e['path'].lower() for e in entries if '/quickview/' in e['path'].lower() and '/aurora.skin.qv.white.' in e['path'].lower()} | {e['path'].lower() for e in entries if 'meshtextures/' in e['path'].lower() and e['path'].lower().endswith(('.png','.dds','.jpg'))} | set(result['sceneFonts'].values()) | {name.replace('\\', '/').lower() for scene in result['scenes'] for name in scene['references']}
            for rows in result['sceneSettings'].values():
                for row in rows:
                    for key, value in row['values'].items():
                        if value and (key.endswith('path') or value.lower().endswith(('.png','.jpg','.jpeg','.dds','.ttf','.wav'))):
                            references.add(value.replace('\\', '/').lower())
            asset_budget = 0
            missing_assets = []
            decoded_resources = {}
            result['sceneResourceAliases'] = {}
            for name in sorted(references):
                if not name.endswith(('.png', '.jpg', '.jpeg', '.dds', '.ttf', '.wav')):
                    continue
                entry = resolve_resource(name, by_name)
                if not entry:
                    missing_assets.append(name)
                    continue
                actual = entry['path'].lower()
                if actual != name:
                    result['sceneResourceAliases'][name] = actual
                if actual in decoded_resources:
                    result['sceneAssets'][name] = decoded_resources[actual]
                    continue
                if entry['size'] > MAX_ENTRY or asset_budget + entry['size'] > 128 * 1024 * 1024:
                    missing_assets.append(name)
                    continue
                try:
                    data = _read(f, entry)
                    asset_budget += len(data)
                    if name.endswith('.ttf') and len(data) <= 4 * 1024 * 1024:
                        from x360_fonts import browser_font
                        result['sceneAssets'][name] = _url('font/ttf', browser_font(data))
                    elif name.endswith('.wav') and data[:4] == b'RIFF':
                        result['sceneAssets'][name] = _url('audio/wav', data)
                    else:
                        if data[:4] == b'DDS ' and len(data) >= 20:
                            h, w = struct.unpack_from('<II', data, 12)
                            if not 0 < w <= 4096 or not 0 < h <= 4096 or w * h > 8388608:
                                missing_assets.append(name)
                                continue
                        picture = _as_picture(data)
                        if picture:
                            result['sceneAssets'][name] = _url(picture[0], picture[1])
                        else:
                            missing_assets.append(name)
                    if name in result['sceneAssets']:
                        decoded_resources[actual] = result['sceneAssets'][name]
                except (ValueError, OSError, struct.error) as exc:
                    missing_assets.append(name)
                    result['warnings'].append(name + ': ' + str(exc))
            for name, url in result['sceneAssets'].items():
                if 'meshtextures/' in name:
                    key = PurePosixPath(name).stem
                    result['coverResources']['textures'][key] = url
                    canonical = {'greencase':'GreenCase','blankgreencase':'BlankGreenCase','fullcase':'FullCase','orangecase':'OrangeCase','purplecase':'PurpleCase','silvercase':'SilverCase','casetexture':'CaseTexture'}.get(key.lower())
                    if canonical: result['coverResources']['textures'][canonical] = url
                    if 'xbox360' in key.lower() or key.lower() == 'casetexture':
                        result['coverResources']['textures']['XboxCase'] = url
            # Missing quick-view placeholders can use the skin's own generic missing icon.
            # This is a declared fallback, not an alias to the original artwork.
            result['sceneResourceFallbacks'] = {}
            for name in list(missing_assets):
                if name.endswith('/aurora.skin.qv.white.missingicon.dds'):
                    candidates = [(key, url) for key, url in result['sceneAssets'].items()
                                  if PurePosixPath(key).name in ('aurora.skin.missing.icon.small.dds', 'aurora.skin.missing.icon.small.png')]
                    if candidates:
                        key, url = sorted(candidates)[0]
                        result['sceneAssets'][name] = url
                        result['sceneResourceFallbacks'][name] = key
                        missing_assets.remove(name)
            result['missingSceneAssets'] = missing_assets
            result['entryScene'] = next((name for name in result['sceneRoots'] if name.lower() in ('main.xur', 'aurora_main.xur')), None)
            if result['entryScene']:
                result['compatibility']['mode'] = 'scene-subset'
                result['compatibility']['layout'] = True
                result['compatibility']['animation'] = True
            # Import only explicit wallpaper resources, never UI panels or preview screenshots as backgrounds.
            candidates = [e for e in entries if e['path'].lower().endswith(('.png', '.jpg', '.jpeg', '.dds'))
                          and ('wallpaper' in e['path'].lower() or e['path'].lower() in ('preview.png', 'preview.dds', 'preview.jpg', 'background.png', 'background.jpg', 'background.dds') or PurePosixPath(e['path']).name.lower() in ('aurora.background.jpg', 'aurora.background.png', 'aurora.background.dds'))]
            candidates.sort(key=lambda e: (0 if PurePosixPath(e['path']).name.lower().startswith('preview.') else 1, e['path'].lower()))
            budget = 0
            for e in candidates[:64]:
                if e['size'] > MAX_ENTRY or budget + e['size'] > 64 * 1024 * 1024:
                    continue
                budget += e['size']
                try:
                    data = _read(f, e)
                    # Bound DDS decoding before allocating pixel buffers.
                    if data[:4] == b'DDS ' and len(data) >= 20:
                        h, w = struct.unpack_from('<II', data, 12)
                        if not 0 < w <= 4096 or not 0 < h <= 4096 or w * h > 8388608:
                            continue
                    pic = _as_picture(data)
                    if not pic:
                        continue
                    mime, raw, w, h = pic
                    if not 0 < w <= 8192 or not 0 < h <= 8192:
                        continue
                    result['pictures'].append({'path': e['path'], 'w': w, 'h': h})
                    url = _url(mime, raw)
                    if PurePosixPath(e['path']).name.lower().startswith('preview.'):
                        result['preview'] = url
                    elif 'preview' not in e['path'].lower() and w >= 640 and h >= 360 and 1.2 <= w / h <= 2.4:
                        if len(result['backgrounds']) < 6:
                            result['backgrounds'].append(url)
                except Exception as exc:
                    result['errors'].append(e['path'] + ': ' + str(exc))
            if result['backgrounds']:
                result['background'] = result['backgrounds'][0]
            for feature in result['runtimeFeatures']['shaders']:
                if feature['path'].lower() == 'shaders/wallpapershader.fx' and result['sceneEffects'].get('wallpaper'):
                    feature['status'] = 'supported-periodic-effect'
                elif feature['path'].lower().endswith('coverflowshader.fx'):
                    feature['status'] = 'material-approximation'
            from x360_effects import runtime_warnings
            warnings.extend(runtime_warnings(result['runtimeFeatures']))
            if not result['background']:
                warnings.append('No standalone wallpaper found; scene backgrounds may require their original runtime.' if result['entryScene'] else 'No standalone wallpaper found; the built-in dashboard background remains active.')
            if (result.get('background') or '').startswith('data:'):
                import base64, hashlib
                result['backgroundDigest'] = hashlib.sha256(base64.b64decode(result['background'].split(',', 1)[1])).hexdigest()
            return result
    except (OSError, ValueError, struct.error, UnicodeError):
        return None


def peek(path):
    try:
        with open(path, 'rb') as f:
            entries = index(f)
        return any(e['path'].lower() == 'skin.xml' for e in entries)
    except (OSError, ValueError, struct.error, UnicodeError):
        return False
