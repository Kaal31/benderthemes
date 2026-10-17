import { PluginSpotlight } from "./PluginSpotlight";
import { ThemeFiles } from "./ThemeFiles";
import { CommunityThemes } from "./CommunityThemes";
import { Updates } from "./Updates";
import { useCommunityUpdates } from "./communityUpdates";
import { checkCommunityUpdates, invalidateCommunityUpdates } from "./communityUpdates";
import { callable } from "@decky/api";
import { refreshThemes } from "./engine/registry";
import { applyPreset, getPresets } from "./presets";
import { useEffect, useRef, useState } from "react";
import { InputHandler, pushModalInput } from "./input";
import { getSettings, THEMES, ThemeId, updateSettings, useSettings } from "./settings";
import { consoleThemeIds, hubStyle, hubThemeKey, hubVarsCss, HUB_DECO_CSS, resolveHubTheme } from "./hubStyles";
import { playThemeIntro } from "./themeIntro";
import { closeMarketplace, resourcesChanged, useResourceRevision } from "./marketplaceState";
import { playSound } from "./steam";
import { ensurePackInstalled, PackProgress, ThemeArt, themeCatalog, themeDownloadProgress } from "./themePacks";
import { deleteTheme } from "./themeActions";
import { HubLogo } from "./hubLogo";
import { BUILT_IN_THEMES, refreshInventory } from "./presets";
import { bonusThemeFeatures, BONUS_FEATURE_LABELS } from "./bonusThemeFeatures";

function BonusFeatureBadges({id}:{id:string}) {
  const features=bonusThemeFeatures(id);
  if(!features.length)return null;
  return <div className="dht-hub-feature-badges" aria-label="Bonus theme features">{features.map(feature=><span key={feature} className="dht-hub-feature-badge" data-feature={feature} title={BONUS_FEATURE_LABELS[feature].description}>{BONUS_FEATURE_LABELS[feature].label}</span>)}</div>;
}

export type ThemePack = { id: string; name: string; theme: ThemeId | null; description: string; size: number; version: string; installedVersion?: string; compatible: boolean; preview?: string; poster?: string; builtIn?: boolean; uiOverhaul?: boolean; community?: { repo: string; id: string; themeId?: string; updateAvailable: boolean } };
type CommunitySource = { repo: string; themes: { id: string; themeId?: string; name: string; description: string; size?: number; version: string; installedVersion?: string; compatible: boolean; preview?: string; uiOverhaul?: boolean; updateAvailable: boolean; layout?: ThemeId }[] };
const communityList = callable<[], { sources: CommunitySource[] }>("community_themes");
const communityPackage = callable<[repo: string, id: string, action: string], { ok: boolean; error?: string; themeId?: string }>("community_package");
const communityProgress = callable<[], PackProgress>("community_progress");
type Progress = PackProgress;
// catalog, download and progress calls are shared with the themed store's Themes section (themePacks.ts)
const catalog = themeCatalog, downloadProgress = themeDownloadProgress;
// the switchers' cache of downloaded themes is refreshed on every read (presets.ts)
export const inventory = refreshInventory;
// Built-in themes are always yours (unless deleted, i.e. hidden). Wii U and iiSU keep their catalog pack (art, sounds,
// music: extras that are not in the plugin ZIP), marked builtIn until it is downloaded; the others get a card of their own.
// Built-in themes come after the downloadable ones, as before.
const isBuiltIn = (id: string) => (BUILT_IN_THEMES as readonly string[]).includes(id);
const withBuiltIns = (themes: ThemePack[], art: ThemeArt = {}): ThemePack[] => [
  ...themes.filter(p => !isBuiltIn(p.id)),
  ...themes.filter(p => isBuiltIn(p.id)).map(p => ({ ...p, builtIn: false })),
  ...THEMES.filter(t => isBuiltIn(t.id) && !themes.some(p => p.id === t.id)).map(t => ({ id: t.id, theme: t.id, name: t.name, description: t.blurb, size: 0, version: "built-in", installedVersion: "built-in", compatible: true, builtIn: true, ...art[t.id] })),
];
/** A built-in theme whose optional extras are not downloaded yet. */
const extrasMissing = (p: ThemePack) => !!p.builtIn && !p.installedVersion;

type Tab = "discover" | "yours" | "community" | "files" | "spotlight";
const TABS: { id: Tab; name: string }[] = [{ id: "discover", name: "Discover" }, { id: "yours", name: "Your themes" }, { id: "community", name: "Community" }, { id: "files", name: "Theme files" }, { id: "spotlight", name: "Plugin Spotlight" }];
const upToDate = (p: ThemePack) => p.community ? !p.community.updateAvailable : p.installedVersion === "legacy" || p.installedVersion === p.version;

export function Marketplace({ requested, from, initialTab }: { requested?: ThemeId; from?: ThemeId; initialTab?: "community" }) {
  const communityUpdates = useCommunityUpdates();
  const [tab, setTab] = useState<Tab>(initialTab ?? "discover");
  const [updatesOpen, setUpdatesOpen] = useState(false);
  const updatesRoot = useRef<HTMLElement>(null);
  const tabInput = useRef<InputHandler | null>(null); // Theme files and Plugin Spotlight take the D-pad, A, X, ☰ and (when open) B
  const [packs, setPacks] = useState<ThemePack[]>([]);
  const [selected, setSelected] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState<Progress | null>(null);
  // The Hub's look follows the "Hub style" setting live: Auto = the console theme home it was opened on (`from`; it
  // follows a theme switch made while the Hub is open), a fixed choice = that console theme, Neutral = the default look.
  // A fixed console theme is only worn once it is installed (Auto also before its download); the inventory is re-read after every install or delete, so
  // installing a theme, switching theme or changing the control restyles the open Hub at once. See resolveHubTheme.
  const s = useSettings();
  const revision = useResourceRevision();
  const [inv, setInv] = useState<Record<string, string> | null>(null);
  const reloadInventory = () => inventory().then(i => { if (alive.current) setInv(i || {}); }).catch(() => {});
  useEffect(() => { void reloadInventory(); }, [revision]);
  // Hub style "Preview": the theme of the card focused in Discover (cards with a theme, as `filtered` below)
  const discoverFocus = tab === "discover" ? packs.filter(p => !!p.theme && !p.community)[selected]?.theme ?? null : null;
  const resolved = resolveHubTheme(s.hubStyle, from ? s.theme : undefined, inv, discoverFocus);
  const styled = resolved.theme ? { theme: resolved.theme, x360: s.x360?.style } : null;
  const source = resolved.source;
  const styleChoice = s.hubStyle || "auto";
  const styleOptions = [{ id: "auto", name: "Auto" }, { id: "neutral", name: "Neutral" }, { id: "preview", name: "Preview" },
    ...consoleThemeIds().filter(id => (inv ? !!inv[id] : false) || id === styleChoice).map(id => ({ id, name: THEMES.find(t => t.id === id)?.name ?? id }))];
  const cycleStyle = () => {
    const i = styleOptions.findIndex(o => o.id === styleChoice);
    updateSettings({ hubStyle: styleOptions[(i + 1) % styleOptions.length].id });
  };
  const hs = hubStyle(styled?.theme, styled?.x360);
  const alive = useRef(true);
  const listRef = useRef<HTMLDivElement>(null);
  const installedOnly = tab === "yours";
  const filtered = packs.filter(p => !!p.theme && (!p.community || installedOnly) && (!installedOnly || !!p.installedVersion || (!!p.builtIn && !s.hiddenThemes?.includes(p.theme))));
  const current = filtered[Math.min(selected, Math.max(0, filtered.length - 1))];
  const load = async (refresh = false) => {
    setLoading(true);
    try {
      if (refresh) await checkCommunityUpdates(true).catch(() => {});
      const [result, community] = await Promise.all([catalog(refresh), communityList().catch(() => ({ sources: [] as CommunitySource[] }))]);
      if (!alive.current) return;
      const installed = community.sources.flatMap(source => source.themes.filter(t => !!t.installedVersion).map(t => ({
        id: `community:${source.repo}:${t.id}`, name: t.name, theme: t.layout ?? (t.uiOverhaul ? "native" : "frame"), description: t.description,
        size: t.size ?? 0, version: t.version, installedVersion: t.installedVersion, compatible: t.compatible, preview: t.preview, poster: t.preview, uiOverhaul: t.uiOverhaul,
        community: { repo: source.repo, id: t.id, themeId: t.themeId, updateAvailable: t.updateAvailable }
      } satisfies ThemePack)));
      setPacks([...withBuiltIns(result.themes, result.art), ...installed]); setError(result.error || "");
      setProgress(result.progress); setBusy(result.progress.busy);
    } catch (e) { if (alive.current) setError(`Cannot load themes: ${e}`); }
    finally { if (alive.current) setLoading(false); }
  };
  useEffect(() => {
    alive.current = true; void load();
    return () => { alive.current = false; };
  }, []);
  useEffect(() => { if (alive.current && !busy) void load(); }, [communityUpdates]);
  useEffect(() => {
    if (requested) { const i = packs.filter(p => p.theme).findIndex(p => p.theme === requested); if (i >= 0) setSelected(i); }
  }, [requested, packs.length]);
  useEffect(() => {
    listRef.current?.querySelector('[data-selected="true"]')?.scrollIntoView?.({ block: "nearest" });
  }, [selected, tab]);
  useEffect(() => {
    if (!busy) return;
    let pending = false;
    const timer = setInterval(async () => {
      if (pending) return;
      pending = true;
      try { const value = await (current?.community ? communityProgress() : downloadProgress()); if (alive.current) setProgress(value); }
      catch { /* The install response carries actionable errors. */ }
      finally { pending = false; }
    }, 600);
    return () => clearInterval(timer);
  }, [busy]);
  const activate = async () => {
    if (!current || busy || loading || !current.compatible) return;
    setBusy(true); setMessage(""); const before = getSettings().theme;
    try {
      if (current.community) {
        let themeId = current.community.themeId;
        if (current.community.updateAvailable) {
          const result = await communityPackage(current.community.repo, current.community.id, "install");
          if (!result.ok) throw new Error(result.error || "Theme update failed");
          themeId = result.themeId ?? themeId;
        }
        await refreshThemes();
        const preset = getPresets().find(p => p.dataTheme === themeId && p.origin === "default");
        if (!preset) throw new Error("Theme could not be loaded. Check its manifest.");
        applyPreset(preset); invalidateCommunityUpdates(); closeMarketplace(); resourcesChanged();
        return;
      }
      await ensurePackInstalled(current);
      if (current.theme) updateSettings(s => ({ theme: current.theme!, enabled: true, hiddenThemes: (s.hiddenThemes || []).filter(t => t !== current.theme) }));
      closeMarketplace(); resourcesChanged();
      if (current.theme) playThemeIntro(current.theme, { switched: before !== current.theme });
    } catch (e) { if (alive.current) { setMessage(String(e)); void reloadInventory(); } }
    finally { if (alive.current) setBusy(false); }
  };
  const deletePack = async () => {
    if (!(current?.installedVersion || current?.builtIn) || busy || !current.theme) return;
    setBusy(true);
    try {
      if (current.community) {
        const result = await communityPackage(current.community.repo, current.community.id, "remove");
        if (!result.ok) throw new Error(result.error || "Uninstall failed");
        await refreshThemes(); invalidateCommunityUpdates(); await load(); setMessage("Theme uninstalled."); return;
      }
      await deleteTheme(current.theme);
      await load(); void reloadInventory(); setMessage("Theme deleted and hidden. You can download it again anytime.");
    } catch (e) { if (alive.current) setMessage(String(e)); }
    finally { if (alive.current) setBusy(false); }
  };
  const columns = () => {
    const cells = Array.from(listRef.current?.querySelectorAll<HTMLElement>(".dht-hub-card") ?? []);
    if (!cells.length) return 1;
    const n = cells.findIndex(c => c.offsetTop !== cells[0].offsetTop);
    return n < 0 ? cells.length : n;
  };
  const goTab = (t: Tab) => { setUpdatesOpen(false); setTab(t); setSelected(0); };
  const actions = useRef({ cycleStyle, activate, busy, filtered, selected, tab, columns, updatesOpen });
  actions.current = { cycleStyle, activate, busy, filtered, selected, tab, columns, updatesOpen };
  useEffect(() => pushModalInput(p => {
    const a = actions.current;
    if (a.updatesOpen) {
      if (p.btn === "b") { setUpdatesOpen(false); return true; }
      const controls = Array.from(updatesRoot.current?.querySelectorAll<HTMLElement>('button:not(:disabled),select,input,[tabindex="0"]') ?? []);
      const focused = document.activeElement as HTMLElement;
      if (p.btn === "a" && !p.repeat) { if (controls.includes(focused)) focused.click(); else controls[0]?.focus(); return true; }
      if (["up", "down", "left", "right"].includes(p.btn)) {
        const i = controls.indexOf(focused), delta = p.btn === "up" || p.btn === "left" ? -1 : 1;
        const next = controls[Math.max(0, Math.min(controls.length - 1, i < 0 ? 0 : i + delta))];
        next?.focus(); next?.scrollIntoView({block:"nearest"}); return true;
      }
    }
    const routed = a.tab === "spotlight" || a.tab === "files" || a.tab === "community";
    if (p.btn === "b" && routed && tabInput.current?.(p)) { playSound("back"); return true; } // close a confirmation / search box first
    if (p.btn === "b") { playSound("back"); closeMarketplace(); return true; }
    if (a.busy) return true;
    if (p.btn === "y" && !p.repeat) { playSound("select"); a.cycleStyle(); return true; }
    if ((p.btn === "l1" || p.btn === "r1") && !p.repeat) {
      const i = TABS.findIndex(t => t.id === a.tab);
      playSound("tab"); goTab(TABS[(i + (p.btn === "r1" ? 1 : TABS.length - 1)) % TABS.length].id); return true;
    }
    if (routed) return tabInput.current?.(p) ?? true; // ThemeFiles.tsx / PluginSpotlight.tsx
    if (p.btn === "a" && !p.repeat) { playSound("select"); void a.activate(); }
    if (["up", "down", "left", "right"].includes(p.btn)) {
      const c = a.columns();
      const delta = p.btn === "up" ? -c : p.btn === "down" ? c : p.btn === "left" ? -1 : 1;
      const next = Math.max(0, Math.min(a.filtered.length - 1, a.selected + delta));
      if (next !== a.selected) playSound("move");
      setSelected(next);
    }
    return true;
  }), []);
  const installed = packs.filter(p => p.installedVersion && p.theme).length;
  const count: Record<Tab, number | undefined> = { discover: packs.filter(p => p.theme && !p.community).length, yours: installed, community: communityUpdates.updateCount || undefined, files: undefined, spotlight: undefined };
  const styleName = styleOptions.find(o => o.id === styleChoice)?.name ?? "Auto";
  return <div className="dht-market dht-hub" data-hub-theme={hubThemeKey(styled?.theme, styled?.x360)} data-hub-styled={styled ? "true" : "false"} data-hub-source={source} data-hub-tab={tab} data-motion={s.animations} role="dialog" aria-modal="true" aria-label="Hub">
    <style>{hubVarsCss()}{HUB_DECO_CSS}{MARKET_CSS}</style><div className="dht-hub-deco" data-deco={styled ? hs.deco : "none"} aria-hidden="true"/>
    <header className="dht-hub-header">
      <div className="dht-hub-brand"><span className="market-eyebrow">DECK HOME THEMES</span><h1><HubLogo />Hub</h1><p className="dht-hub-tagline">{styled ? hs.tagline : "Pick a theme and make it yours."}</p></div>
      <nav className="market-toolbar dht-hub-tabs" aria-label="Hub sections">
        <kbd className="dht-hub-glyph" aria-hidden="true">LB</kbd>
        <div role="tablist">{TABS.map(t => <button key={t.id} role="tab" aria-selected={tab === t.id} data-active={tab === t.id} onClick={() => goTab(t.id)}>{t.name}{count[t.id] !== undefined && <small>{count[t.id]}</small>}</button>)}</div>
        <kbd className="dht-hub-glyph" aria-hidden="true">RB</kbd>
      </nav>
      <div className="dht-hub-headright">
        <button className="market-style" aria-pressed={updatesOpen} onClick={() => setUpdatesOpen(v => !v)}>Updates{communityUpdates.updateCount ? ` · ${communityUpdates.updateCount}` : ""}</button>
        <button className="market-style" onClick={cycleStyle} aria-label={`Hub style: ${styleName}`}><kbd>Y</kbd> Style <strong>{styleName}</strong></button>
        {(tab === "discover" || tab === "yours") && <button className="market-refresh" disabled={busy || loading} onClick={() => void load(true)} aria-label="Refresh">{loading ? "…" : "↻"}</button>}
        <button className="market-close" onClick={() => updatesOpen ? setUpdatesOpen(false) : closeMarketplace()} aria-label="Back"><kbd>B</kbd> Back</button>
      </div>
    </header>
    {error && (tab === "discover" || tab === "yours") && <div className="market-notice">{error} · Showing saved catalog. Installed themes still work offline.</div>}
    {updatesOpen ? <section ref={updatesRoot} className="dht-hub-updates" aria-label="Hub updates"><h2>Updates</h2><Updates onManageThemes={() => goTab("yours")}/></section> : tab === "community" ? <CommunityThemes inputRef={tabInput}/> : tab === "spotlight" ? <PluginSpotlight inputRef={tabInput}/> : tab === "files" ? <ThemeFiles inputRef={tabInput}/> : <main className="dht-hub-body"><div className="market-grid dht-hub-grid" ref={listRef}>
      {!filtered.length && <p className="dht-hub-empty">{loading ? "Loading your next home…" : installedOnly ? "Your collection starts here. Browse Discover to download a theme." : "No themes are available yet. Try Refresh."}</p>}
      {filtered.map((pack, i) => {
        const state = pack.community?.updateAvailable ? "Update" : (pack.community ? pack.community.themeId === s.activeTheme : pack.theme === s.theme) && (pack.installedVersion || pack.builtIn) ? "Active" : pack.installedVersion ? (upToDate(pack) || pack.installedVersion === "built-in" ? "Installed" : "Update") : extrasMissing(pack) ? "Built in" : "";
        return <button key={pack.id} className="market-card dht-hub-card" data-selected={i === selected} onClick={() => setSelected(i)} onFocus={() => setSelected(i)}>
          <div className="market-art dht-hub-art" data-theme={pack.id}>{pack.poster ? <img src={pack.poster} alt="" loading="lazy" onError={e => { e.currentTarget.style.display = "none"; }} /> : <span>{pack.name}</span>}{state && <em className="dht-hub-state" data-state={state.toLowerCase()}>{state}</em>}</div>
          <div className="market-card-title"><strong>{pack.name}</strong>{pack.size > 0 && <span>{(pack.size / 1048576).toFixed(1)} MB</span>}</div>
          <p>{THEMES.find(t => t.id === pack.theme)?.blurb || pack.description}</p>
          <BonusFeatureBadges id={pack.id}/>{pack.uiOverhaul && <small className="dht-hub-overhaul">UI overhaul</small>}
        </button>;
      })}
    </div><aside className="dht-hub-detail">{current && <>
      <div className="dht-hub-detail-scroll">
        <div className="market-detail-art" data-theme={current.id}>{current.preview || current.poster ? <img key={current.id} src={current.preview || current.poster} alt={`${current.name} animated preview`} /> : <span>Preview coming soon</span>}</div>
        <h2>{current.name}</h2><p>{current.description}</p>
        <BonusFeatureBadges id={current.id}/>{current.uiOverhaul && <small className="dht-hub-overhaul">UI overhaul</small>}
        <dl><div><dt>Download</dt><dd>{current.size ? `${(current.size / 1048576).toFixed(1)} MB` : "Built in"}</dd></div><div><dt>Version</dt><dd>{current.version}</dd></div><div><dt>Available offline</dt><dd>{current.installedVersion ? "Ready to play" : "After download"}</dd></div></dl>
      </div>
      <div className="dht-hub-detail-actions">
        <button className="market-primary dht-hub-primary" disabled={busy || loading || !current.compatible} onClick={() => void activate()}>{busy ? `${progress?.percent || 0}% · ${progress?.message || "Preparing…"}` : !current.compatible ? "Coming soon" : upToDate(current) ? "Activate theme" : current.installedVersion ? "Update theme" : extrasMissing(current) ? "Download extras & activate" : "Download theme"}<kbd>A</kbd></button>
        {busy && <progress max={100} value={progress?.percent || 0} />}
        {(current.installedVersion || current.builtIn) && <button className="market-remove dht-hub-remove" disabled={busy || (current.community ? current.community.themeId === s.activeTheme : current.theme === s.theme)} onClick={() => void deletePack()}>Delete theme</button>}
        <small>Updates activate immediately. Your settings are kept.</small>
      </div>
    </>}</aside></main>}
    {message && <div className="market-notice" role="status">{message}</div>}
    <footer className="dht-hub-footer"><span>✦ A home for every mood</span><span className="dht-hub-hints"><kbd>LB</kbd><kbd>RB</kbd> Sections <kbd>Y</kbd> Hub style {tab === "discover" || tab === "yours" ? <><kbd>✛</kbd> Choose <kbd>A</kbd> Select </> : null}<kbd>B</kbd> Back</span></footer>
  </div>;
}

// Layout: one header row (brand, sections, controls), a body that fills the rest, a hint footer. Sizes follow the Hub's own
// box (container queries on `dht-hub`): the Deck's 1280 x 800 is the reference, small windows (854 x 534) tighten it,
// TV-sized Big Picture (>= 1600 px) zooms the whole page. Posters and previews are 16:10 and are never cropped
// (16:10 boxes + object-fit: contain). The boxes take their height from a ::before spacer (padding-top: 62.5% of the
// width), not aspect-ratio: in a flex <button> the Deck's Steam browser collapsed aspect-ratio boxes to a thin strip. The selected card's ring stays inside the grid's padding.
const MARKET_CSS = `.dht-hub-updates{flex:1;min-height:0;overflow:auto;padding:12px 0 24px}.dht-hub-updates>h2{margin:0 0 16px}.dht-hub-updates>div{max-width:700px;margin:0 auto}.dht-hub-updates button:focus-visible{outline:3px solid #b7d9ff;outline-offset:2px}.dht-hub-updates .dht-tu-action{margin:8px 0}.dht-hub-headright{flex-wrap:wrap}.dht-hub-overhaul{display:inline-block;margin:6px 10px;padding:3px 8px;border-radius:12px;background:#7460bd33;color:#d9d1ff;font-size:11px}
.dht-market{position:absolute;inset:0;z-index:400;background:var(--dht-hub-bg);color:var(--dht-hub-text);display:flex;flex-direction:column;padding:20px 0 12px;box-sizing:border-box;font:15px var(--dht-hub-font);letter-spacing:0;color-scheme:var(--dht-hub-scheme);overflow:hidden;text-transform:var(--dht-hub-case);container:dht-hub / size;transition:background-color .3s,color .3s}
.dht-market>*:not(.dht-hub-deco){position:relative;z-index:1;margin-inline:32px}
.dht-market *{box-sizing:border-box}.dht-market button{font:inherit;color:inherit;cursor:pointer;border:0;text-transform:inherit}.dht-market button:disabled{opacity:.45;cursor:default}.dht-market button:focus-visible{outline:3px solid var(--dht-hub-accent);outline-offset:3px}
.dht-market kbd{display:inline-grid;place-items:center;min-width:20px;height:20px;padding:0 5px;border-radius:6px;font:800 10px/1 var(--dht-hub-font);letter-spacing:.2px;background:color-mix(in srgb,var(--dht-hub-text) 14%,transparent);color:inherit;border:1px solid color-mix(in srgb,var(--dht-hub-text) 22%,transparent);vertical-align:middle;text-transform:none}
.dht-hub-header{display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:center;gap:18px;padding-bottom:14px;border-bottom:1px solid var(--dht-hub-line);flex-shrink:0}
.dht-hub-brand{display:grid;grid-template-columns:auto;min-width:0}.market-eyebrow{font-size:9px;letter-spacing:2px;color:var(--dht-hub-sub);font-weight:700}
.dht-market h1{font-size:28px;line-height:1;letter-spacing:var(--dht-hub-track);margin:4px 0 2px;display:flex;align-items:center;gap:.3em}
.dht-hub-logo{width:1.1em;height:1.1em;flex:none;filter:drop-shadow(0 1px 2px #0003)}.dht-hub-tagline{margin:0;color:var(--dht-hub-sub);font-size:11px;text-transform:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:220px}
.market-toolbar{display:flex;align-items:center;justify-content:center;gap:8px;min-width:0}.market-toolbar>div{display:flex;gap:2px;padding:4px;border-radius:calc(var(--dht-hub-pill) + 4px);background:color-mix(in srgb,var(--dht-hub-panel) 80%,transparent);min-width:0;overflow:hidden}
.market-toolbar button{background:transparent;padding:8px 14px;color:var(--dht-hub-sub);border-radius:var(--dht-hub-pill);white-space:nowrap;font-size:14px;font-weight:600}.market-toolbar button[data-active=true]{background:var(--dht-hub-tab);color:var(--dht-hub-tab-text)}.market-toolbar small{margin-left:7px;opacity:.65;font-size:11px}
.dht-hub-glyph{opacity:.75}
.dht-hub-headright{display:flex;align-items:center;gap:8px;justify-content:flex-end}
.market-style,.market-close,.market-refresh{display:flex;align-items:center;gap:7px;height:34px;padding:0 12px;border-radius:var(--dht-hub-pill);background:var(--dht-hub-panel);color:var(--dht-hub-card-text)!important;font-size:12px;white-space:nowrap;box-shadow:var(--dht-hub-shadow)}
.market-style strong{font-weight:700}.market-refresh{padding:0 11px;font-size:15px}
.market-notice{font-size:11px;line-height:1.5;color:var(--dht-hub-notice-text);background:var(--dht-hub-notice-bg);padding:7px 12px;margin-top:10px;max-height:56px;overflow:auto;text-transform:none;border-radius:calc(var(--dht-hub-radius)/3);flex-shrink:0}
.dht-market main,.dht-market .dht-spotlight,.dht-market .dht-files{margin-top:14px}
.dht-market main{display:grid;grid-template-columns:minmax(0,1fr) var(--dht-hub-detail-w,300px);gap:22px;flex:1;min-height:0}
.market-grid{overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--dht-hub-card-min,236px),1fr));gap:16px;align-content:start;grid-auto-rows:max-content;padding:8px 8px 16px;margin:-8px 0 0 -8px;scroll-padding:10px}
.dht-hub-empty{grid-column:1/-1;color:var(--dht-hub-sub)}
.market-card{display:flex;flex-direction:column;text-align:left;background:var(--dht-hub-panel);color:var(--dht-hub-card-text)!important;border-radius:var(--dht-hub-radius);padding:0 0 12px;overflow:hidden;min-width:0;box-shadow:var(--dht-hub-shadow);transition:transform .15s,box-shadow .15s}
.market-card[data-selected=true]{background:var(--dht-hub-panel-hi);box-shadow:var(--dht-hub-ring);transform:translateY(-2px)}
.market-art{position:relative;width:100%;background:linear-gradient(135deg,#3c4f6b,#141c2a);color:#fff;display:grid;place-items:center;overflow:hidden;flex-shrink:0}
.market-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}.market-art>span{font-weight:700;opacity:.8}
.market-art::before,.market-detail-art::before{content:"";grid-area:1/1;justify-self:stretch;padding-top:62.5%}.market-art>span,.market-detail-art>span{grid-area:1/1}
.dht-hub-state{position:absolute;left:8px;top:8px;font:700 10px/1 var(--dht-hub-font);font-style:normal;letter-spacing:.4px;text-transform:uppercase;padding:5px 8px;border-radius:var(--dht-hub-pill);background:#000a;color:#fff;backdrop-filter:blur(4px)}
.dht-hub-state[data-state=active]{background:var(--dht-hub-accent);color:var(--dht-hub-accent-text)}.dht-hub-state[data-state=update]{background:#d39b22;color:#1d1300}
.market-card-title{display:flex;justify-content:space-between;align-items:baseline;padding:10px 12px 0;gap:6px;min-width:0}.market-card-title strong{font-size:14px;letter-spacing:var(--dht-hub-track);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.market-card-title span{font-size:10px;color:var(--dht-hub-card-sub);white-space:nowrap}
.market-card p{margin:4px 12px 0;font-size:11px;color:var(--dht-hub-card-sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-transform:none}
.dht-hub-feature-badges{display:flex;gap:5px;flex-wrap:wrap;margin:8px 12px 0;text-transform:none;letter-spacing:0}
.dht-hub-detail .dht-hub-feature-badges{margin:10px 0 0}
.dht-hub-feature-badge{display:inline-flex;align-items:center;min-height:21px;padding:3px 7px;font:600 10px/1.2 var(--dht-hub-font);border-radius:var(--dht-hub-pill);border:1px solid var(--dht-hub-line);background:color-mix(in srgb,var(--dht-hub-accent) 12%,var(--dht-hub-panel));color:var(--dht-hub-card-text);white-space:nowrap}
.dht-market aside.dht-hub-detail{display:flex;flex-direction:column;min-height:0;background:color-mix(in srgb,var(--dht-hub-panel) 70%,transparent);border-radius:var(--dht-hub-radius);box-shadow:var(--dht-hub-shadow);overflow:hidden}
.dht-hub-detail-scroll{flex:1;min-height:0;overflow:auto;padding:14px 14px 4px}
.market-detail-art{width:100%;border-radius:calc(var(--dht-hub-radius)*.7);overflow:hidden;background:#141a24;color:#fff;display:grid;place-items:center;position:relative}.market-detail-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}
.dht-market h2{font-size:22px;line-height:1.15;margin:12px 0 6px;letter-spacing:var(--dht-hub-track)}.dht-hub-detail p{font-size:12px;line-height:1.6;color:var(--dht-hub-card-sub);text-transform:none;margin:0}
.dht-market dl{border-top:1px solid var(--dht-hub-line);padding:8px 0 0;margin:12px 0 4px}.dht-market dl div{display:flex;justify-content:space-between;gap:10px;font-size:11px;margin:5px 0}.dht-market dt{color:var(--dht-hub-card-sub)}.dht-market dd{margin:0;color:var(--dht-hub-card-text)}
.dht-hub-detail-actions{flex-shrink:0;padding:10px 14px 12px;border-top:1px solid var(--dht-hub-line);display:flex;flex-direction:column;gap:6px}
.dht-market .market-primary{display:flex;align-items:center;justify-content:center;gap:10px;background:var(--dht-hub-accent);color:var(--dht-hub-accent-text)!important;width:100%;border-radius:var(--dht-hub-pill);padding:12px 10px;font-weight:700;font-size:14px;box-shadow:var(--dht-hub-shadow)}
.dht-market .market-primary kbd{background:color-mix(in srgb,var(--dht-hub-accent-text) 16%,transparent);border-color:color-mix(in srgb,var(--dht-hub-accent-text) 30%,transparent)}
.dht-market .market-remove{background:transparent;width:100%;font-size:11px;padding:6px 0;color:var(--dht-hub-card-sub)}
.dht-hub-detail-actions>small{display:block;text-align:center;color:var(--dht-hub-card-sub);opacity:.8;font-size:10px;text-transform:none}
.dht-market progress{width:100%;height:6px;accent-color:var(--dht-hub-glow)}
.dht-market footer{display:flex;justify-content:space-between;align-items:center;gap:12px;border-top:1px solid var(--dht-hub-line);padding-top:10px;margin-top:12px;font-size:11px;color:var(--dht-hub-sub);flex-shrink:0;white-space:nowrap}
.dht-hub-hints{display:flex;align-items:center;gap:5px;overflow:hidden}.dht-hub-hints kbd{margin-left:6px}.dht-hub-hints kbd+kbd{margin-left:0}
/* the Spotlight tab inside the Hub */
.dht-market .dht-spotlight{padding:0}
@container dht-hub (max-width:1100px){.dht-market main{--dht-hub-detail-w:260px;gap:16px}.dht-hub-tagline{display:none}.market-toolbar button{padding:7px 10px;font-size:13px}}
@container dht-hub (max-width:960px){
  .dht-hub-header{grid-template-columns:auto minmax(0,1fr);gap:8px 12px;padding-bottom:10px}.dht-hub-brand{grid-template-columns:auto auto;align-items:baseline;gap:10px}.market-eyebrow{display:none}.dht-market h1{font-size:22px;margin:0}
  .market-toolbar{grid-column:1/-1;grid-row:2;justify-content:flex-start}.dht-hub-glyph{display:none}.market-toolbar button{padding:6px 9px;font-size:12px}.market-toolbar small{margin-left:5px}
  .dht-market main{--dht-hub-detail-w:230px;--dht-hub-card-min:190px;gap:12px}.market-grid{gap:12px}
  .market-style,.market-close,.market-refresh{height:30px;padding:0 9px;font-size:11px}
  .dht-market footer>span:first-child{display:none}
  .dht-market>*:not(.dht-hub-deco){margin-inline:18px}
}
@container dht-hub (max-height:620px){
  .dht-market main,.dht-market .dht-spotlight,.dht-market .dht-files{margin-top:10px}.dht-market footer{margin-top:8px;padding-top:7px}
  .dht-hub-detail-scroll{padding:10px 10px 2px}.dht-market h2{font-size:17px;margin:8px 0 4px}.dht-hub-detail p{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
  .dht-market dl{display:none}.dht-hub-detail-actions{padding:8px 10px}.dht-hub-detail-actions>small{display:none}.dht-market .market-primary{padding:10px 8px;font-size:13px}
  .market-card-title{padding:8px 10px 0}.market-card p{margin:2px 10px 0}.market-card{padding-bottom:9px}
}
@container dht-hub (min-width:1600px){.dht-market>:not(.dht-hub-deco):not(style){zoom:1.35}}
`;
