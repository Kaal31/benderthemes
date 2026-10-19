import { mkdtempSync, writeFileSync, readFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import assert from 'node:assert/strict';
const dir = mkdtempSync(join(tmpdir(), 'themehub-native-'));
try {
  const entry = join(dir, 'theme.tsx'), output = join(dir, 'native.js');
  writeFileSync(entry, `import React from 'react'; import {asset} from 'themehub/native'; function Home(){return <img src={asset('assets/car.png')}/>;} export default {Home};`);
  execFileSync(process.execPath, ['tools/build_native_theme.mjs', entry, output]);
  const code = readFileSync(output, 'utf8');
  const React = { createElement: (...args) => args };
  const module = new Function('host', code)({ React, asset: path => 'local/' + path });
  assert.equal(typeof module.Home, 'function');
  assert.deepEqual(module.Home(), ['img', { src: 'local/assets/car.png' }]);
  console.log('PASS: TSX native builder uses host React and host asset API');
} finally { rmSync(dir, { recursive: true, force: true }); }
