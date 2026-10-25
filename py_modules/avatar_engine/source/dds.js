// Standard DXT1/3/5 DDS -> RGBA8 (row 0 first). Mirrors reverse-engineering/export_decoded_samples.bc_rgba.
export function decodeDDS(buffer){
  const bytes=new Uint8Array(buffer),view=new DataView(buffer);
  if(String.fromCharCode(...bytes.subarray(0,4))!=='DDS ')throw Error('Not a DDS texture');
  const height=view.getUint32(12,true),width=view.getUint32(16,true);
  const format=String.fromCharCode(...bytes.subarray(84,88)),stride=format==='DXT1'?8:16;
  if(!['DXT1','DXT3','DXT5'].includes(format))throw Error(`Unsupported DDS format ${format}`);
  const data=bytes.subarray(128);
  if(data.length!==Math.ceil(width/4)*Math.ceil(height/4)*stride)throw Error('DDS bounds');
  const out=new Uint8Array(width*height*4),alpha=new Uint8Array(16),colours=[[0,0,0],[0,0,0],[0,0,0],[0,0,0]];
  const rgb=(v,c)=>{const r=(v>>11)&31,g=(v>>5)&63,b=v&31;c[0]=(r<<3)|(r>>2);c[1]=(g<<2)|(g>>4);c[2]=(b<<3)|(b>>2);};
  let at=0;
  for(let by=0;by<height;by+=4)for(let bx=0;bx<width;bx+=4,at+=stride){
    alpha.fill(255);
    if(format==='DXT3'){for(let i=0;i<16;i++)alpha[i]=((data[at+(i>>1)]>>((i&1)*4))&15)*17;}
    else if(format==='DXT5'){
      const a=data[at],c=data[at+1],p=[a,c];
      if(a>c)for(let i=1;i<7;i++)p.push(Math.floor(((7-i)*a+i*c+3)/7));
      else{for(let i=1;i<5;i++)p.push(Math.floor(((5-i)*a+i*c+2)/5));p.push(0,255);}
      let bits=0n;for(let i=5;i>=0;i--)bits=(bits<<8n)|BigInt(data[at+2+i]);
      for(let i=0;i<16;i++)alpha[i]=p[Number((bits>>BigInt(i*3))&7n)];
    }
    const o=at+stride-8,c0=data[o]|(data[o+1]<<8),c1=data[o+2]|(data[o+3]<<8);
    rgb(c0,colours[0]);rgb(c1,colours[1]);
    const transparent=format==='DXT1'&&c0<=c1;
    for(let k=0;k<3;k++){
      const x=colours[0][k],y=colours[1][k];
      if(transparent){colours[2][k]=(x+y)>>1;colours[3][k]=0;}
      else{colours[2][k]=Math.floor((2*x+y+1)/3);colours[3][k]=Math.floor((x+2*y+1)/3);}
    }
    const indices=(data[o+4]|(data[o+5]<<8)|(data[o+6]<<16)|(data[o+7]<<24))>>>0;
    for(let i=0;i<16;i++){
      const x=bx+(i&3),y=by+(i>>2);if(x>=width||y>=height)continue;
      const index=(indices>>>(i*2))&3,p=(y*width+x)*4,c=colours[index];
      out[p]=c[0];out[p+1]=c[1];out[p+2]=c[2];out[p+3]=transparent&&index===3?0:alpha[i];
    }
  }
  return {width,height,data:out};
}
