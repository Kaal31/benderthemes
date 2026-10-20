import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchSceneTree} from './src/themes/SwitchSceneTree';
const root=createRoot(document.getElementById('root')),base={position:[0,0,0],rotation:[0,0,0],scale:[1,1],origin:0,visible:true,alpha:255,influenceAlpha:false};
const list=[{...base,name:'Root',slot:'Root',parent:null,size:[0,0],type:'pan1'},{...base,name:'Shadow',slot:'Shadow',parent:'Root',size:[64,40],type:'pic1',effect:{shadow:16,radius:6,shadowFunction:4,shadowDraw:true,shadowColor:[255,0,0,128],shadowOpacity:1}}];
const animations=[{pane:'Shadow',event:'enter',frames:60,tracks:[{property:25,interpolation:'hermite',keys:[{frame:0,value:0,slope:1/30},{frame:60,value:2,slope:1/30}]}]}];
window.paint=(enabled=true)=>root.render(<div style={{position:'absolute',left:100,top:100,width:0,height:0}}><SwitchSceneTree {...{list,animations,enabled}} effects={{}} dark events={['enter']} render={()=>({})}/></div>);window.paint();`;
const b=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:220,height:220}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent('<style>body{margin:0;background:black}</style><div id="root"></div>');await page.addScriptTag({content:b.outputFiles[0].text});await page.locator('canvas').waitFor();
 const transfer=page.locator('feFuncA'),pane=page.locator('[data-scene-pane="Shadow"]');
 const sample=async time=>{await pane.evaluate((el,time)=>el.getAnimations().forEach(a=>{a.pause();a.currentTime=time;}),time);await page.waitForFunction(value=>Math.abs(Number(document.querySelector('feFuncA').getAttribute('slope'))-value)<.001,time/500);const png=await page.screenshot({clip:{x:134,y:100,width:1,height:1}});return page.evaluate(async data=>{const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+data)).blob()),c=document.createElement('canvas');c.width=c.height=1;const context=c.getContext('2d');context.drawImage(bitmap,0,0);return [...context.getImageData(0,0,1,1).data];},png.toString('base64'));};
 // At 2.5px beyond this straight edge the verified native function is
 // .5 - 2.5/(2*16) = .421875. Source alpha 128 gives 54, then 108 at volume 2.
 const zero=await sample(0),one=await sample(500),two=await sample(1000);assert.equal(zero[0],0);assert(Math.abs(one[0]-54)<=1,JSON.stringify(one));assert(Math.abs(two[0]-108)<=1,JSON.stringify(two));assert(Math.abs(two[0]-2*one[0])<3,'Volume above one must amplify each shadow texel before clamping');
 await page.evaluate(()=>window.paint(false));await page.waitForTimeout(50);assert.equal(await transfer.getAttribute('slope'),'2','Disabled motion must paint the terminal shadow strength');assert.equal(await pane.evaluate(el=>el.getAnimations().length),0);assert.deepEqual(errors,[]);
 console.log('PASS shadow volume: animated 0/1/2 strengths, actual composited pixels, amplification before clamping and disabled terminal pose');
}finally{await browser.close();}
