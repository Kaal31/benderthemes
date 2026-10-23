/** Cold inactive artwork and the smaller reference composition. */
export const BETA_COLD_ART='grayscale(1) sepia(1) hue-rotate(165deg) saturate(.65) brightness(.66)';
export const OLD_BETA_SHEET_CSS=`
.dht-oldbeta[data-mode=sheet][data-opening=true][data-store-open=true] .beta-categories{top:39%}
.dht-oldbeta[data-mode=sheet] .beta-cover img,.dht-oldbeta .beta-store-sheet .beta-sheet-cover img,.dht-oldbeta .beta-rear-cover img{filter:${BETA_COLD_ART};transition:filter 240ms ease-out}
.dht-oldbeta[data-mode=sheet] .beta-cover[data-sheet-selected=true] img,.dht-oldbeta .beta-store-layer-0 .beta-sheet-cover[data-sheet-selected=true] img{filter:none}
.dht-oldbeta:not([data-mode=sheet]) .beta-cover img{filter:${BETA_COLD_ART}}.dht-oldbeta:not([data-mode=sheet]) .beta-cover[data-selected=true] img{filter:none}
.dht-oldbeta .beta-community-layer .beta-sheet-friend .beta-friend-avatar img{filter:${BETA_COLD_ART};transition:filter 240ms ease-out}.dht-oldbeta .beta-community-layer-0 .beta-sheet-friend[data-sheet-selected=true] .beta-friend-avatar img{filter:none}
.dht-oldbeta .beta-community-layer .beta-sheet-friend{--presence:#6fc7ef;color:var(--presence);font-size:calc(var(--beta-w)*.0115);font-weight:500;line-height:1.2;text-shadow:0 1px 2px #000,0 0 4px #071725}
.dht-oldbeta .beta-community-layer .beta-sheet-friend[data-presence=playing]{--presence:#a5d56a}.dht-oldbeta .beta-community-layer .beta-sheet-friend[data-presence=empty]{--presence:#79909e}
.dht-oldbeta .beta-community-layer .beta-sheet-friend[data-presence=offline]{--presence:#96a6b1}
.dht-oldbeta .beta-community-layer .beta-sheet-friend small{color:inherit;font-size:.88em;line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.dht-oldbeta .beta-community-layer .beta-sheet-friend>span:last-child{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.dht-oldbeta .beta-community-layer .beta-friend-avatar{border-color:var(--presence)}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-sheet{width:calc(var(--beta-w)*.67);left:50%;top:40%}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer{grid-template-columns:repeat(3,minmax(0,1fr));gap:calc(var(--beta-w)*.004)}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer-0 .beta-sheet-cover[data-sheet-selected=true]{grid-column:2;grid-row:1}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer-1{transform:translate3d(-9%,35%,-24px) scale(1.08)}.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer-2{transform:translate3d(-15%,60%,-48px) scale(1.12)}
.dht-oldbeta[data-sheet-layout=reference][data-mode=sheet] .beta-cover-board{left:50%;top:35.5%}
.dht-oldbeta[data-sheet-layout=reference] .beta-rear-sheet{transform:translate3d(var(--sheet-offset,0px),calc(var(--sheet-depth)*var(--beta-h)*.065),calc(var(--sheet-depth)*-24px)) rotateZ(calc((var(--sheet-depth) - 2)*.5deg)) scale(calc(1 + var(--sheet-depth)*.055))}.dht-oldbeta[data-sheet-layout=reference] .beta-rear-sheet-1{--sheet-offset:calc(var(--beta-w)*-.045)}.dht-oldbeta[data-sheet-layout=reference] .beta-rear-sheet-2{--sheet-offset:calc(var(--beta-w)*-.065)}
.dht-oldbeta[data-sheet-layout=reference] .beta-rear-sheet-3{--sheet-offset:calc(var(--beta-w)*-.085);--flow-alpha:.48}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer-2 .beta-sheet-cover:nth-last-child(-n+2){--flow-alpha:.48}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-sheet{width:calc(var(--beta-w)*.34);left:50%;top:40%}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-layer{grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:calc(var(--beta-h)*.11);gap:calc(var(--beta-h)*.0025) calc(var(--beta-w)*.001)}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-layer .beta-friend-avatar{width:calc(var(--beta-w)*.068);height:calc(var(--beta-w)*.068)}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-layer-0 .beta-sheet-friend[data-sheet-selected=true]{grid-column:2;grid-row:1;justify-content:center;position:relative}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-layer-0 .beta-sheet-friend[data-sheet-selected=true]>span:last-child{position:absolute;left:calc(50% + var(--beta-w)*.039);white-space:nowrap}
/* Peripheral artwork recedes into haze; the central colored capsule stays crisp. */
.dht-oldbeta[data-sheet-layout=reference][data-mode=sheet] .beta-cover[data-sheet-edge=true] img,
.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer-0 .beta-sheet-cover:not([data-sheet-selected=true]) img{filter:${BETA_COLD_ART} brightness(.78) blur(.45px)}
.dht-oldbeta[data-sheet-layout=reference] .beta-rear-sheet-3 img{filter:${BETA_COLD_ART} brightness(.75) blur(1px)}
.dht-oldbeta .beta-cover{transition-property:transform,opacity}
.dht-oldbeta[data-mode=sheet] .beta-cover,.dht-oldbeta[data-carousel-entering=true] .beta-cover{transition:none}
`;
