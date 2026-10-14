import { achievementStyle, panelStyle } from "./achievementPopupStyles";
import { callable, toaster } from "@decky/api";
import { Icon } from "./common";
import { getSettings, onSettingsChange, ThemeId } from "./settings";
import { loadedPluginNames } from "./pluginPresence";
import { loadLibrary } from "./library";
import { parseUnlocks, Unlock, UnlockTracker } from "./achievementUnlocks";

const installationStatus = callable<[], { verified: boolean; finallyInstalled: boolean }>("achievement_popup_status");
const finallyLoaded = () => loadedPluginNames().some(n => /finally.*achievement/i.test(n));
let installed: boolean | null = null;
let emitPreview: ((achievement: Unlock) => void) | undefined;
let lastStatus = "Checking installed plugins…";
export const achievementPopupStatus = () => lastStatus;
export const achievementPopupsBlocked = () => installed !== false || finallyLoaded();
export function popupLook(theme: ThemeId): string { return theme; }
export function AchievementPopup({ unlock, theme, game }: { unlock: Unlock; theme: ThemeId; game?: string }) {
  const settings = getSettings();
  const profile = achievementStyle(theme, settings.activeTheme, settings.x360?.style);
  const icon = unlock.icon && (/^https?:\/\//.test(unlock.icon) ? unlock.icon : undefined);
  const desktop = profile.layout === "desktop";
  const compact = profile.layout === "compact";
  const trophy = ["ps3", "psp", "vita", "ps4", "ps5"].includes(theme);
  const glyphInk = ["#ffffff", "#d9dce5", "#c9dcf1", "#dfdfe2", "#e8f4ff"].includes(profile.accent) ? "#25303c" : "#fff";
  return <div className="dht-achievement-popup" data-look={theme} data-profile={profile.name} role="status" style={{ position: "relative", overflow: "hidden", width: 390, maxWidth: "90vw", minHeight: compact ? 76 : 94, boxSizing: "border-box", ...panelStyle(profile) }}>
    {profile.pattern && <div aria-hidden="true" style={{ position: "absolute", inset: 0, background: profile.pattern, pointerEvents: "none" }} />}
    {desktop && <div aria-hidden="true" style={{ position: "relative", height: 23, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 10px", background: "linear-gradient(#ffffff40,#ffffff08)", borderBottom: "1px solid #0002", fontSize: 11, fontWeight: 600 }}><span>{profile.name}</span><span style={{ opacity: 0.6 }}>● ●</span></div>}
    {profile.layout === "terminal" && <div aria-hidden="true" style={{ position: "relative", color: profile.accent, fontSize: 10, letterSpacing: 2, padding: "9px 18px 0" }}>{profile.name.toUpperCase()} / ACHIEVEMENTS</div>}
    <div style={{ position: "relative", display: "flex", alignItems: "center", gap: compact ? 12 : 16, padding: compact ? "13px 18px" : "17px 20px" }}>
      <div style={{ position: "relative", width: compact ? 42 : 50, height: compact ? 42 : 50, flexShrink: 0, borderRadius: profile.badgeRadius, background: `linear-gradient(145deg,${profile.accent},${profile.accent}99)`, border: "1px solid #ffffff40", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", boxShadow: ["vita","xbox","dial","pain"].includes(theme) ? `0 0 12px ${profile.accent}45, inset 0 2px 3px #ffffff70` : "inset 0 1px #ffffff35" }}>
        <Icon name="trophy" size={compact ? 26 : 30} color={glyphInk} />
        {icon && <img src={icon} alt="" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "contain" }} onError={e => { e.currentTarget.style.display = "none"; }} />}
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: 11, opacity: 0.8, marginBottom: 5, letterSpacing: profile.layout === "terminal" ? 1 : 0 }}>{profile.caption ?? (trophy ? "Trophy earned!" : "Achievement unlocked")}</div>
        <div style={{ fontSize: compact ? 17 : 18, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", textShadow: theme === "minecraft" ? "2px 2px #000" : undefined }}>{unlock.name}</div>
        {game && <div style={{ fontSize: 11, opacity: 0.7, marginTop: 5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{game}</div>}
      </div>
      {["onyx","silver","dial","pain"].includes(theme) && <div aria-hidden="true" style={{ width: 14, height: 14, border: `2px solid ${profile.accent}90`, borderRadius: "50%", boxShadow: `0 0 0 3px ${profile.accent}20` }} />}
    </div>
  </div>;
}
export function previewAchievementPopup() {
  emitPreview?.({ id: "themehub-preview", name: "A new adventure", description: "Preview only", achieved: true });
}

/** Steam's own notification surface provides the overlay; no dependency on Finally. */
export function startAchievementPopups(): () => void {
  const tracker = new UnlockTracker();
  const queue: { unlock: Unlock; game?: string }[] = [];
  const displayed = new Set<{ dismiss: () => void }>();
  let stopped = false, busy = false, lastCheck = 0, nextToast = 0, generation = 0;
  let runningKey = "";
  const bounded = async <T,>(promise: Promise<T>): Promise<T> => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    try { return await Promise.race([promise, new Promise<T>((_, reject) => { timer = setTimeout(() => reject(new Error("Achievement request timed out")), 8000); })]); }
    finally { clearTimeout(timer); }
  };
  const enabled = () => getSettings().achievementPopups !== false;
  const suppress = () => { generation++; tracker.clear(); queue.length = 0; displayed.forEach(t => t.dismiss()); displayed.clear(); };
  const deliver = (unlock: Unlock, game?: string) => {
    if (stopped || !enabled() || achievementPopupsBlocked()) return;
    const theme = getSettings().theme;
    const toast = toaster.toast({ title: "", body: <AchievementPopup unlock={unlock} theme={theme} game={game} />, className: "dht-achievement-toast", duration: 5500, playSound: false });
    displayed.add(toast);
    setTimeout(() => displayed.delete(toast), 6000);
  };
  emitPreview = unlock => deliver(unlock, "ThemeHub preview");
  const tick = async () => {
    if (stopped || busy) return;
    busy = true;
    try {
      if (!lastCheck || Date.now() - lastCheck > 15000) {
        const status = await bounded(installationStatus());
        if (stopped) return;
        installed = status?.verified ? !!status.finallyInstalled : null;
        lastCheck = Date.now();
      }
      if (!enabled() || achievementPopupsBlocked()) {
        lastStatus = !enabled() ? "Disabled" : installed === null ? "Installed-plugin check unavailable" : "Disabled while Finally is installed";
        suppress(); return;
      }
      lastStatus = "Active · follows the selected theme";
      const ui: any = (globalThis as any).SteamUIStore;
      const running = ui?.RunningApps;
      const apps: any[] = Array.isArray(running) ? running : running instanceof Map ? [...running.values()] : [];
      const key = apps.map(app => String(app?.unAppID ?? app?.appid ?? app?.nAppID ?? app)).sort().join(",");
      if (key !== runningKey) { tracker.clear(); queue.length = 0; runningKey = key; generation++; }
      const token = generation;
      const client = (globalThis as any).SteamClient;
      if (apps.length && typeof client?.Apps?.GetMyAchievementsForApp === "function") {
        const library = loadLibrary("all", "recent", 9999);
        for (const app of apps.slice(0, 4)) {
          const appid = Number(app?.unAppID ?? app?.appid ?? app?.nAppID ?? app);
          const game = library.byId.get(appid);
          if (!game || game.shortcut) continue;
          const result = await bounded(Promise.resolve(client.Apps.GetMyAchievementsForApp(game.gameid)));
          if (stopped || token !== generation || !enabled() || finallyLoaded()) return;
          for (const unlock of tracker.observe(appid, parseUnlocks(result))) {
            if (unlock.icon && /^[0-9a-f]{40}$/i.test(unlock.icon)) unlock.icon = `https://cdn.cloudflare.steamstatic.com/steamcommunity/public/images/apps/${appid}/${unlock.icon}.jpg`;
            if (queue.length < 20) queue.push({ unlock, game: game.name });
          }
        }
      }
      if (queue.length && Date.now() >= nextToast) { const item = queue.shift()!; deliver(item.unlock, item.game); nextToast = Date.now() + 6000; }
    } catch { installed = null; lastStatus = "Achievement integration unavailable"; suppress(); }
    finally { busy = false; }
  };
  const unsubscribe = onSettingsChange(() => { if (!enabled()) suppress(); void tick(); });
  const timer = setInterval(() => { if (finallyLoaded()) suppress(); void tick(); }, 2000);
  void tick();
  return () => { stopped = true; clearInterval(timer); unsubscribe(); suppress(); emitPreview = undefined; installed = null; };
}
