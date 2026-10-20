import * as THREE from "three";
import type {PersonalMii} from "./PersonalMii";
// Original Canvas artwork: deliberately flat features on the head's front plane.
export function drawnMiiFace(m:PersonalMii,blink=false,talking=false){
 const canvas=document.createElement("canvas");canvas.width=canvas.height=512;const x=canvas.getContext("2d")!;
 x.scale(512/4.6,512/4.6);x.translate(2.3,4.7);x.scale(1,-1);
 const stroke=(colour:string,width:number,draw:()=>void)=>{x.beginPath();draw();x.strokeStyle=colour;x.lineWidth=width;x.lineCap="round";x.lineJoin="round";x.stroke();};
 const oval=(cx:number,cy:number,rx:number,ry:number,colour:string)=>{x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);x.fillStyle=colour;x.fill();};
 const ink=m.eyeColor??"#24272b",lip=m.lipColor??"#74413d",ey=2.78-(m.eyeY??0)*.02,spacing=.86+(m.eyeSpacing??0)*.02;
 for(const side of [-1,1]){
  const cx=side*spacing;
  if(blink||m.eyes===2||(m.eyes===6&&side===1))stroke(ink,.065,()=>{x.moveTo(cx-.2,ey);x.quadraticCurveTo(cx,ey+.1,cx+.2,ey);});
  else if(m.eyes===3||m.eyes===5){x.beginPath();x.moveTo(cx-.26,ey);x.quadraticCurveTo(cx,ey+(m.eyes===5?.06:.22),cx+.26,ey);x.quadraticCurveTo(cx,ey-.16,cx-.26,ey);x.fillStyle=ink;x.fill();}
  else if(m.eyes===4||m.eyes===7){oval(cx,ey,.24,.28,"#fff8ed");oval(cx,ey,.13,.21,ink);oval(cx-.04,ey+.08,.035,.05,"white");if(m.eyes===7)stroke(ink,.055,()=>{x.moveTo(cx-.25,ey+.15);x.lineTo(cx-.34,ey+.26);x.moveTo(cx+.25,ey+.15);x.lineTo(cx+.34,ey+.26);});}
  else{oval(cx,ey,m.eyes===1?.19:.115,m.eyes===1?.25:.205,ink);if(m.eyes===1)oval(cx-.045,ey+.075,.04,.05,"#ffffff");}
  const by=ey+.56;stroke(m.hair,(m.brows??0)===1?.105:.07,()=>{x.moveTo(cx-.27,by);if(m.brows===1)x.lineTo(cx+.25,by-side*.12);else x.quadraticCurveTo(cx,by+(m.brows===2?.22:.09),cx+.27,by);});
 }
 stroke("#9f745a",.045,()=>{x.moveTo(.02,2.29);x.lineTo(-.14,1.98);x.quadraticCurveTo(.01,1.89,.17,1.99);});
 const my=1.16-(m.mouthY??0)*.02;
 if(talking){oval(0,my,.18,.24,lip);}
 else if(m.mouth===3){oval(0,my,.16,.22,lip);}
 else if(m.mouth===4){oval(0,my,.35,.16,lip);stroke("#fff8ed",.12,()=>{x.moveTo(-.23,my+.015);x.lineTo(.23,my+.015);});}
 else if(m.mouth===5){oval(0,my,.19,.075,lip);}
 else if(m.mouth===6||m.mouth===7){stroke(lip,.065,()=>{x.moveTo(-.3,my);x.quadraticCurveTo(0,my+(m.mouth===7?.25:-.05),.3,my+(m.mouth===6?.14:0));});}
 else if(m.mouth===1){x.beginPath();x.moveTo(-.36,my+.12);x.quadraticCurveTo(0,my-.48,.36,my+.12);x.closePath();x.fillStyle="#693932";x.fill();stroke(lip,.055,()=>{x.moveTo(-.36,my+.12);x.quadraticCurveTo(0,my-.48,.36,my+.12);x.closePath();});stroke("#fff8ec",.075,()=>{x.moveTo(-.23,my+.05);x.lineTo(.23,my+.05);});}
 else stroke(lip,.065,()=>{x.moveTo(-.3,my);if(m.mouth===2)x.lineTo(.3,my);else x.quadraticCurveTo(0,my-.24,.3,my);});
 const moustache=m.moustacheStyle??(m.moustache?1:0);
 if(moustache){x.fillStyle=m.hair;for(const side of [-1,1]){x.beginPath();x.moveTo(0,my+.28);if(moustache===2){x.lineTo(side*.43,my+.34);x.lineTo(side*.43,my+.22);}else if(moustache===3){x.quadraticCurveTo(side*.3,my+.53,side*.58,my+.38);x.quadraticCurveTo(side*.64,my+.7,side*.43,my+.55);}else if(moustache===4){x.quadraticCurveTo(side*.32,my+.46,side*.43,my-.12);x.lineTo(side*.23,my+.13);}else{x.quadraticCurveTo(side*.24,my+.52,side*.47,my+.21);}x.quadraticCurveTo(side*.22,my+.13,0,my+.28);x.fill();}}

 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=4;
 const geometry=new THREE.PlaneGeometry(4.6,4.6);geometry.translate(0,2.4,2.325);
 const material=new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.02,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-3,polygonOffsetUnits:-3,toneMapped:false});
 return {texture,geometry,material};
}
