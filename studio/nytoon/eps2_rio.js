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
