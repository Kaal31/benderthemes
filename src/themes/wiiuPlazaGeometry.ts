// The Wii U Plaza floor: a plain square drawn here (no Nintendo model data ships). The Miis are
// original models built in wiiuPlazaMiiModel.ts.
type Shape={positions:number[];indices:number[];uvs?:number[]};
const S=7.2/500;
const floor:Shape={positions:[-500,0,-500,500,0,-500,500,0,500,-500,0,500],indices:[0,2,1,0,3,2],uvs:[-500*S,-500*S,500*S,-500*S,500*S,500*S,-500*S,500*S]};
export const PLAZA_GEOMETRY={floor};
