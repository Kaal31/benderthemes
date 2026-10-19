// Pages: the screens the plugin draws besides the home (store, web browser,
// library, game details, friends and settings). Each one normally takes the
// look of the home theme, but the user can pick another theme for any page,
// so a preset can be "PS4 home, Xbox 360 store, PS Vita browser".
//
// A page is drawn by the same code as before; it just receives the settings of
// the theme chosen for it (its layout and that layout's own settings).
import type { Settings } from "../settings";
import type { Destination } from "../destinations";
import { findTheme } from "./registry";

export type PageId = "store" | "browser" | "library" | "game" | "system" | "media";
export const PAGES: { id: PageId; name: string }[] = [
  { id: "store", name: "Store" },
  { id: "browser", name: "Web browser" },
  { id: "library", name: "Game library" },
  { id: "game", name: "Game details" },
  { id: "system", name: "Friends, downloads and settings" },
  { id: "media", name: "Music player and captures" },
];
export const PAGE_IDS = PAGES.map((p) => p.id) as readonly string[];

/** Which page a place in the home's menus belongs to. */
export function pageOf(place: Destination["place"]): PageId {
  switch (place) {
    case "store": return "store";
    case "browser": case "community": return "browser";
    case "collections": case "library": case "search": return "library";
    case "game": case "achievements": return "game";
    case "media": case "music": return "media";
    default: return "system";
  }
}

/** The theme chosen for a page, or undefined when it follows the home. */
export function pageTheme(s: Settings, page: PageId) {
  const id = s.pages?.[page];
  if (!id) return undefined;
  const t = findTheme(id);
  // a community interface draws only its own home
  return t && t.layout !== "frame" ? t : undefined;
}

/** The settings a page is drawn with: the home's, switched to the page's own theme. */
export function pageSettings(s: Settings, page: PageId): Settings {
  const t = pageTheme(s, page);
  if (!t) return s;
  const o = t.layoutOptions ?? {};
  return {
    ...s,
    theme: t.layout,
    activeTheme: t.id,
    ...(o.x360Style ? { x360: { ...s.x360, style: o.x360Style } } : {}),
    ...(o.vitaLook !== undefined ? { vita: { ...s.vita, look: o.vitaLook } } : {}),
  };
}
