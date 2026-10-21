import {build} from 'esbuild';
import {readFileSync,writeFileSync} from 'node:fs';
const stubs={
 '../common':`export function useHome(){return window.nativeApi;}`,
 '../input':`import React from 'react';export function ThemeRoot({children,onInput}){window.nativeInput=onInput;return <>{children}</>;}`,
 '../focus':`export function useReportFocus(g){window.nativeFocused=g?.appid;}`,
 '../downloads':`export function useDownloads(){return {};}`,
 '../engine/framePages':`export async function framePageRequest(op,args){return window.nativeService(op,args);}`,
 '../steam':`export function playSound(name){window.nativeCalls.push(['sound',name]);}`,
 '../library':`export function openSteam(place){window.nativeCalls.push(['open',place]);}`,
 '../settings':`export function updateSettings(update){const patch=typeof update==='function'?update(window.nativeApi.settings):update;Object.assign(window.nativeApi.settings,patch);}`,
 '../themeAudio':`export function themeAudioBands(){return window.nativeBands||Array(16).fill(0);}`,
};
const result=await build({stdin:{contents:`import React from 'react';import{createRoot}from'react-dom/client';import{GameAmpHome}from'./src/themes/GameAmp';window.nativeRoot=createRoot(document.getElementById('root'));window.mountNative=()=>window.nativeRoot.render(<GameAmpHome/>);window.mountNative();`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'native-preview-services',setup(b){b.onResolve({filter:/.*/},a=>a.importer.endsWith('GameAmp.tsx')&&a.path in stubs?{path:a.path,namespace:'stub'}:null);b.onLoad({filter:/.*/,namespace:'stub'},a=>({contents:stubs[a.path],loader:'tsx',resolveDir:process.cwd()}));}}]});
const setup=`window.nativeCalls=[];const settings={clock24:true,animations:true,sounds:true,sfxVolume:60,musicVolume:40,frameData:{}};window.nativeApi={settings,lib:{games,byId:new Map(games.map(g=>[g.appid,g]))},busy:false,activate:(g,f)=>f(),launch:g=>nativeCalls.push(['launch',g.appid]),details:g=>nativeCalls.push(['details',g.appid]),openSettings:()=>nativeCalls.push(['options']),showSteamHome:()=>nativeCalls.push(['home'])};window.nativeService=async(op,args={})=>{if(op==='settings'){if(args.key)settings[args.key]=args.value;return {...settings};}if(op==='friends')return{items:[{id:'1',name:'Alex',online:true,game:'Portal 2',appid:620}]};if(op==='downloads')return{items:[{appid:620,progress:.45,bytes:450000000,total:1000000000,rate:2000000,paused:false}]};if(op==='download')return{ok:true};if(op==='storeDetails'){const g=games.find(g=>g.appid===args.appid);return{name:g.name,short:'Sample game description',header:g.art.landscape[0],genres:['Adventure'],screenshots:[]};}if(op==='store')return{items:games.map(g=>({id:g.appid,name:g.name,header:g.art.landscape[0],capsule:g.art.hero[0],priceText:'$19.99'}))};return{};};`;
writeFileSync('gameamp-native-preview.html',`<!doctype html><html><head><meta charset="utf-8"><style>html,body,#root{margin:0;width:100%;height:100%;background:#080d15}</style></head><body><div id="root"></div><script>${readFileSync('gameamp-preview-library.js','utf8')}</script><script>${setup}</script><script>${result.outputFiles[0].text.replaceAll('</script','<\\/script')}</script></body></html>`);
console.log('Built native GameAmp React preview (no iframe).');
