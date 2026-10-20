import { BundledThemeSurface, hasBundledRenderer, NativeThemePort } from "./BundledThemeSurface";
import { frameRoute, FrameRoute } from "./frameNavigation";
import { ensureThemeAudio } from "../audioDownloads";
import { callable } from "@decky/api";
// HTML theme host: compiled native surfaces for trusted bundled themes, isolated frames for imported HTML.
//
// The interface is an HTML page from the theme's folder. It runs in an iframe
// with sandbox="allow-scripts" and no allow-same-origin, so it gets an opaque
// origin: it can't read this page, Steam's page or SteamClient, and has no
// cookies or storage. The plugin's server adds a Content-Security-Policy to the
// page (see py_modules/data_themes.py: frame_csp) that blocks every network
// request. connect-src doesn't cover navigation, so the iframe here opens the
// plugin's wrapper page (data_themes.py: frame_wrapper), which holds the theme
// page in a second sandboxed frame whose frame-src allows only the theme's own
// folder: the interface can't carry the library away by navigating itself.
// The wrapper only passes messages through in both directions.
//
// It talks to the engine only through postMessage, with the short list of
// messages below (docs/THEME-FORMAT.md describes them for theme authors).
// Every request is checked here; the worst a theme can do is look bad or
// launch one of the user's own games.
import { useEffect, useMemo, useRef, useState } from "react";
import { useHome } from "../common";
import { Btn, Hints, Press, ThemeRoot } from "../input";
import { Game, openSteam, SteamPlace } from "../library";
import { getSettings, updateSettings } from "../settings";
import { fmtTime, playSound, SOUND_FILES, SoundKind, useSteamStatus } from "../steam";
import { activeTheme, iconMap, slotAccent, slotUrl, frameUrl, themeFileUrl } from "./registry";
import { themeAudioBands } from "../themeAudio";
import { useDownloads } from "../downloads";
import { framePageRequest } from "./framePages";
import { useReportFocus } from "../focus";

export const FRAME_PROTOCOL = 1;
const ensureMedia=callable<[id:string],{success:boolean;error?:string}>("ensure_frame_media");
const BUTTONS: Btn[] = ["up", "down", "left", "right", "a", "b", "x", "y", "menu", "l1", "r1"];
const PLACES: SteamPlace[] = ["library", "store", "friends", "settings", "downloads", "search", "power", "mainmenu"];
const MAX_SAVE = 64 * 1024;

/** What an interface may know about a game: no Steam objects, only plain data. */
function publicGame(g: Game, abs: (u: string) => string) {
  const art = (list: string[]) => [...new Set(list)].map(abs);
  return {
    appid: g.appid,
    gameid: g.gameid,
    shortcut: g.shortcut,
    name: g.name,
    installed: g.installed,
    lastPlayed: g.lastPlayed,
    playtime: g.playtime,
    kind: g.kind,
    art: { portrait: art(g.art.portrait), landscape: art(g.art.landscape), hero: art(g.art.hero), logo: art(g.art.logo) },
  };
}

export function FrameHome() {
  const api = useHome();
  const downloads = useDownloads();
  const status = useSteamStatus();
  const requests = useRef({ at: 0, count: 0, pending: 0 });
  const theme = activeTheme(api.settings);
  const [media,setMedia]=useState<{id?:string;ready:boolean;error?:string}>({ready:false});
  const [mediaAttempt,setMediaAttempt]=useState(0);
  useEffect(()=>{
    let alive=true;
    setMedia({id:theme?.id,ready:theme?.source!=="bundled"});
    if(theme?.source==="bundled")void Promise.all([ensureMedia(theme.id),ensureThemeAudio(theme.id)]).then(([result,audioReady])=>{if(alive)setMedia({id:theme.id,ready:result.success&&audioReady,error:result.error||(!audioReady?"Could not download theme audio. Please retry.":undefined)});}).catch(error=>{if(alive)setMedia({id:theme.id,ready:false,error:String(error)});});
    return()=>{alive=false;};
  },[theme?.id,theme?.source,mediaAttempt]);
  const frameAvailable=theme?.source!=="bundled"||(media.id===theme.id&&media.ready);
  const frame = useRef<HTMLIFrameElement>(null);
  const nativePort=useRef<NativeThemePort|null>(null);
  const nativeReceive=useRef<((message:Record<string,unknown>)=>void)|null>(null);
  const isNative=theme?.source==="bundled"&&hasBundledRenderer(theme.id);
  const [ready, setReady] = useState<{ handles: Set<Btn>; textInput: boolean } | null>(null);
  const [hints, setHints] = useState<Hints>({});
  const [focusedAppid, setFocusedAppid] = useState<number | null>(null);
  useReportFocus(focusedAppid === null ? undefined : api.lib.byId.get(focusedAppid));
  const lastLaunch = useRef(0);
  const entry = theme?.frame?.entry ?? "index.html";
  const [routes, setRoutes] = useState<FrameRoute[]>([]);
  const route = routes[routes.length - 1] ?? { path: entry, fragment: "", params: {} };
  const generation = useRef(0), client = useRef<string | null>(null);
  const [pageError, setPageError] = useState(false);
  const [reload, setReload] = useState(0);
  const changeRoute = (next: FrameRoute | null, replace = false) => {
    if (!next) return;
    generation.current++; setPageError(false);
    if (next.path !== route.path) { setReady(null); setHints({}); setFocusedAppid(null); client.current = null; }
    setRoutes(prev => replace ? [...prev.slice(0, -1), next] : [...(prev.length ? prev : [{ path: entry, fragment: "", params: {} }]), next].slice(-32));
  };
  const back = () => {
    if (routes.length <= 1) return false;
    generation.current++; setPageError(false);
    if (routes[routes.length - 2]?.path !== route.path) { setReady(null); setHints({}); setFocusedAppid(null); client.current = null; }
    setRoutes(prev => prev.slice(0, -1)); return true;
  };
  const url = theme?.frame ? frameUrl(theme, route.path) : null; // the wrapper page, never the theme page directly

  const post = (msg: Record<string, unknown>) => {
    try {
      (isNative?nativePort.current:frame.current?.contentWindow)?.postMessage({ dht: FRAME_PROTOCOL, ...msg, ...(msg.type === "state" ? { active: !((nativePort.current?.ownerDocument??frame.current?.ownerDocument)?.hidden ?? false) && !api.busy } : {}), clientId: client.current }, "*");
    } catch {
      /* the frame went away */
    }
  };

  // What the interface receives: games, a few settings, and its own saved data.
  const state = useMemo(() => {
    const doc = nativePort.current?.ownerDocument ?? frame.current?.ownerDocument ?? document;
    const abs = (u: string) => {
      try {
        return new URL(u, doc.baseURI).href;
      } catch {
        return "";
      }
    };
    const s = api.settings;
    return {
      theme: theme ? { id: theme.id, name: theme.name } : null,
      user: api.user,
      avatar: status.avatar ?? null,
      settings: { clock24: s.clock24, animations: s.animations, sounds: s.sounds, tvMode: s.tvMode, accent: slotAccent(s) ?? null },
      // the theme's slots after mix and match: files from data themes only
      slots: { wallpaper: slotUrl("wallpaper", s) ?? null, bootVideo: slotUrl("bootVideo", s) ?? null, launchVideo: slotUrl("launchVideo", s) ?? null, font: slotUrl("font", s) ?? null, icons: iconMap(s) },
      games: api.lib.games.map((g) => publicGame(g, abs)),
      apps: api.lib.apps.map((g) => publicGame(g, abs)),
      collections: api.lib.collections.map((c) => ({ id: c.id, name: c.name, appids: c.games.map((g) => g.appid) })),
      saved: theme ? s.frameData[theme.id] ?? null : null,
      busy: api.busy,
      route: { ...route, canGoBack: routes.length > 1 },
      active: !((nativePort.current?.ownerDocument??frame.current?.ownerDocument)?.hidden ?? false) && !api.busy,
      capabilities: { pages: 1, audio: 1, focus: 1, navigation: 1, lifecycle: 1, savePatch: 1 },
    };
  }, [api.lib, api.settings, api.user, api.busy, status.avatar, theme?.id, ready, routes]);

  useEffect(() => {
    if (ready) post({ type: "state", ...state });
  }, [state]);

  // The same bounded spectrum is available to every frame theme.
  useEffect(() => {
    if (!ready) return;
    const doc = nativePort.current?.ownerDocument ?? frame.current?.ownerDocument ?? document;
    let timer: ReturnType<typeof setInterval> | undefined;
    const sync = () => {
      clearInterval(timer); timer = undefined;
      const active = !doc.hidden && !api.busy;
      post({ type: "lifecycle", active });
      if (active) timer = setInterval(() => post({ type: "audio", bands: themeAudioBands() }), 50);
    };
    sync(); doc.addEventListener("visibilitychange", sync);
    return () => { clearInterval(timer); doc.removeEventListener("visibilitychange", sync); };
  }, [ready, theme?.id, url, api.busy]);

  // Messages from the interface. Only our own iframe is listened to.
  useEffect(() => {
    if (!frameAvailable) return;
    const view = frame.current?.ownerDocument.defaultView ?? window;
    const find = (appid: unknown) => (typeof appid === "number" ? api.lib.byId.get(appid) : undefined);
    const onMessage = (e: MessageEvent) => {
      if (!isNative&&(!frame.current || e.source !== frame.current.contentWindow)) return;
      const m = e.data;
      if (!m || typeof m !== "object" || m.dht !== FRAME_PROTOCOL || typeof m.type !== "string") return;
      if (m.type !== "ready" && client.current && m.clientId !== client.current) return;
      switch (m.type) {
        case "navigate": {
          const next = frameRoute(m.path, route.path, m.params ?? {});
          if (!next) { post({ type: "navigationError", error: "Choose an HTML page inside this theme." }); return; }
          changeRoute(next, m.replace === true); return;
        }
        case "back": { back(); return; }
        case "savePatch": {
          if (!theme || !m.data || typeof m.data !== "object" || Array.isArray(m.data)) return;
          updateSettings(p => {
            const data = { ...(p.frameData[theme.id] ?? {}), ...m.data };
            try { if (JSON.stringify(data).length > MAX_SAVE) return {}; } catch { return {}; }
            return { frameData: { ...p.frameData, [theme.id]: data } };
          }); return;
        }
        case "focus": {
          if (m.appid === null) setFocusedAppid(null);
          else if (find(m.appid)) setFocusedAppid(m.appid);
          return;
        }
        case "pageRequest": {
          if (!Number.isSafeInteger(m.requestId) || typeof m.op !== "string") return;
          const budget = requests.current;
          if (Date.now() - budget.at > 1000) { budget.at = Date.now(); budget.count = 0; }
          if (++budget.count > 12 || budget.pending >= 4) {
            post({ type: "pageResult", requestId: m.requestId, error: "Too many page requests. Try again." }); return;
          }
          budget.pending++;
          const target = frame.current?.contentWindow, requestGeneration = generation.current;
          void framePageRequest(m.op, m.args, api, downloads).then(
            data => { if (target === frame.current?.contentWindow && requestGeneration === generation.current) post({ type: "pageResult", requestId: m.requestId, data }); },
            () => { if (target === frame.current?.contentWindow && requestGeneration === generation.current) post({ type: "pageResult", requestId: m.requestId, error: "Could not load this data. Please try again." }); }
          ).finally(() => { budget.pending--; });
          return;
        }
        case "ready": {
          const id = typeof m.clientId === "string" ? m.clientId.slice(0, 100) : null;
          if (client.current !== id) generation.current++;
          client.current = id;
          setPageError(false);
          const handles = new Set<Btn>((Array.isArray(m.handles) ? m.handles : []).filter((b: unknown): b is Btn => BUTTONS.includes(b as Btn)));
          setReady({ handles, textInput: m.textInput === true });
          post({ type: "state", ...state });
          return;
        }
        case "hints": {
          const h: Hints = {};
          for (const k of ["a", "x", "y", "menu"] as const) if (typeof m[k] === "string") h[k] = m[k].slice(0, 24);
          setHints(h);
          return;
        }
        case "sound":
          if (typeof m.name === "string" && m.name in SOUND_FILES) playSound(m.name as SoundKind);
          return;
        case "launch": {
          const g = find(m.appid);
          if (!g || Date.now() - lastLaunch.current < 1500) return;
          lastLaunch.current = Date.now();
          api.activate(g, () => api.launch(g));
          return;
        }
        case "details": {
          const g = find(m.appid);
          if (g) api.details(g);
          return;
        }
        case "open":
          if (m.place === "options") api.openSettings();
          else if (m.place === "steamHome") api.showSteamHome();
          else if (PLACES.includes(m.place)) openSteam(m.place);
          return;
        case "save": {
          if (!theme) return;
          let size = Infinity;
          try {
            size = JSON.stringify(m.data ?? null).length;
          } catch {
            /* not plain data */
          }
          if (size <= MAX_SAVE) {
            if (find(m.data?.lastAppid)) setFocusedAppid(m.data.lastAppid);
            updateSettings((p) => ({ frameData: { ...p.frameData, [theme.id]: m.data ?? null } }));
          }
          return;
        }
      }
    };
    if(isNative){nativeReceive.current=message=>onMessage({data:message} as MessageEvent);return()=>{nativeReceive.current=null;};}
    view.addEventListener("message", onMessage);
    return () => view.removeEventListener("message", onMessage);
  }, [api, state, theme?.id, downloads, routes, frameAvailable, isNative]);

  // Legacy interfaces return focus to the host. Interfaces with their own DOM
  // keyboard handler opt in to textInput so search/editor fields keep focus.
  useEffect(() => {
    const el = frame.current;
    const view = el?.ownerDocument?.defaultView;
    if (!el || !view || ready?.textInput) return;
    const onBlur = () => setTimeout(() => {
      if (el.ownerDocument.activeElement === el) el.blur();
    }, 0);
    view.addEventListener("blur", onBlur);
    return () => view.removeEventListener("blur", onBlur);
  }, [url, ready?.textInput]);

  useEffect(() => { setReady(null); setFocusedAppid(null); }, [url]);
  useEffect(() => { setRoutes([]); setReady(null); setHints({}); setPageError(false); client.current = null; generation.current++; }, [theme?.id, theme?.revision]);
  useEffect(() => {
    if (ready || !url || !frameAvailable || isNative) return;
    const timer = setTimeout(() => setPageError(true), 8000);
    return () => clearTimeout(timer);
  }, [url, ready, reload, frameAvailable, isNative]);

  const onInput = (p: Press) => {
    if (p.btn === "b" && (!ready || pageError) && back()) return true;
    if (ready?.handles.has(p.btn)) {
      post({ type: "input", btn: p.btn, repeat: p.repeat });
      return true;
    }
    if (p.btn === "y" || p.btn === "menu") {
      api.openSettings();
      return true;
    }
    return false; // Ⓑ and anything else go back to Steam
  };

  return (
    <ThemeRoot onInput={onInput} hints={{ y: "Options", ...hints }}>
      {pageError && <div role="alert" style={{position:"absolute",inset:0,zIndex:5,background:"#16202bf2",padding:48,color:"white"}}>This page did not connect to ThemeHub.<button onClick={() => { if (!back()) { setPageError(false); setReady(null); client.current = null; generation.current++; setReload(n => n + 1); } }}>Back to a working page</button></div>}
      {!frameAvailable?<div role="status" style={{padding:48,color:"white"}}>{media.error?`Could not download theme media: ${media.error}`:"Downloading theme media…"}{media.error&&<button onClick={()=>setMediaAttempt(n=>n+1)}>Retry download</button>}</div>:isNative&&theme ? (
        <BundledThemeSurface id={theme.id} base={themeFileUrl(theme, "")!} port={nativePort} onMessage={message=>nativeReceive.current?.(message)}/>
      ):url ? (
        <iframe
          ref={frame}
          key={`${url}:${reload}:${theme?.revision ?? ""}`}
          src={url}
          title={theme?.name ?? "Community theme"}
          // allow-scripts only: an opaque origin, no forms, popups, navigation of the top page, or storage
          sandbox="allow-scripts"
          referrerPolicy="no-referrer"
          allow=""
          tabIndex={-1}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: 0, background: "#000" }}
        />
      ) : (
        <FrameMissing name={theme?.name} />
      )}
    </ThemeRoot>
  );
}

function FrameMissing({ name }: { name?: string }) {
  const s = getSettings();
  return (
    <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", background: "#101216", color: "#d6d9de", font: '20px "Motiva Sans", Arial, sans-serif', textAlign: "center", padding: 40 }}>
      <div>
        <div style={{ fontSize: 28, marginBottom: 12 }}>{name ?? "Community interface"}</div>
        <div style={{ opacity: 0.75 }}>This theme's interface couldn't be opened. Pick another look with L1 held + the D-pad or L2 / R2, or press △ / Y for options.</div>
        <div style={{ opacity: 0.5, marginTop: 24, fontSize: 16 }}>{fmtTime(new Date(), s.clock24)}</div>
      </div>
    </div>
  );
}
