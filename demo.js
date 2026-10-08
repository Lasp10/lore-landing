(function(){
var thread=document.getElementById('thread'),chips=document.getElementById('chips'),form=document.getElementById('imform'),input=document.getElementById('imtext'),send=form.querySelector('button');
var gname=document.getElementById('gname'),gmem=document.getElementById('gmem'),gav=document.getElementById('gav');
var tabs=[].slice.call(document.querySelectorAll('.scenes button'));
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var wait=function(ms){return new Promise(function(r){setTimeout(r,reduce?Math.min(ms,60):ms)})};
var run=0,cur=0;
var FOUNDERS={name:'Founders',mem:'Maya, Dev, Sam, lore',av:[['M','#5e8f7a'],['D','#c08a5b'],['S','#7b83b5'],['L','#242820']]};
var TRIP={name:'Lisbon trip',mem:'Maya, Priya, Jonas, lore',av:[['M','#5e8f7a'],['P','#b5707b'],['J','#6e9ab5'],['L','#242820']]};
var SCENES=[
{g:FOUNDERS,ctx:[['Dev','we need to know who else sells to seed-stage ops teams'],['Sam','someone look at their pricing before friday']],
 ask:'@lore compare the top 3 competitors on pricing',
 out:[{m:'On it. I will read their public pricing pages.'},
  {w:['opened northwind.example/pricing','opened parcel.example/pricing','opened fieldnote.example/pricing','saved 3 screenshots']},
  {m:'Northwind is $24 per seat. Parcel is $19 flat up to 10 people. Fieldnote only shows custom quotes.\n\nAt your team size Parcel is the one that undercuts you.'},
  {c:['Competitor pricing brief','3 pages read · screenshots attached','SOURCES CITED']}]},
{g:FOUNDERS,ctx:[['Maya','ok so we are launching Tuesday and pricing stays at $29'],['Dev','agreed, no free tier'],['Lore','Noted: launch Tuesday, $29, no free tier. I will hold that for the room.']],
 ask:'@lore what did we decide on pricing?',
 out:[{m:'$29 a month, no free tier. Maya proposed it and Dev agreed on Oct 3. Launch is Tuesday.'},
  {m:'One open thing: nobody has said whether annual billing is in. Want me to put that on the list?'}]},
{g:FOUNDERS,ctx:[['Sam','investor call is at 3 and I need the competitor numbers on one page'],['Maya','something I can open on my phone']],
 ask:'@lore put the competitor pricing on one page I can download',
 out:[{m:'Opening my workspace to build it.'},
  {w:['started a sandboxed computer','opened the editor','typed the 3 prices with their sources','exported competitor-pricing.md']},
  {s:['lore workspace · editor','# Competitor pricing\n\nNorthwind   $24 / seat\nParcel      $19 flat, up to 10\nFieldnote   custom quote only\n\nSources: 3 pages, screenshots saved']},
  {m:'Done. One page, three sources, and a screenshot of each price.'},
  {c:['competitor-pricing.md','Markdown · 1 page · ready to download','COMPUTER RUN RECEIPT']}]},
{g:FOUNDERS,ctx:[['Maya','email the 12 design partners about Tuesday']],
 ask:'@lore send it',
 out:[{m:'Drafted. I will not send anything until you approve it. It goes from your address to 12 people.'},
  {c:['To 12 design partners','Launch moves to Tuesday, 10am PT','WAITING FOR MAYA']},
  {a:{yes:'Approve and send',no:'Edit',youYes:'Approve',youNo:'Edit',ok:'Sent to 12 design partners from your address. Receipt saved.',card:['Delivery receipt','12 of 12 delivered','CONFIRMED'],nok:'Tell me what to change. Nothing has been sent.'}}]},
{g:TRIP,ctx:[['Priya','ok lisbon in november, who is in'],['Jonas','me. under $400 flights from SF though'],['Maya','and a place for all 4 of us']],
 ask:'@lore find flights and a place for 4, friday to monday',
 out:[{m:'Looking at flights and stays now.'},
  {w:['opened flights.example, SFO to LIS, Nov 13','filtered to under $400','opened stays.example, 4 guests, Nov 13 to 16','saved 6 screenshots']},
  {m:'Cheapest nonstop is $412. With one stop it is $368.\n\nBest 4 person apartment is $540 total in Alfama, 9 minutes from the center.'},
  {c:['Poll: nonstop $412 or one stop $368?','Reply 1 or 2 · closes tonight','POLL OPEN']}]},
{g:TRIP,ctx:[['Priya','dinner saturday, somewhere with a table for 4 around 8'],['Lore','Found one: Cantinho do Sol in Alfama has 8:00pm for 4.']],
 ask:'@lore book it',
 out:[{m:'The booking page needs an account.'},
  {w:['opened the booking page','found Saturday 8:00pm, party of 4','stopped at the login']},
  {m:'I will not take your password in this chat. This link goes to a private page, the login is used for this booking only, then it is wiped.'},
  {c:['Private login link','Opens a secure page · nothing passes through chat','SECURE LINK']},
  {m:'Before I book anything, confirm the details.'},
  {a:{yes:'Yes, book it',no:'Not yet',youYes:'Yes, book it',youNo:'Not yet',ok:'Booked. Saturday 8:00pm, party of 4. Confirmation saved.',card:['Cantinho do Sol','Sat 8:00pm · party of 4','CONFIRMATION SAVED'],nok:'Okay. Nothing was booked.'}}]},
{g:FOUNDERS,ctx:[['Dev','the office is out of usb-c cables again'],['Lore','Want me to order a few? I will stop at checkout and show you the total first.']],
 ask:'@lore yes, order 3 on amazon',
 out:[{m:'Setting it up on Amazon now. I will take it right up to the order screen.'},
  {w:['signed in with your saved login','searched usb-c cable 6ft, 4.5 stars and up','added 3 to the cart','opened checkout and stopped']},
  {m:'Sent you the total privately, since it shows your card and address.'},
  {c:['Ready for your ok · sent to Dev only','3 cables · $23.97 + tax · Visa ending 4242','NOT ORDERED YET']},
  {a:{yes:'Approve order',no:'Not yet',youYes:'Approve',youNo:'Not yet',ok:'Ordered. Arrives Thursday. Receipt saved.',card:['Amazon order','3 × USB-C cable · $25.83','RECEIPT SAVED'],nok:'Okay. Nothing was ordered.'}}]}
];
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function add(e){thread.appendChild(e);thread.scrollTop=thread.scrollHeight;return e}
function group(g){
  gname.textContent=g.name;gmem.textContent=g.mem;gav.textContent='';
  g.av.forEach(function(a){var i=el('i','',a[0]);i.style.background=a[1];gav.appendChild(i)})}
function msg(from,text){
  var out=from==='You',m=el('div','m '+(out?'out':'in')+(from==='Lore'?' lore':''));
  if(!out)m.appendChild(el('span','who',from));
  m.appendChild(el('div','b',text));return add(m)}
function work(lines,id){
  var w=add(el('div','work'));
  return (async function(){for(var i=0;i<lines.length;i++){if(id!==run)return;await wait(650);if(id!==run)return;w.appendChild(el('div','',lines[i]));thread.scrollTop=thread.scrollHeight}})()}
function card(c){var d=el('div','card');d.appendChild(el('div','t',c[0]));d.appendChild(el('div','s',c[1]));d.appendChild(el('div','g',c[2]));add(d)}
function screen(s){var d=el('div','screen'),tb=el('div','tb');tb.appendChild(el('i'));tb.appendChild(el('i'));tb.appendChild(el('i'));tb.appendChild(el('span','',s[0]));d.appendChild(tb);d.appendChild(el('pre','',s[1]));d.appendChild(el('div','live','SANDBOX · LORE-OWNED'));add(d)}
async function lore(text,id){
  var t=add(el('div','typing'));t.innerHTML='<i></i><i></i><i></i>';
  await wait(700+Math.min(text.length*10,900));
  if(t.parentNode)t.parentNode.removeChild(t);
  if(id!==run)return false;msg('Lore',text);return true}
function approve(cfg,id){
  var a=add(el('div','acts')),y=el('button','p',cfg.yes),n=el('button','',cfg.no);
  a.appendChild(y);a.appendChild(n);
  function done(){y.disabled=n.disabled=true}
  y.onclick=async function(){done();msg('You',cfg.youYes);if(await lore(cfg.ok,id)){card(cfg.card);finish(id)}};
  n.onclick=async function(){done();msg('You',cfg.youNo);if(await lore(cfg.nok,id))finish(id)}}
async function play(steps,id){
  for(var i=0;i<steps.length;i++){
    if(id!==run)return;var s=steps[i];
    if(s.m){if(!await lore(s.m,id))return}
    else if(s.w){await work(s.w,id)}
    else if(s.s){await wait(300);if(id!==run)return;screen(s.s)}
    else if(s.c){await wait(300);if(id!==run)return;card(s.c)}
    else if(s.a){await wait(300);if(id!==run)return;approve(s.a,id);return}}
  finish(id)}
function finish(id){if(id!==run)return;busy(false);chips.textContent='';chip('Replay this',function(){pick(cur)});chip('Next example',function(){pick((cur+1)%SCENES.length)})}
function chip(t,f){var b=el('button','chip',t);b.type='button';b.onclick=f;chips.appendChild(b)}
function busy(b){input.disabled=b;send.disabled=b}
function mark(i){tabs.forEach(function(t,k){t.setAttribute('aria-pressed',k===i?'true':'false')})}
async function pick(i,skipCtx){
  var id=++run;cur=i;mark(i);thread.textContent='';chips.textContent='';busy(true);
  var S=SCENES[i];group(S.g);
  for(var k=0;k<S.ctx.length;k++){
    if(id!==run)return;
    if(!skipCtx&&!reduce)await wait(k?800:300);
    if(id!==run)return;msg(S.ctx[k][0],S.ctx[k][1])}
  if(id!==run)return;
  chip(S.ask,function(){ask(S.ask,i)});busy(false)}
async function ask(text,i){
  var id=++run;cur=i;mark(i);chips.textContent='';busy(true);msg('You',text);
  await wait(500);if(id!==run)return;await play(SCENES[i].out,id)}
function route(t){
  t=t.toLowerCase();
  if(/order|buy|amazon|cart|checkout|purchase/.test(t))return 6;
  if(/book|reserve|table|dinner|restaurant/.test(t))return 5;
  if(/flight|trip|hotel|stay|travel|lisbon/.test(t))return 4;
  if(/send|email/.test(t))return 3;
  if(/decid|remember|agreed|we said|recall/.test(t))return 1;
  if(/file|brief|export|download|computer|sandbox|one page|write up|draft/.test(t))return 2;
  if(/compet|pric|research|compare|look up|find/.test(t))return 0;
  return -1}
form.onsubmit=async function(e){
  e.preventDefault();var t=input.value.trim();if(!t)return;input.value='';
  var i=route(t);
  if(i<0){run++;chips.textContent='';msg('You',t);var id=run;busy(true);await wait(400);await lore('This preview is scripted, so I only know a few tricks. Try one of these.',id);if(id!==run)return;busy(false);chips.textContent='';SCENES.forEach(function(s,k){chip(s.ask,function(){pick(k,true).then(function(){ask(s.ask,k)})})});return}
  if(i!==cur||!thread.children.length){await pick(i,true);}
  ask(t,i)};
tabs.forEach(function(b,i){b.onclick=function(){pick(i)}});
var started=false;
function start(){if(started)return;started=true;pick(0)}
if('IntersectionObserver' in window){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){start();o.disconnect()}},{threshold:.35}).observe(document.querySelector('.phone'))}else start();
})();
