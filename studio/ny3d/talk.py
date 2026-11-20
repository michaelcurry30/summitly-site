# Voices for a Nah-You 3D episode. Natural Kokoro voices (NO chipmunk pitch shifting), small speed changes for emotion,
# a touch of room/street reverb so it sounds recorded in a place, and per-scene ambience.
# usage: python3 talk.py ny02  -> t/ny02.json (scenes, lines, marks, mouth envelopes) + out/ny02_vo.wav
import json,sys,numpy as np,soundfile as sf
from kokoro_onnx import Kokoro
S='/home/claude/summitly-site/studio/tts/';k=Kokoro(S+'kokoro.onnx',S+'voices.bin');SR=24000
# who: (voice, base speed)
CAST={'dre':('am_michael',1.0),'kev':('am_puck',1.08),'marcus':('am_fenrir',.98),'jay':('am_onyx',1.0),'rio':('am_eric',1.1),
      'tasha':('af_heart',1.05),'crowd':('am_adam',1.1)}
def say(who,txt,speed=None):
    v,sp=CAST[who];a,sr=k.create(txt,voice=v,speed=speed or sp,lang='en-us')
    idx=np.where(np.abs(a)>0.01)[0];a=a[max(0,idx[0]-240):idx[-1]+700].astype(np.float32)
    return a
def room(a,wet=.12,ms=(23,41,67,97)):
    out=a.copy()
    for i,d in enumerate(ms):
        n=int(SR*d/1000);g=wet*(.7**i);out[n:]+=a[:-n]*g
    return out
ep=sys.argv[1];spec=json.load(open(f'{ep}.script.json'))
t=0.0;parts=[];lines={};scenes={};cur=None;marks={}
for it in spec['script']:
    kind=it[0]
    if kind=='scene':
        if cur:scenes[cur][1]=round(t,3)
        cur=it[1];scenes[cur]=[round(t,3),None,it[2] if len(it)>2 else {}]
    elif kind=='pause':t+=it[1]
    elif kind=='mark':marks[it[1]]=round(t,3)
    elif kind=='line':
        _,lid,who,txt=it[:4];o=it[4] if len(it)>4 else {}
        a=say(who,txt,o.get('speed'));a=room(a,o.get('wet',scenes[cur][2].get('wet',.1)))*o.get('gain',1.0)
        d=len(a)/SR;st=t+o.get('overlap',0)*-1
        parts.append((st,a,lid));lines[lid]={'s':round(st,3),'e':round(st+d,3),'who':who,'txt':o.get('cap',txt)};t=st+d+o.get('after',0.12)
scenes[cur][1]=round(t,3);dur=round(t+spec.get('tail',0),2)
buf=np.zeros(int((dur+.6)*SR),dtype=np.float32)
N=int(dur*30)+2;env={}
for st,a,lid in parts:
    s=int(st*SR);buf[s:s+len(a)]+=a[:len(buf)-s];who=lines[lid]['who'];env.setdefault(who,[0]*N)
    hop=SR//30;rms=[np.sqrt(np.mean(a[i:i+hop]**2)) for i in range(0,len(a),hop)];m=np.percentile(rms,95) or 1
    f0=int(round(st*30))
    for i,v in enumerate(rms):
        if 0<=f0+i<N:env[who][f0+i]=max(env[who][f0+i],round(float(min(1,(v/m)**.8)),2))
for w in env:
    e=env[w];env[w]=[round(float(max(e[i],.55*e[i-1] if i else 0)),2) for i in range(len(e))]
pk=np.abs(buf).max();buf=buf/pk*.9 if pk>0 else buf
sf.write(f'out/{ep}_vo.wav',buf,SR)
json.dump({'dur':dur,'lines':lines,'scenes':{k2:v[:2] for k2,v in scenes.items()},'marks':marks,'env':env},open(f't/{ep}.json','w'),indent=0)
print(ep,dur,{k2:v[:2] for k2,v in scenes.items()})
