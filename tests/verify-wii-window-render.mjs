import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
const bundle=await build({stdin:{contents:'export {WiiGpuScene} from "./src/themes/WiiLayoutGpu";',resolveDir:process.cwd()},bundle:true,write:false,format:'iife',globalName:'WiiWindowTest'});
const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.setContent('<style>body{margin:0}</style><canvas/>');await page.addScriptTag({content:bundle.outputFiles[0].text});
 await page.evaluate(()=>{
  const colors=['#383838','#ff0000','#00ff00','#0000ff','#ffff00','#ff00ff','#00ffff','#ff8000','#ffffff'],assets={};
  colors.forEach((color,i)=>{const c=document.createElement('canvas');c.width=c.height=8;const g=c.getContext('2d');g.fillStyle=color;g.fillRect(0,0,8,8);assets['test/t'+i]={url:c.toDataURL(),width:8,height:8}});
  const material=colors.map((_,i)=>({name:'material'+i,textures:[i],complex:false}));
  const pane={name:'window',kind:'wnd1',parent:0,visible:true,inheritAlpha:false,origin:4,alpha:1,position:[0,0,0],rotation:[0,0,0],scale:[1,1],size:[200,120],material:0,colors:Array.from({length:4},()=>[255,255,255,255]),window:{contentMaterial:0,inflation:[0,0,0,0],frames:Array.from({length:8},(_,i)=>({material:i+1,flip:0}))}};
  const parent={...pane,name:'parent',kind:'pan1',parent:-1,alpha:.25,material:undefined,window:undefined};
  const data={assets,layouts:[{id:'fixture',area:'test',size:[608,456],textures:colors.map((_,i)=>'t'+i+'.tpl'),materials:material,panes:[parent,pane]}],animations:[{id:'resize',tracks:[{pane:'window',type:'RLPA',target:8,index:0,material:false,interpolation:'step',keys:[[0,200],[1,300]]}]}]};
  window.gpu=new WiiWindowTest.WiiGpuScene(document.querySelector('canvas'),data,false);window.actor=gpu.actor('fixture');
  window.sample=(x,y)=>{gpu.render();const gl=gpu.renderer.getContext(),px=new Uint8Array(4);gl.readPixels(Math.floor((x/608+.5)*1280),Math.floor((y/456+.5)*800),1,1,gl.RGBA,gl.UNSIGNED_BYTE,px);return [...px];};
 });
 await page.waitForFunction(()=>[...gpu.textures.values()].every(t=>t.image?.complete));
 const result=await page.evaluate(()=>({center:sample(0,0),corners:[[-96,56],[96,56],[-96,-56],[96,-56]].map(([x,y])=>sample(x,y)),edges:[[-96,0],[96,0],[0,56],[0,-56]].map(([x,y])=>sample(x,y)),meshes:actor.meshes.filter(Boolean).length}));
 assert.deepEqual(result.center,[56,56,56,255]);
 assert.deepEqual(result.corners,[[255,0,0,255],[0,255,0,255],[0,0,255,255],[255,255,0,255]]);
 assert.deepEqual(result.edges,[[255,0,255,255],[0,255,255,255],[255,128,0,255],[255,255,255,255]]);assert.equal(result.meshes,9);
 const resized=await page.evaluate(()=>{actor.apply('resize',1);actor.commit();return {old:sample(-96,56),corner:sample(-146,56),width:actor.pose[1].size[0]}});
 assert.equal(resized.width,300);assert.deepEqual(resized.old,[255,128,0,255]);assert.deepEqual(resized.corner,[255,0,0,255]);
 mkdirSync('out/importer-gap-fixes',{recursive:true});await page.screenshot({path:'out/importer-gap-fixes/wii-multiframe-window.png'});
 const inherited=await page.evaluate(()=>{actor.pose[1].inheritAlpha=true;actor.commit();return sample(-146,56)});
 assert(Math.abs(inherited[0]-64)<=1);assert.equal(inherited[1],0);
 await page.evaluate(()=>gpu.dispose());assert.deepEqual(errors,[]);
 console.log('PASS WebGL pixels for independent Wii content/eight border materials and animated resize');
}finally{await browser.close();}
