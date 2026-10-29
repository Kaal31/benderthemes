import assert from 'node:assert/strict';import {chromium} from 'playwright';
const b=await chromium.launch({channel:'msedge',headless:true});try{
 const p=await b.newPage({viewport:{width:1280,height:900}});const errors=[];p.on('pageerror',e=>errors.push(e.message));
 const press=detail=>p.evaluate(detail=>window.dispatchEvent(new CustomEvent('preview-controller-input',{detail})),detail);
 for(const [name,button,count] of [['Game Library',12,2],['System Settings',12,5],['Video Library',9,3],['Music Library',9,2],['Picture Library',9,1]]){
  await p.goto('http://127.0.0.1:8911/preview/x360-reference-corrected.html?theme=x360&xs=nxe');await p.waitForTimeout(7000);
  for(let i=0;i<count;i++){await press(button);await p.waitForTimeout(170);}await press(1);await p.getByRole('dialog',{name,exact:true}).waitFor();await p.waitForTimeout(250);
  assert.equal(await p.locator('[data-nxe-dashboard]').evaluate(e=>getComputedStyle(e).opacity),'0');
  const lists=p.getByRole('listbox');assert.equal(await lists.first().evaluate(e=>getComputedStyle(e).scrollbarWidth),'none');
  // Prove hidden chrome does not disable the scrolling mechanism.
  await lists.first().evaluate(e=>{const filler=document.createElement('div');filler.style.height='2000px';e.append(filler);e.scrollTop=400;});
  assert(await lists.first().evaluate(e=>e.scrollTop>0));
  await press(2);await p.waitForTimeout(45);
  const opacity=Number(await p.locator('[data-nxe-dashboard]').evaluate(e=>getComputedStyle(e).opacity));assert(opacity>0&&opacity<1,`${name}: dashboard crossfades during exit (${opacity})`);
  assert.equal(await p.getByRole('dialog',{name,exact:true}).count(),1);
  await press(2);await press(10);await p.waitForTimeout(230);
  assert.equal(await p.locator('[data-nxe-page],[data-nxe-media]').count(),0);assert.equal(await p.locator('[data-nxe-dashboard]').evaluate(e=>getComputedStyle(e).opacity),'1');
  console.log('PASS',name,'scrolling, hidden scrollbar, coordinated exit and repeated input');
 }
 assert.deepEqual(errors,[]);
}finally{await b.close();}
