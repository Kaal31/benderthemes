import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const browser=await chromium.launch({args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:8744/wii-test-star-wars.html');
 const cyan=index=>page.evaluate(index=>{
  const r=document.querySelector(`[data-wii-hit="${index}"]`).getBoundingClientRect(),c=document.createElement('canvas');c.width=1280;c.height=800;
  const ctx=c.getContext('2d');ctx.drawImage(document.querySelector('canvas'),0,0);let count=0;
  for(let y=r.top-8;y<r.bottom+8;y++)for(let x=r.left-8;x<r.right+8;x++){
   if(x>r.left+8&&x<r.right-8&&y>r.top+8&&y<r.bottom-8)continue;
   const a=ctx.getImageData(x,y,1,1).data;if(a[0]<90&&a[1]>120&&a[2]>180)count++;
  }return count;
 },index);
 await page.mouse.move(1250,700);await page.waitForTimeout(1000);
 const baseline=[await cyan(1),await cyan(2)];
 await page.getByRole('button',{name:'Hades',exact:true}).hover();await page.waitForTimeout(1800);
 assert.ok(await cyan(1)>baseline[0]+80,'Focus must persist beyond the entry clip');
 await page.getByRole('button',{name:'Elden Ring',exact:true}).hover();await page.waitForTimeout(180);
 assert.ok(await cyan(2)>baseline[1]+80,'New cover must be focused');
 assert.ok(await cyan(1)<baseline[0]+20,'Previous focus must disappear');
 await page.goto('http://127.0.0.1:8744/wii-test-leopard-os.html');await page.waitForTimeout(800);
 const previous=page.getByRole('button',{name:'Previous page',exact:true}),next=page.getByRole('button',{name:'Next page',exact:true});
 const left=await previous.boundingBox(),right=await next.boundingBox();
 assert.ok(left.y>700&&left.x>200&&left.x<300,'Previous arrow must be in the dock');
 assert.ok(right.y>700&&right.x>350&&right.x<460,'Next arrow must be in the dock');
 await next.click();await page.waitForTimeout(400);assert.ok(await previous.isEnabled());await previous.click();
 await page.getByRole('button',{name:'Installed channels',exact:true}).click();await page.getByRole('dialog',{name:'SD Card Menu',exact:true}).waitFor();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Wii options',exact:true}).click();await page.getByRole('dialog',{name:'Wii Options',exact:true}).waitFor();await page.keyboard.press('Escape');
 await page.getByRole('button',{name:'Messages',exact:true}).click();await page.getByRole('dialog',{name:'Wii Message Board',exact:true}).waitFor();
 await page.goto('http://127.0.0.1:8744/wii-test-apple.html?clock=12:05');await page.getByRole('button',{name:'Pause',exact:true}).click();await page.waitForTimeout(1000);
 const contrast=await page.evaluate(()=>{const c=document.createElement('canvas');c.width=1280;c.height=800;const ctx=c.getContext('2d');ctx.drawImage(document.querySelector('canvas'),0,0);const a=ctx.getImageData(480,668,320,45).data;let dark=0,light=0;for(let i=0;i<a.length;i+=4){if(Math.max(a[i],a[i+1],a[i+2])<120)dark++;if(Math.min(a[i],a[i+1],a[i+2])>200)light++;}return{dark,light};});assert.ok(contrast.dark>150&&contrast.light>2000,'Apple clock must contrast against the pale footer: '+JSON.stringify(contrast));
 assert.deepEqual(errors,[]);console.log('PASS: persistent single focus, Leopard dock actions and Apple clock contrast');
}finally{await browser.close();}
