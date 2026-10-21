import { t } from "../i18n";
import {BackgroundMedia} from "../WallpaperMedia";
import {customProfilePicture} from "../profilePicture";
// Xbox 360 New Xbox Experience (2008), rebuilt from the 9199 dashboard in
// thedev0ps/Xbox-360-Dashboard-Archive. Measurements come from its XUI scenes
// (controlp: MobyChannelScene, PanelScene, LegendScene, AuraScene) on a
// 1280×720 canvas: channel names at (96,48) with the current one lowest and the
// upcoming ones stacked above it 36px apart, a cascade of 420×320 panels that
// each cast PanelShadow onto the one behind, a description line at y 574 and
// the button legend at (96,632). Artwork is the asset set x360-nxe-dash.
import { CSSProperties } from "react";
import { GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openAchievements, openSteam } from "../library";
import { showTitle, THEMES } from "../settings";
import { Badges } from "../badges";
import { playSound, useSteamStatus, useWallpaper } from "../steam";
import { useAssets } from "../assets";
import { X360Avatar } from "./X360Avatar";
import { AvatarEditor, avatarMenu, saveAvatar, useMyAvatar } from "./X360AvatarEditor";

import { useX360Gamerpic, useX360Look, X360_SECTION } from "../skins";
import { useReportFocus } from "../focus";
type Slot = { key: string; label: string; sub?: string; game?: Game; tray?: string; icon?: string; glyph?: IconName; run: () => void };
type Channel = { id: string; label: string; slots: Slot[] };

const FONT = `var(--dht-font, "Segoe UI", "Segoe UI Semibold", "Helvetica Neue", Arial, sans-serif)`;
const TEXT_SHADOW = "0 1px 2px rgba(15,15,15,.5)";
// 1280×720 scene units
const SAFE_X = 96;
const PANEL_W = 420;
const PANEL_H = 320;
const PANEL_TOP = 230;

export function NxeHome() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const st = useSteamStatus();
  const wall = useWallpaper("x360");
  const a = useAssets("x360-nxe-dash");
  const look = useX360Look();
  const pickedPic = useX360Gamerpic(); // gamer picture package chosen in Theme options
  const icons = useAssets("x360-nxe");
  const menu = useMenu();
  const games = api.lib.games;
  // your avatar: your own exported model if you added one, otherwise the first visit opens the creator
  const { spec: mine, model, gamerpic, editing, setEditing } = useMyAvatar(s, api.user);
  const presets = () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), t("presets"), { page: true });
  const play = (g: Game): Slot => ({ key: `g${g.appid}`, label: g.name, sub: `${fmtPlaytime(g.playtime, g.lastPlayed, true)} · ${t("lastPlayedVal", { val: fmtLastPlayed(g.lastPlayed) })}`, game: g, run: () => api.activate(g, () => api.launch(g)) });

  // NXE channel names; the panels behind them open Steam's equivalents.
  const channels: Channel[] = [
    { id: "spotlight", label: t("spotlight"), slots: [
      ...games.slice(0, 1).map(play),
      { key: "store", label: t("destSteamStore"), sub: t("storeDescNew"), tray: "slot-orange", icon: icons.store, glyph: "store", run: () => openSteam("store") },
      { key: "community", label: t("destCommunity"), sub: t("communityDesc"), tray: "slot-green", icon: icons.live, glyph: "globe", run: () => openSteam("community") },
    ] },
    { id: "games", label: t("tabGames"), slots: [
      ...games.slice(0, 10).map(play),
      { key: "lib", label: t("destLibrary"), sub: t("gamesCount", { count: games.length }), tray: "slot-games", icon: a["icon-gamelib"], glyph: "library", run: () => openSteam("library") },
      { key: "ach", label: t("destAchievements"), sub: t("achievementsProgress"), tray: "slot-green", icon: icons.gamertiles, glyph: "trophy", run: () => (games[0] ? openAchievements(games[0]) : openSteam("library")) },
    ] },
    { id: "market", label: t("marketplace"), slots: [
      { key: "store2", label: t("destSteamStore"), sub: t("storeDescNew"), tray: "slot-orange", icon: icons.store, glyph: "store", run: () => openSteam("store") },
      { key: "dl", label: t("destDownloads"), sub: st.downloads ? t("downloadsActiveCount", { count: st.downloads }) : t("downloadsQueueUpdates"), tray: "slot-green", glyph: "download", run: () => openSteam("downloads") },
    ] },
    { id: "friends", label: t("destFriends"), slots: [
      { key: "friends", label: t("destFriends"), sub: st.friendsOnline !== undefined ? t("friendsOnlineCount", { count: st.friendsOnline }) : t("friendsAndChat"), tray: "slot-friends", run: () => openSteam("friends") },
      { key: "msg", label: t("destNotifications"), sub: st.notifications ? t("messagesNewCount", { count: st.notifications }) : t("destNotifications"), tray: "slot-green", icon: icons.mail ?? icons.messages, glyph: "bell", run: () => openSteam("notifications") },
    ] },
    { id: "myxbox", label: t("myXbox"), slots: [
      { key: "me", label: api.user, sub: st.online ? t("statusOnline") : t("statusOffline"), tray: "slot-profile", icon: gamerpic ?? pickedPic ?? a["avatar-silhouette"], glyph: "user", run: () => openSteam("friends") },
      ...([{ key: "avatar", label: t("myAvatar"), sub: model ? t("myAvatarDesc") : t("myAvatarDesc"), tray: "slot-profile", icon: a["avatar-silhouette"], glyph: "user" as const, run: () => setEditing("edit") }]),
      { key: "lib2", label: t("destLibrary"), sub: t("gamesCount", { count: games.length }), tray: "slot-games", icon: a["icon-gamelib"], glyph: "library", run: () => openSteam("library") },
      { key: "pics", label: t("allScreenshots"), sub: t("screenshotsDesc"), tray: "slot-photos", icon: a["icon-picturelib"], glyph: "photo", run: () => api.openMedia() },
      { key: "web", label: t("destWebBrowser"), sub: t("openBrowserDesc"), tray: "slot-videos", icon: a["icon-videolib"], glyph: "globe", run: () => openSteam("browser") },
      { key: "settings", label: t("systemSettings"), sub: t("steamSettingsDesc"), tray: "slot-tray", icon: a["icon-settings"], glyph: "gear", run: () => openSteam("settings") },
      { key: "home", label: t("homeScreenSettings"), sub: t("themeOptionsDesc"), tray: "slot-tray", glyph: "home", run: api.openSettings },
      { key: "presets", label: t("presets"), sub: t("switchPresetsDesc"), tray: "slot-tray", icon: icons.themes, glyph: "palette", run: presets },
      { key: "steamhome", label: t("destMainMenu"), sub: t("showSteamHomeDesc"), tray: "slot-tray", glyph: "steam", run: api.showSteamHome },
      { key: "power", label: t("destPower"), sub: t("powerOptionsDesc"), tray: "slot-tray", glyph: "power", run: () => openSteam("power") },
    ] },
  ];
  const [ch, setCh] = useRemembered("nxe2-ch", 1);
  const [sels, setSels] = useRemembered<Record<string, number>>("nxe2-sels", {});
  const ci = clamp(ch, 0, channels.length - 1);
  const chan = channels[ci];
  const sel = clamp(sels[chan.id] ?? 0, 0, chan.slots.length - 1);
  const cur = chan.slots[sel];
  useReportFocus(cur?.game);

  const options = () => {
    const extra: MenuItem[] = [
      { label: t("presets"), sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: t("myAvatar"), sub: () => avatarMenu(model, setEditing) },
      { label: t("homeScreenSettings"), action: api.openSettings },
      { label: t("destMainMenu"), action: api.showSteamHome },
    ];
    const g = cur?.game;
    menu.open(g ? [{ label: t("play"), action: () => api.launch(g) }, { label: t("gameDetails"), action: () => api.details(g) }, { label: t("watchTrailer"), action: () => api.playTrailer(g) }, { label: t("gameOptions"), action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
  };
  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const k = p.btn;
    if (k === "y") return options(), true;
    // the queue above the current name holds the following channels, so ↓ brings the next one down
    if (k === "up" || k === "down") {
      const n = clamp(ci + (k === "down" ? 1 : -1), 0, channels.length - 1);
      if (n !== ci) (setCh(n), playSound("tab"));
      else playSound("end");
      return true;
    }
    if (k === "left" || k === "right" || k === "l1" || k === "r1") {
      const d = k === "left" ? -1 : k === "right" ? 1 : k === "l1" ? -4 : 4;
      const n = clamp(sel + d, 0, chan.slots.length - 1);
      if (n !== sel) (setSels((m) => ({ ...m, [chan.id]: n })), playSound("move"));
      else playSound("end");
      return true;
    }
    if (k === "a" && cur) return playSound("select"), cur.run(), true;
    if (k === "x" && cur?.game) return api.launch(cur.game), true;
    if (k === "menu" && cur?.game) return api.nativeMenu(cur.game), true;
    return false;
  };

  // the 1280×720 scene, fitted into the stage and centred
  const k = Math.min(W / 1280, H / 720);
  const ox = (W - 1280 * k) / 2;
  const oy = (H - 720 * k) / 2;
  const anim = s.animations ? "260ms cubic-bezier(.2,.7,.3,1)" : "0ms";

  // panel d places after the current one recedes up and to the right, overlapped by the one in front
  const place = (d: number): CSSProperties => {
    if (d < 0) return { left: SAFE_X - PANEL_W * 0.7, top: PANEL_TOP, opacity: 0, transform: "scale(.9)", zIndex: 30 };
    const scale = Math.pow(0.8, d);
    const left = SAFE_X + [0, 330, 548, 700, 812, 900, 970][Math.min(d, 6)];
    const top = PANEL_TOP - [0, 18, 32, 42, 50, 56, 60][Math.min(d, 6)];
    return { left, top, opacity: d > 5 ? 0 : 1, transform: `scale(${scale})`, zIndex: 30 - d };
  };
  const panel = (e: Slot, i: number) => {
    const d = i - sel;
    if (d < -1 || d > 6) return null;
    const on = d === 0;
    const tray = e.tray ? a[e.tray] : undefined;
    return (
      <div key={e.key} className="dht-x360n-card dht-tile" data-selected={on} data-name={e.label} onClick={() => (on ? e.run() : setSels((m) => ({ ...m, [chan.id]: i })))}
        style={{ position: "absolute", width: PANEL_W, height: PANEL_H, transformOrigin: "0 100%", transition: `left ${anim}, top ${anim}, transform ${anim}, opacity ${anim}`, cursor: "pointer", WebkitBoxReflect: "below 2px linear-gradient(transparent 70%, rgba(255,255,255,.2))", ...place(d) } as CSSProperties}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: tray ? `#7cb51a url("${tray}") center/cover` : "linear-gradient(180deg,#a7d42a,#5f9b0e)", boxShadow: "inset 0 0 0 1px rgba(255,255,255,.35)" }}>
          {e.game ? (
            <GameArt g={e.game} kind="landscape" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : e.icon ? (
            <img src={e.icon} style={{ position: "absolute", right: 34, top: 26, height: 222, maxWidth: 240, objectFit: "contain" }} />
          ) : (
            <div style={{ position: "absolute", right: 46, top: 52, opacity: 0.92 }}><Icon name={e.glyph ?? "folder"} size={150} color="#f4ffe0" /></div>
          )}
          {(!e.game || showTitle(s, "x360", on)) && (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, padding: "34px 20px 14px", background: e.game ? "linear-gradient(180deg,transparent,rgba(15,15,15,.78))" : undefined, color: "#fff", fontSize: 26, textShadow: TEXT_SHADOW, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.label}</div>
          )}
        </div>
        {/* PanelShadow: falls on the panel behind, to the right */}
        {d >= 0 && <img src={a.panelshadow} aria-hidden="true" style={{ position: "absolute", left: PANEL_W, top: 0, width: 32, height: PANEL_H, opacity: a.panelshadow ? 0.85 : 0 }} />}
      </div>
    );
  };

  const legend = (img: string | undefined, letter: string, color: string, text: string) => (
    <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
      {img ? <img src={img} style={{ width: 32, height: 32 }} /> : <span style={{ width: 28, height: 28, borderRadius: "50%", background: `radial-gradient(circle at 35% 30%, #fff, ${color} 60%)`, color: "#000", fontSize: 15, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center" }}>{letter}</span>}
      <span>{text}</span>
    </span>
  );

  return (
    <ThemeRoot onInput={onInput} hints={{ a: t("select"), y: t("options") }}>
      <Stage background="#9fb98c">
        {wall || look.bg || a.background ? <BackgroundMedia src={wall ?? look.bgFor(X360_SECTION[chan.id] ?? "home") ?? a.background} className="dht-x360n-bg" data-dht-from-skin={!wall && look.bg ? "x360" : undefined} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} /> : <div className="dht-x360n-bg" style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg,#4f8f1d 0%,#a8c88a 35%,#e8edf0 55%,#b6b8ba 100%)" }} />}
        <div style={{ position: "absolute", left: ox, top: oy, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: "0 0", fontFamily: FONT, color: "#fff" }}>
          {/* Horizon: the light band the panels stand on */}
          {a["aura-horizon"] && <img src={a["aura-horizon"]} aria-hidden="true" style={{ position: "absolute", left: -217, top: PANEL_TOP + PANEL_H - 40, width: 1714, height: 86, opacity: 0.45, pointerEvents: "none" }} />}

          {/* channel queue: current lowest, the following channels above it, clipped to the 512×164 scene */}
          <div style={{ position: "absolute", left: SAFE_X, top: 48, width: 800, height: 164, overflow: "hidden" }}>
            {channels.map((c, i) => {
              const d = i - ci;
              if (d < -1 || d > 4) return null;
              return (
                <div key={c.id} className="dht-x360n-channel" data-selected={d === 0} onClick={() => (setCh(i), playSound("tab"))}
                  style={{ position: "absolute", left: 0, top: -34 + 154 - d * 36, height: 64, lineHeight: "64px", fontSize: 30, whiteSpace: "nowrap", textShadow: "0 1px 3px rgba(0,0,0,.27)", opacity: d === 0 ? 1 : d < 0 ? 0 : Math.max(0.25, 0.7 - (d - 1) * 0.18), transition: `top ${anim}, opacity ${anim}`, cursor: "pointer" }}>
                  {c.label}
                </div>
              );
            })}
          </div>

          <div key={chan.id} style={{ position: "absolute", inset: 0, animation: s.animations ? "dhtNxeIn 300ms ease-out" : undefined }}>
            <style>{`@keyframes dhtNxeIn { from { opacity: 0; transform: translateY(-28px) } to { opacity: 1; transform: none } }`}</style>
            {chan.slots.map(panel)}
          </div>

          {/* description line under the panels */}
          <div style={{ position: "absolute", left: SAFE_X, top: 574, width: 700, height: 26, fontSize: 18, color: "#ebebeb", textShadow: "0 1px 2px rgba(15,15,15,.8)", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", overflow: "hidden" }}>
            {cur?.game && showTitle(s, "x360", true) ? <b style={{ fontWeight: 600 }}>{cur.game.name}</b> : null}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{cur?.sub}</span>
            {cur?.game && <Badges g={cur.game} size={13} />}
          </div>

          {/* button legend */}
          <div style={{ position: "absolute", left: SAFE_X, top: 632, height: 32, display: "flex", gap: 34, alignItems: "center", fontSize: 18, color: "#ebebeb", textShadow: "0 1px 1px rgba(15,15,15,.5)" }}>
            {legend(a["legend-a"], "A", "#3fb83f", t("select"))}
            {legend(a["legend-y"], "Y", "#e9c31d", t("options"))}
          </div>

          {/* your avatar, standing on the floor in front of the far panels */}
          <div aria-hidden="true" style={{ position: "absolute", left: 930, top: 236, width: 220, height: 360, zIndex: 50, pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: 50, top: 316, width: 120, height: 22, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.35), transparent)" }} />
            {customProfilePicture()?<img src={customProfilePicture()} alt="Custom profile picture" style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<X360Avatar spec={mine} model={model} motion={s.animations} faceX={-0.6} />}
          </div>
          {/* Xbox LIVE sphere, bottom right */}
          {a.xboxlive && <img src={a.xboxlive} aria-hidden="true" style={{ position: "absolute", left: 1126, top: 604, width: 58, height: 58, opacity: st.online ? 1 : 0.55 }} />}
        </div>
        {editing && <AvatarEditor name={api.user} initial={mine} firstRun={editing === "first"} start={editing === "import" ? "import" : undefined} model={model} motion={s.animations} onDone={(spec) => (spec && saveAvatar(spec), setEditing(null))} />}
        <MenuView menu={menu} variant="x360" />
      </Stage>
    </ThemeRoot>
  );
}
