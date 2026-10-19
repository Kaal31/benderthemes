import assert from 'node:assert/strict';
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {launch} from './browser.mjs';
const base=new URL('../',import.meta.url);
const gif=Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7','base64');
const png=await readFile(new URL('preview/intro-xbox.png',base));
const video=await readFile(new URL('themes/blue-glass/test-video.mp4',base));
const media=[{file:'media/'+'a'.repeat(64)+'.gif',video:false},{file:'media/'+'b'.repeat(64)+'.png',video:false}];
let catalog={media,duration:3,fit:'contain',transition:'fade'};
const server=http.createServer(async(req,res)=>{
 try {
  const u=req.url;
  if(u==='/catalog.json'){res.setHeader('Content-Type','application/json');res.end(JSON.stringify(catalog));return;}
  if(u?.startsWith('/media/')){const mp4=u.endsWith('.mp4');res.setHeader('Content-Type',mp4?'video/mp4':u.endsWith('.gif')?'image/gif':'image/png');res.end(mp4?video:u.endsWith('.gif')?gif:png);return;}
  const name=u==='/player.js'?'player.js':'index.html';
  res.setHeader('Content-Type',name.endsWith('.js')?'text/javascript':'text/html');
  res.end(await readFile(new URL('screensaver-player/'+name,base)));
 }catch(e){res.statusCode=500;res.end(String(e));}
});
await new Promise(r=>server.listen(0,'127.0.0.1',r));
const url='http://127.0.0.1:'+server.address().port;
const browser=await launch();
try {
 const page=await browser.newPage();const errors=[];page.on('pageerror',e=>errors.push(String(e)));
 await page.goto(url);
 await page.waitForFunction(()=>document.querySelector('img.shown')?.naturalWidth>0);
 assert.match(await page.locator('img.shown').getAttribute('src'),/\.gif$/);
 await page.waitForFunction(()=>document.querySelector('img.shown')?.src.endsWith('.png'));
 assert.equal(await page.locator('img.shown').evaluate(x=>getComputedStyle(x).objectFit),'contain');
 catalog={media:[{file:'media/'+'c'.repeat(64)+'.mp4',video:true}],duration:3,fit:'cover',transition:'none'};
 await page.reload();
 await page.waitForFunction(()=>document.querySelector('video.shown')?.currentTime>.1);
 assert.equal(await page.locator('video').evaluate(x=>x.muted&&x.loop),true);
 assert.equal(await page.locator('video').evaluate(x=>getComputedStyle(x).objectFit),'cover');
 await page.evaluate(()=>window.dispatchEvent(new Event('pagehide')));
 assert.equal(await page.locator('video').evaluate(x=>x.paused),true);
 assert.deepEqual(errors,[]);
 console.log('PASS native player: GIF decode, photo slideshow, MP4 time advances, mute/loop, framing and teardown.');
}finally{await browser.close();await new Promise(r=>server.close(r));}
