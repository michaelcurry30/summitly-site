ep=$1; T=$(python3 -c "
import json;T=json.load(open('t/$ep.json'));print(','.join(str(round((l['s']+l['e'])/2,2)) for l in T['lines'])+','+str(round(T['lines'][-1]['e']+1.5,2)))")
node st.mjs "index.html?ep=$ep" $T 2>&1|grep -i err; python3 -c "
from PIL import Image
ts='$T'.split(',');c=Image.new('RGB',(5*216,2*384))
for i,t in enumerate(ts):c.paste(Image.open(f'/tmp/nt_{t}.jpg').resize((216,384)),((i%5)*216,(i//5)*384))
c.save('/tmp/sh_$ep.jpg')"
