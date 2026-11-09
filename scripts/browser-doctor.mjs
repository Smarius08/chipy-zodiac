import fs from 'node:fs';
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && fs.existsSync('/opt/chipy-zodiac-tools/browsers')) process.env.PLAYWRIGHT_BROWSERS_PATH='/opt/chipy-zodiac-tools/browsers';
const {chromium}=await import('playwright');
let browser;
try {
  browser=await chromium.launch({headless:true,...(process.env.CHROMIUM_PATH?{executablePath:process.env.CHROMIUM_PATH,args:['--no-sandbox']}:{})});
  const page=await browser.newPage();
  await page.setContent('<!doctype html><title>Environment check</title><button>Ready</button>');
  await page.getByRole('button',{name:'Ready',exact:true}).click();
  console.log('PASS: Chromium launched and operated a local test page. Environment check only, not a product test.');
} catch(error) {console.error('BROWSER NOT READY: '+error.message);process.exitCode=1;}
finally {if(browser) await browser.close();}
