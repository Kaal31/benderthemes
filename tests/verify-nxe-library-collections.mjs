import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const browser=await chromium.launch({headless:true});
try{
 const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
 page.setDefaultTimeout(12000);
 page.on('pageerror',error=>errors.push(error.message));
 await page.goto('http://127.0.0.1:8911/preview/x360-card-pages.html?theme=x360&xs=nxe&collections=1',{waitUntil:'domcontentloaded',timeout:60000});
 await page.waitForTimeout(6500);
 const press=async button=>{await page.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);await page.waitForTimeout(400);};
 await press(12);await press(12);await press(1);
 const dialog=page.getByRole('dialog',{name:'Game Library',exact:true});await dialog.waitFor();
 const nav=dialog.getByRole('navigation',{name:'Library collections'});
 assert.deepEqual(await nav.getByRole('button').allTextContents(),['All Games','Installed Games','Favorites','RPGs']);
 const all=await dialog.getByRole('option').allTextContents();
 await nav.getByRole('button',{name:'Favorites',exact:true}).click();
 const favorites=await dialog.getByRole('option').allTextContents();
 assert(favorites.length>0&&favorites.length<all.length);assert(favorites.every(name=>all.includes(name)));
 await press(12);assert.equal(await nav.getByRole('button',{name:'RPGs',exact:true}).getAttribute('aria-pressed'),'true');
 const rpgs=await dialog.getByRole('option').allTextContents();assert(rpgs.length>0);assert.notDeepEqual(rpgs,favorites);
 await press(12);assert.equal(await nav.getByRole('button',{name:'All Games',exact:true}).getAttribute('aria-pressed'),'true');
 await press(11);assert.equal(await nav.getByRole('button',{name:'RPGs',exact:true}).getAttribute('aria-pressed'),'true');
 assert.equal(await dialog.getByRole('option').first().getAttribute('aria-selected'),'true');
 await page.screenshot({path:'preview/nxe-library-collections.png'});
 await press(2);await dialog.waitFor({state:'hidden'});assert.equal(await dialog.count(),0);assert.deepEqual(errors,[]);
 console.log('PASS detected collections, membership filtering, controller cycling/wrap, selection reset, and dashboard return');
}finally{await browser.close();}
