// Settings are stored as JSON on the Deck by the Python backend, so they
// survive reboots and Steam restarts. The frontend keeps one in-memory copy
// and a tiny subscription store so every component re-renders on change.
import { callable } from "@decky/api";
import { useEffect, useState } from "react";
import { setSettingsBackend } from "./diag";

export type X360Style = "blades" | "nxe" | "kinect" | "metro";
export const X360_STYLES: { id: X360Style; name: string }[] = [
  { id: "blades", name: "Blades (2005)" },
  { id: "nxe", name: "NXE (2008)" },
  { id: "kinect", name: "Kinect (2010)" },
  { id: "metro", name: "Metro (2011)" },
];
export type ThemeId = "vita" | "ps2" | "ps3" | "psp" | "ps4" | "ps5" | "x360" | "aero" | "aero2" | "xbox" | "dial" | "castle" | "republic" | "minecraft" | "pain" | "nazarick";
export type SortMode = "recent" | "alpha" | "playtime";
export type AAction = "theme" | "launch" | "details";
export type ArtPref = "portrait" | "landscape";
export type TitleMode = "show" | "selected" | "hide";
export const TITLE_MODES: { id: TitleMode; name: string }[] = [
  { id: "show", name: "Show all" },
  { id: "selected", name: "Selected only" },
  { id: "hide", name: "Hide" },
];
/** Should a game's name be drawn? (non-game items always keep their labels) */
export const showTitle = (s: { titles: Partial<Record<ThemeId, TitleMode>> }, theme: ThemeId, selected: boolean) => {
  const m = s.titles[theme] ?? "show";
  return m === "show" || (m === "selected" && selected);
};

export const THEMES: { id: ThemeId; name: string; blurb: string }[] = [
  { id: "vita", name: "PS Vita", blurb: "Bubble pages, folders and LiveArea" },
  { id: "ps2", name: "PS2", blurb: "Browser, memory cards and towers" },
  { id: "ps3", name: "PS3", blurb: "XrossMediaBar with the monthly wave" },
  { id: "psp", name: "PSP", blurb: "Compact XMB with the PSP wave" },
  { id: "ps4", name: "PS4", blurb: "Tile row and function area" },
  { id: "ps5", name: "PS5", blurb: "Games / Media home with hero art" },
  { id: "xbox", name: "Xbox", blurb: "Original dashboard with the green orb" },
  { id: "x360", name: "Xbox 360", blurb: "Blades, NXE, Kinect or Metro dashboard" },
  { id: "aero", name: "Aero (bonus)", blurb: "Glossy sky-blue dashboard with glass panels" },
  { id: "aero2", name: "Aero v.2 (bonus)", blurb: "Sculpted glossy panels and integrated landscape sections" },
  { id: "dial", name: "Alien Dial (bonus)", blurb: "Sculpted metal hourglass dial with a reflected game carousel" },
  {id:"castle",name:"Floating Castle (bonus)",blurb:"Skyborne glass interface over a live cloudscape"},
  {id:"republic",name:"Galactic Republic (bonus)",blurb:"Gold-trimmed command desk over a live cityscape"},
  {id:"nazarick",name:"Nazarick (bonus)",blurb:"Gothic gold and violet, with a guardian for every destination"},
  {id:"pain",name:"Six Paths (bonus)",blurb:"Purple moonlight, orbital featured game and cinematic library"},
  {id:"minecraft",name:"Block Worlds (bonus)",blurb:"Voxel sunset, block panels and a customizable 3D player"},
];

export interface VitaFolder {
  id: string;
  name: string;
  apps: number[]; // appids
  color: string; // tint of the folder bubble
}

export type DialLook = "classic" | "chrome" | "crimson" | "arctic";
export type DialMotion = "rotate" | "pulse" | "hologram" | "rhombus" | "rhombus-slow" | "none";
export interface DialSettings {
  look: DialLook;
  motion: DialMotion;
  motions?: Exclude<DialMotion,"none">[];
  activation: "on-browse" | "always" | "off";
  reflections: boolean;
  projectionLight: boolean;
  floatingCover: boolean;
  sound: "reference" | "pack" | "off";
}
export interface Settings {
  presetCompany?: "Sony" | "Microsoft" | "Bonus";
  minecraftSkin?: string;
  minecraftFollowFocus?: boolean;
  minecraftSlim?: boolean;
  backgroundMusic: boolean;
  ps4GameBackgrounds: boolean;
  castleWeather: boolean;
  castleWindows: "replace" | "layered";
  videoBackgrounds: Partial<Record<ThemeId,boolean>>;
  tvMode: boolean; // safe margins and larger couch-distance text
  enabled: boolean; // replace Steam's home with the themed home
  theme: ThemeId;
  source: string; // "installed" | "all" | "col:<collection id>"
  sort: SortMode;
  aAction: AAction; // what Ⓐ does on a game
  hideSteamHeader: boolean; // hide Steam's own top bar while the themed home is shown
  footer: FooterMode; // Steam's bottom bar (Steam Menu · A Select · B Back) while the themed home is shown
  clock24: boolean;
  profileName: string; // "" = ask Steam
  sounds: boolean;
  packs: Partial<Record<ThemeId, string>>; // AudioLoader pack folder per theme ("" = automatic match, "steam" = Steam's sounds)
  music: Partial<Record<ThemeId, boolean>>; // theme music on/off (missing = on)
  musicPacks: Partial<Record<ThemeId, string>>; // pack the music comes from ("" = automatic, "none" = no music)
  sfxVolume: number; // 0–100, pack sounds
  musicVolume: number; // 0–100
  wallpapers: Partial<Record<ThemeId, string>>; // file name in the wallpapers folder
  wallpaperDim: number; // 0–80 %
  maxGames: number; // cap for very large libraries
  animations: boolean; // background animations (waves, particles, towers)
  badges: { protondb: boolean; deck: boolean }; // compatibility badges on game details
  coverStyles: Partial<Record<ThemeId,"flat"|"case3d">>;
  titles: Partial<Record<ThemeId, TitleMode>>; // game name text under icons
  trailers: { preview: boolean; sound: boolean; video: boolean }; // PSP/PS3 icon videos, trailer sound, store trailers in the Video category
  vita: {
    folders: VitaFolder[];
    order: string[]; // item keys in the user's arrangement
    collectionFolders: boolean; // Steam collections appear as folders
    systemBubbles: boolean; // Library / Store / Friends / … bubbles
    art: ArtPref;
    skin: string; // custom Vita theme (folder/zip name) or ""
    bubbleStyle: "lens" | "glass" | "gloss" | "classic" | "flat";
    motion: boolean; // 3D drifting bubbles
    sway: "off" | "gentle" | "lively";
    gyro: boolean; // sway with the Deck's motion sensors
    focus: "vita" | "ring" | "none"; // highlight of the selected bubble
    touch: boolean; // touchscreen gestures
  };
  xmb: {
    ps3Color: number; // -1 = by month, 0–11 = fixed month colour
    pspColor: number;
    collectionFolders: boolean;
    p3t: string; // PS3 .p3t theme file name or ""
  };
  x360: { style: X360Style; guideSide?: "left" | "right" }; // which Xbox 360 dashboard era
  dial: DialSettings;
  themedStore: boolean; // Store entries open the store styled like the current theme
  version: number;
}

export type FooterMode = "show" | "hints" | "hide";
export const FOOTER_MODES: { id: FooterMode; name: string }[] = [
  { id: "hide", name: "Hide the whole bar" },
  { id: "hints", name: "Hide only the button hints" },
  { id: "show", name: "Show (Steam default)" },
];

export const DEFAULTS: Settings = {
  backgroundMusic: true,
  ps4GameBackgrounds: true,
  castleWeather: false,
  castleWindows: "replace",
  videoBackgrounds: {},
  tvMode: false,
  enabled: true,
  theme: "vita",
  source: "installed",
  sort: "recent",
  aAction: "theme",
  hideSteamHeader: true,
  footer: "hide",
  clock24: false,
  profileName: "",
  sounds: true,
  packs: {},
  music: {ps3:false,psp:false,x360:false},
  musicPacks: {},
  musicVolume: 40,
  sfxVolume: 80,
  wallpapers: {},
  wallpaperDim: 25,
  maxGames: 400,
  animations: true,
  badges: { protondb: false, deck: false },
  coverStyles: {},
  titles: {},
  trailers: { preview: true, sound: false, video: false },
  vita: { folders: [], order: [], collectionFolders: true, systemBubbles: true, art: "portrait", skin: "", bubbleStyle: "lens", motion: true, sway: "gentle", gyro: true, focus: "vita", touch: true },
  xmb: { ps3Color: -1, pspColor: -1, collectionFolders: true, p3t: "" },
  x360: { style: "metro", guideSide: "right" },
  dial: { look:"classic", motion:"rotate", activation:"on-browse", reflections:true, projectionLight:true, floatingCover:true, sound:"reference" },
  themedStore: true,
  version: 1,
};

const backendGet = callable<[], Partial<Settings> | null>("get_settings");
const backendSet = callable<[settings: Settings], boolean>("set_settings");

let current: Settings = DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());

function merge(saved: any): Settings {
  const s: any = { ...DEFAULTS, ...(saved && typeof saved === "object" ? saved : {}) };
  if (typeof s.minecraftSkin !== "string" || s.minecraftSkin.length > 60000 || !s.minecraftSkin.startsWith("data:image/png;base64,")) s.minecraftSkin = "";
  s.minecraftSlim = s.minecraftSlim === true;
  if (!["Sony","Microsoft","Bonus"].includes(s.presetCompany)) delete s.presetCompany;
  s.minecraftFollowFocus = s.minecraftFollowFocus !== false;
  s.dial = { ...DEFAULTS.dial, ...(saved?.dial ?? {}) };
  if (!["classic","chrome","crimson","arctic"].includes(s.dial.look)) s.dial.look = "classic";
  if (!["rotate","pulse","hologram","rhombus","rhombus-slow","none"].includes(s.dial.motion)) s.dial.motion = "rotate";
  if (Array.isArray(s.dial.motions)) s.dial.motions = [...new Set(s.dial.motions.filter((m: string) => ["rotate","pulse","hologram","rhombus","rhombus-slow"].includes(m)))];
  else s.dial.motions = s.dial.motion === "none" ? [] : [s.dial.motion];
  if (!["on-browse","always","off"].includes(s.dial.activation)) s.dial.activation = "on-browse";
  if (!["reference","pack","off"].includes(s.dial.sound)) s.dial.sound = "reference";
  if (typeof s.dial.floatingCover !== "boolean") s.dial.floatingCover = true;
  if (typeof s.dial.projectionLight !== "boolean") s.dial.projectionLight = true;
  if (typeof s.dial.reflections !== "boolean") s.dial.reflections = true;
  s.vita = { ...DEFAULTS.vita, ...(saved?.vita ?? {}) };
  s.xmb = { ...DEFAULTS.xmb, ...(saved?.xmb ?? {}) };
  s.coverStyles = Object.fromEntries(Object.entries(saved?.coverStyles ?? {}).filter(([theme,value]) => THEMES.some(t=>t.id===theme) && ["flat","case3d"].includes(String(value))));
  s.backgroundMusic = saved?.backgroundMusic !== false;
  s.ps4GameBackgrounds = saved?.ps4GameBackgrounds !== false;
  s.castleWeather = saved?.castleWeather === true;
  s.castleWindows = saved?.castleWindows === "layered" ? "layered" : "replace";
  s.videoBackgrounds = { ...(saved?.videoBackgrounds ?? {}) };
  s.packs = { ...(saved?.packs ?? {}) };
  s.music = { ...DEFAULTS.music, ...(saved?.music ?? {}) };
  s.musicPacks = { ...(saved?.musicPacks ?? {}) };
  s.x360 = { ...DEFAULTS.x360, ...(saved?.x360 ?? {}) };
  if (s.x360.guideSide !== "left" && s.x360.guideSide !== "right") s.x360.guideSide = "right";
  if (!X360_STYLES.some((x) => x.id === s.x360.style)) s.x360.style = "metro";
  s.wallpapers = { ...(saved?.wallpapers ?? {}) };
  s.badges = { ...DEFAULTS.badges, ...(saved?.badges ?? {}) };
  s.titles = { ...(saved?.titles ?? {}) };
  s.trailers = { ...DEFAULTS.trailers, ...(saved?.trailers ?? {}) };
  if (!FOOTER_MODES.some((f) => f.id === s.footer)) s.footer = DEFAULTS.footer;
  if (!THEMES.some((t) => t.id === s.theme)) s.theme = DEFAULTS.theme;
  if (!Array.isArray(s.vita.folders)) s.vita.folders = [];
  if (!["off", "gentle", "lively"].includes(s.vita.sway)) s.vita.sway = "gentle";
  if (!Array.isArray(s.vita.order)) s.vita.order = [];
  return s as Settings;
}

export async function initSettings() {
  try {
    // Never wait forever: if the Python backend didn't start, run on defaults.
    const saved = await Promise.race([
      backendGet(),
      new Promise<never>((_, rej) => setTimeout(() => rej(new Error("backend did not answer")), 3000)),
    ]);
    current = merge(saved);
    setSettingsBackend("ok");
  } catch (e) {
    console.error("[DeckHomeThemes] failed to load settings", e);
    setSettingsBackend("failed");
  }
  loaded = true;
  emit();
}

/** For the browser preview: start from given settings without a backend. */
export function seedSettings(s: Partial<Settings>) {
  current = merge(s);
  loaded = true;
  emit();
}

export const getSettings = () => current;
export const settingsLoaded = () => loaded;

let saveTimer: any;
export function updateSettings(patch: Partial<Settings> | ((s: Settings) => Partial<Settings>)) {
  const p = typeof patch === "function" ? patch(current) : patch;
  current = { ...current, ...p };
  emit();
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    backendSet(current).catch((e) => console.error("[DeckHomeThemes] failed to save settings", e));
  }, 400);
}

export function updateVita(patch: Partial<Settings["vita"]> | ((v: Settings["vita"]) => Partial<Settings["vita"]>)) {
  updateSettings((s) => ({ vita: { ...s.vita, ...(typeof patch === "function" ? patch(s.vita) : patch) } }));
}

function useStore<T>(read: () => T): T {
  const [v, setV] = useState(read);
  useEffect(() => {
    const l = () => setV(read());
    listeners.add(l);
    l();
    return () => {
      listeners.delete(l);
    };
  }, []);
  return v;
}

export const useSettings = () => useStore(() => current);
export const useSettingsLoaded = () => useStore(() => loaded);

export function updateDial(patch: Partial<DialSettings>) {
  updateSettings(s => ({ dial: { ...s.dial, ...patch } }));
}
