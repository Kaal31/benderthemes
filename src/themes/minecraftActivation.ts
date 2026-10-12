import {RefObject,useEffect,useRef} from "react";
import {Press} from "../input";

export const MINECRAFT_SWIPE_MS=420;
export function useMinecraftActivation(enabled:boolean,motion:boolean,busy:boolean,home:RefObject<HTMLDivElement|null>){
 const doc=()=>home.current?.ownerDocument??document;
 const timer=useRef<ReturnType<typeof setTimeout>|null>(null),replaying=useRef(false);
 const clear=()=>{if(timer.current!==null)clearTimeout(timer.current);timer.current=null;home.current?.removeAttribute('data-swiping');};
 const canWait=()=>{
  const canvas=doc().querySelector<HTMLCanvasElement>('.mc-editor-player canvas')??doc().querySelector<HTMLCanvasElement>('.mc-avatar-scene canvas');
  const fullScreen=doc().querySelector('.dht-launch,.dht-themed-media');
  return enabled&&motion&&!fullScreen&&!matchMedia('(prefers-reduced-motion: reduce)').matches&&!!canvas&&getComputedStyle(canvas).display!=='none';
 };
 const activate=(run:()=>void)=>{
  if(timer.current!==null)return;
  window.dispatchEvent(new Event('dht-minecraft-strike'));
  home.current?.setAttribute('data-swiping','true');
  timer.current=setTimeout(()=>{clear();run();},MINECRAFT_SWIPE_MS+30);
 };
 useEffect(()=>{clear();return clear;},[enabled,motion,busy]);
 useEffect(()=>{
  const click=(event:MouseEvent)=>{
   if(replaying.current||!canWait())return;
   const target=(event.target as Element|null)?.nodeType===1?(event.target as Element).closest<HTMLElement>('.mc-home button,.dht-menu--minecraft .dht-menu-item'):null;
   if(!target||target.matches(':disabled'))return;
   event.preventDefault();event.stopImmediatePropagation();
   activate(()=>{if(!target.isConnected)return;replaying.current=true;try{const replay=new MouseEvent('click',{bubbles:true,cancelable:true});Object.assign(replay,{minecraftAfterSwipe:true});target.dispatchEvent(replay);}finally{replaying.current=false;}});
  };
  const owner=doc();owner.addEventListener('click',click,true);return()=>owner.removeEventListener('click',click,true);
 },[enabled,motion,busy]);
 return (press:Press,run:()=>boolean)=>{
  if(timer.current!==null){if(press.btn==='b'){clear();}else if(press.btn==='l2'||press.btn==='r2'){clear();return run();}return true;}
  if(!['a','x','y','menu'].includes(press.btn))return run();
  if(canWait()){if(!press.repeat)activate(run);return true;}
  if(press.btn==='a'&&!busy)window.dispatchEvent(new Event('dht-minecraft-strike'));
  return run();
 };
}
