// Scoped to GameAmp's full Library. Retains shared search, launch and controller actions.
const D='.dht-destination[data-theme="gameamp"][data-place="library"]';
export const GAMEAMP_LIBRARY_STYLES=`
${D}{background:radial-gradient(ellipse at 50% 0,#344a65,#101724 75%)}
${D} .dht-page-frame{inset:3% 3.5%!important;border:3px solid #a6b3c5;border-radius:15px;padding:12px;background:linear-gradient(110deg,#e6edf6,#8d9db3 20%,#e0e7ef 48%,#8292a9 80%,#cbd5e1);box-shadow:inset 0 0 0 2px #f5f9ff,inset 0 0 0 5px #43536b,0 12px 35px #000b;gap:10px!important;color:#d7eaff!important;font-family:Tahoma,"Segoe UI",sans-serif!important}
${D} .dht-page-header{min-height:66px;padding:7px 18px 7px 10px;border:2px solid #586c89;border-radius:9px;background:linear-gradient(#183e73,#0a224c 52%,#143465);box-shadow:inset 0 0 0 1px #8cb4e180;gap:20px!important;color:#e5f1ff!important}
${D} .dht-page-header:after{content:'GAMEAMP / MEDIA LIBRARY';margin-left:auto;letter-spacing:2px;font-size:12px;color:#a6c4e6}
${D} .dht-page-title{margin:0!important;font-size:28px!important;font-weight:700!important;letter-spacing:1px;text-shadow:0 2px #000}
${D} .dht-page-back,${D} .dht-page-tabs button{color:#152940!important;border:1px solid #667c97!important;background:linear-gradient(#f5fbff,#a3b5ca 48%,#728aa5 51%,#dae6f3)!important;box-shadow:inset 0 0 0 1px #fff9,0 2px 3px #0006;border-radius:18px!important;font:700 14px Tahoma,sans-serif!important;min-height:34px!important;padding:7px 19px!important}
${D} .dht-page-tabs{display:flex;gap:9px;padding:0 5px}
${D} .dht-page-tabs button[aria-current="page"]{background:linear-gradient(#2869ac,#12365d 50%,#0b2547)!important;color:#eef7ff!important;box-shadow:inset 0 0 0 1px #6bc8ff,0 0 6px #337fc6}
${D} .dht-page-subtitle{font:700 13px Tahoma,sans-serif!important;color:#1b3554!important;letter-spacing:1px;text-transform:uppercase;padding:0 8px}
${D} input[aria-label="Search games"]{border:2px solid #52657e!important;border-radius:5px!important;background:linear-gradient(#09192e,#13345b)!important;color:#e0eeff!important;padding:10px 14px!important;font:16px Tahoma,sans-serif!important;box-shadow:inset 0 2px 7px #0008;min-height:42px;box-sizing:border-box}
${D} input::placeholder{color:#9fb8d3}
${D} .dht-page-body{min-height:0!important;overflow:hidden}
${D} .dht-page-list{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:12px;align-content:start;grid-auto-rows:max-content;background:linear-gradient(110deg,#0a1a32,#123861 50%,#0a1e3b);border:2px solid #536983;border-radius:7px;padding:15px!important;box-shadow:inset 0 0 0 1px #8daed766,inset 0 3px 12px #0008;scroll-padding:15px;scrollbar-color:#afc1d4 #102340}
${D} .dht-destination-row{position:relative;display:flex;flex-direction:column;align-items:stretch!important;gap:8px!important;min-width:0;min-height:0!important;margin:0!important;padding:9px!important;border:2px solid #6c819c!important;border-radius:6px!important;background:linear-gradient(120deg,#e2e9f2,#8297b0 30%,#c3d1e0 75%,#637b98)!important;box-shadow:inset 0 0 0 1px #eef8ff99,0 3px 6px #0008;color:#dceeff!important;outline:none!important}
${D} .dht-row-icon{display:block;width:100%;height:auto;flex:0 0 auto;aspect-ratio:3/2;box-sizing:border-box;overflow:hidden;border:2px solid #0c1b30;box-shadow:0 1px #f0f7ff99;background:#0b203d}
${D} .dht-row-icon img,${D} .dht-row-icon>div{width:100%!important;height:100%!important;border-radius:0!important;object-fit:cover;object-position:50% 22%}
${D} .dht-row-text{display:block;min-width:0;background:linear-gradient(#153a69,#0b2449);border:1px solid #526d8e;padding:8px 6px;text-align:center;flex:1}
${D} .dht-row-label{font:700 14px Tahoma,sans-serif!important;line-height:1.35!important;overflow-wrap:anywhere;color:#e9f4ff}
${D} .dht-row-sub{font:11px Tahoma,sans-serif!important;line-height:1.5!important;color:#a8c4e5;margin-top:5px!important}
${D} .dht-destination-row[data-selected="true"]{border-color:#a8e5ff!important;box-shadow:inset 0 0 0 1px #fff,0 0 0 2px #378acb,0 0 14px #4aacf8a0}
${D} .dht-destination-row[data-selected="true"] .dht-row-text{background:linear-gradient(#205d98,#103764)}
${D} .dht-page-footer{background:linear-gradient(#163d6c,#0a2245);border:1px solid #526f91;border-radius:5px;padding:8px 15px;color:#c4d9f1!important;font:12px Tahoma,sans-serif!important;letter-spacing:1px}
${D} .dht-page-footer:after{content:'● GAME COLLECTION';float:right;color:#67d9fa}
`;
