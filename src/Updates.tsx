import { ButtonItem, DropdownItem, PanelSection, PanelSectionRow, ProgressBarWithInfo } from "@decky/ui";
import { callable } from "@decky/api";
import { useEffect, useRef, useState } from "react";

export type Release = { tag: string; version: string; assetUrl: string; notes: string };
export type Status = {
  success: boolean; currentVersion: string; releases: Release[];
  latest: Release | null; updateAvailable: boolean; stale: boolean; error?: string;
};
const checkUpdates = callable<[], Status>("plugin_update_status");
const prepare = callable<[version: string, url: string], { success: boolean; error?: string }>("plugin_prepare_replacement");
const cancel = callable<[], boolean>("plugin_cancel_replacement");
const NAME = "Deck Home Themes";
const backend = (): any => (window as any).DeckyBackend ?? (window.opener as any)?.DeckyBackend;
const compare = (a: string, b: string) => {
  const x = a.split(".").map(Number), y = b.split(".").map(Number);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};
let latestCheck: { at: number; promise: Promise<Status> } | null = null;
export function checkFirmware(force = false): Promise<Status> {
  if (!force && latestCheck && Date.now() - latestCheck.at < 30 * 60 * 1000) return latestCheck.promise;
  const promise = checkUpdates();
  latestCheck = { at: Date.now(), promise };
  promise.catch(() => { latestCheck = null; });
  return promise;
}
export async function installFirmware(release: Release, current: string) {
  const api = backend();
  if (!api?.call) throw new Error("Open this notification in Decky Loader to install updates.");
  const result = await prepare(release.version, release.assetUrl);
  if (!result.success) throw new Error(result.error || "Could not prepare installation");
  try {
    const order = compare(release.version, current);
    await api.call("utilities/install_plugin", release.assetUrl, NAME, release.version, "", order > 0 ? 2 : order < 0 ? 3 : 1);
  } catch (error) { await cancel().catch(() => {}); throw error; }
}

export function Updates() {
  const [status, setStatus] = useState<Status | null>(null);
  const [tag, setTag] = useState("");
  const [checking, setChecking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const downloading = useRef(false);
  const active = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const load = async () => {
    setChecking(true);
    try {
      const value = await checkFirmware(true);
      if (active.current) {
        setStatus(value);
        setTag(previous => value.releases.some(r => r.tag === previous) ? previous : value.releases[0]?.tag || "");
      }
    } catch (error) {
      if (active.current) setMessage(`Update check failed: ${error}`);
    } finally { if (active.current) setChecking(false); }
  };
  useEffect(() => {
    active.current = true;
    void load();
    const api = backend();
    const start = (name: string) => {
      if (name !== NAME) return;
      downloading.current = true;
      setBusy(true); setProgress(0); setMessage("Downloading plugin…");
    };
    const info = (percent: number) => {
      if (downloading.current) setProgress(Math.max(0, Math.min(100, Number(percent) || 0)));
    };
    const finish = (name: string) => {
      if (name !== NAME) return;
      downloading.current = false;
      setBusy(false); setProgress(100); setMessage("Installed. Reloading plugin…");
      api?.call("loader/reload_plugin", NAME).catch(() => {
        if (active.current) setMessage("Installed. Reload the plugin in Decky to finish.");
      });
    };
    api?.addEventListener?.("loader/plugin_download_start", start);
    api?.addEventListener?.("loader/plugin_download_info", info);
    api?.addEventListener?.("loader/plugin_download_finish", finish);
    return () => {
      active.current = false;
      clearTimeout(timer.current);
      api?.removeEventListener?.("loader/plugin_download_start", start);
      api?.removeEventListener?.("loader/plugin_download_info", info);
      api?.removeEventListener?.("loader/plugin_download_finish", finish);
    };
  }, []);
  const selected = status?.releases.find(r => r.tag === tag);
  const install = async (release: Release) => {
    if (busy || !status) return;
    const api = backend();
    if (!api?.call) { setMessage("Open this panel in Decky Loader to install updates."); return; }
    setBusy(true); setMessage("Preparing Decky installer…");
    try {
      const result = await prepare(release.version, release.assetUrl);
      if (!result.success) throw new Error(result.error || "Could not prepare installation");
      const order = compare(release.version, status.currentVersion);
      await api.call("utilities/install_plugin", release.assetUrl, NAME, release.version, "", order > 0 ? 2 : order < 0 ? 3 : 1);
      if (!active.current) return;
      setMessage("Confirm installation in Decky. If you cancel, you can try again.");
      timer.current = setTimeout(() => { if (!downloading.current) setBusy(false); }, 5000);
    } catch (error) {
      await cancel().catch(() => {});
      if (active.current) { setBusy(false); setMessage(`Installation failed: ${error}`); }
    }
  };
  const order = selected && status ? compare(selected.version, status.currentVersion) : 0;
  return <PanelSection title="Plugin updates">
    <PanelSectionRow><div style={{ fontSize: 12, lineHeight: 1.5 }}>
      <div>Installed: {status?.currentVersion || "Checking…"}</div>
      <div>{status?.stale ? `${status.error}. Showing saved releases; latest version is unverified.`
        : status?.updateAvailable ? `Update available: ${status.latest?.version}`
        : status?.success ? (status.releases.length ? "You’re up to date." : "No installable releases found.") : "Checking GitHub releases…"}</div>
    </div></PanelSectionRow>
    {status?.updateAvailable && status.latest && <PanelSectionRow>
      <ButtonItem layout="below" disabled={busy || checking} onClick={() => void install(status.latest!)}>Update to {status.latest.version}</ButtonItem>
    </PanelSectionRow>}
    {!!status?.releases.length && <>
      <PanelSectionRow><DropdownItem label="Install version" description="Choose a release to update, reinstall, or downgrade. Your settings and themes are kept."
        rgOptions={status.releases.map(r => ({ data: r.tag, label: r.version }))} selectedOption={tag}
        onChange={o => setTag(String(o.data))} disabled={busy || checking} /></PanelSectionRow>
      <PanelSectionRow><ButtonItem layout="below" disabled={busy || checking || !selected} onClick={() => selected && void install(selected)}>
        {order > 0 ? "Update to" : order < 0 ? "Downgrade to" : "Reinstall"} {selected?.version}
      </ButtonItem></PanelSectionRow>
      {order < 0 && <PanelSectionRow><div style={{ fontSize: 12 }}>Older releases may not include this updater. You can return by installing the newer ZIP through Decky.</div></PanelSectionRow>}
    </>}
    <PanelSectionRow><ButtonItem layout="below" disabled={busy || checking} onClick={() => void load()}>{checking ? "Checking…" : "Check for updates"}</ButtonItem></PanelSectionRow>
    {busy && downloading.current && <PanelSectionRow><ProgressBarWithInfo layout="inline" nProgress={progress} sOperationText={message} /></PanelSectionRow>}
    {message && <PanelSectionRow><div style={{ fontSize: 12, overflowWrap: "anywhere" }}>{message}</div></PanelSectionRow>}
  </PanelSection>;
}
