// GLB export of the stage's avatar (same recipe as app.js "Export current"): createExportAvatar makes a right-handed copy
// with baked base-colour maps (the live scene is only read), rightHandedClips mirrors the animation tracks to match.
import {GLTFExporter} from 'three/addons/exporters/GLTFExporter.js';
import {createExportAvatar,disposeExportAvatar,rightHandedClips} from '../../../avatar-render.js';
import {loadAnimationIndex,loadClip,toAnimationClip} from '../../../avatar-anim.js';

export const GLB_ANIMATIONS=[
  {id:'idle',label:'The ten idle presets'},
  {id:'current',label:'The clip playing on the stage now'},
  {id:'pose',label:'The pose chosen for the photo'},
  {id:'none',label:'No animation (current frame as rest)'},
];

async function pickClips(stage,mode,poseClipId){
  const m=stage.motion;if(!m||mode==='none')return [];
  if(mode==='idle')return m.presets.filter(Boolean);
  if(mode==='current'){const c=m.mode==='clip'?m.loopClip:m.player?.current?.entry.clip;return c?[c]:[];}
  if(mode==='pose')return poseClipId?[await loadClip(poseClipId)]:pickClips(stage,'current');   // "current frame" pose: the clip on the stage
  return [];
}

// Returns {data: ArrayBuffer, clips: [names], meshes: n}.
export async function exportGLB(stage,{animations='idle',poseClipId=null}={}){
  if(!stage?.avatar)throw Error('The avatar is still loading.');
  const index=await loadAnimationIndex();
  const names=new Map(index.clips.map(c=>[c.id,c.key||c.presetName||c.id]));
  const clips=(await pickClips(stage,animations,poseClipId)).map(c=>toAnimationClip(c,{name:`${names.get(c.id)||c.id} ${c.id}`}));
  let copy;
  try{
    copy=createExportAvatar(stage.avatar,stage.renderer);
    // The copy's group root has an identity transform; exporting its children as scene roots keeps the skinned meshes
    // at the root (no NODE_SKINNED_MESH_NON_ROOT warnings) without changing any world transform.
    const data=await new GLTFExporter().parseAsync([...copy.children],{binary:true,animations:rightHandedClips(clips),onlyVisible:true});
    return {data,clips:clips.map(c=>c.name),meshes:copy.children.filter(o=>o.isSkinnedMesh).length};
  }finally{if(copy)disposeExportAvatar(copy);stage.draw();}
}
