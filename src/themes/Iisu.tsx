// iiSU-style home (a bonus look after the iiSU emulation frontend for Android):
// a white (or dark) page with a soft dot grid, rounded square icons in three
// rows that scroll sideways, mixed-size cards ("Jump back in!", "Been a
// while...", "Your Favorites"), pill-shaped status bars along the top, a dock
// of five colourful tabs (Home, Collections, Achievements, Friends, Apps)
// switched with L1 / R1, button hints in the bottom corners and a game screen
// (big cover, title, playtime, media, achievements) that Ⓐ opens on a game.
// Every icon, shape and card here is drawn in this file; no iiSU artwork.
// Notes: handoff-notes/iisu-theme.md. CSS hooks: CSS-THEMING.md (dht-iisu-*).
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { BatteryGlyph, GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { achievements, fmtLastPlayed, fmtPlaytime, Game, openAchievements, openSteam, SteamPlace } from "../library";
import { openDestination } from "../destinations";
import { showTitle, THEMES } from "../settings";
import { useNoticeSounds } from "../activity";
import { fmtDate, fmtTime, playSound, useBattery, useClock, useSteamStatus, useWallpaper } from "../steam";
import { styleOf } from "../engine/themeStyles";
import { useReportFocus } from "../focus";
import { IISU_FONT, iisuAccent, iisuPill, iisuSchemeVars } from "./iisuStyles";

type Tab = "home" | "collections" | "achievements" | "friends" | "apps";
const TABS: Tab[] = ["home", "collections", "achievements", "friends", "apps"];
const TAB_NAMES: Record<Tab, string> = { home: "Home", collections: "Collections", achievements: "Achievements", friends: "Friends", apps: "Apps" };
const EMPTY: Record<Tab, [string, string]> = {
  home: ["No games yet", "Games in your Steam library show up here."],
  collections: ["No collections yet", "Steam collections with games show up here."],
  achievements: ["No games yet", "Achievement progress shows up here once you have games."],
  friends: ["", ""],
  apps: ["", ""],
};

type Card = "jump" | "while" | "favs";
type Item = { key: string; label: string; game?: Game; icon?: IconName; tint?: string; card?: Card; span?: [number, number]; run: () => void };
type Rect = { x: number; y: number; w: number; h: number };
type Kind = "pages" | "grid" | "row" | "wide" | "cards";
type Dir = "up" | "down" | "left" | "right";

/** Colours of the light (iiSU's default white) and dark looks. Each one can be replaced with a --dht-iisu-* variable. */
function palette(light: boolean) {
  return light
    ? { text: "#3a3d4a", sub: "#6c7182", pill: "linear-gradient(180deg,#ffffff,#f4f5f9)", pillEdge: "#00000012", pillShadow: "0 4px 14px #00000020", page: "#f2f3f7", dots: "#0000000f", edge: "#ffffff", tileShadow: "0 3px 10px #00000030", wash: "#ffffffb0", battery: "#3a3d4a" }
    : { text: "#ffffff", sub: "#ffffffb0", pill: String(iisuPill.background), pillEdge: "#ffffff55", pillShadow: String(iisuPill.boxShadow), page: "#16181f", dots: "#ffffff12", edge: "#ffffff40", tileShadow: "0 4px 12px #0006", wash: "#000000a0", battery: "#7dff9a" };
}
const v = (name: string, fallback: string) => `var(--dht-iisu-${name}, ${fallback})`;

export function IisuHome() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const st = styleOf(s, "iisu");
  const menu = useMenu();
  const now = useClock(15000);
  const bat = useBattery();
  const status = useSteamStatus();
  useNoticeSounds(); // the pack's friend online / join / message cues
  const wall = useWallpaper("iisu");
  const [ringC, fill, deep] = iisuAccent(s);
  const animate = s.animations !== false;
  const light = st<string>("scheme") !== "dark";
  const pal = palette(light);

  const [tab, setTab] = useRemembered<Tab>("iisu-tab", (st<string>("startTab") as Tab) || "home");
  const [zone, setZone] = useRemembered<"content" | "dock">("iisu-zone", "content");
  const [sel, setSel] = useRemembered<Record<string, number>>("iisu-sel", {});
  const [openCol, setOpenCol] = useRemembered<string | null>("iisu-col", null);
  const [panelId, setPanelId] = useRemembered<number | null>("iisu-panel", null);
  const scrollMem = useRef<Record<string, number>>({});

  const browse = (st<string>("browse") || "pages") as "pages" | "grid" | "row";
  const cols = st<number>("columns") || 8;
  const rowsOpt = st<string | number>("rows");
  const rows = typeof rowsOpt === "number" ? rowsOpt : H / Math.max(1, W) >= 0.7 ? 4 : 3;
  const features = st<boolean>("featureCards") !== false;

  const games = api.lib.games;
  const recent = games.length ? [...games].sort((a, b) => b.lastPlayed - a.lastPlayed)[0] : undefined;
  const openPanel = (g: Game) => (setPanelId(g.appid), playSound("open"));
  const gameItem = (g: Game): Item => ({ key: `g${g.appid}`, label: g.name, game: g, run: () => api.activate(g, () => openPanel(g)) });

  // ───── what each tab holds ─────
  const collections = [
    { id: "all", name: "All Games", games: api.lib.all.length ? api.lib.all : games },
    { id: "installed", name: "Installed", games: games.filter((g) => g.installed) },
    ...api.lib.collections,
  ].filter((c) => c.games.length);
  const opened = openCol ? collections.find((c) => c.id === openCol) : undefined;
  const favs = api.lib.collections.find((c) => c.id === "favorite" && c.games.length);
  const place = (key: string, label: string, icon: IconName, tint: string, run: () => void): Item => ({ key, label, icon, tint, run: () => (playSound("select"), run()) });
  const items: Item[] = (() => {
    switch (tab) {
      case "home": {
        const list = games.map(gameItem);
        if (browse === "row") return list;
        // iiSU mixes sizes: the most recent game is a big 2 × 2 icon, cards are two cells wide
        if (features && browse === "pages" && rows >= 3 && list.length > 1) list[0] = { ...list[0], span: [2, 2] };
        const out: Item[] = [];
        if (st<boolean>("jumpBack") && recent) out.push({ ...gameItem(recent), key: "jump", card: "jump", span: [2, 1], run: () => api.launch(recent) });
        out.push(...list);
        if (features) {
          const old = games.filter((g) => g.lastPlayed > 0 && g.appid !== recent?.appid).sort((a, b) => a.lastPlayed - b.lastPlayed)[0];
          if (old && games.length >= 5) out.splice(Math.min(out.length, 7), 0, { ...gameItem(old), key: "while", label: old.name, card: "while", span: [2, 1] });
          if (favs && games.length) out.splice(Math.min(out.length, 12), 0, { key: "favs", label: "Your Favorites", game: favs.games[0], card: "favs", span: [2, 1], run: () => (setTab("collections"), setOpenCol(favs.id), playSound("open")) });
        }
        return out;
      }
      case "collections":
        if (opened) return opened.games.map(gameItem);
        return collections.map((c) => ({ key: `c${c.id}`, label: c.name, run: () => (setOpenCol(c.id), playSound("open")) }));
      case "achievements":
        return games.map((g) => ({ key: `t${g.appid}`, label: g.name, game: g, run: () => (playSound("open"), openAchievements(g)) }));
      case "friends":
        return [
          place("friends", "Friends List", "friends", "#2fc7b0", () => openSteam("friends")),
          place("community", "Community", "globe", "#4aa6ee", () => openSteam("community")),
          place("bell", "Notifications", "bell", "#f0a33c", () => openSteam("notifications")),
        ];
      case "apps":
        return [
          place("store", "Store", "store", "#5b8cff", () => openSteam("store")),
          place("library", "Library", "library", "#8b78f0", () => openSteam("library")),
          place("media", "Media", "photo", "#ee5f97", () => api.openMedia()),
          place("music", "Music", "music", "#f08a4f", () => openDestination({ place: "music" })),
          place("downloads", "Downloads", "download", "#3cc495", () => openSteam("downloads")),
          place("web", "Web", "globe", "#2fa8e0", () => openSteam("browser" as SteamPlace)),
          place("settings", "Settings", "gear", "#7d8597", () => openSteam("settings")),
          place("home-settings", "Home Settings", "palette", "#b45cf0", () => api.openSettings()),
          place("power", "Power", "power", "#e8505b", () => openSteam("power")),
          ...api.lib.apps.map(gameItem),
        ];
    }
  })();
  const selKey = tab === "collections" && opened ? `col:${opened.id}` : tab;
  const cur = clamp(sel[selKey] ?? 0, 0, Math.max(0, items.length - 1));
  const setCur = (i: number) => setSel((p) => ({ ...p, [selKey]: i }));
  const item = items[cur];

  // ───── the game screen (Ⓐ on a game) ─────
  const panelList: Game[] = [];
  for (const it of items) if (it.game && it.card !== "favs" && !panelList.some((g) => g.appid === it.game!.appid)) panelList.push(it.game);
  const panelAt = panelId == null ? -1 : panelList.findIndex((g) => g.appid === panelId);
  const panelGame = panelAt >= 0 ? panelList[panelAt] : undefined;
  useEffect(() => {
    if (panelId != null && !panelGame) setPanelId(null); // the game left the list (tab change, library change)
  }, [panelId, panelGame]);
  const closePanel = () => {
    if (panelGame) {
      const i = items.findIndex((it) => it.game?.appid === panelGame.appid && !it.card);
      if (i >= 0) setCur(i);
    }
    setPanelId(null);
    setZone("content");
    playSound("back");
  };

  const g = panelGame ?? (zone === "content" && item?.card !== "favs" ? item?.game : undefined);
  useReportFocus(g);
  const bgGame = panelGame ?? item?.game ?? recent;
  const [bg, setBg] = useState<Game | undefined>(bgGame);
  useEffect(() => {
    const t = setTimeout(() => setBg(bgGame), 220);
    return () => clearTimeout(t);
  }, [bgGame?.appid]);

  // ───── layout ─────
  const panel = { x: 40, y: 92, w: W - 80, h: H - 92 - 118 };
  const kind: Kind = tab === "collections" && !opened ? "cards" : tab === "achievements" || tab === "friends" ? "wide" : browse;
  const lay = layout(kind, items, panel, { rows, cols: kind === "wide" ? (tab === "friends" ? 3 : 4) : cols, top: opened ? 44 : 22, cur });
  // scroll: keep the focused item in view (sideways for rows, downwards for grids)
  const view = lay.axis === "x" ? panel.w : panel.h;
  let scroll = 0;
  if (kind === "row") scroll = Math.max(0, (lay.rects[cur]?.x ?? 0) + (lay.rects[cur]?.w ?? 0) / 2 - panel.w / 2);
  else if (kind !== "cards" && lay.rects[cur]) {
    const r = lay.rects[cur];
    const [a, b] = lay.axis === "x" ? [r.x, r.x + r.w] : [r.y, r.y + r.h];
    scroll = clamp(scrollMem.current[selKey] ?? 0, b + lay.endPad - view, a - lay.startPad);
    scroll = clamp(scroll, 0, Math.max(0, lay.extent + lay.endPad - view));
  }
  if (kind !== "cards") scrollMem.current[selKey] = scroll;
  const pages = kind === "pages" ? Math.max(1, Math.ceil((lay.extent + lay.endPad) / view - 0.02)) : 1;
  const maxScroll = Math.max(0, lay.extent + lay.endPad - view);
  const page = pages > 1 ? Math.round((scroll / Math.max(1, maxScroll)) * (pages - 1)) : 0;

  const switchTab = (d: number) => {
    const nx = clamp(TABS.indexOf(tab) + d, 0, TABS.length - 1);
    if (TABS[nx] === tab) return playSound("end");
    setTab(TABS[nx]);
    setOpenCol(null);
    playSound("tab");
  };

  const options = () => {
    const extra: MenuItem[] = [
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    menu.open(g ? [{ label: "Play", action: () => api.launch(g) }, { label: "Game Details", action: () => api.details(g) }, { label: "Achievements", action: () => openAchievements(g) }, { label: "Game Options", action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
  };

  const panelInput = (b: Press["btn"]): boolean => {
    if (!panelGame) return false;
    if (b === "a") return api.launch(panelGame), true;
    if (b === "b") return closePanel(), true;
    if (b === "x") return api.openMedia(panelGame.appid), true;
    if (b === "y") return achievements(panelGame) ? (playSound("open"), openAchievements(panelGame)) : options(), true;
    if (b === "menu") return api.details(panelGame), true;
    if (b === "up" || b === "down") {
      const nx = clamp(panelAt + (b === "down" ? 1 : -1), 0, panelList.length - 1);
      if (nx === panelAt) playSound("end");
      else (setPanelId(panelList[nx].appid), playSound("move"));
      return true;
    }
    return true; // nothing else leaves the game screen
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (panelGame) return panelInput(b);
    if (b === "y") return options(), true;
    if (b === "menu") return g ? api.details(g) : options(), true;
    if (b === "l1" || b === "r1") return switchTab(b === "r1" ? 1 : -1), true;
    if (zone === "dock") {
      if (b === "left" || b === "right") switchTab(b === "right" ? 1 : -1);
      else if (b === "up" || b === "b" || b === "a") (setZone("content"), playSound(b === "a" ? "select" : "move"));
      return true;
    }
    if (b === "b") {
      if (opened) return setOpenCol(null), playSound("back"), true;
      return false;
    }
    if (!items.length) {
      // nothing to focus: Ⓐ / ↓ go to the dock, so the pad never dead-ends
      if (b === "a" || b === "down") (setZone("dock"), playSound("move"));
      return b === "a" || b === "down" || b === "up" || b === "left" || b === "right";
    }
    if (b === "x" && g) return api.launch(g), true;
    if (b === "a") return item?.run(), true;
    if (b !== "up" && b !== "down" && b !== "left" && b !== "right") return false;
    if (kind === "cards") {
      if (b === "left" || b === "right") {
        const nx = clamp(cur + (b === "right" ? 1 : -1), 0, items.length - 1);
        playSound(nx !== cur ? "tile" : "end");
        if (nx !== cur) setCur(nx);
      } else if (b === "down") (setZone("dock"), playSound("move"));
      return true;
    }
    let nx = nearest(lay.rects, cur, b);
    // vertical grids read left to right: the ends of a row continue on the next / previous row
    if (nx < 0 && (kind === "grid" || kind === "wide") && (b === "left" || b === "right")) nx = clamp(cur + (b === "right" ? 1 : -1), 0, items.length - 1);
    if (nx >= 0 && nx !== cur) return setCur(nx), playSound(b === "left" || b === "right" ? "tile" : "move"), true;
    if (b === "down") return setZone("dock"), playSound("move"), true;
    playSound("end");
    return true;
  };

  const bgMode = st<string>("background") || "pattern";
  const glass = st<string>("glass");
  const panelBg = glass === "clear" ? "transparent" : light ? (glass === "dark" ? "#ffffff" : "#ffffffc4") : glass === "dark" ? "linear-gradient(180deg,#14121fcc,#0b0a14d9)" : "linear-gradient(180deg,#ffffff30,#ffffff18)";
  const title = panelGame ? panelGame.name : zone === "dock" ? TAB_NAMES[tab] : item ? (item.game && item.card !== "favs" && !showTitle(s, "iisu", true) ? "" : item.card === "favs" ? item.label : item.game ? item.game.name : item.label) : TAB_NAMES[tab];
  const pill: CSSProperties = { ...iisuPill, background: v("pill", pal.pill), border: `1.5px solid ${v("pill-edge", pal.pillEdge)}`, boxShadow: pal.pillShadow, color: v("text", pal.text), backdropFilter: light ? "none" : iisuPill.backdropFilter };
  const vars = { "--dht-iisu-accent-ring": ringC, "--dht-iisu-accent-fill": fill, "--dht-iisu-accent-deep": deep, ...iisuSchemeVars(light) } as CSSProperties;
  const ring = v("ring", ringC);
  const online = status.friendsOnline;
  const empty = EMPTY[tab];

  return (
    <ThemeRoot onInput={onInput} hints={(panelGame ? { a: "Play", b: "Back", x: "Media", y: "Achievements" } : { a: "Select", b: "Back", y: "Menu", l1: "Tabs", r1: "Tabs" }) as any}>
      <Stage background={pal.page}>
        <div className="dht-iisu" data-scheme={light ? "light" : "dark"} data-tab={tab} data-zone={panelGame ? "game" : zone} data-browse={kind} style={{ position: "absolute", inset: 0, ...vars, fontFamily: IISU_FONT, color: v("text", pal.text) }}>
          {/* background */}
          <div className="dht-iisu-bg" style={{ position: "absolute", inset: 0, background: v("bg", bgMode === "colour" ? `radial-gradient(ellipse at 30% 10%, ${fill}${light ? "55" : "88"} 0%, ${light ? "#f2f3f7" : deep} 60%, ${light ? "#e9eaf0" : "#08070d"} 100%)` : `radial-gradient(${pal.dots} 1.6px, transparent 1.8px) 0 0 / 24px 24px, ${pal.page}`) }} />
          {bgMode === "pattern" && <Confetti light={light} W={W} H={H} />}
          {wall && bgMode === "colour" && <img src={wall} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} />}
          {bg && (bgMode === "art" || bgMode === "blur" || panelGame) && (
            <div key={bg.appid} className="dht-iisu-art" style={{ position: "absolute", inset: 0, overflow: "hidden", animation: animate ? "dhtIisuFade 500ms ease-out" : "none" }}>
              <GameArt g={bg} kind="hero" style={{ width: W, height: H, ...(bgMode === "blur" && !panelGame ? { filter: "blur(26px) saturate(1.3)", transform: "scale(1.12)" } : {}) }} />
              <div style={{ position: "absolute", inset: 0, background: v("wash", light ? pal.wash : "linear-gradient(180deg,#0008 0%,#0004 30%,#0005 70%,#000b 100%)") }} />
            </div>
          )}
          <style>{CSS}</style>

          {/* top bars */}
          <div className="dht-iisu-pill dht-iisu-online" style={{ ...pill, position: "absolute", left: 24, top: 22, height: 50, padding: "0 22px 0 8px", display: "flex", alignItems: "center", gap: 10, fontSize: 18 }} onClick={() => openSteam("friends")}>
            <div style={{ width: 36, height: 36, borderRadius: 18, background: `linear-gradient(135deg,${ringC},${fill})`, display: "grid", placeItems: "center", boxShadow: `0 0 0 2px ${light ? "#fff" : "#ffffffcc"}` }}>
              <Icon name="friends" size={20} color="#fff" />
            </div>
            {online === undefined ? "Friends" : `${online} online`}
          </div>
          {title && (
            <div className="dht-iisu-pill dht-iisu-title" style={{ ...pill, position: "absolute", left: "50%", top: 22, transform: "translateX(-50%)", height: 50, maxWidth: W * 0.4, padding: "0 30px", display: "flex", alignItems: "center", fontSize: 19, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{title}</div>
          )}
          <div className="dht-iisu-pill dht-iisu-status" style={{ ...pill, position: "absolute", right: 98, top: 22, height: 50, padding: "0 20px", display: "flex", alignItems: "center", gap: 12, fontSize: 18 }}>
            <Icon name="clock" size={20} color="currentColor" />
            <span>{fmtTime(now, s.clock24)}</span>
            {st<boolean>("statusDate") && <><Bar /><span>{fmtDate(now)}</span></>}
            {bat && <><Bar /><span>{Math.round(bat.level * (bat.level <= 1 ? 100 : 1))}%</span><BatteryGlyph level={bat.level} charging={bat.charging} w={26} color={pal.battery} /></>}
          </div>
          <div className="dht-iisu-avatar" style={{ position: "absolute", right: 24, top: 14, width: 64, height: 64, borderRadius: 32, background: `linear-gradient(135deg,${fill},${deep})`, boxShadow: "0 0 0 3px #ffffffcc, 0 6px 18px #0005", display: "grid", placeItems: "center", color: "#fff", fontWeight: 900, fontSize: 28, overflow: "hidden" }}>
            {status.avatar ? <img src={status.avatar} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : (api.user || "P").slice(0, 1).toUpperCase()}
          </div>

          {/* the icon panel */}
          {!panelGame && (
            <div className="dht-iisu-panel" style={{ position: "absolute", left: panel.x, top: panel.y, width: panel.w, height: panel.h, borderRadius: 28, background: v("panel", panelBg), border: glass === "clear" ? "none" : `1.5px solid ${light ? "#00000010" : "#ffffff44"}`, boxShadow: glass === "clear" ? "none" : light ? "0 10px 30px #0000001a, inset 0 1px 0 #fff" : "0 18px 50px #0007, inset 0 1px 0 #ffffff55", backdropFilter: glass === "clear" ? "none" : "blur(10px)", overflow: "hidden" }}>
              {kind === "cards" ? (
                <CollectionCards W={panel.w} H={panel.h} items={items} cur={cur} focused={zone === "content"} counts={collections.map((c) => c.games.length)} ringC={ringC} fill={fill} pick={(i) => (i === cur && zone === "content" ? items[i].run() : (setZone("content"), setCur(i), playSound("tile")))} />
              ) : (
                <Tiles rects={lay.rects} axis={lay.axis} scroll={scroll} view={view} items={items} cur={cur} focused={zone === "content"} kind={kind} ring={ring} pal={pal} art={st<string>("iconArt")} animate={animate}
                  titled={(on) => showTitle(s, "iisu", on)} pick={(i) => (i === cur && zone === "content" ? items[i].run() : (setZone("content"), setCur(i), playSound("tile")))} />
              )}
              {opened && <div className="dht-iisu-crumb" style={{ position: "absolute", left: 24, top: 12, fontSize: 15, fontWeight: 800, color: v("sub", pal.sub) }}>Collections › {opened.name}</div>}
              {pages > 1 && (
                <div className="dht-iisu-pages" style={{ position: "absolute", left: 0, right: 0, bottom: 12, display: "flex", justifyContent: "center", gap: 8 }}>
                  {Array.from({ length: Math.min(pages, 12) }, (_, i) => <span key={i} data-selected={i === page} style={{ width: i === page ? 22 : 8, height: 8, borderRadius: 4, background: i === page ? ring : light ? "#00000026" : "#ffffff40", transition: "width 150ms" }} />)}
                </div>
              )}
              {!items.length && (
                <div className="dht-iisu-empty" style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center", color: v("sub", pal.sub) }}>
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 900, color: v("text", pal.text) }}>{empty[0] || "Nothing here yet"}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6 }}>{empty[1]}</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {panelGame && <GameScreen W={W} H={H} list={panelList} at={panelAt} pal={pal} pill={pill} ring={ring} launch={() => api.launch(panelGame)} media={() => api.openMedia(panelGame.appid)} achievements={() => openAchievements(panelGame)} back={closePanel} pick={(i) => (setPanelId(panelList[i].appid), playSound("move"))} />}

          {/* dock */}
          {!panelGame && <Dock W={W} H={H} tab={tab} focused={zone === "dock"} dark={st<boolean>("darkIcons")} ring={ring} pill={pill} pick={(t) => (t === tab ? setZone("content") : (setTab(t), setOpenCol(null), playSound("tab")))} />}

          {/* button hints */}
          {st<boolean>("hints") && (
            <>
              <div className="dht-iisu-hints" data-side="left" style={{ ...pill, borderRadius: 18, position: "absolute", left: 24, bottom: 24, padding: "8px 18px", fontSize: 17, lineHeight: "26px" }}>
                <div><Btn c="B" /> {panelGame || opened ? "Back" : "Steam Home"}</div>
                <div><Btn c="≡" /> Details</div>
              </div>
              <div className="dht-iisu-hints" data-side="right" style={{ ...pill, borderRadius: 18, position: "absolute", right: 24, bottom: 24, padding: "8px 18px", fontSize: 17, lineHeight: "26px" }}>
                <div><Btn c="A" /> {panelGame ? (panelGame.installed ? "Play" : "Install") : "Select"}</div>
                <div><Btn c="Y" /> {panelGame && achievements(panelGame) ? "Achievements" : "Menu"}</div>
              </div>
            </>
          )}
          <MenuView menu={menu} variant="iisu" />
        </div>
      </Stage>
    </ThemeRoot>
  );
}

const Bar = () => <span style={{ width: 2, height: 20, background: "currentColor", opacity: 0.45, borderRadius: 1 }} />;
const Btn = ({ c }: { c: string }) => <span style={{ display: "inline-grid", placeItems: "center", width: 22, height: 22, borderRadius: 11, border: "2px solid currentColor", fontSize: 12, marginRight: 4, verticalAlign: "middle", boxSizing: "border-box" }}>{c}</span>;
function Badge({ text, style }: { text: string; style: CSSProperties }) {
  return <span style={{ position: "absolute", ...style, fontSize: 11, fontWeight: 900, padding: "1px 5px", borderRadius: 6, background: "#fff", color: "#222", border: "1px solid #0000001a", boxShadow: "0 2px 6px #0004" }}>{text}</span>;
}

// ───────────── layout ─────────────
/**
 * Places the items of a tab: "pages" fills `rows` rows column by column and
 * scrolls sideways (iiSU's home and app list), "grid" / "wide" fill rows of
 * `cols` and scroll down, "row" is one row. Items may span several cells.
 */
function layout(kind: Kind, items: Item[], panel: { w: number; h: number }, o: { rows: number; cols: number; top: number; cur: number }) {
  const PAD = 22, GAP = 14;
  const rects: Rect[] = [];
  if (kind === "cards") return { rects, axis: "x" as const, extent: 0, startPad: PAD, endPad: PAD };
  if (kind === "row") {
    const size = Math.min(220, panel.h - 120);
    items.forEach((_, i) => rects.push({ x: PAD + i * (size + GAP), y: (panel.h - size) / 2 - 16, w: size, h: size }));
    return { rects, axis: "x" as const, extent: PAD + items.length * (size + GAP), startPad: PAD, endPad: PAD };
  }
  const colMajor = kind === "pages";
  const lanes = Math.max(1, colMajor ? o.rows : o.cols);
  const BOTTOM = colMajor ? 40 : PAD; // room for the page dots
  const cw = colMajor ? (panel.h - o.top - BOTTOM - GAP * (lanes - 1)) / lanes : (panel.w - PAD * 2 - GAP * (lanes - 1)) / lanes;
  const ch = kind === "wide" ? cw * 0.62 + 64 : cw;
  const used = new Set<string>();
  let cursor = 0, extent = 0;
  for (const it of items) {
    const [sw, sh] = it.span ?? [1, 1];
    const along = colMajor ? sw : sh, across = Math.min(lanes, colMajor ? sh : sw);
    const free = (a: number, b: number) => {
      for (let i = 0; i < along; i++) for (let j = 0; j < across; j++) if (used.has(`${a + i},${b + j}`)) return false;
      return true;
    };
    let a = cursor, b = 0;
    for (;; a++) {
      let hit = -1;
      for (let j = 0; j + across <= lanes; j++) if (free(a, j)) { hit = j; break; }
      if (hit >= 0) { b = hit; break; }
    }
    for (let i = 0; i < along; i++) for (let j = 0; j < across; j++) used.add(`${a + i},${b + j}`);
    while ([...Array(lanes).keys()].every((j) => used.has(`${cursor},${j}`))) cursor++;
    const r = colMajor
      ? { x: PAD + a * (cw + GAP), y: o.top + b * (ch + GAP), w: along * cw + (along - 1) * GAP, h: across * ch + (across - 1) * GAP }
      : { x: PAD + b * (cw + GAP), y: o.top + a * (ch + GAP), w: across * cw + (across - 1) * GAP, h: along * ch + (along - 1) * GAP };
    rects.push(r);
    extent = Math.max(extent, colMajor ? r.x + r.w : r.y + r.h);
  }
  return { rects, axis: colMajor ? ("x" as const) : ("y" as const), extent, startPad: colMajor ? PAD : o.top, endPad: colMajor ? PAD : BOTTOM };
}

/** The item next to `cur` in a direction: nearest along that direction, lined-up items first. -1 when there is none. */
function nearest(rects: Rect[], cur: number, dir: Dir): number {
  const a = rects[cur];
  if (!a) return -1;
  let best = -1, score = Infinity;
  const gap = (s1: number, e1: number, s2: number, e2: number) => Math.max(0, Math.max(s1, s2) - Math.min(e1, e2));
  rects.forEach((r, i) => {
    if (i === cur) return;
    let main: number, side: number;
    if (dir === "right") { if (r.x < a.x + a.w - 1) return; main = r.x - (a.x + a.w); side = gap(a.y, a.y + a.h, r.y, r.y + r.h); }
    else if (dir === "left") { if (r.x + r.w > a.x + 1) return; main = a.x - (r.x + r.w); side = gap(a.y, a.y + a.h, r.y, r.y + r.h); }
    else if (dir === "down") { if (r.y < a.y + a.h - 1) return; main = r.y - (a.y + a.h); side = gap(a.x, a.x + a.w, r.x, r.x + r.w); }
    else { if (r.y + r.h > a.y + 1) return; main = a.y - (r.y + r.h); side = gap(a.x, a.x + a.w, r.x, r.x + r.w); }
    // lined-up neighbours win; among them the closest, then the one nearest the top / left
    const sc = (side > 0 ? 1e6 + side * 4 : 0) + main * 10 + (dir === "left" || dir === "right" ? r.y : r.x) * 0.01;
    if (sc < score) (score = sc), (best = i);
  });
  return best;
}

// ───────────── tiles ─────────────
type Pal = ReturnType<typeof palette>;
function Tiles(p: {
  rects: Rect[]; axis: "x" | "y"; scroll: number; view: number; items: Item[]; cur: number; focused: boolean; kind: Kind;
  ring: string; pal: Pal; art: string; animate: boolean; titled: (on: boolean) => boolean; pick: (i: number) => void;
}) {
  const curRect = p.rects[p.cur];
  return (
    <div className="dht-iisu-tiles" style={{ position: "absolute", inset: 0 }}>
      {p.items.map((it, i) => {
        const r = p.rects[i];
        if (!r) return null;
        const start = p.axis === "x" ? r.x : r.y, len = p.axis === "x" ? r.w : r.h;
        if (start + len < p.scroll - p.view * 0.5 || start > p.scroll + p.view * 1.5) return null;
        const on = p.focused && i === p.cur;
        const big = r.w > r.h * 1.5 || r.h > 260;
        return (
          <div key={it.key} className="dht-iisu-tile dht-tile" data-selected={on} data-name={it.label} data-card={it.card ?? (it.game ? "game" : "place")} onClick={() => p.pick(i)}
            style={{ position: "absolute", left: r.x - (p.axis === "x" ? p.scroll : 0), top: r.y - (p.axis === "y" ? p.scroll : 0), width: r.w, height: r.h, borderRadius: v("radius", "18px"), overflow: "hidden", boxSizing: "border-box",
              transition: p.animate ? "left 180ms ease-out, top 180ms ease-out, transform 150ms" : "none", transform: on ? `scale(${big ? 1.025 : 1.06})` : "none", zIndex: on ? 2 : 1,
              border: `3px solid ${on ? "#fff" : p.pal.edge}`,
              boxShadow: on ? `0 0 0 4px ${p.ring}, 0 0 24px ${p.ring}, 0 10px 24px #0005` : p.pal.tileShadow, background: "#ffffff20", animation: on && p.animate ? "dhtIisuPulse 1.8s ease-in-out infinite" : "none" }}>
            {p.kind === "wide" ? <WideCard it={it} size={r.w} /> : it.card && it.game ? <CardFace it={it} /> : <TileFace it={it} art={p.art} on={on} />}
          </div>
        );
      })}
      {p.kind === "row" && p.items[p.cur] && curRect && (
        <div className="dht-iisu-row-title" style={{ position: "absolute", left: 0, right: 0, top: curRect.y + curRect.h + 22, textAlign: "center", fontSize: 22, fontWeight: 900, color: v("text", p.pal.text) }}>{!p.items[p.cur].game || p.titled(true) ? p.items[p.cur].label : ""}</div>
      )}
    </div>
  );
}

function TileFace({ it, art, on }: { it: Item; art: string; on: boolean }) {
  if (it.game) return <GameArt g={it.game} kind={art === "header" ? "landscape" : "portrait"} position="50% 22%" flat style={{ width: "100%", height: "100%" }} />;
  return (
    <div style={{ width: "100%", height: "100%", background: `linear-gradient(145deg, ${it.tint ?? "#8b78f0"}, ${shade(it.tint ?? "#8b78f0")})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: "#fff" }}>
      <Icon name={it.icon ?? "apps"} size={on ? 50 : 44} color="#fff" />
      <span style={{ fontSize: 14, fontWeight: 800, textAlign: "center", padding: "0 6px" }}>{it.label}</span>
    </div>
  );
}

/** "Jump back in!", "Been a while..." and "Your Favorites": wide art with a label pill, as iiSU's home cards. */
function CardFace({ it }: { it: Item }) {
  const g = it.game!;
  const label = it.card === "jump" ? "Jump back in!" : it.card === "while" ? "Been a while..." : "Your Favorites";
  return (
    <div className="dht-iisu-card" data-card={it.card} style={{ position: "relative", width: "100%", height: "100%", background: "#222" }}>
      <GameArt g={g} kind="hero" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      {it.card === "jump" && (
        <div style={{ position: "absolute", left: "6%", top: "10%", bottom: "10%", aspectRatio: "2 / 3", borderRadius: 10, overflow: "hidden", boxShadow: "0 0 0 2px #fff, 0 6px 16px #000a" }}>
          <GameArt g={g} kind="portrait" flat style={{ width: "100%", height: "100%" }} />
        </div>
      )}
      <div className="dht-iisu-card-label" style={{ position: "absolute", right: "5%", bottom: "9%", padding: "4px 14px", borderRadius: 999, background: "#ffffffee", color: "#3a3d4a", fontSize: 15, fontWeight: 900, boxShadow: "0 3px 10px #0005", whiteSpace: "nowrap" }}>
        {it.card === "jump" && <Btn c="A" />}{label}
      </div>
    </div>
  );
}

function WideCard({ it, size }: { it: Item; size: number }) {
  const prog = it.game ? achievements(it.game) : null;
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ height: size * 0.62, position: "relative", overflow: "hidden", flex: "none" }}>
        {it.game ? <GameArt g={it.game} kind="landscape" flat style={{ width: "100%", height: "100%" }} /> : <TileFace it={{ ...it, label: "" }} art="cover" on={false} />}
      </div>
      <div style={{ flex: 1, padding: "8px 14px", background: "#000000a8", color: "#fff" }}>
        <div style={{ fontSize: 16, fontWeight: 900, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.label}</div>
        {it.game ? (
          <>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>{prog ? `${prog.unlocked} / ${prog.total} unlocked` : `${fmtPlaytime(it.game.playtime, it.game.lastPlayed, true)} · ${fmtLastPlayed(it.game.lastPlayed)}`}</div>
            {prog && prog.total > 0 && <div style={{ height: 6, borderRadius: 3, background: "#ffffff30", marginTop: 6 }}><div style={{ width: `${(100 * prog.unlocked) / prog.total}%`, height: "100%", borderRadius: 3, background: "linear-gradient(90deg,#ffd36b,#ff9f43)" }} /></div>}
          </>
        ) : null}
      </div>
    </div>
  );
}

// Collections as big glass platform cards, the focused one in the middle.
function CollectionCards(p: { W: number; H: number; items: Item[]; cur: number; focused: boolean; counts: number[]; ringC: string; fill: string; pick: (i: number) => void }) {
  const cw = Math.min(640, p.W * 0.55), ch = Math.min(360, p.H - 70);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      {p.items.map((it, i) => {
        const d = i - p.cur;
        if (Math.abs(d) > 2) return null;
        const on = d === 0;
        const scale = on ? 1 : 0.72;
        const x = p.W / 2 - cw / 2 + d * (cw * 0.92);
        return (
          <div key={it.key} className="dht-iisu-platform dht-tile" data-selected={on && p.focused} data-name={it.label} onClick={() => p.pick(i)}
            style={{ position: "absolute", left: x, top: (p.H - ch) / 2, width: cw, height: ch, borderRadius: 36, transform: `scale(${scale})`, opacity: on ? 1 : 0.55, zIndex: on ? 2 : 1, transition: "left 220ms ease-out, transform 220ms, opacity 220ms", overflow: "hidden",
              background: `linear-gradient(135deg, ${p.fill}cc, #1a1830ee)`, border: "3px solid #ffffffcc", boxShadow: on && p.focused ? `0 0 0 4px ${v("ring", p.ringC)}, 0 0 40px ${p.ringC}aa, inset 0 0 40px #ffffff40` : "inset 0 0 30px #ffffff30, 0 16px 40px #0005" }}>
            <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(#ffffff14 1px, transparent 1px), linear-gradient(90deg, #ffffff14 1px, transparent 1px)", backgroundSize: "26px 26px" }} />
            <Cubes />
            <div style={{ position: "absolute", left: 0, right: 0, bottom: ch * 0.2, textAlign: "center", color: "#fff", textShadow: "0 3px 12px #000a" }}>
              <div style={{ fontSize: 42, fontWeight: 900, letterSpacing: 6, textTransform: "uppercase" }}>{it.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, opacity: 0.85, marginTop: 6 }}>{p.counts[i]} {p.counts[i] === 1 ? "game" : "games"}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
function Cubes() {
  const cube = (x: number, y: number, s: number, o: number) => (
    <g transform={`translate(${x} ${y}) scale(${s})`} opacity={o}>
      <path d="M0 -20 L18 -10 L0 0 L-18 -10Z" fill="#ffffffcc" />
      <path d="M-18 -10 L0 0 L0 20 L-18 10Z" fill="#ffffff88" />
      <path d="M18 -10 L0 0 L0 20 L18 10Z" fill="#ffffff55" />
    </g>
  );
  return (
    <svg viewBox="0 0 400 220" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
      {cube(70, 70, 1.6, 0.5)}
      {cube(330, 60, 1.2, 0.45)}
      {cube(90, 170, 1, 0.35)}
      {cube(300, 160, 0.9, 0.35)}
    </svg>
  );
}

/** Soft scattered shapes on the page (our own: rings, pills, plus signs, triangles; iiSU scatters console logos here). */
function Confetti({ light, W, H }: { light: boolean; W: number; H: number }) {
  const o = light ? 0.55 : 0.18;
  const C = ["#ff8fb8", "#7fd3ff", "#ffcf6b", "#8ff0c8", "#b9a2ff", "#ff9f7a"];
  const shapes: [number, number, number, number, string][] = [
    [0.04, 0.2, -18, 0, "ring"], [0.96, 0.24, 12, 1, "plus"], [0.07, 0.86, 22, 2, "tri"], [0.33, 0.95, -10, 3, "pill"], [0.62, 0.93, 30, 4, "ring"],
    [0.93, 0.8, -25, 5, "tri"], [0.5, 0.06, 15, 2, "pill"], [0.25, 0.1, 40, 1, "plus"], [0.78, 0.07, -35, 0, "tri"],
  ];
  return (
    <svg className="dht-iisu-confetti" viewBox={`0 0 ${W} ${H}`} style={{ position: "absolute", inset: 0, width: W, height: H, opacity: o }}>
      {shapes.map(([x, y, rot, c, k], i) => (
        <g key={i} transform={`translate(${x * W} ${y * H}) rotate(${rot})`} fill={C[c]} stroke={C[c]}>
          {k === "ring" && <circle r="22" fill="none" strokeWidth="10" />}
          {k === "plus" && <path d="M-6 -24 h12 v18 h18 v12 h-18 v18 h-12 v-18 h-18 v-12 h18z" stroke="none" />}
          {k === "tri" && <path d="M0 -26 L24 16 L-24 16Z" strokeWidth="8" strokeLinejoin="round" />}
          {k === "pill" && <rect x="-34" y="-11" width="68" height="22" rx="11" stroke="none" />}
        </g>
      ))}
    </svg>
  );
}

// ───────────── the game screen ─────────────
function GameScreen(p: { W: number; H: number; list: Game[]; at: number; pal: Pal; pill: CSSProperties; ring: string; launch: () => void; media: () => void; achievements: () => void; back: () => void; pick: (i: number) => void }) {
  const g = p.list[p.at];
  const prog = achievements(g);
  const ch = Math.round(p.H * 0.44), cw = Math.round(ch * 2 / 3);
  const cx = Math.round(p.W * 0.16), cy = Math.round(p.H * 0.22);
  const sh = Math.round(ch * 0.36), sw = Math.round(sh * 2 / 3);
  const small = (i: number, y: number) => p.list[i] && (
    <div key={p.list[i].appid} className="dht-iisu-launch-near" onClick={() => p.pick(i)} style={{ position: "absolute", left: cx + (cw - sw) / 2, top: y, width: sw, height: sh, borderRadius: 10, overflow: "hidden", border: `3px solid ${p.pal.edge}`, boxShadow: p.pal.tileShadow, opacity: 0.85 }}>
      <GameArt g={p.list[i]} kind="portrait" flat style={{ width: "100%", height: "100%" }} />
    </div>
  );
  return (
    <div className="dht-iisu-launch" data-appid={g.appid} style={{ position: "absolute", inset: 0 }}>
      {small(p.at - 1, cy - sh - 18)}
      {small(p.at + 1, cy + ch + 18)}
      <div className="dht-iisu-launch-cover" style={{ position: "absolute", left: cx, top: cy, width: cw, height: ch, borderRadius: 16, overflow: "hidden", border: "4px solid #fff", boxShadow: `0 0 0 4px ${p.ring}, 0 14px 30px #0006` }}>
        <GameArt g={g} kind="portrait" flat style={{ width: "100%", height: "100%" }} />
      </div>
      <div style={{ position: "absolute", left: cx + cw + 44, top: cy + 10, right: 60 }}>
        <div className="dht-iisu-launch-title" style={{ fontSize: 46, fontWeight: 900, lineHeight: 1.1, color: v("text", p.pal.text), textShadow: p.pal.text === "#ffffff" ? "0 3px 12px #000a" : "0 2px 0 #ffffffaa", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" } as CSSProperties}>{g.name}</div>
        <div style={{ display: "flex", gap: 10, marginTop: 16, flexWrap: "wrap" }}>
          <span className="dht-iisu-pill" style={{ ...p.pill, padding: "5px 16px", fontSize: 16 }}>Playtime: {g.playtime ? fmtPlaytime(g.playtime, g.lastPlayed, true).replace(" played", "") : "none yet"}</span>
          <span className="dht-iisu-pill" style={{ ...p.pill, padding: "5px 16px", fontSize: 16 }}>Last played: {fmtLastPlayed(g.lastPlayed)}</span>
          {!g.installed && <span className="dht-iisu-pill" style={{ ...p.pill, padding: "5px 16px", fontSize: 16 }}>Not installed</span>}
        </div>
        <div className="dht-iisu-launch-play" onClick={p.launch} style={{ ...p.pill, display: "inline-flex", alignItems: "center", gap: 8, marginTop: 26, padding: "10px 28px", fontSize: 22, boxShadow: `0 0 0 4px ${p.ring}, 0 6px 18px #0004` }}>
          <Btn c="A" /> {g.installed ? "Play" : "Install"}
        </div>
      </div>
      <div className="dht-iisu-launch-media" onClick={p.media} style={{ position: "absolute", right: 60, bottom: 130, width: 280, height: 158, borderRadius: 16, overflow: "hidden", border: `3px solid ${p.pal.edge}`, boxShadow: p.pal.tileShadow }}>
        <GameArt g={g} kind="landscape" flat style={{ width: "100%", height: "100%" }} />
        <span style={{ position: "absolute", right: 10, bottom: 10, padding: "3px 12px", borderRadius: 999, background: "#ffffffee", color: "#3a3d4a", fontSize: 14, fontWeight: 900 }}><Btn c="X" />Media</span>
      </div>
      {prog && (
        <div className="dht-iisu-pill dht-iisu-launch-ach" onClick={p.achievements} style={{ ...p.pill, position: "absolute", left: "50%", transform: "translateX(-50%)", bottom: 34, padding: "8px 20px", fontSize: 17, display: "flex", alignItems: "center", gap: 10 }}>
          <Icon name="trophy" size={20} color="#f0a020" /> {prog.unlocked} / {prog.total} <Bar /> <Btn c="Y" /> Achievements
        </div>
      )}
    </div>
  );
}

// ───────────── dock ─────────────
function Dock({ W, H, tab, focused, dark, ring, pill, pick }: { W: number; H: number; tab: Tab; focused: boolean; dark: boolean; ring: string; pill: CSSProperties; pick: (t: Tab) => void }) {
  const cell = 76;
  const w = TABS.length * cell + 40;
  return (
    <div className="dht-iisu-dockbar" data-focused={focused} style={{ ...pill, position: "absolute", left: (W - w) / 2, top: H - 104, width: w, height: 80, display: "flex", alignItems: "center", padding: "0 20px", boxSizing: "border-box" }}>
      <Badge text="LB" style={{ left: -8, top: -10 }} />
      <Badge text="RB" style={{ right: -8, top: -10 }} />
      {TABS.map((t) => {
        const on = t === tab;
        return (
          <div key={t} className="dht-iisu-dock" data-tab={t} data-selected={on} onClick={() => pick(t)} style={{ width: cell, height: 70, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative" }}>
            <div style={{ transform: on ? "scale(1.12)" : "none", transition: "transform 150ms", borderRadius: 14, boxShadow: on && focused ? `0 0 0 3px ${ring}` : "none" }}>
              <DockIcon t={t} dark={dark} />
            </div>
            <div style={{ position: "absolute", bottom: 2, width: on ? 44 : 0, height: 4, borderRadius: 2, background: on && focused ? ring : "currentColor", transition: "width 150ms" }} />
          </div>
        );
      })}
    </div>
  );
}

/** Colourful dock glyphs, drawn for this theme. */
function DockIcon({ t, dark }: { t: Tab; dark: boolean }) {
  const c = (a: string, b: string) => (dark ? ["#e9e9ef", "#a9a9b6"] : [a, b]);
  const grad = (id: string, [a, b]: string[]) => <linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>;
  const wrap = (id: string, cols: string[], body: ReactNode) => (
    <svg width="46" height="46" viewBox="0 0 46 46"><defs>{grad(id, cols)}</defs>{body}</svg>
  );
  switch (t) {
    case "home":
      return wrap("ih", c("#c39bff", "#5b8cff"), <path d="M23 5 L41 20 V39 a3 3 0 0 1 -3 3 H29 V30 a6 6 0 0 0 -12 0 V42 H8 a3 3 0 0 1 -3 -3 V20 Z" fill="url(#ih)" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />);
    case "collections":
      return wrap("ic", c("#7af0ff", "#2fa8e0"), <>
        <rect x="3" y="12" width="40" height="22" rx="11" fill="url(#ic)" stroke="#fff" strokeWidth="2.5" />
        <path d="M13 18 v10 M8 23 h10" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
        <circle cx="31" cy="20" r="2.6" fill="#fff" /><circle cx="35" cy="26" r="2.6" fill="#fff" />
      </>);
    case "achievements":
      return wrap("ia", c("#ffe27a", "#f08a1f"), <>
        <path d="M12 5 H34 V18 a11 11 0 0 1 -22 0 Z" fill="url(#ia)" stroke="#fff" strokeWidth="2.5" />
        <path d="M12 9 H5 a7 7 0 0 0 8 10 M34 9 H41 a7 7 0 0 1 -8 10" fill="none" stroke="#fff" strokeWidth="2.5" />
        <path d="M20 29 h6 v6 h5 v6 H15 v-6 h5 Z" fill="url(#ia)" stroke="#fff" strokeWidth="2.5" strokeLinejoin="round" />
      </>);
    case "friends":
      return wrap("if", c("#7ff5d6", "#22b38f"), <>
        <rect x="4" y="4" width="38" height="38" rx="11" fill="url(#if)" stroke="#fff" strokeWidth="2.5" />
        <circle cx="16" cy="19" r="3" fill="#fff" /><circle cx="30" cy="19" r="3" fill="#fff" />
        <path d="M14 27 q9 9 18 0" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
      </>);
    case "apps":
      return wrap("ip", c("#ff8a8a", "#e8323f"), <>
        {[0, 1, 2].flatMap((r) => [0, 1, 2].map((q) => <circle key={`${r}${q}`} cx={9 + q * 14} cy={9 + r * 14} r="5.6" fill="url(#ip)" stroke="#fff" strokeWidth="1.8" />))}
      </>);
  }
}

/** A darker partner colour for a tile gradient. */
function shade(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.round(v * 0.55);
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
}

const CSS = `
@keyframes dhtIisuFade { from { opacity: 0 } to { opacity: 1 } }
@keyframes dhtIisuPulse { 0%,100% { filter: brightness(1) } 50% { filter: brightness(1.1) } }
`;
