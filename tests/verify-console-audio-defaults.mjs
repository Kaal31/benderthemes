import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const catalog=JSON.parse(readFileSync('py_modules/deckthemes_audio_catalog.json','utf8'));
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const p=await browser.newPage(),errors=[];p.on('pageerror',e=>errors.push(e.message));await p.addInitScript(catalog=>{window.__deckthemesAudio=catalog;},catalog);
 await p.goto(url+'?theme=vita&still=1');await p.locator('[data-dht-root]').waitFor();
 const targets=[['switch','Switch'],['wii','Wii Menu Sounds'],['wiiflow-default','Wii Menu Sounds'],['n3ds','Nintendo 3DS UI']];
 for(const [id,name] of targets){
  await p.getByRole('button',{name:'Hub (from this home)',exact:true}).click();
  await p.locator('.market-card').filter({has:p.locator(`.market-art[data-theme="${id}"]`)}).click();await p.locator('.market-primary').click();await p.locator('.dht-market').waitFor({state:'detached'});
  await p.waitForFunction(({id,name})=>{const s=window.__getThemeSettings();return (id==='wiiflow-default'?s.activeTheme===id:s.theme===id)&&window.__autoPack(s.theme)?.name===name;},{id,name});
  const required=catalog.filter(a=>a.installWithTheme&&a.themes.includes(id));
  for(const audio of required)assert.ok(await p.evaluate(id=>window.__audioDownloadCalls.includes(id),audio.id),`${id}: required audio downloaded`);
  console.log('PASS automatic theme audio:',id);
 }
 const calls=await p.evaluate(()=>window.__audioDownloadCalls);assert.equal(new Set(calls).size,calls.length,'Shared Wii/WiiFlow dependencies reuse existing packs');
 for(const id of ['12b04b34-00c1-4600-8e71-eb0a77f47962','fb1780d7-12af-493d-a36d-28700870528a','61867c03-9f24-4c1c-a482-28a6f1841d04'])assert.ok(!calls.includes(id),'Optional alternatives never download automatically');
 assert.deepEqual(errors,[]);
}finally{await browser.close();server.closeAllConnections();server.close();}
