import {useEffect,useRef,useState} from 'react';
import {pushModalInput} from '../input';
import {getSettings,updateSettings} from '../settings';
import {playSound} from '../steam';
import {useAssets} from '../assets';

/** Optional first-run presentation inspired by the supplied disc-loader video, not OSDSYS. */
export function Ps2FirstStart({onDone}:{onDone:()=>void}){
 const [choice,setChoice]=useState(getSettings().styles.ps2?.firstStartVersion==='russian'?1:0);
 const [ready,setReady]=useState(false);
 const [finished,setFinished]=useState(false),[leaving,setLeaving]=useState(false);
 const current=useRef(choice),done=useRef(false),timer=useRef<ReturnType<typeof setTimeout>|undefined>(undefined);current.current=choice;
 const assets=useAssets('ps2-stock-menu');
 const complete=(value=current.current)=>{if(done.current)return;done.current=true;playSound('select');updateSettings(p=>({styles:{...p.styles,ps2:{...p.styles.ps2,firstStartDone:true,firstStartVersion:value?'russian':'original',language:value?'ru':'en'}}}));setLeaving(true);timer.current=setTimeout(()=>{setFinished(true);onDone();},400);};
 useEffect(()=>{let delay:ReturnType<typeof setTimeout>;const check=()=>{clearTimeout(delay);if(document.querySelector('[data-ps2-procedural-startup]'))setReady(false);else delay=setTimeout(()=>setReady(true),600);};const observer=new MutationObserver(check);observer.observe(document.body,{childList:true,subtree:true});check();return()=>{observer.disconnect();clearTimeout(delay);};},[]);
 useEffect(()=>{if(!ready)return;const off=pushModalInput(p=>{if(['left','right','up','down'].includes(p.btn)){setChoice(n=>1-n);playSound('move');}else if(p.btn==='a'||p.btn==='menu')complete();else if(p.btn==='b')complete(0);return true;});return()=>{off();if(timer.current)clearTimeout(timer.current);};},[ready]);
 if(finished||!ready)return null;
 return <div data-ps2-first-start="" data-choice={choice?'russian':'original'} style={{position:'absolute',inset:0,zIndex:98,overflow:'hidden',background:'#000',color:'#eee',opacity:leaving?0:1,transition:'opacity 400ms',fontFamily:'Arial, sans-serif'}}>
  <style>{`@keyframes ps2FilmRibbon{0%{transform:perspective(800px) rotateY(-5deg)}50%{transform:perspective(800px) rotateY(5deg)}100%{transform:perspective(800px) rotateY(-5deg)}}@keyframes ps2FilmTicker{from{transform:translateX(0)}to{transform:translateX(-50%)}}.ps2-first-title{position:absolute;left:10%;top:40%;padding:0;border:0;background:none;color:#eee;font-size:clamp(20px,3.25vw,42px);font-weight:700;font-variant:small-caps;transform:scaleX(1.4);transform-origin:left center;letter-spacing:.025em;text-shadow:0 0 3px #b5bdcf;cursor:pointer}.ps2-film-strip{position:absolute;left:64%;top:15%;width:22%;height:70%;mask-image:linear-gradient(transparent,#000 12%,#000 85%,transparent);animation:ps2FilmRibbon 14s ease-in-out infinite}.ps2-film-strip[data-reference=true]{animation:none;mask-image:none}.ps2-film-strip>video,.ps2-film-strip>canvas{width:100%;height:100%;object-fit:cover;filter:saturate(.6) contrast(1.2)}.ps2-first-bar{position:absolute;top:67%;left:5%;right:5%;height:3.8%;background:linear-gradient(90deg,transparent,#132868 30%,#4a58bc 74%,#101934);box-shadow:0 -3px 9px #2e54bb44;overflow:hidden}.ps2-first-ticker{position:absolute;white-space:nowrap;font-size:clamp(10px,1.35vw,18px);font-weight:700;top:35%;left:25%;width:max-content;animation:ps2FilmTicker 28s linear infinite}.ps2-first-actions{position:absolute;top:67%;left:5%;right:5%;height:4%;display:flex;justify-content:center;gap:24px;opacity:0}.ps2-first-actions:focus-within,.ps2-first-actions:hover{opacity:1}.ps2-first-actions button{background:none;border:0;color:#737c95;font-size:clamp(12px,1.3vw,18px);cursor:pointer;padding:8px}.ps2-first-actions button[aria-pressed=true]{color:#d1dcff;text-shadow:0 0 5px #5876da}@media(prefers-reduced-motion:reduce){.ps2-film-strip,.ps2-first-ticker{animation:none}}`}</style>
  <button className="ps2-first-title" onClick={()=>complete()} aria-label={`Confirm ${choice?'Russian':'Original'} version`}>{choice?'Russian Version':'Original Version'}</button>
  <div className="ps2-film-strip" data-reference={!!assets['filmstrip-video']}>{assets['filmstrip-video']?<video src={assets['filmstrip-video']} autoPlay muted loop playsInline/>:<FilmstripFallback/>}</div>
  <div style={{position:'absolute',left:'64%',top:'65.4%',width:'22%',textAlign:'center',letterSpacing:'.8em',fontSize:'clamp(10px,1.35vw,18px)',color:'#96a5e0'}}>G A M E</div>
  <div className="ps2-first-bar"><div className="ps2-first-ticker">{Array.from({length:12},(_,i)=><span key={i}>{choice?'RUSSIAN · ORIGINAL':'ORIGINAL · RUSSIAN'}　•　</span>)}</div></div>
  <div className="ps2-first-actions"><button aria-pressed={!choice} onClick={()=>setChoice(0)}>◀ Original</button><button aria-pressed={!!choice} onClick={()=>setChoice(1)}>Russian ▶</button><button onClick={()=>complete()}>Enter</button></div>
 </div>;
}

// Independently drawn fallback frames; the original disc video can be supplied separately.
function FilmstripFallback(){
 const ref=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{const canvas=ref.current!,ctx=canvas.getContext('2d')!;let frame=0,last=0;const motion=getSettings().animations&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
  const draw=(ms:number)=>{const t=motion?ms/1000:0;ctx.fillStyle='#000';ctx.fillRect(0,0,256,768);
   for(let i=0;i<6;i++){const y=35+i*118;ctx.save();ctx.beginPath();ctx.rect(8,y,240,105);ctx.clip();const gradient=ctx.createLinearGradient(0,y,256,y+105);gradient.addColorStop(0,'#122a69');gradient.addColorStop(.5,'#527ec0');gradient.addColorStop(1,'#091944');ctx.fillStyle=gradient;ctx.fillRect(8,y,240,105);ctx.strokeStyle='#b7dcff';ctx.lineWidth=1.5;
    const angle=t*.2+i*.44;for(let k=0;k<8;k++){const a=angle+k*Math.PI/4;ctx.beginPath();ctx.ellipse(128+Math.sin(a)*45,y+54,12+Math.abs(Math.cos(a))*64,40,a*.3,0,Math.PI*2);ctx.stroke();}
    ctx.fillStyle='#d5ecff';for(let k=0;k<12;k++){const x=(k*43+Math.sin(t*.3+k)*30)%240+8;const h=12+(k*13)%50;ctx.globalAlpha=.12+(k%3)*.12;ctx.fillRect(x,y+105-h,9+(k%4)*8,h);}ctx.restore();ctx.globalAlpha=1;
   }const cap=ctx.createRadialGradient(128,21,1,128,21,98);cap.addColorStop(0,'#e5f5ff');cap.addColorStop(.3,'#718ed8');cap.addColorStop(1,'#000');ctx.fillStyle=cap;ctx.beginPath();ctx.ellipse(128,20,105,14,0,0,Math.PI*2);ctx.fill();
  };const tick=(ms:number)=>{frame=requestAnimationFrame(tick);if(document.hidden||ms-last<50)return;last=ms;draw(ms);};draw(0);if(motion)frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[]);
 return <canvas ref={ref} width={256} height={768} aria-hidden="true"/>;
}
