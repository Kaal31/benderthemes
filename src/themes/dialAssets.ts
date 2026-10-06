import { callable } from "@decky/api";
const fetchAsset = callable<[string], string | null>("get_dial_asset");
const assets = new Map<string, Promise<string | null>>();
export function loadDialAsset(name: string) {
  let p = assets.get(name);
  if (!p) { p = fetchAsset(name).catch(() => null); assets.set(name, p); }
  return p;
}
