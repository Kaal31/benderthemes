import { t } from "./i18n";
// Full-screen overlays shared by every theme: the capture viewer (Steam's own screenshots and the
// videos on the Deck), the trailer player and the video player. They are drawn in the look of the
// theme showing the "media" page (see mediaCenter.tsx). While one is open it receives all input, and
// a video playing with sound pauses the shared music player until it closes.
import { useEffect, useRef, useState } from "react";
import { Press, setModalInput, useStage } from "./input";
import { Game } from "./library";
import { fmtDuration, LocalVideo, LocalVideoView, loadScreenshots, Shot, TrailerVideo, useVideos } from "./media";
import { MediaFrame, mediaVars, MEDIA_CSS, useMediaSettings } from "./mediaCenter";
import { playSound } from "./steam";

export type Overlay = { kind: "shots"; appid?: number; index?: number; tab?: "shots" | "videos" } | { kind: "trailer"; game: Game } | { kind: "video"; video: LocalVideo; back?: boolean } | { kind: "music" } | { kind: "store" } | null;

function useModal(handler: (p: Press) => boolean) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    setModalInput((p) => ref.current(p));
    return () => setModalInput(null);
  }, []);
}

// The viewer's place survives closing it and switching themes.
const viewer = { tab: "shots" as "shots" | "videos", shot: 0, video: 0 };

// ───────────── captures: screenshots and videos ─────────────
export function ScreenshotGallery({ appid, index, tab, lib, onClose, onVideo }: { appid?: number; index?: number; tab?: "shots" | "videos"; lib: Map<number, Game>; onClose: () => void; onVideo?: (v: LocalVideo) => void }) {
  const s = useMediaSettings();
  const [all, setAll] = useState<Shot[] | null>(null);
  useEffect(() => {
    loadScreenshots().then(setAll);
  }, []);
  const vids = useVideos();
  const shots = (all ?? []).filter((x) => !appid || x.appid === appid);
  const videos = (vids ?? []).filter((v) => !appid || v.appid === appid);
  const [mode, setMode] = useState<"shots" | "videos">(tab ?? (index !== undefined ? "shots" : viewer.tab));
  const [sel, setSel] = useState(index ?? (mode === "shots" ? viewer.shot : viewer.video));
  const [full, setFull] = useState(index !== undefined);
  useEffect(() => {
    viewer.tab = mode;
    if (mode === "shots") viewer.shot = sel;
    else viewer.video = sel;
  }, [mode, sel]);
  const COLS = 4;
  const n = mode === "shots" ? shots.length : videos.length;
  const at = Math.min(sel, Math.max(0, n - 1));
  const cur = shots[at];
  const name = (id: number) => lib.get(id)?.name ?? (id ? `App ${id}` : "Steam");
  const switchTo = (m: "shots" | "videos") => {
    if (m === mode) return;
    setMode(m);
    setSel(m === "shots" ? viewer.shot : viewer.video);
    setFull(false);
    playSound("tab");
  };

  useModal((p) => {
    const mv = (d: number) => {
      const nx = Math.max(0, Math.min(n - 1, at + d));
      if (nx !== at) (setSel(nx), playSound("move"));
    };
    if (p.btn === "b") {
      if (full && index === undefined) setFull(false);
      else onClose();
      playSound("back");
    } else if (p.btn === "a") {
      if (!n) return true;
      if (mode === "videos") onVideo?.(videos[at]);
      else setFull(!full);
    } else if (p.btn === "left") mv(-1);
    else if (p.btn === "right") mv(1);
    else if (p.btn === "up" && !full) mv(-COLS);
    else if (p.btn === "down" && !full) mv(COLS);
    else if ((p.btn === "l1" || p.btn === "r1") && !full) switchTo(mode === "shots" ? "videos" : "shots");
    else if (p.btn === "y") {
      setFull(false);
      setSel(0);
    }
    return true; // everything else is swallowed while open
  });

  if (full && cur && mode === "shots")
    return (
      <div className="dht-media" data-theme={s.theme} style={{ ...mediaVars(s), background: "#000" }} onClick={() => (index === undefined ? setFull(false) : onClose())}>
        <style>{MEDIA_CSS}</style>
        <img src={cur.url} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} />
        <div className="dht-media-info" style={{ fontSize: 18 }}>
          {name(cur.appid)} · {cur.created ? new Date(cur.created * 1000).toLocaleString() : ""} {cur.caption ? `· ${cur.caption}` : ""}
          <span style={{ float: "right", opacity: 0.7 }}>
            {at + 1} / {shots.length}
          </span>
        </div>
      </div>
    );
  return (
    <MediaFrame
      s={s}
      title={appid ? name(appid) : "Captures"}
      tabs={[{ id: "shots", label: "Screenshots", on: mode === "shots" }, { id: "videos", label: "Videos", on: mode === "videos" }]}
      onTab={(id) => switchTo(id as "shots" | "videos")}
      hints={[t("hintView"), t("hintScreenshotsVideos"), t("hintNewest"), t("closePrompt")]}
    >
      <CaptureGrid
        loaded={mode === "shots" ? all !== null : vids !== null}
        empty={mode === "shots" ? "No screenshots yet. Take one with STEAM + R1." : "No videos yet. Steam recordings, clips and videos in your Videos folder show up here."}
        items={mode === "shots" ? shots.map((x) => ({ key: x.url, img: x.url, label: name(x.appid) })) : videos.map((v) => ({ key: v.id, img: v.thumb, label: videoTitle(v, lib), badge: fmtDuration(v.duration) }))}
        sel={at}
        onPick={(i) => {
          setSel(i);
          if (mode === "videos") onVideo?.(videos[i]);
          else setFull(true);
        }}
      />
    </MediaFrame>
  );
}

function CaptureGrid({ loaded, empty, items, sel, onPick }: { loaded: boolean; empty: string; items: { key: string; img: string; label: string; badge?: string }[]; sel: number; onPick: (i: number) => void }) {
  const { W, H } = useStage();
  const COLS = 4;
  const TW = (W - 112 - (COLS - 1) * 18) / COLS;
  const TH = TW * 0.5625;
  const row = Math.floor(sel / COLS);
  const visibleRows = Math.max(1, Math.floor((H - 200) / (TH + 22)));
  const top = Math.max(0, row - visibleRows + 1);
  return (
    <>
      {!loaded && <div style={{ position: "absolute", left: 56, top: 110, opacity: 0.7 }}>{t("loadingDots")}</div>}
      {loaded && !items.length && <div style={{ position: "absolute", left: 56, top: 110, opacity: 0.8 }}>{empty}</div>}
      {items.slice(top * COLS, top * COLS + COLS * visibleRows).map((it, k) => {
        const i = top * COLS + k;
        const on = i === sel;
        return (
          <div
            key={it.key}
            className="dht-media-tile"
            data-on={on}
            onClick={() => onPick(i)}
            style={{
              left: 56 + (i % COLS) * (TW + 18),
              top: 104 + (Math.floor(i / COLS) - top) * (TH + 22),
              width: TW,
              height: TH,
              outline: on ? "3px solid var(--m-text)" : "none",
              boxShadow: on ? "0 0 0 6px color-mix(in srgb, var(--m-accent) 70%, transparent), 0 10px 24px #0006" : "0 2px 8px #0004",
              transform: on ? "scale(1.04)" : "none",
              zIndex: on ? 2 : 1,
            }}
          >
            {it.img ? <img src={it.img} alt="" /> : null}
            {it.badge && <span>{it.badge}</span>}
          </div>
        );
      })}
      {items[sel] && <div style={{ position: "absolute", left: 56, bottom: 54, fontSize: 17, opacity: 0.85 }}>{items[sel].label}</div>}
    </>
  );
}

// ───────────── trailer ─────────────
export function TrailerPlayer({ game, onClose }: { game: Game; onClose: () => void }) {
  const s = useMediaSettings();
  const [state, setState] = useState<"loading" | "playing" | "none">("loading");
  const [showInfo, setShowInfo] = useState(true);
  useEffect(() => {
    if (state !== "playing") return;
    const t = setTimeout(() => setShowInfo(false), 3500);
    return () => clearTimeout(t);
  }, [state]);
  useModal((p) => {
    if (p.btn === "b" || p.btn === "a") {
      onClose();
      playSound("back");
    } else setShowInfo(true);
    return true;
  });
  return (
    <div className="dht-media" data-theme={s.theme} style={{ ...mediaVars(s), background: "#000" }} onClick={onClose}>
      <style>{MEDIA_CSS}</style>
      <TrailerVideo appid={game.appid} sound quality="high" loop={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} onReady={() => setState("playing")} onNone={() => setState("none")} onEnded={onClose} />
      <div className="dht-media-info" style={{ opacity: showInfo || state !== "playing" ? 1 : 0 }}>
        <div style={{ fontSize: 22 }}>{game.name} · {state === "loading" ? "loading trailer…" : state === "none" ? "no trailer available" : "Trailer"}</div>
        <div style={{ fontSize: 14, color: "var(--m-sub)", marginTop: 6 }}>{t("closePrompt")}</div>
      </div>
    </div>
  );
}

// ───────────── videos stored on the Deck ─────────────
export function videoTitle(v: LocalVideo, lib: Map<number, Game>): string {
  if (v.kind === "file") return v.name;
  const g = lib.get(v.appid)?.name ?? (v.appid ? `App ${v.appid}` : "Steam");
  return `${g} — ${v.kind === "clip" ? "Clip" : "Recording"}`;
}

export function VideoPlayer({ video, lib, onClose }: { video: LocalVideo; lib: Map<number, Game>; onClose: () => void }) {
  const s = useMediaSettings();
  const [state, setState] = useState<"loading" | "playing" | "none">("loading");
  const [el, setEl] = useState<HTMLVideoElement | null>(null);
  const [, tick] = useState(0);
  const [showInfo, setShowInfo] = useState(true);
  const poke = () => setShowInfo(true);
  useEffect(() => {
    if (!el) return;
    const iv = setInterval(() => tick((n) => n + 1), 250);
    return () => clearInterval(iv);
  }, [el]);
  useEffect(() => {
    if (!showInfo || state !== "playing") return;
    const t = setTimeout(() => setShowInfo(false), 3500);
    return () => clearTimeout(t);
  }, [showInfo, state]);
  const seek = (d: number) => {
    if (!el) return;
    let t = el.currentTime + d;
    const b = el.buffered;
    if (b.length) t = Math.max(b.start(0), Math.min(t, b.end(b.length - 1) - 0.25)); // stay inside what is loaded
    el.currentTime = Math.max(0, t);
    poke();
  };
  useModal((p) => {
    if (p.btn === "b") {
      onClose();
      playSound("back");
    } else if (p.btn === "a") {
      if (el) el.paused ? el.play().catch(() => {}) : el.pause();
      poke();
    } else if (p.btn === "left") seek(-10);
    else if (p.btn === "right") seek(10);
    else if (p.btn === "l1") seek(-60);
    else if (p.btn === "r1") seek(60);
    else poke();
    return true;
  });
  const dur = el && isFinite(el.duration) && el.duration > 0 ? el.duration : video.duration;
  const currentTime = el?.currentTime ?? 0;
  const paused = !!el?.paused;
  const date = video.created ? new Date(video.created * 1000).toLocaleString() : "";
  return (
    <div className="dht-media" data-theme={s.theme} style={{ ...mediaVars(s), background: "#000" }} onClick={() => (el ? (el.paused ? el.play().catch(() => {}) : el.pause(), poke()) : onClose())}>
      <style>{MEDIA_CSS}</style>
      <LocalVideoView video={video} sound videoRef={setEl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} onReady={() => setState("playing")} onNone={() => setState("none")} onEnded={() => setShowInfo(true)} />
      <div className="dht-media-info" style={{ opacity: showInfo || paused || state !== "playing" ? 1 : 0 }}>
        <div style={{ fontSize: 22 }}>
          {videoTitle(video, lib)}
          <span style={{ fontSize: 15, color: "var(--m-sub)", marginLeft: 12 }}>{date}</span>
        </div>
        {state === "playing" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, fontSize: 15 }}>
            <span style={{ width: 18 }}>{paused ? "▶" : "❚❚"}</span>
            <span>{fmtDuration(currentTime) || "0:00"}</span>
            <div className="dht-media-bar" style={{ flex: 1 }}>
              <div style={{ width: `${dur ? Math.min(100, (currentTime / dur) * 100) : 0}%` }} />
            </div>
            <span>{fmtDuration(dur)}</span>
          </div>
        ) : (
          <div style={{ marginTop: 10, fontSize: 16, color: "var(--m-sub)" }}>{state === "loading" ? t("loadingDots") : t("videoUnsupportedFormat")}</div>
        )}
        <div style={{ fontSize: 13, color: "var(--m-sub)", marginTop: 8 }}>{t("trailerControlsPrompt")}</div>
      </div>
    </div>
  );
}
