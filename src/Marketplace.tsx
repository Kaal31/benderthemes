import { PluginSpotlight, openSpotlightProject } from "./PluginSpotlight";
import { SPOTLIGHT_PLUGINS } from "./spotlightCatalog";
import { callable } from "@decky/api";
import { useEffect, useRef, useState } from "react";
import { pushModalInput } from "./input";
import { getSettings, THEMES, ThemeId, updateSettings } from "./settings";
import { closeMarketplace, resourcesChanged } from "./marketplaceState";
import { refreshPacks } from "./steam";
import { refreshPresets } from "./presets";
import { deleteTheme } from "./themeActions";

export type ThemePack = { id: string; name: string; theme: ThemeId | null; description: string; size: number; version: string; installedVersion?: string; compatible: boolean; preview?: string; poster?: string };
type Progress = { busy: boolean; id: string; percent: number; message: string };
const catalog = callable<[refresh: boolean], { themes: ThemePack[]; error?: string; progress: Progress }>("theme_catalog");
const download = callable<[ident: string], { success: boolean; error?: string }>("theme_install");
const downloadProgress = callable<[], Progress>("theme_download_progress");
export const inventory = callable<[], Record<string, string>>("theme_inventory");

export function Marketplace({ requested }: { requested?: ThemeId }) {
  const [spotlight, setSpotlight] = useState(false);
  const [spotlightSelected, setSpotlightSelected] = useState(0);
  const [packs, setPacks] = useState<ThemePack[]>([]);
  const [selected, setSelected] = useState(0);
  const [installedOnly, setInstalledOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  const alive = useRef(true);
  const listRef = useRef<HTMLDivElement>(null);
  const filtered = packs.filter(p => !!p.theme && (!installedOnly || !!p.installedVersion));
  const current = filtered[Math.min(selected, Math.max(0, filtered.length - 1))];
  const load = async (refresh = false) => {
    setLoading(true);
    try {
      const result = await catalog(refresh);
      if (!alive.current) return;
      setPacks(result.themes); setError(result.error || "");
      setProgress(result.progress); setBusy(result.progress.busy);
    } catch (e) { if (alive.current) setError(`Cannot load themes: ${e}`); }
    finally { if (alive.current) setLoading(false); }
  };
  useEffect(() => {
    alive.current = true; void load();
    return () => { alive.current = false; };
  }, []);
  useEffect(() => {
    if (requested) { const i = packs.filter(p => p.theme).findIndex(p => p.theme === requested); if (i >= 0) setSelected(i); }
  }, [requested, packs.length]);
  useEffect(() => {
    listRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [selected, installedOnly]);
  useEffect(() => {
    if (!busy) return;
    let pending = false;
    const timer = setInterval(async () => {
      if (pending) return;
      pending = true;
      try { const value = await downloadProgress(); if (alive.current) { setProgress(value); if (!value.busy && value.percent === 100) { setBusy(false); void load(); } } }
      catch { /* The install response carries actionable errors. */ }
      finally { pending = false; }
    }, 600);
    return () => clearInterval(timer);
  }, [busy]);
  const activate = async () => {
    if (!current || busy || loading || !current.compatible) return;
    setBusy(true); setMessage("");
    try {
      if (!current.installedVersion || (current.installedVersion !== "legacy" && current.installedVersion !== current.version)) {
        const result = await download(current.id);
        if (!result.success) throw new Error(result.error || "Download failed");
      }
      await Promise.all([refreshPacks(), refreshPresets()]);
      if (current.theme) updateSettings(s => ({ theme: current.theme!, enabled: true, hiddenThemes: (s.hiddenThemes || []).filter(t => t !== current.theme) }));
      closeMarketplace(); resourcesChanged();
    } catch (e) { if (alive.current) setMessage(String(e)); }
    finally { if (alive.current) setBusy(false); }
  };
  const deletePack = async () => {
    if (!current?.installedVersion || busy || !current.theme) return;
    setBusy(true);
    try {
      await deleteTheme(current.theme);
      await load(); setMessage("Theme deleted and hidden. You can download it again anytime.");
    } catch (e) { if (alive.current) setMessage(String(e)); }
    finally { if (alive.current) setBusy(false); }
  };
  const actions = useRef({ activate, busy, filtered, selected, installedOnly, spotlight, spotlightSelected });
  actions.current = { activate, busy, filtered, selected, installedOnly, spotlight, spotlightSelected };
  useEffect(() => pushModalInput(p => {
    const a = actions.current;
    if (p.btn === "b") { closeMarketplace(); return true; }
    if (a.busy) return true;
    if ((p.btn === "l1" || p.btn === "r1") && !p.repeat) {
      const tab = a.spotlight ? 2 : a.installedOnly ? 1 : 0;
      const next = (tab + (p.btn === "r1" ? 1 : 2)) % 3;
      setSpotlight(next === 2); setInstalledOnly(next === 1); setSelected(0); return true;
    }
    if (a.spotlight) {
      if (p.btn === "x" && !p.repeat) openSpotlightProject(a.spotlightSelected);
      if (p.btn === "a" && !p.repeat) document.querySelector<HTMLButtonElement>(".spotlight-detail .market-primary")?.click();
      if (["up","down","left","right"].includes(p.btn)) setSpotlightSelected(Math.max(0,Math.min(SPOTLIGHT_PLUGINS.length-1,a.spotlightSelected+(["up","left"].includes(p.btn)?-1:1))));
      return true;
    }
    if (p.btn === "a" && !p.repeat) void a.activate();
    if (["up", "down", "left", "right"].includes(p.btn)) {
      const delta = p.btn === "up" ? -2 : p.btn === "down" ? 2 : p.btn === "left" ? -1 : 1;
      setSelected(Math.max(0, Math.min(a.filtered.length - 1, a.selected + delta)));
    }

    return true;
  }), []);
  const installed = packs.filter(p => p.installedVersion && p.theme).length;
  return <div className="dht-market" role="dialog" aria-modal="true" aria-label="Hub">
    <style>{MARKET_CSS}</style>
    <header><div><span className="market-eyebrow">DECK HOME THEMES</span><h1>Hub</h1><p>Pick a theme and make it yours.</p></div><button className="market-close" onClick={closeMarketplace}>✕ <span>Back</span></button></header>
    <div className="market-toolbar"><div><button data-active={!spotlight && !installedOnly} onClick={() => { setSpotlight(false); setInstalledOnly(false); setSelected(0); }}>Discover <small>{packs.filter(p => p.theme).length}</small></button><button data-active={!spotlight && installedOnly} onClick={() => { setSpotlight(false); setInstalledOnly(true); setSelected(0); }}>Your themes <small>{installed}</small></button><button data-active={spotlight} onClick={() => setSpotlight(true)}>Plugin Spotlight</button></div><button disabled={busy || loading} onClick={() => void load(true)}>{loading ? "Refreshing…" : "↻ Refresh"}</button></div>
    {error && <div className="market-notice">{error} · Showing saved catalog. Installed themes still work offline.</div>}
    {spotlight ? <PluginSpotlight selected={spotlightSelected} onSelect={setSpotlightSelected}/> : <main><div className="market-grid" ref={listRef}>
      {!filtered.length && <p>{loading ? "Loading your next home…" : installedOnly ? "Your collection starts here. Browse Discover to download a theme." : "No themes are available yet. Try Refresh."}</p>}
      {filtered.map((pack, i) => <button key={pack.id} className="market-card" data-selected={i === selected} onClick={() => setSelected(i)} onFocus={() => setSelected(i)}>
        <div className="market-art" data-theme={pack.id}>{pack.poster ? <img src={pack.poster} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }} /> : <span>{pack.name}</span>}</div>
        <div className="market-card-title"><strong>{pack.name}</strong><span>{(pack.size / 1048576).toFixed(1)} MB</span></div>
        <p>{THEMES.find(t => t.id === pack.theme)?.blurb || pack.description}</p>
      </button>)}
    </div><aside>{current && <>
      <div className="market-detail-art" data-theme={current.id}>{current.preview || current.poster ? <img key={current.id} src={current.preview || current.poster} alt={`${current.name} animated preview`} /> : <span>Preview coming soon</span>}</div>
      <h2>{current.name}</h2><p>{current.description}</p>
      <dl><div><dt>Download</dt><dd>{(current.size / 1048576).toFixed(1)} MB</dd></div><div><dt>Version</dt><dd>{current.version}</dd></div><div><dt>Available offline</dt><dd>{current.installedVersion ? "Ready to play" : "After download"}</dd></div></dl>
      <button className="market-primary" disabled={busy || loading || !current.compatible} onClick={() => void activate()}>{busy ? `${progress?.percent || 0}% · ${progress?.message || "Preparing…"}` : !current.compatible ? "Coming soon" : (current.installedVersion === "legacy" || current.installedVersion === current.version) ? "Activate theme  →" : current.installedVersion ? "Update & activate  ↓" : "Download theme  ↓"}</button>
      {busy && <progress max={100} value={progress?.percent || 0} />}
      {current.installedVersion && <button className="market-remove" disabled={busy || current.theme === getSettings().theme} onClick={() => void deletePack()}>Delete theme</button>}
      <small>Your settings are kept when you switch themes.</small>
    </>}</aside></main>}
    {message && <div className="market-notice" role="status">{message}</div>}
    <footer><span>✦ A home for every mood</span><span>LB / RB Browse · D-pad Choose · A Select · B Back</span></footer>
  </div>;
}

const MARKET_CSS = `
.dht-market .market-grid{grid-auto-rows:216px}.dht-market .market-card{height:216px;min-height:216px}
.dht-market{position:absolute;inset:0;z-index:400;background:#0d1017;color:#f7f6fa;display:flex;flex-direction:column;padding:30px 38px 18px;box-sizing:border-box;font:15px system-ui,Arial,sans-serif;letter-spacing:0;--accent:#d4f780}
.dht-market *{box-sizing:border-box}.dht-market button{font:inherit;color:inherit;cursor:pointer;border:0}.dht-market button:disabled{opacity:.45;cursor:default}.dht-market button:focus-visible{outline:3px solid var(--accent);outline-offset:3px}
.dht-market header{display:flex;justify-content:space-between;align-items:flex-start;gap:20px}.market-eyebrow{font-size:10px;letter-spacing:2px;color:#a9b291;font-weight:700}.dht-market h1{font-size:34px;letter-spacing:-1.2px;margin:8px 0}.dht-market header p{margin:0;color:#999fae;font-size:13px}.market-close{background:#252934;padding:10px 14px;border-radius:24px}.market-close span{margin-left:10px;font-size:12px}
.market-toolbar{display:flex;align-items:center;justify-content:space-between;margin:22px 0 18px;border-bottom:1px solid #292e38;padding-bottom:12px}.market-toolbar button{background:transparent;padding:8px 14px;color:#a7adba}.market-toolbar button[data-active=true]{background:#252c2c;color:var(--accent);border-radius:7px}.market-toolbar small{margin-left:10px;opacity:.6}
.dht-market main{display:grid;grid-template-columns:minmax(0,1fr) 290px;gap:30px;flex:1;min-height:0}.market-grid{overflow:auto;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:18px;align-content:start;padding:3px 8px 16px 3px}.market-card{text-align:left;background:#171c26;border-radius:10px;padding:0 0 14px;overflow:hidden;border:2px solid transparent!important;min-width:0}.market-card[data-selected=true]{border-color:var(--accent)!important;background:#252e30}.market-art{height:136px;position:relative;background:linear-gradient(135deg,#51698a,#1a273d);display:grid;place-items:center;overflow:hidden}.market-art img{width:100%;height:100%;object-fit:cover}.market-card-title{display:flex;justify-content:space-between;align-items:center;padding:12px 12px 0;gap:6px}.market-card-title strong{font-size:14px}.market-card-title span{font-size:10px;color:#acb5ba;white-space:nowrap}.market-card p{margin:6px 12px 0;font-size:11px;color:#a0a9b8;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-market aside{border-left:1px solid #292e38;padding-left:26px;overflow:auto}.market-detail-art{height:162px;border-radius:9px;overflow:hidden;background:#202934;margin-bottom:20px;display:grid;place-items:center}.market-detail-art img{width:100%;height:100%;object-fit:cover}.dht-market h2{font-size:26px;line-height:1.1;margin:10px 0}.dht-market aside p{font-size:12px;line-height:1.7;color:#a3adbd}.dht-market dl{border-top:1px solid #292e38;border-bottom:1px solid #292e38;padding:12px 0;margin:18px 0}.dht-market dl div{display:flex;justify-content:space-between;font-size:11px;margin:8px 0}.dht-market dt{color:#919eae}.dht-market dd{margin:0}.dht-market .market-primary{background:var(--accent);color:#152015;width:100%;border-radius:7px;padding:14px 10px;font-weight:700;font-size:13px}.dht-market .market-remove{background:transparent;width:100%;font-size:11px;padding:14px 0;color:#a7adba}.dht-market aside>small{display:block;text-align:center;color:#788492;font-size:10px;margin-top:12px}.dht-market progress{width:100%;accent-color:var(--accent)}.dht-market footer{display:flex;justify-content:space-between;border-top:1px solid #292e38;padding-top:14px;margin-top:18px;font-size:10px;color:#8a96a6}.market-notice{font-size:11px;line-height:1.5;color:#ebc98b;background:#302d23;padding:8px 12px;margin-bottom:10px;max-height:60px;overflow:auto}
@media(max-width:850px){.dht-market{padding:20px}.dht-market main{grid-template-columns:minmax(0,1fr) 240px;gap:18px}.dht-market h1{font-size:28px}.market-art{height:105px}.dht-market aside{padding-left:16px}}
`;
