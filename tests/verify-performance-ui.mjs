import assert from 'node:assert/strict';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';

const { server, url } = await startPreviewServer();
const browser = await launch();
try {
  const page = await browser.newPage({ viewport: { width: 1304, height: 930 } });
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.addInitScript(() => {
    const counts = new WeakMap();
    window.__draws = canvas => counts.get(canvas) ?? 0;
    for (const type of [WebGLRenderingContext, WebGL2RenderingContext]) {
      const clear = type.prototype.clear;
      type.prototype.clear = function (...args) {
        counts.set(this.canvas, (counts.get(this.canvas) ?? 0) + 1);
        return clear.apply(this, args);
      };
    }
  });
  await page.goto(url);
  await page.locator('[data-dht-root]').waitFor();
  await page.waitForTimeout(1000);
  for (const theme of ['minecraft', 'x360']) {
    await page.evaluate(theme => window.__updateTheme({ theme, animations: true, x360: { ...window.__getThemeSettings().x360, style: 'kinect' } }), theme);
    const canvas = page.locator(theme === 'minecraft' ? '.mc-avatar-scene canvas' : '.dht-x360-avatar').first();
    await canvas.waitFor();
    await page.waitForTimeout(700);
    const read = () => canvas.evaluate(el => window.__draws(el));
    const before = await read();
    await page.waitForFunction(({ selector, before }) => window.__draws(document.querySelector(selector)) > before, { selector: theme === 'minecraft' ? '.mc-avatar-scene canvas' : '.dht-x360-avatar', before });
    await page.evaluate(() => window.__updateTheme({ animations: false }));
    await page.waitForTimeout(1200);
    const still = await read(); await page.waitForTimeout(350);
    assert.equal(await read(), still, `${theme} static renderer must stop`);
    await page.evaluate(() => window.__updateTheme({ animations: true }));
    await page.waitForTimeout(100);
    await page.evaluate(() => {
      Object.defineProperty(document, 'hidden', { configurable: true, value: true });
      document.dispatchEvent(new Event('visibilitychange'));
    });
    const hidden = await read(); await page.waitForTimeout(250);
    assert.equal(await read(), hidden, `${theme} hidden renderer must stop`);
    await page.evaluate(() => {
      delete document.hidden;
      document.dispatchEvent(new Event('visibilitychange'));
    });
    await page.waitForFunction(({selector, hidden}) => window.__draws(document.querySelector(selector)) > hidden, { selector: theme === "minecraft" ? ".mc-avatar-scene canvas" : ".dht-x360-avatar", hidden });
    if (theme === 'x360') {
      await page.evaluate(() => window.__openPlace('friends'));
      await page.locator('.dht-destination').waitFor(); await page.waitForTimeout(100);
      const covered = await read(); await page.waitForTimeout(250);
      assert.equal(await read(), covered, 'covered avatar must stop');
      await page.keyboard.press('Escape');
      await page.waitForFunction(covered => window.__draws(document.querySelector('.dht-x360-avatar')) > covered, covered);
    }
    console.log(`PASS ${theme}: real WebGL animation, static stop, visibility pause and resume.`);
  }
  assert.deepEqual(errors, []);
} finally {
  await browser.close(); server.close();
}
