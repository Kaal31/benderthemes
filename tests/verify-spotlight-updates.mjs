import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';

// Exercise the same notice and controller input used by the themed home.
const {server,url}=await startPreviewServer();
const browser=await launch();
try {
  const page=await browser.newPage({viewport:{width:1304,height:930}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{
    window.__spotlightUpdates={plugins:[{id:'youtube-pip',name:'YouTube PiP',repo:'otisabiburada/decky-youtube-pip',currentVersion:'0.5.0',version:localStorage.getItem('fixture-next-version')||'0.6.0',zipUrl:'https://github.com/otisabiburada/decky-youtube-pip/releases/download/0.6.0/youtube-pip-v0.6.0.zip',root:false,updateAvailable:true}],updateAvailable:true};
    window.DeckyBackend={call:async(...args)=>{(window.__updateCalls??=[]).push(args);}};
  });
  await page.goto(url);
  await page.getByRole('heading',{name:'YouTube PiP update available.'}).waitFor();
  assert.match(await page.locator('.fw-version').innerText(),/0.5.0[\s\S]*0.6.0/);
  await page.keyboard.press('Escape');
  await page.waitForFunction(()=>!document.querySelector('.dht-firmware'));
  await page.reload();
  await page.locator('[data-dht-root]').waitFor();
  assert.equal(await page.locator('.dht-firmware').count(),0,'dismissed version survives reload');
  await page.evaluate(()=>localStorage.setItem('fixture-next-version','0.7.0'));
  await page.reload();
  await page.getByRole('heading',{name:'YouTube PiP update available.'}).waitFor();
  assert.match(await page.locator('.fw-version').innerText(),/0.7.0/,'a newer version prompts despite dismissal of the previous version');
  await page.getByRole('button',{name:'A Accept update'}).click();
  await page.waitForFunction(()=>window.__updateCalls?.length===1);
  const calls=await page.evaluate(()=>window.__updateCalls);
  assert.equal(calls[0][0],'utilities/install_plugin');assert.equal(calls[0][2],'YouTube PiP');assert.equal(calls[0][5],2);
  assert.equal(await page.locator('.dht-firmware').count(),0,'notice yields to Decky confirmation');
  assert.deepEqual(errors,[]);

  const withDeckyUp=await browser.newPage({viewport:{width:1304,height:930}});
  await withDeckyUp.addInitScript(()=>{
    window.__spotlightUpdates={deckyUpInstalled:true,plugins:[{id:'youtube-pip',name:'YouTube PiP',repo:'otisabiburada/decky-youtube-pip',currentVersion:'0.5.0',version:'0.6.0',zipUrl:'https://github.com/otisabiburada/decky-youtube-pip/releases/download/0.6.0/youtube-pip-v0.6.0.zip',root:false,updateAvailable:true}],updateAvailable:true};
  });
  await withDeckyUp.goto(url);
  await withDeckyUp.getByRole('button',{name:'Hub',exact:true}).first().click();
  await withDeckyUp.getByRole('tab',{name:'Plugin Spotlight',exact:true}).click();
  await withDeckyUp.locator('.dht-spotlight-search input').fill('YouTube PiP');
  await withDeckyUp.getByRole('button',{name:'Update YouTube PiP',exact:true}).waitFor();
  assert.equal(await withDeckyUp.locator('.dht-firmware').count(),0,'DeckyUp suppresses automatic prompts while Spotlight retains the update');
  assert.equal(await withDeckyUp.evaluate(()=>localStorage.getItem('dht-dismissed-spotlight-updates')),null,'suppression does not dismiss a release');
  await withDeckyUp.close();

  // Backend rejection must prevent the handoff even when a frontend row exists.
  const bundle=await build({stdin:{contents:'export {installSpotlightUpdate} from "./src/SpotlightUpdates";',resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'esm',alias:{'@decky/ui':'./preview/stubs/ui.tsx','@decky/api':'./preview/stubs/api.ts'}});
  globalThis.window={addEventListener(){},DeckyBackend:{call:async()=>{throw new Error('must not install');}}};
  const module=await import('data:text/javascript;base64,'+Buffer.from(bundle.outputFiles[0].text).toString('base64'));
  await assert.rejects(()=>module.installSpotlightUpdate({id:'missing',version:'1.1.0',zipUrl:'https://example.com/no.zip',updateAvailable:true}),/Could not verify/);
  console.log('PASS: Spotlight prompt, controller dismissal, persisted dismissal, Decky update handoff and rejected verification.');
} finally {await browser.close();server.close();}
