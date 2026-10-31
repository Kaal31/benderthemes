import {callable} from "@decky/api";
import {useSyncExternalStore} from "react";
import {ensureThemeAudio} from "./audioDownloads";
import {refreshThemes} from "./engine/registry";
import {refreshPacks} from "./steam";

export type ResourceProgress={percent:number;message:string};
const ensureMedia=callable<[string],{success:boolean;error?:string}>("ensure_frame_media");
const key=(id:string)=>id==="old-beta-big-picture"?"old-big-picture":id;
const ready=new Set<string>();
const readyListeners=new Set<()=>void>();
const subscribeReady=(fn:()=>void)=>{readyListeners.add(fn);return()=>{readyListeners.delete(fn);};};
const pending=new Map<string,{promise:Promise<void>;progress:ResourceProgress;listeners:Set<(p:ResourceProgress)=>void>}>();
export const themeResourcesReady=(id:string)=>ready.has(key(id));
export function useThemeResourcesReady(id:string){return useSyncExternalStore(subscribeReady,()=>themeResourcesReady(id),()=>false);}
export function invalidateThemeResources(id:string){if(ready.delete(key(id)))readyListeners.forEach(fn=>fn());}

/** Hub downloads and first-open recovery share one preparation operation. */
export async function prepareThemeResources(id:string,onProgress?:(p:ResourceProgress)=>void):Promise<void>{
 id=key(id);
 if(ready.has(id))return;
 let task=pending.get(id);
 if(!task){
  task={promise:Promise.resolve(),progress:{percent:85,message:"Downloading theme media…"},listeners:new Set()};
  pending.set(id,task);
  const current=task;
  const report=(progress:ResourceProgress)=>{current.progress=progress;current.listeners.forEach(fn=>fn(progress));};
  current.promise=(async()=>{
   const media=await ensureMedia(id);
   if(!media.success)throw new Error(media.error||"Could not download theme media.");
   report({percent:92,message:"Downloading theme audio…"});
   if(!await ensureThemeAudio(id,{notifyResources:false,quiet:true}))throw new Error("Could not download theme audio. Please retry.");
   report({percent:98,message:"Preparing theme…"});
   await Promise.all([refreshThemes(),refreshPacks()]);
   ready.add(id);
   readyListeners.forEach(fn=>fn());
  })().finally(()=>pending.delete(id));
 }
 if(onProgress){task.listeners.add(onProgress);onProgress(task.progress);}
 try{await task.promise;}finally{if(onProgress)task.listeners.delete(onProgress);}
}
