import {useEffect,useLayoutEffect,useRef} from 'react';
import {Navigation} from '@decky/ui';
import {useHome} from '../common';
import {pushModalInput,Press} from '../input';

const sections=[['Account','account'],['Friends','friends'],['Language & Text Input','general'],['Audio','audio'],['Display','display'],['Voice','voice'],['In-Game','ingame']];
export function OldBetaSettings({onExit,onFriends}:{onExit:()=>void;onFriends:()=>void}){
 const api=useHome(),root=useRef<HTMLDivElement>(null),handler=useRef<(p:Press)=>boolean>(()=>true),animations=useRef<Animation[]>([]),closing=useRef(false);
 const motion=()=>api.settings.animations&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const animate=(frames:Keyframe[],done?:()=>void)=>{if(!root.current||!motion()){done?.();return;}const a=root.current.animate(frames,{duration:360,easing:'cubic-bezier(.25,.46,.45,.94)',fill:'forwards'});animations.current.push(a);a.finished.then(()=>{done?.();a.cancel();}).catch(()=>{});};
 const leave=()=>{if(closing.current)return;closing.current=true;animate([{transform:'none',opacity:1},{transform:'translateY(-12%) scale(.95)',opacity:0}],onExit);};
 useLayoutEffect(()=>{animate([{opacity:0},{opacity:1,offset:.45},{opacity:1}]);root.current?.querySelector<HTMLButtonElement>('.beta-settings-list button')?.focus({preventScroll:true});return()=>animations.current.forEach(a=>a.cancel());},[]);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),finish=()=>{if(q.matches||!api.settings.animations)animations.current.filter(a=>a.playState==='running').forEach(a=>a.finish());};finish();q.addEventListener('change',finish);return()=>q.removeEventListener('change',finish);},[api.settings.animations]);
 handler.current=({btn})=>{if(closing.current)return true;if(btn==='b'){leave();return true;}if(btn==='y'||btn==='menu'){api.openSettings();return true;}if(btn==='a'){(document.activeElement as HTMLElement)?.click();return true;}if(btn==='up'||btn==='down'){const buttons=[...root.current?.querySelectorAll<HTMLButtonElement>('button')??[]],i=buttons.indexOf(document.activeElement as HTMLButtonElement);buttons[Math.max(0,Math.min(buttons.length-1,i+(btn==='down'?1:-1)))]?.focus({preventScroll:true});}return true;};
 useEffect(()=>pushModalInput(p=>handler.current(p)),[]);
 return <div ref={root} className="beta-side-page beta-settings-page"><style>{CSS}</style><header>Settings</header><nav className="beta-settings-list" aria-label="Settings categories">{sections.map(([label,id])=><button key={id} onClick={()=>id==='friends'?onFriends():Navigation.Navigate('/settings/'+id)}>{label}</button>)}</nav><footer><button onClick={api.openSettings}>Y　THEME OPTIONS</button><button onClick={leave}>DONE</button></footer></div>;
}
const CSS=`
.dht-oldbeta .beta-settings-page{background:radial-gradient(ellipse at 12% 15%,#426c80,#173442 50%,#081a23 85%)}
.dht-oldbeta .beta-settings-page>header{position:absolute;top:0;left:0;right:0;height:15%;display:grid;place-items:center;background:#071722d9;font-size:calc(var(--beta-w)*.032);color:#99b8c8;font-weight:300}
.dht-oldbeta .beta-settings-list{position:absolute;left:37.5%;width:25%;top:18%;display:flex;flex-direction:column;gap:calc(var(--beta-h)*.012)}
.dht-oldbeta .beta-settings-list button{width:100%;height:calc(var(--beta-h)*.048);background-image:linear-gradient(90deg,#ffffff08,transparent);background-color:#304653;color:#95aab6;text-align:left;padding:0 10px;font-size:calc(var(--beta-w)*.013);border:1px solid transparent}
.dht-oldbeta .beta-settings-list button:focus{background-color:#d2dbde;color:#1b2f39;border-color:#caecff;box-shadow:0 0 7px #b3d9e8}
.dht-oldbeta .beta-settings-page footer{bottom:8%;justify-content:center}.dht-oldbeta .beta-settings-page footer button{padding:4px 15px;background:linear-gradient(#344955,#0e2330)}.dht-oldbeta .beta-settings-page footer button:first-child{position:absolute;left:0;font-size:.85em;opacity:.7}.dht-oldbeta .beta-settings-page footer button:focus{outline:1px solid #c4e4f4}
`;
