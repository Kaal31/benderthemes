// Theme files of the newer importers (Switch .nxtheme, Wii .mym/.csm, Wii U .utheme, 3DS, Xbox, Xbox 360) are presets,
// listed right after their console's own theme, selectable, cyclable and round-tripping through currentPresetId.
import { launch, BASE } from './browser.mjs';
import assert from 'node:assert/strict';
const b = await launch();
const p = await b.newPage({ viewport: { width: 1304, height: 890 } });
const errors = [];
p.on('pageerror', (e) => errors.push(e.message));
await p.addInitScript(() => {
  window.__testSwitchList = [{ id: 'Aqua.nxtheme', name: 'Aqua Wave', author: 'a', screens: ['home'] }, { id: 'pack/Dusk.nxtheme', name: 'Dusk', author: 'b', screens: ['home'] }];
  window.__testSkinLists = { xbox: ['Neon', 'Classic Green'], wii: ['Blue_Sky.mym', 'Night.csm'], n3ds: ['Cherry'], x360: ['Orange Pack'] };
  window.__testWiiu = { 'Sunset.utheme': { name: 'Sunset', author: 'x', art: {}, changed: [] }, 'Needs.utheme': { name: 'Needs', needsStock: true, art: {}, changed: [] } };
});
const settings = () => p.evaluate(() => window.__getThemeSettings());
const list = () => p.evaluate(() => window.__presets());
try {
  await p.goto(BASE + '/preview/preview.html');
  await p.waitForFunction(() => window.__refreshPresets);
  await p.evaluate(() => window.__refreshPresets());
  const all = await list();
  const ids = all.map((x) => x.id);
  const after = (base, files, company) => {
    const i = ids.indexOf(base);
    assert.ok(i >= 0, base);
    files.forEach((f, k) => { assert.equal(ids[i + 1 + k], f, `${f} follows ${base}`); assert.equal(all[i + 1 + k].company, company); });
  };
  after('switch', ['switch:Aqua.nxtheme', 'switch:pack/Dusk.nxtheme'], 'Nintendo');
  after('wii', ['wii:Blue_Sky.mym', 'wii:Night.csm'], 'Nintendo');
  after('wiiu', ['wiiu:Sunset.utheme', 'wiiu:Needs.utheme'], 'Nintendo');
  after('n3ds', ['n3ds:Cherry'], 'Nintendo');
  after('xbox', ['xbox:Neon', 'xbox:Classic Green'], 'Microsoft');
  after('x360:metro', ['x360skin:Orange Pack'], 'Microsoft');
  assert.equal(all.find((x) => x.id === 'switch:Aqua.nxtheme').label, 'Switch · Aqua Wave');
  assert.equal(all.find((x) => x.id === 'wii:Blue_Sky.mym').label, 'Wii · Blue Sky');

  const cases = [
    ['switch:Aqua.nxtheme', 'switch', (s) => s.switchTheme === 'Aqua.nxtheme', 'switch:Aqua.nxtheme'],
    ['wii:Night.csm', 'wii', (s) => s.wiiSkin === 'Night.csm', 'wii:Night.csm'],
    ['wiiu:Needs.utheme', 'wiiu', (s) => s.wiiuTheme === 'Needs.utheme', null],
    ['n3ds:Cherry', 'n3ds', (s) => s.n3dsSkin === 'Cherry', 'n3ds:Cherry'],
    ['xbox:Neon', 'xbox', (s) => s.xboxSkin === 'Neon', 'xbox:Neon'],
    ['x360skin:Orange Pack', 'x360', (s) => s.x360.skin === 'Orange Pack', null],
  ];
  for (const [id, theme, ok, skinHook] of cases) {
    await p.evaluate((i) => { window.__updateTheme({ pages: { store: 'vita' } }); return window.__applyPreset(i); }, id);
    await p.waitForTimeout(500);
    const s = await settings();
    assert.equal(s.theme, theme, id);
    assert.ok(ok(s), `${id} sets its file`);
    assert.deepEqual(s.pages, {}, 'pages cleared');
    assert.equal(await p.evaluate(() => window.__currentPreset()), id, 'current id round-trips');
    assert.equal(await p.locator('[data-dht-root]').getAttribute('data-dht-preset'), id);
    if (skinHook) assert.equal(await p.locator('[data-dht-root]').getAttribute('data-dht-skin'), skinHook);
  }
  // the console's own entry clears the file
  const plain = [['switch', (s) => s.switchTheme], ['wii', (s) => s.wiiSkin], ['wiiu', (s) => s.wiiuTheme], ['n3ds', (s) => s.n3dsSkin], ['xbox', (s) => s.xboxSkin], ['x360:metro', (s) => s.x360.skin]];
  for (const [id, get] of plain) {
    await p.evaluate((i) => window.__applyPreset(i), id);
    await p.waitForTimeout(300);
    assert.equal(get(await settings()) || '', '', `${id} clears the theme file`);
    assert.equal(await p.evaluate(() => window.__currentPreset()), id);
  }
  // L2 / R2 walk through them
  await p.evaluate(() => window.__applyPreset('switch'));
  assert.equal(await p.evaluate(() => window.__cyclePreset(1)), 'switch:Aqua.nxtheme');
  assert.equal(await p.evaluate(() => window.__cyclePreset(1)), 'switch:pack/Dusk.nxtheme');
  assert.equal((await settings()).switchTheme, 'pack/Dusk.nxtheme');
  assert.equal(await p.evaluate(() => window.__cyclePreset(-1)), 'switch:Aqua.nxtheme');
  assert.equal(await p.evaluate(() => window.__cyclePreset(-1)), 'switch');
  assert.equal((await settings()).switchTheme || '', '');
  assert.deepEqual(errors, []);
  console.log('PASS: theme files are presets after their console theme, apply, clear, round-trip and cycle.');
} finally { await b.close(); }
