import { t } from "./i18n";
import { callable } from "@decky/api";
import { Navigation } from "@decky/ui";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import type { InputHandler } from "./input";
import { refreshThemes } from "./engine/registry";
import { applyPreset, currentLook, getPresets } from "./presets";
import { closeMarketplace, resourcesChangedOnClose } from "./marketplaceState";
import { updateSettings } from "./settings";
import { opensKeyboardOnTap, showSteamKeyboard } from "./steamKeyboard";
import { checkCommunityUpdates, invalidateCommunityUpdates, useCommunityUpdates } from "./communityUpdates";

type Theme = { id: string; name: string; author: string; description: string; version: string; size?: number; preview?: string; compatible: boolean; installedVersion?: string; themeId?: string; updateAvailable: boolean; canRollback: boolean; uiOverhaul?: boolean };
type Source = { repo: string; mode: string; error?: string; featured?: boolean; checkedAt?: number; themes: Theme[] };
type Result = { ok?: boolean; error?: string; sources?: Source[]; themeId?: string };
const list = callable<[], Result>("community_themes");
const sourceAction = callable<[repo: string, action: string], Result>("community_source");
const packageAction = callable<[repo: string, id: string, action: string], Result>("community_package");
const downloadProgress = callable<[], { busy: boolean; percent: number; message: string }>("community_progress");

export function CommunityThemes({ inputRef }: { inputRef: MutableRefObject<InputHandler | null> }) {
  const [sources, setSources] = useState<Source[]>([]);
  const [repo, setRepo] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [progress, setProgress] = useState("");
  const updates = useCommunityUpdates();
  const root = useRef<HTMLElement>(null);
  const box = useRef<HTMLInputElement>(null);
  const alive = useRef(true);
  const working = useRef(false);
  const reload = async () => { const r = await list(); if (alive.current) setSources(r.sources ?? []); };
  useEffect(() => {
    alive.current = true;
    void reload().catch(e => { if (alive.current) setMessage(String(e)); });
    return () => { alive.current = false; inputRef.current = null; };
  }, []);
  useEffect(() => { void reload().catch(() => {}); }, [updates]);
  useEffect(() => {
    if (!busy) return;
    let pending = false;
    const timer = setInterval(async () => {
      if (pending) return;
      pending = true;
      try { const p = await downloadProgress(); if (alive.current) setProgress(p.busy ? `${p.message} · ${p.percent}%` : ""); }
      catch { /* Action response carries errors. */ }
      finally { pending = false; }
    }, 600);
    return () => clearInterval(timer);
  }, [busy]);
  const run = async (action: () => Promise<void>) => {
    if (working.current) return;
    working.current = true; setBusy(true); setMessage("");
    try { await action(); }
    catch (e) { if (alive.current) setMessage(String(e)); }
    finally { working.current = false; if (alive.current) { setBusy(false); setProgress(""); } }
  };
  const manageSource = (value: string, action: string) => run(async () => {
    const r = await sourceAction(value, action);
    if (!r.ok) throw new Error(r.error || "Repository request failed");
    invalidateCommunityUpdates();
    if (alive.current) { setSources(r.sources ?? []); if (action === "add") setRepo(""); }
  });
  const manageTheme = (source: Source, theme: Theme, action: string) => run(async () => {
    const wasActive = theme.themeId === currentLook();
    const r = await packageAction(source.repo, theme.id, action);
    if (!r.ok) throw new Error(r.error || "Theme request failed");
    await refreshThemes(); resourcesChangedOnClose();
    if (action === "remove" && wasActive) updateSettings({ enabled: false });
    await reload();
    invalidateCommunityUpdates();
    if (alive.current) setMessage(action === "remove" ? "Theme uninstalled. Your saved settings are kept." : action === "rollback" ? "Previous version restored." : "Installed. Choose Use theme to activate it.");
  });
  const activate = (theme: Theme) => {
    const preset = getPresets().find(p => p.dataTheme === theme.themeId && p.origin === "default");
    if (!preset) { setMessage("Theme could not be loaded. Check its manifest and supported layout."); return; }
    applyPreset(preset); closeMarketplace();
  };
  useEffect(() => {
    inputRef.current = p => {
      const focused = document.activeElement as HTMLElement | null;
      if (p.btn === "b") {
        if (focused === box.current) { box.current?.blur(); return true; }
        return false;
      }
      if (busy) return true;
      if (p.btn === "a" && !p.repeat) {
        if (focused === box.current) showSteamKeyboard(box.current);
        else if (focused && root.current?.contains(focused)) focused.click();
        else box.current?.focus();
        return true;
      }
      if (["up", "down", "left", "right"].includes(p.btn)) {
        const controls = Array.from(root.current?.querySelectorAll<HTMLElement>("button:not(:disabled), input:not(:disabled)") ?? []);
        const i = controls.indexOf(focused!);
        const delta = p.btn === "up" || p.btn === "left" ? -1 : 1;
        const next = controls[Math.max(0, Math.min(controls.length - 1, i < 0 ? 0 : i + delta))];
        next?.focus(); next?.scrollIntoView({ block: "nearest" }); return true;
      }
      return true;
    };
    return () => { inputRef.current = null; };
  }, [busy]);
  return <section ref={root} className="dht-community" aria-label={t("communityThemes")} aria-busy={busy}>
    <style>{CSS}</style>
    <div className="community-intro"><h2>{t("communityReposTitle")}</h2><p>{t("communityReposDesc")}</p></div>
    <div className="community-actions"><button disabled={busy} onClick={() => void run(async () => { await checkCommunityUpdates(true); await reload(); setMessage("Community update check complete."); })}>{t("checkAllThemeUpdates")}</button><span role="status">{updates.updateCount ? `${updates.updateCount} theme update${updates.updateCount === 1 ? "" : "s"} available` : "No known theme updates"} · Checks every 6 hours</span></div>
    <form onSubmit={e => { e.preventDefault(); void manageSource(repo, "add"); }}>
      <label htmlFor="community-repo">{t("githubRepository")}</label>
      <div className="community-add"><input ref={box} id="community-repo" value={repo} onChange={e => setRepo(e.target.value)} placeholder="owner/repository or https://github.com/owner/repository" disabled={busy} {...opensKeyboardOnTap}/><button disabled={busy || !repo.trim()} type="submit">{t("addRepository")}</button></div>
      <small>{t("repoCatalogNote")}</small>
    </form>
    {(message || progress) && <p role="status" className="community-message">{progress || message}</p>}
    {!sources.length && <p>{t("noSourcesDesc")}</p>}
    {sources.map(source => <article key={source.repo} className="community-source">
      <header><div><h3>{source.repo}</h3><small>{source.featured ? "Featured repository · " : ""}{source.mode === "catalog" ? "Theme catalog" : "Single theme repository"}{source.checkedAt ? ` · Checked ${new Date(source.checkedAt * 1000).toLocaleString()}` : ""}</small></div><div className="community-actions">
        <button disabled={busy} onClick={() => Navigation.NavigateToSteamWeb(`https://github.com/${source.repo}`)}>{t("viewRepository")}</button>
        <button disabled={busy} onClick={() => void manageSource(source.repo, "refresh")}>{t("checkUpdates")}</button>
        {!source.featured && <button disabled={busy || source.themes.some(t => !!t.installedVersion)} title={t("uninstallThemesFirst")} onClick={() => void manageSource(source.repo, "remove")}>{t("removeRepository")}</button>}
      </div></header>
      {source.error && <p role="status">{source.error}</p>}
      {source.themes.map(theme => <div key={theme.id} className="community-theme"><div>{theme.preview && <img src={theme.preview} alt={`${theme.name} preview`} loading="lazy" referrerPolicy="no-referrer" style={{ width: "100%", maxWidth: 260, maxHeight: 150, objectFit: "contain", borderRadius: 6 }}/>}<h4>{theme.name} {theme.uiOverhaul && <span className="community-overhaul-badge">UI overhaul</span>}</h4><small>By {theme.author} · {theme.version}{theme.size ? ` · ${(theme.size / 1048576).toFixed(1)} MB` : ""}{theme.installedVersion ? ` · Installed ${theme.installedVersion}` : ""}</small><p>{theme.description}</p>{theme.updateAvailable && theme.installedVersion === theme.version && <p>{t("assetsPackageUpdateAvailable")}</p>}{!theme.compatible && <p>{t("requiresNewerThemeHub")}</p>}</div><div className="community-actions">
        {(!theme.installedVersion || theme.updateAvailable) && <button disabled={busy || !theme.compatible} onClick={() => void manageTheme(source, theme, "install")}>{theme.installedVersion ? t("update") : t("install")}</button>}
        {theme.installedVersion && <><button disabled={busy} onClick={() => activate(theme)}>{t("useTheme")}</button><button disabled={busy} onClick={() => void manageTheme(source, theme, "remove")}>{t("uninstall")}</button></>}
        {theme.canRollback && <button disabled={busy} onClick={() => void manageTheme(source, theme, "rollback")}>{t("restorePreviousVersion")}</button>}
      </div></div>)}
    </article>)}
  </section>;
}

const CSS = `.community-overhaul-badge{display:inline-block;vertical-align:middle;padding:3px 8px;border:1px solid #a89aff88;border-radius:20px;background:#7460bd33;color:#d9d1ff;font-size:11px;font-weight:600;letter-spacing:.02em}.dht-community{flex:1;min-height:0;overflow:auto;padding:18px 28px 32px;color:var(--hub-text,#eee)}.dht-community h2,.dht-community h3,.dht-community h4{margin:0 0 6px}.dht-community p{line-height:1.45;margin:8px 0}.community-intro{max-width:850px;margin-bottom:18px}.dht-community form{margin-bottom:18px}.community-add{display:flex;gap:10px;margin:7px 0}.community-add input{flex:1;min-width:0;padding:12px;background:#151b26;color:#fff;border:1px solid #738096;border-radius:7px;font-size:15px}.dht-community button{padding:9px 13px;background:#263348;color:#fff;border:1px solid #738096;border-radius:7px;cursor:pointer;font:inherit}.dht-community button:disabled{opacity:.45;cursor:default}.dht-community button:focus-visible,.dht-community input:focus-visible{outline:3px solid #80caff;outline-offset:3px}.community-source{border:1px solid #73809655;border-radius:10px;padding:16px;margin:14px 0;background:#10172080}.community-source header,.community-theme{display:flex;justify-content:space-between;align-items:center;gap:15px}.community-source header{flex-wrap:wrap}.community-theme{border-top:1px solid #73809644;padding-top:14px;margin-top:14px}.community-theme>div:first-child{flex:1;min-width:0}.community-actions{display:flex;gap:8px;flex-wrap:wrap}.community-theme .community-actions{max-width:310px}.dht-community small{opacity:.75}.community-message{padding:12px;border:1px solid #80caff66;border-radius:7px}@media(max-width:700px){.community-theme{align-items:flex-start;flex-direction:column}.community-add{flex-wrap:wrap}.community-theme .community-actions{max-width:none}}`;
