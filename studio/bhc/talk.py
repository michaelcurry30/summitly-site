# Builds a talking episode: voices (Kokoro, pitch-shifted per character), timeline, mouth envelopes, SFX times.
# usage: python3 talk.py ep2   -> t/ep2.json + out/ep2_vo.wav
import json,sys,numpy as np,soundfile as sf
from kokoro_onnx import Kokoro
S='/home/claude/summitly-site/studio/tts/';k=Kokoro(S+'kokoro.onnx',S+'voices.bin');SR=24000
CAST={'gus':('am_puck',1.0,1.12),'mom':('af_heart',1.05,1.0),'mon':('am_onyx',.95,.80),'boss':('bm_george',1.05,.95),'kid':('af_sky',1.0,1.15),'dre':('am_fenrir',1.05,0.97),'kev':('am_echo',1.12,1.1)}
def say(who,txt,pitch=None):
    v,sp,r=CAST[who];r=pitch or r
    a,sr=k.create(txt,voice=v,speed=sp,lang='en-us');idx=np.where(np.abs(a)>0.01)[0];a=a[max(0,idx[0]-200):idx[-1]+600]
    n=int(len(a)/r);a=np.interp(np.arange(n)*r,np.arange(len(a)),a).astype(np.float32);return a
ep=sys.argv[1];spec=json.load(open(f'{ep}.script.json'))
t=0.0;parts=[];lines={};scenes={};cur=None;sfx=[];marks={}
for it in spec['script']:
    kind=it[0]
    if kind=='scene':
        if cur:scenes[cur][1]=round(t,3)
        cur=it[1];scenes[cur]=[round(t,3),None]
    elif kind=='pause':t+=it[1]
    elif kind=='mark':marks[it[1]]=round(t,3)
    elif kind=='sfx':sfx.append([round(t+(it[2] if len(it)>2 else 0),3),it[1]])
    elif kind=='line':
        _,lid,who,txt=it[:4];a=say(who,txt,it[4] if len(it)>4 else None);d=len(a)/SR
        parts.append((t,a));lines[lid]={'s':round(t,3),'e':round(t+d,3),'who':who,'txt':txt};t+=d
scenes[cur][1]=round(t,3);dur=round(t,2)
buf=np.zeros(int((dur+.5)*SR),dtype=np.float32)
N=int(dur*30)+2;env={w:[0]*N for w in CAST}
for (st,a),lid in zip(parts,lines):
    s=int(st*SR);buf[s:s+len(a)]+=a;who=lines[lid]['who']
    hop=SR//30;rms=[np.sqrt(np.mean(a[i:i+hop]**2)) for i in range(0,len(a),hop)];m=max(rms) or 1
    f0=int(round(st*30))
    for i,v in enumerate(rms):
        if f0+i<N:env[who][f0+i]=round(float(min(1,(v/m)**.7*1.15)),2)
for w in env:  # light smoothing so mouths don't strobe
    e=env[w];env[w]=[round(float(max(e[i],.6*e[i-1] if i else 0)),2) for i in range(len(e))]
sf.write(f'out/{ep}_vo.wav',buf,SR)
json.dump({'dur':dur,'lines':lines,'scenes':scenes,'marks':marks,'sfx':sfx,'env':env},open(f't/{ep}.json','w'))
print(ep,dur,{k:v for k,v in scenes.items()})
