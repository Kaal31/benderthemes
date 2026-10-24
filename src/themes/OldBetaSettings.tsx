import {themeActiveElement,nativeControlFocusCSS} from '../nativeThemeFocus';
import {useEffect,useLayoutEffect,useRef,useState} from 'react';
import {MenuItem,useHome} from '../common';
import {essentialItems,globalSettingsItems,themeSettingsItems} from '../themeSettingsMenu';
import {pushModalInput,Press} from '../input';

type Level={title:string;items:MenuItem[];index:number};
export function OldBetaSettings({onExit,onReturnStart}:{onExit:()=>void;onReturnStart:()=>void}){
 const api=useHome(),root=useRef<HTMLDivElement>(null),handler=useRef<(p:Press)=>boolean>(()=>true),animations=useRef<Animation[]>([]),closing=useRef(false);
 const [levels,setLevels]=useState<Level[]>(()=>[{title:'Old Beta Big Picture options',items:[...essentialItems([],api.showSteamHome),...themeSettingsItems(),{label:'Global settings',sub:globalSettingsItems}],index:0}]);
 const level=levels[levels.length-1];
 const motion=()=>api.settings.animations&&!matchMedia('(prefers-reduced-motion: reduce)').matches;
 const animate=(node:HTMLElement,frames:Keyframe[],duration=400,done?:()=>void)=>{if(!motion()){done?.();return;}const a=node.animate(frames,{duration,easing:'cubic-bezier(.22,.61,.36,1)',fill:'forwards'});animations.current.push(a);a.finished.then(()=>{done?.();a.cancel();}).catch(()=>{});};
 const leave=()=>{if(closing.current)return;closing.current=true;const node=root.current;if(!node){onExit();return;}const style=getComputedStyle(node),start={transform:style.transform,opacity:style.opacity};animations.current.forEach(a=>a.cancel());onReturnStart();animate(node,[start,{transform:'translateY(-4%) scale(.985)',opacity:0}],320,onExit);};
 const back=()=>levels.length>1?setLevels(v=>v.slice(0,-1)):leave();
 const activate=(i:number)=>{const item=level.items[i];if(!item||item.disabled)return;if(item.sub){setLevels(v=>[...v,{title:item.label,items:item.sub!(),index:0}]);return;}item.action?.();if(!item.keepOpen&&levels.length>1)setLevels(v=>v.slice(0,-1));};
 useLayoutEffect(()=>{const node=root.current;if(node){animate(node,[{transform:'translateY(4%) scale(1.015)',opacity:0},{transform:'none',opacity:1}]);const list=node.querySelector<HTMLElement>('.beta-settings-list');if(list)animate(list,[{translate:'0 24px',opacity:0},{translate:'0 0',opacity:1}],400);}return()=>animations.current.forEach(a=>a.cancel());},[]);
 useLayoutEffect(()=>{const list=root.current?.querySelector<HTMLElement>('.beta-settings-list'),button=list?.querySelectorAll<HTMLButtonElement>('button')[level.index];button?.focus({preventScroll:true});if(list&&button){const top=button.offsetTop,bottom=top+button.offsetHeight;if(top<list.scrollTop)list.scrollTop=top;else if(bottom>list.scrollTop+list.clientHeight)list.scrollTop=bottom-list.clientHeight;}},[levels.length,level.index]);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),finish=()=>{if(q.matches||!api.settings.animations)animations.current.filter(a=>a.playState==='running').forEach(a=>a.finish());};finish();q.addEventListener('change',finish);return()=>q.removeEventListener('change',finish);},[api.settings.animations]);
 handler.current=({btn})=>{if(closing.current)return true;if(btn==='b'||btn==='left'){back();return true;}if(btn==='y'||btn==='menu'){api.openSettings();return true;}if(btn==='a'||btn==='right'){const active=themeActiveElement(root.current) as HTMLButtonElement;if(active?.closest('.beta-settings-list'))activate(level.index);else active?.click();return true;}if(btn==='up'||btn==='down'){let next=level.index;for(let n=0;n<level.items.length;n++){next=Math.max(0,Math.min(level.items.length-1,next+(btn==='down'?1:-1)));if(!level.items[next]?.disabled)break;}setLevels(v=>v.map((l,i)=>i===v.length-1?{...l,index:next}:l));}return true;};
 useEffect(()=>pushModalInput(p=>handler.current(p)),[]);
 return <div ref={root} className="beta-side-page beta-settings-page"><style>{nativeControlFocusCSS(CSS)}</style><header>{levels.length===1?'Settings':level.title}</header><nav className="beta-settings-list" aria-label="Theme settings">{level.items.map((item,i)=><button key={i} disabled={item.disabled} aria-pressed={item.checked===undefined?undefined:item.checked} onFocus={()=>{if(level.index!==i)setLevels(v=>v.map((l,k)=>k===v.length-1?{...l,index:i}:l));}} onClick={()=>activate(i)}>{item.checked===true?'✓ ':''}{item.label}{item.sub?'　›':''}</button>)}</nav><footer><button onClick={api.openSettings}>Y OPTIONS WINDOW</button><button onClick={back}>{levels.length>1?'BACK':'DONE'}</button></footer></div>;
}
const CSS=`
.dht-oldbeta .beta-settings-page{background:radial-gradient(ellipse at 12% 15%,#426c80,#173442 50%,#081a23 85%)}
.dht-oldbeta .beta-settings-page>header{position:absolute;top:0;left:0;right:0;height:15%;display:grid;place-items:center;background:#071722d9;font-size:calc(var(--beta-w)*.03);color:#99b8c8;font-weight:300}
.dht-oldbeta .beta-settings-list{position:absolute;left:37.5%;width:25%;top:18%;bottom:18%;display:flex;flex-direction:column;gap:calc(var(--beta-h)*.012);overflow:auto;scrollbar-width:none;padding:3px}
.dht-oldbeta .beta-settings-list::-webkit-scrollbar{display:none;width:0;height:0}
.dht-oldbeta .beta-settings-list button{flex:none;width:100%;min-height:calc(var(--beta-h)*.048);background-image:linear-gradient(90deg,#ffffff08,transparent);background-color:#304653;color:#95aab6;text-align:left;padding:6px 10px;font-size:calc(var(--beta-w)*.013);border:1px solid transparent;overflow-wrap:anywhere}
.dht-oldbeta .beta-settings-list button:focus{background-color:#d2dbde;color:#1b2f39;border-color:#caecff;box-shadow:0 0 7px #b3d9e8}.dht-oldbeta .beta-settings-list button:disabled{opacity:.45}
.dht-oldbeta .beta-settings-page footer{bottom:8%;justify-content:center}.dht-oldbeta .beta-settings-page footer button{padding:4px 15px;background:linear-gradient(#344955,#0e2330)}.dht-oldbeta .beta-settings-page footer button:first-child{position:absolute;left:0;font-size:.85em;opacity:.7}.dht-oldbeta .beta-settings-page footer button:focus{outline:1px solid #c4e4f4}
`;
