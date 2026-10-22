import {BETA_COLD_ART} from './oldBetaSheetStyles';
export const OLD_BETA_STORE_CSS=`
.dht-oldbeta .beta-store-page{overflow:clip;background:radial-gradient(ellipse at 65% 30%,#335f79,#102b3c 60%,#071820);--gallery-height:calc(var(--beta-w)*.24*9/16)}
.dht-oldbeta .beta-store-backdrop{position:absolute;inset:-10%;background-size:cover;background-position:center;filter:blur(22px) saturate(.3);opacity:.13;pointer-events:none;transition:opacity 200ms}
.dht-oldbeta .beta-store-tabs{position:absolute;top:0;left:33%;right:33%;height:5%;display:flex;gap:4px;z-index:5}
.dht-oldbeta .beta-store-tabs button{flex:1;background:#0b1e2b;color:#97b4c5;font-size:calc(var(--beta-w)*.01)}
.dht-oldbeta .beta-store-tabs button[aria-pressed=true]{background:linear-gradient(#ddedf4,#9fbbc9);color:#416073;box-shadow:0 0 11px #86bbd24d}
.dht-oldbeta .beta-store-previous-strip{position:absolute;left:0;right:0;top:7.5%;height:4%;display:flex;opacity:.18;overflow:hidden;filter:grayscale(1)}
.dht-oldbeta .beta-store-previous-strip img{width:15%;object-fit:cover}
.dht-oldbeta .beta-store-stage{position:absolute;inset:12% 0 10%;background:linear-gradient(#507f9966,#183e5650 60%,transparent);transition:filter 180ms,opacity 180ms}
.dht-oldbeta .beta-store-page[data-view=home] .beta-store-stage{top:12%;background:none}
.dht-oldbeta .beta-store-stage[data-dialog=true]{filter:grayscale(1) brightness(.48)}
.dht-oldbeta .beta-store-snapshot{pointer-events:none;z-index:2}
.dht-oldbeta .beta-store-stage h1{position:absolute;left:5.5%;top:2%;margin:0;font-size:calc(var(--beta-w)*.029);font-weight:400;line-height:1.15}
.dht-oldbeta .beta-store-stage h1 small{display:block;font-size:.4em;font-weight:400;margin-top:3px}
.dht-oldbeta .beta-store-featured{position:absolute;top:20%;left:0;right:0;height:43%;overflow:visible}
.dht-oldbeta .beta-store-cover-track{display:flex;align-items:center;height:100%;gap:0;transition:transform 190ms cubic-bezier(.22,.61,.36,1);will-change:transform}
.dht-oldbeta .beta-store-page .beta-store-card{position:relative;flex:0 0 calc(var(--beta-w)*.24);padding:0;border:2px solid transparent;z-index:1;transform:scale(1);outline:0;transition:transform 180ms cubic-bezier(.22,.61,.36,1),border-color 150ms,box-shadow 180ms}
.dht-oldbeta .beta-store-card img{display:block;width:100%;aspect-ratio:460/215;object-fit:cover;filter:${BETA_COLD_ART};transition:filter 180ms ease-out}
.dht-oldbeta .beta-store-page .beta-store-card[data-selected=true]{border-color:#d2edf5;transform:scale(1.15);box-shadow:0 0 10px #a9def66b;z-index:3}
.dht-oldbeta .beta-store-card[data-selected=true] img{filter:none}
.dht-oldbeta .beta-store-featured .beta-store-card img{aspect-ratio:16/9}
.dht-oldbeta .beta-store-featured .beta-store-card[data-selected=true]{transform:scale(1.3)}
.dht-oldbeta .beta-store-card>small{position:absolute;right:0;top:calc(100% + 5px);font-size:calc(var(--beta-w)*.009);white-space:nowrap;opacity:.7}
.dht-oldbeta .beta-store-card em{font-style:normal;margin-right:7px;background:#4a703c;color:#d8e9bc;padding:2px 5px}
.dht-oldbeta .beta-store-sections{position:absolute;left:4.5%;right:4.5%;top:69%;display:flex;gap:.8%;height:19%}
.dht-oldbeta .beta-store-sections button{position:relative;flex:1;min-width:0;overflow:hidden;border:2px solid transparent;font-size:calc(var(--beta-w)*.012)}
.dht-oldbeta .beta-store-sections img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;filter:grayscale(1) brightness(.35);transition:filter 160ms}
.dht-oldbeta .beta-store-sections span{position:absolute;left:0;right:0;bottom:0;background:#081b27b0;padding:7px 2px}
.dht-oldbeta .beta-store-sections button:focus{border-color:#a3d3e5;box-shadow:0 0 10px #96d1e555}.dht-oldbeta .beta-store-sections button:focus img{filter:grayscale(.3) brightness(.65)}
.dht-oldbeta .beta-store-filters{position:absolute;left:8%;top:19%;display:flex;gap:calc(var(--beta-w)*.025);font-size:calc(var(--beta-w)*.012)}
.dht-oldbeta .beta-store-filters button{color:#6c91a6}.dht-oldbeta .beta-store-filters button[aria-pressed=true],.dht-oldbeta .beta-store-filters button:focus{color:#d1e9f4;text-shadow:0 0 10px #90cbe5}
.dht-oldbeta .beta-store-list{position:absolute;top:28%;left:0;right:0;height:27%}
.dht-oldbeta .beta-store-list .beta-store-card{flex-basis:calc(var(--beta-w)*.225);transform:scale(.96)}
.dht-oldbeta .beta-store-list .beta-store-card[data-selected=true]{transform:scale(1.05)}
.dht-oldbeta .beta-store-list-details{position:absolute;left:8%;top:65%;color:#90afc3;font-size:calc(var(--beta-w)*.011)}
.dht-oldbeta .beta-store-list-details h2{color:#c7dfec;font-size:1.35em;font-weight:400;margin:0 0 8px}.dht-oldbeta .beta-store-list-details p{margin:3px 0}
.dht-oldbeta .beta-store-product h1{top:3.5%}
.dht-oldbeta .beta-store-page[data-view=list] .beta-store-stage h1{top:8%}
.dht-oldbeta .beta-store-product{position:absolute;inset:0;--gallery-height:calc(var(--beta-w)*.24*9/16)}
.dht-oldbeta .beta-store-product[data-media-focus=true]{--gallery-height:calc(var(--beta-w)*.42*9/16)}
.dht-oldbeta .beta-store-media{position:absolute;top:15%;left:8.5%;right:0;height:var(--gallery-height);transition:height 190ms cubic-bezier(.22,.61,.36,1)}
.dht-oldbeta .beta-store-media-track{display:flex;align-items:center;height:100%;transition:transform 190ms cubic-bezier(.22,.61,.36,1)}
.dht-oldbeta .beta-store-media button{position:relative;flex:0 0 calc(var(--beta-w)*.24);aspect-ratio:16/9;background:#06151e;border:2px solid transparent;overflow:hidden;transition:flex-basis 190ms,border-color 160ms,box-shadow 160ms}
.dht-oldbeta .beta-store-media img{display:block;width:100%;height:100%;object-fit:cover;filter:${BETA_COLD_ART};transition:filter 180ms}
.dht-oldbeta .beta-store-product[data-media-focus=true] .beta-store-media button[data-selected=true]{flex-basis:calc(var(--beta-w)*.42);border-color:#d1e9f4;box-shadow:0 0 8px #b8e0f673}
.dht-oldbeta .beta-store-product[data-media-focus=true] .beta-store-media button[data-selected=true] img{filter:none}
.dht-oldbeta .beta-store-play{position:absolute;inset:0;display:grid;place-items:center;color:#bacdd6;font-size:calc(var(--beta-w)*.04)}
.dht-oldbeta .beta-store-info{position:absolute;left:8.5%;right:3%;top:calc(15% + var(--gallery-height) + var(--beta-h)*.025);height:calc(var(--beta-h)*.14);display:flex;gap:1.4%;align-items:start;transition:top 190ms cubic-bezier(.22,.61,.36,1)}
.dht-oldbeta .beta-store-page .beta-store-buy{position:relative;flex:0 0 15%;height:100%;text-align:right;background:none;border:2px solid transparent}
.dht-oldbeta .beta-store-buy img{width:100%;aspect-ratio:16/9;object-fit:cover;filter:none}.dht-oldbeta .beta-store-buy small{display:block;font-size:calc(var(--beta-w)*.01)}
.dht-oldbeta .beta-store-page .beta-store-info-tile{flex:1;min-width:0;min-height:65%;text-align:left;padding:10px;background:#102c3dcc;border:2px solid transparent;color:#89a6b9}
.dht-oldbeta .beta-store-info-tile strong{display:block;font-size:calc(var(--beta-w)*.018);font-weight:400}.dht-oldbeta .beta-store-info-tile small{display:block;font-size:calc(var(--beta-w)*.011);margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-oldbeta .beta-store-info-tile{transition:filter 160ms,background-color 160ms,border-color 160ms}
.dht-oldbeta .beta-store-product[data-popover]:not([data-popover=""]) .beta-store-info-tile:not([data-selected=true]){filter:grayscale(1) brightness(.65)}
.dht-oldbeta .beta-store-info button:focus{border-color:#75b2cf;background-color:#24495c}
.dht-oldbeta .beta-store-popover{position:absolute;top:27%;width:28%;min-height:35%;max-height:65%;display:flex;flex-direction:column;padding:12px;background:linear-gradient(#27323a,#142a38);border:2px solid #5b8eaa;box-shadow:0 0 10px #7dc1e64d,0 7px 16px #00111e90;z-index:6;color:#b6cbd6;font-size:calc(var(--beta-w)*.012);animation:beta-store-pop-in 160ms ease-out}
.dht-oldbeta .beta-store-popover[data-panel=description],.dht-oldbeta .beta-store-popover[data-panel=details]{min-height:64%}
.dht-oldbeta .beta-store-popover::before{content:'';position:absolute;left:-13px;top:12px;border-top:8px solid transparent;border-bottom:8px solid transparent;border-right:11px solid #9fb5c2}
.dht-oldbeta .beta-store-popover h2{font-size:1.35em;font-weight:400;margin:0 0 9px}.dht-oldbeta .beta-store-popover p{margin:0 0 14px;line-height:1.25;max-height:calc(var(--beta-h)*.3);overflow:auto}
.dht-oldbeta .beta-store-page .beta-store-popover button{display:block;text-align:left;width:100%;font-size:1em;padding:6px 8px;border:1px solid transparent;color:#c6d8e1;margin-top:4px}
.dht-oldbeta .beta-store-popover button:first-of-type{margin-top:auto;background:#bfcbd0;color:#203b4b;border-color:#e8f4fa}
.dht-oldbeta .beta-store-popover button:focus{background:#e0edf2;color:#1d3a4c;border-color:#fff;box-shadow:0 0 6px #9fd4e5}
.dht-oldbeta .beta-store-facts{display:grid;gap:9px;margin:5px 0 18px;grid-template-columns:repeat(2,minmax(0,1fr));font-size:.9em}
.dht-oldbeta .beta-store-friends{display:flex;gap:10px;margin-bottom:15px}.dht-oldbeta .beta-store-friends>span{width:22%;overflow:hidden}.dht-oldbeta .beta-store-friends img{width:100%}.dht-oldbeta .beta-store-friends small{font-size:.7em}
.dht-oldbeta .beta-store-dialog-shade{position:absolute;inset:0;z-index:12;background:#0004;display:grid;place-items:center;animation:beta-store-pop-in 180ms ease-out}
.dht-oldbeta .beta-store-description{width:65%;height:65%;padding:2%;background:linear-gradient(#29363e,#214b63);border:1px solid #6c90a3;box-shadow:0 6px 24px #0007;display:flex;flex-direction:column}
.dht-oldbeta .beta-store-description h2{font-weight:300;margin:0 0 14px;font-size:calc(var(--beta-w)*.025)}
.dht-oldbeta .beta-store-dialog-text{flex:1;white-space:pre-line;overflow:auto;line-height:1.5;font-size:calc(var(--beta-w)*.012);padding-right:12px;scrollbar-width:thin}
.dht-oldbeta .beta-store-page[data-dialog=true]>footer{visibility:hidden}
.dht-oldbeta .beta-store-description>button{position:absolute;left:50%;bottom:4%;transform:translateX(-50%)}
.dht-oldbeta .beta-store-description>button,.dht-oldbeta .beta-store-screenshot>button{padding:8px 12px;background:#355a70;margin:12px auto 0}
.dht-oldbeta .beta-store-screenshot{width:90%;height:88%;text-align:center}.dht-oldbeta .beta-store-screenshot img{width:100%;height:90%;object-fit:contain}
.dht-oldbeta .beta-store-genres{position:absolute;left:8%;right:8%;top:20%;display:grid;grid-template-columns:repeat(3,1fr);gap:16px}.dht-oldbeta .beta-store-genres button{padding:20px;background:#143247;border:1px solid #3e6e87;font-size:calc(var(--beta-w)*.02)}.dht-oldbeta .beta-store-genres button:focus{background:#8cb4ca;color:#1b3b50}.dht-oldbeta .beta-store-genres small{display:block;font-size:.5em;margin-top:10px}
.dht-oldbeta .beta-store-loading,.dht-oldbeta .beta-store-error,.dht-oldbeta .beta-store-empty{position:absolute;left:8%;top:15%;z-index:8;color:#c3deea}.dht-oldbeta .beta-store-error button{padding:10px;background:#3c647a;margin-left:15px}
.dht-oldbeta .beta-store-trailer-fallback{position:absolute;left:8.5%;top:12%;z-index:5;color:#c4deec;font-size:calc(var(--beta-w)*.011)}
@keyframes beta-store-pop-in{from{opacity:0;translate:0 12px;scale:.97}to{opacity:1;translate:0 0;scale:1}}
.dht-oldbeta.no-motion .beta-store-page *{transition:none!important;animation:none!important}
@media(prefers-reduced-motion:reduce){.dht-oldbeta .beta-store-page *{transition:none!important;animation:none!important}}
`;
