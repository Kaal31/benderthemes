// Nintendo Switch home-menu themes (.nxtheme), read on the Deck by py_modules/switch_themes.py.
// A .nxtheme holds the art for one Switch screen (wallpaper + a few round icons); a full theme is
// several files that share a name, and the backend groups them. Recognized layout / animation
// patches become a semantic scene; unsupported firmware details are reported.
import { callable, openFilePicker, toaster } from "@decky/api";
import { useEffect, useState } from "react";
import { getSettings, themeFx, useSettings, updateSettings } from "./settings";
import { onResourcesChanged, resourcesChanged } from "./marketplaceState";

export interface SwitchScreen {
  file: string;
  name: string;
  author: string;
  target: string; // home, apps, set, lock â€¦
  label: string;
  layoutInfo: string;
  background: string | null; // data URL
  icons: Record<string, string>; // album, news, shop, controller, settings, power
  brightness?: number; // average brightness 0..1 when the backend could tell (DDS wallpapers)
  preview?: string;
  errors: string[];
  conversion?: SwitchConversion;
}
export interface SwitchPane { Position?: {X?:number;Y?:number;Z?:number}; Size?: {X?:number;Y?:number}; Scale?: {X?:number;Y?:number}; Rotation?: {X?:number;Y?:number;Z?:number}; Visible?:boolean }
export interface SwitchTrack { property:number; interpolation:"hermite"|"step"; keys:{frame:number;value:number;slope:number}[] }
export interface SwitchAnimation { source?:string; pane:string; event:string; frames:number; loop:boolean; tracks:SwitchTrack[] }
export interface SwitchPicture {source:string;texture:string;material:string;uv:number[];wrapS:number;wrapT:number;transform:number[]}
export interface SwitchEffect extends SwitchPane {OriginX?:number;OriginY?:number;ParentOriginX?:number;ParentOriginY?:number;paletteState?:number;corners?:Record<string,number[]>;black?:number[];white?:number[];borderWidth?:number;radius?:number;shadow?:number;shadowFunction?:number;borderDraw?:boolean;shadowDraw?:boolean;borderOpacity?:number;shadowOpacity?:number;shadowAngle?:number;shadowDistance?:number;borderColor?:number[];shadowColor?:number[];palette?:{white?:number[];black?:number[];borderColor?:number[];shadowColor?:number[]};texture?:{scaleX:number;scaleY:number;repeatX:boolean;repeatY:boolean;nearest:boolean;mirrorX?:boolean;mirrorY?:boolean;minFilter?:number;magFilter?:number}}
export interface SwitchConversion {version:number;animationFiles?:string[];nativePictures?:Record<string,Record<string,SwitchPicture>>;nativeTextures?:Record<string,string>;nativeFonts?:Partial<Record<'standard'|'extended'|'extended2',{family:string;source:string;cellRatio?:number}>>;resourceWarnings?:string[];notes?:string[];ignoredProperties?:{file:string;pane:string;name:string;value:number;reason:string;profiles:string[]}[];ignoredTargets?:{file:string;kind:string;name:string;reason:string}[];nativePanes?:Record<string,Record<string,SwitchEffect>>;nativeAnimations?:Record<string,SwitchAnimation[]>;nativeMaterials?:Record<string,Record<string,SwitchEffect>>;paneOrder?:Record<string,Record<string,number>>;childLockBackingBehindGames?:boolean;groups?:Record<string,string[]>;effects?:Record<string,SwitchEffect>;panes:Record<string,SwitchPane>;animations:SwitchAnimation[];converted:number;warnings:string[]}
export interface SwitchSkin {
  name: string;
  author: string;
  file: string;
  screens: Record<string, SwitchScreen>;
  otherScreens: string[]; // screens the theme has that the home does not draw (lock, news, user page â€¦)
  icons: Record<string, string>;
}
export interface SwitchListEntry { id: string; name: string; author: string; screens: string[] }

export const listSwitchThemes = callable<[], { themes: SwitchListEntry[]; dir: string }>("list_switch_themes");
const getSwitch = callable<[name: string], SwitchSkin | null>("get_switch_skin");

const cache = new Map<string, SwitchSkin | null>();
const listeners = new Set<() => void>();
onResourcesChanged(() => { cache.clear(); listeners.forEach((fn) => fn()); });

/** ThemeFx key of a Switch theme file (its toggles are saved per file). */
export const switchFxKey = (file: string) => (file ? `nx:${file}` : "");

/** The selected .nxtheme set (null when none, or while it loads). */
export function useSwitchSkin(): SwitchSkin | null {
  const name = useSettings().switchTheme ?? "";
  const [skin, setSkin] = useState<SwitchSkin | null>(name ? cache.get(name) ?? null : null);
  const [rev, setRev] = useState(0);
  useEffect(() => { const fn = () => setRev((r) => r + 1); listeners.add(fn); return () => { listeners.delete(fn); }; }, []);
  useEffect(() => {
    if (!name) return setSkin(null);
    if (cache.has(name)) return setSkin(cache.get(name)!);
    let alive = true;
    getSwitch(name).then((r) => { cache.set(name, r ?? null); if (alive) setSkin(r ?? null); }).catch(() => alive && setSkin(null));
    return () => { alive = false; };
  }, [name, rev]);
  return skin && skin.file === name ? skin : null; // not the previous theme's skin while the new one loads
}

/** What a screen shows for the current toggles. "Theme wallpaper" off = built-in look; "Other screens' wallpapers" off =
 *  the All software / Settings screens use the home wallpaper instead of their own. */
export function switchParts(skin: SwitchSkin | null, screen: "home" | "apps" | "set" | "lock") {
  const none = { background: null as string | null, icons: {} as Record<string, string>, brightness: undefined as number | undefined, own: false };
  if (!skin) return none;
  const fx = themeFx(getSettings(), switchFxKey(skin.file));
  const home = skin.screens.home ?? Object.values(skin.screens)[0];
  const own = screen !== "home" && fx.visuals ? skin.screens[screen] : undefined;
  const pic = own?.background ? own : home;
  if (!fx.background) return { ...none, icons: fx.icons ? skin.icons : {} };
  return { background: pic?.background ?? null, icons: fx.icons ? skin.icons : {}, brightness: pic?.brightness, own: !!own?.background };
}

/** One-off read of a Switch theme set (presets v2: its wallpaper can fill another look's background slot). */
export async function loadSwitchSkin(name: string): Promise<SwitchSkin | null> {
  if (!name) return null;
  if (cache.has(name)) return cache.get(name)!;
  const r = (await getSwitch(name).catch(() => null)) ?? null;
  cache.set(name, r);
  return r;
}

const importConsoleTheme = callable<[path:string],{success:boolean;file?:string;count?:number;error?:string}>("import_switch_theme");
const importMenuResources = callable<[path:string],{success:boolean;resource?:string;fonts?:number;textures?:number;panes?:number;warnings?:string[];error?:string}>("import_switch_resources");
export async function importSwitchResources(){
 try{
  const picked=await openFilePicker(0 as any,'/home/deck/Downloads',true,true,undefined,['szs','ttf','otf','bfttf','bfotf']);
  if(!picked?.realpath)return;
  const result=await importMenuResources(picked.realpath);
  if(!result.success){toaster.toast({title:'Switch resources import failed',body:result.error??'Invalid menu archive'});return;}
  cache.clear();resourcesChanged();
  toaster.toast({title:'Switch resources imported',body:result.fonts?`${result.resource}: local font loaded.`:`${result.resource}: ${result.textures} textures, ${result.panes} pane bindings. ${result.warnings?.length??0} GPU texture formats remain unavailable.`});
 }catch(error){toaster.toast({title:'Switch resources import failed',body:String(error)});}
}
export async function importSwitchThemeFile() {
  try {
    const picked=await openFilePicker(0 as any,"/home/deck/Downloads",true,true,undefined,["nxtheme","zip"]);
    if (!picked?.realpath) return;
    const result=await importConsoleTheme(picked.realpath);
    if (!result.success || !result.file) { toaster.toast({title:"Switch theme import failed",body:result.error??"Invalid theme"});return; }
    cache.clear(); resourcesChanged();
    updateSettings({switchTheme:result.file});
    toaster.toast({title:"Switch theme imported",body:`${result.count??1} console theme file(s). Open Options for the conversion report.`});
  } catch(error) { toaster.toast({title:"Switch theme import failed",body:String(error)}); }
}
