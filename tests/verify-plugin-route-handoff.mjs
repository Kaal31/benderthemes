import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try {
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=ps5&still=1');const home=page.locator('[data-dht-root]');await home.waitFor();
 for(const route of ['/steamder','/library/app/42','/another-decky-plugin']){
  const before=await page.evaluate(()=>window.__getThemeSettings().theme);
  await page.evaluate(route=>{window.SteamUIStore={...window.SteamUIStore,WindowStore:{GamepadUIMainWindowInstance:{m_history:{location:{pathname:route}}}}};},route);
  // Inputs can arrive before the retained home has finished hiding.
  await page.keyboard.press('c');await page.keyboard.press('ArrowRight');
  await home.waitFor({state:'hidden'});assert.equal(await page.evaluate(()=>window.__getThemeSettings().theme),before);
  assert.equal(await page.locator('[data-dht-stage-active=true]').count(),0);
  await page.evaluate(()=>window.SteamUIStore.WindowStore.GamepadUIMainWindowInstance.m_history.location.pathname='/library/home');
  await home.waitFor({state:'visible'});await page.locator('[data-dht-stage-active=true]').waitFor();
 }
 assert.deepEqual(errors,[]);console.log('PASS retained home yields visibility, theme activity and controller input to Steamder and other routes; restores on Home');
}finally{await browser.close();server.closeAllConnections();server.close();}
