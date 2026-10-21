import assert from 'node:assert/strict';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}});page.setDefaultTimeout(15000);await page.goto(url+'?theme=wiiu&still=1');await page.locator('.nt-boot').waitFor({state:'detached'});
 await page.evaluate(()=>window.__updateTheme({personalMii:undefined}));
 await page.waitForFunction(()=>document.querySelector('.dht-wiiu-avatar>svg,.dht-wiiu-avatar>img'));
 const mii=await page.locator('.dht-wiiu-avatar').boundingBox(),steam=await page.locator('.nt-steam-profile').boundingBox();assert.ok(steam.x+steam.width>mii.x+mii.width&&steam.x>mii.x+mii.width/2&&steam.y<=mii.y,'Steam picture badges the upper-right corner of the Mii element');assert.ok(steam.width<=36&&steam.height<=36,'Steam picture stays small');
 const portrait='data:image/svg+xml,'+encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><circle cx="48" cy="48" r="40" fill="orange"/></svg>');
 await page.evaluate(portrait=>window.__updateTheme({personalMii:{name:'Saved Mii',portrait}}),portrait);await page.waitForFunction(portrait=>document.querySelector('.dht-wiiu-avatar>img')?.getAttribute('src')===portrait,portrait);
 await page.evaluate(()=>window.__updateTheme({wiiuView:'plaza'}));await page.waitForFunction(portrait=>document.querySelector('.dht-wiiu-avatar>img')?.getAttribute('src')===portrait,portrait);
 await page.evaluate(()=>window.__updateTheme({wiiuView:'grid',personalMii:undefined}));await page.waitForFunction(portrait=>document.querySelector('.dht-wiiu-avatar>img')?.getAttribute('src')!==portrait,portrait);
 await page.getByRole('button',{name:'Create or edit personal Mii'}).click();await page.getByRole('dialog',{name:'Personal Mii creator'}).waitFor();await page.getByRole('button',{name:'Cancel',exact:true}).click();await page.getByRole('dialog',{name:'Personal Mii creator'}).waitFor({state:'detached'});
 await page.screenshot({path:'work/wiiu-separated-profile.png'});
 await page.getByRole('button',{name:'Create or edit personal Mii'}).click();await page.getByRole('button',{name:'Save Mii',exact:true}).click();await page.getByRole('dialog',{name:'Personal Mii creator'}).waitFor({state:'detached'});await page.waitForFunction(()=>!!window.__getThemeSettings().personalMii?.name);await page.locator('.dht-wiiu-avatar>img').first().waitFor();
 console.log('PASS separate Mii placeholder and right-hand Steam avatar, saved portrait across views, creator access');
}finally{await browser.close();server.closeAllConnections();server.close();}
