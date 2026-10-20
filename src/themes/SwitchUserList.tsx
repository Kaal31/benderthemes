import {SwitchNativeScene} from './SwitchNativeScene';
import {SwitchMaterial} from './SwitchMaterial';
import {SwitchUserCard} from './SwitchUserCard';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';

export interface SwitchDialogUser{label:string;avatar?:string;status?:string;notice?:boolean;syncing?:boolean}
/** The native resource has eight slots. Missing host accounts stay hidden. */
export function SwitchUserList({users,...shared}:{users:SwitchDialogUser[];effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean}){
 const count=Math.min(8,users.length),bottom=32+count*72,runtime={'DCntUserIconNameStatus:N_MarginBtm':{Position:{X:0,Y:-bottom}},'DCntUserIconNameStatus:N_Btn':{Position:{X:0,Y:-(bottom+32)}}};
 return <div data-native-user-list="" style={{position:'relative',height:bottom+32}}><div style={{position:'absolute',left:'50%',top:0,width:0,height:0}}><SwitchNativeScene file="DCntUserIconNameStatus" {...shared} runtime={runtime} rootSize={[0,0]} events={['enter']} render={(node,effect)=>{
  const match=/^N_User_(\d+)$/.exec(node.name);if(match)return {hidden:Number(match[1])>=count};
  if(node.part==='UserIconNameStatus'){const user=users[Number(node.name.slice(-2))];return {replacePart:true,content:user?<SwitchUserCard file="UserIconNameStatus" {...user} {...shared}/>:undefined};}
  if(node.type==='pic1')return {content:<SwitchMaterial surfaceStyle={false} effect={effect}><span style={{display:'block',width:'100%',height:'100%',background:'white'}}/></SwitchMaterial>};
  return {};
 }}/></div></div>;
}
