import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { transform } from 'esbuild';

async function load(source) {
  const { code } = await transform(source, { loader: 'ts', format: 'esm' });
  return import(`data:text/javascript;base64,${Buffer.from(code).toString('base64')}`);
}
const source = await readFile(new URL('../src/performance.ts', import.meta.url), 'utf8');
const { frameLoop } = await load(source.slice(source.indexOf('export function frameLoop')));
const { BoundedCache } = await load(await readFile(new URL('../src/boundedCache.ts', import.meta.url), 'utf8'));
const doc = new EventTarget(), reduced = new EventTarget();
doc.hidden = false; reduced.matches = false;
const queue = new Map(); let id = 0, count = 0, moving = false, active = true, invalidateInDraw = false;
doc.defaultView = {
  matchMedia: () => reduced,
  requestAnimationFrame: f => { queue.set(++id, f); return id; },
  cancelAnimationFrame: id => queue.delete(id),
};
function tick(now) { const pending = [...queue.values()]; queue.clear(); pending.forEach(f => f(now)); }
const loop = frameLoop({ ownerDocument: doc }, () => { count++; if (invalidateInDraw) { invalidateInDraw = false; loop.invalidate(); } }, () => moving, () => active);
tick(0); assert.equal(count, 1); assert.equal(queue.size, 0, 'static scene must stop');
loop.invalidate(); loop.invalidate(); assert.equal(queue.size, 1, 'coalesce invalidations');
tick(10); assert.equal(count, 2); assert.equal(queue.size, 0);
moving = true; loop.invalidate(); tick(20); tick(30); assert.equal(count, 3, 'cap moving render rate');
tick(55); assert.equal(count, 4);
doc.hidden = true; doc.dispatchEvent(new Event('visibilitychange')); assert.equal(queue.size, 0);
loop.invalidate(); assert.equal(queue.size, 0, 'hidden texture completion must not restart');
doc.hidden = false; doc.dispatchEvent(new Event('visibilitychange')); tick(80); assert.equal(count, 5);
active = false; loop.invalidate(); assert.equal(queue.size, 0, 'covered theme must stop');
active = true; loop.invalidate(); tick(90); assert.equal(count, 6);
reduced.matches = true; reduced.dispatchEvent(new Event('change')); tick(100); assert.equal(queue.size, 0);
invalidateInDraw = true; loop.invalidate(); tick(110); assert.equal(queue.size, 1, 'async/static invalidation during draw survives');
tick(120); assert.equal(queue.size, 0);
loop.dispose(); loop.invalidate(); doc.dispatchEvent(new Event('visibilitychange')); assert.equal(queue.size, 0);

const cache = new BoundedCache(2, 10, value => value.length);
cache.set('a', 'aaaa').set('b', 'bbbb'); cache.get('a'); cache.set('c', 'cccc');
assert.equal(cache.has('b'), false, 'evict least recently used');
cache.set('a', 'a'); cache.set('c', '123456789'); assert.equal(cache.size, 2);
cache.set('d', 'dd'); assert.equal(cache.has('a'), false); assert.equal(cache.has('c'), false, 'byte budget enforced');
cache.set('d', '12345678901'); assert.equal(cache.has('d'), false, 'oversized replacement is not retained');
cache.set('e', 'e'); cache.clear(); cache.set('f', '1234567890'); assert.equal(cache.size, 1, 'clear resets accounting');
console.log('PASS: static/animated frames, FPS cap, hidden/covered pause, resume, reduced motion, coalescing, disposal and cache budgets.');
