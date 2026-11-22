// DRE channel episodes (toon2 v2 style). Add function <id>(t){...} and register below.
// Rep Atlas · DRE · Fit & Strong Tracker. Shared DRE-only props are prefixed drX_ so they never collide with other channels.
const drX_C=CAST.DRE;
function drX_gym(t){ // warm brick gym: dumbbell rack, rubber floor, hanging lamp
  g.fillStyle='#2a1a14';g.fillRect(-600,-800,W+1200,1800);
  g.save();g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=4;for(let y=0;y<1000;y+=56){g.beginPath();g.moveTo(-600,y);g.lineTo(W+600,y);g.stroke();for(let x=((y/56)%2)*60-600;x<W+600;x+=120){g.beginPath();g.moveTo(x,y);g.lineTo(x,y+56);g.stroke();}}g.restore();
  g.fillStyle='#1b1d22';g.fillRect(-600,990,W+1200,H);g.save();g.strokeStyle='rgba(255,255,255,.05)';g.lineWidth=3;for(let x=-600;x<W+600;x+=160){g.beginPath();g.moveTo(x,990);g.lineTo(x+(x-540)*.8,H+200);g.stroke();}g.restore();
  g.fillStyle='#120c09';g.fillRect(-600,976,W+1200,20);
  // dumbbell rack (right)
  g.save();g.translate(840,900);g.fillStyle='#3d3d44';g.strokeStyle=INK;g.lineWidth=7;g.fillRect(-150,-10,300,26);g.strokeRect(-150,-10,300,26);g.fillRect(-140,16,20,80);g.fillRect(120,16,20,80);
  for(let i=0;i<4;i++){drX_db(-105+i*70,-34,.55+i*.06);}g.restore();
  // wall sign
  g.save();g.translate(220,700);g.rotate(-.04);g.fillStyle='#d9472b';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-150,-60,300,120,14);g.fill();g.stroke();g.fillStyle='#fff';g.font='800 72px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('REP ROOM',0,4);g.restore();
  g.strokeStyle='#111';g.lineWidth=4;g.beginPath();g.moveTo(540,-800);g.lineTo(540,150);g.stroke();g.fillStyle='#ffe9b0';g.shadowColor='#ffd27a';g.shadowBlur=60;g.beginPath();g.arc(540,170,24,0,7);g.fill();g.shadowBlur=0;
  spot(540,880,780,.45);}
function drX_db(x,y,s){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#2b2b30';g.strokeStyle=INK;g.lineWidth=7;g.fillRect(-40,-8,80,16);g.strokeRect(-40,-8,80,16);
  for(const sx of[-1,1]){g.fillStyle='#4a4a52';g.beginPath();g.roundRect(sx*40-(sx<0?28:0),-34,28,68,8);g.fill();g.stroke();}g.restore();}
function drX_cal(x,y,s,crossed,o={}){ // month calendar, `crossed` days X'd, optional miss day
  g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-200,-190,400,380,20);g.fill();g.stroke();
  g.fillStyle='#d9472b';g.beginPath();g.roundRect(-200,-190,400,70,[20,20,0,0]);g.fill();g.fillStyle='#fff';g.font='800 46px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(o.title||'WORKOUTS',0,-154);
  for(let i=0;i<28;i++){const cx=-165+(i%7)*55,cy=-90+Math.floor(i/7)*68;g.strokeStyle='#bbb';g.lineWidth=3;g.strokeRect(cx-22,cy-26,44,52);
    const inGap=o.gap&&i>=o.gap[0]&&i<o.gap[1];if(inGap&&i<crossed){g.fillStyle='rgba(217,71,43,.18)';g.fillRect(cx-22,cy-26,44,52);}
    if(i<crossed&&i!==o.miss&&!inGap){g.strokeStyle='#2fae4e';g.lineWidth=8;g.beginPath();g.moveTo(cx-14,cy-14);g.lineTo(cx+14,cy+14);g.moveTo(cx+14,cy-14);g.lineTo(cx-14,cy+14);g.stroke();}
    if(i===o.miss&&i<crossed){g.strokeStyle='#d9472b';g.lineWidth=5;g.beginPath();g.arc(cx,cy,22,0,7);g.stroke();}}
  g.restore();}
function drX_dark(t,col='#151821'){g.fillStyle=col;g.fillRect(0,0,W,H);spot(540,900,900,.22);}
function drX_axes(x0,y0,w,h,xl,yl){g.save();g.strokeStyle='#e8e2d4';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x0,y0-h);g.lineTo(x0,y0);g.lineTo(x0+w,y0);g.stroke();
  g.fillStyle='#e8e2d4';g.font='800 46px BS';g.textAlign='center';g.fillText(xl,x0+w/2,y0+130);g.save();g.translate(x0-40,y0-h/2);g.rotate(-Math.PI/2);g.fillText(yl,0,0);g.restore();g.restore();}
function drX_stamp(x,y,txt,col,u,rot=-.12){if(u<=0)return;g.save();g.translate(x,y);g.rotate(rot);const sc=lerp(2.2,1,ss(0,1,u));g.scale(sc,sc);g.globalAlpha=ss(0,.4,u);
  g.font='800 150px BS';g.textAlign='center';g.textBaseline='middle';const w=g.measureText(txt).width+60;g.strokeStyle=col;g.lineWidth=14;g.strokeRect(-w/2,-95,w,190);g.fillStyle=col;g.fillText(txt,0,6);g.restore();}
function drX_dive(t,L,u,who,label,drawScene){ // camera pushes into head then flashes to X-ray
  if(u<.35){cam(lerp(1.1,3.0,ss(0,.35,u)),540,1500-560*.95);drawScene();g.restore();g.save();g.fillStyle=`rgba(140,210,255,${ss(.2,.35,u)})`;g.fillRect(0,0,W,H);}
  else{xrayRoom(t);cam(lerp(1.0,1.1,u),540,1050);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.5,.9,u)},t);tag(540,260,label,'#9fd8ff',70);
    g.restore();g.save();g.fillStyle=`rgba(200,235,255,${1-ss(.35,.5,u)})`;g.fillRect(0,0,W,H);}}
function drX_track(t,L,title,streakTxt){ // staying-on-track payoff: Dre checks today's box in the planner
  const u=ss(L.s,L.e,t);window.CAPY=1720;cam(lerp(1.05,1.14,u),560,1050);drX_gym(t);
  kev(300,1620,.85,{...drX_C,face:'grin',armL:[.2,.15],armR:[1.4,.5]},t);planner(690,1180,.78,t,{title,checked:3+ss(L.s+.4,L.s+1.4,t),col:'#d9472b'});
  if(t>L.s+1.2)tag(690,760,streakTxt,'#2fae4e',58);}

// ---------------- dr01: the "21 days" myth / why people quit in week 3 ----------------
function dr01(t){T0=t;window.PROD='FIT & STRONG TRACKER';window.PTITLE='WORKOUTS';window.PCOL='#d9472b';window.ENDCHAR=drX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // week 3: Dre slumps next to a calendar that stops at day 17
    const L=LN(0),u=ss(L.s,L.e,t);window.CAPY=1720;cam(lerp(1.0,1.12,u),540,1100);drX_gym(t);
    drX_cal(770,620,.85,Math.round(lerp(10,17,ss(L.s,L.e-.4,t))));
    kev(380,1640,.9,{...drX_C,face:u<.5?'calm':'tired',armL:[.1,.05],armR:[.1,.05],tilt:.08*u,blink:blinkAt(t)},t);
    if(u>.45)tag(770,960,'WEEK 3','#ffd34d',64);}
  else if(sh(1)){ // close-up, MYTH stamp
    const L=LN(1),u=t-L.s;window.CAPY=1720;cam(2.1,540,1000);drX_gym(t);kev(540,1600,1,{...drX_C,face:u<1.1?'calm':'smug',talk:talkAmt(1,t)*.6,armL:[.1,.05],armR:[.1,.05]},t);
    g.restore();g.save();drX_stamp(540,330,'MYTH','#ff4d3d',ss(.9,1.4,u));}
  else if(sh(2)){ // Dre logs a session in the tracker, thought bubble "DAY 21 = AUTOMATIC?"
    const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);drX_gym(t);
    kev(300,1620,.85,{...drX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'WORKOUTS',checked:ss(L.s+.4,w[7].e,t)*4,col:'#d9472b'});
    if(t>w[10].s)tag(560,330,'DAY 21 = AUTOMATIC?','#ffd34d',66);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    drX_dive(t,L,u,drX_C,'INSIDE DRE',()=>{drX_gym(t);kev(540,1500,.95,{...drX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // automatic-o-meter fills to day 66
    const L=LN(4),u=ss(L.s+.5,L.e-.3,t);window.CAPY=1780;drX_dark(t);
    kev(300,1560,.72,{xray:true,armL:[.3,.2],armR:[.3,.2],glow:.4+.6*u},t);
    // thermometer
    g.save();g.translate(780,0);g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=8;g.beginPath();g.roundRect(-70,300,140,1150,70);g.fill();g.stroke();
    const top=1420-1080*u;const fg=g.createLinearGradient(0,1420,0,340);fg.addColorStop(0,'#d9472b');fg.addColorStop(.6,'#ffd34d');fg.addColorStop(1,'#2fae4e');g.fillStyle=fg;g.beginPath();g.roundRect(-48,top,96,1420-top+10,48);g.fill();
    g.fillStyle='#e8e2d4';g.font='800 40px BS';g.textAlign='right';g.textBaseline='middle';for(const [d,lab] of [[0,'0'],[21/66,'21'],[1,'66']]){const y=1420-1080*d;g.fillRect(-100,y-3,24,6);g.fillText(lab,-112,y);}
    g.restore();tag(780,230,'FEELS AUTOMATIC','#2fae4e',58);
    const day=Math.round(66*u);tag(330,560,'DAY '+day,u>.97?'#2fae4e':'#ffd34d',96);if(u>.3)tag(330,700,'21 ✗ TOO EARLY','#ff6b5e',46);}
  else if(sh(5)){ // range: 18 .. 254 days
    const L=LN(5),w=L.words,u=t-L.s;window.CAPY=1720;drX_dark(t);
    const x0=110,x1=970,y=900,X=d=>lerp(x0,x1,d/260);g.save();g.strokeStyle='#e8e2d4';g.lineWidth=10;g.lineCap='round';g.beginPath();g.moveTo(x0,y);g.lineTo(x1,y);g.stroke();
    g.font='800 40px BS';g.fillStyle='#bbb';g.textAlign='center';for(let d=0;d<=250;d+=50){g.fillRect(X(d)-3,y-20,6,40);g.fillText(d,X(d),y+80);}g.fillText('DAYS',540,y+150);g.restore();
    // crowd of dots between
    const r=R(4),n=Math.round(40*ss(.2,1.6,u));for(let i=0;i<n;i++){const d=18+Math.pow(r(),2.2)*236;g.fillStyle='rgba(255,211,77,.8)';g.beginPath();g.arc(X(d),y-40-r()*120,11,0,7);g.fill();}
    const pA=ss(0,.5,t-w[3].s+.2),pB=ss(0,.5,t-w[7].s+.2);
    if(pA>0){g.save();g.globalAlpha=pA;kev(X(18)+40,y-170,.32,{...drX_C,face:'grin',armL:[.3,.2],armR:[2.4,.3]},t);g.restore();tag(X(18)+90,y-470,'18 DAYS','#2fae4e',60);}
    if(pB>0){g.save();g.globalAlpha=pB;kev(X(254)-30,y-170,.32,{...drX_C,face:'tired',armL:[.1,.05],armR:[.1,.05]},t);g.restore();tag(X(254)-110,y-470,'254 DAYS','#ff6b5e',60);}
    tag(540,300,'EVERYONE IS DIFFERENT','#9fd8ff',62);}
  else if(sh(6)){ // automaticity curve with one missed day barely denting it
    const L=LN(6),u=ss(L.s+.2,L.e-.3,t);window.CAPY=1720;drX_dark(t);const x0=150,y0=1300,w=820,h=700;drX_axes(x0,y0,w,h,'DAYS','AUTOMATIC');
    const f=x=>(1-Math.exp(-x*3.2))*(x>.42&&x<.47?.985:1);g.save();g.strokeStyle='#ffd34d';g.lineWidth=12;g.lineCap='round';g.beginPath();
    for(let i=0;i<=200*u;i++){const x=i/200,px=x0+x*w,py=y0-f(x)*h*.9;i?g.lineTo(px,py):g.moveTo(px,py);}g.stroke();g.restore();
    const mx=x0+.445*w,my=y0-f(.445)*h*.9;if(u>.45){g.save();g.strokeStyle='#ff6b5e';g.lineWidth=7;g.beginPath();g.arc(mx,my,40,0,7);g.stroke();g.restore();tag(mx,my+150,'MISSED 1 DAY','#ff6b5e',52);}
    if(u>.8)tag(700,380,'STILL CLIMBING','#2fae4e',62);
    drX_cal(250,380,.5,18+Math.round(8*u),{miss:19,title:'WORKOUTS'});}
  else if(sh(8)){drX_track(t,LN(8),'WORKOUTS','DAY 22 ✓ KEEP GOING');}
  else{ // week 3 = warm-up
    const L=LN(7),u=t-L.s;window.CAPY=1720;cam(lerp(1.15,1.05,ss(L.s,L.e,t)),540,1100);drX_gym(t);
    kev(540,1640,.95,{...drX_C,face:u<1.3?'smug':'grin',armL:u<1.3?[.1,.05]:[2.5,.4],armR:u<1.3?[.1,.05]:[2.5,.4],blink:blinkAt(t)},t);
    if(u>1.3){g.restore();g.save();tag(540,330,'WEEK 3 = WARM-UP','#ffd34d',76);}}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- dr02: why soreness peaks 1-3 days later (DOMS + repeated bout effect) ----------------
function drX_fibers(t,u){ // close-up muscle fibre bundle with tiny tears appearing
  g.save();g.translate(540,930);g.rotate(-.12);for(let i=0;i<9;i++){const y=-360+i*90;const fg=g.createLinearGradient(0,y-38,0,y+38);fg.addColorStop(0,'#e0707a');fg.addColorStop(.5,'#c9404f');fg.addColorStop(1,'#8e2433');
    g.fillStyle=fg;g.strokeStyle='#5a1420';g.lineWidth=5;g.beginPath();g.roundRect(-560,y-38,1120,76,38);g.fill();g.stroke();
    g.strokeStyle='rgba(255,255,255,.18)';g.lineWidth=3;for(let x=-520;x<540;x+=46){g.beginPath();g.moveTo(x,y-30);g.lineTo(x,y+30);g.stroke();}}
  const r=R(12);for(let i=0;i<14;i++){const a=ss(i/16,i/16+.12,u);const x=-420+r()*840,y=-360+Math.floor(r()*9)*90;if(a<=0)continue;
    g.save();g.translate(x,y);g.globalAlpha=a;g.shadowColor='#ffe27a';g.shadowBlur=22;g.strokeStyle='#fff3b0';g.lineWidth=7;g.beginPath();g.moveTo(-18,-26);g.lineTo(4,-4);g.lineTo(-6,4);g.lineTo(16,26);g.stroke();g.restore();}
  g.restore();}
function dr02(t){T0=t;window.PROD='FIT & STRONG TRACKER';window.PTITLE='LEG DAY';window.PCOL='#d9472b';window.ENDCHAR=drX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // two days later: Dre hobbles, legs pulsing red
    const L=LN(0),u=t-L.s;window.CAPY=1760;cam(1.05,540,1050);drX_gym(t);const x=lerp(300,620,ss(0,L.e-L.s,u));
    kev(x,1640+Math.abs(Math.sin(u*5))*-8,.9,{...drX_C,face:u<1.2?'tired':'shock',armL:[.6,.3],armR:[.6,.3],tilt:Math.sin(u*5)*.06},t);
    g.save();g.globalAlpha=.35+.3*Math.sin(t*8);g.fillStyle='#ff3b30';g.shadowColor='#ff3b30';g.shadowBlur=40;for(const s of[-1,1]){g.beginPath();g.ellipse(x+s*38,1640-70,22,70,0,0,7);g.fill();}g.restore();
    tag(540,330,'48 HOURS AFTER LEG DAY','#ffd34d',62);}
  else if(sh(1)){const L=LN(1),u=t-L.s;window.CAPY=1720;cam(2.1,540,1000);drX_gym(t);kev(540,1600,1,{...drX_C,face:u<1.3?'calm':'smug',armL:[.1,.05],armR:[.1,.05]},t);
    g.restore();g.save();if(u>1.4){tag(540,300,'D.O.M.S.','#ff6b5e',110);tag(540,440,'DELAYED ONSET MUSCLE SORENESS','#e8e2d4',40);}}
  else if(sh(2)){ // leg day: dumbbell squat bob, then checks tracker
    const L=LN(2),w=L.words,u=t-L.s,chk=w[9].s;window.CAPY=1760;cam(1.08,560,1050);drX_gym(t);
    if(t<chk){const sq=Math.abs(Math.sin(u*2.6));kev(540,1640+sq*0,.92,{...drX_C,face:'calm',armL:[.05,0],armR:[.05,0],bob:sq*60,blink:blinkAt(t)},t);
      drX_db(540-0.92*112,1640+sq*60-0.92*196,.8);drX_db(540+0.92*112,1640+sq*60-0.92*196,.8);tag(540,330,'LEG DAY','#ffd34d',80);}
    else{kev(300,1620,.85,{...drX_C,face:'grin',armL:[.2,.15],armR:[1.4,.5]},t);planner(690,1180,.78,t,{title:'LEG DAY',checked:ss(chk,chk+1.2,t)*4,col:'#d9472b'});}}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    drX_dive(t,L,u,drX_C,'INSIDE DRE\'S LEGS',()=>{drX_gym(t);kev(540,1500,.95,{...drX_C,face:'tired',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // muscle fibre close-up, micro tears
    const L=LN(4),u=ss(L.s+.3,L.e,t);window.CAPY=1700;g.fillStyle='#1a0d10';g.fillRect(0,0,W,H);cam(lerp(1.0,1.08,u),540,930);drX_fibers(t,u);g.restore();g.save();
    tag(540,260,'MUSCLE FIBRES','#9fd8ff',64);if(u>.4)tag(540,1500,'TINY MICRO-DAMAGE','#ffe27a',62);}
  else if(sh(5)){ // soreness by day bar chart: peaks day 1-2
    const L=LN(5),u=ss(L.s+.2,L.e-.2,t);window.CAPY=1720;drX_dark(t);const x0=150,y0=1300,w=820,h=760;drX_axes(x0,y0,w,h,'DAYS AFTER','SORENESS');
    const v=[.12,.75,.95,.6,.25];v.forEach((q,i)=>{const p=ss(i*.15,i*.15+.25,u),bx=x0+70+i*150,bh=q*h*.9*p;g.fillStyle=i>=1&&i<=3?'#ff6b5e':'#ffd34d';g.strokeStyle=INK;g.lineWidth=6;
      g.beginPath();g.roundRect(bx,y0-bh,100,bh,[14,14,0,0]);g.fill();g.stroke();g.fillStyle='#e8e2d4';g.font='800 48px BS';g.textAlign='center';g.fillText(i,bx+50,y0+50);});
    if(u>.8)tag(600,400,'PEAK: ~1–3 DAYS','#ff6b5e',66);kev(900,560,.3,{...drX_C,face:'shock',armL:[.6,.3],armR:[.6,.3]},t);}
  else if(sh(6)){ // repeated bout: workout 1 vs workout 2
    const L=LN(6),w=L.words,u=ss(L.s+.2,L.s+3,t);window.CAPY=1720;drX_dark(t);const x0=150,y0=1300,h=760;drX_axes(x0,y0,820,h,'','SORENESS');
    const bars=[['WORKOUT 1',.95,'#ff6b5e'],['WORKOUT 2',.35,'#2fae4e']];bars.forEach(([n,q,c],i)=>{const p=ss(i*.4,i*.4+.4,u),bx=x0+140+i*360,bh=q*h*.9*p;
      g.fillStyle=c;g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.roundRect(bx,y0-bh,200,bh,[16,16,0,0]);g.fill();g.stroke();g.fillStyle='#e8e2d4';g.font='800 50px BS';g.textAlign='center';g.fillText(n,bx+100,y0+60);});
    if(u>.85)kev(x0+140+360+100,y0-h*.9*.35-10,.32,{...drX_C,face:'grin',armL:[2.4,.3],armR:[2.4,.3]},t);
    const idx=w.findIndex(x=>/Scientists/i.test(x.w));if(idx>=0&&t>w[idx].s)tag(540,330,'REPEATED BOUT EFFECT','#9fd8ff',70);}
  else if(sh(8)){drX_track(t,LN(8),'LEG DAY','REST DAY ✓ BACK THURSDAY');}
  else{ // soreness isn't a score
    const L=LN(7),u=t-L.s;window.CAPY=1720;cam(lerp(1.15,1.05,ss(L.s,L.e,t)),540,1100);drX_gym(t);
    kev(540,1640,.95,{...drX_C,face:u<1.2?'smug':'grin',armL:u<1.2?[.1,.05]:[2.5,.4],armR:u<1.2?[.1,.05]:[2.5,.4],blink:blinkAt(t)},t);
    g.restore();g.save();drX_stamp(540,330,'NOT A SCORE','#ff4d3d',ss(.1,.6,u),-.08);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}


// ---------------- shared helpers for dr03+ ----------------
function drX_board(t,u,cards){ // evidence board; cards [{t1,t2}] pinned in a zig-zag with red string, u reveals
  g.fillStyle='#a0703f';g.fillRect(0,0,W,H);const r=R(9);g.save();for(let i=0;i<2200;i++){g.fillStyle=r()<.5?'rgba(80,45,15,.25)':'rgba(255,220,170,.12)';g.fillRect(r()*W,r()*H,3+r()*4,3+r()*4);}g.restore();
  const P=[[310,420,-.06],[770,640,.05],[320,1010,.04],[770,1300,-.05]],n=cards.length,sh_=i=>ss(i/n,i/n+.12,u);
  g.save();g.strokeStyle='#c4161c';g.lineWidth=6;for(let i=0;i<n-1;i++){const a=P[i],b=P[i+1],q=ss(i/n+.08,i/n+.2,u);if(q<=0)continue;g.beginPath();g.moveTo(a[0],a[1]-120);g.lineTo(lerp(a[0],b[0],q),lerp(a[1]-120,b[1]-120,q));g.stroke();}g.restore();
  cards.forEach((c,i)=>{const a=sh_(i);if(a<=0)return;const [x,y,ro]=P[i];g.save();g.translate(x,y);g.rotate(ro);g.scale(.7+.3*a,.7+.3*a);g.globalAlpha=a;
    g.fillStyle='rgba(0,0,0,.3)';g.fillRect(-196,-136,400,290);g.fillStyle='#f3e7cf';g.fillRect(-200,-145,400,290);
    g.fillStyle=c.col||INK;g.font='800 92px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(c.t1,0,-30);g.font='600 38px HG';g.fillStyle='#5b4632';g.fillText(c.t2,0,70);
    g.fillStyle='#c4161c';g.beginPath();g.arc(0,-120,15,0,7);g.fill();g.restore();});}
function drX_bars(u,bars,ylab,top=1){ // bars [[label,value,col]] scaled to `top`
  const x0=150,y0=1300,w=820,h=760;drX_axes(x0,y0,w,h,'',ylab);const n=bars.length,bw=Math.min(200,560/n),gap=(w-40-n*bw)/(n+1);
  bars.forEach(([lab,q,c],i)=>{const p=ss(i/n*.8,i/n*.8+.3,u),bx=x0+20+gap+i*(bw+gap),bh=q/top*h*.9*p;g.fillStyle=c;g.strokeStyle=INK;g.lineWidth=6;
    g.beginPath();g.roundRect(bx,y0-bh,bw,bh,[16,16,0,0]);g.fill();g.stroke();g.fillStyle='#e8e2d4';g.font='800 46px BS';g.textAlign='center';g.fillText(lab,bx+bw/2,y0+56);});
  return (i,q)=>[x0+20+gap+i*(bw+gap)+bw/2,y0-q/top*h*.9];}
function drX_curve(u,fs,xl,yl){ // fs [[fn(x)->0..1,col]] drawn left->right by u
  const x0=150,y0=1300,w=820,h=700;drX_axes(x0,y0,w,h,xl,yl);
  for(const [f,c] of fs){g.save();g.strokeStyle=c;g.lineWidth=12;g.lineCap='round';g.lineJoin='round';g.beginPath();for(let i=0;i<=200*u;i++){const x=i/200,px=x0+x*w,py=y0-f(x)*h*.9;i?g.lineTo(px,py):g.moveTo(px,py);}g.stroke();g.restore();}
  return (x,y)=>[x0+x*w,y0-y*h*.9];}
function drX_phones(x,y,s){ // headphones over a kev() head at (x,y,s)
  g.save();g.translate(x,y-600*s);g.scale(s,s);g.strokeStyle=INK;g.lineWidth=22;g.beginPath();g.arc(0,-10,140,Math.PI*1.08,Math.PI*1.92);g.stroke();
  g.strokeStyle='#e8473a';g.lineWidth=12;g.beginPath();g.arc(0,-10,140,Math.PI*1.1,Math.PI*1.9);g.stroke();
  for(const sx of[-1,1]){g.fillStyle='#e8473a';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(sx*128-26,-40,52,96,20);g.fill();g.stroke();}g.restore();}
function drX_close(t,i,face2,col,txt,stamp=true,extra){const L=LN(i),u=t-L.s;window.CAPY=1720;cam(2.1,540,1000);drX_gym(t);
  kev(540,1600,1,{...drX_C,face:u<1.1?'calm':face2,armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);if(extra)extra();g.restore();g.save();
  if(stamp)drX_stamp(540,330,txt,col,ss(.9,1.4,u),-.08);else if(txt&&u>.9)tag(540,330,txt,col,80);}
function drX_payoff(t,i,txt,col='#ffd34d',extra){const L=LN(i),u=t-L.s;window.CAPY=1720;cam(lerp(1.15,1.05,ss(L.s,L.e,t)),540,1100);drX_gym(t);
  kev(540,1640,.95,{...drX_C,face:u<1.2?'smug':'grin',armL:u<1.2?[.1,.05]:[2.5,.4],armR:u<1.2?[.1,.05]:[2.5,.4],blink:blinkAt(t)},t);if(extra)extra(u);
  g.restore();g.save();if(u>1.0)tag(540,330,txt,col,70);}

// ---------------- dr03: rest days — muscle is rebuilt after training (MacDougall et al. 1995) ----------------
function dr03(t){T0=t;window.PROD='FIT & STRONG TRACKER';window.PTITLE='THIS WEEK';window.PCOL='#d9472b';window.ENDCHAR=drX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.0,1.1,u),540,1100);drX_gym(t);
    kev(420,1640,.9,{...drX_C,face:'smug',pose:'sit',armL:[.4,.6],armR:[.4,.6],blink:blinkAt(t)},t);
    tag(420,520,'REST DAY','#9fd8ff',72);if(u>.45){tag(800,760,'STRONGER?','#2fae4e',64);g.save();g.strokeStyle='#2fae4e';g.lineWidth=14;g.lineCap='round';const a=ss(.45,.8,u);g.beginPath();g.moveTo(800,1160);g.lineTo(800,1160-260*a);g.moveTo(760,1160-220*a);g.lineTo(800,1160-260*a);g.lineTo(840,1160-220*a);g.stroke();g.restore();}}
  else if(sh(1)){drX_close(t,1,'smug','#2fae4e','RECOVERY');}
  else if(sh(2)){const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);drX_gym(t);
    kev(300,1620,.85,{...drX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(690,1180,.78,t,{title:'THIS WEEK',checked:ss(L.s+.3,L.s+1.6,t)*3,col:'#d9472b'});
    if(u>.5)tag(690,760,'TOMORROW: REST','#9fd8ff',58);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;drX_dive(t,L,u,drX_C,"INSIDE DRE'S ARMS",()=>{drX_gym(t);kev(540,1500,.95,{...drX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // signal then bricks
    const L=LN(4),w=L.words,u=t-L.s,mid=w[4].s;window.CAPY=1780;xrayRoom(t);kev(300,1560,.72,{xray:true,armL:[1.2,.6],armR:[.3,.2],glow:.6+.4*Math.sin(t*9)},t);
    if(t<mid+.2){g.save();g.strokeStyle='#ffe27a';g.lineWidth=10;g.shadowColor='#ffe27a';g.shadowBlur=30;for(let i=0;i<3;i++){const x=520+i*140,y=900+Math.sin(t*12+i)*20;g.beginPath();g.moveTo(x,y-80);g.lineTo(x+40,y);g.lineTo(x,y);g.lineTo(x+40,y+80);g.stroke();}g.restore();tag(700,560,'LIFT = SIGNAL','#ffe27a',70);}
    else{const n=Math.floor(ss(mid,L.e,t)*12);for(let i=0;i<n;i++){const bx=560+(i%4)*110,by=1380-Math.floor(i/4)*80;g.fillStyle='#d9472b';g.strokeStyle='#fff3d6';g.lineWidth=5;g.beginPath();g.roundRect(bx,by,100,70,10);g.fill();g.stroke();}
      tag(720,560,'REBUILD = AFTER','#2fae4e',70);tag(720,1520,'NEW MUSCLE PROTEIN','#9fd8ff',44);}}
  else if(sh(5)){const L=LN(5),u=ss(L.s+.2,L.e-.4,t);window.CAPY=1720;drX_dark(t);
    const pt=drX_bars(u,[['BEFORE',1,'#9fd8ff'],['4 HRS',1.5,'#ffd34d'],['24 HRS',2.09,'#2fae4e'],['36 HRS',1.14,'#ffd34d']],'MUSCLE BUILDING',2.2);
    if(u>.75){const [x,y]=pt(2,2.09);tag(x,y-80,'~2×','#2fae4e',80);}tag(540,280,'ONE CLASSIC STUDY','#e8e2d4',56);}
  else if(sh(6)){const L=LN(6),u=ss(L.s,L.e,t);window.CAPY=1720;drX_gym(t);cam(1,540,960);
    kev(330,1640,.85,{...drX_C,face:'tired',armL:[.1,.05],armR:[.1,.05],tilt:.1*u,blink:blinkAt(t)},t);
    g.save();g.translate(760,700);g.scale(.85,.85);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-200,-190,400,380,20);g.fill();g.stroke();g.restore();
    drX_cal(760,700,.85,Math.round(lerp(4,28,u)),{title:'NO BREAKS'});if(u>.5)tag(760,1060,'NO TIME TO REBUILD','#ff6b5e',54);}
  else if(sh(8)){drX_track(t,LN(8),'THIS WEEK','REST DAY ✓');}
  else{drX_payoff(t,7,'PART OF THE PLAN');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- dr04: how long until the gym feels automatic (Kaushal & Rhodes 2015) ----------------
function dr04(t){T0=t;window.PROD='FIT & STRONG TRACKER';window.PTITLE='GYM PLAN';window.PCOL='#d9472b';window.ENDCHAR=drX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1760;cam(1.05,540,1050);drX_gym(t);const x=lerp(260,520,ss(0,L.e-L.s,u));
    kev(x,1640,.9,{...drX_C,face:'tired',armL:[.05,0],armR:[.05,0],tilt:.12,bob:Math.abs(Math.sin(u*4))*-10,blink:blinkAt(t)},t);
    tag(540,330,'GYM = CHORE?','#ffd34d',76);}
  else if(sh(1)){const L=LN(1),u=t-L.s;drX_close(t,1,'smug','#ffd34d','',false);
    const q=ss(.8,1.6,u);if(q>0){g.save();g.globalAlpha=q;g.fillStyle='rgba(10,14,22,.85)';g.strokeStyle='#e8e2d4';g.lineWidth=6;g.beginPath();g.roundRect(160,230,760,90,45);g.fill();g.stroke();
      g.fillStyle='#ffd34d';g.beginPath();g.roundRect(172,242,736*.18,66,33);g.fill();g.restore();tag(540,400,'HABIT: NOT BUILT YET','#ffd34d',58);}}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);drX_gym(t);
    kev(300,1620,.85,{...drX_C,face:'grin',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(690,1180,.78,t,{title:'GYM PLAN',checked:ss(L.s+.4,L.e,t)*4,col:'#d9472b'});}
  else if(sh(3)||sh(4)||sh(5)){const i=sh(3)?3:sh(4)?4:5,L=LN(i),u=ss(L.s,L.e-.3,t);window.CAPY=1760;
    const base=i===3?0:i===4?.25:.5,span=i===5?.5:.25;
    drX_board(t,base+span*u,[{t1:'100+',t2:'new gym members'},{t1:'12 WEEKS',t2:'followed'},{t1:'4× A WEEK',t2:'at least',col:'#c4161c'},{t1:'~6 WEEKS',t2:'to build the habit',col:'#1f7a3a'}]);
    kev(880,1820,.32,{...drX_C,face:i===5?'shock':'calm',armL:[.3,.2],armR:[.3,.2]},t);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.2,L.e-.3,t);window.CAPY=1760;drX_dark(t);
    const a=lerp(0,.28,u);g.save();g.translate(540,1100);g.fillStyle='#3d3d44';g.beginPath();g.moveTo(-60,140);g.lineTo(60,140);g.lineTo(0,10);g.fill();g.rotate(a);
    g.fillStyle='#e8e2d4';g.fillRect(-440,-10,880,26);tag(-300,-80,'HOW HARD','#ff6b5e',54);tag(300,-80,'HOW OFTEN','#2fae4e',58);
    for(let k=0;k<Math.round(4*u)+1;k++){drX_db(300+(k%2?50:-50),-150-Math.floor(k/2)*70,.6);}g.restore();
    kev(220,1700,.5,{...drX_C,face:'smug',armL:[.1,.05],armR:[2.4,.3]},t);tag(540,330,'EARLY ON','#9fd8ff',72);}
  else if(sh(8)){drX_track(t,LN(8),'GYM PLAN','VISIT 24 ✓');}
  else{const L=LN(7),u=ss(L.s,L.e,t);window.CAPY=1720;drX_gym(t);kev(300,1640,.85,{...drX_C,face:'grin',armL:[.1,.05],armR:[2.5,.4],blink:blinkAt(t)},t);
    drX_cal(760,700,.85,Math.round(lerp(6,24,u)),{title:'BUILD PHASE'});if(u>.4)tag(760,1060,'COUNT THE VISITS','#2fae4e',58);}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- dr05: missed a week? strength mostly holds ~3 weeks (detraining reviews) ----------------
function dr05(t){T0=t;window.PROD='FIT & STRONG TRACKER';window.PTITLE='WORKOUTS';window.PCOL='#d9472b';window.ENDCHAR=drX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.0,1.1,u),540,1100);drX_gym(t);
    drX_cal(770,620,.85,21,{gap:[7,14]});kev(360,1640,.9,{...drX_C,face:u<.45?'calm':'shock',armL:[.6,.3],armR:[.6,.3],blink:blinkAt(t)},t);
    if(u>.3)tag(770,960,'MISSED A WEEK','#ff6b5e',60);}
  else if(sh(1)){drX_close(t,1,'smug','#ffd34d','PAUSE');}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);drX_gym(t);
    kev(300,1620,.85,{...drX_C,face:'tired',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(690,1180,.78,t,{title:'WORKOUTS',checked:2,col:'#d9472b'});
    if(u>.45)tag(690,760,'GAP: 7 DAYS','#ff6b5e',58);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;drX_dive(t,L,u,drX_C,"INSIDE DRE'S MUSCLES",()=>{drX_gym(t);kev(540,1500,.95,{...drX_C,face:'tired',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s+.2,L.e-.2,t);window.CAPY=1780;xrayRoom(t);kev(300,1560,.72,{xray:true,armL:[.3,.2],armR:[.3,.2],glow:.8},t);
    g.save();g.translate(780,0);g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=8;g.beginPath();g.roundRect(-70,300,140,1150,70);g.fill();g.stroke();
    const lv=.92-.03*u,top=1420-1080*lv;g.fillStyle='#2fae4e';g.beginPath();g.roundRect(-48,top,96,1420-top+10,48);g.fill();g.restore();
    tag(780,230,'STRENGTH','#2fae4e',60);tag(330,560,'DAY '+(1+Math.round(6*u)),'#ffd34d',96);if(u>.4)tag(330,700,'STILL THERE','#2fae4e',52);}
  else if(sh(5)){const L=LN(5),u=ss(L.s+.2,L.e-.3,t);window.CAPY=1720;drX_dark(t);
    const f=x=>x<.5?.92:.92-.5*Math.pow((x-.5)/.5,1.4)*.6;const P=drX_curve(u,[[f,'#2fae4e']],'WEEKS OFF','STRENGTH');
    g.save();g.fillStyle='#bbb';g.font='800 40px BS';g.textAlign='center';for(let k=0;k<=6;k++){const [x]=P(k/6,0);g.fillText(k,x,1360);}g.restore();
    if(u>.55){const [x,y]=P(.5,.92);g.save();g.setLineDash([16,12]);g.strokeStyle='#ffd34d';g.lineWidth=5;g.beginPath();g.moveTo(x,y-60);g.lineTo(x,1300);g.stroke();g.restore();tag(x,y-140,'~3 WEEKS: MOSTLY HOLDS','#ffd34d',52);}
    tag(540,280,'TRAINED LIFTERS (REVIEWS)','#e8e2d4',50);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.2,L.e-.3,t);window.CAPY=1720;drX_dark(t);
    const P=drX_curve(u,[[x=>x*.55,'#9fd8ff'],[x=>Math.min(.85,x*1.6),'#2fae4e']],'TIME','STRENGTH');
    if(u>.5){const [a,b]=P(.9,.5);tag(a-60,b+60,'FIRST TIME','#9fd8ff',48);const [c,d]=P(.5,.85);tag(c,d-70,'COMEBACK','#2fae4e',56);}
    tag(540,280,'MUSCLE MEMORY','#ffd34d',70);}
  else if(sh(8)){drX_track(t,LN(8),'WORKOUTS','BACK ✓ DAY 1');}
  else{drX_payoff(t,7,'1 WEEK ≠ THE END','#2fae4e');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- dr06: temptation bundling (Milkman, Minson & Volpp 2014) ----------------
function dr06(t){T0=t;window.PROD='FIT & STRONG TRACKER';window.PTITLE='WORKOUTS';window.PCOL='#d9472b';window.ENDCHAR=drX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.0,1.1,u),540,1100);drX_gym(t);
    const sq=Math.abs(Math.sin(t*2.6));kev(540,1640,.9,{...drX_C,face:'grin',armL:[.05,0],armR:[.05,0],bob:sq*50,blink:blinkAt(t)},t);drX_phones(540,1640+sq*50,.9);
    drX_db(540-0.9*112,1640+sq*50-0.9*196,.8);drX_db(540+0.9*112,1640+sq*50-0.9*196,.8);if(u>.4)tag(540,330,'GYM ONLY','#ffd34d',80);}
  else if(sh(1)){const L=LN(1),u=t-L.s;drX_close(t,1,'smug','#9fd8ff','',false,()=>drX_phones(540,1600,1));if(u>.9){tag(540,300,'TEMPTATION','#ff6b5e',90);tag(540,420,'BUNDLING','#9fd8ff',90);}}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);drX_gym(t);
    kev(300,1620,.85,{...drX_C,face:'grin',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);drX_phones(300,1620,.85);planner(690,1180,.78,t,{title:'WORKOUTS',checked:ss(L.s+.8,L.e,t)*4,col:'#d9472b'});
    tag(560,330,'AUDIOBOOK = GYM ONLY','#ffd34d',58);}
  else if(sh(3)||sh(4)){const i=sh(3)?3:4,L=LN(i),u=ss(L.s,L.e-.3,t);window.CAPY=1760;
    drX_board(t,(i===3?0:.5)+.5*u,[{t1:'GYM STUDY',t2:'a university gym'},{t1:'AUDIOBOOKS',t2:'page-turners'},{t1:'GYM ONLY',t2:'locked otherwise',col:'#c4161c'},{t1:'vs. A GROUP',t2:'with no bundle'}]);}
  else if(sh(5)){const L=LN(5),u=ss(L.s+.2,L.e-.4,t);window.CAPY=1720;drX_dark(t);
    const pt=drX_bars(u,[['COMPARISON',1,'#9fd8ff'],['BUNDLED',1.51,'#2fae4e']],'GYM VISITS',1.7);if(u>.8){const [x,y]=pt(1,1.51);tag(x,y-80,'+51%','#2fae4e',90);}
    tag(540,280,'AT FIRST','#ffd34d',64);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.2,L.e-.3,t);window.CAPY=1720;drX_dark(t);
    const f=x=>x<.45?.85:x<.55?.85-(x-.45)*4.5:.4-(x-.55)*.2;const P=drX_curve(u,[[f,'#ffd34d']],'WEEKS','EXTRA VISITS');
    if(u>.5){const [x,y]=P(.5,.62);tag(x,y-160,'HOLIDAY BREAK','#ff6b5e',52);}if(u>.85)tag(700,380,'+ A PLAN','#2fae4e',66);}
  else if(sh(8)){drX_track(t,LN(8),'WORKOUTS','BUNDLED ✓');}
  else{drX_payoff(t,7,'SOMETHING TO LOOK FORWARD TO','#ffd34d',()=>drX_phones(540,1640,.95));}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{dr01,dr02,dr03,dr04,dr05,dr06});
