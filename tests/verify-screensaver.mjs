import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';
import { launch } from './browser.mjs';
const source = await readFile(new URL('../src/screensaver.ts', import.meta.url), 'utf8');
const fn = source.slice(source.indexOf('export function screensaverVisible'), source.indexOf('export function useSteamScreensaver'));
const {code} = await transform(fn.replace('export ', ''), {loader:'ts'});
const browser = await launch();
try {
 const page = await browser.newPage();
 await page.setContent('<div data-dht-root><img style="width:100vw;height:100vh"></div>');
 await page.evaluate('(() => {' + code + ';window.detectSaver=screensaverVisible;})()');
 const detect = () => page.evaluate(() => window.detectSaver([document], 'native-saver'));
 assert.equal(await detect(), false, 'ordinary fullscreen artwork is not a screensaver');
 await page.evaluate(() => { const el=document.createElement('div'); el.className='native-saver'; el.style.cssText='position:fixed;inset:0'; document.body.append(el); });
 assert.equal(await detect(), true, 'native screensaver host detected');
 await page.evaluate(() => document.querySelector('.native-saver').style.display='none');
 assert.equal(await detect(), false, 'hidden host releases theme');
 await page.evaluate(() => { const el=document.querySelector('.native-saver'); el.style.display='block'; document.querySelector('[data-dht-root]').append(el); });
 assert.equal(await detect(), false, 'theme content cannot be mistaken for a native saver');
 await page.evaluate(() => { const f=document.createElement('iframe'); document.body.append(f); f.contentDocument.body.innerHTML='<div class="native-saver" style="position:fixed;inset:0"></div>'; });
 assert.equal(await page.evaluate(() => window.detectSaver([document,document.querySelector('iframe').contentDocument], 'native-saver')), true, 'separate Steam document supported');
 assert.equal(await page.evaluate(() => window.detectSaver([document], undefined)), false, 'unknown CSS mapping leaves Steam alone');
 console.log('PASS screensaver: native host, dismissal, theme exclusion, separate documents, missing mapping');
} finally { await browser.close(); }
