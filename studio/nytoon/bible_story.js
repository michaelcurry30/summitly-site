// ---------- GENERIC BIBLE STORY ENGINE ----------
// Any episode id without its own function in EPS uses story(): the whole video is driven by <id>.json.
// <id>.json: {id, voice, speed, ref:"MARK 4:35-41", lines:[{vo, scene, cast:[...], cam:[z,cx,cy], fx:[...], title}]}
//   scene: room | dawnroom | desert | hills | village | night | lake | storm | temple | garden | tomb | palace | fire | sea | heaven | mountain | crowd
//   cast item: {c:"JESUS"|"PETER"|"JOHN"|"ANDREW"|"MAN"|"YOUNG"|"OLD"|"WOMAN"|"GIRL"|"KING"|"SOLDIER"|"CHILD"|"ANGEL"|"MODERN"|"MOSES"|"DAVID"|"GOLIATH",
//               x:540, pose:"stand|talk|point|raise|pray|scared|bless|sit|lie|sleep|walk|cheer|sad|wave|fight", s:0.8, face:"smile|open|wide|down", dx:0, flip:false}
//   fx: rays, stars, rain, lightning, fire, dove, glow, wind
//   Lines 0 and last are the modern bookends (scene "room"/"dawnroom", MODERN in a CHOSEN hoodie) unless they say otherwise.
const CAST={JESUS,PETER,JOHN,ANDREW,MODERN,
  MAN:{head:'cloth',clothCol:'#efeae1',band:'#8f8778',beard:true,robe:'#efeae1',sash:'#9a8a6a'},
  YOUNG:{head:'short',hairCol:'#3a2c22',beard:false,robe:WH,sash:'#a38f6a'},
  OLD:{head:'cloth',clothCol:WH,band:'#a39a8a',beard:true,beardCol:'#fbfaf7',robe:'#f1eee8',mantle:'#ddd6c8'},
  MOSES:{head:'cloth',clothCol:'#e9e2d4',band:'#7a6a55',beard:true,beardCol:'#fbfaf7',robe:'#efe9de',mantle:'#cfc3ad',staff:1},
  WOMAN:{head:'hood',hoodCol:'#d8cfc0',beard:false,robe:'#f3efe8',mantle:'#cdbfa6',sash:'#b59a6a'},
  GIRL:{head:'long',hairCol:'#4a3426',beard:false,robe:'#f6f2ea',sash:'#c9a24a'},
  KING:{head:'crown',hairCol:'#3a2c22',beard:true,robe:'#f3efe8',mantle:'#a8324a',sash:'#c9a24a'},
  DAVID:{head:'short',hairCol:'#6a4426',beard:false,robe:'#f1ece2',sash:'#8a6a3a'},
  SOLDIER:{head:'helmet',beard:false,robe:'#d9d3c8',mantle:'#9b3a32',sash:'#6b6255'},
  GOLIATH:{head:'helmet',beard:true,beardCol:'#4a3a2a',robe:'#bdb5a8',mantle:'#6b6255',sash:'#4a4238'},
  CHILD:{head:'short',hairCol:'#3a2c22',beard:false,robe:WH,sash:'#c9a24a',child:1},
  ANGEL:{head:'long',hairCol:'#f3e6b8',beard:false,robe:'#ffffff',sash:'#e8c766',angel:1}};
const POSE={stand:[[.15,.1],[.15,.1]],talk:[[.22,.1],[1.15,.7]],point:[[.2,.1],[1.65,0]],raise:[[2.65,.05],[2.65,.05]],cheer:[[2.5,.3],[2.5,.3]],
  pray:[[.75,1.75],[.75,1.75]],scared:[[1.9,.5],[2.0,.4]],bless:[[.3,.2],[2.5,.15]],sit:[[.35,.5],[.35,.5]],sleep:[[.35,.5],[.35,.5]],lie:[[.2,.1],[.2,.1]],
  walk:[[.3,.1],[.05,.1]],sad:[[.1,.2],[.1,.2]],wave:[[.2,.1],[2.3,.4]],fight:[[1.3,.2],[2.4,.1]]};
// extra heads + props drawn over fig()
function figX(x,y,s,o,t){
  if(o.angel){g.save();g.translate(x,y);g.scale(s,s);const gl=g.createRadialGradient(0,-600,40,0,-600,520);gl.addColorStop(0,'rgba(255,245,200,.55)');gl.addColorStop(1,'rgba(255,245,200,0)');g.fillStyle=gl;g.fillRect(-600,-1200,1200,1200);
    for(const sx of[-1,1])sketch(()=>{g.beginPath();g.moveTo(sx*60,-600);g.quadraticCurveTo(sx*360,-900+Math.sin(t*3)*20,sx*300,-380);g.quadraticCurveTo(sx*180,-470,sx*60,-480);g.closePath();},'#fbf8ef',6);g.restore();}
  const head=o.head;const o2={...o};if(head==='crown'||head==='helmet')o2.head='short';
  if(o.staff){g.save();g.translate(x,y);g.scale(s,s);ln(14);g.strokeStyle='#6b4a2a';g.beginPath();g.moveTo(-235,-20);g.lineTo(-215,-1000);g.quadraticCurveTo(-200,-1060,-160,-1030);g.stroke();g.restore();}
  if(o.child){fig(x,y,s*.62,o2,t);}else fig(x,y,s,o2,t);
  const sc=o.child?s*.62:s;
  if(head==='crown'||head==='helmet'){g.save();g.translate(x,y);g.scale(sc,sc);if(o.lie)g.rotate(-Math.PI/2+.05);const hx=(o.look||0)*10;if(o.tilt){g.translate(0,-690);g.rotate(o.tilt);g.translate(0,690);}
    if(head==='crown')sketch(()=>{g.beginPath();g.moveTo(hx-62,-812);g.lineTo(hx-70,-900);g.lineTo(hx-36,-860);g.lineTo(hx,-916);g.lineTo(hx+36,-860);g.lineTo(hx+70,-900);g.lineTo(hx+62,-812);g.closePath();},'#e9bd45',5);
    else sketch(()=>{g.beginPath();g.moveTo(hx-76,-760);g.quadraticCurveTo(hx-80,-866,hx,-870);g.quadraticCurveTo(hx+80,-866,hx+76,-760);g.lineTo(hx+60,-790);g.quadraticCurveTo(hx,-806,hx-60,-790);g.closePath();},'#b8b2a6',5);
    if(head==='helmet')sketch(()=>{g.beginPath();g.moveTo(hx-14,-868);g.quadraticCurveTo(hx,-950,hx+60,-930);g.quadraticCurveTo(hx+20,-900,hx+14,-868);g.closePath();},'#a33a30',4);g.restore();}}

// ---------- backgrounds (world space; camera already applied) ----------
function grad(stops,y0=-900,y1=1300){const sg=g.createLinearGradient(0,y0,0,y1);stops.forEach((c,i)=>sg.addColorStop(i/(stops.length-1),c));g.fillStyle=sg;g.fillRect(-1400,-1400,W+2800,3400);}
function ground(col,y=1400){sketch(()=>{g.beginPath();g.moveTo(-1400,y);for(let x=-1400;x<=W+1400;x+=200)g.lineTo(x,y-Math.sin(x*.006)*18);g.lineTo(W+1400,3000);g.lineTo(-1400,3000);g.closePath();},col,6);}
function sun(x,y,r,col){g.fillStyle=col;g.beginPath();g.arc(x,y,r,0,7);g.fill();g.globalAlpha=.25;g.beginPath();g.arc(x,y,r*2,0,7);g.fill();g.globalAlpha=1;}
function ridge(col,y,amp,f,ph=0){g.fillStyle=col;g.beginPath();g.moveTo(-1400,y+300);for(let x=-1400;x<=W+1400;x+=80)g.lineTo(x,y-Math.abs(Math.sin(x*f+ph))*amp);g.lineTo(W+1400,3000);g.lineTo(-1400,3000);g.fill();ln(5);g.beginPath();for(let x=-1400;x<=W+1400;x+=80){const yy=y-Math.abs(Math.sin(x*f+ph))*amp;x===-1400?g.moveTo(x,yy):g.lineTo(x,yy);}g.stroke();}
function stars(t){const r=R(21);g.fillStyle='#fff';for(let i=0;i<160;i++){const x=r()*3000-1000,y=r()*1300-900;g.globalAlpha=.4+.5*Math.abs(Math.sin(t*2+i));g.fillRect(x,y,5,5);}g.globalAlpha=1;}
function house(x,y,w,h,col){sketch(()=>{g.beginPath();g.rect(x-w/2,y-h,w,h);},col,6);sketch(()=>{g.beginPath();g.rect(x-w/2-12,y-h-18,w+24,22);},'#cdbb9a',5);sketch(()=>{g.beginPath();g.roundRect(x-26,y-110,52,110,[26,26,0,0]);},'#5a4636',5);}
function tree(x,y,s){g.save();g.translate(x,y);g.scale(s,s);ln(8);sketch(()=>{g.beginPath();g.moveTo(-18,0);g.quadraticCurveTo(-30,-140,-6,-260);g.lineTo(16,-260);g.quadraticCurveTo(10,-120,22,0);g.closePath();},'#6b4f36',6);
  sketch(()=>{g.beginPath();g.ellipse(0,-330,150,110,0,0,7);},'#7b8a5a',6);sketch(()=>{g.beginPath();g.ellipse(-80,-290,90,70,0,0,7);},'#6f7e50',5);g.restore();}
function column(x,y,h){sketch(()=>{g.beginPath();g.rect(x-46,y-h,92,h);},'#e6dccb',6);sketch(()=>{g.beginPath();g.rect(x-66,y-h-30,132,34);},'#d9cdb8',5);sketch(()=>{g.beginPath();g.rect(x-66,y-30,132,30);},'#d9cdb8',5);
  g.save();g.globalAlpha=.3;ln(4);for(const dx of[-20,0,20]){g.beginPath();g.moveTo(x+dx,y-h+10);g.lineTo(x+dx,y-40);g.stroke();}g.restore();}
function flames(x,y,w,t,a=1){g.save();g.globalAlpha=a;for(let i=0;i<9;i++){const fx=x-w/2+(i+.5)*w/9,hh=160+Math.sin(t*9+i*1.7)*60+(i%3)*40;const fg=g.createLinearGradient(0,y,0,y-hh);fg.addColorStop(0,'#ff6a1a');fg.addColorStop(.6,'#ffb02e');fg.addColorStop(1,'rgba(255,230,120,0)');g.fillStyle=fg;
  g.beginPath();g.moveTo(fx-w/14,y);g.quadraticCurveTo(fx-w/20,y-hh*.6,fx+Math.sin(t*7+i)*14,y-hh);g.quadraticCurveTo(fx+w/20,y-hh*.6,fx+w/14,y);g.fill();}g.restore();}
function dove(x,y,t){g.save();g.translate(x,y+Math.sin(t*4)*14);sketch(()=>{g.beginPath();g.ellipse(0,0,60,30,0,0,7);},'#fff',5);const fl=Math.sin(t*12)*.6;for(const sx of[-1,1])sketch(()=>{g.beginPath();g.moveTo(sx*10,-10);g.quadraticCurveTo(sx*80,-90*Math.cos(fl),sx*130,-40*Math.cos(fl));g.quadraticCurveTo(sx*70,-10,sx*10,10);g.closePath();},'#fff',5);g.restore();}
function crowdRow(y,s,t,n=9){const r=R(33);for(let k=0;k<n;k++){const c=['MAN','WOMAN','YOUNG','OLD','GIRL','MAN'][k%6];figX(-120+k*165+r()*40,y+Math.sin(t*2+k)*3,s,{...CAST[c],eyes:'open',mouth:k%3?'smile':'line',arms:k%4?POSE.stand:POSE.cheer},t);}}
function scene(name,t,L){const st=name==='storm';
  switch(name){
  case 'room':case 'dawnroom':room(t,name==='dawnroom');return;
  case 'desert':grad(['#e9a85a','#f6d08a','#fbe7b8']);sun(820,120,90,'#fff3c8');ridge('#e2b06e',1060,140,.003);ridge('#d79e5a',1260,90,.005,1);ground('#e8c18a');return;
  case 'hills':grad(['#7fb4e0','#bfe0f2','#fdf3dc']);sun(240,140,70,'#fffbe6');ridge('#9fbe7c',1050,170,.0035);ridge('#86ab66',1240,110,.006,2);ground('#a3c27e');tree(-40,1400,1);tree(1080,1420,.8);return;
  case 'village':grad(['#8cc1e8','#cde6f3','#fbf1dc']);ridge('#b9c79a',1100,120,.004);for(const [x,w,h] of[[-200,300,330],[150,260,280],[880,300,360],[1210,260,300]])house(x,1400,w,h,'#ead9b8');ground('#dcc59a');return;
  case 'night':grad(['#0b1230','#1c2a56','#3a4a78']);stars(t);sun(820,160,70,'#f4f1dc');ridge('#1d2742',1100,160,.004);ridge('#151d33',1260,90,.006,1);ground('#2a3150');return;
  case 'lake':case 'storm':case 'sea':sky(t,st?1:0);hills(st?1:0);water(t,st?1:0,1060,false);return;
  case 'temple':grad(['#cbb994','#e9dcc0','#f5ecd8']);for(const x of[-260,40,340,640,940,1240])column(x,1400,1050);ground('#d6c6a6');return;
  case 'garden':grad(['#0f1733','#22305a','#3d4a72']);stars(t);tree(-60,1400,1.2);tree(380,1300,.8);tree(1050,1380,1.1);ground('#26304a');return;
  case 'tomb':grad(['#f0a868','#f8d39a','#fdf0d6']);sun(540,220,110,'#fff6d8');ridge('#b8a084',1150,90,.004);
    sketch(()=>{g.beginPath();g.moveTo(-300,1400);g.quadraticCurveTo(-200,700,400,640);g.quadraticCurveTo(900,640,1000,1400);g.closePath();},'#9c8a74',8);
    g.fillStyle='#1a1614';g.beginPath();g.ellipse(360,1160,170,240,0,0,7);g.fill();sketch(()=>{g.beginPath();g.arc(700,1170,230,0,7);},'#b3a28c',8);ground('#c9b28e');return;
  case 'palace':grad(['#3a2a3e','#5a3e52','#7a5a5e']);for(const x of[-120,1200])column(x,1400,1200);sketch(()=>{g.beginPath();g.rect(-1400,1400,W+2800,1600);},'#6e4a3c',6);
    sketch(()=>{g.beginPath();g.rect(300,1400,480,900);},'#9e2f3e',6);sketch(()=>{g.beginPath();g.roundRect(390,700,300,520,[40,40,0,0]);},'#c9a24a',8);return;
  case 'fire':grad(['#2a0d08','#5a1a0c','#8a3010']);sketch(()=>{g.beginPath();g.roundRect(-200,500,1480,1000,[600,600,0,0]);},'#3a1a12',10);flames(540,1450,1500,t,1);ground('#2b140c');return;
  case 'heaven':grad(['#fff6dc','#fde9b0','#f7d58a']);for(let i=0;i<7;i++){g.fillStyle='rgba(255,255,255,.8)';g.beginPath();g.ellipse(-200+i*260,1350+Math.sin(i)*40,220,90,0,0,7);g.fill();}rays(540,300,t,.6);return;
  case 'mountain':grad(['#5d7ea8','#a9c3dc','#eef2f2']);sketch(()=>{g.beginPath();g.moveTo(-600,1300);g.lineTo(540,180);g.lineTo(1700,1300);g.closePath();},'#8a7d70',8);
    sketch(()=>{g.beginPath();g.moveTo(330,390);g.lineTo(540,180);g.lineTo(760,400);g.lineTo(640,360);g.lineTo(540,420);g.lineTo(440,360);g.closePath();},'#f4f1ec',6);ground('#a99a84');return;
  case 'crowd':grad(['#86bde6','#cbe5f3','#fbf1dc']);ridge('#a9c08a',1000,140,.004);ground('#cdb88c',1250);crowdRow(1300,.55,t,10);return;
  default:grad(['#26365e','#c2768a','#f1b878']);ground('#7a6a58');}}
function fxLayer(fx,t,L,front){if(!fx)return;
  if(!front){if(fx.includes('rays'))rays(540,560,t,ss(L.s,L.s+.6,t)*.8);if(fx.includes('glow')){const gl=g.createRadialGradient(540,700,50,540,700,800);gl.addColorStop(0,'rgba(255,240,190,.55)');gl.addColorStop(1,'rgba(255,240,190,0)');g.fillStyle=gl;g.fillRect(-1000,-800,3000,3000);}
    if(fx.includes('stars'))stars(t);if(fx.includes('dove'))dove(540+Math.sin(t)*60,420,t);return;}
  if(fx.includes('rain')||fx.includes('lightning'))rain(t,1);if(fx.includes('fire'))flames(540,1560,1400,t,.85);
  if(fx.includes('lightning')){const f=(t*1.1)%3.3;if(f<.12){g.fillStyle='rgba(230,240,255,.45)';g.fillRect(-1400,-1400,W+2800,3400);}}
  if(fx.includes('wind')){g.save();g.strokeStyle='rgba(255,255,255,.45)';g.lineWidth=5;const r=R(4);for(let i=0;i<18;i++){const y=r()*1600,x=((r()*2000+t*1600)%2600)-800;g.beginPath();g.moveTo(x,y);g.quadraticCurveTo(x+120,y-20,x+260,y);g.stroke();}g.restore();}}
function drawCast(cast,t,i,L,u){if(!cast)return;for(const c of cast){const base=CAST[c.c]||CAST.MAN;const pose=c.pose||'stand';const s=c.s||.8;
  let x=(c.x??540)+(c.dx||0)*u,y=c.y??1400;if(pose==='walk')y+=-Math.abs(Math.sin(t*6))*10;if(pose==='sit'||pose==='sleep')y+=60;
  const o={...base,arms:POSE[pose]||POSE.stand,eyes:'open',mouth:'line',look:c.look||0};
  if(pose==='talk'||c.speak){o.mouth=talk(t,i);}
  if(pose==='scared'){o.eyes='wide';o.mouth='open';}if(pose==='pray'){o.eyes='closed';o.tilt=.08;}if(pose==='sleep'){o.eyes='closed';o.tilt=.32;}
  if(pose==='sad'){o.eyes='down';o.tilt=.12;}if(pose==='cheer'||pose==='wave'){o.mouth='smile';}if(pose==='raise'){o.eyes=c.face==='open'?'open':'closed';o.mouth='smile';}
  if(pose==='fight'){o.brow='angry';o.mouth='shout';}if(pose==='lie'){o.lie=true;o.eyes='closed';y-=40;}
  if(c.face==='smile')o.mouth='smile';else if(c.face==='open')o.mouth='open';else if(c.face==='wide')o.eyes='wide';else if(c.face==='down')o.eyes='down';
  if(c.flip){g.save();g.translate(x,0);g.scale(-1,1);g.translate(-x,0);}figX(x,y,s,o,t);if(c.flip)g.restore();}}
function story(t){const n=TL.lines.length,last=n-1,END=LN(last).e+.5;let i=0;for(let k=0;k<n;k++)if(t>=LN(k).s-.12)i=k;const L=LN(i),u=ss(L.s,L.e,t);
  const J=(SJ.lines||[])[i]||{};const bookend=i===0||i===last;
  const sc=J.scene||(bookend?(i?'dawnroom':'room'):'hills');const modern=sc==='room'||sc==='dawnroom';
  const cm=J.cam||(modern?[i?1.5:1.15,540,i?980:1020]:[1,540,860]);const z=cm[0]*lerp(1,modern?(i?.8:1.26):(J.push||1.07),u);
  g.save();cam(z,cm[1],cm[2],sc==='storm'?Math.sin(t*2.6)*.03:0);scene(sc,t,L);fxLayer(J.fx,t,L,false);
  let cast=J.cast;if(!cast&&modern)cast=[{c:'MODERN',x:540,y:1560,s:1,pose:i?'wave':'sad'}];
  drawCast(cast,t,i,L,u);if(sc==='storm'||sc==='lake'||sc==='sea')water(t,sc==='storm'?.85:0,1360,true);fxLayer(J.fx,t,L,true);g.restore();
  CAPY=J.capy||(modern?1500:1480);vignette(modern?.6:.45);
  if(J.title){g.save();g.globalAlpha=ss(L.s,L.s+.4,t)*(1-ss(L.e-.4,L.e,t));g.font='700 70px CZ';g.textAlign='center';g.fillStyle='#fff';g.shadowColor='rgba(0,0,0,.7)';g.shadowBlur=16;g.fillText(J.title,540,420);g.restore();}
  whip(t,TL.lines.slice(1).map(l=>l.s-.12));if(t<END)caption(t);endCard(t,END,SJ.ref||'');}
window.EPS.story=story;
