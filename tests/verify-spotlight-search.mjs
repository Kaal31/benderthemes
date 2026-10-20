// Plugin Spotlight search: merge/dedupe/ranking (pure functions) and the Hub UI with the small preview fixture
// (preview/stubs/api.ts PLUGIN_CATALOG_FIXTURE). Build the preview first: PYTHON=python3 node preview/build.mjs
import {build} from 'esbuild';
import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
import {startPreviewServer} from '../preview/server.mjs';

// ---- pure functions
const bundled=await build({stdin:{contents:'export * from "./src/pluginSearch";export {SPOTLIGHT_PLUGINS} from "./src/spotlightCatalog";',resolveDir:process.cwd(),loader:'ts'},bundle:true,write:false,platform:'node',format:'esm'});
const S=await import('data:text/javascript;base64,'+Buffer.from(bundled.outputFiles[0].text).toString('base64'));
for(const u of ['https://github.com/Owner/Repo','https://www.github.com/owner/repo.git/','http://github.com/OWNER/repo/tree/main/sub','github.com/owner/repo#readme','owner/repo','https://github.com/owner/repo/releases/download/v1/x.zip'])assert.equal(S.repoKey(u),'owner/repo',u);
for(const u of ['https://gitlab.com/owner/repo','https://github.com/owner','',null])assert.equal(S.repoKey(u),'');
const row=(repo,name,author,more={})=>({repo,url:`https://github.com/${repo}`,name,author,description:'',tags:[],image:'',stars:0,downloads:0,archived:false,root:false,readme:'',readmeUrl:'',release:'',released:'',...more});
const picks=[{id:'a',name:'Alpha',author:'Ann',description:'Our words.',whyFeatured:'Why.',projectUrl:'https://github.com/Ann/Alpha',install:{pluginName:'Alpha',version:'1.0.0',zipUrl:'https://github.com/Ann/Alpha/releases/download/1.0/a.zip'}},
  {id:'b',name:'Beta',author:'Bo',description:'Beta words.',whyFeatured:'',projectUrl:'https://github.com/bo/beta/tree/main'}];
const merged=S.mergeCatalogue(picks,[
  row('ann/alpha','Alpha (explorer)','someone',{url:'https://www.github.com/ANN/Alpha.git/',stars:50,tags:['x'],readme:'Readme text',root:true,description:'Their words.'}),
  row('Ann/Alpha','Alpha again','Ann',{url:'http://github.com/Ann/Alpha/tree/dev'}), // third spelling: ignored
  row('Bo/Beta','Beta','Bo',{archived:true}),
  row('fork/beta','Beta','bo',{stars:1}), // same name + author, other repo: fork, kept
  row('zed/gamma','Gamma','Zed',{zipUrl:'https://github.com/zed/gamma/releases/download/v1/g.zip'}),
],['gamma']);
assert.deepEqual(merged.map(i=>i.id),['pick:a','pick:b','explorer:fork/beta','explorer:zed/gamma']);
const [alpha,beta,fork,gamma]=merged;
assert.equal(alpha.description,'Our words.');assert.equal(alpha.name,'Alpha');assert.equal(alpha.source,'spotlight');
assert.equal(alpha.stars,50);assert.equal(alpha.root,true);assert.equal(alpha.readme,'Readme text');assert.equal(alpha.zipUrl,undefined,'picks keep their own installer');
assert.equal(beta.archived,true);assert.equal(fork.forkOf,'bo/beta');assert.equal(gamma.installed,true);
// the real catalogue's picks: every pick has a repository key
for(const p of S.SPOTLIGHT_PLUGINS)assert.ok(S.repoKey(p.projectUrl),p.projectUrl);
// ranking: name > tags/author > description > README; picks with a real match first; archived after
const items=S.mergeCatalogue([],[row('a/one','Tuner','x',{stars:1}),row('a/two','Other','x',{readme:'a tuner in the readme',stars:900}),row('a/three','Thing','x',{tags:['tuner']}),row('a/four','Tuner Old','x',{archived:true}),row('a/five','Desc','x',{description:'A tuner for audio'})]);
assert.deepEqual(S.searchCatalogue(items,'tuner').map(r=>r.item.name),['Tuner','Tuner Old','Thing','Desc','Other']);
assert.deepEqual(S.searchCatalogue(items,'tuner audio').map(r=>r.item.name),['Desc'],'every word must match');

// ---- UI in the preview
const {server,url}=await startPreviewServer();const b=await launch();
try{
 const p=await b.newPage({viewport:{width:1304,height:930}});await p.goto(url);
 await p.getByRole('button',{name:'Hub',exact:true}).first().click();
 await p.getByRole('tab',{name:'Plugin Spotlight',exact:true}).click();
 const results=p.locator('.dht-spotlight-result');await results.first().waitFor();
 assert.equal(await results.count(),40,'without a query only our picks');
 assert.match(await p.locator('.dht-spotlight-attribution').innerText(),/Decky Plugins Explorer by safetzahirovic/);
 const names=async()=>results.evaluateAll(els=>els.map(e=>e.querySelector('strong').textContent));
 const search=p.locator('.dht-spotlight-search input');
 // controller: ↑ from the first result reaches the search box, A focuses it
 await p.keyboard.press('ArrowUp');await p.locator('.dht-spotlight-search[data-focused=true]').waitFor();
 await p.keyboard.press('Enter');assert.equal(await search.evaluate(e=>document.activeElement===e),true);
 await p.keyboard.type('tuner');// typing letters (e, r) must not reach the Hub's buttons (R1 = e)
 assert.equal(await p.locator('.dht-spotlight').count(),1);
 await p.waitForFunction(()=>document.querySelectorAll('.dht-spotlight-result').length===4);
 assert.deepEqual(await names(),['Sound Tuner','Sound Tuner','Tuner Classic','Music Visualizer']);
 const badges=async i=>results.nth(i).locator('.dht-spotlight-badge').allInnerTexts();
 assert.deepEqual(await badges(0),['Not in the store (unreviewed)','✓ Installed','Needs root','★ 85']);
 assert.ok((await badges(1)).includes('Fork of aurora-dev/sound-tuner'));
 assert.ok((await badges(2)).includes('Archived'));
 await p.keyboard.press('ArrowDown');// leaves the box for the list
 assert.equal(await search.evaluate(e=>document.activeElement===e),false);
 // detail: README excerpt is text only
 const detail=p.locator('.dht-spotlight-detail');
 await detail.locator('h3',{hasText:'Sound Tuner'}).waitFor();
 assert.equal(await detail.locator('.dht-spotlight-readme script, .dht-spotlight-readme img').count(),0);
 assert.equal(await p.evaluate(()=>window.__xss),undefined);
 assert.match(await detail.locator('.dht-spotlight-readme').innerText(),/Shape your game audio/);
 assert.match(await detail.locator('.dht-spotlight-facts').innerText(),/audio, equalizer/);
 await p.locator('[data-dht-root]').screenshot({path:'out/theme-previews/spotlight-search.png'});
 // unreviewed + root: two confirmations before anything is installed
 const status=p.getByRole('status').filter({hasText:'Preview: Decky'});
 assert.match(await detail.locator('.dht-spotlight-primary').innerText(),/View project/);
 await detail.locator('.dht-spotlight-install-unreviewed').click();
 await detail.locator('.dht-spotlight-confirm',{hasText:'without a review'}).waitFor();assert.equal(await status.count(),0);
 await p.keyboard.press('b');// B cancels the confirmation, the Hub stays open
 assert.equal(await detail.locator('.dht-spotlight-confirm').count(),0);assert.equal(await p.locator('.dht-spotlight').count(),1);
 await p.keyboard.press('m');// ☰ starts it from the controller
 await detail.locator('.dht-spotlight-confirm-yes').click();
 await detail.locator('.dht-spotlight-confirm',{hasText:'runs as root'}).waitFor();assert.equal(await status.count(),0);
 await p.locator('[data-dht-root]').screenshot({path:'out/theme-previews/spotlight-confirm.png'});
 await detail.locator('.dht-spotlight-confirm-yes').click();await status.waitFor();
 // archived entry with no release ZIP: no install button at all
 await results.nth(2).click();await detail.locator('h3',{hasText:'Tuner Classic'}).waitFor();
 assert.equal(await detail.locator('.dht-spotlight-install-unreviewed, .dht-spotlight-confirm').count(),0);
 // dedupe: our picks appear once though the explorer spells their repositories differently
 for(const [q,expect] of [['etherdeck',['EtherDeck']],['themedeck',['ThemeDeck']],['deckcord',['Deckcord','Deckcord']]]){
  await search.fill(q);await p.waitForFunction(n=>document.querySelectorAll('.dht-spotlight-result').length===n,expect.length);
  assert.deepEqual(await names(),expect,q);
  assert.deepEqual(await badges(0).then(x=>x[0]),'✦ Spotlight',q);
 }
 assert.ok((await badges(1)).includes('Fork of marios8543/Deckcord'));
 await search.fill('etherdeck');await results.first().click();
 assert.deepEqual(await badges(0),['✦ Spotlight','✓ Installed','★ 12']);
 assert.match(await detail.innerText(),/USB networking for your Deck/);// explorer README on our pick
 assert.match(await detail.locator('.dht-spotlight-primary').innerText(),/Install · 0\.1\.0/);// our install flow kept
 // README-only matches rank last; no match shows a note
 await search.fill('battery');await p.waitForFunction(()=>document.querySelectorAll('.dht-spotlight-result').length===1);
 await results.first().click();
 await detail.locator('.dht-spotlight-install-unreviewed').click();await detail.locator('.dht-spotlight-confirm-yes').click();await status.waitFor();// one confirmation without root
 await search.fill('zzzz-nothing');await p.locator('.dht-spotlight-empty',{hasText:'Nothing found'}).waitFor();
 // offline without a cache: the note, our picks still there
 await p.evaluate(()=>{window.__pluginCatalog={entries:[],installed:[],stale:true,error:'Could not update the plugin list: URLError'};});
 await search.fill('');await p.getByRole('button',{name:'↻ Update list'}).click();
 await p.locator('.dht-spotlight-note',{hasText:'Could not update'}).waitFor();assert.equal(await results.count(),40);
 await p.locator('[data-dht-root]').screenshot({path:'out/theme-previews/spotlight-offline.png'});
 // Hub themed per console look (opened from the PS3 home): the Spotlight uses the hub tokens
 const q=await b.newPage({viewport:{width:1304,height:930}});
 await q.addInitScript(()=>{window.__inventoryFromInstalled=true;window.__testInventory={ps3:'1'};});
 await q.goto(`${url}?theme=ps3`);await q.locator('[data-dht-root]').waitFor();
 await q.getByRole('button',{name:'Hub (from this home)',exact:true}).click();await q.locator('.dht-market[data-hub-styled=true]').waitFor();
 await q.getByRole('tab',{name:'Plugin Spotlight',exact:true}).click();
 await q.locator('.dht-spotlight-search input').fill('deck');await q.locator('.dht-spotlight-result').nth(1).waitFor();await q.waitForTimeout(400);
 await q.screenshot({path:'out/theme-previews/spotlight-search-ps3.png'});
 console.log('PASS: search, ranking, badges, dedupe of differently spelled picks, forks, safe README, confirmations before unreviewed installs, offline note.');
}finally{await b.close();server.close();}
