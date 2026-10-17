// Interactive preview of real ThemeHub components with sample repository data.
import { createRoot } from "react-dom/client";
import { useState } from "react";
import { Marketplace } from "../src/Marketplace";
import { openMarketplace, useMarketplace } from "../src/marketplaceState";
import { getSettings, seedSettings, useSettings } from "../src/settings";
import { checkCommunityUpdates } from "../src/communityUpdates";

const w = window as any;
function reset() {
  w.__communityOffline = false;
  w.__themeCatalog = { themes: [] };
  w.__communitySources = [{ repo: "sample-creator/neon-drive", mode: "catalog", featured: true, checkedAt: Date.now() / 1000,
    themes: [
      { id: "neon", name: "Neon Drive · sample", author: "Sample creator", description: "Native layout update preview. Sample data; no creator repository is contacted.", version: "1.6.1", installedVersion: "1.6.1", availableVersion: "1.7.0", size: 3800000, compatible: true, uiOverhaul: true, updateAvailable: false, canRollback: false },
      { id: "glass", name: "Blue Glass · sample", author: "Sample creator", description: "Asset-only update preview. The theme version stays the same when its music pack changes.", version: "1.0.0", installedVersion: "1.0.0", size: 1700000, compatible: true, updateAvailable: false, canRollback: false, availableAssets: true }
    ] }];
}
reset();
(window as any).__getThemeSettings = getSettings;
seedSettings({ theme: "ps4", enabled: true, onboardingDone: true });
openMarketplace(undefined, { tab: "community" });
function App() {
  const settings = useSettings();
  const market = useMarketplace();
  const [offline, setOffline] = useState(false);
  return <div style={{ fontFamily: "system-ui", color: "#eee", background: "#0d1119", minHeight: "100vh" }}>
    <header style={{ padding: 12, display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
      <strong>ThemeHub · Community updates preview</strong><small>Sample data</small>
      <button onClick={() => openMarketplace(undefined, { tab: "community" })}>Community</button>
      <button aria-pressed={offline} onClick={() => { w.__communityOffline = !offline; setOffline(!offline); }}>GitHub: {offline ? "Offline" : "Online"}</button>
      <button onClick={() => { reset(); setOffline(false); void checkCommunityUpdates(true); }}>Reset sample</button>
    </header>
    <div style={{ position: "relative", height: "min(800px, 88vh)", minHeight: 520 }}>{market.opened ? <Marketplace initialTab="community"/> : <div style={{padding:28}}><h2>Theme activated</h2><p>Active theme: {settings.activeTheme || settings.theme}</p><button onClick={() => openMarketplace(undefined, { tab: "community" })}>Open Community</button></div>}</div>
  </div>;
}
createRoot(document.getElementById("root")!).render(<App/>);
