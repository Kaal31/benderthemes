// PS Vita home: pages of bubbles scrolled vertically, user folders (and Steam
// collections as folders), rearranging, and a LiveArea gate for each game.
import { ConfirmModal, showModal, TextField } from "@decky/ui";
import { CSSProperties, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { AnimCanvas } from "../canvas";
import { BatteryGlyph, GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, spatial, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openSteam, SteamPlace } from "../library";
import { showTitle, THEMES, TITLE_MODES, updateSettings, updateVita, VitaFolder } from "../settings";
import { fmtTime, playSound, useBattery, useClock, useWallpaper } from "../steam";
import { useVitaSkin, VitaSkin } from "../skins";
import { Badges } from "../badges";
import { useBubbleMotion } from "../motion";
import { BubbleDefs, BubbleStyle, BUBBLE_STYLES, VitaBubble } from "./vitaBubble";

const PER_PAGE = 10;
const D = 184; // bubble diameter (~138 px on the 960×544 Vita screen)
const BAR = 43; // information bar height
const FOLDER_COLORS = ["#3fa9f5", "#f5a623", "#7ed321", "#e94b8a", "#9b59d0", "#50e3c2", "#f8e71c", "#d0021b"];

interface SysBubble {
  id: string;
  label: string;
  icon: IconName;
  color: string;
  place?: SteamPlace;
  skinKey: string; // Vita custom-theme icon this bubble takes
  altKey?: string; // fallback icon key
}
const SYSTEM: SysBubble[] = [
  { id: "library", label: "Library", icon: "library", color: "#2b6fd6", place: "library", skinKey: "hostCollabo" },
  { id: "store", label: "Store", icon: "store", color: "#1b4fa8", place: "store", skinKey: "store", altKey: "near" },
  { id: "friends", label: "Friends", icon: "friends", color: "#3aa35a", place: "friends", skinKey: "friend" },
  { id: "media", label: "Screenshots", icon: "photo", color: "#e0902a", place: "media", skinKey: "camera" },
  { id: "browser", label: "Browser", icon: "globe", color: "#2a9fd6", place: "browser", skinKey: "browser" },
  { id: "downloads", label: "Downloads", icon: "download", color: "#7a5bd0", place: "downloads", skinKey: "message" },
  { id: "settings", label: "Settings", icon: "gear", color: "#6d7a8c", skinKey: "settings" },
  { id: "power", label: "Power", icon: "power", color: "#3b4252", place: "power", skinKey: "power" },
];

type VItem =
  | { key: string; kind: "game"; label: string; game: Game }
  | { key: string; kind: "folder"; label: string; games: Game[]; folder: VitaFolder }
  | { key: string; kind: "col"; label: string; games: Game[] }
  | { key: string; kind: "sys"; label: string; sys: SysBubble };

// Page layout, measured from a real Vita home page (960×544): rows of 3 · 4 · 3,
// row 2 offset half a step, everything centred on the screen.
const VITA_SLOTS: [number, number][] = [
  [261, 130], [480, 130], [712, 130],
  [163, 285], [371, 285], [590, 285], [828, 285],
  [258, 437], [480, 437], [712, 437],
];
function slotPos(i: number, W: number, H: number) {
  const [vx, vy] = VITA_SLOTS[i];
  const sx = W / 960;
  const sy = Math.min(1.42, (H - BAR) / 512);
  const off = (H - BAR - 512 * sy) / 2;
  return { x: vx * sx, y: BAR + off + (vy - 32) * sy - 8 };
}

// ───────────── background ─────────────
// Default Vita-style backdrop: deep blue to cyan with slow bands of light.
function drawVitaWave(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  ctx.globalCompositeOperation = "lighter";
  for (let k = 0; k < 5; k++) {
    const base = h * (0.52 + k * 0.07);
    const grad = ctx.createLinearGradient(0, base - 80, 0, base + 120);
    grad.addColorStop(0, "rgba(160,230,255,0)");
    grad.addColorStop(0.45, `rgba(160,230,255,${0.05 + k * 0.012})`);
    grad.addColorStop(1, "rgba(160,230,255,0)");
    ctx.beginPath();
    ctx.moveTo(0, h);
    for (let x = 0; x <= w; x += 24) {
      const u = x / w;
      ctx.lineTo(x, base + Math.sin(u * 3.1 + t * (0.18 + k * 0.04) + k * 1.3) * h * 0.05 - u * h * 0.12);
    }
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }
  ctx.globalCompositeOperation = "source-over";
}

function VitaBackground({ page, skin, animate }: { page: number; skin: VitaSkin | null; animate: boolean }) {
  const { W, H } = useStage();
  const wall = useWallpaper("vita");
  const skinBg = skin?.pages.length ? skin.pages[Math.min(page, skin.pages.length - 1)] : null;
  const img = skinBg ?? wall;
  return (
    <div className="dht-vita-bg" style={{ position: "absolute", inset: 0 }}>
      <div
        className="dht-vita-bg-gradient"
        style={{
          position: "absolute",
          inset: 0,
          background:
            "var(--dht-vita-bg, radial-gradient(ellipse 75% 22% at 35% 64%, rgba(190,245,255,0.55), transparent 70%), radial-gradient(ellipse 90% 45% at 20% 100%, rgba(110,225,255,0.65), transparent 70%), linear-gradient(176deg, #031d42 0%, #08427e 26%, #1477bd 48%, #33b2e6 66%, #49c9ef 78%, #2696d6 100%))",
        }}
      />
      {img && <img key={img.slice(-40)} src={img} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />}
      {!img && <AnimCanvas width={W} height={H} animate={animate} fps={24} draw={drawVitaWave} />}
    </div>
  );
}

// ───────────── bubbles ─────────────
// Rendering lives in vitaBubble.tsx (several selectable styles).
interface MotionProps {
  motion: boolean;
  phase: number;
  sway: "off" | "gentle" | "lively";
}
function Sphere({ children, bg, art = true, style, mp }: { children: ReactNode; bg?: string; art?: boolean; style: BubbleStyle; mp: MotionProps }) {
  return (
    <VitaBubble d={D} style={style} bg={bg} zoomArt={art} motion={mp.motion} phase={mp.phase} sway={mp.sway}>
      {children}
    </VitaBubble>
  );
}

function Bubble({ item, art, skin, bs, mp }: { item: VItem; art: "portrait" | "landscape"; skin: VitaSkin | null; bs: BubbleStyle; mp: MotionProps }) {
  if (item.kind === "game")
    return (
      <Sphere style={bs} mp={mp}>
        <GameArt g={item.game} kind={art} style={{ width: "100%", height: "100%" }} position={art === "portrait" ? "50% 30%" : "50% 50%"} />
      </Sphere>
    );
  if (item.kind === "sys") {
    const custom = skin?.icons[item.sys.skinKey] ?? (item.sys.altKey ? skin?.icons[item.sys.altKey] : undefined);
    if (custom)
      return (
        <Sphere style={bs} mp={mp}>
          <img src={custom} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
        </Sphere>
      );
    // Stock-style system bubble: white sphere with a coloured glyph.
    return (
      <Sphere style={bs} mp={mp} art={false} bg="radial-gradient(circle at 50% 35%, #ffffff 0%, #eef3f8 55%, #c9d6e3 100%)">
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon name={item.sys.icon} size={86} color={item.sys.color} />
        </div>
      </Sphere>
    );
  }
  // Folder / collection: a tinted sphere holding up to four mini bubbles.
  const tint = item.kind === "folder" ? item.folder.color : "#d9a441";
  const minis = item.games.slice(0, 4);
  return (
    <Sphere style={bs} mp={mp} art={false} bg={`radial-gradient(circle at 50% 35%, #ffffff, ${tint} 85%)`}>
      <div style={{ position: "absolute", left: "19%", top: "19%", right: "19%", bottom: "19%", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
        {minis.map((g) => (
          <div key={g.appid} style={{ borderRadius: "50%", overflow: "hidden", aspectRatio: "1", boxShadow: "0 1px 3px rgba(0,0,0,0.35)" }}>
            <GameArt g={g} kind={art} style={{ width: "100%", height: "100%" }} />
          </div>
        ))}
      </div>
    </Sphere>
  );
}

// ───────────── information bar & page indicator ─────────────
function VitaStatus({ h24, color }: { h24: boolean; color?: string }) {
  const now = useClock(15000);
  const bat = useBattery();
  const t = fmtTime(now, h24);
  const m = /^(.*) (AM|PM)$/.exec(t);
  return (
    <div className="dht-vita-bar dht-statusbar" style={{ position: "absolute", left: 0, right: 0, top: 0, height: BAR, background: `var(--dht-vita-bar, ${color ?? "#000"})`, display: "flex", alignItems: "center", padding: "0 18px", color: "#fff", zIndex: 20 }}>
      <svg width="26" height="22" viewBox="0 0 26 22" style={{ opacity: 0.95 }}>
        <circle cx="4" cy="18" r="2.6" fill="#fff" />
        <path d="M2 10a10 10 0 0110 10M2 3a17 17 0 0117 17" stroke="#fff" strokeWidth="2.6" fill="none" strokeLinecap="round" />
      </svg>
      <div style={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Icon name="home" size={26} color="#fff" />
      </div>
      <span style={{ fontSize: 30, fontWeight: 400, letterSpacing: 0.5 }}>
        {m ? m[1] : t}
        {m && <span style={{ fontSize: 17, marginLeft: 5 }}>{m[2]}</span>}
      </span>
      {bat && (
        <div style={{ marginLeft: 14, marginRight: 52 }}>
          <BatteryGlyph level={bat.level} charging={bat.charging} color="#9be15d" w={38} />
        </div>
      )}
      {/* notification sphere peeking from the corner */}
      <div style={{ position: "absolute", right: -22, top: -26, width: 82, height: 82, borderRadius: "50%", background: "radial-gradient(circle at 40% 35%, #c9ecff, #3e8fe0 55%, #164a9a 100%)", boxShadow: "0 2px 8px rgba(0,0,0,0.5)" }} />
    </div>
  );
}

/** Page dots on the left. Tap a dot to jump there; the page a swipe is heading to lights up. */
export const DOT_STEP = 28;
export const dotsTop = (H: number) => H * 0.39;
function PageDots({ page, pages, target }: { page: number; pages: number; target?: number | null }) {
  const { H } = useStage();
  if (pages <= 1) return null;
  return (
    <div className="dht-pagedots" style={{ position: "absolute", left: 13, top: dotsTop(H) - 8, width: 28, padding: "8px 0", display: "flex", flexDirection: "column", alignItems: "center", zIndex: 10, borderRadius: 14, background: target != null ? "rgba(255,255,255,0.12)" : "transparent", transition: "background 200ms" }}>
      {Array.from({ length: pages }).map((_, i) => {
        const on = i === page;
        const aim = i === target;
        const d = on ? 13 : aim ? 12 : 9;
        return (
          <div key={i} className="dht-pagedot" data-selected={on} style={{ height: DOT_STEP, display: "flex", alignItems: "center" }}>
            <div style={{ width: d, height: d, borderRadius: "50%", background: on ? "#fff" : aim ? "rgba(200,240,255,0.95)" : "rgba(220,240,255,0.55)", boxShadow: on ? "0 0 8px rgba(255,255,255,0.9)" : aim ? "0 0 12px 3px rgba(120,210,255,0.9)" : "none", transition: "all 160ms" }} />
          </div>
        );
      })}
    </div>
  );
}

// ───────────── LiveArea ─────────────
type LiveBtn = "start" | "page" | "menu";
function LiveArea({ game, focus, closing, art, peel = 0, onTap }: { game: Game; focus: LiveBtn; closing: boolean; art: "portrait" | "landscape"; peel?: number; onTap?: (b: LiveBtn) => void }) {
  const { W, H } = useStage();
  const ring = (on: boolean): CSSProperties => (on ? { boxShadow: "0 0 0 4px #fff, 0 0 24px 6px rgba(80,190,255,0.9)" } : { boxShadow: "0 6px 18px rgba(0,0,0,0.4)" });
  return (
    <div
      className="dht-livearea"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 30,
        animation: closing ? "dhtPeel 420ms ease-in forwards" : "dhtLiveIn 280ms ease-out",
        // finger-driven peel from the top-right corner
        clipPath: !closing && peel > 0 ? `polygon(0 0, ${(1 - 2 * peel) * 100}% 0, 100% ${2 * peel * 100}%, 100% 100%, 0 100%)` : undefined,
      }}
    >
      <GameArt g={game} kind="hero" style={{ position: "absolute", inset: 0, width: W, height: H }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, rgba(0,0,0,0.45), rgba(0,0,0,0.05) 35%, rgba(0,0,0,0.55))" }} />
      {/* header: bubble + title */}
      <div style={{ position: "absolute", left: 40, top: 62, display: "flex", alignItems: "center", gap: 18 }}>
        <div style={{ width: 84, height: 84, borderRadius: "50%", overflow: "hidden", boxShadow: "0 0 0 3px #fff, 0 4px 12px rgba(0,0,0,0.5)" }}>
          <GameArt g={game} kind={art} style={{ width: "100%", height: "100%" }} />
        </div>
        <div style={{ color: "#fff", fontSize: 30, fontWeight: 600, textShadow: "0 2px 8px rgba(0,0,0,0.7)", maxWidth: 640 }}>{game.name}</div>
      </div>
      {/* gate */}
      <div style={{ position: "absolute", left: W * 0.47, top: H * 0.25, width: 560, transition: "transform 150ms", transform: focus === "start" ? "scale(1.03)" : "none" }}>
        <div className="dht-livearea-gate" data-selected={focus === "start"} onClick={() => onTap?.("start")} style={{ width: 560, height: 262, borderRadius: 16, overflow: "hidden", position: "relative", ...ring(focus === "start") }}>
          <GameArt g={game} kind="landscape" style={{ width: "100%", height: "100%" }} />
          <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 64, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.75))", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "#fff", fontSize: 30, fontWeight: 700, letterSpacing: 1, textShadow: "0 2px 6px #000" }}>Start</span>
          </div>
        </div>
      </div>
      {/* info card */}
      <div className="dht-livearea-info" style={{ position: "absolute", left: 40, top: H * 0.3, width: 380, padding: "18px 22px", borderRadius: 14, background: "rgba(255,255,255,0.88)", color: "#1c2433", fontSize: 19, lineHeight: 1.7, boxShadow: "0 8px 22px rgba(0,0,0,0.35)" }}>
        <div>
          <b>Play time:</b> {fmtPlaytime(game.playtime)}
        </div>
        <div>
          <b>Last played:</b> {fmtLastPlayed(game.lastPlayed)}
        </div>
        <div>
          <b>Status:</b> {game.shortcut ? "Non-Steam game" : game.installed ? "Installed" : "Not installed"}
        </div>
        <Badges g={game} size={15} light style={{ marginTop: 8 }} />
      </div>
      {/* bottom tiles */}
      <div style={{ position: "absolute", left: 40, top: H * 0.66, display: "flex", gap: 22 }}>
        {(
          [
            ["page", "Game Page", "info"],
            ["menu", "Options", "dots"],
          ] as [LiveBtn, string, IconName][]
        ).map(([k, label, icon]) => (
          <div key={k} onClick={() => onTap?.(k)} style={{ width: 170, height: 118, borderRadius: 14, background: "rgba(20,30,50,0.78)", color: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10, fontSize: 18, transition: "transform 150ms", transform: focus === k ? "scale(1.05)" : "none", ...ring(focus === k) }}>
            <Icon name={icon} size={36} color="#fff" />
            {label}
          </div>
        ))}
      </div>
      {/* page-curl corner */}
      <div style={{ position: "absolute", right: 0, top: 0, width: 0, height: 0, borderStyle: "solid", borderWidth: "0 86px 86px 0", borderColor: "transparent rgba(235,240,248,0.95) transparent transparent", filter: "drop-shadow(-4px 4px 6px rgba(0,0,0,0.4))" }} />
      <div style={{ position: "absolute", right: 10, top: 92, color: "#fff", fontSize: 14, opacity: 0.85, textShadow: "0 1px 3px #000" }}>Ⓑ / drag to peel</div>
    </div>
  );
}

const VITA_CSS = `
@keyframes dhtLiveIn { from { opacity: 0; transform: scale(0.82); } to { opacity: 1; transform: scale(1); } }
@keyframes dhtPeel {
  0%   { clip-path: polygon(0 0, 100% 0, 100% 0, 100% 100%, 0 100%); }
  50%  { clip-path: polygon(0 0, 0 0, 100% 100%, 100% 100%, 0 100%); }
  100% { clip-path: polygon(0 100%, 0 100%, 0 100%, 0 100%, 0 100%); }
}
@keyframes dhtGlow { 0%,100% { opacity: 0.55; transform: scale(0.96); } 50% { opacity: 0.95; transform: scale(1.04); } }
@keyframes dhtWobble { 0%,100% { transform: rotate(-3deg); } 50% { transform: rotate(3deg); } }
@keyframes dhtHalo { 0%,100% { box-shadow: 0 0 0 3px var(--dht-vita-halo-ring, rgba(190,240,255,0.85)), 0 0 18px 6px var(--dht-vita-halo, rgba(80,200,255,0.55)); } 50% { box-shadow: 0 0 0 4px var(--dht-vita-halo-ring, rgba(220,248,255,1)), 0 0 30px 12px var(--dht-vita-halo, rgba(80,200,255,0.8)); } }
@keyframes dhtLaunch { from { transform: scale(1); opacity: 1; } to { transform: scale(2.6); opacity: 0; } }
`;

// ───────────── folder name dialog ─────────────
function askName(title: string, initial: string, done: (name: string) => void) {
  let value = initial;
  try {
    showModal(
      <ConfirmModal strTitle={title} strOKButtonText="OK" onOK={() => done(value.trim() || initial)}>
        <TextField label="Folder name" defaultValue={initial} onChange={(e: any) => (value = e?.target?.value ?? value)} />
      </ConfirmModal>,
    );
  } catch {
    done(initial);
  }
}

// ───────────── main ─────────────
export function VitaHome() {
  const api = useHome();
  const s = api.settings;
  const v = s.vita;
  const { W, H } = useStage();
  const menu = useMenu();
  const skin = useVitaSkin();

  // Build the item list in the user's order.
  const items: VItem[] = useMemo(() => {
    const inFolders = new Set<number>();
    v.folders.forEach((f) => f.apps.forEach((a) => inFolders.add(a)));
    const out: VItem[] = [];
    if (v.systemBubbles) SYSTEM.forEach((sys) => out.push({ key: `sys:${sys.id}`, kind: "sys", label: sys.label, sys }));
    v.folders.forEach((f) =>
      out.push({ key: `folder:${f.id}`, kind: "folder", label: f.name, folder: f, games: f.apps.map((a) => api.lib.byId.get(a)).filter(Boolean) as Game[] }),
    );
    if (v.collectionFolders) api.lib.collections.forEach((c) => out.push({ key: `col:${c.id}`, kind: "col", label: c.name, games: c.games }));
    api.lib.games.filter((g) => !inFolders.has(g.appid)).forEach((g) => out.push({ key: `app:${g.appid}`, kind: "game", label: g.name, game: g }));
    const pos = new Map(v.order.map((k, i) => [k, i]));
    const ordered = out.filter((i) => pos.has(i.key)).sort((a, b) => pos.get(a.key)! - pos.get(b.key)!);
    const rest = out.filter((i) => !pos.has(i.key));
    return [...ordered, ...rest];
  }, [api.lib, v]);

  const [sel, setSel] = useRemembered("vita-sel", 0);
  const [openFolder, setOpenFolder] = useState<string | null>(null);
  const [fsel, setFsel] = useState(0);
  const [live, setLive] = useState<{ game: Game; focus: LiveBtn } | null>(null);
  const [closing, setClosing] = useState(false);
  const [moving, setMoving] = useState<VItem[] | null>(null); // working order while rearranging
  const [launching, setLaunching] = useState(false);

  const list = moving ?? items;
  const folderItem = openFolder ? items.find((i) => i.key === openFolder) : undefined;
  const folderGames: Game[] = folderItem && (folderItem.kind === "folder" || folderItem.kind === "col") ? folderItem.games : [];
  const folderList: VItem[] = folderGames.map((g) => ({ key: `app:${g.appid}`, kind: "game", label: g.name, game: g }));

  const view = openFolder ? folderList : list;
  const cur = openFolder ? clamp(fsel, 0, Math.max(0, view.length - 1)) : clamp(sel, 0, Math.max(0, view.length - 1));
  const setCurRaw = (i: number) => (openFolder ? setFsel(i) : setSel(i));
  // 3D bubbles: they turn and sway only when the Deck is tilted (gyro)
  const [tiltEl, setTiltEl] = useState<HTMLDivElement | null>(null);
  useBubbleMotion(tiltEl, { enabled: s.animations && v.motion && v.gyro, gyro: v.gyro });
  const setCur = (i: number) => setCurRaw(i);
  const pages = Math.max(1, Math.ceil(view.length / PER_PAGE));
  const page = Math.floor(cur / PER_PAGE);
  const curItem = view[cur];

  useEffect(() => {
    if (sel >= items.length && items.length) setSel(items.length - 1);
  }, [items.length]);

  // Global positions for spatial navigation: each page is one screen lower.
  const points = useMemo(() => view.map((_, i) => {
    const p = slotPos(i % PER_PAGE, W, H);
    return { x: p.x, y: p.y + Math.floor(i / PER_PAGE) * H };
  }), [view.length, W, H]);

  const saveOrder = (arr: VItem[]) => updateVita({ order: arr.map((i) => i.key) });

  // ───── folder management ─────
  const newFolder = (withApp?: number) => {
    const id = Math.random().toString(36).slice(2, 9);
    const name = `Folder ${v.folders.length + 1}`;
    const color = FOLDER_COLORS[v.folders.length % FOLDER_COLORS.length];
    updateVita((p) => ({ folders: [...p.folders, { id, name, apps: withApp != null ? [withApp] : [], color }] }));
    askName("New Folder", name, (n) => updateVita((p) => ({ folders: p.folders.map((f) => (f.id === id ? { ...f, name: n } : f)) })));
  };
  const addToFolder = (fid: string, appid: number) =>
    updateVita((p) => ({ folders: p.folders.map((f) => (f.id === fid ? { ...f, apps: f.apps.includes(appid) ? f.apps : [...f.apps, appid] } : { ...f, apps: f.apps.filter((a) => a !== appid) })) }));
  const removeFromFolder = (appid: number) => updateVita((p) => ({ folders: p.folders.map((f) => ({ ...f, apps: f.apps.filter((a) => a !== appid) })) }));
  const deleteFolder = (fid: string) => updateVita((p) => ({ folders: p.folders.filter((f) => f.id !== fid) }));
  const renameFolder = (f: VitaFolder) => askName("Rename Folder", f.name, (n) => updateVita((p) => ({ folders: p.folders.map((x) => (x.id === f.id ? { ...x, name: n } : x)) })));
  const recolorFolder = (fid: string, color: string) => updateVita((p) => ({ folders: p.folders.map((x) => (x.id === fid ? { ...x, color } : x)) }));

  const commonMenu = (): MenuItem[] => [
    { label: "Create Folder", action: () => newFolder() },
    {
      label: "Bubble Settings",
      sub: () => [
        { label: "Bubble Style", sub: () => BUBBLE_STYLES.map((b) => ({ label: b.name, checked: b.id === v.bubbleStyle, action: () => updateVita({ bubbleStyle: b.id }) })) },
        {
          label: "Focus Highlight",
          sub: () =>
            (
              [
                ["vita", "Vita glow (soft)"],
                ["ring", "Ring"],
                ["none", "None (grow only)"],
              ] as const
            ).map(([id, name]) => ({ label: name, checked: v.focus === id, action: () => updateVita({ focus: id }) })),
        },
        { label: "Game Titles", sub: () => TITLE_MODES.map((m) => ({ label: m.name, checked: (s.titles.vita ?? "show") === m.id, action: () => updateSettings((p) => ({ titles: { ...p.titles, vita: m.id } })) })) },
        { label: "3D Bubbles", checked: v.motion, action: () => updateVita({ motion: !v.motion }) },
        { label: "Bubble Sway", sub: () => (["off", "gentle", "lively"] as const).map(sway => ({ label: sway === "off" ? "Off" : sway === "gentle" ? "Gentle" : "Lively", checked: v.sway === sway, action: () => updateVita({ sway }) })) },
        { label: "Gyro Sway", checked: v.gyro, action: () => updateVita({ gyro: !v.gyro }) },
        { label: "Touch Controls", checked: v.touch, action: () => updateVita({ touch: !v.touch }) },
      ],
    },
    { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
    { label: "Home Screen Settings", action: api.openSettings },
    { label: "Home", action: api.showSteamHome },
  ];

  const openOptions = () => {
    const it = curItem;
    const items: MenuItem[] = [];
    if (it?.kind === "game") {
      const g = it.game;
      items.push({ label: "Open LiveArea", action: () => openLive(g) });
      items.push({ label: "Start", action: () => startGame(g) });
      if (!g.shortcut) items.push({ label: "Watch Trailer", action: () => api.playTrailer(g) });
      items.push({
        label: "Add to Folder",
        sub: () => [...v.folders.map((f) => ({ label: f.name, checked: f.apps.includes(g.appid), action: () => addToFolder(f.id, g.appid) })), { label: "New Folder…", action: () => newFolder(g.appid) }],
      });
      if (v.folders.some((f) => f.apps.includes(g.appid))) items.push({ label: "Remove from Folder", action: () => removeFromFolder(g.appid) });
      items.push({ label: "Game Options", action: () => api.nativeMenu(g) });
    }
    if (it?.kind === "folder") {
      const f = it.folder;
      items.push({ label: "Open", action: () => enter(it) });
      items.push({ label: "Rename", action: () => renameFolder(f) });
      items.push({ label: "Colour", sub: () => FOLDER_COLORS.map((c, i) => ({ label: ["Blue", "Orange", "Green", "Pink", "Purple", "Mint", "Yellow", "Red"][i], checked: f.color === c, action: () => recolorFolder(f.id, c) })) });
      items.push({ label: "Delete Folder", action: () => deleteFolder(f.id) });
    }
    if (!openFolder && it) items.push({ label: "Rearrange", action: () => setMoving(list) });
    menu.open([...items, ...commonMenu()], it?.label);
  };

  const openLive = (g: Game) => {
    setLive({ game: g, focus: "start" });
    setClosing(false);
    playSound("open");
  };
  const closeLive = () => {
    if (closing) return;
    setClosing(true);
    playSound("back");
    setTimeout(() => {
      setLive(null);
      setClosing(false);
    }, 420);
  };
  const startGame = (g: Game) => {
    setLaunching(true);
    setTimeout(() => setLaunching(false), 700);
    api.launch(g);
  };
  const enter = (it: VItem) => {
    if (it.kind !== "folder" && it.kind !== "col") return;
    setOpenFolder(it.key);
    setFsel(0);
    playSound("open");
  };
  const activate = (it: VItem | undefined) => {
    if (!it) return;
    if (it.kind === "game") api.activate(it.game, () => openLive(it.game));
    else if (it.kind === "sys") {
      playSound("select");
      if (it.sys.place === "media") api.openMedia();
      else if (it.sys.place) openSteam(it.sys.place);
      else api.openSettings();
    } else enter(it);
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    // LiveArea
    if (live) {
      const f = live.focus;
      if (p.btn === "b") return closeLive(), true;
      if (p.btn === "a") {
        if (f === "start") startGame(live.game);
        else if (f === "page") api.details(live.game);
        else api.nativeMenu(live.game);
        return true;
      }
      if (p.btn === "menu") return api.nativeMenu(live.game), true;
      // Layout: [page][menu] on the left/bottom, [start] gate on the right.
      const NAV: Record<LiveBtn, Partial<Record<string, LiveBtn>>> = {
        start: { left: "page", down: "page" },
        page: { right: "menu", up: "start" },
        menu: { left: "page", right: "start", up: "start" },
      };
      const fixed = NAV[f][p.btn] ?? f;
      if (fixed !== f) {
        setLive({ ...live, focus: fixed });
        playSound("move");
      }
      return true;
    }
    // Rearranging
    if (moving) {
      if (p.btn === "a" || p.btn === "b") {
        saveOrder(moving);
        setMoving(null);
        playSound("select");
        return true;
      }
      if (p.btn === "up" || p.btn === "down" || p.btn === "left" || p.btn === "right") {
        let to = spatial(points, cur, p.btn);
        if (to < 0 && p.btn === "down" && cur < moving.length - 1) to = Math.min(moving.length - 1, (page + 1) * PER_PAGE);
        if (to < 0) return true;
        const arr = [...moving];
        const [it] = arr.splice(cur, 1);
        arr.splice(to, 0, it);
        setMoving(arr);
        setSel(to);
        playSound("move");
      }
      return true;
    }
    switch (p.btn) {
      case "up":
      case "down":
      case "left":
      case "right": {
        const to = spatial(points, cur, p.btn);
        if (to >= 0) {
          setCur(to);
          playSound(Math.floor(to / PER_PAGE) !== page ? "tab" : "move");
        }
        return true;
      }
      case "l1":
      case "r1": {
        const np = clamp(page + (p.btn === "l1" ? -1 : 1), 0, pages - 1);
        if (np !== page) {
          setCur(Math.min(view.length - 1, np * PER_PAGE));
          playSound("tab");
        }
        return true;
      }
      case "l2":
      case "r2":
        return false; // presets (handled globally)
      case "a":
        activate(curItem);
        return true;
      case "b":
        if (openFolder) {
          setOpenFolder(null);
          playSound("back");
          return true;
        }
        return false;
      case "y":
        openOptions();
        return true;
      case "menu":
        if (curItem?.kind === "game") api.nativeMenu(curItem.game);
        return true;
      case "x":
        if (curItem?.kind === "game") startGame(curItem.game);
        return true;
    }
    return false;
  };

  // ───── touch: tap a bubble to open it, swipe up/down for pages, hold to rearrange,
  // drag the LiveArea's top-right corner to peel it away ─────
  const [drag, setDrag] = useState(0);
  const [peel, setPeel] = useState(0);
  const touch = useRef<{ x: number; y: number; moved: boolean; corner: boolean; lp: any; long: boolean } | null>(null);
  const toLocal = (e: { clientX: number; clientY: number }) => {
    const r = tiltEl?.getBoundingClientRect();
    if (!r || !r.width) return { x: 0, y: 0 };
    return { x: ((e.clientX - r.left) * W) / r.width, y: ((e.clientY - r.top) * H) / r.height };
  };
  const hitBubble = (x: number, y: number) => {
    const base = page * PER_PAGE;
    for (let k = 0; k < PER_PAGE && base + k < view.length; k++) {
      const p = slotPos(k, W, H);
      if (Math.hypot(x - p.x, y - p.y) < D * 0.56) return base + k;
    }
    return -1;
  };
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const goPage = (np: number) => {
    np = clamp(np, 0, pages - 1);
    if (np !== page) {
      setCur(Math.min(view.length - 1, np * PER_PAGE));
      playSound("tab");
    }
  };
  /** Tap on the page dots column: a dot → its page, above/below → previous/next. */
  const dotTap = (p: { x: number; y: number }) => {
    if (pages <= 1 || p.x > 64 || live || moving) return false;
    const top = dotsTop(H);
    const i = Math.floor((p.y - top) / DOT_STEP);
    if (p.y < top - 4) goPage(page - 1);
    else if (i >= pages) goPage(page + 1);
    else goPage(i);
    return true;
  };
  const onPointerDown = (e: any) => {
    if (!v.touch || menu.isOpen) return;
    const p = toLocal(e);
    lastPos.current = p;
    const t = { ...p, moved: false, corner: !!live && p.x > W - 180 && p.y < 180, lp: null as any, long: false };
    touch.current = t;
    if (!live && !moving && !openFolder) {
      const hit = hitBubble(p.x, p.y);
      if (hit >= 0)
        t.lp = setTimeout(() => {
          t.long = true;
          setCurRaw(hit);
          setMoving(list);
          playSound("select");
        }, 600);
    }
  };
  const onPointerMove = (e: any) => {
    const t = touch.current;
    if (!t) return;
    const p = toLocal(e);
    lastPos.current = p;
    const dx = p.x - t.x;
    const dy = p.y - t.y;
    if (Math.hypot(dx, dy) > 14) {
      t.moved = true;
      clearTimeout(t.lp);
    }
    if (live) {
      if (t.corner) setPeel(clamp((-dx + dy) / 700, 0, 0.5));
      return;
    }
    if (!moving && Math.abs(dy) > Math.abs(dx)) setDrag(dy);
  };
  const onPointerUp = (e: any) => {
    const t = touch.current;
    touch.current = null;
    if (!t) return;
    clearTimeout(t.lp);
    const p = e ? toLocal(e) : lastPos.current ?? t;
    const dx = p.x - t.x;
    const dy = p.y - t.y;
    setDrag(0);
    if (live) {
      if (t.corner && (!t.moved || -dx + dy > 160)) closeLive();
      setPeel(0);
      return;
    }
    if (menu.isOpen || t.long) return;
    if (t.moved) {
      if (Math.abs(dy) > 60 && Math.abs(dy) > Math.abs(dx)) goPage(page + (dy < 0 ? 1 : -1));
      return;
    }
    if (dotTap(p)) return;
    const hit = hitBubble(p.x, p.y);
    if (moving) {
      if (hit >= 0 && hit !== cur) {
        const arr = [...moving];
        const [it] = arr.splice(cur, 1);
        arr.splice(hit, 0, it);
        setMoving(arr);
        setSel(hit);
        playSound("move");
      } else {
        saveOrder(moving);
        setMoving(null);
        playSound("select");
      }
      return;
    }
    if (hit >= 0) {
      setCurRaw(hit);
      activate(view[hit]);
    } else if (openFolder) {
      setOpenFolder(null);
      playSound("back");
    }
  };

  const renderPages = (arr: VItem[], selIdx: number, wobble: boolean) => {
    const pg = Math.floor(selIdx / PER_PAGE);
    const out: ReactElement[] = [];
    for (let i = Math.max(0, (pg - 1) * PER_PAGE); i < Math.min(arr.length, (pg + 2) * PER_PAGE); i++) {
      const it = arr[i];
      const pos = slotPos(i % PER_PAGE, W, H);
      const y = pos.y + (Math.floor(i / PER_PAGE) - pg) * H;
      const selected = i === selIdx;
      out.push(
        <div
          key={it.key}
          className={`dht-bubble dht-bubble--${it.kind}`}
          data-selected={selected}
          data-name={it.label}
          style={{ position: "absolute", left: pos.x - D / 2, top: y - D / 2, width: D, height: D, transition: "top 320ms cubic-bezier(.2,.8,.2,1), left 200ms", zIndex: selected ? 5 : 1 }}
        >
          <div style={{ animation: wobble ? `dhtWobble ${0.35 + (i % 3) * 0.05}s ease-in-out infinite` : "none" }}>
            {/* Vita-style focus: a soft light behind the selected bubble (no hard ring) */}
            {selected && v.focus === "vita" && !launching && (
              <div className="dht-bubble-focus" style={{ position: "absolute", left: -D * 0.2, top: -D * 0.2, width: D * 1.4, height: D * 1.4, borderRadius: "50%", background: "radial-gradient(circle, var(--dht-vita-halo, rgba(150,225,255,0.85)) 0%, rgba(120,210,255,0.35) 48%, rgba(120,210,255,0) 70%)", animation: "dhtGlow 2.2s ease-in-out infinite", pointerEvents: "none" }} />
            )}
            <div
              className="dht-bubble-icon"
              style={{
                transform: selected ? (v.focus === "none" ? "scale(1.05)" : "scale(1.09)") : "scale(1)",
                transition: "transform 180ms ease-out",
                borderRadius: "50%",
                animation: selected && launching ? "dhtLaunch 600ms ease-in forwards" : selected && v.focus === "ring" ? "dhtHalo 1.8s ease-in-out infinite" : "none",
              }}
            >
              <Bubble item={it} art={v.art} skin={skin} bs={v.bubbleStyle} mp={{ motion: v.motion && s.animations, sway: s.animations ? v.sway : "off", phase: (i * 2.3) % 9 }} />
            </div>
          </div>
          <div
            className="dht-bubble-label"
            style={{
              position: "absolute",
              top: D + 2,
              left: D / 2,
              transform: "translateX(-50%)",
              width: 300,
              textAlign: "center",
              color: "var(--dht-vita-label, #fff)",
              fontSize: 24,
              fontWeight: 500,
              lineHeight: 1.1,
              textShadow: "0 1px 2px rgba(0,0,0,0.85), 0 0 6px rgba(0,30,70,0.6)",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {it.kind === "col" ? "★ " : ""}
            {it.kind !== "game" || showTitle(s, "vita", selected) ? it.label : ""}
          </div>
        </div>,
      );
    }
    return out;
  };

  // Steam's UI can cancel a pointer stream to scroll the page under us, so raw
  // touch events drive the same gesture (and block that scrolling), and a
  // cancelled stroke still counts from the last finger position.
  const gesture = useRef<{ down: (e: any) => void; move: (e: any) => void; up: (e: any) => void; wheel?: (d: number) => void }>({ down: onPointerDown, move: onPointerMove, up: onPointerUp });
  gesture.current = { down: onPointerDown, move: onPointerMove, up: onPointerUp };
  const usingTouch = useRef(false);
  useEffect(() => {
    const el = tiltEl;
    if (!el) return;
    const pt = (ev: any) => ev.changedTouches?.[0] ?? ev.touches?.[0];
    const ts = (ev: any) => {
      usingTouch.current = true;
      const t = pt(ev);
      if (t) gesture.current.down(t);
    };
    const tm = (ev: any) => {
      if (ev.cancelable) ev.preventDefault();
      const t = pt(ev);
      if (t) gesture.current.move(t);
    };
    const te = (ev: any) => {
      const t = pt(ev);
      gesture.current.up(t ?? null);
      setTimeout(() => (usingTouch.current = false), 400);
    };
    let wheelAt = 0;
    const wh = (ev: any) => {
      const now = Date.now();
      if (Math.abs(ev.deltaY) < 8 || now - wheelAt < 350) return;
      wheelAt = now;
      gesture.current.wheel?.(ev.deltaY > 0 ? 1 : -1);
    };
    el.addEventListener("touchstart", ts, { passive: true });
    el.addEventListener("touchmove", tm, { passive: false });
    el.addEventListener("touchend", te);
    el.addEventListener("touchcancel", te);
    el.addEventListener("wheel", wh, { passive: true });
    return () => {
      el.removeEventListener("touchstart", ts);
      el.removeEventListener("touchmove", tm);
      el.removeEventListener("touchend", te);
      el.removeEventListener("touchcancel", te);
      el.removeEventListener("wheel", wh);
    };
  }, [tiltEl]);
  gesture.current.wheel = (d: number) => {
    if (!live && !moving && !menu.isOpen) goPage(page + d);
  };
  const swipeTarget = drag && Math.abs(drag) > 60 ? clamp(page + (drag < 0 ? 1 : -1), 0, pages - 1) : null;

  const hints = live ? { a: "Select", b: "Close" } : moving ? { a: "Done" } : { a: "Open", x: "Start", y: "Options", menu: "Options" };

  return (
    <ThemeRoot onInput={onInput} hints={hints}>
      <Stage>
       <div
        ref={setTiltEl}
        style={{ position: "absolute", inset: 0, touchAction: "none", userSelect: "none", WebkitUserSelect: "none" }}
        onPointerDown={(e) => e.pointerType === "touch" ? undefined : onPointerDown(e)}
        onPointerMove={(e) => e.pointerType === "touch" ? undefined : onPointerMove(e)}
        onPointerUp={(e) => e.pointerType === "touch" ? undefined : onPointerUp(e)}
        onPointerCancel={() => {
          // finish the stroke from where the finger last was (a cancelled swipe still turns the page)
          if (usingTouch.current) return; // the touch listeners finish touch strokes
          if (touch.current?.moved) onPointerUp(null);
          else {
            clearTimeout(touch.current?.lp);
            touch.current = null;
            setDrag(0);
            setPeel(0);
          }
        }}
       >
        <style>{VITA_CSS}</style>
        <BubbleDefs d={D} style={v.bubbleStyle} />
        <VitaBackground page={openFolder ? 0 : page} skin={skin} animate={s.animations} />
        <div style={{ position: "absolute", inset: 0, opacity: openFolder ? 0 : 1, transition: "opacity 200ms, transform 260ms ease-out", transform: !openFolder && drag ? `translateY(${drag * 0.55}px)` : undefined }}>
          {renderPages(list, openFolder ? clamp(sel, 0, list.length - 1) : cur, !!moving)}
        </div>
        {!openFolder && <PageDots page={page} pages={pages} target={swipeTarget} />}
        {openFolder && folderItem && (
          <div style={{ position: "absolute", inset: 0 }}>
            <div className="dht-folder-title" style={{ position: "absolute", left: "50%", top: 52, transform: "translateX(-50%)", padding: "4px 22px", borderRadius: 18, background: "rgba(0,20,50,0.45)", color: "#fff", fontSize: 24, fontWeight: 600, textShadow: "0 1px 4px rgba(0,0,0,0.6)", whiteSpace: "nowrap" }}>
              {folderItem.label} <span style={{ opacity: 0.7, fontSize: 18 }}>({folderList.length})</span>
            </div>
            <div style={{ position: "absolute", inset: 0, transition: "transform 260ms ease-out", transform: drag ? `translateY(${drag * 0.55}px)` : undefined }}>{renderPages(folderList, cur, false)}</div>
            <PageDots page={page} pages={pages} target={swipeTarget} />
            {folderList.length === 0 && <div style={{ position: "absolute", left: 0, right: 0, top: H / 2, textAlign: "center", color: "#fff", opacity: 0.8, fontSize: 20 }}>This folder is empty. Use △ → Add to Folder on a game.</div>}
          </div>
        )}
        {moving && <div style={{ position: "absolute", left: 0, right: 0, bottom: 60, textAlign: "center", color: "#fff", fontSize: 18, textShadow: "0 1px 4px #000" }}>Move the bubble with the D-pad or tap where it should go · Ⓐ or tap it to finish</div>}
        {live && (
          <LiveArea
            game={live.game}
            focus={live.focus}
            closing={closing}
            art={v.art}
            peel={peel}
            onTap={(b) => {
              setLive({ ...live, focus: b });
              if (b === "start") startGame(live.game);
              else if (b === "page") api.details(live.game);
              else api.nativeMenu(live.game);
            }}
          />
        )}
        <VitaStatus h24={s.clock24} color={skin?.barColor} />
        <MenuView menu={menu} variant="vita" />
       </div>
      </Stage>
    </ThemeRoot>
  );
}
