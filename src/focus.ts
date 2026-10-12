// The game the home currently has focused, reported by each theme, so shared
// options (game art behind the menu, the theme colour) can follow it without
// code of their own in every theme.
import { useEffect, useSyncExternalStore } from "react";
import type { Game } from "./library";

let focused: Game | undefined;
const subs = new Set<() => void>();
let timer: ReturnType<typeof setTimeout> | undefined;

/** Call from a theme with the focused game (undefined when a non-game item is focused). Settles after 300 ms. */
export function useReportFocus(g: Game | undefined) {
  useEffect(() => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (focused?.appid === g?.appid) return;
      focused = g;
      subs.forEach((f) => f());
    }, 300);
  }, [g?.appid]);
  useEffect(() => () => {
    clearTimeout(timer);
    focused = undefined;
    subs.forEach((f) => f());
  }, []);
}
export function useFocusedGame(): Game | undefined {
  return useSyncExternalStore((f) => (subs.add(f), () => subs.delete(f)), () => focused);
}
