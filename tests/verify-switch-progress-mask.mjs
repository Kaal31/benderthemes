import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import {switchProgressMask} from './src/themes/switchProgressMask';
const base={name:'mask',slot:'mask',type:'pic1',parent:null,position:[0,0,0],rotation:[0,0,0],scale:[1,1],size:[40,12],origin:0,alpha:255,visible:true};
window.sample=async(effect)=>{const style=switchProgressMask(base,effect,{...base,position:[-20,0,0],origin:1});const image=new Image();image.src=style.maskImage.slice(5,-2);await image.decode();const canvas=document.createElement('canvas');canvas.width=40;canvas.height=12;const context=canvas.getContext('2d');context.drawImage(image,0,0);return [...context.getImageData(0,0,40,12).data];};`;
const result=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage();await page.addScriptTag({content:result.outputFiles[0].text});
 const effect=color=>({radius:6,corners:Object.fromEntries(['ColorTL','ColorTR','ColorBL','ColorBR'].map(name=>[name,color]))});
 const red=await page.evaluate(effect=>window.sample(effect),effect([255,0,0,255])),blue=await page.evaluate(effect=>window.sample(effect),effect([0,0,255,255]));
 assert.deepEqual(red,blue,'Native alpha-only mask writes must ignore vertex RGB');assert.equal(red[3],0,'Rounded mask corner must clip fill');assert.equal(red[(6*40+20)*4+3],255);
 const half=await page.evaluate(effect=>window.sample(effect),effect([255,0,0,128]));assert.equal(half[(6*40+20)*4+3],128,'Mask vertex alpha must affect fill coverage');
 const hidden=await page.evaluate(effect=>window.sample({...effect,Visible:false}),effect([255,255,255,255]));assert(hidden.every((v,i)=>i%4!==3||v===0));
 console.log('PASS native progress mask: RGB preservation, rounded clipping, vertex alpha and hidden-mask coverage');
}finally{await browser.close();}
