import assert from 'node:assert/strict';import {build} from 'esbuild';import {readFileSync,mkdirSync} from 'node:fs';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const source=("import {OBB} from 'three/addons/math/OBB.js';\n"+readFileSync('themes/wiiflow-default/renderer-source.js','utf8')).replace("import * as T from 'three';","import * as T from 'three';window.__T=T;window.__OBB=OBB;").replace('entries=new Map()','entries=window.__cases=new Map()');const bundle=await build({stdin:{contents:source,resolveDir:process.cwd()+'/themes/wiiflow-default',loader:'js'},bundle:true,write:false,format:'iife'});
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('**/theme-bridge.js',route=>route.fulfill({contentType:'text/javascript',body:`(()=>{const callbacks={};window.WiiFlowImport={modes:[{name:'Source',browse:{columns:7,center_pos:[0,0,1],left_pos:[-1.6,0,0],right_pos:[.6,0,1.5],left_angle:[0,50,0],right_angle:[0,-110,0],left_spacer:[-.75,0,-.55],right_spacer:[.75,0,-.55],color_shadow_center:'#00000000',color_shadow_beg:'#00000000',color_shadow_end:'#00000000',shadow_scale:1.25,shadow_x:4,shadow_y:-3},selected:{color_shadow_center:'#20406080'}}],ui:{},defaults:{}};window.ThemeHub={state:null,on:(name,fn)=>(callbacks[name]??=[]).push(fn),sound(){},save(){},send(){},open(){},launch(){},connect(){},emit(name,value){if(name==='state')this.state=value;for(const fn of callbacks[name]??[])fn(value)}};})();`}));
 await page.route('**/renderer.js',route=>route.fulfill({contentType:'text/javascript',body:bundle.outputFiles[0].text}));
 await page.goto(new URL('/themes/wiiflow-default/index.html',url).href);
 await page.evaluate(()=>window.ThemeHub.emit('state',{games:Array.from({length:7},(_,i)=>({appid:i+1,name:'Game '+(i+1),installed:true,art:{portrait:[],landscape:[],hero:[]}})),settings:{animations:false},saved:{hideCoverTitle:true}}));
 await page.waitForFunction(()=>window.__cases?.size===7&&[...window.__cases.values()].every(e=>e.frontSettled));
 assert.equal(await page.locator('#title').evaluate(e=>getComputedStyle(e).visibility),'hidden');
 await page.evaluate(()=>{window.WiiFlowImport.reflectionsEnabled=true;window.dispatchEvent(new Event('resize'));});
 await page.waitForFunction(()=>[...window.__cases.values()].some(e=>e.mirror.visible));
 assert(await page.evaluate(()=>[...window.__cases.values()].filter(e=>e.mirror.visible).every(e=>{if(!e.mirror.parent)return false;e.group.updateMatrix();const expected=new window.__T.Matrix4().makeScale(1,-1,1);expected.setPosition(0,-1.64,0);expected.multiply(e.group.matrix);return expected.elements.every((v,i)=>Math.abs(v-e.mirror.matrix.elements[i])<1e-6);})), 'Each reflection must follow its case transform in 3D');
 assert.equal(await page.locator('#floor-reflection').count(),0,'Do not flip the whole rendered screen');
 mkdirSync('out/importer-gap-fixes',{recursive:true});await page.screenshot({path:'out/importer-gap-fixes/wiiflow-reflections.png'});
 assert(await page.evaluate(()=>[...window.__cases.values()].every(e=>!e.shadow.visible&&!e.importShadow.visible)),'Transparent source shadows must not draw floor patches');
 await page.evaluate(()=>window.ThemeHub.emit('input',{btn:'a'}));
 await page.waitForFunction(()=>[...window.__cases.values()].some(e=>e.importShadow.visible));
 const shadow=await page.evaluate(()=>{const e=[...window.__cases.values()].find(e=>e.offset===0);return {floor:e.shadow.visible,opacity:e.importShadow.material.opacity,color:e.importShadow.material.color.getHex(),rotationMatches:e.importShadow.quaternion.angleTo(e.group.quaternion)<.00001,scale:e.importShadow.scale.y/e.group.scale.y,behindPass:!e.importShadow.material.depthWrite};});
 assert.equal(shadow.floor,false);assert.equal(shadow.opacity,128/255);assert.equal(shadow.color,0x204060);assert(shadow.rotationMatches);assert.equal(shadow.scale,1.25);assert(shadow.behindPass);
 await page.evaluate(()=>{window.ThemeHub.emit('input',{btn:'b'});window.ThemeHub.emit('state',{...window.ThemeHub.state,settings:{animations:true}});});
 const sample=async enabled=>page.evaluate(async enabled=>{
  window.WiiFlowImport.transitionClearance=enabled;let collisions=0;
  const T=window.__T,OBB=window.__OBB;
  for(let step=0;step<2;step++){
   window.ThemeHub.emit('input',{btn:step?'left':'right'});
   for(let n=0;n<28;n++){
    await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
    const entries=[...window.__cases.values()].filter(e=>e.group.visible&&!e.flowBoundary);
    const target=e=>new OBB(new T.Vector3(),new T.Vector3(.525,.75,.07)).applyMatrix4(new T.Matrix4().compose(e.target,new T.Quaternion().setFromEuler(new T.Euler(e.tilt,e.angle*Math.PI/180,e.roll,'YXZ')),e.flowScale));
    const current=e=>{e.group.updateMatrix();return new OBB(new T.Vector3(),new T.Vector3(.525,.75,.07)).applyMatrix4(e.group.matrix);};
    for(let i=0;i<entries.length;i++)for(let j=i+1;j<entries.length;j++)if(!target(entries[i]).intersectsOBB(target(entries[j]),0)&&current(entries[i]).intersectsOBB(current(entries[j]),0))collisions++;
   }
  }
  return collisions;
 },enabled);
 const without=await sample(false),withClearance=await sample(true);
 console.log('Transition collision samples:',{without,withClearance});
 assert(without>0,'Fixture must reproduce a rotating case intersecting its neighbour');
 assert(withClearance<without,'Transition clearance must reduce case intersections');
 assert.deepEqual(errors,[]);console.log('PASS imported title toggle, source zero-alpha shadows, selected RGBA colour, scale and cover-following silhouette instead of floor patch');
}finally{await browser.close();server.closeAllConnections();server.close();}
