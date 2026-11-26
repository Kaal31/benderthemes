/** Nine-slice grid keeps native window corners at texture size instead of stretching them. */
export function wiiWindowGrid(width:number,height:number,textureWidth:number,textureHeight:number,origin:number,uv:number[]){
 const left=-(origin%3)*width/2,bottom=-(2-Math.floor(origin/3))*height/2,bx=Math.min(Math.abs(width)/2,textureWidth),by=Math.min(Math.abs(height)/2,textureHeight),xs=[left,left+bx,left+width-bx,left+width],ys=[bottom+height,bottom+height-by,bottom+by,bottom],position:number[]=[],coords:number[]=[],index:number[]=[],weights:number[][]=[];
 for(let y=0;y<4;y++)for(let x=0;x<4;x++){const u=[0,1,1,0][x],v=[0,1,1,0][y],w=[(1-u)*(1-v),u*(1-v),(1-u)*v,u*v];position.push(xs[x],ys[y],0);coords.push(w.reduce((n,k,i)=>n+k*uv[i*2],0),w.reduce((n,k,i)=>n+k*uv[i*2+1],0));weights.push(w);}
 for(let y=0;y<3;y++)for(let x=0;x<3;x++){const i=y*4+x;index.push(i,i+4,i+1,i+4,i+5,i+1);}
 return {position,uv:coords,index,weights};
}

export interface WiiWindowRect {x:number;y:number;width:number;height:number;uv?:number[]}
const flips=[
 [0,0,1,0,0,1,1,1], [1,0,0,0,1,1,0,1], [0,1,1,1,0,0,1,0],
 [0,1,0,0,1,1,1,0], [1,1,0,1,1,0,0,0], [1,0,1,1,0,0,0,1]
];
/** UVs are anchored to each frame's outside corner; long edges retain texel scale. */
export function wiiFrameUv(width:number,height:number,textureWidth:number,textureHeight:number,flip:number,anchor:number){
 const corners=flips[flip]??flips[0],ax=anchor%2,ay=Math.floor(anchor/2),out:number[]=[];
 for(let i=0;i<4;i++)for(let axis=0;axis<2;axis++){
  const dimension=Math.max(1,axis===0?textureWidth:textureHeight);
  out.push(corners[anchor*2+axis]+(i%2-ax)*(corners[2+axis]-corners[axis])*width/dimension+(Math.floor(i/2)-ay)*(corners[4+axis]-corners[axis])*height/dimension);
 }
 return out;
}
/** Native windows keep content independent from 1/4/8 border materials. Local y points up. */
export function wiiWindowParts(width:number,height:number,origin:number,inflation:number[],frames:{width:number;height:number;flip:number}[]){
 const n=frames.length,first=frames[0],last=frames[n===1?0:3];
 let l=first?.width??0,t=first?.height??0,r=last?.width??0,b=last?.height??0;
 // Malformed/tiny animated windows must not invert the center or their border quads.
 const sx=Math.min(1,Math.max(0,width)/Math.max(1,l+r)),sy=Math.min(1,Math.max(0,height)/Math.max(1,t+b));l*=sx;r*=sx;t*=sy;b*=sy;
 const left=-(origin%3)*width/2,top=Math.floor(origin/3)*height/2;
 const rect=(x:number,y:number,w:number,h:number):WiiWindowRect=>({x:left+x,y:top-y,width:Math.max(0,w),height:Math.max(0,h)});
 const content=rect(l-(inflation[0]??0),t-(inflation[2]??0),width-l-r+(inflation[0]??0)+(inflation[1]??0),height-t-b+(inflation[2]??0)+(inflation[3]??0));
 const pieces=n===8?[
  rect(0,0,l,t),rect(width-r,0,r,t),rect(0,height-b,l,b),rect(width-r,height-b,r,b),
  rect(0,t,l,height-t-b),rect(width-r,t,r,height-t-b),rect(l,0,width-l-r,t),rect(l,height-b,width-l-r,b)
 ]:n===1||n===4?[
  rect(0,0,width-r,t),rect(width-r,0,r,height-b),rect(0,t,l,height-t),rect(l,height-b,width-l,b)
 ]:[];
 const anchors=[0,1,2,3,2,1,0,3];
 pieces.forEach((piece,i)=>{const frame=frames[n===1?0:i];piece.uv=wiiFrameUv(piece.width,piece.height,frame.width,frame.height,n===1?[0,1,2,4][i]:frame.flip,anchors[i]);});
 return {content,frames:pieces};
}
