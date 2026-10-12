// The theme format. A theme is data: a manifest (theme.json) plus files. The
// manifest picks a layout the engine knows how to draw and fills named slots
// (wallpaper, sounds, music, videos, colours, font). Built-in themes and
// community themes use the same format; see docs/THEME-FORMAT.md.
import type { ThemeId, VitaLook, X360Style } from "../settings";

export const THEME_SCHEMA = 1;

/** Layouts are the engine's own interfaces. "frame" runs a community interface in a sealed iframe. */
export type LayoutId = ThemeId;

export type Company = "Sony" | "Microsoft" | "Nintendo" | "Bonus" | "Community";
export const COMPANIES: Company[] = ["Sony", "Microsoft", "Nintendo", "Bonus", "Community"];

/** Everything a theme can supply, and so everything that can be swapped between themes. */
export type SlotKind = "wallpaper" | "sounds" | "music" | "bootVideo" | "launchVideo" | "accent" | "font" | "icons";
export const SLOTS: { id: SlotKind; name: string; kind: "image" | "pack" | "video" | "color" | "font" | "icons" }[] = [
  { id: "wallpaper", name: "Wallpaper", kind: "image" },
  { id: "sounds", name: "Navigation sounds", kind: "pack" },
  { id: "music", name: "Music", kind: "pack" },
  { id: "bootVideo", name: "Boot intro video", kind: "video" },
  { id: "launchVideo", name: "Game start video", kind: "video" },
  { id: "accent", name: "Accent colour", kind: "color" },
  { id: "font", name: "Font", kind: "font" },
  { id: "icons", name: "Icons", kind: "icons" },
];

/**
 * The agreed icon names: every layout draws its menus with these, so an icon
 * with one of these names fills that spot in any theme. A theme can bring
 * icons with other names too; those can still be picked for any spot by hand.
 */
export const ICON_SPOTS: { id: string; name: string }[] = [
  { id: "home", name: "Home" }, { id: "game", name: "Games" }, { id: "library", name: "Library" }, { id: "apps", name: "Apps" },
  { id: "store", name: "Store" }, { id: "friends", name: "Friends" }, { id: "user", name: "Profile" }, { id: "psn", name: "Online network" },
  { id: "gear", name: "Settings" }, { id: "palette", name: "Themes" }, { id: "power", name: "Power" }, { id: "download", name: "Downloads" },
  { id: "search", name: "Search" }, { id: "bell", name: "Notifications" }, { id: "trophy", name: "Achievements" }, { id: "globe", name: "Web browser" },
  { id: "photo", name: "Photos" }, { id: "music", name: "Music" }, { id: "video", name: "Video" }, { id: "tv", name: "TV" },
  { id: "folder", name: "Folder" }, { id: "disc", name: "Disc" }, { id: "card", name: "Memory card" }, { id: "cloud", name: "Cloud" },
  { id: "wifi", name: "Wi-Fi" }, { id: "network", name: "Network" }, { id: "sound", name: "Sound" }, { id: "clock", name: "Clock" },
  { id: "steam", name: "Steam" }, { id: "info", name: "Information" }, { id: "play", name: "Play" }, { id: "dots", name: "More" },
  { id: "plus", name: "Add" }, { id: "back", name: "Back" },
];

/** Options a built-in layout understands (kept small on purpose; layouts own their other settings). */
export interface LayoutOptions {
  x360Style?: X360Style;
  vitaLook?: VitaLook;
}

export interface ThemeManifest {
  schema: number;
  id: string;
  name: string;
  author?: string;
  description?: string;
  company?: Company;
  layout: LayoutId;
  layoutOptions?: LayoutOptions;
  /** File paths inside the theme folder (folders for sounds / music), or a CSS colour for accent. */
  slots?: Partial<Record<SlotKind, string>>;
  /** Only for layout "frame": the interface's HTML file inside the theme folder. */
  frame?: { entry: string };
}

/** A manifest as the engine uses it: where it came from. */
export interface ThemeEntry extends ThemeManifest {
  source: "builtin" | "bundled" | "user";
}

const ID = /^[a-z0-9][a-z0-9:-]{0,63}$/;
const PATH = /^(?!\/)(?!.*(^|\/)\.\.?(\/|$))[\w .()&'+,-]+(\/[\w .()&'+,-]+)*$/;
const COLOR = /^(#[0-9a-f]{3,8}|rgba?\([\d\s.,%]+\)|hsla?\([\d\s.,%deg]+\))$/i;

/**
 * Checks a manifest that came from outside the plugin. Returns the cleaned
 * manifest, or a reason it was refused. Unknown fields are dropped.
 */
export function validateManifest(raw: unknown, layouts: readonly string[]): { ok: true; theme: ThemeManifest } | { ok: false; reason: string } {
  const m = raw as Record<string, any>;
  if (!m || typeof m !== "object") return { ok: false, reason: "not an object" };
  if (m.schema !== THEME_SCHEMA) return { ok: false, reason: `unsupported schema ${m.schema}` };
  if (typeof m.id !== "string" || !ID.test(m.id)) return { ok: false, reason: "bad id" };
  if (typeof m.name !== "string" || !m.name.trim() || m.name.length > 64) return { ok: false, reason: "bad name" };
  if (!layouts.includes(m.layout)) return { ok: false, reason: `unknown layout ${m.layout}` };
  const theme: ThemeManifest = { schema: THEME_SCHEMA, id: m.id, name: m.name.trim(), layout: m.layout };
  if (typeof m.author === "string") theme.author = m.author.slice(0, 64);
  if (typeof m.description === "string") theme.description = m.description.slice(0, 280);
  if (COMPANIES.includes(m.company)) theme.company = m.company;
  const lo = m.layoutOptions;
  if (lo && typeof lo === "object") {
    const opts: LayoutOptions = {};
    if (["blades", "nxe", "kinect", "metro"].includes(lo.x360Style)) opts.x360Style = lo.x360Style;
    if (["", "sakura"].includes(lo.vitaLook)) opts.vitaLook = lo.vitaLook;
    theme.layoutOptions = opts;
  }
  if (m.slots && typeof m.slots === "object") {
    const slots: Partial<Record<SlotKind, string>> = {};
    for (const s of SLOTS) {
      const v = m.slots[s.id];
      if (typeof v !== "string") continue;
      if (s.kind === "color" ? COLOR.test(v) : PATH.test(v)) slots[s.id] = v;
    }
    theme.slots = slots;
  }
  if (m.layout === "frame") {
    if (typeof m.frame?.entry !== "string" || !PATH.test(m.frame.entry) || !/\.html?$/i.test(m.frame.entry)) return { ok: false, reason: "frame theme without an .html entry" };
    theme.frame = { entry: m.frame.entry };
  }
  return { ok: true, theme };
}
