import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchDialogActions,SWITCH_ACTION_LAYOUTS} from './src/themes/SwitchDialogActions';import {SwitchNativeContext} from './src/themes/SwitchWidgetTree';
window.layouts=SWITCH_ACTION_LAYOUTS;window.calls=[];const root=createRoot(document.getElementById('root'));
window.paint=(file,selected=0,open=true,patch=false)=>root.render(<SwitchNativeContext.Provider value={{nativePanes:patch?{[file]:{L_Btn_00:{Position:{X:100,Y:-37},Size:{X:400,Y:70}},L_Line_00:{Visible:false}}}:{},nativeMaterials:{DBtnUserIconNameStatus:{T_00:{white:[255,0,0,255]}}},nativeAnimations:{}}}><div style={{position:'absolute',left:0,top:100,width:1280}}><SwitchDialogActions file={file} selected={selected} items={[{label:'First'},{label:'Second'},{label:'Third'}]} onActivate={index=>window.calls.push(index)} effects={{}} animations={[]} modern dark enabled={false} open={open}/></div></SwitchNativeContext.Provider>);window.paint('DBtnNml2');`;
const b=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:720}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.setContent('<div id="root"></div>');await page.addScriptTag({content:b.outputFiles[0].text});
 for(const file of await page.evaluate(()=>window.layouts)){
  await page.evaluate(file=>window.paint(file),file);await page.locator(`[data-native-dialog-actions="${file}"]`).waitFor();
  const first=page.getByRole('button',{name:'First',exact:true}),buttons=page.getByRole('button');await first.waitFor();const box=await first.boundingBox();assert(box.width>200&&box.width<=950&&box.height>=55&&box.height<90,file+': native part magnification must size the actual hit target: '+JSON.stringify(box));
  const before=await page.evaluate(()=>window.calls.length);await first.click();assert.equal(await page.evaluate(()=>window.calls.length),before+1,file+': a native button must activate exactly once');assert.equal(await page.evaluate(()=>window.calls.at(-1)),0);
  if(await buttons.count()>1){await page.getByRole('button',{name:'Second',exact:true}).click();assert.equal(await page.evaluate(()=>window.calls.at(-1)),1);}
 }
 await page.evaluate(()=>window.paint('DBtnNml2',1,true,true));await page.locator('[data-native-dialog-actions="DBtnNml2"]').waitFor();const patched=await page.getByRole('button',{name:'First',exact:true}).boundingBox();assert(Math.abs(patched.x+patched.width/2-740)<.1,'Containing-layout position must move the referenced hit target');assert.equal(await page.locator('[data-widget-slot="widget:DBtnNml2:L_Line_00"]').isVisible(),false);
 assert.equal(await page.locator('[data-widget-slot="widget:DBtnNml2:L_Btn_00"] [data-widget-pane="N_BtnFocusKey"]').isVisible(),false);assert(await page.locator('[data-widget-slot="widget:DBtnNml2:L_Btn_01"] [data-widget-pane="N_BtnFocusKey"]').isVisible());
 await page.evaluate(()=>window.paint('DBtnNml2',0,false));assert(await page.getByRole('button',{name:'First',exact:true}).isDisabled());assert.equal(await page.getByRole('button',{name:'First',exact:true}).evaluate(el=>getComputedStyle(el).pointerEvents),'none');assert.deepEqual(errors,[]);
 console.log('PASS nine native action families: actual hit bounds, part magnification, independent selection, patched geometry/visibility, one activation and disabled exit input');
}finally{await browser.close();}
