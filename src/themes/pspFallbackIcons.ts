// Independently drawn XMB-role pictograms. No imported paths or firmware pixels.
export type PspFallbackStyle='classic'|'flat'|'outline';
const shapes:Record<string,string>={
 settings:'<path d="M8 22h48v29H8zM23 22v-7h18v7M8 31h48M21 28v10M43 28v10"/>',
 extras:'<path d="M27 9h10v18h18v10H37v18H27V37H9V27h18z"/>',
 photo:'<path d="M8 22h13l5-8h14l5 8h11v30H8z"/><circle cx="32" cy="36" r="10"/><path d="M13 27h5"/>',
 music:'<path d="M27 10v33c-4-2-12-1-13 5-1 7 13 7 15-1V20l18 4v23c-5-2-12-1-12 5 0 7 14 6 14-2V15z"/>',
 video:'<rect x="9" y="12" width="46" height="40" rx="2"/><path d="M19 12v40M45 12v40M9 22h10M9 32h10M9 42h10M45 22h10M45 32h10M45 42h10"/>',
 game:'<path d="M17 20h30q7 1 9 11l4 17q0 8-7 5L41 43H23L12 53q-8 2-7-5l4-17q2-10 8-11z"/><path d="M19 27v13M13 33h13M43 29h1M49 35h1"/>',
 globe:'<circle cx="32" cy="32" r="24"/><ellipse cx="32" cy="32" rx="11" ry="24"/><path d="M8 32h48M13 19h38M13 45h38"/>',
 network:'<circle cx="32" cy="32" r="24"/><ellipse cx="32" cy="32" rx="11" ry="24"/><path d="M8 32h48M13 19h38M13 45h38"/>',
 browser:'<circle cx="32" cy="32" r="25" stroke-dasharray="1 6"/><path d="M9 25l4 15 5-10 5 10 4-15M27 25l4 15 5-10 5 10 4-15M45 25l3 15 4-10 4 10 3-15"/>',
 psn:'<circle cx="32" cy="32" r="25"/><path d="M20 44V18h12q13 0 13 10 0 11-13 11h-5M27 26h6q5 0 5 3t-5 3h-6"/>',
 store:'<path d="M12 22h40l4 34H8zM23 23v-8q9-12 18 0v8"/><path d="M22 36h20M25 43h14"/>',
 folder:'<path d="M7 17h19l6 7h25v30H7z"/>',
 library:'<path d="M9 12h11v43H9zM25 12h11v43H25zM40 15l10-3 11 40-10 3z"/>',
 disc:'<circle cx="32" cy="32" r="25"/><circle cx="32" cy="32" r="7"/><path d="M15 25q4-11 17-12M32 51q12-1 17-12"/>',
 download:'<path d="M26 7h12v24h11L32 48 15 31h11zM10 47v10h44V47"/>',
 update:'<path d="M52 25A21 21 0 0 0 15 17l-4 6M11 10v14h14M12 39a21 21 0 0 0 37 8l4-6M53 54V40H39"/>',
 sound:'<path d="M8 25h12l14-12v38L20 39H8zM43 23q9 9 0 18M49 15q18 17 0 34"/>',
 clock:'<circle cx="32" cy="32" r="25"/><path d="M32 15v18l12 7"/>',
 power:'<path d="M32 6v25M20 13a23 23 0 1 0 24 0"/>',
 security:'<rect x="13" y="28" width="38" height="29" rx="3"/><path d="M21 28V18q11-19 22 0v10M32 38v9"/>',
 gear:'<path d="M26 7h12l2 8 8 4 8-1 5 11-7 6-1 9 3 6-9 8-8-4-8 1-6 5-10-6 1-8-4-8-7-3 2-12 8-2 6-6z"/><circle cx="32" cy="33" r="10"/>',
 user:'<circle cx="32" cy="18" r="11"/><path d="M11 55q0-23 21-23t21 23z"/>',
 friends:'<circle cx="24" cy="20" r="10"/><circle cx="46" cy="25" r="8"/><path d="M5 55q0-23 19-23t19 23M39 38q17-2 20 17"/>',
 chat:'<path d="M7 10h50v34H34L19 56V44H7zM16 21h32M16 30h25"/>',
 trophy:'<path d="M19 8h26v16q0 15-13 15T19 24zM19 14H7v10q0 12 15 12M45 14h12v10q0 12-15 12M32 39v13M20 56h24"/>',
 display:'<rect x="6" y="10" width="52" height="36" rx="3"/><path d="M32 46v10M21 57h22"/>',
 tv:'<rect x="7" y="19" width="50" height="36" rx="6"/><path d="M21 6l11 13L43 6"/>',
 palette:'<path d="M32 7C4 6-3 46 20 55q12 5 12-8 1-7 9-7 18 1 17-13Q55 7 32 7z"/><circle cx="20" cy="20" r="2"/><circle cx="36" cy="17" r="2"/><circle cx="47" cy="28" r="2"/>',
 search:'<circle cx="26" cy="26" r="18"/><path d="M40 40l17 17"/>',
 home:'<path d="M5 30L32 7l27 23M13 25v32h14V40h11v17h13V25"/>',
 apps:'<rect x="8" y="8" width="18" height="18" rx="2"/><rect x="38" y="8" width="18" height="18" rx="2"/><rect x="8" y="38" width="18" height="18" rx="2"/><rect x="38" y="38" width="18" height="18" rx="2"/>',
 plus:'<path d="M27 9h10v18h18v10H37v18H27V37H9V27h18z"/>',
 bell:'<path d="M13 47q6-8 6-21 0-15 13-15t13 15q0 13 6 21zM26 54q6 8 12 0M32 5v6"/>',
 dots:'<circle cx="12" cy="32" r="4"/><circle cx="32" cy="32" r="4"/><circle cx="52" cy="32" r="4"/>',
 steam:'<circle cx="32" cy="32" r="25"/><path d="M8 37l17 10 20-22M25 47l-5-12 17-14"/><circle cx="43" cy="22" r="9"/>',
 usb:'<path d="M32 55V9l-6 8M32 9l6 8M32 39L18 29V18M32 32l14-10V12"/><circle cx="18" cy="16" r="3"/><rect x="43" y="7" width="6" height="6"/>',
 camera:'<path d="M8 22h13l5-8h14l5 8h11v30H8z"/><circle cx="32" cy="36" r="10"/>',
 bluetooth:'<path d="M29 5l18 15-29 24M29 59l18-15L18 20M29 5v54"/>',
 help:'<path d="M20 19q0-13 13-13 15 0 15 12 0 9-10 14-6 3-6 12M32 53v4"/>',
 rss:'<circle cx="13" cy="51" r="4"/><path d="M9 30q25 0 25 25M9 10q45 0 45 45"/>'
};
export const PSP_FALLBACK_ROLES=Object.keys(shapes);
export function pspFallbackIcon(name:string,style:PspFallbackStyle='classic'){
 const aliases:Record<string,string>={image:'photo',movie:'video',games:'game',mail:'chat',trophies:'trophy',internet:'browser'};
 const body=shapes[name]??shapes[aliases[name]]??shapes.apps;
 const colour=style==='flat'?'#f3f6f8':style==='outline'?'#f4f7fa':'url(#silver)';
 const fill=style==='outline'?'none':colour;
 // Filled silhouettes with fine contrasting edges; outline uses the same authored topology.
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 64 64"><defs><linearGradient id="silver" x2="0" y2="1"><stop stop-color="#fff"/><stop offset=".46" stop-color="#e7edf1"/><stop offset="1" stop-color="#a4b1ba"/></linearGradient></defs><g fill="${fill}" stroke="${style==='outline'?'#f4f7fa':style==='flat'?'#627783':'#687884'}" stroke-width="${style==='outline'?2.7:1.6}" stroke-linejoin="round" stroke-linecap="round">${body}</g></svg>`;
 return 'data:image/svg+xml;base64,'+btoa(svg);
}
