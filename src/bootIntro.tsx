// The boot intro of a PSP theme file (its opening_plugin.rco): background planes, the intro's 3D
// wave and the logo, run by the theme's own scripts (anim_logo, the month's colours, the model).
// Plays once when the themed home first opens (and on request), over any theme; any button skips it.
import { useEffect, useRef, useState } from "react";
import { pushModalInput } from "./input";
import { loadPspSkin } from "./skins";
import { getSettings } from "./settings";
import { createPspScene, createPspWave, PSP_NATIVE_Y, modelWave, nativeModel, PspSceneData, sceneModels } from "./themes/pspScene";

let played = false;
const listeners = new Set<() => void>();
/** Show the selected intro again (from the options menu). */
export function playBootIntro() {
  listeners.forEach((l) => l());
}

export function BootIntro({ file, automatic=true }: { file: string; automatic?:boolean }) {
  const [run, setRun] = useState(() => (!played && automatic && file ? 1 : 0));
  useEffect(() => {
    const l = () => setRun((r) => r + 1);
    listeners.add(l);
    return () => { listeners.delete(l); };
  }, []);
  if (!run || !file) return null;
  return <IntroPlayer key={run} file={file} onDone={() => setRun(0)} />;
}

const BACK = ["page_bg", "page_3d"], FRONT = ["page_logo", "page_psp_logo"];

function IntroPlayer({ file, onDone }: { file: string; onDone: () => void }) {
  const box = useRef<HTMLDivElement>(null);
  const back = useRef<HTMLCanvasElement>(null), mid = useRef<HTMLCanvasElement>(null), front = useRef<HTMLCanvasElement>(null);
  const [intro, setIntro] = useState<PspSceneData | null>(null);
  const [leaving, setLeaving] = useState(false);
  const done = useRef(false);
  const sound = useRef<HTMLAudioElement | null>(null);
  const finish = () => {
    if (done.current) return;
    done.current = true;
    setLeaving(true);
    setTimeout(onDone, 650);
  };
  useEffect(() => {
    played = true;
    let alive = true;
    let got = false;
    const give = setTimeout(() => alive && !got && finish(), 6000); // the theme file did not load in time
    loadPspSkin(file)
      .then((sk) => {
        if (!alive) return;
        got = !!sk?.intro;
        if (!sk?.intro) return finish();
        setIntro(sk.intro);
        // the boot sound: from the theme, or a file put beside it (<theme>.coldboot.ogg)
        if (sk.bootSound?.coldboot) {
          const a = new Audio(sk.bootSound.coldboot);
          a.volume = Math.max(0, Math.min(1, getSettings().sfxVolume / 100));
          a.play().catch(() => {});
          sound.current = a;
        }
      })
      .catch(() => alive && finish());
    const off = pushModalInput(() => { finish(); return true; });
    return () => { alive = false; clearTimeout(give); off(); sound.current?.pause(); };
  }, []);
  useEffect(() => {
    if (!intro || !box.current || !back.current || !mid.current || !front.current) return;
    const w = box.current.clientWidth || 1280, h = box.current.clientHeight || 800;
    for (const c of [back.current, mid.current, front.current]) { c.width = w; c.height = h; }
    const sc = createPspScene(back.current, intro, { pages: BACK, front: { canvas: front.current, pages: FRONT } });
    const waves: ((t: number) => void)[] = [];
    for (const n of sceneModels(intro, BACK)) {
      const data = modelWave(intro, n);
      if (!data) continue;
      const native = nativeModel(n);
      // the firmware's intro camera is fixed (opening_plugin.prx): the motion is the model's own animation
      const wv = createPspWave(mid.current, { ...data, obj: native ? null : n }, { yOffset: native ? PSP_NATIVE_Y : 0 });
      const first = !waves.length;
      if (wv) waves.push((t) => wv.draw(t, native ? undefined : sc.objs[n.n], first));
    }
    const month = String(new Date().getMonth() + 1).padStart(2, "0");
    ["anim_logo", `anim_month_${month}`, "anim_model", "anim_camera"].forEach((a) => sc.start(a));
    let raf = 0, last = -1;
    const t0 = performance.now();
    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 32) return;
      last = now;
      const t = now - t0;
      sc.frame(t);
      waves.forEach((d) => d(t));
      // the firmware hands over to the XMB when the logo script ends
      if ((t > 1500 && !sc.busy("anim_logo")) || t > 15000) finish();
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [intro]);
  const fill = { position: "absolute", inset: 0, width: "100%", height: "100%" } as const;
  return (
    <div ref={box} className="dht-boot-intro" onClick={finish} style={{ position: "absolute", inset: 0, zIndex: 95, background: "#000", opacity: leaving ? 0 : 1, transition: "opacity 600ms ease", pointerEvents: leaving ? "none" : "auto" }}>
      <canvas ref={back} style={fill} />
      <canvas ref={mid} style={fill} />
      <canvas ref={front} style={fill} />
    </div>
  );
}
