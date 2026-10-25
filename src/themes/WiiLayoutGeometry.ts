/** Nine-slice grid keeps native window corners at texture size instead of stretching them. */
export function wiiWindowGrid(width:number,height:number,textureWidth:number,textureHeight:number,origin:number,uv:number[]){
 const left=-(origin%3)*width/2,bottom=-(2-Math.floor(origin/3))*height/2,bx=Math.min(Math.abs(width)/2,textureWidth),by=Math.min(Math.abs(height)/2,textureHeight),xs=[left,left+bx,left+width-bx,left+width],ys=[bottom+height,bottom+height-by,bottom+by,bottom],position:number[]=[],coords:number[]=[],index:number[]=[],weights:number[][]=[];
 for(let y=0;y<4;y++)for(let x=0;x<4;x++){const u=[0,1,1,0][x],v=[0,1,1,0][y],w=[(1-u)*(1-v),u*(1-v),(1-u)*v,u*v];position.push(xs[x],ys[y],0);coords.push(w.reduce((n,k,i)=>n+k*uv[i*2],0),w.reduce((n,k,i)=>n+k*uv[i*2+1],0));weights.push(w);}
 for(let y=0;y<3;y++)for(let x=0;x<3;x++){const i=y*4+x;index.push(i,i+4,i+1,i+4,i+5,i+1);}
 return {position,uv:coords,index,weights};
}
