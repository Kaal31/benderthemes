import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {launch} from './browser.mjs';
const bundle=await build({stdin:{contents:'export {RafRenderer} from "./src/ps3/rafRender";',resolveDir:process.cwd()},bundle:true,write:false,format:'iife',globalName:'PS3Test'});
const browser=await launch();
try{
 const page=await browser.newPage();await page.setContent('<canvas width="32" height="32"></canvas>');
 await page.addScriptTag({content:bundle.outputFiles[0].text});
 const result=await page.evaluate(async()=>{
  let resolve,aborted=false,notifications=0,uploads=0;
  window.fetch=(_url,options)=>{options.signal.addEventListener('abort',()=>{aborted=true});return new Promise(r=>resolve=r)};
  const canvas=document.querySelector('canvas'),gl=canvas.getContext('webgl2');
  const original=gl.texImage2D.bind(gl);gl.texImage2D=(...args)=>{uploads++;return original(...args)};
  const issues=[],renderer=new PS3Test.RafRenderer(canvas,{textures:{missing:{url:null},truncated:{data:'AA==',format:'argb',width:2,height:2},late:{bin:'late.bin',format:'argb',width:1,height:1}},meshes:{},actors:[],models:{},materials:{},cameras:[],lights:[],script:null},()=>notifications++,'',m=>issues.push(m));
  const before=uploads;renderer.dispose();
  resolve({ok:true,arrayBuffer:()=>Promise.resolve(new Uint8Array([255,1,2,3]).buffer)});
  await new Promise(r=>setTimeout(r,30));
  return {issues,aborted,notifications,before,after:uploads,textures:renderer.textures.size};
 });
 assert(result.aborted);assert.equal(result.notifications,0);assert.equal(result.before,result.after);assert.equal(result.textures,0);
 assert(result.issues.some(s=>s.includes('missing')));
 assert(result.issues.some(s=>s.includes('truncated')));
 console.log('PASS PS3 missing-resource diagnostics and no late GPU uploads/callbacks after disposal');
}finally{await browser.close();}
