import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer();const browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(url);await page.locator('[data-dht-root]').waitFor();
 await page.waitForTimeout(250);await page.evaluate(()=>window.__openThemeSettings());
 await page.locator('.dht-menu-item').filter({hasText:/Screensaver/}).click();
 await page.getByText('Mode: Steam default',{exact:true}).click();
 await page.getByText('This theme’s media',{exact:true}).click();
 const key=await page.evaluate(()=>window.__getThemeSettings().activeTheme||window.__getThemeSettings().theme);
 assert.equal(await page.evaluate(key=>window.__getThemeSettings().themeScreensavers[key].mode,key),'custom');
 // Navigate back to the same nested section and change slideshow duration.
 await page.keyboard.press('Escape');
 await page.waitForTimeout(250);await page.evaluate(()=>window.__openThemeSettings());
 await page.locator('.dht-menu-item').filter({hasText:/Screensaver/}).click();
 await page.getByText('Slide duration: 15 seconds',{exact:true}).click();
 await page.getByText('30 seconds',{exact:true}).click();
 assert.equal(await page.evaluate(key=>window.__getThemeSettings().themeScreensavers[key].duration,key),30);
 await page.waitForTimeout(250);await page.evaluate(()=>window.__openThemeSettings());
 await page.locator('.dht-menu-item').filter({hasText:/^Screensaver/}).click();
 await page.getByText('Slide duration: 30 seconds',{exact:true}).waitFor();
 await page.locator('[data-dht-root]').screenshot({path:'out/screensaver-settings.png'});
 assert.deepEqual(errors,[]);
 console.log('PASS nested theme settings: independent mode and photo duration saved through UI.');
} finally {await browser.close();server.close();}
