import { t } from "./i18n";
// Hub > Theme files: theme files for the theme-file importers (PSP, PS3, Vita, Switch, Wii U, 3DS, Wii, Xbox), listed
// from public sites at runtime by the backend (py_modules/theme_sources.py) with the source and the creator named on
// every entry. Nothing is downloaded until the user confirms it here; files land in <data>/skins/<kind>/.
// The Hub routes controller presses here through `inputRef` (Marketplace.tsx).
import { Navigation } from "@decky/ui";
import { callable } from "@decky/api";
import { MutableRefObject, useEffect, useMemo, useRef, useState } from "react";
import { opensKeyboardOnTap, showSteamKeyboard } from "./steamKeyboard";
import type { InputHandler } from "./input";
import { resourcesChangedOnClose } from "./marketplaceState";
import { playSound } from "./steam";

type Source = { id?: string; name: string; url: string; credit: string };
type Kind = { id: string; label: string; dir: string; exts: string[]; sources: string[] };
type Kinds = { kinds: Kind[]; sources: Record<string, Source>; notBuilt: { name: string; url: string; kinds: string[]; why: string }[] };
type FileRef = { name: string; size: number };
export type SourceItem = { id: string; name: string; author: string; image: string; page: string; downloads?: number; tag?: string; file?: FileRef; files?: FileRef[] | null };
type Page = { kind: string; page: number; pages: number; total: number; items: SourceItem[]; source: Source; error?: string; skipped?: number };
type Progress = { busy: boolean; percent: number; message: string };

const listKinds = callable<[], Kinds>("theme_sources");
const browse = callable<[kind: string, source: string, query: string, page: number, refresh: boolean], Page>("theme_sources_browse");
const itemFiles = callable<[kind: string, ident: string], { files: FileRef[]; error?: string }>("theme_sources_files");
const download = callable<[kind: string, source: string, ident: string, file: string, name: string], { success: boolean; name?: string; already?: boolean; error?: string }>("theme_sources_download");
const downloadProgress = callable<[], Progress>("theme_sources_progress");

const openUrl = (url?: string) => { if (url && /^https:\/\//.test(url)) Navigation.NavigateToSteamWeb(url); };
const mb = (n: number) => n >= 1048576 ? `${(n / 1048576).toFixed(1)} MB` : n ? `${Math.max(1, Math.round(n / 1024))} KB` : "";
const KIND_HINT: Record<string, string> = { psp: "PSP", p3t: "PS3", vita: "PS Vita", switch: "Switch", wiiu: "Wii U", "3ds": "3DS", wii: "Wii", xbox: "Xbox" };
const hintFor = (kind: string) => `Choose it in the ${KIND_HINT[kind] ?? ""} theme's Theme options${kind === "wiiu" ? " (Wii U themes also need your own menu files)" : ""}.`;

export function ThemeFiles({ inputRef }: { inputRef: MutableRefObject<InputHandler | null> }) {
  const [kinds, setKinds] = useState<Kinds | null>(null);
  const [kind, setKind] = useState("psp");
  const [source, setSource] = useState("");
  const [query, setQuery] = useState("");
  const [typed, setTyped] = useState("");
  const [items, setItems] = useState<SourceItem[]>([]);
  const [info, setInfo] = useState<Page | null>(null);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(0);
  const [zone, setZone] = useState<"kinds" | "grid" | "detail" | "search">("kinds");
  const [action, setAction] = useState(0); // the highlighted button of the detail panel
  const [confirm, setConfirm] = useState<FileRef | null>(null);
  const [files, setFiles] = useState<Record<string, FileRef[] | { error: string }>>({});
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const [message, setMessage] = useState<{ text: string; ok?: boolean } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const alive = useRef(true);
  useEffect(() => { alive.current = true; listKinds().then(k => { if (alive.current) setKinds(k); }).catch(() => {}); return () => { alive.current = false; inputRef.current = null; }; }, []);
  const kindInfo = kinds?.kinds.find(k => k.id === kind);
  const src = source || kindInfo?.sources[0] || "";
  const srcInfo = kinds?.sources[src];
  // one page at a time; "Show more" appends the next page
  const load = (page: number, refresh = false) => {
    if (!src) return;
    setLoading(true);
    const key = `${kind}|${src}|${query}`;
    browse(kind, src, query, page, refresh).then(r => {
      if (!alive.current || key !== `${kind}|${src}|${query}`) return;
      setInfo(r); setItems(prev => page > 1 ? [...prev, ...r.items.filter(i => !prev.some(p => p.id === i.id))] : r.items);
    }).catch(e => { if (alive.current) setInfo({ kind, page, pages: 1, total: 0, items: [], source: srcInfo as Source, error: String(e) }); })
      .finally(() => { if (alive.current) setLoading(false); });
  };
  useEffect(() => { setItems([]); setInfo(null); setSelected(0); setConfirm(null); setMessage(null); load(1); }, [kind, src, query, !!kinds]);
  const more = !!info && info.page < info.pages;
  const count = items.length + (more ? 1 : 0); // the "Show more" card is the last cell
  const current: SourceItem | undefined = items[Math.min(selected, items.length - 1)];
  // archive.org items list their files; the others are one file each
  const fileList: FileRef[] | null = !current ? null : current.files !== undefined
    ? (current.files ?? (Array.isArray(files[current.id]) ? files[current.id] as FileRef[] : null)) : [current.file || { name: "", size: 0 }];
  useEffect(() => {
    if (!current || current.files !== null || files[current.id]) return;
    let live = true;
    itemFiles(kind, current.id).then(r => { if (live) setFiles(f => ({ ...f, [current.id]: r.error ? { error: r.error } : r.files })); }).catch(() => {});
    return () => { live = false; };
  }, [current?.id]);
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

  const switchKind = (delta: number) => {
    const list = kinds?.kinds ?? []; if (!list.length) return;
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
    setBusy(true); setMessage(null); setProgress({ busy: true, percent: 0, message: "Connecting…" });
    try {
      const r = await download(kind, src, current.id, src === "archive" ? file.name : "", current.name);
      if (!alive.current) return;
      if (!r.success) setMessage({ text: r.error || "Download failed." });
      else {
        setMessage({ ok: true, text: `${r.already ? "Already saved" : "Saved"} to ${kindInfo?.dir}/ as “${r.name}”. ${hintFor(kind)}` });
        resourcesChangedOnClose();
      }
    } catch (e) { if (alive.current) setMessage({ text: String(e) }); }
    finally { if (alive.current) { setBusy(false); setConfirm(null); } }
  };
  // detail buttons: one per file (or one Download), then "Source page"
  const actions = (fileList ?? []).length + 1;
  const pressAction = (i: number) => {
    const list = fileList ?? [];
    if (i >= list.length) { openUrl(current?.page); return; }
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
    if (p.btn === "x" && !p.repeat) { if (zone === "kinds") cycleSource(); else openUrl(current?.page); return true; }
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
  const kindList = kinds?.kinds ?? [];
  const notBuilt = useMemo(() => (kinds?.notBuilt ?? []).filter(n => n.kinds.includes(kind)), [kinds, kind]);
  return <section className="dht-files" aria-label={t("themeFiles")}>
    <style>{FILES_CSS}</style>
    <div className="dht-files-bar">
      <div className="dht-files-kinds" role="tablist" aria-label={t("console")} data-focused={zone === "kinds"}>
        <span className="dht-files-glyph" aria-hidden="true">L2</span>
        {kindList.map(k => <button key={k.id} role="tab" aria-selected={k.id === kind} data-active={k.id === kind} onClick={() => { setKind(k.id); setSource(""); setQuery(""); setTyped(""); setZone("kinds"); }}>{k.label}</button>)}
        <span className="dht-files-glyph" aria-hidden="true">R2</span>
      </div>
      <label className="dht-files-search" data-focused={zone === "search"}>
        <span aria-hidden="true">⌕</span>
        <input ref={searchRef} {...opensKeyboardOnTap} type="search" aria-label={t("searchThemeFiles")} placeholder={t("searchConsoleThemesPlaceholder", { console: kindInfo?.label ?? "" })} value={typed}
          onFocus={() => setZone("search")} onChange={e => setTyped(e.target.value)}
          onKeyDown={e => { e.stopPropagation(); if (e.key === "Enter" || e.key === "ArrowDown") { e.preventDefault(); leaveSearch(true); } if (e.key === "Escape") { e.preventDefault(); searchRef.current?.blur(); setTyped(query); setZone("kinds"); } }} />
      </label>
    </div>
    <div className="dht-files-sub">
      <span className="dht-files-sources">From {(kindInfo?.sources ?? []).map(s => <button key={s} data-active={s === src} onClick={() => setSource(s)}>{kinds?.sources[s]?.name ?? s}</button>)}{(kindInfo?.sources.length ?? 0) > 1 && <i>{t("xSwitches")}</i>}</span>
      <span className="dht-files-status" role="status">{loading && !items.length ? "Loading…" : info?.error ? info.error : `${info?.total ?? 0} ${query ? `results for “${query}”` : "themes"} · saved to ${kindInfo?.dir ?? "skins"}/`}</span>
    </div>
    <div className="dht-files-layout">
      <div className="dht-files-grid" ref={gridRef} data-focused={zone === "grid"}>
        {!items.length && !loading && <div className="dht-files-empty"><strong>{info?.error ? t("sourceNotReachable") : t("nothingHereYet")}</strong><span>{info?.error ? t("installedThemeFilesOffline") : query ? t("tryFewerWords") : t("pickAnotherConsole")}</span></div>}
        {items.map((it, i) => <button key={it.id} className="dht-files-card" data-current={i === selected} data-selected={zone === "grid" && i === selected}
          onClick={() => { setSelected(i); setZone("detail"); setAction(0); }} onFocus={() => setSelected(i)}>
          <span className="dht-files-art">{it.image ? <img src={it.image} alt="" loading="lazy" referrerPolicy="no-referrer" onError={e => { e.currentTarget.style.display = "none"; }} /> : null}<b>{it.name.slice(0, 1)}</b></span>
          <strong>{it.name}</strong>
          <small>{it.author ? `by ${it.author}` : it.tag || srcInfo?.name}{it.downloads ? ` · ↓ ${it.downloads.toLocaleString()}` : ""}</small>
        </button>)}
        {more && <button className="dht-files-card dht-files-more" data-current={moreCard} data-selected={zone === "grid" && moreCard} onClick={() => choose(items.length)} disabled={loading}>
          <span className="dht-files-art"><b>{loading ? "…" : "+"}</b></span><strong>{loading ? "Loading…" : "Show more"}</strong><small>{items.length} of {info?.total}</small></button>}
      </div>
      <aside className="dht-files-detail" ref={detailRef} data-focused={zone === "detail"}>
        {current ? <>
          <div className="dht-files-preview">{current.image ? <img key={current.id} src={current.image} alt={`${current.name} preview`} referrerPolicy="no-referrer" onError={e => { e.currentTarget.style.display = "none"; }} /> : <span>{t("noPreview")}</span>}</div>
          <h3>{current.name}</h3>
          <small className="dht-files-by">{current.author ? `by ${current.author} · ` : ""}{srcInfo?.name}{current.tag ? ` · ${current.tag}` : ""}</small>
          {fileList === null ? <p className="dht-files-note">{(files[current.id] as any)?.error ?? t("readingItemFiles")}</p> : <div className="dht-files-actions">
            {fileList.map((f, i) => {
              const asking = confirm?.name === f.name;
              return <div key={f.name || i} className="dht-files-action" data-confirm={asking}>
                <button className="dht-files-dl" data-active={zone === "detail" && action === i} disabled={busy} onClick={() => { setZone("detail"); setAction(i); pressAction(i); }}>
                  {busy && asking ? `${progress?.percent ?? 0}% · ${progress?.message || "Downloading…"}` : asking ? `{t("confirmDownloadA")}` : `↓ ${fileList.length > 1 || src === "archive" ? f.name.split("/").pop() : "Download"}${f.size ? ` · ${mb(f.size)}` : ""}`}
                </button>
                {asking && !busy && <p className="dht-files-confirm" role="alertdialog">Download {src === "archive" ? `“${f.name.split("/").pop()}”` : "this theme"} from {srcInfo?.name} into <b>{kindInfo?.dir}/</b>? {src === "archive" ? "It was uploaded by an archive.org user and is not checked by ThemeHub. " : src === "ps3pro" || src === "shenron0" ? "It comes from a public GitHub collection and is not checked by ThemeHub. " : ""}A confirms · B cancels.</p>}
              </div>;
            })}
            {!fileList.length && <p className="dht-files-note">No {kindInfo?.exts.join(" / ")} files in this item.</p>}
            <button className="dht-files-page" data-active={zone === "detail" && action === fileList.length} onClick={() => openUrl(current.page)}>{t("sourcePageLink")}</button>
          </div>}
          {message && <p className="dht-files-message" data-ok={!!message.ok} role="status">{message.text}</p>}
          <p className="dht-files-credit">{srcInfo?.credit}</p>
        </> : <div className="dht-files-note">{loading ? "Loading…" : t("chooseThemeToSeeHere")}</div>}
      </aside>
    </div>
    <div className="dht-files-foot">
      <span className="dht-files-attribution">{t("themeDataLabel")} <button type="button" onClick={() => openUrl(srcInfo?.url)}>{srcInfo?.name ?? "…"} ↗</button>{notBuilt.length > 0 && <em> · Not available: {notBuilt.map(n => n.name).join(", ")}</em>}</span>
      <span className="dht-files-hints">{zone === "search" ? "Type · ↓ Results · B Done" : zone === "detail" ? "↑↓ Choose · A Download (asks first) · X Source page · B Back" : "L2/R2 Console · ☰ Search · X " + (zone === "kinds" ? "Source" : "Source page") + " · A Open"}</span>
    </div>
  </section>;
}

const FILES_CSS = `
.dht-files{flex:1;min-height:0;display:flex;flex-direction:column;gap:10px;text-transform:none}
.dht-files-bar{display:flex;gap:14px;align-items:center;flex-wrap:wrap}
.dht-files-kinds{display:flex;gap:4px;align-items:center;flex-wrap:wrap;padding:4px;border-radius:calc(var(--dht-hub-pill) + 4px);background:var(--dht-hub-panel);box-shadow:var(--dht-hub-shadow);outline:2px solid transparent;outline-offset:2px}
.dht-files-kinds[data-focused=true]{outline-color:var(--dht-hub-accent)}
.dht-files-kinds button{background:transparent;padding:7px 12px;border-radius:var(--dht-hub-pill);color:var(--dht-hub-card-sub)!important;font-size:13px;font-weight:600;white-space:nowrap}
.dht-files-kinds button[data-active=true]{background:var(--dht-hub-accent);color:var(--dht-hub-accent-text)!important}
.dht-files-glyph{font-size:10px;font-weight:800;padding:3px 6px;border-radius:5px;border:1px solid var(--dht-hub-line);color:var(--dht-hub-card-sub);opacity:.8}
.dht-files-search{flex:1 1 200px;min-width:160px;display:flex;align-items:center;gap:8px;background:var(--dht-hub-panel);color:var(--dht-hub-card-text);border-radius:var(--dht-hub-pill);padding:0 12px;border:2px solid transparent;box-shadow:var(--dht-hub-shadow);height:40px}
.dht-files-search[data-focused=true],.dht-files-search:focus-within{border-color:var(--dht-hub-accent)}
.dht-files-search span{color:var(--dht-hub-card-sub)}.dht-files-search input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:inherit;font:inherit;font-size:14px}
.dht-files-search input::placeholder{color:var(--dht-hub-card-sub)}.dht-files-search input::-webkit-search-cancel-button{display:none}
.dht-files-sub{display:flex;gap:6px 16px;align-items:center;flex-wrap:wrap;font-size:12px;color:var(--dht-hub-sub)}
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
.dht-files-more .dht-files-art{background:var(--dht-hub-line)}.dht-files-more b{opacity:.8}
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
@container dht-hub (max-width:900px){.dht-files-kinds button{padding:5px 8px;font-size:12px}.dht-files-glyph{display:none}.dht-files-card strong{font-size:12px}.dht-files-hints{display:none}}
@container dht-hub (max-height:600px){.dht-files{gap:6px}.dht-files-sub{font-size:11px}.dht-files-search{height:34px}.dht-files-kinds{padding:2px}.dht-files-detail{padding:10px}.dht-files-detail h3{font-size:15px;margin-top:8px}}
`;
