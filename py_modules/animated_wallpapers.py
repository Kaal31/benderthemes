"""Persistent animated wallpaper library and explicit local Rainmeter conversion."""
from __future__ import annotations
import hashlib, json, os, re, shutil, struct, tempfile, threading
from pathlib import Path
from urllib.parse import urlencode, urlparse
from urllib.request import Request, urlopen

MAX_MEDIA = 512 * 1024 * 1024
EXTENSIONS = {'.mp4': 'MP4', '.m4v': 'M4V', '.webm': 'WebM', '.gif': 'GIF'}
ID = re.compile(r'^[a-f0-9]{24}$')
_lock = threading.RLock()

def read_json(path):
    p=Path(path)
    if p.stat().st_size>2*1024*1024: raise ValueError('Manifest is too large')
    return json.loads(p.read_text(encoding='utf-8-sig'))

def mp4_has_video(path):
    size=Path(path).stat().st_size;offset=0;moov=False;mdat=False;video=False;atoms=0
    with Path(path).open('rb') as f:
        while offset+8<=size:
            atoms+=1
            if atoms>4096:raise ValueError('Video container has too many atoms')
            f.seek(offset);raw=f.read(8);length,kind=struct.unpack('>I4s',raw);header=8
            if length==1:
                raw=f.read(8)
                if len(raw)!=8:raise ValueError('Truncated video atom')
                length=struct.unpack('>Q',raw)[0];header=16
            elif length==0:length=size-offset
            if length<header or offset+length>size:raise ValueError('Truncated video container')
            if kind==b'mdat':mdat=True
            if kind==b'moov':
                moov=True
                if length>16*1024*1024:raise ValueError('Video metadata exceeds limit')
                meta=f.read(length-header)
                video=bool(re.search(rb'hdlr.{8}vide',meta,re.S))
            offset+=length
    return moov and mdat and video

def media_info(path):
    p=Path(path)
    if p.is_symlink() or not p.is_file(): raise ValueError('Choose a regular media file')
    size=p.stat().st_size
    if not 0<size<=MAX_MEDIA: raise ValueError('Media must be between 1 byte and 512 MB')
    ext=p.suffix.lower()
    if ext not in EXTENSIONS: raise ValueError('Choose an MP4, M4V, WebM or animated GIF')
    with p.open('rb') as f: head=f.read(4096)
    valid=(ext in ('.mp4','.m4v') and head[4:8]==b'ftyp') or (ext=='.webm' and head[:4]==b'\x1aE\xdf\xa3' and b'webm' in head.lower())
    if ext=='.gif':
        valid=head[:6] in (b'GIF87a',b'GIF89a')
        if valid:
            # Walk GIF blocks, rather than mistaking bytes inside image data for frames.
            with p.open('rb') as f:
                header=f.read(13)
                if len(header)<13: raise ValueError('Truncated GIF')
                if header[10]&128: f.seek(3*(2**((header[10]&7)+1)),1)
                frames=0
                while frames<2:
                    tag=f.read(1)
                    if tag==b';' or not tag: break
                    if tag==b'!': f.read(1)
                    elif tag==b',':
                        desc=f.read(9)
                        if len(desc)!=9: break
                        if desc[8]&128: f.seek(3*(2**((desc[8]&7)+1)),1)
                        f.read(1);frames+=1
                    else: break
                    while True:
                        n=f.read(1)
                        if not n or n==b'\0': break
                        if len(f.read(n[0]))!=n[0]: raise ValueError('Truncated GIF data')
                if frames<2: raise ValueError('This GIF is static; choose an animated GIF')
    if valid and ext in ('.mp4','.m4v'):valid=mp4_has_video(p)
    if valid and ext=='.webm':
        with p.open('rb') as f:valid=bool(re.search(rb'V_(?:VP8|VP9|AV1|MPEG4)',f.read(256*1024)))
    if not valid: raise ValueError('The file contents do not match its media format')
    return {'format':EXTENSIONS[ext],'kind':'gif' if ext=='.gif' else 'video','size':size}

def project_media(path):
    p=Path(path);project=p/'project.json' if p.is_dir() else p
    data=read_json(project)
    if str(data.get('type','')).lower()!='video': raise ValueError('Only Wallpaper Engine video projects are supported; scene/web previews are not wallpapers')
    name=data.get('file')
    if not isinstance(name,str) or not name or '\\' in name or Path(name).is_absolute(): raise ValueError('Invalid project media path')
    target=(project.parent/name).resolve()
    if not target.is_relative_to(project.parent.resolve()) or any(part=='..' for part in Path(name).parts): raise ValueError('Project media escapes its folder')
    return target,str(data.get('title') or project.parent.name)[:160]

def inspect_source(path):
    p=Path(path).expanduser()
    if p.is_dir() and (p/'project.json').is_file() or p.name.lower()=='project.json':
        media,title=project_media(p);return {'type':'media','name':title,'source':'wallpaper-engine',**media_info(media)}
    if p.suffix.lower() in EXTENSIONS:return {'type':'media','name':p.stem,'source':'local',**media_info(p)}
    from rainmeter.compiler import make_scene
    scene,report,_=make_scene(p)
    if not scene['configs']:raise ValueError('No supported Rainmeter configs were found')
    return {'type':'rainmeter','source':'rainmeter','name':p.stem,'format':'Rainmeter','report':report,'configs':[{'id':c['source'],'meters':len(c['meters'])} for c in scene['configs']]}

def root(data):
    p=Path(data)/'animated-wallpapers'
    if p.is_symlink():raise ValueError('Wallpaper library cannot be a symlink')
    p.mkdir(parents=True,exist_ok=True);return p

def list_items(data):
    items=[]
    for folder in root(data).iterdir():
        if folder.is_symlink() or not folder.is_dir() or not ID.fullmatch(folder.name): continue
        try:
            m=read_json(folder/'item.json')
            if m.get('id')!=folder.name:continue
            if m.get('file'):
                file=Path(data)/'wallpapers'/m['file']
                if file.is_symlink() or file.name!=m['file'] or not file.is_file():continue
                m['_mediaPath']=str(file)
            elif m.get('themeId'):
                if not (Path(data)/'themes'/m['themeId']/'theme.json').is_file():continue
            poster=folder/'poster.png'
            if poster.is_file():m['_posterPath']=str(poster)
            items.append(m)
        except (OSError,ValueError,TypeError):continue
    return sorted(items,key=lambda m:m['name'].casefold())

def import_source(data,path,configs=None,bindings=None,source='local'):
    p=Path(path).expanduser();inspection=inspect_source(p)
    with _lock:
        if inspection['type']=='rainmeter':
            from rainmeter.compiler import export
            available=[c['id'] for c in inspection['configs']]
            # Skin variants are explicit choices. Never activate every INI automatically.
            chosen=available[:1] if configs is None else configs
            stage=Path(tempfile.mkdtemp(prefix='.rm-',dir=root(data)))
            try:
                generated=stage/'theme';report=export(p,generated,bindings or {},chosen)
                manifest=read_json(generated/'theme.json');ident=hashlib.sha256(manifest['id'].encode()).hexdigest()[:24]
                dest=Path(data)/'themes'/manifest['id'];dest.parent.mkdir(parents=True,exist_ok=True)
                if not dest.exists():os.replace(generated,dest)
                item={'id':ident,'name':inspection['name'],'source':'rainmeter','kind':'rainmeter','format':'Rainmeter','themeId':manifest['id'],'report':report,'size':sum(f.stat().st_size for f in dest.rglob('*') if f.is_file())}
            finally:shutil.rmtree(stage,ignore_errors=True)
        else:
            media,title=project_media(p) if inspection['source']=='wallpaper-engine' else (p,p.stem)
            provider=inspection['source'] if inspection['source']=='wallpaper-engine' else source
            if provider not in ('local','wallspace','wallpaper-engine'):provider='local'
            info=media_info(media);h=hashlib.sha256((provider+':').encode())
            walls=Path(data)/'wallpapers';walls.mkdir(parents=True,exist_ok=True)
            fd,tmp=tempfile.mkstemp(prefix='.animated-',dir=walls)
            try:
                with os.fdopen(fd,'wb') as dst,media.open('rb') as src:
                    copied=0
                    while chunk:=src.read(1024*1024):
                        copied+=len(chunk)
                        if copied>MAX_MEDIA:raise ValueError('Media exceeds 512 MB')
                        h.update(chunk);dst.write(chunk)
                ident=h.hexdigest()[:24];filename='animated-'+ident+media.suffix.lower()
                os.replace(tmp,walls/filename)
            finally:
                if os.path.exists(tmp):os.unlink(tmp)
            provider=inspection['source'] if inspection['source']=='wallpaper-engine' else source
            if provider not in ('local','wallspace','wallpaper-engine'):provider='local'
            item={'id':ident,'name':title[:160],'source':provider,'file':filename,**info}
        folder=root(data)/ident;folder.mkdir(exist_ok=True)
        temporary=folder/'item.tmp';temporary.write_text(json.dumps(item,ensure_ascii=False),encoding='utf-8');os.replace(temporary,folder/'item.json')
        return item

def remove(data,ident):
    if not isinstance(ident,str) or not ID.fullmatch(ident):raise ValueError('Invalid wallpaper ID')
    with _lock:
        item=next((m for m in list_items(data) if m['id']==ident),None)
        if not item:raise ValueError('Wallpaper is no longer installed')
        if item.get('file'):
            expected='animated-'+ident
            if not Path(item['file']).stem==expected:raise ValueError('Invalid owned media path')
            (Path(data)/'wallpapers'/item['file']).unlink(missing_ok=True)
        if item.get('themeId'):
            theme=item['themeId']
            if not re.fullmatch(r'rm-[a-f0-9]{12}',theme):raise ValueError('Invalid Rainmeter theme ID')
            shutil.rmtree(Path(data)/'themes'/theme,ignore_errors=True)
        shutil.rmtree(root(data)/ident)
    return {'ok':True,'file':item.get('file'),'themeId':item.get('themeId')}

def fetch_text(url):
    req=Request(url,headers={'User-Agent':'ThemeHub/1.0 (+https://github.com/Kaal31/benderthemes)'})
    with urlopen(req,timeout=20) as response:
        raw=response.read(4*1024*1024+1)
        if len(raw)>4*1024*1024:raise ValueError('Provider response is too large')
        return raw.decode('utf-8')

def wallspace_website_page(query='',page=1):
    # Public website embeds a normalized catalog; no private app endpoint assumptions.
    page=max(1,min(100,int(page)))
    url='https://wallspace.app/wallpapers/?'+urlencode({'page':page,'search':query[:120]})
    html=fetch_text(url)
    match=re.search(r'<script[^>]*id="wallpapers-initial-data"[^>]*>(.*?)</script>',html,re.S)
    paging=re.search(r'<script[^>]*id="wallpapers-pagination"[^>]*>(.*?)</script>',html,re.S)
    if not match:raise ValueError('Wallspace catalog format changed')
    raw=json.loads(match[1]);pagination=json.loads(paging[1]) if paging else {}
    items=[]
    for m in raw[:100]:
        slug=m.get('slug','')
        if not re.fullmatch(r'[a-z0-9-]{1,160}',slug):continue
        # Read actual public structured-data thumbnail URLs, not invented media URLs.
        data=re.search(r'"url":"https://wallspace.app/wallpaper/'+re.escape(slug)+r'"[^}]*?"image":"([^"]+)"',html)
        items.append({'id':'wallspace:'+slug,'providerId':slug,'name':str(m.get('title',slug))[:160],'source':'wallspace','kind':'video','format':'Video','author':str(m.get('creator',''))[:100],'poster':data[1] if data else '', 'sourcePage':'https://wallspace.app/wallpaper/'+slug,'installed':False,'downloadable':False,'note':'Import a video downloaded from Wallspace. The public website exposes previews, not original downloads.'})
    return {'items':items,'hasMore':bool(pagination.get('has_more'))}

def wallspace_api(endpoint,params=None,body=None):
    config=read_json(Path(__file__).with_name('wallspace-public-client.json'))
    if endpoint not in ('get-wallpapers','get-wallpapers-by-id','search-wallpapers'):raise ValueError('Unknown Wallspace operation')
    url=config['api']+'/'+endpoint+('?' + urlencode(params) if params else '')
    key=config['publicAnonKey']
    req=Request(url,data=json.dumps(body).encode() if body is not None else None,headers={'Content-Type':'application/json','Authorization':'Bearer '+key,'apikey':key,'User-Agent':'ThemeHub'})
    with urlopen(req,timeout=20) as response:
        raw=response.read(4*1024*1024+1)
        if len(raw)>4*1024*1024:raise ValueError('Wallspace response exceeds limit')
        return json.loads(raw)

def wallspace_page(query='',page=1):
    page=max(1,min(100,int(page)))
    data=wallspace_api('search-wallpapers',body={'query':query[:120],'page':page,'limit':24}) if query else wallspace_api('get-wallpapers',{'page':page,'limit':24,'mode':'download'})
    raw=data if isinstance(data,list) else data.get('wallpapers',[])
    items=[]
    for m in raw[:100]:
        key=str(m.get('key',''));slug=str(m.get('slug',''))
        if not re.fullmatch(r'[0-9]{5,20}',key):continue
        if not re.fullmatch(r'[a-z0-9-]{1,160}',slug):slug=key
        items.append({'id':'wallspace:'+key,'providerId':key,'name':str(m.get('title','Wallspace wallpaper'))[:160],'source':'wallspace','kind':'video','format':'MP4','author':str(m.get('creator',''))[:100], 'poster':'https://s4.wallspace.app/wallpaper/'+key+'/thumbnail.webp','sourcePage':'https://wallspace.app/wallpaper/'+slug,'size':m.get('file_size',0),'downloadable':not m.get('is_pro',False),'note':'Available from Wallspace' if not m.get('is_pro') else 'Marked Pro by Wallspace. Open the source page or import your downloaded file.'})
    paging=data.get('pagination',{}) if isinstance(data,dict) else {}
    return {'items':items,'hasMore':bool(paging.get('has_more',len(raw)==24))}

def wallspace_media(ident):
    if not re.fullmatch(r'[0-9]{5,20}',str(ident)):raise ValueError('Invalid Wallspace item')
    data=wallspace_api('get-wallpapers-by-id',{'keys':str(ident)})
    item=next((m for m in data.get('wallpapers',[]) if str(m.get('key'))==str(ident)),None)
    if not item:raise ValueError('This wallpaper is unavailable')
    if item.get('is_pro'):raise ValueError('This item is marked Pro by Wallspace. Import your downloaded file instead.')
    # Verified macOS client URL convention and ranged MP4 response, not a preview GIF.
    return {'url':'https://s4.wallspace.app/wallpaper/'+str(ident)+'/master.mp4','name':str(item.get('title','Wallspace wallpaper'))[:160]}

def wallspace_preview(ident):
    if re.fullmatch(r'[0-9]{5,20}',str(ident)):
        return {'url':'https://s4.wallspace.app/wallpaper/'+str(ident)+'/previewhd.mp4'}
    if not re.fullmatch(r'[a-z0-9-]{1,160}',str(ident)):raise ValueError('Invalid Wallspace item')
    html=fetch_text('https://wallspace.app/wallpaper/'+ident)
    urls=re.findall(r'https://s4\.wallspace\.app/wallpaper/[a-zA-Z0-9/_-]+\.(?:mp4|webm)',html)
    return {'url':urls[0] if urls else None}


def workshop_page(query='',page=1):
    from html import unescape
    html=fetch_text('https://steamcommunity.com/workshop/browse/?'+urlencode({'appid':'431960','searchtext':query[:120],'browsesort':'trend','section':'readytouseitems','requiredtags[]':'Video','p':max(1,min(100,int(page)))}))
    ids=list(dict.fromkeys(re.findall(r'(?:data-publishedfileid="|[?&]id=)([0-9]{5,20})',html)))[:24]
    if not ids:return {'items':[],'hasMore':False}
    payload=urlencode({'itemcount':len(ids),**{f'publishedfileids[{i}]':v for i,v in enumerate(ids)}}).encode()
    req=Request('https://api.steampowered.com/ISteamRemoteStorage/GetPublishedFileDetails/v1/',data=payload)
    with urlopen(req,timeout=20) as response:data=json.loads(response.read(2*1024*1024))
    items=[]
    for m in data.get('response',{}).get('publishedfiledetails',[]):
        tags={str(t.get('tag','')).casefold() for t in m.get('tags',[])}
        if m.get('result')!=1 or str(m.get('consumer_app_id'))!='431960' or 'video' not in tags:continue
        ident=str(m.get('publishedfileid',''))
        if not re.fullmatch(r'[0-9]{5,20}',ident):continue
        items.append({'id':'workshop:'+ident,'providerId':ident,'name':str(m.get('title','Workshop wallpaper'))[:160],'source':'wallpaper-engine','kind':'video','format':'Video','poster':m.get('preview_url',''),'sourcePage':'https://steamcommunity.com/sharedfiles/filedetails/?id='+ident,'downloadable':True,'note':'Video candidate; the downloaded project.json determines compatibility.'})
    return {'items':items,'hasMore':len(ids)>=20}

def browse(data,query='',page=1,source='all'):
    items=[];errors=[];cursors={}
    providers=[('wallspace',wallspace_page),('wallpaper-engine',workshop_page)]
    current=page if isinstance(page,dict) else {name:int(page) for name,_ in providers}
    pages=[]
    from concurrent.futures import ThreadPoolExecutor
    with ThreadPoolExecutor(max_workers=2) as pool:
        jobs=[(name,pool.submit(fn,query,current.get(name,1))) for name,fn in providers if source in ('all',name) and current.get(name,1) is not None]
        for name,job in jobs:
            try:
                r=job.result();pages.append(r['items']);cursors[name]=int(current.get(name,1))+1 if r.get('hasMore') else None
            except Exception:
                cursors[name]=current.get(name,1)
                errors.append({'source':name,'message':'This source is unavailable right now. Your installed wallpapers still work.'})
    for i in range(max([len(p) for p in pages] or [0])):
        for p in pages:
            if i<len(p):items.append(p[i])
    return {'items':items,'errors':errors,'hasMore':any(v is not None for v in cursors.values()),'cursors':cursors}


def discover_workshop(home=None):
    home=Path(home or Path.home());libraries=[home/'.local/share/Steam/steamapps',home/'.steam/steam/steamapps']
    for base in list(libraries):
        try:
            text=(base/'libraryfolders.vdf').read_text(encoding='utf-8')[:1024*1024]
            libraries += [Path(p.replace('\\\\','\\'))/'steamapps' for p in re.findall(r'"path"\s+"([^"\n]+)"',text)]
        except OSError:pass
    result=[]
    for base in dict.fromkeys(p.resolve() for p in libraries):
        folder=base/'workshop/content/431960'
        if not folder.is_dir():continue
        for p in sorted(folder.glob('*/project.json'))[:500]:
            try:
                media,name=project_media(p);info=media_info(media)
                result.append({'id':'local-workshop:'+p.parent.name,'name':name,'source':'wallpaper-engine','path':str(p),**info})
            except (OSError,ValueError):continue
    return result


def save_poster(data,ident,data_url):
    import base64,struct
    if not ID.fullmatch(str(ident)) or not (root(data)/ident/'item.json').is_file():raise ValueError('Unknown installed wallpaper')
    if not isinstance(data_url,str) or len(data_url)>2*1024*1024 or not data_url.startswith('data:image/png;base64,'):raise ValueError('Invalid thumbnail')
    raw=base64.b64decode(data_url.split(',',1)[1],validate=True)
    if len(raw)<24 or not raw.startswith(b'\x89PNG\r\n\x1a\n'):raise ValueError('Invalid PNG thumbnail')
    w,h=struct.unpack('>II',raw[16:24])
    if not 1<=w<=640 or not 1<=h<=400:raise ValueError('Thumbnail dimensions exceed limit')
    folder=root(data)/ident
    with _lock:
        temporary=folder/'poster.tmp';temporary.write_bytes(raw);os.replace(temporary,folder/'poster.png')
    return {'ok':True}
