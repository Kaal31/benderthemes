/* Recreated rolling-block startup, driven by the host's activity-aware clock. */
(() => {
 const screen=document.getElementById('screen'),cube=document.getElementById('cube');
 const intro=document.createElement('section');intro.id='startup';intro.setAttribute('aria-label','GameCube startup animation');
 const path=document.createElement('div');path.className='startup-path';intro.append(path);
 const points=[[3,0],[2,0],[1,0],[0,0],[0,1],[0,2],[0,3],[0,4],[1,4],[2,4],[3,4],[4,4],[4,3],[4,2],[3,2],[2,2]];
 const tiles=points.map(([x,y])=>{const b=document.createElement('i');b.style.left=x*38+'px';b.style.top=y*38+'px';path.append(b);return b;});
 const canvas=document.createElement('canvas');canvas.className='startup-canvas';intro.append(canvas);const scene=window.createStartupScene?.(canvas);if(scene)intro.classList.add('has-startup-scene');
 const roller=document.createElement('b');roller.className='startup-roller';path.append(roller);
 const word=document.createElement('div');word.className='startup-word';word.innerHTML='<small>N I N T E N D O</small><strong>GAMECUBE</strong>';intro.append(word);
 const skip=document.createElement('button');skip.className='startup-skip';skip.textContent='Skip intro';intro.append(skip);screen.append(intro);
 const replay=document.createElement('button');replay.id='replay-intro';replay.textContent='Replay intro';replay.onclick=()=>start();screen.append(replay);
 let active=true,elapsed=0,last=null;
 function finish(){if(window.GameCubeIntro)window.GameCubeIntro.endedAt=performance.now();active=false;screen.classList.remove('intro-playing','intro-solid');intro.hidden=true;cube.style.opacity='';cube.style.setProperty('--sheen-reveal','1');cube.style.setProperty('--unfold','0deg');cube.style.setProperty('--open-depth','245px');last=null;}
 function start(){if(screen.dataset.page!=='home')return;elapsed=0;last=null;active=true;intro.hidden=false;cube.style.setProperty('--sheen-reveal','0');screen.classList.add('intro-playing');}
 skip.onclick=finish;start();
 document.querySelectorAll('.cube-face').forEach(face=>{const fill=document.createElement('div');fill.className='startup-solid-fill';face.prepend(fill);});
 window.GameCubeIntro={endedAt:0,skip:finish,get active(){return active;},tick(now,enabled){
  if(!active)return false;
  if(!enabled||matchMedia('(prefers-reduced-motion: reduce)').matches){finish();return false;}
  if(last!==null)elapsed+=Math.min(80,now-last);last=now;
  const rawTime=elapsed/1220,t=rawTime<=3.65?rawTime:3.65+(rawTime-3.65)*.52,smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};if(scene){scene.draw(t);canvas.style.opacity=String(1-smooth((t-3.82)/.65));}
  tiles.forEach((tile,i)=>tile.style.opacity=t>i*.135?'1':'0');
  const rawStep=Math.max(0,Math.min(points.length-1,t/.135)),i=Math.floor(rawStep),p=points[i],next=points[Math.min(points.length-1,i+1)],f=rawStep-i,hop=Math.sin(f*Math.PI)*9;roller.style.transform=`translate3d(${(p[0]+(next[0]-p[0])*f)*38}px,${(p[1]+(next[1]-p[1])*f)*38-hop}px,22px) rotateZ(${rawStep*90}deg)`;tiles.forEach((tile,n)=>{const age=t-n*.135;tile.style.transform='translateZ(0px) scale('+Math.min(1,Math.max(.01,age*9))+')';});
  path.style.opacity=t<2.6?'1':String(Math.max(0,1-(t-2.6)*2.5));path.style.transform='rotateX('+(20+Math.max(0,t-2.4)*20)+'deg) rotateZ(-15deg) scale('+(1+Math.max(0,t-2.4)*.6)+')';
  word.style.opacity=String(smooth((t-2.8)/.35)*(1-smooth((t-3.9)/.45)));word.style.transform='translateY('+(6*(1-smooth((t-2.8)/.35)))+'px)';
  cube.style.opacity=String(smooth((t-3.85)/.55));screen.classList.toggle('intro-solid',t<4.2);
  cube.style.setProperty('--startup-solid',1-smooth((t-4.0)/1.05));cube.style.setProperty('--startup-labels',smooth((t-5.80)/.65));cube.style.setProperty('--sheen-reveal',smooth((t-4.35)/1.65));cube.style.setProperty('--startup-glint',Math.sin(Math.PI*smooth((t-4.05)/1.2))*.2);
  const progress=smooth((t-3.85)/2.6),arc=Math.sin(Math.PI*progress),scale=.49+.27*progress+.008*arc;
  const rx=7+20*(1-progress)+75*arc,ry=-8-27*(1-progress)-35*arc,rz=7-15*(1-progress)-25*arc,depth=.07+.93*progress+.14*Math.sin(Math.PI*progress);
  cube.style.transform=`scale(${scale}) rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${rz}deg) scale3d(${1+.1*arc},${1-.12*arc},${depth})`;
  if(t>6.45){finish();return false;}return true;
 }};
})();
