import {getSettings} from './settings';
import {applyPreset,currentPresetId,refreshPresets,switchPresets} from './presets';

/** Use installed presets, honour an optional pool, and avoid immediate repeats. */
export async function chooseRandomTheme(allowed:()=>boolean=()=>true){
 await refreshPresets();const settings=getSettings();if(!allowed()||!settings.enabled)return;
 const pool=settings.randomThemePool;
 const candidates=switchPresets(settings).filter(p=>!pool?.length||pool.includes(p.id));
 const others=candidates.filter(p=>p.id!==currentPresetId(settings));
 const eligible=others.length?others:candidates;
 if(eligible.length)applyPreset(eligible[Math.floor(Math.random()*eligible.length)]);
}
