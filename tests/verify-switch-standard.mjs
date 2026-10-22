import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {startPreviewServer} from '../preview/server.mjs';

const {server,url}=await startPreviewServer(0),browser=await chromium.launch();
try{
 for(const width of [1304,550]){
  const page=await browser.newPage({viewport:{width,height:960}}),errors=[];page.on('pageerror',error=>errors.push(error.message));
  await page.goto(url+'?theme=switch&switchTheme=&still=1&h=720');
  const dock=page.locator('.dht-switch-dock-item');await dock.first().waitFor();assert.equal(await dock.count(),6);
  const boxes=await dock.evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {name:node.dataset.name,x:r.x,y:r.y,right:r.right};}));
  assert.deepEqual(boxes.map(box=>box.name),['News','Shop','Album','Controllers','Settings','Power']);
  for(let i=1;i<boxes.length;i++){assert(boxes[i].x>boxes[i-1].right,'Standard system buttons must occupy separate flex slots');assert.equal(boxes[i].y,boxes[0].y);}
  // Keep the same focus element across selection changes, with an actual intermediate position.
  await page.evaluate(()=>{window.__standardFocus=document.querySelector('.dht-switch-standard-focus');window.__updateTheme({animations:true});});
  const focus=page.locator('.dht-switch-standard-focus'),track=page.locator('.dht-switch-standard-track');
  const initialFocus=await focus.boundingBox();await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>document.querySelector('.dht-switch-standard-focus').getAnimations().some(a=>a.transitionProperty==='transform'));
  const intermediate=await focus.evaluate(node=>{const a=node.getAnimations().find(a=>a.transitionProperty==='transform');a.pause();a.currentTime=140;return node.getBoundingClientRect().x;});
  assert(intermediate>initialFocus.x&&intermediate<initialFocus.x+280*width/1304,'Focus must slide through intermediate positions');
  await focus.evaluate(node=>node.getAnimations().forEach(a=>a.finish()));
  for(let i=0;i<3;i++)await page.keyboard.press('ArrowRight');
  await page.waitForFunction(()=>document.querySelector('.dht-switch-standard-track').getAnimations().length>0);
  const motion=await track.evaluate(node=>{const a=node.getAnimations()[0];a.pause();a.currentTime=140;return {current:new DOMMatrix(getComputedStyle(node).transform).m41,target:new DOMMatrix(node.style.transform).m41};});
  assert(motion.current<0&&motion.current>motion.target,'Covers must scroll together through an intermediate position');
  await track.evaluate(node=>node.getAnimations().forEach(a=>a.finish()));
  await page.keyboard.press('ArrowDown');await page.waitForTimeout(320);
  const frame=await focus.boundingBox(),button=await page.locator('.dht-switch-dock-item[data-selected="true"] .dht-switch-dock-base').boundingBox();
  for(const key of ['x','y','width','height'])assert(Math.abs(frame[key]-button[key])<1,'Dock focus must match the selected circle at every viewport size');

  for(const name of boxes.map(box=>box.name)){await page.waitForFunction(name=>document.querySelector('.dht-switch-dock-item[data-selected="true"]')?.getAttribute('data-name')===name,name);if(name!=='Power')await page.keyboard.press('ArrowRight');}
  await dock.filter({has:page.locator('svg')}).filter({hasText:'Settings'}).click();await page.locator('.dht-menu--switch').waitFor();
  for(const text of ['Customize','Look options','Appearance','Standard skin','Basic Black'])await page.locator('.dht-menu-item').filter({hasText:text}).click();
  await page.waitForFunction(()=>window.__getThemeSettings().styles.switch.standardSkin==='black');
  assert.equal(await page.locator('.dht-switch-bg').evaluate(node=>getComputedStyle(node).backgroundColor),'rgb(45, 45, 45)');
  assert.equal(await page.locator('.dht-switch-status').evaluate(node=>getComputedStyle(node).color),'rgb(255, 255, 255)');
  await page.locator('.dht-switch-dock-item[data-name="Settings"]').click();await page.locator('.dht-menu--switch').waitFor();
  assert.equal(await page.locator('.dht-menu--switch').evaluate(node=>getComputedStyle(node).color),'rgb(255, 255, 255)');
  for(let i=0;i<8&&await page.locator('.dht-menu--switch').count();i++){await page.keyboard.press('Escape');await page.waitForTimeout(30);}
  await page.locator('.dht-menu--switch').waitFor({state:'detached',timeout:3000});await page.keyboard.press('ArrowUp');
  assert(await focus.evaluate(node=>node===window.__standardFocus),'Focus element must persist between game, dock and settings selections');
  await page.evaluate(()=>window.__updateTheme({animations:false}));await page.waitForFunction(()=>document.querySelector('.dht-switch-root').dataset.motion==='false');
  assert.equal(await track.evaluate(node=>getComputedStyle(node).transitionDuration),'0s');
  assert.equal(await page.locator('.dht-switch-standard-focus .dht-switch-focus').evaluate(node=>getComputedStyle(node).animationName),'none');
  await page.evaluate(()=>window.__updateTheme({animations:true}));await page.waitForFunction(()=>document.querySelector('.dht-switch-root').dataset.motion==='true');await page.emulateMedia({reducedMotion:'reduce'});
  assert.equal(await focus.evaluate(node=>getComputedStyle(node).transitionDuration),'0s');
  assert.equal(await track.evaluate(node=>getComputedStyle(node).transitionDuration),'0s');
  await page.emulateMedia({reducedMotion:'no-preference'});

  for(let i=0;i<30;i++){if(await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name')==='All Software')break;await page.keyboard.press('ArrowRight');}
  const launcher=page.locator('.dht-switch-tile[data-selected="true"][data-name="All Software"]');await launcher.waitFor();
  await page.waitForTimeout(320);
  const finalFocus=await focus.boundingBox(),finalLauncher=await launcher.boundingBox();
  for(const key of ['x','y','width','height'])assert(Math.abs(finalFocus[key]-finalLauncher[key])<1,'Rapid navigation must settle with the focus aligned to the launcher');
  const games=await page.locator('.dht-switch-tile:not([data-name="All Software"])').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {x:r.x,right:r.right};}).sort((a,b)=>a.x-b.x));
  for(let i=1;i<games.length;i++)assert(games[i].x>=games[i-1].right-1,'The smaller launcher must not change game row spacing');
  assert.equal(await page.locator('.dht-switch-launcher-part > div').first().evaluate(node=>getComputedStyle(node).backgroundColor),'rgb(255, 255, 255)');
  await launcher.click();await page.locator('.dht-switch-apps').waitFor();assert.deepEqual(errors,[]);
  console.log('PASS standard Switch',width,': smooth row and persistent focus, black skin through Settings, reduced motion, launcher spacing and input');await page.close();
 }
}finally{await browser.close();server.close();}
