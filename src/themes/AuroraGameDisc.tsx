import {useEffect,useRef} from 'react';
import * as THREE from 'three';
import type {Game} from '../library';
import {discImage,discLabel} from './auroraDiscLabel';
export function AuroraGameDisc({game,spinning,motion}:{game?:Game;spinning:boolean;motion:boolean}){
 const host=useRef<HTMLDivElement>(null),live=useRef({spinning,motion});live.current={spinning,motion};
 useEffect(()=>{const mount=host.current;if(!mount)return;let renderer:THREE.WebGLRenderer;try{renderer=new THREE.WebGLRenderer({alpha:true,antialias:true})}catch{return}
 renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,2));renderer.setSize(80,80);renderer.outputColorSpace=THREE.SRGBColorSpace;mount.appendChild(renderer.domElement);
 const scene=new THREE.Scene(),camera=new THREE.PerspectiveCamera(32,1,.1,10);camera.position.set(0,0,2.15);scene.add(new THREE.HemisphereLight(0xffffff,0x324050,1.8));const light=new THREE.DirectionalLight(0xffffff,2.3);light.position.set(-2,3,4);scene.add(light);
 const disc=new THREE.Group();disc.rotation.y=-.32;disc.rotation.x=.1;scene.add(disc);const rotor=new THREE.Group();disc.add(rotor);const texture=new THREE.CanvasTexture(discLabel(undefined,undefined,game?.name??''));texture.colorSpace=THREE.SRGBColorSpace;
 const face=new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}),metal=new THREE.MeshStandardMaterial({color:0xc8d5e2,metalness:.75,roughness:.28}),ring=new THREE.RingGeometry(.075,.5,96),outer=new THREE.CylinderGeometry(.5,.5,.022,96,1,true),inner=new THREE.CylinderGeometry(.075,.075,.022,64,1,true);outer.rotateX(Math.PI/2);inner.rotateX(Math.PI/2);
 const front=new THREE.Mesh(ring,face);front.position.z=.012;rotor.add(front);const back=new THREE.Mesh(ring,metal);back.position.z=-.012;back.rotation.y=Math.PI;rotor.add(back);rotor.add(new THREE.Mesh(outer,metal));const innerMaterial=metal.clone();innerMaterial.side=THREE.DoubleSide;rotor.add(new THREE.Mesh(inner,innerMaterial));
 let alive=true;Promise.all([discImage(game?.art.portrait??[]),discImage(game?.art.logo??[])]).then(([cover,logo])=>{if(!alive)return;texture.image=discLabel(cover,logo,game?.name??'');texture.needsUpdate=true;mount.dataset.logo=logo?'image':'title';mount.dataset.label='logo-and-cover-palette'});
 let frame=0,last=0,angle=0;const tick=(now:number)=>{if(now-last>=32){const dt=last?Math.min(.1,(now-last)/1000):0;last=now;if(live.current.motion)angle+=dt*(live.current.spinning?Math.PI*2/4:Math.PI*2/24);rotor.rotation.y=angle;rotor.rotation.z=0;mount.dataset.rotationAxis='y';mount.dataset.rotation=String(angle);renderer.render(scene,camera)}frame=requestAnimationFrame(tick)};frame=requestAnimationFrame(tick);
 return()=>{alive=false;cancelAnimationFrame(frame);ring.dispose();outer.dispose();inner.dispose();face.dispose();metal.dispose();innerMaterial.dispose();texture.dispose();renderer.dispose();renderer.forceContextLoss();renderer.domElement.remove()};
 },[game?.appid,game?.art]);
 return <div ref={host} data-aurora-disc-icon data-disc-renderer='3d' role='img' aria-label={game?game.name+' disc':'Game disc'} style={{width:80,height:80,margin:'-10px -7px',position:'relative',flexShrink:0}}/>;
}

/** A static printed label, without creating another WebGL context. */
export function AuroraFlatDisc({game}:{game?:Game}){
 const host=useRef<HTMLCanvasElement>(null);
 useEffect(()=>{let alive=true;Promise.all([discImage(game?.art.portrait??[]),discImage(game?.art.logo??[])]).then(([cover,logo])=>{if(!alive||!host.current)return;const g=host.current.getContext('2d');if(!g)return;g.clearRect(0,0,160,160);g.save();g.beginPath();g.arc(80,80,76,0,Math.PI*2);g.arc(80,80,11,0,Math.PI*2,true);g.clip('evenodd');g.drawImage(discLabel(cover,logo,game?.name??''),0,0,160,160);g.restore()});return()=>{alive=false}},[game?.appid,game?.art]);
 return <canvas ref={host} width={160} height={160} data-aurora-disc-icon data-disc-renderer='flat' role='img' aria-label={(game?.name??'Game')+' disc'} style={{width:60,height:60,flexShrink:0}}/>;
}
