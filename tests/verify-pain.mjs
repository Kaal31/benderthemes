import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1304,height:920}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
await p.goto('http://127.0.0.1:8766/preview/pain-preview.html?h=800');await p.locator('.pain-home').waitFor();
assert.equal(await p.locator('.pain-recent .pain-card').count(),5);assert.equal(await p.locator('.pain-installed .pain-card').count(),4);
assert.ok(await p.locator('.pain-home').evaluate(e=>getComputedStyle(e).backgroundImage.includes('data:image')));
await p.keyboard.press('ArrowUp');assert.equal(await p.locator('.pain-installed [data-focus=true]').count(),1);
await p.keyboard.press('ArrowUp');await p.keyboard.press('ArrowRight');assert.match(await p.locator('.pain-recent [data-focus=true]').getAttribute('aria-label'),/Hades/);
await p.locator('.pain-next').click();assert.equal(await p.locator('.pain-recent .pain-card').count(),4);
await p.keyboard.press('x');await p.locator('.dht-menu--pain').waitFor();assert.match(await p.locator('.dht-menu--pain').textContent(),/Presets/);await p.keyboard.press('Escape');
await p.locator('.pain-nav button').first().click();await p.locator('.dht-destination[data-theme=pain][data-place=library]').waitFor();await p.keyboard.press('Escape');
await p.evaluate(()=>window.__updateTheme({animations:false}));await p.waitForTimeout(100);assert.equal(await p.locator('.pain-orbit-light').evaluate(e=>getComputedStyle(e).animationName),'none');
await p.evaluate(()=>window.__updateTheme({animations:true}));await p.emulateMedia({reducedMotion:'reduce'});assert.equal(await p.locator('.pain-orbit-light').evaluate(e=>getComputedStyle(e).animationName),'none');await p.emulateMedia({reducedMotion:'no-preference'});
const featuredName=await p.locator('.pain-feature-name strong').textContent();await p.locator('.pain-feature-actions button').first().click();await p.waitForTimeout(150);assert.ok((await p.locator('.dht-launch').textContent()).includes(featuredName));
for(const h of [720,800]){await p.goto(`http://127.0.0.1:8766/preview/pain-preview.html?h=${h}`);await p.locator('.pain-home').waitFor();await p.waitForTimeout(600);const home=await p.locator('.pain-home').boundingBox();for(const q of ['.pain-nav','.pain-installed','.pain-recent','.pain-feature']){const r=await p.locator(q).boundingBox();assert.ok(r.x>=home.x&&r.y>=home.y&&r.x+r.width<=home.x+home.width+1&&r.y+r.height<=home.y+home.height+1);}}
await p.locator('.pain-home').screenshot({path:'preview/pain-final.png'});assert.deepEqual(errors,[]);console.log('PASS: artwork, layout 720/800, focus, pagination, themed library/options, reduced motion and launch.');
}finally{await b.close();}
