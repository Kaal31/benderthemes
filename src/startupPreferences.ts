import {getSettings,Settings} from "./settings";
/** Kept outside preset look data so changing a preset cannot re-enable an intro. */
export function startupIntroEnabled(s:Settings=getSettings(),theme:string=s.activeTheme||s.theme){
 return s.themeStartupIntros?.[theme]!==false;
}
export function hubStartupEnabled(s:Settings=getSettings()){
 return s.hubStartupAnimation===true||s.hubStartupSeen===false;
}
