import { ButtonItem, DropdownItem, PanelSection, PanelSectionRow, ProgressBarWithInfo } from "@decky/ui";
import { callable } from "@decky/api";
import { useEffect, useRef, useState } from "react";

export type Release = { tag: string; version: string; assetUrl: string; notes: string; channel?:string; build?:number; attempt?:number };
export type Status = {
  success: boolean; currentVersion: string; releases: Release[];
  currentChannel?:string; channelKnown?:boolean; currentBuild?:number; currentAttempt?:number;
  latest: Release | null; updateAvailable: boolean; stale: boolean; error?: string;
};
const checkUpdates = callable<[], Status>("plugin_update_status");
const prepare = callable<[version: string, url: string], { success: boolean; error?: string }>("plugin_prepare_replacement");
const cancel = callable<[], boolean>("plugin_cancel_replacement");
const NAME = "ThemeHub";
const backend = (): any => (window as any).DeckyBackend ?? (window.opener as any)?.DeckyBackend;
const compare = (a: string, b: string) => {
  const x = a.split(".").map(Number), y = b.split(".").map(Number);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2];
};
const channelOf=(release:Release)=>release.channel??"stable";
export const releaseLabel=(release:Release)=>`${release.version}${release.build?` · build ${release.build}${(release.attempt??1)>1?` (attempt ${release.attempt})`:""}`:""}`;
export const releaseOrder=(release:Release,status:Status)=>compare(release.version,status.currentVersion)||(release.build??0)-(status.currentBuild??0)||(release.attempt??0)-(status.currentAttempt??0);
export const installType=(release:Release,status:Status)=>channelOf(release)!==(status.currentChannel??"stable")?1:releaseOrder(release,status)>0?2:releaseOrder(release,status)<0?3:1;
let latestCheck: { at: number; promise: Promise<Status> } | null = null;
// every finished check (Quick Access, the themed notice's own timer) reaches the themed home's notice at once
const statusListeners = new Set<(status: Status) => void>();
export function onFirmwareStatus(fn: (status: Status) => void) { statusListeners.add(fn); return () => { statusListeners.delete(fn); }; }
export function checkFirmware(force = false): Promise<Status> {
  if (!force && latestCheck && Date.now() - latestCheck.at < 30 * 60 * 1000) return latestCheck.promise;
  const promise = checkUpdates();
  promise.then((status) => statusListeners.forEach((fn) => fn(status))).catch(() => {});
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
  const [channel,setChannel]=useState("");
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
        setChannel(previous=>value.releases.some(r=>channelOf(r)===previous)?previous:value.releases.some(r=>channelOf(r)===(value.currentChannel??"stable"))?(value.currentChannel??"stable"):channelOf(value.releases[0]??{channel:"stable"} as Release));
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
  const channelReleases=status?.releases.filter(r=>channelOf(r)===channel)??[];
  const channels=["stable","beta","experimental","optimization-testing"].filter(c=>status?.releases.some(r=>channelOf(r)===c));
  useEffect(()=>{setTag(previous=>channelReleases.some(r=>r.tag===previous)?previous:channelReleases[0]?.tag??"");},[channel,status]);
  const selected = channelReleases.find(r => r.tag === tag);
  const switching=!!selected&&channelOf(selected)!==(status?.currentChannel??"stable");
  const install = async (release: Release) => {
    if (busy || !status) return;
    const api = backend();
    if (!api?.call) { setMessage("Open this panel in Decky Loader to install updates."); return; }
    setBusy(true); setMessage("Preparing Decky installer…");
    try {
      const result = await prepare(release.version, release.assetUrl);
      if (!result.success) throw new Error(result.error || "Could not prepare installation");
      await api.call("utilities/install_plugin", release.assetUrl, NAME, release.version, "", installType(release,status));
      if (!active.current) return;
      setMessage("Confirm installation in Decky. If you cancel, you can try again.");
      timer.current = setTimeout(() => { if (!downloading.current) setBusy(false); }, 5000);
    } catch (error) {
      await cancel().catch(() => {});
      if (active.current) { setBusy(false); setMessage(`Installation failed: ${error}`); }
    }
  };
  const order = selected && status ? releaseOrder(selected,status) : 0;
  return <PanelSection title="Plugin updates">
    <PanelSectionRow><div style={{ fontSize: 12, lineHeight: 1.5 }}>
      <div>Installed: {status?.currentVersion || "Checking…"}</div>
      <div>{status?.stale ? `${status.error}. Showing saved releases; latest version is unverified.`
        : status?.updateAvailable ? `Update available: ${status.latest?releaseLabel(status.latest):""}`
        : status?.success ? (status.latest ? "This channel is up to date." : "No installable releases found for the installed channel.") : "Checking GitHub releases…"}</div>
    </div></PanelSectionRow>
    {status?.updateAvailable && status.latest && <PanelSectionRow>
      <ButtonItem layout="below" disabled={busy || checking} onClick={() => void install(status.latest!)}>Update to {releaseLabel(status.latest)}</ButtonItem>
    </PanelSectionRow>}
    {!!status?.releases.length && <>
      <PanelSectionRow><DropdownItem label="Release channel" description="Only channels with numbered, installable releases are shown. Selecting a channel does not install it."
        rgOptions={channels.map(c=>({data:c,label:c==="stable"?"Stable":c==="beta"?"Beta":c==="experimental"?"Experimental":"Optimization testing"}))}
        selectedOption={channel} onChange={o=>setChannel(String(o.data))} disabled={busy||checking}/></PanelSectionRow>
      <PanelSectionRow><DropdownItem label="Install version" description="Choose a release to update, reinstall, or downgrade. Your settings and themes are kept."
        rgOptions={channelReleases.map(r => ({ data: r.tag, label: releaseLabel(r) }))} selectedOption={tag}
        onChange={o => setTag(String(o.data))} disabled={busy || checking} /></PanelSectionRow>
      <PanelSectionRow><ButtonItem layout="below" disabled={busy || checking || !selected} onClick={() => selected && void install(selected)}>
        {switching?`Switch to ${channel}`:order > 0 ? "Update to" : order < 0 ? "Downgrade to" : "Reinstall"} {selected?releaseLabel(selected):""}
      </ButtonItem></PanelSectionRow>
      {(order < 0||switching) && <PanelSectionRow><div style={{ fontSize: 12 }}>Some destination builds may not include channel switching. You can return by installing a compatible ZIP through Decky.</div></PanelSectionRow>}
    </>}
    <PanelSectionRow><ButtonItem layout="below" disabled={busy || checking} onClick={() => void load()}>{checking ? "Checking…" : "Check for updates"}</ButtonItem></PanelSectionRow>
    {busy && downloading.current && <PanelSectionRow><ProgressBarWithInfo layout="inline" nProgress={progress} sOperationText={message} /></PanelSectionRow>}
    {message && <PanelSectionRow><div style={{ fontSize: 12, overflowWrap: "anywhere" }}>{message}</div></PanelSectionRow>}
  </PanelSection>;
}
