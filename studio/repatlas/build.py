import json,sys,os,re,subprocess,numpy as np,soundfile as sf
from videos import V
from kokoro_onnx import Kokoro
S='/home/claude/summitly-site/studio/tts/'
k=Kokoro(S+'kokoro.onnx',S+'voices.bin')
VOICE=os.environ.get('VOICE','am_michael')
os.makedirs('out',exist_ok=True)
def vo(text):
    t=text.replace('*','')
    a,sr=k.create(t,voice=VOICE,speed=1.05,lang='en-us')
    idx=np.where(np.abs(a)>0.01)[0];return a[max(0,idx[0]-400):idx[-1]+1500],sr
for v in V:
    if len(sys.argv)>1 and v['id'] not in sys.argv[1:]: continue
    d=f"work/{v['id']}";os.makedirs(d,exist_ok=True)
    if os.path.exists(f"out/{v['id']}.mp4"): continue
    t=0.35;caps=[];parts=[]
    for i,l in enumerate(v['lines']):
        a,sr=vo(l);dur=len(a)/sr;parts.append((t,a))
        caps.append([round(t,2),round(t+dur+0.3,2),re.sub(r'\*(.+?)\*',r'<b>\1</b>',l)]);t+=dur+(0.45 if i==0 else 0.3)
    total=t+0.7
    tl={'caps':caps,'tag':[caps[-1][0],total+1,'NEW EXERCISE EVERY DAY']}
    json.dump(tl,open(f'{d}/tl.json','w'))
    buf=np.zeros(int((total+0.5)*sr),dtype=np.float32)
    for st,a in parts: s=int(st*sr);buf[s:s+len(a)]+=a
    sf.write(f'{d}/vo.wav',buf,sr)
    n=int(total*30)
    subprocess.run(['node','/home/claude/m3d/rend2.js',v['ex'],f'{d}/tl.json',str(n),f'{d}/fr'],check=True)
    tmp=f"out/{v['id']}.tmp.mp4"
    subprocess.run(['ffmpeg','-y','-loglevel','error','-framerate','30','-i',f'{d}/fr/%04d.jpg','-i',f'{d}/vo.wav','-stream_loop','-1','-i','music.wav',
      '-filter_complex',f"[2:a]volume=0.16,afade=t=out:st={total-1.2}:d=1.2[m];[1:a]aresample=44100,pan=stereo|c0=c0|c1=c0[v];[v][m]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-14:TP=-1.5[a]",
      '-map','0:v','-map','[a]','-t',str(total),'-c:v','libx264','-preset','veryfast','-crf','20','-pix_fmt','yuv420p','-c:a','aac','-b:a','160k','-movflags','+faststart',tmp],check=True)
    os.rename(tmp,f"out/{v['id']}.mp4");print('done',v['id'],round(total,1),flush=True)
