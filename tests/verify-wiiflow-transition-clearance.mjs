import assert from 'node:assert/strict';import * as T from 'three';import {OBB} from 'three/addons/math/OBB.js';import {separationAlongRay,coverShadowOpacity} from '../themes/wiiflow-default/transitionClearance.js';
const bounds=(x,angle=0)=>new OBB(new T.Vector3(),new T.Vector3(.525,.75,.07)).applyMatrix4(new T.Matrix4().compose(new T.Vector3(x,0,0),new T.Quaternion().setFromEuler(new T.Euler(0,angle,0)),new T.Vector3(1,1,1)));
for(const angle of [0,.3,1,1.5])for(const direction of [new T.Vector3(1,0,0),new T.Vector3(0,0,1),new T.Vector3(.5,0,1).normalize()]){
 const a=bounds(0,angle),b=bounds(.15,-.4);assert(a.intersectsOBB(b));const travel=separationAlongRay(a,b,direction);assert(travel>0&&Number.isFinite(travel));a.center.addScaledVector(direction,travel);assert(!a.intersectsOBB(b,0),'Case must fully separate along the camera ray');
}
assert.equal(separationAlongRay(bounds(0),bounds(5),new T.Vector3(1,0,0)),0);
for(const offset of [-5,-1,0,1,5])assert.equal(coverShadowOpacity({color_shadow_beg:'#00000000',color_shadow_end:'#00000000'},offset),0);
assert.equal(coverShadowOpacity({color_shadow_beg:'#000000FF',color_shadow_center:'#00000000'},0),0);
assert.equal(coverShadowOpacity({color_shadow_beg:'#000000FF',color_shadow_center:'#00000000'},1),1);
assert.equal(coverShadowOpacity({},0),0);
console.log('PASS bounded oriented-case separation and source RGBA shadows, including VioletGrey zero-alpha compatibility');
