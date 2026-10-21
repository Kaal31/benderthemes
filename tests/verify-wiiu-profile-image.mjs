import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {launch} from './browser.mjs';

const {outputFiles}=await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {WiiuProfileImage} from './src/themes/WiiuProfileImage';const root=createRoot(document.getElementById('root'));window.renderProfile=(urls,account='one')=>root.render(<WiiuProfileImage key={account} urls={urls}/>);`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic'});
const browser=await launch();
try{
 const page=await browser.newPage();let broken=0,release;
 const svg='<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="cyan"/></svg>';
 await page.route('http://profile.test/**',async route=>{
  const url=route.request().url();
  if(url==='http://profile.test/'){await route.fulfill({contentType:'text/html',body:'<div id="root"></div>'});return;}
  if(url.endsWith('broken')){broken++;await route.fulfill({status:404,body:''});return;}
  if(url.endsWith('slow')&&!release)await new Promise(resolve=>{release=resolve;});
  await route.fulfill({contentType:'image/svg+xml',body:svg});
 });
 await page.goto('http://profile.test/');await page.setContent('<div id="root"></div>');await page.addScriptTag({content:outputFiles[0].text});
 const render=(urls,account)=>page.evaluate(({urls,account})=>window.renderProfile(urls,account),{urls,account});
 await render([]);await page.locator('svg.nt-profile-placeholder').waitFor();
 await render(['http://profile.test/good','http://profile.test/placeholder']);await page.waitForFunction(()=>document.querySelector('#root img')?.src.endsWith('/good'));
 await render(['http://profile.test/slow']);await page.waitForTimeout(100);assert.ok((await page.locator('#root img').getAttribute('src')).endsWith('/good'),'Keep loaded picture while replacement is pending');release();await page.waitForFunction(()=>document.querySelector('#root img')?.src.endsWith('/slow'));
 await render(['http://profile.test/broken','http://profile.test/placeholder']);await page.waitForFunction(()=>document.querySelector('#root img')?.src.endsWith('/placeholder'));
 await render(['http://profile.test/broken']);await page.locator('svg.nt-profile-placeholder').waitFor();
 await render(['http://profile.test/broken','http://profile.test/placeholder']);await page.locator('#root img').waitFor();assert.equal(broken,1,'A broken image is attempted only once, including after rerenders');
 await render([],'another-account');await page.locator('svg.nt-profile-placeholder').waitFor();assert.equal(await page.locator('#root img').count(),0,'Do not retain another account picture');
 console.log('PASS stable Wii U profile loading, bounded fallback, empty slot and account reset');
}finally{await browser.close();}
