// JAY channel episodes (toon2 v2 style). Add function <id>(t){...} and register below.
// Focus Forge · JAY · Daily Habit Builder / Study & Success Planner. JAY-only props are prefixed jyX_ so they never collide with other channels.
const jyX_C=CAST.JAY;
function jyX_room(t,night){ // warm study room: slate walls, bookshelf, window, desk lamp glow
  g.fillStyle=night?'#151a26':'#1f2a36';g.fillRect(-600,-800,W+1200,1800);
  g.save();g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=5;for(let x=-40;x<W;x+=210)g.strokeRect(x+30,300,160,540);g.restore();
  g.fillStyle='#4a3020';g.fillRect(-600,990,W+1200,H);g.save();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=4;for(let i=0;i<14;i++){const y=990+i*i*6;g.beginPath();g.moveTo(-600,y);g.lineTo(W+600,y);g.stroke();}g.restore();
  g.fillStyle='#1a120b';g.fillRect(-600,976,W+1200,22);
  // bookshelf (left)
  g.save();g.translate(150,640);g.fillStyle='#5a3820';g.strokeStyle=INK;g.lineWidth=8;g.fillRect(-120,-260,240,520);g.strokeRect(-120,-260,240,520);
  const cols=['#d9472b','#3b7dd8','#ffd34d','#2fae4e','#7d4cc2','#e07b24'];for(let r=0;r<3;r++){g.fillStyle='#3a2414';g.fillRect(-110,-250+r*170+150,220,12);
    for(let i=0;i<6;i++){g.fillStyle=cols[(i+r*2)%6];const h=110+((i*7+r*3)%4)*10;g.fillRect(-100+i*34,-250+r*170+150-h,28,h);g.strokeRect(-100+i*34,-250+r*170+150-h,28,h);}}g.restore();
  // window
  g.save();g.translate(860,470);g.fillStyle=night?'#0b1424':'#9cc9e8';g.fillRect(-100,-140,200,280);if(night){g.fillStyle='#e9eef8';g.beginPath();g.arc(30,-50,30,0,7);g.fill();g.fillStyle='#0b1424';g.beginPath();g.arc(44,-60,26,0,7);g.fill();}
  g.strokeStyle='#5b3b22';g.lineWidth=14;g.strokeRect(-100,-140,200,280);g.lineWidth=8;g.beginPath();g.moveTo(0,-140);g.lineTo(0,140);g.moveTo(-100,0);g.lineTo(100,0);g.stroke();g.restore();
  g.strokeStyle='#111';g.lineWidth=4;g.beginPath();g.moveTo(540,-800);g.lineTo(540,150);g.stroke();g.fillStyle='#ffe9b0';g.shadowColor='#ffd27a';g.shadowBlur=60;g.beginPath();g.arc(540,170,24,0,7);g.fill();g.shadowBlur=0;
  spot(540,880,780,night?.32:.45);}
function jyX_dark(t,col='#141821'){g.fillStyle=col;g.fillRect(0,0,W,H);spot(540,900,900,.22);}
function jyX_stamp(x,y,txt,col,u,rot=-.12,size=150){if(u<=0)return;g.save();g.translate(x,y);g.rotate(rot);const sc=lerp(2.2,1,ss(0,1,u));g.scale(sc,sc);g.globalAlpha=ss(0,.4,u);
  g.font=`800 ${size}px BS`;g.textAlign='center';g.textBaseline='middle';const w=g.measureText(txt).width+60;g.strokeStyle=col;g.lineWidth=14;g.strokeRect(-w/2,-size*.63,w,size*1.26);g.fillStyle=col;g.fillText(txt,0,6);g.restore();}
function jyX_dive(t,u,label,drawScene){ // camera pushes into head then flashes to X-ray
  if(u<.35){cam(lerp(1.1,3.0,ss(0,.35,u)),540,1500-560*.95);drawScene();g.restore();g.save();g.fillStyle=`rgba(140,210,255,${ss(.2,.35,u)})`;g.fillRect(0,0,W,H);}
  else{xrayRoom(t);cam(lerp(1.0,1.1,u),540,1050);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.5,.9,u)},t);tag(540,260,label,'#9fd8ff',70);
    g.restore();g.save();g.fillStyle=`rgba(200,235,255,${1-ss(.35,.5,u)})`;g.fillRect(0,0,W,H);}}
function jyX_closeup(t,L,face2,at=1.1){const u=t-L.s;window.CAPY=1720;cam(2.1,540,1000);jyX_room(t);kev(540,1600,1,{...jyX_C,face:u<at?'calm':face2,talk:talkAmt(TL.lines.indexOf(L),t)*.6,armL:[.1,.05],armR:[.1,.05]},t);return u;}
function jyX_cheer(t,L,at=1.2){const u=t-L.s;window.CAPY=1720;cam(lerp(1.15,1.05,ss(L.s,L.e,t)),540,1100);jyX_room(t);
  kev(540,1640,.95,{...jyX_C,face:u<at?'smug':'grin',armL:u<at?[.1,.05]:[2.5,.4],armR:u<at?[.1,.05]:[2.5,.4],blink:blinkAt(t)},t);return u;}
function jyX_track(t,L,title,col,streakTxt,night){const u=ss(L.s,L.e,t);window.CAPY=1720;cam(lerp(1.05,1.14,u),560,1050);jyX_room(t,night);
  kev(300,1620,.85,{...jyX_C,face:'grin',armL:[.2,.15],armR:[1.4,.5]},t);planner(690,1180,.78,t,{title,checked:3+ss(L.s+.4,L.s+1.4,t),col});
  if(t>L.s+1.2)tag(690,760,streakTxt,'#2fae4e',58);}
function jyX_wordAt(L,re){const i=L.words.findIndex(w=>re.test(w.w));return i>=0?L.words[i].s:L.s;}
function jyX_book(x,y,s,open){g.save();g.translate(x,y);g.scale(s,s);g.strokeStyle=INK;g.lineWidth=7;
  if(open){g.fillStyle='#fbf8f1';g.beginPath();g.moveTo(0,-10);g.quadraticCurveTo(-80,-40,-160,-20);g.lineTo(-160,90);g.quadraticCurveTo(-80,70,0,100);g.quadraticCurveTo(80,70,160,90);g.lineTo(160,-20);g.quadraticCurveTo(80,-40,0,-10);g.closePath();g.fill();g.stroke();
    g.strokeStyle='#bbb';g.lineWidth=4;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-140,10+i*18);g.lineTo(-20,16+i*18);g.moveTo(20,16+i*18);g.lineTo(140,10+i*18);g.stroke();}}
  else{g.fillStyle='#3b7dd8';g.beginPath();g.roundRect(-110,-20,220,110,10);g.fill();g.stroke();g.fillStyle='#fbf8f1';g.fillRect(-100,70,200,14);}
  g.restore();}
function jyX_card(x,y,s,txt,col='#fbf8f1',rot=0){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.fillStyle='rgba(0,0,0,.3)';g.fillRect(-146,-86,300,180);g.fillStyle=col;g.strokeStyle=INK;g.lineWidth=6;g.fillRect(-150,-90,300,180);g.strokeRect(-150,-90,300,180);
  g.fillStyle=INK;g.font='800 52px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,0,4);g.restore();}

// ---------------- jy01: if-then plans (implementation intentions) ----------------
function jyX_gauge(cx,cy,frac,label){g.save();g.translate(cx,cy);g.lineCap='round';g.lineWidth=60;
  const seg=[['#ff6b5e',0,.33],['#ffd34d',.33,.66],['#2fae4e',.66,1]];for(const [c,a,b] of seg){g.strokeStyle=c;g.beginPath();g.arc(0,0,330,Math.PI*(1+a)+.03,Math.PI*(1+b)-.03);g.stroke();}
  const a=Math.PI*(1+frac);g.strokeStyle='#e8e2d4';g.lineWidth=16;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*280,Math.sin(a)*280);g.stroke();g.fillStyle='#e8e2d4';g.beginPath();g.arc(0,0,30,0,7);g.fill();
  g.font='800 120px BS';g.textAlign='center';g.fillStyle='#fff';g.fillText(Math.round(frac*100)+'%',0,150);g.font='800 52px BS';g.fillStyle='#bbb';g.fillText(label,0,230);g.restore();}
function jy01(t){T0=t;window.PROD='DAILY HABIT BUILDER';window.PTITLE='DAILY HABITS';window.PCOL='#e07b24';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // desk calendar keeps flipping to TOMORROW
    const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(360,1640,.9,{...jyX_C,face:u<1.6?'calm':'tired',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t),tilt:.06*ss(1.6,2.6,u)},t);
    const flip=Math.floor(u/.7);g.save();g.translate(780,700);g.rotate(-.04);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-170,-150,340,300,18);g.fill();g.stroke();
    g.fillStyle='#d9472b';g.beginPath();g.roundRect(-170,-150,340,70,[18,18,0,0]);g.fill();g.fillStyle='#fff';g.font='800 44px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('DAY '+(flip+1),0,-114);
    g.fillStyle=INK;g.font='800 64px BS';g.fillText('TOMORROW',0,20);g.font='600 34px HG';g.fillStyle='#5b4632';g.fillText('start habit',0,85);g.restore();
    if(u>1.2)tag(780,960,'STILL "TOMORROW"','#ffd34d',56);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug');g.restore();g.save();jyX_stamp(540,330,'NO PLAN','#ff4d3d',ss(1.0,1.5,u));}
  else if(sh(2)){ // writes the if-then line in the planner
    const L=LN(2),w=L.words,u=ss(L.s,L.e,t),ifT=jyX_wordAt(L,/^If$/);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'DAILY HABITS',checked:ss(ifT,L.e,t)*1,col:'#e07b24'});
    if(t>ifT){tag(560,300,'IF 7 AM →','#ffd34d',70);if(t>jyX_wordAt(L,/^then$/))tag(560,440,'THEN READ 10 PAGES','#2fae4e',62);}}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // intention-behaviour gap gauge ~ half
    const L=LN(4),u=ss(L.s+.4,L.e-.4,t);window.CAPY=1720;jyX_dark(t);jyX_gauge(540,1000,.53*u,'GOOD INTENTIONS → ACTION');
    tag(540,330,'THE INTENTION GAP','#9fd8ff',72);if(u>.95)tag(540,1400,'ABOUT HALF THE TIME','#ffd34d',60);
    kev(880,1560,.42,{...jyX_C,face:'tired',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(5)){ // 94 studies pop in as cards, then boost bar
    const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t);const n=Math.round(94*ss(.2,1.8,u));
    for(let i=0;i<n;i++){const x=150+(i%10)*87,y=480+Math.floor(i/10)*80;g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=4;g.fillRect(x-30,y-26,60,52);g.strokeRect(x-30,y-26,60,52);
      g.fillStyle=i<n?'#2fae4e':'#bbb';g.fillRect(x-20,y-12,40,8);g.fillRect(x-20,y+4,28,8);}
    tag(540,330,n+' STUDIES','#9fd8ff',76);
    if(u>2.4){const p=ss(2.4,3.6,u);g.save();g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=6;g.beginPath();g.roundRect(150,1340,780,90,45);g.fill();g.stroke();
      g.fillStyle='#2fae4e';g.beginPath();g.roundRect(160,1350,lerp(60,560,p),70,35);g.fill();g.restore();tag(540,1520,'IF-THEN = MEDIUM–LARGE BOOST','#2fae4e',52);}}
  else if(sh(6)){ // cue -> action chain inside the head
    const L=LN(6),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(1.05,540,1100);kev(540,1640,1.0,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.3,1,u)},t);
    g.restore();g.save();tag(250,330,'7:00 AM','#ffd34d',68);if(u>.8){g.save();g.strokeStyle='#ffe27a';g.lineWidth=12;g.lineCap='round';const p=ss(.8,1.4,u);g.beginPath();g.moveTo(410,330);g.lineTo(lerp(410,640,p),330);g.stroke();g.restore();}
    if(u>1.4)tag(820,330,'READ','#2fae4e',68);if(u>2.0)tag(540,500,'NO DEBATE NEEDED','#9fd8ff',54);}
  else if(sh(8)){jyX_track(t,LN(8),'DAILY HABITS','#e07b24','READ ✓ 7:00 AM');}
  else{const u=jyX_cheer(t,LN(7),1.4);if(u>1.4){g.restore();g.save();tag(540,300,'WHEN + WHERE','#ffd34d',80);tag(540,440,'= YOUR HABIT\'S ADDRESS','#e8e2d4',50);}}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy02: the testing effect (retrieval practice) ----------------
function jyX_bars(L,t,u,bars){const x0=150,y0=1300,h=760;g.save();g.strokeStyle='#e8e2d4';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x0,y0-h);g.lineTo(x0,y0);g.lineTo(x0+820,y0);g.stroke();
  g.fillStyle='#e8e2d4';g.font='800 46px BS';g.textAlign='center';g.save();g.translate(x0-40,y0-h/2);g.rotate(-Math.PI/2);g.fillText('RECALLED AFTER 1 WEEK',0,0);g.restore();
  bars.forEach(([n,q,c,p],i)=>{const bx=x0+140+i*360,bh=q*h*p;if(p<=0)return;g.fillStyle=c;g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.roundRect(bx,y0-bh,200,bh,[16,16,0,0]);g.fill();g.stroke();
    g.fillStyle='#e8e2d4';g.font='800 50px BS';g.fillText(n,bx+100,y0+60);g.fillStyle='#fff';g.font='800 80px BS';g.fillText(Math.round(q*100*p)+'%',bx+100,y0-bh-30);});g.restore();}
function jy02(t){T0=t;window.PROD='STUDY & SUCCESS PLANNER';window.PTITLE='STUDY PLAN';window.PCOL='#3b7dd8';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // test day blank: question marks
    const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.12,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(380,1640,.9,{...jyX_C,face:u<1.2?'calm':'shock',armL:[.6,.3],armR:[.6,.3]},t);
    g.save();g.translate(780,720);g.rotate(.05);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=7;g.fillRect(-150,-200,300,400);g.strokeRect(-150,-200,300,400);g.fillStyle=INK;g.font='800 58px BS';g.textAlign='center';g.fillText('TEST',0,-130);
    g.strokeStyle='#bbb';g.lineWidth=5;for(let i=0;i<5;i++){g.beginPath();g.moveTo(-110,-60+i*55);g.lineTo(110,-60+i*55);g.stroke();}g.restore();
    if(u>1.2){g.save();g.font='800 110px BS';g.fillStyle='#ffd34d';g.textAlign='center';for(let i=0;i<3;i++){const a=ss(1.2+i*.25,1.5+i*.25,u);g.globalAlpha=a;g.fillText('?',240+i*120,860-i*50+Math.sin(t*4+i)*10);}g.restore();}
    tag(540,300,'TEST DAY','#ff6b5e',80);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.4);g.restore();g.save();jyX_stamp(540,330,'WRONG METHOD','#ff4d3d',ss(1.5,2.0,u),-.08,92);}
  else if(sh(2)){ // planner + swap
    const L=LN(2),u=ss(L.s,L.e,t),sw=jyX_wordAt(L,/^swaps$/);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'STUDY PLAN',checked:ss(L.s+.4,sw,t)*2,col:'#3b7dd8'});
    if(t>sw){tag(560,300,'REREAD ✗','#ff6b5e',70);if(t>jyX_wordAt(L,/^quizzing$/))tag(560,440,'QUIZ YOURSELF ✓','#2fae4e',66);}}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)||sh(5)){const L4=LN(4),L5=LN(5);window.CAPY=1720;jyX_dark(t);
    const p1=ss(L4.s+1.5,L4.e-.5,t),p2=ss(L5.s+.6,L5.e-.6,t);
    jyX_bars(null,t,0,[['REREAD',.40,'#ff6b5e',p1],['QUIZZED',.61,'#2fae4e',p2]]);
    tag(540,300,'ONE CLASSIC STUDY','#9fd8ff',66);if(p2>.95)kev(150+140+360+100,1300-760*.61-120,.3,{...jyX_C,face:'grin',armL:[2.4,.3],armR:[2.4,.3]},t);}
  else if(sh(6)){ // pulling a card out of memory
    const L=LN(6),u=t-L.s,pull=jyX_wordAt(L,/^pulling$/)-L.s;window.CAPY=1760;xrayRoom(t);cam(1.05,540,1100);
    kev(540,1640,1.0,{xray:true,armL:[.35,.2],armR:u>pull?[2.7,.3]:[.35,.2],glow:ss(pull,pull+.6,u)},t);g.restore();g.save();
    if(u<pull)tag(540,330,'EASY ≠ LEARNING','#ffd34d',66);
    else{const p=ss(pull,pull+1,u);jyX_card(lerp(560,780,p),lerp(1000,560,p),.9,'RECALL!','#fbf8f1',-.08);if(u>pull+1)tag(540,300,'STRONGER MEMORY','#2fae4e',66);}}
  else if(sh(8)){jyX_track(t,LN(8),'STUDY PLAN','#3b7dd8','QUIZ ✓ DAY 4');}
  else{ // close book, flashcard
    const L=LN(7),u=t-L.s;window.CAPY=1720;cam(lerp(1.12,1.05,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(400,1640,.95,{...jyX_C,face:u<.9?'smug':'grin',armL:[.1,.05],armR:[1.5,.5],blink:blinkAt(t)},t);jyX_book(760,1260,1,u<.7);
    if(u>.9){jyX_card(700,860,.9,'Q: ?','#ffd34d',.06);g.restore();g.save();tag(540,300,'CLOSE IT. QUIZ IT.','#ffd34d',72);}}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy03: the fresh start effect ----------------
function jyX_week(x,y,s,hl){const d=['MON','TUE','WED','THU','FRI','SAT','SUN'];g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-430,-160,860,320,20);g.fill();g.stroke();
  d.forEach((n,i)=>{const cx=-370+i*123;g.strokeStyle='#bbb';g.lineWidth=3;g.strokeRect(cx-55,-110,110,220);g.fillStyle=INK;g.font='800 40px BS';g.textAlign='center';g.fillText(n,cx,-60);
    if(i===0&&hl>0){g.save();g.globalAlpha=hl;g.strokeStyle='#d9472b';g.lineWidth=9;g.beginPath();g.ellipse(cx,10,70,130,0,0,7*hl);g.stroke();g.fillStyle='#2fae4e';g.font='800 44px BS';g.fillText('START',cx,40);g.restore();}});g.restore();}
function jy03(t){T0=t;window.PROD='LIFE RESET PLANNER';window.PTITLE='NEW WEEK';window.PCOL='#4fb3a0';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // every note points at Monday
    const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(380,1640,.9,{...jyX_C,face:u<1.2?'calm':'smug',armL:[.1,.05],armR:[2.0,.4],blink:blinkAt(t)},t);
    jyX_week(540,560,.8,ss(.4,1.4,u));
    const notes=['GYM','DIET','READ'];notes.forEach((n,i)=>{const a=ss(.8+i*.35,1.1+i*.35,u);if(a>0){tag(790,840+i*110,n+' → MON','#ffd34d',52);}});}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.4);g.restore();g.save();if(u>1.5){tag(540,300,'FRESH START','#2fae4e',110);tag(540,430,'EFFECT','#e8e2d4',70);}}
  else if(sh(2)){ // Sunday night setup
    const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t,true);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'NEW WEEK',checked:ss(L.s+.6,L.e,t)*2,col:'#4fb3a0'});tag(560,300,'SUNDAY NIGHT','#9fd8ff',70);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t,true);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)||sh(5)){ // weekly sawtooth of "diet" searches, then a big New Year spike
    const L4=LN(4),L5=LN(5);window.CAPY=1720;jyX_dark(t);const x0=130,y0=1250,w=840,h=640,p=ss(L4.s+.8,L4.e-.6,t),q=ss(L5.s+.3,L5.e-.4,t);
    g.save();g.strokeStyle='#e8e2d4';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x0,y0-h);g.lineTo(x0,y0);g.lineTo(x0+w,y0);g.stroke();g.fillStyle='#e8e2d4';g.font='800 44px BS';g.textAlign='center';g.fillText('WEEKS →',x0+w/2,y0+90);
    g.save();g.translate(x0-40,y0-h/2);g.rotate(-Math.PI/2);g.fillText('"DIET" SEARCHES',0,0);g.restore();
    const f=x=>{const wk=(x*6)%1;let v=.3+.07*(1-wk)*(wk<1?1:0);if(x>.83&&x<.9)v+=q*.6*Math.sin((x-.83)/.07*Math.PI);return v;};
    g.strokeStyle='#ffd34d';g.lineWidth=10;g.beginPath();for(let i=0;i<=300*p;i++){const x=i/300,px=x0+x*w,py=y0-f(x)*h;i?g.lineTo(px,py):g.moveTo(px,py);}g.stroke();
    g.fillStyle='#ff6b5e';for(let k=0;k<6;k++){if(k/6<p){g.beginPath();g.arc(x0+k/6*w,y0-f(k/6+.0001)*h,14,0,7);g.fill();}}g.restore();
    if(p>.5)tag(540,330,'MONDAYS: ~+14%','#ffd34d',72);if(q>.4)tag(x0+.86*w-120,y0-h-40,'NEW YEAR: 80%+','#ff6b5e',60);
    kev(900,1560,.4,{...jyX_C,face:q>.4?'shock':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(6)){ // old slip-ups drift away
    const L=LN(6),u=t-L.s;window.CAPY=1760;cam(1.05,540,1100);jyX_room(t);kev(620,1640,.9,{...jyX_C,face:u<1.6?'calm':'grin',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);
    const sl=['MISSED GYM','LATE NIGHT','NO READING'];sl.forEach((n,i)=>{const d=ss(1.0+i*.5,3.8+i*.3,u);g.save();g.globalAlpha=1-d;jyX_card(lerp(290,-160,d),640+i*230,.85,n,'#f3d9c8',-.06+i*.05);g.restore();});
    g.restore();g.save();tag(540,300,'NEW CHAPTER','#2fae4e',90);}
  else if(sh(8)){jyX_track(t,LN(8),'NEW WEEK','#4fb3a0','WEEK 1 ✓ KEEP GOING');}
  else{const u=jyX_cheer(t,LN(7),1.3);g.restore();g.save();if(u<1.3)tag(540,300,'MONDAY = BOOST','#ffd34d',76);else jyX_stamp(540,330,'ANY DAY WORKS','#2fae4e',ss(1.3,1.8,u),-.08,120);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{jy01,jy02,jy03});
