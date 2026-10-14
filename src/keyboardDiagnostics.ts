import { logInfo } from "./diag";
import { keyboardClasses, steamDocuments } from "./keyboardSkins";
import { getSettings, onSettingsChange } from "./settings";
import { drainKeyboardEvents, setKeyboardRecording } from "./keyboardLifecycle";

// No text, field values, labels, IDs, URLs or HTML enter these records.
export function keyboardNodeState(el: Element) {
  const css = el.ownerDocument.defaultView!.getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return { tag: el.tagName, classes: Array.from(el.classList).slice(0, 12),
    rect: [r.x, r.y, r.width, r.height].map(v => Math.round(v)),
    display: css.display, visibility: css.visibility, opacity: css.opacity,
    position: css.position, zIndex: css.zIndex, transform: css.transform,
    footerHidden: el.hasAttribute("data-dht-foot"), headerHidden: el.hasAttribute("data-dht-hidden") };
}

export function startKeyboardDiagnostics(automatic = false): () => void {
  let timer: ReturnType<typeof setInterval> | undefined;
  let remaining = 1800; // bounded thirty-minute capture; at most one record/second
  const windows = new WeakMap<Document, number>();
  let nextWindow = 1;
  const previous = new Map<number, string>();
  const watchers = new Map<Document, () => void>();
  const changes: Array<{ window: number; node: ReturnType<typeof keyboardNodeState> }> = [];
  const capture = () => {
    if (remaining-- <= 0) { stop(); logInfo("[keyboard-diagnostics] capture limit reached; reload the plugin to restart"); return; }
    const { classes, from } = keyboardClasses();
    const lifecycle = drainKeyboardEvents();
    if (lifecycle.length) logInfo(`[keyboard-diagnostics] lifecycle ${JSON.stringify(lifecycle)}`);
    const docs = new Set(steamDocuments());
    for (const [doc, off] of watchers) if (!docs.has(doc)) {
      logInfo(`[keyboard-diagnostics] window-removed ${windows.get(doc)}`);
      off(); watchers.delete(doc);
    }
    for (const doc of docs) {
      try {
        let id = windows.get(doc);
        if (!id) { id = nextWindow++; windows.set(doc, id); logInfo(`[keyboard-diagnostics] window-discovered ${id}`); }
        if (!watchers.has(doc) && doc.body) {
          const windowId = id;
          const observer = new (doc.defaultView as any).MutationObserver((records: MutationRecord[]) => {
            for (const record of records) {
              if (changes.length >= 32 || record.type !== "attributes") continue;
              // Only ThemeHub's marker transitions; no arbitrary DOM changes.
              if (record.attributeName === "data-dht-foot" || record.attributeName === "data-dht-hidden")
                changes.push({ window: windowId, node: keyboardNodeState(record.target as Element) });
            }
          });
          observer.observe(doc.body, { subtree: true, attributes: true, attributeFilter: ["data-dht-foot", "data-dht-hidden"] });
          watchers.set(doc, () => observer.disconnect());
        }
        const selector = `.${classes.Keyboard},.${classes.VirtualKeyboardContainer},[class*="virtualkeyboard"],[data-keyboard]`;
        const keyboards = Array.from(doc.querySelectorAll(selector)).slice(0, 8).map(el => {
          const ancestors = [];
          for (let p = el.parentElement; p && ancestors.length < 10; p = p.parentElement) ancestors.push(keyboardNodeState(p));
          const r = el.getBoundingClientRect();
          const hit = r.width && r.height ? doc.elementFromPoint(r.x + r.width / 2, r.y + r.height / 2) : null;
          return { node: keyboardNodeState(el), ancestors, centerHitInside: !!hit && el.contains(hit) };
        });
        const settings = getSettings();
        const snapshot = JSON.stringify({ window: id, viewport: [doc.defaultView?.innerWidth, doc.defaultView?.innerHeight],
          classSource: from, footer: settings.footer, hideHeader: settings.hideSteamHeader, skin: settings.keyboardSkin === true,
          theme: settings.theme, enabled: settings.enabled,
          runningApps: Array.isArray((globalThis as any).SteamUIStore?.RunningApps) ? (globalThis as any).SteamUIStore.RunningApps.length : null,
          inputFocused: /^(INPUT|TEXTAREA)$/.test(doc.activeElement?.tagName ?? "") || (doc.activeElement as HTMLElement)?.isContentEditable === true,
          keyboards,
          marked: Array.from(doc.querySelectorAll("[data-dht-foot],[data-dht-hidden]")).slice(0, 16).map(keyboardNodeState) });
        if (snapshot !== previous.get(id)) { previous.set(id, snapshot); logInfo(`[keyboard-diagnostics] ${snapshot}`); }
      } catch { /* closing Steam window */ }
    }
    if (changes.length) logInfo(`[keyboard-diagnostics] chrome transitions ${JSON.stringify(changes.splice(0))}`);
  };
  const stop = () => {
    setKeyboardRecording(false);
    clearInterval(timer); timer = undefined;
    watchers.forEach(off => off()); watchers.clear(); previous.clear(); changes.length = 0;
  };
  let enabled = false;
  const refresh = () => {
    const next = automatic;
    if (next === enabled) return;
    enabled = next; stop();
    logInfo(`[keyboard-diagnostics] ${next ? "enabled (thirty-minute limit, no input text)" : "disabled"}`);
    if (next) { setKeyboardRecording(true); remaining = 1800; capture(); timer = setInterval(capture, 1000); }
  };
  refresh();
  const off = onSettingsChange(refresh);
  return () => { off(); stop(); };
}
