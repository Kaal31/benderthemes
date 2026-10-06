// Presets = a console theme plus an optional skin (PS3 .p3t, Vita custom theme).
// The list is built from the built-in consoles and whatever skins are installed,
// and can be switched from Quick Access, every theme's △ menu, or L2 / R2.
import { useEffect, useState } from "react";
import { getSettings, Settings, THEMES, ThemeId, updateSettings, X360_STYLES, X360Style } from "./settings";
import { listSkins } from "./skins";

export interface Preset {
  id: string;
  label: string;
  theme: ThemeId;
  p3t?: string;
  vitaSkin?: string;
  x360?: X360Style;
}

let skins: { p3t: string[]; vita: string[] } = { p3t: [], vita: [] };
const listeners = new Set<() => void>();

export async function refreshPresets() {
  try {
    const r = await listSkins();
    skins = { p3t: r?.p3t ?? [], vita: r?.vita ?? [] };
  } catch {
    /* keep what we had */
  }
  listeners.forEach((l) => l());
}

const pretty = (f: string) => f.replace(/\.(p3t|zip)$/i, "").replace(/[_-]+/g, " ");

export function getPresets(): Preset[] {
  const out: Preset[] = [];
  for (const t of THEMES) {
    if (t.id === "ps3") {
      out.push({ id: "ps3", label: "PS3 · Original wave", theme: "ps3", p3t: "" });
      skins.p3t.forEach((f) => out.push({ id: `ps3:${f}`, label: `PS3 · ${pretty(f)}`, theme: "ps3", p3t: f }));
    } else if (t.id === "vita") {
      out.push({ id: "vita", label: "PS Vita · Default", theme: "vita", vitaSkin: "" });
      skins.vita.forEach((f) => out.push({ id: `vita:${f}`, label: `PS Vita · ${pretty(f)}`, theme: "vita", vitaSkin: f }));
    } else if (t.id === "x360") {
      X360_STYLES.forEach((x) => out.push({ id: `x360:${x.id}`, label: `Xbox 360 · ${x.name}`, theme: "x360", x360: x.id }));
    } else out.push({ id: t.id, label: t.name, theme: t.id });
  }
  return out;
}

export function currentPresetId(s: Settings = getSettings()): string {
  if (s.theme === "ps3" && s.xmb.p3t) return `ps3:${s.xmb.p3t}`;
  if (s.theme === "vita" && s.vita.skin) return `vita:${s.vita.skin}`;
  if (s.theme === "x360") return `x360:${s.x360?.style ?? "metro"}`;
  return s.theme;
}

export function applyPreset(p: Preset) {
  updateSettings((s) => ({
    theme: p.theme,
    xmb: p.p3t !== undefined ? { ...s.xmb, p3t: p.p3t } : s.xmb,
    vita: p.vitaSkin !== undefined ? { ...s.vita, skin: p.vitaSkin } : s.vita,
    x360: p.x360 !== undefined ? { ...s.x360, style: p.x360 } : s.x360,
  }));
}

/** Step through the list (L2 / R2). Returns the preset now active. */
export function cyclePreset(dir: number): Preset {
  const list = getPresets();
  const i = Math.max(0, list.findIndex((p) => p.id === currentPresetId()));
  const next = list[(i + dir + list.length) % list.length];
  applyPreset(next);
  return next;
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

export const presetCompany = (theme: ThemeId): string => theme === "xbox" || theme === "x360" ? "Microsoft" : theme === "aero" || theme === "dial" || theme === "castle" || theme === "republic" ? "Bonus" : "Sony";
export function presetGroups() { return ["Sony", "Microsoft", "Bonus"].map(name => ({name, presets:getPresets().filter(p=>presetCompany(p.theme)===name)})); }
