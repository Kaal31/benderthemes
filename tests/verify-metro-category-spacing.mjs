import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/x360-reference-corrected.html?theme=x360&xs=metro&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883');
 for(const size of [{width:1280,height:900},{width:1280,height:800},{width:960,height:720}]){
  await p.setViewportSize(size);await p.waitForTimeout(400);
  for(const category of ['home','games','video','apps','settings','bing']){
   await p.getByRole('button',{name:category,exact:true}).click();await p.waitForTimeout(400);
   const stage=await p.locator('.dht-x360-bg').boundingBox();const tiles=await p.locator('.dht-x360-tile').evaluateAll(els=>els.map(el=>{const r=el.getBoundingClientRect();return {x:r.x,right:r.right,y:r.y,bottom:r.bottom};}));
   assert(tiles.length);const left=Math.min(...tiles.map(t=>t.x)),right=Math.max(...tiles.map(t=>t.right));
   const lm=left-stage.x,rm=stage.x+stage.width-right;
   assert(Math.abs(lm-rm)<24,category+' balanced outer margins '+JSON.stringify({lm,rm,size}));
   assert(Math.max(...tiles.map(t=>t.bottom))<stage.y+stage.height-50,category+' clears button legend');
   if(size.width===1280&&size.height===900)await p.screenshot({path:'preview/metro-spacing-'+category+'.png'});
  }
 }
 assert.deepEqual(errors,[]);console.log('PASS balanced category margins and footer clearance at desktop, Deck and smaller sizes');
}finally{await b.close();}
