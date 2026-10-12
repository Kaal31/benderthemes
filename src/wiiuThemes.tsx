// Wii U Menu custom themes (.utheme), read on the Deck by the backend (py_modules/wiiu_themes.py).
// A .utheme only holds patches, so the user's own Wii U menu files are needed once; both are
// picked up from Downloads / SD cards with a one-time prompt.
import { callable } from "@decky/api";
import { useEffect, useRef, useState } from "react";
import { pushModalInput } from "./input";
import { updateSettings, useSettings } from "./settings";
import { onResourcesChanged } from "./marketplaceState";

export interface WiiuSkin {
  name: string;
  author: string;
  id: string;
  art: Record<string, string>; // slot (tile-glass, empty-slot, downloads, icon-browser …) → data URL
  version?: string;
  region?: string;
  preview?: string; // the theme's own launcher screenshot (needs no menu files)
  previewPlaza?: string;
  previewCollage?: string;
  splash?: string; // the theme's boot splash picture, when it has one
  changed: string[];
  errors?: string[]; // parts that could not be read (the rest still shows)
  ignored?: string[]; // patches we do not use (sound, text)
  needsStock?: boolean; // no Wii U menu files yet
  stockMismatch?: string[]; // the theme was made for other menu files (another region or version)
  stockVersion?: string;
}
export interface WiiuFound { path: string; kind: "theme" | "stock"; name: string }

export const listWiiuThemes = callable<[], { themes: string[]; stock: Record<string, { crc: string; version: string }>; dir: string }>("list_wiiu_themes");
const getWiiu = callable<[name: string], WiiuSkin | null>("get_wiiu_skin");
const scanWiiu = callable<[], WiiuFound[]>("wiiu_scan");
const decideWiiu = callable<[path: string, accept: boolean], { success: boolean; error?: string; theme?: string }>("wiiu_decide");

const cache = new Map<string, WiiuSkin | null>();
const listeners = new Set<() => void>();
let generation = 0; // bumped when the cache is cleared: an answer to a request made before that is not stored (it may say "needs menu files")
const changed = () => { generation++; cache.clear(); listeners.forEach((fn) => fn()); };
onResourcesChanged(changed);

/** The selected .utheme for the Wii U home (null when none, or while it loads). */
export function useWiiuSkin(): WiiuSkin | null {
  const name = useSettings().wiiuTheme ?? "";
  const [skin, setSkin] = useState<WiiuSkin | null>(name ? cache.get(name) ?? null : null);
  const [rev, setRev] = useState(0);
  useEffect(() => { const fn = () => setRev((r) => r + 1); listeners.add(fn); return () => { listeners.delete(fn); }; }, []);
  useEffect(() => {
    if (!name) return setSkin(null);
    if (cache.has(name)) return setSkin(cache.get(name)!);
    let alive = true;
    const gen = generation;
    getWiiu(name).then((r) => { if (gen === generation) cache.set(name, r ?? null); if (alive) setSkin(r ?? null); }).catch(() => alive && setSkin(null));
    return () => { alive = false; };
  }, [name, rev]);
  return skin;
}

/** Pictures a theme file gives the home background (the file's "Theme wallpaper" switch, ThemeFx.background). Every other slot is an icon / button picture (ThemeFx.icons). */
export const WIIU_BACKGROUND_SLOTS = ["grid-background", "plaza-background", "plaza-floor"];
/** ThemeFx key of a Wii U theme file's switches. */
export const wiiuFxKey = (file: string | undefined) => `wiiu:${file ?? ""}`;

/** Art from the theme when it applies cleanly, else nothing (the built-in look stays). `fx` drops the groups the user switched off. */
export function wiiuArt(skin: WiiuSkin | null, fx: { icons: boolean; background: boolean } = { icons: true, background: true }): Record<string, string> {
  if (!skin || skin.needsStock || skin.stockMismatch?.length) return {};
  return Object.fromEntries(Object.entries(skin.art).filter(([slot]) => (WIIU_BACKGROUND_SLOTS.includes(slot) ? fx.background : fx.icons)));
}

/** Why a theme can't show yet, in plain words ("" when it can). */
export function wiiuProblem(skin: WiiuSkin | null): string {
  if (!skin) return "";
  if (skin.needsStock) return "This theme needs your Wii U menu files. Put a Wii U menu dump (zip or folder) in Downloads.";
  if (skin.stockMismatch?.length) return `This theme was made for different Wii U menu files${skin.stockVersion ? ` than yours (${skin.stockVersion})` : ""}.`;
  if (skin.errors?.length && !Object.keys(skin.art).length) return "Parts of this theme could not be read.";
  return "";
}

/** One-time prompt for Wii U themes and menu dumps found in Downloads or on an SD card. */
export function WiiuImportPrompt({ paused = false }: { paused?: boolean }) {
  const s = useSettings();
  const [queue, setQueue] = useState<WiiuFound[]>([]);
  const [selection, setSelection] = useState(0), [busy, setBusy] = useState(false), [message, setMessage] = useState("");
  const active = s.theme === "wiiu";
  useEffect(() => {
    if (!active) return; // each time the Wii U home opens; files already seen are not read again
    scanWiiu().then((r) => setQueue(r ?? [])).catch(() => {});
  }, [active]);
  const item = queue[0];
  const visible = active && !paused && !!item;
  const next = () => { setQueue((q) => q.slice(1)); setSelection(0); setMessage(""); };
  const answer = async (accept: boolean) => {
    if (!item || busy) return;
    if (message) return next();
    setBusy(true);
    try {
      const r = await decideWiiu(item.path, accept);
      if (!r.success) { setMessage(r.error || "That file could not be used."); return; }
      if (accept) {
        changed();
        if (item.kind === "stock") setQueue((q) => [q[0], ...q.slice(1).filter((f) => f.kind !== "stock")]); // other copies of the same dump
        if (r.theme && !s.wiiuTheme) updateSettings({ wiiuTheme: r.theme });
        setMessage(item.kind === "stock" ? "Wii U menu files saved. Custom themes can now be shown." : `"${item.name || r.theme}" was added to your Wii U themes.`);
        return;
      }
      next();
    } catch (e) { setMessage(String(e)); } finally { setBusy(false); }
  };
  const latest = useRef({ answer, selection, busy }); latest.current = { answer, selection, busy };
  useEffect(() => {
    if (!visible) return;
    return pushModalInput((p) => {
      const l = latest.current;
      if (["left", "right", "up", "down"].includes(p.btn)) setSelection(l.selection ? 0 : 1);
      if (p.btn === "b" && !l.busy) void l.answer(false);
      if (p.btn === "a" && !p.repeat && !l.busy) void l.answer(l.selection === 0);
      return true;
    });
  }, [visible]);
  if (!visible) return null;
  const file = item.path.split("/").pop();
  const title = item.kind === "stock" ? "Wii U menu files found" : `Wii U theme found: ${item.name || file}`;
  const body = item.kind === "stock"
    ? `"${file}" contains Wii U menu files. Custom Wii U themes are patches for these files, so they need them once. Use them? They stay on this Deck.`
    : `"${file}" is a Wii U custom theme. Add it to your Wii U themes?`;
  return <div style={{ position: "absolute", inset: 0, zIndex: 500 }}>
    <style>{CSS}</style>
    <div className="wiiu-import" role="dialog" aria-modal="true" aria-label={title}>
      <h2>{title}</h2>
      <p>{message || body}</p>
      <div className="wi-actions">{message
        ? <button data-selected onClick={next}>OK</button>
        : <><button data-selected={selection === 0} disabled={busy} onMouseEnter={() => setSelection(0)} onClick={() => void answer(true)}>{busy ? "Working…" : item.kind === "stock" ? "Use them" : "Add theme"}</button>
          <button data-selected={selection === 1} disabled={busy} onMouseEnter={() => setSelection(1)} onClick={() => void answer(false)}>Dismiss</button></>}</div>
    </div>
  </div>;
}

const CSS = `.wiiu-import{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:min(560px,88%);box-sizing:border-box;padding:30px 34px;border-radius:28px;background:linear-gradient(#fff,#e9edf0);border:2px solid #b8c4cb;box-shadow:inset 0 2px #fff,0 15px 50px #0006;color:#41474b;font-family:system-ui,sans-serif;text-align:center}
.wiiu-import h2{margin:0 0 12px;font-size:25px;font-weight:500;color:#2a6f8c}.wiiu-import p{margin:0 0 24px;font-size:16px;line-height:1.55}
.wi-actions{display:flex;gap:16px;justify-content:center}.wi-actions button{min-width:170px;padding:13px 22px;border-radius:30px;border:2px solid #b9c7cf;background:#fff;color:#4a5961;font-size:17px}
.wi-actions button[data-selected=true],.wi-actions button[data-selected=""]{border-color:#16b7e0;box-shadow:0 0 0 3px #16b7e055;color:#0e7ea3}`;
