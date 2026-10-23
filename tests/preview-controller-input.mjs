import assert from 'node:assert/strict';
import {build} from 'esbuild';
const code=await build({entryPoints:['preview/controllerInput.ts'],bundle:true,format:'esm',platform:'node',write:false});
const {createPreviewPadPoller}=await import('data:text/javascript;base64,'+Buffer.from(code.outputFiles[0].text).toString('base64'));
const pad=index=>({index,id:'Controller '+index,connected:true,axes:[0,0,0,0],buttons:Array.from({length:17},()=>({pressed:false}))});
const idle=pad(0),active=pad(1),events=[];
const sample=createPreviewPadPoller((button,repeat)=>events.push(['down',button,repeat]),button=>events.push(['up',button]));
idle.axes=[0,0,-1,-1]; // legacy right-stick / trigger axis resting values
sample([idle,active],0);assert.deepEqual(events,[]);
active.axes=[-.9,0,0,0];active.buttons[15].pressed=true;sample([idle,active],10);assert.deepEqual(events,[['down',12,false]],'Digital right must win over opposite stick and another controller');
sample([idle,active],200);assert.equal(events.length,1,'A short tap must not repeat');
sample([idle,active],331);assert.deepEqual(events.at(-1),['down',12,true]);
active.buttons[15].pressed=false;sample([idle,active],350);assert.deepEqual(events.at(-1),['up',12]);sample([idle,active],370);assert.equal(events.length,3,'Releasing D-pad must not undo the move via a displaced stick');
active.buttons[15].pressed=true;sample([idle,active],390);assert.deepEqual(events.at(-1),['down',12,false],'A second short tap is a fresh press, not a held repeat');
active.buttons[15].pressed=false;active.axes=[0,0,0,0];sample([idle,active],410);active.axes=[.8,0,0,0];sample([idle,active],430);assert.deepEqual(events.at(-1),['down',12,false],'Neutral rearms analog navigation');
sample([],450);assert.deepEqual(events.at(-1),['up',12]);sample([active],460);assert.deepEqual(events.at(-1),['down',12,false],'Reconnect starts with a fresh edge');
console.log('PASS: D-pad priority, neutral rearm, immediate press/release edges, per-button repeat timing, multiple controllers and disconnect cleanup.');
