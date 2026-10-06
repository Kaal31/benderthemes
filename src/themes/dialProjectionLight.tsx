/** Top-down emission, centered on the face and wider than the cover. */
export function DialProjectionLight(){return <svg className="alien-projection-light" viewBox="-90 -40 380 380" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
  <defs>
    <radialGradient id="alien-emission-volume"><stop offset="0" stopColor="#65ff20" stopOpacity="0"/><stop offset=".55" stopColor="#65ff20" stopOpacity=".02"/><stop offset=".66" stopColor="#81ff49" stopOpacity=".16"/><stop offset=".73" stopColor="#89ff50" stopOpacity=".3"/><stop offset=".83" stopColor="#68ff27" stopOpacity=".11"/><stop offset="1" stopColor="#53ff16" stopOpacity="0"/></radialGradient>
    <linearGradient id="alien-emission-stream" x1="0" y1="1" x2="0" y2="0"><stop stopColor="#bdff96" stopOpacity=".55"/><stop offset=".35" stopColor="#77ff35" stopOpacity=".24"/><stop offset="1" stopColor="#57ff19" stopOpacity="0"/></linearGradient>
    <filter id="alien-emission-soft" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="5"/></filter>
    <filter id="alien-emission-bloom" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="3"/></filter>
  </defs>
  <circle className="alien-light-volume" cx="100" cy="150" r="183" fill="url(#alien-emission-volume)"/>
  <g className="alien-light-streams" filter="url(#alien-emission-soft)">
    {Array.from({length:18},(_,i)=><path key={i} transform={`rotate(${i*20} 100 150)`} d={`M ${94-i%3} 32 Q 88 -5 86 -35 L114 -35 Q112 -5 ${106+i%3} 32 Z`} fill="url(#alien-emission-stream)" opacity={.4+(i%4)*.13}/>)}
  </g>
  <circle cx="100" cy="150" r="120" fill="none" stroke="#a4ff75" strokeWidth="6" opacity=".55" filter="url(#alien-emission-bloom)"/>
  <circle cx="100" cy="150" r="120" fill="none" stroke="#c3ffa5" strokeWidth="1.15" opacity=".62"/>
  <circle cx="100" cy="150" r="125" fill="none" stroke="#7bff46" strokeWidth=".65" opacity=".3"/>
</svg>;}
