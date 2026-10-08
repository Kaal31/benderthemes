// Shared building blocks for the themes: images with fallbacks, a small
// original icon set, an in-theme options menu, and the shared home context.
import { createContext, CSSProperties, ReactNode, useContext, useEffect, useRef, useState } from "react";
import { Btn, Press } from "./input";
import { Game, Library, listCollectionsForSettings } from "./library";
import type { LocalVideo } from "./media";
import { playSound } from "./steam";
import { CaseArt, CASE_THEMES } from "./CaseArt";
import { getSettings, updateSettings, Settings, ThemeId } from "./settings";
import { applyPreset, currentPresetId, presetGroups } from "./presets";
import { openMarketplace } from "./marketplaceState";
import { deleteCurrentTheme } from "./themeActions";

// ───────────── home context ─────────────
export interface HomeApi {
  lib: Library;
  settings: Settings;
  /** Ⓐ on a game, honouring the user's "Ⓐ does" setting. `themeDefault` is the theme's own behaviour. */
  activate: (g: Game, themeDefault: () => void) => void;
  launch: (g: Game) => void;
  details: (g: Game) => void;
  nativeMenu: (g: Game, anchor?: EventTarget) => void;
  switchTheme: (id: ThemeId) => void;
  showSteamHome: () => void;
  openSettings: () => void;
  openMedia: (appid?: number, index?: number) => void; // screenshot gallery
  playTrailer: (g: Game) => void; // full-screen store trailer
  playVideo: (v: LocalVideo) => void; // a video stored on the Deck
  user: string;
  busy: boolean; // a full-screen overlay (gallery, player) is open
}
export const HomeCtx = createContext<HomeApi | null>(null);
export function useHome(): HomeApi {
  const h = useContext(HomeCtx);
  if (!h) throw new Error("useHome outside HomeCtx");
  return h;
}

// ───────────── images ─────────────
/** <img> that walks through candidate URLs until one loads; shows `fallback` when none do. */
export function Img({
  srcs,
  style,
  className,
  fallback,
  fit = "cover",
  position,
}: {
  srcs: string[];
  style?: CSSProperties;
  className?: string;
  fallback?: ReactNode;
  fit?: "cover" | "contain";
  position?: string;
}) {
  const [i, setI] = useState(0);
  const key = srcs.join("|");
  useEffect(() => setI(0), [key]);
  if (i >= srcs.length) return <>{fallback !== undefined ? fallback : <div className={className} style={{ ...style, background: "linear-gradient(135deg,#2a3346,#151b26)" }} />}</>;
  return (
    <img
      className={className}
      src={srcs[i]}
      draggable={false}
      onError={() => setI((x) => x + 1)}
      style={{ objectFit: fit, objectPosition: position, display: "block", ...style }}
    />
  );
}

/** Placeholder art: the game's initials on a colour derived from its name. */
export function NameArt({ name, style }: { name: string; style?: CSSProperties }) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % 360;
  const initials = name
    .replace(/[^A-Za-z0-9 ]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  return (
    <div
      style={{
        background: `linear-gradient(135deg, hsl(${h},55%,42%), hsl(${(h + 40) % 360},60%,22%))`,
        color: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: "2em",
        letterSpacing: 1,
        ...style,
      }}
    >
      {initials || "?"}
    </div>
  );
}

/** Game art of a kind, with a name placeholder when Steam has none. */
export function GameArt({
  g,
  kind,
  style,
  position,
  fit,
  flat = false,
  logoFallback = null,
}: {
  logoFallback?: ReactNode;
  flat?: boolean;
  g: Game;
  kind: keyof Game["art"];
  style?: CSSProperties;
  position?: string;
  fit?: "cover" | "contain";
}) {
  const home = useContext(HomeCtx);
  const srcs = kind === "landscape" ? [...g.art.landscape, ...g.art.portrait] : kind === "portrait" ? [...g.art.portrait, ...g.art.landscape] : g.art[kind];
  const casing = !flat && kind === "portrait" && home && CASE_THEMES.includes(home.settings.theme) && home.settings.coverStyles?.[home.settings.theme] === "case3d";
  const image = <Img srcs={srcs} style={casing ? {width:"100%",height:"100%"} : style} position={position} fit={fit} fallback={kind === "logo" ? logoFallback : <NameArt name={g.name} style={casing ? {width:"100%",height:"100%"} : style} />} />;
  return casing ? <CaseArt name={g.name} theme={home.settings.theme} style={style} motion={home.settings.animations}>{image}</CaseArt> : image;
}

// ───────────── icons (original, monochrome, 24×24 grid) ─────────────
export type IconName =
  | "gear"
  | "photo"
  | "music"
  | "video"
  | "game"
  | "globe"
  | "friends"
  | "user"
  | "power"
  | "folder"
  | "store"
  | "download"
  | "library"
  | "search"
  | "bell"
  | "trophy"
  | "palette"
  | "steam"
  | "home"
  | "apps"
  | "info"
  | "play"
  | "dots"
  | "card"
  | "disc"
  | "clock"
  | "sound"
  | "back"
  | "cloud"
  | "wifi"
  | "network"
  | "tv"
  | "psn";

const P: Record<IconName, ReactNode> = {
  psn:<><circle cx="12" cy="12" r="9" fill="none" strokeWidth="1.8"/><path d="M7 5l3 5H4zM14 5h5v5h-5zM5 14l5 5M5 19l5-5" fill="none" strokeWidth="1.4"/><circle cx="16.5" cy="16.5" r="2.5" fill="none" strokeWidth="1.4"/></>,
  network:<><circle cx="12" cy="12" r="9" fill="none" strokeWidth="1.5"/><path d="M12 3v18M3 12h18M5 6l14 12M5 18L19 6" fill="none" strokeWidth="1.2"/></>,
  tv:<><rect x="2" y="5" width="20" height="14" rx="2" fill="none" strokeWidth="1.8"/><path d="M8 22h8M9 1l3 4 3-4" fill="none" strokeWidth="1.5"/></>,
  cloud: <path d="M7 18.5h10.6a4.1 4.1 0 0 0 .5-8.15A6.1 6.1 0 0 0 6.4 9.1 4.7 4.7 0 0 0 7 18.5z" />,
  wifi: (
    <>
      <path d="M2.6 9.2a13.6 13.6 0 0 1 18.8 0M5.6 12.4a9.3 9.3 0 0 1 12.8 0M8.7 15.5a4.9 4.9 0 0 1 6.6 0" fill="none" strokeWidth="2.1" strokeLinecap="round" />
      <circle cx="12" cy="18.8" r="1.7" />
    </>
  ),
  gear: (
    <>
      <circle cx="12" cy="12" r="3.2" />
      <path d="M12 2.5l1.6 2.7 3.1-.7.7 3.1 2.7 1.6-1.6 2.8 1.6 2.8-2.7 1.6-.7 3.1-3.1-.7L12 21.5l-1.6-2.7-3.1.7-.7-3.1-2.7-1.6L5.5 12 3.9 9.2l2.7-1.6.7-3.1 3.1.7z" fill="none" strokeWidth="1.6" />
    </>
  ),
  photo: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" fill="none" strokeWidth="1.8" />
      <path d="M5 17l5-6 4 4 2-2 3 4z" />
      <circle cx="16.5" cy="9" r="1.6" />
    </>
  ),
  music: <path d="M9 17.5a2.5 2.5 0 11-2-2.45V5l11-2v12.5a2.5 2.5 0 11-2-2.45V7.3L9 8.6z" />,
  video: (
    <>
      <rect x="2.5" y="6" width="13" height="12" rx="2" />
      <path d="M16.5 10l5-3v10l-5-3z" />
    </>
  ),
  game: (
    <path d="M7 8h10a5 5 0 014.9 6l-.6 2.6a2.3 2.3 0 01-4 .9L15.5 15h-7l-1.8 2.5a2.3 2.3 0 01-4-.9L2.1 14A5 5 0 017 8zm0 2.2v1.6H5.4v1.4H7v1.6h1.4v-1.6H10v-1.4H8.4v-1.6zm9.6.4a1 1 0 100 2 1 1 0 000-2zm-2 2a1 1 0 100 2 1 1 0 000-2z" />
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" strokeWidth="1.7" />
      <path d="M3 12h18M12 3c3 3.2 3 14.8 0 18M12 3c-3 3.2-3 14.8 0 18" fill="none" strokeWidth="1.5" />
    </>
  ),
  friends: (
    <>
      <circle cx="8.5" cy="8" r="3.3" />
      <circle cx="16.5" cy="9" r="2.7" />
      <path d="M2.5 19c.5-3.6 3-5.6 6-5.6s5.5 2 6 5.6zM14.6 13.7c3.3-.6 6.2 1.2 6.9 5.3h-5.3c-.2-2-.8-3.8-1.6-5.3z" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20c.7-4.2 4-6.5 8-6.5s7.3 2.3 8 6.5z" />
    </>
  ),
  power: <path d="M11 3h2v9h-2zM7.1 5.6l1.4 1.5A6 6 0 1015.5 7l1.4-1.4A8 8 0 117.1 5.6z" />,
  folder: <path d="M3 6.5A1.5 1.5 0 014.5 5h5l2 2h8A1.5 1.5 0 0121 8.5v9a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 17.5z" />,
  store: <path d="M5 8h14l-1.2 11.2a1 1 0 01-1 .8H7.2a1 1 0 01-1-.8zm3.5 0a3.5 3.5 0 017 0h-1.8a1.7 1.7 0 00-3.4 0z" />,
  download: <path d="M11 3h2v9.2l3.3-3.3 1.4 1.4L12 16l-5.7-5.7 1.4-1.4 3.3 3.3zM4 18h16v2H4z" />,
  library: <path d="M4 4h3v16H4zm5 0h3v16H9zm5.2.6l2.9-.8 4.2 15.4-2.9.8z" />,
  search: <path d="M10 3a7 7 0 015.6 11.2l5 5-1.4 1.4-5-5A7 7 0 1110 3zm0 2a5 5 0 100 10 5 5 0 000-10z" />,
  bell: <path d="M12 3a6 6 0 016 6v4l2 3H4l2-3V9a6 6 0 016-6zm-2.5 15h5a2.5 2.5 0 01-5 0z" />,
  trophy: <path d="M7 3h10v2h3v2.5A4.5 4.5 0 0116.3 12 5 5 0 0113 14.9V17h3v3H8v-3h3v-2.1A5 5 0 017.7 12 4.5 4.5 0 014 7.5V5h3zm-1 4v.5A2.5 2.5 0 007.2 9.6 9 9 0 017 7zm12 0h-1a9 9 0 01-.2 2.6A2.5 2.5 0 0018 7.5z" />,
  palette: (
    <path d="M12 3a9 9 0 100 18c1.2 0 1.8-.8 1.8-1.7 0-1.2-1-1.5-1-2.6 0-1 .8-1.7 1.8-1.7H17a4 4 0 004-4C21 6.4 17 3 12 3zM7 13a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm2.5-4a1.5 1.5 0 110-3 1.5 1.5 0 010 3zm5 0a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
  ),
  steam: (
    <>
      <circle cx="12" cy="12" r="9" fill="none" strokeWidth="1.8" />
      <circle cx="15" cy="9.5" r="2.6" fill="none" strokeWidth="1.6" />
      <circle cx="9" cy="15" r="2" />
      <path d="M9 15l6-5.5" strokeWidth="1.6" fill="none" />
    </>
  ),
  home: <path d="M12 3l9 8h-2.5v9h-5v-6h-3v6h-5v-9H3z" />,
  apps: <path d="M4 4h7v7H4zm9 0h7v7h-7zM4 13h7v7H4zm9 0h7v7h-7z" />,
  info: <path d="M12 2.5a9.5 9.5 0 110 19 9.5 9.5 0 010-19zM11 10.5v7h2v-7zm1-4a1.3 1.3 0 100 2.6 1.3 1.3 0 000-2.6z" />,
  play: <path d="M7 4l13 8-13 8z" />,
  dots: (
    <>
      <circle cx="5" cy="12" r="2" />
      <circle cx="12" cy="12" r="2" />
      <circle cx="19" cy="12" r="2" />
    </>
  ),
  card: (
    <>
      <path d="M5 2h11l3 3v17H5z" />
      <path d="M8 16h2v4H8zm3 0h2v4h-2zm3 0h2v4h-2z" fill="#000" fillOpacity=".35" />
    </>
  ),
  disc: (
    <>
      <circle cx="12" cy="12" r="9.5" />
      <circle cx="12" cy="12" r="2.4" fill="#000" fillOpacity=".5" />
    </>
  ),
  clock: <path d="M12 2.5a9.5 9.5 0 110 19 9.5 9.5 0 010-19zm-1 4.5v6l4.6 2.8 1-1.6-3.6-2.2V7z" />,
  sound: <path d="M3 9h4l5-4v14l-5-4H3zm12.5-1.5a6 6 0 010 9l-1.4-1.4a4 4 0 000-6.2zM18 5a9.5 9.5 0 010 14l-1.4-1.4a7.5 7.5 0 000-11.2z" />,
  back: <path d="M10 5l-7 7 7 7 1.4-1.4L6.8 13H21v-2H6.8l4.6-4.6z" />,
};

export function Icon({ name, size = 24, color = "currentColor", style }: { name: IconName; size?: number; color?: string; style?: CSSProperties }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} stroke={color} strokeWidth={0} style={{ display: "block", ...style }}>
      {P[name]}
    </svg>
  );
}

/** Battery glyph used by several status bars. */
export function BatteryGlyph({ level, charging, color = "#fff", w = 30 }: { level: number; charging?: boolean; color?: string; w?: number }) {
  const h = w * 0.5;
  const fill = Math.max(0.06, Math.min(1, level));
  return (
    <svg width={w + 3} height={h} viewBox={`0 0 ${w + 3} ${h}`} style={{ display: "block" }}>
      <rect x="1" y="1" width={w - 2} height={h - 2} rx="2.5" fill="none" stroke={color} strokeWidth="1.6" />
      <rect x={w - 0.5} y={h * 0.3} width="3" height={h * 0.4} rx="1" fill={color} />
      <rect x="3.5" y="3.5" width={(w - 7) * fill} height={h - 7} rx="1.2" fill={fill < 0.2 && !charging ? "#ff5a4a" : color} />
      {charging && <path d={`M${w * 0.52} ${h * 0.15}l-${w * 0.14} ${h * 0.4}h${w * 0.1}l-${w * 0.04} ${h * 0.32}l${w * 0.16}-${h * 0.44}h-${w * 0.1}z`} fill="#000" fillOpacity=".7" />}
    </svg>
  );
}

// ───────────── in-theme options menu ─────────────
export interface MenuItem {
  label: string;
  action?: () => void; // runs and closes the menu
  sub?: () => MenuItem[]; // opens a nested menu
  checked?: boolean;
  disabled?: boolean;
  keepOpen?: boolean; // run action without closing
}
export interface MenuLevel {
  title?: string;
  items: MenuItem[];
  sel: number;
}

export function collectionMenu(theme: ThemeId): MenuItem {
    const choice = () => getSettings().themeCollections?.[theme] ?? { source: getSettings().source };
    const choose = (source: string, ids?: string[]) => updateSettings(s => ({ themeCollections: { ...s.themeCollections, [theme]: { source, ids } } }));
    return { label: "Collections", sub: () => {
      const collections = listCollectionsForSettings();
      return [
        { label: "Installed games", checked: choice().source === "installed", action: () => choose("installed") },
        { label: "All games", checked: choice().source === "all", action: () => choose("all") },
        ...collections.map(c => ({ label: `${c.name} (${c.count})`, checked: choice().source === `col:${c.id}`, action: () => choose(`col:${c.id}`) })),
        { label: "Choose multiple collections", disabled: !collections.length, sub: () => [
          ...collections.map(c => ({ label: c.name, get checked() { return choice().source === "collections" && !!choice().ids?.includes(c.id); }, keepOpen: true, action: () => {
            const current = choice();
            const ids = current.source === "collections" ? current.ids ?? [] : current.source.startsWith("col:") ? [current.source.slice(4)] : [];
            choose("collections", ids.includes(c.id) ? ids.filter(id => id !== c.id) : [...ids, c.id]);
          } })),
          { label: "Done", action: () => {} },
        ] },
        ...(!collections.length ? [{ label: "Create collections in your Steam Library", disabled: true }] : []),
      ];
    } };
}

/** State machine for the theme's own options menu (△ / Y). Each theme draws it in its own style. */
export function useMenu() {
  const [stack, setStack] = useState<MenuLevel[]>([]);
  const ref = useRef(stack);
  ref.current = stack;
  const open = (items: MenuItem[], title?: string) => {
    const theme = getSettings().theme;
    items = [...items, { label: "Icon size", sub: () => [75, 85, 100, 110].map(size => ({ label: `${size}%${size === 100 ? " · Default" : ""}`, checked: (getSettings().iconSizes?.[theme] ?? 100) === size, action: () => updateSettings(s => ({ iconSizes: { ...s.iconSizes, [theme]: size } })) })) }];
    items = [...items, collectionMenu(theme)];
    if (!items.some(item => item.label === "Hub")) items = [...items, { label: "Hub", action: () => openMarketplace() }];
    if (!items.some(item => item.label === "Delete theme")) items = [...items, { label: "Delete theme", sub: () => [{ label: "Delete resources and return to Steam Home", action: deleteCurrentTheme }, { label: "Keep theme", action: () => {} }] }];
    const settings=getSettings();
    if(CASE_THEMES.includes(settings.theme) && items.some(i=>/Presets|Home Screen Settings/.test(i.label)) && !items.some(i=>i.label==="Cover style")) items=[...items,{label:"Cover style",sub:()=>["flat","case3d"].map(mode=>({label:mode==="flat"?"Flat":"3D case",checked:(getSettings().coverStyles?.[settings.theme]??"flat")===mode,action:()=>updateSettings(s=>({coverStyles:{...s.coverStyles,[settings.theme]:mode as "flat"|"case3d"}}))}))}];
    if(items.some(i=>/Presets|Home Screen Settings/.test(i.label)))items=[...items,{label:"Background music · all themes",sub:()=>[{label:"On",checked:getSettings().backgroundMusic!==false,action:()=>updateSettings({backgroundMusic:true})},{label:"Off",checked:getSettings().backgroundMusic===false,action:()=>updateSettings({backgroundMusic:false})}]}];
    const first = Math.max(0, items.findIndex((i) => !i.disabled));
    setStack([{ items, title, sel: first }]);
    playSound("menu");
  };
  const close = () => {
    setStack([]);
  };
  const handle = (p: Press): boolean => {
    const st = ref.current;
    if (!st.length) return false;
    const top = st[st.length - 1];
    const n = top.items.length;
    const move = (d: number) => {
      let i = top.sel;
      for (let k = 0; k < n; k++) {
        i = (i + d + n) % n;
        if (!top.items[i].disabled) break;
      }
      if (i !== top.sel) playSound("move");
      setStack([...st.slice(0, -1), { ...top, sel: i }]);
    };
    const b: Btn = p.btn;
    if (b === "up") move(-1);
    else if (b === "down") move(1);
    else if (b === "a" || (b === "right" && top.items[top.sel]?.sub)) {
      const it = top.items[top.sel];
      if (!it || it.disabled) return true;
      if (it.sub) {
        const items = it.sub();
        setStack([...st, { title: it.label, items, sel: Math.max(0, items.findIndex((x) => x.checked)) }]);
        playSound("select");
      } else {
        playSound("select");
        if (!it.keepOpen) setStack([]);
        it.action?.();
      }
    } else if (b === "b" || b === "y" || b === "left") {
      if (b === "left" && st.length === 1) return true;
      setStack(st.slice(0, -1));
      playSound("close");
    }
    return true; // an open menu swallows everything
  };
  /** Touch: tap an item = select + activate it. */
  const clickItem = (i: number) => {
    const st = ref.current;
    if (!st.length) return;
    const top = st[st.length - 1];
    setStack([...st.slice(0, -1), { ...top, sel: i }]);
    ref.current = [...st.slice(0, -1), { ...top, sel: i }];
    handle({ btn: "a", repeat: false });
  };
  return { stack, isOpen: stack.length > 0, open, close, handle, clickItem };
}
export type MenuState = ReturnType<typeof useMenu>;

/** Generic renderer; themes pass their own colours/placement. */
export function MenuView({
  menu,
  variant,
}: {
  menu: MenuState;
  variant: "xmb" | ThemeId;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const selected = menu.stack[menu.stack.length - 1]?.sel;
  useEffect(() => { panel.current?.querySelector("[data-selected=true]")?.scrollIntoView({block:"nearest"}); }, [selected, menu.stack.length]);
  const [retained,setRetained]=useState<MenuLevel|undefined>();
  const liveTop=menu.stack[menu.stack.length-1];
  useEffect(()=>{
    if(variant!=="castle")return;
    if(liveTop)setRetained(liveTop);
    const node=panel.current;if(!node)return;
    const disabled=!getSettings().animations||window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if(disabled&&!menu.isOpen){setRetained(undefined);return;}
    const closed={opacity:0,transform:"translate(-50%,-50%) rotateX(-90deg)"};
    const opened={opacity:1,transform:"translate(-50%,-50%) rotateX(0deg)"};
    const motion=node.animate(menu.isOpen?[closed,opened]:[opened,closed],{duration:disabled?0:250,easing:"ease",fill:"forwards"});
    motion.onfinish=()=>{if(!menu.isOpen)setRetained(undefined);};
    return()=>motion.cancel();
  },[menu.isOpen,variant,liveTop?.title]);
  if (!menu.isOpen && !(variant==="castle"&&retained)) return null;
  const top = liveTop ?? retained!;
  const styles: Record<string, { panel: CSSProperties; item: (sel: boolean, dis?: boolean) => CSSProperties; title?: CSSProperties }> = {
    minecraft: {
      panel:{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",width:490,padding:14,background:"#2b2d30",border:"4px solid #121316",boxShadow:"inset 2px 2px #777,0 0 0 2px #606266",fontFamily:"BlockWorlds,monospace"},
      item:(s,d)=>({fontSize:22,color:d?"#888":"#eee",padding:"16px 20px",marginBottom:6,border:"2px solid #141619",background:s?"#356f1b":"#35373b",boxShadow:s?"inset 0 0 0 2px #b6f597":"inset 1px 1px #777",textShadow:"2px 2px #171917"}),
      title:{fontSize:25,padding:"10px 20px 20px",color:"#eee"}
    },
    xmb: {
      panel: { position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: 480, background: "linear-gradient(90deg, rgba(24,24,24,0.96), rgba(8,8,8,0.97))", padding: "22px 12px", display: "flex", flexDirection: "column", gap: 6, border: "1px solid rgba(255,255,255,0.24)", boxShadow:"0 18px 70px #0008" },
      item: (s, d) => ({ color: d ? "#777" : "#fff", fontSize: 22, padding: "8px 16px", textShadow: s ? "0 0 12px rgba(255,255,255,0.9)" : "none", opacity: s ? 1 : 0.75, background: s ? "linear-gradient(90deg, rgba(255,255,255,0.18), rgba(255,255,255,0))" : "none" }),
      title: { color: "#bbb", fontSize: 16, padding: "0 16px 8px" },
    },
    vita: {
      panel: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", minWidth: 420, background: "rgba(245,248,252,0.96)", borderRadius: 18, padding: "14px 0", boxShadow: "0 18px 60px rgba(0,0,0,0.55)" },
      item: (s, d) => ({ color: d ? "#aab" : "#1c2433", fontSize: 22, padding: "12px 28px", background: s ? "linear-gradient(90deg,#3fa9f5,#1f7fe0)" : "none", ...(s ? { color: "#fff" } : {}) }),
      title: { color: "#5a6475", fontSize: 16, padding: "4px 28px 10px", borderBottom: "1px solid #dde3ea", marginBottom: 6 },
    },
    ps4: {
      panel: { position: "absolute", top: 0, right: 0, bottom: 0, width: 420, background: "rgba(10,20,40,0.92)", padding: "90px 0 0", boxShadow: "-10px 0 40px rgba(0,0,0,0.5)" },
      item: (s, d) => ({ color: d ? "#6a7488" : "#fff", fontSize: 21, padding: "14px 36px", background: s ? "rgba(255,255,255,0.14)" : "none", borderLeft: s ? "4px solid #2d9cff" : "4px solid transparent" }),
      title: { color: "#9fb0cc", fontSize: 16, padding: "0 36px 14px" },
    },
    ps5: {
      panel: { position: "absolute", right: 60, bottom: 90, minWidth: 380, background: "rgba(30,32,38,0.96)", borderRadius: 16, padding: "10px 0", boxShadow: "0 20px 60px rgba(0,0,0,0.6)" },
      item: (s, d) => ({ color: d ? "#666" : s ? "#000" : "#eee", fontSize: 21, padding: "13px 26px", margin: "0 8px", borderRadius: 10, background: s ? "#fff" : "none" }),
      title: { color: "#999", fontSize: 15, padding: "6px 26px 8px" },
    },
    x360: {
      panel: { position: "absolute", left: 0, right: 0, top: "50%", transform: "translateY(-50%)", background: "rgba(20,20,20,0.95)", padding: "26px 0 26px 25%" },
      item: (s, d) => ({ color: d ? "#666" : "#fff", fontSize: 24, padding: "8px 20px", width: 520, background: s ? "#107c10" : "none" }),
      title: { color: "#9bd49b", fontSize: 30, fontWeight: 300, padding: "0 20px 12px" },
    },
    aero: {
      panel: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", minWidth: 440, background: "linear-gradient(180deg, #63bbff 0%, #1f76e8 40%, #0d4cbd 100%)", border: "3px solid #a3e22c", borderRadius: 30, padding: "14px 10px", boxShadow: "0 20px 60px rgba(0,30,90,0.6), inset 0 2px 0 rgba(255,255,255,0.6)" },
      item: (s, d) => ({ color: d ? "rgba(255,255,255,0.45)" : s ? "#123d06" : "#fff", fontSize: 21, fontWeight: 700, padding: "11px 26px", borderRadius: 22, background: s ? "linear-gradient(180deg, #f6ffb0 0%, #a3e22c 50%, #57a60f 100%)" : "none", textShadow: s ? "none" : "0 1px 2px rgba(0,30,90,0.55)" }),
      title: { color: "#e6f4ff", fontSize: 18, fontWeight: 800, fontStyle: "italic", padding: "2px 26px 10px" },
    },
    xbox: {
      panel: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", minWidth: 440, background: "linear-gradient(180deg, rgba(20,48,8,0.96), rgba(6,20,3,0.97))", border: "2px solid rgba(170,255,80,0.75)", borderRadius: 14, padding: "12px 10px", boxShadow: "0 0 40px rgba(120,255,40,0.35), inset 0 0 30px rgba(120,255,40,0.12)" },
      item: (s, d) => ({ color: d ? "rgba(180,240,120,0.4)" : s ? "#102e05" : "#c6ff6a", fontSize: 21, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", padding: "10px 24px", borderRadius: 8, background: s ? "linear-gradient(180deg, #e2ff8a, #8fe024 55%, #4f9e10)" : "none", textShadow: s ? "none" : "0 0 8px rgba(150,255,60,0.6)" }),
      title: { color: "#9fe050", fontSize: 15, letterSpacing: 2, textTransform: "uppercase", padding: "2px 24px 10px" },
    },
    nazarick: {
      panel:{position:"absolute",right:70,bottom:80,minWidth:410,padding:16,background:"#090610f5",border:"1px solid #b3975f",boxShadow:"0 0 0 4px #09061088,0 0 32px #7338aa55"},
      item:(on,disabled)=>({fontFamily:"Georgia,serif",fontSize:22,padding:"13px 24px",color:disabled?"#736778":"#e0d3e8",background:on?"linear-gradient(90deg,#72339499,#1a0d28)":"transparent",boxShadow:on?"inset 0 0 0 1px #b18b56":"none"}),
      title:{fontFamily:"Georgia,serif",color:"#c6a96d",fontSize:20,letterSpacing:2,padding:"8px 24px 16px"},
    },
    pain: {
      panel:{position:"absolute",right:75,bottom:95,minWidth:380,padding:"14px 10px",background:"#100a1bec",border:"1px solid #9b64c9",borderRadius:22,boxShadow:"0 0 30px #8c42c944"},
      item:(on,disabled)=>({color:disabled?"#74617e":"#e2c3fa",fontSize:21,padding:"13px 22px",borderRadius:14,background:on?"linear-gradient(90deg,#7136a477,#29183d44)":"transparent",boxShadow:on?"inset 0 0 0 1px #a36dde":"none"}),
      title:{color:"#b68ad9",fontSize:16,letterSpacing:2,padding:"8px 22px 14px"},
    },
    dial: {
      panel: { position: "absolute", right: 60, bottom: 90, minWidth: 380, background: "rgba(10,12,12,0.95)", border: "1px solid rgba(120,255,60,0.55)", borderRadius: 16, padding: "10px 8px", boxShadow: "0 0 30px rgba(80,255,40,0.25), 0 20px 50px rgba(0,0,0,0.7)" },
      item: (s, d) => ({ color: d ? "#555" : s ? "#061402" : "#e8f5e0", fontSize: 20, fontWeight: 600, padding: "12px 22px", borderRadius: 10, background: s ? "linear-gradient(180deg, #b8ff5a, #4fd60f)" : "none" }),
      title: { color: "#7fe040", fontSize: 14, padding: "6px 22px 8px" },
    },
    ps2: {
      panel: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", minWidth: 420, background: "rgba(4,10,40,0.92)", border: "1px solid #3d5bd8", padding: "16px 0", boxShadow: "0 0 40px rgba(60,100,255,0.4)" },
      item: (s, d) => ({ color: d ? "#555b80" : s ? "#fff" : "#9fb2ff", fontSize: 22, padding: "10px 30px", textShadow: s ? "0 0 10px #6f8cff" : "none", background: s ? "linear-gradient(90deg, rgba(80,110,255,0.35), rgba(80,110,255,0))" : "none" }),
      title: { color: "#c8d2ff", fontSize: 18, padding: "0 30px 10px" },
    },
  };
  styles.aero2 = styles.aero;
  const cinematic = variant === "castle" || variant === "republic";
  const st = cinematic ? {panel:{position:"absolute",left:"50%",top:"50%",transform:"translate(-50%,-50%)",minWidth:420,padding:18,background:variant==="castle"?"#eff8ffff":"#071019f5",border:"1px solid #e5c470",boxShadow:"0 15px 70px #0009"} as CSSProperties,item:(on:boolean)=>({fontSize:22,padding:"12px 22px",color:on?"#302400":variant==="castle"?"#30455c":"#e8d7af",background:on?"linear-gradient(100deg,#ffe579,#d4b157)":"transparent"}),title:{padding:12,fontSize:20,color:variant==="castle"?"#30455c":"#e8d7af"}} : styles[variant];
  return (
    <div className="dht-menu-backdrop" aria-hidden={!menu.isOpen} onClick={(e) => e.target === e.currentTarget && menu.handle({ btn: "b", repeat: false })} style={{ position: "absolute", inset: 0, zIndex: 50, pointerEvents:menu.isOpen?"auto":"none", background: variant === "xmb" ? "transparent" : "rgba(0,0,0,0.25)" }}>
      <div className={`dht-menu dht-menu--${variant}`} ref={panel} style={{...st.panel, maxHeight:variant==="ps4"?"100%":"82%", overflowY:"auto", boxSizing:"border-box", justifyContent:"flex-start"}}>
        {top.title && <div style={st.title}>{top.title}</div>}
        {top.items.map((it, i) => (
          <div key={i} className="dht-menu-item" data-selected={i === top.sel} onClick={() => menu.clickItem(i)} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, ...st.item(i === top.sel, it.disabled) }}>
            <span>{it.label}</span>
            <span style={{ opacity: 0.8 }}>{it.checked ? "✓" : it.sub ? "›" : ""}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Interval-driven animation clock (seconds), paused when `on` is false. */
export function useTicker(on: boolean, fps = 30): number {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!on) return;
    const start = Date.now() - t * 1000;
    const iv = setInterval(() => setT((Date.now() - start) / 1000), 1000 / fps);
    return () => clearInterval(iv);
  }, [on, fps]);
  return t;
}

/** Remember the last value of a selection across remounts (e.g. coming back from a game page). */
const memory = new Map<string, any>();
export function useRemembered<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [v, setV] = useState<T>(() => (memory.has(key) ? memory.get(key) : initial));
  const set = (x: T | ((p: T) => T)) =>
    setV((prev) => {
      const nv = typeof x === "function" ? (x as (p: T) => T)(prev) : x;
      memory.set(key, nv);
      return nv;
    });
  return [v, set];
}

/** Preset switch sub-menu (console + skin), shared by every theme's △ menu. */
export function themeMenu(_current?: ThemeId, _switch?: (id: ThemeId) => void, _list?: unknown): MenuItem[] {
  const cur = currentPresetId();
  return presetGroups().map(group => ({ label: group.name, checked: group.presets.some(p=>p.id===cur), sub: () => group.presets.map(p=>({label:p.label, checked:p.id===cur, action:()=> (playSound("tab"),applyPreset(p))})) }));
}
