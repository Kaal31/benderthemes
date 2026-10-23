import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {launch} from './browser.mjs';
const bundle=await build({entryPoints:['src/nativeThemeFocus.ts'],bundle:true,format:'iife',globalName:'nativeFocus',write:false});
const browser=await launch();
try{
 const page=await browser.newPage();await page.setContent('<div id="host" tabindex="0"><button id="one">One</button><button id="two">Two</button><input id="text"><div id="modal" inert><button id="hidden">Hidden</button></div></div><button id="outside">Steam overlay</button>');await page.addScriptTag({content:bundle.outputFiles[0].text});
 const result=await page.evaluate(async()=>{
  const host=document.querySelector('#host'),one=document.querySelector('#one'),two=document.querySelector('#two'),text=document.querySelector('#text');
  const nav={TakeFocus:()=>host.focus()},dispose=nativeFocus.installNativeThemeFocus(host,()=>nav);
  one.focus();await Promise.resolve();const first={active:document.activeElement.id,logical:nativeFocus.themeActiveElement(host).id};
  two.focus();await Promise.resolve();const second={active:document.activeElement.id,logical:nativeFocus.themeActiveElement(host).id,markers:host.querySelectorAll('[data-dht-control-focus]').length};
  text.focus();await Promise.resolve();const editing=document.activeElement.id;
  two.focus();await Promise.resolve();document.querySelector('#outside').focus();const overlay=nativeFocus.themeActiveElement(host).id;
  host.focus();two.remove();const removed=nativeFocus.themeActiveElement(host).id;
  dispose();return {first,second,editing,overlay,removed,markers:host.querySelectorAll('[data-dht-control-focus]').length,css:nativeFocus.nativeControlFocusCSS('button:focus{color:red}input:focus-visible{}div:focus-within{}')};
 });
 assert.deepEqual(result.first,{active:'host',logical:'one'});assert.deepEqual(result.second,{active:'host',logical:'two',markers:1});assert.equal(result.editing,'text');assert.equal(result.overlay,'outside');assert.equal(result.removed,'host');assert.equal(result.markers,0);assert.ok(result.css.includes('button:is(:focus,[data-dht-control-focus=true])'));assert.ok(result.css.includes(':focus-visible'));assert.ok(result.css.includes(':focus-within'));
 console.log('PASS: native input root stays focused, logical controls advance, text editing and Steam overlays keep focus, stale selections and markers clean up.');
}finally{await browser.close();}
