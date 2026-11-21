import {chromium} from 'playwright';import fs from 'fs';
const src=fs.readFileSync('../nytoon/toon2.html','utf8');
let js=src.split('<script>')[1].split('</script>')[0];
js=js.replace('const W=1080,H=1920','let W=1080,H=1920').replace(/window\.render=[\s\S]*$/,'');
const CH=[
 {k:'repatlas',who:'DRE',face:'grin',name:'REP ATLAS',tag:'SHOW UP. GET STRONGER.',prod:'FIT & STRONG',bg:'#0e1a33',prop:'dumbbell'},
 {k:'focusforge',who:'JAY',face:'smug',name:'FOCUS FORGE',tag:'FOCUS. DISCIPLINE. STAY ON TRACK.',prod:'DAILY HABITS',bg:'#2a1608',prop:'flame'},
 {k:'animatedstickhabit',who:'KEV',face:'shock',name:'ANIMATED STICK HABIT',tag:'BREAK BAD HABITS. ONE DAY AT A TIME.',prod:'BREAK THE HABIT',bg:'#0c2216',prop:'phone'},
 {k:'whatifdaily',who:'RIO',face:'calm',name:'WHAT IF DAILY',tag:'SMALL HABITS. BIG WHAT IFS.',prod:'MONEY MASTERY',bg:'#1b1030',prop:'q'},
 {k:'satisfylab',who:'TASHA',face:'grin',name:'SATISFY LAB',tag:'RESET. PLAN. STAY ON TRACK.',prod:'LIFE RESET',bg:'#2c0d1d',prop:'check'}];
const extra=`
function prop(kind,x,y,s,col){g.save();g.translate(x,y);g.scale(s,s);g.strokeStyle=INK;g.lineWidth=10;g.lineJoin='round';
 if(kind==='dumbbell'){g.fillStyle='#d9dde4';g.fillRect(-90,-14,180,28);g.strokeRect(-90,-14,180,28);for(const sx of[-1,1]){g.fillStyle='#3a3f4a';g.beginPath();g.roundRect(sx*90-(sx<0?40:0),-62,40,124,10);g.fill();g.stroke();g.beginPath();g.roundRect(sx*130-(sx<0?30:0),-44,30,88,8);g.fill();g.stroke();}}
 if(kind==='flame'){g.fillStyle='#ff7a1a';g.beginPath();g.moveTo(0,-110);g.bezierCurveTo(70,-40,80,30,50,70);g.quadraticCurveTo(0,110,-50,70);g.bezierCurveTo(-80,30,-40,-20,-20,-40);g.quadraticCurveTo(-5,-10,10,-30);g.quadraticCurveTo(20,-70,0,-110);g.fill();g.stroke();g.fillStyle='#ffd34d';g.beginPath();g.moveTo(0,-10);g.bezierCurveTo(35,20,35,60,0,80);g.bezierCurveTo(-35,60,-30,25,0,-10);g.fill();}
 if(kind==='phone'){g.fillStyle='#1d1f24';g.beginPath();g.roundRect(-60,-110,120,220,20);g.fill();g.stroke();g.fillStyle='#5ad1ff';g.fillRect(-46,-90,92,170);g.fillStyle='#e94b4b';g.beginPath();g.arc(40,-100,26,0,7);g.fill();g.stroke();g.fillStyle='#fff';g.font='800 34px BS';g.textAlign='center';g.textBaseline='middle';g.fillText('99',40,-98);}
 if(kind==='q'){g.fillStyle='#ffd34d';g.font='800 230px BS';g.textAlign='center';g.textBaseline='middle';g.lineWidth=12;g.strokeText('?',0,0);g.fillText('?',0,0);}
 if(kind==='check'){g.fillStyle='#2fae4e';g.beginPath();g.arc(0,0,90,0,7);g.fill();g.stroke();g.strokeStyle='#fff';g.lineWidth=22;g.lineCap='round';g.beginPath();g.moveTo(-42,2);g.lineTo(-10,34);g.lineTo(46,-30);g.stroke();}
 g.restore();}
function bgRoom(bg,cx,cy,r){g.fillStyle=bg;g.fillRect(0,0,W,H);const sg=g.createRadialGradient(cx,cy,10,cx,cy,r);sg.addColorStop(0,'rgba(255,214,150,.45)');sg.addColorStop(1,'rgba(255,214,150,0)');g.fillStyle=sg;g.fillRect(0,0,W,H);}
window.pfp=(c)=>{W=H=1024;C.width=C.height=1024;const o={...CAST[c.who],face:c.face,armL:[.3,.15],armR:[.3,.15]};
 bgRoom(c.bg,512,430,620);
 g.fillStyle=o.shirt;g.globalAlpha=.35;g.beginPath();g.arc(512,512,470,0,7);g.fill();g.globalAlpha=1;
 kev(512,1560,1.85,o,0);
 prop(c.prop,800,780,1.05);};
window.banner=(c)=>{W=2560;H=1440;C.width=2560;C.height=1440;const o={...CAST[c.who],face:c.face,armL:[.25,.15],armR:[1.6,.9]};
 bgRoom(c.bg,1100,720,1000);
 for(let i=0;i<14;i++){g.fillStyle='rgba(255,255,255,'+(.03+.02*(i%3))+')';g.beginPath();g.arc((i*397)%2560,(i*233)%1440,40+(i*37)%90,0,7);g.fill();}
 kev(880,922,.52,o,0);
 planner(1030,722,.37,0,{title:c.prod,checked:3,col:o.shirt});
 prop(c.prop,700,620,.42);
 g.textAlign='left';g.textBaseline='alphabetic';const X=1140;
 g.font='800 '+(c.name.length>14?110:140)+'px BS';g.fillStyle='#fff';g.fillText(c.name,X,690);
 g.font='800 62px BS';g.fillStyle='#ffd34d';g.fillText(c.tag,X,775);
 g.font='600 44px HG';g.fillStyle='#ddd';g.fillText('📒 Planners to stay on track · link below',X,850);};
`;
fs.writeFileSync('page.html',`<!doctype html><html><head><meta charset="utf-8"><style>@font-face{font-family:BS;src:url(../kit/fonts/big-shoulders-display-latin-800-normal.woff2);font-weight:800}@font-face{font-family:HG;src:url(../kit/fonts/hanken-grotesk-latin-600-normal.woff2);font-weight:600}body{margin:0}</style></head><body><canvas id="c"></canvas><script>${js}${extra}</script></body></html>`);
const b=await chromium.launch();const p=await b.newPage();await p.goto('file://'+process.cwd()+'/page.html');
await p.evaluate(async()=>{await document.fonts.load('800 40px BS');await document.fonts.load('600 40px HG');});
for(const c of CH){for(const kind of['pfp','banner']){await p.evaluate(([k,c])=>window[k](c),[kind,c]);
 const d=await p.evaluate(()=>C.toDataURL('image/png'));fs.writeFileSync(`${c.k}_${kind}.png`,Buffer.from(d.split(',')[1],'base64'));}}
await b.close();
