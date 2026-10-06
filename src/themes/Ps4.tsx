// PS4 home: a function area (top icons) above a horizontal row of square
// tiles; the focused game is enlarged with its name and a Start button, and
// its background art fades in behind the row.
import { CSSProperties, useEffect, useState } from "react";
import { AnimCanvas } from "../canvas";
import { GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openSteam, SteamPlace } from "../library";
import { showTitle, THEMES } from "../settings";
import { BatteryGlyph } from "../common";
import { Badges } from "../badges";
import { fmtTime, playSound, useBattery, useClock, useWallpaper } from "../steam";

type Tile = { key: string; label: string; game?: Game; icon?: IconName; color?: string; action?: () => void };
const FUNCS: { id: string; label: string; icon: IconName; place?: SteamPlace; action?: "settings" | "theme" }[] = [
  { id: "store", label: "Store", icon: "store", place: "store" },
  { id: "notif", label: "Notifications", icon: "bell", place: "notifications" },
  { id: "friends", label: "Friends", icon: "friends", place: "friends" },
  { id: "search", label: "Search", icon: "search", place: "search" },
  { id: "media", label: "Capture Gallery", icon: "photo", place: "media" },
  { id: "theme", label: "Themes", icon: "palette", action: "theme" },
  { id: "settings", label: "Settings", icon: "gear", action: "settings" },
  { id: "power", label: "Power", icon: "power", place: "power" },
];

function drawPs4Bg(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  // Soft drifting light streaks, in the spirit of the default blue theme.
  ctx.globalCompositeOperation = "lighter";
  for (let i = 0; i < 7; i++) {
    const y = h * (0.15 + i * 0.12) + Math.sin(t * 0.15 + i) * 30;
    const g = ctx.createLinearGradient(0, y - 60, 0, y + 60);
    g.addColorStop(0, "rgba(120,190,255,0)");
    g.addColorStop(0.5, `rgba(120,190,255,${0.03 + (i % 3) * 0.015})`);
    g.addColorStop(1, "rgba(120,190,255,0)");
    ctx.save();
    ctx.translate(w / 2, y);
    ctx.rotate(-0.18 + i * 0.03 + Math.sin(t * 0.1 + i) * 0.02);
    ctx.fillStyle = g;
    ctx.fillRect(-w, -60, w * 2, 120);
    ctx.restore();
  }
  for (let i = 0; i < 40; i++) {
    const s = i * 71.7;
    const x = (s * 37 + t * (6 + (i % 5))) % w;
    const y = (s * 19) % h;
    const a = 0.15 + 0.15 * Math.sin(t + i);
    ctx.fillStyle = `rgba(200,230,255,${a})`;
    ctx.beginPath();
    ctx.arc(x, y, 1.2 + (i % 3), 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

export function Ps4Home() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const now = useClock(15000);
  const bat = useBattery();
  const wall = useWallpaper("ps4");
  const menu = useMenu();

  const tiles: Tile[] = [
    { key: "new", label: "What's New", icon: "bell", color: "#1f5fbf", action: () => openSteam("community") },
    ...api.lib.games.map((g) => ({ key: `g${g.appid}`, label: g.name, game: g })),
    { key: "lib", label: "Library", icon: "library", color: "#2167cf", action: () => openSteam("library") },
  ];
  const [row, setRow] = useState<"func" | "tiles" | "info">("tiles");
  const [sel, setSel] = useRemembered("ps4-sel", Math.min(1, tiles.length - 1));
  const [fsel, setFsel] = useState(0);
  const [isel, setIsel] = useState(0);
  const cur = tiles[clamp(sel, 0, tiles.length - 1)];
  const g = cur?.game;

  // Background art follows the focused game after a short settle.
  const [bgGame, setBgGame] = useState<Game | undefined>(g);
  useEffect(() => {
    const t = setTimeout(() => setBgGame(g), 350);
    return () => clearTimeout(t);
  }, [g?.appid]);

  const infoBtns: { label: string; run: () => void }[] = g
    ? [
        { label: "Start", run: () => api.launch(g) },
        { label: "Game Details", run: () => api.details(g) },
        { label: "Options", run: () => api.nativeMenu(g) },
      ]
    : [];

  const runFunc = (i: number) => {
    const f = FUNCS[i];
    playSound("select");
    if (f.place === "media") api.openMedia();
    else if (f.place) openSteam(f.place);
    else if (f.action === "settings") api.openSettings();
    else menu.open(themeMenu(s.theme, api.switchTheme, THEMES), "Presets");
  };

  const options = () => {
    const extra: MenuItem[] = [
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    menu.open(g ? [{ label: "Start", action: () => api.launch(g) }, { label: "Watch Trailer", action: () => api.playTrailer(g) }, { label: "Information", action: () => api.details(g) }, { label: "Game Options", action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (b === "y") return options(), true;
    if (b === "menu") {
      if (g) api.nativeMenu(g);
      return true;
    }
    if (row === "func") {
      if (b === "left" || b === "right") {
        const n = clamp(fsel + (b === "left" ? -1 : 1), 0, FUNCS.length - 1);
        if (n !== fsel) (setFsel(n), playSound("move"));
      } else if (b === "down" || b === "b") (setRow("tiles"), playSound("tab"));
      else if (b === "a") runFunc(fsel);
      return true;
    }
    if (row === "info") {
      if (b === "left" || b === "right") {
        const n = clamp(isel + (b === "left" ? -1 : 1), 0, infoBtns.length - 1);
        if (n !== isel) (setIsel(n), playSound("move"));
      } else if (b === "up" || b === "b") (setRow("tiles"), playSound("tab"));
      else if (b === "a") infoBtns[isel]?.run();
      return true;
    }
    switch (b) {
      case "left":
      case "right":
      case "l1":
      case "r1": {
        const step = b === "l1" ? -6 : b === "r1" ? 6 : b === "left" ? -1 : 1;
        const n = clamp(sel + step, 0, tiles.length - 1);
        if (n !== sel) (setSel(n), playSound("tile"));
        return true;
      }
      case "up":
        setRow("func");
        playSound("tab");
        return true;
      case "down":
        if (g) {
          setRow("info");
          setIsel(0);
          playSound("tab");
        }
        return true;
      case "a":
        if (g) api.activate(g, () => api.launch(g));
        else cur?.action?.();
        playSound("select");
        return true;
      case "x":
        if (g) api.launch(g);
        return true;
    }
    return false;
  };

  // ───── layout ─────
  const T = 132; // tile size
  const TS = 220; // focused tile size
  const GAP = 10;
  const rowY = row === "func" ? H * 0.42 : row === "info" ? H * 0.2 : H * 0.3;
  const startX = 92;
  const xOf = (i: number) => {
    if (i < sel) return startX - (sel - i) * (T + GAP) + (TS - T) * 0;
    if (i === sel) return startX;
    return startX + TS + GAP + (i - sel - 1) * (T + GAP);
  };

  const tileStyle = (selected: boolean): CSSProperties => ({
    position: "absolute",
    width: selected ? TS : T,
    height: selected ? TS : T,
    overflow: "hidden",
    transition: "left 180ms ease-out, top 220ms, width 180ms, height 180ms",
    boxShadow: selected ? "0 0 0 3px #fff, 0 10px 30px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.35)",
    background: "#123",
  });

  return (
    <ThemeRoot onInput={onInput} hints={{ a: "Select", y: "Options", menu: "Options" }}>
      <Stage background="#04122e">
        <div className="dht-ps4-bg" style={{ position: "absolute", inset: 0, background: "var(--dht-ps4-bg, radial-gradient(ellipse at 70% 20%, #2f8be0 0%, transparent 55%), linear-gradient(170deg, #0a3a86 0%, #0b2a63 45%, #061637 100%))" }} />
        {wall && <img src={wall} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} />}
        {!wall && <AnimCanvas width={W} height={H} animate={s.animations} draw={drawPs4Bg} fps={24} />}
        {bgGame && (
          <div key={bgGame.appid} style={{ position: "absolute", inset: 0, animation: "dhtFade 500ms ease-out" }}>
            <GameArt g={bgGame} kind="hero" style={{ width: W, height: H }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(5,15,40,0.55) 0%, rgba(5,15,40,0.25) 40%, rgba(5,15,40,0.85) 100%)" }} />
          </div>
        )}
        <style>{`@keyframes dhtFade { from { opacity: 0 } to { opacity: 1 } }`}</style>

        {/* top-right status */}
        <div style={{ position: "absolute", top: 22, right: 36, display: "flex", alignItems: "center", gap: 16, color: "#fff", fontSize: 20, fontWeight: 300 }}>
          <div style={{ width: 34, height: 34, borderRadius: 4, background: "linear-gradient(135deg,#5aa0ff,#2a5bd0)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Icon name="user" size={24} color="#fff" />
          </div>
          <span>{api.user}</span>
          {bat && <BatteryGlyph level={bat.level} charging={bat.charging} w={30} />}
          <span>{fmtTime(now, s.clock24)}</span>
        </div>

        {/* function area */}
        <div style={{ position: "absolute", left: 0, right: 0, top: row === "func" ? H * 0.16 : H * 0.08, display: "flex", justifyContent: "center", gap: 26, transition: "top 220ms", opacity: row === "func" ? 1 : 0.55 }}>
          {FUNCS.map((f, i) => {
            const on = row === "func" && i === fsel;
            return (
              <div key={f.id} className="dht-ps4-func" data-selected={on} data-name={f.label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, width: 96 }}>
                <div style={{ width: on ? 76 : 60, height: on ? 76 : 60, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", background: on ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.07)", boxShadow: on ? "0 0 0 2px #fff" : "none", transition: "all 150ms" }}>
                  <Icon name={f.icon} size={on ? 40 : 32} color="#fff" />
                </div>
                <div style={{ color: "#fff", fontSize: 15, opacity: on ? 1 : 0, whiteSpace: "nowrap" }}>{f.label}</div>
              </div>
            );
          })}
        </div>

        {/* tile row */}
        {tiles.map((t, i) => {
          if (i < sel - 2 || i > sel + 9) return null;
          const selected = i === sel;
          return (
            <div key={t.key} className="dht-ps4-tile dht-tile" data-selected={selected} data-name={t.label} onClick={()=>{setRow("tiles");if(selected){if(t.game)api.activate(t.game,()=>api.launch(t.game!));else t.action?.();}else{setSel(i);playSound("move");}}} style={{ ...tileStyle(selected), left: xOf(i), top: rowY, opacity: row === "func" ? 0.7 : 1 }}>
              {t.game ? (
                <GameArt g={t.game} kind="portrait" position="50% 22%" style={{ width: "100%", height: "100%" }} />
              ) : (
                <div style={{ width: "100%", height: "100%", background: `linear-gradient(145deg, ${t.color}, #0b2350)`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Icon name={t.icon ?? "apps"} size={selected ? 84 : 56} color="#fff" />
                </div>
              )}
            </div>
          );
        })}

        {/* focused title + start */}
        {cur && (
          <div style={{ position: "absolute", left: startX, top: rowY + TS + 18, transition: "top 220ms", color: "#fff", display: "flex", flexDirection: "column", gap: 10 }}>
            <div style={{ fontSize: 28, fontWeight: 300, maxWidth: 760, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textShadow: "0 2px 8px rgba(0,0,0,0.6)" }}>{!cur.game || showTitle(s, "ps4", true) ? cur.label : ""}</div>
            {g && row !== "info" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ padding: "6px 26px", border: "1px solid rgba(255,255,255,0.8)", borderRadius: 3, fontSize: 18 }}>Start</span>
                <span style={{ fontSize: 15, opacity: 0.7 }}>{fmtPlaytime(g.playtime)}</span>
                <Badges g={g} size={14} />
              </div>
            )}
          </div>
        )}

        {/* info area (below the row) */}
        {g && row === "info" && (
          <div style={{ position: "absolute", left: startX, top: rowY + TS + 120, display: "flex", gap: 18 }}>
            {infoBtns.map((btn, i) => (
              <div key={btn.label} className="dht-ps4-card" data-selected={i === isel} style={{ width: 250, height: 140, borderRadius: 4, padding: 18, boxSizing: "border-box", background: i === isel ? "rgba(255,255,255,0.22)" : "rgba(0,0,0,0.35)", boxShadow: i === isel ? "0 0 0 3px #fff" : "none", color: "#fff", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <Icon name={i === 0 ? "play" : i === 1 ? "info" : "dots"} size={34} color="#fff" />
                <div style={{ fontSize: 20 }}>{btn.label}</div>
                {i === 1 && <div style={{ fontSize: 13, opacity: 0.7 }}>Last played: {fmtLastPlayed(g.lastPlayed)}</div>}
              </div>
            ))}
          </div>
        )}
        {api.lib.games.length === 0 && <div style={{ position: "absolute", left: startX, top: H * 0.7, color: "#fff", opacity: 0.7, fontSize: 18 }}>No games found for the selected library view.</div>}
        <MenuView menu={menu} variant="ps4" />
      </Stage>
    </ThemeRoot>
  );
}
