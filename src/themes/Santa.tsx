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
 const saved=api.settings.frameData[theme.id] as {musicVolume?:number}|undefined;
 const volume=saved?.musicVolume??50;
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
  <style>{`.dht-native-santa-express #carousel .card{width:174px;min-width:174px;max-width:174px;height:267px;min-height:267px;box-sizing:border-box}.dht-native-santa-express #carousel .card>img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.dht-native-santa-express #carousel{overflow:hidden}`}</style>
  <div aria-hidden="true" style={{position:"absolute",inset:-24,background:`url("${file("background.png")}") center/cover`,filter:"blur(20px) brightness(.65)"}}/>
  <div ref={snowHost} id="stage" style={{left:(W-1536*scale)/2,top:(H-864*scale)/2,transform:`scale(${scale})`}}>
   <div className="steam-avatar">{status.avatar&&failedAvatar!==status.avatar?<img src={status.avatar} alt={api.user} onError={()=>setFailedAvatar(status.avatar??null)}/>:api.user.slice(0,1)}</div>
   <nav className="side">{(["home","library","friends","store","gear"] as const).map((icon,i)=><button key={icon} className={`metal ${["home","games","friends","store","settings"][i]}`} aria-label={["Home","Library","Friends","Store","Settings"][i]} data-selected={zone==="nav"&&nav===i} onClick={actions[i]}><Icon name={icon} size={i===0?62:35}/></button>)}</nav>
   <div className="top"><time id="clock">{fmtTime(clock,api.settings.clock24)}</time></div>
   <section className="shelf"><div className="caption"><span id="selection">{game?.name??"Your library is empty"}{game?.shortcut?" · Non-Steam":""}</span><span>{games.length?index+1:0} / {games.length}</span></div>
    <div id="carousel" onPointerDown={e=>{drag.current={x:e.clientX,y:e.clientY};swiped.current=false;}} onPointerUp={e=>{const start=drag.current;drag.current=null;if(start&&Math.abs(e.clientX-start.x)>35&&Math.abs(e.clientX-start.x)>Math.abs(e.clientY-start.y)){step(e.clientX<start.x?1:-1);swiped.current=true;}}} onPointerCancel={()=>{drag.current=null;}} onWheel={e=>{if(Math.abs(e.deltaX||e.deltaY)>10)step((e.deltaX||e.deltaY)>0?1:-1);}}>
     {Array.from({length:Math.min(5,games.length)},(_,slot)=>{const offset=slot-Math.floor(Math.min(5,games.length)/2),i=(index+offset+games.length)%games.length;return {g:games[i],i,offset};}).map(({g,i,offset})=>{return <button key={g.appid} className="card" data-appid={g.appid} aria-label={g.name} aria-current={i===index} data-selected={zone==="games"&&i===index} style={{transform:`translate(-50%,-50%) translateX(${offset*195}px) scale(${offset===0?1.045:.88}) rotateY(${offset===0?0:offset<0?12:-12}deg)`,zIndex:10-Math.abs(offset),transition:api.settings.animations?undefined:"none"}} onClick={()=>{if(swiped.current){swiped.current=false;return;}setZone("games");if(i===index)launch();else{setSelected(i);playSound("move");}}}><GameArt g={g} kind="portrait" flat style={{width:"100%",height:"100%"}}/>{g.shortcut&&<span className="non-steam-badge">Non-Steam</span>}</button>;})}
    </div><div className="pager"><button aria-label="Previous game" onClick={()=>step(-1)}>‹</button><span>{game?.installed?"Ready to play":"Open game"}</span><button aria-label="Next game" onClick={()=>step(1)}>›</button></div>
   </section>
   <div className="live-lever"><img className="lever-housing" src={file("lever-housing.png")} alt=""/><img id="lever-knob" src={file("lever-knob.png")} alt="" style={{top:294-volume*2.5}}/><input aria-label="Theme music volume" type="range" min={0} max={100} value={volume} onChange={e=>setVolume(Number(e.target.value))} style={{position:"absolute",inset:"44px 30px 56px",width:60,height:250,writingMode:"vertical-lr",direction:"rtl",opacity:.02}}/></div>
   <div className="cola-inset"><img className="cola-badge" src={file("cola-panel-v2.png")} alt="Coca-Cola"/></div>
   <audio ref={audio} src={file("holiday-music.mp3")} loop preload="auto"/>
  </div>
 </NativeVisuals></ThemeRoot>;
}
