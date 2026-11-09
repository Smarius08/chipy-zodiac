import fs from 'node:fs';
import path from 'node:path';
import {pathToFileURL} from 'node:url';
if(!process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync('/opt/chipy-zodiac-tools/browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH='/opt/chipy-zodiac-tools/browsers';
const {chromium}=await import('playwright');
const file=path.resolve(process.argv[2]||'output/zodiac-lucky-day-full-mockup.html');
if(!fs.existsSync(file)){console.error('NO MOCKUP TO TEST: build '+file+' first. No product checks have passed.');process.exit(2);}
fs.mkdirSync('output/qa',{recursive:true});
const browser=await chromium.launch({headless:true});const failures=[];
try{
  for(const width of [1920,768,600,360,320]){
    const page=await browser.newPage({viewport:{width,height:1000}});
    page.on('pageerror',e=>failures.push(width+': '+e.message));
    page.on('requestfailed',r=>failures.push(width+': asset failed '+r.url().split('?')[0]));
    await page.goto(pathToFileURL(file).href);await page.evaluate(()=>document.fonts.ready);
    if(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1)) failures.push(width+': horizontal overflow');
    if(await page.locator('h1:visible').count()!==1) failures.push(width+': expected one visible H1');
    const cta=page.getByRole('button',{name:'Reveal My Luck',exact:true});
    if(await cta.count()!==1 || !(await cta.isEnabled())) failures.push(width+': initial CTA missing/disabled');
    await page.screenshot({path:'output/qa/page-'+width+'.png',fullPage:true});await page.close();
  }
}finally{await browser.close();}
fs.writeFileSync('output/qa/smoke-result.json',JSON.stringify({scope:'Initial rendering only; full interaction checklist remains required.',failures},null,2));
if(failures.length){console.error(failures.join('\n'));process.exit(1);}
console.log('Initial render checks passed at five widths. Run BUILD-PROMPT interaction checklist separately.');
