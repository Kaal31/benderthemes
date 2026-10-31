import {useId} from 'react';

// Optical bounds are centered on (18,18), independent of font metrics.
const shapes:Record<string,string>={
 A:'M15.8 8h4.4L28 28h-4.6l-1.7-4.5h-7.5L12.5 28H8z M15.4 19.7h5.2L18 12.6z',
 '+':'M16 8h4v8h8v4h-8v8h-4v-8H8v-4h8z',
};
export function SwitchPromptGlyph({symbol,size=28,ink='white',symbolColor}:{symbol:'A'|'+';size?:number;ink?:string;symbolColor?:string}){
 const mask='nx-prompt-'+useId().replace(/[^a-zA-Z0-9]/g,'');
 return <svg data-switch-prompt={symbol} width={size} height={size} viewBox="0 0 36 36" aria-label={symbol} style={{display:'block',flexShrink:0}}>
  {symbolColor?<><circle cx="18" cy="18" r="18" fill={ink}/><path d={shapes[symbol]} fill={symbolColor} fillRule="evenodd"/></>:<><defs><mask id={mask} maskUnits="userSpaceOnUse" x="0" y="0" width="36" height="36"><circle cx="18" cy="18" r="18" fill="white"/><path d={shapes[symbol]} fill="black" fillRule="evenodd"/></mask></defs><circle cx="18" cy="18" r="18" fill={ink} mask={`url(#${mask})`}/></>}
 </svg>;
}
