import { useEffect, useState } from "react";
import { Navigation } from "@decky/ui";
import type { Game } from "./library";
import { GameArt } from "./common";
import { Settings } from "./settings";
import { pushModalInput } from "./input";
import { LAUNCH_CSS } from "./launchStyles";
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
  return <div className="dht-launch" data-console={theme} data-variant={theme==="x360"?settings.x360.style:theme==="dial"?settings.dial.look:undefined} data-motion={settings.animations} role="status" aria-live="polite" style={{position:"absolute",inset:0,zIndex:90,background:"#030507",color:"white",display:"grid",placeItems:"center"}}>
    <GameArt g={value.game} kind="hero" style={{position:"absolute",inset:0,width:"100%",height:"100%",opacity:.22}}/>
    <div className="dht-launch-panel" style={{position:"relative",textAlign:"center",width:"72%",padding:30}}>
      <GameArt g={value.game} kind="logo" fit="contain" style={{width:360,maxWidth:"70%",height:120,margin:"0 auto 28px"}}/>
      <h1 style={{fontSize:32}}>{value.game.name}</h1>
      {!value.failed && <div className="dht-launch-loader"><i/><i/><i/><i/></div>}
      <p style={{fontSize:22}}>{value.message}</p>
      {value.waitingUI && <p>Complete Steam’s launch prompt to continue.</p>}
      <button onClick={dismissLaunch} style={{background:"#151a20",color:"white",border:"1px solid #9ba6b5",borderRadius:8,padding:"12px 24px",fontSize:18}}>B · Return home</button>
    </div>
    <style>{LAUNCH_CSS}</style>
  </div>;
}
