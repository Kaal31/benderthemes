import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchMenuSurface} from './src/themes/SwitchMenuSurface';import {SwitchNativeContext} from './src/themes/SwitchWidgetTree';
const native={nativePanes:{DBaseNml:{P_Base:{radius:30,shadowDraw:true,shadow:8,shadowFunction:4,shadowColor:[255,0,0,255],palette:{white:[0,0,0,0]}}}},nativeMaterials:{DBaseNml:{P_Base:{white:[0,255,0,255]}}}},shared={effects:{},animations:[],modern:true,dark:true,enabled:false};
const root=createRoot(document.getElementById('root'));window.clicks=0;window.paint=(width=770)=>root.render(<SwitchNativeContext.Provider value={native}><div style={{position:'absolute',inset:0}}><SwitchMenuSurface {...shared}><div className="dht-menu--switch" style={{position:'absolute',left:'50%',top:'50%',transform:'translate(-50%,-50%)',width,height:600,overflow:'auto',pointerEvents:'auto'}}><button onClick={()=>window.clicks++}>Activate</button><div style={{height:1200}}>Content</div></div></SwitchMenuSurface></div></SwitchNativeContext.Provider>);window.paint();`;
const result=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent('<div id="root"></div>');await page.addScriptTag({content:result.outputFiles[0].text});
 const panel=page.locator('.dht-menu--switch'),surface=page.locator('[data-native-menu-surface]');await surface.waitFor();
 assert.deepEqual(await surface.boundingBox(),await panel.boundingBox(),'Native surface must align with the actual host panel');
 const shadow=surface.locator('[data-nx-shadow-function="4"] canvas');await shadow.waitFor();
 assert.equal(await shadow.evaluate(el=>el.width),786,'Native shadow expands beyond panel bounds');
 const pixel=await page.screenshot({clip:{x:600,y:500,width:1,height:1}});
 const rgb=await page.evaluate(async base64=>{const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();const canvas=document.createElement('canvas');canvas.width=canvas.height=1;const context=canvas.getContext('2d');context.drawImage(image,0,0);return [...context.getImageData(0,0,1,1).data];},pixel.toString('base64'));assert.deepEqual(rgb,[0,255,0,255],'Native menu material must actually tint the painted surface');
 await page.getByRole('button' ,{name:'Activate'}).click();assert.equal(await page.evaluate(()=>window.clicks),1);
 const before=await surface.boundingBox();await panel.evaluate(el=>el.scrollTop=200);assert.deepEqual(await surface.boundingBox(),before,'Native surface and shadow must not scroll with menu content');
 await page.evaluate(()=>window.paint(650));await page.waitForFunction(()=>document.querySelector('[data-native-menu-surface]')?.clientWidth===650);assert.deepEqual(await surface.boundingBox(),await panel.boundingBox());assert.deepEqual(errors,[]);
 console.log('PASS native menu surface: alignment, expanded analytic shadow, material binding, independent scrolling, resizing and input');
}finally{await browser.close();}
