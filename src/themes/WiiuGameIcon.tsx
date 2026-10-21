import {useEffect,useState} from "react";
import {GameArt} from "../common";
import {Game,gameIconUrls} from "../library";
const icons=new Map<string,string|null>(),logos=new Map<string,string|null>();
/** Keep square artwork sharp; tiny client icons are not blown up into full-size tiles. */
function useArtwork(urls:string[],kind:"icon"|"logo"){
 const key=urls.join("|"),cache=kind==="icon"?icons:logos;
 const [state,setState]=useState<{key:string;url:string|null}>({key,url:cache.get(key)??null});
 useEffect(()=>{
  if(cache.has(key)){setState({key,url:cache.get(key)!});return;}
  let alive=true,index=0,image:HTMLImageElement|undefined;
  const next=()=>{
   const url=urls[index++];if(!url){cache.set(key,null);if(alive)setState({key,url:null});return;}
   image=new Image();image.crossOrigin="anonymous";
   image.onload=()=>{if(!alive||!image)return;const w=image.naturalWidth,h=image.naturalHeight;
    if(kind==="icon"&&(Math.min(w,h)<96||w/h<.8||w/h>1.25)){next();return;}
    let result=url;
    if(kind==="logo")try{
     const ratio=Math.min(1,512/Math.max(w,h)),cw=Math.max(1,Math.round(w*ratio)),ch=Math.max(1,Math.round(h*ratio));const canvas=document.createElement("canvas");canvas.width=cw;canvas.height=ch;const ctx=canvas.getContext("2d")!;ctx.drawImage(image,0,0,cw,ch);const data=ctx.getImageData(0,0,cw,ch).data;let x0=cw,y0=ch,x1=-1,y1=-1;
     for(let y=0;y<ch;y++)for(let x=0;x<cw;x++)if(data[(y*cw+x)*4+3]>24){x0=Math.min(x0,x);x1=Math.max(x1,x);y0=Math.min(y0,y);y1=Math.max(y1,y);}
     if(x1>=x0&&y1>=y0){const out=document.createElement("canvas");out.width=x1-x0+1;out.height=y1-y0+1;out.getContext("2d")!.drawImage(canvas,x0,y0,out.width,out.height,0,0,out.width,out.height);result=out.toDataURL();}
    }catch{/* A remote image without pixel access still fits without cropping. */}
    cache.set(key,result);setState({key,url:result});
   };image.onerror=()=>{if(alive)next();};image.src=url;
  };next();return()=>{alive=false;if(image){image.onload=null;image.onerror=null;}};
 },[key,kind]);
 return state.key===key?state.url:null;
}
export function WiiuGameIcon({game}:{game:Game}){
 const icon=useArtwork(gameIconUrls(game),"icon"),logo=useArtwork(game.art.logo,"logo");
 return <div className="nt-game-icon" data-artwork={icon?"square-icon":logo?"fitted-logo":"fitted-cover"} style={{position:"absolute",inset:0,overflow:"hidden",background:"#263945"}}>
  {icon?<img src={icon} alt="" draggable={false} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"contain"}}/>:<>
   <GameArt g={game} kind="hero" flat style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"brightness(.7) saturate(.85)"}}/>
   {logo?<img src={logo} alt="" draggable={false} style={{position:"absolute",left:"7%",top:"10%",width:"86%",height:"80%",objectFit:"contain",filter:"drop-shadow(0 1px 3px #0009)"}}/>:<GameArt g={game} kind="portrait" flat fit="contain" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>}
  </>}
 </div>;
}
