import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchFooter} from './src/themes/SwitchFooter';import {SwitchNativeContext} from './src/themes/SwitchWidgetTree';
const native={nativePanes:{Footer:{L_Footer:{Position:{X:0,Y:8}}},FooterAll:{N_Left:{Position:{X:-500,Y:36}},P_Bg_Gray:{Visible:true,palette:{white:[0,0,0,0]}}},FooterCtrl:{P_CtrlDummy:{Size:{X:99,Y:40}}}},nativeMaterials:{FooterAll:{P_Bg_Gray:{white:[255,0,0,255]}}},nativeAnimations:{},effects:{footer:{Position:{X:0,Y:300}}}};
createRoot(document.getElementById('root')).render(<SwitchNativeContext.Provider value={native}><div><SwitchFooter effects={native.effects} animations={[]} modern={false} dark enabled={false} open={false} pressed={false} scale={1} height={720} view="home" controller={<span>controller</span>}/></div></SwitchNativeContext.Provider>);`;
const b=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent('<div id="root"></div>');await page.addScriptTag({content:b.outputFiles[0].text});
 const root=page.locator('[data-native-footer]');await root.waitFor({state:'attached'});
 const controller=page.locator('[data-scene-slot="FooterCtrl:P_CtrlDummy"]'),box=await controller.boundingBox();
 assert.equal(box.width,99);assert.equal(box.height,40);assert(Math.abs(box.x+box.width/2-230)<1,'Native left-group and controller positions must compose');assert(Math.abs(box.y+box.height/2-676)<1,'The outer footer offset must be applied once, without copying the legacy alias into N_Root');
 const bar=page.locator('[data-scene-slot="FooterAll:P_Bg_Gray"]');assert(await bar.isVisible());assert.equal(await bar.locator(':scope > [data-scene-paint]').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(255, 0, 0)');
 const labels=page.locator('[data-scene-slot="FooterBtn:T_00"]');assert.deepEqual(await labels.allTextContents(),['Start','Options']);
 const first=await labels.nth(0).boundingBox(),second=await labels.nth(1).boundingBox();assert(second.x+second.width<first.x,'Runtime-sized footer labels must not overlap');
 assert.deepEqual(errors,[]);console.log('PASS native footer: left-group placement, outer instance offset, controller metrics, background material and dynamic button spacing');
}finally{await browser.close();}
