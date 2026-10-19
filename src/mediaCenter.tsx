// The music player and the capture viewer every theme shares. There is one player (musicPlayer.ts)
// and one viewer (overlays.tsx); each theme only gives them its look, taken from the theme drawing
// the "media" page (its store skin plus a few console touches below). Because the state lives in
// one place, what is playing, the queue, shuffle / repeat and the viewer's place stay the same when
// you switch themes, open the player from another menu, or play a video (the music pauses for it
// and comes back afterwards).
import { CSSProperties, MouseEvent as RMouseEvent, ReactNode, useEffect, useRef, useState } from "react";
import { Icon } from "./common";
import { pageSettings } from "./engine/pages";
import { pushModalInput, Press, Stage } from "./input";
import { crossfadeName, CROSSFADE_MAX, fmtClock, MusicAlbum, musicPlayer, REPEAT_NAMES, useMusic, usePlayer, useFullMusicPlayer, fullMusicPlayerVisible } from "./musicPlayer";
import { Settings, useSettings } from "./settings";
import { playSound } from "./steam";
import { storeSkin } from "./storeView";
import { NINTENDO_MEDIA_CSS } from "./themes/nintendoPageLooks";
import { IISU_MEDIA_CSS, iisuPageVars, iisuSchemeAttr } from "./themes/iisuStyles";

/** The settings the player and viewer are drawn with (the "media" page can take another theme). */
export function useMediaSettings(): Settings {
  return pageSettings(useSettings(), "media");
}

/** CSS variables for the shared media screens, from the theme's skin. */
export function mediaVars(s: Settings): CSSProperties {
  const k = storeSkin(s);
  const see = k.bg === "transparent" ? "radial-gradient(ellipse at 50% 20%, #1d1a26, #050408 80%)" : k.bg;
  return {
    "--m-bg": see,
    "--m-panel": k.panel,
    "--m-text": k.text,
    "--m-sub": k.sub,
    "--m-accent": k.accent,
    "--m-accent-text": k.accentText,
    "--m-radius": `${k.radius}px`,
    "--m-font": k.font ?? '"Segoe UI", "Motiva Sans", Arial, sans-serif',
    ...iisuPageVars(s),
  } as CSSProperties;
}

export const MEDIA_CSS = `
.dht-media{position:absolute;inset:0;z-index:80;background:var(--m-bg);color:var(--m-text);font-family:var(--m-font);overflow:hidden}
.dht-media *{box-sizing:border-box}
.dht-media-head{position:absolute;left:56px;right:56px;top:30px;display:flex;align-items:center;gap:18px;height:52px}
.dht-media-title{font-size:30px;font-weight:300;margin:0;white-space:nowrap}
.dht-media-tabs{display:flex;gap:10px;margin-left:18px}
.dht-media-tabs button{font:inherit;font-size:18px;padding:7px 18px;border-radius:var(--m-radius);border:1px solid transparent;background:var(--m-panel);color:var(--m-text);cursor:pointer}
.dht-media-tabs button[aria-current=true]{background:var(--m-accent);color:var(--m-accent-text)}
.dht-media-hints{position:absolute;left:56px;right:56px;bottom:22px;font-size:15px;color:var(--m-sub);display:flex;gap:22px;flex-wrap:wrap}
.dht-media-panel{background:var(--m-panel);border-radius:var(--m-radius)}
.dht-media-row{display:flex;align-items:center;gap:14px;width:100%;min-height:54px;padding:8px 16px;border:0;border-radius:var(--m-radius);background:transparent;color:var(--m-text);font:inherit;font-size:19px;text-align:left;cursor:pointer}
.dht-media-row small{display:block;font-size:14px;color:var(--m-sub);margin-top:2px}
.dht-media-row[data-on=true]{background:var(--m-accent);color:var(--m-accent-text)}
.dht-media-row[data-on=true] small{color:inherit;opacity:.8}
.dht-media-row[data-playing=true]>.dht-media-eq{opacity:1}
.dht-media-eq{opacity:0;margin-left:auto;display:flex;gap:2px;align-items:flex-end;height:16px}
.dht-media-eq i{width:3px;background:currentColor;animation:dhtEq .9s ease-in-out infinite alternate}
.dht-media-eq i:nth-child(2){animation-delay:-.3s}.dht-media-eq i:nth-child(3){animation-delay:-.6s}
.dht-media-eq[data-paused=true] i{animation:none;height:4px}
@keyframes dhtEq{from{height:3px}to{height:16px}}
.dht-media-bar{position:relative;height:6px;border-radius:3px;background:color-mix(in srgb,var(--m-text) 22%,transparent);overflow:hidden;cursor:pointer}
.dht-media-bar>div{position:absolute;left:0;top:0;bottom:0;background:var(--m-text);border-radius:3px}
.dht-media-cover{background:color-mix(in srgb,var(--m-text) 12%,transparent);border-radius:var(--m-radius);display:grid;place-items:center;overflow:hidden;flex-shrink:0}
.dht-media-cover img{width:100%;height:100%;object-fit:cover}
.dht-media-ctl{display:flex;gap:10px;align-items:center}
.dht-media-ctl button{display:grid;place-items:center;width:46px;height:46px;border-radius:50%;border:1px solid color-mix(in srgb,var(--m-text) 30%,transparent);background:transparent;color:var(--m-text);cursor:pointer;font:inherit;font-size:13px}
.dht-media-ctl button[data-on=true]{background:var(--m-accent);color:var(--m-accent-text)}
.dht-media-ctl button.dht-media-big{width:58px;height:58px}
.dht-media-ctl button.dht-media-xf{width:auto;min-width:46px;padding:0 12px;border-radius:23px;font-size:12px;line-height:1.1;white-space:nowrap}
.dht-media-ctl button.dht-media-xf small{display:block;font-size:10px;opacity:.75}
.dht-media-status{display:flex;gap:10px;font-size:13px;color:var(--m-sub);margin-top:4px;min-height:17px}
.dht-media-status b{font-weight:600;color:var(--m-text)}
.dht-media-status[data-error=true]{color:#ff8a80}
.dht-media-tile{position:absolute;overflow:hidden;border-radius:var(--m-radius);background:var(--m-panel);transition:transform 140ms}
.dht-media-tile img{width:100%;height:100%;object-fit:cover}
.dht-media-tile span{position:absolute;right:8px;bottom:6px;padding:2px 7px;font-size:13px;border-radius:4px;background:#000a;color:#fff}
.dht-media-info{position:absolute;left:0;right:0;bottom:0;padding:44px 48px 24px;color:var(--m-text);background:linear-gradient(180deg,transparent,color-mix(in srgb,var(--m-panel) 92%,#000) 60%);transition:opacity 600ms}
.dht-media-mini{position:absolute;right:26px;bottom:26px;z-index:60;display:flex;align-items:center;gap:12px;padding:8px 14px 8px 8px;min-width:300px;max-width:440px;border-radius:var(--m-radius);background:var(--m-panel);color:var(--m-text);font-family:var(--m-font);box-shadow:0 8px 26px #0007;cursor:pointer;backdrop-filter:blur(12px)}
.dht-media-mini b{display:block;font-size:16px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-media-mini small{display:block;font-size:13px;color:var(--m-sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-media-mini .dht-media-bar{height:3px;margin-top:6px}
.dht-media-mini-controls{display:flex;align-items:center;gap:2px;flex-shrink:0}
.dht-media-mini-controls button{display:grid;place-items:center;min-width:36px;min-height:40px;padding:4px;border:0;border-radius:6px;background:none;color:inherit;font-size:18px;cursor:pointer}
.dht-media-mini-controls button:hover,.dht-media-mini-controls button:focus-visible{background:color-mix(in srgb,currentColor 15%,transparent);outline:1px solid currentColor}
/* console touches */
.dht-media-mini[data-theme=minecraft]{bottom:72px}
.dht-media[data-theme=ps3],.dht-media[data-theme=psp]{background:radial-gradient(ellipse at 30% 10%,#2a5ea8,#0e2a5c 45%,#050f24)}
.dht-media[data-theme=ps3] .dht-media-row[data-on=true],.dht-media[data-theme=psp] .dht-media-row[data-on=true]{background:linear-gradient(90deg,#ffffff38,#ffffff05);text-shadow:0 0 10px #9cc6ff}
.dht-media[data-theme=ps3] .dht-media-panel,.dht-media[data-theme=psp] .dht-media-panel{background:none}
.dht-media[data-theme=ps2] .dht-media-title{letter-spacing:4px;text-transform:uppercase;text-shadow:0 0 12px #6f8cff}
.dht-media[data-theme=vita] .dht-media-head{color:#fff}.dht-media[data-theme=vita] .dht-media-hints{color:#dcecff}
.dht-media[data-theme=vita] .dht-media-ctl button{background:#fff;color:#0b4fb0;border-color:#fff}
.dht-media[data-theme=ps4] .dht-media-title,.dht-media[data-theme=ps5] .dht-media-title{font-weight:200}
.dht-media[data-theme=xbox]{text-transform:uppercase}
.dht-media[data-theme=xbox] .dht-media-title{color:#c6ff6a;text-shadow:0 0 14px #7dff2a;font-weight:700}
.dht-media[data-theme=xbox] .dht-media-ctl button{border-color:#8fd34a;box-shadow:0 0 12px #6dc02a66}
.dht-media[data-theme=x360] .dht-media-title{font-weight:400}
.dht-media[data-theme=wii] .dht-media-row,.dht-media[data-theme=wiiu] .dht-media-row{border-radius:999px}
.dht-media[data-theme=wii] .dht-media-ctl button,.dht-media[data-theme=wiiu] .dht-media-ctl button{background:linear-gradient(#fff,#e6eef3);border:2px solid #9bd8f0;color:#5d7584}
.dht-media[data-theme=wii] .dht-media-panel,.dht-media[data-theme=wiiu] .dht-media-panel{box-shadow:0 2px 8px #879dab33}
.dht-media[data-theme=minecraft] .dht-media-panel,.dht-media[data-theme=minecraft] .dht-media-row,.dht-media[data-theme=minecraft] .dht-media-ctl button,.dht-media[data-theme=minecraft] .dht-media-tabs button{border-radius:0;border:2px solid #171717;box-shadow:inset 2px 2px #ffffff38,inset -3px -4px #1112168c}
.dht-media[data-theme=minecraft] .dht-media-row[data-on=true]{background:#326f18;color:#fff}
.dht-media[data-theme=minecraft] *{text-shadow:2px 2px #14151a}
.dht-media[data-theme=nazarick] .dht-media-panel{border:1px solid #b9a48066;box-shadow:inset 0 0 30px #000}
.dht-media[data-theme=nazarick] .dht-media-title{letter-spacing:3px;color:#cba765}
.dht-media[data-theme=pain] .dht-media-panel{box-shadow:0 0 24px #a64eeb33}
.dht-media[data-theme=aero] .dht-media-panel,.dht-media[data-theme=aero2] .dht-media-panel,.dht-media[data-theme=aero] .dht-media-mini,.dht-media-mini[data-theme=aero],.dht-media-mini[data-theme=aero2]{backdrop-filter:blur(14px) saturate(1.4);border:1px solid #ffffff88;box-shadow:inset 0 1px #fffc,0 8px 22px #0004}
.dht-media[data-theme=dial] .dht-media-title{font-family:monospace;letter-spacing:2px}
.dht-media[data-theme=republic] .dht-media-panel{border:1px solid #d9bb6955}
${NINTENDO_MEDIA_CSS}
${IISU_MEDIA_CSS}
`;

/** The shared frame: background, title, optional tabs and the button hints, in the theme's look. */
export function MediaFrame({ s, title, tabs, children, hints, onTab }: { s: Settings; title: ReactNode; tabs?: { id: string; label: string; on: boolean }[]; onTab?: (id: string) => void; hints?: string[]; children: ReactNode }) {
  return (
    <div className="dht-media" data-theme={s.theme} data-variant={s.theme === "x360" ? s.x360?.style : undefined} data-scheme={iisuSchemeAttr(s)} style={mediaVars(s)}>
      <style>{MEDIA_CSS}</style>
      <Stage background="transparent">
        <header className="dht-media-head">
          <h1 className="dht-media-title">{title}</h1>
          {tabs && <nav className="dht-media-tabs">{tabs.map((t) => <button key={t.id} aria-current={t.on} onClick={() => onTab?.(t.id)}>{t.label}</button>)}</nav>}
        </header>
        {children}
        {hints && <div className="dht-media-hints">{hints.map((h) => <span key={h}>{h}</span>)}</div>}
      </Stage>
    </div>
  );
}

function Eq({ paused }: { paused: boolean }) {
  return <span className="dht-media-eq" data-paused={paused} aria-hidden><i /><i /><i /></span>;
}

function Cover({ src, size }: { src?: string; size: number }) {
  const [bad, setBad] = useState(false);
  return <div className="dht-media-cover" style={{ width: size, height: size }}>{src && !bad ? <img src={src} alt="" onError={() => setBad(true)} /> : <Icon name="music" size={size * 0.45} />}</div>;
}

/** The crossfade steps a button / L2 R2 go through (every second from 1 to 12 is in the Y menu's "Music playback"). */
const XF_STEPS = [0, 2, 4, 6, 8, 10, CROSSFADE_MAX];
function nextCrossfade(cur: number, d: 1 | -1): number {
  const i = XF_STEPS.findIndex((v) => v >= cur);
  const at = i < 0 ? XF_STEPS.length - 1 : XF_STEPS[i] === cur ? i : d > 0 ? i - 1 : i;
  return XF_STEPS[(at + d + XF_STEPS.length) % XF_STEPS.length];
}

/** Where the player screen was left, so it reopens there (in any theme). */
const where = { album: 0, track: 0, zone: "albums" as "albums" | "tracks" };

// ───────────── the music player screen ─────────────
export function MusicPlayerView({ onClose }: { onClose: () => void }) {
  useFullMusicPlayer(true);
  const s = useMediaSettings();
  const albums = useMusic();
  const p = usePlayer();
  const list: MusicAlbum[] = albums ?? [];
  const playingAlbum = p.album ? list.findIndex((a) => a.id === p.album!.id) : -1;
  const [album, setAlbum] = useState(() => (playingAlbum >= 0 && where.zone === "albums" ? playingAlbum : where.album));
  const [track, setTrack] = useState(where.track);
  const [zone, setZone] = useState(where.zone);
  const al = list[Math.min(album, Math.max(0, list.length - 1))];
  useEffect(() => { where.album = album; where.track = track; where.zone = zone; }, [album, track, zone]);
  const albumsRef = useRef<HTMLDivElement>(null), tracksRef = useRef<HTMLDivElement>(null);
  useEffect(() => { albumsRef.current?.querySelector("[data-on=true]")?.scrollIntoView({ block: "nearest" }); }, [album]);
  useEffect(() => { tracksRef.current?.querySelector("[data-on=true]")?.scrollIntoView({ block: "nearest" }); }, [track, album, zone]);
  const isPlaying = (a: MusicAlbum | undefined, i: number) => !!a && p.album?.id === a.id && p.index === i;
  const start = (a: MusicAlbum, i: number) => {
    if (isPlaying(a, i)) musicPlayer.toggle();
    else { musicPlayer.play(a, i); musicPlayer.show(false); }
  };
  const live = useRef({ album, track, zone, al, n: list.length });
  live.current = { album, track, zone, al, n: list.length };
  useEffect(() => pushModalInput((e: Press) => {
    const c = live.current;
    const move = (d: number) => {
      if (c.zone === "albums") { const nx = Math.max(0, Math.min(c.n - 1, c.album + d)); if (nx !== c.album) { setAlbum(nx); setTrack(0); playSound("move"); } }
      else { const nx = Math.max(0, Math.min((c.al?.tracks.length ?? 1) - 1, c.track + d)); if (nx !== c.track) { setTrack(nx); playSound("move"); } }
    };
    switch (e.btn) {
      case "up": move(-1); break;
      case "down": move(1); break;
      case "right": if (c.zone === "albums" && c.al) { setZone("tracks"); playSound("move"); } else musicPlayer.seek(10); break;
      case "left": if (c.zone === "tracks") { setZone("albums"); playSound("move"); } break;
      case "a":
        if (c.zone === "albums" && c.al) { setZone("tracks"); playSound("select"); }
        else if (c.al) { start(c.al, c.track); playSound("select"); }
        break;
      case "x": musicPlayer.setShuffle(!musicPlayer.state().shuffle); playSound("select"); break;
      case "y": musicPlayer.cycleRepeat(); playSound("select"); break;
      case "l2": case "r2": musicPlayer.setCrossfade(nextCrossfade(musicPlayer.state().crossfade, e.btn === "r2" ? 1 : -1)); playSound("select"); break;
      case "l1": musicPlayer.prev(); break;
      case "r1": musicPlayer.next(); break;
      case "menu": musicPlayer.stop(); break;
      case "b": playSound("back"); onClose(); break;
      default: break; // everything else is swallowed while open
    }
    return true;
  }), []);
  const cur = p.album?.tracks[p.index];
  const pct = p.duration ? Math.min(100, (p.time / p.duration) * 100) : 0;
  const seekAt = (ev: RMouseEvent<HTMLDivElement>) => {
    const r = ev.currentTarget.getBoundingClientRect();
    if (p.duration) musicPlayer.seek((ev.clientX - r.left) / r.width * p.duration - p.time);
  };
  return (
    <MediaFrame s={s} title="Music" hints={["Ⓐ Play / Pause", "L1 R1 Track", "Ⓧ Shuffle", "Ⓨ Repeat", "L2 R2 Crossfade", "☰ Stop", "Ⓑ Close · music keeps playing"]}>
      <div ref={albumsRef} className="dht-media-panel" style={{ position: "absolute", left: 56, top: 100, width: 400, bottom: 210, overflowY: "auto", padding: 8 }}>
        {albums === null && <div style={{ padding: 16, opacity: 0.7 }}>Looking for music…</div>}
        {albums !== null && !list.length && <div style={{ padding: 16, opacity: 0.8, lineHeight: 1.4 }}>No music yet. Steam soundtracks and music in your Music folder or on an SD card show up here.</div>}
        {list.map((a, i) => (
          <button key={a.id} className="dht-media-row" data-on={i === album && zone === "albums"} data-playing={p.album?.id === a.id} onClick={() => { setAlbum(i); setTrack(0); setZone("tracks"); }} style={i === album && zone !== "albums" ? { outline: "1px solid var(--m-sub)" } : undefined}>
            <Cover src={a.cover} size={40} />
            <span style={{ minWidth: 0, overflow: "hidden" }}><span style={{ display: "block", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</span><small>{[a.artist, `${a.tracks.length} track${a.tracks.length === 1 ? "" : "s"}`].filter(Boolean).join(" · ")}</small></span>
            <Eq paused={!p.playing} />
          </button>
        ))}
      </div>
      <div ref={tracksRef} className="dht-media-panel" style={{ position: "absolute", left: 476, right: 56, top: 100, bottom: 210, overflowY: "auto", padding: 8 }}>
        {al?.tracks.map((t, i) => (
          <button key={t.id} className="dht-media-row" data-on={zone === "tracks" && i === track} data-playing={isPlaying(al, i)} onClick={() => { setZone("tracks"); setTrack(i); start(al, i); }}>
            <span style={{ width: 30, textAlign: "right", opacity: 0.6, fontSize: 15 }}>{i + 1}</span>
            <span style={{ minWidth: 0, overflow: "hidden", whiteSpace: "nowrap", textOverflow: "ellipsis" }}>{t.title}</span>
            <Eq paused={!p.playing} />
          </button>
        ))}
      </div>
      <div className="dht-media-panel" style={{ position: "absolute", left: 56, right: 56, bottom: 62, height: 130, display: "flex", alignItems: "center", gap: 22, padding: "0 22px" }}>
        <Cover src={p.album?.cover} size={96} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 22, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{cur?.title ?? "Nothing playing"}</div>
          <div style={{ fontSize: 15, color: "var(--m-sub)", marginTop: 3 }}>{p.album ? [p.album.name, p.album.artist].filter(Boolean).join(" · ") : "Pick an album and a track"}</div>
          <div className="dht-media-status" data-error={!!p.error}>
            {p.error ? <span>{p.error}</span> : <>
              {p.shuffle && <span><b>⤨</b> Shuffle</span>}
              {p.repeat !== "off" && <span><b>{p.repeat === "one" ? "↻1" : "↻"}</b> Repeat {REPEAT_NAMES[p.repeat].toLowerCase()}</span>}
              {p.crossfade > 0 && <span><b>⇌</b> {p.fading ? "Crossfading" : `Crossfade ${p.crossfade} s`}</span>}
            </>}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12, fontSize: 14 }}>
            <span>{fmtClock(p.time)}</span>
            <div className="dht-media-bar" style={{ flex: 1 }} onClick={seekAt}><div style={{ width: `${pct}%` }} /></div>
            <span>{fmtClock(p.duration)}</span>
          </div>
        </div>
        <div className="dht-media-ctl">
          <button aria-label="Shuffle" data-on={p.shuffle} onClick={() => musicPlayer.setShuffle(!p.shuffle)}>⤨</button>
          <button aria-label="Previous" onClick={() => musicPlayer.prev()}>⏮</button>
          <button className="dht-media-big" aria-label={p.playing ? "Pause" : "Play"} onClick={() => (p.album ? musicPlayer.toggle() : al && start(al, 0))}>{p.playing ? "❚❚" : "▶"}</button>
          <button aria-label="Next" onClick={() => musicPlayer.next()}>⏭</button>
          <button aria-label={`Repeat ${p.repeat}`} data-on={p.repeat !== "off"} onClick={() => musicPlayer.cycleRepeat()}>{p.repeat === "one" ? "↻1" : "↻"}</button>
          <button className="dht-media-xf" aria-label={`Crossfade ${crossfadeName(p.crossfade)}`} data-on={p.crossfade > 0} onClick={() => musicPlayer.setCrossfade(nextCrossfade(p.crossfade, 1))}>⇌ {p.crossfade ? `${p.crossfade} s` : "Off"}<small>Crossfade</small></button>
        </div>
      </div>
    </MediaFrame>
  );
}

/** The small "now playing" card on the home of every theme while the shared player has music. */
export function NowPlayingMini({ onOpen }: { onOpen: () => void }) {
  const s = useMediaSettings();
  const p = usePlayer();
  if (!p.album || fullMusicPlayerVisible()) return null;
  const t = p.album.tracks[p.index];
  return (
    <div className="dht-media-mini" data-theme={s.theme} data-scheme={iisuSchemeAttr(s)} style={mediaVars(s)} onClick={onOpen} role="button" aria-label="Open the music player">
      <style>{MEDIA_CSS}</style>
      <Cover src={p.album.cover} size={52} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <b>{t?.title ?? p.album.name}</b>
        <small>{p.playing ? "Now playing" : "Paused"} · {p.album.name}</small>
        <div className="dht-media-bar"><div style={{ width: `${p.duration ? Math.min(100, (p.time / p.duration) * 100) : 0}%` }} /></div>
      </div>
      <div className="dht-media-mini-controls">
        <button type="button" aria-label="Previous" onClick={(e) => { e.stopPropagation(); musicPlayer.prev(); }}>⏮</button>
        <button type="button" aria-label={p.playing ? "Pause" : "Play"} onClick={(e) => { e.stopPropagation(); musicPlayer.toggle(); }}>{p.playing ? "❚❚" : "▶"}</button>
        <button type="button" aria-label="Next" onClick={(e) => { e.stopPropagation(); musicPlayer.next(); }}>⏭</button>
      </div>
    </div>
  );
}
