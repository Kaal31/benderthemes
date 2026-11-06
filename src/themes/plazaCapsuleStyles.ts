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
.nt-wiiu:not([data-authored-frames=true]) .nt-plaza-game[data-focus=true]{box-shadow:inset 0 0 0 1px #fff,0 0 0 2px #f1ffff,0 0 0 5px var(--dht-wiiu-accent,#28c3ec),0 0 17px #33c4f055,0 8px 10px -7px #415f5c65}
`;
