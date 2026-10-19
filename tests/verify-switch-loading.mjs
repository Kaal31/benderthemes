import assert from 'node:assert/strict';import {build} from 'esbuild';import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchLoading} from './src/themes/SwitchLoading';import {SwitchNativeContext} from './src/themes/SwitchWidgetTree';
const root=createRoot(document.getElementById('root')),native={nativePanes:{Waiticon:{P_Wait:{Size:{X:60,Y:60},palette:{white:[0,0,0,0]}}}},nativeMaterials:{Waiticon:{P_Wait:{white:[255,0,0,255]}}},nativeAnimations:{}};
window.paint=(enabled=true,empty=false)=>root.render(<SwitchNativeContext.Provider value={{...native,animationFiles:empty?['Waiticon_Wait.bflan']:[]}}><div style={{position:'absolute',left:100,top:100,width:0,height:0}}><SwitchLoading effects={{}} animations={[]} modern={false} dark enabled={enabled} magnify={[.5,.5]}/></div></SwitchNativeContext.Provider>);window.paint();`;
const bundle=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.setContent('<div id="root"></div>');await p.addScriptTag({content:bundle.outputFiles[0].text});await p.locator('canvas[data-nx-picture-status="ready"]').waitFor({state:'attached'});
 const pane=p.locator('[data-widget-slot="widget:Waiticon:P_Wait"]'),picture=pane.locator('canvas');
 assert.equal((await pane.boundingBox()).width,30,'Loading instance magnification must compose with the authored picture size');
 const first=await picture.getAttribute('data-nx-picture-uv');await p.waitForTimeout(100);assert.notEqual(await picture.getAttribute('data-nx-picture-uv'),first,'Native Wait texture timeline must repaint');
 await p.evaluate(()=>window.paint(false));await p.waitForTimeout(100);const still=await picture.getAttribute('data-nx-picture-uv');assert.equal(Number(still.split(',')[2]),-362);await p.waitForTimeout(70);assert.equal(await picture.getAttribute('data-nx-picture-uv'),still);
 await p.evaluate(()=>window.paint(true,true));await p.waitForTimeout(100);assert.equal(await pane.evaluate(el=>el.getAnimations().length),0,'An empty authored Wait file removes the default texture loop');assert.equal(await picture.getAttribute('data-nx-picture-uv'),'1,1,0,0,0');
 assert.deepEqual(errors,[]);console.log('PASS native loading: instance magnification, authored geometry/material, rotating texture, still mode and empty-file replacement');
}finally{await browser.close();}
