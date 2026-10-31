"""Turn completed WiiFlow downloads into checked, installed ThemeHub themes."""
import json
import os
from pathlib import Path
import tempfile
import threading
import zipfile
import time
import hashlib
import wiiflow_convert as converter

_lock=threading.Lock()
MAX_FILES=3000

def _signature(path):
    st=path.stat()
    return [st.st_size,st.st_mtime_ns]

def _theme_config(config):
    return config.has_section('MAIN/BG') or config.has_section('GENERAL') and any(section.startswith(('MAIN/','_COVERFLOW')) for section in config.sections())

def candidates(roots):
    """Only completed archives and extracted theme trees; never browser .part files."""
    found=[];visited=0
    for root in roots:
        root=Path(root)
        if not root.is_dir():continue
        for current,dirs,files in os.walk(root):
            visited+=1
            if visited>500:break
            depth=len(Path(current).relative_to(root).parts)
            dirs[:]=[d for d in dirs if not d.startswith('.') and depth<4 and not (Path(current)/d).is_symlink()]
            # Treat an extracted download as one unit, including assets beside its INIs.
            inis=[Path(current)/n for n in files if n.lower().endswith('.ini')]
            useful=False
            for ini in inis:
                try:
                    config=converter.read_ini(ini)
                    if _theme_config(config): useful=True;break
                except (OSError,ValueError):pass
            if useful:
                path=Path(current);tree=[];size=0
                for item in path.rglob('*'):
                    if item.is_symlink():continue
                    if item.is_file():tree.append(item);size+=item.stat().st_size
                    if len(tree)>MAX_FILES or size>converter.MAX_BYTES:break
                if len(tree)<=MAX_FILES and size<=converter.MAX_BYTES:
                    digest=hashlib.sha256()
                    for p in sorted(tree):digest.update(str(p.relative_to(path)).encode());digest.update(str(_signature(p)).encode())
                    found.append((path,[digest.hexdigest()]))
                dirs[:]=[]
                continue
            for name in files:
                path=Path(current)/name
                if path.is_symlink() or path.suffix.lower() not in ('.zip','.rar','.7z'):continue
                if any((Path(str(path)+suffix)).exists() for suffix in ('.part','.crdownload','.download')):continue
                found.append((path,_signature(path)))
    return found

def install(path):
    """Convert every theme in a pack, then use the existing validated installation path."""
    import data_themes
    path=Path(path)
    with tempfile.TemporaryDirectory(prefix='wiiflow-runtime-') as temp:
        temp=Path(temp);source=converter.unpack(path,temp/'source')
        themes=[]
        for ini in sorted(source.rglob('*')):
            if ini.suffix.lower()!='.ini' or ini.is_symlink():continue
            config=converter.read_ini(ini)
            if _theme_config(config):themes.append(ini.relative_to(source).as_posix())
        if not themes:return []
        import frame_media
        prepared=frame_media.ensure('wiiflow-default')
        if not prepared.get('success'):raise ValueError(prepared.get('error','Could not prepare WiiFlow renderer assets'))
        if len(themes)>64:raise ValueError('This pack contains more than 64 themes. Import a smaller extracted folder.')
        installed=[]
        for i,selected in enumerate(themes):
            target=temp/f'converted-{i}.zip'
            report=converter.convert(path,target,selected=selected)
            # The source renderer's shared icons/background live in the verified media pack.
            with zipfile.ZipFile(target,'a',zipfile.ZIP_DEFLATED) as output:
                existing=set(output.namelist())
                for relative in frame_media.catalog()['wiiflow-default']['files']:
                    if relative in existing:continue
                    media=frame_media.resolve('wiiflow-default',relative)
                    if media:output.write(media,relative)
            named=temp/(report['provenance']['identity']+'.zip');target.rename(named)
            result=data_themes.import_file(str(named))
            if not result.get('ok'):raise ValueError(result.get('error','Converted theme could not be installed'))
            installed.append({'id':result['id'],'name':result['name']})
        return installed

def scan(roots,state_path):
    if not _lock.acquire(blocking=False):return {'busy':True,'imported':[],'pending':0,'errors':[]}
    try:
        state_path=Path(state_path)
        try:state=json.loads(state_path.read_text(encoding='utf-8'))
        except (OSError,ValueError):state={}
        imported=[];errors=[];pending=0;now=time.time()
        for path,signature in candidates(roots):
            key=str(path.resolve());old=state.get(key,{})
            if old.get('signature')!=signature:
                state[key]={'signature':signature,'seen':now};pending+=1;continue
            if path.is_file() and path.stat().st_size>converter.MAX_BYTES:
                errors.append(f'{path.name}: archive exceeds 256 MiB. Download the theme-only pack, or extract just its theme folder into Downloads.')
                continue
            if old.get('done'):continue
            if old.get('retryAt',0)>now:
                if old.get('error'):errors.append(f'{path.name}: {old["error"]}')
                continue
            # Two scans plus a quiet period prevent converting half-written downloads.
            if now-old.get('seen',now)<2:pending+=1;continue
            if path.is_file() and path.suffix.lower()=='.zip':
                try:
                    with zipfile.ZipFile(path) as archive:archive.infolist()
                except (OSError,zipfile.BadZipFile):
                    if now-old.get('seen',now)<120:pending+=1
                    else:errors.append(f'{path.name}: this ZIP is incomplete or damaged. Finish or retry its download.')
                    continue
            try:
                added=install(path);imported.extend(added);old['done']=True
            except Exception as error:
                errors.append(f'{path.name}: {str(error)[:180]}')
                old['retryAt']=now+30;old['error']=str(error)[:180]
        state_path.parent.mkdir(parents=True,exist_ok=True)
        temporary=state_path.with_suffix('.tmp');temporary.write_text(json.dumps(state),encoding='utf-8');os.replace(temporary,state_path)
        return {'busy':False,'imported':imported,'pending':pending,'errors':errors}
    finally:_lock.release()
