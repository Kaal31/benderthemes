import {ReactNode} from "react";
import {useSteamStatus} from "./steam";
export function ProfileAvatar({size=32,fallback}:{size?:number;fallback?:ReactNode}){
 const {avatar}=useSteamStatus();return avatar?<img src={avatar} alt="Profile picture" style={{width:size,height:size,objectFit:"cover",borderRadius:"inherit",display:"block"}}/>:<>{fallback??"●"}</>;
}
