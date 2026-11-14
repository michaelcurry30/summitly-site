import numpy as np, soundfile as sf
sr=44100; bpm=104; beat=60/bpm; bars=16; N=int(sr*beat*4*bars)
t=np.arange(N)/sr; out=np.zeros(N)
def env(n,a=0.005,d=0.2):
    x=np.arange(n)/sr; return np.minimum(1,x/a)*np.exp(-x/d)
def put(sig,start):
    s=int(start*sr); e=min(N,s+len(sig)); out[s:e]+=sig[:e-s]
rng=np.random.default_rng(1)
# kick
kn=int(0.35*sr); kx=np.arange(kn)/sr; kick=np.sin(2*np.pi*(50+90*np.exp(-kx*30))*kx)*np.exp(-kx*9)*0.9
hn=int(0.05*sr); hat=rng.standard_normal(hn)*env(hn,0.001,0.012)*0.18
sn=int(0.2*sr); snare=(rng.standard_normal(sn)*0.35+np.sin(2*np.pi*190*np.arange(sn)/sr)*0.3)*env(sn,0.001,0.06)
chords=[[57,60,64],[53,57,60],[48,52,55],[55,59,62]]  # Am F C G
f=lambda m:440*2**((m-69)/12)
for b in range(bars):
    t0=b*4*beat; ch=chords[b%4]
    for k in range(4): put(kick,t0+k*beat)
    for k in (1,3): put(snare,t0+k*beat)
    for k in range(8): put(hat*(1.0 if k%2 else 0.6),t0+k*beat/2)
    # bass 8ths
    for k in range(8):
        n=int(beat/2*sr); x=np.arange(n)/sr; put(np.sign(np.sin(2*np.pi*f(ch[0]-24)*x))*0.12*env(n,0.005,0.18),t0+k*beat/2)
    # pad
    n=int(4*beat*sr); x=np.arange(n)/sr; pad=sum(np.sin(2*np.pi*f(m)*x)+0.5*np.sin(2*np.pi*f(m)*1.003*x) for m in ch)
    put(pad*0.035*np.minimum(1,x/0.3)*np.minimum(1,(4*beat-x)/0.3),t0)
    # pluck arp
    for k in range(8):
        n=int(0.3*sr); x=np.arange(n)/sr; m=ch[k%3]+12; put(np.sin(2*np.pi*f(m)*x)*0.08*env(n,0.002,0.12),t0+k*beat/2)
out/=np.abs(out).max()*1.1
sf.write('music.wav',np.stack([out,out],1),sr)
print(N/sr)
