import { t, getCurrentLanguage } from "../i18n";
// PS1 home: the console's own start-up screens (redrawn without any console
// logo), the BIOS main menu with its two bevelled buttons, the Memory Card
// manager (two cards of 15 blocks, the games as tiny pixel save icons, the
// buttons between the cards) and the CD Player, whose tracks open Steam's
// places. Everything is drawn here; no console artwork is used.
import { CSSProperties, useEffect, useMemo, useRef, useState } from "react";
import { MenuItem, MenuView, themeMenu, useHome, useMenu, useRemembered } from "../common";
import { clamp, Press, Stage, ThemeRoot, useStage } from "../input";
import { fmtLastPlayed, fmtPlaytime, Game, openSteam, SteamPlace } from "../library";
import { openDestination } from "../destinations";
import { showTitle, THEMES } from "../settings";
import { fmtTime, playSound, useClock } from "../steam";
import { styleOf } from "../engine/themeStyles";
import { useReportFocus } from "../focus";
import { PS1_BACKS, PS1_FONT, ps1Bevel } from "./ps1Styles";

type Screen = "boot" | "main" | "card" | "cd";
const BLOCKS = 15; // a memory card holds 15 blocks

const WORDS = {
  en: { main: "MAIN MENU", card: "MEMORY CARD", cd: "CD PLAYER", play: "PLAY", details: "DETAILS", options: "OPTIONS", exit: "EXIT", free: "FREE", block: "1 BLOCK", track: "TRACK", page: "CARDS", empty: "NO DATA", shuffle: "SHUFFLE" },
  ja: { main: "メインメニュー", card: "メモリーカード", cd: "CDプレイヤー", play: "プレイ", details: "くわしく", options: "オプション", exit: "おわる", free: "あき", block: "1ブロック", track: "トラック", page: "カード", empty: "データなし", shuffle: "シャッフル" },
  ptBr: { main: "MENU PRINCIPAL", card: "CARTÃO DE MEMÓRIA", cd: "REPRODUTOR DE CD", play: "JOGAR", details: "DETALHES", options: "OPÇÕES", exit: "SAIR", free: "LIVRE", block: "1 BLOCO", track: "FAIXA", page: "CARTÕES", empty: "SEM DADOS", shuffle: "ALEATÓRIO" },
};

let booted = false; // the start-up screens play once per session

type Track = { name: string; run: () => void };

export function Ps1Home() {
  const api = useHome();
  const s = api.settings;
  const { W, H } = useStage();
  const st = styleOf(s, "ps1");
  const menu = useMenu();
  const now = useClock(15000);
  const curLang = getCurrentLanguage();
  const words = WORDS[st<string>("language") === "ja" ? "ja" : curLang === "ptBr" ? "ptBr" : "en"];
  const animate = s.animations !== false;
  const [screen, setScreen] = useState<Screen>(() => (!booted && st<string>("boot") === "show" ? "boot" : st<string>("startScreen") === "card" ? "card" : "main"));
  const [mainSel, setMainSel] = useRemembered("ps1-main", 0);

  // ───── memory cards ─────
  const games = api.lib.games;
  const perScreen = st<number>("cards") === 1 ? 1 : 2;
  const cardCount = Math.max(1, Math.ceil(games.length / BLOCKS));
  const pages = Math.max(1, Math.ceil(cardCount / perScreen));
  const [page, setPage] = useRemembered("ps1-page", 0);
  const pg = clamp(page, 0, pages - 1);
  const [side, setSide] = useRemembered("ps1-side", 0); // which card on screen
  const [block, setBlock] = useRemembered("ps1-block", 0);
  const [zone, setZone] = useState<"blocks" | "buttons">("blocks");
  const [btn, setBtn] = useState(0);
  const cardGames = (c: number) => games.slice(c * BLOCKS, (c + 1) * BLOCKS);
  const sd = clamp(side, 0, perScreen - 1);
  const focusedCard = pg * perScreen + sd;
  const g: Game | undefined = screen === "card" ? cardGames(focusedCard)[block] : undefined;
  useReportFocus(g);

  // ───── CD player ─────
  const tracks: Track[] = [
    { name: t("destStore"), run: () => openSteam("store") },
    { name: t("destLibrary"), run: () => openSteam("library") },
    { name: t("destFriends"), run: () => openSteam("friends") },
    { name: t("destMedia"), run: () => api.openMedia() },
    { name: t("destMusic"), run: () => openDestination({ place: "music" }) },
    { name: t("destDownloads"), run: () => openSteam("downloads") },
    { name: t("destWebBrowser"), run: () => openSteam("browser" as SteamPlace) },
    { name: t("destSettings"), run: () => openSteam("settings") },
    { name: t("homeScreenSettings"), run: () => api.openSettings() },
    { name: t("destPower"), run: () => openSteam("power") },
  ];
  const [trk, setTrk] = useRemembered("ps1-track", 0);
  const [cdZone, setCdZone] = useState<"tracks" | "transport">("tracks");
  const [tp, setTp] = useState(1);
  const transport = [
    { label: "⏮", run: () => (setTrk(clamp(trk - 1, 0, tracks.length - 1)), playSound("move")) },
    { label: "▶", run: () => (playSound("select"), tracks[trk].run()) },
    { label: "■", run: () => (setScreen("main"), playSound("back")) },
    { label: "⏭", run: () => (setTrk(clamp(trk + 1, 0, tracks.length - 1)), playSound("move")) },
    { label: words.shuffle, run: () => { const r = games[Math.floor(Math.random() * games.length)]; if (r) (playSound("open"), api.details(r)); } },
  ];

  const options = () => {
    const extra: MenuItem[] = [
      { label: t("presets"), sub: () => themeMenu(s.theme, api.switchTheme, THEMES) },
      { label: t("homeScreenSettings"), action: api.openSettings },
      { label: t("destMainMenu"), action: api.showSteamHome },
    ];
    menu.open(g ? [{ label: t("play"), action: () => api.launch(g) }, { label: t("gameDetails"), action: () => api.details(g) }, { label: t("gameOptions"), action: () => api.nativeMenu(g) }, ...extra] : extra, g?.name);
  };

  const cardButtons = [
    { label: words.play, run: () => g && api.launch(g) },
    { label: words.details, run: () => g && api.details(g) },
    { label: words.options, run: () => (g ? api.nativeMenu(g) : options()) },
    { label: words.exit, run: () => (setScreen("main"), playSound("back")) },
  ];

  const go = (to: Screen) => {
    setScreen(to);
    setZone("blocks");
    setCdZone("tracks");
    playSound("open");
  };

  const moveBlock = (b: string): boolean => {
    const col = block % 3, row = Math.floor(block / 3);
    const count = cardGames(focusedCard).length;
    const pick = (c: number, sideNext = sd) => {
      const n = cardGames(pg * perScreen + sideNext).length;
      const nx = clamp(c, 0, Math.max(0, n - 1));
      setSide(sideNext);
      setBlock(nx);
      playSound("move");
    };
    if (b === "up" && row > 0) return pick(block - 3), true;
    if (b === "down" && block + 3 < count) return pick(block + 3), true;
    if (b === "left") {
      if (col > 0) return pick(block - 1), true;
      if (sd === 1) return (setZone("buttons"), playSound("move")), true;
      if (pg > 0) return (setPage(pg - 1), setSide(perScreen - 1), setBlock(row * 3 + 2), playSound("tab")), true;
      return true;
    }
    if (b === "right") {
      if (col < 2 && block + 1 < count) return pick(block + 1), true;
      if (sd === 0) return (setZone("buttons"), playSound("move")), true;
      if (pg < pages - 1) return (setPage(pg + 1), setSide(0), setBlock(row * 3), playSound("tab")), true;
      return true;
    }
    return false;
  };

  const onInput = (p: Press): boolean => {
    if (menu.handle(p)) return true;
    const b = p.btn;
    if (screen === "boot") {
      booted = true;
      setScreen(st<string>("startScreen") === "card" ? "card" : "main");
      return true;
    }
    if (b === "y" || b === "menu") {
      if (b === "menu" && g) api.nativeMenu(g);
      else options();
      return true;
    }
    if (screen === "main") {
      if (b === "up" || b === "down") {
        const nx = clamp(mainSel + (b === "down" ? 1 : -1), 0, 1);
        if (nx !== mainSel) (setMainSel(nx), playSound("move"));
      } else if (b === "a") go(mainSel === 0 ? "card" : "cd");
      else if (b === "b") return false;
      return true;
    }
    if (screen === "card") {
      if (b === "l1" || b === "r1") {
        const nx = clamp(pg + (b === "r1" ? 1 : -1), 0, pages - 1);
        if (nx !== pg) (setPage(nx), setBlock(0), playSound("tab"));
        return true;
      }
      if (b === "b") return setScreen("main"), playSound("back"), true;
      if (zone === "blocks") {
        if (moveBlock(b)) return true;
        if (b === "a" && g) api.activate(g, () => api.launch(g));
        else if (b === "x" && g) api.launch(g);
        return true;
      }
      if (b === "up" || b === "down") setBtn(clamp(btn + (b === "down" ? 1 : -1), 0, cardButtons.length - 1)), playSound("move");
      else if (b === "left") (setZone("blocks"), setSide(0), setBlock(Math.min(block, Math.max(0, cardGames(pg * perScreen).length - 1))), playSound("move"));
      else if (b === "right" && perScreen === 2 && cardGames(pg * perScreen + 1).length) (setZone("blocks"), setSide(1), setBlock(Math.min(block, cardGames(pg * perScreen + 1).length - 1)), playSound("move"));
      else if (b === "a") cardButtons[btn].run();
      return true;
    }
    // CD player
    if (b === "b") return setScreen("main"), playSound("back"), true;
    if (cdZone === "tracks") {
      const col = trk % 5;
      if (b === "left" && col > 0) (setTrk(trk - 1), playSound("move"));
      else if (b === "right" && col < 4 && trk + 1 < tracks.length) (setTrk(trk + 1), playSound("move"));
      else if (b === "up" && trk >= 5) (setTrk(trk - 5), playSound("move"));
      else if (b === "down") {
        if (trk + 5 < tracks.length) setTrk(trk + 5);
        else setCdZone("transport");
        playSound("move");
      } else if (b === "a") (playSound("select"), tracks[trk].run());
      return true;
    }
    if (b === "left" || b === "right") setTp(clamp(tp + (b === "right" ? 1 : -1), 0, transport.length - 1)), playSound("move");
    else if (b === "up") (setCdZone("tracks"), playSound("move"));
    else if (b === "a") transport[tp].run();
    return true;
  };

  const [c0, c1, c2] = PS1_BACKS[st<string>("background")] ?? PS1_BACKS.blue;
  const hints = screen === "card" ? { a: g ? words.play : t("open"), b: t("back"), y: words.options, l1: words.page, r1: words.page } : screen === "main" ? { a: t("open"), y: words.options } : { a: words.play, b: t("back"), y: words.options };

  return (
    <ThemeRoot onInput={onInput} hints={hints as any}>
      <Stage background="#000">
        <div className="dht-ps1-bg" style={{ position: "absolute", inset: 0, background: `var(--dht-ps1-bg, linear-gradient(180deg, ${c0} 0%, ${c1} 55%, ${c2} 100%))` }} />
        <div style={{ position: "absolute", inset: 0, opacity: 0.18, background: "repeating-linear-gradient(135deg, #fff0 0 22px, #ffffff10 22px 24px)" }} />
        {st<string>("backgroundMotion") === "drift" && (
          <div style={{ position: "absolute", left: -W * 0.2, top: -H * 0.3, width: W * 0.9, height: H * 0.9, borderRadius: "50%", background: "radial-gradient(circle, #9fc0ff33 0%, #9fc0ff00 65%)", animation: animate ? "dhtPs1Drift 18s ease-in-out infinite alternate" : "none" }} />
        )}
        <style>{CSS}</style>

        {screen === "main" && (
          <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 46 }}>
            <div style={{ fontFamily: PS1_FONT, fontWeight: 700, color: "#b8c8f0", letterSpacing: 6, fontSize: 22, textShadow: "2px 2px 0 #000" }}>{words.main}</div>
            {[words.card, words.cd].map((label, i) => (
              <div key={label} className="dht-ps1-button dht-tile" data-selected={mainSel === i} onClick={() => (mainSel === i ? go(i === 0 ? "card" : "cd") : (setMainSel(i), playSound("move")))} style={{ ...ps1Bevel(mainSel === i), width: 520, height: 112, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 40, animation: mainSel === i && animate ? "dhtPs1Glow 1.6s ease-in-out infinite" : "none" }}>
                <MainGlyph kind={i === 0 ? "card" : "cd"} />
                <span style={{ marginLeft: 26 }}>{label}</span>
              </div>
            ))}
          </div>
        )}

        {screen === "card" && (
          <CardScreen
            W={W} H={H} t={words} st={st} animate={animate} perScreen={perScreen} pg={pg} pages={pages} cardCount={cardCount}
            cardGames={cardGames} side={sd} block={block} zone={zone} btn={btn} buttons={cardButtons} g={g}
            titled={(sel) => showTitle(s, "ps1", sel)}
            pickBlock={(sideI, i) => {
              if (zone === "blocks" && sideI === sd && i === block) { const x = cardGames(pg * perScreen + sideI)[i]; if (x) api.activate(x, () => api.launch(x)); }
              else (setZone("blocks"), setSide(sideI), setBlock(i), playSound("move"));
            }}
            pickButton={(i) => (setZone("buttons"), setBtn(i), cardButtons[i].run())}
          />
        )}

        {screen === "cd" && (
          <CdScreen W={W} H={H} t={words} st={st} animate={animate} tracks={tracks} trk={trk} zone={cdZone} tp={tp} transport={transport}
            pickTrack={(i) => (i === trk ? tracks[i].run() : (setTrk(i), setCdZone("tracks"), playSound("move")))}
            pickTransport={(i) => (setTp(i), transport[i].run())}
          />
        )}

        {st<boolean>("clock") && screen !== "boot" && (
          <div style={{ position: "absolute", right: 40, top: 26, fontFamily: PS1_FONT, fontWeight: 700, fontSize: 22, color: "#d8e2ff", letterSpacing: 2, textShadow: "2px 2px 0 #000" }}>{fmtTime(now, s.clock24)}</div>
        )}

        {screen === "boot" && <Boot onDone={() => { booted = true; setScreen(st<string>("startScreen") === "card" ? "card" : "main"); }} />}
        {st<boolean>("scanlines") && <div style={{ position: "absolute", inset: 0, pointerEvents: "none", background: "repeating-linear-gradient(180deg, #0000 0 2px, #00000038 2px 3px)", mixBlendMode: "multiply" }} />}
        <MenuView menu={menu} variant="ps1" />
      </Stage>
    </ThemeRoot>
  );
}

// ───────────── start-up screens ─────────────
// White screen with a drawn emblem, then the black "licensed" screen, like the
// console's two start-up screens. The emblem and wording are our own.
function Boot({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => {
    const a = setTimeout(() => setPhase(1), 2600);
    const b = setTimeout(onDone, 5200);
    return () => (clearTimeout(a), clearTimeout(b));
  }, []);
  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 40 }}>
      {phase === 0 ? (
        <div style={{ position: "absolute", inset: 0, background: "#fff", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "dhtPs1In 900ms ease-out" }}>
          <svg width="200" height="160" viewBox="0 0 200 160" style={{ animation: "dhtPs1Rise 1400ms ease-out" }}>
            <defs>
              <linearGradient id="ps1e1" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c9ccd4" /><stop offset="1" stopColor="#6d7280" /></linearGradient>
              <linearGradient id="ps1e2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#9aa0ad" /><stop offset="1" stopColor="#3d414b" /></linearGradient>
            </defs>
            {/* three stacked slabs: our own emblem */}
            <path d="M100 18 L172 52 L100 86 L28 52 Z" fill="url(#ps1e1)" />
            <path d="M28 64 L100 98 L172 64 L172 80 L100 114 L28 80 Z" fill="url(#ps1e2)" />
            <path d="M28 92 L100 126 L172 92 L172 108 L100 142 L28 108 Z" fill="url(#ps1e2)" opacity=".7" />
          </svg>
          <div style={{ marginTop: 26, fontFamily: PS1_FONT, fontWeight: 700, letterSpacing: 14, fontSize: 30, color: "#4a4e58" }}>DECK HOME</div>
          <div style={{ marginTop: 8, fontFamily: PS1_FONT, letterSpacing: 6, fontSize: 15, color: "#8a8f9a" }}>COMPUTER ENTERTAINMENT</div>
        </div>
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "#000", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", animation: "dhtPs1In 700ms ease-out" }}>
          <svg width="150" height="150" viewBox="0 0 150 150">
            <defs><radialGradient id="ps1d" cx=".5" cy=".5" r=".5"><stop offset=".12" stopColor="#000" /><stop offset=".14" stopColor="#ddd" /><stop offset=".5" stopColor="#888" /><stop offset="1" stopColor="#eee" /></radialGradient></defs>
            <circle cx="75" cy="75" r="70" fill="url(#ps1d)" />
            <circle cx="75" cy="75" r="70" fill="none" stroke="#fff" strokeOpacity=".4" />
          </svg>
          <div style={{ marginTop: 34, fontFamily: PS1_FONT, fontWeight: 700, letterSpacing: 8, fontSize: 22, color: "#e6e6e6" }}>STEAM DECK</div>
          <div style={{ marginTop: 10, fontFamily: PS1_FONT, letterSpacing: 3, fontSize: 14, color: "#8b8b8b" }}>Licensed for ThemeHub</div>
        </div>
      )}
    </div>
  );
}

function MainGlyph({ kind }: { kind: "card" | "cd" }) {
  if (kind === "cd")
    return (
      <svg width="56" height="56" viewBox="0 0 56 56">
        <defs><radialGradient id="ps1g" cx=".5" cy=".5" r=".5"><stop offset=".16" stopColor="#0000" /><stop offset=".18" stopColor="#e8eef8" /><stop offset=".6" stopColor="#9fb0d0" /><stop offset="1" stopColor="#f4f8ff" /></radialGradient></defs>
        <circle cx="28" cy="28" r="25" fill="url(#ps1g)" stroke="#1a2442" strokeWidth="2" />
        <path d="M28 3 A25 25 0 0 1 53 28 L40 28 A12 12 0 0 0 28 16 Z" fill="#ffd2f4" opacity=".45" />
      </svg>
    );
  return (
    <svg width="44" height="58" viewBox="0 0 44 58">
      <path d="M4 2 H32 L42 12 V56 H4 Z" fill="#c9d0de" stroke="#1a2442" strokeWidth="2" />
      <rect x="10" y="8" width="20" height="16" fill="#3b4a72" />
      <path d="M10 46 h4 v8 h-4z M16 46 h4 v8 h-4z M22 46 h4 v8 h-4z M28 46 h4 v8 h-4z" fill="#d9b04a" />
    </svg>
  );
}

// ───────────── Memory Card ─────────────
type Words = typeof WORDS.en;
type StyleFn = ReturnType<typeof styleOf>;

function CardScreen(p: {
  W: number; H: number; t: Words; st: StyleFn; animate: boolean; perScreen: number; pg: number; pages: number; cardCount: number;
  cardGames: (c: number) => Game[]; side: number; block: number; zone: "blocks" | "buttons"; btn: number;
  buttons: { label: string; run: () => void }[]; g?: Game; titled: (sel: boolean) => boolean;
  pickBlock: (side: number, i: number) => void; pickButton: (i: number) => void;
}) {
  const { W, H, t, st, perScreen, pg } = p;
  const B = Math.min(96, Math.floor((H - 330) / 5) - 10); // block size
  const GAP = 10;
  const cardW = B * 3 + GAP * 2 + 36;
  const btnW = 220;
  const total = perScreen * cardW + btnW + 60 * perScreen;
  const x0 = (W - total) / 2;
  const top = 196;
  const cardX = (i: number) => (perScreen === 1 ? x0 : i === 0 ? x0 : x0 + cardW + 60 + btnW + 60);
  const btnX = perScreen === 1 ? x0 + cardW + 60 : x0 + cardW + 60;
  const look = st<string>("iconLook");
  const motion = st<string>("iconMotion");
  const g = p.g;
  return (
    <>
      {/* title and the focused save's info bar */}
      <div style={{ position: "absolute", left: 60, top: 30, fontFamily: PS1_FONT, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: "#d8e2ff", textShadow: "2px 2px 0 #000" }}>{t.card}</div>
      <div className="dht-ps1-info" style={{ position: "absolute", left: x0, width: total, top: 78, height: 92, ...ps1Bevel(false), borderRadius: 6, display: "flex", alignItems: "center", padding: "0 18px", boxSizing: "border-box", gap: 18 }}>
        <div style={{ position: "relative", width: 64, height: 64, flex: "none", background: "#0b1124", border: "2px solid #8892aa" }}>
          {g && <SaveIcon g={g} look={look} bits15={st<string>("colours") === "15bit"} moving={motion !== "still" && p.animate} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 26, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{g ? (p.titled(true) ? g.name : "") : t.empty}</div>
          <div style={{ fontSize: 16, color: "#b8c8f0", marginTop: 6, fontWeight: 400, letterSpacing: 1 }}>{g ? `${t.block}   ·   ${fmtPlaytime(g.playtime, g.lastPlayed, true)}   ·   ${fmtLastPlayed(g.lastPlayed)}` : ""}</div>
        </div>
        <div style={{ fontSize: 15, color: "#b8c8f0", letterSpacing: 1 }}>{p.pages > 1 ? `L1 ◀  ${t.page} ${pg * perScreen + 1}${perScreen === 2 ? `–${Math.min(p.cardCount, pg * 2 + 2)}` : ""} / ${p.cardCount}  ▶ R1` : ""}</div>
      </div>

      {Array.from({ length: perScreen }, (_, sideI) => {
        const c = pg * perScreen + sideI;
        const list = p.cardGames(c);
        return (
          <div key={sideI} className="dht-ps1-card" style={{ position: "absolute", left: cardX(sideI), top, width: cardW, background: "linear-gradient(180deg,#0e1630ee,#060a18ee)", border: "2px solid", borderColor: "#8892aa #1a2032 #121726 #7a849c", borderRadius: 6, padding: "0 18px 18px", boxSizing: "border-box", boxShadow: "0 10px 30px #0009" }}>
            <div style={{ fontFamily: PS1_FONT, fontWeight: 700, fontSize: 18, letterSpacing: 3, color: "#d8e2ff", padding: "12px 0", textAlign: "center", textShadow: "2px 2px 0 #000" }}>{t.card} {c + 1}</div>
            <div style={{ display: "grid", gridTemplateColumns: `repeat(3, ${B}px)`, gap: GAP }}>
              {Array.from({ length: BLOCKS }, (_, i) => {
                const game = list[i];
                const on = p.zone === "blocks" && p.side === sideI && p.block === i;
                return (
                  <div key={i} className="dht-ps1-block dht-tile" data-selected={on} data-name={game?.name} onClick={() => game && p.pickBlock(sideI, i)} style={{ width: B, height: B, boxSizing: "border-box", background: game ? "#141c36" : "#0a0f20", border: `2px solid ${on ? "#fff" : game ? "#4b5a86" : "#252d48"}`, position: "relative", animation: on && p.animate ? "dhtPs1Blink 900ms steps(2) infinite" : "none", boxShadow: on ? "0 0 0 2px #8fd0ff, 0 0 18px #8fd0ffaa" : "none" }}>
                    {game ? (
                      <SaveIcon g={game} look={look} bits15={st<string>("colours") === "15bit"} moving={p.animate && (motion === "anim" || (motion === "selected" && on))} />
                    ) : (
                      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: PS1_FONT, fontSize: 13, letterSpacing: 2, color: "#3b4668" }}>{t.free}</div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* the buttons between the cards */}
      <div style={{ position: "absolute", left: btnX, top: top + 50, width: btnW, display: "flex", flexDirection: "column", gap: 18 }}>
        {p.buttons.map((b, i) => {
          const on = p.zone === "buttons" && p.btn === i;
          return (
            <div key={b.label} className="dht-ps1-button" data-selected={on} onClick={() => p.pickButton(i)} style={{ ...ps1Bevel(on), height: 58, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 21, opacity: !g && i < 3 ? 0.5 : 1 }}>{b.label}</div>
          );
        })}
      </div>
    </>
  );
}

/**
 * A game as a memory-card save icon: its cover shrunk to 16×16 (or 32×32)
 * pixels and, by default, cut down to the console's 15-bit colour with a little
 * ordered dithering. Falls back to full art if the picture can't be read.
 */
function SaveIcon({ g, look, bits15, moving }: { g: Game; look: string; bits15: boolean; moving: boolean }) {
  const res = look === "32" ? 32 : 16;
  const ref = useRef<HTMLCanvasElement>(null);
  const srcs = useMemo(() => [...g.art.portrait, ...g.art.landscape], [g.appid]);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    if (look === "smooth") return;
    let dead = false;
    let i = 0;
    const img = new Image();
    const next = () => (i < srcs.length ? (img.src = srcs[i++]) : setFailed(true));
    img.onerror = () => !dead && next();
    img.onload = () => {
      if (dead || !ref.current) return;
      const cx = ref.current.getContext("2d");
      if (!cx) return;
      const w = img.naturalWidth, h = img.naturalHeight;
      const side = Math.min(w, h);
      cx.imageSmoothingEnabled = true;
      cx.clearRect(0, 0, res, res);
      cx.drawImage(img, (w - side) / 2, (h - side) * 0.22, side, side, 0, 0, res, res);
      if (!bits15) return;
      try {
        const d = cx.getImageData(0, 0, res, res);
        const BAYER = [-2, 1, 3, -1];
        for (let y = 0; y < res; y++)
          for (let x = 0; x < res; x++) {
            const o = (y * res + x) * 4;
            const k = BAYER[(x & 1) + (y & 1) * 2];
            for (let c = 0; c < 3; c++) d.data[o + c] = Math.min(255, Math.max(0, d.data[o + c] + k * 2)) & 0xf8;
          }
        cx.putImageData(d, 0, 0);
      } catch {
        /* a picture from another site can't be read back: keep it in full colour */
      }
    };
    next();
    return () => void (dead = true);
  }, [srcs, res, bits15, look]);
  const anim: CSSProperties = moving ? { animation: "dhtPs1Icon 1.2s steps(3) infinite" } : {};
  if (look === "smooth" || failed)
    return srcs.length && !failed ? (
      <img src={srcs[0]} style={{ position: "absolute", inset: 4, width: "calc(100% - 8px)", height: "calc(100% - 8px)", objectFit: "cover", objectPosition: "50% 22%", ...anim }} />
    ) : (
      <div style={{ position: "absolute", inset: 4, display: "flex", alignItems: "center", justifyContent: "center", background: `hsl(${(g.appid * 47) % 360},55%,35%)`, fontFamily: PS1_FONT, fontWeight: 700, fontSize: 30, color: "#fff", ...anim }}>{g.name.slice(0, 1)}</div>
    );
  return <canvas ref={ref} width={res} height={res} style={{ position: "absolute", inset: 4, width: "calc(100% - 8px)", height: "calc(100% - 8px)", imageRendering: "pixelated", ...anim }} />;
}

// ───────────── CD Player ─────────────
function CdScreen(p: {
  W: number; H: number; t: Words; st: StyleFn; animate: boolean; tracks: Track[]; trk: number; zone: "tracks" | "transport"; tp: number;
  transport: { label: string; run: () => void }[]; pickTrack: (i: number) => void; pickTransport: (i: number) => void;
}) {
  const { W, H, t, st } = p;
  const silver = st<string>("cdColour") === "silver";
  const panelBg = silver ? "linear-gradient(180deg,#c9ced8,#8e95a3 50%,#6d7482 52%,#9aa1ae)" : "linear-gradient(180deg,#3b4f86,#1d2b55 50%,#15204a 52%,#25366a)";
  const ink = silver ? "#1b2030" : "#fff";
  const pw = Math.min(1100, W - 120), ph = 440;
  const px = (W - pw) / 2, py = Math.max(110, (H - ph) / 2 + 20);
  const D = 320;
  return (
    <>
      <div style={{ position: "absolute", left: 60, top: 30, fontFamily: PS1_FONT, fontWeight: 700, fontSize: 26, letterSpacing: 4, color: "#d8e2ff", textShadow: "2px 2px 0 #000" }}>{t.cd}</div>
      <div className="dht-ps1-cd" style={{ position: "absolute", left: px, top: py, width: pw, height: ph, background: panelBg, border: "2px solid", borderColor: silver ? "#f2f4f8 #4b505c #3a3e48 #e6e9ef" : "#9db0e0 #0d1530 #0a1026 #8ea2d6", borderRadius: 10, boxShadow: "0 14px 40px #000b", fontFamily: PS1_FONT, color: ink }}>
        {/* disc */}
        <div style={{ position: "absolute", left: 40, top: (ph - D) / 2, width: D, height: D, borderRadius: "50%", background: "conic-gradient(from 0deg,#e9eef7,#b9c5dc,#f8d9f0,#cfe8f8,#f4f0c8,#d2d9ea,#e9eef7)", boxShadow: "0 0 0 3px #0006, 0 10px 30px #0008", animation: st<string>("disc") === "spin" && p.animate ? "dhtPs1Spin 3.2s linear infinite" : "none" }}>
          <div style={{ position: "absolute", inset: D * 0.36, borderRadius: "50%", background: "radial-gradient(circle,#0000 0 30%,#d8dde8 31% 60%,#9aa3b6 61%)", boxShadow: "inset 0 0 0 2px #0004" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: "repeating-radial-gradient(circle,#ffffff00 0 3px,#ffffff18 3px 4px)" }} />
        </div>
        {/* display */}
        <div style={{ position: "absolute", left: D + 90, right: 40, top: 34, height: 74, background: "#05140c", border: "2px solid #000", borderRadius: 4, display: "flex", alignItems: "center", padding: "0 20px", gap: 26, color: "#7dffb0", fontFamily: "'Courier New', monospace", fontWeight: 700, textShadow: "0 0 8px #3dff8a88" }}>
          <span style={{ fontSize: 18, opacity: 0.8 }}>{t.track}</span>
          <span style={{ fontSize: 40, letterSpacing: 2 }}>{String(p.trk + 1).padStart(2, "0")}</span>
          <span style={{ fontSize: 24, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.tracks[p.trk]?.name.toUpperCase()}</span>
        </div>
        {/* track buttons */}
        <div style={{ position: "absolute", left: D + 90, right: 40, top: 136, display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12 }}>
          {p.tracks.map((tr, i) => {
            const on = p.zone === "tracks" && p.trk === i;
            return (
              <div key={tr.name} className="dht-ps1-track dht-tile" data-selected={on} data-name={tr.name} onClick={() => p.pickTrack(i)} style={{ ...ps1Bevel(on), height: 62, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>{String(i + 1).padStart(2, "0")}</div>
            );
          })}
        </div>
        {/* transport */}
        <div style={{ position: "absolute", left: D + 90, right: 40, top: 316, display: "flex", gap: 12 }}>
          {p.transport.map((b, i) => {
            const on = p.zone === "transport" && p.tp === i;
            return (
              <div key={b.label} className="dht-ps1-button" data-selected={on} onClick={() => p.pickTransport(i)} style={{ ...ps1Bevel(on), flex: i === 4 ? 2 : 1, height: 58, borderRadius: 29, display: "flex", alignItems: "center", justifyContent: "center", fontSize: i === 4 ? 18 : 24 }}>{b.label}</div>
            );
          })}
        </div>
      </div>
    </>
  );
}

const CSS = `
@keyframes dhtPs1Drift { from { transform: translate(0,0) } to { transform: translate(55%, 45%) } }
@keyframes dhtPs1Glow { 0%,100% { filter: brightness(1) } 50% { filter: brightness(1.22) } }
@keyframes dhtPs1Blink { 0% { border-color: #fff } 100% { border-color: #8fd0ff } }
@keyframes dhtPs1Icon { 0% { filter: brightness(1) } 33% { filter: brightness(1.18) saturate(1.2) } 66% { filter: brightness(.88) } 100% { filter: brightness(1) } }
@keyframes dhtPs1Spin { to { transform: rotate(360deg) } }
@keyframes dhtPs1In { from { opacity: 0 } to { opacity: 1 } }
@keyframes dhtPs1Rise { from { opacity: 0; transform: translateY(18px) } to { opacity: 1; transform: none } }
`;
