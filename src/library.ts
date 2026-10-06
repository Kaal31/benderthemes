// Reads the Steam library from Steam's internal stores (collectionStore /
// appStore). These are not a public API, so every access is defensive: if a
// Steam update changes them, the themes show an empty library instead of
// crashing. The browser preview swaps this source for fake data.
import { beginLaunch } from "./launch";
import { openDestination } from "./destinations";
import { Navigation } from "@decky/ui";
import { getSettings, SortMode } from "./settings";
import { findMediaRoute } from "./steam";

declare const collectionStore: any;
declare const appStore: any;
declare const SteamClient: any;

export interface Game {
  appid: number;
  gameid: string; // what RunGame wants (differs from appid for non-Steam shortcuts)
  name: string;
  lastPlayed: number; // unix seconds
  playtime: number; // minutes
  installed: boolean;
  shortcut: boolean;
  kind: "game" | "app";
  art: {
    portrait: string[]; // 600×900 cover
    landscape: string[]; // 460×215 header
    hero: string[]; // wide background
    logo: string[]; // transparent title logo
  };
  overview: any; // Steam's app overview (needed for the native ≡ menu)
}

export interface Collection {
  id: string;
  name: string;
  games: Game[];
}

const APP_TYPE_GAME = 1;
const APP_TYPE_APPLICATION = 2;
const APP_TYPE_SHORTCUT = 1073741824;
const CDN = "https://cdn.cloudflare.steamstatic.com/steam/apps";

function tryList(names: string[], app: any): string[] {
  for (const n of names) {
    try {
      const fn = appStore?.[n];
      if (typeof fn !== "function") continue;
      const r = fn.call(appStore, app);
      if (Array.isArray(r) && r.length) return r.filter((u) => typeof u === "string" && u);
      if (typeof r === "string" && r) return [r];
    } catch {
      /* ignore */
    }
  }
  return [];
}

function artFor(a: any): Game["art"] {
  const shortcut = a.app_type === APP_TYPE_SHORTCUT;
  const cdn = (f: string) => (shortcut ? [] : [`${CDN}/${a.appid}/${f}`]);
  return {
    portrait: [
      ...tryList(["GetCustomVerticalCapsuleURLs"], a),
      ...tryList(["GetVerticalCapsuleURLForApp"], a),
      ...cdn("library_600x900.jpg"),
    ],
    landscape: [
      ...tryList(["GetCustomLandcapeImageURLs", "GetCustomLandscapeImageURLs"], a),
      ...tryList(["GetLandscapeImageURLForApp", "GetCachedLandscapeImageURLForApp"], a),
      ...cdn("header.jpg"),
    ],
    hero: [...tryList(["GetCustomHeroImageURLs"], a), ...cdn("library_hero.jpg")],
    logo: [...tryList(["GetCustomLogoImageURLs"], a), ...cdn("logo.png")],
  };
}

function toGame(a: any): Game | null {
  if (!a) return null;
  const t = a.app_type;
  const isGame = t === APP_TYPE_GAME || t === APP_TYPE_SHORTCUT;
  const isApp = t === APP_TYPE_APPLICATION;
  if (!isGame && !isApp) return null;
  const shortcut = t === APP_TYPE_SHORTCUT;
  return {
    appid: a.appid,
    gameid: String(a.m_gameid ?? a.gameid ?? a.appid),
    name: a.display_name ?? a.sort_as ?? String(a.appid),
    lastPlayed: a.rt_last_time_played ?? a.rt_last_time_locally_played ?? 0,
    playtime: Number(a.minutes_playtime_forever ?? 0),
    installed: shortcut ? true : !!(a.installed ?? a.local_per_client_data?.installed),
    shortcut,
    kind: isGame ? "game" : "app",
    art: artFor(a),
    overview: a,
  };
}

export function sortGames(list: Game[], sort: SortMode): Game[] {
  return [...list].sort((x, y) =>
    sort === "alpha"
      ? x.name.localeCompare(y.name)
      : sort === "playtime"
        ? y.playtime - x.playtime || y.lastPlayed - x.lastPlayed
        : y.lastPlayed - x.lastPlayed || x.name.localeCompare(y.name),
  );
}

export interface LibrarySource {
  allApps(): any[];
  collections(): { id: string; name: string; apps: any[] }[];
}

const steamSource: LibrarySource = {
  allApps() {
    const c =
      collectionStore?.GetCollection?.("type-games") ??
      collectionStore?.allGamesCollection ??
      collectionStore?.allAppsCollection;
    const games = c?.allApps ?? [];
    // Non-game applications/tools are offered on the "apps"/"media" screens.
    let apps: any[] = [];
    try {
      const all = collectionStore?.allAppsCollection?.allApps ?? [];
      apps = all.filter((a: any) => a?.app_type === APP_TYPE_APPLICATION); // tools/runtimes (Proton…) are left out
    } catch {
      /* ignore */
    }
    return [...games, ...apps];
  },
  collections() {
    const out: { id: string; name: string; apps: any[] }[] = [];
    const fav = collectionStore?.GetCollection?.("favorite");
    if (fav) out.push({ id: "favorite", name: fav.displayName || "Favorites", apps: fav.allApps ?? fav.visibleApps ?? [] });
    for (const c of collectionStore?.userCollections ?? []) {
      if (!c?.id || c.id === "favorite" || c.id === "hidden" || out.some((o) => o.id === c.id)) continue;
      out.push({ id: String(c.id), name: c.displayName || String(c.id), apps: c.allApps ?? c.visibleApps ?? [] });
    }
    return out;
  },
};

let source: LibrarySource = steamSource;
/** Preview harness hook. */
export function setLibrarySource(s: LibrarySource) {
  source = s;
  cache = null;
}

export interface Library {
  games: Game[]; // the selected source, sorted (games only)
  apps: Game[]; // non-game applications
  all: Game[]; // every game, sorted
  byId: Map<number, Game>;
  collections: Collection[];
}

let cache: { key: string; at: number; lib: Library } | null = null;

export function loadLibrary(src: string, sort: SortMode, max: number): Library {
  const key = `${src}|${sort}|${max}`;
  if (cache && cache.key === key && Date.now() - cache.at < 4000) return cache.lib;
  let lib: Library;
  try {
    const every = (source.allApps() ?? []).map(toGame).filter(Boolean) as Game[];
    const games = every.filter((g) => g.kind === "game");
    const apps = sortGames(
      every.filter((g) => g.kind === "app"),
      "alpha",
    );
    const byId = new Map<number, Game>();
    every.forEach((g) => byId.set(g.appid, g));
    const collections: Collection[] = (source.collections() ?? []).map((c) => ({
      id: c.id,
      name: c.name,
      games: sortGames((c.apps.map((a) => byId.get(a?.appid) ?? toGame(a)).filter(Boolean) as Game[]), sort),
    }));
    let chosen: Game[];
    if (src.startsWith("col:")) chosen = collections.find((c) => c.id === src.slice(4))?.games ?? [];
    else if (src === "all") chosen = games;
    else chosen = games.filter((g) => g.installed);
    lib = {
      games: sortGames(chosen, sort).slice(0, max),
      apps,
      all: sortGames(games, sort),
      byId,
      collections: collections.filter((c) => c.games.length > 0),
    };
  } catch (e) {
    console.error("[DeckHomeThemes] library read failed", e);
    lib = { games: [], apps: [], all: [], byId: new Map(), collections: [] };
  }
  cache = { key, at: Date.now(), lib };
  return lib;
}

export function listCollectionsForSettings(): { id: string; name: string; count: number }[] {
  try {
    return (source.collections() ?? []).map((c) => ({ id: c.id, name: c.name, count: c.apps.length }));
  } catch {
    return [];
  }
}

// ───────────── actions ─────────────
let previewActions: { launch?: (g: Game) => void; nav?: (what: string) => void } = {};
export function setPreviewActions(a: typeof previewActions) {
  previewActions = a;
}

export function launchGame(g: Game) { beginLaunch(g,previewActions.launch); }

export function openGamePage(g: Game) {
  if (openDestination({place:"game",game:g})) return;
  if (previewActions.nav) return previewActions.nav(`game:${g.appid}`);
  try {
    Navigation.Navigate(`/library/app/${g.appid}`);
  } catch {
    /* ignore */
  }
}

export type SteamPlace =
  | "library"
  | "store"
  | "friends"
  | "settings"
  | "downloads"
  | "media"
  | "search"
  | "power"
  | "mainmenu"
  | "qam"
  | "browser"
  | "community"
  | "cloud"
  | "notifications";

/** The home sets this so "store" opens the themed store instead of Steam's. */
let storeOpener: (() => void) | null = null;
export function setStoreOpener(f: (() => void) | null) {
  storeOpener = f;
}
export function openSteam(place: SteamPlace | "steamstore") {
  if (place === "store" && storeOpener) return storeOpener();
  if (place !== "steamstore" && place !== "store" && !(place === "library" && getSettings().theme === "ps2") && openDestination({place})) return;
  if (place === "steamstore") place = "store";
  if (previewActions.nav) return previewActions.nav(place);
  try {
    switch (place) {
      case "library":
        return Navigation.NavigateToLibraryTab();
      case "store":
        return Navigation.NavigateToSteamWeb("https://store.steampowered.com/");
      case "friends":
        return Navigation.NavigateToChat();
      case "settings":
        return Navigation.Navigate("/settings");
      case "downloads":
        return Navigation.Navigate("/downloads");
      case "media": {
        const route = findMediaRoute();
        if (route) return Navigation.Navigate(route);
        try {
          return SteamClient.URL.ExecuteSteamURL("steam://open/screenshots");
        } catch {
          return Navigation.Navigate("/media");
        }
      }
      case "search":
        return Navigation.Navigate("/search");
      case "power":
        return Navigation.OpenPowerMenu();
      case "mainmenu":
        return Navigation.OpenMainMenu();
      case "qam":
        return Navigation.OpenQuickAccessMenu();
      case "browser":
        return Navigation.NavigateToExternalWeb("https://www.google.com/");
      case "community":
        return Navigation.NavigateToSteamWeb("https://steamcommunity.com/");
      case "cloud":
        return Navigation.Navigate("/settings/cloud");
      case "notifications":
        return (Navigation as any).OpenQuickAccessMenu(0); // QuickAccessTab.Notifications
    }
  } catch (e) {
    console.error("[DeckHomeThemes] navigation failed", place, e);
  }
}

/** Achievement progress Steam already has cached for the library (no network). */
let previewAch: ((appid: number) => { unlocked: number; total: number } | null) | null = null;
export function setPreviewAchievements(f: typeof previewAch) {
  previewAch = f;
}
export function achievements(g: Game | undefined): { unlocked: number; total: number } | null {
  if (!g) return null;
  if (previewAch) return previewAch(g.appid);
  try {
    const c: any = (globalThis as any).appAchievementProgressCache;
    const e = c?.m_achievementProgress?.mapCache?.get?.(g.appid) ?? c?.GetAchievementProgress?.(g.appid);
    if (e && typeof e === "object" && Number(e.total) > 0) return { unlocked: Number(e.unlocked) || 0, total: Number(e.total) };
  } catch {
    /* ignore */
  }
  return null;
}

export function openAchievements(g: Game) {
  if (openDestination({place:"achievements",game:g})) return;
  if (previewActions.nav) return previewActions.nav(`achievements:${g.appid}`);
  try {
    Navigation.Navigate(`/library/app/${g.appid}/achievements/my/individual`);
  } catch {
    openGamePage(g);
  }
}

// ───────────── formatting helpers ─────────────
export function fmtPlaytime(min: number): string {
  if (!min) return "Never played";
  if (min < 60) return `${min} min played`;
  const h = min / 60;
  return `${h < 10 ? h.toFixed(1) : Math.round(h)} hrs played`;
}

export function fmtLastPlayed(t: number): string {
  if (!t) return "—";
  const d = new Date(t * 1000);
  const days = Math.floor((Date.now() - d.getTime()) / 86400000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 30) return `${days} days ago`;
  return d.toLocaleDateString();
}
