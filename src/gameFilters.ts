import type {Settings,ThemeId} from './settings';
export type GamePage='home'|'library';
export function gameFilterKey(settings:Settings,theme:ThemeId=settings.theme):ThemeId {
 return ((theme==='frame'||theme==='native')&&settings.activeTheme?settings.activeTheme:theme) as ThemeId;
}
export function gameChoice(settings:Settings,page:GamePage,theme:ThemeId=settings.theme){
 const key=gameFilterKey(settings,theme);
 return (page==='library'?(settings.libraryCollections?.[key]??settings.libraryCollections?.[theme]):undefined)??settings.themeCollections?.[key]??settings.themeCollections?.[theme]??{source:settings.source};
}
export function gameChoiceLabel(settings:Settings,page:GamePage,theme:ThemeId=settings.theme){
 const choice=gameChoice(settings,page,theme);
 const names:Record<string,string>={all:'All games',installed:'Installed',uninstalled:'Not installed',steam:'Steam games','non-steam':'Non-Steam',collections:'Collections'};
 return names[choice.source]??'Collection';
}
