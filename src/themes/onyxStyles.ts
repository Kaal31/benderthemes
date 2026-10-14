export const ONYX_CSS=String.raw`
.silver-home[data-dark=true]{background:#191919 var(--silver-metal) center/100% 100% no-repeat;color:#ddd}
[data-dark=true] .silver-shell,[data-dark=true] .silver-nav,[data-dark=true] .silver-now,[data-dark=true] .silver-recent,[data-dark=true] .silver-journey,[data-dark=true] .silver-feature,[data-dark=true] .silver-right,[data-dark=true] .silver-cover-floor{display:none}
.onyx-tabs{position:absolute;left:60px;right:60px;top:52px;height:42px;display:flex;gap:42px;align-items:center;z-index:2}.onyx-tabs button{color:#777!important;font-size:20px!important;transition:color .3s ease,transform .3s ease;transform:translateY(0)}.onyx-tabs button[data-active=true]{color:#fff!important;transform:translateY(-2px)}.onyx-tabs button:after{content:"";display:block;width:5px;height:5px;border-radius:50%;background:white;margin:8px auto;opacity:0;transform:translateY(-4px);transition:opacity .3s,transform .3s}.onyx-tabs button[data-active=true]:after{opacity:1;transform:translateY(0)}
[data-dark=true] .silver-top{left:auto;right:45px;top:22px;height:25px;color:#999;font-size:11px}[data-dark=true] .silver-top>div{gap:12px}[data-dark=true] .silver-top time{font-size:12px}[data-dark=true] .silver-avatar{width:25px;height:25px}
[data-dark=true] .silver-carousel{left:45px;top:128px;width:1190px;height:350px;background:transparent;border:1px solid #ffffff09;border-radius:35px;box-shadow:inset 0 2px 12px #000;perspective:900px}
[data-dark=true] .silver-cover{margin-left:105px;top:24px;border-color:#252525!important;box-shadow:0 10px 20px #0008}[data-dark=true] .silver-cover[data-selected=true]{border:2px solid #ddd!important;width:225px;height:270px;box-shadow:0 0 22px #000}
[data-dark=true] .silver-cover-reflection{opacity:.28;height:55px}
[data-dark=true] .silver-wheel{left:498px;top:496px;width:284px;height:284px}
[data-dark=true] .silver-wheel-menu{top:3%;left:30%;width:40%;height:21%}
[data-dark=true] .silver-wheel-prev{left:2%;top:33%;width:26%;height:34%}
[data-dark=true] .silver-wheel-next{right:2%;top:33%;width:26%;height:34%}
[data-dark=true] .silver-wheel-play{bottom:2%;left:33%;width:34%;height:23%}
[data-dark=true] .silver-wheel-center{left:29%;top:29%;width:42%;height:42%}[data-dark=true] .silver-wheel-grain{box-shadow:none}
[data-dark=true] .silver-wheel-caption{top:425px;transition:top .48s cubic-bezier(.22,1,.36,1);left:430px;width:420px;color:#aaa;z-index:3;font-size:10px;letter-spacing:1px}[data-dark=true] .silver-wheel-caption strong{display:block;color:#fff;font-size:18px;font-weight:400;line-height:22px;letter-spacing:0}[data-dark=true] .silver-wheel-caption small{display:block;margin-top:2px;font-size:12px;line-height:16px;letter-spacing:0}[data-dark=true] .silver-wheel-caption span{display:none}
[data-dark=true] .silver-footer{bottom:20px;color:#777}[data-dark=true] .silver-footer b{background:#292929;color:#aaa}
.onyx-screen{position:absolute;left:45px;top:128px;width:1190px;height:350px;border-radius:35px;background:#050606;box-shadow:inset 0 2px 12px #000;border:1px solid #ffffff09;overflow:hidden}
[data-dark=true] .silver-carousel{box-shadow:none;border:0;mask-image:linear-gradient(to right,transparent,#000 14%,#000 86%,transparent)}
[data-dark=true] .silver-cover{transition:left .48s cubic-bezier(.22,1,.36,1),transform .48s cubic-bezier(.22,1,.36,1),opacity .48s ease}
[data-dark=true]:not([data-page=Games]) .silver-carousel,[data-dark=true]:not([data-page=Games]) .silver-wheel-caption{display:none}
.onyx-screen h2{font-size:23px;font-weight:400;margin:14px 0 6px}.onyx-screen p{color:#888;margin:6px 0;font-size:14px}.onyx-screen button{color:#bbb;padding:8px 14px;border-radius:8px}.onyx-screen button:hover{background:#ffffff0c;color:white}
.onyx-music{text-align:center;padding:20px 32px}.onyx-albums{display:flex;justify-content:center;gap:20px;max-height:120px;overflow:auto}.onyx-albums button{display:grid;gap:6px;min-width:100px}.onyx-albums img{width:75px;height:75px;object-fit:cover;margin:auto;border-radius:6px}.onyx-albums button>span{font-size:46px}.onyx-albums small{font-size:11px}.onyx-playback{display:flex;justify-content:center;gap:24px;margin:12px}.onyx-music input{width:55%;accent-color:#aaa}
.onyx-library{scrollbar-width:none;display:grid;grid-template-columns:repeat(6,1fr);gap:18px;padding:25px;overflow:auto;height:100%}.onyx-library button{display:flex;flex-direction:column;align-items:center;gap:9px;font-size:12px}.onyx-library img{border-radius:6px}
.onyx-discover{padding:16px 30px;text-align:center}.onyx-discover>div{display:flex;gap:20px;margin:12px 0}.onyx-discover>div button{flex:1;min-width:0;padding:0;overflow:hidden;background:#111}.onyx-discover span{display:block;padding:8px;font-size:13px}
.onyx-more{width:500px;margin:25px auto}.onyx-more button{position:relative;display:block;width:100%;text-align:left;border:0;border-radius:16px;padding:14px 18px;margin:4px 0;background:transparent;transition:background-color .24s ease,transform .28s cubic-bezier(.22,1,.36,1),box-shadow .24s ease;outline:none!important;overflow:hidden;-webkit-tap-highlight-color:transparent}.onyx-more button span{float:right;color:#666}
[data-dark=true][data-carousel=icons] .silver-cover{top:43px;width:220px;height:220px;border-radius:3px;border:1px solid #333!important;transform-origin:50% 100%}
[data-dark=true][data-carousel=icons] .silver-cover[data-selected=true]{width:220px;height:220px;border:1px solid #ddd!important}
[data-dark=true][data-carousel=icons] .silver-cover img{border-radius:2px;object-fit:cover}
[data-dark=true][data-carousel=icons] .silver-cover-reflection{max-width:none;width:100%!important;height:68px;opacity:.4;mask-image:linear-gradient(to bottom,#000,transparent 95%);-webkit-mask-image:linear-gradient(to bottom,#000,transparent 95%)}
[data-dark=true][data-carousel=square] .silver-cover,[data-dark=true][data-carousel=square] .silver-cover[data-selected=true]{top:43px;width:220px;height:220px;border-radius:14px}
[data-dark=true][data-carousel=square] .silver-cover>img{border-radius:12px}
.onyx-screen>div{animation:onyx-page-in .3s ease both}
@keyframes onyx-page-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@media(prefers-reduced-motion:reduce){.onyx-tabs button,.onyx-tabs button:after{transition:none}.onyx-screen>div{animation:none}}
.onyx-library::-webkit-scrollbar{display:none;width:0;height:0}
.onyx-more button:hover{background:#ffffff08}
.onyx-more button:focus-visible{outline:none!important;background:#ffffff12;box-shadow:inset 0 0 0 1px #ffffff0c}
.onyx-more button:active{transform:scale(.977);background:#ffffff1c;box-shadow:inset 0 0 20px #ffffff03;transition-duration:.1s}
.onyx-more button span{transition:transform .28s cubic-bezier(.22,1,.36,1),color .24s}
.onyx-more button:focus-visible span,.onyx-more button:hover span{color:#bbb;transform:translateX(3px)}
@media(prefers-reduced-motion:reduce){.onyx-more button,.onyx-more button span{transition:none}.onyx-more button:active{transform:none}}
.onyx-music{height:100%;display:grid;grid-template-columns:140px 210px minmax(0,1fr);align-items:center;gap:32px;padding:30px 48px;text-align:left}
.onyx-albums{height:100%;max-height:none;display:flex;flex-direction:column;justify-content:flex-start;gap:8px;overflow:auto;scrollbar-width:none;border-right:1px solid #ffffff0b;padding-right:16px}
.onyx-albums::-webkit-scrollbar{display:none}.onyx-albums button{min-width:0;display:grid;grid-template-columns:38px 1fr;align-items:center;gap:9px;padding:8px;border-radius:12px;text-align:left;transition:background .25s,transform .2s}.onyx-albums button[data-active=true]{background:#ffffff12}.onyx-albums img{width:38px;height:38px;margin:0;border-radius:7px}.onyx-albums button>span{font-size:28px;text-align:center}.onyx-albums small{font-size:11px;line-height:1.4;color:#999}.onyx-albums button:active{transform:scale(.97)}
.onyx-now-art{width:210px;height:210px;display:grid;place-items:center;border-radius:18px;background:#171719;box-shadow:0 16px 32px #0009,inset 0 0 0 1px #ffffff0b;overflow:hidden}.onyx-now-art img{width:100%;height:100%;object-fit:cover}.onyx-now-art>span{font-size:86px;color:#555}
.onyx-track{max-width:580px;min-width:0}.onyx-eyebrow{font-size:10px;letter-spacing:2px;color:#666}.onyx-track h2{font-size:26px;font-weight:600;letter-spacing:-.6px;line-height:1.2;margin:12px 0 7px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.onyx-track>p{font-size:15px;color:#888;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.onyx-progress{margin-top:25px}.onyx-progress input{width:100%;height:4px;margin:0;display:block;accent-color:#ddd;cursor:pointer}.onyx-progress>div{display:flex;justify-content:space-between;font-size:11px;font-variant-numeric:tabular-nums;color:#666;margin-top:9px}
.onyx-playback{display:flex;align-items:center;justify-content:center;gap:30px;margin:14px 0 0}.onyx-playback button{width:48px;height:48px;padding:0;font-size:20px;border-radius:50%;background:transparent;transition:transform .2s ease,background .25s;color:#ddd}.onyx-playback .onyx-play-toggle{width:58px;height:58px;background:#ffffff0f;font-size:25px}.onyx-playback button:active{transform:scale(.9);background:#ffffff21}.onyx-playback button:focus-visible{outline:none!important;background:#ffffff1c}.onyx-playback button:disabled{opacity:.3;cursor:default}.onyx-track .onyx-music-note{font-size:11px;color:#666;margin-top:10px;white-space:normal}
[data-dark=true][data-motion=false] .onyx-screen>div{animation:none}
[data-dark=true][data-motion=false] .onyx-tabs button:after{transition:none}
[data-dark=true][data-carousel=square] .silver-wheel-caption,[data-dark=true][data-carousel=icons] .silver-wheel-caption{top:402px}
.onyx-glass-screen{position:absolute;left:45px;top:128px;width:1190px;height:350px;border-radius:35px;z-index:20;pointer-events:none;display:none;overflow:hidden}
[data-screen-glass=clear] .onyx-glass-screen,[data-screen-glass=prism] .onyx-glass-screen{display:block;background:linear-gradient(120deg,#ffffff12,transparent 34%,#ffffff02 55%,#ffffff09);box-shadow:inset 0 1px 1px #ffffff44,inset 1px 0 1px #ffffff16,inset 0 -1px 2px #ffffff17,0 4px 14px #0005;border:1px solid #ffffff16}
[data-screen-glass=prism] .onyx-glass-screen{background:linear-gradient(125deg,#a78bfa14,transparent 28%,#67e8f908 55%,#6ee7b70a),linear-gradient(120deg,#ffffff12,transparent 34%,#ffffff02 55%,#ffffff09);box-shadow:inset 0 1px 2px #c4b5fd66,inset -1px 0 2px #67e8f94d,inset 0 -1px 2px #6ee7b733}
[data-cover-glass=clear] .silver-cover:after,[data-cover-glass=prism] .silver-cover:after{content:"";position:absolute;inset:0;border-radius:inherit;pointer-events:none;background:linear-gradient(125deg,#ffffff30,transparent 33%,transparent 62%,#ffffff0a);box-shadow:inset 0 1px 2px #ffffffaa,inset 1px 0 1px #ffffff30,inset -1px -1px 3px #ffffff40;border:1px solid #ffffff25;transition:opacity .35s;opacity:.8}
[data-cover-glass=prism] .silver-cover:after{background:linear-gradient(125deg,#a78bfa25,transparent 30%,#67e8f90a 65%,#6ee7b718),linear-gradient(125deg,#ffffff30,transparent 33%,transparent 62%,#ffffff0a);box-shadow:inset 0 1px 2px #ddd6feaa,inset -2px 0 3px #67e8f955,inset 0 -1px 3px #6ee7b744}
[data-cover-glass]:not([data-cover-glass=off]) .silver-cover:hover:after{opacity:1}
.onyx-screen button[data-wheel-focus=true]{outline:none!important;background:#ffffff16;box-shadow:inset 0 0 0 1px #ffffff18;color:#fff;border-radius:14px}
.onyx-more,.onyx-discover{max-height:100%;overflow:auto;scrollbar-width:none}
.onyx-more::-webkit-scrollbar,.onyx-discover::-webkit-scrollbar{display:none}
[data-dark=true] .silver-top{top:20px;height:32px;color:#c6c8ce}
[data-dark=true] .silver-top>div{gap:14px;align-items:center}
[data-dark=true] .silver-top button{display:grid;place-items:center;width:30px;height:30px;border-radius:50%;transition:background .22s,transform .2s}
[data-dark=true] .silver-top button:hover,[data-dark=true] .silver-top button:focus-visible{background:#ffffff10;outline:none}
[data-dark=true] .silver-top button:active{transform:scale(.93);background:#ffffff1c}
[data-dark=true] .silver-avatar{width:30px;height:30px;border-radius:50%!important;background:#ffffff0d!important;color:#c6c8ce}
[data-dark=true] .silver-top time{letter-spacing:.6px;font-variant-numeric:tabular-nums;font-size:12px}
.onyx-play-toggle{display:grid;place-items:center}
.onyx-play-morph{width:42px;height:42px;overflow:visible;transform:translateX(1px);transition:transform .32s cubic-bezier(.22,1,.36,1)}
.onyx-play-morph path{fill:currentColor;stroke:currentColor;stroke-width:1.2;stroke-linejoin:round;transition:d .32s cubic-bezier(.22,1,.36,1)}
.onyx-play-morph-left{d:path("M18 13 L25 17.5 L25 30.5 L18 35 Z")}
.onyx-play-morph-right{d:path("M25 17.5 L35 24 L35 24 L25 30.5 Z")}
.onyx-play-toggle[data-playing=true] .onyx-play-morph{transform:translateX(0)}
.onyx-play-toggle[data-playing=true] .onyx-play-morph-left{d:path("M15 14 L21 14 L21 34 L15 34 Z")}
.onyx-play-toggle[data-playing=true] .onyx-play-morph-right{d:path("M27 14 L33 14 L33 34 L27 34 Z")}
@media(prefers-reduced-motion:reduce){.onyx-play-morph,.onyx-play-morph path{transition:none}}
[data-dark=true][data-motion=false] .onyx-play-morph,[data-dark=true][data-motion=false] .onyx-play-morph path{transition:none}
[data-dark=true] .silver-footer b{width:28px;height:28px;border:1px solid #ffffff30;background:radial-gradient(circle at 50% 65%,#303131,#202121 78%);color:#c1c3c5;box-shadow:inset 0 2px 4px #000a,inset 0 -1px 1px #ffffff0d,0 1px 0 #ffffff20,0 -1px 0 #0008;text-shadow:0 1px 1px #0009;font-size:15px;font-weight:600}
[data-dark=true] .silver-footer b{display:inline-flex;align-items:center;justify-content:center;line-height:1;letter-spacing:0;padding:0;vertical-align:middle;font-family:"Segoe UI",Arial,sans-serif}

`;
