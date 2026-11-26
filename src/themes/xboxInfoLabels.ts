export interface XboxLabelContext {user:string;time:string;date:string;label?:string}
/** Bind skin labels to host state. This parses strings; it never evaluates skin code. */
export function resolveXboxLabel(text:string,source:string,context:XboxLabelContext){
 const value=(key:string):string|undefined=>{
  switch(key.trim().replace(/\([^)]*\)$/,'').toLowerCase()){
   case 'time':case 'system.time':return context.time;
   case 'date':case 'system.date':return context.date;
   case 'user':case 'system.profilename':case 'system.username':return context.user;
   case 'listitem.label':return context.label??'';
   case 'listitem.label2':return '';
   case 'ip':case 'system.ipaddress':case 'mbtemp':case 'cputemp':case 'dvdtitle':return '—';
   default:return undefined;
  }
 };
 if(source)return value(source)??'—';
 const direct=value(text);if(direct!==undefined)return direct;
 return text.replace(/\$INFO\[([^\]]*)\]/gi,(_match,expression:string)=>{
  const [key,prefix='',...suffix]=expression.split(','),resolved=value(key);
  return resolved?prefix+resolved+suffix.join(','):resolved===undefined?'—':'';
 }).replace(/\$([^$\s]+)\$/g,(_match,key:string)=>value(key)??'—');
}
export function xboxGameImageKind(source:string):'icon'|'cover'|undefined{
 const key=source.trim().replace(/^\$INFO\[/i,'').replace(/\]$/,'').toLowerCase();
 if(['listitem.icon','listitem.actualicon'].includes(key))return 'icon';
 if(['listitem.thumb','listitem.thumbnail','listitem.art(thumb)','listitem.art(poster)'].includes(key))return 'cover';
 return undefined;
}
