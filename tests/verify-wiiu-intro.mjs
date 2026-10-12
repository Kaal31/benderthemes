import {launch,BASE} from './browser.mjs';import assert from 'node:assert/strict';
const b=await launch();const p=await b.newPage({viewport:{width:1304,height:890}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
 // Boot: white screen with the Wii U logo, skippable with any button.
 await p.goto(BASE+'/preview/wiiu-preview.html?h=800');
 await p.locator('.nt-boot-logo').waitFor();assert.equal(await p.locator('.nt-boot-shapes svg').count(),12,'Loading shapes sit behind the logo');assert.equal(await p.locator('.nt-home').getAttribute('data-boot'),'true');
 await p.keyboard.press('Enter');await p.locator('.nt-boot').waitFor({state:'detached'});
 assert.equal(await p.locator('.nt-grid').count(),1,'Skipping the logo does not activate a tile');assert.equal(await p.locator('.nt-banner').count(),0);
 // The logo plays once per session.
 await p.getByRole('button',{name:'Switch to WaraWara Plaza',exact:true}).click();await p.locator('.nt-plaza[data-ready=true]').waitFor();assert.equal(await p.locator('.nt-boot').count(),0);
 // Plaza opening: sparkles and hidden titles until they fly in, then it does not replay.
 await p.locator('.nt-plaza[data-opening=false]').waitFor({timeout:20000});assert.equal(await p.locator('.nt-plaza-sparkles').count(),0);
 await p.getByRole('button',{name:'Switch to software grid',exact:true}).click();await p.getByRole('button',{name:'Switch to WaraWara Plaza',exact:true}).click();assert.equal(await p.locator('.nt-plaza[data-opening=true]').count(),0,'Opening plays once per session');
 // Tips are a quiet line at the bottom, not Mii posts, and the Plaza advice option hides them.
 await p.locator('.nt-plaza-tip').waitFor();assert.equal(await p.locator('.nt-plaza-post', {hasText:'Plaza guide'}).count(),0);
 await p.evaluate(()=>window.__updateTheme({wiiuPlazaTips:false}));await p.locator('.nt-plaza-tip').waitFor({state:'detached'});await p.evaluate(()=>window.__updateTheme({wiiuPlazaTips:true}));
 // Miiverse-style posts: a name tag, the title's icon and two lines of text.
 const post=p.locator('.nt-plaza-post').first();await post.waitFor({timeout:15000});
 assert((await post.locator('b').innerText()).length>0);assert.equal(await post.locator('.nt-post-icon').count(),1);
 // Plaza pager: − / + in the bottom-left corner.
 await p.locator('.nt-plaza-pager').getByRole('button',{name:'Next page',exact:true}).click();assert.equal(await p.locator('.nt-plaza-pager [aria-current=page]').getAttribute('aria-label'),'Page 2');
 await p.locator('.nt-plaza-pager').getByRole('button',{name:'Previous page',exact:true}).click();
 // Animations off: no posts, still crowd.
 await p.evaluate(()=>window.__updateTheme({animations:false}));await p.waitForTimeout(300);assert.equal(await p.locator('.nt-plaza-post').count(),0);
 await p.locator('[data-dht-root]').screenshot({path:'work/wiiu-plaza-still.png'});
 assert.deepEqual(errors,[]);console.log('PASS Wii U intro: boot logo, skip, once per session, Plaza posts, corner pager, still mode.');
}finally{await b.close()}
