# cue sheet mirroring index.html T (stick-4overthink)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
cues += [C(1.0 + k * .8, 'pop', -16, pitch=k % 5) for k in range(9)] + [C(5.0, 'fizz', -15), C(8.4, 'uhoh', -10), C(8.4, 'impact_hard', -9), C(9.55, 'impact_soft', -9), C(9.6, 'fizz', -16)]
cues += [C(a, 'notif_ding', -14, pitch=k % 4) for k, a in enumerate([1.4, 2.3, 3.2, 4.1, 5.0, 5.9, 6.8])] + [C(7.6 + k * .14, 'notif_ding', -20, pitch=2 + k % 5) for k in range(12)] + [C(9.0, 'impact_hard', -8), C(9.05, 'uhoh', -11)]
cues += [C(1.0, 'soft_tap', -15)] + [C(a, 'pop', -13) for a in [1.6, 4.0, 6.4, 7.4]] + [C(3.0, 'whoosh_long', -17, pitch=4), C(6.0, 'whoosh_long', -16, pitch=6), C(8.8, 'whoosh_long', -16, pitch=-6), C(9.1, 'file:snore', 0)]
cues += [C(1.0 + k * 1.0 - .1, 'soft_chime', -13, pitch=k % 5) for k in range(1, 12)] + [C(1.0 + k * .5, 'soft_tap', -19) for k in range(22)]
cues += [C(12.2, 'whoosh_short', -12), C(12.3, 'impact_hard', -11), C(12.6, 'chime_up', -11), C(12.7, 'shimmer', -13)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 4)
