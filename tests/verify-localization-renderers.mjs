import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 for(const locale of ['english','brazilian']){
  const p=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
  p.on('pageerror',e=>errors.push(e.message));
  p.on('console',m=>{if(m.type()==='error'&&m.text().includes('[DeckHomeThemes] theme '))errors.push(m.text());});
  await p.addInitScript(locale=>{window.LocalizationManager={m_rgLocalesToUse:[locale]};},locale);
  await p.goto(url+'?theme=ps5&still=1');await p.waitForFunction(()=>!!window.__updateTheme);
  for(const theme of ['ps1','ps2','ps3','psp','ps4','ps5','vita','n3ds','wii','wiiu','xbox','x360','aero','aero2','dial','nazarick','iisu','minecraft','castle','republic','pain','silver','onyx','switch']){
   await p.evaluate(theme=>window.__updateTheme({theme,activeTheme:theme,animations:false,onboardingDone:true,themeStartupIntros:{[theme]:false}}),theme);
   await p.waitForTimeout(250);
   assert.equal(await p.getByText('This theme could not load',{exact:true}).count(),0,`${locale}: ${theme} mounts`);
   assert.deepEqual(errors,[],`${locale}: ${theme}`);
  }
  console.log(`PASS ${locale}: 24 localized theme renderers without runtime failures`);await p.close();
 }
}finally{await browser.close();server.closeAllConnections();server.close();}
