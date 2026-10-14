import {execFileSync} from 'node:child_process';
import {readFileSync,writeFileSync} from 'node:fs';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
execFileSync(process.execPath,['silver-check.mjs'],{stdio:'inherit'});
writeFileSync('preview/onyx.html',readFileSync('preview/silver.html','utf8').replace('window.__themePreview="silver"','window.__themePreview="onyx"'));
const browser=await chromium.launch();
try{
 const p=await browser.newPage();const errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto(pathToFileURL(resolve('preview/onyx.html')).href);
 for(const style of ['covers','square','icons']){
  await p.getByLabel('Preview carousel style').selectOption(style);
  assert.equal(await p.locator('.silver-home').getAttribute('data-carousel'),style);
 }
 for(const name of ['Preview screen glass','Preview cover glass']){
  for(const mode of ['clear','prism','off'])await p.getByLabel(name).selectOption(mode);
 }
 await p.getByLabel('Preview animations',{exact:true}).uncheck();
 assert.equal(await p.locator('.silver-home').getAttribute('data-motion'),'false');
 await p.getByLabel('Preview animations',{exact:true}).check();
 for(const expected of ['Library','Discover','More','Now Playing','Games']){
  await p.locator('.silver-wheel-menu').click();
  assert.equal(await p.locator('.onyx-screen').getAttribute('data-page'),expected);
 }
 await p.locator('.onyx-tabs').getByRole('button',{name:'Now Playing',exact:true}).click();
 await p.locator('.onyx-albums button').first().click();
 await p.waitForFunction(()=>Number(document.querySelector('.onyx-progress input')?.max)>20);
 assert.equal(await p.locator('.dht-media-mini').count(),0);
 await p.locator('.silver-wheel-next').click();
 await p.getByRole('heading',{name:'Slow Drift',exact:true}).waitFor();
 await p.locator('.onyx-tabs').getByRole('button',{name:'Games',exact:true}).click();
 await p.locator('.dht-media-mini').waitFor();
 assert.deepEqual(errors,[]);
 console.log('PASS: Onyx carousel/glass options, animations, MENU cycle, music skip and floating-player visibility');
}finally{await browser.close();}
