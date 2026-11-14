/** UV rectangles for the broad front/back sheets of an imported case. */
export interface CoverMesh {positions:number[];uv:number[];indices:number[];groups:{texture:string;start:number;count:number}[]}
export interface CoverPanel {left:number;top:number;right:number;bottom:number;aspect:number}
export function coverPanels(mesh:CoverMesh):CoverPanel[]{
 const sides=new Map<number,CoverPanel>(),bounds=new Map<number,{x0:number;x1:number;y0:number;y1:number}>();
 for(const group of mesh.groups){if(!/cover/i.test(group.texture))continue;
  for(let offset=group.start;offset<group.start+group.count;offset+=3){
   const ids=mesh.indices.slice(offset,offset+3);if(ids.length!==3)continue;
   const p=ids.map(i=>mesh.positions.slice(i*3,i*3+3)),u=p[1].map((v,i)=>v-p[0][i]),v=p[2].map((v,i)=>v-p[0][i]),normal=[u[1]*v[2]-u[2]*v[1],u[2]*v[0]-u[0]*v[2],u[0]*v[1]-u[1]*v[0]];
   if(Math.abs(normal[2])<Math.hypot(...normal)*.95||Math.abs(normal[2])<.01)continue;
   const key=Math.sign(normal[2]),uv=ids.map(i=>mesh.uv.slice(i*2,i*2+2)),panel=sides.get(key)??{left:1,top:1,right:0,bottom:0,aspect:1};
   for(const point of uv){panel.left=Math.min(panel.left,point[0]);panel.right=Math.max(panel.right,point[0]);panel.top=Math.min(panel.top,point[1]);panel.bottom=Math.max(panel.bottom,point[1]);}sides.set(key,panel);const box=bounds.get(key)??{x0:Infinity,x1:-Infinity,y0:Infinity,y1:-Infinity};for(const point of p){box.x0=Math.min(box.x0,point[0]);box.x1=Math.max(box.x1,point[0]);box.y0=Math.min(box.y0,point[1]);box.y1=Math.max(box.y1,point[1]);}bounds.set(key,box);panel.aspect=(box.x1-box.x0)/Math.max(.00001,box.y1-box.y0);
  }
 }
 return [...sides.values()].filter(p=>p.right>p.left&&p.bottom>p.top).sort((a,b)=>a.left-b.left);
}
/** Fill a case panel without adding an inset or stretching the source's aspect ratio. */
export function artworkCrop(sourceWidth:number,sourceHeight:number,width:number,height:number){
 const scale=Math.max(width/sourceWidth,height/sourceHeight),sw=width/scale,sh=height/scale;
 return {x:(sourceWidth-sw)/2,y:(sourceHeight-sh)/2,width:sw,height:sh};
}
