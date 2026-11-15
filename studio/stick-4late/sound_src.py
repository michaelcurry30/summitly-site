# cue sheet mirroring index.html T (stick-4late)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# run faster: alarm, run, jumps over cones, faster, trip, wreck
cues += [C(1.0, 'file:alarm', -12), C(1.0, 'uhoh', -16), C(1.8, 'whoosh_short', -12)]
for a in (3.4, 4.9, 6.4): cues += [C(a, 'hop', -12), C(a + .5, 'land', -14)]
cues += [C(7.4, 'whoosh_long', -14), C(7.45, 'pop', -14), C(8.6, 'uhoh', -10), C(8.7, 'whoosh_short', -12), C(9.0, 'impact_hard', -6)]
# 5 more minutes: phone flicks, bubbles, clock alarm, panic
for k in range(6): cues += [C(1.3 + k * 1.1, 'soft_tap', -17, pitch=2)]
cues += [C(1.6, 'pop', -12), C(4.9, 'pop', -12), C(7.8, 'whoosh_short', -15), C(8.6, 'file:alarm', -10), C(8.7, 'uhoh', -10), C(8.9, 'pop', -12)]
# hunt for keys: rustle + toss per item, where, avalanche, oh
for k in range(9): a = 1.0 + k * .8; cues += [C(a + .05, 'file:rustle', -15), C(a + .35, 'whoosh_short', -18, pitch=4), C(a + .9, 'impact_soft', -19)]
cues += [C(4.2, 'pop', -12), C(8.6, 'whoosh_long', -12), C(8.8, 'impact_hard', -6), C(10.2, 'soft_chime', -12, pitch=5), C(10.25, 'pop', -13)]
# prep the night before: place + chime per item, sleep, morning, grab, walk, early
for k in range(4): a = 1.0 + k * 1.1; cues += [C(a + .3, 'pop', -14, pitch=k), C(a + .65, 'soft_chime', -12, pitch=k)]
cues += [C(5.6, 'file:snore', -8), C(6.4, 'chime_up', -12), C(7.2, 'whoosh_short', -13), C(7.5, 'file:coin', -14), C(9.2, 'soft_chime', -10), C(9.25, 'pop', -12)]
for k in range(4): cues += [C(10.6 + k * 1.1, 'soft_chime', -14, pitch=k)]
for k in range(8): cues += [C(8.0 + k * .8, 'soft_tap', -21)]
cues += [C(13.3, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 4)
