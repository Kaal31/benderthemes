// The avatar model cache key must tell two exports apart even when they have the same length and the same tail
// (GLBs of one exporter end with the same padding); the old key was length + last 64 characters.
// Plain Node (type stripping): no browser needed.
import { modelKey } from '../src/themes/modelKey.ts';
import assert from 'node:assert/strict';
const pad = 'A'.repeat(200);
const a = 'data:model/gltf-binary;base64,' + 'QUJD' + 'x'.repeat(5000) + pad;
const b = 'data:model/gltf-binary;base64,' + 'QUJE' + 'x'.repeat(5000) + pad;
assert.equal(a.length, b.length);
assert.equal(a.slice(-64), b.slice(-64));
assert.notEqual(modelKey(a), modelKey(b));
assert.equal(modelKey(a), modelKey(a.slice()));
// a big model is hashed once and then looked up
const big = 'data:model/gltf-binary;base64,' + 'Zm9v'.repeat(2000000);
let t = performance.now(); modelKey(big); const first = performance.now() - t;
t = performance.now(); for (let i = 0; i < 1000; i++) modelKey(big); const again = performance.now() - t;
assert.ok(first < 500 && again < 50, `${first} ${again}`);
for (let i = 0; i < 20; i++) modelKey(pad + i); // the memo stays small and keeps working after it is cleared
assert.notEqual(modelKey(a), modelKey(b));
console.log('model key ok');
