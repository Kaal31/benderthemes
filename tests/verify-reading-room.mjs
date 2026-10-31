import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { pathToFileURL } from 'node:url';
import {readFileSync,writeFileSync,unlinkSync} from 'node:fs';
const runtimeFile=process.cwd()+'/preview/.reading-runtime-check.html';
writeFileSync(runtimeFile,readFileSync('preview/reading-preview.html','utf8').replace('window.__isThemePreview=true','window.__isThemePreview=false'));
const browser=await chromium.launch();
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://raw.githubusercontent.com/**',route=>route.abort());
 await page.goto(pathToFileURL(process.cwd()+'/preview/reading-preview.html').href);
 await page.waitForSelector('.rr-home');
 assert.equal(await page.locator('[data-reading-window=recent]').count(),1);
 await page.getByRole('button',{name:'Preview game page',exact:true}).click();
 await page.waitForSelector('.rr-page-notebook');
 await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Preview launch screen',exact:true}).click();
 await page.waitForSelector('.dht-launch[data-console=reading]');
 assert.match(await page.locator('.dht-launch-panel').evaluate(el=>getComputedStyle(el).backgroundImage),/repeating-linear-gradient/);
 await page.keyboard.press('Escape');
 // Preserve the browser harness while rendering runtime-only controls.
 await page.goto(pathToFileURL(runtimeFile).href);
 await page.waitForSelector(".rr-home");
 assert.equal(await page.locator('.rr-menu-button,.rr-audio-test,.rr-game-test,.rr-wallpaper-preview').count(),0);
 await page.keyboard.press('F1');
 await page.locator('.rr-nav button').filter({hasText:'Collections'}).click();
 await page.waitForSelector('.rr-page-notebook');
 assert.equal(await page.locator('.dht-destination[data-place=collections]').count(),1);
 assert.deepEqual(errors,[]);
 console.log('Reading Room: runtime controls hidden, Steam menu toggle, Collections, game page and paper launch passed.');
} finally {await browser.close();unlinkSync(runtimeFile);}
