import {Navigation} from '@decky/ui';
import {getSettings} from './settings';

/** Tracks only games explicitly started from ThemeHub, past launch-screen dismissal. */
type Session={appid:number;gameid:string;running:boolean};
let session:Session|null=null;
let revision=0,pendingExit:number|null=null;
let stop=()=>{};
let ensureObserver=()=>{};
const exits=new Set<()=>void>();
export function onThemeGameExit(callback:()=>void){exits.add(callback);return()=>{exits.delete(callback)}}
export function trackThemeGame(appid:number,gameid:string){ensureObserver();revision++;pendingExit=null;session={appid,gameid,running:false}}
export function forgetThemeGame(appid:number){if(session?.appid===appid||pendingExit===appid){revision++;pendingExit=null;session=null}}
export function startGameSessionReturn(reveal:()=>void){
 stop();let dead=false,registration:any,timer:ReturnType<typeof setTimeout>|undefined;
 const listener=(event:any)=>{
  const current=session;if(dead||!current||String(event?.unAppID)!==String(current.appid))return;
  if(event.bRunning){current.running=true;return;}
  if(!current.running)return;
  session=null;pendingExit=current.appid;const expectedRevision=revision;
  // Let Steam finish its own process-exit route changes before restoring Home.
  timer=setTimeout(()=>{
   if(dead||session||revision!==expectedRevision||!getSettings().enabled)return;
   pendingExit=null;
   if(getSettings().randomThemeAfterGame)exits.forEach(fn=>fn());
   if(getSettings().returnToThemeAfterGame!==false){
    reveal();window.dispatchEvent(new Event('themehub-game-return'));try{Navigation.CloseSideMenus();Navigation.Navigate('/library/home')}catch{/* Native Home remains usable. */}
   }
  },350);
 };
 ensureObserver=()=>{if(dead||registration)return;try{registration=(globalThis as any).SteamClient?.GameSessions?.RegisterForAppLifetimeNotifications?.(listener)}catch{}};
 ensureObserver();
 stop=()=>{dead=true;ensureObserver=()=>{};revision++;pendingExit=null;clearTimeout(timer);try{registration?.unregister?.()}catch{};session=null;};
 return stop;
}
