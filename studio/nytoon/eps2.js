// Episodes for toon2.html (NAH-YOU TOONS v2 style). Each episode: function nvNN(t){...} using helpers in toon2.html; register in window.EPS.
// ---------------- episode nv01: why you wake up right before your alarm ----------------
function nv01(t){T0=t;window.PROD='TALK LESS BALL MORE TEE';const last=TL.lines.length-1,END=LN(last).e+.35;
  g.save();
  if(sh(0)){ // sitting up in bed, eyes wide, 6:29
    window.CAPY=1560;const u=ss(0,LN(0).e,t);cam(lerp(1.45,1.6,u),640,1000);bedroom(t,{txt:'6:29'});bed(540,1180);
    kev(540,1240,1,{face:t<1.0?'sleep':'shock',legs:false,armL:[.5,.4],armR:[.5,.4],bob:t<1?20:0},t);bedFront(540,1180,-120);}
  else if(sh(1)){ // tight smug close-up, then push into the head
    window.CAPY=330;const u=ss(LN(1).s,LN(1).e,t);cam(lerp(2.6,3.4,ss(LN(1).e-.6,LN(1).e+.05,t)),540,640);bedroom(t,{txt:'6:29'});bed(540,1180);
    kev(540,1240,1,{face:'smug',talk:0,legs:false,armL:[.5,.4],armR:[.5,.4],look:.3},t);bedFront(540,1180,-120);}
  else if(sh(2)){ // night before: standing in the tee holding the clock... then crashes into bed
    const L=LN(2),w=L.words,crash=w[w.length-1].s-.1,u=t-L.s;window.CAPY=1640;
    cam(lerp(1.15,1.25,ss(L.s,L.e,t)),580,1050);bedroom(t,{txt:t<crash-1.2?'10:58':'11:00'});
    if(t<crash){bed(540,1180);bedFront(540,1180,-110);const setting=t>w[7].s-.2;
      kev(300,1560,.82,{face:setting?'calm':'smug',armL:[.2,.15],armR:setting?[1.9,.6]:[.25,.15],blink:blinkAt(t),bob:Math.abs(Math.sin(u*3))*-6},t);
      if(t<w[4].s+.6){tag(300,560,'TALK LESS TEE ✓',NY_G,52);}if(setting)tag(760,1120,'ALARM 6:30','#ff6b5e',54);}
    else{const v=ss(crash,crash+.35,t);bed(540,1180);kev(540,lerp(1180,1290,v),1,{face:'sleep',legs:false,armL:[.5,.4],armR:[.5,.4],tilt:-.25*v},t);bedFront(540,1180,-90);zzz(680,820,t);}}
  else if(sh(3)){ // camera dives into the head -> X-ray reveal
    const L=LN(3),u=ss(L.s,L.e,t);window.CAPY=1660;
    if(u<.35){cam(lerp(1.2,3.2,ss(0,.35,u)),540,690);bedroom(t,{txt:'11:00'});bed(540,1180);kev(540,1290,1,{face:'sleep',legs:false,tilt:-.25},t);bedFront(540,1180,-90);zzz(680,820,t);
      g.restore();g.save();g.fillStyle=`rgba(140,210,255,${ss(.2,.35,u)})`;g.fillRect(0,0,W,H);}
    else{xrayRoom(t);cam(lerp(1.05,1.15,u),540,1050);kev(540,1500,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:0},t);tag(540,260,'INSIDE KEV',  '#9fd8ff',70);
      g.restore();g.save();g.fillStyle=`rgba(200,235,255,${1-ss(.35,.5,u)})`;g.fillRect(0,0,W,H);}}
  else if(sh(4)){ // brain close-up, master clock glows, cell counter
    const L=LN(4),u=t-L.s;window.CAPY=1680;xrayRoom(t);cam(lerp(2.3,2.6,ss(L.s,L.e,t)),540,900);
    kev(540,1500,1.05,{xray:true,armL:[.35,.2],armR:[.35,.2],glow:ss(.6,1.6,u)},t);
    g.restore();g.save();const n=Math.round(20000*ss(1.8,3.6,u));if(u>1.2)tag(540,330,'MASTER CLOCK','#ffe27a',72);if(u>1.8)tag(540,480,n.toLocaleString()+' CELLS','#9fd8ff',64);}
  else if(sh(5)){ // sleep depth meter, hormones lift him up
    const L=LN(5),u=ss(L.s+.8,L.e-.3,t);window.CAPY=1700;sleepMeter(t,u);if(t>L.s+1.2)tag(760,1560,'WAKE-UP HORMONES ↑','#ffb347',56);}
  else if(sh(6)){ // evidence board
    const L=LN(6),u=ss(L.s,L.e-.2,t);window.CAPY=1720;cam(lerp(1.08,1.15,u),540,lerp(820,1000,u));corkboard(t,u);}
  else{ // alarm rings, Kev already awake & smug, then grin
    const L=LN(7),u=t-L.s;const ring=u>.5&&u<2.4;window.CAPY=1560;cam(lerp(1.45,1.6,ss(L.s,L.e,t)),600,980);
    bedroom(t,{txt:u<.5?'6:29':'6:30',ring});bed(540,1180);
    kev(540,1240,1,{face:u<2.2?'smug':'grin',legs:false,armL:[.5,.4],armR:u<2.2?[2.2,1.6]:[2.6,.5],look:u<2.2?.6:0},t);bedFront(540,1180,-120);
    if(u>.3&&u<2.2){g.save();g.font='800 90px BS';g.fillStyle='#fff';g.textAlign='center';g.globalAlpha=.9;g.fillText('BEEP!',870-14*Math.sin(t*30),1110);g.restore();}}
  g.restore();vignette(.65);
  if(t<END)caption(t);wm();endCard(t,END);}

window.EPS=Object.assign(window.EPS||{},{nv01,lineup:(t)=>lineup(t)});
