import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 for(const [width,height] of [[1280,800],[854,534],[1920,1080]]){
  const page=await browser.newPage({viewport:{width,height}});
  await page.goto(url.replace('preview.html',process.env.HUB_PREVIEW??'preview.html')+'?theme=psp&embed=1&still=1');
  await page.locator('[data-dht-root]').waitFor();
  await page.locator('#bar button').filter({hasText:/^Hub$/}).click({force:true}).catch(async()=>{
   await page.evaluate(()=>document.querySelector('#bar button').click());
  });
  await page.getByRole('tab',{name:'Discover',exact:true}).click();
  const cards=page.locator('.market-card');await cards.first().waitFor();
  for(const edge of ['first','last']){
   await cards[edge]().focus();await page.waitForTimeout(200);
   const metrics=await page.evaluate(()=>{
    const rect=s=>document.querySelector(s).getBoundingClientRect();
    const bar=rect('.dht-files-bar'),grid=rect('.market-grid'),card=rect('.market-card[data-selected=true]');
    const art=rect('.market-detail-art'),title=rect('.dht-hub-detail h2');
    return {gap:grid.top-bar.bottom,top:card.top-grid.top,bottom:grid.bottom-card.bottom,titleGap:title.top-art.bottom,ratio:art.width/art.height};
   });
   assert.ok(metrics.gap>=0&&metrics.gap<=18,JSON.stringify(metrics));
   assert.ok(metrics.top>=5&&metrics.bottom>=5,'selected card ring must remain inside scrolling grid '+JSON.stringify(metrics));
   assert.ok(metrics.titleGap>=0&&metrics.titleGap<=20,JSON.stringify(metrics));
   assert.ok(Math.abs(metrics.ratio-1.6)<.01,JSON.stringify(metrics));
  }
  await page.screenshot({path:`preview/hub-layout-${width}.png`});
  console.log(`PASS Hub spacing, first/last focus borders, full preview and compact details at ${width}x${height}`);
  await page.close();
 }
}finally{await browser.close();server.closeAllConnections();server.close();}
