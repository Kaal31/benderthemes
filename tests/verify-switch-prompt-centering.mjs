import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const entry=`import React from 'react';import{createRoot}from'react-dom/client';import{SwitchPromptGlyph}from'./src/themes/SwitchPromptGlyph';createRoot(document.getElementById('root')).render(<>{['A','+'].flatMap(symbol=>[14,28,56].flatMap(size=>[undefined,'#000','#e8e8e8'].map(symbolColor=><SwitchPromptGlyph key={symbol+size+symbolColor} symbol={symbol} size={size} symbolColor={symbolColor}/>)))}</>);`;
const code=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage();await page.setContent('<div id="root"></div>');await page.addScriptTag({content:code.outputFiles[0].text});await page.locator('[data-switch-prompt]').first().waitFor();
 const checks=await page.locator('[data-switch-prompt]').evaluateAll(async els=>Promise.all(els.map(async el=>{
  const img=new Image();img.src='data:image/svg+xml,'+encodeURIComponent(new XMLSerializer().serializeToString(el));await img.decode();
  const canvas=document.createElement('canvas');canvas.width=canvas.height=144;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0,144,144);const pixels=ctx.getImageData(0,0,144,144).data,points=[];
  for(let y=24;y<120;y++)for(let x=24;x<120;x++){
   const i=(y*144+x)*4;if(pixels[i+3]<128||pixels[i]<245)points.push([x,y]);
  }
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]);return {symbol:el.dataset.switchPrompt,x:(Math.min(...xs)+Math.max(...xs))/2,y:(Math.min(...ys)+Math.max(...ys))/2,text:el.querySelectorAll('text').length};
 })));
 for(const check of checks){assert(Math.abs(check.x-71.5)<1&&Math.abs(check.y-71.5)<1,`${check.symbol}: painted symbol must center within its circle`);assert.equal(check.text,0,'Prompt alignment must not depend on a fallback font baseline');}
 assert.equal(checks.length,18);console.log('PASS 18 rasterized prompt variants: A/+ centered at three sizes, transparent/light/dark letters');
}finally{await browser.close();}
