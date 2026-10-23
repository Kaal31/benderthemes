// Wii Menu look on top of NINTENDO_CSS (Wii only), matched to captures of the 4.3 System Menu: the channel
// grid's size, the title balloon over the selected channel, the pulsing focus frame, the blue page arrows,
// and the bottom bar with its blue edge, the round Wii / Mail buttons (130 px, blue rim, grey bevelled face)
// in capsule grooves that run in from the screen edges, the SD Card button and the clock in the bar's dip
// (the clock itself is wiiClock.tsx).
export const WII_CSS=`
.nt-wii .wii-native-channel{z-index:2;border-radius:inherit}.nt-wii .wii-native-scene{z-index:0}.nt-wii .wii-native-controls{z-index:3}

.nt-wii .nt-grid{left:104px;right:108px;top:66px;height:492px;gap:16px 15px}
.nt-wii .nt-tile{border:2px solid #c3c7ca;border-radius:20px;box-shadow:0 1px 2px #6b7a8433}
.nt-wii .nt-tile[data-focus=true]{border:3px solid #34bdf0}
.nt-wii[data-motion=true] .nt-tile[data-focus=true]{animation:nt-wii-pulse .9s ease-in-out infinite alternate}
@keyframes nt-wii-pulse{from{box-shadow:0 0 0 2px #c4f0ff,0 0 5px #1ca4e740}to{box-shadow:0 0 0 4px #9fe3ff,0 0 18px #1ca4e7b0}}
.nt-wii .nt-tile{overflow:visible}.nt-wii .nt-tile>:first-child{border-radius:inherit;overflow:hidden}
/* Keep the artwork and glass in the same fixed aperture; balloons and hands remain outside it. */
.nt-wii-art-frame{position:absolute;inset:0;display:block;border-radius:inherit;overflow:hidden;isolation:isolate}
.nt-wii-art{position:absolute;inset:0;display:block}
.nt-wii .nt-channel{position:absolute;inset:0;width:100%;overflow:hidden}
.nt-wii .nt-tile:after{z-index:1}
.nt-wii .nt-tile .nt-game-label{top:auto;bottom:calc(100% - 38px);left:50%;right:auto;width:max-content;max-width:430px;translate:-50% 0;padding:9px 30px;border-radius:30px;background:#fff;border:2px solid #c9ced1;box-shadow:0 3px 8px #3a556640;color:#4d5257;text-shadow:none;font-size:30px;overflow:visible;z-index:3;opacity:0;scale:.4;transform-origin:50% 100%;transition:opacity .12s,scale .12s}
.nt-wii .nt-tile[data-focus=true] .nt-game-label{opacity:1;scale:1;transition:opacity .15s .4s,scale .2s cubic-bezier(.3,1.5,.6,1) .4s}
.nt-wii .nt-pages{display:none}
.nt-wii .nt-arrow{color:transparent!important;text-shadow:none;width:46px;height:64px;top:300px;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 60 80'%3E%3Cdefs%3E%3ClinearGradient id='a' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%237fdcff'/%3E%3Cstop offset='.5' stop-color='%2322aee6'/%3E%3Cstop offset='1' stop-color='%230b84c4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M14 8 Q8 4 8 12 V68 Q8 76 14 72 L52 44 Q57 40 52 36 Z' fill='url(%23a)' stroke='%23fff' stroke-width='5' stroke-linejoin='round'/%3E%3Cpath d='M16 16 V38 L40 38 Z' fill='%23fff' opacity='.35'/%3E%3C/svg%3E") center/contain no-repeat;filter:drop-shadow(0 2px 3px #3a6f8a66)}
.nt-wii .nt-prev{left:28px;scale:-1 1}.nt-wii .nt-next{right:28px}
.nt-wii .nt-arrow:disabled{opacity:0}
.nt-wii[data-motion=true] .nt-next:not(:disabled){animation:nt-wii-nudge 1.4s ease-in-out infinite}.nt-wii[data-motion=true] .nt-prev:not(:disabled){animation:nt-wii-nudge-l 1.4s ease-in-out infinite}
@keyframes nt-wii-nudge{50%{translate:5px 0}}@keyframes nt-wii-nudge-l{50%{translate:-5px 0}}
/* Theme options: the zoomed-out 20-channel page, a steady highlight, moving previews, the pointer, the blinking clock colon and burn-in dimming. */
.nt-wii[data-zoom=true] .nt-grid{gap:11px 13px}
.nt-wii[data-zoom=true] .nt-tile .nt-game-label{font-size:14px;padding:6px 5px}
.nt-wii[data-zoom=true] .nt-channel svg{width:44px;height:44px}
.nt-wii[data-zoom=true] .nt-channel strong{font-size:17px}
.nt-wii[data-zoom=true] .nt-channel small{font-size:12px}
.nt-wii[data-zoom=true] .nt-empty-word{font-size:34px}
.nt-wii[data-highlight=steady] .nt-tile[data-focus=true]{animation:none;box-shadow:0 0 0 3px #b1ecff,0 0 12px #1ca4e790}
.nt-wii[data-preview=moving][data-motion=true] .nt-tile[data-focus=true] .nt-wii-art{animation:nt-wii-preview 7s ease-in-out infinite alternate}
@keyframes nt-wii-preview{from{scale:1.02;translate:0 0}to{scale:1.16;translate:-4% -3%}}
.dht-wii-wallpaper{position:absolute;inset:0;z-index:-1;pointer-events:none;background:var(--dht-wii-wallpaper,var(--dht-wii-skin-wallpaper,none)) center/var(--dht-wii-wallpaper-size,cover) no-repeat}
.nt-wii-hand-skin{width:76px;height:76px;rotate:0deg;right:4%;bottom:0}.nt-wii-hand-skin img{position:absolute;inset:0;width:100%;height:100%;object-fit:contain}.nt-wii-hand-skin .nt-wii-hand-b{display:none}.nt-wii .nt-tile:active .nt-wii-hand-skin .nt-wii-hand-b{display:block}.nt-wii .nt-tile:active .nt-wii-hand-skin .nt-wii-hand-a{display:none}
.nt-wii-hand{position:absolute;right:8%;bottom:6%;z-index:3;pointer-events:none;filter:drop-shadow(1px 2px 2px #0005);rotate:-18deg}
.nt-wii[data-motion=true] .nt-wii-hand{animation:nt-wii-hand 2.6s ease-in-out infinite}
@keyframes nt-wii-hand{50%{translate:2px -3px}}
.nt-wii-dim{position:absolute;inset:0;z-index:30;background:#000;opacity:0;pointer-events:none;transition:opacity 1.5s}
.nt-wii-dim[data-on=true]{opacity:.55;pointer-events:auto}
.nt-wii-footer{top:auto;bottom:0;left:0;right:0;height:240px;border:0;border-radius:0;box-shadow:none;padding:0;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1280 240' preserveAspectRatio='none'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23f4f5f6'/%3E%3Cstop offset='.35' stop-color='%23e4e6e8'/%3E%3Cstop offset='1' stop-color='%23d3d6d9'/%3E%3C/linearGradient%3E%3ClinearGradient id='s' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23c3c7cb'/%3E%3Cstop offset='.5' stop-color='%23d9dcdf'/%3E%3Cstop offset='1' stop-color='%23e9ebed'/%3E%3C/linearGradient%3E%3C/defs%3E%3Cpath d='M-4,244 V19 H232 C318,19 352,105 452,105 H828 C928,105 962,19 1048,19 H1284 V244 Z' fill='url(%23g)' stroke='%233fb6e6' stroke-width='4'/%3E%3Cpath d='M-4,244 V19 H232 C318,19 352,105 452,105 H828 C928,105 962,19 1048,19 H1284 V244 Z' transform='translate(0,4)' fill='none' stroke='%23fff' stroke-opacity='.9' stroke-width='3'/%3E%3Crect x='-80' y='35' width='291' height='160' rx='80' fill='url(%23s)' stroke='%23b3b8bd' stroke-width='2'/%3E%3Crect x='-80' y='37' width='291' height='158' rx='79' fill='none' stroke='%23fff' stroke-opacity='.7' stroke-width='2' transform='translate(0,2)'/%3E%3Crect x='1069' y='35' width='291' height='160' rx='80' fill='url(%23s)' stroke='%23b3b8bd' stroke-width='2'/%3E%3Crect x='1069' y='37' width='291' height='158' rx='79' fill='none' stroke='%23fff' stroke-opacity='.7' stroke-width='2' transform='translate(0,2)'/%3E%3C/svg%3E") 0 0/100% 100% no-repeat}
.nt-wii .nt-footer-left button:first-child,.nt-wii .nt-mail{position:absolute;top:50px;width:130px;height:130px;border-radius:50%;border:3.5px solid #45bfe9;background:radial-gradient(circle at 40% 30%,#fbfbfb 0,#e6e7e8 32%,#d0d2d4 72%,#bfc2c5 100%);box-shadow:inset 0 0 0 2px #ffffffc0,inset -5px -8px 14px #9da3a840,5px 7px 9px #4a586233,1px 2px 2px #4a586233;color:#a6a9ac!important;font-size:43px!important;font-weight:700;letter-spacing:-1px;text-shadow:0 1px 0 #fff,0 -1px 0 #7d838826;display:grid;place-items:center;margin:0;padding:0}
.nt-wii .nt-footer-left button:first-child{left:64px}.nt-wii .nt-mail{right:64px;left:auto}.nt-wii .nt-mail svg{width:62px;color:#a3a8ac;filter:drop-shadow(0 1px 0 #fff)}
.nt-wii .nt-footer-left button:first-child[data-focus=true],.nt-wii .nt-mail[data-focus=true]{border-color:#2fb6ee;filter:drop-shadow(0 0 6px #3bcbff)}
.nt-wii .nt-footer-left button+button{position:absolute;left:232px;top:96px;width:56px;height:76px;padding:0;display:grid;place-items:center;filter:drop-shadow(1px 2px 1px #4a586233)}.nt-wii .nt-sd-card{width:52px;height:70px}
.nt-wii .nt-date{left:420px;right:420px;top:6px}
.nt-wii-clock{position:relative;display:block;height:92px}.nt-date .nt-wii-clock>span{position:absolute;inset:0;margin:0;transition:opacity .5s}
.nt-date .nt-wii-word{font-size:44px;line-height:92px;letter-spacing:0;color:#8f9497;opacity:0}.nt-date .nt-wii-clock[data-intro=true] .nt-wii-word{opacity:1}.nt-wii-clock[data-intro=true] .nt-wii-time{opacity:0}
.nt-date .nt-wii-time{font-size:80px;line-height:92px;letter-spacing:8px;color:#8f9497;font-weight:300}.nt-wii-time small{font-size:26px;letter-spacing:1px;margin-left:12px;font-weight:500}
.nt-wii-time b{font-weight:inherit;display:inline-block;width:.3em}.nt-wii[data-colon=blink][data-motion=true] .nt-wii-time b{animation:nt-wii-colon 2s steps(1) infinite}
@keyframes nt-wii-colon{50%{opacity:0}}
.nt-wii .nt-date>span{margin-top:22px;font-size:46px;font-weight:600;color:#7f8487;letter-spacing:1px}
`;
