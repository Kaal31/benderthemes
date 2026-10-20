export const PLAZA_POST_INTERVALS={calm:60000,normal:4200,busy:2600} as const;
export const PLAZA_POST_LIFETIME=12000;
export function plazaPostInterval(rate:unknown){return PLAZA_POST_INTERVALS[rate as keyof typeof PLAZA_POST_INTERVALS]??PLAZA_POST_INTERVALS.calm;}
/** Every post source, including startup and selection, waits for this single cadence. */
export function schedulePlazaPosts(add:()=>void,interval:number){const timer=setInterval(add,interval);return()=>clearInterval(timer);}
