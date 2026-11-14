// Exercise definitions for ex.html. pose(R,p,t): p = 0 (start) .. 1 (peak contraction)
(function(){
const stand=(R,{hipY=1.0,hipZ=0,lean=0,fw=0.1,fz=0,poleZ=1,neck=true}={})=>{
  const {B,V,X}=R;
  R.setHips(hipY,hipZ);
  if(lean){R.rotW(B('Hips'),X,lean*0.8);R.rotW(B('Spine1'),X,lean*0.12);R.rotW(B('Spine2'),X,lean*0.08);if(neck)R.rotW(B('Neck'),X,-lean*0.45);}
  R.legs(V(fw,0.084,fz),V(-fw,0.084,fz),poleZ);
};
const shoulder=(R,s)=>R.wp(R.B(s+'Arm'));
window.EXDEF={
 squat:{title:'SQUAT',muscles:['quads','glutes'],period:2.8,
  pose(R,p){const {V}=R;stand(R,{hipY:1.0-0.44*p,hipZ:-0.24*p,lean:0.62*p,fw:0.16});
    for(const s of['Left','Right']){const sh=shoulder(R,s),sx=Math.sign(sh.x);
      R.ik(R.B(s+'Arm'),R.B(s+'ForeArm'),R.B(s+'Hand'),V(sh.x*0.9,sh.y-0.04,sh.z+0.56),sh.clone().add(V(sx*0.3,-0.6,0)));}
  },
 },
 curl:{title:'BICEP CURL',muscles:['biceps'],dumbbell:true,period:2.6,
  pose(R,p){const {V}=R;stand(R,{});
    for(const s of['Left','Right']){const sh=shoulder(R,s),sx=Math.sign(sh.x);
      const el=V(sh.x+sx*0.04,sh.y-0.28,sh.z+0.03);const th=0.2+2.25*p;
      const hand=el.clone().add(V(0,-Math.cos(th)*0.27,Math.sin(th)*0.27));
      R.ik(R.B(s+'Arm'),R.B(s+'ForeArm'),R.B(s+'Hand'),hand,sh.clone().add(V(sx*0.1,-0.35,-0.8)));}
  }},
 lateral:{title:'LATERAL RAISE',muscles:['shoulders'],labels:{shoulders:'SIDE DELTS'},dumbbell:true,period:2.8,
  pose(R,p){const {V}=R;stand(R,{});
    for(const s of['Left','Right']){const sh=shoulder(R,s),sx=Math.sign(sh.x);const ph=0.2+1.25*p;
      const hand=sh.clone().add(V(sx*Math.sin(ph)*0.53,-Math.cos(ph)*0.53,0.06));
      R.ik(R.B(s+'Arm'),R.B(s+'ForeArm'),R.B(s+'Hand'),hand,sh.clone().add(V(sx*0.3,0.1,-0.8)));}
  }},
 bridge:{title:'GLUTE BRIDGE',muscles:['glutes','hamstrings'],period:3.0,cam:{r:5.8,h:1.9,ty:0.75,tz:-0.1,a0:100,sp:-3},
  pose(R,p){const {B,V,X,model,THREE}=R;const a=0.62*p;
    model.rotation.set(-Math.PI/2-a,0,0);model.updateMatrixWorld(true);
    const s2=R.wp(B('Spine2'));model.position.set(-s2.x,0.13-s2.y,-0.55-s2.z);model.updateMatrixWorld(true);
    R.rotW(B('Neck'),X,a*0.9);
    const fz=0.42;R.legs(V(0.12,0.09,fz),V(-0.12,0.09,fz),0,true);
    for(const s of['Left','Right']){const L=R.wp(B(s+'UpLeg'));const sx=Math.sign(L.x);
      const hip=R.wp(B(s+'UpLeg'));R.ik(B(s+'UpLeg'),B(s+'Leg'),B(s+'Foot'),V(sx*0.12,0.09,fz),hip.clone().add(V(sx*0.05,1.2,0.3)));
      R.aim(B(s+'Foot'),B(s+'ToeBase'),V(sx*0.12,0.0,fz+0.12));}
    for(const s of['Left','Right']){const sh=shoulder(R,s),sx=Math.sign(sh.x);
      R.ik(B(s+'Arm'),B(s+'ForeArm'),B(s+'Hand'),V(sx*0.3,0.03,sh.z+0.5),sh.clone().add(V(sx*0.4,0.3,0)));}
  }},
 pushup:{title:'PUSH-UP',muscles:['chest','triceps','shoulders'],labels:{shoulders:'FRONT DELTS'},period:2.4,cam:{r:5.6,h:1.9,ty:0.75,a0:-40,sp:3},
  pose(R,p){const {B,V,model,THREE}=R;
    const body=(q)=>{model.rotation.set(Math.PI/2-THREE.MathUtils.degToRad(19-10*q),0,0);model.position.set(0,0,0);model.updateMatrixWorld(true);
      const toe=R.wp(B('LeftToeBase'));model.position.set(0,-toe.y+0.035,-0.75-toe.z);model.updateMatrixWorld(true);};
    body(0);const hz=R.wp(B('LeftArm')).z;body(p);
    for(const s of['Left','Right']){const sh=R.wp(B(s+'Arm'));const tgt=V(sh.x*1.35,0.03,hz);
      R.ik(B(s+'Arm'),B(s+'ForeArm'),B(s+'Hand'),tgt,sh.clone().add(V(sh.x*1.4,0.2,-1.0)));
      R.aim(B(s+'Hand'),B(s+'HandMiddle1'),tgt.clone().add(V(sh.x*0.15,-0.01,0.14)));}
  }},
 lunge:{title:'LUNGE',muscles:['quads','glutes'],period:3.0,cam:{a0:-70,sp:4},
  pose(R,p){const {B,V,X}=R;R.setHips(1.0-0.36*p,-0.04);
    const hipL=R.wp(B('LeftUpLeg')),hipR=R.wp(B('RightUpLeg'));
    R.ik(B('LeftUpLeg'),B('LeftLeg'),B('LeftFoot'),V(0.11,0.084,0.4),hipL.clone().add(V(0,-0.3,1)));R.aim(B('LeftFoot'),B('LeftToeBase'),V(0.11,0.0,0.51));
    R.ik(B('RightUpLeg'),B('RightLeg'),B('RightFoot'),V(-0.11,0.13,-0.48),hipR.clone().add(V(0,-0.6,1)));R.aim(B('RightFoot'),B('RightToeBase'),V(-0.11,0.0,-0.4));
    for(const s of['Left','Right']){const sh=R.wp(B(s+'Arm')),sx=Math.sign(sh.x);R.ik(B(s+'Arm'),B(s+'ForeArm'),B(s+'Hand'),V(sx*0.2,sh.y-0.45,sh.z+0.1),sh.clone().add(V(sx*0.5,-0.3,-0.4)));}
  }},
 press:{title:'SHOULDER PRESS',muscles:['shoulders','triceps'],dumbbell:true,period:2.8,
  pose(R,p){const {B,V}=R;stand(R,{});
    for(const s of['Left','Right']){const sh=R.wp(B(s+'Arm')),sx=Math.sign(sh.x);
      const hand=V(sx*(0.36-0.12*p),sh.y+0.08+0.48*p,sh.z+0.03);
      R.ik(B(s+'Arm'),B(s+'ForeArm'),B(s+'Hand'),hand,sh.clone().add(V(sx*0.7,-0.4,-0.1)));}
  }},
 calf:{title:'CALF RAISE',muscles:['calves'],period:2.4,cam:{a0:-115,sp:3,ty:0.85},
  pose(R,p){const {B,V}=R;const h=0.09*p;R.setHips(1.0+h,0);
    R.legs(V(0.1,0.084+h,0),V(-0.1,0.084+h,0),1,true,V(0.1,0.0,0.13),V(-0.1,0.0,0.13));
    for(const s of['Left','Right']){const sh=R.wp(B(s+'Arm')),sx=Math.sign(sh.x);R.ik(B(s+'Arm'),B(s+'ForeArm'),B(s+'Hand'),V(sx*0.24,sh.y-0.5,sh.z+0.04),sh.clone().add(V(sx*0.4,-0.3,-0.5)));}
  }},
 crunch:{title:'CRUNCH',muscles:['abs'],period:2.4,cam:{r:5.6,h:1.9,ty:0.7,tz:-0.1,a0:100,sp:-3},
  pose(R,p){const {B,V,X,model}=R;model.rotation.set(-Math.PI/2,0,0);model.updateMatrixWorld(true);
    const hp=R.wp(B('Hips'));model.position.set(-hp.x,0.13-hp.y,0.1-hp.z);model.updateMatrixWorld(true);
    R.rotW(B('Spine1'),X,0.5*p);R.rotW(B('Spine2'),X,0.42*p);R.rotW(B('Neck'),X,0.15*p);
    for(const s of['Left','Right']){const hip=R.wp(B(s+'UpLeg')),sx=Math.sign(hip.x);
      R.ik(B(s+'UpLeg'),B(s+'Leg'),B(s+'Foot'),V(sx*0.12,0.09,0.6),hip.clone().add(V(sx*0.05,1.2,0.3)));R.aim(B(s+'Foot'),B(s+'ToeBase'),V(sx*0.12,0.0,0.72));}
    const hd=R.wp(B('Head'));
    for(const s of['Left','Right']){const sh=R.wp(B(s+'Arm')),sx=Math.sign(sh.x);R.ik(B(s+'Arm'),B(s+'ForeArm'),B(s+'Hand'),hd.clone().add(V(sx*0.1,0.0,-0.06)),sh.clone().add(V(sx*0.6,0.1,-0.1)));}
  }},
 row:{title:'BENT-OVER ROW',muscles:['back','biceps'],labels:{back:'LATS · UPPER BACK'},dumbbell:true,period:2.8,cam:{a0:-75,sp:4},
  pose(R,p){const {B,V}=R;stand(R,{hipY:0.95,hipZ:-0.14,lean:1.15,fw:0.12});
    const hp=R.wp(B('Hips'));
    for(const s of['Left','Right']){const sh=R.wp(B(s+'Arm')),sx=Math.sign(sh.x);
      const down=sh.clone().add(V(sx*0.02,-0.54,0.04)),up=V(sh.x+sx*0.03,sh.y-0.2,hp.z+0.12);
      R.ik(B(s+'Arm'),B(s+'ForeArm'),B(s+'Hand'),down.lerp(up,p),sh.clone().add(V(sx*0.25,0.4,-0.6)));}
  }},
 rdl:{title:'ROMANIAN DEADLIFT',muscles:['hamstrings','glutes'],dumbbell:true,period:3.2,cam:{a0:-80,sp:4},
  pose(R,p){const {B,V}=R;stand(R,{hipY:1.0-0.08*p,hipZ:-0.2*p,lean:1.25*p,fw:0.11});
    for(const s of['Left','Right']){const sh=R.wp(B(s+'Arm')),sx=Math.sign(sh.x);
      R.ik(B(s+'Arm'),B(s+'ForeArm'),B(s+'Hand'),sh.clone().add(V(-sx*0.02,-0.55,0.02)),sh.clone().add(V(sx*0.3,0,-0.8)));}
  }},
 kickback:{title:'TRICEP KICKBACK',muscles:['triceps'],dumbbell:true,period:2.6,cam:{a0:-80,sp:4},
  pose(R,p){const {B,V}=R;stand(R,{hipY:0.95,hipZ:-0.14,lean:1.15,fw:0.12});
    const hp=R.wp(B('Hips')),nk=R.wp(B('Neck'));const back=hp.clone().sub(nk).normalize();
    for(const s of['Left','Right']){const sh=R.wp(B(s+'Arm')),sx=Math.sign(sh.x);
      const el=sh.clone().add(back.clone().multiplyScalar(0.27)).add(V(sx*0.02,0,0));
      const dir=V(0,-1,0).lerp(back,p).normalize();
      R.ik(B(s+'Arm'),B(s+'ForeArm'),B(s+'Hand'),el.clone().add(dir.multiplyScalar(0.27)),el.clone().add(V(0,0.4,0.1)));}
  }},
};
})();
