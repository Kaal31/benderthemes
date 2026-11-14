"""Encode recorded browser UI with a shared palette per GIF; validate every result."""
import argparse,json,subprocess
from pathlib import Path
from PIL import Image,ImageDraw,ImageStat
import imageio_ffmpeg
root=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('--only');args=parser.parse_args()
out=root/'out/readme-gallery';dest=root/'docs/gallery';dest.mkdir(parents=True,exist_ok=True)
entries=json.loads((out/'entries.json').read_text(encoding='utf-8'))
records={r['id']:r for r in json.loads((out/'manifest.json').read_text(encoding='utf-8'))}
ffmpeg=imageio_ffmpeg.get_ffmpeg_exe();report=[]
for entry in entries:
 if args.only and entry['id'] not in args.only.split(','):continue
 r=records.get(entry['id'])
 if not r or r.get('error'):continue
 target=dest/(entry['id']+'.gif')
 subprocess.run([ffmpeg,'-v','error','-y','-ss',str(r['trim']),'-i',r['videoPath'],'-t','6','-filter_complex','[0:v]fps=8,scale=640:400:flags=lanczos,tpad=stop_mode=clone:stop_duration=1,trim=duration=6,split[s0][s1];[s0]palettegen=max_colors=160:stats_mode=diff[p];[s1][p]paletteuse=dither=bayer:bayer_scale=4','-loop','0',str(target)],check=True)
 with Image.open(target) as im:
  assert im.size==(640,400),(target,im.size)
  assert im.n_frames>=24,(target,im.n_frames)
  assert im.info.get('loop')==0,target
  duration=0;frames=[]
  for i in range(im.n_frames):
   im.seek(i);duration+=im.info.get('duration',0)
   if i in (0,im.n_frames//2,im.n_frames-1):frames.append(im.convert('RGB').copy())
  assert 5700<=duration<=6200,(target,duration)
  assert len({f.tobytes() for f in frames})>1,('Static preview',target)
  frames[0].save(out/(entry['id']+'-first.png'))
  report.append({**entry,'frames':im.n_frames,'durationMs':duration,'bytes':target.stat().st_size})
 print(entry['id'],target.stat().st_size//1024,'KB',flush=True)
if not args.only:
 (out/'gif-validation.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
# Inspection sheet uses decoded GIF frames, so it also catches bad trimming.
width=1200;cellw=300;cellh=214;rows=(len(report)+3)//4
sheet=Image.new('RGB',(width,rows*cellh),'#10202b');draw=ImageDraw.Draw(sheet)
for i,r in enumerate(report):
 with Image.open(dest/(r['id']+'.gif')) as im:
  thumb=im.convert('RGB').resize((296,185));x=(i%4)*cellw+2;y=(i//4)*cellh
  sheet.paste(thumb,(x,y));draw.text((x+4,y+188),r['name'],fill='white')
sheet.save(out/'contact-sheet.jpg',quality=92)
print('Validated',len(report),'animated GIFs; total',round(sum(r['bytes'] for r in report)/1024**2,1),'MiB')
