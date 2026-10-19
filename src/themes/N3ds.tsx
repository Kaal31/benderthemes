import { t } from "../i18n";
// Nintendo 3DS HOME Menu: the top screen (wallpaper, status bar, the selected software) above the bottom
// screen (tab strip, the icon grid with folders and badges, side arrows, scroll handle and the Open bar), both
// drawn at the console's own 400 × 240 / 320 × 240 pixel sizes and scaled to the Deck. Everything is drawn
// here, nothing is copied from the console: the stock look (soft grey-white, mint cursor) is what shows
// without a theme file. A 3DS theme file (see n3dsThemes in py_modules/n3ds_themes.py) swaps the wallpapers,
// the cursor / folder / text colours and the folder and icon-frame pictures; each part has its own toggle.
//
// The grid works like the console's (handoff-notes/3ds-home-study.md): one linear list of slots (360 on the
// home, 60 in a folder) shown column by column with 1 to 6 rows (the six zoom steps of the two resize
// buttons), scrolled by columns. The user's own folders, badges and icon places are kept in settings
// (n3dsLayout, see settings.ts); games nobody placed fill the first free cells in library order.
import { ConfirmModal, showModal, TextField } from "@decky/ui";
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { GameArt, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { Game, openSteam, SteamPlace, fmtPlaytime } from "../library";
import { cleanN3dsLayout, N3dsCell, N3dsFolder, N3dsLayout, N3DS_FOLDER_ITEMS, N3DS_MAX_FOLDERS, N3DS_SLOTS, showTitle, THEMES, updateSettings } from "../settings";
import { fmtDate, fmtTime, playSound, useBattery, useClock, useWallpaper } from "../steam";
import { themeSettingsItems } from "../themeSettingsMenu";
import { N3dsScreen, useN3dsLook } from "../skins";
import { useReportFocus } from "../focus";
import { useLuma } from "./Switch";
import { BadgeDef, BadgeSet, useN3dsBadges } from "./n3dsBadges";

const FONT = '"Nunito","Varela Round","Hiragino Maru Gothic ProN","Segoe UI",system-ui,sans-serif';
const MINT = "#3fe3b5"; // the stock cursor
const SW = { top: 400, bottom: 320 }, SH = 240, GAP = 14; // screen sizes (px on the console) and the hinge gap
const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const RECENT = 14 * 86400; // played within two weeks: the green status dot (never played: the blue "new" dot)

// The icon panel (y 38–210 on the bottom screen, from x 9) and the six zoom levels. tile = icon frame size,
// px / py = column / row pitch, x0 / y0 = the first cell's centre inside the panel. Rows 2 and 3 are measured
// on the console (70 px frames on an 84 / 85 pitch, 48 px frames on a 53 pitch); 1, 4, 5 and 6 follow them.
const PANEL = { left: 9, top: 38, h: 172 };
type Geo = { tile: number; px: number; py: number; x0: number; y0: number };
const GEO: Record<number, Geo> = {
  1: { tile: 84, px: 118, py: 0, x0: 66, y0: 98 },
  2: { tile: 70, px: 84, py: 85, x0: 67, y0: 44 },
  3: { tile: 48, px: 53, py: 53, x0: 45, y0: 33 },
  4: { tile: 36, px: 41, py: 40, x0: 33, y0: 26 },
  5: { tile: 29, px: 33, py: 33, x0: 27, y0: 20 },
  6: { tile: 24, px: 28, py: 28, x0: 23, y0: 16 },
};
const DRAWER_SIDE = 118; // the badge drawer at the right of the bottom screen when the top screen is hidden

type BadgeCell = { b: string; w?: number; h?: number; app?: number };
type Entry =
  | { t: "game"; key: string; game: Game; cell: N3dsCell; auto?: boolean }
  | { t: "folder"; key: string; id: string; name: string; own: boolean; games: Game[]; cell: N3dsCell; auto?: boolean }
  | { t: "badge"; key: string; def?: BadgeDef; cell: BadgeCell; w: number; h: number; fit: boolean; auto?: boolean };
/** A grid as shown: anchors (top-left cell of each item) and every taken cell -> its anchor. */
type Grid = { rows: number; total: number; at: Map<number, Entry>; occ: Map<number, number>; last: number };
type Held = { cell: N3dsCell; from: { box: string | null; slot: number } | null };
type Zone = "grid" | "tabs" | "bar" | "drawer";

const isBadge = (c: N3dsCell): c is BadgeCell => "b" in c;
const cellsOf = (c: N3dsCell) => (isBadge(c) ? { w: c.w === 2 ? 2 : 1, h: c.h === 2 ? 2 : 1 } : { w: 1, h: 1 });
/** The cells a w x h item anchored at slot s takes with `rows` rows (null when it would cross the bottom edge). */
function pieces(s: number, w: number, h: number, rows: number): number[] | null {
  const col = Math.floor(s / rows), row = s % rows;
  if (row + h > rows) return null;
  const out: number[] = [];
  for (let dx = 0; dx < w; dx++) for (let dy = 0; dy < h; dy++) out.push((col + dx) * rows + row + dy);
  return out;
}
/** Which cell belongs to which anchor: icons and folders first, then badges (a badge that no longer fits at this
 *  zoom level, or overlaps, shrinks into its own cell). */
function occupancy(map: Record<string, N3dsCell>, rows: number, cap?: number) {
  const occ = new Map<number, number>(), squeezed = new Set<number>();
  const keys = Object.keys(map).map(Number).filter((s) => cap == null || s < cap).sort((a, b) => a - b);
  for (const s of keys) if (!isBadge(map[s])) occ.set(s, s);
  for (const s of keys) {
    const c = map[s];
    if (!isBadge(c) || occ.has(s)) continue;
    const { w, h } = cellsOf(c);
    const ps = pieces(s, w, h, rows);
    if (ps && ps.every((p) => !occ.has(p) && (cap == null || p < cap))) ps.forEach((p) => occ.set(p, s));
    else { occ.set(s, s); if (w > 1 || h > 1) squeezed.add(s); }
  }
  return { occ, squeezed };
}
function firstFree(map: Record<string, N3dsCell>, rows: number, from: number, cap: number, w = 1, h = 1) {
  const { occ } = occupancy(map, rows, cap);
  for (let s = Math.max(0, from); s < cap; s++) {
    const ps = pieces(s, w, h, rows);
    if (ps && ps.every((p) => p < cap && !occ.has(p))) return s;
  }
  return -1;
}

/** Ask for a name with Steam's keyboard (a text field in a dialog). */
function askName(title: string, initial: string, done: (name: string) => void) {
  let value = initial;
  try {
    showModal(
      <ConfirmModal strTitle={title} strOKButtonText="OK" onOK={() => done((value.trim() || initial).slice(0, 16))}>
        <TextField label="Folder name (up to 16 characters)" defaultValue={initial} onChange={(e: any) => (value = e?.target?.value ?? value)} />
      </ConfirmModal>,
    );
  } catch {
    /* no dialog: keep the name */
  }
}

type Tab = { id: string; name: string; place?: SteamPlace; action?: "settings" | "album" };
const getTabs = (): Tab[] => [
  { id: "settings", name: t("destSettings"), action: "settings" },
  { id: "album", name: t("destMedia"), action: "album" },
  { id: "friends", name: t("destFriends"), place: "friends" },
  { id: "notifications", name: t("destNotifications"), place: "notifications" },
  { id: "store", name: t("destStore"), place: "store" },
  { id: "community", name: t("destCommunity"), place: "community" },
];

/** The tab strip's own symbols, drawn as small coloured outlines. */
function TabGlyph({ id, size = 22 }: { id: string; size?: number }) {
  const p = { fill: "none", strokeWidth: 2.4, strokeLinecap: "round", strokeLinejoin: "round" } as const;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: "block" }}>
      {id === "settings" && <><path {...p} stroke="#7d96c4" fill="#dfe7f5" d="M3 12L12 4l9 8v8H3z" /><path {...p} stroke="#7d96c4" d="M16 17l5 5" strokeWidth="3" /></>}
      {id === "album" && <><path {...p} stroke="#e8c733" fill="#fff4a8" d="M5 19l1-4L17 4l3 3L9 18z" /><path {...p} stroke="#e8c733" d="M15 6l3 3" /></>}
      {id === "friends" && <><rect {...p} stroke="#f0a04b" fill="#fff0da" x="3.5" y="3.5" width="17" height="17" rx="4" /><path {...p} stroke="#f0a04b" d="M8 14q4 4 8 0" /><circle cx="9" cy="9.5" r="1.3" fill="#f0a04b" /><circle cx="15" cy="9.5" r="1.3" fill="#f0a04b" /></>}
      {id === "notifications" && <><path {...p} stroke="#38c2a6" fill="#e0fbf5" d="M5 4h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2h-7l-4 4v-4H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path {...p} stroke="#38c2a6" d="M7 9h10M7 12.5h7" /></>}
      {id === "store" && <><circle {...p} stroke="#3b82d6" fill="#dcebff" cx="12" cy="12" r="9" /><path {...p} stroke="#3b82d6" d="M3 12h18M12 3c-4 4-4 14 0 18M12 3c4 4 4 14 0 18" strokeWidth="1.6" /></>}
      {id === "community" && <><circle {...p} stroke="#4cb84c" fill="#e3f8dc" cx="12" cy="8" r="3.2" /><circle {...p} stroke="#4cb84c" fill="#e3f8dc" cx="5" cy="10" r="2.4" strokeWidth="1.8" /><circle {...p} stroke="#4cb84c" fill="#e3f8dc" cx="19" cy="10" r="2.4" strokeWidth="1.8" /><path {...p} stroke="#4cb84c" fill="#e3f8dc" d="M6 20c0-4 3-6 6-6s6 2 6 6z" /></>}
      {id === "back" && <path {...p} stroke="#7d96c4" strokeWidth="3" d="M9 6L4 11l5 5M4 11h10a6 6 0 0 1 0 12h-3" transform="translate(0 -2)" />}
    </svg>
  );
}

/** Connection strength: four rising bars. */
function Bars({ color }: { color: string }) {
  return (
    <svg width="15" height="12" viewBox="0 0 15 12" style={{ display: "block" }}>
      {[3, 5.5, 8, 11].map((h, i) => <rect key={i} x={i * 3.8} y={12 - h} width="2.6" height={h} rx="0.8" fill={color} />)}
    </svg>
  );
}
/** Battery: rounded outline, blue segments (red when low), a bolt while charging. */
function Battery({ level, charging, ink }: { level: number; charging?: boolean; ink: string }) {
  const seg = Math.max(1, Math.round(level * 4)), low = level < 0.2 && !charging;
  return (
    <svg width="27" height="13" viewBox="0 0 27 13" style={{ display: "block" }}>
      <rect x="1" y="1" width="22" height="11" rx="3" fill="none" stroke={ink} strokeWidth="1.6" />
      <rect x="23.5" y="4" width="2.5" height="5" rx="1" fill={ink} />
      {Array.from({ length: seg }, (_, i) => <rect key={i} x={3 + i * 5} y="3" width="4" height="7" rx="1" fill={low ? "#ee4b3b" : "#28a9e8"} />)}
      {charging && <path d="M14 1.5l-4 6h3l-1 4 4-6h-3z" fill="#fff" stroke={ink} strokeWidth="0.7" />}
    </svg>
  );
}

type FolderColors = { dark: string; main: string; light: string; shadow: string };
/** A folder: back panel with a tab, a sheet of paper peeking out, the front with a bright top edge. On the grid the
 *  front carries only the first letter of the name (as on the console); the open folder on the top screen the name. */
function FolderShape({ w, h, c, name, art, open, letter }: { w: number; h: number; c: FolderColors; name: string; art?: string | null; open?: boolean; letter?: boolean }) {
  const r = Math.min(7, h * 0.17), small = h < 40;
  return (
    <div className="dht-n3ds-folder-shape" style={{ position: "relative", width: w, height: h, filter: `drop-shadow(0 ${small ? 1 : 3}px ${small ? 1.5 : 3}px ${c.shadow}88)` }}>
      <div style={{ position: "absolute", left: 0, top: h * 0.1, width: w * 0.44, height: h * 0.2, background: c.dark, borderRadius: `${r}px ${r}px 0 0` }} />
      <div style={{ position: "absolute", left: 0, top: h * 0.2, width: w, height: h * 0.76, background: c.dark, borderRadius: r }} />
      <div style={{ position: "absolute", left: w * 0.1, top: h * 0.09, width: w * 0.7, height: h * 0.6, background: "linear-gradient(#fff,#e9ecf1)", borderRadius: Math.min(3, r), transform: `rotate(${open ? -7 : -3}deg)` }} />
      <div style={{ position: "absolute", left: 0, top: h * (open ? 0.42 : 0.34), width: w, height: h * (open ? 0.54 : 0.62), background: art ? `url(${art}) 0 0 / 100% 100%` : `linear-gradient(${c.light},${c.main} 18%,${c.main})`, boxShadow: `inset 0 1.5px 0 ${c.light}, inset 0 -2px 0 ${c.shadow}55`, borderRadius: r, transform: open ? "skewX(-6deg)" : "none", overflow: "hidden" }}>
        {!art && (
          <div className="dht-n3ds-folder-name" style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 4px", fontSize: letter ? Math.max(8, h * 0.4) : Math.max(7, w * 0.12), lineHeight: 1, color: "#fff", textShadow: `0 1px 1px ${c.shadow}`, whiteSpace: "nowrap", overflow: "hidden", fontWeight: 800 }}>
            {letter ? Array.from(name.trim())[0]?.toUpperCase() ?? "" : name}
          </div>
        )}
      </div>
    </div>
  );
}

const STRIPES = "repeating-linear-gradient(#e4e8f1 0 2px,#dbe0ea 2px 4px)";
const PATTERN = (() => {
  // soft blocks of two overlapping rounded squares, white on pale grey, as on the console's wallpaper
  const svg = "<svg xmlns='http://www.w3.org/2000/svg' width='100' height='100'><g fill='#fff' fill-opacity='.5' stroke='#b4b9c8' stroke-opacity='.2' stroke-width='2'><rect x='12' y='13' width='76' height='74' rx='22'/><rect x='5' y='27' width='90' height='52' rx='18'/></g></svg>";
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
})();
const CSS = `
@keyframes dhtN3dsBob{from{translate:0 0}to{translate:var(--bx) var(--by)}}
@keyframes dhtN3dsBlink{0%,55%{opacity:1}56%,100%{opacity:.15}}
@keyframes dhtN3dsWiggle{0%,100%{transform:rotate(0)}25%{transform:rotate(-4deg)}75%{transform:rotate(4deg)}}
.dht-n3ds-corner{position:absolute;--bx:0px;--by:0px;animation:dhtN3dsBob .55s ease-in-out infinite alternate}
.dht-n3ds-still .dht-n3ds-corner,.dht-n3ds-still .dht-n3ds-arranging .dht-n3ds-tile{animation:none}
.dht-n3ds-tile{transition:transform 120ms}
.dht-n3ds-tile:active{transform:scale(.95)}
.dht-n3ds-arranging .dht-n3ds-tile[data-kind]:not([data-held="true"]){animation:dhtN3dsWiggle .5s ease-in-out infinite}
.dht-n3ds-arranging .dht-n3ds-tile[data-kind]:nth-child(2n){animation-delay:-.25s}
.dht-n3ds-scroll{transition:transform 260ms cubic-bezier(.3,.8,.3,1)}
.dht-n3ds-blink{animation:dhtN3dsBlink 1s steps(1) infinite}
.dht-n3ds-drawer-badge{transition:transform 120ms}
.dht-n3ds-drawer-badge[data-selected="true"]{transform:scale(1.12)}
`;

export function N3dsHome() {
  const api = useHome(), s = api.settings, { W, H } = useStage(), menu = useMenu();
  const now = useClock(15000), bat = useBattery(), look0 = useN3dsLook(), wall = useWallpaper("n3ds");
  // presets v2: the preset's Background (any installed picture) fills the top screen (the bottom one when it is hidden)
  const wallScreen: N3dsScreen | null = wall ? { mode: "texture", image: wall } : null;
  const look = wallScreen ? { ...look0, top: wallScreen, ...(s.n3dsTop === "hide" ? { bottom: wallScreen } : {}) } : look0;
  const badges = useN3dsBadges();
  const layout = useMemo(() => cleanN3dsLayout(s.n3dsLayout), [s.n3dsLayout]);
  const [mainCur, setMainCur] = useRemembered("n3ds-cur", 0);
  const [mainScroll, setMainScroll] = useRemembered("n3ds-scroll", 0);
  const [collRows, setCollRows] = useRemembered<Record<string, number>>("n3ds-collection-rows", {});
  const [fCur, setFCur] = useState(0);
  const [fScroll, setFScroll] = useState(0);
  const [openKey, setOpenKey] = useState<string | null>(null); // "f:<id>" own folder, "c:<id>" Steam collection
  const [zone, setZone] = useState<Zone>("grid");
  const [tab, setTab] = useState(0);
  const [bar, setBar] = useState(0);
  const [arranging, setArranging] = useState(false);
  const [held, setHeld] = useState<Held | null>(null);
  const [drawerSet, setDrawerSet] = useState(0);
  const [drawerIdx, setDrawerIdx] = useState(0);
  const [drag, setDrag] = useState<{ x: number; y: number } | null>(null);
  const [nudge, setNudge] = useState(0); // a refused move shakes the held icon
  const simple = s.n3dsCursor === "simple";

  // pieces from the theme file (null = stock)
  const cur = look.cursor?.main ?? MINT, curDark = look.cursor?.dark ?? "#14966f", curGlow = look.cursor?.glow ?? MINT;
  const stockFolder = { dark: "#8e939d", main: "#b6bac3", light: "#dde0e6", shadow: "#5d626c" };
  const fc: FolderColors = look.folder ? { dark: look.folder.dark, main: look.folder.main, light: look.folder.light, shadow: look.folder.shadow } : stockFolder;
  const fileColor = look.file?.main;
  const topImg = look.top?.mode === "texture" ? look.top : null, botImg = look.bottom?.mode === "texture" ? look.bottom : null;
  const luma = useLuma(topImg?.image ?? null);
  const darkTop = topImg ? (luma ?? 0.5) < 0.5 : look.top?.mode === "solid" && !!look.top.color && look.top.color.toLowerCase() < "#808080";
  const ink = darkTop ? "#fff" : "#4a4f5a";
  const plate = !!look.top; // text over a theme wallpaper gets a soft plate behind it

  // ───────── the grids ─────────
  const byApp = useMemo(() => new Map(api.lib.games.map((g) => [g.appid, g])), [api.lib.games]);
  const colls = useMemo(() => (layout.collections ? api.lib.collections.filter((c) => c.games.length).slice(0, N3DS_MAX_FOLDERS) : []), [api.lib.collections, layout.collections]);
  const folderGames = (f: N3dsFolder) => Object.keys(f.slots).map(Number).sort((a, b) => a - b).map((k) => f.slots[k]).flatMap((c) => ("g" in c && byApp.get(c.g) ? [byApp.get(c.g)!] : []));
  const badgeEntry = (c: BadgeCell, key: string): Entry => { const { w, h } = cellsOf(c); return { t: "badge", key, def: badges.byId.get(c.b), cell: c, w, h, fit: true }; };
  const main: Grid = useMemo(() => {
    const rows = layout.rows, inFolders = new Set<number>();
    layout.folders.forEach((f) => Object.values(f.slots).forEach((c) => "g" in c && inFolders.add(c.g)));
    const used = new Set<string>(), at = new Map<number, Entry>(), map: Record<string, N3dsCell> = {};
    const resolve = (c: N3dsCell, s: number): Entry | null => {
      if ("g" in c) { const g = byApp.get(c.g); if (!g || inFolders.has(c.g) || used.has(`g${c.g}`)) return null; used.add(`g${c.g}`); return { t: "game", key: `g${c.g}`, game: g, cell: { g: c.g } }; }
      if ("f" in c) { const f = layout.folders.find((x) => x.id === c.f); if (!f || used.has(`f${c.f}`)) return null; used.add(`f${c.f}`); return { t: "folder", key: `f${f.id}`, id: f.id, name: f.name, own: true, games: folderGames(f), cell: { f: f.id } }; }
      if ("c" in c) { const k = colls.find((x) => x.id === c.c); if (!k || used.has(`c${c.c}`)) return null; used.add(`c${c.c}`); return { t: "folder", key: `c${k.id}`, id: k.id, name: k.name, own: false, games: k.games, cell: { c: k.id } }; }
      return badgeEntry(c, `b${s}`);
    };
    const keys = Object.keys(layout.slots).map(Number).sort((a, b) => a - b);
    for (const k of keys) { const e = resolve(layout.slots[k], k); if (e) (at.set(k, e), (map[k] = e.cell)); }
    // everything nobody placed: games in library order, then the user's folders, then Steam collections
    const auto: Entry[] = [
      ...api.lib.games.filter((g) => !used.has(`g${g.appid}`) && !inFolders.has(g.appid)).map((g): Entry => ({ t: "game", key: `g${g.appid}`, game: g, cell: { g: g.appid }, auto: true })),
      ...layout.folders.filter((f) => !used.has(`f${f.id}`)).map((f): Entry => ({ t: "folder", key: `f${f.id}`, id: f.id, name: f.name, own: true, games: folderGames(f), cell: { f: f.id }, auto: true })),
      ...colls.filter((c) => !used.has(`c${c.id}`)).map((c): Entry => ({ t: "folder", key: `c${c.id}`, id: c.id, name: c.name, own: false, games: c.games, cell: { c: c.id }, auto: true })),
    ];
    const { occ: taken } = occupancy(map, rows);
    let p = 0;
    for (const e of auto) { while (taken.has(p)) p++; at.set(p, e); map[p] = e.cell; taken.set(p, p); p++; }
    return finish(at, map, rows, N3DS_SLOTS);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout, byApp, colls, badges.byId, api.lib.games]);
  function finish(at: Map<number, Entry>, map: Record<string, N3dsCell>, rows: number, min: number, cap?: number): Grid {
    const { occ, squeezed } = occupancy(map, rows, cap);
    squeezed.forEach((s) => { const e = at.get(s); if (e?.t === "badge") at.set(s, { ...e, fit: false }); });
    const last = occ.size ? Math.max(...occ.keys()) : -1;
    return { rows, total: Math.max(min, Math.ceil((last + 1) / rows) * rows), at, occ, last };
  }
  const openOwn = openKey?.startsWith("f:") ? layout.folders.find((f) => f.id === openKey.slice(2)) : undefined;
  const openColl = openKey?.startsWith("c:") ? colls.find((c) => c.id === openKey.slice(2)) : undefined;
  const inFolder = !!(openOwn || openColl);
  const box = openOwn ? openOwn.id : null; // the editable container shown: null = the home grid, else a folder id
  const folderGrid: Grid | null = useMemo(() => {
    if (openOwn) {
      const at = new Map<number, Entry>(), map: Record<string, N3dsCell> = {};
      for (const k of Object.keys(openOwn.slots).map(Number)) {
        const c = openOwn.slots[k];
        if ("g" in c) { const g = byApp.get(c.g); if (g) (at.set(k, { t: "game", key: `g${g.appid}`, game: g, cell: { g: g.appid } }), (map[k] = c)); }
        else if (isBadge(c)) (at.set(k, badgeEntry(c, `b${k}`)), (map[k] = c));
      }
      return finish(at, map, openOwn.rows, N3DS_FOLDER_ITEMS, N3DS_FOLDER_ITEMS);
    }
    if (openColl) {
      const rows = clamp(collRows[openColl.id] ?? 2, 1, 6), at = new Map<number, Entry>(), map: Record<string, N3dsCell> = {};
      openColl.games.forEach((g, i) => (at.set(i, { t: "game", key: `g${g.appid}`, game: g, cell: { g: g.appid } }), (map[i] = { g: g.appid })));
      return finish(at, map, rows, N3DS_FOLDER_ITEMS);
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openOwn, openColl, collRows, byApp, badges.byId]);
  useEffect(() => { if (openKey && !inFolder) setOpenKey(null); }, [openKey, inFolder]);

  const grid = folderGrid ?? main;
  const rows = grid.rows, geo = GEO[rows];
  // "Top screen: hide" = a full-display theme: the bottom screen alone, as wide as the display needs (same height as the console's)
  const topOn = s.n3dsTop !== "hide";
  const split = s.n3dsTop === "split";
  const bw = split ? SH * 2 * W / H : topOn ? SW.bottom : Math.max(SW.bottom, Math.round((SH * W) / H));
  const sideDrawer = arranging && !topOn;
  const gridW = bw - PANEL.left - (sideDrawer ? DRAWER_SIDE : 0);
  const visCols = Math.max(1, Math.floor((gridW - (geo.x0 - geo.px / 2)) / geo.px));
  const cols = grid.total / rows, lastCol = grid.last < 0 ? 0 : Math.floor(grid.last / rows);
  // the grid scrolls as far as one screen after the last icon (the 360 slots are all there, mostly empty)
  const scrollCols = Math.min(cols, Math.max(visCols, lastCol + visCols + (arranging ? 1 : 0)));
  const maxScroll = Math.max(0, scrollCols - visCols);
  const rawCur = inFolder ? fCur : mainCur;
  const curSlot = clamp(rawCur, 0, scrollCols * rows - 1);
  const scroll = clamp(inFolder ? fScroll : mainScroll, 0, maxScroll);
  const setCur = (v: number) => (inFolder ? setFCur(v) : setMainCur(v));
  const setScroll = (v: number) => (inFolder ? setFScroll(v) : setMainScroll(v));
  const anchor = grid.occ.get(curSlot);
  const it: Entry | undefined = anchor != null ? grid.at.get(anchor) : undefined;
  const g = it?.t === "game" ? it.game : it?.t === "badge" && it.cell.app ? byApp.get(it.cell.app) : undefined;
  useReportFocus(g);
  const col = Math.floor(curSlot / rows), row = curSlot % rows;

  const show = (slot: number, sc = scroll) => {
    const c = Math.floor(slot / rows);
    return c < sc ? c : c >= sc + visCols ? c - visCols + 1 : sc;
  };
  const go = (slot: number, sound: "tile" | "move" = "tile") => {
    setCur(slot);
    setScroll(clamp(show(slot), 0, maxScroll));
    setZone("grid");
    if (slot !== curSlot) playSound(sound);
  };
  const scrollBy = (d: number) => {
    const ns = clamp(scroll + d, 0, maxScroll);
    if (ns === scroll) return playSound("end");
    setScroll(ns);
    const nc = clamp(col + (ns - scroll), 0, scrollCols - 1);
    setCur(nc * rows + row);
    playSound("tab");
  };
  /** The scroll handle / a swipe: scroll there and keep the cursor on screen (same row). */
  const scrollTo = (ns: number) => {
    ns = clamp(Math.round(ns), 0, maxScroll);
    if (ns === scroll) return;
    setScroll(ns);
    if (col < ns || col >= ns + visCols) setCur(clamp(col < ns ? ns : ns + visCols - 1, 0, scrollCols - 1) * rows + row);
  };
  /** The two resize buttons: one zoom step. Each folder keeps its own; the cursor stays on the same slot. */
  const setRows = (r: number) => {
    r = clamp(r, 1, 6);
    if (r === rows) return playSound("end");
    if (openOwn) save((L) => ({ ...L, folders: L.folders.map((f) => (f.id === openOwn.id ? { ...f, rows: r } : f)) }));
    else if (openColl) setCollRows({ ...collRows, [openColl.id]: r });
    else save((L) => ({ ...L, rows: r }));
    const g2 = GEO[r], vis = Math.max(1, Math.floor((gridW - (g2.x0 - g2.px / 2)) / g2.px));
    setScroll(Math.max(0, Math.floor(curSlot / r) - Math.floor(vis / 2)));
    playSound("toggle");
  };

  // ───────── editing (all of it ends in one settings write) ─────────
  const save = (f: (L: N3dsLayout) => N3dsLayout) => updateSettings((p) => ({ n3dsLayout: f(cleanN3dsLayout(p.n3dsLayout)) }));
  /** The cells of the home grid or a folder as they are shown now (games nobody placed get their current cell). */
  const slotsOf = (gr: Grid) => { const m: Record<string, N3dsCell> = {}; gr.at.forEach((e, k) => (m[k] = e.cell)); return m; };
  const ownGrid = (id: string | null): { map: Record<string, N3dsCell>; rows: number; cap?: number } | null => {
    if (id == null) return { map: slotsOf(main), rows: main.rows };
    const f = layout.folders.find((x) => x.id === id);
    return f ? { map: { ...f.slots }, rows: f.rows, cap: N3DS_FOLDER_ITEMS } : null;
  };
  const write = (maps: Map<string | null, Record<string, N3dsCell>>, extra?: (L: N3dsLayout) => N3dsLayout) =>
    save((L) => {
      let out: N3dsLayout = { ...L, slots: maps.get(null) ?? L.slots, folders: L.folders.map((f) => (maps.has(f.id) ? { ...f, slots: maps.get(f.id)! } : f)) };
      if (extra) out = extra(out);
      return out;
    });
  /** Put `h.cell` at `slot` of container `dst` (null = home). Empty target: moved. A game or badge onto one of the
   *  user's folders: into the folder. One icon onto another: they swap. Anything else is refused (false). */
  const place = (h: Held, dst: string | null, slot: number): boolean => {
    const cell = h.cell;
    if (dst != null && ("f" in cell || "c" in cell)) return false; // folders hold no folders
    const maps = new Map<string | null, Record<string, N3dsCell>>();
    const get = (id: string | null) => { if (!maps.has(id)) { const o = ownGrid(id); if (!o) return null; maps.set(id, o.map); } return maps.get(id)!; };
    const dg = ownGrid(dst);
    if (!dg) return false;
    const src = h.from ? get(h.from.box) : null;
    if (h.from && src) delete src[h.from.slot];
    const dmap = get(dst)!;
    const { w, h: hh } = cellsOf(cell);
    const ps = pieces(slot, w, hh, dg.rows);
    if (!ps || (dg.cap != null && ps.some((p) => p >= dg.cap!))) return false;
    const { occ } = occupancy(dmap, dg.rows, dg.cap);
    const hit = [...new Set(ps.map((p) => occ.get(p)).filter((x): x is number => x != null))];
    if (!hit.length) dmap[slot] = cell;
    else if (hit.length === 1 && w === 1 && hh === 1) {
      const a = hit[0], other = dmap[a];
      if ("f" in other && ("g" in cell || isBadge(cell))) {
        // into the folder (up to 60 items)
        const f = layout.folders.find((x) => x.id === other.f);
        const fmap = f && get(f.id);
        if (!f || !fmap) return false;
        const free = firstFree(fmap, f.rows, 0, N3DS_FOLDER_ITEMS, ...(Object.values(cellsOf(cell)) as [number, number]));
        if (free < 0) return false;
        fmap[free] = cell;
      } else if (a === slot && h.from && src && cellsOf(other).w === 1 && cellsOf(other).h === 1) {
        if (h.from.box != null && ("f" in other || "c" in other)) return false;
        dmap[slot] = cell;
        src[h.from.slot] = other;
      } else return false;
    } else return false;
    write(maps);
    return true;
  };
  const pick = (slot: number) => {
    const a = grid.occ.get(slot), e = a != null ? grid.at.get(a) : undefined;
    if (!e || a == null || (inFolder && !openOwn)) return false; // a Steam collection is Steam's to change
    setHeld({ cell: e.cell, from: { box, slot: a } });
    setCur(a);
    playSound("select");
    return true;
  };
  const drop = (slot: number) => {
    if (!held) return;
    if (inFolder && !openOwn) return refuse();
    if (held.from && held.from.box === box && grid.occ.get(slot) === held.from.slot) return setHeld(null), playSound("back");
    if (place(held, box, slot)) { setHeld(null); setCur(slot); playSound("select"); }
    else refuse();
  };
  const refuse = () => { setNudge((n) => n + 1); playSound("end"); };
  const removeBadge = (from: { box: string | null; slot: number }) => {
    const o = ownGrid(from.box);
    if (!o || !o.map[from.slot] || !isBadge(o.map[from.slot])) return refuse();
    delete o.map[from.slot];
    write(new Map([[from.box, o.map]]));
    playSound("back");
  };
  const createFolder = (slot: number) => {
    if (inFolder) return refuse();
    if (layout.folders.length >= N3DS_MAX_FOLDERS || main.occ.has(slot)) return refuse();
    const id = `n${Date.now().toString(36)}`, name = String(layout.next);
    const map = slotsOf(main);
    map[slot] = { f: id };
    write(new Map([[null, map]]), (L) => ({ ...L, next: L.next + 1, folders: [...L.folders, { id, name, rows: 2, slots: {} }] }));
    playSound("select");
    askName("Name the folder", name, (n) => save((L) => ({ ...L, folders: L.folders.map((f) => (f.id === id ? { ...f, name: n } : f)) })));
  };
  const renameFolder = (id: string) => {
    const f = layout.folders.find((x) => x.id === id);
    if (f) askName("Rename folder", f.name, (n) => save((L) => ({ ...L, folders: L.folders.map((x) => (x.id === id ? { ...x, name: n } : x)) })));
  };
  /** Delete one of the user's folders: what it held goes back to the home grid, from the folder's cell on. */
  const deleteFolder = (id: string) => {
    const f = layout.folders.find((x) => x.id === id);
    if (!f) return;
    const map = slotsOf(main);
    let at = Number(Object.keys(map).find((k) => "f" in map[k] && (map[k] as { f: string }).f === id) ?? 0);
    Object.keys(map).forEach((k) => { if ("f" in map[k] && (map[k] as { f: string }).f === id) delete map[k]; });
    for (const k of Object.keys(f.slots).map(Number).sort((a, b) => a - b)) {
      const c = f.slots[k], { w, h } = cellsOf(c);
      const free = firstFree(map, main.rows, at, Math.max(N3DS_SLOTS, main.total + 60), w, h);
      if (free >= 0) (map[free] = c), (at = free);
    }
    write(new Map([[null, map]]), (L) => ({ ...L, folders: L.folders.filter((x) => x.id !== id) }));
    if (openKey === `f:${id}`) setOpenKey(null);
    playSound("back");
  };
  const moveToFolder = (slot: number, fid: string) => {
    const fslot = [...main.at.entries()].find(([, e]) => e.t === "folder" && e.own && e.id === fid)?.[0];
    const a = grid.occ.get(slot), e = a != null ? grid.at.get(a) : undefined;
    if (fslot == null || a == null || !e) return refuse();
    if (!place({ cell: e.cell, from: { box, slot: a } }, null, fslot)) refuse();
    else playSound("select");
  };
  const moveOut = (slot: number) => {
    if (!openOwn) return;
    const a = grid.occ.get(slot), e = a != null ? grid.at.get(a) : undefined;
    if (a == null || !e) return;
    const map = slotsOf(main);
    const fslot = Number(Object.keys(map).find((k) => "f" in map[k] && (map[k] as { f: string }).f === openOwn.id) ?? 0);
    const { w, h } = cellsOf(e.cell);
    const free = firstFree(map, main.rows, fslot + 1, Math.max(N3DS_SLOTS, main.total + 60), w, h);
    if (free < 0 || !place({ cell: e.cell, from: { box, slot: a } }, null, free)) return refuse();
    playSound("select");
  };
  const setShortcut = (slot: number, app: number | undefined) => {
    const o = ownGrid(box), c = o?.map[slot];
    if (!o || !c || !isBadge(c)) return;
    o.map[slot] = app ? { ...c, app } : { b: c.b, ...(c.w ? { w: c.w } : {}), ...(c.h ? { h: c.h } : {}) };
    write(new Map([[box, o.map]]));
  };
  const placedCount = useMemo(() => {
    const n = new Map<string, number>();
    const add = (c: N3dsCell) => isBadge(c) && n.set(c.b, (n.get(c.b) ?? 0) + 1);
    Object.values(layout.slots).forEach(add);
    layout.folders.forEach((f) => Object.values(f.slots).forEach(add));
    return n;
  }, [layout]);

  // ───────── actions ─────────
  const openFolderEntry = (e: Extract<Entry, { t: "folder" }>) => {
    setOpenKey(`${e.own ? "f" : "c"}:${e.id}`);
    setFCur(0);
    setFScroll(0);
    setZone("grid");
    playSound("open");
  };
  const leaveFolder = () => {
    if (!openKey) return;
    const k = openKey;
    setOpenKey(null);
    setZone("grid");
    const back = [...main.at.entries()].find(([, e]) => e.t === "folder" && `${e.own ? "f" : "c"}:${e.id}` === k)?.[0];
    if (back != null) { setMainCur(back); setMainScroll(clamp(Math.floor(back / main.rows) - 1, 0, 9999)); }
    playSound("back");
  };
  const activate = (e: Entry | undefined, slot = curSlot) => {
    if (!e) {
      if (inFolder) return;
      return menu.open([{ label: t("createFolder"), action: () => createFolder(slot) }, { label: t("arrangeIconsBadges"), action: () => startArrange(false) }], t("emptySpace"), { page: true });
    }
    if (e.t === "folder") return openFolderEntry(e);
    if (e.t === "game") return playSound("select"), api.activate(e.game, () => api.launch(e.game));
    const target = e.cell.app ? byApp.get(e.cell.app) : undefined;
    if (target) return playSound("select"), api.activate(target, () => api.launch(target));
    refuse();
  };
  const startArrange = (drawer: boolean) => {
    setArranging(true);
    setHeld(null);
    setZone(drawer ? "drawer" : "grid");
    playSound("menu");
  };
  const endArrange = () => {
    setArranging(false);
    setHeld(null);
    setDrag(null);
    setZone("grid");
    playSound("close");
  };
  const runTab = (id: string) => {
    if (id === "big") return setRows(rows - 1);
    if (id === "small") return setRows(rows + 1);
    if (id === "back") return leaveFolder();
    if (id === "done") return endArrange();
    playSound("select");
    const targetTab = getTabs().find((x) => x.id === id);
    if (!targetTab) return;
    if (targetTab.action === "album") api.openMedia();
    else if (targetTab.action === "settings") menu.open([...themeSettingsItems(), { label: t("presets"), sub: () => themeMenu(s.theme, api.switchTheme, THEMES) }, { label: t("homeScreenSettings"), action: api.openSettings }], t("homeMenuSettings"), { page: true });
    else if (targetTab.place) openSteam(targetTab.place);
  };
  const tabs: string[] = arranging ? ["done", ...(inFolder ? ["back"] : []), "big", "small"] : inFolder ? ["back", "big", "small"] : [...getTabs().map((t) => t.id), "big", "small"];
  const tabIdx = clamp(tab, 0, tabs.length - 1);
  const bars: { id: string; label: string }[] = arranging ? [] : !it ? (inFolder ? [] : [{ id: "create", label: t("createFolder") }]) : it.t === "folder" && it.own ? [{ id: "settings", label: t("destSettings") }, { id: "open", label: t("open") }] : it.t === "badge" && !g ? [] : [{ id: "open", label: t("open") }];
  const barIdx = clamp(bar, 0, Math.max(0, bars.length - 1));
  const runBar = (id: string) => {
    if (id === "open") return activate(it);
    if (id === "create") return createFolder(curSlot);
    if (id === "settings" && it?.t === "folder") return folderMenu(it);
  };
  const folderMenu = (e: Extract<Entry, { t: "folder" }>) =>
    menu.open([
      { label: t("open"), action: () => openFolderEntry(e) },
      { label: t("rename"), action: () => renameFolder(e.id) },
      { label: t("deleteFolderDesc"), action: () => deleteFolder(e.id) },
    ], `Folder ${e.name}`, { page: true });
  const gridSizeItems = (): MenuItem[] => [1, 2, 3, 4, 5, 6].map((r) => ({ label: t("gridSizeRows", { rows: r }), checked: rows === r, action: () => setRows(r) }));
  const options = () => {
    const items: MenuItem[] = [];
    if (it?.t === "game") {
      items.push({ label: t("start"), action: () => api.launch(it.game) }, { label: t("information"), action: () => api.details(it.game) }, { label: t("gameOptions"), action: () => api.nativeMenu(it.game) });
      if (!inFolder && layout.folders.length) items.push({ label: t("moveToFolder"), sub: () => layout.folders.map((f) => ({ label: f.name || "(no name)", action: () => moveToFolder(curSlot, f.id) })) });
      if (openOwn) items.push({ label: t("moveOutOfFolder"), action: () => moveOut(curSlot) });
    } else if (it?.t === "folder") {
      items.push({ label: t("open"), action: () => openFolderEntry(it) });
      if (it.own) items.push({ label: t("rename"), action: () => renameFolder(it.id) }, { label: t("deleteFolder"), action: () => deleteFolder(it.id) });
    } else if (it?.t === "badge" && anchor != null) {
      const recent = [...api.lib.games].sort((a, b) => b.lastPlayed - a.lastPlayed).slice(0, 40);
      items.push(
        { label: g ? `${t("badgeShortcut")}: ${g.name}` : t("badgeShortcut"), sub: () => [{ label: t("none"), checked: !it.cell.app, action: () => setShortcut(anchor, undefined) }, ...recent.map((x) => ({ label: x.name, checked: it.cell.app === x.appid, action: () => setShortcut(anchor, x.appid) }))] },
        ...(openOwn && it ? [{ label: t("moveOutOfFolder"), action: () => moveOut(curSlot) }] : []),
        { label: t("removeBadge"), action: () => removeBadge({ box, slot: anchor }) },
      );
    } else if (!inFolder) items.push({ label: t("createFolder"), action: () => createFolder(curSlot) });
    items.push(
      { label: t("arrangeIconsBadges"), action: () => startArrange(false) },
      { label: t("placeBadges"), action: () => startArrange(true) },
      { label: t("gridSizeRows", { rows }), sub: gridSizeItems },
      { label: t("destPower"), action: () => openSteam("power") },
      { label: t("destMainMenu"), action: api.showSteamHome },
    );
    menu.open(items, it?.t === "game" ? it.game.name : it?.t === "folder" ? it.name : it?.t === "badge" ? it.def?.name ?? "Badge" : "HOME Menu");
  };

  // ───────── the badge drawer ─────────
  const sets: BadgeSet[] = badges.sets;
  const setI = clamp(drawerSet, 0, Math.max(0, sets.length - 1));
  const setBadges = sets[setI]?.badges ?? [];
  const dIdx = clamp(drawerIdx, 0, Math.max(0, setBadges.length - 1));
  const takeBadge = (b: BadgeDef) => {
    setHeld({ cell: { b: b.id, ...(b.w === 2 ? { w: 2 } : {}), ...(b.h === 2 ? { h: 2 } : {}) }, from: null });
    setZone("grid");
    playSound("select");
  };
  const drawerPerRow = topOn ? 8 : 3;

  // ───────── controller ─────────
  const step = (d: number, vertical: boolean) => {
    // move one cell, passing over the other cells of the same big badge
    const a0 = grid.occ.get(curSlot);
    let n = curSlot;
    for (;;) {
      const next = n + d;
      if (vertical ? Math.floor(next / rows) !== col || next < 0 : next < 0 || next >= scrollCols * rows) return null;
      n = next;
      if (a0 == null || grid.occ.get(n) !== a0) return n;
    }
  };
  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (b === "l2" || b === "r2") return setRows(rows + (b === "l2" ? -1 : 1)), true;
    if (arranging) {
      if (b === "a" && p.repeat) return true; // a held Ⓐ picks up once
      if (b === "menu") return endArrange(), true;
      if (zone === "drawer") {
        const n = setBadges.length;
        if (b === "left" || b === "right") { const k = clamp(dIdx + (b === "left" ? -1 : 1), 0, Math.max(0, n - 1)); if (k !== dIdx) (setDrawerIdx(k), playSound("move")); }
        else if (b === "up" || b === "down") { const k = dIdx + (b === "up" ? -drawerPerRow : drawerPerRow); if (k >= 0 && k < n) (setDrawerIdx(k), playSound("move")); else if (b === "up" && !topOn) setZone("grid"); }
        else if (b === "l1" || b === "r1") { const k = clamp(setI + (b === "l1" ? -1 : 1), 0, sets.length - 1); if (k !== setI) (setDrawerSet(k), setDrawerIdx(0), playSound("tab")); }
        else if (b === "a") { if (setBadges[dIdx]) takeBadge(setBadges[dIdx]); }
        else if (b === "b" || b === "y") setZone("grid");
        else if (b === "x" && held) { if (held.from && isBadge(held.cell)) removeBadge(held.from); setHeld(null); }
        return true;
      }
      if (zone === "grid") {
        if (b === "a") { if (held) drop(curSlot); else if (!pick(curSlot) && !inFolder) activate(undefined); return true; }
        if (b === "b") { if (held && inFolder && held.from) return leaveFolder(), true; if (held) return setHeld(null), playSound("back"), true; if (inFolder) return leaveFolder(), true; return endArrange(), true; }
        if (b === "x") { const tgt = held?.from && isBadge(held.cell) ? held.from : it?.t === "badge" && anchor != null ? { box, slot: anchor } : null; if (held && !held.from) return setHeld(null), playSound("back"), true; if (tgt) (removeBadge(tgt), setHeld(null)); else refuse(); return true; }
        if (b === "y") return setZone("drawer"), playSound("move"), true;
      }
    } else {
      if (b === "y" || b === "menu") return options(), true;
      if (b === "x" && g) return api.launch(g), true;
      if (b === "a" && p.repeat && zone === "grid" && it) { startArrange(false); pick(curSlot); return true; } // hold Ⓐ: pick the icon up
      if (b === "b") { if (inFolder) return leaveFolder(), true; if (zone !== "grid") return setZone("grid"), true; return false; }
    }
    if (b === "l1" || b === "r1") return scrollBy(b === "l1" ? -visCols : visCols), true;
    if (zone === "tabs") {
      if (b === "left" || b === "right") { const k = clamp(tabIdx + (b === "left" ? -1 : 1), 0, tabs.length - 1); if (k !== tabIdx) (setTab(k), playSound("move")); }
      else if (b === "down") setZone("grid");
      else if (b === "a") runTab(tabs[tabIdx]);
      else if (b === "b") setZone("grid");
      return true;
    }
    if (zone === "bar") {
      if (b === "left" || b === "right") setBar(clamp(barIdx + (b === "left" ? -1 : 1), 0, bars.length - 1));
      else if (b === "up") setZone("grid");
      else if (b === "a" && bars[barIdx]) runBar(bars[barIdx].id);
      return true;
    }
    if (b === "left" || b === "right") { const n = step(b === "left" ? -rows : rows, false); if (n == null) playSound("end"); else go(n); }
    else if (b === "up") { const n = row > 0 ? step(-1, true) : null; if (n != null) go(n); else (setZone("tabs"), playSound("move")); }
    else if (b === "down") { const n = step(1, true); if (n != null) go(n); else if (bars.length) (setZone("bar"), setBar(bars.length - 1), playSound("move")); else if (arranging && topOn) (setZone("drawer"), playSound("move")); else playSound("end"); }
    else if (b === "a") activate(it);
    else return false;
    return true;
  };

  // ───────── touch: tap = select, tap again = open; drag = scroll; hold = pick up (arrange) ─────────
  const gridRef = useRef<HTMLDivElement>(null);
  const ptr = useRef<{ x: number; y: number; slot: number; moved: boolean; mode: "tap" | "swipe" | "drag"; sc: number; timer: any } | null>(null);
  const local = (cx: number, cy: number) => {
    const el = gridRef.current;
    if (!el) return null;
    const r = el.getBoundingClientRect(), sc = r.width / (el.offsetWidth || 1) || 1;
    return { x: (cx - r.left) / sc, y: (cy - r.top) / sc, sc };
  };
  const slotAt = (cx: number, cy: number) => {
    const l = local(cx, cy);
    if (!l) return -1;
    const c = Math.floor((l.x + scroll * geo.px - (geo.x0 - geo.px / 2)) / geo.px);
    const rw = rows === 1 ? 0 : Math.floor((l.y - (geo.y0 - geo.py / 2)) / geo.py);
    if (c < 0 || rw < 0 || rw >= rows || c >= scrollCols) return -1;
    return c * rows + rw;
  };
  const tap = (slot: number) => {
    if (slot < 0) return;
    const a = grid.occ.get(slot), e = a != null ? grid.at.get(a) : undefined;
    if (arranging) {
      if (held) return drop(slot);
      if (e) return void pick(slot);
      return go(slot);
    }
    if (zone === "grid" && (slot === curSlot || (a != null && a === anchor))) return activate(e, slot);
    go(slot, "move");
  };
  const onDown = (e: React.PointerEvent) => {
    if (menu.isOpen) return;
    const slot = slotAt(e.clientX, e.clientY);
    const t = !arranging && slot >= 0 && grid.occ.has(slot) && !(inFolder && !openOwn)
      ? setTimeout(() => { if (ptr.current && !ptr.current.moved) { startArrange(false); pick(slot); ptr.current.mode = "drag"; } }, 480)
      : null;
    ptr.current = { x: e.clientX, y: e.clientY, slot, moved: false, mode: "tap", sc: scroll, timer: t };
    try { (e.currentTarget as any).setPointerCapture?.(e.pointerId); } catch { /* not capturable */ }
  };
  const onMove = (e: React.PointerEvent) => {
    const pt = ptr.current;
    if (!pt) return;
    const l = local(e.clientX, e.clientY), sc = l?.sc ?? 1;
    const dx = (e.clientX - pt.x) / sc, dy = (e.clientY - pt.y) / sc;
    if (!pt.moved && Math.hypot(dx, dy) > 6) {
      pt.moved = true;
      clearTimeout(pt.timer);
      if (pt.mode === "tap") pt.mode = arranging && (held || (pt.slot >= 0 && grid.occ.has(pt.slot) && pick(pt.slot))) ? "drag" : "swipe";
    }
    if (!pt.moved) return;
    if (pt.mode === "drag" && l) setDrag({ x: l.x, y: l.y });
    else if (pt.mode === "swipe") scrollTo(pt.sc - dx / geo.px);
  };
  const onUp = (e: React.PointerEvent) => {
    const pt = ptr.current;
    ptr.current = null;
    if (!pt) return;
    clearTimeout(pt.timer);
    if (pt.mode === "drag") { setDrag(null); if (pt.moved) drop(slotAt(e.clientX, e.clientY)); return; }
    if (!pt.moved) tap(pt.slot);
  };
  const handleRef = useRef<{ x0: number; w: number } | null>(null);

  // ───────── layout: the two screens stacked, centred, at the console's pixel sizes ─────────
  const stackWpx = split ? bw : topOn ? SW.top : bw, stackHpx = split ? SH * 2 : topOn ? SH * 2 + GAP : SH, botLeft = split ? 0 : topOn ? 40 : 0, botTop = split ? SH : topOn ? SH + GAP : 0;
  const k = split ? H / stackHpx : topOn ? Math.min((H - 24) / stackHpx, (W - 24) / stackWpx) : Math.max(H / stackHpx, W / stackWpx); // hidden: fills the display edge to edge
  const stackW = stackWpx * k, left = (W - stackW) / 2, topY = (H - stackHpx * k) / 2; // hidden: 0
  const bgBlur: CSSProperties = topImg?.image ? { backgroundImage: `url(${topImg.image})`, backgroundSize: "cover", backgroundPosition: "center", filter: "blur(18px) brightness(.75)", transform: "scale(1.15)" } : {};
  const wallOff = (img: { scroll?: boolean; wide?: string | null } | null, w: number) => (look.scroll && img?.scroll && img.wide ? -(maxScroll ? scroll / maxScroll : 0) * (1024 - w) : 0);
  const wallStyle = (img: typeof topImg, w: number): CSSProperties => {
    if (!img) return {};
    if (look.scroll && img.scroll && img.wide) return { backgroundImage: `url(${img.wide})`, backgroundSize: "1024px 240px", backgroundPosition: `${wallOff(img, w)}px 0`, backgroundRepeat: "no-repeat", transition: "background-position 380ms" };
    return { backgroundImage: `url(${img.image})`, backgroundSize: topOn ? "100% 100%" : "cover", backgroundPosition: "center" };
  };
  const nowSec = Math.floor(now.getTime() / 1000);
  const date = `${fmtDate(now)} (${DAYS[now.getDay()]})`;
  const time = fmtTime(now, s.clock24);
  const [hh, ...mm] = time.split(":");

  const cellBox = (slot: number, w = 1, h = 1) => {
    const c = Math.floor(slot / rows), r = slot % rows;
    const width = geo.tile + (w - 1) * geo.px, height = geo.tile + (h - 1) * (geo.py || geo.px);
    const cx = geo.x0 + c * geo.px + ((w - 1) * geo.px) / 2, cy = geo.y0 + r * geo.py + ((h - 1) * geo.py) / 2;
    return { left: cx - width / 2, top: cy - height / 2, width, height };
  };
  const big = rows <= 2, cIn = big ? 9 : rows === 3 ? 6 : rows === 4 ? 5 : 4, cSz = big ? 20 : rows === 3 ? 15 : 11, bob = big ? 2.6 : rows === 3 ? 2 : 1.4;
  // side arrows: half rings at the screen edges, centred on the panel (smaller with small icons)
  const ringD = rows >= 4 ? 38 : 54;
  const ring = (dir: "l" | "r", onClick: () => void) => (
    <div key={dir} className="dht-n3ds-arrow" data-dir={dir === "l" ? "left" : "right"} onClick={onClick} style={{ position: "absolute", top: PANEL.top + PANEL.h / 2 - ringD / 2, [dir === "l" ? "left" : "right"]: dir === "r" && sideDrawer ? DRAWER_SIDE - ringD / 2 : -ringD / 2, width: ringD, height: ringD, borderRadius: "50%", background: "radial-gradient(#fffe,#f2f3f5d9)", boxShadow: "0 1px 4px #0003", display: "flex", alignItems: "center", justifyContent: dir === "l" ? "flex-end" : "flex-start", paddingInline: rows >= 4 ? 4 : 8, cursor: "pointer", zIndex: 4 }}>
      <svg width={rows >= 4 ? 12 : 16} height={rows >= 4 ? 12 : 16} viewBox="0 0 16 16" style={{ transform: dir === "l" ? "scaleX(-1)" : "none" }}><path d="M2 8h10M8 3l5 5-5 5" fill="none" stroke={cur} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
    </div>
  );
  // the scroll handle: a slim track along the panel's bottom edge; drag the thumb (or tap the track) to scroll
  const trackX = 22, trackW = gridW - 44, thumbW = Math.max(16, (trackW * visCols) / Math.max(visCols, scrollCols)), thumbX = maxScroll ? (scroll / maxScroll) * (trackW - thumbW) : 0;
  const handleAt = (cx: number) => { const l = local(cx, 0); if (!l) return; scrollTo(((l.x - trackX - thumbW / 2) / Math.max(1, trackW - thumbW)) * maxScroll); };

  const bottomBg: CSSProperties = botImg ? wallStyle(botImg, bw) : look.bottom?.mode === "solid" ? { background: look.bottom.color ?? "#ccc" } : { background: "linear-gradient(#e7eaf1,#dfe3ec)" };
  const noPanel = !!(botImg || look.bottom);
  const panelBg = inFolder ? "#c3bfb8" : "#d9d6d0";

  /** One grid item (game, folder or badge) in a w x h box. */
  const renderItem = (e: Entry, w: number, h: number, ghost = false) => {
    if (e.t === "folder") {
      const fw = w + (big ? 6 : 2), fh = h - (big ? 6 : 1);
      return <div style={{ position: "absolute", left: (w - fw) / 2, top: big ? -3 : 0 }}><FolderShape w={fw} h={fh} c={fc} name={e.name} art={look.folderArt?.closed} letter /></div>;
    }
    if (e.t === "badge") {
      const target = e.cell.app ? byApp.get(e.cell.app) : undefined;
      return (
        <>
          <div className="dht-n3ds-badge-art" style={{ position: "absolute", inset: 0, background: e.def ? `url("${e.def.url}") center / contain no-repeat` : "#0000", filter: ghost ? "none" : "drop-shadow(0 1.5px 1.5px #0005)" }}>
            {!e.def && <div style={{ position: "absolute", inset: "18%", borderRadius: "30%", border: "2px dashed #0003" }} />}
          </div>
          {target && <div className="dht-n3ds-shortcut" style={{ position: "absolute", right: -2, bottom: -2, width: Math.max(9, h * 0.34), height: Math.max(9, h * 0.34), borderRadius: 3, overflow: "hidden", boxShadow: "0 0 0 1.2px #fff, 0 1px 2px #0006" }}><GameArt g={target} kind="portrait" position="50% 18%" style={{ width: "100%", height: "100%" }} /></div>}
        </>
      );
    }
    const size = w, smallArt = rows >= 4;
    return (
      <div className="dht-n3ds-icon" style={{ position: "absolute", inset: 0, borderRadius: size * (smallArt ? 0.16 : 0.2), background: look.fileArt?.large ? `url(${smallArt ? look.fileArt.small ?? look.fileArt.large : look.fileArt.large}) 0 0 / 100% 100%` : `var(--dht-n3ds-tile, linear-gradient(#fff,${fileColor ?? "#f1f2f5"}))`, boxShadow: smallArt ? "0 1px 3px #3b405566, inset 0 0 0 1px #fff" : "0 3px 5px #3b405566, inset 0 0 0 1px #fff", padding: size * (smallArt ? 0.08 : 0.115) }}>
        <div style={{ width: "100%", height: "100%", borderRadius: smallArt ? 2 : 4, overflow: "hidden", boxShadow: "0 0 0 1px #0002", filter: e.game.installed ? "none" : "grayscale(.7) opacity(.7)" }}>
          <GameArt g={e.game} kind="portrait" position="50% 18%" style={{ width: "100%", height: "100%" }} />
        </div>
      </div>
    );
  };
  const heldEntry: Entry | undefined = (() => {
    if (!held) return undefined;
    const c = held.cell, from = held.from;
    const shown = from ? (from.box === box ? grid : from.box == null ? main : null)?.at.get(from.slot) : undefined;
    if (shown) return shown;
    if (isBadge(c)) return badgeEntry(c, "held");
    if ("g" in c && byApp.get(c.g)) return { t: "game", key: "held", game: byApp.get(c.g)!, cell: c };
    return undefined;
  })();
  const c0 = scroll - visCols, c1 = scroll + 2 * visCols;
  const itemName = (e?: Entry) => (!e ? "" : e.t === "game" ? e.game.name : e.t === "folder" ? e.name : e.def?.name ?? "Badge");

  /** The badge drawer: sets as tabs (with counts), the set's badges, the zoom control and Done. */
  const drawer = (w: number, h: number, side: boolean) => {
    const cell = side ? 30 : 38;
    return (
      <div className="dht-n3ds-drawer" data-set={sets[setI]?.name} data-focus={zone === "drawer"} onClick={() => { if (held?.from && isBadge(held.cell)) { removeBadge(held.from); setHeld(null); } }}
        style={{ position: "absolute", inset: 0, width: w, height: h, background: "linear-gradient(#fbfbfd,#eef0f5)", color: "#59606e", display: "flex", flexDirection: "column", fontFamily: FONT, boxShadow: side ? "-2px 0 6px #0002" : "none", zIndex: 6 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4, padding: side ? "4px 5px 2px" : "6px 8px 3px", flexWrap: side ? "wrap" : "nowrap" }}>
          {!side && <b style={{ fontSize: 13 }}>{held ? (held.from ? "Tap a cell to put it down" : "Tap a free cell to place it") : "Badges"}</b>}
          <span style={{ flex: 1 }} />
          <div className="dht-n3ds-rows" style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 10.5, background: "#e2e5ec", borderRadius: 9, padding: "1px 3px" }}>
            <span className="dht-n3ds-rows-minus" onClick={(ev) => (ev.stopPropagation(), setRows(rows - 1))} style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 800 }}>−</span>
            <span data-rows={rows}>{rows} row{rows > 1 ? "s" : ""}</span>
            <span className="dht-n3ds-rows-plus" onClick={(ev) => (ev.stopPropagation(), setRows(rows + 1))} style={{ width: 15, height: 15, borderRadius: "50%", background: "#fff", display: "inline-flex", alignItems: "center", justifyContent: "center", cursor: "pointer", fontWeight: 800 }}>+</span>
          </div>
          <span className="dht-n3ds-done" onClick={(ev) => (ev.stopPropagation(), endArrange())} style={{ marginLeft: 3, padding: "2px 9px", borderRadius: 10, background: `linear-gradient(${cur},${curDark})`, color: "#fff", fontWeight: 800, fontSize: side ? 10.5 : 12, cursor: "pointer", boxShadow: "0 1px 2px #0003" }}>Done</span>
        </div>
        {side && (
          <div style={{ display: "flex", alignItems: "center", gap: 2, padding: "1px 4px", fontSize: 10, fontWeight: 800 }}>
            <span className="dht-n3ds-set-prev" onClick={(ev) => (ev.stopPropagation(), setDrawerSet(Math.max(0, setI - 1)), setDrawerIdx(0), playSound("tab"))} style={{ cursor: "pointer", padding: "0 4px", opacity: setI > 0 ? 1 : 0.3 }}>◀</span>
            <span style={{ flex: 1, textAlign: "center", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{sets[setI]?.name} <small style={{ opacity: 0.6 }}>{setBadges.length}</small></span>
            <span className="dht-n3ds-set-next" onClick={(ev) => (ev.stopPropagation(), setDrawerSet(Math.min(sets.length - 1, setI + 1)), setDrawerIdx(0), playSound("tab"))} style={{ cursor: "pointer", padding: "0 4px", opacity: setI < sets.length - 1 ? 1 : 0.3 }}>▶</span>
          </div>
        )}
        <div className="dht-n3ds-sets" ref={(el) => { const c = el?.children[setI] as HTMLElement | undefined; if (el && c && !side) { if (c.offsetLeft - el.scrollLeft < 8 || c.offsetLeft + c.offsetWidth - el.scrollLeft > el.clientWidth - 8) el.scrollLeft = Math.max(0, c.offsetLeft - 24); } }}
          style={{ display: side ? "none" : "flex", gap: 3, padding: "2px 8px", overflowX: "auto", scrollbarWidth: "none", flexWrap: "nowrap", flexShrink: 0 }}>
          {sets.map((st, i) => (
            <span key={st.name} className="dht-n3ds-set" data-selected={i === setI} data-name={st.name} onClick={(ev) => (ev.stopPropagation(), setDrawerSet(i), setDrawerIdx(0), playSound("tab"))}
              style={{ flexShrink: 0, display: "inline-flex", alignItems: "center", gap: 3, padding: side ? "1px 5px" : "2px 7px", borderRadius: 8, fontSize: side ? 9 : 10.5, fontWeight: 700, cursor: "pointer", background: i === setI ? "#fff" : "#e2e5ec", boxShadow: i === setI ? `0 0 0 1.5px ${cur}, 0 1px 2px #0002` : "none", whiteSpace: "nowrap" }}>
              {st.badges[0] && <i style={{ width: side ? 10 : 13, height: side ? 10 : 13, background: `url("${st.badges[0].url}") center / contain no-repeat` }} />}
              {st.name}<small style={{ opacity: 0.6 }}>{st.badges.length}</small>
            </span>
          ))}
        </div>
        <div className="dht-n3ds-drawer-grid" style={{ flex: 1, display: "flex", flexWrap: "wrap", alignContent: "flex-start", gap: side ? 4 : 6, padding: side ? "4px 5px" : "6px 10px", overflow: "hidden" }}>
          {setBadges.map((b, i) => {
            const on = zone === "drawer" && i === dIdx, n = placedCount.get(b.id) ?? 0;
            return (
              <div key={b.id} className="dht-n3ds-drawer-badge" data-id={b.id} data-name={b.name} data-cells={`${b.w}x${b.h}`} data-selected={on} title={b.name}
                onClick={(ev) => { ev.stopPropagation(); setDrawerIdx(i); takeBadge(b); }}
                style={{ position: "relative", width: cell * b.w + (b.w - 1) * 4, height: cell * b.h + (b.h - 1) * 4, borderRadius: 7, background: held && !held.from && "b" in held.cell && held.cell.b === b.id ? `${cur}40` : "#fff", boxShadow: on ? `0 0 0 2px ${cur}` : "0 1px 2px #0002", cursor: "pointer" }}>
                <div style={{ position: "absolute", inset: 3, background: `url("${b.url}") center / contain no-repeat` }} />
                {n > 0 && <small style={{ position: "absolute", right: -3, top: -4, minWidth: 13, height: 13, borderRadius: 7, background: "#ff8a3d", color: "#fff", fontSize: 8.5, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 2px" }}>×{n}</small>}
              </div>
            );
          })}
        </div>
        <div style={{ fontSize: side ? 8 : 9.5, padding: side ? "2px 5px 4px" : "2px 10px 5px", opacity: 0.7, lineHeight: 1.25 }}>
          {side ? "Tap a badge, then a free cell. Own badges: skins/3ds-badges/<set>/" : `Tap a badge, then a free cell · Ⓧ removes · Ⓛ Ⓡ sets · your own pictures: ${badges.dir}/<set>/`}
        </div>
      </div>
    );
  };

  return (
    <ThemeRoot onInput={onInput} hints={(arranging ? { a: held ? "Put down" : "Pick up", b: held ? "Cancel" : "Done", x: "Remove badge", y: "Badges", menu: "Done" } : { a: it ? "Open" : inFolder ? undefined : "Create Folder", y: "Options", b: inFolder ? "Back" : undefined }) as any}>
      <Stage background="#bfc3cb">
        <style>{CSS}</style>
        <div className="dht-n3ds-backdrop" style={{ position: "absolute", inset: 0, overflow: "hidden", background: topImg ? "#101014" : "radial-gradient(ellipse at 50% 40%,#eceef2,#bcc1ca)" }}>
          <div style={{ position: "absolute", inset: 0, ...bgBlur }} />
        </div>
        <div className={`dht-n3ds-stack${s.animations ? "" : " dht-n3ds-still"}`} data-screen-layout={s.n3dsTop ?? "show"} data-rows={rows} data-arranging={arranging} style={{ position: "absolute", left, top: topY, width: stackWpx, height: stackHpx, transform: `scale(${k})`, transformOrigin: "0 0", fontFamily: FONT }}>
          {/* ───────── top screen ───────── */}
          {topOn && (
          <div className="dht-n3ds-top" data-dht-from-skin={topImg || look.top ? "" : undefined} style={{ position: "absolute", left: 0, top: 0, width: split ? bw : SW.top, height: SH, overflow: "hidden", borderRadius: split ? 0 : 3, boxShadow: split ? "none" : "0 0 0 3px #202226, 0 0 0 4.5px #4a4d54, 0 8px 22px #0006", background: look.top?.mode === "solid" ? look.top.color ?? "#eceef2" : "#eceef2", ...(look.top ? wallStyle(topImg, SW.top) : {}) }}>
            {!look.top && <div className="dht-n3ds-pattern" style={{ position: "absolute", inset: 0, background: `var(--dht-n3ds-top-bg, ${PATTERN} 8px 4px/100px 100px, linear-gradient(#eff0f3,#e1e3e8 60%,#e9ebef))` }} />}
            <div className="dht-n3ds-status" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 26, background: darkTop ? "linear-gradient(#0008,#0000)" : "linear-gradient(#fffe 55%,#fff0)", color: ink, fontSize: 12.5, fontWeight: 600, textShadow: darkTop ? "0 1px 2px #0009" : "none" }}>
              <div style={{ position: "absolute", left: 4, top: 6 }}><Bars color="#28a9e8" /></div>
              <div className="dht-n3ds-network" style={{ position: "absolute", left: 24, top: 5, width: 112, height: 15, borderRadius: 4, background: "linear-gradient(#58c4f4,#2aa4e4)", color: "#fff", fontSize: 11.5, lineHeight: "15px", textAlign: "center", textShadow: "0 1px 0 #1b7fb8", boxShadow: "inset 0 -1px 0 #1b7fb866" }}>Internet</div>
              <div className="dht-n3ds-coins" style={{ position: "absolute", left: 146, top: 4, display: "flex", alignItems: "center", gap: 4 }}>
                <svg width="16" height="16" viewBox="0 0 16 16"><circle cx="8" cy="8" r="7.2" fill="#e8c24a" stroke="#b6902a" strokeWidth="1" /><circle cx="8" cy="8" r="4.3" fill="none" stroke="#b6902a" strokeWidth="1.2" /></svg>
                <span>{api.lib.games.length}</span>
              </div>
              <div className="dht-n3ds-clock" style={{ position: "absolute", right: 36, top: 4, display: "flex", gap: 8, fontVariantNumeric: "tabular-nums" }}>
                <span className="dht-n3ds-date">{date}</span>
                <span className="dht-n3ds-time">{hh}{mm.length ? <><span className="dht-n3ds-blink">:</span>{mm.join(":")}</> : null}</span>
              </div>
              <div className="dht-n3ds-battery" style={{ position: "absolute", right: 5, top: 6 }}><Battery level={bat?.level ?? 1} charging={bat?.charging} ink={ink} /></div>
            </div>
            {/* the selected software (the console shows its 3D banner here), or the badge drawer while arranging */}
            {arranging ? (
              <div style={{ position: "absolute", left: 0, right: 0, top: 26, bottom: 0 }}>{drawer(SW.top, SH - 26, false)}</div>
            ) : it ? (
              <div className="dht-n3ds-card" style={{ position: "absolute", left: 0, right: 0, top: 62, display: "flex", flexDirection: "column", alignItems: "center", gap: 7, color: ink, textShadow: darkTop ? "0 1px 3px #000a" : "none" }}>
                {it.t === "game" ? (
                  <div style={{ width: 128, height: 60, padding: 4, borderRadius: 8, background: "#fff", boxShadow: "0 4px 10px #4a50668a, 0 0 0 1px #0000000d", transform: "perspective(300px) rotateX(2deg)" }}>
                    <GameArt g={it.game} kind="landscape" style={{ width: "100%", height: "100%", borderRadius: 5 }} />
                  </div>
                ) : it.t === "folder" ? <FolderShape w={92} h={66} c={fc} name={it.name} art={look.folderArt?.open} open /> : (
                  <div style={{ width: 64 * it.w, height: 64 * Math.min(it.h, 1.4), maxWidth: 150, background: it.def ? `url("${it.def.url}") center / contain no-repeat` : "none", filter: "drop-shadow(0 3px 4px #0005)" }} />
                )}
                <div className="dht-n3ds-plate" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: plate ? "3px 14px 4px" : 0, borderRadius: 9, background: plate ? (darkTop ? "#000a" : "#fffd") : "none", boxShadow: plate ? "0 1px 5px #0004" : "none", maxWidth: 360 }}>
                  <div className="dht-n3ds-title" style={{ fontSize: 15, fontWeight: 700, maxWidth: 340, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{it.t === "game" ? (showTitle(s, "n3ds", true) ? it.game.name : "") : itemName(it)}</div>
                  <div className="dht-n3ds-sub" style={{ fontSize: 10.5, opacity: 0.75 }}>
                    {it.t === "folder" ? `${it.games.length} software${it.own ? "" : " · Steam collection"}` : it.t === "badge" ? (g ? `Shortcut: ${g.name}` : `Badge · ${it.def?.set ?? ""}`) : it.game.playtime ? fmtPlaytime(it.game.playtime, it.game.lastPlayed) : it.game.installed ? "Ready to start" : "Not installed"}
                  </div>
                </div>
              </div>
            ) : null}
            {!arranging && (
            <div className="dht-n3ds-hints" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 24, background: darkTop ? "linear-gradient(#0000,#0008)" : "linear-gradient(#fff0,#fffe 45%)", color: ink, display: "flex", alignItems: "flex-end", justifyContent: "space-between", padding: "0 10px 4px", fontSize: 10.5, fontWeight: 700 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 5 }}><b style={{ width: 14, height: 14, borderRadius: "50%", border: `1.6px solid ${ink}`, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>Y</b>Options</span>
              {inFolder && <span className="dht-n3ds-folder-title" style={{ maxWidth: 160, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>▤ {openOwn?.name ?? openColl?.name}</span>}
              <span style={{ display: "flex", alignItems: "center", gap: 3 }}><b style={{ minWidth: 14, height: 14, border: `1.6px solid ${ink}`, borderRadius: 3, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>L</b>◂ ▸<b style={{ minWidth: 14, height: 14, border: `1.6px solid ${ink}`, borderRadius: 3, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>R</b></span>
            </div>
            )}
          </div>
          )}
          {/* ───────── bottom screen ───────── */}
          <div className={`dht-n3ds-bottom${arranging ? " dht-n3ds-arranging" : ""}`} data-dht-from-skin={noPanel ? "" : undefined} style={{ position: "absolute", left: botLeft, top: botTop, width: bw, height: SH, overflow: "clip", borderRadius: topOn && !split ? 3 : 0, boxShadow: !topOn || split ? "none" : "0 0 0 3px #202226, 0 0 0 4.5px #4a4d54, 0 8px 22px #0006", ...bottomBg }}>
            {!noPanel && <div className="dht-n3ds-stripes" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 40, background: STRIPES }} />}
            {!noPanel && <div className="dht-n3ds-panel" style={{ position: "absolute", left: PANEL.left, top: PANEL.top, right: -20, height: PANEL.h, borderRadius: "10px 0 0 10px", background: `var(--dht-n3ds-panel, ${panelBg})`, boxShadow: "inset 0 2px 5px #0002, 0 1px 0 #fff9" }} />}
            {/* the grid, clipped to the panel's width */}
            <div ref={gridRef} className="dht-n3ds-grid" data-rows={rows} data-scroll={scroll} data-cols={scrollCols} data-visible-cols={visCols} data-folder={openOwn?.name ?? openColl?.name ?? undefined}
              onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={() => { if (ptr.current) clearTimeout(ptr.current.timer); ptr.current = null; setDrag(null); }}
              style={{ position: "absolute", left: PANEL.left, top: PANEL.top, width: gridW, height: PANEL.h, overflowX: "clip", overflowY: "visible", touchAction: "none" }}>
              <div className="dht-n3ds-scroll" style={{ position: "absolute", inset: 0, transform: `translateX(${-scroll * geo.px}px)` }}>
                {/* faint markers in the free cells, as the console shows them */}
                {Array.from({ length: Math.max(0, Math.min(scrollCols, c1 + 1) - Math.max(0, c0)) * rows }, (_, j) => {
                  const slot = Math.max(0, c0) * rows + j;
                  if (grid.occ.has(slot)) return null;
                  const bx = cellBox(slot), m = Math.round(geo.tile * 0.36);
                  const on = slot === curSlot && zone === "grid";
                  return (
                    <div key={`e${slot}`} className="dht-n3ds-slot" data-slot={slot} style={{ position: "absolute", left: bx.left, top: bx.top, width: bx.width, height: bx.height, pointerEvents: "none" }}>
                      <i style={{ position: "absolute", left: (bx.width - m) / 2, top: (bx.height - m) / 2, width: m, height: m, borderRadius: m * 0.3, background: on ? "#e0e0de" : "#00000010", boxShadow: on ? "inset 0 1px 2px #0002, 0 0 0 1px #d3d3d1" : "inset 0 1px 1px #0000000f" }} />
                    </div>
                  );
                })}
                {[...grid.at.entries()].map(([slot, e]) => {
                  const c = Math.floor(slot / rows);
                  if (c < c0 - 1 || c > c1) return null;
                  const w = e.t === "badge" && e.fit ? e.w : 1, h = e.t === "badge" && e.fit ? e.h : 1;
                  const bx = cellBox(slot, w, h);
                  const on = anchor === slot && zone === "grid";
                  const isHeld = !!held?.from && held.from.box === box && held.from.slot === slot;
                  const dot = e.t !== "game" || !e.game.installed ? "" : e.game.lastPlayed > nowSec - RECENT ? "recent" : !e.game.lastPlayed ? "new" : "";
                  const showCursor = on && !(held && !drag);
                  return (
                    <div key={`${e.key}@${slot}`} className="dht-n3ds-tile" data-slot={slot} data-selected={on} data-held={isHeld} data-name={itemName(e)} data-kind={e.t} data-own={e.t === "folder" ? e.own : undefined} data-cells={e.t === "badge" ? `${w}x${h}` : undefined}
                      style={{ position: "absolute", ...bx, cursor: "pointer", opacity: isHeld ? 0.3 : 1 }}>
                      {rows === 1 && e.t !== "badge" && <div className="dht-n3ds-label" style={{ position: "absolute", left: -16, right: -16, bottom: "100%", marginBottom: 6, textAlign: "center", fontSize: 11, fontWeight: 700, color: look.text?.main ?? "#5a5f6b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{itemName(e)}</div>}
                      {renderItem(e, bx.width, bx.height)}
                      {dot && <i className="dht-n3ds-dot" data-state={dot} style={{ position: "absolute", right: rows >= 4 ? -3 : -2, bottom: rows >= 4 ? -3 : -2, width: rows >= 4 ? 7 : 11, height: rows >= 4 ? 7 : 11, borderRadius: "50%", background: dot === "recent" ? "#58d65a" : "#4cb4f2", boxShadow: `0 0 0 ${rows >= 4 ? 1 : 1.5}px #fffd, 0 1px 2px #0005`, pointerEvents: "none" }} />}
                      {showCursor && !simple && (
                        <div className="dht-n3ds-cursor" style={{ position: "absolute", inset: -cIn, pointerEvents: "none" }}>
                          {([[0, 0], [1, 0], [0, 1], [1, 1]] as const).map(([cxm, cym]) => (
                            <svg key={`${cxm}${cym}`} className="dht-n3ds-corner" viewBox="0 0 20 20" style={{ width: cSz, height: cSz, [cxm ? "right" : "left"]: 0, [cym ? "bottom" : "top"]: 0, transform: `scale(${cxm ? -1 : 1},${cym ? -1 : 1})`, filter: `drop-shadow(0 0 1.5px var(--dht-n3ds-cursor-dark, ${curDark}))`, ["--bx" as any]: `${cxm ? bob : -bob}px`, ["--by" as any]: `${cym ? bob : -bob}px` }}>
                              <path d="M3 19V9a6 6 0 0 1 6-6h10" fill="none" style={{ stroke: `var(--dht-n3ds-cursor, ${cur})` }} strokeWidth="5.4" strokeLinecap="round" />
                            </svg>
                          ))}
                        </div>
                      )}
                      {showCursor && simple && <div className="dht-n3ds-focus" style={{ position: "absolute", inset: rows >= 4 ? -2 : -3, borderRadius: Math.min(bx.width, bx.height) * 0.24, boxShadow: `0 0 0 ${rows >= 4 ? 2 : 3}px var(--dht-n3ds-cursor, ${cur}), 0 0 12px 3px ${curGlow}99`, pointerEvents: "none" }} />}
                    </div>
                  );
                })}
                {/* the cursor on a free cell */}
                {anchor == null && zone === "grid" && !(held && !drag) && (() => {
                  const bx = cellBox(curSlot);
                  return simple ? <div className="dht-n3ds-focus" data-slot={curSlot} style={{ position: "absolute", ...bx, borderRadius: bx.width * 0.24, boxShadow: `0 0 0 ${rows >= 4 ? 2 : 3}px var(--dht-n3ds-cursor, ${cur})`, pointerEvents: "none" }} /> : (
                    <div className="dht-n3ds-cursor" data-slot={curSlot} style={{ position: "absolute", left: bx.left - cIn, top: bx.top - cIn, width: bx.width + 2 * cIn, height: bx.height + 2 * cIn, pointerEvents: "none" }}>
                      {([[0, 0], [1, 0], [0, 1], [1, 1]] as const).map(([cxm, cym]) => (
                        <svg key={`${cxm}${cym}`} className="dht-n3ds-corner" viewBox="0 0 20 20" style={{ width: cSz, height: cSz, [cxm ? "right" : "left"]: 0, [cym ? "bottom" : "top"]: 0, transform: `scale(${cxm ? -1 : 1},${cym ? -1 : 1})`, filter: `drop-shadow(0 0 1.5px var(--dht-n3ds-cursor-dark, ${curDark}))`, ["--bx" as any]: `${cxm ? bob : -bob}px`, ["--by" as any]: `${cym ? bob : -bob}px` }}>
                          <path d="M3 19V9a6 6 0 0 1 6-6h10" fill="none" style={{ stroke: `var(--dht-n3ds-cursor, ${cur})` }} strokeWidth="5.4" strokeLinecap="round" />
                        </svg>
                      ))}
                    </div>
                  );
                })()}
                {/* the held icon / badge, lifted above the cursor (or under the finger while dragging) */}
                {held && heldEntry && !drag && zone !== "drawer" && (() => {
                  const { w, h } = cellsOf(held.cell), bx = cellBox(curSlot, w, h);
                  return <div key={`held${nudge}`} className="dht-n3ds-tile dht-n3ds-held" data-name={itemName(heldEntry)} style={{ position: "absolute", ...bx, top: bx.top - 6, transform: "scale(1.08)", filter: "drop-shadow(0 6px 5px #0006)", pointerEvents: "none", zIndex: 5, animation: nudge ? "dhtN3dsWiggle .25s 2" : "none" }}>{renderItem(heldEntry, bx.width, bx.height, true)}</div>;
                })()}
              </div>
              {held && heldEntry && drag && (() => {
                const { w, h } = cellsOf(held.cell), bx = cellBox(0, w, h);
                return <div className="dht-n3ds-tile dht-n3ds-held" data-name={itemName(heldEntry)} style={{ position: "absolute", left: drag.x - bx.width / 2, top: drag.y - bx.height / 2, width: bx.width, height: bx.height, transform: "scale(1.1)", filter: "drop-shadow(0 6px 5px #0006)", pointerEvents: "none", zIndex: 5 }}>{renderItem(heldEntry, bx.width, bx.height, true)}</div>;
              })()}
            </div>
            {grid.at.size === 0 && !inFolder && <div style={{ position: "absolute", left: 20, right: 20, top: 100, textAlign: "center", fontSize: 12, color: "#777", pointerEvents: "none" }}>No software found for the selected library view.</div>}
            {maxScroll > 0 && s.n3dsHandle !== "hide" && (
              <div className="dht-n3ds-handle" data-scroll={scroll} data-max={maxScroll}
                onPointerDown={(e) => { handleRef.current = { x0: e.clientX, w: trackW }; try { (e.currentTarget as any).setPointerCapture?.(e.pointerId); } catch { /* */ } handleAt(e.clientX); }}
                onPointerMove={(e) => { if (handleRef.current) handleAt(e.clientX); }}
                onPointerUp={() => (handleRef.current = null)}
                style={{ position: "absolute", left: PANEL.left + trackX, top: PANEL.top + PANEL.h - 4, width: trackW, height: 10, cursor: "pointer", zIndex: 3, touchAction: "none" }}>
                <div style={{ position: "absolute", left: 0, right: 0, top: 5, height: 2, borderRadius: 1, background: "#0000001c" }} />
                <div className="dht-n3ds-thumb" style={{ position: "absolute", left: thumbX, top: 4, width: thumbW, height: 4, borderRadius: 2, background: `var(--dht-n3ds-handle, ${look.folder ? fc.main : "#9aa0ab"})`, boxShadow: "0 0 0 1px #fffa, 0 1px 2px #0003", transition: "left 200ms" }} />
              </div>
            )}
            {s.n3dsArrows !== "hide" && scroll > 0 && ring("l", () => scrollBy(-visCols))}
            {s.n3dsArrows !== "hide" && scroll < maxScroll && ring("r", () => scrollBy(visCols))}
            {/* tab strip: HOME Settings + shortcuts (a back button in a folder, Done while arranging), the two resize buttons */}
            <div className="dht-n3ds-tabs" style={{ position: "absolute", left: 0, right: 0, top: 0, height: 31, background: "linear-gradient(#e8ebf2,#dde1ea)", boxShadow: "0 1px 0 #c2c8d4", display: "flex", alignItems: "flex-end", paddingLeft: 3, zIndex: 7 }}>
              {tabs.filter((t) => t !== "big" && t !== "small").map((id) => {
                const i = tabs.indexOf(id), on = zone === "tabs" && tabIdx === i, wide = id === "settings" || id === "back" || id === "done";
                const label = id === "back" ? t("back") : id === "done" ? t("done") : undefined;
                return (
                  <div key={id} className="dht-n3ds-tab" data-selected={on} data-name={label ?? getTabs().find((t) => t.id === id)?.name} onClick={() => { setTab(i); runTab(id); }}
                    style={{ minWidth: wide ? 46 : 38, height: wide ? 29 : 27, marginRight: wide ? 4 : 1, padding: label ? "0 8px" : 0, gap: 4, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "9px 9px 0 0", background: id === "done" ? `linear-gradient(${cur},${curDark})` : wide ? "linear-gradient(#fafbfc,#eef0f4)" : "transparent", color: id === "done" ? "#fff" : "#6a7080", fontWeight: 800, fontSize: 12.5, boxShadow: on ? `inset 0 0 0 2px ${id === "done" ? "#fff" : cur}` : "none", cursor: "pointer" }}>
                    {id !== "done" && <TabGlyph id={id} size={wide ? 25 : 25} />}{label}
                  </div>
                );
              })}
              {(inFolder || arranging) && <span className="dht-n3ds-strip-title" style={{ alignSelf: "center", fontSize: 12, fontWeight: 800, color: "#6a7080", marginLeft: 4, maxWidth: bw - 190, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{arranging ? (inFolder ? `${t("rearrange")} · ${openOwn?.name ?? openColl?.name}` : t("rearrange")) : openOwn?.name ?? openColl?.name}</span>}
              <span style={{ flex: 1 }} />
              <div style={{ display: "flex", alignItems: "flex-end", background: "linear-gradient(#fafbfc,#eef0f4)", borderRadius: "8px 0 0 0", paddingLeft: 3, height: 29 }}>
                {(["big", "small"] as const).map((id) => {
                  const i = tabs.indexOf(id), on = zone === "tabs" && tabIdx === i, can = id === "big" ? rows > 1 : rows < 6;
                  return (
                    <div key={id} className="dht-n3ds-tab dht-n3ds-view" data-selected={on} data-enabled={can} data-name={id === "big" ? "Larger icons" : "Smaller icons"} onClick={() => { setTab(i); runTab(id); }}
                      style={{ width: 25, height: 27, marginRight: 1, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px 8px 0 0", boxShadow: on ? `inset 0 0 0 2px ${cur}` : "none", cursor: "pointer", opacity: can ? 1 : 0.4, borderLeft: id === "small" ? "1px solid #d6dae2" : "none" }}>
                      <svg width="14" height="14" viewBox="0 0 14 14">{id === "big" ? <rect x="1" y="1" width="12" height="12" rx="2.5" fill="#93a8c5" /> : [1.5, 7.5].flatMap((x) => [1.5, 7.5].map((y) => <rect key={`${x}${y}`} x={x} y={y} width="5" height="5" rx="1.2" fill="#93a8c5" />))}</svg>
                    </div>
                  );
                })}
              </div>
            </div>
            {/* the Open bar (Settings | Open on a folder, Create Folder on a free cell) */}
            {bars.length > 0 && (
              <div className="dht-n3ds-bar" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 25, display: "flex", gap: 2 }}>
                {bars.map((bt, i) => {
                  const on = zone === "bar" && barIdx === i, first = bars.length > 1 && i === 0;
                  return (
                    <div key={bt.id} className={`dht-n3ds-${bt.id === "settings" ? "folder-settings" : bt.id === "create" ? "create" : "start"}`} data-selected={on} onClick={() => { setBar(i); runBar(bt.id); }}
                      style={{ width: first ? 106 : undefined, flex: first ? "none" : 1, borderRadius: "10px 10px 0 0", background: "linear-gradient(#f2f0ec,#d9d5d0)", color: "#5d5a55", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 700, textShadow: "0 1px 0 #fff", cursor: "pointer", boxShadow: on ? `inset 0 0 0 2.5px ${cur}` : "inset 0 1px 0 #fff, 0 -1px 2px #0002" }}>
                      {bt.label}
                    </div>
                  );
                })}
              </div>
            )}
            {sideDrawer && <div style={{ position: "absolute", right: 0, top: 31, width: DRAWER_SIDE, bottom: 0 }}>{drawer(DRAWER_SIDE, SH - 31, true)}</div>}
            {arranging && topOn && <div className="dht-n3ds-arrange-hint" style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 26, display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontSize: 10, fontWeight: 700, color: "#6a7080", pointerEvents: "none" }}>
              <span>Ⓐ {held ? "Put down" : "Pick up"}</span><span>Ⓨ Badges</span><span>Ⓧ Remove badge</span><span>Ⓑ {held ? "Cancel" : "Done"}</span>
            </div>}
          </div>
        </div>
        <MenuView menu={menu} variant="n3ds" />
      </Stage>
    </ThemeRoot>
  );
}
