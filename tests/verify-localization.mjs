import assert from 'node:assert/strict';
import fs from 'node:fs';
import ts from 'typescript';
import {build} from 'esbuild';

const en=JSON.parse(fs.readFileSync('src/localizations/en.json','utf8'));
const pt=JSON.parse(fs.readFileSync('src/localizations/pt-br.json','utf8'));
assert.deepEqual(Object.keys(pt).sort(),Object.keys(en).sort(),'Catalog keys must match');
const placeholders=text=>[...text.matchAll(/\{(\w+)\}/g)].map(m=>m[1]).sort();
for(const key of Object.keys(en)) {
  assert.equal(typeof pt[key],'string');
  assert.ok(pt[key].length,key+' must not be empty');
  assert.deepEqual(placeholders(pt[key]),placeholders(en[key]),key+' placeholders');
}
const files=fs.readdirSync('src',{recursive:true}).filter(f=>/\.(ts|tsx)$/.test(f)).map(f=>'src/'+f);
const program=ts.createProgram(files,{allowSyntheticDefaultImports:true,resolveJsonModule:true,jsx:ts.JsxEmit.React,moduleResolution:ts.ModuleResolutionKind.Node10});
const checker=program.getTypeChecker();
const missing=[];
for(const filename of files) {
  const source=program.getSourceFile(filename);
  const translators=new Set(),hooks=new Set();
  for(const statement of source.statements) {
    if(!ts.isImportDeclaration(statement)||!/(^|\/)i18n$/.test(statement.moduleSpecifier.text))continue;
    const clause=statement.importClause;
    if(clause?.name)translators.add(checker.getSymbolAtLocation(clause.name));
    for(const binding of clause?.namedBindings?.elements??[]) {
      const imported=binding.propertyName?.text??binding.name.text;
      if(['t','lang'].includes(imported))translators.add(checker.getSymbolAtLocation(binding.name));
      if(imported==='useLocalization')hooks.add(checker.getSymbolAtLocation(binding.name));
    }
  }
  function register(node) {
    if(ts.isVariableDeclaration(node)&&ts.isIdentifier(node.name)&&node.initializer&&ts.isCallExpression(node.initializer)&&hooks.has(checker.getSymbolAtLocation(node.initializer.expression)))translators.add(checker.getSymbolAtLocation(node.name));
    ts.forEachChild(node,register);
  }
  register(source);
  function visit(node) {
    if(ts.isCallExpression(node)&&ts.isIdentifier(node.expression)&&translators.has(checker.getSymbolAtLocation(node.expression))) {
      const key=node.arguments[0];
      if(key&&ts.isStringLiteralLike(key)&&!Object.hasOwn(en,key.text))missing.push(`${filename}:${source.getLineAndCharacterOfPosition(key.pos).line+1}: ${key.text}`);
    }
    ts.forEachChild(node,visit);
  }
  visit(source);
}
assert.deepEqual(missing,[],'Every literal translation lookup must exist in English');
const result=await build({entryPoints:['src/i18n.ts'],bundle:true,platform:'node',format:'esm',write:false});
const api=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
for(const locale of ['pt-br','pt-BR','PT-BR','pt_BR','ptBr','brazilian']) {
  globalThis.window={LocalizationManager:{m_rgLocalesToUse:[locale]}};
  assert.equal(api.getCurrentLanguage(),'ptBr',locale);
  assert.equal(api.t('play'),pt.play,locale);
}
for(const locale of [undefined,null,42,'','en-US','french']) {
  globalThis.window={LocalizationManager:{m_rgLocalesToUse:[locale]}};
  assert.equal(api.getCurrentLanguage(),'en');
}
delete globalThis.window;
assert.equal(api.t('play'),en.play);
assert.equal(api.t('themeAdded',{name:'$& {count}'}),en.themeAdded.replace('{name}',()=>'$& {count}'));
assert.equal(api.t('Unknown legacy label'),'Unknown legacy label');
assert.equal(api.t('toString'),'toString');
console.log(`PASS localization: ${Object.keys(en).length} catalog keys, source lookups, placeholders, locale normalization and interpolation`);
