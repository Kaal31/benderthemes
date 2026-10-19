/** Shared playback policy: one focused assignment, cancellable loads, balanced music handoff. */
export interface ThemeDeckTrack { url: string; filename: string; volume: number; startOffset: number; loop: boolean }
export function themeDeckTarget(p: { active: boolean; present: boolean; autoplay: boolean; running: boolean; nativeGamePage: boolean; appid?: number; appids: ReadonlySet<number> }): number | null {
  return p.active && p.present && p.autoplay && !p.running && !p.nativeGamePage && p.appid !== undefined && p.appids.has(p.appid) ? p.appid : null;
}
interface Dependencies {
  load(appid: number): Promise<ThemeDeckTrack | null>;
  audio(): HTMLAudioElement;
  hold(): () => void;
  duck(on: boolean): void;
  meter(audio: HTMLAudioElement): () => void;
}
export class ThemeDeckPlayback {
  private revision = 0;
  private appid: number | null = null;
  private element: HTMLAudioElement | null = null;
  private track: ThemeDeckTrack | null = null;
  private release: (() => void) | null = null;
  private unmeter: (() => void) | null = null;
  private master = 1;
  constructor(private deps: Dependencies) {}
  focus(appid: number | null, master = 1, refresh = false) {
    this.master = Math.max(0, Math.min(1, master));
    if (appid === this.appid && !refresh) { this.volume(); return; }
    this.stop();
    this.appid = appid;
    if (appid === null) return;
    const revision = this.revision;
    void this.deps.load(appid).then(async track => {
      if (revision !== this.revision || !track) return;
      const audio = this.deps.audio();
      this.element = audio; this.track = track;
      audio.crossOrigin = "anonymous";
      audio.src = track.url; audio.loop = track.loop;
      this.volume();
      audio.onloadedmetadata = () => {
        if (revision !== this.revision) return;
        const duration = Number.isFinite(audio.duration) ? Math.max(0, audio.duration - .01) : 30;
        audio.currentTime = Math.min(duration, Math.max(0, track.startOffset));
      };
      audio.onended = audio.onerror = () => { if (revision === this.revision) this.stopAudio(); };
      // Hold before play to prevent an overlap, including asynchronous play() resolution.
      this.release = this.deps.hold(); this.deps.duck(true);
      this.unmeter = this.deps.meter(audio);
      try {
        await audio.play();
        if (revision !== this.revision) { audio.pause(); audio.src = ""; }
      } catch { if (revision === this.revision) this.stopAudio(); }
    }).catch(() => { if (revision === this.revision) this.stopAudio(); });
  }
  private volume() {
    if (this.element && this.track) this.element.volume = this.master < 1 ? this.master : Math.max(0, Math.min(1, this.track.volume));
  }
  private stopAudio() {
    const audio = this.element; this.element = null; this.track = null;
    if (audio) { audio.onended = audio.onerror = audio.onloadedmetadata = null; audio.pause(); audio.src = ""; }
    this.unmeter?.(); this.unmeter = null;
    if (this.release) { this.deps.duck(false); this.release(); this.release = null; }
  }
  stop() { this.revision++; this.appid = null; this.stopAudio(); }
}
