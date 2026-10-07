import { openDestination } from "../destinations";
// XrossMediaBar for the PS3 and PSP themes: a horizontal category bar
// crossing a vertical item list, over a month-coloured gradient and wave.
import { CSSProperties, ReactNode, useEffect, useMemo, useState } from "react";
import { AnimCanvas } from "../canvas";
import { darken, hex, lighten, mix, MONTH_NAMES, PS3_MONTHS, PSP_MONTHS, rgb, RGB } from "../color";
import { BatteryGlyph, GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openSteam } from "../library";
import { showTitle, THEMES, updateSettings } from "../settings";
import { fmtTime, playSound, useBattery, useClock, useWallpaper } from "../steam";
import { P3tSkin, useP3t } from "../skins";
import { Badges } from "../badges";
import { useCssVar } from "../cssvars";
import { fmtDuration, fmtSize, LocalVideo, LocalVideoView, TrailerVideo, useScreenshots, useVideos } from "../media";
import { applyPreset, currentPresetId, presetGroups } from "../presets";
import { PS3_ICONS } from "./xmbOriginalIcons";

type Variant = "ps3" | "psp";

function StockXmbIcon({name,size,variant,skinFallback=false}:{name:string;size:number;variant:Variant;skinFallback?:boolean}) {
  const style:CSSProperties={width:size,height:size,display:"block",objectFit:"contain",filter:skinFallback||!["psn","store"].includes(name)?"brightness(0) invert(1) drop-shadow(0 2px 1px #0003)":variant==="psp"?"grayscale(1) drop-shadow(0 2px 1px #0007)":undefined};
  if(variant==="psp" && name==="music") return <svg viewBox="0 0 64 64" style={style} aria-hidden="true"><defs><linearGradient id="pspNote" x2="0" y2="1"><stop stopColor="#fff"/><stop offset="1" stopColor="#bfc0c1"/></linearGradient></defs><path d="M28 5 L52 10 V45 C52 57 32 62 32 51 C32 45 40 41 47 42 V17 L33 13 V48 C33 60 12 65 12 54 C12 47 21 43 28 45 Z" fill="url(#pspNote)" stroke="#efefef" strokeWidth="1"/></svg>;
  if(variant==="psp" && (name==="globe"||name==="network")) return <svg viewBox="0 0 64 64" style={style} aria-hidden="true"><g fill="#eee">{Array.from({length:12},(_,i)=><circle key={i} cx={32+26*Math.cos(i*Math.PI/6)} cy={32+26*Math.sin(i*Math.PI/6)} r="1.7"/>)}</g><text x="32" y="38" textAnchor="middle" fontFamily="Arial" fontSize="16" fontWeight="bold" fill="#eee">WWW</text></svg>;
  const src=PS3_ICONS[name];
  return src?<img className="dht-xmb-icon" data-icon-source="esseti" src={src} style={style}/>:<Icon name={name as IconName} size={size} color="#fff"/>;
}

// A removed screenshot or malformed imported icon must not expose a broken-image glyph.
function XmbImage({src,style,fallback,source}:{src:string;style:CSSProperties;fallback:ReactNode;source?:string}){
  const [failed,setFailed]=useState<string>();
  return failed===src?<>{fallback}</>:<img src={src} alt="" data-icon-source={source} style={style} onError={()=>setFailed(src)}/>;
}

interface XItem {
  key: string;
  label: string;
  sub?: string;
  icon?: IconName;
  p3t?: string; // icon id inside a .p3t theme
  game?: Game;
  image?: string; // picture icon (screenshots)
  trailer?: boolean; // Video category: plays the game's trailer
  video?: LocalVideo; // Video category: a video stored on the Deck
  children?: () => XItem[];
  action?: () => void;
}
interface XCat {
  key: string;
  label: string;
  icon: IconName;
  p3t: string;
  items: XItem[];
  start?: number;
}

const LAYOUT = {
  ps3: {
    catY: 0.27,
    catX: 300,
    catGap: 150,
    catIcon: 62,
    catIconSel: 74,
    gap: 84,
    selGapBelow: 120,
    iconSel: [196, 108],
    icon: [124, 68],
    glyphSel: 64,
    glyph: 46,
    font: 25,
    fontSel: 27,
    subFont: 17,
  },
  psp: {
    catY: 0.22,
    catX: 250,
    catGap: 128,
    catIcon: 52,
    catIconSel: 62,
    gap: 72,
    selGapBelow: 104,
    iconSel: [168, 92],
    icon: [104, 57],
    glyphSel: 56,
    glyph: 40,
    font: 22,
    fontSel: 25,
    subFont: 16,
  },
};

// ───────────── background ─────────────
function nightFactor(d: Date) {
  // Darker late at night, brightest mid-day (the PS3 dims through the day).
  const h = d.getHours() + d.getMinutes() / 60;
  const day = (Math.cos(((h - 13) / 24) * Math.PI * 2) + 1) / 2; // 1 at 13:00, 0 at 01:00
  return 0.18 + 0.82 * day;
}

function XmbBackground({ variant, color, animate, now, skin }: { variant: Variant; color: RGB; animate: boolean; now: Date; skin: P3tSkin | null }) {
  const { W, H } = useStage();
  const userWall = useWallpaper(variant);
  const wall = userWall ?? skin?.backgrounds[0] ?? null;
  const light = variant === "ps3" ? nightFactor(now) : 1;
  const top = darken(color, variant === "ps3" ? 0.75 - 0.35 * light : 0.62);
  const mid = darken(color, variant === "ps3" ? 0.5 - 0.35 * light : 0.25);
  const bot = variant === "ps3" ? darken(color, 0.62 - 0.4 * light) : lighten(color, 0.35);
  const bg =
    variant === "ps3"
      ? `radial-gradient(ellipse at 30% 35%, ${rgb(lighten(mid, 0.12))} 0%, transparent 60%), linear-gradient(180deg, ${rgb(top)} 0%, ${rgb(mid)} 55%, ${rgb(bot)} 100%)`
      : `radial-gradient(ellipse at 48% 30%, rgba(255,255,255,0.14), transparent 62%), linear-gradient(180deg, ${rgb(top)} 0%, ${rgb(top)} 22%, ${rgb(mix(top, bot, 0.5))} 68%, ${rgb(bot)} 100%)`;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <div className="dht-xmb-bg" style={{ position: "absolute", inset: 0, background: `var(--dht-xmb-bg, ${bg})` }} />
      {wall ? (
        <>
          <img src={wall} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} />
        </>
      ) : (
        <AnimCanvas className="dht-xmb-wave" width={W} height={H} animate={animate} fps={30} draw={variant === "ps3" ? drawPs3Wave : drawPspWave} />
      )}
    </div>
  );
}

/** PS3: a silky ribbon of many thin translucent strands drifting across the screen. */
function drawPs3Wave(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const strands = 22;
  const base = h * 0.56;
  ctx.globalCompositeOperation = "lighter";
  // soft glow band behind the strands
  const g = ctx.createLinearGradient(0, base - h * 0.16, 0, base + h * 0.2);
  g.addColorStop(0, "rgba(255,255,255,0)");
  g.addColorStop(0.5, "rgba(255,255,255,0.05)");
  g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, base - h * 0.16, w, h * 0.36);
  for (let k = 0; k < strands; k++) {
    const p = k / strands;
    ctx.beginPath();
    for (let x = 0; x <= w; x += 16) {
      const u = x / w;
      const y =
        base +
        Math.sin(u * 5.2 + t * 0.35 + p * 1.6) * h * 0.06 +
        Math.sin(u * 2.3 - t * 0.22 + p * 3.1) * h * (0.04 + p * 0.03) +
        Math.sin(u * 9.0 + t * 0.6 + p * 0.7) * h * 0.008 +
        (p - 0.5) * h * 0.07;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.strokeStyle = `rgba(255,255,255,${0.035 + 0.05 * Math.sin(p * Math.PI)})`;
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }
  ctx.globalCompositeOperation = "source-over";
}

/** PSP: two broad, soft folds of light low on the screen, each with a faint crest. */
function drawPspWave(ctx: CanvasRenderingContext2D, t: number, w: number, h: number) {
  const fold = (base: number, amp: number, freq: number, speed: number, phase: number, sheet: number, edge: number) => {
    const pts: [number, number][] = [];
    for (let x = 0; x <= w + 20; x += 20) {
      const u = x / w;
      pts.push([x, (base + amp * Math.sin(u * Math.PI * 2 * freq + t * speed + phase) + amp * 0.35 * Math.sin(u * Math.PI * 2 * freq * 2.1 - t * speed * 0.6)) * h]);
    }
    const grad = ctx.createLinearGradient(0, base * h - amp * h, 0, h);
    grad.addColorStop(0, `rgba(255,255,255,${sheet})`);
    grad.addColorStop(0.35, `rgba(255,255,255,${sheet * 0.7})`);
    grad.addColorStop(1, `rgba(255,255,255,${sheet * 0.25})`);
    ctx.beginPath();
    ctx.moveTo(0, h);
    pts.forEach(([x, y]) => ctx.lineTo(x, y));
    ctx.lineTo(w, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
    ctx.beginPath();
    pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
    ctx.strokeStyle = `rgba(255,255,255,${edge * 0.45})`;
    ctx.lineWidth = h * 0.02;
    ctx.stroke();
    ctx.strokeStyle = `rgba(255,255,255,${edge})`;
    ctx.lineWidth = Math.max(1.5, h * 0.004);
    ctx.stroke();
  };
  fold(0.62, 0.045, 0.8, -0.38, 1.7, 0.09, 0.12);
  fold(0.75, 0.06, 0.42, 0.3, 3.1, 0.1, 0.14);
}

// ───────────── status ─────────────
function XmbStatus({ variant, now, h24 }: { variant: Variant; now: Date; h24: boolean }) {
  const bat = useBattery();
  const date = `${now.getMonth() + 1}/${now.getDate()}`;
  if (variant === "psp") {
    return (
      <div className="dht-xmb-clock dht-statusbar" style={{ position: "absolute", top: 18, right: 34, display: "flex", alignItems: "center", gap: 16, color: "#fff", fontSize: 20, textShadow: "0 1px 3px rgba(0,0,0,0.5)" }}>
        <span>
          {date} {fmtTime(now, h24)}
        </span>
        {bat && <BatteryGlyph level={bat.level} charging={bat.charging} w={34} />}
      </div>
    );
  }
  return (
    <div className="dht-xmb-clock dht-statusbar" style={{ position: "absolute", top: 34, right: 0, display: "flex", alignItems: "center" }}>
      <div
        style={{
          padding: "6px 60px 6px 22px",
          color: "#fff",
          fontSize: 22,
          background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,255,255,0.14) 20%, rgba(255,255,255,0.14))",
          borderTop: "1px solid rgba(255,255,255,0.35)",
          borderBottom: "1px solid rgba(255,255,255,0.2)",
          display: "flex",
          gap: 16,
          alignItems: "center",
        }}
      >
        {bat && <BatteryGlyph level={bat.level} charging={bat.charging} w={30} />}
        <span>
          {date} {fmtTime(now, h24)}
        </span>
      </div>
    </div>
  );
}

// ───────────── main ─────────────
export function XmbHome({ variant }: { variant: Variant }) {
  const api = useHome();
  const s = api.settings;
  const L = LAYOUT[variant];
  const { W, H } = useStage();
  const now = useClock(15000);
  const menu = useMenu();
  const p3tSkin = useP3t();
  const shots = useScreenshots();
  // Icons when no .p3t skin supplies one: a PS3 icon set if the build has one
  // (xmb-ps3), else the RetroArch "monochrome" set (CC BY 4.0), else drawn.
  const vids = useVideos();
  const skin = variant === "ps3" ? p3tSkin : null;
  const skinIcon=(key:string)=>{
    const aliases:Record<string,string[]>={icon_psn:["icon_psnetwork","icon_accountmanage"],icon_store:["icon_psstore","icon_network"],icon_photo_album_default:["icon_photo"]};
    return skin?.icons[key] ?? aliases[key]?.map(k=>skin?.icons[k]).find(Boolean);
  };

  const colorIdx = variant === "ps3" ? s.xmb.ps3Color : s.xmb.pspColor;
  const month = colorIdx >= 0 ? colorIdx : now.getMonth();
  const cssColor = useCssVar("--dht-xmb-color");
  const color = hex(cssColor || (variant === "ps3" ? PS3_MONTHS : PSP_MONTHS)[month]);

  const gameItem = (g: Game): XItem => ({ key: `g${g.appid}`, label: g.name, sub: fmtPlaytime(g.playtime), game: g });
  const folderItems = (games: Game[]) => () => games.map(gameItem);

  const cats: XCat[] = useMemo(() => {
    const themeItems = (): XItem[] => presetGroups().map(group=>({key:group.name,label:group.name,icon:"folder",children:()=>group.presets.map(p=>({key:p.id,label:p.label,icon:"palette",sub:p.id===currentPresetId()?"Current preset":undefined,action:()=>applyPreset(p)}))}));
    const colorItems = (): XItem[] => [
      { key: "c-auto", label: "Automatic (by month)", icon: "palette", sub: colorIdx < 0 ? "Selected" : undefined, action: () => setColor(-1) },
      ...MONTH_NAMES.map((m, i) => ({ key: `c-${i}`, label: m, icon: "palette" as IconName, sub: colorIdx === i ? "Selected" : undefined, action: () => setColor(i) })),
    ];
    const setColor = (i: number) => updateSettings((p) => ({ xmb: { ...p.xmb, [variant === "ps3" ? "ps3Color" : "pspColor"]: i } }));
    const games: XItem[] = [];
    games.push({ key: "lib", p3t: "icon_gamedata", label: "Library", icon: "library", sub: "All games and collections", action: () => openSteam("library") });
    if (s.xmb.collectionFolders) {
      for (const c of api.lib.collections) games.push({ key: `col-${c.id}`, label: c.name, icon: "folder", p3t: "icon_savedata", sub: `${c.games.length} items`, children: folderItems(c.games) });
    }
    const firstGame = games.length;
    api.lib.games.forEach((g) => games.push(gameItem(g)));
    const settingsCat: XCat = {
      key: "settings",
      label: "Settings",
      icon: "gear",
      p3t: "icon_setting",
      items: [
        { key: "theme", p3t: "icon_theme_setting", label: "Theme Settings", icon: "palette", sub: "Switch preset (console + skin)", children: themeItems },
        { key: "color", p3t: "icon_display_setting", label: "Background Colour", icon: "palette", sub: colorIdx < 0 ? "Automatic" : MONTH_NAMES[colorIdx], children: colorItems },
        { key: "clock", p3t: "icon_datetime_setting", label: "Date and Time Settings", icon: "clock", sub: s.clock24 ? "24-hour clock" : "12-hour clock", action: () => updateSettings({ clock24: !s.clock24 }) },
        { key: "sfx", p3t: "icon_sound_setting", label: "Sound Settings", icon: "sound", sub: s.sounds ? "Sound effects on" : "Sound effects off", action: () => updateSettings({ sounds: !s.sounds }) },
        { key: "tsound", p3t: "icon_sound_setting", label: "Trailer Sound", icon: "video", sub: s.trailers.sound ? "On: trailers in game icons play with sound" : "Off: trailers in game icons are silent", action: () => updateSettings((p) => ({ trailers: { ...p.trailers, sound: !p.trailers.sound } })) },
        { key: "tprev", p3t: "icon_video", label: "Animated Icons", icon: "video", sub: s.trailers.preview ? "On: resting on a game plays its trailer" : "Off", action: () => updateSettings((p) => ({ trailers: { ...p.trailers, preview: !p.trailers.preview } })) },
        { key: "home", p3t: "icon_setting_item", label: "Home Screen Settings", icon: "gear", sub: "Open in Quick Access", action: api.openSettings },
        { key: "steam", p3t: "icon_system_setting", label: "System Settings", icon: "steam", sub: "Steam settings", action: () => openSteam("settings") },
      ],
    };
    const network: XCat = {
      key: "network",
      label: "Network",
      icon: "globe",
      p3t: "icon_network",
      items: [

        { key: "web", p3t: "icon_browser", label: "Internet Browser", icon: "globe", action: () => openSteam("browser") },
        { key: "dl", p3t: "icon_download", label: "Downloads", icon: "download", action: () => openSteam("downloads") },
      ],
    };
    // Photo: Steam screenshots, one folder per game (like the console's photo albums)
    const photoItems: XItem[] = [{ key: "shots", p3t: "icon_photo_album_default", label: "All Screenshots", icon: "photo", sub: shots ? `${shots.length} pictures` : "Loading…", action: () => api.openMedia() }];
    if (shots) {
      const byApp = new Map<number, typeof shots>();
      shots.forEach((sh) => byApp.set(sh.appid, [...(byApp.get(sh.appid) ?? []), sh]));
      for (const [appid, list] of byApp) {
        const name = api.lib.byId.get(appid)?.name ?? (appid ? `App ${appid}` : "Steam");
        photoItems.push({
          key: `ph${appid}`,
          label: name,
          sub: `${list.length} screenshot${list.length === 1 ? "" : "s"}`,
          icon: "photo",
          p3t: "icon_photo_album_default",
          children: () => list.map((sh, i) => ({ key: sh.url, label: sh.created ? new Date(sh.created * 1000).toLocaleString() : `Screenshot ${i + 1}`, sub: name, image: sh.url, icon: "photo" as IconName, action: () => api.openMedia(appid, i) })),
        });
      }
    }
    const photo: XCat = { key: "photo", label: "Photo", icon: "photo", p3t: "icon_photo", items: photoItems };
    // Video: videos stored on the Deck (Steam recordings, files); store trailers optional
    const videoItems: XItem[] = [];
    if (s.trailers.video)
      videoItems.push({
        key: "trailers",
        label: "Game Trailers",
        icon: "folder",
        p3t: "icon_video",
        sub: "Store trailers for your games",
        children: () => api.lib.games.filter((g) => !g.shortcut).map((g) => ({ key: `v${g.appid}`, label: g.name, sub: "Trailer", game: g, trailer: true })),
      });
    if (vids === null) videoItems.push({ key: "vload", label: "Looking for videos…", icon: "video", p3t: "icon_video" });
    else {
      for (const v of vids) {
        const g = v.appid ? api.lib.byId.get(v.appid) : undefined;
        const kind = v.kind === "clip" ? "Clip" : v.kind === "recording" ? "Recording" : v.folder;
        const date = v.created ? new Date(v.created * 1000).toLocaleDateString() : "";
        videoItems.push({
          key: `lv${v.id}`,
          label: v.kind === "file" ? v.name : g?.name ?? (v.appid ? `App ${v.appid}` : "Steam"),
          sub: [kind, date, fmtDuration(v.duration) || fmtSize(v.size)].filter(Boolean).join(" · "),
          icon: "video",
          p3t: "icon_video",
          image: v.thumb || g?.art.landscape[0],
          video: v,
          action: () => api.playVideo(v),
        });
      }
      if (!vids.length) videoItems.push({ key: "vnone", label: "No videos", icon: "video", p3t: "icon_video", sub: "Steam game recordings and videos in Videos, Downloads or on an SD card show up here" });
    }
    const video: XCat = { key: "video", label: "Video", icon: "video", p3t: "icon_video", items: videoItems };
    if (api.lib.apps.length)
      network.items.push({ key: "apps", p3t: "icon_setting_item", label: "Applications", icon: "apps", sub: `${api.lib.apps.length} apps`, children: () => api.lib.apps.map((g) => ({ key: `a${g.appid}`, label: g.name, game: g, sub: "Application" })) });
    const music: XCat = {key:"music",label:"Music",icon:"music",p3t:"icon_music",items:[{key:"player",label:"Music Player",icon:"music",p3t:"icon_music",sub:"Steam soundtracks",action:()=>openDestination({place:"music"})}]};
    const psn: XCat = {key:"psn",label:"PlayStation Network",icon:"psn",p3t:"icon_psn",items:[{key:"store",label:"PlayStation Store",sub:"Steam Store catalog",icon:"store",p3t:"icon_store",action:()=>openSteam("store")},{key:"account",label:"Account",icon:"user",p3t:"icon_user",action:()=>openSteam("friends")}]};
    const tv: XCat = {key:"tv",label:"TV / Video Services",icon:"tv",p3t:"icon_tv",items:[{key:"trailers",label:"Game Trailers",icon:"video",p3t:"icon_video",children:()=>api.lib.games.filter(g=>!g.shortcut).map(g=>({key:`tr${g.appid}`,label:g.name,game:g,trailer:true}))},...api.lib.apps.map(g=>({key:`app${g.appid}`,label:g.name,game:g,icon:"apps" as IconName}))]};
    const game: XCat = { key: "game", label: "Game", icon: "game", p3t: "icon_game", items: games, start: Math.min(firstGame, games.length - 1) };
    if (variant === "psp") {
      return [settingsCat, photo, music, video, game, network, psn];
    }
    const users: XCat = {
      key: "users",
      label: "Users",
      icon: "user",
      p3t: "icon_user",
      items: [
        { key: "me", p3t: "icon_user", label: api.user, icon: "user", sub: "Signed in", action: () => openSteam("friends") },
        { key: "off", p3t: "icon_setting_item", label: "Turn Off System", icon: "power", action: () => openSteam("power") },
        { key: "steamhome", p3t: "icon_user", label: "Home", icon: "home", sub: "Show Steam's own home", action: api.showSteamHome },
      ],
      start: 0,
    };
    const friends: XCat = { key: "friends", label: "Friends", icon: "friends", p3t: "icon_friend", items: [{ key: "chat", p3t: "icon_chat", label: "Friends & Chat", icon: "friends", action: () => openSteam("friends") }] };
    return [users, settingsCat, photo, music, video, tv, game, network, psn, friends];
  }, [api.lib, s.theme, s.clock24, s.sounds, colorIdx, s.xmb.collectionFolders, api.user, shots, vids, s.trailers.video, s.trailers.sound, s.trailers.preview]);

  const gameCat = cats.findIndex((c) => c.key === "game");
  const [catIdx, setCatIdx] = useRemembered(`${variant}-cat`, gameCat);
  const [sels, setSels] = useRemembered<Record<string, number>>(`${variant}-sels`, {});
  const [stack, setStack] = useState<{ label: string; items: XItem[]; sel: number }[]>([]);

  const cat = cats[clamp(catIdx, 0, cats.length - 1)];
  const inFolder = stack.length > 0;
  const items = inFolder ? stack[stack.length - 1].items : cat.items;
  const selRaw = inFolder ? stack[stack.length - 1].sel : sels[cat.key] ?? cat.start ?? 0;
  const sel = clamp(selRaw, 0, Math.max(0, items.length - 1));
  const cur = items[sel];

  // Rest on a game for a moment → its trailer plays inside the icon and its art becomes the backdrop.
  const [previewKey, setPreviewKey] = useState("");
  const [backdrop, setBackdrop] = useState<Game | null>(null);
  useEffect(() => {
    setPreviewKey("");
    setBackdrop(null);
    if (!s.trailers.preview || !cur || api.busy) return;
    const g = cur.game ?? (cur.video?.appid ? api.lib.byId.get(cur.video.appid) : undefined);
    if (!cur.game && !cur.video) return;
    const backdropDelay = variant === "psp" ? 2500 : 900;
    const trailerDelay = variant === "psp" ? 3200 : 1600;
    const t1 = g ? setTimeout(() => setBackdrop(g), backdropDelay) : 0;
    const t2 = setTimeout(() => (cur.video || (cur.game && !cur.game.shortcut)) && setPreviewKey(cur.key), trailerDelay);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [variant, cur?.key, s.trailers.preview, api.busy]);

  const setSel = (i: number) => {
    if (inFolder) setStack((st) => [...st.slice(0, -1), { ...st[st.length - 1], sel: i }]);
    else setSels((m) => ({ ...m, [cat.key]: i }));
  };

  const activate = (it: XItem | undefined) => {
    if (!it) return;
    if (it.children) {
      const kids = it.children();
      setStack((st) => [...st, { label: it.label, items: kids, sel: 0 }]);
      playSound("select");
    } else if (it.game && it.trailer) {
      api.playTrailer(it.game);
    } else if (it.game) {
      api.activate(it.game, () => api.launch(it.game!));
    } else if (it.action) {
      playSound("select");
      it.action();
    }
  };

  const options = () => {
    const extra: MenuItem[] = [
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    if (cur?.game) {
      const g = cur.game;
      menu.open([{ label: "Start", action: () => api.launch(g) }, { label: "Watch Trailer", action: () => api.playTrailer(g) }, { label: "Information", action: () => api.details(g) }, { label: "Game Options", action: () => api.nativeMenu(g) }, ...extra], g.name);
    } else menu.open(extra);
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const n = items.length;
    switch (p.btn) {
      case "up":
      case "down": {
        const d = p.btn === "up" ? -1 : 1;
        const next = clamp(sel + d, 0, n - 1);
        if (next !== sel) {
          setSel(next);
          playSound("move");
        }
        return true;
      }
      case "l1":
      case "r1": {
        const next = clamp(sel + (p.btn === "l1" ? -8 : 8), 0, n - 1);
        if (next !== sel) {
          setSel(next);
          playSound("move");
        }
        return true;
      }
      case "left":
      case "right": {
        if (inFolder) {
          if (p.btn === "left") {
            setStack((st) => st.slice(0, -1));
            playSound("back");
          }
          return true;
        }
        const next = clamp(catIdx + (p.btn === "left" ? -1 : 1), 0, cats.length - 1);
        if (next !== catIdx) {
          setCatIdx(next);
          playSound("tab");
        }
        return true;
      }
      case "a":
        activate(cur);
        return true;
      case "b":
        if (inFolder) {
          setStack((st) => st.slice(0, -1));
          playSound("back");
          return true;
        }
        return false;
      case "y":
        options();
        return true;
      case "menu":
        if (cur?.game) api.nativeMenu(cur.game);
        return true;
    }
    return false;
  };

  // ───── geometry ─────
  const catY = H * L.catY;
  const itemX = L.catX; // column centre
  const above = (i: number) => catY - L.catIconSel * 0.5 - 40 - (sel - 1 - i) * L.gap - L.icon[1] / 2; // centre of items above the bar
  const below = (i: number) => catY + L.selGapBelow + (i === sel ? 0 : L.iconSel[1] / 2 - L.icon[1] / 2 + 18 + (i - sel) * L.gap);
  const yOf = (i: number) => (i < sel ? above(i) : below(i));
  const lo = Math.max(0, sel - 6);
  const hi = Math.min(items.length - 1, sel + 9);

  const label: CSSProperties = { color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: W - itemX - 220 };

  const renderIcon = (it: XItem, selected: boolean) => {
    const [iw, ih] = selected ? L.iconSel : L.icon;
    if (it.game)
      return (
        <div className="dht-xmb-game-icon" data-preview={selected && previewKey === it.key} style={{ width: iw, height: ih, boxShadow: selected ? "0 6px 20px rgba(0,0,0,0.45)" : "0 3px 10px rgba(0,0,0,0.35)", overflow: "hidden", transition: "width 160ms, height 160ms", position: "relative" }}>
          <GameArt g={it.game} kind="landscape" style={{ width: "100%", height: "100%" }} />
          {/* like the console's animated icons: after resting on a game, its trailer plays inside the icon */}
          {selected && previewKey === it.key && <TrailerVideo appid={it.game.appid} seconds={18} sound={s.trailers.sound} style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />}
        </div>
      );
    if (it.video)
      return (
        <div style={{ width: iw, height: ih, boxShadow: selected ? "0 6px 20px rgba(0,0,0,0.45)" : "0 3px 10px rgba(0,0,0,0.35)", overflow: "hidden", transition: "width 160ms, height 160ms", border: "2px solid rgba(255,255,255,0.85)", boxSizing: "border-box", position: "relative", background: "rgba(0,0,0,0.35)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {it.image ? <img src={it.image} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", display: "block" }} /> : <Icon name="video" size={ih * 0.5} color="#fff" />}
          {/* like the console's video thumbnails: after resting on it, the video plays inside the icon */}
          {selected && previewKey === it.key && <LocalVideoView video={it.video} sound={false} loop style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }} />}
        </div>
      );
    if (it.image)
      return (
        <div style={{ width: iw, height: ih, boxShadow: selected ? "0 6px 20px rgba(0,0,0,0.45)" : "0 3px 10px rgba(0,0,0,0.35)", overflow: "hidden", transition: "width 160ms, height 160ms", border: "2px solid rgba(255,255,255,0.85)", boxSizing: "border-box" }}>
          <XmbImage src={it.image} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} fallback={<StockXmbIcon name={it.icon??"photo"} size={ih*.8} variant={variant} skinFallback={!!skin}/>}/>
        </div>
      );
    const gs = selected ? L.glyphSel : L.glyph;
    return (
      <div style={{ width: iw, height: ih, display: "flex", alignItems: "center", justifyContent: "center", filter: selected ? "drop-shadow(0 0 10px rgba(255,255,255,0.75))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }}>
        {it.p3t && skinIcon(it.p3t) ? <XmbImage source="skin" src={skinIcon(it.p3t)!} style={{ width: gs * 1.35, height: gs * 1.35,objectFit:"contain" }} fallback={<StockXmbIcon name={it.icon??"folder"} size={gs*1.15} variant={variant} skinFallback={!!skin}/>}/> : <StockXmbIcon name={it.icon ?? "folder"} size={gs*1.15} variant={variant} skinFallback={!!skin}/>}
      </div>
    );
  };

  return (
    <ThemeRoot onInput={onInput} hints={{ a: "Select", y: "Options", menu: "Options" }}>
      <Stage>
        <XmbBackground variant={variant} color={color} animate={s.animations} now={now} skin={skin} />
        {/* the selected game's own backdrop fades in after a moment, like PIC1 on the console */}
        {backdrop && (
          <div className="dht-xmb-game-backdrop" key={backdrop.appid} style={{ position: "absolute", inset: 0, animation: "dhtPic1 900ms ease-out both" }}>
            <GameArt g={backdrop} kind="hero" style={{ width: W, height: H }} />
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,0.55), rgba(0,0,0,0.25) 60%, rgba(0,0,0,0.15))" }} />
          </div>
        )}
        <style>{"@keyframes dhtPic1 { from { opacity: 0 } to { opacity: 1 } }"}</style>
        <XmbStatus variant={variant} now={now} h24={s.clock24} />

        {/* category bar */}
        <div style={{ position: "absolute", left: 0, top: 0, width: W, height: H, opacity: inFolder ? 0 : 1, transition: "opacity 200ms" }}>
          {cats.map((c, i) => {
            const selected = i === catIdx;
            const size = selected ? L.catIconSel : L.catIcon;
            const x = itemX + (i - catIdx) * L.catGap;
            if (x < -200 || x > W + 200) return null;
            return (
              <div
                key={c.key}
                className="dht-xmb-cat"
                data-selected={selected}
                data-name={c.label}
                onClick={()=>{setCatIdx(i);setStack([]);playSound("tab");}}
                style={{
                  position: "absolute",
                  left: x,
                  top: catY,
                  transform: "translate(-50%,-50%)",
                  transition: "left 220ms ease-out",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  opacity: selected ? 1 : 0.58,
                }}
              >
                <div style={{ filter: selected ? "drop-shadow(0 0 12px rgba(255,255,255,0.8))" : "drop-shadow(0 2px 4px rgba(0,0,0,0.35))" }}>
                  {skinIcon(c.p3t) ? <XmbImage source="skin" src={skinIcon(c.p3t)!} style={{ width: size * 1.3, height: size * 1.3, display: "block",objectFit:"contain" }} fallback={<StockXmbIcon name={c.icon} size={size*1.12} variant={variant} skinFallback={!!skin}/>}/> : <StockXmbIcon name={c.icon} size={size*1.12} variant={variant} skinFallback={!!skin}/>}
                </div>
                <div style={{ position: "absolute", top: size + 6, color: "#fff", fontSize: L.font - 4, opacity: selected ? 1 : 0, whiteSpace: "nowrap", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{c.label}</div>
              </div>
            );
          })}
        </div>

        {/* folder breadcrumb */}
        {inFolder && (
          <div style={{ position: "absolute", left: itemX - 150, top: catY - 22, display: "flex", alignItems: "center", gap: 14, color: "#fff", fontSize: L.font - 2, opacity: 0.9 }}>
            <Icon name="folder" size={L.catIcon - 10} color="#fff" />
            <span style={{ textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}>{stack.map((f) => f.label).join(" › ")}</span>
          </div>
        )}

        {/* item column */}
        {items.slice(lo, hi + 1).map((it, k) => {
          const i = lo + k;
          const selected = i === sel;
          const [iw, ih] = selected ? L.iconSel : L.icon;
          const y = yOf(i);
          if (y < -120 || y > H + 60) return null;
          return (
            <div
              key={it.key}
              className="dht-xmb-item"
              data-selected={selected}
              data-name={it.label}
              onClick={()=>{setSel(i);activate(it);}}
              style={{
                position: "absolute",
                left: itemX - iw / 2,
                top: y - ih / 2,
                display: "flex",
                alignItems: "center",
                gap: 26,
                transition: "top 180ms ease-out, left 160ms",
                opacity: selected ? 1 : i < sel ? 0.55 : 0.78,
              }}
            >
              {renderIcon(it, selected)}
              <div className="dht-xmb-label" style={{ boxShadow:"none",filter:"none",background:"transparent",display: "flex", flexDirection: "column", gap: 4, visibility: !it.game || showTitle(s, variant, selected) ? "visible" : "hidden" }}>
                <span className="dht-xmb-title" style={{ ...label, fontSize: selected ? L.fontSel : L.font, textShadow:"0 1px 2px rgba(0,0,0,0.65)",boxShadow:"none",filter:"none",background:"transparent" }}>{it.label}</span>
                {selected && it.sub && <span style={{ ...label, fontSize: L.subFont, opacity: 0.85 }}>{it.sub}</span>}
                {selected && it.game && <span style={{ ...label, fontSize: L.subFont - 2, opacity: 0.65 }}>Last played: {fmtLastPlayed(it.game.lastPlayed)}</span>}
                {selected && it.game && <Badges g={it.game} size={L.subFont - 4} style={{ marginTop: 4 }} />}
              </div>
            </div>
          );
        })}
        {items.length === 0 && (
          <div style={{ position: "absolute", left: itemX - 40, top: catY + L.selGapBelow - 14, color: "#fff", opacity: 0.7, fontSize: L.font }}>There are no items.</div>
        )}

        <MenuView menu={menu} variant="xmb" />
      </Stage>
    </ThemeRoot>
  );
}

export const Ps3Home = () => <XmbHome variant="ps3" />;
export const PspHome = () => <XmbHome variant="psp" />;
