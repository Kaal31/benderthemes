// Native setRange adds two invisible columns and, for multi-row layouts, two rows.
export function widescreen(){return typeof window!=='undefined'&&innerWidth/innerHeight>4/3+.0001;}
export function aspectValue(data,key,fallback,wide=widescreen()){return wide?(data[key]??data[key+'_4_3']??fallback):(data[key+'_4_3']??data[key]??fallback);}
export function layoutPolicy(data={},factor=1,extendStacks=false){
 const read=(key,fallback)=>aspectValue(data,key,fallback);
 const raw=Number(read('columns',13)),base=raw>0?Math.min(21,Math.max(3,Math.round(raw)|1)):1;
 const reasons=[];
 for(const side of ['left','right']){
  if((read(side+'_delta_angle',[0,0,0])).some(v=>Math.abs(v)>.001))reasons.push(side+' angular progression');
  if((read(side+'_delta_scale',[1,1,1])).some(v=>Math.abs(v-1)>.001))reasons.push(side+' scale progression');
  const spacer=read(side+'_spacer',[side==='left'?-.35:.35,0,0]);
  if(Math.abs(spacer[0])<.01)reasons.push(side+' non-horizontal stack');
 }
 const safe=extendStacks||reasons.length===0;
 const columns=raw>0&&factor>1&&safe?Math.min(31,2*Math.ceil(Math.floor(base/2)*factor)+1):base;
 return {columns,bufferColumns:columns+2,visibleHalf:Math.floor(columns/2),baseColumns:base,widened:columns>base,reasons};
}
