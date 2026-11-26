import type {Game} from './library';
import type {ArtworkMode} from './squareArtwork';

/** Ordered fallbacks shared by frame and 3D renderers. Keep hero/logo/wrap separate. */
export function artworkCandidates(game:Game,mode:ArtworkMode,custom?:string,icons:string[]=[]):string[]{
 const covers=[...game.art.portrait,...game.art.landscape];
 const preferred=mode==='covers'?[]:mode==='logos'?game.art.logo:custom?[custom]:mode==='icons'||mode==='square'?icons:[];
 return [...new Set([...preferred,...covers].filter(Boolean))];
}
