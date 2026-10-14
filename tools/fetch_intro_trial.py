import sys
from pathlib import Path
sys.path.insert(0,str(Path('../work/intro-video-tools').resolve()))
from yt_dlp import YoutubeDL
import imageio_ffmpeg
out=Path('../work/console-intro-sources');out.mkdir(parents=True,exist_ok=True)
with YoutubeDL({'js_runtimes':{'node':{'path':r'C:/Program Files/nodejs/node.exe'}},'ffmpeg_location':imageio_ffmpeg.get_ffmpeg_exe(),'format':'bestvideo[ext=mp4][vcodec^=avc1][height<=720]+bestaudio[ext=m4a]','merge_output_format':'mp4','outtmpl':str(out/'%(id)s.%(ext)s'),'noplaylist':True,'socket_timeout':20,'retries':1,'quiet':True,'no_warnings':False}) as y:
 info=y.extract_info('https://www.youtube.com/watch?v=92coix3E_vY',download=True)
 print({k:info.get(k) for k in ['id','title','duration','width','height','filepath']})
