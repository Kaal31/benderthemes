// The music player's shuffle / repeat / crossfade in the themes' music views (shared player in PS4, PS1, Minecraft;
// PSP music screen; PS3 XMB options), real playback in Chromium with short generated WAV tracks (next track at the end,
// a crossfade overlapping two tracks). Screenshots go to preview/music-*.png.
// Build the preview first: PYTHON=python3 node preview/build.mjs   (then: git restore --source=HEAD -- theme-catalog.json)
import assert from 'node:assert/strict';
import { launch } from './browser.mjs';
import { startPreviewServer } from '../preview/server.mjs';

function wav(sec, f) {
  const sr = 8000, n = Math.round(sr * sec), b = Buffer.alloc(44 + n * 2);
  b.write('RIFF', 0); b.writeUInt32LE(36 + n * 2, 4); b.write('WAVEfmt ', 8); b.writeUInt32LE(16, 16); b.writeUInt16LE(1, 20); b.writeUInt16LE(1, 22);
  b.writeUInt32LE(sr, 24); b.writeUInt32LE(sr * 2, 28); b.writeUInt16LE(2, 32); b.writeUInt16LE(16, 34); b.write('data', 36); b.writeUInt32LE(n * 2, 40);
  for (let i = 0; i < n; i++) b.writeInt16LE(Math.round(6000 * Math.sin((i * f * 2 * Math.PI) / sr)), 44 + i * 2);
  return 'data:audio/wav;base64,' + b.toString('base64');
}
const titles = ['Opening', 'Field Theme', 'Battle', 'Town at Night', 'Ending'];
const tracks = titles.map((t, i) => ({ id: 't' + i, title: t, file: `0${i + 1} ${t}.wav`, url: i === 3 ? 'data:audio/wav;base64,AAAA' : wav(3, 300 + i * 80), size: 1, disc: i >= 3 ? 'Disc 2' : '' }));
const music = { ok: true, albums: [{ id: 'al', name: 'Sample Soundtrack', source: 'local', appid: 0, cover: '', artist: 'Test Composer', tracks }, { id: 'b', name: 'Other Album', source: 'local', appid: 0, cover: '', tracks: tracks.slice(0, 2) }] };

const { server, url } = await startPreviewServer(0);
const b = await launch(['--autoplay-policy=no-user-gesture-required']);
const errors = [];
const page = async (theme) => {
  const p = await b.newPage({ viewport: { width: 1304, height: 880 } });
  p.on('pageerror', (e) => errors.push(theme + ': ' + e.message));
  await p.addInitScript((m) => { window.__testMusic = m; }, music);
  await p.goto(url + `?theme=${theme}&still=1`);
  await p.locator('[data-dht-root]').waitFor();
  await p.waitForTimeout(600);
  return p;
};
const st = (p) => p.evaluate(() => { const s = window.__musicPlayer.state(); return { index: s.index, playing: s.playing, shuffle: s.shuffle, repeat: s.repeat, crossfade: s.crossfade, fading: s.fading, error: s.error }; });
try {
  // ---- the shared player: playback goes on to the next track, skips the broken one, crossfades
  let p = await page('ps4');
  await p.evaluate(() => window.__openDestination({ place: 'music' }));
  await p.locator('.dht-media').waitFor();
  await p.locator('.dht-media-row', { hasText: 'Sample Soundtrack' }).click();
  await p.locator('.dht-media-row', { hasText: 'Battle' }).click();
  await p.waitForFunction(() => window.__musicPlayer.state().index !== 2, null, { timeout: 8000 });
  await p.waitForTimeout(600);
  let s = await st(p);
  assert.equal(s.index, 4, 'Battle ends, the broken Town at Night (Disc 2) is skipped, Ending plays: ' + JSON.stringify(s));
  assert.equal(s.playing, true);
  await p.waitForFunction(() => !window.__musicPlayer.state().playing, null, { timeout: 8000 });
  s = await st(p);
  assert.equal(s.playing, false, 'the last track ends: stopped (repeat off)');
  // controller: X shuffle, Y repeat, R2 crossfade (preview keys x, t, c)
  await p.keyboard.press('x'); await p.keyboard.press('t'); await p.keyboard.press('c');
  s = await st(p);
  assert.deepEqual([s.shuffle, s.repeat, s.crossfade], [true, 'all', 2]);
  const saved = await p.evaluate(() => { const g = window.__getThemeSettings(); return [g.musicShuffle, g.musicRepeat, g.musicCrossfade]; });
  assert.deepEqual(saved, [true, 'all', 2], 'kept in the settings');
  await p.locator('.dht-media-xf').click(); // 4 s
  await p.keyboard.press('x'); // shuffle off again for a predictable order
  await p.locator('.dht-media-row', { hasText: 'Opening' }).click();
  // 3 s tracks: a crossfade of min(4, 3 / 2) = 1.5 s starts half way through Opening
  await p.waitForFunction(() => window.__musicPlayer.state().fading, null, { timeout: 8000 });
  s = await st(p);
  assert.equal(s.fading, true, 'two tracks overlap: ' + JSON.stringify(s)); assert.equal(s.index, 1);
  assert.match(await p.locator('.dht-media-status').innerText(), /Repeat all tracks[\s\S]*Crossfading/);
  await p.locator('[data-dht-root]').screenshot({ path: 'preview/music-ps4.png' });
  await p.close();

  // ---- the same player in other looks
  for (const theme of ['ps1', 'minecraft', 'wiiu']) {
    p = await page(theme);
    await p.evaluate(() => window.__openDestination({ place: 'music' }));
    await p.locator('.dht-media').waitFor();
    await p.locator('.dht-media-row', { hasText: 'Sample Soundtrack' }).click();
    await p.evaluate(() => { const P = window.__musicPlayer; P.setShuffle(true); P.setRepeat('one'); P.setCrossfade(6); });
    await p.locator('.dht-media-row', { hasText: 'Field Theme' }).click();
    await p.waitForTimeout(500);
    assert.equal(await p.locator('.dht-media-xf').getAttribute('aria-label'), 'Crossfade 6 s');
    assert.equal(await p.locator('.dht-media-ctl button[aria-label=Shuffle]').getAttribute('data-on'), 'true');
    await p.locator('[data-dht-root]').screenshot({ path: `preview/music-${theme}.png` });
    await p.close();
  }

  // ---- PSP: the music screen shows shuffle / repeat / crossfade
  p = await page('psp');
  await p.evaluate((m) => { const P = window.__musicPlayer; P.setShuffle(true); P.setRepeat('all'); P.setCrossfade(4); P.play(m.albums[0], 1); P.show(true); }, music);
  await p.locator('.dht-xmb-music').waitFor();
  await p.waitForTimeout(500);
  assert.match(await p.locator('.dht-xmb-music').innerText(), /⇌ 4s/);
  await p.locator('[data-dht-root]').screenshot({ path: 'preview/music-psp.png' });
  await p.close();

  // ---- PS3: the XMB's options menu on the music category
  p = await page('ps3');
  await p.evaluate((m) => { const P = window.__musicPlayer; P.setCrossfade(0); P.play(m.albums[0], 0); P.show(false); }, music);
  // the XMB starts on Game; Music is three categories to the left (Users, Settings, Photo, Music, Video, TV, Game…)
  for (let k = 0; k < 3; k++) { await p.keyboard.press('ArrowLeft'); await p.waitForTimeout(250); }
  await p.locator('[data-dht-root]').screenshot({ path: 'preview/music-ps3-now.png' });
  await p.keyboard.press('t');
  await p.waitForTimeout(400);
  await p.locator('[data-dht-root]').screenshot({ path: 'preview/music-ps3.png' });
  const menu = await p.locator('.dht-menu-item').allInnerTexts();
  assert.ok(menu.some((t) => /Shuffle/.test(t)) && menu.some((t) => /Repeat: Off/.test(t)) && menu.some((t) => /Crossfade: Off/.test(t)), JSON.stringify(menu));
  await p.close();
  assert.deepEqual(errors, []);
  console.log('PASS music player UI: next track, broken file skipped, stop at the end, shuffle / repeat / crossfade in the shared player, PSP and PS3');
} finally {
  await b.close();
  server.close();
}
