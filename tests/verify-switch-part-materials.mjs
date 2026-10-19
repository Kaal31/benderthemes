import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchSceneTree} from './src/themes/SwitchSceneTree';import {panelColor} from './src/themes/SwitchMaterial';import {HUD_DEFAULTS} from './src/themes/switchHudDefaults';
const pane=(name,parent,x=0)=>({name,parent,slot:name,type:'pic1',position:[x,0,0],scale:[1,1],rotation:[0,0,0],size:[20,20],origin:0,alpha:255,influenceAlpha:false,visible:true});
const list=[pane('root',null),{...pane('A','root',-30),part:'digit',partOverrides:{ink:{material:'parent:red',effect:{white:[128,0,0,255]},geometry:{Position:{X:5,Y:0},Size:{X:13,Y:17}},alpha:64}}},{...pane('B','root',30),part:'digit',partOverrides:{ink:{material:'parent:blue',effect:{white:[0,0,128,255]},geometry:{Visible:false}}}}];
window.nativeParts=HUD_DEFAULTS.classic.BatteryConsole.filter(p=>p.partOverrides);
createRoot(document.getElementById('root')).render(<div style={{position:'absolute',left:100,top:100}}><SwitchSceneTree list={list} parts={{digit:[pane('partRoot',null),{...pane('ink','partRoot'),material:'child:ink',effect:{white:[0,255,0,255]}}]}} materials={{'parent:red':{white:[255,0,0,255]},'parent:blue':{white:[0,0,255,255]},'child:ink':{white:[0,255,0,255]}}} effects={{ink:{Size:{X:99,Y:99}}}} animations={[]} events={[]} enabled={false} dark render={(n,e)=>({style:n.name==='ink'?{background:panelColor(e)}:{}})}/></div>);`;
const b=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const p=await browser.newPage();await p.setContent('<div id="root"></div>');await p.addScriptTag({content:b.outputFiles[0].text});await p.locator('[data-scene-pane="ink"]').first().waitFor();
 const ink=p.locator('[data-scene-pane="ink"] > [data-scene-paint]');
 assert.deepEqual(await ink.evaluateAll(els=>els.map(el=>getComputedStyle(el).backgroundColor)),['rgb(255, 0, 0)','rgb(0, 0, 255)'],'Parent part materials override the referenced material independently per instance');
 const instances=await p.locator('[data-scene-pane="ink"]').evaluateAll(els=>els.map(el=>({width:getComputedStyle(el).width,height:getComputedStyle(el).height,visibility:getComputedStyle(el).visibility,alpha:Number(getComputedStyle(el.querySelector('[data-scene-paint]')).opacity)})));
 assert(Math.abs(instances[0].alpha-64/255)<1e-6);assert.deepEqual(instances.map(({alpha,...rest})=>rest),[{width:'13px',height:'17px',visibility:'visible'},{width:'99px',height:'99px',visibility:'hidden'}],'Per-instance geometry, alpha and visibility overrides must win without changing a sibling instance');
 const defaults=await p.evaluate(()=>window.nativeParts);
 assert.equal(defaults.length,3);assert(defaults.every(p=>p.partOverrides.P_GTNum_00.material==='BatteryConsole:P_GTNum_00'),'Real battery part instances must retain containing-layout material identity');
 assert(defaults.every(p=>p.partOverrides.P_GTNum_00.effect.white[3]===200));
 console.log('PASS referenced part materials: containing-file identities, native battery defaults and independent instances');
}finally{await browser.close();}
