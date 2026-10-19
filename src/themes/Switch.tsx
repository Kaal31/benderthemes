import {ProfileAvatar} from "../ProfileAvatar";
// Nintendo Switch home: a row of square game tiles with a bright focus frame, the game's name below,
// and a row of round system buttons (News, Shop, Album, Controllers, Settings, Power).
// A .nxtheme (see switchThemes.ts) supplies the wallpaper, optional wallpapers for "All Software" and
// "Settings", and the round button pictures; each part has its own toggle in Theme options.
import { CSSProperties, useEffect, useState } from "react";
import { GameArt, Icon, IconName, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { Game, openSteam, SteamPlace } from "../library";
import { showTitle, THEMES } from "../settings";
import { styleOf } from "../engine/themeStyles";
import { t } from "../i18n";
import { playSound, useBattery, useClock, useWallpaper } from "../steam";
import { themeSettingsItems } from "../themeSettingsMenu";
import { switchParts, useSwitchSkin } from "../switchThemes";
import { useReportFocus } from "../focus";

type Dock = { id: string; label: string; icon: IconName; art?: string; place?: SteamPlace; action?: "settings" | "album" };
const dockItems = (): Dock[] => [
  { id: "news", label: t("news"), icon: "bell", art: "news", place: "community" },
  { id: "shop", label: t("shop"), icon: "store", art: "shop", place: "store" },
  { id: "album", label: t("album"), icon: "photo", art: "album", action: "album" },
  { id: "controller", label: t("controllers"), icon: "game", art: "controller", place: "qam" },
  { id: "settings", label: t("destSettings"), icon: "gear", art: "settings", action: "settings" },
  { id: "power", label: t("destPower"), icon: "power", art: "power", place: "power" },
];
const DOCK: Dock[] = new Proxy([] as any, {
  get: (_, prop: string) => {
    const list = dockItems();
    if (prop === "length") return list.length;
    if (prop === "map") return list.map.bind(list);
    return (list as any)[prop];
  },
});
/** The console's own dock symbols, drawn as outlines (news, eShop bag, album, controller); settings and power use the shared icons. */
function DockGlyph({ id, size, color }: { id: string; size: number; color: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 3, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block" }}>
      {id === "news" && <><path {...p} d="M10 8h28a5 5 0 0 1 5 5v15a5 5 0 0 1-5 5H27l-7 8v-8H10a5 5 0 0 1-5-5V13a5 5 0 0 1 5-5z" /><path {...p} d="M13 17h22M13 25h14" /></>}
      {id === "shop" && <><path {...p} d="M9 17h30l2 23H7z" /><path {...p} d="M16 17v-3a8 8 0 0 1 16 0v3" /></>}
      {id === "album" && <><rect {...p} x="5" y="8" width="38" height="32" rx="4" /><path {...p} d="M9 35l10-12 7 8 5-5 8 9" /><circle {...p} cx="16" cy="17" r="3" /></>}
      {id === "controller" && <g transform="rotate(-45 24 24)"><rect {...p} x="15" y="2" width="18" height="44" rx="9" /><circle {...p} cx="24" cy="14" r="4" /><circle {...p} cx="24" cy="27" r="1.6" fill={color} /><circle {...p} cx="24" cy="35" r="1.6" fill={color} /></g>}
    </svg>
  );
}
/** The handheld console symbol at the left of the footer line. */
function ConsoleGlyph({ w, color, neon }: { w: number; color: string; neon?: boolean }) {
  return (
    <svg width={w} height={w * 0.47} viewBox="0 0 68 32" style={{ display: "block" }}>
      <rect x="1.5" y="1.5" width="65" height="29" rx="9" fill="none" stroke={color} strokeWidth="3" />
      <rect x="13" y="5" width="42" height="22" rx="2.5" fill={color} />
      <circle cx="7" cy="11" r="2.6" fill={neon ? "#00dcd4" : color} /><circle cx="61" cy="21" r="2.6" fill={neon ? "#e60012" : color} />
      <circle cx="59" cy="9" r="1.4" fill={color} /><circle cx="63" cy="9" r="1.4" fill={color} /><circle cx="61" cy="7" r="1.4" fill={color} /><circle cx="61" cy="11" r="1.4" fill={color} />
    </svg>
  );
}

/** The console's wifi symbol: three arcs over a dot. */
function SwitchWifi({ size, color }: { size: number; color: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 3.2, strokeLinecap: "round" } as const;
  return (
    <svg width={size} height={size * 0.76} viewBox="0 0 34 26" style={{ display: "block" }}>
      <path {...p} d="M3 9.5a20 20 0 0 1 28 0" /><path {...p} d="M8 14.8a12.5 12.5 0 0 1 18 0" /><path {...p} d="M13 19.8a5.5 5.5 0 0 1 8 0" />
      <path d="M17 25l-3-3.6a4.4 4.4 0 0 1 6 0z" fill={color} />
    </svg>
  );
}
/** The console's battery: square outline, green fill (red when low), contact nub and a bolt outside while charging. */
function SwitchBattery({ level, charging, color, w }: { level: number; charging?: boolean; color: string; w: number }) {
  const fill = Math.max(0.06, Math.min(1, level));
  return (
    <svg width={w * 1.35} height={w * 0.62} viewBox="0 0 54 25" style={{ display: "block" }}>
      <rect x="1.5" y="1.5" width="38" height="22" rx="1.5" fill="none" stroke={color} strokeWidth="3" />
      <rect x="5" y="5" width={31 * fill} height="15" fill={fill < 0.2 && !charging ? "#ff4b3a" : "#5be300"} />
      <rect x="40.5" y="8" width="3.5" height="9" rx="1" fill={color} />
      {charging && <path d="M51 1l-6 12h4.5l-2 11 7-14h-4.5z" fill={color} />}
    </svg>
  );
}

/** The console always shows the time as 24-hour H:MM in a narrow face (the Deck's 12/24 setting is not used here). */
const clock24h = (d: Date) => `${d.getHours()}:${String(d.getMinutes()).padStart(2, "0")}`;
const CLOCK_FONT = '"DIN Condensed", "Barlow Condensed", "Roboto Condensed", "Arial Narrow", sans-serif';
const DOCK_COLOR: Record<string, string> = { news: "#e60012", shop: "#f5a623", album: "#2d7fe0", controller: "#777" }; // the console's coloured buttons; the others stay grey
const CSS = `:root{--dht-switch-accent:#00dcd4;}
.dht-switch-focus{box-shadow:inset 0 0 0 3px var(--dht-switch-accent,#00dcd4),inset 0 0 0 6px #fff,inset 0 0 0 7px var(--dht-switch-accent,#00dcd4);animation:dhtSwitchPulse 1.3s ease-in-out infinite alternate;pointer-events:none}
@keyframes dhtSwitchPulse{from{opacity:.82}to{opacity:1}}`;

/** Average brightness (0..1) of a picture, measured in the page for wallpapers the backend could not measure. */
export function useLuma(url: string | null, known?: number): number | undefined {
  const [v, setV] = useState<number | undefined>(known);
  useEffect(() => {
    setV(known);
    if (!url || known !== undefined) return;
    let alive = true;
    const img = new Image();
    img.onload = () => {
      try {
        const c = document.createElement("canvas"); c.width = 16; c.height = 9;
        const g = c.getContext("2d"); if (!g) return;
        g.drawImage(img, 0, 0, 16, 9);
        const d = g.getImageData(0, 0, 16, 9).data; let t = 0;
        for (let i = 0; i < d.length; i += 4) t += d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        if (alive) setV(t / (d.length / 4) / 255);
      } catch { /* leave the default text colour */ }
    };
    img.src = url;
    return () => { alive = false; };
  }, [url, known]);
  return v;
}

export function SwitchHome() {
  const api = useHome(), s = api.settings, { W, H } = useStage(), menu = useMenu();
  const now = useClock(15000), bat = useBattery(), skin = useSwitchSkin();
  const [view, setView] = useState<"home" | "apps" | "set" | "lock">("home");
  // presets v2: the preset's Background (any installed picture) takes the theme wallpaper's place
  const wall = useWallpaper("switch");
  const parts0 = switchParts(skin, view);
  const parts = wall ? { ...parts0, background: wall, brightness: undefined, own: false } : parts0;
  const luma = useLuma(parts.background, parts.brightness);
  const switchColor = styleOf(s, "switch")<"light" | "dark">("themeColor");
  const isDarkTheme = switchColor === "dark";
  const dark = isDarkTheme || (parts.background ? (luma ?? 0.5) < 0.55 : false);
  const ink = dark ? "#ffffff" : "#2d2d2d";
  const games = api.lib.games;
  const [sel, setSel] = useRemembered("switch-sel", 0);
  const [row, setRow] = useState<"tiles" | "dock">("tiles");
  const [dsel, setDsel] = useState(0), [asel, setAsel] = useState(0);
  const n = games.length; // tiles: the games, then "All Software"
  const cur = clamp(sel, 0, n);
  const g: Game | undefined = games[cur];
  useReportFocus(view === "apps" ? games[asel] : view === "home" && row === "tiles" ? g : undefined);
  const COLS = 6;

  useEffect(() => { if (view === "set" && !menu.isOpen) setView("home"); }, [menu.isOpen, view]);

  const options = () => menu.open([
    ...(g ? [{ label: t("start"), action: () => api.launch(g) }, { label: t("information"), action: () => api.details(g) }, { label: t("gameOptions"), action: () => api.nativeMenu(g) }] : []),
    ...(skin?.screens.lock?.background ? [{ label: t("lockScreen"), action: () => setView("lock") }] : []),
    { label: t("destMainMenu"), action: api.showSteamHome },
  ], g?.name ?? "Switch");
  const runDock = (i: number) => {
    const d = DOCK[i]; playSound("select");
    if (d.action === "album") api.openMedia();
    else if (d.action === "settings") { setView("set"); menu.open([...themeSettingsItems(), { label: t("presets"), sub: () => themeMenu(s.theme, api.switchTheme, THEMES) }, { label: t("homeScreenSettings"), action: api.openSettings }], t("destSettings"), { page: true }); }
    else if (d.place) openSteam(d.place);
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (view === "lock") return setView("home"), playSound("tab"), true; // any button wakes the console
    if (b === "y" || b === "menu") return options(), true;
    if (view === "apps") {
      const move = (d: number) => { const k = clamp(asel + d, 0, Math.max(0, n - 1)); if (k !== asel) (setAsel(k), playSound("move")); };
      if (b === "left") move(-1); else if (b === "right") move(1); else if (b === "up") move(-COLS); else if (b === "down") move(COLS);
      else if (b === "b") (setView("home"), playSound("tab"));
      else if (b === "a" && games[asel]) api.activate(games[asel], () => api.launch(games[asel]));
      return true;
    }
    if (row === "dock") {
      if (b === "left" || b === "right") { const k = clamp(dsel + (b === "left" ? -1 : 1), 0, DOCK.length - 1); if (k !== dsel) (setDsel(k), playSound("move")); }
      else if (b === "up" || b === "b") (setRow("tiles"), playSound("tab"));
      else if (b === "a") runDock(dsel);
      return true;
    }
    if (b === "left" || b === "right" || b === "l1" || b === "r1") {
      const k = clamp(cur + (b === "left" ? -1 : b === "right" ? 1 : b === "l1" ? -4 : 4), 0, n);
      if (k !== cur) (setSel(k), playSound("tile"));
    } else if (b === "down") (setRow("dock"), playSound("tab"));
    else if (b === "a") {
      playSound("select");
      if (g) api.activate(g, () => api.launch(g)); else (setAsel(0), setView("apps"));
    } else if (b === "x" && g) api.launch(g);
    else return false;
    return true;
  };

  const k = W / 1280; // layout is drawn for 1280 wide, as on the console
  const T = 262 * k, F = 276 * k, GAP = 4 * k, startX = 100 * k; // tile, focused tile, gap (tiles sit almost edge to edge)
  const scroll = Math.max(0, cur - 3) * (T + GAP);
  const tileX = (i: number) => startX + i * (T + GAP) - scroll + (i > cur ? F - T : 0);
  const tileY = H * 0.29;
  const dockY = H * 0.7;
  const label = (i: number) => i < n ? games[i].name : t("allSoftware");
  const bg: CSSProperties = parts.background
    ? { backgroundImage: `url(${parts.background})`, backgroundSize: "cover", backgroundPosition: "center" }
    : { background: isDarkTheme ? "var(--dht-switch-bg, #1a1a1a)" : "var(--dht-switch-bg, linear-gradient(#ececec,#dcdcdc))" };

  return (
    <ThemeRoot onInput={onInput} hints={{ a: t("open"), y: t("options"), b: view === "home" ? undefined : t("back") } as any}>
      <Stage background={isDarkTheme ? "#1a1a1a" : "#e6e6e6"}>
        <style>{`:root{--dht-switch-accent:${isDarkTheme ? "#e60012" : "#00dcd4"};}\n${CSS}`}</style>
        <div className="dht-switch-bg" data-dht-from-skin={parts.background ? "" : undefined} data-view={view} style={{ position: "absolute", inset: 0, ...bg }} />
        {view === "lock" && (
          <div className="dht-switch-lock" style={{ position: "absolute", inset: 0, zIndex: 20, color: ink, textShadow: dark ? "0 1px 6px #000a" : "none", fontFamily: "inherit" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: `url(${parts.background})`, backgroundSize: "cover", backgroundPosition: "center" }} />
            <div style={{ position: "absolute", left: 0, right: 0, top: H * 0.38, textAlign: "center", fontSize: 96, fontWeight: 300 }}>{clock24h(now)}</div>
            <div style={{ position: "absolute", left: 0, right: 0, bottom: H * 0.08, textAlign: "center", fontSize: 20 }}>{t("pressAnyButton")}</div>
          </div>
        )}
        <div className="dht-switch-status" style={{ position: "absolute", top: 34 * k, left: 60 * k, right: 50 * k, display: "flex", alignItems: "center", gap: 24 * k, color: ink, fontSize: 26 * k, textShadow: dark ? "0 1px 4px #0008" : "none" }}>
          <div style={{ width: 60 * k, height: 60 * k, borderRadius: "50%", background: dark ? "#2d2d2d" : "#ffffff55", border: `2px dashed ${dark ? "#555" : "#aaa"}`, display: "flex", alignItems: "center", justifyContent: "center" }}><ProfileAvatar size={56*k} fallback={<Icon name="user" size={34 * k} color={ink} />}/></div>
          <span style={{ fontSize: 20 * k, opacity: 0.8, color: dark ? "#ffffff" : ink }}>{api.user}</span><span style={{ flex: 1 }} />
          <span className="dht-switch-clock" style={{ fontFamily: CLOCK_FONT, fontWeight: 600, fontSize: 29 * k, fontVariantNumeric: "tabular-nums", letterSpacing: 2, display: "inline-block", transform: "scaleX(0.84)", transformOrigin: "right center", marginLeft: -6 * k, color: dark ? "#ffffff" : ink }}>{clock24h(now)}</span>
          <SwitchWifi size={34 * k} color={ink} />
          {bat && <><span style={{ fontSize: 24 * k, color: dark ? "#ffffff" : ink }}>{Math.round(bat.level * 100)}<small style={{ fontSize: 15 * k, color: dark ? "#b0b0b0" : undefined }}>%</small></span><SwitchBattery level={bat.level} charging={bat.charging} color={ink} w={42 * k} /></>}
        </div>
        <div className="dht-switch-footer" style={{ position: "absolute", left: 30 * k, right: 30 * k, bottom: 0, height: 72 * k, borderTop: `1.5px solid ${dark ? "#3a3a3a" : "#555"}`, color: dark ? "#b0b0b0" : ink, display: "flex", alignItems: "center", justifyContent: "space-between", padding: `0 ${30 * k}px`, fontSize: 24 * k, textShadow: dark ? "0 1px 4px #0008" : "none", pointerEvents: "none" }}>
          <ConsoleGlyph w={68 * k} color={dark ? "#ffffff" : ink} neon={isDarkTheme} />
          <span style={{ display: "flex", gap: 36 * k }}>
            <span style={{ display: "flex", alignItems: "center", gap: 10 * k }}><b style={{ width: 28 * k, height: 28 * k, borderRadius: "50%", background: dark ? "#ffffff" : ink, color: dark ? "#1a1a1a" : "#e8e8e8", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 24 * k, lineHeight: 1 }}>+</b><span style={{ color: dark ? "#ffffff" : undefined }}>{t("options")}</span></span>
            <span style={{ display: "flex", alignItems: "center", gap: 10 * k }}><b style={{ width: 28 * k, height: 28 * k, borderRadius: "50%", background: dark ? "#ffffff" : ink, color: dark ? "#1a1a1a" : "#e8e8e8", display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 17 * k }}>A</b><span style={{ color: dark ? "#ffffff" : undefined }}>{view === "home" ? t("start") : t("open")}</span></span>
          </span>
        </div>

        {view === "apps" ? (
          <div className="dht-switch-apps" style={{ position: "absolute", left: 90, right: 90, top: H * 0.16, bottom: 40, display: "grid", gridTemplateColumns: `repeat(${COLS},1fr)`, gap: 18, alignContent: "start", overflowY: "hidden" }}>
            {games.slice(Math.floor(asel / COLS) * COLS, Math.floor(asel / COLS) * COLS + COLS * 4).map((gm, i) => {
              const idx = Math.floor(asel / COLS) * COLS + i, on = idx === asel;
              return <div key={gm.appid} className="dht-switch-tile" data-selected={on} data-name={gm.name} onClick={() => { setAsel(idx); api.activate(gm, () => api.launch(gm)); }} style={{ aspectRatio: "1", position: "relative", overflow: "hidden", background: isDarkTheme ? "#2d2d2d" : "#222" }}>
                <GameArt g={gm} kind="portrait" position="50% 22%" style={{ width: "100%", height: "100%" }} />
                {on && <div className="dht-switch-focus" style={{ position: "absolute", inset: 0 }} />}
              </div>;
            })}
          </div>
        ) : <>
          {Array.from({ length: n + 1 }, (_, i) => i).filter((i) => i >= cur - 4 && i <= cur + 8).map((i) => {
            const on = i === cur, size = on ? F : T, game = games[i];
            return <div key={i < n ? game.appid : "all"} className="dht-switch-tile" data-selected={on && row === "tiles"} data-name={label(i)}
              onClick={() => { setRow("tiles"); if (on) { if (game) api.activate(game, () => api.launch(game)); else setView("apps"); } else { setSel(i); playSound("move"); } }}
              style={{ position: "absolute", left: tileX(i), top: tileY - (on ? (F - T) / 2 : 0), width: size, height: size, transition: "left 160ms ease-out, width 140ms, height 140ms, top 140ms", background: game ? "#222" : isDarkTheme ? "#2d2d2d" : "linear-gradient(145deg,#f5f5f5,#cfcfcf)", overflow: "hidden" }}>
              {game ? <GameArt g={game} kind="portrait" position="50% 22%" style={{ width: "100%", height: "100%" }} />
                : <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, color: isDarkTheme ? "#ffffff" : "#444", fontSize: on ? 22 : 17 }}><Icon name="apps" size={on ? 64 : 48} color={isDarkTheme ? "#ffffff" : "#444"} />{t("allSoftware")}</div>}
              {on && row === "tiles" && <div className="dht-switch-focus" style={{ position: "absolute", inset: 0 }} />}
            </div>;
          })}
          <div className="dht-switch-title" style={{ position: "absolute", left: startX - 28 * k, top: tileY - (F - T) / 2 - 56 * k, width: W - 2 * startX, display: "flex", alignItems: "center", gap: 12 * k, color: parts.background ? ink : isDarkTheme ? "#ffffff" : "var(--dht-switch-title, #19bcc4)", fontSize: 26 * k, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textShadow: dark ? "0 1px 5px #000a" : "none" }}>
            <span style={{ width: 20 * k, height: 26 * k, background: isDarkTheme ? "#e60012" : "currentColor", borderRadius: 3, flex: "none", clipPath: "polygon(0 0,100% 0,100% 100%,50% 82%,0 100%)" }} />
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{!g || showTitle(s, "switch", true) ? label(cur) : ""}</span>
          </div>
          {n === 0 && <div style={{ position: "absolute", left: startX, top: H * 0.62, color: ink, opacity: 0.7, fontSize: 18 }}>{t("noGamesFound")}</div>}
          <div className="dht-switch-dock" style={{ position: "absolute", left: 0, right: 0, top: dockY, display: "flex", justifyContent: "center", gap: 20 * k }}>
            {DOCK.map((d, i) => {
              const on = row === "dock" && i === dsel, art = d.art ? parts.icons[d.art] : undefined;
              return <div key={d.id} className="dht-switch-dock-item" data-selected={on} data-name={d.label} onClick={() => { setRow("dock"); setDsel(i); runDock(i); }} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, width: 88 * k }}>
                <div className={on ? "dht-switch-focus" : undefined} style={{ width: 80 * k, height: 80 * k, borderRadius: "50%", background: dark ? "#2d2d2d" : "#fff", border: `1.5px dashed ${dark ? "#555" : "#bbb"}`, display: "flex", alignItems: "center", justifyContent: "center", transform: on ? "scale(1.12)" : "none", transition: "transform 120ms" }}>
                  {art ? <img src={art} alt="" style={{ width: 44, height: 38, objectFit: "contain" }} /> : (d.id === "settings" || d.id === "power" ? <Icon name={d.icon} size={36 * k} color={dark ? "#fff" : DOCK_COLOR[d.id] ?? "#666"} /> : <DockGlyph id={d.id} size={40 * k} color={dark ? "#fff" : DOCK_COLOR[d.id] ?? "#666"} />)}
                </div>
                <span style={{ color: on ? (isDarkTheme ? "#e60012" : ink) : (dark ? "#b0b0b0" : ink), fontSize: 14, opacity: on ? 1 : 0, textShadow: dark ? "0 1px 4px #000a" : "none" }}>{d.label}</span>
              </div>;
            })}
          </div>
        </>}
        <MenuView menu={menu} variant="switch" />
      </Stage>
    </ThemeRoot>
  );
}
