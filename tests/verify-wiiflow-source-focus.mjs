import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {build} from 'esbuild';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const source=readFileSync('themes/wiiflow-default/sourceMenu-source.js','utf8').replace('items.push(entry);','items.push(entry);window.__sourceEntries=items;');
const bundle=await build({stdin:{contents:source,loader:'js',resolveDir:process.cwd()+'/themes/wiiflow-default'},bundle:true,write:false,format:'iife'});
const {server,url}=await startPreviewServer(0),browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=vita&still=1');
 await page.setContent('<div id="scene"></div>');
 await page.evaluate(()=>{
  const picture=color=>'data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="90"><rect width="64" height="90" fill="'+color+'"/></svg>');
  const callbacks={};window.__pictures={normal:picture('red'),selected:picture('lime'),second:picture('blue')};
  window.WiiFlowImport={sourceMenu:{start:'source_menu.ini',pages:{'source_menu.ini':{layout:{},buttons:[{title:'First',image:window.__pictures.normal,selectedImage:window.__pictures.selected},{title:'Second',image:window.__pictures.second}]}}}};
  window.ThemeHub={state:{games:[],collections:[{id:'two',name:'Second collection',appids:[]}]},sound(){},save(){},open(){},on(name,fn){(callbacks[name]??=[]).push(fn)},emit(name,value){if(name==='state')this.state=value;for(const fn of callbacks[name]??[])fn(value)}};
 });
 await page.addScriptTag({content:bundle.outputFiles[0].text});await page.locator('#platforms').click();
 await page.waitForFunction(()=>window.__sourceEntries?.length===2&&window.__sourceEntries.every(e=>e.normalTexture)&&window.__sourceEntries[0].selectedTexture);
 assert(await page.evaluate(()=>window.__sourceEntries[0].mesh.material.map===window.__sourceEntries[0].selectedTexture),'Selected source-menu artwork must survive collection mapping');
 await page.evaluate(()=>window.ThemeHub.emit('input',{btn:'right'}));
 assert(await page.evaluate(()=>window.__sourceEntries[0].mesh.material.map===window.__sourceEntries[0].normalTexture),'Previous item restores normal artwork');
 assert(await page.evaluate(()=>window.__sourceEntries[1].mesh.material.map===window.__sourceEntries[1].normalTexture),'Missing selected artwork keeps its normal image');
 await page.evaluate(()=>window.ThemeHub.emit('input',{btn:'left'}));assert(await page.evaluate(()=>window.__sourceEntries[0].mesh.material.map===window.__sourceEntries[0].selectedTexture));
 const old=await page.evaluateHandle(()=>window.__sourceEntries[0].selectedTexture);await page.evaluate(()=>window.ThemeHub.emit('state',{games:[],collections:[{id:'two',name:'Second collection',appids:[]}],saved:{importedCollectionImages:{'all-games':window.__pictures.second}}}));
 await page.waitForFunction(()=>window.__sourceEntries[0].normalTexture&&!window.__sourceEntries[0].selectedTexture);
 assert(await page.evaluate(()=>window.__sourceEntries[0].mesh.material.map===window.__sourceEntries[0].normalTexture),'Custom collection image must not switch back to the theme selected image');
 await old.dispose();assert.deepEqual(errors,[]);console.log('PASS selected source artwork, D-pad changes, normal fallback, collection mapping and custom-image precedence');
} finally {await browser.close();server.closeAllConnections();server.close()}
