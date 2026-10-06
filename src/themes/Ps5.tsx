// PS5 home: Games / Media tabs, a compact row of rounded tiles at the top
// with the focused title written beside it, full-bleed hero art, the game's
// logo, a Play button and activity cards underneath.
import { useEffect, useState } from "react";
import { BatteryGlyph, GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openSteam, SteamPlace } from "../library";
import { showTitle, THEMES } from "../settings";
import { Badges } from "../badges";
import { fmtTime, playSound, useBattery, useClock, useWallpaper } from "../steam";

type Tile = { key: string; label: string; game?: Game; icon?: IconName; place?: SteamPlace; run?: () => void };
type Zone = "tabs" | "tiles" | "play" | "cards";

export function Ps5Home() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const now = useClock(15000);
  const bat = useBattery();
  const wall = useWallpaper("ps5");
  const menu = useMenu();

  const [tab, setTab] = useRemembered<"games" | "media">("ps5-tab", "games");
  const gamesTiles: Tile[] = [
    { key: "store", label: "Steam Store", icon: "store", place: "store" },
    ...api.lib.games.map((g) => ({ key: `g${g.appid}`, label: g.name, game: g })),
    { key: "lib", label: "Game Library", icon: "library", place: "library" },
  ];
  const mediaTiles: Tile[] = [
    { key: "shots", label: "Media Gallery", icon: "photo", place: "media" },
    { key: "web", label: "Web Browser", icon: "globe", place: "browser" },
    { key: "dl", label: "Downloads", icon: "download", place: "downloads" },
    { key: "friends", label: "Friends", icon: "friends", place: "friends" },
    ...api.lib.apps.map((g) => ({ key: `a${g.appid}`, label: g.name, game: g })),
  ];
  const tiles = tab === "games" ? gamesTiles : mediaTiles;
  const [selG, setSelG] = useRemembered("ps5-g", Math.min(1, gamesTiles.length - 1));
  const [selM, setSelM] = useRemembered("ps5-m", 0);
  const sel = clamp(tab === "games" ? selG : selM, 0, tiles.length - 1);
  const setSel = (i: number) => (tab === "games" ? setSelG(i) : setSelM(i));
  const [zone, setZone] = useState<Zone>("tiles");
  const [psel, setPsel] = useState(0);
  const [csel, setCsel] = useState(0);
  const [tsel, setTsel] = useState(0);
  const cur = tiles[sel];
  const g = cur?.game;

  const [bg, setBg] = useState<Game | undefined>(g);
  useEffect(() => {
    const t = setTimeout(() => setBg(g), 250);
    return () => clearTimeout(t);
  }, [g?.appid, tab]);

  const cards = g
    ? [
        { title: "Game Details", sub: "Achievements, news, properties", run: () => api.details(g) },
        { title: "Play Time", sub: fmtPlaytime(g.playtime), run: () => api.details(g) },
        { title: "Last Played", sub: fmtLastPlayed(g.lastPlayed), run: () => api.details(g) },
      ]
    : [];
  const topIcons: { icon: IconName; run: () => void }[] = [
    { icon: "search", run: () => openSteam("search") },
    { icon: "gear", run: () => api.openSettings() },
    { icon: "user", run: () => openSteam("friends") },
    { icon: "power", run: () => openSteam("power") },
  ];

  const activateTile = (t: Tile | undefined) => {
    if (!t) return;
    if (t.game) api.activate(t.game, () => api.launch(t.game!));
    else if (t.place === "media") api.openMedia();
    else if (t.place) (playSound("select"), openSteam(t.place));
  };

  const options = () => {
    const extra: MenuItem[] = [
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    menu.open(g ? [{ label: "Play", action: () => api.launch(g) }, { label: "Watch Trailer", action: () => api.playTrailer(g) }, { label: "Game Details", action: () => api.details(g) }, { label: "Game Options", action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
  };

  const switchTab = (t: "games" | "media") => {
    if (t === tab) return;
    setTab(t);
    setZone("tiles");
    playSound("tab");
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (b === "y" || b === "menu") {
      if (b === "menu" && g) api.nativeMenu(g);
      else options();
      return true;
    }
    if (b === "l1") return switchTab("games"), true;
    if (b === "r1") return switchTab("media"), true;
    const lr = b === "left" ? -1 : b === "right" ? 1 : 0;
    switch (zone) {
      case "tabs": {
        // 0 games, 1 media, 2.. top-right icons
        const n = 2 + topIcons.length;
        if (lr) {
          const nx = clamp(tsel + lr, 0, n - 1);
          if (nx !== tsel) (setTsel(nx), playSound("move"));
        } else if (b === "down" || b === "b") (setZone("tiles"), playSound("move"));
        else if (b === "a") {
          if (tsel === 0) switchTab("games");
          else if (tsel === 1) switchTab("media");
          else topIcons[tsel - 2].run();
        }
        return true;
      }
      case "tiles":
        if (lr) {
          const nx = clamp(sel + lr, 0, tiles.length - 1);
          if (nx !== sel) (setSel(nx), playSound("tile"));
        } else if (b === "up") (setZone("tabs"), setTsel(tab === "games" ? 0 : 1), playSound("move"));
        else if (b === "down") {
          setZone("play");
          setPsel(0);
          playSound("move");
        } else if (b === "a") activateTile(cur);
        else if (b === "x" && g) api.launch(g);
        else if (b === "b") return false;
        return true;
      case "play":
        if (lr) setPsel(clamp(psel + lr, 0, 1));
        else if (b === "up" || b === "b") (setZone("tiles"), playSound("move"));
        else if (b === "down" && cards.length) (setZone("cards"), setCsel(0), playSound("move"));
        else if (b === "a") {
          if (psel === 0) (g ? api.launch(g) : activateTile(cur));
          else if (g) api.nativeMenu(g);
          else options();
        }
        return true;
      case "cards":
        if (lr) {
          const nx = clamp(csel + lr, 0, cards.length - 1);
          if (nx !== csel) (setCsel(nx), playSound("move"));
        } else if (b === "up" || b === "b") (setZone("play"), playSound("move"));
        else if (b === "a") cards[csel]?.run();
        return true;
    }
    return false;
  };

  // ───── layout ─────
  const T = 92;
  const TS = 128;
  const GAP = 14;
  const rowY = 96;
  const playY = Math.min(544,H-250);
  const cardsY = playY+92;
  const x0 = 70;
  const labelW = Math.min(330, 14 * (cur?.label.length ?? 0) + 40);
  const xOf = (i: number) => {
    if (i < sel) return x0 - (sel - i) * (T + GAP);
    if (i === sel) return x0;
    return x0 + TS + GAP + labelW + (i - sel - 1) * (T + GAP);
  };
  const scrolledDown = zone === "cards";

  return (
    <ThemeRoot onInput={onInput} hints={{ a: g ? "Play" : "Select", y: "Options", menu: "Options" }}>
      <Stage background="#000">
        {/* background */}
        <div className="dht-ps5-bg" style={{ position: "absolute", inset: 0, background: "var(--dht-ps5-bg, radial-gradient(ellipse at 70% 30%, #263040, #07090d 70%))" }} />
        {wall && <img src={wall} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} />}
        {bg && (
          <div key={bg.appid} style={{ position: "absolute", inset: 0, animation: "dhtFade5 450ms ease-out" }}>
            <GameArt g={bg} kind="hero" style={{ width: W, height: H }} />
          </div>
        )}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.1) 100%), linear-gradient(180deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0) 30%, rgba(0,0,0,0.0) 60%, rgba(0,0,0,0.8) 100%)" }} />
        <style>{`@keyframes dhtFade5 { from { opacity: 0; transform: scale(1.04) } to { opacity: 1; transform: scale(1) } }`}</style>

        <div style={{ position: "absolute", inset: 0, transform: scrolledDown ? `translateY(-${H * 0.32}px)` : "none", transition: "transform 300ms ease-out" }}>
          {/* tabs */}
          <div style={{ position: "absolute", left: x0, top: 30, display: "flex", gap: 34, fontSize: 22, color: "#fff" }}>
            {(["games", "media"] as const).map((t, i) => (
              <span key={t} className="dht-ps5-tab" data-selected={tab === t} style={{ fontWeight: tab === t ? 600 : 300, opacity: tab === t ? 1 : 0.6, padding: "2px 10px", borderRadius: 16, boxShadow: zone === "tabs" && tsel === i ? "0 0 0 2px #fff" : "none" }}>
                {t === "games" ? "Games" : "Media"}
              </span>
            ))}
          </div>
          {/* top-right */}
          <div style={{ position: "absolute", right: 40, top: 26, display: "flex", alignItems: "center", gap: 22, color: "#fff" }}>
            {topIcons.map((ic, i) => (
              <div key={i} onClick={topIcons[i].run} style={{ width: 40, height: 40, borderRadius: 20, display: "flex", alignItems: "center", justifyContent: "center", background: zone === "tabs" && tsel === i + 2 ? "#fff" : "transparent" }}>
                <Icon name={ic.icon} size={24} color={zone === "tabs" && tsel === i + 2 ? "#000" : "#fff"} />
              </div>
            ))}
            {bat && <BatteryGlyph level={bat.level} charging={bat.charging} w={28} />}
            <span style={{ fontSize: 22, fontWeight: 300 }}>{fmtTime(now, s.clock24)}</span>
          </div>

          {/* tiles */}
          {tiles.map((t, i) => {
            if (i < sel - 1 || i > sel + 12) return null;
            const on = i === sel;
            const size = on ? TS : T;
            return (
              <div key={t.key} onClick={()=>{setZone("tiles");if(on)activateTile(t);else{setSel(i);playSound("move");}}} className="dht-ps5-tile dht-tile" data-selected={on} data-name={t.label} style={{ position: "absolute", left: xOf(i), top: rowY + (on ? 0 : (TS - T) / 2), width: size, height: size, borderRadius: on ? 22 : 16, overflow: "hidden", transition: "left 200ms ease-out, width 200ms, height 200ms, top 200ms", boxShadow: on && zone === "tiles" ? "0 0 0 3px #fff, 0 8px 24px rgba(0,0,0,0.6)" : "0 4px 12px rgba(0,0,0,0.5)", background: "#1b1f27" }}>
                {t.game ? (
                  <GameArt g={t.game} kind="portrait" position="50% 25%" style={{ width: "100%", height: "100%" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", background: "linear-gradient(145deg,#3b4352,#1a1e26)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Icon name={t.icon ?? "apps"} size={on ? 54 : 40} color="#fff" />
                  </div>
                )}
              </div>
            );
          })}
          {cur && (
            <div style={{ position: "absolute", left: x0 + TS + 20, top: rowY + TS / 2 - 16, width: labelW, color: "#fff", fontSize: 22, fontWeight: 400, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", textShadow: "0 2px 6px #000" }}>{!cur.game || showTitle(s, "ps5", true) ? cur.label : ""}</div>
          )}

          {/* logo / title */}
          <div style={{ position: "absolute", left: x0, top: rowY + TS + 60, width: 520, height: Math.max(90,playY-rowY-TS-90), display: "flex", alignItems: "flex-end" }}>
            {g ? (
              <GameArtLogo g={g} />
            ) : (
              <div style={{ color: "#fff", fontSize: 46, fontWeight: 300 }}>{cur?.label}</div>
            )}
          </div>

          {/* play row */}
          <div style={{ position: "absolute", left: x0, top: playY, display: "flex", gap: 16, alignItems: "center" }}>
            <div onClick={()=>g?api.launch(g):activateTile(cur)} className="dht-ps5-play" data-selected={zone === "play" && psel === 0} style={{ height: 56, padding: "0 64px", borderRadius: 28, background: zone === "play" && psel === 0 ? "var(--dht-ps5-play, #fff)" : "rgba(255,255,255,0.88)", color: "#000", fontSize: 22, fontWeight: 600, display: "flex", alignItems: "center", boxShadow: zone === "play" && psel === 0 ? "0 0 0 4px rgba(255,255,255,0.4)" : "none", transform: zone === "play" && psel === 0 ? "scale(1.05)" : "none", transition: "transform 150ms" }}>
              {g ? "Play" : "Open"}
            </div>
            <div style={{ width: 56, height: 56, borderRadius: 28, background: zone === "play" && psel === 1 ? "#fff" : "rgba(60,60,60,0.8)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Icon name="dots" size={26} color={zone === "play" && psel === 1 ? "#000" : "#fff"} />
            </div>
            {g && <span style={{ color: "#fff", opacity: 0.75, fontSize: 17, marginLeft: 10 }}>{fmtPlaytime(g.playtime)}</span>}
            <Badges g={g} size={15} />
          </div>

          {/* activity cards */}
          <div style={{ position: "absolute", left: x0, top: cardsY, display: "flex", gap: 20 }}>
            {cards.map((c, i) => (
              <div key={c.title} onClick={c.run} className="dht-ps5-card" data-selected={zone === "cards" && i === csel} style={{ width: 300, height: Math.min(150,H-cardsY-26), borderRadius: 14, padding: 20, boxSizing: "border-box", background: "rgba(30,34,42,0.82)", color: "#fff", boxShadow: zone === "cards" && i === csel ? "0 0 0 3px #fff" : "none", transform: zone === "cards" && i === csel ? "scale(1.04)" : "none", transition: "transform 150ms" }}>
                <div style={{ fontSize: 14, opacity: 0.6, marginBottom: 10 }}>Activity</div>
                <div style={{ fontSize: 21, fontWeight: 600 }}>{c.title}</div>
                <div style={{ fontSize: 16, opacity: 0.8, marginTop: 8 }}>{c.sub}</div>
              </div>
            ))}
          </div>
        </div>
        <MenuView menu={menu} variant="ps5" />
      </Stage>
    </ThemeRoot>
  );
}

function GameArtLogo({ g }: { g: Game }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [g.appid]);
  if (failed || !g.art.logo.length) return <div style={{ color: "#fff", fontSize: 44, fontWeight: 700, lineHeight: 1.1, textShadow: "0 3px 12px #000" }}>{g.name}</div>;
  return <LogoImg srcs={g.art.logo} onAllFailed={() => setFailed(true)} />;
}
function LogoImg({ srcs, onAllFailed }: { srcs: string[]; onAllFailed: () => void }) {
  const [i, setI] = useState(0);
  return (
    <img
      src={srcs[i]}
      style={{ maxWidth: 520, maxHeight: 180, objectFit: "contain", objectPosition: "left bottom", filter: "drop-shadow(0 4px 14px rgba(0,0,0,0.7))" }}
      onError={() => (i + 1 < srcs.length ? setI(i + 1) : onAllFailed())}
    />
  );
}
