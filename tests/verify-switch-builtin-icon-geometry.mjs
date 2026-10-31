import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import{createRoot}from'react-dom/client';import{SwitchAppletTree}from'./src/themes/SwitchAppletTree';import{SwitchHudTree}from'./src/themes/SwitchHudTree';
const root=createRoot(document.getElementById('root'));window.paint=charging=>root.render(<><div style={{position:'absolute',left:300,top:200,width:0,height:0}}><SwitchAppletTree id="album" label="Album" effects={{}} animations={[]} modern={false} dark enabled={false} active={false} pressed={false} scale={1} onActivate={()=>{}}/></div><div style={{position:'absolute',left:700,top:300}}><SwitchHudTree effects={{}} animations={[]} modern={false} dark enabled={false} open={false} now={new Date(2026,1,1,9,7)} level={.72} charging={charging} hour12={false} scale={1}/></div></>);window.paint(false);`;
const built=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1200,height:800}});await page.setContent('<div id="root"></div>');await page.addScriptTag({content:built.outputFiles[0].text});await page.locator('[data-switch-original-glyph="album:P_Pict_00"]').waitFor();
 const bounds=await page.locator('[data-switch-original-glyph="album:P_Pict_00"]').evaluate(svg=>{const b=svg.getBBox(),m=svg.getScreenCTM(),a=new DOMPoint(b.x,b.y).matrixTransform(m),z=new DOMPoint(b.x+b.width,b.y+b.height).matrixTransform(m);return {x:(a.x+z.x)/2,y:(a.y+z.y)/2,w:z.x-a.x,h:z.y-a.y};});
 assert(Math.abs(bounds.x-300)<2&&Math.abs(bounds.y-200)<2,'Album painted bounds must center on the button, including transparent-pane padding');assert(bounds.w<52&&bounds.h<36,'Album must not stretch to fill the entire 62x54 pane');
 const svg=page.locator('[data-hud-file="BatteryConsole"][data-hud-pane="P_Ico00"] [data-switch-original-glyph]');assert.equal(await svg.getAttribute('viewBox'),'0 0 36 20');
 const base=page.locator('[data-hud-file="BatteryConsole"][data-hud-pane="P_BatBase"] [data-switch-original-glyph]');assert.equal(await base.getAttribute('viewBox'),'0 0 30 16');assert.equal(await base.locator('rect').getAttribute('stroke'),'none','Battery base is a fill, not a second outline');
 const charge=page.locator('[data-hud-file="BatteryConsole"][data-hud-pane="P_Charge"]');assert.equal(await charge.evaluate(e=>getComputedStyle(e).visibility),'hidden');
 await page.evaluate(()=>window.paint(true));await page.waitForTimeout(50);assert.notEqual(await charge.evaluate(e=>getComputedStyle(e).visibility),'hidden');assert.equal(await charge.locator('[data-switch-original-glyph]').getAttribute('viewBox'),'0 0 22 22');
 assert.equal(await page.locator('[data-hud-file="BatteryConsole"][data-hud-pane="N_GaugeNml"]').evaluate(e=>getComputedStyle(e).visibility),'hidden');
 console.log('PASS original icon geometry: Album center/paint bounds; separate battery fill/frame; charging state');
}finally{await browser.close();}
