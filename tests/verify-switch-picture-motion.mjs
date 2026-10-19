import assert from 'node:assert/strict';import {build} from 'esbuild';import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchSceneTree} from './src/themes/SwitchSceneTree';import {SwitchPicture} from './src/themes/SwitchPicture';import {SwitchTexture} from './src/themes/SwitchTexture';
const source='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="2" height="2"><path fill="red" d="M0 0h1v1H0z"/><path fill="blue" d="M1 0h1v1H1z"/><path fill="lime" d="M0 1h1v1H0z"/><path fill="white" d="M1 1h1v1H1z"/></svg>');
const picture={source,texture:'test',material:'test',uv:[0,0,1,0,0,1,1,1],wrapS:0,wrapT:0,transform:[0,0,90,1,1]},list=[{name:'picture',parent:null,slot:'picture',type:'pic1',position:[0,0,0],scale:[1,1],rotation:[0,0,0],size:[40,40],origin:0,alpha:255,influenceAlpha:false,visible:true}],animations=[{pane:'picture',event:'rest',frames:60,loop:true,tracks:[{property:22,interpolation:'hermite',keys:[{frame:0,value:0,slope:3},{frame:60,value:180,slope:3}]}]}];
const root=createRoot(document.getElementById('root'));window.paint=(enabled,translation=false,hostImage=false)=>root.render(<SwitchSceneTree list={list} animations={translation?[{...animations[0],tracks:[{property:23,interpolation:'hermite',keys:[{frame:0,value:0,slope:1/60},{frame:60,value:1,slope:1/60}]}]}]:animations} enabled={enabled} effects={{}} dark events={['rest']} render={()=>({content:hostImage?<SwitchTexture enabled><img src={source}/></SwitchTexture>:<SwitchPicture picture={translation?{...picture,transform:[0,0,0,1,1]}:picture}/>})}/>);window.paint(true);`;
const bundle=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const p=await browser.newPage();await p.setContent('<div id="root"></div>');await p.addScriptTag({content:bundle.outputFiles[0].text});await p.locator('canvas[data-nx-picture-status="ready"]').waitFor({state:'attached'});
 const at=async time=>{await p.locator('[data-scene-pane="picture"]').evaluate((el,time)=>el.getAnimations().forEach(a=>{a.pause();a.currentTime=time;}),time);await p.waitForTimeout(60);return p.locator('canvas').evaluate(el=>[...el.getContext('2d').getImageData(0,0,1,1).data]);};
 assert.deepEqual(await at(0),[255,0,0,255],'An animated texture angle replaces its static SRT angle');
 assert.deepEqual(await at(500),[0,0,255,255],'Texture rotation must repaint sampled pixels, independently of pane rotation');
 assert.equal(await p.locator('[data-scene-pane="picture"]').evaluate(el=>getComputedStyle(el).transform),'matrix(1, 0, 0, 1, 0, 0)');
 await p.evaluate(()=>window.paint(false));await p.waitForTimeout(60);
 assert.deepEqual(await p.locator('canvas').evaluate(el=>[...el.getContext('2d').getImageData(0,0,1,1).data]),[255,255,255,255],'Disabling animation paints the terminal UV pose');
 await p.evaluate(()=>window.paint(true,true));await p.waitForTimeout(50);assert.deepEqual(await at(0),[255,0,0,255]);assert.deepEqual(await at(500),[0,0,255,255],'UV translation must shift the sampled source without moving the pane');
 await p.evaluate(()=>window.paint(true,false,true));await p.locator('[data-nx-uv-texture] canvas[data-nx-picture-status="ready"]').waitFor();
 assert.deepEqual(await at(0),[255,0,0,255]);assert.deepEqual(await at(500),[0,0,255,255],'Host avatar images must use the same rotation sampler');
 await p.evaluate(()=>window.paint(false,false,true));await p.waitForTimeout(60);assert.deepEqual(await p.locator('canvas').evaluate(el=>[...el.getContext('2d').getImageData(0,0,1,1).data]),[255,255,255,255],'Disabled host UV animation must retain terminal sampled paint');
 console.log('PASS native picture UV animation: sampled rotation, static replacement, independent pane transform and terminal still pose');
}finally{await browser.close();}
