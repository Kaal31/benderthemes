import { CSSProperties } from "react";
import { Settings } from "./settings";
import { storeSkin } from "./storeView";

/** Scale only theme icon/tile surfaces, leaving navigation, text and backdrops legible. */
export function presentationVariables(s: Settings): CSSProperties {
  const skin = storeSkin(s);
  const raw = s.iconSizes?.[s.theme];
  const size = typeof raw === "number" && Number.isFinite(raw) ? Math.max(75, Math.min(110, raw)) : 100;
  return { "--dht-icon-scale": size / 100 / (s.tvMode ? 0.94 : 1), "--page-panel": skin.panel, "--page-text": skin.text, "--page-accent": skin.accent, "--page-sub": skin.sub, "--page-bg": skin.bg, "--page-font": skin.font ?? '"Segoe UI", Arial, sans-serif' } as CSSProperties;
}

export const PRESENTATION_CSS = `
.dht-root :is(.dht-ps4-tile,.dht-ps5-tile,.dht-bubble-icon,.dht-xmb-game-icon,.dht-xmb-icon,.dht-x360-tile,.dht-x360n-card,.dht-ps2-save-model,.aero-cover,.alien-cover,.alien-reflection,.mc-thumbnail,.pain-card,.naz-games>button,.cinema-row>button){scale:var(--dht-icon-scale);transform-origin:center}
.dht-root .dht-ps2-device>div,.dht-root .dht-xbox-category,.dht-root .dht-xbox-game-sphere,.dht-root .dht-x360b-item>img,.dht-root .dht-x360b-item>svg{scale:var(--dht-icon-scale)}
.dht-destination button,.dht-destination input,.dht-store button,.dht-store input{font-family:var(--page-font)}
.dht-destination[data-theme=minecraft] header{padding:12px;background:#292b2e;border:0;border-bottom:4px solid #121416;box-shadow:0 2px #68696b;color:#eee}
.dht-destination[data-theme=minecraft] button,.dht-destination[data-theme=minecraft] input,.dht-store[data-dht-store-skin=minecraft] :is(button,input,.dht-store-tab,.dht-store-action){border-radius:0!important;border:2px solid #171717!important;box-shadow:inset 2px 2px #ffffff38,inset -3px -4px #1112168c,0 1px 2px #000a;text-shadow:2px 2px #14151a}
.dht-destination[data-theme=minecraft] :is(button[data-selected=true],.dht-page-tabs button[aria-current=page]),.dht-store[data-dht-store-skin=minecraft] .dht-store-tab[data-selected=true]{background:#326f18!important;color:white!important}
.dht-destination[data-theme=minecraft] footer,.dht-destination[data-theme=minecraft] .dht-page-subtitle{color:#fff!important;text-shadow:2px 2px #111}
.dht-destination[data-theme=minecraft] input{background:#333!important;color:#fff!important}
.dht-store[data-dht-store-skin=minecraft] .dht-store-title{line-height:1.5}
.dht-store[data-dht-store-skin=minecraft] .dht-store-prompt{line-height:1.5}
.dht-page-tabs{display:flex;gap:10px;flex-wrap:wrap;flex-shrink:0}
.dht-page-tabs button{cursor:pointer;padding:8px 16px;background:var(--page-panel);color:var(--page-text);border:1px solid var(--page-sub);font:inherit}
.dht-page-tabs button[aria-current=page]{outline:2px solid var(--page-sub);outline-offset:2px}
.dht-destination-row>svg{scale:var(--dht-icon-scale);flex-shrink:0}
.dht-themed-media{position:absolute;inset:0;z-index:90;color:var(--page-text);font-family:var(--page-font)}
.dht-themed-media>div{background:var(--page-bg)!important;color:var(--page-text)!important;font-family:var(--page-font)!important}
.dht-themed-media button{background:var(--page-panel)!important;color:var(--page-text)!important;border:1px solid var(--page-sub)!important;font-family:var(--page-font)!important}
.dht-root[data-dht-theme=minecraft] .dht-themed-media button{border-radius:0!important;box-shadow:inset 3px 3px #eee,inset -3px -3px #666}
`;
