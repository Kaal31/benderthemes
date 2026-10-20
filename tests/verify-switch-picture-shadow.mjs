import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchSceneTree} from './src/themes/SwitchSceneTree';
const list=[{name:'glyph',parent:null,slot:'glyph',type:'pic1',position:[0,0,0],scale:[1,1],rotation:[0,0,0],size:[40,40],origin:0,alpha:255,influenceAlpha:false,visible:true}];
createRoot(document.getElementById('root')).render(<div style={{position:'absolute',left:50,top:50,width:0,height:0}}><SwitchSceneTree list={list} effects={{glyph:{shadow:1,shadowColor:[255,0,0,255],shadowDistance:5,shadowAngle:0}}} animations={[]} events={[]} enabled={false} dark render={()=>({alphaMask:true,content:<svg width="40" height="40"><circle cx="20" cy="20" r="8" fill="blue"/></svg>})}/></div>);`;
const bundle=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:100,height:100}});await page.setContent('<body style="margin:0;background:white"><div id="root"></div>');await page.addScriptTag({content:bundle.outputFiles[0].text});await page.locator('circle').waitFor();
 const png=await page.screenshot();const samples=await page.evaluate(async data=>{const image=new Image();image.src='data:image/png;base64,'+data;await image.decode();const c=document.createElement('canvas');c.width=c.height=100;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);return [[72,32],[60,50],[50,50]].map(([x,y])=>[...ctx.getImageData(x,y,1,1).data]);},png.toString('base64'));
 assert.deepEqual(samples[0],[255,255,255,255],'Transparent quad corners must not cast a rectangular shadow');
 assert(samples[1][0]>240&&samples[1][1]<20&&samples[1][2]<20,'The shadow must follow the offset circle silhouette');
 assert.deepEqual(samples[2],[0,0,255,255],'Picture paint must retain its own color');
 console.log('PASS picture shadow follows the alpha silhouette without a rectangular quad outline');
}finally{await browser.close();}
