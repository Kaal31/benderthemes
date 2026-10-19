// All layouts share focused-game playback and ThemeDeck's existing audio observation.
import { callable } from "@decky/api";
import { useEffect, useRef } from "react";
import { useFocusedGame } from "./focus";
import { themeDeck, themeDeckPresent, themeDeckPreferences, holdOtherMusic, onGamePage } from "./otherPlugins";
import { monitorThemeAudioElement } from "./themeAudio";
import { ThemeDeckPlayback, ThemeDeckTrack, themeDeckTarget } from "./themeDeckPlayback";
import { duckMusic, uiWindow } from "./steam";
import { usePlayer } from "./musicPlayer";

const load = callable<[appid: number], ThemeDeckTrack | null>("themedeck_track");
export function useThemeDeckIntegration(active: boolean, appids: ReadonlySet<number>, detailAppid?: number) {
  const focused = useFocusedGame();
  const localMusic = usePlayer();
  const current = useRef({ active, appids, appid: focused?.appid });
  current.current = { active: active && !localMusic.playing, appids, appid: detailAppid ?? focused?.appid };
  useEffect(() => {
    const player = new ThemeDeckPlayback({ load, audio: () => new (uiWindow().Audio ?? Audio)(), hold: holdOtherMusic, duck: duckMusic, meter: monitorThemeAudioElement });
    let observed: HTMLAudioElement | null = null, unmeter = () => {}, disposed = false;
    const update = (refresh = false) => {
      if (disposed) return;
      const value = current.current;
      const W = uiWindow();
      const running = ((W?.SteamUIStore ?? (globalThis as any).SteamUIStore)?.RunningApps?.length ?? 0) > 0;
      const td = themeDeck(), prefs = themeDeckPreferences();
      const appid = themeDeckTarget({ ...value, present: themeDeckPresent(), autoplay: prefs.autoplay, running, nativeGamePage: onGamePage() });
      player.focus(appid, prefs.master, refresh);
      if (td !== observed) { unmeter(); observed = td; unmeter = td ? monitorThemeAudioElement(td) : () => {}; }
    };
    const events = ["themedeck:tracks-updated", "themedeck:auto-play-changed", "themedeck:master-volume-changed"];
    const changed = (e: Event) => update(e.type === "themedeck:tracks-updated");
    const windows = [...new Set([globalThis as any, uiWindow()])];
    windows.forEach(w => events.forEach(e => w?.addEventListener?.(e, changed)));
    // Follow the shared debounced focus and check plugin preferences/lifecycle together.
    const timer = setInterval(() => update(), 250);
    const wake = () => update(true);
    windows.forEach(w => w?.addEventListener?.("pageshow", wake));
    update();
    return () => { disposed = true; clearInterval(timer); player.stop(); unmeter(); windows.forEach(w => { events.forEach(e => w?.removeEventListener?.(e, changed)); w?.removeEventListener?.("pageshow", wake); }); };
  }, []);
}
