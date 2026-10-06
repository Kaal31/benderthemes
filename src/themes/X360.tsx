// Xbox 360 Metro-era dashboard: lowercase pivots across the top and a
// horizontally scrolling field of flat tiles on a light background.
import { BladesHome, NxeHome } from "./X360Classic";
import { CSSProperties, useMemo, useState } from "react";
import { GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, spatial, Stage, ThemeRoot, useStage } from "../input";
import { fmtPlaytime, Game, openSteam } from "../library";
import { showTitle, THEMES } from "../settings";
import { Badges } from "../badges";
import { fmtTime, playSound, useClock, useWallpaper } from "../steam";

interface XTile {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  game?: Game;
  art?: "landscape" | "portrait" | "hero";
  icon?: IconName;
  color?: string;
  run: () => void;
}
const GREEN = "var(--dht-x360-accent, #107c10)";
const FONT = `var(--dht-font, "Segoe UI", "Segoe UI Light", "Motiva Sans", "Helvetica Neue", Arial, sans-serif)`;

/** Xbox 360: the dashboard era chosen in settings (Metro is this file). */
export function X360Home() {
  const style = useHome().settings.x360?.style ?? "metro";
  if (style === "blades") return <BladesHome />;
  if (style === "nxe" || style === "kinect") return <NxeHome variant={style} />;
  return <X360MetroHome />;
}

function X360MetroHome() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const now = useClock(15000);
  const wall = useWallpaper("x360");
  const menu = useMenu();
  const games = api.lib.games;

  const play = (g: Game) => () => api.activate(g, () => api.launch(g));
  const themes = () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), "presets");

  const pivots = useMemo(() => {
    const sys = (key: string, x: number, y: number, w: number, h: number, label: string, icon: IconName, run: () => void, color = GREEN): XTile => ({ key, x, y, w, h, label, icon, color, run });
    // home
    const home: XTile[] = [];
    if (games[0]) home.push({ key: "h0", x: 0, y: 0, w: 560, h: 315, label: games[0].name, game: games[0], art: "hero", run: play(games[0]) });
    else home.push(sys("h0", 0, 0, 560, 315, "steam library", "library", () => openSteam("library")));
    [1, 2, 3, 4].forEach((n, k) => {
      const g = games[n];
      const x = 575 + (k % 2) * 285;
      const y = (k >> 1) * 165;
      if (g) home.push({ key: `h${n}`, x, y, w: 270, h: 150, label: g.name, game: g, art: "landscape", run: play(g) });
    });
    const smalls: [string, IconName, () => void][] = [
      ["my games", "game", () => setPivot(2)],
      ["steam store", "store", () => openSteam("store")],
      ["friends", "friends", () => openSteam("friends")],
      ["downloads", "download", () => openSteam("downloads")],
    ];
    smalls.forEach(([label, icon, run], k) => home.push(sys(`hs${k}`, k * 285, 335, 270, 120, label, icon, run, k === 0 ? GREEN : "#2d2d2d")));
    // social
    const social: XTile[] = [
      sys("me", 0, 0, 300, 455, api.user, "user", () => openSteam("friends")),
      sys("fr", 315, 0, 270, 220, "friends", "friends", () => openSteam("friends"), "#2d2d2d"),
      sys("chat", 315, 235, 270, 220, "messages", "bell", () => openSteam("friends"), "#2d2d2d"),
    ];
    // games: two rows of box art
    const gtiles: XTile[] = [sys("gl", 0, 0, 220, 455, "game library", "library", () => openSteam("library"))];
    games.forEach((g, i) => {
      const col = Math.floor(i / 2);
      const row = i % 2;
      gtiles.push({ key: `g${g.appid}`, x: 235 + col * 165, y: row * 235, w: 150, h: 220, label: g.name, game: g, art: "portrait", run: play(g) });
    });
    // apps
    const apps: XTile[] = [
      sys("web", 0, 0, 270, 220, "internet explorer", "globe", () => openSteam("browser")),
      sys("media", 0, 235, 270, 220, "pictures", "photo", () => api.openMedia(), "#2d2d2d"),
      sys("store2", 285, 0, 270, 220, "marketplace", "store", () => openSteam("store"), "#2d2d2d"),
      sys("dl2", 285, 235, 270, 220, "active downloads", "download", () => openSteam("downloads"), "#2d2d2d"),
    ];
    api.lib.apps.forEach((g, i) => apps.push({ key: `a${g.appid}`, x: 570 + Math.floor(i / 2) * 285, y: (i % 2) * 235, w: 270, h: 220, label: g.name, game: g, art: "landscape", run: () => api.launch(g) }));
    // settings
    const settings: XTile[] = [
      sys("theme", 0, 0, 270, 220, "presets", "palette", themes),
      sys("hs", 0, 235, 270, 220, "home settings", "gear", api.openSettings, "#2d2d2d"),
      sys("sys", 285, 0, 270, 220, "system", "steam", () => openSteam("settings"), "#2d2d2d"),
      sys("pw", 285, 235, 270, 220, "turn off", "power", () => openSteam("power"), "#2d2d2d"),
      sys("steamhome", 570, 0, 270, 220, "home", "home", api.showSteamHome, "#2d2d2d"),
    ];
    return [
      { name: "social", tiles: social },
      { name: "home", tiles: home },
      { name: "games", tiles: gtiles },
      { name: "apps", tiles: apps },
      { name: "settings", tiles: settings },
    ];
  }, [api.lib, api.user, s.theme]);

  const [pivot, setPivotRaw] = useRemembered("x360-pivot", 1);
  const [sels, setSels] = useRemembered<Record<number, number>>("x360-sels", {});
  const [onBar, setOnBar] = useState(false);
  const setPivot = (i: number) => {
    const n = clamp(i, 0, pivots.length - 1);
    if (n !== pivot) {
      setPivotRaw(n);
      playSound("tab");
    }
  };
  const pv = pivots[clamp(pivot, 0, pivots.length - 1)];
  const sel = clamp(sels[pivot] ?? 0, 0, pv.tiles.length - 1);
  const cur = pv.tiles[sel];

  const options = () => {
    const g = cur?.game;
    const extra: MenuItem[] = [
      { label: "presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "home settings", action: api.openSettings },
      { label: "home", action: api.showSteamHome },
    ];
    menu.open(g ? [{ label: "play", action: () => api.launch(g) }, { label: "watch trailer", action: () => api.playTrailer(g) }, { label: "game details", action: () => api.details(g) }, { label: "game options", action: () => api.nativeMenu(g) }, ...extra] : extra, g ? g.name : "options");
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (b === "l1") return setPivot(pivot - 1), true;
    if (b === "r1") return setPivot(pivot + 1), true;
    if (b === "y") return options(), true;
    if (b === "menu") {
      if (cur?.game) api.nativeMenu(cur.game);
      return true;
    }
    if (onBar) {
      if (b === "left") setPivot(pivot - 1);
      else if (b === "right") setPivot(pivot + 1);
      else if (b === "down" || b === "a" || b === "b") (setOnBar(false), playSound("move"));
      return true;
    }
    if (b === "up" || b === "down" || b === "left" || b === "right") {
      const to = spatial(
        pv.tiles.map((t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 })),
        sel,
        b,
      );
      if (to >= 0) {
        setSels((m) => ({ ...m, [pivot]: to }));
        playSound("move");
      } else if (b === "up") (setOnBar(true), playSound("move"));
      else if (b === "left") setPivot(pivot - 1);
      else if (b === "right") setPivot(pivot + 1);
      return true;
    }
    if (b === "a") {
      playSound("select");
      cur?.run();
      return true;
    }
    if (b === "x" && cur?.game) return api.launch(cur.game), true;
    return false;
  };

  // ───── layout ─────
  const X0 = 96;
  const Y0 = Math.min(196, H * .25);
  const tileScale = Math.min(1, Math.max(.65,(H-280)/455));
  const contentW = Math.max(...pv.tiles.map((t) => t.x + t.w));
  let scroll = 0;
  if (cur) {
    const right = cur.x + cur.w;
    if (right - scroll > (W - X0 * 2)/tileScale) scroll = right - ((W - X0 * 2)/tileScale);
    scroll = clamp(scroll, 0, Math.max(0, contentW - ((W - X0 * 2)/tileScale)));
  }

  const label: CSSProperties = { position: "absolute", left: 10, bottom: 8, right: 10, color: "#fff", fontSize: 17, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT };

  return (
    <ThemeRoot onInput={onInput} hints={{ a: "Select", y: "Options", menu: "Options" }}>
      <Stage background="#d9d9d9">
        <div className="dht-x360-bg" style={{ position: "absolute", inset: 0, background: "var(--dht-x360-bg, radial-gradient(ellipse at 75% 10%, #ffffff 0%, #ececec 35%, #cfcfcf 100%))" }} />
        {wall && <img src={wall} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} />}
        {/* faint background shapes */}
        {!wall && (
          <svg width={W} height={H} style={{ position: "absolute", inset: 0, opacity: 0.35 }}>
            <circle cx={W * 0.85} cy={H * 0.95} r={H * 0.55} fill="none" stroke="#fff" strokeWidth="60" />
            <circle cx={W * 0.12} cy={H * 0.1} r={H * 0.25} fill="none" stroke="#fff" strokeWidth="30" />
          </svg>
        )}

        {/* gamer corner */}
        <div style={{ position: "absolute", right: 70, top: 34, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, color: wall ? "#fff" : "#333" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 20 }}>{api.user}</div>
            <div style={{ fontSize: 15, opacity: 0.7 }}>{fmtTime(now, s.clock24)}</div>
          </div>
          <div style={{ width: 54, height: 54, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="user" size={38} color="#fff" />
          </div>
        </div>

        {/* pivots */}
        <div style={{ position: "absolute", left: X0, top: 104, display: "flex", gap: 38, fontFamily: FONT, transition: "transform 250ms ease-out", transform: `translateX(${-Math.max(0, pivot - 1) * 120}px)` }}>
          {pivots.map((pv2, i) => (
            <span key={pv2.name} className="dht-x360-pivot" data-selected={i === pivot} style={{ fontSize: 40, fontWeight: 300, letterSpacing: -0.5, color: i === pivot ? (wall ? "#fff" : "#2a2a2a") : wall ? "rgba(255,255,255,0.55)" : "#9a9a9a", textDecoration: onBar && i === pivot ? "underline" : "none", textUnderlineOffset: 8 }}>
              {pv2.name}
            </span>
          ))}
        </div>

        {/* tiles */}
        <div style={{ position: "absolute", left: X0, top: Y0, transform: `translateX(${-scroll*tileScale}px) scale(${tileScale})`, transformOrigin:"0 0", transition: "transform 250ms ease-out" }} key={pv.name}>
          {pv.tiles.map((t, i) => {
            const on = i === sel && !onBar;
            if (t.x - scroll > W || t.x + t.w - scroll < -X0) return null;
            return (
              <div
                key={t.key}
                className="dht-x360-tile dht-tile"
                data-selected={on}
                data-name={t.label}
                onClick={() => { setSels(m=>({...m,[pivot]:i})); t.run(); }}
                style={{
                  position: "absolute",
                  left: t.x,
                  top: t.y,
                  width: t.w,
                  height: t.h,
                  background: t.color ?? "#222",
                  overflow: "hidden",
                  transform: on ? "scale(1.045)" : "scale(1)",
                  transition: "transform 140ms, box-shadow 140ms",
                  boxShadow: on ? "0 0 0 3px #f4f4f4, 0 0 0 7px #262626, 0 12px 26px rgba(0,0,0,0.45)" : "0 2px 6px rgba(0,0,0,0.15)",
                  zIndex: on ? 2 : 1,
                  animation: s.animations ? `dhtSlideIn 300ms ease-out ${Math.min(i, 8) * 25}ms backwards` : undefined,
                  cursor: "pointer",
                }}
              >
                {t.game ? (
                  <>
                    <GameArt g={t.game} kind={t.art ?? "landscape"} style={{ width: "100%", height: "100%" }} />
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 46, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.75))" }} />
                    {t.art !== "portrait" && showTitle(s, "x360", on) && <div style={label}>{t.label}</div>}
                  </>
                ) : (
                  <>
                    <div style={{ position: "absolute", left: 14, top: 14 }}>
                      <Icon name={t.icon ?? "apps"} size={t.h > 200 ? 64 : 40} color="#fff" />
                    </div>
                    <div style={{ ...label, fontSize: 20 }}>{t.label}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        <style>{`@keyframes dhtSlideIn { from { opacity: 0; transform: translateX(60px) } to { opacity: 1; transform: none } }`}</style>

        {/* focused game caption */}
        {cur?.game && !onBar && (
          <div style={{ position: "absolute", left: X0, top: Y0 + 455*tileScale + 20, fontFamily: FONT, color: wall ? "#fff" : "#2a2a2a" }}>
            {showTitle(s, "x360", true) && <div style={{ fontSize: 26, fontWeight: 300 }}>{cur.game.name}</div>}
            <div style={{ fontSize: 16, opacity: 0.65 }}>{fmtPlaytime(cur.game.playtime)}</div>
            <Badges g={cur.game} size={14} style={{ marginTop: 6 }} />
          </div>
        )}
        <MenuView menu={menu} variant="x360" />
      </Stage>
    </ThemeRoot>
  );
}
