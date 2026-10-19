import { useEffect, useState } from "react";
import { themeAudioBands } from "./themeAudio";
/** Native themes share the same bounded spectrum as frame themes. */
export function useThemeAudio(active = true): number[] {
  const [bands, setBands] = useState(() => Array<number>(16).fill(0));
  useEffect(() => {
    if (!active) { setBands(Array<number>(16).fill(0)); return; }
    const timer = setInterval(() => setBands(themeAudioBands()), 50);
    return () => clearInterval(timer);
  }, [active]);
  return bands;
}
