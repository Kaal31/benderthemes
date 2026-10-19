export const SILVER_CSS=String.raw`
.silver-home{position:absolute;width:1280px;height:800px;transform-origin:0 0;overflow:hidden;color:#292929;font-family:"Segoe UI",Arial,sans-serif;background:repeating-linear-gradient(0deg,#ffffff12 0px,#00000008 1px,transparent 2px,transparent 4px),linear-gradient(110deg,#e9e9e9,#fafafa 25%,#bcbcbc 52%,#f5f5f5 80%,#d1d1d1)}
.silver-home *{box-sizing:border-box}.silver-home button{font:inherit;color:inherit;cursor:pointer;border:0;background:none;padding:0}.silver-home button:focus-visible{outline:3px solid #537586;outline-offset:3px}.silver-top{position:absolute;top:15px;left:48px;right:45px;height:48px;display:flex;align-items:center;justify-content:space-between}.silver-top>div{display:flex;align-items:center;gap:18px}.silver-top b{font-size:14px;letter-spacing:6px}.silver-top time{font-size:16px;letter-spacing:2px}.silver-avatar{width:44px;height:44px;border-radius:12px!important;background:#60666c!important;overflow:hidden}.silver-avatar img{width:100%;height:100%;object-fit:cover}.silver-shell{position:absolute;inset:77px 0 70px;border-radius:100px/60px;border:2px solid #8c8c8c;box-shadow:inset 0 3px 2px #fff,inset 0 -4px 3px #fff,0 4px 2px #fff;background:linear-gradient(105deg,#bbb5,#fff7 28%,#8882 55%,#fff8 80%,#aaa5)}
.silver-nav{position:absolute;left:12px;top:150px;width:130px;bottom:100px;display:flex;flex-direction:column;gap:23px;padding:8px 0;border-radius:48px;background:linear-gradient(90deg,#fff8,#aaa2);border-right:1px solid #fff}.silver-nav button{height:62px;display:flex;align-items:center;gap:10px;font-size:13px;text-align:left;border-radius:35px;padding:6px!important}.silver-nav button i{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(125deg,#fff,#bbb);box-shadow:0 1px 2px #888,inset 0 1px 1px #fff}.silver-nav button[data-focus=true]{background:linear-gradient(#fafafa,#ddd);box-shadow:0 1px 3px #999,inset 0 1px 2px white}.silver-nav button span{font-size:10px;color:#888}.silver-home-button>svg{margin:8px}.silver-steam{margin-top:auto;font-size:10px!important;letter-spacing:1px;background:linear-gradient(#eee,#bbb)!important;box-shadow:0 1px 3px #888,inset 0 1px 2px #fff}.silver-steam span{color:#946c3c!important}
.silver-carousel{position:absolute;left:150px;top:79px;width:980px;height:294px;overflow:hidden;perspective:1000px;border-bottom:1px solid #fff7}.silver-cover{position:absolute;top:4px;width:182px;height:245px;border:2px solid #c7c7c7!important;border-radius:10px;overflow:visible;transform-origin:50% 100%;box-shadow:0 5px 8px #0004;transition:left .42s cubic-bezier(.22,1,.36,1),transform .42s cubic-bezier(.22,1,.36,1),width .42s cubic-bezier(.22,1,.36,1),height .42s cubic-bezier(.22,1,.36,1),border-width .42s cubic-bezier(.22,1,.36,1),box-shadow .3s ease,opacity .42s ease;will-change:transform,left}.silver-cover img{border-radius:8px}.silver-cover[data-selected=true]{border:5px solid #fafafa!important;box-shadow:0 0 0 1px #999,0 5px 12px #0004;height:250px;width:199px}.silver-empty{text-align:center;padding:70px}
.silver-panel{border:1px solid #fff;border-radius:24px;background:linear-gradient(130deg,#fff9,#bbb4);box-shadow:inset 0 0 0 1px #bbb6,0 1px 3px #8883}.silver-now{position:absolute;left:151px;top:378px;width:340px;height:176px;padding:15px;display:flex;gap:15px}.silver-now>div{min-width:0}.silver-now small{font-size:13px}.silver-now h2{margin:5px 0;font-size:21px;line-height:1.15;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}.silver-now p{font-size:12px;color:#666;margin:7px 0 16px}.silver-actions{display:flex;gap:9px}.silver-actions button{background:linear-gradient(#fafafa,#ccc)!important;border:1px solid #fff!important;border-radius:25px;padding:10px 15px!important;box-shadow:0 2px 4px #8885;font-size:12px;white-space:nowrap}.silver-recent{position:absolute;left:151px;top:558px;width:360px;height:159px;padding:14px 18px}.silver-recent p,.silver-feature>p{margin:2px 0 12px;font-size:15px;color:#555}.silver-recent p span,.silver-feature>p span{float:right}.silver-recent>div{display:flex;gap:6px}.silver-recent button{height:99px;width:60px;border-radius:7px;overflow:hidden;box-shadow:0 3px 3px #5555}
.silver-wheel{position:absolute;left:470px;top:327px;width:340px;height:340px;border-radius:50%;touch-action:none;user-select:none;border:2px solid #fff;background:linear-gradient(130deg,#eee,#aaa 45%,#fefefe 60%,#bbb);box-shadow:0 0 0 4px #c7c7c7,0 0 0 6px #fff,0 8px 20px #0002;overflow:hidden}.silver-wheel-grain{position:absolute;inset:9px;border-radius:50%;background:repeating-radial-gradient(circle at center,transparent 0px,#00000009 1px,transparent 2px,transparent 3px),conic-gradient(from 10deg,#fff7,#8883,#fff9,#9993,#fff7);pointer-events:none;transition:transform .2s}.silver-wheel button{position:absolute;z-index:1;color:#444}.silver-wheel-menu{top:36px;left:125px;width:86px;height:35px;font-size:16px!important}.silver-wheel-prev{left:26px;top:145px;width:55px;height:45px;font-size:19px!important}.silver-wheel-next{right:26px;top:145px;width:55px;height:45px;font-size:19px!important}.silver-wheel-play{bottom:29px;left:143px;width:50px;height:45px;font-size:23px!important}.silver-wheel-center{left:99px;top:99px;width:138px;height:138px;border-radius:50%;border:2px solid #666!important;background:linear-gradient(135deg,#aaa,#ddd 45%,#f5f5f5)!important;box-shadow:0 0 0 2px #fff9,inset 0 0 20px #aaa4}.silver-wheel-caption{position:absolute;top:696px;left:492px;width:296px;text-align:center;font-size:10px;letter-spacing:2px;color:#666}.silver-wheel-caption span{display:block;margin-top:8px;letter-spacing:4px}
.silver-journey{position:absolute;left:805px;top:378px;width:325px;height:176px;padding:12px}.silver-journey>button,.silver-feature>button{position:relative;width:100%;height:100%;border-radius:13px;overflow:hidden;background:#363e43!important;text-align:left;color:#fff}.silver-journey button>div,.silver-feature button>div{position:absolute;bottom:0;left:0;right:0;padding:26px 15px 12px;background:linear-gradient(transparent,#000d)}.silver-home h3{font-size:17px;margin:0 0 4px}.silver-journey p,.silver-feature button p{font-size:12px;margin:0;color:#ddd}.silver-feature{position:absolute;left:789px;top:558px;width:341px;height:159px;padding:12px}.silver-feature>p{margin:0 8px 10px}.silver-feature>button{height:108px}.silver-right{position:absolute;left:1142px;top:160px;width:124px;display:flex;flex-direction:column;gap:16px}.silver-device{height:159px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}.silver-device p{margin:3px 0;font-size:12px;color:#666}.silver-right>button{display:flex;align-items:center;justify-content:center;gap:9px;height:57px;font-size:12px;background:linear-gradient(#fafafa,#ccc)!important;border-radius:30px;border:1px solid #fff!important;box-shadow:0 1px 3px #9996}.silver-tip{text-align:center;padding:15px 4px;height:162px}.silver-tip>span{font-size:47px;color:#666}.silver-tip p{font-size:12px;margin:6px}.silver-tip small{font-size:11px;color:#777;line-height:1.6}.silver-footer{position:absolute;bottom:24px;left:46px;right:46px;display:flex;align-items:center;justify-content:space-between;font-size:11px;letter-spacing:2px}.silver-footer b{display:inline-grid;place-items:center;width:26px;height:26px;background:#555;border-radius:50%;color:white;margin-right:8px;font-size:16px}.silver-footer small{letter-spacing:4px;color:#777}/* Sculpted right-hand windows follow the wheel, like the supplied reference. */
.silver-journey{left:790px;width:340px;padding:14px 14px 14px 24px;border-radius:24px 24px 24px 38px;clip-path:path("M 0 0 H 316 Q 340 0 340 24 V 152 Q 340 176 316 176 H 36 Q 14 176 18 154 Q 33 92 4 30 Q -8 8 0 0 Z")}
.silver-journey>button{clip-path:path("M 0 0 H 288 Q 302 0 302 14 V 134 Q 302 148 288 148 H 18 Q 3 148 6 133 Q 18 77 0 23 Z");border-radius:14px}
.silver-feature{left:775px;width:355px;height:159px;padding:14px 14px 12px 18px;border-radius:52px 24px 24px 24px;clip-path:path("M 54 0 H 331 Q 355 0 355 24 V 135 Q 355 159 331 159 H 24 Q 0 159 0 135 V 76 Q 0 62 14 48 L 44 10 Q 50 0 54 0 Z")}
.silver-feature>p{margin-left:35px}.silver-feature>button{height:107px;clip-path:path("M 28 0 H 309 Q 323 0 323 14 V 93 Q 323 107 309 107 H 14 Q 0 107 0 93 V 40 Q 0 31 7 24 L 22 5 Q 25 0 28 0 Z")}
.silver-menu-scrim{position:absolute;inset:0;z-index:30;background:#0005!important}.silver-nav{z-index:31;top:85px;bottom:75px;left:8px;width:220px;padding:20px 12px;background:linear-gradient(100deg,#f3f3f3,#c5c5c5);box-shadow:12px 0 35px #0004;border:1px solid white;gap:18px}.silver-nav button{font-size:16px;height:65px}.silver-wheel button{transition:box-shadow .08s,filter .08s,transform .08s;border-radius:22px}.silver-wheel .silver-wheel-center{border-radius:50%}.silver-wheel-menu{top:15px;left:100px;width:136px;height:70px}.silver-wheel-prev{left:8px;top:112px;width:80px;height:112px}.silver-wheel-next{right:8px;top:112px;width:80px;height:112px}.silver-wheel-play{bottom:8px;left:108px;width:120px;height:76px}.silver-wheel[data-pressed=menu] .silver-wheel-menu,.silver-wheel[data-pressed=prev] .silver-wheel-prev,.silver-wheel[data-pressed=next] .silver-wheel-next,.silver-wheel[data-pressed=play] .silver-wheel-play{box-shadow:inset 2px 3px 9px #0004,inset -1px -1px 3px #fff9;background:#9992;transform:translateY(1px)}.silver-wheel[data-pressed=center] .silver-wheel-center{box-shadow:inset 3px 4px 12px #0005!important;filter:brightness(.9);transform:translateY(1px)}.silver-home[data-motion=false] *{transition:none!important}

/* Reference pixels supply the surfaces; CSS only positions and animates them. */
.silver-home{background-image:var(--silver-metal);background-repeat:repeat-y;background-size:100% 16px}
.silver-shell{inset:0;border:0;border-radius:0;box-shadow:none;background:var(--silver-frame) center/100% 100% no-repeat;pointer-events:none}
.silver-panel{border:0;box-shadow:none;background-image:var(--silver-panelMetal);background-size:100% 100%}
.silver-now{background-image:var(--silver-nowFrame),var(--silver-panelMetal);background-size:100% 100%}
.silver-recent{background-image:var(--silver-recentFrame),var(--silver-panelMetal);background-size:100% 100%}
.silver-journey{background-image:var(--silver-journeyFrame),var(--silver-panelMetal);background-size:100% 100%}
.silver-feature{background-image:var(--silver-featureFrame),var(--silver-panelMetal);background-size:100% 100%}.silver-feature>p{visibility:hidden}
.silver-actions button,.silver-right>button,.silver-nav{background-image:var(--silver-button)!important;background-size:100% 100%!important;border:0!important;box-shadow:none}
.silver-wheel{border:0;background:transparent;box-shadow:none;overflow:visible;transition:transform 100ms ease-out;transform:perspective(850px) rotateX(0deg) rotateY(0deg);transform-origin:50% 50%}
.silver-wheel-grain{inset:0;background:var(--silver-wheel) center/100% 100% no-repeat;border-radius:50%;transition:none;box-shadow:0 5px 8px #0002}
.silver-wheel button,.silver-wheel .silver-wheel-center{background:transparent!important;border:0!important;box-shadow:none!important;color:transparent!important;transform:none!important;filter:none!important}
.silver-wheel[data-pressed=menu]{transform:perspective(850px) rotateX(4deg)}
.silver-wheel[data-pressed=play]{transform:perspective(850px) rotateX(-4deg)}
.silver-wheel[data-pressed=prev]{transform:perspective(850px) rotateY(-4deg)}
.silver-wheel[data-pressed=next]{transform:perspective(850px) rotateY(4deg)}
.silver-wheel[data-pressed=center]{transform:perspective(850px) translateZ(-3px) scale(.994)}
.silver-wheel[data-pressed]:not([data-pressed=""]) .silver-wheel-grain{box-shadow:0 2px 4px #0003}

/* Match the surrounding silver rather than backing cutouts with darker gray. */
.silver-panel{background-color:transparent;background-image:none}
.silver-now{background-image:var(--silver-nowFrame)}
.silver-recent{background-image:var(--silver-recentFrame)}
.silver-journey{background-image:var(--silver-journeyFrame)}
.silver-feature{background-image:var(--silver-featureContour);background-size:100% 100%;background-repeat:no-repeat}
.silver-device,.silver-tip{background:transparent;border:0;box-shadow:none}
.silver-actions button,.silver-right>button{background-color:transparent!important;background-image:var(--silver-metal)!important;background-size:100% 100%!important}
.silver-feature>p{visibility:visible}

/* Separate flipped artwork with blur and fade; clip each reflection to its carousel lane. */
.silver-cover{-webkit-box-reflect:unset;box-shadow:none;background:transparent!important}
.silver-cover img{-webkit-box-reflect:unset}
.silver-cover-reflection{position:absolute;top:calc(100% + 3px);left:50%;transform:translateX(-50%);max-width:100%;height:60px;overflow:hidden;pointer-events:none;opacity:.28;-webkit-mask-image:linear-gradient(to bottom,#000,transparent 95%),linear-gradient(to right,transparent,#000 12%,#000 88%,transparent);-webkit-mask-composite:source-in;mask-image:linear-gradient(to bottom,#000,transparent 95%),linear-gradient(to right,transparent,#000 12%,#000 88%,transparent);mask-composite:intersect}
.silver-cover-reflection img{position:absolute;top:0;left:50%;transform:translateX(-50%) scaleY(-1);filter:blur(1.5px);border-radius:0!important}
.silver-cover-reflection{transition:width .42s cubic-bezier(.22,1,.36,1),opacity .35s ease}.silver-cover-reflection img{transition:width .42s cubic-bezier(.22,1,.36,1),height .42s cubic-bezier(.22,1,.36,1)}
.silver-cover[data-selected=true] .silver-cover-reflection{opacity:.42}
@media(prefers-reduced-motion:reduce){.silver-cover,.silver-cover-reflection,.silver-cover-reflection img{transition:none!important}}
.silver-cover[data-selected=true]{box-shadow:0 0 0 1px #fff}
.silver-panel{background-color:transparent!important;box-shadow:none!important;border:0!important}

/* Buttons retain their hit areas without opaque texture patches. */
.silver-actions button,.silver-right>button,.silver-nav button,.silver-nav button[data-focus=true],.silver-steam{background:transparent!important;border:0!important;box-shadow:none!important}
.silver-nav button i{background:transparent;box-shadow:none}
.silver-actions button:hover,.silver-right>button:hover{outline:1px solid #ffffff88;outline-offset:-1px}

/* Raised reference faces, with transparency only outside their silhouette. */
.silver-actions button:first-child{width:128px;height:46px;padding:0!important;background:var(--silver-playButton) center/100% 100% no-repeat!important;color:transparent!important;border-radius:24px}
.silver-actions button:last-child{width:48px;height:46px;padding:0!important;background:var(--silver-moreButton) center/100% 100% no-repeat!important;color:transparent!important;border-radius:24px}
.silver-right>button{background:var(--silver-capsuleButton) center/100% 100% no-repeat!important;border-radius:30px}
.silver-actions button:active,.silver-right>button:active{transform:translateY(1px);filter:brightness(.96)}

.silver-right:before{content:"";position:absolute;z-index:-1;left:-10px;right:-10px;top:-76px;bottom:-44px;background:var(--silver-rightHousing) center/100% 100% no-repeat;pointer-events:none}
.silver-nav{left:2px;top:84px;bottom:auto;width:144px;height:603px;padding:0;display:block;border-radius:0;transform:none;opacity:1;background:var(--silver-leftPanel) center/100% 100% no-repeat!important;border:0;box-shadow:none}
.silver-nav button{position:absolute;left:10px;width:124px;height:59px;padding:0!important;font-size:0!important;color:transparent!important;background:transparent!important;border:0!important;box-shadow:none!important}
.silver-nav button img,.silver-nav button svg,.silver-nav button i{visibility:hidden}
.silver-nav button:nth-child(1){top:68px;height:64px}
.silver-nav button:nth-child(2){top:150px}
.silver-nav button:nth-child(3){top:232px}
.silver-nav button:nth-child(4){top:314px}
.silver-nav button:nth-child(5){top:398px}
.silver-nav button:nth-child(6){top:528px;height:48px;margin:0}
.silver-nav button:active{backdrop-filter:brightness(.94)}
.silver-home-button:after,.silver-steam:after{content:"";position:absolute;top:50%;transform:translateY(-50%);border-radius:50%;opacity:0;transition:opacity .16s ease;pointer-events:none}
.silver-home-button:after{right:11px;width:8px;height:8px;background:radial-gradient(circle at 40% 35%,#fff,#ddf5ff 45%,#8ccce5);box-shadow:0 0 5px #e7f9ff,0 0 11px #b1e7ff}
.silver-steam:after{right:20px;width:11px;height:11px;background:radial-gradient(circle at 38% 30%,#fff4c2,#ffc267 45%,#e58a24);box-shadow:0 0 5px #ffca75,0 0 12px #ffad4c}
.silver-home-button[data-lit=true]:after,.silver-steam[data-lit=true]:after{opacity:1}

.silver-feature{clip-path:none;border-radius:0}
.silver-feature>button{height:107px;clip-path:path("M 44 0 H 309 Q 323 0 323 14 V 93 Q 323 107 309 107 H 14 Q 0 107 0 93 V 51 Q 0 42 9 33 L 33 8 Q 40 0 44 0 Z");border-radius:0}
.silver-cover-floor{position:absolute;left:-24px;top:326px;width:1328px;height:59px;pointer-events:none;overflow:hidden}
.silver-cover-floor:before{content:"";position:absolute;left:-8%;top:0;width:116%;height:195px;transform-origin:50% 0;transform:perspective(500px) rotateX(69deg);background:var(--silver-panelMetal) center/180px 150px repeat-x;filter:none;opacity:1}
.silver-panel-dock{position:absolute;left:0;top:82px;width:150px;height:607px;z-index:20;pointer-events:none;background:var(--silver-rightHousing) center/100% 100% no-repeat;transform:scaleX(-1);filter:brightness(.94)}
.silver-home:not([data-dark=true]) .silver-nav{transform:none;opacity:1;visibility:visible}
.silver-home:not([data-dark=true]) .silver-avatar{width:46px;height:46px;border-radius:13px!important;overflow:hidden;background:transparent!important;box-shadow:0 1px 2px #0003}
.silver-avatar img{display:block;width:100%;height:100%;object-fit:cover}
.silver-right>.silver-device{padding:9px 5px 12px;gap:5px;background:var(--silver-rightDeviceFrame) center/100% 100% no-repeat}
.silver-right>.silver-tip{padding:20px 8px;font-size:12px;background:var(--silver-rightTipFrame) center/100% 100% no-repeat}
.silver-right>button{height:57px;letter-spacing:.1px}

/* Anchor every cover to the same contact line, slightly inside the floor. */
.silver-home:not([data-dark=true]) .silver-cover{top:auto;bottom:35px}
.silver-right{isolation:isolate}
`;
