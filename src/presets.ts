// Presets = the themes the engine knows (built-in and data themes, see src/engine)
// plus the console theme files the importers read (PS3 .p3t, PSP .ptf/.ctf, Vita, Switch .nxtheme, Wii .mym/.csm, Wii U .utheme, 3DS, Xbox, Xbox 360).
// They can be switched from Quick Access, every theme's △ menu, L2 / R2 (one flat list) or by holding L1 with the
// D-pad / left stick (up/down = console, left/right = that console's looks; consoleRows below, themeSwitcher.tsx).
import { useEffect, useState } from "react";
import { cleanLook, getSettings, LOOK_KEYS, MAX_USER_PRESETS, Settings, ThemeId, updateSettings, UserPreset, VitaLook, X360Style } from "./settings";
import { listSkins } from "./skins";
import { listSwitchThemes, SwitchListEntry } from "./switchThemes";
import { listWiiuThemes } from "./wiiuThemes";
import { activeTheme, allThemes, onThemesChanged, refreshThemes } from "./engine/registry";
import { Company, COMPANIES } from "./engine/manifest";

/** Presets are listed by company, plus the user's own. */
export type PresetGroup = Company | "My presets";
export const PRESET_GROUPS: PresetGroup[] = [...COMPANIES, "My presets"];

export interface Preset {
  id: string;
  label: string;
  theme: ThemeId;
  company: PresetGroup;
  /** The engine theme this preset selects ("" for a console theme file). */
  dataTheme: string;
  p3t?: string;
  vitaSkin?: string;
  psp?: string;
  /** Theme files of the Nintendo / Microsoft consoles ("" = the console's own look, no file). */
  switchTheme?: string;
  wiiSkin?: string;
  wiiuTheme?: string;
  n3dsSkin?: string;
  xboxSkin?: string;
  x360skin?: string;
  vitaLook?: VitaLook;
  x360?: X360Style;
  /** A preset the user saved: the whole look, restored as it was. */
  user?: UserPreset;
}

let x360names: Record<string, string> = {}; // real 360 package files are called F8E5B41D…: their titles
let skins = { p3t: [] as string[], vita: [] as string[], psp: [] as string[], xbox: [] as string[], wii: [] as string[], n3ds: [] as string[], x360: [] as string[], wiiu: [] as string[], switch: [] as SwitchListEntry[] };
const listeners = new Set<() => void>();
onThemesChanged(() => listeners.forEach((l) => l()));

export async function refreshPresets() {
  try {
    const r = await listSkins();
    x360names = r?.x360names ?? {};
    skins = { ...skins, p3t: r?.p3t ?? [], vita: r?.vita ?? [], psp: r?.psp ?? [], xbox: r?.xbox ?? [], wii: r?.wii ?? [], n3ds: r?.n3ds ?? [], x360: r?.x360 ?? [] };
  } catch {
    /* keep what we had */
  }
  try {
    skins.switch = (await listSwitchThemes())?.themes ?? [];
  } catch {
    /* keep what we had */
  }
  try {
    skins.wiiu = (await listWiiuThemes())?.themes ?? [];
  } catch {
    /* keep what we had */
  }
  await refreshThemes();
  listeners.forEach((l) => l());
}

const pretty = (f: string) => f.replace(/\.(p3t|zip|ptf|ctf|nxtheme|mym|csm|utheme|stfs)$/i, "").replace(/[_-]+/g, " ");
const tail = (f: string) => f.split("/").pop() ?? f;

export function getPresets(): Preset[] {
  const out: Preset[] = [];
  for (const t of allThemes()) {
    const o = t.layoutOptions ?? {};
    out.push({
      id: t.id,
      label: t.name,
      theme: t.layout,
      company: t.company ?? "Community",
      dataTheme: t.id,
      ...(t.layout === "ps3" ? { p3t: "" } : {}),
      ...(t.layout === "psp" ? { psp: "" } : {}),
      ...(t.layout === "vita" ? { vitaSkin: "", vitaLook: o.vitaLook ?? "" } : {}),
      ...(o.x360Style ? { x360: o.x360Style } : {}),
      // a console's own look has no theme file: choosing it clears the file
      ...(t.layout === "switch" ? { switchTheme: "" } : {}),
      ...(t.layout === "wii" ? { wiiSkin: "" } : {}),
      ...(t.layout === "wiiu" ? { wiiuTheme: "" } : {}),
      ...(t.layout === "n3ds" ? { n3dsSkin: "" } : {}),
      ...(t.layout === "xbox" ? { xboxSkin: "" } : {}),
      ...(t.layout === "x360" ? { x360skin: "" } : {}),
    });
    // console theme files are listed right after their console's own theme
    const file = (p: Omit<Preset, "company" | "dataTheme">, company: Company = "Sony") => out.push({ ...p, company, dataTheme: "" });
    if (t.id === "ps3") skins.p3t.forEach((f) => file({ id: `ps3:${f}`, label: `PS3 · ${pretty(f)}`, theme: "ps3", p3t: f }));
    if (t.id === "psp") skins.psp.forEach((f) => file({ id: `psp:${f}`, label: `PSP · ${pretty(f)}`, theme: "psp", psp: f }));
    if (t.id === "switch") skins.switch.forEach((f) => file({ id: `switch:${f.id}`, label: `Switch · ${f.name || pretty(tail(f.id))}`, theme: "switch", switchTheme: f.id }, "Nintendo"));
    if (t.id === "wii") skins.wii.forEach((f) => file({ id: `wii:${f}`, label: `Wii · ${pretty(f)}`, theme: "wii", wiiSkin: f }, "Nintendo"));
    if (t.id === "wiiu") skins.wiiu.forEach((f) => file({ id: `wiiu:${f}`, label: `Wii U · ${pretty(f)}`, theme: "wiiu", wiiuTheme: f }, "Nintendo"));
    if (t.id === "n3ds") skins.n3ds.forEach((f) => file({ id: `n3ds:${f}`, label: `Nintendo 3DS · ${pretty(f)}`, theme: "n3ds", n3dsSkin: f }, "Nintendo"));
    if (t.id === "xbox") skins.xbox.forEach((f) => file({ id: `xbox:${f}`, label: `Xbox · ${pretty(f)}`, theme: "xbox", xboxSkin: f }, "Microsoft"));
    // a 360 theme package fits every dashboard era: listed after the last era, it keeps the era in use
    if (t.id === "x360:metro") skins.x360.forEach((f) => file({ id: `x360skin:${f}`, label: `Xbox 360 · ${x360names[f] || pretty(f)}`, theme: "x360", x360skin: f }, "Microsoft"));
    if (t.id === "vita-look:sakura") skins.vita.forEach((f) => file({ id: `vita:${f}`, label: `PS Vita · ${pretty(f)}`, theme: "vita", vitaSkin: f, vitaLook: "" }));
  }
  for (const u of getSettings().userPresets) out.push({ id: u.id, label: u.name, theme: (u.look.theme ?? "ps4") as ThemeId, company: "My presets", dataTheme: u.look.activeTheme ?? "", user: u });
  return out;
}

export function currentPresetId(s: Settings = getSettings()): string {
  const own = s.userPreset ? s.userPresets.find((u) => u.id === s.userPreset) : undefined;
  if (own && own.look.theme === s.theme) return own.id;
  if (s.theme === "ps3" && s.xmb.p3t) return `ps3:${s.xmb.p3t}`;
  if (s.theme === "psp" && s.xmb.psp) return `psp:${s.xmb.psp}`;
  if (s.theme === "vita" && s.vita.skin) return `vita:${s.vita.skin}`;
  if (s.theme === "switch" && s.switchTheme) return `switch:${s.switchTheme}`;
  if (s.theme === "wii" && s.wiiSkin) return `wii:${s.wiiSkin}`;
  if (s.theme === "wiiu" && s.wiiuTheme) return `wiiu:${s.wiiuTheme}`;
  if (s.theme === "n3ds" && s.n3dsSkin) return `n3ds:${s.n3dsSkin}`;
  if (s.theme === "xbox" && s.xboxSkin) return `xbox:${s.xboxSkin}`;
  if (s.theme === "x360" && s.x360?.skin) return `x360skin:${s.x360.skin}`;
  const engine = activeTheme(s);
  if (engine) return engine.id;
  // chosen before the engine existed: the built-in theme of that layout
  if (s.theme === "vita" && s.vita.look) return `vita-look:${s.vita.look}`;
  if (s.theme === "x360") return `x360:${s.x360?.style ?? "metro"}`;
  return s.theme;
}

export function applyPreset(p: Preset) {
  if (p.user) {
    const look = cleanLook(p.user.look);
    // the Vita's folders and arrangement are the user's library, not part of the look
    updateSettings((s) => ({ ...look, ...(look.vita ? { vita: { ...s.vita, ...look.vita, folders: s.vita.folders, order: s.vita.order } } : {}), enabled: true, userPreset: p.id }));
    return;
  }
  updateSettings((s) => ({
    enabled: true,
    userPreset: "",
    pages: {}, // a theme's preset uses its own pages
    theme: p.theme,
    activeTheme: p.dataTheme,
    xmb: p.p3t !== undefined || p.psp !== undefined ? { ...s.xmb, ...(p.p3t !== undefined ? { p3t: p.p3t } : {}), ...(p.psp !== undefined ? { psp: p.psp } : {}) } : s.xmb,
    vita: p.vitaSkin !== undefined || p.vitaLook !== undefined ? { ...s.vita, ...(p.vitaSkin !== undefined ? { skin: p.vitaSkin } : {}), ...(p.vitaLook !== undefined ? { look: p.vitaLook } : {}) } : s.vita,
    x360: p.x360 !== undefined || p.x360skin !== undefined ? { ...s.x360, ...(p.x360 !== undefined ? { style: p.x360 } : {}), ...(p.x360skin !== undefined ? { skin: p.x360skin } : {}) } : s.x360,
    ...(p.switchTheme !== undefined ? { switchTheme: p.switchTheme } : {}),
    ...(p.wiiSkin !== undefined ? { wiiSkin: p.wiiSkin } : {}),
    ...(p.wiiuTheme !== undefined ? { wiiuTheme: p.wiiuTheme } : {}),
    ...(p.n3dsSkin !== undefined ? { n3dsSkin: p.n3dsSkin } : {}),
    ...(p.xboxSkin !== undefined ? { xboxSkin: p.xboxSkin } : {}),
  }));
}

/** Step through the list (L2 / R2). Returns the preset now active. */
export function cyclePreset(dir: number): Preset {
  const list = getPresets();
  if (!list.length) return { id: getSettings().theme, label: "No themes installed · open Hub", theme: getSettings().theme, company: "Sony", dataTheme: "" };
  const i = Math.max(0, list.findIndex((p) => p.id === currentPresetId()));
  const next = list[(i + dir + list.length) % list.length];
  applyPreset(next);
  return next;
}

// ───────────── Hold L1 + direction: presets as consoles × variants ─────────────

/** One console of the theme switcher: its own look first, then its other looks, theme files and the user's saved presets. */
export interface ConsoleRow {
  key: string;
  label: string;
  company: PresetGroup;
  presets: Preset[];
}
/** Console order of the switcher's up/down axis; bonus looks follow in their built-in order, installed themes last. */
const CONSOLE_ORDER = ["wii", "wiiu", "switch", "n3ds", "ps1", "ps2", "ps3", "psp", "ps4", "ps5", "vita", "xbox", "x360"];
const CONSOLE_NAMES: Record<string, string> = { wii: "Wii", wiiu: "Wii U", switch: "Switch", n3ds: "3DS", ps1: "PS1", ps2: "PS2", ps3: "PS3", psp: "PSP", ps4: "PS4", ps5: "PS5", vita: "PS Vita", xbox: "Xbox", x360: "Xbox 360" };

/** The presets grouped by console (hidden looks are already left out of getPresets). */
export function consoleRows(list: Preset[] = getPresets()): ConsoleRow[] {
  const installed = new Set(allThemes().filter((t) => t.source !== "builtin").map((t) => t.id)); // data themes: a console of their own
  const keyOf = (p: Preset) => (p.dataTheme && installed.has(p.dataTheme) ? `theme:${p.dataTheme}` : p.theme);
  const rows = new Map<string, ConsoleRow>();
  for (const p of list) {
    const key = keyOf(p);
    let row = rows.get(key);
    if (!row) {
      if (p.user) continue; // a saved preset whose console is hidden or gone
      const label = CONSOLE_NAMES[key] ?? p.label.replace(/\s*\(bonus\)\s*$/i, "").replace(/ · .*$/, "");
      rows.set(key, (row = { key, label, company: p.company, presets: [] }));
    }
    row.presets.push(p);
  }
  // saved presets come after the console's own looks and files
  for (const r of rows.values()) r.presets.sort((a, b) => Number(!!a.user) - Number(!!b.user));
  const rank = (r: ConsoleRow) => {
    const i = CONSOLE_ORDER.indexOf(r.key);
    if (i >= 0) return i;
    return r.key.startsWith("theme:") ? 2000 : 1000;
  };
  return [...rows.values()].map((r, i) => ({ r, i })).sort((a, b) => rank(a.r) - rank(b.r) || a.i - b.i).map((x) => x.r);
}

/** What the switcher's variant row calls a preset inside its console: "Default", "Blades (2005)", "ZenGarden.p3t", a saved preset's name. */
export function variantLabel(row: ConsoleRow, p: Preset): string {
  if (p.user) return `★ ${p.label}`;
  const file = p.p3t || p.psp || p.vitaSkin || p.wiiSkin || p.wiiuTheme || p.n3dsSkin;
  if (file) return tail(file);
  const rest = p.label.startsWith(`${row.label} · `) ? p.label.slice(row.label.length + 3) : p.label.includes(" · ") ? p.label.replace(/^[^·]*· /, "") : "";
  return rest || "Default";
}

/** Where a preset sits in the switcher: [console index, variant index], or null. */
export function switcherPosition(rows: ConsoleRow[], id: string): [number, number] | null {
  for (let r = 0; r < rows.length; r++) {
    const v = rows[r].presets.findIndex((p) => p.id === id);
    if (v >= 0) return [r, v];
  }
  return null;
}

export function usePresets(): Preset[] {
  const [, setRev] = useState(0);
  useEffect(() => {
    const l = () => setRev((r) => r + 1);
    listeners.add(l);
    return () => {
      listeners.delete(l);
    };
  }, []);
  return getPresets();
}

/** The company group of the preset in use. */
export function presetCompany(s: Settings = getSettings()): PresetGroup {
  const id = currentPresetId(s);
  return getPresets().find((p) => p.id === id)?.company ?? "Sony";
}
export function presetGroups() {
  const all = getPresets();
  return PRESET_GROUPS.map((name) => ({ name, presets: all.filter((p) => p.company === name) })).filter((g) => g.presets.length || (g.name !== "Community" && g.name !== "My presets"));
}

// ───────────── the user's own presets ─────────────

/** The look as it is now: home theme, pages, mixed slots and every theme's own settings. */
function currentLook(s: Settings): UserPreset["look"] {
  const look: any = {};
  for (const k of LOOK_KEYS) if (s[k] !== undefined) look[k] = JSON.parse(JSON.stringify(s[k]));
  if (look.vita) {
    delete look.vita.folders;
    delete look.vita.order;
  }
  return look;
}

/** Save the current look as a new preset of the user's own. Returns it, or null when the list is full. */
export function saveUserPreset(): UserPreset | null {
  const s = getSettings();
  if (s.userPresets.length >= MAX_USER_PRESETS) return null;
  const n = Math.max(0, ...s.userPresets.map((p) => Number(p.id.slice(3)) || 0)) + 1;
  const home = getPresets().find((p) => p.id === currentPresetId(s) && !p.user)?.label ?? s.theme;
  const preset: UserPreset = { id: `my:${n}`, name: `My preset ${n} · ${home}`, look: currentLook(s) };
  updateSettings((p) => ({ userPresets: [...p.userPresets, preset], userPreset: preset.id, presetCompany: "My presets" }));
  return preset;
}

/** Store the current look in the saved preset in use. */
export function updateUserPreset(id: string) {
  updateSettings((s) => ({ userPresets: s.userPresets.map((p) => (p.id === id ? { ...p, look: currentLook(s) } : p)) }));
}

export function deleteUserPreset(id: string) {
  updateSettings((s) => ({ userPresets: s.userPresets.filter((p) => p.id !== id), userPreset: s.userPreset === id ? "" : s.userPreset }));
}

/** Keep native dropdown selection valid when browsing a different company. */
export function presetPickerState(s: Settings, presets: Preset[]) {
  const company = s.presetCompany ?? presetCompany(s);
  const filtered = presets.filter((p) => p.company === company);
  const current = currentPresetId(s);
  const selected = filtered.some((p) => p.id === current) ? current : "__choose__";
  const options = [...(selected === "__choose__" ? [{ data: "__choose__", label: "Choose a preset…" }] : []), ...filtered.map((p) => ({ data: p.id, label: p.label }))];
  return { company, selected, options };
}
