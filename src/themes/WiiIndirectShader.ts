import type {Layout} from './WiiNativeScene';
type Material=Layout['materials'][number];
type Stage=NonNullable<Material['tev']>[number];
const uv=['uv01.xy','uv01.zw','uv23.xy','uv23.zw','uv45.xy','uv45.zw','uv67.xy','uv67.zw'];
const n=(value:number)=>Number(value).toFixed(8);
/** Translate the bounded static indirect lookup pipeline; native shader code is not executed. */
export function wiiIndirectShader(material:Material){
 const enabled=!!material.indirectStages?.length||!!material.tev?.some(stage=>stage.indirect?.some(Boolean));
 const coordinateMap=(coord:number)=>{
  let map=0;
  for(const stage of material.indirectStages??[])if(stage[0]===coord&&stage[1]<8)map=stage[1];
  for(const stage of material.tev??[])if(stage.coord===coord&&stage.map<8)map=stage.map;
  return map;
 };
 const coordinate=(coord:number)=>coord>=0&&coord<8?`(srt${coord}*vec3(${uv[coord]},1.)).xy*texSize${coordinateMap(coord)}`:'vec2(0.)';
 const setup=enabled?'vec2 previousTexelCoord=vec2(0.);float indirectBump=0.;'+(material.indirectStages??[]).map(([coord,map,s,t],i)=>{
  const value=map<8?`read${map}(${coordinate(coord)}/max(texSize${map},vec2(1.))/vec2(${n(2**Math.min(s,8))},${n(2**Math.min(t,8))})).abg`:'vec3(0.)';
  return `vec3 indirectSample${i}=floor(${value}*255.+.5);`;
 }).join(''):'';
 return {
  enabled,setup,
  declarations:enabled?Array.from({length:8},(_,i)=>`uniform vec2 texSize${i};`).join('')+Array.from({length:3},(_,i)=>`uniform mat3 indMtx${i};`).join(''):'',
  stage(stage:Stage,index:number){
   if(!enabled)return {code:'',coordinate:stage.coord<8?`(srt${stage.coord}*vec3(${uv[stage.coord]},1.)).xy`:'vec2(0.)'};
   const [lookup=0,selection=0,wrap=0,flags=0]=stage.indirect??[],matrix=(selection>>3)&15,bias=selection&7,format=flags&3;
   const input=lookup<(material.indirectStages?.length??0)?`indirectSample${lookup}`:'vec3(0.)';
   const bits=[8,5,4,3][format],value=`floor(${input}/${n(2**(8-bits))})`,biased=`(${value}+vec3(${[1,2,4].map(mask=>bias&mask?(format===0?'-128.':'1.'):'0.').join(',')}))`;
   const offset=matrix>=1&&matrix<=3?`(indMtx${matrix-1}*${biased}).xy`:'vec2(0.)';
   const alpha=(flags>>4)&3,component=alpha?`${input}.${'xyz'[alpha-1]}`:'0.',bump=format===0?`floor(${component}/8.)*8.`:`mod(${component},${n(2**(8-bits))})*${n(2**bits)}`;
   const bumpCode=alpha&&lookup<(material.indirectStages?.length??0)?`indirectBump=${bump};`:'';
   const wrapAxis=(axis:string,mode:number)=>mode===0?axis:mode>=6?'0.':`mod(${axis},${n(2**(9-mode))})`;
   return {
    code:bumpCode+`vec2 baseCoord${index}=${coordinate(stage.coord)};vec2 adjustedCoord${index}=vec2(${wrapAxis(`baseCoord${index}.x`,wrap&7)},${wrapAxis(`baseCoord${index}.y`,(wrap>>3)&7)})+${offset};previousTexelCoord=${flags&4?'previousTexelCoord+':''}adjustedCoord${index};`,
    coordinate:`previousTexelCoord/max(texSize${stage.map<8?stage.map:coordinateMap(stage.coord)},vec2(1.))`
   };
  }
 };
}
