"""Bounded XMA-to-browser conversion; never downloads a decoder implicitly."""
import base64,hashlib,os,shutil,subprocess,tempfile
from pathlib import Path

_ffmpeg=None
_vgm=None
_cache=None

def configure(ffmpeg=None,vgm=None,cache=None):
 global _ffmpeg,_vgm,_cache
 _ffmpeg=ffmpeg;_vgm=vgm;_cache=cache

def decoder_key():
 return '|'.join(str(p or '') for p in (_ffmpeg or os.environ.get('DHT_AUDIO_FFMPEG') or shutil.which('ffmpeg'),_vgm))

def decode(data,name):
 if not data or len(data)>24*1024*1024:raise ValueError('Audio input exceeds limit')
 if not data.startswith((b'RIFF',b'RIFX')):raise ValueError('Unsupported XMA container')
 ff=_ffmpeg or os.environ.get('DHT_AUDIO_FFMPEG') or shutil.which('ffmpeg');vgm=_vgm
 if not ff and not vgm:return None
 digest=hashlib.sha256(b'xma-browser-v1'+data).hexdigest();root=Path(_cache or Path(tempfile.gettempdir())/'dht-xma-cache');root.mkdir(parents=True,exist_ok=True)
 ext='.ogg' if ff else '.wav';target=root/(digest+ext)
 if not target.exists():
  with tempfile.TemporaryDirectory(prefix='decode-',dir=root) as tmp:
   source=Path(tmp)/'source.xma';source.write_bytes(data);output=Path(tmp)/('decoded'+ext)
   commands=[]
   if ff:commands.append([ff,'-v','error','-nostdin','-y','-i',str(source),'-t','900','-ac','2','-ar','44100','-c:a','libvorbis','-q:a','4',str(output)])
   for command in commands:
    try:
     result=subprocess.run(command,capture_output=True,timeout=90,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
     if result.returncode==0 and output.exists() and output.stat().st_size>256:break
    except (OSError,subprocess.TimeoutExpired):pass
   else:
    if not vgm:raise ValueError('XMA decoder could not decode '+name)
    wav=Path(tmp)/'decoded.wav'
    try:r=subprocess.run([vgm,'-i','-o',str(wav),str(source)],capture_output=True,timeout=90,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
    except (OSError,subprocess.TimeoutExpired) as error:raise ValueError('XMA decoder failed') from error
    if r.returncode or not wav.exists() or wav.stat().st_size<256:raise ValueError('XMA decoder rejected '+name)
    if ff:
     r=subprocess.run([ff,'-v','error','-nostdin','-y','-i',str(wav),'-t','900','-ac','2','-ar','44100','-c:a','libvorbis','-q:a','4',str(output)],capture_output=True,timeout=90,creationflags=getattr(subprocess,'CREATE_NO_WINDOW',0))
     if r.returncode:raise ValueError('Audio encoding failed')
    else:output=wav
   if output.stat().st_size>160*1024*1024:raise ValueError('Decoded audio exceeds limit')
   os.replace(output,target)
 raw=target.read_bytes();mime='audio/ogg' if ext=='.ogg' else 'audio/wav'
 return 'data:'+mime+';base64,'+base64.b64encode(raw).decode('ascii')
