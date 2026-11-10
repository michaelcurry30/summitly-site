# cue sheet mirroring index.html T (stick-4save)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = [dict(t=1.0, file='sfx/coin.wav', gain=-9)]
for k in range(9): a = 1.1 + k * .85; cues += [C(a - .35, 'whoosh_short', -19), C(a, 'land', -12, pitch=k % 3)]
cues += [C(8.9, 'ui_tap', -13), C(9.3, 'uhoh', -11), C(9.3, 'whoosh_long', -15), C(9.85, 'whoosh_short', -12), C(10.1, 'impact_hard', -8), C(10.2, 'fall', -12), C(10.4, 'land', -12)]
for k in range(9): a = 1.6 + k * .78; cues += [C(a, 'ui_tap', -16), C(a + .05, 'notif_ding', -20, pitch=k % 3), C(a + .1, 'whoosh_short', -21)] if a + 1 < 8.6 else []
cues += [C(8.6, 'whoosh_short', -14), C(9.2, 'uhoh', -11), C(9.3, 'fizz', -18), C(10.6, 'impact_soft', -13)]
cues += [C(1.0, 'whoosh_long', -17)] + [C(p, 'chime_up', -12, pitch=k * 2) for k, p in enumerate([2.6, 5.0, 7.0])] + [dict(t=p + .1, file='sfx/coin.wav', gain=-16) for p in [2.6, 5.0, 7.0]]
cues += [C(3.4, 'pop', -12), C(9.0, 'uhoh', -9), C(9.0, 'whoosh_long', -11, pitch=-5), C(9.4, 'fall', -11), C(9.45, 'impact_hard', -9)]
for k, a in enumerate([1.0, 2.5, 4.0, 5.5, 7.0, 8.5, 10.0, 11.5, 13.0]): cues += [C(a, 'whoosh_short', -19), dict(t=a + .55, file='sfx/coin.wav', gain=-10), C(a + .6, 'chime_up', -15, pitch=min(k, 7))]
fp_sound.write(here, cues, 4)
