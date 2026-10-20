import type {SwitchAnimation} from '../switchThemes';

/** NXThemes replaces a BFLAN resource, rather than patching its missing tracks. */
export function composeSwitchAnimations(defaults:SwitchAnimation[],imported:SwitchAnimation[],files?:string[]):SwitchAnimation[]{
 const replacements=new Set(files??[]);
 return [...defaults.filter(animation=>!animation.source||!replacements.has(animation.source)),...imported];
}
