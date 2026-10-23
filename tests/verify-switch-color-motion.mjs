import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';

const entry=`import React from 'react';import {createRoot} from 'react-dom/client';
import {SwitchMaterial} from './src/themes/SwitchMaterial';
import {SwitchSceneTree} from './src/themes/SwitchSceneTree';import {SwitchGameMotion} from './src/themes/SwitchGameMotion';
const color=(property,value)=>({property,interpolation:'hermite',keys:[{frame:0,value,slope:0},{frame:12,value,slope:0}]});
const node={name:'P_Color',parent:null,type:'pic1',position:[0,0,0],rotation:[0,0,0],scale:[1,1],size:[100,100],alpha:255,visible:true,influenceAlpha:false,origin:0,slot:'P_Color',effect:{white:[255,255,255,255]}};
const rootMotion=[{source:'active.bflan',pane:'RootPane',event:'active',frames:12,loop:false,tracks:[color(6,.75),color(7,.75),color(1,123)]}];
createRoot(document.getElementById('root')).render(<>
<div style={{position:'absolute',left:100,top:100}}><SwitchSceneTree list={[node]} effects={{}} animations={[{pane:'P_Color',event:'active',frames:12,loop:false,tracks:[color(32,255),color(33,0),color(34,0),color(36,255),color(37,0),color(38,0),color(40,255),color(41,0),color(42,0),color(44,255),color(45,0),color(46,0)]}]} dark enabled={false} events={['active']} render={()=>({style:{background:'white'}})}/></div>
<div style={{position:'absolute',left:300,top:100}}><SwitchSceneTree list={[{...node,slot:'P_Register'}]} effects={{}} animations={[{pane:'P_Register',event:'active',frames:12,loop:false,tracks:[color(68,0),color(69,0),color(70,255)]}]} dark enabled={false} events={['active']} render={()=>({style:{background:'white'}})}/></div>
<div id="rounded" style={{position:'absolute',left:200,top:250}}><SwitchSceneTree list={[{...node,slot:'P_Rounded',effect:{radius:50,Scale:{X:3,Y:1}}}]} effects={{}} animations={[]} dark enabled={false} events={[]} render={()=>({style:{background:'red'}})}/></div>
<div id="alpha-register" style={{position:'absolute',left:600,top:50,width:100,height:100}}><SwitchMaterial effect={{black:[255,255,255,255],white:[255,255,255,255]}}><span style={{display:'block',width:'100%',height:'100%',background:'rgba(255,255,255,0)'}}/></SwitchMaterial></div>
<div id="game" style={{position:'absolute',left:400,top:350,width:0,height:0}}><SwitchGameMotion animations={[]} effects={{}} nativePanes={{RdtBtnIconGame:{RootPane:{Scale:{X:.46875,Y:.46875}}}}} nativeAnimations={{RdtBtnIconGame:rootMotion}} modern dark active enabled={false} unitX={.46875} unitY={.46875} focus={null} touch={false} running={false}><img alt="test artwork" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='256' height='256'%3E%3Crect width='256' height='256' fill='red'/%3E%3C/svg%3E" style={{width:'100%',height:'100%'}}/></SwitchGameMotion></div>
</>);`;
const compiled=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',alias:{'@decky/ui':'./preview/stubs/ui.tsx','@decky/api':'./preview/stubs/api.ts'},define:{'process.env.NODE_ENV':'"production"'}});
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:800,height:600}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setContent('<div id="root"></div>');await page.addScriptTag({content:compiled.outputFiles[0].text});await page.waitForTimeout(350);
 const pixel=async slot=>{const png=await page.locator('[data-scene-slot="'+slot+'"]').screenshot();return page.evaluate(async bytes=>{const b=await createImageBitmap(await(await fetch('data:image/png;base64,'+bytes)).blob()),c=document.createElement('canvas');c.width=b.width;c.height=b.height;const ctx=c.getContext('2d');ctx.drawImage(b,0,0);return [...ctx.getImageData(c.width/2,c.height/2,1,1).data];},png.toString('base64'));};
 const rounded=await page.locator('[data-scene-slot="P_Rounded"]').screenshot();const corner=await page.evaluate(async bytes=>{const b=await createImageBitmap(await(await fetch('data:image/png;base64,'+bytes)).blob()),c=document.createElement('canvas');c.width=b.width;c.height=b.height;const ctx=c.getContext('2d');ctx.drawImage(b,0,0);return [...ctx.getImageData(50,5,1,1).data];},rounded.toString('base64'));assert(corner[0]>245&&corner[1]<10,'A stretched rounded quad must paint a pill with circular corners, not an ellipse');
 const alphaPng=await page.locator('#alpha-register').screenshot();const alpha=await page.evaluate(async bytes=>{const b=await createImageBitmap(await(await fetch('data:image/png;base64,'+bytes)).blob()),c=document.createElement('canvas');c.width=c.height=100;const ctx=c.getContext('2d');ctx.drawImage(b,0,0);return [...ctx.getImageData(50,50,1,1).data];},alphaPng.toString('base64'));assert.deepEqual(alpha,[255,255,255,255],'A transparent placeholder must honor the material alpha offset');
 const red=await pixel('P_Color'),blue=await pixel('P_Register');assert(red[0]>245&&red[1]<10&&red[2]<10,'Vertex color must paint red: '+red);assert(blue[0]<10&&blue[1]<10&&blue[2]>245,'Material white register must paint blue: '+blue);
 const art=await page.getByAltText('test artwork').boundingBox();assert(Math.abs(art.width-192)<1,'Native active root scale must enlarge the static 120px artwork to 192px');assert(Math.abs(art.y+art.height/2-(350-123))<1,'Root translation must not be multiplied by its static root scale');
 assert.equal(await page.locator('[data-scene-pane="N_CardSet"]').evaluate(el=>getComputedStyle(el).display),'none','Digital games must not paint the inactive virtual-card shell');assert.deepEqual(errors,[]);
 console.log('PASS native vertex/material color painting, outer game focus geometry and digital-card runtime visibility');
}finally{await browser.close();}
