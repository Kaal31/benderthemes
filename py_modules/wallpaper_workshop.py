"""Isolated, bounded Workshop acquisition. No Steam password/session database access."""
from __future__ import annotations
import hashlib, json, os, platform, re, shutil, subprocess, tempfile, threading, time, zipfile
from pathlib import Path
from urllib.request import Request,urlopen

URL='https://github.com/SteamRE/DepotDownloader/releases/download/DepotDownloader_3.4.0/DepotDownloader-linux-x64.zip'
SHA256='a999dec66b4850fc961bd50366696d23c2d0fad7b18790e6a5647b2f19097a53'
RUNTIME_BYTES=33442357
_lock=threading.RLock()
_jobs={}
_process=None
_worker_running=False
_cancel=threading.Event()


def status():
    with _lock:return dict(_jobs)

def cancel():
    _cancel.set()
    with _lock:
        process=_process
    if process and process.poll() is None:
        try:process.terminate()
        except OSError:pass
    return {'ok':True}

def _update(**patch):
    with _lock:_jobs.update(patch)

def runtime(data):
    if platform.system()!='Linux' or platform.machine().lower() not in ('x86_64','amd64'):
        raise ValueError('Workshop downloads run on SteamOS/Linux x64. Import a local project.json on this computer.')
    root=Path(data)/'tools/wallpaper-depotdownloader-3.4.0';exe=root/'DepotDownloader'
    if exe.is_file():return exe
    root.parent.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='.wallpaper-runtime-',dir=root.parent) as staging:
        stage=Path(staging);archive=stage/'runtime.zip';h=hashlib.sha256();total=0
        req=Request(URL,headers={'User-Agent':'ThemeHub'})
        with urlopen(req,timeout=30) as response,archive.open('wb') as out:
            while chunk:=response.read(1024*1024):
                if _cancel.is_set():raise ValueError('Cancelled')
                total+=len(chunk)
                if total>RUNTIME_BYTES:raise ValueError('Downloader exceeds pinned size')
                h.update(chunk);out.write(chunk)
                _update(percent=total/RUNTIME_BYTES*10,message='Preparing Workshop downloader…')
        if total!=RUNTIME_BYTES or h.hexdigest()!=SHA256:raise ValueError('Workshop downloader integrity verification failed')
        unpack=stage/'unpacked';unpack.mkdir()
        with zipfile.ZipFile(archive) as z:
            total=0
            for info in z.infolist():
                target=(unpack/info.filename).resolve()
                total+=info.file_size
                if not target.is_relative_to(unpack.resolve()) or total>150*1024*1024 or (info.external_attr>>16)&0o170000==0o120000:raise ValueError('Invalid downloader archive')
                if info.is_dir():target.mkdir(parents=True,exist_ok=True);continue
                target.parent.mkdir(parents=True,exist_ok=True)
                with z.open(info) as src,target.open('wb') as dst:shutil.copyfileobj(src,dst)
        if not (unpack/'DepotDownloader').is_file():raise ValueError('Downloader executable missing')
        (unpack/'DepotDownloader').chmod(0o700)
        os.replace(unpack,root)
    return exe

def command(executable,item,staging,username='',qr=False):
    if not re.fullmatch(r'[0-9]{5,20}',str(item)):raise ValueError('Invalid Workshop ID')
    if username and not re.fullmatch(r'[A-Za-z0-9_@. -]{1,64}',username):raise ValueError('Invalid Steam account name')
    args=[str(executable),'-app','431960','-pubfile',str(item),'-dir',str(staging),'-validate','-max-downloads','4','-loginid','1738245182']
    if qr:args+=['-qr','-remember-password']
    elif username:args+=['-username',username,'-remember-password']
    return args

def start(data,item,username='',qr=False):
    global _worker_running
    with _lock:
        if _worker_running or _jobs.get('busy') or (_process is not None and _process.poll() is None):return {'ok':False,'error':'A Workshop download is already running'}
        # Validate before creating a worker.
        command('DepotDownloader',item,'staging',username,qr)
        _worker_running=True
        _jobs.clear();_jobs.update(busy=True,id=str(item),percent=0,message='Preparing download…',phase='preparing')
        _cancel.clear()
    threading.Thread(target=_run,args=(str(data),str(item),username,bool(qr)),daemon=True).start()
    return {'ok':True}

def _run(data,item,username,qr):
    global _process, _worker_running
    stage=None
    try:
        executable=runtime(data)
        if _cancel.is_set():raise ValueError('Cancelled')
        root=Path(data)/'animated-wallpapers';root.mkdir(parents=True,exist_ok=True)
        stage=Path(tempfile.mkdtemp(prefix='.workshop-',dir=root))
        session=Path(data)/'tools/wallpaper-session';session.mkdir(parents=True,exist_ok=True)
        try:session.chmod(0o700)
        except OSError:pass
        env={k:v for k,v in os.environ.items() if k not in ('LD_LIBRARY_PATH','LD_PRELOAD','PYTHONHOME','PYTHONPATH')}
        env['DOTNET_BUNDLE_EXTRACT_BASE_DIR']=str(session/'runtime')
        args=command(executable,item,stage,username,qr)
        process=subprocess.Popen(args,cwd=session,env=env,stdin=subprocess.DEVNULL,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,bufsize=0)
        with _lock:_process=process
        _update(phase='downloading',message='Connecting to Steam…',percent=10)
        # Bounded output collection; raw Steam output is never returned or logged.
        buffer=bytearray();start_time=time.monotonic();last_scan=0
        def read_output():
            while True:
                chunk=process.stdout.read(1024)
                if not chunk:break
                buffer.extend(chunk)
                if len(buffer)>16384:del buffer[:-8192]
        reader=threading.Thread(target=read_output,daemon=True);reader.start()
        while process.poll() is None:
            if _cancel.wait(.25):raise ValueError('Cancelled')
            if time.monotonic()-start_time>1800:raise ValueError('Workshop download timed out')
            if time.monotonic()-last_scan>1:
                last_scan=time.monotonic()
                size=0;count=0
                for file in stage.rglob('*'):
                    if file.is_file():size+=file.stat().st_size;count+=1
                    if size>600*1024*1024 or count>2000:raise ValueError('Workshop project exceeds import limits')
            text=bytes(buffer).decode('utf-8','ignore')
            percentage=re.findall(r'(\d{1,3}(?:\.\d+)?)%',text)
            patch={'message':'Downloading Workshop video…'}
            if percentage:patch['percent']=min(94,10+float(percentage[-1])*.84)
            # Only the QR login URL is exposed. Never publish tokens, passwords or console output.
            cleaned=re.sub(r'\x1b\[[0-9;]*[a-zA-Z]','',text)
            qr_lines=re.findall(r'^[ ▄▀█]{8,256}$',cleaned,re.M)
            if len(qr_lines)>=8:patch.update(qrAscii='\n'.join(qr_lines[-80:]),phase='authentication',message='Scan this QR code with the Steam mobile app.')
            qr_urls=re.findall(r'https://s\.team/q/[^\s\x1b<>]+',text)
            if qr_urls:patch.update(qrUrl=qr_urls[-1],message='Scan the Steam sign-in QR link with your Steam mobile app.',phase='authentication')
            _update(**patch)
        reader.join(timeout=1)
        if _cancel.is_set():raise ValueError('Cancelled')
        if process.returncode:
            raise ValueError('Steam could not download this item. Retry with your own Steam QR session, or import an installed Workshop project.')
        _update(phase='validating',message='Checking video project…',percent=95,qrUrl=None,qrAscii=None)
        projects=list(stage.rglob('project.json'))[:20]
        if len(projects)!=1:raise ValueError('Download does not contain one supported Wallpaper Engine project')
        import animated_wallpapers
        result=animated_wallpapers.import_source(data,projects[0],source='wallpaper-engine')
        result.update(providerId=item,sourcePage='https://steamcommunity.com/sharedfiles/filedetails/?id='+item)
        folder=animated_wallpapers.root(data)/result['id'];tmp=folder/'item.tmp';tmp.write_text(json.dumps(result,ensure_ascii=False),encoding='utf-8');os.replace(tmp,folder/'item.json')
        _update(busy=False,phase='installed',percent=100,message='Wallpaper imported',item=result,qrUrl=None,qrAscii=None)
    except Exception as e:
        _update(busy=False,phase='cancelled' if _cancel.is_set() else 'failed',error=str(e)[:250],message='Cancelled' if _cancel.is_set() else 'Download failed',qrUrl=None,qrAscii=None)
    finally:
        with _lock:process=_process
        if process and process.poll() is None:
            try:process.terminate();process.wait(timeout=5)
            except (OSError,subprocess.TimeoutExpired):
                try:process.kill();process.wait(timeout=5)
                except (OSError,subprocess.TimeoutExpired):pass
        with _lock:_process=None
        if stage:shutil.rmtree(stage,ignore_errors=True)
        with _lock:_worker_running=False


def start_wallspace(data,ident):
    global _worker_running
    with _lock:
        if _worker_running or _jobs.get('busy') or (_process is not None and _process.poll() is None):return {'ok':False,'error':'A wallpaper download is already running'}
        if not re.fullmatch(r'[0-9]{5,20}',str(ident)):raise ValueError('Invalid Wallspace item')
        _worker_running=True
        _jobs.clear();_jobs.update(busy=True,id=str(ident),percent=0,message='Connecting to Wallspace…',phase='preparing')
        _cancel.clear()
    threading.Thread(target=_run_wallspace,args=(str(data),str(ident)),daemon=True).start()
    return {'ok':True}

def _run_wallspace(data,ident):
    global _worker_running
    stage=None
    try:
        import animated_wallpapers as aw
        item=aw.wallspace_media(ident)
        staging_root=aw.root(data);stage=Path(tempfile.mkdtemp(prefix='.wallspace-',dir=staging_root))
        target=stage/'wallpaper.mp4'
        # The public media host rejects HEAD but serves normal browser-style GETs.
        req=Request(item['url'],headers={'User-Agent':'Mozilla/5.0 ThemeHub','Referer':'https://wallspace.app/'})
        _update(phase='downloading',message='Downloading Wallspace video…')
        with urlopen(req,timeout=30) as response,target.open('wb') as out:
            if response.geturl().split('/')[2]!='s4.wallspace.app':raise ValueError('Unexpected Wallspace media redirect')
            length=int(response.headers.get('Content-Length',0));copied=0
            if length>aw.MAX_MEDIA:raise ValueError('Wallpaper exceeds 512 MB')
            while chunk:=response.read(256*1024):
                if _cancel.is_set():raise ValueError('Cancelled')
                copied+=len(chunk)
                if copied>aw.MAX_MEDIA:raise ValueError('Wallpaper exceeds 512 MB')
                out.write(chunk);_update(percent=min(94,copied/length*94) if length else 0)
            if length and copied!=length:raise ValueError('Wallpaper download was interrupted')
        if _cancel.is_set():raise ValueError('Cancelled')
        _update(phase='validating',message='Checking downloaded video…',percent=95)
        result=aw.import_source(data,target,source='wallspace');result.update(name=item['name'],providerId=ident,sourcePage='https://wallspace.app/wallpaper?key='+ident)
        folder=aw.root(data)/result['id'];tmp=folder/'item.tmp';tmp.write_text(json.dumps(result,ensure_ascii=False),encoding='utf-8');os.replace(tmp,folder/'item.json')
        _update(busy=False,phase='installed',percent=100,message='Wallpaper imported',item=result,error=None)
    except Exception as e:
        _update(busy=False,phase='cancelled' if _cancel.is_set() else 'failed',error=str(e)[:250],message='Cancelled' if _cancel.is_set() else 'Download failed')
    finally:
        if stage:shutil.rmtree(stage,ignore_errors=True)
        with _lock:_worker_running=False
