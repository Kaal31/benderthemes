import {chromium} from 'playwright';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
import assert from 'node:assert/strict';
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1304,height:900}});
const errors=[];page.on('pageerror',e=>errors.push(e.message));
const url=pathToFileURL(resolve('preview/dial-preview.html')).href;
await page.goto(url);const dial=page.locator('.alien-dial');await dial.waitFor();
assert.equal(await dial.getAttribute('data-active'),'false');
const initial=await page.locator('.alien-game[data-selected=true]').getAttribute('data-name');
await page.keyboard.press('ArrowRight');
await page.waitForTimeout(450);
assert.equal(await dial.getAttribute('data-active'),'true');
assert.notEqual(await page.locator('.alien-game[data-selected=true]').getAttribute('data-name'),initial);
assert.equal(await page.locator('.alien-projection').count(),1);
assert.equal(await page.locator('.alien-mechanism image').count(),0);
assert.ok(await page.locator('.alien-hologram-card img').evaluate(e=>getComputedStyle(e).filter.includes('image-green')));
assert.equal(await page.locator('.alien-hologram-scan').count(),1);
await page.keyboard.press('y');
assert.equal(await page.getByText('Dial appearance',{exact:true}).count(),0);
await page.getByText('Reflections',{exact:true}).click();await page.getByText('Off',{exact:true}).click();
assert.equal(await dial.getAttribute('data-reflections'),'false');
assert.equal(await page.locator('.alien-dial-reflection').count(),0);
await page.keyboard.press('Escape');
for(const activation of ['off','always','on-browse']){
 await page.evaluate(activation=>window.__updateTheme({dial:{look:'classic',motion:'rotate',activation,reflections:true,sound:'off'}}),activation);
 await page.waitForTimeout(50);
 assert.equal(await dial.getAttribute('data-active'),activation==='off'?'false':'true');
}
for(const motion of ['rotate','pulse','hologram','none']){
 await page.evaluate(motion=>window.__updateTheme({dial:{look:'classic',motion,activation:'always',reflections:true,sound:'off'}}),motion);
 await page.keyboard.press('ArrowRight');await page.waitForTimeout(50);assert.equal(await dial.getAttribute('data-animation'),motion);
}
await page.goto(url+'?count=1');await dial.waitFor();await page.keyboard.press('ArrowRight');await page.waitForTimeout(50);assert.equal(await dial.getAttribute('data-active'),'true');
await page.goto(url+'?empty=1');await page.locator('.alien-empty').waitFor();assert.equal(await page.locator('.alien-mechanism').isDisabled(),true);
for(const width of [1280,1920,3840]){
 await page.setViewportSize({width,height:Math.round(width*9/16)+100});
 await page.goto(url+'?tvMode=1&h=720');await dial.waitFor();
 await page.keyboard.press('ArrowRight');await page.keyboard.press('y');await page.waitForTimeout(100);
 const boxes=await page.locator('.dht-menu-item').evaluateAll(items=>items.filter(x=>x.getBoundingClientRect().height).map(x=>({w:x.getBoundingClientRect().width,h:x.getBoundingClientRect().height})));
 assert.ok(boxes.length>0);assert.ok(boxes.every(x=>x.w>150&&x.h>30));
}
assert.deepEqual(errors,[]);await browser.close();
console.log('PASS: Dial activation, floating cover projection/tint, no alternate dials, reflection toggle, motions, single/empty libraries, and TV menu sizing.');
