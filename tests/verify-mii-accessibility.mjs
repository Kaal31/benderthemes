import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{const page=await browser.newPage({viewport:{width:1280,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('http://127.0.0.1:8742/mii-interactive-demo.html');
const palette=page.getByRole('radiogroup').first();assert.equal(await palette.getByRole('radio').count()>=30,true);await palette.getByRole('radio').nth(4).focus();await page.keyboard.press('ArrowRight');assert.equal(await palette.getByRole('radio').nth(5).getAttribute('aria-checked'),'true');
for(let i=0;i<7;i++){await page.getByRole('button',{name:'Next preview pose',exact:true}).click();await page.waitForTimeout(180);}
await page.getByRole('button',{name:'Next eyes',exact:true}).click();await page.getByRole('button',{name:'Next mouth',exact:true}).click();
await page.screenshot({path:'preview/mii-accessible-creator.png'});await page.getByRole('button',{name:'Branding',exact:true}).click();await page.getByRole('button',{name:'Next artwork',exact:true}).click();await page.getByText(/^Applied:/).waitFor();
assert.equal(await page.getByLabel('Artwork x rotation').count(),0);assert.equal(await page.getByLabel('Artwork y rotation').count(),0);await page.getByLabel('Artwork rotation',{exact:true}).fill('23');await page.getByRole('button',{name:'Save Mii',exact:true}).click();const d=await page.evaluate(()=>window.miiDemoSettings().personalMii.decal);assert.equal(d.rotation,23);assert.deepEqual(errors,[]);console.log('PASS: palette keyboard grid, seven pose cycles, face cycles, single-axis branding saved, no browser exceptions');}finally{await browser.close();}
