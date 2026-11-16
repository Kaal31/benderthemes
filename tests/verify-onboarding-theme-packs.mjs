import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';

const catalog=JSON.parse(readFileSync('theme-catalog.json','utf8'));
const {server,url}=await startPreviewServer();
const browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1280,height:800}});
 const preview=process.env.ONBOARDING_PREVIEW??url.replace('preview.html',process.env.ONBOARDING_FILE??'preview.html');
 for(const pack of catalog.themes.filter(p=>['ios6','gameamp','santa-express','old-beta-big-picture','old-big-picture','reading'].includes(p.frameTheme??p.theme))){
  await page.goto(preview+'?theme=psp&still=1');
  await page.locator('[data-dht-root]').waitFor();
  await page.evaluate(pack=>{
   window.__inventoryFromInstalled=true;window.__testInventory={};
   window.__themeCatalog.themes=[{...pack,installedVersion:undefined}];
   window.__themeInstallGate=new Promise(()=>{});
   window.__updateTheme({theme:'psp',activeTheme:'',onboardingDone:false});
  },pack);
  await page.getByRole('button',{name:'Get started',exact:true}).click();
  const choice=page.locator('.dht-ob-item').filter({has:page.locator('strong',{hasText:pack.name})});
  await choice.click();
  if(await page.locator('.dht-ob-pick').count())await page.locator('.dht-ob-primary').click();
  await page.locator('.dht-ob-done .dht-ob-primary').click();
  await page.waitForFunction(id=>window.__themeInstallCalls?.includes(id),pack.id);
  assert.equal(await page.locator('[role=alert]').count(),0,pack.id+' resolves its downloadable pack');
  assert.equal(await page.evaluate(()=>window.__getThemeSettings().onboardingDone),false);
  await page.waitForTimeout(600);
  assert.doesNotMatch(await page.locator('.dht-ob-done .dht-ob-primary').innerText(),/\uFFFD/,'status has no malformed punctuation');
  console.log('PASS onboarding download lookup: '+pack.id);
 }
 await page.goto(preview+'?theme=ios6&bugs=1&onboarding=1&still=1');
 await page.getByRole('button',{name:'Get started',exact:true}).click();
 for(const name of ['iiSU style (bonus)','iOS 6 Classic']){
  await page.locator('.dht-ob-item').filter({hasText:name}).focus();
  for(const edge of ['first','last']){
   const items=page.locator('.dht-ob-item');
   await items[edge]().focus();
   const space=await page.evaluate(()=>{
    const list=document.querySelector('.dht-ob-list'),selected=list.querySelector('[data-selected=true]');
    const a=list.getBoundingClientRect(),b=selected.getBoundingClientRect();
    return {top:b.top-a.top,bottom:a.bottom-b.bottom};
   });
   assert.ok(space.top>=6&&space.bottom>=6,JSON.stringify(space));
  }
 }
 const frames=await page.locator('.dht-ob-game').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).borderTopWidth));
 assert.equal(frames.length,4);assert.ok(frames.every(v=>v==='1px'),'all artwork and missing-art tiles keep a border');
 await page.screenshot({path:'preview/onboarding-frames-verified.png'});
 console.log('PASS focus rings remain inside scroll viewport and missing-art frames persist');
}finally{await browser.close();server.closeAllConnections();server.close();}
