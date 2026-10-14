import sys,json,subprocess
from pathlib import Path
sys.path.insert(0,str(Path('../work/intro-video-tools').resolve()))
from yt_dlp import YoutubeDL
import imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe();out=Path('../work/console-intro-sources');out.mkdir(parents=True,exist_ok=True)
sources={
 'playstation':('i5mBc7O_VHk',{'ps2':(49,16),'ps4':(245,15),'ps5':(267,15)}),
 'xbox':('HbdCKo9oa3o',{'xbox':(0,12)}),
 'x360':('92coix3E_vY',{'x360':(0,11)}),
 'switch':('tmRNnOMdOvU',{'switch':(0,10)}),
 'n3ds':('pazC03LiEAw',{'n3ds':(0,8)}),
 'wii':('3lJ6HUTCt1U',{'wii':(0,5.3)}),
 'psp':('7LpMZrn_ay4',{'psp':(0,9.5)}),
 'ps3':('TAiA-crnct0',{'ps3':(0,5)}),
 'vita':('AWkrgOJpWDk',{'vita':(0,14)}),
 'iisu':('OH8-nyusTW0',{'iisu':(23.7,3.6)})}
class Quiet:
 def debug(self,msg):pass
 def warning(self,msg):print('Warning:',msg,flush=True)
 def error(self,msg):print('Error:',msg,flush=True)
assets=Path('defaults/assets/console-intros');assets.mkdir(parents=True,exist_ok=True);manifest={}
for group,(id,clips) in sources.items():
 try:
  with YoutubeDL({'js_runtimes':{'node':{'path':r'C:/Program Files/nodejs/node.exe'}},'ffmpeg_location':ff,'format':'bestvideo[ext=mp4][vcodec^=avc1][height<=1080]+bestaudio[ext=m4a]','merge_output_format':'mp4','outtmpl':str(out/'%(id)s.%(ext)s'),'noplaylist':True,'socket_timeout':20,'retries':1,'logger':Quiet(),'noprogress':True}) as y:
   info=y.extract_info('https://www.youtube.com/watch?v='+id,download=not (out/(id+'.mp4')).exists())
  for theme,(start,duration) in clips.items():
   duration=min(duration,max(.5,info['duration']-start))
   subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-ss',str(start),'-i',str(out/(id+'.mp4')),'-t',str(duration),'-vf',"scale='min(1280,iw)':-2",'-c:v','libx264','-preset','fast','-crf','18','-pix_fmt','yuv420p','-c:a','aac','-b:a','128k','-movflags','+faststart',str(assets/(theme+'.mp4'))],check=True)
   manifest[theme]={'url':'https://www.youtube.com/watch?v='+id,'title':info['title'],'uploader':info.get('uploader'),'start':start,'duration':duration,'file':theme+'.mp4'}
   subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-ss',str(min(3,duration/2)),'-i',str(assets/(theme+'.mp4')),'-frames:v','1',str(out/(theme+'-check.png'))],check=True)
   print('Prepared',theme,duration,'seconds',flush=True)
 except Exception as e:print('FAILED',group,type(e).__name__,str(e)[:180],flush=True)
(assets/'sources.json').write_text(json.dumps(manifest,indent=2),encoding='utf-8')
print('Complete:',len(manifest),'clips',flush=True)
