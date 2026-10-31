// Coordinates follow the 1280x720 Wii video, centered in the 1280x800 stage.
export const WII_MANAGEMENT_CSS=`
.wii-classic-system{inset:40px 0;background:linear-gradient(#080808,#000 75%,#292929);color:#555;box-shadow:0 0 0 100vmax #000;font-family:Arial,sans-serif}
.wii-classic-system>header{height:106px;min-height:106px;padding:0 53px;position:relative;border:0;background:transparent;align-items:flex-end}
.wii-classic-system>header h1{height:54px;min-width:454px;display:flex;align-items:center;gap:14px;padding:0 18px;background:#fff;border-radius:12px 40px 0 0;font-size:36px;color:#555;line-height:1}
.wii-classic-system>header small{position:absolute;right:86px;bottom:0;color:white;font-size:56px;letter-spacing:-4px;font-weight:bold}
.wii-classic-system .wii-system-content{padding:0;overflow:hidden;background:repeating-linear-gradient(#272727 0 2px,#484848 2px 3px,#252525 3px 5px);border-top:4px solid #fff;border-bottom:4px solid #fff;position:relative;flex:1}
.wii-classic-system>footer{height:146px;min-height:146px;padding:20px 128px;background:transparent;border:0;align-items:flex-start;gap:40px;color:white}
.wii-classic-system>footer button{width:324px;min-width:324px;height:88px;min-height:88px;border-radius:46px;font-size:42px;font-weight:400;line-height:1;padding:0;color:#555;border:2px solid #c4d4dc;background:linear-gradient(#fff 0%,#fff 35%,#eff8fc 63%,#d5e2eb 90%,#a5b5c0 100%);box-shadow:inset 0 2px 4px white,0 2px 5px #0007}
.wii-classic-system>footer small{font-size:30px;padding-top:22px;color:white}
.wii-classic-choices{height:100%;display:flex;align-items:center;justify-content:space-between;padding:0 159px 0 163px;transform:translateY(12px)}
.wii-classic-choices button{width:383px;height:308px;padding:8px;display:flex;flex-direction:column;align-items:stretch;border-radius:12px;border:3px solid #eee;background:#fcffff;box-shadow:inset 0 0 0 3px #80d7ed,inset 0 0 7px 7px #d2f5fc;gap:0;position:relative;min-height:0}
.wii-classic-choices button>svg{width:100%;height:212px;flex:none;display:block;border-radius:5px}
.wii-classic-choices button>span{flex:1;display:flex;align-items:center;justify-content:center;font-size:34px;color:#777}
.wii-classic-choices button:hover,.wii-classic-choices button:focus-visible{outline:0;border-color:#c7f6ff;box-shadow:inset 0 0 0 4px #3ed1ee,0 0 9px #87dff077}
.wii-management-page>header{display:none}.wii-management-page>footer small{font-size:36px;margin-right:94px;white-space:nowrap}
.wii-management-page .wii-system-content{border:0;background:none;flex:none;height:574px;padding:0}
.wii-management-tabs{height:106px;position:relative;display:flex;align-items:flex-end;padding-left:104px}
.wii-management-tabs>span{position:relative;height:54px;min-width:248px;padding:0 20px 0 13px;display:flex;align-items:center;gap:8px;border-radius:14px 42px 0 0;background:#fff;color:#555;font-size:35px}
.wii-management-breadcrumb{position:absolute;left:-49px;bottom:0;width:62px;height:42px;z-index:-1}.wii-management-device{flex:none;transform:rotate(-2deg)}
.wii-management-tabs button{position:absolute;bottom:0;left:594px;width:274px;height:82px;min-height:0;padding:0;border-radius:22px 22px 0 0;border:3px solid #aaa;background:linear-gradient(#505050,#090909 32%,#101010);box-shadow:inset 0 3px 3px #eee9,inset 0 0 0 4px #555;color:#aaa;font-size:42px}
.wii-management-tabs button:last-child{left:905px;width:247px;height:76px;font-size:40px}
.wii-management-tabs button[aria-pressed=true]{color:#fff;border-color:#eee;box-shadow:inset 0 3px 6px 2px white;background:repeating-linear-gradient(#c5c5c5 0 1px,#b7b7b7 1px 3px)}
.wii-management-grid{height:468px;display:grid;grid-template-columns:repeat(5,120px);grid-template-rows:repeat(3,120px);column-gap:80px;row-gap:25px;padding:24px 180px 26px;border-top:4px solid #eee;border-bottom:4px solid #eee;background:repeating-linear-gradient(#c4c4c4 0 2px,#d6d6d6 2px 3px,#b7b7b7 3px 5px)}
.wii-management-page .wii-management-grid button{position:relative;min-height:0;width:120px;height:120px;padding:18px;border-radius:14px;border:0;background:linear-gradient(135deg,#fff6,transparent 45%,#6663),repeating-linear-gradient(#bdbebe 0 2px,#d0d0d0 2px 3px,#b6b7b7 3px 5px);box-shadow:inset 4px 4px 5px #ffffffb0,inset -4px -5px 5px #7778,3px 5px 4px #7776,0 0 1px 2px #c8c8c8}
.wii-management-grid img{width:80px;height:80px;display:block;object-fit:cover;border-radius:3px;box-shadow:1px 2px 2px #7775}
.wii-management-grid img[data-icon=true]{object-fit:contain;box-shadow:none}
.wii-management-grid button:disabled{opacity:1;cursor:default}
.wii-management-page .wii-management-grid button:hover,.wii-management-page .wii-management-grid button:focus-visible{outline:0;color:inherit;box-shadow:inset 4px 4px 5px #ffffffb0,inset -4px -5px 5px #7778,3px 5px 4px #7776,0 0 1px 2px #c8c8c8}
.wii-management-grid span{display:none;position:absolute;z-index:5;top:calc(100% - 3px);left:50%;transform:translateX(-50%);white-space:nowrap;background:linear-gradient(#fff,#f7f7f7);color:#555;padding:8px 28px;border-radius:40px;box-shadow:0 3px 6px #5556;font-size:33px;line-height:1.3;max-width:500px;overflow:hidden;text-overflow:ellipsis;pointer-events:none}
.wii-management-grid button:hover span,.wii-management-grid button:focus-visible span{display:block}
.wii-management-page .wii-management-arrow{position:absolute;top:291px;border:0;background:none;box-shadow:none;padding:0;min-height:0;min-width:0;width:48px;height:76px}
.wii-management-arrow.prev{left:36px}.wii-management-arrow.next{right:36px}.wii-management-arrow:disabled{visibility:visible;opacity:.24;cursor:default}
.wii-management-empty{position:absolute;top:250px;left:23%;right:23%;padding:22px;border-radius:18px;background:#f6f6f6eb;box-shadow:0 4px 12px #5555;text-align:center;font-size:23px}
.wii-classic-system .wii-system-feedback{bottom:150px;background:#fff;color:#555}

.wii-settings-page>header h1{min-width:575px;font-size:34px}.wii-settings-page>header small{font-size:21px;letter-spacing:0;bottom:10px;right:75px;font-weight:400;color:#b7b7b7}
.wii-settings-rows{height:100%;display:flex;flex-direction:column;justify-content:center;gap:22px;padding:0 250px}.wii-settings-rows>button{width:100%;height:78px;min-height:78px;padding:0 22px;font-size:34px;font-weight:400;color:#666;border:3px solid #b7b7b7;border-radius:8px;background:linear-gradient(#fff 0%,#eee 20%,#fafafa 45%,#f5f5f5 70%,#c7c7c7 100%);box-shadow:inset 0 0 0 3px #eee,inset 0 0 0 5px #d3d3d3,0 2px 5px #0009;text-shadow:0 1px white}
.wii-settings-rows>button:hover,.wii-settings-rows>button:focus-visible{border-color:#69d5ea;outline:0;box-shadow:inset 0 0 0 3px #f6ffff,inset 0 0 0 5px #8cdeed,0 0 8px #6de6ff99}
.wii-settings-page .wii-settings-arrow{position:absolute;top:192px;width:58px;height:84px;min-width:0;min-height:0;border:0;padding:0;background:none;box-shadow:none}.wii-settings-arrow.prev{left:115px}.wii-settings-arrow.next{right:115px}.wii-settings-arrow:disabled{visibility:hidden}
.wii-settings-pages{display:flex;gap:10px;margin-left:auto;padding:22px 0}.wii-settings-page>footer .wii-settings-pages button{width:47px;min-width:47px;height:45px;min-height:45px;padding:0;border:2px solid #aaa;border-radius:5px;font-size:25px;color:#777;background:linear-gradient(#ddd,#c6c6c6);box-shadow:inset 0 0 0 2px #eee}.wii-settings-page>footer .wii-settings-pages button[aria-current=page]{color:#444;background:#fff;border-color:#fff;box-shadow:0 0 0 1px #aaa}
.wii-settings-detail{height:100%;padding:48px 160px;color:#eee;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center}.wii-settings-detail h2{font-size:34px;color:white;margin:0 0 24px;font-weight:400}.wii-settings-detail p{font-size:25px;color:#d9d9d9;line-height:1.6;margin:0 0 28px;max-width:820px}.wii-settings-detail button{min-width:390px;min-height:72px;border-radius:8px;border:3px solid #b8d4dc;background:linear-gradient(#fff,#ddd);font-size:28px;color:#666;box-shadow:inset 0 0 0 3px #fff}

.wii-management-grid button:nth-child(n+11)>span{top:auto;bottom:calc(100% + 7px)}
.wii-sd-empty{position:absolute;z-index:3;top:25%;left:25%;right:25%;padding:28px 35px;background:#eef4f5f2;border:3px solid #9ed6e4;border-radius:18px;box-shadow:0 5px 15px #0006;color:#607681;text-align:center}.wii-sd-empty h2{font-size:29px}.wii-sd-empty p{font-size:23px}.wii-sd-empty button{font-size:23px;min-height:60px;padding:10px 24px}.wii-sd-page .wii-sd-arrow{display:grid;place-items:center}.wii-sd-page .wii-sd-arrow:disabled{opacity:.24}
`;
