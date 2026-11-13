import {callable,toaster} from '@decky/api';
import type {MenuItem} from './common';
import {getSettings,updateSettings,ThemeId} from './settings';
import {resourcesChanged} from './marketplaceState';
const download=callable<[theme:string],{success:boolean;error?:string;font?:{success:boolean;error?:string}}>('console_artwork_install');
export function consoleArtworkItems(theme:ThemeId):MenuItem[]{
 if(['wii','wiiu'].includes(theme))return [
  {label:'Use native Nintendo artwork and Mii models',get checked(){return getSettings().originalConsoleArtwork!==false;},action:()=>updateSettings({originalConsoleArtwork:getSettings().originalConsoleArtwork===false})},
  {label:'Download / retry native Nintendo resources',action:()=>{void download(theme==='wiiu'?'wiiu':'mii').then(result=>{if(!result?.success)throw new Error(result?.error??'Nintendo resource download unavailable');updateSettings({originalConsoleArtwork:true});resourcesChanged();}).catch(error=>toaster.toast({title:'Nintendo resource download failed',body:String(error)}));}},
 ];
 if(!['x360','xbox','ps3','psp'].includes(theme))return [];
 return [
  {label:'Use original console artwork when installed',get checked(){return getSettings().originalConsoleArtwork!==false;},action:()=>updateSettings({originalConsoleArtwork:getSettings().originalConsoleArtwork===false})},
  {label:'Download original console artwork from GitFlic',action:()=>{
   toaster.toast({title:'Console artwork',body:'Downloading and verifying the optional artwork pack. Current artwork remains available.'});
   void download(theme).then(result=>{
    if(!result?.success)throw new Error(result?.error??'Artwork download unavailable');
    updateSettings({originalConsoleArtwork:true});resourcesChanged();
    toaster.toast({title:'Console artwork ready',body:result.font?.success===false?'Stock artwork is installed. Convection is unavailable; the current font is kept. Retry this download to try again.':'Original artwork is installed. Missing images and fonts use the built-in fallback.'});
   }).catch(error=>toaster.toast({title:'Console artwork download failed',body:String(error)}));
  }},
 ];
}
