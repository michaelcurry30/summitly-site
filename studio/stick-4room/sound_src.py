# cue sheet mirroring index.html T (stick-4room)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
cues += [C(a, 'whoosh_short', -13, pitch=k) for k, a in enumerate([1.0, 2.2, 3.2, 4.4, 5.4, 6.6])] + [C(1.0 + k * .45, 'soft_tap', -19, pitch=k % 4) for k in range(16)] + [C(1.2, 'pop', -12), C(7.8, 'fizz', -15), C(8.8, 'impact_hard', -7), C(8.85, 'uhoh', -11)]
cues += [C(a + .15, 'whoosh_short', -16, pitch=3) for a in [1.0, 1.9, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3]] + [C(a + .55, 'impact_soft', -12, pitch=k % 3) for k, a in enumerate([1.0, 1.9, 2.8, 3.7, 4.6, 5.5, 6.4, 7.3])]
cues += [C(7.3, 'pop', -12), C(8.0, 'uhoh', -12), C(8.6, 'impact_hard', -6), C(8.62, 'whoosh_long', -11)]
cues += [C(1.0 + k * .6 + .4, 'soft_tap', -17, pitch=-(k % 3)) for k in range(14)] + [C(2.0, 'pop', -13), C(5.2, 'pop', -13), C(9.2, 'pop', -10), C(9.25, 'uhoh', -10)]
for k in range(11): d = 1.0 + k * 1.15; cues += [C(d + .45, 'whoosh_short', -19, pitch=5), C(d + .8, 'soft_tap', -13, pitch=3), C(d + .85, 'soft_chime', -12, pitch=k % 5)]
cues += [C(9.0, 'shimmer', -13)]
fp_sound.write(here, cues, 5)
