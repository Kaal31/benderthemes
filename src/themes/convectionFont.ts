import {useAssets} from '../assets';

/** Optional native font; CSS font matching keeps the previous face on failure. */
export function useConvectionFont(){
 const assets=useAssets('x360-convection-font');
 const url=assets.regular;
 if(!url)return '';
 return `@font-face{font-family:"DHT Convection";src:url(${JSON.stringify(url)}) format("truetype");font-style:normal;font-weight:400;font-display:swap}
 [data-nxe-surface]{--dht-font:"DHT Convection","Segoe UI",Arial,sans-serif}
 .dht-blades,.dht-menu--blades,.dht-blades-pages{--dht-blades-font:"DHT Convection","DHT Blades"}
 .dht-blades-pages{font-family:var(--dht-blades-font),Tahoma,sans-serif}`;
}
