(function(){
var $=function(i){return document.getElementById(i)};
var phone=$('phone'),scr=$('scr'),hdr=$('hdr'),vid=$('vid'),rig=$('rig'),tilt=$('tilt'),thread=$('thread'),form=$('imform'),input=$('imtext'),sendb=form.querySelector('button');
var gname=$('gname'),gmem=$('gmem'),gav=$('gav'),back=$('back');
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var wait=function(ms){return new Promise(function(r){setTimeout(r,reduce?Math.min(ms,50):ms)})};
var run=0,mode='dm',done={};
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e}
function busy(b){input.disabled=b;sendb.disabled=b}
function add(e){thread.appendChild(e);thread.scrollTop=thread.scrollHeight;return e}
function avs(list){gav.textContent='';if(list==='lore'){var im=el('img');im.src='/lore-logo-512.png';im.alt='';gav.appendChild(im);return}list.forEach(function(a){var i=el('i','',a[0]);i.style.background=a[1];gav.appendChild(i)})}
var GC=[['M','#5e8f7a'],['P','#b5707b'],['J','#6e9ab5'],['L','#242820']];
function head(m){
  mode=m;scr.classList.toggle('sl',m==='slack');hdr.classList.toggle('g',m==='gc');back.hidden=(m==='dm');vid.hidden=(m==='slack');
  if(m==='dm'){avs('lore');gname.textContent='lore';gmem.textContent='';input.placeholder='iMessage'}
  if(m==='gc'){avs(GC);gname.textContent='Weekend';gmem.textContent='';input.placeholder='iMessage'}
  if(m==='slack'){gname.textContent='# launch-week';gmem.textContent='Acme Labs';input.placeholder='Message #launch-week'}}
async function swap(m){thread.classList.remove('sw');thread.textContent='';head(m);void thread.offsetWidth;thread.classList.add('sw');await wait(260)}
// messages
function msg(from,text){
  if(mode==='slack'){return smsg(from==='You'?'Maya':from,from==='Lore'?'#242820':from==='You'||from==='Maya'?'#5e8f7a':from==='Dev'?'#c08a5b':'#6e9ab5',text,from==='Lore')}
  var out=from==='You',m=el('div','m '+(out?'out':'in')+(from==='Lore'?' lore':''));
  var dl=thread.querySelector('.dlv');if(dl)dl.remove();
  var prev=thread.lastElementChild,sameDir=prev&&prev.classList&&prev.classList.contains('m')&&prev.classList.contains(out?'out':'in');
  if(!out&&mode==='gc'&&!(sameDir&&prev.dataset.f===from))m.appendChild(el('span','who',from));
  var bb=el('div','b tail',text);m.appendChild(bb);m.dataset.f=from;
  if(sameDir&&prev.dataset.f===from){var pb=prev.querySelector('.b');if(pb)pb.classList.remove('tail')}
  add(m);if(out&&from==='You'){var d=el('div','dlv','Delivered');add(d)}return m}
function smsg(name,color,text,app){var m=el('div','sm'),a=el('div','av2',name[0]);a.style.background=color;var b=el('div');var n=el('div','n',name);if(app)n.appendChild(el('em','','APP'));b.appendChild(n);b.appendChild(el('div','t',text));m.appendChild(a);m.appendChild(b);add(m);return b}
async function lore(text,id){
  if(mode==='slack'){await wait(600);if(id!==run)return false;msg('Lore',text);return true}
  var t=add(el('div','typing'));t.innerHTML='<i></i><i></i><i></i>';await wait(600+Math.min(text.length*9,800));if(t.parentNode)t.parentNode.removeChild(t);if(id!==run)return false;msg('Lore',text);return true}
function work(lines,id){var w=add(el('div','work'));return(async function(){for(var i=0;i<lines.length;i++){if(id!==run)return;await wait(650);if(id!==run)return;w.appendChild(el('div','',lines[i]));thread.scrollTop=thread.scrollHeight}})()}
function card(c){var d=el('div','card');d.appendChild(el('div','t',c[0]));d.appendChild(el('div','s',c[1]));d.appendChild(el('div','g',c[2]));add(d)}
function screen(s){var d=el('div','screen'),tb=el('div','tb');tb.appendChild(el('i'));tb.appendChild(el('i'));tb.appendChild(el('i'));tb.appendChild(el('span','',s[0]));d.appendChild(tb);d.appendChild(el('pre','',s[1]));d.appendChild(el('div','live','SANDBOX · LORE-OWNED'));add(d)}
// options (tappable bubbles, right aligned like replies)
function opts(list,id,tail){
  var o=el('div','opts');
  list.forEach(function(it){var b=el(it.href?'a':'button','opt'+(it.cls?' '+it.cls:''),it.t);if(it.href)b.href=it.href;else b.type='button';
    if(!it.href)b.onclick=function(){if(id!==run)return;o.remove();if(!it.silent)msg('You',it.t);it.go()};o.appendChild(b)});
  add(o)}
function approve(cfg,id,next){
  if(mode==='slack'){var s=thread.lastChild.lastChild;var bt=el('div','sbtns'),y=el('button','p',cfg.yes),n=el('button','',cfg.no);bt.appendChild(y);bt.appendChild(n);s.appendChild(bt);thread.scrollTop=thread.scrollHeight;
    y.onclick=async function(){y.disabled=n.disabled=true;msg('You',cfg.youYes);if(await lore(cfg.ok,id)){thread.lastChild.lastChild.appendChild(el('span','art',cfg.card[1]));next(id)}};
    n.onclick=async function(){y.disabled=n.disabled=true;msg('You',cfg.youNo);if(await lore(cfg.nok,id))next(id)};return}
  var a=add(el('div','acts')),y2=el('button','p',cfg.yes),n2=el('button','',cfg.no);a.appendChild(y2);a.appendChild(n2);
  function d(){y2.disabled=n2.disabled=true}
  y2.onclick=async function(){d();msg('You',cfg.youYes);if(await lore(cfg.ok,id)){card(cfg.card);next(id)}};
  n2.onclick=async function(){d();msg('You',cfg.youNo);if(await lore(cfg.nok,id))next(id)}}
async function play(steps,id,next){for(var i=0;i<steps.length;i++){if(id!==run)return;var s=steps[i];
 if(s.m){if(!await lore(s.m,id))return}else if(s.w){await work(s.w,id)}else if(s.s){await wait(300);if(id!==run)return;screen(s.s)}else if(s.c){await wait(300);if(id!==run)return;card(s.c)}else if(s.a){await wait(300);if(id!==run)return;approve(s.a,id,next);return}}
 next(id)}
// ---- menu in the lore DM
var SCENES={
 gc:{t:'plan saturday with my friends'},
 dm:{t:'something just for me'},
 slack:{t:'run my team’s launch week'},
 file:{t:'make me a file'}};
async function menu(first){
 var id=++run;busy(false);
 if(first){thread.textContent='';head('dm');add(el('div','ts','Today 9:41 AM'));
  var L=['yo i’m lore','agents for the people. one in every group chat, one just for you','so what are we doing?'];
  for(var i=0;i<L.length;i++){if(!await lore(L[i],id))return}}
 else{if(!await lore(Object.keys(done).length>=4?'that is the tour. want in?':'what else?',id))return}
 var list=[];
 Object.keys(SCENES).forEach(function(k){if(!done[k])list.push({t:SCENES[k].t,go:function(){go(k)}})});
 list.push({t:'something else...',cls:'mute',silent:true,go:function(){input.focus();msg('Lore','type it. try: dentist, slack, split the bill',0);run++}});
 list.push({t:'join the waitlist',cls:'accent',href:'/waitlist/'});
 opts(list,id)}
async function go(k){
 var id=++run;busy(true);done[k]=1;
 if(k==='gc'){if(!await lore('opening your group chat. i am in it too.',id))return;await swap('gc');return sceneGC(id)}
 if(k==='slack'){if(!await lore('opening Slack.',id))return;await swap('slack');return sceneSlack(id)}
 if(k==='dm')return sceneDM(id);
 if(k==='file')return sceneFile(id)}
function backToDM(id){return async function(){await swap('dm');menu(false)}}
// ---- scenes
async function sceneGC(id){
 var c=[['Priya','saturday?? who is actually free'],['Jonas','after 6 for me'],['Maya','same, and something not too loud']];
 for(var k=0;k<c.length;k++){await wait(k?700:300);if(id!==run)return;msg(c[k][0],c[k][1])}
 busy(false);
 var end=function(id2){if(id2!==run)return;lore('that is the group agent. in a group it works for the room.',id2).then(function(ok){if(ok)opts([{t:'back to lore',silent:true,go:backToDM()}],id2)})};
 opts([{t:'@lore plan saturday for the four of us',go:function(){busy(true);play([
  {m:'Looking at what everyone said and what is open.'},
  {w:['read the thread: after 6, quiet','opened 3 restaurant pages','found 7:30 for 4 at Cantinho do Sol','saved 3 screenshots']},
  {m:'Saturday 7:30pm, Cantinho do Sol. Quiet room, 10 minutes from Jonas. I can hold it while you decide.'},
  {c:['Saturday plan','Cantinho do Sol · 7:30pm · party of 4','HOLD READY']}],id,function(id2){if(id2!==run)return;busy(false);
   opts([{t:'@lore split the $248 and collect it',go:function(){busy(true);play([
    {m:'$62 each. I will message Priya and Jonas a request. Nothing goes out until you approve.'},
    {a:{yes:'Approve',no:'Edit',youYes:'Approve',youNo:'Edit',ok:'Requests sent to Priya and Jonas. I will tell the group when everyone has paid.',card:['2 requests sent','$62 each · from your account','SENT'],nok:'Okay. Nothing was sent.'}}],id2,end)}}],id2)})}}],id)}
async function sceneDM(id){
 if(!await lore('you told me nothing before 11 on saturday, and I kept that out of the group.',id))return;
 if(!await lore('your dentist is at 9am saturday. want me to move it?',id))return;
 busy(false);
 opts([{t:'yes, move it',go:function(){busy(true);play([
  {m:'Checking your calendar and their booking page.'},
  {w:['read your calendar, private to you','opened the clinic booking page','found Tuesday 4:00pm, free for you']},
  {m:'Tuesday 4:00pm works. Move it?'},
  {a:{yes:'Move it',no:'Not now',youYes:'Move it',youNo:'Not now',ok:'Moved to Tuesday 4:00pm. Confirmation saved.',card:['Dentist, Tuesday 4:00pm','Booked · calendar updated','CONFIRMED'],nok:'Okay. I left it where it is.'}}],id,function(id2){
   lore('that stayed between us. the group never saw it.',id2).then(function(ok){if(ok)menu(false)})})}}],id)}
async function sceneFile(id){
 if(!await lore('give me something to build and I will do it in my own workspace.',id))return;
 busy(false);
 opts([{t:'competitor pricing on one page I can download',go:function(){busy(true);play([
  {m:'Opening my workspace.'},
  {w:['opened 3 pricing pages in a browser','started a sandboxed computer','typed the prices with their sources','exported competitor-pricing.md']},
  {s:['lore workspace · editor','# Competitor pricing\n\nNorthwind   $24 / seat\nParcel      $19 flat, up to 10\nFieldnote   custom quote only\n\nSources: 3 pages, screenshots saved']},
  {m:'Done. One page, three sources, a screenshot of each price.'},
  {c:['competitor-pricing.md','Markdown · 1 page · ready to download','COMPUTER RUN RECEIPT']}],id,function(id2){menu(false)})}}],id)}
async function sceneSlack(id){
 msg('Maya','launch is tuesday. we need competitor numbers, the checklist, and the partner email by tonight');await wait(500);if(id!==run)return;
 msg('Dev','on it, kind of');busy(false);
 opts([{t:'@lore take it',go:function(){slackRun(id)}}],id)}
var AG=[['Research','browser',['opening 3 pricing pages','reading and comparing','saved 3 screenshots'],'competitor-brief.md'],
 ['Workspace','computer',['starting sandbox','typing the checklist','exporting file'],'launch-checklist.md'],
 ['Comms','drafts',['reading the thread','drafting the email','waiting for approval'],'']];
async function slackRun(id){
 busy(true);await wait(500);if(id!==run)return;
 var b=smsg('Lore','#242820','Taking this. Three agents, in parallel.',true),box=el('div','ag'),rows=[];b.appendChild(box);
 AG.forEach(function(a){var r=el('div','r'),k=el('div','k',a[0]);k.appendChild(el('small','',a[1]));var s=el('div','s'),st=el('div','',a[2][0]),bar=el('div','bar');bar.appendChild(el('i'));s.appendChild(st);s.appendChild(bar);var ok=el('div','ok','✓');r.appendChild(k);r.appendChild(s);r.appendChild(ok);box.appendChild(r);rows.push({st:st,bar:bar.firstChild,ok:ok})});
 thread.scrollTop=thread.scrollHeight;
 await Promise.all(AG.map(function(a,i){return(async function(){for(var k=0;k<a[2].length;k++){await wait(850+i*300);if(id!==run)return;rows[i].st.textContent=a[2][k];rows[i].bar.style.width=Math.round((k+1)/a[2].length*100)+'%'}
  if(id!==run)return;if(i<2){rows[i].st.textContent='done · '+a[3];rows[i].ok.classList.add('on')}})()}));
 if(id!==run)return;await wait(400);
 var s2=smsg('Lore','#242820','Research and the checklist are done. The partner email is drafted and waiting for Maya.',true);
 s2.appendChild(el('span','art','competitor-brief.md'));s2.appendChild(el('span','art','launch-checklist.md'));
 approve({yes:'Approve and send',no:'Edit',youYes:'Approved.',youNo:'Edit',ok:'Sent to 12 design partners from Maya’s address. Receipt saved.',card:['','12 of 12 delivered',''],nok:'Tell me what to change. Nothing has been sent.'},id,function(id2){
  busy(false);opts([{t:'back to lore',silent:true,go:backToDM()}],id2)})}
// ---- free text
function route(t){t=t.toLowerCase();
 if(/slack|launch|team|workspace/.test(t))return 'slack';
 if(/file|page|pricing|download|doc|brief/.test(t))return 'file';
 if(/dentist|move|private|just for me|calendar/.test(t))return 'dm';
 if(/saturday|plan|friends|group|dinner|split|book/.test(t))return 'gc';
 return ''}
form.onsubmit=async function(e){e.preventDefault();var t=input.value.trim();if(!t||input.disabled)return;input.value='';
 var k=route(t),id=++run;
 if(mode!=='dm'&&k){await swap('dm')}
 if(mode!=='dm'&&!k){msg('You',t);busy(true);await lore('this preview is scripted. try: dentist, slack, split the bill.',id);busy(false);return}
 // drop open options in the DM
 [].forEach.call(thread.querySelectorAll('.opts'),function(o){o.remove()});
 msg('You',t);
 if(!k){busy(true);if(await lore('this preview is scripted. try: dentist, slack, split the bill, or a file.',id)){busy(false);menu(false)}return}
 done[k]=0;go(k)};
back.onclick=function(){run++;busy(false);swap('dm').then(function(){menu(false)})};
function fit(){var k=Math.min(1,(innerHeight-118)/840,(innerWidth-16)/412);if(k<.5)k=.5;rig.style.height=Math.round(840*k)+'px';rig.style.width=Math.round(412*k)+'px';phone.style.transform='scale('+k+')'}
fit();addEventListener('resize',fit);
if(!reduce&&matchMedia('(hover:hover)').matches){addEventListener('mousemove',function(e){if(phone.contains(e.target))return;var cx=innerWidth/2,cy=innerHeight/2;tilt.style.transform='rotateY('+((e.clientX-cx)/cx*4).toFixed(2)+'deg) rotateX('+(-(e.clientY-cy)/cy*2.5).toFixed(2)+'deg)'});document.addEventListener('mouseleave',function(){tilt.style.transform=''})}
var started=false;function start(){if(started)return;started=true;menu(true)}
setTimeout(start,400);
})();
