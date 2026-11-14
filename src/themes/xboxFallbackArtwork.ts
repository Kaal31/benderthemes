import {authoredGlyph,authoredKinectCard,authoredSvg,authoredXboxIcon,authoredXboxBackground,authoredKinectFloor} from './authoredConsoleArtwork';
import {useMemo} from 'react';
import {useAssets} from '../assets';
import {nxeIcons} from './nxeIcons.generated';
const svg=(body:string,w=1280,h=720)=>'data:image/svg+xml;base64,'+btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${body}</svg>`);
const clear=svg('');
const backdrop=(top:string,bottom:string)=>svg(`<defs><linearGradient id="b" x2="0" y2="1"><stop stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient><radialGradient id="light"><stop stop-color="#fff" stop-opacity=".26"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="1280" height="720" fill="url(#b)"/><ellipse cx="620" cy="230" rx="760" ry="420" fill="url(#light)"/>`);
const floor=svg('<defs><linearGradient id="f" x2="0" y2="1"><stop offset=".4" stop-color="#edf1e9" stop-opacity="0"/><stop offset=".7" stop-color="#edf1e9"/><stop offset="1" stop-color="#969d95"/></linearGradient></defs><rect width="1280" height="720" fill="url(#f)"/>');
const icon=(key:keyof typeof nxeIcons)=>nxeIcons[key];
const card=(key:keyof typeof nxeIcons)=>svg(`<defs><linearGradient id="p" x2="0" y2="1"><stop stop-color="#f9fbf6"/><stop offset="1" stop-color="#e2e8dc"/></linearGradient></defs><rect width="420" height="200" fill="url(#p)"/><path d="M350 0h34q-20 110-5 200h-38Q327 100 350 0" fill="#9aca36"/><path d="M389 0h18q-21 110-5 200h-20Q367 100 389 0" fill="#d4e6a8"/><image href="${icon(key)}" x="126" y="40" width="128" height="120"/>`,420,200);
const legends:Record<string,string>=Object.fromEntries(['a','b','x','y'].map(k=>['legend-'+k,icon(('button-'+k) as keyof typeof nxeIcons)]));
export const kinectFallback:Record<string,string>={...legends,background:backdrop('#417c0d','#a3d730'),'aura-floor':floor,'aura-highlight':clear,'aura-lowlight':clear,'slot-gradient':clear,slotsideshadow:clear,panelshadow:clear,'postcard-placeholder-glass':svg('<rect x="1" y="1" width="418" height="318" fill="#eef3e8" stroke="#fff" stroke-width="2"/>',420,320),'portrait-placeholder-glass':svg('<rect width="234" height="320" fill="#eef3e8"/>',234,320)};
for(const [name,key] of Object.entries({'slot-avatars':'avatar','slot-family':'friends-small','slot-friends':'friends-small','slot-games':'games','slot-kinect':'achievements-small','slot-xboxbasicsslot':'guide','slot-xboxlive':'store-small','slot-netflixzune':'video','slot-zunelastfm':'music','avatar-silhouette':'avatar'}))kinectFallback[name]=name==='avatar-silhouette'?icon(key as keyof typeof nxeIcons):card(key as keyof typeof nxeIcons);
export const metroFallback:Record<string,string>={...legends,background:backdrop('#787d79','#343b35'),'bottom-vignette':svg('<defs><linearGradient id="v" x2="0" y2="1"><stop stop-opacity="0"/><stop offset="1" stop-opacity=".5"/></linearGradient></defs><rect width="1280" height="720" fill="url(#v)"/>'),'focus-white':svg('<rect x="2" y="2" width="96" height="96" fill="none" stroke="white" stroke-width="4"/>',100,100)};
for(const [name,key] of Object.entries({'ico-activityfeed':'community-small','ico-addfriends':'friends-small','ico-apps':'dashboards','ico-changetheme':'cast-themes-small','ico-controller':'games','ico-games':'games','ico-installedgame':'disc','ico-internet':'guide','ico-marketplace':'store-small','ico-messages':'mail-small','ico-movie':'video','ico-search':'guide','ico-settingspreferences':'settings','ico-turnoff':'console-small'}))metroFallback[name]=icon(key as keyof typeof nxeIcons);
// Independent browser pictogram, following the Metro tile's slanted letter and orbit.
metroFallback['ico-internet']=svg('<defs><linearGradient id="ie" x2="0" y2="1"><stop stop-color="#f9fcff"/><stop offset="1" stop-color="#c2d8e7"/></linearGradient></defs><path d="M84 70H35c-2 10 4 17 14 17 9 0 16-4 20-11h17c-7 17-21 27-41 27-25 0-37-15-33-36 5-25 23-43 47-43 25 0 34 17 25 46ZM39 57h31c1-10-3-16-12-16-8 0-15 6-19 16Z" fill="url(#ie)"/><ellipse cx="55" cy="57" rx="57" ry="21" transform="rotate(-33 55 57)" fill="none" stroke="#f5fbff" stroke-width="4.5"/><path d="M14 74Q12 56 37 35" fill="none" stroke="#f5fbff" stroke-width="5"/>',112,112);
// Flat, independently constructed Metro silhouettes; no shared shaded NXE icons.
for(const [slot,role] of Object.entries({'ico-controller':'library','ico-games':'game','ico-activityfeed':'friends','ico-addfriends':'friends','ico-apps':'apps','ico-changetheme':'palette','ico-installedgame':'download','ico-marketplace':'store','ico-messages':'mail','ico-movie':'video','ico-search':'search','ico-settingspreferences':'gear','ico-turnoff':'power'}))metroFallback[slot]=authoredXboxIcon(role);
metroFallback.background=authoredXboxBackground('metro');
kinectFallback.background=authoredXboxBackground('kinect');
kinectFallback['aura-floor']=authoredKinectFloor;
for(const [slot,role] of Object.entries({'slot-avatars':'avatar','slot-family':'friends','slot-friends':'friends','slot-games':'game','slot-kinect':'avatar','slot-xboxbasicsslot':'apps','slot-xboxlive':'store','slot-netflixzune':'video','slot-zunelastfm':'music'}))kinectFallback[slot]=authoredKinectCard(role);
kinectFallback['avatar-silhouette']=authoredGlyph('avatar','#233f49','#eef3e8');
kinectFallback['postcard-placeholder-glass']=authoredSvg('<defs><linearGradient id="gl" x2=".1" y2="1"><stop stop-color="#fff"/><stop offset=".75" stop-color="#f3f6ee"/><stop offset="1" stop-color="#dbe3d5"/></linearGradient></defs><rect x="1" y="1" width="418" height="318" fill="url(#gl)" stroke="#fff" stroke-width="2"/><path d="M1 201H419M1 203H419" stroke="#d5dfd0" stroke-opacity=".4"/>',420,320);
export const bladesSmallFallback:Record<string,string>={a:legends['legend-a'],b:legends['legend-b'],x:legends['legend-x'],y:legends['legend-y'],avatar:icon('avatar'),controller:icon('games'),downloads:icon('disc'),friends:icon('friends-small'),messages:icon('mail-small'),themes:icon('cast-themes-small'),trophy:icon('achievements-small'),store:icon('store-small'),live:icon('community-small')};
// The wall shader reads the red channel as opacity: bright seams on black, not dark green paint.
const xboxCellwall=(()=>{
 const lines:string[]=[];
 for(let row=-1;row<10;row++)for(let col=-1;col<10;col++){
  const x=col*32+(row%2)*16,y=row*32,j=((col*17+row*13)%7)*.65;
  lines.push(`<path d="M${x} ${y}l${32+j} ${4-j}l${-15-j} ${28+j}Z"/>`);
 }
 return svg(`<rect width="256" height="256" fill="black"/><g fill="none" stroke="#a0a0a0" stroke-width=".8">${lines.join('')}</g><g fill="none" stroke="#fff" stroke-opacity=".28" stroke-width=".35"><path d="M0 42Q128 25 256 50M0 142Q128 165 256 135M40 0Q70 128 34 256M185 0Q163 128 194 256"/></g>`,256,256);
})();
export const xboxFallback:Record<string,string>={
 cellwall:xboxCellwall,
 orb:svg(`<defs>
 <radialGradient id="body" cx=".69" cy=".7" r=".75"><stop stop-color="#f7ff40"/><stop offset=".28" stop-color="#d9f709"/><stop offset=".58" stop-color="#8ad800"/><stop offset=".82" stop-color="#3e8c02"/><stop offset="1" stop-color="#103a02"/></radialGradient>
 <radialGradient id="rim"><stop offset=".78" stop-color="#98dc2c" stop-opacity="0"/><stop offset=".94" stop-color="#d7ff75" stop-opacity=".15"/><stop offset="1" stop-color="#d5ff62" stop-opacity=".75"/></radialGradient>
 <linearGradient id="glass" x2=".8" y2="1"><stop stop-color="#f1ffbc" stop-opacity=".8"/><stop offset=".35" stop-color="#a5ed3b" stop-opacity=".32"/><stop offset=".7" stop-color="#1e6905" stop-opacity=".22"/><stop offset="1" stop-color="#d0ff57" stop-opacity=".8"/></linearGradient>
 <linearGradient id="seam" x2=".2" y2="1"><stop stop-color="#f5ffd2"/><stop offset=".45" stop-color="#a5dc4d"/><stop offset=".56" stop-color="#326606"/><stop offset="1" stop-color="#d9fa8a"/></linearGradient>
 <clipPath id="ball"><circle cx="128" cy="128" r="91"/></clipPath></defs>
 <circle cx="128" cy="128" r="92" fill="url(#body)"/>
 <g clip-path="url(#ball)"><ellipse cx="105" cy="73" rx="80" ry="44" fill="#e9ffbd" opacity=".09"/><path d="M61 61Q107 90 127 108Q146 96 187 70Q161 103 148 126Q162 152 194 190Q153 159 128 143Q104 159 64 190Q90 153 107 126Q87 94 61 61Z" fill="#4e9a0a" opacity=".35"/><path d="M62 61Q104 103 126 111L187 70L144 126L194 190L128 144L64 190L110 126Z" fill="url(#glass)" stroke="url(#seam)" stroke-width="1.7"/><path d="M76 79L125 115L173 83M73 176L124 139L178 177" fill="none" stroke="#f6ffb9" stroke-width="1.15" opacity=".82"/></g>
 <circle cx="128" cy="128" r="92" fill="url(#rim)"/><path d="M29 100A105 105 0 0 1 138 24L138 40A89 89 0 0 0 44 104Z" fill="url(#glass)" stroke="#b9f868" stroke-opacity=".4"/><path d="M215 113A93 93 0 0 1 86 216L80 229A107 107 0 0 0 229 111Z" fill="url(#glass)" stroke="#b9f868" stroke-opacity=".45"/><ellipse cx="91" cy="78" rx="4" ry="2.4" transform="rotate(38 91 78)" fill="#efffc8" opacity=".85"/>`,256,256),
 'menu-highlight':svg('<defs><linearGradient id="h" x2="0" y2="1"><stop stop-color="#779e18" stop-opacity=".08"/><stop offset=".35" stop-color="#e1fa62" stop-opacity=".32"/><stop offset=".55" stop-color="#cbe84a" stop-opacity=".12"/><stop offset="1" stop-color="#456d0a" stop-opacity=".18"/></linearGradient></defs><path d="M4 1h91l4 20v60l-4 18H4L1 80V20Z" fill="url(#h)" stroke="#a6c655" stroke-opacity=".42"/><path d="M7 7h85" stroke="#ecffab" stroke-opacity=".18"/>',100,100),
 'settings-panel':svg('<defs><linearGradient id="p" x2="1" y2="1"><stop stop-color="#1c350d"/><stop offset=".4" stop-color="#061b08"/><stop offset="1" stop-color="#102405"/></linearGradient></defs><path d="M5 1h90l4 7v84l-4 7H5l-4-7V8Z" fill="url(#p)" fill-opacity=".94" stroke="#688c2a" stroke-opacity=".6"/><path d="M7 3h85M3 9v78" stroke="#bbda72" stroke-opacity=".14"/>',100,100)
};
const sets:Record<string,Record<string,string>>={'xbox-original':xboxFallback,'x360-kinect-dash':kinectFallback,'x360-metro-dash':metroFallback};
/** Authored defaults first; optional installed console artwork overrides per file. */
export function useXboxArtwork(name:string){const external=useAssets(name);return useMemo(()=>({...sets[name],...external}),[name,external]);}
