import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {chromium} from 'playwright';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await chromium.launch(),results=[],out='preview/themezer-validation/visibility-check';mkdirSync(out,{recursive:true});
try{
 for(const id of ['75B9','796D','13696']){
  const skin=JSON.parse(readFileSync(`work/themezer-validation/${id}.json`)),conversion=skin.screens.home.conversion;
  const page=await browser.newPage({viewport:{width:1304,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   await page.addInitScript(s=>window.__testSwitch=s,skin);await page.goto(url+'?theme=switch&still=1&h=720');await page.waitForFunction(()=>window.__updateTheme);await page.evaluate(file=>window.__updateTheme({switchTheme:file,animations:true}),skin.file);await page.locator('.dht-switch-game-root').first().waitFor();await page.waitForTimeout(1500);
   for(const a of conversion.animations.filter(a=>a.pane.startsWith('scenePane:')&&a.event==='resume'&&a.tracks.some(t=>t.property===17))){
    const pane=a.pane.slice('scenePane:'.length),track=a.tracks.find(t=>t.property===17);
    if(conversion.panes[pane]?.Visible!==false)continue;
    const element=page.locator(`[data-nx-pane="${a.pane}"]`);assert.equal(await element.count(),1);
    // A looping player's terminal frame is the next iteration's initial pose.
    const keys=[track.keys.find(k=>k.value===1&&(!a.loop||k.frame<a.frames)),track.keys.find(k=>k.value===0&&(!a.loop||k.frame<a.frames))].filter(Boolean);
    for(const key of keys){
     await element.evaluate((el,time)=>el.getAnimations().forEach(player=>{player.pause();player.currentTime=time}),key.frame*1000/60+1);
     const state=await element.evaluate(el=>({display:getComputedStyle(el).display,visibility:getComputedStyle(el).visibility,players:el.getAnimations().length,box:el.getBoundingClientRect().toJSON()}));
     assert(state.players>0);assert.notEqual(state.display,'none','FLVI must be able to override authored hidden flags');assert.equal(state.visibility,key.value===1?'visible':'hidden',JSON.stringify({id,pane,key,state}));assert(state.box.width>0&&state.box.height>0);
     results.push({id,pane,frame:key.frame,visible:key.value===1,pass:true});
    }
    const visible=track.keys.find(k=>k.value===1);await element.evaluate((el,time)=>el.getAnimations().forEach(player=>{player.currentTime=time}),visible.frame*1000/60);
   }
   await page.locator('.dht-switch-tile[data-name="All Software"]').dispatchEvent('click');await page.waitForTimeout(500);
   await page.locator('.dht-switch-root').screenshot({path:`${out}/${id}.png`,animations:'allow'});assert.deepEqual(errors,[]);console.log('PASS animated hidden decorations',id);
  }finally{await page.close();}
 }
 assert(results.length>=6,'Real fixtures must exercise initially hidden panes');writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));
}finally{await browser.close();server.close();}
