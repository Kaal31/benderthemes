// The "bootVideo" slot: a theme's intro video, played once when the themed home
// first opens (and again when the theme changes). Any button skips it.
import { useEffect, useRef, useState } from "react";
import { pushModalInput } from "../input";
import { getSettings } from "../settings";

const played = new Set<string>();

export function VideoIntro({ url }: { url: string | null | undefined }) {
  const [show, setShow] = useState<string | null>(null);
  useEffect(() => {
    if (url && !played.has(url)) {
      played.add(url);
      setShow(url);
    }
  }, [url]);
  if (!show) return null;
  return <Player key={show} url={show} onDone={() => setShow(null)} />;
}

function Player({ url, onDone }: { url: string; onDone: () => void }) {
  const video = useRef<HTMLVideoElement>(null);
  const [leaving, setLeaving] = useState(false);
  const finish = () => {
    if (leaving) return;
    setLeaving(true);
    setTimeout(onDone, 500);
  };
  useEffect(() => pushModalInput(() => (finish(), true)), [leaving]);
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    v.volume = Math.max(0, Math.min(1, getSettings().sfxVolume / 100));
    v.play().catch(() => finish());
    const give = setTimeout(finish, 30000);
    return () => clearTimeout(give);
  }, []);
  return (
    <div
      onClick={finish}
      style={{ position: "absolute", inset: 0, zIndex: 200, background: "#000", opacity: leaving ? 0 : 1, transition: "opacity .5s" }}
    >
      <video ref={video} src={url} playsInline onEnded={finish} onError={finish} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
}
