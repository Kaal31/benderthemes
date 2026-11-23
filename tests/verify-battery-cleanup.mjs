import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {transform} from 'esbuild';
// Run the actual hook with a minimal effect harness to test pending API races.
const source=readFileSync('src/steam.ts','utf8');
const hook=source.slice(source.indexOf('export function useBattery()'),source.indexOf('\nlet previewUser:'));
globalThis.__batteryEffects=[];globalThis.__batteryUpdates=[];
const {code}=await transform(`const previewBattery=null;const useState=()=>[null,value=>globalThis.__batteryUpdates.push(value)];const useEffect=effect=>globalThis.__batteryEffects.push(effect);${hook}`,{loader:'ts',format:'esm'});
const {useBattery}=await import('data:text/javascript;base64,'+Buffer.from(code).toString('base64'));
const mount=()=>{useBattery();return globalThis.__batteryEffects.pop()()};
const settle=()=>new Promise(resolve=>setImmediate(resolve));
const originalNavigator=Object.getOwnPropertyDescriptor(globalThis,'navigator');
const originalSteam=Object.getOwnPropertyDescriptor(globalThis,'SteamClient');
try{
 globalThis.SteamClient={};
 const battery=new EventTarget();battery.level=.5;battery.charging=false;
 const subscriptions=new Map();
 const add=battery.addEventListener.bind(battery),remove=battery.removeEventListener.bind(battery);
 battery.addEventListener=(name,fn)=>{subscriptions.set(name,fn);add(name,fn)};
 battery.removeEventListener=(name,fn)=>{assert.equal(subscriptions.get(name),fn,'Cleanup removes the exact subscribed callback');subscriptions.delete(name);remove(name,fn)};
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{getBattery:()=>Promise.resolve(battery)}});
 for(let i=0;i<3;i++){
  const cleanup=mount();await settle();assert.equal(subscriptions.size,2);
  battery.level=.8;battery.dispatchEvent(new Event('levelchange'));assert.deepEqual(globalThis.__batteryUpdates.at(-1),{level:.8,charging:false});
  cleanup();assert.equal(subscriptions.size,0);const count=globalThis.__batteryUpdates.length;
  battery.dispatchEvent(new Event('chargingchange'));assert.equal(globalThis.__batteryUpdates.length,count);
 }
 let resolveBattery;globalThis.navigator.getBattery=()=>new Promise(resolve=>resolveBattery=resolve);
 const cleanup=mount();cleanup();const count=globalThis.__batteryUpdates.length;resolveBattery(battery);await settle();
 assert.equal(subscriptions.size,0,'Unmount before API resolution must not attach listeners');assert.equal(globalThis.__batteryUpdates.length,count);
 globalThis.navigator.getBattery=()=>Promise.reject(Error('Permission denied'));mount()();await settle();
 let callback,unregistered=0,requested=0;
 globalThis.navigator.getBattery=()=>{requested++;return Promise.resolve(battery)};
 globalThis.SteamClient={System:{RegisterForBatteryStateChanges(fn){callback=fn;return {unregister(){unregistered++}}}}};
 const stop=mount();callback({bHasBattery:true,flLevel:.3,eACState:2});assert.deepEqual(globalThis.__batteryUpdates.at(-1),{level:.3,charging:true});
 stop();assert.equal(unregistered,1);assert.equal(requested,0);const before=globalThis.__batteryUpdates.length;callback({flLevel:.2});assert.equal(globalThis.__batteryUpdates.length,before);
 console.log('PASS battery listener removal, repeated mounts, late API resolution, rejected API and Steam subscription cleanup');
}finally{
 if(originalNavigator)Object.defineProperty(globalThis,'navigator',originalNavigator);else delete globalThis.navigator;
 if(originalSteam)Object.defineProperty(globalThis,'SteamClient',originalSteam);else delete globalThis.SteamClient;
 delete globalThis.__batteryEffects;delete globalThis.__batteryUpdates;
}
