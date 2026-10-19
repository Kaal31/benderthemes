import { t } from "./i18n";
import { Navigation } from "@decky/ui";
import { callable } from "@decky/api";
import { Fragment, MutableRefObject, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { opensKeyboardOnTap, showSteamKeyboard } from "./steamKeyboard";
import { SPOTLIGHT_PLUGINS } from "./spotlightCatalog";
import { ExplorerEntry, mergeCatalogue, repoKey, searchCatalogue, SearchItem } from "./pluginSearch";
import type { InputHandler } from "./input";

export function openSpotlightProject(index: number) {
  const plugin = SPOTLIGHT_PLUGINS[index];
  if (plugin) Navigation.NavigateToSteamWeb(plugin.projectUrl);
}

export async function installSpotlightPlugin(index: number): Promise<string> {
  const plugin = SPOTLIGHT_PLUGINS[index];
  if (!plugin?.install) return "Installation is not available yet for this plugin.";
  const { pluginName, version, zipUrl } = plugin.install;
  const project = new URL(plugin.projectUrl);
  const zip = new URL(zipUrl);
  const repo = project.pathname.split("/").filter(Boolean).slice(0,2).join("/");
  if (project.origin !== "https://github.com" || zip.origin !== "https://github.com" || !zip.pathname.startsWith(`/${repo}/releases/download/`) || !zip.pathname.endsWith(".zip") || !pluginName || !version) throw new Error("This plugin needs a verified release ZIP before it can be installed.");
  if ((window as any).__isThemePreview) return "Preview: Decky would ask you to confirm this plugin installation.";
  const backend = (window as any).DeckyBackend ?? (window.opener as any)?.DeckyBackend;
  if (!backend?.call) throw new Error("Decky installation is unavailable in this window.");
  await backend.call("utilities/install_plugin", zipUrl, pluginName, version, "", 1);
  return "Continue in Decky's installation dialog. Decky will download and install the plugin after confirmation.";
}

/**
 * An explorer entry (not reviewed by us) from its release ZIP. Only called after the user confirmed in the detail view
 * (twice for plugins that ask for root); Decky then shows its own confirmation as well. The ZIP must be a GitHub release
 * download of the same repository.
 */
export async function installUnreviewedPlugin(item: SearchItem, confirmations: number): Promise<string> {
  if (item.source !== "explorer" || !item.zipUrl) return "This plugin has no known release ZIP. Open the project page instead.";
  if (confirmations < (item.root ? 2 : 1)) throw new Error("Confirm the installation first.");
  const zip = new URL(item.zipUrl);
  if (zip.origin !== "https://github.com" || repoKey(item.zipUrl) !== item.key || !/^\/[^/]+\/[^/]+\/releases\/download\/[^/]+\/[^/]+\.zip$/i.test(zip.pathname)) throw new Error("This release ZIP does not belong to the project; not installing.");
  if ((window as any).__isThemePreview) return "Preview: Decky would ask you to confirm this unreviewed plugin installation.";
  const backend = (window as any).DeckyBackend ?? (window.opener as any)?.DeckyBackend;
  if (!backend?.call) throw new Error("Decky installation is unavailable in this window.");
  await backend.call("utilities/install_plugin", item.zipUrl, item.name, item.release || "unknown", "", 1);
  return "Continue in Decky's installation dialog. Decky will download and install the plugin after confirmation.";
}

// ---- all Decky plugins (Decky Plugins Explorer data, fetched + cached by the backend: py_modules/plugin_catalog.py)
export type Catalog = { entries: ExplorerEntry[]; installed: string[]; error?: string; stale?: boolean; fetchedAt?: number; source?: { name: string; url: string } };
const pluginCatalog = callable<[refresh: boolean], Catalog>("plugin_catalog");
export const EXPLORER_PAGE = "https://safetzahirovic.github.io/decky-plugins-explorer/";
let cached: Promise<Catalog> | null = null;
export const loadCatalog = (refresh = false) => {
  if (refresh || !cached) cached = pluginCatalog(refresh).then(r => r && Array.isArray(r.entries) ? r : { entries: [], installed: [], error: "The plugin list is unavailable." })
    .catch(e => { cached = null; return { entries: [], installed: [], error: `The plugin list is unavailable: ${e}` }; });
  return cached;
};

export const openUrl = (url?: string) => { if (url && /^https:\/\//.test(url)) Navigation.NavigateToSteamWeb(url); };

// README excerpt -> React elements. Text only: React escapes it, HTML tags and link targets are dropped, nothing is
// injected as markup.
function inline(text: string): ReactNode[] {
  const clean = text.replace(/<[^>]*>/g, "").replace(/!\[[^\]]*\]\([^)]*\)/g, "").replace(/\[([^\]]*)\]\([^)]*\)/g, "$1");
  return clean.split(/(`[^`]+`)/g).map((part, i) => part.startsWith("`") && part.endsWith("`") && part.length > 2
    ? <code key={i}>{part.slice(1, -1)}</code> : <Fragment key={i}>{part.replace(/\*\*|__/g, "")}</Fragment>);
}
export function ReadmeExcerpt({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.slice(0, 2400).split("\n");
  let list: string[] = [], para: string[] = [];
  const flush = () => {
    if (para.length) blocks.push(<p key={blocks.length}>{inline(para.join(" "))}</p>);
    if (list.length) blocks.push(<ul key={blocks.length}>{list.map((l, i) => <li key={i}>{inline(l)}</li>)}</ul>);
    para = []; list = [];
  };
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*```/.test(line)) {
      flush(); const code: string[] = [];
      while (++i < lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i]);
      blocks.push(<pre key={blocks.length}>{code.join("\n")}</pre>); continue;
    }
    const heading = line.match(/^\s*#{1,6}\s+(.*)$/);
    const item = line.match(/^\s*(?:[-*+]|\d+\.)\s+(.*)$/);
    if (heading) { flush(); blocks.push(<h5 key={blocks.length}>{inline(heading[1])}</h5>); }
    else if (item) { if (para.length) { const l = list; list = []; flush(); list = l; } list.push(item[1]); }
    else if (!line.trim()) flush();
    else { if (list.length) { const p = para; para = []; flush(); para = p; } para.push(line.trim()); }
  }
  flush();
  return <div className="dht-spotlight-readme">{blocks}</div>;
}

export function Badges({ item }: { item: SearchItem }) {
  return <span className="dht-spotlight-badges">
    {item.source === "spotlight" ? <b className="dht-spotlight-badge" data-kind="spotlight">✦ Spotlight</b>
      : <b className="dht-spotlight-badge" data-kind="unreviewed" title="Not reviewed by ThemeHub">Not in the store (unreviewed)</b>}
    {item.installed && <b className="dht-spotlight-badge" data-kind="installed">✓ Installed</b>}
    {item.root && <b className="dht-spotlight-badge" data-kind="root">Needs root</b>}
    {item.archived && <b className="dht-spotlight-badge" data-kind="archived">Archived</b>}
    {item.forkOf && <b className="dht-spotlight-badge" data-kind="fork" title={`Another repository of ${item.forkOf}`}>Fork of {item.forkOf}</b>}
    {!!item.stars && <b className="dht-spotlight-badge" data-kind="stars">★ {item.stars}</b>}
  </span>;
}

const MAX_RESULTS = 60;

/**
 * Plugin Spotlight: our curated picks, plus a search over every public Decky plugin. The Hub routes controller
 * presses here through `inputRef` (Marketplace.tsx). Zones: the search box (A opens it / the on-screen keyboard)
 * the result list (↑↓ choose, ← scroll the details up, → into the info panel, A install or view, X project page) and the
 * info panel (↑↓ its buttons and links, scrolling past the last one; A presses; ← or B back to the list), so a
 * controller reaches every button without touch.
 */
export function PluginSpotlight({ inputRef }: { inputRef: MutableRefObject<InputHandler | null> }) {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(0);
  const [zone, setZone] = useState<"search" | "list" | "panel">("list");
  const [panelAt, setPanelAt] = useState(0); // the focused button / link in the info panel
  const [catalog, setCatalog] = useState<Catalog | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  // installing an unreviewed plugin: 0 = not asked, 1 = first confirmation shown, 2 = root confirmation shown
  const [confirm, setConfirm] = useState(0);
  const listRef = useRef<HTMLDivElement>(null);
  const detailRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const panelControls = () => Array.from(detailRef.current?.querySelectorAll<HTMLElement>("button:not([disabled]), a[href]") ?? []);
  const load = (refresh = false) => {
    setLoading(true);
    let live = true;
    void loadCatalog(refresh).then(c => { if (live) { setCatalog(c); setLoading(false); } });
    return () => { live = false; };
  };
  useEffect(() => load(), []);
  const merged = useMemo(() => mergeCatalogue(SPOTLIGHT_PLUGINS, catalog?.entries ?? [], catalog?.installed ?? []), [catalog]);
  const ranked = useMemo(() => query.trim() ? searchCatalogue(merged, query) : merged.filter(i => i.source === "spotlight").map(item => ({ item, score: 0 })), [merged, query]);
  const results = ranked.slice(0, MAX_RESULTS).map(r => r.item);
  const current: SearchItem | undefined = results[Math.min(selected, results.length - 1)];
  useEffect(() => { setSelected(0); }, [query]);
  useEffect(() => {
    setMessage(""); setConfirm(0); setPanelAt(0); detailRef.current?.scrollTo?.({ top: 0 });
    listRef.current?.querySelector<HTMLElement>('[data-selected="true"]')?.scrollIntoView({ block: "nearest" });
  }, [selected, query]);
  const install = async () => {
    if (busy || current?.pickIndex === undefined) return;
    const needed = current.pick?.unreviewed ? (current.root ? 2 : 1) : 0;
    if (confirm < needed) { setConfirm(confirm + 1); setMessage(""); return; }
    setBusy(true);
    try { setMessage(await installSpotlightPlugin(current.pickIndex)); setConfirm(0); } catch (e) { setMessage(String(e)); } finally { setBusy(false); }
  };
  useEffect(() => { if (confirm) detailRef.current?.querySelector(".dht-spotlight-confirm")?.scrollIntoView?.({ block: "nearest" }); }, [confirm]);
  // a confirmation in the panel takes the panel focus on its Yes button
  useEffect(() => { if (confirm && zone === "panel") setPanelAt(Math.max(0, panelControls().findIndex(el => el.classList.contains("dht-spotlight-confirm-yes")))); }, [confirm]);
  // the panel focus ring: one control marked at a time, kept in view
  useEffect(() => {
    const all = panelControls();
    all.forEach(el => el.removeAttribute("data-pad-focus"));
    if (zone !== "panel") return;
    const el = all[Math.min(panelAt, all.length - 1)];
    if (!el) { setZone("list"); return; }
    el.setAttribute("data-pad-focus", "true");
    el.scrollIntoView?.({ block: "nearest" });
  });

  const installUnreviewed = async () => {
    if (busy || !current || current.source !== "explorer" || !current.zipUrl) return;
    const needed = current.root ? 2 : 1;
    if (confirm < needed) { setConfirm(confirm + 1); setMessage(""); return; }
    setBusy(true);
    try { setMessage(await installUnreviewedPlugin(current, confirm)); setConfirm(0); } catch (e) { setMessage(String(e)); } finally { setBusy(false); }
  };
  const openSearch = () => { setZone("search"); showSteamKeyboard(searchRef.current); };
  const leaveSearch = (toList: boolean) => { searchRef.current?.blur(); setZone(toList && results.length ? "list" : "search"); if (toList) setSelected(0); };
  inputRef.current = p => {
    if (p.btn === "b") { // the Hub closes on B unless something here is open
      if (confirm) { setConfirm(0); return true; }
      if (zone === "search" && document.activeElement === searchRef.current) { leaveSearch(false); return true; }
      if (zone === "panel") { setZone("list"); return true; }
      return false;
    }
    if (zone === "panel") {
      const all = panelControls(), at = Math.min(panelAt, all.length - 1);
      if (p.btn === "left") setZone("list");
      else if (p.btn === "down") { if (at < all.length - 1) setPanelAt(at + 1); else detailRef.current?.scrollBy?.({ top: 160 }); }
      else if (p.btn === "up") { if (at > 0) setPanelAt(at - 1); else detailRef.current?.scrollBy?.({ top: -160 }); }
      else if (p.btn === "a" && !p.repeat) all[at]?.click();
      else if (p.btn === "x" && !p.repeat) openUrl(current?.url);
      return true;
    }
    if (zone === "search") {
      if (p.btn === "a" && !p.repeat) openSearch();
      if (p.btn === "down") leaveSearch(true);
      return true;
    }
    if (p.btn === "x" && !p.repeat) openUrl(current?.url);
    if (p.btn === "menu" && !p.repeat && current?.source === "explorer" && current.zipUrl && !confirm) void installUnreviewed();
    if (p.btn === "a" && !p.repeat) document.querySelector<HTMLButtonElement>(".dht-spotlight-detail .dht-spotlight-primary")?.click();
    if (p.btn === "up" && selected === 0) { setZone("search"); return true; }
    if (p.btn === "up" || p.btn === "down") setSelected(Math.max(0, Math.min(results.length - 1, selected + (p.btn === "up" ? -1 : 1))));
    if (p.btn === "left") detailRef.current?.scrollBy?.({ top: -160 });
    if (p.btn === "right" && panelControls().length) { setPanelAt(Math.max(0, panelControls().findIndex(el => el.classList.contains("dht-spotlight-primary")))); setZone("panel"); } // starts on the main button
    return true;
  };
  useEffect(() => () => { inputRef.current = null; }, []);
  const total = merged.length;
  const explorerCount = merged.filter(i => i.source === "explorer").length;
  return <section className="plugin-spotlight dht-spotlight" aria-label={t("pluginSpotlight")}>
    <style>{SPOTLIGHT_CSS}</style>
    <div className="spotlight-intro dht-spotlight-intro">
      <div><h2>{t("pluginSpotlight")}</h2><p>{t("pluginSpotlightDesc")}</p></div>
      <label className="dht-spotlight-search" data-focused={zone === "search"}>
        <span aria-hidden="true">⌕</span>
        <input ref={searchRef} {...opensKeyboardOnTap} type="search" aria-label={t("searchAllDeckyPlugins")} placeholder={loading && !catalog ? "Search all Decky plugins (loading the list…)" : `Search ${total} Decky plugins: name, author, tag…`}
          value={query} onFocus={() => setZone("search")} onChange={e => setQuery(e.target.value)}
          onKeyDown={e => { e.stopPropagation(); if (e.key === "Enter" || e.key === "ArrowDown") { e.preventDefault(); leaveSearch(true); } if (e.key === "Escape") { e.preventDefault(); leaveSearch(false); } }} />
        {query && <button type="button" aria-label={t("clearSearch")} onClick={() => { setQuery(""); openSearch(); }}>✕</button>}
      </label>
    </div>
    <div className="dht-spotlight-status">
      {query.trim() ? <span role="status">{ranked.length ? `${ranked.length} result${ranked.length === 1 ? "" : "s"}${ranked.length > MAX_RESULTS ? `, showing the best ${MAX_RESULTS}` : ""}` : "No plugins match. Try fewer or shorter words."}</span>
        : <span>{SPOTLIGHT_PLUGINS.length} picks · press ↑ then A to search {explorerCount ? `${explorerCount} more plugins` : "all plugins"}</span>}
      {catalog?.error && <span className="dht-spotlight-note">{catalog.error}</span>}
      <span className="dht-spotlight-attribution">Plugin data: <button type="button" onClick={() => openUrl(catalog?.source?.url || EXPLORER_PAGE)}>Decky Plugins Explorer by safetzahirovic ↗</button>
        <button type="button" disabled={loading} onClick={() => load(true)}>{loading ? t("updatingDots") : t("updateList")}</button></span>
    </div>
    {!current ? <div className="spotlight-empty dht-spotlight-empty"><span aria-hidden="true">✦</span><h3>{query.trim() ? "Nothing found" : "The first spotlight is coming soon."}</h3><p>{query.trim() ? "Search matches plugin names, authors, tags, descriptions and README text." : "Featured plugins will appear here with a closer look at what they do and a link to their creators’ projects."}</p></div> : <div className="spotlight-layout">
      <div className="spotlight-list dht-spotlight-results" ref={listRef}>{results.map((item, i) =>
        <button key={item.id} className="spotlight-card dht-spotlight-result" data-source={item.source} data-selected={zone === "list" && i === selected} data-current={i === selected}
          onClick={() => { setZone("list"); setSelected(i); }} onFocus={() => { setZone("list"); setSelected(i); }}>
          <strong>{item.name}</strong><small>By {item.author || item.repo.split("/")[0]}</small><Badges item={item} /><p>{item.description}</p>
        </button>)}</div>
      <div className="spotlight-detail dht-spotlight-detail" ref={detailRef} data-source={current.source}>
        {current.image && <img className="dht-spotlight-image" src={current.image} alt="" loading="lazy" referrerPolicy="no-referrer" onError={e => { e.currentTarget.style.display = "none"; }} />}
        <h3>{current.name}</h3>
        <small className="dht-spotlight-by">By {current.author || "unknown"} · {current.repo}</small>
        <Badges item={current} />
        {current.pick ? <>
          <p>{current.pick.whyFeatured}</p>
          {current.pick.aiAssisted && <><p>{current.pick.aiAssisted.note}</p><a href={current.pick.aiAssisted.sourceUrl} target="_blank" rel="noreferrer" onClick={e => { e.preventDefault(); openUrl(current.pick!.aiAssisted!.sourceUrl); }}>Read the creator’s development notes ↗</a></>}
          {current.pick.unreviewed && <div className="dht-spotlight-warning" role="note">
            <strong>{t("notReviewedByThemeHub")}</strong>
            <span>{t("notReviewedByThemeHubDesc")}</span>
            {current.root && <span>{t("runsAsRootWarning")}</span>}
          </div>}
          {current.pick.install && current.pick.unreviewed && confirm > 0 ? <div className="dht-spotlight-confirm" role="alertdialog" aria-label="Confirm installation">
            {confirm === 1 ? <><strong>Install {current.name} without a review?</strong>
              <span>ThemeHub has not checked this plugin. It downloads release {current.pick.install.version} from {current.repo} on GitHub and runs with Decky’s permissions.</span></>
              : <><strong>This plugin runs as root.</strong><span>It gets full access to your system, beyond what normal plugins can do. Install only if you trust {current.author}.</span></>}
            <div><button className="market-primary dht-spotlight-primary dht-spotlight-confirm-yes" disabled={busy} onClick={() => void install()}>
              {busy ? "Opening Decky…" : confirm === 1 && current.root ? "Continue · A" : "Install anyway · A"}</button>
              <button className="market-remove dht-spotlight-confirm-no" onClick={() => setConfirm(0)}>{t("cancelB")}</button></div>
          </div> : current.pick.install ? <>
            <button className="market-primary dht-spotlight-primary" disabled={busy} onClick={() => void install()}>{busy ? "Opening Decky…" : `Install · ${current.pick.install.version}`}</button>
            <button className="market-remove dht-spotlight-project" onClick={() => openUrl(current.url)}>Visit project · X ↗</button>
            <p>{t("deckyConfirmNote")}</p>
          </> : current.pick.unreviewed ? <button className="market-primary dht-spotlight-primary dht-spotlight-project" onClick={() => openUrl(current.url)}>View project · X ↗</button> : <>
            <button className="market-primary dht-spotlight-primary" disabled>Coming soon</button>
            <button className="market-remove dht-spotlight-project" onClick={() => openUrl(current.url)}>Visit project · X ↗</button>
          </>}
        </> : <>
          <p>{current.description || "No description."}</p>
          <div className="dht-spotlight-warning" role="note">
            <strong>{t("notReviewedByThemeHub")}</strong>
            <span>This plugin comes from the public list of Decky plugin repositories. We have not checked its code, and it may or may not be in Decky’s own store. Read the project page first, and install from Decky’s store when it is listed there. ThemeHub installs an unreviewed plugin only from a known release ZIP and only after you confirm.</span>
            {current.root && <span>{t("runsAsRootWarning")}</span>}
            {current.archived && <span>{t("repoArchivedWarning")}</span>}
            {current.forkOf && <span>{t("forkWarning", { repo: current.forkOf })}</span>}
          </div>
          {current.zipUrl && confirm > 0 ? <div className="dht-spotlight-confirm" role="alertdialog" aria-label="Confirm installation">
            {confirm === 1 ? <><strong>Install {current.name} without a review?</strong>
              <span>ThemeHub has not checked this plugin. It downloads {current.release ? `release ${current.release}` : "the latest release"} from {current.repo} on GitHub and runs with Decky’s permissions.</span></>
              : <><strong>This plugin runs as root.</strong><span>It gets full access to your system, beyond what normal plugins can do. Install only if you trust {current.author || current.repo.split("/")[0]}.</span></>}
            <div><button className="market-primary dht-spotlight-primary dht-spotlight-confirm-yes" disabled={busy} onClick={() => void installUnreviewed()}>
              {busy ? "Opening Decky…" : confirm === 1 && current.root ? "Continue · A" : "Install anyway · A"}</button>
              <button className="market-remove dht-spotlight-confirm-no" onClick={() => setConfirm(0)}>{t("cancelB")}</button></div>
          </div> : <>
            <button className="market-primary dht-spotlight-primary dht-spotlight-project" onClick={() => openUrl(current.url)}>View project · X ↗</button>
            {current.zipUrl && <button className="market-remove dht-spotlight-install-unreviewed" onClick={() => void installUnreviewed()}>Install release {current.release || "ZIP"}… · ☰</button>}
          </>}
        </>}
        {(current.tags.length > 0 || current.release || current.downloads) && <dl className="dht-spotlight-facts">
          {current.tags.length > 0 && <div><dt>Tags</dt><dd>{current.tags.join(", ")}</dd></div>}
          {current.release && <div><dt>Latest release</dt><dd>{current.release}</dd></div>}
          {!!current.downloads && <div><dt>Release downloads</dt><dd>{current.downloads.toLocaleString()}</dd></div>}
        </dl>}
        {current.readme && <><h4>From the README</h4><ReadmeExcerpt text={current.readme} />{current.readmeUrl && <button className="dht-spotlight-more" onClick={() => openUrl(current.readmeUrl)}>Read the full README ↗</button>}</>}
        {message && <p role="status">{message}</p>}
      </div>
    </div>}
    <div className="dht-spotlight-hints">{zone === "search" ? "A Type (STEAM + X opens the keyboard) · ↓ Results · B Done" : zone === "panel" ? "↑↓ Buttons and links · A Press · ← / B Back to the list" : `↑ Search · ↑↓ Choose · → Info panel · A ${confirm ? "Confirm" : current?.source === "explorer" ? "View project" : "Install"} · X Project page${confirm ? " · B Cancel" : current?.zipUrl ? " · ☰ Install release" : ""}`}</div>
  </section>;
}

const SPOTLIGHT_CSS = `
.dht-spotlight{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;padding:0;text-transform:none}
.dht-spotlight-intro{display:flex;gap:20px;align-items:center;justify-content:space-between;margin-bottom:8px;flex-shrink:0}
.dht-spotlight-intro h2{font-size:22px;margin:0 0 3px;letter-spacing:var(--dht-hub-track)}.dht-spotlight-intro p{color:var(--dht-hub-sub);line-height:1.45;margin:0;font-size:12px}
.dht-spotlight-search{flex:0 1 460px;display:flex;align-items:center;gap:10px;background:var(--dht-hub-panel);color:var(--dht-hub-card-text);border-radius:var(--dht-hub-pill);padding:0 8px 0 14px;height:42px;border:2px solid transparent;box-shadow:var(--dht-hub-shadow)}
.dht-spotlight-search[data-focused=true],.dht-spotlight-search:focus-within{border-color:var(--dht-hub-accent)}
.dht-spotlight-search span{color:var(--dht-hub-card-sub);font-size:18px}
.dht-spotlight-search input{flex:1;min-width:0;background:transparent;border:0;outline:0;color:inherit;font:inherit;font-size:15px;padding:0}
.dht-spotlight-search input::-webkit-search-cancel-button{display:none}
.dht-spotlight-search input::placeholder{color:var(--dht-hub-card-sub)}
.dht-spotlight-search button{background:transparent;padding:6px 8px;color:var(--dht-hub-card-sub)}
.dht-spotlight-status{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;font-size:12px;color:var(--dht-hub-sub);margin-bottom:8px;flex-shrink:0}
.dht-spotlight-note{color:var(--dht-hub-notice-text);background:var(--dht-hub-notice-bg);padding:3px 10px;border-radius:var(--dht-hub-pill)}
.dht-spotlight-attribution{margin-left:auto}.dht-spotlight-attribution button{background:transparent;padding:2px 4px;color:var(--dht-hub-accent);font-size:12px}
.dht-spotlight-empty{border:1px solid var(--dht-hub-line);border-radius:var(--dht-hub-radius);padding:40px;background:var(--dht-hub-panel);color:var(--dht-hub-card-text);min-height:220px;display:flex;flex-direction:column;justify-content:center}
.dht-spotlight-empty span{font-size:34px;color:var(--dht-hub-accent);margin-bottom:18px}.dht-spotlight-empty h3{font-size:22px;margin:0 0 10px}.dht-spotlight-empty p{color:var(--dht-hub-card-sub);max-width:520px;line-height:1.6;margin:0}
.dht-spotlight .spotlight-layout{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.1fr);gap:18px;flex:1;min-height:0}
.dht-spotlight-results{display:flex;flex-direction:column;gap:10px;overflow:auto;min-height:0;scroll-padding:8px;padding:6px}
.dht-spotlight-result{flex-shrink:0;text-align:left;background:var(--dht-hub-panel);color:var(--dht-hub-card-text)!important;padding:12px 16px;border:2px solid transparent!important;border-radius:var(--dht-hub-radius);box-shadow:var(--dht-hub-shadow)}
.dht-spotlight-result[data-current=true]{background:var(--dht-hub-panel-hi)}.dht-spotlight-result[data-selected=true]{border-color:var(--dht-hub-accent)!important;box-shadow:var(--dht-hub-ring)}
.dht-spotlight-result strong{display:block;font-size:16px}.dht-spotlight-result small{display:block;color:var(--dht-hub-card-sub);margin:3px 0 7px}
.dht-spotlight-result p{font-size:12px;line-height:1.5;margin:6px 0 0;color:var(--dht-hub-card-sub);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.dht-spotlight-badges{display:flex;flex-wrap:wrap;gap:6px}
.dht-spotlight-badge{font-size:11px;font-weight:700;letter-spacing:.3px;padding:3px 9px;border-radius:var(--dht-hub-pill);background:var(--dht-hub-line);color:var(--dht-hub-card-text)}
.dht-spotlight-badge[data-kind=spotlight]{background:var(--dht-hub-accent);color:var(--dht-hub-accent-text)}
.dht-spotlight-badge[data-kind=unreviewed]{background:#7a5a12;color:#fff4d6}.dht-spotlight-badge[data-kind=root]{background:#8a2a2a;color:#ffe3e3}
.dht-spotlight-badge[data-kind=archived]{background:#4a4f58;color:#e7eaef}.dht-spotlight-badge[data-kind=installed]{background:#2d6b45;color:#e3ffee}
.dht-spotlight-detail{overflow:auto;min-height:0;padding:16px 18px;border:1px solid var(--dht-hub-line);border-radius:var(--dht-hub-radius);background:var(--dht-hub-panel);color:var(--dht-hub-card-text)}
.dht-spotlight-detail h3{font-size:20px;margin:0 0 4px}.dht-spotlight-by{display:block;color:var(--dht-hub-card-sub);margin-bottom:10px;font-size:12px}
.dht-spotlight-detail p{color:var(--dht-hub-card-sub);line-height:1.65;font-size:14px}.dht-spotlight-detail a{display:block;color:var(--dht-hub-accent);margin:14px 0}
.dht-spotlight-image{display:block;width:100%;aspect-ratio:16/9;object-fit:contain;border-radius:calc(var(--dht-hub-radius)*.7);margin-bottom:12px;background:#0b0e14}
.dht-spotlight-detail>button{margin:14px 10px 0 0;padding:11px 18px;border-radius:var(--dht-hub-pill)}
.dht-spotlight-primary{background:var(--dht-hub-accent)!important;color:var(--dht-hub-accent-text)!important;font-weight:700}
.dht-spotlight-project:not(.dht-spotlight-primary),.dht-spotlight-more{background:var(--dht-hub-line)!important}
.dht-spotlight-warning{display:flex;flex-direction:column;gap:6px;margin:14px 0 4px;padding:12px 14px;border-left:4px solid #d39b22;background:rgba(211,155,34,.12);border-radius:6px;font-size:13px;line-height:1.5}
.dht-spotlight-warning strong{color:#f0bd4f}
.dht-spotlight-confirm{display:flex;flex-direction:column;gap:8px;margin:14px 0 4px;padding:14px;border:2px solid #d39b22;border-radius:var(--dht-hub-radius);background:rgba(211,155,34,.16);font-size:13px;line-height:1.5}
.dht-spotlight-confirm strong{font-size:15px}.dht-spotlight-confirm>div{display:flex;flex-wrap:wrap;gap:10px;margin-top:4px}
.dht-spotlight-confirm button{padding:10px 16px;border-radius:var(--dht-hub-pill)}.dht-spotlight-confirm-no,.dht-spotlight-install-unreviewed{background:var(--dht-hub-line)!important}
.dht-spotlight-facts{margin:16px 0 0;font-size:13px;border-top:1px solid var(--dht-hub-line)}.dht-spotlight-facts div{display:flex;gap:12px;justify-content:space-between;padding:7px 0;border-bottom:1px solid var(--dht-hub-line)}
.dht-spotlight-facts dt{color:var(--dht-hub-card-sub)}.dht-spotlight-facts dd{margin:0;text-align:right}
.dht-spotlight-detail h4{margin:20px 0 6px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:var(--dht-hub-card-sub)}
.dht-spotlight-readme{font-size:13px;line-height:1.6;overflow-wrap:anywhere}.dht-spotlight-readme h5{font-size:15px;margin:12px 0 4px}.dht-spotlight-readme p{margin:6px 0;font-size:13px}
.dht-spotlight-readme ul{margin:6px 0;padding-left:20px}.dht-spotlight-readme pre{white-space:pre-wrap;background:var(--dht-hub-bg);color:var(--dht-hub-text);padding:8px 10px;border-radius:6px;font-size:12px}
.dht-spotlight-readme code{background:var(--dht-hub-line);padding:0 4px;border-radius:4px}
.dht-spotlight-detail [data-pad-focus]{outline:none;box-shadow:var(--dht-hub-ring)!important;border-radius:var(--dht-hub-pill)}
.dht-spotlight-hints{flex-shrink:0;margin-top:8px;font-size:11px;color:var(--dht-hub-sub)}
@container dht-hub (max-width:960px){.dht-spotlight-intro p{display:none}.dht-spotlight-intro h2{font-size:18px}.dht-spotlight-search{flex-basis:300px;height:36px}.dht-spotlight-attribution{margin-left:0}.dht-spotlight .spotlight-layout{gap:12px}.dht-spotlight-detail{padding:12px}}
@container dht-hub (max-height:620px){.dht-spotlight-intro p{display:none}.dht-spotlight-intro{margin-bottom:6px}.dht-spotlight-status{margin-bottom:6px;font-size:11px}.dht-spotlight-result p{display:none}.dht-spotlight-result small{margin-bottom:5px}.dht-spotlight-hints{display:none}.dht-spotlight-image{max-height:120px}}
`;
