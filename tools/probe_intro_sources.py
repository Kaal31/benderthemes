import sys
from pathlib import Path
sys.path.insert(0,str(Path('../work/intro-video-tools').resolve()))
from yt_dlp import YoutubeDL
with YoutubeDL({'js_runtimes':{'node':{'path':r'C:/Program Files/nodejs/node.exe'}},'quiet':True,'skip_download':True,'ignore_no_formats_error':True,'socket_timeout':15}) as y:
 for id in ['92coix3E_vY','i5mBc7O_VHk','tmRNnOMdOvU','HbdCKo9oa3o']:
  try:
   r=y.extract_info('https://www.youtube.com/watch?v='+id,download=False)
   print(id, r.get('duration'), [{k:f.get(k) for k in ['format_id','ext','height','acodec','vcodec']} for f in r.get('formats',[])])
  except Exception as e:print(id,type(e).__name__)
