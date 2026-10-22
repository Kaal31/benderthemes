import { t, lang } from "./i18n";
// Steam's download queue, followed live (SteamClient.Downloads): what each theme shows as progress
// bars, the PSP's info bar and busy icon. One subscription is shared by every theme.
import { useEffect, useState } from "react";

export interface DownloadState {
  appid: number;
  progress: number; // 0…1, -1 when unknown
  paused: boolean;
  completed: boolean;
  active: boolean; // the one Steam is working on now
  queue: number;
  bytes: number;
  total: number;
  rate: number; // bytes per second (active item)
  secondsLeft: number; // active item, 0 when unknown
}
export interface Downloads {
  items: DownloadState[];
  byApp: Map<number, DownloadState>;
  running: boolean; // something is downloading right now
}

const EMPTY: Downloads = { items: [], byApp: new Map(), running: false };
let state: Downloads = EMPTY;
let rawItems: any[] = [];
let overview: any = null;
const listeners = new Set<(d: Downloads) => void>();
let unreg: (() => void)[] = [];

function rebuild() {
  const ov = overview ?? {};
  const items: DownloadState[] = rawItems
    .filter((i) => i && typeof i.appid === "number")
    .map((i) => {
      const active = !!i.active || (ov.update_appid === i.appid && ov.update_state === "Updating");
      let bytes = Number(i.downloaded_bytes) || 0, total = Number(i.total_bytes) || 0;
      if (active && Number(ov.update_bytes_to_download) > 0) {
        bytes = Number(ov.update_bytes_downloaded) || bytes;
        total = Number(ov.update_bytes_to_download) || total;
      }
      return {
        appid: i.appid,
        progress: i.completed ? 1 : total > 0 ? Math.max(0, Math.min(1, bytes / total)) : -1,
        paused: !!i.paused || (active && !!ov.paused),
        completed: !!i.completed,
        active,
        queue: Number(i.queue_index) || 0,
        bytes,
        total,
        rate: active ? Number(ov.update_network_bytes_per_second) || 0 : 0,
        secondsLeft: active ? Number(ov.update_seconds_remaining) || 0 : 0,
      };
    })
    .sort((a, b) => Number(a.completed) - Number(b.completed) || Number(b.active) - Number(a.active) || a.queue - b.queue);
  state = { items, byApp: new Map(items.map((d) => [d.appid, d])), running: items.some((d) => d.active && !d.paused && !d.completed) };
  listeners.forEach((l) => l(state));
}

function subscribe() {
  const dl = (globalThis as any).SteamClient?.Downloads;
  if (!dl || unreg.length) return;
  try {
    const a = dl.RegisterForDownloadItems?.((_busy: boolean, items: any[]) => {
      rawItems = Array.isArray(items) ? items : [];
      rebuild();
    });
    const b = dl.RegisterForDownloadOverview?.((ov: any) => {
      overview = ov;
      rebuild();
    });
    unreg = [a, b].filter(Boolean).map((r: any) => () => r?.unregister?.());
  } catch {
    unreg = [];
  }
  // a store that already has the list (the callbacks only fire on changes)
  const ds = (globalThis as any).downloadsStore;
  const items = ds?.m_DownloadItems ?? ds?.downloadItems;
  if (Array.isArray(items) && !rawItems.length) {
    rawItems = items;
    overview = ds?.m_DownloadOverview ?? ds?.downloadOverview ?? overview;
    rebuild();
  }
}

export function useDownloads(): Downloads {
  const [d, setD] = useState<Downloads>(state);
  useEffect(() => {
    subscribe();
    listeners.add(setD);
    setD(state);
    return () => {
      listeners.delete(setD);
      if (!listeners.size) {
        unreg.forEach((u) => u());
        unreg = [];
      }
    };
  }, []);
  return d;
}

/** Steam's own controls for one queued app. */
export function pauseDownload(appid: number) {
  try { (globalThis as any).SteamClient?.Downloads?.PauseAppUpdate?.(appid); } catch { /* not available */ }
}
export function resumeDownload(appid: number) {
  try { (globalThis as any).SteamClient?.Downloads?.ResumeAppUpdate?.(appid); } catch { /* not available */ }
}
export function removeDownload(appid: number) {
  try { (globalThis as any).SteamClient?.Downloads?.RemoveFromDownloadList?.(appid); } catch { /* not available */ }
}

const units = ["B", "KB", "MB", "GB", "TB"];
export function fmtBytes(n: number): string {
  let i = 0;
  while (n >= 1024 && i < units.length - 1) { n /= 1024; i++; }
  return `${n >= 100 || i === 0 ? Math.round(n) : n.toFixed(1)} ${units[i]}`;
}
export function fmtLeft(sec: number): string {
  if (!sec || sec < 0) return "";
  if (sec < 60) return t("lessThanMinLeft");
  const m = Math.round(sec / 60);
  return m < 60 ? lang("minLeft", { min: m }) : lang("hoursMinLeft", { hours: Math.floor(m / 60), min: m % 60 });
}
/** "Downloading… 45% · 12.3 MB/s · 5 min left" and the like. */
export function downloadLine(d: DownloadState): string {
  if (d.completed) return t("downloadComplete");
  const pct = d.progress >= 0 ? `${Math.floor(d.progress * 100)}%` : "";
  if (d.paused) return [t("paused"), pct].filter(Boolean).join(" · ");
  if (!d.active) return [t("waitingToDownload"), pct].filter(Boolean).join(" · ");
  return [`${t("downloading")}… ${pct}`.trim(), d.rate ? `${fmtBytes(d.rate)}/s` : "", fmtLeft(d.secondsLeft)].filter(Boolean).join(" · ");
}
