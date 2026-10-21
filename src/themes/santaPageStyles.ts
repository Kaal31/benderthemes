// Shared native destination styling for Santa Express; all service behavior stays in ThemeHub.
export const SANTA_PAGE_STYLES = `
.dht-destination[data-theme="santa-express"] .dht-page-frame{inset:5% 5%!important;padding:28px;border:5px ridge #d4bca1;border-radius:30px;background:radial-gradient(ellipse at 25% 0%,#b6472b55,transparent 65%),linear-gradient(145deg,#731b13ed,#300806f5);box-shadow:inset 0 0 0 2px #4d120a,inset 0 2px 2px #ffe5b670,0 10px 30px #20000080}
.dht-destination[data-theme="santa-express"] h1{font-family:Georgia,serif!important;color:#fff0d4;text-shadow:0 2px 3px #200000;letter-spacing:.5px}
.dht-destination[data-theme="santa-express"] .dht-destination-row{border:1px solid #dfb4934d!important;background:linear-gradient(#982b1d75,#3c0b0966);box-shadow:inset 0 1px #ffdab426;border-radius:18px!important;transition:background .18s,box-shadow .18s}
.dht-destination[data-theme="santa-express"] .dht-destination-row[data-selected=true]{border:2px solid #ffe2b7!important;background:linear-gradient(#af3d24,#5b0f09)!important;box-shadow:0 0 0 2px #ad2814,0 0 14px #ff72274d!important;transform:none!important}
.dht-destination[data-theme="santa-express"] .dht-row-icon{color:#ffe1b1;filter:drop-shadow(0 2px 2px #270000)}
.dht-destination[data-theme="santa-express"] .dht-row-sub{color:#e8c3a6!important}
.dht-destination[data-theme="santa-express"] input{background:#290705!important;border:2px ridge #c6aa8c!important;border-radius:18px!important;color:#fff0d7!important;padding:12px}
.dht-destination[data-theme="santa-express"] .dht-menu{border:4px ridge #d4bca1!important;border-radius:24px!important;background:linear-gradient(#8a2418,#350907)!important;color:#fff0d7!important}
.dht-store[data-dht-store-skin="santa-express"]{color:#fff0da}
.dht-store[data-dht-store-skin="santa-express"] button{border-radius:16px!important;border:1px solid #d5af8566;box-shadow:inset 0 1px #ffe4b533}
.dht-store[data-dht-store-skin="santa-express"] input{background:#2c0806!important;color:#ffedcf!important;border:2px ridge #ceb18f!important;border-radius:18px!important}
@media(prefers-reduced-motion:reduce){.dht-destination[data-theme="santa-express"] *{transition:none!important}}
`;
