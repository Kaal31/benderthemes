/** Code-drawn hardware and curved shell, composed against the supplied reference. */
export function Hourglass() {
  return <svg viewBox="0 0 100 100" width="100%" height="100%" aria-hidden="true"><path d="M23 8 Q50 -2 77 8 L55 50 L77 92 Q50 102 23 92 L45 50 Z" fill="var(--dht-dial-green,#57ff00)"/></svg>;
}

export function DialMechanism({turn,id,active=false,rhombus=false,skinArt,skinHue=0,cycle=0}:{turn:number;id:string;active?:boolean;rhombus?:boolean;skinArt?:string;skinHue?:number;cycle?:number}) {
  const p = `alien-${id}`;
  const ornament = "M123 104 Q230 69 337 104 L247 230 L337 356 Q230 391 123 356 L207 230 Z";
  const diamond = "M230 88 Q230 88 230 88 L339 230 L230 372 Q230 372 230 372 L121 230 Z";
  const fill = (n:string) => `url(#${p}-${n})`;
  return <svg viewBox="-12 -12 484 484" aria-hidden="true" data-active={active}>
    <defs>
      <filter id={`${p}-red`} colorInterpolationFilters="sRGB"><feColorMatrix values="0 .95 0 0 0  0 .025 0 0 0  0 .035 0 0 0  0 0 0 1 0"/></filter>
      <mask id={`${p}-skin-ring`}><circle cx="230" cy="230" r="224" fill="white"/><circle cx="230" cy="230" r="145" fill="black"/></mask>
      <linearGradient id={`${p}-metal`} x1="0" y1="0" x2=".88" y2="1"><stop stopColor="#050805"/><stop offset=".13" stopColor="#8b8e90"/><stop offset=".23" stopColor="#e3e6e7"/><stop offset=".32" stopColor="#96999c"/><stop offset=".45" stopColor="#111417"/><stop offset=".59" stopColor="#34383c"/><stop offset=".72" stopColor="#aeb2b5"/><stop offset=".8" stopColor="#f1f3f4"/><stop offset=".87" stopColor="#676c70"/><stop offset="1" stopColor="#080c07"/></linearGradient>
      <linearGradient id={`${p}-specular`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#171b1d"/><stop offset=".36" stopColor="#525a60"/><stop offset=".49" stopColor="#e8eef0"/><stop offset=".56" stopColor="#fff"/><stop offset=".64" stopColor="#919a9e"/><stop offset="1" stopColor="#111517"/></linearGradient>
      <linearGradient id={`${p}-bevel`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#11180f"/><stop offset=".2" stopColor="#8b9385"/><stop offset=".4" stopColor="#060a05"/><stop offset=".7" stopColor="#31392b"/><stop offset=".84" stopColor="#c4cec0"/><stop offset="1" stopColor="#151c11"/></linearGradient>
      <radialGradient id={`${p}-black`} cx=".35" cy=".22" r=".8"><stop stopColor="#22272a"/><stop offset=".35" stopColor="#080b0c"/><stop offset=".8" stopColor="#010202"/><stop offset="1" stopColor="#101612"/></radialGradient>
      <linearGradient id={`${p}-green`} x1="0" y1="0" x2="1" y2="0"><stop stopColor="#075400"/><stop offset=".27" stopColor="#24d900"/><stop offset=".5" stopColor="var(--dht-dial-green,#57ff00)"/><stop offset=".68" stopColor="#39f000"/><stop offset="1" stopColor="#096900"/></linearGradient>
      <radialGradient id={`${p}-orb`} cx=".33" cy=".24" r=".8"><stop stopColor="#e4ffd0"/><stop offset=".21" stopColor="#70ff10"/><stop offset=".5" stopColor="#56d300"/><stop offset=".78" stopColor="#1b5700"/><stop offset="1" stopColor="#010601"/></radialGradient>
      <linearGradient id={`${p}-led`} x2="1" y2="0"><stop stopColor="#134e00"/><stop offset=".3" stopColor="#64dc00"/><stop offset=".65" stopColor="#79ff18"/><stop offset="1" stopColor="#baff88"/></linearGradient>
      <radialGradient id={`${p}-aura`}><stop stopColor="#71d800" stopOpacity=".13"/><stop offset=".7" stopColor="#70eb00" stopOpacity=".17"/><stop offset="1" stopColor="#63dd00" stopOpacity="0"/></radialGradient>
      <filter id={`${p}-glow`} x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="5"/></filter>
      <clipPath id={`${p}-ornament`}><path d={ornament}/></clipPath>
      <filter id={`${p}-image-green`} colorInterpolationFilters="sRGB"><feColorMatrix type="matrix" values="0.04 0.09 0.02 0 0  .3 .72 .12 0 .035  0 .025 0 0 0  0 0 0 1 0"/><feComponentTransfer><feFuncG type="gamma" amplitude="1.2" exponent=".78" offset="0"/></feComponentTransfer></filter>
      <linearGradient id={`${p}-glass`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#d4ffef" stopOpacity=".085"/><stop offset=".48" stopColor="#c2ffde" stopOpacity=".015"/><stop offset="1" stopColor="#000" stopOpacity=".23"/></linearGradient>
      <clipPath id={`${p}-core`}><circle cx="230" cy="230" r="142"/></clipPath>
    </defs>
    <g style={{filter:skinHue < 0 ? fill("red") : `hue-rotate(${skinHue}deg)`}}>
    <ellipse cx="234" cy="242" rx="219" ry="220" fill="#010302" stroke="#172016" strokeWidth="6"/>
    <path d="M24 250 A210 210 0 0 0 436 250" fill="none" stroke="#30392d" strokeWidth="8"/>
    <path d={ornament} className="alien-hourglass-halo" fill="#66ff00" filter={fill("glow")} transform="translate(-46 -46) scale(1.2)"/>
    <circle cx="230" cy="230" r="242" fill={fill("aura")}/>
    <circle className="alien-hourglass-halo" cx="230" cy="230" r="213" fill="none" stroke="#66ff00" strokeWidth="11" filter={fill("glow")}/>
    <circle cx="230" cy="230" r="219" fill="#020504" stroke="#18261d" strokeWidth="3"/>
    <circle cx="230" cy="230" r="215" fill="none" stroke={fill("metal")} strokeWidth="3"/>
    <circle cx="230" cy="230" r="211" fill={fill("black")} stroke="#020402" strokeWidth="9"/>
    <circle cx="230" cy="230" r="200" fill="none" stroke="#44494a" strokeWidth="2"/>
    <g className="alien-bezel" style={{transform:`rotate(${turn}deg)`}}>
      <circle cx="230" cy="230" r="186" fill="none" stroke={fill("metal")} strokeWidth="31"/>
      <path d="M 57 169 A184 184 0 0 1 190 51 M 290 55 A184 184 0 0 1 406 176 M 403 291 A184 184 0 0 1 286 406 M 169 403 A184 184 0 0 1 55 290" fill="none" stroke={fill("specular")} strokeWidth="20"/>
      <circle cx="230" cy="230" r="194" fill="none" stroke="#f5f8f8" strokeOpacity=".24" strokeWidth="1"/>
      <circle cx="230" cy="230" r="179" fill="none" stroke="#020405" strokeWidth="2"/>
      <circle cx="230" cy="230" r="201" fill="none" stroke="#d4ddc9" strokeOpacity=".4" strokeWidth="1.4"/>
      <circle cx="230" cy="230" r="173" fill="none" stroke="#060b04" strokeWidth="6"/>
      {[0,90,180,270].map(a => <g key={a} transform={`rotate(${a} 230 230)`}><path d="M211 23 L253 26 L255 64 L219 65 Z" fill="#030703" stroke="#10190b" strokeWidth="2"/><path d="M205 25 L216 26 L220 61 L211 62 Z" fill="#525c49"/><path d="M253 28 L258 31 L258 59 L252 62 Z" fill="#7c8871"/></g>)}
      {Array.from({length:160},(_,i) => <path key={i} transform={`rotate(${i*2.25} 230 230)`} d="M230 37 L230 52" stroke={i%2 ? "#fff" : "#000"} strokeOpacity={i%2 ? ".022" : ".035"} strokeWidth=".6"/>)}
    </g>
    <circle cx="230" cy="230" r="163" fill="#010501" stroke={fill("bevel")} strokeWidth="11"/>
    <circle cx="230" cy="230" r="156" fill="none" stroke="#000" strokeWidth="5"/>
    <circle cx="230" cy="230" r="149" fill={fill("black")} stroke="#567329" strokeWidth="1.4"/>
    </g>
    {skinArt && <image className="alien-skin-housing alien-bezel" href={skinArt} x="-8" y="-8" width="476" height="476" mask={fill("skin-ring")} style={{transform:`rotate(${turn}deg)`}}/>}
    <g style={{filter:skinHue < 0 ? fill("red") : `hue-rotate(${skinHue}deg)`}}>
    <g className="alien-core-light dht-dial-core" clipPath={fill("core")}>
      <circle cx="230" cy="230" r="143" fill="#030802"/>
      {rhombus ? <path key={cycle} d={active ? diamond : ornament} fill={fill("green")} className={active ? "alien-rhombus-morph" : "alien-idle-mark"} data-pattern={active ? "rhombus" : "hourglass"}/> : <>
      <path d={ornament} fill={fill("green")} className="alien-idle-mark"/>
      <path d="M230 86 L90 86 L90 374 L230 374 L180 230 Z" className="alien-shutter alien-shutter-left" fill="#030b04" style={{transform:active?"translateX(-150px)":"translateX(0)"}}/>
      <path d="M230 86 L370 86 L370 374 L230 374 L280 230 Z" className="alien-shutter alien-shutter-right" fill="#030b04" style={{transform:active?"translateX(150px)":"translateX(0)"}}/>
      <path d={ornament} fill={fill("green")} opacity={active?.9:1}/>
      </>}
      <circle cx="230" cy="230" r="142" fill={fill("glass")} pointerEvents="none"/>
    </g>
    <path d="M115 144 A145 145 0 0 1 302 107" fill="none" stroke="#b5cd96" strokeOpacity=".55" strokeWidth="1.3"/>
    <path d="M121 330 A147 147 0 0 0 340 327" fill="none" stroke="#79ac3d" strokeOpacity=".45" strokeWidth="1.3"/>
    {!skinArt && <>
    {[-90,90,-46,-136].map((a,i) => <g key={a} transform={`rotate(${a} 230 230)`}>
      <path d="M201 13 Q230 8 258 15 L254 39 Q230 33 205 39 Z" fill="#080c06" stroke="#222f16" strokeWidth="4"/>
      <path d="M205 19 Q230 14 253 20 L250 32 Q231 28 207 34 Z" fill={fill("led")}/>
      <path d="M207 21 Q230 15 252 22" fill="none" stroke="#b9ff44" strokeWidth="6" opacity=".5" filter={fill("glow")}/>
      {i<2 && <path d="M209 19 L214 18 L215 33 L209 34 Z" fill="#d3ffa3" opacity=".7"/>}
    </g>)}
    {[43,417].map(y => <g key={y}><circle cx="248" cy={y} r="25" fill="#060b03" stroke="#27321d" strokeWidth="3"/><circle cx="248" cy={y} r="19" fill={fill("metal")} stroke="#060c02" strokeWidth="3"/><circle cx="248" cy={y} r="13" fill={fill("orb")} stroke="#427808" strokeWidth="2"/><ellipse cx="244" cy={y-6} rx="5" ry="3" fill="#efffd4" opacity=".8"/></g>)}
    {[{x:180,y:22,a:-14},{x:180,y:438,a:14}].map(({x,y,a}) => <g key={y} className="alien-rim-cap" transform={`translate(${x} ${y}) rotate(${a})`}>
      <rect x="-13" y="-16" width="26" height="32" rx="6" fill="#040706" stroke="#252c29" strokeWidth="2"/>
      <rect x="-10" y="-13" width="20" height="26" rx="4" fill={fill("metal")}/>
      <rect x="-5" y="-9" width="10" height="18" rx="2.5" fill={fill("led")} stroke="#204a08" strokeWidth="1.5"/>
      <path d="M-8 -10 V9" stroke="#ecffe1" strokeOpacity=".6" fill="none"/>
    </g>)}
    </>}
    </g>
  </svg>;
}

export function DialScenery() {
  return <svg className="alien-scenery dht-dial-bg" viewBox="0 0 1280 800" preserveAspectRatio="none" aria-hidden="true"><defs>
    <radialGradient id="alien-ambient" cx=".34" cy=".44" r=".68"><stop stopColor="#172215"/><stop offset=".48" stopColor="#080d08"/><stop offset="1" stopColor="#000"/></radialGradient>
    <linearGradient id="alien-upper-metal" x1=".1" y1=".9" x2=".65" y2=".15"><stop stopColor="#d0d2cf"/><stop offset=".22" stopColor="#999e9a"/><stop offset=".48" stopColor="#3e443f"/><stop offset=".75" stopColor="#121813"/><stop offset="1" stopColor="#333936"/></linearGradient>
    <linearGradient id="alien-upper-black" x1="0" y1="0" x2=".4" y2="1"><stop stopColor="#050705"/><stop offset=".54" stopColor="#0b100c"/><stop offset="1" stopColor="#252c27"/></linearGradient>
    <linearGradient id="alien-green-ribbon" x1=".45" y1=".7" x2="1" y2=".1"><stop stopColor="#071007"/><stop offset=".55" stopColor="#18330f"/><stop offset=".9" stopColor="#36711c"/><stop offset="1" stopColor="#70c236"/></linearGradient>
    <linearGradient id="alien-lower-metal" x1="0" y1="0" x2="1" y2=".4"><stop stopColor="#060d06"/><stop offset=".46" stopColor="#0a1308"/><stop offset=".64" stopColor="#4f574e"/><stop offset=".77" stopColor="#a7afa5"/><stop offset=".9" stopColor="#676e65"/><stop offset="1" stopColor="#282f26"/></linearGradient>
    <linearGradient id="alien-left-metal" x1="0" y1="0" x2="1" y2=".5"><stop stopColor="#969b96"/><stop offset=".43" stopColor="#555d55"/><stop offset=".8" stopColor="#161f15"/><stop offset="1" stopColor="#070e06"/></linearGradient>
    <linearGradient id="alien-horizon"><stop stopColor="#74a260" stopOpacity="0"/><stop offset=".33" stopColor="#97c571" stopOpacity=".7"/><stop offset=".65" stopColor="#a2be8b" stopOpacity=".4"/><stop offset="1" stopColor="#708f5c" stopOpacity="0"/></linearGradient>
    <linearGradient id="alien-fade" x2="0" y2="1"><stop stopColor="#000" stopOpacity="0"/><stop offset="1" stopColor="#000" stopOpacity=".94"/></linearGradient>
  </defs>

  <path d="M0 0 H728 C674 108 609 141 488 153 C282 170 169 182 0 254 Z" fill="url(#alien-upper-metal)"/>
  <path d="M0 0 H701 C662 83 619 125 551 145 C355 159 150 104 0 194 Z" fill="url(#alien-upper-black)"/>
  <path d="M552 145 C679 151 771 137 815 80 L877 -12 H731 C688 65 640 113 552 145 Z" fill="url(#alien-green-ribbon)"/>
  <path d="M-10 252 C199 183 321 117 524 125 C721 132 845 209 1285 86 V161 C1003 232 756 206 530 177 C323 150 169 208 -10 275 Z" fill="#020603"/>
  <path d="M0 194 C189 116 355 125 552 145 M552 145 C679 151 771 137 815 80 L877 -12" fill="none" stroke="#64715d" strokeOpacity=".43" strokeWidth="1.5"/>
  <path d="M0 441 C107 437 159 447 219 490 C297 548 394 563 535 558 C314 570 140 531 0 527 Z" fill="url(#alien-left-metal)"/>
  <path d="M0 579 C183 551 407 563 639 545 C798 530 932 533 1053 554 L1280 583 V733 C1107 682 1018 606 914 572 C818 540 729 541 641 548 C407 571 186 574 0 609 Z" fill="url(#alien-lower-metal)"/>
  <path d="M0 579 C186 548 407 564 639 545 C869 521 1016 515 1280 583" fill="none" stroke="url(#alien-horizon)" strokeWidth="2"/>
  <path d="M850 548 C1012 573 1120 687 1280 730" fill="none" stroke="#b3beb3" strokeOpacity=".37" strokeWidth="1.5"/>
  <path d="M0 554 H1280 V800 H0 Z" fill="url(#alien-fade)"/>
  </svg>;
}
