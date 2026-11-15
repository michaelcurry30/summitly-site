# ASMR sound for a Satisfy Lab drop video: soft air whoosh as the sheet falls, wet squish on contact,
# slow stretchy creaks while it drapes, gentle chime on each new round, quiet ambient pad.
import numpy as np, soundfile as sf, json, sys
SR=44100; rng=np.random.default_rng(7)
ep=json.load(open(sys.argv[1])); D='data/'+ep['id']+'/' if 'id' in ep else 'data/'; sc=json.load(open(D+'scene.json')); n=sc['n']
def lp(x,a):  # one-pole lowpass
    a=np.broadcast_to(np.asarray(a,float),x.shape); y=np.zeros_like(x); s=0.0
    for i in range(len(x)): s+=a[i]*(x[i]-s); y[i]=s
    return y
def env(N,a,r): e=np.ones(N); A=max(1,int(a*SR)); Rr=max(1,int(r*SR)); e[:A]=np.linspace(0,1,A); e[-Rr:]*=np.linspace(1,0,Rr)**2; return e
def whoosh(d=.6): N=int(d*SR); x=lp(rng.normal(0,1,N),.04)*env(N,.35,.25); return x/np.abs(x).max()*.25
def squish(mass):
    d=.45+.1*min(mass,8)/8; N=int(d*SR); t=np.arange(N)/SR
    thump=np.sin(2*np.pi*(70+40*np.exp(-t*20))*t)*np.exp(-t*14)*.8
    wet=lp(rng.normal(0,1,N),.12+.05*np.sin(2*np.pi*9*t))*np.exp(-t*7)*1.4
    clicks=np.zeros(N)
    for _ in range(14): k=int(rng.uniform(0,.35)*SR); L=int(.004*SR); clicks[k:k+L]+=rng.normal(0,1,L)*np.hanning(L)*rng.uniform(.2,.6)
    x=thump+wet+lp(clicks,.3); return x/np.abs(x).max()*.75
def creak(d):
    N=int(d*SR); t=np.arange(N)/SR; f=110+40*np.sin(2*np.pi*.7*t)
    x=np.sign(np.sin(2*np.pi*np.cumsum(f)/SR))*lp(rng.normal(0,1,N),.02)*3
    x=lp(x,.08)*env(N,.3,.4); return x/ (np.abs(x).max() or 1)*.18
def chime():
    N=int(1.2*SR); t=np.arange(N)/SR; x=sum(np.sin(2*np.pi*f*t)*np.exp(-t*k)/i for i,(f,k) in enumerate([(1318,3),(1975,4),(2637,6)],1)); return x*.12
total=0; marks=[]
for r in ep['rounds']:
    d=np.fromfile(D+r["bin"]+".bin",np.float32).reshape(-1,n,3); F=len(d)
    z=d[:,:,2].min(1); hit=int(np.argmax(z<1.56)) if (z<1.56).any() else 20
    sp=np.abs(np.diff(d[:,:,2],axis=0)).mean(1)  # motion energy
    marks.append((total,hit,F,r.get('mass',1),sp)); total+=F
dur=total/30+.5; out=np.zeros(int(dur*SR))
def add(x,t,g=1):
    s=int(t*SR); e=min(len(out),s+len(x)); out[s:e]+=x[:e-s]*g
t=np.arange(len(out))/SR
pad=(np.sin(2*np.pi*110*t)+.6*np.sin(2*np.pi*164.8*t)+.4*np.sin(2*np.pi*220.5*t))*(.5+.5*np.sin(2*np.pi*.08*t))*.018
out+=pad
for (st,hit,F,mass,sp) in marks:
    t0=st/30; add(chime(),t0+.02); add(whoosh(),max(0,t0+hit/30-.55)); add(squish(mass),t0+hit/30)
    # creaks scaled by how much the cloth keeps moving after impact
    late=sp[hit+5:]; 
    if len(late) and late.max()>0.0015:
        k=int(np.argmax(late))+hit+5; add(creak(min(2.5,(F-k)/30)),t0+k/30,min(1.5,late.max()*300))
out=out/np.abs(out).max()*.85; f=int(.5*SR); out[-f:]*=np.linspace(1,0,f)
sf.write(sys.argv[2],np.stack([out,out],1),SR); print('ok',round(dur,2),[ (m[0],m[1]) for m in marks])
