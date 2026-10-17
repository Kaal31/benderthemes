import { useSyncExternalStore } from "react";
import { callable, openFilePicker } from "@decky/api";
import { getSettings, updateSettings, onSettingsChange, settingsLoaded, ThemeScreensaver } from "./settings";
import { findModuleExports } from "./steam";
import { steamDocuments } from "./keyboardSkins";
import { logInfo } from "./diag";

export const saverDefaults: ThemeScreensaver = {mode:"steam",media:[],duration:15,shuffle:false,fit:"contain",transition:"fade"};
export const saverKey = () => getSettings().activeTheme || getSettings().theme;
export const saverOptions = (): ThemeScreensaver => ({...saverDefaults,...getSettings().themeScreensavers?.[saverKey()]});
export function updateSaver(patch: Partial<ThemeScreensaver>, key=saverKey()) {
  updateSettings(s => ({themeScreensavers:{...s.themeScreensavers,[key]:{...saverDefaults,...s.themeScreensavers?.[key],...patch}}}));
}
export async function addSaverMedia() {
 const key=saverKey();
 try {
  const file=await openFilePicker(0 as any,"/home/deck",true,true,undefined,["gif","mp4","webm","png","jpg","jpeg","webp"]);
  if(!file?.realpath)return;
  const r=await callable<[string],{file?:string;name?:string;error?:string}>("import_screensaver_media")(file.realpath);
  if(!r.file)throw Error(r.error || "Media import failed");
  const files=getSettings().themeScreensavers?.[key]?.media??[];
  if(files.length>=100)throw Error("Each theme supports up to 100 media files.");
  updateSaver({media:[...new Set([...files,r.file])],labels:{...getSettings().themeScreensavers?.[key]?.labels,[r.file]:r.name??"Media"}},key);
 }catch(e){alert(e instanceof Error?e.message:String(e));}
}
let status="Waiting for Steam screensaver controls";
const statusListeners=new Set<()=>void>();
const setStatus=(next:string)=>{if(next!==status){status=next;statusListeners.forEach(f=>f());}};
export function useScreensaverStatus(){return useSyncExternalStore(f=>{statusListeners.add(f);return()=>statusListeners.delete(f);},()=>status);}
const ID="uioverride-themehub-active";
const AC="system_idle_screensaver_ac_sec", BAT="system_idle_screensaver_battery_sec", SELECT="screensaver_current_id";
let store:any, rpc:any;
function native() {
 if(!store){
  const mod=findModuleExports("SteamClient.Settings.SetSetting","clientSettings");
  store=Object.values(mod??{}).find((v:any)=>v&&typeof v.GetSetting==="function"&&v.clientSettings);
 }
 if(!rpc){
  const mod=findModuleExports("Screensaver.ForceScreensaver#1","Screensaver.GetLocalScreensavers#1");
  rpc=Object.values(mod??{}).find((v:any)=>v&&typeof v.ForceScreensaver==="function"&&typeof v.GetLocalScreensavers==="function");
 }
 return {store,rpc};
}
export async function prepareSaver() {
 const c=saverOptions();
 if(!c.media.length)throw Error("Add screensaver media for this theme first.");
 const result=await callable<[string[],ThemeScreensaver],{error?:string}>("export_screensaver")(c.media,c);
 if(result.error)throw Error(result.error);
 const n=native();
 if(!n.store||!n.rpc)throw Error("Steam screensaver controls are unavailable in this client.");
 const entries=(await n.rpc.GetLocalScreensavers({})).Body().screensavers();
 if(!entries.some((x:any)=>x.id()===ID))throw Error("Steam has not discovered the ThemeHub player yet. Restart Steam and try again.");
}
export async function previewSaver() {
 try {
  if(getSettings().screensaversDisabled)throw Error("Enable screensavers in Quick Access before previewing.");
  await prepareSaver();
  const n=native(), [previous,set]=n.store.GetSetting(SELECT);
  await set(ID);
  await n.rpc.ForceScreensaver({enabled:true});
  // The service restores this temporary choice once preview ends.
  if(getSettings().screensaverSteamBackup?.[SELECT]===undefined)
   updateSettings(s=>({screensaverSteamBackup:{...s.screensaverSteamBackup,[SELECT]:previous??"steam-gameslideshow"}}));
 }catch(e){alert(e instanceof Error?e.message:String(e));}
}

export function startThemeScreensavers() {
 let stopped=false,busy=false,signature="",lastFailure="",previewActive=false;
 const expected: Record<string,string|number>={};
 const managed = async (key:string,value:string|number) => {
  const n=native();if(!n.store)throw Error("Steam settings API unavailable");
  const [current,set]=n.store.GetSetting(key);
  if(key!==SELECT && typeof current!=="number")throw Error("Steam idle settings are still loading");
  if(current===value){expected[key]=value;return;}
  if(getSettings().screensaverSteamBackup?.[key]===undefined)updateSettings(s=>({screensaverSteamBackup:{...s.screensaverSteamBackup,[key]:current??(key===SELECT?"steam-gameslideshow":0)}}));
  await set(value);expected[key]=value;
 };
 const restore = async (keys:string[]) => {
  const n=native();if(!n.store)return;
  const saved={...getSettings().screensaverSteamBackup};
  for(const key of keys)if(saved[key]!==undefined){
   const [current,set]=n.store.GetSetting(key);
   const ours=expected[key]??(key===SELECT?ID:0);
   if(current===ours)await set(saved[key]);
   delete saved[key];delete expected[key];
  }
  if(JSON.stringify(saved)!==JSON.stringify(getSettings().screensaverSteamBackup??{}))updateSettings({screensaverSteamBackup:saved});
 };
 const sync=async()=>{
  if(stopped||busy||!settingsLoaded())return;busy=true;
  try {
   const s=getSettings(), c=saverOptions(), home=steamDocuments().some(d=>!!d.querySelector("[data-dht-root]"));
   const disabled=s.screensaversDisabled===true || (s.enabled&&home&&c.mode==="disabled");
   if(disabled){
    await managed(AC,0);await managed(BAT,0);
    await native().rpc?.ForceScreensaver({enabled:false});
    await restore([SELECT]);signature="";setStatus("Screensavers disabled");
   }else{
    await restore([AC,BAT]);
    const needsState=(s.enabled&&home&&c.mode==="custom")||getSettings().screensaverSteamBackup?.[SELECT]!==undefined;
    const state=needsState?await native().rpc?.GetActiveState({}):undefined;
    const active=!!state?.Body().active();
    if(active){previewActive=true;return;}
    if(previewActive){previewActive=false;signature="";}
    if(s.enabled&&home&&c.mode==="custom"&&c.media.length){
     const next=JSON.stringify([saverKey(),c]);
     if(next!==signature){await prepareSaver();if(stopped||JSON.stringify([saverKey(),saverOptions()])!==next)return;await managed(SELECT,ID);signature=next;}
     setStatus("Using this theme’s screensaver");
    }else{await restore([SELECT]);signature="";setStatus("Using Steam’s selected screensaver");}
   }
   lastFailure="";
  }catch(e){const message=String(e);setStatus(message.replace(/^Error: /,""));if(message!==lastFailure){logInfo("[screensaver] "+message);lastFailure=message;}}
  finally{busy=false;}
 };
 const timer=setInterval(()=>void sync(),1000);
 const off=onSettingsChange(()=>void sync());
 void sync();
 return ()=>{stopped=true;clearInterval(timer);off();void (async()=>{
   while(busy)await new Promise(resolve=>setTimeout(resolve,25));
   await restore([AC,BAT,SELECT]);
  })().catch(e=>logInfo("[screensaver] restore failed: "+String(e)));};
}
