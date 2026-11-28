# Sound cues for a generic Bible short: python3 bible_sfx.py <id>  -> out/<id>_sfx.json
import json,sys
i=sys.argv[1];S=json.load(open(f'{i}.json'));T=json.load(open(f't/{i}.json'))
L=T['lines'];n=len(L);sfx=[[0.05,'pop']]
for k in range(1,n):
    s=L[k]['s'];J=(S['lines'][k] if k<len(S['lines']) else {});sc=J.get('scene','');fx=J.get('fx',[]);poses=[c.get('pose') for c in J.get('cast',[])]
    if k==n-1: sfx.append([s,'swell']);continue
    sfx.append([s-.12,'whoosh_short' if k%2 else 'whoosh_long'])
    if sc=='storm' or 'lightning' in fx: sfx.append([s,'STORM']);sfx.append([s+.2,'impact_hard'])
    if 'rays' in fx or 'glow' in fx or sc=='heaven': sfx.append([s+.15,'shimmer'])
    if 'scared' in poses: sfx.append([s+.1,'uhoh'])
    if 'lie' in poses: sfx.append([s+.4,'impact_hard'])
    if 'cheer' in poses or 'raise' in poses: sfx.append([s+.3,'chime_up'])
sfx.append([L[-1]['e']+.5,'soft_chime'])
json.dump({'dur':T['dur']+3,'sfx':sfx},open(f'out/{i}_sfx.json','w'));print(len(sfx),'cues')
