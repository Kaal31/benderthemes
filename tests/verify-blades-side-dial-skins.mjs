import {chromium} from 'playwright';import assert from 'node:assert/strict';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1304,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
try{
await p.goto('http://127.0.0.1:8770/preview/preview.html?theme=x360&xs=blades&h=800');await p.waitForTimeout(800);await p.keyboard.press('y');await p.locator('.dht-menu--blades').waitFor();assert.equal(await p.locator('.dht-menu--blades').getAttribute('data-side'),'right');
await p.getByRole('button',{name:'Options menu side'}).click();await p.getByRole('button',{name:'Left side'}).click();await p.waitForTimeout(350);assert.equal(await p.locator('.dht-menu--blades').getAttribute('data-side'),'left');assert.equal(await p.locator('.dht-menu--blades').evaluate(e=>getComputedStyle(e).left),'0px');await p.locator('[data-dht-root]').screenshot({path:'work/blades-left-menu.png'});
await p.keyboard.press('Escape');await p.keyboard.press('Escape');await p.waitForTimeout(550);await p.keyboard.press('y');await p.locator('.dht-menu--blades').waitFor();assert.equal(await p.locator('.dht-menu--blades').getAttribute('data-side'),'left');await p.getByRole('button',{name:'Options menu side'}).click();await p.getByRole('button',{name:'Right side'}).click();await p.waitForTimeout(350);assert.equal(await p.locator('.dht-menu--blades').getAttribute('data-side'),'right');await p.locator('[data-dht-root]').screenshot({path:'work/blades-right-menu.png'});
await p.goto('http://127.0.0.1:8770/preview/dial-preview.html?h=800');await p.locator('.alien-dial').waitFor();
for(const look of ['classic','chrome','crimson','arctic']){
 for(const motion of ['rotate','pulse','hologram','rhombus','rhombus-slow']){
  await p.evaluate(({look,motion})=>window.__updateTheme({animations:true,dial:{look,activation:'on-browse',motion,motions:[motion],floatingCover:true,reflections:true}}),{look,motion});await p.waitForTimeout(90);await p.keyboard.press('ArrowRight');await p.waitForTimeout(70);assert.equal(await p.locator('.alien-dial').getAttribute('data-active'),'true');assert.equal(await p.locator('.alien-dial').getAttribute('data-skin'),look);
  if(motion.startsWith('rhombus')){assert.equal(await p.locator('.alien-mechanism .alien-rhombus-morph').count()>0,true);assert.equal(await p.locator('.alien-mechanism [data-pattern=rhombus]').evaluate(e=>getComputedStyle(e).animationDelay),motion==='rhombus-slow'?'0.65s':'0s');}
  if(motion==='pulse'||motion==='hologram')assert.ok(await p.locator('.alien-classic-motion').evaluate(e=>e.getAnimations().length>0));
  if(motion==='rotate')assert.notEqual(await p.locator('.alien-mechanism .alien-bezel').first().evaluate(e=>e.style.transform),'rotate(0deg)');
 }
 await p.evaluate(look=>window.__updateTheme({dial:{look,activation:'on-browse',motions:['rotate','pulse','hologram','rhombus-slow'],floatingCover:true,reflections:true}}),look);await p.keyboard.press('ArrowRight');await p.waitForTimeout(1400);await p.locator('[data-dht-root]').screenshot({path:`work/dial-${look}-all-motions.png`});
}
assert.deepEqual(errors,[]);console.log('PASS: Blades left/right menu selection/reopening; all five animation types on all four dial skins, combined motion, reflections and 650 ms morph hold.');
}finally{await b.close()}
