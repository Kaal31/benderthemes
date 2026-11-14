// Requires tools/avatar_preview_backend.py and the freshly built preview URL.
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const host=process.env.AVATAR_PREVIEW_URL||'http://127.0.0.1:8911/preview/avatar-editor-update.html';
const bridge=process.env.AVATAR_BRIDGE||'http://127.0.0.1:62883';
(async()=>{
 const browser=await chromium.launch();
 try{
  for(const variant of (process.env.AVATAR_VARIANTS||'kinect,nxe,metro').split(',')){
   const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   const url=new URL(host);url.searchParams.set('theme','x360');url.searchParams.set('xs',variant);url.searchParams.set('avatarBridge',bridge);
   await page.goto(url.href,{waitUntil:'domcontentloaded'});
   await page.evaluate(()=>window.__updateTheme({themeStartupIntros:{x360:false}}));
   await page.waitForTimeout(1000);
   if(variant==='metro')await page.getByRole('button',{name:'Edit Xbox avatar'}).click();
   else if(variant==='nxe'){
    const card=page.getByRole('button',{name:'My Avatar card',exact:true});
    await card.dispatchEvent('click');await page.waitForTimeout(200);await card.dispatchEvent('click');
   }else{
    const card=page.getByRole('button',{name:'My Avatar',exact:true});
    await card.dispatchEvent('click');await page.waitForTimeout(200);await card.dispatchEvent('click');
   }
   const iframe=page.locator('[data-full-avatar-editor] iframe');await iframe.waitFor({timeout:15000});
   const frame=await iframe.elementHandle().then(el=>el.contentFrame());
   await frame.waitForFunction(()=>document.documentElement.hasAttribute('data-ready'),{},{timeout:90000});
   assert.equal(await frame.evaluate(()=>window.__metro.top.id),'home');
   assert.equal(await frame.evaluate(()=>window.__metro.desc.gender==='male'||window.__metro.desc.gender==='female'),true);
   // Parent Decky input must reach the editor, without the dashboard receiving it.
   await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:1})));
   await frame.waitForFunction(()=>window.__metro.top.id==='features',null,{timeout:15000});
   await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:2})));
   await frame.waitForFunction(()=>window.__metro.top.id==='home',null,{timeout:15000});
   await page.screenshot({path:`preview/avatar-interface-${variant}.png`,timeout:30000});
   if(variant==='kinect'){
    await frame.evaluate(async()=>{const shell=window.__metro;await shell.commit({...shell.desc,height:.125});});
    await frame.getByText('Save and Exit',{exact:true}).click();
    await iframe.waitFor({state:'detached',timeout:90000});
    const result=await page.request.post(bridge+'/x360_engine_status',{data:[]});const saved=await result.json();
    assert.equal(saved.description.height,.125);assert.equal(saved.mode,'engine');
   }else{
    await page.getByRole('button',{name:'Previous editor',exact:true}).click();
    await iframe.waitFor({state:'detached'});
    assert.ok(await page.locator('[data-nxe-avatar-editor]').count()||await page.getByText('Starting avatars',{exact:true}).count());
   }
   assert.deepEqual(errors,[]);console.log('PASS',variant,'full UI, assembly, controller navigation, save/fallback');
   await page.close();
  }
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exit(1)});
