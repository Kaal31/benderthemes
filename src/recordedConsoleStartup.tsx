import {useEffect,useRef,useState} from "react";
import {loadAssets} from "./assets";
import {ConsoleStartup,CONSOLE_STARTUPS} from "./consoleStartup";
import {getSettings} from "./settings";
import {bundledThemeFileUrl} from "./engine/registry";
/** Console clips are local; Old Big Picture's original clip arrives with its verified media pack. */
export function RecordedConsoleStartup({theme,leaving,finish}:{theme:string;leaving:boolean;finish:()=>void}){
 const [url,setUrl]=useState<string|null|undefined>(undefined),video=useRef<HTMLVideoElement>(null);
 const finishRef=useRef(finish);finishRef.current=finish;
 const overlay=useRef<HTMLDivElement>(null),returnFocus=useRef<HTMLElement|null>(null);
 useEffect(()=>{
  const node=overlay.current,doc=node?.ownerDocument;if(!node||!doc)return;
  const remember=()=>{const active=doc.activeElement;if(active instanceof HTMLElement&&!node.contains(active))returnFocus.current=active;};
  remember();node.addEventListener("pointerdown",remember);
  return()=>{node.removeEventListener("pointerdown",remember);const active=doc.activeElement,target=returnFocus.current;
   if(target?.isConnected&&(active===doc.body||active===null||node.contains(active)))target.focus({preventScroll:true});
  };
 },[]);
 useEffect(()=>{
  let alive=true;
  const timeout=setTimeout(()=>{if(alive)setUrl(null);},5000);
  const source=["old-big-picture","old-beta-big-picture"].includes(theme)?Promise.resolve(bundledThemeFileUrl("old-big-picture","intro.mp4")):loadAssets("console-intros").then(assets=>assets[theme]??null);
  source.then(url=>{if(!alive)return;clearTimeout(timeout);setUrl(url);}).catch(()=>{if(alive){clearTimeout(timeout);setUrl(null);}});
  return()=>{alive=false;clearTimeout(timeout);};
 },[theme]);
 useEffect(()=>{
  if(url===null){const timer=setTimeout(()=>finishRef.current(),CONSOLE_STARTUPS[theme].duration);return()=>clearTimeout(timer);}
  if(!url||!video.current)return;
  const player=video.current;player.volume=Math.max(0,Math.min(1,getSettings().sfxVolume/100));
  player.play().catch(()=>{if(player.volume>0){player.muted=true;player.play().catch(()=>setUrl(null));}else setUrl(null);});
  return()=>{player.pause();};
 },[url,theme]);
 if(url===null)return <ConsoleStartup theme={theme} leaving={leaving} finish={finish}/>;
 return <div ref={overlay} className="dht-console-video" data-console={theme} role="button" tabIndex={0} aria-label={`${CONSOLE_STARTUPS[theme].name} video intro. Press any button to skip.`} onClick={finish} onKeyDown={e=>{e.preventDefault();finish();}} style={{position:"absolute",inset:0,zIndex:96,background:"#000",opacity:leaving?0:1,transition:"opacity .5s",overflow:"hidden"}}>
 {url&&<video ref={video} src={url} playsInline preload="auto" onEnded={finish} onError={()=>setUrl(null)} style={{width:"100%",height:"100%",objectFit:"contain",display:"block"}}/>}
 <small style={{position:"absolute",bottom:"5%",left:0,right:0,textAlign:"center",color:"#ffffff88",fontFamily:"Segoe UI,Arial",fontSize:12}}>Press any button to skip</small>
 </div>;
}
