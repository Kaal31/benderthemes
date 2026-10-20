import assert from 'node:assert/strict';
import {build} from 'esbuild';
const b=await build({stdin:{contents:`export {SCENE_MOTION} from './src/themes/switchSceneDefaults';export {SWITCH_RUNTIME_MOTION} from './src/themes/switchRuntimeDefaults';export {composeSwitchAnimations} from './src/themes/switchAnimationFiles';export {paneMotionFrame,motionTimes} from './src/themes/switchConversion';`,resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'esm',platform:'node'});
const {SCENE_MOTION,SWITCH_RUNTIME_MOTION,composeSwitchAnimations,paneMotionFrame,motionTimes}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
const boundary={pane:'test',event:'attention',frames:120,loop:true,tracks:[{property:16,interpolation:'hermite',keys:[{frame:-10,value:0,slope:0},{frame:8,value:0,slope:0},{frame:8,value:240,slope:0},{frame:26,value:58,slope:0},{frame:140,value:0,slope:0}]}]};
const times=motionTimes([boundary]);assert(times.every(t=>t>=0&&t<=120));assert.equal(times[0],0);assert.equal(times.at(-1),120);assert(times.includes(8));assert(times.some(t=>t<8&&t>7.99));assert.equal(paneMotionFrame([boundary],7.9999).opacity,0);assert.equal(paneMotionFrame([boundary],8).opacity,240/255);
assert.deepEqual(motionTimes([{...boundary,frames:1}]),[0,1],'Short tracks cannot leak keys beyond their own playback duration');
const preroll={...boundary,tracks:[{property:16,interpolation:'hermite',keys:[{frame:-10,value:0,slope:0},{frame:10,value:200,slope:0}]}]};assert.equal(paneMotionFrame([preroll],0).opacity,100/255,'A key before playback still shapes interpolation at the start');
for(const profile of ['classic','modern']){
 const dialog=SCENE_MOTION[profile].DBaseNml,shadow=dialog.find(a=>a.pane==='DBaseNml:P_Base'&&a.event==='enter');assert.equal(shadow.tracks[0].property,25);assert.equal(shadow.frames,8);assert(Math.abs(Number(paneMotionFrame([shadow],8)['--dht-nx-shadow-volume'])-.6)<1e-6);assert(dialog.some(a=>a.event==='exit'&&a.frames===24));assert.equal(composeSwitchAnimations(dialog,[],['DBaseNml_In.bflan']).filter(a=>a.event==='enter').length,0);
 const defaults=SWITCH_RUNTIME_MOTION[profile],motion=composeSwitchAnimations(defaults,[],[]).filter(a=>a.pane==='N_Game'&&a.event==='refresh');
 const end=paneMotionFrame(motion,12,{Position:{Y:140}},1,1,true);assert.match(end.transform,/translate\(0px,140px\)/,'Default library refresh must replace the static N_Game Y');assert.equal(end.opacity,1);
 assert.equal(composeSwitchAnimations(defaults,[],['RdtBase_RefreshIn.bflan']).filter(a=>a.event==='refresh').length,0,'An authored empty refresh file must keep the static pane position');
 const initial=paneMotionFrame(motion,0,{Position:{Y:140}},1,1,true);assert.equal(initial.opacity,0);assert.match(initial.transform,/translate\(0px,160px\)/);
}
console.log('PASS measured library refresh: runtime position/alpha, both base profiles and empty-file override');
