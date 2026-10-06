// Read CSS custom properties that CSS Loader themes may set (e.g. :root { --dht-xmb-color: #c33 }).
// Values that steer JavaScript-drawn parts (canvas waves, colour maths) are read here;
// everything else uses var(--dht-…, default) directly in styles.
import { useEffect, useState } from "react";

// Plugins run in Steam's SharedJSContext, but the home is drawn in the Big
// Picture window — a different document. CSS Loader injects into that one, so
// variables must be read from the document our layer actually lives in.
let uiDoc: Document | null = null;
export function setUiDocument(d: Document | null) {
  if (d) uiDoc = d;
}
export const getUiDocument = () => uiDoc;

export function readCssVar(name: string): string {
  try {
    const doc = uiDoc ?? document;
    const getComputedStyle = (doc.defaultView ?? window).getComputedStyle.bind(doc.defaultView ?? window);
    const v = getComputedStyle(doc.documentElement).getPropertyValue(name) || getComputedStyle(doc.querySelector("[data-dht-root]") ?? doc.body).getPropertyValue(name);
    return v.trim().replace(/^["']|["']$/g, "");
  } catch {
    return "";
  }
}

/** Re-reads every few seconds so enabling/disabling a CSS Loader theme applies without a restart. */
export function useCssVar(name: string): string {
  const [v, setV] = useState(() => readCssVar(name));
  useEffect(() => {
    const iv = setInterval(() => setV(readCssVar(name)), 3000);
    return () => clearInterval(iv);
  }, [name]);
  return v;
}
