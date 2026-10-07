import { useEffect, useState } from "react";
import { Navigation } from "@decky/ui";
import type { Game } from "./library";
import { GameArt } from "./common";
import { Settings } from "./settings";
import { pushModalInput } from "./input";
import { playSound } from "./steam";

export interface LaunchState { game: Game; message: string; failed: boolean; waitingUI?: boolean }
let state: LaunchState | null = null;
const listeners = new Set<() => void>();
let teardown = () => {};
const emit = (next: LaunchState | null) => { state = next; listeners.forEach(f=>f()); };
export const launchState = () => state;
export function dismissLaunch() { teardown(); emit(null); }
export function useLaunchState() {
  const [value,setValue] = useState(state);
  useEffect(()=>{ const cb=()=>setValue(state);listeners.add(cb);return()=>{listeners.delete(cb);}; },[]);
  return value;
}

/** Observe real Steam launch tasks and window focus; never navigate to an app page. */
export function beginLaunch(game: Game, preview?: (g: Game)=>void) {
  if (state && !state.failed) return;
  teardown();
  emit({game,message:"Preparing game…",failed:false});
  playSound("launch");
  let dead=false;
  const regs: any[]=[];
  const timers: ReturnType<typeof setTimeout>[]=[];
  teardown=()=>{dead=true;regs.forEach(r=>{try{r?.unregister?.();}catch{}});timers.forEach(clearTimeout);};
  const update=(message:string,failed=false,waitingUI=false)=>{if(!dead) emit({game,message,failed,waitingUI});};
  if (preview) {
    preview(game);
    timers.push(setTimeout(()=>update("Waiting for game window…"),700),setTimeout(dismissLaunch,2600));
    return;
  }
  const client=(globalThis as any).SteamClient;
  const matches=(id:any)=>String(id)===String(game.appid)||String(id)===game.gameid;
  const register=(owner:any,name:string,cb:Function)=>{try{const r=owner?.[name]?.(cb);if(r)regs.push(r);}catch{}};
  const task=(name:string)=> {
    if(name==="Failed"||name==="Cancelled") { update(name==="Failed"?"Steam could not start this game.":"Launch cancelled.",true);return; }
    const labels:Record<string,string>={SynchronizingCloud:"Synchronizing cloud saves…",ProcessingShaderCache:"Preparing shaders…",DownloadingDepots:"Downloading game files…",WaitingGameWindow:"Waiting for game window…",CreatingProcess:"Starting game…",Completed:"Waiting for game window…"};
    update(labels[name] ?? name.replace(/([a-z])([A-Z])/g,"$1 $2")+"…",false,name.startsWith("Show"));
  };
  register(client?.Apps,"RegisterForGameActionTaskChange",(_a:any,id:any,_b:any,name:string)=>{if(matches(id))task(name);});
  register(client?.Apps,"RegisterForGameActionShowError",(_a:any,id:any,_b:any,error:string)=>{if(matches(id))update(error||"Steam could not start this game.",true);});
  register(client?.GameSessions,"RegisterForAppLifetimeNotifications",(event:any)=>{if(matches(event.unAppID))update(event.bRunning?"Waiting for game window…":"The game stopped before its window opened.",!event.bRunning);});
  register(client?.System?.UI,"RegisterForFocusChangeEvents",(event:any)=>{
    if(dead)return;
    if(matches(event.focusedApp?.appid)) { dismissLaunch();return; }
    // Once a real window exists, release Steam's opaque overlay. Steam/gamescope
    // owns window selection; process-start alone is deliberately insufficient.
    if(event.rgFocusable?.some((app:any)=>matches(app.appid)&&app.windowid)) {
      try { client.Overlay?.SetOverlayState?.(game.gameid,0); Navigation.CloseSideMenus(); } catch {}
    }
  });
  timers.push(setTimeout(()=>update("Still waiting for Steam. You can return home and check downloads.",true),120000));
  try {
    if(!client?.Apps?.RunGame)throw new Error("Steam launch service is unavailable.");
    Promise.resolve(client.Apps.RunGame(game.gameid,"",-1,100)).catch(error=>update(error instanceof Error?error.message:"Steam could not start this game.",true));
  }
  catch(error) { update(error instanceof Error?error.message:"Steam could not start this game.",true); }
}

export function LaunchView({value,settings}:{value:LaunchState;settings:Settings}) {
  useEffect(()=>pushModalInput(p=>{if(p.btn==="b")dismissLaunch();return true;}),[]);
  const theme=settings.theme;
  return <div className="dht-launch" data-console={theme} data-motion={settings.animations} role="status" aria-live="polite" style={{position:"absolute",inset:0,zIndex:90,background:"#030507",color:"white",display:"grid",placeItems:"center"}}>
    <GameArt g={value.game} kind="hero" style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.22}}/>
    <div style={{position:"relative",textAlign:"center",width:"72%",padding:30}}>
      <GameArt g={value.game} kind="logo" fit="contain" style={{width:360,maxWidth:"70%",height:120,margin:"0 auto 28px"}}/>
      <h1 style={{fontSize:32}}>{value.game.name}</h1>
      {!value.failed && <div className="dht-launch-loader"><i/><i/><i/><i/></div>}
      <p style={{fontSize:22}}>{value.message}</p>
      {value.waitingUI && <p>Complete Steam’s launch prompt to continue.</p>}
      <button onClick={dismissLaunch} style={{background:"#151a20",color:"white",border:"1px solid #9ba6b5",borderRadius:8,padding:"12px 24px",fontSize:18}}>B · Return home</button>
    </div>
    <style>{`
      .dht-launch{--launch-color:#fff}.dht-launch[data-console=nazarick],.dht-launch[data-console=pain]{--launch-color:#bc83f3}.dht-launch[data-console=ps2]{--launch-color:#568cff}.dht-launch[data-console=ps4]{--launch-color:#54abff}.dht-launch[data-console=vita]{--launch-color:#51d5ff}.dht-launch[data-console=xbox],.dht-launch[data-console=x360],.dht-launch[data-console=dial]{--launch-color:#62ff00}.dht-launch[data-console=aero2],.dht-launch[data-console=aero]{--launch-color:#c4ff22}
      .dht-launch-loader{width:60px;height:60px;margin:24px auto;border:4px solid #ffffff26;border-top-color:var(--launch-color);border-radius:50%;animation:dhtLaunchSpin 1s linear infinite}
      .dht-launch[data-console=ps2] .dht-launch-loader{border-radius:3px;box-shadow:0 0 30px #487aff;animation-duration:2s}
      .dht-launch[data-console=psp] .dht-launch-loader,.dht-launch[data-console=ps3] .dht-launch-loader{width:210px;height:5px;border:0;background:#ffffff22;overflow:hidden;border-radius:0;animation:none}
      .dht-launch[data-console=psp] .dht-launch-loader i:first-child,.dht-launch[data-console=ps3] .dht-launch-loader i:first-child{display:block;width:35%;height:100%;background:white;animation:dhtLaunchBar 1.2s ease-in-out infinite alternate}
      .dht-launch[data-console=xbox] .dht-launch-loader,.dht-launch[data-console=dial] .dht-launch-loader{box-shadow:0 0 25px #42ff0077;border-right-color:var(--launch-color)}
      .dht-launch[data-console=x360] .dht-launch-loader{border-style:dotted;border-width:7px}
      .dht-launch[data-console=vita] .dht-launch-loader{background:radial-gradient(circle at 30% 20%,#ffffff66,transparent);box-shadow:inset 0 0 18px #5cdfff}
      .dht-launch[data-motion=false] *{animation:none!important}@media(prefers-reduced-motion:reduce){.dht-launch *{animation:none!important}}
      @keyframes dhtLaunchSpin{to{transform:rotate(360deg)}}@keyframes dhtLaunchBar{to{transform:translateX(190%)}}
    `}</style>
  </div>;
}
