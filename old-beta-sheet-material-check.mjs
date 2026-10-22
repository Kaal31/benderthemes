import assert from 'node:assert/strict';
import {launch} from './tests/browser.mjs';
const browser=await launch();
try {
  const page=await browser.newPage({viewport:{width:1440,height:1100}});
  await page.goto('http://127.0.0.1:8793/preview/preview.html?theme=old-beta-big-picture');
  const root=page.locator('.dht-oldbeta');
  await root.waitFor();
  for (const category of [1,0]) {
    await root.locator(`button[data-category="${category}"]`).focus();
    await page.waitForTimeout(550);
    const layers=await root.evaluate((root,category)=>{
      const selector=category===1?'.beta-rear-sheet':'.beta-store-layer';
      return [...root.querySelectorAll(selector)].map(layer=>{
        const leaf=layer.querySelector(category===1?'.beta-rear-cover':'.beta-sheet-cover');
        const animation=leaf.getAnimations().find(a=>a.effect.getTiming().iterations===Infinity);
        animation.pause();animation.effect.updateTiming({delay:0});
        animation.currentTime=Number(animation.effect.getTiming().duration)/2;
        return {parentOpacity:Number(getComputedStyle(layer).opacity),leafOpacity:Number(getComputedStyle(leaf).opacity)};
      });
    },category);
    assert.ok(layers.every(layer=>layer.parentOpacity===1),'3D layer parents must stay opaque');
    assert.ok(layers.slice(0,-1).every(layer=>layer.leafOpacity===1),'Only the deepest layer may be translucent');
    assert.equal(layers.at(-1).leafOpacity,.48);
    if(category===0)assert.equal(await root.locator('.beta-store-sheet').evaluate(n=>getComputedStyle(n).maskImage),'none');
    await root.screenshot({path:`out/old-beta-big-picture/${category===1?'library':'store'}-solid-layers.png`});
  }
  console.log('PASS: Store and Library have solid upper/rear sheets, with haze limited to the deepest layer.');
} finally {await browser.close();}
