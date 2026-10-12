import {launch,BASE} from './browser.mjs';import assert from 'node:assert/strict';
const b=await launch();const p=await b.newPage({viewport:{width:1304,height:890}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{for(const theme of ['wii','wiiu']){
 await p.goto(`${BASE}/preview/${theme}-preview.html?h=800`);await p.locator('.nt-home').waitFor();await p.waitForTimeout(700);
 assert.equal(await p.locator('.nt-tile').count(),theme==='wii'?12:15);
 await p.locator('[data-dht-root]').screenshot({path:`work/${theme}-home.png`});
 const game=p.locator('.nt-tile').filter({hasText:'Cyberpunk 2077'});await game.click();await p.locator('.nt-banner').waitFor();await p.keyboard.press('Escape');assert.equal(await p.locator('.nt-banner').count(),0);
 await p.keyboard.press('ArrowRight');await p.keyboard.press('Enter');await p.locator('.nt-banner').waitFor();await p.keyboard.press('Enter');await p.locator('.dht-launch').waitFor();assert.equal(await p.locator('.dht-launch').getAttribute('data-console'),theme);await p.keyboard.press('Escape');await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Next page',exact:true}).click({force:true});assert.equal(await p.locator('.nt-pages [aria-current]').getAttribute('aria-label'),'Page 2');await p.getByRole('button',{name:'Previous page',exact:true}).click({force:true});
 await p.keyboard.press('x');await p.locator(`.dht-menu--${theme}`).waitFor();await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Shop',exact:true}).click();await p.locator('.dht-store').waitFor();await p.locator('[data-dht-root]').screenshot({path:`work/${theme}-store.png`});await p.keyboard.press('Escape');
 await p.getByRole('button',{name:'Library',exact:true}).click();await p.locator('.dht-destination').waitFor();await p.keyboard.press('Escape');
 await p.evaluate(()=>window.__updateTheme({animations:false}));await p.waitForTimeout(80);assert.equal(await p.locator('[data-dht-root] .nt-grid').evaluate(e=>getComputedStyle(e).animationName),'none');
}
assert.deepEqual(errors,[]);console.log('PASS Wii/Wii U: grid, real artwork, game banner, controller launch, pagination, options, shop, library, reduced animation');}finally{await b.close()}

