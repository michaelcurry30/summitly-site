# cue sheet mirroring index.html T (stick-4bedtime)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# yellow: one more episode
for k in range(5): a = 1.0 + k * 1.4; cues += [C(a, 'ui_tap', -11), C(a + .05, 'whoosh_short', -18, pitch=5), C(a + .1, 'file:crunch', -16)]
cues += [C(3.7, 'pop', -11), C(6.5, 'pop', -11), C(7.0, 'soft_tap', -16), C(9.0, 'whoosh_short', -12), C(9.45, 'impact_hard', -7), C(9.5, 'uhoh', -10), C(10.2, 'file:snore', -5), C(12.8, 'file:snore', -6)]
# blue: try hard to sleep (sheep)
cues += [C(1.2 + k * .75, 'file:baa', -14, pitch=k % 3) for k in range(10)] + [C(1.2 + k * .75 + .7, 'impact_soft', -19) for k in range(10)]
cues += [C(3.4, 'whoosh_short', -16), C(5.2, 'pop', -11), C(7.8, 'whoosh_short', -16), C(8.9, 'file:alarm', -11), C(8.9, 'impact_hard', -8), C(9.0, 'uhoh', -10)]
# red: gaming till late
cues += [C(1.0 + k * .5, 'file:blip', -18, pitch=k % 4) for k in range(15)] + [C(3.2, 'pop', -11), C(3.25, 'chime_up', -16), C(6.0, 'pop', -11), C(6.05, 'chime_up', -16),
         C(8.6, 'file:lose', -9), C(9.05, 'impact_hard', -6), C(9.1, 'whoosh_short', -13), C(9.55, 'impact_soft', -10), C(9.8, 'uhoh', -11)]
# purple: phone off + same wind-down
cues += [C(1.2, 'whoosh_short', -15), C(1.6, 'ui_tap', -11), C(1.65, 'pop', -12), C(2.0, 'file:brush', -12), C(2.95, 'soft_chime', -12), C(3.4, 'impact_soft', -16), C(3.5, 'file:page', -13),
         C(4.8, 'soft_chime', -12, pitch=2), C(5.0, 'ui_tap', -12), C(5.05, 'swell', -18)]
cues += [C(6.0 + k + .3, 'soft_chime', -12, pitch=k % 5) for k in range(7)] + [C(13.4, 'shimmer', -12), C(14.2, 'pop', -12), C(14.85, 'whoosh_short', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 7)
