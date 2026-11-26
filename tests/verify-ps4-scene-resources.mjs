import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {spawnSync} from 'node:child_process';
import {launch} from './browser.mjs';
const parsed=spawnSync('python',['-c',`import sys,json,xml.etree.ElementTree as E;sys.path.insert(0,'py_modules');from ps4_scene import read_scene
source='<raf><material id="m"><texture file="a.png"/></material><actor id="a" material="m"/><case wait="1"><actor id="a" position="8 0 0" trans_time="4"/></case><case wait="1"><actor id="a" color="1 1 1 0" trans_time="2"/></case><case wait="1"><actor id="a" position="10 0 0" trans_time="2"/></case><case wait="1"/></raf>'
print(json.dumps(read_scene(E.fromstring(source),lambda _: 'image')))`],{encoding:'utf8'});assert.equal(parsed.status,0,parsed.stderr);const imported=JSON.parse(parsed.stdout);
const bundle=await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {Ps4Scene,actorState} from './src/themes/Ps4Scene';window.stateAt=actorState;const root=createRoot(document.getElementById('root'));window.renderScene=(scene)=>root.render(scene?React.createElement(Ps4Scene,{scene,animate:false}):null);`,resolveDir:process.cwd()},bundle:true,write:false,format:'iife',jsx:'automatic',alias:{'@decky/api':'./preview/stubs/api.ts'}});
const browser=await launch();
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));let delayed;
 await page.route('https://delayed.test/image.png',route=>{delayed=route});
 await page.setContent('<div id="root"></div>');await page.addScriptTag({content:bundle.outputFiles[0].text});
 const timeline=await page.evaluate(scene=>[1500,2500].map(time=>stateAt(scene.layers[0],time)),imported);
 assert.deepEqual(timeline.map(s=>s.position[0]),[3,5.5]);assert.deepEqual(timeline.map(s=>s.color[3]),[.75,.25]);
 await page.evaluate(()=>{
  const c=document.createElement('canvas');c.width=c.height=8;c.getContext('2d').fillStyle='#00ff00';c.getContext('2d').fillRect(0,0,8,8);window.fixtureImage=c.toDataURL();
  const state={color:[1,1,1,1],position:[0,0,0],rotation:[0,0,0],scale:[1,1,1]};
  const layer=(id,image)=>({id,image,initial:state,states:[{at:0,state},{at:1000,state}]});
  renderScene({durationMs:1000,span:2,warnings:[],layers:[layer('good',fixtureImage),layer('broken','data:image/png;base64,bad'),layer('late','https://delayed.test/image.png')]});
 });
 await page.waitForFunction(()=>{const c=document.querySelector('canvas');return c?.getContext('2d').getImageData(640,360,1,1).data[1]===255});
 await page.waitForFunction(()=>document.querySelector('canvas').dataset.importIssues.includes('broken'));
 const issues=await page.locator('canvas').getAttribute('data-import-issues');assert(issues.includes('broken'));
 const png=await page.evaluate(()=>fixtureImage.split(',')[1]);await page.evaluate(()=>renderScene(null));await page.waitForFunction(()=>!document.querySelector('canvas'));
 if(delayed)await delayed.fulfill({contentType:'image/png',headers:{'access-control-allow-origin':'*'},body:Buffer.from(png,'base64')}).catch(()=>{});
 await page.evaluate(()=>{
  const c=document.createElement('canvas');c.width=c.height=8;const g=c.getContext('2d');g.fillStyle='rgba(200,100,50,.5)';g.fillRect(0,0,8,8);
  const state={color:[.5,.25,1,1],position:[0,0,0],rotation:[0,0,0],scale:[1,1,1]};
  renderScene({durationMs:1000,span:2,warnings:[],layers:[{id:'alpha',image:c.toDataURL(),initial:state,states:[{at:0,state}]}]});
 });
 await page.waitForFunction(()=>document.querySelector('canvas')?.getContext('2d').getImageData(640,360,1,1).data[3]===128);
 const tint=await page.evaluate(()=>[...document.querySelector('canvas').getContext('2d').getImageData(640,360,1,1).data]);
 assert(tint.every((v,i)=>Math.abs(v-[100,25,50,128][i])<=2),'Tint must multiply RGB and preserve partial alpha: '+tint);
 await page.evaluate(()=>{
  const c=document.createElement('canvas');c.width=128;c.height=256;const g=c.getContext('2d');g.fillStyle='#fff';g.fillRect(0,0,128,256);
  const state={color:[.5,0,0,1],position:[0,0,0],rotation:[0,0,45],scale:[1,1,1]};
  renderScene({durationMs:1000,span:2,warnings:[],layers:[{id:'rotated',image:c.toDataURL(),initial:state,states:[{at:0,state}]}]});
 });
 await page.waitForFunction(()=>document.querySelector('canvas')?.getContext('2d').getImageData(180,40,1,1).data[3]===255);
 const corner=await page.evaluate(()=>[...document.querySelector('canvas').getContext('2d').getImageData(180,40,1,1).data]);
 assert(Math.abs(corner[0]-128)<=1);assert.deepEqual(corner.slice(1),[0,0,255]);
 await page.evaluate(()=>{
  const c=document.createElement('canvas');c.width=c.height=8;const g=c.getContext('2d');g.fillStyle='white';g.fillRect(0,0,8,8);
  const layer=(id,color,x)=>{const state={color,position:[x,0,0],rotation:[0,0,0],scale:[.25,.25,1]};return {id,image:c.toDataURL(),initial:state,states:[{at:0,state}]}};
  renderScene({durationMs:1000,span:2,warnings:[],layers:[layer('red',[.5,0,0,1],-1),layer('blue',[0,0,.5,1],1)]});
 });
 await page.waitForFunction(()=>document.querySelector('canvas')?.getContext('2d').getImageData(280,360,1,1).data[3]===255);
 const pair=await page.evaluate(()=>[280,1000].map(x=>[...document.querySelector('canvas').getContext('2d').getImageData(x,360,1,1).data]));
 assert(pair[0].every((v,i)=>Math.abs(v-[128,0,0,255][i])<=1));assert(pair[1].every((v,i)=>Math.abs(v-[0,0,128,255][i])<=1));
 await page.evaluate(()=>renderScene(null));await page.waitForFunction(()=>!document.querySelector('canvas'));
 assert.equal(await page.locator('filter[id^="dht-image-tint-"]').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS imported PS4 overlapping timelines, valid-layer rendering despite failed/pending images and cleanup');
}finally{await browser.close();}
