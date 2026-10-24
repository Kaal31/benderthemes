import { useEffect, useRef } from "react";
import type { Ps4Skin } from "../skins";

export function Ps4Animation({ frames, animate }: { frames: NonNullable<Ps4Skin["animation"]>; animate: boolean }) {
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const element = image.current;
    if (!element || !frames.length) return;
    element.src = frames[0].image;
    element.dataset.frame = "0";
    if (!animate || frames.length < 2) return;
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const images = frames.map((frame) => {
      const item = new Image();
      item.src = frame.image;
      return item;
    });
    const duration = frames.reduce((total, frame) => total + frame.durationMs, 0);
    let started = 0;
    let decoded = false;
    let pausedAt: number | undefined;
    const tick = () => {
      if (stopped || document.hidden) return;
      const elapsed = (performance.now() - started) % duration;
      let end = 0;
      let index = 0;
      for (; index < frames.length - 1; index++) {
        end += frames[index].durationMs;
        if (elapsed < end) break;
      }
      if (index === frames.length - 1) end = duration;
      element.src = frames[index].image;
      element.dataset.frame = String(index);
      timer = setTimeout(tick, Math.max(1, end - elapsed));
    };
    const visibility = () => {
      clearTimeout(timer);
      if (!decoded) return;
      const now = performance.now();
      if (document.hidden) pausedAt ??= now;
      else {
        if (pausedAt !== undefined) started += now - pausedAt;
        pausedAt = undefined;
        tick();
      }
    };
    document.addEventListener("visibilitychange", visibility);
    Promise.all(images.map((item) => item.decode())).then(() => {
      if (stopped) return;
      decoded = true;
      started = performance.now();
      pausedAt = document.hidden ? started : undefined;
      tick();
    }).catch(() => {});
    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", visibility);
    };
  }, [frames, animate]);
  return <img ref={image} className="dht-ps4-animation" alt="" src={frames[0]?.image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />;
}
