import assert from 'node:assert/strict';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();try{
 const p=await browser.newPage();await p.goto(url+'?theme=onyx&still=1');await p.locator('[data-dht-root]').waitFor();
 await p.evaluate(()=>{const original=CSS.registerProperty.bind(CSS);let thrown=false;CSS.registerProperty=definition=>{if(!thrown){thrown=true;throw Error('Forced renderer failure for recovery test');}return original(definition);};window.__updateTheme({theme:'switch',activeTheme:''});});
 await p.locator('[data-theme-recovery]').waitFor();await p.getByRole('button',{name:'Open Theme Hub',exact:true}).click();await p.locator('.dht-market').waitFor();
 await p.getByRole('tab',{name:'Theme files',exact:true}).click();await p.locator('.dht-files').waitFor();
 await p.getByRole('tab',{name:'Discover',exact:false}).click();
 await p.locator('.market-card').filter({has:p.locator('.market-art[data-theme="vita"]')}).click();await p.locator('.market-primary').click();
 await p.waitForFunction(()=>window.__getThemeSettings().theme==='vita');await p.locator('[data-theme-recovery]').waitFor({state:'detached'});await p.locator('.dht-market').waitFor({state:'detached'});
 await p.evaluate(()=>{window.__frameMediaGate=new Promise(r=>window.finishLoadingMedia=r);window.__updateTheme({theme:'old-big-picture',activeTheme:'old-big-picture'});});
 await p.locator('[data-theme-loading=old-big-picture]').waitFor();await p.locator('[data-theme-loading=old-big-picture] h2').waitFor();const expectLogo=await p.evaluate(()=>{const s=window.__getThemeSettings();return s.hubStartupAnimation===true||s.hubStartupSeen===false;});assert.equal(await p.locator('.dht-loading-logo').count(),Number(expectLogo),'Hub loading logo must respect startup animation preferences');assert.equal(await p.locator('progress[aria-label="Theme download progress"]').count(),1);await p.evaluate(()=>finishLoadingMedia());await p.locator('[data-theme-loading=old-big-picture]').waitFor({state:'detached'});
 console.log('PASS renderer failure retains working Hub navigation/theme activation and host fallback respects optional branding and shows progress');
}finally{await browser.close();server.closeAllConnections();server.close();}
