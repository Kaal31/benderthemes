import assert from 'node:assert/strict';import {chromium} from 'playwright';import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await chromium.launch(),out='work/themezer-validation/titles';mkdirSync(out,{recursive:true});const results=[];
try{for(const id of ['3595','14665','B145','9466','977B','103D0','184DB']){
 const skin=JSON.parse(readFileSync(`work/themezer-validation/${id}.json`)),page=await browser.newPage({viewport:{width:1304,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(s=>window.__testSwitch=s,skin);await page.goto(url+'?theme=switch&still=1&h=720');await page.waitForFunction(()=>window.__updateTheme);await page.evaluate(f=>window.__updateTheme({switchTheme:f,animations:true}),skin.file);await page.locator('.dht-switch-game-root').first().waitFor();await page.waitForTimeout(1500);
 await page.locator('.dht-switch-root').evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=9000}));
 const text=page.locator('.dht-switch-native-title-text'),cover=page.locator('.dht-switch-tile[data-selected="true"] [data-nx-pane="game"]');
 if(id==='184DB'){assert.equal(await text.isVisible(),false,'Imported hidden tooltip must stay hidden');}
 else{
  assert.equal(await text.count(),1);assert(await text.isVisible());
  const title=await text.boundingBox(),art=await cover.boundingBox(),stage=await page.locator('.dht-switch-root').boundingBox();
  if(id==='103D0'){assert(title.height>title.width*3,'Splatoon title must rotate once into a vertical label');assert(title.x+title.width<=art.x+2,'Vertical title must remain beside the artwork');}
  else{assert(title.y>=art.y+art.height-1,`${id}: title must sit below the cover: `+JSON.stringify({title,art}));assert(title.x>=stage.x-1,'Title must not begin off-screen');}
  assert.equal(await text.locator('xpath=ancestor::*[@data-scene-pane="L_Balloon"]').count(),1,'Referenced balloon must retain its instance ancestor');
  if(id==='3595'||id==='14665'){
   await page.keyboard.press('ArrowRight');await page.waitForTimeout(150);await page.locator('.dht-switch-root').evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=9000}));
   assert.equal(await text.count(),1);assert.match(await text.textContent(),/Hades/,'Title must follow the selected game');
   await page.keyboard.press('ArrowDown');await page.waitForTimeout(100);assert.equal(await page.locator('.dht-switch-native-title').count(),0,'Game title must disappear when focus moves to applets');
  }
  results.push({id,title,art});
 }
 assert.deepEqual(errors,[]);console.log('PASS native title',id);await page.close();
}writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));}finally{await browser.close();server.close();}
