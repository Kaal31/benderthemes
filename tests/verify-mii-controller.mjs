import assert from 'node:assert/strict';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{const p=await browser.newPage();await p.goto(url+'?theme=wiiu&still=1');await p.locator('[data-dht-root]').waitFor();await p.evaluate(()=>{const s=window.__getThemeSettings();window.__updateTheme({styles:{...s.styles,wiiu:{...s.styles?.wiiu,profile:'on',profilePicture:'mii'}}});});await p.getByRole('button',{name:'Create or edit personal Mii'}).click();const dialog=p.getByRole('dialog',{name:'Personal Mii creator'});await dialog.waitFor();
const press=key=>p.evaluate(key=>window.dispatchEvent(new KeyboardEvent('keydown',{key,bubbles:true})),key);
await dialog.getByRole('button',{name:'Hair',exact:true}).focus();await press('Enter');await dialog.locator('[data-category=Hair]').waitFor();
await press('ArrowRight');assert.ok(await p.evaluate(()=>!!document.activeElement?.closest('.personal-mii')),'D-pad keeps focus inside creator');
await dialog.getByRole('button',{name:'Body',exact:true}).focus();await press('Enter');const select=dialog.locator('select').first();await select.focus();await press('ArrowRight');assert.equal(await select.inputValue(),'true');
await press('Escape');await dialog.waitFor({state:'detached'});console.log('PASS Mii creator Deck button routing, tab activation, focus, select adjustment and B close');
}finally{await browser.close();server.closeAllConnections();server.close();}
