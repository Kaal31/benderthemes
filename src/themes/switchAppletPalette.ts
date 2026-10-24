// Service slots in the static palette are magenta placeholders. Use scoped
// substitute defaults (not a firmware palette dump) for their owning resource; a
// theme's explicit C_W=0 color and other uses of those indices stay intact.
const online={32:[230,0,18,255]};
const sharing={110:[0,163,153,255]};
export function switchAppletPalette(slot:string):Record<number,number[]>|undefined{
 const resource=slot.split(':');
 return resource.includes('RdtBtnLR')?online:resource.includes('RdtBtnSplay')?sharing:undefined;
}
