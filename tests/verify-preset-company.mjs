import {build} from 'esbuild';import assert from 'node:assert/strict';
const code=await build({stdin:{contents:'export {presetPickerState,getPresets,applyPreset} from "./src/presets";export {seedSettings,getSettings,updateSettings} from "./src/settings";',resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'esm',alias:{'@decky/api':'./preview/stubs/api.ts'}});
globalThis.window={};const m=await import('data:text/javascript;base64,'+Buffer.from(code.outputFiles[0].text).toString('base64'));
m.seedSettings({theme:'ps3'});
for(const company of ['Microsoft','Bonus','Sony']){
 m.updateSettings({presetCompany:company});let state=m.presetPickerState(m.getSettings(),m.getPresets());assert.equal(state.company,company);assert.ok(state.options.some(o=>o.data===state.selected));assert.equal(m.getSettings().theme,'ps3');
 m.seedSettings(JSON.parse(JSON.stringify(m.getSettings())));assert.equal(m.presetPickerState(m.getSettings(),m.getPresets()).company,company);
}
m.updateSettings({presetCompany:'Bonus'});const preset=m.getPresets().find(p=>p.theme==='pain');m.applyPreset(preset);assert.equal(m.presetPickerState(m.getSettings(),m.getPresets()).selected,preset.id);
console.log('PASS: company browsing preserves active theme, dropdown selection always valid, persisted choice survives reload, new preset activates.');
