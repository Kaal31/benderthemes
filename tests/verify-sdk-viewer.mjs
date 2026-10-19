import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {resolve} from 'node:path';
import {startThemeViewer,safeFile} from '../sdk/viewer/server.mjs';
import {launch} from './browser.mjs';
assert.equal(safeFile('themes/block-worlds-frame','../gameamp/theme.json'),null);
assert.equal(safeFile('themes/block-worlds-frame','/etc/passwd'),null);
assert.equal(safeFile('themes/block-worlds-frame','.git/config'),null);
const defaults=await startThemeViewer();
try{const inventory=await (await fetch(defaults.url+'/api/themes')).json();assert.ok(inventory.length);assert.ok(inventory.every(t=>t.layout==='frame'));}finally{await new Promise(ok=>defaults.server.close(ok));}
const {server,url}=await startThemeViewer({folders:[resolve('themes/community-starter'),resolve('themes/block-worlds-frame')]});
const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1560,height:1050}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});await page.goto(url);
 const f=()=>page.frameLocator('#frame').frameLocator('iframe');
 await f().getByRole('heading',{name:'Interface showcase'}).waitFor();assert.equal(await page.locator('#frame').getAttribute('sandbox'),'allow-scripts');
 await page.locator('#theme').selectOption('block-worlds-frame');await f().locator('.world').first().waitFor();assert.equal(await f().locator('.world').count(),6);
 await page.locator('#empty').check();await f().getByText('No games match this view.',{exact:false}).waitFor();await page.locator('#empty').uncheck();await f().locator('.world').first().waitFor();
 await f().locator('.world .play').first().click();await page.locator('#action').getByText(/Simulated launch/).waitFor();
 await f().locator('#workshop-link').click();await f().locator('#workshop h1').waitFor();
 await f().locator('#notes-route').click();await f().locator('#notes').waitFor();await f().locator('#note').fill('Standalone viewer save');await f().locator('#save-note').click();
 await page.waitForFunction(()=>JSON.parse(document.querySelector('#saved').value).workshopNote==='Standalone viewer save');
 await f().locator('#next-page').click();await f().locator('#shared-note').getByText('Standalone viewer save',{exact:true}).waitFor();
 await page.locator('#reload').click();await f().locator('#shared-note').getByText('Standalone viewer save',{exact:true}).waitFor();
 await page.locator('#busy').check();assert.equal(await f().locator('body').evaluate(()=>ThemeHub.active),false);
 await page.locator('#busy').uncheck();await page.waitForTimeout(100);assert.equal(await f().locator('body').evaluate(()=>ThemeHub.active),true);
 await page.locator('#size').selectOption('1280x720');assert.equal(await page.locator('#frame').evaluate(n=>n.style.height),'720px');
 await page.locator('#back').click();await f().locator('#notes').waitFor();
 await f().locator('#notes').evaluate(()=>ThemeHub.navigate('https://example.com/page.html'));await page.waitForTimeout(100);assert.match(await page.locator('#frame').getAttribute('src'),/workshop.html/);
 await page.locator('#theme').selectOption('community-starter');await f().locator('h1').waitFor();await page.locator('#theme').selectOption('block-worlds-frame');await f().locator('.world').first().waitFor();
 assert.equal(await page.locator('#saved').evaluate(n=>JSON.parse(n.value).workshopNote),'Standalone viewer save');
 mkdirSync('out/sdk-viewer',{recursive:true});await page.screenshot({path:'out/sdk-viewer/block-worlds.png'});
 assert.deepEqual(errors,[]);console.log('PASS: standalone viewer, code-heavy theme, mock launch, empty library, multi-page saves, reload, lifecycle, sizing, restricted navigation and sandbox.');
}finally{await browser.close();server.close();}
