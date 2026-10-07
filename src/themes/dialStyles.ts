export const DIAL_CSS = `
.alien-projection{filter:hue-rotate(var(--alien-skin-hue,0deg))}
.alien-dial[data-skin=crimson] .alien-projection{filter:url(#alien-main-red)}

.alien-rhombus-morph{animation:alienRhombusOpen 650ms cubic-bezier(.4,0,.2,1) both}
@keyframes alienRhombusOpen{0%{d:path("M123 104 Q230 69 337 104 L247 230 L337 356 Q230 391 123 356 L207 230 Z")}100%{d:path("M230 88 Q230 88 230 88 L339 230 L230 372 Q230 372 230 372 L121 230 Z")}}
.alien-dial[data-motion=false] .alien-rhombus-morph{animation:none}
@media(prefers-reduced-motion:reduce){.alien-rhombus-morph{animation:none}}

.alien-dial{position:absolute;inset:0;overflow:hidden;color:#c5cac5;font-family:Arial,sans-serif;--alien-green:var(--dht-dial-green,#57ff00);background:var(--dht-dial-bg,radial-gradient(ellipse at 34% 44%,#172215,#080d08 48%,#000))}

.alien-projection{position:absolute;z-index:6;pointer-events:none;perspective:900px;animation:alienProjectIn .4s ease-out both}
.alien-projection-light{position:absolute;left:-45%;top:-13.333%;width:190%;height:126.667%;overflow:visible;pointer-events:none;mix-blend-mode:screen}
.alien-light-volume{animation:alienLightBreathe 4.8s ease-in-out infinite}
.alien-light-streams{animation:alienLightStreams 3.4s ease-in-out infinite;transform-origin:100px 150px}
@keyframes alienLightBreathe{0%,100%{opacity:.7}50%{opacity:1}}
@keyframes alienLightStreams{0%,100%{opacity:.5;transform:scaleX(.99)}50%{opacity:.85;transform:scaleX(1.015)}}
.alien-hologram-float{position:absolute;inset:0;transform:rotateY(-9deg) rotateZ(-1deg);animation:alienFloat 4s ease-in-out infinite}
.alien-hologram-card{position:absolute;inset:0;overflow:hidden;opacity:.72;mix-blend-mode:screen;box-shadow:0 0 1px 1px #8aff6488,0 0 22px #4aff0040;mask-image:linear-gradient(#000 82%,#0008 97%,transparent)}
.alien-hologram-art{position:absolute;inset:0;filter:url(#alien-main-image-green) contrast(1.18);opacity:.86}
.alien-hologram-scan{position:absolute;inset:0;background:repeating-linear-gradient(0deg,#00200048 0px,#00200048 1px,transparent 1px,transparent 4px);box-shadow:inset 0 0 22px #65ff0025}
.alien-hologram-glint{position:absolute;inset:0;background:linear-gradient(175deg,transparent 20%,#abff9920 46%,transparent 52%);background-size:100% 220%;animation:alienScan 4.5s linear infinite}
@keyframes alienFloat{0%,100%{transform:translateY(0) rotateY(-9deg) rotateZ(-1deg)}50%{transform:translateY(-7px) rotateY(-6deg) rotateZ(0)}}
@keyframes alienProjectIn{from{opacity:0;transform:translateY(28px) scaleY(.8)}to{opacity:1;transform:none}}
@keyframes alienScan{to{background-position:0 220%}}
.alien-dial[data-motion=false] .alien-projection,.alien-dial[data-motion=false] .alien-projection *,.alien-dial[data-animation=none] .alien-projection,.alien-dial[data-animation=none] .alien-projection *{animation:none!important}
@media(prefers-reduced-motion:reduce){.alien-projection,.alien-projection *{animation:none!important}}
.alien-dial *{box-sizing:border-box}
.alien-dial button{font:inherit;color:inherit;background:none;border:0;padding:0;cursor:pointer;text-align:left}
.alien-dial button:disabled{cursor:default}
.alien-dial button:focus-visible{outline:1px solid var(--alien-green);outline-offset:6px}

.alien-scenery,.alien-wall{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;pointer-events:none}

.alien-header{position:absolute;left:31px;right:32px;top:23px;display:flex;align-items:center;gap:40px;z-index:7;font-size:16px;font-weight:400;height:33px}
.alien-steam{display:flex;align-items:center;gap:10px;font-size:13px!important;font-weight:600!important;letter-spacing:1.8px;color:#e0e5e2!important;border-radius:22px!important;padding:4px 12px 4px 4px!important;background:linear-gradient(160deg,#242b28aa,#090d0ba0)!important;box-shadow:inset 0 1px 0 #ffffff18,0 2px 5px #0005;transition:background .18s,color .18s}
.alien-steam-mark{display:grid;place-items:center;width:29px;height:29px;border-radius:50%;color:#e7ece9;filter:drop-shadow(0 1px 1px #0008)}
.alien-steam-mark svg{width:27px;height:27px}
.alien-steam:hover,.alien-steam:focus-visible{color:#fff!important;background:linear-gradient(160deg,#39443faa,#121a16)!important}
.alien-steam:hover .alien-steam-mark{color:#fff}
.alien-header nav{display:flex;gap:30px}
.alien-header nav button{padding:7px 0;border-bottom:1px solid transparent}
.alien-header nav button[data-active=true]{color:var(--alien-green)}
.alien-header nav button[data-selected=true]{border-bottom-color:var(--alien-green);text-shadow:0 0 10px #57ff00}
.alien-status{display:flex;align-items:center;gap:25px;margin-left:auto;font-size:16px}
.alien-mini{width:35px;height:35px;border-radius:50%;border:2px solid #545e48;background:#030603;box-shadow:0 0 0 1px #000,inset 0 0 5px #a6dd7590;padding:3px}

.alien-mechanism{position:absolute;z-index:5;filter:drop-shadow(4px 13px 8px #000d) drop-shadow(-1px -1px 1px #a8b7a520)}
.alien-mechanism svg,.alien-dial-reflection svg{width:100%;height:100%;overflow:visible}
.alien-bezel{transform-origin:230px 230px;transition:transform 360ms cubic-bezier(.2,.75,.25,1)}
.alien-dial[data-launching=true] .alien-mechanism{filter:drop-shadow(0 0 22px #69ef2980)}
.alien-dial[data-launching=true] .alien-core-light{filter:brightness(1.65)}
.alien-core-light{transition:filter .25s}.alien-hourglass-halo{opacity:0;transition:opacity .4s}.alien-mechanism svg[data-active=true] .alien-hourglass-halo{opacity:.7}
.alien-floor-light{position:absolute;height:170px;z-index:0;background:radial-gradient(ellipse at center top,#74eb142a,transparent 66%);pointer-events:none}

.alien-dial-reflection{position:absolute;transform:scaleY(-1);opacity:.18;filter:blur(2.6px);mask-image:linear-gradient(to top,#fff9,transparent 52%);-webkit-mask-image:linear-gradient(to top,#fff9,transparent 52%);pointer-events:none}

.alien-carousel{position:absolute;inset:0;pointer-events:none}
.alien-game{position:absolute;pointer-events:auto;transition:left 340ms cubic-bezier(.2,.75,.25,1),top 340ms,width 340ms,height 340ms;isolation:isolate}
.alien-cover{position:relative;width:100%;height:100%;overflow:hidden;border-radius:10px;border:2px solid #68726982;box-shadow:0 1px 0 #9faa9580,inset 0 0 0 2px #000,0 8px 16px #000a;filter:brightness(.32) saturate(.62);transition:filter .3s,box-shadow .3s}
.alien-cover-glass{position:absolute;inset:0;background:linear-gradient(130deg,#fff2,transparent 34%,#0005);box-shadow:inset 0 0 0 2px #ffffff0d;border-radius:inherit}
.alien-game[data-selected=true] .alien-cover{filter:brightness(.95) saturate(.97);border:2px solid #afff00;box-shadow:0 0 0 1px #1c4500,0 0 13px #8eff0066,inset 0 0 0 2px #c4ed5044}
.alien-game[data-selected=true] .alien-cover-glass{background:linear-gradient(135deg,#bbff0015,transparent 40%,#07140655)}

/* Flipped-image + gradient-mask technique adapted from TheRensei (MIT). */
.alien-reflection{position:absolute;top:calc(100% + 7px);left:0;width:100%;height:100%;overflow:hidden;border-radius:10px;transform:scaleY(-1);opacity:var(--dht-dial-refl,.13);filter:blur(var(--dht-dial-refl-blur,2px)) brightness(.65);mask-image:linear-gradient(to top,white,transparent 65%);-webkit-mask-image:linear-gradient(to top,white,transparent 65%);pointer-events:none;transition:opacity .4s cubic-bezier(0,.73,.48,1)}
.alien-game[data-selected=true] .alien-reflection{opacity:var(--dht-dial-refl-focused,.36)}

.alien-footer{position:absolute;left:0;right:0;bottom:29px;height:123px;z-index:6;pointer-events:none}
.alien-game-info{position:absolute;left:43px;top:7px;right:40%;border-top:1px solid #66795a38;padding-top:14px}
.alien-game-info>div{display:flex;align-items:center;gap:15px;font-size:22px;line-height:26px;min-height:26px}
.alien-game-info>div>span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.alien-game-info i{width:21px;height:21px;flex-shrink:0;border-radius:50%;background:radial-gradient(circle at 34% 28%,#85fa45,#29a915 65%,#115206);box-shadow:0 0 7px #53b83235}
.alien-game-info button{display:flex;align-items:center;gap:8px;margin:10px 0 0 38px;font-size:15px;color:#989e96;pointer-events:auto}
.alien-game-info b{color:#57ff00;border:1px solid #6ba145;border-radius:50%;font-size:11px;font-weight:400;width:18px;height:18px;display:grid;place-items:center}
.alien-hints{position:absolute;right:34px;bottom:0;display:flex;gap:27px;padding:12px 16px;border-radius:32px;border-top:1px solid #ffffff09;box-shadow:0 -2px 8px #ffffff03;pointer-events:auto}
.alien-hints button{display:flex;gap:9px;align-items:center;font-size:14px;color:#858c82}
.alien-hints b{width:22px;height:22px;border:1px solid #71796d;border-radius:50%;font-size:13px;font-weight:400;display:grid;place-items:center}
.alien-empty{position:absolute;z-index:4;color:#b8c4ae}
.alien-empty h2{font-size:24px;font-weight:400;margin:0 0 12px}
.alien-empty p{font-size:16px;color:#7e8a77}
.alien-empty button{color:#a4ef60;border-bottom:1px solid #65972b;padding-bottom:4px}

.alien-dial[data-motion=false] *{transition:none!important;animation:none!important}
@media(prefers-reduced-motion:reduce){.alien-dial *{transition:none!important;animation:none!important}}

.alien-classic-motion{position:relative;width:100%;height:100%;overflow:visible}
.alien-model-reflection{position:absolute;left:0;top:100%;width:100%;height:100%;transform:scaleY(-1);opacity:.2;filter:blur(2px);mask-image:linear-gradient(to top,#fff9,transparent 60%);-webkit-mask-image:linear-gradient(to top,#fff9,transparent 60%);pointer-events:none}
.alien-model-status{position:absolute;bottom:0;left:0;right:0;text-align:center;font-size:12px;color:#b8c4ae}
.alien-dial[data-reflections=false] .alien-reflection,.alien-dial[data-reflections=false] .alien-floor-light{display:none}
@keyframes alien-pulse{0%,100%{transform:scale(1)}45%{transform:scale(1.065);filter:brightness(1.3)}}
@keyframes alien-lift{0%,100%{transform:translateY(0)}45%{transform:translateY(-13px);filter:drop-shadow(0 10px 13px #7dff4790)}}
.alien-dial[data-animation=pulse] .alien-classic-motion{animation:alien-pulse 440ms ease-out}
.alien-dial[data-animation=hologram] .alien-classic-motion{animation:alien-lift 440ms ease-out}
.alien-dial[data-animation=none] .alien-game,.alien-dial[data-animation=none] .alien-bezel{transition:none}
.alien-mechanism svg{overflow:visible}
.alien-face-image{transition:opacity 240ms ease-out}
.alien-shutter{transition:transform 420ms cubic-bezier(.2,.75,.2,1)}
.alien-slotted-art{animation:alien-slot 360ms cubic-bezier(.16,.8,.2,1);transform-origin:230px 230px}
@keyframes alien-slot{from{opacity:0;transform:scale(.84)}to{opacity:1;transform:scale(1)}}
.alien-dial[data-animation=none] .alien-slotted-art{animation:none}
.alien-dial[data-animation=none] .alien-shutter,.alien-dial[data-animation=none] .alien-face-image{transition:none}
`;

