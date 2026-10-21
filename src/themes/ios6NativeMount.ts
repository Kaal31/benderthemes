import { ios6Css, ios6Markup, runIOS6Native } from './ios6NativeRuntime';

/** A trusted bundled UI mounted in the host DOM, with scoped styles and lifecycle. */
export function mountIOS6Native(host: HTMLElement, send: (message: any) => void) {
  const root=host.shadowRoot??host.attachShadow({mode:'open'});
  const style=document.createElement('style');style.textContent=ios6Css;
  const body=document.createElement('div');body.className='ios6-body';body.style.cssText='position:absolute;inset:0;overflow:hidden';body.innerHTML=ios6Markup;root.replaceChildren(style,body);
  const events=new EventTarget(),timers=new Set<number>(),intervals=new Set<number>(),observers:MutationObserver[]=[];
  let disposed=false;
  const parent=Object.assign(new EventTarget(),{postMessage:(message:any)=>{if(!disposed)send(message);}});
  const receive=(message:any)=>{if(!disposed){const event=new MessageEvent('message',{data:{dht:1,...message}});Object.defineProperty(event,'source',{value:parent});events.dispatchEvent(event);}};
  const win:any={addEventListener:events.addEventListener.bind(events),removeEventListener:events.removeEventListener.bind(events),dispatchEvent:events.dispatchEvent.bind(events),matchMedia:window.matchMedia.bind(window)};
  const scopedDocument:any={body,createElement:document.createElement.bind(document),createComment:document.createComment.bind(document),getElementById:(id:string)=>root.getElementById(id),querySelector:root.querySelector.bind(root),querySelectorAll:root.querySelectorAll.bind(root),addEventListener:body.addEventListener.bind(body),removeEventListener:body.removeEventListener.bind(body)};
  const timeout=(fn:any,ms:number)=>{const id=window.setTimeout(()=>{timers.delete(id);if(!disposed)fn();},ms);timers.add(id);return id;};
  const interval=(fn:any,ms:number)=>{const id=window.setInterval(()=>{if(!disposed)fn();},ms);intervals.add(id);return id;};
  const env:any={document:scopedDocument,window:win,parent,setTimeout:timeout,clearTimeout:(id:number)=>{clearTimeout(id);timers.delete(id);},setInterval:interval,clearInterval:(id:number)=>{clearInterval(id);intervals.delete(id);},MutationObserver:class extends MutationObserver{constructor(fn:MutationCallback){super(fn);observers.push(this);}},location:window.location};
  Object.defineProperties(env,{innerWidth:{get:()=>host.clientWidth||1280},innerHeight:{get:()=>host.clientHeight||720}});
  // Resize reads are live rather than captured at mount.
  const resize=()=>events.dispatchEvent(new Event('resize'));
  const ro=new ResizeObserver(resize);ro.observe(host);
  runIOS6Native(env);
  body.addEventListener('keydown',e=>{const copy=new KeyboardEvent('keydown',{key:e.key,cancelable:true});Object.defineProperty(copy,'target',{value:e.target});events.dispatchEvent(copy);if(copy.defaultPrevented){e.preventDefault();e.stopPropagation();}});
  return {receive,root,dispose(){disposed=true;win.BlueGlassVideo?.close();body.querySelectorAll('audio,video').forEach((n:any)=>{n.pause();n.removeAttribute('src');n.load();});timers.forEach(clearTimeout);intervals.forEach(clearInterval);observers.forEach(o=>o.disconnect());ro.disconnect();root.replaceChildren();}};
}
