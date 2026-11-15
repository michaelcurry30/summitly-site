cd /home/claude/summitly-site/studio/satisfy
python3 sim.py r1 0.3 40 150 2>&1 | tail -1
python3 sim.py r2 1.0 15 150 2>&1 | tail -1
python3 sim.py r3 3.0 6 150 2>&1 | tail -1
python3 sim.py r4 8.0 2 165 2>&1 | tail -1
echo SIMDONE
