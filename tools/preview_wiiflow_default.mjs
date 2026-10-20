import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {execFileSync} from 'node:child_process';
const folder=fs.mkdtempSync(path.join(os.tmpdir(),'wiiflow-default-preview-'));
try{
 fs.cpSync('themes/wiiflow-default',folder,{recursive:true});
 fs.writeFileSync(path.join(folder,'theme-config.js'),'window.WiiFlowImport={};');
 const assets={};for(const file of fs.readdirSync(path.join(folder,'assets')))assets[file]={target:'assets/'+file};
 fs.writeFileSync(path.join(folder,'import-report.json'),JSON.stringify({assets}));
 execFileSync(process.execPath,['tools/preview_wiiflow_import.mjs',folder,'../WiiFlow-default-preview.html'],{stdio:'inherit'});
 fs.copyFileSync('../WiiFlow-default-preview.html','../WiiFlow-default-reflection-preview.html');
}finally{fs.rmSync(folder,{recursive:true,force:true});}
