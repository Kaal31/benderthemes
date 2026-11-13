const {chromium}=require('playwright');
const assert=require('assert/strict');
(async()=>{
 const browser=await chromium.launch();
 try{
  const page=await browser.newPage({viewport:{width:1600,height:1000}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await page.goto('http://127.0.0.1:8911/preview/authored-fallback-review.html?console=wiiu&view=grid&focus=start',{waitUntil:'domcontentloaded'});
  await page.waitForTimeout(5000);
  const frames=()=>page.frames().filter(f=>f.url().includes('console-fallback-artwork-v17'));
  assert.equal(frames().length,2);
  for(const frame of frames()){
   assert.equal(await frame.locator('.nt-home').getAttribute('data-start-focus'),'true');
   assert.equal(await frame.locator('.nt-tile[data-focus=true] .nt-tile-start').evaluate(n=>getComputedStyle(n).display),'block');
  }
  assert.deepEqual(await Promise.all(frames().map(f=>f.locator('.nt-home').getAttribute('data-cover-finish'))),['previous','refined']);
  await page.screenshot({path:'preview/wiiu-refined-glass-grid.png',timeout:30000});
  for(const finish of ['previous','refined']){
   await page.selectOption('#glassStyle',finish);
   await page.waitForTimeout(4000);
   assert.equal(frames().length,2);
   for(const frame of frames())assert.equal(await frame.locator('.nt-home').getAttribute('data-cover-finish'),finish);
  }
  await page.selectOption('#glassStyle','auto');await page.waitForTimeout(4000);
  await page.selectOption('#focusStyle','frame');await page.waitForTimeout(3000);
  for(const frame of frames()){
   assert.equal(await frame.locator('.nt-home').getAttribute('data-start-focus'),'false');
   assert.equal(await frame.locator('.nt-tile[data-focus=true] .nt-tile-start').evaluate(n=>getComputedStyle(n).display),'none');
  }
  await page.selectOption('#view','plaza');await page.waitForTimeout(12000);
  await page.screenshot({path:'preview/wiiu-refined-glass-plaza.png',timeout:30000});
  assert.deepEqual(errors,[]);
  console.log('PASS two previews: stock previous and fallback refined defaults, explicit previous/refined options, Start/ring modes, Plaza');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
