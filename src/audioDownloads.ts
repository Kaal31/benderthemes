import {callable,toaster} from "@decky/api";
import {getPacks,refreshPacks} from "./steam";
import {resourcesChanged} from "./marketplaceState";

export interface DownloadableAudio {id:string;name:string;kind:"sounds"|"music";themes:string[];installWithTheme?:boolean}
const catalog=callable<[],DownloadableAudio[]>("deckthemes_audio_catalog");
const install=callable<[id:string],{ok:boolean;folder?:string;reused?:boolean;error?:string}>("install_deckthemes_audio");
let available:DownloadableAudio[]=[];
let loading:Promise<void>|undefined;
const pending=new Map<string,Promise<string|null>>();
export function refreshAudioCatalog():Promise<void> {
  return loading??=(async()=>{try{available=await catalog()??[];}catch{available=[];}finally{loading=undefined;}})();
}
export const downloadableAudio=()=>available;
export const audioDownloading=(id:string)=>pending.has(id);
export async function downloadAudio(id:string):Promise<string|null> {
  const existing=getPacks().filter(p=>p.id===id).sort((a,b)=>Number(b.name.startsWith("DHT Verified"))-Number(a.name.startsWith("DHT Verified")))[0];
  if(existing)return existing.folder;
  const running=pending.get(id);if(running)return running;
  const name=available.find(p=>p.id===id)?.name??"Audio pack";
  const task=(async()=>{
    toaster.toast({title:"Downloading audio",body:name});
    try {
      const result=await install(id);
      if(!result?.ok||!result.folder)throw new Error(result?.error??"Download failed");
      await refreshPacks();
      toaster.toast({title:"Audio ready",body:name});
      return result.folder;
    } catch(error){toaster.toast({title:"Could not download audio",body:`${name}: ${String(error)}`});return null;}
    finally{pending.delete(id);}
  })();
  pending.set(id,task);return task;
}

const automatic=new Map<string,{at:number;promise:Promise<boolean>}>();
/** Shipped theme dependencies use the same original DeckThemes packs as manual audio downloads. */
export function ensureThemeAudio(themeId:string):Promise<boolean> {
  const previous=automatic.get(themeId);
  if(previous&&Date.now()-previous.at<5*60*1000)return previous.promise;
  const promise=(async()=>{
    await refreshAudioCatalog();
    const required=available.filter(p=>p.installWithTheme&&p.themes.includes(themeId));
    if(!required.length)return true;
    await refreshPacks();
    const missing=required.filter(p=>!getPacks().some(installed=>installed.id===p.id));
    if(!missing.length)return true;
    const results=await Promise.all(missing.map(p=>downloadAudio(p.id)));
    if(results.some(Boolean))resourcesChanged();
    return results.every(Boolean);
  })().catch(()=>false);
  automatic.set(themeId,{at:Date.now(),promise});
  return promise;
}
