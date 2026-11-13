const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('fs');
(async()=>{
 const browser=await chromium.launch();
 try {
  const page=await browser.newPage();
  const skin=JSON.parse(fs.readFileSync('out/n3ds-audit-fixture.json','utf8'));
  await page.addInitScript(skin=>{window.__test3ds=skin;},skin);
  await page.goto('http://127.0.0.1:8911/preview/n3ds-imported-audio.html?theme=n3ds');
  await page.waitForFunction(()=>window.__updateTheme);
  await page.evaluate(()=>window.__updateTheme({n3dsSkin:'Flipbook audit',sounds:false,backgroundMusic:false,themeStartupIntros:{n3ds:false}}));
  for(const element of await page.locator('.dht-console-startup,.dht-console-video').all()) await element.click({force:true}).catch(()=>{});
  await page.locator('.dht-n3ds-grid').waitFor();
  await page.waitForTimeout(1200);
  const frame=()=>page.evaluate(images=>images.findIndex(image=>document.querySelector('.dht-n3ds-bottom').style.backgroundImage.includes(image)),skin.bottom.frames);
  const first=await frame();
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:12}))); await page.waitForTimeout(150);let second=await frame(); if(second===first){await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:12})));await page.waitForTimeout(200);second=await frame();}
  assert(first>=0&&second>=0&&first!==second,'Flipbook must change on navigation '+[first,second]);
  await page.evaluate(()=>window.__updateTheme({themeFx:{'n3ds:Flipbook audit':{background:true,scroll:false,icons:true,labels:true,sounds:true}}}));
  await page.waitForTimeout(100);const frozen=await frame();
  await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:12}))); await page.waitForTimeout(150);assert.equal(await frame(),frozen,'Scroll toggle freezes flipbook');
  console.log('PASS flipbook changes with navigation and freezes when scrolling is disabled');
 }finally{await browser.close();}
})().catch(error=>{console.error(error);process.exit(1)});
