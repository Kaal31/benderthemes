import {chromium} from 'playwright';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1304,height:820}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=pathToFileURL(resolve('preview/preview.html')).href;
const themes=['vita','ps2','psp','ps3','ps4','ps5','xbox','x360','aero','dial'];
for(const theme of themes){
 await page.goto(url+`?theme=${theme}&h=720&still=1`);await page.locator('[data-dht-root]').waitFor();await page.waitForTimeout(350);
 await page.locator('[data-dht-root]').screenshot({path:`preview/audit-${theme}.png`});
 await page.evaluate(()=>window.__openPlace('settings'));await page.locator('.dht-destination[data-place=settings]').waitFor();
 await page.getByText('Presets',{exact:true}).last().click();
 assert.deepEqual(await page.locator('.dht-menu-item > span:first-child').allTextContents(),['Sony','Microsoft','Bonus']);
 await page.keyboard.press('Escape');await page.keyboard.press('Escape');
 if(theme!=='ps2'){
  await page.evaluate(()=>window.__openPlace('library'));await page.locator('.dht-destination[data-place=library]').waitFor();
  await page.getByRole('textbox',{name:'Search games'}).fill('Starfall');assert.equal(await page.locator('.dht-destination-row').count(),1);
  await page.locator('.dht-destination-row').click();await page.locator('.dht-destination[data-place=game]').waitFor();
  await page.locator('.dht-destination-row').first().click();await page.locator('.dht-launch').waitFor();
  await page.keyboard.press('Escape');await page.locator('.dht-launch').waitFor({state:'hidden'});
  await page.keyboard.press('Escape');await page.locator('.dht-destination[data-place=library]').waitFor();await page.keyboard.press('Escape');
 }
 await page.evaluate(()=>window.__openPlace('store'));await page.locator('.dht-store').waitFor();await page.keyboard.press('y');await page.locator('.dht-store-search').waitFor();
 await page.getByRole('textbox',{name:'Search Store',exact:true}).fill('Starfall');await page.getByRole('button',{name:'Search',exact:true}).click();await page.locator('.dht-store-search').waitFor({state:'hidden'});await page.keyboard.press('Escape');
 console.log('PASS themed destinations, presets, launch and Store:',theme);
}
for(const xs of ['blades','nxe','kinect']){await page.goto(url+`?theme=x360&xs=${xs}&h=720&still=1`);await page.waitForTimeout(300);await page.locator('[data-dht-root]').screenshot({path:`preview/audit-${xs}.png`});}
assert.deepEqual(errors,[]);await browser.close();

