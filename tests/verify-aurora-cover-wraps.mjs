import {chromium} from 'playwright';
import assert from 'node:assert/strict';
import {writeFileSync,mkdirSync} from 'node:fs';

mkdirSync('out/cover-wrap-smoke',{recursive:true});
const image='out/cover-wrap-smoke/test-wrap.png';
const browser=await chromium.launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:720}});
 page.setDefaultTimeout(8000);page.setDefaultNavigationTimeout(20000);
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(()=>{
  window.__isThemePreview=true;window.__coverWrapSearch={candidates:[{provider:'xboxunity',platform:'xbox360',id:'45410912',name:'Portal 2',score:.82}],errors:[]};
  const canvas=document.createElement('canvas');canvas.width=1500;canvas.height=1000;const ctx=canvas.getContext('2d');ctx.fillStyle='#256ebc';ctx.fillRect(0,0,720,1000);ctx.fillStyle='#71b93b';ctx.fillRect(720,0,60,1000);ctx.fillStyle='#de8031';ctx.fillRect(780,0,720,1000);ctx.fillStyle='white';ctx.font='80px Arial';ctx.fillText('BACK',100,180);ctx.fillText('FRONT',850,180);
  window.__coverWrapSelection={mode:'selected',source:'xboxunity',url:canvas.toDataURL('image/png')};
 });
 await page.goto('http://127.0.0.1:8911/preview/aurora-cover-sources.html?theme=x360&x360skin=archive-42de3e685a87&x360flow=archive-c53a8afc5acb&demoGames=74&still=1');
 writeFileSync(image,Buffer.from((await page.evaluate(()=>window.__coverWrapSelection.url)).split(',')[1],'base64'));
 const flow=page.locator('[data-aurora-coverflow]');await flow.waitFor();
 await page.waitForTimeout(1300);
 await page.locator('body').click({position:{x:640,y:160}});await page.waitForTimeout(350);
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:4})));
 await page.getByRole('button',{name:'Cover artwork',exact:true}).click();
 await page.locator('[data-cover-wrap-panel]').waitFor();
 await page.getByRole('button',{name:'Search providers',exact:true}).click();
 await page.getByRole('button',{name:/Portal 2 · XBOX360/}).waitFor();
 assert.equal(await flow.getAttribute('data-wrap-source'),null,'Fuzzy candidate stays unapplied');
 await page.getByRole('button',{name:/Portal 2 · XBOX360/}).click();
 await page.waitForFunction(()=>document.querySelector('[data-aurora-coverflow]')?.dataset.wrapSource==='xboxunity');
 await page.locator('[data-cover-wrap-preview]').evaluate(n=>n.decode());
 mkdirSync('out/cover-wrap-smoke',{recursive:true});
 await page.screenshot({path:'out/cover-wrap-smoke/provider-choice.png'});
 await page.getByRole('button',{name:'Generate from game artwork',exact:true}).click();
 await page.waitForFunction(()=>document.querySelector('[data-cover-wrap-panel]')?.textContent.includes('Current: Generated sleeve'));
 assert.equal(await page.locator('[data-cover-wrap-preview]').count(),0);
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:2})));await page.waitForTimeout(250);
 assert.equal(await page.locator('[data-cover-wrap-panel]').count(),0);
 // A manual upload uses the same full-wrap path and keeps its own branding.
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:4})));await page.getByRole('button',{name:'Cover artwork',exact:true}).click();
 const [chooser]=await Promise.all([page.waitForEvent('filechooser'),page.getByRole('button',{name:'Import full wrap…',exact:true}).click()]);
 await chooser.setFiles(image);
 await page.waitForFunction(()=>document.querySelector('[data-aurora-coverflow]')?.dataset.wrapSource==='Local wrap');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:2})));await page.waitForTimeout(300);
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:4})));await page.getByRole('button',{name:'Inspect cover',exact:true}).click();
 await page.waitForTimeout(400);
 await page.screenshot({path:'out/cover-wrap-smoke/wrap-front.png'});
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:12})));await page.waitForTimeout(450);
 assert.equal(await flow.getAttribute('data-pose-mode'),'ZoomOut');
 await page.screenshot({path:'out/cover-wrap-smoke/wrap-back.png'});
 // The same selector is reachable in FSD, with modal input owning D-pad/B.
 await page.goto('http://127.0.0.1:8911/preview/aurora-cover-sources.html?theme=x360&x360skin=archive-cf43bb93c48a&demoGames=74&still=1');
 await page.locator('[data-imported-xui-scene]').waitFor();await page.waitForTimeout(700);
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:14})));
 await page.getByText('Cover artwork',{exact:true}).click();
 await page.locator('[data-cover-wrap-panel]').waitFor();
 const scene=await page.locator('[data-imported-xui-scene]').getAttribute('data-imported-xui-scene');
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:10})));
 await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:2})));
 await page.locator('[data-cover-wrap-panel]').waitFor({state:'detached'});
 assert.equal(await page.locator('[data-imported-xui-scene]').getAttribute('data-imported-xui-scene'),scene,'Closing artwork leaves the FSD scene unchanged');
 assert.deepEqual(errors,[]);
 console.log('PASS fuzzy selection, downloaded wrap, generated fallback, manual upload, front/back inspection, FSD access, modal controller close, no browser errors');
}finally{await browser.close()}
