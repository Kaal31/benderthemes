// Assets from any installed source, for a preset's slots (presets v2, handoff-notes/presets-v2.md).
//
// A slot value (settings.mix[look][slot]) is one of:
//   ""                      the look's own (nothing chosen)
//   "none"                  deliberately empty
//   "<theme id>"            what that engine theme (built-in or community data theme) brings for the slot
//   "@wp/<file>"            a picture in the wallpapers folder (Hub packs put their wallpapers there too)
//   "@hub/<set>/<name>"     one picture of a Hub pack's image set (assets/<set>)
//   "@hub/<set>"            a Hub pack's icon set
//   "@file/<kind>/<file>"   an imported console theme file: p3t, psp, vita, x360, xbox, wii, n3ds, switch, wiiu
//   "#rrggbb"               a colour (accent)
// "@" and "#" never start a theme id, so values saved before v2 (theme ids) keep their meaning.
//
// LAYOUT_SLOTS is the capability table: which slots each layout actually draws. Menus offer only those.
import type { ThemeId } from "../settings";
import { loadAssets } from "../assets";
import { loadSkinFile } from "../skins";
import { loadSwitchSkin } from "../switchThemes";
import { loadWiiuSkin } from "../wiiuThemes";
import { ICON_SPOTS } from "./manifest";
import { backgroundMediaKind } from "../backgroundMedia";

export type AssetSlot = "wallpaper" | "icons" | "sounds" | "music" | "font" | "accent";
export type FileKind = "p3t" | "psp" | "vita" | "x360" | "xbox" | "wii" | "n3ds" | "switch" | "wiiu";

/** What each layout draws of the shared slots. accent: the layout's own colour variables the accent is written to. */
export interface LayoutCaps { background: boolean; videoBackground?:boolean; gameArt: boolean; tint: boolean; brightness: boolean; icons: boolean; font: boolean; accent: string[] }
const caps = (background: boolean, icons: boolean, font: boolean, accent: string[] = [], extra: Partial<LayoutCaps> = {}): LayoutCaps =>
  ({ background, gameArt: background, tint: background, brightness: background, icons, font, accent, ...extra });
/** Checked in the preview (handoff-notes/presets-v2.md, "Capability table"). Background = draws the chosen picture;
 *  icons = draws the shared <Icon> glyphs where an icon set can replace them; font = its text follows --dht-font;
 *  accent = the variables its focus / highlight colour reads. */
export const LAYOUT_SLOTS: Record<ThemeId, LayoutCaps> = {
  gameamp: caps(false, false, false, [], { gameArt: false, tint: false, brightness: false }),
  "santa-express": caps(true, true, true),
  "old-big-picture": caps(true, true, true),
  onyx: caps(false, true, false),
  silver: caps(false, true, false),
  wii: caps(true, true, false, [], { gameArt: false, tint: true }),
  wiiu: caps(true, true, false, ["--dht-wiiu-accent"], { gameArt: false, tint: true }),
  switch: caps(true, true, false, ["--dht-switch-accent"], { gameArt: false, tint: true }),
  n3ds: caps(true, false, false, ["--dht-n3ds-cursor"], { gameArt: false, tint: true }),
  vita: caps(true, false, false, ["--dht-vita-halo-ring"]),
  ps1: caps(false, false, true),
  ps2: caps(false, false, false, [], { tint: true }),
  ps3: caps(true, false, false),
  psp: caps(true, false, false),
  ps4: caps(true, true, true, [], { gameArt: false }),
  ps5: caps(true, true, false, [], { gameArt: false }),
  xbox: caps(true, false, false, ["--dht-xbox-skin-highlight"], { tint: false }),
  x360: caps(true, true, true, ["--dht-x360-accent"], { tint: false }),
  aero: caps(true, true, false),
  aero2: caps(true, true, false),
  dial: caps(true, true, false, [], { tint: false }),
  castle: caps(true, true, false, [], {videoBackground:true,gameArt:false,tint:false}),
  republic: caps(true, true, false, [], {videoBackground:true,gameArt:false,tint:false}),
  minecraft: caps(false, false, false),
  pain: caps(false, true, false),
  nazarick: caps(true, true, false, [], {videoBackground:true,gameArt:false,tint:false}),
  iisu: caps(true, true, true, ["--dht-iisu-ring", "--dht-iisu-accent-fill"], { tint: false }),
  native: caps(true, true, true, ["--dht-accent"]),
  frame: caps(true, true, true, ["--dht-accent"], { gameArt: false, tint: false, brightness: false }),
};
export const slotOffered = (layout: ThemeId, slot: AssetSlot): boolean => {
  const c = LAYOUT_SLOTS[layout];
  if (!c) return false;
  if (slot === "wallpaper") return c.background;
  if (slot === "icons") return c.icons;
  if (slot === "font") return c.font;
  if (slot === "accent") return c.accent.length > 0;
  return true; // sounds and music: every layout plays them
};

export const isAssetRef = (v: string | undefined) => !!v && (v.startsWith("@") || v.startsWith("#"));
export type ParsedRef =
  | { kind: "wp"; name: string }
  | { kind: "hub"; set: string; name?: string }
  | { kind: "file"; file: FileKind; name: string }
  | { kind: "color"; value: string }
  | null;
const FILE_KINDS: FileKind[] = ["p3t", "psp", "vita", "x360", "xbox", "wii", "n3ds", "switch", "wiiu"];
export function parseRef(ref: string): ParsedRef {
  if (/^#[0-9a-f]{6}$/i.test(ref)) return { kind: "color", value: ref };
  if (ref.startsWith("@wp/")) return { kind: "wp", name: ref.slice(4) };
  if (ref.startsWith("@hub/")) {
    const [set, ...rest] = ref.slice(5).split("/");
    return /^[a-z0-9-]{1,40}$/.test(set) ? { kind: "hub", set, name: rest.length ? rest.join("/") : undefined } : null;
  }
  if (ref.startsWith("@file/")) {
    const rest = ref.slice(6);
    const cut = rest.indexOf("/");
    const file = rest.slice(0, cut) as FileKind;
    return cut > 0 && FILE_KINDS.includes(file) ? { kind: "file", file, name: rest.slice(cut + 1) } : null;
  }
  return null;
}
export const fileRef = (file: FileKind, name: string) => `@file/${file}/${name}`;

// ───────────── Hub packs: pictures and icon sets they install ─────────────
/** Pictures in Hub packs that work as a whole-screen background. */
export const HUB_BACKGROUNDS: { set: string; name: string; label: string }[] = [
  { set: "x360-metro-dash", name: "background", label: "Xbox 360 · Metro dashboard" },
  { set: "x360-nxe-dash", name: "background", label: "Xbox 360 · NXE dashboard" },
  { set: "x360-kinect-dash", name: "background", label: "Xbox 360 · Kinect dashboard" },
  { set: "pain", name: "background", label: "Six Paths · moonlight" },
  { set: "minecraft", name: "scenery", label: "Block Worlds · scenery" },
  { set: "xbox-original", name: "cellwall", label: "Xbox · cell wall" },
];
/** Hub icon sets that cover the shared icon spots. */
export const HUB_ICON_SETS: { set: string; label: string }[] = [
  { set: "xmb-ps3", label: "PS3 XMB icons" },
  { set: "xmb-monochrome", label: "XMB monochrome icons" },
  { set: "x360-metro", label: "Xbox 360 Metro icons" },
  { set: "x360-nxe", label: "Xbox 360 NXE icons" },
  { set: "x360-blades", label: "Xbox 360 Blades icons" },
  { set: "nazarick", label: "Nazarick icons" },
];
const SPOTS = new Set(ICON_SPOTS.map((s) => s.id));
const ALIAS: Record<string, string> = {
  setting: "gear", settings: "gear", friend: "friends", browser: "globe", internet: "globe", image: "photo", movie: "video",
  downloads: "download", profile: "user", avatar: "user", controller: "game", messages: "bell", message: "bell", mail: "bell",
  psstore: "store", marketplace: "store", contentmanager: "folder", trophies: "trophy", games: "game", console: "game", home: "home",
  settingspreferences: "gear", turnoff: "power", activityfeed: "bell", addfriends: "friends", apps: "apps", library: "library",
};
/** The icon spot a theme file's or pack's picture name stands for (icon_setting → gear, ico-marketplace → store …). */
export function spotOf(name: string): string | undefined {
  const n = name.toLowerCase().replace(/^(icon_|ico-|icon-)/, "").replace(/[^a-z]/g, "");
  const s = ALIAS[n] ?? n;
  return SPOTS.has(s) ? s : undefined;
}
const toSpots = (icons: Record<string, string> | undefined): Record<string, string> => {
  const out: Record<string, string> = {};
  for (const [n, url] of Object.entries(icons ?? {})) {
    const spot = spotOf(n);
    if (spot && url && !out[spot]) out[spot] = url;
  }
  return out;
};

// ───────────── resolving a reference ─────────────
type ThemeLookup = { image(id: string): string | null | undefined; icons(id: string): Record<string, string>; font(id: string): string | null | undefined };
let themes: ThemeLookup = { image: () => undefined, icons: () => ({}), font: () => undefined };
/** registry.ts: how a theme id resolves (data themes' files). */
export const setThemeLookup = (t: ThemeLookup) => { themes = t; };
let wallpaperLoader: (name: string) => Promise<string | null> = async () => null;
/** steam.ts: how a wallpapers-folder file is read. */
export const setWallpaperLoader = (f: typeof wallpaperLoader) => { wallpaperLoader = f; };

async function fileBackground(file: FileKind, name: string): Promise<string | null> {
  if (file === "switch") {
    const sk = await loadSwitchSkin(name);
    return (sk?.screens.home ?? Object.values(sk?.screens ?? {})[0])?.background ?? null;
  }
  if (file === "wiiu") return (await loadWiiuSkin(name))?.art?.["grid-background"] ?? null;
  const sk = await loadSkinFile(file, name);
  if (!sk) return null;
  if (file === "p3t" || file === "psp") return sk.backgrounds?.[0] ?? null;
  if (file === "vita") return sk.pages?.[0] ?? null;
  if (file === "wii") return sk.wallpaper ?? null;
  if (file === "n3ds") return sk.top?.image ?? sk.bottom?.image ?? null;
  return sk.background ?? null; // x360, xbox
}
async function fileIcons(file: FileKind, name: string): Promise<Record<string, string>> {
  if (file === "switch") return toSpots((await loadSwitchSkin(name))?.icons);
  if (file === "p3t" || file === "psp" || file === "vita") return toSpots((await loadSkinFile(file, name))?.icons);
  if (file === "xbox") return toSpots((await loadSkinFile(file, name))?.images);
  return {};
}

const cache = new Map<string, unknown>();
const waiting = new Map<string, Promise<unknown>>();
let onLoaded: () => void = () => {};
/** registry.ts: re-render the home once an asset that was asked for has arrived. */
export const setAssetsLoaded = (f: () => void) => { onLoaded = f; };
export const clearAssetCache = () => { cache.clear(); waiting.clear(); };
function cached<T>(key: string, load: () => Promise<T>): T | undefined {
  if (cache.has(key)) return cache.get(key) as T;
  if (!waiting.has(key))
    waiting.set(key, load().catch(() => null).then((v) => { cache.set(key, v); waiting.delete(key); onLoaded(); return v; }));
  return undefined;
}
/** Resolve a picture reference (async). null = it can't be shown. */
export async function resolveImage(ref: string): Promise<string | null> {
  const r = parseRef(ref);
  if (!r) return themes.image(ref) ?? null;
  if (r.kind === "wp") return wallpaperLoader(r.name);
  if (r.kind === "hub") return r.name ? (await loadAssets(r.set))[r.name] ?? null : null;
  if (r.kind === "file") return fileBackground(r.file, r.name);
  return null;
}
/** The icon set a reference stands for, by icon spot (undefined while it loads). */
export function iconSet(ref: string): Record<string, string> | undefined {
  const r = parseRef(ref);
  if (!r) return themes.icons(ref);
  if (r.kind === "hub") return cached(`icons:${ref}`, async () => toSpots(await loadAssets(r.set))) ?? undefined;
  if (r.kind === "file") return cached(`icons:${ref}`, () => fileIcons(r.file, r.name)) ?? undefined;
  return {};
}
/** A font file URL for a reference (undefined while it loads, null = none). */
export function fontUrl(ref: string): string | null | undefined {
  const r = parseRef(ref);
  if (!r) return themes.font(ref);
  if (r.kind === "file" && r.file === "psp") return cached(`font:${ref}`, async () => (await loadSkinFile("psp", r.name))?.font?.ttf ?? null) as string | null | undefined;
  return null;
}
/** A colour for a reference: "#rrggbb" itself, or the average colour of an Xbox 360 theme's wallpaper. */
export function accentOf(ref: string): string | undefined {
  const r = parseRef(ref);
  if (r?.kind === "color") return r.value;
  if (r?.kind === "file" && r.file === "x360") return (cached(`accent:${ref}`, async () => (await loadSkinFile("x360", r.name))?.accent ?? null) as string | null | undefined) ?? undefined;
  return undefined;
}

// ───────────── what can be picked, grouped by source ─────────────
export interface AssetChoice { ref: string; name: string }
export interface AssetGroup { source: string; items: AssetChoice[] }
export interface InstalledLists {
  walls: string[];
  files: Partial<Record<FileKind, { id: string; name: string }[]>>;
  themes: { id: string; name: string; wallpaper?:string; has: (slot: AssetSlot) => boolean }[];
}
const FILE_SOURCES: { kind: FileKind; label: string; background: boolean; icons: boolean; font?: boolean; accent?: boolean }[] = [
  { kind: "p3t", label: "PS3 theme files", background: true, icons: true },
  { kind: "psp", label: "PSP theme files", background: true, icons: true, font: true },
  { kind: "vita", label: "PS Vita themes", background: true, icons: true },
  { kind: "x360", label: "Xbox 360 themes", background: true, icons: false, accent: true },
  { kind: "xbox", label: "Xbox skins", background: true, icons: true },
  { kind: "wii", label: "Wii themes", background: true, icons: false },
  { kind: "wiiu", label: "Wii U themes", background: true, icons: false },
  { kind: "switch", label: "Switch themes", background: true, icons: true },
  { kind: "n3ds", label: "3DS themes", background: true, icons: false },
];
/** Hub sets found installed (filled by refreshHubSets). */
const hubFound = new Set<string>();
export async function refreshHubSets() {
  const sets = [...new Set([...HUB_BACKGROUNDS.map((b) => b.set), ...HUB_ICON_SETS.map((s) => s.set)])];
  await Promise.all(sets.map(async (set) => {
    const a = await loadAssets(set).catch(() => ({} as Record<string, string>));
    for (const b of HUB_BACKGROUNDS) if (b.set === set) (a[b.name] ? hubFound.add(`${set}/${b.name}`) : hubFound.delete(`${set}/${b.name}`));
    if (HUB_ICON_SETS.some((s) => s.set === set)) (Object.keys(toSpots(a)).length >= 3 ? hubFound.add(set) : hubFound.delete(set));
  }));
}
/** Every installed asset for a slot, grouped by where it comes from (an empty group is left out). */
export function assetGroups(slot: AssetSlot, lists: InstalledLists, exceptTheme?: string, allowVideo=false): AssetGroup[] {
  const groups: AssetGroup[] = [];
  const add = (source: string, items: AssetChoice[]) => items.length && groups.push({ source, items });
  const fromThemes = (s: AssetSlot) => lists.themes.filter((t) => t.id !== exceptTheme && t.has(s) && (s!=="wallpaper"||allowVideo||backgroundMediaKind(t.wallpaper)!=="video")).map((t) => ({ ref: t.id, name: t.name }));
  if (slot === "wallpaper") {
    add("Wallpapers folder", lists.walls.filter(f=>allowVideo||backgroundMediaKind(f)!=="video").map((f) => ({ ref: `@wp/${f}`, name: f })));
    add("Hub packs", HUB_BACKGROUNDS.filter((b) => hubFound.has(`${b.set}/${b.name}`)).map((b) => ({ ref: `@hub/${b.set}/${b.name}`, name: b.label })));
    for (const f of FILE_SOURCES.filter((x) => x.background)) add(f.label, (lists.files[f.kind] ?? []).map((x) => ({ ref: fileRef(f.kind, x.id), name: x.name })));
    add("Community themes", fromThemes("wallpaper"));
  }
  if (slot === "icons") {
    add("Hub packs", HUB_ICON_SETS.filter((s) => hubFound.has(s.set)).map((s) => ({ ref: `@hub/${s.set}`, name: s.label })));
    for (const f of FILE_SOURCES.filter((x) => x.icons)) add(f.label, (lists.files[f.kind] ?? []).map((x) => ({ ref: fileRef(f.kind, x.id), name: x.name })));
    add("Community themes", fromThemes("icons"));
  }
  if (slot === "font") {
    add("PSP theme files", (lists.files.psp ?? []).filter((x) => /\.ctf$/i.test(x.id)).map((x) => ({ ref: fileRef("psp", x.id), name: x.name })));
    add("Community themes", fromThemes("font"));
  }
  if (slot === "accent") {
    add("Colours", ACCENTS.map(([name, c]) => ({ ref: c, name })));
    add("Xbox 360 themes", (lists.files.x360 ?? []).map((x) => ({ ref: fileRef("x360", x.id), name: `${x.name} (wallpaper colour)` })));
    add("Community themes", fromThemes("accent"));
  }
  if (slot === "sounds" || slot === "music") add("Community themes", fromThemes(slot));
  return groups;
}
export const ACCENTS: [string, string][] = [
  ["Sky blue", "#28c3ec"], ["Switch cyan", "#00c3e3"], ["Mint", "#3ee0a8"], ["Xbox green", "#107c10"], ["Lime", "#9bd21c"],
  ["Sun yellow", "#ffd23c"], ["Orange", "#ff8a1c"], ["Red", "#e8343c"], ["Pink", "#ff5aa8"], ["Purple", "#8b5cf6"], ["White", "#ffffff"],
];
