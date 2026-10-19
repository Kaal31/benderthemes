import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchEmptyLibrary} from './src/themes/SwitchEmptyLibrary';import {SwitchNativeContext} from './src/themes/SwitchWidgetTree';
const root=createRoot(document.getElementById('root'));window.paint=(native)=>root.render(<SwitchNativeContext.Provider value={native}><div style={{position:'absolute',left:0,top:0,width:800,height:720}}><SwitchEmptyLibrary effects={{}} animations={[]} modern dark enabled={false} scale={1}/></div></SwitchNativeContext.Provider>);window.paint();`;
const result=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage();await page.setContent('<div id="root"></div>');await page.addScriptTag({content:result.outputFiles[0].text});const pane=page.locator('[data-scene-slot="RdtBase:T_Blank"]');await pane.waitFor();
 assert.equal(await pane.isVisible(),true,'Host empty state must reveal the default hidden label');
 const box=await pane.boundingBox();assert.equal(box.y,148);assert.equal(box.height,30);assert.equal(box.width,1030);
 await page.evaluate(()=>window.paint({nativePanes:{RdtBase:{T_Blank:{Size:{X:200,Y:45},Position:{X:30,Y:100}}}},nativeMaterials:{RdtBase:{T_Blank:{white:[0,255,0,255]}}}}));
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-scene-slot="RdtBase:T_Blank"]')).width==='200px');
 const patched=await pane.boundingBox();assert.equal(patched.x,330);assert.equal(patched.y,237.5);assert.equal(patched.height,45);
 await page.evaluate(()=>window.paint({nativePanes:{RdtBase:{T_Blank:{Visible:false}}}}));assert.equal(await pane.isVisible(),false,'Authored visibility must retain precedence over host state');
 console.log('PASS native empty-library label: host visibility, exact bounds, authored position/size/material and explicit hiding');
}finally{await browser.close();}
