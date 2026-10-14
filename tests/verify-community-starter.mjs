import assert from 'node:assert/strict';
import {mkdirSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer();const browser=await launch();
try{
  const page=await browser.newPage({viewport:{width:1304,height:1020}}),errors=[];
  page.on('pageerror',e=>errors.push(e.message));await page.emulateMedia({reducedMotion:'reduce'});
  await page.goto(url);await page.waitForFunction(()=>window.__applyPreset?.('community-starter'));
  const outer=page.locator('[data-dht-root] iframe'), f=()=>page.frameLocator('[data-dht-root] iframe').frameLocator('iframe');
  await f().locator('#theme-id').getByText('community-starter',{exact:true}).waitFor();
  assert.equal(await f().locator('#connection').count(),0);
  assert.equal(await outer.getAttribute('sandbox'),'allow-scripts');
  await f().getByRole('button',{name:'Check sandbox isolation'}).click();
  assert.match(await f().locator('#isolation-result').textContent(),/Parent document: blocked/);
  await f().getByRole('button',{name:'Try the library demo'}).click();
  assert.ok(await f().locator('.game-row').count()>0);
  await f().getByRole('button',{name:'Play…',exact:true}).first().click();
  await f().getByRole('button',{name:'Cancel',exact:true}).click();assert.equal(await f().locator('#launch-confirm').isVisible(),false);
  await f().locator('[data-lesson=saved]').click();await f().locator('#saved-note').fill('My annotated starter');await f().locator('#save-note').click();
  await page.waitForFunction(()=>window.__getThemeSettings().frameData?.['community-starter']?.starterNote==='My annotated starter');
  await f().locator('#increment').click();await page.waitForFunction(()=>window.__getThemeSettings().frameData['community-starter'].starterCounter===1);
  await f().getByRole('link',{name:'Read it on another page'}).click();
  await f().locator('#note').getByText('My annotated starter',{exact:true}).waitFor();
  await f().locator('#increment').click();await f().locator('#counter').getByText('2',{exact:true}).waitFor();
  await f().locator('#back').click();await f().locator('#saved-result').getByText(/counter: 2/).waitFor();
  await f().locator('[data-lesson=services]').click();await f().getByRole('button',{name:'Read allowed settings'}).click();
  await f().locator('#service-result').getByText(/clock24/).waitFor();
  await f().locator('[data-lesson=motion]').click();await f().locator('#draw-count').getByText(/static/).waitFor();
  await f().locator('#change-color').click();assert.match(await f().locator('#draw-count').textContent(),/Draws:/);
  await f().locator('[data-lesson=files]').click();await f().getByRole('heading',{name:'Make this starter yours'}).waitFor();assert.match(await f().locator('#lesson').textContent(),/ZIP the folder contents/);
  await f().locator('[data-lesson=overview]').click();await f().getByRole('heading',{name:'Your UI. ThemeHub’s data.'}).waitFor();
  await f().getByRole('button',{name:'Check sandbox isolation'}).focus();await page.keyboard.press('ArrowDown');
  assert.notEqual(await f().locator('#lesson').evaluate(()=>document.activeElement?.textContent),'Check sandbox isolation');
  mkdirSync('out/community-starter',{recursive:true});
  for(const height of [800,720]){await outer.evaluate((n,h)=>{n.style.width='1280px';n.style.height=h+'px';},height);await page.waitForTimeout(150);assert.ok(await f().locator('body').evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));await f().locator('aside').evaluate(n=>n.scrollTop=0);await outer.screenshot({path:`out/community-starter/home-${height}.png`});}
  assert.deepEqual(errors,[]);console.log('PASS: annotated lessons, real sandbox, library confirmation, saved data, separate page/back, read services, static animation, controller focus and 800/720 layouts.');
}finally{await browser.close();server.close();}
