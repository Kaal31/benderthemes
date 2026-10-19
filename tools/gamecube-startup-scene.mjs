import * as THREE from 'three';
window.createStartupScene=canvas=>{
 let renderer;try{renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:'low-power'});}catch{return null;}
 renderer.setSize(650,580,false);renderer.setPixelRatio(Math.min(devicePixelRatio,2));
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(33,650/580,.1,100);camera.position.set(0,0,15);
 scene.add(new THREE.AmbientLight(0x9b8bc8,1.4));const light=new THREE.DirectionalLight(0xf0e7ff,2.3);light.position.set(-3,5,8);scene.add(light);
 const group=new THREE.Group();scene.add(group);
 const materials=[0x8062bf,0x63479b,0xb499ec,0x4a347b,0x9879d7,0x7253b1].map(color=>new THREE.MeshPhongMaterial({color,shininess:45,specular:0x8876a6}));
 const tileGeometry=new THREE.BoxGeometry(.94,.94,.18),rollerGeometry=new THREE.BoxGeometry(.98,.98,.98);
 const points=[[2,2],[1,2],[0,2],[-1,2],[-2,2],[-2,1],[-2,0],[-2,-1],[-2,-2],[-1,-2],[0,-2],[1,-2],[2,-2],[2,-1],[2,0],[1,0],[0,0]].map(([x,y])=>new THREE.Vector3(x,y,0));
 const tiles=points.map(p=>{const tile=new THREE.Mesh(tileGeometry,materials);tile.position.copy(p);group.add(tile);return tile;});
 const roller=new THREE.Mesh(rollerGeometry,materials);group.add(roller);
 const rotations=[new THREE.Quaternion()],axes=[];const normal=new THREE.Vector3(0,0,1);
 for(let i=0;i<points.length-1;i++){const direction=points[i+1].clone().sub(points[i]).normalize(),axis=new THREE.Vector3().crossVectors(normal,direction).normalize();axes.push(axis);const quarter=new THREE.Quaternion().setFromAxisAngle(axis,Math.PI/2);rotations.push(quarter.multiply(rotations[i]).normalize());}
 const draw=t=>{
  const paced=Math.max(0,t-.12),step=Math.max(0,Math.min(points.length-1,paced/.145)),index=Math.floor(step),fraction=step-index;
  tiles.forEach((tile,i)=>{tile.visible=i<index||(t>2.7&&i===index);const form=Math.min(1,Math.max(0,(t-2.4)/.8));tile.scale.z=1+form*2;});
  roller.visible=t<2.98;roller.scale.setScalar(1-Math.min(.99,Math.max(0,(t-2.72)/.26)));roller.position.copy(points[index]);
  if(index<points.length-1){roller.position.lerp(points[index+1],fraction);const turn=new THREE.Quaternion().setFromAxisAngle(axes[index],fraction*Math.PI/2);roller.quaternion.copy(turn.multiply(rotations[index]));}
  else roller.quaternion.copy(rotations[index]);
  // The center rises while the cube rolls over its contacting edge.
  roller.position.z=.49+(.49*(Math.sin(fraction*Math.PI/2)+Math.cos(fraction*Math.PI/2)-1));
  const form=Math.min(1,Math.max(0,(t-2.4)/.8));group.rotation.set(-.48,-.5,0);group.scale.setScalar(.9+form*.08);
  if(t>3.65){const raw=Math.max(0,Math.min(1,(t-3.85)/2.6)),p=raw*raw*(3-2*raw),arc=Math.sin(Math.PI*p),deg=Math.PI/180;group.rotation.set(-(7+20*(1-p)+75*arc)*deg,(-8-27*(1-p)-35*arc)*deg,-(7-15*(1-p)-25*arc)*deg);group.scale.setScalar(.98*(.49+.27*p+.008*arc)/.49);}

  renderer.render(scene,camera);
 };
 return {draw,dispose(){tileGeometry.dispose();rollerGeometry.dispose();materials.forEach(m=>m.dispose());renderer.dispose();}};
};
