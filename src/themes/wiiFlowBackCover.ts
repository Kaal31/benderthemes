import type {Game} from "../library";

/** Generated library packaging, matching the original WiiFlow back design. */
export function paintWiiFlowBack(canvas:HTMLCanvasElement,game:Game,image?:CanvasImageSource){
 canvas.width=768;canvas.height=1152;const c=canvas.getContext("2d")!;
  const accent='#c6ab70';
  c.fillStyle='#182029';c.fillRect(0,0,768,1152);
  function picture(img:CanvasImageSource|undefined,x:number,y:number,w:number,h:number,pan=.5){if(!img)return;const iw=Number((img as HTMLImageElement).naturalWidth||(img as HTMLCanvasElement).width),ih=Number((img as HTMLImageElement).naturalHeight||(img as HTMLCanvasElement).height),r=Math.max(w/iw,h/ih);c.save();c.beginPath();c.rect(x,y,w,h);c.clip();c.drawImage(img,x+(w-iw*r)*pan,y+(h-ih*r)*.5,iw*r,ih*r);c.restore();}
  function text(value:string,x:number,y:number,width:number,size=20,color='#f1eee5',lineHeight=size*1.3,maxLines=8){c.fillStyle=color;c.font=`${size>=30?'bold ':''}${size}px Arial`;let line='',lines=0;for(const word of String(value).split(/\s+/)){if(c.measureText(line+word).width>width&&line){c.fillText(line.trim(),x,y);y+=lineHeight;line='';if(++lines>=maxLines)return y;}line+=word+' ';}if(line)c.fillText(line.trim(),x,y);return y+lineHeight;}
  c.fillStyle='#182029';c.fillRect(0,0,768,630);
  c.fillStyle=accent;c.fillRect(26,26,5,110);text(game.name.toUpperCase(),46,62,672,40,'#fff1cb',45,3);
  picture(image,30,165,708,330);c.strokeStyle=accent;c.lineWidth=3;c.strokeRect(30,165,708,330);
  text('YOUR COLLECTION. YOUR NEXT ADVENTURE.',30,535,708,24,accent,29,1);
  text('A custom library edition of '+game.name+'. Select this case to play or view game details.',30,573,708,19,'#f1eee5',25,2);
  c.fillStyle='#d6d2c5';c.fillRect(0,630,768,522);
  const facts=[['PLATFORM','PC / Steam'],['LIBRARY',game.installed?'INSTALLED':'OWNED'],['COLLECTION ID',String(game.appid||'--')]];
  facts.forEach(([label,value],i)=>{const x=26+i*244;c.fillStyle='#25313a';c.fillRect(x,653,231,74);text(label,x+12,676,209,13,'#c9c4b1');text(value,x+12,709,209,22,'#ffffff');});
  text('STEAM LIBRARY EDITION',28,768,710,29,'#27333d');
  const minutes=Number(game.playtime),details=[game.installed?'Available on this device. Launch and installation are handled by Steam.':'Select this game to open the available Steam launch or installation action.',Number.isFinite(minutes)&&minutes>0?`Recorded playtime: ${Math.floor(minutes/60)} hours ${Math.floor(minutes%60)} minutes.`:'Playtime information is not available for this edition.','Cover design assembled automatically from available library artwork and metadata. Artwork panels may be crops of the cover or hero image.'];
  let y=800;for(const paragraph of details)y=text(paragraph,28,y,710,18,'#303a41',23,3)+9;
  c.fillStyle='#a7a69c';c.fillRect(28,970,712,2);
  text('CUSTOM PRINT / GENERATED COVER',28,1001,450,20,'#25313a');
  text('Unofficial personal-library packaging. Not an original retail scan. Game names, logos and artwork belong to their respective owners. Features, ratings, publisher credits and legal notices are not inferred.',28,1026,450,12,'#424a4c',16,5);
  c.fillStyle='#faf8ec';c.fillRect(520,988,220,136);c.fillStyle='#20262a';
  // Decorative catalog stripes encode only the library app ID, not a retail barcode.
  const code=String(game.appid||0);let x=535;for(let i=0;i<60&&x<725;i++){const n=Number(code[i%code.length])||0,w=1+(n+i)%3;if(i%2===0)c.fillRect(x,1002,w,77);x+=w+1;}
  text('LIBRARY '+code,534,1101,195,15,'#20262a');
}
