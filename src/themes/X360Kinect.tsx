import { t } from "../i18n";
import {BackgroundMedia} from "../WallpaperMedia";
import {customProfilePicture} from "../profilePicture";
// Xbox 360 Kinect dashboard (2010), rebuilt from the Kinect-era dashboard in
// thedev0ps/Xbox-360-Dashboard-Archive. Layout follows its XUI scenes on a
// 1280×720 canvas: ChannelListScene at (144,154) with the channel names about
// 35px apart and the current one scaled 1.2, a flat row of glass slots (420×320
// postcards and 234×320 box art) with SlotSideShadow, the green aura behind,
// and the button legend. Artwork is the asset set
// x360-kinect-dash.
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

import { useX360Look, X360_SECTION } from "../skins";
import { useReportFocus } from "../focus";
type Slot = { key: string; label: string; sub?: string; game?: Game; art?: string; glyph?: IconName; run: () => void };
type Channel = { id: string; label: string; slots: Slot[] };

const FONT = `var(--dht-font, "Segoe UI", "Helvetica Neue", Arial, sans-serif)`;
const INK = "#ebebeb";
const TEXT_SHADOW = "0 1px 2px rgba(15,15,15,.5)";
// 1280×720 scene units
const LIST_X = 144;
const LIST_Y = 154;
const ROW_Y = 226;
const SLOT_H = 320;
const POSTCARD_W = 420;
const PORTRAIT_W = 234;
const ART_H = 200;
const GAP = 18;

export function KinectHome() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const st = useSteamStatus();
  const wall = useWallpaper("x360");
  const a = useAssets("x360-kinect-dash");
  const look = useX360Look();
  const menu = useMenu();
  const games = api.lib.games;
  // your avatar: your own exported model if you added one, otherwise the first visit opens the creator
  const { spec: mine, model, editing, setEditing } = useMyAvatar(s, api.user);
  const presets = () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), t("presets"), { page: true });
  const play = (g: Game): Slot => ({ key: `g${g.appid}`, label: g.name, sub: `${fmtPlaytime(g.playtime, g.lastPlayed, true)} · ${t("lastPlayedVal", { val: fmtLastPlayed(g.lastPlayed) })}`, game: g, run: () => api.activate(g, () => api.launch(g)) });

  // Kinect-era channel names; the slots open Steam's equivalents.
  const channels: Channel[] = [
    { id: "home", label: t("homeTab"), slots: [
      ...games.slice(0, 1).map(play),
      { key: "kinect", label: t("destSteamStore"), sub: t("storeDescNew"), art: "slot-xboxlive", glyph: "store", run: () => openSteam("store") },
      { key: "basics", label: t("destDownloads"), sub: st.downloads ? t("downloadingCount", { count: st.downloads }) : t("queueAndUpdates"), art: "slot-xboxbasicsslot", glyph: "download", run: () => openSteam("downloads") },
    ] },
    { id: "games", label: t("tabGames"), slots: [
      ...games.slice(0, 10).map(play),
      { key: "lib", label: t("destLibrary"), sub: t("gamesCount", { count: games.length }), art: "slot-games", glyph: "library", run: () => openSteam("library") },
      { key: "ach", label: t("destAchievements"), sub: t("achievementsProgress"), art: "slot-kinect", glyph: "trophy", run: () => (games[0] ? openAchievements(games[0]) : openSteam("library")) },
    ] },
    { id: "video", label: t("catVideo"), slots: [
      { key: "shots", label: t("allScreenshots"), sub: t("screenshotsDesc"), glyph: "photo", run: () => api.openMedia() },
      { key: "web", label: t("destWebBrowser"), sub: t("openBrowserDesc"), glyph: "globe", run: () => openSteam("browser") },
    ] },
    { id: "social", label: t("social"), slots: [
      { key: "friends", label: t("destFriends"), sub: st.friendsOnline !== undefined ? t("friendsOnlineCount", { count: st.friendsOnline }) : t("friendsAndChat"), art: "slot-friends", glyph: "friends", run: () => openSteam("friends") },
      { key: "msg", label: t("destNotifications"), sub: st.notifications ? t("messagesNewCount", { count: st.notifications }) : t("destNotifications"), glyph: "bell", run: () => openSteam("notifications") },
      { key: "community", label: t("destCommunity"), sub: t("communityDesc"), art: "slot-family", glyph: "globe", run: () => openSteam("community") },
    ] },
    { id: "settings", label: t("destSettings"), slots: [
      ...([{ key: "avatar", label: t("myAvatar"), sub: model ? t("myAvatarDesc") : t("myAvatarDesc"), art: "slot-avatars", glyph: "user" as const, run: () => setEditing("edit") }]),
      { key: "settings", label: t("systemSettings"), sub: t("steamSettingsDesc"), glyph: "gear", run: () => openSteam("settings") },
      { key: "home", label: t("homeScreenSettings"), sub: t("themeOptionsDesc"), glyph: "home", run: api.openSettings },
      { key: "presets", label: t("presets"), sub: t("switchPresetsDesc"), glyph: "palette", run: presets },
      { key: "steamhome", label: t("destMainMenu"), sub: t("showSteamHomeDesc"), glyph: "steam", run: api.showSteamHome },
      { key: "power", label: t("destPower"), sub: t("powerOptionsDesc"), glyph: "power", run: () => openSteam("power") },
    ] },
  ];
  const [ch, setCh] = useRemembered("kinect-ch", 1);
  const [sels, setSels] = useRemembered<Record<string, number>>("kinect-sels", {});
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
    // the names above the current one are the following channels, so ↓ brings the next one down
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

  // flat row: games are box art, everything else a postcard; the row slides so the selected slot sits at the left
  const widths = chan.slots.map((e) => (e.game ? PORTRAIT_W : POSTCARD_W));
  const xs = widths.reduce<number[]>((acc, _w, i) => (acc.push(i ? acc[i - 1] + widths[i - 1] + GAP : 0), acc), []);
  const shift = Math.max(0, xs[sel] - (sel > 0 ? 120 : 0));

  const slot = (e: Slot, i: number) => {
    const on = i === sel;
    const w = widths[i];
    const left = LIST_X + xs[i] - shift;
    if (left > 1400 || left + w < -200) return null;
    const art = e.art ? a[e.art] : undefined;
    const glass = e.game ? a["portrait-placeholder-glass"] : a["postcard-placeholder-glass"];
    return (
      <div key={e.key} className="dht-x360n-card dht-tile" data-selected={on} data-name={e.label} onClick={() => (on ? e.run() : setSels((m) => ({ ...m, [chan.id]: i })))}
        style={{ position: "absolute", left, top: ROW_Y, width: w, height: SLOT_H, transition: `left ${anim}, transform ${anim}, opacity ${anim}`, transform: on ? "scale(1.04)" : "none", transformOrigin: "50% 60%", zIndex: on ? 10 : 1, opacity: i < sel ? 0.55 : 1, cursor: "pointer", WebkitBoxReflect: "below 2px linear-gradient(transparent 78%, rgba(255,255,255,.18))" } as CSSProperties}>
        {/* SlotSideShadow on the right edge */}
        {a.slotsideshadow && <img src={a.slotsideshadow} aria-hidden="true" style={{ position: "absolute", left: w - 74, top: 0, width: 148, height: SLOT_H, opacity: 0.6, pointerEvents: "none" }} />}
        <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: glass ? `#f4f6f2 url("${glass}") center/100% 100%` : "linear-gradient(180deg,#ffffff,#e4e8e0)", boxShadow: on ? "0 0 0 3px #fff, 0 0 18px 4px rgba(190,255,90,.75)" : "0 2px 6px rgba(0,0,0,.25)" }}>
          {e.game ? (
            <GameArt g={e.game} kind="portrait" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <>
              <div style={{ position: "absolute", left: 0, top: 0, width: w, height: ART_H, overflow: "hidden", background: "linear-gradient(180deg,#bcd3e4,#e9f0f4)" }}>
                {art ? <img src={art} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon name={e.glyph ?? "folder"} size={110} color="#5a8f17" /></div>}
                {a["slot-gradient"] && <img src={a["slot-gradient"]} aria-hidden="true" style={{ position: "absolute", left: -2, bottom: -2, width: w + 4, height: 154, opacity: 0.35 }} />}
              </div>
              <div style={{ position: "absolute", left: 18, right: 18, top: ART_H + 16, color: "#3a3a3a", fontSize: 24, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.label}</div>
              {e.sub && <div style={{ position: "absolute", left: 18, right: 18, top: ART_H + 52, color: "#777", fontSize: 16, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{e.sub}</div>}
            </>
          )}
        </div>
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
      <Stage background="#7fb21a">
        {wall || look.bg || a.background ? <BackgroundMedia src={wall ?? look.bgFor(X360_SECTION[chan.id] ?? "home") ?? a.background} className="dht-x360n-bg" data-dht-from-skin={!wall && look.bg ? "x360" : undefined} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} /> : <div className="dht-x360n-bg" style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, #d4ef2a 0%, #8cc21c 45%, #3f7d10 100%)" }} />}
        <div style={{ position: "absolute", left: ox, top: oy, width: 1280, height: 720, transform: `scale(${k})`, transformOrigin: "0 0", fontFamily: FONT, color: INK }}>
          {/* channel list: current name lowest and 1.2× larger, the following ones above it about 35px apart */}
          <div style={{ position: "absolute", left: LIST_X, top: 0, width: 800, height: ROW_Y, overflow: "hidden" }}>
            {channels.map((c, i) => {
              const d = i - ci;
              if (d < -1 || d > 5) return null;
              const on = d === 0;
              return (
                <div key={c.id} className="dht-x360n-channel" data-selected={on} onClick={() => (setCh(i), playSound("tab"))}
                  style={{ position: "absolute", left: 0, top: on ? LIST_Y + 14 : LIST_Y - 26 - (d - 1) * 35, fontSize: on ? 36 : 26, lineHeight: "44px", whiteSpace: "nowrap", textShadow: TEXT_SHADOW, opacity: on ? 1 : d < 0 ? 0 : Math.max(0.3, 0.75 - (d - 1) * 0.12), transition: `top ${anim}, opacity ${anim}, font-size ${anim}`, cursor: "pointer" }}>
                  {c.label}
                </div>
              );
            })}
          </div>

          <div key={chan.id} style={{ position: "absolute", inset: 0, animation: s.animations ? "dhtKinectIn 300ms ease-out" : undefined }}>
            <style>{`@keyframes dhtKinectIn { from { opacity: 0; transform: translateY(-28px) } to { opacity: 1; transform: none } }`}</style>
            {chan.slots.map(slot)}
          </div>

          {/* game line under the row */}
          {cur?.game && (
            <div style={{ position: "absolute", left: LIST_X, top: 584, width: 900, height: 26, fontSize: 18, textShadow: "0 1px 2px rgba(15,15,15,.8)", display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", overflow: "hidden" }}>
              {showTitle(s, "x360", true) && <b style={{ fontWeight: 600 }}>{cur.game.name}</b>}
              <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{cur.sub}</span>
              <Badges g={cur.game} size={13} />
            </div>
          )}

          {/* your avatar, standing on the floor in front of the far panels */}
          <div aria-hidden="true" style={{ position: "absolute", left: 1075, top: 236, width: 220, height: 360, zIndex: 50, pointerEvents: "none" }}>
            <div style={{ position: "absolute", left: 50, top: 316, width: 120, height: 22, borderRadius: "50%", background: "radial-gradient(closest-side, rgba(0,0,0,.35), transparent)" }} />
            {customProfilePicture()?<img src={customProfilePicture()} alt="Custom profile picture" style={{width:"100%",height:"100%",objectFit:"contain"}}/>:<X360Avatar spec={mine} model={model} motion={s.animations} faceX={-0.6} />}
          </div>
          {/* button legend */}
          <div style={{ position: "absolute", left: LIST_X, top: 632, height: 32, display: "flex", gap: 34, alignItems: "center", fontSize: 18, textShadow: TEXT_SHADOW }}>
            {legend(a["legend-a"], "A", "#3fb83f", t("select"))}
            {legend(a["legend-y"], "Y", "#e9c31d", t("options"))}
          </div>
        </div>
        {editing && <AvatarEditor name={api.user} initial={mine} firstRun={editing === "first"} start={editing === "import" ? "import" : undefined} model={model} motion={s.animations} onDone={(spec) => (spec && saveAvatar(spec), setEditing(null))} />}
        <MenuView menu={menu} variant="x360" />
      </Stage>
    </ThemeRoot>
  );
}
