import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(0),browser=await chromium.launch();
mkdirSync('work/themezer-validation/visual-check',{recursive:true});
// Snapshots must live under a server-allowed directory. /work is deliberately
// not served, and waiting for the app on its 403 response hides that mistake.
const snapshot='preview/themezer-validation/visual-state-snapshot.html';
writeFileSync(snapshot,readFileSync('preview/preview.html','utf8').replace('<head>','<head><base href="/preview/">'));
const snapshotUrl=url.replace('preview/preview.html',snapshot);
const output=[];
try{
 const cases=JSON.parse(readFileSync('work/themezer-validation/manifest.json'));
 const wanted=new Set(process.argv.slice(2));
 for(const item of cases.filter(x=>!wanted.size||wanted.has(x.id))){
  const skin=JSON.parse(readFileSync(`work/themezer-validation/${item.id}.json`)),page=await browser.newPage({viewport:{width:1304,height:960}}),errors=[];
  page.setDefaultTimeout(60000);
  page.on('pageerror',e=>errors.push(e.message));await page.addInitScript(s=>window.__testSwitch=s,skin);
  const response=await page.goto(snapshotUrl+'?theme=switch&still=1&h=720',{waitUntil:'domcontentloaded'});assert.equal(response.status(),200,'The preview snapshot must be served before checking the app');await page.waitForFunction(()=>window.__updateTheme);await page.evaluate(({file,colors})=>{window.__updateTheme({switchTheme:file,animations:true});if(colors){const s=window.__getThemeSettings();window.__updateTheme({styles:{...s.styles,switch:{...s.styles?.switch,firmwareColors:colors}}});}},{file:skin.file,colors:item.systemColors});await page.locator('.dht-switch-game-root').first().waitFor();await page.waitForTimeout(5500);
  const freeze=()=>page.locator('.dht-switch-game-stack').evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=a.effect.getTiming().duration;}));await freeze();
  const tiles=page.locator('.dht-switch-tile'),first=tiles.nth(0),second=tiles.nth(1);
  if(item.id==='977B'){
   const base=page.locator('[data-widget-slot="widget:RdtBtnPvr:P_PictBase"]'),label=page.locator('[data-widget-file="RdtBtnPvr"] [data-scene-slot="RdtBalloonSystemApplet:T_Main"]');
   const bounds=await base.boundingBox(),caption=await label.boundingBox();
   assert(Math.abs(bounds.width-135)<1,'Native inactive dimensions must replace the oversized static Album base');
   assert.equal(await base.evaluate(el=>getComputedStyle(el.querySelector(':scope > [data-scene-paint]')??el).backgroundColor),'rgb(255, 255, 255)','Comparison must use the reference Basic White palette');
   assert(await label.isVisible(),'Authored exit alpha must keep the Album caption visible without focus');
   assert(Math.abs(caption.x+caption.width/2-bounds.x-bounds.width/2)<25,'Applet caption must be centered in the button, not placed at the text pane edge');
   await page.keyboard.press('ArrowDown');
   for(let i=0;i<9&&await page.locator('.dht-switch-dock-item[data-selected="true"]').getAttribute('data-name')!=='Album';i++)await page.keyboard.press('ArrowRight');
   assert.equal(await page.locator('.dht-switch-dock-item[data-selected="true"]').getAttribute('data-name'),'Album');await page.waitForTimeout(150);
   assert((await base.boundingBox()).width>bounds.width,'Native active state must expand the button');
   await page.keyboard.press('ArrowUp');await page.waitForTimeout(150);
  }
  if(item.id==='13B5F'){
   await page.locator('.dht-switch-root').evaluate(el=>el.getAnimations({subtree:true}).forEach(a=>{a.pause();a.currentTime=9000;}));
   for(const file of ['RdtBtnVgc','RdtBtnSplay']){
    const quad=page.locator(`[data-widget-slot="widget:${file}:P_Pict_00"]`),picture=quad.locator('img');assert.equal(await picture.count(),1,'Modern replacement masks must use the imported texture');
    const a=await quad.boundingBox(),b=await picture.boundingBox();assert(Math.abs(a.y-b.y)<1&&Math.abs(a.x-b.x)<1,'A scaled one-pixel picture must stay inside its native quad, without a text baseline offset');assert(Math.abs(a.width-b.width)<1&&Math.abs(a.height-b.height)<1);
    assert.equal(await picture.evaluate(el=>getComputedStyle(el).objectFit),'fill','Native picture panes stretch their texture to the authored bounds');
   }
   const left=await page.locator('[data-widget-slot="widget:RdtBtnVgc:P_Pict_00"]').boundingBox(),right=await page.locator('[data-widget-slot="widget:RdtBtnSplay:P_Pict_00"]').boundingBox(),stage=await page.locator('.dht-switch-root').boundingBox();
   const shot=await page.screenshot({clip:{x:left.x+left.width+5,y:stage.y+365,width:right.x-left.x-left.width-10,height:170}});
   const visible=await page.evaluate(async data=>{const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+data)).blob()),c=document.createElement('canvas');c.width=bitmap.width;c.height=bitmap.height;const context=c.getContext('2d');context.drawImage(bitmap,0,0);const pixels=context.getImageData(0,0,c.width,c.height).data;let count=0;for(let i=0;i<pixels.length;i+=4)if(Math.max(pixels[i],pixels[i+1],pixels[i+2])>80)count++;return count;},shot.toString('base64'));
   assert(visible>200,'The masks must leave the current sprite frame visible instead of painting the complete scene black');
  }
  if(item.id==='DE49'){
   assert(Number(await page.locator('.dht-switch-root').getAttribute('data-resume-generation'))>0,'Pan/zoom must start on the first Home entry');
   const background=await page.locator('.dht-switch-bg').evaluate(el=>{const a=el.getAnimations()[0];a.pause();a.currentTime=0;const s=getComputedStyle(el),m=new DOMMatrix(s.transform);return {sx:m.a,sy:m.d,size:s.backgroundSize};});
   assert.equal(background.sx,8);assert.equal(background.sy,2);assert.equal(background.size,'12.5% 50%');
   assert.equal(background.sx/8,background.sy/2,'The paired pane/UV scales must preserve wallpaper aspect ratio');
   const controller=page.locator('[data-widget-slot="widget:RdtBtnCtrl:P_Form"]');
   assert.equal(await controller.evaluate(el=>getComputedStyle(el).width),'64px');assert.equal(await controller.locator('img').count(),1);
   assert.equal(await page.locator('[data-widget-slot="widget:RdtBtnCtrl:P_Stick"]').evaluate(el=>getComputedStyle(el).visibility),'hidden');
   const launcher=await page.locator('[data-widget-slot="widget:RdtBtnFullLauncher:P_Pict_00"]').boundingBox(),stage=await page.locator('.dht-switch-root').boundingBox();
   assert(launcher.x-stage.x>1100&&launcher.y-stage.y<140,'Seamless launcher must be in the upper-right corner: '+JSON.stringify(launcher));
   const count=await tiles.count(),x=(await second.boundingBox()).x;
   for(let i=0;i<4;i++)await page.keyboard.press('ArrowRight');
   await page.waitForTimeout(250);assert.equal(await tiles.count(),count,'Stationary rows must keep their earlier covers when focus moves');assert(Math.abs((await second.boundingBox()).x-x)<1,'Stationary layouts must not inherit the standard scrolling offset');
   await page.locator('.dht-switch-tile[data-name="All Software"]').dispatchEvent('click');await page.waitForTimeout(200);assert.equal(await page.locator('.dht-switch-tile[data-selected="true"]').getAttribute('data-name'),'All Software');
   await page.keyboard.press('ArrowLeft');await page.keyboard.press('ArrowLeft');await page.waitForTimeout(250);
  }
  if(item.id==='3595'||item.id==='14665'){
   const sampled=await page.locator('.dht-switch-bg').evaluate(el=>{const a=el.getAnimations()[0];a.pause();return [5,5.5,6,6.5,11.5,12].map(frame=>{a.currentTime=frame*1000/60;const s=getComputedStyle(el);return [s.transform,s.backgroundPosition,s.backgroundSize].join('|');});});
   assert.equal(sampled[0],sampled[1],'Atlas frame 0 must hold instead of scrolling between rows');assert.equal(sampled[2],sampled[3]);assert.equal(sampled[3],sampled[4]);assert.notEqual(sampled[1],sampled[2]);assert.notEqual(sampled[4],sampled[5]);
   const panel=await page.locator('[data-widget-slot="widget:RdtBtnFullLauncher:P_Pict_02"]').boundingBox(),stage=await page.locator('.dht-switch-root').boundingBox();
   assert(Math.abs(panel.y-stage.y-360)<2,'The authored backing must start at the middle of the screen');
   const colon=await page.locator('[data-hud-file="HudTime"][data-hud-pane="P_Colon"]').boundingBox(),wifi=await page.locator('[data-hud-file="HudSignal"][data-hud-pane="P_Wifi"]').boundingBox();
   assert(Math.abs(colon.y+colon.height/2-wifi.y-wifi.height/2)<16,'Clock and network must retain their authored horizontal HUD alignment');
   const picture=page.locator('[data-hud-file="HudSignal"][data-hud-pane="P_Wifi"]'),inner=picture.locator(':scope > div').first(),innerBox=await inner.boundingBox();
   assert(Math.abs(innerBox.x-wifi.x)<1&&Math.abs(innerBox.y-wifi.y)<1,'HUD picture contents must use the quad without a text baseline offset');
  }
  if(item.id==='3595'){
   // Frame at 9 seconds: second column, fourth row of the 2×6 atlas.
   // Compare actual browser rasterization against a direct source crop, not
   // against another implementation of our CSS transform calculations.
   await page.locator('.dht-switch-bg').evaluate(el=>el.getAnimations().forEach(a=>{a.pause();a.currentTime=9000;}));
   const isolate=await page.addStyleTag({content:'.dht-switch-root > :not(.dht-switch-bg){visibility:hidden!important}'});
   const shot=await page.locator('.dht-switch-root').screenshot();await isolate.evaluate(el=>el.remove());
   const fidelity=await page.evaluate(async({data,source})=>{
    const load=async src=>{const im=new Image();im.src=src;await im.decode();return im;};
    const [actual,atlas]=await Promise.all([load('data:image/png;base64,'+data),load(source)]);
    const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=360;const ctx=canvas.getContext('2d');
    ctx.drawImage(actual,0,0);const pixels=ctx.getImageData(0,0,1280,360).data;ctx.clearRect(0,0,1280,360);
    ctx.imageSmoothingEnabled=false;ctx.drawImage(atlas,640,360,640,120,0,0,1280,360);const expected=ctx.getImageData(0,0,1280,360).data;
    let same=0,error=0;for(let i=0;i<pixels.length;i+=4){if(pixels[i]===expected[i]&&pixels[i+1]===expected[i+1]&&pixels[i+2]===expected[i+2])same++;for(let c=0;c<3;c++)error+=Math.abs(pixels[i+c]-expected[i+c]);}
    return {width:atlas.width,height:atlas.height,identical:same/(1280*360),meanError:error/(1280*360*3)};
   },{data:shot.toString('base64'),source:skin.screens.home.background});
   assert.equal(fidelity.width,1280);assert.equal(fidelity.height,720);
   // Direct CSS atlas painting rounds some texel edges differently from the
   // canvas crop. A one-source-pixel offset produces a mean error above 8.
   assert(fidelity.identical>.9&&fidelity.meanError<2,'Wallpaper must retain the native source-frame alignment and sharpness: '+JSON.stringify(fidelity));
   console.log('PASS native wallpaper pixels',JSON.stringify(fidelity));
  }
  if(item.id==='A20'){
   const radius=await first.evaluate(el=>({cover:getComputedStyle(el.querySelector('[data-nx-pane="game"] > div')).borderTopLeftRadius,focus:getComputedStyle(el.querySelector('.dht-switch-focus')).borderTopLeftRadius,base:getComputedStyle(el.querySelector('[data-nx-pane="gameBase"]')).borderTopLeftRadius}));
   assert.equal(radius.cover,radius.focus,'Expanded cover and focus frame must have the same corner geometry');assert.equal(radius.base,radius.cover,'The backing must not protrude through the rounded cover');
   const clock=await page.locator('[data-hud-file="HudTime"][data-hud-pane="P_Colon"]').boundingBox(),stage=await page.locator('.dht-switch-root').boundingBox();assert(clock.y-stage.y<72&&clock.y-stage.y>10,'Clock must remain inside the top wallpaper pill: '+JSON.stringify(clock));
   const svgAlpha=async(locator,box)=>locator.locator('canvas[data-nx-native-picture],svg[viewBox]').first().evaluate(async(svg,box)=>{let image=svg;if(svg.tagName.toLowerCase()!=='canvas'){image=new Image();image.src='data:image/svg+xml,'+encodeURIComponent((()=>{const clone=svg.cloneNode(true);clone.setAttribute('width','48');clone.setAttribute('height','48');return new XMLSerializer().serializeToString(clone);})());await image.decode();}const canvas=document.createElement('canvas');canvas.width=48;canvas.height=48;const ctx=canvas.getContext('2d');ctx.drawImage(image,0,0,48,48);const data=ctx.getImageData(...box).data;let solid=0;for(let i=3;i<data.length;i+=4)if(data[i]>100)solid++;return solid;},box);
   assert(await svgAlpha(page.locator('[data-widget-slot="widget:RdtBtnPvr:P_Pict_00"]'),[10,12,28,22])>20,'Album must contain an image glyph, not only its outer frame');
   assert(await svgAlpha(page.locator('[data-widget-slot="widget:RdtBtnPow:P_Pict_00"]'),[22,6,4,14])>15,'Power icon must contain its vertical stem');
   await page.locator('.dht-switch-root').screenshot({path:'work/themezer-validation/A20-after-visual-fixes.png'});
   const fill=color=>'data:image/svg+xml,'+encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="300" height="450"><rect width="300" height="450" fill="${color}"/></svg>`);
   await first.locator('img').first().evaluate((img,src)=>{img.src=src;return img.decode();},fill('red'));await second.locator('img').first().evaluate((img,src)=>{img.src=src;return img.decode();},fill('blue'));await freeze();
   const overlapPixel=async()=>{
    const a=await first.locator('img').first().boundingBox(),b=await second.locator('img').first().boundingBox();
    const x=(Math.max(a.x,b.x)+Math.min(a.x+a.width,b.x+b.width))/2,y=(Math.max(a.y,b.y)+Math.min(a.y+a.height,b.y+b.height))/2;
    assert(Math.min(a.x+a.width,b.x+b.width)>Math.max(a.x,b.x),'The test must exercise an actual overlap');
    const png=await page.screenshot({clip:{x:Math.floor(x),y:Math.floor(y),width:1,height:1}});
    return page.evaluate(async(data)=>{const bitmap=await createImageBitmap(await(await fetch('data:image/png;base64,'+data)).blob());const canvas=document.createElement('canvas');canvas.width=1;canvas.height=1;const ctx=canvas.getContext('2d');ctx.drawImage(bitmap,0,0);return [...ctx.getImageData(0,0,1,1).data];},png.toString('base64'));
   };
   let pixel=await overlapPixel();assert(pixel[0]>240&&pixel[2]<15,'The selected first cover must paint above its neighbor: '+pixel);
   await page.keyboard.press('ArrowRight');await page.waitForTimeout(200);await freeze();pixel=await overlapPixel();assert(pixel[2]>240&&pixel[0]<15,'Selection must move in front when focus changes: '+pixel);
  }else{await page.keyboard.press('ArrowRight');await page.waitForTimeout(200);await freeze();}
  const bounds=await page.locator('.dht-switch-tile[data-selected="true"] .dht-switch-game-root').boundingBox();
  assert(bounds&&bounds.width>1&&bounds.height>1&&bounds.width<2000&&bounds.height<2000,'Focused cover must keep finite usable bounds');assert.deepEqual(errors,[]);
  output.push({id:item.id,errors,focusBounds:bounds});console.log('PASS visual states',item.id);await page.close();
 }
 writeFileSync('work/themezer-validation/visual-check/results.json',JSON.stringify(output,null,2));
}finally{await browser.close();server.close();}
