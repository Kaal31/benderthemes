import {build} from 'esbuild';
import assert from 'node:assert/strict';
import {launch} from './browser.mjs';
const stubs={
 '@decky/api':`export const callable=name=>(...args)=>{(window.calls??=[]).push([name,...args]);return Promise.resolve(name==='plugin_update_status'?window.statusFixture:name==='plugin_prepare_replacement'?{success:true}:true);};`,
 '@decky/ui':`import React from 'react';export const PanelSection=({children})=><section>{children}</section>;export const PanelSectionRow=({children})=><div>{children}</div>;export const ButtonItem=({children,onClick,disabled})=><button disabled={disabled} onClick={onClick}>{children}</button>;export const DropdownItem=({label,rgOptions,selectedOption,onChange,disabled})=><label>{label}<select aria-label={label} disabled={disabled} value={selectedOption} onChange={e=>onChange({data:e.target.value})}>{rgOptions.map(o=><option key={o.data} value={o.data}>{o.label}</option>)}</select></label>;export const ProgressBarWithInfo=()=>null;`
};
const bundle=await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {Updates,installType} from './src/Updates';window.installType=installType;createRoot(document.getElementById('root')).render(React.createElement(Updates));`,resolveDir:process.cwd(),loader:'tsx'},bundle:true,write:false,format:'iife',jsx:'automatic',plugins:[{name:'decky-fixtures',setup(b){b.onResolve({filter:/^@decky\//},a=>({path:a.path,namespace:'fixture'}));b.onLoad({filter:/.*/,namespace:'fixture'},a=>({contents:stubs[a.path],loader:'tsx',resolveDir:process.cwd()}));}}]});
const browser=await launch();
try{
 const page=await browser.newPage();await page.setContent('<div id="root"></div>');
 await page.evaluate(()=>{
  const rel=(channel,version,build)=>({channel,version,build,attempt:1,tag:`${channel}-v${version}-${build}-1`,assetUrl:`https://github.com/Kaal31/benderthemes/releases/download/${channel}-v${version}-${build}-1/DeckHomeThemes-v${version}.zip`,notes:''});
  window.statusFixture={success:true,currentVersion:'2.0.0',currentChannel:'beta',channelKnown:true,currentBuild:5,currentAttempt:1,releases:[{...rel('stable','3.0.0',0),tag:'v3.0.0'},rel('beta','2.0.0',6),rel('experimental','1.0.0',9)],latest:rel('beta','2.0.0',6),updateAvailable:true,stale:false};
  window.DeckyBackend={call:(...args)=>{(window.installs??=[]).push(args);return Promise.resolve();}};
 });
 await page.addScriptTag({content:bundle.outputFiles[0].text});
 const channel=page.getByLabel('Release channel');await channel.waitFor();
 assert.equal(await channel.inputValue(),'beta','installed channel selected instead of globally newest stable');
 assert.match(await page.getByLabel('Install version').textContent(),/build 6/);
 assert.equal(await page.evaluate(()=>window.installType(window.statusFixture.releases[1],window.statusFixture)),2,'same version newer build is an update');
 await channel.selectOption('experimental');
 assert.match(await page.getByLabel('Install version').textContent(),/1.0.0 · build 9/);
 assert.equal(await page.evaluate(()=>window.installs?.length??0),0,'selecting channel does not install');
 await page.getByRole('button',{name:/Switch to experimental/}).click();
 await page.waitForFunction(()=>window.installs?.length===1);
 const call=await page.evaluate(()=>window.installs[0]);
 assert.equal(call[0],'utilities/install_plugin');assert.equal(call[5],1,'cross-channel lower version uses replacement');assert.match(call[1],/experimental-v1.0.0-9-1/);
 console.log('PASS updater UI: current channel, filtered versions, build ordering, explicit switching and lower-version replacement');
}finally{await browser.close();}
