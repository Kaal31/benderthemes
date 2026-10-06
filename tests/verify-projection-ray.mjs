import {chromium} from 'playwright';import {pathToFileURL} from 'node:url';import {resolve} from 'node:path';import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1304,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
await p.goto(pathToFileURL(resolve('preview/dial-preview.html')).href+'?h=720');await p.locator('.alien-mechanism').waitFor();await p.waitForTimeout(400);await p.keyboard.press('ArrowRight');await p.locator('.alien-projection').waitFor();assert.equal(await p.locator('.alien-projection-ray').count(),0);
await p.keyboard.press('y');assert.equal(await p.getByText('Projection ray',{exact:true}).count(),0);
await p.goto(pathToFileURL(resolve('preview/preview.html')).href+'?theme=vita&h=720&still=1');await p.locator('.dht-bubble-float').first().waitFor();await p.waitForTimeout(300);await p.locator('[data-dht-root]').screenshot({path:'preview/revision-vita.png'});
assert.deepEqual(errors,[]);await b.close();console.log('PASS: projection ray and option removed, Vita render.');
