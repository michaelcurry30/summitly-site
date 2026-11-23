# sound-effect cue list for art drawing videos: python3 art_sfx.py <id>  -> out/<id>_sfx.json
import json,sys
ep=sys.argv[1];T=json.load(open(f't/{ep}.json'));L=T['lines'];n=len(L);rev=min(5,n-2);act=rev-1
s=lambda i:L[i]['words'][0]['s'] if L[i].get('words') else L[i]['s']
sfx=[[0.05,'pop'],[s(1),'whoosh_short'],[s(2),'air'],[s(2)+.7,'air'],[max(0,s(rev)-2.7),'riser'],[s(rev)+.05,'impact_hard'],[s(rev)+.15,'chime_up'],[s(n-1),'whoosh_short'],[T['dur']+.4,'pop']]
json.dump({'dur':T['dur']+2.6,'sfx':sfx},open(f'out/{ep}_sfx.json','w'));print(sfx)
