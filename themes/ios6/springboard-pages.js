(() => {
 const grid=document.getElementById('apps');let page=0,pages=1,gesture=null,blockUntil=0;
 const reduced=()=>document.body.classList.contains('still')||matchMedia('(prefers-reduced-motion:reduce)').matches;
 function dots(){const host=document.querySelector('.springboard-dots');if(!host)return;
 // Keep dot elements mounted so their size transitions on a page change.
 if(host.children.length!==pages||[...host.children].some(n=>n.tagName!=='BUTTON')){host.replaceChildren();for(let i=0;i<pages;i++){const b=document.createElement('button');b.setAttribute('aria-label','Home page '+(i+1));b.onclick=()=>go(i);b.addEventListener('pointerup',e=>{if(e.pointerType==='touch'){e.preventDefault();go(i);}});host.append(b);}}
 [...host.children].forEach((b,i)=>{b.setAttribute('aria-current',String(i===page));b.classList.toggle('on',i===page);});}

 function layout(){const width=grid.clientWidth||1280,col=(width-140)/6,rowGap=155;let slot=0;for(const n of grid.children){const span=n.classList.contains('home-player')?2:1;if(slot%6+span>6)slot+=6-slot%6;const p=Math.floor(slot/18),within=slot%18;Object.assign(n.style,{position:'absolute',left:(p*width+70+(within%6)*col+(span===1?(col-140)/2:0))+'px',top:(58+Math.floor(within/6)*rowGap)+'px',width:(span===1?140:col*2-20)+'px'});slot+=span;}pages=Math.max(1,Math.ceil(slot/18));grid.style.setProperty('--page-count',pages);page=Math.min(page,pages-1);dots();}
 function go(next,instant=false){page=Math.max(0,Math.min(pages-1,next));grid.scrollTo({left:page*grid.clientWidth,top:0,behavior:instant||reduced()?'instant':'smooth'});dots();}
 new MutationObserver(()=>layout()).observe(grid,{childList:true});window.addEventListener('resize',()=>{layout();go(page,true);});
 grid.addEventListener('pointerdown',e=>{if(e.pointerType==='mouse'&&e.button!==0)return;gesture={id:e.pointerId,x:e.clientX,y:e.clientY,left:grid.scrollLeft,moving:false};});
 grid.addEventListener('pointermove',e=>{if(!gesture||gesture.id!==e.pointerId)return;if(grid.classList.contains('arranging')){gesture=null;return;}const dx=e.clientX-gesture.x,dy=e.clientY-gesture.y;if(!gesture.moving&&Math.abs(dx)>12&&Math.abs(dx)>Math.abs(dy)){gesture.moving=true;grid.setPointerCapture(e.pointerId);}if(gesture.moving){e.preventDefault();const scale=grid.getBoundingClientRect().width/grid.clientWidth;grid.scrollLeft=gesture.left-dx/scale;blockUntil=Date.now()+500;}});
 function end(e){if(!gesture||gesture.id!==e.pointerId)return;const g=gesture;gesture=null;if(g.moving){const dx=e.clientX-g.x;go(Math.abs(dx)>45?Math.round(g.left/grid.clientWidth)+(dx<0?1:-1):Math.round(grid.scrollLeft/grid.clientWidth));}}
 grid.addEventListener('pointerup',end);grid.addEventListener('pointercancel',()=>{gesture=null;go(Math.round(grid.scrollLeft/grid.clientWidth));});grid.addEventListener('click',e=>{if(Date.now()<blockUntil){e.preventDefault();e.stopImmediatePropagation();}},true);
 grid.addEventListener('wheel',e=>{e.preventDefault();if(Math.abs(e.deltaX)+Math.abs(e.deltaY)>5){clearTimeout(grid._wheelTimer);grid._wheelTimer=setTimeout(()=>go(page+((e.deltaX||e.deltaY)>0?1:-1)),70);}},{passive:false});
 grid.addEventListener('scroll',()=>{const nearest=Math.round(grid.scrollLeft/grid.clientWidth);if(nearest!==page){page=nearest;dots();}});
 window.IOS6Pager={layout,go,resize:()=>{layout();go(page,true);}};layout();
})();
