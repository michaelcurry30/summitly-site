# cue sheet mirroring index.html T (stick-4impulse)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = [C(.05, 'shimmer', -18)]
cues += [C(a, 'soft_tap', -14, pitch=k % 3) for k, a in enumerate([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 6.6])] + [C(1.0, 'pop', -13), C(4.0, 'pop', -13), C(7.2, 'pop', -12), C(7.4, 'shing', -13), C(7.9, 'chime_up', -12)]
cues += [C(8.8, 'whoosh_short', -12), C(8.9, 'uhoh', -9), C(8.95, 'pop', -9), C(9.3, 'fizz', -15)]
cues += [C(a, 'ui_tap', -12, pitch=4) for a in [1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0]] + [C(a + .3, 'impact_soft', -14, pitch=k % 3) for k, a in enumerate([1.0, 2.0, 3.0, 4.0, 5.0, 6.0, 7.0, 8.0])] + [C(a + .05, 'chime_up', -20) for a in [1.0, 3.0, 5.0, 7.0]]
cues += [C(4.0, 'swell', -16), C(9.0, 'whoosh_long', -11), C(9.2, 'impact_hard', -7)]
cues += [C(1.0 + k * .8 + .4, 'impact_soft', -15, pitch=k % 4) for k in range(9)] + [C(1.0 + k * .8, 'whoosh_short', -19, pitch=5) for k in range(9)] + [C(2.0, 'pop', -13), C(5.0, 'pop', -13), C(8.0, 'chime_up', -10), C(8.8, 'uhoh', -10), C(9.1, 'impact_hard', -6)]
for k in range(9): c = 1.0 + k * 1.2; cues += [C(c, 'pop', -16, pitch=4), C(c + .6, 'air', -16), C(c + 1.0, 'shing', -15, pitch=k % 4), C(c + .8, 'soft_chime', -13, pitch=k % 5)]
fp_sound.write(here, cues, 6)
