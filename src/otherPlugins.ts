// Living alongside other Decky plugins that play music or replace the home.
//
// AudioLoader plays its menu music everywhere outside games and exposes
// window.AUDIOLOADER_MENUMUSIC { play, pause, setVolume }.
//
// ThemeDeck (v3.0.2) has no API, but it reads its settings from localStorage
// ("themedeck:*") and re-evaluates what to play whenever the matching
// CustomEvent ("themedeck:global-ambient-enabled-changed" ...) fires. While our
// theme music plays we switch its "global ambient" (home) and "store" tracks
// off through those two channels: ThemeDeck then stops itself (fade out, its
// own state stays correct). On release the user's values go back and it starts
// again by itself, or not when a game is running. Per-game tracks on a game's
// detail page are left alone. As a fallback for versions without these
// settings, its shared element window.__themedeckSharedAudio is paused while
// held (the old behaviour). DeckyXMB reads ThemeDeck's tracks through Decky
// and plays them itself, pausing the same element; it uses no flag.
// DeckyXMB also patches /library/home; with both on, whichever patch Decky
// applies last decides which home shows, so we report it in Diagnostics.
import { useEffect, useState } from "react";
import { pluginSupport } from "./pluginSupport";
import { loadedPluginNames } from "./pluginPresence";

const wins = (): any[] => {
  const out = [globalThis as any];
  try {
    const ui = (globalThis as any).SteamUIStore?.GetFocusedWindowInstance?.()?.BrowserWindow;
    if (ui && ui !== globalThis) out.push(ui);
  } catch {
    /* ignore */
  }
  return out;
};
const audioLoader = (): { play?: () => any; pause?: () => any } | null => {
  for (const w of wins()) if (w?.AUDIOLOADER_MENUMUSIC) return w.AUDIOLOADER_MENUMUSIC;
  return null;
};
export const themeDeck = (): HTMLAudioElement | null => {
  for (const w of wins()) if (w?.__themedeckSharedAudio) return w.__themedeckSharedAudio;
  return null;
};
const gameRunning = () => {
  try {
    return ((globalThis as any).SteamUIStore?.RunningApps?.length ?? 0) > 0;
  } catch {
    return false;
  }
};
/** Steam's live route (confirmed on device by DeckyXMB: the main window's history). */
export function currentRoute(): string {
  try {
    const g: any = globalThis;
    const p = g.SteamUIStore?.WindowStore?.GamepadUIMainWindowInstance?.m_history?.location?.pathname;
    if (typeof p === "string") return p;
  } catch {
    /* ignore */
  }
  try {
    return String((globalThis as any).location?.pathname ?? "");
  } catch {
    return "";
  }
}
/** A game's detail page, where ThemeDeck plays that game's own track. */
export const onGamePage = (route = currentRoute()) => /^\/library\/app\/\d+/.test(route);

// ---- ThemeDeck's preferences ("true"/"false" strings; defaults from its source) ----
const TD_PREFS = [
  { key: "themedeck:globalAmbientEnabled", event: "themedeck:global-ambient-enabled-changed", fallback: false },
  { key: "themedeck:storeTrackEnabled", event: "themedeck:store-track-enabled-changed", fallback: true },
];
const BACKUP_KEY = "dht:themedeckPrefsBackup"; // survives a crash while held
const storage = (): Storage | null => {
  for (const w of wins().reverse()) {
    try {
      if (w?.localStorage) return w.localStorage;
    } catch {
      /* ignore */
    }
  }
  return null;
};
const fire = (event: string, value: boolean) => {
  for (const w of wins()) {
    try {
      const C = w.CustomEvent ?? (globalThis as any).CustomEvent;
      w.dispatchEvent?.(new C(event, { detail: value }));
    } catch {
      /* ignore */
    }
  }
};
/** ThemeDeck is loaded: its element exists or it already stored settings. */
export const themeDeckPresent = (): boolean => {
  if (themeDeck()) return true;
  const s = storage();
  try {
    if (s) for (let i = 0; i < s.length; i++) if (String(s.key(i)).startsWith("themedeck:")) return true;
  } catch {
    /* ignore */
  }
  return false;
};
/** Read ThemeDeck's own autoplay and master preferences, never overwrite them. */
export function themeDeckPreferences() {
  const s = storage();
  let autoplay = true, master = 1;
  try {
    autoplay = s?.getItem("themedeck:autoPlay") !== "false";
    const raw = s?.getItem("themedeck:masterVolume");
    const n = raw == null ? 100 : Number(raw);
    master = Number.isFinite(n) ? Math.max(.01, Math.min(1, n / 100)) : 1;
  } catch { /* defaults */ }
  return { autoplay, master };
}
let prefsOff = false;
function setThemeDeckPrefsOff() {
  const s = storage();
  if (prefsOff || !s || !themeDeckPresent()) return;
  try {
    if (!s.getItem(BACKUP_KEY)) {
      const backup: Record<string, string | null> = {};
      for (const p of TD_PREFS) backup[p.key] = s.getItem(p.key);
      s.setItem(BACKUP_KEY, JSON.stringify(backup));
    }
    for (const p of TD_PREFS) s.setItem(p.key, "false");
    prefsOff = true;
    for (const p of TD_PREFS) fire(p.event, false);
  } catch {
    /* ignore */
  }
}
/** Put the user's ThemeDeck values back; also heals a backup left by a crashed session. */
export function restoreThemeDeckPrefs() {
  prefsOff = false;
  const s = storage();
  if (!s) return;
  try {
    const raw = s.getItem(BACKUP_KEY);
    if (!raw) return;
    const backup = JSON.parse(raw) as Record<string, string | null>;
    for (const p of TD_PREFS) {
      const v = backup[p.key];
      if (v === null || v === undefined) s.removeItem(p.key);
      else s.setItem(p.key, v);
    }
    s.removeItem(BACKUP_KEY);
    for (const p of TD_PREFS) {
      const v = backup[p.key];
      fire(p.event, v == null ? p.fallback : v === "true");
    }
  } catch {
    /* ignore */
  }
}

let holds = 0;
let gameTrackHolds = 0;
let guard: any = null;
let pausedAudioLoader = false;
let pausedThemeDeck: HTMLAudioElement | null = null;
let watched: HTMLAudioElement | null = null;
function onThemeDeckPlay(this: HTMLAudioElement) {
  if (!holds || (onGamePage()&&!gameTrackHolds)) return;
  try {
    this.pause();
    pausedThemeDeck = this;
  } catch {
    /* ignore */
  }
}

function silenceOthers() {
  const al = audioLoader();
  if (al?.pause) {
    try {
      al.pause();
      pausedAudioLoader = true;
    } catch {
      /* ignore */
    }
  }
  setThemeDeckPrefsOff();
  // Fallback: an element still playing (older ThemeDeck, a track mid-fade, or
  // a game track that started before the flags took effect) is paused, except
  // on a game page where ThemeDeck's own game track is wanted.
  const td = themeDeck();
  if (td && watched !== td) {
    watched?.removeEventListener("play", onThemeDeckPlay);
    watched = td;
    td.addEventListener("play", onThemeDeckPlay);
  }
  if (td && !td.paused && (gameTrackHolds>0||(!onGamePage()&&!prefsOff))) {
    try {
      td.pause();
      pausedThemeDeck = td;
    } catch {
      /* ignore */
    }
  }
}

function resumeOthers() {
  const al = pausedAudioLoader ? audioLoader() : null;
  const td = pausedThemeDeck;
  pausedAudioLoader = false;
  pausedThemeDeck = null;
  // ThemeDeck decides for itself again (and stays off during games).
  restoreThemeDeckPrefs();
  if (gameRunning()) return; // both plugins keep their own music off during games
  try {
    al?.play && Promise.resolve(al.play()).catch(() => {});
  } catch {
    /* ignore */
  }
  // Element fallback only (we paused it directly): resume the same element.
  if (td && td.paused && td.src && themeDeck() === td) {
    setTimeout(() => {
      if (!holds && td.paused && td.src && !gameRunning()) td.play().catch(() => {});
    }, 1500);
  }
}

/** Pause other plugins' menu music until the returned function is called. */
export function holdOtherMusic(options: {includeGameTracks?:boolean} = {}): () => void {
  if(options.includeGameTracks)gameTrackHolds++;
  holds++;
  if (holds === 1) {
    silenceOthers();
    guard = setInterval(silenceOthers, 1000);
  }
  else if(options.includeGameTracks)silenceOthers();
  let released = false;
  return () => {
    if (released) return;
    released = true;
    if(options.includeGameTracks)gameTrackHolds=Math.max(0,gameTrackHolds-1);
    holds = Math.max(0, holds - 1);
    if (holds) return;
    clearInterval(guard);
    guard = null;
    watched?.removeEventListener("play", onThemeDeckPlay);
    watched = null;
    resumeOthers();
  };
}

/** Names of loaded Decky plugins (empty if Decky's list isn't reachable). */
function loadedPlugins(): string[] {
  return loadedPluginNames();
}

const HOME_REPLACERS = [/^DeckyXMB$/i, /^Spindeck$/i];
/** Other plugins that also replace Steam's home screen. */
export function otherHomePlugins(): string[] {
  return loadedPlugins().filter((n) => HOME_REPLACERS.some((re) => re.test(n)));
}

/** Music plugins we pause while our theme music plays. */
export function musicPluginsSeen(): string[] {
  const out: string[] = [];
  if (audioLoader()) out.push("AudioLoader");
  if (themeDeck() || loadedPlugins().some((n) => /^ThemeDeck$/i.test(n))) out.push("ThemeDeck");
  return out;
}

export function useOtherPlugins() {
  const read = () => ({ homes: otherHomePlugins(), music: musicPluginsSeen(), support: pluginSupport(loadedPlugins()) });
  const [v, setV] = useState(read);
  useEffect(() => {
    // A previous session may have died while ThemeDeck's settings were off.
    if (!holds) restoreThemeDeckPrefs();
    const iv = setInterval(() => {
      const next = read();
      setV((prev) => (JSON.stringify(prev) === JSON.stringify(next) ? prev : next));
    }, 3000);
    return () => clearInterval(iv);
  }, []);
  return v;
}
