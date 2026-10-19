import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchServiceScene} from './src/themes/SwitchServiceScene';import {SwitchNativeContext} from './src/themes/SwitchWidgetTree';
const native={nativePanes:{RdtBtnChangeUser:{P_BtnTouch:{Size:{X:181,Y:31}}},RdtIconPromotion:{P_Line:{Size:{X:173,Y:2},Visible:true}},RdtIconDl:{P_Stripe:{Visible:false}}},nativeMaterials:{RdtBtnChangeUser:{T_00:{white:[0,255,0,255]}}},nativeAnimations:{}};
window.activations=0;
const shared={effects:{},animations:[],modern:true,dark:true,enabled:false};
createRoot(document.getElementById('root')).render(<SwitchNativeContext.Provider value={native}><div style={{position:'absolute',left:300,top:100,width:0,height:0}}><SwitchServiceScene {...shared} file="RdtBtnChangeUser" size={[274,34]} label="User options" pressed onActivate={()=>window.activations++}/></div><div style={{position:'absolute',left:300,top:300,width:0,height:0}}><SwitchServiceScene {...shared} file="RdtProgressBarDl" size={[256,28]} progress={25}/></div><div style={{position:'absolute',left:300,top:400,width:0,height:0}}><SwitchServiceScene {...shared} file="RdtIconPromotion" size={[256,56]} label="Install"/></div></SwitchNativeContext.Provider>);`;
const b=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.setContent('<div id="root"></div>');await p.addScriptTag({content:b.outputFiles[0].text});await p.getByRole('button',{name:'User options'}).waitFor();await p.getByRole('button',{name:'User options'}).click({force:true});assert.equal(await p.evaluate(()=>window.activations),1);
 assert.equal(await p.locator('[data-scene-slot="RdtBtnChangeUser:P_BtnTouch"]').evaluate(el=>getComputedStyle(el).width),'181px');
 assert.equal(await p.locator('[data-scene-slot="RdtIconPromotion:P_Line"]').evaluate(el=>getComputedStyle(el).width),'173px');
 assert.equal(await p.locator('[data-scene-slot="RdtProgressBar:P_Progress"]').evaluate(el=>getComputedStyle(el).clipPath),'inset(0px 75% 0px 0px)');
 assert.equal(await p.locator('[data-scene-slot="RdtIconDl:P_Stripe"]').isVisible(),false);
 assert.equal(await p.locator('[data-scene-slot="RdtIconPromotion:T_TimeLimit"]').isVisible(),false,'Host has no Nintendo promotion expiry service');
 assert.deepEqual(errors,[]);console.log('PASS native service scenes: one activation, independent patches, referenced download progress and install labels');
}finally{await browser.close();}
