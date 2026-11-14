import json,sys,os,numpy as np,soundfile as sf
from kokoro_onnx import Kokoro
S='/home/claude/summitly-site/studio/tts/'
k=Kokoro(S+'kokoro.onnx',S+'voices.bin')
specs=json.load(open('specs.json'))
for sp in specs:
    if len(sys.argv)>1 and sp['id'] not in sys.argv[1:]: continue
    t=0.15;parts=[];tl=[]
    for i,l in enumerate(sp['lines']):
        a,sr=k.create(l['vo'],voice='am_michael',speed=1.12,lang='en-us')
        idx=np.where(np.abs(a)>0.01)[0];a=a[max(0,idx[0]-300):idx[-1]+1200]
        d=len(a)/sr;parts.append((t,a));tl.append([round(t,2),round(t+d,2)]);t+=d+0.28
    total=round(t+0.8,2)
    buf=np.zeros(int((total+0.5)*sr),dtype=np.float32)
    for st,a in parts:s=int(st*sr);buf[s:s+len(a)]+=a
    os.makedirs('vo',exist_ok=True);sf.write(f"vo/{sp['id']}.wav",buf,sr)
    json.dump({'lines':tl,'total':total},open(f"t/{sp['id']}.json",'w'));print(sp['id'],total)
