// Original sports wall-art posters (no real people, names, teams or logos).
// drawPoster(g, id, W, H, opt) draws poster `id` in a 1000x1500 design space scaled to W x H.
// opt.ball (0..1) moves the "action" object along its path (used by the drawing videos); default = final pose.
(function(){
const P={};
const R=s=>{let x=s|0||1;return()=>((x=(x*16807)%2147483647)-1)/2147483646;};
function grain(g,amt,seed){const r=R(seed);g.save();for(let i=0;i<26000;i++){const x=r()*1000,y=r()*1500,a=r()*amt;g.fillStyle=r()<.5?`rgba(255,255,255,${a})`:`rgba(0,0,0,${a})`;g.fillRect(x,y,1.6,1.6);}g.restore();}
function frame(g,col){g.save();g.strokeStyle=col;g.lineWidth=6;g.strokeRect(34,34,932,1432);g.lineWidth=2;g.strokeRect(48,48,904,1404);g.restore();}
function title(g,lines,y,col,size,shadow){g.save();g.textAlign='center';g.textBaseline='alphabetic';const lh=size*0.86;lines.forEach((L,i)=>{let s=size;g.font=`800 ${s}px BS`;while(g.measureText(L).width>860&&s>40){s-=4;g.font=`800 ${s}px BS`;}
  if(shadow){g.fillStyle=shadow;g.fillText(L,507,y+i*lh+7);}g.fillStyle=col;g.fillText(L,500,y+i*lh);});g.restore();}
function sub(g,txt,y,col){g.save();g.font='600 30px HG';g.fillStyle=col;g.textAlign='center';const sp=txt.split('').join(' ');g.fillText(sp,500,y);g.restore();}
function sunset(g,cx,cy,r,c1,c2,bg,bands){const gr=g.createLinearGradient(0,cy-r,0,cy+r);gr.addColorStop(0,c1);gr.addColorStop(1,c2);g.save();g.beginPath();g.arc(cx,cy,r,0,7);g.fillStyle=gr;g.fill();
  g.clip();g.fillStyle=bg;for(let i=0;i<bands;i++){const y=cy+r*0.1+i*(r*0.9/bands)*1.0;const h=3+i*3.2;g.fillRect(cx-r,y,2*r,h);}g.restore();}
function halftone(g,cx,cy,rad,col,step,maxd){g.save();g.fillStyle=col;for(let y=cy-rad;y<cy+rad;y+=step)for(let x=cx-rad;x<cx+rad;x+=step){const d=Math.hypot(x-cx,y-cy)/rad;if(d<1){g.beginPath();g.arc(x,y,maxd*(1-d),0,7);g.fill();}}g.restore();}
const qb=(a,b,c,t)=>(1-t)*(1-t)*a+2*(1-t)*t*b+t*t*c;

// 1 — NOTHING BUT NET (basketball)
P.net=function(g,o){const bt=o.ball??0.965;
  let gr=g.createLinearGradient(0,0,0,1500);gr.addColorStop(0,'#14122e');gr.addColorStop(.6,'#2b1640');gr.addColorStop(1,'#120c22');g.fillStyle=gr;g.fillRect(0,0,1000,1500);
  // stars
  const r=R(7);g.fillStyle='rgba(255,240,220,.7)';for(let i=0;i<70;i++){g.beginPath();g.arc(r()*1000,r()*560,r()*2.2+.4,0,7);g.fill();}
  sunset(g,430,700,330,'#ffd36b','#ff4f6d','#2b1640',9);
  // court floor
  g.fillStyle='#1a0f2a';g.beginPath();g.moveTo(0,930);g.lineTo(1000,930);g.lineTo(1000,1500);g.lineTo(0,1500);g.fill();
  g.strokeStyle='rgba(255,140,90,.55)';g.lineWidth=5;g.beginPath();g.ellipse(500,1040,420,90,0,Math.PI,0,true);g.stroke();
  
  // pole + backboard + rim + net
  g.fillStyle='#0b0716';g.fillRect(880,330,26,600);g.fillRect(800,350,100,18);
  g.save();g.fillStyle='rgba(255,255,255,.08)';g.strokeStyle='#f6e7c8';g.lineWidth=7;g.fillRect(650,250,230,160);g.strokeRect(650,250,230,160);g.strokeRect(722,322,86,62);g.restore();
  g.strokeStyle='#f6e7c8';g.lineWidth=3;for(let i=0;i<=8;i++){const x0=712+i*13.75,x1=732+i*8.75;g.beginPath();g.moveTo(x0,418);g.quadraticCurveTo((x0+x1)/2+(i%2?6:-6),470,x1,520);g.stroke();}
  for(let k=1;k<4;k++){g.beginPath();const y=418+k*25,w=55-k*6;g.moveTo(765-w,y);g.lineTo(765+w,y);g.stroke();}
  g.strokeStyle='#ff6a3d';g.lineWidth=9;g.beginPath();g.ellipse(765,418,56,11,0,0,7);g.stroke();
  // arc trail
  const P0=[150,1010],P1=[470,-60],P2=[765,420];
  g.save();g.setLineDash([3,22]);g.lineCap='round';g.lineWidth=9;g.strokeStyle='rgba(255,230,190,.65)';g.beginPath();for(let t=0;t<=bt;t+=.01){const x=qb(P0[0],P1[0],P2[0],t),y=qb(P0[1],P1[1],P2[1],t);t?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();g.restore();
  // ball
  const bx=qb(P0[0],P1[0],P2[0],bt),by=qb(P0[1],P1[1],P2[1],bt);
  g.save();g.translate(bx,by);g.rotate(bt*9);const br=58;const bgr=g.createRadialGradient(-20,-22,8,0,0,br);bgr.addColorStop(0,'#ffb067');bgr.addColorStop(1,'#d9531e');
  g.fillStyle=bgr;g.beginPath();g.arc(0,0,br,0,7);g.fill();g.strokeStyle='#2a1208';g.lineWidth=5;g.stroke();
  g.beginPath();g.moveTo(-br,0);g.lineTo(br,0);g.moveTo(0,-br);g.lineTo(0,br);g.stroke();
  g.beginPath();g.arc(-br*1.25,0,br*0.95,-.75,.75);g.stroke();g.beginPath();g.arc(br*1.25,0,br*0.95,Math.PI-.75,Math.PI+.75);g.stroke();g.restore();
  // speed lines
  g.save();g.strokeStyle='rgba(255,230,190,.5)';g.lineWidth=5;g.lineCap='round';const a=Math.atan2(qb(P0[1],P1[1],P2[1],bt)-qb(P0[1],P1[1],P2[1],bt-.04),bx-qb(P0[0],P1[0],P2[0],bt-.04));
  for(let i=-1;i<=1;i++){g.beginPath();const ox=Math.cos(a+Math.PI/2)*i*30,oy=Math.sin(a+Math.PI/2)*i*30;g.moveTo(bx-Math.cos(a)*80+ox,by-Math.sin(a)*80+oy);g.lineTo(bx-Math.cos(a)*(150+Math.abs(i)*-30)+ox,by-Math.sin(a)*(150+Math.abs(i)*-30)+oy);g.stroke();}g.restore();
  title(g,['NOTHING','BUT NET'],1195,'#f6e7c8',150,'#ff4f6d');sub(g,'SHOOT YOUR SHOT  ·  EVERY COURT  ·  EVERY NIGHT',1415,'#ffd36b');
  frame(g,'#f6e7c8');grain(g,.06,11);};

// 2 — SWING FOR THE FENCES (baseball)
P.swing=function(g,o){const bt=o.ball??1;
  let gr=g.createLinearGradient(0,0,0,1500);gr.addColorStop(0,'#071a26');gr.addColorStop(.7,'#0f3b4c');gr.addColorStop(1,'#08202b');g.fillStyle=gr;g.fillRect(0,0,1000,1500);
  // light beams
  for(const [x,dir] of [[120,1],[880,-1]]){g.save();const bg=g.createLinearGradient(x,260,x+dir*500,900);bg.addColorStop(0,'rgba(255,248,214,.35)');bg.addColorStop(1,'rgba(255,248,214,0)');g.fillStyle=bg;g.beginPath();g.moveTo(x-40,250);g.lineTo(x+40,250);g.lineTo(x+dir*620,1000);g.lineTo(x+dir*260,1000);g.fill();g.restore();
    g.fillStyle='#04111a';g.fillRect(x-8,280,16,720);g.fillRect(x-70,190,140,90);g.fillStyle='#fff6d6';for(let i=0;i<4;i++)for(let j=0;j<3;j++){g.beginPath();g.arc(x-50+i*33,208+j*27,10,0,7);g.fill();}
    g.save();g.shadowColor='#fff3c0';g.shadowBlur=40;g.fillStyle='rgba(255,246,214,.6)';g.fillRect(x-70,190,140,90);g.restore();}
  // stands + outfield wall
  g.fillStyle='#061620';g.beginPath();g.moveTo(0,960);for(let x=0;x<=1000;x+=40)g.lineTo(x,930+Math.sin(x*.05)*8+((x/40)%2?14:0));g.lineTo(1000,1500);g.lineTo(0,1500);g.fill();
  g.fillStyle='#0b5a3c';g.fillRect(0,1010,1000,40);g.fillStyle='#f3e6cc';g.font='800 26px BS';g.textAlign='center';['330','375','400','375','330'].forEach((n,i)=>g.fillText(n,100+i*200,1040));
  g.fillStyle='#0d4a2c';g.fillRect(0,1050,1000,450);g.strokeStyle='rgba(255,255,255,.06)';g.lineWidth=40;for(let i=0;i<10;i++){g.beginPath();g.moveTo(-200+i*160,1500);g.lineTo(300+i*60,1050);g.stroke();}
  // trail
  const P0=[120,1300],P1=[300,250],P2=[640,520];const bx=qb(P0[0],P1[0],P2[0],bt),by=qb(P0[1],P1[1],P2[1],bt);
  g.save();g.lineCap='round';for(let k=0;k<3;k++){g.strokeStyle=`rgba(255,240,210,${.18-k*.05})`;g.lineWidth=240-k*80;g.beginPath();for(let t=Math.max(0,bt-.75);t<=bt;t+=.01){const x=qb(P0[0],P1[0],P2[0],t),y=qb(P0[1],P1[1],P2[1],t);t>Math.max(0,bt-.75)?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}g.restore();
  // ball
  g.save();g.translate(bx,by);g.rotate(-.5+bt*2);const br=150;const bgr=g.createRadialGradient(-50,-55,20,0,0,br);bgr.addColorStop(0,'#fffdf5');bgr.addColorStop(1,'#d9cfb8');g.fillStyle=bgr;g.beginPath();g.arc(0,0,br,0,7);g.fill();
  g.strokeStyle='#2b2216';g.lineWidth=6;g.stroke();
  for(const s of [-1,1]){g.strokeStyle='#c8102e';g.lineWidth=6;g.beginPath();g.arc(s*br*1.45,0,br*1.05,s>0?Math.PI-.62:-.62,s>0?Math.PI+.62:.62);g.stroke();
    for(let a=-.55;a<=.55;a+=.11){const cx=s*br*1.45+Math.cos(s>0?Math.PI+a:a)*br*1.05,cy=Math.sin(s>0?Math.PI+a:a)*br*1.05;const nx=Math.cos(s>0?Math.PI+a:a),ny=Math.sin(s>0?Math.PI+a:a);
      g.lineWidth=4;g.beginPath();g.moveTo(cx-nx*12-ny*7,cy-ny*12+nx*7);g.lineTo(cx+nx*12-ny*7,cy+ny*12+nx*7);g.stroke();}}
  g.restore();
  title(g,['SWING FOR','THE FENCES'],1205,'#f3e6cc',148,'#c8102e');sub(g,'BOTTOM OF THE NINTH  ·  BIG SWINGS ONLY',1420,'#ffd36b');
  frame(g,'#f3e6cc');grain(g,.06,12);};

// 3 — NEVER STAY DOWN (boxing)
function glove(g,x,y,s,rot,col,dark){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.lineJoin='round';g.lineWidth=9;g.strokeStyle='#160b0b';
  // cuff
  g.fillStyle='#f4ead5';g.beginPath();g.roundRect(-70,120,140,95,18);g.fill();g.stroke();g.fillStyle=col;g.fillRect(-66,150,132,26);
  // main fist
  const gr=g.createLinearGradient(-110,-160,110,140);gr.addColorStop(0,col);gr.addColorStop(1,dark);g.fillStyle=gr;
  g.beginPath();g.moveTo(-80,130);g.bezierCurveTo(-140,60,-150,-120,-60,-170);g.bezierCurveTo(10,-205,110,-180,125,-90);g.bezierCurveTo(140,-10,110,90,80,130);g.closePath();g.fill();g.stroke();
  // thumb
  g.beginPath();g.moveTo(-105,10);g.bezierCurveTo(-165,-10,-170,-90,-120,-100);g.bezierCurveTo(-90,-105,-70,-60,-70,-20);g.closePath();g.fill();g.stroke();
  // highlight
  g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=12;g.lineCap='round';g.beginPath();g.moveTo(-40,-150);g.quadraticCurveTo(40,-170,90,-120);g.stroke();
  // laces
  g.strokeStyle='#f4ead5';g.lineWidth=5;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-30,135+i*18);g.lineTo(30,145+i*18);g.moveTo(30,135+i*18);g.lineTo(-30,145+i*18);g.stroke();}
  g.restore();}
P.down=function(g,o){const sw=o.ball??1;
  g.fillStyle='#b80f2a';g.fillRect(0,0,1000,1500);halftone(g,500,560,520,'#8e0a20',26,12);
  // ropes
  g.strokeStyle='#f4ead5';g.lineWidth=10;for(const y of [930,990,1050]){g.beginPath();g.moveTo(0,y);g.quadraticCurveTo(500,y+30,1000,y);g.stroke();}
  // nail + laces
  g.fillStyle='#160b0b';g.beginPath();g.arc(500,150,16,0,7);g.fill();
  const swing=Math.sin(sw*Math.PI*3)*(1-sw)*.35;
  g.strokeStyle='#f4ead5';g.lineWidth=6;g.beginPath();g.moveTo(500,150);g.quadraticCurveTo(420,300,360+swing*200,470);g.moveTo(500,150);g.quadraticCurveTo(580,320,640-swing*150,520);g.stroke();
  glove(g,360+swing*200,620,1.25,.25+swing,'#e8dcc4','#b8a98d');
  glove(g,650-swing*150,680,1.25,-.32-swing*.8,'#1d1d22','#060608');
  title(g,['NEVER','STAY DOWN'],1190,'#f4ead5',165,'#160b0b');sub(g,'GET UP  ·  GLOVES UP  ·  GO AGAIN',1420,'#f4ead5');
  frame(g,'#f4ead5');grain(g,.06,13);};

// 4 — TOP CORNER (soccer)
function soccerBall(g,x,y,r,rot){g.save();g.translate(x,y);g.rotate(rot);const gr=g.createRadialGradient(-r*.35,-r*.4,r*.1,0,0,r);gr.addColorStop(0,'#ffffff');gr.addColorStop(1,'#cfd6da');
  g.fillStyle=gr;g.beginPath();g.arc(0,0,r,0,7);g.fill();g.save();g.clip();g.fillStyle='#14181c';
  const pent=(cx,cy,s,a)=>{g.beginPath();for(let i=0;i<5;i++){const t=a+i*2*Math.PI/5;g[i?'lineTo':'moveTo'](cx+Math.cos(t)*s,cy+Math.sin(t)*s);}g.closePath();g.fill();};
  pent(0,0,r*.32,-Math.PI/2);for(let i=0;i<5;i++){const t=-Math.PI/2+i*2*Math.PI/5+Math.PI/5;pent(Math.cos(t)*r*.9,Math.sin(t)*r*.9,r*.3,t+Math.PI);}
  g.strokeStyle='#14181c';g.lineWidth=r*.04;for(let i=0;i<5;i++){const t=-Math.PI/2+i*2*Math.PI/5;g.beginPath();g.moveTo(Math.cos(t)*r*.32,Math.sin(t)*r*.32);g.lineTo(Math.cos(t)*r*.62,Math.sin(t)*r*.62);g.stroke();}
  g.restore();g.strokeStyle='#14181c';g.lineWidth=5;g.beginPath();g.arc(0,0,r,0,7);g.stroke();g.restore();}
P.corner=function(g,o){const bt=o.ball??1;
  let gr=g.createLinearGradient(0,0,0,1500);gr.addColorStop(0,'#0a2416');gr.addColorStop(1,'#0f3a22');g.fillStyle=gr;g.fillRect(0,0,1000,1500);
  // pitch stripes
  for(let i=0;i<9;i++){g.fillStyle=i%2?'#145a30':'#11502a';g.beginPath();const y0=760+i*i*9,y1=760+(i+1)*(i+1)*9;g.moveTo(0,y0);g.lineTo(1000,y0);g.lineTo(1000,y1);g.lineTo(0,y1);g.fill();}
  // goal
  const L=140,Rr=860,T=170,B=760;g.save();g.strokeStyle='rgba(255,255,255,.35)';g.lineWidth=2;
  const bx=qb(260,520,790,bt),by=qb(1300,500,250,bt);const bul=bt>.9?(bt-.9)*10:0;
  for(let x=L;x<=Rr;x+=28){g.beginPath();for(let y=T;y<=B;y+=10){const d=Math.hypot(x-790,y-250);const push=bul*Math.max(0,90-d)*.5;g.lineTo(x+(x-790)/Math.max(d,1)*push*-.2,y-push*.3);}g.stroke();}
  for(let y=T;y<=B;y+=28){g.beginPath();for(let x=L;x<=Rr;x+=10){const d=Math.hypot(x-790,y-250);const push=bul*Math.max(0,90-d)*.5;g.lineTo(x,y-push*.3+(y-250)/Math.max(d,1)*push*.1);}g.stroke();}
  g.restore();g.strokeStyle='#f4f4ee';g.lineWidth=22;g.lineJoin='round';g.beginPath();g.moveTo(L,B);g.lineTo(L,T);g.lineTo(Rr,T);g.lineTo(Rr,B);g.stroke();
  // trail + ball
  g.save();g.lineCap='round';for(let k=0;k<3;k++){g.strokeStyle=`rgba(230,255,235,${.28-k*.08})`;g.lineWidth=90-k*28;g.beginPath();for(let t=Math.max(0,bt-.4);t<=bt;t+=.01){const x=qb(260,520,790,t),y=qb(1300,500,250,t);t>Math.max(0,bt-.4)?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}g.restore();
  soccerBall(g,bx,by,88-bt*20,bt*5);
  // impact burst
  if(bt>.95){g.save();g.strokeStyle='#ffe066';g.lineWidth=7;g.lineCap='round';for(let i=0;i<10;i++){const a=i/10*Math.PI*2;g.beginPath();g.moveTo(bx+Math.cos(a)*95,by+Math.sin(a)*95);g.lineTo(bx+Math.cos(a)*135,by+Math.sin(a)*135);g.stroke();}g.restore();}
  title(g,['TOP','CORNER'],1185,'#f4f4ee',170,'#0a2416');sub(g,'PICK YOUR SPOT  ·  BURY IT',1420,'#ffe066');
  frame(g,'#f4f4ee');grain(g,.06,14);};

// 5 — OUTWORK EVERYONE (gym)
P.outwork=function(g,o){const lift=o.ball??1;
  g.fillStyle='#121212';g.fillRect(0,0,1000,1500);sunset(g,500,640,360,'#ffd23f','#ff7a1a','#121212',8);
  halftone(g,500,1150,520,'#1e1e1e',24,10);
  // dumbbell (lifted up as lift goes 0..1)
  const y=900-lift*260;g.save();g.translate(500,y);g.rotate(-.18);
  g.fillStyle='#b9bec4';g.fillRect(-230,-18,460,36);g.strokeStyle='#0c0c0c';g.lineWidth=8;g.strokeRect(-230,-18,460,36);
  for(const s of [-1,1]){for(let k=0;k<3;k++){const w=46,h=230-k*50,x=s*(150+k*50)-(s<0?w:0);const pg=g.createLinearGradient(x,0,x+w,0);pg.addColorStop(0,'#2a2d33');pg.addColorStop(.5,'#4a4f58');pg.addColorStop(1,'#1b1d21');g.fillStyle=pg;g.beginPath();g.roundRect(x,-h/2,w,h,10);g.fill();g.stroke();}}
  g.restore();
  // motion lines below
  g.strokeStyle='rgba(255,210,63,0)';g.lineWidth=8;g.lineCap='round';for(let i=-2;i<=2;i++){g.beginPath();g.moveTo(500+i*90,y+120);g.lineTo(500+i*90,y+120+80+Math.abs(i)*-15);g.stroke();}
  title(g,['OUTWORK','EVERYONE'],1190,'#f7f3e8',165,'#ff7a1a');sub(g,'4:59 AM  ·  NO DAYS OFF  ·  NO EXCUSES',1420,'#ffd23f');
  frame(g,'#f7f3e8');grain(g,.07,15);};

// 6 — LEAVE IT ON THE FIELD (football)
P.field=function(g,o){const bt=o.ball??1;
  g.fillStyle='#e9dcc0';g.fillRect(0,0,1000,1500);
  // retro stripes
  const cols=['#1f3b5a','#c8102e','#e88a1a'];cols.forEach((c,i)=>{g.fillStyle=c;g.save();g.translate(0,0);g.beginPath();g.moveTo(-100,560+i*70);g.lineTo(1100,160+i*70);g.lineTo(1100,210+i*70);g.lineTo(-100,610+i*70);g.fill();g.restore();});
  // goal post
  g.strokeStyle='#e8b21a';g.lineWidth=16;g.lineCap='round';g.beginPath();g.moveTo(800,1040);g.lineTo(800,860);g.moveTo(690,860);g.lineTo(910,860);g.moveTo(690,860);g.lineTo(690,640);g.moveTo(910,860);g.lineTo(910,640);g.stroke();
  // field perspective
  g.fillStyle='#2f6b3a';g.beginPath();g.moveTo(0,1040);g.lineTo(1000,1040);g.lineTo(1000,1500);g.lineTo(0,1500);g.fill();
  g.strokeStyle='#e9dcc0';g.lineWidth=5;for(let i=0;i<6;i++){const y=1040+i*i*14;g.beginPath();g.moveTo(0,y);g.lineTo(1000,y);g.stroke();}
  // football spiral
  const bx=qb(80,420,560,bt),by=qb(1000,420,640,bt);
  g.save();g.lineCap='round';g.strokeStyle='rgba(31,59,90,.55)';for(let k=0;k<4;k++){g.lineWidth=7;g.beginPath();for(let t=Math.max(0,bt-.7);t<=bt-.12;t+=.01){const x=qb(80,420,560,t),y=qb(1000,420,640,t)+Math.sin(t*40+k*1.5)*22;t>Math.max(0,bt-.7)?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();}g.restore();
  g.save();g.translate(bx,by);g.scale(1.45,1.45);g.rotate(-.35+bt*.4);const fg=g.createLinearGradient(0,-110,0,110);fg.addColorStop(0,'#a4552a');fg.addColorStop(1,'#5a2a12');g.fillStyle=fg;g.strokeStyle='#1c0e06';g.lineWidth=8;
  g.beginPath();g.moveTo(-210,0);g.bezierCurveTo(-140,-140,140,-140,210,0);g.bezierCurveTo(140,140,-140,140,-210,0);g.fill();g.stroke();
  g.strokeStyle='#f4ead5';g.lineWidth=10;g.beginPath();g.moveTo(-160,-40);g.quadraticCurveTo(-185,0,-160,40);g.moveTo(160,-40);g.quadraticCurveTo(185,0,160,40);g.stroke();
  g.lineWidth=8;g.beginPath();g.moveTo(-70,-58);g.lineTo(70,-58);g.stroke();for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(i*20,-75);g.lineTo(i*20,-41);g.stroke();}
  g.strokeStyle='rgba(255,255,255,.3)';g.lineWidth=12;g.beginPath();g.moveTo(-120,-70);g.quadraticCurveTo(0,-110,120,-70);g.stroke();g.restore();
  title(g,['LEAVE IT ON','THE FIELD'],1205,'#f4ead5',150,'#1f3b5a');sub(g,'FOURTH QUARTER  ·  FULL HEART',1420,'#f4ead5');
  frame(g,'#1f3b5a');grain(g,.05,16);};

window.POSTERS=P;
window.POSTER_TITLES={net:'Nothing But Net',swing:'Swing For The Fences',down:'Never Stay Down',corner:'Top Corner',outwork:'Outwork Everyone',field:'Leave It On The Field'};
window.drawPoster=function(g,id,W,H,opt={}){g.save();g.scale(W/1000,H/1500);P[id](g,opt);g.restore();};
})();
