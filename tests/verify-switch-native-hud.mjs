import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchHudTree} from './src/themes/SwitchHudTree';import {SwitchNativeContext} from './src/themes/SwitchWidgetTree';
const native={nativePanes:{GTNumL:{RootPane:{Position:{X:999,Y:999}},P_GTNum_00:{Size:{X:14,Y:17}}},HudTime:{P_Colon:{Size:{X:8,Y:31}}}},nativeMaterials:{HudTime:{P_Colon:{white:[0,255,0,255]}}},nativeAnimations:{}};
createRoot(document.getElementById('root')).render(<SwitchNativeContext.Provider value={native}><div style={{position:'absolute',left:350,top:200}}><SwitchHudTree effects={{}} animations={[]} modern={false} dark enabled={false} open={false} now={new Date(2026,1,1,9,7)} level={.72} charging={false} hour12={false} scale={1} instanceSize={[321,45]}/></div></SwitchNativeContext.Provider>);`;
const b=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent('<div id="root"></div>');await page.addScriptTag({content:b.outputFiles[0].text});
 const colon=page.locator('[data-hud-file="HudTime"][data-hud-pane="P_Colon"]');await colon.waitFor();
 assert.equal(await colon.evaluate(el=>getComputedStyle(el).height),'31px');
 assert.equal(await page.locator('[data-hud-file="Hud"][data-hud-pane="RootPane"]').evaluate(el=>getComputedStyle(el).width),'321px');
 const clock=page.locator('[data-hud-file="HudTime"][data-hud-pane="RootPane"]');
 const parts=clock.locator('[data-hud-file="GTNumL"][data-hud-pane="RootPane"]');
 assert.equal(await parts.count(),4);
 const states=await parts.evaluateAll(els=>els.map(el=>({width:getComputedStyle(el).width,height:getComputedStyle(el).height,transform:getComputedStyle(el).transform,x:el.getBoundingClientRect().x,y:el.getBoundingClientRect().y})));
 assert(states.every(s=>s.width==='14px'&&s.height==='24px'&&s.x<800&&s.y<600),'Referenced roots must use the instance bounds and reset standalone root transforms');
 const digits=clock.locator('[data-hud-file="GTNumL"][data-hud-pane="P_GTNum_00"]');
 assert.deepEqual(await digits.allTextContents(),[' ','9','0','7']);
 assert(await digits.first().evaluate(el=>getComputedStyle(el).height==='17px'));
 assert.notEqual(await page.locator('.dht-switch-battery-number').evaluate(el=>getComputedStyle(el).visibility),'hidden');
 await page.getByRole('button',{name:'Toggle battery percentage'}).click({force:true});
 assert.equal(await page.locator('.dht-switch-battery-number').evaluate(el=>getComputedStyle(el).visibility),'hidden');
 assert.deepEqual(errors,[]);
 console.log('PASS native HUD: pane metrics, referenced root transforms, clock digits, percentage state and shared scene rendering');
}finally{await browser.close();}
