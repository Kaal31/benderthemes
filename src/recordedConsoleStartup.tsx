import { t } from "./i18n";
import {useEffect,useRef,useState} from "react";
import {loadAssets} from "./assets";
import {ConsoleStartup,CONSOLE_STARTUPS} from "./consoleStartup";
import {getSettings} from "./settings";
/** Locally bundled clips sourced from YouTube; sources.json records each source/trim. */
export function RecordedConsoleStartup({theme,leaving,finish}:{theme:string;leaving:boolean;finish:()=>void}){
 const [url,setUrl]=useState<string|null|undefined>(undefined),video=useRef<HTMLVideoElement>(null);
 const finishRef=useRef(finish);finishRef.current=finish;
 useEffect(()=>{
  let alive=true;
  const timeout=setTimeout(()=>{if(alive)setUrl(null);},5000);
  loadAssets("console-intros").then(assets=>{if(!alive)return;clearTimeout(timeout);setUrl(assets[theme]??null);}).catch(()=>{if(alive){clearTimeout(timeout);setUrl(null);}});
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
 return <div className="dht-console-video" data-console={theme} role="button" tabIndex={0} aria-label={`${CONSOLE_STARTUPS[theme].name} video intro. Press any button to skip.`} onClick={finish} onKeyDown={e=>{e.preventDefault();finish();}} style={{position:"absolute",inset:0,zIndex:96,background:"#000",opacity:leaving?0:1,transition:"opacity .5s",overflow:"hidden"}}>
 {url&&<video ref={video} src={url} playsInline preload="auto" onEnded={finish} onError={()=>setUrl(null)} style={{width:"100%",height:"100%",objectFit:"contain",display:"block"}}/>}
 <small style={{position:"absolute",bottom:"5%",left:0,right:0,textAlign:"center",color:"#ffffff88",fontFamily:"Segoe UI,Arial",fontSize:12}}>{t("pressAnyButtonToSkip")}</small>
 </div>;
}
