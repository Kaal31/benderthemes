import { frameLoop, useThemeActive } from "../performance";
// PS3 dynamic theme background: runs the theme's .raf scene (script + 3D models + animations)
// on a WebGL canvas. The backend builds the scene once into the theme cache (scene JSON + raw
// texture files); anything that cannot be shown faithfully falls back to the slideshow.
import { ReactNode, useEffect, useRef, useState } from "react";
import { RafRuntime, RafSceneData } from "./rafScene";
import { RafRenderer } from "./rafRender";
import type { RafLayers } from "./rafLayers";

const sceneCache = new Map<string, Promise<RafSceneData>>();
function loadScene(url: string): Promise<RafSceneData> {
  let p = sceneCache.get(url);
  if (!p) {
    p = fetch(url).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`scene ${r.status}`))));
    p.catch(() => sceneCache.delete(url));
    sceneCache.set(url, p);
    while (sceneCache.size > 2) sceneCache.delete(sceneCache.keys().next().value!);
  }
  return p;
}

/** Whether every mesh an actor draws decoded (fully, or with some triangles dropped: those are
 *  small glow and beam fans, and the scenes still look right without them). */
export function sceneDrawable(s: RafSceneData): boolean {
  let any = false;
  for (const a of s.actors as any[]) {
    const mesh = s.models[a.model]?.mesh;
    if (!mesh) continue;
    const m = (s.meshes as any)[mesh];
    if (m?.empty) continue; // a blanked-out model: draws nothing on the PS3 either
    if (!m || !(m.ok || m.partial) || !m.indexes?.length) return false;
    any = true;
  }
  return any;
}

export function RafBackground({ url, animate, fallback, fps = 30, dim = 0, layers = "all" }: { url: string; animate: boolean; fallback: ReactNode; fps?: number; dim?: number; layers?: RafLayers }) {
  const active = useThemeActive(), activeRef = useRef(active); activeRef.current = active;
  const layersRef = useRef(layers); layersRef.current = layers;
  const animateRef = useRef(animate); animateRef.current = animate;
  const redraw = useRef<(() => void) | null>(null);
  useEffect(() => { redraw.current?.(); }, [active, layers, animate]);
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ok" | "failed">("loading");
  useEffect(() => {
    setState("loading");
    let dead = false, loop: ReturnType<typeof frameLoop> | undefined, r: RafRenderer | null = null;
    const cv = ref.current;
    if (!cv) return;
    const base = url.slice(0, url.lastIndexOf("/") + 1);
    loadScene(url).then((scene) => {
      if (dead) return;
      if (!sceneDrawable(scene)) { setState("failed"); return; }
      const rt = new RafRuntime(scene);
      rt.log = () => {};
      const size = () => [Math.max(1, cv.clientWidth), Math.max(1, cv.clientHeight)] as const;
      const still = () => { if (!dead && r) { const [w, h] = size(); r.draw(rt, w, h, layersRef.current); } };
      let last = performance.now(), settled = false;
      r = new RafRenderer(cv, scene, () => loop?.invalidate(), base);
      rt.start();
      loop = frameLoop(cv, (now, moving) => {
        if (!moving && !settled) { for (let i = 0; i < 90; i++) rt.update(1 / 30); settled = true; }
        else if (moving) rt.update(Math.min(0.25, (now - last) / 1000));
        if (moving) settled = true;
        last = now; still(); setState("ok");
      }, () => animateRef.current, () => activeRef.current, fps);
      redraw.current = loop.invalidate;
    }).catch(() => { if (!dead) setState("failed"); });
    return () => {
      dead = true;
      redraw.current = null; loop?.dispose();
      r?.dispose();
    };
  }, [url, fps]);
  return (
    <>
      {state !== "ok" && fallback}
      <canvas ref={ref} className="dht-xmb-raf" data-dht-from-skin="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: state === "ok" ? 1 : 0, transition: "opacity 600ms" }} />
      {dim > 0 && <div className="dht-xmb-raf-dim" style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${dim})`, pointerEvents: "none" }} />}
    </>
  );
}
