const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();const p=await b.newPage({viewport:{width:1600,height:1000}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
for(const id of ['ps3','psp','wiiu','wii','kinect','metro']){
 await p.goto('http://127.0.0.1:8911/preview/all-console-stock-fallback.html?console='+id,{waitUntil:'domcontentloaded'});await p.waitForTimeout(id==='kinect'||id==='metro'?9000:4000);
 const stock=p.frames().find(f=>f.url().includes('comparisonStock'));const fallback=p.frames().find(f=>f.url().includes('console-native-connected')&&!f.url().includes('comparisonStock'));
 if(!stock||!fallback)throw Error('Missing pair '+id);
 if(id==='ps3'||id==='psp'){const a=await stock.locator('[data-icon-source="gitflic-native"]').count(),c=await fallback.locator('[data-icon-source="gitflic-native"]').count();console.log(id,'native icons',a,'fallback native icons',c);if(!a||c)throw Error('XMB source mismatch');}
 if(id==='wiiu'){console.log('WiiU stock textures',await stock.locator('img[src*="wiiu-native-ui"]').count());if(!await stock.locator('img[src*="wiiu-native-ui"]').count())throw Error('Missing Wii U textures');await p.selectOption('#view','grid');await p.waitForTimeout(2500);await p.screenshot({path:'preview/wiiu-native-ui-library-comparison.png'});}
 if(id==='wii')console.log('Wii renderers',await stock.locator('[data-wii-renderer="layout"]').count(),await fallback.locator('[data-wii-renderer="layout"]').count());
 if(id==='kinect'||id==='metro')console.log(id,'canvas',await stock.locator('canvas').count(),await stock.locator('body').innerText().then(s=>s.includes('unavailable')));
 await p.screenshot({path:'preview/connected-native-'+id+'.png'});
}
console.log('Browser errors',errors);if(errors.length)throw Error(errors.join('\n'));await b.close();})().catch(e=>{console.error(e);process.exit(1)});
