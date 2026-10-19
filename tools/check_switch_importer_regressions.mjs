import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync,mkdirSync,writeFileSync} from 'node:fs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await chromium.launch(),out='preview/themezer-validation/importer-fixes';mkdirSync(out,{recursive:true});
const results=[];
try{
 for(const id of ['FFDC','106EF','B116'])for(const enabled of [true,false]){
  const page=await browser.newPage({viewport:{width:1304,height:960}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
  try{
   const skin=JSON.parse(readFileSync(`work/themezer-validation/${id}.json`));await page.addInitScript(s=>window.__testSwitch=s,skin);
   await page.goto(url+'?theme=switch&still=1&h=720');await page.waitForFunction(()=>window.__updateTheme);await page.evaluate(({file,enabled})=>window.__updateTheme({switchTheme:file,animations:enabled}),{file:skin.file,enabled});await page.locator('.dht-switch-game-root').first().waitFor();await page.waitForTimeout(4000);
   if(id==='FFDC'){
    const covers=await page.locator('.dht-switch-tile [data-nx-pane="game"] img').evaluateAll(imgs=>imgs.slice(0,5).map(img=>{let alpha=1;for(let e=img;e;e=e.parentElement)alpha*=Number(getComputedStyle(e).opacity);const r=img.getBoundingClientRect();return {alpha,width:r.width,height:r.height,loaded:img.complete&&img.naturalWidth>0};}));
    assert.equal(covers.length,5);assert(covers.every(c=>c.loaded&&c.alpha>.9),'Selected and unselected artwork must all be visibly painted');assert(covers[0].width>covers[1].width*1.8,'Authored active/inactive scales must stay distinct');
    await page.keyboard.press('ArrowRight');await page.waitForTimeout(3000);assert.equal(await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name'),'Hades');
    results.push({id,enabled,covers,pass:true});
   }else if(id==='106EF'){
    assert.equal(await page.locator('.dht-switch-bg').evaluate(el=>getComputedStyle(el).backgroundColor),'rgb(0, 0, 0)','Palette-only background patch must replace the gray fallback');
    const online=page.locator('.dht-switch-dock-item[data-name="Nintendo Switch Online"]');assert.equal(await online.count(),1);assert(await online.isVisible(),'Authored legacy NSO slot must survive automatic firmware mode');
    assert.equal(skin.screens.home.conversion.warnings.length,0);assert.equal(skin.screens.home.conversion.nativePanes.Cursor3.P_Grow.shadowFunction,5,'Cursor shadow Function must reach its actual native focus pass');const ignored=skin.screens.home.conversion.ignoredProperties;assert.equal(ignored.length,29,'Measured native-loader no-ops must stay separately visible');assert(ignored.every(item=>item.name==='S_DropShadowKnockout'&&item.profiles.join(',')==='19.0.1,22.5.0'));assert(await page.locator('.dht-switch-focus canvas').count()>0,'Selected focus must mount its real analytic shadow canvas');results.push({id,enabled,pass:true});
    assert.equal(await page.locator('.dht-switch-game-stack').evaluate(el=>getComputedStyle(el).height),'15px','Native N_Game size must define the game-group bounds');
    assert.equal(await page.locator('[data-hud-file="Hud"][data-hud-pane="RootPane"]').evaluate(el=>getComputedStyle(el).width),'500px','Native L_Hud size must replace the referenced layout root bounds');
   }else{
    const mask=page.locator('[data-nx-color-mask]');assert(await mask.count()>0);assert.equal(await mask.first().evaluate(el=>getComputedStyle(el).backgroundColor),'rgba(0, 0, 0, 0)');assert(await mask.locator('svg').count()>0,'Native applet color planes must use a picture mask instead of a solid rectangle');results.push({id,enabled,pass:true});
   }
   assert.deepEqual(errors,[]);await page.locator('.dht-switch-root').screenshot({path:`${out}/${id}-${enabled?'live':'still'}.png`,animations:'allow'});console.log('PASS importer regression',id,enabled);
  }finally{await page.close();}
 }
 writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));
}finally{await browser.close();server.close();}
