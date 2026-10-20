export const PLAZA_POST_INTERVALS={calm:60000,normal:4200,busy:2600} as const;
export const PLAZA_POST_LIFETIME=12000;
export const PLAZA_REPLY_DELAY=3500;
export function plazaPostInterval(rate:unknown){return PLAZA_POST_INTERVALS[rate as keyof typeof PLAZA_POST_INTERVALS]??PLAZA_POST_INTERVALS.calm;}
/** Conversation starts, including startup and selection, wait for this cadence. */
export function schedulePlazaPosts(add:()=>void,interval:number){const timer=setInterval(add,interval);return()=>clearInterval(timer);}
