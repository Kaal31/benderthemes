import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchText} from './src/themes/SwitchText';
const metrics={fontSize:[20,20],alignment:0,lineAlignment:0,characterSpace:2,lineSpace:0};
const paint=(text,enabled=true)=>createRoot(document.getElementById('root')).render(<div style={{position:'absolute',left:10,top:10,width:100,height:30}}><SwitchText {...{text,enabled,metrics}} marquee/></div>);
window.paint=paint;paint('A long game title that must scroll',window.__enabled!==false);`;
const b=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const run=async(reduced=false)=>{const p=await browser.newPage({reducedMotion:reduced?'reduce':'no-preference'});await p.setContent('<div id="root"></div>');await p.addScriptTag({content:b.outputFiles[0].text});await p.locator('[data-nx-text-ink]').waitFor();await p.waitForTimeout(100);return p;};
 const page=await run(),ink=page.locator('[data-nx-text-ink]'),viewport=page.locator('[data-nx-text-viewport]');
 assert.equal(await viewport.evaluate(el=>getComputedStyle(el).overflow),'hidden');
 const result=await ink.evaluate(el=>{const animations=el.getAnimations();const a=animations[0];a.pause();a.currentTime=0;const start=el.getBoundingClientRect().x;a.currentTime=a.effect.getTiming().duration-1;return {count:animations.length,start,end:el.getBoundingClientRect().x,width:el.scrollWidth};});
 assert.equal(result.count,1);assert(result.start-result.end>result.width-102,'The complete overflowing title must become reachable');
 const reduced=await run(true);assert.equal(await reduced.locator('[data-nx-text-ink]').evaluate(el=>el.getAnimations().length),0,'Reduced motion must not scroll');
 const disabled=await browser.newPage();await disabled.setContent('<div id="root"></div>');await disabled.evaluate(()=>window.__enabled=false);await disabled.addScriptTag({content:b.outputFiles[0].text});await disabled.locator('[data-nx-text-ink]').waitFor();assert.equal(await disabled.locator('[data-nx-text-ink]').evaluate(el=>el.getAnimations().length),0);
 console.log('PASS bounded title marquee: full text access, clipping, reduced motion and disabled animation');
}finally{await browser.close();}
