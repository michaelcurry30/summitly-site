#!/bin/bash
# finish_short.sh <name> — mk_short (VO timing + gen) → render → check_overlap → mix → media/<name>.mp4
cd "$(dirname "$0")"; . ./env.sh; n=$1
python3 mk_short.py $n > /tmp/mk_$n.log 2>&1 || { echo "$n MK FAIL"; tail -3 /tmp/mk_$n.log; exit 1; }
node render.mjs $n > /tmp/r_$n.log 2>&1 || { echo "$n RENDER FAIL"; tail -2 /tmp/r_$n.log; exit 1; }
node kit/check_overlap.mjs $n --step 0.1 > /tmp/c_$n.log 2>&1 || { echo "$n OVERLAP FAIL"; grep -E "^[0-9]" /tmp/c_$n.log | head -5; exit 1; }
python3 kit/sound/mix.py $n > /tmp/m_$n.log 2>&1 || { echo "$n MIX FAIL"; tail -3 /tmp/m_$n.log; exit 1; }
grep -q "^OK" /tmp/m_$n.log || { echo "$n QC FAIL"; grep QC /tmp/m_$n.log; exit 1; }
cp out/$n-sound.mp4 ../media/$n.mp4; echo "$n DONE $(grep 'VO end' /tmp/mk_$n.log) $(grep QC /tmp/m_$n.log | tr '\n' ' ')"
