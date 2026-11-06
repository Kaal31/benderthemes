// Independently drawn fallback vectors. No firmware images or traced paths.
export const authoredSvg=(body:string,w=128,h=w)=>'data:image/svg+xml;base64,'+btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg>`);
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
};
export function authoredGlyph(role:string,color='#fff',cut='#748370'){
 return authoredSvg(`<g fill="${color}" color="${color}" style="--cut:${cut}">${shapes[role]??shapes.apps}</g>`);
}
export const authoredKinectCard=(role:string)=>authoredSvg(`<defs><linearGradient id="paper" x2=".25" y2="1"><stop stop-color="#fcfdf8"/><stop offset="1" stop-color="#e2e9d9"/></linearGradient><linearGradient id="ribbon" x2="1" y2="0"><stop stop-color="#74a824"/><stop offset="1" stop-color="#b5d35b"/></linearGradient></defs><rect width="420" height="200" fill="url(#paper)"/><path d="M344 -8Q306 88 340 208H365Q332 91 369 -8Z" fill="url(#ribbon)"/><path d="M380 -8Q345 90 377 208H388Q356 91 392 -8Z" fill="#d3e5a0"/><image href="${authoredGlyph(role,'#527d22','#eef3e8')}" x="140" y="36" width="120" height="128"/>`,420,200);
export const authoredXboxIcon=(role:string,color='#fff')=>authoredSvg(`<g fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round">${shapes[role]??shapes.apps}</g><style>path,rect,circle,ellipse{fill:none!important;stroke:${color}!important;stroke-width:6!important}</style>`);
export const AUTHORED_WIIU_FRAME_CSS=`
.nt-wiiu[data-authored-frames=true] .nt-plaza-game{border-radius:14px!important;border:3px solid #e7f1f4!important;box-shadow:inset 0 1px 0 #fff,0 2px 0 #9bb1ba,0 7px 12px #637d892e!important;background:linear-gradient(150deg,#fff,#d3e3e9 65%,#f4fafc)!important}
.nt-wiiu[data-authored-frames=true] .nt-plaza-game>.nt-plaza-cover{border-radius:9px!important;clip-path:inset(0 round 9px)!important;inset:5px!important;width:auto!important;height:auto!important;background:linear-gradient(145deg,#f4f9fb,#cbdce4)!important;box-shadow:0 0 0 1px #7895a140,inset 0 1px 2px #fff}
.nt-wiiu[data-authored-frames=true] .nt-plaza-game:after{border:0;border-radius:11px;background:linear-gradient(155deg,#ffffff26,transparent 28%,transparent 76%,#31596912);box-shadow:inset 0 1px 0 #ffffff90;pointer-events:none}
.nt-wiiu[data-authored-frames=true] .nt-plaza-game[data-focus=true]{border-color:#17b6d6!important;box-shadow:inset 0 1px 0 #fff,0 0 0 2px #f5feff,0 0 0 5px #35c7e8,0 4px 18px #1d9ebd38,0 8px 12px #53778636!important}
.nt-wiiu[data-authored-frames=true] .nt-plaza-game>span{border:1px solid #dceef3;background:linear-gradient(#fff,#eaf5f8);color:#305965;box-shadow:0 3px 8px #46697720;padding:6px 13px;border-radius:9px}
.nt-wiiu[data-authored-frames=true] .nt-plaza-cover .nt-game-icon{border-radius:9px!important}
.nt-wiiu[data-authored-frames=true] .nt-plaza-cover:after{border-radius:9px;box-shadow:inset 0 0 0 1px #183e4d1c,inset 0 2px 3px #0000000d;background:linear-gradient(160deg,#ffffff0d,transparent 35%)}
.nt-wiiu[data-authored-frames=true] .nt-wiiu-art-frame{border-radius:11px!important;clip-path:inset(0 round 11px)!important;border:3px solid #edf6f8!important;box-shadow:0 2px 0 #93aab3,0 5px 8px #627f8c30!important}
`;
export const authoredWiiuArtwork:Record<string,string>={
 'plaza-background':authoredSvg(`<defs><linearGradient id="sky" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".5" stop-color="#f4f8f9"/><stop offset="1" stop-color="#e5eef1"/></linearGradient><radialGradient id="light"><stop stop-color="#fff"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="1280" height="800" fill="url(#sky)"/><ellipse cx="640" cy="260" rx="760" ry="140" fill="url(#light)"/>`,1280,800),
 'tile-glass':authoredSvg('<defs><linearGradient id="rim" x2=".2" y2="1"><stop stop-color="#f7ffff"/><stop offset=".55" stop-color="#d4e5e9"/><stop offset="1" stop-color="#a6bdc6"/></linearGradient></defs><rect x="2.5" y="2.5" width="123" height="123" rx="9" fill="none" stroke="url(#rim)" stroke-width="4"/><path d="M12 7H116M7 12V116" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>'),
};
