// Run with METRO_PREVIEW_URL pointing at a local preview connected to avatar_preview_backend.py.
import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
const url=process.env.METRO_PREVIEW_URL;
if(!url){console.log('SKIP: set METRO_PREVIEW_URL to a preview with installed avatar assets');process.exit(0);}
const bridge=new URL(url).searchParams.get('avatarBridge');assert(bridge);
const browser=await launch();
try {
  const page=await browser.newPage({viewport:{width:1280,height:900}}),errors=[];
  page.on('pageerror',error=>errors.push(error.message));
  await page.addInitScript(()=>{
    let assets;window.__legacyAvatarReads=0;
    Object.defineProperty(window,'__testAssets',{configurable:true,get:()=>assets,set:value=>{
      assets=new Proxy(value,{get(target,key){if(key==='my-avatar')window.__legacyAvatarReads++;return Reflect.get(target,key);}});
    }});
  });
  await page.route(bridge+'/x360_engine_status',async route=>{await new Promise(resolve=>setTimeout(resolve,2000));await route.continue();});
  await page.goto(url);
  await page.getByRole('button',{name:'social',exact:true}).click();
  const tile=page.locator('[data-social-avatar-stage]');
  await tile.getByRole('status').waitFor();
  assert.equal(await tile.locator('canvas').count(),0,'Legacy renderer must not mount while the new engine is loading');
  assert.equal(await page.evaluate(()=>window.__legacyAvatarReads),0,'Legacy model files must not preload');
  await tile.locator('[data-avatar-engine="ready"]').waitFor({timeout:45000});
  assert.equal(await page.evaluate(()=>window.__legacyAvatarReads),0,'Successful engine startup must never load fallback models');
  const canvas=tile.locator('canvas');assert.equal(await canvas.count(),1);
  const before=await canvas.boundingBox();
  await page.setViewportSize({width:1000,height:800});await page.waitForTimeout(300);
  const after=await canvas.boundingBox();assert(before.width>after.width&&before.height>after.height);
  assert(Math.abs(before.width/before.height-after.width/after.height)<.02,'Tile resizing must preserve the canvas aspect ratio');
  assert.deepEqual(errors,[]);
  console.log('PASS new engine loads first, zero fallback model reads, single Social renderer, responsive aspect ratio');
} finally {await browser.close();}
