import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try {
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.pendingSourceRequests=[];
  window.__themeSourceBrowse=(kind,source,query,page)=>new Promise((resolve,reject)=>window.pendingSourceRequests.push({kind,source,query,page,resolve,reject}));
  window.finishSource=(kind,page=1)=>{
   const request=window.pendingSourceRequests.find(r=>r.kind===kind&&r.page===page&&!r.done);if(!request)throw Error('Missing request '+kind);request.done=true;
   const items=Array.from({length:kind==='wiiu'?16:24},(_,i)=>({id:(page*256+i).toString(16).toUpperCase(),name:kind+' theme '+page+'-'+i,author:'Test author',image:'',page:'https://themezer.net/',file:{name:'',size:0}}));
   request.resolve({kind,page,pages:kind==='switch'?2:1,total:kind==='switch'?48:16,items,source:{id:request.source,name:'Themezer',url:'https://themezer.net',credit:'Test fixture'}});
  };
 });
 await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.getByRole('button',{name:'Hub (from this home)',exact:true}).click();
 await page.locator('[data-hub-tab]').waitFor();
 // The top-level section label is shared with the real Hub.
 await page.getByRole('tab',{name:'Theme files',exact:true}).click();
 const tab=name=>page.getByRole('tab',{name,exact:true});
 await tab('Wii U').click();await page.waitForFunction(()=>pendingSourceRequests.some(r=>r.kind==='wiiu'));
 await tab('Switch').click();await page.waitForFunction(()=>pendingSourceRequests.some(r=>r.kind==='switch'));
 await page.evaluate(()=>finishSource('switch'));
 await page.locator('.dht-files-card strong').filter({hasText:'switch theme 1-0'}).waitFor();
 await page.evaluate(()=>finishSource('wiiu'));
 await page.waitForTimeout(100);
 assert.equal(await page.locator('.dht-files-card:not(.dht-files-more)').count(),24);
 assert.match(await page.locator('.dht-files-status').textContent(),/48 themes/);
 assert.equal(await page.locator('.dht-files-card strong').filter({hasText:'wiiu theme'}).count(),0,'Late Wii U response must not overwrite Switch');
 await page.locator('.dht-files-more').click();await page.waitForFunction(()=>pendingSourceRequests.some(r=>r.kind==='switch'&&r.page===2));await page.evaluate(()=>finishSource('switch',2));
 await page.waitForFunction(()=>document.querySelectorAll('.dht-files-card').length===48);
 await page.locator('.dht-files-card').last().click();await page.locator('.dht-files-dl').first().click();await page.locator('.dht-files-confirm').waitFor();await page.locator('.dht-files-dl').first().click();
 await page.waitForFunction(()=>window.__themeSourceDownloads?.length===1);
 const [download]=await page.evaluate(()=>window.__themeSourceDownloads);assert.equal(download.kind,'switch');assert.equal(download.id,'217');
 // Stale failures and finalizers must not clear a newer loading state.
 await tab('Wii U').click();await page.waitForFunction(()=>pendingSourceRequests.filter(r=>r.kind==='wiiu').length===2);
 await tab('Switch').click();await page.waitForFunction(()=>pendingSourceRequests.filter(r=>r.kind==='switch'&&r.page===1).length===2);
 await page.evaluate(()=>{const r=pendingSourceRequests.find(r=>r.kind==='wiiu'&&!r.done);r.done=true;r.reject(Error('Old Wii U request failed'));});
 await page.waitForTimeout(100);assert.match(await page.locator('.dht-files-status').textContent(),/Loading/);
 await page.evaluate(()=>finishSource('switch'));await page.locator('.dht-files-card').first().waitFor();assert.deepEqual(errors,[]);
 console.log('PASS category response isolation, stale errors/loading, pagination and Switch download ID');
} finally {await browser.close();server.closeAllConnections();server.close();}

