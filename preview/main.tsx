import { beginLaunch, dismissLaunch, launchState } from "../src/launch";
import { autoPack, packFile } from "../src/steam";
// Browser preview of every theme with an invented sample library.
import { createRoot } from "react-dom/client";
import { useEffect, useState } from "react";
import { ThemedHome } from "../src/Home";
import { openSteam as openSteamPreview, setLibrarySource, setPreviewAchievements, setPreviewActions, openGamePage, launchGame, loadLibrary as loadLibraryPreview } from "../src/library";
import { getSettings, seedSettings, THEMES, updateSettings, useSettings, ThemeId } from "../src/settings";
import { refreshPacks, setPreviewBattery, setPreviewSound, setPreviewStatus, setPreviewUser, setWallpaperOverride, soundDiag } from "../src/steam";
import { setPreviewTier } from "../src/badges";
import { setPreviewShots, setPreviewTrailer } from "../src/media";
import { setPreviewStore } from "../src/store";

const themedPreview = (window as any).__themePreview as ThemeId | undefined;
const referenceArt = (window as any).__referenceArt as Record<string, {portrait:string[];hero?:string[];logo?:string[]}> | undefined;
const referenceTitles: string[] | undefined = (window as any).__referenceTitles;
const TITLES = [
  "Starfall Odyssey", "Neon Drift", "Hollow Lantern", "Tidebreaker", "Copper Kingdoms", "Pixel Pilgrim", "Frostline Rally", "The Last Orchard",
  "Moonlit Arcana", "Skyward Couriers", "Iron Petal", "Echoes of Vael", "Garden of Gears", "Riftrunner", "Paper Samurai", "Deep Signal",
  "Lumen Tactics", "Wild Harbor", "Clockwork Choir", "Ember Trail", "Velvet Circuit", "Northbound", "Glass Meridian", "Saltmarsh Saga",
  "Hexfall Arena", "Quiet Engines", "Aurora Post", "Cinder & Sage", "Byte Bandits", "Sunken Spire", "Petal Storm", "Orbit Gardener",
];
function hue(s: string) {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}
function svg(w: number, h: number, body: string) {
  return "data:image/svg+xml;utf8," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`);
}
function art(name: string, i: number) {
  if (referenceArt?.[name]) {
    const a = referenceArt[name];
    return {portrait:a.portrait,landscape:a.portrait,hero:a.hero ?? a.portrait,logo:a.logo ?? []};
  }
  const a = hue(name);
  const b = (a + 50 + (i % 3) * 40) % 360;
  const grad = `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="hsl(${a},65%,45%)"/><stop offset="1" stop-color="hsl(${b},70%,18%)"/></linearGradient><radialGradient id="r" cx=".7" cy=".3" r=".6"><stop offset="0" stop-color="hsl(${(a + 180) % 360},90%,75%)" stop-opacity=".8"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient></defs>`;
  const shapes = (w: number, h: number) =>
    `<rect width="${w}" height="${h}" fill="url(#g)"/><rect width="${w}" height="${h}" fill="url(#r)"/>` +
    `<path d="M0 ${h * 0.78} Q ${w * 0.3} ${h * 0.6} ${w * 0.55} ${h * 0.75} T ${w} ${h * 0.68} V ${h} H 0z" fill="hsl(${b},50%,10%)" opacity=".75"/>` +
    `<circle cx="${w * 0.72}" cy="${h * 0.32}" r="${Math.min(w, h) * 0.16}" fill="hsl(${(a + 30) % 360},90%,80%)" opacity=".85"/>`;
  const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;");
  const text = (w: number, h: number, size: number, y: number) =>
    `<text x="${w / 2}" y="${y}" font-family="Georgia, serif" font-weight="700" font-size="${size}" fill="#fff" text-anchor="middle" style="paint-order:stroke" stroke="rgba(0,0,0,.45)" stroke-width="${size / 10}">${esc(name)}</text>`;
  return {
    portrait: [svg(600, 900, grad + shapes(600, 900) + text(600, 900, name.length > 14 ? 52 : 64, 170))],
    landscape: [svg(460, 215, grad + shapes(460, 215) + text(460, 215, name.length > 14 ? 30 : 36, 120))],
    hero: [svg(1920, 620, grad + shapes(1920, 620))],
    logo: [svg(900, 260, `<text x="10" y="180" font-family="Georgia, serif" font-weight="700" font-size="${name.length > 14 ? 96 : 120}" fill="#fff" style="paint-order:stroke" stroke="rgba(0,0,0,.4)" stroke-width="8">${esc(name)}</text>`)],
  };
}
const now = Math.floor(Date.now() / 1000);
const apps = (referenceTitles ?? TITLES).map((name, i) => ({
  appid: 1000 + i,
  app_type: 1,
  display_name: name,
  rt_last_time_played: now - i * 86400 * 1.7 - (i % 5) * 3600,
  minutes_playtime_forever: ((i * 7919) % 6000) + (i % 4 === 0 ? 0 : 30),
  installed: i % 4 !== 3,
  steam_deck_compat_category: [3, 2, 3, 1, 0][i % 5],
  __art: art(name, i),
}));
const tools = ["Retro Emulator Hub", "Desktop Streamer"].map((name, i) => ({ appid: 5000 + i, app_type: 2, display_name: name, installed: true, __art: art(name, i) }));

// Feed the library reader with the fake apps; art comes from __art.
(globalThis as any).appStore = {
  GetCustomVerticalCapsuleURLs: (a: any) => a.__art?.portrait,
  GetCustomLandcapeImageURLs: (a: any) => a.__art?.landscape,
  GetCustomHeroImageURLs: (a: any) => a.__art?.hero,
  GetCustomLogoImageURLs: (a: any) => a.__art?.logo,
};
setLibrarySource({
  allApps: () => new URLSearchParams(location.search).has("empty") ? [] : (themedPreview ? apps : [...apps, ...tools]).slice(0, Number(new URLSearchParams(location.search).get("count")) || 1000),
  collections: () => [
    { id: "favorite", name: "Favorites", apps: apps.filter((_, i) => i % 6 === 1) },
    { id: "rpg", name: "RPGs", apps: apps.filter((_, i) => i % 5 === 2) },
  ],
});
setPreviewUser("DeckPlayer");
// sample store data (the real store is fetched from Steam on the Deck)
{
  const STORE_NAMES = ["Skyforge Tactics", "Lantern Harbor", "Neon Courier", "Echo Valley", "Frost Line", "Copper Gears", "Moonlit Market", "Tidal Runner", "Ember Saga", "Pixel Caravan", "Starbound Post", "Orchard Story"];
  const mk = (n: string, i: number, extra: any = {}) => ({ id: 900000 + i, name: n, header: (art(n, i + 3) as any).landscape[0], capsule: (art(n, i + 3) as any).hero[0], price: [1999, 2999, 999, 4999, 1499][i % 5], original: i % 3 === 0 ? [2999, 3999, 1999, 5999, 2499][i % 5] : undefined, discount: i % 3 === 0 ? [33, 25, 50, 17, 40][i % 5] : 0, currency: "USD", ...extra });
  const all = STORE_NAMES.map((n, i) => mk(n, i));
  const owned = apps.slice(0, 2).map((a, i) => ({ id: a.appid, name: a.display_name, header: a.__art.landscape[0], capsule: a.__art.hero[0], price: 1999, currency: "USD", discount: 0, ...(i ? {} : {}) }));
  setPreviewStore({
    lists: { featured: [...all.slice(0, 6), ...owned], specials: all.filter((x) => x.discount), top: [...all].reverse(), new: all.slice(4), soon: all.slice(2, 8).map((x) => ({ ...x, soon: true, price: undefined })) },
    search: (q) => all.filter((x) => x.name.toLowerCase().includes(q.toLowerCase())),
    details: (id) => {
      const it = [...all, ...owned].find((x) => x.id === id);
      if (!it) return null;
      return { id, name: it.name, short: "A hand-made sample description so the store page can be tried in the browser preview. On the Deck this text, the price, screenshots and trailer come straight from the Steam Store.", header: it.header, screenshots: [it.capsule, it.header, it.capsule], genres: ["Adventure", "Indie"], release: "Oct 5, 2026", developers: ["Sample Studio"], publishers: ["Sample Studio"], priceText: "$" + ((it.price ?? 0) / 100).toFixed(2), originalText: it.original ? "$" + (it.original / 100).toFixed(2) : undefined, discount: it.discount, free: false, hasTrailer: true, platforms: ["windows", "linux"] };
    },
  });
  (window as any).__previewPrompt = () => "lantern";
  (window as any).__openStore = () => openSteamPreview("store");
}
(window as any).__soundDiag = (t: any) => soundDiag(t);
(window as any).__refreshPacks = () => refreshPacks();
setWallpaperOverride((n) => (window as any).__testWalls?.[n] ?? null);
setPreviewStatus({ friendsOnline: 3, notifications: 2, downloads: 0, online: true });
setPreviewAchievements((id) => (id % 3 === 2 ? null : { unlocked: (id * 7) % 40, total: 57 }));
// sample screenshots (drawn) and an optional local test trailer (?trailer=http://…/dash_h264.mpd)
setPreviewShots(
  apps.slice(0, 7).flatMap((a, k) => [0, 1, 2].slice(0, (k % 3) + 1).map((n) => ({ appid: a.appid, url: a.__art.hero[0], created: now - (k * 3 + n) * 7200, caption: "", w: 1280, h: 800 }))),
);
if (new URLSearchParams(location.search).get("trailer")) setPreviewTrailer(() => ({ name: "Test", thumb: "", mpd: new URLSearchParams(location.search).get("trailer")! }));
setPreviewTier((id) => (["platinum", "gold", "silver", "bronze", "borked", "native"] as const)[id % 6]);
setPreviewBattery({ level: 0.72, charging: false });
if (!new URLSearchParams(location.search).get("realsound")) setPreviewSound((kind,variation=0) => {
  const settings = getSettings();
  if(settings?.theme === "republic"){
    const names:Record<string,string>={move:"move",tile:"move",tab:variation%2?"tab_alt":"tab",end:"error",select:"confirm",launch:"confirm",toggle:"slider",open:"confirm",back:"back",menu:"confirm",close:"back"};
    const audio=new Audio(`../bundle/sounds/DHT%20Verified%20Republic/${names[kind]}.wav`);audio.volume=Math.max(0,Math.min(1,(settings.sfxVolume??80)/100));audio.play().catch(()=>{});return;
  }
  if(settings?.theme === "castle"){
    const names:Record<string,string>={move:"MenuTick",tile:"MenuTick",tab:"MenuTick",end:"MenuTick",select:"ConfirmSound",launch:"ConfirmSound",toggle:"ConfirmSound",open:"ConfirmSound",back:"BackSound",menu:"EnterMenu",close:"ExitMenu"};
    const audio=new Audio((window as any).__castleAudio?.[names[kind]+".wav"]);audio.volume=Math.max(0,Math.min(1,(settings.sfxVolume??80)/100));audio.play().catch(()=>{});return;
  }
  if(settings?.theme !== "x360" || settings?.x360?.style !== "blades") return;
  const names:Record<string,string>={move:"cursor",tile:"cursor",select:"select",open:"tier2_enter",back:"back",launch:"select",menu:"guide_open",close:"guide_close",toggle:"select",end:"silence"};
  const file=kind==="tab"?`bladeslide_${variation%4+1}`:names[kind];
  const audio=new Audio((window as any).__bladesAudio?.[file+".wav"]);audio.volume=Math.max(0,Math.min(1,(settings.sfxVolume??80)/100));audio.play().catch(()=>{});
});

const params = new URLSearchParams(location.search);
const initialTheme = (params.get("theme") as ThemeId) || themedPreview || "vita";
seedSettings({
  theme: initialTheme,
  tvMode: params.get("tvMode")==="1",
  source: "all",
  vita: { folders: [{ id: "f1", name: "Adventures", apps: [1003, 1007, 1011, 1015], color: "#f5a623" }], order: [], collectionFolders: true, systemBubbles: true, art: "portrait", skin: params.get("vskin") ?? "", bubbleStyle: (params.get("bs") as any) ?? "lens" },
  animations: params.get("still") ? false : true,
  xmb: { ps3Color: -1, pspColor: -1, collectionFolders: true, p3t: params.get("p3t") ?? "" },
  trailers: { preview: true, sound: false, video: params.get("tv") === "1" },
  x360: { style: (params.get("xs") as any) ?? "metro" },
});
(globalThis as any).__previewSettings = null;

Object.assign(window,{__beginNativeLaunch:beginLaunch,__dismissLaunch:dismissLaunch,__launchState:launchState,__autoPack:autoPack,__packFile:packFile,__refreshPacks:refreshPacks,__openPlace:openSteamPreview,__updateTheme:updateSettings,__openGame:(id:number)=>openGamePage((window as any).__libraryGame(id)),__launchGame:launchGame});
(window as any).__libraryGame=(id:number)=>loadLibraryPreview("all","recent",400).byId.get(id);
function Toast() {
  const [msg, setMsg] = useState("");
  useEffect(() => {
    let t: any;
    (window as any).__previewToast = (m: string) => {
      setMsg(m);
      clearTimeout(t);
      t = setTimeout(() => setMsg(""), 2200);
    };
  }, []);
  if (!msg) return null;
  return <div style={{ position: "fixed", left: "50%", bottom: 24, transform: "translateX(-50%)", background: "#111c", color: "#fff", padding: "10px 18px", borderRadius: 8, font: "14px system-ui", zIndex: 99999 }}>{msg}</div>;
}
setPreviewActions({
  launch: (g) => (window as any).__previewToast?.(`▶ Launching ${g.name}`),
  nav: (w) => (window as any).__previewToast?.(w.startsWith("game:") ? `Steam game page (${w.slice(5)})` : `Steam → ${w}`),
});

function App() {
  const s = useSettings();
  const [size, setSize] = useState({ w: 1280, h: 800 });
  useEffect(() => {
    const fit = () => {
      const availW = window.innerWidth - 24;
      const availH = window.innerHeight - 70;
      const ah = Number(new URLSearchParams(location.search).get("h")) || 800; // ?h=960 previews a 4:3 screen
      const k = Math.min(availW / 1280, availH / ah, 1.5);
      setSize({ w: Math.round(1280 * k), h: Math.round(ah * k) });
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);
  return (
    <div style={{ font: "14px system-ui", color: "#ddd" }}>
      <div id="bar" style={{ display: "flex", gap: 6, alignItems: "center", padding: "10px 12px", flexWrap: "wrap" }}>
        <b style={{ marginRight: 8 }}>Deck Home Themes preview</b>
        {THEMES.map((t, i) => (
          <button key={t.id} onClick={() => updateSettings({ theme: t.id })} style={{ padding: "5px 10px", borderRadius: 6, border: 0, cursor: "pointer", background: s.theme === t.id ? "#3d8bfd" : "#333", color: "#fff" }}>
            {i + 1}. {t.name}
          </button>
        ))}
        <span style={{ opacity: 0.65, marginLeft: 10 }}>Arrows = D-pad · Enter = Ⓐ · Esc = Ⓑ · X · Y = △/Options · M = ≡ · Q/E = L1/R1 · Z/C = L2/R2 (presets)</span>
      </div>
      <div style={{ position: "relative", width: size.w, height: size.h, margin: "0 12px", transform: "translateZ(0)", overflow: "hidden", borderRadius: 10, boxShadow: "0 10px 40px #000" }}>
        <ThemedHome standalone />
      </div>
      <Toast />
    </div>
  );
}

window.addEventListener("keydown", (e) => {
  const n = Number(e.key);
  if (n >= 1 && n <= THEMES.length) updateSettings({ theme: THEMES[n - 1].id });
});
createRoot(document.getElementById("root")!).render(<App />);
