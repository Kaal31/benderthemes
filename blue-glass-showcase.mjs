import {chromium} from 'playwright';
import {mkdirSync} from 'node:fs';
const dir='../work/blue-glass-showcase-frames';mkdirSync(dir,{recursive:true});
const browser=await chromium.launch();const page=await browser.newPage({viewport:{width:1280,height:720}});
await page.goto('http://127.0.0.1:8776/blue-glass-browser-preview.html');const frame=page.frameLocator('#theme');await frame.locator('#apps .game-app').first().waitFor();await page.waitForTimeout(350);let n=0;
async function hold(count){for(let i=0;i<count;i++){await page.screenshot({path:dir+'/'+String(n++).padStart(4,'0')+'.png'});await page.waitForTimeout(85);}}
async function tab(name,count=18){await frame.locator('footer [data-place='+name+']').click();await hold(count);}
await hold(20);await tab('library',16);await tab('store',20);
await frame.locator('.page-tabs button').filter({hasText:'Specials'}).click();await hold(14);
await frame.locator('.store-card').first().click();await hold(18);
await tab('friends',16);await frame.locator('.friend-row').first().click();await hold(14);
await tab('downloads',20);await tab('settings',20);await tab('media',18);
await frame.locator('.media-card').first().click();await hold(15);await frame.locator('.media-lightbox button').click();await tab('home',18);
await browser.close();console.log('Captured '+n+' showcase frames');
