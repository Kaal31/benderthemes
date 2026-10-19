import assert from 'node:assert/strict';
import {readFileSync,existsSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {build} from 'esbuild';
import {chromium} from 'playwright';
const path=['work/switch-base-analysis/firmware-22.5.0/fonts-local/0100000000000811/nintendo_udsg-r_std_003.ttf','C:/Windows/Fonts/cour.ttf'].find(existsSync);
if(!path){console.log('SKIP local font rendering: no optional font input');process.exit(0);}
const data=readFileSync(path),family='DHTSwitchFontStandard'+createHash('sha256').update(data).digest('hex').slice(0,12);
const entry=`import React from 'react';import {createRoot} from 'react-dom/client';import {SwitchText} from './src/themes/SwitchText';import {SwitchNativeContext} from './src/themes/SwitchWidgetTree';import {useSwitchFont} from './src/themes/useSwitchFont';
function Probe(){const font=useSwitchFont();return <div data-font-revision={font.revision} style={{position:'relative',width:600,height:60}}><SwitchText text="WWW iii 12345" metrics={{fontSize:[32,32],alignment:1,lineAlignment:1,characterSpace:0,lineSpace:0}}/></div>;}
const root=createRoot(document.getElementById('root'));window.paint=fonts=>root.render(<SwitchNativeContext.Provider value={{nativeFonts:fonts}}><Probe/><Probe/></SwitchNativeContext.Provider>);window.paint(window.__fonts);`;
const result=await build({stdin:{contents:entry,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',define:{'process.env.NODE_ENV':'"production"'}}),browser=await chromium.launch();
try{
 const page=await browser.newPage();await page.setContent('<div id="root"></div>');
 await page.evaluate(({family,source})=>{window.__fonts={standard:{family,source}};},{family,source:'data:font/ttf;base64,'+data.toString('base64')});
 await page.addScriptTag({content:result.outputFiles[0].text});
 await page.waitForFunction(()=>document.querySelector('[data-font-revision]')?.dataset.fontRevision==='1');
 const metrics=await page.locator('[data-nx-text-ink]').first().evaluate((el,family)=>{const canvas=document.createElement('canvas'),context=canvas.getContext('2d');context.font=`32px "${family}"`;return {family:getComputedStyle(el).fontFamily,width:el.getBoundingClientRect().width,expected:context.measureText(el.textContent).width,faces:[...document.fonts].filter(f=>f.family===family).length};},family);
 assert(metrics.family.includes(family));assert.equal(metrics.faces,1,'Repeated panes must share a loaded face');assert(Math.abs(metrics.width-metrics.expected)<1,'Native text bounds must match the imported face');
 await page.evaluate(()=>window.paint({standard:{family:'unsafe family',source:'https://example.invalid/font.ttf'}}));
 await page.waitForFunction(()=>getComputedStyle(document.querySelector('[data-nx-text-ink]')).fontFamily==='Arial, sans-serif');
 console.log('PASS local font decoding in browser, shared face, native text metrics and invalid-resource fallback');
}finally{await browser.close();}
