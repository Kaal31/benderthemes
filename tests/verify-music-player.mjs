// The shared music player (src/musicPlayer.ts) against a fake Audio and a fake clock, no browser needed:
// next track at the end, unplayable files, the end of the album, repeat, shuffle, crossfade with next/prev, pause and
// seek during a fade, holds (videos), and the settings the player keeps (shuffle / repeat / crossfade).
//   node tests/verify-music-player.mjs
import { build } from 'esbuild';
import assert from 'node:assert/strict';

// ---- fake Steam window: Audio elements and timers on one clock
const clock = { now: 0, timers: [], seq: 0 };
const audios = [];
let durations = {}; // url -> seconds; "bad:" urls fail to load
class FakeAudio {
  constructor() { this.listeners = {}; this.src = ''; this.currentTime = 0; this.duration = NaN; this.paused = true; this.ended = false; this.volume = 1; this.error = null; this.preload = ''; audios.push(this); }
  addEventListener(t, f) { (this.listeners[t] ??= []).push(f); }
  fire(t) { for (const f of this.listeners[t] ?? []) f(); }
  set src(v) { this._src = v; this.currentTime = 0; this.ended = false; this.error = null; this.duration = NaN; this.loaded = false; if (v) this.paused = true; }
  get src() { return this._src; }
  removeAttribute(a) { if (a === 'src') this._src = ''; }
  load() { this.duration = NaN; }
  play() {
    if (!this._src) return Promise.reject(Object.assign(new Error('no src'), { name: 'NotSupportedError' }));
    if (this._src.startsWith('bad:')) {
      const me = this._src;
      at(30, () => { if (this._src === me) { this.error = { code: 4 }; this.fire('error'); } });
      return Promise.reject(Object.assign(new Error('unsupported'), { name: 'NotSupportedError' }));
    }
    if (this.paused) { this.paused = false; this.ended = false; this.fire('play'); }
    if (!this.loaded) { this.loaded = true; this.duration = durations[this._src] ?? 10; this.fire('loadedmetadata'); }
    return Promise.resolve();
  }
  pause() { if (!this.paused) { this.paused = true; this.fire('pause'); } }
}
function at(ms, f) { clock.timers.push({ t: clock.now + ms, f, id: ++clock.seq }); return clock.seq; }
const win = {
  Audio: FakeAudio,
  setTimeout: (f, ms) => at(ms, f),
  clearTimeout: (id) => { clock.timers = clock.timers.filter((t) => t.id !== id); },
  setInterval: (f, ms) => { const id = ++clock.seq; clock.timers.push({ t: clock.now + ms, f, id, iv: ms }); return id; },
  clearInterval: (id) => { clock.timers = clock.timers.filter((t) => t.id !== id); },
};
/** Let `sec` seconds pass in 50 ms steps: playing elements advance, fire timeupdate, end. */
async function run(sec) {
  for (let k = 0; k < Math.round(sec * 20); k++) {
    clock.now += 50;
    for (const a of audios) {
      if (a.paused || !a._src || a._src.startsWith('bad:')) continue;
      a.currentTime = Math.min(a.duration, a.currentTime + 0.05);
      a.fire('timeupdate');
      if (a.currentTime >= a.duration - 1e-9 && !a.paused) { a.paused = true; a.ended = true; a.fire('pause'); a.fire('ended'); }
    }
    const due = clock.timers.filter((t) => t.t <= clock.now);
    clock.timers = clock.timers.filter((t) => t.t > clock.now);
    for (const t of due) { if (t.iv) clock.timers.push({ ...t, t: clock.now + t.iv }); t.f(); }
    await Promise.resolve();
  }
}

// ---- the module, with Steam / Decky stubbed
const saved = [];
const stubs = {
  '@decky/api': 'export const callable = (name) => async (...a) => { globalThis.__calls.push([name, ...a]); return name === "get_settings" ? null : true; };',
  './steam': 'export const duckMusic = (on) => globalThis.__duck.push(on); export const uiWindow = () => globalThis.__win;',
  './otherPlugins': 'export const holdOtherMusic = () => { globalThis.__others++; return () => globalThis.__others--; };',
};
globalThis.__calls = saved; globalThis.__duck = []; globalThis.__others = 0; globalThis.__win = win;
const bundled = await build({
  stdin: { contents: 'export * from "./src/musicPlayer"; export { getRawSettings, updateSettings } from "./src/settings";', resolveDir: process.cwd(), loader: 'ts' },
  bundle: true, write: false, platform: 'node', format: 'esm',
  plugins: [{ name: 'stubs', setup(b) {
    b.onResolve({ filter: /^(@decky\/api|\.\/steam|\.\/otherPlugins)$/ }, (a) => ({ path: a.path, namespace: 'stub' }));
    b.onLoad({ filter: /.*/, namespace: 'stub' }, (a) => ({ contents: stubs[a.path], loader: 'js' }));
  } }],
});
const M = await import('data:text/javascript;base64,' + Buffer.from(bundled.outputFiles[0].text).toString('base64'));
const P = M.musicPlayer;
const S = () => P.state();
const album = (id, n, opts = {}) => ({ id, name: id, source: 'local', appid: 0, cover: '', tracks: Array.from({ length: n }, (_, i) => ({ id: `${id}${i}`, title: `T${i + 1}`, file: `${i + 1}.mp3`, url: (opts.bad?.includes(i) ? 'bad:' : '') + `${id}/${i}`, size: 1, disc: opts.disc?.[i] ?? '' })) });
const live = () => audios.filter((a) => !a.paused && a._src);
const reset = () => { P.stop(); P.setShuffle(false); P.setRepeat('off'); P.setCrossfade(0); };
let pass = 0;
const ok = (m) => { pass++; console.log('PASS', m); };

// 1. the next track when one ends, also from a subfolder (disc), then stop after the last one
reset();
durations = {};
const A = album('a', 3, { disc: ['', 'CD2', 'CD2'] });
P.play(A, 0);
await run(0.2);
assert.equal(S().index, 0); assert.equal(S().playing, true);
const duckBefore = globalThis.__duck.length;
await run(10.2);
assert.equal(S().index, 1, 'the second track (in a subfolder) follows the first'); assert.equal(S().playing, true);
assert.equal(globalThis.__duck.length, duckBefore, 'no un-duck / re-duck of the theme music between two tracks');
assert.equal(globalThis.__others, 1, 'other plugins stay held between tracks');
await run(20.2);
assert.equal(S().playing, false, 'repeat off: stops after the last track'); assert.equal(S().index, 0, 'ready to play the album again from the start');
assert.equal(live().length, 0); assert.equal(globalThis.__others, 0, 'other plugins released at the end');
P.toggle(); await run(0.2); assert.equal(S().playing, true); assert.equal(S().index, 0);
ok('next track at the end, subfolder tracks, stop after the last one, play again from the start');

// 2. repeat all wraps, repeat one repeats
reset(); P.setRepeat('all'); P.play(A, 2); await run(10.2);
assert.equal(S().index, 0, 'repeat all: back to the first track'); assert.equal(S().playing, true);
P.setRepeat('one'); await run(10.1);
assert.equal(S().index, 0, 'repeat one: the same track again'); assert.equal(S().playing, true);
P.next(); assert.equal(S().index, 1, 'next still moves on with repeat one');
ok('repeat all / one');

// 3. unplayable files are skipped (also several in a row and the last one); all broken: stops with a message
reset();
const B = album('b', 5, { bad: [1, 2, 4] });
P.play(B, 0); await run(10.2); await run(1);
assert.equal(S().index, 3, 'two broken files in a row skipped'); assert.equal(S().playing, true);
await run(10.5);
assert.equal(S().playing, false, 'a broken last file: the album ends'); assert.equal(S().error, '');
const C = album('c', 3, { bad: [0, 1, 2] });
P.setRepeat('all'); P.play(C, 0); await run(2);
assert.equal(S().playing, false, 'nothing playable: no endless loop with repeat all'); assert.match(S().error, /can't be played|can be played/);
ok('unplayable files skipped; nothing playable stops with a message');

// 4. shuffle: every track once per round, current first, kept in the settings
reset(); durations = {};
P.setShuffle(true);
assert.equal(M.getRawSettings().musicShuffle, true, 'shuffle kept in the settings');
const D = album('d', 6);
P.play(D, 4);
const seen = [S().index];
for (let k = 0; k < 5; k++) { await run(10.05); seen.push(S().index); }
assert.equal(seen[0], 4); assert.deepEqual([...seen].sort(), [0, 1, 2, 3, 4, 5], 'each track once: ' + seen);
await run(10.1); assert.equal(S().playing, false, 'shuffle + repeat off stops after one round');
P.setRepeat('all'); P.play(D, 0);
for (let k = 0; k < 6; k++) await run(10.05);
assert.equal(S().playing, true, 'shuffle + repeat all: a new round');
M.updateSettings({ musicShuffle: false, musicRepeat: 'one', musicCrossfade: 30 }); // e.g. a menu or a restored file
assert.equal(S().shuffle, false); assert.equal(S().repeat, 'one'); assert.equal(S().crossfade, 12, 'crossfade capped at 12 s');
ok('shuffle order, rounds with repeat all, settings follow');

// 5. crossfade: the next track starts under the old one, volumes cross, one element remains
reset(); durations = {};
P.setCrossfade(4);
assert.equal(M.getRawSettings().musicCrossfade, 4);
const E = album('e', 3);
P.play(E, 0); await run(5.6);
assert.equal(S().index, 0); assert.equal(live().length, 1);
await run(0.6); // 4 s before the end
assert.equal(S().index, 1, 'the next track is shown as soon as it fades in'); assert.equal(S().fading, true);
assert.equal(live().length, 2, 'both tracks play during the fade');
await run(2);
const [o, n] = [audios.find((a) => a._src === 'e/0'), audios.find((a) => a._src === 'e/1')];
assert.ok(n.volume > 0.5 && n.volume < 1 && o.volume < 0.75 && o.volume > 0.05, `half way: in ${n.volume.toFixed(2)} out ${o.volume.toFixed(2)}`);
// pause during the fade: both stop, the fade holds; play: both go on
P.toggle(); assert.equal(live().length, 0); const vIn = n.volume; await run(1); assert.equal(n.volume, vIn, 'fade holds while paused');
assert.equal(globalThis.__others, 0, 'paused: other plugins may play');
P.toggle(); await run(0.1); assert.equal(live().length, 2);
await run(2.2);
assert.equal(S().fading, false); assert.equal(live().length, 1); assert.equal(live()[0]._src, 'e/1'); assert.equal(live()[0].volume, 1);
ok('crossfade overlaps two tracks with equal-power volumes; pause holds the fade');

// 6. next during a crossfade and seek during a crossfade
await run(5.9 - 2.2 - 0.1 + 0.2); // into the fade to track 3
assert.equal(S().fading, true); assert.equal(S().index, 2);
P.next(); // repeat off and no track after 3: nothing to do (the fade goes on)
assert.equal(S().index, 2);
P.setRepeat('all'); P.next(); // skip: the old track drops, the incoming one fades out quickly
assert.equal(S().index, 0); assert.equal(live().length, 2, 'a skip during a fade keeps just two tracks');
assert.ok(!live().some((a) => a._src === 'e/1'), 'the oldest track is gone');
await run(1.6); assert.equal(S().fading, false); assert.equal(live().length, 1);
P.seekTo(6.5); await run(0.1); // into the crossfade window: a fade starts by itself
assert.equal(S().fading, true); assert.equal(S().index, 1);
P.seekTo(4.5); assert.equal(S().fading, false, 'seek during a fade ends it on the new track'); assert.equal(live().length, 1); assert.equal(S().index, 1);
assert.ok(Math.abs(live()[0].currentTime - 4.5) < 0.01);
P.prev(); assert.equal(S().index, 1, 'prev after 3 s goes to the start of the track'); assert.ok(live()[0].currentTime < 0.1);
P.prev(); await run(0.05); assert.equal(S().index, 0, 'prev near the start: the previous track');
ok('next / prev / seek during a crossfade');

// 7. crossfade with repeat one and with shuffle; a broken incoming track during a fade
reset(); P.setCrossfade(3); P.setRepeat('one'); P.play(E, 1); await run(7.2);
assert.equal(S().fading, true); assert.equal(S().index, 1); assert.equal(live().length, 2, 'repeat one fades the track into itself');
reset(); P.setCrossfade(3); P.setShuffle(true); P.play(D, 2); const s2 = [2];
for (let k = 0; k < 5; k++) { await run(7.05); s2.push(S().index); }
assert.deepEqual([...s2].sort(), [0, 1, 2, 3, 4, 5], 'shuffle with crossfade: each once ' + s2);
reset(); P.setCrossfade(3); const F = album('f', 3, { bad: [1] }); P.play(F, 0); await run(7.2); await run(0.2);
assert.equal(S().index, 2, 'broken incoming track: skipped, the track after it fades in instead'); assert.equal(S().fading, true);
assert.deepEqual(live().map((a) => a._src).sort(), ['f/0', 'f/2'], 'the old track kept playing under it');
ok('crossfade with repeat one, shuffle and a broken incoming file');

// 8. a hold (a video) pauses everything and resumes it
reset(); P.setCrossfade(4); P.play(E, 0); await run(6.5);
const release = P.hold(); assert.equal(live().length, 0); assert.equal(S().playing, false);
await run(1); release(); await run(0.1); assert.equal(live().length, 2); assert.equal(S().playing, true);
P.stop(); assert.equal(live().length, 0); assert.equal(S().album, null); assert.equal(globalThis.__others, 0);
ok('hold and stop during a fade');

// settings are saved through the backend
await run(1); await new Promise((r) => setTimeout(r, 500));
assert.ok(saved.some(([n, s]) => n === 'set_settings' && 'musicCrossfade' in s), 'saved to the backend');
console.log(`all ${pass} music player checks passed`);
process.exit(0);
