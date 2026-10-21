/** Stock Wii U grid treatment; imported backgrounds retain their own presentation. */
export const WIIU_REFERENCE_CSS=`
.nt-home.nt-wiiu[data-view=grid]:not([data-theme-bg=true]){background:radial-gradient(ellipse at 38% 55%,#eaf3e7 0,#e1e9e5 45%,#f2f5f5 88%);color:#5e6466}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]):before{background:radial-gradient(ellipse at 15% 90%,#efffe9aa,transparent 50%),linear-gradient(135deg,#d1dbd533,transparent 70%);opacity:1}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile{border:7px solid #f7fffb88;border-radius:24px;overflow:visible;background:linear-gradient(135deg,#ffffff91,#dce6df52);box-shadow:inset 0 2px 4px #fff,0 1px 2px #fff,0 4px 10px #586a6070;--nt-inner-radius:15px}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile:after{inset:-6px;border:1px solid #fff9;border-radius:23px;background:linear-gradient(150deg,#fff7,transparent 26%,transparent 74%,#fff2);box-shadow:inset 0 0 4px #ffffffcc;mix-blend-mode:normal;opacity:1}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile[data-focus=true]{height:calc(100% + 22px);transform:translateY(-8px) scale(1.08);border:0;border-radius:23px;background:linear-gradient(#25cad7,#00aec4);box-shadow:inset 0 2px 4px #a4f4fa,0 1px 2px #1397a4,0 4px 10px #5c898d88;outline:none!important;z-index:5}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile[data-focus=true]:before,.nt-home.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile[data-focus=true]:after{display:none}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-empty{background:linear-gradient(145deg,#faffff55,#e4e9e533);border-color:#ffffff66;box-shadow:inset 0 1px 7px #fff8,0 3px 6px #677b6d33}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-empty[data-focus=true]:before{display:none}
.nt-wiiu .nt-tile-caption,.nt-wiiu .nt-tile-start,.nt-wiiu .nt-tile-tail{display:none}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile[data-focus=true] .nt-tile-tail{display:block;position:absolute;bottom:calc(100% + 8px);left:50%;transform:translateX(-50%);width:0;height:0;border-left:13px solid transparent;border-right:13px solid transparent;border-top:18px solid #f7faf5;z-index:8;pointer-events:none}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile[data-focus=true] .nt-tile-caption{display:block;position:absolute;bottom:calc(100% + 25px);left:50%;transform:translateX(-50%);min-width:150px;max-width:340px;padding:17px 25px;background:linear-gradient(#fffffff2,#f5f8f5e8);border:1px solid #fff;border-radius:22px;box-shadow:0 3px 12px #6d817944;color:#343839;font-size:27px;font-weight:400;line-height:1.2;white-space:nowrap;text-overflow:ellipsis;overflow:hidden;pointer-events:none;z-index:8;text-shadow:0 1px #fff}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile[data-focus=true] .nt-tile-start{display:block;position:absolute;bottom:1px;left:0;right:0;color:#f5ffff;font-size:23px;line-height:27px;text-shadow:0 2px 2px #166274,1px 0 #166274,-1px 0 #166274;pointer-events:none;z-index:3}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile[data-focus=true] .nt-wiiu-art-frame{inset:9px 9px 30px;border-radius:14px;clip-path:inset(0 round 14px);box-shadow:0 1px 2px #ffffffe6,0 -1px 3px #047b8e44}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile[data-focus=true][data-row="0"] .nt-tile-caption{bottom:auto;top:calc(100% + 21px)}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-tile[data-focus=true][data-row="0"] .nt-tile-tail{bottom:auto;top:calc(100% + 4px);border-top:0;border-bottom:18px solid #f7faf5}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-selected-name{visibility:hidden}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-arrow{background:linear-gradient(145deg,#fff 20%,#e9eeeb 49%,#d3dad5 50%,#fafff8);filter:drop-shadow(0 3px 3px #7c8a8077)}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-pages{z-index:6;pointer-events:none}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-pages button{background:#adb5b1;box-shadow:inset 0 1px 3px #69786d33}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-pages button[aria-current]{background:#06c0cf;box-shadow:inset 0 1px 2px #83ffff}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-user{top:38px}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-profile-image{background:linear-gradient(145deg,#edf5e9aa,#d2ddd29c);border:2px solid #fafff5;border-radius:13px;box-shadow:inset 0 2px 3px #fff,0 2px 6px #5b6d5c66}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-profile-image>img:first-child{object-fit:contain}
.nt-wiiu[data-view=grid]:not([data-theme-bg=true]) .nt-user>button>span:last-child{font-size:13px}
`;
