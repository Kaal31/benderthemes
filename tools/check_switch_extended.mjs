import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync,mkdirSync} from 'node:fs';
import {build} from 'esbuild';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await chromium.launch();
mkdirSync('work/themezer-validation/extended-check',{recursive:true});
const wanted=new Set(process.argv.slice(2));
try{for(const id of ['DE49','A20','3595','106EF'].filter(id=>!wanted.size||wanted.has(id))){
 const skin=JSON.parse(readFileSync(`work/themezer-validation/${id}.json`)),page=await browser.newPage({viewport:{width:1304,height:960}}),errors=[];
 page.setDefaultTimeout(60000);
 page.on('pageerror',error=>errors.push(error.message));await page.addInitScript(skin=>window.__testSwitch=skin,skin);
 await page.goto(url+'?theme=switch&still=1&h=720',{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.__updateTheme);await page.evaluate(file=>window.__updateTheme({switchTheme:file,animations:true}),skin.file);await page.locator('.dht-switch-game-root').first().waitFor();await page.waitForTimeout(5500);
 if(id==='DE49'){
  const order=skin.screens.home.conversion.paneOrder['RdtBase.bflyt'];
  assert.equal(await page.locator('.dht-switch-dock').evaluate(el=>Number(getComputedStyle(el).zIndex)),order.N_System);
  await page.keyboard.press('y');await page.locator('.dht-menu--switch').waitFor();await page.waitForTimeout(600);
  assert(await page.locator('[data-widget-file="BtnDialogNml"]').count()>0,'Shared menu controls must render actual panes');
  const panelBox=await page.locator('.dht-menu--switch').boundingBox();assert(panelBox.x>=0&&panelBox.x+panelBox.width<=1280,'Imported menu must remain centered in the viewport');
  const target=page.locator('.dht-menu-item').filter({hasText:'Customize'}).first();

  await page.locator('.dht-switch-root').locator('..').screenshot({path:'work/themezer-validation/extended-check/menu.png'});
  assert.equal(await target.count(),1);{await target.getByRole('button').click();await page.waitForTimeout(300);const options=page.locator('.dht-menu-item').filter({hasText:'Theme file'}).first();if(await options.count())await options.getByRole('button').click();await page.waitForTimeout(300);assert(await page.locator('[data-widget-file="BtnOpt_Root"]').count()>0,'Checkbox choices must use their own panes');}
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.waitForTimeout(500);
 }
 if(id==='A20'){
  const profile=page.locator('.dht-switch-profile button');await profile.focus();await page.waitForTimeout(700);
  const state=await page.locator('[data-widget-slot="widget:RdtBtnMyPage:P_PictBase"]').evaluate(el=>({border:getComputedStyle(el.querySelector(':scope > [data-scene-paint]')??el).borderTopWidth,uv:parseFloat(getComputedStyle(el).getPropertyValue('--dht-nx-uv-x')),canvas:!!el.querySelector('[data-nx-uv-texture]'),active:document.activeElement?.outerHTML.slice(0,150),animations:el.getAnimations().map(a=>({time:a.currentTime,frames:a.effect.getKeyframes().slice(-2)}))}));
assert.equal(state.border,'4px');assert(state.uv>1.13&&state.uv<1.15);assert(state.canvas);
  await page.locator('.dht-switch-root').screenshot({path:'work/themezer-validation/extended-check/profile-active.png'});
  await profile.click();const userCard=page.locator('[data-native-user-card]');await userCard.locator('[data-scene-pane="T_Name"]').waitFor();
  assert((await userCard.locator('[data-scene-pane="T_Name"]').innerText()).length>0,'Account options must bind the actual host username');await userCard.locator('img[alt="Profile picture"]').waitFor();
  const defaultLabels=page.locator('[data-widget-file="BtnListNml"] [data-widget-pane="T_00"]');assert(await defaultLabels.count()>0,'Unpatched controls must use native list-button defaults');
  assert(await defaultLabels.first().evaluate(el=>{const transfer=el.querySelector('feFuncR');return Number(transfer?.getAttribute('slope'))+Number(transfer?.getAttribute('intercept'))>.85;}),'Default dark-menu labels must paint with the native light text register');
  await page.locator('.dht-switch-root').locator('..').screenshot({path:'work/themezer-validation/extended-check/user-menu.png'});await page.keyboard.press('Escape');
 }
 if(id==='106EF'){
  await page.keyboard.press('y');await page.getByRole('button',{name:'Presets',exact:true}).click();
  assert.equal(await page.locator('[data-widget-file="DHdrText"] [data-widget-pane="T_00"]').innerText(),'Presets');
  assert.equal(await page.locator('[data-widget-file="DHdrSoft"], [data-widget-file="DCntIconLauncherText"], [data-native-download]').count(),0,'Settings submenus must not inherit game artwork, title or download progress');
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.waitForTimeout(450);
  await page.locator('.dht-switch-profile button').click();
  const card=page.locator('[data-native-user-card="UserIconNameStatus"]');await card.locator('[data-scene-pane="T_Name"]').waitFor();
  await card.locator('img[alt="Profile picture"]').waitFor();
  assert.equal(await page.locator('[data-widget-file="DHdrUserIconNameStatus"] [data-widget-pane="T_00"]').innerText(),'User','Account menus must not inherit the selected game heading');
  assert.equal(await page.locator('[data-widget-file="BtnListNml"] [data-widget-pane="T_00"]').filter({hasText:'DeckPlayer'}).count(),0,'The native account row replaces the plain username row');
  assert.equal(await card.locator('[data-scene-pane="T_Status"]').innerText(),'Online','The historical account layout must receive actual host status');
  assert.equal(await card.locator('[data-scene-pane="P_IcoSyncBase"]').isVisible(),false,'A Nintendo sync state must not be fabricated');
  assert(await card.locator('[data-scene-pane="T_Name"]').innerText());
  await page.locator('.dht-switch-root').locator('..').screenshot({path:'work/themezer-validation/extended-check/historical-user-menu.png'});
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>document.querySelector('.dht-menu-backdrop')?.getAttribute('aria-hidden')==='true');
  assert(await page.locator('.dht-menu--switch button').evaluateAll(buttons=>buttons.every(button=>getComputedStyle(button).pointerEvents==='none')),'A retained exit animation must not leave native buttons interactive');
  await page.waitForTimeout(450);await page.keyboard.press('y');await page.getByRole('button',{name:'Information',exact:true}).click();await page.locator('[data-native-dialog-content="DCntImageText"]').waitFor();await page.getByRole('button',{name:'Steam details',exact:true}).waitFor();await page.locator('.dht-switch-root').locator('..').screenshot({path:'work/themezer-validation/extended-check/native-information.png'});await page.getByRole('button',{name:'Close',exact:true}).click();await page.waitForTimeout(450);
  await page.keyboard.press('y');await page.getByRole('button',{name:'Save data',exact:true}).click();await page.locator('[data-native-dialog-content="DCntSelectSaveData"]').waitFor();await page.getByRole('button',{name:'Local game options',exact:true}).waitFor();await page.locator('.dht-switch-root').locator('..').screenshot({path:'work/themezer-validation/extended-check/native-saves.png'});await page.getByRole('button',{name:'Close',exact:true}).click();await page.waitForTimeout(450);
  await page.evaluate(()=>{window.__captureStart=performance.now();window.__captureReady=false;window.addEventListener('dht:switch-capture-ready',()=>queueMicrotask(()=>{window.__captureReady=true;window.__captureLatency=performance.now()-window.__captureStart;document.getAnimations().filter(a=>a.effect?.pseudoElement?.includes('dht-switch-capture')).forEach(a=>a.pause());}),{once:true});});
  await page.locator('.dht-switch-dock-item[data-name="Settings"]').dispatchEvent('click');await page.waitForFunction(()=>window.__captureReady);assert((await page.evaluate(()=>window.__captureLatency))<1500,'The real theme must capture through the compositor without serialization delay');await page.locator('[data-native-capture-overlay="applet"]').waitFor({state:'attached'});assert.equal(await page.locator('.dht-switch-root').evaluate(el=>el.style.viewTransitionName),'dht-switch-capture');await page.evaluate(()=>document.getAnimations().filter(a=>a.effect?.pseudoElement?.includes('dht-switch-capture')).forEach(a=>a.finish()));await page.locator('[data-native-capture-overlay]').waitFor({state:'detached'});assert.equal(await page.locator('.dht-switch-root').evaluate(el=>el.style.viewTransitionName),'');await page.keyboard.press('Escape');

 }
 if(id==='3595'){
  const source=skin.screens.home.background;
  const bg=await page.locator('.dht-switch-bg').evaluate(el=>({image:getComputedStyle(el).backgroundImage,repeat:getComputedStyle(el).backgroundRepeat,rendering:getComputedStyle(el).imageRendering}));
  assert.equal(bg.rendering,'pixelated');assert.equal(bg.repeat,'repeat');assert(!bg.image.includes(source),'Mirror sampler must generate a reflected period');
  await page.locator('.dht-switch-bg').evaluate(el=>el.getAnimations().forEach(a=>{a.pause();a.currentTime=3000;}));
  await page.locator('.dht-switch-root').locator('..').screenshot({path:'work/themezer-validation/extended-check/mirrored.png'});
  for(let returnIndex=0;returnIndex<2;returnIndex++){
   await page.locator('.dht-switch-bg').evaluate(el=>{window.__previousWallpaperPlayers=el.getAnimations();window.__previousWallpaperPlayers.forEach(a=>{a.currentTime=1600;});window.dispatchEvent(new Event('dht:switch-return-to-home'));});
   await page.waitForFunction(()=>{const next=document.querySelector('.dht-switch-bg')?.getAnimations()??[],previous=window.__previousWallpaperPlayers;return next.length>0&&next.every(a=>!previous.includes(a))&&previous.every(a=>a.playState==='idle');});
   assert(await page.locator('.dht-switch-bg').evaluate(el=>el.getAnimations().every(a=>a.effect.getKeyframes()[0].offset===0)),'Each return must cancel the prior player and create a complete animation starting at frame zero');
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS extended',id);await page.close();
}
 const built=await build({entryPoints:['src/themes/switchConversion.ts'],bundle:true,write:false,format:'esm',platform:'node'});
 const {sampleTrack,paneMotionFrame}=await import('data:text/javascript;base64,'+Buffer.from(built.outputFiles[0].text).toString('base64'));
 const keys=[{frame:0,value:1,slope:0},{frame:0,value:2,slope:0},{frame:45,value:2,slope:0},{frame:45,value:3,slope:0}];
 assert.equal(sampleTrack({interpolation:'step',keys},0),2);assert.equal(sampleTrack({interpolation:'hermite',keys},45),3);
 const frame=paneMotionFrame([{frames:1,loop:false,tracks:[{property:19,interpolation:'step',keys:[{frame:0,value:1.13,slope:0}]},{property:21,interpolation:'step',keys:[{frame:0,value:4,slope:0}]}]}],1);
 const terminal=paneMotionFrame([{frames:200,loop:true,tracks:[{property:21,interpolation:'step',keys:[{frame:0,value:3,slope:0},{frame:1,value:4,slope:0}]}]}],200);assert.equal(terminal.borderWidth,'4px','A looping long hold must not interpolate back to its first pose');
 assert.equal(frame['--dht-nx-uv-x'],'1.13');assert.equal(frame.borderWidth,'4px');
 console.log('PASS duplicate frame discontinuities and animated texture/border channels');
}finally{await browser.close();server.close();}
