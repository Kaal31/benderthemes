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
