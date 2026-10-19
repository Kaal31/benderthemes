import type {Ach} from "../activity";
export function achievementComment(game:string,ach:Ach,progress?:{unlocked:number;total:number}):string{
 const hash=Array.from(ach.id+game).reduce((n,c)=>(Math.imul(n,31)+c.charCodeAt(0))>>>0,0);
 const lines=[`Unlocked "${ach.name}" in ${game}!`,`Another one for the collection: "${ach.name}" in ${game}!`,`"${ach.name}" unlocked! A little more progress in ${game}.`,`Adding "${ach.name}" to my ${game} collection!`,`New achievement in ${game}: "${ach.name}"!`];
 let text=lines[hash%lines.length];
 if(progress&&Number.isInteger(progress.unlocked)&&Number.isInteger(progress.total)&&progress.total>0&&progress.unlocked>0&&progress.unlocked<=progress.total){const {unlocked,total}=progress;
  if(unlocked===total)text+=" That's every achievement!";
  else if(unlocked===1)text+=" My first achievement in this game!";
  else{const milestone=[75,50,25].find(n=>unlocked===Math.ceil(total*n/100));if(milestone)text+=` ${milestone}% of the achievements collected!`;}
 }
 const rarity=ach.percent;if(typeof rarity==='number'&&Number.isFinite(rarity)&&rarity>0&&rarity<=10)text+=rarity<.1?" Fewer than 0.1% of players have this one!":` Only ${Number(rarity.toFixed(1))}% of players have this one!`;
 return text;
}
