import assert from 'node:assert/strict';
import {build} from 'esbuild';
const fixtures={
 '@decky/api':`export const callable=name=>async id=>{globalThis.calls.push([name,id]);return name==='console_artwork_install'&&globalThis.failArt?{success:false,error:'offline'}:{success:true}};export const toaster={toast:value=>globalThis.notices.push(value)};`,
 './settings':`export const getSettings=()=>({originalConsoleArtwork:globalThis.original});`,
 './marketplaceState':`export const resourcesChangedOnClose=()=>globalThis.calls.push(['refresh artwork']);`,
 './audioDownloads':`export const ensureThemeAudio=async()=>true;`,
 './engine/registry':`export const refreshThemes=async()=>{};`,
 './steam':`export const refreshPacks=async()=>{};`
};
const result=await build({entryPoints:['src/themeResources.ts'],bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'preparation-fixtures',setup(b){
 b.onResolve({filter:/.*/},args=>args.path in fixtures?{path:args.path,namespace:'fixture'}:null);
 b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:fixtures[args.path]}));
}}]});
const moduleUrl='data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64');
for(const [index,original,failArt] of [[0,undefined,false],[1,false,false],[2,true,true]]){
 globalThis.calls=[];globalThis.notices=[];globalThis.original=original;globalThis.failArt=failArt;
 const {prepareThemeResources}=await import(moduleUrl+'#'+index);
 await prepareThemeResources('xbox');
 assert.equal(calls.some(([name])=>name==='console_artwork_install'),original!==false);
 assert.equal(calls.some(([name])=>name==='refresh artwork'),original!==false&&!failArt);
 assert.equal(notices.length,failArt?1:0);
}
console.log('PASS Xbox stock artwork is prepared by default, explicit fallback stays selected, failed stock download warns and retains fallback');
