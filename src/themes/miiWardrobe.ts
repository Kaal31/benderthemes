export const MII_OUTFITS=["Classic","Breton stripes","Zip jacket","Chevron","Varsity","Polo","Dungarees","Sport jersey","Cardigan","Tunic"];
export function clothingDetails(outfit:number,accent:string){
 const line=`stroke="${accent}" stroke-width="3" stroke-linecap="round" fill="none"`;
 const common='<path d="M96 303 Q120 308 144 303" stroke="#000" stroke-opacity=".18" stroke-width="2" fill="none"/><path d="M91 222 L94 299 M149 222 L146 299" stroke="#fff" stroke-opacity=".16" stroke-width="2" fill="none"/>';
 return common+[
 `<path d="M107 214 Q120 224 133 214" ${line}/>` ,
 `<path d="M94 241 H146 M94 259 H146 M94 277 H146" stroke="${accent}" stroke-width="7"/>`,
 `<path d="M120 219 V302 M97 271 L109 268 M131 268 L143 271" ${line}/><path d="M107 215 L115 230 120 222 125 230 133 215" ${line}/>`,
 `<path d="M96 235 L120 260 144 235" stroke="${accent}" stroke-width="8" fill="none"/>`,
 `<path d="M120 221 V303 M96 287 H144" ${line}/><path d="M107 214 Q120 230 133 214" stroke="${accent}" stroke-width="7" fill="none"/>`,
 `<path d="M106 213 L101 224 115 229 120 218 125 229 139 224 134 213" fill="${accent}"/><path d="M120 222 V244" ${line}/><circle cx="120" cy="236" r="1.5" fill="white"/>`,
 `<path d="M95 215 H106 V253 H134 V215 H145 V304 H95Z" fill="${accent}"/><path d="M111 269 H129 V283 H111Z" stroke="white" stroke-opacity=".5" fill="none"/><circle cx="101" cy="250" r="2" fill="#e8c45b"/><circle cx="139" cy="250" r="2" fill="#e8c45b"/>`,
 `<path d="M99 218 L106 247 M141 218 L134 247 M99 292 H141" stroke="${accent}" stroke-width="6" fill="none"/>`,
 `<path d="M106 215 L120 247 134 215 M120 246 V304 M97 282 H109 M131 282 H143" ${line}/><g fill="${accent}"><circle cx="120" cy="261" r="2"/><circle cx="120" cy="277" r="2"/><circle cx="120" cy="293" r="2"/></g>`,
 `<path d="M108 214 L120 233 132 214 M94 277 H146" stroke="${accent}" stroke-width="6" fill="none"/>`
 ][outfit] ;
}
