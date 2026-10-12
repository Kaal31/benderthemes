import { IISU_PAGE_LOOKS } from "./themes/iisuStyles";
import { N3DS_PAGE_LOOKS, SWITCH_PAGE_LOOKS } from "./themes/nintendoPageLooks";
// Page looks: the friends, trophies / achievements, downloads, settings… pages
// laid out the way each console drew its own screens. The page itself is shared
// (src/destinations.tsx); these rules only restyle it per theme, so a page keeps
// working whichever theme a preset gives it (Theme options → Pages).
//
// Consoles that never had a page (no friends list on the PS2, no trophies on the
// Wii) keep the theme's recoloured list for it.
const D = (theme: string) => `.dht-destination[data-theme=${theme}]`;
const list = (theme: string, place: string) => `${D(theme)} .dht-page-list[data-place=${place}]`;
const grid = (sel: string, cols: number, h: number) =>
  `${sel}{display:grid;grid-template-columns:repeat(${cols},minmax(0,1fr));gap:16px;align-content:start}` +
  `${sel} .dht-destination-row{flex-direction:column;justify-content:center;text-align:center!important;min-height:${h}px!important;margin:0!important;gap:12px!important}` +
  `${sel} .dht-row-sub{font-size:15px!important}`;
const avatar = (sel: string, ring: string, bg: string) =>
  `${sel} .dht-row-icon{display:grid;place-items:center;width:84px;height:84px;border-radius:50%;background:${bg};box-shadow:0 0 0 3px ${ring}}` +
  `${sel} .dht-destination-row[data-state=on] .dht-row-icon{box-shadow:0 0 0 3px ${ring},inset 0 0 0 4px #4bd16a}`;
/** Trophy / achievement rows: earned ones in the console's colour, locked ones dimmed. */
const earned = (theme: string, on: string, off = "0.45") =>
  `${list(theme, "achievements")} .dht-destination-row[data-state=on] .dht-row-icon{color:${on};filter:drop-shadow(0 0 6px ${on}88)}` +
  `${list(theme, "achievements")} .dht-destination-row[data-state=off]{opacity:${off}}`;

export const PAGE_LOOKS = [
  // wrappers other looks may turn into columns (Switch, 3DS); neutral everywhere else
  `.dht-page-main,.dht-page-content{display:contents}`,
  // ── PS3 / PSP: an XMB column, no boxes; the focused row is larger and glows ──
  ...["ps3", "psp"].flatMap((t) => [
    `${D(t)} .dht-page-back,${D(t)} .dht-page-tabs{display:none!important}`,
    `${D(t)} .dht-page-title{font-size:26px!important;opacity:.85}`,
    `${D(t)} .dht-page-list{padding-left:16%!important}`,
    `${D(t)} .dht-destination-row{background:transparent!important;outline:none!important;color:#fff!important;min-height:58px!important;margin:0!important;opacity:.62;transition:opacity .15s,transform .15s}`,
    `${D(t)} .dht-destination-row[data-selected=true]{opacity:1;transform:scale(1.08);transform-origin:left center;text-shadow:0 0 12px #fff8}`,
    `${D(t)} .dht-destination-row[data-selected=true] .dht-row-icon{filter:drop-shadow(0 0 8px #fffb)}`,
    earned(t, "#e9c45a", "0.5"),
  ]),
  // ── PS4: friends as cards with round avatars; trophies as dark bars ──
  `${D("ps4")} .dht-page-back{display:none!important}`,
  `${D("ps4")} .dht-page-tabs button{background:transparent!important;border:0!important;border-bottom:3px solid transparent!important;border-radius:0!important;box-shadow:none!important;opacity:.7}`,
  `${D("ps4")} .dht-page-tabs button[aria-current=page]{border-bottom-color:#fff!important;opacity:1;outline:none!important}`,
  grid(list("ps4", "friends"), 4, 210),
  avatar(list("ps4", "friends"), "#ffffff40", "linear-gradient(135deg,#5aa0ff,#2a5bd0)"),
  `${list("ps4", "friends")} .dht-destination-row{background:rgba(0,20,60,.55)!important;border-radius:4px!important}`,
  `${list("ps4", "friends")} .dht-destination-row[data-selected=true]{background:rgba(0,40,110,.8)!important;box-shadow:0 0 0 3px #fff,0 0 24px #7ab8ff!important;color:#fff!important;outline:none!important}`,
  `${list("ps4", "achievements")} .dht-destination-row{background:rgba(0,0,0,.35)!important;border-radius:2px!important;min-height:76px!important}`,
  `${D("ps4")} .dht-page-list .dht-destination-row[data-selected=true]{background:rgba(0,40,110,.8)!important;color:#fff!important;box-shadow:0 0 0 3px #fff,0 0 24px #7ab8ff!important;outline:none!important}`,
  earned("ps4", "#d8b35a"),
  // ── PS5: rounded cards, pill tabs ──
  `${D("ps5")} .dht-page-back{display:none!important}`,
  `${D("ps5")} .dht-page-tabs button{border-radius:20px!important;border:0!important;background:transparent!important;box-shadow:none!important}`,
  `${D("ps5")} .dht-page-tabs button[aria-current=page]{background:#fff!important;color:#000!important;outline:none!important}`,
  grid(list("ps5", "friends"), 4, 220),
  avatar(list("ps5", "friends"), "#ffffff30", "#2b3446"),
  `${D("ps5")} .dht-page-list .dht-destination-row{border-radius:16px!important;background:rgba(30,34,42,.75)!important}`,
  `${D("ps5")} .dht-page-list .dht-destination-row[data-selected=true]{background:rgba(60,66,80,.95)!important;box-shadow:0 0 0 3px #fff!important;color:#fff!important;outline:none!important}`,
  earned("ps5", "#e0c06a"),
  // ── PS Vita: a white app list under a blue title bar ──
  `${D("vita")} .dht-page-header{background:linear-gradient(#3aa0ff,#0b6fd8);margin:-2% -6.5% 0;padding:10px 6.5%;color:#fff!important}`,
  `${D("vita")} .dht-page-list{background:#fff;border-radius:6px;padding:0!important}`,
  `${D("vita")} .dht-page-list .dht-destination-row{background:#fff!important;color:#1a2a40!important;border-radius:0!important;border-bottom:1px solid #d8dee8!important;margin:0!important;outline:none!important}`,
  `${D("vita")} .dht-page-list .dht-destination-row[data-selected=true]{background:linear-gradient(#e6f3ff,#cfe6ff)!important}`,
  `${D("vita")} .dht-page-list .dht-row-sub{color:#5c6f8a}`,
  avatar(list("vita", "friends"), "#c9d6e6", "#eef4fb"),
  `${list("vita", "friends")} .dht-row-icon{width:56px;height:56px;color:#2b6cc4}`,
  earned("vita", "#c99a2e"),
  // ── Xbox 360: Metro tiles, Blades rows, NXE and Kinect rounded panels; achievements with a G score ──
  `${D("x360")}[data-variant=metro] .dht-page-title{text-transform:lowercase;font-weight:300!important;font-size:48px!important}`,
  grid(`${D("x360")}[data-variant=metro] .dht-page-list[data-place=friends]`, 4, 180),
  `${D("x360")}[data-variant=metro] .dht-page-list .dht-destination-row{border-radius:0!important}`,
  `${D("x360")}[data-variant=metro] .dht-page-list .dht-destination-row[data-selected=true]{background:#107c10!important;color:#fff!important;outline:none!important;box-shadow:0 0 0 3px #fff,0 0 0 5px #107c10!important}`,
  `${D("x360")}[data-variant=blades] .dht-page-list .dht-destination-row{border-radius:0!important;margin:0!important;border-bottom:1px solid #0002!important}`,
  `${D("x360")}[data-variant=blades] .dht-page-list .dht-destination-row[data-selected=true]{background:linear-gradient(90deg,#ff9a2a,#e46c0a)!important;color:#fff!important;outline:none!important}`,
  ...["nxe", "kinect"].map((v) => `${D("x360")}[data-variant=${v}] .dht-page-list .dht-destination-row{border-radius:12px!important}`),
  `${D("x360")} .dht-page-list[data-place=achievements] .dht-destination-row[data-state=on] .dht-row-sub::after{content:"  G";font-weight:700;color:#8ee03a}`,
  earned("x360", "#8ee03a"),
  // ── original Xbox: green text rows with an orb bullet (friends only on the Live dashboard) ──
  `${D("xbox")} .dht-page-title,${D("xbox")} .dht-page-tabs button{text-transform:uppercase;letter-spacing:1px}`,
  `${D("xbox")} .dht-page-list .dht-destination-row{background:transparent!important;color:#b6f25a!important;border-radius:22px!important;outline:none!important;text-transform:uppercase}`,
  `${D("xbox")} .dht-page-list .dht-destination-row[data-selected=true]{background:radial-gradient(ellipse at 20% 50%,#d8ff7a,#6cc31c 60%,#2c6a08)!important;color:#0f2c04!important;box-shadow:0 0 18px #aaff3c99!important}`,
  // ── Wii / Wii U: rounded white cards; the Wii U friend list is a grid of Mii cards ──
  ...["wii", "wiiu"].flatMap((t) => [
    `${D(t)} .dht-page-list .dht-destination-row{border-radius:${t === "wii" ? 22 : 16}px!important;background:linear-gradient(#fff,#edf3f7)!important;color:#536c7b!important;outline:none!important;box-shadow:0 2px 5px #879dab33!important}`,
    `${D(t)} .dht-page-list .dht-destination-row[data-selected=true]{box-shadow:0 0 0 4px #37bce9,0 4px 14px #70b9d666!important}`,
    grid(list(t, "friends"), t === "wii" ? 4 : 5, 190),
    avatar(list(t, "friends"), "#d6e6ef", "#f4f9fc"),
    `${list(t, "friends")} .dht-row-icon{color:#37a6d0}`,
  ]),
  // ── Windows Aero: an Explorer list view in a glass window ──
  ...["aero", "aero2"].flatMap((t) => [
    `${D(t)} .dht-page-header{background:linear-gradient(#ffffff66,#ffffff1a);border:1px solid #ffffff80;border-radius:8px 8px 0 0;padding:6px 14px;box-shadow:inset 0 1px #fff8}`,
    `${D(t)} .dht-page-title{font-size:24px!important;text-shadow:0 0 10px #fff,0 0 2px #fff;color:#000!important}`,
    `${D(t)} .dht-page-list{background:#fff;border:1px solid #8aa6c8;margin-top:-18px}`,
    `${D(t)} .dht-page-list .dht-destination-row{background:#fff!important;color:#1e395b!important;border:1px solid transparent!important;border-radius:3px!important;margin:2px 0!important;min-height:52px!important;outline:none!important}`,
    `${D(t)} .dht-page-list .dht-destination-row[data-selected=true]{background:linear-gradient(#f1f7fe,#d5e7fc)!important;border-color:#7da2ce!important}`,
    `${D(t)} .dht-page-list .dht-row-sub{color:#5a6f8a}`,
    `${D(t)} .dht-page-list .dht-row-label{font-size:19px!important}`,
  ]),
  // ── PS2: the browser's floating rows, no boxes ──
  `${D("ps2")} .dht-page-list .dht-destination-row{background:transparent!important;outline:none!important;opacity:.7}`,
  `${D("ps2")} .dht-page-list .dht-destination-row[data-selected=true]{opacity:1;background:linear-gradient(90deg,rgba(80,110,255,.45),rgba(80,110,255,0))!important;text-shadow:0 0 10px #8fa6ff}`,
  IISU_PAGE_LOOKS,
  SWITCH_PAGE_LOOKS,
  N3DS_PAGE_LOOKS,
].join("\n");
