export const OLD_BETA_PAGE_CSS=`
.dht-oldbeta .beta-home-scene{position:absolute;inset:0}
.dht-oldbeta .beta-home-scene[inert] *{animation-play-state:paused!important}
.dht-oldbeta[data-mode=games] .beta-categories{visibility:hidden}
.dht-oldbeta .beta-games-toolbar h1{font-size:calc(var(--beta-w)*.022)}
.dht-oldbeta .beta-side-page{position:absolute;inset:0;z-index:20;background:radial-gradient(ellipse at 95% 0%,#294556,#0a1b25 65%,#07151c);font-size:calc(var(--beta-w)*.013);color:#c7d9e2;overflow:hidden}
.dht-oldbeta .beta-side-page button{color:inherit;border:0;border-radius:0;background:none;padding:0}
.dht-oldbeta .beta-side-page button:focus{outline:none}
.dht-oldbeta .beta-side-page footer{bottom:3%;left:3%;right:3%;font-size:calc(var(--beta-w)*.01)}
.dht-oldbeta .beta-side-page footer>span{display:flex;gap:15px;align-items:center}
.dht-oldbeta .beta-side-page footer button:focus{color:#fff;text-shadow:0 0 8px #97c9e9}
.dht-oldbeta .beta-friends-left{position:absolute;left:2%;top:4%;width:47%;bottom:9%;border-right:2px solid #385465}
.dht-oldbeta .beta-chat-user{position:relative;display:flex;gap:10px;align-items:center;height:10%;border-bottom:2px solid #426577;padding:0 10px 8px 0}
.dht-oldbeta .beta-chat-user>img{width:40px;height:40px;object-fit:cover}.dht-oldbeta .beta-chat-user small{display:block;font-size:.8em}
.dht-oldbeta .beta-chat-user nav{display:flex;gap:5px;margin-left:auto;align-self:end}
.dht-oldbeta .beta-chat-user nav button{background:linear-gradient(#5a8298,#29495b);padding:7px;font-size:.8em}
.dht-oldbeta .beta-chat-user nav button[aria-pressed=false]{opacity:.5}
.dht-oldbeta .beta-friend-list{height:90%;overflow:auto;scrollbar-width:thin;padding-right:6px}
.dht-oldbeta .beta-friend-row{display:flex;align-items:center;gap:9px;width:100%;height:calc(var(--beta-h)*.095);text-align:left;padding:5px!important;color:#a9c27f!important;border:2px solid transparent!important}
.dht-oldbeta .beta-friend-row small{display:block;font-size:.72em;line-height:1.1}.dht-oldbeta .beta-friend-row:focus,.dht-oldbeta .beta-friend-row[aria-pressed=true]{background:#a3b0b3!important;border-color:#d2e6f0!important;color:#57762d!important}
.dht-oldbeta .beta-chat-avatar{position:relative;display:grid;place-items:center;flex:none;width:calc(var(--beta-w)*.044);aspect-ratio:1;background:#234655;border:2px solid #85a866;color:#adc4cf;font-size:1.4em;overflow:hidden}
.dht-oldbeta .beta-chat-avatar img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}.dht-oldbeta .beta-chat-avatar img[hidden]{display:none}
.dht-oldbeta .beta-chat-right{position:absolute;left:50%;top:4%;right:3%;bottom:9%;display:flex;flex-direction:column}
.dht-oldbeta .beta-chat-right header{height:10%;display:flex;align-items:center;gap:10px;padding-bottom:7px}.dht-oldbeta .beta-chat-right header strong{font-weight:600}
.dht-oldbeta .beta-conversation{flex:1;background:#071924b8;padding:8px}.dht-oldbeta .beta-conversation>small{font-size:.7em;color:#34505d}
.dht-oldbeta .beta-chat-entry{display:flex;height:8%;gap:5px;margin-top:5px}.dht-oldbeta .beta-chat-entry button{background:linear-gradient(#294b60,#132e3e);border:2px solid #3b5b6e;padding:6px;font-size:.8em}.dht-oldbeta .beta-chat-entry button:focus{border-color:#d4e9f2}.dht-oldbeta .beta-chat-compose-button{flex:1;text-align:left;overflow:hidden}.dht-oldbeta .beta-steam-groups{padding:20px!important}
.dht-oldbeta .beta-browser-menu{position:absolute;inset:0 0 10%;transform-origin:50% 10%}
.dht-oldbeta .beta-browser-tabs{height:6%;display:flex;justify-content:center;gap:8px;align-items:end;background:#07172280}
.dht-oldbeta .beta-browser-tabs button{width:10%;height:85%;background:linear-gradient(#5a7c90,#28485a);color:#0b2533;font-size:.9em}
.dht-oldbeta .beta-browser-tabs button[aria-selected=true],.dht-oldbeta .beta-browser-tabs button:focus{background:linear-gradient(#91acbc,#456b83);color:#e1eef6}
.dht-oldbeta .beta-favorites-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-auto-rows:calc(var(--beta-h)*.35);gap:calc(var(--beta-h)*.03) calc(var(--beta-w)*.015);padding:2.5% 5%;background:linear-gradient(#365a70aa,transparent)}
.dht-oldbeta .beta-web-tile{position:relative;display:flex;flex-direction:column;border:3px solid #355a70!important;background:linear-gradient(135deg,#102c38,#04121b)!important;transition:transform 140ms,outline-color 140ms;min-width:0}
.dht-oldbeta .beta-web-tile svg{position:absolute;inset:0;width:100%;height:92%;color:#6b8a9370;opacity:.5}
.dht-oldbeta .beta-web-tile>span{position:relative;flex:1;display:grid;place-items:center;font-weight:300;font-size:calc(var(--beta-w)*.028);color:#a3b5bc}
.dht-oldbeta .beta-web-tile>small{position:relative;display:block;background:#263640;color:#a4b9c3;font-size:.65em;line-height:1.5}
.dht-oldbeta .beta-web-tile:focus{z-index:2;transform:scale(1.065);border-color:#d2e8f1!important;box-shadow:0 0 9px #d3eef5a0}.dht-oldbeta .beta-web-tile:focus>small{background:#d5e1e7;color:#344e5e}
.dht-oldbeta .beta-browser-empty{grid-column:1/-1;text-align:center;padding:10%}
.dht-oldbeta .beta-browser-page{position:absolute;inset:0 0 10%;animation:beta-browser-arrive 320ms cubic-bezier(.22,.61,.36,1)}
@keyframes beta-browser-arrive{from{transform:perspective(1200px) rotateX(-12deg) scale(1.12);opacity:0}to{transform:none;opacity:1}}
.dht-oldbeta .beta-browser-address{display:flex;gap:10px;height:7%;padding:5px 5%;background:#0c1d26}.dht-oldbeta .beta-browser-address input{flex:1;min-width:0;border:2px solid #3d5260;background:#1b303f;color:#d1e3ec;padding:4px}.dht-oldbeta .beta-browser-address button{padding:4px;background:#294a5e;font-size:.8em}
.dht-oldbeta .beta-browser-handoff{padding:12% 10%;background:linear-gradient(#31566d,#0a1b25);height:93%}.dht-oldbeta .beta-browser-handoff h1{font-weight:300}.dht-oldbeta .beta-browser-handoff button{padding:12px 20px;background:#294b60;margin-right:15px}.dht-oldbeta .beta-browser-handoff button:focus{background:#b8d2df;color:#234355}
.dht-oldbeta .beta-page-error{position:absolute;bottom:10%;left:5%;color:#f6c6b4}
.dht-oldbeta .beta-keyboard-overlay{position:absolute;inset:0;z-index:40;background:linear-gradient(#244354e8,#132c3be8 75%,#0a1c28);animation:beta-controls-reveal 170ms}
.dht-oldbeta .beta-keyboard-text{position:absolute;left:26%;right:7%;top:1%;height:5%;padding:5px 9px;background:#193040;border:2px solid #41596a;color:#d5e3eb;font-size:calc(var(--beta-w)*.015)}
.dht-oldbeta .beta-daisy{position:absolute;left:5%;top:9%;width:min(38%,calc(var(--beta-h)*.64));aspect-ratio:1;border-radius:50%;background:#122b3ce8;box-shadow:inset 0 0 45px #1b3b4b}
.dht-oldbeta .beta-daisy-group{position:absolute;width:25%;height:25%;transform:translate(-50%,-50%);border-radius:35%;background:#1c3b4c;transition:background 90ms}
.dht-oldbeta .beta-daisy-group[data-selected=true]{background:#426b81;box-shadow:0 0 12px #76a7c050}
.dht-oldbeta .beta-daisy-group button{position:absolute;width:40%;height:40%;font-size:calc(var(--beta-w)*.017);color:#bdcdd5;font-weight:600}
.dht-oldbeta .beta-daisy-group button:nth-child(1){left:0;top:30%}.dht-oldbeta .beta-daisy-group button:nth-child(2){left:30%;top:0}.dht-oldbeta .beta-daisy-group button:nth-child(3){right:0;top:30%}.dht-oldbeta .beta-daisy-group button:nth-child(4){left:30%;bottom:0}
.dht-oldbeta .beta-daisy-group button:hover,.dht-oldbeta .beta-daisy-group button:focus{background:#5f889e;color:#fff;outline:1px solid #bddcec}
.dht-oldbeta .beta-daisy-stick{position:absolute;left:41%;top:41%;width:18%;height:18%;border-radius:50%!important;border:3px solid #111d25!important;background:radial-gradient(circle at 40% 35%,#80888c,#3c484f)!important;box-shadow:0 3px 4px #0008,inset 0 0 3px #b3bcc1;font-size:calc(var(--beta-w)*.018)}
.dht-oldbeta .beta-keyboard-hints{position:absolute;left:3%;top:74%;width:44%;display:grid;grid-template-columns:repeat(3,1fr);gap:18px 9px;font-size:calc(var(--beta-w)*.009);align-items:center;color:#94aab7}
.dht-oldbeta .beta-keyboard-hints b,.dht-oldbeta .beta-keyboard-done b{display:inline-block;border:1px solid #7894a3;border-radius:4px;padding:2px 6px;box-shadow:0 0 4px #b5d6e34d}
.dht-oldbeta .beta-keyboard-done{position:absolute;top:89%;left:17%;display:flex;gap:25px;font-size:calc(var(--beta-w)*.012)}
.dht-oldbeta .beta-keyboard-done button:first-child{color:#9cbb62}
.dht-oldbeta .beta-recent-label{left:50%;top:42%;width:calc(var(--beta-w)*.21);text-align:center;transition:transform 190ms cubic-bezier(.22,.61,.36,1);font-size:calc(var(--beta-w)*.025)}
.dht-oldbeta .beta-collection-picker{position:relative;margin-right:17%;min-width:25%;font-size:calc(var(--beta-w)*.014)}
.dht-oldbeta .beta-collection-picker>button{width:100%;text-align:left;padding:6px 12px;background:linear-gradient(#6793aa,#3b647b);color:#daeaf1}.dht-oldbeta .beta-collection-picker>button:focus{outline:2px solid #d2e7f2}
.dht-oldbeta .beta-collection-options{max-height:calc(var(--beta-h)*.4);overflow:auto;position:absolute;top:100%;left:0;right:0;z-index:12;padding:4px;background:#24475b;border:1px solid #8cabbc;box-shadow:0 5px 14px #00132190}
.dht-oldbeta .beta-collection-options button{display:block;width:100%;text-align:left;padding:6px 10px;color:#cfe2eb}.dht-oldbeta .beta-collection-options button[aria-selected=true]{background:#c2d9e5;color:#234358}
`;
