(function(){
var $=function(i){return document.getElementById(i)};
var phone=$('phone'),slack=$('slack'),thread=$('thread'),chips=$('chips'),form=$('imform'),input=$('imtext'),sendb=form.querySelector('button');
var gname=$('gname'),gmem=$('gmem'),gav=$('gav'),back=$('back'),ban=$('ban'),cap=$('cap');
var sth=$('sthread'),sch=$('schips');
var tabs=[].slice.call(document.querySelectorAll('.tabs button'));
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var wait=function(ms){return new Promise(function(r){setTimeout(r,reduce?Math.min(ms,50):ms)})};
var run=0,act=-1;
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
var GC={name:'Weekend',mem:'Maya, Priya, Jonas, lore',av:[['M','#5e8f7a'],['P','#b5707b'],['J','#6e9ab5'],['L','#242820']]};
var DM={name:'lore',mem:'Only you and lore',av:[['L','#242820']]};
var CAPS=[
 ['The group agent works for the room. Everyone in the chat can ask it for things.','Tap the suggestion in the phone, or type your own.'],
 ['Your personal agent works for you. It keeps what you tell it out of the group.','Same lore, separate memory. Nothing crosses without your say.'],
 ['In Slack, agents take on work in parallel and report back in the thread.','Browser, computer and drafts, with a yes needed before anything is sent.']];
var ACTS=[
 {view:'phone',g:GC,ctx:[['Priya','saturday?? who is actually free'],['Jonas','after 6 for me'],['Maya','same, and something not too loud']],
  ask:'@lore plan saturday for the four of us',
  out:[{m:'Looking at what everyone said and what is open.'},
   {w:['read the thread: Maya after 6, Jonas after 6, quiet','opened 3 restaurant pages','found 7:30 for 4 at Cantinho do Sol','saved 3 screenshots']},
   {m:'Saturday 7:30pm, Cantinho do Sol. Quiet room, 10 minutes from Jonas. I can hold it while you decide.'},
   {c:['Saturday plan','Cantinho do Sol · 7:30pm · party of 4','HOLD READY']}],
  next:{ask:'@lore split the $248 and collect it',out:[{m:'$62 each. I will message Priya and Jonas a request. Nothing goes out until you approve.'},
   {a:{yes:'Approve',no:'Edit',youYes:'Approve',youNo:'Edit',ok:'Requests sent to Priya and Jonas. I will tell the group when everyone has paid.',card:['2 requests sent','$62 each · from your account','SENT'],nok:'Okay. Nothing was sent.'}}]}},
 {view:'dm',g:DM,ctx:[['Lore','Quick one, just for you. You said you cannot do anything before 11 on Saturday. I kept that out of the group.'],['Lore','Your dentist is at 9am Saturday. Want me to move it?']],
  ask:'yes, move it',
  out:[{m:'Checking your calendar and their booking page.'},
   {w:['read your calendar, private to you','opened the clinic booking page','found Tuesday 4:00pm, free for you']},
   {m:'Tuesday 4:00pm works. Move it?'},
   {a:{yes:'Move it',no:'Not now',youYes:'Move it',youNo:'Not now',ok:'Moved to Tuesday 4:00pm. Confirmation saved.',card:['Dentist, Tuesday 4:00pm','Booked · calendar updated','CONFIRMED'],nok:'Okay. I left it where it is.'}}]}
];
// ---- phone
function group(g){gname.textContent=g.name;gmem.textContent=g.mem;gav.textContent='';g.av.forEach(function(a){var i=el('i','',a[0]);i.style.background=a[1];gav.appendChild(i)})}
function add(e){thread.appendChild(e);thread.scrollTop=thread.scrollHeight;return e}
function msg(from,text){var out=from==='You',m=el('div','m '+(out?'out':'in')+(from==='Lore'?' lore':''));if(!out&&act===0)m.appendChild(el('span','who',from));if(!out&&act===1&&from!=='Lore')m.appendChild(el('span','who',from));m.appendChild(el('div','b',text));return add(m)}
function work(lines,id){var w=add(el('div','work'));return(async function(){for(var i=0;i<lines.length;i++){if(id!==run)return;await wait(650);if(id!==run)return;w.appendChild(el('div','',lines[i]));thread.scrollTop=thread.scrollHeight}})()}
function card(c){var d=el('div','card');d.appendChild(el('div','t',c[0]));d.appendChild(el('div','s',c[1]));d.appendChild(el('div','g',c[2]));add(d)}
async function lore(text,id){var t=add(el('div','typing'));t.innerHTML='<i></i><i></i><i></i>';await wait(650+Math.min(text.length*9,800));if(t.parentNode)t.parentNode.removeChild(t);if(id!==run)return false;msg('Lore',text);return true}
function approve(cfg,id,done){var a=add(el('div','acts')),y=el('button','p',cfg.yes),n=el('button','',cfg.no);a.appendChild(y);a.appendChild(n);
 function d(){y.disabled=n.disabled=true}
 y.onclick=async function(){d();msg('You',cfg.youYes);if(await lore(cfg.ok,id)){card(cfg.card);done(id)}};
 n.onclick=async function(){d();msg('You',cfg.youNo);if(await lore(cfg.nok,id))done(id)}}
function chip(t,f){var b=el('button','chip',t);b.type='button';b.onclick=f;chips.appendChild(b)}
function busy(b){input.disabled=b;sendb.disabled=b}
async function playPhone(steps,id,done){for(var i=0;i<steps.length;i++){if(id!==run)return;var s=steps[i];
 if(s.m){if(!await lore(s.m,id))return}else if(s.w){await work(s.w,id)}else if(s.c){await wait(300);if(id!==run)return;card(s.c)}else if(s.a){await wait(300);if(id!==run)return;approve(s.a,id,done);return}}
 done(id)}
function after(i,second){return function(id){if(id!==run)return;busy(false);chips.textContent='';
 var A=ACTS[i];
 if(!second&&A.next){chip(A.next.ask,function(){askPhone(A.next.ask,i,A.next.out,true)})}
 else if(i===0){notify()}
 else chip('Replay',function(){goto(i)})}}
async function askPhone(text,i,out,second){var id=++run;chips.textContent='';busy(true);hideBan();msg('You',text);await wait(450);if(id!==run)return;await playPhone(out||ACTS[i].out,id,after(i,!!second))}
function notify(){ban.classList.add('on');ban.onclick=function(){goto(1)}}
function hideBan(){ban.classList.remove('on')}
function inbox(){thread.textContent='';var d=el('div','inbox');d.appendChild(el('h4','','Messages'));
 [['W','#5e8f7a','Weekend','Maya: same, and something not too loud',0],['L','#242820','lore','Quick one, just for you',1]].forEach(function(r){var b=el('button');var i=el('i','',r[0]);i.style.background=r[1];var t=el('span');t.appendChild(el('b','',r[2]));t.appendChild(el('small','',r[3]));b.appendChild(i);b.appendChild(t);if(r[4])b.appendChild(el('u'));else b.appendChild(el('span'));b.onclick=function(){goto(r[4])};d.appendChild(b)});
 thread.appendChild(d);gname.textContent='';gmem.textContent='';gav.textContent='';back.hidden=true}
// ---- slack
function sadd(e){sth.appendChild(e);sth.scrollTop=sth.scrollHeight;return e}
function smsg(name,color,text,app){var m=el('div','sm'),a=el('div','av2',name[0]);a.style.background=color;var b=el('div');var n=el('div','n',name);if(app)n.appendChild(el('em','','APP'));b.appendChild(n);b.appendChild(el('div','t',text));m.appendChild(a);m.appendChild(b);sadd(m);return b}
var AGENTS=[
 ['Research','browser',['opening 3 pricing pages','reading and comparing','saved 3 screenshots'],'competitor-brief.md'],
 ['Workspace','computer',['starting sandbox','opening editor','typing the checklist','exporting file'],'launch-checklist.md'],
 ['Comms','drafts',['reading the thread','drafting the partner email','waiting for approval'],'partner-email, draft']];
async function playSlack(id){
 sch.textContent='';
 await wait(500);if(id!==run)return;
 var b=smsg('Lore','#242820','Taking this. Three agents, in parallel.',true);
 var box=el('div','ag');b.appendChild(box);var rows=[];
 AGENTS.forEach(function(a){var r=el('div','r'),k=el('div','k',a[0]);k.appendChild(el('small','',a[1]));var s=el('div','s'),st=el('div','',a[2][0]),bar=el('div','bar');bar.appendChild(el('i'));s.appendChild(st);s.appendChild(bar);var ok=el('div','ok','✓');r.appendChild(k);r.appendChild(s);r.appendChild(ok);box.appendChild(r);rows.push({st:st,bar:bar.firstChild,ok:ok})});
 sth.scrollTop=sth.scrollHeight;
 await Promise.all(AGENTS.map(function(a,i){return(async function(){for(var k=0;k<a[2].length;k++){await wait(900+i*350);if(id!==run)return;rows[i].st.textContent=a[2][k];rows[i].bar.style.width=Math.round((k+1)/a[2].length*100)+'%'}
  if(id!==run)return;if(i<2){rows[i].st.textContent='done · '+a[3];rows[i].ok.classList.add('on')}})()}));
 if(id!==run)return;
 await wait(500);if(id!==run)return;
 var s=smsg('Lore','#242820','Research and the checklist are done. The partner email is drafted and waiting for Maya.',true);
 s.appendChild(el('span','art','competitor-brief.md'));s.appendChild(document.createTextNode(' '));s.appendChild(el('span','art','launch-checklist.md'));
 var bt=el('div','sbtns'),y=el('button','p','Approve and send'),n=el('button','','Edit');bt.appendChild(y);bt.appendChild(n);s.appendChild(bt);
 function dis(){y.disabled=n.disabled=true}
 y.onclick=async function(){dis();smsg('Maya','#5e8f7a','Approved.');await wait(700);if(id!==run)return;var r=smsg('Lore','#242820','Sent to 12 design partners from Maya\'s address. Receipt saved.',true);r.appendChild(el('span','art','12 of 12 delivered'));slackEnd(id)};
 n.onclick=async function(){dis();smsg('Maya','#5e8f7a','Edit');await wait(600);if(id!==run)return;smsg('Lore','#242820','Tell me what to change. Nothing has been sent.',true);slackEnd(id)}}
function slackEnd(id){if(id!==run)return;var b=el('button','chip2','Replay');b.onclick=function(){goto(2)};sch.appendChild(b)}
function startSlack(){var id=++run;sth.textContent='';sch.textContent='';
 smsg('Maya','#5e8f7a','launch is tuesday. we need competitor numbers, the checklist, and the partner email by tonight');
 smsg('Dev','#c08a5b','on it, kind of');
 var b=el('button','chip2','@lore take it');b.onclick=function(){sch.textContent='';smsg('Maya','#5e8f7a','@lore take it');playSlack(id)};sch.appendChild(b)}
// ---- navigation
async function goto(i){
 var id=++run;act=i;hideBan();
 tabs.forEach(function(t,k){t.setAttribute('aria-selected',k===i?'true':'false')});
 cap.firstChild.textContent=CAPS[i][0];cap.querySelector('small').textContent=CAPS[i][1];
 if(i===2){phone.classList.add('off');slack.classList.add('on');startSlack();return}
 slack.classList.remove('on');phone.classList.remove('off');
 var A=ACTS[i];thread.textContent='';chips.textContent='';busy(true);group(A.g);back.hidden=false;back.textContent='‹ Messages';
 for(var k=0;k<A.ctx.length;k++){if(id!==run)return;await wait(k?750:250);if(id!==run)return;msg(A.ctx[k][0],A.ctx[k][1])}
 if(id!==run)return;busy(false);
 chip(A.ask,function(){askPhone(A.ask,i)})}
function route(t){t=t.toLowerCase();if(/split|pay|venmo|cost/.test(t))return 'split';if(/dentist|move|private|calendar|remind/.test(t))return 1;if(/plan|saturday|dinner|book|restaurant|find/.test(t))return 0;return -1}
form.onsubmit=async function(e){e.preventDefault();var t=input.value.trim();if(!t)return;input.value='';var r=route(t);
 if(r==='split'){if(act!==0)await goto(0);var A=ACTS[0];askPhone(t,0,A.next.out,true);return}
 if(r<0){var id=++run;chips.textContent='';msg('You',t);busy(true);await wait(400);await lore('This preview is scripted. Try: plan saturday, split the bill, or move my dentist.',id);if(id!==run)return;busy(false);return}
 if(r!==act||!thread.children.length){await goto(r);run++}
 askPhone(t,r)};
back.onclick=function(){run++;chips.textContent='';busy(false);inbox()};
tabs.forEach(function(b,i){b.onclick=function(){goto(i)}});
var started=false;function start(){if(started)return;started=true;goto(0)}
if('IntersectionObserver' in window){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){start();o.disconnect()}},{threshold:.3}).observe($('stage'))}else start();
})();
