// Nah-You toons: more places + episodes ny05-ny08 (engine globals from index.html)
// ---------- places ----------
function place(o){ // generic painted room: wall gradient, floor, light pool, props
  const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,o.wall[0]);gr.addColorStop(.47,o.wall[1]);gr.addColorStop(.53,o.floor[0]);gr.addColorStop(1,o.floor[1]);g.fillStyle=gr;g.fillRect(0,0,W,H);
  const hz=900;g.save();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=3;g.beginPath();g.rect(0,hz,W,H-hz);g.clip();
  if(o.planks!==false){for(let i=-12;i<=12;i++){g.beginPath();g.moveTo(W/2+i*40,hz);g.lineTo(W/2+i*260,H);g.stroke();}}g.restore();
  o.props&&o.props();
  if(o.light){g.save();g.globalCompositeOperation='screen';const p=g.createRadialGradient(o.light[0],o.light[1],10,o.light[0],o.light[1],o.light[2]);p.addColorStop(0,o.light[3]);p.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=p;g.fillRect(0,0,W,H);g.restore();}
  vignette(o.vig??.7);}
function windowFrame(x,y,w,h,sky){g.save();const sg=g.createLinearGradient(0,y,0,y+h);sky.forEach((c,i)=>sg.addColorStop(i/(sky.length-1),c));g.fillStyle=sg;g.fillRect(x,y,w,h);
  g.strokeStyle='#2a221c';g.lineWidth=14;g.strokeRect(x,y,w,h);g.beginPath();g.moveTo(x+w/2,y);g.lineTo(x+w/2,y+h);g.moveTo(x,y+h/2);g.lineTo(x+w,y+h/2);g.stroke();g.restore();}
function bedroom(t){place({wall:['#0e1426','#18203a'],floor:['#231a26','#120d14'],light:[300,1250,520,'rgba(90,140,255,.45)'],vig:.8,props:()=>{
  windowFrame(640,280,300,380,['#0a1030','#1c2a5c']);g.fillStyle='#fff';for(let i=0;i<14;i++){const r=R(i+3);g.globalAlpha=.6;g.fillRect(650+r()*280,290+r()*360,3,3);}g.globalAlpha=1;
  // bed
  g.fillStyle='#2b3a6a';g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.roundRect(-40,1080,640,260,30);g.fill();g.stroke();g.fillStyle='#e6e3ef';g.beginPath();g.roundRect(20,1030,220,90,30);g.fill();g.stroke();
  // nightstand + clock
  g.fillStyle='#3b2a20';g.beginPath();g.roundRect(700,1110,220,230,12);g.fill();g.stroke();g.fillStyle='#111';g.beginPath();g.roundRect(730,1030,160,80,12);g.fill();g.stroke();
  g.fillStyle='#ff3b30';g.font='800 64px BS';g.textAlign='center';g.fillText(window.CLOCK||'2:00',810,1092);}});}
function gym(t){place({wall:['#2b2f36','#3a3d44'],floor:['#2e2a26','#1a1714'],light:[760,520,700,'rgba(255,180,90,.45)'],vig:.65,props:()=>{
  windowFrame(560,220,420,420,['#ff9a4c','#ffcf7e','#ffe9b8']);g.fillStyle='rgba(255,140,60,.9)';g.beginPath();g.arc(770,560,70,Math.PI,0);g.fill();
  // rack + dumbbells
  g.fillStyle='#1d1f24';g.strokeStyle=INK;g.lineWidth=7;g.beginPath();g.roundRect(60,980,420,40,8);g.fill();g.stroke();
  for(let i=0;i<4;i++){const x=110+i*100;g.fillStyle='#111';g.beginPath();g.roundRect(x-34,920,22,60,6);g.fill();g.beginPath();g.roundRect(x+12,920,22,60,6);g.fill();g.fillStyle='#777';g.fillRect(x-12,944,24,12);}
  g.fillStyle='rgba(255,255,255,.12)';g.fillRect(0,860,W,8);}});}
function outCourt(t){place({wall:['#ff8a4c','#ffc98a'],floor:['#3a5f8a','#24405e'],planks:false,light:[540,1300,700,'rgba(255,170,90,.35)'],vig:.55,props:()=>{
  // skyline silhouette + fence
  g.fillStyle='#5a3a4a';const r=R(4);let x=0;while(x<W){const w=60+r()*90,h=120+r()*260;g.fillRect(x,860-h,w,h);x+=w;}
  g.strokeStyle='rgba(40,30,40,.6)';g.lineWidth=3;for(let i=-20;i<40;i++){g.beginPath();g.moveTo(i*40,640);g.lineTo(i*40+220,900);g.moveTo(i*40+220,640);g.lineTo(i*40,900);g.stroke();}
  g.strokeStyle='rgba(255,255,255,.75)';g.lineWidth=8;g.beginPath();g.moveTo(0,1180);g.lineTo(W,1180);g.stroke();g.beginPath();g.ellipse(540,1180,300,70,0,0,Math.PI);g.stroke();
  g.fillStyle='#e9e6df';g.fillRect(820,420,200,130);g.strokeStyle='#c2451f';g.lineWidth=6;g.strokeRect(885,470,70,55);g.strokeStyle='#e0562a';g.lineWidth=8;g.beginPath();g.ellipse(920,575,52,12,0,0,7);g.stroke();
  g.strokeStyle='rgba(255,255,255,.8)';g.lineWidth=2;for(let i=0;i<7;i++){g.beginPath();g.moveTo(872+i*16,578);g.lineTo(885+i*12,650);g.stroke();}
  g.fillStyle='#444';g.fillRect(912,550,16,450);}});}
function party(t){place({wall:['#1a0f2e','#2c1450'],floor:['#2a1838','#140a1c'],light:[540,700,800,'rgba(190,90,255,.4)'],vig:.7,props:()=>{
  // string lights
  for(let k=0;k<3;k++){g.strokeStyle='rgba(0,0,0,.5)';g.lineWidth=3;g.beginPath();for(let x=0;x<=W;x+=20){const y=180+k*130+Math.sin(x/W*Math.PI)*90;x?g.lineTo(x,y):g.moveTo(x,y);}g.stroke();
    for(let x=30;x<W;x+=90){const y=180+k*130+Math.sin(x/W*Math.PI)*90+12;const b=g.createRadialGradient(x,y,2,x,y,26);b.addColorStop(0,'rgba(255,230,160,1)');b.addColorStop(1,'rgba(255,230,160,0)');g.fillStyle=b;g.beginPath();g.arc(x,y,26,0,7);g.fill();}}
  // crowd silhouettes
  const r=R(8);for(let i=0;i<12;i++){const x=40+i*92+r()*30,s=.5+r()*.15;g.fillStyle=`rgba(${20+i*3},10,${40+i*4},.95)`;g.beginPath();g.arc(x,900-200*s,60*s,0,7);g.fill();g.beginPath();g.roundRect(x-55*s,900-140*s,110*s,240*s,40*s);g.fill();}
  g.fillStyle='#ff4fd8';g.globalAlpha=.8;g.fillRect(0,620,W,6);g.globalAlpha=1;}});}
function phone(x,y,s,glow=1){g.save();g.translate(x,y);g.scale(s,s);if(glow){g.globalCompositeOperation='screen';const b=g.createRadialGradient(0,0,10,0,0,260);b.addColorStop(0,'rgba(120,180,255,.6)');b.addColorStop(1,'rgba(120,180,255,0)');g.fillStyle=b;g.fillRect(-260,-260,520,520);g.globalCompositeOperation='source-over';}
  g.fillStyle='#111';g.strokeStyle=INK;g.lineWidth=5;g.beginPath();g.roundRect(-34,-62,68,124,12);g.fill();g.stroke();g.fillStyle='#8fc2ff';g.fillRect(-27,-52,54,104);g.restore();}
function battery(x,y,w,h,level,col){g.save();g.strokeStyle='#fff';g.lineWidth=8;g.strokeRect(x,y,w,h);g.fillStyle='#fff';g.fillRect(x+w,y+h*.3,14,h*.4);g.fillStyle=col;g.fillRect(x+8,y+8,(w-16)*Math.max(0,level),h-16);g.restore();}
function label(txt,x,y,size,col='#fff'){g.save();g.font=`800 ${size}px BS`;g.textAlign='center';g.textBaseline='middle';g.lineJoin='round';g.lineWidth=size*.18;g.strokeStyle='rgba(0,0,0,.85)';g.strokeText(txt,x,y);g.fillStyle=col;g.fillText(txt,x,y);g.restore();}
function shotOf(t){for(let i=TL.lines.length-1;i>=0;i--)if(t>=TL.lines[i].s-.12)return i;return 0;}
const br=t=>Math.sin(t*2.2)*3;
// ---------- cast ----------
const JAY={skin:'#6e4128',hair:'buzz',hairCol:'#0f0b08',shirt:'#141414',print:'built',top:'tank'};
const KEV={skin:'#d9a27a',hair:'curly',hairCol:'#2a1a10',shirt:'#161616',top:'hoodie'};
const RIO={skin:'#e8bf98',hair:'messy',hairCol:'#0c0c10',shirt:'#141414',print:'next'};
const TASHA={skin:'#7a4a2e',hair:'braids',hairCol:'#120c0a',shirt:'#141414',top:'letterman'};
const MARC={skin:'#f0c9a8',hair:'swoop',hairCol:'#6b4626',shirt:'#8c1f2a'};
// ---------- ny05: Jay, built different (gym at dawn) ----------
function ny05(t){window.PROD='BUILT DIFFERENT TANK';const i=shotOf(t),L=TL.lines[i],u=t-L.s;g.save();
  if(i===0){window.CAPY=1600;window.CLOCK='5:00';cam(lerp(1.15,1.3,ss(0,4,u)),540,1100);bedroom(t);person(330,1240,.9,{...JAY,eyes:u>2?'wide':'closed',mouth:'flat',legs:[1.4,1.4],armL:[1.3,.2],armR:[-1.3,-.2]});
    if(u>2.6){g.restore();g.save();jag(810,640,170,100,'BEEP!',t);}}
  else if(i===1){window.CAPY=1600;window.CLOCK='5:01';cam(1.6,540,1050);bedroom(t);person(300,1250,.9,{...MARC,eyes:'closed',mouth:'flat',armR:[-1.6,-.4],legs:[1.4,1.4]});label('z z z',420,700,90,'#9fb4ff');}
  else if(i===2){window.CAPY=1640;cam(lerp(1.5,1.7,ss(0,1.5,u)),540,1080);gym(t);person(540,1400+br(t),1.0,{...JAY,eyes:'focus',mouth:'flat',armL:[.3,.2],armR:[-.3,-.2],blink:0});}
  else if(i===3){window.CAPY=1640;cam(1.0,540,960);xrayBg(t);label('MOTIVATION',540,520,110,'#ffd65a');const lv=1-ss(.5,4.2,u);battery(330,620,420,170,lv,lv>.3?'#7ee35a':'#ff3b30');
    ['MON','TUE','WED'].forEach((d,k)=>label(d,380+k*160,880,70,u>1+k*1.2?'#fff':'rgba(255,255,255,.25)'));
    person(540,1560,.75,{...JAY,xray:true,armL:[.15,.1],armR:[-.15,-.1]});}
  else if(i===4){window.CAPY=1640;cam(1.0,540,960);xrayBg(t);label('HABIT',540,520,120,'#7ee35a');label('AUTOPILOT: ON',540,680,80,'#fff');
    g.save();g.translate(540,860);g.rotate(u*2);g.strokeStyle='#7ee35a';g.lineWidth=14;g.beginPath();g.arc(0,0,90,0,5.2);g.stroke();g.restore();
    person(540,1560,.75,{...JAY,xray:true,armL:[.15,.1],armR:[-.15,-.1]});}
  else if(i===5){window.CAPY=1600;cam(1.4,540,1080);bedroom(t);window.CLOCK='6:30';person(280,1250,.9,{...MARC,eyes:'smug',mouth:'flat',legs:[1.4,1.4],armR:[-1.5,-.3]});phone(420,980,1);}
  else if(i===6){window.CAPY=1640;const lift=Math.abs(Math.sin(u*3.2));cam(1.3,540,1080);gym(t);
    person(540,1400,1.0,{...JAY,eyes:'focus',mouth:lift>.6?'shout':'flat',armL:[-3.0+lift*.9,0],armR:[3.0-lift*.9,0]});const h=person.hands;
    g.fillStyle='#222';g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.moveTo(h[0][0]-120,h[0][1]);g.lineTo(h[1][0]+120,h[1][1]);g.lineWidth=16;g.stroke();
    for(const p of [[h[0][0]-110,h[0][1]],[h[1][0]+110,h[1][1]]]){g.beginPath();g.roundRect(p[0]-20,p[1]-70,40,140,10);g.fill();}}
  else{window.CAPY=1720;const z=lerp(1.6,2.4,ss(0,1.2,u));cam(z,540,1240);gym(t);person(540,1420+br(t),1.0,{...JAY,eyes:u>.8?'smug':'focus',mouth:u>.8?'smirk':'flat'});}
  g.restore();caption(t);wm();endCard(t,TL.lines[7].e+.35);}
// ---------- ny06: Kev, 2 AM scrolling (hoodie) ----------
function ny06(t){window.PROD='NAH-YOU HEAVYWEIGHT HOODIE';const i=shotOf(t),L=TL.lines[i],u=t-L.s;g.save();window.CLOCK='2:00';
  const kev=(o={})=>person(330,1250,.9,{...KEV,legs:[1.4,1.4],armL:[-.9,-1.6],armR:[.9,1.6],look:[0,.6],...o});
  if(i===0){window.CAPY=1600;cam(lerp(1.15,1.3,ss(0,4,u)),540,1100);bedroom(t);kev({eyes:'wide',mouth:'flat',blink:blinkAt(t,.3)});phone(330,1150,1);}
  else if(i===1){window.CAPY=1600;window.CLOCK='2:01';cam(lerp(2.0,2.4,ss(0,1.3,u)),330,920);bedroom(t);kev({eyes:'wide',mouth:'grin'});phone(330,1150,1);}
  else if(i===2){window.CAPY=1640;cam(1.0,540,960);xrayBg(t);person(540,1560,.75,{...KEV,xray:true,armL:[-.9,-1.6],armR:[.9,1.6]});label('INSIDE KEV’S HEAD',540,520,90,'#9fd0ff');}
  else if(i===3){window.CAPY=1640;cam(1.0,540,960);xrayBg(t);person(540,1560,.75,{...KEV,xray:true,armL:[-.9,-1.6],armR:[.9,1.6]});
    const n=Math.floor(u*2.2);for(let k=0;k<Math.min(n,8);k++){label('+1',300+(k%4)*160,520+Math.floor(k/4)*120-((u*60)%40),70,'#ffd65a');}label('MORE!',540,840,100,'#ff5a5a');}
  else if(i===4){window.CAPY=1640;cam(1.0,540,960);xrayBg(t);label('SLEEP',540,520,110,'#9fb4ff');const lv=1-.5*ss(.3,1.6,u);battery(330,620,420,170,lv,lv>.6?'#7ee35a':'#ffb020');label('8 HRS → 4 HRS',540,900,80,'#fff');}
  else if(i===5){window.CAPY=1640;cam(1.5,540,1080);gym(t);person(540,1400,1.0,{...KEV,eyes:'smug',mouth:'open',tilt:.12+Math.sin(t*2)*.05,armL:[.6,.3],armR:[-.6,-.3]});label('ZOMBIE MODE',540,520,100,'#7ee35a');}
  else if(i===6){window.CAPY=1600;window.CLOCK='10:30';cam(1.2,540,1080);bedroom(t);kev({eyes:'calm',mouth:'smirk',armR:[-1.5,-.4]});phone(900,1000,.9,0);label('→',700,980,120,'#7ee35a');}
  else{window.CAPY=1720;const z=lerp(1.5,2.2,ss(0,1.2,u));cam(z,540,1150);bedroom(t);person(540,1420,1.0,{...KEV,eyes:u>.8?'closed':'calm',mouth:'smirk'});}
  g.restore();caption(t);wm();endCard(t,TL.lines[7].e+.35);}
// ---------- ny07: Rio, 100 free throws a day (outdoor court) ----------
function ny07(t){window.PROD='YOU’RE NEXT TEE';const i=shotOf(t),L=TL.lines[i],u=t-L.s;g.save();
  const shoot=(uu,make,x=420)=>{const ph=uu%1.4;const lift=ph<.4?ss(0,.4,ph):1-ss(.4,.7,ph);person(x,1400-lift*40,1.0,{...RIO,eyes:'focus',mouth:'flat',armL:[-2.4*lift-.2,.4],armR:[-2.7*lift-.2,.2]});
    const h=person.hands[1];let bx,by;if(ph<.4){bx=h[0];by=h[1]-50;}else{const q=Math.min(1,(ph-.4)/.8);const tx=make?920:990,ty=make?578:520;bx=lerp(h[0],tx,q);by=lerp(h[1]-50,ty,q)-Math.sin(q*Math.PI)*360;}ball(bx,by,44,uu*6);};
  if(i===0){window.CAPY=1600;cam(lerp(1.1,1.25,ss(0,4,u)),560,1050);outCourt(t);shoot(u,true);label('100 / DAY',300,380,100,'#7ee35a');}
  else if(i===1){window.CAPY=1600;cam(1.15,560,1050);outCourt(t);shoot(u,(Math.floor(u/1.4)%3)===0);label('DAY 1',300,360,110,'#fff');label('40 / 100',300,480,90,'#ff5a5a');}
  else if(i===2){window.CAPY=1640;cam(1.0,540,960);xrayBg(t);label('100 × 365',540,560,130,'#ffd65a');const n=Math.floor(36500*ss(.3,3,u));label(n.toLocaleString('en-US'),540,760,170,'#7ee35a');label('SHOTS',540,900,80,'#fff');}
  else if(i===3){window.CAPY=1640;cam(1.0,540,960);xrayBg(t);person(540,1560,.75,{...RIO,xray:true,armL:[-1.8,.4],armR:[-2.0,.3]});
    g.save();g.shadowColor='#ffd65a';g.shadowBlur=24;g.strokeStyle='#ffe28a';g.lineWidth=10;g.beginPath();const q=ss(0,2.5,u);for(let k=0;k<=40*q;k++){const a=k/40*Math.PI*4;g.lineTo(540+Math.cos(a)*120*(1-k/80),760+Math.sin(a)*50);}g.stroke();g.restore();}
  else if(i===4){window.CAPY=1640;cam(1.0,540,960);xrayBg(t);label('MUSCLE',540,620,150,'#7ee35a');label('MEMORY',540,780,150,'#7ee35a');}
  else if(i===5){window.CAPY=1600;cam(1.15,560,1050);outCourt(t);shoot(u,true);label('DAY 365',300,360,110,'#fff');label('9 / 10',300,480,100,'#7ee35a');}
  else if(i===6){window.CAPY=1600;cam(2.0,760,1010);outCourt(t);person(760,1400,1.0,{...MARC,eyes:'wide',mouth:'open',look:[-.5,0],armL:[.4,.3],armR:[-.4,-.3]});}
  else{window.CAPY=1720;const z=lerp(1.6,2.4,ss(0,1.2,u));cam(z,540,1240);outCourt(t);person(540,1420+br(t),1.0,{...RIO,eyes:u>.6?'smug':'focus',mouth:u>.6?'smirk':'flat',armR:[-1.25,-1.1]});}
  g.restore();caption(t);wm();endCard(t,TL.lines[7].e+.35);}
// ---------- ny08: Tasha, first impressions (party, letterman) ----------
function ny08(t){window.PROD='NAH-YOU LETTERMAN JACKET';const i=shotOf(t),L=TL.lines[i],u=t-L.s;g.save();
  if(i===0){window.CAPY=1600;cam(lerp(1.1,1.25,ss(0,4,u)),540,1050);party(t);person(lerp(120,420,ss(0,2.5,u)),1400+br(t),1.0,{...TASHA,eyes:'calm',mouth:'flat',legs:[Math.sin(u*6)*.3,-Math.sin(u*6)*.3],blink:blinkAt(t,.1)});}
  else if(i===1){window.CAPY=1600;cam(1.6,345,1080);party(t);person(345,1400,1.0,{...MARC,eyes:'wide',mouth:'flat',armL:[.2,.4],armR:[-.2,-.4],look:[.6,.2]});label('…',300,700,140,'#fff');}
  else if(i===2){window.CAPY=1640;cam(lerp(2.0,2.3,ss(0,1.5,u)),420,960);party(t);person(420,1400,1.0,{...TASHA,eyes:'smug',mouth:'smirk'});}
  else if(i===3){window.CAPY=1640;cam(1.0,540,960);xrayBg(t);label('FIRST IMPRESSION',540,520,90,'#ffd65a');const s=Math.max(0,3-Math.floor(u));label(u<3?String(s)+'s':'✓',540,760,220,u<3?'#fff':'#7ee35a');person(540,1560,.75,{...TASHA,xray:true});}
  else if(i===4){window.CAPY=1600;cam(1.2,540,1050);party(t);const k=Math.min(2,Math.floor(u/1.3));
    person(420,1400,1.0,{...TASHA,eyes:k>=1?'calm':'focus',mouth:k>=1?'grin':'flat',armR:k>=2?[-2.4,.3]:[-.2,-.2]});person(800,1420,.92,{skin:'#c98e62',hair:'buzz',hairCol:'#222',shirt:'#3a6ea5',eyes:'wide',mouth:k>=2?'grin':'flat',look:[-.6,0]});
    ['STAND TALL','SMILE FIRST','SAY HI'].forEach((w,j)=>{if(j<=k)label('✓ '+w,540,380+j*110,80,'#7ee35a');});}
  else if(i===5){window.CAPY=1600;cam(1.0,540,960);party(t);label('30 MIN LATER',540,420,110,'#fff');person(540,1400,.95,{...TASHA,eyes:'calm',mouth:'grin'});}
  else if(i===6){window.CAPY=1600;cam(1.0,540,960);party(t);const names=['TASHA!','YO TASHA','TASHA!!'];names.forEach((n,j)=>{if(u>j*.3)jag(220+j*320,520+(j%2)*140,150,80,n,t);});person(540,1400,.95,{...TASHA,eyes:'smug',mouth:'grin',armL:[2.6,-.3],armR:[-2.6,.3]});}
  else{window.CAPY=1720;const z=lerp(1.6,2.3,ss(0,1.2,u));cam(z,540,1240);party(t);person(540,1420+br(t),1.0,{...TASHA,eyes:u>.8?'smug':'calm',mouth:u>.8?'smirk':'flat'});}
  g.restore();caption(t);wm();endCard(t,TL.lines[7].e+.35);}
window.EPS={ny04,ny05,ny06,ny07,ny08};
