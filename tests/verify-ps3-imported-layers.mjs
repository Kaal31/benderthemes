import assert from "node:assert/strict";
import { build } from "esbuild";
import { readFileSync, writeFileSync } from "node:fs";
import { launch } from "./browser.mjs";

const scene = JSON.parse(readFileSync("out/ps3-layer-test/scene.json", "utf8"));
const bundle = await build({ stdin: { contents: `import {RafRuntime} from './src/ps3/rafScene';import {RafRenderer} from './src/ps3/rafRender';import {backgroundActors} from './src/ps3/rafLayers';window.testScene=async(scene)=>{const canvas=document.querySelector('canvas');const rt=new RafRuntime(scene);rt.log=()=>{};const renderer=new RafRenderer(canvas,scene);rt.start();for(let i=0;i<90;i++)rt.update(1/30);await new Promise(resolve=>setTimeout(resolve,1500));window.backgroundIds=[...backgroundActors(scene)];window.drawLayer=(layer)=>{renderer.draw(rt,1280,720,layer);const pixels=new Uint8Array(1280*720*4);renderer.gl.readPixels(0,0,1280,720,renderer.gl.RGBA,renderer.gl.UNSIGNED_BYTE,pixels);let visible=0,transparent=0;for(let i=3;i<pixels.length;i+=4){if(pixels[i])visible++;else transparent++;}return {visible,transparent,error:renderer.gl.getError()};};window.advance=()=>rt.update(.25);};`, resolveDir: process.cwd(), loader: "ts" }, bundle: true, write: false, format: "iife" });
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  const errors = [];
  page.on("pageerror", error => errors.push(error.message));
  await page.setContent('<body style="margin:0;background:linear-gradient(90deg,#083d76,#d57045)"><canvas style="width:1280px;height:720px"></canvas></body>');
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  await page.evaluate(scene => window.testScene(scene), scene);
  const report = { actors: scene.actors.length, backgrounds: await page.evaluate(() => window.backgroundIds), modes: {} };
  assert.ok(report.backgrounds.length > 0, "Fixture must contain a recognized backdrop");
  for (const layer of ["all", "background", "effects"]) {
    const stats = await page.evaluate(layer => window.drawLayer(layer), layer);
    assert.equal(stats.error, 0);
    if (layer !== "effects" || report.backgrounds.length < scene.actors.length) assert.ok(stats.visible > 0, `${layer} should render visible content`);
    if (layer === "effects") assert.ok(stats.transparent > 921600 * .1, "Effects canvas must expose a substantial custom wallpaper area");
    report.modes[layer] = stats;
    await page.screenshot({ path: `out/ps3-layer-test/${layer}.png` });
  }
  await page.evaluate(() => { window.advance(); window.drawLayer('effects'); });
  await page.screenshot({ path: 'out/ps3-layer-test/effects-next.png' });
  report.effectsMovingAtSample = !readFileSync('out/ps3-layer-test/effects.png').equals(readFileSync('out/ps3-layer-test/effects-next.png'));
  const late = [];
  for (const seconds of [30, 60, 120]) {
    await page.evaluate(seconds => { for (let frame=0;frame<seconds*30;frame++) window.advance(); window.drawLayer('all'); }, seconds / 7.5);
    const before = await page.screenshot();
    await page.evaluate(() => { for(let frame=0;frame<4;frame++)window.advance();window.drawLayer('all'); });
    const after = await page.screenshot();
    late.push({ interval: seconds, moving: !before.equals(after) });
  }
  report.longRun = late;
  assert.ok(late.every(sample => sample.moving), "Animation must continue moving in later time windows");
  assert.deepEqual(errors, []);
  writeFileSync("out/ps3-layer-test/report.json", JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} finally { await browser.close(); }
