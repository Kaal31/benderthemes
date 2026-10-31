import {chromium} from 'playwright';
import {writeFileSync} from 'node:fs';
const rows=[['nxe','NXE','x360','nxe'],['blades','Blades','x360','blades'],['kinect','Kinect NXE','x360','kinect'],['metro','Metro','x360','metro'],['xbox','Original Xbox','xbox','metro'],['ps3','PS3 XMB','ps3','metro']];
const browser=await chromium.launch({channel:'msedge',headless:true});
try{const page=await browser.newPage({viewport:{width:1280,height:900}});for(const [id,title,theme,style] of rows){
 await page.goto(`http://127.0.0.1:8911/preview/x360-original-icons.html?theme=${theme}&xs=${style}&consoleArt=1&still=1&avatarBridge=http%3A%2F%2F127.0.0.1%3A62883`);await page.waitForTimeout(4300);
 const surface=page.locator('div[style*="translateZ"]').first();
 await surface.screenshot({path:`preview/artwork-comparison/${id}-original.png`});
 await page.evaluate(()=>window.__updateTheme({originalConsoleArtwork:false}));await page.waitForTimeout(650);
 await surface.screenshot({path:`preview/artwork-comparison/${id}-fallback.png`});
 console.log('Captured',title);
}writeFileSync('preview/artwork-comparison/screens.json',JSON.stringify(rows.map(([id,label,theme,style])=>({id,label,theme,style})),null,2));}finally{await browser.close();}
