import assert from 'node:assert/strict';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0);
const browser=await launch();
try {
  const page=await browser.newPage({viewport:{width:1280,height:800}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.goto(url+'?protondb=1');
  await page.waitForFunction(()=>window.__openGame&&window.__getThemeLibrary);
  await page.evaluate(()=>window.__updateTheme({animations:false,protondbThemes:{},badges:{protondb:true,deck:false}}));
  await page.evaluate(()=>window.__openGame(window.__getThemeLibrary().games.find(g=>!g.shortcut).appid));
  await page.locator('.dht-destination[data-place="game"]').waitFor();
  assert.equal(await page.locator('.dht-badge--protondb').count(),0,'legacy global true must not enable a default badge');
  assert.equal(await page.getByRole('button',{name:'ProtonDB reports',exact:true}).count(),0);
  await page.keyboard.press('Escape');
  await page.locator('.dht-destination[data-place="game"]').waitFor({state:'detached'});
  for(const theme of ['ps1','ps2','ps3','psp','vita','ps4','ps5','xbox','x360','wii','wiiu','switch','n3ds']) {
    await page.evaluate(theme=>window.__updateTheme({theme,animations:false,protondbThemes:{[theme]:true},badges:{protondb:true,deck:true}}),theme);
    await page.waitForFunction(theme=>document.querySelector('[data-dht-root]')?.getAttribute('data-dht-theme')===theme,theme);
    await page.evaluate(()=>window.__openGame(window.__getThemeLibrary().games.find(g=>!g.shortcut).appid));
    const details=page.locator('.dht-destination[data-place="game"]');await details.waitFor();
    await details.locator('.dht-badge--protondb').waitFor();
    assert.equal(await details.getByRole('button',{name:'ProtonDB reports',exact:true}).count(),1,theme);
    assert.equal(await details.locator('.dht-row-label').filter({hasText:/^Steam game page$/}).count(),1,theme);
    assert.equal(await details.locator('.dht-badge--protondb').getAttribute('type'),'button');
    await page.keyboard.press('Escape');await details.waitFor({state:'detached'});
  }
  await page.evaluate(()=>window.__updateTheme({theme:'ps4',animations:false,protondbThemes:{ps4:false,ps5:true}}));
  await page.waitForFunction(()=>document.querySelector('[data-dht-root]')?.getAttribute('data-dht-theme')==='ps4');
  await page.keyboard.press('y');
  await page.locator('.dht-menu-item').filter({hasText:/^Customize/}).click();
  await page.locator('.dht-menu-item').filter({hasText:/^Library/}).click();
  const toggle=page.locator('.dht-menu-item').filter({hasText:'ProtonDB badges (this theme)'});
  await toggle.waitFor();await toggle.click();
  assert.equal(await page.evaluate(()=>window.__getThemeSettings().protondbThemes.ps4),true);
  assert.equal(await page.evaluate(()=>window.__getThemeSettings().protondbThemes.ps5),true);
  // Toggle again through the context menu, without changing another theme.
  if(!await toggle.count()){
    await page.keyboard.press('y');
    await page.locator('.dht-menu-item').filter({hasText:/^Customize/}).click();
    await page.locator('.dht-menu-item').filter({hasText:/^Library/}).click();
  }
  await toggle.click();
  assert.equal(await page.evaluate(()=>window.__getThemeSettings().protondbThemes.ps4),false);
  assert.equal(await page.evaluate(()=>window.__getThemeSettings().protondbThemes.ps5),true);
  await page.keyboard.press('Escape');await page.keyboard.press('Escape');await page.keyboard.press('Escape');
  await page.evaluate(()=>window.__updateTheme({protondbThemes:{ps4:true}}));
  await page.getByRole('button',{name:'Hub',exact:true}).first().click();
  await page.locator('.dht-market').waitFor();
  for(const style of ['neutral','ps3','ps5','vita','xbox','x360','wii','switch','iisu','minecraft']) {
    await page.evaluate(hubStyle=>window.__updateTheme({hubStyle}),style);
    assert.equal(await page.locator('.dht-market .dht-badge--protondb').count(),0);
    assert.equal(await page.locator('[data-dht-root] .dht-badge--protondb:visible').count(),0,`Hub ${style}: no ProtonDB`);
  }
  assert.deepEqual(errors,[]);
  console.log('PASS shared ProtonDB badges, controller report actions and native plugin fallback across 13 console themes');
} finally {await browser.close();await new Promise(resolve=>server.close(resolve));}
