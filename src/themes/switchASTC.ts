import createModule from '../../third-party/texture2ddecoder/decoder';
import {SWITCH_TEXTURE_DECODER} from './switchTextureDecoderData';
const bytes=(value:string)=>Uint8Array.from(atob(value),c=>c.charCodeAt(0));
let decoder:ReturnType<typeof createModule>|undefined;
/** BNTX payload was untiled locally; WASM performs portable ASTC decoding. */
export async function decodeSwitchASTCPixels(source:string){
 const data=bytes(source.slice(source.indexOf(',')+1)),header=new DataView(data.buffer);
 if(data.length<14||String.fromCharCode(...data.slice(0,4))!=='DAST')throw new Error('Invalid ASTC resource');
 const width=header.getUint16(4,true),height=header.getUint16(6,true),blockWidth=data[8],blockHeight=data[9],channels=header.getUint32(10,true);
 if(width<1||height<1||width*height>2048*2048||blockWidth<4||blockWidth>12||blockHeight<4||blockHeight>12||data.length!==14+Math.ceil(width/blockWidth)*Math.ceil(height/blockHeight)*16)throw new Error('Invalid ASTC dimensions');
 decoder??=createModule({wasmBinary:bytes(SWITCH_TEXTURE_DECODER),locateFile:()=>''});
 const module=await decoder,bgra=module.decode_astc(data.slice(14),width,height,blockWidth,blockHeight);
 if(!bgra||bgra.length!==width*height*4)throw new Error('ASTC texture decode failed');
 const pixels=new Uint8ClampedArray(width*height*4);
 for(let i=0;i<width*height;i++){
  const value=[0,255,bgra[i*4+2],bgra[i*4+1],bgra[i*4],bgra[i*4+3]];
  for(let c=0;c<4;c++)pixels[i*4+c]=value[(channels>>>(c*8))&255]??0;
 }
 return {width,height,pixels};
}
export async function decodeSwitchASTC(source:string):Promise<HTMLCanvasElement>{
 const {width,height,pixels}=await decodeSwitchASTCPixels(source),canvas=document.createElement('canvas');canvas.width=width;canvas.height=height;
 const context=canvas.getContext('2d');if(!context)throw new Error('No texture context');
 const image=context.createImageData(width,height);image.data.set(pixels);context.putImageData(image,0,0);return canvas;
}
