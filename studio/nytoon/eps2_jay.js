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

// ---------------- shared JAY props (jy04+) ----------------
function jyX_phone(x,y,s,lit,txt,rot=0){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.fillStyle='#16181d';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-70,-130,140,260,22);g.fill();g.stroke();
  g.fillStyle=lit?'#9fd8ff':'#2a2f3a';g.beginPath();g.roundRect(-56,-112,112,224,12);g.fill();
  if(lit&&txt){g.fillStyle='#fff';g.beginPath();g.roundRect(-50,-60,100,60,10);g.fill();g.fillStyle=INK;g.font='800 22px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,0,-30);}
  g.restore();if(lit){g.save();g.strokeStyle='#ffe27a';g.lineWidth=7;g.lineCap='round';const k=(Math.sin(performance.now?0:0)+1);for(const sx of[-1,1]){g.beginPath();g.moveTo(x+sx*95*s,y-40*s);g.lineTo(x+sx*130*s,y-60*s);g.moveTo(x+sx*98*s,y);g.lineTo(x+sx*138*s,y);g.stroke();}g.restore();}}
function jyX_check(x,y,s,p){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=12;g.beginPath();g.roundRect(-120,-120,240,240,26);g.fill();g.stroke();
  if(p>0){g.strokeStyle='#2fae4e';g.lineWidth=30;g.lineCap='round';g.lineJoin='round';g.beginPath();const pts=[[-70,0],[-15,55],[80,-65]];g.moveTo(...pts[0]);
    if(p<.4){const q=p/.4;g.lineTo(lerp(-70,-15,q),lerp(0,55,q));}else{g.lineTo(...pts[1]);const q=(p-.4)/.6;g.lineTo(lerp(-15,80,q),lerp(55,-65,q));}g.stroke();}g.restore();}
function jyX_loop(cx,cy,r,labels,u,col='#ffe27a'){g.save();g.strokeStyle=col;g.lineWidth=10;g.lineCap='round';g.beginPath();g.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*ss(0,.8,u));g.stroke();g.restore();
  labels.forEach((l,i)=>{const a=-Math.PI/2+i*Math.PI*2/labels.length;if(u>i*.27)tag(cx+Math.cos(a)*r,cy+Math.sin(a)*r,l,['#2fae4e','#ffd34d','#9fd8ff'][i%3],50);});}

// ---------------- jy04: the progress principle (small wins) ----------------
function jyX_stairs(t,u){g.save();for(let i=0;i<6;i++){const x=120+i*150,y=1650-i*110;g.fillStyle=i%2?'#5a3820':'#6b4428';g.strokeStyle=INK;g.lineWidth=6;g.fillRect(x,y,150,1920-y);g.strokeRect(x,y,150,1920-y);}
  g.restore();}
function jy04(t){T0=t;window.PROD='DAILY HABIT BUILDER';window.PTITLE='DAILY HABITS';window.PCOL='#e07b24';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(330,1640,.9,{...jyX_C,face:u<1.3?'calm':'grin',armL:[.1,.05],armR:u<1.3?[.1,.05]:[2.5,.4],blink:blinkAt(t)},t);
    jyX_check(760,760,1,ss(.8,1.5,u));g.restore();g.save();tag(540,300,'ONE TINY TASK','#ffd34d',76);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.0);g.restore();g.save();if(u>1.1){tag(540,290,'THE PROGRESS','#2fae4e',96);tag(540,420,'PRINCIPLE','#e8e2d4',80);}}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'DAILY HABITS',checked:ss(L.s+.8,L.e,t)*2,col:'#e07b24'});
    g.restore();g.save();tag(540,300,'BIG GOAL','#ff6b5e',74);if(u>.4)tag(540,430,'→ SMALL STEPS','#2fae4e',62);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // diary pages piling up
    const L=LN(4),u=t-L.s,p=ss(.3,3.2,u);window.CAPY=1720;jyX_dark(t);const n=Math.round(120*p);
    for(let i=0;i<n;i++){const x=140+(i%12)*72,y=520+Math.floor(i/12)*72;g.save();g.translate(x,y);g.rotate(((i*37)%9-4)*.02);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=3;g.fillRect(-28,-30,56,60);g.strokeRect(-28,-30,56,60);
      g.fillStyle='#bbb';g.fillRect(-18,-16,36,5);g.fillRect(-18,-4,30,5);g.fillRect(-18,8,34,5);g.restore();}
    tag(540,330,Math.round(12000*p).toLocaleString('en-US')+' DIARY ENTRIES','#9fd8ff',62);if(u>2.4)tag(540,1360,'FROM 238 WORKERS','#ffd34d',62);
    kev(890,1600,.4,{...jyX_C,face:'shock',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(5)){ // podium: #1 = progress
    const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#17131f');const pod=[[540,1300,360,'#ffd34d','1'],[230,1300,240,'#c9c4b8','2'],[850,1300,180,'#e07b24','3']];
    pod.forEach(([x,y,h,c,n],i)=>{const p=ss(.2+i*.15,.8+i*.15,u);g.fillStyle=c;g.strokeStyle=INK;g.lineWidth=7;g.fillRect(x-140,y-h*p,280,h*p);g.strokeRect(x-140,y-h*p,280,h*p);
      if(p>.9){g.fillStyle=INK;g.font='800 90px BS';g.textAlign='center';g.fillText(n,x,y-h+110);}});
    tag(540,330,'BEST DAYS: #1 TRIGGER','#9fd8ff',62);if(u>1.4){tag(540,1300-360-90,'PROGRESS','#2fae4e',74);kev(540,1300-360-150,.38,{...jyX_C,face:'grin',armL:[2.5,.4],armR:[2.5,.4]},t);}
    if(u>2.6)tag(540,1470,'EVEN SMALL PROGRESS','#ffd34d',56);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(1.05,540,1100);kev(540,1640,1.0,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.3,1,u)},t);
    g.restore();g.save();jyX_loop(540,560,250,['SMALL WIN','MOTIVATION','NEXT STEP'],ss(.2,3.2,u));}
  else if(sh(8)){jyX_track(t,LN(8),'DAILY HABITS','#e07b24','STEP 3 ✓ WIN');}
  else{ // staircase of small steps
    const L=LN(7),u=t-L.s,p=ss(.2,2.4,u);window.CAPY=1760;jyX_dark(t,'#1f2a36');jyX_stairs(t,u);const st=Math.min(5,Math.floor(p*6));
    kev(195+st*150,1650-st*110,.5,{...jyX_C,face:'grin',armL:st>3?[2.5,.4]:[.3,.2],armR:st>3?[2.5,.4]:[.3,.2],blink:blinkAt(t)},t);
    tag(540,300,'SHRINK THE STEP','#ffd34d',80);if(u>1.6)tag(540,430,'WIN TODAY','#2fae4e',66);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy05: ~43% of actions are habits (Wood, Quinn & Kashy 2002) ----------------
function jyX_pie(cx,cy,r,frac,col,label){g.save();g.fillStyle='#3a3f4c';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.arc(cx,cy,r,0,7);g.fill();g.stroke();
  if(frac>0){g.fillStyle=col;g.beginPath();g.moveTo(cx,cy);g.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*frac);g.closePath();g.fill();g.stroke();}
  g.fillStyle='#fff';g.font='800 120px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(Math.round(frac*100)+'%',cx,cy);g.font='800 50px BS';g.fillStyle='#e8e2d4';g.fillText(label,cx,cy+r+70);g.restore();}
function jy05(t){T0=t;window.PROD='DAILY HABIT BUILDER';window.PTITLE='MORNING';window.PCOL='#e07b24';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // day timeline, who chose?
    const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(540,1640,.9,{...jyX_C,face:u<1.2?'calm':'shock',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t),look:-.4},t);
    const acts=['WAKE','PHONE','COFFEE','SHOWER'];acts.forEach((a,i)=>{if(u>.3+i*.3)jyX_card(220+(i%2)*640,560+Math.floor(i/2)*260,.8,a,'#fbf8f1',(i%2?.05:-.05));});
    g.restore();g.save();if(u>1.6)tag(540,300,'CHOSEN?','#ffd34d',90);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.2);g.restore();g.save();jyX_stamp(540,330,'AUTOPILOT','#ff4d3d',ss(1.3,1.8,u),-.08,120);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'MORNING',checked:ss(L.s+.6,L.e,t)*3,col:'#e07b24'});g.restore();g.save();tag(540,300,'MORNING ROUTINE','#ffd34d',70);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // hourly log sheet
    const L=LN(4),u=t-L.s;window.CAPY=1720;jyX_dark(t);g.save();g.translate(540,900);g.rotate(-.02);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-380,-430,760,860,20);g.fill();g.stroke();
    const hrs=['8 AM','9 AM','10 AM','11 AM','12 PM','1 PM','2 PM'];const notes=['brushing teeth','driving','emails','snacking','lunch','scrolling','walking'];
    hrs.forEach((h,i)=>{const y=-350+i*115;g.strokeStyle='#ccc';g.lineWidth=3;g.beginPath();g.moveTo(-350,y+50);g.lineTo(350,y+50);g.stroke();g.fillStyle=INK;g.font='800 40px BS';g.textAlign='left';g.fillText(h,-340,y+20);
      if(u>.4+i*.35){g.fillStyle='#3b5b9a';g.font='600 42px HG';g.fillText(notes[i],-130,y+20);}});g.restore();
    tag(540,300,'LOGGED EVERY HOUR','#9fd8ff',66);}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t);jyX_pie(540,880,320,.43*ss(.4,2.0,u),'#ffd34d','OF ACTIONS = HABIT');
    tag(540,320,'ONE DIARY STUDY','#9fd8ff',62);if(u>2.4)tag(540,1440,'MIND ELSEWHERE','#ff6b5e',58);
    kev(900,1640,.4,{...jyX_C,face:u>2.4?'shock':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(1.05,540,1100);kev(540,1640,1.0,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.3,1,u)},t);
    g.restore();g.save();if(u>.3)tag(270,320,'SAME PLACE','#ffd34d',56);if(u>.9)tag(810,320,'SAME TIME','#ffd34d',56);
    if(u>1.5){g.save();g.strokeStyle='#ffe27a';g.lineWidth=12;g.lineCap='round';g.beginPath();g.moveTo(540,370);g.lineTo(540,lerp(370,470,ss(1.5,1.9,u)));g.stroke();g.restore();}
    if(u>1.9)tag(540,530,'BRAIN COASTS','#2fae4e',70);}
  else if(sh(8)){jyX_track(t,LN(8),'MORNING','#e07b24','SAME CUE ✓ DAY 6');}
  else{const u=jyX_cheer(t,LN(7),1.5);g.restore();g.save();if(u<1.5)tag(540,300,'MORE WILLPOWER ✗','#ff6b5e',70);else jyX_stamp(540,330,'BETTER AUTOPILOT','#2fae4e',ss(1.5,2.0,u),-.06,68);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy06: interruptions — ~23 min to get back (Mark et al.) ----------------
function jyX_timer(cx,cy,r,mins,max){g.save();g.lineCap='round';g.strokeStyle='#3a3f4c';g.lineWidth=40;g.beginPath();g.arc(cx,cy,r,0,7);g.stroke();
  g.strokeStyle='#ff6b5e';g.beginPath();g.arc(cx,cy,r,-Math.PI/2,-Math.PI/2+Math.PI*2*(mins/max));g.stroke();
  g.fillStyle='#fff';g.font='800 150px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(Math.floor(mins)+':'+String(Math.floor((mins%1)*60)).padStart(2,'0'),cx,cy);g.font='800 48px BS';g.fillStyle='#bbb';g.fillText('MINUTES',cx,cy+110);g.restore();}
function jy06(t){T0=t;window.PROD='STUDY & SUCCESS PLANNER';window.PTITLE='STUDY PLAN';window.PCOL='#3b7dd8';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s,bz=1.0;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(360,1640,.9,{...jyX_C,face:u<bz?'calm':'shock',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);jyX_book(400,1330,.9,true);
    jyX_phone(800,900+(u>bz?Math.sin(t*60)*4:0),1,u>bz,'1 NEW TEXT',.08);g.restore();g.save();tag(540,300,'STUDY MODE','#9fd8ff',76);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.2);g.restore();g.save();jyX_stamp(540,330,'FOCUS RESET','#ff4d3d',ss(1.3,1.8,u),-.08,110);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'STUDY PLAN',checked:ss(L.s+.6,L.e,t)*2,col:'#3b7dd8'});g.restore();g.save();tag(540,300,'PHONE-FREE HOUR','#2fae4e',70);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // office workers getting pinged
    const L=LN(4),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#1b2230');const cols=['#3b7dd8','#2fae4e','#d9472b','#7d4cc2','#ffd34d','#4fb3a0'];
    for(let i=0;i<6;i++){const x=220+(i%3)*320,y=900+Math.floor(i/3)*480;g.fillStyle='#5a3820';g.strokeStyle=INK;g.lineWidth=6;g.fillRect(x-130,y-30,260,40);g.strokeRect(x-130,y-30,260,40);
      kev(x,y+20,.42,{...jyX_C,shirt:cols[i],face:u>.6+i*.3?'tired':'calm',armL:[.3,.2],armR:[.3,.2]},t);if(u>.6+i*.3)tag(x+80,y-330,'PING!','#ff6b5e',40);}
    tag(540,300,'TRACKED AT WORK','#9fd8ff',70);}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t);jyX_timer(540,900,330,Math.min(23,23*ss(.3,3.0,u)),30);
    tag(540,330,'BACK TO THE TASK','#9fd8ff',66);if(u>3.0)tag(540,1400,'AROUND 23 MIN ON AVERAGE','#ffd34d',54);}
  else if(sh(6)){ // speed vs stress meters
    const L=LN(6),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#17131f');const bars=[['SPEED',.72,'#2fae4e',ss(.4,1.3,u)],['STRESS',.9,'#ff6b5e',ss(1.6,2.6,u)]];
    bars.forEach(([n,q,c,p],i)=>{const bx=250+i*400,y0=1300,h=650;g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=6;g.beginPath();g.roundRect(bx-90,y0-h,180,h,20);g.fill();g.stroke();
      g.fillStyle=c;g.beginPath();g.roundRect(bx-80,y0-h*q*p,160,h*q*p-10,16);g.fill();g.fillStyle='#e8e2d4';g.font='800 56px BS';g.textAlign='center';g.fillText(n,bx,y0+80);if(p>.9){g.fillStyle='#fff';g.font='800 90px BS';g.fillText('↑',bx,y0-h*q-40);}});
    tag(540,300,'AFTER INTERRUPTIONS','#9fd8ff',64);kev(950,1640,.36,{...jyX_C,face:u>1.6?'tired':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(8)){jyX_track(t,LN(8),'STUDY PLAN','#3b7dd8','FOCUS BLOCK ✓ 1 HR');}
  else{const L=LN(7),u=t-L.s;window.CAPY=1720;cam(lerp(1.12,1.05,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(380,1640,.95,{...jyX_C,face:u<.9?'smug':'grin',armL:[.1,.05],armR:[1.5,.5],blink:blinkAt(t)},t);jyX_phone(800,1300,.8,false,'',-.3);
    g.restore();g.save();tag(540,300,'BATCH MESSAGES','#ffd34d',72);if(u>1.3)tag(540,430,'1 FOCUS BLOCK','#2fae4e',66);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy07: high self-control = fewer temptation fights (Hofmann et al. 2012) ----------------
function jyX_sword(x,y,s,a){g.save();g.translate(x,y);g.scale(s,s);g.globalAlpha=a;g.strokeStyle='#e8e2d4';g.lineWidth=12;g.lineCap='round';
  for(const r of[-.7,.7]){g.save();g.rotate(r);g.beginPath();g.moveTo(0,-60);g.lineTo(0,60);g.moveTo(-22,30);g.lineTo(22,30);g.stroke();g.restore();}g.restore();}
function jy07(t){T0=t;window.PROD='BREAK THE HABIT TRACKER';window.PTITLE='NO SCROLL';window.PCOL='#7d4cc2';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(540,1640,.95,{...jyX_C,face:u<1.0?'calm':'smug',armL:u<1.0?[.1,.05]:[2.6,1.4],armR:u<1.0?[.1,.05]:[2.6,1.4],blink:blinkAt(t)},t);
    g.restore();g.save();tag(540,300,'MORE WILLPOWER?','#ffd34d',78);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.0);g.restore();g.save();jyX_stamp(540,330,'FEWER FIGHTS','#2fae4e',ss(1.1,1.6,u),-.08,110);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'NO SCROLL',checked:ss(L.s+.6,L.e,t)*3,col:'#7d4cc2'});g.restore();g.save();tag(540,300,'NO-SCROLL STREAK','#9fd8ff',70);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // 205 people dots getting beeped
    const L=LN(4),u=t-L.s;window.CAPY=1720;jyX_dark(t);const n=Math.round(205*ss(.2,2.2,u));
    for(let i=0;i<n;i++){const x=150+(i%15)*56,y=520+Math.floor(i/15)*60,on=((i*13+Math.floor(t*3))%17)===0;g.fillStyle=on?'#ffd34d':'#e8e2d4';g.beginPath();g.arc(x,y-12,13,0,7);g.fill();g.fillRect(x-12,y+2,24,18);}
    tag(540,330,n+' ADULTS','#9fd8ff',80);if(u>2.2)tag(540,1430,'BEEP! "WHAT DO YOU WANT?"','#ffd34d',52);}
  else if(sh(5)){ // fewer fights for high self-control
    const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#17131f');
    const cols=[[290,'HIGHER','SELF-CONTROL',2,'#2fae4e'],[790,'LOWER','SELF-CONTROL',6,'#ff6b5e']];
    cols.forEach(([x,a,b,k,c],ci)=>{g.fillStyle='#262a36';g.strokeStyle=c;g.lineWidth=6;g.beginPath();g.roundRect(x-210,520,420,880,24);g.fill();g.stroke();
      g.fillStyle=c;g.font='800 56px BS';g.textAlign='center';g.fillText(a,x,600);g.font='800 40px BS';g.fillStyle='#e8e2d4';g.fillText(b,x,660);
      for(let i=0;i<k;i++)jyX_sword(x+((i%2)?80:-80),780+Math.floor(i/2)*190,.9,ss(.5+i*.25,.8+i*.25,u));});
    tag(540,330,'TEMPTATION FIGHTS','#9fd8ff',66);if(u>2.4)tag(540,1500,'FEWER FIGHTS, LESS RESISTING','#ffd34d',50);}
  else if(sh(6)){ // phone slides away out of reach
    const L=LN(6),u=t-L.s,p=ss(.6,2.0,u);window.CAPY=1760;cam(1.05,540,1100);jyX_room(t);kev(420,1640,.9,{...jyX_C,face:p>.6?'grin':'calm',armL:[.1,.05],armR:p<.3?[1.4,.5]:[.1,.05],blink:blinkAt(t)},t);
    jyX_phone(lerp(700,1250,p),1300,.7,false,'',.2);jyX_book(760,1330,.8,p>.8);
    g.restore();g.save();if(u>.3)tag(540,300,'ROUTINES','#2fae4e',74);if(u>1.5)tag(540,430,'FEWER TRIGGERS','#ffd34d',66);}
  else if(sh(8)){jyX_track(t,LN(8),'NO SCROLL','#7d4cc2','STREAK ✓ DAY 7');}
  else{const u=jyX_cheer(t,LN(7),1.3);g.restore();g.save();tag(540,300,'MOVE THE TEMPTATION','#ffd34d',68);if(u>1.3)tag(540,430,'SKIP THE FIGHT','#2fae4e',62);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- shared jy08+ helpers ----------------
function jyX_cork(cards,u,title){g.fillStyle='#a0703f';g.fillRect(0,0,W,H);const r=R(5);g.save();for(let i=0;i<1800;i++){g.fillStyle=r()<.5?'rgba(80,45,15,.25)':'rgba(255,220,170,.12)';g.fillRect(r()*W,r()*H,3+r()*4,3+r()*4);}g.restore();
  const sh_=i=>ss(i*.22,i*.22+.12,u);g.save();g.strokeStyle='#c4161c';g.lineWidth=6;for(let i=1;i<cards.length;i++){const a=cards[i-1],b=cards[i],p=sh_(i);if(p<=0)continue;g.beginPath();g.moveTo(a.x,a.y-70);g.lineTo(lerp(a.x,b.x,p),lerp(a.y-70,b.y-70,p));g.stroke();}g.restore();
  cards.forEach((c,i)=>{const p=sh_(i);if(p<=0)return;g.save();g.globalAlpha=p;jyX_card(c.x,c.y,1.15,c.t,c.col||'#fbf8f1',c.a||0);g.fillStyle='#c4161c';g.beginPath();g.arc(c.x,c.y-75,14,0,7);g.fill();g.restore();});
  if(title)tag(540,250,title,'#ffd34d',66);}
function jyX_meters(u,bars,title){bars.forEach(([n,q,c,a,b,arrow],i)=>{const p=ss(a,b,u),bx=250+i*580/(bars.length-1||1),y0=1300,h=650;g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=6;g.beginPath();g.roundRect(bx-90,y0-h,180,h,20);g.fill();g.stroke();
  g.fillStyle=c;g.beginPath();g.roundRect(bx-80,y0-h*q*p,160,Math.max(0,h*q*p-10),16);g.fill();g.fillStyle='#e8e2d4';g.font='800 52px BS';g.textAlign='center';g.fillText(n,bx,y0+80);if(p>.9&&arrow){g.fillStyle='#fff';g.font='800 90px BS';g.fillText(arrow,bx,y0-h*q-40);}});
  if(title)tag(540,300,title,'#9fd8ff',62);}
function jyX_dots(u,N,label){const n=Math.round(N*ss(.2,2.2,u)),cols=Math.ceil(Math.sqrt(N*0.7)),sp=Math.min(56,820/cols);
  for(let i=0;i<n;i++){const x=540-(cols-1)*sp/2+(i%cols)*sp,y=520+Math.floor(i/cols)*sp;g.fillStyle=((i*7)%11===0)?'#ffd34d':'#e8e2d4';g.beginPath();g.roundRect(x-sp*.35,y-sp*.35,sp*.7,sp*.7,6);g.fill();}
  tag(540,330,n+' '+label,'#9fd8ff',72);}
function jyX_flag(x,y,s,col,txt){g.save();g.translate(x,y);g.scale(s,s);g.strokeStyle=INK;g.lineWidth=10;g.beginPath();g.moveTo(0,0);g.lineTo(0,-300);g.stroke();g.fillStyle=col;g.beginPath();g.moveTo(0,-300);g.lineTo(170,-250);g.lineTo(0,-200);g.closePath();g.fill();g.lineWidth=6;g.stroke();
  if(txt){g.fillStyle=INK;g.font='800 40px BS';g.textAlign='center';g.fillText(txt,0,50);}g.restore();}
function jyX_bar(x,y,w,p,col){g.save();g.fillStyle='#262a36';g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.roundRect(x-w/2,y-24,w,48,24);g.fill();g.stroke();g.fillStyle=col;g.beginPath();g.roundRect(x-w/2+6,y-18,(w-12)*p,36,18);g.fill();g.restore();}

// ---------------- jy08: monitoring progress helps goal attainment (Harkin et al. 2016) ----------------
function jy08(t){T0=t;window.PROD='DAILY HABIT BUILDER';window.PTITLE='DAILY HABITS';window.PCOL='#e07b24';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(360,1640,.9,{...jyX_C,face:'shock',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t),look:.4},t);
    jyX_flag(820,1150,1,'#2fae4e','GOAL');jyX_bar(800,1300,380,ss(.6,2.6,u)*.8,'#ffd34d');
    g.restore();g.save();tag(540,300,'JUST CHECKING IT?','#ffd34d',74);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.0);g.restore();g.save();jyX_stamp(540,330,'FEEDBACK','#2fae4e',ss(1.1,1.6,u),-.08,130);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'DAILY HABITS',checked:ss(L.s+.6,L.e,t)*3,col:'#e07b24'});g.restore();g.save();tag(540,300,'DAILY CHECK-IN','#9fd8ff',72);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_cork([{x:300,y:560,t:'138 STUDIES',a:-.05},{x:760,y:820,t:'~20K PEOPLE',a:.05,col:'#ffe9a8'},{x:330,y:1120,t:'TRACKING',a:.04},{x:770,y:1380,t:'GOAL HIT?',a:-.04,col:'#c8f0d0'}],u*1.3,'ONE BIG REVIEW');}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#17131f');
    jyX_meters(u,[['NO CHECKING',.45,'#ff6b5e',.3,1.1,''],['MONITORED',.8,'#2fae4e',1.0,2.0,'↑']],'CHANCE OF REACHING THE GOAL');
    if(u>2.2)tag(540,1460,'MORE LIKELY ✓','#ffd34d',62);kev(930,1700,.32,{...jyX_C,face:u>2?'grin':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(1.05,540,1100);kev(540,1640,1.0,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.3,1,u)},t);
    g.restore();g.save();if(u>.3)tag(270,320,'WRITTEN DOWN','#ffd34d',54);if(u>1.2)tag(810,320,'SHARED','#ffd34d',54);
    if(u>1.9)tag(540,470,'BIGGER BOOST','#2fae4e',72);}
  else if(sh(8)){jyX_track(t,LN(8),'DAILY HABITS','#e07b24','CHECKED ✓ DAY 8');}
  else{const u=jyX_cheer(t,LN(7),1.3);g.restore();g.save();if(u<1.3)tag(540,300,'SET THE GOAL','#9fd8ff',70);else jyX_stamp(540,330,'CHECK IT DAILY','#2fae4e',ss(1.3,1.8,u),-.06,84);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy09: spacing effect (Cepeda et al. 2006, 317 experiments) ----------------
function jyX_curves(u){const x0=160,y0=1300,w=800,h=700;g.save();g.strokeStyle='#e8e2d4';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x0,y0-h);g.lineTo(x0,y0);g.lineTo(x0+w,y0);g.stroke();
  g.fillStyle='#e8e2d4';g.font='800 42px BS';g.textAlign='center';g.fillText('TIME →',x0+w/2,y0+70);g.save();g.translate(x0-40,y0-h/2);g.rotate(-Math.PI/2);g.fillText('REMEMBERED',0,0);g.restore();
  const p=ss(.3,2.6,u),N=120;const cram=x=>h*.9*Math.exp(-x*3.2),spaced=x=>{const k=[0,.25,.55,.85];let i=0;for(;i<k.length-1&&x>=k[i+1];i++);const d=x-k[i],dec=[3.2,2.2,1.4,.9][i];return h*(.9-.05*i)*Math.exp(-d*dec)+0;};
  for(const [f,c,lab] of [[cram,'#ff6b5e','CRAM'],[spaced,'#2fae4e','SPACED']]){g.strokeStyle=c;g.lineWidth=12;g.beginPath();for(let i=0;i<=N*p;i++){const x=i/N;const X=x0+x*w,Y=y0-f(x);i?g.lineTo(X,Y):g.moveTo(X,Y);}g.stroke();
    if(p>.98){g.fillStyle=c;g.font='800 52px BS';g.textAlign='right';g.fillText(lab,x0+w,y0-f(1)-30);}}
  g.restore();}
function jy09(t){T0=t;window.PROD='STUDY & SUCCESS PLANNER';window.PTITLE='STUDY PLAN';window.PCOL='#3b7dd8';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);jyX_room(t,true);
    kev(380,1640,.9,{...jyX_C,face:u<1.4?'shock':'tired',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);
    for(let i=0;i<5;i++)jyX_book(790,1330-i*60,.8,false);g.restore();g.save();tag(540,300,'ALL-NIGHT CRAM','#ff6b5e',74);if(u>1.4)tag(540,430,'VS SPREAD OUT','#2fae4e',66);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.0);g.restore();g.save();jyX_stamp(540,330,'TIMING','#2fae4e',ss(1.1,1.6,u),-.08,150);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'STUDY PLAN',checked:ss(L.s+.6,L.e,t)*2,col:'#3b7dd8'});g.restore();g.save();tag(540,300,'SHORT SESSIONS','#9fd8ff',72);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=t-L.s;window.CAPY=1720;jyX_dark(t);jyX_dots(u,317,'EXPERIMENTS');}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#17131f');jyX_curves(u);tag(540,300,'SPACED BEAT CRAMMED','#ffd34d',62);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(1.05,540,1100);kev(540,1640,1.0,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.3,1,u)},t);
    g.restore();g.save();jyX_loop(540,560,250,['FORGET A BIT','PULL IT BACK','IT STICKS'],ss(.2,3.2,u));}
  else if(sh(8)){jyX_track(t,LN(8),'STUDY PLAN','#3b7dd8','SESSION 3 ✓');}
  else{const L=LN(7),u=t-L.s;window.CAPY=1720;cam(lerp(1.12,1.05,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(540,1640,.95,{...jyX_C,face:u<.9?'smug':'grin',armL:[.1,.05],armR:u>.9?[2.5,.4]:[.1,.05],blink:blinkAt(t)},t);
    g.restore();g.save();const days=['MON','TUE','WED','THU','FRI'];days.forEach((d,i)=>{const on=i===0||i===3;if(u>.2+i*.25)jyX_card(150+i*195,560,.6,d,on?'#c8f0d0':'#fbf8f1');if(on&&u>.4+i*.25)tag(150+i*195,720,'STUDY','#2fae4e',40);});
    tag(540,300,'A LITTLE, THEN AGAIN','#ffd34d',62);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy10: goal gradient — coffee card visits sped up near the reward (Kivetz, Urminsky & Zheng 2006) ----------------
function jyX_coffeecard(x,y,s,n,rot=0){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.fillStyle='#fbf3e4';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-400,-200,800,400,26);g.fill();g.stroke();
  g.fillStyle='#6b4428';g.font='800 52px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('BUY 10, GET 1 FREE',0,-140);
  for(let i=0;i<10;i++){const cx=-320+(i%5)*160,cy=-30+Math.floor(i/5)*140;g.strokeStyle='#6b4428';g.lineWidth=5;g.beginPath();g.arc(cx,cy,55,0,7);g.stroke();
    if(i<n){g.fillStyle='#6b4428';g.beginPath();g.arc(cx,cy,44,0,7);g.fill();g.fillStyle='#fbf3e4';g.font='800 46px BS';g.fillText('☕',cx,cy+2);}}
  g.restore();}
function jy10(t){T0=t;window.PROD='DAILY HABIT BUILDER';window.PTITLE='7-DAY STREAK';window.PCOL='#e07b24';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    const p=ss(.3,2.6,u);kev(lerp(420,640,p*p),1640,.85,{...jyX_C,face:'grin',armL:[.6+Math.sin(t*14*(1+p))*.5,.3],armR:[.6-Math.sin(t*14*(1+p))*.5,.3],blink:blinkAt(t)},t);
    jyX_flag(930,1640,.9,'#ffd34d','REWARD');g.restore();g.save();tag(540,300,p>.5?'FASTER!':'FAR AWAY…',p>.5?'#2fae4e':'#9fd8ff',80);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.0);g.restore();g.save();jyX_stamp(540,330,'GOAL GRADIENT','#2fae4e',ss(1.1,1.6,u),-.08,96);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'7-DAY STREAK',checked:ss(L.s+.6,L.e,t)*3,col:'#e07b24'});g.restore();g.save();tag(540,300,'STREAK FILLING UP','#9fd8ff',70);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#2a1d14');jyX_coffeecard(540,880,1.1,Math.floor(ss(.4,3.2,u)*6),-.03);
    tag(540,330,'COFFEE SHOP REWARD CARD','#ffd34d',58);kev(880,1640,.4,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(5)){ // visits getting closer together
    const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t);const xs=[];let x=130;for(let i=0;i<10;i++){xs.push(x);x+=lerp(150,40,i/9);}
    g.save();g.strokeStyle='#e8e2d4';g.lineWidth=6;g.beginPath();g.moveTo(100,1000);g.lineTo(1000,1000);g.stroke();
    xs.forEach((X,i)=>{if(u>.3+i*.25){g.fillStyle=i>6?'#2fae4e':'#ffd34d';g.beginPath();g.arc(X,1000,26,0,7);g.fill();g.fillStyle=INK;g.font='800 30px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(i+1,X,1002);}});g.restore();
    tag(540,330,'VISITS','#9fd8ff',72);if(u>1.2)tag(300,820,'SLOW','#ff6b5e',54);if(u>2.6)tag(820,820,'SOONER','#2fae4e',54);
    if(u>3.0)jyX_coffeecard(540,1400,.6,9,.03);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1760;jyX_dark(t,'#1f2a36');
    g.save();g.fillStyle='#4a3020';g.fillRect(0,1100,W,H);g.restore();
    jyX_flag(780,1100,.9,'#2fae4e','');jyX_flag(1000,760,.25,'#ff6b5e','');kev(540,1300,.55,{...jyX_C,face:'grin',armL:[2.5,.4],armR:[.4,.2]},t);
    if(u>.3)tag(700,560,'FINISH IN SIGHT','#2fae4e',58);if(u>2.0)tag(540,1500,'FAR AWAY = FLAT','#ff6b5e',60);}
  else if(sh(8)){jyX_track(t,LN(8),'7-DAY STREAK','#e07b24','DAY 6 OF 7 ✓');}
  else{const L=LN(7),u=t-L.s;window.CAPY=1720;cam(lerp(1.12,1.05,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(540,1640,.95,{...jyX_C,face:u<.9?'smug':'grin',armL:[.1,.05],armR:u>.9?[2.5,.4]:[.1,.05],blink:blinkAt(t)},t);
    g.restore();g.save();if(u<1.2)tag(540,300,'BIG GOAL ✗','#ff6b5e',72);else{tag(540,300,'SHORT STREAKS','#2fae4e',72);for(let i=0;i<7;i++)if(u>1.3+i*.12)jyX_card(150+i*130,520,.38,String(i+1),i<6?'#c8f0d0':'#ffe9a8');}}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy11: micro-breaks boost energy, cut fatigue (Albulescu et al. 2022) ----------------
function jyX_batt(x,y,s,frac){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=10;g.beginPath();g.roundRect(-160,-80,320,160,20);g.fill();g.stroke();g.fillStyle='#e8e2d4';g.fillRect(160,-30,24,60);
  const c=frac<.3?'#ff6b5e':frac<.6?'#ffd34d':'#2fae4e';g.fillStyle=c;g.beginPath();g.roundRect(-145,-65,290*frac,130,12);g.fill();g.fillStyle='#fff';g.font='800 64px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(frac<.3?'LOW':frac<.6?'…':'FULL',0,4);g.restore();}
function jy11(t){T0=t;window.PROD='STUDY & SUCCESS PLANNER';window.PTITLE='FOCUS BLOCKS';window.PCOL='#3b7dd8';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s,b=ss(1.2,2.6,u);window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);jyX_room(t);
    kev(380,1640,.9,{...jyX_C,face:u<1.0?'shock':b<.5?'tired':'grin',armL:b>.5?[2.5,.4]:[.1,.05],armR:b>.5?[2.5,.4]:[.1,.05],blink:blinkAt(t)},t);jyX_batt(800,1180,.8,lerp(.18,.95,b));
    g.restore();g.save();tag(540,300,b<.3?'DRAINED':'5-MIN BREAK',b<.3?'#ff6b5e':'#2fae4e',80);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.0);g.restore();g.save();jyX_stamp(540,330,'RECHARGING','#2fae4e',ss(1.1,1.6,u),-.08,110);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'FOCUS BLOCKS',checked:ss(L.s+.6,L.e,t)*2,col:'#3b7dd8'});g.restore();g.save();tag(540,300,'BREAKS PLANNED','#9fd8ff',72);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // focus / break timeline
    const L=LN(4),u=t-L.s;window.CAPY=1720;jyX_dark(t);const blk=[['FOCUS',300,'#3b7dd8'],['≤10 MIN',130,'#2fae4e'],['FOCUS',300,'#3b7dd8'],['≤10 MIN',130,'#2fae4e']];let x=80;
    blk.forEach(([n,w,c],i)=>{const p=ss(.3+i*.4,.7+i*.4,u);if(p>0){g.fillStyle=c;g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.roundRect(x,880,(w-10)*p,180,16);g.fill();g.stroke();if(p>.9){g.fillStyle='#fff';g.font=`800 ${w>200?60:34}px BS`;g.textAlign='center';g.textBaseline='middle';g.fillText(n,x+w/2-5,970);}}x+=w;});
    tag(540,330,'2022 REVIEW','#9fd8ff',72);if(u>2.0)tag(540,620,'MICRO-BREAKS','#ffd34d',66);kev(540,1640,.45,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#17131f');
    jyX_meters(u,[['ENERGY',.85,'#2fae4e',.3,1.3,'↑'],['FATIGUE',.3,'#ff6b5e',1.4,2.4,'↓']],'AFTER MICRO-BREAKS');kev(540,1700,.32,{...jyX_C,face:u>1.4?'grin':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1720;cam(1.05,540,1100);jyX_room(t);
    kev(540,1640,.95,{...jyX_C,face:'calm',armL:[1.9,1.3],armR:[1.9,1.3],blink:blinkAt(t)},t);
    g.restore();g.save();tag(540,300,'PERFORMANCE?','#9fd8ff',74);if(u>.9)tag(540,430,'SMALLER, MIXED','#ffd34d',64);jyX_stamp(540,620,'NOT MAGIC','#ff4d3d',ss(2.0,2.5,u),-.06,100);}
  else if(sh(8)){jyX_track(t,LN(8),'FOCUS BLOCKS','#3b7dd8','BLOCK 2 ✓ BREAK');}
  else{const u=jyX_cheer(t,LN(7),1.3);g.restore();g.save();tag(540,300,'PLAN THE BREAK','#ffd34d',70);if(u>1.5)tag(540,430,'THEN BACK TO WORK','#2fae4e',60);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{jy01,jy02,jy03,jy04,jy05,jy06,jy07,jy08,jy09,jy10,jy11});

// ---------------- shared jy12-jy15 props ----------------
function jyX_bulb(x,y,s,on){g.save();g.translate(x,y);g.scale(s,s);if(on>0){g.shadowColor='#ffd34d';g.shadowBlur=80*on;}g.fillStyle=on>0?`rgba(255,${200+40*on|0},80,${.4+.6*on})`:'#3a3f4d';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.arc(0,-60,80,0,7);g.fill();g.stroke();g.shadowBlur=0;
  g.fillStyle='#9aa0ad';g.fillRect(-40,10,80,50);g.strokeRect(-40,10,80,50);g.restore();}
function jyX_walker(x,y,s,t,face,spd=1){kev(x,y-Math.abs(Math.sin(t*9*spd))*18,s,{...jyX_C,face,armL:[.4+Math.sin(t*9*spd)*.5,.2],armR:[.4-Math.sin(t*9*spd)*.5,.2],blink:blinkAt(t)},t);}
function jyX_tread(x,y,s,t){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#2b2f3a';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-300,-30,600,60,30);g.fill();g.stroke();
  g.strokeStyle='#555b6a';g.lineWidth=5;for(let i=0;i<10;i++){const xx=-280+((i*60+t*300)%560);g.beginPath();g.moveTo(xx,-20);g.lineTo(xx,20);g.stroke();}
  g.strokeStyle=INK;g.lineWidth=12;g.beginPath();g.moveTo(240,-20);g.lineTo(280,-420);g.lineTo(150,-440);g.stroke();g.restore();}
function jyX_waves(x,y,u,col='#9fd8ff'){g.save();g.strokeStyle=col;g.lineCap='round';for(let i=0;i<3;i++){const p=((Math.max(0,u)*1.5+i/3)%1);g.globalAlpha=1-p;g.lineWidth=10;g.beginPath();g.arc(x,y,60+p*180,-.6,.6);g.stroke();}g.restore();}
function jyX_board(x,y,s,lines,u){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#244a35';g.strokeStyle='#6b4428';g.lineWidth=22;g.beginPath();g.roundRect(-380,-230,760,460,10);g.fill();g.stroke();
  g.fillStyle='#e8f2ea';g.font='800 58px BS';g.textAlign='left';g.textBaseline='middle';lines.forEach((l,i)=>{const p=ss(i*.5,i*.5+.5,u);if(p>0){g.save();g.beginPath();g.rect(-340,-200+i*110,680*p,100);g.clip();g.fillText(l,-330,-150+i*110);g.restore();}});g.restore();}
function jyX_pad(x,y,s,u,shade){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.fillRect(-260,-320,520,640);g.strokeRect(-260,-320,520,640);
  g.strokeStyle='#c9d6e8';g.lineWidth=3;for(let i=0;i<12;i++){g.beginPath();g.moveTo(-240,-260+i*50);g.lineTo(240,-260+i*50);g.stroke();}
  const sh=[[-130,-150,'c'],[100,-120,'s'],[-90,90,'s'],[120,140,'c']];sh.forEach(([a,b,k],i)=>{const p=ss(i*.25,i*.25+.25,u);if(p<=0)return;g.strokeStyle=INK;g.lineWidth=7;g.beginPath();if(k==='c')g.arc(a,b,70,0,7*p);else g.rect(a-65,b-65,130*Math.min(1,p*1.5),130);g.stroke();
    if(shade&&p>.9){g.save();g.clip();g.strokeStyle='#3b7dd8';g.lineWidth=5;for(let j=-80;j<80;j+=16){g.beginPath();g.moveTo(a+j-70,b-70);g.lineTo(a+j+70,b+70);g.stroke();}g.restore();}});g.restore();}
function jyX_std(t,L,face,cx=540){window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),cx,1100);jyX_room(t);}

// ---------------- jy12: walking boosts creative ideas ~60% (Oppezzo & Schwartz 2014) ----------------
function jy12(t){T0=t;window.PROD='DAILY HABIT BUILDER';window.PTITLE='DAILY WALK';window.PCOL='#e07b24';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s,b=ss(1.0,2.4,u);jyX_std(t,L);jyX_walker(lerp(300,520,ss(0,3,u)),1640,.9,t,u<.8?'shock':'grin');
    jyX_bulb(830,900,.9,b);for(let i=0;i<3;i++)if(b>.3+i*.2)jyX_bulb(700+i*150,560+(i%2)*70,.35,1);g.restore();g.save();tag(540,300,b<.3?'STUCK?':'IDEAS!',b<.3?'#ff6b5e':'#ffd34d',84);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.0);g.restore();g.save();jyX_stamp(540,330,'WARM-UP','#2fae4e',ss(1.1,1.6,u),-.08,120);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'DAILY WALK',checked:ss(L.s+.6,L.e,t)*2,col:'#e07b24'});g.restore();g.save();tag(540,300,'10-MIN WALK','#9fd8ff',72);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=t-L.s;window.CAPY=1720;jyX_dark(t);tag(540,330,'STANFORD STUDIES','#9fd8ff',70);
    const it=[['BRICK','#d9472b'],['TIRE','#262a36'],['BUTTON','#3b7dd8']];it.forEach(([n,c],i)=>{if(u>.4+i*.5)jyX_card(220+i*320,760,.75,n,'#fbf8f1',(i-1)*.06);});
    if(u>2.0)tag(540,1080,'CREATIVE USES?','#ffd34d',64);kev(540,1640,.5,{...jyX_C,face:'calm',armL:[1.9,1.3],armR:[.1,.05]},t);}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#17131f');
    jyX_meters(u,[['SITTING',.5,'#9aa0ad',.3,1.2,''],['WALKING',.8,'#2fae4e',1.2,2.4,'↑']],'CREATIVE OUTPUT');if(u>2.4)tag(760,480,'~60% MORE','#ffd34d',66);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#2a2f3a');g.fillStyle='#e8e2d4';g.fillRect(0,0,W,1200);
    jyX_tread(540,1560,1,t);jyX_walker(500,1540,.75,t,'calm',.8);tag(540,300,'BLANK WALL','#ff6b5e',72);if(u>1.4)jyX_stamp(540,600,'STILL WORKED','#2fae4e',ss(1.4,1.9,u),-.06,96);}
  else if(sh(8)){jyX_track(t,LN(8),'DAILY WALK','#e07b24','WALK ✓ IDEAS ✓');}
  else{const L=LN(7),u=t-L.s;jyX_std(t,L);kev(540,1640,.95,{...jyX_C,face:u<1.5?'calm':'tired',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);
    g.restore();g.save();tag(540,300,'ONE RIGHT ANSWER','#9fd8ff',66);if(u>1.6)tag(540,430,'WALKING: NO BOOST','#ff6b5e',60);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy13: reading aloud to yourself = best recall (Forrin & MacLeod 2018) ----------------
function jy13(t){T0=t;window.PROD='STUDY & SUCCESS PLANNER';window.PTITLE='REVIEW ALOUD';window.PCOL='#3b7dd8';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;jyX_std(t,L);kev(420,1640,.9,{...jyX_C,face:u<.9?'shock':'grin',talk:talkAmt(0,t)*.6,armL:[1.9,1.3],armR:[1.9,1.3],blink:blinkAt(t)},t);
    jyX_book(420,1260,.9,true);jyX_waves(560,1060,u);g.restore();g.save();tag(540,300,u<1.2?'SILENT?':'OUT LOUD!',u<1.2?'#9aa0ad':'#ffd34d',84);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.0);g.restore();g.save();jyX_stamp(540,330,'PRODUCTION EFFECT','#2fae4e',ss(1.1,1.6,u),-.08,80);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'REVIEW ALOUD',checked:ss(L.s+.6,L.e,t)*2,col:'#3b7dd8'});g.restore();g.save();tag(540,300,'OUT-LOUD REVIEW','#9fd8ff',70);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=t-L.s;window.CAPY=1720;jyX_dark(t);jyX_dots(u,95,'PEOPLE');if(u>2.4)tag(540,1300,'WATERLOO STUDY','#ffd34d',64);}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#1f2a36');tag(540,300,'4 WAYS TO LEARN','#ffd34d',70);
    const ws=[['SILENT','🤫'],['OTHERS','👂'],['RECORDING','📼'],['ALOUD','🗣️']];ws.forEach(([n,e],i)=>{const at=[0,.9,1.8,3.2][i];if(u>at){const x=i%2?780:300,y=i<2?720:1180;jyX_card(x,y,1.1,n,i===3?'#ffe9a8':'#fbf8f1');g.save();g.font='110px serif';g.textAlign='center';g.fillText(e,x,y-150);g.restore();}});}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#17131f');
    jyX_meters(u,[['SILENT',.4,'#9aa0ad',.2,.8,''],['OTHERS',.5,'#9aa0ad',.4,1.0,''],['RECORD',.55,'#9aa0ad',.6,1.2,''],['ALOUD',.8,'#2fae4e',1.0,1.8,'↑']],'REMEMBERED');if(u>1.8)tag(780,470,'BEST','#2fae4e',66);}
  else if(sh(8)){jyX_track(t,LN(8),'REVIEW ALOUD','#3b7dd8','CH. 3 ✓ SAID IT');}
  else{const L=LN(7),u=ss(L.s,L.e,t);window.CAPY=1720;jyX_dive(t,Math.max(.36,u),'SAY + HEAR',()=>{});if(u>.4){jyX_waves(640,820,t-L.s,'#ffd34d');tag(540,1260,'STANDS OUT','#ffd34d',66);}}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy14: doodlers recalled ~29% more (Andrade 2010) ----------------
function jy14(t){T0=t;window.PROD='STUDY & SUCCESS PLANNER';window.PTITLE='CLASS NOTES';window.PCOL='#3b7dd8';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;jyX_std(t,L);kev(330,1640,.9,{...jyX_C,face:u<.9?'shock':'grin',armL:[.1,.05],armR:[1.4,.5],blink:blinkAt(t)},t);
    jyX_pad(740,1180,.62,ss(.2,2.4,u),true);g.restore();g.save();tag(540,300,u<1.2?'NOT LISTENING?':'REMEMBERS MORE',u<1.2?'#ff6b5e':'#2fae4e',74);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.0);g.restore();g.save();jyX_stamp(540,330,'SWITCHED ON','#2fae4e',ss(1.1,1.6,u),-.08,110);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'CLASS NOTES',checked:ss(L.s+.6,L.e,t)*2,col:'#3b7dd8'});g.restore();g.save();tag(540,300,'DOODLE MARGIN','#9fd8ff',72);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=t-L.s;window.CAPY=1720;jyX_dark(t);tag(540,300,'UK STUDY · 40 PEOPLE','#9fd8ff',64);
    g.save();g.font='260px serif';g.textAlign='center';g.textBaseline='middle';g.fillText('☎️',540,850);g.restore();if(u>.8)tag(540,1130,'BORING MESSAGE…','#9aa0ad',62);
    kev(540,1660,.45,{...jyX_C,face:u>1.6?'tired':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#1f2a36');tag(540,300,'HALF SHADED SHAPES','#ffd34d',66);jyX_pad(540,1000,.95,ss(.2,2.0,u),u>1.0);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#17131f');
    jyX_meters(u,[['NO DOODLE',.55,'#9aa0ad',.3,1.2,''],['DOODLED',.75,'#2fae4e',1.3,2.4,'↑']],'SURPRISE MEMORY TEST');if(u>2.4)tag(760,480,'~29% MORE','#ffd34d',66);}
  else if(sh(8)){jyX_track(t,LN(8),'CLASS NOTES','#3b7dd8','LECTURE ✓ TUNED IN');}
  else{const L=LN(7),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#141821');const dr=ss(.3,1.6,u);
    jyX_bulb(540,900,1.1,1-dr*.4);g.save();g.globalAlpha=1-ss(1.6,2.4,u);g.font='120px serif';g.textAlign='center';g.fillText('☁️',540+dr*320,620-dr*120);g.restore();
    tag(540,300,'MIND DRIFTING?','#ff6b5e',70);if(u>1.8)tag(540,1260,'DOODLE = ANCHOR','#2fae4e',66);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- jy15: expecting to teach boosts recall (Nestojko et al. 2014) ----------------
function jy15(t){T0=t;window.PROD='STUDY & SUCCESS PLANNER';window.PTITLE='TEACH IT';window.PCOL='#3b7dd8';window.ENDCHAR=jyX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;jyX_std(t,L);jyX_board(700,800,.75,['1. MAIN IDEA','2. WHY','3. EXAMPLE'],ss(.4,2.4,u));
    kev(330,1640,.9,{...jyX_C,face:u<.9?'shock':'grin',armL:[.1,.05],armR:[2.2,.4],blink:blinkAt(t)},t);g.restore();g.save();tag(540,260,'TEACHER MODE','#ffd34d',80);}
  else if(sh(1)){const u=jyX_closeup(t,LN(1),'smug',1.0);g.restore();g.save();jyX_stamp(540,330,'SMARTER MINDSET','#2fae4e',ss(1.1,1.6,u),-.08,90);}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);jyX_room(t);
    kev(300,1620,.85,{...jyX_C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'TEACH IT',checked:ss(L.s+.6,L.e,t)*2,col:'#3b7dd8'});g.restore();g.save();tag(540,300,'"TEACH IT" TOPICS','#9fd8ff',70);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    jyX_dive(t,u,'INSIDE JAY',()=>{jyX_room(t);kev(540,1500,.95,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=t-L.s;window.CAPY=1720;jyX_dark(t);tag(540,300,'SAME PASSAGE','#9fd8ff',72);
    for(let i=0;i<3;i++)if(u>.3+i*.4)jyX_book(260+i*280,900,.9,true);kev(540,1640,.45,{...jyX_C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#1f2a36');
    jyX_card(290,820,1.1,'TEST','#fbf8f1',-.05);if(u>1.5)jyX_card(790,820,1.1,'TEACH','#ffe9a8',.05);
    kev(290,1500,.45,{...jyX_C,face:'tired',armL:[.1,.05],armR:[.1,.05]},t);if(u>1.5)kev(790,1500,.45,{...jyX_C,face:'grin',armL:[2.5,.4],armR:[.1,.05]},t);tag(540,300,'TWO GROUPS','#ffd34d',72);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1720;jyX_dark(t,'#17131f');
    jyX_meters(u,[['TEST',.5,'#9aa0ad',.3,1.2,''],['TEACH',.78,'#2fae4e',1.2,2.4,'↑']],'RECALLED');if(u>2.4)tag(760,480,'MAIN POINTS ↑','#ffd34d',58);}
  else if(sh(8)){jyX_track(t,LN(8),'TEACH IT','#3b7dd8','TOPIC 2 ✓ TAUGHT');}
  else{const L=LN(7),u=t-L.s;jyX_std(t,L);jyX_board(700,800,.75,['MAIN POINT','→ REASON','→ EXAMPLE'],ss(.2,2.0,u));
    kev(330,1640,.9,{...jyX_C,face:'smug',armL:[.1,.05],armR:[2.2,.4],blink:blinkAt(t)},t);g.restore();g.save();tag(540,260,'ORGANIZED','#2fae4e',80);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{jy12,jy13,jy14,jy15});
