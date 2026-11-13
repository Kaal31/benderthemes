import {build} from 'esbuild';import assert from 'node:assert/strict';import {mkdirSync,writeFileSync} from 'node:fs';import {resolve} from 'node:path';import {pathToFileURL} from 'node:url';
mkdirSync('out/bug-regressions',{recursive:true});globalThis.__settings={enabled:true};globalThis.__applied=[];globalThis.__refresh=()=>Promise.resolve();globalThis.__presets=[{id:'wiiu'},{id:'vita'},{id:'unavailable'}];
const result=await build({entryPoints:['src/randomTheme.ts'],bundle:true,write:false,platform:'node',format:'esm',plugins:[{name:'fixtures',setup(b){b.onResolve({filter:/^\.\/(settings|presets)$/},args=>({path:args.path,namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},args=>({contents:args.path.endsWith('settings')?'export const getSettings=()=>globalThis.__settings;':'export const refreshPresets=()=>globalThis.__refresh();export const currentPresetId=()=>"wiiu";export const switchPresets=()=>globalThis.__presets.filter(p=>p.id!=="unavailable");export const applyPreset=p=>globalThis.__applied.push(p.id);'}))}}]});
const file=resolve('out/bug-regressions/random-theme.mjs');writeFileSync(file,result.outputFiles[0].text);const {chooseRandomTheme}=await import(pathToFileURL(file));
await chooseRandomTheme();assert.deepEqual(globalThis.__applied,['vita']);
globalThis.__settings.randomThemePool=['wiiu','unavailable'];await chooseRandomTheme();assert.deepEqual(globalThis.__applied,['vita','wiiu']);
globalThis.__settings.enabled=false;await chooseRandomTheme();assert.equal(globalThis.__applied.length,2);
globalThis.__settings.enabled=true;await chooseRandomTheme(()=>false);assert.equal(globalThis.__applied.length,2);
console.log('PASS random themes use installed presets, avoid repeats, honour the selected pool and stop when disabled/disposed');
