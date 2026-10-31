const BUTTONS=[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[9,14],[12,9],[13,10],[14,11],[15,12]] as const;
const directions=new Set([9,10,11,12]);

/** Digital D-pad owns navigation while pressed; stick drift cannot undo it. */
export function previewPadButtons(pad:Gamepad){
 const down=new Set<number>();
 for(const [index,button] of BUTTONS)if(pad.buttons[index]?.pressed)down.add(button);
 const digital=[9,10,11,12].some(button=>down.has(button));
 if(!digital){
  // The preview promises left-stick navigation. Right-stick / legacy trigger
  // axes must not generate competing directions on every poll.
  const x=pad.axes[0]??0,y=pad.axes[1]??0;
  if(Math.abs(x)>.55||Math.abs(y)>.55){
   if(Math.abs(x)>=Math.abs(y))down.add(x<0?11:12);
   else down.add(y<0?9:10);
  }
 }
 return down;
}

/** Track edges per button, rather than a shared timer for all directions. */
export function createPreviewPadPoller(press:(button:number,repeat:boolean)=>void,release:(button:number)=>void){
 let current=-1,previous=new Set<number>(),stickBlocked=false;const repeats=new Map<number,number>();
 return (pads:(Gamepad|null)[],now:number)=>{
  const connected=pads.filter((p):p is Gamepad=>!!p?.connected);
  const pad=connected.find(p=>p.buttons.some(b=>b.pressed))??connected.find(p=>previewPadButtons(p).size>0)??connected.find(p=>p.index===current)??connected[0];
  if(!pad||pad.index!==current){previous.forEach(release);previous.clear();repeats.clear();stickBlocked=false;current=pad?.index??-1;}
  const down=pad?previewPadButtons(pad):new Set<number>();
  const digital=!!pad&&[12,13,14,15].some(index=>pad.buttons[index]?.pressed);
  if(digital)stickBlocked=true;
  else if(!pad||Math.hypot(pad.axes[0]??0,pad.axes[1]??0)<.35)stickBlocked=false;
  // Do not undo the digital move on release if the stick is still displaced.
  // Analog navigation resumes after the left stick returns to neutral.
  if(stickBlocked&&!digital)directions.forEach(button=>down.delete(button));
  // Release first so a new direction never inherits a stale held trigger.
  for(const button of previous)if(!down.has(button)){release(button);repeats.delete(button);}
  for(const button of down){
   if(!previous.has(button)){press(button,false);repeats.set(button,now+320);}
   else if(directions.has(button)&&now>=(repeats.get(button)??Infinity)){press(button,true);repeats.set(button,now+120);}
  }
  previous=down;
 };
}
