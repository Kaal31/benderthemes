import {chromium} from 'playwright';
import {startPreviewServer} from '../preview/server.mjs';
import assert from 'node:assert/strict';
const {server,url}=await startPreviewServer();const b=await chromium.launch({headless:true});
try{
 const p=await b.newPage({viewport:{width:1304,height:930}});await p.goto(url);
 await p.getByRole('button',{name:'Hub',exact:true}).first().click();
 await p.getByRole('button',{name:'Plugin Spotlight',exact:true}).click();
 await p.locator('.spotlight-card').first().waitFor();assert.equal(await p.locator('.spotlight-card').count(),21);
 assert.equal(await p.locator('.market-grid').count(),0);
 await p.locator('.spotlight-detail .market-primary').click();
 await p.getByRole('status').filter({hasText:'Preview: Decky'}).waitFor();
 await p.locator('.spotlight-card').nth(6).click();assert.equal(await p.locator('.spotlight-detail .market-primary').isDisabled(),true);
 await p.locator('.spotlight-card').last().click();await p.locator('.spotlight-detail h3').filter({hasText:'Dimensions Toypad'}).waitFor();
 assert.equal(await p.locator('.spotlight-detail .market-primary').isEnabled(),true);
 const visible=await p.locator('.spotlight-card').last().evaluate(el=>{const a=el.getBoundingClientRect(),b=el.parentElement.getBoundingClientRect();return a.top>=b.top-1&&a.bottom<=b.bottom+1});assert.equal(visible,true);
 await p.keyboard.press('ArrowUp');await p.locator('.spotlight-detail h3').filter({hasText:'Gemstone'}).waitFor();
 await p.locator('.spotlight-card').first().click();
 await p.locator('[data-dht-root]').screenshot({path:'out/theme-previews/spotlight.png'});
 await p.keyboard.press('e');await p.locator('.market-grid').waitFor();
 console.log('PASS: 21 Spotlight projects, preview install, unavailable installers, scrolling and controller selection.');
}finally{await b.close();server.close();}
