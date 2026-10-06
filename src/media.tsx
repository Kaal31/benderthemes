// Screenshots (from Steam's own screenshot store) and game trailers (from the
// Steam store, streamed as DASH and played with Media Source Extensions — no
// external player library).
import { callable, fetchNoCors } from "@decky/api";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { duckMusic } from "./steam";

declare const SteamClient: any;

// ───────────── screenshots ─────────────
export interface Shot {
  appid: number;
  url: string;
  created: number;
  caption: string;
  w: number;
  h: number;
}
let previewShots: Shot[] | null = null;
export function setPreviewShots(s: Shot[]) {
  previewShots = s;
}
let shotCache: { at: number; list: Shot[] } | null = null;
export async function loadScreenshots(): Promise<Shot[]> {
  if (previewShots) return previewShots;
  if (shotCache && Date.now() - shotCache.at < 20000) return shotCache.list;
  let raw: any[] = [];
  try {
    const S = SteamClient?.Screenshots;
    raw = (await (S?.GetAllLocalScreenshots?.() ?? S?.GetAllAppsLocalScreenshots?.())) ?? [];
  } catch {
    raw = [];
  }
  const list: Shot[] = raw
    .filter((s: any) => s?.strUrl)
    .map((s: any) => ({ appid: Number(s.nAppID) || 0, url: s.strUrl, created: Number(s.nCreated) || 0, caption: s.strCaption || "", w: s.nWidth, h: s.nHeight }))
    .sort((a, b) => b.created - a.created);
  shotCache = { at: Date.now(), list };
  return list;
}
export function useScreenshots(): Shot[] | null {
  const [s, setS] = useState<Shot[] | null>(shotCache?.list ?? previewShots);
  useEffect(() => {
    let alive = true;
    loadScreenshots().then((l) => alive && setS(l));
    return () => {
      alive = false;
    };
  }, []);
  return s;
}

// ───────────── trailers ─────────────
export interface Trailer {
  name: string;
  thumb: string;
  mpd: string;
}
const trailerCache = new Map<number, Trailer | null>();
let previewTrailer: ((appid: number) => Trailer | null) | null = null;
export function setPreviewTrailer(f: typeof previewTrailer) {
  previewTrailer = f;
}

async function getText(url: string): Promise<string> {
  const r = await fetchNoCors(url, { method: "GET" } as any);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.text();
}
async function getBytes(url: string): Promise<ArrayBuffer> {
  const r = await fetchNoCors(url, { method: "GET" } as any);
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return await r.arrayBuffer();
}

export async function getTrailer(appid: number): Promise<Trailer | null> {
  if (previewTrailer) return previewTrailer(appid);
  if (trailerCache.has(appid)) return trailerCache.get(appid)!;
  let t: Trailer | null = null;
  try {
    const j = JSON.parse(await getText(`https://store.steampowered.com/api/appdetails?appids=${appid}&filters=movies`));
    const movies: any[] = j?.[appid]?.data?.movies ?? [];
    const m = movies.find((x) => x?.highlight) ?? movies[0];
    const mpd = m?.dash_h264 || m?.dash_av1;
    if (mpd) t = { name: m.name ?? "Trailer", thumb: m.thumbnail ?? "", mpd };
  } catch {
    t = null;
  }
  trailerCache.set(appid, t);
  return t;
}

interface Rep {
  id: string;
  height: number;
  codecs: string;
  mime: string;
}
interface Mpd {
  video: Rep[];
  audio: Rep | null;
  init: string; // template with $RepresentationID$
  media: string; // template with $RepresentationID$ and $Number%05d$
  start: number;
  segSeconds: number;
  total: number; // seconds
}
function parseDuration(iso: string): number {
  const m = /PT(?:(\d+(?:\.\d+)?)H)?(?:(\d+(?:\.\d+)?)M)?(?:(\d+(?:\.\d+)?)S)?/.exec(iso || "");
  return m ? (+(m[1] || 0)) * 3600 + (+(m[2] || 0)) * 60 + +(m[3] || 0) : 0;
}
function parseMpd(xml: string): Mpd | null {
  const total = parseDuration(/mediaPresentationDuration="([^"]+)"/.exec(xml)?.[1] ?? "");
  const st = /<SegmentTemplate([^>]*)>/.exec(xml)?.[1] ?? "";
  const attr = (s: string, a: string) => new RegExp(`${a}="([^"]*)"`).exec(s)?.[1] ?? "";
  const timescale = +attr(st, "timescale") || 1;
  const duration = +attr(st, "duration") || 0;
  const sets = xml.split(/<AdaptationSet/).slice(1);
  const video: Rep[] = [];
  let audio: Rep | null = null;
  for (const set of sets) {
    const head = set.slice(0, set.indexOf(">"));
    const setMime = attr(head, "mimeType") || attr(head, "contentType");
    for (const m of set.matchAll(/<Representation([^>]*)>/g)) {
      const a = m[1];
      const mime = attr(a, "mimeType") || setMime;
      const rep = { id: attr(a, "id"), height: +attr(a, "height") || 0, codecs: attr(a, "codecs") || attr(head, "codecs"), mime };
      if (/video/.test(mime)) video.push(rep);
      else if (/audio/.test(mime) && !audio) audio = rep;
    }
  }
  if (!video.length || !duration) return null;
  return {
    video: video.sort((a, b) => a.height - b.height),
    audio,
    init: attr(st, "initialization"),
    media: attr(st, "media"),
    start: +attr(st, "startNumber") || 1,
    segSeconds: duration / timescale,
    total,
  };
}
const fill = (tpl: string, id: string, n?: number) =>
  tpl.replace("$RepresentationID$", id).replace(/\$Number(?:%0(\d+)d)?\$/, (_, w) => (n === undefined ? "" : String(n).padStart(+(w || 1), "0")));

// ───────────── segment player (Media Source Extensions) ─────────────
/** One elementary stream: urls[0] is the init segment; later init segments may appear between chunks (multi-part recordings). */
export interface PlanStream {
  kind: "video" | "audio";
  mime: string;
  codecs: string;
  urls: string[];
  inits?: Set<number>; // indexes in `urls` that are init segments (besides 0)
}
export interface Plan {
  streams: PlanStream[];
  fetch: (url: string) => Promise<ArrayBuffer>;
  sequence?: boolean; // ignore the segments' own timestamps (Steam recordings start mid-timeline)
}

async function trailerPlan(appid: number, sound: boolean, seconds: number | undefined, quality: "low" | "high"): Promise<Plan | null> {
  const t = await getTrailer(appid);
  if (!t) return null;
  let mpd: Mpd | null = null;
  try {
    mpd = parseMpd(await getText(t.mpd));
  } catch {
    mpd = null;
  }
  if (!mpd) return null;
  const base = t.mpd.slice(0, t.mpd.lastIndexOf("/") + 1);
  const q = t.mpd.includes("?") ? t.mpd.slice(t.mpd.indexOf("?")) : "";
  const vrep = quality === "high" ? mpd.video[mpd.video.length - 1] : mpd.video.find((r) => r.height >= 340) ?? mpd.video[0];
  const count = Math.max(1, Math.ceil(Math.min(seconds ?? mpd.total, mpd.total || 9999) / mpd.segSeconds));
  const urls = (rep: Rep) => [base + fill(mpd!.init, rep.id) + q, ...Array.from({ length: count }, (_, i) => base + fill(mpd!.media, rep.id, mpd!.start + i) + q)];
  const streams: PlanStream[] = [{ kind: "video", mime: "video/mp4", codecs: vrep.codecs, urls: urls(vrep) }];
  if (sound && mpd.audio) streams.push({ kind: "audio", mime: "audio/mp4", codecs: mpd.audio.codecs, urls: urls(mpd.audio) });
  return { streams, fetch: getBytes };
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * <video> fed segment by segment. Loads ahead of the playhead (not the whole
 * file at once) and drops what was watched long ago, so long recordings don't
 * fill memory.
 */
export function SegmentVideo({
  plan,
  deps,
  muted,
  loop = false,
  style,
  autoPlay = true,
  videoRef,
  onReady,
  onEnded,
  onNone,
}: {
  plan: () => Promise<Plan | null>;
  deps: any[];
  muted: boolean;
  loop?: boolean;
  style?: CSSProperties;
  autoPlay?: boolean;
  videoRef?: (v: HTMLVideoElement | null) => void;
  onReady?: () => void;
  onEnded?: () => void;
  onNone?: () => void;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const [ready, setReady] = useState(false);
  // a trailer playing with sound fades the theme music out while it plays
  useEffect(() => {
    if (!ready || muted) return;
    duckMusic(true);
    return () => duckMusic(false);
  }, [ready, muted]);
  const cb = useRef({ onReady, onNone });
  cb.current = { onReady, onNone };
  useEffect(() => {
    const video = ref.current;
    if (!video) return;
    let dead = false;
    let url = "";
    setReady(false);
    const none = () => !dead && cb.current.onNone?.();
    (async () => {
      let p: Plan | null = null;
      try {
        p = await plan();
      } catch {
        p = null;
      }
      if (dead) return;
      if (!p || !p.streams.some((s) => s.kind === "video")) return none();
      const W: any = video.ownerDocument?.defaultView ?? window; // MediaSource must come from the video's own window
      const MS = W.MediaSource;
      const type = (s: PlanStream) => `${s.mime}; codecs="${s.codecs}"`;
      if (!MS || !p.streams.every((s) => MS.isTypeSupported(type(s)))) {
        cb.current.onNone?.();
        return;
      }
      const ms = new MS();
      url = W.URL.createObjectURL(ms);
      video.src = url;
      await new Promise((res) => ms.addEventListener("sourceopen", res, { once: true }));
      if (dead) return;
      const AHEAD = 40; // seconds buffered ahead of the playhead
      const KEEP = 60; // seconds kept behind it
      const feed = async (st: PlanStream) => {
        const sb = ms.addSourceBuffer(type(st));
        if (p!.sequence) sb.mode = "sequence";
        const wait = () =>
          new Promise<void>((res, rej) => {
            const done = () => {
              sb.removeEventListener("updateend", done);
              sb.removeEventListener("error", err);
              res();
            };
            const err = () => {
              sb.removeEventListener("updateend", done);
              sb.removeEventListener("error", err);
              rej(new Error("append failed"));
            };
            sb.addEventListener("updateend", done);
            sb.addEventListener("error", err);
          });
        const append = async (buf: ArrayBuffer) => {
          const w = wait();
          sb.appendBuffer(buf);
          await w;
        };
        const ahead = () => {
          const b = sb.buffered;
          return b.length ? b.end(b.length - 1) - video.currentTime : 0;
        };
        for (let i = 0; i < st.urls.length && !dead; i++) {
          while (!dead && i > 1 && ahead() > AHEAD) await sleep(400);
          if (dead) return;
          if (sb.buffered.length && video.currentTime - sb.buffered.start(0) > KEEP + 20) {
            const w = wait();
            sb.remove(0, video.currentTime - KEEP);
            await w;
          }
          let buf: ArrayBuffer;
          try {
            buf = await p!.fetch(st.urls[i]);
          } catch (e) {
            if (i <= 1) throw e;
            break; // ran past the end
          }
          if (dead) return;
          await append(buf);
          if (st.kind === "video" && i === 1 && !dead) {
            // recordings can start mid-timeline: jump to the first frame
            if (sb.buffered.length && sb.buffered.start(0) > video.currentTime + 0.1) video.currentTime = sb.buffered.start(0);
            setReady(true);
            cb.current.onReady?.();
            if (autoPlay)
              video.play?.().catch(() => {
                // the browser refused to start with sound: play muted rather than not at all
                video.muted = true;
                video.play?.().catch(() => {});
              });
          }
        }
      };
      try {
        await Promise.all(p.streams.map(feed));
        if (!dead && ms.readyState === "open") ms.endOfStream();
      } catch {
        none();
      }
    })();
    return () => {
      dead = true;
      try {
        video.pause();
        video.removeAttribute("src");
        video.load();
      } catch {
        /* ignore */
      }
      if (url) {
        try {
          ((video.ownerDocument?.defaultView as any) ?? window).URL.revokeObjectURL(url);
        } catch {
          /* ignore */
        }
      }
    };
  }, deps);
  return (
    <video
      ref={(v) => {
        (ref as any).current = v;
        videoRef?.(v);
      }}
      muted={muted}
      loop={loop}
      playsInline
      onEnded={onEnded}
      style={{ objectFit: "cover", opacity: ready ? 1 : 0, transition: "opacity 400ms", ...style }}
    />
  );
}

/**
 * <video> playing a game's store trailer. `seconds` caps how much is loaded
 * (icon previews), `sound` adds the audio track.
 */
export function TrailerVideo({
  appid,
  sound = false,
  seconds,
  loop = true,
  quality = "low",
  style,
  onReady,
  onEnded,
  onNone,
}: {
  appid: number;
  sound?: boolean;
  seconds?: number;
  loop?: boolean;
  quality?: "low" | "high";
  style?: CSSProperties;
  onReady?: () => void;
  onEnded?: () => void;
  onNone?: () => void;
}) {
  return (
    <SegmentVideo
      plan={() => trailerPlan(appid, sound, seconds, quality)}
      deps={[appid, sound, seconds, quality]}
      muted={!sound}
      loop={loop}
      style={style}
      onReady={onReady}
      onEnded={onEnded}
      onNone={onNone}
    />
  );
}

// ───────────── videos stored on the Deck ─────────────
export interface LocalStream {
  kind: "video" | "audio";
  mime: string;
  codecs: string;
  init: string;
  chunks: string[];
}
export interface LocalVideo {
  id: string;
  kind: "file" | "clip" | "recording";
  name: string;
  appid: number;
  created: number;
  duration: number;
  size: number;
  thumb: string;
  url?: string; // plain files
  mime?: string;
  parts?: { streams: LocalStream[]; duration: number }[]; // Steam recordings
  folder: string;
}
const backendVideos = callable<[], { ok: boolean; videos: LocalVideo[] }>("list_videos");
let videoCache: { at: number; list: LocalVideo[] } | null = null;
export async function loadVideos(force = false): Promise<LocalVideo[]> {
  if (!force && videoCache && Date.now() - videoCache.at < 30000) return videoCache.list;
  let list: LocalVideo[] = [];
  try {
    const r = await backendVideos();
    list = r?.videos ?? [];
  } catch {
    list = videoCache?.list ?? [];
  }
  videoCache = { at: Date.now(), list };
  return list;
}
export function useVideos(): LocalVideo[] | null {
  const [v, setV] = useState<LocalVideo[] | null>(videoCache?.list ?? null);
  useEffect(() => {
    let alive = true;
    loadVideos().then((l) => alive && setV(l));
    return () => {
      alive = false;
    };
  }, []);
  return v;
}

async function localBytes(url: string): Promise<ArrayBuffer> {
  try {
    const r = await fetch(url);
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return await r.arrayBuffer();
  } catch {
    return getBytes(url); // fall back to Decky's backend fetch
  }
}

export function recordingPlan(v: LocalVideo, sound: boolean): Plan | null {
  const out: PlanStream[] = [];
  for (const kind of ["video", "audio"] as const) {
    if (kind === "audio" && !sound) continue;
    let st: PlanStream | null = null;
    for (const part of v.parts ?? []) {
      const s = part.streams.find((x) => x.kind === kind);
      if (!s) continue;
      if (!st) st = { kind, mime: s.mime, codecs: s.codecs, urls: [], inits: new Set() };
      else if (s.codecs !== st.codecs) continue; // a part in another format can't join this stream
      if (st.urls.length) st.inits!.add(st.urls.length);
      st.urls.push(s.init, ...s.chunks);
    }
    if (st) out.push(st);
  }
  return out.length ? { streams: out, fetch: localBytes, sequence: true } : null;
}

/** A video stored on the Deck: plain files play directly, Steam recordings through the segment player. */
export function LocalVideoView({
  video,
  sound,
  style,
  loop = false,
  videoRef,
  onReady,
  onEnded,
  onNone,
}: {
  video: LocalVideo;
  sound: boolean;
  style?: CSSProperties;
  loop?: boolean;
  videoRef?: (v: HTMLVideoElement | null) => void;
  onReady?: () => void;
  onEnded?: () => void;
  onNone?: () => void;
}) {
  const [ready, setReady] = useState(false);
  if (video.kind !== "file")
    return <SegmentVideo plan={async () => recordingPlan(video, sound)} deps={[video.id, sound]} muted={!sound} loop={loop} style={style} videoRef={videoRef} onReady={onReady} onEnded={onEnded} onNone={onNone} />;
  return (
    <video
      ref={videoRef}
      src={video.url}
      autoPlay
      muted={!sound}
      loop={loop}
      playsInline
      onLoadedData={() => (setReady(true), onReady?.())}
      onError={() => onNone?.()}
      onEnded={onEnded}
      style={{ objectFit: "cover", opacity: ready ? 1 : 0, transition: "opacity 400ms", ...style }}
    />
  );
}

export function fmtDuration(sec: number): string {
  if (!sec || !isFinite(sec)) return "";
  const s = Math.round(sec);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${r}` : `${m}:${r}`;
}
export function fmtSize(b: number): string {
  if (!b) return "";
  return b > 1e9 ? `${(b / 1e9).toFixed(1)} GB` : `${Math.max(1, Math.round(b / 1e6))} MB`;
}
