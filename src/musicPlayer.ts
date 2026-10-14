// Music files on the Deck (Steam soundtracks, ~/Music, SD cards), played by the themes' own music
// players. Like on a PSP the music keeps going while you browse; theme music fades out meanwhile.
import { callable } from "@decky/api";
import { useEffect, useState } from "react";
import { duckMusic, uiWindow } from "./steam";
import { holdOtherMusic } from "./otherPlugins";
import { getRawSettings, onSettingsChange, updateSettings } from "./settings";
import type { MenuItem } from "./common";

export interface MusicTrack {
  id: string;
  title: string;
  file: string;
  url: string;
  size: number;
  disc: string;
}
export interface MusicAlbum {
  id: string;
  name: string;
  source: "steam" | "local";
  appid: number;
  cover: string;
  tracks: MusicTrack[];
  artist?: string;
}

const backendMusic = callable<[], { ok: boolean; albums: MusicAlbum[] }>("list_music");
let cache: { at: number; list: MusicAlbum[] } | null = null;
let pending: Promise<MusicAlbum[]> | null = null;

/** Soundtrack names, track titles and covers from Steam where it knows the album. */
async function enrich(a: MusicAlbum): Promise<MusicAlbum> {
  const apps = (globalThis as any).SteamClient?.Apps;
  if (!a.appid || !apps?.GetSoundtrackDetails) return a;
  try {
    const d = await apps.GetSoundtrackDetails(a.appid);
    const st = (globalThis as any).appStore?.GetAppOverviewByAppID?.(a.appid);
    const names: { trackNumber: number; discNumber: number; trackDisplayName: string }[] = d?.tracks ?? [];
    const tracks = a.tracks.map((t, i) => {
      // match by the number at the start of the file name, else by position
      const m = /^\s*(?:(\d{1,2})[-.]\s*)?(\d{1,3})/.exec(t.file);
      const num = m ? Number(m[2]) : i + 1, disc = m?.[1] ? Number(m[1]) : 0;
      const hit = names.find((n) => n.trackNumber === num && (!disc || !n.discNumber || n.discNumber === disc)) ?? (names.length === a.tracks.length ? names[i] : undefined);
      return hit?.trackDisplayName ? { ...t, title: hit.trackDisplayName } : t;
    });
    return { ...a, name: st?.display_name || a.name, artist: d?.metadata?.artist || undefined, cover: a.cover || d?.strCoverImageAssetURL || "", tracks };
  } catch {
    return a;
  }
}

export async function loadMusic(force = false): Promise<MusicAlbum[]> {
  if (!force && cache && Date.now() - cache.at < 60000) return cache.list;
  if (pending) return pending;
  pending = (async () => {
    let list: MusicAlbum[] = [];
    try {
      list = (await backendMusic())?.albums ?? [];
      list = await Promise.all(list.map(enrich));
    } catch {
      list = cache?.list ?? [];
    }
    cache = { at: Date.now(), list };
    pending = null;
    return list;
  })();
  return pending;
}
export function useMusic(): MusicAlbum[] | null {
  const [v, setV] = useState<MusicAlbum[] | null>(cache?.list ?? null);
  useEffect(() => {
    let alive = true;
    loadMusic().then((l) => alive && setV(l));
    return () => { alive = false; };
  }, []);
  return v;
}

// ───── the player ─────
// Two audio elements ("decks") so one track can fade out while the next fades in (crossfade). Without a crossfade only
// one deck is used. `playing` is what the player intends (playing / paused by the user), not the raw element events:
// an element fires "pause" right before "ended" at the end of every track, and taking that as a pause released the
// ducked theme music and the other plugins' music between two tracks.
export type Repeat = "off" | "all" | "one";
export interface PlayerState {
  album: MusicAlbum | null;
  index: number;
  playing: boolean;
  time: number; // seconds
  duration: number;
  shuffle: boolean;
  repeat: Repeat;
  crossfade: number; // seconds, 0 = off
  fading: boolean; // two tracks overlap right now
  open: boolean; // the player screen is showing
  error: string; // "" or why playback stopped (no playable file)
}
export const CROSSFADE_MAX = 12;
/** A skip (next / previous / another track picked) fades for at most this long, so the button still feels immediate. */
export const SKIP_FADE_MAX = 1.5;
let st: PlayerState = { album: null, index: 0, playing: false, time: 0, duration: 0, shuffle: false, repeat: "off", crossfade: 0, fading: false, open: false, error: "" };
const subs = new Set<(s: PlayerState) => void>();
let ducked = false;
let order: number[] = [];
let holds = 0, resumeAfterHold = false;
let otherHold: (() => void) | null = null;
/** Tracks of the album that failed to play (missing, unsupported codec, 404): skipped from then on. */
let bad = new Set<number>();
let badAlbum = "";

interface Deck {
  el: HTMLAudioElement;
  gen: number; // bumped on every new source: events and play() results of an older source are ignored
  index: number;
  idle: boolean; // no source (stopped or faded out)
  selfPause: boolean; // the next "pause" event is our own
}
const decks: Deck[] = [];
let cur = 0; // the deck of the track that is shown (during a fade: the incoming one)
let fade: { from: Deck; to: Deck; len: number } | null = null;
let ticker: any = null;

function emit(p: Partial<PlayerState>) {
  st = { ...st, ...p };
  const duck = !!st.album && st.playing;
  if (duck !== ducked) {
    ducked = duck;
    duckMusic(duck);
    // AudioLoader / ThemeDeck menu music stays quiet while the shared player plays
    if (duck) otherHold = holdOtherMusic();
    else { otherHold?.(); otherHold = null; }
  }
  subs.forEach((f) => f(st));
}
/** Timers of Steam's own (visible) window: the plugin's SharedJSContext is a hidden page whose timers Chromium slows down. */
const win = (): any => { try { return uiWindow() ?? globalThis; } catch { return globalThis; } };
const later = (f: () => void, ms: number) => (win().setTimeout ?? setTimeout)(f, ms);

function deck(i: number): Deck {
  if (decks[i]) return decks[i];
  const W = win();
  const el = new (W.Audio ?? Audio)() as HTMLAudioElement; // in Steam's own window, like the theme music
  el.preload = "auto";
  const d: Deck = { el, gen: 0, index: 0, idle: true, selfPause: false };
  const shown = () => decks[cur] === d;
  el.addEventListener("timeupdate", () => {
    if (!shown() || d.idle) return;
    emit({ time: el.currentTime, duration: isFinite(el.duration) ? el.duration : st.duration });
    if (fade?.to === d) stepFade();
    else maybeCrossfade();
  });
  el.addEventListener("loadedmetadata", () => { if (shown() && !d.idle) emit({ duration: isFinite(el.duration) ? el.duration : 0 }); });
  el.addEventListener("play", () => { if (shown() && !d.idle && !st.playing) emit({ playing: true }); });
  el.addEventListener("pause", () => {
    if (d.selfPause) { d.selfPause = false; return; }
    // the pause right before "ended", or a deck that is fading out: not a pause of the player
    if (el.ended || !shown() || d.idle) return;
    emit({ playing: false }); // paused from outside (Steam, another plugin)
  });
  el.addEventListener("ended", () => {
    if (d.idle) return;
    if (fade?.from === d) return endFade();
    if (shown()) advance(true);
  });
  el.addEventListener("error", () => {
    if (d.idle || !el.error) return;
    failed(d);
  });
  decks[i] = d;
  return d;
}
function pauseDeck(d: Deck) {
  if (!d.el.paused) { d.selfPause = true; d.el.pause(); }
}
function clearDeck(d: Deck) {
  d.gen++;
  d.idle = true;
  pauseDeck(d);
  d.el.removeAttribute("src");
  try { d.el.load(); } catch { /* ignore */ }
}
function loadDeck(d: Deck, i: number) {
  const t = st.album?.tracks[i];
  d.gen++;
  d.index = i;
  d.idle = !t;
  if (!t) return;
  d.el.src = t.url;
  d.el.volume = 1;
}
function playDeck(d: Deck) {
  const g = d.gen;
  try {
    Promise.resolve(d.el.play()).catch((e) => {
      // a newer source (AbortError) or a file that can't be played (the "error" event handles it)
      if (d.gen !== g || d.idle || e?.name === "AbortError" || e?.name === "NotSupportedError") return;
      if (decks[cur] === d) emit({ playing: false }); // NotAllowedError: the UI refused to start sound
    });
  } catch { /* ignore */ }
}

function shuffled(n: number, first: number | null, avoidFirst: number | null = null): number[] {
  const o = Array.from({ length: n }, (_, i) => i).filter((i) => i !== first);
  for (let i = o.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [o[i], o[j]] = [o[j], o[i]]; }
  // a new round of a shuffled album does not start with the track that just ended
  if (avoidFirst !== null && o.length > 1 && o[0] === avoidFirst) { const k = 1 + Math.floor(Math.random() * (o.length - 1)); [o[0], o[k]] = [o[k], o[0]]; }
  return first === null ? o : [first, ...o];
}
function makeOrder(n: number, first: number) {
  order = st.shuffle ? shuffled(n, first) : Array.from({ length: n }, (_, i) => i);
}
/** The track after the current one, or null at the end. `auto`: the track ended by itself (repeat one plays it again). */
function peekNext(auto: boolean): { index: number; order?: number[] } | null {
  const n = st.album?.tracks.length ?? 0;
  if (!n) return null;
  if (auto && st.repeat === "one" && !bad.has(st.index)) return { index: st.index };
  const pos = order.indexOf(st.index);
  for (let k = pos + 1; k < order.length; k++) if (!bad.has(order[k])) return { index: order[k] };
  if (st.repeat === "off") return null;
  const o = st.shuffle ? shuffled(n, null, st.index) : order;
  for (const i of o) if (!bad.has(i)) return { index: i, order: o };
  return null;
}
function peekPrev(): number | null {
  const pos = order.indexOf(st.index);
  for (let k = pos - 1; k >= 0; k--) if (!bad.has(order[k])) return order[k];
  if (st.repeat === "off") return null;
  for (let k = order.length - 1; k > pos; k--) if (!bad.has(order[k])) return order[k];
  return null;
}

/** Play track i: a hard cut, or a crossfade of `len` seconds from the track playing now. */
function goTo(i: number, len: number) {
  if (fade) endFade(); // a second skip during a fade: the old track goes, the incoming one fades out instead
  const from = deck(cur);
  const playingNow = st.playing && !from.idle && !from.el.paused;
  if (len > 0 && playingNow) {
    const to = deck(1 - cur);
    loadDeck(to, i);
    to.el.volume = 0;
    fade = { from, to, len };
    cur = 1 - cur;
    emit({ index: i, time: 0, duration: 0, playing: true, fading: true, error: "" });
    playDeck(to);
    startTicker();
    return;
  }
  loadDeck(from, i);
  emit({ index: i, time: 0, duration: 0, playing: true, error: "" });
  playDeck(from);
}
/** Volumes during a fade, from the incoming track's own clock: a pause or a slow start holds the fade where it is. */
function stepFade() {
  if (!fade) return;
  const p = Math.max(0, Math.min(1, fade.to.el.currentTime / fade.len));
  fade.to.el.volume = Math.sin((p * Math.PI) / 2); // equal power: the sum stays as loud through the overlap
  fade.from.el.volume = Math.min(fade.from.el.volume, Math.cos((p * Math.PI) / 2));
  if (p >= 1) endFade();
}
function endFade() {
  if (!fade) return;
  const { from, to } = fade;
  fade = null;
  clearDeck(from);
  to.el.volume = 1;
  stopTicker();
  emit({ fading: false });
}
function startTicker() {
  if (ticker) return;
  ticker = (win().setInterval ?? setInterval)(stepFade, 50);
}
function stopTicker() {
  if (!ticker) return;
  (win().clearInterval ?? clearInterval)(ticker);
  ticker = null;
}
/** Near the end of a track with a crossfade set: start the next track under it. */
function maybeCrossfade() {
  if (!st.crossfade || fade || !st.playing) return;
  const d = deck(cur);
  const dur = d.el.duration;
  if (!isFinite(dur) || dur <= 0 || d.el.paused) return;
  const len = Math.min(st.crossfade, dur / 2);
  if (dur - d.el.currentTime > len) return;
  const n = peekNext(true);
  if (!n) return;
  if (n.order) order = n.order;
  goTo(n.index, dur - d.el.currentTime);
}
/** The track ended (auto) or could not be played: on to the next one, or the end of the list. */
function advance(auto: boolean) {
  const n = peekNext(auto);
  if (n) {
    if (n.order) order = n.order;
    return goTo(n.index, 0);
  }
  // the end of the album with repeat off: stop, ready to play it again from the start
  if (fade) endFade();
  const d = deck(cur);
  clearDeck(d);
  if (st.shuffle && st.album) makeOrder(st.album.tracks.length, Math.floor(Math.random() * st.album.tracks.length));
  const first = order.find((i) => !bad.has(i)) ?? 0;
  emit({ playing: false, index: first, time: 0, duration: 0 });
}
function failed(d: Deck) {
  const n = st.album?.tracks.length ?? 0;
  bad.add(d.index);
  if (fade?.from === d) return endFade(); // the old track broke while fading out: just let it go
  if (fade?.to === d) {
    // the incoming track can't be played: keep the old one, the next tick tries the track after
    const { from } = fade;
    fade = null;
    clearDeck(d);
    stopTicker();
    cur = decks.indexOf(from);
    from.el.volume = 1;
    emit({ index: from.index, fading: false, time: from.el.currentTime, duration: isFinite(from.el.duration) ? from.el.duration : 0 });
    return;
  }
  if (decks[cur] !== d) return;
  if (bad.size >= n) {
    clearDeck(d);
    return emit({ playing: false, time: 0, duration: 0, error: n === 1 ? "This file can't be played" : "None of the files in this album can be played" });
  }
  // a short pause so a folder of broken files doesn't flash through, then the next track
  const g = d.gen;
  later(() => { if (d.gen === g && decks[cur] === d) advance(false); }, 250);
}
function resumeAll() {
  const d = deck(cur);
  if (d.idle) return goTo(st.index, 0);
  emit({ playing: true });
  playDeck(d);
  if (fade) playDeck(fade.from);
}
function pauseAll() {
  emit({ playing: false });
  for (const d of decks) if (d && !d.idle) pauseDeck(d);
}
/** Shuffle / repeat / crossfade from the settings (they are kept there). */
function applyPrefs(p: { musicShuffle?: boolean; musicRepeat?: Repeat; musicCrossfade?: number }) {
  const shuffle = p.musicShuffle === true, repeat: Repeat = p.musicRepeat === "all" || p.musicRepeat === "one" ? p.musicRepeat : "off";
  const crossfade = Math.max(0, Math.min(CROSSFADE_MAX, Math.round(Number(p.musicCrossfade) || 0)));
  if (shuffle === st.shuffle && repeat === st.repeat && crossfade === st.crossfade) return;
  const reorder = shuffle !== st.shuffle;
  st = { ...st, shuffle, repeat, crossfade };
  if (reorder && st.album) makeOrder(st.album.tracks.length, st.index);
  emit({});
}
let prefsBound = false;
function bindPrefs() {
  if (prefsBound) return;
  prefsBound = true;
  applyPrefs(getRawSettings());
  onSettingsChange(() => applyPrefs(getRawSettings()));
}

export const musicPlayer = {
  play(album: MusicAlbum, index = 0) {
    if (album.id !== badAlbum) { bad = new Set(); badAlbum = album.id; }
    bad.delete(index); // picked by hand: try it again
    st = { ...st, album, error: "" };
    makeOrder(album.tracks.length, index);
    emit({ open: true });
    goTo(index, Math.min(st.crossfade, SKIP_FADE_MAX));
  },
  toggle() {
    if (!st.album) return;
    if (st.playing) pauseAll();
    else resumeAll();
  },
  next() {
    if (!st.album) return;
    const n = peekNext(false);
    if (!n) return;
    if (n.order) order = n.order;
    goTo(n.index, Math.min(st.crossfade, SKIP_FADE_MAX));
  },
  prev() {
    if (!st.album) return;
    // like a music player: back to the start first, the previous track when near it
    const p = st.time > 3 ? null : peekPrev();
    if (p === null) return musicPlayer.seekTo(0);
    goTo(p, Math.min(st.crossfade, SKIP_FADE_MAX));
  },
  seek(delta: number) {
    musicPlayer.seekTo(st.time + delta);
  },
  seekTo(sec: number) {
    if (!st.album) return;
    if (fade) endFade(); // seeking during a fade: the old track goes, the new one is where you seek
    const d = deck(cur);
    if (d.idle || !st.duration) return;
    d.el.currentTime = Math.max(0, Math.min(st.duration - 0.5, sec));
    emit({ time: d.el.currentTime });
  },
  stop() {
    if (fade) endFade();
    for (const d of decks) if (d) clearDeck(d);
    emit({ album: null, playing: false, time: 0, duration: 0, open: false, error: "" });
  },
  setShuffle(on: boolean) {
    applyPrefs({ musicShuffle: on, musicRepeat: st.repeat, musicCrossfade: st.crossfade });
    updateSettings({ musicShuffle: on });
  },
  setRepeat(r: Repeat) {
    applyPrefs({ musicShuffle: st.shuffle, musicRepeat: r, musicCrossfade: st.crossfade });
    updateSettings({ musicRepeat: r });
  },
  cycleRepeat() {
    musicPlayer.setRepeat(st.repeat === "off" ? "all" : st.repeat === "all" ? "one" : "off");
  },
  setCrossfade(sec: number) {
    applyPrefs({ musicShuffle: st.shuffle, musicRepeat: st.repeat, musicCrossfade: sec });
    updateSettings({ musicCrossfade: st.crossfade });
  },
  show(open: boolean) {
    emit({ open: open && !!st.album });
  },
  /** Pause for something else with sound (a video, a trailer); the returned function lets the
   *  music go on again. Holds can overlap; the music comes back once the last one ends. */
  hold(): () => void {
    if (holds++ === 0) {
      resumeAfterHold = st.playing;
      if (st.playing) pauseAll();
    }
    let done = false;
    return () => {
      if (done) return;
      done = true;
      if (--holds === 0 && resumeAfterHold && st.album) resumeAll();
    };
  },
  state: () => st,
};
bindPrefs();

// Full player pages suppress the shared floating card without changing playback.
const fullPlayerPages=new Set<symbol>();
export const fullMusicPlayerVisible=()=>fullPlayerPages.size>0;
export function useFullMusicPlayer(active:boolean){
 useEffect(()=>{
  if(!active)return;
  const token=Symbol("music page");fullPlayerPages.add(token);emit({});
  return()=>{fullPlayerPages.delete(token);emit({});};
 },[active]);
}

export function usePlayer(): PlayerState {
  const [s, setS] = useState(st);
  useEffect(() => {
    subs.add(setS);
    setS(st);
    return () => void subs.delete(setS);
  }, []);
  return s;
}

export function fmtClock(sec: number): string {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const m = Math.floor(sec / 60), s = Math.floor(sec % 60);
  return `${m}:${String(s).padStart(2, "0")}`;
}

// ───── the playback options, as menu entries (the Y menu, the XMB's options menu) ─────
export const REPEAT_NAMES: Record<Repeat, string> = { off: "Off", all: "All tracks", one: "One track" };
export const crossfadeName = (sec: number) => (sec ? `${sec} s` : "Off");
/** Shuffle, Repeat and Crossfade, like the PS3's Music Settings (Crossfade Playback: Off / seconds). */
export function musicPlaybackItems(): MenuItem[] {
  const s = () => musicPlayer.state();
  return [
    { label: "Shuffle", get checked() { return s().shuffle; }, keepOpen: true, action: () => musicPlayer.setShuffle(!s().shuffle) } as MenuItem,
    { get label() { return `Repeat: ${REPEAT_NAMES[s().repeat]}`; }, sub: () => (["off", "all", "one"] as Repeat[]).map((r) => ({ label: REPEAT_NAMES[r], get checked() { return s().repeat === r; }, action: () => musicPlayer.setRepeat(r) }) as MenuItem) } as MenuItem,
    { get label() { return `Crossfade: ${crossfadeName(s().crossfade)}`; }, sub: () => Array.from({ length: CROSSFADE_MAX + 1 }, (_, v) => ({ label: crossfadeName(v), get checked() { return s().crossfade === v; }, action: () => musicPlayer.setCrossfade(v) }) as MenuItem) } as MenuItem,
  ];
}
