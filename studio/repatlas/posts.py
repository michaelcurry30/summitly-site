import json,re
from videos import V
slots=[(d,h) for d in ['2026-11-14','2026-11-15','2026-11-16','2026-11-17'] for h in ['09:00:00','15:30:00','21:00:00']]
out=[]
for v,(d,h) in zip(V,slots):
    L=[re.sub(r'\*','',l) for l in v['lines']]
    cues='\n'.join(f'{i}. {c}' for i,c in enumerate(L[1:-1],1))
    tags=' '.join('#'+t for t in v['tags']+['fitness','workout','gymtips','exerciseform'])
    text=f"{L[0]} 💪\n\n{cues}\n\nSave this for your next workout and follow for a new exercise every day.\n\n{tags}"
    info={"autoPublish":True,"draft":False,"descendants":[],"firstCommentText":"","hasNotReadNotes":False,
      "media":[f"https://raw.githubusercontent.com/michaelcurry30/summitly-site/main/media/repatlas/{v['id']}.mp4"],
      "mediaAltText":[],"providers":[{"network":"instagram"},{"network":"youtube"}],
      "publicationDate":{"dateTime":f"{d}T{h}","timezone":"America/Chicago"},"shortener":False,"smartLinkData":{"ids":[]},
      "text":text,"instagramData":{"type":"REEL","showReelOnFeed":True,"isAiGenerated":False},
      "youtubeData":{"title":(v['title']+' #shorts')[:100],"type":"short","privacy":"public","tags":v['tags']+['fitness','workout','exercise form'],"category":"HOWTO_STYLE","madeForKids":False,"isAiGeneratedContent":False}}
    out.append({'date':f"{d}T{h}-06:00",'info':json.dumps(info,ensure_ascii=False)})
json.dump(out,open('posts.json','w'),ensure_ascii=False)
print(out[0]['info'])
