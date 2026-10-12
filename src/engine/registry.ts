// The theme engine's list of themes: the built-in ones plus the data themes
// found on the Deck, and the rules that decide what fills each slot of the
// theme in use (its own files, or another theme's when the user mixes them).
import { callable } from "@decky/api";
import { useEffect, useState } from "react";
import { getSettings, Settings, THEMES, ThemeId, updateSettings } from "../settings";
import { autoPack, setEngineHooks, SoundPack } from "../steam";
import { BUILTIN_THEMES } from "./builtin";
import { SlotKind, ThemeEntry, validateManifest } from "./manifest";

interface BackendPack { files: string[]; mappings: Record<string, string[]>; ignore: string[] }
type BackendTheme = Record<string, unknown> & { source?: string; packs?: Partial<Record<"sounds" | "music", BackendPack>>; icons?: Record<string, string> };
const backendThemes = callable<[], { base: string | null; wrap?: string | null; themes: BackendTheme[]; dir?: string; errors?: { file: string; error: string }[] } | null>("list_data_themes");
const backendImport = callable<[path: string], { ok: boolean; id?: string; name?: string; error?: string } | null>("import_data_theme");

const LAYOUTS = THEMES.map((t) => t.id) as readonly string[];
let base: string | null = null;
/** Where community interfaces are opened: our wrapper page, which keeps the interface's frame on its own folder. */
let wrap: string | null = null;
/** Where the user's own themes go, and theme zips there that were refused (and why). */
export const userThemes = { dir: "", errors: [] as { file: string; error: string }[] };
let found: ThemeEntry[] = [];
let packs = new Map<string, Partial<Record<"sounds" | "music", BackendPack>>>();
let icons = new Map<string, Record<string, string>>();
const ICON_NAME = /^[a-z0-9][a-z0-9-]{0,40}$/;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

/** Read the data themes from the Deck again (after adding or removing one). */
export async function refreshThemes() {
  try {
    const r = await backendThemes();
    base = r?.base ?? null;
    wrap = typeof r?.wrap === "string" ? r.wrap : null;
    userThemes.dir = typeof r?.dir === "string" ? r.dir : "";
    userThemes.errors = Array.isArray(r?.errors) ? r.errors.filter((e) => e && typeof e.file === "string" && typeof e.error === "string").slice(0, 20) : [];
    const next: ThemeEntry[] = [];
    const nextPacks = new Map<string, Partial<Record<"sounds" | "music", BackendPack>>>();
    const nextIcons = new Map<string, Record<string, string>>();
    for (const raw of r?.themes ?? []) {
      const v = validateManifest(raw, LAYOUTS);
      if (!v.ok) {
        console.warn("[DeckHomeThemes] theme refused:", (raw as any)?.id, v.reason);
        continue;
      }
      if (BUILTIN_THEMES.some((b) => b.id === v.theme.id)) continue; // built-in ids are reserved
      next.push({ ...v.theme, company: v.theme.company ?? "Community", source: raw.source === "bundled" ? "bundled" : "user" });
      if (raw.packs) nextPacks.set(v.theme.id, raw.packs);
      if (raw.icons && typeof raw.icons === "object") {
        const own = Object.fromEntries(Object.entries(raw.icons).filter(([n, f]) => ICON_NAME.test(n) && typeof f === "string" && !f.includes("..")).slice(0, 300));
        if (Object.keys(own).length) nextIcons.set(v.theme.id, own);
      }
    }
    found = next;
    packs = nextPacks;
    icons = nextIcons;
  } catch {
    /* keep what we had */
  }
  emit();
}

/** Copy a theme .zip the user picked into the themes folder (the backend checks it first), then list the themes again. */
export async function importThemeZip(path: string): Promise<{ ok: boolean; id?: string; name?: string; error?: string }> {
  const r = await backendImport(path).catch((e) => ({ ok: false, error: String(e) }));
  if (r?.ok) await refreshThemes();
  return r ?? { ok: false, error: "No answer from the plugin" };
}

export const onThemesChanged =(l: () => void) => {
  listeners.add(l);
  return () => void listeners.delete(l);
};

export function allThemes(s: Settings = getSettings()): ThemeEntry[] {
  const builtin: ThemeEntry[] = BUILTIN_THEMES.filter((t) => !s.hiddenThemes?.includes(t.layout)).map((t) => ({ ...t, source: "builtin" }));
  return [...builtin, ...found];
}

export const findTheme = (id: string): ThemeEntry | undefined => allThemes().find((t) => t.id === id);

/** The theme in use, if the user picked one through the engine and its layout is on screen. */
export function activeTheme(s: Settings = getSettings()): ThemeEntry | null {
  if (!s.activeTheme) return null;
  const t = findTheme(s.activeTheme);
  return t && t.layout === s.theme ? t : null;
}

export function useThemes(): ThemeEntry[] {
  const [, setRev] = useState(0);
  useEffect(() => onThemesChanged(() => setRev((r) => r + 1)), []);
  return allThemes();
}

/** URL of a file inside a data theme's folder (served by the plugin's local server). */
export function themeFileUrl(theme: ThemeEntry, rel: string): string | null {
  if (theme.source === "builtin" || !base) return null;
  return `${base}/${encodeURIComponent(theme.id)}/${rel.split("/").map(encodeURIComponent).join("/")}`;
}

/**
 * URL a community interface (layout "frame") is opened at: the plugin's wrapper page for it (py_modules/data_themes.py:
 * frame_wrapper), never the theme's page itself, so the interface can't navigate its frame elsewhere. null = can't open.
 */
export function frameUrl(theme: ThemeEntry): string | null {
  if (theme.source === "builtin" || !wrap || !theme.frame) return null;
  return `${wrap}/${encodeURIComponent(theme.id)}/${theme.frame.entry.split("/").map(encodeURIComponent).join("/")}`;
}

// ───────────── slots ─────────────

/** Who supplies a slot of `theme`: the theme itself, or another theme chosen in Mix and match. */
export function slotSource(theme: ThemeEntry, slot: SlotKind, s: Settings = getSettings()): ThemeEntry | null {
  const from = s.mix?.[theme.id]?.[slot];
  if (from === "none") return null;
  if (from) return findTheme(from) ?? theme;
  return theme;
}

export function setMix(themeId: string, slot: SlotKind, from: string | undefined) {
  updateSettings((p) => {
    const mine = { ...(p.mix[themeId] ?? {}) };
    if (from === undefined) delete mine[slot];
    else mine[slot] = from;
    return { mix: { ...p.mix, [themeId]: mine } };
  });
}

/** Does this theme bring something of its own for the slot? Built-in themes always do (their layout's default). */
export function hasSlot(theme: ThemeEntry, slot: SlotKind): boolean {
  if (theme.source === "builtin") return slot === "sounds" || slot === "music";
  if (slot === "sounds" || slot === "music") return !!packs.get(theme.id)?.[slot]?.files.length;
  if (slot === "icons") return !!icons.get(theme.id);
  return !!theme.slots?.[slot];
}

function themePack(theme: ThemeEntry, kind: "sfx" | "music"): SoundPack | null | undefined {
  const slot = kind === "sfx" ? "sounds" : "music";
  if (theme.source === "builtin") return autoPack(theme.layout, kind);
  const p = packs.get(theme.id)?.[slot];
  const rel = theme.slots?.[slot];
  if (!p || !rel || !p.files.length) return undefined;
  const url = themeFileUrl(theme, rel);
  if (!url) return undefined;
  return { name: `${theme.name} · ${slot}`, folder: `@${theme.id}:${slot}`, files: p.files, mappings: p.mappings, ignore: p.ignore, music: kind === "music", author: theme.author ?? "", base: url };
}

/**
 * What a slot holds for the theme in use. undefined = the engine has no say
 * (no engine theme is active, or it leaves the slot to the layout).
 */
export function slotUrl(slot: Exclude<SlotKind, "sounds" | "music" | "accent" | "icons">, s: Settings = getSettings()): string | null | undefined {
  const t = activeTheme(s);
  if (!t) return undefined;
  const from = slotSource(t, slot, s);
  if (!from) return null;
  const rel = from.slots?.[slot];
  return rel ? themeFileUrl(from, rel) ?? undefined : from === t ? undefined : null;
}

export function slotAccent(s: Settings = getSettings()): string | undefined {
  const t = activeTheme(s);
  if (!t) return undefined;
  return slotSource(t, "accent", s)?.slots?.accent;
}

// ───────────── icons ─────────────

/** A theme's own icons: name → URL. */
export function themeIcons(theme: ThemeEntry): Record<string, string> {
  const own = icons.get(theme.id);
  if (!own) return {};
  return Object.fromEntries(Object.entries(own).flatMap(([n, rel]) => {
    const url = themeFileUrl(theme, rel);
    return url ? [[n, url]] : [];
  }));
}

/** Every icon any theme brings, for picking one icon at a time. */
export function allIcons(): { theme: ThemeEntry; name: string; url: string; key: string }[] {
  return allThemes().flatMap((t) => Object.entries(themeIcons(t)).map(([name, url]) => ({ theme: t, name, url, key: `${t.id}/${name}` })));
}

function pickedIcon(key: string): string | undefined {
  const cut = key.lastIndexOf("/");
  const t = cut > 0 ? findTheme(key.slice(0, cut)) : undefined;
  return t ? themeIcons(t)[key.slice(cut + 1)] : undefined;
}

/**
 * The picture for an icon spot of the layout on screen, or undefined to draw
 * the layout's own. A spot picked by hand wins; then the icon set (the theme's
 * own icons, or another theme's chosen in Mix and match).
 */
export function iconUrl(spot: string, s: Settings = getSettings()): string | undefined {
  const pick = s.iconPicks?.[s.theme]?.[spot];
  if (pick) return pickedIcon(pick);
  const t = activeTheme(s);
  if (!t) return undefined;
  const from = slotSource(t, "icons", s);
  return from ? themeIcons(from)[spot] : undefined;
}

/** The icons a community interface receives: its icon set plus anything picked by hand. */
export function iconMap(s: Settings = getSettings()): Record<string, string> {
  const t = activeTheme(s);
  const from = t ? slotSource(t, "icons", s) : null;
  const out: Record<string, string> = from ? { ...themeIcons(from) } : {};
  for (const [spot, key] of Object.entries(s.iconPicks?.[s.theme] ?? {})) {
    const url = key ? pickedIcon(key) : undefined;
    if (url) out[spot] = url;
  }
  return out;
}

setEngineHooks({
  pack(theme: ThemeId, kind) {
    const s = getSettings();
    const t = activeTheme(s);
    if (!t || t.layout !== theme) return undefined;
    const from = slotSource(t, kind === "sfx" ? "sounds" : "music", s);
    if (!from) return null;
    if (from === t && t.source === "builtin") return undefined; // the layout's usual rules
    return themePack(from, kind);
  },
  wallpaper(theme: ThemeId) {
    const t = activeTheme();
    if (!t || t.layout !== theme) return undefined;
    return slotUrl("wallpaper");
  },
});
