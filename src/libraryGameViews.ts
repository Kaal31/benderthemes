import type {Library} from './library';
import type {Settings} from './settings';
import {gameChoice} from './gameFilters';
/** Data for existing native selectors; selecting All can always leave a configured subset. */
export function libraryGameViews(lib:Library,settings:Settings){
 const choice=gameChoice(settings,'library');
 return [
  {id:'all',name:'All Games',games:lib.all},
  {id:'installed',name:'Installed Games',games:lib.all.filter(g=>g.installed)},
  {id:'steam',name:'Steam Games',games:lib.all.filter(g=>!g.shortcut)},
  {id:'non-steam',name:'Non-Steam Games',games:lib.all.filter(g=>g.shortcut)},
  {id:'uninstalled',name:'Not Installed',games:lib.all.filter(g=>!g.installed)},
  ...(choice.source==='collections'?[{id:'collections',name:'Selected Collections',games:lib.games}]:[]),
  ...lib.collections.map(c=>({...c,id:'col:'+c.id})),
 ];
}
