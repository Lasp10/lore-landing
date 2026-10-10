(function(){
var cv=document.getElementById('fabric');if(!cv)return;var ctx=cv.getContext('2d');
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),N=[],pulses=[],mx=-999,my=-999,T=0,last=0;
var LINK=150;
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0);
 var n=Math.round(Math.min(90,Math.max(28,W*H/17000)));N=[];
 for(var i=0;i<n;i++)N.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*10,vy:(Math.random()-.5)*10,r:1.2+Math.random()*1.6,a:Math.random()<.14})}
function draw(){
 ctx.clearRect(0,0,W,H);
 for(var i=0;i<N.length;i++){var a=N[i];
  for(var j=i+1;j<N.length;j++){var b=N[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
   if(d<LINK){var al=(1-d/LINK)*.16,mdx=(a.x+b.x)/2-mx,mdy=(a.y+b.y)/2-my,md=Math.sqrt(mdx*mdx+mdy*mdy);if(md<180)al+=(1-md/180)*.22;
    ctx.strokeStyle='rgba(40,88,71,'+al.toFixed(3)+')';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke()}}}
 for(var k=0;k<N.length;k++){var n=N[k],glow=0;
  pulses.forEach(function(p){var dx=n.x-p.x,dy=n.y-p.y,d=Math.sqrt(dx*dx+dy*dy),w=Math.abs(d-p.r);if(w<70)glow=Math.max(glow,(1-w/70)*p.o)});
  ctx.fillStyle=glow>0.02?'rgba(40,88,71,'+(.35+glow*.6).toFixed(2)+')':(n.a?'rgba(40,88,71,.55)':'rgba(36,40,32,.32)');
  ctx.beginPath();ctx.arc(n.x,n.y,n.r+glow*3,0,7);ctx.fill()}
 pulses.forEach(function(p){ctx.strokeStyle='rgba(40,88,71,'+(p.o*.18).toFixed(3)+')';ctx.lineWidth=1.2;ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,7);ctx.stroke()})}
function tick(ts){var dt=Math.min(.05,(ts-last)/1000||0);last=ts;T+=dt;
 N.forEach(function(n){n.x+=n.vx*dt;n.y+=n.vy*dt;if(n.x<-20)n.x=W+20;if(n.x>W+20)n.x=-20;if(n.y<-20)n.y=H+20;if(n.y>H+20)n.y=-20});
 pulses.forEach(function(p){p.r+=420*dt;p.o-=.45*dt});pulses=pulses.filter(function(p){return p.o>0});
 draw();requestAnimationFrame(tick)}
window.fabricPulse=function(){var r=document.getElementById('phone').getBoundingClientRect();pulses.push({x:r.left+r.width/2,y:r.top+r.height/2,r:60,o:1});if(reduce)draw()};
addEventListener('mousemove',function(e){mx=e.clientX;my=e.clientY});
addEventListener('resize',function(){size();if(reduce)draw()});
size();if(reduce){draw()}else{requestAnimationFrame(tick)}
})();
