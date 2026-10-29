import {build} from 'esbuild';import {writeFileSync,mkdirSync,readFileSync} from 'node:fs';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';import assert from 'node:assert/strict';
mkdirSync('out/startup-preferences',{recursive:true});
const result=await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {seedSettings,getSettings} from './src/settings';import {ThemeLoadingScreen} from './src/ThemeLoadingScreen';import {startupIntroEnabled} from './src/startupPreferences';const root=createRoot(document.getElementById('root'));let n=0;window.showLoading=(s)=>{seedSettings(s);root.render(<ThemeLoadingScreen key={++n} id="wiiu"/>);};window.state=getSettings;window.intro=()=>startupIntroEnabled();`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',alias:{'@decky/ui':'./preview/stubs/ui.tsx','@decky/api':'./preview/stubs/api.ts'}});
writeFileSync('out/startup-preferences/loading.html','<div id="root"></div><script>'+result.outputFiles[0].text.replace(/<\/script/g,'<\\/script')+'</script>');
const {server,url}=await startPreviewServer(),browser=await launch();try{
 const p=await browser.newPage();p.setDefaultTimeout(12000);await p.goto(url.replace('/preview/preview.html','/out/startup-preferences/loading.html'));
 await p.evaluate(()=>window.showLoading({onboardingDone:false}));await p.locator('.dht-loading-logo').waitFor();await p.waitForFunction(()=>window.state().hubStartupSeen===true);
 await p.evaluate(()=>window.showLoading({...window.state()}));await p.locator('.dht-loading-logo').waitFor({state:'detached'});assert.match(await p.locator('[role=status]').innerText(),/Preparing your home/);
 await p.evaluate(()=>window.showLoading({onboardingDone:true}));assert.equal(await p.locator('.dht-loading-logo').count(),0);
 await p.evaluate(()=>window.showLoading({onboardingDone:true,hubStartupAnimation:true}));await p.locator('.dht-loading-logo').waitFor();
 await p.evaluate(()=>window.showLoading({theme:'wiiu',themeStartupIntros:{wiiu:false}}));assert.equal(await p.evaluate(()=>window.intro()),false);
 await p.evaluate(()=>window.showLoading({theme:'ps5',themeStartupIntros:{wiiu:false}}));assert.equal(await p.evaluate(()=>window.intro()),true);
 await p.evaluate(()=>window.showLoading({theme:'wiiu',activeTheme:'custom-wiiu',themeStartupIntros:{'custom-wiiu':false}}));assert.equal(await p.evaluate(()=>window.intro()),false);
 const preview=readFileSync('preview/preview.html','utf8');
 writeFileSync('out/startup-preferences/disabled.html',preview.replace('<head>','<head><base href="/preview/">').replace('</body>',`<script>window.__updateTheme({animations:true,themeStartupIntros:{wiiu:false,ps1:false,ps5:false},styles:{ps1:{boot:'show'},wiiu:{boot:'on'}}});</script></body>`));
 for(const theme of ['wiiu','ps1','ps5']){
  await p.goto(url.replace('/preview/preview.html','/out/startup-preferences/disabled.html')+'?theme='+theme);
  await p.locator('[data-dht-root][data-dht-theme]').waitFor();await p.waitForTimeout(500);
  assert.equal(await p.locator('.nt-boot,.dht-console-startup,.dht-intro').count(),0,'No automatic startup for disabled '+theme);
  console.log('PASS automatic startup disabled in actual renderer:',theme);
 }
 console.log('PASS first-install branding, repeat suppression, existing-install migration, explicit opt-in and independent per-theme intro preferences');
}finally{await browser.close();server.closeAllConnections();server.close();}
