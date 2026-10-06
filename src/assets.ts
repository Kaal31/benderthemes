// Image sets shipped with the plugin (defaults/assets/<set>): the RetroArch
// monochrome XMB icons, and in personal test builds extra sets such as the
// Xbox 360 dashboard icons. Themes fall back to their own drawn icons when a
// set or an image is missing.
import { callable } from "@decky/api";
import { useEffect, useState } from "react";

type AssetSet = Record<string, string>; // name → data URL
const backendAssets = callable<[name: string], AssetSet>("get_assets");
const cache = new Map<string, AssetSet>();
const pending = new Map<string, Promise<AssetSet>>();

export function loadAssets(name: string): Promise<AssetSet> {
  const hit = cache.get(name);
  if (hit) return Promise.resolve(hit);
  let p = pending.get(name);
  if (!p) {
    p = backendAssets(name)
      .then((r) => r ?? {})
      .catch(() => ({}))
      .then((r) => {
        cache.set(name, r);
        pending.delete(name);
        return r;
      });
    pending.set(name, p);
  }
  return p;
}

export function useAssets(name: string): AssetSet {
  const [set, setSet] = useState<AssetSet>(() => cache.get(name) ?? {});
  useEffect(() => {
    let alive = true;
    loadAssets(name).then((r) => alive && setSet(r));
    return () => {
      alive = false;
    };
  }, [name]);
  return set;
}
