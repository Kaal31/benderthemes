// Rebuild the local 3D dependency and make a standalone importable theme ZIP.
import { build } from 'esbuild';
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
const dir = 'themes/block-worlds-frame';
writeFileSync(`${dir}/theme-bridge.js`,readFileSync('sdk/theme-bridge.js'));

const source = readFileSync('src/themes/MinecraftPlayer.tsx','utf8');
const skin = source.slice(source.indexOf('export function defaultSkin'),source.indexOf('export function MinecraftPlayer')).replace('export function','function');
await build({ stdin:{contents:`import {SkinViewer,IdleAnimation} from 'skinview3d'; import * as THREE from 'three';\n${skin}\nwindow.BlockAvatar={SkinViewer,IdleAnimation,defaultSkin,THREE};`,loader:'ts',resolveDir:process.cwd()},bundle:true,format:'iife',minify:true,outfile:`${dir}/avatar-vendor.js`,legalComments:'eof' });
const font = readFileSync('src/themes/minecraftFont.ts','utf8').match(/base64,([^"']+)/)[1];
writeFileSync(`${dir}/block-worlds.woff2`,Buffer.from(font,'base64'));
writeFileSync(`${dir}/THIRD-PARTY-NOTICES.txt`, ['skinview3d','skinview-utils','three'].map(name => `${name}\n${readFileSync(`node_modules/${name}/LICENSE`,'utf8')}`).join('\n\n'));
mkdirSync('out',{recursive:true});
execFileSync(process.env.PYTHON || 'python',['-c',`from pathlib import Path
import zipfile
root=Path('${dir}')
with zipfile.ZipFile('out/BlockWorlds-Frame-Test.zip','w',zipfile.ZIP_DEFLATED) as z:
 for p in sorted(root.rglob('*')):
  if p.is_file(): z.write(p,p.relative_to(root).as_posix())
print('out/BlockWorlds-Frame-Test.zip')`],{stdio:'inherit'});
