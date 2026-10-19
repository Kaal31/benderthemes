// Page looks for the Nintendo Switch and Nintendo 3DS: the library, game details, achievements, friends,
// downloads, settings and web browser pages (src/destinations.tsx) drawn the way those consoles draw their own
// system screens, plus their touches on the shared music / captures screens (MEDIA_CSS in src/mediaCenter.tsx)
// and the themed store (storeSkin in src/storeView.tsx). See src/pageLooks.ts for the other consoles.
//
// Both looks lay the page frame out as a CSS grid, so the Back button (in the page header in the markup) can
// sit in the bottom bar without absolute positioning: the header becomes `display:contents` and its title and
// Back button are placed in grid areas of their own.
// Hooks: .dht-page-frame, .dht-page-main (tab column / strip + content), .dht-page-content, .dht-page-body,
// .dht-page-footer, plus the older .dht-page-* / .dht-destination-row ones (CSS-THEMING.md, "Pages").
// Variables: Switch --dht-switch-accent / --dht-switch-page-bg / --dht-switch-store-bg; 3DS --dht-n3ds-cursor,
// --dht-n3ds-page-bg, --dht-n3ds-store-bg, --dht-n3ds-tile, --dht-n3ds-library-rows.
const SW = ".dht-destination[data-theme=switch]";
const N3 = ".dht-destination[data-theme=n3ds]";
const swList = (...places: string[]) => places.map((p) => `${SW} .dht-page-list[data-place=${p}]`).join(",");
const n3List = (...places: string[]) => places.map((p) => `${N3} .dht-page-list[data-place=${p}]`).join(",");
const each = (sel: string, tail: string) => sel.split(",").map((s) => s + tail).join(",");
const FONT_SW = '"Nintendo Switch UI","Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
const FONT_N3 = '"Nunito","Varela Round","Hiragino Maru Gothic ProN","Segoe UI",system-ui,sans-serif';
/** The 3DS bottom screen's dotted grey. */
const N3_BG = "radial-gradient(circle,#d6d9e0 1.4px,transparent 1.8px) 0 0/16px 16px,#eceef2";

export const SWITCH_PAGE_LOOKS = [
  // ── the frame: header line on top, footer line with the button hints at the bottom (System Settings / user page) ──
  `${SW}{--sw-accent:var(--dht-switch-accent,#00c3e3);--sw-blue:#3246e6;--sw-ink:#2d2d2d;--sw-line:#d2d2d2}`,
  `${SW}[data-switch-style=dark]{--sw-accent:var(--dht-switch-accent,#e60012);--sw-blue:#e60012;--sw-ink:#ffffff;--sw-sub:#b0b0b0;--sw-line:#3a3a3a;--sw-card:#2d2d2d;--dht-switch-page-bg:#1a1a1a}`,
  `${SW}[data-switch-style=dark] .dht-page-frame{background:var(--dht-switch-page-bg,#1a1a1a)!important;color:#ffffff!important}`,
  `${SW}[data-switch-style=dark] .dht-page-title{border-bottom-color:#3a3a3a!important;color:#ffffff!important}`,
  `${SW}[data-switch-style=dark] .dht-page-footer{border-top-color:#3a3a3a!important;color:#ffffff!important}`,
  `${SW}[data-switch-style=dark] .dht-page-subtitle{color:#b0b0b0!important}`,
  `${SW}[data-switch-style=dark] .dht-page-tabs button{color:#ffffff!important;border-bottom-color:#3a3a3a!important}`,
  `${SW}[data-switch-style=dark] .dht-page-tabs button[aria-current=page]{color:#e60012!important}`,
  `${SW}[data-switch-style=dark] .dht-page-tabs button[aria-current=page]::before{background:#e60012!important}`,
  `${SW}[data-switch-style=dark] .dht-page-list .dht-destination-row{background:#2d2d2d!important;color:#ffffff!important;box-shadow:0 1px 3px #00000050!important}`,
  `${SW}[data-switch-style=dark] .dht-page-list .dht-destination-row[data-selected=true]{box-shadow:0 0 0 2px #2d2d2d,0 0 0 5px var(--sw-accent),0 4px 14px #00000060!important}`,
  `${SW}[data-switch-style=dark] .dht-page-list .dht-destination-row[data-selected=true]::before{background:#e60012!important}`,
  `${SW}[data-switch-style=dark] .dht-page-list .dht-destination-row[data-selected=true] .dht-row-label{color:#e60012!important}`,
  `${SW}[data-switch-style=dark] .dht-page-list .dht-row-sub{color:#b0b0b0!important}`,
  `${SW}[data-switch-style=dark] .dht-page-list .dht-row-icon{color:#ffffff!important}`,
  `${SW}[data-switch-style=dark] .dht-page-list>p{color:#b0b0b0!important}`,
  `${SW}[data-switch-style=dark] :is(${swList("settings", "qam", "power")}) .dht-destination-row{border-bottom-color:#3a3a3a!important}`,
  `${SW}[data-switch-style=dark] :is(${swList("settings", "qam", "power")}) .dht-destination-row[data-selected=true]{background:#2d2d2d!important;box-shadow:0 0 0 2px #2d2d2d,0 0 0 5px var(--sw-accent)!important}`,
  `${SW}[data-switch-style=dark] .dht-row-progress{background:#3a3a3a!important}`,
  `${SW}[data-switch-style=dark] :is(${each(swList("library", "search"), " .dht-row-text")}){background:#2d2d2d!important;color:#ffffff!important;box-shadow:0 2px 8px #00000060!important}`,
  `${SW}[data-switch-style=dark] :is(${each(swList("library", "search"), " .dht-row-label")}){color:#e60012!important}`,
  `${SW}[data-switch-style=dark] :is(${each(swList("library", "search"), " .dht-destination-row[data-selected=true] .dht-row-icon>*")}){box-shadow:0 0 0 2px #2d2d2d,0 0 0 6px var(--sw-accent),0 6px 16px #00000070!important}`,
  `${SW}[data-switch-style=dark] .dht-page-content>input,${SW}[data-switch-style=dark] .dht-page-content form input{background:#2d2d2d!important;color:#ffffff!important;border-color:#444!important}`,
  `${SW}[data-switch-style=dark] .dht-page-content form button,${SW}[data-switch-style=dark] .dht-page-content>div>button{background:#2d2d2d!important;color:#ffffff!important}`,
  `${SW}[data-switch-style=dark] .dht-page-back::after{color:#ffffff!important}`,
  `${SW}[data-switch-style=dark] .dht-page-footer::after{color:#ffffff!important}`,
  `${SW}[data-switch-style=dark] .dht-page-footer::before{background:linear-gradient(#2d2d2d,#2d2d2d) 50% 50%/24px 12px no-repeat,#ffffff!important}`,
  `${SW}[data-switch-style=dark] .dht-page-title::before{background:radial-gradient(circle at 50% 36%,#2d2d2d 0 20%,transparent 21%),radial-gradient(ellipse 46% 40% at 50% 100%,#2d2d2d 0 98%,transparent 100%),linear-gradient(135deg,#00dcd4,#e60012)!important;box-shadow:0 0 0 2px #2d2d2d,0 0 0 3px #555!important}`,
  `${SW}[data-switch-style=dark]:is([data-place=library],[data-place=search]) .dht-page-title::before{background:linear-gradient(#ffffff,#ffffff) 0 0/15px 15px no-repeat,linear-gradient(#ffffff,#ffffff) 100% 0/15px 15px no-repeat,linear-gradient(#ffffff,#ffffff) 0 100%/15px 15px no-repeat,linear-gradient(#ffffff,#ffffff) 100% 100%/15px 15px no-repeat!important;opacity:1!important}`,

  `${SW} .dht-page-frame{inset:0!important;padding:0 2.4%!important;gap:0!important;display:grid!important;grid-template-columns:minmax(0,1fr);grid-template-rows:96px minmax(0,1fr) 78px;grid-template-areas:"head" "main" "foot";background:var(--dht-switch-page-bg,#ebebeb);color:var(--sw-ink)!important;font-family:${FONT_SW}!important}`,
  `${SW} .dht-page-header{display:contents!important}`,
  `${SW} .dht-page-title{grid-area:head;display:flex;align-items:center;gap:18px;padding:0 0 0 2.6%;border-bottom:1px solid var(--sw-ink);font-size:31px!important;font-weight:400!important;color:var(--sw-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`,
  // the user page's round profile picture in front of the title; the All Software page has its grid symbol
  `${SW} .dht-page-title::before{content:"";flex:none;width:54px;height:54px;border-radius:50%;background:radial-gradient(circle at 50% 36%,#fff 0 20%,transparent 21%),radial-gradient(ellipse 46% 40% at 50% 100%,#fff 0 98%,transparent 100%),linear-gradient(135deg,#ffb347,#e8423f);box-shadow:0 0 0 2px #fff,0 0 0 3px #c4c4c4}`,
  `${SW}:is([data-place=library],[data-place=search]) .dht-page-title::before{width:34px;height:34px;border-radius:0;box-shadow:none;background:linear-gradient(var(--sw-ink),var(--sw-ink)) 0 0/15px 15px no-repeat,linear-gradient(var(--sw-ink),var(--sw-ink)) 100% 0/15px 15px no-repeat,linear-gradient(var(--sw-ink),var(--sw-ink)) 0 100%/15px 15px no-repeat,linear-gradient(var(--sw-ink),var(--sw-ink)) 100% 100%/15px 15px no-repeat;opacity:.85}`,
  `${SW} .dht-page-main{grid-area:main;display:flex;min-height:0;gap:3.5%;padding:22px 2.6% 0 5.2%}`,
  `${SW} .dht-page-content{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;gap:12px}`,
  `${SW} .dht-page-subtitle{font-size:18px!important;color:#6c6c6c!important}`,
  `${SW} .dht-page-footer{grid-area:foot;position:relative;display:flex;align-items:center;justify-content:flex-end;padding:0 2.6%;border-top:1px solid var(--sw-ink);font-size:0!important;color:var(--sw-ink)!important}`,
  `${SW} .dht-page-footer::after{content:"\\24B6\\2002 OK";font-size:24px}`,
  // the handheld symbol at the footer's left end: a screen between two Joy-Con
  `${SW} .dht-page-footer::before{content:"";position:absolute;left:2.6%;top:50%;width:52px;height:24px;margin-top:-12px;border-radius:7px;background:linear-gradient(#fff,#fff) 50% 50%/24px 12px no-repeat,var(--sw-ink)}`,
  `${SW} .dht-page-back{grid-area:foot;justify-self:end;align-self:center;margin-right:calc(2.6% + 92px)!important;position:relative;z-index:1;width:auto!important;min-height:0!important;padding:4px 6px!important;background:none!important;border:0!important;box-shadow:none!important;outline:none!important;color:var(--sw-ink)!important;font-size:0!important}`,
  `${SW} .dht-page-back::after{content:"\\24B7\\2002 Back";font-size:24px}`,
  // ── the left column: the page switcher as the settings / user page category list ──
  `${SW} .dht-page-tabs{flex-direction:column!important;flex-wrap:nowrap!important;width:26%;max-width:300px;flex:none;gap:0!important;padding-top:2px}`,
  `${SW} .dht-page-tabs button{position:relative;background:transparent!important;border:0!important;box-shadow:none!important;outline:none!important;border-radius:0!important;color:var(--sw-ink)!important;font-size:24px;text-align:left;padding:18px 20px!important;border-bottom:1px solid var(--sw-line)!important}`,
  `${SW} .dht-page-tabs button[aria-current=page]{color:var(--sw-blue)!important}`,
  `${SW} .dht-page-tabs button[aria-current=page]::before{content:"";position:absolute;left:6px;top:14px;bottom:14px;width:4px;background:var(--sw-blue)}`,
  `${SW}:is([data-place=library],[data-place=search]) .dht-page-tabs{display:none!important}`,
  `${SW}:is([data-place=library],[data-place=search]) .dht-page-main{padding-left:2.6%}`,
  // ── lists: white rounded rows; the focused one in the thin teal frame with the blue bar ──
  `${SW} .dht-page-body{gap:3%!important}`,
  `${SW} .dht-page-list{padding:6px 8px 6px 6px!important}`,
  `${SW} .dht-page-list .dht-destination-row{flex:none;position:relative;background:#fff!important;color:var(--sw-ink)!important;border:0!important;border-radius:8px!important;margin:0 0 8px!important;min-height:74px!important;outline:none!important;box-shadow:0 1px 2px #0000001f!important}`,
  `${SW} .dht-page-list .dht-destination-row[data-selected=true]{box-shadow:0 0 0 2px #fff,0 0 0 5px var(--sw-accent),0 4px 14px #0000002a!important;z-index:1}`,
  `${SW} .dht-page-list .dht-destination-row[data-selected=true]::before{content:"";position:absolute;left:8px;top:14px;bottom:14px;width:4px;border-radius:2px;background:var(--sw-blue)}`,
  `${SW} .dht-page-list .dht-destination-row[data-selected=true] .dht-row-label{color:var(--sw-blue)}`,
  `${SW} .dht-page-list .dht-row-label{font-size:23px!important}`,
  `${SW} .dht-page-list .dht-row-sub{color:#7b7b7b!important;font-size:17px!important}`,
  `${SW} .dht-page-list .dht-row-icon{color:#4a4a4a}`,
  `${SW} .dht-page-list>p{color:#6c6c6c}`,
  // settings: the System Settings list (flat rows on hairlines, no cards)
  `${each(swList("settings", "qam", "power"), " .dht-destination-row")}{background:transparent!important;border-radius:0!important;border-bottom:1px solid var(--sw-line)!important;box-shadow:none!important;min-height:68px!important;margin:0!important}`,
  `${each(swList("settings", "qam", "power"), " .dht-destination-row[data-selected=true]")}{background:#fff!important;border-radius:2px!important;box-shadow:0 0 0 2px #fff,0 0 0 5px var(--sw-accent)!important}`,
  // friends: the Friend List with round profile pictures; online ones get the green dot and blue status
  `${swList("friends")} .dht-row-icon{position:relative;display:grid;place-items:center;width:58px;height:58px;border-radius:50%;background:linear-gradient(135deg,#d8d8d8,#bdbdbd);color:#fff;flex:none}`,
  `${swList("friends")} .dht-destination-row[data-state=on] .dht-row-icon::after{content:"";position:absolute;right:-2px;bottom:-2px;width:16px;height:16px;border-radius:50%;background:#4bd16a;box-shadow:0 0 0 3px #fff}`,
  `${swList("friends")} .dht-destination-row[data-state=on] .dht-row-sub{color:var(--sw-blue)!important}`,
  // achievements: the play activity list, earned ones in colour, locked ones greyed
  `${swList("achievements")} .dht-destination-row[data-state=on] .dht-row-icon{color:#e0a21a}`,
  `${swList("achievements")} .dht-destination-row[data-state=off]{opacity:.6}`,
  // downloads: the Data Management bar
  `${SW} .dht-row-progress{background:#dcdcdc!important;height:8px!important}`,
  `${SW} .dht-row-progress i{background:var(--sw-accent)!important}`,
  // ── library: the All Software grid; square covers six across with thin gaps, the focused one in the thick teal
  // frame with its name on a white tag above it (the tag of the last columns ends at the cover's right edge) ──
  `${swList("library", "search")}{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px;align-content:start;grid-auto-rows:max-content;padding:48px 10px 10px!important}`,
  `${each(swList("library", "search"), " .dht-destination-row")}{position:relative;display:block;min-height:0!important;min-width:0;margin:0!important;padding:0!important;background:transparent!important;box-shadow:none!important;border-radius:0!important;overflow:visible}`,
  `${each(swList("library", "search"), " .dht-row-icon")}{display:block;width:100%}`,
  `${each(swList("library", "search"), " .dht-row-icon>*")}{width:100%!important;height:auto!important;aspect-ratio:1/1;object-fit:cover;border-radius:0!important;display:block}`,
  `${each(swList("library", "search"), " .dht-row-text")}{display:none;position:absolute;left:-6px;bottom:calc(100% + 9px);z-index:3;width:max-content;max-width:min(460px,330%);padding:5px 14px 5px 34px;background:#fff;border-radius:4px;box-shadow:0 1px 4px #0003;pointer-events:none}`,
  `${each(swList("library", "search"), " .dht-row-text::before")}{content:"";position:absolute;left:12px;top:50%;width:11px;height:15px;margin-top:-7.5px;border-radius:2px;background:var(--sw-accent)}`,
  `${each(swList("library", "search"), " .dht-row-label")}{display:block;font-size:23px!important;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#00a6c8!important}`,
  `${each(swList("library", "search"), " .dht-row-sub")}{display:none!important}`,
  `${each(swList("library", "search"), " .dht-destination-row[data-selected=true]")}{box-shadow:none!important;z-index:2}`,
  `${each(swList("library", "search"), " .dht-destination-row[data-selected=true] .dht-row-text")}{display:block}`,
  `${each(swList("library", "search"), " .dht-destination-row:is(:nth-child(6n),:nth-child(6n-1)) .dht-row-text")}{left:auto;right:-6px}`,
  `${each(swList("library", "search"), " .dht-destination-row[data-selected=true] .dht-row-icon>*")}{box-shadow:0 0 0 2px #fff,0 0 0 6px var(--sw-accent),0 6px 16px #0003!important}`,
  `${each(swList("library", "search"), " .dht-destination-row[data-selected=true]::before")}{display:none}`,
  `${SW}:is([data-place=library],[data-place=search]) .dht-page-footer::after{content:"\\24B6\\2002 Start"}`,
  `${SW}:is([data-place=library],[data-place=search]) .dht-page-back{margin-right:calc(2.6% + 118px)!important}`,
  // search field, game cover, browser bar
  `${SW} .dht-page-content>input,${SW} .dht-page-content form input{background:#fff!important;color:var(--sw-ink)!important;border:2px solid #cfcfcf!important;border-radius:24px!important;padding:10px 22px!important;font-size:20px!important;outline:none}`,
  `${SW} .dht-page-content>input:focus,${SW} .dht-page-content form input:focus{border-color:var(--sw-accent)!important}`,
  `${SW} .dht-page-body>:first-child:not(.dht-page-list){border-radius:0!important;box-shadow:0 2px 8px #0003}`,
  `${SW} .dht-page-content form button,${SW} .dht-page-content>div>button{background:#fff!important;color:var(--sw-ink)!important;border:0!important;border-radius:24px!important;box-shadow:0 1px 2px #0002!important;padding:10px 26px!important}`,
  `${SW} iframe{border-radius:4px;box-shadow:0 1px 3px #0003}`,
].join("\n");

export const N3DS_PAGE_LOOKS = [
  // ── the frame: like the HOME Menu's bottom screen: tab strip on top, rounded white buttons, the Back / OK bar
  // at the bottom. "Top screen: hide" (data-n3ds-top=hide) uses the whole display; with the top screen shown the
  // title sits on a top screen above the page, both in the console's 5:3 / 4:3 proportions. ──
  `${N3}{--n3-accent:var(--dht-n3ds-cursor,#3fe3b5);--n3-fill:#e3fbf3;--n3-edge:#c4c8d2;--n3-ink:#4a4d54;--n3-sub:#7b8494}`,
  `${N3} .dht-page-frame{inset:0!important;padding:0!important;gap:0!important;display:grid!important;grid-template-columns:minmax(0,1fr);grid-template-rows:62px minmax(0,1fr) 66px;grid-template-areas:"head" "main" "bar";background:var(--dht-n3ds-page-bg,${N3_BG});color:var(--n3-ink)!important;font-family:${FONT_N3}!important}`,
  `${N3} .dht-page-header{display:contents!important}`,
  `${N3} .dht-page-title{grid-area:head;display:flex;align-items:center;justify-content:center;margin:0;padding:0 4%;background:linear-gradient(#fbfbfc,#eceef2);box-shadow:inset 0 -2px 0 var(--n3-edge);font-size:26px!important;font-weight:800!important;color:var(--n3-ink);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}`,
  `${N3} .dht-page-main{grid-area:main;display:flex;flex-direction:column;min-height:0;gap:0}`,
  `${N3} .dht-page-content{display:flex;flex-direction:column;flex:1;min-width:0;min-height:0;gap:10px;padding:12px 4% 10px}`,
  `${N3} .dht-page-subtitle{font-size:17px!important;color:var(--n3-sub)!important;text-align:center;font-weight:700}`,
  // the tab strip: rounded-top tabs on a pale strip; the open page is the white tab with the mint edge
  `${N3} .dht-page-tabs{flex:none;justify-content:flex-start;align-items:flex-end;flex-wrap:nowrap!important;gap:4px!important;height:46px;padding:0 3%;background:linear-gradient(#e8ebf2,#dde1ea);box-shadow:0 1px 0 #c2c8d4}`,
  `${N3} .dht-page-tabs button{height:40px;background:transparent!important;color:var(--n3-sub)!important;border:0!important;border-radius:14px 14px 0 0!important;font-weight:800;font-size:18px;padding:0 20px!important;box-shadow:none!important;outline:none!important}`,
  `${N3} .dht-page-tabs button[aria-current=page]{background:linear-gradient(#fafbfc,#eef0f4)!important;color:var(--n3-ink)!important;box-shadow:inset 0 0 0 3px var(--n3-accent)!important}`,
  // rows: the System Settings buttons, white with a grey edge; the focused one mint
  `${N3} .dht-page-body{gap:24px!important}`,
  `${N3} .dht-page-list{padding:6px 8px 6px 4px!important}`,
  `${N3} .dht-page-list .dht-destination-row{flex:none;background:linear-gradient(#fff,#f1f2f6)!important;color:var(--n3-ink)!important;border:3px solid var(--n3-edge)!important;border-bottom-width:5px!important;border-radius:18px!important;margin:0 0 10px!important;min-height:68px!important;outline:none!important;box-shadow:none!important}`,
  `${N3} .dht-page-list .dht-destination-row[data-selected=true]{background:var(--n3-fill)!important;border-color:var(--n3-accent)!important;box-shadow:0 0 0 2px #fff,0 0 12px 2px color-mix(in srgb,var(--n3-accent) 45%,transparent)!important}`,
  `${N3} .dht-page-list .dht-row-label{font-size:22px!important;font-weight:800}`,
  `${N3} .dht-page-list .dht-row-sub{color:#8a909c!important;font-size:16px!important;font-weight:600}`,
  `${N3} .dht-page-list .dht-row-icon{color:var(--n3-sub)}`,
  `${N3} .dht-page-list .dht-destination-row[data-selected=true] .dht-row-icon{color:#2aa98a}`,
  `${N3} .dht-page-list>p{text-align:center;color:var(--n3-sub);font-weight:700}`,
  // friends: the Friend List's round icons with a presence ring
  `${n3List("friends")} .dht-row-icon{display:grid;place-items:center;flex:none;width:54px;height:54px;border-radius:50%;background:#fff;box-shadow:0 0 0 3px var(--n3-edge)}`,
  `${n3List("friends")} .dht-destination-row[data-state=on] .dht-row-icon{box-shadow:0 0 0 3px #5ccc5a;color:#4aa84a}`,
  `${n3List("achievements")} .dht-destination-row[data-state=on] .dht-row-icon{color:#e8a31f}`,
  `${n3List("achievements")} .dht-destination-row[data-state=off]{opacity:.6}`,
  `${N3} .dht-row-progress{background:#dfe2e8!important;height:10px!important;border-radius:6px!important}`,
  `${N3} .dht-row-progress i{background:var(--n3-accent)!important}`,
  // ── library: the HOME Menu's dense icon grid (owner references; 3ds-home-study.md): six rows of square icons in
  // white frames, filled column by column and scrolled sideways, faint markers in the empty cells; the focused
  // software's name takes the title (the top screen's place). --dht-n3ds-library-rows picks 1–6 rows. ──
  `${N3}:is([data-place=library],[data-place=search]) .dht-page-body{container-type:size;min-height:0}`,
  `${n3List("library", "search")}{--rows:var(--dht-n3ds-library-rows,6);--cell:calc((100cqh - 24px) / (var(--rows) + (var(--rows) - 1) * .14));--gap:calc(var(--cell) * .14);display:grid;grid-auto-flow:column;grid-template-rows:repeat(var(--rows),var(--cell));grid-auto-columns:var(--cell);gap:var(--gap);align-content:start;justify-content:start;overflow-x:auto!important;overflow-y:hidden!important;padding:12px!important;border-radius:14px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 114 114'%3E%3Crect x='30' y='30' width='40' height='40' rx='8' fill='%23000' fill-opacity='.07'/%3E%3C/svg%3E") 0 0/calc(var(--cell) + var(--gap)) calc(var(--cell) + var(--gap)) content-box content-box local,#d9d6d0;box-shadow:inset 0 2px 5px #0002,0 1px 0 #fff9}`,
  `${each(n3List("library", "search"), " .dht-destination-row")}{position:relative;display:block;width:100%!important;height:100%;min-width:0;padding:9%!important;min-height:0!important;margin:0!important;border:0!important;border-radius:18%!important;background:var(--dht-n3ds-tile,linear-gradient(#fff,#eceef2))!important;box-shadow:0 2px 3px #3b405566,inset 0 0 0 1px #fff!important}`,
  `${each(n3List("library", "search"), " .dht-destination-row[data-selected=true]")}{box-shadow:0 0 0 3px var(--n3-accent),0 0 10px 3px color-mix(in srgb,var(--n3-accent) 60%,transparent)!important;z-index:2}`,
  `${each(n3List("library", "search"), " .dht-row-icon")}{display:block;width:100%;height:100%}`,
  `${each(n3List("library", "search"), " .dht-row-icon>*")}{width:100%!important;height:100%!important;object-fit:cover;object-position:50% 18%;border-radius:8%!important;display:block;box-shadow:0 0 0 1px #0002}`,
  `${each(n3List("library", "search"), " .dht-row-text")}{display:none}`,
  `${N3}:is([data-place=library],[data-place=search]) .dht-page-title:not([data-focus-label=""]){font-size:0!important}`,
  `${N3}:is([data-place=library],[data-place=search]) .dht-page-title:not([data-focus-label=""])::after{content:attr(data-focus-label);font-size:26px;overflow:hidden;text-overflow:ellipsis}`,
  `${N3}[data-n3ds-top=show]:is([data-place=library],[data-place=search]) .dht-page-title:not([data-focus-label=""])::after{font-size:40px}`,
  `${N3} .dht-page-list::-webkit-scrollbar{height:10px}`,
  `${N3} .dht-page-list::-webkit-scrollbar{width:10px}`,
  `${N3} .dht-page-list::-webkit-scrollbar-track{background:#c9c6bf;border-radius:6px}`,
  `${N3} .dht-page-list::-webkit-scrollbar-thumb{background:linear-gradient(90deg,#5d616b,#3d4048);border-radius:6px}`,
  // search field, game cover, browser bar
  `${N3} .dht-page-content>input,${N3} .dht-page-content form input{background:#fff!important;color:var(--n3-ink)!important;border:3px solid var(--n3-edge)!important;border-radius:18px!important;padding:8px 18px!important;font-size:19px!important;font-weight:700;outline:none}`,
  `${N3} .dht-page-content>input:focus,${N3} .dht-page-content form input:focus{border-color:var(--n3-accent)!important}`,
  `${N3} .dht-page-body>:first-child:not(.dht-page-list){border-radius:14px!important;border:3px solid var(--n3-edge);box-shadow:0 3px 0 #fff}`,
  `${N3} .dht-page-content form button,${N3} .dht-page-content>div>button{background:linear-gradient(#fff,#f1f2f6)!important;color:var(--n3-ink)!important;border:3px solid var(--n3-edge)!important;border-bottom-width:5px!important;border-radius:18px!important;padding:8px 24px!important;font-weight:800}`,
  `${N3} iframe{border-radius:12px;border:3px solid var(--n3-edge)!important}`,
  // ── the bottom bar: the grey Back tab at the left, the wide white OK / Open bar (like Close / Start on HOME) ──
  `${N3} .dht-page-footer{grid-area:bar;align-self:end;height:52px;margin-left:calc(33.3% + 4px);display:flex;align-items:center;justify-content:center;border-radius:20px 20px 0 0;background:linear-gradient(#fbfbfc,#e6e8ed);box-shadow:inset 0 1px 0 #fff,0 -1px 0 var(--n3-edge);font-size:0!important;color:#6a7080!important}`,
  `${N3} .dht-page-footer::after{content:"OK";font-size:24px;font-weight:800}`,
  `${N3}:is([data-place=library],[data-place=search]) .dht-page-footer::after{content:"Open"}`,
  `${N3} .dht-page-back{grid-area:bar;align-self:end;justify-self:start;width:33.3%!important;height:52px;min-height:0!important;margin:0!important;padding:0 0 0 18px!important;gap:10px!important;border-radius:20px 20px 0 0!important;border:0!important;background:linear-gradient(#80858f,#666b75)!important;color:#fff!important;font-size:0!important;outline:none!important;box-shadow:inset 0 1px 0 #fff3!important}`,
  `${N3} .dht-page-back::before{content:"\\2715";display:inline-grid;place-items:center;width:26px;height:26px;border-radius:6px;background:#fff;color:#666b75;font-size:17px;font-weight:900}`,
  `${N3} .dht-page-back::after{content:"Back";font-size:22px;font-weight:800}`,
  // ── top screen shown: the title on a top screen, the page as the bottom screen below it, on the dark backdrop ──
  `${N3}[data-n3ds-top=show] .dht-page-frame{background:radial-gradient(ellipse at 50% 30%,#3a3e4a,#1d1f25 75%)!important;grid-template-rows:23% 14px minmax(0,1fr) 54px 12px;grid-template-areas:none;grid-template-columns:minmax(0,1fr) min(64%,820px) minmax(0,1fr)}`,
  `${N3}[data-n3ds-top=show] .dht-page-title{grid-column:1/-1;grid-row:1;justify-self:center;align-self:end;width:min(80%,1025px);height:calc(100% - 12px);flex-direction:column;gap:6px;border-radius:4px;background:var(--dht-n3ds-top-bg,radial-gradient(circle,#dfe2e8 1.4px,transparent 1.8px) 0 0/16px 16px,linear-gradient(#f8f9fb,#e3e6ec));box-shadow:0 0 0 3px #202226,0 0 0 4.5px #4a4d54,0 8px 22px #0006;font-size:40px!important}`,
  `${N3}[data-n3ds-top=show] .dht-page-main{grid-column:2;grid-row:3;border-radius:4px 4px 0 0;overflow:hidden;background:var(--dht-n3ds-page-bg,${N3_BG});box-shadow:0 0 0 3px #202226,0 0 0 4.5px #4a4d54}`,
  `${N3}[data-n3ds-top=show] .dht-page-footer,${N3}[data-n3ds-top=show] .dht-page-back{grid-column:2;grid-row:4;height:54px;align-self:stretch}`,
  `${N3}[data-n3ds-top=show] .dht-page-footer{border-radius:0 0 4px 0;box-shadow:inset 0 1px 0 #fff,0 3px 0 0 #202226,3px 0 0 0 #202226}`,
  `${N3}[data-n3ds-top=show] .dht-page-back{border-radius:0 0 0 4px!important;box-shadow:inset 0 1px 0 #fff3,0 3px 0 0 #202226,-3px 0 0 0 #202226!important}`,
  `${N3}[data-n3ds-top=show] .dht-page-content{padding:10px 3% 8px}`,
  `${N3}[data-n3ds-top=show]:not([data-place=library]):not([data-place=search]) .dht-page-list .dht-destination-row{min-height:58px!important}`,
  `${N3}[data-n3ds-top=show] .dht-page-body>:first-child:not(.dht-page-list){width:190px!important}`,
].join("\n");

/** The Switch and 3DS touches on the shared music player and capture viewer (src/mediaCenter.tsx). */
export const NINTENDO_MEDIA_CSS = [
  // the system pages' backgrounds (the store tokens these screens start from are the eShops' own)
  `.dht-media[data-theme=switch]{background:var(--dht-switch-page-bg,#ebebeb);--m-accent:var(--dht-switch-accent,#00c3e3)}`,
  `.dht-media[data-theme=switch][data-switch-style=dark]{background:var(--dht-switch-page-bg,#1a1a1a);--m-accent:var(--dht-switch-accent,#e60012);--m-panel:#2d2d2d;--m-text:#ffffff;--m-sub:#b0b0b0}`,
  `.dht-media[data-theme=switch][data-switch-style=dark] .dht-media-head{border-bottom:2px solid #3a3a3a}`,
  `.dht-media[data-theme=switch][data-switch-style=dark] .dht-media-title{color:#ffffff}`,
  `.dht-media[data-theme=switch][data-switch-style=dark] .dht-media-tabs button{color:#ffffff}`,
  `.dht-media[data-theme=switch][data-switch-style=dark] .dht-media-tabs button[aria-current=true]{color:#e60012;box-shadow:inset 0 -3px 0 #e60012}`,
  `.dht-media[data-theme=switch][data-switch-style=dark] .dht-media-hints{border-top:2px solid #3a3a3a;color:#b0b0b0}`,
  `.dht-media[data-theme=switch][data-switch-style=dark] .dht-media-tile[data-on=true]{box-shadow:0 0 0 3px #2d2d2d,0 0 0 6px var(--dht-switch-accent,#e60012),0 8px 18px #0006!important}`,
  `.dht-media[data-theme=switch][data-switch-style=dark] .dht-media-row[data-on=true]{background:#2d2d2d;color:#e60012;box-shadow:0 0 0 2px #2d2d2d,0 0 0 5px var(--dht-switch-accent,#e60012)}`,

  `.dht-media[data-theme=n3ds]{background:var(--dht-n3ds-page-bg,${N3_BG});--m-accent:var(--dht-n3ds-cursor,#3fe3b5)}`,
  // Switch: the Album / system page frame: header and footer lines, the teal focus frame
  `.dht-media[data-theme=switch] .dht-media-head{left:2.4%;right:2.4%;top:0;height:96px;padding-left:2.6%;border-bottom:2px solid #2d2d2d}`,
  `.dht-media[data-theme=switch] .dht-media-title{font-weight:400;font-size:31px}`,
  `.dht-media[data-theme=switch] .dht-media-tabs button{background:transparent;border-radius:0;color:#2d2d2d;padding:7px 14px}`,
  `.dht-media[data-theme=switch] .dht-media-tabs button[aria-current=true]{background:transparent;color:#3246e6;box-shadow:inset 0 -3px 0 #3246e6}`,
  `.dht-media[data-theme=switch] .dht-media-hints{left:2.4%;right:2.4%;bottom:0;height:78px;align-items:center;justify-content:flex-end;padding:0 2.6%;border-top:2px solid #2d2d2d;color:#2d2d2d;font-size:18px}`,
  `.dht-media[data-theme=switch] .dht-media-tile[data-on=true]{outline:none!important;box-shadow:0 0 0 3px #fff,0 0 0 6px var(--dht-switch-accent,#00c3e3),0 8px 18px #0003!important}`,
  `.dht-media[data-theme=switch] .dht-media-row[data-on=true]{background:#fff;color:#3246e6;box-shadow:0 0 0 2px #fff,0 0 0 5px var(--dht-switch-accent,#00c3e3)}`,
  `.dht-media[data-theme=switch] .dht-media-panel{box-shadow:0 1px 2px #0000001f}`,
  `.dht-media[data-theme=switch] .dht-media-ctl button[data-on=true]{background:var(--dht-switch-accent,#00c3e3);color:#fff}`,
  // 3DS: the pale title strip, rounded white panels with the grey edge, the mint focus
  `.dht-media[data-theme=n3ds] .dht-media-head{left:0;right:0;top:0;height:62px;padding:0 56px;background:linear-gradient(#fbfbfc,#eceef2);box-shadow:inset 0 -2px 0 #c4c8d2}`,
  `.dht-media[data-theme=n3ds] .dht-media-title{font-weight:800;font-size:26px;color:#4a4d54}`,
  `.dht-media[data-theme=n3ds] .dht-media-tabs button{border:3px solid #c4c8d2;border-radius:14px 14px 0 0;font-weight:800;background:transparent;color:#7b8494}`,
  `.dht-media[data-theme=n3ds] .dht-media-tabs button[aria-current=true]{background:#fff;color:#4a4d54;border-color:var(--dht-n3ds-cursor,#3fe3b5)}`,
  `.dht-media[data-theme=n3ds] .dht-media-panel{border:3px solid #c4c8d2;border-bottom-width:5px;border-radius:18px}`,
  `.dht-media[data-theme=n3ds] .dht-media-row{border-radius:14px;font-weight:700}`,
  `.dht-media[data-theme=n3ds] .dht-media-row[data-on=true]{background:#e3fbf3;color:#4a4d54;box-shadow:inset 0 0 0 3px var(--dht-n3ds-cursor,#3fe3b5)}`,
  `.dht-media[data-theme=n3ds] .dht-media-tile{border-radius:12px}`,
  `.dht-media[data-theme=n3ds] .dht-media-tile[data-on=true]{outline:none!important;box-shadow:0 0 0 3px var(--dht-n3ds-cursor,#3fe3b5),0 0 14px 3px #3fe3b599!important}`,
  `.dht-media[data-theme=n3ds] .dht-media-hints{left:0;right:0;bottom:0;height:52px;padding:0 56px;align-items:center;background:linear-gradient(#fbfbfc,#e6e8ed);border-radius:20px 20px 0 0;box-shadow:0 -1px 0 #c4c8d2;color:#6a7080;font-weight:700}`,
  `.dht-media[data-theme=n3ds] .dht-media-ctl button{border:3px solid #c4c8d2;background:linear-gradient(#fff,#f1f2f6);color:#4a4d54}`,
  `.dht-media[data-theme=n3ds] .dht-media-ctl button[data-on=true]{border-color:var(--dht-n3ds-cursor,#3fe3b5);background:#e3fbf3;color:#4a4d54}`,
].join("\n");

/** The themed store (src/storeView.tsx; tokens in storeSkin): the Switch eShop's orange sidebar edge and white
 * product cards with the price at the right, the 3DS eShop's grey title strip, cream page and white cards in the
 * thick orange cursor. Only colours, lines and cards; the store's layout stays the shared grid. */
export const NINTENDO_STORE_CSS = [
  `.dht-store[data-dht-store-skin=switch] :is(.dht-store-grid,.dht-store-page)::after{content:"";position:absolute;left:0;top:0;bottom:0;width:30px;background:#fa7e00}`,
  `.dht-store[data-dht-store-skin=switch] .dht-store-title{font-weight:500!important;color:#fa7e00}`,
  `.dht-store[data-dht-store-skin=switch] .dht-store-tab{border-radius:20px!important}`,
  `.dht-store[data-dht-store-skin=switch] .dht-store-tab[data-selected=false]{color:#2d2d2d!important}`,
  `.dht-store[data-dht-store-skin=switch] .dht-store-tile{background:#fff}`,
  `.dht-store[data-dht-store-skin=switch] .dht-store-tile>div:first-child{border-radius:4px 4px 0 0!important}`,
  `.dht-store[data-dht-store-skin=switch] .dht-store-tile>div:not(:first-child){padding:0 10px}`,
  `.dht-store[data-dht-store-skin=switch] .dht-store-tile>div:last-child{text-align:right;padding-bottom:8px}`,
  `.dht-store[data-dht-store-skin=switch] .dht-store-action[data-selected=true]{box-shadow:0 0 0 2px #fff,0 0 0 6px var(--dht-switch-accent,#00c3e3)!important}`,
  `.dht-store[data-dht-store-skin=switch][data-switch-style=dark] .dht-store-tab[data-selected=false]{color:#ffffff!important}`,
  `.dht-store[data-dht-store-skin=switch][data-switch-style=dark] .dht-store-tile{background:#2d2d2d!important;color:#ffffff!important}`,
  `.dht-store[data-dht-store-skin=switch][data-switch-style=dark] .dht-store-action[data-selected=true]{box-shadow:0 0 0 2px #2d2d2d,0 0 0 6px var(--dht-switch-accent,#e60012)!important}`,

  `.dht-store[data-dht-store-skin=n3ds] .dht-store-grid::before{content:"";position:absolute;left:0;right:0;top:0;height:72px;background:linear-gradient(#f7f6ee,#dfddcc);box-shadow:inset 0 -2px 0 #c9c6ae}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-grid>div:first-child{z-index:1}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-title{color:#4b4b4b;font-weight:800!important}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-grid>.dht-store-prompt{z-index:1}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-tab{background:#fff;border:2px solid #d8d4ad;font-weight:800!important}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-tab[data-selected=true]{background:#f39800;border-color:#f39800}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-tile{background:#fff;padding:5px}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-tile>div:first-child{border-radius:10px!important}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-tile>div:not(:first-child){padding:0 6px}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-tile>div:last-child{text-align:right;padding-bottom:4px}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-action{border:2px solid #d8d4ad}`,
  `.dht-store[data-dht-store-skin=n3ds] .dht-store-action[data-selected=true]{border-color:#f39800;box-shadow:0 0 0 3px #fff,0 0 0 7px #f39800!important}`,
].join("\n");
