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
  await page.keyboard.press('ArrowDown');
  for(const name of boxes.map(box=>box.name)){await page.waitForFunction(name=>document.querySelector('.dht-switch-dock-item[data-selected="true"]')?.getAttribute('data-name')===name,name);if(name!=='Power')await page.keyboard.press('ArrowRight');}
  await dock.filter({has:page.locator('svg')}).filter({hasText:'Settings'}).click();await page.locator('.dht-menu--switch').waitFor();await page.keyboard.press('Escape');await page.keyboard.press('ArrowUp');
  for(let i=0;i<30;i++){if(await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name')==='All Software')break;await page.keyboard.press('ArrowRight');}
  const launcher=page.locator('.dht-switch-tile[data-selected="true"][data-name="All Software"]');await launcher.waitFor();
  await page.waitForTimeout(220);
  const games=await page.locator('.dht-switch-tile:not([data-name="All Software"])').evaluateAll(nodes=>nodes.map(node=>{const r=node.getBoundingClientRect();return {x:r.x,right:r.right};}).sort((a,b)=>a.x-b.x));
  for(let i=1;i<games.length;i++)assert(games[i].x>=games[i-1].right-1,'The smaller launcher must not change game row spacing');
  await launcher.click();await page.locator('.dht-switch-apps').waitFor();assert.deepEqual(errors,[]);
  console.log('PASS standard Switch',width,': six distinct system buttons, keyboard focus, Settings, stable launcher spacing and All Software input');await page.close();
 }
}finally{await browser.close();server.close();}
