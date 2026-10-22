import { t } from "./i18n";
// Downloads shown the way each console showed them: a progress bar on the game's own
// tile (drawn by GameArt, so every theme has it) and a small status in the corner of the
// home while something downloads. Both are styled per theme with the CSS below.
import { CSSProperties, useLayoutEffect, useRef } from "react";
import { downloadLine, useDownloads } from "./downloads";
import type { Settings } from "./settings";
import { storeSkin } from "./storeView";

/** A progress bar along the bottom of a game's tile while Steam downloads or updates it. */
export function DownloadBar({ appid }: { appid: number }) {
  const d = useDownloads().byApp.get(appid);
  const ref = useRef<HTMLDivElement>(null);
  // only on a tile that can hold it: the art's own box must be the positioned parent
  useLayoutEffect(() => {
    const el = ref.current;
    if (el) el.style.display = el.offsetParent && el.offsetParent === el.parentElement ? "" : "none";
  });
  if (!d || d.completed) return null;
  const pct = d.progress >= 0 ? d.progress * 100 : 0;
  return (
    <div ref={ref} className="dht-dl-bar" data-paused={d.paused} data-waiting={!d.active} title={downloadLine(d)} style={{ "--dht-dl": `${pct}%` } as CSSProperties}>
      <i />
    </div>
  );
}

/** The corner status while something downloads: "Downloading… 45%" in the theme's own look. */
export function DownloadStatus({ settings, hidden }: { settings: Settings; hidden?: boolean }) {
  const { items, running } = useDownloads();
  const cur = items.find((d) => d.active && !d.completed) ?? items.find((d) => !d.completed);
  if (hidden || !cur || settings.downloadStatus === false) return null;
  const skin = storeSkin(settings);
  const pct = cur.progress >= 0 ? Math.floor(cur.progress * 100) : -1;
  const waiting = items.filter((d) => !d.completed).length;
  const titleKey = STATUS_TITLE[settings.theme] ?? "destDownloads";
  const title = t(titleKey) !== titleKey ? t(titleKey) : titleKey;
  return (
    <div className="dht-dl-status" data-theme={settings.theme} data-variant={settings.theme === "x360" ? settings.x360?.style ?? "metro" : undefined} data-running={running} role="status"
      style={{ "--dl-panel": skin.panel, "--dl-text": skin.text, "--dl-sub": skin.sub, "--dl-fill": skin.sale, fontFamily: skin.font } as CSSProperties}>
      <span className="dht-dl-icon" aria-hidden="true">⬇</span>
      <span className="dht-dl-text">
        <b>{title}{waiting > 1 ? ` (${waiting})` : ""}</b>
        <small>{downloadLine(cur)}</small>
      </span>
      {pct >= 0 && <span className="dht-dl-track"><i style={{ width: `${pct}%` }} /></span>}
    </div>
  );
}

const STATUS_TITLE: Record<string, string> = {
  ps3: "downloadTitle", psp: "downloadTitle", vita: "downloadingTitle", ps4: "destDownloads", ps5: "destDownloads", ps2: "downloadingTitle",
  x360: "activeDownloads", xbox: "xboxLiveDownload", wii: "WiiConnect24", wiiu: "downloadManagement",
  aero: "steamDownloads", aero2: "steamDownloads", minecraft: "downloadingTitle", dial: "downloadingTitle",
};

const S = (t: string) => `.dht-dl-status[data-theme=${t}]`;
export const DOWNLOAD_CSS = [
  // tile bar
  `.dht-dl-bar{position:absolute;left:6%;right:6%;bottom:6%;height:6px;border-radius:3px;background:#0009;overflow:hidden;z-index:3;pointer-events:none;box-shadow:0 0 0 1px #fff3}`,
  `.dht-dl-bar i{display:block;height:100%;width:var(--dht-dl);background:var(--dht-accent,#3aa0ff);transition:width .6s}`,
  `.dht-dl-bar[data-paused=true] i{background:repeating-linear-gradient(45deg,#999 0 6px,#666 6px 12px)}`,
  `.dht-dl-bar[data-waiting=true] i{opacity:.55}`,
  `[data-dht-theme=ps4] .dht-dl-bar{left:0;right:0;bottom:0;border-radius:0;height:5px}[data-dht-theme=ps4] .dht-dl-bar i{background:#fff}`,
  `[data-dht-theme=ps5] .dht-dl-bar{height:4px}[data-dht-theme=ps5] .dht-dl-bar i{background:#fff}`,
  `:is([data-dht-theme=ps3],[data-dht-theme=psp]) .dht-dl-bar i{background:linear-gradient(#fff,#bfd4ff)}`,
  `[data-dht-theme=vita] .dht-dl-bar{left:18%;right:18%;bottom:12%;height:7px;border-radius:4px}[data-dht-theme=vita] .dht-dl-bar i{background:#fff}`,
  `:is([data-dht-theme=wii],[data-dht-theme=wiiu]) .dht-dl-bar{height:9px;border-radius:5px;background:#fffc;box-shadow:inset 0 1px 2px #0003}:is([data-dht-theme=wii],[data-dht-theme=wiiu]) .dht-dl-bar i{background:linear-gradient(#5fd0ff,#1f93ba)}`,
  `:is([data-dht-theme=x360],[data-dht-theme=xbox]) .dht-dl-bar i{background:linear-gradient(#b6f25a,#5dc21e)}`,
  `:is([data-dht-theme=aero],[data-dht-theme=aero2]) .dht-dl-bar{height:10px;border-radius:2px;background:#e6e6e6;box-shadow:inset 0 0 0 1px #bcbcbc}:is([data-dht-theme=aero],[data-dht-theme=aero2]) .dht-dl-bar i{background:linear-gradient(#a8f0a0,#2fb52a 50%,#22a51e)}`,
  `[data-dht-theme=minecraft] .dht-dl-bar{border-radius:0;height:8px;box-shadow:0 0 0 2px #000}[data-dht-theme=minecraft] .dht-dl-bar i{background:#70b33e}`,
  // corner status
  `.dht-dl-status{position:absolute;right:28px;bottom:60px;z-index:60;display:flex;align-items:center;gap:12px;min-width:250px;max-width:420px;padding:10px 16px;border-radius:10px;background:var(--dl-panel);color:var(--dl-text);box-shadow:0 8px 26px #0007;pointer-events:none;font-size:15px;flex-wrap:wrap}`,
  `.dht-dl-text{display:flex;flex-direction:column;flex:1;min-width:0}.dht-dl-text small{color:var(--dl-sub);font-size:12px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`,
  `.dht-dl-icon{font-size:20px}.dht-dl-status[data-running=true] .dht-dl-icon{animation:dhtDlBob 1.2s ease-in-out infinite}@keyframes dhtDlBob{50%{transform:translateY(3px)}}`,
  `.dht-dl-track{flex-basis:100%;height:4px;border-radius:2px;background:#0003;overflow:hidden}.dht-dl-track i{display:block;height:100%;background:var(--dl-fill)}`,
  // PS3 / PSP: the XMB's small icon and text, no box, top right under the clock
  `:is(${S("ps3")},${S("psp")}){top:64px;bottom:auto;background:none;box-shadow:none;color:#fff;min-width:0;padding:0;text-shadow:0 1px 3px #0008}:is(${S("ps3")},${S("psp")}) .dht-dl-track{display:none}:is(${S("ps3")},${S("psp")}) .dht-dl-text small{color:#fffc}`,
  // PS4 / PS5: a notification card
  `${S("ps4")}{bottom:36px;border-radius:4px;background:#0c2a63ee;color:#fff}${S("ps4")} .dht-dl-track i{background:#fff}`,
  `${S("ps5")}{bottom:36px;border-radius:14px;background:#1e222aee;color:#fff}${S("ps5")} .dht-dl-track i{background:#fff}`,
  // Vita: a white status pill at the top
  `${S("vita")}{top:12px;bottom:auto;left:50%;right:auto;transform:translateX(-50%);border-radius:20px;background:#fffffff0;color:#1a2a40}${S("vita")} .dht-dl-track i{background:#1a86ef}`,
  // Xbox 360 / Xbox: green
  `${S("x360")}{border-radius:0;background:#1b1b1bee;color:#fff}${S("x360")} .dht-dl-track i,${S("xbox")} .dht-dl-track i{background:#8ee03a}`,
  `${S("x360")}[data-variant=metro]{background:#107c10;color:#fff}${S("x360")}[data-variant=metro] .dht-dl-track i{background:#fff}`,
  `${S("xbox")}{border-radius:22px;background:#0b2604ee;color:#c6ff6a;text-transform:uppercase;letter-spacing:1px;box-shadow:0 0 18px #6cc31c66}`,
  // Wii / Wii U: a white rounded bubble
  `:is(${S("wii")},${S("wiiu")}){top:18px;bottom:auto;border-radius:22px;background:#ffffffee;color:#536c7b;box-shadow:0 2px 8px #879dab55}:is(${S("wii")},${S("wiiu")}) .dht-dl-track i{background:#37bce9}`,
  // Aero: a small glass window with the green Windows bar
  `:is(${S("aero")},${S("aero2")}){border-radius:6px;background:linear-gradient(#ffffffd8,#e8f0faee);color:#1e395b;border:1px solid #8aa6c8}:is(${S("aero")},${S("aero2")}) .dht-dl-track{height:12px;border-radius:2px;background:#e6e6e6;box-shadow:inset 0 0 0 1px #bcbcbc}:is(${S("aero")},${S("aero2")}) .dht-dl-track i{background:linear-gradient(#a8f0a0,#2fb52a 50%,#22a51e)}`,
  `${S("minecraft")}{top:14px;bottom:auto;border-radius:0;background:#313233;color:#fff;box-shadow:inset 2px 2px #55565a,inset -2px -2px #191b1e}`,
].join("\n");
