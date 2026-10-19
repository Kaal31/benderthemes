"""Convert a WiiFlow theme folder/ZIP into a standalone ThemeHub frame theme."""
import hashlib
import argparse
import configparser
import json
import re
import shutil
import tempfile
import zipfile
from pathlib import Path, PurePosixPath

ROOT = Path(__file__).resolve().parents[1]
MAX_BYTES = 256 * 1024 * 1024


def unpack(source, destination):
    if source.is_dir():
        return source
    if not zipfile.is_zipfile(source):
        raise ValueError('Use a theme folder or ZIP. Extract RAR/7z archives into a folder first.')
    with zipfile.ZipFile(source) as archive:
        entries = archive.infolist()
        if len(entries) > 3000 or sum(e.file_size for e in entries) > MAX_BYTES:
            raise ValueError('Archive exceeds the 3000-file / 256 MiB limit.')
        for entry in entries:
            name = entry.filename.replace('\\', '/')
            path = PurePosixPath(name)
            if path.is_absolute() or '..' in path.parts or ':' in name or (entry.external_attr >> 16) & 0o170000 == 0o120000:
                raise ValueError('Unsafe archive path: ' + name)
        for entry in entries:
            target = destination.joinpath(*PurePosixPath(entry.filename.replace('\\', '/')).parts)
            if entry.is_dir():
                target.mkdir(parents=True, exist_ok=True)
            else:
                target.parent.mkdir(parents=True, exist_ok=True)
                with archive.open(entry) as src, target.open('wb') as dst:
                    shutil.copyfileobj(src, dst)
    return destination


def read_ini(path):
    config = configparser.ConfigParser(strict=False, interpolation=None, allow_no_value=True)
    config.read_string(path.read_bytes().decode('utf-8-sig', errors='replace').replace('\x00', ''))
    return config


def source_fingerprint(source):
    digest=hashlib.sha256()
    if source.is_file():
        with source.open('rb') as stream:
            for chunk in iter(lambda:stream.read(1024*1024),b''):digest.update(chunk)
    else:
        for path in sorted(source.rglob('*')):
            if not path.is_file() or path.is_symlink():continue
            relative=path.relative_to(source).as_posix().encode()
            digest.update(len(relative).to_bytes(4,'big'));digest.update(relative)
            digest.update(path.stat().st_size.to_bytes(8,'big'))
            with path.open('rb') as stream:
                for chunk in iter(lambda:stream.read(1024*1024),b''):digest.update(chunk)
    return digest.hexdigest()


def convert(source, output, selected=None, ident=None, *, source_kind='community', archive_name=None, coverflow=None, nearby_shadows=False):
    output = output.resolve()
    if output.exists():
        raise ValueError('Output already exists; choose another output ZIP.')
    if source_kind not in ('community','repository'):raise ValueError('Unknown source kind.')
    if source_kind=='repository' and not ident:raise ValueError('Repository imports require their existing explicit --id.')
    filename=archive_name or source.name
    if Path(filename).name!=filename or '/' in filename or '\\' in filename:raise ValueError('Archive name must be a filename, not a path.')
    fingerprint=source_fingerprint(source)
    with tempfile.TemporaryDirectory(prefix='wiiflow-import-') as temp:
        temp = Path(temp)
        root = unpack(source.resolve(), temp / 'source')
        candidates = []
        for path in sorted(root.rglob('*.ini')):
            if path.is_symlink():
                continue
            config = read_ini(path)
            if config.has_section('MAIN/BG') or config.has_section('GENERAL'):
                candidates.append((path, config))
        if selected:
            candidates = [(p, c) for p, c in candidates if p.stem.casefold() == selected.casefold() or p.relative_to(root).as_posix().casefold()==selected.replace('\\','/').casefold()]
        if len(candidates) != 1:
            raise ValueError('Specify --theme from: ' + ', '.join(p.relative_to(root).as_posix() for p, _ in candidates))
        ini, config = candidates[0]
        slug=re.sub('[^a-z0-9]+','-',Path(filename).stem.lower()).strip('-') or 'community'
        theme_slug=re.sub('[^a-z0-9]+','-',ini.stem.lower()).strip('-') or 'theme'
        entry_hash=hashlib.sha256(ini.relative_to(root).as_posix().casefold().encode()).hexdigest()[:6]
        ident = ident or ('wiiflow-'+slug[:20]+'-'+theme_slug[:12]+'-'+fingerprint[:10]+'-'+entry_hash)
        provenance={'kind':source_kind,'archiveName':filename,'sha256':fingerprint,'fingerprintType':'archive-bytes' if source.is_file() else 'extracted-tree','themeIni':ini.relative_to(root).as_posix(),'identity':ident}
        if not re.fullmatch('[a-z0-9][a-z0-9-]{0,63}', ident):
            raise ValueError('Invalid theme ID.')
        theme = temp / 'theme'
        shutil.copytree(ROOT / 'themes/wiiflow-default', theme)
        assets = theme / 'imported'
        assets.mkdir()
        warnings, mapped, css = [], {}, []
        folders = [p for p in ini.parent.iterdir() if p.is_dir() and p.name.casefold() == ini.stem.casefold()]
        asset_root = folders[0] if folders else ini.parent
        files = {p.relative_to(asset_root).as_posix().casefold(): p for p in asset_root.rglob('*') if p.is_file() and not p.is_symlink()}

        def asset(value, label, extensions):
            value = value.strip().replace('\\', '/')
            if not value:
                return None
            path = PurePosixPath(value)
            if path.is_absolute() or '..' in path.parts or ':' in value:
                warnings.append(label + ': rejected unsafe path')
                return None
            original = files.get(value.casefold())
            if not original or original.suffix.lower() not in extensions:
                warnings.append(label + ': missing or unsupported asset ' + value)
                return None
            if not original.resolve().is_relative_to(root.resolve()):
                warnings.append(label + ': asset escapes source folder')
                return None
            dest = assets / (str(len(mapped)) + original.suffix.lower())
            shutil.copyfile(original, dest)
            relative = dest.relative_to(theme).as_posix()
            mapped[label] = {'source': value, 'target': relative}
            return relative

        def get(section, key, default=''):
            actual=next((sec for sec in config.sections() if sec.strip().casefold()==section.casefold()),section)
            return config.get(actual, key, fallback=default) or default

        audio = {}
        def sound_value(section, key):
            match = next((s for s in config.sections() if s.strip().casefold() == section.casefold()), section)
            return get(match, key)
        for event, section, key, fallback in [('move','GENERAL','hover_sound','survol.wav'),('select','GENERAL','click_sound','click.wav'),('flip','_COVERFLOW','sound_flip','flip.wav'),('back','_COVERFLOW','sound_cancel',''),('options','MAIN/CONFIG_BTN','click_sound',''),('layout','MAIN/FAVORITES_OFF','click_sound','')]:
            value = sound_value(section, key) or (fallback if fallback in files else '')
            if value:
                target = asset(value, 'audio/'+event, {'.wav','.ogg','.mp3'})
                if target: audio[event] = target
        bg = asset(get('MAIN/BG', 'texture'), 'background', {'.png', '.jpg', '.jpeg', '.webp'})
        if bg:
            css.append(f"#scene{{background:url('{bg}') center/100% 100%}}")
        font = asset(get('GENERAL', 'label_font') or get('GENERAL', 'text_font'), 'font', {'.ttf', '.otf', '.woff', '.woff2'})
        if font:
            css.append(f"@font-face{{font-family:ImportedWiiFlow;src:url('{font}')}}body{{font-family:ImportedWiiFlow,Arial,sans-serif}}")
        css.append('footer #options,footer #home,footer #layout{display:none;background-image:none}')
        button_sections=[('MAIN/CONFIG_BTN','#options'),('MAIN/DVD_BTN' if get('MAIN/DVD_BTN','texture_normal') else 'MAIN/QUIT_BTN','#home'),('MAIN/FAVORITES_OFF','#layout'),('MAIN/INFO_BTN','#imported-info')]
        for section, selector in button_sections:
            for key, suffix in [('texture_normal', ''), ('texture_selected', ':hover')]:
                image = asset(get(section, key), section + '/' + key, {'.png', '.jpg', '.webp'})
                if image:
                    css.append(f"footer {selector}{suffix}{{display:block;position:absolute;margin:0;padding:0;background-size:contain;background-position:center;background-repeat:no-repeat;background-image:url('{image}')}}")
                    if not suffix:
                        css.append(f"footer {selector}:hover,footer {selector}:focus-visible{{background-image:url('{image}')}}")
                    else:
                        css.append(f"footer {selector}:focus-visible{{background-image:url('{image}')}}")
            dimensions = {}
            for key in ['x', 'y', 'width', 'height']:
                try:
                    dimensions[key] = max(-640, min(1280, float(get(section, key))))
                except ValueError:
                    pass
            if len(dimensions) == 4:
                x, y, w, h = [dimensions[k] for k in ['x', 'y', 'width', 'height']]
                css.append(f"footer {selector}{{left:{x-18:g}px;top:{y-400:g}px;width:{max(1,w):g}px;height:{max(1,h):g}px}}")
        css.append('header{opacity:0;pointer-events:auto}body.controls header,header:hover,header:focus-within{opacity:1;pointer-events:auto}')
        css.append('footer{inset:400px 18px auto;height:80px;opacity:1;pointer-events:auto}#animation-speed{display:none}')
        (theme / 'style.css').write_text((theme / 'style.css').read_text(encoding='utf-8') + '\n' + '\n'.join(css), encoding='utf-8')
        layout, modes = {}, []
        if coverflow:
            relative=PurePosixPath(str(coverflow).replace('\\','/'))
            if relative.is_absolute() or '..' in relative.parts or ':' in str(relative):raise ValueError('Unsafe coverflow path.')
            chosen=root.joinpath(*relative.parts)
            if not chosen.is_file() or chosen.is_symlink() or not chosen.resolve().is_relative_to(root.resolve()):raise ValueError('Coverflow file not found inside source.')
            flow_files=[chosen,ini] if chosen!=ini else [ini]
        else:
            # Never borrow a same-named file from a different theme or edition in a pack.
            local=[p for p in (ini.parent/'coverflows').glob('*') if p.is_file() and p.suffix.lower()=='.ini' and p.stem.casefold()==ini.stem.casefold()]
            if len(local)>1:raise ValueError('Ambiguous companion layout. Specify --coverflow with its exact archive-relative path.')
            embedded=any(re.fullmatch(r'_COVERFLOW_\d+',sec) for sec in config.sections())
            distant=[p for p in root.rglob('*') if p.is_file() and p.suffix.lower()=='.ini' and p.stem.casefold()==ini.stem.casefold() and p!=ini and p not in local]
            if not local and not embedded and distant:raise ValueError('Same-named layouts exist outside this theme folder. Specify --coverflow explicitly.')
            flow_files=local+[ini]

        vector_keys = ['left_pos','right_pos','center_pos','row_center_pos','left_spacer','right_spacer','top_spacer','bottom_spacer','left_angle','right_angle','center_angle','row_center_angle','top_angle','bottom_angle','left_delta_angle','right_delta_angle','top_delta_angle','bottom_delta_angle','left_scale','right_scale','left_delta_scale','right_delta_scale','center_scale','row_center_scale','top_delta_scale','bottom_delta_scale','camera_pos','camera_aim','camera_osc_amp','camera_osc_speed','cover_osc_amp','cover_osc_speed','cover_pos_osc_amp','cover_pos_osc_speed','flip_pos','flip_angle','flip_scale','text_center_pos']
        def parse_flow(flow, section):
            result = {}
            for key in vector_keys:
                for suffix in ['', '_4_3']:
                    raw = flow.get(section,key+suffix,fallback='')
                    try:
                        vector = [float(n.strip()) for n in raw.split(',')]
                        if len(vector)==3 and all(abs(n)<=1000 for n in vector):result[key+suffix]=vector
                    except ValueError:pass
            for key in ['rows','columns','rows_4_3','columns_4_3','mirror_alpha','text_center_wrap_width','text_center_wrap_width_4_3','text_center_angle','text_center_angle_4_3']:
                try:result[key]=float(flow.get(section,key))
                except (ValueError,configparser.Error):pass
            for key in ['color_beg','color_end','color_off','color_shadow_beg','color_shadow_end']:
                raw=flow.get(section,key,fallback='')
                if re.fullmatch(r'#[0-9a-fA-F]{8}',raw):result[key]=raw
            return result
        for flow_path in flow_files:
            flow=read_ini(flow_path)
            sections=sorted([sec for sec in flow.sections() if re.fullmatch(r'_COVERFLOW_\d+',sec)],key=lambda sec:int(sec.rsplit('_',1)[1]))
            for section in sections:
                mode=parse_flow(flow,section)
                selected_mode=parse_flow(flow,section+'_S') if flow.has_section(section+'_S') else {}
                modes.append({'name':section.replace('_COVERFLOW_','Layout '),'browse':mode,'selected':selected_mode})
            if modes:
                provenance['coverflowIni']=flow_path.relative_to(root).as_posix()
                break
        ui = {'widgets':{},'backgrounds':{},'overlays':[],'infoButton':bool(get('MAIN/INFO_BTN','texture_normal'))}
        for section in config.sections():
            if not re.fullmatch(r'MAIN/USER\d+',section):continue
            image=asset(get(section,'background_texture'),section+'/background_texture',{'.png','.jpg','.jpeg','.webp'})
            if not image:continue
            try: box={key:float(get(section,key)) for key in ['x','y','width','height']}
            except ValueError:continue
            ui['overlays'].append({'image':image,**box})
        for section,selector in [('MAIN/PREV_BTN','#previous'),('MAIN/NEXT_BTN','#next')]:
            image=asset(get(section,'texture_normal'),section+'/texture_normal',{'.png','.jpg','.jpeg','.webp'})
            if image:
                try: x,y,w,h=[float(get(section,key)) for key in ['x','y','width','height']]
                except ValueError:continue
                with (theme/'style.css').open('a',encoding='utf-8') as style:style.write(f"\n{selector}.arrow{{left:{x:g}px;top:{y:g}px;right:auto;bottom:auto;width:{w:g}px;height:{h:g}px;opacity:1!important;transform:none;font-size:0;background:url('{image}') center/contain no-repeat;z-index:25}}")
                hover=asset(get(section,'texture_selected'),section+'/texture_selected',{'.png','.jpg','.jpeg','.webp'})
                if hover:
                    with (theme/'style.css').open('a',encoding='utf-8') as style:style.write(f"\n{selector}.arrow:hover,{selector}.arrow:focus-visible{{background-image:url('{hover}')}}")
        for section, selector in [('MAIN/CONFIG_BTN','#options'),('MAIN/DVD_BTN' if get('MAIN/DVD_BTN','texture_normal') else 'MAIN/QUIT_BTN','#home'),('MAIN/FAVORITES_OFF','#layout'),('MAIN/INFO_BTN','#imported-info')]:
            effects={}
            for key in ['effect_x','effect_y','effect_scale_x','effect_scale_y']:
                try: effects[key]=max(-1280,min(1280,float(get(section,key))))
                except ValueError:pass
            if effects:ui['widgets'][selector]=effects
        for state, section in [('browse','MAIN/BG'),('selected','GAME/BG')]:
            image=asset(get(section,'texture'),'ui/'+state,{'.png','.jpg','.jpeg','.webp'})
            if image:ui['backgrounds'][state]=image
        source_menu = None
        wiiflow_root = ini.parent.parent if ini.parent.name.casefold() == 'themes_lite' else None
        if wiiflow_root:
            source_root = wiiflow_root / 'source_menu' / ini.stem
            if source_root.is_dir():
                source_files = {p.relative_to(source_root).as_posix().casefold(): p for p in source_root.rglob('*') if p.is_file() and not p.is_symlink()}
                background_root=wiiflow_root/'backgrounds'/ini.stem
                if background_root.is_dir():
                    source_files.update({'platform/'+p.name.casefold():p for p in background_root.iterdir() if p.is_file() and not p.is_symlink()})
                platform_path=wiiflow_root/'plugins_data'/'platform.ini'
                platform_config=read_ini(platform_path) if platform_path.is_file() else None
                def source_asset(value):
                    key = str(value or '').replace('\\','/').casefold()
                    original = source_files.get('small_covers/'+key) or source_files.get(key) or source_files.get('backgrounds/'+key)
                    if not original or original.suffix.lower() not in {'.png','.jpg','.jpeg','.webp'} or not original.resolve().is_relative_to(wiiflow_root.resolve()):return None
                    label='sourceMenu/'+original.relative_to(wiiflow_root).as_posix()
                    if label in mapped:return mapped[label]['target']
                    dest=assets/(str(len(mapped))+original.suffix.lower());shutil.copyfile(original,dest)
                    target=dest.relative_to(theme).as_posix();mapped[label]={'source':key,'target':target};return target
                pages={}
                for page_path in sorted(source_root.glob('*.ini')):
                    page_config=read_ini(page_path);buttons=[]
                    for sec in sorted([sec for sec in page_config.sections() if re.fullmatch('BUTTON_[0-9]+',sec)],key=lambda sec:int(sec.split('_')[1])):
                        item=dict(page_config[sec])
                        if item.get('hidden','no').lower() in ('yes','true','1'):continue
                        background=item.get('background','')
                        if not background and platform_config and platform_config.has_section('PLUGINS'):
                            platform=platform_config.get('PLUGINS',item.get('magic',''),fallback='')
                            if platform:background='platform/'+platform+'.png'
                        buttons.append({'title':item.get('title',sec),'image':source_asset(item.get('image')),'selectedImage':source_asset(item.get('image_s')),'source':item.get('source',''),'target':item.get('magic','').lower(),'background':source_asset(background)})
                    general=dict(page_config['GENERAL']) if page_config.has_section('GENERAL') else {}
                    try:flow_number=int(general.get('flow','1'))
                    except ValueError:flow_number=1
                    flow_section='_SMALLFLOW_'+str(flow_number)
                    pages[page_path.name.lower()]={'buttons':buttons,'background':source_asset(general.get('background')),'layout':parse_flow(flow,flow_section) if flow.has_section(flow_section) else {},'flow':flow_number}
                if pages:source_menu={'pages':pages,'start':'source_menu.ini'}
        layout=modes[0]['browse'] if modes else {}
        if not modes:warnings.append('No coverflow mode data found; placement uses the compatibility layout, not an original theme layout.')
        warnings += ['Browser reproduction of configured coverflow modes; Wii GX shader effects and widget animation remain unsupported.', 'Platform source menus are mapped when bundled. Wii-specific actions are not converted. Configured supported sound effects are imported; background music is not mapped.']
        unsupported_motion = []
        for section in config.sections():
            if section.startswith('_COVERFLOW'):continue
            for key, raw in config[section].items():
                if section in ('MAIN/CONFIG_BTN','MAIN/DVD_BTN','MAIN/FAVORITES_OFF') and key in ('effect_x','effect_y','effect_scale_x','effect_scale_y'):continue
                if key.startswith('effect_') and raw not in ('0','1','0.0','1.0',None):unsupported_motion.append(section+'/'+key)
        audit={'status':'partial','preserved':['camera position/aim','per-axis camera and cover oscillation','selected poses and flips','row/column placement','angle deltas and scales','bundled platform menu hierarchy/artwork and smallflow poses','mapped main widget exit transforms','selected-screen background textures'],'unsupported':['Unmapped Wii menu widgets and Wii-only actions','Wii GX blur/shader effects','exact engine interpolation timing'],'unmappedWidgetEffects':unsupported_motion,'requiresVisualVerification':True}
        (theme/'animation-audit.json').write_text(json.dumps(audit,indent=2),encoding='utf-8')
        report={'sourceTheme':ini.stem,'provenance':provenance,'assets':mapped,'coverflow':layout,'modes':modes,'warnings':warnings,'animationAudit':audit}
        (theme/'import-report.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
        interface_profile=None
        for overlay in ui.get('overlays',[]):
            asset=theme/overlay['image']
            if asset.exists() and hashlib.sha256(asset.read_bytes()).hexdigest()=='6072c801e6140d6fe29b75841c86b4580fae915cf1110391695b02bf89ce3cb0':interface_profile='wiigb-shell-v1'
        interface_background=None
        bg=mapped.get('background',{}).get('target')
        if bg and hashlib.sha256((theme/bg).read_bytes()).hexdigest()=='edaebd157645a953b02a0ab566d07302d77f76b2b579c5b2d3380db7d0fed33a':
            interface_profile='windows7-frame-v1';interface_background=bg
        (theme/'theme-config.js').write_text('window.WiiFlowImport='+json.dumps({'interfaceProfile':interface_profile,'interfaceBackground':interface_background,'layout':layout,'modes':modes,'audio':audio,'sourceMenu':source_menu,'ui':ui,'shadowDistance':{'fullUntil':1,'fadeUntil':3} if nearby_shadows else None})+';',encoding='utf-8')
        html = (theme / 'index.html').read_text(encoding='utf-8').replace('<script src="renderer.js">', '<script src="theme-config.js"></script><script src="importedAudio.js"></script><script src="sourceMenu.js"></script><script src="importedUI.js"></script><script src="renderer.js">')
        (theme / 'index.html').write_text(html, encoding='utf-8')
        manifest = json.loads((theme / 'theme.json').read_text(encoding='utf-8'))
        manifest.update(id=ident, name=((ini.stem+' - '+Path(filename).stem) if source_kind=='community' else ini.stem+' (WiiFlow import)')[:64], author='Original WiiFlow theme authors', description='Imported WiiFlow assets and main coverflow layout; see import-report.json for compatibility details.')
        (theme / 'theme.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
        (theme / 'README.md').write_text('# ' + ini.stem + '\n\nConverted from a user-supplied WiiFlow theme. Original assets retain their original authorship and licensing. Import this ZIP in ThemeHub. See import-report.json for mapped files and limitations.\n', encoding='utf-8')
        output.parent.mkdir(parents=True, exist_ok=True)
        with zipfile.ZipFile(output, 'w', zipfile.ZIP_DEFLATED) as archive:
            for path in sorted(theme.rglob('*')):
                if path.is_file():
                    archive.write(path, path.relative_to(theme).as_posix())
        return report


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('source', type=Path)
    parser.add_argument('--output', type=Path, required=True)
    parser.add_argument('--theme', help='INI name, required if a pack contains multiple themes')
    parser.add_argument('--id')
    parser.add_argument('--source-kind',choices=['community','repository'],default='community')
    parser.add_argument('--archive-name',help='Original downloaded filename for an extracted community archive')
    parser.add_argument('--coverflow',help='Exact archive-relative companion INI path')
    parser.add_argument('--nearby-shadows',action='store_true',help='Fade cover shadows out after the nearest side covers')
    args = parser.parse_args()
    try:
        report = convert(args.source, args.output, args.theme, args.id, source_kind=args.source_kind, archive_name=args.archive_name, coverflow=args.coverflow, nearby_shadows=args.nearby_shadows)
        print(json.dumps({'output': str(args.output.resolve()), **report}, indent=2))
    except (ValueError, OSError, configparser.Error, zipfile.BadZipFile) as error:
        parser.exit(1, str(error) + '\n')
