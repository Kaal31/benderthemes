import { useSyncExternalStore } from "react";

export const isProtonDbPluginName = (name: string) => /^(ProtonDB Badges|protondb-decky)$/i.test(name);
let previewNames: readonly string[] | null = null;
export function loadedPluginNames(): string[] {
  if (previewNames !== null) return [...previewNames];
  const names = new Set<string>();
  const g = globalThis as any;
  const windows = [g];
  try {
    const ui = g.SteamUIStore?.GetFocusedWindowInstance?.()?.BrowserWindow;
    if (ui && ui !== g) windows.push(ui);
  } catch { /* A closing Steam window. */ }
  for (const w of windows) {
    try {
      const plugins = w.DeckyPluginLoader?.plugins;
      if (Array.isArray(plugins)) for (const p of plugins) if (typeof p?.name === "string") names.add(p.name);
    } catch { /* Unavailable loader means not detected. */ }
  }
  return [...names];
}
export const protonDbPresent = () => loadedPluginNames().some(isProtonDbPluginName);
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | undefined;
let last = false;
function refresh() {
  const next = protonDbPresent();
  if (next === last) return;
  last = next;
  listeners.forEach(f => f());
}
function subscribe(f: () => void) {
  listeners.add(f);
  if (!timer) { last = protonDbPresent(); timer = setInterval(refresh, 1000); }
  return () => { listeners.delete(f); if (!listeners.size) { clearInterval(timer); timer = undefined; } };
}
export const useProtonDbPresent = () => useSyncExternalStore(subscribe, protonDbPresent, () => false);
/** Browser fixtures only; production always reads the loaded Decky plugins. */
export function setPreviewLoadedPlugins(names: readonly string[] | null) {
  if (!(globalThis as any).__isThemePreview) throw new Error("Preview plugin detection is unavailable outside preview mode");
  previewNames = names === null ? null : [...names];
  refresh();
}
