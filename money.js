(function(){
var cv=document.getElementById('money');if(!cv)return;var ctx=cv.getContext('2d');
var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
var W=0,H=0,dpr=Math.min(window.devicePixelRatio||1,2),P=[],SP=[];
function mk(w,h,fn,blur){var c=document.createElement('canvas');c.width=w+16;c.height=h+16;var x=c.getContext('2d');if(blur)x.filter='blur('+blur+'px)';x.translate(8,8);fn(x,w,h);return c}
function rr(x,a,b,w,h,r){x.beginPath();x.moveTo(a+r,b);x.arcTo(a+w,b,a+w,b+h,r);x.arcTo(a+w,b+h,a,b+h,r);x.arcTo(a,b+h,a,b,r);x.arcTo(a,b,a+w,b,r);x.closePath()}
function bill(g1,g2){return function(x,w,h){var g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,g1);g.addColorStop(1,g2);rr(x,0,0,w,h,5);x.fillStyle=g;x.fill();
 x.strokeStyle='#eef6e4';x.globalAlpha=.9;x.lineWidth=2.5;rr(x,5,5,w-10,h-10,3);x.stroke();x.globalAlpha=.5;x.lineWidth=1;rr(x,10,10,w-20,h-20,2);x.stroke();x.globalAlpha=.35;
 x.fillStyle='#fff';x.beginPath();x.ellipse(w/2,h/2,h*.3,h*.34,0,0,7);x.fill();x.globalAlpha=.7;x.fillStyle='#2f5f40';x.font='700 '+(h*.38)+'px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText('$',w/2,h/2+1);
 x.font='700 '+(h*.2)+'px Georgia,serif';x.fillText('$',w*.14,h*.3);x.fillText('$',w*.86,h*.7);x.globalAlpha=.25;for(var i=0;i<5;i++){x.fillRect(w*.2+i*3,h-14,1.5,7)}}}
function coin(x,w,h){var r=h/2,g=x.createRadialGradient(r*.7,r*.7,2,r,r,r);g.addColorStop(0,'#fff3c4');g.addColorStop(.6,'#e2b84f');g.addColorStop(1,'#a67c1d');x.beginPath();x.arc(r,r,r,0,7);x.fillStyle=g;x.fill();x.strokeStyle='#fff3c488';x.lineWidth=2;x.beginPath();x.arc(r,r,r-4,0,7);x.stroke();x.fillStyle='#7a5a10';x.globalAlpha=.8;x.font='700 '+(r)+'px Georgia,serif';x.textAlign='center';x.textBaseline='middle';x.fillText('$',r,r+1)}
function build(){SP=[];[['#a9d6b0','#6aa77c'],['#c5e0b4','#7fb48b'],['#9fcfa8','#5d9a72']].forEach(function(c){SP.push({n:mk(132,58,bill(c[0],c[1])),b:mk(132,58,bill(c[0],c[1]),2.5),w:148,h:74})});SP.push({n:mk(40,40,coin),b:mk(40,40,coin,2),w:56,h:56})}
function seed(){var n=Math.round(Math.min(46,Math.max(16,W/32)));P=[];for(var i=0;i<n;i++)P.push(mkp(true))}
function mkp(init){var d=.45+Math.random()*.95,t=Math.random()<.14?3:(Math.random()*3|0);return{t:t,d:d,x:Math.random()*W,y:init?Math.random()*(H+200)-100:-80-Math.random()*200,vy:(36+Math.random()*34)*d,sw:12+Math.random()*30,sp:.4+Math.random()*.8,ph:Math.random()*6.28,r:Math.random()*6.28,vr:(Math.random()-.5)*.9,fp:Math.random()*6.28,fs:.8+Math.random()*1.6}}
function size(){W=innerWidth;H=innerHeight;cv.width=W*dpr;cv.height=H*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
var last=0,T=0;
function draw(){ctx.clearRect(0,0,W,H);P.sort(function(a,b){return a.d-b.d});
 P.forEach(function(p){var s=SP[p.t],k=p.d,flip=Math.cos(p.fp);var img=p.d<.85?s.b:s.n;ctx.save();ctx.globalAlpha=Math.min(1,.28+p.d*.55);
  ctx.translate(p.x+Math.sin(T*p.sp+p.ph)*p.sw,p.y);ctx.rotate(p.r);ctx.scale(k*(p.t===3?1:1),k*(p.t===3?Math.abs(flip)*.9+.1:(Math.abs(flip)*.85+.15)));
  ctx.drawImage(img,-img.width/2,-img.height/2);ctx.restore()})}
function tick(ts){var dt=Math.min(.05,(ts-last)/1000||0);last=ts;T+=dt;
 P.forEach(function(p,i){p.y+=p.vy*dt;p.r+=p.vr*dt;p.fp+=p.fs*dt;if(p.y>H+90){P[i]=mkp(false)}});draw();requestAnimationFrame(tick)}
size();build();seed();
if(reduce){draw()}else{requestAnimationFrame(tick)}
addEventListener('resize',function(){size();seed();if(reduce)draw()});
})();
