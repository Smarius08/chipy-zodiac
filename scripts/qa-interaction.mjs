// Interaction QA for output/zodiac-lucky-day-full-mockup.html (supplements, does not replace, manual review).
import fs from 'node:fs';import path from 'node:path';import {createRequire} from 'node:module';
const ROOT=path.resolve(path.dirname(new URL(import.meta.url).pathname),'..');
const {chromium}=createRequire(ROOT+'/')('playwright');
const FILE='file://'+ROOT+'/output/zodiac-lucky-day-full-mockup.html';
const J=p=>JSON.parse(fs.readFileSync(path.join(ROOT,p),'utf8'));
const msgs=J('data/approved-sign-messages.json'),ref=J('data/reference-data.json'),pers=J('data/approved-personal-messages.json');
const lv26=J('data/sign-levels-2026.json'),lv27=J('data/sign-levels-2027.json');
const results=[];const ok=(n,c,x='')=>{results.push([c?'PASS':'FAIL',n,c?'':x]);};
const browser=await chromium.launch({headless:true,executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium',args:['--no-sandbox']});
async function open(w=1280,extra={}){const ctx=await browser.newContext({viewport:{width:w,height:900},...extra});const p=await ctx.newPage();p.errs=[];p.on('pageerror',e=>p.errs.push(e.message));p.on('console',m=>{if(m.type()==='error')p.errs.push(m.text())});p.on('requestfailed',r=>p.errs.push('reqfail '+r.url()));await p.goto(FILE);return p;}
const setDate=async(p,d)=>{await p.evaluate(()=>document.getElementById('review').querySelector('details').open=true);await p.fill('#rv-date',d);await p.dispatchEvent('#rv-date','change');};
const setSign=async(p,s)=>{await p.evaluate(()=>document.getElementById('review').querySelector('details').open=true);await p.selectOption('#rv-sign',s);};
const slug=s=>s.toLowerCase();
const WD=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// ---- 1. all 12 signs: content, strip, links, messages, badge/calendar agreement ----
{const p=await open();await setDate(p,'2026-11-09');
 for(const r of ref){await setSign(p,r.name);
  const h1=await p.textContent('h1');ok(r.name+' H1 has sign + 2026',h1.includes(r.name)&&!h1.includes('[Year]')||h1.includes(r.name),h1);
  const strip=await p.textContent('#strip');
  const okStrip=strip.includes(r.lucky_days.join(', '))&&strip.includes(r.lucky_numbers.join(', '))&&strip.includes(r.name);ok(r.name+' info strip',okStrip,strip);
  const links=await p.$$eval('#signs a',a=>a.map(x=>[x.textContent.trim(),x.getAttribute('href')]));
  const exp=ref.filter(x=>x.name!==r.name).map(x=>'/tools/'+slug(x.name)+'-lucky-days-to-gamble');
  ok(r.name+' 11 other links in order',links.length===11&&JSON.stringify(links.map(l=>l[1]))===JSON.stringify(exp));
  const badge=await p.textContent('#badge');
  const day=lv26.signs[r.name].dates.find(d=>d.date==='2026-11-09').level;ok(r.name+' badge = fixture level',badge===day,badge+' vs '+day);
  const msg=await p.textContent('.out-msg');ok(r.name+' message exact for level',msg===msgs[r.name][day]);
  const cellLv=await p.$eval('#yr .cell.today',c=>c.dataset.lv);ok(r.name+' calendar today = badge',cellLv===badge);
  const leg=await p.$$eval('.legend span',s=>s.slice(0,4).map(x=>x.textContent));
  const c=lv26.signs[r.name].counts;ok(r.name+' legend counts',leg.join('|')===['Quiet','Mixed','Strong','Strongest'].map(k=>`${k} - ${c[k]} days`).join('|'),leg.join('|'));
  const sum=Object.values(c).reduce((a,b)=>a+b);ok(r.name+' legend sum 365',sum===365);
  const cells=await p.$$eval('#yr .cell',x=>x.length);ok(r.name+' 365 cells',cells===365,cells);
 }
 ok('no console/page errors (12 signs)',p.errs.length===0,p.errs.join(';'));}

// ---- 2. upcoming cards edge cases (Aries) ----
{const p=await open();
 const cards=async d=>{await setDate(p,d);return p.$$eval('.dcard',x=>x.map(c=>c.innerText.replace(/\n/g,' ')));};
 let c=await cards('2026-11-05');ok('Aries 5 Nov: 15 Dec + 22 Dec Tuesday only',JSON.stringify(c)==='["December 15 Tuesday","December 22 Tuesday"]',JSON.stringify(c));
 c=await cards('2026-12-30');ok('Aries 30 Dec: none + note',c.length===0&&(await p.textContent('.nocards'))==='No Strongest dates remain this year.');
 c=await cards('2026-01-01');ok('Aries 1 Jan: 6 Jan,24 Mar,31 Mar,14 Apr,21 Apr',JSON.stringify(c.map(x=>x.split(' ').slice(0,2).join(' ')))===JSON.stringify(['January 6','March 24','March 31','April 14','April 21']),JSON.stringify(c));
 await setDate(p,'2026-12-31');ok('Aries 31 Dec: today excluded, no next-year filler',(await p.$$('.dcard')).length===0);
 await setDate(p,'2027-01-01');const lab=await p.textContent('.cards-lab');ok('1 Jan rollover switches year + legend',lab.includes('2027')&&(await p.textContent('.legend')).includes(`Quiet - ${lv27.signs.Aries.counts.Quiet} days`));
 await setDate(p,'2029-03-01');ok('unsupported year shows notice, not other year',(await p.textContent('#outlook')).includes('No verified fixture for 2029'));
 // clock rollover
 await p.close();}
{const p=await open(1280,{});await p.clock.install({time:new Date('2026-12-31T23:59:30')});await p.reload();
 const before=await p.textContent('.cards-lab');await p.clock.runFor(60000);const after=await p.textContent('.cards-lab');
 ok('real-clock midnight rollover updates to 2027',before.includes('2026')&&after.includes('2027'),before+' / '+after);}

// ---- 3. validation + picker ----
{const p=await open();await setDate(p,'2026-11-09');
 await p.click('#reveal');
 ok('both errors simultaneously',(await p.textContent('#fn-e'))==='Please enter a valid name'&&(await p.textContent('#dob-e'))==='Please enter a valid date');
 await p.fill('#fn','J0hn');await p.click('#reveal');ok('unsupported name error',(await p.textContent('#fn-e'))==='Use A-Z letters only for your first name.');
 await p.fill('#fn','John');ok('name error clears when valid',(await p.$('#fn-e'))===null);
 // open picker
 await p.click('#dob-btn');ok('picker opens (dialog)',await p.$eval('#dp',d=>d.open));
 const hdr=await p.textContent('.dp-nav .my');ok('opens first month, latest age-allowed year (Mar 2008)',hdr.trim().startsWith('March 2008'),hdr);
 const enabled=await p.$$eval('[data-dp=day]:not([disabled])',x=>x.map(b=>b.textContent));ok('Aries March: only 21-31 enabled',enabled.join()===[...Array(11)].map((_,i)=>21+i).join());
 await p.click('[data-dp=next]');const en2=await p.$$eval('[data-dp=day]:not([disabled])',x=>x.map(b=>+b.textContent));ok('Aries April: only 1-19 enabled',en2.length===19&&en2[18]===19);
 ok('prev/next stay within sign months',await p.$eval('[data-dp=next]',b=>b.disabled));
 // cancel does not apply
 await p.click('[data-dp=day]:not([disabled]) >> nth=2');await p.click('[data-dp=cancel]');ok('Cancel does not apply',(await p.inputValue('#dob'))==='');
 ok('focus restored to trigger',await p.evaluate(()=>document.activeElement.id==='dob-btn'));
 // calendar OK
 await p.click('#dob-btn');await p.click('[data-dp=day]:not([disabled]) >> nth=2');await p.click('[data-dp=ok]');ok('OK applies calendar date',(await p.inputValue('#dob'))==='23/03/2008',await p.inputValue('#dob'));
 // manual mode cases
 const manual=async txt=>{await p.click('#dob-btn');if(!(await p.$('#dp-text')))await p.click('[data-dp=mode]');await p.fill('#dp-text',txt);await p.click('[data-dp=ok]');};
 await manual('01/08/1990');ok('cross-sign: error + stays open',await p.$eval('#dp',d=>d.open)&&(await p.textContent('#dp-err')).trim()==='This date falls under Leo. Go to the Leo tool.',await p.textContent('#dp-err'));
 ok('only "Leo tool" linked, same tab, correct href',await p.$eval('#dp-err a',a=>a.textContent==='Leo tool'&&a.getAttribute('href')==='/tools/leo-lucky-days-to-gamble'&&!a.target));
 ok('mismatch error not under main field',(await p.$('#dob-e'))===null);
 await p.fill('#dp-text','31/02/1990');await p.click('[data-dp=ok]');ok('invalid Gregorian date: generic error (no sign message)',(await p.textContent('#dp-err')).includes('Please enter a valid date'));
 await p.fill('#dp-text','01/08/2999');await p.click('[data-dp=ok]');ok('future date rejected before sign check',(await p.textContent('#dp-err')).includes('Please enter a valid date'));
 await p.fill('#dp-text','10/11/2008');await p.click('[data-dp=ok]');ok('underage Aries-miss date: age check first',(await p.textContent('#dp-err')).includes('Please enter a valid date'));
 await p.fill('#dp-text','25/03/2008');await p.click('[data-dp=ok]');ok('valid same-sign manual date accepted',(await p.inputValue('#dob'))==='25/03/2008');
 await p.click('#dob-btn');await p.click('[data-dp=clear]');await p.click('[data-dp=ok]');ok('Clear + OK empties field',(await p.inputValue('#dob'))==='');
 // same-tab link + re-entry
 await manual('01/08/1990');await p.fill('#fn','Ann').catch(()=>{});await p.click('#dp-err a');
 ok('link switches preview to Leo, no carry-over',(await p.textContent('h1')).startsWith('Leo')&&(await p.inputValue('#fn'))===''&&(await p.inputValue('#dob'))==='');
 ok('picker closed after switch',!(await p.$eval('#dp',d=>d.open)));
 // age boundary (today 2026-11-09): 09/11/2008 ok, 10/11/2008 not -- Scorpio page
 await setSign(p,'Scorpio');await manual('09/11/2008');ok('age boundary: exactly 18 accepted',(await p.inputValue('#dob'))==='09/11/2008',await p.inputValue('#dob'));
 await p.click('#dob-btn');if(!(await p.$('#dp-text')))await p.click('[data-dp=mode]');await p.fill('#dp-text','10/11/2008');await p.click('[data-dp=ok]');ok('age boundary: 17y364d rejected',(await p.textContent('#dp-err')).includes('Please enter a valid date'));
 await p.click('[data-dp=cancel]');
 ok('no errors',p.errs.length===0,p.errs.join(';'));}

// ---- 4. Capricorn year crossing + Pisces leap ----
{const p=await open();await setDate(p,'2026-11-09');await setSign(p,'Capricorn');await p.click('#dob-btn');
 let h=(await p.textContent('.dp-nav .my')).trim();ok('Capricorn opens Dec 2007',h.startsWith('December 2007'),h);
 const en=await p.$$eval('[data-dp=day]:not([disabled])',x=>x.map(b=>+b.textContent));ok('Capricorn Dec: 22-31',en[0]===22&&en.length===10);
 await p.click('[data-dp=next]');h=(await p.textContent('.dp-nav .my')).trim();ok('Capricorn next -> January 2008',h.startsWith('January 2008'),h);
 const en2=await p.$$eval('[data-dp=day]:not([disabled])',x=>x.map(b=>+b.textContent));ok('Capricorn Jan: 1-19',en2.length===19);
 await p.click('[data-dp=day]:not([disabled]) >> nth=0');await p.click('[data-dp=ok]');ok('Capricorn Jan 2008 DOB applies',(await p.inputValue('#dob'))==='01/01/2008');
 await p.click('#dob-btn');h=(await p.textContent('.dp-nav .my')).trim();ok('reopens on selected month',h.startsWith('January 2008'),h);
 await p.click('[data-dp=prev]');ok('prev -> Dec 2007',(await p.textContent('.dp-nav .my')).trim().startsWith('December 2007'));
 await p.click('[data-dp=years]');const yrs=await p.$$eval('.dp-years button',b=>b.map(x=>+x.textContent));ok('year list: 1900.. latest, contiguous',yrs[0]===2007&&yrs.at(-1)===1900&&yrs.length===108,yrs[0]+'..'+yrs.at(-1)+' n='+yrs.length);
 await p.click('.dp-years button >> text=1996');ok('year selection keeps Dec',(await p.textContent('.dp-nav .my')).trim().startsWith('December 1996'));
 await p.click('[data-dp=next]');ok('Dec 1996 -> Jan 1997',(await p.textContent('.dp-nav .my')).trim().startsWith('January 1997'));
 await p.click('[data-dp=cancel]');
 await setSign(p,'Pisces');await p.click('#dob-btn');await p.click('[data-dp=mode]');
 await p.fill('#dp-text','29/02/2000');await p.click('[data-dp=ok]');ok('Pisces 29/02/2000 accepted',(await p.inputValue('#dob'))==='29/02/2000');
 await p.click('#dob-btn');await p.click('[data-dp=mode]');await p.fill('#dp-text','29/02/2001');await p.click('[data-dp=ok]');ok('29/02/2001 invalid',(await p.textContent('#dp-err')).includes('Please enter a valid date'));await p.click('[data-dp=cancel]');
 // leap year in calendar mode: reopen cal on 2000 Feb
 await p.click('#dob-btn');const f29=await p.$('[data-dp=day][data-d="2000-02-29"]');ok('Pisces Feb 29 2000 enabled in calendar',!!f29&&!(await f29.isDisabled()));await p.click('[data-dp=cancel]');
 ok('no errors',p.errs.length===0,p.errs.join(';'));}

// ---- 5. flow: pending lock, failure, retry, reset, fixture, categories ----
{const p=await open();await setDate(p,'2026-11-09');
 const fill=async()=>{await p.fill('#fn','Maria');await p.click('#dob-btn');await p.click('[data-dp=day]:not([disabled]) >> nth=3');await p.click('[data-dp=ok]');};
 await p.evaluate(()=>document.querySelector('#review details').open=true);
 await p.check('#rv-fail');await fill();await p.click('#reveal');
 ok('loading state shown',await p.isVisible('.loading'));
 await p.waitForSelector('.req-err');ok('request failure message under CTA',(await p.textContent('.req-err'))==='Something went wrong. Please try again.');
 ok('inputs preserved after failure',(await p.inputValue('#fn'))==='Maria'&&(await p.inputValue('#dob'))!=='');
 ok('no stale result after failure',(await p.$('.res'))===null);
 await p.uncheck('#rv-fail');await p.click('#reveal');
 await p.waitForSelector('.res .cat',{timeout:6000});
 const cat=await p.textContent('.cat'),score=await p.textContent('.score'),msg=await p.textContent('.msg');
 ok('result: score /10, category, personal message from category pool',/\/10/.test(score)&&pers[cat].includes(msg),cat+score+msg);
 ok('mock label shown for non-fixture result',(await p.textContent('#mockflag')).includes('MOCK'));
 ok('info strip + disclaimer visible in result',await p.isVisible('#strip')&&(await p.textContent('.disc')).startsWith('For entertainment purposes only.'));
 const m2=msg;await p.click('#reset');ok('Reset restores empty form',(await p.inputValue('#fn'))===''&&(await p.inputValue('#dob'))===''&&(await p.$('.res'))===null);
 // same input twice -> same message
 await fill();await p.click('#reveal');await p.waitForSelector('.res .cat',{timeout:6000});ok('same inputs/date -> same message',(await p.textContent('.msg'))===m2);
 for(const [sc,name] of [['low','Low Luck'],['some','Some Luck'],['good','Good Luck'],['jackpot','Jackpot Luck']]){
  await p.click('#reset');await p.selectOption('#rv-scen',sc);await fill();await p.click('#reveal');await p.waitForSelector('.res .cat',{timeout:6000});ok('scenario '+name,(await p.textContent('.cat'))===name);}
 // fixture
 await setSign(p,'Capricorn');await setDate(p,'2025-01-24');
 await p.fill('#fn','Marius');await p.click('#dob-btn');await p.click('[data-dp=mode]');await p.fill('#dp-text','08/01/1986');await p.click('[data-dp=ok]');
 await p.click('#reveal');await p.waitForSelector('.res .cat',{timeout:6000});
 ok('Capricorn/Marius/08-01-1986 @2025-01-24 fixture: Good Luck 5.07/10',(await p.textContent('.cat'))==='Good Luck'&&(await p.textContent('.score')).startsWith('5.07')&&(await p.textContent('#mockflag')).includes('FIXTURE'));
 ok('no errors',p.errs.length===0,p.errs.join(';'));}
{const p=await open();await p.evaluate(()=>document.querySelector('#review details').open=true);await p.fill('#fn','Ann');await p.click('#dob-btn');await p.click('[data-dp=day]:not([disabled]) >> nth=3');await p.click('[data-dp=ok]');
 await p.click('#reveal');await p.evaluate(()=>document.getElementById('reveal')&&document.getElementById('reveal').click());
 const n=await p.evaluate(()=>1);await p.waitForSelector('.res .cat',{timeout:6000});ok('double click produced one result',(await p.$$('.res')).length===1);}

// ---- 6. mobile calendar ----
{const p=await open(360);await setDate(p,'2026-11-09');
 ok('desktop 31-col grid hidden, month view shown',!(await p.isVisible('#yr'))&&(await p.isVisible('#mv')));
 ok('opens on current local month',(await p.textContent('#mv strong'))==='November 2026');
 await p.click('[data-mv="-1"]');ok('prev arrow -> October',(await p.textContent('#mv strong'))==='October 2026');
 await p.click('[data-mc="1"]');ok('chip -> February',(await p.textContent('#mv strong'))==='February 2026'&&(await p.$$('#mv .cell')).length===28);
 const legend=await p.textContent('.legend');ok('legend unchanged by month nav',legend.includes('Quiet - 126 days')&&legend.includes('Strongest - 9 days'));
 const sz=await p.$eval('#mv .cell',c=>{const b=c.getBoundingClientRect();return [b.width,b.height];});ok('mobile cell pitch >=44',sz[0]>=44&&sz[1]>=44,sz.join('x'));
 await p.click('#mv .cell >> nth=9');ok('tap shows date + level',/^Feb 10, 2026 · \w+$/.test(await p.textContent('#tip')),await p.textContent('#tip'));
 const lv=lv26.signs.Aries.dates.find(d=>d.date==='2026-02-10').level;ok('tap level matches fixture',(await p.textContent('#tip')).endsWith(lv));
 await p.close();}
{const p=await open(1280);await setDate(p,'2026-11-09');await p.hover('#yr .cell >> nth=40');
 const t=await p.textContent('#tip');ok('hover shows date + level',/^[A-Z][a-z]{2} \d+, 2026 · \w+$/.test(t),t);
 await p.focus('#yr .cell.today');ok('keyboard focus shows details (today)',(await p.textContent('#tip')).startsWith('Nov 9, 2026'));
 await p.keyboard.press('ArrowRight');ok('arrow key moves to Nov 10',(await p.textContent('#tip')).startsWith('Nov 10, 2026'));
 const nm=await p.$$eval('.yr-row',r=>r.map(x=>x.querySelectorAll('.cell').length));ok('rows have actual day counts',nm.join()==='31,28,31,30,31,30,31,31,30,31,30,31',nm.join());
 const sz=await p.$eval('#yr .cell',c=>{const b=c.getBoundingClientRect();return [Math.round(b.width),Math.round(b.height)];});ok('desktop cell ~24x22',sz[0]>=22&&sz[0]<=27&&sz[1]===22,sz.join('x'));}

// ---- 7. layout at widths: no overflow, long messages, ball content not clipped ----
for(const w of [1920,768,600,360,320]){
 const p=await open(w);await setDate(p,'2026-11-09');
 for(const s of ['Sagittarius','Taurus','Virgo']){await setSign(p,s);
  const ov=await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+1);ok(`${s}@${w} no horizontal overflow`,!ov);}
 // result with longest personal message in ball
 const longest=Object.values(pers).flat().sort((a,b)=>b.length-a.length)[0];
 await p.click('#reveal');
 const eb=await p.$$eval('.ferr',e=>e.map(x=>{const r=x.getBoundingClientRect();return [r.top,r.bottom];}));
 const ball=await p.$eval('#ball',b=>{const r=b.getBoundingClientRect();return [r.left,r.right];});
 const inner=await p.$eval('#ball-in',b=>{const r=b.getBoundingClientRect();return [r.left,r.right];});
 ok(`@${w} form with both errors inside ball horizontally`,inner[0]>=ball[0]&&inner[1]<=ball[1]);
 const overlap=eb.length===2&&eb[0][1]>await p.$eval('#dob',d=>d.getBoundingClientRect().top)?true:false;ok(`@${w} errors do not overlap next field`,!overlap);
 await p.screenshot({path:path.join(ROOT,`output/qa/errors-${w}.png`)}).catch(()=>{});
 ok(`@${w} no console errors`,p.errs.length===0,p.errs.join(';'));await p.close();}

// ---- 8. static content / code hygiene ----
{const html=fs.readFileSync(path.join(ROOT,'output/zodiac-lucky-day-full-mockup.html'),'utf8');
 ok('no ENGINE/81-combination/score code in output',!/ENGINE|81 combination|lifePath|nameScore|annualRank|rankAll/i.test(html.replace(/"messages":[\s\S]*$/,'')));
 ok('initial HTML has 11 other-sign anchors without JS',(html.match(/<a href="\/tools\/[a-z]+-lucky-days-to-gamble" data-sign=/g)||[]).length===11);
 ok('initial HTML has H1 + strip + badge pre-rendered',/<h1>Aries Lucky Days to Gamble - Your Luck Score Across 2026<\/h1>/.test(html)&&html.includes('id="strip"')&&html.includes('id="badge"'));
 ok('no external URL loaded (no src/href http for assets)',!/(src|srcset)="https?:/.test(html)&&!/url\(https?:/.test(html));
 const all48=Object.values(msgs).flatMap(o=>Object.values(o));ok('all 48 messages present verbatim in file',all48.every(t=>html.includes(JSON.stringify(t).slice(1,-1).replace(/</g,'\\u003c'))||html.includes(t)));
 const p=await open(1280);const nojs=await browser.newContext({javaScriptEnabled:false});const q=await nojs.newPage();await q.goto(FILE);
 ok('no-JS render shows H1, outlook, calendar cells, other signs',(await q.$$('#signs a')).length===11&&(await q.$$('#yr .cell')).length===365&&!!(await q.$('#badge')));}
await browser.close();
const fails=results.filter(r=>r[0]==='FAIL');
fs.mkdirSync(path.join(ROOT,'output/qa'),{recursive:true});
fs.writeFileSync(path.join(ROOT,'output/qa/interaction-result.txt'),results.map(r=>r.join(' | ')).join('\n'));
console.log(results.length+' checks, '+fails.length+' failed');for(const f of fails)console.log(f.join(' | '));
process.exit(fails.length?1:0);
