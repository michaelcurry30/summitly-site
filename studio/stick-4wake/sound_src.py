# cue sheet mirroring index.html T (stick-4wake)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = [dict(t=.1, file='sfx/snore.wav', gain=-16)]
for a in [2.0, 4.0, 6.0, 8.0]: cues += [C(a, 'notif_ding', -11, pitch=7), C(a + .15, 'notif_ding', -13, pitch=7), C(a + .4, 'impact_soft', -12), C(a + .55, 'pop', -14, pitch=-2)]
cues += [C(9.5, 'notif_ding', -9, pitch=9), C(9.6, 'uhoh', -10), C(10.0, 'whoosh_short', -11), C(11.0, 'fall', -11), C(11.1, 'impact_hard', -9)]
for k in range(8): cues.append(C(1.6 + k * .8, 'notif_ding', -21, pitch=k % 3))
cues += [C(7.6, 'whoosh_short', -14), C(7.9, 'impact_soft', -9), dict(t=8.6, file='sfx/snore.wav', gain=-14), C(9.4, 'uhoh', -12), C(10.4, 'land', -16), C(11.7, 'land', -16), C(13.0, 'land', -16)]
for k in range(10): cues += [C(1.1 + k * .78, 'pop', -14, pitch=k % 5), C(1.15 + k * .78, 'notif_ding', -18, pitch=4 + k % 3)]
cues += [C(9.0, 'impact_hard', -10), C(9.05, 'uhoh', -11), C(10.6, 'fall', -13), dict(t=11.2, file='sfx/snore.wav', gain=-13), dict(t=12.8, file='sfx/snore.wav', gain=-13)]
cues += [C(1.0, 'whoosh_short', -13), C(1.4, 'soft_tap', -12), C(1.9, 'soft_chime', -14), C(3.2, 'shimmer', -14), C(5.8, 'shimmer', -16), C(8.4, 'shimmer', -16),
         C(9.0, 'notif_ding', -10, pitch=5), C(9.1, 'pop', -10), C(9.6, 'whoosh_short', -11), C(9.6, 'chime_up', -12), C(10.6, 'whoosh_short', -14)]
for k, a in enumerate([11.4, 12.4, 13.4]): cues.append(C(a + .2, 'chime_up', -11, pitch=k * 2))
fp_sound.write(here, cues, 5)
