(function(){
var cv=document.getElementById('fabric');if(!cv)return;var ctx=cv.getContext('2d');
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),R=[],pulses=[],last=0,T=0,mode=0,rings=1,halos=0;
var G='40,88,71',K='36,40,32';
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);seed()}
function seed(){
 R=[];var n=Math.round(Math.min(16,Math.max(6,W*H/70000))),tries=0,cx=W/2,cy=H/2,ph=Math.min(210,W*.5);
 while(R.length<n&&tries++<400){
  var r=34+Math.random()*58,x=Math.random()*W,y=Math.random()*H;
  if(Math.abs(x-cx)<ph+r*.6&&W>700)continue;
  var ok=true;R.forEach(function(o){var dx=o.x-x,dy=o.y-y;if(Math.sqrt(dx*dx+dy*dy)<o.r+r+26)ok=false});if(!ok)continue;
  var k=3+Math.floor(Math.random()*4),P=[];
  for(var i=0;i<k;i++)P.push({a:Math.random()*6.28,s:(.12+Math.random()*.22)*(Math.random()<.5?-1:1),d:r*(.7+Math.random()*.3),z:2+Math.random()*1.4});
  R.push({x:x,y:y,r:r,P:P,g:0})}}
function draw(){
 ctx.clearRect(0,0,W,H);
 R.forEach(function(o){
  var pg=0;pulses.forEach(function(p){var dx=o.x-p.x,dy=o.y-p.y,d=Math.sqrt(dx*dx+dy*dy),w=Math.abs(d-p.r);if(w<90)pg=Math.max(pg,(1-w/90)*p.o)});
  o.g+=(pg-o.g)*.2;
  if(rings>.02){ctx.strokeStyle='rgba('+G+','+(.16*rings+o.g*.3).toFixed(3)+')';ctx.lineWidth=1;ctx.beginPath();ctx.arc(o.x,o.y,o.r,0,7);ctx.stroke()}
  // lore at the center
  var gl=ctx.createRadialGradient(o.x,o.y,0,o.x,o.y,18+o.g*26);gl.addColorStop(0,'rgba('+G+','+(.28+o.g*.5).toFixed(3)+')');gl.addColorStop(1,'rgba('+G+',0)');ctx.fillStyle=gl;ctx.beginPath();ctx.arc(o.x,o.y,18+o.g*26,0,7);ctx.fill();
  ctx.fillStyle='rgba('+G+',.85)';ctx.beginPath();ctx.arc(o.x,o.y,3.4,0,7);ctx.fill();
  o.P.forEach(function(p){var x=o.x+Math.cos(p.a)*p.d,y=o.y+Math.sin(p.a)*p.d;
   if(halos>.02){ctx.strokeStyle='rgba('+G+','+(.34*halos).toFixed(3)+')';ctx.lineWidth=1;ctx.beginPath();ctx.arc(x,y,p.z+5+Math.sin(T*1.6+p.a)*1.2,0,7);ctx.stroke()}
   ctx.fillStyle='rgba('+K+','+(.42+o.g*.3).toFixed(2)+')';ctx.beginPath();ctx.arc(x,y,p.z,0,7);ctx.fill()})});
 pulses.forEach(function(p){ctx.strokeStyle='rgba('+G+','+(p.o*.14).toFixed(3)+')';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.stroke()})}
function tick(ts){var dt=Math.min(.05,(ts-last)/1000||0);last=ts;T+=dt;
 R.forEach(function(o){o.P.forEach(function(p){p.a+=p.s*dt})});
 var tr=mode===1?.12:1,th=mode===1?1:0;rings+=(tr-rings)*Math.min(1,dt*2);halos+=(th-halos)*Math.min(1,dt*2);
 pulses.forEach(function(p){p.r+=420*dt;p.o-=.45*dt});pulses=pulses.filter(function(p){return p.o>0});
 draw();requestAnimationFrame(tick)}
window.fabricPulse=function(i){mode=(i===1)?1:0;var r=document.getElementById('phone').getBoundingClientRect();pulses.push({x:r.left+r.width/2,y:r.top+r.height/2,r:60,o:1});if(reduce){rings=mode?.12:1;halos=mode;draw()}};
addEventListener('resize',function(){size();if(reduce)draw()});
size();if(reduce){draw()}else{requestAnimationFrame(tick)}
})();
