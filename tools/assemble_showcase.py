from pathlib import Path
import json,subprocess,re,imageio_ffmpeg
ff=imageio_ffmpeg.get_ffmpeg_exe();out=Path('work/ui-demo');entries=json.loads((out/'manifest.json').read_text(encoding='utf-8'))
extra=Path('work/ui-demo-zen/manifest.json')
if extra.exists():
 entries += [e for e in json.loads(extra.read_text(encoding='utf-8')) if e['title'] not in {v['title'] for v in entries}]
updates=Path('work/ui-demo-updates/manifest.json')
if updates.exists():
 for e in json.loads(updates.read_text(encoding='utf-8')):
  match=next((i for i,v in enumerate(entries) if v['title']==e['title']),None)
  if match is None: entries.append(e)
  else: entries[match]=e
chapters=[];total=0
for i,e in enumerate(entries):
 target=out/f'clip-{i:02}.mp4'
 subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-ss',str(e['trim']),'-i',e['path'],'-t',str(e['duration']),'-an','-vf','fps=30,format=yuv420p','-c:v','libx264','-preset','fast','-crf','24',str(target)],check=True)
 probe=subprocess.run([ff,'-hide_banner','-i',str(target)],capture_output=True,text=True)
 stamp=re.search(r'Duration: (\d+):(\d+):(\d+\.\d+)',probe.stderr)
 duration=sum(float(v)*m for v,m in zip(stamp.groups(),[3600,60,1])) if stamp else e['duration']
 chapters.append((round(total),e['title']));total+=duration
 print(e['title'],flush=True)
(out/'concat.txt').write_text('\n'.join("file '"+str((out/f'clip-{i:02}.mp4').resolve()).replace('\\','/')+"'" for i in range(len(entries))))
subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-f','concat','-safe','0','-i',str(out/'concat.txt'),'-c','copy','-movflags','+faststart','docs/showcase.mp4'],check=True)
subprocess.run([ff,'-hide_banner','-loglevel','error','-y','-i','work/ui-demo/12.png','-frames:v','1','-q:v','2','docs/showcase-poster.jpg'],check=True)
Path('docs/showcase-chapters.md').write_text('# UI walkthrough chapters\n\nSilent browser recording with real game artwork and sample library data.\n\n'+'\n'.join(f'- {t//60:02}:{t%60:02} — {title}' for t,title in chapters)+'\n')
print('Video:',round(total,1),'seconds;',round(Path('docs/showcase.mp4').stat().st_size/1048576,1),'MB')
