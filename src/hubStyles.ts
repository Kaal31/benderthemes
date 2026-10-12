// The Hub (and the first-run flow) wear the look of the theme that is selected: a small token set per
// theme feeds `--dht-hub-*` CSS variables, and a cheap own-drawn decoration (`data-deco`) adds the
// console's mood (waves, orb, bubbles, glass...). Nothing here is copied from a console.
// Users and CSS Loader themes can override any variable on `.dht-market` / `.dht-onboarding`
// (see CSS-THEMING.md), e.g. `.dht-market { --dht-hub-accent: hotpink !important }`.
import type { CSSProperties } from "react";
import { getSettings } from "./settings";
import type { ThemeId } from "./settings";
import { darken, hex, lighten, PS3_MONTHS, PSP_MONTHS, rgb } from "./color";
import { BUILTIN_THEMES } from "./engine/builtin";

export type HubDeco = "none" | "xmb" | "orb" | "blades" | "nxe" | "glass" | "bubbles" | "wii" | "blocks" | "ps2" | "grid" | "stars" | "voxel" | "dither" | "stripes" | "kinect" | "meadow" | "sky";

export interface HubStyle {
  /** Light backgrounds need dark text: set when the page background is bright. */
  light?: boolean;
  bg: string; // page background (any CSS background)
  panel: string; // cards and the detail panel
  panelHi: string; // the selected card
  line: string; // hairlines
  text: string; // text on the page background
  sub: string; // secondary text on the page background
  cardText: string; // text on a card
  cardSub: string;
  accent: string; // focus / primary button colour
  accentText: string; // text on the accent
  tab: string; // active tab background
  tabText: string; // active tab text
  radius: number; // card corner radius, px
  pill: number; // button corner radius, px
  font: string; // font stack
  ring: string; // box-shadow of the selected card
  shadow: string; // box-shadow of every card
  track: string; // heading letter-spacing
  upper?: boolean; // upper-case headings and buttons
  deco: HubDeco;
  /** Colour of the decoration (the theme's mood colour). */
  glow: string;
  /** The word the theme calls its shop; used as the Hub's subtitle. */
  tagline: string;
}

const SANS = '"Motiva Sans","Segoe UI",system-ui,Arial,sans-serif';
const DARK: HubStyle = {
  bg: "#0d1017", panel: "#171c26", panelHi: "#252e30", line: "#292e38", text: "#f7f6fa", sub: "#a0a9b8", cardText: "#f7f6fa", cardSub: "#a0a9b8",
  accent: "#d4f780", accentText: "#152015", tab: "#252c2c", tabText: "#d4f780", radius: 10, pill: 7, font: SANS,
  ring: "0 0 0 2px #d4f780", shadow: "none", track: "-1.2px", deco: "none", glow: "#d4f780", tagline: "Pick a theme and make it yours.",
};
const mk = (o: Partial<HubStyle>): HubStyle => ({ ...DARK, ...o });

const X360: Record<string, HubStyle> = {
  metro: mk({ light: true, bg: "linear-gradient(180deg,#f4f4f4,#d9d9d9)", panel: "#fff", panelHi: "#fff", line: "#c4c4c4", text: "#222", sub: "#666", cardText: "#222", cardSub: "#666", accent: "#107c10", accentText: "#fff", tab: "#107c10", tabText: "#fff", radius: 0, pill: 0, font: '"Segoe UI","Motiva Sans",sans-serif', ring: "0 0 0 4px #107c10", shadow: "0 1px 3px #0003", track: "-.5px", deco: "none", glow: "#107c10", tagline: "Pick a dashboard and make it yours." }),
  blades: mk({ light: true, bg: "radial-gradient(ellipse at 70% 28%,#fff 0%,#ffc38a 38%,#e46c0a 100%)", panel: "rgba(255,255,255,.82)", panelHi: "rgba(255,255,255,.97)", line: "#fff8", text: "#3a2108", sub: "#7a4a1a", cardText: "#2a1a08", cardSub: "#7a4a1a", accent: "#4aa51e", accentText: "#fff", tab: "rgba(255,255,255,.85)", tabText: "#b4560a", radius: 12, pill: 18, font: '"Segoe UI","Motiva Sans",sans-serif', ring: "0 0 0 3px #4aa51e,0 8px 18px #0004", shadow: "0 3px 8px #0002", track: "-.5px", deco: "blades", glow: "#ffffff", tagline: "Slide a blade and make it yours." }),
  nxe: mk({ bg: "radial-gradient(ellipse at 60% 18%,#4a5266 0%,#262a35 45%,#0f1116 100%)", panel: "linear-gradient(180deg,#3a3f4c,#20232b)", panelHi: "linear-gradient(180deg,#4a505f,#2a2e38)", line: "#454b5a", text: "#fff", sub: "#a7adbb", cardText: "#fff", cardSub: "#a7adbb", accent: "#8ee03a", accentText: "#10200a", tab: "#2c3b22", tabText: "#8ee03a", radius: 8, pill: 16, font: '"Segoe UI","Motiva Sans",sans-serif', ring: "0 0 0 3px #8ee03a,0 10px 24px #000a", shadow: "0 4px 10px #0006", track: "-.5px", deco: "nxe", glow: "#8ee03a", tagline: "New Xbox Experience. Make it yours." }),
  kinect: mk({ light: true, bg: "radial-gradient(ellipse at 60% 26%,#fff 0%,#eef0ec 45%,#d3d8cf 100%)", panel: "#fff", panelHi: "#fff", line: "#ccd2c8", text: "#2c3a28", sub: "#6b7667", cardText: "#2c3a28", cardSub: "#6b7667", accent: "#5dc21e", accentText: "#fff", tab: "#5dc21e", tabText: "#fff", radius: 5, pill: 5, font: '"Segoe UI","Motiva Sans",sans-serif', ring: "0 0 0 4px #5dc21e,0 10px 24px #0003", shadow: "0 2px 8px #0002", track: "-.5px", deco: "kinect", glow: "#5dc21e", tagline: "Wave, point, pick a theme." }),
};

export const HUB_STYLES: Record<ThemeId, HubStyle> = {
  wii: mk({ light: true, bg: "radial-gradient(ellipse at 50% 0%,#fff 0%,#eef4f8 55%,#d6e4ee 100%)", panel: "linear-gradient(#fff,#eef4f8)", panelHi: "#fff", line: "#c9d8e2", text: "#4d6877", sub: "#778f9d", cardText: "#4d6877", cardSub: "#778f9d", accent: "#37bce9", accentText: "#fff", tab: "#dff3fb", tabText: "#1f8db5", radius: 24, pill: 22, font: '"Trebuchet MS","Segoe UI",Arial,sans-serif', ring: "0 0 0 4px #37bce9,0 6px 16px #5aa9c855", shadow: "0 2px 6px #8aa6b655", track: "-.6px", deco: "wii", glow: "#37bce9", tagline: "Pick a channel and make it yours." }),
  wiiu: mk({ light: true, bg: "radial-gradient(ellipse at 30% 0%,#fff 0%,#e9f0f5 50%,#cddbe5 100%)", panel: "linear-gradient(#ffffffee,#eef3f7ee)", panelHi: "#fff", line: "#cfdce5", text: "#54707f", sub: "#7d95a2", cardText: "#54707f", cardSub: "#7d95a2", accent: "#28c3ec", accentText: "#fff", tab: "#d9f4fc", tabText: "#1f94b5", radius: 20, pill: 20, font: '"Trebuchet MS","Segoe UI",Arial,sans-serif', ring: "0 0 0 4px #28c3ec,0 8px 20px #28c3ec44", shadow: "0 3px 10px #7b96a844", track: "-.6px", deco: "glass", glow: "#28c3ec", tagline: "Tap a tile and make it yours." }),
  switch: mk({ light: true, bg: "linear-gradient(180deg,#efefef,#e0e0e2)", panel: "#fff", panelHi: "#fff", line: "#d2d2d4", text: "#2d2d30", sub: "#6e6e74", cardText: "#2d2d30", cardSub: "#6e6e74", accent: "#00c3e3", accentText: "#00323b", tab: "#fff", tabText: "#00a3bf", radius: 4, pill: 22, font: '"Nunito","Trebuchet MS","Segoe UI",Arial,sans-serif', ring: "0 0 0 4px #00c3e3,0 0 0 7px #fff,0 0 18px 6px #00c3e377", shadow: "0 2px 6px #0002", track: "-.6px", deco: "none", glow: "#00c3e3", tagline: "Pick a theme and play." }),
  n3ds: mk({ light: true, bg: "linear-gradient(180deg,#e2dfd9,#cfccc5)", panel: "linear-gradient(#fbfaf8,#ebe9e4)", panelHi: "#fff", line: "#b9b6af", text: "#4a524f", sub: "#7b837f", cardText: "#4a524f", cardSub: "#7b837f", accent: "#3fe3b5", accentText: "#0b3a2d", tab: "#cdeee4", tabText: "#12795f", radius: 8, pill: 8, font: '"Trebuchet MS","Segoe UI",Arial,sans-serif', ring: "0 0 0 4px #3fe3b5,0 0 0 6px #1f8f72", shadow: "0 2px 0 #aaa7a0", track: "-.5px", deco: "blocks", glow: "#3fe3b5", tagline: "Two screens, one home. Pick a theme." }),
  vita: mk({ bg: "linear-gradient(180deg,#1a86ef 0%,#0b5ccc 55%,#0a3f94 100%)", panel: "rgba(255,255,255,.93)", panelHi: "#fff", line: "#ffffff44", text: "#fff", sub: "#cfe6ff", cardText: "#10243f", cardSub: "#4a5f7d", accent: "#fff", accentText: "#0b4fb0", tab: "rgba(255,255,255,.95)", tabText: "#0b4fb0", radius: 22, pill: 22, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 3px #bfe9ff,0 0 26px 4px #78d2ffcc", shadow: "0 4px 12px #00205055", track: "-.8px", deco: "bubbles", glow: "#ffffff", tagline: "Bubbles, pages and LiveArea. Pick a theme." }),
  ps2: mk({ bg: "radial-gradient(ellipse at 50% 38%,#0b1f5a 0%,#030a24 62%,#000 100%)", panel: "rgba(40,70,200,.14)", panelHi: "rgba(80,120,255,.32)", line: "#3b53b8", text: "#cfd9ff", sub: "#7f93d9", cardText: "#dfe6ff", cardSub: "#8da0e4", accent: "#8fa6ff", accentText: "#030a24", tab: "rgba(80,120,255,.35)", tabText: "#fff", radius: 0, pill: 0, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 2px #8fa6ff,0 0 24px #5a78ff88", shadow: "none", track: "1px", upper: true, deco: "ps2", glow: "#4f6bff", tagline: "Browser, memory cards and towers." }),
  ps3: mk({ bg: "radial-gradient(ellipse at 28% 8%,#2a5ea8 0%,#0e2a5c 46%,#050f24 100%)", panel: "rgba(255,255,255,.07)", panelHi: "linear-gradient(90deg,rgba(255,255,255,.26),rgba(255,255,255,.03))", line: "#ffffff30", text: "#fff", sub: "#b8c9e6", cardText: "#fff", cardSub: "#c0d0ea", accent: "#fff", accentText: "#0a2150", tab: "rgba(255,255,255,.2)", tabText: "#fff", radius: 3, pill: 3, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 2px #ffffffcc,0 0 22px #8cbeffaa", shadow: "none", track: "-.3px", deco: "xmb", glow: "#7fb4ff", tagline: "Along the cross bar. Pick a theme." }),
  psp: mk({ bg: "radial-gradient(ellipse at 28% 8%,#3a6bb0 0%,#143a74 46%,#07142e 100%)", panel: "rgba(255,255,255,.08)", panelHi: "linear-gradient(90deg,rgba(255,255,255,.28),rgba(255,255,255,.03))", line: "#ffffff33", text: "#fff", sub: "#bccbe6", cardText: "#fff", cardSub: "#c4d2ea", accent: "#fff", accentText: "#0a2150", tab: "rgba(255,255,255,.22)", tabText: "#fff", radius: 3, pill: 14, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 2px #fffd,0 0 22px #a0c8ffaa", shadow: "none", track: "-.3px", deco: "xmb", glow: "#8dbdff", tagline: "Along the cross bar. Pick a theme." }),
  ps4: mk({ bg: "linear-gradient(160deg,#0d58c2 0%,#073278 55%,#03173d 100%)", panel: "rgba(0,20,60,.55)", panelHi: "rgba(0,20,60,.8)", line: "#ffffff2a", text: "#fff", sub: "#b9cdf0", cardText: "#fff", cardSub: "#b9cdf0", accent: "#fff", accentText: "#0a2e6e", tab: "rgba(255,255,255,.18)", tabText: "#fff", radius: 4, pill: 3, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 3px #fff,0 14px 30px #0008", shadow: "0 3px 8px #0004", track: "-.6px", deco: "stripes", glow: "#4c9bff", tagline: "Tiles and function area. Pick a theme." }),
  ps5: mk({ bg: "radial-gradient(ellipse at 76% 0%,#2b4ba3 0%,#0c1534 50%,#05070f 100%)", panel: "rgba(255,255,255,.07)", panelHi: "rgba(255,255,255,.16)", line: "#ffffff22", text: "#fff", sub: "#a9b4cc", cardText: "#fff", cardSub: "#a9b4cc", accent: "#fff", accentText: "#05070f", tab: "rgba(255,255,255,.16)", tabText: "#fff", radius: 16, pill: 22, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 3px #fff,0 12px 34px #000a", shadow: "0 4px 14px #0005", track: "-.8px", deco: "glass", glow: "#6c8cff", tagline: "Games and Media. Pick a theme." }),
  xbox: mk({ bg: "radial-gradient(ellipse at 30% 40%,#1f5a0a 0%,#0b2604 45%,#020500 100%)", panel: "linear-gradient(180deg,rgba(60,130,18,.5),rgba(14,48,5,.85))", panelHi: "linear-gradient(180deg,rgba(100,190,30,.65),rgba(24,80,8,.92))", line: "#7bd32f55", text: "#c6ff6a", sub: "#8fd34a", cardText: "#d8ff94", cardSub: "#9ed95a", accent: "#b6f25a", accentText: "#0f2c04", tab: "rgba(120,220,40,.28)", tabText: "#e6ff8a", radius: 14, pill: 14, font: '"DHT Xbox Book","DHT Xbox Original","Segoe UI",Arial,sans-serif', ring: "0 0 0 3px #e6ff8a,0 0 28px #aaff3ccc", shadow: "0 4px 10px #0007", track: "1px", upper: true, deco: "orb", glow: "#7bd32f", tagline: "The green orb. Pick a dashboard." }),
  x360: X360.metro,
  aero: mk({ bg: "linear-gradient(180deg,#4aa8ff 0%,#1d6ae0 45%,#0c40b0 100%)", panel: "linear-gradient(180deg,rgba(255,255,255,.42),rgba(255,255,255,.14))", panelHi: "linear-gradient(180deg,rgba(255,255,255,.62),rgba(255,255,255,.26))", line: "#ffffff55", text: "#fff", sub: "#dcefff", cardText: "#fff", cardSub: "#e2f1ff", accent: "linear-gradient(180deg,#f4ffb0,#b6ee3c 40%,#5aa812)", accentText: "#123d06", tab: "rgba(6,44,140,.55)", tabText: "#fff", radius: 18, pill: 18, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 3px #eaff7a,0 0 22px #c8ff50cc", shadow: "0 4px 14px #00206066", track: "-.6px", deco: "meadow", glow: "#c8ff50", tagline: "Glass panels, sky and sun." }),
  aero2: mk({ bg: "linear-gradient(180deg,#6cc0ff 0%,#2a78e4 48%,#0e3fae 100%)", panel: "linear-gradient(180deg,rgba(255,255,255,.4),rgba(255,255,255,.12))", panelHi: "linear-gradient(180deg,rgba(255,255,255,.62),rgba(255,255,255,.24))", line: "#ffffff55", text: "#fff", sub: "#dcefff", cardText: "#fff", cardSub: "#e2f1ff", accent: "linear-gradient(180deg,#f4ffb0,#b6ee3c 40%,#5aa812)", accentText: "#123d06", tab: "rgba(6,44,140,.55)", tabText: "#fff", radius: 22, pill: 22, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 3px #eaff7a,0 0 24px #c8ff50cc", shadow: "0 6px 18px #00206070", track: "-.6px", deco: "meadow", glow: "#c8ff50", tagline: "Sculpted glass and a landscape." }),
  dial: mk({ bg: "radial-gradient(ellipse at 40% 30%,#1c211e 0%,#0a0c0b 60%,#020303 100%)", panel: "#121614", panelHi: "#18211a", line: "#2c342e", text: "#eef3ef", sub: "#9aa59c", cardText: "#eef3ef", cardSub: "#9aa59c", accent: "#6bff2a", accentText: "#061402", tab: "#16240f", tabText: "#6bff2a", radius: 10, pill: 18, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 2px #6bff2a,0 0 26px #6bff2a77", shadow: "0 4px 12px #0008", track: "-.4px", deco: "grid", glow: "#6bff2a", tagline: "A dial of choices." }),
  castle: mk({ light: true, bg: "linear-gradient(180deg,#bfe0f7 0%,#e9f4fb 60%,#f6fafd 100%)", panel: "rgba(255,255,255,.78)", panelHi: "rgba(255,255,255,.96)", line: "#a9c6dc", text: "#2f4b64", sub: "#5f7c94", cardText: "#304b64", cardSub: "#617d94", accent: "#ffdb36", accentText: "#253953", tab: "rgba(255,255,255,.85)", tabText: "#2d5a80", radius: 4, pill: 3, font: 'Cardinal,"Palatino Linotype",Georgia,serif', ring: "0 0 0 3px #ffe470,0 0 22px #ffe47099", shadow: "0 4px 14px #5d86a233", track: ".2px", deco: "sky", glow: "#ffffff", tagline: "Skyborne windows. Choose your sky." }),
  republic: mk({ bg: "linear-gradient(140deg,#07101a,#152735)", panel: "rgba(12,24,36,.93)", panelHi: "rgba(30,48,66,.96)", line: "#8a7a4a66", text: "#d8e9f3", sub: "#b7a87e", cardText: "#e2eef6", cardSub: "#b7a87e", accent: "#d9bb69", accentText: "#17150e", tab: "rgba(217,187,105,.18)", tabText: "#f2d98f", radius: 3, pill: 2, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 2px #fce296,0 0 18px #d9bb6977", shadow: "0 2px 8px #0008", track: "1.2px", upper: true, deco: "grid", glow: "#d9bb69", tagline: "The command desk. Choose a home." }),
  nazarick: mk({ bg: "radial-gradient(ellipse at 50% 15%,#2a1740 0%,#0e0816 60%,#050309 100%)", panel: "rgba(8,6,12,.86)", panelHi: "rgba(60,30,86,.85)", line: "#c8a66855", text: "#dfd2e6", sub: "#b9a480", cardText: "#e8dcee", cardSub: "#b9a480", accent: "#c8a668", accentText: "#1b1008", tab: "rgba(103,53,139,.55)", tabText: "#f0dfff", radius: 2, pill: 2, font: 'Georgia,"Palatino Linotype",serif', ring: "0 0 0 2px #c8a668,0 0 22px #a765dd77", shadow: "0 3px 10px #000a", track: "1px", deco: "stars", glow: "#a765dd", tagline: "A guardian for every destination." }),
  pain: mk({ bg: "radial-gradient(ellipse at 30% 20%,#2c173e,#09070f 75%)", panel: "rgba(25,16,33,.93)", panelHi: "rgba(54,30,76,.95)", line: "#6a3b8a66", text: "#e4cdf5", sub: "#b697cb", cardText: "#ecdcf8", cardSub: "#b697cb", accent: "#b978ee", accentText: "#170a24", tab: "rgba(185,120,238,.22)", tabText: "#dfb8ff", radius: 12, pill: 12, font: '"Segoe UI","Motiva Sans",Arial,sans-serif', ring: "0 0 0 2px #ce9bff,0 0 24px #a64eebaa", shadow: "0 4px 12px #0008", track: "-.4px", deco: "stars", glow: "#a64eeb", tagline: "Purple moonlight. Choose a path." }),
  minecraft: mk({ bg: "repeating-conic-gradient(#ffffff03 0% 25%,#00000010 0% 50%) 0 0/32px 32px,#292b2e", panel: "linear-gradient(110deg,#303236,#242629)", panelHi: "linear-gradient(110deg,#3c4046,#2d3034)", line: "#171717", text: "#eee", sub: "#bdbdc2", cardText: "#eee", cardSub: "#bdbdc2", accent: "#5f9a3a", accentText: "#fff", tab: "#326f18", tabText: "#fff", radius: 0, pill: 0, font: 'BlockWorlds,"Courier New",monospace', ring: "0 0 0 3px #171717,0 0 0 6px #82bf50", shadow: "inset 2px 2px #55565a,inset -2px -2px #191b1e", track: "0", deco: "voxel", glow: "#82bf50", tagline: "Craft your home. Pick a world." }),
  ps1: mk({ bg: "linear-gradient(180deg,#14161c,#07080b)", panel: "#1b1e27", panelHi: "#2a2f40", line: "#4b5170", text: "#d9dbe8", sub: "#8c91ac", cardText: "#e4e6f2", cardSub: "#9399b3", accent: "#cfd2e6", accentText: "#111320", tab: "#2f3550", tabText: "#fff", radius: 0, pill: 0, font: '"Courier New",ui-monospace,monospace', ring: "0 0 0 3px #fff,0 0 0 5px #555a7a", shadow: "none", track: "0", upper: true, deco: "dither", glow: "#9aa0c8", tagline: "Insert disc. Pick a theme." }),
  iisu: mk({ bg: "linear-gradient(160deg,#141828,#0a0c14)", panel: "rgba(255,255,255,.07)", panelHi: "rgba(255,255,255,.16)", line: "#ffffff22", text: "#f4f4fa", sub: "#a9aec4", cardText: "#f4f4fa", cardSub: "#aab0c6", accent: "#ff7ab8", accentText: "#2a0a1a", tab: "rgba(255,122,184,.2)", tabText: "#ffb2d6", radius: 22, pill: 22, font: '"Segoe UI","Motiva Sans",system-ui,sans-serif', ring: "0 0 0 3px #ff7ab8,0 0 24px #ff7ab888", shadow: "0 6px 18px #0006", track: "-.8px", deco: "glass", glow: "#ff7ab8", tagline: "Glass icons, pills and colour." }),
  frame: DARK,
};

/** The style of a theme; an unknown id gets the default. `x360Style` picks the Xbox 360 dashboard era. */
/** Console themes (Sony, Microsoft, Nintendo looks) get the themed Hub and the generic intro; bonus looks, community
 *  interfaces and anything else keep the neutral Hub and no reveal. */
const CONSOLE_COMPANIES = ["Sony", "Microsoft", "Nintendo"];
export function isConsoleTheme(theme: string | undefined): boolean {
  const t = BUILTIN_THEMES.find((b) => b.layout === theme);
  return !!t && CONSOLE_COMPANIES.includes(t.company as string);
}

/** Console theme ids a Hub style can be fixed to. */
export const consoleThemeIds = (): string[] => [...new Set(BUILTIN_THEMES.filter((b) => CONSOLE_COMPANIES.includes(b.company as string)).map((b) => b.layout as string))];

/**
 * Which theme look the Hub wears, decided when it opens. `setting` = settings.hubStyle ("auto" | "neutral" | theme id),
 * `from` = the theme home it was opened on (undefined from Quick Access, links, the Steam overlay...), `inv` = the installed packs.
 * Neutral (theme null) unless the resolved theme is a console theme. A fixed choice must also be installed; Auto wears the
 * home it was opened on even before its pack is downloaded (the look is CSS only), so switching to a theme that still needs
 * its download (L1 switcher, L2 / R2) opens the Hub in that theme's style. `source` goes to `data-hub-source`.
 */
export function resolveHubTheme(setting: string | undefined, from: string | undefined, inv: Record<string, string> | undefined | null): { theme: string | null; source: "auto" | "setting" | "none" } {
  const s = setting || "auto";
  if (s === "neutral") return { theme: null, source: "none" };
  const fixed = s !== "auto";
  const t = fixed ? s : from;
  const ok = !!t && isConsoleTheme(t) && (!fixed || (!!inv && !!inv[t]));
  return { theme: ok ? (t as string) : null, source: ok ? (fixed ? "setting" : "auto") : "none" };
}

export function hubStyle(theme: string | undefined, x360Style?: string): HubStyle {
  if (!isConsoleTheme(theme)) return DARK;
  if (theme === "x360") return X360[x360Style ?? "metro"] ?? X360.metro;
  return (HUB_STYLES as Record<string, HubStyle | undefined>)[theme ?? ""] ?? DARK;
}

/** Ids used in `data-hub-theme` (the Xbox 360 era is part of it: "x360-blades"). */
export const hubThemeKey = (theme: string | undefined, x360Style?: string) => !isConsoleTheme(theme) ? "default" : (theme === "x360" ? `x360-${X360[x360Style ?? "metro"] ? x360Style ?? "metro" : "metro"}` : theme || "default");

/** Every `--dht-hub-*` variable of a style. */
export function hubVars(st: HubStyle): CSSProperties {
  const v: Record<string, string> = {
    "--dht-hub-bg": st.bg, "--dht-hub-panel": st.panel, "--dht-hub-panel-hi": st.panelHi, "--dht-hub-line": st.line,
    "--dht-hub-text": st.text, "--dht-hub-sub": st.sub, "--dht-hub-card-text": st.cardText, "--dht-hub-card-sub": st.cardSub,
    "--dht-hub-accent": st.accent, "--dht-hub-accent-text": st.accentText, "--dht-hub-tab": st.tab, "--dht-hub-tab-text": st.tabText,
    "--dht-hub-radius": `${st.radius}px`, "--dht-hub-pill": `${st.pill}px`, "--dht-hub-font": st.font, "--dht-hub-ring": st.ring,
    "--dht-hub-shadow": st.shadow, "--dht-hub-track": st.track, "--dht-hub-case": st.upper ? "uppercase" : "none", "--dht-hub-glow": st.glow,
    "--dht-hub-notice-bg": st.light ? "#fff3cf" : "#302d23", "--dht-hub-notice-text": st.light ? "#6b4c00" : "#ebc98b",
    "--dht-hub-scheme": st.light ? "light" : "dark",
  };
  return v as CSSProperties;
}

/** The accent as a plain colour for canvases and overlays (first colour found in the accent value). */
export const hubAccentColor = (st: HubStyle) => (st.accent.match(/#[0-9a-f]{3,8}|rgba?\([^)]*\)/i)?.[0] ?? st.glow);

/**
 * Variables are declared by a stylesheet (not inline) so that a CSS Loader theme or the user can override them
 * with `.dht-market[data-hub-theme="ps3"] { --dht-hub-accent: ... }` or the same on `.dht-onboarding`.
 */
export const HUB_VARS_CSS = (() => {
  const rule = (sel: string, st: HubStyle) => `${sel}{${Object.entries(hubVars(st)).map(([k, v]) => `${k}:${v}`).join(";")}}`;
  const out: string[] = [rule(".dht-market,.dht-onboarding", DARK)];
  for (const id of Object.keys(HUB_STYLES) as ThemeId[]) {
    if (id === "x360") continue;
    out.push(rule(`.dht-market[data-hub-theme="${id}"],.dht-onboarding[data-hub-theme="${id}"]`, HUB_STYLES[id]));
  }
  for (const k of Object.keys(X360)) out.push(rule(`.dht-market[data-hub-theme="x360-${k}"],.dht-onboarding[data-hub-theme="x360-${k}"]`, X360[k]));
  return out.join("\n");
})();

/** The decoration layer (`.dht-hub-deco[data-deco]`), shared by the Hub and the first-run flow. Own-drawn gradients only. */
export const HUB_DECO_CSS = `
.dht-hub-deco{position:absolute;inset:0;overflow:hidden;pointer-events:none;z-index:0}
.dht-hub-deco::before,.dht-hub-deco::after{content:"";position:absolute;pointer-events:none}
.dht-hub-deco[data-deco=xmb]::before{left:-10%;right:-10%;top:34%;height:46%;opacity:.55;filter:blur(1px);background:linear-gradient(100deg,transparent 0%,color-mix(in srgb,var(--dht-hub-glow) 38%,transparent) 30%,transparent 55%),linear-gradient(80deg,transparent 20%,#ffffff22 50%,transparent 80%);-webkit-mask:radial-gradient(ellipse 60% 50% at 50% 50%,#000 30%,transparent 72%);mask:radial-gradient(ellipse 60% 50% at 50% 50%,#000 30%,transparent 72%);transform:skewY(-9deg);animation:dht-hub-wave 14s ease-in-out infinite alternate}
.dht-hub-deco[data-deco=xmb]::after{left:-10%;right:-10%;top:48%;height:30%;opacity:.4;background:linear-gradient(95deg,transparent 10%,#ffffff30 45%,transparent 85%);-webkit-mask:radial-gradient(ellipse 55% 50% at 50% 50%,#000 25%,transparent 70%);mask:radial-gradient(ellipse 55% 50% at 50% 50%,#000 25%,transparent 70%);transform:skewY(7deg);animation:dht-hub-wave 19s ease-in-out infinite alternate-reverse}
.dht-hub-deco[data-deco=orb]::before{width:760px;height:760px;left:-220px;bottom:-330px;border-radius:50%;background:radial-gradient(circle at 36% 30%,#d9ff8c 0%,#7bd32f 22%,#2a7a0c 52%,#0b3004 76%,transparent 78%);opacity:.5;box-shadow:0 0 120px 30px #7bd32f44;animation:dht-hub-pulse 6s ease-in-out infinite}
.dht-hub-deco[data-deco=orb]::after{inset:0;background:repeating-linear-gradient(60deg,#7bd32f10 0 2px,transparent 2px 38px),repeating-linear-gradient(-60deg,#7bd32f0b 0 2px,transparent 2px 38px)}
.dht-hub-deco[data-deco=blades]::before{inset:0;background:repeating-linear-gradient(90deg,#ffffff00 0 118px,#ffffff55 118px 120px,#e46c0a22 120px 122px,#ffffff00 122px 240px);opacity:.7}
.dht-hub-deco[data-deco=blades]::after{left:-10%;right:-10%;bottom:-30%;height:60%;background:radial-gradient(ellipse at 50% 100%,#fff8 0%,transparent 62%)}
.dht-hub-deco[data-deco=nxe]::before{inset:-20% -10% auto -10%;height:70%;background:linear-gradient(115deg,transparent 30%,#ffffff12 42%,transparent 55%),linear-gradient(115deg,transparent 55%,#8ee03a10 64%,transparent 74%);animation:dht-hub-wave 16s ease-in-out infinite alternate}
.dht-hub-deco[data-deco=nxe]::after{left:0;right:0;bottom:0;height:3px;background:linear-gradient(90deg,transparent,#8ee03a,transparent);opacity:.7}
.dht-hub-deco[data-deco=kinect]::before{inset:0;background:radial-gradient(circle at 78% 38%,#5dc21e1f 0,transparent 36%),radial-gradient(circle at 16% 84%,#5dc21e18 0,transparent 30%)}
.dht-hub-deco[data-deco=glass]::before{inset:0;background:radial-gradient(circle at 18% 22%,#ffffff55 0,transparent 15%),radial-gradient(circle at 82% 16%,color-mix(in srgb,var(--dht-hub-glow) 45%,transparent) 0,transparent 18%),radial-gradient(circle at 70% 82%,#ffffff44 0,transparent 20%),radial-gradient(circle at 34% 70%,color-mix(in srgb,var(--dht-hub-glow) 28%,transparent) 0,transparent 14%);animation:dht-hub-drift 22s ease-in-out infinite alternate}
.dht-hub-deco[data-deco=glass]::after{left:0;right:0;top:0;height:46%;background:linear-gradient(180deg,#ffffff30,transparent)}
.dht-hub-deco[data-deco=meadow]::before{left:-12%;right:-12%;bottom:-210px;height:330px;border-radius:50%;background:radial-gradient(ellipse at 40% 0%,#c8ff70 0%,#6cc41e 30%,#2f8a10 70%);box-shadow:0 -6px 30px #c8ff5055;opacity:.9}
.dht-hub-deco[data-deco=meadow]::after{inset:0;background:radial-gradient(ellipse 160px 46px at 30% 5%,#fffc 0,transparent 70%),radial-gradient(ellipse 220px 54px at 74% 12%,#fffb 0,transparent 70%),radial-gradient(ellipse 140px 40px at 52% 34%,#ffffff88 0,transparent 70%),radial-gradient(circle at 82% 18%,#c8ff5055 0,transparent 16%)}
.dht-hub-deco[data-deco=sky]::before{inset:0;background:radial-gradient(ellipse 280px 70px at 14% 18%,#fff 0,transparent 70%),radial-gradient(ellipse 340px 80px at 78% 10%,#fffe 0,transparent 70%),radial-gradient(ellipse 300px 70px at 58% 86%,#fffd 0,transparent 70%),radial-gradient(ellipse 240px 60px at 6% 78%,#fffc 0,transparent 70%)}
.dht-hub-deco[data-deco=sky]::after{left:0;right:0;bottom:0;height:34%;background:linear-gradient(0deg,#ffffffcc,transparent)}
.dht-market[data-hub-theme^=aero] .market-close{background:#0a3a9a66;border:1px solid #ffffff77}
.dht-market[data-hub-theme^=aero] h1,.dht-market[data-hub-theme^=aero] .market-toolbar button{text-shadow:0 1px 2px #00205088}
.dht-hub-deco[data-deco=bubbles]::before{inset:0;background:radial-gradient(circle at 14% 82%,#ffffff40 0 26px,transparent 28px),radial-gradient(circle at 30% 64%,#ffffff2c 0 44px,transparent 46px),radial-gradient(circle at 62% 90%,#ffffff33 0 36px,transparent 38px),radial-gradient(circle at 84% 70%,#ffffff2a 0 60px,transparent 62px),radial-gradient(circle at 92% 24%,#ffffff22 0 30px,transparent 32px),radial-gradient(circle at 8% 30%,#ffffff22 0 22px,transparent 24px);animation:dht-hub-rise 18s linear infinite}
.dht-hub-deco[data-deco=bubbles]::after{left:0;right:0;top:0;height:70px;background:linear-gradient(180deg,#00000066,transparent)}
.dht-hub-deco[data-deco=wii]::before{left:-5%;right:-5%;bottom:-170px;height:260px;border-radius:50%;background:linear-gradient(180deg,#ffffff,#dcecf6);box-shadow:0 -4px 18px #7bb4d055}
.dht-hub-deco[data-deco=wii]::after{inset:0;background:radial-gradient(circle at 50% -10%,#37bce91f,transparent 50%)}
.dht-hub-deco[data-deco=blocks]::before{inset:0;background:repeating-conic-gradient(#ffffff55 0% 25%,#00000008 0% 50%) 0 0/46px 46px;opacity:.55}
.dht-hub-deco[data-deco=blocks]::after{left:0;right:0;top:0;height:6px;background:var(--dht-hub-accent)}
.dht-hub-deco[data-deco=ps2]::before{inset:auto 0 0 0;height:70%;background:repeating-linear-gradient(90deg,#3d5cff00 0 46px,#4f6bff33 46px 48px,#3d5cff00 48px 94px);-webkit-mask:linear-gradient(0deg,#000,transparent);mask:linear-gradient(0deg,#000,transparent);animation:dht-hub-pulse 7s ease-in-out infinite}
.dht-hub-deco[data-deco=ps2]::after{left:50%;bottom:-60px;width:520px;height:260px;margin-left:-260px;border-radius:50%;background:radial-gradient(ellipse,#5a78ff55,transparent 70%)}
.dht-hub-deco[data-deco=grid]::before{inset:0;background:linear-gradient(var(--dht-hub-line) 1px,transparent 1px) 0 0/54px 54px,linear-gradient(90deg,var(--dht-hub-line) 1px,transparent 1px) 0 0/54px 54px;opacity:.35;-webkit-mask:radial-gradient(ellipse at 50% 40%,#000 10%,transparent 78%);mask:radial-gradient(ellipse at 50% 40%,#000 10%,transparent 78%)}
.dht-hub-deco[data-deco=grid]::after{left:50%;top:-140px;width:640px;height:420px;margin-left:-320px;border-radius:50%;background:radial-gradient(ellipse,color-mix(in srgb,var(--dht-hub-glow) 24%,transparent),transparent 68%)}
.dht-hub-deco[data-deco=stars]::before{inset:0;background:radial-gradient(1.5px 1.5px at 12% 18%,#fff 50%,transparent 52%),radial-gradient(1px 1px at 28% 62%,#fff 50%,transparent 52%),radial-gradient(2px 2px at 44% 28%,#fff 50%,transparent 52%),radial-gradient(1px 1px at 63% 74%,#fff 50%,transparent 52%),radial-gradient(1.5px 1.5px at 78% 22%,#fff 50%,transparent 52%),radial-gradient(1px 1px at 90% 58%,#fff 50%,transparent 52%),radial-gradient(1.5px 1.5px at 7% 80%,#fff 50%,transparent 52%),radial-gradient(1px 1px at 54% 92%,#fff 50%,transparent 52%);opacity:.7;animation:dht-hub-twinkle 5s ease-in-out infinite alternate}
.dht-hub-deco[data-deco=stars]::after{width:380px;height:380px;right:-90px;top:-110px;border-radius:50%;background:radial-gradient(circle at 40% 40%,color-mix(in srgb,var(--dht-hub-glow) 50%,#fff) 0,color-mix(in srgb,var(--dht-hub-glow) 24%,transparent) 36%,transparent 68%);opacity:.5}
.dht-hub-deco[data-deco=voxel]::before{inset:auto 0 0 0;height:96px;background:linear-gradient(180deg,#5f9a3a 0 16px,#7a5636 16px),repeating-linear-gradient(90deg,#0000 0 31px,#00000030 31px 32px);background-blend-mode:normal;opacity:.7}
.dht-hub-deco[data-deco=dither]::before{inset:0;background:repeating-linear-gradient(0deg,#ffffff07 0 1px,transparent 1px 3px),repeating-conic-gradient(#ffffff05 0% 25%,transparent 0% 50%) 0 0/4px 4px}
.dht-hub-deco[data-deco=stripes]::before{inset:0;background:repeating-linear-gradient(115deg,transparent 0 80px,#ffffff0d 80px 160px);animation:dht-hub-drift 24s ease-in-out infinite alternate}
.dht-hub-deco[data-deco=stripes]::after{left:0;right:0;bottom:0;height:40%;background:linear-gradient(0deg,#0006,transparent)}
@keyframes dht-hub-wave{from{transform:translateX(-3%) skewY(-9deg)}to{transform:translateX(3%) skewY(-6deg)}}
@keyframes dht-hub-pulse{0%,100%{opacity:.4}50%{opacity:.62}}
@keyframes dht-hub-drift{from{transform:translate(-1.5%,-1%)}to{transform:translate(1.5%,1%)}}
@keyframes dht-hub-rise{from{transform:translateY(0)}to{transform:translateY(-12%)}}
@keyframes dht-hub-twinkle{from{opacity:.45}to{opacity:.85}}
[data-motion=false] .dht-hub-deco::before,[data-motion=false] .dht-hub-deco::after,.dht-hub-deco[data-still] ::before{animation:none!important}
@media(prefers-reduced-motion:reduce){.dht-hub-deco::before,.dht-hub-deco::after{animation:none!important}}
`;

/**
 * The PS3 and PSP homes follow the monthly colour (or the colour you picked in the XMB / Standard options); the Hub does too.
 * Same rule as the XMB: its own colour choice, else a Standard options tint, else this month's colour.
 */
export function xmbHubColor(variant: "ps3" | "psp", now = new Date()): string {
  const s = getSettings();
  const idx = (variant === "ps3" ? s.xmb?.ps3Color : s.xmb?.pspColor) ?? -1;
  const tint = idx < 0 && /^#/.test(s.tint ?? "") ? s.tint : "";
  return tint || (variant === "ps3" ? PS3_MONTHS : PSP_MONTHS)[idx >= 0 ? idx : now.getMonth()];
}

/** The vars stylesheet, with the PS3 / PSP rules tinted by their current monthly colour (after the static rules, so CSS themes can still override). */
export function hubVarsCss(): string {
  try {
    const rules = (["ps3", "psp"] as const).map((v) => {
      const c = hex(xmbHubColor(v));
      const bg = `radial-gradient(ellipse at 28% 8%,${rgb(darken(c, v === "ps3" ? 0.12 : 0.22))} 0%,${rgb(darken(c, 0.5))} 46%,${rgb(darken(c, 0.86))} 100%)`;
      const ring = `0 0 0 2px #ffffffcc,0 0 22px ${rgb(lighten(c, 0.4), 0.7)}`;
      return `.dht-market[data-hub-theme="${v}"],.dht-onboarding[data-hub-theme="${v}"]{--dht-hub-bg:${bg};--dht-hub-glow:${rgb(lighten(c, 0.35))};--dht-hub-ring:${ring};--dht-hub-accent-text:${rgb(darken(c, 0.78))}}`;
    });
    return HUB_VARS_CSS + "\n" + rules.join("\n");
  } catch { return HUB_VARS_CSS; }
}
