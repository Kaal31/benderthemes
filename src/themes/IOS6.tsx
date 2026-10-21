import {useEffect,useRef,useState} from 'react';
import {useHome} from '../common';
import {ThemeRoot,Hints} from '../input';
import {useDownloads} from '../downloads';
import {framePageRequest} from '../engine/framePages';
import {updateSettings} from '../settings';
import {playSound,SoundKind,SOUND_FILES} from '../steam';
import {openSteam,SteamPlace} from '../library';
import {useReportFocus} from '../focus';
import {mountIOS6Native} from './ios6NativeMount';

export function IOS6Home(){
 const api=useHome(),downloads=useDownloads(),host=useRef<HTMLDivElement>(null),runtime=useRef<ReturnType<typeof mountIOS6Native>|undefined>(undefined);
 const latest=useRef({api,downloads});latest.current={api,downloads};
 const [hints,setHints]=useState<Hints>({}),[focus,setFocus]=useState<number|null>(null);
 useReportFocus(focus===null?undefined:api.lib.byId.get(focus));
 const state=()=>{const {api}=latest.current;return {type:'state',games:api.lib.games,settings:{clock24:api.settings.clock24,animations:api.settings.animations},saved:api.settings.frameData.ios6??{},active:!api.busy};};
 useEffect(()=>{if(!host.current)return;let alive=true,lastLaunch=0;const queued:any[]=[];
 const receive=(message:any)=>{if(runtime.current)runtime.current.receive(message);else queued.push(message);};
 const mounted=mountIOS6Native(host.current,m=>{const {api,downloads}=latest.current;switch(m.type){
 case 'ready':receive(state());break;
 case 'pageRequest':void framePageRequest(m.op,m.args,api,downloads).then(data=>{if(alive)receive({type:'pageResult',requestId:m.requestId,data});},()=>{if(alive)receive({type:'pageResult',requestId:m.requestId,error:'Could not load this data. Please try again.'});});break;
 case 'save':case 'savePatch':updateSettings(s=>({frameData:{...s.frameData,ios6:{...((s.frameData.ios6??{}) as object),...m.data}}}));break;
 case 'focus':setFocus(m.appid??null);break;
 case 'hints':setHints({a:m.a,x:m.x,y:m.y,menu:m.menu});break;
 case 'sound':if(m.name in SOUND_FILES)playSound(m.name as SoundKind);break;
 case 'launch':{const g=api.lib.byId.get(m.appid);if(g&&Date.now()-lastLaunch>1500){lastLaunch=Date.now();api.activate(g,()=>api.launch(g));}break;}
 case 'details':{const g=api.lib.byId.get(m.appid);if(g)api.details(g);break;}
 case 'open':if(m.place==='options')api.openSettings();else if(m.place==='steamHome')api.showSteamHome();else openSteam(m.place as SteamPlace);break;
 }});
 runtime.current=mounted;queued.forEach(m=>mounted.receive(m));
 return()=>{alive=false;runtime.current=undefined;mounted.dispose();};},[]);
 useEffect(()=>{runtime.current?.receive(state());},[api.lib,api.settings,api.busy]);
 return <ThemeRoot hints={hints} onInput={p=>{if(p.btn==='menu'||p.btn==='y'){api.openSettings();return true;}runtime.current?.receive({type:'input',btn:p.btn,repeat:p.repeat});return true;}}><div ref={host} data-native-theme="ios6" style={{position:'absolute',inset:0,overflow:'hidden'}}/></ThemeRoot>;
}
