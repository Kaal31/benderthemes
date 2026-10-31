const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch({headless:true});const p=await b.newPage({viewport:{width:1280,height:800}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const [name,query,expected] of [['native','?nativeMii=1','gitflic-native'],['fallback','','authored-fallback']]){
 await p.goto('http://127.0.0.1:8911/preview/native-mii-maker.html'+query,{waitUntil:'domcontentloaded'});await p.waitForTimeout(2000);
 const source=await p.locator('canvas').first().getAttribute('data-model-source');if(source!==expected)throw Error(name+': '+source);
 await p.getByRole('button',{name:'Turn Mii',exact:true}).click();await p.waitForTimeout(500);console.log(name,source,'rotation passed');
}
await p.route('**/out/native-mii-preview/models.json',route=>route.fulfill({status:200,contentType:'application/json',body:'{"schema":1,"bodies":{}}'}));
await p.goto('http://127.0.0.1:8911/preview/native-mii-maker.html?nativeMii=1');await p.waitForTimeout(1000);if(await p.locator('canvas').first().getAttribute('data-model-source')!=='authored-fallback')throw Error('Invalid pack did not retain fallback');console.log('Invalid pack fallback passed');await p.unroute('**/out/native-mii-preview/models.json');
await p.goto('http://127.0.0.1:8911/preview/nintendo-native-mii.html?theme=wiiu&plaza=1&nativeMii=1',{waitUntil:'domcontentloaded'});await p.waitForTimeout(10000);const source=await p.locator('.dht-wiiu-plaza-canvas').getAttribute('data-model-source');if(source!=='gitflic-native')throw Error('Plaza: '+source);await p.screenshot({path:'preview/wiiu-native-mii-plaza.png'});console.log('Wii U Plaza',source);if(errors.length)throw Error(errors.join('\n'));await b.close()})().catch(e=>{console.error(e);process.exit(1)});
