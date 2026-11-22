// TASHA channel episodes (toon2 v2 style). Add function <id>(t){...} and register below.
// Satisfy Lab ASMR · TASHA · Life Reset Planner. Shared TASHA-only props are prefixed tsX_ so they never collide with other channels.
const tsX_C=CAST.TASHA;
function tsX_room(t){ // warm living room: terracotta wall, framed picture, daylight window, couch, plant, hanging bulb
  const wg=g.createLinearGradient(0,0,0,1000);wg.addColorStop(0,'#3a1f1a');wg.addColorStop(1,'#5a3226');g.fillStyle='#3a1f1a';g.fillRect(-600,-800,W+1200,900);g.fillStyle=wg;g.fillRect(-600,0,W+1200,1000);
  g.save();g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=4;for(let x=-600;x<W+600;x+=90){g.beginPath();g.moveTo(x,0);g.lineTo(x,990);g.stroke();}g.restore();
  g.fillStyle='#6b4428';g.fillRect(-600,990,W+1200,H);g.save();g.strokeStyle='rgba(0,0,0,.22)';g.lineWidth=4;for(let i=0;i<14;i++){const y=990+i*i*6;g.beginPath();g.moveTo(-600,y);g.lineTo(W+600,y);g.stroke();}g.restore();
  g.fillStyle='#24130c';g.fillRect(-600,976,W+1200,22);
  // window (left) with daylight
  g.save();g.translate(170,470);g.fillStyle='#8fc6e8';g.fillRect(-100,-150,200,300);g.fillStyle='rgba(255,255,255,.35)';g.beginPath();g.moveTo(-100,60);g.lineTo(-20,-150);g.lineTo(30,-150);g.lineTo(-100,140);g.fill();
  g.strokeStyle='#f2e6d0';g.lineWidth=14;g.strokeRect(-100,-150,200,300);g.lineWidth=8;g.beginPath();g.moveTo(0,-150);g.lineTo(0,150);g.moveTo(-100,0);g.lineTo(100,0);g.stroke();g.restore();
  // framed picture (right)
  g.save();g.translate(880,430);g.rotate(.03);g.fillStyle='#e9c25a';g.strokeStyle=INK;g.lineWidth=8;g.fillRect(-90,-70,180,140);g.strokeRect(-90,-70,180,140);
  g.fillStyle='#d94f8a';g.beginPath();g.arc(-20,10,34,0,7);g.fill();g.fillStyle='#2fae4e';g.beginPath();g.moveTo(-80,60);g.lineTo(0,-20);g.lineTo(80,60);g.fill();g.restore();
  // couch
  g.save();g.translate(540,980);g.fillStyle='#2f6f73';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-330,-200,660,190,40);g.fill();g.stroke();
  g.beginPath();g.roundRect(-380,-140,90,150,30);g.fill();g.stroke();g.beginPath();g.roundRect(290,-140,90,150,30);g.fill();g.stroke();g.restore();
  // plant
  g.save();g.translate(990,960);g.fillStyle='#b5562e';g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.moveTo(-50,0);g.lineTo(50,0);g.lineTo(38,-90);g.lineTo(-38,-90);g.closePath();g.fill();g.stroke();
  g.fillStyle='#3f9a4f';for(const [a,l] of [[-.6,150],[-.2,190],[.25,170],[.7,130]]){g.save();g.translate(0,-90);g.rotate(a);g.beginPath();g.ellipse(0,-l/2,26,l/2,0,0,7);g.fill();g.stroke();g.restore();}g.restore();
  g.strokeStyle='#111';g.lineWidth=4;g.beginPath();g.moveTo(540,-800);g.lineTo(540,150);g.stroke();g.fillStyle='#ffe9b0';g.shadowColor='#ffd27a';g.shadowBlur=60;g.beginPath();g.arc(540,170,24,0,7);g.fill();g.shadowBlur=0;
  spot(540,860,780,.45);}
function tsX_dark(t,col='#1a1220'){g.fillStyle=col;g.fillRect(0,0,W,H);spot(540,900,900,.22);}
function tsX_week(x,y,s,o={}){ // 7 day boxes; o.marks {idx:'x'|'v'}, o.hi highlighted idx, o.glow 0..1 on blank boxes
  const D=['MON','TUE','WED','THU','FRI','SAT','SUN'];g.save();g.translate(x,y);g.scale(s,s);
  g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-450,-150,900,300,24);g.fill();g.stroke();
  g.fillStyle=o.col||'#d94f8a';g.beginPath();g.roundRect(-450,-150,900,70,[24,24,0,0]);g.fill();g.fillStyle='#fff';g.font='800 46px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(o.title||'THIS WEEK',0,-114);
  for(let i=0;i<7;i++){const cx=-375+i*125,cy=30;const hi=o.hi===i;
    g.fillStyle=hi?'#ffe27a':'#fff';if(!hi&&o.glow&&!(o.marks||{})[i]){g.fillStyle=`rgba(180,240,190,${o.glow})`;}
    g.strokeStyle=hi?'#e0a300':'#bbb';g.lineWidth=hi?7:4;g.beginPath();g.roundRect(cx-52,cy-50,104,110,12);g.fill();g.stroke();
    g.fillStyle='#5b4632';g.font='800 32px BS';g.fillText(D[i],cx,cy-24);const m=(o.marks||{})[i];
    if(m==='x'){g.strokeStyle='#d9472b';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(cx-22,cy);g.lineTo(cx+22,cy+44);g.moveTo(cx+22,cy);g.lineTo(cx-22,cy+44);g.stroke();}
    if(m==='v'){g.strokeStyle='#2fae4e';g.lineWidth=10;g.lineCap='round';g.beginPath();g.moveTo(cx-22,cy+22);g.lineTo(cx-6,cy+40);g.lineTo(cx+24,cy+2);g.stroke();}}
  g.restore();}
function tsX_stamp(x,y,txt,col,u,rot=-.12,size=130){if(u<=0)return;g.save();g.translate(x,y);g.rotate(rot);const sc=lerp(2.2,1,ss(0,1,u));g.scale(sc,sc);g.globalAlpha=ss(0,.4,u);
  g.font=`800 ${size}px BS`;g.textAlign='center';g.textBaseline='middle';const w=g.measureText(txt).width+60;g.strokeStyle=col;g.lineWidth=12;g.strokeRect(-w/2,-size*.65,w,size*1.3);g.fillStyle=col;g.fillText(txt,0,6);g.restore();}
function tsX_dive(t,u,label,drawScene){ // camera pushes into head then flashes to X-ray
  if(u<.35){cam(lerp(1.1,3.0,ss(0,.35,u)),540,1500-560*.95);drawScene();g.restore();g.save();g.fillStyle=`rgba(140,210,255,${ss(.2,.35,u)})`;g.fillRect(0,0,W,H);}
  else{xrayRoom(t);cam(lerp(1.0,1.1,u),540,1050);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.5,.9,u)},t);tag(540,260,label,'#9fd8ff',70);
    g.restore();g.save();g.fillStyle=`rgba(200,235,255,${1-ss(.35,.5,u)})`;g.fillRect(0,0,W,H);}}
function tsX_board(t,u,cards){ // cork evidence board; cards [{x,y,a,t1,t2,ic}] ic: fn(t) drawing an icon around (0,-55)
  g.fillStyle='#a0703f';g.fillRect(0,0,W,H);const r=R(19);g.save();for(let i=0;i<2600;i++){g.fillStyle=r()<.5?'rgba(80,45,15,.25)':'rgba(255,220,170,.12)';g.fillRect(r()*W,r()*H,3+r()*4,3+r()*4);}g.restore();
  const k=cards.length,step=1/(k+.4),shown=n=>ss(n*step,n*step+.12,u);
  g.save();g.strokeStyle='#c4161c';g.lineWidth=6;for(let i=0;i<k-1;i++){const a=cards[i],b=cards[i+1],p=ss(i*step+.1,i*step+step,u);if(p<=0)continue;g.beginPath();g.moveTo(a.x,a.y-120);g.lineTo(lerp(a.x,b.x,p),lerp(a.y-120,b.y-120,p));g.stroke();}g.restore();
  cards.forEach((c,i)=>{const a=shown(i);if(a<=0)return;g.save();g.translate(c.x,c.y);g.rotate(c.a);g.scale(.7+.3*a,.7+.3*a);g.globalAlpha=a;
    g.fillStyle='rgba(0,0,0,.3)';g.fillRect(-176,-136,360,300);g.fillStyle='#f3e7cf';g.fillRect(-180,-145,360,300);g.strokeStyle=INK;g.fillStyle=INK;g.lineWidth=8;c.ic(t);
    g.fillStyle=INK;g.font='800 56px BS';g.textAlign='center';g.textBaseline='alphabetic';g.fillText(c.t1,0,70);g.font='600 34px HG';g.fillStyle='#5b4632';g.fillText(c.t2,0,118);
    g.fillStyle='#c4161c';g.beginPath();g.arc(0,-120,15,0,7);g.fill();g.restore();});}
const tsX_ic={
 lab:()=>{g.beginPath();g.moveTo(-20,-110);g.lineTo(-20,-60);g.lineTo(-55,0);g.lineTo(55,0);g.lineTo(20,-60);g.lineTo(20,-110);g.stroke();g.fillStyle='#4fb3a0';g.beginPath();g.moveTo(-42,-20);g.lineTo(42,-20);g.lineTo(55,0);g.lineTo(-55,0);g.fill();},
 cal:()=>{g.strokeRect(-55,-105,110,100);g.fillStyle='#d94f8a';g.fillRect(-55,-105,110,26);g.fillStyle=INK;g.font='800 52px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('1',0,-38);},
 cake:()=>{g.fillStyle='#f6b8cf';g.fillRect(-55,-55,110,50);g.strokeRect(-55,-55,110,50);g.fillStyle='#fff';g.fillRect(-60,-62,120,14);g.strokeRect(-60,-62,120,14);g.fillStyle='#e9c25a';for(const x of[-25,0,25]){g.fillRect(x-4,-95,8,30);}g.fillStyle='#ff8a3d';for(const x of[-25,0,25]){g.beginPath();g.ellipse(x,-104,6,10,0,0,7);g.fill();}},
 up:()=>{g.beginPath();g.moveTo(-70,-10);g.lineTo(-20,-50);g.lineTo(10,-30);g.lineTo(70,-100);g.stroke();g.beginPath();g.moveTo(70,-100);g.lineTo(40,-98);g.moveTo(70,-100);g.lineTo(68,-70);g.stroke();},
 cup:()=>{g.fillStyle='#f6b8cf';g.beginPath();g.moveTo(-40,-95);g.lineTo(40,-95);g.lineTo(28,0);g.lineTo(-28,0);g.closePath();g.fill();g.stroke();g.beginPath();g.moveTo(14,-95);g.lineTo(34,-130);g.stroke();},
 brk:()=>{g.strokeRect(-55,-105,110,100);g.strokeStyle='#d9472b';g.beginPath();g.moveTo(-10,-105);g.lineTo(10,-70);g.lineTo(-8,-40);g.lineTo(12,-5);g.stroke();}};
function tsX_track(t,L,title,streakTxt,o={}){ // staying-on-track payoff: Tasha checks today's box in the planner
  const u=ss(L.s,L.e,t);window.CAPY=1740;cam(lerp(1.05,1.14,u),560,1050);tsX_room(t);
  kev(300,1620,.85,{...tsX_C,...o,face:'grin',armL:[.2,.15],armR:[1.4,.5]},t);planner(690,1180,.78,t,{title,checked:3+ss(L.s+.4,L.s+1.4,t),col:'#d94f8a'});
  if(t>L.s+1.2)tag(690,760,streakTxt,'#2fae4e',58);}
function tsX_loops(x,y,s,t,n,a=1){ // orbiting "open loop" arrows with little task labels
  const lab=['EMAIL','LAUNDRY','TAXES','CALL MOM','GYM','DISHES','BILLS','TRIP','ESSAY','FORM'];g.save();g.translate(x,y);g.scale(s,s);g.globalAlpha=a;
  for(let i=0;i<n;i++){const ang=t*.9+i*(Math.PI*2/Math.max(n,1)),rx=230+(i%3)*40,ry=90+(i%2)*30;const px=Math.cos(ang)*rx,py=Math.sin(ang)*ry;
    g.save();g.translate(px,py);g.strokeStyle='#ffe27a';g.lineWidth=7;g.beginPath();g.arc(0,0,30,.4,Math.PI*1.8);g.stroke();g.fillStyle='#ffe27a';g.beginPath();g.moveTo(30*Math.cos(Math.PI*1.8)+10,30*Math.sin(Math.PI*1.8)+4);g.lineTo(18,-38);g.lineTo(36,-14);g.fill();
    g.font='800 30px BS';g.textAlign='center';g.fillStyle='#fff';g.fillText(lab[i%10],0,62);g.restore();}
  g.restore();}

// ---------------- ts01: the planning fallacy (why the weekly to-do list never fits) ----------------
function tsX_bar(y,len,max,col,label,valTxt){const x0=120,w=840*len/max;g.save();g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=6;g.beginPath();g.roundRect(x0,y-50,840,100,20);g.fill();g.stroke();
  if(w>4){g.fillStyle=col;g.beginPath();g.roundRect(x0+8,y-42,Math.max(10,w-16),84,14);g.fill();}g.fillStyle='#e8e2d4';g.font='800 50px BS';g.textAlign='left';g.fillText(label,x0,y-80);
  if(valTxt){g.textAlign='right';g.fillStyle=col;g.fillText(valTxt,x0+840,y-80);}g.restore();}
function ts01(t){T0=t;window.PROD='LIFE RESET PLANNER';window.PTITLE='MY WEEK';window.PCOL='#d94f8a';window.ENDCHAR=tsX_C;const last=TL.lines.length-1,END=LN(last).e+.35;
  const C={...tsX_C,shirt:'#d94f8a'};
  g.save();
  if(sh(0)){ // week strip buried under too many sticky notes
    const L=LN(0),u=ss(L.s,L.e,t);window.CAPY=1740;cam(lerp(1.0,1.08,u),540,1050);tsX_room(t);
    tsX_week(540,520,.86,{title:'THIS WEEK'});const r=R(41);const n=Math.floor(4+20*u);
    for(let i=0;i<n;i++){const x=150+r()*780,y=380+r()*520;g.save();g.translate(x,y);g.rotate((r()-.5)*.6);g.fillStyle=['#ffe27a','#f6b8cf','#a6e3b6'][i%3];g.strokeStyle=INK;g.lineWidth=5;g.fillRect(-55,-50,110,100);g.strokeRect(-55,-50,110,100);g.fillStyle='#5b4632';g.fillRect(-35,-14,70,8);g.fillRect(-35,8,45,8);g.restore();}
    kev(540,1620,.88,{...C,face:u<.5?'calm':'shock',armL:u<.5?[.1,.05]:[2.3,.6],armR:u<.5?[.1,.05]:[2.3,.6],blink:blinkAt(t)},t);}
  else if(sh(1)){ // close-up, PLANNING FALLACY stamp
    const L=LN(1),u=t-L.s;window.CAPY=1720;cam(2.1,540,1000);tsX_room(t);kev(540,1600,1,{...C,face:u<1.2?'calm':'smug',talk:talkAmt(1,t)*.6,armL:[.1,.05],armR:[.1,.05]},t);
    g.restore();g.save();tsX_stamp(540,330,'PLANNING FALLACY','#ffd34d',ss(1.3,1.8,u),-.08,84);}
  else if(sh(2)){ // planner + buffer time
    const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);tsX_room(t);
    kev(300,1620,.85,{...C,face:t>w[12].s?'grin':'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'MY WEEK',checked:ss(L.s+.6,L.e-.4,t)*2,col:'#d94f8a'});
    if(t>w[12].s)tag(600,330,'+ EXTRA TIME','#2fae4e',70);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    tsX_dive(t,u,'INSIDE TASHA',()=>{tsX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)||sh(5)){ // guess vs actual bars
    const L4=LN(4),L5=LN(5),w=L4.words;window.CAPY=1720;tsX_dark(t);tag(540,250,'THESIS STUDY','#9fd8ff',66);
    const gs=ss(w[6].s,L4.e,t)*33.9,ac=ss(L5.s+.2,L5.e-.5,t)*55.5;
    tsX_bar(640,gs,60,'#ffd34d','GUESS',gs>1?Math.round(gs)+' DAYS':'');
    if(t>L5.s-.1)tsX_bar(1000,ac,60,'#ff6b5e','REAL LIFE (AVG)',ac>1?'~'+Math.round(ac)+' DAYS':'');
    kev(540,1660,.55,{...C,face:t<L5.s+.8?'calm':'shock',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(6)){ // evidence board
    const L=LN(6),u=ss(L.s,L.e-.3,t);window.CAPY=1740;cam(lerp(1.06,1.12,u),540,lerp(880,1000,u));
    tsX_board(t,u,[{x:300,y:430,a:-.06,t1:'WORST CASE',t2:'guess',ic:tsX_ic.lab},{x:780,y:700,a:.05,t1:'TOO HOPEFUL',t2:'still',ic:tsX_ic.up},{x:320,y:1040,a:.04,t1:'~30%',t2:'finished on time',ic:tsX_ic.cal},{x:770,y:1330,a:-.05,t1:'THE REST',t2:'ran late',ic:tsX_ic.brk}]);}
  else if(sh(7)){ // X-ray: brain sees best case, interruptions pop in
    const L=LN(7),u=t-L.s;window.CAPY=1720;xrayRoom(t);g.save();cam(1.5,540,1000);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.6},t);g.restore();
    tag(540,260,'BEST CASE ☀','#ffe27a',72);const ins=[['EMAILS',230,620],['TRAFFIC',850,560],['SICK DAY',210,1240],['ERRANDS',860,1180]];
    ins.forEach(([s,x,y],i)=>{if(u>1.6+i*.25)tag(x,y,s,'#ff6b5e',46);});}
  else{tsX_track(t,LN(8),'MY WEEK','WEEK: ON TIME',{shirt:'#d94f8a'});}
  g.restore();vignette(.6);
  if(t<END)caption(t);endCard(t,END);}

// ---------------- ts02: open loops (Zeigarnik) and why writing a plan calms them ----------------
function ts02(t){T0=t;window.PROD='LIFE RESET PLANNER';window.PTITLE='CALM MIND';window.PCOL='#2f6f73';window.ENDCHAR={...tsX_C,shirt:'#2f6f73'};const last=TL.lines.length-1,END=LN(last).e+.35;
  const C={...tsX_C,shirt:'#2f6f73'};
  g.save();
  if(sh(0)){ // awake in bed at 11:47, loops orbit her head
    const L=LN(0),u=ss(L.s,L.e,t);window.CAPY=1560;cam(lerp(1.35,1.5,u),560,960);bedroom(t,{txt:'11:47'});bed(540,1180);
    kev(540,1240,1,{...C,face:'tired',legs:false,armL:[.5,.4],armR:[.5,.4],blink:blinkAt(t)},t);bedFront(540,1180,-120);tsX_loops(540,470,1,t,Math.ceil(1+4*u),ss(0,.3,u));}
  else if(sh(1)){ // close-up, OPEN LOOP tag with a broken ring
    const L=LN(1),u=t-L.s;window.CAPY=1720;cam(2.1,540,1000);tsX_room(t);kev(540,1600,1,{...C,face:u<1.5?'calm':'smug',talk:talkAmt(1,t)*.6,armL:[.1,.05],armR:[.1,.05]},t);
    g.restore();g.save();if(u>1.6){g.save();g.strokeStyle='#ffe27a';g.lineWidth=18;g.lineCap='round';g.beginPath();g.arc(540,330,110,.5,.5+Math.PI*1.7*ss(1.6,2.2,u));g.stroke();g.restore();tag(540,520,'OPEN LOOP','#ffe27a',72);}}
  else if(sh(2)){ // ten sticky notes then planner
    const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);tsX_room(t);
    const grab=t>w[7].s;kev(300,1620,.85,{...C,face:grab?'calm':'tired',armL:[.2,.15],armR:grab?[1.4,.5]:[.2,.15],blink:blinkAt(t)},t);
    const r=R(31);for(let i=0;i<10;i++){const a=ss(L.s+.1*i,L.s+.1*i+.3,t)*(grab?1-ss(w[7].s,w[7].s+.5,t)*.7:1);const x=560+r()*440-120,y=300+r()*520;g.save();g.globalAlpha=a;g.translate(x,y);g.rotate((r()-.5)*.5);g.fillStyle=['#ffe27a','#f6b8cf','#a6e3b6'][i%3];g.strokeStyle=INK;g.lineWidth=5;g.fillRect(-60,-55,120,110);g.strokeRect(-60,-55,120,110);g.fillStyle='#5b4632';g.fillRect(-40,-20,80,8);g.fillRect(-40,6,50,8);g.restore();}
    if(t<w[7].s)tag(620,180,'10 HALF-DONE','#ff6b5e',62);
    if(grab)planner(690,1180,.78,t,{title:'CALM MIND',checked:0,col:'#2f6f73'});}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    tsX_dive(t,u,'INSIDE TASHA',()=>{tsX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // memory bars: interrupted vs finished
    const L=LN(4),u=t-L.s;window.CAPY=1760;tsX_dark(t);const p=ss(1.0,3.6,u);
    const bar=(x,h,col,lab)=>{g.save();g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=7;g.beginPath();g.roundRect(x-100,500,200,900,20);g.fill();g.stroke();g.fillStyle=col;g.beginPath();g.roundRect(x-80,1380-860*h*p,160,860*h*p,14);g.fill();
      g.fillStyle='#e8e2d4';g.font='800 50px BS';g.textAlign='center';g.fillText(lab,x,1480);g.restore();};
    bar(320,.9,'#ffd34d','INTERRUPTED');bar(760,.5,'#7a8aa8','FINISHED');tag(540,330,'REMEMBERED','#9fd8ff',72);if(u>3.4)tag(320,420,'BETTER ↑','#ffd34d',56);}
  else if(sh(5)){ // X-ray: loops orbit the brain, focus meter keeps dropping
    const L=LN(5),u=t-L.s;window.CAPY=1720;xrayRoom(t);g.save();cam(1.5,540,1000);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.4},t);g.restore();
    tsX_loops(540,640,1,t,6,1);tag(540,230,'2011 STUDY','#9fd8ff',64);
    const f=.85-.5*ss(1,5.5,u)+.08*Math.sin(t*5);g.save();g.translate(540,1300);g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=6;g.beginPath();g.roundRect(-360,-40,720,80,40);g.fill();g.stroke();
    g.fillStyle=f>.5?'#2fae4e':'#ff6b5e';g.beginPath();g.roundRect(-350,-30,700*f,60,30);g.fill();g.fillStyle='#fff';g.font='800 44px BS';g.textAlign='center';g.fillText('FOCUS',0,-60);g.restore();}
  else if(sh(6)){ // the plan card is written, loops vanish
    const L=LN(6),u=ss(L.s,L.e,t);window.CAPY=1740;xrayRoom(t);const k=Math.round(6*(1-ss(.35,.9,u)));tsX_loops(540,280,.8,t,k,1);
    g.save();g.translate(540,880);g.rotate(-.03);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.fillRect(-380,-300,760,600);g.strokeRect(-380,-300,760,600);
    g.fillStyle='#2f6f73';g.fillRect(-380,-300,760,90);g.fillStyle='#fff';g.font='800 58px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('THE PLAN',0,-255);
    g.textAlign='left';g.font='800 60px BS';const rows=['WHAT: TAXES','WHEN: SAT 10 AM','HOW: 3 STEPS'];rows.forEach((s,i)=>{const p=ss(.05+i*.12,.17+i*.12,u);if(p<=0)return;g.save();g.beginPath();g.rect(-330,-160+i*140-40,660*p,90);g.clip();g.fillStyle=INK;g.fillText(s,-320,-160+i*140);g.restore();});g.restore();
    if(u>.85)tag(540,1460,'LOOP CLOSED ✓','#2fae4e',66);}
  else if(sh(7)){ // asleep, calm
    const L=LN(7),u=ss(L.s,L.e,t);window.CAPY=1560;cam(lerp(1.35,1.45,u),560,960);bedroom(t,{txt:'11:58'});bed(540,1180);
    kev(540,1270,1,{...C,face:u<.45?'calm':'sleep',legs:false,armL:[.5,.4],armR:[.5,.4],tilt:-.2*ss(.45,.7,u)},t);bedFront(540,1180,-100);if(u>.55)zzz(680,820,t);if(u>.2)tag(540,380,'PLANNED ✓','#2fae4e',66);}
  else{tsX_track(t,LN(8),'CALM MIND','LOOPS CLOSED: 10',{shirt:'#2f6f73'});}
  g.restore();vignette(.6);
  if(t<END)caption(t);endCard(t,END);}

// ---------------- ts03: the "what the hell" effect (one bad day -> bad week) ----------------
function ts03(t){T0=t;window.PROD='LIFE RESET PLANNER';window.PTITLE='BACK ON TRACK';window.PCOL='#e07b24';window.ENDCHAR={...tsX_C,shirt:'#e07b24'};const last=TL.lines.length-1,END=LN(last).e+.35;
  const C={...tsX_C,shirt:'#e07b24'};const D=['MON','TUE','WED','THU','FRI','SAT','SUN'];
  g.save();
  if(sh(0)){ // dominoes MON..SUN topple, Tasha shocked
    const L=LN(0),u=t-L.s;window.CAPY=1760;cam(1.05,540,1050);tsX_room(t);
    for(let i=0;i<7;i++){const fall=ss(.6+i*.25,.85+i*.25,u),x=150+i*125,y=1250;g.save();g.translate(x+40,y);g.rotate(fall*1.15);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.roundRect(-40,-240,80,240,10);g.fill();g.stroke();
      g.fillStyle=i===0?'#d9472b':INK;g.font='800 34px BS';g.textAlign='center';g.textBaseline='middle';g.save();g.translate(0,-120);g.rotate(-Math.PI/2);g.fillText(D[i],0,0);g.restore();g.restore();}
    kev(540,1820,.62,{...C,face:u<1.2?'calm':'shock',armL:u<1.2?[.1,.05]:[2.3,.6],armR:u<1.2?[.1,.05]:[2.3,.6]},t);}
  else if(sh(1)){ // close-up, not willpower
    const L=LN(1),u=t-L.s;window.CAPY=1720;cam(2.1,540,1000);tsX_room(t);kev(540,1600,1,{...C,face:u<1.3?'calm':'smug',talk:talkAmt(1,t)*.6,armL:[.1,.05],armR:[.1,.05]},t);
    g.restore();g.save();tsX_stamp(540,330,'NOT WILLPOWER','#ff4d3d',ss(.2,.7,u),-.1,90);}
  else if(sh(2)){ // planner with Monday blown, about to close it
    const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);tsX_room(t);
    kev(300,1620,.85,{...C,face:'tired',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    const cl=ss(w[8].s,L.e,t);g.save();g.translate(690,1180);g.scale(1,1-.55*cl);planner(0,0,.78,t,{title:'BACK ON TRACK',checked:0,col:'#e07b24'});g.restore();
    if(t>w[2].s)tag(640,330,'MONDAY: BLOWN','#ff6b5e',64);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    tsX_dive(t,u,'INSIDE TASHA',()=>{tsX_room(t);kev(540,1500,.95,{...C,face:'tired',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // X-ray, brain shrugs: the effect's name
    const L=LN(4),u=t-L.s;window.CAPY=1720;xrayRoom(t);cam(lerp(1.5,1.7,ss(L.s,L.e,t)),540,1000);
    kev(540+Math.sin(t*20)*4*ss(.8,1,u),1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.3},t);g.restore();g.save();
    if(u>.8)tag(540,300,'"WHAT THE HELL"','#ffe27a',88);if(u>1.3)tag(540,440,'EFFECT','#9fd8ff',76);}
  else if(sh(5)){ // evidence board: the classic diet study
    const L=LN(5),u=ss(L.s,L.e-.3,t);window.CAPY=1740;cam(lerp(1.06,1.12,u),540,lerp(880,1000,u));
    tsX_board(t,u,[{x:300,y:430,a:-.06,t1:'CLASSIC',t2:'lab study',ic:tsX_ic.lab},{x:780,y:700,a:.05,t1:'DIETERS',t2:'thought diet = broken',ic:tsX_ic.brk},{x:320,y:1040,a:.04,t1:'A SHAKE',t2:'"already blew it"',ic:tsX_ic.cup},{x:770,y:1330,a:-.05,t1:'ATE MORE',t2:'not less',ic:tsX_ic.up}]);}
  else if(sh(6)){ // "trying" gauge drops
    const L=LN(6),u=t-L.s;window.CAPY=1760;tsX_dark(t);const v=1-ss(1.2,3.0,u);
    g.save();g.translate(540,1000);g.lineWidth=50;g.lineCap='round';for(const [a0,a1,c] of [[Math.PI,Math.PI*1.33,'#d9472b'],[Math.PI*1.33,Math.PI*1.66,'#ffd34d'],[Math.PI*1.66,Math.PI*2,'#2fae4e']]){g.strokeStyle=c;g.beginPath();g.arc(0,0,330,a0+.03,a1-.03);g.stroke();}
    const a=Math.PI+Math.PI*(.12+.8*v)+Math.sin(t*14)*.02;g.strokeStyle='#fff';g.lineWidth=14;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*280,Math.sin(a)*280);g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(0,0,26,0,7);g.fill();
    g.font='800 70px BS';g.textAlign='center';g.fillText('TRYING',0,120);g.restore();tag(540,330,'1 SLIP','#ff6b5e',72);if(u>1.4)tag(540,480,'= DAY "RUINED"','#ff6b5e',60);
    kev(860,1660,.55,{...C,face:u<1.6?'calm':'tired',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(7)){ // week grid: one red X, the rest blank and glowing
    const L=LN(7),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.0,1.08,u),540,1000);tsX_room(t);
    tsX_week(540,560,.98,{marks:{0:'x'},glow:.6*ss(.45,.7,u)*(.7+.3*Math.sin(t*4)),title:'THIS WEEK',col:'#e07b24'});
    if(u<.5)tag(190,820,'1 BOX','#ff6b5e',56);else tag(640,820,'6 STILL BLANK','#2fae4e',58);
    kev(540,1640,.85,{...C,face:u<.5?'tired':'grin',armL:[.1,.05],armR:u<.5?[.1,.05]:[2.6,.5]},t);}
  else{tsX_track(t,LN(8),'BACK ON TRACK','NEXT BOX: DONE',{shirt:'#e07b24'});}
  g.restore();vignette(.6);
  if(t<END)caption(t);endCard(t,END);}

// ---------------- shared props for ts04-ts07 ----------------
function tsX_cu(t,L,C,stampTxt,col,size=90){const u=t-L.s;window.CAPY=1720;cam(2.1,540,1000);tsX_room(t);kev(540,1600,1,{...C,face:u<1.2?'calm':'smug',talk:talkAmt(1,t)*.6,armL:[.1,.05],armR:[.1,.05]},t);
  g.restore();g.save();tsX_stamp(540,330,stampTxt,col,ss(.9,1.4,u),-.08,size);}
function tsX_card(x,y,s,n,pre,fill,label,col='#7b4fd6'){ // loyalty card: n slots, pre pre-stamped, fill extra stamped (float)
  g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.roundRect(-392,-182,800,380,30);g.fill();
  g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-400,-190,800,380,30);g.fill();g.stroke();
  g.fillStyle=col;g.beginPath();g.roundRect(-400,-190,800,80,[30,30,0,0]);g.fill();g.fillStyle='#fff';g.font='800 50px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(label,0,-150);
  const cols=5,rows=Math.ceil(n/cols);for(let i=0;i<n;i++){const cx=-300+(i%cols)*150,cy=(rows===1?40:-20+Math.floor(i/cols)*120);
    g.strokeStyle='#bbb';g.lineWidth=5;g.setLineDash([10,8]);g.beginPath();g.arc(cx,cy,44,0,7);g.stroke();g.setLineDash([]);
    const on=i<pre?1:Math.max(0,Math.min(1,fill-(i-pre)));if(on>0){g.save();g.translate(cx,cy);g.scale(on,on);g.fillStyle=i<pre?'#ffd34d':'#2fae4e';g.beginPath();g.arc(0,0,40,0,7);g.fill();
      g.strokeStyle='#fff';g.lineWidth=9;g.lineCap='round';g.beginPath();g.moveTo(-16,2);g.lineTo(-4,16);g.lineTo(18,-12);g.stroke();g.restore();}}
  g.restore();}
function tsX_car(x,y,s,t){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#d94f8a';g.strokeStyle=INK;g.lineWidth=9;
  g.beginPath();g.roundRect(-260,-90,520,120,30);g.fill();g.stroke();g.beginPath();g.moveTo(-150,-90);g.lineTo(-90,-180);g.lineTo(110,-180);g.lineTo(170,-90);g.closePath();g.fill();g.stroke();
  g.fillStyle='#9fd8ff';g.beginPath();g.moveTo(-120,-98);g.lineTo(-80,-160);g.lineTo(0,-160);g.lineTo(0,-98);g.closePath();g.fill();g.beginPath();g.moveTo(20,-98);g.lineTo(20,-160);g.lineTo(100,-160);g.lineTo(140,-98);g.closePath();g.fill();
  g.fillStyle='#222';for(const wx of[-150,150]){g.beginPath();g.arc(wx,40,55,0,7);g.fill();g.stroke();g.fillStyle='#bbb';g.beginPath();g.arc(wx,40,20,0,7);g.fill();g.fillStyle='#222';}
  const r=R(7);for(let i=0;i<14;i++){const bx=-280+r()*560,by=-220+r()*200+Math.sin(t*3+i)*12,br=14+r()*22;g.strokeStyle='rgba(255,255,255,.85)';g.lineWidth=4;g.beginPath();g.arc(bx,by,br,0,7);g.stroke();}
  g.restore();}
function tsX_gauge(x,y,v,t,label){g.save();g.translate(x,y);g.lineWidth=50;g.lineCap='round';for(const [a0,a1,c] of [[Math.PI,Math.PI*1.33,'#d9472b'],[Math.PI*1.33,Math.PI*1.66,'#ffd34d'],[Math.PI*1.66,Math.PI*2,'#2fae4e']]){g.strokeStyle=c;g.beginPath();g.arc(0,0,300,a0+.03,a1-.03);g.stroke();}
  const a=Math.PI+Math.PI*(.1+.8*v)+Math.sin(t*14)*.015;g.strokeStyle='#fff';g.lineWidth=14;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*250,Math.sin(a)*250);g.stroke();g.fillStyle='#fff';g.beginPath();g.arc(0,0,26,0,7);g.fill();
  g.font='800 66px BS';g.textAlign='center';g.textBaseline='alphabetic';g.fillText(label,0,110);g.restore();}
function tsX_mtn(x,y,s,t,o={}){ // goal mountain with flag; o.rock draws an obstacle boulder on the path
  g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#4a5d7a';g.strokeStyle=INK;g.lineWidth=9;g.beginPath();g.moveTo(-420,200);g.lineTo(0,-330);g.lineTo(420,200);g.closePath();g.fill();g.stroke();
  g.fillStyle='#fff';g.beginPath();g.moveTo(-95,-210);g.lineTo(0,-330);g.lineTo(95,-210);g.lineTo(40,-235);g.lineTo(0,-200);g.lineTo(-40,-235);g.closePath();g.fill();
  g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.moveTo(0,-330);g.lineTo(0,-450);g.stroke();g.fillStyle='#ffd34d';g.beginPath();g.moveTo(0,-450);g.lineTo(110+Math.sin(t*6)*8,-420);g.lineTo(0,-390);g.fill();g.stroke();
  g.strokeStyle='rgba(255,255,255,.6)';g.lineWidth=8;g.setLineDash([18,16]);g.beginPath();g.moveTo(-300,190);g.quadraticCurveTo(-60,60,-120,-60);g.quadraticCurveTo(-170,-160,0,-320);g.stroke();g.setLineDash([]);
  if(o.rock){const a=o.rock;g.save();g.translate(-110,-40);g.scale(a,a);g.fillStyle='#7a6a5a';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.moveTo(-90,40);g.lineTo(-70,-40);g.lineTo(-10,-75);g.lineTo(70,-50);g.lineTo(95,40);g.closePath();g.fill();g.stroke();g.restore();}
  g.restore();}
function tsX_bubble(x,y,r,a,draw){if(a<=0)return;g.save();g.globalAlpha=a;g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.ellipse(x,y,r,r*.8,0,0,7);g.fill();g.stroke();
  for(const [dx,dy,rr] of [[-r*.55,r*.95,26],[-r*.8,r*1.25,16]]){g.beginPath();g.arc(x+dx,y+dy,rr,0,7);g.fill();g.stroke();}g.save();g.beginPath();g.ellipse(x,y,r-8,r*.8-8,0,0,7);g.clip();draw();g.restore();g.restore();}

// ---------------- ts04: the bedtime to-do list (Scullin et al. 2018) ----------------
function ts04(t){T0=t;window.PROD='LIFE RESET PLANNER';window.PTITLE='TOMORROW';window.PCOL='#5b6fd6';window.ENDCHAR={...tsX_C,shirt:'#5b6fd6'};const last=TL.lines.length-1,END=LN(last).e+.35;
  const C={...tsX_C,shirt:'#5b6fd6'};
  g.save();
  if(sh(0)){ // awake in bed, tomorrow's tasks pop above her
    const L=LN(0),u=t-L.s;window.CAPY=1560;cam(lerp(1.35,1.5,ss(L.s,L.e,t)),560,960);bedroom(t,{txt:'11:52'});bed(540,1180);
    kev(540,1240,1,{...C,face:u<1?'calm':'tired',legs:false,armL:[.5,.4],armR:[.5,.4],blink:blinkAt(t)},t);bedFront(540,1180,-120);
    [['9 AM CALL',330,520],['GROCERIES',760,500],['EMAIL BOSS',330,660],['PAY RENT',760,640]].forEach(([s,x,y],i)=>{if(u>.5+i*.55)tag(x,y,s,'#ffe27a',50);});}
  else if(sh(1)){tsX_cu(t,LN(1),C,'UNWRITTEN LIST','#ffd34d',84);}
  else if(sh(2)){ // 5-minute timer + planner
    const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);tsX_room(t);
    kev(300,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(690,1180,.78,t,{title:'TOMORROW',checked:0,col:'#5b6fd6'});
    g.save();g.translate(690,420);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=9;g.beginPath();g.arc(0,0,120,0,7);g.fill();g.stroke();g.fillStyle='#5b6fd6';g.beginPath();g.moveTo(0,0);g.arc(0,0,104,-Math.PI/2,-Math.PI/2+Math.PI*2*u);g.closePath();g.fill();
    g.fillStyle=INK;g.font='800 58px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('5 MIN',0,180);g.restore();}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    tsX_dive(t,u,'INSIDE TASHA',()=>{tsX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // evidence board
    const L=LN(4),u=ss(L.s,L.e-.3,t);window.CAPY=1740;cam(lerp(1.06,1.12,u),540,lerp(880,1000,u));
    tsX_board(t,u,[{x:300,y:430,a:-.06,t1:'2018',t2:'sleep lab study',ic:tsX_ic.lab},{x:780,y:700,a:.05,t1:'57',t2:'young adults',ic:tsX_ic.up},{x:320,y:1040,a:.04,t1:'5 MIN',t2:'of writing',ic:tsX_ic.cal},{x:770,y:1330,a:-.05,t1:'BEDTIME',t2:'then lights out',ic:tsX_ic.cup}]);}
  else if(sh(5)){ // two notebooks: DONE list vs TO-DO list
    const L=LN(5),w=L.words,u=t-L.s;window.CAPY=1760;tsX_dark(t);const half=t>w[8].s;
    const pad=(x,ttl,col,on,rows)=>{g.save();g.translate(x,820);g.globalAlpha=.35+.65*on;g.rotate(x<540?-.04:.04);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.fillRect(-210,-300,420,600);g.strokeRect(-210,-300,420,600);
      g.fillStyle=col;g.fillRect(-210,-300,420,90);g.fillStyle='#fff';g.font='800 54px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(ttl,0,-255);
      g.textAlign='left';g.font='800 40px BS';g.fillStyle=INK;rows.forEach((r,i)=>g.fillText(r,-180,-140+i*110));g.restore();};
    pad(300,'DONE',  '#7a8aa8',half?.4:1,['✓ laundry','✓ emails','✓ gym']);pad(780,'TO-DO','#5b6fd6',half?1:.3,['☐ call bank','☐ buy milk','☐ draft essay']);
    kev(540,1660,.55,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(6)){ // time-to-sleep bars
    const L=LN(6),u=t-L.s;window.CAPY=1740;tsX_dark(t);tag(540,250,'TIME TO FALL ASLEEP','#9fd8ff',62);const p=ss(.3,2.0,u);
    tsX_bar(640,25*p,30,'#7a8aa8','DONE LIST','');tsX_bar(1000,16*p,30,'#5b6fd6','TO-DO LIST','');if(u>2.0)tag(540,1260,'~9 MIN FASTER','#2fae4e',70);
    kev(540,1680,.5,{...C,face:u<2?'calm':'grin',armL:[.1,.05],armR:u<2?[.1,.05]:[2.6,.5]},t);}
  else if(sh(7)){ // asleep, specific list
    const L=LN(7),u=ss(L.s,L.e,t);window.CAPY=1560;cam(lerp(1.35,1.45,u),560,960);bedroom(t,{txt:'11:59'});bed(540,1180);
    kev(540,1270,1,{...C,face:u<.4?'calm':'sleep',legs:false,armL:[.5,.4],armR:[.5,.4],tilt:-.2*ss(.4,.65,u)},t);bedFront(540,1180,-100);if(u>.5)zzz(680,820,t);if(u>.15)tag(540,380,'SPECIFIC = FASTER','#2fae4e',62);}
  else{tsX_track(t,LN(8),'TOMORROW','MIND: PARKED ✓',{shirt:'#5b6fd6'});}
  g.restore();vignette(.6);
  if(t<END)caption(t);endCard(t,END);}

// ---------------- ts05: the endowed progress effect (Nunes & Dreze 2006) ----------------
function ts05(t){T0=t;window.PROD='LIFE RESET PLANNER';window.PTITLE='FRESH WEEK';window.PCOL='#7b4fd6';window.ENDCHAR={...tsX_C,shirt:'#7b4fd6'};const last=TL.lines.length-1,END=LN(last).e+.35;
  const C={...tsX_C,shirt:'#7b4fd6'};
  g.save();
  if(sh(0)){ // empty card vs half-full card
    const L=LN(0),u=t-L.s;window.CAPY=1760;cam(1.04,540,1000);tsX_room(t);
    tsX_card(540,470,.95,10,0,0,'EMPTY');if(u>1.1)tsX_card(540,950,.95,10,5,0,'HALF FULL');
    kev(540,1700,.62,{...C,face:u<1.4?'calm':'shock',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);}
  else if(sh(1)){tsX_cu(t,LN(1),C,'ENDOWED PROGRESS','#ffd34d',80);}
  else if(sh(2)){ // planner: checks off what she already did
    const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);tsX_room(t);
    kev(300,1620,.85,{...C,face:t>w[11].s?'grin':'tired',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(690,1180,.78,t,{title:'FRESH WEEK',checked:ss(w[11].s,L.e,t)*3,col:'#7b4fd6'});if(t<w[11].s)tag(620,330,'MESSY WEEK','#ff6b5e',62);else tag(620,330,'ALREADY DONE ✓','#2fae4e',62);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    tsX_dive(t,u,'INSIDE TASHA',()=>{tsX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // car wash + 8-stamp card
    const L=LN(4),w=L.words,u=t-L.s;window.CAPY=1760;tsX_dark(t,'#14202a');tag(540,230,'CAR WASH STUDY','#9fd8ff',66);tsX_car(540,620,1,t);
    if(t>w[9].s)tsX_card(540,1150,.95,8,0,0,'NEED 8','#7a8aa8');}
  else if(sh(5)){ // 10-stamp card with 2 pre-stamped
    const L=LN(5),u=t-L.s;window.CAPY=1760;tsX_dark(t,'#14202a');tsX_card(540,500,.95,8,0,0,'NEED 8','#7a8aa8');
    tsX_card(540,980,.95,10,u>1.2?2:0,0,'NEED 10','#7b4fd6');if(u>2.4)tag(540,1330,'SAME 8 TO GO','#ffe27a',66);}
  else if(sh(6)){ // finish rate bars
    const L=LN(6),w=L.words;window.CAPY=1720;tsX_dark(t);tag(540,250,'FINISHED THE CARD','#9fd8ff',62);
    const a=ss(L.s+.2,L.s+1.6,t)*19,b=ss(w[6].s,L.e-.4,t)*34;tsX_bar(640,a,40,'#7a8aa8','BLANK CARD',a>1?'~'+Math.round(a)+'%':'');
    if(t>w[6].s-.1)tsX_bar(1000,b,40,'#7b4fd6','HEAD START',b>1?'~'+Math.round(b)+'%':'');kev(540,1660,.55,{...C,face:t<L.e-.6?'calm':'grin',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(7)){ // X-ray: progress ring fills, finish line closer
    const L=LN(7),u=t-L.s;window.CAPY=1720;xrayRoom(t);g.save();cam(1.5,540,1000);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.4+.4*ss(.5,2.5,u)},t);g.restore();
    const p=.2+.55*ss(.4,2.6,u);g.save();g.translate(540,450);g.lineWidth=34;g.strokeStyle='#262a36';g.beginPath();g.arc(0,0,170,0,7);g.stroke();g.strokeStyle='#ffd34d';g.lineCap='round';g.beginPath();g.arc(0,0,170,-Math.PI/2,-Math.PI/2+Math.PI*2*p);g.stroke();
    g.fillStyle='#fff';g.font='800 80px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(Math.round(p*100)+'%',0,0);g.restore();if(u>2.2)tag(540,190,'FINISH LINE: CLOSER','#2fae4e',58);}
  else{tsX_track(t,LN(8),'FRESH WEEK','WINS COUNTED ✓',{shirt:'#7b4fd6'});}
  g.restore();vignette(.6);
  if(t<END)caption(t);endCard(t,END);}

// ---------------- ts06: the progress principle (Amabile & Kramer) ----------------
function ts06(t){T0=t;window.PROD='LIFE RESET PLANNER';window.PTITLE='SMALL WINS';window.PCOL='#c9862a';window.ENDCHAR={...tsX_C,shirt:'#c9862a'};const last=TL.lines.length-1,END=LN(last).e+.35;
  const C={...tsX_C,shirt:'#c9862a'};
  g.save();
  if(sh(0)){ // week strip fills with checks, Tasha wonders
    const L=LN(0),u=t-L.s;window.CAPY=1760;cam(1.04,540,1000);tsX_room(t);const m={};for(let i=0;i<7;i++)if(u>.3+i*.22)m[i]='v';
    tsX_week(540,540,.95,{marks:m,title:'A GOOD WEEK',col:'#c9862a'});if(u>1.8)tag(540,880,'WHY?','#ffe27a',80);
    kev(540,1660,.85,{...C,face:u<1.6?'grin':'calm',armL:[.1,.05],armR:u<1.6?[2.6,.5]:[.1,.05],blink:blinkAt(t)},t);}
  else if(sh(1)){ // trophy shrinks to a tiny check
    const L=LN(1),w=L.words,u=t-L.s;window.CAPY=1720;cam(2.1,540,1000);tsX_room(t);kev(540,1600,1,{...C,face:u<1.2?'calm':'smug',talk:talkAmt(1,t)*.6,armL:[.1,.05],armR:[.1,.05]},t);
    g.restore();g.save();const sm=ss(w[5].s,w[5].s+.8,t);if(sm<1){g.save();g.translate(540,360);g.scale(1-sm,1-sm);g.fillStyle='#ffd34d';g.strokeStyle=INK;g.lineWidth=9;g.beginPath();g.moveTo(-110,-120);g.lineTo(110,-120);g.lineTo(70,40);g.lineTo(-70,40);g.closePath();g.fill();g.stroke();g.fillRect(-20,40,40,70);g.strokeRect(-20,40,40,70);g.fillRect(-80,110,160,30);g.strokeRect(-80,110,160,30);g.restore();}
    if(sm>.5)tsX_stamp(540,360,'SMALLER ✓','#2fae4e',ss(.5,1,sm),-.08,100);}
  else if(sh(2)){ // Sunday planner, wins being checked
    const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);tsX_room(t);
    kev(300,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(690,1180,.78,t,{title:'SMALL WINS',checked:ss(.25,1,u)*3,col:'#c9862a'});tag(620,330,'SUNDAY','#ffe27a',66);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    tsX_dive(t,u,'INSIDE TASHA',()=>{tsX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // evidence board: the diary study
    const L=LN(4),u=ss(L.s,L.e-.3,t);window.CAPY=1740;cam(lerp(1.06,1.12,u),540,lerp(880,1000,u));
    tsX_board(t,u,[{x:300,y:430,a:-.06,t1:'HARVARD',t2:'researchers',ic:tsX_ic.lab},{x:780,y:700,a:.05,t1:'~12,000',t2:'diary entries',ic:tsX_ic.cal},{x:320,y:1040,a:.04,t1:'238',t2:'workers',ic:tsX_ic.up},{x:770,y:1330,a:-.05,t1:'EVERY DAY',t2:'how did it go?',ic:tsX_ic.cup}]);}
  else if(sh(5)){ // X-ray: good-day meter rises with PROGRESS
    const L=LN(5),u=t-L.s;window.CAPY=1720;xrayRoom(t);g.save();cam(1.5,540,1000);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.3+.6*ss(1,3.5,u)},t);g.restore();
    tag(540,240,'#1 BOOST: PROGRESS','#ffe27a',64);const f=.25+.65*ss(1,3.5,u)+.03*Math.sin(t*5);g.save();g.translate(540,440);g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=6;g.beginPath();g.roundRect(-360,-40,720,80,40);g.fill();g.stroke();
    g.fillStyle=f>.5?'#2fae4e':'#ffd34d';g.beginPath();g.roundRect(-350,-30,700*f,60,30);g.fill();g.fillStyle='#fff';g.font='800 44px BS';g.textAlign='center';g.fillText('GOOD DAY',0,-60);g.restore();}
  else if(sh(6)){ // 4 best days, 3 with progress
    const L=LN(6),w=L.words,u=t-L.s;window.CAPY=1760;tsX_dark(t);tag(540,300,'BEST DAYS','#9fd8ff',72);
    for(let i=0;i<4;i++){const x=195+i*230,y=760,a=ss(.3+i*.2,.6+i*.2,u);if(a<=0)continue;g.save();g.translate(x,y);g.scale(a,a);g.fillStyle='#ffd34d';g.strokeStyle=INK;g.lineWidth=7;
      for(let k=0;k<8;k++){g.save();g.rotate(k*Math.PI/4+t*.4);g.fillRect(-8,-115,16,34);g.restore();}g.beginPath();g.arc(0,0,72,0,7);g.fill();g.stroke();
      if(i<3&&t>w[9].s+i*.2){g.strokeStyle='#2fae4e';g.lineWidth=14;g.lineCap='round';g.beginPath();g.moveTo(-28,0);g.lineTo(-6,24);g.lineTo(32,-26);g.stroke();}g.restore();}
    if(t>w[9].s+.8)tag(540,1020,'~3 OUT OF 4','#2fae4e',72);if(t>w[9].s+1.2)tag(540,1160,'HAD SOME PROGRESS','#e8e2d4',50);kev(540,1680,.5,{...C,face:'grin',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(7)){ // wins drift away unless written
    const L=LN(7),u=t-L.s;window.CAPY=1760;cam(1.04,540,1000);tsX_room(t);const wins=[['SENT IT',260,380],['FIXED IT',800,330],['10 MIN WALK',300,620],['CALLED BACK',790,600]];
    wins.forEach(([s,x,y],i)=>{const a=ss(.2+i*.2,.5+i*.2,u)*(1-ss(1.8,2.8,u));if(a<=0)return;g.save();g.globalAlpha=a;tag(x,y-ss(1.8,2.8,u)*120,s,'#ffe27a',50);g.restore();});
    if(u>2.6)tag(540,500,'EASY TO MISS','#ff6b5e',70);kev(540,1640,.85,{...C,face:u<2.6?'calm':'shock',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);}
  else{tsX_track(t,LN(8),'SMALL WINS','WINS THIS WEEK: 3',{shirt:'#c9862a'});}
  g.restore();vignette(.6);
  if(t<END)caption(t);endCard(t,END);}

// ---------------- ts07: mental contrasting (Oettingen) ----------------
function ts07(t){T0=t;window.PROD='LIFE RESET PLANNER';window.PTITLE='MY GOAL';window.PCOL='#3a8fd0';window.ENDCHAR={...tsX_C,shirt:'#3a8fd0'};const last=TL.lines.length-1,END=LN(last).e+.35;
  const C={...tsX_C,shirt:'#3a8fd0'};
  g.save();
  if(sh(0)){ // daydream bubble: summit + flag
    const L=LN(0),u=t-L.s;window.CAPY=1760;cam(1.05,540,1050);tsX_room(t);
    kev(400,1640,.85,{...C,face:'grin',armL:[.1,.05],armR:[.1,.05],tilt:.08,blink:blinkAt(t)},t);
    tsX_bubble(660,520,280,ss(.2,.7,u),()=>{g.fillStyle='#bfe3ff';g.fillRect(380,240,560,560);tsX_mtn(660,600,.55,t);});}
  else if(sh(1)){tsX_cu(t,LN(1),C,'ALREADY ARRIVED?','#ffd34d',84);}
  else if(sh(2)){ // planner: goal + obstacle
    const L=LN(2),w=L.words,u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);tsX_room(t);
    kev(300,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);planner(690,1180,.78,t,{title:'MY GOAL',checked:ss(w[4].s,L.e,t)*2,col:'#3a8fd0'});
    if(t>w[4].s)tag(470,330,'GOAL','#2fae4e',64);if(t>w[7].s)tag(800,330,'OBSTACLE','#ff6b5e',64);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    tsX_dive(t,u,'INSIDE TASHA',()=>{tsX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // energy gauge drops while picturing the perfect outcome
    const L=LN(4),u=t-L.s;window.CAPY=1760;tsX_dark(t);tag(540,250,'NYU EXPERIMENTS','#9fd8ff',64);
    tsX_bubble(540,560,200,ss(.2,.6,u),()=>{g.fillStyle='#bfe3ff';g.fillRect(340,380,400,400);tsX_mtn(540,630,.4,t);});
    tsX_gauge(540,1180,.85-.6*ss(2.2,4.2,u),t,'ENERGY');if(u>4)tag(540,1390,'LESS ENERGY','#ff6b5e',60);}
  else if(sh(5)){ // X-ray: brain gets a taste of the win, sparkles
    const L=LN(5),u=t-L.s;window.CAPY=1720;xrayRoom(t);g.save();cam(1.5,540,1000);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.8},t);g.restore();
    const r=R(5);for(let i=0;i<16;i++){const a=(t*1.3+i)%1;g.fillStyle=`rgba(255,226,122,${1-a})`;g.beginPath();g.arc(200+r()*680,700-a*300+r()*200,6+r()*8,0,7);g.fill();}
    tag(540,260,'TASTE OF THE WIN 🏆','#ffe27a',62);if(u>1.8)tag(540,420,'WORK DONE: 0','#ff6b5e',62);}
  else if(sh(6)){ // mountain + obstacle rock
    const L=LN(6),w=L.words,u=t-L.s;window.CAPY=1760;tsX_dark(t,'#16202e');const rk=ss(w[13].s,w[13].s+.5,t);
    tsX_mtn(540,980,1.05,t,{rock:rk});if(u>.3)tag(540,240,'MENTAL CONTRASTING','#9fd8ff',62);if(t>w[10].s)tag(780,420,'GOAL','#2fae4e',58);if(rk>.5)tag(260,880,'OBSTACLE','#ff6b5e',58);
    kev(860,1680,.5,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(7)){ // IF -> THEN plan card
    const L=LN(7),u=ss(L.s,L.e,t);window.CAPY=1740;tsX_dark(t,'#16202e');
    g.save();g.translate(540,860);g.rotate(-.03);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.fillRect(-400,-300,800,600);g.strokeRect(-400,-300,800,600);
    g.fillStyle='#3a8fd0';g.fillRect(-400,-300,800,90);g.fillStyle='#fff';g.font='800 58px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('THE PLAN',0,-255);
    g.textAlign='left';g.font='800 58px BS';const rows=[['IF:','TOO TIRED','#d9472b'],['THEN:','JUST 10 MIN','#2fae4e']];rows.forEach(([a,b,c],i)=>{const p=ss(.1+i*.3,.35+i*.3,u);if(p<=0)return;g.save();g.beginPath();g.rect(-360,-120+i*220-60,720*p,130);g.clip();g.fillStyle=c;g.fillText(a,-350,-100+i*220);g.fillStyle=INK;g.fillText(b,-130,-100+i*220);g.restore();});g.restore();
    if(u>.8)tag(540,1400,'SNAG: PLANNED ✓','#2fae4e',62);}
  else{tsX_track(t,LN(8),'MY GOAL','PLAN: READY ✓',{shirt:'#3a8fd0'});}
  g.restore();vignette(.6);
  if(t<END)caption(t);endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{ts01,ts02,ts03,ts04,ts05,ts06,ts07});
