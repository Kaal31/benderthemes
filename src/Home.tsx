import {PainHome} from "./themes/Pain";
import {AeroV2Home} from "./themes/AeroV2";
import { Destination, DestinationView, setDestinationOpener } from "./destinations";
import { LaunchView, useLaunchState, dismissLaunch } from "./launch";
// The themed home: builds the shared API every theme uses, picks the theme
// and hosts it in a full-screen layer. Also the switch that decides between
// the themed home and Steam's original one.
import { Navigation } from "@decky/ui";
import { Component, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { HomeApi, HomeCtx } from "./common";
import { Game, launchGame, loadLibrary, openGamePage, openSteam, setStoreOpener } from "./library";
import { getSettings, ThemeId, updateSettings, useSettings, useSettingsLoaded } from "./settings";
import { playSound, refreshPacks, useHiddenFooter, useHiddenHeader, useHomeMusic, userName } from "./steam";
import { currentPresetId, cyclePreset, refreshPresets } from "./presets";
import { bump, diag, reportError } from "./diag";
import { setUiDocument } from "./cssvars";
import { Overlay, ScreenshotGallery, TrailerPlayer, VideoPlayer } from "./overlays";
import { StoreView } from "./storeView";
import { setGlobalInput, StageHost } from "./input";
import { VitaHome } from "./themes/Vita";
import { Ps3Home, PspHome } from "./themes/Xmb";
import { Ps4Home } from "./themes/Ps4";
import { AeroHome } from "./themes/Aero";
import { XboxHome } from "./themes/Xbox";
import { CinematicHome } from "./themes/Cinematic";
import { MinecraftHome } from "./themes/Minecraft";
import { DialHome } from "./themes/Dial";
import { Ps5Home } from "./themes/Ps5";
import { X360Home } from "./themes/X360";
import { Ps2Home } from "./themes/Ps2";

const THEME_COMPONENTS: Record<ThemeId, () => ReactNode> = {
  vita: () => <VitaHome />,
  ps2: () => <Ps2Home />,
  ps3: () => <Ps3Home />,
  psp: () => <PspHome />,
  ps4: () => <Ps4Home />,
  ps5: () => <Ps5Home />,
  x360: () => <X360Home />,
  aero: () => <AeroHome />,
  aero2: () => <AeroV2Home />,
  xbox: () => <XboxHome />,
  dial: () => <DialHome />,
  minecraft: () => <MinecraftHome />,
  pain: () => <PainHome />,
  castle: () => <CinematicHome kind="castle"/>,
  republic: () => <CinematicHome kind="republic"/>,
};

/** Falls back to `fallback` if anything inside throws (e.g. a Steam update). */
export class SafeBoundary extends Component<{ fallback: ReactNode; children: ReactNode; where?: string }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(e: unknown) {
    reportError(this.props.where ?? "render", e);
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

// "Show Steam's home" from inside a theme lasts until the home is left.
let steamHomeShown = false;
const steamHomeListeners = new Set<() => void>();
function setSteamHomeShown(v: boolean) {
  steamHomeShown = v;
  steamHomeListeners.forEach((l) => l());
}
function useSteamHomeShown() {
  const [v, setV] = useState(steamHomeShown);
  useEffect(() => {
    const l = () => setV(steamHomeShown);
    steamHomeListeners.add(l);
    return () => {
      steamHomeListeners.delete(l);
      setSteamHomeShown(false); // leaving the home resets it
    };
  }, []);
  return v;
}
export const showThemedHomeAgain = () => setSteamHomeShown(false);

/** Rendered in place of Steam's home route. */
export function HomeSwitch({ original }: { original: ReactNode }) {
  const s = useSettings();
  const loaded = useSettingsLoaded();
  const steamShown = useSteamHomeShown();
  useEffect(() => bump("homePatchRenders"), []);
  if (!loaded || !s.enabled || steamShown) return <>{original}</>;
  return (
    <SafeBoundary
      where="home"
      fallback={
        <>
          {original}
          <ErrorBanner />
        </>
      }
    >
      <ThemedHome />
    </SafeBoundary>
  );
}

/** Shown over Steam's home when the themed home failed, so it's never silent. */
function ErrorBanner() {
  return (
    <div style={{ position: "fixed", left: 20, right: 20, bottom: 60, zIndex: 50, padding: "10px 16px", borderRadius: 8, background: "rgba(120,20,20,0.9)", color: "#fff", fontSize: 14 }}>
      Deck Home Themes couldn't show the themed home: {diag.lastError || "unknown error"}. Quick Access → Deck Home Themes → Diagnostics has details.
    </div>
  );
}

export function ThemedHome({ standalone }: { standalone?: boolean }) {
  const s = useSettings();
  const root = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<Document | null>(null);
  useEffect(() => {
    setDoc(root.current?.ownerDocument ?? null);
    setUiDocument(root.current?.ownerDocument ?? null);
    bump("themedMounts");
  }, []);

  // Library: re-read on mount and periodically (installs, new plays).
  const [rev, setRev] = useState(0);
  useEffect(() => {
    const iv = setInterval(() => setRev((r) => r + 1), 30000);
    return () => clearInterval(iv);
  }, []);
  const lib = useMemo(() => loadLibrary(s.source, s.sort, s.maxGames), [s.source, s.sort, s.maxGames, rev]);

  useHiddenHeader(doc, s.hideSteamHeader);
  useHiddenFooter(doc, s.footer);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [destination,setDestination] = useState<Destination|null>(null);
  const launching=useLaunchState();
  useEffect(()=>{setDestinationOpener(d=>{if(d.place==="media"){setOverlay({kind:"shots"});setDestination(null);}else{setOverlay(null);setDestination(d);}});return()=>{setDestinationOpener(null);dismissLaunch();};},[]);
  useEffect(()=>{if(overlay)setDestination(null);},[overlay]);

  // L2 / R2 anywhere: previous / next preset, with a banner naming it.
  const [banner, setBanner] = useState<{ text: string; at: number } | null>(null);
  useEffect(() => {
    refreshPresets();
    setGlobalInput((p) => {
      if (p.btn !== "l2" && p.btn !== "r2") return false;
      if (p.repeat) return true;
      const next = cyclePreset(p.btn === "l2" ? -1 : 1);
      playSound("tab");
      setBanner({ text: next.label, at: Date.now() });
      return true;
    });
    return () => setGlobalInput(null);
  }, []);
  useEffect(() => {
    if (!banner) return;
    const t = setTimeout(() => setBanner(null), 1600);
    return () => clearTimeout(t);
  }, [banner?.at]);
  // sound packs can arrive after the first render: re-render once they're known
  const [, setPacksRev] = useState(0);
  useEffect(() => {
    refreshPacks().then(() => setPacksRev((r) => r + 1));
  }, []);
  useHomeMusic(s.theme, !launching && (overlay === null || overlay.kind === "store")); // the store keeps the theme music
  // every theme's "Store" entry opens the themed store (unless turned off in Quick Access)
  useEffect(() => {
    setStoreOpener(() => {
      playSound("open");
      setDestination(null);
      setOverlay({ kind: "store" });
    });
    return () => setStoreOpener(null);
  }, []);

  const api: HomeApi = useMemo(
    () => ({
      lib,
      settings: s,
      activate: (g: Game, themeDefault: () => void) => {
        const a = getSettings().aAction;
        if (a === "launch") launchGame(g);
        else if (a === "details") openGamePage(g);
        else themeDefault();
      },
      launch: (g: Game) => {
        launchGame(g);
      },
      details: (g: Game) => {
        playSound("open");
        openGamePage(g);
      },
      nativeMenu: (g: Game) => setDestination({place:"game",game:g}),
      switchTheme: (id: ThemeId) => {
        playSound("tab");
        updateSettings({ theme: id });
      },
      showSteamHome: () => {
        if (s.theme !== "ps2") {setDestination({place:"mainmenu"});return;}
        if (standalone) {
          try {
            Navigation.Navigate("/library/home");
          } catch {
            /* ignore */
          }
        }
        setSteamHomeShown(true);
      },
      openSettings: () => openSteam("qam"),
      openMedia: (appid?: number, index?: number) => {
        playSound("open");
        setOverlay({ kind: "shots", appid, index });
      },
      playTrailer: (g: Game) => {
        playSound("open");
        setOverlay({ kind: "trailer", game: g });
      },
      playVideo: (v) => {
        playSound("open");
        setOverlay({ kind: "video", video: v });
      },
      user: userName(),
      busy: overlay !== null || destination !== null || launching !== null,
    }),
    [lib, s, overlay !== null, destination !== null, launching !== null],
  );

  const render = THEME_COMPONENTS[s.theme] ?? THEME_COMPONENTS.vita;
  return (
    // zIndex 1: Steam's own popups (context menus, modals) must paint above us.
    <div ref={root} data-dht-root="" data-tv={s.tvMode} data-motion={s.animations} data-dht-theme={s.theme} data-dht-preset={currentPresetId(s)} className={`dht-root dht-theme-${s.theme}`} style={{ position: "fixed", inset: 0, zIndex: standalone ? 900 : 1, background: "#000", overflow: "hidden", fontFamily: "var(--dht-font, inherit)", userSelect: "none", WebkitUserSelect: "none" }}>
      <div className="dht-safe-area" style={{position:"absolute",inset:s.tvMode?"3%":"0"}}>
      <style>{`.dht-root[data-tv=true] .dht-menu-item{font-size:25px!important;min-height:44px}.dht-root[data-motion=false] *{animation:none!important;transition:none!important}@media(prefers-reduced-motion:reduce){.dht-root *{animation:none!important;transition:none!important}}`}</style>
      <HomeCtx.Provider value={api}>
        <SafeBoundary
          key={s.theme}
          where={`theme ${s.theme}`}
          fallback={
            <div style={{ color: "#ddd", padding: 60, fontSize: 20, lineHeight: 1.5 }}>
              This theme hit an error. Pick another preset with L2 / R2 or in Quick Access → Deck Home Themes.
              <div style={{ marginTop: 16, fontSize: 15, color: "#f99", fontFamily: "monospace" }}>{diag.lastError}</div>
            </div>
          }
        >
          <StageHost>{render()}</StageHost>
        </SafeBoundary>
      </HomeCtx.Provider>
      {overlay?.kind === "shots" && <ScreenshotGallery appid={overlay.appid} index={overlay.index} lib={lib.byId} onClose={() => setOverlay(null)} />}
      {overlay?.kind === "trailer" && <TrailerPlayer game={overlay.game} onClose={() => setOverlay(null)} />}
      {overlay?.kind === "video" && <VideoPlayer video={overlay.video} lib={lib.byId} onClose={() => setOverlay(null)} />}
      {overlay?.kind === "store" && <StoreView settings={s} lib={lib} onClose={() => setOverlay(null)} onLaunch={(g) => launchGame(g)} />}
      {destination && <DestinationView destination={destination} settings={s} lib={lib} onClose={()=>setDestination(null)} onLaunch={launchGame} onMedia={()=>setOverlay({kind:"shots",appid:destination.game?.appid})} onTrailer={g=>setOverlay({kind:"trailer",game:g})}/>}
      {launching && <LaunchView value={launching} settings={s}/>}
      {banner && (
        <div
          key={banner.at}
          style={{ position: "absolute", left: "50%", top: 70, transform: "translateX(-50%)", zIndex: 100, padding: "10px 26px", borderRadius: 24, background: "rgba(0,0,0,0.72)", color: "#fff", fontSize: 20, fontFamily: '"Motiva Sans", Arial, sans-serif', boxShadow: "0 6px 24px rgba(0,0,0,0.5)", pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          ◀ L2 &nbsp; {banner.text} &nbsp; R2 ▶
        </div>
      )}
      </div>
    </div>
  );
}
