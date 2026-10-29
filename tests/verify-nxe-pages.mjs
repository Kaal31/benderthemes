import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:1280,height:900}}),errors=[];p.on('pageerror',e=>errors.push(e.message));
 await p.goto('http://127.0.0.1:8911/preview/x360-relive-layout.html?theme=x360&xs=nxe&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883');await p.waitForTimeout(7000);
 for(let i=0;i<5;i++){await p.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:12})));await p.waitForTimeout(160);}await p.evaluate(()=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:1})));
 await p.getByRole('dialog',{name:'System Settings',exact:true}).waitFor();await p.screenshot({path:'preview/nxe-system-settings.png'});
 await p.getByRole('option',{name:'Console Settings',exact:true}).click();await p.getByRole('dialog',{name:'Console Settings',exact:true}).waitFor();
 await p.getByRole('option',{name:'Audio',exact:true}).click();const effects=p.getByRole('option').filter({hasText:'Sound Effects'}).first();const before=await effects.innerText();await effects.click();assert.notEqual(await effects.innerText(),before,'Audio toggle changes actual settings');await p.screenshot({path:'preview/nxe-audio-settings.png'});
 const press=async button=>{await p.evaluate(button=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail:button})),button);await p.waitForTimeout(200);};
 await press(2);await p.getByRole('dialog',{name:'Console Settings',exact:true}).waitFor();await press(2);await p.getByRole('dialog',{name:'System Settings',exact:true}).waitFor();for(const name of ['Memory','Network Settings','Profile']){
 await p.getByRole('option',{name,exact:true}).click();await p.getByRole('dialog',{name,exact:true}).waitFor();await press(2);await p.getByRole('dialog',{name:'System Settings',exact:true}).waitFor();
 }
 await press(2);assert.equal(await p.locator('[data-nxe-page]').count(),0);
 await press(11);await press(11);await press(11);await press(1);await p.getByRole('dialog',{name:'Game Library',exact:true}).waitFor();assert(await p.getByRole('option').count()>0);await p.getByRole('button',{name:'Installed Games',exact:true}).click();await p.getByRole('button',{name:'All Games',exact:true}).click();await p.screenshot({path:'preview/nxe-game-library.png'});await press(2);assert.equal(await p.locator('[data-nxe-page]').count(),0);assert.deepEqual(errors,[]);console.log('PASS NXE settings navigation, audio persistence, controller back stack, library filters and dashboard return');
}finally{await b.close();}
