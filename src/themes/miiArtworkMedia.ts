export type MiiArtworkMedia="image"|"animated"|"video";
export const isMiiVideo=(url:string)=>/^data:video\//i.test(url)||/\.(webm|mp4)(?:[?#]|$)/i.test(url);
// Inspect bytes as Steam artwork often has a static-looking extension.
export async function animatedMiiArtwork(url:string):Promise<{url:string;kind:MiiArtworkMedia}|undefined>{
 if(isMiiVideo(url))return {url,kind:"video"};
 const response=await fetch(url,{signal:AbortSignal.timeout(8000)});if(!response.ok)throw Error("Artwork unavailable");
 const blob=await response.blob();if(blob.type.startsWith("video/"))return {url,kind:"video"};
 const bytes=new Uint8Array(await blob.arrayBuffer()),header=new TextDecoder('latin1').decode(bytes);
 const gif=header.startsWith('GIF8'),webp=header.startsWith('RIFF')&&header.slice(8,12)==='WEBP'&&header.includes('ANIM'),png=bytes[0]===137&&header.slice(1,4)==='PNG'&&header.includes('acTL');
 if(!gif&&!webp&&!png)return undefined;
 const type=gif?'image/gif':webp?'image/webp':'image/png';
 const data=await new Promise<string>((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(String(reader.result));reader.onerror=()=>reject(Error('Artwork unreadable'));reader.readAsDataURL(new Blob([bytes],{type}));});
 return {url:data,kind:"animated"};
}
