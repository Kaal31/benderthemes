import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const packs=JSON.parse(readFileSync('asset-catalog.json','utf8')).themes.filter(p=>p.frameTheme).map(p=>({...p,compatible:true,installedVersion:null}));
const manifests=packs.map(p=>({...JSON.parse(readFileSync(`themes/${p.frameTheme}/theme.json`,'utf8')),source:'bundled'}));
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.addInitScript(({packs,manifests})=>{window.__themeCatalog={themes:packs};window.__dataThemes={base:location.origin+'/themes',wrap:location.origin+'/frame-wrap',themes:manifests};},{packs,manifests});
 await page.goto(url+'?theme=vita&still=1');
 await page.getByRole('button',{name:'Hub',exact:true}).first().click();
 for(const pack of packs){
   const card=page.locator('.market-card').filter({has:page.locator('strong',{hasText:pack.name})});
   assert.equal(await card.count(),1,pack.id+' appears once');
   await card.click();
   await page.getByRole('button',{name:'Download theme'}).waitFor();
   assert.match(await page.locator('.dht-hub-detail').innerText(),/After download/);
 }
 await page.locator('.market-card').filter({has:page.locator('strong',{hasText:'GameCube'})}).click();
 await page.getByRole('button',{name:'Download theme'}).click();
 await page.waitForFunction(()=>window.__themeInstallCalls?.includes('gamecube'));
 await page.waitForFunction(()=>window.__getThemeSettings().activeTheme==='gamecube');
 assert.deepEqual(errors,[]);
 console.log('PASS seven single Hub cards show Download, report offline-after-download and install before GameCube activation');
}finally{await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
