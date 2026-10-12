// User-supplied console skins, read on the Deck by the backend:
//  • PS3 .p3t theme files  → XMB background + category icons
//  • PS Vita custom themes (folder or .zip with theme.xml) → page wallpapers + system bubble icons
//  • PSP .ptf / .ctf themes → XMB wallpaper, icons and optional XMB extras (focus glow, thumbnails…)
//  Themes with sound effects also get an extracted sound pack (used when the sound pack is Automatic).
// Nothing from these files is bundled with the plugin.
import { callable } from "@decky/api";
import type { PspSceneData } from "./themes/pspScene";
import { useEffect, useState } from "react";
import { getSettings, pspFile, themeFx, useSettings } from "./settings";
import { onResourcesChanged } from "./marketplaceState";

export interface VitaSkin {
  name: string;
  pages: string[]; // data URLs, one per home page
  icons: Record<string, string>; // e.g. psstore, friend, settings, browser, photo, near, contentManager
  barColor?: string;
  lock?: string | null; // lock (start) screen image
  lockDateColor?: string | null;
  lockDateLayout?: number;
  indicatorColor?: string | null;
  fontColors?: (string | null)[]; // bubble label colour per page
  musicPack?: string; // decoded theme music (pack folder)
  musicNeedsDecoder?: boolean; // the theme has music, but the decoder isn't downloaded yet
  musicNeedsCompress?: boolean; // music is still the large decoded WAV
}
/** Optional XMB parts a theme can supply; each only appears when the theme has it. */
export type XmbVisual = "focus" | "shadow" | "defaultThumb" | "loading" | "broken" | "unknown" | "folder" | "parental"
  | "focusLine" | "optionMenu" | "menuFocus" | "photoAlbum" | "photoShots" | "musicAlbum" | "musicTrack"
  | "infobar" | "busy" | "dlBase" | "dlBar" | "progressBase" | "progressBar" // info bar, busy icon, download / progress bars
  | "notice"; // PS3 .p3t: the picture behind the notification's icon
export interface P3tSkin {
  name: string;
  backgrounds: string[]; // data URLs (first = main background)
  icons: Record<string, string>; // icon_user, icon_setting, icon_game …
  staticSlides?: boolean; // PS3: the slides are a static picture slideshow (no 3D scene): no pan and zoom unless asked
  slides?: string[]; // PS3 slideshow / animated themes: cached images, decoded in the background
  rafScene?: string; // PS3 dynamic theme: cached scene URL ("" while it is first being built)
  visuals?: Partial<Record<XmbVisual, string>>;
  preview?: string | null;
  soundPack?: string; // extracted sound pack folder, "" when the theme has no sounds
  text?: { clock?: ThemeText; label?: ThemeText; info?: ThemeText }; // PSP .ctf: text colours from the firmware layout files (info = the notification bar)
  scene?: PspSceneData | null; // PSP .ctf: animated background layout + 3D wave model
  font?: { name: string; ttf: string } | null; // PSP .ctf: the theme's font (.pgf), converted to TrueType
  catText?: { w: number; h: number; frame: string; x: number; gap: number } | null; // PSP: categories are plain words along the bottom, this frame (native px) behind the selected one
  // PSP: the category pictures are one wide bar (native pixels), one highlighted per category. tilt/dx/dy: a turned bar;
  // ix/iy: where the item list hangs (layout units, centre origin, y up); marks: per icon, a row's ▼ pointer place (x from the picture's centre, y of the icon's top) and colour
  catBar?: { w: number; h: number; row?: boolean; tilt?: number; dx?: number; dy?: number; ix?: number; iy?: number; marks?: Record<string, { x: number; y: number; c: string }> } | null;
  status?: { battery: string; frames: number; banner?: BatteryBanner } | null; // PSP .ctf: battery picture (frames stacked, full → empty); banner: Persona 3's sliding "BATTERY CHARGE" words
  intro?: PspSceneData | null; // PSP .ctf: boot intro (opening_plugin.rco)
  gameboot?: string | null; // PSP .ctf: the clip played when a game starts (GAMEBOOT.PMF as MP4)
  bootSound?: { coldboot?: string; gameboot?: string }; // PSP: boot / game-start sounds (from the theme, or files beside it)
  bootSoundNeedsDecoder?: boolean; // a .at3 sound is there, but the music decoder isn't downloaded
  author?: string; // PS3 .p3t: the theme's author
  look?: { color?: number; font?: number };
  stock?: boolean; // PSP: converted from the console's own firmware (its background takes the month colour) // PS3 .p3t: the XMB colour and font style the theme sets
}
/** A battery readout made of pictures sliding along a turned line (psp: console_themes.battery_banner). Places are layout
 *  units (centre origin, y up); each picture starts at x/y, slides by dx/dy over dur ms after delay ms and starts over. */
export interface BatteryBanner {
  items: { img: string; x: number; y: number; w: number; h: number; rot: number; dx: number; dy: number; dur: number; delay: number; show: "always" | "idle" | "charging"; frames?: number }[];
  bg?: { img: string; x: number; y: number; w: number; h: number; rot: number; color: string };
}
export interface ThemeText {
  alpha?: number; // how see-through the text is (the layout object's own opacity)
  color: string;
  color2: string;
  shadow: string;
  shadowX: number;
  shadowY: number;
  x?: number; // position on the PSP's 480 × 272 screen (centre origin, y up)
  y?: number;
  size?: number;
  scale?: number; // the layout object's own scale (default 1): the console draws the text at size × scale
}

const getVita = callable<[name: string], VitaSkin | null>("get_vita_skin");
const getP3t = callable<[name: string], P3tSkin | null>("get_p3t");
const getPsp = callable<[name: string], P3tSkin | null>("get_psp_skin");
export const listSkins = callable<[], { p3t: string[]; vita: string[]; psp?: string[]; x360?: string[]; x360pics?: string[]; x360names?: Record<string, string>; xbox?: string[]; wii?: string[]; n3ds?: string[]; dir: string }>("list_skins");

/** Xbox 360 theme or gamer picture package (STFS) from skins/x360/. */
export interface X360Skin {
  kind: "theme" | "gamerpic";
  name: string;
  description?: string;
  publisher?: string;
  background?: string | null; // main wallpaper (data URL)
  backgrounds: string[]; // the wallpapers: Wallpaper1..4 in file order (real themes), else the large widescreen pictures
  sections?: { home?: string; games?: string; media?: string; system?: string }; // Wallpaper1..4 = Home, Game Library, Media Library, System Settings
  dashStyle?: number | null; // DashStyle file: 1 = made for the Blades dashboard, 2 = NXE only, 0 = any
  premium?: boolean; // layered (animated on the console) theme: Background/Midground/Foreground layer pictures
  gamerpics?: string[]; // gamer picture packs: every picture of the pack (64 px copies)
  preview?: string | null; // the package's own thumbnail
  gamerpic?: string | null; // gamer picture packages: the 64×64 picture
  accent?: string | null; // average colour of the wallpaper (worked out here, not in the file)
}
const getX360 = callable<[name: string], X360Skin | null>("get_x360_skin");
const x360Cache = new Map<string, X360Skin | null>();
onResourcesChanged(() => x360Cache.clear());
/** Average colour of the more saturated pixels of a picture, as #rrggbb (null if it can't be read). */
function pictureAccent(url: string): Promise<string | null> {
  return new Promise((res) => {
    try {
      const im = new Image();
      im.onload = () => {
        try {
          const c = document.createElement("canvas");
          c.width = c.height = 24;
          const g = c.getContext("2d");
          if (!g) return res(null);
          g.drawImage(im, 0, 0, 24, 24);
          const d = g.getImageData(0, 0, 24, 24).data;
          let r = 0, gg = 0, b = 0, n = 0;
          for (let i = 0; i < d.length; i += 4) {
            const mx = Math.max(d[i], d[i + 1], d[i + 2]), mn = Math.min(d[i], d[i + 1], d[i + 2]);
            if (mx - mn < 40 || mx < 60) continue;
            r += d[i]; gg += d[i + 1]; b += d[i + 2]; n++;
          }
          res(n ? "#" + [r, gg, b].map((v) => Math.round(v / n).toString(16).padStart(2, "0")).join("") : null);
        } catch { res(null); }
      };
      im.onerror = () => res(null);
      im.src = url;
    } catch { res(null); }
  });
}
async function loadX360(name: string): Promise<X360Skin | null> {
  const r = (await getX360(name).catch(() => null)) ?? null;
  if (r && r.kind === "theme" && r.background) r.accent = await pictureAccent(r.background);
  return r;
}
/** A one-off fetch of an Xbox 360 package ("" = none). */
export async function loadX360Skin(name: string): Promise<X360Skin | null> {
  if (!name) return null;
  if (x360Cache.has(name)) return x360Cache.get(name)!;
  const r = await loadX360(name);
  x360Cache.set(name, r);
  return r;
}
/** The Xbox 360 theme package chosen in Theme options (null while loading / none). */
export function useX360Skin(): X360Skin | null {
  const s = useSettings();
  return useSkin(s.x360.skin ?? "", x360Cache, loadX360);
}
/** What the active Xbox 360 theme file gives the dashboards, after the per-file switches
 *  (ThemeFx key `x360:<file>`: "Theme wallpaper" = background, "Theme colour" = labels).
 *  `vars` is a style object for a `display: contents` wrapper (sets --dht-x360-skin-accent). */
export type X360Section = "home" | "games" | "media" | "system";
/** Which of a theme's four wallpapers each dashboard channel / pivot shows. */
export const X360_SECTION: Record<string, X360Section> = { spotlight: "home", home: "home", social: "home", friends: "home", market: "home", myxbox: "home", games: "games", video: "media", apps: "media", settings: "system" };
export function useX360Look(): { bg?: string; accent?: string; vars: Record<string, string>; bgFor: (section: X360Section) => string | undefined } {
  const s = useSettings();
  const sk = useX360Skin();
  const fx = themeFx(s, `x360:${s.x360.skin ?? ""}`);
  const bg = sk && fx.background ? sk.background ?? undefined : undefined;
  const accent = sk && fx.labels ? sk.accent ?? undefined : undefined;
  /** The theme's own wallpaper for a part of the dashboard (the main one when it has no such section). */
  const bgFor = (section: X360Section) => (bg ? sk?.sections?.[section] ?? bg : undefined);
  return { bg, accent, vars: accent ? { "--dht-x360-skin-accent": accent } : {}, bgFor };
}
/** The chosen gamer picture (a data URL) or undefined. */
export function useX360Gamerpic(): string | undefined {
  const s = useSettings();
  return useSkin(s.x360.gamerpic ?? "", x360Cache, loadX360)?.gamerpic ?? undefined;
}

/** Original Xbox skin (UnleashX or XBMC folder / .zip) from skins/xbox/. */
export interface XboxSkin {
  kind: "unleashx" | "xbmc";
  name: string;
  author?: string;
  version?: string;
  description?: string;
  background?: string | null; // main wallpaper (data URL)
  bgColor?: string | null; // a plain colour when the skin draws a solid screen
  backgrounds: string[];
  images: Record<string, string>;
  colors: { text?: string; highlight?: string; accent?: string };
  font?: string;
  video?: string; // name of a background video the skin has (not played)
  preview?: string | null;
  errors: string[];
}
const getXbox = callable<[name: string], XboxSkin | null>("get_xbox_skin");
const xboxCache = new Map<string, XboxSkin | null>();
onResourcesChanged(() => xboxCache.clear());
const loadXbox = async (name: string): Promise<XboxSkin | null> => (await getXbox(name).catch(() => null)) ?? null;
/** The original Xbox skin chosen in Theme options (null while loading / none). */
export function useXboxSkin(): XboxSkin | null {
  const s = useSettings();
  const name = s.xboxSkin ?? "";
  const sk = useSkin(name, xboxCache, loadXbox);
  return sk && sk.name !== undefined ? sk : null;
}
/** What the active skin gives the Xbox dashboard after the per-file switches (ThemeFx key `xbox:<file>`:
 *  "Theme wallpaper" = background, "Theme colour" = text and highlight). `css` sets --dht-xbox-skin-* on the home root. */
export function useXboxLook(): { bg?: string; bgColor?: string; css: string } {
  const s = useSettings();
  const sk = useXboxSkin();
  const fx = themeFx(s, `xbox:${s.xboxSkin ?? ""}`);
  if (!sk) return { css: "" };
  const bg = fx.background ? sk.background ?? undefined : undefined;
  const bgColor = fx.background && !bg ? sk.bgColor ?? undefined : undefined;
  const c = fx.labels ? sk.colors : {};
  const vars = [c.text && `--dht-xbox-skin-text:${c.text}`, c.highlight && `--dht-xbox-skin-highlight:${c.highlight}`].filter(Boolean).join(";");
  return { bg, bgColor, css: vars ? `.dht-root{${vars}}` : "" };
}

/** Wii System Menu theme (.mym / .csm) from skins/wii/: the menu wallpaper and the pointer hands. */
export interface WiiSkin {
  kind: "mym" | "csm";
  name: string;
  id: string;
  wallpaper: string | null; // image data URL
  wallpaperSize: [number, number] | null;
  wallpaperFit: "cover" | "stretch";
  stockWallpaper: boolean; // the file only carries the unmodified menu gradient
  cursors: { a?: string; b?: string; c?: string }; // open hand, pressed, grabbing (data URLs)
  cursorSize: number;
  errors: string[];
}
const getWii = callable<[name: string], WiiSkin | null>("get_wii_skin");
const wiiCache = new Map<string, WiiSkin | null>();
onResourcesChanged(() => wiiCache.clear());
const loadWii = async (name: string): Promise<WiiSkin | null> => (await getWii(name).catch(() => null)) ?? null;
/** The Wii theme chosen in Theme options (null while loading / none). */
export function useWiiSkin(): WiiSkin | null {
  const s = useSettings();
  const sk = useSkin(s.wiiSkin ?? "", wiiCache, loadWii);
  return sk && sk.name !== undefined ? sk : null;
}
/** What the Wii theme gives the Wii menu after the per-file switches (ThemeFx key `wii:<file>`: "Theme wallpaper" =
 *  background, "Theme pointer hand" = icons). The home sets --dht-wii-skin-wallpaper from `wallpaper`. */
export function useWiiLook(): { wallpaper?: string; fit: "cover" | "stretch"; cursor?: string; cursors: { a?: string; b?: string; c?: string } } {
  const s = useSettings();
  const sk = useWiiSkin();
  const fx = themeFx(s, `wii:${s.wiiSkin ?? ""}`);
  if (!sk) return { fit: "cover", cursors: {} };
  const cursors = fx.icons ? sk.cursors : {};
  return { wallpaper: fx.background ? sk.wallpaper ?? undefined : undefined, fit: sk.wallpaperFit, cursor: cursors.a, cursors };
}

/** Nintendo 3DS HOME Menu theme (body_LZ.bin, alone or in a .zip / folder) from skins/3ds/. */
export interface N3dsScreen {
  mode: "none" | "solid" | "pattern" | "texture";
  image?: string | null; // 400 × 240 (top) / 320 × 240 (bottom) PNG data URL
  wide?: string | null; // 1024 × 240 picture of a scrolling wallpaper
  scroll?: boolean;
  frame?: string;
  color?: string | null;
}
export type N3dsColors = Record<string, string> | null;
export interface N3dsSkin {
  kind: "3ds";
  name: string;
  author?: string;
  description?: string;
  preview?: string | null;
  icon?: string | null;
  top: N3dsScreen;
  bottom: N3dsScreen;
  cursor?: N3dsColors; // dark, main, light, glow
  folder?: N3dsColors; // dark, main, light, shadow
  file?: N3dsColors;
  text?: N3dsColors; // main, alt
  bottom_inner?: string[] | null;
  bottom_outer?: string[] | null;
  folder_art?: { closed?: string | null; open?: string | null } | null; // 74 × 64 / 82 × 64
  file_art?: { large?: string | null; small?: string | null } | null; // 36 × 72 / 25 × 49
  preferred_row?: number;
  bgm?: boolean;
  bgm_only?: boolean;
  errors: string[];
}
const getN3ds = callable<[name: string], N3dsSkin | null>("get_3ds_skin");
const n3dsCache = new Map<string, N3dsSkin | null>();
onResourcesChanged(() => n3dsCache.clear());
const loadN3ds = async (name: string): Promise<N3dsSkin | null> => (await getN3ds(name).catch(() => null)) ?? null;
/** The 3DS theme file chosen in Theme options (null while loading / none). */
export function useN3dsSkin(): N3dsSkin | null {
  const s = useSettings();
  const sk = useSkin(s.n3dsSkin ?? "", n3dsCache, loadN3ds);
  return sk && sk.name !== undefined ? sk : null;
}
export interface N3dsLook {
  skin: N3dsSkin | null;
  top: N3dsScreen | null; // null = the built-in stock look
  bottom: N3dsScreen | null;
  scroll: boolean;
  cursor: N3dsColors;
  folder: N3dsColors;
  file: N3dsColors;
  text: N3dsColors;
  folderArt: { closed?: string | null; open?: string | null } | null;
  fileArt: { large?: string | null; small?: string | null } | null;
}
/** What the active 3DS theme file gives the HOME look after the per-file switches (ThemeFx key `n3ds:<file>`:
 *  background = wallpapers, scroll = scrolling wallpapers move, labels = cursor / folder / text colours,
 *  icons = folder and file pictures). A part the file lacks (or has switched off) stays the built-in stock look. */
export function useN3dsLook(): N3dsLook {
  const s = useSettings();
  const sk = useN3dsSkin();
  const fx = themeFx(s, `n3ds:${s.n3dsSkin ?? ""}`);
  const on = sk && !sk.bgm_only;
  const screen = (x: N3dsScreen | undefined) => (on && fx.background && x && (x.mode === "texture" ? !!x.image : x.mode === "solid" && !!x.color) ? x : null);
  const c = on && fx.labels;
  return {
    skin: sk,
    top: screen(sk?.top),
    bottom: screen(sk?.bottom),
    scroll: fx.scroll !== false,
    cursor: c ? sk?.cursor ?? null : null,
    folder: c ? sk?.folder ?? null : null,
    file: c ? sk?.file ?? null : null,
    text: c ? sk?.text ?? null : null,
    folderArt: on && fx.icons ? sk?.folder_art ?? null : null,
    fileArt: on && fx.icons ? sk?.file_art ?? null : null,
  };
}

type Override = { vita?: (n: string) => VitaSkin | null; p3t?: (n: string) => P3tSkin | null; psp?: (n: string) => P3tSkin | null };
let override: Override = {};
export function setSkinOverride(o: Override) {
  override = o;
}

const vitaCache = new Map<string, VitaSkin | null>();
const p3tCache = new Map<string, P3tSkin | null>();
const pspCache = new Map<string, P3tSkin | null>();
onResourcesChanged(() => { vitaCache.clear(); p3tCache.clear(); pspCache.clear(); });

function useSkin<T>(name: string, cache: Map<string, T | null>, load: (n: string) => Promise<T | null>, ov?: (n: string) => T | null): T | null {
  // the loaded skin is remembered with the name it belongs to: after a name change the previous skin is never returned
  const [st, setSt] = useState<{ n: string; v: T | null }>({ n: name, v: name ? cache.get(name) ?? null : null });
  useEffect(() => {
    if (!name) return setSt({ n: name, v: null });
    if (ov) return setSt({ n: name, v: ov(name) });
    if (cache.has(name)) return setSt({ n: name, v: cache.get(name)! });
    let alive = true;
    load(name)
      .then((r) => {
        cache.set(name, r ?? null);
        if (alive) setSt({ n: name, v: r ?? null });
      })
      .catch(() => alive && setSt({ n: name, v: null }));
    return () => {
      alive = false;
    };
  }, [name]);
  if (!name) return null;
  if (st.n === name) return st.v;
  return ov ? ov(name) : cache.get(name) ?? null;
}

export function useVitaSkin(): VitaSkin | null {
  const s = useSettings();
  const skin = useSkin(s.vita.skin, vitaCache, getVita, override.vita);
  useSkinPack("vita", skin?.musicPack ? { soundPack: skin.musicPack } as any : null, "music");
  useEffect(() => {
    if (skin?.musicPack && skin.musicNeedsCompress) compressListener?.(skin.musicPack);
  }, [skin?.musicPack, skin?.musicNeedsCompress]);
  return skin;
}
/** One-off fetch of the active Vita theme (Quick Access needs it outside the home). */
export async function loadVitaSkin(name: string): Promise<VitaSkin | null> {
  if (!name) return null;
  if (override.vita) return override.vita(name);
  if (vitaCache.has(name)) return vitaCache.get(name)!;
  const r = (await getVita(name)) ?? null;
  vitaCache.set(name, r);
  return r;
}
export const musicDecoderStatus = callable<[], { installed: boolean; version: string }>("music_decoder_status");
export const installMusicDecoder = callable<[], { installed: boolean; version?: string; error?: string }>("install_music_decoder");
export function useP3t(): P3tSkin | null {
  const s = useSettings();
  const skin = useSkin(s.xmb.p3t, p3tCache, getP3t, override.p3t);
  // "Theme sounds" off (per theme file): the file's sound pack is not offered to Automatic
  const sounds = themeFx(s, s.xmb.p3t ? `p3t:${s.xmb.p3t}` : "ps3:").sounds;
  useSkinPack("ps3", sounds ? skin : null);
  return skin;
}
export function usePsp(): P3tSkin | null {
  const s = useSettings();
  const skin = useSkin(pspFile(s), pspCache, getPsp, override.psp);
  useSkinPack("psp", skin);
  return skin;
}

// Sound packs extracted from the active PS3 / PSP theme file.
const skinPacks: Record<string, string> = {};
let packListener: (() => void) | null = null;
export const onSkinPack = (cb: () => void) => { packListener = cb; };
let compressListener: ((folder: string) => void) | null = null;
/** steam.ts compresses decoded theme music (WAV → Ogg Opus) when the UI supports it. */
export const onMusicCompress = (cb: (folder: string) => void) => { compressListener = cb; };
export const skinSoundPack = (theme: string, kind: "sfx" | "music" = "sfx"): string => skinPacks[kind === "sfx" ? theme : `${theme}:music`] ?? "";
function useSkinPack(theme: "ps3" | "psp" | "vita", skin: { soundPack?: string } | null, kind: "sfx" | "music" = "sfx") {
  const key = kind === "sfx" ? theme : `${theme}:music`;
  const folder = skin?.soundPack ?? "";
  useEffect(() => {
    if ((skinPacks[key] ?? "") === folder) return;
    skinPacks[key] = folder;
    packListener?.();
  }, [key, folder]);
}
export const currentP3t = () => getSettings().xmb.p3t;
/** PS3 dynamic theme: the scene URL once the background build is done (asks again every few
 *  seconds while it runs; a build happens once per theme file). */
export function useRafScene(name: string, initial: string | undefined): string {
  const [url, setUrl] = useState(initial ?? "");
  useEffect(() => {
    setUrl(initial ?? "");
    if (initial !== "" || !name) return;
    let dead = false;
    const t = setInterval(async () => {
      const r = await getP3t(name).catch(() => null);
      if (dead || !r?.rafScene) return;
      clearInterval(t);
      const c = p3tCache.get(name);
      if (c) c.rafScene = r.rafScene;
      setUrl(r.rafScene);
    }, 4000);
    return () => { dead = true; clearInterval(t); };
  }, [name, initial]);
  return url;
}
/** One-off fetch of a PSP theme file (its boot intro / game-start clip can be used while another theme is active). */
export async function loadPspSkin(name: string): Promise<P3tSkin | null> {
  if (!name) return null;
  if (override.psp) return override.psp(name);
  if (pspCache.has(name)) return pspCache.get(name)!;
  const r = (await getPsp(name)) ?? null;
  pspCache.set(name, r);
  return r;
}
export const cachedP3tSkin = (name: string) => p3tCache.get(name);
export const cachedPspSkin = (name: string) => pspCache.get(name);

/** One-off read of any console theme file (presets v2: a preset's slots can take a wallpaper or icons from a theme file
 *  of another console, see src/engine/assets.ts). Cached with the hooks above; null when it can't be read. */
export async function loadSkinFile(kind: "p3t" | "psp" | "vita" | "x360" | "xbox" | "wii" | "n3ds", name: string): Promise<any> {
  if (!name) return null;
  const pick: Record<string, [Map<string, any>, (n: string) => Promise<any>, ((n: string) => any) | undefined]> = {
    p3t: [p3tCache, getP3t, override.p3t], psp: [pspCache, getPsp, override.psp], vita: [vitaCache, getVita, override.vita],
    x360: [x360Cache, loadX360, undefined], xbox: [xboxCache, loadXbox, undefined], wii: [wiiCache, loadWii, undefined], n3ds: [n3dsCache, loadN3ds, undefined],
  };
  const [cache, load, ov] = pick[kind] ?? [];
  if (!cache) return null;
  if (ov) return ov(name);
  if (cache.has(name)) return cache.get(name);
  const r = (await load(name).catch(() => null)) ?? null;
  cache.set(name, r);
  return r;
}
