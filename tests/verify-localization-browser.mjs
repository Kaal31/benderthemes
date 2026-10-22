import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';

const {server,url}=await startPreviewServer(),browser=await launch();
try {
  for(const locale of ['en','pt-br','pt-BR']) {
    const page=await browser.newPage({viewport:{width:1304,height:1040}}),errors=[];
    page.on('pageerror',e=>errors.push(e.message));
    await page.addInitScript(locale=>{window.LocalizationManager={m_rgLocalesToUse:[locale]};},locale);
    await page.goto(url+'?theme=switch&switchTheme=&still=1');
    await page.locator('.dht-switch-dock-item').first().waitFor();
    assert.equal(await page.locator('.dht-switch-dock-item').count(),6,'Translated dock retains all entries');
    await page.evaluate(()=>window.__updateTheme({styles:{...window.__getThemeSettings().styles,switch:{standardSkin:'black'}},animations:false}));
    await page.waitForFunction(()=>document.querySelector('.dht-switch-root').dataset.standardSkin==='black');
    assert.match(await page.locator('.dht-switch-standard-focus .dht-switch-focus').evaluate(n=>getComputedStyle(n).boxShadow),/230, 0, 18/,'Black home uses the red focus accent');
    await page.evaluate(()=>window.__openPlace('settings'));
    await page.locator('.dht-destination-row').first().waitFor();
    const labels=await page.locator('.dht-row-label').allTextContents();
    assert.ok(labels.includes(locale==='en'?'Icon size':'Tamanho dos ícones'));
    assert.ok(labels.includes(locale==='en'?'Game order':'Ordem dos jogos'));
    assert.ok(!labels.includes('iconSize')&&!labels.includes('gameOrder'));
    await page.keyboard.press('Escape');
    await page.locator('.dht-destination').waitFor({state:'detached'});
    await page.evaluate(()=>window.__updateTheme({theme:'wiiu'}));
    await page.locator('[data-dht-theme="wiiu"]').waitFor();
    assert.equal(await page.getByText('This theme hit an error.',{exact:false}).count(),0);
    assert.deepEqual(errors,[]);
    console.log(`PASS ${locale}: Switch dock, red focus, localized settings and Wii U render`);
    await page.close();
  }
} finally {await browser.close();server.close();}
