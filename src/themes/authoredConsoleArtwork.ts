// Independently drawn fallback vectors. No firmware images or traced paths.
export const authoredSvg=(body:string,w=128,h=w)=>'data:image/svg+xml;base64,'+btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${body}</svg>`);
const shapes:Record<string,string>={
 game:'<path d="M35 43Q23 43 19 60L12 87Q11 100 23 100Q30 100 42 83H86Q98 100 105 100Q117 100 116 87L109 60Q105 43 93 43Z"/><path d="M34 54V76M23 65H45" fill="none" stroke="var(--cut,#fff)" stroke-width="7"/><circle cx="88" cy="59" r="4" fill="var(--cut,#fff)"/><circle cx="99" cy="70" r="4" fill="var(--cut,#fff)"/>',
 avatar:'<ellipse cx="64" cy="23" rx="13" ry="16"/><path d="M53 42Q64 38 75 42L86 71L80 75L71 56L75 88L84 118H73L63 92L55 118H44L53 85L56 57L46 77L39 73Z"/>',
 friends:'<circle cx="45" cy="38" r="14"/><circle cx="87" cy="38" r="14"/><path d="M17 96V80Q17 59 45 59Q64 59 66 75Q72 59 88 59Q112 59 112 80V96Z"/>',
 library:'<path d="M18 29H95V38H18ZM18 44H110V53H18ZM18 59H104V108H18Z"/><path d="M43 70V96M63 70V96M83 70V96" stroke="var(--cut,#fff)" stroke-width="5"/>',
 video:'<rect x="15" y="27" width="98" height="75" rx="4"/><path d="M52 44L84 64L52 85Z" fill="var(--cut,#fff)"/>',
 music:'<path d="M50 30L103 18V82H94V37L59 45V94H50Z"/><ellipse cx="37" cy="97" rx="22" ry="14"/><ellipse cx="82" cy="84" rx="21" ry="14"/>',
 photo:'<path d="M13 26H115V105H13Z"/><path d="M22 94L47 62L67 81L85 56L107 94Z" fill="var(--cut,#fff)"/><circle cx="41" cy="47" r="9" fill="var(--cut,#fff)"/>',
 store:'<path d="M22 47H106L113 111H15ZM43 48V34Q43 12 64 12Q85 12 85 34V48H76V34Q76 21 64 21Q52 21 52 34V48Z"/>',
 mail:'<rect x="12" y="30" width="104" height="73" rx="5"/><path d="M16 36L64 73L112 36" fill="none" stroke="var(--cut,#fff)" stroke-width="7"/>',
 apps:'<path d="M17 20H57V60H17ZM71 20H111V60H71ZM17 74H57V114H17ZM71 74H111V114H71Z"/>',
 gear:'<path d="M52 13H76L80 28L93 35L109 32L121 53L109 64L109 79L120 91L108 111L91 107L78 114L74 127H51L47 112L34 105L18 109L6 88L18 76V62L7 50L19 30L35 34L48 27Z" transform="translate(0 -6) scale(1 .94)"/><circle cx="64" cy="61" r="22" fill="var(--cut,#fff)"/>',
 power:'<path d="M44 27A43 43 0 1 0 84 27" fill="none" stroke="currentColor" stroke-width="12"/><path d="M64 12V64" fill="none" stroke="currentColor" stroke-width="12"/>',
 download:'<path d="M54 13H76V63H101L65 99L29 63H54ZM17 100H28V112H101V100H112V123H17Z"/>',
 palette:'<path d="M65 13C19 13 4 45 13 77C20 101 36 118 57 115C73 113 69 96 85 94C106 97 121 79 117 57C113 30 91 13 65 13Z"/><g fill="var(--cut,#fff)"><circle cx="36" cy="52" r="8"/><circle cx="58" cy="34" r="8"/><circle cx="85" cy="39" r="8"/><circle cx="99" cy="63" r="8"/></g>',
 search:'<circle cx="53" cy="51" r="33" fill="none" stroke="currentColor" stroke-width="11"/><path d="M78 77L113 112" stroke="currentColor" stroke-width="13"/>',
 globe:'<circle cx="64" cy="64" r="45"/><ellipse cx="64" cy="64" rx="21" ry="45"/><path d="M19 64H109M28 38H100M28 90H100"/>',
};
export function authoredGlyph(role:string,color='#fff',cut='#748370'){
 return authoredSvg(`<g fill="${color}" color="${color}" style="--cut:${cut}">${shapes[role]??shapes.apps}</g>`);
}
export const authoredKinectCard=(role:string)=>authoredSvg(`<defs><linearGradient id="paper" x2=".25" y2="1"><stop stop-color="#fcfdf8"/><stop offset="1" stop-color="#e2e9d9"/></linearGradient><linearGradient id="ribbon" x2="1" y2="0"><stop stop-color="#74a824"/><stop offset="1" stop-color="#b5d35b"/></linearGradient></defs><rect width="420" height="200" fill="url(#paper)"/><path d="M344 -8Q306 88 340 208H365Q332 91 369 -8Z" fill="url(#ribbon)"/><path d="M380 -8Q345 90 377 208H388Q356 91 392 -8Z" fill="#d3e5a0"/><image href="${authoredGlyph(role,'#527d22','#eef3e8')}" x="140" y="36" width="120" height="128"/>`,420,200);
export const authoredXboxIcon=(role:string,color='#fff')=>authoredSvg(`<g fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${shapes[role]??shapes.apps}</g><style>path,rect,circle,ellipse{fill:none!important;stroke:${color}!important;stroke-width:6!important}</style>`);
// Familiar console-era pictograms, drawn independently with slightly different silhouettes.
const wiiuBadge=(role:string,ink:string)=>{
 const symbols:Record<string,string>={
  miiverse:'<rect x="21" y="17" width="86" height="90" rx="14"/><path d="M27 107H101" stroke="#bf6c13" stroke-width="4"/><g fill="#fff"><rect x="39" y="39" width="9" height="13" rx="3"/><rect x="79" y="39" width="9" height="13" rx="3"/></g><path d="M40 70Q64 95 89 69" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>',
  friends:'<circle cx="43" cy="33" r="14"/><circle cx="85" cy="33" r="14"/><path d="M30 53Q43 47 55 54L66 79L57 83L52 70L55 107H44L40 85L36 107H25L30 70L24 83L16 79Z"/><path d="M73 53Q85 47 97 54L110 79L102 83L96 70L101 107H90L85 85L82 107H71L76 70L69 83L61 79Z"/><path d="M37 28Q44 23 50 29M79 28Q85 23 92 29" fill="none" stroke="#f3ffe5" stroke-width="3"/>',
  store:'<path d="M29 42H100L109 108H19Z"/><path d="M44 43V30Q44 10 64 10Q84 10 84 30V43" fill="none" stroke="#cf8d12" stroke-width="7"/><path d="M25 53H103L107 99H21Z" fill="#ffe67d" opacity=".35"/><path d="M30 47L25 101" stroke="#fff2b4" stroke-width="3"/>',
  browser:'<circle cx="64" cy="62" r="46"/><g fill="none" stroke="#effbff" stroke-width="6"><ellipse cx="64" cy="62" rx="21" ry="43"/><path d="M20 62H108M28 37H100M28 87H100"/></g><path d="M36 22Q64 9 89 25" fill="none" stroke="#a8e9ff" stroke-width="3"/>',
  messages:'<path d="M19 22H109V87H70L43 110V87H19Z"/><path d="M28 31H100V78H65L51 89V78H28Z" fill="#effeff"/><path d="M39 43H89M39 54H89M39 65H77" stroke="#29b9c5" stroke-width="5" stroke-linecap="round"/>',
  downloads:'<path d="M23 65L64 45L105 65V103L64 119L23 103Z"/><path d="M24 66L64 83L104 66M64 83V115" fill="none" stroke="#d1f7ff" stroke-width="3"/><path d="M53 10H76V43H91L65 69L38 43H53Z" fill="#bfefff" stroke="#27a9d0" stroke-width="3" stroke-linejoin="round"/>',
  video:'<rect x="17" y="22" width="94" height="75" rx="12"/><path d="M52 39L83 60L52 81Z" fill="#fff"/><path d="M43 110H85" stroke="#876b9c" stroke-width="6" stroke-linecap="round"/>',
 };
 return authoredSvg(`<defs><linearGradient id="body" x2=".25" y2="1"><stop stop-color="${ink}"/><stop offset=".48" stop-color="${ink}"/><stop offset="1" stop-color="#225968"/></linearGradient><linearGradient id="gloss" x2="0" y2="1"><stop stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs><g fill="#506c70" opacity=".20" transform="translate(1 3)">${symbols[role]}</g><g fill="url(#body)" stroke-linejoin="round">${symbols[role]}</g><path d="M26 23Q64 12 102 26L98 42Q62 30 29 45Z" fill="url(#gloss)" opacity=".5"/>`);
};
export const authoredXboxBackground=(kind:'kinect'|'metro')=>authoredSvg(`<defs><linearGradient id="field" x2=".8" y2="1">${kind==='kinect'?'<stop stop-color="#344e24"/><stop offset=".58" stop-color="#759c43"/><stop offset="1" stop-color="#b9ca84"/>':'<stop stop-color="#27383c"/><stop offset=".6" stop-color="#566a69"/><stop offset="1" stop-color="#85978d"/>'}</linearGradient><radialGradient id="mist"><stop stop-color="#e5f0d8" stop-opacity=".28"/><stop offset="1" stop-color="#e5f0d8" stop-opacity="0"/></radialGradient></defs><rect width="1280" height="720" fill="url(#field)"/><ellipse cx="850" cy="190" rx="660" ry="470" fill="url(#mist)"/><g fill="none" stroke="#ecf6e1" stroke-opacity=".075"><path d="M-120 640Q440 120 1400 190" stroke-width="74"/><path d="M-120 740Q540 225 1400 294" stroke-width="28"/><path d="M-160 450Q540 15 1400 87" stroke-width="2"/></g>`,1280,720);
export const authoredKinectFloor=authoredSvg('<defs><linearGradient id="fade" x2="0" y2="1"><stop offset=".4" stop-color="#f0f4e9" stop-opacity="0"/><stop offset=".72" stop-color="#e4ebdf" stop-opacity=".94"/><stop offset="1" stop-color="#829689"/></linearGradient></defs><path d="M0 415Q640 370 1280 430V720H0Z" fill="url(#fade)"/><path d="M0 429Q640 384 1280 444" fill="none" stroke="#e7f2d8" stroke-opacity=".12" stroke-width="2"/>',1280,720);
export const AUTHORED_WIIU_FRAME_CSS=`
.nt-wiiu[data-authored-frames=true] .nt-plaza-game{border-radius:28px!important;border:0!important;background:linear-gradient(145deg,#f5fdff66,#a9c8d338 55%,#e5f8ff77)!important;box-shadow:inset 0 0 0 1px #f2fdffbd,inset 2px 2px 4px #fff9,inset -2px -3px 4px #789cab66,0 2px 0 #adc8d344,0 8px 12px -7px #45667465!important}
.nt-wiiu[data-authored-frames=true] .nt-plaza-game .nt-plaza-refract{display:block;inset:0;border-radius:28px;clip-path:inset(0 round 28px);box-shadow:none}
.nt-wiiu[data-authored-frames=true] .nt-plaza-refract>*{scale:1.10;filter:blur(.8px) saturate(.85);opacity:.65}
.nt-wiiu[data-authored-frames=true] .nt-plaza-refract:after{background:linear-gradient(135deg,#f4fcff66,transparent 30%,#b7d6e133);box-shadow:inset 2px 2px 4px #fff9,inset -2px -2px 4px #7fa4b255}
.nt-wiiu[data-authored-frames=true] .nt-plaza-game>.nt-plaza-cover{border-radius:21px!important;clip-path:inset(0 round 21px)!important;inset:7px!important;width:auto!important;height:auto!important;background:transparent!important;box-shadow:0 0 0 1px #dbf3fc88,inset 0 1px 2px #fff4}
.nt-wiiu[data-authored-frames=true] .nt-plaza-game:after{inset:0;border:0;border-radius:28px;background:radial-gradient(ellipse 60% 10% at 40% 3%,#ffffffbd,transparent 75%),linear-gradient(145deg,#fff3,transparent 26%,transparent 80%,#d6f1ff44);box-shadow:inset 0 0 0 1px #ffffff88;pointer-events:none}
.nt-wiiu[data-authored-frames=true] .nt-plaza-game[data-focus=true]{box-shadow:inset 0 0 0 1px #fff,0 0 0 2px #f3fdff,0 0 0 4px #35c7e8,0 3px 15px #1d9ebd30,0 8px 12px -7px #45667465!important}
.nt-wiiu[data-authored-frames=true] .nt-plaza-game>span{border:1px solid #dceef3;background:linear-gradient(#fff,#edf6f8);color:#365560;box-shadow:0 3px 8px #46697720;padding:6px 13px;border-radius:12px}
.nt-wiiu[data-authored-frames=true] .nt-plaza-cover .nt-game-icon{border-radius:21px!important}
.nt-wiiu[data-authored-frames=true] .nt-plaza-cover:after{border-radius:21px;box-shadow:inset 0 0 0 1px #183e4d1c,inset 0 2px 3px #ffffff13;background:linear-gradient(160deg,#ffffff0d,transparent 35%)}
.nt-wiiu[data-authored-frames=true] .nt-wiiu-art-frame{border-radius:18px!important;clip-path:inset(0 round 18px)!important;border:2px solid #ecf8fc99!important;box-shadow:inset 0 1px 2px #fff6,0 2px 0 #9fbfc955,0 4px 8px #627f8c25!important}
`;
export const authoredWiiuArtwork:Record<string,string>={
 'icon-friends':wiiuBadge('friends','#72c334'),
 'icon-mii':wiiuBadge('miiverse','#ffa327'),
 'icon-shop':wiiuBadge('store','#d89b25'),
 'icon-browser':wiiuBadge('browser','#3484b9'),
 'icon-messages':wiiuBadge('messages','#249fb0'),
 downloads:wiiuBadge('downloads','#418fae'),
 'icon-tvii':wiiuBadge('video','#947ca9'),
 'plaza-background':authoredSvg(`<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".5" stop-color="#f4f8f9"/><stop offset="1" stop-color="#e5eef1"/></linearGradient><radialGradient id="light"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="1280" height="800" fill="url(#sky)"/><ellipse cx="640" cy="260" rx="760" ry="140" fill="url(#light)"/>`,1280,800),
 'tile-glass':authoredSvg('<defs><linearGradient id="rim" x2=".2" y2="1"><stop stop-color="#f7ffff"/><stop offset=".55" stop-color="#d4e5e9"/><stop offset="1" stop-color="#a6bdc6"/></linearGradient></defs><rect x="2.5" y="2.5" width="123" height="123" rx="23" fill="none" stroke="url(#rim)" stroke-width="2"/><path d="M25 7H103M7 25V103" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>'),
};
