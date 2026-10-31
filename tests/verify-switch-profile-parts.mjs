import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchProfile} from './src/themes/SwitchProfile';import {SwitchNativeContext} from './src/themes/SwitchWidgetTree';
const atlas=document.createElement('canvas');atlas.width=1;atlas.height=10;const ctx=atlas.getContext('2d'),pixels=ctx.createImageData(1,10);for(let i=0;i<10;i++)pixels.data.set([255,255,255,20*(i+1)],i*4);ctx.putImageData(pixels,0,0);
const picture={source:atlas.toDataURL(),texture:'number-atlas',material:'P_GTNum_00',uv:[0,0,1,0,0,.1,1,.1],transform:[0,0,0,1,1],wrapS:0,wrapT:4};
const native={nativePanes:{GTNumM:{RootPane:{Position:{X:999,Y:999}},P_GTNum_00:{Size:{X:12,Y:17},palette:{white:[0,0,0,0],black:[0,0,0,0]}}}},nativeMaterials:{GTNumM:{P_GTNum_00:{white:[255,0,0,255]}},RdtBtnMyPage:{P_GTNum_00:{white:[0,255,0,255]}}},nativePictures:{GTNumM:{P_GTNum_00:picture}},nativeAnimations:{}};
const root=createRoot(document.getElementById('root'));window.activations=0;window.paint=(count=3,online=true,notifications=0)=>{window.__status={friendsOnline:count,online,notifications};root.render(<SwitchNativeContext.Provider value={native}><div style={{position:'absolute',left:400,top:200}}><SwitchProfile effects={{}} animations={[]} modern dark enabled={false} label='Profile' onActivate={()=>window.activations++}/></div></SwitchNativeContext.Provider>);};window.paint();`;
const result=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'},plugins:[{name:'host-services',setup(b){b.onResolve({filter:/^\.\.\/(steam|ProfileAvatar)$/},args=>({path:args.path,namespace:'host-test'}));b.onLoad({filter:/.*/,namespace:'host-test'},args=>({contents:args.path.endsWith('steam')?'export const useSteamStatus=()=>window.__status;':`import React from 'react';export const ProfileAvatar=()=> <span>Avatar</span>;`,loader:'tsx',resolveDir:process.cwd()}));}}]}),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:800,height:500}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent('<div id="root"></div>');await page.addScriptTag({content:result.outputFiles[0].text});
 const digits=page.locator('[data-widget-pane="P_GTNum_00"]'),canvases=digits.locator('canvas');await page.waitForFunction(()=>{const cs=[...document.querySelectorAll('[data-widget-pane="P_GTNum_00"] canvas')];return cs.length===3&&cs.every(c=>c.dataset.nxPictureStatus==='ready');});
 assert.equal(await digits.count(),3);assert.deepEqual(await page.locator('[data-widget-pane^="L_Num_"]').evaluateAll(els=>els.map(el=>getComputedStyle(el).display)),['none','none','block']);
 assert.equal(await digits.last().evaluate(el=>getComputedStyle(el).width),'12px');assert.equal(await digits.last().evaluate(el=>getComputedStyle(el).height),'17px');
 assert.equal(await canvases.last().evaluate(el=>el.getContext('2d').getImageData(0,0,1,1).data[3]),80,'Digit 3 must select the fourth native atlas row');
 const box=await digits.last().boundingBox();assert(box.x<800&&box.y<500,'Referenced roots must reset standalone transforms');
 const pixel=await page.screenshot({clip:{x:Math.floor(box.x+box.width/2),y:Math.floor(box.y+box.height/2),width:1,height:1}});
 const rgb=await page.evaluate(async b64=>{const image=new Image();image.src='data:image/png;base64,'+b64;await image.decode();const c=document.createElement('canvas');c.width=c.height=1;const context=c.getContext('2d');context.drawImage(image,0,0);return [...context.getImageData(0,0,1,1).data];},pixel.toString('base64'));assert.deepEqual(rgb,[121,255,121,255],'Both alpha registers must tint the atlas: black alpha 80 plus (255 - 80) times the sampled 80/255 alpha');
 await page.evaluate(()=>window.paint(42,false,1));await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-widget-pane="L_Num_01"]')).display!=='none');
 await page.waitForFunction(()=>[...document.querySelectorAll('[data-widget-pane="P_GTNum_00"] canvas')].at(-1)?.getContext('2d').getImageData(0,0,1,1).data[3]===60);
 assert(await page.locator('[data-native-status-badge="IconError"] [data-scene-pane="P_Base"]').isVisible());assert(await page.locator('[data-native-status-badge="RdtIconNewFrd"] [data-scene-pane="P_Base"]').isVisible());
 await page.getByRole('button',{name:'Profile'}).click();assert.equal(await page.evaluate(()=>window.activations),1);
 await page.evaluate(()=>window.paint(0,true,0));await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-widget-pane="N_Num"]')).display==='none');
 assert.equal(await page.locator('[data-native-status-badge="IconError"] [data-scene-pane="P_Base"]').isVisible(),false);assert.equal(await page.locator('[data-native-status-badge="RdtIconNewFrd"] [data-scene-pane="P_Base"]').isVisible(),false);assert.deepEqual(errors,[]);
 console.log('PASS real profile parts: atlas digits, independent geometry/materials, instance transforms, service badges and one activation');
}finally{await browser.close();}
