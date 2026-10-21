export const OLD_BETA_CSS=`
.dht-oldbeta{position:absolute;inset:0;overflow:hidden;color:#c5dbe8;font-family:"Segoe UI",Arial,sans-serif;background:radial-gradient(ellipse at 78% 12%,#4d7199 0%,#203f61 30%,#0c2237 65%,#081b29 100%);perspective:1500px}
.dht-oldbeta *{box-sizing:border-box}.dht-oldbeta button,.dht-oldbeta input,.dht-oldbeta select{font:inherit;color:inherit;border:0;border-radius:0}.dht-oldbeta button{cursor:pointer;background:none}.dht-oldbeta button:focus{outline:1px solid #d5f3ff;outline-offset:2px}.dht-oldbeta .beta-header{position:absolute;left:6%;right:6%;top:4%;display:flex;align-items:center;justify-content:space-between;z-index:7;transition:opacity 300ms}.beta-header>div{display:flex;align-items:center;gap:10px}.beta-header button{padding:4px}.beta-avatar{width:32px;height:32px;display:block;overflow:hidden;border:1px solid #d9e5eb}.beta-avatar img{transform:scale(1.25);object-fit:cover;border-radius:0!important}.beta-stamp{display:grid;place-items:center;width:42px;height:42px;border-radius:50%;background:#bbd9e1;color:#264456;font-size:11px;transform:rotate(25deg)}
.dht-oldbeta .beta-light{position:absolute;left:16%;top:24%;width:76%;height:42%;background:radial-gradient(ellipse,#60b5fb42,transparent 65%);filter:blur(15px);pointer-events:none;transition:transform 480ms}
.dht-oldbeta .beta-categories{position:absolute;left:50%;top:39%;transform:translateX(-50%);display:flex;z-index:6;transition:top 480ms cubic-bezier(.2,.7,.2,1)}
.dht-oldbeta .beta-categories button{width:calc(var(--beta-w)*.15);padding:8px 12px;margin:0 1px;background:linear-gradient(#152b3b,#06111e);font-size:clamp(12px,calc(var(--beta-w)*.014),22px);font-weight:300;box-shadow:0 0 18px #071c30bb}
.dht-oldbeta .beta-categories button[aria-pressed=true]{color:#466379;background:linear-gradient(#f5fcff,#c1dce8);box-shadow:0 0 24px #c7f0ff80}.dht-oldbeta .beta-categories button:focus{outline:none}
.dht-oldbeta .beta-perspective{position:absolute;inset:0;perspective:calc(var(--beta-w)*1.15);pointer-events:none}
.dht-oldbeta .beta-cover-board{position:absolute;left:53%;top:40%;transform-style:preserve-3d;transform:rotateX(53deg) rotateZ(-23deg) scale(.84);transition:transform 480ms cubic-bezier(.2,.7,.2,1),top 480ms,left 480ms;pointer-events:none}
.dht-oldbeta .beta-cover{position:absolute;left:0;top:0;padding:0;background:#173b56;transform-origin:center;transition:transform 480ms cubic-bezier(.2,.7,.2,1),width 480ms,height 480ms,opacity 400ms;backface-visibility:hidden;box-shadow:0 3px 8px #0004}
.dht-oldbeta .beta-cover img{display:block;object-fit:cover}.dht-oldbeta .beta-cover>span{display:block;position:absolute;bottom:0;left:0;right:0;padding:3px 5px;background:#e9f2f7;color:#213744;text-align:left;font-size:clamp(10px,calc(var(--beta-w)*.011),17px);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;opacity:0;transition:opacity 200ms}
.dht-oldbeta[data-mode=sheet] .beta-cover{outline:0}.dht-oldbeta:not([data-mode=sheet]) .beta-cover[data-selected=true]{outline:2px solid #ecf9ff;box-shadow:0 0 20px #9bd9ff90}.dht-oldbeta:not([data-mode=sheet]) .beta-cover[data-selected=true]>span{opacity:1}
.dht-oldbeta:not([data-mode=sheet]) .beta-categories{top:5%}.dht-oldbeta:not([data-mode=sheet]) .beta-header{opacity:0;pointer-events:none}.dht-oldbeta:not([data-mode=sheet]) .beta-header button{visibility:hidden}
.dht-oldbeta[data-mode=recent] .beta-cover-board{left:50%;top:42%;transform:rotateX(0deg) rotateZ(0deg) scale(1)}
.dht-oldbeta .beta-recent-label{position:absolute;top:39%;left:7%;font-size:calc(var(--beta-w)*.025);line-height:1.1;font-weight:300;color:#a4bace90;pointer-events:none}
.dht-oldbeta .beta-view-all{position:absolute;left:50%;top:65%;transform:translateX(-50%);padding:9px 22px;background:linear-gradient(#122338,#061522);font-size:16px;line-height:1.2;z-index:6;box-shadow:0 0 18px #07142188}.dht-oldbeta .beta-view-all small{display:block;font-size:9px}.dht-oldbeta .beta-view-all:focus{background:#e8f6fc;color:#35566d;box-shadow:0 0 18px #9dcfff66}
.dht-oldbeta[data-mode=games] .beta-cover-board{left:50%;top:54%;transform:rotateX(0deg) rotateZ(0deg) scale(1)}.dht-oldbeta[data-mode=games] .beta-categories{opacity:.4;transform:translateX(-50%) scale(.75);pointer-events:none}.dht-oldbeta[data-mode=games] .beta-categories button{visibility:hidden}
.dht-oldbeta .beta-games-toolbar{position:absolute;left:0;right:0;top:14%;height:9%;background:#3c75928c;display:flex;align-items:center;gap:25px;padding:0 6%;z-index:6}.dht-oldbeta .beta-games-toolbar h1{font-size:23px;font-weight:300;margin:0 auto 0 0}.dht-oldbeta .beta-games-toolbar select,.dht-oldbeta .beta-games-toolbar input{padding:6px 10px;background:#6993a776;font-size:14px;max-width:25%}
.dht-oldbeta footer{position:absolute;bottom:4%;left:5%;right:5%;display:flex;align-items:center;justify-content:space-between;z-index:8;font-size:12px;color:#a5b8c6}.dht-oldbeta footer>div{display:flex;gap:20px}.dht-oldbeta footer button{padding:5px}.dht-oldbeta footer b{border:1px solid #abc1d0;border-radius:3px;padding:1px 4px;font-size:11px;font-weight:400}.dht-oldbeta .beta-empty{position:absolute;top:48%;left:20%;right:20%;text-align:center;color:#a4c9df}
.dht-oldbeta .beta-light{left:13%;top:18%;width:77%;height:49%;background:radial-gradient(ellipse at 50% 55%,#468de967,#2677df36 36%,transparent 70%);filter:blur(22px);transform:translateX(calc((var(--beta-category) - 1)*var(--beta-w)*.1));transition:transform 620ms cubic-bezier(.18,.75,.22,1),opacity 480ms}
.dht-oldbeta .beta-focus-light{position:absolute;left:27%;top:28%;width:46%;height:30%;pointer-events:none;background:radial-gradient(ellipse,#66bcff5c,#297ce72e 38%,transparent 72%);filter:blur(18px);transform:translateX(calc((var(--beta-category) - 1)*var(--beta-w)*.15));transition:transform 480ms cubic-bezier(.2,.75,.2,1),top 480ms,opacity 480ms}
.dht-oldbeta:not([data-mode=sheet]) .beta-focus-light{top:26%;transform:translateX(0);opacity:.65}.dht-oldbeta:not([data-mode=sheet]) .beta-light{transform:translateX(0);opacity:.65}
.dht-oldbeta .beta-categories{isolation:isolate;gap:0;transition:top 520ms cubic-bezier(.18,.75,.22,1),transform 520ms,opacity 250ms}
.dht-oldbeta .beta-categories::before{content:'';position:absolute;inset:-3px auto -3px 0;width:33.333%;background:linear-gradient(#fff,#e5f4fc);box-shadow:0 0 10px #d5efff9c,0 0 35px #369dff9c;transform:translateX(calc(var(--beta-category)*100%));transition:transform 290ms cubic-bezier(.16,.82,.24,1);z-index:0;pointer-events:none}
.dht-oldbeta .beta-categories button{position:relative;z-index:1;margin:0;width:calc(var(--beta-w)*.15);background:linear-gradient(#0b1729f2,#030b17f2);box-shadow:inset 0 1px #bddcff1f,inset 0 -1px #a0d4ee18;font-weight:300;transition:color 160ms,background-color 160ms,transform 240ms,text-shadow 240ms}
.dht-oldbeta .beta-categories button[aria-pressed=true]{background:transparent;box-shadow:none;color:#8299a9;transform:scaleY(1.08);text-shadow:none}
.dht-oldbeta .beta-categories button:active{transform:scale(.97);transition-duration:80ms}
.dht-oldbeta .beta-cover-board{transition:transform 600ms cubic-bezier(.16,.76,.22,1),top 520ms,left 600ms,opacity 420ms;opacity:1}
.dht-oldbeta[data-mode=sheet][data-category="0"] .beta-cover-board{transform:translate3d(-24%,15%,-260px) rotateX(64deg) rotateZ(-31deg) scale(.7);opacity:.07}
.dht-oldbeta[data-mode=sheet][data-category="2"] .beta-cover-board{transform:translate3d(-18%,8%,-220px) rotateX(62deg) rotateZ(-29deg) scale(.76);opacity:.06}
.dht-oldbeta .beta-cover{transition:transform 520ms cubic-bezier(.16,.76,.22,1),width 520ms,height 520ms,opacity 360ms;transition-delay:var(--tile-delay,0ms)}
.dht-oldbeta[data-mode=sheet] .beta-cover::after{content:'';position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,#1f5d9148,transparent 50%,#153b6859);box-shadow:inset 0 0 0 1px #9dc5de18}
.dht-oldbeta[data-mode=sheet] .beta-cover img{filter:saturate(.65) brightness(.88);transition:filter 400ms}.dht-oldbeta:not([data-mode=sheet]) .beta-cover img{filter:none;transition:filter 400ms}
.dht-oldbeta .beta-secondary-sheet{position:absolute;left:53%;top:40%;width:calc(var(--beta-w)*.78);display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:calc(var(--beta-w)*.009);transform-style:preserve-3d;pointer-events:none;transform:translate(-50%,-50%) translate3d(28%,0,-320px) rotateX(62deg) rotateZ(-30deg) scale(.72);opacity:0;transition:transform 620ms cubic-bezier(.16,.76,.22,1),opacity 420ms;mask-image:radial-gradient(ellipse at 55% 50%,#000 25%,#000c 56%,transparent 77%)}
.dht-oldbeta .beta-sheet-cover{position:relative;aspect-ratio:460/215;transform:translateZ(calc(var(--layer)*14px));background:#19364f;box-shadow:0 3px 12px #0005}
.dht-oldbeta .beta-sheet-cover img{width:100%;height:100%;object-fit:cover;filter:saturate(.55) brightness(.87)}.dht-oldbeta .beta-sheet-cover>span{position:absolute;bottom:5px;left:8px;font-size:14px;color:#cee8f3;text-shadow:0 1px 4px #001127}
.dht-oldbeta[data-mode=sheet][data-category="0"] .beta-store-sheet{opacity:1;transform:translate(-50%,-50%) translate3d(3%,0,0) rotateX(53deg) rotateZ(-23deg) scale(.94)}
.dht-oldbeta .beta-community-sheet{grid-template-columns:repeat(3,minmax(0,1fr));width:calc(var(--beta-w)*.76);gap:calc(var(--beta-h)*.045) 18px;mask-image:radial-gradient(ellipse at 50% 50%,#000 38%,#000d 65%,transparent 85%)}
.dht-oldbeta[data-mode=sheet][data-category="2"] .beta-community-sheet{opacity:1;transform:translate(-50%,-50%) translate3d(0,0,0) rotateX(53deg) rotateZ(-23deg) scale(1)}
.dht-oldbeta .beta-sheet-friend{display:flex;gap:12px;align-items:center;min-height:calc(var(--beta-h)*.105);color:#e0f0fa;transform:translateZ(calc(var(--layer)*12px));font-size:calc(var(--beta-w)*.016);line-height:1.1;text-shadow:0 1px 5px #091b30}
.dht-oldbeta .beta-sheet-friend small{display:block;color:#a8c5df;font-size:.75em;margin-top:4px}.dht-oldbeta .beta-friend-avatar{display:grid;place-items:center;flex:none;width:calc(var(--beta-w)*.055);height:calc(var(--beta-w)*.055);border:2px solid #b9d9ee;background:#28506c;box-shadow:0 2px 10px #0005;overflow:hidden}.dht-oldbeta .beta-friend-avatar img{width:100%;height:100%;object-fit:cover}
.dht-oldbeta .beta-view-all{transition:background 180ms,color 180ms,box-shadow 180ms}.dht-oldbeta .beta-view-all:active{transform:translateX(-50%) scale(.96)}
.dht-oldbeta[data-opening=true] .beta-categories{top:5%;opacity:.35;pointer-events:none}.dht-oldbeta[data-opening=true] .beta-header{opacity:0;pointer-events:none}
.dht-oldbeta[data-mode=recent] .beta-view-all{animation:beta-controls-reveal 360ms 180ms both}
@keyframes beta-controls-reveal{from{opacity:0;filter:blur(3px)}to{opacity:1;filter:blur(0)}}

/* Independent rear cover planes keep their depth while the front unfolds. */
.dht-oldbeta .beta-stacked-sheets{position:absolute;left:0;top:0;transform-style:preserve-3d;pointer-events:none;opacity:0;transition:opacity 330ms,transform 560ms;transform:translateZ(-90px) scale(.94)}
.dht-oldbeta[data-mode=sheet] .beta-stacked-sheets{opacity:1;transform:translateZ(-30px) scale(1)}
.dht-oldbeta .beta-rear-sheet{position:absolute;left:0;top:0;transform-style:preserve-3d;pointer-events:none}
.dht-oldbeta .beta-rear-sheet-1{transform:translate3d(-25px,30px,-55px) rotateZ(-3deg);opacity:.42;animation:beta-rear-one 14s ease-in-out infinite alternate}
.dht-oldbeta .beta-rear-sheet-2{transform:translate3d(24px,60px,-115px) rotateZ(3deg);opacity:.23;animation:beta-rear-two 19s ease-in-out infinite alternate}
.dht-oldbeta .beta-rear-cover{position:absolute;left:0;top:0;background:#23415b;box-shadow:0 2px 5px #020e2170}.dht-oldbeta .beta-rear-cover img{display:block;object-fit:cover;filter:saturate(.4) brightness(.72)}
@keyframes beta-rear-one{from{transform:translate3d(-25px,30px,-55px) rotateZ(-3deg)}to{transform:translate3d(-9px,30px,-55px) rotateZ(-3deg)}}
@keyframes beta-rear-two{from{transform:translate3d(24px,60px,-115px) rotateZ(3deg)}to{transform:translate3d(5px,60px,-115px) rotateZ(3deg)}}
.dht-oldbeta[data-mode=sheet] .beta-cover{animation:beta-cover-hover 11s ease-in-out infinite alternate;animation-delay:calc(var(--tile-delay)*-40)}
@keyframes beta-cover-hover{from{translate:0 0}to{translate:8px 0}}
.dht-oldbeta:not([data-mode=sheet]) .beta-rear-sheet{animation-play-state:paused}
/* Faint defocused circles drifting through the blue atmosphere. */
.dht-oldbeta{background:radial-gradient(ellipse at 88% 7%,#4e709a80,transparent 51%),radial-gradient(ellipse at 53% 40%,#1c3d69,transparent 68%),linear-gradient(125deg,#0c1933,#152e51 60%,#18385e)}
.dht-oldbeta .beta-ambient{position:absolute;inset:0;overflow:hidden;pointer-events:none;mask-image:radial-gradient(ellipse at center,#000 35%,#0008 80%,transparent)}
.dht-oldbeta .beta-ambient i{position:absolute;display:block;width:var(--dot-size);aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 40% 40%,#b6e4f5aa,#78acd061 45%,#5d93be10 74%,transparent 76%);opacity:var(--dot-alpha);filter:blur(1.1px);animation:beta-ambient-float var(--dot-time) linear infinite;animation-delay:var(--dot-delay)}
.dht-oldbeta .beta-ambient i:nth-child(6n){background:transparent;border:1px solid #9ed5ef;filter:blur(1.8px)}
@keyframes beta-ambient-float{0%{transform:translate3d(-8px,75px,0) scale(.8);opacity:0}18%{opacity:var(--dot-alpha)}80%{opacity:var(--dot-alpha)}100%{transform:translate3d(25px,-115px,0) scale(1.12);opacity:0}}

/* Idle community movement uses the independent translate/rotate properties,
   leaving the category-sweep and page-unfold transforms free to animate. */
.dht-oldbeta .beta-community-sheet{animation:beta-community-orbit 46s ease-in-out infinite alternate}
.dht-oldbeta .beta-sheet-friend{animation:beta-friend-scroll var(--friend-time,38s) ease-in-out infinite alternate;animation-delay:var(--friend-phase,0s)}
@keyframes beta-community-orbit{from{translate:-7px 4px;rotate:-1deg}to{translate:9px -6px;rotate:1.1deg}}
@keyframes beta-friend-scroll{0%{translate:-12px 14px;rotate:-.8deg}50%{translate:0 -3px;rotate:0deg}100%{translate:14px -18px;rotate:1deg}}
.dht-oldbeta:not([data-mode=sheet]) .beta-community-sheet,.dht-oldbeta:not([data-mode=sheet]) .beta-sheet-friend,.dht-oldbeta:not([data-category="2"]) .beta-community-sheet,.dht-oldbeta:not([data-category="2"]) .beta-sheet-friend{animation-play-state:paused}
.dht-oldbeta .beta-rear-sheet-1{opacity:.48}.dht-oldbeta .beta-rear-sheet-2{opacity:.3}
.dht-oldbeta .beta-rear-cover:nth-child(3n){animation:beta-cover-hover 17s ease-in-out infinite alternate}.dht-oldbeta .beta-rear-cover:nth-child(3n+1){animation:beta-cover-hover 23s -8s ease-in-out infinite alternate-reverse}
.dht-oldbeta:not([data-mode=sheet]) .beta-rear-cover{animation-play-state:paused}
/* Broad blue haze and soft bokeh from the unobstructed 0:06–0:09 frames. */
.dht-oldbeta{background:radial-gradient(ellipse at 93% 3%,#6389b285,transparent 54%),radial-gradient(ellipse at 45% 40%,#23497677,transparent 64%),linear-gradient(115deg,#0b1830,#142d50 58%,#1e3e65)}
.dht-oldbeta .beta-ambient{mask-image:linear-gradient(#000b,#000 30%,#000 88%,#0009)}
.dht-oldbeta .beta-ambient::before{content:'';position:absolute;inset:-15%;background:radial-gradient(ellipse at 80% 22%,#85b0dc10,transparent 40%),radial-gradient(ellipse at 22% 70%,#58a2d00c,transparent 40%);filter:blur(22px);animation:beta-atmosphere 35s ease-in-out infinite alternate}
@keyframes beta-atmosphere{from{translate:-1% 0;opacity:.6}to{translate:2% -1%;opacity:1}}
.dht-oldbeta .beta-ambient i{filter:blur(1.7px)}.dht-oldbeta .beta-ambient i:nth-child(6n){border-color:#8dc1e88c;filter:blur(2px)}
.dht-oldbeta.no-motion *,.dht-oldbeta.no-motion *::before,.dht-oldbeta.no-motion *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}@media(prefers-reduced-motion:reduce){.dht-oldbeta *,.dht-oldbeta *::before,.dht-oldbeta *::after{transition:none!important;animation:none!important;scroll-behavior:auto!important}}
`;
