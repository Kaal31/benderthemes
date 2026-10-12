// Nintendo Switch home-menu themes (.nxtheme), read on the Deck by py_modules/switch_themes.py.
// A .nxtheme holds the art for one Switch screen (wallpaper + a few round icons); a full theme is
// several files that share a name, and the backend groups them. Nothing from Nintendo is needed.
import { callable } from "@decky/api";
import { useEffect, useState } from "react";
import { getSettings, themeFx, useSettings } from "./settings";
import { onResourcesChanged } from "./marketplaceState";

export interface SwitchScreen {
  file: string;
  name: string;
  author: string;
  target: string; // home, apps, set, lock …
  label: string;
  layoutInfo: string;
  background: string | null; // data URL
  icons: Record<string, string>; // album, news, shop, controller, settings, power
  brightness?: number; // average brightness 0..1 when the backend could tell (DDS wallpapers)
  preview?: string;
  errors: string[];
}
export interface SwitchSkin {
  name: string;
  author: string;
  file: string;
  screens: Record<string, SwitchScreen>;
  otherScreens: string[]; // screens the theme has that the home does not draw (lock, news, user page …)
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
