// Wii U notifications and details: bell with count, slide-in banners (Steam notifications, a friend starting a game),
// Plaza posts from real activity, the details card (Plaza), the title line (grid), the launch-panel details, Y options
// and the two Theme options (notify, detail).
import {launch,BASE} from './browser.mjs';import assert from 'node:assert/strict';
const b=await launch();const p=await b.newPage({viewport:{width:1304,height:890}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
 await p.goto(BASE+'/preview/wiiu-preview.html?h=800');
 await p.locator('.nt-boot').waitFor({state:'detached'});
 // Grid: bell + first banner (the preview's notification tray has three unread items) + a title line with playtime
 const bell=p.locator('.dht-wiiu-notify');await bell.waitFor();assert.equal(await bell.getAttribute('data-count'),'3');
 await p.locator('.dht-wiiu-notify-banner').waitFor();assert.match(await p.locator('.dht-wiiu-notify-banner').innerText(),/Kaida invited you to play/);
 await p.locator('.dht-wiiu-detail-line').waitFor();assert.match(await p.locator('.dht-wiiu-title').innerText(),/played/);
 // A friend starts a game: a banner follows
 await p.evaluate(()=>{const f=globalThis.friendStore.allFriends.find(x=>x.persona.m_strPlayerName==='Orrin');f.persona.m_strGameName='Hades';});
 await p.waitForFunction(()=>/Orrin is playing/.test(document.querySelector('.dht-wiiu-notify-banners')?.textContent??''),null,{timeout:30000});
 // Plaza: details card, with achievements once a game that has them is selected
 await p.getByRole('button',{name:'Switch to WaraWara Plaza',exact:true}).click();await p.locator('.nt-plaza[data-ready=true]').waitFor();await p.evaluate(()=>document.activeElement.blur());
 const card=p.locator('.dht-wiiu-detail[data-variant=card]');await card.waitFor();assert.match(await card.innerText(),/played/);
 for(let i=0;i<9&&!(await p.locator('.dht-wiiu-detail-recent li').count());i++){await p.keyboard.press('ArrowRight');await p.waitForTimeout(700);}
 await p.locator('.dht-wiiu-detail-ach').waitFor();assert.match(await p.locator('.dht-wiiu-detail-ach').innerText(),/\d+ \/ \d+/);await p.locator('.dht-wiiu-detail-recent li').first().waitFor();
 await p.locator('[data-dht-root]').screenshot({path:'work/wiiu-plaza-details.png'});
 // Posts from real activity (friends, notifications) appear among the sample posts
 await p.waitForSelector('.nt-plaza-post[data-kind]',{timeout:120000});
 await p.locator('[data-dht-root]').screenshot({path:'work/wiiu-plaza-feed.png'});
 // Y: game options with details and achievements; the achievements page opens
 await p.keyboard.press('y');const menu=p.locator('.dht-menu--wiiu');await menu.waitFor();
 for(const label of ['Game details','Achievements','Steam game options'])assert(await menu.getByText(label,{exact:true}).count(),label);
 await menu.getByText('Achievements',{exact:true}).click();await p.locator('.dht-destination[data-place=achievements]').waitFor();await p.keyboard.press('Escape');await p.locator('.dht-destination').waitFor({state:'detached'});
 // Launch panel carries the details
 await p.keyboard.press('Enter');await p.locator('.nt-banner .dht-wiiu-detail[data-variant=panel]').waitFor();await p.keyboard.press('Escape');
 // The bell opens the notifications page
 await bell.click();await p.locator('.dht-destination[data-place=notifications]').waitFor();await p.keyboard.press('Escape');await p.locator('.dht-destination').waitFor({state:'detached'});
 // Options off: no bell, banners or details
 await p.evaluate(()=>window.__updateTheme({styles:{wiiu:{notify:'off',detail:'off'}}}));await p.waitForTimeout(300);
 assert.equal(await p.locator('.dht-wiiu-notify,.dht-wiiu-notify-banners,.dht-wiiu-detail').count(),0);
 assert.deepEqual(errors,[]);console.log('PASS Wii U activity: bell, banners, friend banner, Plaza feed posts, details card, Y options, launch panel details, options off');
}finally{await b.close()}
