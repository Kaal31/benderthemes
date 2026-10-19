// One shared spectrum for ThemeHub and ThemeDeck, with independent audio contexts.
const meters = new Map<AudioContext, AnalyserNode>();
export function connectThemeAudio(source: AudioNode, context: AudioContext): () => void {
  let analyser = meters.get(context);
  if (!analyser) {
    analyser = context.createAnalyser(); analyser.fftSize = 256; analyser.smoothingTimeConstant = .65;
    meters.set(context, analyser);
  }
  source.connect(analyser);
  return () => { try { source.disconnect(analyser); } catch { /* already detached */ } };
}
export function themeAudioBands(): number[] {
  const bands = Array<number>(16).fill(0);
  for (const [context, analyser] of meters) {
    if (context.state === "closed") { meters.delete(context); continue; }
    if (context.state !== "running") continue;
    const bins = new Uint8Array(analyser.frequencyBinCount); analyser.getByteFrequencyData(bins);
    for (let i = 0; i < bands.length; i++) {
      const start = Math.floor((i / 16) ** 2 * bins.length);
      const end = Math.max(start + 1, Math.floor(((i + 1) / 16) ** 2 * bins.length));
      let sum = 0; for (let j = start; j < end; j++) sum += bins[j];
      bands[i] = Math.max(bands[i], Math.round(sum / (end - start)));
    }
  }
  return bands;
}
let captureContext: AudioContext | null = null;
/** Capture is analysis-only: never reroute or reconnect another plugin's audible output. */
export function monitorThemeAudioElement(audio: HTMLAudioElement): () => void {
  let source: MediaStreamAudioSourceNode | null = null, gain: GainNode | null = null;
  let stream: MediaStream | null = null, detach: (() => void) | null = null, bound = "", retryAfter = 0;
  const reset = () => { detach?.(); detach = null; source?.disconnect(); gain?.disconnect(); source = null; gain = null; stream?.getTracks().forEach(t => t.stop()); stream = null; bound = ""; };
  const refresh = () => {
    const url = audio.currentSrc || audio.src;
    if (!url || audio.paused || audio.ended) { reset(); return; }
    if (captureContext?.state === "closed") reset();
    if (captureContext?.state === "suspended") void captureContext.resume().catch(() => {});
    if (bound && (url !== bound || !stream?.getAudioTracks().some(t => t.readyState === "live"))) reset();
    if (gain) gain.gain.value = audio.muted ? 0 : audio.volume;
    if (source || Date.now() < retryAfter) return;
    try {
      const capture = (audio as any).captureStream ?? (audio as any).mozCaptureStream;
      if (typeof capture !== "function") return;
      const W = audio.ownerDocument?.defaultView as any;
      const AC = W?.AudioContext ?? (globalThis as any).AudioContext;
      if (!AC) return;
      if (!captureContext || captureContext.state === "closed") captureContext = new AC();
      const context = captureContext!;
      if (context.state === "suspended") void context.resume().catch(() => {});
      stream = capture.call(audio);
      if (!stream?.getAudioTracks().length) { reset(); retryAfter = Date.now() + 500; return; }
      source = context.createMediaStreamSource(stream); gain = context.createGain();
      gain.gain.value = audio.muted ? 0 : audio.volume;
      source.connect(gain); detach = connectThemeAudio(gain, context); bound = url;
    } catch { reset(); retryAfter = Date.now() + 1500; }
  };
  const events = ["play", "playing", "pause", "ended", "emptied", "loadedmetadata", "volumechange"];
  events.forEach(e => audio.addEventListener(e, refresh));
  const timer = setInterval(refresh, 500); refresh();
  return () => { clearInterval(timer); events.forEach(e => audio.removeEventListener(e, refresh)); reset(); };
}
