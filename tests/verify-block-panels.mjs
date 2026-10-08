import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer();
const browser=await chromium.launch({headless:true});
try {
 const page=await browser.newPage({viewport:{width:1304,height:930}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.route('https://www.minecraft.net/**',r=>r.fulfill({body:'<h1>Browser content</h1>',contentType:'text/html'}));
 await page.goto(url);await page.evaluate(()=>window.__updateTheme({theme:'minecraft',animations:false}));
 const nav=page.locator('.mc-nav');
 for(const label of ['Browser','Friends','Marketplace','Settings']){
  await nav.getByRole('button',{name:label,exact:true}).click();
  await page.locator('.mc-worlds[data-panel-open]').waitFor();
  await page.locator('.mc-content-slot').locator(label==='Marketplace'?'.dht-store':'.dht-destination').waitFor();
  assert.equal(await page.locator('.mc-player-panel').isVisible(),true);
  assert.equal(await nav.isVisible(),true);
  assert.equal(await page.locator('.mc-world-list').isVisible(),false);
  const panel=await page.locator('.mc-worlds').boundingBox();
  const content=await page.locator('.mc-content-slot').boundingBox();
  assert.ok(content.x>=panel.x && content.width<=panel.width);
  await page.locator('[data-dht-root]').screenshot({path:`out/theme-previews/pages/block-panel-${label.toLowerCase()}.png`});
  if(label==='Friends'){
   await page.keyboard.press('Escape');
   await page.locator('.mc-world-list').waitFor();
   assert.equal(await nav.locator('.mc-green').textContent(),'Play›');
  }
 }
 await nav.getByRole('button',{name:'Play',exact:true}).click();
 await page.locator('.mc-world-list').waitFor();
 assert.equal(await page.locator('.mc-content-slot .dht-destination').count(),0);
 const icon=page.locator('.mc-thumbnail').first();
 await page.evaluate(()=>window.__updateTheme({iconSizes:{minecraft:85},tvMode:false}));
 const before=await icon.boundingBox();
 await page.evaluate(()=>window.__updateTheme({tvMode:true}));
 await page.waitForTimeout(250);
 const after=await icon.boundingBox();
 assert.ok(Math.abs(after.width-before.width)<2,`TV icon width ${before.width} -> ${after.width}`);
 assert.equal(await page.evaluate(()=>window.__getThemeSettings().iconSizes.minecraft),85);
 assert.deepEqual(errors,[]);
 console.log('PASS: all Block Worlds sidebar pages stay in the games panel; Play restores games; TV mode preserves chosen icon size.');
} finally {await browser.close();server.close();}
