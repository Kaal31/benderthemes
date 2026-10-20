import {useEffect,useState} from 'react';
/** Opening Home already completes user selection, then real focus returns replay it. */
export function useSwitchResume(appids:number[]){
 const [generation,setGeneration]=useState(1);
 const ids=appids.join(',');
 useEffect(()=>{
  let away=false;
  const leave=()=>{away=true;};
  const resume=()=>{if(away){away=false;setGeneration(n=>n+1);}};
  const visible=()=>{if(document.hidden)leave();else resume();};
  const simulate=()=>setGeneration(n=>n+1);
  window.addEventListener('blur',leave);window.addEventListener('focus',resume);
  document.addEventListener('visibilitychange',visible);window.addEventListener('dht:switch-return-to-home',simulate);
  const api=(globalThis as {SteamClient?:{System?:{UI?:{RegisterForFocusChangeEvents?:(cb:(event:{focusedApp?:{appid?:number}})=>void)=>{unregister?:()=>void}}}}}).SteamClient?.System?.UI;
  const known=new Set(ids.split(',').map(Number));
  const registration=api?.RegisterForFocusChangeEvents?.(event=>{const appid=event.focusedApp?.appid;if(appid!==undefined&&known.has(appid))leave();else resume();});
  return()=>{window.removeEventListener('blur',leave);window.removeEventListener('focus',resume);document.removeEventListener('visibilitychange',visible);window.removeEventListener('dht:switch-return-to-home',simulate);registration?.unregister?.();};
 },[ids]);
 return generation;
}
