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
