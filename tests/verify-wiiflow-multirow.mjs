import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {readFileSync,mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const source=readFileSync('themes/wiiflow-default/renderer-source.js','utf8').replace('entries=new Map()','entries=window.__cases=new Map()').replace('renderer.render(scene,camera);', 'if(entries.size&&!window.__firstCamera)window.__firstCamera=camera.position.toArray();renderer.render(scene,camera);').replace('if(url&&!cacheDisposed)await coverResource(url).promise','if(url&&!cacheDisposed){(window.__prefetched??=[]).push({url,time:performance.now()});await coverResource(url).promise;}');
const bundle=await build({stdin:{contents:source,resolveDir:process.cwd()+'/themes/wiiflow-default',loader:'js'},bundle:true,write:false,format:'iife'});
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[],requests=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/theme-bridge.js',route=>route.fulfill({contentType:'text/javascript',body:`(()=>{const callbacks={};const browse={columns:7,rows:3,center_pos:[0,0,1],row_center_pos:[0,0,0],left_pos:[-1.6,0,0],right_pos:[1.6,0,0],left_angle:[0,45,0],right_angle:[0,-45,0],left_spacer:[-.7,0,-.3],right_spacer:[.7,0,-.3],top_spacer:[0,1.8,0],bottom_spacer:[0,-1.8,0],camera_pos:[0,1,7]};window.WiiFlowImport={modes:[{name:'Default',browse},{name:'Saved layout',browse:{...browse,center_pos:[.4,0,1]}}],ui:{},defaults:{},transitionClearance:false};window.ThemeHub={state:null,on:(name,fn)=>(callbacks[name]??=[]).push(fn),sound(){},save(){},send(){},open(){},launch(){},connect(){},emit(name,value){if(name==='state')this.state=value;for(const fn of callbacks[name]??[])fn(value)}};})();`}));
 await page.route('**/renderer.js',route=>route.fulfill({contentType:'text/javascript',body:bundle.outputFiles[0].text}));
 const png=Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jRZkAAAAASUVORK5CYII=','base64');
 await page.route('**/multirow-art-*.png',async route=>{requests.push(route.request().url());await new Promise(resolve=>setTimeout(resolve,180));await route.fulfill({contentType:'image/png',body:png});});
 await page.goto(new URL('/themes/wiiflow-default/index.html',url).href);
 await page.evaluate(base=>window.ThemeHub.emit('state',{games:Array.from({length:70},(_,i)=>({appid:i+1,name:'Game '+(i+1),installed:true,art:{portrait:[base+'/multirow-art-'+i+'.png']}})),settings:{animations:true},saved:{importedMode:1}}),url);
 await page.waitForFunction(()=>window.__cases?.size===27&&[...window.__cases.values()].every(e=>e.coverImage));
 const check=async()=>{
  const state=await page.evaluate(()=>{const cases=[...window.__cases.values()].filter(e=>e.group.visible);return {ids:cases.map(e=>e.button.dataset.appid),rows:cases.map(e=>Number(e.button.dataset.row)),selected:[...window.__cases.values()].filter(e=>e.button.classList.contains('selected')).map(e=>({id:e.button.dataset.appid,x:e.target.x,row:e.button.dataset.row})),maps:cases.every(e=>e.front.material.map.image===e.coverImage)};});
  assert.equal(new Set(state.ids).size,state.ids.length,'Every visible row must use a different game');
  assert.deepEqual([...new Set(state.rows)].sort(),[-1,0,1]);assert.equal(state.selected.length,1);assert.equal(state.selected[0].row,'0');assert.equal(state.selected[0].x,.4,'Saved mode must match the rendered layout');assert(state.maps,'All rows must receive late artwork');
 };
 await check();assert.deepEqual(await page.evaluate(()=>window.__firstCamera),[0,1,7],'First visible camera must use the imported pose instead of flying in from stock');
 await page.evaluate(async()=>{window.__prefetched=[];window.__scrollStart=performance.now();for(let i=0;i<12;i++){window.ThemeHub.emit('input',{btn:'right'});await new Promise(resolve=>setTimeout(resolve,80));}window.__scrollEnd=performance.now();});
 await page.waitForFunction(()=>[...window.__cases.values()].every(e=>e.coverImage));await check();
 assert(await page.evaluate(()=>window.__prefetched.some(item=>item.time>window.__scrollStart&&item.time<window.__scrollEnd)),'Prefetch must run during continuous scrolling');
 mkdirSync('out/wiiflow-multirow-fix',{recursive:true});await page.screenshot({path:'out/wiiflow-multirow-fix/unique-multirow-cases.png'});
 // A short library must leave unused slots empty rather than repeat its games.
 await page.evaluate(()=>window.ThemeHub.emit('state',{...window.ThemeHub.state,games:window.ThemeHub.state.games.slice(0,5)}));
 await page.waitForFunction(()=>window.__cases.size===5);
 assert.equal(await page.locator('#covers .selected').count(),1);assert.equal(await page.locator('#covers .cover').count(),5);
 // A renderer loaded after the bridge's first state must use the same saved mode.
 await page.route('**/renderer.js',route=>route.fulfill({contentType:'text/javascript',body:''}));
 await page.reload();
 await page.evaluate(()=>window.ThemeHub.emit('state',{games:Array.from({length:40},(_,i)=>({appid:i+1,name:'Game '+i,art:{portrait:[]}})),settings:{animations:true},saved:{importedMode:1}}));
 await page.addScriptTag({content:bundle.outputFiles[0].text});
 await page.waitForFunction(()=>window.__cases?.size===27);
 assert.equal(await page.evaluate(()=>[...window.__cases.values()].find(e=>e.button.classList.contains('selected')).target.x),.4,'Cached bridge state must restore the saved layout before the first render');
 await page.waitForFunction(()=>window.__firstCamera);assert.deepEqual(await page.evaluate(()=>window.__firstCamera),[0,1,7]);
 assert.deepEqual(errors,[]);mkdirSync('out/wiiflow-multirow-fix',{recursive:true});await page.screenshot({path:'out/wiiflow-multirow-fix/unique-cases.png'});
 console.log('PASS unique multi-row games, delayed textures in every row, saved layout, short libraries and continuous-scroll prefetch');
}finally{await browser.close();server.closeAllConnections();server.close();}
