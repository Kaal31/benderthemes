// Original Valve client artwork is downloaded from the verified theme asset pack.
import {bundledThemeFileUrl} from "../engine/registry";
const images=["downloads","exit","generic_800","icon_cart","icon_community_hub","mainmenu_bg_2","settings","steam_home"];
export function oldBigPictureAssets():Record<string,string>{
 return Object.fromEntries(images.map(name=>[name,bundledThemeFileUrl("old-big-picture",`assets/${name}.png`)??""]));
}
