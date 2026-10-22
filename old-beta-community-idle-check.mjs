import {launch} from './tests/browser.mjs';
import assert from 'node:assert/strict';
const browser=await launch();
try {
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-beta-big-picture');
  const root=page.locator('.dht-oldbeta');
  await root.waitFor();
  assert.equal(await root.locator('.beta-sheet-friend').first().evaluate(n=>getComputedStyle(n).animationPlayState),'paused');
  await root.locator('button[data-category="2"]').focus();
  await page.waitForTimeout(600);
  for(const layer of [0,1,2]) {
    const result=await root.locator(`.beta-community-layer-${layer} .beta-sheet-friend`).first().evaluate(n=>{
      const a=n.getAnimations().find(a=>a.effect.getTiming().iterations===Infinity);
      const running=getComputedStyle(n).animationPlayState;
      a.pause();a.effect.updateTiming({delay:0});
      a.currentTime=6000;
      const before=getComputedStyle(n).translate.split(' ').map(parseFloat);
      a.currentTime=9000;
      const style=getComputedStyle(n),after=style.translate.split(' ').map(parseFloat);
      return {dx:after[0]-before[0],dy:(after[1]||0)-(before[1]||0),opacity:Number(style.opacity),rotation:style.rotate,running};
    });
    assert.equal(result.running,'running');
    assert.ok(layer===0?result.dx<0:result.dx>0,`wrong layer ${layer} direction`);
    assert.equal(result.dy,0);
    assert.equal(result.rotation,'none');
    assert.equal(result.opacity,layer===2?.48:1);
  }
  await root.screenshot({path:'out/old-beta-big-picture/community-counterflow.png'});
  await page.emulateMedia({reducedMotion:'reduce'});
  await page.waitForFunction(()=>document.querySelector('.dht-oldbeta').getAnimations({subtree:true}).length===0);
  console.log('PASS: Community front flows left, rear layers flow right, names stay level, deepest layer alone fades, and inactive/reduced motion is respected.');
} finally {await browser.close();}
