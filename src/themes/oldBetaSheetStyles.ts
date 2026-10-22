/** Cold inactive artwork and the smaller reference composition. */
export const BETA_COLD_ART='grayscale(1) sepia(1) hue-rotate(165deg) saturate(.65) brightness(.66)';
export const OLD_BETA_SHEET_CSS=`
.dht-oldbeta[data-mode=sheet] .beta-cover img,.dht-oldbeta .beta-store-sheet .beta-sheet-cover img,.dht-oldbeta .beta-rear-cover img{filter:${BETA_COLD_ART};transition:filter 240ms ease-out}
.dht-oldbeta[data-mode=sheet] .beta-cover[data-sheet-selected=true] img,.dht-oldbeta .beta-store-layer-0 .beta-sheet-cover[data-sheet-selected=true] img{filter:none}
.dht-oldbeta:not([data-mode=sheet]) .beta-cover img{filter:${BETA_COLD_ART}}.dht-oldbeta:not([data-mode=sheet]) .beta-cover[data-selected=true] img{filter:none}
.dht-oldbeta .beta-community-layer .beta-sheet-friend{filter:${BETA_COLD_ART};transition:filter 240ms ease-out}.dht-oldbeta .beta-community-layer-0 .beta-sheet-friend[data-sheet-selected=true]{filter:none}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-sheet{width:calc(var(--beta-w)*.59)}
.dht-oldbeta[data-sheet-layout=reference] .beta-store-layer-2 .beta-sheet-cover:nth-last-child(-n+2),.dht-oldbeta[data-sheet-layout=reference] .beta-rear-sheet-2 .beta-rear-cover:nth-last-child(-n+2){--flow-alpha:.48}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-sheet{width:calc(var(--beta-w)*.44)}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-layer{grid-auto-rows:calc(var(--beta-h)*.045);gap:calc(var(--beta-h)*.007) calc(var(--beta-w)*.005)}
.dht-oldbeta[data-sheet-layout=reference] .beta-community-layer .beta-friend-avatar{width:calc(var(--beta-w)*.024);height:calc(var(--beta-w)*.024)}
`;
