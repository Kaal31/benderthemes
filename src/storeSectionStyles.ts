// Looks of the themed store's Themes and Plugins sections (storeSections.tsx), per console store. The colours come
// from storeSkin() as --dht-sec-* variables; these rules give each console its store's tiles, category rows and type,
// compared with the real stores (handoff-notes/page-coverage.md, "Store sections"):
//  PS3 (2012 PlayStation Store): category column, dark cards with the art at the left and title / type / price
//  PS4: category column, square art over a dark name strip with the price at the right
//  PS5: rows of square, rounded tiles under white headings
//  PSP: light-blue bar list beside a blue preview; Vita: dark-blue list rows, white text, price at the right
//  Wii Shop Channel: white rounded buttons, grey-blue text, cyan frame; Wii U eShop: ribbon headings, wide framed tiles
//  3DS eShop: a row of rounded icons with the name on an info card above; Switch eShop: square white product cards
//  Xbox 360: NXE stacked category names over one row (the focused tile large with its name inside), Metro / Kinect
//  flat tiles, Blades the orange list.
const S = (skin: string) => `.dht-store[data-dht-store-skin=${skin}] .dht-store-section`;

const BASE = `
.dht-store-section{position:absolute;left:56px;right:56px;top:134px;bottom:14px;display:flex;flex-direction:column;color:var(--dht-sec-text);min-height:0;z-index:1}
.dht-store-section *{box-sizing:border-box}
.dht-store-section-hints{position:static!important;flex:none;margin-top:8px;font-size:14px;color:var(--dht-sec-sub)}
.dht-store-section-status{flex:none;display:flex;gap:16px;font-size:12px;color:var(--dht-sec-sub);margin:-4px 0 6px}
.dht-store-section-attribution{margin-left:auto;cursor:pointer;text-decoration:underline dotted}
.dht-store-section-error{color:#e8b04b}
.dht-store-section-empty{font-size:18px;color:var(--dht-sec-sub);padding:30px 0}
.dht-store-shelves{flex:1;min-height:0;overflow:hidden;display:flex;flex-direction:column;gap:6px}
.dht-store-shelf{flex:none}
.dht-store-shelf-title{margin:0 0 2px;font-size:20px;font-weight:600;display:flex;align-items:baseline;gap:10px}
.dht-store-shelf-title small{font-size:13px;color:var(--dht-sec-sub);font-weight:400}
.dht-store-shelf-row{display:flex;gap:18px;overflow:hidden;padding:12px 18px 14px;margin:0 -18px;position:relative}
.dht-store-shelf-tile{flex:none;width:var(--dht-sec-tile-w,230px);position:relative;cursor:pointer;transition:transform .14s,box-shadow .14s;color:var(--dht-sec-text)}
.dht-store-shelf-art{position:relative;width:100%;aspect-ratio:var(--dht-sec-art,460/215);border-radius:inherit;overflow:hidden;background:var(--dht-sec-panel);display:grid;place-items:center}
.dht-store-shelf-art img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:block}
.dht-store-shelf-art[data-generated=true]{background:linear-gradient(135deg,hsl(var(--dht-sec-hue) 52% 54%),hsl(calc(var(--dht-sec-hue) + 40) 58% 30%))}
.dht-store-shelf-art[data-kind=info]{background:transparent;border:2px dashed var(--dht-sec-sub)}
.dht-store-shelf-art[data-kind=info] .dht-store-shelf-mark{color:var(--dht-sec-sub);text-shadow:none}
.dht-store-shelf-mark{font-size:32px;font-weight:800;color:#fff;letter-spacing:1px;text-shadow:0 2px 8px #0005;max-width:90%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.dht-store-shelf-badge{position:absolute;left:8px;top:8px;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:800;background:var(--dht-sec-sale);color:#000;letter-spacing:.3px}
.dht-store-shelf-badge[data-kind=unreviewed]{background:#7a5a12;color:#fff4d6}
.dht-store-shelf-name{margin-top:8px;font-size:16px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-store-shelf-sub{font-size:13px;color:var(--dht-sec-sub);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-store-shelf-meta{font-size:14px;font-weight:700;color:var(--dht-sec-sub);min-height:1em}
.dht-store-shelf-tile[data-meta="In use"] .dht-store-shelf-meta,.dht-store-shelf-tile[data-meta=Installed] .dht-store-shelf-meta{color:var(--dht-sec-text)}
.dht-store-section-info{display:none}
/* list + preview */
.dht-store-section-listwrap{flex:1;min-height:0;display:flex;gap:30px}
.dht-store-section-list{width:560px;flex:none;overflow:hidden;display:flex;flex-direction:column;gap:8px;padding:6px}
.dht-store-section-list .dht-store-shelf-tile{width:auto;flex:none;display:grid;grid-template-columns:112px minmax(0,1fr) auto;grid-template-rows:auto auto;column-gap:14px;align-items:center;padding:6px 12px 6px 6px;background:var(--dht-sec-panel)}
.dht-store-section-list .dht-store-shelf-art{grid-row:1/3;width:112px;border-radius:min(var(--dht-sec-radius),6px)}
.dht-store-section-list .dht-store-shelf-mark{font-size:22px}
.dht-store-section-list .dht-store-shelf-badge{display:none}
.dht-store-section-list .dht-store-shelf-name{margin:0;grid-column:2;font-size:18px;align-self:end}
.dht-store-section-list .dht-store-shelf-sub{grid-column:2;align-self:start}
.dht-store-section-list .dht-store-shelf-meta{grid-column:3;grid-row:1/3}
.dht-store-list-head{margin:8px 0 0;font-size:14px;letter-spacing:1px;color:var(--dht-sec-sub);text-transform:uppercase;flex:none}
.dht-store-section-preview{flex:1;min-width:0;background:var(--dht-sec-panel);border-radius:var(--dht-sec-radius);overflow:hidden;display:flex;flex-direction:column;margin:6px 0}
.dht-store-section-preview .dht-store-shelf-art{aspect-ratio:16/9;border-radius:0;flex:none}
.dht-store-section-preview-text{padding:14px 18px;overflow:hidden}
.dht-store-section-preview-text .dht-store-shelf-name{font-size:24px;white-space:normal;margin:0 0 4px}
.dht-store-section-preview-text p{font-size:15px;line-height:1.45;opacity:.9;margin:10px 0 0}
/* category column + grid */
.dht-store-section-railwrap{flex:1;min-height:0;display:flex;gap:24px}
.dht-store-rail{width:230px;flex:none;display:flex;flex-direction:column;gap:2px;padding-top:6px}
.dht-store-rail-cat{padding:9px 16px;font-size:17px;color:var(--dht-sec-sub);cursor:pointer;display:flex;justify-content:space-between;align-items:baseline}
.dht-store-rail-cat small{opacity:.6;font-size:12px}
.dht-store-rail-cat[data-current=true]{color:var(--dht-sec-text);background:rgba(255,255,255,.1)}
.dht-store-rail-cat[data-selected=true]{background:rgba(235,238,242,.92);color:#111}
.dht-store-rail-grid{flex:1;min-width:0;display:grid;gap:14px;align-content:start;overflow:hidden;padding:6px}
.dht-store-rail-grid .dht-store-shelf-tile{width:auto}
/* Xbox 360 NXE stack */
.dht-store-section-stackwrap{flex:1;position:relative;min-height:0}
.dht-store-stack-about{position:absolute;right:0;top:0;text-align:right;max-width:360px}
.dht-store-stack-about b{display:block;font-size:24px;font-weight:400}
.dht-store-stack-about span{display:block;font-size:14px;color:var(--dht-sec-sub);margin-top:4px}
.dht-store-stack-cats{position:absolute;left:0;top:0;height:150px;display:flex;flex-direction:column;justify-content:flex-end;overflow:hidden}
.dht-store-stack-cat{font-size:18px;margin:0;font-weight:400}
.dht-store-stack-cat[data-current=true]{font-size:32px}
.dht-store-stack-cat small{display:none}
.dht-store-section-stackwrap .dht-store-shelf-row{position:absolute;left:0;right:0;top:160px;align-items:flex-end;gap:8px;margin:0;padding:12px 4px}
.dht-store-section-stackwrap .dht-store-shelf-tile{--dht-sec-tile-w:132px;--dht-sec-art:3/4}
.dht-store-section-stackwrap .dht-store-shelf-tile[data-selected=true]{--dht-sec-tile-w:230px;--dht-sec-art:1/1;transform:none!important}
.dht-store-section-stackwrap .dht-store-shelf-tile:not([data-selected=true]) :is(.dht-store-shelf-name,.dht-store-shelf-sub,.dht-store-shelf-meta){display:none}
.dht-store-section-stackwrap .dht-store-shelf-tile[data-selected=true] :is(.dht-store-shelf-name,.dht-store-shelf-sub,.dht-store-shelf-meta){position:absolute;left:14px;right:14px;margin:0;color:#fff;text-shadow:0 1px 3px #0008}
.dht-store-section-stackwrap .dht-store-shelf-tile[data-selected=true] .dht-store-shelf-name{bottom:34px;font-size:18px;font-weight:400}
.dht-store-section-stackwrap .dht-store-shelf-tile[data-selected=true] .dht-store-shelf-sub{bottom:16px;font-size:12px;color:#e8ffe0}
.dht-store-section-stackwrap .dht-store-shelf-tile[data-selected=true] .dht-store-shelf-meta{top:12px;bottom:auto;text-align:right;font-size:12px}
.dht-store-stack-count{position:absolute;left:4px;top:420px;color:var(--dht-sec-sub);font-size:14px}
/* detail page */
.dht-store-section-detail{flex:1;min-height:0;display:grid;grid-template-columns:400px minmax(0,1fr);grid-template-rows:minmax(0,1fr) auto;column-gap:34px;row-gap:16px}
.dht-store-section-detail-art{grid-row:1/3}
.dht-store-section-detail-art .dht-store-shelf-art{aspect-ratio:16/10;border-radius:var(--dht-sec-radius);box-shadow:0 12px 30px rgba(0,0,0,.35)}
.dht-store-section-detail-art .dht-store-shelf-badge{font-size:13px}
.dht-store-section-detail-body{overflow:hidden;min-height:0;font-size:15px;line-height:1.5}
.dht-store-section-detail-body p{margin:10px 0}
.dht-store-section-crumb{font-size:14px;color:var(--dht-sec-sub);margin-bottom:6px}
.dht-store-section-detail-body h2{font-size:32px;margin:0 0 4px;line-height:1.15;font-weight:700}
.dht-store-section-by{color:var(--dht-sec-sub);font-size:14px;margin-bottom:10px}
.dht-store-section .dht-spotlight-badges{display:flex;flex-wrap:wrap;gap:6px}
.dht-store-section .dht-spotlight-badge{font-size:11px;font-weight:700;letter-spacing:.3px;padding:3px 9px;border-radius:999px;background:rgba(128,128,128,.28);color:inherit}
.dht-store-section .dht-spotlight-badge[data-kind=spotlight]{background:var(--dht-sec-accent);color:var(--dht-sec-accent-text)}
.dht-store-section .dht-spotlight-badge[data-kind=unreviewed]{background:#7a5a12;color:#fff4d6}
.dht-store-section .dht-spotlight-badge[data-kind=root]{background:#8a2a2a;color:#ffe3e3}
.dht-store-section .dht-spotlight-badge[data-kind=archived]{background:#4a4f58;color:#e7eaef}
.dht-store-section .dht-spotlight-badge[data-kind=installed]{background:#2d6b45;color:#e3ffee}
.dht-store-section-warning,.dht-store-section-confirm{display:flex;flex-direction:column;gap:6px;margin:12px 0;padding:12px 14px;font-size:14px;line-height:1.45;border-radius:6px}
.dht-store-section-warning{border-left:4px solid #d39b22;background:rgba(211,155,34,.14)}
.dht-store-section-confirm{border:2px solid #d39b22;background:rgba(211,155,34,.2)}
.dht-store-section-confirm strong{font-size:16px}
.dht-store-section-facts{margin:12px 0 0;font-size:13px;border-top:1px solid rgba(128,128,128,.35)}
.dht-store-section-facts div{display:flex;justify-content:space-between;gap:12px;padding:6px 0;border-bottom:1px solid rgba(128,128,128,.35)}
.dht-store-section-facts dt{color:var(--dht-sec-sub)}.dht-store-section-facts dd{margin:0}
.dht-store-section-detail-body h4{margin:16px 0 4px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:var(--dht-sec-sub)}
.dht-store-section .dht-spotlight-readme{font-size:13px;line-height:1.55}.dht-store-section .dht-spotlight-readme pre{white-space:pre-wrap;background:rgba(0,0,0,.25);padding:8px;border-radius:6px}
.dht-store-section-message{font-weight:700}
.dht-store-section-actions{grid-column:2;display:flex;gap:12px;flex-wrap:wrap}
.dht-store-section-action{padding:12px 22px;font-size:17px;font-weight:700;cursor:pointer;box-shadow:none}
.dht-store-section-action[data-selected=true]{box-shadow:0 6px 18px rgba(0,0,0,.35)}
.dht-store-section-action[data-disabled=true]{opacity:.55}
`;

const CONSOLES = [
  // PS3, the 2012 PlayStation Store: dark translucent cards, square art at the left, title over "type", price under
  `${S("ps3")}{--dht-sec-art:1/1}`,
  `${S("ps3")} .dht-store-rail-cat{font-size:16px;padding:7px 18px}`,
  `${S("ps3")} .dht-store-rail-cat[data-current=true]{background:linear-gradient(90deg,rgba(255,255,255,.22),rgba(255,255,255,.04))}`,
  `${S("ps3")} .dht-store-rail-cat[data-selected=true]{background:linear-gradient(90deg,rgba(255,255,255,.85),rgba(255,255,255,.55));color:#1a2333}`,
  `${S("ps3")} .dht-store-rail-grid .dht-store-shelf-tile{display:grid;grid-template-columns:104px minmax(0,1fr);grid-template-rows:auto auto 1fr;column-gap:12px;padding:5px;background:rgba(8,16,34,.55);border:1px solid rgba(255,255,255,.08);border-radius:2px!important;transform:none!important}`,
  `${S("ps3")} .dht-store-rail-grid .dht-store-shelf-tile[data-selected=true]{border:2px solid rgba(255,255,255,.85);padding:4px}`,
  `${S("ps3")} .dht-store-rail-grid .dht-store-shelf-art{grid-row:1/4;border-radius:0}`,
  `${S("ps3")} .dht-store-rail-grid .dht-store-shelf-badge{display:none}`,
  `${S("ps3")} .dht-store-rail-grid .dht-store-shelf-name{margin:4px 0 0;font-size:15px;font-weight:400;white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}`,
  `${S("ps3")} .dht-store-rail-grid .dht-store-shelf-sub{font-size:11px;padding-left:7px;border-left:2px solid #e43a3a}`,
  `${S("ps3")} .dht-store-rail-grid .dht-store-shelf-meta{align-self:end;text-align:right;color:#fff;font-size:15px}`,
  // PS4: the column of categories, square art over a dark strip with name / type and the price at the right
  `${S("ps4")}{--dht-sec-art:1/1}`,
  `${S("ps4")} .dht-store-rail{background:rgba(0,10,40,.35);padding:8px 0}`,
  `${S("ps4")} .dht-store-rail-cat[data-current=true]{background:rgba(255,255,255,.12);color:#fff}`,
  `${S("ps4")} .dht-store-rail-cat[data-selected=true]{background:#d8dbe2;color:#0a1f4a}`,
  `${S("ps4")} .dht-store-rail-grid .dht-store-shelf-tile{background:#0a1d44;display:grid;grid-template-columns:minmax(0,1fr) auto;border-radius:2px!important}`,
  `${S("ps4")} .dht-store-rail-grid .dht-store-shelf-art{grid-column:1/3;border-radius:0}`,
  `${S("ps4")} .dht-store-rail-grid .dht-store-shelf-name{grid-column:1/3;margin:6px 8px 0;font-size:14px;font-weight:500}`,
  `${S("ps4")} .dht-store-rail-grid .dht-store-shelf-sub{margin:0 8px 8px;font-size:11px}`,
  `${S("ps4")} .dht-store-rail-grid .dht-store-shelf-meta{margin:0 8px 8px;font-size:13px;color:#fff;align-self:end}`,
  // PS5: rows of square, rounded tiles; only the focused one shows its name strongly
  `${S("ps5")}{--dht-sec-art:1/1;--dht-sec-tile-w:172px}`,
  `${S("ps5")} .dht-store-shelf-title{font-size:21px;font-weight:500}`,
  `${S("ps5")} .dht-store-shelf-art{border-radius:12px}`,
  `${S("ps5")} .dht-store-shelf-tile:not([data-selected=true]) :is(.dht-store-shelf-name,.dht-store-shelf-sub,.dht-store-shelf-meta){opacity:.55}`,
  `${S("ps5")} .dht-store-shelf-row{gap:16px}`,
  // PSP: the store's bright blue bars at the left, a blue preview
  `${S("psp")} .dht-store-section-list .dht-store-shelf-tile{background:linear-gradient(#78bdf4,#3d8fdc);color:#fff;border-radius:2px!important;padding:3px 10px 3px 3px;grid-template-columns:72px minmax(0,1fr) auto}`,
  `${S("psp")} .dht-store-section-list .dht-store-shelf-art{width:72px}`,
  `${S("psp")} .dht-store-section-list .dht-store-shelf-name{font-size:16px;font-weight:500}`,
  `${S("psp")} .dht-store-section-list :is(.dht-store-shelf-sub,.dht-store-shelf-meta){color:#e8f4ff}`,
  `${S("psp")} .dht-store-section-list .dht-store-shelf-tile[data-selected=true]{background:linear-gradient(#bfe2ff,#6fb2f0)!important;color:#0b3a73}`,
  `${S("psp")} .dht-store-section-list .dht-store-shelf-tile[data-selected=true] :is(.dht-store-shelf-sub,.dht-store-shelf-meta){color:#0b3a73}`,
  `${S("psp")} .dht-store-section-preview{background:linear-gradient(#2c7fd6,#0d4fa8);border-radius:2px}`,
  // PS Vita: dark-blue rows with a thin rule, the date-sized line over the title, price at the right
  `${S("vita")} .dht-store-section-list{gap:0;background:#1530a0;border-radius:4px;padding:0}`,
  `${S("vita")} .dht-store-section-list .dht-store-shelf-tile{background:transparent;color:#fff;border-radius:0!important;border-bottom:1px solid #3a56c8;grid-template-columns:64px minmax(0,1fr) auto;padding:6px 14px 6px 8px;transform:none!important}`,
  `${S("vita")} .dht-store-section-list .dht-store-shelf-tile[data-selected=true]{background:linear-gradient(#3c78f0,#2556d6);box-shadow:0 0 18px rgba(120,210,255,.8)!important}`,
  `${S("vita")} .dht-store-section-list .dht-store-shelf-art{width:64px;--dht-sec-art:1/1;border-radius:4px}`,
  `${S("vita")} .dht-store-section-list .dht-store-shelf-name{grid-row:2;font-size:17px;font-weight:500}`,
  `${S("vita")} .dht-store-section-list .dht-store-shelf-sub{grid-row:1;font-size:11px;color:#b8c8f4;align-self:end}`,
  `${S("vita")} .dht-store-section-list .dht-store-shelf-meta{color:#fff;font-weight:500}`,
  `${S("vita")} .dht-store-list-head{background:#0d2380;color:#dcecff;margin:0;padding:6px 12px;font-size:13px}`,
  // Wii Shop Channel: white rounded buttons with grey-blue text in a cyan frame, the light page
  `${S("wii")} .dht-store-section-list{gap:10px;padding:10px 14px;border:4px solid #34bfe9;border-radius:22px;background:#fff}`,
  `${S("wii")} .dht-store-section-list .dht-store-shelf-tile{background:linear-gradient(#fff,#eef3f6);border:2px solid #c9d5dc;border-radius:16px!important;color:#5a6f7c;box-shadow:none;transform:none!important}`,
  `${S("wii")} .dht-store-section-list .dht-store-shelf-tile[data-selected=true]{border:3px solid #34bfe9;box-shadow:0 0 0 2px #bfeeff!important}`,
  `${S("wii")} .dht-store-list-head{color:#fff;background:linear-gradient(#5fd3f4,#22b1e0);border-radius:12px;padding:4px 14px;font-size:15px;text-transform:none;letter-spacing:0}`,
  `${S("wii")} .dht-store-section-preview{background:#fff;border:4px solid #34bfe9;border-radius:22px;color:#536c7b}`,
  `${S("wii")} .dht-store-section-preview .dht-store-shelf-art{margin:12px 12px 0;width:auto;border-radius:12px}`,
  `${S("wii")} .dht-store-section-action{border:3px solid #c9d5dc;border-radius:22px!important}`,
  `${S("wii")} .dht-store-section-action[data-selected=true]{border-color:#34bfe9}`,
  // Wii U eShop: red/orange/green ribbon headings, wide tiles in a white frame with a grey caption under
  `${S("wiiu")}{--dht-sec-tile-w:250px;--dht-sec-art:16/9}`,
  `${S("wiiu")} .dht-store-shelf-title{display:flex;width:max-content;min-width:420px;background:linear-gradient(#ee4036,#c81f1b);color:#fff;font-style:italic;font-weight:800;text-transform:uppercase;font-size:17px;padding:5px 46px 5px 22px;clip-path:polygon(0 0,100% 0,96% 100%,0 100%);border-radius:4px 0 0 4px;letter-spacing:.5px}`,
  `${S("wiiu")} .dht-store-shelf:nth-child(2) .dht-store-shelf-title{background:linear-gradient(#f9a03a,#ee7d12)}`,
  `${S("wiiu")} .dht-store-shelf:nth-child(3) .dht-store-shelf-title{background:linear-gradient(#5cc34a,#2f9a2a)}`,
  `${S("wiiu")} .dht-store-shelf:nth-child(4) .dht-store-shelf-title{background:linear-gradient(#4a8de0,#2a63b8)}`,
  `${S("wiiu")} .dht-store-shelf-title small{color:#ffffffcc}`,
  `${S("wiiu")} .dht-store-shelf-art{border:4px solid #fff;border-radius:6px;box-shadow:0 2px 5px #0003}`,
  `${S("wiiu")} :is(.dht-store-shelf-name,.dht-store-shelf-sub,.dht-store-shelf-meta){text-align:center}`,
  `${S("wiiu")} .dht-store-shelf-name{font-size:14px;font-weight:400;color:#6b6b6b;margin-top:4px}`,
  // 3DS eShop: a row of rounded icons in white frames, the name on the info card above (the top screen's place)
  `${S("n3ds")}{--dht-sec-tile-w:104px;--dht-sec-art:1/1}`,
  `${S("n3ds")} .dht-store-section-info{display:grid;grid-template-columns:minmax(0,1fr) auto;flex:none;background:#fff;border-radius:14px;padding:10px 18px;margin-bottom:8px;box-shadow:0 3px 0 #d8d4ad;color:#4b4b4b}`,
  `${S("n3ds")} .dht-store-section-info .dht-store-shelf-name{margin:0;font-size:20px;font-weight:800}`,
  `${S("n3ds")} .dht-store-section-info .dht-store-shelf-sub{grid-column:1}`,
  `${S("n3ds")} .dht-store-section-info .dht-store-shelf-meta{grid-column:2;grid-row:1/3;align-self:center;color:#f37ea1;font-size:18px}`,
  `${S("n3ds")} .dht-store-shelves .dht-store-shelf-tile :is(.dht-store-shelf-name,.dht-store-shelf-sub,.dht-store-shelf-meta){display:none}`,
  `${S("n3ds")} .dht-store-shelves .dht-store-shelf-tile{padding:5px!important}`,
  `${S("n3ds")} .dht-store-shelf-art{border-radius:12px!important}`,
  `${S("n3ds")} .dht-store-shelf-mark{font-size:24px}`,
  `${S("n3ds")} .dht-store-shelf-badge{left:2px;top:2px;font-size:9px;padding:1px 5px}`,
  `${S("n3ds")} .dht-store-shelf-title{font-size:15px;font-weight:800;color:#8a8670;background:linear-gradient(#f7f6ee,#e7e4cf);border-radius:10px;padding:3px 12px;width:max-content}`,
  `${S("n3ds")} .dht-store-shelf-row{gap:14px}`,
  // Switch eShop: square white product cards, name then price at the right
  `${S("switch")}{--dht-sec-art:1/1;--dht-sec-tile-w:176px}`,
  `${S("switch")} .dht-store-shelf-title{font-size:22px;font-weight:500;color:#2d2d2d}`,
  `${S("switch")} .dht-store-shelf-name{font-size:15px;font-weight:500;color:#2d2d2d}`,
  `${S("switch")} .dht-store-shelf-meta{color:#fa7e00}`,
  // Xbox 360 NXE: the Marketplace's green tiles, white light type
  `${S("x360")}[data-layout=stack] .dht-store-shelf-art[data-generated=true]{background:linear-gradient(160deg,#9ad34a,#4e9a12 60%,#356f0b)}`,
  `${S("x360")}[data-layout=stack] .dht-store-shelf-tile[data-selected=true]{box-shadow:0 0 0 3px #d9ff9a,0 14px 30px rgba(0,0,0,.6)!important}`,
  `${S("x360")}[data-layout=shelves] .dht-store-shelf-title{font-size:26px;font-weight:300}`,
  `${S("x360")}[data-layout=shelves] .dht-store-shelf-art{border-radius:0}`,
  `${S("x360")}[data-layout=list] .dht-store-section-list .dht-store-shelf-tile{border-radius:10px!important}`,
  // original Xbox: the green glowing pods
  `${S("xbox")} .dht-store-shelf-title{text-transform:uppercase;letter-spacing:2px;color:#c6ff6a;text-shadow:0 0 10px #8fd34a}`,
  `${S("xbox")} .dht-store-shelf-art{border:2px solid #8fd34a}`,
];

export const STORE_SECTION_CSS = BASE + CONSOLES.join("\n");
