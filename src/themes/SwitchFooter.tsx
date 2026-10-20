import {useSwitchFont} from './useSwitchFont';
import {useContext} from 'react';
import type {ReactNode} from 'react';
import type {SwitchAnimation,SwitchEffect} from '../switchThemes';
import {SwitchNativeScene} from './SwitchNativeScene';
import {panelColor,SwitchMaterial} from './SwitchMaterial';
import {SwitchNativeContext} from './SwitchWidgetTree';
import {SCENE_DEFAULTS} from './switchSceneDefaults';
import {SwitchPicture} from './SwitchPicture';

type Props={effects:Record<string,SwitchEffect>;animations:SwitchAnimation[];modern:boolean;dark:boolean;enabled:boolean;open:boolean;pressed:boolean;scale:number;height:number;view:string;controller:ReactNode};
type Shared=Pick<Props,'effects'|'animations'|'modern'|'dark'|'enabled'>;
function labelWidth(label:string,family:string){const context=document.createElement('canvas').getContext('2d');if(context)context.font=`22px ${family}`;return Math.ceil(context?.measureText(label).width??label.length*14);}
function buttonMetrics(label:string,modern:boolean,patches:Record<string,SwitchEffect>|undefined,family:string){
 const nodes=SCENE_DEFAULTS[modern?'modern':'classic'].FooterBtn;
 const size=(name:string,fallback?:number)=>patches?.[name]?.Size?.X??fallback??nodes.find(p=>p.name===name)!.size[0];
 const tail=size('N_TailPadding'),head=size('N_HeadPadding'),gap=size('N_KeyPadding'),hold=patches?.N_HoldPadding?.Visible===true?size('N_HoldPadding'):0,text=size('T_00',labelWidth(label,family)),key=size('N_Key',36);
 return {tail,head,gap,hold,text,key,width:tail+text+gap+hold+key+head};
}
function FooterButton({label,symbol,pressed,...shared}:Shared&{label:string;symbol:string;pressed:boolean}){
 const {family}=useSwitchFont();
 const native=useContext(SwitchNativeContext),{tail,head,gap,hold,text,key,width}=buttonMetrics(label,shared.modern,native?.nativePanes?.FooterBtn,family),keyX=-(tail+text+gap+hold+key/2),runtime:Record<string,SwitchEffect>={
  'FooterBtn:NH_Root':{Size:{X:width,Y:70}},'FooterBtn:T_00':{Position:{X:-tail,Y:16},Size:{X:text,Y:33}},'FooterBtn:T_01':{Visible:false},
  'FooterBtn:N_KeyPadding':{Position:{X:-(tail+text),Y:0}},'FooterBtn:N_HoldPadding':{Position:{X:-(tail+text+gap),Y:0}},'FooterBtn:N_HeadPadding':{Position:{X:-(width-head),Y:0}},
  'FooterBtn:N_Key':{Position:{X:keyX,Y:0},Size:{X:key,Y:50}},
  'FooterBtn:T_Key':{Position:{X:0,Y:0},Size:{X:36,Y:36},OriginX:0,OriginY:0},
  'FooterBtn:P_TouchEff':{Size:{X:width,Y:62}},'FooterBtn:B_Hit':{Size:{X:width,Y:72}}
 };
 return <div style={{position:'absolute',left:'50%',top:'50%',width:0,height:0}}><SwitchNativeScene file="FooterBtn" {...shared} rootSize={[width,62]} events={['enter',...(pressed?['touch']:[])]} runtime={runtime} render={(node,effect)=>{
  if(node.name==='T_00')return {content:<SwitchMaterial surfaceStyle={false} effect={effect}><span style={{position:'absolute',inset:0,display:'flex',alignItems:'center',fontSize:22,fontFamily:family,whiteSpace:'nowrap',color:'white'}}>{label}</span></SwitchMaterial>};
  if(node.name==='T_Key')return {content:<SwitchMaterial surfaceStyle={false} effect={effect}><span style={{display:'flex',width:28,height:28,alignItems:'center',justifyContent:'center',borderRadius:'50%',background:'white',color:shared.dark?'#222':'#eee',fontSize:symbol==='+'?24:17,fontWeight:700,lineHeight:1}}>{symbol}</span></SwitchMaterial>};
  if(node.name==='P_TouchEff')return {hidden:!pressed,style:{background:panelColor(effect),opacity:pressed?1:0}};
  return {};
 }}/></div>;
}
export function SwitchFooter({open,pressed,scale,height,view,controller,...shared}:Props){
 const {family}=useSwitchFont();
 const native=useContext(SwitchNativeContext),start=view==='home'?'Start':'Open',width=buttonMetrics(start,shared.modern,native?.nativePanes?.FooterBtn,family).width;
 const runtime:Record<string,SwitchEffect>={'FooterAll:L_Btn_01':{Position:{X:-width,Y:0}}};
 const local=(children:ReactNode)=><div style={{position:'absolute',left:'50%',top:'50%',width:0,height:0}}>{children}</div>;
 const footer=<SwitchNativeScene file="FooterAll" {...shared} rootSize={[1280,720]} runtime={runtime} events={[open?'exit':'enter']} render={(node,effect)=>{
  if(/^L_Btn_0[2-5]$/.test(node.name)||node.name==='N_BtnOvlWrp')return {hidden:true};
  if(/^L_Btn_0[01]$/.test(node.name)){const main=node.name==='L_Btn_00',label=main?start:'Options';return {content:<FooterButton {...shared} {...{label,pressed}} symbol={main?'A':'+'}/>};}
  if(node.name==='L_Ctrl')return {content:local(<SwitchNativeScene file="FooterCtrl" {...shared} rootSize={[(effect.Size?.X??node.size[0]),(effect.Size?.Y??node.size[1])]} events={['enter']} render={(part,ink)=>{
   if(part.name==='P_CtrlDummy'){const picture=native?.nativePictures?.FooterCtrl?.P_CtrlDummy;return {alphaMask:true,content:<SwitchMaterial surfaceStyle={false} effect={ink}>{picture?<SwitchPicture picture={picture}/>:controller}</SwitchMaterial>};}
   if(part.name==='L_Indi_00')return {content:local(<SwitchNativeScene file="CntrIndicatorS" {...shared} rootSize={[8,38]} events={['enter']} render={(p,e)=>({style:p.type==='pic1'?{background:panelColor(e),borderRadius:'50%'}:undefined})}/>)};
   if(part.name==='P_IcoKey')return {content:<SwitchMaterial surfaceStyle={false} effect={ink}><span style={{fontSize:24,color:'white'}}>⌨</span></SwitchMaterial>};
   return {};
  }}/>) };
  if(node.part==='LineFooter')return {content:local(<SwitchNativeScene file="LineFooter" {...shared} rootSize={node.size} runtime={{'LineFooter:P_Line':{Size:{X:effect.Size?.X??node.size[0],Y:1}}}} events={['enter']} render={(part,ink)=>({style:part.name==='P_Line'?{background:panelColor(ink)}:undefined})}/>)};
  if(node.name==='P_Bg_Black'||node.name==='P_Bg_Gray')return {style:{background:panelColor(effect)}};
  return {};
 }}/>;
 return <div className="dht-switch-footer" data-native-footer="" style={{position:'absolute',zIndex:4,left:'50%',top:height/2,width:0,height:0,transform:`scale(${scale})`,pointerEvents:'none'}}><SwitchNativeScene file="Footer" {...shared} events={[open?'exit':'enter']} render={node=>node.name==='L_Footer'?{content:local(footer)}:{}}/></div>;
}
