import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage();await p.goto('http://127.0.0.1:8766/preview/castle-preview.html?h=720');await p.locator('.castle').waitFor();
const nav=p.locator('.cinema-nav');
for(const mode of ['replace','layered']){
 await p.evaluate(m=>window.__updateTheme({castleWindows:m}),mode);
 for(const delay of [30,600]){
 await nav.getByRole('button',{name:'Store',exact:true}).click();await p.waitForTimeout(delay);
 await nav.getByRole('button',{name:'Home',exact:true}).click();await p.locator('.dht-store').waitFor({state:'detached',timeout:3000});assert.equal(await p.locator('.castle').getAttribute('data-summoned'),'false');
 await nav.getByRole('button',{name:'Store',exact:true}).click();await p.locator('.dht-store').waitFor();await nav.getByRole('button',{name:'Home',exact:true}).click();await p.locator('.dht-store').waitFor({state:'detached'});
 }
}
await nav.getByRole('button',{name:'Home',exact:true}).focus();await p.keyboard.press('Escape');await p.keyboard.press('ArrowDown');assert.equal(await nav.locator('[data-selected=true]').innerText(),'Library');assert.equal(await nav.getByRole('button',{name:'Home',exact:true}).evaluate(e=>getComputedStyle(e).outlineStyle),'none');
await b.close();console.log('PASS Home closes/reopens Store during entrance and after opening in both modes; no stale native focus ring.');
