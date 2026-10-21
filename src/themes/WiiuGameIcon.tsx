import {GameArt,Img} from "../common";
import {Game,gameIconUrls} from "../library";

/** Square icons first; wide library artwork remains fully fitted when no icon exists. */
export function WiiuGameIcon({game}:{game:Game}){
 const fallback=<><GameArt g={game} kind="hero" flat style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",filter:"blur(10px) brightness(.6)",transform:"scale(1.15)"}}/>
  <GameArt g={game} kind="logo" flat fit="contain" style={{position:"absolute",left:"8%",top:"8%",width:"84%",height:"84%",filter:"drop-shadow(0 1px 3px #0008)"}} logoFallback={<GameArt g={game} kind="landscape" flat fit="contain" style={{position:"absolute",inset:0,width:"100%",height:"100%"}}/>}/></>;
 return <div className="nt-game-icon" style={{position:"absolute",inset:0,overflow:"hidden",background:"#24364a"}}><Img srcs={gameIconUrls(game)} fit="contain" style={{position:"absolute",inset:0,width:"100%",height:"100%"}} fallback={fallback}/></div>;
}
