import { useEffect, useState } from "react";
import { findClassModule } from "@decky/ui";
import { steamDocuments } from "./keyboardSkins";

// Valve's built-in artwork and custom HTML screensavers share this host.
// Resolve the CSS module rather than guessing from arbitrary fullscreen images.
export function screensaverVisible(docs: Document[], containerClass?: string): boolean {
  if (!containerClass) return false;
  for (const doc of docs) try {
    const view = doc.defaultView;
    if (!view || doc.hidden) continue;
    for (const el of Array.from(doc.getElementsByClassName(containerClass))) {
      const r = el.getBoundingClientRect(), css = view.getComputedStyle(el);
      if (!el.closest("[data-dht-root]") && r.width > 0 && r.height > 0 &&
          css.display !== "none" && css.visibility !== "hidden" && Number(css.opacity) > 0 &&
          el.getClientRects().length > 0) return true;
    }
  } catch { /* Steam window closed */ }
  return false;
}

export function useSteamScreensaver() {
  const [active, setActive] = useState(false);
  useEffect(() => {
    let container: string | undefined;
    const read = () => {
      try {
        container ??= findClassModule(m => !!m.ScreensaverContainer && !!m.NavRoot && !!m.Browser)?.ScreensaverContainer;
        const next = screensaverVisible(steamDocuments(), container);
        setActive(prev => prev === next ? prev : next);
      } catch { /* unsupported Steam client: leave native behavior alone */ }
    };
    read();
    const timer = setInterval(read, 250);
    return () => clearInterval(timer);
  }, []);
  return active;
}
