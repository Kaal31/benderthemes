/** MingeBag reference: home 00:06, Library 00:18, Settings 01:54.
 * Keep the native controls and fixed edge shortcuts; tune their presentation.
 */
export const OLD_BIG_PICTURE_REFERENCE_CSS=`
.dht-oldbigpicture:not([data-beta])[data-page=home] header{flex:0 0 18.6%}
.dht-oldbigpicture:not([data-beta]) .home-tile{height:calc(var(--obp-height)*.20);font-size:clamp(16px,calc(var(--obp-width)*.025),42px);transition:color 140ms,background-color 140ms,box-shadow 160ms,outline-color 120ms}
.dht-oldbigpicture:not([data-beta]) .home-tile .tile-icon{width:calc(var(--obp-width)*.11);height:calc(var(--obp-height)*.13)}
.dht-oldbigpicture:not([data-beta]) .home-tile:focus{outline:2px solid #b8edff;outline-offset:0;color:#beeaf9;background:radial-gradient(ellipse at 50% 105%,#46bedb5c,transparent 75%),linear-gradient(#1c5673,#287c9b);box-shadow:0 0 4px 2px #b5edff80,0 0 14px #62d9ff80,inset 0 0 13px #84ddfa26}
.dht-oldbigpicture:not([data-beta]) .home-navigation{transition:opacity 150ms}
.dht-oldbigpicture:not([data-beta]):has(.home-recommendations .game:focus) .home-navigation{opacity:.43}
.dht-oldbigpicture:not([data-beta]) .recommendation h2{font-size:calc(var(--obp-width)*.013);font-weight:300}
.dht-oldbigpicture:not([data-beta]) .recommendation .game img{transition:filter 160ms}
.dht-oldbigpicture:not([data-beta]):has(.home-tile:focus) .recommendation .game img{filter:saturate(.65) brightness(.68)}
.dht-oldbigpicture:not([data-beta]):not([data-page=home]):not([data-page=web]) header{flex:0 0 9.7%;height:auto}
.dht-oldbigpicture:not([data-beta]):not([data-page=home]) .brand{font-size:calc(var(--obp-width)*.025);font-weight:300}
.dht-oldbigpicture:not([data-beta]):not([data-page=home]) .brand img{width:calc(var(--obp-width)*.038);height:calc(var(--obp-width)*.038)}
.dht-oldbigpicture:not([data-beta]):is([data-page=library],[data-page=settings]) header .utilities button{display:none}
.dht-oldbigpicture:not([data-beta])[data-page=library] main{padding:calc(var(--obp-height)*.025) calc(var(--obp-width)*.024) 0}
.dht-oldbigpicture:not([data-beta]) .library-sidebar :is(button,select){transition:background-color 110ms,color 110ms}
.dht-oldbigpicture:not([data-beta]) .library-shell{gap:calc(var(--obp-width)*.008);transition:grid-template-columns 180ms cubic-bezier(.22,.61,.36,1)}
.dht-oldbigpicture:not([data-beta]) .library-body h2{font-size:calc(var(--obp-width)*.019);font-weight:300}
.dht-oldbigpicture:not([data-beta]) .library-row{padding:12px 16px 16px}
.dht-oldbigpicture:not([data-beta]) .library-row .game{background:none;transition:flex-basis 180ms cubic-bezier(.22,.61,.36,1),transform 140ms,box-shadow 140ms}
.dht-oldbigpicture:not([data-beta]) .library-row .game .label{padding:4px 5px;line-height:1.35}
.dht-oldbigpicture:not([data-beta]) .library-body .game small{font-size:clamp(12px,calc(var(--obp-width)*.012),20px);line-height:1.35}
.dht-oldbigpicture:not([data-beta]) .library-body .game:focus{outline:2px solid #c3efff;box-shadow:0 0 3px 2px #b8ecffd9,0 0 8px 4px #64c9ed80;transform:scale(1.04)}
.dht-oldbigpicture:not([data-beta]) .library-body .game:focus .label{background:linear-gradient(90deg,#287d9d,#2785a6)}
.dht-oldbigpicture:not([data-beta])[data-page=settings] main{padding-top:calc(var(--obp-height)*.045)}
.dht-oldbigpicture:not([data-beta]) .settings-columns{width:86%;max-width:none;margin-left:5%;gap:5%}
.dht-oldbigpicture:not([data-beta]) .settings-columns h2{font-size:calc(var(--obp-width)*.016);font-weight:300;margin:calc(var(--obp-height)*.026) 0 4px}
.dht-oldbigpicture:not([data-beta]) .settings-columns .settings-link{font-size:calc(var(--obp-width)*.0145);min-height:calc(var(--obp-height)*.045);margin:2px 0;padding:4px 8px;transition:background-color 110ms,color 110ms}
.dht-oldbigpicture:not([data-beta]) .library-sidebar :is(button,select):focus,
.dht-oldbigpicture:not([data-beta]) .settings-columns .settings-link:focus{background:linear-gradient(90deg,#8ecce8,#b4e2f5);color:#143b52;outline:0;box-shadow:none}
.dht-oldbigpicture.no-motion *{transition:none!important}
@media(prefers-reduced-motion:reduce){.dht-oldbigpicture *{transition:none!important}}
`;
