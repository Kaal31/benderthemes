/** Cold inactive artwork and the smaller reference composition. */
export const BETA_COLD_ART='grayscale(1) sepia(1) hue-rotate(165deg) saturate(.65) brightness(.66)';
export const OLD_BETA_SHEET_CSS=`
.dht-oldbeta[data-mode=sheet][data-opening=true][data-store-open=true] .beta-categories{top:39%}
.dht-oldbeta[data-mode=sheet] .beta-cover img,.dht-oldbeta .beta-store-sheet .beta-sheet-cover img,.dht-oldbeta .beta-rear-cover img{filter:${BETA_COLD_ART};transition:filter 240ms ease-out}
.dht-oldbeta[data-mode=sheet] .beta-cover[data-sheet-selected=true] img,.dht-oldbeta .beta-store-layer-0 .beta-sheet-cover[data-sheet-selected=true] img{filter:none}
.dht-oldbeta:not([data-mode=sheet]) .beta-cover img{filter:${BETA_COLD_ART}}.dht-oldbeta:not([data-mode=sheet]) .beta-cover[data-selected=true] img{filter:none}
.dht-oldbeta .beta-community-layer .beta-sheet-friend{filter:${BETA_COLD_ART};transition:filter 240ms ease-out}.dht-oldbeta .beta-community-layer-0 .beta-sheet-friend[data-sheet-selected=true]{filter:none}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-sheet{width:calc(var(--beta-w)*.67);left:50%;top:40%}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer{grid-template-columns:repeat(3,minmax(0,1fr));gap:calc(var(--beta-w)*.004)}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer-0 .beta-sheet-cover[data-sheet-selected=true]{grid-column:2;grid-row:1}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer-1{transform:translate3d(-3%,15%,-36px) scale(.96)}.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer-2{transform:translate3d(3%,30%,-72px) scale(.92)}
.dht-oldbeta[data-sheet-layout=reference][data-mode=sheet] .beta-cover-board{left:50%;top:35.5%}
.dht-oldbeta[data-sheet-layout=reference] .beta-rear-sheet{transform:translate3d(var(--sheet-offset,0px),calc(var(--sheet-depth)*18px),calc(var(--sheet-depth)*-30px)) rotateZ(calc((var(--sheet-depth) - 2)*.5deg))}.dht-oldbeta[data-sheet-layout=reference] .beta-rear-sheet-1{--sheet-offset:-20px}.dht-oldbeta[data-sheet-layout=reference] .beta-rear-sheet-2{--sheet-offset:16px}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer-2 .beta-sheet-cover:nth-last-child(-n+2),.dht-oldbeta[data-sheet-layout=reference] .beta-rear-sheet-2 .beta-rear-cover:nth-last-child(-n+2){--flow-alpha:.48}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-sheet{width:calc(var(--beta-w)*.34);left:50%;top:40%}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-layer{grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:calc(var(--beta-h)*.11);gap:calc(var(--beta-h)*.0025) calc(var(--beta-w)*.001)}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-layer .beta-friend-avatar{width:calc(var(--beta-w)*.068);height:calc(var(--beta-w)*.068)}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-layer-0 .beta-sheet-friend[data-sheet-selected=true]{grid-column:2;grid-row:1;justify-content:center;position:relative}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-layer-0 .beta-sheet-friend[data-sheet-selected=true]>span:last-child{position:absolute;left:calc(50% + var(--beta-w)*.039);white-space:nowrap}
`;
