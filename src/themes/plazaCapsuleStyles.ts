/** Stock Plaza capsules: artwork continues through a clear, rounded edge. */
export const PLAZA_CAPSULE_CSS=`
.nt-home .nt-plaza-game .nt-plaza-refract{display:none}
.nt-plaza-games[data-icon-glass=true] .nt-plaza-game .nt-plaza-refract{display:block}
.nt-wiiu:not([data-authored-frames=true]) .nt-plaza-game{border:0;border-radius:33px;background:linear-gradient(145deg,#ffffff55,#a8c6bf33 48%,#ecfff766);box-shadow:inset 0 0 0 1px #f1fffac9,inset 2px 2px 3px #ffffff85,inset -2px -3px 3px #789b9470,0 2px 0 #bad3ce60,0 8px 10px -7px #415f5c65}
.nt-wiiu:not([data-authored-frames=true]) .nt-plaza-game .nt-plaza-refract{display:block;inset:0;border-radius:33px;clip-path:inset(0 round 33px);box-shadow:none}
.nt-wiiu:not([data-authored-frames=true]) .nt-plaza-refract>*{scale:1.13;filter:blur(.65px) saturate(.85);opacity:.7}
.nt-wiiu:not([data-authored-frames=true]) .nt-plaza-refract:after{background:linear-gradient(120deg,#eefefb77,transparent 24%,transparent 74%,#b4d5cc55);box-shadow:inset 3px 1px 4px #ffffffe0,inset -3px -2px 5px #799b8c60}
.nt-wiiu:not([data-authored-frames=true]) .nt-plaza-game>.nt-plaza-cover{inset:9px;border-radius:24px!important;clip-path:inset(0 round 24px);background:transparent;box-shadow:0 0 0 1px #e8fff178,0 1px 3px #1e403340}
.nt-wiiu:not([data-authored-frames=true]) .nt-plaza-game img[data-art-source=gitflic-native]{display:none}
.nt-wiiu:not([data-authored-frames=true]) .nt-plaza-cover:after{border-radius:24px;box-shadow:inset 0 0 0 1px #1a403025,inset 0 2px 4px #ffffff20;background:linear-gradient(145deg,#ffffff12,transparent 35%)}
.nt-wiiu:not([data-authored-frames=true]) .nt-plaza-game:after{inset:0;border:0;border-radius:33px;background:radial-gradient(ellipse 65% 12% at 43% 4%,#ffffffe0,transparent 75%),linear-gradient(125deg,#ffffff45,transparent 17%,transparent 83%,#e5fff960);box-shadow:inset 0 0 0 1px #ffffffa0,inset 2px 2px 3px #ffffffe0,inset -2px -2px 3px #71988c55;pointer-events:none}
.nt-wiiu:not([data-authored-frames=true]) .nt-plaza-game[data-focus=true]{box-shadow:inset 0 0 0 1px #fff,0 0 0 1.5px #f1ffff,0 0 0 3.5px var(--dht-wiiu-accent,#28c3ec),0 0 13px #33c4f040,0 8px 10px -7px #415f5c65}
.nt-wiiu[data-view=grid][data-start-focus=true] .nt-tile[data-focus=true]{height:calc(100% + 22px);transform:translateY(-8px) scale(1.06);border:0;border-radius:23px;background:linear-gradient(#25cad7,#00aec4);box-shadow:inset 0 2px 4px #a4f4fa,0 1px 2px #1397a4,0 4px 10px #5c898d70;outline:none!important;z-index:5}
.nt-wiiu[data-view=grid][data-start-focus=true] .nt-tile[data-focus=true]:before,.nt-wiiu[data-view=grid][data-start-focus=true] .nt-tile[data-focus=true]:after{display:none}
.nt-wiiu[data-view=grid][data-start-focus=true] .nt-tile[data-focus=true] .nt-wiiu-art-frame{inset:8px 8px 29px;border-radius:15px!important;clip-path:inset(0 round 15px)!important;border:0!important;box-shadow:0 1px 2px #ffffffe6,0 -1px 3px #047b8e44!important}
.nt-wiiu[data-view=grid][data-start-focus=true] .nt-tile[data-focus=true] .nt-tile-start{display:block;position:absolute;bottom:1px;left:0;right:0;color:#f5ffff;font-size:23px;line-height:27px;text-shadow:0 1px 2px #166274;pointer-events:none;z-index:3}
.nt-wiiu[data-view=grid][data-start-focus=false] .nt-tile[data-focus=true]{height:auto;transform:scale(1.045);border:5px solid #f7fffb99;border-radius:23px;background:linear-gradient(#fff9,#dae7e052);box-shadow:0 0 0 2px white,0 0 0 4px #28c3e3,0 3px 10px #5c898d40}
.nt-wiiu[data-view=grid][data-start-focus=false] .nt-tile[data-focus=true] .nt-wiiu-art-frame{inset:0}
.nt-wiiu[data-view=grid][data-start-focus=false] .nt-tile-start{display:none!important}
`;
