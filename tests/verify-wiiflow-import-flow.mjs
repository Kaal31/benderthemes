import assert from 'node:assert/strict';import {launch} from './browser.mjs';import {startPreviewServer} from '../preview/server.mjs';import {readFileSync} from 'node:fs';
const {server,url}=await startPreviewServer(),browser=await launch();try{
 const p=await browser.newPage();await p.goto(url+'?theme=vita&still=1');await p.locator('[data-dht-root]').waitFor();
 const index=JSON.parse(readFileSync('py_modules/gbatemp_wiiflow_index.json','utf8')).items;
 await p.evaluate(items=>{window.__themeSourceBrowse=(kind,source,query,page)=>({kind,page,pages:Math.ceil(items.length/24),total:items.length,items:items.slice((page-1)*24,page*24),source:{id:source,name:'GBAtemp',url:'https://gbatemp.net',credit:'Fixture'}});window.__wiiflowScanResult={busy:false,imported:[],pending:1,errors:[]};},index);
 await p.getByRole('button',{name:'Hub (from this home)',exact:true}).click();await p.getByRole('tab',{name:'Theme files',exact:true}).click();
 await p.getByRole('tab',{name:'WiiFlow',exact:true}).click();await p.locator('.dht-files-card').first().waitFor();
 await p.locator('.dht-files-load-more').waitFor();assert.match(await p.locator('.dht-files-load-more').textContent(),/24 of/);for(let shown=24;shown<index.length;shown+=24){await p.locator('.dht-files-load-more').click();await p.waitForFunction(({count,more})=>document.querySelectorAll('.dht-files-card').length===count+(more?1:0),{count:Math.min(shown+24,index.length),more:shown+24<index.length});}
 await p.getByText('Waiting for the download to finish…',{exact:false}).waitFor();
 await p.evaluate(()=>{window.__wiiflowScanResult={busy:false,pending:0,errors:[],imported:[{id:'wiiflow-arrived',name:'Downloaded theme'}]};});
 await p.getByText(/Added Downloaded theme/).waitFor({timeout:6000});assert.equal(await p.locator('.dht-market').count(),1,'Import must not close the Hub');
 console.log('PASS WiiFlow next page, completed-download polling and import status without closing Hub');
}finally{await browser.close();server.closeAllConnections();server.close();}
