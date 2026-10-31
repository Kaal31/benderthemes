/** Focus feedback only: sheet/page transforms keep their existing owners. */
export const OLD_BETA_FOCUS_CSS=`
.dht-oldbeta .beta-side-page button,.dht-oldbeta .beta-header button,.dht-oldbeta footer button,.dht-oldbeta .beta-games-toolbar button,.dht-oldbeta .beta-keyboard-overlay button{transition:color 140ms ease-out,background-color 160ms ease-out,border-color 160ms ease-out,outline-color 160ms ease-out,box-shadow 180ms ease-out,transform 170ms cubic-bezier(.22,.61,.36,1)}
.dht-oldbeta .beta-header button,.dht-oldbeta footer button,.dht-oldbeta .beta-games-toolbar>button{outline:1px solid transparent;outline-offset:2px}
.dht-oldbeta .beta-header button:focus,.dht-oldbeta footer button:focus,.dht-oldbeta .beta-games-toolbar>button:focus{outline-color:#d3edfa;background-color:#8fc7e01c;color:#e7f7ff;box-shadow:0 0 12px #76bde52b}
.dht-oldbeta .beta-browser-tabs button{background-image:none;background-color:#35586d}
.dht-oldbeta .beta-browser-tabs button[aria-selected=true],.dht-oldbeta .beta-browser-tabs button:focus{background-image:none;background-color:#6d93aa}
.dht-oldbeta .beta-web-tile>small{transition:color 140ms ease-out,background-color 160ms ease-out}
.dht-oldbeta .beta-daisy-group button{transition:background-color 120ms ease-out,color 120ms ease-out,scale 120ms ease-out,box-shadow 140ms ease-out}
.dht-oldbeta .beta-daisy-group button:focus{scale:1.08;box-shadow:0 0 7px #b5d7e44d}
.dht-oldbeta .beta-cover{transition:transform 190ms cubic-bezier(.22,.61,.36,1),width 190ms,height 190ms,opacity 180ms,box-shadow 160ms ease-out,outline-color 140ms ease-out,scale 160ms ease-out}
.dht-oldbeta:not([data-mode=sheet]) .beta-cover{outline:2px solid transparent;outline-offset:0}
.dht-oldbeta:not([data-mode=sheet]) .beta-cover[data-selected=true]{outline-color:#ecf9ff}
.dht-oldbeta[data-mode=games] .beta-cover{scale:1}
.dht-oldbeta[data-mode=games] .beta-cover[data-selected=true]{scale:1.025}
.dht-oldbigpicture[data-beta=true] :is(button,input,select){outline:2px solid transparent;outline-offset:1px;transition:color 140ms ease-out,background-color 160ms ease-out,border-color 160ms ease-out,outline-color 160ms ease-out,box-shadow 180ms ease-out,transform 170ms cubic-bezier(.22,.61,.36,1),translate 170ms ease-out}
.dht-oldbigpicture[data-beta=true] :is(button,input,select):focus{outline-color:#b8e8fa;box-shadow:0 0 15px #8ed8f44d}
.dht-oldbigpicture[data-beta=true] :is(.classic-panel,.settings-link,.classic-side button):focus{background-color:#387d9c;color:#effaff;translate:0 -1px}
.dht-oldbigpicture[data-beta=true] .game .label{transition:color 140ms,background-color 160ms}
.dht-menu--old-beta-big-picture .dht-menu-item{position:relative;isolation:isolate;background:#1c4c6570!important;transition:color var(--beta-focus-duration,160ms) ease-out,box-shadow var(--beta-focus-duration,160ms) ease-out,translate var(--beta-focus-duration,160ms) ease-out}
.dht-menu--old-beta-big-picture .dht-menu-item::before{content:'';position:absolute;inset:0;z-index:-1;pointer-events:none;background:linear-gradient(90deg,#b6e6f0,#6cb8d1);opacity:0;transition:opacity var(--beta-focus-duration,160ms) ease-out}
.dht-menu--old-beta-big-picture .dht-menu-item[data-selected=true]{translate:3px 0}
.dht-menu--old-beta-big-picture .dht-menu-item[data-selected=true]::before{opacity:1}
.dht-oldbeta.no-motion *,.dht-oldbigpicture[data-beta=true].no-motion *{transition:none!important}
@media(prefers-reduced-motion:reduce){.dht-oldbeta *,.dht-oldbigpicture[data-beta=true] *,.dht-menu--old-beta-big-picture .dht-menu-item,.dht-menu--old-beta-big-picture .dht-menu-item::before{transition:none!important}}
`;
