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


// ======== NON-SPORTS ART (elegant prints) ========
function cap(g,t1,t2,col,sub){g.save();g.textAlign='center';g.fillStyle=col;g.font='700 74px PF';g.fillText(t1,500,1375);g.font='italic 400 32px PFI';g.fillStyle=sub||col;g.fillText(t2,500,1428);g.restore();}
function mat(g,col){g.save();g.fillStyle=col;g.fillRect(0,0,1000,26);g.fillRect(0,1474,1000,26);g.fillRect(0,0,26,1500);g.fillRect(974,0,26,1500);g.restore();}
function stars(g,n,seed,h,col){const r=R(seed);g.fillStyle=col||'rgba(255,248,230,.85)';for(let i=0;i<n;i++){const x=r()*1000,y=r()*h,s=r();g.globalAlpha=.3+s*.7;g.beginPath();g.arc(x,y,s*2.6+.3,0,7);g.fill();}g.globalAlpha=1;}
function sparkle(g,x,y,r,col){g.save();g.fillStyle=col;g.beginPath();g.moveTo(x,y-r);g.quadraticCurveTo(x,y,x+r,y);g.quadraticCurveTo(x,y,x,y+r);g.quadraticCurveTo(x,y,x-r,y);g.quadraticCurveTo(x,y,x,y-r);g.fill();g.restore();}
// standing silhouette (feet at x,y, height h); dress=true for a dress + long hair; arm: angle of near arm toward partner
function person(g,x,y,h,o={}){const k=h/360;g.save();g.translate(x,y);g.scale(k*(o.flip?-1:1),k);g.fillStyle=o.col||'#140b1c';g.strokeStyle=o.col||'#140b1c';g.lineCap='round';g.lineJoin='round';
  g.beginPath();g.arc(0,-330,30,0,7);g.fill();g.fillRect(-9,-305,18,22);
  if(o.dress){g.beginPath();g.moveTo(-34,-282);g.lineTo(34,-282);g.lineTo(30,-200);g.lineTo(62,-100);g.lineTo(-62,-100);g.lineTo(-30,-200);g.closePath();g.fill();
    g.beginPath();g.moveTo(-28,-345);g.quadraticCurveTo(-50,-290,-38,-230);g.lineTo(-18,-240);g.quadraticCurveTo(-24,-300,0,-358);g.fill();
    g.lineWidth=20;g.beginPath();g.moveTo(-14,-100);g.lineTo(-18,0);g.moveTo(14,-100);g.lineTo(20,0);g.stroke();}
  else{g.beginPath();g.moveTo(-42,-285);g.lineTo(42,-285);g.lineTo(34,-140);g.lineTo(-34,-140);g.closePath();g.fill();
    g.lineWidth=28;g.beginPath();g.moveTo(-18,-150);g.lineTo(-24,0);g.moveTo(18,-150);g.lineTo(26,0);g.stroke();}
  g.lineWidth=o.dress?16:20;g.beginPath();g.moveTo(-34,-270);g.lineTo(-48,-160);g.stroke();
  const a=o.arm??.5;g.beginPath();g.moveTo(34,-270);g.lineTo(34+Math.sin(a)*110,-270+Math.cos(a)*110);g.stroke();g.restore();}
// sitting silhouette (seat at x,y), legs dangling
function sitter(g,x,y,h,o={}){const k=h/250;g.save();g.translate(x,y);g.scale(k*(o.flip?-1:1),k);g.fillStyle=o.col||'#140b1c';g.strokeStyle=o.col||'#140b1c';g.lineCap='round';g.lineJoin='round';
  g.beginPath();g.arc(8,-215,28,0,7);g.fill();
  if(o.hair){g.beginPath();g.moveTo(-14,-232);g.quadraticCurveTo(-36,-180,-24,-140);g.lineTo(-6,-150);g.quadraticCurveTo(-12,-200,10,-244);g.fill();}
  g.beginPath();g.moveTo(-30,-185);g.lineTo(36,-185);g.lineTo(30,-10);g.lineTo(-28,-10);g.closePath();g.fill();
  g.lineWidth=22;g.beginPath();g.moveTo(-10,-8);g.lineTo(60,0);g.lineTo(70,95);g.moveTo(16,-8);g.lineTo(86,6);g.lineTo(98,100);g.stroke();
  g.lineWidth=16;g.beginPath();g.moveTo(30,-170);g.lineTo(o.reach?110:70,o.reach?-200:-90);g.stroke();g.restore();}

// 7 — GOLDEN HOUR (couple at sunset on the beach)
P.golden=function(g,o){const sw=o.ball??1;
  let gr=g.createLinearGradient(0,0,0,920);gr.addColorStop(0,'#2a1846');gr.addColorStop(.45,'#9c3d6e');gr.addColorStop(.78,'#f2755a');gr.addColorStop(1,'#ffcf7a');g.fillStyle=gr;g.fillRect(0,0,1000,920);
  stars(g,40,21,300,'rgba(255,240,230,.7)');
  // sun + glow
  g.save();const sg=g.createRadialGradient(500,900,40,500,900,520);sg.addColorStop(0,'rgba(255,240,190,.9)');sg.addColorStop(.3,'rgba(255,200,120,.35)');sg.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=sg;g.fillRect(0,300,1000,700);g.restore();
  g.fillStyle='#fff3cf';g.beginPath();g.arc(500,910,165,Math.PI,0);g.fill();
  // clouds
  g.fillStyle='rgba(255,190,150,.35)';for(const [x,y,w] of [[200,560,260],[760,500,300],[620,660,200]]){g.beginPath();g.ellipse(x,y,w,22,0,0,7);g.fill();}
  // sea
  let sea=g.createLinearGradient(0,910,0,1180);sea.addColorStop(0,'#c45a6c');sea.addColorStop(1,'#3a2049');g.fillStyle=sea;g.fillRect(0,910,1000,270);
  g.fillStyle='rgba(255,236,190,.75)';for(let i=0;i<14;i++){const y=925+i*17,w=300-i*18+(i%2)*30;g.fillRect(500-w/2,y,w,4+i*.3);}
  // waves foam
  g.strokeStyle='rgba(255,230,210,.5)';g.lineWidth=4;for(let i=0;i<3;i++){g.beginPath();for(let x=0;x<=1000;x+=20)g.lineTo(x,1150+i*14+Math.sin(x*.03+i)*6);g.stroke();}
  // beach
  g.fillStyle='#1a0f22';g.beginPath();g.moveTo(0,1190);g.quadraticCurveTo(500,1140,1000,1210);g.lineTo(1000,1500);g.lineTo(0,1500);g.fill();
  // couple holding hands
  person(g,455,1262,330,{arm:.55});person(g,560,1268,300,{dress:true,flip:true,arm:.55});
  g.strokeStyle='#1a0f22';g.lineWidth=14;g.lineCap='round';g.beginPath();g.moveTo(455+34*.92+Math.sin(.55)*110*.92,1262-270*.92+Math.cos(.55)*110*.92);g.lineTo(560-34*.83-Math.sin(.55)*110*.83,1268-270*.83+Math.cos(.55)*110*.83);g.stroke();
  // birds
  g.strokeStyle='#2a1530';g.lineWidth=5;for(const [x,y,s] of [[300,400,1],[350,370,.7],[700,330,.8],[740,360,.6]]){g.beginPath();g.moveTo(x-22*s,y-8*s);g.quadraticCurveTo(x-8*s,y-14*s,x,y);g.quadraticCurveTo(x+8*s,y-14*s,x+22*s,y-8*s);g.stroke();}
  cap(g,'Golden Hour','just us and the last light','#ffe7c4');mat(g,'#f6ecdc');grain(g,.05,22);};

// 8 — TO THE MOON & BACK (couple on a crescent moon)
P.moon=function(g,o){const sw=o.ball??1;
  let gr=g.createLinearGradient(0,0,0,1500);gr.addColorStop(0,'#0b1030');gr.addColorStop(.6,'#1d2456');gr.addColorStop(1,'#3a2c6a');g.fillStyle=gr;g.fillRect(0,0,1000,1500);
  stars(g,260,31,1500);for(const [x,y,r] of [[150,220,22],[840,180,28],[760,980,18],[200,1000,16],[880,560,14]])sparkle(g,x,y,r,'#fff3c4');
  // glow
  const mg=g.createRadialGradient(470,640,100,470,640,560);mg.addColorStop(0,'rgba(255,236,170,.12)');mg.addColorStop(1,'rgba(255,236,170,0)');g.fillStyle=mg;g.fillRect(0,0,1000,1300);
  // crescent (outer disc minus an offset disc)
  {const oc=document.createElement('canvas');oc.width=1000;oc.height=1500;const q=oc.getContext('2d');q.fillStyle='#f8e7b0';q.beginPath();q.arc(470,640,330,0,7);q.fill();
   q.fillStyle='rgba(220,190,120,.45)';for(const [x,y,r] of [[250,560,40],[230,720,26],[330,860,32],[300,420,22]]){q.beginPath();q.arc(x,y,r,0,7);q.fill();}
   q.globalCompositeOperation='destination-out';q.fillStyle='#000';q.beginPath();q.arc(610,575,300,0,7);q.fill();g.drawImage(oc,0,0);}
  // couple sitting on lower tip
  sitter(g,330,905,150,{});sitter(g,400,935,135,{hair:true,reach:true});
  // fishing line with a star
  const sx=400+110*.54,sy=935-200*.54;g.strokeStyle='#f8e7b0';g.lineWidth=3;g.beginPath();g.moveTo(sx,sy);g.lineTo(sx+150,sy-120);g.lineTo(sx+150,sy+260+Math.sin(sw*6)*10);g.stroke();sparkle(g,sx+150,sy+290,34,'#ffd36b');
  // clouds
  g.fillStyle='rgba(180,170,230,.35)';for(const [x,y,w] of [[220,1150,320],[760,1210,360],[480,1250,300]]){g.beginPath();g.ellipse(x,y,w,60,0,0,7);g.fill();}
  cap(g,'To The Moon & Back','forever has a nice view','#fbeec7');mat(g,'#f3ead8');grain(g,.05,32);};

// 9 — SOMEWHERE QUIET (mountain lake)
P.mountains=function(g,o){
  let gr=g.createLinearGradient(0,0,0,760);gr.addColorStop(0,'#f6c9a0');gr.addColorStop(.5,'#f3a98e');gr.addColorStop(1,'#d98c8f');g.fillStyle=gr;g.fillRect(0,0,1000,760);
  g.fillStyle='#fff1d8';g.beginPath();g.arc(640,430,110,0,7);g.fill();
  const layers=[['#b9879a',520,.006,90],['#8c6a8a',600,.009,70],['#5d4f78',660,.012,60],['#3b3a62',720,.02,40]];
  const ridge=(c,base,f,amp,seed)=>{const r=R(seed);g.fillStyle=c;g.beginPath();g.moveTo(0,760);for(let x=0;x<=1000;x+=8){const y=base-amp*(1.6*Math.abs(Math.sin(x*f*.55+seed*1.7))+.9*Math.sin(x*f*1.9+seed)+.5*Math.sin(x*f*4.3+seed*3))-r()*5;g.lineTo(x,y);}g.lineTo(1000,760);g.fill();};
  layers.forEach((L,i)=>ridge(L[0],L[1],L[2],L[3],i+3));
  // lake reflection (mirror)
  g.save();g.translate(0,1520);g.scale(1,-1);g.globalAlpha=.55;g.fillStyle=gr;g.fillRect(0,0,1000,760);layers.forEach((L,i)=>ridge(L[0],L[1],L[2],L[3],i+3));g.restore();
  g.fillStyle='rgba(60,60,110,.35)';g.fillRect(0,760,1000,500);g.strokeStyle='rgba(255,240,220,.4)';g.lineWidth=3;for(let i=0;i<12;i++){const y=790+i*30;g.beginPath();g.moveTo(300+i*13,y);g.lineTo(700-i*9,y);g.stroke();}
  // pines foreground
  const pine=(x,y,h)=>{g.fillStyle='#1d1d36';g.beginPath();g.moveTo(x,y-h);for(let i=0;i<5;i++){const yy=y-h+(i+1)*h/5;const w=h*.14*(i+1)/2.4;g.lineTo(x+w,yy);g.lineTo(x+w*.4,yy);}g.lineTo(x+h*.05,y);g.lineTo(x-h*.05,y);for(let i=4;i>=0;i--){const yy=y-h+(i+1)*h/5;const w=h*.14*(i+1)/2.4;g.lineTo(x-w*.4,yy);g.lineTo(x-w,yy);}g.closePath();g.fill();};
  g.fillStyle='#1d1d36';g.fillRect(0,1240,1000,260);[[60,1270,420],[150,1260,300],[880,1270,460],[950,1250,320],[800,1265,260]].forEach(a=>pine(...a));
  cap(g,'Somewhere Quiet','where the mountains meet the water','#fff1d8');mat(g,'#f6efe4');grain(g,.05,42);};

// 10 — CITY LIGHTS (night skyline)
P.city=function(g,o){
  let gr=g.createLinearGradient(0,0,0,900);gr.addColorStop(0,'#090c24');gr.addColorStop(1,'#3a1f5c');g.fillStyle=gr;g.fillRect(0,0,1000,900);stars(g,140,51,600);
  g.fillStyle='#ffe9b8';g.beginPath();g.arc(760,250,70,0,7);g.fill();const mg=g.createRadialGradient(760,250,60,760,250,260);mg.addColorStop(0,'rgba(255,233,184,.3)');mg.addColorStop(1,'rgba(255,233,184,0)');g.fillStyle=mg;g.fillRect(400,0,600,600);
  const r=R(53);const bld=[];let x=20;while(x<980){const w=50+r()*80,h=180+r()*430;bld.push([x,w,h]);x+=w+4;}
  const drawCity=(alpha)=>{for(const [bx,w,h] of bld){g.fillStyle=`rgba(12,10,34,${alpha})`;g.fillRect(bx,900-h,w,h);if(h>480){g.fillRect(bx+w/2-3,900-h-60,6,60);}
    for(let wy=900-h+20;wy<890;wy+=26)for(let wx=bx+8;wx<bx+w-10;wx+=18){if(r()<.45){g.fillStyle=`rgba(255,${200+r()*50|0},120,${alpha*(.5+r()*.5)})`;g.fillRect(wx,wy,9,13);}}}};
  drawCity(1);
  // water
  let wa=g.createLinearGradient(0,900,0,1500);wa.addColorStop(0,'#24154a');wa.addColorStop(1,'#07081c');g.fillStyle=wa;g.fillRect(0,900,1000,600);
  g.save();g.translate(0,1800);g.scale(1,-1);g.globalAlpha=.35;drawCity(1);g.restore();
  g.fillStyle='rgba(255,233,184,.5)';for(let i=0;i<10;i++){const w=100-i*7;g.fillRect(760-w/2,930+i*26,w,4);}
  g.strokeStyle='rgba(180,170,255,.25)';g.lineWidth=2;for(let i=0;i<18;i++){const y=920+i*22;g.beginPath();g.moveTo(r()*400,y);g.lineTo(500+r()*500,y);g.stroke();}
  g.fillStyle='rgba(7,8,28,.85)';g.fillRect(0,1290,1000,210);
  cap(g,'City Lights','the city never really sleeps','#ffe9b8');mat(g,'#f1ece4');grain(g,.05,52);};

// 11 — DESERT NIGHTS (dunes, cactus, big moon)
P.desert=function(g,o){
  let gr=g.createLinearGradient(0,0,0,1000);gr.addColorStop(0,'#1b2a4a');gr.addColorStop(.6,'#7a4a7a');gr.addColorStop(1,'#e08a6a');g.fillStyle=gr;g.fillRect(0,0,1000,1000);stars(g,150,61,700);
  g.fillStyle='#ffe6c2';g.beginPath();g.arc(500,560,230,0,7);g.fill();g.fillStyle='rgba(230,190,160,.35)';for(const [x,y,r] of [[430,500,40],[560,640,30],[600,480,22]]){g.beginPath();g.arc(x,y,r,0,7);g.fill();}
  const dune=(c,y0,amp,ph)=>{g.fillStyle=c;g.beginPath();g.moveTo(0,1500);g.lineTo(0,y0);for(let x=0;x<=1000;x+=10)g.lineTo(x,y0-Math.sin(x*.004+ph)*amp);g.lineTo(1000,1500);g.fill();};
  dune('#c86a5a',900,60,0);dune('#a2505a',990,70,2);dune('#6e3550',1080,60,4);dune('#3d1f3a',1180,50,1);
  // saguaro cactus
  const cactus=(x,y,h)=>{g.save();g.fillStyle='#1d0f22';g.translate(x,y);const w=h*.13;g.beginPath();g.roundRect(-w/2,-h,w,h,w/2);g.fill();
    g.beginPath();g.roundRect(-w*2.1,-h*.62,w*.9,h*.32,w*.45);g.fill();g.fillRect(-w*2.1+w*.1,-h*.36,w*1.8,w*.8);
    g.beginPath();g.roundRect(w*1.2,-h*.78,w*.9,h*.4,w*.45);g.fill();g.fillRect(w*.3,-h*.44,w*1.6,w*.8);g.restore();};
  cactus(250,1250,420);cactus(800,1230,300);cactus(640,1240,170);
  cap(g,'Desert Nights','slow down, look up','#ffe6c2');mat(g,'#f5ece0');grain(g,.05,62);};

// 12 — RISE ABOVE (hot air balloons at dawn)
function balloon(g,x,y,r,cols){g.save();g.translate(x,y);g.beginPath();g.moveTo(0,r*1.25);g.bezierCurveTo(-r*1.25,r*.4,-r*1.2,-r*1.1,0,-r*1.1);g.bezierCurveTo(r*1.2,-r*1.1,r*1.25,r*.4,0,r*1.25);g.closePath();g.save();g.clip();
  const n=cols.length*2;for(let i=0;i<n;i++){g.fillStyle=cols[i%cols.length];g.fillRect(-r*1.3+i*(r*2.6/n),-r*1.2,r*2.6/n+1,r*2.6);}
  const sh=g.createLinearGradient(-r,0,r,0);sh.addColorStop(0,'rgba(0,0,0,.25)');sh.addColorStop(.45,'rgba(255,255,255,.12)');sh.addColorStop(1,'rgba(0,0,0,.3)');g.fillStyle=sh;g.fillRect(-r*1.3,-r*1.2,r*2.6,r*2.6);g.restore();
  g.strokeStyle='rgba(40,20,20,.6)';g.lineWidth=r*.03;g.beginPath();g.moveTo(-r*.3,r*1.15);g.lineTo(-r*.2,r*1.5);g.moveTo(r*.3,r*1.15);g.lineTo(r*.2,r*1.5);g.stroke();g.fillStyle='#6b3f22';g.fillRect(-r*.22,r*1.5,r*.44,r*.3);g.restore();}
P.balloons=function(g,o){const lift=o.ball??1;
  let gr=g.createLinearGradient(0,0,0,1100);gr.addColorStop(0,'#8fc4e0');gr.addColorStop(.6,'#f8d7b4');gr.addColorStop(1,'#f6b38a');g.fillStyle=gr;g.fillRect(0,0,1000,1500);
  g.fillStyle='#fff4dc';g.beginPath();g.arc(300,880,120,0,7);g.fill();
  const hill=(c,y0,amp,f,ph)=>{g.fillStyle=c;g.beginPath();g.moveTo(0,1500);g.lineTo(0,y0);for(let x=0;x<=1000;x+=10)g.lineTo(x,y0-Math.sin(x*f+ph)*amp);g.lineTo(1000,1500);g.fill();};
  hill('#c9a08e',900,40,.006,1);hill('#a27a7a',980,50,.008,3);hill('#7a5a6e',1060,45,.01,5);hill('#4f3e5a',1150,40,.012,2);
  const up=(1-lift)*120;
  balloon(g,640,330+up,120,['#e94f37','#f6c445']);balloon(g,300,520+up*.8,80,['#3d8bd4','#f4f1e8']);balloon(g,830,620+up*.6,65,['#2fae7e','#f6c445']);
  balloon(g,500,760+up*.5,45,['#9b59b6','#f4f1e8']);balloon(g,160,250+up*1.1,50,['#f6c445','#e94f37']);
  cap(g,'Rise Above','every morning is a new sky','#fff4dc');mat(g,'#f8f1e6');grain(g,.04,72);};

window.POSTERS=P;
window.POSTER_TITLES={golden:'Golden Hour',moon:'To The Moon & Back',mountains:'Somewhere Quiet',city:'City Lights',desert:'Desert Nights',balloons:'Rise Above',net:'Nothing But Net',swing:'Swing For The Fences',down:'Never Stay Down',corner:'Top Corner',outwork:'Outwork Everyone',field:'Leave It On The Field'};
window.drawPoster=function(g,id,W,H,opt={}){g.save();g.scale(W/1000,H/1500);P[id](g,opt);g.restore();};
})();
