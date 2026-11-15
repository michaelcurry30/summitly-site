# cue sheet mirroring index.html T (stick-4budget)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
# cut everything
cues = [C(1.1, 'whoosh_short', -12), C(1.15, 'pop', -12), C(2.1, 'whoosh_short', -12), C(3.0, 'ui_tap', -10), C(3.05, 'whoosh_long', -17, pitch=-8), C(4.0, 'soft_tap', -15)]
cues += [C(5.2, 'fizz', -17, pitch=-5), C(6.5, 'shimmer', -15), C(6.8, 'pop', -13), C(8.6, 'impact_hard', -5), C(8.6, 'pop', -9), C(8.65, 'file:kaching', -10)]
cues += [C(8.7 + k * .18 + .3, 'impact_soft', -16, pitch=k % 6) for k in range(12)] + [C(10.4, 'whoosh_short', -13), C(10.6, 'uhoh', -12)]
# ignore the balance
for j in range(4): a = 1.0 + j * 1.0; cues += [C(a + .1, 'notif_ding', -15, pitch=4), C(a + .3, 'pop', -14, pitch=j)]
cues += [C(2.6 + k * .7 + .35, 'soft_tap', -15, pitch=-2) for k in range(7)] + [C(4.6, 'pop', -12), C(7.4, 'file:crumple', -13), C(8.1, 'impact_hard', -6), C(8.15, 'uhoh', -10)]
cues += [C(9.0, 'whoosh_short', -12), C(9.35, 'impact_hard', -9)]
# giant spreadsheet
cues += [C(1.0 + k * .5, 'ui_tap', -19, pitch=k % 5) for k in range(12)] + [C(1.6 + k * .6 + .35, 'file:coin', -18) for k in range(12)]
cues += [C(5.0, 'pop', -12), C(7.0, 'whoosh_long', -17, pitch=-7), C(8.8, 'impact_soft', -11), C(9.1, 'file:snore', -4)]
# give each dollar a job
cues += [C(1.1, 'pop', -12), C(1.0, 'chime_up', -16)] + [C(1.4 + k * .35 + .35, 'file:coin', -14) for k in range(12)]
for d in range(7): a = 6.0 + d * 1.1; cues += [C(a + .3, 'file:coin', -15), C(a + .6, 'soft_chime', -12, pitch=d % 5), C(a + .6, 'pop', -16, pitch=3)]
cues += [C(13.2, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 5)
