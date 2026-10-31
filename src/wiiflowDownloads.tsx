import {callable,toaster} from '@decky/api';
import {useEffect,useSyncExternalStore} from 'react';
import {refreshPresets} from './presets';
import {refreshThemes} from './engine/registry';
import {resourcesChangedOnClose} from './marketplaceState';
type Scan={busy:boolean;imported:{id:string;name:string}[];pending:number;errors:string[]};
const scan=callable<[],Scan>('wiiflow_scan_downloads');
let watchers=0,timer:ReturnType<typeof setInterval>|undefined,running=false;
let status='Watching Downloads for completed WiiFlow themes…',noticeUntil=0;
const listeners=new Set<()=>void>();
const publish=(value:string)=>{status=value;listeners.forEach(fn=>fn());};
async function poll(){
 if(running)return;running=true;
 if(status.startsWith('Waiting for'))publish('Checking completed downloads and importing themes…');
 try{
  const result=await scan();
  if(result.imported.length){
   await refreshThemes();await refreshPresets();resourcesChangedOnClose();
   const names=result.imported.map(t=>t.name).join(', ');noticeUntil=Date.now()+15000;
   publish(`Added ${names}. Choose it in Your themes.`);toaster.toast({title:'WiiFlow themes imported',body:names});
  }else if(result.errors.length)publish(result.errors.join(' '));
  else if(result.busy)publish('Importing WiiFlow themes…');
  else if(result.pending)publish('Waiting for the download to finish…');
  else if(Date.now()>noticeUntil)publish('Watching Downloads for completed WiiFlow themes…');
 }catch(e){publish(`Could not scan Downloads: ${String(e)}`);}finally{running=false;}
}
const subscribe=(fn:()=>void)=>{listeners.add(fn);return()=>{listeners.delete(fn);};};
export function useWiiFlowDownloads(active:boolean){
 const value=useSyncExternalStore(subscribe,()=>status,()=>status);
 useEffect(()=>{
  if(!active)return;
  if(watchers++===0){void poll();timer=setInterval(poll,3000);}
  return()=>{if(--watchers===0){clearInterval(timer);timer=undefined;}};
 },[active]);
 return value;
}
export function WiiFlowDownloadsWatcher({active}:{active:boolean}){useWiiFlowDownloads(active);return null;}
