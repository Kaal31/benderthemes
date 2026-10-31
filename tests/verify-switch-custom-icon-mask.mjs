import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const art='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="56"><path fill="black" fill-rule="evenodd" d="M8 8H56V48H8Z M24 32H40V46H24Z"/></svg>');
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchAppletTree} from './src/themes/SwitchAppletTree';const root=createRoot(document.getElementById('root'));window.paint=(dark,explicit=false)=>root.render(<div style={{position:'absolute',left:150,top:150}}><SwitchAppletTree id="shop" label="Shop" art={${JSON.stringify(art)}} effects={{'widget:RdtBtnShop:P_Pict':{Size:{X:64,Y:56},palette:{white:explicit?[0,0,0,0]:[100,100,100,100]},...(explicit?{white:[180,60,210,255]}:{})}}} animations={[]} modern={false} dark={dark} enabled={false} active={false} pressed={false} scale={1} onActivate={()=>{}}/></div>);window.paint(true);`;
const app=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}});
const browser=await chromium.launch();
try{
 const p=await browser.newPage({viewport:{width:400,height:400}});await p.setContent('<div id="root"></div>');await p.addScriptTag({content:app.outputFiles[0].text});
 for(const [dark,explicit,expected] of [[true,false,[220,220,220]],[false,false,[110,120,121]],[true,true,[180,60,210]]]){
  await p.evaluate(([d,e])=>window.paint(d,e),[dark,explicit]);const img=p.locator('[data-widget-pane="P_Pict"] img');await img.waitFor();await img.evaluate(e=>e.decode());await p.waitForTimeout(50);
  const box=await img.boundingBox(),png=await p.screenshot({clip:{x:box.x,y:box.y,width:64,height:56}});
  const pixels=await p.evaluate(async data=>{const im=await createImageBitmap(await(await fetch('data:image/png;base64,'+data)).blob());const c=document.createElement('canvas');c.width=64;c.height=56;const ctx=c.getContext('2d');ctx.drawImage(im,0,0);return {ink:[...ctx.getImageData(32,20,1,1).data].slice(0,3),hole:[...ctx.getImageData(32,42,1,1).data].slice(0,3)};},png.toString('base64'));
  assert(pixels.ink.every((v,i)=>Math.abs(v-expected[i])<=1),'Black source RGB must use alpha-mask glyph tint, retaining explicit theme colors');assert.notDeepEqual(pixels.hole,expected,'Transparent interior must remain a hole');
 }
 console.log('PASS custom applet alpha swizzle: dark/light tint, transparent cutout and explicit material color');
}finally{await browser.close();}
