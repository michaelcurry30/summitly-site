# Build Metricool payloads. Usage: python3 posts.py  (edit SLOTS / IDS per run)
import json,re
from videos import V
CTA_LINE="📒 Track every rep with my Fit & Strong workout tracker → link in bio"
FIRST="📒 Log every workout with the Fit & Strong Tracker (digital, instant download): changinghabits4good.gumroad.com/l/aiffzx"
SLOTS=[('2026-11-20','21:00')]+[(d,h) for d in ['2026-11-21','2026-11-22','2026-11-23','2026-11-24'] for h in ['09:00','12:15','15:30','21:00']]+[('2026-11-25','09:00'),('2026-11-25','12:15')]
IDS=[f'ra{n}' for n in range(13,32)]
byid={v['id'].split('-')[0]:v for v in V}
out=[]
for i,(d,h) in zip(IDS,SLOTS):
    v=byid[i]
    L=[re.sub(r'\*','',l) for l in v['lines']]
    cues='\n'.join(f'{k}. {c}' for k,c in enumerate(L[1:-1],1))
    tags=' '.join('#'+t for t in v['tags']+['fitness','workout','gymtips','exerciseform'])
    text=f"{L[0]} 💪\n\n{cues}\n\nSave this for your next workout and follow for a new exercise every day.\n{CTA_LINE}\n\n{tags}"
    info={"autoPublish":True,"draft":False,"descendants":[],"firstCommentText":FIRST,"hasNotReadNotes":False,
      "media":[f"https://raw.githubusercontent.com/michaelcurry30/summitly-site/main/media/repatlas/{v['id']}.mp4"],
      "mediaAltText":[],"providers":[{"network":"instagram"},{"network":"youtube"}],
      "publicationDate":{"dateTime":f"{d}T{h}:00","timezone":"America/Chicago"},"shortener":False,"smartLinkData":{"ids":[]},
      "text":text,"instagramData":{"type":"REEL","showReelOnFeed":True,"autoPublish":True,"isAiGenerated":False},
      "youtubeData":{"title":(v['title']+' #shorts')[:100],"type":"short","privacy":"public","tags":v['tags']+['fitness','workout','exercise form'],"category":"HOWTO_STYLE","madeForKids":False,"isAiGeneratedContent":False}}
    out.append({'id':v['id'],'date':f"{d}T{h}:00-06:00",'info':json.dumps(info,ensure_ascii=False)})
json.dump(out,open('/home/claude/m3d/posts.json','w'),ensure_ascii=False)
for o in out: print(o['date'],o['id'])
