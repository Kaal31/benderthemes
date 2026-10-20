import { useSteamScreensaver } from "./screensaver";
import { ThemeActivity, UiDocument } from "./performance";
import { DOWNLOAD_CSS, DownloadStatus } from "./downloadUi";
import { tintOf } from "./color";
import {transitionPage} from "./pageTransition";
import { failHome, useHomeFailure } from "./compatibility";
import { Marketplace, inventory } from "./Marketplace";
import { openMarketplace, useMarketplace, useResourceRevision } from "./marketplaceState";
import { FirmwareNotice } from "./FirmwareNotice";
import { WiiuImportPrompt } from "./wiiuThemes";
import {SilverHome} from "./themes/Silver";
import {NazarickHome} from "./themes/Nazarick";
import {PainHome} from "./themes/Pain";
import {AeroV2Home} from "./themes/AeroV2";
import {NintendoHome} from "./themes/Nintendo";
import { SwitchHome } from "./themes/Switch";
import { N3dsHome } from "./themes/N3ds";
import { Destination, DestinationView, setDestinationOpener } from "./destinations";
import { LaunchView, useLaunchState, dismissLaunch, setGameBootClip, setGameBootSound } from "./launch";
import { BootIntro } from "./bootIntro";
import { Onboarding } from "./Onboarding";
import { ThemeIntro } from "./themeIntro";
import { essentialItems, globalSettingsItems, refreshThemeLists, setThemeSettingsOpener, themeSettingsItems } from "./themeSettingsMenu";
import { cachedPspSkin, loadPspSkin } from "./skins";
// The themed home: builds the shared API every theme uses, picks the theme
// and hosts it in a full-screen layer. Also the switch that decides between
// the themed home and Steam's original one.
import { Navigation } from "@decky/ui";
import { Component, CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { anyMenuOpen, HomeApi, HomeCtx, MenuView, useMenu } from "./common";
import { Game, launchGame, loadLibrary, openGamePage, setStoreOpener } from "./library";
import { presentationVariables, PRESENTATION_CSS } from "./themePresentation";
import { getSettings, pspFile, ThemeId, THEMES, updateSettings, useSettings, useSettingsLoaded } from "./settings";
import { playSound, refreshPacks, restoreFooter, restoreHeader, useHiddenFooter, useHiddenHeader, useHomeMusic, userName } from "./steam";
import { currentPresetId, refreshPresets } from "./presets";
import { bump, diag, logInfo, reportError } from "./diag";
import { setUiDocument } from "./cssvars";
import { Overlay, ScreenshotGallery, TrailerPlayer, VideoPlayer } from "./overlays";
import { MusicPlayerView, NowPlayingMini } from "./mediaCenter";
import { HomePluginBadges, PLUGIN_BADGE_CSS } from "./pluginBadges";
import { StoreView } from "./storeView";
import { pushModalInput, ThemeRoot, setGlobalInput, StageHost } from "./input";
import { ThemeSwitcher } from "./themeSwitcher";
import { keyboardInset } from "./keyboardSkins";
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
import { Ps1Home } from "./themes/Ps1";
import { IisuHome } from "./themes/Iisu";
import { NativeLayout } from "./engine/NativeLayout";
import { FrameHome } from "./engine/FrameHome";
import { VideoIntro } from "./engine/VideoIntro";
import { activeTheme, refreshThemes, slotAccent, slotFont, slotUrl, useThemes } from "./engine/registry";
import { callable } from "@decky/api";
const ensureShippedMedia=callable<[id:string],{success:boolean;error?:string}>("ensure_frame_media");
import { LAYOUT_SLOTS } from "./engine/assets";
import { pageSettings } from "./engine/pages";
import { useThemeDeckIntegration } from "./themeDeckIntegration";

// CSS hook: which theme file is active, as "<kind>:<file name>" (empty for looks without theme files)
const skinHook = (s: ReturnType<typeof getSettings>) => {
  const n = s.theme === "vita" ? s.vita.skin : s.theme === "ps3" ? s.xmb.p3t : s.theme === "psp" ? pspFile(s) : s.theme === "switch" ? s.switchTheme ?? "" : s.theme === "xbox" ? s.xboxSkin ?? "" : s.theme === "wii" ? s.wiiSkin ?? "" : s.theme === "n3ds" ? s.n3dsSkin ?? "" : "";
  return n ? `${s.theme === "ps3" ? "p3t" : s.theme}:${n}` : "";
};

const THEME_COMPONENTS: Record<ThemeId, () => ReactNode> = {
  native: () => <NativeLayout />,
  onyx: () => <SilverHome dark />,
  silver: () => <SilverHome />,
  frame: () => <FrameHome />,
  wii: () => <NintendoHome kind="wii"/>,
  wiiu: () => <NintendoHome kind="wiiu"/>,
  switch: () => <SwitchHome />,
  n3ds: () => <N3dsHome />,
  vita: () => <VitaHome />,
  ps1: () => <Ps1Home />,
  ps2: () => <Ps2Home />,
  iisu: () => <IisuHome />,
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
  nazarick: () => <NazarickHome />,
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
    if (this.props.where === "home" || this.props.where?.startsWith("theme ")) failHome(e);
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

/** Bypass the themed home until the user leaves Steam's home route. */
export function showNativeSteamHome() {
  setSteamHomeShown(true);
  Navigation.CloseSideMenus();
  Navigation.Navigate("/library/home");
}

/** Rendered in place of Steam's home route. */
export function HomeSwitch({ original }: { original: ReactNode }) {
  const s = useSettings();
  const loaded = useSettingsLoaded();
  const steamShown = useSteamHomeShown();
  const failure = useHomeFailure();
  useEffect(() => bump("homePatchRenders"), []);
  if (!loaded || !s.enabled || steamShown || failure) return <>{original}</>;
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
      ThemeHub couldn't show the themed home: {diag.lastError || "unknown error"}. Quick Access → ThemeHub → Diagnostics has details.
    </div>
  );
}

export function ThemedHome({ standalone }: { standalone?: boolean }) {
  const revision = useResourceRevision();
  const settings = useSettings();
  const first = !settings.onboardingDone;
  if (first) return <div data-dht-root="" className="dht-root dht-first-run" style={{ position: "fixed", inset: 0, zIndex: standalone ? 900 : 1, background: "#000", overflow: "hidden", userSelect: "none" }}><ThemeRoot onInput={() => false}><Onboarding /></ThemeRoot></div>;
  return <VerifiedThemedHome key={`${settings.theme}:${revision}`} standalone={standalone} />;
}

// Every activation path (saved settings, onboarding, direct theme changes and
// presets) passes here before mounting a renderer that depends on asset packs.
function VerifiedThemedHome({ standalone }: { standalone?: boolean }) {
  const settings = useSettings();
  const market = useMarketplace();
  const [state, setState] = useState<"checking" | "ready" | "missing" | "error">("checking");
  const [retry, setRetry] = useState(0);
  useEffect(() => {
    let alive = true;
    setState("checking");
    const shipped=activeTheme(settings);
    if(shipped?.source==="bundled"){
      void inventory().then(async installed=>{
        if(!installed[shipped.id]){if(alive){setState("missing");openMarketplace("frame",{from:"frame"});}return;}
        const result=await ensureShippedMedia(shipped.id);
        if(!result.success)throw new Error(result.error||"Theme media unavailable");
        await refreshThemes();
        if(alive)setState("ready");
      }).catch(()=>{if(alive)setState("error");});
      return()=>{alive=false;};
    }
    if ((settings.theme === "frame" || settings.theme === "native")) { setState("ready"); return; }
    inventory().then(installed => {
      if (!alive) return;
      const ready = !!installed[settings.theme];
      setState(ready ? "ready" : "missing");
      logInfo(`[theme-availability] theme=${settings.theme} installed=${ready}`);
      if (!ready) openMarketplace(settings.theme, { from: settings.theme });
    }).catch(() => { if (alive) { setState("error"); logInfo(`[theme-availability] inventory check failed theme=${settings.theme}`); } });
    return () => { alive = false; };
  }, [settings.theme, settings.activeTheme, retry]);
  if (state === "ready") return <ThemedHomeContent standalone={standalone} />;
  return <div data-dht-root="" data-theme-availability={state} style={{position:"fixed",inset:0,zIndex:standalone?900:1,background:"#10151d",color:"#fff",display:"grid",placeItems:"center"}}>
    <ThemeRoot onInput={p => {
      if (market.opened) return false;
      if (p.btn === "b" && !p.repeat) { showNativeSteamHome(); return true; }
      if (p.btn === "a" && !p.repeat && state !== "checking") {
        if (state === "missing") openMarketplace(settings.theme, {from:settings.theme});
        else setRetry(n=>n+1);
        return true;
      }
      return false;
    }}>
    <div style={{textAlign:"center",maxWidth:520,padding:32}}>
      <h2>{state === "checking" ? "Checking theme files…" : state === "error" ? "Couldn’t check theme files" : "Download this theme to continue"}</h2>
      {state === "missing" && <p>The theme’s artwork and resources haven’t been installed yet.</p>}
      {state !== "checking" && <button onClick={() => state === "missing" ? openMarketplace(settings.theme, {from:settings.theme}) : setRetry(n=>n+1)}>{state === "missing" ? "Open theme downloads" : "Try again"}</button>}
      <button onClick={showNativeSteamHome}>Steam Home</button>
    </div>
    {market.opened && <Marketplace requested={market.requested} from={market.from} />}
    </ThemeRoot>
  </div>;
}

function ThemedHomeContent({ standalone }: { standalone?: boolean }) {
  const s = useSettings();
  const market = useMarketplace();
  const root = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<Document | null>(null);
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const el = root.current; if (!el || !doc) return;
    let intersects = true;
    const sync = () => setVisible(intersects && !doc.hidden);
    const observer = new IntersectionObserver(entries => { intersects = entries[0]?.isIntersecting ?? false; sync(); });
    observer.observe(el); doc.addEventListener("visibilitychange", sync); sync();
    return () => { observer.disconnect(); doc.removeEventListener("visibilitychange", sync); };
  }, [doc]);
  // Steam's keyboard (STEAM + X, a search box) opens under our fixed home: end the home above it while it is open
  const [kbInset, setKbInset] = useState(0);
  useEffect(() => {
    if (!doc) return;
    const iv = setInterval(() => { const h = doc.hidden ? 0 : keyboardInset(doc); setKbInset((v) => (v === h ? v : h)); }, 250);
    return () => clearInterval(iv);
  }, [doc]);
  useEffect(() => {
    setDoc(root.current?.ownerDocument ?? null);
    setUiDocument(root.current?.ownerDocument ?? null);
    bump("themedMounts");
  }, []);

  // Library: re-read on mount and periodically (installs, new plays).
  const [rev, setRev] = useState(0);
  useEffect(() => {
    const refresh = () => { if (!root.current?.ownerDocument.hidden) setRev(r => r + 1); };
    const iv = setInterval(refresh, 30000);
    const owner = root.current?.ownerDocument; owner?.addEventListener("visibilitychange", refresh);
    return () => { clearInterval(iv); owner?.removeEventListener("visibilitychange", refresh); };
  }, []);
  const collectionChoice = s.themeCollections?.[s.theme];
  const librarySource = collectionChoice?.source ?? s.source;
  const lib = useMemo(() => loadLibrary(librarySource, s.sort, s.maxGames, collectionChoice?.ids), [librarySource, collectionChoice, s.sort, s.maxGames, rev]);
  // Empty libraries are valid; a missing/changed Steam API is a compatibility failure.
  if (lib.error) throw new Error(lib.error);

  const screensaver = useSteamScreensaver();
  useHiddenHeader(doc, !screensaver && s.hideSteamHeader);
  useHiddenFooter(doc, screensaver ? "show" : s.footer);
  useEffect(() => () => { restoreHeader(doc); restoreFooter(doc); }, [doc]);
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [destination,setDestination] = useState<Destination|null>(null);
  const [blockPanel,setBlockPanel] = useState<HTMLElement|null>(null);
  useEffect(()=>{setBlockPanel(s.theme==="minecraft" ? root.current?.querySelector<HTMLElement>(".mc-content-slot")??null : null);},[s.theme]);
  useEffect(()=>{if(!blockPanel)return;blockPanel.parentElement?.toggleAttribute("data-panel-open",!!destination||overlay?.kind==="store");return()=>blockPanel.parentElement?.removeAttribute("data-panel-open");},[blockPanel,destination,overlay]);
  useEffect(()=>{const close=()=>{setDestination(null);setOverlay(null);};window.addEventListener("dht-block-play",close);return()=>window.removeEventListener("dht-block-play",close);},[]);
  useEffect(()=>{if(s.theme==="minecraft")window.dispatchEvent(new CustomEvent("dht-block-page",{detail:overlay?.kind==="store"?"store":destination?.place??"play"}));},[s.theme,destination,overlay]);
  const inBlockPanel=(content:ReactNode)=>blockPanel?createPortal(content,blockPanel):content;
  const launching=useLaunchState();
  useThemes(); // re-render when data themes are added or removed
  const engineTheme = activeTheme(s);
  const launchVideo = slotUrl("launchVideo", s);
  // a PSP theme's game-start clip, chosen in its options; it plays on every theme
  // (the engine theme's own game start video comes first)
  useEffect(() => {
    let alive = true;
    setGameBootClip(null);
    setGameBootSound(null);
    if (launchVideo !== undefined) setGameBootClip(launchVideo);
    else if (s.gameBoot) loadPspSkin(s.gameBoot).then((sk) => { if (alive) { setGameBootClip(sk?.gameboot ?? null); setGameBootSound(sk?.bootSound?.gameboot ?? null); } }).catch(() => {});
    return () => { alive = false; };
  }, [s.gameBoot, launchVideo]);
  // the theme's own options, opened from its settings entries (global options stay in Quick Access)
  const themeMenu = useMenu();
  useEffect(() => { refreshThemeLists(); }, [s.theme]);
  useEffect(() => (themeMenu.isOpen ? pushModalInput((p) => themeMenu.handle(p)) : undefined), [themeMenu.isOpen]);
  const openThemeSettings = () => {
    const name = engineTheme?.name ?? THEMES.find((t) => t.id === s.theme)?.name ?? s.theme;
    // the same as the options menu (△ / Y): this theme's options, then everything shared by all themes
    themeMenu.open([...essentialItems([], () => api.showSteamHome()), ...themeSettingsItems(), { label: "Global settings", sub: globalSettingsItems }], `${name} options`, { page: true });
  };
  useEffect(() => { setThemeSettingsOpener(openThemeSettings); return () => setThemeSettingsOpener(null); });
  useEffect(()=>{setDestinationOpener(d=>transitionPage(s,()=>{if(d.place==="media"){setOverlay({kind:"shots"});setDestination(null);}else if(d.place==="music"){setOverlay({kind:"music"});setDestination(null);}else{setOverlay(null);setDestination(d);}},doc));return()=>{setDestinationOpener(null);};},[s.theme,s.animations,doc]);
  useEffect(()=>()=>dismissLaunch(),[]);
  useEffect(()=>{if(overlay)setDestination(null);},[overlay]);

  // ThemeRoot routes L2 / R2 through the theme / skin switcher.
  // Consume triggers when switching is unavailable so they do not change a hidden home.
  const [banner, setBanner] = useState<{ text: string; at: number } | null>(null);
  useEffect(() => {
    refreshPresets();
    setGlobalInput((p) => {
      if (p.btn !== "l2" && p.btn !== "r2") return false;
      if (p.repeat) return true;
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
  useHomeMusic(s.theme, !screensaver && !launching && (overlay === null || overlay.kind === "store"), destination?.place); // the store keeps the theme music
  useThemeDeckIntegration(!screensaver && s.enabled && s.backgroundMusic !== false && s.themeDeckFocusMusic !== false && !launching && !overlay && !market.opened && (!destination || destination.place === "game"), useMemo(() => new Set(lib.games.map(g => g.appid)), [lib]), destination?.place === "game" ? destination.game?.appid : undefined);
  // every theme's "Store" entry opens the themed store (unless turned off in Quick Access)
  useEffect(() => {
    setStoreOpener(() => {
      playSound("open");
      transitionPage(s,()=>{setDestination(null);setOverlay({ kind: "store" });},doc);
    });
    return () => setStoreOpener(null);
  }, [s.theme,s.animations,doc]);

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
      showSteamHome: showNativeSteamHome,
      openSettings: openThemeSettings,
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
      busy: overlay !== null || destination !== null || launching !== null || market.opened,
    }),
    [lib, s, overlay !== null, destination !== null, launching !== null, market.opened],
  );

  const themeActive = !screensaver && visible && !market.opened && !launching && (!overlay || (s.theme === "minecraft" && overlay.kind === "store")) && (!destination || s.theme === "minecraft");
  const render = THEME_COMPONENTS[s.theme] ?? THEME_COMPONENTS.vita;
  // the engine theme's colour and font, for layouts that use --dht-accent / inherit the font
  const accent = tintOf(s) ?? slotAccent(s);
  const themeFont = slotFont(s);
  // presets v2: the accent slot is written to the look's own colour variables too (capability table, engine/assets.ts)
  const slotColour = slotAccent(s);
  const lookAccent = slotColour ? Object.fromEntries((LAYOUT_SLOTS[s.theme]?.accent ?? []).map((v) => [v, slotColour])) : {};
  const themeSlotStyle = { ...(accent ? { "--dht-accent": accent } : {}), ...lookAccent, ...(themeFont ? { "--dht-font": '"dht-theme-font", "Motiva Sans", sans-serif', fontFamily: "var(--dht-font)" } : {}) } as CSSProperties;
  return (
    // zIndex 1: Steam's own popups (context menus, modals) must paint above us.
    <div ref={root} data-dht-root="" data-tv={s.tvMode} data-motion={s.animations} data-dht-theme={s.theme} data-dht-preset={currentPresetId(s)} data-dht-skin={skinHook(s) || undefined} data-dht-screensaver={screensaver || undefined} className={`dht-root dht-theme-${s.theme}`} style={{ position: "fixed", inset: 0, bottom: kbInset, zIndex: standalone ? 900 : 1, visibility: screensaver ? "hidden" : undefined, pointerEvents: screensaver ? "none" : undefined, background: "#000", overflow: "hidden", fontFamily: "var(--dht-font, inherit)", userSelect: "none", WebkitUserSelect: "none" }}>
      <div className="dht-safe-area" style={{position:"absolute",inset:s.tvMode?"3%":"0",...presentationVariables(s),...themeSlotStyle}}>
      {themeFont && <style>{`@font-face{font-family:"dht-theme-font";src:url("${themeFont}")}`}</style>}
      <style>{PRESENTATION_CSS}</style>
      <style>{PLUGIN_BADGE_CSS}</style>
      {market.opened&&<style>{".dht-root .dht-badge--protondb{display:none!important}"}</style>}
      <style>{`.dht-root[data-tv=true] .dht-menu-item{font-size:25px!important;min-height:44px}.dht-root [data-dht-stage-active=false] *{animation-play-state:paused!important}.dht-root[data-motion=false] *{animation:none!important;transition:none!important}@media(prefers-reduced-motion:reduce){.dht-root *{animation:none!important;transition:none!important}}`}</style>
      <UiDocument.Provider value={doc}><ThemeActivity.Provider value={themeActive}><HomeCtx.Provider value={api}>
        <SafeBoundary
          key={`${s.theme}:${engineTheme?.id}:${engineTheme?.revision}`}
          where={`theme ${s.theme}`}
          fallback={
            <div style={{ color: "#ddd", padding: 60, fontSize: 20, lineHeight: 1.5 }}>
              This theme hit an error. Pick another look with L1 held + the D-pad, L2 / R2, or in Quick Access → ThemeHub.
              <div style={{ marginTop: 16, fontSize: 15, color: "#f99", fontFamily: "monospace" }}>{diag.lastError}</div>
            </div>
          }
        >
          <div data-dht-stage-active={themeActive} style={{display:"contents"}}><StageHost>{render()}</StageHost></div>
        </SafeBoundary>
      </HomeCtx.Provider></ThemeActivity.Provider></UiDocument.Provider>
      <HomePluginBadges settings={s} hidden={!!overlay||!!destination||!!launching||market.opened||themeMenu.isOpen}/>
      {overlay?.kind === "shots" && <div className="dht-themed-media"><ScreenshotGallery appid={overlay.appid} index={overlay.index} tab={overlay.tab} lib={lib.byId} onClose={() => setOverlay(null)} onVideo={(v) => { playSound("open"); setOverlay({ kind: "video", video: v, back: true }); }} /></div>}
      {overlay?.kind === "trailer" && <div className="dht-themed-media"><TrailerPlayer game={overlay.game} onClose={() => setOverlay(null)} /></div>}
      {overlay?.kind === "video" && <div className="dht-themed-media"><VideoPlayer video={overlay.video} lib={lib.byId} onClose={() => setOverlay(overlay.back ? { kind: "shots", tab: "videos" } : null)} /></div>}
      {overlay?.kind === "music" && <div className="dht-themed-media"><MusicPlayerView onClose={() => setOverlay(null)} /></div>}
      {!overlay && !destination && !launching && s.theme !== "ps3" && s.theme !== "psp" && <NowPlayingMini onOpen={() => { playSound("open"); setOverlay({ kind: "music" }); }} />}
      {overlay?.kind === "store" && inBlockPanel(<HomeCtx.Provider value={api}><NativeLayout destination={{place:"store"}} onClose={()=>setOverlay(null)} fallback={<StoreView settings={pageSettings(s, "store")} lib={lib} onClose={() => transitionPage(s,()=>setOverlay(null),doc)} onLaunch={(g) => launchGame(g)} />}/></HomeCtx.Provider>)}
      {destination && inBlockPanel(<HomeCtx.Provider value={api}><NativeLayout destination={destination} onClose={()=>setDestination(null)} fallback={<DestinationView destination={destination} settings={s} lib={lib} onClose={()=>transitionPage(s,()=>setDestination(null),doc)} onLaunch={launchGame} onMedia={()=>setOverlay({kind:"shots",appid:destination.game?.appid})} onTrailer={g=>setOverlay({kind:"trailer",game:g})}/>}/></HomeCtx.Provider>)}
      <style>{DOWNLOAD_CSS}</style>
      <DownloadStatus settings={s} hidden={!!overlay || !!destination || !!launching || market.opened} />
      <MenuView menu={themeMenu} variant={s.theme === "ps3" ? "xmb" : (s.theme === "frame" || s.theme === "native") ? "ps5" : s.theme} art={s.theme === "psp" ? { panel: cachedPspSkin(pspFile(s))?.visuals?.optionMenu, focus: cachedPspSkin(pspFile(s))?.visuals?.menuFocus } : undefined} />
      {launching && <LaunchView value={launching} settings={s}/>}
      <BootIntro file={s.bootIntro} />
      <ThemeIntro autoTheme={s.onboardingDone && !market.opened && !api.busy && !slotUrl("bootVideo", s) ? s.theme : undefined} />
      <VideoIntro url={slotUrl("bootVideo", s)} />
      {market.opened && <Marketplace requested={market.requested} from={market.from} initialTab={market.initialTab} />}
      <FirmwareNotice paused={market.opened || !!overlay || !!destination || !!launching} />
      <WiiuImportPrompt paused={market.opened || !!overlay || !!destination || !!launching} />
      <ThemeSwitcher available={() => !overlay && !destination && !launching && !market.opened && !themeMenu.isOpen && !anyMenuOpen()} />
      {banner && (
        <div
          key={banner.at}
          className="dht-preset-banner"
          style={{ position: "absolute", left: "50%", top: 70, transform: "translateX(-50%)", zIndex: 100, padding: "10px 26px", borderRadius: 24, background: "rgba(0,0,0,0.72)", color: "#fff", fontSize: 20, fontFamily: '"Motiva Sans", Arial, sans-serif', boxShadow: "0 6px 24px rgba(0,0,0,0.5)", pointerEvents: "none", whiteSpace: "nowrap" }}
        >
          ◀ L2 &nbsp; {banner.text} &nbsp; R2 ▶
        </div>
      )}
      </div>
    </div>
  );
}
