import assert from 'node:assert/strict';import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
mkdirSync('out/native-themes',{recursive:true});
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>{const screen=document.querySelector('[data-dht-root]').closest('div[style*="border-radius: 10px"]');screen.setAttribute('data-scaling-fullscreen','');Object.assign(screen.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',margin:'0',borderRadius:'0',zIndex:'999'});document.body.style.overflow='hidden';});
 await page.addStyleTag({content:'[data-scaling-fullscreen]{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;margin:0!important;border-radius:0!important}'});
 for(const id of ['ios6','blue-glass']){
  await page.evaluate(id=>window.__updateTheme({theme:'frame',activeTheme:id,animations:false}),id);
  const host=page.locator(`[data-native-theme="${id}"][data-theme-connected=true]`);await host.waitFor();
  for(const [width,height] of [[1280,800],[1280,720],[960,600],[1920,1200]]){
   await page.setViewportSize({width,height});await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
   await page.waitForFunction(({id,width,height})=>{const s=document.querySelector(`[data-native-theme="${id}"]`).shadowRoot,root=s.querySelector('#dashboard').getBoundingClientRect(),footer=s.querySelector('footer').getBoundingClientRect();return Math.abs(root.width-width)<1&&Math.abs(root.height-height)<1&&Math.abs(footer.bottom-height)<1;},{id,width,height});
   const measured=await host.evaluate((host,id)=>{const s=host.shadowRoot,box=n=>n.getBoundingClientRect().toJSON(),icons=[...s.querySelectorAll('#apps .game-app .cover-frame,#apps .ios-app-art')].map(box).filter(b=>b.x>=0&&b.right<=host.clientWidth);return{icons,footer:box(s.querySelector('footer')),recent:box(s.querySelector('.recent')),dots:s.querySelector('.springboard-dots')?box(s.querySelector('.springboard-dots')):null,tiles:[...s.querySelector('#apps').children].map(box).filter(b=>b.x>=0&&b.right<=host.clientWidth)};},id);
   assert.ok(measured.icons.length>=16);
   for(const icon of measured.icons){assert.ok(Math.abs(icon.width-icon.height)<1,'square icon');assert.ok(Math.abs(icon.width/width-(id==='ios6'?99:116)/1280)<.002,'icon scale follows screen width');}
   if(id==='blue-glass'){
    assert.ok(Math.abs(measured.recent.bottom-measured.footer.top)<1,'recent shelf meets dock without unused 720p strip');
    const reflection=await host.locator('#shelf .cover').first().evaluate(n=>({button:getComputedStyle(n).webkitBoxReflect,frame:getComputedStyle(n.querySelector('.cover-frame')).webkitBoxReflect,label:getComputedStyle(n.querySelector('.app-label')).webkitBoxReflect}));
    assert.equal(reflection.button,'none');assert.equal(reflection.label,'none');assert.match(reflection.frame,/below 4px/);
   }
   else{const bottom=Math.max(...measured.tiles.map(b=>b.bottom));assert.ok(bottom<measured.dots.top,'home icons and labels stay above page dots');assert.ok(measured.dots.top-bottom<80*width/1280,'rows use available home screen height');assert.ok(measured.dots.bottom<=measured.footer.top);}
   if(width===1280&&height===800)await host.screenshot({path:`out/native-themes/${id}-deck-scaling.png`});
  }
  console.log('PASS: square proportional icons, home row spacing and dock fit at Deck, 16:9, compact and larger 16:10 sizes:',id);
 }
 assert.deepEqual(errors,[]);
}finally{await browser.close();server.closeAllConnections();server.close();}
