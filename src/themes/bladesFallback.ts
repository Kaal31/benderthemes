// Independently drawn fallback surfaces; optional external console textures override these.
const svg=(body:string,w=100,h=100)=>'data:image/svg+xml;base64,'+btoa(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none">${body}</svg>`);
const metal=(path:string)=>svg(`<defs><linearGradient id="m"><stop stop-color="#60636a"/><stop offset=".16" stop-color="#f1f2ef"/><stop offset=".45" stop-color="#b6b8b9"/><stop offset=".8" stop-color="#eceeea"/><stop offset="1" stop-color="#5a5b61"/></linearGradient></defs><path d="${path}" fill="url(#m)" stroke="#67696c" stroke-width="2"/>`,100,720);
const pane=(fill:string,edge='#8b896d')=>svg(`<defs><linearGradient id="p" x2="0" y2="1"><stop stop-color="${fill}"/><stop offset="1" stop-color="#ffffff" stop-opacity=".15"/></linearGradient></defs><rect x="1" y="1" width="98" height="98" rx="8" fill="url(#p)" stroke="${edge}" stroke-width="2"/>`);
export const bladesFallback:Record<string,string>={
 'blades-runner-left':metal('M0 0H100L87 285Q83 320 68 345L62 720H0Z'),
 'blades-runner-right':metal('M0 0H100V720H38L32 345Q17 320 13 285Z'),
 'blades-size4-header':metal('M8 0H93L85 268Q84 299 65 311L59 720H8Z'),
 'gamecard_home-silver':pane('#d5d9c4'),
 'button-focus':svg('<defs><linearGradient id="g"><stop stop-color="#efe8cd" stop-opacity=".1"/><stop offset=".5" stop-color="#fff8d7" stop-opacity=".9"/><stop offset="1" stop-color="#e9d7a5" stop-opacity=".1"/></linearGradient></defs><path d="M0 1H100M0 99H100" stroke="#897748"/><rect y="3" width="100" height="94" fill="url(#g)"/>'),
 'button-nofocus':svg('<path d="M0 99H100" stroke="#766e4e" stroke-opacity=".5"/>'),
 'dvdtray-nofocus':pane('#bf8d3f','#76612d'),
 'dvdtray-focus':pane('#ead69a','#fff1bd'),
 'guide-blade-overlay-edge-right':metal('M0 0H100V720H0L16 342Q30 320 30 280Z'),
 'guide-blade-overlay-tile':pane('#d5d8c4','#c1c6b2'),
 'guide-button-focus':pane('#f0efdd','#a5a88f'),
 'guide-button-nofocus':svg('<path d="M0 99H100" stroke="#7d806c" stroke-opacity=".4"/>'),
};
for(let n=1;n<=3;n++)for(const side of ['left','right'])bladesFallback[`blades-size${n}-${side}-nf`]=metal('M8 0H95L87 270Q87 300 70 310L63 720H8Z');
for(const [name,color] of Object.entries({orange:'#c68425',green:'#76a22d',blue:'#5b8ca8',purple:'#8c70aa',grey:'#a9b098'}))bladesFallback['background-'+name]=svg(`<defs><linearGradient id="b" x2=".4" y2="1"><stop stop-color="${color}"/><stop offset=".55" stop-color="${color}"/><stop offset="1" stop-color="#e4ce8a"/></linearGradient></defs><rect width="100" height="100" fill="url(#b)"/>`);
for(const [letter,color] of [['a','#96ba38'],['b','#cb4733'],['y','#dab33b']])bladesFallback['button-'+letter]=svg(`<defs><radialGradient id="b" cx=".35" cy=".25"><stop stop-color="#fff"/><stop offset="1" stop-color="${color}"/></radialGradient></defs><circle cx="50" cy="50" r="44" fill="url(#b)"/><text x="50" y="67" text-anchor="middle" font-family="Arial" font-size="54" fill="#24311a">${letter.toUpperCase()}</text>`);

const clear=svg('');
for(const edge of ["top","bottom"])for(const part of ["left","middle","right"])bladesFallback[`bkgd-whitewash-glass-${edge}-${part}${part==="middle"?"":"-ws"}`]=clear;
for(const key of ["legend-a","legend-b","legend-y"])bladesFallback[key]=bladesFallback["button-"+key.slice(-1)]??clear;

// Independent center wash: leave the header and legend exposed through the
// curved ends of a translucent light sheet, as in the console reference.
const washStops='<defs><linearGradient id="wash" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#dfded5" stop-opacity=".5"/><stop offset=".5" stop-color="#edeaea" stop-opacity=".25"/><stop offset="1" stop-color="#dfded5" stop-opacity=".5"/></linearGradient></defs>';
bladesFallback['background-overlay-whitewash-centertile-ws']=svg(washStops+'<path d="M0 64H100V440H0Z" fill="url(#wash)"/>',100,512);
bladesFallback['background-overlay-whitewash-left-ws']=svg(washStops+'<path d="M0 48Q0 64 32 64H100V440H32Q0 440 0 458Z" fill="url(#wash)"/>',100,512);
bladesFallback['background-overlay-whitewash-right-ws']=svg(washStops+'<path d="M0 64H68Q100 64 100 48V458Q100 440 68 440H0Z" fill="url(#wash)"/>',100,512);

// Independently drawn bowed chrome: both ends turn back toward the outside,
// with a continuous inner seam rather than a square vertical extrusion.
const rail=(mirror=false)=>svg(`<defs><linearGradient id="steel"><stop stop-color="#51575d"/><stop offset=".12" stop-color="#c8cdcf"/><stop offset=".22" stop-color="#f8f9f6"/><stop offset=".56" stop-color="#c6cbcc"/><stop offset=".8" stop-color="#979fa3"/><stop offset=".93" stop-color="#eff2ef"/><stop offset="1" stop-color="#4d565d"/></linearGradient><linearGradient id="edge"><stop stop-color="#333e45"/><stop offset=".45" stop-color="#c6cece"/><stop offset=".75" stop-color="#e9ede7"/><stop offset="1" stop-color="#68747a"/></linearGradient></defs><g transform="${mirror?'translate(100 0) scale(-1 1)':''}"><path d="M9 0H70C86 128 96 234 96 360S86 592 70 720H9C26 580 36 476 36 360S26 140 9 0Z" fill="url(#steel)"/><path d="M11 0C27 140 38 244 38 360S27 580 11 720" fill="none" stroke="#4b5155" stroke-width="1.3"/><path d="M15 0C31 140 42 244 42 360S31 580 15 720" fill="none" stroke="#ffffff" stroke-opacity=".72" stroke-width="1.6"/><path d="M66 0C74 70 80 136 81 176Q81 198 65 199Q48 199 48 220C53 340 54 414 49 470Q48 491 61 514Q77 539 74 572L59 720" fill="none" stroke="#535e64" stroke-width="1.8"/><path d="M69 0C77 70 83 136 84 176Q84 202 66 203Q51 203 51 222C56 340 57 413 52 470Q51 490 64 512Q80 539 77 572L62 720" fill="none" stroke="#f6f8f1" stroke-opacity=".8" stroke-width="1.3"/></g>`,100,720);
bladesFallback['blades-size4-header']=rail();
bladesFallback['blades-runner-left']=rail();
bladesFallback['blades-runner-right']=rail(true);
for(let n=1;n<=3;n++)for(const side of ['left','right'])bladesFallback[`blades-size${n}-${side}-nf`]=rail(side==='right');
const palette:Record<string,[string,string,string]>={orange:['#ac671b','#d5a33b','#9a5b13'],green:['#315878','#a0c8d4','#377eaa'],blue:['#2c5e83','#b0d2e0','#397ba6'],purple:['#673c8f','#a17db7','#543774'],grey:['#6c797d','#d2dbd5','#7b8c8c']};
for(const [name,[top,center,bottom]] of Object.entries(palette)){
 bladesFallback['background-'+name]=svg(`<defs><linearGradient id="b" x2="0" y2="1"><stop stop-color="${top}"/><stop offset=".14" stop-color="${center}"/><stop offset=".5" stop-color="${center}"/><stop offset=".86" stop-color="${center}"/><stop offset="1" stop-color="${bottom}"/></linearGradient><radialGradient id="light" cx=".57" cy=".57" r=".7"><stop stop-color="#fff9d3" stop-opacity=".26"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs><rect width="1280" height="720" fill="url(#b)"/><rect width="1280" height="720" fill="url(#light)"/><g fill="none" stroke="#fff3c6" stroke-opacity=".065" stroke-width="15"><path d="M-300 780Q290-320 1500 180M-310 815Q350-220 1450 280M-260 870Q430-150 1460 380M-220 920Q470-80 1480 480"/></g><path d="M0 630Q640 560 1280 690" fill="none" stroke="#f7ffe1" stroke-opacity=".05" stroke-width="36"/>`,1280,720);
}
const glassPanel=(focus=false)=>svg(`<defs><linearGradient id="p" x2="0" y2="1"><stop stop-color="${focus?'#f4f0d9':'#e2e5df'}" stop-opacity=".7"/><stop offset=".46" stop-color="#fffde9" stop-opacity=".45"/><stop offset="1" stop-color="#9ca49b" stop-opacity=".24"/></linearGradient></defs><rect x="1.5" y="2" width="97" height="96" rx="3" fill="url(#p)" stroke="#62695e" stroke-opacity=".6" stroke-width="1.2"/><path d="M5 5H95" stroke="#fff" stroke-opacity=".7"/>`);
bladesFallback['gamecard_home-silver']=glassPanel();
for(const focus of [false,true])bladesFallback['dvdtray-'+(focus?'focus':'nofocus')]=svg(`<defs><linearGradient id="t" x2="0" y2="1"><stop stop-color="#6e704f" stop-opacity=".25"/><stop offset=".35" stop-color="#eaf1d4" stop-opacity=".3"/><stop offset="1" stop-color="#eef1d9" stop-opacity=".55"/></linearGradient></defs><rect x="2" y="3" width="496" height="44" rx="22" fill="url(#t)" stroke="#72775a" stroke-width="2"/><circle cx="25" cy="25" r="21" fill="#dfe4bd" fill-opacity=".15" stroke="#848661" stroke-width="2"/><path d="M22 19L31 25L22 31Z" fill="#717950"/>`,500,50);
