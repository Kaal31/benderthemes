const D='.dht-destination[data-wiiflow-library=true]';
export const WIIFLOW_LIBRARY_STYLES=`
${D} .dht-page-frame{inset:3% 4%!important;gap:10px!important}
${D} .dht-page-header{gap:16px!important}
${D} .dht-page-title{font-size:28px!important}
${D} .dht-page-subtitle{font-size:16px!important}
${D} input[aria-label="Search games"]{padding:9px 14px!important;font-size:18px!important}
${D} .dht-page-list{display:grid;grid-template-columns:repeat(auto-fill,minmax(122px,1fr));grid-auto-rows:205px;align-content:start;gap:14px 10px;padding:10px 14px 16px!important;scroll-padding:12px;background:linear-gradient(#ffffff08,#0002);border-radius:8px}
${D} .dht-destination-row{flex-direction:column;justify-content:flex-start;gap:4px!important;padding:3px 4px 7px!important;margin:0!important;min-width:0;min-height:0!important;background:transparent!important;outline:none!important;color:#f2f4f7!important;border:1px solid transparent!important;border-radius:6px!important}
${D} .dht-destination-row[data-selected=true]{background:transparent!important;border-color:transparent!important;box-shadow:none!important}
${D} .dht-row-icon{display:block;width:100%;height:164px;flex:0 0 164px;filter:drop-shadow(4px 6px 4px #0009)}
${D} .dht-case-stage[data-case-realistic=true] .dht-case-top,${D} .dht-case-stage[data-case-realistic=true] .dht-case-bottom{background:linear-gradient(#626b75,#353d46 12%,#242b33 44%,#11161c 49%,#303841 54%,#353d46 90%,#5d6670)}
${D} .dht-case-stage[data-case-reversed=true] .dht-case-spine{left:auto;right:-6px;transform:rotateY(90deg);background:linear-gradient(90deg,#343a41,#22272d 15%,#13171c 48%,#07090c 52%,#293039 56%,#343b44)!important}
${D} .dht-case-stage[data-case-reversed=true] .dht-case-spine span{visibility:hidden}
${D} .dht-case-front{border-color:#ffffff30;box-shadow:inset 1px 0 2px #ffffff50,inset -2px 0 3px #0008}
${D} .dht-destination-row[data-selected=true] .dht-case-body{transform:rotateY(10deg) rotateX(0deg);animation:wiiflow-grid-float 2.8s ease-in-out infinite;filter:drop-shadow(0 0 5px #b9e4ff70)}
@keyframes wiiflow-grid-float{0%,100%{translate:0 -3px}50%{translate:0 -9px}}
${D}[data-motion=false] .dht-case-body{animation:none}
@media(prefers-reduced-motion:reduce){${D} .dht-case-body{animation:none}}
${D} .dht-case-back{padding:5px;overflow:hidden;background:#182029}
${D} .wiiflow-case-back{height:100%;display:flex;flex-direction:column;gap:6px;color:#ead6ad;font:10px Arial;text-align:left}
${D} .wiiflow-case-back strong{font-size:11px;line-height:1.2}
${D} .wiiflow-case-back small{color:#ddd;font-size:9px}
${D} .wiiflow-case-back>span{margin-top:auto;color:#fff;font-size:15px}
${D} .dht-case-front{padding:1.5%}
${D} .dht-case-spine span{color:#fff;text-shadow:0 1px 2px #000}
${D} .dht-destination-row:not([data-selected=true]) .dht-case-spine span{visibility:hidden}
${D} .dht-row-text{width:100%;min-width:0;text-align:center}
${D} .dht-row-label{font-size:13px!important;line-height:1.25;display:-webkit-box!important;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
${D} .dht-row-sub{display:none!important}
${D} [data-case-paper=true] .dht-case-front{padding:0;border:1px solid #f6f2e2;border-radius:0;box-shadow:none}
${D} [data-case-paper=true] .dht-case-front:after{background:none;box-shadow:none}
${D} [data-case-paper=true] .dht-case-spine{border-left:1px solid #f6f2e2;border-right:1px solid #f6f2e2}

${D} [data-case-frameless=true] .dht-case-front{padding:0;border:0;border-radius:0;box-shadow:none}
${D} [data-case-frameless=true] .dht-case-front>div{border-radius:0}
${D} [data-case-frameless=true] .dht-case-front:after{box-shadow:none;background:linear-gradient(112deg,#ffffff12,transparent 30%)}


`;
