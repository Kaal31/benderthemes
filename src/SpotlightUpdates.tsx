import { callable } from "@decky/api";
import { ButtonItem, PanelSection, PanelSectionRow } from "@decky/ui";
import { useEffect, useState } from "react";

export type SpotlightUpdate = { id: string; name: string; repo: string; currentVersion: string; version?: string; zipUrl?: string; root: boolean; updateAvailable: boolean; error?: string };
type UpdateStatus = { plugins: SpotlightUpdate[]; updateAvailable: boolean; deckyUpInstalled?: boolean };
const check = callable<[refresh: boolean], UpdateStatus>("spotlight_update_status");
const prepare = callable<[id: string, version: string, url: string], { success: boolean; name?: string; root?: boolean; error?: string }>("spotlight_prepare_update");
export const rememberSpotlightSource = callable<[repo: string, name: string, author: string, url: string], {success: boolean; error?: string}>("spotlight_remember_source");
let saved: { at: number; promise: Promise<UpdateStatus> } | null = null;
const listeners = new Set<(value: UpdateStatus) => void>();
export function checkSpotlightUpdates(refresh = false) {
  if (!refresh && saved && Date.now() - saved.at < 30 * 60 * 1000) return saved.promise;
  const promise = check(refresh).then(value => {
    if (!value || !Array.isArray(value.plugins)) throw new Error("Spotlight update checks are unavailable. Reload ThemeHub in Decky.");
    return value;
  });
  saved = { at: Date.now(), promise };
  promise.then(value => listeners.forEach(fn => fn(value))).catch(() => { saved = null; });
  return promise;
}
export function useSpotlightUpdates() {
  const [status, setStatus] = useState<UpdateStatus>({ plugins: [], updateAvailable: false });
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  useEffect(() => {
    let active = true;
    const receive = (value: UpdateStatus) => { if (active) { setStatus(value); setError(""); setReady(true); } };
    listeners.add(receive);
    const load = () => { void checkSpotlightUpdates().then(receive).catch(e => { if (active) setError(String(e)); }); };
    load();
    const timer = setInterval(load, 30 * 60 * 1000);
    const api = (window as any).DeckyBackend ?? (window.opener as any)?.DeckyBackend;
    const finished = () => { setReady(false); saved = null; load(); };
    api?.addEventListener?.("loader/plugin_download_finish", finished);
    return () => { active = false; listeners.delete(receive); clearInterval(timer); api?.removeEventListener?.("loader/plugin_download_finish", finished); };
  }, []);
  return { ...status, error, ready };
}
export async function installSpotlightUpdate(plugin: SpotlightUpdate) {
  if (!plugin.updateAvailable || !plugin.version || !plugin.zipUrl || plugin.error) throw new Error("Check for updates again.");
  const api = (window as any).DeckyBackend ?? (window.opener as any)?.DeckyBackend;
  if (!api?.call) throw new Error("Open this update in Decky Loader.");
  const result = await prepare(plugin.id, plugin.version, plugin.zipUrl);
  if (!result.success || !result.name) throw new Error(result.error || "Could not verify update");
  await api.call("utilities/install_plugin", plugin.zipUrl, result.name, plugin.version, "", 2);
}

export function SpotlightUpdates() {
  const status = useSpotlightUpdates();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = async () => {
    setBusy(true);
    try { await checkSpotlightUpdates(true); setMessage(""); } catch (e) { setMessage(String(e)); } finally { setBusy(false); }
  };
  const install = async (plugin: SpotlightUpdate) => {
    setBusy(true);
    try { await installSpotlightUpdate(plugin); setMessage("Confirm the update in Decky. You can cancel there."); } catch (e) { setMessage(String(e)); } finally { setBusy(false); }
  };
  return <PanelSection title="Spotlight plugin updates">
    <PanelSectionRow><div style={{fontSize: 12}}>Checks plugins installed through Spotlight, including existing featured installations. Updates use Decky's confirmation dialog and work alongside DeckyUp.</div></PanelSectionRow>
    {status.deckyUpInstalled && <PanelSectionRow><div style={{fontSize: 12}}>DeckyUp detected. Automatic update prompts are hidden; updates remain available here and in Plugin Spotlight.</div></PanelSectionRow>}
    {status.plugins.map(plugin => <PanelSectionRow key={plugin.id}>
      {plugin.updateAvailable && !plugin.error ? <ButtonItem layout="below" disabled={busy} onClick={() => void install(plugin)} description={`${plugin.currentVersion} → ${plugin.version}${plugin.root ? " · Needs root" : ""}`}>Update {plugin.name}</ButtonItem>
        : <div style={{fontSize: 12}}>{plugin.name} · {plugin.currentVersion} · {plugin.error || "Up to date"}</div>}
    </PanelSectionRow>)}
    {!status.plugins.length && <PanelSectionRow><div style={{fontSize: 12}}>No matching installed Spotlight plugins found.</div></PanelSectionRow>}
    <PanelSectionRow><ButtonItem layout="below" disabled={busy} onClick={() => void refresh()}>{busy ? "Please wait…" : "Check Spotlight updates"}</ButtonItem></PanelSectionRow>
    {(message || status.error) && <PanelSectionRow><div role="status" style={{fontSize: 12}}>{message || status.error}</div></PanelSectionRow>}
  </PanelSection>;
}
