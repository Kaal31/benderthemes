import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
const source=(await readFile(new URL('../src/themeScreensavers.ts',import.meta.url),'utf8')).replace(/^import .*;$/gm,'');
let settings={enabled:true,theme:'xbox',themeScreensavers:{}}, timer,home=true, active=false;
const values={screensaver_current_id:'steam-bouncinglogo',system_idle_screensaver_ac_sec:300,system_idle_screensaver_battery_sec:120};
const listeners=new Set(), exports=[];
const store={clientSettings:values,GetSetting:key=>[values[key],async value=>{values[key]=value;}]};
const rpc={ForceScreensaver:async ({enabled})=>{active=enabled;},GetActiveState:async()=>({Body:()=>({active:()=>active})}),GetLocalScreensavers:async()=>({Body:()=>({screensavers:()=>[{id:()=> 'uioverride-themehub-active'}]})})};
globalThis.__saverTest={
 getSettings:()=>settings,updateSettings:patch=>{settings={...settings,...(typeof patch==='function'?patch(settings):patch)};listeners.forEach(f=>f());},
 onSettingsChange:f=>{listeners.add(f);return()=>listeners.delete(f);},settingsLoaded:()=>true,
 findModuleExports:(needle)=>needle.includes('Settings')?{store}:{rpc},
 callable:()=>async (media,options)=>{exports.push({media,options});return{};},
 openFilePicker:async()=>null,logInfo:()=>{},steamDocuments:()=>[{querySelector:()=>home?{}:null}],
 setInterval:f=>{timer=f;return 1;},clearInterval:()=>{}
};
const prelude='const useSyncExternalStore=()=>{};const {getSettings,updateSettings,onSettingsChange,settingsLoaded,findModuleExports,callable,openFilePicker,logInfo,steamDocuments,setInterval,clearInterval}=globalThis.__saverTest;';
const {code}=await transform(prelude+source,{loader:'ts',format:'esm'});
const mod=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const flush=async()=>{await new Promise(r=>setTimeout(r,15));};
const tick=async()=>{await timer();await flush();};
const stop=mod.startThemeScreensavers();await flush();
settings.screensaversDisabled=true;await tick();
assert.equal(values.system_idle_screensaver_ac_sec,0);assert.equal(values.system_idle_screensaver_battery_sec,0);
assert.equal(settings.screensaverSteamBackup.system_idle_screensaver_ac_sec,300);
await tick();assert.equal(settings.screensaverSteamBackup.system_idle_screensaver_ac_sec,300,'repeated disable retains original delay');
settings.screensaversDisabled=false;await tick();
assert.equal(values.system_idle_screensaver_ac_sec,300);assert.equal(values.system_idle_screensaver_battery_sec,120);
const media='a'.repeat(64)+'.gif';
mod.updateSaver({mode:'custom',media:[media]});await flush();await tick();
assert.equal(values.screensaver_current_id,'uioverride-themehub-active');
assert.deepEqual(exports.at(-1).media,[media]);
settings.theme='ps3';await tick();
assert.equal(values.screensaver_current_id,'steam-bouncinglogo','theme without custom media restores user choice');
assert.equal(mod.saverOptions().media.length,0,'playlists are theme dependent');
mod.updateSaver({mode:'disabled'});await flush();await tick();assert.equal(values.system_idle_screensaver_ac_sec,0);
home=false;await tick();assert.equal(values.system_idle_screensaver_ac_sec,300,'per-theme disable ends outside themed home');
settings.screensaversDisabled=true;await tick();
values.system_idle_screensaver_ac_sec=60;stop();await flush();
assert.equal(values.system_idle_screensaver_ac_sec,60,'unload preserves manual Steam setting changes');
assert.equal(values.system_idle_screensaver_battery_sec,120,'unload restores managed settings');
assert.equal(listeners.size,0);
settings.screensaversDisabled=false;
settings.screensaverSteamBackup={screensaver_current_id:'steam-bouncinglogo',system_idle_screensaver_ac_sec:300,system_idle_screensaver_battery_sec:120};
values.screensaver_current_id='uioverride-themehub-active';values.system_idle_screensaver_ac_sec=0;values.system_idle_screensaver_battery_sec=0;
const stopRecovery=mod.startThemeScreensavers();await flush();
assert.equal(values.system_idle_screensaver_ac_sec,300,'recover persisted backup after restart');
assert.equal(values.screensaver_current_id,'steam-bouncinglogo');
stopRecovery();await flush();
console.log('PASS themed screensavers: global override, original values, per-theme media, theme switch, native fallback, home scope and unload restoration.');
