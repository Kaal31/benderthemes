import {chromium} from 'playwright';
const b=await chromium.launch(),p=await b.newPage({viewport:{width:1280,height:720}});await p.goto('http://127.0.0.1:8776/blue-glass-browser-preview.html');await p.frameLocator('#theme').locator('#apps .game-app').first().waitFor();await p.waitForTimeout(300);await p.screenshot({path:'../BlueGlass-preview.png'});await b.close();
