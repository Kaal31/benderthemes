import {useEffect,useRef,useState} from 'react';
import {openFilePicker} from '@decky/api';
import type {Game} from '../library';
import type {Press} from '../input';
import {pushModalInput} from '../input';
import {CoverWrap,WrapCandidate,getCoverWrap,searchWraps,selectWrap,importWrap,setWrapMode,rememberWrap,retryCoverWrap,discoverCoverWrap,onWrapChanged} from '../coverWraps';

/** A per-game artwork choice, kept separate from the imported skin's layout. */
export function CoverWrapPanel({game,onClose,input}:{game:Game;onClose:()=>void;input:{current:((p:Press)=>boolean)|null}}){
 const [query,setQuery]=useState(game.name),[provider,setProvider]=useState('all'),[wrap,setWrap]=useState<CoverWrap>({mode:'auto'}),[matches,setMatches]=useState<WrapCandidate[]>([]),[message,setMessage]=useState(''),[busy,setBusy]=useState(false),[focus,setFocus]=useState(0);
 const alive=useRef(true),ticket=useRef(0),running=useRef(false);
 useEffect(()=>pushModalInput(press=>input.current?.(press)??true),[input]);
 useEffect(()=>onWrapChanged(appid=>{if(appid===game.appid)void getCoverWrap(game).then(value=>{if(alive.current)setWrap(value)})}),[game.appid]);
 useEffect(()=>{alive.current=true;void getCoverWrap(game).then(value=>{if(alive.current)setWrap(value)});return()=>{alive.current=false;ticket.current++}},[game.appid]);
 const act=async(fn:()=>Promise<CoverWrap>)=>{
  if(running.current)return;running.current=true;setBusy(true);setMessage('');
  try{const value=rememberWrap(game.appid,await fn());if(alive.current){setWrap(value);setMessage(value.url?'Full wrap applied.':'Using the game’s artwork to generate the sleeve.')}}catch(error){if(alive.current)setMessage(String(error))}finally{running.current=false;if(alive.current)setBusy(false)}
 };
 const search=async()=>{
  if(running.current)return;const id=++ticket.current;running.current=true;setBusy(true);setMessage('Searching XboxUnity / GameTDB…');setMatches([]);setFocus(0);
  try{const result=await searchWraps(query,provider,true);if(alive.current&&ticket.current===id){setMatches(result.candidates??[]);setMessage((result.candidates?.length?'Choose a matching platform and edition.':'No matching wrap found. Import one or generate a sleeve below.')+(result.errors?.length?' '+result.errors.join(' · '):''))}}catch(error){if(alive.current)setMessage(String(error))}finally{running.current=false;if(alive.current)setBusy(false)}
 };
 const manual=async()=>{
  if((globalThis as any).__isThemePreview){
   const picker=document.createElement('input');picker.type='file';picker.accept='image/png,image/jpeg';
   picker.onchange=()=>{const file=picker.files?.[0];if(!file)return;if(file.size>16*1024*1024){setMessage('Choose a wrap smaller than 16 MB.');return}const reader=new FileReader();reader.onload=()=>{const image=new Image();image.onload=()=>{const aspect=image.width/image.height;if(image.height<256||image.width<256||image.width*image.height>48000000||aspect<1.05||aspect>2.5){setMessage('Choose a landscape full wrap, with back on the left and front on the right.');return}void act(async()=>({mode:'manual',source:'Local wrap',name:file.name,url:String(reader.result)}))};image.onerror=()=>setMessage('This image could not be opened.');image.src=String(reader.result)};reader.readAsDataURL(file)};picker.click();return;
  }
  try{const picked=await openFilePicker(0 as any,'/home/deck/Pictures',true,true,undefined,['png','jpg','jpeg']);if(picked?.realpath)await act(()=>importWrap(String(game.appid),picked.realpath))}catch(error){if(!/cancel/i.test(String(error)))setMessage(String(error))}
 };
 const automatic=()=>act(async()=>{retryCoverWrap(game.appid);const result=await setWrapMode(String(game.appid),'auto');setTimeout(()=>void discoverCoverWrap(game),0);return result});
 const actions=[{label:'Search providers',run:search},{label:'Import full wrap…',run:manual},{label:'Generate from game artwork',run:()=>act(()=>setWrapMode(String(game.appid),'generated'))},{label:'Automatic matching',run:automatic},...matches.map(candidate=>({label:`${candidate.name} · ${candidate.platform.toUpperCase()} · ${candidate.score===1?'Exact title':Math.round(candidate.score*100)+'% match'}`,run:()=>act(()=>selectWrap(String(game.appid),candidate.provider,candidate.platform,candidate.id,candidate.name))}))];
 const buttons=useRef<(HTMLButtonElement|null)[]>([]);
 useEffect(()=>{buttons.current[focus]?.scrollIntoView({block:'nearest'})},[focus]);
 input.current=press=>{if(press.btn==='b'){onClose();return true}if(document.activeElement?.tagName==='INPUT'||document.activeElement?.tagName==='SELECT')return true;if(press.btn==='up'||press.btn==='down')setFocus(i=>(i+(press.btn==='up'?-1:1)+actions.length)%actions.length);if(press.btn==='a'&&!busy)void actions[focus]?.run();return true};
 return <section data-cover-wrap-panel onClick={e=>e.stopPropagation()} style={{position:'absolute',inset:'7% 12%',padding:28,background:'#171b20f5',color:'#eee',display:'flex',flexDirection:'column',gap:14,font:'20px Segoe UI',border:'1px solid #ffffff30'}}>
  <div style={{display:'flex',justifyContent:'space-between'}}><strong style={{fontSize:28}}>Cover artwork · {game.name}</strong><button onClick={onClose} style={button}>Back</button></div>
  <div>Current: {wrap.url?(wrap.source??wrap.mode):wrap.mode==='generated'?'Generated sleeve':'Automatic · generated sleeve until a reliable wrap is available'}</div>
  <div style={{display:'flex',gap:10}}><input aria-label='Cover search title' value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>{e.stopPropagation();if(e.key==='Enter')void search();if(e.key==='Escape')onClose()}} style={{flex:1,minWidth:0,font:'inherit'}}/><select aria-label='Cover source' value={provider} onChange={e=>setProvider(e.target.value)} style={{font:'inherit'}}><option value='all'>XboxUnity + GameTDB</option><option value='xboxunity'>XboxUnity</option><option value='gametdb'>GameTDB · PS3 / Wii / Wii U</option></select></div>
  <div role='status' style={{fontSize:16,minHeight:42}}>{busy?'Working… ':''}{message||'Full wraps contain the back on the left, spine in the middle and front on the right. Fuzzy matches require your selection.'}</div>
  <div style={{display:'flex',gap:20,flex:1,minHeight:0}}><div style={{flex:1,overflowY:'auto'}}>{actions.map((action,i)=><button key={i} ref={node=>{buttons.current[i]=node}} disabled={busy} onMouseEnter={()=>setFocus(i)} onClick={()=>void action.run()} style={{...button,display:'block',width:'100%',marginBottom:8,textAlign:'left',background:focus===i?'#426478':'#242b32'}}>{action.label}{i>=4&&<small style={{display:'block',opacity:.7}}>{matches[i-4].provider} · {matches[i-4].id}</small>}</button>)}</div>{wrap.url&&<img data-cover-wrap-preview src={wrap.url} alt='Selected full cover wrap' style={{width:'42%',objectFit:'contain',alignSelf:'flex-start',maxHeight:'100%'}}/>}</div>
  <small>Artwork: XboxUnity contributors / GameTDB contributors. Original platform branding stays on downloaded scans.</small>
 </section>;
}
const button={font:'inherit',padding:'9px 14px',border:'1px solid #ffffff30',color:'#eee',background:'#242b32',cursor:'pointer'};
