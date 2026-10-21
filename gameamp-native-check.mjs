import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8769/gameamp-native-preview.html');await page.locator('#dashboard').waitFor();
 assert.equal(await page.locator('iframe').count(),0);
 await page.locator('.game').nth(1).click();await page.locator('#play').click();assert(await page.evaluate(()=>nativeCalls.some(c=>c[0]==='launch'&&c[1]===620)));
 const dockBefore=await page.locator('footer').boundingBox();await page.locator('footer [data-open=store]').click();assert.deepEqual(await page.locator('footer').boundingBox(),dockBefore);await page.locator('footer [data-open=friends]').click();await page.locator('.transport [data-open=library]').click();
 const windows=page.locator('.page-window:not([hidden])');assert.equal(await windows.count(),3);await windows.nth(2).locator('.amp-library-card').first().click();assert.equal(await windows.count(),4);
 await windows.nth(3).locator('.amp-game-detail').waitFor();assert.equal(await page.locator('footer button.page-open').count(),2);
 for(let i=3;i>=0;i--)await windows.nth(i).locator('.window-close').click();assert(await page.locator('#home').evaluate(e=>e.classList.contains('page-open')));
 await page.evaluate(()=>nativeInput({btn:'right'}));assert.equal(await page.locator('#game-title').textContent(),'HADES');
 await page.locator('.transport [data-open=downloads]').click();await windows.nth(0).locator('.download-row').first().waitFor();await windows.nth(0).locator('.window-close').click();
 await page.locator('.transport [data-open=options]').click();await windows.nth(0).locator('.setting-toggle').first().waitFor();await windows.nth(0).locator('.setting-toggle').first().click();assert.equal(await page.evaluate(()=>nativeApi.settings.animations),false);await windows.nth(0).locator('.window-close').click();
 await page.evaluate(()=>nativeBands=Array(16).fill(150));await page.locator('#visualizer.audio-active').waitFor();await page.evaluate(()=>nativeBands=Array(16).fill(0));await page.locator('#audio-meter.idle').waitFor();
 await page.setViewportSize({width:960,height:600});await page.waitForFunction(()=>Math.round(document.querySelector('#root>div').shadowRoot.getElementById('dashboard').getBoundingClientRect().width)===960);
 await page.setViewportSize({width:1280,height:800});await page.screenshot({path:'../GameAmp-native-preview.png'});
 await page.evaluate(()=>nativeRoot.unmount());await page.waitForTimeout(150);assert.equal(await page.locator('#dashboard').count(),0);assert.deepEqual(errors,[]);
 console.log('PASS: native mount with zero iframes, direct launch/settings/input, stacked windows and lights, reactive meters, scaling and unmount');
}finally{await browser.close();}
