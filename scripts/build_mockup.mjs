// Build output/zodiac-lucky-day-full-mockup.html from src/template.html + verified data.
// The initial sign (Aries) is pre-rendered into the saved HTML by running the page's own render code
// in headless Chromium with a fixed build date (simulates server-rendered HTML; no PHP/SSR is implemented).
import fs from 'node:fs';
import path from 'node:path';
import {createRequire} from 'node:module';
const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const require=createRequire(ROOT+'/');
const read=p=>fs.readFileSync(path.join(ROOT,p),'utf8');
const json=p=>JSON.parse(read(p));
const BUILD_DATE=process.env.BUILD_DATE||'2026-11-09';

// ---- SEO (BFC-56617) ----
const seo={};
let cur=null;
for(const line of read('docs/jira/BFC-56617.md').split('\n')){
  const h=/^### (\w+)/.exec(line); if(h){cur=seo[h[1]]={};continue;}
  if(!cur)continue;
  const m=/^\* \*\*(H1|Meta title|Meta description|H2, Lucky Strength Level|H2, Calendar):\*\* (.*)$/.exec(line);
  if(m){const v=m[2].replace(/\\\[/g,'[').replace(/\\\]/g,']');cur[{'H1':'h1','Meta title':'title','Meta description':'desc','H2, Lucky Strength Level':'h2Outlook','H2, Calendar':'h2Calendar'}[m[1]]]=v;}
}
// ---- theme (BFC-56619 table) ----
const theme={};
for(const line of read('docs/jira/BFC-56619.md').split('\n')){
  const m=/^\| (\w+) \| `(#\w{6})` \| `(#\w{6})` \| `(#\w{6})` \| (.*) \|$/.exec(line);
  if(m)theme[m[1]]={base:m[2],primary:m[3],secondary:m[4],art:m[5]};
}
// ---- nodes ----
const nodes={};
for(const line of read('references/figma/banner-nodes.csv').trim().split('\n').slice(1)){const [s,a,b,c,d]=line.split(',');nodes[s]={desktop:a,t768:b,t600:c,m360:d};}
const ref=json('data/reference-data.json');
const pal=json('data/calendar-palettes.json');
const mix=(hex,p)=>'#'+[1,3,5].map(i=>Math.round(parseInt(hex.slice(i,i+2),16)*p+255*(1-p)).toString(16).padStart(2,'0')).join('').toUpperCase();
const signs=ref.map(r=>{
  const t=theme[r.name],n=nodes[r.name];
  if(!t||!n||!seo[r.name])throw new Error('missing source for '+r.name);
  const palette=pal[r.name].Quiet?pal[r.name]:null;
  return {name:r.name,slug:r.name.toLowerCase(),start:r.start,end:r.end,days:r.lucky_days,nums:r.lucky_numbers,glyph:r.glyph,theme:t,art:t.art,nodes:n,
    ...seo[r.name],palette,
    proposalPalette:palette?null:{Quiet:mix(t.secondary,.2),Mixed:mix(t.secondary,.4),Strong:mix(t.secondary,.8),Strongest:t.secondary},
    ctaText:r.name==='Scorpio'?'#FFFFFF':'#140A1C'};
});
const years=[2026,2027,2028],levels={},counts={};
const code={Quiet:'Q',Mixed:'M',Strong:'S',Strongest:'T'};
for(const y of years){const d=json(`data/sign-levels-${y}.json`);levels[y]={};counts[y]={};
  for(const [s,e] of Object.entries(d.signs)){levels[y][s]=e.dates.map(r=>code[r.level]).join('');counts[y][s]=e.counts;
    e.dates.forEach((r,i)=>{if(r.date!==new Date(Date.UTC(y,0,1+i)).toISOString().slice(0,10))throw new Error('date order '+s+r.date);});}}
const sims=[['Lucky Day to Gamble','Lucky day to gamble icon','/tools/is-today-my-lucky-day-to-gamble'],
['Casino Simulator','Casino simulator icon','casino-simulator'],['Slots Simulator','Slots simulator icon','slots-simulator'],
['American Roulette Simulator','Roulette simulator icon','american-roulette-simulator'],['French Roulette Simulator','Roulette simulator icon','french-roulette-simulator'],
['European Roulette Simulator','Roulette simulator icon','european-roulette-simulator'],['Blackjack Simulator','Blackjack simulator icon','blackjack-simulator'],
['Craps Simulator','Craps simulator icon','craps-simulator'],['Baccarat Simulator','Baccarat simulator icon','baccarat-simulator'],['Keno Simulator','Keno simulator icon','keno-simulator'],
['Bingo Simulator','Bingo simulator icon','bingo-simulator'],['Poker Simulator','Poker simulator icon','poker-simulator'],['3 Card Poker Simulator','3 Card poker simulator icon','3-card-poker-simulator'],
['Video Poker Simulator','Video Poker simulator icon','video-poker-simulator'],['Mines Simulator','Mines simulator icon','mines-simulator'],['Crash Simulator','Crash simulator icon','crash-simulator'],['Plinko Simulator','Plinko simulator icon','plinko-simulator']]
 .map(([name,alt,u])=>({name,alt,url:u.startsWith('/')?u:'https://chipy.com/tools/'+u}));
const data={defaultSign:'Aries',years,signs,levels,counts,sims,
  messages:json('data/approved-sign-messages.json'),personal:json('data/approved-personal-messages.json'),
  // Only documented regression example (BFC-52418 / handoff 03). Message index is a mock pick; the model does not document one.
  personalFixtures:{'marius|1986-01-08|2025-01-24':{category:'Good Luck',score:5.07,messageIndex:0}}};
const dataJson=JSON.stringify(data).replace(/</g,'\\u003c');
let tpl=read('src/template.html').replace('/*DATA*/',()=>dataJson);

const {chromium}=require('playwright');
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium',args:['--no-sandbox']});
const page=await browser.newPage({viewport:{width:1280,height:900}});
await page.addInitScript(d=>{window.__BUILD_FIXED__=d;},BUILD_DATE);
const tmp=path.join(ROOT,'output','_stage.html');fs.writeFileSync(tmp,tpl);
const errs=[];page.on('pageerror',e=>errs.push(e.message));
await page.goto('file://'+tmp);
const snap=await page.evaluate(()=>({app:document.getElementById('app').innerHTML,title:document.title,desc:document.querySelector('meta[name=description]').content,canon:document.querySelector('link[rel=canonical]').href}));
await browser.close();fs.unlinkSync(tmp);
if(errs.length)throw new Error('page errors during pre-render: '+errs.join('; '));
tpl=tpl.replace('<!--SSR-->',()=>snap.app)
  .replace(/<title>.*?<\/title>/,()=>`<title>${snap.title.replace(/&/g,'&amp;')}</title>`)
  .replace('<meta name="description" content="">',()=>`<meta name="description" content="${snap.desc.replace(/"/g,'&quot;')}">`)
  .replace(/<link rel="canonical" href="[^"]*">/,()=>`<link rel="canonical" href="${snap.canon}">`);
fs.writeFileSync(path.join(ROOT,'output/zodiac-lucky-day-full-mockup.html'),tpl);
console.log('Built output/zodiac-lucky-day-full-mockup.html',(tpl.length/1024).toFixed(0)+' KB; pre-rendered for',BUILD_DATE);
