import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const names={'blue-glass':'Blue Glass',gameamp:'GameAmp',gamecube:'GameCube',ios6:'iOS 6 Classic','old-big-picture':'Old Big Picture','santa-express':'Santa Express','wiiflow-default':'WiiFlow Default'};
const {server,url}=await startPreviewServer();const browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1304,height:930}}),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 for(const [id,name] of Object.entries(names).filter(([id])=>!process.env.HUB_THEMES||process.env.HUB_THEMES.split(',').includes(id))){
  await page.evaluate(id=>window.__updateTheme({theme:['ios6','gameamp','santa-express','old-big-picture'].includes(id)?id:'frame',activeTheme:id,hubStyle:'auto',animations:false}),id);
  await page.locator(`[data-react-theme="${id}"],[data-native-theme="${id}"]`).waitFor();
  await page.getByRole('button',{name:'Hub (from this home)',exact:true}).click();
  await page.locator(`.dht-market[data-hub-theme="${id}"][data-hub-source=auto]`).waitFor();
  await page.evaluate(id=>window.__updateTheme({hubStyle:id}),id);await page.getByRole('button',{name:`Hub style: ${name}`,exact:true}).waitFor();await page.locator(`.dht-market[data-hub-theme="${id}"][data-hub-source=setting]`).waitFor();
  await page.evaluate(()=>window.__updateTheme({hubStyle:'preview'}));
  const card=page.locator('.market-card').filter({has:page.locator('strong',{hasText:name})});if(!await card.count())console.log('Available Hub cards:',await page.locator('.market-card strong').allTextContents());await card.click();
  await page.locator(`.dht-market[data-hub-theme="${id}"][data-hub-source=preview]`).waitFor();
  await page.locator('.market-detail-art img').waitFor();await page.waitForFunction(()=>{const image=document.querySelector('.market-detail-art img');return image?.complete&&image.naturalWidth>0;});
  assert.deepEqual(errors,[]);console.log('PASS Auto, fixed and Preview Hub styles plus loaded preview:',id);
  await page.locator('.market-close').click();
 }
 const catalog=JSON.parse(readFileSync('asset-catalog.json','utf8'));
 assert.equal(catalog.gallery.themes.length,31);
 for(const id of catalog.gallery.themes)for(const ext of ['gif','jpg'])assert.ok(readFileSync(`out/theme-previews/${id}.${ext}`).length>0);
 console.log('PASS all 31 gallery themes have animated previews and posters');
}finally{await browser.close();server.closeAllConnections();server.close();}
