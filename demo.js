(function(){
var thread=document.getElementById('thread'),chips=document.getElementById('chips'),form=document.getElementById('imform'),input=document.getElementById('imtext'),send=form.querySelector('button');
var tabs=[].slice.call(document.querySelectorAll('.scenes button'));
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var wait=function(ms){return new Promise(function(r){setTimeout(r,reduce?Math.min(ms,60):ms)})};
var run=0,cur=0;
var SCENES=[
{ctx:[['Dev','we need to know who else sells to seed-stage ops teams'],['Sam','someone look at their pricing before friday']],
 ask:'@lore compare the top 3 competitors on pricing',
 out:[{m:'On it. I will read their public pricing pages.'},
  {w:['opened northwind.example/pricing','opened parcel.example/pricing','opened fieldnote.example/pricing','saved 3 screenshots']},
  {m:'Northwind is $24 per seat. Parcel is $19 flat up to 10 people. Fieldnote only shows custom quotes.\n\nAt your team size Parcel is the one that undercuts you.'},
  {c:['Competitor pricing brief','3 pages read · screenshots attached','SOURCES CITED']}]},
{ctx:[['Maya','ok so we are launching Tuesday and pricing stays at $29'],['Dev','agreed, no free tier'],['Lore','Noted: launch Tuesday, $29, no free tier. I will hold that for the room.']],
 ask:'@lore what did we decide on pricing?',
 out:[{m:'$29 a month, no free tier. Maya proposed it and Dev agreed on Oct 3. Launch is Tuesday.'},
  {m:'One open thing: nobody has said whether annual billing is in. Want me to put that on the list?'}]},
{ctx:[['Sam','investor update is due friday'],['Dev','we shipped invites and fixed the billing bug this week']],
 ask:'@lore draft the update from this week',
 out:[{m:'Drafting from this thread.'},
  {w:['read 4 decisions from this room','read 2 shipped items','wrote draft','checked every figure against the thread']},
  {m:'Draft is ready. I only used what is in this room, so the revenue line is blank for you to fill in.'},
  {c:['Investor update, week of Oct 6','Draft · 1 blank to fill','DOC READY']}]},
{ctx:[['Maya','email the 12 design partners about Tuesday']],
 ask:'@lore send it',
 out:[{m:'Drafted. I will not send anything until you approve it. It goes from your address to 12 people.'},
  {c:['To 12 design partners','Launch moves to Tuesday, 10am PT','WAITING FOR MAYA']},{a:1}]}
];
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function add(e){thread.appendChild(e);thread.scrollTop=thread.scrollHeight;return e}
function msg(from,text){
  var out=from==='You',m=el('div','m '+(out?'out':'in')+(from==='Lore'?' lore':''));
  if(!out)m.appendChild(el('span','who',from));
  m.appendChild(el('div','b',text));return add(m)}
function work(lines,id){
  var w=add(el('div','work'));
  return (async function(){for(var i=0;i<lines.length;i++){if(id!==run)return;await wait(650);if(id!==run)return;w.appendChild(el('div','',lines[i]));thread.scrollTop=thread.scrollHeight}})()}
function card(c){var d=el('div','card');d.appendChild(el('div','t',c[0]));d.appendChild(el('div','s',c[1]));d.appendChild(el('div','g',c[2]));add(d)}
async function lore(text,id){
  var t=add(el('div','typing'));t.innerHTML='<i></i><i></i><i></i>';
  await wait(700+Math.min(text.length*10,900));
  if(t.parentNode)t.parentNode.removeChild(t);
  if(id!==run)return false;msg('Lore',text);return true}
function approve(id){
  var a=add(el('div','acts')),y=el('button','p','Approve and send'),n=el('button','','Edit');
  a.appendChild(y);a.appendChild(n);
  function done(){y.disabled=n.disabled=true}
  y.onclick=async function(){done();msg('You','Approve');if(await lore('Sent to 12 design partners from your address. Receipt saved.',id)){card(['Delivery receipt','12 of 12 delivered','CONFIRMED']);finish(id)}};
  n.onclick=async function(){done();msg('You','Edit');if(await lore('Tell me what to change. Nothing has been sent.',id))finish(id)}}
async function play(steps,id){
  for(var i=0;i<steps.length;i++){
    if(id!==run)return;var s=steps[i];
    if(s.m){if(!await lore(s.m,id))return}
    else if(s.w){await work(s.w,id)}
    else if(s.c){await wait(300);if(id!==run)return;card(s.c)}
    else if(s.a){await wait(300);if(id!==run)return;approve(id);return}}
  finish(id)}
function finish(id){if(id!==run)return;busy(false);chips.textContent='';chip('Replay this',function(){pick(cur)});chip('Next example',function(){pick((cur+1)%SCENES.length)})}
function chip(t,f){var b=el('button','chip',t);b.type='button';b.onclick=f;chips.appendChild(b)}
function busy(b){input.disabled=b;send.disabled=b}
function mark(i){tabs.forEach(function(t,k){t.setAttribute('aria-pressed',k===i?'true':'false')})}
async function pick(i,skipCtx){
  var id=++run;cur=i;mark(i);thread.textContent='';chips.textContent='';busy(true);
  var S=SCENES[i];
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
  if(/send|email/.test(t))return 3;
  if(/decid|remember|agreed|we said|recall/.test(t))return 1;
  if(/draft|update|write|summar/.test(t))return 2;
  if(/compet|pric|research|compare|look up|find/.test(t))return 0;
  return -1}
form.onsubmit=async function(e){
  e.preventDefault();var t=input.value.trim();if(!t)return;input.value='';
  var i=route(t);
  if(i<0){run++;chips.textContent='';msg('You',t);var id=run;busy(true);await wait(400);await lore('This preview is scripted, so I only know four tricks. Try one of these.',id);if(id!==run)return;busy(false);chips.textContent='';SCENES.forEach(function(s,k){chip(s.ask,function(){pick(k,true).then(function(){ask(s.ask,k)})})});return}
  if(i!==cur||!thread.children.length){await pick(i,true);}
  ask(t,i)};
tabs.forEach(function(b,i){b.onclick=function(){pick(i)}});
var started=false;
function start(){if(started)return;started=true;pick(0)}
if('IntersectionObserver' in window){new IntersectionObserver(function(es,o){if(es[0].isIntersecting){start();o.disconnect()}},{threshold:.35}).observe(document.querySelector('.phone'))}else start();
})();
