import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
import {readFileSync,existsSync} from 'node:fs';
const bundle=await build({entryPoints:['src/themes/switchShadowKernel.ts'],bundle:true,write:false,format:'esm'});
const {switchShadowCurve,switchShadowAlpha}=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
assert.deepEqual(Array.from({length:6},(_,kind)=>switchShadowCurve(.25,kind)),[.5,.75,.25,.4375,.25,.0625]);
for(let kind=0;kind<6;kind++){
 assert.equal(switchShadowAlpha(0,0,64,40,8,6,kind),0);
 assert.equal(switchShadowCurve(-1,kind),0);assert.equal(switchShadowCurve(2,kind),1);
}
const fixture=JSON.parse(readFileSync('tests/fixtures/switch/shadow-function-reference.json'));
assert.equal(switchShadowAlpha(0,0,64,80,8,20,0,true),0,'Rounded shadow must never darken the artwork interior');
assert(switchShadowAlpha(30,38,64,80,8,20,0,true)>0,'Rounded corner lobe must survive inside rectangular pane bounds');
assert.equal(switchShadowAlpha(30,38,64,80,8,20,0),0,'Standalone native shader oracle keeps its rectangular cutoff');
for(const [x,y,values] of fixture.samples)for(let kind=0;kind<6;kind++)assert.equal(Math.round(255*switchShadowAlpha(x+.5-fixture.canvas[0]/2,y+.5-fixture.canvas[1]/2,...fixture.pane,fixture.size,fixture.radius,kind)),values[kind],'Recorded native edge/corner alpha samples must stay exact');
const path='work/switch-base-analysis/shader-analysis/ArchiveShader-00003.bnsh/shadow-function-pixels.json';
if(existsSync(path)){
 const oracle=JSON.parse(readFileSync(path));let count=0,maximum=0;
 for(const frame of oracle.frames)for(let y=0;y<56;y++)for(let x=0;x<80;x++){
  const expected=frame.pixels[(y*80+x)*4+3],actual=Math.round(255*switchShadowAlpha(x+.5-40,y+.5-28,64,40,8,6,frame.fn));
  const error=Math.abs(expected-actual);maximum=Math.max(maximum,error);count++;
  assert(error<=1,`Native shader mismatch: function ${frame.fn}, (${x},${y}), expected ${expected}, actual ${actual}`);
 }
 console.log(`PASS ${count} native shader alpha samples across six functions (max error ${maximum}/255)`);
}else console.log('PASS six analytic shadow curves; optional local native shader oracle unavailable');

const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchShadow} from './src/themes/SwitchShadow';
const root=createRoot(document.getElementById('root'));window.paint=(width=64,disabled=false)=>root.render(<>{Array.from({length:6},(_,fn)=><div key={fn} style={{position:'relative',width,height:40,margin:20}}><SwitchShadow effect={{shadow:8,radius:6,shadowFunction:fn,shadowColor:[255,0,0,255],shadowDraw:!disabled}}/></div>)}</>);window.paint();`;
const built=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage();await page.setContent('<div id="root"></div>');await page.addScriptTag({content:built.outputFiles[0].text});await page.waitForFunction(()=>document.querySelector('canvas')?.width===80);
 const frames=await page.locator('canvas').evaluateAll(els=>els.map(el=>[...el.getContext('2d').getImageData(0,0,el.width,el.height).data]));
 if(existsSync(path)){
  const oracle=JSON.parse(readFileSync(path));
  for(const frame of oracle.frames)for(let i=3;i<frame.pixels.length;i+=4)assert.equal(frames[frame.fn][i],frame.pixels[i],`Mounted native shadow alpha differs for function ${frame.fn}`);
 }
 await page.evaluate(()=>window.paint(80));await page.waitForFunction(()=>document.querySelector('canvas')?.width===96);
 await page.evaluate(()=>window.paint(80,true));await page.waitForFunction(()=>document.querySelectorAll('canvas').length===0);
 console.log('PASS mounted shadow canvas: native alpha, size changes and disabled-pass cleanup');
}finally{await browser.close();}
