import {readFile} from 'node:fs/promises';
import {transform} from 'esbuild';
import {chromium} from 'playwright';
import assert from 'node:assert/strict';
const s=await readFile('src/keyboardDiagnostics.ts','utf8');
const part=s.slice(s.indexOf('export function keyboardNodeState'),s.indexOf('export function startKeyboardDiagnostics'));
const {code}=await transform(part.replace('export ',''),{loader:'ts'});
const b=await chromium.launch();try{const p=await b.newPage();await p.setContent('<input value="PRIVATE-MESSAGE" aria-label="PRIVATE-LABEL" id="PRIVATE-ID" class="keyboard" data-dht-foot="visibility:PRIVATE-ATTRIBUTE" style="visibility:hidden;width:300px;height:60px">');await p.addScriptTag({content:code});const state=await p.evaluate(()=>keyboardNodeState(document.querySelector('input')));assert.equal(state.visibility,'hidden');assert.equal(state.footerHidden,true);assert.equal(state.rect[2],300);assert.ok(!JSON.stringify(state).includes('PRIVATE'));console.log('PASS geometry, visibility, marker capture; input values, labels, IDs and attribute contents excluded');}finally{await b.close();}

