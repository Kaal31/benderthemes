// User-supplied console skins, read on the Deck by the backend:
//  • PS3 .p3t theme files  → XMB background + category icons
//  • PS Vita custom themes (folder or .zip with theme.xml) → page wallpapers + system bubble icons
// Nothing from these files is bundled with the plugin.
import { callable } from "@decky/api";
import { useEffect, useState } from "react";
import { getSettings, useSettings } from "./settings";
import { onResourcesChanged } from "./marketplaceState";

export interface VitaSkin {
  name: string;
  pages: string[]; // data URLs, one per home page
  icons: Record<string, string>; // e.g. psstore, friend, settings, browser, photo, near, contentManager
  barColor?: string;
}
export interface P3tSkin {
  name: string;
  backgrounds: string[]; // data URLs (first = main background)
  icons: Record<string, string>; // icon_user, icon_setting, icon_game …
}

const getVita = callable<[name: string], VitaSkin | null>("get_vita_skin");
const getP3t = callable<[name: string], P3tSkin | null>("get_p3t");
export const listSkins = callable<[], { p3t: string[]; vita: string[]; dir: string }>("list_skins");

type Override = { vita?: (n: string) => VitaSkin | null; p3t?: (n: string) => P3tSkin | null };
let override: Override = {};
export function setSkinOverride(o: Override) {
  override = o;
}

const vitaCache = new Map<string, VitaSkin | null>();
const p3tCache = new Map<string, P3tSkin | null>();
onResourcesChanged(() => { vitaCache.clear(); p3tCache.clear(); });

function useSkin<T>(name: string, cache: Map<string, T | null>, load: (n: string) => Promise<T | null>, ov?: (n: string) => T | null): T | null {
  const [v, setV] = useState<T | null>(name ? cache.get(name) ?? null : null);
  useEffect(() => {
    if (!name) return setV(null);
    if (ov) return setV(ov(name));
    if (cache.has(name)) return setV(cache.get(name)!);
    let alive = true;
    load(name)
      .then((r) => {
        cache.set(name, r ?? null);
        if (alive) setV(r ?? null);
      })
      .catch(() => alive && setV(null));
    return () => {
      alive = false;
    };
  }, [name]);
  return v;
}

export function useVitaSkin(): VitaSkin | null {
  const s = useSettings();
  return useSkin(s.vita.skin, vitaCache, getVita, override.vita);
}
export function useP3t(): P3tSkin | null {
  const s = useSettings();
  return useSkin(s.xmb.p3t, p3tCache, getP3t, override.p3t);
}
export const currentP3t = () => getSettings().xmb.p3t;
