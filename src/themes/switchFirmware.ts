import type {SwitchPane} from "../switchThemes";
import {FIRMWARE_DEFAULTS} from "./switchFirmwareDefaults";
export type SwitchFirmwareProfile="auto"|"classic"|"modern";
/** Apply differential patches to measured geometry; this does not execute firmware. */
export function firmwarePanes(imported:Record<string,SwitchPane>,profile:SwitchFirmwareProfile):Record<string,SwitchPane>{
 const modern=profile==="modern"||(profile==="auto"&&!!(imported.L_BtnSplay||imported.L_BtnVgc));
 const defaults=FIRMWARE_DEFAULTS[modern?"modern":"classic"];
 const result:Record<string,SwitchPane>={};
 for(const key of new Set([...Object.keys(defaults),...Object.keys(imported)])){
  const patch=imported[key];result[key]={...(key==='L_BtnLR'&&patch?FIRMWARE_DEFAULTS.modern.L_BtnLR:defaults[key]),...patch};

 }
 if(!modern){if(profile==='classic'||!imported.L_BtnLR)delete result.L_BtnLR;delete result.L_BtnSplay;delete result.L_BtnVgc;}
 return result;
}
