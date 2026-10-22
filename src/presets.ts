import { t } from "./i18n";
// Presets v2 (handoff-notes/presets-v2.md): one preset type.
//
// A preset belongs to one look (an engine theme: a built-in look or a community data theme) and holds the look's whole
// state as differences from that look's factory defaults (src/lookState.ts). Every look has
//   • its default preset (id = the look id, "wiiu", "x360:metro"),
//   • one preset per imported theme file of its console ("ps3:ZenGarden.p3t", "switch:Aqua.nxtheme", …),
//   • the user's own presets saved on it ("my:<n>").
// They are the same object: the preset in use keeps its state (when another preset or look is picked, what changed is
// stored under its id in settings.userPresets), any preset can be renamed, the user's own can be deleted and built-in
// ones reset. Switching (L2 / R2 across every look, L1 left / right within a look, Quick Access, the △ / Y menu), saving
// and the "this theme" scope all work on this one object. Holding L1 with the D-pad / left stick shows the switcher
// (up/down = console, left/right = the console's presets, looks in order: consoleRows below, themeSwitcher.tsx).
import { useEffect, useState } from "react";
import { callable } from "@decky/api";
import { cleanSettings, getRawSettings, getSettings, MAX_STORED_PRESETS, MAX_USER_PRESETS, setLookChangeHook, Settings, ThemeId, updateSettings, UserPreset } from "./settings";
import { listSkins } from "./skins";
import { listSwitchThemes, SwitchListEntry } from "./switchThemes";
import { listWiiuThemes } from "./wiiuThemes";
import { activeTheme, allThemes, onThemesChanged, refreshThemes } from "./engine/registry";
import { Company, COMPANIES } from "./engine/manifest";
import { applyDiff, captureDiff, FILE_KINDS, fileOf, getPath, GLOBAL_PATHS, layoutOf, lookIdOf, setPath } from "./lookState";

/** Presets are listed by the company of their look. */
export type PresetGroup = Company;
export const PRESET_GROUPS: PresetGroup[] = [...COMPANIES];

export interface Preset {
  id: string;
  label: string;
  /** The look this preset belongs to (an engine theme id). */
  look: string;
  /** The layout the look draws with. */
  theme: ThemeId;
  company: PresetGroup;
  /** Where it comes from: the look's default, an imported theme file, or saved by the user. Only the label and the
   *  menu entries (Delete for saved ones, Reset for the others) differ. */
  origin: "default" | "file" | "saved";
  /** The theme file it shows ("" = none). */
  file: string;
  /** Kept for code written before v2: the same as `look`. */
  dataTheme: string;
  /** Its stored state, when it has one. */
  user?: UserPreset;
}

let x360names: Record<string, string> = {}; // real 360 package files are called F8E5B41D…: their titles
let skins = { p3t: [] as string[], vita: [] as string[], psp: [] as string[], xbox: [] as string[], wii: [] as string[], n3ds: [] as string[], x360: [] as string[], wiiu: [] as string[], switch: [] as SwitchListEntry[] };
const listeners = new Set<() => void>();
onThemesChanged(() => listeners.forEach((l) => l()));

// Downloaded theme packs (theme_inventory) plus the themes that ship inside the plugin. The switchers (L1 hold, L2 / R2)
// and the Quick Access Look list only offer looks whose console is here: never a deleted or not yet downloaded theme. null = not read yet.
const remoteInventory = callable<[], Record<string, string>>("theme_inventory");
/** No layout is implicitly installed: every shipped look has a downloadable pack. */
export const BUILT_IN_THEMES = ["ios6", "gameamp", "old-beta-big-picture", "old-big-picture"] as const;
let downloaded: Record<string, string> | null = null;
export async function refreshInventory(): Promise<Record<string, string>> {
  const remote = await remoteInventory();
  downloaded = { ...(remote ?? {}) };
  return downloaded;
}
/** A console (layout) whose pack is downloaded or built in; true until the inventory has been read. */
export const isDownloaded = (layout: string) => !!downloaded?.[layout];
export const presetAvailable = (p: Preset) => (p.theme === "old-big-picture" || p.theme === "old-beta-big-picture") ? true : (p.theme === "native" || p.theme === "frame") ? (allThemes().find(t=>t.id===p.dataTheme)?.source==="user" || isDownloaded(p.dataTheme??"")) : isDownloaded(p.theme);
const switchable = (list: Preset[]) => list.filter(presetAvailable);
/** The presets the switchers step through: getPresets() without the consoles that are not downloaded. */
export const switchPresets = (s: Settings = getSettings()) => switchable(getPresets(s));

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
  try {
    await refreshInventory();
  } catch {
    /* keep what we had */
  }
  await refreshThemes();
  listeners.forEach((l) => l());
}
/** The theme files found per console (for the asset browser). */
export const installedFiles = () => ({ ...skins, x360names });

const pretty = (f: string) => f.replace(/\.(p3t|zip|ptf|ctf|nxtheme|mym|csm|utheme|stfs)$/i, "").replace(/[_-]+/g, " ");
const tail = (f: string) => f.split("/").pop() ?? f;
const CONSOLE: Partial<Record<ThemeId, string>> = { ps3: "PS3", psp: "PSP", vita: "PS Vita", switch: "Switch", wii: "Wii", wiiu: "Wii U", n3ds: "Nintendo 3DS", xbox: "Xbox", x360: "Xbox 360" };
/** Theme files of a look's console that are presets of this look: [file, label]. */
function lookFiles(look: string, layout: ThemeId): [string, string][] {
  const k = FILE_KINDS[layout];
  if (!k || k.look(layout) !== look) return [];
  const c = CONSOLE[layout] ?? layout;
  if (layout === "switch") return skins.switch.map((f) => [f.id, `${c} · ${f.name || pretty(tail(f.id))}`]);
  if (layout === "x360") return skins.x360.map((f) => [f, `${c} · ${x360names[f] || pretty(f)}`]);
  const list = layout === "ps3" ? skins.p3t : layout === "psp" ? skins.psp : layout === "vita" ? skins.vita : layout === "wii" ? skins.wii : layout === "wiiu" ? skins.wiiu : layout === "n3ds" ? skins.n3ds : layout === "xbox" ? skins.xbox : [];
  return list.map((f) => [f, `${c} · ${pretty(f)}`]);
}
export const filePresetId = (layout: ThemeId, file: string) => `${FILE_KINDS[layout]?.prefix ?? layout}:${file}`;

export function getPresets(s: Settings = getSettings()): Preset[] {
  const out: Preset[] = [];
  const stored = new Map(s.userPresets.map((u) => [u.id, u]));
  for (const t of allThemes(s)) {
    const company = t.company ?? "Community";
    const base = { look: t.id, theme: t.layout, company, dataTheme: t.id };
    const def = stored.get(t.id);
    out.push({ ...base, id: t.id, label: def?.name || t.name, origin: "default", file: "", user: def });
    // the console's theme files are listed right after its own look
    for (const [file, label] of lookFiles(t.id, t.layout)) {
      const id = filePresetId(t.layout, file);
      const u = stored.get(id);
      out.push({ ...base, id, label: u?.name || label, origin: "file", file, user: u });
    }
    for (const u of s.userPresets) if (u.id.startsWith("my:") && u.base === t.id) out.push({ ...base, id: u.id, label: u.name, origin: "saved", file: fileOf(u.diff, t.layout), user: u });
  }
  return out;
}
/** The presets of one look, in the order L1 left / right steps through them. */
export const lookPresets = (look: string, s: Settings = getSettings()) => getPresets(s).filter((p) => p.look === look);
/** The look on screen. */
export const currentLook = (s: Settings = getSettings()) => lookIdOf(s);

export function currentPresetId(s: Settings = getSettings()): string {
  const look = lookIdOf(s);
  if (s.userPreset) {
    const u = s.userPresets.find((p) => p.id === s.userPreset);
    if (u ? u.base === look : s.userPreset === look || isFilePresetOf(s.userPreset, look, s)) return s.userPreset;
  }
  const layout = layoutOf(look, s.theme);
  const file = fileOf(s, layout);
  if (file && file !== "-" && FILE_KINDS[layout]?.look(layout) === look) return filePresetId(layout, file);
  return look;
}
const isFilePresetOf = (id: string, look: string, s: Settings) => {
  const layout = layoutOf(look, s.theme);
  const k = FILE_KINDS[layout];
  return !!k && k.look(layout) === look && id.startsWith(`${k.prefix}:`);
};

// ───────────── the state a preset shows ─────────────
/** A preset's differences: its stored state, or how it starts. The default preset of a look that was never stored
 *  starts from what is set for its layout now (so options chosen before v2 stay); a theme file starts from its look's
 *  default preset plus the file and that file's own effects. */
export function presetDiff(p: Preset, s: Settings = getRawSettings()): Record<string, any> {
  if (p.user) return p.user.diff;
  const live = (file: string) => captureDiff({ ...s, theme: p.theme, activeTheme: p.look } as Settings, p.look, { file, globals: false });
  if (p.origin === "default") return live("");
  const k = FILE_KINDS[p.theme];
  const stored = s.userPresets.find((u) => u.id === p.look);
  const d = JSON.parse(JSON.stringify(stored ? stored.diff : live("")));
  delete d.themeFx;
  if (k) {
    setPath(d, k.path, p.file);
    const own = getPath(live(p.file), ["themeFx", k.fx(p.file)]);
    if (own) setPath(d, ["themeFx", k.fx(p.file)], own);
  }
  return d;
}

/** The preset in use keeps its state: stored under its id (a new entry when it had none). */
function remember(s: Settings, list: UserPreset[] = s.userPresets): UserPreset[] {
  const look = lookIdOf(s);
  if (!look) return list;
  const id = currentPresetId(s);
  const prev = list.find((u) => u.id === id);
  const entry: UserPreset = { id, name: prev?.name ?? "", base: look, theme: s.theme, diff: captureDiff(s, look) };
  if (prev) return list.map((u) => (u.id === id ? entry : u));
  if (id.startsWith("my:")) return list; // a deleted saved preset is not brought back
  // the oldest kept state of a built-in or theme-file preset gives way first
  const kept = list.filter((u) => !u.id.startsWith("my:"));
  const trimmed = kept.length >= MAX_STORED_PRESETS ? list.filter((u) => u !== kept[0]) : list;
  return [...trimmed, entry];
}

let applying = false;
// a change that shows another look without going through applyPreset (a layout picked directly, the Hub, onboarding):
// the preset that was in use keeps its state, as it does when a preset is picked
setLookChangeHook((before, patch) => {
  if (applying || (patch.theme === undefined && patch.activeTheme === undefined && patch.vita === undefined && patch.x360 === undefined)) return patch;
  const next = { ...before, ...patch } as Settings;
  if (lookIdOf(next) === lookIdOf(before)) return patch;
  return { ...patch, userPresets: remember(before, patch.userPresets ?? before.userPresets), ...(patch.userPreset === undefined ? { userPreset: "" } : {}) };
});

/** Show a preset: the one in use keeps its state, then every setting of the preset's look is set from its state. */
export function applyPreset(p: Preset) {
  applying = true;
  try {
    updateSettings((cur) => {
      const userPresets = remember(cur);
      const target = getPresets({ ...cur, userPresets }).find((x) => x.id === p.id) ?? p;
      const patch = applyDiff(cur, target.look, presetDiff(target, { ...cur, userPresets }), target.theme);
      // a damaged or hand-edited stored state can only set values of the right type (cleanSettings checks them)
      const clean = cleanSettings({ ...cur, ...patch, userPresets });
      const out: any = {};
      for (const k of Object.keys(patch)) out[k] = (clean as any)[k];
      if (out.vita) out.vita = { ...out.vita, folders: cur.vita.folders, order: cur.vita.order }; // the Vita's folders are the user's library
      return { ...out, userPresets, userPreset: target.id, enabled: true };
    });
  } finally {
    applying = false;
  }
}

/** Step through every preset of every look (L2 / R2). Returns the preset now active. */
export function cyclePreset(dir: number): Preset {
  const list = switchPresets();
  if (!list.length) return { id: getSettings().theme, label: "No themes installed · open Hub", look: getSettings().theme, theme: getSettings().theme, company: "Sony", origin: "default", file: "", dataTheme: "" };
  const i = Math.max(0, list.findIndex((p) => p.id === currentPresetId()));
  const next = list[(i + dir + list.length) % list.length];
  applyPreset(next);
  return next;
}
/** Step through the presets of the look on screen (L1 left / right). */
export function cycleLookPreset(dir: number): Preset {
  const list = switchable(lookPresets(currentLook()));
  if (!list.length) return cyclePreset(dir);
  const i = Math.max(0, list.findIndex((p) => p.id === currentPresetId()));
  const next = list[(i + dir + list.length) % list.length];
  if (next.id !== currentPresetId()) applyPreset(next);
  return next;
}
/** Step to the next / previous look (L1 up / down): its default preset. */
export function cycleLook(dir: number): Preset {
  const looks = switchPresets().filter((p) => p.origin === "default");
  if (!looks.length) return cyclePreset(dir);
  const i = Math.max(0, looks.findIndex((p) => p.look === currentLook()));
  const next = looks[(i + dir + looks.length) % looks.length];
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

/** The presets grouped by console (hidden looks are already left out of getPresets). A console's row is the presets of
 *  each of its looks in turn (presets v2: one list, `lookPresets`): a look's default, its theme files, its saved
 *  presets; then the next look of that console (Xbox 360 Blades → NXE → Kinect → Metro, PS Vita Default → Sakura). */
export function consoleRows(list: Preset[] = switchPresets()): ConsoleRow[] {
  const installed = new Set(allThemes().filter((t) => t.source !== "builtin").map((t) => t.id)); // data themes: a console of their own
  const keyOf = (p: Preset) => (p.dataTheme && installed.has(p.dataTheme) ? `theme:${p.dataTheme}` : p.theme);
  const rows = new Map<string, ConsoleRow>();
  for (const p of list) {
    const key = keyOf(p);
    let row = rows.get(key);
    if (!row) {
      if (p.origin === "saved") continue; // a saved preset whose console is hidden or gone
      const label = CONSOLE_NAMES[key] ?? p.label.replace(/\s*\(bonus\)\s*$/i, "").replace(/ · .*$/, "");
      rows.set(key, (row = { key, label, company: p.company, presets: [] }));
    }
    row.presets.push(p);
  }
  const rank = (r: ConsoleRow) => {
    const i = CONSOLE_ORDER.indexOf(r.key);
    if (i >= 0) return i;
    return r.key.startsWith("theme:") ? 2000 : 1000;
  };
  return [...rows.values()].map((r, i) => ({ r, i })).sort((a, b) => rank(a.r) - rank(b.r) || a.i - b.i).map((x) => x.r);
}

/** What the switcher's variant row calls a preset inside its console: "Default", "Blades (2005)", "ZenGarden.p3t", a saved preset's name. */
export function variantLabel(row: ConsoleRow, p: Preset): string {
  if (p.origin === "saved") return `★ ${p.label}`;
  if (p.origin === "file" && p.user?.name) return p.user.name; // a renamed theme-file preset
  if (p.file && p.theme !== "switch" && p.theme !== "xbox" && p.theme !== "x360") return tail(p.file);
  const rest = p.label.startsWith(`${row.label} · `) ? p.label.slice(row.label.length + 3) : p.label.includes(" · ") ? p.label.replace(/^[^·]*· /, "") : "";
  const name = rest || "Default";
  const loc = t(name);
  return loc !== name ? loc : name;
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
  return (activeTheme(s)?.company ?? "Sony") as PresetGroup;
}
export function presetGroups() {
  const all = getPresets();
  return PRESET_GROUPS.map((name) => ({ name, presets: all.filter((p) => p.company === name) })).filter((g) => g.presets.length || g.name !== "Community");
}

// ───────────── saving, renaming, deleting ─────────────
/** Save the look on screen as a new preset of the user's own (on the same look). Returns it, or null when the list is full. */
export function saveUserPreset(name?: string): UserPreset | null {
  const s = getRawSettings();
  const mine = s.userPresets.filter((p) => p.id.startsWith("my:"));
  if (mine.length >= MAX_USER_PRESETS) return null;
  const n = Math.max(0, ...mine.map((p) => Number(p.id.slice(3)) || 0)) + 1;
  const home = getPresets(getSettings()).find((p) => p.id === currentPresetId(s))?.label ?? s.theme;
  const preset: UserPreset = { id: `my:${n}`, name: (name || `My preset ${n} · ${home}`).slice(0, 60), base: lookIdOf(s), theme: s.theme, diff: captureDiff(s, lookIdOf(s)) };
  applying = true;
  try {
    updateSettings((p) => ({ userPresets: [...remember(p), preset], userPreset: preset.id }));
  } finally {
    applying = false;
  }
  return preset;
}
/** Store the look on screen in the preset in use (it also keeps it by itself when another preset is picked). */
export function updateUserPreset(id: string = currentPresetId()) {
  if (id !== currentPresetId()) return;
  updateSettings((s) => ({ userPresets: remember(s) }));
}
export function renamePreset(id: string, name: string) {
  const clean = name.trim().slice(0, 60);
  updateSettings((s) => {
    const list = s.userPresets.some((u) => u.id === id) ? s.userPresets : id === currentPresetId(s) ? remember(s) : s.userPresets;
    const p = getPresets(s).find((x) => x.id === id);
    if (!list.some((u) => u.id === id) && p) return { userPresets: [...list, { id, name: clean, base: p.look, theme: p.theme, diff: presetDiff(p, s) }] };
    return { userPresets: list.map((u) => (u.id === id ? { ...u, name: clean } : u)) };
  });
}
/** Delete a saved preset; for a built-in or theme-file preset, forget its stored state (back to how it starts). */
export function deleteUserPreset(id: string) {
  const s = getRawSettings();
  const wasCurrent = currentPresetId(s) === id;
  const p = getPresets(getSettings()).find((x) => x.id === id);
  applying = true;
  try {
    updateSettings((cur) => ({ userPresets: cur.userPresets.filter((u) => u.id !== id), ...(wasCurrent ? { userPreset: "" } : {}) }));
  } finally {
    applying = false;
  }
  if (!wasCurrent) return;
  // the look stays on screen: a deleted saved preset falls back to the look's default; a reset one shows its start
  const back = getPresets().find((x) => x.id === (p?.origin === "saved" ? p.look : id));
  if (back) applyWithoutRemember(back);
}
const applyWithoutRemember = (p: Preset) => {
  applying = true;
  try {
    updateSettings((cur) => {
      const patch = applyDiff(cur, p.look, presetDiff(p, cur), p.theme);
      const clean = cleanSettings({ ...cur, ...patch });
      const out: any = {};
      for (const k of Object.keys(patch)) out[k] = (clean as any)[k];
      if (out.vita) out.vita = { ...out.vita, folders: cur.vita.folders, order: cur.vita.order };
      return { ...out, userPreset: p.id };
    });
  } finally {
    applying = false;
  }
};
/** Has the preset in use changed since it was stored? (Shown as "· changed" in the menus.) */
export function presetChanged(s: Settings = getRawSettings()): boolean {
  const p = getPresets(getSettings()).find((x) => x.id === currentPresetId(s));
  if (!p) return false;
  const now = JSON.stringify(captureDiff(s, p.look));
  const was = p.user ? p.user.diff : presetDiff(p, s);
  const strip = (d: any) => { const c = JSON.parse(JSON.stringify(d)); for (const g of GLOBAL_PATHS) delete c[g[0]]; return JSON.stringify(c); };
  return p.user ? now !== JSON.stringify(was) : strip(JSON.parse(now)) !== strip(was);
}

/** Keep native dropdown selection valid when browsing a different company. */
export function presetPickerState(s: Settings, presets: Preset[]) {
  const company = (s.presetCompany && (PRESET_GROUPS as string[]).includes(s.presetCompany) ? s.presetCompany : presetCompany(s)) as PresetGroup;
  const filtered = presets.filter((p) => p.company === company);
  const current = currentPresetId(s);
  const selected = filtered.some((p) => p.id === current) ? current : "__choose__";
  const options = [...(selected === "__choose__" ? [{ data: "__choose__", label: "Choose a preset…" }] : []), ...filtered.map((p) => ({ data: p.id, label: p.label }))];
  return { company, selected, options };
}
