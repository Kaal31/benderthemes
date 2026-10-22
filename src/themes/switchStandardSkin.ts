import type {CSSProperties} from "react";
import type {Settings} from "../settings";

/** Shared system palette for the built-in Switch home and its destinations. */
export const SWITCH_STANDARD_PALETTES={
  white:{bg:"#ebebeb",panel:"#fff",ink:"#2d2d2d",sub:"#6c6c6c",line:"#d2d2d2",blue:"#3246e6",icon:"#4a4a4a",progress:"#dcdcdc"},
  black:{bg:"#2d2d2d",panel:"#383838",ink:"#fff",sub:"#c2c2c2",line:"#606060",blue:"#62dcf0",icon:"#ededed",progress:"#555"},
};
export const switchStandardDark=(s:Settings)=>!s.switchTheme&&s.styles?.switch?.standardSkin==="black";
export const switchStandardPalette=(s:Settings)=>SWITCH_STANDARD_PALETTES[switchStandardDark(s)?"black":"white"];
export function switchPageVars(s:Settings):CSSProperties{
  if(s.theme!=="switch")return {};
  const p=switchStandardPalette(s);
  return {"--sw-bg":p.bg,"--sw-panel":p.panel,"--sw-ink":p.ink,"--sw-sub":p.sub,"--sw-line":p.line,"--sw-blue":p.blue,"--sw-icon":p.icon,"--sw-progress":p.progress} as CSSProperties;
}
