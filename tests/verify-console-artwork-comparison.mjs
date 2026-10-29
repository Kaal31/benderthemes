import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/console-artwork-comparison.html');
 const images=await p.evaluate(async()=>{const images=[...document.images];await Promise.all(images.map(i=>i.decode().catch(()=>{})));return {count:images.length,bad:images.filter(i=>!i.naturalWidth).map(i=>i.src)};});assert.equal(images.count,118);assert.deepEqual(images.bad,[]);
 assert.equal(await p.locator('.card:not(.hidden)').count(),27);await p.screenshot({path:'preview/console-artwork-comparison.png'});
 await p.getByRole('button',{name:/Blades surfaces/}).click();assert.equal(await p.locator('.card:not(.hidden)').count(),26);
 await p.getByRole('button',{name:/Console dashboards/}).click();assert.equal(await p.locator('.card:not(.hidden)').count(),6);await p.screenshot({path:'preview/console-dashboard-comparison.png'});
 await p.getByRole('button',{name:/NXE icons/}).click();await p.getByRole('searchbox').fill('avatar');assert.equal(await p.locator('.card:not(.hidden)').count(),1);await p.getByRole('searchbox').fill('');
 await p.setViewportSize({width:390,height:844});assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert.deepEqual(errors,[]);console.log('PASS 118 images decoded, three comparison views, search and mobile fit');
}finally{await b.close();}
