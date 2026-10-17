// Compile an author-owned TSX entry to a Native API v1 factory body.
import { build } from 'esbuild';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
const [entry, output] = process.argv.slice(2);
if (!entry || !output) throw new Error('Usage: node tools/build_native_theme.mjs path/to/theme.tsx path/to/native.js');
const result = await build({ entryPoints: [resolve(entry)], bundle: true, write: false, format: 'iife', globalName: 'NativeTheme', jsx: 'transform', target: 'es2020', plugins: [{
  name: 'themehub-host-react', setup(build) {
    build.onResolve({ filter: /^(react|themehub\/native)$/ }, args => ({ path: args.path, namespace: 'native-host' }));
    build.onLoad({ filter: /.*/, namespace: 'native-host' }, args => ({ contents: args.path === 'react'
      ? 'module.exports = host.React;'
      : 'module.exports = host;' }));
    build.onResolve({ filter: /^react-dom(?:\/.*)?$/ }, () => ({ errors: [{ text: 'Native layouts use ThemeHub React rendering; do not create a second React root.' }] }));
  }
}] });
mkdirSync(dirname(resolve(output)), { recursive: true });
writeFileSync(output, result.outputFiles[0].text + '\nreturn NativeTheme.default;\n');
console.log(output);
