import {GameArt} from "../common";
import {fmtPlaytime,Game} from "../library";

/** Game information panel beside the system-style action list. */
export function SwitchGamePreview({game}:{game:Game}){
  return <section className="dht-switch-game-preview" aria-label="Game preview">
    <div className="dht-switch-game-hero"><GameArt g={game} kind="hero" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
    <div className="dht-switch-game-shade"/>
    <div className="dht-switch-game-cover"><GameArt g={game} kind="portrait" style={{width:"100%",height:"100%",objectFit:"cover"}}/></div>
    <div className="dht-switch-game-summary"><span className="dht-switch-game-status">{game.overview?.running?"Currently playing":game.installed?"Ready to play":"In your library"}</span><h2>{game.name}</h2><p>{fmtPlaytime(game.playtime,game.lastPlayed)}</p><span>{game.installed?"Installed":"Not installed"}</span></div>
  </section>;
}
