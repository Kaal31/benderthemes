import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const previewUrl=pathToFileURL(resolve('preview/preview.html')).href;
import {chromium} from 'playwright';
const browser=await chromium.launch();
const errors=[];
for(const theme of ['ps4','ps5','ps3','psp','vita']){
 const page=await browser.newPage({viewport:{width:1304,height:960}});
 page.on('pageerror',e=>errors.push(`${theme}: ${e.message}`));
 await page.goto(`${previewUrl}?theme=${theme}&still=1`);
 await page.locator(`[data-dht-root][data-dht-theme="${theme}"]`).waitFor();
 await page.evaluate(()=>{const s=window.__getThemeSettings();window.__updateTheme({ps4GameBackgrounds:true,aAction:'theme',trailers:{...s.trailers,preview:true}});});
 if(theme==='vita') { await page.locator('.dht-bubble').first().waitFor(); await page.keyboard.press('e'); await page.waitForTimeout(400); await page.keyboard.press('ArrowRight'); await page.keyboard.press('Enter'); }
 if(theme==='ps3'||theme==='psp') for(let i=0;i<3;i++) await page.keyboard.press('ArrowDown');
 await page.locator('.dht-game-hero').waitFor();
 for(const mode of ['cover','contain','blur']){
  await page.evaluate(({theme,mode})=>{const s=window.__getThemeSettings();window.__updateTheme({styles:{...s.styles,[theme]:{...s.styles?.[theme],heroScaling:mode}}});},{theme,mode});
  await page.waitForTimeout(200);
  const result=await page.locator('.dht-game-hero').evaluate(async el=>{
   const imgs=[...el.querySelectorAll('img')];const fg=imgs.at(-1);await fg.decode().catch(()=>{});
   const cs=getComputedStyle(fg),r=fg.getBoundingClientRect();
   const scale=Math.min(r.width/fg.naturalWidth,r.height/fg.naturalHeight);
   return {mode:el.dataset.scaling,count:imgs.length,fit:cs.objectFit,transform:cs.transform,width:r.width,height:r.height,iw:fg.naturalWidth,ih:fg.naturalHeight,fullWidth:fg.naturalWidth*scale,fullHeight:fg.naturalHeight*scale,backdrop:imgs.length>1?getComputedStyle(imgs[0]).filter:''};
  });
  assert.equal(result.mode,mode);assert.equal(result.fit,mode==='cover'?'cover':'contain');
  assert.equal(result.count,mode==='blur'?2:1);assert(result.iw>0&&result.ih>0);
  if(mode!=='cover'){assert.equal(result.transform,'none');assert(result.fullWidth<=result.width+1&&result.fullHeight<=result.height+1);}
  if(mode==='blur') assert.match(result.backdrop,/blur\(28px\)/);
  if(theme==='ps5') await page.locator('.dht-ps5-bg').evaluate(el=>el.parentElement.setAttribute('data-hero-preview','true'));
  if(theme==='ps5') await page.locator('[data-hero-preview]').screenshot({path:`preview/ps5-scaling-${mode}.png`});
 }
 // Selecting a mode for this theme does not alter another theme's saved value.
 assert.equal(await page.evaluate(theme=>window.__getThemeSettings().styles[theme].heroScaling,theme),'blur');
 console.log(`PASS ${theme}: fill, full art, blurred fill; image loaded, uncropped geometry, no foreground zoom`);
 await page.close();
}
// 16:9 and 4:3 screens must also keep the whole foreground image visible.
for (const h of [720,960]) {
 const page=await browser.newPage({viewport:{width:1048,height:900}});
 await page.goto(`${previewUrl}?theme=ps5&h=${h}&still=1`);
 await page.locator('[data-dht-root][data-dht-theme="ps5"]').waitFor();
 await page.locator('.dht-game-hero').waitFor();
 for (const mode of ['contain','blur']) {
  await page.evaluate(mode=>{const s=window.__getThemeSettings();window.__updateTheme({styles:{...s.styles,ps5:{...s.styles?.ps5,heroScaling:mode}}});},mode);
  await page.waitForTimeout(200);
  const result=await page.locator('.dht-game-hero').evaluate(el=>{const img=el.querySelector('img:last-child'),r=img.getBoundingClientRect(),k=Math.min(r.width/img.naturalWidth,r.height/img.naturalHeight);return {fit:getComputedStyle(img).objectFit,visible:img.naturalWidth*k<=r.width+1&&img.naturalHeight*k<=r.height+1};});
  assert.equal(result.fit,'contain');assert(result.visible);
 }
 console.log(`PASS aspect 1280x${h}: full art stays within the viewport`);await page.close();
}
// Verify the option registry excludes layouts without a game backdrop.
const p=await browser.newPage();await p.goto(`${previewUrl}?theme=ps5&still=1`);
assert(await p.evaluate(()=>['ps4','ps5','ps3','psp','vita'].every(t=>window.__themeStyles[t].some(o=>o.key==='heroScaling'))));
assert(await p.evaluate(()=>!window.__themeStyles.switch?.some(o=>o.key==='heroScaling')));
assert.deepEqual(errors,[]);console.log('PASS options registered only for relevant layouts; no browser errors');await browser.close();
