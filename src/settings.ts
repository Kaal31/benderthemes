// Settings are stored as JSON on the Deck by the Python backend, so they
// survive reboots and Steam restarts. The frontend keeps one in-memory copy
// and a tiny subscription store so every component re-renders on change.
import { callable } from "@decky/api";
import { useEffect, useState } from "react";
import { setSettingsBackend } from "./diag";
import { migrateUserPreset, StoredPreset } from "./lookState";

export type X360Style = "blades" | "nxe" | "kinect" | "metro";
export const X360_STYLES: { id: X360Style; name: string }[] = [
  { id: "blades", name: "Blades (2005)" },
  { id: "nxe", name: "NXE (2008)" },
  { id: "kinect", name: "Kinect (2010)" },
  { id: "metro", name: "Metro (2011)" },
];
export type VitaLook = "" | "sakura";
export const VITA_LOOKS: { id: VitaLook; name: string }[] = [
  { id: "", name: "Default (blue)" },
  { id: "sakura", name: "Sakura" },
];

export type ThemeId = "ios6" | "gameamp" | "santa-express" | "old-big-picture" | "old-beta-big-picture" | "native" | "onyx" | "silver" | "frame" | "wii" | "wiiu" | "switch" | "n3ds" | "vita" | "ps2" | "ps3" | "psp" | "ps4" | "ps5" | "x360" | "aero" | "aero2" | "xbox" | "dial" | "castle" | "republic" | "minecraft" | "pain" | "nazarick" | "ps1" | "iisu";
export type StyleValue = string | number | boolean;
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
  {id:"ios6",name:"iOS 6 Classic",blurb:"Native iPad SpringBoard, reflective dock and Notification Center"},
  {id:"gameamp",name:"GameAmp",blurb:"Chrome media-player dashboard with stacked windows and reactive meters"},
  {id:"santa-express",name:"Santa Express",blurb:"Native Christmas dashboard with chrome controls, snowfall and music"},
  {id:"old-beta-big-picture",name:"Old Beta Big Picture",blurb:"Early Steam Big Picture with a transforming cover sheet and games carousel"},
  {id:"old-big-picture",name:"Old Big Picture",blurb:"Classic Steam blue dashboard, carousel and native library pages"},
  {id:"onyx",name:"Onyx Wheel (bonus)",blurb:"Black textured body, cover flow and circular touch navigation"},
  {id:"silver",name:"Silver Wheel (bonus)",blurb:"Brushed aluminum, reflected covers and circular wheel navigation"},
  {id:"wii",name:"Wii",blurb:"Channel grid, curved system bar and channel launch banners"},
  {id:"wiiu",name:"Wii U",blurb:"Rounded software tiles and colorful system shortcuts"},
  {id:"switch",name:"Switch",blurb:"Square game tiles with a bright focus frame; .nxtheme themes"},
  {id:"n3ds",name:"Nintendo 3DS",blurb:"HOME Menu: two screens, an icon grid with the mint cursor, folders; 3DS theme files"},
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
  {id:"ps1",name:"PS1",blurb:"BIOS menu, memory cards of pixel save icons and the CD Player"},
  {id:"iisu",name:"iiSU style (bonus)",blurb:"Glass icon grid over game art, pill bars and a colourful dock"},
  {id:"native",name:"Community native layout",blurb:"A trusted community React layout running inside ThemeHub"},
  {id:"frame",name:"Community interface",blurb:"A community theme's own interface, running sealed off from Steam"},
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
/** One cell of the 3DS home, as the console's Launcher.dat / BadgeMngFile.dat keep them: a game (Steam app id),
 *  one of the user's folders, a Steam collection shown as a folder, or a badge (w x h cells from its top-left
 *  cell; `app` = a game the badge starts when tapped). */
export type N3dsCell = { g: number } | { f: string } | { c: string } | { b: string; w?: number; h?: number; app?: number };
export interface N3dsFolder {
  id: string;
  name: string; // up to 16 characters; the icon shows its first letter
  rows: number; // the folder's own zoom level (1..6, 2 on a new folder)
  slots: Record<string, N3dsCell>; // slot number -> cell (up to 60 items)
}
export interface N3dsLayout {
  rows: number; // icons per column on the home grid: the six zoom levels (1..6); columns = 360 / rows
  slots: Record<string, N3dsCell>; // slot number (column-major: column = slot / rows) -> cell; free cells are left out
  folders: N3dsFolder[]; // the user's own folders (up to 60)
  next: number; // a new folder is named after this number, as on the console
  collections: boolean; // Steam collections appear as folders too
}
export const N3DS_SLOTS = 360, N3DS_MAX_FOLDERS = 60, N3DS_FOLDER_ITEMS = 60;
export const N3DS_LAYOUT: N3dsLayout = { rows: 3, slots: {}, folders: [], next: 1, collections: true };
function cleanN3dsCell(c: any): N3dsCell | null {
  if (!c || typeof c !== "object") return null;
  if (Number.isInteger(c.g) && c.g >= 0) return { g: c.g };
  if (typeof c.f === "string" && c.f) return { f: c.f.slice(0, 40) };
  if (typeof c.c === "string" && c.c) return { c: c.c.slice(0, 80) };
  if (typeof c.b === "string" && c.b) {
    const cell: { b: string; w?: number; h?: number; app?: number } = { b: c.b.slice(0, 300) };
    if (c.w === 2) cell.w = 2;
    if (c.h === 2) cell.h = 2;
    if (Number.isInteger(c.app) && c.app > 0) cell.app = c.app;
    return cell;
  }
  return null;
}
function cleanN3dsSlots(raw: any, max: number): Record<string, N3dsCell> {
  const out: Record<string, N3dsCell> = {};
  if (!raw || typeof raw !== "object") return out;
  for (const [k, v] of Object.entries(raw)) {
    const i = Number(k), c = cleanN3dsCell(v);
    if (Number.isInteger(i) && i >= 0 && i < max && c) out[String(i)] = c;
  }
  return out;
}
const n3dsRows = (r: any, d: number) => (Number.isInteger(r) && r >= 1 && r <= 6 ? r : d);
/** A saved 3DS home layout, checked piece by piece (anything unreadable is dropped, never the whole layout). */
export function cleanN3dsLayout(raw: any): N3dsLayout {
  if (!raw || typeof raw !== "object") return { ...N3DS_LAYOUT, slots: {}, folders: [] };
  const folders: N3dsFolder[] = [];
  const seen = new Set<string>();
  for (const f of Array.isArray(raw.folders) ? raw.folders : []) {
    if (!f || typeof f.id !== "string" || !f.id || seen.has(f.id) || folders.length >= N3DS_MAX_FOLDERS) continue;
    seen.add(f.id);
    const slots = cleanN3dsSlots(f.slots, N3DS_FOLDER_ITEMS);
    for (const k of Object.keys(slots)) if ("f" in slots[k] || "c" in slots[k]) delete slots[k]; // folders hold no folders
    folders.push({ id: f.id.slice(0, 40), name: typeof f.name === "string" ? f.name.slice(0, 16) : "", rows: n3dsRows(f.rows, 2), slots });
  }
  const slots = cleanN3dsSlots(raw.slots, 4096);
  for (const k of Object.keys(slots)) { const c = slots[k]; if ("f" in c && !seen.has(c.f)) delete slots[k]; }
  return { rows: n3dsRows(raw.rows, N3DS_LAYOUT.rows), slots, folders, next: Number.isInteger(raw.next) && raw.next > 0 ? raw.next : 1, collections: raw.collections !== false };
}

/** The themed store's optional sections for one theme (both off unless set). */
export interface StoreSections { themes?: boolean; plugins?: boolean }
export function cleanStoreSections(v: any): Partial<Record<ThemeId, StoreSections>> {
  const out: Partial<Record<ThemeId, StoreSections>> = {};
  if (!v || typeof v !== "object" || Array.isArray(v)) return out;
  for (const t of THEMES) {
    const x = v[t.id];
    if (!x || typeof x !== "object") continue;
    const e: StoreSections = {};
    if (x.themes === true) e.themes = true;
    if (x.plugins === true) e.plugins = true;
    if (e.themes || e.plugins) out[t.id] = e;
  }
  return out;
}
export const storeSectionOn = (s: Pick<Settings, "storeSections">, theme: ThemeId, which: keyof StoreSections) => s.storeSections?.[theme]?.[which] === true;

/** What a preset decided before presets v2 (the whole look of every theme, copied). Kept to read and migrate presets
 *  saved then (lookState.migrateUserPreset); v2 presets hold only their own look's paths (lookState.lookPaths).
 *  Everything else (clock, volume, library sorting, Ⓐ…) is the user's own. */
export const LOOK_KEYS = [
  "theme", "activeTheme", "pages", "mix", "iconPicks", "themeOptions", "styles", "vita", "xmb", "x360", "dial", "wallpapers", "wallpaperDim", "packs", "musicPacks", "music",
  "coverStyles", "titles", "iconSizes", "protondbThemes", "videoBackgrounds", "ps4GameBackgrounds", "ps4Skin", "castleWeather", "castleWindows",
  "minecraftFollowFocus", "minecraftWaitForSwipe", "minecraftSlim", "themeFx", "wiiuView", "wiiuTheme", "xboxSkin", "wiiSkin", "wiiSkinMember", "wiiSkinBase", "switchTheme", "wiiuPlazaPositions", "wiiuPlazaTips", "n3dsSkin", "n3dsCursor", "n3dsTop", "n3dsLayout", "hubStyle", "storeSections",
] as const;
export type LookKey = (typeof LOOK_KEYS)[number];
/** A stored preset (v2): "my:<n>" for the user's own, or a built-in / theme-file preset's id once its state was kept. */
export type UserPreset = StoredPreset;
export const MAX_USER_PRESETS = 30;
/** Stored states of built-in looks and theme files (one per preset that was used and changed). */
export const MAX_STORED_PRESETS = 300;
/** A saved preset's look as it may be applied: only the look keys, each with the type its setting has (a hand-edited or
 *  damaged file must not be able to set `enabled`, replace `userPresets` or give the home an unknown theme). */
export function cleanLook(v: any): Partial<Pick<Settings, LookKey>> {
  const out: any = {};
  if (!v || typeof v !== "object" || Array.isArray(v)) return out;
  for (const k of LOOK_KEYS) {
    const x = v[k];
    // keys that have no default value (theme files, the Plaza switches) still have a type
    const d: any = (DEFAULTS as any)[k] ?? (["wiiuTheme", "switchTheme", "wiiSkin", "wiiSkinMember", "wiiSkinBase", "xboxSkin", "n3dsSkin", "ps4Skin"].includes(k) ? "" : k === "wiiuPlazaTips" ? true : k === "wiiuPlazaPositions" ? {} : undefined);
    if (x === undefined || x === null) continue;
    const plain = typeof x === "object" && !Array.isArray(x);
    if (typeof d === "object" && d !== null ? !plain : d !== undefined ? typeof x !== typeof d : !(plain || ["string", "number", "boolean"].includes(typeof x))) continue;
    if (typeof x === "string" && x.length > 300) continue;
    out[k] = x;
  }
  if (out.theme !== undefined && !THEMES.some((t) => t.id === out.theme)) delete out.theme;
  if (out.activeTheme !== undefined && out.activeTheme.length > 64) delete out.activeTheme;
  if (out.storeSections !== undefined) out.storeSections = cleanStoreSections(out.storeSections);
  return out;
}
const cleanPages = (v: any): Settings["pages"] =>
  Object.fromEntries(Object.entries(v && typeof v === "object" ? v : {}).filter(([k, id]) => k.length <= 16 && typeof id === "string" && id.length > 0 && id.length <= 64).slice(0, 16)) as Settings["pages"];

/**
 * Standard options: every theme has them, with a value of its own (Theme options →
 * Standard options). A theme without its own value uses the one for all themes.
 */
export const STANDARD_KEYS = ["clockShown", "clock24", "clockSeconds", "dateFormat", "bgBrightness", "animations", "bgQuality", "tint", "gameArt", "downloadStatus", "sounds", "sfxVolume", "musicVolume", "aAction", "sort"] as const;
export type StandardKey = (typeof STANDARD_KEYS)[number];
export type DateFormat = "MDY" | "DMY" | "YMD";
export type StandardOptions = Pick<Settings, StandardKey>;

export interface ThemeScreensaver {
  mode: "steam" | "custom" | "disabled";
  media: string[];
  labels?: Record<string,string>;
  duration: number;
  shuffle: boolean;
  fit: "contain" | "cover";
  transition: "fade" | "none";
}
export interface Settings {
  personalMii?: {faceShape?:number;beardStyle?:number;moustacheStyle?:number;glassesStyle?:number;earrings?:number;faceStyle?:"drawn"|"detailed";portrait?:string;logoMedia?:"image"|"animated"|"video";decal?:{part:string;point:[number,number,number];normal:[number,number,number];opacity:number;rotation:number;rotationX?:number;rotationY?:number;size:number};accent?:string;logo?:string;logoGame?:string;hat?:number;hatColor?:string;pants?:string;outfit?:number;brows?:number;eyeColor?:string;lipColor?:string;eyeSpacing?:number;eyeY?:number;mouthY?:number;beard?:boolean;moustache?:boolean;name:string;skin:string;hair:string;shirt:string;hairStyle:number;eyes:number;mouth:number;glasses:boolean;female:boolean;height:number;build:number};
  screensaversDisabled?: boolean;
  themeScreensavers?: Record<string, ThemeScreensaver>;
  screensaverSteamBackup?: Record<string, string | number>;

  profilePictures?: Record<string,string>;
  /** The theme (engine manifest id) in use; "" = chosen the old way (layout + skin file). */
  activeTheme: string;
  /** A look's slots (presets v2): per look id, what fills each slot. A theme id (that theme's own file), "none", or an
   *  asset reference from any installed source ("@wp/<file>", "@hub/<set>/<name>", "@file/<kind>/<file>", "#rrggbb"),
   *  see src/engine/assets.ts. Called "Mix and match" before v2; old values stay valid. */
  mix: Record<string, Partial<Record<string, string>>>;
  /** Small data a community interface asked the engine to keep for it (per theme id). */
  frameData: Record<string, unknown>;
  /** Pages drawn by another theme than the home: page id → theme id (missing = like the home). */
  pages: Partial<Record<string, string>>;
  /** Icons picked one at a time: layout → icon spot → "themeId/iconName". */
  iconPicks: Partial<Record<string, Record<string, string>>>;
  /** Stored presets (v2): the user's own ("my:<n>") and the kept state of built-in / theme-file presets. */
  userPresets: UserPreset[];
  /** The preset in use (any preset id); "" = the one the look and theme file on screen give. */
  userPreset: string;
  hiddenThemes?: ThemeId[];
  dismissedFirmware?: string;
  achievementPopups?: boolean;
  firmwareNotifications?: boolean;
  presetCompany?: "Sony" | "Microsoft" | "Nintendo" | "Bonus" | "Community" | "My presets";
  minecraftSkin?: string;
  minecraftFollowFocus?: boolean;
  minecraftWaitForSwipe?: boolean;
  minecraftSlim?: boolean;
  backgroundMusic: boolean;
  themeDeckFocusMusic: boolean;
  ps4GameBackgrounds: boolean;
  castleWeather: boolean;
  castleWindows: "replace" | "layered";
  videoBackgrounds: Partial<Record<ThemeId,boolean>>;
  tvMode: boolean; // safe margins and larger couch-distance text
  enabled: boolean; // replace Steam's home with the themed home
  theme: ThemeId;
  source: string; // "installed" | "all" | "col:<collection id>"
  themeCollections?: Partial<Record<ThemeId, { source: string; ids?: string[] }>>;
  iconSizes?: Partial<Record<ThemeId, number>>;
  themeFx: Record<string, ThemeFx>; // per imported theme file: "vita:<skin>", "psp:<file>", "p3t:<file>"
  sort: SortMode;
  aAction: AAction; // what Ⓐ does on a game
  hideSteamHeader: boolean; // hide Steam's own top bar while the themed home is shown
  /** Shortcut buttons a console's own menu never had (the Wii U dock's Library and Settings, the Wii's Library Channel):
   *  off by default; what they open stays reachable another way (the home's own grid, page tabs, the options menu). */
  shortcutButtons?: boolean;
  footer: FooterMode; // Steam's bottom bar (Steam Menu · A Select · B Back) while the themed home is shown
  clock24: boolean;
  clockShown: boolean; // the clock on the home (off = hidden)
  clockSeconds: boolean;
  dateFormat: DateFormat;
  bgBrightness: number; // the background picture, % (100 = as it is)
  bgQuality: "full" | "half"; // animated backgrounds drawn at full or half resolution
  tint: string; // background colour: "" = the theme's own, "month" = by month, or "#rrggbb"
  gameArt: boolean; // the focused game's art behind the menu
  downloadStatus: boolean; // the corner status while something downloads
  /** Standard options with a value for one theme only. */
  themeOptions: Partial<Record<ThemeId, Partial<StandardOptions>>>;
  /** Each theme's own options (src/engine/themeStyles.ts), by theme and option key. */
  styles: Partial<Record<string, Record<string, StyleValue>>>;
  profileName: string; // "" = ask Steam
  sounds: boolean;
  packs: Partial<Record<ThemeId, string>>; // AudioLoader pack folder per theme ("" = automatic match, "steam" = Steam's sounds)
  music: Partial<Record<ThemeId, boolean>>; // theme music on/off (missing = on)
  musicPacks: Partial<Record<ThemeId, string>>; // pack the music comes from ("" = automatic, "none" = no music)
  sfxVolume: number; // 0–100, pack sounds
  musicVolume: number; // 0–100
  /** The shared music player (src/musicPlayer.ts): play order, repeat and crossfade, kept across restarts. */
  musicShuffle: boolean;
  musicRepeat: "off" | "all" | "one";
  musicCrossfade: number; // seconds, 0 = off, 1–12
  wallpapers: Partial<Record<ThemeId, string>>; // file name in the wallpapers folder
  wallpaperDim: number; // 0–80 %
  maxGames: number; // cap for very large libraries
  animations: boolean; // background animations (waves, particles, towers)
  badges: { protondb: boolean; deck: boolean }; // compatibility badges on game details
  protondbThemes: Record<string, boolean | undefined>; // per-look Options menu; requires detected ProtonDB plugin
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
    look: VitaLook; // built-in colour look ("" = default); no CSS Loader needed
    bubbleStyle: "lens" | "glass" | "gloss" | "classic" | "flat";
    stockIcons: "image" | "live";
    artEdge: "blend" | "fade" | "off"; // how cover art meets the bubble rim // system bubbles as finished images (console-like) or live glass + glyph
    motion: boolean; // 3D drifting bubbles
    sway: "off" | "gentle" | "lively";
    gyro: boolean; // sway with the Deck's motion sensors
    focus: "vita" | "ring" | "none"; // highlight of the selected bubble
    touch: boolean; // touchscreen gestures
    lock: "off" | "wake" | "always"; // Vita lock screen: after sleep, or also when the home first opens
  };
  xmb: {
    ps3Color: number; // -1 = by month, 0–11 = fixed month colour
    pspColor: number;
    collectionFolders: boolean;
    p3t: string; // PS3 .p3t theme file name or ""
    psp: string; // PSP .ptf / .ctf theme file name or ""
    pspAccurate: boolean; // old switch, read once: true becomes pspSize "console"
    // PSP XMB size: "console" = the console's own proportions (bigger icons and text), "compact" = the smaller default layout,
    // "auto" = console proportions while a .ptf/.ctf theme file is applied (its wallpaper and pictures are drawn for those places:
    // Persona 3 FES's selector circle, the large family's 1:1 pictures), compact otherwise
    pspSize: "auto" | "console" | "compact";
  };
  wiiuPlazaPositions?: Record<string,{x:number;z:number}>;
  wiiuPlazaTips?: boolean;
  wiiuView?: "grid" | "plaza";
  wiiuTheme?: string; // Wii U custom theme (.utheme file name in skins/wiiu) or ""
  wiiSkinBase?: string;
  wiiSkinMember?: string;
  wiiSkin?: string; // Wii System Menu theme: a .mym / .csm name under skins/wii ("" = none)
  n3dsSkin?: string; // Nintendo 3DS theme: a .zip / folder / body_LZ.bin name under skins/3ds ("" = the built-in stock look)
  n3dsTop?: "show" | "hide" | "split"; // 3DS look: "hide" shows only the bottom screen, as large as possible ("show" when unset)
  n3dsCursor?: "3ds" | "simple"; // 3DS look: the bobbing corner cursor, or a plain focus frame ("3ds" when unset)
  n3dsArrows?: "show" | "hide"; // 3DS look: the half-ring page arrows at the screen edges ("show" when unset; L1 / R1 and swipes still page)
  n3dsHandle?: "show" | "hide"; // 3DS look: the grey scroll bar along the bottom of the icon grid ("show" when unset)
  n3dsLayout?: N3dsLayout; // 3DS home: zoom level and where each icon / folder / badge sits (kept in presets, like the console's saved layouts)
  ps4Skin?: string;
  xboxSkin?: string; // original Xbox skin: a folder or .zip name under skins/xbox ("" = none)
  switchTheme?: string; // Switch theme: a .nxtheme path under skins/switch ("file" or "folder/file") or ""
  originalConsoleArtwork?: boolean; // installed GitFlic UI pack; original/procedural UI is the fallback
  x360: { style: X360Style; cabinetWallpaper?: string; guideSide?: "left" | "right"; skin?: string; gamerpic?: string; showThemeHubLogo?: boolean }; // skin / gamerpic: STFS package names in skins/x360 ("" = none); which Xbox 360 dashboard era
  dial: DialSettings;
  hubStyle: string; // Hub look: "auto" (the theme home it was opened on), "neutral", "preview" (the theme focused in Discover) or a console theme id (always that look when installed)
  themedStore: boolean; // Store entries open the store styled like the current theme
  /** Extra sections of the themed store, per home theme: Themes (packs + theme files) and Plugins (Spotlight). Hidden unless turned on. */
  storeSections: Partial<Record<ThemeId, StoreSections>>;
  keyboardSpacing?: number; // Key inset in px, 0–5; default 1 (global, persisted).
  keyboardSkin?: boolean; // Steam's on-screen keyboard skinned like the active look (src/keyboardSkins.ts); off unless set to true (global)
  // PSP theme files whose boot intro / game-start clip is used, "" = none. One of each at a time;
  // it stays in use while other themes are active.
  bootIntro: string;
  gameBoot: string;
  /** False only on a fresh install until the first-run flow (Onboarding.tsx) is finished or skipped. */
  onboardingDone: boolean;
  hubStartupAnimation?: boolean; // opt in to repeat ThemeHub branding after first install
  hubStartupSeen?: boolean;
  themeStartupIntros?: Record<string,boolean>; // false disables automatic intros for this theme
  explicitThemeDownloads?: boolean;
  version: number;
}

/** Tuning of effects that come from an imported console theme. */
export interface ThemeFx {
  icons: boolean; // use the theme's icons
  background: boolean; // use the theme's wallpapers / slideshow
  smooth: number; // Vita: theme icon edge smoothing: 0 off (original pixels), 1 light, 2 normal, 3 strong
  shadow: number; // Vita: drop shadow under theme icons, % (0 = none)
  labels: boolean; // Vita: the theme's bubble label colours
  visuals: boolean; // XMB: the theme's folder / loading / broken / default-thumbnail pictures
  glowCat: number; // XMB focus glow on category icons, % (0 = off)
  glowItem: number; // XMB focus glow on item icons, %
  glowPulse: boolean; // XMB: the glow breathes
  slideSec: number; // PS3 slideshow: seconds per picture
  kenBurns?: boolean; // PS3 slideshow: slow pan + zoom; unset = on for dynamic themes, off for static picture slideshows
  fadeMs: number; // PS3 slideshow: crossfade length
  wave: boolean; // PSP .ctf: the theme's own 3D wave
  waveLevel: number; // its brightness, %
  sceneAnim: boolean; // PSP .ctf: the background's own animations; PS3: run dynamic themes' 3D scene
  font: boolean; // PSP .ctf: the theme's font
  textLevel: number; // XMB: brightness of unselected list names, % (PSP console: 42)
  catLevel: number; // XMB: brightness of unselected category icons, % (PSP console: 70)
  iconLevel: number; // XMB: brightness of unselected list icons, % (PSP console: 100)
  bgLevel: number; // XMB: background brightness, % (100 = as the theme draws it)
  wordLevel: number; // XMB: size of categories a theme draws as words, % (100 = fit between neighbours)
  sounds: boolean; // PS3: the theme file's own sound effects (used when "Sound effects" is Automatic)
  scroll?: boolean; // 3DS: scrolling wallpapers move with the page (unset = on)
}
export const FX_DEFAULT: ThemeFx = { icons: true, background: true, smooth: 2, shadow: 100, labels: true, visuals: true, glowCat: 100, glowItem: 100, glowPulse: true, slideSec: 9, fadeMs: 1800, wave: true, waveLevel: 100, sceneAnim: true, font: true, textLevel: 42, catLevel: 70, iconLevel: 100, bgLevel: 100, wordLevel: 100, sounds: true };
/** The PS3 dims whole unselected rows (78 %, rows above the bar a little more) and categories to 58 %. */
const PS3_FX: Partial<ThemeFx> = { textLevel: 78, catLevel: 58 };
const isPs3Key = (k: string) => k.startsWith("p3t:") || k.startsWith("ps3:");
export const SMOOTH_LEVELS = [
  { id: 0, name: "Off (original pixels)" },
  { id: 1, name: "Light" },
  { id: 2, name: "Normal" },
  { id: 3, name: "Strong" },
];
export const themeFx = (s: Settings, key: string): ThemeFx => ({
  ...FX_DEFAULT,
  // on a PSP the theme's focus picture is only drawn behind the selected list item
  ...(key.startsWith("psp:") ? { glowCat: 0 } : {}),
  ...(isPs3Key(key) ? PS3_FX : {}),
  ...(key ? s.themeFx?.[key] : undefined),
});
export function updateThemeFx(key: string, patch: Partial<ThemeFx>) {
  if (!key) return;
  updateSettings((p) => ({ themeFx: { ...p.themeFx, [key]: { ...themeFx(p, key), ...patch } } }));
}

export type FooterMode = "show" | "hints" | "hide";
export const FOOTER_MODES: { id: FooterMode; name: string }[] = [
  { id: "hide", name: "Hide the whole bar" },
  { id: "hints", name: "Hide only the button hints" },
  { id: "show", name: "Show (Steam default)" },
];

export const DEFAULTS: Settings = {
  activeTheme: "",
  mix: {},
  frameData: {},
  pages: {},
  iconPicks: {},
  userPresets: [],
  userPreset: "",
  backgroundMusic: true,
  themeDeckFocusMusic: true,
  ps4GameBackgrounds: true,
  castleWeather: false,
  castleWindows: "replace",
  videoBackgrounds: {},
  tvMode: false,
  enabled: true,
  theme: "psp",
  source: "installed",
  sort: "recent",
  aAction: "theme",
  hideSteamHeader: true,
  footer: "hide",
  clock24: false,
  clockShown: true,
  clockSeconds: false,
  dateFormat: "MDY",
  bgBrightness: 100,
  bgQuality: "full",
  tint: "",
  gameArt: false,
  downloadStatus: true,
  themeOptions: {},
  styles: {},
  profileName: "",
  sounds: true,
  packs: {},
  music: {ps3:false,psp:false,x360:false},
  musicPacks: {},
  musicVolume: 40,
  musicShuffle: false,
  musicRepeat: "off",
  musicCrossfade: 0,
  sfxVolume: 80,
  wallpapers: {},
  wallpaperDim: 25,
  maxGames: 400,
  animations: true,
  badges: { protondb: false, deck: false },
  protondbThemes: {},
  coverStyles: {},
  titles: {},
  trailers: { preview: true, sound: false, video: false },
  vita: { folders: [], order: [], collectionFolders: true, systemBubbles: true, art: "portrait", skin: "", look: "", bubbleStyle: "lens", stockIcons: "image", artEdge: "blend", motion: true, sway: "gentle", gyro: true, focus: "vita", touch: true, lock: "off" },
  xmb: { ps3Color: -1, pspColor: -1, collectionFolders: true, p3t: "", psp: "", pspAccurate: false, pspSize: "auto" },
  x360: { style: "metro", guideSide: "right" },
  dial: { look:"classic", motion:"rotate", activation:"on-browse", reflections:true, projectionLight:true, floatingCover:true, sound:"reference" },
  themedStore: true,
  storeSections: {},
  hubStyle: "auto",
  bootIntro: "",
  gameBoot: "",
  onboardingDone: true,
  explicitThemeDownloads: true,
  themeFx: {},
  version: 2, // 2: presets v2 (stored presets are {id, name, base, theme, diff})
};

const backendGet = callable<[], Partial<Settings> | null>("get_settings");
const backendSet = callable<[settings: Settings], boolean>("set_settings");

let current: Settings = DEFAULTS;
let loaded = false;
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
/** Called after every settings change (outside React); returns the unsubscribe function. */
export function onSettingsChange(l: () => void): () => void {
  listeners.add(l);
  return () => void listeners.delete(l);
}

/** Checks and completes settings read from a file (or a preset patch laid over the current settings). */
export const cleanSettings = (saved: any): Settings => merge(saved);
function merge(saved: any): Settings {
  const s: any = { ...DEFAULTS, ...(saved && typeof saved === "object" ? saved : {}) };
  if (s.theme === "frame" && s.activeTheme === "ios6") s.theme = "ios6";
  if(s.theme === "frame" && s.activeTheme === "santa-express") s.theme = "santa-express";
  if(s.theme === "frame" && s.activeTheme === "old-big-picture") s.theme = "old-big-picture";
  s.protondbThemes = Object.fromEntries(Object.entries(s.protondbThemes && typeof s.protondbThemes === "object" ? s.protondbThemes : {}).filter(([key,value])=>key.length>0&&key.length<=64&&typeof value==="boolean").slice(0,500));
  if (s.theme === "frame" && s.activeTheme === "gameamp") s.theme = "gameamp";
  s.themeDeckFocusMusic = s.themeDeckFocusMusic !== false;
  s.profilePictures=Object.fromEntries(Object.entries(s.profilePictures&&typeof s.profilePictures==="object"?s.profilePictures:{}).filter(([k,v])=>k.length<128&&typeof v==="string"&&v.length<500000&&/^data:image\/png;base64,/.test(v)));
  if (typeof s.minecraftSkin !== "string" || s.minecraftSkin.length > 60000 || !s.minecraftSkin.startsWith("data:image/png;base64,")) s.minecraftSkin = "";
  s.wiiuPlazaPositions=Object.fromEntries(Object.entries(s.wiiuPlazaPositions??{}).filter(([k,v]:[string,any])=>/^\d+$/.test(k)&&Number.isFinite(v?.x)&&Number.isFinite(v?.z)).slice(0,1000).map(([k,v]:[string,any])=>[k,{x:Math.max(-17,Math.min(17,v.x)),z:Math.max(-14,Math.min(13,v.z))}]));
  if (s.wiiuView!=="plaza") s.wiiuView="grid";
  s.minecraftSlim = s.minecraftSlim === true;
  s.minecraftWaitForSwipe = s.minecraftWaitForSwipe === true;
  if (!["Sony","Microsoft","Nintendo","Bonus","Community"].includes(s.presetCompany)) delete s.presetCompany; // "My presets" (before v2): saved presets are listed with their look now
  if (typeof s.activeTheme !== "string" || s.activeTheme.length > 64) s.activeTheme = "";
  s.mix = Object.fromEntries(Object.entries(s.mix && typeof s.mix === "object" ? s.mix : {}).filter(([k, v]) => k.length <= 64 && v && typeof v === "object").slice(0, 500)
    .map(([k, v]: [string, any]) => [k, Object.fromEntries(Object.entries(v).filter(([slot, from]) => slot.length <= 32 && typeof from === "string" && from.length <= 320))]));
  s.frameData = Object.fromEntries(Object.entries(s.frameData && typeof s.frameData === "object" ? s.frameData : {}).filter(([k, v]) => k.length <= 64 && JSON.stringify(v ?? null).length <= 65536).slice(0, 100));
  s.pages = cleanPages(s.pages);
  s.clockShown = s.clockShown !== false;
  s.clockSeconds = s.clockSeconds === true;
  if (!["MDY", "DMY", "YMD"].includes(s.dateFormat)) s.dateFormat = "MDY";
  s.bgBrightness = Number.isFinite(s.bgBrightness) ? Math.min(100, Math.max(30, Math.round(s.bgBrightness))) : 100;
  if (s.bgQuality !== "half") s.bgQuality = "full";
  if (typeof s.tint !== "string" || !(s.tint === "" || s.tint === "month" || /^#[0-9a-f]{6}$/i.test(s.tint))) s.tint = "";
  s.gameArt = s.gameArt === true;
  s.downloadStatus = s.downloadStatus !== false;
  s.themeOptions = Object.fromEntries(Object.entries(s.themeOptions && typeof s.themeOptions === "object" ? s.themeOptions : {}).filter(([k, v]) => k.length <= 16 && v && typeof v === "object")
    .map(([k, v]: [string, any]) => [k, Object.fromEntries(Object.entries(v).filter(([key, val]) => (STANDARD_KEYS as readonly string[]).includes(key) && ["boolean", "number", "string"].includes(typeof val)))]));
  s.styles = Object.fromEntries(Object.entries(s.styles && typeof s.styles === "object" ? s.styles : {}).filter(([k, v]) => k.length <= 16 && v && typeof v === "object").slice(0, 40)
    .map(([k, v]: [string, any]) => [k, Object.fromEntries(Object.entries(v).filter(([key, val]) => key.length <= 32 && (["boolean", "number"].includes(typeof val) || (typeof val === "string" && val.length <= 80))).slice(0, 60))]));
  s.iconPicks = Object.fromEntries(Object.entries(s.iconPicks && typeof s.iconPicks === "object" ? s.iconPicks : {}).filter(([k, v]) => k.length <= 16 && v && typeof v === "object").slice(0, 40)
    .map(([k, v]: [string, any]) => [k, Object.fromEntries(Object.entries(v).filter(([spot, key]) => spot.length <= 41 && typeof key === "string" && key.length <= 106).slice(0, 100))]));
  // presets saved before v2 ({id, name, look}) are migrated to {id, name, base, theme, diff} here, once
  let mine = 0, kept = 0;
  s.userPresets = (Array.isArray(s.userPresets) ? s.userPresets : []).filter((p: any, i: number, all: any[]) => p && typeof p.id === "string" && p.id.length <= 320 && all.findIndex((q: any) => q?.id === p.id) === i && typeof p.name === "string")
    .filter((p: any) => (/^my:\d{1,6}$/.test(p.id) ? ++mine <= MAX_USER_PRESETS : !p.id.startsWith("my:") && ++kept <= MAX_STORED_PRESETS))
    .map((p: any) => migrateUserPreset(p, THEMES.some((t) => t.id === s.theme) ? s.theme : DEFAULTS.theme))
    .filter((p: UserPreset | null): p is UserPreset => !!p && p.base.length <= 64 && JSON.stringify(p.diff).length <= 200000)
    .map((p: UserPreset) => ({ ...p, name: p.name.slice(0, 60) }));
  s.version = 2;
  if (typeof s.userPreset !== "string" || !s.userPresets.some((p: UserPreset) => p.id === s.userPreset)) s.userPreset = "";
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
  s.themeFx = {};
  for (const [k, v] of Object.entries(saved?.themeFx ?? {})) {
    if (typeof k !== "string" || k.length > 300 || !v || typeof v !== "object") continue;
    const o: any = v, n = (x: any, lo: number, hi: number, d: number) => (Number.isFinite(x) ? Math.min(hi, Math.max(lo, Math.round(x))) : d);
    const b = (x: any, d: boolean) => (typeof x === "boolean" ? x : d);
    const D = FX_DEFAULT;
    // PS3 entries saved before the PS3 used these levels carry the PSP's numbers: treat those as unset
    if (isPs3Key(k) && o.textLevel === 42 && o.catLevel === 70) { o.textLevel = undefined; o.catLevel = undefined; }
    s.themeFx[k] = {
      icons: b(o.icons, D.icons), background: b(o.background, D.background), smooth: n(o.smooth, 0, 3, D.smooth), shadow: n(o.shadow, 0, 200, D.shadow),
      labels: b(o.labels, D.labels), visuals: b(o.visuals, D.visuals), glowCat: n(o.glowCat, 0, 200, k.startsWith("psp:") ? 0 : D.glowCat), glowItem: n(o.glowItem, 0, 200, D.glowItem),
      glowPulse: b(o.glowPulse, D.glowPulse), slideSec: n(o.slideSec, 4, 60, D.slideSec), kenBurns: typeof o.kenBurns === "boolean" ? o.kenBurns : undefined, fadeMs: n(o.fadeMs, 300, 4000, D.fadeMs),
      wave: b(o.wave, D.wave), waveLevel: n(o.waveLevel, 0, 200, D.waveLevel), sceneAnim: b(o.sceneAnim, D.sceneAnim), font: b(o.font, D.font),
      textLevel: n(o.textLevel, 0, 100, isPs3Key(k) ? PS3_FX.textLevel! : D.textLevel), catLevel: n(o.catLevel, 0, 100, isPs3Key(k) ? PS3_FX.catLevel! : D.catLevel), iconLevel: n(o.iconLevel, 0, 100, D.iconLevel), bgLevel: n(o.bgLevel, 20, 150, D.bgLevel),
      wordLevel: n(o.wordLevel, 50, 250, D.wordLevel), sounds: b(o.sounds, D.sounds),
    };
  }
  if (typeof s.xmb.psp !== "string") s.xmb.psp = "";
  if (typeof s.xmb.p3t !== "string") s.xmb.p3t = "";
  if (typeof s.vita.skin !== "string") s.vita.skin = "";
  if (typeof s.bootIntro !== "string" || s.bootIntro.length > 300) s.bootIntro = "";
  s.onboardingDone = saved?.onboardingDone !== false;
  s.hubStartupAnimation = saved?.hubStartupAnimation === true;
  s.hubStartupSeen = typeof saved?.hubStartupSeen === "boolean" ? saved.hubStartupSeen : saved?.onboardingDone !== false;
  s.themeStartupIntros = Object.fromEntries(Object.entries(saved?.themeStartupIntros??{}).filter(([k,v])=>k.length<128&&typeof v==="boolean"));
  if (typeof s.gameBoot !== "string" || s.gameBoot.length > 300) s.gameBoot = "";
  s.xmb.pspAccurate = s.xmb.pspAccurate === true;
  // the old on/off switch: on stays the console's size; off (also the old default) becomes Auto, so theme files line up with their art
  if (!["auto", "console", "compact"].includes(s.xmb.pspSize as string)) s.xmb.pspSize = s.xmb.pspAccurate ? "console" : "auto";
  s.coverStyles = Object.fromEntries(Object.entries(saved?.coverStyles ?? {}).filter(([theme,value]) => THEMES.some(t=>t.id===theme) && ["flat","case3d"].includes(String(value))));
  s.screensaversDisabled = saved?.screensaversDisabled === true;
  s.themeScreensavers = Object.fromEntries(Object.entries(saved?.themeScreensavers ?? {}).filter(([key,v]) => key.length<=160 && v && typeof v==="object").map(([key,v]:[string,any])=>[key,{
    mode: ["steam","custom","disabled"].includes(v.mode)?v.mode:"steam",
    media: Array.isArray(v.media)?[...new Set(v.media.filter((x:any)=>typeof x==="string"&&/^[a-f0-9]{64}\.(gif|mp4|webm|png|jpe?g|webp)$/.test(x)))].slice(0,100):[],
    labels: v.labels && typeof v.labels==="object" ? Object.fromEntries(Object.entries(v.labels).filter(([k,x])=>/^[a-f0-9]{64}\.(gif|mp4|webm|png|jpe?g|webp)$/.test(k)&&typeof x==="string").map(([k,x])=>[k,String(x).slice(0,160)])) : {},
    duration: Number.isFinite(v.duration)?Math.max(3,Math.min(300,Math.round(v.duration))):15,
    shuffle:v.shuffle===true, fit:v.fit==="cover"?"cover":"contain",transition:v.transition==="none"?"none":"fade",
  }]));
  s.screensaverSteamBackup = Object.fromEntries(Object.entries(saved?.screensaverSteamBackup??{}).filter(([k,v])=>k==="screensaver_current_id"?typeof v==="string":["system_idle_screensaver_ac_sec","system_idle_screensaver_battery_sec"].includes(k)&&typeof v==="number"&&Number.isFinite(v)&&v>=0));
  s.backgroundMusic = saved?.backgroundMusic !== false;
  s.musicShuffle = saved?.musicShuffle === true;
  s.musicRepeat = saved?.musicRepeat === "all" || saved?.musicRepeat === "one" ? saved.musicRepeat : "off";
  s.musicCrossfade = Number.isFinite(saved?.musicCrossfade) ? Math.max(0, Math.min(12, Math.round(saved.musicCrossfade))) : 0;
  s.ps4GameBackgrounds = saved?.ps4GameBackgrounds !== false;
  s.castleWeather = saved?.castleWeather === true;
  s.shortcutButtons = saved?.shortcutButtons === true;
  s.castleWindows = saved?.castleWindows === "layered" ? "layered" : "replace";
  s.videoBackgrounds = { ...(saved?.videoBackgrounds ?? {}) };
  s.packs = { ...(saved?.packs ?? {}) };
  s.music = { ...DEFAULTS.music, ...(saved?.music ?? {}) };
  s.musicPacks = { ...(saved?.musicPacks ?? {}) };
  s.x360 = { ...DEFAULTS.x360, ...(saved?.x360 ?? {}) };
  if (s.x360.guideSide !== "left" && s.x360.guideSide !== "right") s.x360.guideSide = "right";
  if (!X360_STYLES.some((x) => x.id === s.x360.style)) s.x360.style = "metro";
  for (const k of ["switchTheme", "wiiuTheme"] as const) if (typeof s[k] !== "string") delete s[k];
  if (typeof s.x360.skin !== "string") delete s.x360.skin;
  if (typeof s.x360.gamerpic !== "string") delete s.x360.gamerpic;
  s.wiiSkin = typeof saved?.wiiSkin === "string" ? saved.wiiSkin : "";
  s.ps4Skin = typeof saved?.ps4Skin === "string" ? saved.ps4Skin : "";
  s.xboxSkin = typeof saved?.xboxSkin === "string" ? saved.xboxSkin : "";
  s.n3dsSkin = typeof saved?.n3dsSkin === "string" ? saved.n3dsSkin : "";
  s.n3dsCursor = saved?.n3dsCursor === "simple" ? "simple" : "3ds";
  s.n3dsTop = saved?.n3dsTop === "hide" || saved?.n3dsTop === "split" ? saved.n3dsTop : "show";
  s.n3dsArrows = saved?.n3dsArrows === "hide" ? "hide" : "show";
  s.n3dsHandle = saved?.n3dsHandle === "hide" ? "hide" : "show";
  s.n3dsLayout = cleanN3dsLayout(saved?.n3dsLayout);
  s.wallpapers = { ...(saved?.wallpapers ?? {}) };
  s.badges = { ...DEFAULTS.badges, ...(saved?.badges ?? {}) };
  s.titles = { ...(saved?.titles ?? {}) };
  s.storeSections = cleanStoreSections(saved?.storeSections);
  s.trailers = { ...DEFAULTS.trailers, ...(saved?.trailers ?? {}) };
  if (s.hubStyle !== "auto" && s.hubStyle !== "neutral" && s.hubStyle !== "preview" && !THEMES.some((t) => t.id === s.hubStyle)) s.hubStyle = "auto";
  if (!FOOTER_MODES.some((f) => f.id === s.footer)) s.footer = DEFAULTS.footer;
  if (!THEMES.some((t) => t.id === s.theme)) s.theme = DEFAULTS.theme;
  if (!Array.isArray(s.vita.folders)) s.vita.folders = [];
  if (!["off", "gentle", "lively"].includes(s.vita.sway)) s.vita.sway = "gentle";
  if (!Array.isArray(s.vita.order)) s.vita.order = [];
  if (!VITA_LOOKS.some((l) => l.id === s.vita.look)) s.vita.look = "";
  if (!["off", "wake", "always"].includes(s.vita.lock)) s.vita.lock = "off";
  if (!["image", "live"].includes(s.vita.stockIcons)) s.vita.stockIcons = "image";
  if (!["blend", "fade", "off"].includes(s.vita.artEdge)) s.vita.artEdge = "blend";
  return s as Settings;
}

// The stored settings could not be read at start (the backend did not answer in time): nothing is saved while that
// holds, or the stored file would be replaced by defaults. Changes made meanwhile are kept in `unsaved`, the load is
// retried, and once it works the stored settings are merged first and those changes are applied on top.
let storeUnread = false;
let unsaved: Partial<Settings>[] = [];
let retryTimer: any;
function retryLoad(tries = 0) {
  clearTimeout(retryTimer);
  if (!storeUnread) return;
  retryTimer = setTimeout(async () => {
    try {
      const saved = await backendGet();
      let next = merge(saved);
      for (const p of unsaved) next = { ...next, ...p };
      const had = unsaved.length > 0;
      storeUnread = false;
      unsaved = [];
      current = next;
      setSettingsBackend("ok");
      emit();
      if (had) saveSoon();
    } catch {
      retryLoad(tries + 1);
    }
  }, tries < 40 ? 3000 : 30000); // every 3 s for two minutes, then every 30 s
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
    storeUnread = true;
    retryLoad();
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

/** The settings as themes see them: the theme on screen's own standard options over the shared ones. */
let view: Settings = DEFAULTS;
let viewOf: Settings | null = null;
export function withThemeOptions(s: Settings, theme: ThemeId = s.theme): Settings {
  const own = s.themeOptions?.[theme];
  return own && Object.keys(own).length ? { ...s, ...own } : s;
}
export const getSettings = () => {
  if (viewOf !== current) {
    view = withThemeOptions(current);
    viewOf = current;
  }
  return view;
};
/** The settings as saved, without a theme's own standard options applied (for menus that edit them). */
export const getRawSettings = () => current;

/** Set a standard option for one theme (undefined = use the value for all themes). */
export function setThemeOption<K extends StandardKey>(theme: ThemeId, key: K, value: Settings[K] | undefined) {
  updateSettings((p) => {
    const mine: Partial<StandardOptions> = { ...(p.themeOptions[theme] ?? {}) };
    if (value === undefined) delete mine[key];
    else mine[key] = value;
    return { themeOptions: { ...p.themeOptions, [theme]: mine } };
  });
}
export const settingsLoaded = () => loaded;

let saveTimer: any;
// presets.ts: when a change shows another look than the one on screen, the preset that was in use keeps its state
type LookChangeHook = (before: Settings, patch: Partial<Settings>) => Partial<Settings>;
let lookChangeHook: LookChangeHook | null = null;
export const setLookChangeHook = (h: LookChangeHook | null) => { lookChangeHook = h; };
export function updateSettings(patch: Partial<Settings> | ((s: Settings) => Partial<Settings>)) {
  let p = typeof patch === "function" ? patch(current) : patch;
  if (lookChangeHook && loaded) p = lookChangeHook(current, p);
  if(p.wiiSkin!==undefined&&p.wiiSkin!==current.wiiSkin&&p.wiiSkinMember===undefined)p={...p,wiiSkinMember:""};
  current = { ...current, ...p };
  emit();
  if (storeUnread) {
    unsaved.push(p); // see retryLoad: settings that were not read are never overwritten
    return;
  }
  saveSoon();
}
function saveSoon() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    backendSet(current).catch((e) => console.error("[DeckHomeThemes] failed to save settings", e));
  }, 400);
}

/** Back to defaults for one theme: its look and options, its per-theme-file tunings, icon size,
 *  titles, cover style, sound/music pack and wallpaper choice. Kept: which theme file is selected,
 *  Vita folders and bubble order, the 3DS home layout (your own content), and every other theme's settings. */
export function resetThemeSettings(theme: ThemeId) {
  updateSettings((p) => {
    const drop = <T,>(rec: Partial<Record<ThemeId, T>> | undefined) => {
      const r = { ...(rec || {}) };
      delete r[theme];
      return r;
    };
    const out: Partial<Settings> = {
      iconSizes: drop(p.iconSizes), protondbThemes: Object.fromEntries(Object.entries(p.protondbThemes).filter(([key])=>key!==theme&&!key.startsWith(`${theme}:`)&&!(p.theme===theme&&key===p.activeTheme))), titles: drop(p.titles), coverStyles: drop(p.coverStyles), packs: drop(p.packs),
      music: drop(p.music), musicPacks: drop(p.musicPacks), wallpapers: drop(p.wallpapers), videoBackgrounds: drop(p.videoBackgrounds),
      storeSections: drop(p.storeSections),
    };
    const fx = { ...p.themeFx };
    const keys: string[] = [];
    if (theme === "vita") {
      out.vita = { ...DEFAULTS.vita, folders: p.vita.folders, order: p.vita.order, skin: p.vita.skin };
      keys.push(`vita:${p.vita.skin}`);
    }
    if (theme === "psp" || theme === "ps3") {
      out.xmb = theme === "psp"
        ? { ...p.xmb, pspColor: DEFAULTS.xmb.pspColor, pspAccurate: DEFAULTS.xmb.pspAccurate, pspSize: DEFAULTS.xmb.pspSize }
        : { ...p.xmb, ps3Color: DEFAULTS.xmb.ps3Color };
      keys.push(theme === "psp" ? `psp:${pspFile(p)}` : `p3t:${p.xmb.p3t}`, `${theme}:`);
    }
    if (theme === "wii" && p.wiiSkin) keys.push(`wii:${p.wiiSkin}`);
    if (theme === "wiiu" && p.wiiuTheme) keys.push(`wiiu:${p.wiiuTheme}`);
    if (theme === "xbox" && p.xboxSkin) keys.push(`xbox:${p.xboxSkin}`);
    if (theme === "n3ds") { out.n3dsCursor = "3ds"; out.n3dsTop = "show"; out.n3dsArrows = "show"; out.n3dsHandle = "show"; if (p.n3dsSkin) keys.push(`n3ds:${p.n3dsSkin}`); }
    if (theme === "x360") {
      // like the other consoles: the theme package and gamer picture in use stay, their switches go back to defaults
      out.x360 = { ...DEFAULTS.x360, ...(p.x360?.skin ? { skin: p.x360.skin } : {}), ...(p.x360?.gamerpic ? { gamerpic: p.x360.gamerpic } : {}) };
      if (p.x360?.skin) keys.push(`x360:${p.x360.skin}`);
    }
    if (theme === "dial") out.dial = { ...DEFAULTS.dial };
    if (theme === "ps4") { out.ps4GameBackgrounds = DEFAULTS.ps4GameBackgrounds; if (p.ps4Skin) keys.push(`ps4:${p.ps4Skin}`); }
    if (theme === "switch" && p.switchTheme) keys.push(`nx:${p.switchTheme}`);
    if (theme === "castle") Object.assign(out, { castleWeather: DEFAULTS.castleWeather, castleWindows: DEFAULTS.castleWindows });
    if (theme === "minecraft") Object.assign(out, { minecraftFollowFocus: true, minecraftWaitForSwipe: false, minecraftSlim: false });
    keys.forEach((k) => delete fx[k]);
    out.themeFx = fx;
    if (p.themeOptions?.[theme]) {
      const themeOptions = { ...p.themeOptions };
      delete themeOptions[theme];
      out.themeOptions = themeOptions;
    }
    if (p.styles?.[theme]) {
      const styles = { ...p.styles };
      delete styles[theme];
      out.styles = styles;
    }
    if (p.iconPicks?.[theme]) {
      const iconPicks = { ...p.iconPicks };
      delete iconPicks[theme];
      out.iconPicks = iconPicks;
    }
    if (p.activeTheme) {
      const mix = { ...p.mix };
      delete mix[p.activeTheme];
      out.mix = mix;
    }
    return out;
  });
}

/** Every setting back to defaults (the current theme stays selected; deleted themes stay deleted). */
export function resetAllSettings() {
  // the user's own presets stay; the kept states of built-in looks and theme files go back to their defaults
  updateSettings((p) => ({ ...DEFAULTS, theme: p.theme, activeTheme: p.activeTheme, frameData: p.frameData, userPresets: p.userPresets.filter((u) => u.id.startsWith("my:")), enabled: p.enabled, hiddenThemes: p.hiddenThemes, iconSizes: {}, themeCollections: {}, minecraftSkin: "" }));
}

/** The PSP theme file in use ("" = none: the drawn wave). */
export const pspFile = (s: Settings) => (s.xmb.psp === "-" ? "" : s.xmb.psp);

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

export const useSettings = () => useStore(getSettings);
export const useSettingsLoaded = () => useStore(() => loaded);

export function updateDial(patch: Partial<DialSettings>) {
  updateSettings(s => ({ dial: { ...s.dial, ...patch } }));
}
