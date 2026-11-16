# "What if" narration: Kokoro am_michael, line + estimated word timings. usage: python3 vo.py wi01  (reads wi01.json "lines")
import json,sys,re,numpy as np,soundfile as sf
from kokoro_onnx import Kokoro
S='/home/claude/summitly-site/studio/tts/';k=Kokoro(S+'kokoro.onnx',S+'voices.bin');SR=24000
ep=sys.argv[1];spec=json.load(open(f'{ep}.json'))
t=0.35;parts=[];lines=[]
for L in spec['lines']:
    txt=L['vo'];a,_=k.create(txt,voice=spec.get('voice','am_michael'),speed=spec.get('speed',1.08),lang='en-us')
    nz=np.where(np.abs(a)>0.012)[0];a=a[max(0,nz[0]-150):nz[-1]+500];d=len(a)/SR
    shown=L.get('cap',txt);words=shown.split();w8=[len(re.sub(r'[^\w]','',w))+2 for w in words];tot=sum(w8);c=t;ws=[]
    for w,q in zip(words,w8): dd=d*q/tot;ws.append({'w':w,'s':round(c,3),'e':round(c+dd,3)});c+=dd
    parts.append((t,a));lines.append({'s':round(t,3),'e':round(t+d,3),'words':ws});t+=d+L.get('gap',0.18)
dur=round(t+0.6,2);buf=np.zeros(int(dur*SR),np.float32)
for st,a in parts: s=int(st*SR);buf[s:s+len(a)]+=a
sf.write(f'out/{ep}_vo.wav',buf,SR);json.dump({'dur':dur,'lines':lines},open(f't/{ep}.json','w'))
print(ep,dur,[ (l['s'],l['e']) for l in lines])
