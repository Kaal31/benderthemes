// PS3 dynamic theme background: runs the theme's .raf scene (script + 3D models + animations)
// on a WebGL canvas. The backend builds the scene once into the theme cache (scene JSON + raw
// texture files); anything that cannot be shown faithfully falls back to the slideshow.
import { ReactNode, useEffect, useRef, useState } from "react";
import { RafRuntime, RafSceneData } from "./rafScene";
import { RafRenderer } from "./rafRender";

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

export function RafBackground({ url, animate, fallback, fps = 30, dim = 0 }: { url: string; animate: boolean; fallback: ReactNode; fps?: number; dim?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"loading" | "ok" | "failed">("loading");
  useEffect(() => {
    let dead = false, raf = 0, r: RafRenderer | null = null;
    const cv = ref.current;
    if (!cv) return;
    const view: any = cv.ownerDocument?.defaultView ?? window;
    const base = url.slice(0, url.lastIndexOf("/") + 1);
    loadScene(url).then((scene) => {
      if (dead) return;
      if (!sceneDrawable(scene)) { setState("failed"); return; }
      const rt = new RafRuntime(scene);
      rt.log = () => {};
      let drawn = false;
      const size = () => [Math.max(1, cv.clientWidth), Math.max(1, cv.clientHeight)] as const;
      const still = () => { if (!dead && r) { const [w, h] = size(); r.draw(rt, w, h); drawn = true; } };
      const moving = animate && !view.matchMedia("(prefers-reduced-motion: reduce)").matches;
      r = new RafRenderer(cv, scene, () => { if (!moving) still(); }, base);
      rt.start();
      if (moving) {
        let last = performance.now();
        const frame = (now: number) => {
          raf = view.requestAnimationFrame(frame);
          if (cv.ownerDocument.hidden || now - last < 1000 / fps - 2) return;
          const dt = Math.min(0.25, (now - last) / 1000);
          last = now;
          rt.update(dt);
          const [w, h] = size();
          r!.draw(rt, w, h);
          if (!drawn) { drawn = true; setState("ok"); }
        };
        raf = view.requestAnimationFrame(frame);
      } else {
        // a still: let the intro settle, then draw once (again as textures arrive)
        for (let i = 0; i < 90; i++) rt.update(1 / 30);
        still();
        setState("ok");
      }
    }).catch(() => { if (!dead) setState("failed"); });
    return () => {
      dead = true;
      view.cancelAnimationFrame(raf);
      r?.dispose();
    };
  }, [url, animate, fps]);
  if (state === "failed") return <>{fallback}</>;
  return (
    <>
      {state === "loading" && fallback}
      <canvas ref={ref} className="dht-xmb-raf" data-dht-from-skin="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", opacity: state === "ok" ? 1 : 0, transition: "opacity 600ms" }} />
      {dim > 0 && <div className="dht-xmb-raf-dim" style={{ position: "absolute", inset: 0, background: `rgba(0,0,0,${dim})`, pointerEvents: "none" }} />}
    </>
  );
}
