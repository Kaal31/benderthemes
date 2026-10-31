import assert from "node:assert/strict";
import { build } from "esbuild";
import { launch } from "./browser.mjs";

const bundle = await build({
  stdin: {
    contents: `import React from "react";
      import { createRoot } from "react-dom/client";
      import { Ps4Animation } from "./src/themes/Ps4Animation";
      const root = createRoot(document.getElementById("root"));
      const picture = (color) => "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="'+color+'"/></svg>');
      const frames = [{image:picture("red"),durationMs:150},{image:picture("blue"),durationMs:300}];
      window.renderAnimation = (animate) => root.render(React.createElement(Ps4Animation,{frames,animate}));
      window.renderAnimation(true);`,
    resolveDir: process.cwd(),
  },
  bundle: true, write: false, format: "iife", jsx: "automatic",
});
const browser = await launch();
try {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.setContent('<div id="root" style="position:relative;width:640px;height:360px"></div>');
  await page.addScriptTag({ content: bundle.outputFiles[0].text });
  await page.waitForFunction(() => document.querySelector(".dht-ps4-animation")?.dataset.frame === "1");
  await page.waitForFunction(() => document.querySelector(".dht-ps4-animation")?.dataset.frame === "0");
  await page.evaluate(() => window.renderAnimation(false));
  await page.waitForTimeout(50);
  const paused = await page.locator(".dht-ps4-animation").getAttribute("src");
  await page.waitForTimeout(500);
  assert.equal(await page.locator(".dht-ps4-animation").getAttribute("src"), paused);
  assert.ok(decodeURIComponent(paused).includes('fill="red"'));
  await page.evaluate(() => window.renderAnimation(true));
  await page.waitForFunction(() => document.querySelector(".dht-ps4-animation")?.dataset.frame === "1");
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  const hiddenFrame = await page.locator(".dht-ps4-animation").getAttribute("src");
  await page.waitForTimeout(500);
  assert.equal(await page.locator(".dht-ps4-animation").getAttribute("src"), hiddenFrame);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await page.waitForFunction(() => document.querySelector(".dht-ps4-animation")?.dataset.frame === "1");
  assert.deepEqual(errors, []);
  const timed = await browser.newPage();
  await timed.clock.install({ time: new Date("2026-01-01T00:00:00Z") });
  await timed.clock.pauseAt(new Date("2026-01-01T00:00:01Z"));
  await timed.setContent('<div id="root"></div>');
  await timed.addScriptTag({ content: bundle.outputFiles[0].text });
  await timed.waitForFunction(() => document.querySelector(".dht-ps4-animation")?.dataset.frame === "0");
  const frameIndex = () => timed.locator(".dht-ps4-animation").getAttribute("data-frame");
  await timed.clock.runFor(160);
  assert.equal(await frameIndex(), "1");
  await timed.clock.runFor(80);
  await timed.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  await timed.clock.runFor(5000);
  assert.equal(await frameIndex(), "1");
  await timed.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: false });
    document.dispatchEvent(new Event("visibilitychange"));
  });
  assert.equal(await frameIndex(), "1", "Resume must preserve the current frame");
  await timed.clock.runFor(190);
  assert.equal(await frameIndex(), "1", "Resume must preserve remaining frame duration");
  await timed.clock.runFor(30);
  assert.equal(await frameIndex(), "0", "Loop must retain its original phase after hiding");
  await timed.close();
  console.log("PASS: PS4 frame timing, looping, pause and phase-preserving visibility resume");
} finally {
  await browser.close();
}
