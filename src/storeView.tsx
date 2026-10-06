import {castleWindowAppearance,useCastleWindow} from "./themes/castleWindow";
// The themed store: Steam Store content (featured, specials, top sellers, new,
// coming soon, search) shown in the style of the current home theme —
// "PlayStation Store" on the PlayStation themes, "Marketplace" on the Xbox
// ones. Item pages show price, details, screenshots and the trailer; buying
// happens on Steam's own store page ("View in Steam Store").
import { Navigation } from "@decky/ui";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { Press, setModalInput, Stage, useStage } from "./input";
import { Game, Library } from "./library";
import { fmtPrice, loadStoreDetails, loadStoreLists, searchStore, STORE_TABS, StoreDetails, StoreItem, StoreTab } from "./store";
import { TrailerVideo } from "./media";
import { playSound } from "./steam";
import { Settings } from "./settings";
import { useAssets } from "./assets";

// ───────────── per-theme look ─────────────
interface Skin {
  title: string;
  layout: "grid" | "list";
  bg: string;
  panel: string;
  text: string;
  sub: string;
  accent: string; // highlight colour
  accentText: string; // text on the highlight
  radius: number;
  upper?: boolean;
  font?: string;
  ring: (on: boolean) => CSSProperties; // focus look of tiles / rows
  sale: string; // discount badge colour
  tabText?: string; // unselected tab text (defaults to sub)
  icon?: string; // asset key for the title icon
}
const ring = (c: string, glow = "") => (on: boolean): CSSProperties => (on ? { boxShadow: `0 0 0 3px ${c}${glow ? `, ${glow}` : ""}`, transform: "scale(1.04)" } : {});
export function storeSkin(s: Settings): Skin {
  const t = s.theme;
  const ps = { title: "PlayStation Store", sale: "#f5c518" };
  switch (t) {
    case "castle": return {title:"Store",sale:"#e0ad14",layout:"grid",bg:"transparent",font:"Cardinal,sans-serif",panel:"#ffffffcc",text:"#304b64",sub:"#617d94",accent:"#ffdb36",accentText:"#253953",radius:3,ring:ring("#ffe470")};
    case "republic": return {title:"Republic Exchange",sale:"#d6b65b",layout:"grid",bg:"linear-gradient(140deg,#07101a,#152735)",panel:"#0c1824ee",text:"#d8e9f3",sub:"#b7a87e",accent:"#d9bb69",accentText:"#17150e",radius:3,ring:ring("#fce296")};
    case "ps5":
      return { ...ps, layout: "grid", bg: "radial-gradient(ellipse at 75% 0%, #26449a 0%, #0c1534 50%, #05070f 100%)", panel: "#152043", text: "#fff", sub: "#a9b4cc", accent: "#fff", accentText: "#000", radius: 14, ring: ring("#fff", "0 12px 30px rgba(0,0,0,.6)") };
    case "ps4":
      return { ...ps, layout: "grid", bg: "linear-gradient(160deg, #0d58c2 0%, #073278 55%, #03173d 100%)", panel: "rgba(0,20,60,0.55)", text: "#fff", sub: "#b9cdf0", accent: "#fff", accentText: "#0a2e6e", radius: 4, ring: ring("#fff") };
    case "ps3":
    case "psp":
      return { ...ps, layout: "list", bg: "radial-gradient(ellipse at 30% 10%, #2a5ea8 0%, #0e2a5c 45%, #050f24 100%)", panel: "rgba(255,255,255,0.06)", text: "#fff", sub: "#b8c9e6", accent: "rgba(255,255,255,0.18)", accentText: "#fff", radius: 2, ring: (on) => (on ? { background: "linear-gradient(90deg, rgba(255,255,255,0.22), rgba(255,255,255,0.02))", boxShadow: "0 0 18px rgba(140,190,255,0.35)" } : {}), icon: "store" };
    case "vita":
      return { ...ps, title: "PS Store", tabText: "#dcecff", layout: "list", bg: "linear-gradient(180deg, #1a86ef 0%, #0b5ccc 55%, #0a3f94 100%)", panel: "rgba(255,255,255,0.92)", text: "#10243f", sub: "#4a5f7d", accent: "#fff", accentText: "#0b4fb0", radius: 18, ring: ring("#7fd4ff", "0 0 24px rgba(120,210,255,.9)") };
    case "ps2":
      return { title: "Online Store", sale: "#ff4fa0", layout: "list", bg: "radial-gradient(ellipse at 50% 40%, #0b1f5a 0%, #030a24 60%, #000 100%)", panel: "rgba(40,70,200,0.12)", text: "#cfd9ff", sub: "#7f93d9", accent: "rgba(80,120,255,0.35)", accentText: "#fff", radius: 0, ring: (on) => (on ? { background: "linear-gradient(90deg, rgba(80,110,255,0.45), rgba(80,110,255,0))", textShadow: "0 0 10px #8fa6ff" } : {}) };
    case "xbox":
      return { title: "MARKETPLACE", sale: "#ffd400", layout: "grid", upper: true, bg: "radial-gradient(ellipse at 30% 40%, #1f5a0a 0%, #0b2604 45%, #020500 100%)", panel: "linear-gradient(180deg, rgba(60,130,18,0.55), rgba(14,48,5,0.85))", text: "#c6ff6a", sub: "#8fd34a", accent: "#b6f25a", accentText: "#0f2c04", radius: 14, ring: ring("#e6ff8a", "0 0 26px rgba(170,255,60,.8)") };
    case "x360": {
      const st = s.x360?.style ?? "metro";
      if (st === "blades") return { title: "Marketplace", sale: "#2b8a1e", layout: "list", bg: "radial-gradient(ellipse at 70% 30%, #ffffff 0%, #ffb36a 40%, #e46c0a 100%)", panel: "rgba(255,255,255,0.85)", text: "#2a1a08", sub: "#7a4a1a", accent: "#fff", accentText: "#e46c0a", radius: 10, ring: ring("#e46c0a", "0 6px 16px rgba(0,0,0,.3)") };
      if (st === "kinect") return { title: "Marketplace", sale: "#5dc21e", layout: "grid", bg: "radial-gradient(ellipse at 60% 30%, #ffffff 0%, #eef0ec 45%, #d6dad3 100%)", panel: "#fff", text: "#333", sub: "#777", accent: "#5dc21e", accentText: "#fff", radius: 4, ring: ring("#5dc21e", "0 10px 24px rgba(0,0,0,.2)") };
      if (st === "nxe") return { title: "Marketplace", sale: "#8ee03a", layout: "grid", bg: "radial-gradient(ellipse at 60% 20%, #4a5266 0%, #262a35 45%, #0f1116 100%)", panel: "linear-gradient(180deg, #3a3f4c, #20232b)", text: "#fff", sub: "#a7adbb", accent: "#8ee03a", accentText: "#10200a", radius: 10, ring: ring("#8ee03a", "0 14px 30px rgba(0,0,0,.6)") };
      return { title: "Store", sale: "#107c10", layout: "grid", bg: "linear-gradient(180deg, #f2f2f2, #dcdcdc)", panel: "#fff", text: "#222", sub: "#666", accent: "#107c10", accentText: "#fff", radius: 0, font: '"Segoe UI", "Motiva Sans", sans-serif', ring: ring("#107c10") };
    }
    case "aero":
      return { title: "Steam Store", sale: "#ff8a00", layout: "grid", bg: "linear-gradient(180deg, #4aa8ff 0%, #1d6ae0 45%, #0c40b0 100%)", panel: "linear-gradient(180deg, rgba(255,255,255,0.35), rgba(255,255,255,0.12))", text: "#fff", sub: "#dcefff", accent: "linear-gradient(180deg, #f4ffb0, #b6ee3c 40%, #5aa812)", accentText: "#123d06", radius: 18, ring: ring("#eaff7a", "0 0 20px rgba(200,255,80,.85)") };
    case "dial":
      return { title: "Store", sale: "#6bff2a", layout: "grid", bg: "radial-gradient(ellipse at 40% 30%, #1a1f1c 0%, #0a0c0b 60%, #020303 100%)", panel: "#121614", text: "#eef3ef", sub: "#9aa59c", accent: "#6bff2a", accentText: "#061402", radius: 10, ring: ring("#6bff2a", "0 0 24px rgba(107,255,42,.6)") };
    default:
      return { title: "Steam Store", sale: "#4c6b22", layout: "grid", bg: "linear-gradient(180deg, #1b2838, #0e141b)", panel: "#2a3f5a", text: "#fff", sub: "#9fb3c8", accent: "#66c0f4", accentText: "#0e141b", radius: 6, ring: ring("#66c0f4") };
  }
}

// ───────────── helpers ─────────────
function openStorePage(id: number) {
  try {
    Navigation.NavigateToSteamWeb(`https://store.steampowered.com/app/${id}/`);
  } catch {
    /* ignore */
  }
}
const Price = ({ it, skin, big }: { it: { price?: number; original?: number; discount?: number; currency?: string; free?: boolean; soon?: boolean }; skin: Skin; big?: boolean }) => {
  if (it.soon) return <span style={{ fontSize: big ? 18 : 14, color: skin.sub }}>Coming soon</span>;
  if (it.price === undefined) return null;
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: big ? 20 : 15 }}>
      {!!it.discount && <span style={{ padding: "1px 7px", borderRadius: 4, background: skin.sale, color: "#000", fontWeight: 800, fontSize: big ? 16 : 13 }}>-{it.discount}%</span>}
      {!!it.discount && it.original !== undefined && <span style={{ textDecoration: "line-through", opacity: 0.6 }}>{fmtPrice(it.original, it.currency)}</span>}
      <span style={{ fontWeight: 700 }}>{it.free ? "Free" : fmtPrice(it.price, it.currency)}</span>
    </span>
  );
};

// ───────────── the overlay ─────────────
type Zone = "tabs" | "items" | "detail" | "trailer";

export function StoreView({ settings, lib, onClose, onLaunch }: { settings: Settings; lib: Library; onClose: () => void; onLaunch: (g: Game) => void }) {
  const skin = storeSkin(settings);
  const castleWindow=useCastleWindow(settings,onClose);
  const close=castleWindow.close;
  const icons = useAssets("xmb-ps3");
  const [lists, setLists] = useState<Record<string, StoreItem[]> | null>(null);
  const [failed, setFailed] = useState(false);
  const [tab, setTab] = useState<StoreTab>("featured");
  const [results, setResults] = useState<StoreItem[]>([]);
  const [query, setQuery] = useState("");
  const [searchOpen,setSearchOpen]=useState(false);
  const [searchDraft,setSearchDraft]=useState("");
  const [zone, setZone] = useState<Zone>("items");
  const [sel, setSel] = useState(0);
  const [detail, setDetail] = useState<StoreDetails | null>(null);
  const [dsel, setDsel] = useState(0);
  const [shot, setShot] = useState(0);

  useEffect(() => {
    loadStoreLists()
      .then(setLists)
      .catch(() => setFailed(true));
  }, []);
  const items: StoreItem[] = tab === "search" ? results : lists?.[tab] ?? [];
  const cur = items[Math.min(sel, Math.max(0, items.length - 1))];
  const owned = cur ? lib.byId.get(cur.id) : undefined;

  // details for the selected item (list layout preview) or the open page
  const [peek, setPeek] = useState<StoreDetails | null>(null);
  useEffect(() => {
    if (!cur) return setPeek(null);
    let alive = true;
    const t = setTimeout(() => loadStoreDetails(cur.id).then((d) => alive && setPeek(d)).catch(() => {}), 250);
    return () => {
      alive = false;
      clearTimeout(t);
    };
  }, [cur?.id]);

  const actions: { label: string; run: () => void }[] = detail
    ? [
        ...(owned ? [{ label: "Play", run: () => close(()=>onLaunch(owned)) }] : []),
        { label: "Checkout / sign in with Steam", run: () => close(()=>openStorePage(detail.id)) },
        ...(detail.hasTrailer ? [{ label: "Watch Trailer", run: () => setZone("trailer") }] : []),
      ]
    : [];

  const doSearch = () => {setSearchOpen(true);setSearchDraft(query);};
  const submitSearch = async () => {
    const q = searchDraft.trim();
    if (!q) return;
    setSearchOpen(false);
    setQuery(q);
    setTab("search");
    setSel(0);
    setZone("items");
    setResults(await searchStore(q).catch(() => []));
  };
  const switchTab = (d: number) => {
    const i = STORE_TABS.findIndex((t) => t.id === tab);
    const n = Math.max(0, Math.min(STORE_TABS.length - 1, i + d));
    if (n !== i) {
      setTab(STORE_TABS[n].id);
      setSel(0);
      playSound("tab");
      if (STORE_TABS[n].id === "search" && !results.length) doSearch();
    }
  };
  const COLS = skin.layout === "grid" ? 4 : 1;
  const handler = (p: Press): boolean => {
    const b = p.btn;
    if(searchOpen){if(b==="b")setSearchOpen(false);else if(b==="a")submitSearch();return true;}
    if (zone === "trailer") {
      if (b === "b" || b === "a") setZone("detail");
      return true;
    }
    if (zone === "detail") {
      if (b === "b") (setZone("items"), setDetail(null), playSound("back"));
      else if (b === "left" || b === "right") {
        const n = Math.max(0, Math.min(actions.length - 1, dsel + (b === "left" ? -1 : 1)));
        if (n !== dsel) (setDsel(n), playSound("move"));
      } else if (b === "l1" || b === "r1") setShot((x) => Math.max(0, Math.min((detail?.screenshots.length ?? 1) - 1, x + (b === "l1" ? -1 : 1))));
      else if (b === "a") (playSound("select"), actions[dsel]?.run());
      return true;
    }
    if (b === "b") return close(), playSound("back"), true;
    if (b === "y") return doSearch(), true;
    if (b === "l1" || b === "r1") return switchTab(b === "l1" ? -1 : 1), true;
    if (zone === "tabs") {
      if (b === "left" || b === "right") switchTab(b === "left" ? -1 : 1);
      else if (b === "down" || b === "a") (setZone("items"), playSound("tab"));
      return true;
    }
    const n = items.length;
    const mv = (d: number) => {
      const x = Math.max(0, Math.min(n - 1, sel + d));
      if (x !== sel) (setSel(x), playSound("move"));
      return x !== sel;
    };
    if (b === "left") COLS > 1 ? mv(-1) : switchTab(-1);
    else if (b === "right") COLS > 1 ? mv(1) : switchTab(1);
    else if (b === "up") {
      if (sel < COLS) (setZone("tabs"), playSound("tab"));
      else mv(-COLS);
    } else if (b === "down") mv(COLS);
    else if (b === "a" && cur) {
      playSound("open");
      setDsel(0);
      setShot(0);
      setDetail(peek && peek.id === cur.id ? peek : { id: cur.id, name: cur.name, short: "", header: cur.header, screenshots: [], genres: [], developers: [], publishers: [], free: !!cur.free, hasTrailer: false, platforms: [] });
      setZone("detail");
      loadStoreDetails(cur.id).then((d) => d && setDetail(d)).catch(() => {});
    }
    return true;
  };
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    setModalInput((p) => ref.current(p));
    return () => setModalInput(null);
  }, []);

  return (
    <div ref={castleWindow.ref} className="dht-store" data-dht-store-skin={settings.theme} style={{ position: "absolute", inset: 0, zIndex: 85, background: "#000",...(settings.theme==="castle"?castleWindowAppearance(settings):{}) }}>
      {searchOpen && <div className="dht-store-search" style={{position:"absolute",inset:0,zIndex:5,background:skin.bg,color:skin.text,display:"grid",placeItems:"center"}}><form onSubmit={e=>{e.preventDefault();submitSearch();}} style={{width:"65%"}}><h1>Search Store</h1><input autoFocus aria-label="Search Store" value={searchDraft} onChange={e=>setSearchDraft(e.target.value)} onKeyDown={e=>{e.stopPropagation();if(e.key==="Escape")setSearchOpen(false);}} style={{width:"100%",boxSizing:"border-box",fontSize:28,padding:18,color:skin.text,background:skin.panel,border:`2px solid ${skin.sub}`,borderRadius:skin.radius}}/><button type="submit" style={{fontSize:22,padding:"14px 30px",marginTop:24,background:skin.accent,color:skin.accentText}}>Search</button><button type="button" onClick={()=>setSearchOpen(false)} style={{fontSize:22,padding:"14px 30px",marginLeft:18}}>Back</button></form></div>}
      <Stage background="transparent">
        <StoreBody
          skin={skin}
          icon={skin.icon ? icons[skin.icon] : undefined}
          tab={tab}
          zone={zone}
          items={items}
          sel={sel}
          loading={!lists && !failed}
          failed={failed}
          query={query}
          peek={peek}
          detail={detail}
          actions={actions}
          dsel={dsel}
          shot={shot}
          lib={lib}
          onTab={(t) => (setTab(t), setSel(0), setZone("items"), t === "search" && doSearch())}
          onPick={(i) => (i === sel ? handler({ btn: "a", repeat: false }) : setSel(i))}
          onAction={(i) => (setDsel(i), actions[i]?.run())}
          onBack={() => (zone === "detail" ? (setZone("items"), setDetail(null)) : zone === "trailer" ? setZone("detail") : close())}
        />
      </Stage>
    </div>
  );
}

function StoreBody(p: {
  skin: Skin;
  icon?: string;
  tab: StoreTab;
  zone: Zone;
  items: StoreItem[];
  sel: number;
  loading: boolean;
  failed: boolean;
  query: string;
  peek: StoreDetails | null;
  detail: StoreDetails | null;
  actions: { label: string; run: () => void }[];
  dsel: number;
  shot: number;
  lib: Library;
  onTab: (t: StoreTab) => void;
  onPick: (i: number) => void;
  onAction: (i: number) => void;
  onBack: () => void;
}) {
  const { W, H } = useStage();
  const { skin } = p;
  const T = (s: string) => (skin.upper ? s.toUpperCase() : s);
  const base: CSSProperties = { position: "absolute", inset: 0, background: skin.bg, color: skin.text, fontFamily: skin.font ?? "inherit", overflow: "hidden" };

  // ── header with tabs ──
  const header = (
    <>
      <div style={{ position: "absolute", left: 56, top: 26, display: "flex", alignItems: "center", gap: 14 }}>
        {p.icon && <img src={p.icon} style={{ width: 44, height: 44 }} />}
        <span className="dht-store-title" style={{ fontSize: 30, fontWeight: skin.upper ? 800 : 300, letterSpacing: skin.upper ? 3 : 0 }}>
          {skin.title}
        </span>
      </div>
      <div style={{ position: "absolute", right: 56, top: 36, fontSize: 15, color: skin.tabText ?? skin.sub }}>{T("L1 / R1 sections · Y search · B close")}</div>
      <div style={{ position: "absolute", left: 56, top: 82, display: "flex", gap: 10 }}>
        {STORE_TABS.map((t) => {
          const on = t.id === p.tab;
          const focus = on && p.zone === "tabs";
          return (
            <div key={t.id} className="dht-store-tab" data-selected={on} onClick={() => p.onTab(t.id)} style={{ padding: "7px 16px", borderRadius: Math.min(skin.radius, 20) || 0, fontSize: 16, fontWeight: on ? 700 : 500, letterSpacing: skin.upper ? 1.5 : 0, background: on ? skin.accent : "transparent", color: on ? skin.accentText : skin.tabText ?? skin.sub, boxShadow: focus ? `0 0 0 2px ${skin.text}` : "none", cursor: "pointer" }}>
              {T(t.id === "search" && p.query ? `Search: ${p.query}` : t.label)}
            </div>
          );
        })}
      </div>
    </>
  );

  // ── item page ──
  if (p.detail && (p.zone === "detail" || p.zone === "trailer")) {
    const d = p.detail;
    const owned = p.lib.byId.has(d.id);
    const pic = d.screenshots[p.shot] ?? d.header;
    return (
      <div className="dht-store-page" style={base}>
        {d.background && <img src={d.background} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover", opacity: 0.25 }} />}
        <div style={{ position: "absolute", left: 56, top: 30, fontSize: 15, color: skin.sub }} onClick={p.onBack}>
          {T(`${skin.title}  ›  ${d.name}`)}
        </div>
        <div style={{ position: "absolute", left: 56, top: 70, width: 700, height: 394, borderRadius: skin.radius, overflow: "hidden", background: "#000", boxShadow: "0 12px 30px rgba(0,0,0,0.45)" }}>
          {p.zone === "trailer" ? <TrailerVideo appid={d.id} sound quality="high" loop={false} style={{ width: "100%", height: "100%", objectFit: "contain" }} /> : <img src={pic} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
        </div>
        {d.screenshots.length > 1 && p.zone !== "trailer" && (
          <div style={{ position: "absolute", left: 56, top: 476, display: "flex", gap: 8 }}>
            {d.screenshots.slice(0, 8).map((s, i) => (
              <img key={s} src={s} style={{ width: 80, height: 45, objectFit: "cover", borderRadius: Math.min(skin.radius, 6), opacity: i === p.shot ? 1 : 0.5, outline: i === p.shot ? `2px solid ${skin.text}` : "none" }} />
            ))}
          </div>
        )}
        <div style={{ position: "absolute", left: 790, right: 56, top: 70 }}>
          <div className="dht-store-name" style={{ fontSize: 32, fontWeight: 700, lineHeight: 1.15 }}>{T(d.name)}</div>
          <div style={{ marginTop: 10, display: "flex", alignItems: "center", gap: 12 }}>
            {d.priceText && (
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8, fontSize: 20 }}>
                {!!d.discount && <span style={{ padding: "1px 8px", borderRadius: 4, background: skin.sale, color: "#000", fontWeight: 800, fontSize: 16 }}>-{d.discount}%</span>}
                {d.originalText && <span style={{ textDecoration: "line-through", opacity: 0.6 }}>{d.originalText}</span>}
                <b>{d.priceText}</b>
              </span>
            )}
            {owned && <span style={{ padding: "2px 10px", borderRadius: 4, background: skin.accent, color: skin.accentText, fontSize: 13, fontWeight: 700 }}>{T("In Library")}</span>}
          </div>
          <div style={{ marginTop: 14, fontSize: 16, lineHeight: 1.5, color: skin.text, opacity: 0.9, maxHeight: 190, overflow: "hidden" }}>{d.short || "Loading…"}</div>
          <div style={{ marginTop: 14, fontSize: 14, color: skin.sub, lineHeight: 1.6 }}>
            {d.genres.length > 0 && <div>{d.genres.join(" · ")}</div>}
            {d.release && <div>Release: {d.release}</div>}
            {d.developers.length > 0 && <div>Developer: {d.developers.join(", ")}</div>}
            {d.metacritic && <div>Metacritic: {d.metacritic}</div>}
          </div>
        </div>
        <div style={{ position: "absolute", left: 790, bottom: 56, display: "flex", gap: 12, flexWrap: "wrap", right: 56 }}>
          {p.actions.map((a, i) => (
            <div key={a.label} className="dht-store-action" data-selected={i === p.dsel} onClick={() => p.onAction(i)} style={{ padding: "12px 22px", borderRadius: Math.min(skin.radius, 24), fontSize: 17, fontWeight: 700, letterSpacing: skin.upper ? 1.5 : 0, background: i === p.dsel ? skin.accent : skin.panel, color: i === p.dsel ? skin.accentText : skin.text, boxShadow: i === p.dsel ? "0 6px 18px rgba(0,0,0,0.35)" : "none" }}>
              {T(a.label)}
            </div>
          ))}
        </div>
        <div style={{ position: "absolute", left: 56, bottom: 30, fontSize: 14, color: skin.sub }}>{T(p.zone === "trailer" ? "B back" : "A select · ◀ ▶ buttons · L1 / R1 screenshots · B back")}</div>
      </div>
    );
  }

  // ── lists ──
  const empty = p.loading ? "Loading the store…" : p.failed ? "The store can't be reached right now (check the internet connection)." : p.tab === "search" ? (p.query ? "Nothing found." : "Press Y to search.") : "Nothing here right now.";
  if (skin.layout === "grid") {
    const COLS = 4;
    const tw = Math.floor((W - 112 - (COLS - 1) * 20) / COLS);
    const th = Math.round((tw * 215) / 460);
    const rowH = th + 64;
    const rows = Math.max(1, Math.floor((H - 150) / rowH));
    const row = Math.floor(p.sel / COLS);
    const top = Math.max(0, Math.min(row - (rows - 1), Math.ceil(p.items.length / COLS) - rows));
    return (
      <div className="dht-store-grid" style={base}>
        {header}
        {!p.items.length && <div style={{ position: "absolute", left: 56, top: 160, fontSize: 18, color: skin.sub }}>{empty}</div>}
        {p.items.slice(top * COLS, (top + rows) * COLS).map((it, k) => {
          const i = top * COLS + k;
          const on = i === p.sel && p.zone === "items";
          return (
            <div key={it.id} className="dht-store-tile dht-tile" data-selected={on} onClick={() => p.onPick(i)} style={{ position: "absolute", left: 56 + (k % COLS) * (tw + 20), top: 140 + Math.floor(k / COLS) * rowH, width: tw, transition: "transform 140ms", ...skin.ring(on), borderRadius: skin.radius }}>
              <div style={{ width: tw, height: th, borderRadius: skin.radius, overflow: "hidden", background: skin.panel, position: "relative" }}>
                <img src={it.header} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                {!!it.discount && <span style={{ position: "absolute", left: 8, top: 8, padding: "2px 8px", borderRadius: 4, background: skin.sale, color: "#000", fontWeight: 800, fontSize: 14 }}>-{it.discount}%</span>}
                {p.lib.byId.has(it.id) && <span style={{ position: "absolute", right: 8, top: 8, padding: "2px 8px", borderRadius: 4, background: "rgba(0,0,0,0.65)", color: "#fff", fontSize: 12 }}>In Library</span>}
              </div>
              <div style={{ marginTop: 8, fontSize: 16, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{T(it.name)}</div>
              <div style={{ marginTop: 2, color: skin.sub }}>
                <Price it={it} skin={skin} />
              </div>
            </div>
          );
        })}
      </div>
    );
  }
  // list + preview pane
  const rowH = 78;
  const rows = Math.max(1, Math.floor((H - 160) / rowH));
  const top = Math.max(0, Math.min(p.sel - Math.floor(rows / 2), p.items.length - rows));
  const cur = p.items[p.sel];
  return (
    <div className="dht-store-list" style={base}>
      {header}
      {!p.items.length && <div style={{ position: "absolute", left: 56, top: 160, fontSize: 18, color: skin.sub }}>{empty}</div>}
      {p.items.slice(top, top + rows).map((it, k) => {
        const i = top + k;
        const on = i === p.sel && p.zone === "items";
        return (
          <div key={it.id} className="dht-store-row" data-selected={on} onClick={() => p.onPick(i)} style={{ position: "absolute", left: 50, top: 140 + k * rowH, width: 560, height: rowH - 10, display: "flex", alignItems: "center", gap: 14, padding: "0 10px", boxSizing: "border-box", borderRadius: skin.radius, background: skin.panel, ...skin.ring(on), transition: "transform 120ms" }}>
            <img src={it.header} style={{ width: 120, height: 56, objectFit: "cover", borderRadius: Math.min(skin.radius, 6), flex: "none" }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: 18, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 400 }}>{T(it.name)}</div>
              <div style={{ color: skin.sub }}>
                <Price it={it} skin={skin} />
              </div>
            </div>
          </div>
        );
      })}
      {cur && (
        <div className="dht-store-preview" style={{ position: "absolute", left: 650, right: 56, top: 140, bottom: 60, borderRadius: skin.radius, background: skin.panel, overflow: "hidden" }}>
          <img src={p.peek?.id === cur.id && p.peek.screenshots[0] ? p.peek.screenshots[0] : cur.header} style={{ width: "100%", height: "52%", objectFit: "cover", display: "block" }} />
          <div style={{ padding: "14px 18px" }}>
            <div style={{ fontSize: 24, fontWeight: 700 }}>{T(cur.name)}</div>
            <div style={{ margin: "6px 0 10px" }}>
              <Price it={cur} skin={skin} big />
            </div>
            <div style={{ fontSize: 15, lineHeight: 1.45, opacity: 0.9, maxHeight: 110, overflow: "hidden" }}>{p.peek?.id === cur.id ? p.peek.short : ""}</div>
          </div>
        </div>
      )}
    </div>
  );
}
