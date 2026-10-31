import {setStyle} from "../engine/themeStyles";
import {useEffect,useRef,useState} from 'react';
import {useHome} from '../common';
import {ThemeRoot} from '../input';
import {useReportFocus} from '../focus';
import {useDownloads} from '../downloads';
import {framePageRequest} from '../engine/framePages';
import {playSound} from '../steam';
import {openSteam} from '../library';
import {updateSettings} from '../settings';
import {themeAudioBands,themeAudioWaveform,themeAudioSpectrum} from '../themeAudio';
import {markup,styles} from './gameamp/markup';
import {createGameAmpPages} from './gameamp/pages';
import {mountGameAmp} from './gameamp/runtime';

/** Native host-owned UI. No iframe, postMessage, remote script, or frame sandbox. */
export function GameAmpHome(){
 const api=useHome(),downloads=useDownloads(),host=useRef<HTMLDivElement>(null),runtime=useRef<any>(null);
 const live=useRef({api,downloads});live.current={api,downloads};
 const [focused,setFocused]=useState<number|null>(null);
 useReportFocus(focused===null?undefined:api.lib.byId.get(focused));
 useEffect(()=>{
  const el=host.current;if(!el)return;
  const root=el.shadowRoot??el.attachShadow({mode:'open'}),doc=el.ownerDocument,W=doc.defaultView!;
  root.innerHTML='<style>'+styles+'</style>'+markup;
  const handlers:Array<()=>void>=[],timeouts=new Set<number>(),intervals=new Set<number>();let disposed=false;
  const scoped:any={getElementById:(id:string)=>root.getElementById(id),querySelector:(s:string)=>root.querySelector(s),querySelectorAll:(s:string)=>root.querySelectorAll(s),createElement:doc.createElement.bind(doc),get activeElement(){return root.activeElement;},body:el};
  scoped.addEventListener=(type:string,fn:any)=>{root.addEventListener(type,fn,true);handlers.push(()=>root.removeEventListener(type,fn,true));};
  const view:any={location:W.location,addEventListener:(type:string,fn:any)=>{const listener=(event:Event)=>{fn(event);if(event.defaultPrevented)event.stopPropagation();};root.addEventListener(type,listener);handlers.push(()=>root.removeEventListener(type,listener));}};
  const size={width:el.clientWidth,height:el.clientHeight};
  const services=async(op:string,args:any={})=>{if(op==='gameampVisualizer'){if(!['bars','waveform'].includes(args.value))throw Error('Unknown visualizer');setStyle('gameamp','visualizerMode',args.value);return {mode:args.value};}return framePageRequest(op,args,live.current.api,live.current.downloads);};
  const emit=(m:any)=>{const a=live.current.api;if(disposed)return;switch(m.type){
   case 'focus':setFocused(m.appid===null?null:a.lib.byId.has(m.appid)?m.appid:null);break;
   case 'launch':{const g=a.lib.byId.get(m.appid);if(g)a.activate(g,()=>a.launch(g));break;}
   case 'details':{const g=a.lib.byId.get(m.appid);if(g)a.details(g);break;}
   case 'sound':playSound(m.name);break;
   case 'save':updateSettings(p=>({frameData:{...p.frameData,gameamp:m.data}}));break;
   case 'open':if(m.place==='options')a.openSettings();else if(m.place==='steamHome')a.showSteamHome();else openSteam(m.place);break;
  }};
  const timers={setTimeout:(fn:any,ms:number)=>{const id=W.setTimeout(()=>{timeouts.delete(id);if(!disposed)fn();},ms);timeouts.add(id);return id;},clearTimeout:(id:number)=>{W.clearTimeout(id);timeouts.delete(id);},setInterval:(fn:any,ms:number)=>{const id=W.setInterval(()=>{if(!disposed)fn();},ms);intervals.add(id);return id;},clearInterval:(id:number)=>{W.clearInterval(id);intervals.delete(id);}};
  const pages=createGameAmpPages(scoped,services,W.location,timers);
  runtime.current=mountGameAmp(scoped,view,pages,services,emit,size,timers);
  const resize=new ResizeObserver(()=>{size.width=el.clientWidth;size.height=el.clientHeight;runtime.current?.resize();});resize.observe(el);
  const meter=W.setInterval(()=>runtime.current?.audio(themeAudioBands(),themeAudioWaveform(),themeAudioSpectrum()),50);
  runtime.current.state({games:live.current.api.lib.games,settings:live.current.api.settings,saved:live.current.api.settings.frameData.gameamp,capabilities:{pages:1}});
  return()=>{disposed=true;resize.disconnect();W.clearInterval(meter);runtime.current?.destroy();runtime.current=null;handlers.forEach(f=>f());timeouts.forEach(id=>W.clearTimeout(id));intervals.forEach(id=>W.clearInterval(id));root.replaceChildren();};
 },[]);
 useEffect(()=>{runtime.current?.state({games:api.lib.games,settings:api.settings,saved:api.settings.frameData.gameamp,capabilities:{pages:1}});},[api.lib,api.settings]);
 return <ThemeRoot onInput={p=>{if(api.busy)return false;runtime.current?.input(p.btn);return true;}} hints={{a:'Select',x:'Game details',y:'Theme options'}}><div ref={host} data-native-theme="gameamp" style={{position:'absolute',inset:0,overflow:'hidden',background:'#080d15'}}/></ThemeRoot>;
}
