# refine word times of t/<ep>.json using pocketsphinx forced alignment on the clean narration
import json,sys,re,numpy as np,soundfile as sf
from pocketsphinx import Decoder
ep=sys.argv[1];T=json.load(open(f't/{ep}.json'));a,sr=sf.read(f'out/{ep}_vo.wav')
SUB={'dre':'dray','kev':'kevin','630':'six thirty','20000':'twenty thousand',"that's":'that is',"marcus":'markus','':'and','21':'twenty one','66':'sixty six','18':'eighteen','200':'two hundred','1':'one','3':'three',"here's":'here is',"didn't":'did not',"isn't":'is not','soreness':'sore ness','dre’s':'drays',"dre's":'drays','7':'seven','10':'ten','94':'ninety four','40':'forty','61':'sixty one','14':'fourteen','80':'eighty','am':'a m','ifthen':'if then','followthrough':'follow through','slipups':'slip ups',"don't":'do not',"they'd":'they had','2011':'twenty eleven','33':'thirty three','55':'fifty five','30':'thirty','1994':'nineteen ninety four','30%':'thirty percent','34':'thirty four'}
ok=0
for L in T['lines']:
    s,e=int((L['s']-.05)*sr),int((L['e']+.1)*sr);seg=a[s:e]
    seg16=np.interp(np.arange(int(len(seg)*16000/sr))*sr/16000,np.arange(len(seg)),seg)
    raw=(np.clip(seg16,-1,1)*32767).astype('<i2').tobytes()
    words=[re.sub(r"[^a-z0-9']","",w['w'].lower()) for w in L['words']]
    toks=[];idx=[]
    for i,w in enumerate(words):
        for p in SUB.get(w,w).split(): toks.append(p);idx.append(i)
    try:
        d=Decoder();d.set_align_text(' '.join(toks));d.start_utt();d.process_raw(raw,full_utt=True);d.end_utt();d.set_alignment();d.start_utt();d.process_raw(raw,full_utt=True);d.end_utt()
        al=[x for x in d.get_alignment() if x.name not in('<sil>','<s>','</s>','(NULL)')]
        if len(al)!=len(toks):raise Exception('len')
        first={}
        for k,x in zip(idx,al):
            st=L['s']-.05+x.start/100;en=st+x.duration/100
            if k not in first:first[k]=[st,en]
            else:first[k][1]=en
        for k,w in enumerate(L['words']):w['s'],w['e']=round(first[k][0],3),round(first[k][1],3)
        ok+=1
    except Exception as ex: print('fallback',L['words'][0]['w'],ex)
json.dump(T,open(f't/{ep}.json','w'));print('aligned',ok,'/',len(T['lines']))
