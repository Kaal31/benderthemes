import {build} from 'esbuild';
import {fileURLToPath} from 'node:url';
import {resolve,dirname} from 'node:path';
import {writeFileSync} from 'node:fs';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const result=await build({entryPoints:[resolve(root,'tools/gamecube-startup-scene.mjs')],bundle:true,minify:true,legalComments:'none',format:'iife',write:false});
writeFileSync(resolve(root,'themes/gamecube/startup-scene.js'),result.outputFiles[0].text.replace(/[\t ]+$/gm,''));
