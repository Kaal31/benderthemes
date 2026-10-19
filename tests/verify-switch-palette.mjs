import assert from 'node:assert/strict';
import {build} from 'esbuild';
const built=await build({stdin:{contents:`export {resolvePalette} from './src/themes/SwitchMaterial';export {SWITCH_PALETTE} from './src/themes/switchPalette';export {sampleTrack,animationFrame} from './src/themes/switchConversion';`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'esm',platform:'node'});
const {resolvePalette,SWITCH_PALETTE,sampleTrack,animationFrame}=await import('data:text/javascript;base64,'+Buffer.from(built.outputFiles[0].text).toString('base64'));
const effect={white:[9,8,7,6],palette:{white:[9,1,4,2],black:[2,4,1,9]}};
for(let state=0;state<4;state++)for(const dark of [false,true]){
 const resolved=resolvePalette(effect,dark,state);
 assert.deepEqual(resolved.white,SWITCH_PALETTE[effect.palette.white[state]][dark?1:0]);
 assert.deepEqual(resolved.black,SWITCH_PALETTE[effect.palette.black[state]][dark?1:0]);
}
assert.deepEqual(resolvePalette({...effect,paletteState:2},true).white,SWITCH_PALETTE[4][1]);
assert.deepEqual(resolvePalette({...effect,palette:{white:[9,0,0,0]}},true,1).white,effect.white,'Zero preserves the register; it must not fall back to the normal state');
const track={property:18,interpolation:'hermite',keys:[{frame:0,value:1,slope:0},{frame:45,value:1,slope:0},{frame:45,value:2,slope:0}]};
assert.equal(sampleTrack(track,1),1,'A one-frame animation must not jump to an out-of-duration key');
assert.equal(animationFrame({tracks:[{property:16,interpolation:'step',keys:[{frame:0,value:0,slope:0}]}]},0).transform,undefined,'Alpha-only animation must preserve the pane geometry');
console.log('PASS four palette states, C_Id, zero-register preservation, short controller timelines and alpha composition');
