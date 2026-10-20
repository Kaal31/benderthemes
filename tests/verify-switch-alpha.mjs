import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchSceneTree} from './src/themes/SwitchSceneTree';
const n=(name,parent,x,alpha,inherit)=>({name,parent,slot:name,type:'pan1',position:[x,0,0],scale:[1,1],rotation:[0,0,0],size:[40,40],origin:0,alpha,influenceAlpha:inherit,visible:true});
const list=[n('root',null,0,255,false),n('fade','root',-80,255,true),n('independent','fade',0,255,false),n('inherited','fade',50,255,true),n('visible','root',80,255,true)];
const animations=[{pane:'fade',event:'active',frames:60,loop:false,tracks:[{property:16,interpolation:'hermite',keys:[{frame:0,value:0,slope:255/60},{frame:60,value:255,slope:255/60}]}]}];
createRoot(document.getElementById('root')).render(<div style={{position:'absolute',left:200,top:100,width:0,height:0}}><SwitchSceneTree {...{list,animations}} effects={{}} events={['active']} enabled dark render={n=>({content:n.name==='independent'||n.name==='inherited'||n.name==='visible'?<div style={{width:'100%',height:'100%',background:'red'}}/>:null})}/></div>);`;
const b=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:400,height:200}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent('<div id="root"></div>');await page.addScriptTag({content:b.outputFiles[0].text});
 await page.locator('[data-scene-pane="independent"]').waitFor();
 const at=async time=>page.locator('[data-scene-pane="fade"]').evaluate((el,t)=>el.getAnimations().forEach(a=>{a.pause();a.currentTime=t}),time);
 const alpha=name=>page.locator('[data-scene-pane="'+name+'"] > [data-scene-paint]').evaluate(el=>Number(getComputedStyle(el).opacity));
 for(const time of [0,500,1000]){await at(time);assert.equal(await alpha('independent'),1,'Opt-out child must retain its own alpha at every parent animation pose');assert(Math.abs(await alpha('inherited')-time/1000)<.01,'Inherited alpha must interpolate continuously');assert.equal(await alpha('visible'),1,'Sibling alpha must remain independent');}
 assert.deepEqual(errors,[]);console.log('PASS native alpha: opt-out, inherited animated opacity, midpoint interpolation and independent siblings');
}finally{await browser.close();}
