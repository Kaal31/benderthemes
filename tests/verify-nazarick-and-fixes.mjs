import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1304,height:890}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
const base='http://127.0.0.1:8770/preview/';
try{
await p.goto(base+'nazarick-preview.html?h=800');await p.locator('.naz-home').waitFor();await p.waitForTimeout(600);
assert.equal(await p.locator('.naz-games button').count(),7);
assert.equal(await p.locator('.naz-games img').evaluateAll(es=>es.every(e=>e.complete&&e.naturalWidth>0&&!e.src.startsWith('data:image/svg'))),true);
await p.keyboard.press('ArrowRight');await p.waitForTimeout(150);assert.match(await p.locator('.naz-now').textContent(),/Baldur/);
await p.locator('[data-dht-root]').screenshot({path:'work/nazarick-home-final.png'});
for(const [label,page] of [['Library','library'],['Store','store'],['Friends','friends'],['Downloads','downloads'],['Settings','settings']]){
 await p.locator('.naz-top nav').last().getByRole('button',{name:new RegExp('^'+label+'$','i')}).click();
 const surface=page==='store'?p.locator('.dht-store'):p.locator('.dht-destination');await surface.waitFor();
 const wall=surface.locator('.naz-backdrop');assert.equal(await wall.getAttribute('data-wallpaper'),page);
 assert.ok(await wall.evaluate(e=>getComputedStyle(e).backgroundImage.includes('data:image')));
 await p.waitForTimeout(650);await surface.screenshot({path:`work/nazarick-${page}.png`});
 await surface.locator('.naz-top nav').getByRole('button',{name:'home',exact:true}).click();await surface.waitFor({state:'detached'});
}
for(const label of ['Store','Friends','Downloads','Settings','Library','Home']){await p.locator('.naz-top nav').last().getByRole('button',{name:new RegExp('^'+label+'$','i')}).click();await p.waitForTimeout(400);}await p.locator('.naz-home').waitFor();
await p.keyboard.press('x');await p.locator('.dht-menu--nazarick').waitFor();await p.keyboard.press('Escape');
await p.evaluate(()=>window.__updateTheme({animations:false}));await p.waitForTimeout(150);assert.equal(await p.locator('.naz-wheel-art').evaluate(e=>getComputedStyle(e).animationName),'none');
await p.goto(base+'minecraft-preview.html?h=800');await p.locator('.mc-nav').waitFor();assert.equal(await p.locator('.mc-nav .mc-clean-icon').count(),4);assert.equal(await p.locator('.mc-nav .mc-icon').count(),0);await p.locator('.mc-nav').screenshot({path:'work/minecraft-clean-icons.png'});
await p.goto(base+'republic-preview.html?h=800');await p.locator('.republic').waitFor();assert.match(await p.locator('.republic footer').evaluate(e=>getComputedStyle(e).fontFamily),/AurebeshEnglish/);
await p.locator('.cinema-nav button').filter({hasText:'Settings'}).click();await p.locator('.dht-destination').waitFor();assert.equal(await p.locator('.dht-destination-row').evaluateAll(es=>es.every(e=>getComputedStyle(e).fontFamily.includes('AurebeshEnglish'))),true);await p.locator('.dht-destination').screenshot({path:'work/republic-settings-english.png'});
await p.goto(base+'pain-preview.html?h=800');await p.locator('.pain-home').waitFor();assert.equal(await p.locator('.pain-orbit-symbol').count(),4);assert.equal(await p.locator('.pain-orbits text').count(),0);
const p2=await b.newPage();await p2.addInitScript(()=>{let art;Object.defineProperty(window,'__referenceArt',{get(){return art},set(v){for(const a of Object.values(v))a.logo=[];art=v;},configurable:true});});await p2.route('**/logo.png',r=>r.abort());await p2.goto(base+'pain-preview.html?h=800');await p2.locator('.pain-logo-name').waitFor();assert.equal(await p2.locator('.pain-feature-logo').textContent(),'Elden Ring');assert.equal(await p2.locator('.pain-feature-logo').evaluate(e=>e.querySelector('div')!==null),false);await p2.locator('.pain-feature').screenshot({path:'work/pain-logo-fallback.png'});await p2.close();
assert.deepEqual(errors,[]);console.log('PASS: Nazarick six backgrounds, live covers/selection, destinations/back/options, motion off; transparent Minecraft icons; Republic English settings/prompts; Pain vector symbols and missing-logo fallback.');
}finally{await b.close()}
