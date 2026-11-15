# cue sheet mirroring index.html T (stick-4sugar)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# yellow: cold turkey
cues += [C(1.25, 'whoosh_short', -13), C(1.75, 'impact_soft', -9), C(1.9, 'chime_up', -16), C(3.2, 'pop', -12)] + [C(3.8 + k * .6, 'pop', -17, pitch=k % 5) for k in range(6)]
cues += [C(5.0, 'fizz', -15), C(6.4, 'soft_tap', -14), C(8.0, 'uhoh', -12), C(8.8, 'whoosh_long', -11), C(8.85, 'impact_hard', -6), C(9.1, 'file:rustle', -10), C(10.6, 'file:rustle', -12), C(12.4, 'file:rustle', -13)]
# blue: hide it (badly)
cues += [C(1.0, 'whoosh_short', -15), C(1.5, 'impact_soft', -14), C(2.0, 'pop', -14), C(3.0, 'hop', -13), C(3.6, 'hop', -13), C(4.4, 'impact_soft', -11), C(5.6, 'impact_soft', -12, pitch=3), C(6.8, 'impact_soft', -12, pitch=5),
         C(7.6, 'file:creak', -10), C(8.6, 'whoosh_long', -11), C(8.95, 'impact_hard', -6), C(9.0, 'file:clatter', -9), C(9.05, 'uhoh', -11)]
# red: just one
cues += [C(a, 'file:crunch', -11) for a in [1.0, 2.6, 3.8, 4.6, 5.2, 5.7, 6.1]] + [C(1.2, 'pop', -12), C(2.6, 'pop', -12), C(6.6, 'riser', -16, align='end'), C(6.6, 'chime_up', -12), C(7.6, 'fizz', -13),
         C(9.4, 'whoosh_long', -12), C(9.5, 'impact_hard', -6), C(9.55, 'uhoh', -10)]
# purple: swap it
for k in range(7): a = 1.0 + k * 2.0; cues += [C(a, 'soft_tap', -15), C(a + .3, 'ui_tap', -13), C(a + .7, 'pop', -13, pitch=k % 4), C(a + 1.0, 'file:crunch', -15), C(a + 1.6, 'soft_chime', -11, pitch=k % 5)]
cues += [C(13.0, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 6)
