# cue sheet mirroring index.html T (stick-4badday)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = [C(.05, 'whoosh_long', -18, pitch=-4)]
for k in range(10): cues.append(C(1.4 + k * .8, 'notif_ding', -21, pitch=-(k % 3)))
cues += [C(3.0, 'whoosh_long', -18, pitch=-5), C(6.0, 'whoosh_long', -17, pitch=-6), C(9.0, 'impact_hard', -10), C(9.05, 'uhoh', -11), C(9.2, 'whoosh_long', -13, pitch=-7)]
for k in range(9): a = 1.1 + k * .9; cues += [C(a + .2, 'pop', -15, pitch=-k % 4), C(a + .35, 'soft_tap', -16)]
cues += [C(9.4, 'uhoh', -10), C(9.5, 'fizz', -13), C(10.2, 'fizz', -16)]
cues += [C(1.0, 'ui_tap', -15)] + [C(1.2 + k * .4, 'ui_tap', -20) for k in range(18)]
for a in [2.8, 5.2, 7.4]: cues += [C(a + .14, 'impact_hard', -10), C(a + .2, 'pop', -13, pitch=3)]
for k in range(14): cues.append(C(7.9 + k * .35, 'notif_ding', -19, pitch=2 + k % 4))
cues += [C(8.4, 'uhoh', -12), C(9.8, 'whoosh_short', -13), C(9.95, 'impact_soft', -9)]
for k in range(10): cues.append(C(1.0 + k * .45, 'soft_tap', -20))
cues += [C(3.0, 'swell', -14), C(6.5, 'chime_up', -10), C(6.6, 'shimmer', -12)] + [C(8 + k * .4, 'pop', -16, pitch=4 + k) for k in range(6)] + [C(10.0, 'whoosh_short', -13), C(12.4, 'whoosh_short', -15), C(13.8, 'soft_chime', -12)]
fp_sound.write(here, cues, 6)
