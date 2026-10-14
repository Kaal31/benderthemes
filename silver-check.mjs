import {build} from 'esbuild';
import assert from 'node:assert/strict';
import {writeFileSync} from 'node:fs';
const compiled=await build({entryPoints:['src/themes/silverWheel.ts','src/themes/silverPad.ts'],bundle:true,write:false,format:'esm',outdir:'out/silver-tests'});
const modules=await Promise.all(compiled.outputFiles.map(f=>import('data:text/javascript;base64,'+Buffer.from(f.text).toString('base64'))));
const {advanceWheel}=modules.find(m=>m.advanceWheel);const {subscribeSilverPad,stopSilverPad}=modules.find(m=>m.subscribeSilverPad);
function circle(direction){let state={angle:null,remainder:0},steps=0;for(let i=0;i<=361;i++){let a=i*Math.PI/180*direction;const r=advanceWheel(state,.8*Math.cos(a),.8*Math.sin(a));state=r.state;steps+=r.steps;}return steps;}
assert.equal(circle(1),12);assert.equal(circle(-1),-12);
assert.deepEqual(advanceWheel({angle:1,remainder:.3},0,0),{state:{angle:null,remainder:0},steps:0});
let cb,unregistered=0,modes=[],analog=[];
globalThis.SteamClient={Input:{RegisterForControllerAnalogInputMessages:f=>(cb=f,{unregister:()=>unregistered++}),EnableControllerAnalogInputMessages:v=>analog.push(v),SetKeyboardActionset:v=>modes.push(v)}};
let n=0;const stop=subscribeSilverPad(d=>n+=d);for(let i=0;i<=90;i++){let a=i*Math.PI/180;cb(0,48,true,.8*Math.cos(a),-.8*Math.sin(a));}assert.equal(n,3);stop();stopSilverPad();assert.equal(unregistered,1);assert.deepEqual(modes,[true,false]);assert.deepEqual(analog,[true,false]);
console.log('PASS: clockwise/counterclockwise, dead zone, native pad events and cleanup');
const preview=await build({entryPoints:['preview/main.tsx'],plugins:[{name:'background-media-paths',setup(b){b.onResolve({filter:/[\/]backgroundMedia$/},()=>({path:process.cwd()+'/src/backgroundMedia.ts'}));b.onResolve({filter:/[\/]BackgroundMedia$/},()=>({path:process.cwd()+'/src/BackgroundMedia.tsx'}));}}],bundle:true,write:false,format:'iife',jsx:'automatic',minify:true,alias:{'@decky/ui':'./preview/stubs/ui.tsx','@decky/api':'./preview/stubs/api.ts'},define:{'process.env.NODE_ENV':'"production"'}});
writeFileSync('preview/silver.html','<!doctype html><html><head><meta charset="utf-8"><style>body{margin:0}</style></head><body><div id="root"></div><script>window.__themePreview="silver";window.__isThemePreview=true;</script><script>'+preview.outputFiles[0].text.replace(/<\/script/g,'<\\/script')+'</script></body></html>');
