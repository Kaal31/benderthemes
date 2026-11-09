import assert from 'node:assert/strict';
import {launch, BASE} from './browser.mjs';

const browser = await launch();
const page = await browser.newPage({viewport:{width:1280,height:800}});
try {
  await page.goto(BASE + '/preview/preview.html');
  await page.waitForFunction(() => window.__settingsRoot && window.__seedSettings);
  const results = await page.evaluate(() => {
    const failures = [];
    const check = (condition, message) => {if(!condition) failures.push(message);};
    const seed = settings => window.__seedSettings({enabled:true,...settings});
    const categories = () => window.__settingsCustomize();
    const section = name => categories().find(item => item.label === name)?.sub() ?? [];
    const find = (items, text) => items.find(item => item.label.includes(text));
    const ids = window.__allSettingsThemeIds;
    for(const theme of ids) {
      seed({theme});
      check(window.__settingsRoot().map(item=>item.label).join('|') === 'Theme|Customize|Global settings', theme+': root');
      const themeItems = window.__settingsRoot()[0].sub();
      check(themeItems.some(item => item.label === 'Reset or delete'), theme+': nested reset/delete');
      check(!themeItems.some(item => item.settingsId === 'preset:reset'), theme+': preset reset is nested');
      check(categories().map(item=>item.label).join('|') === 'Screen|Games|Audio', theme+': categories');
      for(const name of ['Screen','Games','Audio']) {
        const items = section(name);
        check(!items.some(item => ['Look options','Advanced','Standard options (this look\'s own values)','Theme file'].includes(item.label)), theme+': obsolete wrapper in '+name);
        check(!items.some(item=>item.label.includes('achievement popups')), theme+': global popup toggle leaked');
      }
      const registered = window.__themeStyles[theme] ?? [];
      const located = [...section('Screen'),...section('Games'),...section('Audio'),...window.__settingsManage()];
      for(const option of registered) check(located.some(item=>item.settingsId === `style:${theme}:${option.key}`), theme+': missing style '+option.key);
      check(!window.__settingsManage().some(item=>item.label==='Reset all settings'), theme+': global reset leaked');
    }
    // Imported WiiFlow controls must remain scoped and appear only in their canonical section.
    seed({theme:'frame',activeTheme:'wiiflow-default',frameData:{'wiiflow-default':{backgroundFit:'original',extendCoverflow:false,continueCoverPattern:true,extendInterface:false,artworkMapping:'frame',realisticCaseEdges:false,swapCaseSides:true,caseEdge:'gray',lastAppid:123}}});
    const sectionItems = name => section(name);
    const background = () => sectionItems('Screen').find(item => item.label === 'Background')?.sub() ?? [];
    const byId = (items,id) => items.find(item=>item.settingsId===`wiiflow:${id}`);
    check(!!byId(background(),'fit'),'WiiFlow fit belongs in Screen / Background');
    check(!byId(background(),'interface'),'Fill-only interface controls hidden with Original fit');
    const cases = () => byId(sectionItems('Screen'),'cases')?.sub() ?? [];
    check(!!byId(cases(),'edge') && !!byId(cases(),'spine'),'WiiFlow border/spine belong in Screen / Case appearance');
    check(!byId(cases(),'swap'),'Spine side hidden when detailed edges are disabled');
    check(!!byId(sectionItems('Games'),'arrows') && !!byId(sectionItems('Games'),'title'),'WiiFlow navigation/title belong in Games');
    check(!sectionItems('Games').some(item=>['cases','fit','edge','spine'].some(id=>item.settingsId===`wiiflow:${id}`)),'No duplicate WiiFlow appearance controls in Games');
    byId(background(),'fit').sub()[2].action();
    check(!!byId(background(),'interface') && !!byId(background(),'coverflow-width'),'Fill reveals separate interface/coverflow controls');
    check(!byId(background(),'repeat'),'Repeating pattern hidden when widening is disabled');
    byId(background(),'coverflow-width').action();
    check(!!byId(background(),'repeat'),'Repeating pattern available with widened coverflow');
    byId(background(),'interface').sub()[0].action();
    let flow=window.__getThemeSettings().frameData['wiiflow-default'];
    check(flow.artworkMapping==='off' && flow.extendInterface===false,'One interface selector stores compatible legacy flags');
    byId(cases(),'realistic').action();
    check(!!byId(cases(),'swap'),'Spine side returns with detailed edges');
    flow=window.__getThemeSettings().frameData['wiiflow-default'];
    check(flow.lastAppid===123 && flow.caseEdge==='gray' && flow.swapCaseSides===true,'WiiFlow saved options survive hierarchy changes');
    seed({theme:'frame',activeTheme:'gamecube'});
    check(!sectionItems('Screen').some(item=>item.settingsId?.startsWith('wiiflow:')),'WiiFlow controls do not leak into GameCube');
    seed({theme:'vita'});
    check(section('Games').filter(item=>item.settingsId==='native:bubbles').length===1,'One Vita Bubbles editor');
    check(!section('Screen').some(item=>item.settingsId==='native:bubbles'),'Vita Bubbles in Games only');
    check(window.__settingsRoot()[0].sub().some(item=>item.settingsId==='native:colour-look'),'Vita look stays in Presets');
    seed({theme:'x360'});
    check(window.__settingsRoot()[0].sub().some(item=>item.settingsId==='native:dashboard'),'Xbox dashboard stays in Presets');
    seed({theme:'gameamp'});
    check(section('Audio').some(item=>item.settingsId==='style:gameamp:visualizerMode'),'GameAmp visualizer in Audio');
    seed({theme:'switch'});
    check(window.__settingsManage().some(item=>item.settingsId==='style:switch:consoleConversion'),'Switch conversion in Manage theme');
    check(!section('Screen').some(item=>item.settingsId==='style:switch:consoleConversion'),'No duplicate conversion editor');
    seed({theme:'ps5', sort:'recent'});
    let sort = section('Games').find(item=>item.settingsId==='standard:sort');
    check(sort.sub()[0].checked,'Initially inherits global sort');
    sort.sub()[2].action();
    check(window.__getThemeSettings().themeOptions.ps5.sort==='alpha','Local sort stored in existing themeOptions');
    check(window.__getRawSettingsForTest().sort==='recent','Local sort leaves global unchanged');
    sort = section('Games').find(item=>item.settingsId==='standard:sort');
    sort.sub()[0].action();
    check(window.__getThemeSettings().themeOptions.ps5.sort===undefined,'Returning to inheritance removes override');
    seed({theme:'ps5',themeScreensavers:{}});
    const saver = () => find(section('Screen'),'Screensaver').sub();
    check(saver().length===1,'Noncustom screensaver hides media controls');
    saver()[0].sub().find(item=>item.label.includes('media')).action();
    check(saver().some(item=>item.label==='Preview'),'Custom screensaver exposes preview');
    seed({theme:'psp',bootIntro:'test.ctf'});
    seed({...window.__getThemeSettings(), theme:'ps5'});
    check(section('Screen').some(item=>item.label.includes('PSP intro')),'Active PSP clips remain reachable on other themes');
    seed({theme:'ps5'});
    const global = window.__settingsGlobal();
    check(find(global,'Notifications').sub().some(item=>item.label.includes('all themes')),'Global popup scope visible');
    seed({theme:'ps5',sounds:true,themeOptions:{ps5:{sounds:false}}});
    const defaults = find(window.__settingsGlobal(),'Defaults').sub();
    check(find(defaults,'Navigation sounds').checked === true,'Global sound reads raw default despite a theme override');
    return {failures,count:ids.length};
  });
  assert.deepEqual(results.failures,[]);
  console.log(`PASS settings structure across ${results.count} layouts, style placement, presets, scope, inheritance, screensavers and persistent PSP clips`);
  // The menu must be translated as a unit without changing category routing.
  await page.evaluate(() => {window.LocalizationManager={m_rgLocalesToUse:['brazilian']}; window.__seedSettings({theme:'gameamp'});});
  const localized = await page.evaluate(() => ({root:window.__settingsRoot().map(item=>item.label), categories:window.__settingsCustomize().map(item=>item.label)}));
  assert.equal(localized.root[2],'Configurações globais');
  assert.deepEqual(localized.root,['Tema','Personalizar','Configurações globais']);
  assert.deepEqual(localized.categories,['Tela','Jogos','Áudio']);
  await page.evaluate(() => {window.LocalizationManager={m_rgLocalesToUse:['english']};window.__seedSettings({theme:'ps5',enabled:true,onboardingDone:true});});
  await page.waitForTimeout(6500); // Let the console intro finish before exercising controller input.
  await page.evaluate(() => window.__openThemeSettings());
  const menu = page.locator('.dht-menu');
  await menu.locator('.dht-menu-item').filter({hasText:/^Customize/}).click();
  assert.deepEqual(await menu.locator('.dht-menu-item').allTextContents(),['Screen›','Games›','Audio›']);
  await menu.locator('.dht-menu-item').filter({hasText:/^Games/}).click();
  assert.ok((await menu.innerText()).includes('Sort:'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  assert.ok((await menu.locator('[data-selected=true]').innerText()).includes('Games'));
  await page.keyboard.press('Escape');
  await page.waitForTimeout(100);
  assert.ok((await menu.locator('[data-selected=true]').innerText()).includes('Customize'));
  console.log('PASS rendered menu navigation and controller Back restore parent selection');
} finally {
  await browser.close();
}
