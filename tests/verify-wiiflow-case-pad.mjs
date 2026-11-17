import assert from 'node:assert/strict';
import {build} from 'esbuild';
const b=await build({entryPoints:['src/themes/wiiflowCasePad.ts'],bundle:true,write:false,format:'esm'});
const {subscribeCasePad}=await import('data:text/javascript;base64,'+Buffer.from(b.outputFiles[0].text).toString('base64'));
let receive,clock=0,unregistered=0;const enable=[],action=[],moves=[];
const input={RegisterForControllerAnalogInputMessages(fn){receive=fn;return {unregister(){unregistered++}}},EnableControllerAnalogInputMessages(value){enable.push(value)},SetKeyboardActionset(...args){action.push(args)}};
const stop=subscribeCasePad(input,(...values)=>moves.push(values),()=>clock);
receive(0,47,false,0,0);assert.equal(moves.length,0);
receive(0,48,false,0,0);clock+=20;receive(0,48,false,.2,.1);
assert.equal(moves.length,1);assert.equal(moves[0][0],28);assert(Math.abs(moves[0][1]+.09)<.00001);
clock+=200;receive(0,48,false,-.8,-.8);assert.equal(moves.length,1,'Retouch begins without a jump');
receive(1,48,false,.5,.5);assert.equal(moves.length,1,'Controller changes reset the anchor');
receive(1,48,false,NaN,.4);receive(1,48,false,32000,32000);assert.equal(moves.length,1);
stop();stop();receive(1,48,false,.6,.5);assert.equal(moves.length,1);assert.equal(unregistered,1);assert.deepEqual(enable,[true,false]);assert.deepEqual(action.at(-1),[false,false]);
console.log('PASS right-pad deltas, retouch/controller anchors, invalid input and cleanup');

const animation=await build({entryPoints:['themes/wiiflow-default/nativeAnimation.js'],bundle:true,write:false,format:'esm'});
const {tickCover}=await import('data:text/javascript;base64,'+Buffer.from(animation.outputFiles[0].text).toString('base64'));
const initial={pos:[0,0,0],angle:[0,0,0],scale:[1,1,1]},target={pos:[5,1,2],angle:[0,70,0],scale:[1.2,1.2,1.2]};
const smooth=structuredClone(initial),fast=structuredClone(initial),original=structuredClone(initial);
tickCover(smooth,target,false,60,1);tickCover(original,target,false,60);tickCover(fast,target,false,60,2.7);
assert.deepEqual(smooth,original,'Smooth preserves source animation timing');assert(fast.pos[0]>smooth.pos[0]&&fast.angle[1]>smooth.angle[1]);
for(let n=0;n<500;n++){tickCover(smooth,target,false,60,1);tickCover(fast,target,false,60,2.7)}
assert(Math.abs(smooth.angle[1]-target.angle[1])<.001&&Math.abs(fast.angle[1]-target.angle[1])<.001,'Both speeds settle at the same layout pose');
console.log('PASS source timing retained for Smooth; Fast reaches the same pose sooner');
