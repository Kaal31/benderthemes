import {BackgroundMedia} from "../WallpaperMedia";
import {ProfileAvatar} from "../ProfileAvatar";
// Xbox 360 Metro-era dashboard (2011): lowercase pivots across the top and a
// horizontally scrolling field of flat tiles on the grey V2 background. The
// background, the XboxLogoHoriz at (1012,42), the tile icons and the legend at
// (90,605) on a 1280×720 canvas come from the Metro dashboard in
// thedev0ps/Xbox-360-Dashboard-Archive (asset set x360-metro-dash).
import { BladesHome } from "./X360Classic";
import { KinectHome } from "./X360Kinect";
import { NxeHome } from "./X360Nxe";
import { CSSProperties, useMemo, useState } from "react";
import { GameArt, Icon, IconName, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, spatial, Stage, ThemeRoot, useStage } from "../input";
import { fmtPlaytime, Game, openSteam } from "../library";
import { showTitle, THEMES } from "../settings";
import { Badges } from "../badges";
import { fmtTime, playSound, useClock, useWallpaper } from "../steam";
import { useAssets } from "../assets";
import { useX360Look, X360_SECTION } from "../skins";

import { useReportFocus } from "../focus";
import {MetroAvatar, MetroAvatarEditor} from './X360MetroAvatar';
import {X360Avatar, avatarForName, AvatarSpec} from './X360Avatar';
import {AvatarEditor, OWN_AVATAR_SET, savedAvatar, saveAvatar} from './X360AvatarEditor';
interface XTile {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  game?: Game;
  art?: "landscape" | "portrait" | "hero";
  icon?: IconName;
  color?: string;
  run: () => void;
}
const GREEN = "var(--dht-x360-accent, var(--dht-x360-skin-accent, #107c10))"; // CSS Loader colour > Xbox 360 theme file colour > default
const SHADOW = "0 1px 2px rgba(15,15,15,.45)";
const FONT = `var(--dht-font, "Segoe UI Light", "Segoe UI", "Motiva Sans", "Helvetica Neue", Arial, sans-serif)`;

/** Xbox 360: the dashboard era chosen in settings (Metro is this file). */
export function X360Home() {
  const style = useHome().settings.x360?.style ?? "metro";
  if (style === "blades") return <BladesHome />;
  if (style === "nxe") return <NxeHome />;
  if (style === "kinect") return <KinectHome />;
  return <X360MetroHome />;
}

function LegacyMetroAvatar({spec,motion}:{spec:AvatarSpec;motion:boolean}) {
  const own=useAssets(OWN_AVATAR_SET);
  return <X360Avatar spec={spec} model={own.avatar} motion={motion}/>;
}
function LegacyMetroAvatarEditor({name,spec,motion,onDone}:{name:string;spec:AvatarSpec;motion:boolean;onDone:(spec?:AvatarSpec)=>void}) {
  const own=useAssets(OWN_AVATAR_SET);
  return <AvatarEditor name={name} initial={spec} firstRun={false} model={own.avatar} motion={motion} onDone={onDone}/>;
}

function X360MetroHome() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const now = useClock(15000);
  const wall = useWallpaper("x360");
  const a = useAssets("x360-metro-dash");
  const look = useX360Look();
  const menu = useMenu();
  const games = api.lib.games;
  const [avatarOpen,setAvatarOpen]=useState(false),[legacyOpen,setLegacyOpen]=useState(false),[avatarRevision,setAvatarRevision]=useState(0);
  const oldSpec=savedAvatar(s)??avatarForName(api.user);
  const fallbackAvatar=<LegacyMetroAvatar spec={oldSpec} motion={s.animations}/>;
  // the dashboard's own white glyphs for the system tiles
  const ICO: Partial<Record<IconName, string>> = { game: "ico-games", store: "ico-marketplace", friends: "ico-addfriends", bell: "ico-messages", download: "ico-installedgame", library: "ico-controller", globe: "ico-internet", palette: "ico-changetheme", gear: "ico-settingspreferences", power: "ico-turnoff", apps: "ico-apps" };

  const play = (g: Game) => () => api.activate(g, () => api.launch(g));
  const themes = () => menu.open(themeMenu(s.theme, api.switchTheme, THEMES), "presets", { page: true });

  const pivots = useMemo(() => {
    const sys = (key: string, x: number, y: number, w: number, h: number, label: string, icon: IconName, run: () => void, color = GREEN): XTile => ({ key, x, y, w, h, label, icon, color, run });
    // home
    const home: XTile[] = [];
    if (games[0]) home.push({ key: "h0", x: 0, y: 0, w: 560, h: 315, label: games[0].name, game: games[0], art: "hero", run: play(games[0]) });
    else home.push(sys("h0", 0, 0, 560, 315, "steam library", "library", () => openSteam("library")));
    [1, 2, 3, 4].forEach((n, k) => {
      const g = games[n];
      const x = 575 + (k % 2) * 285;
      const y = (k >> 1) * 165;
      if (g) home.push({ key: `h${n}`, x, y, w: 270, h: 150, label: g.name, game: g, art: "landscape", run: play(g) });
    });
    const smalls: [string, IconName, () => void][] = [
      ["my games", "game", () => setPivot(4)],
      ["steam store", "store", () => openSteam("store")],
      ["friends", "friends", () => openSteam("friends")],
      ["downloads", "download", () => openSteam("downloads")],
    ];
    smalls.forEach(([label, icon, run], k) => home.push(sys(`hs${k}`, k * 285, 335, 270, 120, label, icon, run, k === 0 ? GREEN : "#2d2d2d")));
    // 2011 Social: a narrow command column beside an open avatar floor.
    const social: XTile[] = [
      sys("fr",0,0,170,100,"friends","friends",()=>openSteam("friends")),
      sys("social-apps",0,110,170,100,"social apps","apps",()=>openSteam("community")),
      sys("signin",0,220,170,100,"sign in or out","user",()=>openSteam("mainmenu")),
      sys("avatar",190,0,220,90,api.user,"user",()=>setAvatarOpen(true),"transparent"),
    ];
    // Marketplace landing pages keep the 2011 two-row composition.
    const feature=(key:string,label:string,run:()=>void,offset=0):XTile[]=>{
      const first=games[offset],second=games[offset+1],third=games[offset+2];
      return [sys(key+'-library',0,0,170,155,label,'game',run),
        sys(key+'-store',0,165,170,155,'marketplace','store',()=>openSteam('store')),
        first?{key:key+'-feature',x:180,y:0,w:420,h:320,label:first.name,game:first,art:'hero',run:play(first)}:sys(key+'-feature',180,0,420,320,'featured','store',()=>openSteam('store')),
        ...(second?[{key:key+'-second',x:610,y:0,w:230,h:155,label:second.name,game:second,art:'landscape' as const,run:play(second)}]:[]),
        ...(third?[{key:key+'-third',x:610,y:165,w:230,h:155,label:third.name,game:third,art:'landscape' as const,run:play(third)}]:[])];
    };
    const gtiles=feature('games','my games',()=>openSteam('library'));
    const video=feature('video','my videos',()=>api.openMedia(),3);
    const apps:XTile[]=[sys('my-apps',0,0,170,155,'my apps','apps',()=>openSteam('library')),sys('apps-store',0,165,170,155,'apps marketplace','store',()=>openSteam('store'))];
    api.lib.apps.forEach((g,i)=>apps.push({key:'app-'+g.appid,x:180+Math.floor(i/2)*240,y:i%2*165,w:230,h:155,label:g.name,game:g,art:'landscape',run:()=>api.launch(g)}));
    if(!api.lib.apps.length)apps.push(sys('browser',180,0,420,320,'internet explorer','globe',()=>openSteam('browser'),'#246b9b'),sys('pictures',610,0,230,155,'pictures','photo',()=>api.openMedia()),sys('app-downloads',610,165,230,155,'downloads','download',()=>openSteam('downloads')));
    const settings:XTile[]=[
      sys('system',0,0,270,155,'system','gear',()=>openSteam('settings')),
      sys('profile',280,0,270,155,'profile','user',()=>setAvatarOpen(true)),
      sys('preferences',560,0,270,155,'preferences','gear',api.openSettings),
      sys('theme',0,165,270,155,'themes','palette',themes),
      sys('account',280,165,270,155,'account','user',()=>openSteam('mainmenu')),
      sys('power',560,165,270,155,'turn off','power',()=>openSteam('power')),
    ];
    return [
      { name: "bing", tiles: [sys("search",0,0,840,155,"search","search",()=>openSteam("search"))] },
      { name: "home", tiles: [sys("quickplay",0,0,170,155,"quickplay","game",()=>openSteam("library")),sys("disc",0,165,170,155,"play game","game",()=>{if(games[0])play(games[0])();else openSteam("library");}),...home.filter(t=>t.game).slice(0,3).map((t,i)=>({...t,x:i===0?180:610,y:i===2?165:0,w:i===0?420:230,h:i===0?320:155}))] },
      { name: "social", tiles: social },
      { name: "video", tiles: video },
      { name: "games", tiles: gtiles },
      { name: "apps", tiles: apps },
      { name: "settings", tiles: settings },
    ];
  }, [api.lib, api.user, s.theme]);

  const [pivot, setPivotRaw] = useRemembered("x360-pivot", 1);
  const [sels, setSels] = useRemembered<Record<number, number>>("x360-sels", {});
  const [onBar, setOnBar] = useState(false);
  const setPivot = (i: number) => {
    const n = clamp(i, 0, pivots.length - 1);
    if (n !== pivot) {
      setPivotRaw(n);
      playSound("tab");
    }
  };
  const pv = pivots[clamp(pivot, 0, pivots.length - 1)];
  const sel = clamp(sels[pivot] ?? 0, 0, pv.tiles.length - 1);
  const cur = pv.tiles[sel];
  useReportFocus(cur?.game);

  const options = () => {
    const g = cur?.game;
    const extra: MenuItem[] = [
      { label: "my avatar", action: () => setAvatarOpen(true) },
      { label: "presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "home settings", action: api.openSettings },
      { label: "home", action: api.showSteamHome },
    ];
    menu.open(g ? [{ label: "play", action: () => api.launch(g) }, { label: "watch trailer", action: () => api.playTrailer(g) }, { label: "game details", action: () => api.details(g) }, { label: "game options", action: () => api.nativeMenu(g) }, ...extra] : extra, g ? g.name : "options");
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (b === "l1") return setPivot(pivot - 1), true;
    if (b === "r1") return setPivot(pivot + 1), true;
    if (b === "y") return options(), true;
    if (b === "menu") {
      if (cur?.game) api.nativeMenu(cur.game);
      return true;
    }
    if (onBar) {
      if (b === "left") setPivot(pivot - 1);
      else if (b === "right") setPivot(pivot + 1);
      else if (b === "down" || b === "a" || b === "b") (setOnBar(false), playSound("move"));
      return true;
    }
    if (b === "up" || b === "down" || b === "left" || b === "right") {
      const to = spatial(
        pv.tiles.map((t) => ({ x: t.x + t.w / 2, y: t.y + t.h / 2 })),
        sel,
        b,
      );
      if (to >= 0) {
        setSels((m) => ({ ...m, [pivot]: to }));
        playSound("move");
      } else if (b === "up") (setOnBar(true), playSound("move"));
      else if (b === "left") setPivot(pivot - 1);
      else if (b === "right") setPivot(pivot + 1);
      return true;
    }
    if (b === "a") {
      playSound("select");
      cur?.run();
      return true;
    }
    if (b === "x" && cur?.game) return api.launch(cur.game), true;
    return false;
  };

  // ───── layout ─────
  const k = Math.min(W / 1280, H / 720);
  const X0 = 96*k;
  const Y0 = H*.285;
  // Tile rows are 320 units high; the old 455-unit fit shrank every category.
  const tileScale = pv.name==='social'?Math.min(k*.83,H*.5/455):Math.min(k,H*.46/320);
  const availableWidth=W-X0*2;
  const stretch=pv.name==='social'?1:availableWidth/(840*tileScale);
  const displayTiles=pv.tiles.map(tile=>({...tile,x:tile.x*stretch,w:tile.w*stretch}));
  const displayCurrent=displayTiles[sel];
  const contentW = Math.max(...displayTiles.map((t) => t.x + t.w));
  let scroll = 0;
  if (displayCurrent) {
    const right = displayCurrent.x + displayCurrent.w;
    if (right - scroll > (W - X0 * 2)/tileScale) scroll = right - ((W - X0 * 2)/tileScale);
    scroll = clamp(scroll, 0, Math.max(0, contentW - ((W - X0 * 2)/tileScale)));
  }

  const label: CSSProperties = { position: "absolute", left: 10, bottom: 8, right: 10, color: "#fff", fontSize: 17, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", fontFamily: FONT };

  return (
    <ThemeRoot onInput={onInput} hints={{ a: "Select", y: "Options", menu: "Options" }}>
      <Stage background="#d9d9d9">
      <div className="dht-x360-skin" data-dht-from-skin={look.bg || look.accent ? "x360" : undefined} style={{ display: "contents", ...look.vars } as CSSProperties}>
        <div className="dht-x360-bg" style={{ position: "absolute", inset: 0, background: `var(--dht-x360-bg, ${look.bg || a.background ? `url("${look.bgFor(X360_SECTION[pv.name] ?? "home") ?? a.background}") center/cover` : "linear-gradient(180deg, #6e6e6e 0%, #9a9a9a 55%, #c4c4c4 100%)"})` }} />
        {wall && <BackgroundMedia src={wall} style={{ position: "absolute", inset: 0, width: W, height: H, objectFit: "cover" }} />}
        {!wall && a["bottom-vignette"] && <img src={a["bottom-vignette"]} aria-hidden="true" style={{ position: "absolute", left: 0, bottom: 0, width: W, height: H * 300 / 720, pointerEvents: "none" }} />}


        <div aria-hidden="true" style={{position:'absolute',left:0,right:0,top:H*.56,bottom:0,background:'linear-gradient(180deg,transparent,#bdbdbd66 18%,#181818bb 100%)',pointerEvents:'none'}}/>
        {/* gamer corner */}
        <div role="button" aria-label="Edit Xbox avatar" tabIndex={0} onClick={()=>setAvatarOpen(true)} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setAvatarOpen(true);}}} style={{ position: "absolute", right: 80 * k, top: 24 * k, display: "flex", alignItems: "center", gap: 14, fontFamily: FONT, color: "#fff", textShadow: SHADOW, cursor:'pointer' }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: 15 }}>{api.user}</div>
            <div style={{ fontSize: 15, opacity: 0.7 }}>{fmtTime(now, s.clock24)}</div>
          </div>
          <div style={{ width: 32, height: 32, background: GREEN, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <ProfileAvatar size={28} fallback={<Icon name="user" size={38} color="#fff" />}/>
          </div>
        </div>

        {/* pivots */}
        <div style={{ position: "absolute", left: X0, top: H*.17, display: "flex", gap: 24*k, fontFamily: FONT, transition: "transform 250ms ease-out", transform: "none" }}>
          {pivots.map((pv2, i) => (
            <span key={pv2.name} role="button" tabIndex={0} onClick={()=>setPivot(i)} onKeyDown={event=>{if(event.key==='Enter'||event.key===' '){event.preventDefault();setPivot(i);}}} className="dht-x360-pivot" data-selected={i === pivot} style={{ cursor:'pointer',fontSize: 29*k, fontWeight: 300, letterSpacing: -0.5, color: i === pivot ? "#fff" : "rgba(255,255,255,0.5)", textShadow: SHADOW, textDecoration: onBar && i === pivot ? "underline" : "none", textUnderlineOffset: 8 }}>
              {pv2.name}
            </span>
          ))}
        </div>

        {/* Open Social stage: the shared avatar stands on the floor, outside tiles. */}
        {pv.name==='social'&&!avatarOpen&&!legacyOpen&&<div data-social-avatar-stage style={{position:'absolute',left:X0+330*tileScale,top:Y0+20*tileScale,width:250*tileScale,height:330*tileScale}}>
          <MetroAvatar revision={avatarRevision} fallback={fallbackAvatar} framing="nxe"/>
        </div>}
        {/* tiles */}
        <div style={{ position: "absolute", left: X0, top: Y0, transform: `translateX(${-scroll*tileScale}px) scale(${tileScale})`, transformOrigin:"0 0", transition: "transform 250ms ease-out" }} key={pv.name}>
          {displayTiles.map((t, i) => {
            const on = i === sel && !onBar;
            if ((t.x-scroll)*tileScale > W-X0 || (t.x+t.w-scroll)*tileScale < -X0) return null;
            return (
              <div
                key={t.key}
                className="dht-x360-tile dht-tile"
                data-selected={on}
                data-name={t.label}
                onClick={() => { setSels(m=>({...m,[pivot]:i})); t.run(); }}
                style={{
                  position: "absolute",
                  left: t.x,
                  top: t.y,
                  width: t.w,
                  height: t.h,
                  background: t.color ?? "#222",
                  overflow: "hidden",
                  transform: on ? "scale(1.025)" : "scale(1)",
                  transition: "transform 140ms, box-shadow 140ms",
                  boxShadow: t.color==="transparent" ? "none" : on ? "0 0 0 2px #f4f4f4, 0 3px 8px #0005" : "0 2px 6px rgba(0,0,0,0.15)",
                  zIndex: on ? 2 : 1,
                  animation: s.animations ? `dhtSlideIn 300ms ease-out ${Math.min(i, 8) * 25}ms backwards` : undefined,
                  cursor: "pointer",
                }}
              >
                {t.key==='me'?<>
                  {!avatarOpen&&!legacyOpen&&<MetroAvatar revision={avatarRevision} fallback={fallbackAvatar}/>}
                  <div style={label}>{t.label}</div>
                </>:t.game ? (
                  <>
                    <GameArt g={t.game} kind={t.art ?? "landscape"} style={{ width: "100%", height: "100%" }} />
                    <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 46, background: "linear-gradient(180deg, rgba(0,0,0,0), rgba(0,0,0,0.75))" }} />
                    {t.art !== "portrait" && showTitle(s, "x360", on) && <div style={label}>{t.label}</div>}
                  </>
                ) : (
                  <>
                    <div style={{ position: "absolute", left: 14, top: 14 }}>
                      {a[ICO[t.icon ?? "apps"] ?? ""] ? <img src={a[ICO[t.icon ?? "apps"]!]} style={{ width: t.h > 200 ? 64 : 40, height: t.h > 200 ? 64 : 40, display: "block" }} /> : <Icon name={t.icon ?? "apps"} size={t.h > 200 ? 64 : 40} color="#fff" />}
                    </div>
                    <div style={{ ...label, fontSize: 20 }}>{t.label}</div>
                  </>
                )}
              </div>
            );
          })}
        </div>
        {avatarOpen&&<MetroAvatarEditor fallback={fallbackAvatar} onClose={()=>{setAvatarOpen(false);setAvatarRevision(v=>v+1);}} onLegacy={()=>{setAvatarOpen(false);setAvatarRevision(v=>v+1);setLegacyOpen(true);}}/>}
        {legacyOpen&&<LegacyMetroAvatarEditor name={api.user} spec={oldSpec} motion={s.animations} onDone={spec=>{if(spec)saveAvatar(spec);setLegacyOpen(false);setAvatarRevision(v=>v+1);}}/>}
        <style>{`@keyframes dhtSlideIn { from { opacity: 0; transform: translateX(60px) } to { opacity: 1; transform: none } }`}</style>

        {/* focused game caption */}
        {cur?.game && !onBar && (
          <div style={{ position: "absolute", left: X0, top: Y0 + Math.max(...displayTiles.map(tile=>tile.y+tile.h))*tileScale + 20, fontFamily: FONT, color: "#fff", textShadow: SHADOW }}>
            {showTitle(s, "x360", true) && <div style={{ fontSize: 26, fontWeight: 300 }}>{cur.game.name}</div>}
            <div style={{ fontSize: 16, opacity: 0.65 }}>{fmtPlaytime(cur.game.playtime, cur.game.lastPlayed)}</div>
            <Badges g={cur.game} size={14} style={{ marginTop: 6 }} />
          </div>
        )}
        {/* button legend */}
        <div style={{ position: "absolute", left: 90 * k, bottom: H*.08, display: "flex", gap: 30, alignItems: "center", fontFamily: FONT, fontSize: 18, color: "#fff", textShadow: SHADOW }}>
          {([["legend-a", "select"], ["legend-y", "options"]] as const).map(([img, text]) => (
            <span key={img} style={{ display: "flex", alignItems: "center", gap: 6 }}>{a[img] && <img src={a[img]} style={{ width: 32, height: 32 }} />}{text}</span>
          ))}
        </div>
        <MenuView menu={menu} variant="x360" />
      </div>
      </Stage>
    </ThemeRoot>
  );
}
