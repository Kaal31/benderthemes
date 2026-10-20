import assert from 'node:assert/strict';
import {resolve} from 'node:path';
import {startThemeViewer,safeFile} from '../sdk/viewer/server.mjs';
import {launch} from './browser.mjs';
const fixture=resolve('tests/fixtures/themes/frame-test');
assert.equal(safeFile(fixture,'../other/theme.json'),null);
assert.equal(safeFile(fixture,'/etc/passwd'),null);
assert.equal(safeFile(fixture,'.git/config'),null);
const defaults=await startThemeViewer();
try{
 const inventory=await (await fetch(defaults.url+'/api/themes')).json();
 assert.ok(inventory.every(t=>t.layout==='frame'));
 assert.ok(!inventory.some(t=>['community-starter','block-worlds-frame'].includes(t.id)));
}finally{await new Promise(ok=>defaults.server.close(ok));}
const {server,url}=await startThemeViewer({folders:[fixture]});
const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1560,height:1050}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(url);
 const frame=page.frameLocator('#frame').frameLocator('iframe');
 await frame.locator('.card').first().waitFor();
 assert.equal(await page.locator('#frame').getAttribute('sandbox'),'allow-scripts');
 await frame.locator('.card').first().click();
 await page.locator('#action').getByText(/Simulated launch/).waitFor();
 await page.locator('#empty').check();await frame.getByText('No games in this view',{exact:true}).waitFor();
 await page.locator('#empty').uncheck();await frame.locator('.card').first().waitFor();
 await page.locator('#reload').click();await frame.locator('.card').first().waitFor();
 await page.locator('#size').selectOption('1280x720');assert.equal(await page.locator('#frame').evaluate(n=>n.style.height),'720px');
 assert.deepEqual(errors,[]);
 console.log('PASS: standalone SDK viewer uses a test-only fixture; removed demos absent; sandbox, mock launch, empty library, reload and sizing work');
}finally{await browser.close();await new Promise(ok=>server.close(ok));}
