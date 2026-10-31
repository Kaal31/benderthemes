import assert from 'node:assert/strict';
import {chromium} from 'playwright';
const b=await chromium.launch({channel:'msedge',headless:true});
const url=process.env.METRO_PREVIEW_URL||'http://127.0.0.1:8911/preview/x360-reference-corrected.html?theme=x360&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883';
try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(url);
 for(const name of ['bing','home','social','video','games','apps','settings'])assert.equal(await p.getByRole('button',{name,exact:true}).count(),1);
 for(const name of ['bing','home','video','games','apps','settings']){
  await p.getByRole('button',{name,exact:true}).click();
  assert(await p.locator('.dht-x360-tile').count()>0,name+' has dashboard content');
 }
 await p.getByRole('button',{name:'social',exact:true}).click();await p.locator('[data-social-avatar-stage] [data-avatar-engine=ready]').waitFor({timeout:60000});
 assert.equal(await p.locator('[data-name="DeckPlayer"] canvas').count(),0,'Avatar must stand outside the profile tile');
 assert.equal(await p.locator('[data-name="friends"]').count(),1);
 await p.waitForTimeout(6500);await p.screenshot({path:'preview/metro-reference-social.png'});
 await p.goto(url+'&xs=nxe');await p.locator('[data-avatar-engine=ready]').waitFor({timeout:60000});await p.waitForTimeout(6500);
 const card=await p.locator('.dht-x360n-card[data-selected=true]').boundingBox();const channel=await p.locator('.dht-x360n-channel[data-selected=true]').boundingBox();
 assert(card.height/card.width>.70&&card.height/card.width<.82,'NXE dashboard cards use the reference landscape proportions');assert(channel.y+channel.height<card.y,'Active channel must not be obscured by cards');
 assert.match(await p.locator('[data-nxe-caption]').innerText(),/^\d+ of \d+$/,'Caption shows only card position, with no duplicate title');await p.screenshot({path:'preview/nxe-reference-home.png'});
 const visited=new Set();
 for(let i=0;i<8;i++){
  visited.add(await p.locator('[data-nxe-channel]').getAttribute('data-nxe-channel'));
  await p.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:9})));
  await p.waitForTimeout(150);
 }
 for(const channel of ['myxbox','pictures','music','video','friends','market','games','spotlight'])assert(visited.has(channel),channel+' is reachable');
 assert.deepEqual(errors,[]);
 console.log('PASS Metro seven pivots/open avatar stage and NXE landscape cards/count-only caption/unobscured channel/shared avatar');
}finally{await b.close();}
