// The plugin's Quick Access panel in a browser page (preview/qam.html?theme=wiiu), for screenshots of its rows.
// Built by preview/build-qam.mjs with the visible control stand-ins of preview/stubs/qam-ui.tsx.
import { createRoot } from "react-dom/client";
import plugin from "../src/index";
import { setLibrarySource } from "../src/library";
const params = new URLSearchParams(location.search);
(window as any).__previewSettings = {
  theme: params.get("theme") || "ps4",
  ...(params.get("look") ? { activeTheme: params.get("look") } : {}),
  ...(params.get("p3t") ? { xmb: { p3t: params.get("p3t") } } : {}),
  ...(params.get("x360") ? { x360: { style: params.get("x360") } } : {}),
};
setLibrarySource({ allApps: () => [], collections: () => [] });
const p = (plugin as any)();
createRoot(document.getElementById("root")!).render(
  <div style={{ width: 340, background: "#0e141b", color: "#dcdedf", font: "14px 'Motiva Sans', Arial, sans-serif", minHeight: "100vh" }}>
    <div style={{ padding: "12px 14px", fontWeight: 700, fontSize: 16, borderBottom: "1px solid #ffffff20" }}>Deck Home Themes</div>
    {p.content}
  </div>,
);
