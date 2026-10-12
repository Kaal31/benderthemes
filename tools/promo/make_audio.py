"""Synthesized soundtrack for the promo (no samples, no third-party music): 120 BPM, 20.0 s, 48 kHz stereo WAV.
Kick / clap / hats / sub bass / pad chords, whooshes on the montage cuts, risers and impacts on the section changes,
key clicks while the Spotlight query is typed and a thump when the theme file drops in. Cue times match render.py.
Usage: python3 tools/promo/make_audio.py out.wav"""
import sys, wave
import numpy as np
SR = 48000; DUR = 20.0; N = int(SR * DUR); BEAT = 0.5
rng = np.random.default_rng(7)
L = np.zeros(N); R = np.zeros(N)


def add(sig, t, gain=1.0, pan=0.0):
    i = int(t * SR)
    if i >= N: return
    sig = sig[: N - i] * gain
    L[i:i + len(sig)] += sig * min(1, 1 - pan); R[i:i + len(sig)] += sig * min(1, 1 + pan)


def env(n, a, d):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.exp(-t / d)


def kick():
    n = int(0.45 * SR); t = np.arange(n) / SR
    f = 45 + 110 * np.exp(-t * 28)
    ph = 2 * np.pi * np.cumsum(f) / SR
    return np.sin(ph) * env(n, 0.002, 0.16) + 0.25 * rng.standard_normal(n) * env(n, 0.0005, 0.004)


def noise_hit(dur, decay, lo, hi):
    n = int(dur * SR); x = rng.standard_normal(n)
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR); X[(fr < lo) | (fr > hi)] = 0
    return np.fft.irfft(X, n) * env(n, 0.001, decay)


def clap():
    s = noise_hit(0.3, 0.07, 900, 6000)
    for k in (0.008, 0.017):
        i = int(k * SR); s[i:] += noise_hit(0.3, 0.05, 900, 6000)[: len(s) - i] * 0.7
    return s / np.abs(s).max()


def tone(freq, dur, kind="saw", a=0.01, d=0.3, detune=0.0):
    n = int(dur * SR); t = np.arange(n) / SR; out = np.zeros(n)
    for dt in ([0] if not detune else [-detune, 0, detune]):
        ph = (freq * (1 + dt)) * t
        out += (2 * (ph % 1) - 1) if kind == "saw" else np.sin(2 * np.pi * ph)
    return out * env(n, a, d)


def lowpass(x, cutoff):
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(len(x), 1 / SR)
    X *= 1 / (1 + (fr / cutoff) ** 4)
    return np.fft.irfft(X, len(x))


def whoosh(dur=0.32, up=True):
    n = int(dur * SR); x = rng.standard_normal(n); t = np.arange(n) / n
    out = np.zeros(n); seg = 512
    for s in range(0, n, seg):  # sweeping band-pass by short FFT blocks
        c = 400 + 5000 * (t[s] if up else 1 - t[s])
        blk = x[s:s + seg]; X = np.fft.rfft(blk); fr = np.fft.rfftfreq(len(blk), 1 / SR)
        X *= np.exp(-((fr - c) / (c * 0.6)) ** 2); out[s:s + seg] = np.fft.irfft(X, len(blk))
    shape = np.sin(np.pi * t) ** 1.5
    return out * shape / (np.abs(out).max() + 1e-9)


def riser(dur):
    n = int(dur * SR); t = np.arange(n) / SR
    f = 200 * (8 ** (t / dur))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.3 + whoosh(dur, True) * 0.7
    return s * (t / dur) ** 2


def impact():
    n = int(1.6 * SR); t = np.arange(n) / SR
    boom = np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-t * 9)) / SR) * env(n, 0.002, 0.5)
    return boom + lowpass(rng.standard_normal(n), 2500) * env(n, 0.001, 0.25) * 0.5


def click():
    return noise_hit(0.04, 0.006, 2500, 9000) + tone(1800, 0.04, "sine", 0.0005, 0.008) * 0.4


def chord(root, dur):
    s = np.zeros(int(dur * SR))
    for semi in (0, 7, 12, 16, 19):
        s += tone(root * 2 ** (semi / 12), dur, "saw", 0.08, dur * 0.8, 0.004)
    return lowpass(s, 1800) * 0.12


# --- arrangement (cue times shared with render.py)
CUTS = [2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 7, 7.5, 8, 9, 9.5, 10]
SECTIONS = [2.0, 11.0, 13.0, 16.0, 19.0]
A, F, C, G = 55.0, 43.65, 65.41, 49.0
prog = [A, F, C, G]
for b in range(40):
    t = b * BEAT
    if t < 1.5 or 19.0 <= t < 20: pass
    elif 10.5 <= t < 11: pass  # breath before the Minecraft drop
    else:
        add(kick(), t, 0.9)
    if t >= 2 and b % 2 == 1 and not (10.5 <= t < 11) and t < 19:
        add(clap(), t, 0.35, 0.1)
    if t >= 2 and t < 19:
        add(noise_hit(0.08, 0.02, 7000, 16000), t + BEAT / 2, 0.22, -0.3)
        if b % 2 == 0: add(noise_hit(0.08, 0.015, 8000, 16000), t + BEAT * 0.75, 0.12, 0.3)
    # sub bass on eighths
    if t >= 2 and t < 19 and not (10.5 <= t < 11):
        root = prog[(b // 4) % 4]
        for e in range(2):
            add(lowpass(tone(root, 0.22, "saw", 0.005, 0.12), 400), t + e * 0.25, 0.32)
for bar in range(10):
    t = bar * 2.0
    if t < 19: add(chord(prog[bar % 4] * 2, 2.0), t, 1.0)
# intro shimmer arpeggio
for k, semi in enumerate([0, 7, 12, 16, 19, 24, 19, 16]):
    add(tone(220 * 2 ** (semi / 12), 0.25, "sine", 0.004, 0.12), 0.1 + k * 0.2, 0.18, (-1) ** k * 0.4)
add(riser(1.6), 0.4, 0.35)
for t in SECTIONS: add(impact(), t, 0.55)
for k, t in enumerate(CUTS): add(whoosh(0.3, k % 2 == 0), t - 0.15, 0.32, (-1) ** k * 0.5)
add(riser(0.5), 10.5, 0.5)
for t in (13.0, 16.0): add(whoosh(0.45, True), t - 0.3, 0.4)
for k in range(5): add(click(), 13.95 + k * 0.12, 0.35, 0.2)  # typing "tuner"
add(impact(), 16.62, 0.4)  # theme file lands
add(whoosh(0.4, False), 17.75, 0.35)
# end chord rings out
add(chord(A * 2, 1.2), 19.0, 1.2); add(tone(440, 1.0, "sine", 0.01, 0.4), 19.0, 0.15)

mix = np.stack([L, R], 1)
mix = np.tanh(mix * 1.1) * 0.85
fade = np.ones(N); fade[-int(0.25 * SR):] = np.linspace(1, 0, int(0.25 * SR)); mix *= fade[:, None]
mix /= max(1e-9, np.abs(mix).max()) / 0.89
with wave.open(sys.argv[1], "wb") as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
    w.writeframes((mix * 32767).astype("<i2").tobytes())
print("wrote", sys.argv[1], DUR, "s")
