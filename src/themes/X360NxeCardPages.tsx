import {CSSProperties,ReactNode,useEffect,useRef,useState} from 'react';
import {Navigation} from '@decky/ui';
import {useHome} from '../common';
import {useFriends,useNotices} from '../activity';
import {downloadLine,fmtBytes,pauseDownload,resumeDownload,useDownloads} from '../downloads';
import {openSteam} from '../library';
import {THEMES,updateSettings,X360_STYLES} from '../settings';
import {listSkins,loadX360Skin,X360Skin} from '../skins';
import {playSound} from '../steam';
import {fmtPrice,loadStoreDetails,loadStoreLists,searchStore,StoreDetails,StoreItem} from '../store';
import {showSteamKeyboard} from '../steamKeyboard';
import {NxeFocus} from './X360NxeFocus';
import {NxeButtonHint,NxeOriginalIcon} from './X360NxeIcons';
import {NxeScene,nxeButton,nxeSurface,useNxeSceneInput} from './X360NxeScene';
import {useNxeWindow} from './X360NxeWindow';

export type NxeCardPage='friends'|'messages'|'downloads'|'store'|'community'|'browser'|'power'|'dashboards'|'themes'|'home';
export const isNxeCardPage=(page:string):page is NxeCardPage=>['friends','messages','downloads','store','community','browser','power','dashboards','themes','home'].includes(page);
type Row={id:string;name:string;sub?:string;image?:string;value?:string;content?:ReactNode;run:()=>void};
type Frame={section:string;selected:number;column:boolean};
const columns:CSSProperties={position:'absolute',left:208,top:130,width:420,height:442,overflowY:'auto'};

export function NxeCardPages({page,onClose,onExitStart}:{page:NxeCardPage;onClose:()=>void;onExitStart:()=>void}){
 const api=useHome(),s=api.settings,friends=useFriends(page==='friends',true),notices=useNotices(page==='messages'||page==='community'),downloads=useDownloads();
 const [section,setSection]=useState(''),[selected,setSelected]=useState(0),[column,setColumn]=useState(false),[history,setHistory]=useState<Frame[]>([]);
 const [skins,setSkins]=useState<{files:string[];names:Record<string,string>}>({files:[],names:{}}),[skinPreview,setSkinPreview]=useState<X360Skin|null>(null);
 const [catalogue,setCatalogue]=useState<Record<string,StoreItem[]>|null>(null),[storeError,setStoreError]=useState(''),[storeTab,setStoreTab]=useState('featured'),[storeIndex,setStoreIndex]=useState(0),[query,setQuery]=useState(''),[search,setSearch]=useState<StoreItem[]>([]),[product,setProduct]=useState<StoreItem|null>(null),[productDetails,setProductDetails]=useState<StoreDetails|null>(null);
 const productSelection=useRef(0);
 const root=useRef<HTMLDivElement>(null),motion=useNxeWindow(page+':'+section+':'+(product?.id??''),!!s.animations,false,onExitStart);
 useEffect(()=>{if(page!=='themes'&&page!=='home')return;let alive=true;listSkins().then(list=>{if(alive)setSkins({files:list.x360??[],names:list.x360names??{}});}).catch(()=>{});return()=>{alive=false;};},[page]);
 useEffect(()=>{if(page!=='store')return;let alive=true;loadStoreLists().then(list=>{if(alive)setCatalogue(list);}).catch(()=>{if(alive)setStoreError('The store is unavailable. Try again or open Steam Store.');});return()=>{alive=false;};},[page]);
 useEffect(()=>{if(!product){setProductDetails(null);return;}let alive=true;setProductDetails(null);loadStoreDetails(product.id).then(value=>{if(alive)setProductDetails(value);}).catch(()=>{});return()=>{alive=false;};},[product?.id]);
 useEffect(()=>{if(page!=='store'||storeTab!=='search')return;let alive=true;const timer=setTimeout(()=>{searchStore(query).then(value=>{if(alive){setSearch(value);setStoreIndex(0);}}).catch(()=>{if(alive)setStoreError('Search is unavailable.');});},300);return()=>{alive=false;clearTimeout(timer);};},[page,query,storeTab]);
 const enter=(next:string)=>{motion.move(false);setHistory(h=>[...h,{section,selected,column}]);setSection(next);setSelected(0);setColumn(false);playSound('select');};
 const back=()=>{if(motion.isClosing())return;motion.move(true);if(product){setProduct(null);setSelected(productSelection.current);}else{const previous=history[history.length-1];if(previous){setSection(previous.section);setSelected(previous.selected);setColumn(previous.column);setHistory(h=>h.slice(0,-1));}else motion.close(onClose);}playSound('back');};
 let title='',rows:Row[]=[],detail:ReactNode=null,full=false,narrow=false,modal=false;
 const row=(id:string,name:string,sub:string,run:()=>void,value?:string):Row=>({id,name,sub,run,value});
 const friend=section.startsWith('friend:')?friends.find(f=>f.id===section.slice(7)):null;
 const notice=section.startsWith('notice:')?notices.items.find(n=>n.id===section.slice(7)):null;
 const download=section.startsWith('download:')?downloads.items.find(d=>d.appid===Number(section.slice(9))):null;
 const queue=downloads.items.filter(d=>!d.completed);
 if(page==='friends'){
  title=friend?friend.name:'Friends';
  rows=friend?[row('message','Send Message','Continue this conversation in Steam Chat.',()=>Navigation.NavigateToSteamWeb('steam://friends/message/'+encodeURIComponent(friend.id))),row('profile','View Profile','Open this friend’s Steam profile.',()=>Navigation.NavigateToSteamWeb('https://steamcommunity.com/profiles/'+encodeURIComponent(friend.id)+'/')),
   ...(friend.appid&&api.lib.byId.has(friend.appid)?[row('game','View Game',friend.game??'',()=>api.details(api.lib.byId.get(friend.appid!)!))]:[])]:friends.map(f=>({id:f.id,name:f.name,sub:f.game||f.status||'Offline',image:f.avatar,run:()=>enter('friend:'+f.id)}));
  if(!friend&&!rows.length)rows=[row('open','Open Friends and Chat','No friends are available from Steam here.',()=>openSteam('friends'))];
  const f=friend??friends[selected];detail=f?<><div style={{display:'flex',gap:20,alignItems:'center'}}>{f.avatar?<img src={f.avatar} alt="" style={{width:96,height:96}}/>:<NxeOriginalIcon name="friends-small" size={80}/>}<div><h2>{f.name}</h2><p>{f.game||f.status||'Offline'}</p></div></div>{f.location&&<p>{f.location}</p>}<p>{friend?'Send a message or view this friend’s profile.':'Select a friend to open their gamer card.'}</p></>:<p>No friends are available from Steam. <button style={nxeButton} onClick={()=>openSteam('friends')}>Open Friends and Chat</button></p>;
 }
 if(page==='messages'){
  title=notice?'Message':'Messages';
  const messages=notices.items.filter(n=>n.kind==='message');
  rows=notice?[row('reply','Open Steam Chat','Read or reply in Steam’s conversation window.',()=>openSteam('friends')),row('notifications','All Notifications','Open Steam notifications.',()=>openSteam('notifications'))]:messages.map(n=>({id:n.id,name:n.title,sub:n.body,value:n.unread?'New':'',run:()=>enter('notice:'+n.id)}));
  if(!notice&&!rows.length)rows=[row('open','Open Steam Chat','No message notifications are available here.',()=>openSteam('friends'))];
  const n=notice??messages[selected];detail=n?<><h2>{n.title}</h2>{n.time&&<p>{new Date(n.time*1000).toLocaleString()}</p>}<p style={{whiteSpace:'pre-wrap'}}>{n.body}</p><p style={{fontSize:16,opacity:.75}}>Steam notification · Open Chat for the full conversation.</p></>:<p>No message notifications available.<button style={nxeButton} onClick={()=>openSteam('friends')}>Open Friends and Chat</button></p>;
 }
 if(page==='downloads'){
  title=download?'Download Details':'Active Downloads';full=!download;
  rows=download?[...(!download.completed?[row('toggle',download.paused?'Resume Download':'Pause Download',downloadLine(download),()=>download.paused?resumeDownload(download.appid):pauseDownload(download.appid))]:[]),row('manage','Manage in Steam','Change download priority or manage storage in Steam.',()=>openSteam('downloads'))]:queue.map(d=>({id:String(d.appid),name:api.lib.byId.get(d.appid)?.name??`App ${d.appid}`,sub:downloadLine(d),image:undefined,content:<><div style={{fontSize:16}}>{d.active?'Active Download':'Pending'}</div><progress aria-label="Download progress" value={d.progress<0?undefined:d.progress} max={1} style={{width:'100%',accentColor:'#89bd20'}}/></>,run:()=>enter('download:'+d.appid)}));
  detail=download?<><h2>{api.lib.byId.get(download.appid)?.name??`App ${download.appid}`}</h2><p>{downloadLine(download)}</p><progress value={download.progress<0?undefined:download.progress} max={1} style={{width:'100%',accentColor:'#89bd20'}}/><p>{fmtBytes(download.bytes)}{download.total>0?' / '+fmtBytes(download.total):''}</p></>:null;
 }
 if(page==='community'){
  title='Community';full=!section;
  rows=section?[row('hubs','Community Hubs','Open Steam discussions, guides and community content.',()=>openSteam('community')),row('friends','Friends and Chat','Open Steam Friends.',()=>openSteam('friends'))]:[row('community','Community Hubs','Discussions, guides and Workshop',()=>enter('hubs')),...notices.items.filter(n=>n.kind!=='message').map(n=>({id:n.id,name:n.title,sub:n.body,run:()=>n.appid&&api.lib.byId.has(n.appid)?api.details(api.lib.byId.get(n.appid)!):openSteam('community')}))];
  detail=<><NxeOriginalIcon name="community-small" size={110}/><h2>Steam Community</h2><p>Browse hubs, discussions and guides, or view your friends.</p></>;
 }
 if(page==='browser'){
  title='Internet';narrow=true;rows=[row('browser','Open Browser','Open the Steam web browser.',()=>openSteam('browser')),row('search','Search','Search through Steam.',()=>openSteam('search')),row('community','Steam Community','Open the Steam Community website.',()=>openSteam('community')),row('store','Steam Store','Open Steam Store.',()=>openSteam('steamstore'))];
 }
 if(page==='power'){
  title='Turn Off';narrow=true;modal=true;rows=[row('power','Power Options','Choose sleep, restart or shutdown in the system menu.',()=>openSteam('power')),row('home','Return to Steam','Return to Steam’s home screen.',api.showSteamHome),row('cancel','Cancel','Return to the dashboard.',back)];
 }
 if(page==='home'){
  title='Home Screen';rows=[row('dashboard','Dashboard Style','Choose Blades, NXE, Kinect or Metro.',()=>enter('dashboards')),row('background','Change Theme','Choose an installed Xbox 360 theme.',()=>enter('themes')),row('animations','Animations','Enable dashboard transitions.',()=>updateSettings({animations:!s.animations}),s.animations?'On':'Off'),row('sounds','Sound Effects','Play dashboard navigation sounds.',()=>updateSettings({sounds:!s.sounds}),s.sounds?'On':'Off'),row('clock','Clock','Choose the dashboard clock format.',()=>updateSettings({clock24:!s.clock24}),s.clock24?'24-hour':'12-hour'),row('logo','Theme Hub Corner Logo','Show the Theme Hub corner wordmark.',()=>updateSettings({x360:{...s.x360,showThemeHubLogo:s.x360.showThemeHubLogo===false}}),s.x360.showThemeHubLogo===false?'Off':'On'),row('settings','More Preferences','Open all Theme Hub preferences.',api.openSettings)];
  detail=<><NxeOriginalIcon name="theme-hub" size={100}/><h2>{rows[selected]?.name}</h2><p>{rows[selected]?.sub}</p></>;
 }
 const dashboardPicker=page==='dashboards'||(page==='home'&&(section==='dashboards'||section==='all-themes'));
 const themePicker=page==='themes'||(page==='home'&&section==='themes');
 if(dashboardPicker){
  title='Select Dashboard';narrow=true;
  rows=section==='all-themes'?THEMES.filter(t=>t.id!=='native'&&t.id!=='frame').map(t=>row(t.id,t.name,t.blurb,()=>api.switchTheme(t.id))):[...X360_STYLES.map(style=>row(style.id,style.name,'Xbox 360 dashboard',()=>{updateSettings({x360:{...s.x360,style:style.id}});onClose();},style.id===s.x360.style?'Current':'')),row('all','Other Themes','Browse all installed standard dashboard styles.',()=>enter('all-themes'))];
 }
 if(themePicker){
  title='Select Theme';narrow=true;
  rows=[row('default','Default','Use the dashboard’s default background.',()=>{updateSettings({x360:{...s.x360,skin:''}});onClose();},!s.x360.skin?'Current':''),...skins.files.map(file=>row(file,skins.names[file]??file,'Installed Xbox 360 theme',()=>{updateSettings({x360:{...s.x360,skin:file}});onClose();},s.x360.skin===file?'Current':'')),row('manage','More Theme Options','Import or download themes through Theme Hub settings.',api.openSettings)];
 }
 const skinFile=themePicker?rows[selected]?.id:undefined;
 useEffect(()=>{if(!themePicker||!skinFile||skinFile==='default'||skinFile==='manage'){setSkinPreview(null);return;}let alive=true;loadX360Skin(skinFile).then(value=>{if(alive)setSkinPreview(value);}).catch(()=>{if(alive)setSkinPreview(null);});return()=>{alive=false;};},[themePicker,skinFile]);
 const storeTabs=[['featured','Featured'],['specials','Specials'],['top','Top Sellers'],['new','New Releases'],['soon','Coming Soon'],['search','Search']] as const;
 const storeItems=storeTab==='search'?search:catalogue?.[storeTab]??[];
 const storeItem=storeItems[Math.min(storeIndex,Math.max(0,storeItems.length-1))];
 if(page==='store'){title=product?product.name:'Game Marketplace';rows=product?[row('buy','View in Steam Store','Continue to Steam to view purchase and installation options.',()=>Navigation.NavigateToSteamWeb('https://store.steampowered.com/app/'+product.id+'/'))]:storeTabs.map(([id,name])=>row(id,name,'Steam Store',()=>{setStoreTab(id);setStoreIndex(0);setColumn(true);}));}
 const index=Math.min(selected,Math.max(0,rows.length-1));
 const selectProduct=()=>{if(!storeItem)return;motion.move(false);productSelection.current=selected;setProduct(storeItem);setSelected(0);playSound('select');};
 const keyboard=useNxeSceneInput(({btn})=>{
  if(motion.isClosing())return true;
  if(btn==='b'){back();return true;}
  if(page==='store'&&!product&&column){if(btn==='left'&&storeIndex%2===0){setColumn(false);return true;}const delta=({left:-1,right:1,up:-2,down:2} as Record<string,number>)[btn];if(delta){setStoreIndex(i=>Math.max(0,Math.min(storeItems.length-1,i+delta)));playSound('move');return true;}if(btn==='a'){selectProduct();return true;}}
  if(page==='store'&&!product&&btn==='right'){setColumn(true);return true;}
  if(btn==='up'||btn==='down'){const next=Math.max(0,Math.min(rows.length-1,index+(btn==='down'?1:-1)));setSelected(next);playSound(next===index?'end':'move');return true;}
  if(page==='store'&&!product&&storeTab==='search'&&btn==='y'){const input=root.current?.querySelector<HTMLInputElement>('input');input?.focus();showSteamKeyboard(input);return true;}
  if(btn==='a'){rows[index]?.run();return true;}
  if(page==='downloads'&&btn==='y')openSteam('downloads');
  return true;
 });
 useEffect(()=>{root.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({block:'nearest'});},[index,section]);
 useEffect(()=>{root.current?.querySelector('[data-store-selected="true"]')?.scrollIntoView({block:'nearest'});},[storeIndex,storeTab,column]);
 const storePanel=page==='store'&&!product;
 const rowWidth=full?824:narrow?400:420;
 return <NxeScene id={page} title={title} windowRef={motion.ref} onKeyDown={keyboard} onBack={back} modal={modal} compact={page==='power'} footer={page==='downloads'?<NxeButtonHint button="y" label="Manage in Steam"/>:page==='store'&&!product&&storeTab==='search'?<NxeButtonHint button="y" label="Search"/>:undefined}>
  <div ref={root} style={{position:'absolute',inset:0}}>
   <div data-nxe-card-surface style={{...nxeSurface,position:'absolute',left:page==='power'?400:narrow?96:192,top:page==='power'?140:narrow?104:110,width:page==='power'?480:narrow?440:888,height:page==='power'?400:492}}/>
   <div role="listbox" aria-label={title+' options'} style={{...columns,left:page==='power'?420:narrow?116:208,top:page==='power'?212:narrow?124:130,width:page==='power'?440:rowWidth,height:page==='power'?300:452}}>
    {!(storePanel&&column)&&<NxeFocus key={section} selected={index} motion={!!s.animations}/>}
    {rows.map((r,i)=><button role="option" aria-selected={i===index&&!(storePanel&&column)} key={r.id} onFocus={()=>{setSelected(i);setColumn(false);}} onMouseEnter={()=>{setSelected(i);setColumn(false);}} onClick={r.run} style={{...nxeButton,minHeight:r.sub&&!narrow?76:45}}>
     {r.image?<img src={r.image} alt="" style={{width:48,height:48,objectFit:'cover'}}/>:page==='friends'&&!friend?<NxeOriginalIcon name="friends-small" size={48}/>:null}
     <span style={{flex:1,minWidth:0}}><span style={{display:'block',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{r.name}</span>{r.sub&&!narrow&&<small style={{display:'block',fontSize:16,opacity:.75,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{r.sub}</small>}{r.content}</span>{r.value&&<small style={{fontSize:16}}>{r.value}</small>}
    </button>)}
    {!rows.length&&<p style={{padding:16,fontSize:21,lineHeight:1.5}}>{page==='downloads'?'Your active downloads appear here.':page==='messages'?'No message notifications available.':page==='friends'?'No friends available.':'No items available.'}</p>}
   </div>
   {!narrow&&!full&&!storePanel&&<div data-nxe-card-detail style={{position:'absolute',left:654,top:130,width:406,height:452,padding:12,boxSizing:'border-box',overflow:'auto',fontSize:20,lineHeight:1.4}}>{page==='store'&&product?<><img src={productDetails?.header??product.header} alt="" style={{width:'100%'}}/><h2>{product.name}</h2><p>{productDetails?.priceText??(product.free?'Free':fmtPrice(product.price,product.currency))}</p><p>{productDetails?.short??'Loading game information…'}</p>{productDetails?.screenshots[0]&&<img src={productDetails.screenshots[0]} alt="Game screenshot" style={{width:'100%'}}/>}</>:detail}</div>}
   {narrow&&page!=='power'&&<div style={{position:'absolute',left:576,top:150,width:490,fontSize:23,lineHeight:1.5}}>{themePicker&&skinPreview?.background?<img src={skinPreview.background} alt="Theme preview" style={{width:490,height:280,objectFit:'cover'}}/>:null}<p>{rows[index]?.sub}</p></div>}
   {storePanel&&<div style={{position:'absolute',left:650,top:130,width:406,height:452,overflowY:'auto'}}>
    {storeTab==='search'&&<input aria-label="Search Steam Store" value={query} placeholder="Search games" onFocus={event=>void showSteamKeyboard(event.currentTarget)} onChange={e=>setQuery(e.target.value)} style={{width:'100%',boxSizing:'border-box',padding:12,font:'inherit',fontSize:20,marginBottom:15}}/>}
    {storeError&&<p role="status">{storeError}<button style={nxeButton} onClick={()=>openSteam('steamstore')}>Open Steam Store</button></p>}
    {!catalogue&&!storeError&&<p>Loading Steam Store…</p>}
    <div role="listbox" aria-label="Marketplace games" style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:12}}>{storeItems.map((item,i)=><button key={item.id} role="option" aria-selected={column&&storeIndex===i} data-store-selected={column&&storeIndex===i} onFocus={()=>{setColumn(true);setStoreIndex(i);}} onMouseEnter={()=>{setColumn(true);setStoreIndex(i);}} onClick={()=>{setStoreIndex(i);motion.move(false);productSelection.current=selected;setProduct(item);setSelected(0);}} style={{border:column&&storeIndex===i?'3px solid #b9e65e':'3px solid transparent',background:'#1d3039',padding:0,color:'inherit',textAlign:'left',font:'inherit',cursor:'pointer'}}><img src={item.header} alt="" style={{width:'100%',display:'block'}}/><span style={{display:'block',padding:8,fontSize:17}}>{item.name}<small style={{display:'block',marginTop:5}}>{item.free?'Free':fmtPrice(item.price,item.currency)}</small></span></button>)}</div>
    {catalogue&&!storeItems.length&&<p>{storeTab==='search'?(query?'No matching games.':'Enter a game name to search.'): 'No games available in this category.'}</p>}
   </div>}
   {full&&page==='downloads'&&<button onClick={()=>openSteam('downloads')} style={{...nxeButton,position:'absolute',left:218,top:610,width:400,minHeight:30,fontSize:17}}>Manage downloads in Steam</button>}
  </div>
 </NxeScene>;
}
