import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';
const {server,url}=await startPreviewServer(),browser=await launch();
try{
 const page=await browser.newPage({viewport:{width:1304,height:930}});
 await page.goto(url+'?theme=onyx&still=1');await page.locator('[data-dht-root]').waitFor();
 await page.evaluate(()=>document.querySelector('[data-dht-root]').closest('div[style*="border-radius: 10px"]').setAttribute('data-viewport-fullscreen',''));
 await page.addStyleTag({content:'[data-viewport-fullscreen]{position:fixed!important;inset:0!important;width:100vw!important;height:100vh!important;margin:0!important;border-radius:0!important}'});
 const targets={onyx:'.silver-home',aero:'.aero-desktop',nazarick:'.naz-home','blue-glass':'#dashboard',ios6:'#dashboard',gameamp:'#dashboard',gamecube:'#screen','old-big-picture':'[data-react-theme]' ,'santa-express':'#stage','wiiflow-default':'#wiiflow-background'};
 for(const [id,selector] of Object.entries(targets)){
  const native=!['onyx','aero','nazarick'].includes(id);
  await page.evaluate(({id,native})=>window.__updateTheme({theme:native?'frame':id,activeTheme:native?id:'',animations:false}),{id,native});
  const area=native?page.locator(['gamecube','wiiflow-default'].includes(id)?`[data-native-theme="${id}"]`:`[data-react-theme="${id}"]`):page.locator('[data-dht-root]');await area.waitFor();
  for(const [width,height] of [[1280,800],[1280,720],[960,600]]){
   await page.setViewportSize({width,height});
   await page.waitForFunction(({native,selector,width,height,id})=>{
    const host=native?document.querySelector('[data-react-theme],[data-native-theme]'):null,parent=host?.shadowRoot??host??document;
    const node=parent?.matches?.(selector)?parent:parent?.querySelector(selector);if(!node)return false;const b=node.getBoundingClientRect();
    if(['gamecube','wiiflow-default','santa-express','gameamp'].includes(id)){const a=host.getBoundingClientRect();return Math.abs(a.x)<1&&Math.abs(a.y)<1&&Math.abs(a.width-width)<1&&Math.abs(a.height-height)<1&&b.x>=-1&&b.y>=-1&&b.right<=width+1&&b.bottom<=height+1;}
    return Math.abs(b.x)<1&&Math.abs(b.y)<1&&Math.abs(b.width-width)<1&&Math.abs(b.height-height)<1;
   },{native,selector,width,height,id});
  }
  console.log('PASS full-screen sizing matches native reference stages:',id);
 }
}finally{await browser.close();server.closeAllConnections();server.close();}
