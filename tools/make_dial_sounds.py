"""Synthesises the original sound pack for the "Alien Dial" bonus theme.

Everything here is generated from sine waves and noise, so the pack can ship
with the plugin. Output: sounds/DHT Alien Dial/ (AudioLoader pack format).
Run: python3 tools/make_dial_sounds.py
"""
import json, os, wave
import numpy as np

SR = 44100
OUT = os.path.join(os.path.dirname(__file__), "..", "sounds", "DHT Alien Dial")
rng = np.random.default_rng(10)


def t(sec):
    return np.arange(int(SR * sec)) / SR


def env(n, a=0.002, d=0.1):
    x = np.arange(n) / SR
    return np.minimum(1, x / max(a, 1e-4)) * np.exp(-x / d)


def sweep(f0, f1, sec, curve=2.0):
    x = t(sec)
    f = f0 + (f1 - f0) * (x / sec) ** curve
    return np.sin(2 * np.pi * np.cumsum(f) / SR)


def lowpass(x, cut):
    a = np.exp(-2 * np.pi * cut / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i, v in enumerate(x):
        acc = (1 - a) * v + a * acc
        y[i] = acc
    return y


def save(name, x, stereo_width=0.0, gain=0.8):
    x = x / (np.max(np.abs(x)) + 1e-9) * gain
    l = x
    r = np.roll(x, int(SR * 0.0007 * stereo_width)) if stereo_width else x
    data = (np.stack([l, r], 1) * 32767).astype("<i2")
    with wave.open(os.path.join(OUT, name), "wb") as w:
        w.setnchannels(2)
        w.setsampwidth(2)
        w.setframerate(SR)
        w.writeframes(data.tobytes())


def click(pitch):
    """Ratchet click of a turning dial: noise tick + metallic ping + low thunk."""
    n = int(SR * 0.12)
    tick = rng.standard_normal(n) * env(n, 0.0003, 0.004)
    x = t(0.12)
    ping = (np.sin(2 * np.pi * pitch * x) + 0.5 * np.sin(2 * np.pi * pitch * 2.76 * x)) * env(n, 0.0005, 0.03)
    thunk = np.sin(2 * np.pi * 140 * x) * env(n, 0.001, 0.025)
    return tick * 0.6 + ping * 0.5 + thunk * 0.7


def powerup():
    """Rising charge, then a bright snap: the 'activate' sound."""
    a = sweep(180, 1900, 0.42, 1.7) * np.linspace(0.2, 1, int(SR * 0.42))
    a *= 0.6 + 0.4 * np.sin(2 * np.pi * 34 * t(0.42))
    whoosh = lowpass(rng.standard_normal(len(a)), 2500) * np.linspace(0, 1, len(a)) ** 2
    charge = a * 0.7 + whoosh * 0.6
    n = int(SR * 0.6)
    x = t(0.6)
    snap = rng.standard_normal(n) * env(n, 0.0005, 0.012)
    ring = sum(np.sin(2 * np.pi * f * x) * g for f, g in ((1320, 1), (1980, 0.6), (2640, 0.35))) * env(n, 0.001, 0.18)
    sub = np.sin(2 * np.pi * 70 * x) * env(n, 0.002, 0.12)
    return np.concatenate([charge, snap * 0.8 + ring * 0.7 + sub * 0.9])


def blip(f1, f2, sec=0.06):
    x = t(sec)
    n = len(x)
    a = np.sign(np.sin(2 * np.pi * f1 * x)) * 0.35 + np.sin(2 * np.pi * f1 * x)
    b = np.sign(np.sin(2 * np.pi * f2 * x)) * 0.35 + np.sin(2 * np.pi * f2 * x)
    return np.concatenate([a * env(n, 0.001, 0.03), b * env(n, 0.001, 0.04)])


def drone(sec=32.0):
    """Seamless sci-fi hum: detuned pads with slow filter movement and sparse pings."""
    x = t(sec)
    base = 55.0
    y = np.zeros_like(x)
    for k, (m, g) in enumerate(((1, 1), (1.5, 0.5), (2, 0.45), (3, 0.2))):
        for det in (-0.25, 0.25):
            f = base * m + det / sec * 4  # whole cycles over the loop
            y += g * np.sin(2 * np.pi * f * x + k)
    lfo = 0.6 + 0.4 * np.sin(2 * np.pi * x / sec * 2)
    y = y * lfo
    air = lowpass(rng.standard_normal(len(x)), 900) * 0.15 * (0.5 + 0.5 * np.sin(2 * np.pi * x / sec * 3))
    y += air
    for start in np.arange(1.5, sec - 1, 4.0):
        n = int(SR * 0.9)
        p = np.sin(2 * np.pi * 1760 * t(0.9)) * env(n, 0.002, 0.25) * 0.12
        i = int(start * SR)
        y[i : i + n] += p[: len(y) - i]
    fade = int(SR * 0.05)
    y[:fade] *= np.linspace(0, 1, fade)
    y[-fade:] *= np.linspace(1, 0, fade)
    return y


os.makedirs(OUT, exist_ok=True)
save("dial_click_1.wav", click(2300))
save("dial_click_2.wav", click(2450))
save("dial_click_3.wav", click(2180))
save("activate.wav", powerup(), 3)
save("select.wav", blip(1200, 1650))
save("back.wav", sweep(900, 320, 0.2, 0.7) * env(int(SR * 0.2), 0.002, 0.08))
save("open.wav", lowpass(rng.standard_normal(int(SR * 0.35)), 3000) * np.linspace(0, 1, int(SR * 0.35)) * env(int(SR * 0.35), 0.25, 0.3) + 0.3 * sweep(300, 900, 0.35))
save("close.wav", lowpass(rng.standard_normal(int(SR * 0.3)), 2000) * np.linspace(1, 0, int(SR * 0.3)) + 0.3 * sweep(900, 300, 0.3))
save("tab.wav", blip(880, 990, 0.04))
save("bump.wav", np.sin(2 * np.pi * 110 * t(0.15)) * env(int(SR * 0.15), 0.001, 0.05))
save("menu_music.wav", drone(), 2, gain=0.5)
clicks = ["dial_click_1.wav", "dial_click_2.wav", "dial_click_3.wav"]
pack = {
    "name": "DHT Alien Dial",
    "version": "v1.0",
    "author": "Deck Home Themes (synthesised, original)",
    "description": "Dial clicks, a power-up activation and a sci-fi hum for the Alien Dial theme.",
    "manifest_version": 2,
    "music": True,
    "ignore": [],
    "mappings": {
        "deck_ui_navigation.wav": clicks,
        "deck_ui_tile_scroll.wav": clicks,
        "deck_ui_default_activation.wav": ["select.wav"],
        "deck_ui_launch_game.wav": ["activate.wav"],
        "deck_ui_into_game_detail.wav": ["open.wav"],
        "deck_ui_out_of_game_detail.wav": ["back.wav"],
        "deck_ui_show_modal.wav": ["open.wav"],
        "deck_ui_hide_modal.wav": ["close.wav"],
        "deck_ui_tab_transition_01.wav": ["tab.wav"],
        "deck_ui_bumper_end_02.wav": ["bump.wav"],
        "deck_ui_switch_toggle_on.wav": ["select.wav"],
    },
}
with open(os.path.join(OUT, "pack.json"), "w") as f:
    json.dump(pack, f, indent=2)
# AudioLoader looks for menu_music.mp3
import shutil, subprocess
if shutil.which("ffmpeg"):
    wav = os.path.join(OUT, "menu_music.wav")
    subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", wav, "-c:a", "libmp3lame", "-b:a", "96k", os.path.join(OUT, "menu_music.mp3")], check=True)
    os.remove(wav)
print("wrote", OUT)
