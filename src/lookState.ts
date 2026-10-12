// One preset type (presets v2, handoff-notes/presets-v2.md).
//
// A preset belongs to one look (an engine theme id: "wiiu", "x360:metro", "vita-look:sakura", a data theme id) and
// stores only its differences from that look's factory defaults. Its state is a small set of settings paths
// (lookPaths): the look's theme file, its slots (mix[look]: background, icons, sounds, music, font, accent), its own
// options, its standard options, pages, per-file effects and the layout's own settings. The settings keys stay what
// they were; a preset's `diff` is a nested piece of the settings object holding only those paths.
//
// This file imports nothing that imports settings at load time (settings.ts calls migrateUserPresets while it loads).
import { BUILTIN_THEMES } from "./engine/builtin";
import type { ThemeManifest } from "./engine/manifest";
import { DEFAULTS, LOOK_KEYS, Settings, ThemeId, THEMES, themeFx, cleanLook } from "./settings";

export type Path = string[];
type Look = Pick<ThemeManifest, "id" | "layout" | "layoutOptions">;

// data themes are only known to the engine registry: it registers how to find one (see registry.ts)
let resolver: (id: string) => Look | undefined = () => undefined;
export const setLookResolver = (f: typeof resolver) => { resolver = f; };
export function lookInfo(id: string): Look | undefined {
  return BUILTIN_THEMES.find((t) => t.id === id) ?? resolver(id);
}

/** The layout a look draws with (`hint` when the look is not known, e.g. a data theme that was removed). */
export const layoutOf = (look: string, hint?: ThemeId): ThemeId => (lookInfo(look)?.layout ?? hint ?? "ps4") as ThemeId;

/** The built-in look a layout shows when no engine theme was picked (settings saved before the engine, or a theme
 *  switched to directly). */
export function builtinLookFor(s: Pick<Settings, "theme" | "vita" | "x360">): string {
  if (s.theme === "vita") return s.vita?.look === "sakura" ? "vita-look:sakura" : "vita";
  if (s.theme === "x360") return `x360:${s.x360?.style ?? "metro"}`;
  return s.theme;
}
/** The look on screen: the picked engine theme when its layout is the one shown, else the layout's built-in look. */
export function lookIdOf(s: Settings): string {
  if (s.activeTheme) {
    const t = lookInfo(s.activeTheme);
    if (t && t.layout === s.theme) return t.id;
  }
  return builtinLookFor(s);
}

/** Theme files per console: where the file in use is kept, its per-file effects key, and its presets' id prefix. */
export interface FileKind { path: Path; fx: (file: string) => string; prefix: string; look: (layout: ThemeId) => string }
const own = (layout: ThemeId) => layout;
export const FILE_KINDS: Partial<Record<ThemeId, FileKind>> = {
  ps3: { path: ["xmb", "p3t"], fx: (f) => (f ? `p3t:${f}` : "ps3:"), prefix: "ps3", look: own },
  psp: { path: ["xmb", "psp"], fx: (f) => (f && f !== "-" ? `psp:${f}` : "psp:"), prefix: "psp", look: own },
  vita: { path: ["vita", "skin"], fx: (f) => (f ? `vita:${f}` : ""), prefix: "vita", look: () => "vita" },
  switch: { path: ["switchTheme"], fx: (f) => (f ? `nx:${f}` : ""), prefix: "switch", look: own },
  wii: { path: ["wiiSkin"], fx: (f) => (f ? `wii:${f}` : ""), prefix: "wii", look: own },
  wiiu: { path: ["wiiuTheme"], fx: (f) => (f ? `wiiu:${f}` : ""), prefix: "wiiu", look: own },
  n3ds: { path: ["n3dsSkin"], fx: (f) => (f ? `n3ds:${f}` : ""), prefix: "n3ds", look: own },
  xbox: { path: ["xboxSkin"], fx: (f) => (f ? `xbox:${f}` : ""), prefix: "xbox", look: own },
  // an Xbox 360 theme package fits every dashboard era; its preset belongs to the newest one (Metro)
  x360: { path: ["x360", "skin"], fx: (f) => (f ? `x360:${f}` : ""), prefix: "x360skin", look: () => "x360:metro" },
};
export const fileOf = (s: any, layout: ThemeId): string => {
  const k = FILE_KINDS[layout];
  const v = k ? getPath(s, k.path) : "";
  return typeof v === "string" ? v : "";
};

/** Settings that belong to one layout and no other (beyond the per-layout records every layout has). */
const LAYOUT_OWN: Partial<Record<ThemeId, Path[]>> = {
  vita: ["collectionFolders", "systemBubbles", "art", "skin", "bubbleStyle", "stockIcons", "artEdge", "motion", "sway", "gyro", "focus", "touch", "lock"].map((k) => ["vita", k]),
  ps3: [["xmb", "p3t"], ["xmb", "ps3Color"], ["xmb", "collectionFolders"]],
  psp: [["xmb", "psp"], ["xmb", "pspColor"], ["xmb", "pspSize"], ["xmb", "pspAccurate"], ["xmb", "collectionFolders"]],
  x360: [["x360", "guideSide"], ["x360", "skin"], ["x360", "gamerpic"]],
  dial: [["dial"]],
  ps4: [["ps4GameBackgrounds"]],
  castle: [["castleWeather"], ["castleWindows"]],
  minecraft: [["minecraftFollowFocus"], ["minecraftWaitForSwipe"], ["minecraftSlim"]],
  wiiu: [["wiiuView"], ["wiiuTheme"], ["wiiuPlazaPositions"], ["wiiuPlazaTips"]],
  switch: [["switchTheme"]],
  wii: [["wiiSkin"]],
  xbox: [["xboxSkin"]],
  n3ds: [["n3dsSkin"], ["n3dsCursor"], ["n3dsTop"], ["n3dsArrows"], ["n3dsHandle"], ["n3dsLayout"]],
};
/** Records keyed by layout: a preset holds its layout's entry. */
const PER_LAYOUT = ["iconPicks", "styles", "themeOptions", "wallpapers", "packs", "music", "musicPacks", "iconSizes", "titles", "coverStyles", "videoBackgrounds", "storeSections"];
/** Look settings that are not tied to a layout: a preset holds them too, but a preset that was never stored starts
 *  them from the factory defaults (not from whatever another preset left). */
export const GLOBAL_PATHS: Path[] = [["pages"], ["hubStyle"]];

/** Every settings path a preset of `look` holds, for the theme file `file`. */
export function lookPaths(look: string, file: string, hint?: ThemeId): Path[] {
  const layout = layoutOf(look, hint);
  const out: Path[] = [["mix", look], ...PER_LAYOUT.map((k) => [k, layout]), ...GLOBAL_PATHS, ...(LAYOUT_OWN[layout] ?? [])];
  const fx = FILE_KINDS[layout]?.fx(file);
  if (fx) out.push(["themeFx", fx]);
  return out;
}

// ───────────── path helpers and deep diff ─────────────
const plain = (v: any): v is Record<string, any> => !!v && typeof v === "object" && !Array.isArray(v);
const clone = <T,>(v: T): T => (v === undefined ? v : JSON.parse(JSON.stringify(v)));
export function getPath(o: any, path: Path): any {
  let v = o;
  for (const k of path) {
    if (!plain(v)) return undefined;
    v = v[k];
  }
  return v;
}
export function setPath(o: any, path: Path, v: any) {
  let cur = o;
  for (let i = 0; i < path.length - 1; i++) {
    if (!plain(cur[path[i]])) cur[path[i]] = {};
    cur = cur[path[i]];
  }
  if (v === undefined) delete cur[path[path.length - 1]];
  else cur[path[path.length - 1]] = v;
}
/** What `cur` changes from `def` (undefined = nothing). Objects are compared key by key; anything else whole. */
export function diffValue(cur: any, def: any): any {
  if (cur === undefined) return undefined;
  if (plain(cur) && (plain(def) || def === undefined)) {
    const out: Record<string, any> = {};
    for (const k of Object.keys(cur)) {
      const d = diffValue(cur[k], def?.[k]);
      if (d !== undefined) out[k] = d;
    }
    return Object.keys(out).length ? out : undefined;
  }
  return JSON.stringify(cur) === JSON.stringify(def) ? undefined : clone(cur);
}
/** `def` with `diff` laid over it. */
export function mergeValue(def: any, diff: any): any {
  if (diff === undefined) return clone(def);
  if (plain(def) && plain(diff)) {
    const out: Record<string, any> = clone(def);
    for (const k of Object.keys(diff)) out[k] = mergeValue(def[k], diff[k]);
    return out;
  }
  return clone(diff);
}

// ───────────── factory defaults, capture, apply ─────────────
/** The settings a look starts from: the defaults, its layout and layout options, and the computed per-file effects. */
export function factory(look: string, file: string, hint?: ThemeId): Settings {
  const info = lookInfo(look);
  const layout = layoutOf(look, hint);
  const s: any = clone(DEFAULTS);
  s.theme = layout;
  s.activeTheme = look;
  if (layout === "vita") s.vita.look = info?.layoutOptions?.vitaLook ?? "";
  if (layout === "x360") s.x360.style = info?.layoutOptions?.x360Style ?? "metro";
  const k = FILE_KINDS[layout];
  if (k) {
    setPath(s, k.path, ""); // a look starts without a theme file; `file` only picks whose effects defaults are added
    const fx = k.fx(file);
    if (fx) s.themeFx = { [fx]: themeFx(s, fx) };
  }
  return s;
}

/** The current look's state as a preset diff (what differs from the look's factory defaults). */
export function captureDiff(s: Settings, look: string, opts: { file?: string; globals?: boolean } = {}): Record<string, any> {
  const layout = layoutOf(look, s.theme);
  const file = opts.file ?? fileOf(s, layout);
  const def = factory(look, file, layout);
  const out: Record<string, any> = {};
  for (const path of lookPaths(look, file, layout)) {
    if (opts.globals === false && GLOBAL_PATHS.some((g) => g[0] === path[0])) continue;
    const cur = FILE_KINDS[layout] && path.join(".") === FILE_KINDS[layout]!.path.join(".") ? file : path[0] === "themeFx" ? (getPath(s, path) !== undefined ? themeFx(s, path[1]) : undefined) : getPath(s, path);
    const d = diffValue(cur, getPath(def, path));
    if (d !== undefined) setPath(out, path, d);
  }
  return out;
}

/** The settings patch that shows `look` with `diff`: every path of the look is set (defaults where the diff is silent). */
export function applyDiff(s: Settings, look: string, diff: Record<string, any>, hint?: ThemeId): Partial<Settings> {
  const info = lookInfo(look);
  const layout = layoutOf(look, hint ?? s.theme);
  const k = FILE_KINDS[layout];
  const fileRaw = k ? getPath(diff, k.path) : "";
  const file = typeof fileRaw === "string" ? fileRaw : "";
  const def = factory(look, file, layout);
  const paths = lookPaths(look, file, layout);
  const top = new Set(paths.map((p) => p[0]));
  if (layout === "vita") top.add("vita");
  if (layout === "x360") top.add("x360");
  const next: any = {};
  for (const key of top) next[key] = clone((s as any)[key]);
  for (const path of paths) setPath(next, path, mergeValue(getPath(def, path), getPath(diff, path)));
  // the look's own layout options (the Vita's colour look, the Xbox 360 dashboard era) are fixed by the look
  if (layout === "vita") next.vita = { ...next.vita, look: info?.layoutOptions?.vitaLook ?? "" };
  if (layout === "x360") next.x360 = { ...next.x360, style: info?.layoutOptions?.x360Style ?? "metro" };
  return { ...next, theme: layout, activeTheme: look };
}

// ───────────── migration of presets saved before v2 ─────────────
/** A preset as kept in settings.userPresets (v2): the look it belongs to and its differences. Built-in looks and theme
 *  files are stored here too (under their own preset id) once their state differs from the start. */
export interface StoredPreset { id: string; name: string; base: string; theme: ThemeId; diff: Record<string, any> }

/** Turns presets saved before v2 ({id, name, look: <39 look keys>}) into {id, name, base, diff}. The look a preset
 *  showed is kept exactly: its theme, theme file, slots, options and effects; what it held for other looks was a copy
 *  of those looks' settings at save time and is not part of the preset any more. */
export function migrateUserPreset(p: any, currentTheme: ThemeId): StoredPreset | null {
  if (!p || typeof p.id !== "string" || typeof p.name !== "string") return null;
  if (typeof p.base === "string" && plain(p.diff)) {
    const theme = (THEMES.some((t) => t.id === p.theme) ? p.theme : layoutOf(p.base, currentTheme)) as ThemeId;
    return { id: p.id, name: p.name, base: p.base, theme, diff: clone(p.diff) };
  }
  if (!p.look || typeof p.look !== "object") return null; // (an array was read as an empty look before v2: kept so)
  const old: any = cleanLook(p.look);
  const theme = (THEMES.some((t) => t.id === old.theme) ? old.theme : currentTheme) as ThemeId;
  const s: any = { ...clone(DEFAULTS), ...clone(old), theme };
  for (const k of ["vita", "xmb", "x360", "dial"] as const) s[k] = { ...(DEFAULTS as any)[k], ...(plain(old[k]) ? old[k] : {}) };
  // a data theme the registry does not know yet (it loads after the settings) is trusted with the layout it was saved with
  const known = old.activeTheme ? lookInfo(old.activeTheme) : undefined;
  const base = old.activeTheme && (known ? known.layout === theme : !BUILTIN_THEMES.some((b) => b.id === old.activeTheme)) ? old.activeTheme : builtinLookFor(s);
  s.activeTheme = base;
  return { id: p.id, name: p.name, base, theme, diff: captureDiff(s, base) };
}
export const LEGACY_LOOK_KEYS = LOOK_KEYS;
