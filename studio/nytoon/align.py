# refine word times of t/<ep>.json using pocketsphinx forced alignment on the clean narration
import json,sys,re,numpy as np,soundfile as sf
from pocketsphinx import Decoder
ep=sys.argv[1];T=json.load(open(f't/{ep}.json'));a,sr=sf.read(f'out/{ep}_vo.wav')
SUB={'2250':'two thousand two hundred fifty','47':'forty seven','uc':'u c','uk':'u k',"brain's":'brains',"people's":'peoples',"doesn't":'does not','selfkindness':'self kindness','08':'zero point eight','pm':'p m','68':'sixty eight','instigation':'instigation','290':'two hundred ninety','89':'eighty nine','500':'five hundred','120':'one hundred twenty','nih':'n i h','ultraprocessed':'ultra processed','check-in':'check in',"12000":"twelve thousand","238":"two hundred thirty eight","43":"forty three","23":"twenty three","205":"two hundred five","phonefree":"phone free","noscroll":"no scroll","selfcontrol":"self control","weren't":"were not","won't":"will not","you're":"you are","jay's":"jays",'69':'sixty nine','1700':'seventeen hundred','22':'twenty two','800':'eight hundred',"can't":'can not','phonefree':'phone free','dre':'dray','kev':'kevin','630':'six thirty','20000':'twenty thousand',"that's":'that is',"marcus":'markus','':'and','21':'twenty one','66':'sixty six','18':'eighteen','200':'two hundred','1':'one','3':'three',"here's":'here is',"didn't":'did not',"isn't":'is not','soreness':'sore ness','dre’s':'drays',"dre's":'drays','7':'seven','10':'ten','94':'ninety four','40':'forty','61':'sixty one','14':'fourteen','80':'eighty','am':'a m','ifthen':'if then','followthrough':'follow through','slipups':'slip ups',"don't":'do not',"they'd":'they had','2011':'twenty eleven','33':'thirty three','55':'fifty five','30':'thirty','1994':'nineteen ninety four','30%':'thirty percent','34':'thirty four',"5":"five","1800":"eighteen hundred","170000":"one hundred seventy thousand","55000":"fifty five thousand","86":"eighty six","219":"two hundred nineteen","133":"one hundred thirty three","1600":"sixteen hundred","2022":"twenty twenty two","3650":"three thousand six hundred fifty","300":"three hundred","12":"twelve","15":"fifteen","rio's":"rios","autopay":"auto pay","7%":"seven percent","51":"fifty one","4":"four","6":"six","100":"one hundred","dre":"dray","favourite":"favorite","audiobook":"audio book","audiobooks":"audio books","afterwards":"afterward","36":"thirty six",'57':'fifty seven','9':'nine','2018':'twenty eighteen','19':'nineteen','8':'eight','2':'two','halffull':'half full','todo':'to do','headstart':'head start',"tomorrow's":'tomorrows',"i'll":'i will',"it's":'it is'}
SUB.update({'138':'one hundred thirty eight','317':'three hundred seventeen','microbreaks':'micro breaks','5minute':'five minute','7day':'seven day','faraway':'far away',"aren't":'are not',"today's":'todays'})
SUB.update({'180':'one hundred eighty','2014':'twenty fourteen','124':'one hundred twenty four','1997':'nineteen ninety seven','usc':'u s c','checkins':'check ins','phonedown':'phone down','weekold':'week old','3timesaday':'three times a day','moviegoers':'movie goers'})
SUB.update({'1378':'one thousand three hundred seventy eight dollars','91':'ninety one','35':'thirty five','38':'thirty eight','125':'one hundred twenty five dollars','1500':'fifteen hundred dollars','400':'four hundred dollar','63':'sixty three','1040':'one thousand forty dollars','usda':'u s d a',"you've":'you have',"you'd":'you would',"they'd":'they would',"week's":'weeks',"what's":'what is',"america's":'americas',"it's":'it is','overplanning':'over planning'})
SUB.update({"he'll":'he will',"you'll":'you will','myopia':'myopia','fifty':'fifty'})
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
