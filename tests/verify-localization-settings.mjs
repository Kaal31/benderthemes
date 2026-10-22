import assert from 'node:assert/strict';
import {build} from 'esbuild';
const result=await build({stdin:{contents:'export {style,setStyle,THEME_STYLES} from "./src/engine/themeStyles";export {seedSettings,getSettings} from "./src/settings";export {factory,applyDiff} from "./src/lookState";export {switchStandardDark,switchPageVars} from "./src/themes/switchStandardSkin";',resolveDir:process.cwd()},bundle:true,write:false,platform:'node',format:'esm',alias:{'@decky/api':'./preview/stubs/api.ts'}});
globalThis.window={};
const api=await import('data:text/javascript;base64,'+Buffer.from(result.outputFiles[0].text).toString('base64'));
for(const [styles,dark] of [[{standardSkin:'black'},true],[{standardSkin:'white',themeColor:'dark'},false],[{themeColor:'dark'},true]]) {
  api.seedSettings({theme:'switch',switchTheme:'',styles:{switch:styles}});
  assert.equal(api.style(api.getSettings(),'switch','themeColor'),dark?'dark':'light');
  assert.equal(api.switchStandardDark(api.getSettings()),dark);
}
api.setStyle('switch','themeColor','light');
assert.equal(api.getSettings().styles.switch.standardSkin,'white');
assert.equal(api.getSettings().styles.switch.themeColor,undefined);
api.setStyle('switch','standardSkin','black');
api.seedSettings(JSON.parse(JSON.stringify(api.getSettings())));
assert.equal(api.switchStandardDark(api.getSettings()),true,'Existing black preference survives reload');
assert.equal(api.factory('switch-dark','').styles.switch.standardSkin,'black');
const override=api.applyDiff(api.getSettings(),'switch-dark',{styles:{switch:{standardSkin:'white'}}});
assert.equal(override.styles.switch.standardSkin,'white','Saved preset overrides the look default');
api.seedSettings({theme:'switch',switchTheme:'imported.nxtheme',styles:{switch:{standardSkin:'black'}}});
assert.equal(api.switchStandardDark(api.getSettings()),false,'Built-in dark style does not override imports');
assert.equal(api.switchPageVars(api.getSettings())['--dht-switch-accent'],undefined,'Imported accent remains intact');
assert.equal(api.THEME_STYLES.switch.filter(o=>['themeColor','standardSkin'].includes(o.key)).length,1,'One color setting');
console.log('PASS Switch localization settings: old and PR preferences, reload, look defaults, saved overrides and imported themes');
