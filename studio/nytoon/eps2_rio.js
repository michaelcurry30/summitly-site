// RIO channel episodes (toon2 v2 style). Add function <id>(t){...} and register below.
// What If Daily · RIO · "What if you…?" money + habit maths. RIO-only props are prefixed roX_ so they never collide with other channels.
const roX_C=CAST.RIO;
function roX_room(t,night){ // cosy plum room: panelled wall, shelf with plant, window, wood floor, hanging bulb
  g.fillStyle=night?'#191530':'#2a2148';g.fillRect(-600,-800,W+1200,1800);
  g.save();g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=5;for(let x=-40;x<W;x+=210)g.strokeRect(x+30,300,160,540);g.restore();
  g.fillStyle='#5a3a22';g.fillRect(-600,990,W+1200,H);g.save();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=4;for(let i=0;i<14;i++){const y=990+i*i*6;g.beginPath();g.moveTo(-600,y);g.lineTo(W+600,y);g.stroke();}g.restore();
  g.fillStyle='#1a120b';g.fillRect(-600,976,W+1200,22);
  // shelf + plant (left)
  g.save();g.translate(170,560);g.fillStyle='#6b4325';g.strokeStyle=INK;g.lineWidth=8;g.fillRect(-130,0,260,22);g.strokeRect(-130,0,260,22);
  g.fillStyle='#c96f3b';g.beginPath();g.moveTo(-90,0);g.lineTo(-40,0);g.lineTo(-48,-60);g.lineTo(-82,-60);g.closePath();g.fill();g.stroke();
  g.fillStyle='#3f9b57';for(const [a,l] of [[-.5,70],[0,90],[.5,70]]){g.save();g.translate(-65,-60);g.rotate(a);g.beginPath();g.ellipse(0,-l/2,16,l/2,0,0,7);g.fill();g.stroke();g.restore();}
  g.fillStyle='#e9c25a';for(let i=0;i<3;i++){g.beginPath();g.ellipse(50,-14-i*14,32,10,0,0,7);g.fill();g.stroke();}g.restore();
  // window (right)
  g.save();g.translate(860,470);g.fillStyle=night?'#0b1424':'#9cc9e8';g.fillRect(-100,-140,200,280);if(night){g.fillStyle='#e9eef8';g.beginPath();g.arc(30,-50,30,0,7);g.fill();g.fillStyle='#0b1424';g.beginPath();g.arc(44,-60,26,0,7);g.fill();}
  g.strokeStyle='#5b3b22';g.lineWidth=14;g.strokeRect(-100,-140,200,280);g.lineWidth=8;g.beginPath();g.moveTo(0,-140);g.lineTo(0,140);g.moveTo(-100,0);g.lineTo(100,0);g.stroke();g.restore();
  g.strokeStyle='#111';g.lineWidth=4;g.beginPath();g.moveTo(540,-800);g.lineTo(540,150);g.stroke();g.fillStyle='#ffe9b0';g.shadowColor='#ffd27a';g.shadowBlur=60;g.beginPath();g.arc(540,170,24,0,7);g.fill();g.shadowBlur=0;
  spot(540,880,780,night?.32:.45);}
function roX_dark(t,col='#15131f'){g.fillStyle=col;g.fillRect(0,0,W,H);spot(540,900,900,.22);}
function roX_stamp(x,y,txt,col,u,rot=-.12,size=130){if(u<=0)return;g.save();g.translate(x,y);g.rotate(rot);const sc=lerp(2.2,1,ss(0,1,u));g.scale(sc,sc);g.globalAlpha=ss(0,.4,u);
  g.font=`800 ${size}px BS`;g.textAlign='center';g.textBaseline='middle';const w=g.measureText(txt).width+60;g.strokeStyle=col;g.lineWidth=14;g.strokeRect(-w/2,-size*.63,w,size*1.26);g.fillStyle=col;g.fillText(txt,0,6);g.restore();}
function roX_dive(t,u,label,drawScene){ // camera pushes into head then flashes to X-ray
  if(u<.35){cam(lerp(1.1,3.0,ss(0,.35,u)),540,1500-560*.95);drawScene();g.restore();g.save();g.fillStyle=`rgba(140,210,255,${ss(.2,.35,u)})`;g.fillRect(0,0,W,H);}
  else{xrayRoom(t);cam(lerp(1.0,1.1,u),540,1050);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.5,.9,u)},t);tag(540,260,label,'#9fd8ff',70);
    g.restore();g.save();g.fillStyle=`rgba(200,235,255,${1-ss(.35,.5,u)})`;g.fillRect(0,0,W,H);}}
function roX_closeup(t,L,C,face2,at=1.1,night){const u=t-L.s;window.CAPY=1720;cam(2.1,540,1000);roX_room(t,night);kev(540,1600,1,{...C,face:u<at?'calm':face2,talk:talkAmt(TL.lines.indexOf(L),t)*.6,armL:[.1,.05],armR:[.1,.05]},t);return u;}
function roX_track(t,L,C,title,col,streakTxt,night){const u=ss(L.s,L.e,t);window.CAPY=1720;cam(lerp(1.05,1.14,u),560,1050);roX_room(t,night);
  kev(300,1620,.85,{...C,face:'grin',armL:[.2,.15],armR:[1.4,.5]},t);planner(690,1180,.78,t,{title,checked:3+ss(L.s+.4,L.s+1.4,t),col});
  if(t>L.s+1.2)tag(690,760,streakTxt,'#2fae4e',58);}
function roX_wordAt(L,re){const i=L.words.findIndex(w=>re.test(w.w));return i>=0?L.words[i].s:L.s;}
function roX_bill(x,y,s,txt='$5',rot=0){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.fillStyle='#8fd18a';g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.roundRect(-130,-62,260,124,10);g.fill();g.stroke();
  g.strokeStyle='#3f7d3b';g.lineWidth=5;g.strokeRect(-112,-46,224,92);g.fillStyle='#d8f2d2';g.beginPath();g.ellipse(0,0,40,40,0,0,7);g.fill();g.stroke();
  g.fillStyle='#1f5a1c';g.font='800 56px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(txt,0,3);g.font='800 30px BS';g.fillText('5',-88,-24);g.fillText('5',88,26);g.restore();}
function roX_coin(x,y,r,a=1){g.save();g.globalAlpha=a;g.fillStyle='#f2c23a';g.strokeStyle='#8a6410';g.lineWidth=Math.max(2,r*.14);g.beginPath();g.arc(x,y,r,0,7);g.fill();g.stroke();
  g.fillStyle='#8a6410';g.font=`800 ${Math.round(r*1.2)}px BS`;g.textAlign='center';g.textBaseline='middle';g.fillText('$',x,y+r*.05);g.restore();}
function roX_jar(x,y,s,fill,t,o={}){ // glass jar; fill 0..1 of coins, o.sprout=extra glowing coins popping out
  g.save();g.translate(x,y);g.scale(s,s);const w=300,h=420;
  g.fillStyle='rgba(200,230,255,.14)';g.strokeStyle='#e8f4ff';g.lineWidth=9;g.beginPath();g.roundRect(-w/2,-h,w,h,50);g.fill();
  g.save();g.beginPath();g.roundRect(-w/2+8,-h+8,w-16,h-16,44);g.clip();const top=-16-(h-40)*fill;const r=R(41);
  for(let yy=-30;yy>top;yy-=26)for(let xx=-w/2+30;xx<w/2-10;xx+=40)roX_coin(xx+((yy/26)%2?20:0)+r()*6,yy,22);g.restore();
  g.beginPath();g.roundRect(-w/2,-h,w,h,50);g.stroke();g.fillStyle='#b88a4a';g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.roundRect(-w/2+20,-h-46,w-40,52,10);g.fill();g.stroke();
  g.fillStyle='rgba(255,255,255,.25)';g.fillRect(-w/2+26,-h+40,20,h-90);
  if(o.sprout){const r2=R(77);for(let i=0;i<14;i++){const ph=(t*.7+r2())%1,a=o.sprout*Math.sin(ph*Math.PI);const ang=-Math.PI/2+(r2()-.5)*1.8;roX_coin(Math.cos(ang)*ph*260,-h-40+Math.sin(ang)*ph*300,18,a);}}
  g.restore();}
function roX_board(t,u,cards){ // cork evidence board; cards [{x,y,a,t1,t2,ic}] ic(t) draws an icon around (0,-55)
  g.fillStyle='#a0703f';g.fillRect(0,0,W,H);const r=R(31);g.save();for(let i=0;i<2600;i++){g.fillStyle=r()<.5?'rgba(80,45,15,.25)':'rgba(255,220,170,.12)';g.fillRect(r()*W,r()*H,3+r()*4,3+r()*4);}g.restore();
  const k=cards.length,step=1/(k+.4),shown=n=>ss(n*step,n*step+.12,u);
  g.save();g.strokeStyle='#c4161c';g.lineWidth=6;for(let i=0;i<k-1;i++){const a=cards[i],b=cards[i+1],p=ss(i*step+.1,i*step+step,u);if(p<=0)continue;g.beginPath();g.moveTo(a.x,a.y-120);g.lineTo(lerp(a.x,b.x,p),lerp(a.y-120,b.y-120,p));g.stroke();}g.restore();
  cards.forEach((c,i)=>{const a=shown(i);if(a<=0)return;g.save();g.translate(c.x,c.y);g.rotate(c.a);g.scale(.7+.3*a,.7+.3*a);g.globalAlpha=a;
    g.fillStyle='rgba(0,0,0,.3)';g.fillRect(-176,-136,360,300);g.fillStyle='#f3e7cf';g.fillRect(-180,-145,360,300);g.strokeStyle=INK;g.fillStyle=INK;g.lineWidth=8;if(c.ic)c.ic(t);
    g.fillStyle=INK;g.font='800 52px BS';g.textAlign='center';g.textBaseline='alphabetic';g.fillText(c.t1,0,70);g.font='600 34px HG';g.fillStyle='#5b4632';g.fillText(c.t2,0,118);
    g.fillStyle='#c4161c';g.beginPath();g.arc(0,-125,14,0,7);g.fill();g.restore();});}
const roX_ic={
  coin:t=>roX_coin(0,-62,48),
  bill:t=>roX_bill(0,-62,.55),
  clock:t=>{g.beginPath();g.arc(0,-62,50,0,7);g.stroke();g.beginPath();g.moveTo(0,-62);g.lineTo(0,-98);g.moveTo(0,-62);g.lineTo(26,-50);g.stroke();},
  up:t=>{g.beginPath();g.moveTo(-70,-20);g.lineTo(-20,-55);g.lineTo(10,-40);g.lineTo(70,-108);g.stroke();g.beginPath();g.moveTo(70,-108);g.lineTo(40,-104);g.moveTo(70,-108);g.lineTo(66,-78);g.stroke();},
  book:t=>{g.fillStyle='#3b7dd8';g.fillRect(-60,-110,120,90);g.strokeRect(-60,-110,120,90);g.fillStyle='#fbf8f1';g.fillRect(-52,-34,104,10);},
  cal:t=>{g.fillStyle='#fbf8f1';g.fillRect(-60,-110,120,96);g.strokeRect(-60,-110,120,96);g.fillStyle='#d9472b';g.fillRect(-60,-110,120,26);g.strokeStyle='#2fae4e';g.lineWidth=10;g.beginPath();g.moveTo(-26,-52);g.lineTo(-6,-32);g.lineTo(30,-74);g.stroke();},
  check:t=>{g.strokeStyle='#2fae4e';g.lineWidth=16;g.beginPath();g.moveTo(-50,-70);g.lineTo(-10,-30);g.lineTo(55,-110);g.stroke();}};
function roX_bar(y,len,max,col,label,valTxt){const x0=120,w=840*len/max;g.save();g.fillStyle='#262a36';g.strokeStyle='#e8e2d4';g.lineWidth=6;g.beginPath();g.roundRect(x0,y-50,840,100,20);g.fill();g.stroke();
  if(w>4){g.fillStyle=col;g.beginPath();g.roundRect(x0+8,y-42,Math.max(10,w-16),84,14);g.fill();}g.fillStyle='#e8e2d4';g.font='800 50px BS';g.textAlign='left';g.fillText(label,x0,y-80);
  if(valTxt){g.textAlign='right';g.fillStyle=col;g.fillText(valTxt,x0+840,y-80);}g.restore();}
const roX_money=n=>'$'+Math.round(n).toLocaleString('en-US');

// ---------------- ro01: $5 a day for 30 years (compound growth maths, ~7%/yr assumed, not guaranteed) ----------------
function roX_growth(t,p,showGap){ // 30-year chart: what you put in (straight) vs total with ~7% growth (curve)
  const x0=150,y0=1330,w=820,h=820,M=175000,fv=y=>1825*((Math.pow(1.07,y)-1)/.07);
  g.save();g.strokeStyle='#e8e2d4';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x0,y0-h);g.lineTo(x0,y0);g.lineTo(x0+w,y0);g.stroke();
  g.fillStyle='#e8e2d4';g.font='800 44px BS';g.textAlign='center';g.fillText('YEARS →',x0+w/2,y0+80);for(const y of[10,20,30]){g.fillText(y,x0+w*y/30,y0+40);}
  const Y=p*30;if(showGap){g.fillStyle='rgba(242,194,58,.28)';g.beginPath();g.moveTo(x0,y0);for(let i=0;i<=120;i++){const yy=Y*i/120;g.lineTo(x0+w*yy/30,y0-h*fv(yy)/M);}for(let i=120;i>=0;i--){const yy=Y*i/120;g.lineTo(x0+w*yy/30,y0-h*1825*yy/M);}g.closePath();g.fill();}
  g.strokeStyle='#8fd18a';g.lineWidth=10;g.beginPath();g.moveTo(x0,y0);g.lineTo(x0+w*Y/30,y0-h*1825*Y/M);g.stroke();
  g.strokeStyle='#f2c23a';g.lineWidth=12;g.beginPath();for(let i=0;i<=120;i++){const yy=Y*i/120,px=x0+w*yy/30,py=y0-h*fv(yy)/M;i?g.lineTo(px,py):g.moveTo(px,py);}g.stroke();
  roX_coin(x0+w*Y/30,y0-h*fv(Y)/M,26);g.restore();return {fv:fv(Y),inn:1825*Y};}
function ro01(t){T0=t;window.PROD='MONEY MASTERY PLANNER';window.PTITLE='SAVINGS LOG';window.PCOL='#2f8f5b';const C={...roX_C,shirt:'#2f8f5b'};window.ENDCHAR=C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // Rio holds up a $5 bill
    const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(400,1640,.9,{...C,face:u<1.0?'calm':'smug',armL:[.1,.05],armR:[2.3,.3],blink:blinkAt(t)},t);
    roX_bill(660,lerp(820,760,ss(0,1,u)),.9,'$5',-.08+.04*Math.sin(t*3));if(u>.9)tag(660,580,'$5 / DAY','#8fd18a',80);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'smug',1.2);g.restore();g.save();
    if(u>1.2){const s=ss(1.2,2.4,u);g.save();g.fillStyle='#eef6ff';g.strokeStyle='#9fc6e8';g.lineWidth=8;g.beginPath();g.arc(lerp(160,900,s),1180-60*s,30+90*s,0,7);g.fill();g.stroke();g.restore();tag(540,300,'SNOWBALL','#9fd8ff',110);}}
  else if(sh(2)){ // logs it in the planner, $5 drops into the jar
    const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);roX_room(t);
    kev(280,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(640,1180,.74,t,{title:'SAVINGS LOG',checked:ss(L.s+.6,L.e-.5,t)*4,col:'#2f8f5b'});roX_jar(900,1500,.45,.15+.1*u,t);
    if(t>roX_wordAt(L,/^\$5/))tag(640,760,'+$5 TODAY','#8fd18a',62);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // jar fills over a year, counter to ~$1,800
    const L=LN(4),u=ss(L.s+.3,L.e-.3,t);window.CAPY=1720;roX_dark(t,'#16202a');cam(1.0,540,960);roX_jar(540,1400,1.5,u*.92,t);
    g.restore();g.save();const r=R(3);for(let i=0;i<5;i++){const ph=((t-L.s)*1.3+i/5)%1;roX_coin(400+r()*280,lerp(200,620,ph),26,Math.sin(ph*Math.PI)*(u<1?1:0));}
    tag(540,250,'DAY '+Math.round(365*u)+'  ·  '+roX_money(1825*u),'#8fd18a',72);}
  else if(sh(5)){ // money starts earning money: coins sprout from the jar
    const L=LN(5),u=t-L.s;window.CAPY=1720;roX_dark(t,'#16202a');roX_jar(540,1400,1.5,.92,t,{sprout:ss(.6,1.6,u)});
    tag(540,250,'~7% A YEAR','#f2c23a',90);if(u>1.6)tag(540,390,'NOT GUARANTEED','#ff8a7a',54);}
  else if(sh(6)){ // 30-year chart: what Rio put in vs total
    const L=LN(6),p=ss(L.s+.2,roX_wordAt(L,/^Only/)-.2,t);window.CAPY=1720;roX_dark(t);const v=roX_growth(t,p,t>roX_wordAt(L,/^Only/)-.4);
    tag(540,230,'TOTAL ≈ '+roX_money(Math.round(v.fv/1000)*1000),'#f2c23a',76);if(t>roX_wordAt(L,/^Only/)-.3)tag(540,380,'RIO PUT IN: '+roX_money(v.inn),'#8fd18a',60);
    kev(560,1700,.36,{...C,face:p>.8?'shock':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(7)){ // evidence board
    const L=LN(7),u=ss(L.s,L.e-.2,t);window.CAPY=1720;cam(lerp(1.06,1.12,u),540,lerp(820,980,u));
    roX_board(t,u,[{x:300,y:460,a:-.06,t1:'$5 / DAY',t2:'small on its own',ic:roX_ic.bill},{x:780,y:720,a:.05,t1:'~7% / YR',t2:'average, not promised',ic:roX_ic.up},{x:330,y:1080,a:.04,t1:'30 YEARS',t2:'the real ingredient',ic:roX_ic.clock}]);
    g.restore();g.save();roX_stamp(720,1330,'TIME','#c4161c',ss(.8,1,u),-.1,150);}
  else{roX_track(t,LN(8),C,'SAVINGS LOG','#2f8f5b','DAY 30 ✓ +$150');}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- ro02: forgotten subscriptions (C+R Research 2022: guessed ~$86/mo, actual ~$219/mo) ----------------
const roX_SUBS=[['STREAMING','#d9472b'],['MUSIC','#2fae4e'],['GYM','#e07b24'],['CLOUD','#3b7dd8'],['NEWS','#7d4cc2'],['GAMES','#d94f8a']];
function roX_subcard(x,y,s,name,col,price,a=1){g.save();g.globalAlpha=a;g.translate(x,y);g.scale(s,s);g.fillStyle='rgba(0,0,0,.3)';g.beginPath();g.roundRect(-146,-56,300,120,18);g.fill();
  g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.roundRect(-150,-60,300,120,18);g.fill();g.stroke();g.fillStyle=col;g.beginPath();g.arc(-95,0,30,0,7);g.fill();g.stroke();
  g.fillStyle=INK;g.font='800 40px BS';g.textAlign='left';g.textBaseline='middle';g.fillText(name,-52,-18);g.fillStyle='#5b4632';g.font='600 32px HG';g.fillText(price,-52,24);g.restore();}
function ro02(t){T0=t;window.PROD='MONEY MASTERY PLANNER';window.PTITLE='SUBSCRIPTIONS';window.PCOL='#d9472b';const C={...roX_C,shirt:'#d9472b'};window.ENDCHAR=C;const last=TL.lines.length-1,END=LN(last).e+.35;
  const prices=['$15.49/mo','$10.99/mo','$29.99/mo','$2.99/mo','$9.99/mo','$14.99/mo'];
  g.save();
  if(sh(0)){ // subscription cards float in around Rio
    const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.08,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(540,1660,.85,{...C,face:u<1.4?'calm':'shock',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);
    roX_SUBS.forEach(([n,c],i)=>{const a=ss(.3+i*.25,.6+i*.25,u);if(a>0)roX_subcard(i%2?820:260,520+Math.floor(i/2)*190+Math.sin(t*2+i)*8,.8,n,c,prices[i],a);});}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'shock',1.1);g.restore();g.save();
    if(u>1.1){tag(540,300,'A LEAK','#ff6b5e',110);const r=R(9);for(let i=0;i<6;i++){const ph=((t*.9)+i/6)%1;roX_coin(200+i*130,lerp(420,1000,ph),22,Math.sin(ph*Math.PI));}}}
  else if(sh(2)){ // the guess bar
    const L=LN(2),u=ss(roX_wordAt(L,/^\$86/)-.6,roX_wordAt(L,/^\$86/)+.4,t);window.CAPY=1720;roX_dark(t);tag(540,320,'2022 SURVEY','#9fd8ff',72);
    roX_bar(820,86*u,240,'#9fd8ff','THEY GUESSED',u>.9?'$86':'');kev(540,1600,.5,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);}
  else if(sh(3)){ // the real bar shoots past
    const L=LN(3),u=ss(roX_wordAt(L,/^About/)-.3,L.e,t);window.CAPY=1720;roX_dark(t);tag(540,320,'2022 SURVEY','#9fd8ff',72);
    roX_bar(820,86,240,'#9fd8ff','THEY GUESSED','$86');roX_bar(1080,219*u,240,'#ff6b5e','REALITY',u>.8?'$219':'');kev(540,1600,.5,{...C,face:u>.5?'shock':'calm',armL:u>.5?[2.4,.4]:[.1,.05],armR:u>.5?[2.4,.4]:[.1,.05]},t);}
  else if(sh(4)){const L=LN(4),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(5)){ // small charges slide past the brain and fade from view
    const L=LN(5),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(2.0,540,960);kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:0},t);g.restore();g.save();
    for(let i=0;i<4;i++){const ph=ss(.2+i*.9,1.6+i*.9,u);if(ph<=0||ph>=1)continue;const a=ph<.5?1:1-ss(.5,.9,ph);g.save();g.globalAlpha=a;tag(lerp(-150,1230,ph),520+i*60,prices[i],'#ffd34d',56);g.restore();}
    tag(540,260,'AUTOPAY','#9fd8ff',80);if(u>2.4)tag(540,1440,'BRAIN: "NOT COUNTED"','#ff8a7a',56);}
  else if(sh(6)){ // the gap: $133/mo → ~$1,600/yr
    const L=LN(6),u=ss(L.s+.3,roX_wordAt(L,/^Roughly/)-.2,t),v=ss(roX_wordAt(L,/^Roughly/)-.2,L.e-.3,t);window.CAPY=1720;roX_dark(t);
    roX_bar(760,219,240,'#ff6b5e','REALITY','$219');roX_bar(1000,86,240,'#9fd8ff','GUESS','$86');
    if(u>0){g.save();g.globalAlpha=u;g.strokeStyle='#ffd34d';g.lineWidth=8;g.setLineDash([18,12]);g.strokeRect(120+840*86/240,700,840*133/240,360);g.restore();tag(120+840*(86+66)/240,1140,'GAP ≈ $133 / MO','#ffd34d',58);}
    if(v>0)roX_stamp(540,420,'≈ '+roX_money(Math.round(16*v)*100)+' / YR','#ffd34d',v,-.08,110);}
  else if(sh(7)){ // planner list
    const L=LN(7),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);roX_room(t);
    kev(280,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(680,1150,.8,t,{title:'SUBSCRIPTIONS',n:6,checked:ss(roX_wordAt(L,/^writes/)-.2,L.e,t)*6,col:'#d9472b'});tag(680,720,'EVERY. SINGLE. ONE.','#ffd34d',56);}
  else{roX_track(t,LN(8),C,'SUBSCRIPTIONS','#d9472b','3 CANCELLED ✓');}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- ro03: 10 pages a day = 3,650 pages ≈ 12 books a year ----------------
function roX_book(x,y,s,col,open){g.save();g.translate(x,y);g.scale(s,s);g.strokeStyle=INK;g.lineWidth=7;
  if(open){g.fillStyle='#fbf8f1';g.beginPath();g.moveTo(0,-10);g.quadraticCurveTo(-80,-40,-160,-20);g.lineTo(-160,90);g.quadraticCurveTo(-80,70,0,100);g.quadraticCurveTo(80,70,160,90);g.lineTo(160,-20);g.quadraticCurveTo(80,-40,0,-10);g.closePath();g.fill();g.stroke();
    g.strokeStyle='#bbb';g.lineWidth=4;for(let i=0;i<4;i++){g.beginPath();g.moveTo(-140,10+i*18);g.lineTo(-20,16+i*18);g.moveTo(20,16+i*18);g.lineTo(140,10+i*18);g.stroke();}}
  else{g.fillStyle=col;g.beginPath();g.roundRect(-110,-20,220,70,10);g.fill();g.stroke();g.fillStyle='#fbf8f1';g.fillRect(-100,32,200,12);}
  g.restore();}
const roX_BC=['#d9472b','#3b7dd8','#ffd34d','#2fae4e','#7d4cc2','#e07b24','#d94f8a','#4fb3a0','#c96f3b','#5b8def','#2f8f5b','#e9c25a'];
function ro03(t){T0=t;window.PROD='DAILY HABIT BUILDER';window.PTITLE='READ 10 PAGES';window.PCOL='#3b7dd8';const C={...roX_C,shirt:'#3b7dd8'};window.ENDCHAR=C;const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // Rio with an open book
    const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t,true);
    kev(540,1640,.9,{...C,face:u<1.0?'calm':'smug',armL:[1.1,-.6],armR:[1.1,-.6],blink:blinkAt(t)},t);roX_book(540,1310,.75,'',true);
    if(u>.8)tag(540,620,'10 PAGES','#ffd34d',90);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'grin',1.2,true);g.restore();g.save();
    if(u>1.2){for(let i=0;i<12;i++){const a=ss(1.2+i*.06,1.35+i*.06,u);if(a>0){g.save();g.globalAlpha=a;g.fillStyle=roX_BC[i];g.strokeStyle=INK;g.lineWidth=5;g.fillRect(150+i*66,200-((i*7)%3)*12,56,170+((i*7)%3)*12);g.strokeRect(150+i*66,200-((i*7)%3)*12,56,170+((i*7)%3)*12);g.restore();}}
      g.fillStyle='#6b4325';g.fillRect(130,370,820,20);tag(540,470,'A WHOLE SHELF','#ffd34d',70);}}
  else if(sh(2)){ // reads, then ticks the planner
    const L=LN(2),u=ss(L.s,L.e,t),tick=roX_wordAt(L,/^ticks/);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);roX_room(t,true);
    kev(280,1620,.85,{...C,face:t<tick?'calm':'grin',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    if(t<tick){roX_book(620,1200,.8,'',true);tag(620,820,'PAGE '+Math.min(10,1+Math.floor((t-L.s)*3)),'#ffd34d',62);}
    else planner(680,1180,.78,t,{title:'READ 10 PAGES',checked:3+ss(tick,tick+.8,t),col:'#3b7dd8'});}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t,true);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){ // page tower counter to 3,650
    const L=LN(4),u=ss(L.s+.3,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#141a26');const n=Math.round(3650*u);
    g.save();const hgt=1000*u;g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=6;g.fillRect(380,1450-hgt,320,hgt);g.strokeRect(380,1450-hgt,320,hgt);g.strokeStyle='#cfc8b8';g.lineWidth=2;for(let y=1450-8;y>1450-hgt;y-=10){g.beginPath();g.moveTo(386,y);g.lineTo(694,y);g.stroke();}g.restore();
    tag(540,260,n.toLocaleString('en-US')+' PAGES','#ffd34d',90);tag(540,1560,'1 YEAR','#9fd8ff',60);kev(880,1640,.38,{...C,face:u>.8?'shock':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(5)){ // 12 books of ~300 pages stack up
    const L=LN(5),u=t-L.s;window.CAPY=1720;roX_dark(t,'#141a26');const k=Math.round(12*ss(.8,L.e-L.s-.4,u));
    for(let i=0;i<k;i++)roX_book(540+((i*37)%5-2)*14,1480-i*72,1.25,roX_BC[i],false);
    tag(540,260,'~300 PAGES EACH','#9fd8ff',66);tag(540,390,'≈ '+k+' BOOKS','#ffd34d',86);}
  else if(sh(6)){ // 12-month calendar, a book per month
    const L=LN(6),u=ss(L.s+.2,L.e-.3,t);window.CAPY=1720;roX_dark(t);const M=['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    M.forEach((m,i)=>{const x=210+(i%3)*330,y=520+Math.floor(i/3)*250,a=ss(i/12,i/12+.1,u);g.save();g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=6;g.fillRect(x-140,y-90,280,200);g.strokeRect(x-140,y-90,280,200);g.fillStyle='#3b7dd8';g.fillRect(x-140,y-90,280,50);
      g.fillStyle='#fff';g.font='800 40px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(m,x,y-64);g.restore();if(a>0){g.save();g.globalAlpha=a;roX_book(x,y+20,.7,roX_BC[i],false);g.restore();}});
    tag(540,300,'~15 MIN A NIGHT','#ffd34d',70);}
  else if(sh(7)){ // board: speed vs consistency
    const L=LN(7),u=ss(L.s,L.e-.2,t);window.CAPY=1720;cam(lerp(1.06,1.12,u),540,lerp(820,980,u));
    roX_board(t,u,[{x:300,y:460,a:-.06,t1:'SPEED',t2:'not the secret',ic:roX_ic.clock},{x:780,y:720,a:.05,t1:'10 PAGES',t2:'small + daily',ic:roX_ic.book},{x:330,y:1080,a:.04,t1:'NO SKIPS',t2:'the real trick',ic:roX_ic.cal}]);
    g.restore();g.save();roX_stamp(720,1330,'DAILY','#2fae4e',ss(.8,1,u),-.1,150);}
  else{roX_track(t,LN(8),C,'READ 10 PAGES','#3b7dd8','STREAK: 21 NIGHTS',true);}
  g.restore();vignette(.6);
  if(t<END)caption(t);wm();endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{ro01,ro02,ro03});

// ---------------- shared ro04-ro07 props ----------------
function roX_ccard(x,y,s,rot=0,col='#3b5bd8'){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.fillStyle=col;g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.roundRect(-150,-95,300,190,18);g.fill();g.stroke();
  g.fillStyle='#e9c25a';g.beginPath();g.roundRect(-115,-45,60,46,8);g.fill();g.stroke();g.fillStyle='rgba(255,255,255,.85)';g.font='800 30px BS';g.textAlign='left';g.textBaseline='middle';g.fillText('•••• 4821',-115,45);g.restore();}
function roX_curve(x0,y0,w,h,fn,p,col,lw=12){g.save();g.strokeStyle=col;g.lineWidth=lw;g.lineCap='round';g.lineJoin='round';g.beginPath();const N=160;let px=x0,py=y0;
  for(let i=0;i<=N;i++){const q=p*i/N;px=x0+w*q;py=y0-h*fn(q);i?g.lineTo(px,py):g.moveTo(px,py);}g.stroke();g.restore();return [px,py];}
function roX_axes(x0,y0,w,h,xl){g.save();g.strokeStyle='#e8e2d4';g.lineWidth=7;g.lineCap='round';g.beginPath();g.moveTo(x0,y0-h);g.lineTo(x0,y0);g.lineTo(x0+w,y0);g.stroke();
  g.fillStyle='#e8e2d4';g.font='800 44px BS';g.textAlign='center';g.fillText(xl,x0+w/2,y0+70);g.restore();}
function roX_std(id,prod,ptitle,col){window.PROD=prod;window.PTITLE=ptitle;window.PCOL=col;const C={...roX_C,shirt:col};window.ENDCHAR=C;return C;}

// ---------------- ro04: minimum payments ($3,000 @ ~21% APR, min = interest + 1%, $25 floor ≈ 15 yrs, ~$4,200 interest; $100/mo ≈ 43 months) ----------------
function roX_sched(pay){const out=[3000];let b=3000;while(b>0.01&&out.length<400){const i=b*.21/12;const p=Math.min(pay?pay:Math.max(25,i+b*.01),b+i);b=b+i-p;out.push(Math.max(0,b));}return out;}
const roX_MIN=roX_sched(0),roX_100=roX_sched(100);
function ro04(t){T0=t;const C=roX_std('ro04','MONEY MASTERY PLANNER','CARD PAYOFF','#7d4cc2');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(400,1640,.9,{...C,face:u<1.2?'calm':'tired',armL:[.1,.05],armR:[2.3,.3],blink:blinkAt(t)},t);
    roX_ccard(660,lerp(820,760,ss(0,1,u)),.85,-.1+.04*Math.sin(t*3));if(u>1.0)tag(660,580,'MINIMUM DUE','#ff8a7a',70);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'tired',1.1);g.restore();g.save();
    if(u>1.1){g.save();g.fillStyle='#262a36';g.fillRect(0,1380,W,140);g.strokeStyle='#5d6478';g.lineWidth=10;for(let x=-200+((t*500)%200);x<W;x+=200){g.beginPath();g.moveTo(x,1380);g.lineTo(x+60,1520);g.stroke();}g.restore();
      tag(540,300,'TREADMILL','#ff8a7a',110);}}
  else if(sh(2)){const L=LN(2),u=ss(L.s,L.e,t);window.CAPY=1760;cam(lerp(1.05,1.12,u),560,1050);roX_room(t);
    kev(280,1620,.85,{...C,face:'calm',armL:[.2,.15],armR:[1.4,.5],blink:blinkAt(t)},t);
    planner(680,1180,.78,t,{title:'CARD PAYOFF',checked:ss(L.s+.6,L.e-.4,t)*1,col:'#7d4cc2'});
    if(t>roX_wordAt(L,/^\$3/)-.2)tag(680,760,'BALANCE: $3,000','#ffd34d',58);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s+.3,roX_wordAt(L,/^Say/),t);window.CAPY=1720;roX_dark(t,'#1c1426');
    tag(540,300,'CARD INTEREST','#9fd8ff',72);roX_bar(820,21*u,30,'#ff6b5e','APR',u>.9?'~21%':'');
    if(t>roX_wordAt(L,/^Say/))tag(540,1080,'20%+ LATELY','#ffd34d',66);kev(540,1640,.5,{...C,face:u>.7?'shock':'calm',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);}
  else if(sh(5)){const L=LN(5),p=ss(L.s+.4,L.e-.3,t);window.CAPY=1720;roX_dark(t);const x0=150,y0=1330,w=820,h=760,N=roX_MIN.length-1;
    roX_axes(x0,y0,w,h,'YEARS →');roX_curve(x0,y0,w,h,q=>roX_MIN[Math.round(q*N)]/3000,p,'#ff6b5e');
    tag(540,260,'MINIMUM ONLY','#ff8a7a',70);tag(540,400,'YEAR '+Math.round(p*N/12),'#ffd34d',90);kev(860,1700,.36,{...C,face:p>.7?'shock':'tired',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.2,L.s+1.8,t),v=roX_wordAt(L,/^More/);window.CAPY=1720;roX_dark(t,'#1c1426');
    roX_bar(760,3000,4500,'#9fd8ff','BORROWED','$3,000');roX_bar(1020,4200*u,4500,'#ff6b5e','INTEREST',u>.9?'~$4,200':'');
    if(t>v-.1)roX_stamp(540,420,'MORE THAN THE DEBT','#ffd34d',ss(v-.1,v+.4,t),-.06,80);}
  else if(sh(7)){const L=LN(7),p=ss(L.s+.3,L.e-.3,t);window.CAPY=1720;roX_dark(t);const x0=150,y0=1330,w=820,h=760,N=roX_MIN.length-1;
    roX_axes(x0,y0,w,h,'YEARS →');roX_curve(x0,y0,w,h,q=>roX_MIN[Math.round(q*N)]/3000,1,'rgba(255,107,94,.45)',8);
    const n=roX_100.length-1;roX_curve(x0,y0,w*n/N,h,q=>roX_100[Math.round(q*n)]/3000,p,'#8fd18a');
    tag(540,260,'$100 / MONTH','#8fd18a',80);if(p>.9)tag(x0+w*n/N+20,y0-120,'~3.5 YRS','#8fd18a',56);}
  else{roX_track(t,LN(8),C,'CARD PAYOFF','#7d4cc2','$100 PAID ✓');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- ro05: 1% better a day (1.01^365 ≈ 37.8, 0.99^365 ≈ 0.03 — maths metaphor) ----------------
function roX_stairs(t,n,lit,col){for(let i=0;i<n;i++){const x=140+i*(800/n),y=1500-i*(700/n);g.save();g.fillStyle=i<lit?col:'#3a3346';g.strokeStyle=INK;g.lineWidth=6;g.fillRect(x,y,800/n+2,1600-y);g.strokeRect(x,y,800/n+2,1600-y);g.restore();}}
function ro05(t){T0=t;const C=roX_std('ro05','DAILY HABIT BUILDER','1% A DAY','#e07b24');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(540,1640,.9,{...C,face:u<1.0?'calm':'smug',armL:[.1,.05],armR:[2.4,.3],blink:blinkAt(t)},t);if(u>.8)tag(540,620,'1% / DAY','#ffd34d',100);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'grin',1.1);g.restore();g.save();
    if(u>1.1){const s=ss(1.1,2.2,u);g.save();g.translate(lerp(150,230,s),lerp(1500,420,s));g.rotate(.1);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.ellipse(0,0,36,90,0,0,7);g.fill();g.stroke();
      g.fillStyle='#ff8a3a';g.beginPath();g.moveTo(-22,80);g.lineTo(0,150+20*Math.sin(t*30));g.lineTo(22,80);g.fill();g.restore();tag(540,300,'ROCKET','#ffd34d',110);}}
  else if(sh(2)){roX_track(t,LN(2),C,'1% A DAY','#e07b24','STEP 1 ✓');}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),p=ss(L.s+.3,L.e-.4,t);window.CAPY=1720;roX_dark(t);const x0=150,y0=1330,w=820,h=820;
    roX_axes(x0,y0,w,h,'DAYS →');roX_curve(x0,y0,w,h,q=>(Math.pow(1.01,365*q)-1)/37,p,'#ffd34d');
    tag(540,260,'DAY '+Math.round(365*p),'#9fd8ff',70);tag(540,400,'× '+Math.pow(1.01,365*p).toFixed(1),'#ffd34d',100);}
  else if(sh(5)){const L=LN(5),p=ss(L.s+.6,L.e-.4,t);window.CAPY=1720;roX_dark(t,'#1c1426');const x0=150,y0=1330,w=820,h=820;
    roX_axes(x0,y0,w,h,'DAYS →');roX_curve(x0,y0,w,h,q=>Math.pow(.99,365*q),p,'#ff6b5e');
    tag(540,260,'1% WORSE','#ff8a7a',70);tag(540,400,'× '+Math.pow(.99,365*p).toFixed(2),'#ff6b5e',100);kev(860,1700,.36,{...C,face:p>.6?'shock':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(6)){const L=LN(6),u=ss(L.s,L.e-.2,t);window.CAPY=1720;cam(lerp(1.06,1.12,u),540,lerp(820,980,u));
    roX_board(t,u,[{x:300,y:460,a:-.06,t1:'1% UP',t2:'≈ ×37 in a year',ic:roX_ic.up},{x:780,y:720,a:.05,t1:'1% DOWN',t2:'≈ ×0.03',ic:roX_ic.clock},{x:330,y:1080,a:.04,t1:'REAL LIFE',t2:'messier, same idea',ic:roX_ic.cal}]);
    g.restore();g.save();roX_stamp(720,1330,'STACKS UP','#c4161c',ss(.8,1,u),-.1,120);}
  else if(sh(7)){const L=LN(7),u=ss(L.s,L.e,t);window.CAPY=1720;roX_dark(t,'#1a1626');const n=8,lit=1+Math.floor(u*7);roX_stairs(t,n,lit,'#e07b24');
    const i=lit-1,x=140+i*(800/n)+50,y=1500-i*(700/n);kev(x,y,.34,{...C,face:'grin',armL:[.4,.2],armR:[.4,.2],bob:-Math.abs(Math.sin(t*6))*20},t);
    tag(540,300,'AGAIN TOMORROW','#ffd34d',76);}
  else{roX_track(t,LN(8),C,'1% A DAY','#e07b24','STREAK: 30 DAYS');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- ro06: Save More Tomorrow (Thaler & Benartzi 2004: ~3.5% → ~13.6% after 4 raises, ~40 months) ----------------
function ro06(t){T0=t;const C=roX_std('ro06','MONEY MASTERY PLANNER','SAVINGS BUMPS','#2f8f5b');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(400,1640,.9,{...C,face:u<1.2?'calm':'grin',armL:[.1,.05],armR:[2.3,.3],blink:blinkAt(t)},t);
    roX_bill(660,lerp(820,760,ss(0,1,u)),.9,'PAY',-.08+.04*Math.sin(t*3));if(u>1.3)tag(660,580,'RAISE!','#8fd18a',90);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'smug',1.1);g.restore();g.save();if(u>1.1)tag(540,300,'AUTOPILOT','#9fd8ff',110);}
  else if(sh(2)){roX_track(t,LN(2),C,'SAVINGS BUMPS','#2f8f5b','NEXT RAISE: +1%');}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s,L.e-.2,t);window.CAPY=1720;cam(lerp(1.06,1.12,u),540,lerp(820,980,u));
    roX_board(t,u,[{x:300,y:460,a:-.06,t1:'SAY YES NOW',t2:'to saving later',ic:roX_ic.check},{x:780,y:720,a:.05,t1:'EACH RAISE',t2:'rate steps up',ic:roX_ic.up},{x:330,y:1080,a:.04,t1:'NO EFFORT',t2:'it just happens',ic:roX_ic.clock}]);}
  else if(sh(5)){const L=LN(5),u=ss(L.s+.3,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'SAVINGS RATE','#9fd8ff',72);
    roX_bar(820,3.5*u,15,'#8fd18a','AT THE START',u>.9?'~3.5%':'');kev(540,1600,.5,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.2,L.e-.3,t);window.CAPY=1720;roX_dark(t,'#16202a');const v=[3.5,6.5,9.4,11.6,13.6];
    v.forEach((r,i)=>{const a=ss(i/5,i/5+.15,u);if(a<=0)return;const x=190+i*175,hh=820*r/15*a;g.save();g.fillStyle=i?'#8fd18a':'#5b8a58';g.strokeStyle=INK;g.lineWidth=6;g.fillRect(x-60,1400-hh,120,hh);g.strokeRect(x-60,1400-hh,120,hh);
      g.fillStyle='#e8e2d4';g.font='800 40px BS';g.textAlign='center';g.fillText(i?'RAISE '+i:'START',x,1460);g.restore();});
    tag(540,300,u>.95?'≈ 13.6%':'STEPPING UP','#ffd34d',90);tag(540,440,'~40 MONTHS','#9fd8ff',56);}
  else if(sh(7)){const L=LN(7),u=ss(L.s+.2,L.e-.3,t),v=roX_wordAt(L,/^take/);window.CAPY=1720;roX_dark(t);
    roX_bar(760,100,100,'#9fd8ff','TAKE-HOME PAY','SAME');roX_bar(1020,20+60*u,100,'#8fd18a','SAVINGS','↑');
    kev(540,1640,.5,{...C,face:'grin',armL:[2.4,.4],armR:[2.4,.4]},t);if(t>v)roX_stamp(540,420,'NO PAY CUT','#2fae4e',ss(v,v+.4,t),-.06,110);}
  else{roX_track(t,LN(8),C,'SAVINGS BUMPS','#2f8f5b','RAISE 1 ✓ +1%');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- ro07: cash vs card (Prelec & Simester 2001, MIT: card bids up to ~2x cash bids for sold-out tickets) ----------------
function roX_ticket(x,y,s,rot=0){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.fillStyle='#ffd34d';g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.roundRect(-170,-80,340,160,14);g.fill();g.stroke();
  g.setLineDash([12,10]);g.beginPath();g.moveTo(90,-80);g.lineTo(90,80);g.stroke();g.setLineDash([]);g.fillStyle=INK;g.font='800 44px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('GAME',-40,-14);g.font='600 28px HG';g.fillText('SOLD OUT',-40,32);g.restore();}
function ro07(t){T0=t;const C=roX_std('ro07','MONEY MASTERY PLANNER','SPENDING LOG','#d94f8a');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(540,1660,.85,{...C,face:u<1.0?'calm':'smug',armL:[2.3,.3],armR:[2.3,.3],blink:blinkAt(t)},t);
    roX_bill(260,lerp(840,780,ss(0,1,u)),.75,'CASH',-.1);roX_ccard(830,lerp(840,780,ss(0,1,u)),.7,.1);if(u>1.0)tag(540,560,'7 DAYS · CASH ONLY','#8fd18a',64);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'smug',1.1);g.restore();g.save();
    if(u>1.1){g.save();g.fillStyle='#ffd34d';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.ellipse(540,1460,420,60,0,Math.PI,0);g.fill();g.stroke();g.restore();tag(540,300,'SPEED BUMP','#ffd34d',110);}}
  else if(sh(2)){roX_track(t,LN(2),C,'SPENDING LOG','#d94f8a','EVERY $ LOGGED');}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=t-L.s;window.CAPY=1720;roX_dark(t,'#1a1626');roX_ticket(540,900,1.6+.03*Math.sin(t*3),-.05);
    tag(540,300,'MIT · SEALED BIDS','#9fd8ff',70);if(u>1.5){g.save();g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=7;g.fillRect(380,1150,280,200);g.strokeRect(380,1150,280,200);g.fillStyle='#c4161c';g.fillRect(500,1150,40,200);g.restore();}}
  else if(sh(5)){const L=LN(5),u=t-L.s,c=roX_wordAt(L,/^Others/)-L.s;window.CAPY=1720;roX_dark(t);g.fillStyle='#e8e2d4';g.fillRect(536,500,8,1000);
    if(u>.3){roX_ccard(790,900,1.0,.08);tag(790,640,'CARD','#9fd8ff',70);}if(u>c){roX_bill(290,900,1.0,'CASH',-.08);tag(290,640,'CASH','#8fd18a',70);}}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.3,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#1a1626');tag(540,300,'AVERAGE BID','#9fd8ff',72);
    roX_bar(820,1,2.2,'#8fd18a','CASH','');roX_bar(1080,1+u,2.2,'#ff6b5e','CARD',u>.9?'UP TO ~2×':'');kev(540,1620,.5,{...C,face:u>.6?'shock':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(7)){const L=LN(7),u=t-L.s,c=roX_wordAt(L,/^A$/)-L.s;window.CAPY=1760;xrayRoom(t);cam(1.9,540,960);
    kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:u<c?ss(.3,1,u):Math.max(0,1-ss(c,c+.6,u))*.9+.1},t);g.restore();g.save();
    tag(540,260,u<c?'CASH: "OUCH"':'CARD: "MEH"',u<c?'#ff8a7a':'#9fd8ff',80);}
  else{roX_track(t,LN(8),C,'SPENDING LOG','#d94f8a','DAY 7 ✓ CASH WEEK');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- ro08: 52-week challenge ($1 + $2 + … + $52 = $1,378; weeks 27-52 = $1,027 ≈ 3/4) ----------------
function ro08(t){T0=t;const C=roX_std('ro08','MONEY MASTERY PLANNER','52 WEEKS','#2f8f5b');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(400,1640,.9,{...C,face:u<1.0?'calm':'grin',armL:[.1,.05],armR:[2.3,.3],blink:blinkAt(t)},t);
    roX_coin(680,lerp(860,780,ss(0,1,u)),70);if(u>.9)tag(680,600,'+$1 A WEEK','#ffd34d',80);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'smug',1.1);g.restore();g.save();if(u>1.1)tag(540,300,'A LADDER','#ffd34d',110);}
  else if(sh(2)){roX_track(t,LN(2),C,'52 WEEKS','#2f8f5b','WEEK 12 ✓ $12');}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s,L.e,t);window.CAPY=1720;roX_dark(t,'#16202a');const n=8,lit=1+Math.floor(u*7.99);roX_stairs(t,n,lit,'#2f8f5b');
    const i=lit-1,x=140+i*(800/n)+50,y=1500-i*(700/n);kev(x,y,.34,{...C,face:'grin',armL:[.4,.2],armR:[.4,.2],bob:-Math.abs(Math.sin(t*6))*20},t);
    const wk=Math.max(1,Math.round(1+51*i/7));tag(540,300,'WEEK '+wk+' → $'+wk,'#ffd34d',84);}
  else if(sh(5)){const L=LN(5),u=ss(L.s+.2,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#16202a');roX_jar(540,1450,1.35,.05+.85*u,t,{sprout:u>.95?1:0});
    tag(540,300,u>.97?'$1,378':roX_money(1378*u*u),'#8fd18a',120);tag(540,450,'52 WEEKS','#9fd8ff',56);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.3,L.e-.3,t);window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'WHERE THE MONEY IS','#9fd8ff',66);
    roX_bar(760,351*Math.min(1,u*2),1378,'#5b8a58','WEEKS 1–26',u>.45?'$351':'');roX_bar(1060,1027*ss(.5,1,u),1378,'#8fd18a','WEEKS 27–52',u>.95?'$1,027':'');
    kev(540,1640,.45,{...C,face:u>.7?'shock':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(7)){const L=LN(7),u=ss(L.s,L.e-.2,t);window.CAPY=1720;cam(lerp(1.06,1.12,u),540,lerp(820,980,u));
    roX_board(t,u,[{x:300,y:460,a:-.06,t1:'START TINY',t2:'$1 is easy',ic:roX_ic.coin},{x:780,y:720,a:.05,t1:'EVERY WEEK',t2:'habit forms',ic:roX_ic.cal},{x:330,y:1080,a:.04,t1:'THEN BIG',t2:'$40, $50 weeks',ic:roX_ic.up}]);}
  else{roX_track(t,LN(8),C,'52 WEEKS','#2f8f5b','WEEK 52 ✓ $1,378');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- ro09: implementation intentions (Milne, Orbell & Sheeran 2002: ~91% vs ~35-38% exercised at least once in a week) ----------------
function roX_note(x,y,s,u){g.save();g.translate(x,y);g.rotate(-.03);g.scale(s,s);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=8;g.fillRect(-380,-230,760,460);g.strokeRect(-380,-230,760,460);
  g.strokeStyle='#9fc0e8';g.lineWidth=3;for(let yy=-150;yy<220;yy+=80){g.beginPath();g.moveTo(-350,yy);g.lineTo(350,yy);g.stroke();}
  g.fillStyle=INK;g.font='700 50px HG';g.textAlign='left';g.textBaseline='alphabetic';g.fillText('I will exercise on',-340,-160);
  const parts=[['MONDAY',-340,-80],['at 7:00',-340,0],['in THE PARK',-340,80]];parts.forEach(([w,px,py],i)=>{const a=ss(i/3,i/3+.25,u);if(a<=0)return;g.globalAlpha=a;g.fillStyle='#d9472b';g.font='800 64px BS';g.fillText(w,px,py);});
  g.restore();}
function ro09(t){T0=t;const C=roX_std('ro09','DAILY HABIT BUILDER','WORKOUT PLAN','#3b7dd8');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(540,1660,.85,{...C,face:u<1.0?'calm':'smug',armL:[.1,.05],armR:[2.3,.3],blink:blinkAt(t)},t);if(u>.9)tag(540,600,'WHEN + WHERE','#ffd34d',90);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'smug',1.1);g.restore();g.save();if(u>1.1)tag(540,300,'SHORTCUT','#9fd8ff',110);}
  else if(sh(2)){roX_track(t,LN(2),C,'WORKOUT PLAN','#3b7dd8','MON · 7:00 · PARK');}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s+.4,L.e,t);window.CAPY=1720;roX_dark(t,'#1a1626');tag(540,300,'UK STUDY · ONE SENTENCE','#9fd8ff',62);roX_note(540,880,1.05,u);
    kev(540,1660,.45,{...C,face:'calm',armL:[.1,.05],armR:[2.2,.3]},t);}
  else if(sh(5)){const L=LN(5),u=ss(L.s+.3,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'WROTE THE PLAN','#9fd8ff',72);
    roX_bar(820,91*u,100,'#8fd18a','EXERCISED IN A WEEK',u>.9?'~91%':'');kev(540,1600,.5,{...C,face:u>.6?'grin':'calm',armL:[.1,.05],armR:[2.4,.3]},t);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.3,L.e-.3,t);window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'PLAN vs NO PLAN','#ffd34d',80);
    roX_bar(700,91,100,'#8fd18a','WROTE IT DOWN','~91%');roX_bar(960,38*u,100,'#ff6b5e','NO PLAN',u>.9?'~35–38%':'');
    if(u>.95)roX_stamp(540,1300,'2× +','#2fae4e',ss(.95,1,u),-.08,140);}
  else if(sh(7)){const L=LN(7),u=t-L.s;window.CAPY=1760;xrayRoom(t);cam(1.9,540,960);
    kev(540,1560,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:.3+.6*ss(.3,1.2,u)},t);g.restore();g.save();tag(540,260,'ALREADY DECIDED','#9fd8ff',80);}
  else{roX_track(t,LN(8),C,'WORKOUT PLAN','#3b7dd8','WEEK 1 ✓ DONE');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- ro10: food waste (USDA: 30-40% of US food supply wasted; avg family of four loses ~$1,500/yr ≈ $125/mo) ----------------
function roX_apple(x,y,r,bad){g.save();g.fillStyle=bad?'#6b5a3a':'#e04a3a';g.strokeStyle=INK;g.lineWidth=Math.max(3,r*.12);g.beginPath();g.arc(x,y,r,0,7);g.fill();g.stroke();
  g.strokeStyle='#5a3a22';g.beginPath();g.moveTo(x,y-r);g.lineTo(x+r*.15,y-r*1.4);g.stroke();g.fillStyle='#3f9b57';g.beginPath();g.ellipse(x+r*.4,y-r*1.15,r*.35,r*.16,-.5,0,7);g.fill();
  if(bad){g.fillStyle='rgba(30,20,10,.5)';g.beginPath();g.arc(x-r*.3,y+r*.1,r*.25,0,7);g.arc(x+r*.3,y-r*.25,r*.18,0,7);g.fill();}g.restore();}
function roX_bin(x,y,s,lid=0){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#6f7a86';g.strokeStyle=INK;g.lineWidth=9;g.beginPath();g.moveTo(-150,-300);g.lineTo(150,-300);g.lineTo(120,0);g.lineTo(-120,0);g.closePath();g.fill();g.stroke();
  g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=6;for(const xx of [-60,0,60]){g.beginPath();g.moveTo(xx,-270);g.lineTo(xx*.85,-30);g.stroke();}
  g.save();g.translate(-170,-310);g.rotate(-lid);g.fillStyle='#5d6672';g.strokeStyle=INK;g.lineWidth=9;g.fillRect(0,-30,340,34);g.strokeRect(0,-30,340,34);g.restore();g.restore();}
function ro10(t){T0=t;const C=roX_std('ro10','MONEY MASTERY PLANNER','MEAL PLAN','#e07b24');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(360,1640,.88,{...C,face:u<1.0?'calm':'shock',armL:[.1,.05],armR:[1.6,.4],blink:blinkAt(t)},t);roX_bin(760,1500,.9,.5*ss(0,1,u));
    const ay=lerp(700,1180,ss(.2,1.2,u));roX_apple(740,ay,50,true);if(u>1.1)tag(540,600,'PAID FOR · THROWN OUT','#ff8a7a',64);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'shock',1.1);g.restore();g.save();if(u>1.1)tag(540,300,'MONEY IN THE TRASH','#ff8a7a',90);}
  else if(sh(2)){roX_track(t,LN(2),C,'MEAL PLAN','#e07b24','SHOP THE LIST ✓');}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s+.3,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#1a1626');tag(540,300,'USDA ESTIMATE','#9fd8ff',72);
    for(let i=0;i<10;i++){const x=200+(i%5)*170,y=820+Math.floor(i/5)*240;roX_apple(x,y,62,i>=6&&u>(i-6)/4*.8+.1);}
    if(u>.9)tag(540,1400,'30–40% WASTED','#ff6b5e',96);}
  else if(sh(5)){const L=LN(5),u=ss(L.s+.2,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#16202a');roX_bin(540,1500,1.2,.45);
    const r=R(13);for(let i=0;i<8;i++){const ph=(t*.8+r())%1;roX_bill(540+(r()-.5)*400*(1-ph),lerp(500,1150,ph),.5,'$',r()*2);}
    tag(540,300,u>.97?'~$1,500':roX_money(1500*u),'#8fd18a',120);tag(540,450,'FAMILY OF 4 · PER YEAR','#9fd8ff',56);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.2,L.e-.3,t);window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'~$125 EVERY MONTH','#ffd34d',84);
    const M='JFMAMJJASOND';for(let i=0;i<12;i++){const a=ss(i/12,i/12+.12,u);if(a<=0)continue;const x=210+(i%4)*220,y=700+Math.floor(i/4)*260;g.save();g.globalAlpha=a;
      g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=6;g.fillRect(x-90,y-90,180,180);g.strokeRect(x-90,y-90,180,180);g.fillStyle='#d9472b';g.fillRect(x-90,y-90,180,44);
      g.fillStyle='#fff';g.font='800 36px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(M[i],x,y-68);g.fillStyle='#c4161c';g.font='800 46px BS';g.fillText('-$125',x,y+20);g.restore();}}
  else if(sh(7)){const L=LN(7),u=ss(L.s,L.e-.2,t);window.CAPY=1720;cam(lerp(1.06,1.12,u),540,lerp(820,980,u));
    roX_board(t,u,[{x:300,y:460,a:-.06,t1:'PLAN MEALS',t2:'before you shop',ic:roX_ic.cal},{x:780,y:720,a:.05,t1:'SHOP THE LIST',t2:'only the list',ic:roX_ic.check},{x:330,y:1080,a:.04,t1:'OPEN FIRST',t2:'eat it first',ic:t=>roX_apple(0,-62,46)}]);}
  else{roX_track(t,LN(8),C,'MEAL PLAN','#e07b24','0 TOSSED THIS WEEK');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

// ---------------- ro11: $400 emergency (Fed SHED 2025, May 2026: 63% would cover it with cash or equivalent; $20/wk × 52 = $1,040) ----------------
function roX_invoice(x,y,s,rot=0){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=7;g.fillRect(-140,-190,280,380);g.strokeRect(-140,-190,280,380);
  g.fillStyle='#c4161c';g.fillRect(-140,-190,280,60);g.fillStyle='#fff';g.font='800 40px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('BILL',0,-160);
  g.fillStyle='#bbb';for(let i=0;i<4;i++)g.fillRect(-100,-90+i*40,200-(i%2)*60,14);g.fillStyle=INK;g.font='800 76px BS';g.fillText('$400',0,120);g.restore();}
function ro11(t){T0=t;const C=roX_std('ro11','MONEY MASTERY PLANNER','EMERGENCY FUND','#7a5cd6');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(400,1640,.9,{...C,face:u<.9?'calm':'shock',armL:[.1,.05],armR:[1.5,.4],blink:blinkAt(t)},t);roX_invoice(lerp(1300,760,ss(.1,.9,u)),1020,.8,.08);
    if(u>1.0)tag(540,560,'SURPRISE!','#ff8a7a',90);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'smug',1.1);g.restore();g.save();if(u>1.1)tag(540,300,'A TEST','#ffd34d',120);}
  else if(sh(2)){roX_track(t,LN(2),C,'EMERGENCY FUND','#7a5cd6','+$20 THIS WEEK ✓');}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=t-L.s;window.CAPY=1720;roX_dark(t,'#1a1626');tag(540,300,'FED SURVEY · EVERY YEAR','#9fd8ff',64);
    roX_invoice(540,900,1.4+.02*Math.sin(t*3),-.04);if(u>1.6)tag(540,1300,'HOW WOULD YOU PAY?','#ffd34d',70);}
  else if(sh(5)){const L=LN(5),u=ss(L.s+.3,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'COULD PAY IN CASH*','#9fd8ff',72);
    roX_bar(820,63*u,100,'#8fd18a','ADULTS',u>.9?'63%':'');g.save();g.fillStyle='#e8e2d4';g.font='600 38px HG';g.textAlign='center';g.fillText('*cash, savings, or card paid off',540,1000);g.restore();
    kev(540,1600,.5,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'MORE THAN 1 IN 3','#ff8a7a',90);
    [[250,'grin'],[540,'grin'],[830,'shock']].forEach(([x,f],i)=>{if(u>i*.5)kev(x,1300,.5,{...C,shirt:i==2?'#c4161c':'#2f8f5b',face:f,armL:[.1,.05],armR:[.1,.05]},t);});
    if(u>1.8)tag(830,720,'NEED ANOTHER WAY','#ff6b5e',46);}
  else if(sh(7)){const L=LN(7),u=ss(L.s+.2,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#16202a');roX_jar(540,1450,1.35,.05+.85*u,t,{sprout:u>.95?1:0});
    tag(540,300,u>.97?'$1,040':roX_money(1040*u),'#8fd18a',120);tag(540,450,'$20 × 52 WEEKS','#9fd8ff',60);}
  else{roX_track(t,LN(8),C,'EMERGENCY FUND','#7a5cd6','BUFFER: $1,040 ✓');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{ro04,ro05,ro06,ro07,ro08,ro09,ro10,ro11});

function roX_screen(x,y,s,top,big,col='#2f6fd6',rot=0){g.save();g.translate(x,y);g.rotate(rot);g.scale(s,s);g.fillStyle='#1b1d26';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-130,-230,260,460,34);g.fill();g.stroke();
  g.fillStyle='#f4f1ea';g.beginPath();g.roundRect(-112,-200,224,400,20);g.fill();g.fillStyle=col;g.beginPath();g.roundRect(-112,-200,224,90,[20,20,0,0]);g.fill();
  g.fillStyle='#fff';g.font='800 34px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(top,0,-155);g.fillStyle=INK;g.font='800 58px BS';g.fillText(big,0,-20);
  g.fillStyle='#ccc';for(let i=0;i<3;i++)g.fillRect(-90,50+i*40,180-(i%2)*50,14);g.restore();}
function roX_sand(t){g.fillStyle='#c9a35e';g.beginPath();g.ellipse(540,1560,520,170,0,0,7);g.fill();g.strokeStyle=INK;g.lineWidth=8;g.stroke();
  g.fillStyle='rgba(120,80,30,.3)';const r=R(9);for(let i=0;i<120;i++){g.fillRect(140+r()*800,1470+r()*170,5,5);}}
function ro12(t){T0=t;const C=roX_std('ro12','MONEY MASTERY PLANNER','DAILY BALANCE','#2f6fd6');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(400,1640,.9,{...C,face:u<.9?'calm':'shock',armL:[.1,.05],armR:[1.5,.4],blink:blinkAt(t)},t);roX_screen(lerp(1300,780,ss(.1,.9,u)),1020,.8,'BALANCE','$1,284','#2f6fd6',.06);
    if(u>1.0)tag(540,560,'EVERY DAY?','#ffd34d',90);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'smug',1.1);g.restore();g.save();if(u>1.1)tag(540,300,'BRAVE','#ffd34d',130);}
  else if(sh(2)){roX_track(t,LN(2),C,'DAILY BALANCE','#2f6fd6','CHECKED TODAY ✓');}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s+.2,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#1a1626');tag(540,280,'≈1.1 MILLION INVESTORS','#9fd8ff',66);
    const n=Math.floor(1+u*29);for(let i=0;i<n;i++){const cx=170+(i%6)*148,cy=560+Math.floor(i/6)*190;roX_screen(cx,cy,.32,'LOGIN','✓','#2f6fd6');}
    if(u>.6)tag(540,1560,'2 YEARS OF LOGINS','#ffd34d',70);}
  else if(sh(5)){const L=LN(5),p=ss(L.s+.2,L.e-.6,t),q=ss(L.s+1.2,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#16202a');const x0=150,y0=900,w=820,h=480;
    roX_axes(x0,y0,w,h,'MARKET');roX_curve(x0,y0,w,h,z=>z<.55?.6+.25*z:.74-.9*(z-.55),p,'#ff6b5e');tag(540,230,'MARKET DROPS…','#ff8a7a',70);
    roX_bar(1250,100-9.5*q,100,'#9fd8ff','LOGINS',q>.9?'−9.5%':'');kev(860,1640,.4,{...C,face:q>.5?'shock':'calm',armL:[.1,.05],armR:[.1,.05]},t);}
  else if(sh(6)){const L=LN(6),u=t-L.s;window.CAPY=1720;roX_dark(t,'#1c1a14');spot(540,1300,700,.35);roX_sand(t);
    kev(540,lerp(1560,1760,ss(1.2,2.2,u)),.75,{...C,face:u<1.2?'shock':'sleep',armL:[.2,.1],armR:[.2,.1]},t);roX_sand(t);g.fillStyle='rgba(201,163,94,1)';g.fillRect(0,1560,W,400);
    roX_stamp(540,420,'OSTRICH EFFECT','#ffd34d',ss(.2,.6,u),-.08,100);if(u>2)tag(540,700,'LOOK AWAY','#ff8a7a',70);}
  else if(sh(7)){const L=LN(7),u=ss(L.s,L.e-.2,t);window.CAPY=1720;cam(lerp(1.06,1.12,u),540,lerp(820,980,u));
    roX_board(t,u,[{x:300,y:460,a:-.06,t1:'UNOPENED',t2:'the bill you skip',ic:roX_ic.cal},{x:780,y:720,a:.05,t1:'FEES',t2:'can quietly stack',ic:roX_ic.up},{x:330,y:1080,a:.04,t1:'LOOKING',t2:'the cheap fix',ic:roX_ic.check}]);}
  else{roX_track(t,LN(8),C,'DAILY BALANCE','#2f6fd6','30 DAYS LOOKED ✓');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

function roX_clock(x,y,r,u,col='#ffd34d'){g.save();g.translate(x,y);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=10;g.beginPath();g.arc(0,0,r,0,7);g.fill();g.stroke();
  g.fillStyle=col;g.beginPath();g.moveTo(0,0);g.arc(0,0,r-14,-Math.PI/2,-Math.PI/2+Math.PI/2*u);g.closePath();g.fill();
  g.strokeStyle=INK;g.lineWidth=12;g.lineCap='round';g.beginPath();g.moveTo(0,0);const a=-Math.PI/2+Math.PI/2*u;g.lineTo(Math.cos(a)*r*.8,Math.sin(a)*r*.8);g.stroke();g.restore();}
function ro13(t){T0=t;const C=roX_std('ro13','DAILY HABIT BUILDER','15 MIN SKILL','#e07b24');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(400,1640,.9,{...C,face:u<1.0?'calm':'grin',armL:[.1,.05],armR:[2.4,.3],blink:blinkAt(t)},t);roX_clock(740,1020,105,ss(.3,2.2,u));
    if(u>.9)tag(540,560,'15 MIN / DAY','#ffd34d',96);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'smug',1.1);g.restore();g.save();if(u>1.1)tag(540,300,'A MOUNTAIN','#9fd8ff',110);}
  else if(sh(2)){roX_track(t,LN(2),C,'15 MIN SKILL','#e07b24','15 MIN TODAY ✓');}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s+.3,L.e-.3,t);window.CAPY=1720;roX_dark(t,'#1a1626');
    const n=Math.floor(u*60);for(let i=0;i<n;i++)roX_clock(130+(i%10)*92,520+Math.floor(i/10)*110,38,1,'#e07b24');
    tag(540,300,'15 × 365','#9fd8ff',90);tag(540,1340,Math.round(5475*u).toLocaleString('en-US')+' MIN','#ffd34d',100);}
  else if(sh(5)){const L=LN(5),u=ss(L.s+.2,L.e-.3,t);window.CAPY=1720;roX_dark(t,'#16202a');roX_jar(540,1450,1.35,.05+.85*u,t,{sprout:u>.95?1:0});
    tag(540,300,(u>.97?'91':Math.round(91*u))+' HOURS','#8fd18a',120);tag(540,450,'IN ONE YEAR','#9fd8ff',60);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.2,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'40-HOUR WEEKS','#ffd34d',80);
    roX_bar(700,Math.min(40,91*u),40,'#8fd18a','WEEK 1',u>.44?'40 h':'');roX_bar(960,Math.max(0,Math.min(40,91*u-40)),40,'#8fd18a','WEEK 2',u>.88?'40 h':'');roX_bar(1220,Math.max(0,91*u-80),40,'#e07b24','+ EXTRA',u>.97?'11 h':'');
    kev(540,1660,.42,{...C,face:u>.8?'grin':'calm',armL:[.1,.05],armR:[2.4,.3]},t);}
  else if(sh(7)){const L=LN(7),u=t-L.s;window.CAPY=1720;roX_dark(t,'#1c1426');
    kev(300,1450,.6,{...C,face:'grin',armL:[.1,.05],armR:[2.4,.3]},t);roX_clock(300,700,110,1,'#8fd18a');
    kev(790,1450,.6,{...C,shirt:'#7a6a8a',face:'tired',armL:[.1,.05],armR:[.1,.05]},t);g.save();g.fillStyle='#fbf8f1';g.font='800 46px BS';g.textAlign='center';g.fillText('3 HOURS',790,560);g.fillText('SUNDAY?',790,620);g.restore();
    tag(300,980,'DAILY ✓','#8fd18a',56);if(u>1.2)roX_stamp(790,900,'SKIPPED','#c4161c',ss(1.2,1.6,u),-.1,80);}
  else{roX_track(t,LN(8),C,'15 MIN SKILL','#e07b24','STREAK: 30 DAYS');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

function roX_receipt(x,y,s,amt,up,u){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#fbf8f1';g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.moveTo(-150,-200);g.lineTo(150,-200);g.lineTo(150,200);
  for(let i=0;i<10;i++)g.lineTo(150-i*30-15,i%2?200:186);g.lineTo(-150,200);g.closePath();g.fill();g.stroke();
  g.fillStyle=INK;g.font='800 40px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('RECEIPT',0,-150);g.font='800 64px BS';g.fillText(amt,0,-50);
  if(u>0){g.globalAlpha=ss(0,.5,u);g.fillStyle='#2fae4e';g.font='800 50px BS';g.fillText('+'+up+' → SAVE',0,70);}g.restore();}
function ro14(t){T0=t;const C=roX_std('ro14','MONEY MASTERY PLANNER','ROUND-UPS','#2f8f5b');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t);
    kev(380,1640,.9,{...C,face:u<1.0?'calm':'grin',armL:[.1,.05],armR:[1.5,.4],blink:blinkAt(t)},t);roX_receipt(lerp(1300,780,ss(.1,.9,u)),1000,.85,'$4.35','65¢',ss(1.6,2.4,u));
    if(u>1.0)tag(540,560,'ROUND IT UP','#ffd34d',90);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'smug',1.1);g.restore();g.save();if(u>1.1)tag(540,300,'A PLAN','#8fd18a',120);}
  else if(sh(2)){roX_track(t,LN(2),C,'ROUND-UPS','#2f8f5b','+$7 THIS WEEK ✓');}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s+.2,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#1a1626');tag(540,280,'RANDOM CENTS','#9fd8ff',72);
    const r=R(5);for(let i=0;i<Math.floor(u*24);i++){const c=1+Math.floor(r()*99);g.save();g.fillStyle=c>50?'#8fd18a':'#ff8a7a';g.font='800 54px BS';g.textAlign='center';g.fillText((100-c)+'¢',150+(i%6)*156,520+Math.floor(i/6)*120);g.restore();}
    if(u>.7)tag(540,1250,'AVERAGE ≈ 50¢','#ffd34d',96);}
  else if(sh(5)){const L=LN(5),u=t-L.s;window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'2 BUYS A DAY','#9fd8ff',80);
    roX_ccard(320,800,1,-.08);roX_ccard(760,800,1,.08,'#d94f8a');if(u>.6){roX_coin(320,1050,60);}if(u>1.1){roX_coin(760,1050,60);}if(u>1.7)tag(540,1300,'≈ $1 / DAY','#8fd18a',110);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.2,L.e-.3,t);window.CAPY=1720;roX_dark(t,'#16202a');roX_jar(540,1450,1.35,.05+.85*u,t,{sprout:u>.95?1:0});
    tag(540,300,u>.97?'≈ $365':roX_money(365*u),'#8fd18a',120);tag(540,450,'IN A YEAR','#9fd8ff',60);}
  else if(sh(7)){const L=LN(7),u=ss(L.s,L.e,t);window.CAPY=1720;roX_dark(t,'#1a1626');tag(540,300,'EVERY SUNDAY','#ffd34d',80);
    roX_jar(260,1350,.8,.5,t);roX_jar(820,1350,.8,.15+.4*u,t);g.save();g.fillStyle='#e8e2d4';g.font='800 48px BS';g.textAlign='center';g.fillText('SPENDING',260,1430);g.fillText('SAVINGS',820,1430);g.restore();
    const q=(u*3)%1;roX_coin(lerp(300,800,q),1000-200*Math.sin(q*Math.PI),40);}
  else{roX_track(t,LN(8),C,'ROUND-UPS','#2f8f5b','SAVED: $365 ✓');}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

function roX_gift(x,y,s,col,tagTxt){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=col;g.strokeStyle=INK;g.lineWidth=8;g.fillRect(-100,-100,200,180);g.strokeRect(-100,-100,200,180);
  g.fillStyle='#ffd34d';g.fillRect(-18,-100,36,180);g.fillRect(-110,-130,220,40);g.strokeRect(-110,-130,220,40);g.beginPath();g.ellipse(-35,-150,35,20,-.4,0,7);g.ellipse(35,-150,35,20,.4,0,7);g.fill();g.stroke();
  if(tagTxt){g.fillStyle='#fbf8f1';g.translate(110,20);g.rotate(.2);g.fillRect(-10,-30,120,60);g.strokeRect(-10,-30,120,60);g.fillStyle=INK;g.font='800 38px BS';g.textAlign='center';g.textBaseline='middle';g.fillText(tagTxt,50,2);}g.restore();}
function ro15(t){T0=t;const C=roX_std('ro15','MONEY MASTERY PLANNER','GIFT BUDGET','#c4161c');const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){const L=LN(0),u=t-L.s;window.CAPY=1720;cam(lerp(1.0,1.1,ss(L.s,L.e,t)),540,1100);roX_room(t,true);
    kev(380,1640,.9,{...C,face:u<1.0?'calm':'shock',armL:[.1,.05],armR:[1.5,.4],blink:blinkAt(t)},t);
    [[700,1150,'#d94f8a'],[860,1180,'#3b7dd8'],[780,960,'#2f8f5b']].forEach(([x,y,c],i)=>{if(u>.3+i*.3)roX_gift(x,y,.7,c);});
    if(u>1.0)tag(540,560,'BLACK FRIDAY','#ff8a7a',96);}
  else if(sh(1)){const L=LN(1),u=roX_closeup(t,L,C,'smug',1.1,true);g.restore();g.save();if(u>1.1)tag(540,300,'A SHIELD','#9fd8ff',120);}
  else if(sh(2)){roX_track(t,LN(2),C,'GIFT BUDGET','#c4161c','LIST WRITTEN ✓',true);}
  else if(sh(3)){const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1720;
    roX_dive(t,u,'INSIDE RIO',()=>{roX_room(t,true);kev(540,1500,.95,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05]},t);});}
  else if(sh(4)){const L=LN(4),u=ss(L.s+.3,L.e-.3,t);window.CAPY=1720;roX_dark(t,'#1a1626');tag(540,280,'NOV + DEC · US','#9fd8ff',66);
    const n=Math.floor(u*14);for(let i=0;i<n;i++)roX_gift(200+(i%5)*170,1300-Math.floor(i/5)*190,.55,['#d94f8a','#3b7dd8','#2f8f5b','#e07b24'][i%4]);
    tag(540,460,u>.95?'> $1 TRILLION':'$'+Math.round(1013*u)+' BILLION','#ffd34d',u>.95?110:90);}
  else if(sh(5)){const L=LN(5),u=ss(L.s+.3,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'MOST SHOPPING ON…','#9fd8ff',72);
    roX_bar(820,64*u,100,'#ff8a7a','THANKSGIVING WEEKEND',u>.9?'64%':'');kev(540,1600,.5,{...C,face:u>.6?'shock':'calm',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);}
  else if(sh(6)){const L=LN(6),u=ss(L.s+.3,L.e-.2,t);window.CAPY=1720;roX_dark(t,'#16202a');tag(540,300,'ECONOMY WILL AFFECT IT','#ffd34d',62);
    roX_bar(820,56*u,100,'#9fd8ff','SHOPPERS',u>.9?'56%':'');g.save();g.fillStyle='#e8e2d4';g.font='600 38px HG';g.textAlign='center';g.fillText('NRF survey, Oct 2026',540,1000);g.restore();
    kev(540,1600,.5,{...C,face:'calm',armL:[.1,.05],armR:[.1,.05],blink:blinkAt(t)},t);}
  else if(sh(7)){const L=LN(7),u=t-L.s;window.CAPY=1720;roX_dark(t,'#1c1426');tag(540,300,'NUMBER FIRST','#ffd34d',90);
    [['MOM','$40','#d94f8a'],['DAD','$30','#3b7dd8'],['BEST FRIEND','$25','#2f8f5b']].forEach(([n,a,c],i)=>{if(u<.3+i*.5)return;const y=620+i*300;roX_gift(260,y+60,.6,c);
      g.save();g.fillStyle='#e8e2d4';g.font='800 60px BS';g.textAlign='left';g.fillText(n,420,y+40);g.fillStyle='#8fd18a';g.fillText(a,420,y+110);g.restore();});}
  else{roX_track(t,LN(8),C,'GIFT BUDGET','#c4161c','ON BUDGET ✓',true);}
  g.restore();vignette(.6);if(t<END)caption(t);wm();endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{ro12,ro13,ro14,ro15});
