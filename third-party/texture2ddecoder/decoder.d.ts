export interface TextureDecoder {decode_astc(data:Uint8Array,width:number,height:number,blockWidth:number,blockHeight:number):ArrayLike<number>|null}
declare const createModule:(options:{wasmBinary:Uint8Array;locateFile:(name:string)=>string})=>Promise<TextureDecoder>;
export default createModule;
