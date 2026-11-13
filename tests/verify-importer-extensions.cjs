const {chromium}=require('playwright');
const fs=require('fs');
require('child_process').execFileSync(process.env.PYTHON||'python',['tests/test_importer_extensions.py','--preview']);
const assert=require('assert/strict');
(async()=>{
 const fixture=JSON.parse(fs.readFileSync('out/importer-extension-preview/fixture.json','utf8'));
 const browser=await chromium.launch({args:['--autoplay-policy=no-user-gesture-required']});
 try{
  for(const theme of ['n3ds','ps4','xbox','switch','wiiu']){
   console.log('Checking',theme);
   const page=await browser.newPage({viewport:{width:1304,height:900}}),errors=[];
   page.on('pageerror',error=>errors.push(error.message));
   await page.addInitScript(f=>{window.__test3ds=f.n3ds;window.__testPs4=f.ps4;window.__testXbox=f.xbox;window.__testSwitch=f.switch;window.__testWiiu=f.wiiu;window.__audio=[];const OriginalAudio=window.Audio;window.Audio=class extends OriginalAudio{constructor(...args){super(...args);window.__audio.push(this)}};},fixture);
   await page.goto('http://127.0.0.1:8911/preview/'+(process.env.IMPORTER_PREVIEW||'importer-extensions-check.html')+'?theme='+theme+'&realsound=1');
   await page.waitForFunction(()=>window.__updateTheme);
   await page.evaluate(({theme,pack})=>{window.__testPacks=[pack];window.__updateTheme({theme,n3dsSkin:'Fixture',ps4Skin:'Fixture',xboxSkin:'Fixture',switchTheme:'Fixture.nxtheme',wiiuTheme:'Fixture.utheme',ps4GameBackgrounds:false,backgroundMusic:false,sounds:false,animations:true,themeStartupIntros:{[theme]:false}})}, {theme,pack:fixture.pack});
   for(let i=0;i<10;i++){for(const n of await page.locator('.dht-console-startup,.dht-console-video').all())await n.click({force:true}).catch(()=>{});await page.waitForTimeout(100);}
   if(theme==='n3ds'){
    assert.equal(await page.locator('.dht-n3ds-imported-pattern').count(),1);
    assert.notEqual(await page.locator('.dht-n3ds-imported-pattern').evaluate(n=>getComputedStyle(n).animationName),'none');
    assert.equal(await page.locator('.dht-n3ds-start').evaluate(n=>getComputedStyle(n).backgroundColor),'rgb(119, 170, 187)');
    await page.evaluate(()=>window.__updateTheme({animations:false}));await page.waitForTimeout(100);
    assert.equal(await page.locator('.dht-n3ds-imported-pattern').evaluate(n=>getComputedStyle(n).animationName),'none');
   }
   if(theme==='ps4'){
    const canvas=page.locator('.dht-ps4-scene');await canvas.waitFor();
    const color=()=>canvas.evaluate(n=>[...n.getContext('2d').getImageData(640,360,1,1).data]);
    const first=await color();await page.waitForTimeout(400);const second=await color();assert.notDeepEqual(first,second,'Layered RAF must animate');
    await page.evaluate(()=>window.__updateTheme({animations:false}));await page.waitForTimeout(100);const still=await color();await page.waitForTimeout(200);assert.deepEqual(await color(),still);
   }
   if(theme==='xbox'){
    await page.locator('.dht-xbox-imported-menu').waitFor();
    assert.equal(await page.locator('.dht-xbox-imported-menu').evaluate(n=>n.style.left),'70px');
    const before=await page.locator('.dht-xbox-imported-menu [data-selected=true]').innerText();
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:10})));await page.waitForTimeout(150);
    assert.notEqual(await page.locator('.dht-xbox-imported-menu [data-selected=true]').innerText(),before);
    await page.locator('.dht-xbox-imported-menu [data-selected=true]').click();await page.waitForTimeout(200);
    assert(await page.locator('.dht-xbox-imported-menu').count(),'Imported menu remains on subpage');
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:2})));await page.waitForTimeout(100);
   }
   if(theme==='switch'){
    for(let step=0;step<50&&!await page.locator('[data-name="All Software"]').count();step++){
     await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:12})));await page.waitForTimeout(45);
    }
    const launcher=page.locator('[data-name="All Software"]');await launcher.click({force:true});await page.waitForTimeout(180);await launcher.click({force:true});
    await page.waitForTimeout(250);
    assert(await page.locator('[data-pane="secondaryGameArt"]').count(),'All Software uses own conversion');
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:2})));await page.waitForTimeout(200);
    await page.locator('.dht-switch-dock-item[data-name="Settings"]').click({force:true});await page.waitForTimeout(250);
    assert(await page.locator('[data-pane="secondaryRoot"]').last().evaluate(n=>n.style.transform.includes('0.9')),'Settings uses its root transform');
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:2})));await page.waitForTimeout(200);
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:4})));await page.waitForTimeout(150);
    await page.getByText('Lock screen',{exact:true}).click({force:true});await page.waitForTimeout(200);
    assert(await page.locator('.dht-switch-lock').evaluate(n=>n.parentElement.style.transform.includes('0.9')),'Lock screen uses its root transform');
    await page.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:2})));await page.waitForTimeout(150);
   }
   if(theme==='wiiu'){
    await page.evaluate(pack=>{window.__testPacks=[pack];window.__refreshPacks();window.__updateTheme({backgroundMusic:true,music:{wiiu:true},musicPacks:{wiiu:''}})},fixture.pack);
    await page.waitForFunction(()=>window.__audio.some(a=>a.src.includes('menu_music.wav')&&!a.paused&&a.currentTime>0),null,{timeout:12000});
    await page.evaluate(()=>window.__updateTheme({wiiuTheme:''}));await page.waitForTimeout(500);
    assert(await page.evaluate(()=>window.__audio.filter(a=>a.src.includes('WiiU%20-')||a.src.includes('WiiU -')).every(a=>a.paused)),'Imported WiiU music stops on deselect');
   }
   assert.deepEqual(errors,[]);
   await page.screenshot({path:'preview/importer-extension-'+theme+'.png'});
   console.log('PASS',theme);await page.close();
  }
 }finally{await browser.close()}
})().catch(error=>{console.error(error);process.exit(1)});
