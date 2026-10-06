// Styles of the Aero theme (ChatGPT remake, ported as-is). Laid out on a 1280×960
// canvas that the theme scales to the screen.
export const AERO_CSS = `
.aero-desktop{position:absolute;width:1280px;height:800px;transform-origin:top left;overflow:hidden;background-color:#1f8eed;background-size:100% 150%;background-position:center top;font-family:"Trebuchet MS",Arial,sans-serif;color:white;--aero-lime:linear-gradient(180deg,#f3ffbb 0%,var(--dht-aero-lime,#c5f817) 43%,#99de00 49%,var(--dht-aero-lime-lo,#b0ed08) 85%,#e5ff8b);background-image:radial-gradient(ellipse at 80% 10%,#ffffff90,transparent 38%),linear-gradient(#0072ec,#7fd1ff 80%,#8bca30 81%,#4d9b17)}

.aero-desktop *{box-sizing:border-box}
.aero-desktop button{font:inherit;color:inherit;border:0;cursor:pointer;background:transparent;padding:0;position:relative;text-align:left}
.aero-desktop button:focus-visible{outline:3px solid #edff8b;outline-offset:2px}
.aero-desktop [data-focus=true]{box-shadow:0 0 0 2px #f6ffd2,0 0 0 4px #a9ea10,0 0 18px #d0ff57!important;z-index:2}
.aero-frame{position:absolute;inset:0;width:100%;height:100%;pointer-events:none}
.aero-header{position:absolute;inset:0 0 auto;height:111px;display:flex;align-items:center}
.aero-brand{position:absolute;left:26px;top:36px;display:flex;align-items:center;gap:14px}
.aero-brand strong{font-size:30px;font-style:italic;letter-spacing:-1px;text-shadow:0 2px 3px #003271}
.aero-brand sup{font-size:9px;vertical-align:top;line-height:25px}
.aero-tabs{position:absolute;left:393px;top:36px;height:66px;display:flex;gap:6px}
.aero-tabs button{width:130px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:0;font-size:18px;font-weight:bold;text-shadow:0 2px 2px #003276;border-radius:55% 55% 45% 45%}
.aero-tabs button[data-active=true]{background:var(--aero-lime);border:2px solid #e7ffb8;color:#073572;box-shadow:inset 0 0 0 3px #7ba944,0 0 0 2px #439bce,0 3px 6px #00396b;text-shadow:0 1px #f5ffb8}
.aero-status{position:absolute;left:1008px;right:22px;top:39px;display:flex;gap:12px;align-items:center;justify-content:flex-end;transform:rotate(-5deg);font-size:20px;font-weight:bold;white-space:nowrap}
.aero-battery{width:40px;height:23px;border:2px solid #e9faff;border-radius:5px;padding:2px;position:relative;flex-shrink:0}
.aero-battery:after{content:"";position:absolute;right:-5px;top:6px;width:3px;height:8px;background:white;border-radius:1px}
.aero-battery i{display:block;height:100%;background:var(--aero-lime);border-radius:2px}
.aero-sidebar{position:absolute;left:0;top:140px;width:238px;height:550px}
.aero-profile{height:88px;display:flex;align-items:center;gap:12px;padding-left:20px}
.aero-avatar{width:78px;height:78px;flex-shrink:0;border-radius:50%;background:var(--aero-lime);border:3px solid #edffc4;box-shadow:0 0 0 2px #0364b7,inset 0 0 0 3px #83b51c,0 3px 7px #003785;display:flex;align-items:center;justify-content:center;overflow:hidden}
.aero-avatar img{width:100%;height:100%;object-fit:cover}
.aero-profile strong{display:block;font-size:23px;font-style:italic;max-width:123px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.aero-profile small{font-size:14px}
.aero-profile span{display:flex;align-items:center;gap:6px;font-size:15px;margin-top:3px}
.aero-dot{display:inline-block;width:10px;height:10px;border-radius:50%;box-shadow:inset 1px 2px 2px #ffffffaa;flex-shrink:0}
.aero-sidebar nav{margin-top:6px;width:221px}
.aero-sidebar nav button{height:33px;display:flex;align-items:center;gap:16px;width:100%;padding-left:30px;font-size:18px;border-radius:30px;text-shadow:0 1px 2px #003981}
.aero-sidebar nav button[data-active=true]{background:var(--aero-lime);color:#07285b;text-shadow:0 1px #fff;font-weight:bold;border:2px solid #ecffc5;box-shadow:inset 0 0 0 2px #8cb336,0 0 0 2px #60b9ed}
.aero-sidebar nav button:nth-child(4),.aero-sidebar nav button:nth-child(8){margin-top:11px}
.aero-sidebar nav button:nth-child(4):before,.aero-sidebar nav button:nth-child(8):before{content:"";position:absolute;left:25px;right:14px;top:-6px;height:1px;background:#b2dcff80}
.aero-postcard{position:absolute;bottom:0;left:13px;width:211px;height:112px;border-radius:33px 26px 44px 34px;border:3px solid #c7efff;box-shadow:0 0 0 2px #237fd1,inset 0 2px 8px #fff;background-size:100% 100%;background-color:#8bd7fc;display:flex;align-items:center;justify-content:space-around;overflow:hidden}
.aero-postcard strong{color:#073980;transform:rotate(-8deg);font-style:italic;font-size:20px;text-shadow:0 1px 5px white,0 0 7px white;line-height:1.05}
.aero-hero{position:absolute;left:250px;top:159px;width:811px;height:300px;border-radius:43% 28% 7% 7% / 22% 22% 23% 23%;overflow:hidden;background:#063564;border:3px solid #d9f6ff;box-shadow:0 0 0 4px #6dbdf4,0 0 0 6px #d5f4ff99,0 7px 12px #034582aa}
.aero-hero:after{content:"";position:absolute;inset:0;border-radius:inherit;box-shadow:inset 0 3px 7px #fff8;pointer-events:none}
.aero-hero-logo{position:absolute;left:6%;top:25%;width:57%;height:36%;object-fit:contain;object-position:left center;filter:drop-shadow(0 3px 4px #0008);font-size:42px;font-style:italic;margin:0}
.aero-hero-footer{position:absolute;bottom:0;left:0;right:0;height:77px;background:linear-gradient(#071221bb,#071221f5);display:flex;align-items:center;padding:8px 24px;gap:23px;border-top:1px solid #9accff30}
.aero-play-group{display:flex;flex-shrink:0;width:243px;height:53px;border-radius:32px;background:var(--aero-lime);border:2px solid #f3ffd4;box-shadow:0 0 0 3px #8ab549,0 0 0 5px #5889b4,inset 0 2px 4px white;overflow:hidden;color:#082b63}
.aero-play-group button:first-child{display:flex;align-items:center;justify-content:center;gap:22px;flex:1;font-size:31px;color:#082b63}
.aero-play-group button:last-child{width:46px;text-align:center;font-size:27px;border-left:2px solid #7b9f35;color:#082b63}
.aero-play-group button[data-focus=true]{background:#fff5}
.aero-stat{font-family:Arial,sans-serif;min-width:104px;white-space:nowrap}
.aero-stat small{display:block;font-size:12px;color:#dce6f4;margin-bottom:5px}
.aero-stat b{font-size:16px}
.aero-ach{flex:1}
.aero-ach>div{display:flex;gap:9px;align-items:center}
.aero-ach i{display:block;width:72px;height:11px;border:2px solid #6998bb;border-radius:12px;overflow:hidden;background:#0005}
.aero-ach i i{height:100%;border:0;background:var(--aero-lime)}
.aero-continue{position:absolute;left:262px;top:475px;width:885px;height:208px;border-radius:40px;background:linear-gradient(135deg,#1376df9c,#62c2ff30 70%);border-top:2px solid #c4eeff;box-shadow:0 -3px 5px #005bb44a}
.aero-section-title{height:44px;display:flex;align-items:center;gap:10px;padding:0 15px;text-shadow:0 2px 3px #00519b}
.aero-section-title h2{font-size:25px;font-style:italic;margin:0}
.aero-section-title>button{margin-left:auto;margin-right:96px;padding:4px 13px;border:1px solid #c4eaff99;border-radius:20px;background:#0c5db644;font-size:14px}
.aero-section-title b{font-size:20px;margin-left:5px}
.aero-games{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:13px;padding:3px 9px}
.aero-desktop .aero-game{width:100%;min-width:0;text-align:center;border-radius:16px;padding:4px 4px 3px;align-self:start}
.aero-cover{height:146px;border-radius:11px;overflow:hidden;background:#054e9b;box-shadow:0 3px 5px #003c7380;border:1px solid #9bd5ff55}
.aero-game>span{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:14px;margin-top:6px;color:#06275a;text-shadow:0 1px 3px #ffffffaa}
.aero-game[data-selected=true]{background:var(--aero-lime);box-shadow:0 0 0 2px #eaffaf,0 0 0 4px #79c526,0 5px 12px #245d4170}
.aero-game[data-selected=true]>span{font-weight:bold}
.aero-rail{position:absolute;right:9px;top:123px;width:192px;padding:3px 0 6px;border-radius:57px 54px 42px 42px;background:linear-gradient(120deg,#a3e6ff9c,#3287e694);border:2px solid #c0eeff;box-shadow:0 0 0 3px #3b9fee99,inset 0 0 8px #f0fbff}
.aero-rail .aero-activity{display:flex;align-items:center;gap:11px;margin:4px 8px;width:172px;min-height:49px;padding:8px 10px;border-radius:20px;background:linear-gradient(#146bdbce,#0956bccc);border:1px solid #95d7ff99;box-shadow:inset 0 1px 2px #ffffff38}
.aero-activity>span{display:block;flex:1;min-width:0}
.aero-activity b{display:block;font-size:16px;font-weight:600;line-height:1.15}
.aero-activity small{display:flex;align-items:center;gap:5px;font-size:12px;margin-top:5px;color:#d4edff;white-space:nowrap}
.aero-activity em{font-style:normal;font-size:28px;color:#0750ac}
.aero-rail .aero-community{position:relative;inset:auto;margin:-3px -2px 9px;width:192px;min-height:66px;border-radius:50px;background:linear-gradient(#f2fcff,#c2e8ff 43%,#7fbdf3 53%,#cdefff);border:2px solid #ecfbff;color:#073681;gap:7px}
.aero-rail .aero-discover{margin:7px 0 -4px;width:188px;height:76px;border:2px solid #d9f5ff;border-radius:25px 30px 40px 40px;background-size:100% 100%;background-color:#b5ecff;color:#003785;text-shadow:0 0 5px white,0 0 3px white;align-items:flex-start;padding-top:13px;gap:8px}
.aero-discover b{font-size:16px;font-weight:bold}
.aero-footer{position:absolute;left:30px;right:30px;bottom:8px;height:50px;display:flex;align-items:center;gap:18px;font-size:18px}
.aero-footer>button{display:flex;gap:18px;align-items:center}
.aero-footer>i{height:25px;width:1px;background:#99c9fa}
.aero-hints{margin-left:auto;display:flex;align-items:center;gap:25px;font-size:15px}
.aero-hints>span,.aero-hints>button{display:flex;align-items:center;gap:10px}
.aero-hints b{border-radius:50%;width:28px;height:28px;display:flex;align-items:center;justify-content:center;background:linear-gradient(white,#d3eaff);color:#063c96;box-shadow:0 2px 3px #002565;font-size:19px}
.aero-library{position:absolute;left:257px;top:145px;width:793px;height:563px;padding:12px 17px;border-radius:38px;background:linear-gradient(135deg,#188bece8,#004bb5e8);border:2px solid #c1edff;box-shadow:0 0 0 4px #71c3fa77,0 5px 15px #003d6e66}
.aero-library .aero-section-title{padding:0 0 10px}
.aero-library .aero-section-title>span{margin-left:auto;font-size:15px}
.aero-grid{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:17px 12px;padding-top:6px}
.aero-grid .aero-cover{height:187px}
.aero-grid .aero-game>span{color:white;text-shadow:0 1px 2px #00327d}
.aero-grid .aero-game[data-selected=true]>span{color:#07366e;text-shadow:none}
.aero-empty{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:12px;font-size:19px}
.aero-empty strong{font-size:27px}
.aero-empty button{background:var(--aero-lime);padding:10px 20px;border-radius:20px;color:#083875}


/* Match the supplied 1280 × 960 composition before scaling to the display. */
.aero-desktop{height:960px;background-size:100% 155%;font-family:Arial,"Trebuchet MS",sans-serif}
.aero-brand{left:52px;top:51px;gap:17px}
.aero-brand strong{font-size:33px;letter-spacing:-.6px}
.aero-tabs{left:406px;top:45px;height:81px;gap:3px}
.aero-tabs button{width:118px;font-size:19px;gap:2px}
.aero-tabs button:first-child{width:146px;margin-right:0}
.aero-tabs button[data-active=true]{border-radius:52% 52% 46% 46%;box-shadow:inset 0 3px 5px #fff,inset 0 -3px 6px #77a81c,0 0 0 3px #64a1b6,0 3px 7px #00396b}
.aero-status{left:1018px;top:51px;right:33px;gap:13px;font-size:21px;transform:rotate(-6deg)}
.aero-sidebar{left:0;top:165px;width:260px;height:667px}
.aero-profile{height:99px;gap:12px;padding-left:23px}
.aero-avatar{width:86px;height:86px}
.aero-profile strong{font-size:25px;max-width:155px}
.aero-profile small{font-size:16px}
.aero-profile span{font-size:16px;margin-top:4px}
.aero-sidebar nav{margin-top:8px;width:239px}
.aero-sidebar nav button{height:43px;padding-left:32px;gap:17px;font-size:20px;font-weight:400}
.aero-sidebar nav button[data-active=true]{font-weight:700;box-shadow:inset 0 2px 5px white,inset 0 -4px 8px #99c43a,0 0 0 2px #66b5e7,0 2px 7px #145b97}
.aero-sidebar nav button:nth-child(4),.aero-sidebar nav button:nth-child(8){margin-top:18px}
.aero-sidebar nav button:nth-child(4):before,.aero-sidebar nav button:nth-child(8):before{top:-10px}
.aero-postcard{left:12px;bottom:3px;width:233px;height:136px;border-radius:35px 27px 57px 40px}
.aero-postcard strong{font-size:22px;line-height:1.06}
.aero-hero{left:242px;top:188px;width:829px;height:353px;border-radius:43% 29% 7% 7% / 24% 23% 25% 24%;border:3px solid #e3f6ff;box-shadow:0 0 0 4px #76c4f4,0 0 0 7px #c7eeff99,0 5px 12px #03518c99}
.aero-hero-logo{left:7%;top:29%;width:57%;height:32%}
.aero-hero-footer{height:79px;padding:8px 32px;gap:29px}
.aero-play-group{width:263px;height:57px}
.aero-play-group button:first-child{font-size:32px;gap:26px}
.aero-play-group button:last-child{width:53px}
.aero-stat{min-width:105px}
.aero-stat small{font-size:13px;font-weight:400;margin-bottom:5px}
.aero-stat b{font-size:17px}
.aero-ach>div{gap:10px}
.aero-ach i{width:102px;height:13px}
.aero-continue{left:250px;top:555px;width:902px;height:253px;border-radius:49px 49px 0 0;background:linear-gradient(160deg,#086ee0c4,#63c2ff22 80%);border-top:2px solid #bfeaff}
.aero-section-title{height:51px;padding:0 24px;gap:12px}
.aero-section-title h2{font-size:27px}
.aero-section-title>button{margin-right:82px;font-size:15px;padding:4px 13px}
.aero-games{gap:10px;padding:2px 17px}
.aero-cover{height:168px;border-radius:12px}
.aero-desktop .aero-game{padding:4px 4px 5px;border-radius:19px}
.aero-game>span{font-size:16px;margin-top:7px}
.aero-rail{right:3px;top:142px;width:210px;padding:3px 0 6px;border-radius:59px 58px 51px 55px;background:linear-gradient(120deg,#b1eaffb5,#3287e675);border:2px solid #c3eeff;box-shadow:0 0 0 3px #69b8f38c,inset 0 0 9px #e5faff}
.aero-rail .aero-activity{gap:13px;margin:0 9px;width:190px;min-height:67px;padding:10px 13px;border-radius:20px;background:linear-gradient(135deg,#0754c5d4,#115dbbd1);border:1px solid #addbff85;box-shadow:inset 0 1px 2px #ffffff25}
.aero-activity b{font-size:17px;font-weight:400}
.aero-activity small{font-size:14px;margin-top:6px}
.aero-rail .aero-community{margin:-3px -2px 12px;width:210px;min-height:77px;border-radius:50%;background:linear-gradient(155deg,#f5fcff,#b3dfff 45%,#91c7f6 60%,#d8f4ff);border:2px solid #e7f9ff;box-shadow:inset 0 2px 7px white,0 2px 3px #2b73b4;gap:9px}
.aero-community b{font-weight:bold}
.aero-rail .aero-discover{margin:0 0 -4px;width:206px;height:119px;border:2px solid #e5f6ff;border-radius:33px 40px 47px 50px;background-size:100% 100%;color:#063781;padding-top:19px;gap:8px;box-shadow:inset 0 2px 7px white,0 2px 3px #2b73b4}
.aero-discover b{font-size:17px;font-weight:bold}
.aero-footer{left:49px;right:41px;bottom:18px;height:50px;gap:18px;font-size:20px}
.aero-hints{gap:25px;font-size:16px}
.aero-hints b{width:29px;height:29px;font-size:20px}
.aero-library{left:258px;top:182px;width:795px;height:647px}
.aero-grid{row-gap:24px}
.aero-grid .aero-cover{height:221px}


.aero-tabs button[data-active=true]:before,.aero-play-group:before,.aero-sidebar nav button[data-active=true]:after{content:"";position:absolute;left:5%;right:5%;top:3px;height:44%;border-radius:50%;background:linear-gradient(#ffffff8c,#ffffff08);pointer-events:none}
.aero-play-group{position:relative}
.aero-rail .aero-activity:before{content:"";position:absolute;left:5%;right:5%;top:2px;height:32%;border-radius:50%;background:linear-gradient(#ffffff18,transparent);pointer-events:none}
.aero-avatar{box-shadow:0 0 0 2px #004ba0,inset 0 0 0 3px #83b51c,inset 4px 4px 8px #fff,0 4px 7px #003785}
`;
