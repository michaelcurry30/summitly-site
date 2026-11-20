// Nah-You 3D kit: realistic-proportion people (Ready Player Me base, three.js examples), retargeted Xbot motion,
// Nah-You garments (black top + printed chest/back art that follows the body), hats, city + basketball court.
import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import * as SK from 'three/addons/utils/SkeletonUtils.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
export {THREE};
export const NY_W='#f2efe6', NY_G='#7ee35a';

// ---------- brand art on canvas (recreated drippy lettering) ----------
export function dripText(g,txt,x,y,size,col,seed=1,n=8){g.save();g.font=`800 ${size}px BS`;g.textAlign='center';g.textBaseline='alphabetic';
  const w=g.measureText(txt).width;g.fillStyle=col;g.fillText(txt,x,y);let s=seed*997;const r=()=>(s=(s*16807)%2147483647)/2147483647;
  g.strokeStyle=col;g.lineCap='round';for(let i=0;i<n;i++){const dx=x-w/2+w*(.06+.88*r()),len=size*(.12+.42*r()),lw=Math.max(2,size*.07);
  g.lineWidth=lw;g.beginPath();g.moveTo(dx,y-size*.08);g.lineTo(dx,y+len);g.stroke();g.beginPath();g.arc(dx,y+len,lw*.75,0,7);g.fill();}g.restore();}
export function handMark(g,x,y,s,col=NY_G){g.save();g.translate(x,y);g.scale(s,s);g.fillStyle=col;g.strokeStyle='#0b0b0b';g.lineWidth=6;
  g.beginPath();g.roundRect(-46,-10,92,70,22);g.fill();g.stroke();g.beginPath();g.roundRect(-14,-92,30,96,14);g.fill();g.stroke();
  g.beginPath();g.roundRect(30,-6,40,26,12);g.fill();g.stroke();g.restore();}
export function artCanvas(kind){const c=document.createElement('canvas');c.width=512;c.height=512;const g=c.getContext('2d');
  if(kind==='next'){dripText(g,"YOU'RE",256,190,130,NY_W,3,7);dripText(g,'NEXT',256,360,190,NY_G,5,9);g.font='800 46px BS';g.textAlign='center';g.fillStyle=NY_W;g.fillText('NAH-YOU',256,470);}
  else if(kind==='talkless'){dripText(g,'TALK LESS',256,210,120,NY_W,7,9);dripText(g,'BALL MORE',256,380,120,NY_G,9,9);}
  else if(kind==='built'){dripText(g,'BUILT',256,200,150,NY_W,11,7);dripText(g,'DIFFERENT',256,350,110,NY_W,13,8);g.fillStyle=NY_G;g.font='800 52px BS';g.textAlign='center';g.fillText('NAH-YOU',256,460);}
  else if(kind==='mark'){g.font='800 120px BS';g.textAlign='center';g.fillStyle=NY_W;g.fillText('N',150,250);g.fillText('Y',362,250);handMark(g,256,215,1.1);g.font='800 60px BS';g.fillText('NAH-YOU',256,340);}
  else if(kind==='back'){dripText(g,'NAH',256,210,170,NY_W,15,7);dripText(g,'YOU',256,420,230,NY_G,17,9);}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;return t;}

// ---------- world ----------
// One city block: a fenced street court (hoop at z=-13), a sidewalk + road along z=+20..+29, storefronts across the street.
// setTime('morning'|'sunset'|'night') changes sky, sun, fog, window lights and the court floodlights.
const TOD={
 morning:{sky:['#7fb6ea','#b9d8f2','#f3e6d2'],fog:'#cfe0ee',hemi:['#dcecff','#5a5a60',1.0],sun:['#fff1dc',2.6,[30,26,30]],rim:['#ffd9b0',.6],env:.5,win:.12,flood:0,exp:1.0},
 sunset:{sky:['#ff7a45','#ffb072','#ffe0b8'],fog:'#ffc996',hemi:['#ffe0c4','#4a4f66',1.0],sun:['#ffbe85',2.9,[-30,12,18]],rim:['#9fc4ff',1.1],env:.4,win:.35,flood:0,exp:1.0},
 night:{sky:['#05070f','#0d1430','#1e2a4a'],fog:'#0d1326',hemi:['#4a5a8a','#0a0a12',.35],sun:['#9fb4ff',.35,[-20,30,10]],rim:['#6f8cff',.4],env:.15,win:1,flood:1,exp:1.15}};
export function makeWorld(R){const S=new THREE.Scene();
  const skyC=document.createElement('canvas');skyC.width=4;skyC.height=512;const skyT=new THREE.CanvasTexture(skyC);skyT.colorSpace=THREE.SRGBColorSpace;S.background=skyT;
  S.fog=new THREE.Fog('#ffcf9e',60,380);
  const hemi=new THREE.HemisphereLight('#ffe6cc','#4a4f66',1.1);S.add(hemi);
  const sun=new THREE.DirectionalLight('#ffd2a0',2.8);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
  Object.assign(sun.shadow.camera,{left:-22,right:22,top:22,bottom:-22,near:1,far:140});sun.shadow.bias=-0.0004;sun.shadow.normalBias=.02;S.add(sun);S.add(sun.target);
  const rim=new THREE.DirectionalLight('#9fc4ff',1.2);rim.position.set(20,10,-20);S.add(rim);
  const pm=new THREE.PMREMGenerator(R);S.environment=pm.fromScene(new RoomEnvironment(),.04).texture;
  let s=7;const rnd=()=>(s=(s*16807)%2147483647)/2147483647;
  const std=(c,r=.9,m=0)=>new THREE.MeshStandardMaterial({color:c,roughness:r,metalness:m});
  const g=new THREE.Mesh(new THREE.PlaneGeometry(500,500),std('#3a3d44',.95));g.rotation.x=-Math.PI/2;g.receiveShadow=true;S.add(g);
  // court
  const cv=document.createElement('canvas');cv.width=1024;cv.height=1024;const c=cv.getContext('2d');c.fillStyle='#2e5f8f';c.fillRect(0,0,1024,1024);
  for(let i=0;i<4000;i++){c.fillStyle=`rgba(255,255,255,${rnd()*.04})`;c.fillRect(rnd()*1024,rnd()*1024,2,2);}
  c.strokeStyle='#f4f1e8';c.lineWidth=10;c.strokeRect(20,20,984,984);c.beginPath();c.moveTo(20,512);c.lineTo(1004,512);c.stroke();
  c.beginPath();c.arc(512,512,110,0,7);c.stroke();c.fillStyle='#24496b';c.fillRect(392,20,240,300);c.strokeRect(392,20,240,300);c.beginPath();c.arc(512,320,110,0,Math.PI);c.stroke();
  c.beginPath();c.arc(512,20,420,0,Math.PI);c.stroke();
  c.save();c.translate(512,512);c.globalAlpha=.45;handMark(c,0,0,1.0,'#7ee35a');c.restore();
  const ct=new THREE.CanvasTexture(cv);ct.colorSpace=THREE.SRGBColorSpace;ct.anisotropy=8;
  const court=new THREE.Mesh(new THREE.PlaneGeometry(15,28),new THREE.MeshStandardMaterial({map:ct,roughness:.8}));court.rotation.x=-Math.PI/2;court.position.set(0,.01,0);court.receiveShadow=true;S.add(court);
  const metal=std('#8b919c',.35,.7);
  const pole=new THREE.Mesh(new THREE.CylinderGeometry(.09,.09,3.4,16),metal);pole.position.set(0,1.7,-14.6);pole.castShadow=true;S.add(pole);
  const arm=new THREE.Mesh(new THREE.BoxGeometry(.1,.1,1.1),metal);arm.position.set(0,3.3,-14.1);S.add(arm);
  const bb=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.05,.05),new THREE.MeshPhysicalMaterial({color:'#ffffff',roughness:.15,transparent:true,opacity:.8}));bb.position.set(0,3.4,-13.5);bb.castShadow=true;S.add(bb);
  const sq=new THREE.Mesh(new THREE.EdgesGeometry(new THREE.BoxGeometry(.6,.45,.06)),new THREE.LineBasicMaterial({color:'#e8572e'}));sq.position.set(0,3.25,-13.47);S.add(sq);
  const rimM=new THREE.Mesh(new THREE.TorusGeometry(.23,.018,10,40),std('#e8572e',.4,.5));rimM.rotation.x=Math.PI/2;rimM.position.set(0,3.05,-13.2);S.add(rimM);
  const netG=new THREE.CylinderGeometry(.23,.15,.42,16,4,true);const net=new THREE.Mesh(netG,new THREE.MeshBasicMaterial({color:'#ffffff',wireframe:true,transparent:true,opacity:.85}));net.position.set(0,2.84,-13.2);S.add(net);
  const netBase=netG.attributes.position.array.slice();
  const fc=document.createElement('canvas');fc.width=128;fc.height=128;const f=fc.getContext('2d');f.strokeStyle='rgba(200,205,212,.9)';f.lineWidth=3;
  for(let i=-128;i<256;i+=32){f.beginPath();f.moveTo(i,0);f.lineTo(i+128,128);f.stroke();f.beginPath();f.moveTo(i+128,0);f.lineTo(i,128);f.stroke();}
  const ft=new THREE.CanvasTexture(fc);ft.wrapS=ft.wrapT=THREE.RepeatWrapping;ft.repeat.set(20,2);
  const fm=new THREE.MeshStandardMaterial({map:ft,transparent:true,alphaTest:.2,side:THREE.DoubleSide,metalness:.6});
  for(const [x,z,ry,len] of [[0,-16,0,22],[-11,0,Math.PI/2,32],[11,0,Math.PI/2,32]]){const m=new THREE.Mesh(new THREE.PlaneGeometry(len,4),fm);m.position.set(x,2,z);m.rotation.y=ry;S.add(m);}
  // floodlights (night)
  const floods=[];const lampM=new THREE.MeshStandardMaterial({color:'#fff',emissive:'#fff7e0',emissiveIntensity:0});
  for(const [x,z] of [[-10.5,-9],[10.5,-9],[-10.5,7],[10.5,7]]){const p=new THREE.Mesh(new THREE.CylinderGeometry(.08,.1,7,10),metal);p.position.set(x,3.5,z);S.add(p);
    const head=new THREE.Mesh(new THREE.BoxGeometry(.9,.35,.3),lampM);head.position.set(x*.93,7,z);S.add(head);
    const L=new THREE.SpotLight('#fff3dc',0,40,.75,.5,1.2);L.position.set(x*.93,6.9,z);L.target.position.set(x*.2,0,z*.6);S.add(L);S.add(L.target);floods.push(L);}
  floods[0].castShadow=true;floods[0].shadow.mapSize.set(1024,1024);
  // street: sidewalk + road + far-side storefronts + lamps
  const side=new THREE.Mesh(new THREE.BoxGeometry(120,.14,4),std('#9a9ca2',.9));side.position.set(0,.07,19.5);side.receiveShadow=true;S.add(side);
  const rc=document.createElement('canvas');rc.width=1024;rc.height=64;const r2=rc.getContext('2d');r2.fillStyle='#2b2d33';r2.fillRect(0,0,1024,64);
  for(let x=0;x<1024;x+=64){r2.fillStyle='#e9d36a';r2.fillRect(x,30,34,4);}const rt=new THREE.CanvasTexture(rc);rt.colorSpace=THREE.SRGBColorSpace;rt.wrapS=THREE.RepeatWrapping;rt.repeat.set(4,1);
  const road=new THREE.Mesh(new THREE.PlaneGeometry(120,8),new THREE.MeshStandardMaterial({map:rt,roughness:.85}));road.rotation.x=-Math.PI/2;road.position.set(0,.02,25.5);road.receiveShadow=true;S.add(road);
  const side2=side.clone();side2.position.z=31.5;S.add(side2);
  const winMats=[];
  const mkWin=(base,lit)=>{const wc=document.createElement('canvas');wc.width=64;wc.height=128;const w=wc.getContext('2d');w.fillStyle=base;w.fillRect(0,0,64,128);
    const em=document.createElement('canvas');em.width=64;em.height=128;const e=em.getContext('2d');e.fillStyle='#000';e.fillRect(0,0,64,128);
    for(let y=0;y<16;y++)for(let x=0;x<4;x++){const on=rnd()<lit;w.fillStyle=on?'#ffd58a':'#2f2c40';w.fillRect(x*16+3,y*8+2,10,5);if(on){e.fillStyle='#ffcf7a';e.fillRect(x*16+3,y*8+2,10,5);}}
    const t=new THREE.CanvasTexture(wc);t.colorSpace=THREE.SRGBColorSpace;t.wrapS=t.wrapT=THREE.RepeatWrapping;const te=new THREE.CanvasTexture(em);te.colorSpace=THREE.SRGBColorSpace;te.wrapS=te.wrapT=THREE.RepeatWrapping;return [t,te];};
  const pal=['#4a4660','#5b4a44','#3f4a5a','#6a5a50','#4d5560'];
  for(let i=0;i<80;i++){const a=rnd()*Math.PI*2,r=48+rnd()*100,h=15+rnd()*65,wd=8+rnd()*12;const x=Math.cos(a)*r,z=Math.sin(a)*r-20;if(z>0&&z<44&&Math.abs(x)<70)continue;
    const [t,te]=mkWin(pal[i%5],.35);t.repeat.set(wd/8,h/10);te.repeat.copy(t.repeat);const mt=new THREE.MeshStandardMaterial({map:t,emissiveMap:te,emissive:'#ffffff',emissiveIntensity:.1,roughness:.9});winMats.push(mt);
    const m=new THREE.Mesh(new THREE.BoxGeometry(wd,h,wd),mt);m.position.set(x,h/2,z);S.add(m);}
  // storefront row across the street (z=34), one of them is the Nah-You shop
  let x=-48;let k2=0;while(x<48){const wd=7+rnd()*5,h=9+rnd()*14;const [t,te]=mkWin(pal[k2%5],.4);t.repeat.set(wd/8,h/10);te.repeat.copy(t.repeat);
    const mt=new THREE.MeshStandardMaterial({map:t,emissiveMap:te,emissive:'#ffffff',emissiveIntensity:.1,roughness:.9});winMats.push(mt);
    const b=new THREE.Mesh(new THREE.BoxGeometry(wd,h,6),mt);b.position.set(x+wd/2,h/2,37);b.castShadow=true;S.add(b);
    const glass=new THREE.Mesh(new THREE.PlaneGeometry(wd*.8,2.4),new THREE.MeshStandardMaterial({color:'#20262e',roughness:.1,metalness:.6,emissive:'#ffcc88',emissiveIntensity:0}));glass.position.set(x+wd/2,1.5,33.99);glass.rotation.y=Math.PI;S.add(glass);winMats.push(glass.material);glass.material.userData.shop=1;
    if(x<-2&&x+wd>-2){const sc=document.createElement('canvas');sc.width=512;sc.height=128;const q=sc.getContext('2d');q.fillStyle='#0b0b0b';q.fillRect(0,0,512,128);dripText(q,'NAH-YOU',256,92,84,NY_G,21,6);
      const st=new THREE.CanvasTexture(sc);st.colorSpace=THREE.SRGBColorSpace;const sign=new THREE.Mesh(new THREE.PlaneGeometry(4,1),new THREE.MeshStandardMaterial({map:st,emissive:'#ffffff',emissiveMap:st,emissiveIntensity:.4}));
      sign.position.set(x+wd/2,3.4,33.95);sign.rotation.y=Math.PI;S.add(sign);}
    x+=wd+.3;k2++;}
  const lampHeads=[];for(let lx=-30;lx<=30;lx+=12){const p=new THREE.Mesh(new THREE.CylinderGeometry(.06,.08,5,8),std('#2a2c30',.5,.6));p.position.set(lx,2.5,21.2);S.add(p);
    const hd=new THREE.Mesh(new THREE.SphereGeometry(.22,12,8),new THREE.MeshStandardMaterial({color:'#fff',emissive:'#ffd9a0',emissiveIntensity:0}));hd.position.set(lx,5,21.2);S.add(hd);lampHeads.push(hd.material);}
  // a few parked cars (simple, rounded boxes)
  for(const [cx,col] of [[-14,'#8e1b1b'],[6,'#1c3d6e'],[19,'#d9d9d9']]){const car=new THREE.Group();const body=new THREE.Mesh(new THREE.BoxGeometry(4.3,.8,1.8),std(col,.3,.6));body.position.y=.65;car.add(body);
    const cab=new THREE.Mesh(new THREE.BoxGeometry(2.3,.6,1.6),new THREE.MeshStandardMaterial({color:'#1a1d22',roughness:.1,metalness:.7}));cab.position.set(-.2,1.3,0);car.add(cab);
    for(const [wx,wz] of [[-1.4,.85],[1.4,.85],[-1.4,-.85],[1.4,-.85]]){const wh=new THREE.Mesh(new THREE.CylinderGeometry(.34,.34,.25,16),std('#111',.8));wh.rotation.x=Math.PI/2;wh.position.set(wx,.34,wz);car.add(wh);}
    car.traverse(o=>{if(o.isMesh)o.castShadow=true;});car.position.set(cx,0,22.6);S.add(car);}
  function setTime(k){const T=TOD[k];const q=skyC.getContext('2d');const gr=q.createLinearGradient(0,0,0,512);gr.addColorStop(0,T.sky[0]);gr.addColorStop(.55,T.sky[1]);gr.addColorStop(1,T.sky[2]);q.fillStyle=gr;q.fillRect(0,0,4,512);
    if(k==='night'){for(let i=0;i<0;i++);}skyT.needsUpdate=true;S.fog.color.set(T.fog);hemi.color.set(T.hemi[0]);hemi.groundColor.set(T.hemi[1]);hemi.intensity=T.hemi[2];
    sun.color.set(T.sun[0]);sun.intensity=T.sun[1];sun.position.set(...T.sun[2]);rim.color.set(T.rim[0]);rim.intensity=T.rim[1];S.environmentIntensity=T.env;
    for(const m of winMats)m.emissiveIntensity=m.userData.shop?(k==='night'?1.2:0):T.win*1.4;for(const L of floods)L.intensity=T.flood*120;lampM.emissiveIntensity=T.flood*3;
    for(const m of lampHeads)m.emissiveIntensity=k==='morning'?0:2.5;R.toneMappingExposure=T.exp;}
  setTime('sunset');
  // net ripple after a swish: amt 0..1
  function netKick(amt,t){const p=netG.attributes.position.array;for(let i=0;i<p.length;i+=3){const yy=netBase[i+1];const f=(.21-yy)/.42;
    p[i]=netBase[i]*(1+amt*.25*Math.sin(t*28+yy*20)*f);p[i+2]=netBase[i+2]*(1+amt*.25*Math.cos(t*25+yy*18)*f);p[i+1]=netBase[i+1]-amt*.06*f;}netG.attributes.position.needsUpdate=true;}
  return {S,sun,setTime,netKick,RIM:new THREE.Vector3(0,3.05,-13.2)};}

// ---------- people ----------
// Motion = real motion-capture clips from the Ready Player Me animation library (made for this exact RPM skeleton,
// so no retargeting: arms, hips and feet move like the actor did). Files live in anim/ (git-ignored; license: RPM avatars only, no redistribution).
const LD=new GLTFLoader();let RPM=null,DRV=null;export const CLIPS={};
export async function loadBase(names){RPM=await LD.loadAsync(window.BASE||'anim/Masculine.glb');DRV=await LD.loadAsync('rpm.glb');
  await Promise.all(Object.entries(names).map(async([k,f])=>{const g=await LD.loadAsync('anim/'+f+'.glb');const c=g.animations[0];
    c.tracks=c.tracks.filter(tr=>/\.quaternion$/.test(tr.name)||tr.name==='Hips.position');
    const hp=c.tracks.find(tr=>tr.name==='Hips.position');
    c.userData={speed:0};if(hp){const v=hp.values;const nn=v.length/3;c.userData.speed=Math.hypot(v[(nn-1)*3]-v[0],v[(nn-1)*3+2]-v[2])/c.duration/(window.HIPS_SCALE||1);c.userData.lift=v[1];}
    if(hp){const v=hp.values;const x0=v[0],z0=v[2];const n=v.length/3;const xe=v[(n-1)*3],ze=v[(n-1)*3+2];
      for(let i=0;i<n;i++){const f=n>1?i/(n-1):0;v[i*3]-=x0+(xe-x0)*f;v[i*3+2]-=z0+(ze-z0)*f;}} // in place, keep natural sway + bounce
    c.name=k;CLIPS[k]=c;}));}
function capMesh(kind,col='#121212'){const g=new THREE.Group();const blk=new THREE.MeshStandardMaterial({color:col,roughness:.8});
  if(kind==='beanie'){const b=new THREE.Mesh(new THREE.SphereGeometry(1,40,20,0,Math.PI*2,0,Math.PI*.5),blk);b.scale.set(.092,.118,.104);g.add(b);
    const cuff=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,40,1,true),blk);cuff.scale.set(.095,.045,.107);cuff.position.y=.008;g.add(cuff);
    const rim=new THREE.Mesh(new THREE.TorusGeometry(1,.03,8,40),blk);rim.rotation.x=Math.PI/2;rim.scale.set(.096,.108,1);rim.position.y=-.014;g.add(rim);}
  else{const b=new THREE.Mesh(new THREE.SphereGeometry(1,40,20,0,Math.PI*2,0,Math.PI*.5),blk);b.scale.set(.091,.1,.103);b.position.y=.012;g.add(b);
    const v=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1,40,1,false,-Math.PI*.36,Math.PI*.72),blk);v.scale.set(.085,.008,.17);v.position.set(0,.014,.02);v.rotation.x=-.1;g.add(v);}
  const pc=document.createElement('canvas');pc.width=128;pc.height=128;const p=pc.getContext('2d');handMark(p,64,74,.55);
  const pt=new THREE.CanvasTexture(pc);pt.colorSpace=THREE.SRGBColorSpace;
  const patch=new THREE.Mesh(new THREE.PlaneGeometry(.06,.06),new THREE.MeshBasicMaterial({map:pt,transparent:true}));patch.position.set(0,kind==='beanie'?.012:.045,kind==='beanie'?.116:.1);patch.rotation.x=kind==='beanie'?-.05:-.4;g.add(patch);return g;}
// Paint the character's own texture: skin tone, hair colour, painted beard, and the Nah-You print on the real T-shirt.
function paintTex(src,o){const W=src.width,H=src.height;const c=document.createElement('canvas');c.width=W;c.height=H;const g=c.getContext('2d');g.drawImage(src,0,0);
  const k=W/1024;const d=g.getImageData(0,0,W,H),p=d.data;const sk=o.skin||[1,1,1];const hc=new THREE.Color(o.hair||'#2a1c14');
  for(let y=0;y<H;y++)for(let x=0;x<W;x++){const i=(y*W+x)*4;const r=p[i],gg=p[i+1],b=p[i+2];
    const inBody=(x<512*k&&y<512*k)||(x>=768*k&&x<896*k&&y>=768*k&&y<896*k);if(!inBody)continue;
    if(r>80&&r>=gg&&gg>=b*0.9&&r-b>25){p[i]=Math.min(255,r*sk[0]);p[i+1]=Math.min(255,gg*sk[1]);p[i+2]=Math.min(255,b*sk[2]);}
    else if(y<300*k&&r<90&&gg<70){const l=(r+gg+b)/3/60;p[i]=Math.min(255,hc.r*255*l*1.3);p[i+1]=Math.min(255,hc.g*255*l*1.3);p[i+2]=Math.min(255,hc.b*255*l*1.3);}}
  g.putImageData(d,0,0);
  {const gr=g.createRadialGradient(110*k,445*k,10*k,110*k,445*k,120*k);gr.addColorStop(0,'#3a1412');gr.addColorStop(1,'#1c0808');g.fillStyle=gr;g.fillRect(0,368*k,205*k,140*k);} // dark mouth inside
  if(o.beard){g.save();g.globalAlpha=o.beard;g.fillStyle=o.hair||'#1a120c';g.filter=`blur(${6*k}px)`;g.beginPath();
    g.ellipse(256*k,266*k,96*k,100*k,0,0,Math.PI);g.fill();g.beginPath();g.ellipse(256*k,234*k,44*k,9*k,0,0,Math.PI*2);g.fill();g.restore();}
  // shirt: front panel x0-256, back panel x256-512, y640-1010 (1024 atlas)
  {const px=g.getImageData(60*k,900*k,1,1).data;g.fillStyle=`rgb(${px[0]},${px[1]},${px[2]})`;}g.fillRect(140*k,700*k,90*k,90*k);g.fillRect(290*k,680*k,190*k,140*k); // cover the stock logos
  if(o.top){g.save();g.fillStyle=o.top;g.globalCompositeOperation='color';g.fillRect(0,512*k,512*k,512*k);g.restore();}
  for(const [kind,x0] of [[o.shirt,0],[o.back,256]]){if(!kind)continue;
    const art=artCanvas(kind).image;const sz=(x0?190:170)*k;g.drawImage(art,(x0+128)*k-sz/2+(o.printDX||0)*k,(o.printY||790)*k-sz/2,sz,sz);}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.flipY=false;t.anisotropy=8;return t;}
let JAW=false;
function addJaw(geo){if(JAW)return;JAW=true;const P=geo.attributes.position,U=geo.attributes.uv;const D=new Float32Array(P.count*3);
  const ss=(a,b,v)=>{const t=Math.min(1,Math.max(0,(v-a)/(b-a)));return t*t*(3-2*t);};const SEAM=1.6535,ang=.11,py=1.668,pz=-.01;
  for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i),u=U.getX(i)*1024,v=U.getY(i)*1024;
    if(z<0.0||y<1.5||y>SEAM+.0015||Math.abs(x)>0.075)continue;
    const faceUV=u<512&&v<512&&u>130;if(Math.abs(y-SEAM)<.0015&&faceUV&&v<249.5)continue; // upper lip stays
    if(faceUV&&v>420)continue;
    let w=1-ss(.04,.072,Math.abs(x));if(y<1.56)w*=ss(1.5,1.56,y);if(z<.03)w*=ss(0,.03,z);
    const dy=y-py,dz=z-pz;const c=Math.cos(ang),s2=Math.sin(ang);const ny=py+dy*c-dz*s2,nz=pz+dy*s2+dz*c;
    D[i*3+1]=(ny-y)*w;D[i*3+2]=(nz-z)*w;}
  geo.morphAttributes.position=[new THREE.Float32BufferAttribute(D,3)];geo.morphTargetsRelative=true;}
// opts: {skin:[r,g,b], hair, beard:0..1, hat:'dad'|'beanie', hatCol, shirt, back, top, printY}
export function person(S,opts={}){const m=SK.clone(RPM.scene);let body;
  m.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;const mt=o.material.clone();mt.transparent=false;mt.alphaTest=0;mt.depthWrite=true;o.material=mt;body=o;}});
  addJaw(body.geometry);body.updateMorphTargets();const src=RPM._src||(RPM._src=body.material.map.image);
  body.material.map=paintTex(src,opts);body.material.needsUpdate=true;
  S.add(m);const bone=n=>m.getObjectByName(n);
  const texC={[`${opts.shirt}|${opts.back}`]:body.material.map};const setShirt=(f,b)=>{const key=`${f}|${b}`;if(!texC[key])texC[key]=paintTex(src,{...opts,shirt:f,back:b});if(body.material.map!==texC[key]){body.material.map=texC[key];body.material.needsUpdate=true;}};
  if(opts.hat){m.updateMatrixWorld(true);const hb=bone('Head');const wrap=new THREE.Group();const M=new THREE.Matrix4().makeTranslation(m.position.x,m.position.y+1.745+(opts.hat==='beanie'?.03:0),m.position.z+.025);
    M.premultiply(new THREE.Matrix4().copy(hb.matrixWorld).invert());M.decompose(wrap.position,wrap.quaternion,wrap.scale);hb.add(wrap);
    const h=capMesh(opts.hat,opts.hatCol);h.scale.setScalar(opts.hatS||1);wrap.add(h);}
  // the clips fit the native RPM skeleton (rpm.glb) exactly; it plays them invisibly and this body copies each bone's world-space motion
  const drv=SK.clone(DRV.scene);drv.visible=false;S.add(drv);const mx=new THREE.AnimationMixer(drv);const A={};const act=k=>A[k]||(A[k]=mx.clipAction(CLIPS[k]));
  m.updateMatrixWorld(true);drv.updateMatrixWorld(true);const pairs=[];
  m.traverse(o=>{if(o.isBone){const d=drv.getObjectByName(o.name);if(d)pairs.push({t:o,d,tw:o.getWorldQuaternion(new THREE.Quaternion()),dwi:d.getWorldQuaternion(new THREE.Quaternion()).invert()});}});
  const tH=bone('Hips'),dH=drv.getObjectByName('Hips');const h0t=tH.getWorldPosition(new THREE.Vector3()).y,h0d=dH.getWorldPosition(new THREE.Vector3()).y;
  const qa=new THREE.Quaternion(),qp=new THREE.Quaternion(),va=new THREE.Vector3(),vb=new THREE.Vector3();
  const sync=()=>{drv.position.copy(m.position);drv.quaternion.copy(m.quaternion);drv.updateMatrixWorld(true);m.updateMatrixWorld(true);
    dH.getWorldPosition(va);va.sub(m.position);va.multiplyScalar(h0t/h0d);va.add(m.position);tH.parent.worldToLocal(vb.copy(va));tH.position.copy(vb);tH.updateMatrixWorld(true);
    for(const p of pairs){p.d.getWorldQuaternion(qa);qa.multiply(p.dwi).multiply(p.tw);p.t.parent.getWorldQuaternion(qp);p.t.quaternion.copy(qp.invert().multiply(qa));p.t.updateMatrixWorld(true);}};
  const qn=new THREE.Quaternion(),e=new THREE.Euler();
  const P={m,bone,setShirt,
    // seq: [[startTime, clipName, {once, off, speed, fade}] ...] sorted. Clips cross-fade like a real weight shift.
    pose(t,seq){for(const k in A)A[k].setEffectiveWeight(0);let i=0;while(i+1<seq.length&&seq[i+1][0]<=t)i++;
      const use=(j,w)=>{if(j<0||w<=0)return;const [st,k,o={}]=seq[j];const a=act(k);a.enabled=true;if(!a.isRunning())a.play();
        const d=CLIPS[k].duration;let tt=(t-st)*(o.speed||1)+(o.off||0);tt=o.once?Math.min(Math.max(tt,0),d-1e-3):((tt%d)+d)%d;a.time=tt;a.setEffectiveWeight(a.getEffectiveWeight()+w);};
      const fade=(seq[i][2]||{}).fade??.35;const w=i>0?Math.min(1,(t-seq[i][0])/fade):1;
      use(i,w);if(w<1)use(i-1,1-w);mx.update(0);sync();},
    // turn head/neck toward a point (adds on top of the mocap, small and smooth)
    look(target,amt=1){const h=bone('Head');m.updateMatrixWorld(true);const hp=h.getWorldPosition(new THREE.Vector3());
      const loc=m.worldToLocal(target.clone());const hl=m.worldToLocal(hp.clone());const dx=loc.x-hl.x,dz=loc.z-hl.z;
      let yaw=Math.atan2(dx,dz);yaw=Math.max(-1.1,Math.min(1.1,yaw))*amt;
      for(const [n,f] of [['Neck',.4],['Head',.6]]){const b=bone(n);qn.setFromEuler(e.set(0,yaw*f,0));b.quaternion.premultiply(qn);}},
    mouth(open){body.morphTargetInfluences[0]=Math.max(0,Math.min(1,open));},
    head(){m.updateMatrixWorld(true);return bone('Head').getWorldPosition(new THREE.Vector3());},
    hand(side='Right'){m.updateMatrixWorld(true);return bone(side+'Hand').getWorldPosition(new THREE.Vector3());}};
  return P;}
export function ball(S){const c=document.createElement('canvas');c.width=256;c.height=128;const g=c.getContext('2d');g.fillStyle='#d9631e';g.fillRect(0,0,256,128);
  g.strokeStyle='#2a140a';g.lineWidth=5;for(const x of [64,128,192]){g.beginPath();g.moveTo(x,0);g.lineTo(x,128);g.stroke();}g.beginPath();g.moveTo(0,64);g.lineTo(256,64);g.stroke();
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;const b=new THREE.Mesh(new THREE.SphereGeometry(.12,32,16),new THREE.MeshStandardMaterial({map:t,roughness:.7}));b.castShadow=true;S.add(b);return b;}
