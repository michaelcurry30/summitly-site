// CHOSEN — Bible story shorts. Our own cartoon cast (round heads, robes, beards). Modern bookends: a character in a black CHOSEN hoodie.
// Helpers prefixed bbX_. Episodes: bb01 (Jesus calms the storm, Mark 4:35-41).
const bbX_JESUS={skin:'#c98d62',hair:'long',hairCol:'#4a2c17',beard:'#4a2c17',robe:'#efe8da',sash:'#3f7fb4',shirt:'#efe8da'};
const bbX_PETER={skin:'#b97a52',hair:'cloth',clothCol:'#8c6a45',hairCol:'#2a1a10',beard:'#5a3a22',robe:'#6f5a43',sash:'#a8432f',shirt:'#6f5a43'};
const bbX_JOHN={skin:'#d6a07a',hair:'messy',hairCol:'#2a1a10',robe:'#5b6f8a',sash:'#c9a24a',shirt:'#5b6f8a'};
const bbX_ANDREW={skin:'#a86d48',hair:'cloth',clothCol:'#b9a27c',hairCol:'#2a1a10',beard:'#3a2616',robe:'#8a4f36',sash:'#e2c28a',shirt:'#8a4f36'};
const bbX_MODERN={...CAST.DRE,shirt:'#141414',print:'chosen'};

function bbX_sky(t,storm){ // night sky; storm = 0..1
  const sg=g.createLinearGradient(0,-800,0,1100);sg.addColorStop(0,lerp(0,1,storm)>.5?'#0b0f1c':'#101a33');sg.addColorStop(1,storm>.5?'#2a3446':'#2b4a6b');g.fillStyle=sg;g.fillRect(-800,-900,W+1600,2100);
  if(storm<.5){g.fillStyle='rgba(255,255,255,.8)';const r=R(7);for(let i=0;i<60;i++){const x=r()*W*1.6-300,y=r()*900-700;g.fillRect(x,y,3,3);}
    g.fillStyle='#f3f0dd';g.beginPath();g.arc(820,-260,70,0,7);g.fill();}
  // clouds
  g.save();g.globalAlpha=.35+.55*storm;g.fillStyle=storm>.5?'#1c2230':'#3a4a66';for(let i=0;i<7;i++){const x=((i*260+t*40*(1+storm*3))%1900)-500,y=-420+(i%3)*120;g.beginPath();g.ellipse(x,y,260,90,0,0,7);g.ellipse(x+150,y+20,200,80,0,0,7);g.fill();}g.restore();
  // lightning flash
  if(storm>.5){const f=(t*1.3)%3.1;if(f<.12){g.fillStyle='rgba(230,240,255,.55)';g.fillRect(-800,-900,W+1600,2100);g.strokeStyle='#fffbe0';g.lineWidth=9;g.shadowColor='#fff';g.shadowBlur=30;g.beginPath();let x=300+((t*97)|0)%500,y=-700;g.moveTo(x,y);for(let k=0;k<6;k++){x+=(k%2?60:-50);y+=120;g.lineTo(x,y);}g.stroke();g.shadowBlur=0;}}}
function bbX_sea(t,storm,front){ // front=true draws the near waves over the boat
  const amp=lerp(10,90,storm),sp=lerp(1,3.2,storm);const y0=front?1240:1060;
  g.save();g.fillStyle=front?(storm>.5?'#1b3550':'#2d5b7c'):(storm>.5?'#22405c':'#35698c');g.beginPath();g.moveTo(-800,y0);
  for(let x=-800;x<=W+800;x+=40){g.lineTo(x,y0+Math.sin(x*.012+t*sp+(front?2:0))*amp+Math.sin(x*.031-t*sp*1.4)*amp*.35);}g.lineTo(W+800,2200);g.lineTo(-800,2200);g.closePath();g.fill();
  g.strokeStyle='rgba(255,255,255,'+(.15+.5*storm)+')';g.lineWidth=8;g.beginPath();for(let x=-800;x<=W+800;x+=40){const y=y0+Math.sin(x*.012+t*sp+(front?2:0))*amp+Math.sin(x*.031-t*sp*1.4)*amp*.35;x===-800?g.moveTo(x,y):g.lineTo(x,y);}g.stroke();g.restore();}
function bbX_rain(t,storm){if(storm<.5)return;g.save();g.strokeStyle='rgba(200,220,255,.35)';g.lineWidth=4;const r=R(3);for(let i=0;i<140;i++){const x=(r()*W*1.8-400+t*300)%(W+400)-200,y=((r()*2400+t*1900)%2400)-600;g.beginPath();g.moveTo(x,y);g.lineTo(x-26,y+70);g.stroke();}g.restore();}
function bbX_boatBack(x,y,rock){g.save();g.translate(x,y);g.rotate(rock);g.strokeStyle=INK;g.lineWidth=12;g.beginPath();g.moveTo(0,-40);g.lineTo(0,-760);g.stroke();
  g.fillStyle='#e8dcc0';g.beginPath();g.moveTo(14,-740);g.quadraticCurveTo(260,-520,300,-140);g.lineTo(14,-150);g.closePath();g.fill();g.lineWidth=8;g.stroke();g.restore();}
function bbX_boatFront(x,y,rock){g.save();g.translate(x,y);g.rotate(rock);g.fillStyle='#6b4226';g.strokeStyle=INK;g.lineWidth=10;g.beginPath();g.moveTo(-520,-160);g.lineTo(520,-160);g.quadraticCurveTo(470,40,300,70);g.lineTo(-300,70);g.quadraticCurveTo(-470,40,-520,-160);g.closePath();g.fill();g.stroke();
  g.strokeStyle='rgba(0,0,0,.3)';g.lineWidth=6;for(let k=0;k<3;k++){g.beginPath();g.moveTo(-500+k*12,-110+k*55);g.lineTo(500-k*12,-110+k*55);g.stroke();}g.fillStyle='#4a2c17';g.fillRect(-530,-178,1060,26);g.restore();}
function bbX_sleeper(x,y,s,t,o){ // Jesus lying on a cushion
  g.save();g.translate(x,y);g.scale(s,s);g.fillStyle='#a8432f';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(-210,-60,200,80,30);g.fill();g.stroke();
  g.rotate(-Math.PI/2);kev(0,170,.62,{...bbX_JESUS,face:o.face||'sleep',armL:[.1,.1],armR:[.1,.1],blink:0,...o},t);g.restore();}
function bbX_title(txt,y,a){g.save();g.globalAlpha=a;g.font='700 64px CZ';g.textAlign='center';g.fillStyle='#f5f3ee';g.shadowColor='rgba(0,0,0,.7)';g.shadowBlur=18;g.fillText(txt,540,y);g.restore();}
function bbX_room(t){bedroom(t,null);}
function bbX_end(t,t0,ref){const u=t-t0;if(u<0)return;const a=ss(0,.45,u);g.save();g.globalAlpha=a*.94;g.fillStyle='#0a0a0a';g.fillRect(0,0,W,H);g.globalAlpha=a;spot(540,1100,700,.25);
  kev(540,1680,.95,{...bbX_MODERN,face:'grin',armL:[.25,.15],armR:[1.6,.9]},t);
  g.textAlign='center';g.fillStyle='#f5f3ee';g.strokeStyle='#f5f3ee';g.lineWidth=10;g.beginPath();g.moveTo(540,250);g.lineTo(540,360);g.moveTo(505,285);g.lineTo(575,285);g.stroke();
  g.font='700 150px CZ';g.fillText('CHOSEN',540,520);g.fillRect(250,550,580,4);g.font='700 44px CZ';g.fillText(ref,540,630);
  g.font='600 50px HG';g.fillStyle='#ddd';g.fillText('Follow for a Bible story every day',540,730);g.font='800 54px BS';g.fillStyle='#f5f3ee';g.fillText('CHOSEN CLOTHING · LINK IN BIO',540,820);g.restore();}

function bb01(t){T0=t;const last=TL.lines.length-1,END=LN(last).e+.4;g.save();
  const calmAt=LN(7).s+.3;const storm=t<LN(2).s?0:t<calmAt?ss(LN(2).s,LN(2).s+1.2,t):1-ss(calmAt,calmAt+1.4,t);const rock=Math.sin(t*2.4)*.06*storm;
  if(sh(0)||sh(last)){ // modern bookend: Dre in his CHOSEN hoodie, late night, overthinking
    const i=sh(0)?0:last,L=LN(i),u=ss(L.s,L.e,t);window.CAPY=1640;cam(lerp(1.2,1.32,u),540,1040);bbX_room(t);
    kev(540,1560,.95,{...bbX_MODERN,face:i?'grin':'calm',armL:[.2,.15],armR:i?[1.7,.7]:[.3,.2],blink:blinkAt(t),bob:i?0:Math.sin(t*2)*4},t);
    if(i===0){g.save();g.globalAlpha=.85;for(let k=0;k<3;k++){g.font='800 70px BS';g.fillStyle='#ff6b5e';g.textAlign='center';g.fillText(['BILLS','STRESS','WHAT IF...'][k],[320,760,540][k],[720,820,600][k]+Math.sin(t*3+k)*12);}g.restore();}
    else window.__bbTitle=ss(L.s,L.s+.6,t);}
  else{ // the lake
    let i=1;for(let k=1;k<last;k++)if(t>=LN(k).s-.09)i=k;const L=LN(i),u=ss(L.s,L.e,t);
    const shot={1:[1.0,540,900],2:[1.15,540,980],3:[1.6,330,880],4:[1.8,780,1030],5:[1.45,580,900],6:[1.35,640,860],7:[1.0,540,900],8:[1.5,560,880],9:[1.25,640,900]}[i]||[1,540,900];
    window.CAPY=i===4?1500:1640;cam(lerp(shot[0],shot[0]*1.06,u),shot[1],shot[2]);
    bbX_sky(t,storm);bbX_sea(t,storm,false);bbX_boatBack(540,1150,rock);
    const scared=storm>.5;const bob=k=>Math.sin(t*3+k)*12*storm;
    const standing=i>=6;
    kev(260,1060+bob(1),.62,{...bbX_PETER,face:i===5?'shock':scared?'shock':'calm',armL:scared?[2.4,.4]:[.3,.2],armR:scared?[2.6,.3]:[.3,.2],blink:blinkAt(t,1)},t);
    kev(400,1050+bob(2),.58,{...bbX_JOHN,face:scared?'shock':'grin',armL:scared?[2.2,.6]:[.3,.2],armR:[.3,.2],blink:blinkAt(t,2)},t);
    kev(150,1070+bob(3),.6,{...bbX_ANDREW,face:scared?'shock':'calm',armL:[.3,.2],armR:scared?[2.5,.2]:[.3,.2],blink:blinkAt(t,3)},t);
    if(standing){const pose=i===6?[2.5,.1]:[.4,.3];kev(780,1060,.66,{...bbX_JESUS,face:i===8?'calm':'calm',armL:pose,armR:pose,blink:blinkAt(t,4)},t);
      if(i===6){g.save();g.globalAlpha=.6*ss(L.s,L.s+.8,t);g.strokeStyle='#fff6d0';g.lineWidth=6;for(let k=1;k<5;k++){g.beginPath();g.arc(780,700,k*90*(1+((t*1.5)%1)*.3),0,7);g.stroke();}g.restore();}}
    else{g.fillStyle='#a8432f';g.strokeStyle=INK;g.lineWidth=8;g.beginPath();g.roundRect(700,900,230,70,28);g.fill();g.stroke();
      kev(830,1120,.62,{...bbX_JESUS,pose:'sit',face:i===5&&u>.6?'calm':'sleep',tilt:i===5&&u>.6?0:.32,armL:[.4,.6],armR:[.4,.6],blink:0},t);}
    bbX_boatFront(540,1150,rock);bbX_sea(t,storm*.85,true);bbX_rain(t,storm);
    if(i===4){g.save();g.font='800 70px BS';g.fillStyle='#fff';g.globalAlpha=.9;g.fillText('z',900+Math.sin(t*2)*10,860-((t*60)%120));g.fillText('Z',960,780-((t*50)%140));g.restore();}
    if(i===1)bbX_title('Mark 4:35',300,ss(L.s,L.s+.5,t)*(1-ss(L.e-.4,L.e,t)));}
  g.restore();vignette(.5);if(sh(last)&&window.__bbTitle){g.save();g.globalAlpha=window.__bbTitle;g.font='700 58px CZ';g.textAlign='center';g.fillStyle='#f5f3ee';g.shadowColor='rgba(0,0,0,.8)';g.shadowBlur=20;g.fillText('HE IS IN THE BOAT',540,300);g.fillText('WITH YOU.',540,380);g.restore();}window.__bbTitle=0;if(t<END)caption(t);bbX_end(t,END,'MARK 4:35-41');}
window.EPS=Object.assign(window.EPS||{},{bb01});
