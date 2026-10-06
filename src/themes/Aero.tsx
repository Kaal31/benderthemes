// Aero (bonus): Frutiger-Aero "Steam Deck" desktop. This is the ChatGPT remake
// the user made from the 1.5 build, ported back into the source: blue glass
// shell, lime pills, profile + side navigation, hero card with Play, Continue
// Playing row, activity rail and its own footer. Drawn on a 1280×960 canvas
// (the size of the reference) and scaled to the screen.
import { ReactNode, useEffect, useState } from "react";
import { GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { achievements, fmtLastPlayed, Game, openAchievements, openSteam, SteamPlace } from "../library";
import { showTitle, THEMES } from "../settings";
import { fmtTime, playSound, useBattery, useClock, useSteamStatus, useWallpaper } from "../steam";
import { AERO_CSS } from "./aeroStyles";

function gearPath(cx: number, cy: number, ro: number, ri: number, teeth: number) {
  const pts: string[] = [];
  for (let i = 0; i < teeth * 2; i++) {
    const a0 = (i / (teeth * 2)) * Math.PI * 2;
    const a1 = ((i + 1) / (teeth * 2)) * Math.PI * 2;
    const r = i % 2 ? ri : ro;
    pts.push(`${(cx + Math.cos(a0 + 0.06) * r).toFixed(1)} ${(cy + Math.sin(a0 + 0.06) * r).toFixed(1)}`, `${(cx + Math.cos(a1 - 0.06) * r).toFixed(1)} ${(cy + Math.sin(a1 - 0.06) * r).toFixed(1)}`);
  }
  return `M${pts.join(" L")} Z M${cx + 6} ${cy} A6 6 0 1 0 ${cx - 6} ${cy} A6 6 0 1 0 ${cx + 6} ${cy} Z`;
}

const GLYPHS = ["house", "db", "bag", "gear", "community", "globe", "person", "list", "pad"] as const;
type Glyph = (typeof GLYPHS)[number];
const isGlyph = (n: string): n is Glyph => (GLYPHS as readonly string[]).includes(n);

function AeroIcon({ name, size, tone = "light" }: { name: Glyph; size: number; tone?: "light" | "blue" }) {
  const id = `dhtA${name}${tone}`;
  const light = (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#ffffff" />
      <stop offset="0.6" stopColor="#e6f2ff" />
      <stop offset="1" stopColor="#9fc6f0" />
    </linearGradient>
  );
  const blue = (
    <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#6cc0ff" />
      <stop offset="0.55" stopColor="#1d6ee0" />
      <stop offset="1" stopColor="#0b3f9e" />
    </linearGradient>
  );
  const fill = `url(#${id})`;
  const body: Record<Glyph, ReactNode> = {
    house: (
      <>
        <path d="M24 5 L3 23 H9 V42 H20 V30 H28 V42 H39 V23 H45 Z" fill={fill} stroke={tone === "blue" ? "#08306e" : "#2a5ea8"} strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M24 9 L8 22.5 H11 L24 12 L37 22.5 H40 Z" fill="rgba(255,255,255,0.55)" />
      </>
    ),
    db: (
      <>
        {[30, 19, 8].map((y) => (
          <g key={y}>
            <path d={`M8 ${y} v8 a16 5.5 0 0 0 32 0 v-8`} fill={fill} stroke="#4a78b8" strokeWidth="1" />
            <ellipse cx="24" cy={y} rx="16" ry="5.5" fill="#ffffff" stroke="#4a78b8" strokeWidth="1" />
          </g>
        ))}
      </>
    ),
    bag: (
      <>
        <path d="M17 17 v-4 a7 7 0 0 1 14 0 v4" fill="none" stroke="#ffffff" strokeWidth="3" />
        <path d="M8 16 H40 L38 43 H10 Z" fill={fill} stroke="#4a78b8" strokeWidth="1" strokeLinejoin="round" />
        <path d="M21.5 22 h5 v6 h6 v5 h-6 v6 h-5 v-6 h-6 v-5 h6 Z" fill="#1d6ee0" />
      </>
    ),
    gear: <path d={gearPath(24, 24, 20, 14.5, 8)} fill={fill} fillRule="evenodd" stroke="#4a78b8" strokeWidth="0.8" />,
    community: (
      <>
        <defs>
          <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b9f56a" />
            <stop offset="1" stopColor="#2f9a12" />
          </linearGradient>
          <linearGradient id={`${id}b`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#7cc8ff" />
            <stop offset="1" stopColor="#1555c4" />
          </linearGradient>
        </defs>
        <circle cx="31" cy="13" r="7.5" fill={`url(#${id}b)`} />
        <path d="M19 38 a12 12 0 0 1 24 0 v3 h-24 Z" fill={`url(#${id}b)`} />
        <circle cx="18" cy="17" r="8.5" fill={`url(#${id}g)`} />
        <path d="M4 44 a14 13 0 0 1 28 0 v1 h-28 Z" fill={`url(#${id}g)`} />
        <ellipse cx="16" cy="13" rx="4" ry="2.5" fill="rgba(255,255,255,0.6)" />
      </>
    ),
    globe: (
      <>
        <defs>
          <radialGradient id={`${id}o`} cx="0.38" cy="0.32" r="0.75">
            <stop offset="0" stopColor="#9ce4ff" />
            <stop offset="0.6" stopColor="#1f86e0" />
            <stop offset="1" stopColor="#0b4598" />
          </radialGradient>
        </defs>
        <circle cx="24" cy="24" r="20" fill={`url(#${id}o)`} />
        <path d="M12 14 c5-4 10-3 12 1 c2 4-3 5-2 9 c1 4-4 6-7 3 c-3-3-6-2-6-6 c0-3 1-5 3-7 Z" fill="#5cc31f" />
        <path d="M28 25 c4-2 9 0 10 4 c1 5-4 9-8 10 c-3 1-4-3-3-6 c1-3-2-6 1-8 Z" fill="#5cc31f" />
        <path d="M30 9 c3 0 6 2 7 4 c-2 1-5 0-7-1 Z" fill="#5cc31f" />
        <ellipse cx="17" cy="13" rx="8" ry="4.5" fill="rgba(255,255,255,0.45)" />
      </>
    ),
    person: (
      <>
        <circle cx="24" cy="16" r="9.5" fill={fill} />
        <path d="M7 46 a17 16 0 0 1 34 0 Z" fill={fill} />
        <ellipse cx="21" cy="11.5" rx="4.5" ry="3" fill="rgba(255,255,255,0.55)" />
      </>
    ),
    list: (
      <>
        {[11, 24, 37].map((y) => (
          <g key={y}>
            <rect x="5" y={y - 3.5} width="7" height="7" rx="1.5" fill={fill} />
            <rect x="16" y={y - 3} width="27" height="6" rx="2" fill={fill} />
          </g>
        ))}
      </>
    ),
    pad: (
      <>
        <path d="M14 13 H34 C41 13 45 22 46 31 C47 39 41 41 37 36 L33 31 H15 L11 36 C7 41 1 39 2 31 C3 22 7 13 14 13 Z" fill={fill} stroke="#4a78b8" strokeWidth="1" />
        <path d="M12 20 v8 M8 24 h8" stroke="#1d6ee0" strokeWidth="3" strokeLinecap="round" />
        <circle cx="34" cy="21" r="2.4" fill="#1d6ee0" />
        <circle cx="38.5" cy="25.5" r="2.4" fill="#1d6ee0" />
      </>
    ),
  };
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" style={{ display: "block", flex: "none", filter: "drop-shadow(0 2px 2px rgba(0,30,90,0.45))", overflow: "visible" }}>
      <defs>{tone === "blue" ? blue : light}</defs>
      {body[name]}
    </svg>
  );
}

/** Round blue Steam badge (glyph: Simple Icons "steam", CC0). */
function SteamBadge({ size }: { size: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle at 38% 30%, #238ff1 0%, #0754bc 55%, #073d92 100%)", boxShadow: "0 3px 8px rgba(0,30,90,0.5), inset 0 -3px 6px rgba(40,90,170,0.35)", display: "flex", alignItems: "center", justifyContent: "center", flex: "none" }}>
      <svg width={size * 0.88} height={size * 0.88} viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="#f2f9ff"
          d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"
        />
      </svg>
    </div>
  );
}

type View = "home" | "all";
type Zone = "tabs" | "side" | "right" | "hero" | "row" | "grid";

export function AeroHome() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const now = useClock(15000);
  const bat = useBattery();
  const st = useSteamStatus();
  const wall = useWallpaper("aero");
  const menu = useMenu();
  const games = api.lib.games;
  const [view, setView] = useRemembered<View>("aero-view", "home");
  const [zone, setZone] = useRemembered<Zone>("aero-zone", "row");
  const [sel, setSel] = useRemembered("aero-sel", 0);
  const [gsel, setGsel] = useRemembered("aero-gsel", 0);
  const [tsel, setTsel] = useState(0);
  const [ssel, setSsel] = useState(0);
  const [hsel, setHsel] = useState(0);
  const [rsel, setRsel] = useState(0);
  useEffect(() => {
    if (sel >= games.length) setSel(Math.max(0, games.length - 1));
    if (gsel >= games.length) setGsel(Math.max(0, games.length - 1));
  }, [games.length, sel, gsel]);

  const cur: Game | undefined = games[clamp(sel, 0, games.length - 1)];
  const gridGame: Game | undefined = games[clamp(gsel, 0, games.length - 1)];
  const focusGame = view === "all" ? gridGame : cur;
  const heroGame = cur;

  const go = (v: View) => {
    setView(v);
    setZone(v === "all" ? "grid" : "row");
    playSound("tab");
  };
  const steam = (p: SteamPlace) => () => {
    playSound("select");
    openSteam(p);
  };
  const TABS: { id: string; label: string; glyph: Glyph; run: () => void }[] = [
    { id: "home", label: "Home", glyph: "house", run: () => go("home") },
    { id: "library", label: "Library", glyph: "db", run: () => go("all") },
    { id: "store", label: "Store", glyph: "bag", run: steam("store") },
    { id: "settings", label: "Settings", glyph: "gear", run: steam("settings") },
  ];
  const SIDE: { id: string; label: string; icon: Glyph | IconName; run: () => void }[] = [
    { id: "home", label: "Home", icon: "house", run: () => go("home") },
    { id: "library", label: "Library", icon: "list", run: () => go("all") },
    { id: "store", label: "Store", icon: "store", run: steam("store") },
    { id: "friends", label: "Friends", icon: "friends", run: steam("friends") },
    { id: "downloads", label: "Downloads", icon: "download", run: steam("downloads") },
    { id: "cloud", label: "Cloud", icon: "cloud", run: steam("cloud") },
    { id: "achievements", label: "Achievements", icon: "trophy", run: () => (focusGame ? openAchievements(focusGame) : openSteam("library")) },
    { id: "settings", label: "Settings", icon: "gear", run: steam("settings") },
    { id: "power", label: "Power", icon: "power", run: steam("power") },
  ];
  const RIGHT: { id: string; title: string; sub?: string; dot?: string; icon: Glyph | IconName; run: () => void }[] = [
    { id: "community", title: "Steam Community", icon: "community", run: steam("community") },
    { id: "friends", title: "Friends", sub: st.friendsOnline === undefined ? (st.online ? "Online" : "Offline") : `${st.friendsOnline} Online`, dot: st.friendsOnline || st.online ? "#47e03a" : "#9fb7d6", icon: "friends", run: steam("friends") },
    { id: "notifications", title: "Notifications", sub: st.notifications === undefined ? "View all" : st.notifications ? `${st.notifications} New` : "None new", dot: st.notifications ? "#ff6a1f" : undefined, icon: "bell", run: steam("notifications") },
    { id: "downloads", title: "Downloads", sub: st.downloads === undefined ? "Queue" : `${st.downloads} Active`, icon: "download", run: steam("downloads") },
    { id: "cloud", title: "Cloud Sync", sub: st.cloud === undefined ? "Steam Cloud" : st.cloud ? "Enabled" : "Off", dot: st.cloud ? "#47e03a" : undefined, icon: "cloud", run: steam("cloud") },
    { id: "discover", title: "Discover New Worlds", icon: "globe", run: steam("store") },
  ];

  const options = () => {
    const extra: MenuItem[] = [
      { label: view === "all" ? "Home" : "All Games", action: () => go(view === "all" ? "home" : "all") },
      { label: "Screenshots", action: () => api.openMedia() },
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    const g = zone === "row" || zone === "hero" || zone === "grid" ? focusGame : undefined;
    menu.open(
      g
        ? [
            { label: "Play", action: () => api.launch(g) },
            { label: "Watch Trailer", action: () => api.playTrailer(g) },
            { label: "Game Details", action: () => api.details(g) },
            { label: "Achievements", action: () => openAchievements(g) },
            { label: "Game Options", action: () => api.nativeMenu(g) },
            ...extra,
          ]
        : extra,
      g?.name,
    );
  };

  const COLS = 6;
  const move = (setter: (n: number) => void, v: number, d: number, max: number) => {
    const n = clamp(v + d, 0, max);
    if (n !== v) {
      setter(n);
      playSound("move");
      return true;
    }
    return false;
  };
  const toZone = (z: Zone) => {
    setZone(z);
    playSound("tab");
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (b === "y") return options(), true;
    if (b === "menu") {
      if (focusGame) api.nativeMenu(focusGame);
      return true;
    }
    if (b === "x") {
      if (focusGame) api.launch(focusGame);
      return true;
    }
    if (b === "b") {
      if (view === "all") return go("home"), true;
      if (zone !== "row") return toZone("row"), true;
      return false;
    }
    switch (zone) {
      case "tabs":
        if (b === "left" || b === "right") move(setTsel, tsel, b === "left" ? -1 : 1, TABS.length - 1);
        else if (b === "down") toZone(view === "all" ? "grid" : "hero");
        else if (b === "a") TABS[tsel].run();
        return true;
      case "side":
        if (b === "up") {
          if (!move(setSsel, ssel, -1, SIDE.length - 1)) toZone("tabs");
        } else if (b === "down") move(setSsel, ssel, 1, SIDE.length - 1);
        else if (b === "right") toZone(view === "all" ? "grid" : ssel < 5 ? "hero" : "row");
        else if (b === "a") SIDE[ssel].run();
        return true;
      case "right":
        if (b === "up") {
          if (!move(setRsel, rsel, -1, RIGHT.length - 1)) toZone("tabs");
        } else if (b === "down") move(setRsel, rsel, 1, RIGHT.length - 1);
        else if (b === "left") toZone(view === "all" ? "grid" : rsel < 5 ? "hero" : "row");
        else if (b === "a") RIGHT[rsel].run();
        return true;
      case "hero":
        if (b === "left") {
          if (!move(setHsel, hsel, -1, 1)) toZone("side");
        } else if (b === "right") {
          if (!move(setHsel, hsel, 1, 1)) toZone("right");
        } else if (b === "up") toZone("tabs");
        else if (b === "down") toZone("row");
        else if (b === "a" && cur) {
          playSound(hsel === 0 ? "launch" : "select");
          if (hsel === 0) api.launch(cur);
          else api.nativeMenu(cur);
        }
        return true;
      case "row":
        if (b === "left") {
          if (!move(setSel, sel, -1, games.length - 1)) toZone("side");
        } else if (b === "right") {
          if (!move(setSel, sel, 1, games.length - 1)) toZone("right");
        } else if (b === "l1" || b === "r1") move(setSel, sel, b === "l1" ? -6 : 6, games.length - 1);
        else if (b === "up") {
          setHsel(0);
          toZone("hero");
        } else if (b === "a" && cur) {
          api.activate(cur, () => api.launch(cur));
        }
        return true;
      case "grid": {
        const col = gsel % COLS;
        if (b === "left") {
          if (col === 0) toZone("side");
          else move(setGsel, gsel, -1, games.length - 1);
        } else if (b === "right") {
          if (col === COLS - 1 || gsel === games.length - 1) toZone("right");
          else move(setGsel, gsel, 1, games.length - 1);
        } else if (b === "up") {
          if (gsel < COLS) toZone("tabs");
          else move(setGsel, gsel, -COLS, games.length - 1);
        } else if (b === "down") move(setGsel, gsel, COLS, games.length - 1);
        else if (b === "l1" || b === "r1") move(setGsel, gsel, b === "l1" ? -COLS * 3 : COLS * 3, games.length - 1);
        else if (b === "a" && gridGame) {
          api.activate(gridGame, () => api.launch(gridGame));
        }
        return true;
      }
    }
    return false;
  };

  const ach = achievements(heroGame);
  const first = clamp(sel - 4, 0, Math.max(0, games.length - 6));
  const gridStart = Math.max(0, Math.floor(gsel / COLS) - 1) * COLS;
  const glyph = (name: Glyph | IconName, size = 28, blue = false) =>
    isGlyph(name) ? <AeroIcon name={name} size={size} tone={blue ? "blue" : "light"} /> : <Icon name={name} size={size} color={blue ? "#073c95" : "#eefaff"} />;
  const tile = (g: Game, i: number, grid = false) => {
    const selected = i === (grid ? gsel : sel);
    return (
      <button
        key={g.appid}
        className="aero-game dht-aero-tile dht-tile"
        data-selected={selected}
        data-focus={selected && zone === (grid ? "grid" : "row")}
        data-name={g.name}
        aria-label={g.name}
        onClick={() => {
          if (selected) api.activate(g, () => api.launch(g));
          else (grid ? setGsel : setSel)(i);
          setZone(grid ? "grid" : "row");
        }}
      >
        <div className="aero-cover">
          <GameArt g={g} kind="portrait" style={{ width: "100%", height: "100%" }} />
        </div>
        {showTitle(s, "aero", selected) && <span>{g.name}</span>}
      </button>
    );
  };
  const isActive = (id: string) => (id === "home" && view === "home") || (id === "library" && view === "all");

  return (
    <ThemeRoot onInput={onInput} hints={{ a: "Select", y: "Options", menu: "Options" }}>
      <Stage background="#1687f3">
        <style>{AERO_CSS}</style>
        <div
          className="aero-desktop dht-aero-bg"
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
          style={{ transform: `scale(${W / 1280},${H / 960})`, backgroundImage: wall ? `url("${wall}")` : undefined }}
        >
          <AeroFrame />
          <header className="aero-header">
            <div className="aero-brand">
              <SteamBadge size={65} />
              <strong>
                Steam Deck<sup>™</sup>
              </strong>
            </div>
            <nav className="aero-tabs" aria-label="Main navigation">
              {TABS.map((t, i) => (
                <button
                  key={t.id}
                  className="dht-aero-tab"
                  data-name={t.label}
                  data-active={isActive(t.id)}
                  data-focus={zone === "tabs" && tsel === i}
                  onClick={() => {
                    setTsel(i);
                    setZone("tabs");
                    t.run();
                  }}
                >
                  {glyph(t.glyph, 39, isActive(t.id))}
                  <span>{t.label}</span>
                </button>
              ))}
            </nav>
            <div className="aero-status">
              <Icon name="wifi" size={27} color={st.online ? "white" : "#88a6cf"} />
              {bat && (
                <>
                  <span>{Math.round(bat.level * 100)}%</span>
                  <i className="aero-battery">
                    <i style={{ width: `${bat.level * 100}%` }} />
                  </i>
                </>
              )}
              <time>{fmtTime(now, s.clock24)}</time>
            </div>
          </header>

          <aside className="aero-sidebar">
            <div className="aero-profile">
              <div className="aero-avatar">{st.avatar ? <img src={st.avatar} /> : glyph("person", 72, true)}</div>
              <div>
                <small>Welcome Back!</small>
                <strong title={api.user}>{api.user}</strong>
                <span>
                  <i className="aero-dot" style={{ background: st.online ? "#8aff13" : "#a6b3c0" }} />
                  {st.online ? "Online" : "Offline"} <small>▾</small>
                </span>
              </div>
            </div>
            <nav aria-label="Steam shortcuts">
              {SIDE.map((it, i) => (
                <button
                  key={it.id}
                  className="dht-aero-nav"
                  data-name={it.label}
                  data-active={isActive(it.id)}
                  data-focus={zone === "side" && ssel === i}
                  onClick={() => {
                    setSsel(i);
                    setZone("side");
                    it.run();
                  }}
                >
                  {glyph(it.icon, 34, isActive(it.id))}
                  <span>{it.label}</span>
                </button>
              ))}
            </nav>
            <div className="aero-postcard" style={{ backgroundImage: wall ? `url("${wall}")` : undefined }}>
              <strong>
                Good Games.
                <br />
                Brighter Days.
              </strong>
              <SteamBadge size={38} />
            </div>
          </aside>

          {view === "home" ? (
            <>
              <section className="aero-hero dht-aero-hero" aria-label="Selected game">
                {heroGame ? (
                  <>
                    <GameArt key={heroGame.appid} g={heroGame} kind="hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
                    <HeroLogo g={heroGame} />
                  </>
                ) : (
                  <div className="aero-empty">
                    <strong>Your next adventure awaits</strong>
                    <span>No games in this library view.</span>
                    <button onClick={api.openSettings}>Library settings</button>
                  </div>
                )}
                {heroGame && (
                  <div className="aero-hero-footer">
                    <div className="aero-play-group" data-focus={zone === "hero"}>
                      <button className="dht-aero-play" aria-label={`Play ${heroGame.name}`} data-focus={zone === "hero" && hsel === 0} data-selected={zone === "hero" && hsel === 0} onClick={() => api.launch(heroGame)}>
                        <Icon name="play" size={29} color="#092968" />
                        <b>Play</b>
                      </button>
                      <button aria-label="Game options" data-focus={zone === "hero" && hsel === 1} onClick={() => api.nativeMenu(heroGame)}>
                        ▾
                      </button>
                    </div>
                    <div className="aero-stat">
                      <small>LAST PLAYED</small>
                      <b>{fmtLastPlayed(heroGame.lastPlayed)}</b>
                    </div>
                    <div className="aero-stat">
                      <small>PLAY TIME</small>
                      <b>{heroGame.playtime ? `${(heroGame.playtime / 60).toFixed(1)} hours` : "—"}</b>
                    </div>
                    <div className="aero-stat aero-ach">
                      <small>ACHIEVEMENTS</small>
                      <div>
                        <b>{ach ? `${ach.unlocked}/${ach.total}` : "—"}</b>
                        {ach && ach.total > 0 && (
                          <i>
                            <i style={{ width: `${(ach.unlocked / ach.total) * 100}%` }} />
                          </i>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </section>
              <section className="aero-continue">
                <div className="aero-section-title">
                  {glyph("pad", 30)}
                  <h2>Continue Playing</h2>
                  <button onClick={() => go("all")}>
                    See All <b>›</b>
                  </button>
                </div>
                <div className="aero-games">{games.slice(first, first + 6).map((g, j) => tile(g, first + j))}</div>
              </section>
            </>
          ) : (
            <section className="aero-library dht-aero-all">
              <div className="aero-section-title">
                {glyph("db", 32)}
                <h2>All Games</h2>
                <span>{games.length} games</span>
              </div>
              <div className="aero-grid">{games.slice(gridStart, gridStart + 12).map((g, j) => tile(g, gridStart + j, true))}</div>
              {!games.length && <div className="aero-empty">No games in this library view.</div>}
            </section>
          )}

          <aside className="aero-rail" aria-label="Steam activity">
            {RIGHT.map((it, i) => (
              <button
                key={it.id}
                className={`dht-aero-card aero-activity aero-${it.id}`}
                data-name={it.title}
                data-focus={zone === "right" && rsel === i}
                data-selected={zone === "right" && rsel === i}
                onClick={() => {
                  setRsel(i);
                  setZone("right");
                  it.run();
                }}
                style={it.id === "discover" && wall ? { backgroundImage: `url("${wall}")` } : undefined}
              >
                {glyph(it.icon, it.id === "community" ? 48 : 34)}
                <span>
                  <b>{it.title}</b>
                  {it.sub && (
                    <small>
                      {it.dot && <i className="aero-dot" style={{ background: it.dot }} />}
                      {it.sub}
                    </small>
                  )}
                </span>
                {(i === 0 || i === 5) && <em>›</em>}
              </button>
            ))}
          </aside>

          <footer className="aero-footer">
            <button onClick={() => openSteam("mainmenu")}>
              <SteamBadge size={49} />
              STEAM
            </button>
            <i />
            <button onClick={() => openSteam("qam")}>MENU</button>
            <div className="aero-hints">
              <span>
                <b>A</b>Select
              </span>
              <button onClick={() => onInput({ btn: "b", repeat: false } as Press)}>
                <b>B</b>Back
              </button>
              <button onClick={options}>
                <b>Y</b>Options
              </button>
            </div>
          </footer>
        </div>
        <MenuView menu={menu} variant="aero" />
      </Stage>
    </ThemeRoot>
  );
}

function HeroLogo({ g }: { g: Game }) {
  const [i, setI] = useState(0);
  useEffect(() => setI(0), [g.appid]);
  return i < g.art.logo.length ? <img className="aero-hero-logo" src={g.art.logo[i]} onError={() => setI(i + 1)} alt={g.name} /> : <h1 className="aero-hero-logo">{g.name}</h1>;
}

/** A single vector shell keeps the compound curves and glass rims crisp at every resolution. */
function AeroFrame() {
  const top = "M-8 65 C3 30 83 31 157 32 C263 29 336 31 381 60 C463 41 746 61 937 45 C965 43 982 42 997 47 C1101 28 1198 31 1288 14 L1288 78 C1157 101 1030 105 950 122 C821 146 582 134 425 126 C246 112 162 116 48 128 C11 132 -10 117 -8 65 Z";
  const side = "M-12 166 C25 121 137 126 204 150 C276 172 304 220 280 270 C247 335 225 419 232 513 C229 604 247 659 252 739 C270 808 239 830 169 839 C87 849 4 838 -12 806 Z";
  const foot = "M-10 918 C0 869 67 872 117 875 C291 878 483 910 702 912 C908 913 1091 877 1205 889 C1270 891 1287 909 1276 954 C1151 967 1034 946 856 947 C536 947 225 946 87 959 C19 969 -13 956 -10 918 Z";
  return (
    <svg className="aero-frame" viewBox="0 0 1280 960" aria-hidden="true">
      <defs>
        <linearGradient id="aero-blue" x1="0" y1="0" x2=".25" y2="1">
          <stop stopColor="#7ad1ff" />
          <stop offset=".12" stopColor="var(--dht-aero-blue-hi,#158eff)" />
          <stop offset=".35" stopColor="var(--dht-aero-blue,#0660d5)" />
          <stop offset="1" stopColor="var(--dht-aero-blue-lo,#003b9e)" />
        </linearGradient>
        <linearGradient id="aero-lime" x2="0" y2="1">
          <stop stopColor="#eeffb0" />
          <stop offset=".3" stopColor="var(--dht-aero-lime,#b9f400)" />
          <stop offset="1" stopColor="var(--dht-aero-lime-lo,#6eb500)" />
        </linearGradient>
        <linearGradient id="aero-shine" x2="0" y2="1">
          <stop stopColor="white" stopOpacity=".4" />
          <stop offset="1" stopColor="#8bd7ff" stopOpacity="0" />
        </linearGradient>
        <filter id="aero-shadow">
          <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#00256c" floodOpacity=".6" />
        </filter>
        <radialGradient id="aero-specular">
          <stop stopColor="#ffffff" stopOpacity=".95" />
          <stop offset=".5" stopColor="#c8f4ff" stopOpacity=".6" />
          <stop offset="1" stopColor="#b8e9ff" stopOpacity="0" />
        </radialGradient>
      </defs>
      <path d="M-8 0 C71 46 233 -4 370 24 C517 66 760 54 967 46 C1034 46 1112 40 1288 8 L1288 88 C1142 114 1014 110 935 129 C801 152 587 133 431 129 C360 122 373 68 313 51 C193 27 64 47 -8 70 Z" fill="url(#aero-lime)" stroke="#edffc3" strokeWidth="2" />
      <path d="M-8 867 C108 859 249 883 408 902 C215 878 118 886 -8 920 Z M977 908 C1080 886 1171 874 1288 867 L1288 945 Z" fill="url(#aero-lime)" stroke="#e1ffaa" strokeWidth="2" />
      {[top, side, foot].map((d, i) => (
        <g key={i} filter="url(#aero-shadow)">
          <path d={d} fill="url(#aero-blue)" stroke="#005bb4" strokeWidth="10" />
          <path d={d} fill="none" stroke="#8ad8ff" strokeWidth="6" />
          <path d={d} fill="none" stroke="#e3f7ff" strokeWidth="1.8" />
        </g>
      ))}
      <path d="M8 180 C32 139 138 135 205 165 C136 150 47 162 8 207 Z M8 65 C48 32 228 33 321 52 C170 40 73 64 8 91 Z M9 908 C37 879 171 890 277 900 C140 894 50 910 9 937 Z" fill="url(#aero-shine)" />
      <path d="M1033 46 C1133 35 1199 30 1284 15 L1284 78 C1167 94 1076 101 1001 105 C952 107 955 69 1001 54 Z" fill="#0045a2" stroke="#b8ee19" strokeWidth="6" />
      <path d="M985 74 C1030 48 1188 40 1277 24" fill="none" stroke="#b5e7ff" strokeWidth="2" />
      <ellipse cx="31" cy="64" rx="17" ry="10" transform="rotate(-38 31 64)" fill="url(#aero-specular)" />
      <ellipse cx="29" cy="173" rx="23" ry="9" transform="rotate(-39 29 173)" fill="url(#aero-specular)" />
      <ellipse cx="27" cy="903" rx="17" ry="10" transform="rotate(-36 27 903)" fill="url(#aero-specular)" />
    </svg>
  );
}
