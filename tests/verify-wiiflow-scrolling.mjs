import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1304,height:930}});
 await page.addInitScript(()=>{
  window.__reflectionCopies=0;window.__coverBackPaints=0;
  const draw=CanvasRenderingContext2D.prototype.drawImage,fill=CanvasRenderingContext2D.prototype.fillRect;
  CanvasRenderingContext2D.prototype.drawImage=function(...args){if(args[0]?.id==='case-renderer')window.__reflectionCopies++;return draw.apply(this,args);};
  CanvasRenderingContext2D.prototype.fillRect=function(...args){if(this.canvas.width===768&&this.canvas.height===1152&&args[0]===0&&args[1]===0)window.__coverBackPaints++;return fill.apply(this,args);};
 });
 await page.goto(url+'?theme=vita&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>window.__updateTheme({theme:'frame',activeTheme:'wiiflow-default',animations:true}));
 const host=page.locator('[data-react-theme="wiiflow-default"]');await host.waitFor();await host.locator('#case-renderer').waitFor();
 await page.waitForTimeout(2000);
 const before=await page.evaluate(()=>window.__coverBackPaints);
 await page.evaluate(()=>window.__updateTheme({clock24:false}));await page.waitForTimeout(250);
 assert.equal(await page.evaluate(()=>window.__coverBackPaints),before,'clock/settings updates must not repaint all case textures');
 await page.evaluate(()=>window.__reflectionCopies=0);
 const start=await host.locator('.selection').getAttribute('data-appid');
 for(let i=0;i<6;i++){await page.evaluate(()=>window.dispatchEvent(new KeyboardEvent('keydown',{key:'ArrowRight',bubbles:true})));await page.waitForTimeout(70);}
 assert.notEqual(await host.locator('.selection').getAttribute('data-appid'),start);
 const copies=await page.evaluate(()=>window.__reflectionCopies);assert.ok(copies<6,`scrolling must avoid per-frame GPU readbacks, got ${copies}`);
 console.log('PASS WiiFlow selection advances, settings preserve case textures, reflections avoid per-frame readbacks during scrolling');
}finally{await browser.close();server.closeAllConnections();server.close();}
