import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchStatusBadge} from './src/themes/SwitchStatusBadge';import {SwitchNativeContext} from './src/themes/SwitchWidgetTree';
const plain={nativePanes:{},nativeAnimations:{}},native={animationFiles:['RdtIconNewFrd_Attention.bflan'],nativePanes:{IconError:{P_Base:{Size:{X:24,Y:24},palette:{white:[0,0,0,0],borderColor:[0,0]}}},RdtIconNewFrd:{P_Mark:{Visible:false},P_Mark_00:{palette:{white:[0,0,0,0]}}}},nativeMaterials:{IconError:{P_Base:{white:[0,255,0,255]}},RdtIconNewFrd:{P_Mark_00:{white:[255,0,0,255]}}},nativeAnimations:{RdtIconNewFrd:[{pane:'P_Mark_00',event:'attention',frames:1,loop:false,tracks:[{property:16,keys:[{frame:0,value:255,slope:0}]}]}]}};
const shared={size:[18,18],effects:{},animations:[],modern:true,dark:true,enabled:false},root=createRoot(document.getElementById('root'));window.paint=(shown=true,animated=false)=>root.render(<SwitchNativeContext.Provider value={animated?plain:native}>{shown&&<><div style={{position:'absolute',left:100,top:100}}><SwitchStatusBadge {...shared} enabled={animated} file='IconError'/></div><div style={{position:'absolute',left:200,top:100}}><SwitchStatusBadge {...shared} enabled={animated} file='RdtIconNewFrd'/></div></>}</SwitchNativeContext.Provider>);window.paint();`;
const built=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:400,height:240}}),errors=[];page.on('pageerror',e=>{errors.push(e.message);console.error(e.message);});await page.setContent('<div id="root"></div>');await page.addScriptTag({content:built.outputFiles[0].text});
 const error=page.locator('[data-native-status-badge="IconError"]'),notification=page.locator('[data-native-status-badge="RdtIconNewFrd"]');await error.waitFor({state:'attached'});
 const base=await error.locator('[data-scene-pane="P_Base"]').boundingBox(),stem=await error.locator('[data-scene-pane="P_Error_00"]').boundingBox(),dot=await error.locator('[data-scene-pane="P_Error_01"]').boundingBox();
 assert.deepEqual(base,{x:88,y:88,width:24,height:24});assert.deepEqual(stem,{x:99,y:95,width:2,height:6});assert.deepEqual(dot,{x:99,y:103,width:2,height:2});
 assert.equal(await notification.locator('[data-scene-pane="P_Mark"]').isVisible(),false);
 assert.equal(await notification.locator('[data-scene-pane="P_Mark_00"] > [data-scene-paint]').evaluate(el=>getComputedStyle(el).opacity),'1','Authored native animation must reveal the alternate notification mark');
 const pixel=await page.screenshot({clip:{x:199,y:99,width:1,height:1}});
 const rgb=await page.evaluate(async base64=>{const image=new Image();image.src='data:image/png;base64,'+base64;await image.decode();const c=document.createElement('canvas');c.width=c.height=1;const ctx=c.getContext('2d');ctx.drawImage(image,0,0);return [...ctx.getImageData(0,0,1,1).data];},pixel.toString('base64'));assert.deepEqual(rgb,[255,0,0,255],'The imported material must color the painted notification mark');
 await page.evaluate(()=>window.paint(true,true));
 const mark=notification.locator('[data-scene-pane="P_Mark_00"]');await page.waitForFunction(()=>document.querySelector('[data-scene-slot="RdtIconNewFrd:P_Mark_00"]')?.getAnimations().some(a=>a.effect.getTiming().iterations===Infinity));
 const sample=async time=>{await mark.evaluate((el,time)=>{for(const animation of el.getAnimations()){animation.pause();animation.currentTime=time;}},time);await page.waitForTimeout(25);return mark.evaluate(el=>({width:parseFloat(getComputedStyle(el).width),alpha:parseFloat(getComputedStyle(el.querySelector(':scope > [data-scene-paint]')).opacity)}));};
 const start=await sample(0),pulse=await sample(300),end=await sample(1800);assert.equal(start.width,12);assert.equal(start.alpha,0);assert(pulse.width>25&&pulse.alpha>0);assert.equal(end.alpha,0);assert.equal(end.width,38);
 await page.evaluate(()=>window.paint(false));await page.waitForFunction(()=>!document.querySelector('[data-native-status-badge]'));assert.deepEqual(errors,[]);
 console.log('PASS native status badges: independent error geometry, notification variants, material pixels, native attention pulse and service cleanup');
}finally{await browser.close();}
