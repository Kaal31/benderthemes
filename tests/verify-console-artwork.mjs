import assert from 'node:assert/strict';import {chromium} from 'playwright';
const browser=await chromium.launch({channel:'msedge',headless:true});try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 const base='http://127.0.0.1:8911/preview/x360-original-icons.html?theme=x360&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883';
 const press=async button=>{await page.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);await page.waitForTimeout(180);};
 await page.goto(base+'&xs=nxe&consoleArt=1');await page.waitForTimeout(6500);
 assert(await page.locator('[data-nxe-artwork="original"]').count()>0,'Installed original pack takes precedence');
 await page.evaluate(()=>window.__updateTheme({originalConsoleArtwork:false}));await page.waitForTimeout(250);assert.equal(await page.locator('[data-nxe-artwork="original"]').count(),0,'Explicit fallback restores original vectors');
 await page.screenshot({path:'preview/nxe-artwork-fallback.png'});
 await page.evaluate(()=>window.__updateTheme({originalConsoleArtwork:true}));await page.waitForTimeout(250);assert(await page.locator('[data-nxe-artwork="original"]').count()>0);
 for(let i=0;i<6;i++)await press(9);for(let i=0;i<11;i++)await press(12);await press(1);
 const achievements=page.getByRole('dialog',{name:'Achievements',exact:true});await achievements.waitFor();assert((await achievements.getByRole('listbox').boundingBox()).width>700);await page.screenshot({path:'preview/nxe-achievements-video-corrected.png'});await press(2);
 await page.goto(base+'&xs=blades&consoleArt=1');await page.waitForTimeout(6500);
 const banner=page.getByRole('button',{name:'Theme Hub',exact:true});assert(await banner.count());assert((await banner.evaluate(e=>getComputedStyle(e).backgroundImage)).includes('data:image/png;base64'));
 await page.screenshot({path:'preview/blades-themehub-banner.png'});
 await page.evaluate(()=>window.__updateTheme({originalConsoleArtwork:false}));await page.waitForTimeout(350);assert(await banner.count());await page.screenshot({path:'preview/blades-artwork-fallback.png'});
 assert.deepEqual(errors,[]);console.log('PASS optional original artwork, explicit vector fallback, full-width achievements, Theme Hub banner with/without external pack');
}finally{await browser.close();}
