import { launch } from "../tests/browser.mjs";
import { mkdirSync, readdirSync, unlinkSync } from "node:fs";
import { startPreviewServer } from "../preview/server.mjs";
// Wii, Wii U and iiSU: Hub previews only (no firmware update prompt)
const bundled=["blue-glass","gameamp","gamecube","ios6","old-big-picture","santa-express","wiiflow-default"];
const hubOnly = ["wii","wiiu","iisu","onyx","silver","switch","n3ds","ps1",...bundled];
const allThemes = [...hubOnly, "vita","ps2","ps3","psp","ps4","ps5","xbox","x360","aero","aero2","dial","castle","republic","minecraft","pain","nazarick"];
const frameCount=Number(process.env.PREVIEW_FRAME_COUNT)||12;
const requested=process.env.PREVIEW_THEMES?.split(",");
const themes=requested?allThemes.filter(id=>requested.includes(id)):allThemes;
mkdirSync("out/theme-previews", { recursive: true });
const browser = await launch();
const { server, url } = await startPreviewServer();
try {
  const page = await browser.newPage({ viewport: { width: 1304, height: 930 }, reducedMotion: "no-preference" });
  page.setDefaultTimeout(60000);
  const errors = [];
  page.on("pageerror", e => { errors.push(String(e)); console.error(String(e)); });
  page.on("console", m => { if (m.type() === "error") console.error(m.text().slice(0, 400)); });
  await page.goto(url, { waitUntil: "load" });
  await page.locator("[data-dht-root]").waitFor();
  await page.waitForTimeout(800);
  for (const theme of themes) {
    await page.evaluate(({theme,isBundled}) => window.__updateTheme(s=>({ theme:isBundled?"frame":theme,activeTheme:isBundled?theme:"",animations:false,frameData:theme==="wiiflow-default"?{...s.frameData,[theme]:{...s.frameData[theme],backgroundFit:"fill",extendCoverflow:true,extendInterface:true}}:s.frameData })), {theme,isBundled:bundled.includes(theme)});
    if(bundled.includes(theme))await page.locator(`[data-react-theme="${theme}"]`).waitFor();
    await page.waitForTimeout(350);
    // A gallery image must show the home, never its startup or first-run dialog.
    for(const selector of ['.dht-console-startup','.dht-intro','.nt-boot']){
      const intro=page.locator(selector);if(await intro.count()){await intro.first().click();await intro.waitFor({state:'detached'});}
    }
    await page.evaluate(()=>Promise.race([document.fonts.ready,new Promise(r=>setTimeout(r,3000))]));
    await page.waitForTimeout(theme==="wiiflow-default"?1400:650);
    await page.evaluate(()=>window.__updateTheme({animations:true}));
    await page.waitForTimeout(250);
    const root = page.locator("[data-dht-root]");
    const bounds=await root.boundingBox();
    if(Math.abs(bounds.width/ bounds.height-1.6)>.01)throw Error(`${theme}: preview is not the full 16:10 home`);
    if(theme==="wiiflow-default")await page.waitForFunction(()=>{const s=document.querySelector('[data-react-theme]'),bg=s.querySelector('#wiiflow-background'),canvas=s.querySelector('#case-renderer');return bg&&getComputedStyle(bg).display==='block'&&canvas?.getBoundingClientRect().width>=document.querySelector('[data-react-theme]').clientWidth-1;});
    await page.screenshot({clip:bounds, path: `out/theme-previews/${theme}.png`, animations:"disabled" });
    const frames = `out/theme-previews/frames/${theme}`;
    mkdirSync(frames, { recursive: true });
    for(const file of readdirSync(frames))if(/^\d{2}\.png$/.test(file))unlinkSync(`${frames}/${file}`);
    for (let i = 0; i < frameCount; i++) {
      if (i === Math.floor(frameCount/3) || i === Math.floor(frameCount*2/3)) await page.keyboard.press("ArrowRight");
      await page.waitForTimeout(150);
      await page.screenshot({clip:bounds, path: `${frames}/${String(i).padStart(2,"0")}.png`, animations:"disabled" });
    }
    console.log(`Captured ${theme}`);
  }
  await page.getByRole("button", { name: "Hub", exact: true }).first().click();
  await page.locator(".dht-market").waitFor();
  await page.locator("[data-dht-root]").screenshot({ path: "out/theme-previews/marketplace.png" });
  await page.locator(".market-close").click();
  for (const theme of (process.argv.includes("--gallery-only")?[]:themes.filter(t => !hubOnly.includes(t)))) {
    await page.evaluate(theme => window.__updateTheme({ theme,activeTheme:"" }), theme);
    await page.getByRole("button", { name: "Preview firmware update", exact: true }).click();
    // the PSP look shows the PSP's own system-update dialog (.dht-psp-dialog) instead of the firmware card
    const psp = theme === "psp";
    await page.locator(psp ? ".dht-psp-dialog" : ".dht-firmware").waitFor();
    await page.locator("[data-dht-root]").screenshot({ path: `out/theme-previews/firmware-${theme}.png` });
    await page.locator(psp ? ".dht-psp-dialog .pd-buttons button" : ".fw-actions button").last().click();
  }
  if (errors.length) throw new Error([...new Set(errors)].join("\n"));
  console.log(`All ${themes.length} themes${process.argv.includes("--gallery-only")?"":" and 16 firmware prompts"} captured without page errors.`);
} finally { await browser.close(); server.close(); }
