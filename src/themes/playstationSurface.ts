import type { CSSProperties } from "react";
import type { Settings } from "../settings";
import { styleOf } from "../engine/themeStyles";

export function playstationSurface(settings: Settings, theme: "ps4" | "ps5") {
  const option = styleOf(settings, theme);
  const fade = option<string>("artworkFade");
  const glass = theme === "ps5" ? option<string>("playGlass") : "off";
  const mask = fade === "soft" ? "linear-gradient(#000 52%, transparent 100%)" : fade === "radial" ? "radial-gradient(ellipse 95% 100% at 50% 0%, #000 35%, transparent 100%)" : "none";
  const artwork: CSSProperties = { position: "absolute", inset: 0, maskImage: mask, WebkitMaskImage: mask };
  const glassStyle: CSSProperties = glass === "off" ? {} : {
    background: "rgba(22,28,40,.38)", backdropFilter: `blur(${glass === "strong" ? 16 : 8}px)`, WebkitBackdropFilter: `blur(${glass === "strong" ? 16 : 8}px)`,
    borderRadius: theme === "ps5" ? 22 : 5, boxShadow: "inset 0 0 0 1px rgba(255,255,255,.18), 0 8px 24px rgba(0,0,0,.18)", padding: "10px 14px", marginLeft: -14, marginTop: -10,
  };
  return { fade, glass, artwork, glassStyle, overlayOpacity: option<number>("artworkOverlay") / 100 };
}
