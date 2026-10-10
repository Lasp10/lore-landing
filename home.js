(function(){
var $=function(i){return document.getElementById(i)};
var phone=$('phone'),scr=$('scr'),hdr=$('hdr'),vid=$('vid'),rig=$('rig'),tilt=$('tilt'),thread=$('thread'),form=$('imform'),input=$('imtext'),sendb=form.querySelector('button');
var gname=$('gname'),gmem=$('gmem'),gav=$('gav'),back=$('back'),ntf=$('ntf'),cap=$('cap');
var chap=[].slice.call($('chap').querySelectorAll('button'));
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var wait=function(ms){return new Promise(function(r){setTimeout(r,reduce?Math.min(ms,40):ms)})};
var run=0,mode='dm';
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function add(e){thread.appendChild(e);thread.scrollTop=thread.scrollHeight;return e}
var C={Maya:'#5e8f7a',Priya:'#b5707b',Jonas:'#6e9ab5'};
var C2={Dev:'#c08a5b',Sam:'#7b83b5'};var GR={crew:{n:'Launch Crew',a:[['M',C.Maya],['D','#c08a5b'],['S','#7b83b5'],['L','#242820']]},weekend:{n:'Weekend',a:[['M',C.Maya],['P',C.Priya],['J',C.Jonas],['L','#242820']]}};
function avs(list){gav.textContent='';if(list==='lore'){var im=el('img');im.src='/lore-logo-512.png';im.alt='';gav.appendChild(im);return}list.forEach(function(a){var i=el('i','',a[0]);i.style.background=a[1];gav.appendChild(i)})}
function head(m,g){mode=m;hdr.classList.toggle('g',m==='gc');hdr.hidden=(m==='list');back.hidden=(m==='dm'&&false)||m==='list';vid.hidden=false;
 if(m==='dm'){avs('lore');gname.textContent='lore';gmem.textContent=''}
 if(m==='gc'){var G=GR[g||'crew'];avs(G.a);gname.textContent=G.n;gmem.textContent=''}
 input.placeholder='iMessage'}
function show(m,fn,g){return new Promise(function(res){thread.classList.remove('sw');thread.textContent='';head(m,g);void thread.offsetWidth;thread.classList.add('sw');if(fn)fn();setTimeout(res,reduce?0:300)})}
// ---- messages
function msg(from,text){
  var out=from==='You'||from==='Maya',key=out?'You':from,m=el('div','m '+(out?'out':'in')+(from==='Lore'?' lore':''));
  var dl=thread.querySelector('.dlv');if(dl)dl.remove();
  var prev=thread.lastElementChild,same=prev&&prev.classList&&prev.classList.contains('m')&&prev.classList.contains(out?'out':'in')&&prev.dataset.f===key;
  if(!out&&mode==='gc'&&!same)m.appendChild(el('span','who',from==='Lore'?'lore':from));
  m.appendChild(el('div','b tail',text));m.dataset.f=key;
  if(same){var pb=prev.querySelector('.b');if(pb)pb.classList.remove('tail')}
  add(m);if(out)add(el('div','dlv','Delivered'));return m}
function dots(){var t=add(el('div','typing'));t.innerHTML='<i></i><i></i><i></i>';return t}
async function say(from,text,id){var t=dots();await wait(430+Math.min(text.length*11,720));if(t.parentNode)t.parentNode.removeChild(t);if(id!==run)return false;msg(from,text);await wait(380);return id===run}
async function typeAs(text,id){ // Maya types into the composer, then sends
  input.value='';for(var i=0;i<text.length;i++){if(id!==run)return false;input.value+=text[i];await wait(reduce?0:26)}
  await wait(260);if(id!==run)return false;input.value='';msg('You',text);await wait(350);return id===run}
function work(lines,id){var w=add(el('div','work'));return(async function(){for(var i=0;i<lines.length;i++){if(id!==run)return;await wait(620);if(id!==run)return;w.appendChild(el('div','',lines[i]));thread.scrollTop=thread.scrollHeight}await wait(300)})()}
function card(c){var d=el('div','card');d.appendChild(el('div','t',c[0]));d.appendChild(el('div','s',c[1]));d.appendChild(el('div','g',c[2]));add(d)}
// approval: tap, or it plays itself after a beat
function approve(yes,no,id){return new Promise(function(res){var a=add(el('div','acts')),y=el('button','p',yes),n=el('button','',no);a.appendChild(y);a.appendChild(n);
 var fin=false;function done(v){if(fin)return;fin=true;y.disabled=n.disabled=true;clearTimeout(tm);res(v)}
 y.onclick=function(){done(1)};n.onclick=function(){done(0)};var tm=setTimeout(function(){if(id===run)done(1)},reduce?50:4200)})}
function pulse(i){if(window.fabricPulse)window.fabricPulse(i)}
function setChap(i){chap.forEach(function(b,k){b.setAttribute('aria-current',k===i?'true':'false')});
 cap.textContent=['Memory with receipts, research in a browser, files from its own computer, and nothing sent without your yes.','Same agent, different room. It books with a private login link, so a password never enters the chat.','Your personal agent keeps what you tell it out of the group.','One agent in your group chats. One just for you.'][i];pulse(i)}
function ok(id){return id===run}
// ---- chapters
function screen(t,body){var d=el('div','screen'),tb=el('div','tb');tb.appendChild(el('i'));tb.appendChild(el('i'));tb.appendChild(el('i'));tb.appendChild(el('span','',t));d.appendChild(tb);d.appendChild(el('pre','',body));d.appendChild(el('div','live','LORE’S OWN COMPUTER'));add(d)}
async function ch0(id){
 setChap(0);await show('gc',null,'crew');if(!ok(id))return;
 add(el('div','ts','Today 10:04 AM'));
 if(!await say('Dev','pricing doc says $29 but the deck says $39??',id))return;
 if(!await typeAs('@lore what did we land on?',id))return;
 if(!await say('Lore','$29 a month, no free tier. Maya proposed it and Dev agreed in this chat on Oct 3. The deck is out of date.',id))return;
 card(['Source','This thread · Oct 3 · Maya, Dev','MEMORY']);await wait(700);
 if(!await say('Sam','investor update goes out today. need competitor pricing on one page',id))return;
 if(!await typeAs('@lore get it and put it on a page I can send',id))return;
 if(!await say('Lore','On it. Reading their public pricing pages, then building the page.',id))return;
 await work(['opened northwind.example/pricing','opened parcel.example/pricing','opened fieldnote.example/pricing','saved 3 screenshots'],id);if(!ok(id))return;
 await work(['started a sandboxed computer','typed the prices with their sources','exported competitor-one-pager.md'],id);if(!ok(id))return;
 screen('lore workspace · editor','# Competitor pricing\n\nNorthwind   $24 / seat\nParcel      $19 flat, up to 10\nFieldnote   custom quote only\n\nYour price  $29 / month\nSources: 3 pages, screenshots saved');await wait(900);
 if(!await say('Lore','Done. You are above Parcel and below Northwind at your team size.',id))return;
 card(['competitor-one-pager.md','Markdown · 1 page · 3 sources','COMPUTER RUN RECEIPT']);await wait(700);
 if(!await typeAs('@lore email it to the 12 investors from me',id))return;
 if(!await say('Lore','Drafted from your last update. 12 recipients, from your address. Nothing sends until you approve.',id))return;
 var r=await approve('Approve and send','Edit',id);if(!ok(id))return;
 msg('You',r?'Approve and send':'Edit');await wait(450);
 if(!await say('Lore',r?'Sent to 12 investors. Receipt saved.':'Okay. Nothing was sent.',id))return;
 if(r)card(['Delivery receipt','12 of 12 delivered','CONFIRMED']);
 await wait(1300);if(ok(id))ch1(id)}
async function ch1(id){
 if(!ok(id))return;setChap(1);
 await show('list',inbox);await wait(900);if(!ok(id))return;
 await show('gc',null,'weekend');if(!ok(id))return;
 add(el('div','ts','Today 6:12 PM'));
 if(!await say('Priya','saturday?? who is actually free',id))return;
 if(!await say('Jonas','after 6 for me. under $400 flights if we do lisbon',id))return;
 if(!await typeAs('@lore flights from SF and a place for 4, nov 13 to 16',id))return;
 await work(['opened flights.example, SFO to LIS','filtered to under $400','opened stays.example, 4 guests','saved 6 screenshots'],id);if(!ok(id))return;
 if(!await say('Lore','Nonstop is $412, one stop is $368. Best 4 person place is $540 total in Alfama.',id))return;
 card(['Poll: nonstop $412 or one stop $368?','Reply 1 or 2 · closes tonight','POLL OPEN']);await wait(800);
 if(!await say('Priya','one stop. and dinner saturday?',id))return;
 if(!await typeAs('@lore book a table for 4 at 8',id))return;
 if(!await say('Lore','Found Cantinho do Sol at 8:00pm. The booking needs an account, and I will not take a password in this chat.',id))return;
 card(['Private login link','Opens a secure page · used once, then wiped','SECURE LINK']);await wait(900);
 if(!await say('Lore','Once that is in I will confirm the details with you before I book anything.',id))return;
 var r=await approve('Yes, book it','Not yet',id);if(!ok(id))return;
 msg('You',r?'Yes, book it':'Not yet');await wait(450);
 if(!await say('Lore',r?'Booked. Saturday 8:00pm, party of 4. Confirmation saved.':'Okay. Nothing was booked.',id))return;
 if(r)card(['Cantinho do Sol','Sat 8:00pm · party of 4','CONFIRMATION SAVED']);
 await wait(1300);if(ok(id))ch2(id)}
async function ch2(id){
 if(!ok(id))return;setChap(2);
 ntf.classList.add('on');
 await new Promise(function(res){var fin=false;function go(){if(fin)return;fin=true;clearTimeout(tm);res()}ntf.onclick=go;var tm=setTimeout(go,reduce?50:2400)});
 ntf.classList.remove('on');if(!ok(id))return;
 await show('dm');if(!ok(id))return;
 add(el('div','ts','Today 6:20 PM'));
 if(!await say('Lore','quick one, just for you. you told me nothing before 11 on saturday, so I kept that out of the group.',id))return;
 if(!await say('Lore','your dentist is saturday at 9am. want me to move it?',id))return;
 if(!await typeAs('yes, and remind me thursday',id))return;
 await work(['read your calendar, private to you','opened the clinic booking page','found Tuesday 4:00pm, free for you','set a reminder for Thursday 8am'],id);if(!ok(id))return;
 if(!await say('Lore','Tuesday 4:00pm works. Move it?',id))return;
 var r=await approve('Move it','Not now',id);if(!ok(id))return;
 msg('You',r?'Move it':'Not now');await wait(450);
 if(!await say('Lore',r?'Done. Tuesday 4:00pm, reminder set for Thursday.':'Okay. I left it where it is.',id))return;
 if(r)card(['Dentist, Tuesday 4:00pm','Booked · calendar updated','CONFIRMED']);
 await wait(800);
 if(!await say('Lore','also, your mom’s birthday is thursday. want me to find a gift under $60?',id))return;
 if(!await typeAs('yes please',id))return;
 await work(['opened 3 shops','compared prices and delivery by thursday','saved 3 screenshots'],id);if(!ok(id))return;
 if(!await say('Lore','Three that arrive by Wednesday. The $48 candle set is the best fit. I will not buy anything without your yes.',id))return;
 card(['Gift ideas for Mom','3 options · all under $60','NOTHING PURCHASED']);
 await wait(900);
 if(!await say('Lore','that stayed between us. nobody in the group saw it.',id))return;
 await wait(1200);if(ok(id))ch3(id)}
async function ch3(id){
 if(!ok(id))return;setChap(3);
 await show('dm');if(!ok(id))return;
 if(!await say('Lore','that is lore. one in every group chat, one just for you.',id))return;
 if(!await say('Lore','try it where you already talk.',id))return;
 var o=el('div','opts');
 var a=el('a','opt go','Try it on iMessage');a.href='sms:+18083199759?&body=hi%20lore';
 var b=el('a','opt go sl','Try it on Slack');b.href='/waitlist/?p=slack';
 var c=el('button','opt mute','Watch again');c.type='button';c.onclick=function(){start(0)};
 o.appendChild(a);o.appendChild(b);o.appendChild(c);add(o);
 input.readOnly=false;input.placeholder='Ask lore anything'}
function inbox(){
 var d=el('div','inbox');d.appendChild(el('h4','','Messages'));
 [['L','#c08a5b','Launch Crew','Lore: Sent to 12 investors. Receipt saved.',0],['W',C.Priya,'Weekend','Priya: saturday?? who is actually free',0],['lore','#0b0b0b','lore','Quick one, just for you.',1],['M','#8d8f94','Mom','sunday still on?',0]].forEach(function(r){
  var row=el('div','row'),i=el('i');if(r[0]==='lore'){var im=el('img');im.src='/lore-logo-512.png';im.alt='';i.appendChild(im)}else{i.textContent=r[0];i.style.background=r[1]}
  var t=el('div');t.appendChild(el('b','',r[2]));t.appendChild(el('small','',r[3]));row.appendChild(i);row.appendChild(t);row.appendChild(r[4]?el('u'):el('span'));d.appendChild(row)});
 thread.appendChild(d)}
function start(i){var id=++run;input.readOnly=true;input.value='';input.placeholder='iMessage';ntf.classList.remove('on');
 [ch0,ch1,ch2,ch3][i](id)}
chap.forEach(function(b,i){b.onclick=function(){start(i)}});
back.onclick=function(){start(2)};
form.onsubmit=function(e){e.preventDefault();var t=input.value.trim();if(!t||input.readOnly)return;input.value='';var id=++run;
 [].forEach.call(thread.querySelectorAll('.opts'),function(o){o.remove()});msg('You',t);
 (async function(){if(await say('Lore','this is a preview. text me for real, or find me in Slack.',id)){var o=el('div','opts'),a=el('a','opt go','Try it on iMessage'),b=el('a','opt go sl','Try it on Slack');a.href='sms:+18083199759?&body=hi%20lore';b.href='/waitlist/?p=slack';o.appendChild(a);o.appendChild(b);add(o)}})()};
// ---- fit + tilt
function fit(){var k=innerWidth>900?Math.min(1,(innerHeight-130)/840):Math.min(1,(innerHeight-330)/840,(innerWidth-16)/412);if(k<.5)k=.5;rig.style.height=Math.round(840*k)+'px';rig.style.width=Math.round(412*k)+'px';phone.style.transform='scale('+k+')'}
fit();addEventListener('resize',fit);
if(!reduce&&matchMedia('(hover:hover)').matches){addEventListener('mousemove',function(e){if(phone.contains(e.target))return;var cx=innerWidth/2,cy=innerHeight/2;tilt.style.transform='rotateY('+((e.clientX-cx)/cx*4).toFixed(2)+'deg) rotateX('+(-(e.clientY-cy)/cy*2.5).toFixed(2)+'deg)'});document.addEventListener('mouseleave',function(){tilt.style.transform=''})}
setTimeout(function(){start(0)},500);
})();
