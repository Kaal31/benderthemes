import { GameHero } from "../common";
import {customProfilePicture} from "../profilePicture";
import { frameLoop, useThemeActive } from "../performance";
import { openDestination } from "../destinations";
// XrossMediaBar for the PS3 and PSP themes: a horizontal category bar
// crossing a vertical item list, over a month-coloured gradient and wave.
import { CSSProperties, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AnimCanvas } from "../canvas";
import { useReportFocus } from "../focus";
import { darken, hex, lighten, mix, MONTH_NAMES, PS3_MONTHS, PSP_FIRMWARE_MONTHS, PSP_FIRMWARE_WAVE, PSP_MONTHS, rgb, RGB } from "../color";
import { BatteryGlyph, GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openSteam } from "../library";
import { pspFile, Settings, showTitle, themeFx, ThemeFx, THEMES, updateSettings, useSettings } from "../settings";
import { fmtDate, fmtTime, playSound, SoundKind, useBattery, useClock, useWallpaper } from "../steam";
import { P3tSkin, ThemeText, useP3t, usePsp, useRafScene, XmbVisual } from "../skins";
import { RafBackground } from "../ps3/RafBackground";
import { createPspScene, createPspWave, PSP_NATIVE_Y, modelWave, nativeModel, PspSceneData, sceneModels, scenePages } from "./pspScene";
import { Badges } from "../badges";
import { useCssVar } from "../cssvars";
/** "0.4" or "40" (percent) → 0…1; empty/invalid → 0 */
const cssFraction = (v: string) => { const n = parseFloat(v); return Number.isFinite(n) ? clamp(n > 1 ? n / 100 : n, 0, 1) : 0; };
import { fmtDuration, fmtSize, LocalVideo, LocalVideoView, TrailerVideo, useScreenshots, useVideos } from "../media";
import { applyPreset, currentPresetId, presetGroups } from "../presets";
import { PS3_ICONS } from "./xmbOriginalIcons";
import { downloadLine, pauseDownload, removeDownload, resumeDownload, useDownloads } from "../downloads";
import { fmtClock, MusicAlbum, musicPlaybackItems, musicPlayer, useMusic, usePlayer } from "../musicPlayer";
import { HudArt, Ps3Notice, XmbBar, XmbBusy, XmbInfoBar, XmbMusicScreen } from "./XmbHud";

// PSP shadow pictures are grey and opaque: brightness is how dark the shadow gets. Turn that into a
// black picture with matching transparency (done once per picture).
const shadowCache = new Map<string, string>();
function useShadowPic(src?: string): string | undefined {
  const [out, setOut] = useState(() => (src ? shadowCache.get(src) : undefined));
  useEffect(() => {
    if (!src) return setOut(undefined);
    if (shadowCache.has(src)) return setOut(shadowCache.get(src));
    let alive = true;
    const img = new Image();
    img.onload = () => {
      let url = src;
      try {
        const c = document.createElement("canvas");
        c.width = img.naturalWidth; c.height = img.naturalHeight;
        const g = c.getContext("2d")!;
        g.drawImage(img, 0, 0);
        const d = g.getImageData(0, 0, c.width, c.height), px = d.data;
        let opaque = true;
        for (let i = 3; i < px.length; i += 4) if (px[i] < 250) { opaque = false; break; }
        if (opaque) {
          for (let i = 0; i < px.length; i += 4) { const l = Math.max(px[i], px[i + 1], px[i + 2]); px[i] = px[i + 1] = px[i + 2] = 0; px[i + 3] = l; }
          g.putImageData(d, 0, 0);
          url = c.toDataURL();
        }
      } catch { /* keep the picture as it is */ }
      shadowCache.set(src, url);
      if (alive) setOut(url);
    };
    img.src = src;
    return () => { alive = false; };
  }, [src]);
  return out;
}
/** The PS3's four system font styles, as a .p3t picks them (1 = the standard one), with similar faces. */
const PS3_FONT_STYLES: Record<number, string> = {
  2: '"Nunito", "Varela Round", "Arial Rounded MT Bold", "M PLUS Rounded 1c", sans-serif',
  3: 'Georgia, "Times New Roman", "Noto Serif", serif',
  4: '"Helvetica Neue", "Segoe UI Light", "Noto Sans", sans-serif',
};
/** Focus glow size for a strength in % (100 = as the theme draws it). */
const glowSize = (pct: number) => 0.7 + 0.3 * (pct / 100);

type Variant = "ps3" | "psp";

function StockXmbIcon({name,size,variant,skinFallback=false}:{name:string;size:number;variant:Variant;skinFallback?:boolean}) {
  const style:CSSProperties={width:size,height:size,display:"block",objectFit:"contain",filter:!["psn","store"].includes(name)?"brightness(0) invert(1) drop-shadow(0 2px 1px #0003)":variant==="psp"||skinFallback?"grayscale(1) drop-shadow(0 2px 1px #0007)":undefined};
  if(variant==="psp" && name==="music") return <svg viewBox="0 0 64 64" style={style} aria-hidden="true"><defs><linearGradient id="pspNote" x2="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#bfc0c1"/></linearGradient></defs><path d="M28 5 L52 10 V45 C52 57 32 62 32 51 C32 45 40 41 47 42 V17 L33 13 V48 C33 60 12 65 12 54 C12 47 21 43 28 45 Z" fill="url(#pspNote)" stroke="#efefef" strokeWidth="1"/></svg>;
  if(variant==="psp" && (name==="globe"||name==="network")) return <svg viewBox="0 0 64 64" style={style} aria-hidden="true"><g fill="#eee">{Array.from({length:12},(_,i)=><circle key={i} cx={32+26*Math.cos(i*Math.PI/6)} cy={32+26*Math.sin(i*Math.PI/6)} r="1.7"/>)}</g><text x="32" y="38" textAnchor="middle" fontFamily="Arial,sans-serif" fontSize="16" fontWeight="bold" textLength="42" lengthAdjust="spacingAndGlyphs" fill="#eee">WWW</text></svg>;
  const src=PS3_ICONS[name];
  return src?<img className="dht-xmb-icon" data-icon-source="esseti" src={src} style={style}/>:<Icon name={name as IconName} size={size} color="#fff"/>;
}

/** Some themes draw their categories as words, not pictures: a wide strip (e.g. 512 × 32) with the
 *  text in one part. Those are cropped to the text and shown as the category's name. */
type Word = { url: string; aspect: number } | null;
const wideLabels = new Map<string, Word>();
const wideLabel = (src: string) => wideLabels.get(src) ?? null;
function useWideLabel(src: string, onReady?: () => void) {
  const [v, setV] = useState<Word | undefined>(() => wideLabels.get(src));
  useEffect(() => {
    if (wideLabels.has(src)) return setV(wideLabels.get(src));
    let alive = true;
    const im = new Image();
    im.onload = () => {
      let out: Word = null;
      const w = im.naturalWidth, h = im.naturalHeight;
      if (w >= h * 3) {
        try {
          const c = document.createElement("canvas");
          c.width = w; c.height = h;
          const g = c.getContext("2d")!;
          g.drawImage(im, 0, 0);
          const a = g.getImageData(0, 0, w, h).data;
          let x0 = w, x1 = -1, y0 = h, y1 = -1;
          for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (a[(y * w + x) * 4 + 3] > 8) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
          if (x1 >= x0) {
            // only the empty sides go: every word keeps the strip's full height, so all letters stay the same size
            const o = document.createElement("canvas");
            o.width = x1 - x0 + 1; o.height = h;
            o.getContext("2d")!.drawImage(c, x0, 0, o.width, h, 0, 0, o.width, h);
            out = { url: o.toDataURL(), aspect: o.width / h };
          }
        } catch { out = null; }
      }
      wideLabels.set(src, out);
      if (alive) setV(out);
      onReady?.();
    };
    im.onerror = () => { wideLabels.set(src, null); if (alive) setV(null); };
    im.src = src;
    return () => { alive = false; };
  }, [src]);
  return v;
}
function CatSkinIcon({ src, size, fallback, wordH, onReady }: { src: string; size: number; fallback: ReactNode; wordH: number; onReady: () => void }) {
  const wide = useWideLabel(src, onReady);
  if (wide === undefined) return <div style={{ width: size * 1.3, height: size * 1.3 }} />;
  if (wide) return <img src={wide.url} alt="" data-icon-source="skin" className="dht-xmb-cat-word" style={{ height: wordH, width: "auto", display: "block", maxWidth: "none" }} />;
  return <XmbImage source="skin" src={src} style={{ width: size * 1.3, height: size * 1.3, display: "block", objectFit: "contain" }} fallback={fallback} />;
}

// A removed screenshot or malformed imported icon must not expose a broken-image glyph.
function XmbImage({src,style,fallback,source}:{src:string;style:CSSProperties;fallback:ReactNode;source?:string}){
  const [failed,setFailed]=useState<string>();
  return failed===src?<>{fallback}</>:<img src={src} alt="" data-icon-source={source} data-dht-from-skin={source === "skin" ? "" : undefined} style={style} onError={()=>setFailed(src)}/>;
}

interface XItem {
  key: string;
  label: string;
  sub?: string;
  icon?: IconName;
  p3t?: string; // icon id inside a .p3t theme
  visual?: XmbVisual; // theme-supplied state picture (loading…), only when the theme has one
  game?: Game;
  image?: string; // picture icon (screenshots)
  trailer?: boolean; // Video category: plays the game's trailer
  video?: LocalVideo; // Video category: a video stored on the Deck
  children?: () => XItem[];
  action?: () => void;
  dl?: number; // an app in Steam's download queue: its live progress is shown under the name
  track?: { album: string; index: number }; // a music track (shows its play state live)
}
interface XCat {
  key: string;
  label: string;
  icon: IconName;
  p3t: string;
  items: XItem[];
  start?: number;
}

type XmbLayout = (typeof LAYOUT)["psp"] & { box?: number; pitch?: number };
const LAYOUT = {
  ps3: {
    catY: 0.27,
    catX: 300,
    catGap: 150,
    catIcon: 62,
    catIconSel: 74,
    gap: 84,
    selGapBelow: 120,
    iconSel: [196, 108],
    icon: [124, 68],
    glyphSel: 64,
    glyph: 46,
    font: 25,
    fontSel: 27,
    subFont: 17,
    labelGap: 6,
    textGap: 26,
    lineGap: 4,
  },
  psp: {
    catY: 0.22,
    catX: 250,
    catGap: 128,
    catIcon: 52,
    catIconSel: 62,
    gap: 72,
    selGapBelow: 104,
    iconSel: [168, 92],
    icon: [104, 57],
    glyphSel: 56,
    glyph: 40,
    font: 22,
    fontSel: 25,
    subFont: 16,
    labelGap: 6,
    textGap: 26,
    lineGap: 4,
  },
};

/** The PS3's icon column: 375 of 1280 on a 16:9 picture (real shots; .p3t wallpapers such as Little Big Planet draw a cross
 *  for the icons there). The wallpaper is drawn "cover", so on a 16:10 screen its sides are cut: the column follows the picture,
 *  not a fixed 300 px (which put the icons ~45 px left of the theme's cross). */
export const ps3ColumnX = (W: number, H: number) => W / 2 + (375 - 640) * Math.max(W / 1280, H / 720);

/** Scale of PSP theme art that is drawn at the console's own size, relative to 1:1 PSP pixels: 1 with "PSP proportions" on,
 *  else the default layout's (its selected category icon, 62 px, against the console's 37 PSP pixels). */
export const pspArtFit = (variant: Variant, accurate: boolean, W: number, H: number) =>
  variant === "psp" && !accurate ? Math.min(1, LAYOUT.psp.catIconSel / (37 * Math.min(W / 480, H / 272))) : 1;

/** Key of the per-theme settings for the XMB: the theme file, or the plain console look. */
export const xmbFxKey = (s: Settings, variant: Variant) =>
  variant === "ps3" ? (s.xmb.p3t ? `p3t:${s.xmb.p3t}` : "ps3:") : pspFile(s) ? `psp:${pspFile(s)}` : "psp:";

/** The PSP's own proportions, measured on console screenshots (480 × 272) and fitted to the
 *  screen. TV mode's safe margins shrink the stage, so they are respected automatically; its
 *  larger text applies here too. The per-theme icon size slider still scales the icons. */
function pspAccurateLayout(W: number, H: number, tv: boolean): XmbLayout {
  const u = Math.min(W / 480, H / 272);
  const t = tv ? 1.08 : 1;
  return {
    catY: (64 * u) / H,
    catX: 109 * u,
    catGap: 80 * u,
    catIcon: 31 * u,
    catIconSel: 37 * u,
    gap: 62 * u,
    selGapBelow: 72 * u,
    iconSel: [144 * u * 0.9, 80 * u * 0.9],
    icon: [100 * u * 0.9, 56 * u * 0.9],
    glyphSel: 40 * u,
    glyph: 30 * u,
    font: 14.5 * u * t,
    fontSel: 16 * u * t,
    subFont: 9.5 * u * t,
    labelGap: 3 * u,
    textGap: 17 * u,
    lineGap: 2 * u,
    box: 48 * u, // non-game rows: the icon cell is the focus box, not a game-icon frame
    pitch: 65 * u, // row spacing below the selected item
  };
}

// ───────────── background ─────────────
function nightFactor(d: Date) {
  // Darker late at night, brightest mid-day (the PS3 dims through the day).
  const h = d.getHours() + d.getMinutes() / 60;
  const day = (Math.cos(((h - 13) / 24) * Math.PI * 2) + 1) / 2; // 1 at 13:00, 0 at 01:00
  return 0.18 + 0.82 * day;
}

function XmbBackground({ variant, color, animate, now, skin, fx, month = now.getMonth() }: { variant: Variant; color: RGB; animate: boolean; now: Date; skin: P3tSkin | null; fx: ThemeFx; month?: number }) {
  const { W, H } = useStage();
  const userWall = useWallpaper(variant);
  const slides = !userWall ? skin?.slides ?? [] : [];
  const wall = userWall ?? skin?.backgrounds[0] ?? null;
  const p3tName = useSettings().xmb.p3t;
  // CSS hooks for the drawn backgrounds (all optional, see CSS-THEMING.md)
  const cssPs3Scene = useCssVar("--dht-ps3-scene").toLowerCase();
  const cssPs3Dim = cssFraction(useCssVar("--dht-ps3-scene-dim"));
  const cssPs3Fps = Math.round(clamp(parseFloat(useCssVar("--dht-ps3-scene-fps")) || 30, 5, 60));
  const cssPspScene = useCssVar("--dht-psp-scene").toLowerCase();
  const cssPspFps = Math.round(clamp(parseFloat(useCssVar("--dht-psp-scene-fps")) || 30, 5, 60));
  const cssPspLevel = parseFloat(useCssVar("--dht-psp-wave-level"));
  const cssWave = useCssVar("--dht-xmb-wave").toLowerCase() !== "off";
  const rafScene = useRafScene(variant === "ps3" ? p3tName : "", variant === "ps3" && !userWall && fx.sceneAnim && cssPs3Scene !== "off" ? skin?.rafScene : undefined);
  const light = variant === "ps3" ? nightFactor(now) : 1;
  const top = darken(color, variant === "ps3" ? 0.75 - 0.35 * light : 0.62);
  const mid = darken(color, variant === "ps3" ? 0.5 - 0.35 * light : 0.25);
  const bot = variant === "ps3" ? darken(color, 0.62 - 0.4 * light) : lighten(color, 0.35);
  const bg =
    variant === "ps3"
      ? `radial-gradient(ellipse at 30% 35%, ${rgb(lighten(mid, 0.12))} 0%, transparent 60%), linear-gradient(180deg, ${rgb(top)} 0%, ${rgb(mid)} 55%, ${rgb(bot)} 100%)`
      : `radial-gradient(ellipse at 48% 30%, rgba(255,255,255,0.14), transparent 62%), linear-gradient(180deg, ${rgb(top)} 0%, ${rgb(top)} 22%, ${rgb(mix(top, bot, 0.5))} 68%, ${rgb(bot)} 100%)`;
  const slideshow = slides.length ? (
    <XmbSlides urls={slides} animate={animate} fx={fx} staticSlides={!!skin?.staticSlides} fallback={wall ? <img src={wall} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} /> : (cssWave ? <AnimCanvas className="dht-xmb-wave" width={W} height={H} animate={animate} fps={30} draw={variant === "ps3" ? drawPs3Wave : drawPspWave} /> : null)} />
  ) : null;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div className="dht-xmb-bg" style={{ position: "absolute", inset: 0, background: `var(--dht-xmb-bg, ${bg})` }} />
      {skin?.scene && fx.background && cssPspScene !== "off" ? (
        <PspThemeBg fps={cssPspFps} scene={skin.scene} background={skin.backgrounds[0] ?? null} wallpaper={userWall ?? ((skin as P3tSkin & { wallpaper?: boolean }).wallpaper ? skin.backgrounds[0] ?? null : null)} animate={animate && fx.sceneAnim} wave={fx.wave && cssWave} level={Number.isFinite(cssPspLevel) ? clamp(cssPspLevel, 0, 100) : fx.waveLevel} tint={skin.stock ? PSP_FIRMWARE_MONTHS[month] : null} waveTint={skin.stock ? PSP_FIRMWARE_WAVE[month] : null} />
      ) : slides.length ? (
        rafScene && fx.background ? (
          // dynamic theme: the theme's own 3D scene; the slideshow while it loads or if it cannot be shown
          <RafBackground key={rafScene} url={rafScene} animate={animate} fallback={slideshow} fps={cssPs3Fps} dim={cssPs3Dim} />
        ) : slideshow
      ) : wall ? (
        <>
          <img src={wall} data-dht-from-skin={userWall ? undefined : ""} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          {/* your own wallpaper is dimmed for legibility; a theme's background is shown as the console shows it */}
          {userWall && <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />}
        </>
      ) : cssWave ? (
        <AnimCanvas className="dht-xmb-wave" width={W} height={H} animate={animate} fps={30} draw={variant === "ps3" ? drawPs3Wave : drawPspWave} />
      ) : null}
    </div>
  );
}

/** A .ctf's own background: its layout (pictures + animation scripts) and its 3D wave model. */
function PspThemeBg({ fps = 30, scene, background, wallpaper, animate, wave, level, tint, waveTint }: { fps?: number; scene: PspSceneData; background: string | null; wallpaper: string | null; animate: boolean; wave: boolean; level: number; tint?: number[] | null; waveTint?: number[] | null }) {
  const { W, H } = useStage();
  const active = useThemeActive(), activeRef = useRef(active); activeRef.current = active;
  const redraw = useRef<(() => void) | null>(null);
  useEffect(() => { redraw.current?.(); }, [active]);
  const sceneRef = useRef<HTMLCanvasElement>(null);
  const waveRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const pages = scenePages(scene, !!wallpaper);
    const sc = sceneRef.current ? createPspScene(sceneRef.current, scene, { background, wallpaper, pages, tint }) : null;
    // every 3D model object of the layout gets its own wave, following the object as its scripts
    // move, fade and turn it; a model started by the firmware itself sits where the stock wave sits
    const waves: { draw: (t: number) => void; dispose: () => void; image: HTMLImageElement }[] = [];
    if (wave && waveRef.current) {
      const models = sceneModels(scene, pages);
      // on the wallpaper page the console draws no wave of its own (real shots of themes with a wallpaper: Midnight Black, Organ,
      // Persona 3); a model placed on that page by the layout still shows
      for (const n of models.length ? models : wallpaper ? [] : [null]) {
        const data = modelWave(scene, n);
        if (!data) continue;
        const native = nativeModel(n);
        const wv = createPspWave(waveRef.current, { ...data, obj: native ? null : n }, { yOffset: native ? PSP_NATIVE_Y : 0, intensity: level / 100, tint: waveTint ?? undefined });
        if (!wv) continue;
        const first = !waves.length;
        waves.push({ draw: (t) => wv.draw(t, native || !n ? undefined : sc?.objs[n.n], first), dispose: wv.dispose, image: wv.image });
      }
    }
    const wv = waves.length ? { draw: (t: number) => waves.forEach((x) => x.draw(t)) } : null;
    const t0 = performance.now();
    let settled = false;
    const loop = frameLoop(sceneRef.current!, (now, moving) => {
      if (!moving && !settled) { for (let n = 0; n < 30; n++) sc?.frame(n * 100); settled = true; }
      sc?.frame(moving ? now - t0 : 2900);
      wv?.draw(moving ? now - t0 : 4000);
    }, () => animate, () => activeRef.current, fps);
    redraw.current = loop.invalidate;
    const images = [...(sc?.loaded ?? []), ...waves.map(w => w.image)];
    images.forEach(img => img.addEventListener("load", loop.invalidate));
    return () => { redraw.current = null; loop.dispose(); images.forEach(img => img.removeEventListener("load", loop.invalidate)); waves.forEach(w => w.dispose()); };
  }, [scene, background, wallpaper, animate, wave, level, fps, tint?.join(","), waveTint?.join(",")]);
  const box: CSSProperties = { position: "absolute", inset: 0, width: "100%", height: "100%" };
  return (
    <div className="dht-psp-themebg" data-dht-from-skin="" style={{ position: "absolute", inset: 0, isolation: "isolate" }}>
      <canvas ref={sceneRef} width={W} height={H} style={box} />
      <canvas ref={waveRef} width={W} height={H} style={box} />
    </div>
  );
}

/** Slideshow themes: one image at a time with a crossfade. Images still being decoded
 *  (404 for now) are skipped and retried; until one loads, the fallback shows. */
function XmbSlides({ urls, animate, fallback, fx, staticSlides = false }: { urls: string[]; animate: boolean; fallback: ReactNode; fx: ThemeFx; staticSlides?: boolean }) {
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [shown, setShown] = useState(false);
  const bad = useRef(new Set<number>());
  const next = (from: number) => {
    for (let k = 1; k <= urls.length; k++) {
      const c = (from + k) % urls.length;
      if (!bad.current.has(c)) return c;
    }
    return from;
  };
  useEffect(() => {
    const t = setInterval(() => setIdx((cur) => { const n = next(cur); if (n !== cur) setPrev(cur); return n; }), animate ? fx.slideSec * 1000 : 30000);
    return () => clearInterval(t);
  }, [urls, animate, fx.slideSec]);
  useEffect(() => {
    // retry images that were not decoded yet: often at first, rarely later
    const t = setInterval(() => { if (bad.current.size) { bad.current.clear(); setRound((r) => r + 1); } }, shown ? 60000 : 3000);
    return () => clearInterval(t);
  }, [shown]);
  const src = (i: number) => (round ? `${urls[i]}?r=${round}` : urls[i]);
  const hold = animate ? fx.slideSec * 1000 : 30000, fade = animate ? fx.fadeMs : 1800;
  // each picture drifts slowly (pan + zoom), the next one dissolves in over it
  const img = (i: number, top: boolean) => (
    <div key={`${i}-${round}`} className="dht-xmb-slide-frame"
      style={{ position: "absolute", inset: 0, overflow: "hidden", zIndex: top ? 1 : 0, animation: top && prev !== null ? `dhtSlideIn ${fade}ms cubic-bezier(.4,0,.2,1) both` : undefined }}>
      <img src={src(i)} alt="" className="dht-xmb-slide"
        onLoad={() => top && setShown(true)}
        onError={() => { bad.current.add(i); if (top) setIdx((cur) => (cur === i ? next(i) : cur)); }}
        style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", willChange: "transform",
          animation: animate && (fx.kenBurns ?? !staticSlides) ? `dhtKenBurns${i % 4} ${hold + fade * 2}ms linear both` : undefined }} />
    </div>
  );
  return (
    // own stacking context, so the slides' z-order never lifts them over the XMB itself
    <div className="dht-xmb-slides" data-dht-from-skin="" style={{ position: "absolute", inset: 0, isolation: "isolate" }}>
      {!shown && fallback}
      <style>{`@keyframes dhtSlideIn { from { opacity: 0 } to { opacity: 1 } }
@keyframes dhtKenBurns0 { from { transform: scale(1.03) translate(0, 0) } to { transform: scale(1.14) translate(-2.2%, -1.4%) } }
@keyframes dhtKenBurns1 { from { transform: scale(1.14) translate(2%, 1.2%) } to { transform: scale(1.04) translate(0, 0) } }
@keyframes dhtKenBurns2 { from { transform: scale(1.05) translate(-2%, 1.5%) } to { transform: scale(1.13) translate(1.6%, -1%) } }
@keyframes dhtKenBurns3 { from { transform: scale(1.12) translate(0, -2%) } to { transform: scale(1.03) translate(-1.2%, 1%) } }`}</style>
      {prev !== null && prev !== idx && img(prev, false)}
      {img(idx, true)}
      {shown && <div style={{ position: "absolute", inset: 0, zIndex: 2, background: "rgba(0,0,0,0.3)" }} />}
    </div>
  );
}

/** PS3: a silky ribbon of many thin translucent strands drifting across the screen. */
function drawPs3Wave(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const strands = 22;
  const base = h * 0.56;
  ctx.globalCompositeOperation = "lighter";
  // soft glow band behind the strands
  const g = ctx.createLinearGradient(0, base - h * 0.16, 0, base + h * 0.2);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.5, "rgba(255,255,255,0.05)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, base - h * 0.16, w, h * 0.36);
  for (let k = 0; k < strands; k++) {
    const p = k / strands;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 16) {
      const u = x / w;
      const y =
        base +
        Math.sin(u * 5.2 + t * 0.35 + p * 1.6) * h * 0.06 +
        Math.sin(u * 2.3 - t * 0.22 + p * 3.1) * h * (0.04 + p * 0.03) +
        Math.sin(u * 9.0 + t * 0.6 + p * 0.7) * h * 0.008 +
        (p - 0.5) * h * 0.07;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255,255,255,${0.035 + 0.05 * Math.sin(p * Math.PI)})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

/** PSP: two broad, soft folds of light low on the screen, each with a faint crest. */
function drawPspWave(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const fold = (base: number, amp: number, freq: number, speed: number, phase: number, sheet: number, edge: number) => {
    const pts: [number, number][] = [];
    for (let x = 0; x <= w + 20; x += 20) {
      const u = x / w;
      pts.push([x, (base + amp * Math.sin(u * Math.PI * 2 * freq + t * speed + phase) + amp * 0.35 * Math.sin(u * Math.PI * 2 * freq * 2.1 - t * speed * 0.6)) * h]);
    }
    const grad = ctx.createLinearGradient(0, base * h - amp * h, 0, h);
    grad.addColorStop(0, `rgba(255,255,255,${sheet})`);
    grad.addColorStop(0.35, `rgba(255,255,255,${sheet * 0.7})`);
    grad.addColorStop(1, `rgba(255,255,255,${sheet * 0.25})`);
    ctx.beginPath();
    ctx.moveTo(0, h);
    pts.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.strokeStyle = `rgba(255,255,255,${edge * 0.45})`;
    ctx.lineWidth = h * 0.02;
    ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${edge})`;
    ctx.lineWidth = Math.max(1.5, h * 0.004);
    ctx.stroke();
  };
  fold(0.62, 0.045, 0.8, -0.38, 1.7, 0.09, 0.12);
  fold(0.75, 0.06, 0.42, 0.3, 3.1, 0.1, 0.14);
}

/** A .ctf's own font (its .pgf, converted to TrueType by the backend) for the XMB's text. */
const loadedFonts = new Map<string, Promise<string | null>>();
function useThemeFont(font: { name: string; ttf: string } | null) {
  const [family, setFamily] = useState<string | null>(null);
  useEffect(() => {
    if (!font) return setFamily(null);
    let p = loadedFonts.get(font.ttf);
    if (!p) {
      const fam = `dht-psp-${loadedFonts.size + 1}`;
      p = (async () => {
        try {
          const buf = await (await fetch(font.ttf)).arrayBuffer();
          const face = new FontFace(fam, buf);
          await face.load();
          (document.fonts as any).add(face);
          return fam;
        } catch {
          return null;
        }
      })();
      loadedFonts.set(font.ttf, p);
    }
    let alive = true;
    p.then((f) => alive && setFamily(f));
    return () => { alive = false; };
  }, [font?.ttf]);
  return family;
}
function ThemeFontStyle({ font }: { font: { name: string; ttf: string } | null }) {
  const family = useThemeFont(font);
  return family ? <style>{`.dht-root{--dht-xmb-font:"${family}"}`}</style> : null;
}

/** Text colours a .ctf sets in its firmware layout files, as CSS variables for the XMB's text. */
function themeTextCss(t: NonNullable<P3tSkin["text"]>) {
  const sh = (x?: ThemeText) => (x ? `${x.shadowX * 1.4}px ${x.shadowY * 1.4}px ${Math.max(1, Math.hypot(x.shadowX, x.shadowY))}px ${x.shadow}` : "");
  const v: string[] = [];
  if (t.label) v.push(`--dht-xmb-text:${t.label.color}`, `--dht-xmb-text-shadow:${sh(t.label)}`);
  if (t.clock) v.push(`--dht-xmb-clock:${t.clock.color}`, `--dht-xmb-clock-shadow:${sh(t.clock)}`, `--dht-xmb-clock-alpha:${t.clock.alpha ?? 1}`);
  // text sizes relative to the firmware's own (clock 7.6, item names 8.2)
  if (t.clock?.size) v.push(`--dht-xmb-clock-scale:${(t.clock.size / 7.6).toFixed(3)}`);
  if (t.label?.size) v.push(`--dht-xmb-text-scale:${(t.label.size / 8.2).toFixed(3)}`);
  const rules = [`.dht-root{${v.join(";")}}`];
  // a second colour makes the text a top-to-bottom gradient, as the PSP draws it
  const grad = (x: ThemeText | undefined, sel: string) => {
    if (!x || !x.color2 || x.color2 === x.color) return;
    rules.push(`${sel}{background:linear-gradient(${x.color},${x.color2})!important;-webkit-background-clip:text!important;background-clip:text!important;-webkit-text-fill-color:transparent;text-shadow:none!important;filter:drop-shadow(${sh(x) || "0 0 0 #0000"})!important}`);
  };
  grad(t.clock, ".dht-xmb-clock > span");
  grad(t.label, ".dht-xmb-title");
  return rules.join("");
}

// ───────────── status ─────────────
/** A theme's battery picture: frames stacked vertically, full → empty. */
function BatterySprite({ src, frames, level, h, band }: { src: string; frames: number; level: number; h: number; band?: boolean }) {
  const [ar, setAr] = useState(0);
  const [native, setNative] = useState(0);
  useEffect(() => {
    const im = new Image();
    im.onload = () => { setAr(im.naturalWidth / (im.naturalHeight / frames)); setNative(im.naturalHeight / frames); };
    im.src = src;
  }, [src, frames]);
  if (!ar) return null;
  const f = level > 0.66 ? 0 : level > 0.33 ? 1 : level > 0.1 ? 2 : 3;
  // some themes draw the whole status bar into this picture: a 480-wide strip (dark band + the battery at its right end)
  // that belongs at the top edge of the screen; `h` is then the size of one native pixel
  const wide = ar > 8;
  if (wide !== !!band) return null;
  if (band) return <div className="dht-xmb-statusband" style={{ position: "absolute", left: 0, top: 0, width: h * native * ar, height: h * native, pointerEvents: "none", backgroundImage: `url(${src})`, backgroundSize: `100% ${frames * 100}%`, backgroundPosition: `0 ${(Math.min(f, frames - 1) / Math.max(1, frames - 1)) * 100}%`, backgroundRepeat: "no-repeat" }} />;
  return <div className="dht-xmb-battery" style={{ width: h * ar, height: h, backgroundImage: `url(${src})`, backgroundSize: `100% ${frames * 100}%`, backgroundPosition: `0 ${(Math.min(f, frames - 1) / Math.max(1, frames - 1)) * 100}%`, backgroundRepeat: "no-repeat" }} />;
}

/** Width and height of a PNG data URL, read from its header (cached). */
const pngDims = new Map<string, [number, number] | null>();
function pngDim(url: string | undefined): [number, number] | null {
  if (!url) return null;
  if (pngDims.has(url)) return pngDims.get(url)!;
  let r: [number, number] | null = null;
  try {
    const m = /^data:image\/png;base64,([A-Za-z0-9+/]{32})/.exec(url);
    if (m) {
      const b = atob(m[1]);
      const rd = (o: number) => ((b.charCodeAt(o) << 24) | (b.charCodeAt(o + 1) << 16) | (b.charCodeAt(o + 2) << 8) | b.charCodeAt(o + 3)) >>> 0;
      r = [rd(16), rd(20)];
    }
  } catch {
    r = null;
  }
  pngDims.set(url, r);
  return r;
}

/** An item picture's own name (console_themes._baked_name): its band in picture rows, the letters' colour, and for letters inside a
 *  tile the tile's colour and the letters' columns. */
type BakedName = { h: number; top: number; bottom: number; color: string; fill?: string; x0?: number; x1?: number };

// where the PSP firmware draws the clock (480 × 272 screen, centre origin, y up): the right end of the text and the middle of its line
const CLOCK_HOME = { x: 203, y: 123 };
/** The clock's letter size (em) in layout units at object scale 1. Real shots put the capitals 8.6 to 12.9 units tall at scale 1
 *  (Midnight Black 6 at 0.7, Organ Final 7 at 0.7, Persona 3 11 at 1.0, Blackstorm 9 at 0.7): about 10, which is an em of 14. */
const CLOCK_PX = 14;
/** The console's date and time take about 8.9 layout units per character at object scale 1 (107 units for "16/5 6:59 PM"). */
const CLOCK_CHAR = 8.9;

/** Persona 3's battery readout: the words "BATTERY" "CHARGE" and the percentage, each sliding down-left along a line turned
 *  17 degrees, one after another, over a faint band (layout: system_plugin_fg.rco; the places are layout units from the
 *  screen's top-left corner region, so they follow the 480 × 272 screen's scale). */
function BatteryBannerView({ banner, u, W, level, charging, animate }: { banner: NonNullable<NonNullable<P3tSkin["status"]>["banner"]>; u: number; W: number; level: number; charging: boolean; animate: boolean }) {
  const px = (x: number) => W / 2 + x * u, py = (y: number) => (136 - y) * u;
  const frame = level > 0.66 ? 0 : level > 0.33 ? 1 : level > 0.1 ? 2 : 3;
  const bg = banner.bg;
  const frozenAt = (it: { dur: number; delay: number }) => Math.max(0, ((4900 - it.delay) / it.dur) % 1);
  return (
    <div className="dht-xmb-banner" style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none" }}>
      <style>{"@keyframes dhtBanner{from{transform:translate(0,0) rotate(var(--r))}to{transform:translate(var(--dx),var(--dy)) rotate(var(--r))}} @keyframes dhtAmber{0%{opacity:0}66.67%{opacity:0}80%{opacity:1}86.67%{opacity:1}100%{opacity:0}}"}</style>
      {/* while charging the layout fades the charging words and the percentage between white and amber (colour 1, .8, .3), a 7.5 s loop
          (battery_charging2, started 750 ms after the swap): white until 6.75 s, amber by 7.75 s, held to 8.25 s, white again by 9.25 s */}
      {charging && animate && <svg width="0" height="0" style={{ position: "absolute" }}><filter id="dhtAmberTint" colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="1 0 0 0 0  0 .8 0 0 0  0 0 .3 0 0  0 0 0 1 0" /></filter></svg>}
      {bg && <div style={{ position: "absolute", left: px(bg.x) - (bg.w * u) / 2, top: py(bg.y) - (bg.h * u) / 2, width: bg.w * u, height: bg.h * u, background: bg.color, WebkitMaskImage: `url(${bg.img})`, maskImage: `url(${bg.img})`, WebkitMaskSize: "100% 100%", maskSize: "100% 100%", transform: `rotate(${bg.rot}deg)` }} />}
      {banner.items.map((it, i) => (
        <div key={i} style={{
          // the two word sets swap like the layout's anim_battery_charging / anim_battery_not_charging: the old words fade out over
          // 250 ms, then the new ones fade in over the next 250 ms (colour steps to alpha 0 / 1, the second after a 250 ms delay)
          ...(it.show === "always" ? {} : { opacity: (it.show === "charging") === charging ? 1 : 0, transition: animate ? `opacity 250ms linear ${(it.show === "charging") === charging ? 250 : 0}ms` : undefined }),
          position: "absolute", left: px(it.x) - (it.w * u) / 2, top: py(it.y) - (it.h * u) / 2, width: it.w * u, height: it.h * u,
          backgroundImage: `url(${it.img})`, backgroundRepeat: "no-repeat",
          backgroundSize: it.frames ? `100% ${it.frames * 100}%` : "100% 100%",
          backgroundPosition: it.frames ? `0 ${(Math.min(frame, it.frames - 1) / Math.max(1, it.frames - 1)) * 100}%` : undefined,
          ["--r" as any]: `${it.rot}deg`, ["--dx" as any]: `${it.dx * u}px`, ["--dy" as any]: `${-it.dy * u}px`,
          // without animations: one frozen moment, 4.9 s into the loop, when all three are on their way
          ...(animate
            ? { transform: `rotate(${it.rot}deg)`, animation: `dhtBanner ${it.dur}ms linear ${it.delay}ms infinite backwards` }
            : { transform: `translate(${it.dx * u * frozenAt(it)}px, ${-it.dy * u * frozenAt(it)}px) rotate(${it.rot}deg)` }),
        }}>
          {charging && animate && it.show !== "idle" && <div style={{ position: "absolute", inset: 0, backgroundImage: "inherit", backgroundSize: "inherit", backgroundPosition: "inherit", backgroundRepeat: "no-repeat", filter: "url(#dhtAmberTint)", opacity: 0, animation: "dhtAmber 7500ms linear 1750ms infinite" }} />}
        </div>
      ))}
    </div>
  );
}

function XmbStatus({ variant, now, h24, k = 1, battery, clock, animate = true }: { variant: Variant; now: Date; h24: boolean; k?: number; battery?: P3tSkin["status"]; clock?: ThemeText; animate?: boolean }) {
  const bat = useBattery();
  const { W, H } = useStage();
  const date = fmtDate(now);
  // The clock is drawn at the layout's size: the console's date and time are about 8.9 layout units per character at object scale 1.
  // The typefaces differ, so the text is measured once drawn: a wider one is made smaller, a narrower one keeps its letter size
  // and is spaced out to the console's width (growing it instead made the capitals up to 40% taller than on the real shots).
  const clockText = `${date} ${fmtTime(now, h24)}`;
  const spanRef = useRef<HTMLSpanElement>(null);
  const [{ fit, ls }, setFitting] = useState({ fit: 1, ls: 0 });
  const clockU = Math.min(W / 480, H / 272), clockK = k * (clock?.scale ?? 1);
  useEffect(() => {
    const measure = () => {
      const el = spanRef.current;
      if (!el) return;
      // the layout width (offsetWidth), not the drawn one: the stage is scaled to the screen, and the drawn width would carry that
      // scale into the size twice (the clock came out 1/scale too big wherever the stage is not drawn 1:1, e.g. the preview or a TV)
      const w = el.offsetWidth || el.getBoundingClientRect().width;
      if (!w) return;
      const n = clockText.length, natural = (w - ls * n) / fit; // the width at fit 1 without spacing
      const want = CLOCK_CHAR * n * clockU * clockK;
      const next = natural > want ? { fit: Math.max(0.4, want / natural), ls: 0 } : { fit: 1, ls: (want - natural) / n };
      if (Math.abs(next.fit - fit) > 0.015 || Math.abs(next.ls - ls) > 0.25) setFitting(next);
    };
    measure();
    // a theme's own font arrives after the first drawing: the text changes width, which measures it again
    const ro = typeof ResizeObserver !== "undefined" && spanRef.current ? new ResizeObserver(measure) : null;
    if (ro && spanRef.current) ro.observe(spanRef.current);
    const timers = [150, 500, 1200, 3000].map((ms) => setTimeout(measure, ms)); // …and a few more looks in case the observer misses it
    return () => { ro?.disconnect(); timers.forEach(clearTimeout); };
  }, [clockText, clockU, clockK, fit, ls]);
  if (variant === "psp") {
    // a theme can move the clock (e.g. to the bottom of the screen)
    const u = clockU;
    // The place is vshmain.prx's, not the layout's: the text's right end and the middle of its line, stock 203 and 123 (layout units
    // from the centre, y up), moved by a theme's module patch (console_themes reads them as "right" and "mid"; checked on 276 real
    // shots). The layout's own x/y are not used by the console.
    const place = clock as (ThemeText & { right?: number; mid?: number }) | undefined;
    const anchorX = W / 2 + (place?.right ?? CLOCK_HOME.x) * u;
    const cy = (136 - (place?.mid ?? CLOCK_HOME.y)) * u;
    const banner = battery?.banner;
    const level = bat ? (bat.charging ? 1 : bat.level) : 1;
    return (
      <>
      {battery && !banner && <BatterySprite src={battery.battery} frames={battery.frames} level={bat ? (bat.charging ? 1 : bat.level) : 1} h={u} band />}
      {banner && bat && <BatteryBannerView banner={banner} u={u} W={W} level={level} charging={!!bat.charging} animate={animate} />}
      {/* the text: its right end at the place (stock 443 of 480), its line's middle at the height (stock 13 from the top) */}
      <div className="dht-xmb-clock dht-statusbar" style={{ position: "absolute", left: anchorX, top: cy, transform: "translate(-100%, -50%)", whiteSpace: "nowrap", color: "var(--dht-xmb-clock, #fff)", fontFamily: "var(--dht-xmb-font, inherit)", fontSize: `calc(${CLOCK_PX * u * clockK * fit}px * var(--dht-xmb-clock-scale, 1))`, lineHeight: 1, textShadow: "var(--dht-xmb-clock-shadow, 0 1px 3px rgba(0,0,0,0.5))" }}>
        <span ref={spanRef} style={{ opacity: "var(--dht-xmb-clock-alpha, 1)" as any, letterSpacing: ls ? `${ls}px` : undefined, marginRight: ls ? -ls : undefined }}>
          {clockText}
        </span>
      </div>
      {bat && !banner && (
        <div style={{ position: "absolute", left: W / 2 + 210 * u, top: cy, transform: "translateY(-50%)" }}>
          {battery ? <BatterySprite src={battery.battery} frames={battery.frames} level={bat.charging ? 1 : bat.level} h={10 * u} /> : <BatteryGlyph level={bat.level} charging={bat.charging} w={21 * u} />}
        </div>
      )}
      </>
    );
  }
  return (
    <div className="dht-xmb-clock dht-statusbar" style={{ position: "absolute", top: 34, right: 0, display: "flex", alignItems: "center" }}>
      <div
        style={{
          padding: "6px 60px 6px 22px",
          color: "#fff",
          fontSize: 22,
          background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.14) 20%, rgba(255,255,255,0.14))",
          borderTop: "1px solid rgba(255,255,255,0.35)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        {bat && <BatteryGlyph level={bat.level} charging={bat.charging} w={30} />}
        <span>
          {date} {fmtTime(now, h24)}
        </span>
      </div>
    </div>
  );
}

// ───────────── main ─────────────
export function XmbHome({ variant }: { variant: Variant }) {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const pspSkin = usePsp();
  // console proportions: chosen, or Auto with a theme file applied (its wallpaper's selector marks and 1:1 pictures are drawn for
  // the console's places; with the compact layout Persona 3 FES's selector circle sat beside the selected row)
  const accurate = variant === "psp" && (s.xmb.pspSize === "console" || (s.xmb.pspSize === "auto" && !!pspFile(s) && !!pspSkin && !pspSkin.stock));
  const L = useMemo(() => (accurate ? pspAccurateLayout(W, H, s.tvMode) : variant === "ps3" ? { ...LAYOUT.ps3, catX: ps3ColumnX(W, H) } : LAYOUT[variant]), [accurate, W, H, s.tvMode, variant]);
  const now = useClock(15000);
  const menu = useMenu();
  const p3tSkin = useP3t();
  const shots = useScreenshots();
  // Icons when no .p3t skin supplies one: a PS3 icon set if the build has one
  // (xmb-ps3), else the RetroArch "monochrome" set (CC BY 4.0), else drawn.
  const vids = useVideos();
  const downloads = useDownloads();
  const music = useMusic();
  const player = usePlayer();
  const downloadsRef = useRef(downloads);
  downloadsRef.current = downloads;
  // settings per theme file; the console's own look without a theme file has its own entry ("psp:" / "ps3:")
  const fx = themeFx(s, xmbFxKey(s, variant));
  const rawSkin = variant === "ps3" ? p3tSkin : pspSkin;
  // the parts of the theme file the user switched off are simply left out
  const skin = useMemo<P3tSkin | null>(
    () =>
      rawSkin && {
        ...rawSkin,
        icons: fx.icons ? rawSkin.icons : {},
        visuals: fx.visuals ? rawSkin.visuals : {},
        backgrounds: fx.background ? rawSkin.backgrounds : [],
        slides: fx.background ? rawSkin.slides : [],
      },
    [rawSkin, fx.icons, fx.visuals, fx.background],
  );
  const vis = (k: XmbVisual) => (k === "focus" ? rawSkin?.visuals?.[k] : skin?.visuals?.[k]);
  const skinIcon=(key:string)=>{
    const aliases:Record<string,string[]>={icon_setting_item:["icon_system_setting"],icon_psn:["icon_psnetwork","icon_accountmanage"],icon_store:variant==="ps3"?["icon_psstore","icon_network"]:["icon_psstore"],icon_photo_album_default:["icon_photo"]};
    return skin?.icons[key] ?? aliases[key]?.map(k=>skin?.icons[k]).find(Boolean);
  };

  const colorIdx = variant === "ps3" ? s.xmb.ps3Color : s.xmb.pspColor;
  // a PS3 theme can set the XMB colour (1–12 = a month's colour; 0 = by month); your own choice wins
  const themeColor = variant === "ps3" && fx.labels ? rawSkin?.look?.color ?? 0 : 0;
  const month = colorIdx >= 0 ? colorIdx : themeColor >= 1 && themeColor <= 12 ? themeColor - 1 : now.getMonth();
  const cssColor = useCssVar("--dht-xmb-color");
  // Standard options → Colour picks the wave colour when the XMB's own colour is left on "by month"
  const tint = colorIdx < 0 && /^#/.test(s.tint) ? s.tint : "";
  const color = hex(cssColor || tint || (variant === "ps3" ? PS3_MONTHS : PSP_MONTHS)[month]);

  const gameItem = (g: Game): XItem => ({ key: `g${g.appid}`, label: g.name, sub: fmtPlaytime(g.playtime, g.lastPlayed, true), game: g });
  const folderItems = (games: Game[]) => () => games.map(gameItem);

  const cats: XCat[] = useMemo(() => {
    const themeItems = (): XItem[] => presetGroups().map(group=>({key:group.name,label:group.name,icon:"folder",children:()=>group.presets.map(p=>({key:p.id,label:p.label,icon:"palette",sub:p.id===currentPresetId()?"Current preset":undefined,action:()=>applyPreset(p)}))}));
    const colorItems = (): XItem[] => [
      { key: "c-auto", label: "Automatic (by month)", icon: "palette", sub: colorIdx < 0 ? "Selected" : undefined, action: () => setColor(-1) },
      ...MONTH_NAMES.map((m, i) => ({ key: `c-${i}`, label: m, icon: "palette" as IconName, sub: colorIdx === i ? "Selected" : undefined, action: () => setColor(i) })),
    ];
    const setColor = (i: number) => updateSettings((p) => ({ xmb: { ...p.xmb, [variant === "ps3" ? "ps3Color" : "pspColor"]: i } }));
    const games: XItem[] = [];
    games.push({ key: "lib", p3t: "icon_gamedata", label: "Library", icon: "library", sub: "All games and collections", action: () => openSteam("library") });
    if (s.xmb.collectionFolders) {
      for (const c of api.lib.collections) games.push({ key: `col-${c.id}`, label: c.name, icon: "folder", p3t: "icon_savedata", sub: `${c.games.length} items`, children: folderItems(c.games) });
    }
    const firstGame = games.length;
    api.lib.games.forEach((g) => games.push(gameItem(g)));
    const settingsCat: XCat = {
      key: "settings",
      label: "Settings",
      icon: "gear",
      p3t: "icon_setting",
      items: [
        { key: "theme", p3t: "icon_theme_setting", label: "Presets", icon: "palette", sub: "Switch console + skin", children: themeItems },
        { key: "color", p3t: "icon_display_setting", label: "Background Colour", icon: "palette", sub: colorIdx < 0 ? "Automatic" : MONTH_NAMES[colorIdx], children: colorItems },
        { key: "clock", p3t: "icon_datetime_setting", label: "Date and Time Settings", icon: "clock", sub: s.clock24 ? "24-hour clock" : "12-hour clock", action: () => updateSettings({ clock24: !s.clock24 }) },
        { key: "sfx", p3t: "icon_sound_setting", label: "Sound Settings", icon: "sound", sub: s.sounds ? "Sound effects on" : "Sound effects off", action: () => updateSettings({ sounds: !s.sounds }) },
        { key: "tsound", p3t: "icon_sound_setting", label: "Trailer Sound", icon: "video", sub: s.trailers.sound ? "On: trailers in game icons play with sound" : "Off: trailers in game icons are silent", action: () => updateSettings((p) => ({ trailers: { ...p.trailers, sound: !p.trailers.sound } })) },
        { key: "tprev", p3t: "icon_video", label: "Animated Icons", icon: "video", sub: s.trailers.preview ? "On: resting on a game plays its trailer" : "Off", action: () => updateSettings((p) => ({ trailers: { ...p.trailers, preview: !p.trailers.preview } })) },
        { key: "home", p3t: "icon_setting_item", label: "Theme Options", icon: "gear", sub: "Icons, brightness, theme file, intro, sounds…", action: api.openSettings },
        { key: "steam", p3t: "icon_system_setting", label: "System Settings", icon: "steam", sub: "Steam settings", action: () => openSteam("settings") },
      ],
    };
    // Steam's download queue as a list, each with its progress bar (the Steam page stays one entry away)
    const downloadItems = (): XItem[] => [
      ...downloadsRef.current.items.map((d): XItem => {
        const g = api.lib.byId.get(d.appid);
        return {
          key: `dl${d.appid}`,
          label: g?.name ?? `App ${d.appid}`,
          icon: "download",
          p3t: "icon_download",
          image: g?.art.landscape[0],
          dl: d.appid,
          action: () => {
            const now = downloadsRef.current.byApp.get(d.appid);
            menu.open([
              now?.paused || !now?.active ? { label: "Download now", action: () => resumeDownload(d.appid) } : { label: "Pause", action: () => pauseDownload(d.appid) },
              { label: "Remove from queue", action: () => removeDownload(d.appid) },
              { label: "Steam Downloads", action: () => openSteam("downloads") },
            ], g?.name);
          },
        };
      }),
      ...(downloadsRef.current.items.length ? [] : [{ key: "dl-none", label: "No downloads", icon: "download" as IconName, p3t: "icon_download", sub: "Games and updates Steam is downloading show up here" }]),
      { key: "dl-steam", label: "Steam Downloads", icon: "steam", p3t: "icon_download", sub: "Steam's own download page", action: () => openSteam("downloads") },
    ];
    const network: XCat = {
      key: "network",
      label: "Network",
      icon: "globe",
      p3t: "icon_network",
      items: [

        { key: "web", p3t: "icon_browser", label: "Internet Browser", icon: "globe", action: () => openSteam("browser") },
        { key: "dl", p3t: "icon_download", label: "Downloads", icon: "download", children: downloadItems },
      ],
    };
    // Photo: Steam screenshots, one folder per game (like the console's photo albums)
    const photoItems: XItem[] = [{ key: "shots", p3t: "icon_photo_album_default", visual: "photoAlbum", label: "All Screenshots", icon: "photo", sub: shots ? `${shots.length} pictures` : "Loading…", action: () => api.openMedia() }];
    if (shots) {
      const byApp = new Map<number, typeof shots>();
      shots.forEach((sh) => byApp.set(sh.appid, [...(byApp.get(sh.appid) ?? []), sh]));
      for (const [appid, list] of byApp) {
        const name = api.lib.byId.get(appid)?.name ?? (appid ? `App ${appid}` : "Steam");
        photoItems.push({
          key: `ph${appid}`,
          visual: "photoShots",
          label: name,
          sub: `${list.length} screenshot${list.length === 1 ? "" : "s"}`,
          icon: "photo",
          p3t: "icon_photo_album_default",
          children: () => list.map((sh, i) => ({ key: sh.url, label: sh.created ? new Date(sh.created * 1000).toLocaleString() : `Screenshot ${i + 1}`, sub: name, image: sh.url, icon: "photo" as IconName, action: () => api.openMedia(appid, i) })),
        });
      }
    }
    const photo: XCat = { key: "photo", label: "Photo", icon: "photo", p3t: "icon_photo", items: photoItems };
    // Video: videos stored on the Deck (Steam recordings, files); store trailers optional
    const videoItems: XItem[] = [];
    if (s.trailers.video)
      videoItems.push({
        key: "trailers",
        label: "Game Trailers",
        icon: "folder",
        p3t: "icon_video",
        sub: "Store trailers for your games",
        children: () => api.lib.games.filter((g) => !g.shortcut).map((g) => ({ key: `v${g.appid}`, label: g.name, sub: "Trailer", game: g, trailer: true })),
      });
    if (vids === null) videoItems.push({ key: "vload", label: "Looking for videos…", icon: "video", p3t: "icon_video", visual: "loading" });
    else {
      for (const v of vids) {
        const g = v.appid ? api.lib.byId.get(v.appid) : undefined;
        const kind = v.kind === "clip" ? "Clip" : v.kind === "recording" ? "Recording" : v.folder;
        const date = v.created ? new Date(v.created * 1000).toLocaleDateString() : "";
        videoItems.push({
          key: `lv${v.id}`,
          label: v.kind === "file" ? v.name : g?.name ?? (v.appid ? `App ${v.appid}` : "Steam"),
          sub: [kind, date, fmtDuration(v.duration) || fmtSize(v.size)].filter(Boolean).join(" · "),
          icon: "video",
          p3t: "icon_video",
          image: v.thumb || g?.art.landscape[0],
          video: v,
          action: () => api.playVideo(v),
        });
      }
      if (!vids.length) videoItems.push({ key: "vnone", label: "No videos", icon: "video", p3t: "icon_video", visual: "unknown", sub: "Steam game recordings and videos in Videos, Downloads or on an SD card show up here" });
    }
    const video: XCat = { key: "video", label: "Video", icon: "video", p3t: "icon_video", items: videoItems };
    // PSP: Extras only exists when the theme has an Extras ("+") icon, like on firmware that shows it
    // …and only when that icon belongs to the theme's category row: a one-bar theme whose bar has no "+" (Large Original Midnight
    // Black: 7 icons, its icon_extras is a lone "+") would otherwise show the "+" alone in place of the whole row (the bar vanished)
    const cb = variant === "psp" ? skin?.catBar : undefined;
    const extrasOn = variant === "psp" && !!skin?.icons?.icon_extras
      && (!cb || cb.tilt != null || (cb.row ? !!cb.marks?.icon_extras : pngDim(skin.icons.icon_extras)?.[0] === cb.w));
    if (api.lib.apps.length && !extrasOn)
      network.items.push({ key: "apps", p3t: "icon_setting_item", label: "Applications", icon: "apps", sub: `${api.lib.apps.length} apps`, children: () => api.lib.apps.map((g) => ({ key: `a${g.appid}`, label: g.name, game: g, sub: "Application" })) });
    // Music: soundtracks and music files on the Deck, one folder per album, played by the music player
    const playAlbum = (al: MusicAlbum, i: number) => {
      musicPlayer.play(al, i);
      if (variant !== "psp") musicPlayer.show(false); // the PS3 plays music while you keep browsing
    };
    const musicItems: XItem[] = [];
    if (player.album) {
      const t = player.album.tracks[player.index];
      musicItems.push({ key: "m-now", label: t?.title ?? "Now Playing", icon: "music", p3t: "icon_music", visual: "musicTrack", sub: `Now playing · ${player.album.name}`, track: { album: player.album.id, index: player.index }, action: () => (variant === "psp" ? musicPlayer.show(true) : musicPlayer.toggle()) });
    }
    if (music === null) musicItems.push({ key: "m-load", label: "Looking for music…", icon: "music", p3t: "icon_music", visual: "loading" });
    else {
      for (const al of music)
        musicItems.push({
          key: `al${al.id}`,
          label: al.name,
          icon: "folder",
          p3t: "icon_music",
          visual: al.cover ? undefined : "musicAlbum",
          image: al.cover || undefined,
          sub: [`${al.tracks.length} track${al.tracks.length === 1 ? "" : "s"}`, al.artist, al.source === "steam" ? "Steam soundtrack" : "Music folder"].filter(Boolean).join(" · "),
          children: () => al.tracks.map((t, i) => ({ key: `tr${t.id}`, label: t.title, icon: "music" as IconName, p3t: "icon_music", visual: "musicTrack" as XmbVisual, sub: [al.name, t.disc].filter(Boolean).join(" · "), track: { album: al.id, index: i }, action: () => playAlbum(al, i) })),
        });
      if (!music.length) musicItems.push({ key: "m-none", label: "No music", icon: "music", p3t: "icon_music", visual: "unknown", sub: "Steam soundtracks and music in Music or on an SD card show up here" });
    }
    musicItems.push({ key: "player", label: "Music Player", icon: "music", p3t: "icon_music", sub: "Albums, queue, shuffle and repeat", action: () => openDestination({ place: "music" }) });
    const music_: XCat = { key: "music", label: "Music", icon: "music", p3t: "icon_music", items: musicItems };
    const psn: XCat = {key:"psn",label:"PlayStation Network",icon:"psn",p3t:"icon_psn",items:[{key:"store",label:"PlayStation Store",sub:"Steam Store catalog",icon:"store",p3t:"icon_store",action:()=>openSteam("store")},{key:"account",label:"Account",icon:"user",p3t:"icon_user",action:()=>openSteam("friends")}]};
    const tv: XCat = {key:"tv",label:"TV / Video Services",icon:"tv",p3t:"icon_tv",items:[{key:"trailers",label:"Game Trailers",icon:"video",p3t:"icon_video",children:()=>api.lib.games.filter(g=>!g.shortcut).map(g=>({key:`tr${g.appid}`,label:g.name,game:g,trailer:true}))},...api.lib.apps.map(g=>({key:`app${g.appid}`,label:g.name,game:g,icon:"apps" as IconName}))]};
    // a PSP opens every category on its top entry; the PS3 starts the Game column on the first game
    const game: XCat = { key: "game", label: "Game", icon: "game", p3t: "icon_game", items: games, start: variant === "psp" ? 0 : Math.min(firstGame, games.length - 1) };
    if (variant === "psp") {
      // Extras (the "+" category of later PSP firmware): Steam's tools, non-Steam shortcuts and apps
      const shortcuts = api.lib.games.filter((g) => g.shortcut);
      const extras: XCat = {
        key: "extras",
        label: "Extras",
        icon: "plus",
        p3t: "icon_extras",
        items: [
          ...(shortcuts.length ? [{ key: "x-short", label: "Non-Steam Games", icon: "folder" as IconName, p3t: "icon_savedata", sub: `${shortcuts.length} shortcuts`, children: () => shortcuts.map(gameItem) }] : []),
          ...(api.lib.apps.length ? [{ key: "x-apps", label: "Applications", icon: "apps" as IconName, p3t: "icon_setting_item", sub: `${api.lib.apps.length} apps`, children: () => api.lib.apps.map((g) => ({ key: `a${g.appid}`, label: g.name, game: g, sub: "Application" })) }] : []),
          { key: "x-search", label: "Search", icon: "search", p3t: "icon_inet_search", sub: "Search Steam", action: () => openSteam("search") },
          { key: "x-notes", label: "Notifications", icon: "bell", p3t: "icon_rss", action: () => openSteam("notifications") },
          { key: "x-qam", label: "Steam Quick Access", icon: "dots", sub: "Steam's side menu: notifications, plugins, options for all themes", action: () => openSteam("qam") },
        ],
      };
      return extrasOn ? [settingsCat, extras, photo, music_, video, game, network, psn] : [settingsCat, photo, music_, video, game, network, psn];
    }
    const users: XCat = {
      key: "users",
      label: "Users",
      icon: "user",
      p3t: "icon_user",
      items: [
        { key: "me", p3t: "icon_user", label: api.user, icon: "user", sub: "Signed in", action: () => openSteam("friends") },
        { key: "off", p3t: "icon_setting_item", label: "Turn Off System", icon: "power", action: () => openSteam("power") },
        { key: "steamhome", p3t: "icon_user", label: "Home", icon: "home", sub: "Show Steam's own home", action: api.showSteamHome },
      ],
      start: 0,
    };
    const friends: XCat = { key: "friends", label: "Friends", icon: "friends", p3t: "icon_friend", items: [{ key: "chat", p3t: "icon_chat", label: "Friends & Chat", icon: "friends", action: () => openSteam("friends") }] };
    return [users, settingsCat, photo, music_, video, tv, game, network, psn, friends];
  }, [api.lib, s.theme, s.clock24, s.sounds, colorIdx, s.xmb.collectionFolders, api.user, shots, vids, s.trailers.video, s.trailers.sound, s.trailers.preview, skin, music, player.album?.id, player.index]);

  const gameCat = cats.findIndex((c) => c.key === "game");
  const [catIdx, setCatIdx] = useRemembered(`${variant}-cat-v2`, gameCat);
  const [sels, setSels] = useRemembered<Record<string, number>>(`${variant}-sels`, {});
  const [stack, setStack] = useState<{ label: string; items: XItem[]; sel: number }[]>([]);

  const cat = cats[clamp(catIdx, 0, cats.length - 1)];
  const inFolder = stack.length > 0;
  const items = inFolder ? stack[stack.length - 1].items : cat.items;
  const selRaw = inFolder ? stack[stack.length - 1].sel : sels[cat.key] ?? cat.start ?? 0;
  const sel = clamp(selRaw, 0, Math.max(0, items.length - 1));
  const cur = items[sel];
  useReportFocus(cur?.game);

  // Rest on a game for a moment → its trailer plays inside the icon and its art becomes the backdrop.
  const [previewKey, setPreviewKey] = useState("");
  const [backdrop, setBackdrop] = useState<Game | null>(null);
  useEffect(() => {
    setPreviewKey("");
    setBackdrop(null);
    if (!s.trailers.preview || !cur || api.busy) return;
    const g = cur.game ?? (cur.video?.appid ? api.lib.byId.get(cur.video.appid) : undefined);
    if (!cur.game && !cur.video) return;
    const backdropDelay = variant === "psp" ? 2500 : 900;
    const trailerDelay = variant === "psp" ? 3200 : 1600;
    const t1 = g ? setTimeout(() => setBackdrop(g), backdropDelay) : 0;
    const t2 = setTimeout(() => (cur.video || (cur.game && !cur.game.shortcut)) && setPreviewKey(cur.key), trailerDelay);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [variant, cur?.key, s.trailers.preview, api.busy]);

  // PSP: the info bar drops down when a download starts or finishes
  const [infoMsg, setInfoMsg] = useState("");
  const seenDl = useRef<Map<number, { active: boolean; completed: boolean }> | null>(null);
  useEffect(() => {
    const before = seenDl.current;
    seenDl.current = new Map(downloads.items.map((d) => [d.appid, { active: d.active, completed: d.completed }]));
    if (!before) return;
    const name = (id: number) => api.lib.byId.get(id)?.name ?? `App ${id}`;
    const done = downloads.items.find((d) => d.completed && before.get(d.appid) && !before.get(d.appid)!.completed);
    const started = downloads.items.find((d) => d.active && !d.completed && !before.get(d.appid)?.active);
    const msg = done ? `Download complete: ${name(done.appid)}` : started ? `Downloading: ${name(started.appid)}` : "";
    if (msg) setInfoMsg(msg);
  }, [downloads]);
  useEffect(() => {
    if (!infoMsg) return;
    const t = setTimeout(() => setInfoMsg(""), 4500);
    return () => clearTimeout(t);
  }, [infoMsg]);

  const setSel = (i: number) => {
    if (inFolder) setStack((st) => [...st.slice(0, -1), { ...st[st.length - 1], sel: i }]);
    else setSels((m) => ({ ...m, [cat.key]: i }));
  };

  // the Game, Music and Photo areas have their own confirm / cancel sounds on a PSP
  const area = cat.key === "game" ? "game" : cat.key === "music" ? "music" : cat.key === "photo" ? "photo" : null;
  const selectSound = () => playSound(area ? (`${area}Select` as SoundKind) : "select");
  const backSound = () => playSound(area ? (`${area}Back` as SoundKind) : "back");
  const activate = (it: XItem | undefined) => {
    if (!it) return;
    if (it.children) {
      const kids = it.children();
      setStack((st) => [...st, { label: it.label, items: kids, sel: 0 }]);
      selectSound();
    } else if (it.game && it.trailer) {
      api.playTrailer(it.game);
    } else if (it.game) {
      api.activate(it.game, () => {
        if (musicPlayer.state().album) musicPlayer.stop(); // a game takes over the sound, like on the console
        api.launch(it.game!);
      });
    } else if (it.action) {
      selectSound();
      it.action();
    }
  };

  const options = () => {
    const extra: MenuItem[] = [
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home", action: api.showSteamHome },
    ];
    // music (a track, the album folders, "Now Playing", "Music Player"): the options of the console's music player —
    // Shuffle and Repeat like the PS3's mini control panel, Crossfade like its Music Settings
    if (cur && (cur.track || cat?.key === "music")) {
      const playing = musicPlayer.state().album;
      menu.open([...musicPlaybackItems(), ...(playing ? [{ label: "Stop", action: () => musicPlayer.stop() }] : []), ...extra], "Music");
      return;
    }
    if (cur?.game) {
      const g = cur.game;
      menu.open([{ label: "Start", action: () => api.launch(g) }, { label: "Watch Trailer", action: () => api.playTrailer(g) }, { label: "Information", action: () => api.details(g) }, { label: "Game Options", action: () => api.nativeMenu(g) }, ...extra], g.name);
    } else menu.open(extra);
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const n = items.length;
    switch (p.btn) {
      case "up":
      case "down": {
        const d = p.btn === "up" ? -1 : 1;
        const next = clamp(sel + d, 0, n - 1);
        if (next !== sel) {
          setSel(next);
          playSound("move");
        }
        return true;
      }
      case "l1":
      case "r1": {
        const next = clamp(sel + (p.btn === "l1" ? -8 : 8), 0, n - 1);
        if (next !== sel) {
          setSel(next);
          playSound("move");
        }
        return true;
      }
      case "left":
      case "right": {
        if (inFolder) {
          if (p.btn === "left") {
            setStack((st) => st.slice(0, -1));
            backSound();
          }
          return true;
        }
        const next = clamp(catIdx + (p.btn === "left" ? -1 : 1), 0, cats.length - 1);
        if (next !== catIdx) {
          setCatIdx(next);
          playSound("tab");
        }
        return true;
      }
      case "a":
        activate(cur);
        return true;
      case "b":
        if (inFolder) {
          setStack((st) => st.slice(0, -1));
          backSound();
          return true;
        }
        return false;
      case "y":
        options();
        return true;
      case "menu":
        if (cur?.game) api.nativeMenu(cur.game);
        return true;
    }
    return false;
  };

  // ───── geometry ─────
  const catY = H * L.catY;
  // a theme whose category pictures are one wide bar: drawn at native size (480 × 272 pixels scaled to the screen), all in the same
  // place, centred and flush with the bottom edge
  const bar = variant === "psp" ? skin?.catBar ?? null : null;
  const words = variant === "psp" && !bar ? skin?.catText ?? null : null;
  // Theme art drawn at the console's size (one-bar category rows, the large family's item pictures) follows the layout in use:
  // 1:1 PSP pixels with "PSP proportions" on, else the default layout's smaller scale (its icons are ~0.63 of the console's),
  // so these themes no longer come out 1.6x bigger than every other PSP theme (Large Original XMB, Midnight Black, Organ, Blackstorm).
  // Kept 1:1: a turned bar (Persona 3: banner and list are one composition) and a bar as wide as the screen (Midnight Black's glass
  // band, Organ's word strip: a frame along the bottom edge that cannot shrink; their item pictures stay with it, as on real shots).
  const wordK = Math.min(W / 480, H / 272) * ((s.iconSizes?.[s.theme] ?? 100) / 100);
  const itemK = wordK * (bar?.tilt || (bar && bar.w >= 470) ? 1 : pspArtFit(variant, accurate, W, H));
  const barK = itemK;
  // …and the item list hangs from the layout's category container, not from the bar: the selected row sits at the container's
  // place (Blackstorm, Midnight Black: the middle of the screen; Persona 3: turned with the bar, just above its left end),
  // the rows above and below it in a column through that place, and the bar is drawn over the rows that run under it
  const nat = Math.min(W / 480, H / 272);
  const hang = bar && bar.ix != null && bar.iy != null ? { x: W / 2 + bar.ix * nat, y: bar.tilt ? H - (136 + bar.iy) * nat : H / 2 - bar.iy * nat } : null;
  const itemX = hang ? hang.x : L.catX; // column centre
  // The "large" XMB family (Large Original, Midnight Black, Blue Neon, Large Black/White, Organ; console_themes sets catBar.big): the
  // item pictures carry their own names and the console's names are patched off the screen. Real shots (pspunk.com, YouTube frames of
  // Settings / Photo / Network / Game) show only the selected item, its picture 1:1 centred on the container (the screen's middle).
  // Our items are not the console's, so the picture's own name is covered and ours is written in its place, in its colour.
  const bigBar = bar as (NonNullable<typeof bar> & { big?: boolean; names?: Record<string, BakedName> }) | null;
  const big = !!(hang && bigBar?.big);
  const bakedNames = (big && bigBar?.names) || {};
  // where the name goes for an item whose picture has none (a game, a folder): the middle one of the theme's own names
  const typicalName = useMemo(() => {
    const v = Object.values(bakedNames).filter((n) => !n.fill).sort((a, b) => a.bottom - a.top - (b.bottom - b.top));
    const all = v.length ? v : Object.values(bakedNames);
    return all.length ? all[Math.floor(all.length / 2)] : null;
  }, [bakedNames]);
  const bigDim = (it: XItem): [number, number] | null => {
    if (!big || it.game || it.video || it.image || !it.p3t) return null;
    const d = pngDim(skinIcon(it.p3t));
    return d ? [d[0] * itemK, d[1] * itemK] : null;
  };
  const above = (i: number) => hang
    ? hang.y - (L.iconSel[1] / 2 - L.icon[1] / 2 + 18) - (sel - i) * L.gap
    : catY - L.catIconSel * 0.5 - 40 - (sel - 1 - i) * L.gap - L.icon[1] / 2; // centre of items above the bar
  const lay = L as XmbLayout;
  // the selected row always starts below the category's name, however tall its icon is (game covers are)
  const catLabelBottom = (L.catIconSel * 1.3) / 2 + L.labelGap + (L.font - 4) * 1.3;
  const selDrop = () => Math.max(L.selGapBelow, catLabelBottom + L.labelGap + (items[sel] ? cell(items[sel], true)[1] : L.iconSel[1]) / 2);
  const below = (i: number) =>
    (hang ? hang.y : catY + selDrop()) +
    (i === sel ? 0
      : lay.pitch // PSP-accurate: even rows, like the console (a selected game icon pushes them a little further)
        ? (items[sel]?.game ? L.iconSel[1] / 2 - L.icon[1] / 2 : 0) + (i - sel) * lay.pitch
        : L.iconSel[1] / 2 - L.icon[1] / 2 + 18 + (i - sel) * L.gap);
  const cell = (it: XItem, selected: boolean): number[] => bigDim(it) ?? (lay.box && !it.game ? [lay.box, lay.box] : selected ? L.iconSel : L.icon);
  // large family: the selected picture is centred on the container's place, the rows around it follow in an even column
  const bigPitch = 78 * itemK;
  const yOf = (i: number) => (big && hang ? (i === sel ? hang.y : i < sel ? hang.y - (sel - i) * bigPitch : hang.y + 22 * itemK + (i - sel) * bigPitch) : i < sel ? above(i) : below(i));
  const lo = Math.max(0, sel - 6);
  const hi = Math.min(items.length - 1, sel + 9);

  // live state under a row: a download's progress, the playing track's time
  const dlOf = (it: XItem) => {
    const id = it.dl ?? it.game?.appid;
    const d = id != null ? downloads.byApp.get(id) : undefined;
    return d && (it.dl != null || !d.completed) ? d : undefined;
  };
  const liveSub = (it: XItem): string | undefined => {
    const d = dlOf(it);
    if (d) return downloadLine(d);
    if (it.key === "dl") {
      const n = downloads.items.filter((x) => !x.completed).length;
      return n ? `${n} in the queue${downloads.running ? " · downloading" : ""}` : "Nothing is downloading";
    }
    if (it.track && player.album?.id === it.track.album && player.index === it.track.index)
      return player.error || `${player.playing ? "▶" : "❚❚"} ${fmtClock(player.time)}${player.duration ? " / " + fmtClock(player.duration) : ""}${player.shuffle ? "  ⤨" : ""}${player.repeat === "all" ? "  ↻" : player.repeat === "one" ? "  ↻1" : ""}${player.crossfade ? `  ⇌${player.crossfade}s` : ""}`;
    return it.sub;
  };
  const musicOpen = variant === "psp" && player.open && !!player.album;
  const art: HudArt | undefined = variant === "psp" && fx.visuals ? (rawSkin?.visuals as HudArt | undefined) : undefined;
  const label: CSSProperties = { fontFamily: "var(--dht-xmb-font, inherit)", color: "var(--dht-xmb-text, #fff)", textShadow: "var(--dht-xmb-text-shadow, none)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: W - itemX - 220 };

  // the theme's shadow picture under thumbnails (games, videos, pictures) instead of a drawn one
  const shadowPic = useShadowPic(vis("shadow"));
  const withShadow = (it: XItem, selected: boolean, icon: ReactNode) => {
    const sh = shadowPic;
    if (!sh || !(it.game || it.video || it.image)) return icon;
    const [iw, ih] = cell(it, selected);
    if(it.key==="me"&&customProfilePicture())return <img src={customProfilePicture()} alt="Custom profile picture" style={{width:iw,height:ih,objectFit:"cover",borderRadius:8}}/>;
    return (
      <div className="dht-xmb-shadowed" style={{ position: "relative", width: iw, height: ih, flexShrink: 0 }}>
        <img src={sh} alt="" style={{ position: "absolute", left: -iw * 0.225, top: -ih * 0.225 + ih * 0.04, width: iw * 1.45, height: ih * 1.45, pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>{icon}</div>
      </div>
    );
  };
  const renderIcon = (it: XItem, selected: boolean) => {
    const [iw, ih] = cell(it, selected);
    if(it.key==="me"&&customProfilePicture())return <img src={customProfilePicture()} alt="Custom profile picture" style={{width:iw,height:ih,objectFit:"cover",borderRadius:8}}/>;
    if (it.game)
      return (
        <div className="dht-xmb-game-icon" data-preview={selected && previewKey === it.key} style={{ width: iw, height: ih, boxShadow: selected ? "0 6px 20px rgba(0,0,0,0.45)" : "0 3px 10px rgba(0,0,0,0.35)", overflow: "hidden", transition: "width 160ms, height 160ms", position: "relative" }}>
          {vis("defaultThumb") && <img src={vis("defaultThumb")} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
          <GameArt g={it.game} kind="landscape" style={{ width: "100%", height: "100%", position: "relative" }} />
          {/* like the console's animated icons: after resting on a game, its trailer plays inside the icon */}
          {selected && previewKey === it.key && <TrailerVideo appid={it.game.appid} seconds={18} sound={s.trailers.sound} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />}
        </div>
      );
    if (it.video)
      return (
        <div style={{ width: iw, height: ih, boxShadow: selected ? "0 6px 20px rgba(0,0,0,0.45)" : "0 3px 10px rgba(0,0,0,0.35)", overflow: "hidden", transition: "width 160ms, height 160ms", border: "2px solid rgba(255,255,255,0.85)", boxSizing: "border-box", position: "relative", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {it.image ? <img src={it.image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <Icon name="video" size={ih * 0.5} color="#fff" />}
          {/* like the console's video thumbnails: after resting on it, the video plays inside the icon */}
          {selected && previewKey === it.key && <LocalVideoView video={it.video} sound={false} loop style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />}
        </div>
      );
    if (it.image)
      return (
        <div style={{ width: iw, height: ih, boxShadow: selected ? "0 6px 20px rgba(0,0,0,0.45)" : "0 3px 10px rgba(0,0,0,0.35)", overflow: "hidden", transition: "width 160ms, height 160ms", border: "2px solid rgba(255,255,255,0.85)", boxSizing: "border-box" }}>
          <XmbImage src={it.image} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} fallback={vis("broken") ? <img src={vis("broken")} alt="" style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <StockXmbIcon name={it.icon??"photo"} size={ih*.8} variant={variant} skinFallback={!!skin}/>}/>
        </div>
      );
    const gs = selected ? L.glyphSel : L.glyph;
    const nativeSz = bigDim(it);
    const focus = selected && fx.glowItem > 0 && !nativeSz ? vis("focus") : undefined;
    const statePic = (it.visual && vis(it.visual)) || (it.icon === "folder" && !(it.p3t && skinIcon(it.p3t)) ? vis("folder") : undefined);
    return (
      <div style={{ width: iw, height: ih, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", filter: nativeSz ? undefined : focus ? "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" : selected ? "drop-shadow(0 0 10px rgba(255,255,255,0.75))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
        {focus && <img src={focus} alt="" className={`dht-xmb-focus${fx.glowPulse ? "" : " dht-xmb-nopulse"}`} style={{ position: "absolute", left: "50%", top: "50%", width: gs * 1.75 * glowSize(fx.glowItem), height: gs * 1.75 * glowSize(fx.glowItem), ["--dht-glow" as any]: fx.glowItem / 100, transform: "translate(-50%,-50%)", objectFit: "contain", pointerEvents: "none", zIndex: -1 }} />}
        {statePic ? <img src={statePic} alt="" data-icon-source="skin" data-dht-from-skin="" style={{ width: gs * 1.35, height: gs * 1.35, objectFit: "contain" }} /> : it.p3t && skinIcon(it.p3t) ? <XmbImage source="skin" src={skinIcon(it.p3t)!} style={{ width: nativeSz ? nativeSz[0] : gs * 1.35, height: nativeSz ? nativeSz[1] : gs * 1.35,objectFit:"contain" }} fallback={<StockXmbIcon name={it.icon??"folder"} size={gs*1.15} variant={variant} skinFallback={!!skin}/>}/> : <StockXmbIcon name={it.icon ?? "folder"} size={gs*1.15} variant={variant} skinFallback={!!skin}/>}
      </div>
    );
  };

  // categories drawn as words: one letter size for all of them, the longest word fitting between its neighbours
  const [, setWordsRev] = useState(0);
  const wordsLoaded = () => setWordsRev((r) => r + 1);
  const wordAspect = Math.max(1, ...cats.map((c) => (!skin?.catBar && skinIcon(c.p3t) ? wideLabel(skinIcon(c.p3t)!)?.aspect ?? 0 : 0)));
  // …and the theme's icon size setting scales them like icons (above 100% long words may touch)
  const wordH = Math.min(L.catIconSel * 0.5, (L.catGap * 0.95) / wordAspect) * ((s.iconSizes?.[s.theme] ?? 100) / 100) * (fx.wordLevel / 100);
  // bigger words push the categories apart instead of running into each other
  const catGap = wordAspect > 1 ? Math.max(L.catGap, wordH * wordAspect * 1.08) : L.catGap;

  return (
    <ThemeRoot onInput={onInput} hints={{ a: "Select", y: "Options", menu: "Options" }}>
      <Stage>
        <div style={{ position: "absolute", inset: 0, filter: fx.bgLevel !== 100 ? `brightness(${fx.bgLevel / 100})` : undefined }}>
          <XmbBackground variant={variant} color={color} animate={s.animations} now={now} skin={skin} fx={fx} month={month} />
        </div>
        {/* the selected game's own backdrop fades in after a moment, like PIC1 on the console */}
        {backdrop && (
          <div className="dht-xmb-game-backdrop" key={backdrop.appid} style={{ position: "absolute", inset: 0, animation: "dhtPic1 900ms ease-out both" }}>
            <GameHero g={backdrop} theme={variant} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.15))" }} />
          </div>
        )}
        <style>{"@keyframes dhtPic1 { from { opacity: 0 } to { opacity: 1 } } @keyframes dhtFocusIn { from { opacity: 0; transform: translate(-50%,-50%) scale(.7) } to { opacity: calc(.6 * var(--dht-glow, 1)); transform: translate(-50%,-50%) scale(1) } } @keyframes dhtFocusPulse { 0%,100% { opacity: calc(.45 * var(--dht-glow, 1)); transform: translate(-50%,-50%) scale(.97) } 50% { opacity: calc(.7 * var(--dht-glow, 1)); transform: translate(-50%,-50%) scale(1.03) } } .dht-xmb-focus { animation: dhtFocusIn 280ms cubic-bezier(.2,.8,.2,1) both, dhtFocusPulse 2.6s ease-in-out 280ms infinite; } @keyframes dhtFocusInCat { from { opacity: 0; transform: translate(-50%,-50%) scale(.7) } to { opacity: calc(1 * var(--dht-glow, 1)); transform: translate(-50%,-50%) scale(1) } } @keyframes dhtFocusPulseCat { 0%,100% { opacity: calc(.78 * var(--dht-glow, 1)); transform: translate(-50%,-50%) scale(.97) } 50% { opacity: calc(1 * var(--dht-glow, 1)); transform: translate(-50%,-50%) scale(1.04) } } .dht-xmb-focus { filter: brightness(max(1, var(--dht-glow, 1))); } .dht-xmb-focus--cat { animation: dhtFocusInCat 280ms cubic-bezier(.2,.8,.2,1) both, dhtFocusPulseCat 2.6s ease-in-out 280ms infinite; } .dht-xmb-focus.dht-xmb-nopulse { animation: dhtFocusIn 280ms cubic-bezier(.2,.8,.2,1) both; } .dht-xmb-focus--cat.dht-xmb-nopulse { animation: dhtFocusInCat 280ms cubic-bezier(.2,.8,.2,1) both; }"}</style>
        {fx.labels && skin?.text && <style>{themeTextCss(skin.text)}</style>}
        <style>{".dht-xmb-shadowed > div > div{box-shadow:none!important}"}</style>
        <ThemeFontStyle font={fx.font ? skin?.font ?? null : null} />
        {variant === "ps3" && fx.font && PS3_FONT_STYLES[rawSkin?.look?.font ?? 0] && <style>{`.dht-root{--dht-xmb-font:${PS3_FONT_STYLES[rawSkin!.look!.font!]}}`}</style>}
        <XmbStatus variant={variant} now={now} h24={s.clock24} k={s.tvMode ? 1.08 : 1} battery={fx.visuals ? rawSkin?.status : null} clock={fx.labels ? rawSkin?.text?.clock : undefined} animate={s.animations} />

        {/* category bar */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: inFolder || musicOpen ? 0 : 1, transition: "opacity 200ms", zIndex: bar ? 2 : undefined, pointerEvents: bar ? "none" : undefined }}>
          {cats.map((c, i) => {
            const selected = i === catIdx;
            if (words) {
              // words along the bottom edge, one slot each (the container's x + gap × slot), the frame behind the selected word
              const WORDS: Record<string, string> = { Settings: "Setting", Network: "Net", "PlayStation Network": "PSN®" };
              const slot = ["settings", "extras", "photo", "music", "video", "game", "network", "psn"].indexOf(c.key);
              return (
                <div key={c.key} className="dht-xmb-cat" data-selected={selected} data-name={c.label} onClick={() => { setCatIdx(i); setStack([]); playSound("tab"); }}
                  style={{ position: "absolute", left: W / 2 + (words.x + words.gap * (slot < 0 ? i : slot)) * wordK, top: H - 10 * wordK, width: words.w * wordK, height: words.h * wordK, transform: "translate(-50%,-50%)", display: "flex", alignItems: "center", justifyContent: "center", transition: "left 220ms ease-out" }}>
                  {selected && <img src={words.frame} alt="" data-icon-source="skin" data-dht-from-skin="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />}
                  <span style={{ position: "relative", fontFamily: "var(--dht-xmb-font, inherit)", color: "var(--dht-xmb-text, #fff)", fontSize: 13 * wordK, whiteSpace: "nowrap", textShadow: "0 1px 2px rgba(0,0,0,0.85)" }}>{WORDS[c.label] ?? c.label}</span>
                </div>
              );
            }
            const size = selected ? L.catIconSel : L.catIcon;
            const barred = !!bar && !!skinIcon(c.p3t);
            const x = bar ? W / 2 + (bar.dx ?? 0) * barK : itemX + (i - catIdx) * catGap;
            if (x < -200 || x > W + 200) return null;
            return (
              <div
                key={c.key}
                className="dht-xmb-cat"
                data-selected={selected}
                data-name={c.label}
                onClick={()=>{setCatIdx(i);setStack([]);playSound("tab");}}
                style={{
                  position: "absolute",
                  left: x,
                  top: barred ? H - (bar!.h * barK) / 2 + (bar!.dy ?? 0) * barK : catY,
                  transform: barred && bar!.tilt ? `translate(-50%,-50%) rotate(${bar!.tilt}deg)` : "translate(-50%,-50%)",
                  transition: "left 220ms ease-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  // a turned bar is drawn over the item rows (the rows run on under its blue band and vanish there, as on the console)
                  zIndex: barred && bar!.tilt ? 3 : undefined,
                  opacity: bar ? (selected || bar.row ? 1 : 0) : selected ? 1 : fx.catLevel / 100,
                  pointerEvents: bar ? (!selected && !bar.row ? "none" : "auto") : undefined,
                }}
              >
                <div style={{ position: "relative", filter: selected && !vis("focus") ? "drop-shadow(0 0 12px rgba(255,255,255,0.8))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}>
                  {selected && !bar && vis("focus") && fx.glowCat > 0 && <img src={vis("focus")} alt="" className={`dht-xmb-focus dht-xmb-focus--cat${fx.glowPulse ? "" : " dht-xmb-nopulse"}`} style={{ position: "absolute", left: "50%", top: "50%", width: size * 2.4 * glowSize(fx.glowCat), height: size * 2.4 * glowSize(fx.glowCat), ["--dht-glow" as any]: fx.glowCat / 100, transform: "translate(-50%,-50%)", objectFit: "contain", pointerEvents: "none", zIndex: -1 }} />}
                  {barred ? <div style={{ height: bar!.h * barK, display: "flex", alignItems: "center", position: "relative" }}><img src={skinIcon(c.p3t)!} alt="" data-icon-source="skin" data-dht-from-skin="" className="dht-xmb-cat-bar" style={{ width: "auto", height: "auto", display: "block", maxWidth: "none", imageRendering: "auto", zoom: barK }} />
                    {/* a row of single icons has no pointer in its pictures: a small ▼ over the selected icon, in the icon's colour (the real consoles show it) */}
                    {selected && bar!.row && bar!.marks?.[c.p3t] && <div className="dht-xmb-cat-mark" style={{ position: "absolute", left: `calc(50% + ${bar!.marks[c.p3t].x * barK - 5.5 * barK}px)`, top: (bar!.marks[c.p3t].y - 10) * barK, width: 11 * barK, height: 7 * barK, background: bar!.marks[c.p3t].c, clipPath: "polygon(0 0, 100% 0, 50% 100%)", pointerEvents: "none" }} />}
                  </div> : skinIcon(c.p3t) ? <CatSkinIcon src={skinIcon(c.p3t)!} size={size} wordH={wordH * (selected ? 1 : L.catIcon / L.catIconSel)} onReady={wordsLoaded} fallback={<StockXmbIcon name={c.icon} size={size*1.12} variant={variant} skinFallback={!!skin}/>}/> : <StockXmbIcon name={c.icon} size={size*1.12} variant={variant} skinFallback={!!skin}/>}
                </div>
                <div style={{ position: "absolute", display: bar || (skinIcon(c.p3t) && wideLabel(skinIcon(c.p3t)!)) ? "none" : undefined, top: (skinIcon(c.p3t) ? size * 1.3 : size * 1.12) + L.labelGap, fontFamily: "var(--dht-xmb-font, inherit)", color: "var(--dht-xmb-text, #fff)", fontSize: L.font - 4, opacity: selected ? 1 : 0, whiteSpace: "nowrap", textShadow: "var(--dht-xmb-text-shadow, 0 1px 4px rgba(0,0,0,0.5))" }}>{c.label}</div>
              </div>
            );
          })}
        </div>

        {/* the PSP's music player takes the place of the menus while it is open */}
        <div style={{ position: "absolute", inset: 0, opacity: musicOpen ? 0 : 1, transition: "opacity 200ms", pointerEvents: musicOpen ? "none" : undefined }}>
        {/* folder breadcrumb */}
        {inFolder && (
          <div style={{ position: "absolute", left: itemX - 150, top: catY - 22, display: "flex", alignItems: "center", gap: 14, color: "#fff", fontSize: L.font - 2, opacity: 0.9 }}>
            <Icon name="folder" size={L.catIcon - 10} color="#fff" />
            <span style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{stack.map((f) => f.label).join(" › ")}</span>
          </div>
        )}

        {/* item column (a turned bar turns its list with it, about the selected row) */}
        <div style={{ position: "absolute", inset: 0, transform: hang && bar?.tilt ? `rotate(${bar.tilt}deg)` : undefined, transformOrigin: hang ? `${hang.x}px ${hang.y}px` : undefined }}>
        {items.slice(lo, hi + 1).map((it, k) => {
          const i = lo + k;
          const selected = i === sel;
          const [iw, ih] = cell(it, selected);
    if(it.key==="me"&&customProfilePicture())return <img src={customProfilePicture()} alt="Custom profile picture" style={{width:iw,height:ih,objectFit:"cover",borderRadius:8}}/>;
          const y = yOf(i);
          if (y < -120 || y > H + 60) return null;
          // a turned bar (Persona 3): the rows below the selected one run down the left edge, under the bar's blue band and out past its
          // lower edge, where the console shows nothing (real shot: only the selected row's name, on the orange band)
          if (bar?.tilt && i > sel) return null;
          if (bar?.row && y + ih / 2 > H - bar.h * barK) return null; // a row of icons along the bottom: the list stops above it
          if (bar && !bar.row && !bar.tilt && !selected && y + ih / 2 > H - bar.h * barK) return null; // so does a bar's list (the console's bar covers what runs under it)
          if (big && hang) {
            // large family: only the selected item, its picture centred on the container's place
            if (!selected) return null;
            const pic = !it.game && !it.video && !it.image && it.p3t ? skinIcon(it.p3t) : undefined;
            const nm = pic && it.p3t ? bakedNames[it.p3t] : undefined;
            const ref = nm ?? typicalName;
            // the name's band in screen px from the picture's top (its own band, or the typical one hung from this picture's middle)
            const k = itemK;
            // (a tile's band is too small for a name written on the open background: such items get an 11-unit line under the picture)
            const band = nm ? { top: nm.top * k, bottom: nm.bottom * k } : ref?.fill ? { top: ih + 3 * k, bottom: ih + 14 * k } : ref ?{ top: ih / 2 + (ref.top - ref.h / 2) * k, bottom: ih / 2 + (ref.bottom - ref.h / 2) * k } : { top: ih / 2 + 22 * k, bottom: ih / 2 + 33 * k };
            if (!nm && band.top < ih + 2 * k) { const d = ih + 2 * k - band.top; band.top += d; band.bottom += d; } // a cover is taller than a picture
            const tile = !!nm?.fill; // letters inside a tile (Organ): capitals, a little smaller than the band
            // the name's colour: the picture's own; for an item without a picture, the theme's names under icons (a tile's letters
            // would be lost on the background, so those items take the theme's text colour)
            const ink = nm ? nm.color : ref && !ref.fill ? ref.color : undefined;
            // (an open-background name never gets smaller than the layout's own sub-line text: scaled-down pictures keep a readable name)
            const fs = tile ? (band.bottom - band.top) * 0.8 : Math.max((band.bottom - band.top) * 0.95, L.subFont + 2);
            // cover the picture's own name: cut the band out of the picture (a tile's band is then filled with the tile's colour)
            const cut = nm ? (nm.fill && nm.x0 != null && nm.x1 != null
              ? `polygon(evenodd, 0 0, 100% 0, 100% 100%, 0 100%, 0 0, ${nm.x0 * k}px ${nm.top * k}px, ${nm.x1 * k}px ${nm.top * k}px, ${nm.x1 * k}px ${nm.bottom * k}px, ${nm.x0 * k}px ${nm.bottom * k}px, ${nm.x0 * k}px ${nm.top * k}px)`
              : `inset(0 0 ${Math.max(0, ih - (nm.top - 1.5) * k)}px 0)`) : undefined; // 1.5 units above the band: the letters' anti-aliased tops stayed as a faint line
            return (
              <div key={it.key} className="dht-xmb-item dht-xmb-item--large" data-selected={selected} data-name={it.label} onClick={() => { setSel(i); activate(it); }}
                style={{ position: "absolute", left: hang.x - iw / 2, top: y - ih / 2, width: iw, height: ih }}>
                {pic && nm
                  ? <img src={pic} alt="" data-icon-source="skin" data-dht-from-skin="" style={{ position: "absolute", inset: 0, width: iw, height: ih, clipPath: cut, WebkitClipPath: cut } as CSSProperties} />
                  : withShadow(it, selected, renderIcon(it, selected))}
                {nm?.fill && nm.x0 != null && nm.x1 != null && <div style={{ position: "absolute", left: nm.x0 * k, top: nm.top * k, width: (nm.x1 - nm.x0) * k, height: (nm.bottom - nm.top) * k, background: nm.fill }} />}
                <div className="dht-xmb-label" style={{ position: "absolute", left: nm?.fill && nm.x0 != null && nm.x1 != null ? nm.x0 * k : "50%", width: nm?.fill && nm.x0 != null && nm.x1 != null ? (nm.x1 - nm.x0) * k : undefined, top: band.top, transform: nm?.fill ? undefined : "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", visibility: !it.game || showTitle(s, variant, selected) ? "visible" : "hidden" }}>
                  <span className="dht-xmb-title" style={{ fontFamily: tile ? "inherit" : "var(--dht-xmb-font, inherit)", color: ink ?? "var(--dht-xmb-text, #fff)", textShadow: ink ? undefined : "0 1px 2px rgba(0,0,0,0.65)", whiteSpace: "nowrap", overflow: tile ? "hidden" : undefined, textOverflow: tile ? "ellipsis" : undefined, maxWidth: tile ? "100%" : W * 0.7, fontSize: `calc(${fs}px * var(--dht-xmb-text-scale, 1))`, lineHeight: `${Math.max(band.bottom - band.top, fs)}px`, textTransform: tile ? "uppercase" : undefined, letterSpacing: tile ? "0.08em" : undefined }}>{it.label}</span>
                  {liveSub(it) && <span style={{ ...label, maxWidth: W * 0.7, fontSize: L.subFont * 0.8, opacity: 0.85, color: ink, textShadow: ink ? "none" : undefined }}>{liveSub(it)}</span>}
                </div>
              </div>
            );
          }
          return (
            <div
              key={it.key}
              className="dht-xmb-item"
              data-selected={selected}
              data-name={it.label}
              onClick={()=>{setSel(i);activate(it);}}
              style={{
                position: "absolute",
                left: itemX - iw / 2,
                top: y - ih / 2,
                display: "flex",
                alignItems: "center",
                gap: L.textGap,
                transition: "top 180ms ease-out, left 160ms",
                // PSP: list icons keep full brightness and only the names of unselected rows dim (measured on console screenshots)
                // PS3: the whole row dims (rows above the bar a little more)
                opacity: variant === "psp" || selected ? 1 : (i < sel ? 0.7 : 1) * (fx.textLevel / 100),
              }}
            >
              {!selected && fx.iconLevel < 100 ? <div style={{ opacity: fx.iconLevel / 100 }}>{withShadow(it, selected, renderIcon(it, selected))}</div> : withShadow(it, selected, renderIcon(it, selected))}
              {/* the theme's focus line under the selected row */}
              {selected && vis("focusLine") && <img src={vis("focusLine")} alt="" className="dht-xmb-focusline" style={{ position: "absolute", left: 0, top: ih + L.lineGap * 2, width: Math.min(W - (itemX - iw / 2) - 24, iw + L.textGap + 337 * (lay.box ? lay.box / 48 : 1)), height: Math.max(2, 4 * (lay.box ? lay.box / 48 : 1)), pointerEvents: "none" }} />}
              <div className="dht-xmb-label" style={{ opacity: variant === "psp" && !selected ? fx.textLevel / 100 : 1, boxShadow:"none",filter:"none",background:"transparent",display: "flex", flexDirection: "column", gap: L.lineGap, visibility: !it.game || showTitle(s, variant, selected) ? "visible" : "hidden" }}>
                <span className="dht-xmb-title" style={{ ...label, fontSize: `calc(${bar?.tilt ? (selected ? 18 : 14) * nat : selected ? L.fontSel : L.font}px * var(--dht-xmb-text-scale, 1))`, textShadow: bar?.tilt ? "1px 2px 2px rgba(0,0,0,0.8)" : "0 1px 2px rgba(0,0,0,0.65)",boxShadow:"none",filter:"none",background:"transparent" }}>{it.label}</span>
                {selected && liveSub(it) && <span style={{ ...label, fontSize: L.subFont, opacity: 0.85 }}>{liveSub(it)}</span>}
                {/* a download's bar sits under its name, selected or not (the PSP's Video download bar) */}
                {dlOf(it) && !dlOf(it)!.completed && (
                  <XmbBar value={dlOf(it)!.progress} w={Math.min(W - itemX - 240, 300 * (L.font / 22))} h={Math.max(4, L.subFont * 0.32)} base={art?.dlBase ?? art?.progressBase} fill={art?.dlBar ?? art?.progressBar} style={{ marginTop: 2, opacity: dlOf(it)!.paused ? 0.6 : 1 }} />
                )}
                {selected && it.game && <span style={{ ...label, fontSize: L.subFont - 2, opacity: 0.65 }}>Last played: {fmtLastPlayed(it.game.lastPlayed)}</span>}
                {selected && it.game && <Badges g={it.game} size={L.subFont - 4} style={{ marginTop: 4 }} />}
              </div>
            </div>
          );
        })}
        </div>
        {items.length === 0 && (
          <div style={{ position: "absolute", left: itemX - 40, top: catY + L.selGapBelow - 14, color: "#fff", opacity: 0.7, fontSize: L.font }}>There are no items.</div>
        )}
        </div>

        {variant === "psp" && <XmbInfoBar W={W} H={H} message={infoMsg} art={art} text={fx.labels ? rawSkin?.text?.info : undefined} />}
        {variant === "ps3" && <Ps3Notice W={W} message={infoMsg} art={skin?.visuals?.notice} />}
        {downloads.running && <XmbBusy W={W} H={H} art={art} />}
        {variant === "psp" && <XmbMusicScreen W={W} H={H} art={art} />}
        <MenuView menu={menu} variant={variant === "psp" ? "psp" : "xmb"} art={variant === "psp" && fx.visuals ? { panel: rawSkin?.visuals?.optionMenu, focus: rawSkin?.visuals?.menuFocus } : undefined} />
      </Stage>
    </ThemeRoot>
  );
}

export const Ps3Home = () => <XmbHome variant="ps3" />;
export const PspHome = () => <XmbHome variant="psp" />;
