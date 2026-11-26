import assert from 'node:assert/strict';
import {build} from 'esbuild';
import {launch} from './browser.mjs';
const pure=await build({entryPoints:['src/themes/xboxInfoLabels.ts'],bundle:true,write:false,format:'esm'});
const {resolveXboxLabel:label,xboxGameImageKind:imageKind}=await import('data:text/javascript;base64,'+Buffer.from(pure.outputFiles[0].text).toString('base64'));
const context={user:'Deck Player',time:'12:34',date:'26/11/2026',label:'Portal 2'};
assert.equal(label('Time: $INFO[System.Time] · $INFO[System.ProfileName]','',context),'Time: 12:34 · Deck Player');
assert.equal(label('$INFO[ListItem.Label,Playing: ,!]','',context),'Playing: Portal 2!');
assert.equal(label('','System.Time',context),'12:34');assert.equal(label('$TIME$','',context),'12:34');
assert.equal(label('Unknown: $INFO[System.Unknown]','',context),'Unknown: —');assert.equal(label('$INFO[ListItem.Label2,prefix,suffix]','',context),'');
assert.equal(label('Price: $5','',context),'Price: $5');assert.equal(imageKind('$INFO[ListItem.Thumb]'),'cover');
const bundle=await build({stdin:{contents:`import React from 'react';import {createRoot} from 'react-dom/client';import {XboxImportedLayout} from './src/themes/XboxImportedLayout';window.mount=(props)=>{window.fixtureRoot??=createRoot(document.getElementById('root'));window.fixtureRoot.render(React.createElement(XboxImportedLayout,props))};`,resolveDir:process.cwd()},bundle:true,write:false,format:'iife',jsx:'automatic',alias:{'@decky/api':'./preview/stubs/api.ts','@decky/ui':'./preview/stubs/ui.tsx'}});
const browser=await launch();
try{
 const page=await browser.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route('https://invalid.test/bad.png',r=>r.fulfill({status:404,body:''}));await page.setContent('<div id="root"></div>');await page.addScriptTag({content:bundle.outputFiles[0].text});
 await page.evaluate(()=>{
  const c=document.createElement('canvas');c.width=c.height=16;c.getContext('2d').fillRect(0,0,16,16);
  const node=(kind,text,extra={})=>({kind,text,x:10,y:10,width:200,height:25,source:'',color:'#fff',fontSize:20,...extra});
  window.navigations=[];window.props={layout:{width:640,height:480,partial:false,warnings:[],nodes:[node('text','$INFO[System.ProfileName]'),node('text','Settings',{y:40,destination:'settings'}),node('image','',{y:80,width:80,height:100,imageSource:'$INFO[ListItem.Thumb]'}),node('text','Unmapped',{y:190,destination:'RunScript'})],menu:{x:300,y:80,width:200,height:100,spacing:30,color:'#fff',focusColor:'#fff',itemArt:[{kind:'label',x:0,y:0,width:200,height:30,text:'$INFO[ListItem.Label,Game: ,]',color:'#fff'}]}},width:640,height:480,items:[{label:'Portal 2',game:{appid:20,art:{portrait:['https://invalid.test/bad.png',c.toDataURL()],landscape:[],hero:[],logo:[]}}}],selected:0,user:'Deck Player',time:'12:34',onPick(){},onNavigate(place){navigations.push(place)},animate:false};mount(props);
 });
 await page.getByText('Deck Player',{exact:true}).waitFor();await page.getByText('Game: Portal 2',{exact:true}).waitFor();
 await page.waitForFunction(()=>document.querySelector('img')?.src.startsWith('data:image/png'));
 const settings=page.getByRole('button',{name:'Settings',exact:true});await settings.click();await settings.press('Enter');
 assert.deepEqual(await page.evaluate(()=>navigations),['settings','settings']);assert.equal(await page.getByRole('button').count(),1);
 await page.evaluate(()=>{mount({...props,user:'Second Player',items:[{label:'Half-Life',game:{...props.items[0].game,art:{...props.items[0].game.art,portrait:props.items[0].game.art.portrait.slice(1)}}}]})});
 await page.getByText('Second Player',{exact:true}).waitFor();await page.getByText('Game: Half-Life',{exact:true}).waitFor();
 assert.deepEqual(errors,[]);console.log('PASS Xbox live labels, selected-game art fallback/update, native item templates and mapped button activation');
}finally{await browser.close();}
