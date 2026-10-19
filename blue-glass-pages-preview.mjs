import {chromium} from 'playwright';
import {pathToFileURL} from 'node:url';
const b=await chromium.launch();const p=await b.newPage({viewport:{width:1280,height:800}});await p.goto(pathToFileURL(process.cwd()+'/themes/blue-glass/index.html').href);await p.locator('footer [data-place=settings]').click();await p.screenshot({path:'../BlueGlass-settings-preview.png'});await b.close();
