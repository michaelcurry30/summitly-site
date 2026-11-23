// ART DRAWING toons: a character says "I want to draw something" and draws one of the original sports posters
// (../art/posters.js) on an easel, then the action object (ball) actually moves. ids arNN. Script json sets "poster".
const AR={C:CAST.DRE};
const AR_OFF=document.createElement('canvas');AR_OFF.width=630;AR_OFF.height=945;const ARg=AR_OFF.getContext('2d');
function ar_room(t){const wg=g.createLinearGradient(0,0,0,1200);wg.addColorStop(0,'#2a211c');wg.addColorStop(1,'#3a2c22');g.fillStyle=wg;g.fillRect(-800,-800,W+1600,2000);
  // window light
  g.save();g.globalAlpha=.18;g.fillStyle='#ffe2b0';g.beginPath();g.moveTo(-100,200);g.lineTo(260,200);g.lineTo(700,1400);g.lineTo(-100,1400);g.fill();g.restore();
  g.fillStyle='#1b2433';g.fillRect(-40,220,260,360);g.strokeStyle='#5a3d27';g.lineWidth=16;g.strokeRect(-40,220,260,360);g.beginPath();g.moveTo(90,220);g.lineTo(90,580);g.moveTo(-40,400);g.lineTo(220,400);g.stroke();
  // shelf with paint jars
  g.fillStyle='#5a3d27';g.fillRect(-200,700,330,18);const jc=['#ff4f6d','#ffd36b','#5b8def','#2fae4e'];jc.forEach((c,i)=>{g.fillStyle=c;g.fillRect(-170+i*70,640,46,60);g.strokeStyle=INK;g.lineWidth=5;g.strokeRect(-170+i*70,640,46,60);});
  // floor
  g.fillStyle='#4a3020';g.fillRect(-800,1440,W+1600,1200);g.save();g.strokeStyle='rgba(0,0,0,.25)';g.lineWidth=4;for(let i=0;i<12;i++){const y=1440+i*i*7;g.beginPath();g.moveTo(-800,y);g.lineTo(W+800,y);g.stroke();}g.restore();
  // paint splats on floor
  [[620,1600,'#ff4f6d'],[880,1700,'#ffd36b'],[300,1780,'#5b8def']].forEach(([x,y,c])=>{g.fillStyle=c;g.save();g.translate(x,y);g.scale(1,.35);g.beginPath();g.arc(0,0,40,0,7);g.fill();g.restore();});
  spot(700,1000,800,.38);}
// easel + canvas. canvas rect in world coords: x 465..1095? -> we use cx,cy centre, cw x ch size
const AR_CV={x:560,y:640,w:400,h:600};
function ar_easel(){const c=AR_CV;g.save();g.strokeStyle='#6b4325';g.lineCap='round';g.lineWidth=26;
  g.beginPath();g.moveTo(c.x+c.w/2,c.y-60);g.lineTo(c.x+40,1560);g.moveTo(c.x+c.w/2,c.y-60);g.lineTo(c.x+c.w-40,1560);g.moveTo(c.x+c.w/2,c.y+200);g.lineTo(c.x+c.w/2+40,1500);g.stroke();
  g.fillStyle='#7a4e2c';g.fillRect(c.x-30,c.y+c.h,c.w+60,30);g.strokeStyle=INK;g.lineWidth=6;g.strokeRect(c.x-30,c.y+c.h,c.w+60,30);
  g.fillStyle='#f4efe4';g.fillRect(c.x-8,c.y-8,c.w+16,c.h+16);g.strokeStyle=INK;g.lineWidth=8;g.strokeRect(c.x-8,c.y-8,c.w+16,c.h+16);g.restore();}
// draw poster with sketch underlay + zigzag colour reveal; returns pencil head [x,y]
function ar_canvas(id,sketch,reveal,ball){const c=AR_CV;ARg.setTransform(1,0,0,1,0,0);ARg.clearRect(0,0,630,945);drawPoster(ARg,id,630,945,{ball});
  if(sketch>0){g.save();g.beginPath();g.rect(c.x,c.y,c.w,c.h*sketch);g.clip();g.globalAlpha=.42;g.filter='grayscale(1) contrast(1.6) brightness(1.5)';g.drawImage(AR_OFF,c.x,c.y,c.w,c.h);g.filter='none';g.restore();}
  const N=7,rh=c.h/N;let head=null;g.save();g.beginPath();const k=Math.min(N,Math.floor(reveal*N));for(let i=0;i<k;i++)g.rect(c.x,c.y+i*rh,c.w,rh+1);
  if(k<N&&reveal>0){const f=reveal*N-k;const dirR=k%2===0;const x0=dirR?c.x:c.x+c.w*(1-f);g.rect(x0,c.y+k*rh,c.w*f,rh+1);head=[dirR?c.x+c.w*f:c.x+c.w*(1-f),c.y+k*rh+rh/2];}
  g.clip();g.drawImage(AR_OFF,c.x,c.y,c.w,c.h);g.restore();
  if(!head&&sketch>0&&sketch<1)head=[c.x+c.w*(.5+.4*Math.sin(sketch*40)),c.y+c.h*sketch];return head;}
function ar_pencil(x,y,ang){g.save();g.translate(x,y);g.rotate(ang);g.fillStyle='#ffd34d';g.strokeStyle=INK;g.lineWidth=5;g.fillRect(0,-9,95,18);g.strokeRect(0,-9,95,18);
  g.fillStyle='#f1c79a';g.beginPath();g.moveTo(0,-9);g.lineTo(-26,0);g.lineTo(0,9);g.closePath();g.fill();g.stroke();g.fillStyle=INK;g.beginPath();g.moveTo(-17,-3);g.lineTo(-26,0);g.lineTo(-17,3);g.fill();
  g.fillStyle='#ff8fa3';g.fillRect(95,-9,16,18);g.strokeRect(95,-9,16,18);g.restore();}
// a drawing arm reaching in from bottom-left to the pencil head
function ar_hand(hx,hy,skin){const sx=hx-330,sy=hy+520;const mx=(sx+hx)/2-60,my=(sy+hy)/2+40;limb([[sx,sy],[mx,my],[hx,hy]],22,INK);
  ar_pencil(hx+8,hy+4,-0.9);g.fillStyle=skin;g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.arc(hx+26,hy+28,22,0,7);g.fill();g.stroke();}
function ar_artist(tx,ty,t,face){const s=.95,fy=1580;const x=Math.max(230,Math.min(470,tx-260));const shY0=fy-440*s;const lift=Math.max(0,Math.min(150,(shY0-330)-ty));
  const step=Math.abs(Math.sin(t*9))*10;kev(x,fy-lift*.6,s,{...AR.C,face:face||'smug',look:.6,armL:[.35,.3],noArmR:true,bob:-step,blink:blinkAt(t)},t);
  const Sx=x+84*s,Sy=fy-lift*.6-step-440*s;const d=Math.hypot(tx-Sx,ty-Sy),l=Math.max(118*s*1.15,d/2+6),h=Math.sqrt(l*l-(d/2)*(d/2));
  const mx=(Sx+tx)/2,my=(Sy+ty)/2,nx=-(ty-Sy)/d,ny=(tx-Sx)/d;const sg=ny>0?1:-1;const ex=mx+nx*h*sg,ey=my+ny*h*sg;
  limb([[Sx,Sy],[ex,ey],[tx+22,ty+26]],20*s,INK);ar_pencil(tx+8,ty+4,-0.9);g.fillStyle=AR.C.skin||'#8d5524';g.strokeStyle=INK;g.lineWidth=6;g.beginPath();g.arc(tx+26,ty+28,20,0,7);g.fill();g.stroke();}
function ar_sparkle(x,y,t,col='#ffd34d'){g.save();g.translate(x,y);g.rotate(t*2);g.fillStyle=col;g.beginPath();for(let i=0;i<8;i++){const r=i%2?10:34,a=i*Math.PI/4;g.lineTo(Math.cos(a)*r,Math.sin(a)*r);}g.fill();g.restore();}
function ar_end(t,t0,id){const u=t-t0;if(u<0)return;const a=ss(0,.45,u);g.save();g.globalAlpha=a*.92;g.fillStyle='#0b0907';g.fillRect(0,0,W,H);g.globalAlpha=a;spot(540,900,760,.4);
  const fw=480,fh=720,fx=300,fy=520;g.fillStyle='#111';g.fillRect(fx-26,fy-26,fw+52,fh+52);ARg.setTransform(1,0,0,1,0,0);drawPoster(ARg,id,630,945,{});g.drawImage(AR_OFF,fx,fy,fw,fh);
  kev(170,1760,.72,{...AR.C,face:'grin',armL:[.25,.15],armR:[2.4,.3]},t);
  g.textAlign='center';g.font='800 96px BS';g.fillStyle='#fff';g.fillText('WHICH SPORT NEXT?',540,300);g.font='800 58px BS';g.fillStyle='#ffd34d';g.fillText('COMMENT BELOW 👇',540,400);
  g.font='600 44px HG';g.fillStyle='#ddd';g.fillText('Original art · drawn by Dre',540,1400);g.restore();}

function ar01(t){T0=t;const id=(window.ARPOSTER||'net');const last=TL.lines.length-1,END=LN(last).e+.4;g.save();
  if(sh(0)||sh(1)){const i=sh(0)?0:1,L=LN(i),u=ss(L.s,L.e,t);window.CAPY=1780;cam(i?lerp(1.25,1.32,u):lerp(1.0,1.06,u),i?380:540,i?1080:1050);ar_room(t);ar_easel();if(i===0&&t<1.25)ar_canvas(id,1,1,.965);
    // blank canvas, Dre thinking -> grinning, pencil in hand
    const f=i===0?(u<.5?'calm':'smug'):'grin';kev(300,1580,.9,{...AR.C,face:f,armL:[.2,.15],armR:[i?1.9:1.2,i?-.6:.9],blink:blinkAt(t),bob:i?Math.sin(t*9)*6:0},t);
    const s=.9,a1=i?1.9:1.2,a2=i?-.6:.9,sx=300+84*s,sy=1580-440*s,ex=sx+Math.sin(a1)*118*s,ey=sy+Math.cos(a1)*118*s,hx=ex+Math.sin(a1+a2)*118*s,hy=ey+Math.cos(a1+a2)*118*s;ar_pencil(hx,hy-6,i?-1.3:-.4);
    if(i===1){for(let k=0;k<4;k++)ar_sparkle(160+k*130,470+Math.sin(t*5+k)*30,t+k,['#ff4f6d','#ffd36b','#5b8def','#2fae4e'][k]);}}
  else if(sh(2)||sh(3)||sh(4)){const i=sh(2)?2:sh(3)?3:4,L=LN(i);
    const a=LN(2).s,b=LN(4).s+.2,p=ss(a,b,t);const sketch=ss(a,a+1.2,t);const reveal=ss(a+.9,b,t);
    const ballP=i===4?ss(L.s+.3,L.e+.4,t)*.86:0;window.CAPY=1790;cam(lerp(1.22,1.3,p),640,980);ar_room(t);ar_easel();
    const head=ar_canvas(id,sketch,reveal,ballP);if(head&&reveal<1)ar_artist(head[0],head[1],t,'smug');else kev(330,1580,.95,{...AR.C,face:i===4?'shock':'grin',look:.6,armL:[.25,.15],armR:[.9,.6],blink:blinkAt(t)},t);
    if(i===4){const ws=TL.lines[4].words;const nums={'three':'3','two':'2','one':'1'};let n=null;for(const w of ws){const k=w.w.toLowerCase().replace(/[^a-z]/g,'');if(nums[k]&&t>=w.s-.05)n=nums[k];}if(n)tag(760,520,n,'#ffd34d',130);}}
  else if(sh(5)){const L=LN(5),u=t-L.s;const ballP=.86+.105*ss(0,.5,u);window.CAPY=1790;cam(lerp(1.4,1.15,ss(0,1.2,u)),640,980);ar_room(t);ar_easel();ar_canvas(id,1,1,ballP);
    kev(330,1580,.82,{...AR.C,face:'grin',armL:[2.6,.2],armR:[2.6,.2],bob:-Math.abs(Math.sin(t*8))*40,blink:0},t);
    if(u>.45){for(let k=0;k<7;k++)ar_sparkle(560+k*70,560+Math.sin(k*2+t*6)*40,t+k,['#ff4f6d','#ffd36b','#5b8def'][k%3]);tag(730,380,'SWISH!','#ffd34d',110);}}
  else{const L=LN(last),u=ss(L.s,L.e,t);window.CAPY=1790;cam(lerp(1.1,1.0,u),560,1000);ar_room(t);ar_easel();ar_canvas(id,1,1,.965);
    kev(330,1580,.95,{...AR.C,face:'grin',armL:[.2,.15],armR:[1.9,-.2],blink:blinkAt(t)},t);tag(730,380,'NEXT SPORT?','#ffd34d',80);}
  g.restore();vignette(.55);if(t<END)caption(t);ar_end(t,END,id);}

window.EPS=Object.assign(window.EPS||{},{ar01});
