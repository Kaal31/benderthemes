// PSP / PS3 XMB extras: the PSP's info bar that slides down from the top, its busy icon, progress
// bars drawn with the theme's own pictures, and the music player screen. Positions come from the
// firmware layout (480 × 272 screen, centre origin, y up), scaled to the Deck's screen.
import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";
import { pushModalInput } from "../input";
import { fmtClock, musicPlayer, usePlayer, useFullMusicPlayer } from "../musicPlayer";
import type { ThemeText } from "../skins";

export interface HudArt {
  infobar?: string;
  busy?: string;
  dlBase?: string;
  dlBar?: string;
  progressBase?: string;
  progressBar?: string;
  musicAlbum?: string;
  musicTrack?: string;
}

const pspUnit = (W: number, H: number) => Math.min(W / 480, H / 272);

/** A bar from the theme's two small cap pictures (stretched like the PSP does), or a drawn one. */
export function XmbBar({ value, w, h, base, fill, style }: { value: number; w: number; h: number; base?: string; fill?: string; style?: CSSProperties }) {
  const v = value < 0 ? 0.25 : Math.max(0, Math.min(1, value));
  const cap = Math.max(1, Math.round(h / 3));
  const pic = (src: string): CSSProperties => ({ borderStyle: "solid", borderWidth: cap, borderImage: `url("${src}") 2 fill stretch`, boxSizing: "border-box" });
  return (
    <div className="dht-xmb-bar" style={{ position: "relative", width: w, height: h, ...style }}>
      <div style={{ position: "absolute", inset: 0, ...(base ? pic(base) : { background: "rgba(255,255,255,0.22)", borderRadius: h / 2, boxShadow: "inset 0 1px 1px rgba(0,0,0,0.35)" }) }} />
      <div
        className={value < 0 ? "dht-xmb-bar-busy" : undefined}
        style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: Math.max(h, w * v), transition: "width 400ms ease-out", ...(fill ? pic(fill) : { background: "linear-gradient(#fff, #cfd8e6)", borderRadius: h / 2, boxShadow: "0 0 4px rgba(255,255,255,0.55)" }) }}
      />
      {value < 0 && <style>{"@keyframes dhtBarBusy{0%{left:0}50%{left:75%}100%{left:0}} .dht-xmb-bar-busy{animation:dhtBarBusy 1.6s ease-in-out infinite}"}</style>}
    </div>
  );
}

/** The PSP's info bar: slides down from the top with a message, then back up. */
export function XmbInfoBar({ W, H, message, art, text, k = 1 }: { W: number; H: number; message: string; art?: HudArt; text?: ThemeText; k?: number }) {
  const u = pspUnit(W, H) * k;
  const [shown, setShown] = useState("");
  const [down, setDown] = useState(false);
  useEffect(() => {
    if (!message) return setDown(false);
    setShown(message);
    setDown(true);
  }, [message]);
  const h = 21 * u;
  // the firmware puts the text 72 units into the bar (which starts 42 units left of the screen)
  // and 28 units below its top; themes move it with their own numbers
  const x = ((text?.x ?? 72) - 42) * u;
  const y = h / 2 + ((text?.y ?? -28) + 28) * -u;
  const size = (text?.size ?? 8.2) * 1.15 * u;
  return (
    <div
      className="dht-xmb-infobar"
      style={{ position: "absolute", left: 0, top: 0, width: W, height: h, transform: `translateY(${down ? 0 : -h - 4}px)`, transition: "transform 320ms cubic-bezier(.2,.8,.2,1)", zIndex: 30, pointerEvents: "none" }}
    >
      {art?.infobar ? (
        <img src={art.infobar} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(rgba(10,14,22,0.82), rgba(10,14,22,0.6))", borderBottom: "1px solid rgba(255,255,255,0.35)" }} />
      )}
      <div
        style={{
          position: "absolute",
          left: x,
          top: y,
          transform: "translateY(-50%)",
          whiteSpace: "nowrap",
          fontFamily: "var(--dht-xmb-font, inherit)",
          fontSize: size,
          color: text?.color ?? "#fff",
          textShadow: text ? `${text.shadowX * u * 0.5}px ${text.shadowY * u * 0.5}px 0 ${text.shadow}` : "0 1px 2px rgba(0,0,0,0.6)",
        }}
      >
        {shown}
      </div>
    </div>
  );
}

/** The busy icon in the bottom-right corner (the theme's animation strip, or a drawn spinner). */
export function XmbBusy({ W, H, art, k = 1 }: { W: number; H: number; art?: HudArt; k?: number }) {
  const u = pspUnit(W, H) * k;
  const size = 17 * u;
  const [frames, setFrames] = useState(1);
  const [f, setF] = useState(0);
  useEffect(() => {
    setFrames(1);
    if (!art?.busy) return;
    let alive = true;
    const img = new Image();
    img.onload = () => alive && setFrames(img.naturalHeight > img.naturalWidth * 1.5 ? Math.round(img.naturalHeight / img.naturalWidth) : 1);
    img.src = art.busy;
    return () => { alive = false; };
  }, [art?.busy]);
  useEffect(() => {
    if (frames <= 1) return;
    const t = setInterval(() => setF((x) => (x + 1) % frames), 66);
    return () => clearInterval(t);
  }, [frames]);
  // the firmware's busy icon sits at (226, -122)
  const box: CSSProperties = { position: "absolute", left: W / 2 + 226 * u - size / 2, top: H / 2 + 122 * u - size / 2, width: size, height: size, zIndex: 30, pointerEvents: "none" };
  if (art?.busy && frames > 1)
    return <div className="dht-xmb-busy" style={{ ...box, backgroundImage: `url("${art.busy}")`, backgroundSize: `100% ${frames * 100}%`, backgroundPosition: `0 ${(f / (frames - 1)) * 100}%` }} />;
  if (art?.busy) return <img className="dht-xmb-busy" src={art.busy} alt="" style={{ ...box, animation: "dhtBusySpin 1.2s linear infinite" }} />;
  return (
    <div className="dht-xmb-busy" style={box}>
      <svg viewBox="0 0 34 34" width={size} height={size} style={{ animation: "dhtBusySpin 1s steps(12) infinite", filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }}>
        {Array.from({ length: 12 }, (_, i) => (
          <rect key={i} x="15.5" y="3" width="3" height="8" rx="1.5" fill="#fff" opacity={0.15 + (i / 12) * 0.85} transform={`rotate(${i * 30} 17 17)`} />
        ))}
      </svg>
      <style>{"@keyframes dhtBusySpin{to{transform:rotate(360deg)}}"}</style>
    </div>
  );
}

function Glyph({ d, size, on = true }: { d: string; size: number; on?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} style={{ opacity: on ? 1 : 0.35, filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.6))" }}>
      <path d={d} fill="currentColor" />
    </svg>
  );
}
const G = {
  play: "M7 4.5v15l12.5-7.5z",
  pause: "M6.5 4.5h4v15h-4zM13.5 4.5h4v15h-4z",
  prev: "M6 5h2.5v14H6zM20 5v14L9.5 12z",
  next: "M15.5 5H18v14h-2.5zM4 5v14l10.5-7z",
  shuffle: "M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z",
  repeat: "M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z",
};

/** The PSP's music player screen, over the XMB background. */
export function XmbMusicScreen({ W, H, art, k = 1, accentText }: { W: number; H: number; art?: HudArt; k?: number; accentText?: ReactNode }) {
  const p = usePlayer();
  const u = pspUnit(W, H) * k;
  const open = p.open && !!p.album;
  useFullMusicPlayer(open);
  const ref = useRef(p);
  ref.current = p;
  useEffect(() => {
    if (!open) return;
    return pushModalInput((e) => {
      switch (e.btn) {
        case "a": musicPlayer.toggle(); return true;
        case "left": musicPlayer.prev(); return true;
        case "right": musicPlayer.next(); return true;
        case "l1": case "l2": musicPlayer.seek(-10); return true;
        case "r1": case "r2": musicPlayer.seek(10); return true;
        case "x": musicPlayer.setShuffle(!ref.current.shuffle); return true;
        case "y": musicPlayer.cycleRepeat(); return true;
        case "b": musicPlayer.show(false); return true; // the music goes on while you browse
        case "menu": musicPlayer.stop(); return true;
      }
      return true;
    });
  }, [open]);
  if (!open || !p.album) return null;
  const t = p.album.tracks[p.index];
  const cover = p.album.cover || art?.musicTrack || art?.musicAlbum;
  const font = (n: number) => n * 1.15 * u;
  const text: CSSProperties = { fontFamily: "var(--dht-xmb-font, inherit)", color: "var(--dht-xmb-text, #fff)", textShadow: "var(--dht-xmb-text-shadow, 0 1px 3px rgba(0,0,0,0.6))", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" };
  const left = W / 2 - 200 * u, artSize = 112 * u, colX = left + artSize + 22 * u, colW = W / 2 + 216 * u - colX;
  return (
    <div className="dht-xmb-music" style={{ position: "absolute", inset: 0, zIndex: 25, animation: "dhtMusicIn 260ms ease-out both" }}>
        <style>{`@keyframes dhtMusicIn{from{opacity:0;transform:translateX(24px)}to{opacity:1;transform:none}}
          .dht-xmb-music-controls button{display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;min-width:36px;min-height:40px;padding:4px;border:1px solid transparent;border-radius:4px;background:transparent;color:inherit;font:inherit;cursor:pointer}
          .dht-xmb-music-controls button:hover,.dht-xmb-music-controls button:focus-visible{border-color:currentColor;background:#ffffff20;outline:none}
        `}</style>
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.45), rgba(0,0,0,0.25))" }} />
      <div style={{ ...text, position: "absolute", left, top: H / 2 - 112 * u, fontSize: font(7), opacity: 0.8 }}>
        Music {accentText ? <>· {accentText}</> : null}
      </div>
      {/* album picture */}
      <div style={{ position: "absolute", left, top: H / 2 - artSize / 2 - 14 * u, width: artSize, height: artSize, boxShadow: "0 6px 22px rgba(0,0,0,0.55)", border: p.album.cover ? `${Math.max(1, u)}px solid rgba(255,255,255,0.85)` : undefined, display: "flex", alignItems: "center", justifyContent: "center", boxSizing: "border-box", background: p.album.cover ? "#111" : "transparent" }}>
        {cover ? <img src={cover} alt="" style={{ width: "100%", height: "100%", objectFit: p.album.cover ? "cover" : "contain" }} /> : <Glyph d={G.play} size={artSize * 0.5} />}
      </div>
      {/* track, album, artist */}
      <div style={{ position: "absolute", left: colX, top: H / 2 - 56 * u, width: colW, display: "flex", flexDirection: "column", gap: 5 * u }}>
        <div style={{ ...text, fontSize: font(10.5) }}>{t?.title ?? ""}</div>
        <div style={{ ...text, fontSize: font(7.5), opacity: 0.85 }}>{p.album.name}</div>
        {p.album.artist && <div style={{ ...text, fontSize: font(7.5), opacity: 0.85 }}>{p.album.artist}</div>}
        <div style={{ ...text, fontSize: font(6.5), opacity: 0.65 }}>
          {p.error || <>{p.index + 1} / {p.album.tracks.length}
          {t?.disc ? ` · ${t.disc}` : ""}</>}
        </div>
      </div>
      {/* status and time */}
      <div style={{ position: "absolute", left: colX, top: H / 2 + 26 * u, width: colW, color: "var(--dht-xmb-text, #fff)" }}>
        <div className="dht-xmb-music-controls" style={{ display: "flex", alignItems: "center", gap: 2 * u, marginBottom: 7 * u }}>
          <button type="button" aria-label="Previous" onClick={() => musicPlayer.prev()}>⏮</button>
          <button type="button" aria-label="Rewind 10 seconds" onClick={() => musicPlayer.seek(-10)}>⏪</button>
          <button type="button" aria-label={p.playing ? "Pause" : "Play"} onClick={() => musicPlayer.toggle()}><Glyph d={p.playing ? G.pause : G.play} size={12 * u} /></button>
          <button type="button" aria-label="Forward 10 seconds" onClick={() => musicPlayer.seek(10)}>⏩</button>
          <button type="button" aria-label="Next" onClick={() => musicPlayer.next()}>⏭</button>
          <button type="button" aria-label="Shuffle" aria-pressed={p.shuffle} onClick={() => musicPlayer.setShuffle(!p.shuffle)}><Glyph d={G.shuffle} size={10 * u} on={p.shuffle} /></button>
          <button type="button" aria-label={`Repeat ${p.repeat}`} aria-pressed={p.repeat !== "off"} onClick={() => musicPlayer.cycleRepeat()}>
            <Glyph d={G.repeat} size={10 * u} on={p.repeat !== "off"} />
            {p.repeat === "one" && <span style={{ ...text, fontSize: font(5) }}>1</span>}
          </button>
          <button type="button" aria-label="Stop" onClick={() => musicPlayer.stop()}>■</button>
          {p.crossfade > 0 && <span style={{ ...text, fontSize: font(5.6), opacity: p.fading ? 1 : 0.7 }} title="Crossfade">⇌ {p.crossfade}s</span>}
        </div>
        <XmbBar value={p.duration ? p.time / p.duration : 0} w={colW} h={6 * u} base={art?.progressBase} fill={art?.progressBar} />
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 * u, ...text, fontSize: font(6.5) }}>
          <span>{fmtClock(p.time)}</span>
          <span>{p.duration ? fmtClock(p.duration) : "--:--"}</span>
        </div>
      </div>
      {/* button guide, like the firmware's operation guide at the bottom */}
      <div style={{ ...text, position: "absolute", left: 0, right: 0, bottom: 8 * u, display: "flex", justifyContent: "center", gap: 14 * u, fontSize: font(5.6), opacity: 0.85 }}>
        <span>Ⓐ {p.playing ? "Pause" : "Play"}</span>
        <span>◀ ▶ Track</span>
        <span>L / R Rewind · Forward</span>
        <span>Ⓧ Shuffle</span>
        <span>Ⓨ Repeat</span>
        <span>Ⓑ Back</span>
        <span>☰ Stop</span>
      </div>
    </div>
  );
}

/** The PS3's notification: a small box sliding in at the top right, under the clock. */
export function Ps3Notice({ W, message, art }: { W: number; message: string; art?: string }) {
  const [shown, setShown] = useState("");
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (!message) return setOn(false);
    setShown(message);
    setOn(true);
  }, [message]);
  const s = W / 1280;
  return (
    <div
      className="dht-ps3-notice"
      style={{
        position: "absolute",
        right: 40 * s,
        top: 92 * s,
        maxWidth: 520 * s,
        display: "flex",
        alignItems: "center",
        gap: 14 * s,
        padding: `${12 * s}px ${20 * s}px`,
        borderRadius: 8 * s,
        background: "linear-gradient(rgba(40,40,40,0.82), rgba(10,10,10,0.82))",
        border: "1px solid rgba(255,255,255,0.28)",
        boxShadow: "0 6px 22px rgba(0,0,0,0.5)",
        color: "#fff",
        fontSize: 21 * s,
        fontFamily: "var(--dht-xmb-font, inherit)",
        opacity: on ? 1 : 0,
        transform: on ? "none" : `translateX(${30 * s}px)`,
        transition: "opacity 300ms ease, transform 300ms ease",
        zIndex: 30,
        pointerEvents: "none",
      }}
    >
      <span className="dht-ps3-notice-icon" data-dht-from-skin={art ? "" : undefined} style={{ display: "block", width: 34 * s, height: 34 * s, flex: "none", position: "relative" }}>
        {/* the theme's own notification picture (a .p3t's notification entry) sits behind the icon */}
        {art && <img src={art} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />}
        <svg viewBox="0 0 24 24" width={30 * s} height={30 * s} aria-hidden="true" style={{ position: "absolute", left: 2 * s, top: 2 * s }}>
          <path d="M11 3h2v9.2l3.3-3.3 1.4 1.4L12 16l-5.7-5.7 1.4-1.4 3.3 3.3zM4 18h16v2H4z" fill="#fff" />
        </svg>
      </span>
      <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{shown}</span>
    </div>
  );
}
