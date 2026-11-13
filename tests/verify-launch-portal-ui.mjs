import {chromium} from 'playwright';import assert from 'node:assert/strict';
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8911/preview/library-artwork-fixes.html?theme=wiiu&still=1');await page.locator('.nt-game-icon').first().waitFor();
 await page.evaluate(()=>{
  window.__events={life:[],focus:[],task:[],error:[]};
  const register=kind=>fn=>{window.__events[kind].push(fn);return{unregister(){window.__events[kind]=window.__events[kind].filter(x=>x!==fn)}}};
  window.SteamClient={Apps:{RunGame:()=>Promise.resolve(),RegisterForGameActionTaskChange:register('task'),RegisterForGameActionShowError:register('error')},GameSessions:{RegisterForAppLifetimeNotifications:register('life')},System:{UI:{RegisterForFocusChangeEvents:register('focus')}},Overlay:{SetOverlayState(){}}};
  window.__stopReturn=window.__startGameReturn();window.__stopPortal=window.__startLaunchPortal();
  window.__beginNativeLaunch(window.__libraryGame(1000));
 });
 await page.locator('[data-theme-launch-portal] .dht-launch').waitFor();assert.equal(await page.locator('.dht-launch').count(),1,'Only one launch surface renders');
 await page.evaluate(()=>{window.SteamUIStore={WindowStore:{GamepadUIMainWindowInstance:{m_history:{location:{pathname:'/library/app/1000'}}}}};});
 await page.waitForTimeout(350);
 assert.equal(await page.locator('[data-theme-launch-portal] .dht-launch').isVisible(),true,'Launch surface survives native route changes');
 await page.evaluate(()=>window.__events.task.forEach(fn=>fn(0,1000,0,'ShowInstallDialog')));
 await page.locator('[data-theme-launch-portal] .dht-launch').waitFor({state:'detached'});
 await page.evaluate(()=>window.__events.task.forEach(fn=>fn(0,1000,0,'CreatingProcess')));
 await page.locator('[data-theme-launch-portal] .dht-launch').waitFor();
 await page.evaluate(()=>{window.__events.life.forEach(fn=>fn({unAppID:1000,bRunning:true}));window.__events.focus.forEach(fn=>fn({focusedApp:{appid:1000},rgFocusable:[]}));});
 await page.waitForFunction(()=>window.__launchState()===null);
 assert.equal(await page.evaluate(()=>window.__events.life.length),1,'Session observer remains after launch observers are removed');
 await page.evaluate(()=>{window.__returned=0;window.addEventListener('themehub-game-return',()=>window.__returned++);window.__events.life.forEach(fn=>fn({unAppID:1000,bRunning:false}));});
 await page.waitForFunction(()=>window.__returned>0);
 await page.evaluate(()=>{window.__stopReturn();window.__stopPortal()});
 assert.equal(await page.locator('[data-theme-launch-portal]').count(),0);assert.deepEqual(errors,[]);
 console.log('PASS one persistent launch surface, native-route survival, Steam prompt handoff, independent exit observer and cleanup');
}finally{await browser.close()}
