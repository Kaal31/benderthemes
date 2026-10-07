// Alien Dial: sculpted metal, a luminous hourglass core and a reflected carousel.
import { CSSProperties, useEffect, useRef, useState } from "react";
import { BatteryGlyph, GameArt, Icon, MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { Game, openAchievements, openSteam } from "../library";
import { showTitle, THEMES, updateDial, getSettings, DialMotion } from "../settings";
import { fmtTime, playSound, useBattery, useClock, useSteamStatus, useWallpaper } from "../steam";
import { DialMechanism, DialScenery, Hourglass } from "./dialArtwork";
import { DIAL_CSS } from "./dialStyles";

import { DialProjectionLight } from "./dialProjectionLight";
import { useAssets } from "../assets";

export function DialHome() {
  const api = useHome();
  const { settings: s, lib: { games } } = api;
  const { W, H } = useStage();
  const now = useClock(15000);
  const bat = useBattery();
  const status = useSteamStatus();
  const wall = useWallpaper("dial");
  const skins = useAssets("dial-skins");
  const skinHue = s.dial.look === "crimson" ? -125 : s.dial.look === "arctic" ? 80 : 0;
  const skinArt = skins[s.dial.look];
  const menu = useMenu();
  const [remembered, setSel] = useRemembered("dial-sel", 0);
  const sel = clamp(remembered, 0, Math.max(0, games.length - 1));
  const [zone, setZone] = useState<"row" | "tabs">("row");
  const [tab, setTab] = useState(0);
  const [turn, setTurn] = useState(0);
  const [browsed,setBrowsed] = useState(false);
  const active = s.dial.activation === "always" || (s.dial.activation === "on-browse" && browsed);
  const motions = s.dial.motions ?? (s.dial.motion === "none" ? [] : [s.dial.motion]);
  const slowMorph = motions.includes("rhombus-slow");
  const rhombus = slowMorph || motions.includes("rhombus");
  const motion = s.animations && motions.length ? "combined" : "none";
  const hardware = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!s.animations || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !turn) return;
    const pulse = motions.includes("pulse"), lift = motions.includes("hologram");
    if (!pulse && !lift) return;
    const animation = hardware.current?.animate([
      {transform:"translateY(0) scale(1)"},
      {transform:`translateY(${lift ? -9 : 0}px) scale(${pulse ? 1.045 : 1})`,offset:.45},
      {transform:"translateY(0) scale(1)"}
    ],{duration:440,easing:"ease-out"});
    return () => animation?.cancel();
  },[turn,s.animations,motions.join(",")]);
  const [launching, setLaunching] = useState(false);
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);
  const release = useRef<ReturnType<typeof setTimeout> | null>(null);
  const cur: Game | undefined = games[sel];
  const [outgoing, setOutgoing] = useState<Game | undefined>();
  const previousCover = useRef(cur);
  useEffect(() => {
    const old = previousCover.current;
    previousCover.current = cur;
    if (!slowMorph || !s.animations || old?.appid === cur?.appid) return;
    setOutgoing(old);
    const timer = setTimeout(() => setOutgoing(undefined), 220);
    return () => clearTimeout(timer);
  }, [cur?.appid, slowMorph, s.animations]);
  useEffect(() => { if (remembered !== sel) setSel(sel); }, [remembered, sel]);
  useEffect(() => () => { if (pending.current) clearTimeout(pending.current); if (release.current) clearTimeout(release.current); }, []);

  const choose = (index: number, distance: number) => {
    if (launching || !games.length) return;
    setBrowsed(true);
    setSel(index);
    setTurn(v => v + distance * 32);
    setZone("row");
    playSound(browsed ? "tile" : "open");
  };
  const step = (distance: number) => {
    if (!games.length) return;
    choose((sel + distance % games.length + games.length) % games.length, distance);
  };
  const launch = (g: Game) => {
    if (pending.current || launching) return;
    setBrowsed(true);
    setLaunching(true);
    if (!browsed) playSound("open");
    pending.current = setTimeout(() => {
      pending.current = null;
      api.activate(g, () => api.launch(g));
      release.current = setTimeout(() => { setLaunching(false); release.current = null; }, 900);
    }, s.animations ? 340 : 0);
  };
  const tabs = [
    { name: "Library", run: () => { setZone("row"); playSound("tab"); } },
    { name: "Store", run: () => openSteam("store") },
    { name: "Settings", run: () => openSteam("settings") },
  ];
  const options = () => {
    const common: MenuItem[] = [
      { label: "Dial skin", sub: () => ([["classic","Original"],["chrome","Classic chrome"],["crimson","Crimson reactor"],["arctic","Arctic ceramic"]] as const).map(([look,label]) => ({label,checked:getSettings().dial.look===look,action:()=>updateDial({look})})) },
      { label: "Switch animation", sub: () => ([
        ["rhombus","Hourglass → Rhombus (video)"],["rhombus-slow","Slower morph (650 ms hold)"],["rotate","Rotate"],["pulse","Pulse"],["hologram","Hologram lift"],["none","None"],
      ] as [DialMotion,string][]).map(([motion,label]) => ({label,checked:motion === "none" ? motions.length === 0 : motions.includes(motion),action:()=>{const d=getSettings().dial;const selected=d.motions ?? (d.motion === "none" ? [] : [d.motion]);updateDial({motions:motion === "none" ? [] : selected.includes(motion) ? selected.filter(m=>m!==motion) : [...selected.filter(m => motion === "rhombus" ? m !== "rhombus-slow" : motion === "rhombus-slow" ? m !== "rhombus" : true),motion]});}})) },
      { label: "Dial activation", sub: () => ([
        ["on-browse","Activate when browsing"],["always","Always activated"],["off","Keep idle appearance"],
      ] as const).map(([activation,label]) => ({label,checked:getSettings().dial.activation===activation,action:()=>{setBrowsed(false);updateDial({activation});}})) },
      { label: "Floating cover", sub: () => [true,false].map(floatingCover => ({label:floatingCover?"On":"Off",checked:getSettings().dial.floatingCover===floatingCover,action:()=>updateDial({floatingCover})})) },
      { label: "Hologram light", sub: () => [true,false].map(projectionLight => ({label:projectionLight?"On":"Off",checked:getSettings().dial.projectionLight===projectionLight,action:()=>updateDial({projectionLight})})) },
      { label: "Reflections", sub: () => [true,false].map(reflections => ({label:reflections?"On":"Off",checked:getSettings().dial.reflections===reflections,action:()=>updateDial({reflections})})) },
      { label: "Dial sound effects", sub: () => ([
        ["reference","Sounds from your video"],["pack","AudioLoader / Steam sounds"],["off","Off"],
      ] as const).map(([sound,label]) => ({label,checked:getSettings().dial.sound===sound,action:()=>updateDial({sound})})) },
      { label: "Library", action: () => openSteam("library") },
      { label: "Presets", sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: "Screenshots", action: api.openMedia },
      { label: "Home Screen Settings", action: api.openSettings },
      { label: "Home", action: api.showSteamHome },
    ];
    menu.open(cur ? [
      { label: "Play", action: () => launch(cur) },
      { label: "Game Details", action: () => api.details(cur) },
      { label: "Watch Trailer", action: () => api.playTrailer(cur) },
      { label: "Achievements", action: () => openAchievements(cur) },
      { label: "Game Options", action: () => api.nativeMenu(cur) }, ...common,
    ] : common, cur?.name);
  };
  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    if (p.btn === "y" || p.btn === "menu") { options(); return true; }
    if (launching) return true;
    if (zone === "tabs") {
      if (p.btn === "left" || p.btn === "right") { setTab(clamp(tab + (p.btn === "left" ? -1 : 1), 0, 2)); playSound("move"); }
      else if (p.btn === "down" || p.btn === "b") setZone("row");
      else if (p.btn === "a") tabs[tab].run();
      return true;
    }
    switch (p.btn) {
      case "left": step(-1); return true;
      case "right": step(1); return true;
      case "l1": step(-5); return true;
      case "r1": step(5); return true;
      case "up": setZone("tabs"); playSound("tab"); return true;
      case "a": case "x": if (cur) launch(cur); return true;
      default: return false;
    }
  };
  const radius = Math.min(H * .254, 235);
  const cx = W * .323;
  const cy = H * .426;
  const coverH = Math.min(H * .277, 264);
  const selectedH = coverH + 12;
  const selectedW = 172;
  const smallW = 128;
  // Keep every game unique for small libraries. Larger libraries wrap on both sides.
  const leftCount = Math.min(2, Math.max(0, games.length - 5));
  const offsets = Array.from({ length: Math.min(8, games.length) }, (_, i) => i - leftCount);
  return <ThemeRoot onInput={onInput} hints={{ a: "Play", y: "Options", menu: "Options" }}>
    <Stage background="#020403">
      <style>{DIAL_CSS}</style>
      <div className="alien-dial" data-slow-morph={slowMorph} data-skin={s.dial.look} style={{"--alien-skin-hue":`${skinHue}deg`} as CSSProperties} data-motion={s.animations} data-launching={launching} data-animation={motion} data-active={active} data-reflections={s.dial.reflections} onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }}>
        {wall ? <img className="dht-dial-bg alien-wall" src={wall} alt=""/> : <DialScenery/>}
        <header className="alien-header">
          <button className="alien-steam" aria-label="Steam menu" onClick={() => openSteam("mainmenu")}><span className="alien-steam-mark"><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658c.545-.371 1.203-.59 1.912-.59.063 0 .125.004.188.006l2.861-4.142V8.91c0-2.495 2.028-4.524 4.524-4.524 2.494 0 4.524 2.031 4.524 4.527s-2.03 4.525-4.524 4.525h-.105l-4.076 2.911c0 .052.004.105.004.159 0 1.875-1.515 3.396-3.39 3.396-1.635 0-3.016-1.173-3.331-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 11.999-5.373 11.999-12S18.605 0 11.979 0zM7.54 18.21l-1.473-.61c.262.543.714.999 1.314 1.25 1.297.539 2.793-.076 3.332-1.375.263-.63.264-1.319.005-1.949s-.75-1.121-1.377-1.383c-.624-.26-1.29-.249-1.878-.03l1.523.63c.956.4 1.409 1.5 1.009 2.455-.397.957-1.497 1.41-2.454 1.012H7.54zm11.415-9.303c0-1.662-1.353-3.015-3.015-3.015-1.665 0-3.015 1.353-3.015 3.015 0 1.665 1.35 3.015 3.015 3.015 1.663 0 3.015-1.35 3.015-3.015zm-5.273-.005c0-1.252 1.013-2.266 2.265-2.266 1.249 0 2.266 1.014 2.266 2.266 0 1.251-1.017 2.265-2.266 2.265-1.253 0-2.265-1.014-2.265-2.265z"/></svg></span><span>STEAM</span></button>
          <nav aria-label="Main navigation">{tabs.map((t,i) => <button key={t.name} className="dht-dial-tab" data-selected={zone === "tabs" && tab === i} data-active={i === 0} onClick={() => { setTab(i); t.run(); }}>{t.name}</button>)}</nav>
          <div className="alien-status"><Icon name="wifi" size={22} color={status.online ? "#d5d9d5" : "#596159"}/>{bat && <BatteryGlyph level={bat.level} charging={bat.charging} color="#58ff00" w={29}/>}<time>{fmtTime(now,s.clock24)}</time><span className="alien-mini"><Hourglass/></span></div>
        </header>
        <div className="alien-floor-light" style={{left:cx-radius,top:cy+radius-15,width:radius*2}}/>
        {s.dial.reflections && <div className="alien-dial-reflection" aria-hidden="true" style={{left:cx-radius,top:cy+radius+3,width:radius*2,height:radius*2}}><DialMechanism turn={s.animations && motions.includes("rotate") ? turn : 0} active={active} rhombus={rhombus} slowMorph={slowMorph} cycle={turn} skinArt={skinArt} skinHue={skinHue} id="reflection"/></div>}
        <button className="alien-mechanism dht-dial-dial" aria-label={cur ? `Play ${cur.name}` : "Alien Dial"} disabled={!cur || launching} onClick={() => cur && launch(cur)} style={{left:cx-radius,top:cy-radius,width:radius*2,height:radius*2}}><div ref={hardware} className="alien-classic-motion"><DialMechanism turn={s.animations && motions.includes("rotate") ? turn : 0} active={active} rhombus={rhombus} slowMorph={slowMorph} cycle={turn} skinArt={skinArt} skinHue={skinHue} id="main"/></div></button>
        {cur && active && s.dial.floatingCover && <div className="alien-projection" key={cur.appid} aria-label={`Holographic projection of ${cur.name}`} style={{left:cx-radius*.63,top:cy-radius*.945,width:radius*1.26,height:radius*1.89}}>
          {s.dial.projectionLight && <DialProjectionLight/>}
          <div className="alien-hologram-float">
          <div className="alien-hologram-card"><div className="alien-hologram-art alien-cover-in"><GameArt flat g={cur} kind="portrait" style={{width:"100%",height:"100%",objectFit:"contain"}}/></div>{slowMorph && outgoing && <div className="alien-hologram-art alien-cover-out"><GameArt flat g={outgoing} kind="portrait" style={{width:"100%",height:"100%",objectFit:"contain"}}/></div>}<div className="alien-hologram-scan"/><div className="alien-hologram-glint"/></div>
          </div>
        </div>}
        <div className="alien-carousel" aria-label="Games">{offsets.map(d => {
          const i = (sel+d+games.length)%games.length;
          const g = games[i];
          const selected = d === 0;
          const width = selected ? selectedW : smallW;
          const height = selected ? selectedH : coverH;
          const left = d === 0 ? cx+radius-9 : d > 0 ? cx+radius+selectedW+5+(d-1)*(smallW+12) : cx-radius-71+(d+1)*(smallW+12);
          return <button key={g.appid} className="alien-game dht-dial-tile dht-tile" data-selected={selected} data-focused={selected && zone === "row"} data-name={g.name} aria-label={g.name} aria-current={selected ? "true" : undefined} onClick={() => selected ? launch(g) : choose(i,d)} style={{left,top:cy-height/2,width,height,zIndex:d < 0 ? 1 : 3}}>
            <div className="alien-cover"><GameArt g={g} kind="portrait" style={{width:"100%",height:"100%"}}/><span className="alien-cover-glass"/></div>
            <div className="alien-reflection dht-dial-refl" aria-hidden="true"><GameArt g={g} kind="portrait" style={{width:"100%",height:"100%"}}/></div>
          </button>;
        })}</div>
        {!cur && <section className="alien-empty" style={{left:cx+radius+30,top:cy-35}}><h2>Your library awaits</h2><p>No games in this library view.</p><button onClick={api.openSettings}>Library settings</button></section>}
        <footer className="alien-footer">
          {cur && <div className="alien-game-info"><div><i/>{showTitle(s,"dial",true) && <span>{cur.name}</span>}</div><button disabled={launching} onClick={() => launch(cur)}><b>A</b>{launching ? "Launching…" : "Play"}</button></div>}
          <div className="alien-hints"><button onClick={options}><b>≡</b>Options</button><button disabled={!cur || launching} onClick={() => cur && launch(cur)}><b>A</b>Select</button></div>
        </footer>
      </div>
      <MenuView menu={menu} variant="dial"/>
    </Stage>
  </ThemeRoot>;
}

