import type {SwitchEffect} from '../switchThemes';
export interface SwitchPartOverride{material?:string;effect?:SwitchEffect;geometry?:SwitchEffect;alpha?:number;partOverrides?:Record<string,SwitchPartOverride>}
export interface SwitchScenePane{
 name:string;type:string;parent:string|null;origin:number;alpha:number;influenceAlpha?:boolean;visible:boolean;position:number[];scale:number[];rotation:number[];size:number[];slot:string;legacySlot?:string;part?:string;partMagnify?:number[];partOverrides?:Record<string,SwitchPartOverride>;material?:string;effect?:SwitchEffect;text?:{fontSize:number[];alignment:number;lineAlignment:number;characterSpace:number;lineSpace:number};
}
