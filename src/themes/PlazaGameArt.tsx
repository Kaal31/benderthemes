import {GameArt} from "../common";
import type {Game} from "../library";
import {WiiuGameIcon} from "./WiiuGameIcon";

export type PlazaArtwork="square"|"covers"|"landscape"|"logos";
export function plazaArtwork(value:unknown):PlazaArtwork{return value==="square"||value==="covers"||value==="landscape"?value:"logos";}
/** The same selection paints the visible tile and its optional frosted edge. */
export function PlazaGameArt({game,artwork="logos"}:{game:Game;artwork?:PlazaArtwork}){
 if(artwork==="logos")return <div data-plaza-artwork="logos" style={{position:"absolute",inset:0}}><WiiuGameIcon game={game} clean/></div>;
 return <div data-plaza-artwork={artwork} style={{position:"absolute",inset:0,overflow:"hidden",background:"linear-gradient(145deg,#edf2f4,#d8e3e9)"}}><GameArt g={game} kind={artwork==="landscape"?"landscape":"portrait"} flat fit={artwork==="square"?"cover":"contain"} style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/></div>;
}
