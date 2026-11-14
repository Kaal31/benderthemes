import {CreatorCredit} from "./CreatorCredit";
import {allThemes,refreshThemes} from "./engine/registry";
import {getSettings,updateSettings} from "./settings";
import {closeMarketplace} from "./marketplaceState";
import {AnimatedWallpapers} from "./AnimatedWallpapers";
import {useWiiFlowDownloads} from "./wiiflowDownloads";
// Hub > Theme files: theme files for the theme-file importers (PSP, PS3, Vita, Switch, Wii U, 3DS, Wii, Xbox), listed
// from public sites at runtime by the backend (py_modules/theme_sources.py) with the source and the creator named on
// every entry. Nothing is downloaded until the user confirms it here; files land in <data>/skins/<kind>/.
// The Hub routes controller presses here through `inputRef` (Marketplace.tsx).
import { Navigation } from "@decky/ui";
import { callable } from "@decky/api";
import { MutableRefObject, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { opensKeyboardOnTap, showSteamKeyboard } from "./steamKeyboard";
import type { InputHandler } from "./input";
import { refreshThemeLists } from "./themeSettingsMenu";
import { resourcesChangedOnClose, useResourceRevision } from "./marketplaceState";
import { playSound } from "./steam";

type Source = { id?: string; name: string; url: string; credit: string };
type Kind = { id: string; label: string; dir: string; exts: string[]; sources: string[] };
type Kinds = { kinds: Kind[]; sources: Record<string, Source>; notBuilt: { name: string; url: string; kinds: string[]; why: string }[] };
type FileRef = { name: string; size: number };
export type SourceItem = { sourceId?: string; alternatives?: SourceItem[]; id: string; name: string; author: string; image: string; page: string; description?: string; fallbackImage?: string; images?: string[]; externalLinks?: string[]; externalOnly?: boolean; downloads?: number; tag?: string; file?: FileRef; files?: FileRef[] | null };
type Page = { kind: string; page: number; pages: number; total: number; items: SourceItem[]; source: Source; error?: string; warning?: string; skipped?: number };
type Progress = { busy: boolean; percent: number; message: string };

const listKinds = callable<[], Kinds>("theme_sources");
const browse = callable<[kind: string, source: string, query: string, page: number, refresh: boolean], Page>("theme_sources_browse");
const itemFiles = callable<[kind: string, ident: string], { files: FileRef[]; error?: string }>("theme_sources_files");
const download = callable<[kind: string, source: string, ident: string, file: string, name: string], { success: boolean; name?: string; already?: boolean; error?: string }>("theme_sources_download");
const savedDownloads=callable<[kind:string],Record<string,string>>("theme_sources_saved");
const downloadProgress = callable<[], Progress>("theme_sources_progress");

const openUrl = (url?: string) => { if (url && (/^https:\/\//.test(url) || /^http:\/\/(?:www\.)?ps3-themes\.com\//.test(url))) Navigation.NavigateToSteamWeb(url); };
const mb = (n: number) => n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : n ? `${Math.max(1, Math.round(n / 1024))} KB` : "";
const KIND_HINT: Record<string, string> = { psp: "PSP", p3t: "PS3", ps4: "PS4", vita: "PS Vita", switch: "Switch", wiiu: "Wii U", "3ds": "3DS", wii: "Wii", xbox: "Xbox", x360: "Xbox 360" };
const hintFor = (kind: string) => kind === "x360" ? "Choose skins or coverflow layouts in Xbox 360 Theme options." : `Choose it in the ${KIND_HINT[kind] ?? ""} theme's Theme options${kind === "wiiu" ? " (Wii U themes also need your own menu files)" : ""}.`;

export function ThemeFiles({ inputRef, initialKind = "psp", authoredContent, onKindChange, installedOnly=false }: { inputRef: MutableRefObject<InputHandler | null>; initialKind?: string; authoredContent?: ReactNode; installedOnly?:boolean; onKindChange?:(kind:string)=>void }) {
  const resourceRevision=useResourceRevision();
  const [kinds, setKinds] = useState<Kinds | null>(null);
  const [kind, setKind] = useState(initialKind);
  useEffect(()=>onKindChange?.(kind),[kind]);
  const categoryScroll=useRef<HTMLDivElement>(null);
  useEffect(()=>{const strip=categoryScroll.current;if(!strip)return;const reveal=()=>{const active=strip.querySelector<HTMLElement>('[aria-selected=true]');if(!active)return;const a=active.getBoundingClientRect(),b=strip.getBoundingClientRect();if(a.left<b.left||a.right>b.right)strip.scrollLeft+=(a.left+a.width/2)-(b.left+b.width/2)};reveal();const observer=new ResizeObserver(reveal);observer.observe(strip);return()=>observer.disconnect()},[kind,kinds,installedOnly]);
  const wallpaperInput=useRef<InputHandler|null>(null);
  const [installed,setInstalled]=useState<Record<string,SourceItem[]>>({});
  useEffect(()=>{if(!installedOnly)return;let live=true;void Promise.all([callable<[],Record<string,any>>("list_skins")(),callable<[],{themes:any[]}>("list_switch_themes")(),callable<[],{themes:string[]}>("list_wiiu_themes")(),callable<[],{items:any[]}>("animated_wallpapers_list")(),refreshThemes()]).then(([skins,sw,wu,wall])=>{if(!live)return;const rows:Record<string,SourceItem[]>={};for(const [key,names] of Object.entries({...skins,"3ds":skins.n3ds,switch:sw.themes,wiiu:wu.themes})){if(!Array.isArray(names))continue;rows[key]=names.map(n=>({id:typeof n==='string'?n:n.id,name:typeof n==='string'?(skins.x360names?.[n]??n):n.name,author:typeof n==='string'?'':n.author??'',image:typeof n==='string'?'':n.screens?.[0]??'',page:'',tag:'Installed',file:{name:typeof n==='string'?n:n.id,size:0}}));}rows.wiiflow=allThemes().filter(t=>t.id.startsWith("wiiflow-")).map(t=>({id:t.id,name:t.name,author:t.author??"",image:"",page:"",tag:"Installed",file:{name:t.id,size:0}}));if(wall.items?.length)rows.wallpapers=wall.items;setInstalled(rows);}).catch(()=>{});return()=>{live=false}},[installedOnly,resourceRevision]);
  const kindList:Kind[]=[...(authoredContent?[{id:"authored",label:"Authored themes",dir:"",exts:[],sources:[]}]:[]),...(kinds?.kinds??[]),{id:"wallpapers",label:"Animated backgrounds",dir:"",exts:[],sources:[]}].filter(k=>!installedOnly||k.id==="authored"||!!installed[k.id]?.length);
  const wiiflowDownloads=useWiiFlowDownloads(kind==="wiiflow");
  const [source, setSource] = useState("");
  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState("");
  const [items, setItems] = useState<SourceItem[]>([]);
  const [info, setInfo] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [mirror, setMirror] = useState(0);
  const [zone, setZone] = useState<"kinds" | "grid" | "detail" | "search">("kinds");
  const [action, setAction] = useState(0); // the highlighted button of the detail panel
  const [confirm, setConfirm] = useState<FileRef | null>(null);
  const [files, setFiles] = useState<Record<string, FileRef[] | { error: string }>>({});
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [savedFiles,setSavedFiles]=useState<Record<string,string>>({});
  const savedKey=(file:FileRef)=>`${kind}:${downloadSource}:${current?.id}:${downloadSource==="archive"?file.name:""}`;
  useEffect(()=>{let live=true;savedDownloads(kind).then(rows=>{if(live&&rows)setSavedFiles(previous=>({...previous,...rows}));}).catch(()=>{});return()=>{live=false;};},[kind]);
  const [message, setMessage] = useState<{ text: string; ok?: boolean } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; listKinds().then(k => { if (alive.current) setKinds(k); }).catch(() => {}); return () => { alive.current = false; inputRef.current = null; }; }, []);
  const kindInfo = kinds?.kinds.find(k => k.id === kind);
  const src = source || kindInfo?.sources[0] || "";
  const srcInfo = installedOnly?{name:"Installed on this device",url:"",credit:""}:kinds?.sources[src];
  const browseKey = `${kind}|${src}|${query}`;
  const latestBrowseKey = useRef(browseKey);
  latestBrowseKey.current = browseKey;
  const browseRequest = useRef(0);
  // one page at a time; "Show more" appends the next page
  const load = (page: number, refresh = false) => {
    if(installedOnly){const rows=(installed[kind]??[]).filter(i=>i.name.toLowerCase().includes(query.toLowerCase()));setItems(rows);setInfo({kind,page:1,pages:1,total:rows.length,items:rows,source:{name:'Installed on this device',url:'',credit:''}});setLoading(false);return;}
    if (!src) return;
    setLoading(true);
    const key = browseKey, request = ++browseRequest.current;
    const currentRequest = () => alive.current && latestBrowseKey.current === key && browseRequest.current === request;
    browse(kind, src, query, page, refresh).then(r => {
      if (!currentRequest()) return;
      setInfo(r); setItems(prev => {
        if(page === 1) return r.items;
        const merged = [...prev];
        for(const item of r.items){const index=merged.findIndex(p=>p.id===item.id);if(index<0)merged.push(item);else if(item.alternatives){const old=merged[index];const variants=[...(old.alternatives??[])];for(const v of item.alternatives)if(!variants.some(p=>p.sourceId===v.sourceId&&p.id===v.id))variants.push(v);merged[index]={...old,alternatives:variants};}}
        return merged;
      });
    }).catch(e => { if (currentRequest()) setInfo({ kind, page, pages: 1, total: 0, items: [], source: srcInfo as Source, error: String(e) }); })
      .finally(() => { if (currentRequest()) setLoading(false); });
  };
  useEffect(() => { setItems([]); setInfo(null); setSelected(0); setConfirm(null); setMessage(null); load(1); }, [kind, src, query, !!kinds, installed]);
  const more = !!info && info.page < info.pages;
  const count = items.length + (more ? 1 : 0); // the "Show more" card is the last cell
  const group = items[Math.min(selected, items.length - 1)];
  const alternatives = group?.alternatives ?? [];
  const current: SourceItem | undefined = alternatives.length ? alternatives[Math.min(mirror, alternatives.length-1)] : group;
  const downloadSource = current?.sourceId || src;
  const downloadSourceInfo = kinds?.sources[downloadSource] ?? srcInfo;
  useEffect(()=>{setMirror(0)},[selected,kind,src]);
  // archive.org items list their files; the others are one file each
  const fileList: FileRef[] | null = !current ? null : current.files !== undefined
    ? (current.files ?? (Array.isArray(files[current.id]) ? files[current.id] as FileRef[] : null)) : [current.file || { name: "", size: 0 }];
  useEffect(() => {
    if (!current || current.files !== null || files[current.id]) return;
    let live = true;
    itemFiles(kind, current.id).then(r => { if (live) setFiles(f => ({ ...f, [current.id]: r.error ? { error: r.error } : r.files })); }).catch(() => {});
    return () => { live = false; };
  }, [current?.id,downloadSource]);
  useEffect(() => {
    setConfirm(null); setAction(0); detailRef.current?.scrollTo?.({ top: 0 });
    gridRef.current?.querySelector<HTMLElement>('[data-current="true"]')?.scrollIntoView?.({ block: "nearest" });
  }, [selected, items.length === 0]);
  useEffect(() => {
    if (!busy) return;
    const t = setInterval(() => { downloadProgress().then(p => { if (alive.current) setProgress(p); }).catch(() => {}); }, 500);
    return () => clearInterval(t);
  }, [busy]);
  useEffect(() => { detailRef.current?.querySelector<HTMLElement>('[data-active="true"]')?.scrollIntoView?.({ block: "nearest" }); }, [action, confirm, zone]);

  const applyInstalled=()=>{if(!current)return;const id=current.id,s=getSettings();const themes:Record<string,string>={p3t:'ps3',ps4:'ps4',psp:'psp',vita:'vita',x360:'x360',xbox:'xbox',wii:'wii','3ds':'n3ds',switch:'switch',wiiu:'wiiu'};
    if(kind==='wiiflow'){updateSettings({theme:'frame',activeTheme:id});closeMarketplace();return;}
    const patch:any={theme:themes[kind],activeTheme:''};if(kind==='p3t')patch.xmb={...s.xmb,p3t:id};else if(kind==='psp')patch.xmb={...s.xmb,psp:id};else if(kind==='vita')patch.vita={...s.vita,skin:id};else if(kind==='x360')patch.x360={...s.x360,...(id.toLowerCase().endsWith('.cfljson')?{coverflow:id}:{skin:id})};else patch[({ps4:'ps4Skin',xbox:'xboxSkin',wii:'wiiSkin','3ds':'n3dsSkin',switch:'switchTheme',wiiu:'wiiuTheme'} as Record<string,string>)[kind]]=id;
    updateSettings(patch);closeMarketplace();};
  const switchKind = (delta: number) => {
    const list = kindList; if (!list.length) return;
    const i = list.findIndex(k => k.id === kind);
    setKind(list[(i + delta + list.length) % list.length].id); setSource(""); setQuery(""); setTyped("");
  };
  const cycleSource = () => {
    const list = kindInfo?.sources ?? []; if (list.length < 2) return;
    setSource(list[(list.indexOf(src) + 1) % list.length]);
  };
  // focused after the press, so a keyboard key mapped to ☰ (the preview: M) is not typed into the box
  const openSearch = () => { setZone("search"); setTimeout(() => showSteamKeyboard(searchRef.current), 0); };
  const leaveSearch = (toGrid: boolean) => { searchRef.current?.blur(); setQuery(typed.trim()); setZone(toGrid ? "grid" : "kinds"); setSelected(0); };
  const startDownload = async (file: FileRef) => {
    if (!current || busy) return;
    if(installedOnly){applyInstalled();return;}
    setBusy(true); setMessage(null); setProgress({ busy: true, percent: 0, message: "Connecting…" });
    try {
      const r = await download(kind, downloadSource, current.id, downloadSource === "archive" ? file.name : "", current.name);
      if (!alive.current) return;
      if (!r.success) setMessage({ text: r.error || "Download failed." });
      else {
        setMessage({ ok: true, text: `${r.already ? "Already saved" : "Saved"} to ${kindInfo?.dir}/ as “${r.name}”. ${hintFor(kind)}` });
        setSavedFiles(previous=>({...previous,[savedKey(file)]:r.name||file.name}));
        refreshThemeLists();
        resourcesChangedOnClose();
      }
    } catch (e) { if (alive.current) setMessage({ text: String(e) }); }
    finally { if (alive.current) { setBusy(false); setConfirm(null); } }
  };
  // detail buttons: one per file (or one Download), then "Source page"
  const actions = installedOnly?1:(current?.externalLinks?.length ?? 0) + (fileList ?? []).length + 1;
  const pressAction = (i: number) => {
    const links = current?.externalLinks ?? [];
    if (i < links.length) { openUrl(links[i]); return; }
    i -= links.length;
    const list = fileList ?? [];
    if (i >= list.length) { openUrl(current?.page); return; }
    if(installedOnly){applyInstalled();return;}
    if(savedFiles[savedKey(list[i])])return;
    if (confirm && confirm.name === list[i].name) void startDownload(list[i]);
    else { setConfirm(list[i]); setMessage(null); }
  };
  const cols = () => {
    const cells = Array.from(gridRef.current?.querySelectorAll<HTMLElement>(".dht-files-card") ?? []);
    if (!cells.length) return 1;
    const top = cells[0].offsetTop; const n = cells.findIndex(c => c.offsetTop !== top);
    return n < 0 ? cells.length : n;
  };
  const choose = (i: number) => {
    if (i >= items.length && more) { if (!loading) load(info!.page + 1); return; }
    setSelected(i);
  };
  inputRef.current = p => {
    if(kind==='authored'){
      if((p.btn==='l2'||p.btn==='r2')&&!p.repeat){playSound('tab');switchKind(p.btn==='r2'?1:-1);return true;}
      if(zone==='kinds'&&(p.btn==='left'||p.btn==='right')){switchKind(p.btn==='right'?1:-1);return true;}
      if(zone==='kinds'&&(p.btn==='down'||p.btn==='a')){setZone('grid');return true;}
      if(zone==='grid'&&p.btn==='up'){const grid=document.querySelector('.dht-hub-grid'),first=grid?.firstElementChild,selected=grid?.querySelector('[data-selected=true]');if(first&&selected&&Math.abs(first.getBoundingClientRect().top-selected.getBoundingClientRect().top)<5){setZone('kinds');return true;}}
      return false;
    }
    if(kind==='wallpapers'){
      if((p.btn==='l2'||p.btn==='r2')&&!p.repeat){playSound('tab');switchKind(p.btn==='r2'?1:-1);return true;}
      return wallpaperInput.current?.(p)??false;
    }
    if (p.btn === "b") { // the Hub closes on B unless something here is open
      if (confirm) { setConfirm(null); return true; }
      if (zone === "search") { searchRef.current?.blur(); setTyped(query); setZone("kinds"); return true; }
      if (zone === "detail") { setZone("grid"); return true; }
      return false;
    }
    if (busy) return true;
    if ((p.btn === "l2" || p.btn === "r2") && !p.repeat) { playSound("tab"); switchKind(p.btn === "r2" ? 1 : -1); return true; }
    if (zone === "search") { if (p.btn === "down") leaveSearch(true); return true; }
    if (p.btn === "menu" && !p.repeat) { openSearch(); return true; }
    if (p.btn === "x" && !p.repeat) { if (zone === "kinds") cycleSource(); else if(alternatives.length>1&&!busy){setMirror((mirror+1)%alternatives.length);setConfirm(null);setAction(0);}else openUrl(current?.page); return true; }
    if (zone === "kinds") {
      if (p.btn === "left" || p.btn === "right") { playSound("move"); switchKind(p.btn === "right" ? 1 : -1); }
      if ((p.btn === "down" || p.btn === "a") && count) { playSound("move"); setZone("grid"); }
      return true;
    }
    if (zone === "grid") {
      const c = cols();
      if (p.btn === "up" && selected < c) { setZone("kinds"); return true; }
      const d = p.btn === "up" ? -c : p.btn === "down" ? c : p.btn === "left" ? -1 : p.btn === "right" ? 1 : 0;
      if (d) { playSound("move"); const n = Math.max(0, Math.min(count - 1, selected + d)); if (n < items.length) setSelected(n); else if (more && p.btn !== "left") setSelected(items.length); }
      if (p.btn === "a" && !p.repeat) {
        if (selected >= items.length) { playSound("select"); choose(selected); return true; }
        if (current) { playSound("select"); setZone("detail"); setAction(0); }
      }
      return true;
    }
    // detail
    if (p.btn === "up" || p.btn === "down") { playSound("move"); setConfirm(null); setAction(a => Math.max(0, Math.min(actions - 1, a + (p.btn === "up" ? -1 : 1)))); }
    if (p.btn === "left") setZone("grid");
    if (p.btn === "a" && !p.repeat) { playSound("select"); pressAction(action); }
    return true;
  };
  const moreCard = selected >= items.length && more;
  const notBuilt = useMemo(() => (kinds?.notBuilt ?? []).filter(n => n.kinds.includes(kind)), [kinds, kind]);
  return <section className="dht-files" data-discover={authoredContent?true:undefined} aria-label={authoredContent?"Discover catalog":"Theme files"}>
    <style>{FILES_CSS}</style>
    <div className="dht-files-bar">
      <div className="dht-files-kinds" role="tablist" aria-label={authoredContent?"Discover categories":"Theme file categories"} data-focused={zone === "kinds"}>
        <span className="dht-files-glyph" aria-hidden="true">L2</span>
        <div ref={categoryScroll} className="dht-files-kind-scroll">{kindList.map(k => <button key={k.id} role="tab" aria-selected={k.id === kind} data-active={k.id === kind} onClick={() => { setKind(k.id); setSource(""); setQuery(""); setTyped(""); setZone("kinds"); }}>{k.label}</button>)}</div>
        <span className="dht-files-glyph" aria-hidden="true">R2</span>
      </div>
      <label style={kind==="wallpapers"||kind==="authored"?{visibility:"hidden"}:undefined} className="dht-files-search" data-focused={zone === "search"}>
        <span aria-hidden="true">⌕</span>
        <input ref={searchRef} {...opensKeyboardOnTap} type="search" aria-label="Search theme files" placeholder={`Search ${kindInfo?.label ?? ""} themes`} value={typed}
          onFocus={() => setZone("search")} onChange={e => setTyped(e.target.value)}
          onKeyDown={e => { e.stopPropagation(); if (e.key === "Enter" || e.key === "ArrowDown") { e.preventDefault(); leaveSearch(true); } if (e.key === "Escape") { e.preventDefault(); searchRef.current?.blur(); setTyped(query); setZone("kinds"); } }} />
      </label>
    </div>
    {kind==="authored"?<><div className="dht-files-info" aria-hidden="true"/><div style={{flex:1,minHeight:0,display:"flex",flexDirection:"column"}} onPointerDown={()=>setZone("grid")} onFocusCapture={()=>setZone("grid")}>{authoredContent}</div><div className="dht-files-foot" aria-hidden="true"/></>:kind==="wallpapers"?<AnimatedWallpapers inputRef={wallpaperInput} installedOnly={installedOnly}/>:<>
    <div className="dht-files-info"><div className="dht-files-sub">
      <span className="dht-files-sources">{installedOnly?"Installed on this device":"From"} {(installedOnly?[]:kindInfo?.sources ?? []).map(s => <button key={s} data-active={s === src} onClick={() => setSource(s)}>{kinds?.sources[s]?.name ?? s}</button>)}{!installedOnly&&(kindInfo?.sources.length ?? 0) > 1 && <i>X switches</i>}</span>
      <span className="dht-files-status" role="status">{installedOnly?`${items.length} installed ${items.length===1?"theme":"themes"}`:loading && !items.length ? "Loading…" : info?.error ? info.error : `${info?.total ?? 0} ${query ? `results for “${query}”` : "themes"}${kind === "wiiflow" ? " · original source posts" : ` · saved to ${kindInfo?.dir ?? "skins"}/`}`}</span>
    </div>
    {kind==="wii"&&<p className="dht-files-note">MYM themes use the built-in standard Wii menu automatically. An owned console base is optional; missing custom artwork remains visible in compatibility details.</p>}
    {kind==="wiiflow"&&<p className="dht-files-note" role="status">{wiiflowDownloads} ZIPs, RAR/7z archives and extracted theme folders are checked after downloads finish.</p>}
    {info?.warning && <p className="dht-files-note" role="status">{info.warning}</p>}
    </div><div className="dht-files-layout">
      <div className="dht-files-grid" ref={gridRef} data-focused={zone === "grid"}>
        {!items.length && !loading && <div className="dht-files-empty"><strong>{info?.error ? "This source is not reachable right now." : "Nothing here yet."}</strong><span>{info?.error ? "Installed theme files keep working offline. Try again later or pick another source." : query ? "Try fewer or other words." : "Pick another console or source."}</span></div>}
        {items.map((it, i) => <button key={it.id} className="dht-files-card" data-current={i === selected} data-selected={zone === "grid" && i === selected}
          onClick={() => { setSelected(i); setZone("detail"); setAction(0); }} onFocus={() => setSelected(i)}>
          <span className="dht-files-art">{it.image ? <img src={it.image} alt="" loading="lazy" referrerPolicy="no-referrer" onError={e => { if(it.fallbackImage && !e.currentTarget.dataset.fallback){e.currentTarget.dataset.fallback="true";e.currentTarget.src=it.fallbackImage;}else e.currentTarget.style.display = "none"; }} /> : null}<b>{it.name.slice(0, 1)}</b></span>
          <strong>{it.name}</strong>
          <small>{it.alternatives && it.alternatives.length>1 ? `${it.alternatives.length} download sources` : it.tag || kinds?.sources[it.sourceId??it.alternatives?.[0]?.sourceId??src]?.name || srcInfo?.name}{it.downloads ? ` · ↓ ${it.downloads.toLocaleString()}` : ""}</small>
        </button>)}
        {more && <button className="dht-files-card dht-files-more" data-current={moreCard} data-selected={zone === "grid" && moreCard} onClick={() => choose(items.length)} onFocus={()=>{setSelected(items.length);setZone("grid")}} disabled={loading}>
          <strong>{loading ? "Loading…" : "Show more"}</strong><small>{items.length} of {info?.total}</small></button>}
      </div>
      <aside className="dht-files-detail" ref={detailRef} data-focused={zone === "detail"}>
        {current ? <>
          <div className="dht-files-preview">{current.image ? <img key={current.id} src={current.image} alt={`${current.name} preview`} referrerPolicy="no-referrer" onError={e => { if(current.fallbackImage && !e.currentTarget.dataset.fallback){e.currentTarget.dataset.fallback="true";e.currentTarget.src=current.fallbackImage;}else e.currentTarget.style.display = "none"; }} /> : <span>No preview</span>}</div>
          <h3>{current.name}</h3>
          <CreatorCredit author={current.author}/>
          {alternatives.length>1&&<div className="dht-files-sources" aria-label="Download sources"><span>Download from · X switches</span>{alternatives.map((v,i)=><button key={`${v.sourceId}:${v.id}`} data-active={mirror===i} disabled={busy} onClick={()=>{setMirror(i);setConfirm(null);setAction(0)}}>{kinds?.sources[v.sourceId??""]?.name??v.sourceId}</button>)}</div>}
          <small className="dht-files-by">{downloadSourceInfo?.name}{current.tag ? ` · ${current.tag}` : ""}</small>
          {current.fallbackImage && <small className="dht-files-by">If the original image fails, a screenshot of our converted theme is shown.</small>}
          {current.description && <p className="dht-files-note">{current.description}</p>}
          {(current.images?.length ?? 0) > 1 && <div style={{display:"flex",gap:6,overflowX:"auto"}}>{current.images!.slice(1).map(url=><img key={url} src={url} alt={`${current.name} screenshot`} loading="lazy" referrerPolicy="no-referrer" style={{width:120,height:90,objectFit:"contain"}} onError={e=>{e.currentTarget.style.display="none"}} />)}</div>}
          {current.externalOnly && <p className="dht-files-note">{kind==="ps4"?"Downloads open on the external host. PKG files need extraction before importing; they cannot be applied directly.":kind==="wii"?"This is a multi-stage theme. Direct download is unavailable until all stages can be provided together. See the source page for details.":"Open the author’s download page. Completed ZIPs and extracted WiiFlow folders in Downloads are imported automatically while this tab is open. Older links may have expired."}</p>}
          {fileList === null ? <p className="dht-files-note">{(files[current.id] as any)?.error ?? "Reading the item’s files…"}</p> : <div className="dht-files-actions">
            {current.externalLinks?.map((url,i)=><button key={url} data-active={zone === "detail" && action === i} onClick={()=>openUrl(url)}>{kind==="ps4"?"Download host":"Author download page"} {i+1} ↗</button>)}
            {fileList.map((f, i) => {
              const asking = confirm?.name === f.name;
              const buttonIndex = i + (current.externalLinks?.length ?? 0);
              return <div key={f.name || i} className="dht-files-action" data-confirm={asking}>
                <button className="dht-files-dl" data-active={zone === "detail" && action === buttonIndex} disabled={busy||!installedOnly&&!!savedFiles[savedKey(f)]} onClick={() => { setZone("detail"); setAction(buttonIndex); pressAction(buttonIndex); }}>
                  {installedOnly?"Use theme":savedFiles[savedKey(f)]?"✓ Saved · available in Theme options":busy && asking ? `${progress?.percent ?? 0}% · ${progress?.message || "Downloading…"}` : asking ? `Confirm download · A` : `↓ ${fileList.length > 1 || downloadSource === "archive" ? f.name.split("/").pop() : "Download"}${f.size ? ` · ${mb(f.size)}` : ""}`}
                </button>
                {asking && !busy && <p className="dht-files-confirm" role="alertdialog">Download {downloadSource === "archive" ? `“${f.name.split("/").pop()}”` : "this theme"} from {downloadSourceInfo?.name} into <b>{kindInfo?.dir}/</b>? {downloadSource === "archive" ? "It was uploaded by an archive.org user and is not checked by ThemeHub. " : downloadSource === "ps3pro" || downloadSource === "shenron0" ? "It comes from a public GitHub collection and is not checked by ThemeHub. " : ""}A confirms · B cancels.</p>}
              </div>;
            })}
            {!fileList.length && !current.externalOnly && <p className="dht-files-note">No {kindInfo?.exts.join(" / ")} files in this item.</p>}
            {!installedOnly&&<button className="dht-files-page" data-active={zone === "detail" && action === fileList.length + (current.externalLinks?.length ?? 0)} onClick={() => openUrl(current.page)}>Source page ↗</button>}
          </div>}
          {message && <p className="dht-files-message" data-ok={!!message.ok} role="status">{message.text}</p>}
          <p className="dht-files-credit">{downloadSourceInfo?.credit}</p>
        </> : <div className="dht-files-note">{loading ? "Loading…" : "Choose a theme to see it here."}</div>}
      </aside>
    </div>
    <div className="dht-files-foot">
      <span className="dht-files-attribution">{installedOnly?"Stored locally":"Theme data:"} <button type="button" disabled={installedOnly} onClick={() => openUrl(srcInfo?.url)}>{srcInfo?.name ?? "…"} ↗</button>{notBuilt.length > 0 && <em> · Not available: {notBuilt.map(n => n.name).join(", ")}</em>}</span>
      <span className="dht-files-hints">{installedOnly?"L2/R2 Category · A Use theme · B Back":zone === "search" ? "Type · ↓ Results · B Done" : zone === "detail" ? `↑↓ Choose · A Download (asks first) · X ${alternatives.length>1?"Download source":"Source page"} · B Back` : "L2/R2 Category · ☰ Search · X " + (zone === "kinds" ? "Source" : "Source page") + " · A Open"}</span>
    </div>
    </>}
  </section>;
}

const FILES_CSS = `
.dht-files-info{height:66px;min-height:66px;overflow:auto;box-sizing:border-box}.dht-files-info .dht-files-note{margin:5px 0;font-size:11px;line-height:1.3}
.dht-files[data-discover] .dht-hub-body{margin:0;gap:var(--dht-hub-gap,22px)}
.dht-files[data-discover] .market-grid{padding:6px;margin:0;gap:14px;scroll-padding:8px;grid-template-columns:repeat(auto-fill,minmax(var(--dht-hub-card-min,180px),1fr))}
.dht-files[data-discover] .dht-files-foot{min-height:18px;box-sizing:border-box}
@container dht-hub (max-width:900px){.dht-files-bar{grid-template-columns:minmax(0,1fr) 190px}}

.dht-files{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px;text-transform:none}
.dht-files-bar{display:grid;grid-template-columns:minmax(0,1fr) 260px;gap:14px;align-items:center;min-height:40px;flex-shrink:0}
.dht-files-kinds{min-width:0;overflow:hidden;display:flex;gap:4px;align-items:center;flex-wrap:nowrap;padding:4px;border-radius:calc(var(--dht-hub-pill) + 4px);background:var(--dht-hub-panel);box-shadow:var(--dht-hub-shadow);outline:2px solid transparent;outline-offset:2px}
.dht-files-kinds[data-focused=true]{outline-color:var(--dht-hub-accent)}
.dht-files-kind-scroll{display:flex;align-items:center;gap:4px;min-width:0;flex:1;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;overscroll-behavior:contain}.dht-files-kind-scroll button{flex-shrink:0}.dht-files-glyph{flex-shrink:0}
.dht-files-kinds button{background:transparent;padding:7px 12px;border-radius:var(--dht-hub-pill);color:var(--dht-hub-card-sub)!important;font-size:13px;font-weight:600;white-space:nowrap}
.dht-files-kinds button[data-active=true]{background:var(--dht-hub-accent);color:var(--dht-hub-accent-text)!important}
.dht-files-glyph{font-size:10px;font-weight:800;padding:3px 6px;border-radius:5px;border:1px solid var(--dht-hub-line);color:var(--dht-hub-card-sub);opacity:.8}
.dht-files-search{flex:1 1 200px;min-width:160px;display:flex;align-items:center;gap:8px;background:var(--dht-hub-panel);color:var(--dht-hub-card-text);border-radius:var(--dht-hub-pill);padding:0 12px;border:2px solid transparent;box-shadow:var(--dht-hub-shadow);height:40px}
.dht-files-search[data-focused=true],.dht-files-search:focus-within{border-color:var(--dht-hub-accent)}
.dht-files-search span{color:var(--dht-hub-card-sub)}.dht-files-search input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:inherit;font:inherit;font-size:14px}
.dht-files-search input::placeholder{color:var(--dht-hub-card-sub)}.dht-files-search input::-webkit-search-cancel-button{display:none}
.dht-files-sub{min-height:26px;box-sizing:border-box;display:flex;gap:6px 16px;align-items:center;flex-wrap:wrap;font-size:12px;color:var(--dht-hub-sub)}
.dht-files-sources{display:flex;gap:4px;align-items:center}.dht-files-sources button{background:transparent;color:var(--dht-hub-sub)!important;padding:3px 9px;border-radius:var(--dht-hub-pill);border:1px solid var(--dht-hub-line)!important;font-size:12px}
.dht-files-sources button[data-active=true]{background:var(--dht-hub-tab);color:var(--dht-hub-tab-text)!important}.dht-files-sources i{font-style:normal;opacity:.7;margin-left:4px}
.dht-files-status{margin-left:auto;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;max-width:100%}
.dht-files-layout{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) var(--dht-hub-detail-w,300px);gap:var(--dht-hub-gap,22px)}
.dht-files-grid{overflow:auto;min-height:0;display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--dht-hub-card-min,180px),1fr));gap:14px;align-content:start;grid-auto-rows:max-content;padding:6px;scroll-padding:8px}
.dht-files-card{display:flex;flex-direction:column;text-align:left;background:var(--dht-hub-panel);color:var(--dht-hub-card-text)!important;border-radius:var(--dht-hub-radius);overflow:hidden;box-shadow:var(--dht-hub-shadow);min-width:0;padding:0 0 10px;transition:transform .12s,box-shadow .12s}
.dht-files-card[data-current=true]{background:var(--dht-hub-panel-hi)}.dht-files-card[data-selected=true]{box-shadow:var(--dht-hub-ring);transform:translateY(-2px)}
.dht-files-art{position:relative;display:grid;place-items:center;aspect-ratio:16/9;background:linear-gradient(135deg,color-mix(in srgb,var(--dht-hub-accent) 22%,#1b2230),#0d1118);overflow:hidden}
.dht-files-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain;z-index:1}.dht-files-art b{font-size:30px;color:#fff;opacity:.35}
.dht-files-card strong{display:block;font-size:13px;margin:9px 10px 2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-files-card small{display:block;font-size:11px;margin:0 10px;color:var(--dht-hub-card-sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-files-more{grid-column:1/-1;min-height:56px;flex-direction:row;align-items:center;justify-content:center;gap:12px;padding:12px 18px;border:1px solid var(--dht-hub-line);font:inherit;background:var(--dht-hub-tab);color:var(--dht-hub-tab-text)!important}.dht-files-more strong,.dht-files-more small{margin:0;color:inherit}.dht-files-more:disabled{opacity:.65;cursor:wait}
.dht-files-empty{grid-column:1/-1;display:flex;flex-direction:column;gap:6px;padding:28px;border:1px dashed var(--dht-hub-line);border-radius:var(--dht-hub-radius);color:var(--dht-hub-sub)}
.dht-files-empty strong{color:var(--dht-hub-text);font-size:16px}
.dht-files-detail{overflow:auto;min-height:0;padding:14px;border-radius:var(--dht-hub-radius);background:var(--dht-hub-panel);color:var(--dht-hub-card-text);box-shadow:var(--dht-hub-shadow);outline:2px solid transparent;outline-offset:-2px}
.dht-files-detail[data-focused=true]{outline-color:color-mix(in srgb,var(--dht-hub-accent) 55%,transparent)}
.dht-files-preview{position:relative;aspect-ratio:16/9;border-radius:calc(var(--dht-hub-radius)*.7);overflow:hidden;background:#0b0e14;display:grid;place-items:center;color:#fff8;font-size:12px}
.dht-files-preview img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
.dht-files-detail h3{font-size:18px;line-height:1.2;margin:12px 0 4px;letter-spacing:var(--dht-hub-track);overflow-wrap:anywhere}
.dht-files-by{display:block;color:var(--dht-hub-card-sub);font-size:12px;margin-bottom:10px}
.dht-files-actions{display:flex;flex-direction:column;gap:8px}
.dht-files-actions button{width:100%;text-align:left;padding:10px 12px;border-radius:var(--dht-hub-pill);background:var(--dht-hub-line);font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;outline:2px solid transparent;outline-offset:2px}
.dht-files-actions .dht-files-dl{background:color-mix(in srgb,var(--dht-hub-accent) 18%,var(--dht-hub-line))}
.dht-files-actions button[data-active=true]{outline-color:var(--dht-hub-accent)}
.dht-files-action[data-confirm=true] .dht-files-dl{background:var(--dht-hub-accent);color:var(--dht-hub-accent-text)!important;font-weight:700}
.dht-files-confirm{margin:6px 2px 2px;font-size:12px;line-height:1.5;color:var(--dht-hub-card-sub)}
.dht-files-note{font-size:12px;color:var(--dht-hub-card-sub)}
.dht-files-message{font-size:12px;line-height:1.5;padding:8px 10px;border-radius:8px;background:var(--dht-hub-notice-bg);color:var(--dht-hub-notice-text)}
.dht-files-message[data-ok=true]{background:color-mix(in srgb,#2fbf71 18%,transparent);color:var(--dht-hub-card-text)}
.dht-files-credit{font-size:11px;line-height:1.5;color:var(--dht-hub-card-sub);opacity:.85;margin:12px 0 0}
.dht-files-foot{display:flex;gap:6px 16px;flex-wrap:wrap;justify-content:space-between;font-size:11px;color:var(--dht-hub-sub)}
.dht-files-attribution button{background:transparent;color:var(--dht-hub-accent);padding:0 2px;font-size:11px}.dht-files-attribution em{font-style:normal;opacity:.75}
@container dht-hub (max-width:900px){.dht-files-kinds button{padding:5px 8px;font-size:12px}.dht-files-glyph{display:inline-block;padding:2px 4px;font-size:9px}.dht-files-card strong{font-size:12px}.dht-files-hints{display:none}}
@container dht-hub (max-height:600px){.dht-files{gap:6px}.dht-files-sub{font-size:11px}.dht-files-search{height:34px}.dht-files-kinds{padding:2px}.dht-files-detail{padding:10px}.dht-files-detail h3{font-size:15px;margin-top:8px}}
`;
