import assert from "node:assert/strict";
import {chromium} from "playwright";
const browser=await chromium.launch({args:["--use-angle=swiftshader","--enable-unsafe-swiftshader"]});
try{
 const page=await browser.newPage({viewport:{width:1280,height:800}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error'&&/WebGLProgram|shader|VALIDATE/.test(m.text()))errors.push(m.text());});
 await page.addInitScript(()=>{window.miiMockAxes=[0,0];Object.defineProperty(navigator,'getGamepads',{value:()=>[{axes:window.miiMockAxes,buttons:[],connected:true}]});});
 await page.goto(process.env.MII_DEMO_URL??"http://127.0.0.1:8742/mii-interactive-demo.html");
 const canvas=page.getByLabel('Interactive 3D Mii');await canvas.waitFor();
 await page.getByLabel('Face style').selectOption('detailed');await page.getByLabel('Face style').selectOption('drawn');
 await page.getByRole('button',{name:'Next preview pose',exact:true}).click();await page.waitForTimeout(100);await page.getByRole('button',{name:'Previous preview pose',exact:true}).click();
 await page.getByRole('button',{name:'Outfits',exact:true}).click();
 for(let hat=-1;hat<5;hat++){await page.getByLabel('Headwear').selectOption(String(hat));await page.waitForTimeout(100);}
 await page.getByLabel('Headwear').selectOption('1');
 await page.getByRole('button',{name:'Branding',exact:true}).click();await page.getByRole('button',{name:'Next artwork',exact:true}).click();
 await page.getByText(/^Applied:/).waitFor();assert.match(await page.getByText(/28 · Tap artwork/).innerText(),/28/);
 await page.getByLabel('Artwork type').selectOption('logo');await page.getByRole('button',{name:'Next artwork',exact:true}).click();await page.getByText('Applied: Portal 2 · logo').waitFor();
 // Portal 2 is deliberately marked uninstalled in the demo: no installed filter.
 await page.getByLabel('Artwork opacity').fill('0.55');await page.getByLabel('Artwork rotation').fill('32');await page.getByLabel('Artwork size').fill('2.5');
 const r=await canvas.boundingBox();const point=(x,y)=>({x:r.x+r.width*x,y:r.y+r.height*y});
 let p=point(.5,.32);await page.mouse.click(p.x,p.y);await page.getByRole('button',{name:'Save Mii',exact:true}).click();assert.equal(await page.evaluate(()=>window.miiDemoSettings().personalMii.decal.part),'head');
 p=point(.5,.57);await page.mouse.click(p.x,p.y);await page.waitForTimeout(150);
 await page.getByRole('button',{name:'Save Mii',exact:true}).click();let saved=await page.evaluate(()=>window.miiDemoSettings().personalMii);
 assert(saved.decal);assert.equal(saved.decal.opacity,.55);assert.equal(saved.decal.rotation,32);assert.equal(saved.decal.size,2.5);assert(saved.logo.startsWith('data:image/png'));assert(saved.portrait.startsWith('data:image/png'));
 await page.screenshot({path:'preview/mii-3d-branding-front.png'});
 // Drag beyond the character silhouette to flip, then place onto the back.
 p=point(.5,.57);await page.mouse.move(p.x,p.y);await page.mouse.down();p=point(.98,.57);await page.mouse.move(p.x,p.y,{steps:10});await page.mouse.up();await page.waitForTimeout(800);assert.equal(await canvas.getAttribute('data-side'),'back');
 p=point(.5,.57);await page.mouse.click(p.x,p.y);await page.getByRole('button',{name:'Save Mii',exact:true}).click();saved=await page.evaluate(()=>window.miiDemoSettings().personalMii);assert(saved.decal.normal[2]<0,'Back placement must point outward from back');
 await page.screenshot({path:'preview/mii-3d-branding-back.png'});
 // Stick movement follows the same raycasting path; it must change surface coordinates.
 const before=saved.decal.point;await canvas.focus();await page.evaluate(()=>{window.miiMockAxes=[.4,0];});await page.waitForTimeout(200);await canvas.focus();await page.evaluate(()=>{window.miiMockAxes=[0,0];});await page.getByRole('button',{name:'Save Mii',exact:true}).click();saved=await page.evaluate(()=>window.miiDemoSettings().personalMii);assert.notDeepEqual(saved.decal.point,before);
 await page.reload();await page.getByRole('button',{name:'Branding',exact:true}).click();assert.equal(await page.getByLabel('Artwork opacity').inputValue(),'0.55');
 await page.evaluate(()=>window.miiDemoPlaza());await page.waitForTimeout(2200);await page.screenshot({path:'preview/mii-3d-branded-plaza.png'});assert.deepEqual(errors,[]);
 console.log('PASS: 3D headwear variants; 28 library assets including uninstalled games; cover/logo cycling; projected front/back decals; opacity/rotation/scale; edge flip; simulated stick movement; Save/reload; shared Plaza model and shaders.');
}finally{await browser.close();}
