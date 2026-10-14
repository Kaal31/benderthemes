import type {Settings,ThemeId} from "./settings";

/** Fixed theme backdrops, not desktop windows or dynamically opened panels. */
export const FIXED_BACKGROUND_PAGES:Partial<Record<ThemeId,readonly string[]>>={
  nazarick:["home","library","store","friends","downloads","settings"],
};
export function backgroundPage(theme:ThemeId,page:string):string {
  if(theme==="nazarick") {
    if(page==="qam")return "settings";
    if(["search","game","achievements"].includes(page))return "library";
    if(page==="community")return "friends";
  }
  return page;
}
export function pageBackgroundRef(s:Settings,theme:ThemeId,page:string):string|undefined {
  const key=backgroundPage(theme,page),look=s.activeTheme||theme;
  const own=s.mix?.[look]?.[`wallpaper:${key}`];
  if(own!==undefined)return own==="none"?"":own;
  // A legacy shared custom choice belongs to Home only; other pages retain their defaults.
  if(key==="home")return s.mix?.[look]?.wallpaper??(s.wallpapers[theme]?`@wp/${s.wallpapers[theme]}`:undefined);
  return undefined;
}
