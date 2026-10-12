// Other-plugin music hand-off (src/otherPlugins.ts) against fake ThemeDeck / AudioLoader globals; node only.
//   node tests/verify-other-plugins.mjs
import { build } from 'esbuild';
import assert from 'node:assert/strict';
import { mkdtempSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const dir = mkdtempSync(join(tmpdir(), 'dht-op-'));
const out = join(dir, 'op.mjs');
await build({ entryPoints: ['src/otherPlugins.ts'], bundle: true, format: 'esm', platform: 'node', outfile: out, logLevel: 'silent' });
writeFileSync(join(dir, 'package.json'), '{"type":"module"}');
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// ---- fakes ----
class Store {
  m = new Map();
  get length() { return this.m.size; }
  key(i) { return [...this.m.keys()][i] ?? null; }
  getItem(k) { return this.m.has(k) ? this.m.get(k) : null; }
  setItem(k, v) { this.m.set(k, String(v)); }
  removeItem(k) { this.m.delete(k); }
}
function setup({ themeDeck = true, audioLoader = true } = {}) {
  const g = globalThis;
  const events = [];
  const listeners = new Map();
  g.localStorage = new Store();
  g.CustomEvent = class { constructor(type, init) { this.type = type; this.detail = init?.detail; } };
  g.dispatchEvent = (e) => { events.push([e.type, e.detail]); (listeners.get(e.type) ?? []).forEach((f) => f(e)); };
  g.SteamUIStore = { RunningApps: [], WindowStore: { GamepadUIMainWindowInstance: { m_history: { location: { pathname: '/library/home' } } } } };
  const calls = { alPause: 0, alPlay: 0 };
  g.AUDIOLOADER_MENUMUSIC = audioLoader ? { pause: () => calls.alPause++, play: () => (calls.alPlay++, Promise.resolve()) } : undefined;
  // A fake ThemeDeck: it follows the global-ambient pref like the real one (stop on false, start on true).
  const el = { paused: true, src: '', ls: {}, addEventListener(n, f) { (this.ls[n] ??= []).push(f); }, removeEventListener(n, f) { this.ls[n] = (this.ls[n] ?? []).filter((x) => x !== f); },
    pause() { this.paused = true; }, play() { this.paused = false; (this.ls.play ?? []).forEach((f) => f.call(this)); return Promise.resolve(); } };
  if (themeDeck) {
    g.__themedeckSharedAudio = el; el.src = 'blob:ambient'; el.paused = false;
    g.localStorage.setItem('themedeck:globalAmbientEnabled', 'true');
    const apply = () => {
      const on = g.localStorage.getItem('themedeck:globalAmbientEnabled') === 'true' && !g.SteamUIStore.RunningApps.length;
      if (!on && !el.paused) { el.pause(); el.src = ''; } // ThemeDeck's own stopPlayback
      if (on && el.paused) { el.src = 'blob:ambient'; el.play(); }
    };
    listeners.set('themedeck:global-ambient-enabled-changed', [apply]);
    el.apply = apply;
  } else {
    delete g.__themedeckSharedAudio;
  }
  return { g, events, el, calls, route: (p) => { g.SteamUIStore.WindowStore.GamepadUIMainWindowInstance.m_history.location.pathname = p; } };
}
let n = 0;
const fresh = async () => (await import(`file://${out}?${n++}`));
const pref = (g) => g.localStorage.getItem('themedeck:globalAmbientEnabled');

// 1. hold: ThemeDeck is switched off through its flag + event (not by pausing), AudioLoader paused
{
  const t = setup(); const op = await fresh();
  const release = op.holdOtherMusic();
  assert.equal(pref(t.g), 'false');
  assert.ok(t.events.some(([e, d]) => e === 'themedeck:global-ambient-enabled-changed' && d === false));
  t.el.apply(); // ThemeDeck reacts to the event
  assert.equal(t.el.paused, true); assert.equal(t.el.src, '');
  assert.equal(t.calls.alPause, 1);
  // 2. release: the user's value is restored and ThemeDeck restarts by itself; no manual play of the element
  release();
  assert.equal(pref(t.g), 'true'); assert.equal(t.g.localStorage.getItem('dht:themedeckPrefsBackup'), null);
  t.el.apply();
  assert.equal(t.el.paused, false);
  assert.equal(t.calls.alPlay, 1);
  release(); // double release is harmless
  console.log('ok hold + release');
}
// 3. track change while held: ThemeDeck starts a track anyway -> paused again; two holds need two releases
{
  const t = setup(); const op = await fresh();
  const r1 = op.holdOtherMusic(); const r2 = op.holdOtherMusic();
  t.el.src = 'blob:other'; t.el.play(); // its play listener is attached by the guard
  await sleep(1100); // guard tick attaches the listener and re-checks
  t.el.play();
  assert.equal(t.el.paused, true);
  r1(); assert.equal(pref(t.g), 'false');
  r2(); assert.equal(pref(t.g), 'true');
  console.log('ok track change while held');
}
// 4. game page while held: ThemeDeck's game track is not paused; ambient stays off
{
  const t = setup(); const op = await fresh();
  const release = op.holdOtherMusic();
  t.route('/library/app/220');
  t.el.paused = true; t.el.src = 'blob:game'; t.el.play();
  await sleep(1100);
  assert.equal(t.el.paused, false); assert.equal(pref(t.g), 'false');
  assert.equal(op.onGamePage(), true);
  t.route('/library/home'); assert.equal(op.onGamePage(), false);
  release();
  console.log('ok game page');
}
// 5. game launch while held: release during a game does not resume anything
{
  const t = setup(); const op = await fresh();
  const release = op.holdOtherMusic();
  t.g.SteamUIStore.RunningApps = [{ appid: 1 }];
  release();
  assert.equal(pref(t.g), 'true'); // setting restored, but ThemeDeck itself stays off during a game
  t.el.apply(); assert.equal(t.el.paused, true);
  assert.equal(t.calls.alPlay, 0);
  console.log('ok game launch');
}
// 6. crash recovery: a stale backup is healed on the next start; absent keys are removed again
{
  const t = setup(); const op = await fresh();
  t.g.localStorage.removeItem('themedeck:globalAmbientEnabled');
  op.holdOtherMusic();
  assert.equal(pref(t.g), 'false');
  const raw = t.g.localStorage.getItem('dht:themedeckPrefsBackup'); assert.ok(raw);
  const op2 = await fresh(); // new module instance = new session after a crash
  op2.restoreThemeDeckPrefs();
  assert.equal(pref(t.g), null);
  console.log('ok crash recovery');
}
// 7. ThemeDeck missing (and AudioLoader missing): nothing is written or thrown
{
  const t = setup({ themeDeck: false, audioLoader: false }); const op = await fresh();
  const release = op.holdOtherMusic();
  assert.equal(t.g.localStorage.length, 0); assert.equal(t.events.length, 0);
  release();
  assert.deepEqual(op.musicPluginsSeen(), []);
  console.log('ok ThemeDeck missing');
}
console.log('all other-plugins checks passed');
process.exit(0);
