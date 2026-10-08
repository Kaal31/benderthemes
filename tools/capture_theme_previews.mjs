import { chromium } from "playwright";
import { mkdirSync } from "node:fs";
import { startPreviewServer } from "../preview/server.mjs";
const themes = ["vita","ps2","ps3","psp","ps4","ps5","xbox","x360","aero","aero2","dial","castle","republic","minecraft","pain","nazarick"];
mkdirSync("out/theme-previews", { recursive: true });
const browser = await chromium.launch({ headless: true });
const { server, url } = await startPreviewServer();
try {
  const page = await browser.newPage({ viewport: { width: 1304, height: 930 }, reducedMotion: "no-preference" });
  const errors = [];
  page.on("pageerror", e => { errors.push(String(e)); console.error(String(e)); });
  page.on("console", m => { if (m.type() === "error") console.error(m.text().slice(0, 400)); });
  await page.goto(url, { waitUntil: "load" });
  await page.locator("[data-dht-root]").waitFor();
  await page.waitForTimeout(800);
  for (const theme of themes) {
    await page.evaluate(theme => window.__updateTheme({ theme, animations: true }), theme);
    await page.waitForTimeout(650);
    const root = page.locator("[data-dht-root]");
    await root.screenshot({ path: `out/theme-previews/${theme}.png` });
    const frames = `out/theme-previews/frames/${theme}`;
    mkdirSync(frames, { recursive: true });
    for (let i = 0; i < 12; i++) {
      if (i === 3 || i === 7) await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(150);
      await root.screenshot({ path: `${frames}/${String(i).padStart(2,"0")}.png` });
    }
    console.log(`Captured ${theme}`);
  }
  await page.getByRole("button", { name: "Hub", exact: true }).first().click();
  await page.locator(".dht-market").waitFor();
  await page.locator("[data-dht-root]").screenshot({ path: "out/theme-previews/marketplace.png" });
  await page.locator(".market-close").click();
  for (const theme of themes) {
    await page.evaluate(theme => window.__updateTheme({ theme }), theme);
    await page.getByRole("button", { name: "Preview firmware update", exact: true }).click();
    await page.locator(".dht-firmware").waitFor();
    await page.locator("[data-dht-root]").screenshot({ path: `out/theme-previews/firmware-${theme}.png` });
    await page.locator(".fw-actions button").last().click();
  }
  if (errors.length) throw new Error([...new Set(errors)].join("\n"));
  console.log("All 16 themes and firmware prompts captured without page errors.");
} finally { await browser.close(); server.close(); }
