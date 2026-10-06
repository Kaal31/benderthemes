import { storeSkin } from "./storeView";
import { useSettings } from "./settings";
// Full-screen overlays shared by every theme: a screenshot gallery (Steam's own
// screenshots) and a trailer player. While one is open it receives all input.
import { useEffect, useRef, useState } from "react";
import { Press, setModalInput, Stage, useStage } from "./input";
import { Game } from "./library";
import { fmtDuration, LocalVideo, LocalVideoView, loadScreenshots, Shot, TrailerVideo } from "./media";
import { playSound } from "./steam";

export type Overlay = { kind: "shots"; appid?: number; index?: number } | { kind: "trailer"; game: Game } | { kind: "video"; video: LocalVideo } | { kind: "store" } | null;

function useModal(handler: (p: Press) => boolean) {
  const ref = useRef(handler);
  ref.current = handler;
  useEffect(() => {
    setModalInput((p) => ref.current(p));
    return () => setModalInput(null);
  }, []);
}

// ───────────── screenshots ─────────────
export function ScreenshotGallery({ appid, index, lib, onClose }: { appid?: number; index?: number; lib: Map<number, Game>; onClose: () => void }) {
  const skin=storeSkin(useSettings());
  const [all, setAll] = useState<Shot[] | null>(null);
  useEffect(() => {
    loadScreenshots().then(setAll);
  }, []);
  const shots = (all ?? []).filter((s) => !appid || s.appid === appid);
  const [sel, setSel] = useState(index ?? 0);
  const [full, setFull] = useState(index !== undefined);
  const COLS = 4;
  const cur = shots[Math.min(sel, Math.max(0, shots.length - 1))];
  const name = (id: number) => lib.get(id)?.name ?? (id ? `App ${id}` : "Steam");

  useModal((p) => {
    const n = shots.length;
    const mv = (d: number) => {
      const nx = Math.max(0, Math.min(n - 1, sel + d));
      if (nx !== sel) (setSel(nx), playSound("move"));
    };
    if (p.btn === "b") {
      if (full && index === undefined) setFull(false);
      else onClose();
      playSound("back");
    } else if (p.btn === "a") {
      if (n) setFull(!full);
    } else if (p.btn === "left") mv(-1);
    else if (p.btn === "right") mv(1);
    else if (p.btn === "up" && !full) mv(-COLS);
    else if (p.btn === "down" && !full) mv(COLS);
    else if (p.btn === "y") {setFull(false);setSel(0);}
    return true; // everything else is swallowed while open
  });

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 80, background: skin.bg }}>
      <Stage background="transparent">
        <GalleryBody shots={shots} loaded={all !== null} sel={sel} full={full} cur={cur} name={name} onPick={(i) => (setSel(i), setFull(true))} onClose={() => (full ? setFull(false) : onClose())} title={appid ? name(appid) : "Screenshots"} />
      </Stage>
    </div>
  );
}

function GalleryBody({ shots, loaded, sel, full, cur, name, onPick, onClose, title }: { shots: Shot[]; loaded: boolean; sel: number; full: boolean; cur?: Shot; name: (id: number) => string; onPick: (i: number) => void; onClose: () => void; title: string }) {
  const { W, H } = useStage();
  const skin=storeSkin(useSettings());
  const COLS = 4;
  const TW = (W - 120 - (COLS - 1) * 18) / COLS;
  const TH = TW * 0.5625;
  const row = Math.floor(sel / COLS);
  const visibleRows=Math.max(1,Math.floor((H-180)/(TH+48)));
  const top = Math.max(0, row - visibleRows+1);
  if (full && cur)
    return (
      <div style={{ position: "absolute", inset: 0 }} onClick={onClose}>
        <img src={cur.url} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "contain" }} />
        <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "18px 40px", background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.75))", color: "#fff", fontSize: 18 }}>
          {name(cur.appid)} · {cur.created ? new Date(cur.created * 1000).toLocaleString() : ""} {cur.caption ? `· ${cur.caption}` : ""}
          <span style={{ float: "right", opacity: 0.7 }}>
            {sel + 1} / {shots.length}
          </span>
        </div>
      </div>
    );
  return (
    <div style={{ position: "absolute", inset: 0, color: skin.text }}>
      <div style={{ position: "absolute", left: 60, top: 36, fontSize: 28, fontWeight: 300 }}>{title}</div>
      <div style={{ position: "absolute", right: 60, top: 44, fontSize: 15, opacity: 0.6 }}>Ⓐ view · Ⓑ close · Ⓨ All captures</div>
      {!loaded && <div style={{ position: "absolute", left: 60, top: 120, opacity: 0.7 }}>Loading…</div>}
      {loaded && !shots.length && <div style={{ position: "absolute", left: 60, top: 120, opacity: 0.7 }}>No screenshots yet. Take one with STEAM + R1.</div>}
      {shots.slice(top * COLS, top * COLS + COLS * visibleRows).map((s, k) => {
        const i = top * COLS + k;
        const on = i === sel;
        return (
          <div
            key={s.url}
            onClick={() => onPick(i)}
            style={{
              position: "absolute",
              left: 60 + (i % COLS) * (TW + 18),
              top: 100 + (Math.floor(i / COLS) - top) * (TH + 48),
              width: TW,
              height: TH,
              borderRadius: 6,
              overflow: "hidden",
              ...skin.ring(on),
              transform: on ? "scale(1.04)" : "none",
              transition: "transform 140ms",
            }}
          >
            <img src={s.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        );
      })}
      {cur && !full && <div style={{ position: "absolute", left: 60, bottom: 40, fontSize: 17, opacity: 0.8 }}>{name(cur.appid)}</div>}
    </div>
  );
}

// ───────────── trailer ─────────────
export function TrailerPlayer({ game, onClose }: { game: Game; onClose: () => void }) {
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
    <div style={{ position: "absolute", inset: 0, zIndex: 80, background: "#000" }} onClick={onClose}>
      <TrailerVideo appid={game.appid} sound quality="high" loop={false} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} onReady={() => setState("playing")} onNone={() => setState("none")} onEnded={onClose} />
      <div style={{ position: "absolute", left: 40, bottom: 34, color: "#fff", fontSize: 22, textShadow: "0 2px 6px #000", opacity: showInfo || state !== "playing" ? 1 : 0, transition: "opacity 600ms" }}>
        {game.name} — {state === "loading" ? "loading trailer…" : state === "none" ? "no trailer available" : "trailer"}
        <div style={{ fontSize: 14, opacity: 0.7, marginTop: 4 }}>Ⓑ close</div>
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
  const t = el?.currentTime ?? 0;
  const paused = !!el?.paused;
  const date = video.created ? new Date(video.created * 1000).toLocaleString() : "";
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 80, background: "#000" }} onClick={() => (el ? (el.paused ? el.play().catch(() => {}) : el.pause(), poke()) : onClose())}>
      <LocalVideoView video={video} sound videoRef={setEl} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} onReady={() => setState("playing")} onNone={() => setState("none")} onEnded={() => setShowInfo(true)} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "40px 40px 26px", color: "#fff", background: "linear-gradient(180deg, transparent, rgba(0,0,0,0.8))", opacity: showInfo || paused || state !== "playing" ? 1 : 0, transition: "opacity 600ms" }}>
        <div style={{ fontSize: 22, textShadow: "0 2px 6px #000" }}>
          {videoTitle(video, lib)}
          <span style={{ fontSize: 15, opacity: 0.65, marginLeft: 12 }}>{date}</span>
        </div>
        {state === "playing" ? (
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 12, fontSize: 15 }}>
            <span style={{ width: 18 }}>{paused ? "▶" : "❚❚"}</span>
            <span style={{ opacity: 0.85 }}>{fmtDuration(t) || "0:00"}</span>
            <div style={{ flex: 1, height: 5, borderRadius: 3, background: "rgba(255,255,255,0.25)", overflow: "hidden" }}>
              <div style={{ width: `${dur ? Math.min(100, (t / dur) * 100) : 0}%`, height: "100%", background: "#fff" }} />
            </div>
            <span style={{ opacity: 0.85 }}>{fmtDuration(dur)}</span>
          </div>
        ) : (
          <div style={{ marginTop: 10, fontSize: 16, opacity: 0.8 }}>{state === "loading" ? "Loading…" : "This video can't be played here (unsupported format)."}</div>
        )}
        <div style={{ fontSize: 13, opacity: 0.6, marginTop: 8 }}>Ⓐ pause · ◀ ▶ 10 s · L1 R1 1 min · Ⓑ close</div>
      </div>
    </div>
  );
}
