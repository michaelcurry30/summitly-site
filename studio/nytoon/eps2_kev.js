// KEV channel episodes (toon2 v2 style). Add function <id>(t){...} and register below.
// animatedstickhabit · KEV · Break the Habit tracker. Shared KEV-only props are prefixed kvX_ so they never collide with other channels.
const kvX_C=CAST.KEV;
function kvX_desk(t,o={}){ // warm study corner: mustard wall, shelf, window, wooden desk, desk lamp spotlight
  const wg=g.createLinearGradient(0,0,0,1000);wg.addColorStop(0,'#3b2a12');wg.addColorStop(1,'#6a4a1c');g.fillStyle='#3b2a12';g.fillRect(-600,-800,W+1200,900);g.fillStyle=wg;g.fillRect(-600,0,W+1200,1000);
  g.fillStyle='#4a3020';g.fillRect(-600,990,W+1200,H);g.fillStyle='#24130c';g.fillRect(-600,976,W+1200,22);
  g.save();g.translate(850,430);g.fillStyle='#22345a';g.fillRect(-110,-150,220,300);g.fillStyle='#fff6c8';g.beginPath();g.arc(40,-70,26,0,7);g.fill();
  g.strokeStyle='#f2e6d0';g.lineWidth=14;g.strokeRect(-110,-150,220,300);g.lineWidth=8;g.beginPath();g.moveTo(0,-150);g.lineTo(0,150);g.stroke();g.restore();
  g.save();g.translate(220,380);g.fillStyle='#5a3820';g.strokeStyle=INK;g.lineWidth=7;g.fillRect(-170,0,340,22);g.strokeRect(-170,0,340,22);
  const bc=['#d94f8a','#2d6cdf','#e9c25a','#2fae4e','#d9472b'];bc.forEach((c,i)=>{g.fillStyle=c;g.fillRect(-150+i*42,-110+(i%2)*14,34,110-(i%2)*14);g.strokeRect(-150+i*42,-110+(i%2)*14,34,110-(i%2)*14);});g.restore();
  if(o.door){g.save();g.translate(o.door.x,o.door.y);g.fillStyle='#7a4a26';g.strokeStyle=INK;g.lineWidth=8;g.fillRect(-120,-560,240,560);g.strokeRect(-120,-560,240,560);g.fillStyle='#e9c25a';g.beginPath();g.arc(80,-280,14,0,7);g.fill();g.restore();if(o.door.label)tag(o.door.x,o.door.y-300,o.door.label,'#9fd8ff',40);}
  spot(540,900,760,.45);}
function kvX_table(x,y,w=760){g.save();g.translate(x,y);g.fillStyle='#8a5a2e';g.strokeStyle=INK;g.lineWidth=9;g.beginPath();g.roundRect(-w/2,0,w,46,10);g.fill();g.stroke();
  g.fillRect(-w/2+40,46,30,330);g.strokeRect(-w/2+40,46,30,330);g.fillRect(w/2-70,46,30,330);g.strokeRect(w/2-70,46,30,330);g.restore();}
function kvX_phone(x,y,s,t,o={}){ // o.buzz, o.down (face down), o.face (smug face on screen), o.glow
  g.save();const bz=o.buzz?Math.sin(t*70)*6:0;g.translate(x+bz,y);g.scale(s,s);if(o.rot)g.rotate(o.rot);
  if(o.down){g.fillStyle='#2b2d33';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-60,-14,120,28,8);g.fill();g.stroke();}
  else{if(o.glow){g.shadowColor='#8fd0ff';g.shadowBlur=60*o.glow;}g.fillStyle='#1d1f24';g.strokeStyle=INK;g.lineWidth=9;g.beginPath();g.roundRect(-80,-150,160,300,26);g.fill();g.stroke();g.shadowBlur=0;
    const sg=g.createLinearGradient(0,-130,0,130);sg.addColorStop(0,'#6fb7ff');sg.addColorStop(1,'#b46cff');g.fillStyle=sg;g.beginPath();g.roundRect(-66,-132,132,264,16);g.fill();
    if(o.face){g.fillStyle=INK;g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.arc(-28,-20,10,0,7);g.arc(28,-20,10,0,7);g.fill();g.beginPath();g.arc(0,10,30,.15*Math.PI,.85*Math.PI);g.stroke();
      g.lineWidth=8;g.beginPath();g.moveTo(-46,-50);g.lineTo(-12,-40);g.moveTo(46,-50);g.lineTo(12,-40);g.stroke();}
    else{for(let i=0;i<3;i++){g.fillStyle='rgba(255,255,255,.85)';g.beginPath();g.roundRect(-54,-110+i*60,108,44,10);g.fill();}}
    if(o.buzz){g.strokeStyle='#fff';g.lineWidth=6;for(const sx of[-1,1]){g.beginPath();g.moveTo(sx*100,-60);g.lineTo(sx*120,-20);g.moveTo(sx*104,20);g.lineTo(sx*126,60);g.stroke();}}}
  g.restore();}
function kvX_stamp(x,y,txt,col,u,rot=-.12,size=120){if(u<=0)return;g.save();g.translate(x,y);g.rotate(rot);const sc=lerp(2.2,1,ss(0,1,u));g.scale(sc,sc);g.globalAlpha=ss(0,.4,u);
  g.font=`800 ${size}px BS`;g.textAlign='center';g.textBaseline='middle';const w=g.measureText(txt).width+60;g.strokeStyle=col;g.lineWidth=12;g.strokeRect(-w/2,-size*.65,w,size*1.3);g.fillStyle=col;g.fillText(txt,0,6);g.restore();}
function kvX_dive(t,u,label,drawScene,headY=1000){ // push into the head, flash to X-ray
  if(u<.35){cam(lerp(1.1,3.0,ss(0,.35,u)),540,headY);drawScene();g.restore();g.save();g.fillStyle=`rgba(140,210,255,${ss(.2,.35,u)})`;g.fillRect(0,0,W,H);}
  else{xrayRoom(t);cam(lerp(1.0,1.1,u),540,1050);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.5,.9,u)},t);tag(540,260,label,'#9fd8ff',70);
    g.restore();g.save();g.fillStyle=`rgba(200,235,255,${1-ss(.35,.5,u)})`;g.fillRect(0,0,W,H);}}
function kvX_board(t,u,cards){ // cork evidence board, cards [{x,y,a,t1,t2,ic}] ic(t) draws an icon around (0,-55)
  g.fillStyle='#a0703f';g.fillRect(0,0,W,H);const r=R(23);g.save();for(let i=0;i<2600;i++){g.fillStyle=r()<.5?'rgba(80,45,15,.25)':'rgba(255,220,170,.12)';g.fillRect(r()*W,r()*H,3+r()*4,3+r()*4);}g.restore();
  const k=cards.length,step=1/(k+.4),shown=n=>ss(n*step,n*step+.12,u);
  g.save();g.strokeStyle='#c4161c';g.lineWidth=6;for(let i=0;i<k-1;i++){const a=cards[i],b=cards[i+1],p=ss(i*step+.1,i*step+step,u);if(p<=0)continue;g.beginPath();g.moveTo(a.x,a.y-120);g.lineTo(lerp(a.x,b.x,p),lerp(a.y-120,b.y-120,p));g.stroke();}g.restore();
  cards.forEach((c,i)=>{const a=shown(i);if(a<=0)return;g.save();g.translate(c.x,c.y);g.rotate(c.a);g.scale(.7+.3*a,.7+.3*a);g.globalAlpha=a;
    g.fillStyle='rgba(0,0,0,.3)';g.fillRect(-176,-136,360,300);g.fillStyle='#f3e7cf';g.fillRect(-180,-145,360,300);g.strokeStyle=INK;g.fillStyle=INK;g.lineWidth=8;if(c.ic)c.ic(t);
    g.fillStyle=INK;g.font='800 52px BS';g.textAlign='center';g.textBaseline='alphabetic';g.fillText(c.t1,0,70);g.font='600 34px HG';g.fillStyle='#5b4632';g.fillText(c.t2,0,118);
    g.fillStyle='#c4161c';g.beginPath();g.arc(0,-125,14,0,7);g.fill();g.restore();});}
const kvX_ic={
  ppl:t=>{for(let i=-1;i<=1;i++){g.beginPath();g.arc(i*60,-80,20,0,7);g.fill();g.fillRect(i*60-18,-56,36,40);}},
  down:t=>{g.fillStyle='#2b2d33';g.fillRect(-60,-70,120,26);g.strokeRect(-60,-70,120,26);},
  pocket:t=>{g.fillStyle='#2d4f8a';g.beginPath();g.moveTo(-60,-110);g.lineTo(60,-110);g.lineTo(50,-20);g.lineTo(-50,-20);g.closePath();g.fill();g.stroke();g.fillStyle='#1d1f24';g.fillRect(-20,-130,40,50);},
  door:t=>{g.fillStyle='#7a4a26';g.fillRect(-40,-125,80,110);g.strokeRect(-40,-125,80,110);g.fillStyle='#e9c25a';g.beginPath();g.arc(22,-70,7,0,7);g.fill();},
  down2:t=>{g.lineWidth=12;g.beginPath();g.moveTo(-50,-110);g.lineTo(0,-30);g.lineTo(50,-110);g.stroke();},
  check:t=>{g.strokeStyle='#2fae4e';g.lineWidth=16;g.beginPath();g.moveTo(-50,-70);g.lineTo(-10,-30);g.lineTo(55,-110);g.stroke();}};
function kvX_dark(t,col='#14161f'){g.fillStyle=col;g.fillRect(0,0,W,H);spot(540,900,900,.2);}
function kvX_track(t,L,scene,title,streak,o={}){ // payoff: Kev checks today's box
  const u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.14,u),560,1050);scene();
  kev(300,1620,.85,{...kvX_C,...o,face:'grin',armL:[.2,.15],armR:[1.4,.5]},t);planner(690,1180,.78,t,{title,checked:3+ss(L.s+.4,L.s+1.4,t),col:o.pcol||'#2fae4e'});
  if(t>L.s+1.2)tag(690,760,streak,'#2fae4e',56);}

// ---------------- kv01: why hitting snooze is so hard to stop (Sundelin et al. 2023 survey) ----------------
function kv01(t){T0=t;window.PROD='BREAK THE HABIT TRACKER';window.PTITLE='SNOOZE LOG';window.PCOL='#2fae4e';window.ENDCHAR=kvX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // alarm rings, Kev slaps snooze, back to sleep, counter climbs
    const L=LN(0),u=t-L.s,hit=Math.floor(u/0.8)%2===0;window.CAPY=1560;cam(1.45,600,1000);
    bedroom(t,{txt:'6:'+String(30+Math.min(18,Math.floor(u/0.8)*9)).padStart(2,'0'),ring:hit});bed(540,1180);
    kev(540,1240,1,{face:hit?'tired':'sleep',legs:false,armL:[.5,.4],armR:hit?[2.4,1.2]:[.5,.4],look:hit?.6:0},t);bedFront(540,1180,-120);
    if(!hit)zzz(680,820,t);tag(540,560,'SNOOZE x'+(1+Math.floor(u/0.8)),'#ffb347',60);}
  else if(sh(1)){ // close-up, NOT LAZY stamp
    const L=LN(1),u=t-L.s;window.CAPY=1560;cam(2.3,540,700);bedroom(t,{txt:'6:48'});bed(540,1180);
    kev(540,1240,1,{face:u<1.2?'tired':'smug',talk:talkAmt(1,t)*.6,legs:false,armL:[.5,.4],armR:[.5,.4]},t);bedFront(540,1180,-120);
    g.restore();g.save();kvX_stamp(540,330,'NOT LAZY','#2fae4e',ss(.2,.7,u),-.1,100);if(u>1.4)tag(540,1760,'EVERYBODY DOES IT','#ffe27a',60);}
  else if(sh(2)){ // Kev logs snoozes in his tracker
    const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.08,1.16,u),580,1050);bedroom(t,{txt:'6:48'});bed(540,1180);bedFront(540,1180,-110);
    kev(300,1620,.85,{face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(700,1180,.78,t,{title:'SNOOZE LOG',checked:ss(L.s+.6,L.e,t)*3,col:'#2fae4e'});
    if(t>w[3].s)tag(700,760,'SNOOZES: '+(1+Math.floor(ss(w[3].s,L.e,t)*3)),'#ffb347',56);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    kvX_dive(t,u,'INSIDE KEV',()=>{bedroom(t,{txt:'6:48'});bed(540,1180);kev(540,1240,1,{face:'tired',legs:false},t);bedFront(540,1180,-120);},640);}
  else if(sh(4)){ // 100-head survey grid, 69 light up
    const L=LN(4),u=t-L.s;window.CAPY=1720;kvX_dark(t);tag(540,260,'~1,700 ADULTS SURVEYED','#9fd8ff',56);
    const n=Math.round(69*ss(1.8,4.6,u));for(let i=0;i<100;i++){const cx=180+(i%10)*80,cy=470+Math.floor(i/10)*92;const on=i<n;
      g.fillStyle=on?'#ffb347':'#3a3f52';g.beginPath();g.arc(cx,cy-18,20,0,7);g.fill();g.beginPath();g.roundRect(cx-22,cy+6,44,34,12);g.fill();}
    g.save();g.font='800 170px BS';g.textAlign='center';g.fillStyle='#ffb347';g.shadowColor='#ffb347';g.shadowBlur=30;g.fillText(n+'%',540,1530);g.restore();
    if(u>4)tag(540,1600,'HIT SNOOZE','#ffb347',58);}
  else if(sh(5)){ // sleep meter bouncing in and out, 22 min clock
    const L=LN(5),u=t-L.s;window.CAPY=1700;const v=.45+.4*Math.sin(u*3.2);sleepMeter(t,v);
    tag(540,200,'~'+Math.round(22*ss(.4,2.6,u))+' MIN / MORNING','#ffe27a',64);}
  else if(sh(6)){ // x-ray, fog clouds around the brain: SLEEP INERTIA
    const L=LN(6),u=t-L.s;window.CAPY=1720;xrayRoom(t);cam(lerp(1.6,1.8,ss(L.s,L.e,t)),540,1000);
    kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.15},t);
    g.save();for(let i=0;i<9;i++){const a=i/9*Math.PI*2+t*.4,r=150+20*Math.sin(t*2+i);g.fillStyle=`rgba(210,215,230,${.55*ss(.3,1.2,u)})`;g.beginPath();g.arc(540+Math.cos(a)*r,935+Math.sin(a)*r*.6,70,0,7);g.fill();}g.restore();
    g.restore();g.save();if(u>2.2)tag(540,300,'SLEEP INERTIA','#ffe27a',88);}
  else if(sh(7)){ // brain booting up: loading bar
    const L=LN(7),u=ss(L.s,L.e-.2,t);window.CAPY=1720;xrayRoom(t);cam(1.25,540,1100);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:u},t);
    g.restore();g.save();g.fillStyle='rgba(10,14,22,.85)';g.strokeStyle='#9fd8ff';g.lineWidth=6;g.beginPath();g.roundRect(190,330,700,90,20);g.fill();g.stroke();
    g.fillStyle='#2fae4e';g.beginPath();g.roundRect(204,344,672*u,62,14);g.fill();g.font='800 48px BS';g.textAlign='center';g.fillStyle='#fff';g.fillText('BRAIN BOOTING... '+Math.round(u*100)+'%',540,280);}
  else{kvX_track(t,LN(8),()=>{bedroom(t,{txt:'6:30'});bed(540,1180);bedFront(540,1180,-110);},'SNOOZE LOG','UP ON RING #1');}
  g.restore();vignette(.6);
  if(t<END)caption(t);endCard(t,END);}

// ---------------- kv02: phone nearby drains focus (Ward et al. 2017 "brain drain") ----------------
function kv02(t){T0=t;window.PROD='BREAK THE HABIT TRACKER';window.PTITLE='PHONE-FREE';window.PCOL='#2d6cdf';const C={...kvX_C,shirt:'#2d6cdf'};window.ENDCHAR=C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // at the desk, eyes keep sliding to the buzzing phone
    const L=LN(0),u=t-L.s,peek=Math.sin(u*3)>0;window.CAPY=1760;cam(1.2,540,1080);kvX_desk(t);
    kev(420,1560,.9,{...C,face:peek?'shock':'tired',look:peek?.9:-.2,armL:[.6,1.4],armR:[.6,1.4]},t);kvX_table(540,1150);kvX_phone(820,1120,.5,t,{buzz:peek});
    tag(540,330,'FOCUS: '+Math.max(0,Math.round(40-u*14))+'%','#ff6b5e',62);}
  else if(sh(1)){ // phone close-up with a smug face
    const L=LN(1),u=t-L.s;window.CAPY=1700;kvX_dark(t,'#1b1430');kvX_phone(540,950,2.6,t,{face:u>.9,glow:.8});
    g.restore();g.save();kvX_stamp(540,300,'NOT WEAK FOCUS','#2fae4e',ss(.1,.6,u),-.08,84);}
  else if(sh(2)){ // planner: phone-free blocks
    const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.06,1.14,u),560,1050);kvX_desk(t);
    kev(300,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(700,1180,.78,t,{title:'PHONE-FREE',checked:ss(L.s+.6,L.e,t)*2,col:'#2d6cdf'});
    if(u>.4)tag(700,760,'25-MIN BLOCKS','#9fd8ff',54);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1760;
    kvX_dive(t,u,'INSIDE KEV',()=>{kvX_desk(t);kev(540,1560,.9,{...C,face:'tired'},t);kvX_table(540,1150);kvX_phone(820,1120,.5,t,{});},1560-540);}
  else if(sh(4)){ // evidence board: the setup
    const L=LN(4),u=ss(L.s,L.e-.3,t);window.CAPY=1760;cam(lerp(1.05,1.1,u),540,lerp(880,980,u));
    kvX_board(t,u,[{x:300,y:430,a:-.06,t1:'~800',t2:'people tested',ic:kvX_ic.ppl},{x:780,y:700,a:.05,t1:'DESK',t2:'face down',ic:kvX_ic.down},{x:310,y:1040,a:.04,t1:'POCKET',t2:'or bag',ic:kvX_ic.pocket},{x:770,y:1340,a:-.05,t1:'OTHER ROOM',t2:'out of sight',ic:kvX_ic.door}]);}
  else if(sh(5)){ // bar chart: other room wins
    const L=LN(5),u=t-L.s;window.CAPY=1760;kvX_dark(t);tag(540,260,'MEMORY + FOCUS TESTS','#9fd8ff',58);
    const bars=[['DESK',.55,'#ff6b5e'],['POCKET',.66,'#ffb347'],['OTHER ROOM',.9,'#2fae4e']];
    bars.forEach(([lb,hv,c],i)=>{const x=240+i*300,h=780*hv*ss(.5+i*.3,1.6+i*.3,u);g.fillStyle=c;g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(x-100,1450-h,200,h,[16,16,0,0]);g.fill();g.stroke();
      g.fillStyle='#fff';g.font='800 46px BS';g.textAlign='center';g.fillText(lb,x,1530);});
    g.fillStyle='#fff';g.fillRect(100,1450,880,8);if(u>2.6){kev(840,620,.4,{...C,face:'grin',armL:[.2,.15],armR:[2.6,.5]},t);}
    g.font='600 30px HG';g.fillStyle='rgba(255,255,255,.6)';g.textAlign='center';g.fillText('illustration, not to scale',540,1590);}
  else if(sh(6)){ // x-ray: attention leaking toward the phone
    const L=LN(6),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(1.15,640,1080);kev(480,1560,1.0,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.25},t);
    kvX_phone(900,1250,.6,t,{glow:.7});g.save();g.setLineDash([18,14]);g.lineDashOffset=-t*80;g.strokeStyle='#ffe27a';g.lineWidth=8;g.globalAlpha=ss(.3,1,u);
    g.beginPath();g.moveTo(480,935);g.quadraticCurveTo(760,820,900,1150);g.stroke();g.restore();
    g.restore();g.save();if(u>1)tag(540,300,'ATTENTION LEAK','#ffe27a',80);if(u>2.4)tag(540,440,'never touched it','#9fd8ff',52);}
  else if(sh(7)){ // newer studies: smaller effect, still an easy win
    const L=LN(7),u=t-L.s;window.CAPY=1760;cam(1.15,540,1050);kvX_desk(t,{door:{x:870,y:990,label:'OTHER ROOM'}});
    if(u>1.8)tag(480,560,'LATER STUDIES: SMALLER EFFECT','#ffb347',46);if(u>3.2)tag(480,680,'STILL AN EASY WIN','#2fae4e',58);
    const walk=ss(.2,1.8,u);kev(lerp(380,780,walk),1580,.85,{...C,face:'smug',armL:[.2,.15],armR:[1.5,.5],bob:Math.abs(Math.sin(u*9))*-10*(walk<1?1:0)},t);
    if(walk<1)kvX_phone(lerp(380,780,walk)+90,1150,.4,t,{});}
  else{kvX_track(t,LN(8),()=>kvX_desk(t,{door:{x:980,y:990}}),'PHONE-FREE','4 BLOCKS DONE',{shirt:'#2d6cdf',pcol:'#2d6cdf'});}
  g.restore();vignette(.6);
  if(t<END)caption(t);endCard(t,END);}

// ---------------- kv03: future you feels like a stranger (Ersner-Hershfield et al. 2009; Hershfield 2011) ----------------
function kv03(t){T0=t;window.PROD='DAILY HABIT BUILDER';window.PTITLE='TODAY';window.PCOL='#e07b24';const C={...kvX_C,shirt:'#e07b24'};window.ENDCHAR=C;const last=TL.lines.length-1,END=LN(last).e+.35;
  const FK={...kvX_C,shirt:'#7a7f8c',hairCol:'#b9bcc4'};
  const box=(x,y,s,lb)=>{g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#c98b4f';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-80,-70,160,140,10);g.fill();g.stroke();g.fillStyle=INK;g.font='800 30px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(lb,0,0);g.restore();};
  const TASKS=['EMAIL','LAUNDRY','ESSAY','DISHES','TAXES'];
  g.save();
  if(sh(0)){ // Kev shoves task boxes through a door labelled FUTURE KEV
    const L=LN(0),u=t-L.s;window.CAPY=1760;cam(1.12,540,1050);kvX_desk(t,{door:{x:900,y:1000,label:'FUTURE KEV'}});
    TASKS.forEach((lb,i)=>{const p=ss(.3+i*.4,.8+i*.4,u);if(p<1)box(lerp(420,900,p),lerp(1520-i*40,1300,p),.9*(1-p*.5),lb);});
    kev(260,1620,.85,{...C,face:'smug',armL:[1.5,.2],armR:[1.5,.2]},t);}
  else if(sh(1)){ // close-up: future Kev is "someone else"
    const L=LN(1),u=t-L.s;window.CAPY=1760;cam(1.25,540,1100);kvX_desk(t);
    kev(330,1600,.85,{...C,face:u<1.6?'calm':'smug',talk:talkAmt(1,t)*.6},t);g.save();g.globalAlpha=ss(1.4,2.2,u);kev(780,1600,.85,{...FK,face:'shock',armL:[2.3,.6],armR:[2.3,.6]},t);g.restore();
    g.restore();g.save();if(u>1.8)tag(780,560,'WHO IS THIS?','#9fd8ff',58);kvX_stamp(540,300,'"SOMEONE ELSE"','#ff6b5e',ss(2.4,2.9,u),-.08,90);}
  else if(sh(2)){ // planner tasks all bumped to tomorrow
    const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.06,1.14,u),560,1050);kvX_desk(t);
    kev(300,1620,.85,{...C,face:t<w[9].s?'calm':'smug',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(700,1180,.78,t,{title:'TODAY',checked:0,col:'#e07b24'});
    if(t>w[9].s){const p=ss(w[9].s,L.e,t);for(let i=0;i<3;i++){tag(700+p*260,1060+i*90,'→ TOMORROW','#ff6b5e',40);}}}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1760;
    kvX_dive(t,u,'INSIDE KEV',()=>{kvX_desk(t);kev(540,1560,.9,{...C,face:'smug'},t);},1560-540);}
  else if(sh(4)){ // brain scan: FUTURE ME vs A STRANGER light up alike
    const L=LN(4),u=t-L.s;window.CAPY=1760;kvX_dark(t,'#0f1a24');tag(540,250,'BRAIN SCAN STUDIES','#9fd8ff',62);
    const gl=ss(1.6,3,u)*(.7+.3*Math.sin(t*5));
    [[300,'FUTURE ME',FK],[780,'A STRANGER',{...kvX_C,hair:'buzz',hairCol:'#120c08',skin:'#8a5534',shirt:'#5b5f6b'}]].forEach(([x,lb,P],i)=>{
      g.save();g.globalAlpha=ss(.3+i*.6,.9+i*.6,u);g.fillStyle='rgba(10,14,22,.85)';g.strokeStyle='#9fd8ff';g.lineWidth=6;g.beginPath();g.roundRect(x-220,380,440,640,24);g.fill();g.stroke();
      kev(x,1000,.5,{...P,face:'calm'},t);g.restore();brain(x,480,1.1,t,gl*ss(.3+i*.6,.9+i*.6,u));tag(x,1080,lb,'#ffe27a',48);});
    if(u>3.2)tag(540,1250,'LOOKED SIMILAR','#2fae4e',64);
    kev(540,1660,.45,{...C,face:u>3.2?'shock':'calm'},t);}
  else if(sh(5)){ // dumping boxes on future Kev
    const L=LN(5),u=t-L.s;window.CAPY=1760;cam(1.1,540,1050);kvX_desk(t);
    kev(260,1620,.8,{...C,face:'smug',armL:[1.5,.2],armR:[1.5,.2]},t);kev(800,1620,.8,{...FK,face:u<1?'calm':'shock',armL:[2.6,.3],armR:[2.6,.3]},t);
    TASKS.forEach((lb,i)=>{const p=ss(.2+i*.45,.7+i*.45,u);if(p<=0)return;const x=lerp(380,800,p),y=lerp(1280,880-i*130,p)-Math.sin(p*Math.PI)*220;box(x,y,.85,lb);});}
  else if(sh(6)){ // closeness circles: me today + future me slide together
    const L=LN(6),u=t-L.s;window.CAPY=1760;kvX_dark(t,'#1a1220');const d=lerp(360,120,ss(.8,2.6,u));
    g.save();g.globalAlpha=.75;g.fillStyle='#e07b24';g.beginPath();g.arc(540-d,900,260,0,7);g.fill();g.fillStyle='#7a7f8c';g.beginPath();g.arc(540+d,900,260,0,7);g.fill();g.restore();
    g.fillStyle='#fff';g.font='800 50px BS';g.textAlign='center';g.fillText('TODAY ME',540-d-60,900);g.fillText('FUTURE ME',540+d+60,900);
    if(u>2.4)tag(540,330,'FELT CLOSER','#ffe27a',72);if(u>3.4)tag(540,1330,'MORE PATIENT CHOICES','#2fae4e',58);}
  else if(sh(7)){ // big 5:00 timer, Kev gets to work
    const L=LN(7),u=t-L.s;window.CAPY=1760;cam(1.1,540,1050);kvX_desk(t);kvX_table(540,1150);
    kev(420,1560,.9,{...C,face:u<1.2?'calm':'grin',armL:[.6,1.4],armR:[.6,1.4]},t);box(780,1080,.7,'ESSAY');
    const left=Math.max(0,300-Math.floor(ss(.8,L.e-L.s,u)*30));g.save();g.fillStyle='rgba(10,14,22,.9)';g.strokeStyle='#e07b24';g.lineWidth=8;g.beginPath();g.roundRect(290,250,500,200,30);g.fill();g.stroke();
    g.font='800 140px BS';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#ffe27a';g.fillText(Math.floor(left/60)+':'+String(left%60).padStart(2,'0'),540,355);g.restore();
    if(u>1.6)tag(540,540,'JUST 5 MINUTES','#2fae4e',56);}
  else{kvX_track(t,LN(8),()=>kvX_desk(t),'TODAY','DONE TODAY, NOT TOMORROW',{shirt:'#e07b24',pcol:'#e07b24'});}
  g.restore();vignette(.6);
  if(t<END)caption(t);endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{kv01,kv02,kv03});

// ---------------- shared props for kv04-kv07 ----------------
function kvX_hand(x,y,s,a,side=1){const sx=84*side,sy=-440,ex=sx+Math.sin(a[0])*118*side,ey=sy+Math.cos(a[0])*118;return[x+s*(ex+Math.sin(a[0]+a[1])*118*side),y+s*(ey+Math.cos(a[0]+a[1])*118)];}
function kvX_bag(x,y,s,rot=0,col='#d9472b'){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.fillStyle=col;g.strokeStyle=INK;g.lineWidth=9;g.beginPath();g.moveTo(-90,-130);g.lineTo(90,-130);g.lineTo(110,130);g.lineTo(-110,130);g.closePath();g.fill();g.stroke();
  g.fillStyle='#e9c25a';g.beginPath();g.ellipse(0,10,62,46,0,0,7);g.fill();g.stroke();g.fillStyle=INK;g.font='800 40px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('CHIPS',0,12);
  for(let i=-3;i<=3;i++){g.beginPath();g.moveTo(i*28,-130);g.lineTo(i*28+14,-146);g.lineTo(i*28+28,-130);g.stroke();}g.restore();}
function kvX_chip(x,y,r,a=0){g.save();g.translate(x,y);g.rotate(a);g.fillStyle='#f2c14e';g.strokeStyle=INK;g.lineWidth=4;g.beginPath();g.ellipse(0,0,r,r*.75,0,0,7);g.fill();g.stroke();g.restore();}
function kvX_bowl(x,y,s,fill=1){g.save();g.translate(x,y);g.scale(s,s);for(let i=0;i<Math.round(9*fill);i++)kvX_chip(-70+(i%5)*35,-20-Math.floor(i/5)*26,26,i);
  g.fillStyle='#2d6cdf';g.strokeStyle=INK;g.lineWidth=9;g.beginPath();g.moveTo(-130,-20);g.quadraticCurveTo(-120,90,0,95);g.quadraticCurveTo(120,90,130,-20);g.closePath();g.fill();g.stroke();g.restore();}
function kvX_bar(x,y,s,kind){g.save();g.translate(x,y);g.scale(s,s);const ch=kind==='choc';g.fillStyle=ch?'#5a3018':'#d8a85a';g.strokeStyle=INK;g.lineWidth=9;g.beginPath();g.roundRect(-150,-60,300,120,16);g.fill();g.stroke();
  g.fillStyle=ch?'#9b2c3a':'#2fae4e';g.fillRect(-70,-60,140,120);g.strokeRect(-70,-60,140,120);g.fillStyle='#fff';g.font='800 34px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(ch?'CHOCO':'GRANOLA',0,2);g.restore();}
function kvX_people(n,lit,cols,x0,y0,dx,dy,col){for(let i=0;i<n;i++){const cx=x0+(i%cols)*dx,cy=y0+Math.floor(i/cols)*dy;g.fillStyle=i<lit?col:'#3a3f52';g.beginPath();g.arc(cx,cy-18,20,0,7);g.fill();g.beginPath();g.roundRect(cx-22,cy+6,44,34,12);g.fill();}}
function kvX_big(txt,x,y,col,size=170){g.save();g.font=`800 ${size}px BS`;g.textAlign='center';g.fillStyle=col;g.shadowColor=col;g.shadowBlur=30;g.fillText(txt,x,y);g.restore();}
function kvX_timer(x,y,txt,col='#ffe27a',bd='#e07b24'){g.save();g.fillStyle='rgba(10,14,22,.9)';g.strokeStyle=bd;g.lineWidth=8;g.beginPath();g.roundRect(x-250,y-100,500,200,30);g.fill();g.stroke();
  g.font='800 140px BS';g.textAlign='center';g.textBaseline='middle';g.fillStyle=col;g.fillText(txt,x,y+5);g.restore();}
function kvX_bubble(x,y,txt,col,size=64,a=1){if(a<=0)return;g.save();g.globalAlpha=a;g.font=`800 ${size}px BS`;const w=g.measureText(txt).width+80,h=size*1.7;g.fillStyle='#fff';g.strokeStyle=INK;g.lineWidth=8;
  g.beginPath();g.roundRect(x-w/2,y-h/2,w,h,40);g.fill();g.stroke();g.beginPath();g.moveTo(x-40,y+h/2-4);g.lineTo(x-70,y+h/2+50);g.lineTo(x,y+h/2-4);g.fill();g.stroke();
  g.fillStyle=col;g.textAlign='center';g.textBaseline='middle';g.fillText(txt,x,y+4);g.restore();}
function kvX_barChart(t,u,title,bars,note){kvX_dark(t);tag(540,260,title,'#9fd8ff',56);
  bars.forEach(([lb,hv,c,val],i)=>{const n=bars.length,x=540+(i-(n-1)/2)*340,p=ss(.5+i*.5,1.6+i*.5,u),h=760*hv*p;g.fillStyle=c;g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(x-120,1450-h,240,Math.max(1,h),[16,16,0,0]);g.fill();g.stroke();
    g.fillStyle='#fff';g.font='800 46px BS';g.textAlign='center';g.fillText(lb,x,1530);if(val&&p>.9){g.font='800 70px BS';g.fillText(val,x,1420-h);}});
  g.fillStyle='#fff';g.fillRect(100,1450,880,8);if(note){g.font='600 30px HG';g.fillStyle='rgba(255,255,255,.6)';g.textAlign='center';g.fillText(note,540,1600);}}

// ---------------- kv04: phantom vibrations (Drouin et al. 2012, ~290 undergrads, ~89%) ----------------
function kv04(t){T0=t;window.PROD='BREAK THE HABIT TRACKER';window.PTITLE='FAKE BUZZES';window.PCOL='#7d4cc2';const C={...kvX_C,shirt:'#7d4cc2'};window.ENDCHAR=C;const last=TL.lines.length-1,END=LN(last).e+.35;
  const buzzMarks=(x,y,a)=>{if(a<=0)return;g.save();g.globalAlpha=a;g.strokeStyle='#ffe27a';g.lineWidth=8;for(const sx of[-1,1])for(let k=0;k<2;k++){g.beginPath();g.moveTo(x+sx*(50+k*30),y-30);g.lineTo(x+sx*(64+k*30),y);g.lineTo(x+sx*(50+k*30),y+30);g.stroke();}g.restore();};
  g.save();
  if(sh(0)){ // buzz at the pocket, Kev grabs phone: nothing
    const L=LN(0),u=t-L.s,grab=ss(1.2,1.8,u);window.CAPY=1760;cam(1.2,540,1080);kvX_desk(t);
    const aR=[lerp(.3,1.9,grab),lerp(.2,.9,grab)];kev(500,1620,.9,{...C,face:u<1.2?'shock':u<2.2?'calm':'tired',armR:aR,look:grab>.5?.7:0},t);
    if(u<1.3)buzzMarks(560+Math.sin(t*70)*5,1460,1);if(grab>0){const [hx,hy]=kvX_hand(500,1620,.9,aR,1);kvX_phone(hx+30,hy-80,.55,t,{glow:.4});}
    if(u>2.0)tag(540,420,'0 NEW NOTIFICATIONS','#9fd8ff',56);}
  else if(sh(1)){const L=LN(1),u=t-L.s;window.CAPY=1760;cam(1.7,540,900);kvX_desk(t);kev(540,1560,.9,{...C,face:u<1.4?'shock':'smug',talk:talkAmt(1,t)*.6},t);
    g.restore();g.save();kvX_stamp(540,320,'NOT A GHOST','#ff6b5e',ss(.1,.6,u),-.1,100);if(u>2)tag(540,1460,'BUZZ PATROL','#ffe27a',70);}
  else if(sh(2)){const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.06,1.14,u),560,1050);kvX_desk(t);
    kev(300,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(700,1180,.78,t,{title:'FAKE BUZZES',checked:ss(L.s+.6,L.e,t)*3,col:'#7d4cc2'});
    if(t>w[3].s)tag(700,760,'FAKE BUZZES: '+(1+Math.floor(ss(w[3].s,L.e,t)*3)),'#ffb347',50);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1760;kvX_dive(t,u,'INSIDE KEV',()=>{kvX_desk(t);kev(540,1560,.9,{...C,face:'tired'},t);},1560-540);}
  else if(sh(4)){const L=LN(4),u=t-L.s;window.CAPY=1720;kvX_dark(t);tag(540,260,'~290 COLLEGE STUDENTS','#9fd8ff',56);
    const n=Math.round(89*ss(1.8,4.4,u));kvX_people(100,n,10,180,470,80,92,'#b07cff');kvX_big(n+'%',540,1530,'#b07cff');if(u>4.2)tag(540,1610,'FELT PHANTOM BUZZES','#ffe27a',54);}
  else if(sh(5)){ // calendar: one buzz every ~2 weeks, bother meter low
    const L=LN(5),u=t-L.s;window.CAPY=1760;kvX_dark(t,'#16131f');tag(540,250,'ABOUT EVERY 2 WEEKS','#9fd8ff',60);
    for(let i=0;i<28;i++){const x=200+(i%7)*113,y=420+Math.floor(i/7)*130,on=(i===13||i===27)&&u>(i===13?1:1.6);g.fillStyle=on?'#b07cff':'#2b2f40';g.strokeStyle=INK;g.lineWidth=5;g.beginPath();g.roundRect(x-48,y-52,96,104,12);g.fill();g.stroke();
      if(on){g.fillStyle='#fff';g.font='800 46px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('BZZ',x,y+2);}}
    const v=ss(2,3.2,u)*.15;g.fillStyle='#2b2f40';g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.roundRect(190,1080,700,70,35);g.fill();g.stroke();g.fillStyle='#2fae4e';g.beginPath();g.roundRect(196,1086,688*v+20,58,29);g.fill();
    g.fillStyle='#fff';g.font='800 44px BS';g.textAlign='center';g.fillText('BOTHER LEVEL',540,1060);if(u>3)kev(540,1690,.5,{...C,face:'smug',armL:[1.6,1.1],armR:[1.6,1.1]},t);}
  else if(sh(6)){ // x-ray: random twitch at the pocket read as a buzz
    const L=LN(6),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(1.1,540,1080);kev(540,1560,1.0,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.3+.3*Math.sin(t*8)},t);
    const tw=(u*1.3)%1;g.save();g.fillStyle=`rgba(255,226,120,${1-tw})`;g.beginPath();g.arc(600,1430,20+tw*60,0,7);g.fill();g.restore();
    g.save();g.setLineDash([18,14]);g.lineDashOffset=-t*90;g.strokeStyle='#ffe27a';g.lineWidth=8;g.globalAlpha=ss(.3,1,u);g.beginPath();g.moveTo(600,1430);g.quadraticCurveTo(760,1150,560,940);g.stroke();g.restore();
    g.restore();g.save();if(u>1)tag(540,300,'PRIMED FOR THE BUZZ','#ffe27a',70);if(u>2.6)tag(820,1500,'just a twitch','#9fd8ff',46);}
  else if(sh(7)){ // notification toggles switch off
    const L=LN(7),u=t-L.s;window.CAPY=1760;kvX_dark(t,'#141a26');tag(540,250,'NOTIFICATIONS','#9fd8ff',64);
    ['SALES','GAMES','LIKES','GROUP CHAT'].forEach((lb,i)=>{const y=470+i*170,off=ss(.6+i*.5,.9+i*.5,u);g.fillStyle='rgba(255,255,255,.08)';g.beginPath();g.roundRect(170,y-65,740,130,24);g.fill();
      g.fillStyle='#fff';g.font='800 54px BS';g.textAlign='left';g.textBaseline='middle';g.fillText(lb,220,y+4);g.fillStyle=off>.5?'#4a4f60':'#2fae4e';g.beginPath();g.roundRect(700,y-38,160,76,38);g.fill();
      g.fillStyle='#fff';g.beginPath();g.arc(lerp(822,738,off),y,30,0,7);g.fill();});
    if(u>2.8)kev(540,1690,.5,{...C,face:'grin'},t);}
  else{kvX_track(t,LN(8),()=>kvX_desk(t),'FAKE BUZZES','QUIET POCKET',{shirt:'#7d4cc2',pcol:'#7d4cc2'});}
  g.restore();vignette(.6);if(t<END)caption(t);endCard(t,END);}

// ---------------- kv05: ultra-processed food eaten faster, ~500 kcal/day more (Hall et al. 2019, NIH, 20 adults) ----------------
function kv05(t){T0=t;window.PROD='BREAK THE HABIT TRACKER';window.PTITLE='SNACK LOG';window.PCOL='#d9472b';const C={...kvX_C,shirt:'#2fae4e'};window.ENDCHAR=C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // chips vanish, counter climbs
    const L=LN(0),u=t-L.s,ph=(u*2.2)%1;window.CAPY=1760;cam(1.2,540,1080);kvX_desk(t);
    const aR=[lerp(.5,2.5,Math.sin(ph*Math.PI)),lerp(.4,1.6,Math.sin(ph*Math.PI))];kev(420,1620,.9,{...C,face:'smug',armR:aR,talk:Math.sin(ph*Math.PI)},t);
    kvX_bag(770,1360,.9,.08);const [hx,hy]=kvX_hand(420,1620,.9,aR,1);kvX_chip(hx,hy-14,24,t*3);tag(540,400,'CHIPS: '+Math.min(47,3+Math.floor(u*14)),'#ffb347',62);}
  else if(sh(1)){const L=LN(1),u=t-L.s;window.CAPY=1760;cam(1.6,560,950);kvX_desk(t);kev(500,1560,.9,{...C,face:u<1.4?'tired':'calm',talk:talkAmt(1,t)*.6},t);kvX_bag(800,1300,.7);
    g.restore();g.save();kvX_stamp(540,320,'NOT ZERO WILLPOWER','#2fae4e',ss(.1,.6,u),-.08,62);if(u>2.2)tag(540,1450,'BUILT TO GO DOWN FAST','#ffe27a',58);}
  else if(sh(2)){const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.06,1.14,u),560,1050);kvX_desk(t);
    kev(300,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(700,1180,.78,t,{title:'SNACK LOG',checked:ss(L.s+.6,L.e,t)*2,col:'#d9472b'});
    if(t>w[4].s)tag(700,760,'SNACK ATTACKS','#ff6b5e',54);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1760;kvX_dive(t,u,'INSIDE KEV',()=>{kvX_desk(t);kev(540,1560,.9,{...C,face:'smug'},t);},1560-540);}
  else if(sh(4)){const L=LN(4),u=ss(L.s,L.e-.3,t);window.CAPY=1760;cam(lerp(1.05,1.1,u),540,lerp(880,980,u));
    kvX_board(t,u,[{x:300,y:430,a:-.06,t1:'20',t2:'adults (NIH)',ic:kvX_ic.ppl},{x:780,y:700,a:.05,t1:'IN A LAB',t2:'about a month',ic:kvX_ic.door},
      {x:310,y:1040,a:.04,t1:'2 WEEKS',t2:'ultra-processed',ic:()=>kvX_bag(0,-75,.32)},{x:770,y:1340,a:-.05,t1:'2 WEEKS',t2:'less processed',ic:()=>{g.fillStyle='#d9472b';g.beginPath();g.arc(0,-70,44,0,7);g.fill();g.stroke();g.strokeStyle='#2fae4e';g.beginPath();g.moveTo(0,-112);g.lineTo(14,-132);g.stroke();}}]);}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1760;kvX_barChart(t,u,'CALORIES EATEN PER DAY',[['LESS',.66,'#2fae4e'],['ULTRA',.86,'#d9472b','+~500']],'illustration, not to scale');}
  else if(sh(6)){ // x-ray: chips in fast, fullness signal crawling up
    const L=LN(6),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(1.05,540,1080);kev(540,1560,1.0,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.2},t);
    for(let i=0;i<5;i++){const p=((u*1.6)+i*.2)%1;kvX_chip(lerp(900,560,p),lerp(700,980,p),20,p*9);}
    const f=ss(.5,4,u)*.55;g.save();g.strokeStyle='#2fae4e';g.lineWidth=14;g.shadowColor='#2fae4e';g.shadowBlur=20;g.beginPath();g.moveTo(540,1300);g.lineTo(540,lerp(1300,860,f));g.stroke();g.restore();
    g.restore();g.save();if(u>.8)tag(540,300,'EATING FAST','#ff6b5e',72);if(u>2.2)tag(540,430,'FULLNESS: LOADING...','#2fae4e',54);}
  else if(sh(7)){ // pour a bowl, bag goes to the kitchen
    const L=LN(7),u=t-L.s;window.CAPY=1760;cam(1.12,540,1050);kvX_desk(t,{door:{x:900,y:990,label:'KITCHEN'}});kvX_table(480,1150,600);
    const go=ss(2.2,3.4,u);kvX_bowl(400,1110,.9,ss(.4,1.8,u));if(go<1)kvX_bag(lerp(620,900,go),lerp(1040,900,go),.6*(1-go*.6),lerp(-.9,0,ss(.4,1.8,u)));
    kev(220,1620,.8,{...C,face:u<2?'calm':'grin',armL:[.3,.2],armR:[1.5,.4]},t);if(u>1.8)tag(400,780,'ONE PORTION','#2fae4e',56);}
  else{kvX_track(t,LN(8),()=>kvX_desk(t),'SNACK LOG','ONE BOWL DONE',{shirt:'#2fae4e',pcol:'#d9472b'});}
  g.restore();vignette(.6);if(t<END)caption(t);endCard(t,END);}

// ---------------- kv06: boredom vs a mild shock (Wilson et al. 2014, Science) ----------------
function kv06(t){T0=t;window.PROD='BREAK THE HABIT TRACKER';window.PTITLE='BORED GRABS';window.PCOL='#e07b24';const C={...kvX_C,shirt:'#d94f8a'};window.ENDCHAR=C;const last=TL.lines.length-1,END=LN(last).e+.35;
  const btn=(x,y,s,pr)=>{g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#3a3f52';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-110,-20,220,60,12);g.fill();g.stroke();g.fillStyle='#e0312b';g.beginPath();g.ellipse(0,-20+pr*14,80,34,0,Math.PI,0);g.lineTo(80,-6+pr*10);g.lineTo(-80,-6+pr*10);g.fill();g.stroke();g.restore();};
  const zap=(x,y,a)=>{if(a<=0)return;g.save();g.globalAlpha=a;g.strokeStyle='#ffe27a';g.lineWidth=10;g.shadowColor='#ffe27a';g.shadowBlur=24;for(let k=0;k<4;k++){const an=k*1.6+t*3;g.beginPath();g.moveTo(x,y);g.lineTo(x+Math.cos(an)*60,y+Math.sin(an)*40-30);g.lineTo(x+Math.cos(an)*110,y+Math.sin(an)*70);g.stroke();}g.restore();};
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s,grab=ss(.9,1.3,u);window.CAPY=1760;cam(1.2,540,1080);kvX_desk(t);
    const aR=[lerp(.3,1.9,grab),lerp(.2,.9,grab)];kev(500,1620,.9,{...C,face:grab<.5?'tired':'grin',armR:aR},t);if(grab>0){const [hx,hy]=kvX_hand(500,1620,.9,aR,1);kvX_phone(hx+30,hy-80,.55,t,{glow:.5});}
    tag(540,400,'BORED FOR: '+Math.min(.9,u*.7).toFixed(1)+' SEC','#ffb347',58);}
  else if(sh(1)){const L=LN(1),u=t-L.s;window.CAPY=1760;cam(1.7,540,900);kvX_desk(t);kev(540,1560,.9,{...C,face:u<1.6?'calm':'shock',talk:talkAmt(1,t)*.6},t);
    g.restore();g.save();kvX_stamp(540,320,'NOTHING = HARD','#ff6b5e',ss(1.6,2.1,u),-.1,96);}
  else if(sh(2)){const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.06,1.14,u),560,1050);kvX_desk(t);
    kev(300,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(700,1180,.78,t,{title:'BORED GRABS',checked:ss(L.s+.6,L.e,t)*3,col:'#e07b24'});
    if(t>w[4].s)tag(700,760,'GRABS: '+(1+Math.floor(ss(w[4].s,L.e,t)*3)),'#ffb347',54);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1760;kvX_dive(t,u,'INSIDE KEV',()=>{kvX_desk(t);kev(540,1560,.9,{...C,face:'tired'},t);},1560-540);}
  else if(sh(4)){ // empty room, chair, the button, 15:00 timer
    const L=LN(4),u=t-L.s;window.CAPY=1760;kvX_dark(t,'#1b1a22');spot(540,1200,600,.35);const left=900-Math.floor(ss(.5,L.e-L.s,u)*120);kvX_timer(540,330,Math.floor(left/60)+':'+String(left%60).padStart(2,'0'));
    g.fillStyle='#5a3820';g.strokeStyle=INK;g.lineWidth=8;g.fillRect(300,1300,240,30);g.strokeRect(300,1300,240,30);g.fillRect(310,1330,24,280);g.fillRect(506,1330,24,280);
    kev(420,1600,.85,{...C,pose:'sit',face:'tired',look:Math.sin(t*1.5)*.6,armL:[.3,.3],armR:[.3,.3]},t);g.fillStyle='#6a4a2a';g.fillRect(700,1340,200,24);g.strokeRect(700,1340,200,24);g.fillRect(785,1364,30,250);g.strokeRect(785,1364,30,250);
    btn(800,1310,1,0);if(u>3.2)tag(800,1180,'MILD SHOCK','#ffe27a',50);if(u>1.2)tag(540,540,'JUST YOU + YOUR THOUGHTS','#9fd8ff',48);}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1760;kvX_dark(t);tag(540,250,'PRESSED IT AT LEAST ONCE','#9fd8ff',54);
    const a=ss(.6,2,u),b=ss(2.2,3.6,u);kvX_people(18,Math.round(12*a),6,120,520,70,100,'#ffe27a');kvX_people(24,Math.round(6*b),6,620,520,70,100,'#ffe27a');
    g.fillStyle='#fff';g.font='800 56px BS';g.textAlign='center';g.fillText('MEN',290,450);g.fillText('WOMEN',790,450);if(a>.9)kvX_big('~2/3',290,1060,'#ffe27a',120);if(b>.9)kvX_big('~1/4',790,1060,'#ffe27a',120);
    g.font='600 32px HG';g.fillStyle='rgba(255,255,255,.6)';g.fillText('one small study',540,1180);btn(540,1450,1.1,(Math.sin(t*9)>.6)?1:0);zap(540,1400,(Math.sin(t*9)>.6)?1:0);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(1.4,540,1000);kev(540,1560,1.0,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.1},t);
    ['...','?','hmm','...'].forEach((s2,i)=>{const p=((u*.6)+i*.25)%1;g.save();g.globalAlpha=1-p;g.fillStyle='#fff';g.font='800 60px BS';g.textAlign='center';g.fillText(s2,540+Math.cos(i*1.7)*220,900-p*260);g.restore();});
    g.restore();g.save();if(u>1.2)tag(540,300,'WEIRDLY HARD','#ffe27a',80);if(u>2.6)tag(540,430,'BRAIN: "ANYTHING, PLEASE"','#9fd8ff',50);}
  else if(sh(7)){const L=LN(7),u=t-L.s;window.CAPY=1760;cam(1.1,540,1050);kvX_desk(t);kvX_table(540,1150);kev(420,1560,.9,{...C,face:u<1.5?'tired':'calm',armL:[.6,1.4],armR:[.6,1.4]},t);
    kvX_phone(800,1130,.6,t,{down:true});const left=Math.max(0,60-Math.floor(ss(.8,L.e-L.s,u)*60));kvX_timer(540,330,'0:'+String(left).padStart(2,'0'),'#ffe27a','#d94f8a');if(u>1.4)tag(540,520,'WAIT ONE MINUTE','#2fae4e',56);}
  else{kvX_track(t,LN(8),()=>kvX_desk(t),'BORED GRABS','1 BORED MINUTE',{shirt:'#d94f8a',pcol:'#e07b24'});}
  g.restore();vignette(.6);if(t<END)caption(t);endCard(t,END);}

// ---------------- kv07: "I don't" vs "I can't" (Patrick & Hagtvedt 2012, J. Consumer Research) ----------------
function kv07(t){T0=t;window.PROD='BREAK THE HABIT TRACKER';window.PTITLE='NO CANDY';window.PCOL='#9b2c3a';const C={...kvX_C,shirt:'#22a6a0'};window.ENDCHAR=C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // "I CAN'T" bubble, want-meter climbs, chocolate glows
    const L=LN(0),u=t-L.s;window.CAPY=1760;cam(1.15,540,1080);kvX_desk(t);kvX_table(540,1150);kev(380,1560,.9,{...C,face:u<1?'calm':'shock',armL:[.6,1.4],armR:[.6,1.4],look:.6},t);
    g.save();g.shadowColor='#ffb347';g.shadowBlur=40*ss(.5,2.5,u);kvX_bar(780,1100,.8,'choc');g.restore();kvX_bubble(380,560,"I CAN'T",'#d9472b',70,ss(.3,.6,u));
    const v=ss(.8,3,u);g.fillStyle='#2b2f40';g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.roundRect(860,480,70,460,35);g.fill();g.stroke();g.fillStyle='#ff6b5e';g.beginPath();g.roundRect(866,934-448*v,58,448*v,29);g.fill();
    tag(895,430,'WANT','#ff6b5e',44);}
  else if(sh(1)){const L=LN(1),u=t-L.s;window.CAPY=1760;cam(1.7,540,900);kvX_desk(t);kev(540,1560,.9,{...C,face:u<1.6?'calm':'smug',talk:talkAmt(1,t)*.6},t);
    g.restore();g.save();kvX_stamp(540,320,'WORDS MATTER?','#2fae4e',ss(1.4,1.9,u),-.1,96);}
  else if(sh(2)){const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.06,1.14,u),560,1050);kvX_desk(t);
    kev(300,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(700,1180,.78,t,{title:'NO CANDY',checked:ss(L.s+.6,L.e,t)*3,col:'#9b2c3a'});
    if(t>w[3].s)tag(700,760,'STREAK: '+(1+Math.floor(ss(w[3].s,L.e,t)*3))+' DAYS','#2fae4e',52);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1760;kvX_dive(t,u,'INSIDE KEV',()=>{kvX_desk(t);kev(540,1560,.9,{...C,face:'smug'},t);},1560-540);}
  else if(sh(4)){const L=LN(4),u=t-L.s;window.CAPY=1760;kvX_dark(t,'#141a26');tag(540,260,'~120 STUDENTS','#9fd8ff',62);
    kev(290,1560,.75,{...C,shirt:'#7a7f8c',face:'tired'},t);kev(790,1560,.75,{...C,shirt:'#7a7f8c',hair:'buzz',skin:'#8a5534',face:'smug'},t);
    kvX_bubble(290,600,"I CAN'T",'#d9472b',64,ss(1.6,2,u));kvX_bubble(790,600,"I DON'T",'#2fae4e',64,ss(3,3.4,u));}
  else if(sh(5)){ // exit table: chocolate vs granola
    const L=LN(5),u=t-L.s;window.CAPY=1760;cam(1.05,540,1000);kvX_desk(t,{door:{x:900,y:990,label:'EXIT'}});kvX_table(480,1180,700);
    kvX_bar(330,1120,.85,'choc');kvX_bar(640,1120,.85,'granola');if(u>.8)tag(330,950,'?','#ffe27a',80);if(u>1.4)tag(640,950,'?','#ffe27a',80);if(u>2)tag(480,600,'PICK ONE','#9fd8ff',64);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1760;kvX_barChart(t,u,'TOOK THE GRANOLA BAR',[["I DON'T",.64,'#2fae4e','~2/3'],["I CAN'T",.39,'#d9472b','<40%']],'one study, illustration');}
  else if(sh(7)){const L=LN(7),u=t-L.s;window.CAPY=1760;kvX_dark(t,'#1a1220');const w=L.words;let k=0;for(let i=0;i<w.length;i++)if(t>w[i].s&&/who/i.test(w[i].w))k=1;
    kvX_bubble(540,420,"I CAN'T = A RULE",'#d9472b',60,ss(.2,.5,u));kvX_bubble(540,760,"I DON'T = WHO I AM",'#2fae4e',60,ss(1.6,1.9,u));kev(540,1620,.8,{...C,face:u<1.6?'tired':'grin',armL:[.25,.15],armR:u>1.6?[2.6,.4]:[.25,.15]},t);}
  else{kvX_track(t,LN(8),()=>kvX_desk(t),'NO CANDY','STREAK KEPT',{shirt:'#22a6a0',pcol:'#9b2c3a'});}
  g.restore();vignette(.6);if(t<END)caption(t);endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{kv04,kv05,kv06,kv07});
