// M9 settings: the rows shown in the local panel's Settings section, their defaults and validation.
//
// Modelled on the site's settings sheet (app.bundle `ei`, defaults `H`, storage key "sona.settings.v1"), trimmed to what
// the Metro shell can honour. Defaults are the console look, not the site's: Microsoft lighting values (cube 1,
// occlusion 1, bloom 0.1875; the site starts with occlusion 0 and only "Back to Microsoft's values" sets 1) and no
// self-shadow. Supersample defaults to 1x because the stage the comparisons were matched on (qa/m10/MATCH.md) draws
// at min(dpr,2) with MSAA; the site's own default is 2.
//
// "Ground shadow" keeps the site's inverted meaning (RENDER-PIPELINE.md §9): the switch ON skips the shadow pass
// (neutralShadow, every compare passes, sh = 1), so avatars only self-shadow when it is OFF. No ground plane is drawn
// either way. The label is the site's; the hint states what it really does.
//
// Sound: the site has "Interface sound" / "Volume" / "Hover ticks", synthesised on the site (Web Audio oscillators),
// not the console's sounds. The console's UI sounds were not recovered (PARITY-PLAN decision 3), so the row is shown
// as unavailable instead of inventing sounds.

export const STORAGE_KEY='metro.local.settings.v1';

export const DEFAULTS=Object.freeze({
  supersample:1,          // site: 'supersample' 1 / 1.5 / 2 / 3 (default 2)
  pixelRatio:'device',    // 'device' = min(devicePixelRatio, 2) like the site; '1' = CSS pixels
  occlusion:true,         // SSAO pass on/off (local; the site only has the gain)
  occlusionGain:1,        // site: 'occlusion' 0..3 (Microsoft value 1)
  bloom:0.1875,           // site: 'bloom' 0..1 (Microsoft value 0.1875)
  cube:1,                 // site: 'cube' = irradiance gain 0..2.5 (Microsoft value 1)
  groundShadow:true,      // site: 'shadow' (true = NO self-shadow)
  idle:true,              // site: 'idle'
  liveliness:20,          // site: 'liveliness' 0..100 (default 20)
  holdStill:true,         // site: 'stillWhenClose'
  reduceMotion:'system',  // site: 'reduceMotion' system / on / off
  bigText:false,          // site: 'bigText'
  focusRing:false,        // local: high-contrast focus outline (the site's nearest is 'hiContrast', stronger rules)
});

const pct=v=>`${Math.round(v)}%`;
export const SECTIONS=[
  {title:'Picture quality',rows:[
    {k:'supersample',type:'select',label:'Detail',hint:'how many pixels are drawn before the picture is scaled down',
      options:[{v:1,label:'Standard'},{v:1.5,label:'High'},{v:2,label:'Very high'},{v:3,label:'Maximum'}]},
    {k:'pixelRatio',type:'select',label:'Pixel density',hint:'device: up to 2 pixels per screen point; 1: faster on slow machines',
      options:[{v:'device',label:'Match the screen'},{v:'1',label:'1 pixel per point'}]},
    {k:'_render',type:'readout',label:'Rendering'},
  ]},
  {title:'Lighting',rows:[
    {k:'occlusion',type:'switch',label:'Occlusion',hint:'the screen-space ambient occlusion pass'},
    {k:'occlusionGain',type:'range',label:'Occlusion strength',min:0,max:3,step:0.01,fmt:v=>v.toFixed(3),offWhen:s=>!s.occlusion,offWhy:'occlusion is off'},
    {k:'bloom',type:'range',label:'Bloom',min:0,max:1,step:0.0025,fmt:v=>v.toFixed(4)},
    {k:'cube',type:'range',label:'Cube',hint:'irradiance (ambient light) gain',min:0,max:2.5,step:0.01,fmt:v=>v.toFixed(3)},
    {k:'groundShadow',type:'switch',label:'Ground shadow',hint:'as on the site this works backwards: on = no self-shadow (the console look); off = the avatar shadows itself'},
    {k:'_light',type:'button',label:'Lighting back to Microsoft’s values'},
  ]},
  {title:'Movement',rows:[
    {k:'idle',type:'switch',label:'Idle behaviour',hint:'the original random playlist. Off is a figure that does not fidget.'},
    {k:'liveliness',type:'range',label:'Liveliness',min:0,max:100,step:5,
      fmt:v=>v<=0?'never fidgets':v>=100?'never settles':`${pct(v)}`,
      hint:'how often the restless stands, Celebrate, Clap and Wave are drawn against the four still stands',
      offWhen:s=>!s.idle,offWhy:'nothing is moving anyway'},
    {k:'holdStill',type:'switch',label:'Hold still when zoomed in',hint:'only the still stands while the camera is on one body part',
      offWhen:s=>!s.idle,offWhy:'nothing is moving anyway'},
  ]},
  {title:'Accessibility',rows:[
    {k:'reduceMotion',type:'select',label:'Reduce motion',hint:'on: menu fades, camera moves and clip blends snap (the site’s Snap mode)',
      options:[{v:'system',label:'Follow system'},{v:'on',label:'On'},{v:'off',label:'Off'}]},
    {k:'bigText',type:'switch',label:'Larger text',hint:'menu, header and hint text 20% larger'},
    {k:'focusRing',type:'switch',label:'High-contrast focus',hint:'a white and black ring around whatever has focus'},
  ]},
  {title:'Sound',rows:[
    {k:'_sound',type:'readout',label:'Interface sound',value:()=>'Unavailable: the console’s sounds have not been recovered'},
  ]},
  {title:'Profile',rows:[
    {k:'_profile',type:'text',label:'Profile name',hint:'shown in the menu headers (15 characters)',maxLength:15},
  ]},
];

const NUMERIC={supersample:[1,3],occlusionGain:[0,3],bloom:[0,1],cube:[0,2.5],liveliness:[0,100]};
const CHOICES={pixelRatio:['device','1'],reduceMotion:['system','on','off'],supersample:[1,1.5,2,3]};

// Keep only known keys with the right type and range; anything else falls back to the default.
export function sanitize(raw){
  const out={...DEFAULTS};if(!raw||typeof raw!=='object')return out;
  for(const k of Object.keys(DEFAULTS)){
    const v=raw[k],d=DEFAULTS[k];
    if(typeof v!==typeof d)continue;
    if(typeof d==='number'){
      if(!Number.isFinite(v))continue;const [lo,hi]=NUMERIC[k]||[-Infinity,Infinity];
      if(CHOICES[k]&&!CHOICES[k].includes(v))continue;
      out[k]=Math.min(hi,Math.max(lo,v));
    }else if(typeof d==='string'){if(!CHOICES[k]||CHOICES[k].includes(v))out[k]=v;}
    else out[k]=v;
  }
  return out;
}
