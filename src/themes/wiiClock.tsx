// The Wii Menu clock, as the System Menu draws it (my_Clock_a in the 4.3 IPL): "Wii Menu" stands in
// its place for 3 s the first time the menu opens, then fades into the time; the colon blinks every
// 2 s and the US menu puts AM/PM on the right.
import {useEffect,useState} from "react";

let shown=false; // once per plugin session, like the console's m_already_shown_wii_menu

export function WiiClock({clock,h24}:{clock:Date;h24:boolean}){
 const [intro,setIntro]=useState(!shown);
 useEffect(()=>{shown=true;if(!intro)return;const t=setTimeout(()=>setIntro(false),3000);return()=>clearTimeout(t);},[]);
 const h=clock.getHours(),m=String(clock.getMinutes()).padStart(2,"0");
 return <time className="nt-wii-clock" data-intro={intro}>
  <span className="nt-wii-word">Wii Menu</span>
  <span className="nt-wii-time">{h24?String(h).padStart(2,"0"):h%12||12}<b>:</b>{m}{!h24&&<small>{h<12?"AM":"PM"}</small>}</span>
 </time>;
}

/** "Tue 5/31", the Wii Menu's date under the clock. */
export const wiiDate=(d:Date)=>`${d.toLocaleDateString(undefined,{weekday:"short"})} ${d.getMonth()+1}/${d.getDate()}`;
