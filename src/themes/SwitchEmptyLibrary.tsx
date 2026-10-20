import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeScene} from './SwitchNativeScene';
import {SwitchMaterial} from './SwitchMaterial';
import {SwitchText} from './SwitchText';

/** Host empty-library state reveals the native blank label. Authored pane
 * overrides retain precedence over that runtime visibility default. */
export function SwitchEmptyLibrary({effects,animations,modern,dark,enabled,scale}:{effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean;scale:number}){
 return <div data-native-empty-library="" style={{position:'absolute',left:'50%',top:'50%',width:0,height:0,transform:`scale(${scale})`}}><SwitchNativeScene file="RdtBase" {...{effects,animations,modern,dark,enabled}} runtime={{'RdtBase:T_Blank':{Visible:true}}} events={['enter']} render={(node,effect)=>({content:<SwitchMaterial surfaceStyle={false} effect={effect}><SwitchText text="No games found for the selected library view." metrics={node.text} enabled={enabled}/></SwitchMaterial>})}/></div>;
}
