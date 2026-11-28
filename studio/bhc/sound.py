# Bad Habit Club sound: custom comedy SFX + bouncy plucked music bed, mixed to the EP sfx list.
import numpy as np, soundfile as sf, json, sys, subprocess
SR=44100; rng=np.random.default_rng(3)
K='/home/claude/summitly-site/studio/kit/sound/sfx/'
def T(d): return np.arange(int(d*SR))/SR
def env(n,a=.005,r=.1):
    e=np.ones(n);A=int(a*SR);R=int(r*SR);e[:A]=np.linspace(0,1,A);e[-R:]*=np.linspace(1,0,R);return e
def alarm():
    out=[];
    for i in range(6):
        t=T(.16);b=np.sign(np.sin(2*np.pi*2400*t))*.25*env(len(t),.002,.02);out+= [b,np.zeros(int(.09*SR))]
    return np.concatenate(out)
def birds():
    out=np.zeros(int(1.8*SR))
    for i in range(7):
        st=int(rng.uniform(0,1.5)*SR);d=.09;t=T(d);f=np.linspace(3200,4800,len(t))+400*np.sin(2*np.pi*30*t)
        ch=np.sin(2*np.pi*np.cumsum(f)/SR)*.25*env(len(t),.003,.03);out[st:st+len(ch)]+=ch
    return out
def blah():
    out=[]
    for i in range(10):
        d=rng.uniform(.08,.16);t=T(d);f0=rng.uniform(140,190)
        v=sum(np.sin(2*np.pi*f0*k*t)/k for k in range(1,8))*.12*env(len(t),.01,.04)
        v*=1+.5*np.sin(2*np.pi*rng.uniform(3,7)*t);out+=[v,np.zeros(int(rng.uniform(.03,.07)*SR))]
    return np.concatenate(out)
def scratch():
    t=T(.35);f=np.concatenate([np.linspace(300,1800,len(t)//2),np.linspace(1800,200,len(t)-len(t)//2)])
    n=rng.normal(0,1,len(t));s=np.sin(2*np.pi*np.cumsum(f)/SR)*.3+n*.08
    return s*env(len(t),.005,.08)
def storm(d=16.0):
    n=np.random.default_rng(4).standard_normal(int(d*SR));b=np.cumsum(n);b=b-np.convolve(b,np.ones(2000)/2000,'same');b=b/ (np.abs(b).max() or 1)
    t=T(d);e=np.minimum(1,t/1.5)*np.minimum(1,(d-t)/2.5)*(.7+.3*np.sin(t*1.3));return b*e*.4
CUSTOM={'STORM':storm,'ALARM':alarm,'BIRDS':birds,'BLAH':blah,'SCRATCH':scratch}
def pluck(f,d,decay=.996):
    N=int(SR/f);buf=rng.uniform(-1,1,N);out=np.zeros(int(d*SR))
    for i in range(len(out)):
        out[i]=buf[i%N];buf[i%N]=decay*.5*(buf[i%N]+buf[(i+1)%N])
    return out
def music(dur):
    bpm=118;beat=60/bpm;out=np.zeros(int((dur+1)*SR))
    prog=[[60,64,67],[57,60,64],[53,57,60],[55,59,62]]; mel=[72,74,76,79,76,74,72,71,69,71,72,74,72,67,69,71]
    hz=lambda m:440*2**((m-69)/12)
    cache={}
    def P(m,d):
        k=(m,round(d,2))
        if k not in cache:cache[k]=pluck(hz(m),d)
        return cache[k]
    i=0;tt=0.0
    while tt<dur:
        ch=prog[(i//8)%4]
        if i%2==0:
            b=P(ch[0]-12,beat*.9)*.35;s=int(tt*SR);out[s:s+len(b)]+=b[:len(out)-s]
        n=P(mel[i%16] if i%4!=3 else ch[1]+12,beat*.45)*.18;s=int(tt*SR);out[s:s+len(n)]+=n[:len(out)-s]
        if i%2==1:
            h=rng.normal(0,1,int(.03*SR))*.04*np.linspace(1,0,int(.03*SR));out[s:s+len(h)]+=h[:len(out)-s]
        tt+=beat/2;i+=1
    return out[:int(dur*SR)]
def load(name):
    if name in CUSTOM:return CUSTOM[name]()
    a,sr=sf.read(K+name+'_1.wav');a=a.mean(1) if a.ndim>1 else a
    if sr!=SR: a=np.interp(np.arange(int(len(a)*SR/sr))*sr/SR,np.arange(len(a)),a)
    return a
ep=json.loads(sys.argv[1]);dur=ep['dur'];mix=music(dur)*.5
fx=np.zeros_like(mix)
for t,n in ep['sfx']:
    a=load(n)*.8;s=int(t*SR);e=min(len(fx),s+len(a));fx[s:e]+=a[:e-s]
if len(sys.argv)>3:
    v,vsr=sf.read(sys.argv[3]);v=v.mean(1) if v.ndim>1 else v
    v=np.interp(np.arange(int(len(v)*SR/vsr))*vsr/SR,np.arange(len(v)),v)[:len(mix)];vv=np.zeros_like(mix);vv[:len(v)]=v
    e=np.convolve(np.abs(vv),np.ones(4410)/4410,'same');duck=1-.6*np.clip(e/ (e.max() or 1)*4,0,1)
    mix=mix*duck*.8;fx=fx*.75;fx=fx+vv/ (np.abs(vv).max() or 1)*.95
m=mix+fx;fade=int(.6*SR);m[-fade:]*=np.linspace(1,0,fade)
m=m/max(1e-6,np.abs(m).max())*.8
sf.write(sys.argv[2],np.stack([m,m],1),SR)
