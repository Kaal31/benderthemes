// Vector tile icons for the Metro shell, drawn for this project (no console artwork is traced or copied).
// Each icon is a full-colour SVG in a 100x100 box; tile-art.js tints it (lavender monochrome when unfocused, full
// colour on green when focused). Colour tiles take the avatar's palette (p = {skin, hair, eyes, ...} hex strings).
// Style: soft 3D, light from the top-left, gradients rather than outlines, a little rim light on dark shapes.

const svg=(body,defs='')=>`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs>${defs}</defs>${body}</svg>`;
const lin=(id,stops,x1=0,y1=0,x2=0,y2=1)=>`<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${
  stops.map(([o,c,a=1])=>`<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`;
const rad=(id,stops,cx=.4,cy=.35,r=.75)=>`<radialGradient id="${id}" cx="${cx}" cy="${cy}" r="${r}">${
  stops.map(([o,c,a=1])=>`<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</radialGradient>`;
const soft='<filter id="sh" x="-20%" y="-20%" width="140%" height="140%"><feDropShadow dx="1.2" dy="2" stdDeviation="1.6" flood-color="#000" flood-opacity=".35"/></filter>';

// ---- colour helpers (palette tints) ----
const hex=h=>{h=String(h||'#888').replace('#','');if(h.length===3)h=h.replace(/./g,'$&$&');const n=parseInt(h,16);return [n>>16&255,n>>8&255,n&255];};
const toHex=c=>'#'+c.map(v=>Math.max(0,Math.min(255,Math.round(v))).toString(16).padStart(2,'0')).join('');
export const shade=(h,k)=>{const c=hex(h);return toHex(k>=0?c.map(v=>v+(255-v)*k):c.map(v=>v*(1+k)));};   // k>0 lighter, k<0 darker

// ---------------------------------------------------------------- objects (home)
const ICONS={
  store:()=>svg(`
    <g filter="url(#sh)">
      <path d="M30 30 Q30 12 46 12 Q62 12 62 30" fill="none" stroke="#5d6066" stroke-width="3.2"/>
      <path d="M20 34 L72 34 L76 90 L16 90 Z" fill="url(#bag)"/>
      <path d="M20 34 L72 34 L71 40 L21 40 Z" fill="#c9ccd3"/>
      <path d="M58 22 L66 34 L50 34 Z" fill="#9aa0aa"/><path d="M40 20 L54 34 L34 34 Z" fill="#e6e8ee"/>
      <path d="M30 30 Q30 16 46 16 Q62 16 62 30" fill="none" stroke="#3c3f45" stroke-width="2.4"/>
      <circle cx="30" cy="40" r="1.8" fill="#55585e"/><circle cx="62" cy="40" r="1.8" fill="#55585e"/>
    </g>
    <path d="M62 44 Q66 56 70 60" fill="none" stroke="#7b7f87" stroke-width="1.2"/>
    <g filter="url(#sh)" transform="rotate(38 76 70)">
      <path d="M64 60 L84 60 L90 70 L84 80 L64 80 Z" fill="url(#tag)"/>
      <circle cx="69" cy="70" r="2.6" fill="#8d9199"/>
    </g>`,
    soft+lin('bag',[[0,'#ffffff'],[.6,'#e3e5ea'],[1,'#b4b8c1']],0,0,1,1)+lin('tag',[[0,'#fbfbfd'],[1,'#c6c9d1']])),

  save:()=>svg(`
    <path d="M56 10 L86 14 L86 92 L56 90 Z" fill="url(#frame)"/>
    <path d="M60 15 L82 18 L82 88 L60 86 Z" fill="url(#room)"/>
    <path d="M63 60 L79 62 L79 86 L63 84 Z" fill="#c6c9cf" opacity=".6"/>
    <path d="M60 15 L46 22 L46 84 L60 86 Z" fill="url(#door)"/>
    <circle cx="51" cy="52" r="1.8" fill="#d8dbe0"/>
    <g filter="url(#sh)"><path d="M10 44 L44 44 L44 32 L66 52 L44 72 L44 60 L10 60 Z" fill="url(#arrow)"/></g>`,
    soft+lin('frame',[[0,'#53565c'],[1,'#26282c']],0,0,1,0)+lin('room',[[0,'#f7f8fb'],[1,'#c8ccd4']])+
    lin('door',[[0,'#2e3035'],[1,'#4b4e55']],0,0,1,0)+lin('arrow',[[0,'#ffffff'],[1,'#d2d5dc']])),

  awards:()=>svg(`
    <g filter="url(#sh)">
      <path d="M30 22 Q12 22 14 36 Q16 48 34 52" fill="none" stroke="url(#metal)" stroke-width="4.5"/>
      <path d="M70 22 Q88 22 86 36 Q84 48 66 52" fill="none" stroke="url(#metal)" stroke-width="4.5"/>
      <path d="M26 14 L74 14 Q74 50 50 58 Q26 50 26 14 Z" fill="url(#cup)"/>
      <ellipse cx="50" cy="14" rx="24" ry="4" fill="#9ea2ab"/><ellipse cx="50" cy="14" rx="21" ry="2.8" fill="#6c7078"/>
      <path d="M46 58 L54 58 L53 70 L47 70 Z" fill="url(#metal)"/>
      <ellipse cx="50" cy="71" rx="10" ry="3" fill="#c7cad1"/>
      <path d="M32 76 L68 76 L72 90 L28 90 Z" fill="url(#base)"/>
      <path d="M38 79 L62 79 L64 87 L36 87 Z" fill="#e9ebef"/>
      <ellipse cx="50" cy="76" rx="18" ry="3.4" fill="#5d6067"/>
      <path d="M33 18 Q34 40 46 50" fill="none" stroke="#fff" stroke-width="3" opacity=".75"/>
    </g>`,
    soft+lin('cup',[[0,'#ffffff'],[.45,'#d4d7de'],[1,'#8a8e97']],0,0,1,0)+lin('metal',[[0,'#f2f3f6'],[1,'#8f939b']],0,0,1,0)+
    lin('base',[[0,'#3a3c41'],[1,'#17181b']])),

  gamerpic:()=>svg(`
    <g filter="url(#sh)">
      <path d="M22 30 L40 30 L44 24 L62 24 L66 30 L84 30 Q90 30 90 36 L90 78 Q90 84 84 84 L16 84 Q10 84 10 78 L10 36 Q10 30 16 30 Z" fill="url(#body)"/>
      <rect x="70" y="35" width="10" height="5" rx="1.5" fill="#6e737c"/>
      <circle cx="52" cy="57" r="22" fill="url(#ring)"/>
      <circle cx="52" cy="57" r="16" fill="url(#glass)"/>
      <circle cx="52" cy="57" r="9" fill="#1d2140" opacity=".55"/>
      <ellipse cx="46" cy="50" rx="6" ry="3.6" fill="#fff" opacity=".8" transform="rotate(-30 46 50)"/>
      <path d="M12 38 Q50 32 88 38" fill="none" stroke="#fff" stroke-width="1" opacity=".25"/>
    </g>
    <g transform="translate(22 22)">
      <path d="M0 -15 L3 -4 L14 -6 L5 1 L11 11 L1 5 L-6 14 L-4 3 L-15 1 L-5 -4 Z" fill="url(#flash)"/>
      <circle r="5" fill="#fff"/>
    </g>`,
    soft+lin('body',[[0,'#55585f'],[.5,'#2a2c31'],[1,'#121316']])+lin('ring',[[0,'#d5d8de'],[1,'#4a4d54']],0,0,1,1)+
    rad('glass',[[0,'#c8d0ff'],[.6,'#6b78d8'],[1,'#2a2f6a']],.4,.35,.8)+rad('flash',[[0,'#ffffff'],[1,'#fff6c8',.85]],.5,.5,.6)),

  // ---------------------------------------------------------------- My Style
  tops:()=>svg(`<g filter="url(#sh)">
      <path d="M36 14 Q50 22 64 14 L84 24 L92 46 L78 52 L74 42 L74 90 L26 90 L26 42 L22 52 L8 46 L16 24 Z" fill="url(#cloth)"/>
      <path d="M36 14 Q50 26 64 14 Q58 21 50 21 Q42 21 36 14 Z" fill="#9ca1ab"/>
      <path d="M26 42 L26 60" stroke="#a9adb6" stroke-width="1.5"/><path d="M74 42 L74 60" stroke="#a9adb6" stroke-width="1.5"/>
      <path d="M30 84 L70 84" stroke="#b9bdc6" stroke-width="1.5"/></g>`,
    soft+lin('cloth',[[0,'#ffffff'],[.6,'#e2e4ea'],[1,'#b0b5bf']],0,0,1,1)),

  bottoms:()=>svg(`<g filter="url(#sh)">
      <path d="M26 10 L74 10 L80 92 L58 92 L50 36 L42 92 L20 92 Z" fill="url(#denim)"/>
      <path d="M26 10 L74 10 L74.6 18 L25.4 18 Z" fill="#2f3a5a"/>
      <path d="M50 18 L50 34" stroke="#9eb0d8" stroke-width="1.2" stroke-dasharray="2 1.5"/>
      <path d="M30 22 Q36 30 46 24" fill="none" stroke="#9eb0d8" stroke-width="1.2"/><path d="M70 22 Q64 30 54 24" fill="none" stroke="#9eb0d8" stroke-width="1.2"/>
      <path d="M28 40 Q30 66 26 88" fill="none" stroke="#ffffff" stroke-width="3" opacity=".25"/></g>`,
    soft+lin('denim',[[0,'#5f78b4'],[1,'#2b3a66']],0,0,1,1)),

  shoes:()=>svg(`<g filter="url(#sh)">
      <path d="M10 70 L12 44 Q14 36 24 36 L40 38 Q46 52 62 56 L84 62 Q94 66 92 76 L10 76 Z" fill="url(#upper)"/>
      <path d="M8 74 L94 74 Q94 84 86 84 L14 84 Q8 84 8 78 Z" fill="url(#sole)"/>
      <path d="M8 74 L94 74" stroke="#9ea2aa" stroke-width="1.5"/>
      <path d="M68 58 Q86 60 92 72 L70 72 Q66 64 68 58 Z" fill="#f2f3f6"/>
      <g stroke="#f6f7fa" stroke-width="2.2" stroke-linecap="round"><path d="M38 46 L48 42"/><path d="M42 51 L53 47"/><path d="M47 55 L58 51"/></g>
      <circle cx="26" cy="54" r="5" fill="#f2f3f6" opacity=".85"/></g>`,
    soft+lin('upper',[[0,'#4a4d55'],[1,'#1b1c20']])+lin('sole',[[0,'#ffffff'],[1,'#c4c7ce']])),

  hats:()=>svg(`<g filter="url(#sh)">
      <path d="M18 60 Q16 22 50 20 Q82 20 82 56 Z" fill="url(#crown)"/>
      <path d="M50 20 Q44 38 46 58" fill="none" stroke="#5d6169" stroke-width="1.2"/>
      <path d="M50 20 Q62 34 64 57" fill="none" stroke="#5d6169" stroke-width="1.2"/>
      <circle cx="50" cy="20" r="2.6" fill="#2a2c31"/>
      <path d="M16 58 Q50 50 84 56 Q96 60 96 68 Q70 76 30 72 Q12 70 16 58 Z" fill="url(#brim)"/>
      <path d="M22 60 Q50 54 82 59" fill="none" stroke="#9ea3ad" stroke-width="1.6"/>
      <rect x="40" y="36" width="12" height="10" rx="1.5" fill="none" stroke="#f0f1f4" stroke-width="1.6"/>
      <path d="M30 30 Q36 24 44 23" fill="none" stroke="#fff" stroke-width="2" opacity=".35"/></g>`,
    soft+lin('crown',[[0,'#4c5058'],[1,'#1c1d21']],0,0,1,1)+lin('brim',[[0,'#3a3c42'],[1,'#121315']])),

  accessories:()=>svg(`<g filter="url(#sh)">
      <path d="M16 72 L36 66 L42 92 L22 96 Z" fill="url(#strap)"/>
      <circle cx="34" cy="78" r="12" fill="url(#bezel)"/><circle cx="34" cy="78" r="8.5" fill="url(#face)"/>
      <path d="M34 78 L34 72 M34 78 L38 80" stroke="#2b2d33" stroke-width="1.4" stroke-linecap="round"/>
      <path d="M8 34 Q50 26 92 34" fill="none" stroke="#2a2c31" stroke-width="3"/>
      <path d="M12 34 Q12 54 28 54 Q44 54 44 36 Z" fill="url(#lens)"/><path d="M56 36 Q56 54 72 54 Q88 54 88 34 Z" fill="url(#lens)"/>
      <path d="M44 36 Q50 32 56 36" fill="none" stroke="#2a2c31" stroke-width="2.4"/>
      <path d="M17 38 Q20 46 27 48" fill="none" stroke="#fff" stroke-width="2" opacity=".55"/><path d="M61 38 Q64 46 71 48" fill="none" stroke="#fff" stroke-width="2" opacity=".55"/></g>`,
    soft+lin('lens',[[0,'#5a5e68'],[1,'#0f1013']])+lin('strap',[[0,'#40434a'],[1,'#1d1e22']])+
    lin('bezel',[[0,'#f6f7f9'],[1,'#8c9098']],0,0,1,1)+rad('face',[[0,'#ffffff'],[1,'#c9ccd3']])),

  props:()=>svg(`<g filter="url(#sh)" transform="rotate(-38 50 50)">
      <rect x="46.5" y="2" width="7" height="50" rx="1.5" fill="url(#neck)"/>
      <g fill="#d8dbe1">${[8,14,20,26,32,38,44].map(y=>`<rect x="46.5" y="${y}" width="7" height="0.9"/>`).join('')}</g>
      <path d="M44 -6 L56 -6 L57 4 L43 4 Z" fill="#2a2c31"/>
      <path d="M50 44 Q66 40 68 54 Q70 62 64 66 Q74 74 68 88 Q62 100 50 100 Q36 100 32 88 Q28 76 36 68 Q30 62 32 54 Q34 44 50 44 Z" fill="url(#gbody)"/>
      <path d="M50 50 Q60 50 62 58 Q60 64 56 66 Q64 74 60 84 Q56 92 50 92 Q42 92 40 84 Q38 74 44 66 Q40 64 38 58 Q40 50 50 50 Z" fill="url(#guard)"/>
      <rect x="42" y="70" width="16" height="3.4" rx="1" fill="#e6e8ec"/><rect x="42" y="78" width="16" height="3.4" rx="1" fill="#e6e8ec"/>
      <rect x="44" y="86" width="12" height="3" rx="1" fill="#b3b7bf"/>
      <g stroke="#f0f1f4" stroke-width=".5">${[47.6,49.2,50.8,52.4].map(x=>`<path d="M${x} 0 L${x} 88"/>`).join('')}</g></g>`,
    soft+lin('neck',[[0,'#6a5a48'],[1,'#3b3026']],0,0,1,0)+lin('gbody',[[0,'#4a4d55'],[1,'#141518']],0,0,1,1)+lin('guard',[[0,'#2c2e33'],[1,'#0c0d0f']])),

  costumes:()=>svg(`<g filter="url(#sh)">
      <g transform="translate(-1 0)">
        <path d="M22 18 L36 18 L42 30 L40 56 L38 92 L30 92 L29 60 L28 92 L20 92 L18 56 L16 30 Z" fill="url(#suit)"/>
        <path d="M26 18 L32 18 L29 40 Z" fill="#f4f5f8"/><path d="M28.4 20 L29.6 20 L30 36 L29 38 L28 36 Z" fill="#8b1f1f"/>
        <path d="M16 30 L10 54 L14 56 L19 36 Z M42 30 L48 54 L44 56 L39 36 Z" fill="url(#suit)"/>
      </g>
      <g transform="translate(46 0)">
        <path d="M14 18 L28 18 L32 32 L28 46 L40 92 L2 92 L14 46 L10 32 Z" fill="url(#dress)"/>
        <path d="M14 18 Q21 26 28 18" fill="none" stroke="#fff" stroke-width="1.4" opacity=".7"/>
        <path d="M13 46 L29 46" stroke="#fff" stroke-width="1.6" opacity=".6"/>
        <path d="M10 32 L5 54 L9 55 L13 38 Z M32 32 L37 54 L33 55 L29 38 Z" fill="#e9ebef"/>
        <path d="M18 50 Q14 70 10 88" fill="none" stroke="#fff" stroke-width="2.2" opacity=".35"/>
      </g></g>`,
    soft+lin('suit',[[0,'#454850'],[1,'#17181b']],0,0,1,1)+lin('dress',[[0,'#e1e4ea'],[1,'#8f949e']],0,0,1,1)),

  outfits:()=>svg(`
    <g filter="url(#sh)">
      <path d="M22 16 Q30 12 38 16 L50 24 L46 34 L42 32 L42 58 L18 58 L18 32 L14 34 L10 24 Z" fill="url(#top)"/>
      <path d="M18 58 L42 58 L44 92 L33 92 L30 66 L27 92 L16 92 Z" fill="url(#leg)"/>
    </g>
    <g filter="url(#sh)"><path d="M68 14 L92 14 Q86 50 92 88 L68 88 Q74 50 68 14 Z" fill="url(#slot)"/>
      <circle cx="80" cy="64" r="6" fill="#9aa0aa"/><circle cx="80" cy="64" r="4" fill="#d9dce2"/></g>
    <path d="M52 40 L60 40 L60 36 L67 43 L60 50 L60 46 L52 46 Z" fill="#3a3d44"/>
    <path d="M67 62 L59 62 L59 58 L52 65 L59 72 L59 68 L67 68 Z" fill="#3a3d44"/>`,
    soft+lin('top',[[0,'#4b4f58'],[1,'#20222a']],0,0,1,1)+lin('leg',[[0,'#34374a'],[1,'#15161d']])+lin('slot',[[0,'#ffffff'],[1,'#c3c7cf']],0,0,1,0)),

  makeup:()=>svg(`<g filter="url(#sh)">
      <rect x="22" y="50" width="20" height="40" rx="3" fill="url(#tube)"/>
      <rect x="24" y="40" width="16" height="12" rx="1.5" fill="url(#gold)"/>
      <path d="M26 40 L26 22 Q32 12 38 20 L38 40 Z" fill="url(#stick)"/>
      <circle cx="68" cy="66" r="22" fill="url(#compact)"/><circle cx="68" cy="66" r="16" fill="url(#powder)"/>
      <ellipse cx="62" cy="60" rx="6" ry="3" fill="#fff" opacity=".6" transform="rotate(-30 62 60)"/></g>`,
    soft+lin('tube',[[0,'#3c3f46'],[1,'#121316']],0,0,1,0)+lin('gold',[[0,'#f3f4f7'],[1,'#9ea2aa']],0,0,1,0)+
    lin('stick',[[0,'#d8445a'],[1,'#7c1426']],0,0,1,0)+lin('compact',[[0,'#f5f6f8'],[1,'#8d919a']],0,0,1,1)+rad('powder',[[0,'#f1d2c8'],[1,'#c7988b']])),

  // ---------------------------------------------------------------- Accessories
  glasses:()=>svg(`<g filter="url(#sh)">
      <path d="M4 40 L12 40" stroke="#2a2c31" stroke-width="3" stroke-linecap="round"/><path d="M88 40 L96 40" stroke="#2a2c31" stroke-width="3" stroke-linecap="round"/>
      <rect x="10" y="34" width="34" height="24" rx="5" fill="url(#lens)" stroke="#2a2c31" stroke-width="3"/>
      <rect x="56" y="34" width="34" height="24" rx="5" fill="url(#lens)" stroke="#2a2c31" stroke-width="3"/>
      <path d="M44 42 Q50 37 56 42" fill="none" stroke="#2a2c31" stroke-width="3"/>
      <path d="M16 38 L28 38 L18 52 Z" fill="#fff" opacity=".55"/><path d="M62 38 L74 38 L64 52 Z" fill="#fff" opacity=".55"/></g>`,
    soft+lin('lens',[[0,'#b6bcc8',.85],[1,'#5f6573',.9]])),

  wristwear:()=>svg(`<g filter="url(#sh)">
      <path d="M30 4 L70 4 L66 34 L34 34 Z" fill="url(#band)"/><path d="M34 66 L66 66 L70 96 L30 96 Z" fill="url(#band)"/>
      <g stroke="#9aa0aa" stroke-width="1.2">${[12,20,28].map(y=>`<path d="M${33+y*.1} ${y} L${67-y*.1} ${y}"/>`).join('')}${[74,82,90].map(y=>`<path d="M34 ${y} L66 ${y}"/>`).join('')}</g>
      <circle cx="50" cy="50" r="24" fill="url(#bezel)"/><circle cx="50" cy="50" r="18" fill="url(#dial)"/>
      <g fill="#7d828c">${[0,1,2,3,4,5,6,7,8,9,10,11].map(i=>{const a=i*Math.PI/6;return `<circle cx="${(50+15*Math.sin(a)).toFixed(1)}" cy="${(50-15*Math.cos(a)).toFixed(1)}" r="1"/>`;}).join('')}</g>
      <path d="M50 50 L50 38 M50 50 L58 54" stroke="#25272c" stroke-width="2" stroke-linecap="round"/>
      <rect x="73" y="46" width="6" height="8" rx="1.5" fill="#c7cad1"/>
      <path d="M36 38 Q42 32 50 32" fill="none" stroke="#fff" stroke-width="2" opacity=".7"/></g>`,
    soft+lin('band',[[0,'#f0f1f4'],[1,'#a8adb6']],0,0,1,0)+lin('bezel',[[0,'#ffffff'],[1,'#7c818b']],0,0,1,1)+rad('dial',[[0,'#ffffff'],[1,'#d3d6dc']])),

  gloves:()=>svg(`<g filter="url(#sh)">
      <path d="M30 92 L30 62 Q22 54 18 44 Q16 38 21 37 Q26 37 30 46 L32 50 L32 26 Q32 21 36.5 21 Q41 21 41 26 L41 44 L42 18 Q42 13 47 13 Q52 13 52 18 L52 44 L53 22 Q53 17 57.5 17 Q62 17 62 22 L62 46 L64 30 Q64 26 68 26 Q72 26 72 31 L71 64 Q70 74 64 80 L64 92 Z" fill="url(#skin)"/>
      <path d="M30 92 L30 62 Q24 56 20 48 L27 45 L31 52 L32 38 L41 38 L42 34 L52 34 L53 36 L62 36 L63 40 L71.6 40 L71 64 Q70 74 64 80 L64 92 Z" fill="url(#glove)"/>
      <ellipse cx="51" cy="58" rx="6" ry="4" fill="#d9dbe0"/>
      <path d="M30 86 L64 86" stroke="#6b6f78" stroke-width="2"/>
      <path d="M36 40 L36 70" stroke="#fff" stroke-width="1.6" opacity=".3"/></g>`,
    soft+lin('skin',[[0,'#f4f5f8'],[1,'#c4c7ce']],0,0,1,0)+lin('glove',[[0,'#4a4d55'],[1,'#17181b']],0,0,1,1)),

  rings:()=>svg(`<g filter="url(#sh)">
      <ellipse cx="50" cy="62" rx="28" ry="22" fill="none" stroke="url(#band)" stroke-width="9"/>
      <ellipse cx="50" cy="62" rx="28" ry="22" fill="none" stroke="#fff" stroke-width="1.6" opacity=".5" stroke-dasharray="30 200" stroke-dashoffset="-120"/>
      <path d="M38 40 L62 40 L56 32 L44 32 Z" fill="url(#band)"/>
      <path d="M38 30 L50 10 L62 30 L50 38 Z" fill="url(#gem)"/>
      <path d="M38 30 L50 26 L62 30 M50 10 L50 26" fill="none" stroke="#fff" stroke-width="1" opacity=".8"/>
      <path d="M44 22 L50 12 L48 24 Z" fill="#fff" opacity=".85"/></g>`,
    soft+lin('band',[[0,'#ffffff'],[.5,'#c4c7ce'],[1,'#7d828c']],0,0,1,1)+lin('gem',[[0,'#ffffff'],[.5,'#d9e1ff'],[1,'#8892c4']],0,0,1,1)),

  earrings:()=>svg(`<g filter="url(#sh)">
      <circle cx="34" cy="20" r="5" fill="url(#stud)"/><path d="M34 25 L34 34" stroke="#8a8f98" stroke-width="2"/>
      <circle cx="34" cy="56" r="21" fill="none" stroke="url(#hoop)" stroke-width="5.5"/>
      <path d="M17 50 Q20 40 30 36" fill="none" stroke="#fff" stroke-width="1.8" opacity=".8"/>
      <circle cx="70" cy="24" r="5" fill="url(#stud)"/><path d="M70 29 L70 46" stroke="#8a8f98" stroke-width="2"/>
      <path d="M70 46 L80 62 L70 86 L60 62 Z" fill="url(#gem)"/>
      <path d="M60 62 L80 62 M70 46 L70 86" stroke="#fff" stroke-width="1" opacity=".7"/>
      <path d="M64 60 L70 48 L68 62 Z" fill="#fff" opacity=".85"/></g>`,
    soft+lin('hoop',[[0,'#ffffff'],[.5,'#c4c7ce'],[1,'#757a84']],0,0,1,1)+rad('stud',[[0,'#ffffff'],[1,'#9aa0aa']])+
    lin('gem',[[0,'#ffffff'],[.5,'#d9e1ff'],[1,'#8892c4']],0,0,1,1)),
};

// ---------------------------------------------------------------- Color submenu (palette-coloured)
// p: {skin, hair, mouth, eyes, eyebrows, eyeShadow, facialHair, facialFeature, facialFeature2}
const face=p=>shade(p.skin,0.55);   // pale skin field, like the console's close-ups
const COLOUR={
  'color-hair':p=>svg(`
    <rect width="100" height="100" fill="url(#bg)"/>
    <path d="M24 100 Q20 60 50 56 Q80 60 76 100 Z" fill="${face(p)}"/>
    <path d="M14 70 Q10 30 30 22 L28 10 L40 18 L46 4 L54 16 L66 6 L66 20 L82 18 L76 30 Q92 44 86 72 Q80 56 70 52 L72 64 Q60 52 50 54 L46 64 Q40 54 30 58 L28 66 Q20 62 14 70 Z" fill="url(#h)"/>
    <path d="M30 28 Q42 18 56 22" fill="none" stroke="#fff" stroke-width="2.4" opacity=".35"/>
    <path d="M28 80 Q36 74 44 80 Q36 86 28 80 Z M56 80 Q64 74 72 80 Q64 86 56 80 Z" fill="#fff"/>
    <circle cx="36" cy="80" r="3.4" fill="${p.eyes}"/><circle cx="64" cy="80" r="3.4" fill="${p.eyes}"/>
    <path d="M27 72 Q36 66 45 71 M55 71 Q64 66 73 72" fill="none" stroke="${shade(p.eyebrows,-.1)}" stroke-width="2.4"/>`,
    lin('bg',[[0,'#e9eaf3'],[1,'#c7c9dc']])+lin('h',[[0,shade(p.hair,.25)],[1,shade(p.hair,-.35)]],0,0,1,1)),

  'color-facialFeature':p=>svg(`
    <rect width="100" height="100" fill="${face(p)}"/>
    <path d="M0 0 L100 0 L100 100 Q80 60 72 30 Q60 6 30 8 Q8 10 0 30 Z" fill="${shade(p.skin,.7)}"/>
    <path d="M20 30 Q30 22 42 26" fill="none" stroke="#3b3d44" stroke-width="2.4"/>
    <ellipse cx="30" cy="36" rx="8" ry="4" fill="#fff"/><circle cx="31" cy="36" r="3.4" fill="#3b3d44"/>
    <g fill="${p.facialFeature}" opacity=".85">
      <path d="M38 52 L66 46 L62 56 L40 60 Z"/><path d="M42 66 L72 60 L68 70 L44 74 Z"/></g>
    <g fill="${shade(p.facialFeature2||p.facialFeature,-.2)}" opacity=".7"><circle cx="30" cy="58" r="2"/><circle cx="24" cy="64" r="1.6"/><circle cx="32" cy="68" r="1.8"/></g>`),

  'color-eyebrows':p=>svg(`
    <rect width="100" height="100" fill="url(#skin)"/>
    <path d="M14 40 Q44 14 86 30 Q88 38 82 38 Q48 26 20 46 Q12 48 14 40 Z" fill="url(#brow)"/>
    <path d="M22 80 Q50 56 82 76" fill="none" stroke="#2c2e35" stroke-width="3.6"/>
    <path d="M30 76 Q50 64 72 74 Q60 90 46 90 Q36 88 30 76 Z" fill="#fff"/>
    <circle cx="51" cy="78" r="9" fill="${p.eyes}"/><circle cx="51" cy="78" r="4.5" fill="#15161a"/>`,
    lin('skin',[[0,shade(p.skin,.7)],[1,shade(p.skin,.45)]])+lin('brow',[[0,shade(p.eyebrows,.15)],[1,shade(p.eyebrows,-.25)]])),

  'color-mouth':p=>svg(`
    <rect width="100" height="100" fill="url(#skin)"/>
    <ellipse cx="50" cy="14" rx="14" ry="9" fill="${shade(p.skin,.35)}"/>
    <path d="M18 50 Q34 40 50 44 Q66 40 82 50 Q66 54 50 54 Q34 54 18 50 Z" fill="url(#lip)"/>
    <path d="M18 50 Q34 74 50 74 Q66 74 82 50 Q66 58 50 58 Q34 58 18 50 Z" fill="url(#lip)"/>
    <path d="M24 51 Q50 60 76 51 Q66 56 50 56.5 Q34 56 24 51 Z" fill="#fff"/>
    <ellipse cx="44" cy="66" rx="8" ry="2.2" fill="#fff" opacity=".45"/>
    <path d="M40 84 Q50 100 60 84" fill="none" stroke="${shade(p.skin,-.08)}" stroke-width="2" opacity=".5"/>`,
    lin('skin',[[0,shade(p.skin,.6)],[1,shade(p.skin,.45)]])+lin('lip',[[0,shade(p.mouth,.2)],[1,shade(p.mouth,-.2)]])),

  'color-eyeShadow':p=>svg(`
    <rect width="100" height="100" fill="${face(p)}"/>
    <path d="M14 36 Q46 20 84 34" fill="none" stroke="${shade(p.eyebrows,-.1)}" stroke-width="5" stroke-linecap="round"/>
    <path d="M16 62 Q30 36 52 38 Q76 40 86 62 Q52 56 16 62 Z" fill="url(#shadow)"/>
    <path d="M18 62 Q52 76 84 60" fill="none" stroke="#2a2c32" stroke-width="3.4" stroke-linecap="round"/>
    <g stroke="#2a2c32" stroke-width="2" stroke-linecap="round"><path d="M30 67 L27 74"/><path d="M42 70 L41 77"/><path d="M56 70 L58 77"/><path d="M70 66 L74 72"/></g>`,
    lin('shadow',[[0,shade(p.eyeShadow,.1)],[1,shade(p.eyeShadow,-.1),.85]])),

  'color-facialHair':p=>svg(`
    <rect width="100" height="100" fill="${face(p)}"/>
    <path d="M6 0 Q2 40 18 70 Q34 98 60 98 Q84 96 96 70 L100 70 L100 100 L0 100 L0 0 Z" fill="${shade(p.skin,.3)}" opacity=".6"/>
    <path d="M14 20 Q12 60 28 80 Q44 98 62 96 Q84 92 94 64 L90 40 Q84 60 74 62 Q62 52 46 56 Q32 56 26 44 Q22 32 22 20 Z" fill="url(#beard)"/>
    <path d="M38 64 Q54 58 72 66 Q58 74 44 72 Z" fill="#fff"/>
    <path d="M36 62 Q54 56 74 64" fill="none" stroke="#2a2c32" stroke-width="2"/>`,
    lin('beard',[[0,shade(p.facialHair,.1)],[1,shade(p.facialHair,-.3)]],0,0,1,1)),

  'color-eyes':p=>svg(`
    <rect width="100" height="100" fill="${face(p)}"/>
    <path d="M12 54 Q40 26 72 34 Q86 38 92 30" fill="none" stroke="#24262c" stroke-width="5" stroke-linecap="round"/>
    <path d="M18 56 Q42 32 72 40 Q70 70 46 72 Q28 70 18 56 Z" fill="#fff"/>
    <circle cx="46" cy="52" r="15" fill="url(#iris)"/><circle cx="46" cy="52" r="6.5" fill="#121317"/>
    <circle cx="41" cy="47" r="3" fill="#fff" opacity=".9"/>
    <path d="M18 56 Q42 32 72 40" fill="none" stroke="#24262c" stroke-width="3.4"/>`,
    rad('iris',[[0,shade(p.eyes,.35)],[.7,p.eyes],[1,shade(p.eyes,-.45)]],.45,.4,.6)),

  'color-skin':p=>{
    const tones=[shade(p.skin,-.45),p.skin,shade(p.skin,.45)];
    const head=(x,t,id)=>`<g transform="translate(${x} 0)"><path d="M10 100 L10 82 Q-4 70 2 40 Q8 12 30 10 Q46 10 50 26 L54 40 L62 50 L56 54 L56 64 Q60 68 56 72 L52 76 Q48 84 38 84 L36 100 Z" fill="url(#${id})"/>
      <path d="M36 36 Q42 30 50 32" fill="none" stroke="#2a2c32" stroke-width="2"/><path d="M40 42 Q46 38 50 40 Q46 44 40 42 Z" fill="#2a2c32"/>
      <path d="M44 68 Q50 70 54 66" fill="none" stroke="#2a2c32" stroke-width="1.6"/></g>`;
    return svg(`<rect width="100" height="100" fill="url(#bg)"/>${head(2,tones[0],'t0')}${head(24,tones[1],'t1')}${head(46,tones[2],'t2')}`,
      lin('bg',[[0,'#d3d5e6'],[1,'#a9acc7']])+tones.map((t,i)=>lin(`t${i}`,[[0,shade(t,.15)],[1,shade(t,-.2)]],0,0,1,0)).join(''));
  },
};

export const ICON_IDS=Object.keys(ICONS);
export const COLOUR_IDS=Object.keys(COLOUR);
// SVG markup for an icon tile. palette: {skin,...} (only the colour tiles use it).
export function iconSvg(id,palette){
  if(ICONS[id])return ICONS[id]();
  if(COLOUR[id])return COLOUR[id](palette);
  return null;
}
