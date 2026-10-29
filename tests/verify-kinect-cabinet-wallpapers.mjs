import assert from 'node:assert/strict';import {chromium} from 'playwright';
import {readFileSync} from 'node:fs';
const items=JSON.parse(readFileSync('py_modules/x360-cabinet-wallpapers.json')).items;
const b=await chromium.launch();
try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/x360-kinect-cabinet.html?theme=x360&xs=kinect&cabinet=NAC&still=1',{waitUntil:'domcontentloaded'});
 await p.locator('.dht-kinect-cabinet-wallpaper').waitFor();await p.waitForTimeout(7000);
 for(const item of items){
  await p.evaluate(id=>window.__updateSettings({x360:{...window.__getThemeSettings?.()?.x360,style:'kinect',cabinetWallpaper:id}}),item.id);
  const image=p.locator('.dht-kinect-cabinet-wallpaper');
  await p.waitForFunction(id=>document.querySelector('.dht-kinect-cabinet-wallpaper')?.getAttribute('src')?.endsWith(id+'.jpg'),item.id);
  await image.evaluate(n=>n.decode());
  const bounds=await image.boundingBox();assert(Math.abs(bounds.width/bounds.height-16/9)<.01);assert.equal(await image.evaluate(n=>getComputedStyle(n).objectFit),'contain');
  if(['NAC','NAOMI_theme','egret_II_theme','blast_city'].includes(item.id))await p.screenshot({path:`preview/kinect-cabinet-${item.id}.png`});
 }
 await p.setViewportSize({width:960,height:720});const bounds=await p.locator('.dht-kinect-cabinet-wallpaper').boundingBox();assert(Math.abs(bounds.width/bounds.height-16/9)<.01);
 assert.deepEqual(errors,[]);console.log('PASS all 11 cabinet wallpapers: decoded, fitted 16:9 without cropping, 960px layout, no browser errors');
}finally{await b.close();}
