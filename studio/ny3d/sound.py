# Sound for a Nah-You 3D episode: original hip-hop beat that follows the story, place ambience (street, court, crowd),
# real crowd voices (Kokoro, many voices layered), ball bounces, net swish, slow-mo riser and hits. Voices on top, music ducked.
# usage: python3 sound.py ny02 -> out/ny02_mix.wav
import numpy as np, soundfile as sf, json, sys
from kokoro_onnx import Kokoro
SR=44100;rng=np.random.default_rng(7)
ep=sys.argv[1];TL=json.load(open(f't/{ep}.json'));DUR=TL['dur'];N=int((DUR+.3)*SR)
SC=TL['scenes'];LN=TL['lines'];MK=TL['marks']
def T(d):return np.arange(int(d*SR))/SR
def env(n,a=.005,r=.1):
    e=np.ones(n);A=max(1,int(a*SR));Rr=max(1,int(r*SR));e[:A]=np.linspace(0,1,A);e[-Rr:]*=np.linspace(1,0,Rr);return e
def lp(x,k=8):
    if k<=1:return x
    c=np.cumsum(np.insert(x,0,0));y=(c[k:]-c[:-k])/k;return np.concatenate([y,np.zeros(k-1)])
def hp(x,k=8):return x-lp(x,k)
def add(buf,s,t,g=1.0):
    i=int(t*SR)
    if i<0:s=s[-i:];i=0
    n=min(len(s),len(buf)-i)
    if n>0:buf[i:i+n]+=s[:n]*g
def rev(x,wet=.25):
    out=x.copy()
    for i,d in enumerate([29,47,71,103,151,211]):
        n=int(SR*d/1000);out[n:]+=x[:-n]*wet*(.72**i)
    return out
# ---------- drums / instruments ----------
def kick(g=1):t=T(.42);f=48+90*np.exp(-t*28);return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-t*7)*g
def snare(g=1):t=T(.25);n=hp(rng.normal(0,1,len(t)),3)*np.exp(-t*16)*.55;tone=np.sin(2*np.pi*190*t)*np.exp(-t*25)*.5;return rev((n+tone)*g,.18)
def hat(g=1,o=False):t=T(.18 if o else .05);return hp(rng.normal(0,1,len(t)),2)*np.exp(-t*(14 if o else 70))*.22*g
def clap(g=1):
    t=T(.3);s=np.zeros(len(t))
    for d in (0,.012,.024):s[int(d*SR):]+=hp(rng.normal(0,1,len(t)-int(d*SR)),3)*np.exp(-t[:len(t)-int(d*SR)]*30)
    return rev(s*.3*g,.25)
def bass(f,d,g=1):t=T(d);s=np.sin(2*np.pi*f*t)+.25*np.sin(4*np.pi*f*t);return np.tanh(s*1.6)*env(len(t),.01,.08)*.5*g
def keys(fs,d,g=1):
    t=T(d);s=sum(np.sin(2*np.pi*f*t)*(1+.15*np.sin(2*np.pi*4.5*t))+.3*np.sin(4*np.pi*f*t)*np.exp(-t*3) for f in fs)
    return rev(s*np.exp(-t*1.1)*env(len(t),.01,.3)*.07*g,.3)
def riser(d):t=T(d);f=200+1800*(t/d)**2;s=np.sin(2*np.pi*np.cumsum(f)/SR)*.15+hp(rng.normal(0,1,len(t)),2)*.12*(t/d);return s*(t/d)**1.5
def boom():t=T(2.2);f=40+60*np.exp(-t*6);return rev(np.tanh(np.sin(2*np.pi*np.cumsum(f)/SR)*2*np.exp(-t*1.6))*.9,.3)
def whoosh(d=.6,g=1):t=T(d);n=rng.normal(0,1,len(t));k=np.linspace(30,3,len(t)).astype(int);y=np.array([0.0]*len(t));c=lp(n,6)-lp(n,40);return c*np.sin(np.pi*t/d)**2*.5*g
def bounce(g=1):t=T(.16);s=np.sin(2*np.pi*(95+60*np.exp(-t*40))*t)*np.exp(-t*30)+lp(rng.normal(0,1,len(t)),4)*np.exp(-t*60)*.6;return rev(s*.55*g,.15)
def swish():t=T(.45);n=hp(rng.normal(0,1,len(t)),2);return (n*np.exp(-((t-.12)/.09)**2)*.35+lp(rng.normal(0,1,len(t)),3)*np.exp(-t*8)*.1)
def catch():t=T(.12);return lp(rng.normal(0,1,len(t)),2)*np.exp(-t*50)*.6
# ---------- voices for the crowd ----------
K=Kokoro('/home/claude/summitly-site/studio/tts/kokoro.onnx','/home/claude/summitly-site/studio/tts/voices.bin')
def say(txt,v,sp=1.0):
    a,sr=K.create(txt,voice=v,speed=sp,lang='en-us');a=np.interp(np.arange(int(len(a)*SR/sr))*sr/SR,np.arange(len(a)),a)
    idx=np.where(np.abs(a)>.01)[0];return a[idx[0]:idx[-1]+2000] if len(idx) else a
MV=['am_adam','am_echo','am_eric','am_liam','am_onyx','am_puck','am_fenrir','am_michael','bm_daniel','bm_lewis','af_bella','af_nicole','af_sarah','af_sky']
def crowd(lines,spread=.5,g=1.0):
    out=np.zeros(int((spread+2.5)*SR))
    for i,txt in enumerate(lines):
        v=MV[i%len(MV)];s=say(txt,v,rng.uniform(.95,1.2));add(out,s*rng.uniform(.5,1.0),rng.uniform(0,spread))
    return rev(lp(out,2),.35)*g
def babble(d):
    out=np.zeros(int(d*SR));chat=["yo what's good","nah for real though","he's been cooking all week","who got next","run it back","bro I'm telling you","that's crazy","let's get it","I got winners","okay okay"]
    t=0.0
    while t<d-.5:
        s=say(rng.choice(chat),MV[rng.integers(len(MV))],1.1);add(out,s*rng.uniform(.25,.55),t);t+=rng.uniform(.15,.5)
    return rev(lp(out,5),.45)
# ---------- arrangement ----------
mus=np.zeros(N);amb=np.zeros(N);fx=np.zeros(N)
BPM=90;beat=60/BPM
CH=[(55,[220,261.6,329.6]),(43.65,[174.6,220,261.6]),(65.4,[261.6,329.6,392]),(49,[196,246.9,293.7])]  # Am F C G
def bar(t0,level,full=True):
    b=int((t0/(beat*4)))%4;f,ch=CH[b]
    add(mus,keys(ch,beat*4),t0,level*(1.0 if full else 1.3))
    if full:
        for k,pos in enumerate([0,1.5,2.5]):add(mus,kick(),t0+pos*beat,.9*level)
        for pos in (1,3):add(mus,snare(),t0+pos*beat,.6*level);add(mus,clap(),t0+pos*beat,.35*level)
        for i8 in range(8):add(mus,hat(1,i8==7),t0+i8*beat/2+(.035 if i8%2 else 0),.55*level)
        for pos,d in [(0,1.4),(1.5,.9),(2.5,1.3)]:add(mus,bass(f,d*beat),t0+pos*beat,.7*level)
    else:
        for i8 in range(8):add(mus,hat(.6),t0+i8*beat/2+(.035 if i8%2 else 0),.35*level)
s0,e0=SC['street'];s1,e1=SC['drills'];s2,e2=SC['night'];s3,e3=SC['tag']
t=0.0
while t<DUR:
    if t<e0:bar(t,.55,full=t>2.6)           # morning: light, beat kicks in when Kev arrives
    elif t<e1:bar(t,.85)                    # drills: full beat
    elif t<MK['step']:bar(t,.5,full=False)  # night opens on keys + crowd
    elif t<LN['c3']['e']:bar(t,.6)          # tension
    elif t<MK['swish']:pass                 # beat drops out: "Nah. You." ... the drive
    else:bar(t,1.0)                         # GAME
    t+=beat*4
# gentle stop of anything that leaks into the silent gap, then the drop
gap0=int((LN['c3']['e']+.05)*SR);gap1=int(MK['swish']*SR);mus[gap0:gap1]*=0
add(fx,riser(MK['swish']-MK['drive']-.6),MK['drive']+.6,.8)
add(fx,boom(),MK['swish']-.02,.9);add(fx,swish(),MK['swish']-.08,1.4)
# ---------- ambience ----------
# street morning: traffic hush + birds + a car passing
n=rng.normal(0,1,int((e0-s0+.5)*SR));tr=lp(n,60)*.6;add(amb,tr*env(len(tr),.3,.4),s0,.5)
for i in range(9):
    tt=T(.09);f=np.linspace(3300,5000,len(tt))+500*np.sin(2*np.pi*28*tt);add(amb,np.sin(2*np.pi*np.cumsum(f)/SR)*.06*env(len(tt),.003,.03),s0+rng.uniform(.2,e0-.5))
add(amb,whoosh(2.2,.5),s0+3.0)
# court at sunset: distant city, birds fewer, bounces
n=rng.normal(0,1,int((e1-s1+.3)*SR));add(amb,lp(n,90)*.45*env(len(n),.2,.3),s1,.5)
jog=3.6*.85;import math;len_=math.hypot(4.4-1.3,-.2+6.4);jT=len_/jog
k=0
while (k+.5)/2.6<jT:add(fx,bounce(),s1+(k+.5)/2.6,.9);k+=1
rel=s1+jT+.62;sw=rel+.75;add(fx,whoosh(.5,.5),rel);add(fx,swish(),sw-.05,1.2)
for q,gg in [(.95,.8),(1.45,.5),(1.85,.3)]:add(fx,bounce(gg),sw+q)
# night: crowd babble, "oooh", cheers
add(amb,babble(e2-s2+.2),s2,.55)
add(fx,crowd(["ooooh","oooh!","ohhh","oooooh","ohh snap","oooh"],.35,1.0),LN['c3']['e']+.05,.9)
add(fx,crowd(["let's go!","yeahhh!","ayyy!","game!","he's nice!","ohhhh!","let's goooo!","yeah!","woooo!","sheesh!"],.6,1.2),MK['swish']+.05,1.1)
n=rng.normal(0,1,int(3.5*SR));app=np.zeros(len(n))
for i in range(260):i0=rng.integers(0,len(n)-800);app[i0:i0+800]+=hp(rng.normal(0,1,800),2)*np.exp(-np.arange(800)/120)*rng.uniform(.2,1)
add(fx,app*.25*env(len(app),.05,1.5),MK['swish']+.1)
drive=MK['drive'];add(fx,catch(),drive+.6,1.0)
tr_=drive+.95;jumpAt=tr_+(1.45+8.3)/(5.79*.92);k=0
while tr_+(k+.5)/2.9<jumpAt:
    tb=(k+.5)/2.9
    if tb>.2:add(fx,bounce(1.1),tr_+tb)
    k+=1
add(fx,whoosh(.9,.9),jumpAt+.1)
# tag + end card
add(amb,babble(DUR-s3+.2),s3,.35)
add(fx,boom(),e3+.3,.5);add(fx,crowd(["ayy","yo"],.3,.4),e3+.4,.4)
# ---------- mix ----------
vo,vsr=sf.read(f'out/{ep}_vo.wav');vo=np.interp(np.arange(int(len(vo)*SR/vsr))*vsr/SR,np.arange(len(vo)),vo);V=np.zeros(N);add(V,vo,0)
ve=lp(np.abs(V),int(.08*SR));ve=ve/ (ve.max() or 1);duck=1-.6*np.clip(ve*3,0,1)
mix=mus*duck*.7+amb*.55+fx*.8+V*1.25
fade=int(.6*SR);mix[-fade:]*=np.linspace(1,0,fade)
mix=np.tanh(mix*1.1)/np.tanh(1.1);mix=mix/np.abs(mix).max()*.92
sf.write(f'out/{ep}_mix.wav',np.stack([mix,mix],1).astype(np.float32),SR)
print('mix',DUR)
