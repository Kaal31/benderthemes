import assert from "node:assert/strict";
import { build } from "esbuild";
import { readFileSync } from "node:fs";
import { launch } from "./browser.mjs";

const scene = readFileSync("out/ps3-layer-test/evangelion-scene.json", "utf8");
const bundle = await build({ stdin: { contents: `import React from 'react';import {createRoot} from 'react-dom/client';import {RafBackground} from './src/ps3/RafBackground';import {RafRuntime} from './src/ps3/rafScene';const start=RafRuntime.prototype.start;window.starts=0;RafRuntime.prototype.start=function(){window.starts++;window.runtime=this;return start.call(this);};const root=createRoot(document.querySelector('#root'));window.renderScene=(layers='all',animate=true,url='/scene.json')=>root.render(<div style={{width:1280,height:720,position:'relative'}}><RafBackground url={url} layers={layers} animate={animate} fallback={<div id="fallback">Fallback</div>}/></div>);window.renderScene();`, resolveDir: process.cwd(), loader: "tsx" }, bundle: true, write: false, jsx: "automatic", format: "iife" });
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  await page.route('http://ps3.test/**', route => route.fulfill({ contentType: 'application/json', body: route.request().url().includes('bad') ? '{}' : scene }));
  await page.goto('http://ps3.test/');
  await page.setContent('<div id="root"></div>');
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  await page.waitForFunction(() => window.runtime?.time > .2);
  const before = await page.evaluate(() => window.runtime.time);
  await page.evaluate(() => window.renderScene('effects'));
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => window.starts), 1);
  assert.ok(await page.evaluate(() => window.runtime.time) >= before);
  await page.evaluate(() => window.renderScene('effects', false));
  await page.waitForTimeout(150);
  const paused = await page.evaluate(() => window.runtime.time);
  await page.waitForTimeout(200);
  assert.equal(await page.evaluate(() => window.runtime.time), paused);
  await page.evaluate(() => window.renderScene('all', true));
  await page.waitForFunction(paused => window.runtime.time > paused, paused);
  assert.equal(await page.evaluate(() => window.starts), 1);
  await page.evaluate(() => window.renderScene('all', true, '/bad.json'));
  await page.locator('#fallback').waitFor();
  await page.waitForTimeout(100);
  await page.evaluate(() => window.renderScene('all', true, '/scene.json'));
  await page.waitForFunction(() => window.starts === 2 && document.querySelector('.dht-xmb-raf')?.style.opacity === '1');
  console.log('PASS: layer changes and pause preserve runtime; failed scene recovers after URL change');
} finally { await browser.close(); }
