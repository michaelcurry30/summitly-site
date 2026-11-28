// Episodes + scenery for bible.html (storybook sketch style).
// ---------- scenery ----------
function sky(t,storm,dusk=1){const sg=g.createLinearGradient(0,-900,0,1200);
  if(storm>.5){sg.addColorStop(0,'#141a26');sg.addColorStop(1,'#3a4658');}else{sg.addColorStop(0,'#26365e');sg.addColorStop(.55,'#c2768a');sg.addColorStop(1,'#f1b878');}
  g.fillStyle=sg;g.fillRect(-1200,-1200,W+2400,2600);
  if(storm<=.5){g.fillStyle='rgba(255,240,210,.9)';g.beginPath();g.arc(780,180,70,0,7);g.fill();g.fillStyle='rgba(255,230,190,.25)';g.beginPath();g.arc(780,180,140,0,7);g.fill();}
  g.save();g.globalAlpha=storm>.5?.9:.5;g.fillStyle=storm>.5?'#252c3a':'#e8a9a0';for(let i=0;i<8;i++){const x=((i*300+t*(storm>.5?120:20))%2200)-700,y=(storm>.5?-60:120)+(i%3)*90;g.beginPath();g.ellipse(x,y,300,70,0,0,7);g.ellipse(x+170,y+24,220,60,0,0,7);g.fill();}g.restore();
  if(storm>.5){const f=(t*1.1)%3.3;if(f<.14){g.fillStyle='rgba(230,240,255,.5)';g.fillRect(-1200,-1200,W+2400,2600);g.save();g.strokeStyle='#fffbe0';g.lineWidth=10;g.shadowColor='#fff';g.shadowBlur=40;g.beginPath();let x=260+((t*97)|0)%560,y=-300;g.moveTo(x,y);for(let k=0;k<7;k++){x+=(k%2?70:-60);y+=150;g.lineTo(x,y);}g.stroke();g.restore();}}}
function hills(storm){g.fillStyle=storm>.5?'#2a3242':'#5b4d6e';g.beginPath();g.moveTo(-1200,980);for(let x=-1200;x<=W+1200;x+=120)g.lineTo(x,880-Math.abs(Math.sin(x*.004))*160-Math.sin(x*.011)*40);g.lineTo(W+1200,1100);g.lineTo(-1200,1100);g.fill();}
function water(t,storm,y0,front){const amp=lerp(8,95,storm),sp=lerp(.8,3,storm);
  const col=storm>.5?(front?'#1c3047':'#243b55'):(front?'#3c5f86':'#5a7aa0');g.fillStyle=col;g.beginPath();g.moveTo(-1200,y0);
  const yy=x=>y0+Math.sin(x*.01+t*sp+(front?2:0))*amp+Math.sin(x*.027-t*sp*1.3)*amp*.4;for(let x=-1200;x<=W+1200;x+=30)g.lineTo(x,yy(x));g.lineTo(W+1200,3000);g.lineTo(-1200,3000);g.fill();
  g.save();g.strokeStyle=storm>.5?'rgba(255,255,255,.55)':'rgba(255,225,190,.45)';g.lineWidth=7;g.beginPath();for(let x=-1200;x<=W+1200;x+=30){x===-1200?g.moveTo(x,yy(x)):g.lineTo(x,yy(x));}g.stroke();
  if(storm<=.5){g.strokeStyle='rgba(255,230,190,.35)';g.lineWidth=5;for(let i=0;i<14;i++){const x=640+((i*137)%400)-200,y=y0+60+i*30;g.beginPath();g.moveTo(x-60+i*3,y);g.lineTo(x+60-i*3,y);g.stroke();}}g.restore();}
function rain(t,storm){if(storm<.5)return;g.save();g.strokeStyle='rgba(210,225,255,.4)';g.lineWidth=4;const r=R(5);for(let i=0;i<170;i++){const x=(r()*W*2-500+t*380)%(W+600)-300,y=((r()*2600+t*2100)%2600)-700;g.beginPath();g.moveTo(x,y);g.lineTo(x-30,y+80);g.stroke();}g.restore();}
function boatBack(x,y,rock){g.save();g.translate(x,y);g.rotate(rock);ln(14);g.beginPath();g.moveTo(-80,-60);g.lineTo(-80,-1060);g.stroke();
  sketch(()=>{g.beginPath();g.moveTo(-66,-1040);g.quadraticCurveTo(260,-760,330,-200);g.lineTo(-66,-210);g.closePath();},'#ece3cf',7);g.restore();}
function boatFront(x,y,rock){g.save();g.translate(x,y);g.rotate(rock);
  sketch(()=>{g.beginPath();g.moveTo(-640,-230);g.lineTo(640,-230);g.quadraticCurveTo(590,40,380,90);g.lineTo(-380,90);g.quadraticCurveTo(-590,40,-640,-230);g.closePath();},'#8a5a36',9);
  g.save();ln(6);g.globalAlpha=.35;for(let k=0;k<3;k++){g.beginPath();g.moveTo(-610+k*20,-160+k*70);g.lineTo(610-k*20,-160+k*70);g.stroke();}g.restore();
  sketch(()=>{g.beginPath();g.rect(-660,-250,1320,34);},'#5e3a20',7);g.restore();}
function room(t,dawn){ // modern bedroom at night, rain on the window
  const wg=g.createLinearGradient(0,0,0,1600);wg.addColorStop(0,'#2b2a33');wg.addColorStop(1,'#44404a');g.fillStyle=wg;g.fillRect(-1200,-1200,W+2400,2400);
  g.fillStyle='#5a4636';g.fillRect(-1200,1200,W+2400,1600);ln(6);g.beginPath();g.moveTo(-1200,1200);g.lineTo(W+1200,1200);g.stroke();
  g.save();g.translate(540,640);const wc=g.createLinearGradient(0,-300,0,300);wc.addColorStop(0,dawn?'#f0b37a':'#141c30');wc.addColorStop(1,dawn?'#ffd9a0':'#2b3a5c');sketch(()=>{g.beginPath();g.rect(-300,-300,600,600);},'#000',10);g.fillStyle=wc;g.fillRect(-295,-295,590,590);
  if(!dawn){g.strokeStyle='rgba(200,220,255,.35)';g.lineWidth=3;const r=R(9);for(let i=0;i<40;i++){const x=r()*560-280,y=((r()*600+t*400)%600)-300;g.beginPath();g.moveTo(x,y);g.lineTo(x-6,y+30);g.stroke();}}
  ln(12);g.beginPath();g.moveTo(0,-300);g.lineTo(0,300);g.moveTo(-300,0);g.lineTo(300,0);g.stroke();g.restore();
  const lg=g.createRadialGradient(540,900,40,540,1000,900);lg.addColorStop(0,'rgba(255,210,150,.28)');lg.addColorStop(1,'rgba(255,210,150,0)');g.fillStyle=lg;g.fillRect(-600,0,2200,2000);}
function vignette(a=.55){const vg=g.createRadialGradient(W/2,H*.48,H*.25,W/2,H*.5,H*.78);vg.addColorStop(0,'rgba(0,0,0,0)');vg.addColorStop(1,`rgba(0,0,0,${a})`);g.fillStyle=vg;g.fillRect(0,0,W,H);}
function rays(x,y,t,a){g.save();g.globalAlpha=a;g.translate(x,y);for(let i=0;i<14;i++){g.rotate(Math.PI*2/14);const gr=g.createLinearGradient(0,0,0,-900);gr.addColorStop(0,'rgba(255,240,200,.5)');gr.addColorStop(1,'rgba(255,240,200,0)');g.fillStyle=gr;g.beginPath();g.moveTo(-26,0);g.lineTo(26,0);g.lineTo(70,-900);g.lineTo(-70,-900);g.fill();}g.restore();}
function talk(t,i){const ws=LN(i).words||[];for(const w of ws)if(t>=w.s&&t<w.e)return Math.sin((t-w.s)*22)>0?'open':'line';return 'line';}
function endCard(t,t0,ref){const u=t-t0;if(u<0)return;const a=ss(0,.45,u);g.save();g.globalAlpha=a;g.fillStyle='#0a0a0a';g.fillRect(0,0,W,H);
  fig(540,1760,.82,{modern:true,head:'short',beard:false,eyes:'open',mouth:'smile',arms:[[.2,.1],[2.2,.5]]},t);
  g.textAlign='center';g.fillStyle='#f5f3ee';g.strokeStyle='#f5f3ee';g.lineWidth=10;g.beginPath();g.moveTo(540,230);g.lineTo(540,340);g.moveTo(505,265);g.lineTo(575,265);g.stroke();
  g.font='700 150px CZ';g.fillText('CHOSEN',540,500);g.fillRect(250,530,580,4);g.font='700 44px CZ';g.fillText(ref,540,610);
  g.font='800 46px MS';g.fillStyle='#ffd54a';g.fillText('FOLLOW FOR A BIBLE STORY EVERY DAY',540,710);g.font='600 44px HG';g.fillStyle='#ddd';g.fillText('Chosen clothing · link in bio',540,790);g.restore();}

// ---------- cast ----------
const JESUS={head:'long',hairCol:'#e2ddd3',beard:true,robe:WH,mantle:'#e9e5dc',sash:'#c9a24a'};
const PETER={head:'cloth',clothCol:'#ece7dd',band:'#8b8378',beard:true,robe:'#ece7dd',sash:'#9aa28c'};
const JOHN={head:'short',hairCol:'#e6e1d8',beard:false,robe:WH,sash:'#b8a37a'};
const ANDREW={head:'cloth',clothCol:WH,band:'#a39a8a',beard:true,robe:'#f1eee8'};
const MODERN={modern:true,head:'short',beard:false};

// ---------- bb01: Jesus calms the storm (Mark 4:35-41) ----------
function bb01(t){const n=TL.lines.length,last=n-1,END=LN(last).e+.5;let i=0;for(let k=0;k<n;k++)if(t>=LN(k).s-.12)i=k;const L=LN(i),u=ss(L.s,L.e,t);
  const calmAt=LN(7).s+.2;const storm=(t>=LN(2).s&&t<calmAt)?1:0;const rock=Math.sin(t*2.6)*.07*storm;const sway=k=>Math.sin(t*3+k)*14*storm;
  g.save();CAPY=1000;
  if(i===0||i===last){const z=i?lerp(1.5,1.2,u):lerp(1.15,1.45,u);cam(z,540,i?980:1020);room(t,i===last);
    fig(540,1560,1,{...MODERN,eyes:i?'open':'down',mouth:i?'smile':'line',tilt:i?0:.1,arms:i?[[.3,.1],[2.3,.4]]:[[.32,.1],[.32,.1]],breath:1},t);CAPY=i?1500:1500;}
  else{CAPY=1480;const shots={1:[1.0,540,860],2:[1.1,540,860],3:[1.9,420,760],4:[2.0,860,860],5:[1.35,600,820],6:[1.4,780,720],7:[1.0,540,860],8:[1.35,640,780],9:[.85,540,900]};const sh=shots[i];
    const z=sh[0]*lerp(1,i===3||i===6?1.12:1.05,u);cam(z,sh[1],sh[2],i===2?rock*.5:0);
    sky(t,storm);hills(storm);water(t,storm,1060,false);boatBack(560,1300,rock);
    const scared=storm>.5;
    fig(230,1390+sway(1),.78,{...ANDREW,eyes:scared?'wide':'open',mouth:scared?'open':'line',arms:scared?[[1.9,.5],[2.0,.4]]:[[.25,.1],[.25,.1]]},t);
    fig(600,1400+sway(3),.76,{...JOHN,eyes:scared?'wide':'open',mouth:scared?'open':'smile',arms:scared?[[1.9,.6],[.3,.2]]:[[.25,.1],[.25,.1]]},t);
    fig(420,1380+sway(2),.82,{...PETER,eyes:scared||i===5?'wide':'open',mouth:i===5?talk(t,5):scared?'shout':'line',arms:i===5?[[.3,.2],[1.7,.3]]:scared?[[2.0,.5],[2.1,.4]]:[[.25,.1],[.3,.2]],look:i===5?1:0},t);
    if(i<6){ // asleep, sitting at the back of the boat
      const woke=i===5&&u>.7;fig(860,1480,.8,{...JESUS,eyes:woke?'open':'closed',mouth:'line',tilt:woke?0:.32,arms:[[.35,.5],[.35,.5]]},t);
      if(i===4){g.save();g.font='900 80px MS';g.fillStyle='#fff';g.globalAlpha=.85;g.fillText('z',940+Math.sin(t*2)*8,700-((t*60)%120));g.fillText('Z',1000,620-((t*45)%140));g.restore();}}
    else{if(i===6)rays(820,640,t,ss(L.s,L.s+.6,t)*.8);
      fig(830,1390,.86,{...JESUS,eyes:'open',mouth:i===6||i===8?talk(t,i):'smile',arms:i===6?[[.3,.2],[2.5,.15]]:i===8?[[.3,.2],[1.3,.5]]:[[.25,.15],[.25,.15]],look:i===8?-1:0},t);}
    boatFront(560,1300,rock);water(t,storm*.85,1360,true);rain(t,storm);
    if(i===1){g.save();g.globalAlpha=ss(L.s,L.s+.4,t)*(1-ss(L.e-.4,L.e,t));g.font='700 70px CZ';g.textAlign='center';g.fillStyle='#fff';g.shadowColor='rgba(0,0,0,.7)';g.shadowBlur=16;g.fillText('MARK 4:35',540,420);g.restore();}}
  g.restore();vignette(i===0||i===last?.6:.45);
  whip(t,TL.lines.slice(1).map(l=>l.s-.12));
  if(t<END)caption(t);endCard(t,END,'MARK 4:35-41');}
window.EPS.bb01=bb01;
