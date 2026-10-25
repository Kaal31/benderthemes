import assert from "node:assert/strict";
import { build } from "esbuild";
import { launch } from "./browser.mjs";
import { startPreviewServer } from "../preview/server.mjs";

const bundle = await build({ stdin: { contents: `import './preview/main';import {ps5ActivityCards} from './src/themes/ps5Activities';window.__activityFixture=(changes={},earned={unlocked:12,total:57,recent:[]})=>ps5ActivityCards({...window.__libraryGame(1000),...changes},earned,()=>window.__activityAction='details',()=>window.__activityAction='achievements');`, resolveDir: process.cwd(), loader: "tsx" }, bundle: true, write: false, format: "iife", jsx: "automatic", minify: true, alias: { "@decky/ui": "./preview/stubs/ui.tsx", "@decky/api": "./preview/stubs/api.ts" }, define: { "process.env.NODE_ENV": '"production"' } });
const { server, url } = await startPreviewServer();
const browser = await launch();
try {
  for (const height of [720, 800]) {
    const page = await browser.newPage({ viewport: { width: 1304, height: height + 70 } });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    await page.addInitScript(() => { window.__themePreview = "ps5"; window.__isThemePreview = true; window.__themeCatalog = { themes: [] }; window.__testInventory = { ps5: "test" }; });
    await page.route("**/preview/preview.html**", route => route.fulfill({ contentType: "text/html", body: `<div id="root"></div><script>${bundle.outputFiles[0].text.replaceAll("</script", "<\\/script")}</script>` }));
    await page.goto(url + "?still=1&h=" + height);
    await page.waitForSelector(".dht-ps5-card[data-activity=achievements]");
    assert.equal(await page.locator(".dht-ps5-card").count(), 3);
    assert.equal(await page.locator(".dht-ps5-card").first().evaluate(element => element.style.width), "300px");
    const lowerLayout = await page.evaluate(() => {
      const root = document.querySelector('[data-dht-root]').getBoundingClientRect();
      const meta = document.querySelector('.dht-ps5-game-meta').getBoundingClientRect();
      const play = document.querySelector('.dht-ps5-play').getBoundingClientRect();
      const card = document.querySelector('.dht-ps5-card').getBoundingClientRect();
      return meta.bottom <= play.top - 8 && play.bottom <= card.top - 16 && card.bottom <= root.bottom - 40;
    });
    assert.ok(lowerLayout, "Metadata, Play and cards must have separate rows and a bottom safe margin");
    const valid = await page.evaluate(() => window.__activityFixture({ overview: { review_percentage_with_bombs: 86, metacritic_score: 90, size_on_disk: 72 * 1024 ** 3, minutes_playtime_last_two_weeks: 120 } }));
    assert.equal(valid[2].title, "86% positive");
    assert.match(valid[2].sub, /Metacritic 90.*72.0 GB/);
    assert.ok(valid[0].extra.includes("2 weeks"));
    assert.equal(valid[1].progress, 21);
    const missing = await page.evaluate(() => window.__activityFixture({ overview: {} }, { unlocked: 0, total: 0, recent: [] }));
    assert.equal(missing[2].id, "library");
    assert.equal(missing[1].progress, undefined);
    assert.equal(missing[1].title, "View achievements");
    const shortcut = await page.evaluate(() => window.__activityFixture({ shortcut: true, overview: { review_percentage_with_bombs: 100 } }));
    assert.equal(shortcut[1].id, "details");
    assert.equal(shortcut[2].id, "library");
    const clamped = await page.evaluate(() => window.__activityFixture({}, { unlocked: 30, total: 10, recent: [] }));
    assert.equal(clamped[1].title, "10 / 10 unlocked");
    assert.equal(clamped[1].progress, 100);
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowDown");
    await page.keyboard.press("ArrowRight");
    assert.equal(await page.locator('.dht-ps5-card[data-selected="true"]').getAttribute("data-activity"), "achievements");
    await page.waitForTimeout(250);
    assert.ok(await page.locator('.dht-ps5-tab').first().evaluate(element => element.getBoundingClientRect().top >= document.querySelector('[data-dht-root]').getBoundingClientRect().top), "Card focus must not push the tabs off screen");
    await page.keyboard.press("ArrowUp");
    await page.evaluate(() => { const cards = window.__activityFixture(); cards[1].run(); });
    assert.equal(await page.evaluate(() => window.__activityAction), "achievements");
    await page.evaluate(() => {
      window.__libraryGame(1000).overview.display_name = "A very long game title with a definitive edition and additional expansion content";
      window.__updateTheme({ maxGames: window.__getThemeSettings().maxGames + 1 });
    });
    await page.waitForFunction(() => document.querySelector('.dht-ps5-game-title')?.textContent.startsWith('A very long game title'));
    assert.ok(await page.locator('.dht-ps5-game-title').evaluate(element => element.getBoundingClientRect().bottom < document.querySelector('.dht-ps5-game-meta').getBoundingClientRect().top), "Long titles must stay clear of the game metadata");
    await page.evaluate(() => window.__updateTheme({ styles: { ps5: { activityCards: false } } }));
    await page.waitForFunction(() => !document.querySelector(".dht-ps5-card"));
    assert.deepEqual(errors, []);
    await page.close();
    console.log(`PASS: PS5 ${height}p original card width, activity data, fallbacks, gamepad selection and hide setting`);
  }
} finally { await browser.close(); server.close(); }
