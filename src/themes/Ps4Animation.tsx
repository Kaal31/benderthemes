import { useEffect, useRef } from "react";
import type { Ps4Skin } from "../skins";

export function Ps4Animation({ frames, animate }: { frames: NonNullable<Ps4Skin["animation"]>; animate: boolean }) {
  const image = useRef<HTMLImageElement>(null);
  useEffect(() => {
    const element = image.current;
    if (!element || !frames.length) return;
    element.src = frames[0].image;
    element.dataset.frame = "0";
    let stopped = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const images = frames.map((frame) => {
      const item = new Image();
      item.src = frame.image;
      return item;
    });
    let playable=frames.map((_,index)=>index),duration=0;
    const reduced=window.matchMedia?.('(prefers-reduced-motion: reduce)');
    let started = 0;
    let decoded = false;
    let pausedAt: number | undefined;
    const tick = () => {
      if (stopped || document.hidden || !decoded || !playable.length) return;
      if(!animate||reduced?.matches||playable.length===1){element.src=frames[playable[0]].image;element.dataset.frame=String(playable[0]);return;}
      const elapsed = (performance.now() - started) % duration;
      let end = 0;
      let index = 0;
      for (; index < playable.length - 1; index++) {
        end += Math.max(1,frames[playable[index]].durationMs);
        if (elapsed < end) break;
      }
      if (index === playable.length - 1) end = duration;
      element.src = frames[playable[index]].image;
      element.dataset.frame = String(playable[index]);
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
    reduced?.addEventListener?.('change',visibility);
    Promise.allSettled(images.map((item) => item.decode())).then((results) => {
      if (stopped) return;
      playable=results.flatMap((result,index)=>result.status==='fulfilled'&&images[index].naturalWidth?[index]:[]);
      element.dataset.importIssues=JSON.stringify(results.flatMap((result,index)=>result.status==='rejected'?[`Frame ${index}: image failed to decode`]:[]));
      if(!playable.length)return;
      duration=playable.reduce((sum,index)=>sum+Math.max(1,frames[index].durationMs),0);
      decoded = true;
      started = performance.now();
      pausedAt = document.hidden ? started : undefined;
      tick();
    }).catch(() => {});
    return () => {
      stopped = true;
      clearTimeout(timer);
      images.forEach(image=>{image.src='';});
      document.removeEventListener("visibilitychange", visibility);
      reduced?.removeEventListener?.('change',visibility);
    };
  }, [frames, animate]);
  return <img ref={image} className="dht-ps4-animation" alt="" src={frames[0]?.image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />;
}
