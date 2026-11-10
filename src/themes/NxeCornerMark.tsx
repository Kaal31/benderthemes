import {useAssets} from '../assets';
import {nxeIcons} from './nxeIcons.generated';

const CSS=`
.dht-nxe-corner{position:absolute;right:48px;top:568px;width:225px;height:145px;pointer-events:none;perspective:500px}
.dht-nxe-ripples{position:absolute;left:0;bottom:0;width:225px;height:58px;overflow:visible}
.dht-nxe-ripple{fill:none;stroke:#d5e1d4;stroke-width:1;opacity:0;transform-origin:112.5px 29px;animation:dhtNxeRipple 4.8s linear infinite}
.dht-nxe-corner-orb{position:absolute;left:88.5px;top:44px;width:48px;height:48px;transform-origin:50% 75%;animation:dhtNxeOrb 14s ease-in-out infinite}
.dht-nxe-corner-hub{position:absolute;left:40px;top:35px;width:145px;height:108px;object-fit:contain;transform-origin:50% 65%;animation:dhtNxeHub 14s ease-in-out infinite}
@keyframes dhtNxeRipple{0%{opacity:0;transform:scale(.16)}10%{opacity:.24}75%{opacity:.12}100%{opacity:0;transform:scale(1)}}
@keyframes dhtNxeOrb{0%,32%,100%{opacity:1;transform:rotateY(0) scale(1)}38%,86%{opacity:0;transform:rotateY(90deg) scale(.9)}94%{opacity:1;transform:rotateY(0) scale(1)}}
@keyframes dhtNxeHub{0%,32%,94%,100%{opacity:0;transform:rotateY(-90deg) scale(.92)}40%,84%{opacity:1;transform:rotateY(0) scale(1)}}
.dht-nxe-corner[data-motion=false] .dht-nxe-ripple{animation:none;opacity:.12;transform:none}
.dht-nxe-corner[data-motion=false] .dht-nxe-corner-orb{animation:none;opacity:0}
.dht-nxe-corner[data-motion=false] .dht-nxe-corner-hub{animation:none;opacity:1;transform:none}
@media(prefers-reduced-motion:reduce){.dht-nxe-corner .dht-nxe-ripple{animation:none;opacity:.12;transform:none}.dht-nxe-corner .dht-nxe-corner-orb{animation:none;opacity:0}.dht-nxe-corner .dht-nxe-corner-hub{animation:none;opacity:1;transform:none}}
`;

/** NXE floor rings and rotating corner identity. Native art stays optional. */
export function NxeCornerMark({motion}:{motion:boolean}){
 const native=useAssets('x360-kinect-dash');
 return <div data-nxe-corner className="dht-nxe-corner" data-motion={motion} aria-hidden="true">
  <style>{CSS}</style>
  <svg className="dht-nxe-ripples" viewBox="0 0 225 58">
   {[0,1,2,3].map(i=><ellipse key={i} className="dht-nxe-ripple" cx="112.5" cy="29" rx={108-i*10} ry={26-i*2.5} style={{animationDelay:`${-i*1.2}s`}}/>)}
  </svg>
  <div className="dht-nxe-corner-orb">
   {native['xbox-logo']?<div style={{position:'absolute',inset:0,overflow:'hidden'}}><img src={native['xbox-logo']} alt="" style={{position:'absolute',width:115,height:'auto',maxWidth:'none',left:-33.5,top:0}}/></div>:<svg viewBox="0 0 48 48" width="48" height="48"><defs><radialGradient id="dht-nxe-orb" cx="32%" cy="22%" r="80%"><stop stopColor="#fff"/><stop offset=".5" stopColor="#b8bec0"/><stop offset="1" stopColor="#424a4c"/></radialGradient><linearGradient id="dht-nxe-x" x2=".4" y2="1"><stop stopColor="#c6ef64"/><stop offset="1" stopColor="#529711"/></linearGradient></defs><circle cx="24" cy="24" r="22" fill="url(#dht-nxe-orb)" stroke="#343b37" strokeWidth="1.4"/><path d="M9 8Q17 8 24 16Q31 8 39 8Q32 15 29 22Q38 34 40 41Q31 33 24 27Q17 33 8 41Q10 32 19 22Q16 15 9 8Z" fill="url(#dht-nxe-x)"/><path d="M11 8Q24 3 37 8" fill="none" stroke="#fff" opacity=".65"/></svg>}
  </div>
  <img className="dht-nxe-corner-hub" src={nxeIcons.online} alt=""/>
 </div>;
}
