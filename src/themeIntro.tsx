// Console themes have an intro. Themes with a boot sequence of their own (Wii U logo, PS1 start-up screens, a PSP/PS3
// theme file's boot intro, see bootIntro.tsx) play it when they first mount; this file adds a locally bundled
// video startup for the others. The generic Hub reveal remains the fallback for
// consoles with an existing startup when explicitly replayed.
// Skipped with reduced motion / the animations setting; any button or tap ends it; it can never block the home.
import { RecordedConsoleStartup } from "./recordedConsoleStartup";
import {themeResourcesReady} from "./themeResources";
import { CONSOLE_STARTUPS } from "./consoleStartup";
import { useEffect, useRef, useState } from "react";
import { pushModalInput } from "./input";
import { getSettings, Settings, ThemeId, THEMES } from "./settings";
import { styleOf } from "./engine/themeStyles";
import { slotUrl } from "./engine/registry";
import { playBootIntro } from "./bootIntro";
import { resetWiiuBoot } from "./themes/Nintendo";
import { playSound } from "./steam";
import { hubStyle, hubThemeKey, hubVarsCss, HUB_DECO_CSS, isConsoleTheme } from "./hubStyles";

interface Pending { theme: string; n: number }
let pending: Pending | null = null;
let counter = 0;
const listeners = new Set<() => void>();

/** Does this theme run a boot sequence of its own when its home first opens? */
export function hasOwnIntro(s: Settings, theme: string = s.theme): boolean {
  if (theme === "wiiu") return s.animations && styleOf(s, "wiiu")("boot") !== "off";
  if (theme === "ps1") return styleOf(s, "ps1")("boot") === "show";
  if (theme === "psp" || theme === "ps3") return !!s.bootIntro;
  return false;
}

/**
 * Play a theme's intro now. `fresh` = the theme's home has not been shown yet (first run): a theme with its own
 * boot sequence plays that by itself when it mounts, so only the others get the generated startup. Otherwise (a theme
 * activated from the Hub) a PSP/PS3 boot intro is replayed and other consoles get their startup or the fallback reveal.
 */
export function playThemeIntro(theme: string, opts: { fresh?: boolean; switched?: boolean } = {}) {
  try {
    if (!isConsoleTheme(theme) && !CONSOLE_STARTUPS[theme]) return;
    const s = getSettings();
    if(["old-big-picture","old-beta-big-picture"].includes(theme)&&!themeResourcesReady(theme))return;
    if (slotUrl("bootVideo", s)) return;
    if (opts.fresh && hasOwnIntro({ ...s, theme: theme as ThemeId }, theme)) return;
    if (!opts.fresh && (theme === "psp" || theme === "ps3") && s.bootIntro) { setTimeout(playBootIntro, 350); return; }
    // the Wii U mounts fresh after a switch and plays its own logo once more; re-activating the open one gets the reveal
    if (!opts.fresh && opts.switched && theme === "wiiu" && hasOwnIntro({ ...s, theme: theme as ThemeId }, theme)) { resetWiiuBoot(); return; }
    pending = { theme, n: ++counter };
    if(["old-big-picture","old-beta-big-picture"].includes(theme))autoPlayed.add(theme);
    listeners.forEach((l) => l());
  } catch { /* an intro must never break anything */ }
}

/** Mounted once in the home: handles automatic startup and explicit replay requests. */
const autoPlayed = new Set<string>();
export function ThemeIntro({autoTheme}: {autoTheme?: string} = {}) {
  const [run, setRun] = useState<Pending | null>(null);
  useEffect(() => {
    const take = () => { if (pending) { setRun(pending); pending = null; } };
    take();
    listeners.add(take);
    return () => { listeners.delete(take); };
  }, []);
  useEffect(() => {
    if (!autoTheme || !CONSOLE_STARTUPS[autoTheme] || autoPlayed.has(autoTheme)) return;
    autoPlayed.add(autoTheme);
    playThemeIntro(autoTheme, {fresh:true});
  }, [autoTheme]);
  if (!run) return null;
  return <Reveal key={run.n} theme={run.theme} onDone={() => setRun(null)} />;
}

function Reveal({ theme, onDone }: { theme: string; onDone: () => void }) {
  const s = getSettings();
  const motion = s.animations && !(typeof matchMedia === "function" && matchMedia("(prefers-reduced-motion: reduce)").matches);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    timers.current.push(setTimeout(onDone, 520));
  };
  useEffect(() => {
    if (!motion) { onDone(); return; }
    if (!CONSOLE_STARTUPS[theme]) {
      try { playSound("open"); } catch { /* no sound */ }
      timers.current.push(setTimeout(finish,2300));
    }
    timers.current.push(setTimeout(onDone,CONSOLE_STARTUPS[theme]?30000:6500));
    const off = pushModalInput(() => { finish(); return true; });
    return () => { off(); timers.current.forEach(clearTimeout); };
  }, []);
  if (!motion) return null;
  if (CONSOLE_STARTUPS[theme]) return <RecordedConsoleStartup theme={theme} leaving={leaving} finish={finish}/>;
  const st = hubStyle(theme, s.x360?.style);
  const name = THEMES.find((t) => t.id === theme)?.name ?? "";
  return (
    <div className="dht-intro dht-onboarding" data-hub-theme={hubThemeKey(theme, s.x360?.style)} onClick={finish} data-leaving={leaving}
      style={{ position: "absolute", inset: 0, zIndex: 96, background: "var(--dht-hub-bg)", color: "var(--dht-hub-text)", fontFamily: "var(--dht-hub-font)", overflow: "hidden", display: "grid", placeItems: "center", opacity: leaving ? 0 : 1, transition: "opacity 500ms ease", pointerEvents: leaving ? "none" : "auto" }}>
      <style>{hubVarsCss()}{HUB_DECO_CSS}{INTRO_CSS}</style>
      <div className="dht-hub-deco" data-deco={st.deco} aria-hidden="true" />
      <div className="dht-intro-bloom" aria-hidden="true" />
      <div className="dht-intro-ring" aria-hidden="true" />
      <div className="dht-intro-name" style={{ textTransform: st.upper ? "uppercase" : "none" }}>{name.replace(/ \((bonus)\)/i, "")}</div>
      <div className="dht-intro-line" aria-hidden="true" />
    </div>
  );
}

const INTRO_CSS = `
.dht-intro>*{position:relative;z-index:1}.dht-intro>.dht-hub-deco{position:absolute;z-index:0}
.dht-intro-bloom{position:absolute!important;left:50%;top:50%;width:90vmin;height:90vmin;margin:-45vmin 0 0 -45vmin;border-radius:50%;background:radial-gradient(circle,color-mix(in srgb,var(--dht-hub-glow) 70%,transparent) 0,color-mix(in srgb,var(--dht-hub-glow) 24%,transparent) 42%,transparent 70%);transform:scale(.05);opacity:0;animation:dht-intro-bloom 1.7s cubic-bezier(.2,.7,.2,1) .05s forwards}
.dht-intro-ring{position:absolute!important;left:50%;top:50%;width:34vmin;height:34vmin;margin:-17vmin 0 0 -17vmin;border-radius:50%;border:2px solid var(--dht-hub-glow);opacity:0;animation:dht-intro-ring 1.5s ease-out .25s forwards}
.dht-intro-name{font-size:clamp(30px,6.2vw,76px);font-weight:700;letter-spacing:.35em;opacity:0;text-shadow:0 2px 24px color-mix(in srgb,var(--dht-hub-glow) 60%,transparent);animation:dht-intro-name 1.5s cubic-bezier(.2,.7,.2,1) .45s forwards;text-align:center;padding:0 5vw}
.dht-intro-line{position:absolute!important;left:50%;top:calc(50% + 7vmin);height:3px;width:0;transform:translateX(-50%);background:var(--dht-hub-glow);border-radius:2px;box-shadow:0 0 14px var(--dht-hub-glow);animation:dht-intro-line 1.1s ease-out .9s forwards}
@keyframes dht-intro-bloom{0%{transform:scale(.05);opacity:0}35%{opacity:1}100%{transform:scale(1.7);opacity:.55}}
@keyframes dht-intro-ring{0%{transform:scale(.4);opacity:.9}100%{transform:scale(2.6);opacity:0}}
@keyframes dht-intro-name{0%{opacity:0;letter-spacing:.7em;transform:scale(1.08)}100%{opacity:1;letter-spacing:.06em;transform:scale(1)}}
@keyframes dht-intro-line{0%{width:0;opacity:1}100%{width:32vmin;opacity:.85}}
`;
