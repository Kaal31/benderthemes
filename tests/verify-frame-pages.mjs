import {build} from 'esbuild';
import assert from 'node:assert/strict';
const calls=[];globalThis.__calls=calls;
const stubs={
 '../musicPlayer':`const state={album:null,index:0,playing:false,time:0,duration:60,shuffle:false,repeat:'off',error:''};export const loadMusic=async()=>[{id:'a',name:'Album',tracks:[{id:'t',title:'Track'}]}];export const musicPlayer={state:()=>state,play:(a,i)=>Object.assign(state,{album:a,index:i,playing:true}),toggle:()=>{state.playing=!state.playing;},next(){},prev(){},seekTo:t=>{state.time=t;},setShuffle:v=>{state.shuffle=v;},cycleRepeat(){}};`,
 '@decky/ui':`export const Navigation={NavigateToSteamWeb:u=>globalThis.__calls.push(['checkout',u])};`,
 '@decky/api':`export async function fetchNoCors(){return new Response(new Uint8Array([1,2,3]),{headers:{'content-type':'image/png'}});}`,
 '../activity':`export const readFriends=()=>[{id:'1',name:'Friend',online:true}];`,
 '../downloads':`export const pauseDownload=id=>globalThis.__calls.push(['pause',id]);export const resumeDownload=id=>globalThis.__calls.push(['resume',id]);`,
 '../media':`export const recordingPlan=()=>({streams:[],sequence:true});export const loadScreenshots=async()=>[{appid:10,url:'https://steamloopback.host/shot'}];export const loadVideos=async()=>[{id:'clip1',name:'Clip',appid:10,thumb:'http://127.0.0.1/thumb',duration:20}];`,
 '../store':`export const loadStoreLists=async()=>({featured:[{id:10,name:'Game',price:1999,currency:'USD'}]});export const searchStore=async q=>(globalThis.__calls.push(['search',q]),[]);export const loadStoreDetails=async id=>({id});export const fmtPrice=()=>'$19.99';`,
 '../settings':`let s={animations:true,clock24:false,sounds:true};export const getSettings=()=>s;export const updateSettings=patch=>{Object.assign(s,patch);globalThis.__calls.push(['settings',patch]);};`
};
const result=await build({entryPoints:['src/engine/framePages.ts'],bundle:true,write:false,format:'esm',platform:'node',plugins:[{name:'stub-host',setup(b){b.onResolve({filter:/.*/},a=>a.path in stubs?{path:a.path,namespace:'stub'}:null);b.onLoad({filter:/.*/,namespace:'stub'},a=>({contents:stubs[a.path],loader:'js'}));}}]});
const {framePageRequest:request}=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
const api={playVideo:v=>calls.push(['video',v.id])},downloads={items:[{appid:10}],byApp:new Map([[10,{}]])};
const run=(op,args={})=>request(op,args,api,downloads);
assert.equal((await run('store',{tab:'featured'})).items[0].priceText,'$19.99');
await run('download',{appid:10,action:'pause'});assert.ok(calls.some(c=>c[0]==='pause'&&c[1]===10));
await assert.rejects(()=>run('download',{appid:11,action:'pause'}));await assert.rejects(()=>run('download',{appid:10,action:'remove'}));
await assert.rejects(()=>run('settings',{key:'theme',value:'xbox'}));await assert.rejects(()=>run('settings',{key:'sounds',value:'true'}));
assert.equal((await run('settings',{key:'clock24',value:true})).clock24,true);
await assert.rejects(()=>run('checkout',{appid:'10'}));await assert.rejects(()=>run('store',{tab:'anything'}));await assert.rejects(()=>run('fetch',{url:'https://example.com'}));
await run('store',{tab:'search',query:'a'.repeat(200)});assert.equal(calls.find(c=>c[0]==='search')[1].length,120);
const media=await run('media');assert.match(media.shots[0].url,/^data:image\/png;base64,/);assert.equal(media.videos[0].id,'clip1');assert.equal(media.videos[0].url,undefined);
await run('video',{id:'clip1'});await assert.rejects(()=>run('video',{id:'unknown'}));
console.log('PASS: frame page services, bounded queries, queue validation, settings whitelist, image transfer and video validation');

assert.equal((await run('audioLibrary')).albums[0].tracks[0].title,'Track');await assert.rejects(()=>run('audio',{action:'play',albumId:'a',index:5}));await run('audio',{action:'play',albumId:'a',index:0});assert.equal((await run('audio',{action:'state'})).playing,true);await assert.rejects(()=>run('audio',{action:'seek',time:Infinity}));await assert.rejects(()=>run('audio',{action:'anything'}));console.log('PASS: audio library, valid track playback and invalid audio requests');
