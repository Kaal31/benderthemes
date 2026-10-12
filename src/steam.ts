import { useFocusedGame } from "./focus";
import { tintOf } from "./color";
import { loadDialAsset } from "./themes/dialAssets";
import { onResourcesChanged } from "./marketplaceState";
// Small bridges to Steam's own UI: sounds, the native game menu, the top
// bar, battery and user info. None of this is public API, so all of it is
// defensive and every DOM change is undone on teardown.
import { findClassModule, Navigation, showContextMenu } from "@decky/ui";
import { callable } from "@decky/api";
import { createElement, useEffect, useRef, useState } from "react";
import { getUiDocument } from "./cssvars";
import { getSettings, ThemeId } from "./settings";
import { onMusicCompress, onSkinPack, skinSoundPack } from "./skins";
import { encodeOggOpus, opusSupported, parseWav, toBase64 } from "./oggOpus";
import { holdOtherMusic } from "./otherPlugins";

declare const SteamClient: any;

// ───────────── backend calls ─────────────
export interface SoundPack {
  name: string;
  folder: string; // relative to ~/homebrew/sounds
  files: string[];
  mappings: Record<string, string[]>;
  ignore: string[];
  music: boolean;
  author: string;
  /** Packs that belong to a data theme are served from the theme's folder. */
  base?: string;
}

// The theme engine (src/engine) decides what the active theme puts in its slots.
// It registers here instead of being imported, so this file stays free of engine imports.
interface EngineHooks {
  /** undefined = the engine has no say, null = the slot is deliberately empty. */
  pack(theme: ThemeId, kind: "sfx" | "music"): SoundPack | null | undefined;
  /** The background of the look on screen as an asset reference (src/engine/assets.ts): undefined = the engine has
   *  no say (a wallpapers-folder picture or the look's own), "" = deliberately none. `folder`: the folder picture set. */
  background(theme: ThemeId, folder: string | undefined): string | undefined;
  /** Reads a reference that is not a wallpapers-folder file. */
  resolve(ref: string): Promise<string | null>;
}
let engine: EngineHooks | null = null;
export function setEngineHooks(h: EngineHooks | null) {
  engine = h;
}
const backendPacks = callable<[], SoundPack[]>("list_sound_packs");
const backendWallpapers = callable<[], { dir: string; files: string[] }>("list_wallpapers");
const backendWallpaper = callable<[name: string], string | null>("get_wallpaper");

let packs: SoundPack[] = [];
let packsLoaded = false;
export async function refreshPacks(): Promise<SoundPack[]> {
  try {
    packs = (await backendPacks()) ?? [];
  } catch {
    packs = [];
  }
  packsLoaded = true;
  return packs;
}
export const getPacks = () => packs;
export const packsReady = () => packsLoaded;

export async function listWallpapers() {
  try {
    return (await backendWallpapers()) ?? { dir: "", files: [] };
  } catch {
    return { dir: "", files: [] };
  }
}

const wallCache = new Map<string, string | null>();
onResourcesChanged(() => { wallCache.clear(); void refreshPacks(); });
let wallpaperOverride: ((name: string) => string | null) | null = null;
export function setWallpaperOverride(f: typeof wallpaperOverride) {
  wallpaperOverride = f;
}
/** Data URL of a wallpapers-folder picture (cached), or null. */
export async function loadWallpaper(name: string): Promise<string | null> {
  if (!name) return null;
  if (wallpaperOverride) return wallpaperOverride(name);
  const key = `@wp/${name}`;
  if (wallCache.has(key)) return wallCache.get(key)!;
  const u = (await backendWallpaper(name).catch(() => null)) ?? null;
  wallCache.set(key, u);
  return u;
}
/** Picture a theme uses when none is chosen (if that file is in the wallpapers folder). */
export const DEFAULT_WALLPAPER: Partial<Record<ThemeId, string>> = { aero: "aero-background.jpg", aero2: "aero-background.jpg" };
/** The one background of the look on screen (presets v2: the preset's Background choice, from any installed source;
 *  else a wallpapers-folder picture chosen before v2; else the theme's own or the look's default picture), with game
 *  art, brightness and colour applied. null = the look draws its own background. */
export function useWallpaper(theme: ThemeId): string | null {
  const chosen = getSettings().wallpapers[theme];
  const fromEngine = engine?.background(theme, chosen);
  const ref = fromEngine !== undefined ? fromEngine : chosen ? `@wp/${chosen}` : DEFAULT_WALLPAPER[theme] ? `@wp/${DEFAULT_WALLPAPER[theme]}` : "";
  const [state, setState] = useState<{ ref: string; url: string | null }>({ ref, url: ref ? wallCache.get(ref) ?? null : null });
  useEffect(() => {
    if (!ref) return setState({ ref, url: null });
    if (wallCache.has(ref)) return setState({ ref, url: wallCache.get(ref)! });
    let alive = true;
    (ref.startsWith("@wp/") ? loadWallpaper(ref.slice(4)) : engine ? engine.resolve(ref) : Promise.resolve(null))
      .then((u) => {
        wallCache.set(ref, u ?? null);
        if (alive) setState({ ref, url: u ?? null });
      })
      .catch(() => alive && setState({ ref, url: null }));
    return () => {
      alive = false;
    };
  }, [ref]);
  const raw = state.ref === ref ? state.url : null;
  // Standard options → Game art behind the menu: the focused game's art takes the wallpaper's place
  const focused = useFocusedGame();
  const art = getSettings().gameArt && theme !== "ps4" && theme !== "ps5" ? focused?.art.hero[0] ?? focused?.art.landscape[0] : undefined;
  return useDimmed(art ?? raw, getSettings().bgBrightness, tintOf(getSettings()));
}

/** Recolours what's drawn to the colour's hue, keeping its light and shade (the PSP tints its background the same way). */
export function tintCanvas(g: CanvasRenderingContext2D, w: number, h: number, tint: string, strength = 0.75) {
  g.save();
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = "color";
  g.globalAlpha = strength;
  g.fillStyle = tint;
  g.fillRect(0, 0, w, h);
  g.restore();
}

// Standard options → Background brightness: the picture itself is darkened, so every
// theme that draws a wallpaper honours it without code of its own.
const dimCache = new Map<string, string>();
function useDimmed(src: string | null, pct: number, tint?: string): string | null {
  const key = src && (pct < 100 || tint) ? `${pct}|${tint ?? ""}|${src}` : "";
  const [out, setOut] = useState<string | null>(key ? dimCache.get(key) ?? null : src);
  useEffect(() => {
    if (!key || !src) return setOut(src);
    const hit = dimCache.get(key);
    if (hit) return setOut(hit);
    let alive = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth;
        c.height = img.naturalHeight;
        const g = c.getContext("2d")!;
        g.drawImage(img, 0, 0);
        if (tint) tintCanvas(g, c.width, c.height, tint);
        g.fillStyle = `rgba(0,0,0,${(100 - pct) / 100})`;
        g.fillRect(0, 0, c.width, c.height);
        const url = c.toDataURL("image/jpeg", 0.9);
        if (dimCache.size > 12) dimCache.delete(dimCache.keys().next().value!);
        dimCache.set(key, url);
        if (alive) setOut(url);
      } catch {
        if (alive) setOut(src); // a picture the browser won't let us read: shown as it is
      }
    };
    img.onerror = () => alive && setOut(src);
    img.src = src;
    return () => {
      alive = false;
    };
  }, [key, src]);
  return key ? out ?? src : src;
}
// ───────────── sounds ─────────────
// Each theme uses an AudioLoader pack: the one picked in Quick Access, or
// automatically the installed pack whose name matches the console (e.g.
// "PSP Sounds" for PSP). Pack files are streamed by the plugin's own local
// server and played with Web Audio; anything a pack lacks (or any failure)
// falls back to Steam's own UI sounds, so a theme is never silent.
export const SOUND_FILES = {
  move: "deck_ui_navigation.wav",
  tile: "deck_ui_tile_scroll.wav",
  select: "deck_ui_default_activation.wav",
  open: "deck_ui_into_game_detail.wav",
  back: "deck_ui_out_of_game_detail.wav",
  launch: "deck_ui_launch_game.wav",
  tab: "deck_ui_tab_transition_01.wav",
  end: "deck_ui_bumper_end_02.wav",
  menu: "deck_ui_show_modal.wav",
  close: "deck_ui_hide_modal.wav",
  toggle: "deck_ui_switch_toggle_on.wav",
  // Steam's own notification cues; a pack can map several files to each (the iiSU pack does). Played only from a pack: Steam
  // plays its own sound when the pack has none, so there is no fallback (see playNoticeSound).
  friendOnline: "ui_steam_smoother_friend_online.m4a",
  friendJoin: "ui_steam_smoother_friend_join.m4a",
  message: "ui_steam_message_old_smooth.m4a",
  // the PSP's own confirm / cancel sounds of the Game, Music and Photo areas (from a theme's sound pack);
  // without them the usual select / back sounds play
  gameSelect: "dht_game_decide.wav",
  gameBack: "dht_game_cancel.wav",
  musicSelect: "dht_music_decide.wav",
  musicBack: "dht_music_cancel.wav",
  photoSelect: "dht_photo_decide.wav",
  photoBack: "dht_photo_cancel.wav",
} as const;
export type SoundKind = keyof typeof SOUND_FILES;
let previewSound: ((k: SoundKind, variation?: number) => void) | null = null;
export function setPreviewSound(f: typeof previewSound) {
  previewSound = f;
}

/**
 * Packs to look for, per theme (first matching group wins) and the store name
 * to suggest. Xbox 360 presets have their own entries ("x360:blades" …).
 */
export const PACK_MATCH: Record<string, { re: RegExp[]; suggest: string }> = {
  wii: {re:[/^wii(?![ _-]*u)/i],suggest:"Wii Menu Sounds"},
  wiiu: {re:[/wii[ _-]*u/i],suggest:"Wii U Menu Sounds"},
  switch: {re:[/(^|[^a-z0-9])switch([^a-z0-9]|$)/i],suggest:"Switch Menu Sounds"},
  minecraft: { re: [/Minecraft Console Legacy/i], suggest: "Minecraft Console Legacy" },
  republic: { re: [/DHT Verified Republic/i], suggest: "DHT Verified Republic" },
  pain: { re: [/DHT Six Paths Music/i], suggest: "DHT Six Paths Music" },
  nazarick: { re: [/DHT Nazarick Music/i], suggest: "DHT Nazarick Music" },
  castle: { re: [/DHT Floating Castle Music/i,/DHT Verified SAO/i,/Sword Art Online/i], suggest: "DHT Verified SAO" },
  vita: { re: [/vita/i], suggest: "PsVita SFX" },
  psp: { re: [/(^|[^a-z0-9])psp([^a-z0-9]|$)/i], suggest: "PSP Sounds" },
  ps3: { re: [/(^|[^a-z0-9])ps3([^0-9]|$)/i, /playstation\s*3/i, /(^|[^a-z])xmb([^a-z]|$)/i], suggest: "XMB" },
  ps2: { re: [/(^|[^a-z0-9])ps2([^0-9]|$)/i, /playstation\s*2/i], suggest: "PS2 System Sounds" },
  ps4: { re: [/(^|[^a-z0-9])ps4([^0-9]|$)/i, /playstation\s*4/i], suggest: "PS4" },
  ps5: { re: [/(^|[^a-z0-9])ps5(?!\s*_?\s*plus)/i, /playstation\s*5/i, /ps5/i], suggest: "PS5_Sounds" },
  xbox: { re: [/original\s*xbox|og\s*xbox|xbox\s*classic/i, /theseus/i], suggest: "Original Xbox Sound Pack" },
  x360: { re: [/360.*metro|metro.*360/i, /360/i], suggest: "Xbox 360 Metro UI Sounds" },
  "x360:metro": { re: [/360.*metro|metro.*360/i, /xbox\s*360\s*ui/i], suggest: "Xbox 360 Metro UI Sounds" },
  "x360:kinect": { re: [/kinect/i], suggest: "Xbox 360 NXE Dash UI" },
  "x360:nxe": { re: [/nxe/i], suggest: "Xbox 360 NXE Dash UI" },
  "x360:blades": { re: [/DHT Verified MC360 Blades 1\.7\.2/i, /blade/i], suggest: "Xbox 360 Blades" },
  aero: { re: [/windows\s*xp/i, /windows\s*7|win\s*7/i, /vista|aero|frutiger|media\s*center/i], suggest: "windows xp sounds" },
  iisu: { re: [/iisu/i], suggest: "iisu SFX (comes with the plugin)" },
  dial: { re: [/alien\s*dial/i], suggest: "DHT Alien Dial (comes with the plugin)" },
};
export type PackKind = "sfx" | "music";
/** Which PACK_MATCH entry applies (Xbox 360 depends on the chosen dashboard). */
export function matchKey(theme: ThemeId): string {
  if (theme === "x360") return `x360:${getSettings().x360?.style ?? "metro"}`;
  return theme === "aero2" ? "aero" : theme;
}
/** How many of the UI sounds this theme uses a pack replaces. */
export function sfxCoverage(p: SoundPack): number {
  return Object.values(SOUND_FILES).filter((f) => !f.startsWith("dht_") && !f.startsWith("ui_steam_") && packFile(p, f)).length;
}
export function autoPack(theme: ThemeId, kind: PackKind = "sfx"): SoundPack | null {
  for (const re of (PACK_MATCH[matchKey(theme)] ?? PACK_MATCH[theme])?.re ?? []) {
    const hits = packs.filter((p) => (re.test(p.name) || re.test(p.folder)) && !(theme==="wiiu" && kind==="music" && /download|friends|settings/i.test(p.name+" "+p.folder)));
    if (kind === "music") {
      const m = hits.find((p) => !!musicFile(p));
      if (m) return m;
    } else {
      const ranked = hits.map((p) => [p, sfxCoverage(p)] as const).filter(([, n]) => n > 0).sort((a, b) => Number(b[0].name.startsWith("DHT Verified"))-Number(a[0].name.startsWith("DHT Verified")) || b[1] - a[1]);
      if (ranked.length) return ranked[0][0];
    }
  }
  return null;
}
/** Effects: settings.packs, music: settings.musicPacks. "" = automatic, "steam"/"none" = off. */
export function packFor(theme: ThemeId, kind: PackKind = "sfx"): SoundPack | null {
  const s = getSettings();
  const set = (kind === "sfx" ? s.packs[theme] : s.musicPacks?.[theme]) ?? "";
  if (set === "steam" || set === "none") return null;
  if (set) return packs.find((p) => p.folder === set) ?? autoPack(theme, kind);
  const fromTheme = engine?.pack(theme, kind);
  if (fromTheme !== undefined) return fromTheme;
  const themed = skinSoundPack(theme, kind === "sfx" ? "sfx" : "music");
  const found = themed ? packs.find((p) => p.folder === themed) : undefined;
  if (found) return found;
  return autoPack(theme, kind);
}
// A theme file's extracted pack is written on first load: re-read the pack list then.
onSkinPack(() => { void refreshPacks(); });

// Decoded theme music is a large WAV: encode it once to Ogg Opus with the UI's own
// WebCodecs encoder and let the backend replace the WAV. Without support, the WAV stays.
const storeThemeMusic = callable<[folder: string, data: string], boolean>("store_theme_music");
const compressing = new Set<string>();
onMusicCompress((folder) => {
  if (compressing.has(folder)) return;
  compressing.add(folder);
  void (async () => {
    try {
      const base = previewSoundBase ?? (await mediaBase());
      if (!base) return;
      const r = await fetch(`${base}/s/${encodeURIComponent(folder)}/menu_music.wav`);
      if (!r.ok) return;
      const wav = parseWav(await r.arrayBuffer());
      if (!wav || !(await opusSupported(wav.rate, wav.channels.length))) return;
      const ogg = await encodeOggOpus(wav.channels, wav.rate);
      if (await storeThemeMusic(folder, toBase64(ogg))) await refreshPacks();
    } catch {
      /* keep the WAV */
    }
  })();
});
export function packFile(pack: SoundPack, file: string): string | null {
  const exact = (name:string) => {
    if(pack.ignore.includes(name))return null;
    const mapped=pack.mappings[name];
    if(Array.isArray(mapped))return mapped.find(f=>pack.files.includes(f))??null;
    return pack.files.includes(name)?name:null;
  };
  const found=exact(file);if(found)return found;
  const related:Record<string,string[]>={
    "deck_ui_tile_scroll.wav":["deck_ui_navigation.wav"],
    "deck_ui_tab_transition_01.wav":["deck_ui_navigation.wav"],
    "deck_ui_default_activation.wav":["deck_ui_into_game_detail.wav"],
    "deck_ui_hide_modal.wav":["deck_ui_out_of_game_detail.wav"],
    "deck_ui_show_modal.wav":["deck_ui_into_game_detail.wav"],
    "deck_ui_switch_toggle_on.wav":["deck_ui_default_activation.wav","deck_ui_into_game_detail.wav"],
    ...Object.fromEntries(Object.entries(AREA_BASE).map(([k, v]) => [k, [v, ...(v === "deck_ui_default_activation.wav" ? ["deck_ui_into_game_detail.wav"] : [])]])),
  };
  for(const alternate of related[file]??[]){const result=exact(alternate);if(result)return result;}
  return null;
}
export function musicFile(pack: SoundPack): string | null {
  const m = packFile(pack, "menu_music.mp3");
  if (m) return m;
  return pack.files.find((f) => /music/i.test(f) && /\.(mp3|ogg|wav|flac|m4a)$/i.test(f)) ?? null;
}

const backendServer = callable<[], { base: string } | null>("media_server");
let serverBase: string | null = null;
let serverAsk: Promise<string | null> | null = null;
function mediaBase(): Promise<string | null> {
  if (serverBase) return Promise.resolve(serverBase);
  if (!serverAsk)
    serverAsk = backendServer()
      .then((r) => (serverBase = r?.base ?? null))
      .catch(() => null)
      .finally(() => (serverAsk = null));
  return serverAsk;
}
let previewSoundBase: string | null = null;
export function setPreviewSoundBase(b: string) {
  previewSoundBase = b;
}
async function packUrl(pack: SoundPack, file: string): Promise<string | null> {
  if (pack.base) return `${pack.base}/${encodeURIComponent(file)}`;
  if((window as any).__testAssets && ["Wii U Download Management","Wii U Friends theme","Wii U Settings","Wii U SFX","DHT Verified Republic","Minecraft Console Legacy","windows xp sounds","DHT Nazarick Music","DHT Floating Castle Music","DHT Six Paths Music"].includes(pack.folder))return `../bundle/sounds/${encodeURIComponent(pack.folder)}/${encodeURIComponent(file)}`;
  const base = previewSoundBase ?? (await mediaBase());
  return base ? `${base}/s/${encodeURIComponent(pack.folder)}/${encodeURIComponent(file)}` : null;
}

export function uiWindow(): any {
  try {
    return getUiDocument()?.defaultView ?? window;
  } catch {
    return window;
  }
}
let ctx: AudioContext | null = null;
function audioCtx(): AudioContext | null {
  try {
    if (!ctx) {
      const W = uiWindow();
      const AC = W.AudioContext ?? W.webkitAudioContext ?? (globalThis as any).AudioContext;
      ctx = AC ? new AC() : null;
    }
    if (ctx?.state === "suspended") ctx.resume().catch(() => {});
    return ctx;
  } catch {
    return null;
  }
}
const buffers = new Map<string, Promise<AudioBuffer | null>>();
function loadBuffer(url: string): Promise<AudioBuffer | null> {
  let p = buffers.get(url);
  if (!p) {
    p = (async () => {
      const c = audioCtx();
      if (!c) return null;
      const r = await fetch(url);
      if (!r.ok) return null;
      const data = await r.arrayBuffer();
      // the promise form only: with callbacks Chromium still rejects the returned promise unhandled on bad data
      return await c.decodeAudioData(data).catch(() => null);
    })().catch(() => null);
    buffers.set(url, p);
  }
  return p;
}
function playBuffer(b: AudioBuffer, volume: number) {
  const c = audioCtx();
  if (!c || c.state !== "running") return false; // not allowed to play yet: let a fallback try
  const src = c.createBufferSource();
  const g = c.createGain();
  g.gain.value = volume;
  src.buffer = b;
  src.connect(g).connect(c.destination);
  src.start();
  return true;
}
/** Steam's own UI sound: its file played directly (reliable), else through Steam's audio store. */
/** Area sounds fall back to these when a pack (or Steam) has no own file for them. */
const AREA_BASE: Record<string, string> = {
  "dht_game_decide.wav": "deck_ui_default_activation.wav", "dht_music_decide.wav": "deck_ui_default_activation.wav", "dht_photo_decide.wav": "deck_ui_default_activation.wav",
  "dht_game_cancel.wav": "deck_ui_out_of_game_detail.wav", "dht_music_cancel.wav": "deck_ui_out_of_game_detail.wav", "dht_photo_cancel.wav": "deck_ui_out_of_game_detail.wav",
};
function steamSound(file: string) {
  file = AREA_BASE[file] ?? file;
  const vol = Math.max(0, Math.min(1, (getSettings().sfxVolume ?? 80) / 100));
  loadBuffer(`https://steamloopback.host/sounds/${file}`)
    .then((b) => {
      if (!b || !playBuffer(b, vol)) legacySound(file);
    })
    .catch(() => legacySound(file));
}
function legacySound(file: string) {
  const url = `/sounds/${file}`;
  try {
    const store = (globalThis as any).SteamUIStore?.m_GamepadUIAudioStore;
    if (store?.PlayAudioURL) {
      Promise.resolve(store.PlayAudioURL(url)).catch(() => {});
      return;
    }
  } catch {
    /* fall through */
  }
  try {
    const a = new (uiWindow().Audio ?? Audio)(`https://steamloopback.host${url}`);
    a.volume = 0.6;
    a.play().catch(() => {});
  } catch {
    /* no audio */
  }
}
/** Decode a theme's pack sounds ahead of time so the first click isn't late. */
export async function preloadSounds(theme: ThemeId) {
  if (theme === "dial" && getSettings().dial.sound === "reference") {
    await Promise.all(["wake.wav","switch.wav","launch.wav","back.wav"].map(async name => {const u=await loadDialAsset(name);if(u)await loadBuffer(u);}));
    return;
  }
  const pack = packFor(theme);
  if (!pack) return;
  for (const file of Object.values(SOUND_FILES)) {
    const mapped = pack.mappings[file];
    const files = Array.isArray(mapped) ? mapped.filter(f => pack.files.includes(f)) : [packFile(pack, file)].filter((f): f is string => !!f);
    for (const f of files) {
      const url = await packUrl(pack, f);
      if (url) loadBuffer(url);
    }
  }
}
/** For Diagnostics. */
export function soundDiag(theme: ThemeId): string {
  if (theme === "dial" && getSettings().dial.sound !== "pack") return `Alien Dial ${getSettings().dial.sound === "off" ? "muted" : "video cues"} · audio ${ctx?.state ?? "idle"}`;
  const pack = packFor(theme);
  const music = packFor(theme, "music");
  return `${pack ? pack.name : "Steam sounds"} · music ${music ? music.name : "none"} · audio ${ctx?.state ?? "idle"} · server ${serverBase ? "on" : "off"}`;
}
/** The notification cues (friend online / joined a game / message): a random one of the files the active pack maps, nothing
 *  when it has none (Steam's own sound is not touched). */
export const NOTICE_SOUNDS = ["friendOnline", "friendJoin", "message"] as const;
export type NoticeSound = (typeof NOTICE_SOUNDS)[number];
export function pickNoticeFile(pack: SoundPack | null, kind: NoticeSound, random: () => number = Math.random): string | null {
  if (!pack) return null;
  const name = SOUND_FILES[kind];
  if (pack.ignore.includes(name)) return null;
  const mapped = pack.mappings[name];
  const list = (Array.isArray(mapped) ? mapped : mapped ? [mapped] : []).filter((f) => pack.files.includes(f));
  return list.length ? list[Math.min(list.length - 1, Math.floor(random() * list.length))] : null;
}
export function playNoticeSound(kind: NoticeSound) {
  const s = getSettings();
  if (!s.sounds) return;
  const pack = packFor(s.theme);
  const f = pickNoticeFile(pack, kind);
  if (!pack || !f) return;
  const vol = Math.max(0, Math.min(1, (s.sfxVolume ?? 80) / 100));
  const ready = audioCtx();
  const resumed = ready?.state === "suspended" ? ready.resume().catch(() => {}) : Promise.resolve();
  packUrl(pack, f)
    .then((url) => (url ? loadBuffer(url) : null))
    .then(async (b) => { await resumed; if (b && getSettings().sounds) playBuffer(b, vol); })
    .catch(() => {});
}
let lastPlay = 0;
let lastDialCue = 0;
export function playSound(kind: SoundKind, variation = 0) {
  const s = getSettings();
  if (!s.sounds || (s.theme === "dial" && s.dial.sound === "off")) return;
  // Holding the d-pad fires many moves: don't stack identical clicks.
  const now = Date.now();
  if ((kind === "move" || kind === "tile") && now - lastPlay < 45) return;
  lastPlay = now;
  if ((NOTICE_SOUNDS as readonly string[]).includes(kind)) return playNoticeSound(kind as NoticeSound);
  if (s.theme === "dial" && s.dial.sound === "reference") {
    const name = kind === "launch" ? "launch.wav" : kind === "open" || kind === "menu" ? "wake.wav" : kind === "back" || kind === "close" ? "back.wav" : "switch.wav";
    const volume = Math.max(0,Math.min(1,s.sfxVolume/100));
    // Resume on the user's gesture before awaiting an asset fetch.
    const c = audioCtx();
    const cue = ++lastDialCue;
    const ready = c?.state === "suspended" ? c.resume().catch(() => {}) : Promise.resolve();
    Promise.all([loadDialAsset(name).then(u=>u?loadBuffer(u):null), ready]).then(([b])=>{
      const current = getSettings();
      if (cue !== lastDialCue || !current.sounds || current.theme !== "dial" || current.dial.sound !== "reference") return;
      if ((!b || !playBuffer(b,volume)) && !previewSound) steamSound(SOUND_FILES[kind]);
    });
    return;
  }
  if (previewSound) return previewSound(kind, variation);
  const file = SOUND_FILES[kind];
  const ready = audioCtx();
  const resumed = ready?.state === "suspended" ? ready.resume().catch(()=>{}) : Promise.resolve();
  const pack = packFor(s.theme);
  const alternatives = pack?.mappings[file];
  const f = pack && kind === "tab" && Array.isArray(alternatives) && alternatives.length > 1 ? alternatives[Math.abs(variation) % alternatives.length] : pack ? packFile(pack, file) : null;
  if (!pack) return steamSound(file);
  if (!f) return; // Missing cues stay silent instead of switching console identities.
  const vol = Math.max(0, Math.min(1, (s.sfxVolume ?? 80) / 100));
  packUrl(pack, f)
    .then((url) => (url ? loadBuffer(url) : null))
    .then(async (b) => {
      await resumed;
      if (getSettings().sounds && packFor(getSettings().theme)?.folder === pack.folder && b) playBuffer(b, vol);
    })
    .catch(() => {});
}

// Something with its own audio is playing (trailer in an icon): music fades out meanwhile.
let ducks = 0;
const duckListeners = new Set<() => void>();
export function duckMusic(on: boolean) {
  ducks = Math.max(0, ducks + (on ? 1 : -1));
  duckListeners.forEach((l) => l());
}
function useDucked() {
  const [d, setD] = useState(ducks > 0);
  useEffect(() => {
    const l = () => setD(ducks > 0);
    duckListeners.add(l);
    return () => void duckListeners.delete(l);
  }, []);
  return d;
}

/** The theme's music (the pack's menu music), looping while the home is shown. */
export function useHomeMusic(theme: ThemeId, active: boolean, page?: string) {
  const s = getSettings();
  const on = s.backgroundMusic !== false && s.music[theme] !== false && active;
  const context=theme==="wiiu"&&!s.musicPacks?.wiiu ? ({downloads:"Wii U Download Management",friends:"Wii U Friends theme",settings:"Wii U Settings",qam:"Wii U Settings"} as Record<string,string>)[page??""] : undefined;
  const pack = context ? packs.find(p=>p.name===context||p.folder===context)??null : packFor(theme, "music");
  const file = pack ? musicFile(pack) : null;
  const ducked = useDucked();
  const vol = ducked ? 0 : Math.max(0, Math.min(1, s.musicVolume / 100));
  const key = pack && file ? `${pack.folder}/${file}` : "";
  const targetVolume = useRef(vol);
  targetVolume.current = vol;
  useEffect(() => {
    preloadSounds(theme);
  }, [theme, pack?.folder]);
  useEffect(() => {
    if (!on || !pack || !file) return;
    let dead = false;
    let a: HTMLAudioElement | null = null;
    let fade: any = null;
    let release: (() => void) | null = null;
    (async () => {
      const url = await packUrl(pack, file);
      if (dead || !url) return;
      try {
        a = new (uiWindow().Audio ?? Audio)(url) as HTMLAudioElement;
        a.loop = true;
        a.volume = 0;
        await a.play();
        if (dead) { a.pause(); return; }
        // AudioLoader's / ThemeDeck's menu music would play underneath ours.
        release = holdOtherMusic();
        // One envelope follows current volume/ducking, including changes while
        // the file is loading. Competing fades must not restore stale volume.
        fade = setInterval(() => {
          if (!a) return;
          const target = targetVolume.current;
          const delta = target - a.volume;
          a.volume = Math.abs(delta) <= .02 ? target : Math.max(0, Math.min(1, a.volume + Math.sign(delta) * .02));
        }, 60);
      } catch {
        /* blocked or missing */
      }
    })();
    return () => {
      dead = true;
      clearInterval(fade);
      const el = a;
      if (!el) return;
      const done = release;
      release = null;
      // short fade out
      let v = el.volume;
      const out = setInterval(() => {
        v -= 0.06;
        if (v <= 0) {
          clearInterval(out);
          try {
            el.pause();
            el.src = "";
          } catch {
            /* ignore */
          }
          done?.();
        } else el.volume = v;
      }, 30);
    };
  }, [on, key]);

}

// ───────────── Steam's native game menu (≡) ─────────────
// Found inside Steam's webpack bundle by content (minified names change).
let req: any;
function getRequire(): any {
  if (req) return req;
  try {
    (globalThis as any).webpackChunksteamui?.push([[Math.random()], {}, (r: any) => (req = r)]);
  } catch {
    /* ignore */
  }
  return req;
}
function findModuleExports(...needles: string[]): Record<string, any> | null {
  const r = getRequire();
  if (!r?.m) return null;
  for (const id of Object.keys(r.m)) {
    try {
      const src = String(r.m[id]);
      if (needles.every((n) => src.includes(n))) return r(id) ?? null;
    } catch {
      /* skip */
    }
  }
  return null;
}
let appMenu: { Menu: any; options: any } | null | undefined;
function findAppMenu() {
  if (appMenu !== undefined) return appMenu;
  appMenu = null;
  try {
    const mod = findModuleExports("ContextMenuAction", "launchSource", "LibraryContextMenu");
    let Menu: any, options: any;
    for (const v of Object.values(mod ?? {})) {
      if (typeof v !== "function") continue;
      const t = String(v);
      if (t.includes("navigator:") && t.includes("instance:")) Menu = v;
      if (t.includes("bFitToWindow") && t.includes("LibraryContextMenu")) options = v;
    }
    if (Menu) appMenu = { Menu, options };
  } catch {
    /* ignore */
  }
  return appMenu;
}

/**
 * Steam's own Media (screenshots) page. Its route isn't a stable API, so it's
 * looked up in Steam's bundle by content; falls back to the steam:// URL.
 */
let mediaRoute: string | null | undefined;
export function findMediaRoute(): string | null {
  if (mediaRoute !== undefined) return mediaRoute;
  mediaRoute = null;
  try {
    const r = getRequire();
    const found = new Set<string>();
    for (const id of Object.keys(r?.m ?? {})) {
      const src = String(r.m[id]);
      if (!src.includes('"/media') && !src.includes('"/screenshots')) continue;
      for (const m of src.matchAll(/"(\/(?:media|screenshots)[\w\/:?-]*)"/g)) found.add(m[1]);
    }
    const clean = [...found].map((p) => p.replace(/\/:[^/]+\??/g, "").replace(/\?$/, "")).filter(Boolean);
    clean.sort((a, b) => a.length - b.length);
    mediaRoute = clean.find((p) => p.startsWith("/media")) ?? clean[0] ?? null;
  } catch {
    mediaRoute = null;
  }
  return mediaRoute;
}

export function openNativeGameMenu(appid: number, overview: any, anchor: EventTarget | undefined) {
  const found = findAppMenu();
  if (!found || !overview) {
    try {
      Navigation.Navigate(`/library/app/${appid}`);
    } catch {
      /* ignore */
    }
    return;
  }
  try {
    const win = (anchor as any)?.ownerDocument?.defaultView ?? window;
    const el = createElement(found.Menu, { overview, client: "mostavailable", launchSource: 100, bInGamepadUI: true, ownerWindow: win });
    showContextMenu(el, anchor as any, found.options ? found.options() : undefined);
  } catch {
    Navigation.Navigate(`/library/app/${appid}`);
  }
}

// ───────────── clock / battery / user ─────────────
export function useClock(intervalMs = 10000): Date {
  const [now, setNow] = useState(() => new Date());
  // a clock with seconds (Standard options) ticks every second
  const every = getSettings().clockSeconds ? Math.min(intervalMs, 1000) : intervalMs;
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), every);
    return () => clearInterval(iv);
  }, [every]);
  return now;
}

/** The home's clock text. Standard options decide whether it shows, and with seconds. */
export function fmtTime(d: Date, h24: boolean, seconds = false): string {
  const opt = getSettings();
  if (!opt.clockShown) return "";
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = seconds || opt.clockSeconds ? ":" + String(d.getSeconds()).padStart(2, "0") : "";
  if (h24) return `${String(h).padStart(2, "0")}:${m}${s}`;
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m}${s} ${ap}`;
}

/** A date in the format chosen in Standard options. `year` adds the year. */
export function fmtDate(d: Date, year = false): string {
  const opt = getSettings();
  if (!opt.clockShown) return "";
  const D = String(d.getDate()), M = String(d.getMonth() + 1), Y = String(d.getFullYear());
  const pad = (v: string) => (year ? v.padStart(2, "0") : v);
  switch (opt.dateFormat) {
    case "DMY": return year ? `${pad(D)}/${pad(M)}/${Y}` : `${D}/${M}`;
    case "YMD": return year ? `${Y}/${pad(M)}/${pad(D)}` : `${M}/${D}`;
    default: return year ? `${pad(M)}/${pad(D)}/${Y}` : `${M}/${D}`;
  }
}

export interface Battery {
  level: number; // 0–1
  charging: boolean;
}
let previewBattery: Battery | null = null;
export function setPreviewBattery(b: Battery | null) {
  previewBattery = b;
}
export function useBattery(): Battery | null {
  const [b, setB] = useState<Battery | null>(previewBattery);
  useEffect(() => {
    if (previewBattery) return;
    let reg: any;
    try {
      reg = SteamClient?.System?.RegisterForBatteryStateChanges?.((st: any) => {
        if (st && st.bHasBattery !== false && typeof st.flLevel === "number") {
          setB({ level: st.flLevel, charging: st.eACState === 2 || st.eACState === 3 });
        }
      });
    } catch {
      /* ignore */
    }
    if (!reg) {
      try {
        (navigator as any).getBattery?.().then((nb: any) => {
          const upd = () => setB({ level: nb.level, charging: nb.charging });
          upd();
          nb.addEventListener?.("levelchange", upd);
          nb.addEventListener?.("chargingchange", upd);
        });
      } catch {
        /* ignore */
      }
    }
    return () => {
      try {
        reg?.unregister?.();
      } catch {
        /* ignore */
      }
    };
  }, []);
  return b;
}

let previewUser: string | null = null;
export function setPreviewUser(n: string) {
  previewUser = n;
}
export function userName(): string {
  const set = getSettings().profileName.trim();
  if (set) return set;
  if (previewUser) return previewUser;
  const g: any = globalThis;
  const tries = [
    () => g.App?.m_CurrentUser?.strPersonaName,
    () => g.friendStore?.m_FriendsUIFriendStore?.m_self?.m_persona?.m_strPlayerName,
    () => g.FriendStore?.self?.display_name,
    () => g.App?.m_CurrentUser?.strAccountName,
    () => g.loginStore?.m_strAccountName,
  ];
  for (const t of tries) {
    try {
      const v = t();
      if (typeof v === "string" && v.trim()) return v.trim();
    } catch {
      /* ignore */
    }
  }
  return "Player";
}

// ───────────── Steam's top bar ─────────────
// While the themed home is on screen, Steam's own header strip (search,
// clock, battery) is hidden so it doesn't sit on top of the theme. Found by
// geometry: full-width strips at the very top of the window, outside our layer.
const HIDDEN_ATTR = "data-dht-hidden";
function hideHeader(doc: Document) {
  const view = doc.defaultView;
  if (!view) return;
  const W = view.innerWidth || 1280;
  for (const el of Array.from(doc.querySelectorAll<HTMLElement>("body *"))) {
    if (el.hasAttribute(HIDDEN_ATTR) || el.closest("[data-dht-root]") || el.querySelector("[data-dht-root]")) continue;
    const r = el.getBoundingClientRect();
    if (r.top > 2 || r.top < -4 || r.height < 24 || r.height > 90 || r.width < W * 0.8) continue;
    // Only the outermost strip: skip if an ancestor is already hidden.
    if (el.parentElement?.closest(`[${HIDDEN_ATTR}]`)) continue;
    el.setAttribute(HIDDEN_ATTR, el.style.visibility || "-");
    el.style.visibility = "hidden";
  }
}
export function restoreHeader(doc: Document | null | undefined) {
  if (!doc) return;
  for (const el of Array.from(doc.querySelectorAll<HTMLElement>(`[${HIDDEN_ATTR}]`))) {
    const prev = el.getAttribute(HIDDEN_ATTR);
    el.style.visibility = prev === "-" ? "" : prev ?? "";
    el.removeAttribute(HIDDEN_ATTR);
  }
}
export function useHiddenHeader(doc: Document | null | undefined, on: boolean) {
  useEffect(() => {
    if (!doc || !on) return;
    const run = () => {
      try {
        hideHeader(doc);
      } catch {
        /* ignore */
      }
    };
    run();
    const ts = [200, 800].map((ms) => setTimeout(run, ms));
    const iv = setInterval(run, 1500);
    return () => {
      ts.forEach(clearTimeout);
      clearInterval(iv);
      restoreHeader(doc);
    };
  }, [doc, on]);
}

// ───────────── Steam's bottom bar ─────────────
// The footer strip with "STEAM Menu · Ⓐ Select · Ⓑ Back". "hints" hides only
// the button legend (like CSS Loader's Icon Hider, which targets
// footer_FooterLegend), "hide" removes the whole strip so the theme gets the
// full height. Found through Steam's class map, with a geometry fallback for
// builds where the class name changed. Everything is restored when the home
// closes or the setting is switched back.
const FOOT_ATTR = "data-dht-foot";
let legendClass: string | null | undefined;
function footerLegendClass(): string | null {
  if (legendClass !== undefined) return legendClass;
  try {
    const m: any = findClassModule((x: any) => typeof x?.FooterLegend === "string" && !x.FooterLegend.includes(" "));
    legendClass = m?.FooterLegend ?? null;
  } catch {
    legendClass = null;
  }
  return legendClass ?? null;
}
const ours = (el: Element) => !!(el.closest("[data-dht-root]") || el.querySelector("[data-dht-root]"));
// Steam's on-screen keyboard is drawn in the page itself (class names like "virtualkeyboard_...", "...Keyboard...").
// Its own bottom row / button legend looks exactly like the footer strip, and hiding it (or a parent that holds
// it) collapses the keyboard's height, so it slides down while it opens. Nothing in or around it is ever touched.
const KEYBOARD_SEL = '[class*="eyboard"],[class*="KEYBOARD"],[data-keyboard],[aria-label*="eyboard"]';
export const touchesKeyboard = (el: Element) => !!(el.closest(KEYBOARD_SEL) || el.querySelector(KEYBOARD_SEL));
// The themed home stays mounted under other pages (chat, settings): the bar is only ours to hide while it is on screen.
const homeVisible = (doc: Document) => {
  const r = doc.querySelector<HTMLElement>("[data-dht-root]");
  return !!r && r.getClientRects().length > 0 && getComputedStyle(r).visibility !== "hidden";
};
function bottomStrips(doc: Document): HTMLElement[] {
  const view = doc.defaultView;
  if (!view) return [];
  const W = view.innerWidth || 1280;
  const Hh = view.innerHeight || 800;
  const out: HTMLElement[] = [];
  for (const el of Array.from(doc.querySelectorAll<HTMLElement>("body *"))) {
    if (el.hasAttribute(FOOT_ATTR) || ours(el) || touchesKeyboard(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < Hh - 3 || r.bottom > Hh + 4 || r.height < 24 || r.height > 90 || r.width < W * 0.8) continue;
    if (el.parentElement?.closest(`[${FOOT_ATTR}]`)) continue;
    // A footer strip shows button glyphs/labels, not just an empty layer.
    if (!(el.textContent ?? "").trim() && !el.querySelector("svg,img")) continue;
    out.push(el);
  }
  return out;
}
function markFooter(el: HTMLElement, how: "display" | "visibility") {
  if (el.hasAttribute(FOOT_ATTR) || ours(el) || touchesKeyboard(el)) return;
  el.setAttribute(FOOT_ATTR, `${how}:${el.style.getPropertyValue(how) || "-"}`);
  el.style.setProperty(how, how === "display" ? "none" : "hidden", "important");
}
function hideFooter(doc: Document, mode: "hints" | "hide") {
  const view = doc.defaultView;
  const W = view?.innerWidth || 1280;
  const cls = footerLegendClass();
  const legends = cls ? Array.from(doc.querySelectorAll<HTMLElement>(`.${cls}`)).filter((e) => !ours(e) && !touchesKeyboard(e)) : [];
  if (mode === "hints") {
    if (legends.length) legends.forEach((e) => markFooter(e, "visibility"));
    else bottomStrips(doc).forEach((e) => markFooter(e, "visibility"));
    return;
  }
  // Whole bar: climb from the legend to the outermost full-width strip.
  const bars = new Set<HTMLElement>();
  for (const l of legends) {
    let bar: HTMLElement = l;
    for (let p = l.parentElement; p && p !== doc.body; p = p.parentElement) {
      if (ours(p) || touchesKeyboard(p)) break;
      const r = p.getBoundingClientRect();
      if (r.height > 110) break;
      if (r.width >= W * 0.8) bar = p;
    }
    bars.add(bar);
  }
  if (!bars.size) bottomStrips(doc).forEach((e) => bars.add(e));
  bars.forEach((e) => markFooter(e, "display"));
}
function restoreOne(el: HTMLElement) {
  const [how, prev] = (el.getAttribute(FOOT_ATTR) ?? "display:-").split(":");
  if (prev === "-" || !prev) el.style.removeProperty(how);
  else el.style.setProperty(how, prev);
  el.removeAttribute(FOOT_ATTR);
}
export function restoreFooter(doc: Document | null | undefined) {
  if (!doc) return;
  for (const el of Array.from(doc.querySelectorAll<HTMLElement>(`[${FOOT_ATTR}]`))) restoreOne(el);
}
export function useHiddenFooter(doc: Document | null | undefined, mode: "show" | "hints" | "hide") {
  useEffect(() => {
    if (!doc || mode === "show") return;
    const run = () => {
      try {
        if (!homeVisible(doc)) {
          restoreFooter(doc); // another page is on top: leave Steam's own bar alone
          return;
        }
        // a text field has focus, so the keyboard is opening or open: change nothing in the page meanwhile
        const ae = doc.activeElement as HTMLElement | null;
        if (ae && (ae.isContentEditable || /^(INPUT|TEXTAREA)$/.test(ae.tagName))) return;
        // if the keyboard ended up inside something we hid earlier, give that back at once
        for (const el of Array.from(doc.querySelectorAll<HTMLElement>(`[${FOOT_ATTR}]`))) if (touchesKeyboard(el)) restoreOne(el);
        hideFooter(doc, mode);
      } catch {
        /* ignore */
      }
    };
    run();
    const ts = [200, 800].map((ms) => setTimeout(run, ms));
    const iv = setInterval(run, 1500);
    return () => {
      ts.forEach(clearTimeout);
      clearInterval(iv);
      restoreFooter(doc);
    };
  }, [doc, mode]);
}

// ───────────── live status (friends / downloads / notifications) ─────────────
// Read from Steam's UI stores when present; any value can be undefined.
export interface SteamStatus {
  friendsOnline?: number;
  downloads?: number; // queued or running
  notifications?: number; // unread
  online: boolean;
  avatar?: string;
  cloud?: boolean; // Steam Cloud enabled
}
let previewStatus: SteamStatus | null = null;
export function setPreviewStatus(st: SteamStatus) {
  previewStatus = st;
}
function readStatus(): SteamStatus {
  const g: any = globalThis as any;
  const st: SteamStatus = { online: typeof navigator === "undefined" ? true : navigator.onLine !== false };
  try {
    const fs = g.friendStore;
    const list: any[] = fs?.allFriends ?? fs?.m_FriendsUIFriendStore?.allFriends ?? [];
    if (Array.isArray(list) && list.length)
      st.friendsOnline = list.filter((f) => {
        const p = f?.persona ?? f;
        return p?.is_online === true || p?.m_bIsOnline === true || Number(p?.m_ePersonaState ?? p?.ePersonaState ?? 0) > 0;
      }).length;
  } catch {
    /* ignore */
  }
  try {
    const ds = g.downloadsStore;
    const items: any[] = ds?.m_DownloadItems ?? ds?.downloadItems ?? [];
    if (Array.isArray(items)) st.downloads = items.filter((i) => !i?.completed).length;
  } catch {
    /* ignore */
  }
  try {
    const ns = g.notificationStore;
    const tray: any[] = ns?.m_rgNotificationTray ?? ns?.m_rgTrayNotifications ?? [];
    if (Array.isArray(tray)) st.notifications = tray.filter((n) => n && !n.bViewed && !n.viewed).length;
  } catch {
    /* ignore */
  }
  try {
    const ss = g.settingsStore;
    const v = ss?.settings?.bCloudEnabled ?? ss?.m_ClientSettings?.cloud_enabled ?? ss?.settings?.bCloudEnabledForAccount;
    if (typeof v === "boolean") st.cloud = v;
  } catch {
    /* ignore */
  }
  try {
    const u = g.App?.m_CurrentUser;
    const hash = u?.strAvatarHash;
    if (typeof hash === "string" && /^[0-9a-f]{40}$/i.test(hash) && !/^0+$/.test(hash)) st.avatar = `https://avatars.steamstatic.com/${hash}_full.jpg`;
  } catch {
    /* ignore */
  }
  return st;
}
export function useSteamStatus(): SteamStatus {
  const [st, setSt] = useState<SteamStatus>(() => previewStatus ?? readStatus());
  useEffect(() => {
    if (previewStatus) return;
    const iv = setInterval(() => setSt(readStatus()), 5000);
    return () => clearInterval(iv);
  }, []);
  return st;
}
