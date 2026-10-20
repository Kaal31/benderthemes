import { SpotlightUpdates } from "./SpotlightUpdates";
import { ButtonItem, DropdownItem, PanelSection, PanelSectionRow, ProgressBarWithInfo } from "@decky/ui";
import { callable } from "@decky/api";
import { logInfo } from "./diag";
import { useEffect, useRef, useState } from "react";
import { useLocalization } from "./i18n";
import { checkCommunityUpdates, useCommunityUpdates } from "./communityUpdates";

export type Release = { tag: string; version: string; assetUrl: string; notes: string; channel?:string; build?:number; attempt?:number };
export type Status = {
  success: boolean; currentVersion: string; releases: Release[];
  currentChannel?:string; channelKnown?:boolean; currentBuild?:number; currentAttempt?:number;
  latest: Release | null; updateAvailable: boolean; stale: boolean; error?: string;
};
const rawCheckUpdates = callable<[], Status>("plugin_update_status");
const checkUpdates = async (): Promise<Status> => {
  logInfo("[updater] release check started");
  try {
    const status = await rawCheckUpdates();
    logInfo(`[updater] release check complete ${JSON.stringify({success:status.success,currentVersion:status.currentVersion,currentChannel:status.currentChannel,currentBuild:status.currentBuild,currentAttempt:status.currentAttempt,channelKnown:status.channelKnown,latest:status.latest?.tag,stale:status.stale,error:status.error})}`);
    return status;
  } catch { logInfo("[updater] release check rejected before receiving status"); throw new Error("Release check failed; see updater diagnostics in Decky logs."); }
};
const prepare = callable<[version: string, url: string], { success: boolean; error?: string }>("plugin_prepare_replacement");
const cancel = callable<[], boolean>("plugin_cancel_replacement");
const tracedPrepare = async (release: Release) => {
  logInfo(`[updater] preparing ${release.tag}`);
  const result = await prepare(release.version, release.assetUrl);
  logInfo(`[updater] prepare completed success=${result.success}`);
  return result;
};
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
  const promise = new Promise<Status>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Update check timed out. Check your connection and try again.")), 30000);
    Promise.resolve().then(checkUpdates).then(resolve, reject).finally(() => clearTimeout(timer));
  });
  promise.then((status) => statusListeners.forEach((fn) => fn(status))).catch(() => {});
  latestCheck = { at: Date.now(), promise };
  promise.then(status => {
    if (!status.success && latestCheck?.promise === promise) latestCheck = null;
  }, () => { if (latestCheck?.promise === promise) latestCheck = null; });
  return promise;
}
export async function installFirmware(release: Release, current: string) {
  const api = backend();
  if (!api?.call) throw new Error("Open this notification in Decky Loader to install updates.");
  const result = await tracedPrepare(release);
  if (!result.success) throw new Error(result.error || "Could not prepare installation");
  try {
    const order = compare(release.version, current);
    logInfo(`[updater] requesting Decky install prompt for ${release.tag}`);
    await api.call("utilities/install_plugin", release.assetUrl, NAME, release.version, "", order > 0 ? 2 : order < 0 ? 3 : 1);
  } catch (error) { await cancel().catch(() => {}); throw error; }
}

export function Updates({ onManageThemes, showCommunityUpdates = true }: { onManageThemes: () => void; showCommunityUpdates?: boolean }) {
  const lang = useLocalization();
  const community = useCommunityUpdates();
  const [themeChecking, setThemeChecking] = useState(false);
  const [themeError, setThemeError] = useState("");
  const [status, setStatus] = useState<Status | null>(null);
  const [tag, setTag] = useState("");
  const [channel,setChannel]=useState("");
  const [checkError, setCheckError] = useState("");
  const [checking, setChecking] = useState(false);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const downloading = useRef(false);
  const active = useRef(true);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const load = async () => {
    setChecking(true);
    setCheckError("");
    try {
      const value = await checkFirmware(true);
      if (active.current) {
        setStatus(value);
        setChannel(previous=>value.releases.some(r=>channelOf(r)===previous)?previous:value.releases.some(r=>channelOf(r)===(value.currentChannel??"stable"))?(value.currentChannel??"stable"):channelOf(value.releases[0]??{channel:"stable"} as Release));
      }
    } catch (error) {
      logInfo("[updater] installation handoff failed; cancelling replacement marker");
      if (active.current) setCheckError(`Update check failed: ${error instanceof Error ? error.message : String(error)}`);
    } finally { if (active.current) setChecking(false); }
  };
  useEffect(() => {
    active.current = true;
    void load();
    const api = backend();
    const start = (name: string) => {
      if (name !== NAME) return;
      downloading.current = true;
      setBusy(true); setProgress(0); setMessage(lang("downloadingPlugin"));
    };
    const info = (percent: number) => {
      if (downloading.current) setProgress(Math.max(0, Math.min(100, Number(percent) || 0)));
    };
    const finish = (name: string) => {
      if (name !== NAME) return;
      downloading.current = false;
      setBusy(false); setProgress(100); setMessage(lang("installedReloading"));
      api?.call("loader/reload_plugin", NAME).catch(() => {
        if (active.current) setMessage(lang("reloadPluginManual"));
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
    if (!api?.call) { setMessage(lang("openInDeckyLoader")); return; }
    setBusy(true); setMessage(lang("preparingDeckyInstaller"));
    try {
      const result = await tracedPrepare(release);
      if (!result.success) throw new Error(result.error || "Could not prepare installation");
      logInfo(`[updater] requesting Decky install prompt for ${release.tag}`);
    await api.call("utilities/install_plugin", release.assetUrl, NAME, release.version, "", installType(release,status));
      if (!active.current) return;
      logInfo(`[updater] Decky install prompt requested for ${release.tag}`);
      setMessage(lang("confirmInstallationInDecky"));
      timer.current = setTimeout(() => { if (!downloading.current) setBusy(false); }, 5000);
    } catch (error) {
      logInfo("[updater] installation handoff failed; cancelling replacement marker");
      await cancel().catch(() => {});
      if (active.current) { setBusy(false); setMessage(`Installation failed: ${error}`); }
    }
  };
  const order = selected && status ? releaseOrder(selected,status) : 0;
  return <><PanelSection title={showCommunityUpdates ? lang("communityThemeUpdates") : "Theme Hub"}>{showCommunityUpdates && <>
    <style>{COMMUNITY_UPDATE_CSS}</style>
    <PanelSectionRow><section className="dht-theme-updates" aria-label="Community update summary" aria-busy={themeChecking}>
      <div className="dht-tu-summary">
        <div className="dht-tu-symbol" aria-hidden="true">{themeChecking ? "↻" : community.updateCount ? "↓" : "✓"}</div>
        <div><span className="dht-tu-eyebrow">{lang("communityThemesUpper")}</span><h3>{themeChecking ? lang("checkingForUpdates") : community.updateCount ? lang("themeUpdatesCount", { count: community.updateCount }) : lang("youAreUpToDate")}</h3><p>{themeChecking ? lang("lookingForThemesAndAssets") : community.updateCount ? lang("freshLooksReady") : lang("noKnownThemeUpdates")}</p></div>
      </div>
      <span className="dht-tu-accessible" role="status">{community.updateCount ? `${community.updateCount} community theme update${community.updateCount === 1 ? "" : "s"} available` : "No known community theme updates"}</span>
      {!!community.updates.length && <div className="dht-tu-list">{community.updates.map(theme => <article className="dht-tu-theme" key={theme.repo + "/" + theme.id}>
        <div className="dht-tu-title"><strong>{theme.name}</strong><span className="dht-tu-kind">{theme.installedVersion === theme.version ? "Assets" : "Theme"}</span></div>
        <span className="dht-tu-repo">{theme.repo}</span>
        <div className="dht-tu-versions"><span>{theme.installedVersion}</span><span aria-hidden="true">→</span><strong>{theme.installedVersion === theme.version ? "Updated assets" : theme.version}</strong></div>
        {!theme.compatible && <p className="dht-tu-warning">{lang("updateThemeHubFirst")}</p>}
      </article>)}</div>}
      {!!community.errors.length && <div className="dht-tu-notice" role="status"><span aria-hidden="true">!</span><div><strong>{lang("someSourcesOffline")}</strong><p>Showing saved results. Installed themes still work.</p></div></div>}
      <div className="dht-tu-schedule"><span className="dht-tu-dot" aria-hidden="true"/>{lang("autoChecksEvery6Hours")}</div>
    </section></PanelSectionRow></>}
    <PanelSectionRow><div className="dht-tu-action dht-tu-primary"><ButtonItem layout="below" onClick={onManageThemes}>Theme Hub</ButtonItem></div></PanelSectionRow>
    <PanelSectionRow><div className="dht-tu-action dht-tu-secondary"><ButtonItem layout="below" disabled={themeChecking} onClick={() => { setThemeChecking(true); setThemeError(""); void checkCommunityUpdates(true).catch(e => setThemeError(String(e))).finally(() => setThemeChecking(false)); }}>{themeChecking ? lang("checkingThemes") : lang("checkCommunityThemeUpdates")}</ButtonItem></div></PanelSectionRow>
    {themeError && <PanelSectionRow><div className="dht-tu-error" role="alert">{themeError}</div></PanelSectionRow>}
  </PanelSection><PanelSection title={lang("pluginUpdate")}>
    <PanelSectionRow><div style={{ fontSize: 12, lineHeight: 1.5 }}>
      <div>{lang("installedVersion")}: {status ? releaseLabel({tag:"",version:status.currentVersion,assetUrl:"",notes:"",build:status.currentBuild,attempt:status.currentAttempt}) : checking ? lang("checking") : "Unavailable"}</div>
      <div>{checkError || (checking ? lang("checkingGitHub") : status?.stale ? `${status.error}. Showing saved releases; latest version is unverified.`
        : status?.updateAvailable ? `${lang("updateAvailable")}: ${status.latest?releaseLabel(status.latest):""}`
        : status?.success ? (status.latest ? lang("channelUpToDate") : lang("noReleasesForChannel")) : lang("updateStatusUnavailable"))}</div>
      {status?.channelKnown === false && <div>{lang("installedChannelUnknown")}</div>}
    </div></PanelSectionRow>
    {status?.updateAvailable && status.latest && <PanelSectionRow>
      <ButtonItem layout="below" disabled={busy || checking} onClick={() => void install(status.latest!)}>{lang("updateTo")} {releaseLabel(status.latest)}</ButtonItem>
    </PanelSectionRow>}
    {!!status?.releases.length && <>
      <PanelSectionRow><DropdownItem label={lang("releaseChannel")} description={lang("releaseChannelDesc")}
        rgOptions={channels.map(c=>({data:c,label:c==="stable"?"Stable":c==="beta"?"Beta":c==="experimental"?"Experimental":"Optimization testing"}))}
        selectedOption={channel} onChange={o=>setChannel(String(o.data))} disabled={busy||checking}/></PanelSectionRow>
      <PanelSectionRow><DropdownItem label={lang("installVersion")} description={lang("installVersionDesc")}
        rgOptions={channelReleases.map(r => ({ data: r.tag, label: releaseLabel(r) }))} selectedOption={tag}
        onChange={o => setTag(String(o.data))} disabled={busy || checking} /></PanelSectionRow>
      <PanelSectionRow><ButtonItem layout="below" disabled={busy || checking || !selected} onClick={() => selected && void install(selected)}>
        {switching ? lang("switchChannelTo", { channel }) : order > 0 ? lang("updateTo") : order < 0 ? lang("downgradeTo") : lang("reinstall")} {selected?releaseLabel(selected):""}
      </ButtonItem></PanelSectionRow>
      {(order < 0||switching) && <PanelSectionRow><div style={{ fontSize: 12 }}>{lang("channelSwitchNotice")}</div></PanelSectionRow>}
    </>}
    <PanelSectionRow><ButtonItem layout="below" disabled={busy || checking} onClick={() => void load()}>{checking ? lang("checking") : lang("checkPluginUpdate")}</ButtonItem></PanelSectionRow>
    {busy && downloading.current && <PanelSectionRow><ProgressBarWithInfo layout="inline" nProgress={progress} sOperationText={message} /></PanelSectionRow>}
    {message && <PanelSectionRow><div style={{ fontSize: 12, overflowWrap: "anywhere" }}>{message}</div></PanelSectionRow>}
  </PanelSection><SpotlightUpdates/></>;
}

const COMMUNITY_UPDATE_CSS = `
.dht-theme-updates{background:linear-gradient(145deg,#202c40,#172131);border:1px solid #ffffff14;border-radius:12px;color:#eef3fb;padding:16px;box-sizing:border-box;width:100%;font-family:inherit}
.dht-tu-summary{display:flex;align-items:center;gap:12px}.dht-tu-symbol{display:grid;place-items:center;flex:0 0 40px;height:40px;border-radius:11px;background:#83b9ff1c;color:#a9d1ff;font-size:25px}.dht-tu-eyebrow{font-size:10px;letter-spacing:.13em;font-weight:700;color:#9aafca}.dht-tu-summary h3{margin:4px 0;font-size:18px;font-weight:700;line-height:1.25}.dht-tu-summary p{margin:0;color:#b2c0d3;font-size:12px;line-height:1.4}
.dht-tu-list{margin-top:16px;display:grid;gap:8px}.dht-tu-theme{background:#0d152565;border:1px solid #ffffff0a;border-radius:8px;padding:12px;min-width:0}.dht-tu-title{display:flex;justify-content:space-between;align-items:flex-start;gap:8px}.dht-tu-title strong{font-size:13px;line-height:1.4;overflow-wrap:anywhere}.dht-tu-kind{font-size:10px;color:#b9d4f7;background:#36537a66;padding:3px 7px;border-radius:5px;flex-shrink:0}.dht-tu-repo{display:block;font-size:11px;color:#91a3ba;margin-top:3px;overflow-wrap:anywhere}.dht-tu-versions{display:flex;gap:9px;align-items:center;margin-top:10px;font-size:12px;font-variant-numeric:tabular-nums;color:#91a3ba}.dht-tu-versions strong{color:#c1e2ff;font-weight:600}.dht-tu-warning{font-size:11px;color:#f4c987;margin:8px 0 0}
.dht-tu-notice{display:flex;gap:9px;margin-top:12px;padding:10px;border-radius:7px;background:#dab56a12;color:#e1c690;font-size:12px}.dht-tu-notice>span{display:grid;place-items:center;border:1px solid #d4b47777;border-radius:50%;width:17px;height:17px;flex-shrink:0}.dht-tu-notice strong{font-weight:600}.dht-tu-notice p{margin:4px 0 0;color:#c6bda9;font-size:11px;line-height:1.5}.dht-tu-schedule{display:flex;gap:7px;align-items:center;margin-top:14px;color:#91a3ba;font-size:11px}.dht-tu-dot{width:5px;height:5px;background:#83adcd;border-radius:50%}.dht-tu-action{width:100%}.dht-tu-action button{width:100%;border-radius:8px;padding:12px 14px;font:inherit;font-size:13px;font-weight:600;box-sizing:border-box;cursor:pointer}.dht-tu-primary button{background:#b7d9ff;color:#132439;border:1px solid transparent}.dht-tu-secondary button{background:#233147;color:#d4e0ef;border:1px solid #ffffff15}.dht-tu-action button:focus-visible{outline:3px solid #fff;outline-offset:2px}.dht-tu-action button:disabled{opacity:.55}.dht-tu-error{padding:10px;border-radius:7px;background:#782c3433;color:#ffc0c0;font-size:12px;overflow-wrap:anywhere}.dht-tu-accessible{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
`;
