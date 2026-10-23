import assert from 'node:assert/strict';
import {readFileSync,writeFileSync,mkdirSync,existsSync} from 'node:fs';
import {chromium} from 'playwright';
import {startPreviewServer} from '../preview/server.mjs';
import {renderGallery,renderAudit,summarize} from './themezer_report.mjs';

const only=new Set((process.argv.find(x=>x.startsWith('--check-only='))?.split('=')[1]??'').split(',').filter(Boolean));
const batch=process.argv.find(x=>x.startsWith('--batch='))?.slice(8)??'native-expansion';
const bothWidths=process.argv.includes('--both-widths');
const cases=JSON.parse(readFileSync('tests/fixtures/switch/themezer-cases.json')).filter(x=>x.batch===batch&&(!only.size||only.has(x.id)));
const out='preview/themezer-validation/expansion-check';mkdirSync(out,{recursive:true});
const {server,url}=await startPreviewServer(0),browser=await chromium.launch(),results=[];
try{
 for(const fixture of cases){
  const skin=JSON.parse(readFileSync(`work/themezer-validation/${fixture.id}.json`));
  const moving=skin.screens.home.conversion.animations.some(a=>a.pane==='background');
  for(const width of moving||bothWidths?[1304,550]:[1304]){
   const page=await browser.newPage({viewport:{width,height:960}}),errors=[],result={id:fixture.id,width,errors};
   page.on('pageerror',e=>errors.push(e.message));
   try{
    await page.goto(url.replace('preview.html',`themezer-validation/${fixture.id}.html?theme=switch&still=1&h=720`));
    await page.locator('.dht-switch-game-root').first().waitFor();await page.waitForTimeout(5500);
    const root=page.locator('.dht-switch-root'),bg=page.locator('.dht-switch-bg');
    const sample=()=>bg.evaluate(el=>el.getAnimations().map(a=>({time:a.currentTime,state:a.playState,transform:getComputedStyle(el).transform})));
    const before=await sample();await page.waitForTimeout(400);const after=await sample();
    result.backgroundPlayers=after.length;
    if(moving){
     assert(after.length>0,'Authored wallpaper needs a live player');
     assert(after.some((a,i)=>a.state==='running'&&Number(a.time)>Number(before[i]?.time)+100),'Wallpaper timeline must advance');
    }
    // Capture while running; pausing first masks compositor/rasterization problems.
    await root.screenshot({path:`${out}/${fixture.id}-${width}-live.png`,animations:'allow'});
    const selected=()=>page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name');
    const first=await selected();await page.keyboard.press('ArrowRight');
    await page.waitForFunction(previous=>document.querySelector('.dht-switch-tile[data-selected="true"]')?.getAttribute('data-name')!==previous,first,{timeout:5000});
    const second=await selected();assert.notEqual(second,first,'Right must select another game');
    await page.keyboard.press('ArrowRight');await page.waitForFunction(previous=>document.querySelector('.dht-switch-tile[data-selected="true"]')?.getAttribute('data-name')!==previous,second,{timeout:5000});assert.notEqual(await selected(),second,'Selection must advance twice');
    result.navigation=[first,second,await selected()];
    const art=await page.locator('.dht-switch-tile[data-selected="true"] [data-nx-pane="game"] img').boundingBox(),stage=await root.boundingBox();
    assert(art&&stage&&art.width>1&&art.height>1&&art.x<stage.x+stage.width&&art.x+art.width>stage.x&&art.y<stage.y+stage.height&&art.y+art.height>stage.y,'Selected artwork must intersect the stage');
    result.selectedArtwork=art;
    // Loaded <img> elements can still be covered by an opaque native pane.
    // Inspect the painted center, where this preview's real game art is varied.
    const painted=await page.screenshot({clip:{x:Math.max(stage.x,art.x+art.width*.25),y:Math.max(stage.y,art.y+art.height*.25),width:Math.min(art.width*.5,stage.x+stage.width-Math.max(stage.x,art.x+art.width*.25)),height:Math.min(art.height*.5,stage.y+stage.height-Math.max(stage.y,art.y+art.height*.25))},animations:'allow'});
    result.coverPaint=await page.evaluate(async bytes=>{const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+bytes)).blob()),canvas=document.createElement('canvas');canvas.width=bitmap.width;canvas.height=bitmap.height;const context=canvas.getContext('2d');context.drawImage(bitmap,0,0);const pixels=context.getImageData(0,0,canvas.width,canvas.height).data,colors=new Set();let sum=0,squared=0,count=0;for(let i=0;i<pixels.length;i+=16){const value=(pixels[i]+pixels[i+1]+pixels[i+2])/3;sum+=value;squared+=value*value;count++;colors.add((pixels[i]>>3)+','+(pixels[i+1]>>3)+','+(pixels[i+2]>>3));}bitmap.close();return {colors:colors.size,variance:squared/count-(sum/count)**2,painted:colors.size>4};},painted.toString('base64'));
    result.visualPass=result.coverPaint.painted;
    if(!result.visualPass)result.visualFailure='Loaded artwork is hidden by a flat native paint layer in the selected cover.';
    result.dockNavigation=[];
    for(let i=0;i<5&&!await page.locator('.dht-switch-dock-item[data-selected="true"]').count();i++)await page.keyboard.press('ArrowDown');
    const dock=page.locator('.dht-switch-dock-item[data-selected="true"]');
    if(await dock.count()){for(let i=0;i<3;i++){result.dockNavigation.push(await dock.getAttribute('data-name'));await page.keyboard.press('ArrowRight');}}
    await page.keyboard.press('y');await page.locator('.dht-menu--switch').waitFor();
    assert(await page.locator('.dht-menu-item').count()>0,'Options must contain usable entries');
    if(fixture.id==='106EF'){
     const menu=page.locator('.dht-menu--switch'),start=menu.locator('.dht-menu-item').filter({hasText:/^Start$/});
     const bounds=await start.boundingBox(),stage=await root.boundingBox();
     assert(bounds&&bounds.y>=stage.y&&bounds.y+bounds.height<=stage.y+stage.height,'Conversion warnings must not push Start off-screen');
     assert(!((await menu.textContent()).includes('Unmapped USD property:')),'Raw import diagnostics belong in their details submenu');
    }
    await page.keyboard.press('Escape');await page.locator('.dht-menu--switch').waitFor({state:'detached'});
    await page.evaluate(()=>window.__updateTheme({animations:false}));await page.waitForTimeout(200);
    assert(await root.isVisible(),'Disabling animations must retain the scene');assert.deepEqual(errors,[]);
    result.pass=true;
   }catch(error){result.pass=false;result.failure=error.message;}
   finally{results.push(result);console.log(JSON.stringify({id:result.id,width:result.width,pass:result.pass,visualPass:result.visualPass,coverPaint:result.coverPaint,dockNavigation:result.dockNavigation,failure:result.failure}));await page.close();}
  }
 }
 if(existsSync(`${out}/results.json`)){
  const previous=JSON.parse(readFileSync(`${out}/results.json`)),checked=new Map(results.map(result=>[result.id+':'+result.width,result]));
  const merged=previous.map(result=>{const key=result.id+':'+result.width,next=checked.get(key);checked.delete(key);return next??result;});
  results.splice(0,results.length,...merged,...checked.values());
 }
 writeFileSync(`${out}/results.json`,JSON.stringify(results,null,2));
 const report='preview/themezer-validation';
 if(existsSync(`${report}/results.json`)){
  const rendered=JSON.parse(readFileSync(`${report}/results.json`));
  for(const c of rendered){c.interactionChecks=results.filter(x=>x.id===c.id);const checks=c.interactionChecks.filter(x=>x.visualPass!==undefined);if(checks.length)c.visualChecks={coverPaintPass:checks.every(x=>x.visualPass),failures:checks.filter(x=>!x.visualPass).map(x=>({width:x.width,reason:x.visualFailure}))};}
  writeFileSync(`${report}/results.json`,JSON.stringify(rendered,null,2));
  writeFileSync(`${report}/summary.json`,JSON.stringify(summarize(rendered),null,2));
  writeFileSync(`${report}/index.html`,renderGallery(rendered));
  writeFileSync(`${report}/audit.md`,renderAudit(rendered));
 }
 if(results.some(x=>!x.pass))process.exitCode=1;
}finally{await browser.close();server.close();}
