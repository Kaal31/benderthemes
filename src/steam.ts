import { loadDialAsset } from "./themes/dialAssets";
// Small bridges to Steam's own UI: sounds, the native game menu, the top
// bar, battery and user info. None of this is public API, so all of it is
// defensive and every DOM change is undone on teardown.
import { findClassModule, Navigation, showContextMenu } from "@decky/ui";
import { callable } from "@decky/api";
import { createElement, useEffect, useRef, useState } from "react";
import { getUiDocument } from "./cssvars";
import { getSettings, ThemeId } from "./settings";

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
let wallpaperOverride: ((name: string) => string | null) | null = null;
export function setWallpaperOverride(f: typeof wallpaperOverride) {
  wallpaperOverride = f;
}
/** Data URL of a user wallpaper (cached), or null. */
/** Picture a theme uses when none is chosen (if that file is in the wallpapers folder). */
export const DEFAULT_WALLPAPER: Partial<Record<ThemeId, string>> = { aero: "aero-background.jpg", aero2: "aero-background.jpg" };
export function useWallpaper(theme: ThemeId): string | null {
  const name = getSettings().wallpapers[theme] || DEFAULT_WALLPAPER[theme] || "";
  const [url, setUrl] = useState<string | null>(name ? wallCache.get(name) ?? null : null);
  useEffect(() => {
    if (!name) return setUrl(null);
    if (wallpaperOverride) return setUrl(wallpaperOverride(name));
    if (wallCache.has(name)) return setUrl(wallCache.get(name)!);
    let alive = true;
    backendWallpaper(name)
      .then((u) => {
        wallCache.set(name, u ?? null);
        if (alive) setUrl(u ?? null);
      })
      .catch(() => alive && setUrl(null));
    return () => {
      alive = false;
    };
  }, [name]);
  return url;
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
  minecraft: { re: [/Minecraft Console Legacy/i], suggest: "Minecraft Console Legacy" },
  republic: { re: [/DHT Verified Republic/i], suggest: "DHT Verified Republic" },
  castle: { re: [/DHT Verified SAO/i,/Sword Art Online/i], suggest: "DHT Verified SAO" },
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
  return Object.values(SOUND_FILES).filter((f) => packFile(p, f)).length;
}
export function autoPack(theme: ThemeId, kind: PackKind = "sfx"): SoundPack | null {
  for (const re of (PACK_MATCH[matchKey(theme)] ?? PACK_MATCH[theme])?.re ?? []) {
    const hits = packs.filter((p) => re.test(p.name) || re.test(p.folder));
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
  return autoPack(theme, kind);
}
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
    "deck_ui_switch_toggle_on.wav":["deck_ui_default_activation.wav","deck_ui_into_game_detail.wav"]
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
  if((window as any).__testAssets && ["DHT Verified Republic","Minecraft Console Legacy","windows xp sounds"].includes(pack.folder))return `../bundle/sounds/${encodeURIComponent(pack.folder)}/${encodeURIComponent(file)}`;
  const base = previewSoundBase ?? (await mediaBase());
  return base ? `${base}/s/${encodeURIComponent(pack.folder)}/${encodeURIComponent(file)}` : null;
}

function uiWindow(): any {
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
      return await new Promise<AudioBuffer | null>((res) => c.decodeAudioData(data, (b) => res(b), () => res(null)));
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
function steamSound(file: string) {
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
let lastPlay = 0;
let lastDialCue = 0;
export function playSound(kind: SoundKind, variation = 0) {
  const s = getSettings();
  if (!s.sounds || (s.theme === "dial" && s.dial.sound === "off")) return;
  // Holding the d-pad fires many moves: don't stack identical clicks.
  const now = Date.now();
  if ((kind === "move" || kind === "tile") && now - lastPlay < 45) return;
  lastPlay = now;
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
export function useHomeMusic(theme: ThemeId, active: boolean) {
  const s = getSettings();
  const on = s.backgroundMusic !== false && s.music[theme] !== false && active;
  const pack = packFor(theme, "music");
  const file = pack ? musicFile(pack) : null;
  const ducked = useDucked();
  const vol = ducked ? 0 : Math.max(0, Math.min(1, s.musicVolume / 100));
  const key = pack && file ? `${pack.folder}/${file}` : "";
  const audioRef = useRef<HTMLAudioElement | null>(null);
  useEffect(() => {
    preloadSounds(theme);
  }, [theme, pack?.folder]);
  useEffect(() => {
    if (!on || !pack || !file) return;
    let dead = false;
    let a: HTMLAudioElement | null = null;
    let fade: any = null;
    (async () => {
      const url = await packUrl(pack, file);
      if (dead || !url) return;
      try {
        a = new (uiWindow().Audio ?? Audio)(url) as HTMLAudioElement;
        audioRef.current = a;
        a.loop = true;
        a.volume = 0;
        await a.play();
        // fade in
        let v = 0;
        fade = setInterval(() => {
          v = Math.min(vol, v + vol / 20);
          if (a) a.volume = v;
          if (v >= vol) clearInterval(fade);
        }, 60);
      } catch {
        /* blocked or missing */
      }
    })();
    return () => {
      dead = true;
      clearInterval(fade);
      const el = a;
      audioRef.current = null;
      if (!el) return;
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
        } else el.volume = v;
      }, 30);
    };
  }, [on, key]);
  useEffect(() => {
    // glide to the new volume (fades out under a trailer, back in after)
    const iv = setInterval(() => {
      const a = audioRef.current;
      if (!a) return clearInterval(iv);
      const d = vol - a.volume;
      if (Math.abs(d) < 0.02) {
        a.volume = vol;
        clearInterval(iv);
      } else a.volume = Math.max(0, Math.min(1, a.volume + Math.sign(d) * 0.03));
    }, 40);
    return () => clearInterval(iv);
  }, [vol]);
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
  useEffect(() => {
    const iv = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(iv);
  }, [intervalMs]);
  return now;
}

export function fmtTime(d: Date, h24: boolean, seconds = false): string {
  let h = d.getHours();
  const m = String(d.getMinutes()).padStart(2, "0");
  const s = seconds ? ":" + String(d.getSeconds()).padStart(2, "0") : "";
  if (h24) return `${String(h).padStart(2, "0")}:${m}${s}`;
  const ap = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m}${s} ${ap}`;
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
function bottomStrips(doc: Document): HTMLElement[] {
  const view = doc.defaultView;
  if (!view) return [];
  const W = view.innerWidth || 1280;
  const Hh = view.innerHeight || 800;
  const out: HTMLElement[] = [];
  for (const el of Array.from(doc.querySelectorAll<HTMLElement>("body *"))) {
    if (el.hasAttribute(FOOT_ATTR) || ours(el)) continue;
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
  if (el.hasAttribute(FOOT_ATTR) || ours(el)) return;
  el.setAttribute(FOOT_ATTR, `${how}:${el.style.getPropertyValue(how) || "-"}`);
  el.style.setProperty(how, how === "display" ? "none" : "hidden", "important");
}
function hideFooter(doc: Document, mode: "hints" | "hide") {
  const view = doc.defaultView;
  const W = view?.innerWidth || 1280;
  const cls = footerLegendClass();
  const legends = cls ? Array.from(doc.querySelectorAll<HTMLElement>(`.${cls}`)).filter((e) => !ours(e)) : [];
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
      if (ours(p)) break;
      const r = p.getBoundingClientRect();
      if (r.height > 110) break;
      if (r.width >= W * 0.8) bar = p;
    }
    bars.add(bar);
  }
  if (!bars.size) bottomStrips(doc).forEach((e) => bars.add(e));
  bars.forEach((e) => markFooter(e, "display"));
}
export function restoreFooter(doc: Document | null | undefined) {
  if (!doc) return;
  for (const el of Array.from(doc.querySelectorAll<HTMLElement>(`[${FOOT_ATTR}]`))) {
    const [how, prev] = (el.getAttribute(FOOT_ATTR) ?? "display:-").split(":");
    if (prev === "-" || !prev) el.style.removeProperty(how);
    else el.style.setProperty(how, prev);
    el.removeAttribute(FOOT_ATTR);
  }
}
export function useHiddenFooter(doc: Document | null | undefined, mode: "show" | "hints" | "hide") {
  useEffect(() => {
    if (!doc || mode === "show") return;
    const run = () => {
      try {
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
