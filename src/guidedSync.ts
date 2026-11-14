import { getSettings, onSettingsChange, settingsLoaded } from "./settings";
import { createGuidedBridge, GuidedUi } from "./guidedBridge";

function guidedWindows(): any[] {
  const windows: any[] = [globalThis];
  try {
    const focused = (globalThis as any).SteamUIStore?.GetFocusedWindowInstance?.()?.BrowserWindow;
    if (focused && focused !== globalThis) windows.push(focused);
  } catch {}
  return windows;
}

export function guidedOwnsInput(): boolean {
  if (getSettings().guidedSync === "off") return false;
  return guidedWindows().some(window => { try { return window.__g360Open === true; } catch { return false; } });
}

export function startGuidedSync(): () => void {
  const bridge = createGuidedBridge();
  const ready = new WeakSet<object>();
  const pending = new WeakSet<object>();
  let disposed = false;
  const tick = () => {
    if (disposed || !settingsLoaded()) return;
    if (getSettings().guidedSync === "off") { bridge.sync(getSettings(), null); return; }
    for (const window of guidedWindows()) {
      try {
        const ui: GuidedUi | undefined = window.__gxUi;
        if (!ui || typeof ui.get !== "function" || typeof ui.set !== "function" || typeof ui.choose !== "function") continue;
        if (!ready.has(ui)) {
          if (!pending.has(ui)) {
            pending.add(ui);
            Promise.resolve(ui.load?.()).then(() => { ready.add(ui); if (!disposed) tick(); }).catch(() => {}).finally(() => pending.delete(ui));
          }
          return;
        }
        bridge.sync(getSettings(), ui);
        return;
      } catch {}
    }
    bridge.sync(getSettings(), null);
  };
  const unsubscribe = onSettingsChange(tick);
  const timer = setInterval(tick, 1500);
  tick();
  return () => { disposed = true; clearInterval(timer); unsubscribe(); };
}
