import {readFile,writeFile} from 'node:fs/promises';
import {launch} from '../tests/browser.mjs';
const out='out/protondb-previews',captures=JSON.parse(await readFile(`${out}/captures.json`,'utf8'));
const browser=await launch();
try {
 const page=await browser.newPage({viewport:{width:1600,height:1000},deviceScaleFactor:1});
 const cards=[];
 for(const c of captures){const screen=(await readFile(`${out}/${c.filename}`)).toString('base64'),badge=(await readFile(`${out}/${c.filename.replace('.png','-badge.png')}`)).toString('base64');cards.push(`<article><h2>${c.name}</h2><img class="screen" src="data:image/png;base64,${screen}"><img class="badge" src="data:image/png;base64,${badge}"></article>`);}
 const html=`<!doctype html><style>body{margin:0;padding:20px;background:#10141e;color:#eaf2ff;font:16px Arial}h1{font-size:28px;margin:0 0 8px}p{color:#b4c0d8;margin:0 0 18px}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px}article{padding:10px;background:#1c2536;border-radius:8px}h2{font-size:18px;margin:0 0 8px}.screen{width:100%;display:block}.badge{display:block;margin-top:8px;max-width:100%;height:28px;object-fit:contain;object-position:left}</style><h1>ProtonDB · ${captures.length} theme previews</h1><p>Per-theme Options toggle · detected plugin required · sample ratings</p><div class="grid">${cards.join('')}</div>`;
 await writeFile(`${out}/contact-sheet.html`,html);
 await page.setContent(html);await page.evaluate(()=>Promise.all([...document.images].map(i=>i.decode())));
 await page.screenshot({path:`${out}/contact-sheet.png`,fullPage:true});
 console.log(`Created ${captures.length}-theme contact sheet`);
}finally{await browser.close();}
