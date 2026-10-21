import SnowProgram from "./santaSnow.generated";
import {useEffect, useRef, useState} from "react";
import {GameArt, Icon, useHome} from "../common";
import {Press, Stage, ThemeRoot, useStage} from "../input";
import {useReportFocus} from "../focus";
import {openSteam} from "../library";
import {fmtTime, playSound, useClock, useSteamStatus} from "../steam";
import {activeTheme, themeFileUrl} from "../engine/registry";
import {updateSettings} from "../settings";
import {NativeVisuals} from "./NativeVisuals";

export function SantaHome(){return <Stage><SantaSurface/></Stage>;}
function SantaSurface(){
 const api=useHome(),{W,H}=useStage(),status=useSteamStatus(),clock=useClock(),theme=activeTheme(api.settings)!;
 const file=(name:string)=>themeFileUrl(theme,name)!;
 const scale=Math.min(W/1536,H/864);
 const [failedAvatar,setFailedAvatar]=useState<string|null>(null);
 const games=api.lib.games,[selected,setSelected]=useState(0),[zone,setZone]=useState<"games"|"nav"|"volume">("games"),[nav,setNav]=useState(0);
 const index=Math.min(selected,Math.max(0,games.length-1)),game=games[index];
 const saved=api.settings.frameData[theme.id] as {musicVolume?:number;showGameTitle?:boolean}|undefined;
 const volume=saved?.musicVolume??50;
 const windowStart=Math.min(Math.max(index-1,0),Math.max(0,games.length-6));
 const snowHost=useRef<HTMLDivElement>(null);
 const audio=useRef<HTMLAudioElement>(null),drag=useRef<{x:number;y:number}|null>(null),swiped=useRef(false);
 useReportFocus(zone==="games"?game:undefined);
 useEffect(()=>{const a=audio.current;if(!a)return;a.volume=Math.max(0,Math.min(1,volume/100));if(api.busy||document.hidden||!volume)a.pause();else void a.play().catch(()=>{});},[volume,api.busy]);
 useEffect(()=>{const sync=()=>{const a=audio.current;if(!a)return;if(document.hidden)a.pause();else if(!api.busy&&volume)void a.play().catch(()=>{});};document.addEventListener("visibilitychange",sync);return()=>document.removeEventListener("visibilitychange",sync);},[api.busy,volume]);
 useEffect(()=>{
  const host=snowHost.current;if(!host||!api.settings.animations||api.busy||matchMedia("(prefers-reduced-motion: reduce)").matches)return;
  let snow:any,raf=0,last=0;
  try{snow=new SnowProgram(host,{count:1100,opacity:.38,gravity:65,speed:1/13000,color:[1,.97,.92]}).render();snow!.$canvas.id="santa-snow";
   const draw=(now:number)=>{if(!document.hidden&&now-last>=33){snow!.update(now);last=now;}raf=requestAnimationFrame(draw);};raf=requestAnimationFrame(draw);
  }catch{/* A GPU without this shader still renders the complete dashboard. */}
  return()=>{cancelAnimationFrame(raf);if(!snow)return;window.removeEventListener("resize",snow.resize);const gl=snow.gl;Object.values(snow.buffers).forEach((b:any)=>gl.deleteBuffer(b.ref));gl.deleteTexture(snow.texture);gl.getAttachedShaders(snow.program)?.forEach((shader:WebGLShader)=>gl.deleteShader(shader));gl.deleteProgram(snow.program);snow.$canvas.remove();};
 },[api.settings.animations,api.busy]);
 const setVolume=(n:number)=>updateSettings(s=>({frameData:{...s.frameData,[theme.id]:{...(s.frameData[theme.id] as object??{}),musicVolume:Math.max(0,Math.min(100,n))}}}));
 const step=(d:number)=>{setSelected(i=>games.length?(i+d%games.length+games.length)%games.length:0);playSound("move");};
 const launch=()=>{if(game)api.activate(game,()=>api.launch(game));};
 const actions=[()=>setZone("games"),()=>openSteam("library"),()=>openSteam("friends"),()=>openSteam("store"),api.openSettings];
 const input=({btn}:Press)=>{if(api.busy)return false;void audio.current?.play().catch(()=>{});
  if(btn==="y"||btn==="menu"){api.openSettings();return true;}
  if(btn==="b"){if(zone!=="games"){setZone("games");return true;}return false;}
  if(btn==="x"){if(game)api.details(game);return true;}
  if(zone==="volume"){if(btn==="up"||btn==="down")setVolume(volume+(btn==="up"?5:-5));else if(btn==="left")setZone("games");return true;}
  if(zone==="nav"){if(btn==="up"||btn==="down")setNav(i=>Math.max(0,Math.min(4,i+(btn==="down"?1:-1))));else if(btn==="right")setZone("games");else if(btn==="a")actions[nav]();return true;}
  if(btn==="left"){step(-1);return true;}
  if(btn==="right"){step(1);return true;}
  if(btn==="a"){launch();return true;}if(btn==="up"){setZone("nav");return true;}if(btn==="down"){setZone("volume");return true;}return false;
 };
 return <ThemeRoot onInput={input} hints={{a:"Play",x:"Details",y:"Options"}}><NativeVisuals id="santa-express">
  <style>{`.dht-native-santa-express #carousel .card{width:var(--cover-width);min-width:var(--cover-width);max-width:var(--cover-width);height:var(--cover-height);min-height:var(--cover-height);box-sizing:border-box}.dht-native-santa-express #carousel .card>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.dht-native-santa-express #carousel{overflow:clip;height:296px;padding:0;perspective:none;clip-path:path("M 43 1 C 23 1 20 20 17 47 C 12 109 4 199 1 248 C -1 273 9 285 35 286 L 1138 286 C 1165 286 1180 277 1180 253 C 1180 211 1176 139 1170 96 C 1166 67 1154 53 1127 50 Z");mask-image:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%221186%22%20height%3D%22296%22%20viewBox%3D%220%200%201186%20296%22%3E%3Cdefs%3E%3Cfilter%20id%3D%22soft%22%20x%3D%22-10%25%22%20y%3D%22-20%25%22%20width%3D%22120%25%22%20height%3D%22140%25%22%3E%3CfeGaussianBlur%20stdDeviation%3D%224%22%2F%3E%3C%2Ffilter%3E%3C%2Fdefs%3E%3Cpath%20d%3D%22M%2043%201%20C%2023%201%2020%2020%2017%2047%20C%2012%20109%204%20199%201%20248%20C%20-1%20273%209%20285%2035%20286%20L%201138%20286%20C%201165%20286%201180%20277%201180%20253%20C%201180%20211%201176%20139%201170%2096%20C%201166%2067%201154%2053%201127%2050%20Z%22%20fill%3D%22white%22%20filter%3D%22url%28%23soft%29%22%2F%3E%3C%2Fsvg%3E");mask-size:100% 100%;mask-repeat:no-repeat}.dht-native-santa-express .shelf{left:184px;right:166px;top:389px;height:307px}.dht-native-santa-express #carousel .card{top:auto;bottom:12px;left:0}.dht-native-santa-express .pager{height:25px}.dht-native-santa-express .caption{top:-48px}.dht-native-santa-express .cola-inset{left:400px;top:734px;width:772px;height:58px;overflow:hidden;border-radius:31px}.dht-native-santa-express .native-cola-panel{display:block;width:100%;height:100%;filter:none;fill:none}`}</style>
  <style>{`
.dht-native-santa-express .santa-cover-image{position:absolute;inset:0;border-radius:inherit;overflow:hidden;isolation:isolate}.dht-native-santa-express .santa-cover-image>img{width:100%;height:100%;object-fit:cover}.dht-native-santa-express #carousel .card{box-shadow:0 4px 10px #210000aa;border-color:#b7a294;transition:transform .32s cubic-bezier(.2,.7,.3,1),left .34s cubic-bezier(.2,.7,.3,1),bottom .34s ease,width .34s ease,height .34s ease,border-color .38s ease,box-shadow .48s ease}
.dht-native-santa-express #carousel .card:after{display:block;content:"";position:absolute;inset:-8px;border:4px dotted #963e24;border-radius:inherit;pointer-events:none;opacity:.12;filter:drop-shadow(0 0 0 #ff4a19);transition:opacity .46s ease,border-color .38s ease,filter .5s ease;animation:none}
.dht-native-santa-express #carousel .card[aria-current=true]{border-color:#ffe2b7;box-shadow:0 0 0 3px #c52310,0 0 0 5px #ffb079,0 0 20px 5px #ff321b99}
.dht-native-santa-express #carousel .card[aria-current=true]:after{border-color:#fff2d0;opacity:1;filter:drop-shadow(0 0 4px #fff0b4) drop-shadow(0 0 7px #ff3616);animation:santa-led-ignite .48s ease-out both}
@keyframes santa-led-ignite{0%{opacity:.12;border-color:#a43b19;filter:drop-shadow(0 0 0 #ff3813)}35%{opacity:.5;border-color:#ffb16c;filter:drop-shadow(0 0 3px #ff681f)}75%{opacity:1;border-color:#fff8df;filter:drop-shadow(0 0 7px #ffe8ac) drop-shadow(0 0 10px #ff3616)}100%{opacity:1;border-color:#fff2d0;filter:drop-shadow(0 0 4px #fff0b4) drop-shadow(0 0 7px #ff3616)}}
@media(prefers-reduced-motion:reduce){.dht-native-santa-express #carousel .card,.dht-native-santa-express #carousel .card:after{transition:none!important;animation:none!important}}
`}</style>
  <div aria-hidden="true" style={{position:"absolute",inset:0,background:"#160705"}}/>
  <div ref={snowHost} id="stage" style={{left:(W-1536*scale)/2,top:(H-864*scale)/2,transform:`scale(${scale})`}}>
   <div className="steam-avatar">{status.avatar&&failedAvatar!==status.avatar?<img src={status.avatar} alt={api.user} onError={()=>setFailedAvatar(status.avatar??null)}/>:api.user.slice(0,1)}</div>
   <nav className="side">{(["home","library","friends","store","gear"] as const).map((icon,i)=><button key={icon} className={`metal ${["home","games","friends","store","settings"][i]}`} aria-label={["Home","Library","Friends","Store","Settings"][i]} data-selected={zone==="nav"&&nav===i} onClick={actions[i]}><Icon name={icon} size={i===0?62:35}/></button>)}</nav>
   <div className="top"><time id="clock">{fmtTime(clock,api.settings.clock24)}</time></div>
   <section className="shelf">{saved?.showGameTitle!==false&&<div className="caption"><div className="selection-info"><span id="selection">{game?.name??"Your library is empty"}{game?.shortcut?" · Non-Steam":""}</span></div><span id="position">{games.length?index+1:0} / {games.length}</span></div>}
    <div id="carousel" onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY};swiped.current=false;}} onPointerUp={e=>{const start=drag.current;drag.current=null;if(start&&Math.abs(e.clientX-start.x)>35&&Math.abs(e.clientX-start.x)>Math.abs(e.clientY-start.y)){step(e.clientX<start.x?1:-1);swiped.current=true;}}} onPointerCancel={()=>{drag.current=null;}} onWheel={e=>{if(Math.abs(e.deltaX||e.deltaY)>10)step((e.deltaX||e.deltaY)>0?1:-1);}}>
     {games.slice(Math.max(0,windowStart-2),Math.min(games.length,windowStart+8)).map((g,n)=>{const i=Math.max(0,windowStart-2)+n,slot=i-windowStart,position=Math.max(0,Math.min(5,slot));const height=250-position*8;const curve=[12,4,0,0,4,12][position],tilt=[0,-.4,-.2,.2,.4,0][position],turn=[3,2,0,0,-2,-3][position],edgeSkew=[-3.5,-.8,0,0,.8,3.5][position];return <button key={g.appid} className="card" data-appid={g.appid} aria-label={g.name} aria-current={i===index} data-selected={zone==="games"&&i===index} style={{"--cover-width":`${height*2/3}px`,"--cover-height":`${height}px`,opacity:1,pointerEvents:slot<0||slot>5?"none":"auto",left:28+slot*188+(slot>0?18:0),bottom:16+curve,borderRadius:slot===0?"32px 20px 20px 38px":slot===5?"20px 32px 38px 20px":"22px",transform:`perspective(1100px) rotateY(${turn}deg) rotateZ(${tilt}deg) skewX(${edgeSkew}deg) scale(${i===index?1.015:1})`,transformOrigin:"center bottom",zIndex:i===index?10:1,transition:api.settings.animations?undefined:"none"} as import("react").CSSProperties} onClick={()=>{if(swiped.current){swiped.current=false;return;}setZone("games");if(i===index)launch();else{setSelected(i);playSound("move");}}}><div className="santa-cover-image"><GameArt g={g} kind="portrait" flat style={{width:"100%",height:"100%",borderRadius:"inherit"}}/></div>{g.shortcut&&<span className="non-steam-badge">Non-Steam</span>}</button>;})}
    </div><div className="pager"><button aria-label="Previous game" onClick={()=>step(-1)}>‹</button><span aria-hidden="true">•</span><button aria-label="Next game" onClick={()=>step(1)}>›</button></div>
   </section>
   <div className="live-lever"><img className="lever-housing" src={file("lever-housing.png")} alt=""/><img id="lever-knob" src={file("lever-knob.png")} alt="" style={{top:294-volume*2.5}}/><input aria-label="Theme music volume" type="range" min={0} max={100} value={volume} onChange={e=>setVolume(Number(e.target.value))} style={{position:"absolute",inset:"44px 30px 56px",width:60,height:250,writingMode:"vertical-lr",direction:"rtl",opacity:.02}}/></div>
   <div className="cola-inset"><svg className="native-cola-panel" viewBox="85 292 1995 150" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Coca-Cola"><image href={file("cola-panel-v2.png")} width="2167" height="726"/></svg></div>
   <audio ref={audio} src={file("holiday-music.mp3")} loop preload="auto"/>
  </div>
 </NativeVisuals></ThemeRoot>;
}
