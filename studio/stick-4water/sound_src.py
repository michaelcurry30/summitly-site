# cue sheet mirroring index.html T (stick-4water)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
for k, a in enumerate([1.0, 2.8, 4.6, 6.4]):
    for j in range(4): cues.append(dict(t=a + .35 + j * .22, file='sfx/gulp.wav', gain=-12 + k))
    cues.append(C(a + 1.4, 'pop', -14, pitch=-3 - k))
cues += [C(8.4, 'uhoh', -10), C(9.3, 'fall', -11), C(9.4, 'impact_hard', -8), C(9.5, 'fizz', -14)]
cues += [C(1.0, 'ui_tap', -17), C(3.4, 'ui_tap', -17), C(5.0, 'whoosh_long', -18), C(6.0, 'pop', -13), C(7.0, 'uhoh', -15), C(9.0, 'fall', -14), C(9.3, 'impact_soft', -10), C(9.6, 'whoosh_long', -14), C(12.6, 'whoosh_long', -16)]
for k in range(8): a = 1.0 + k * 1.05; cues += [C(a + .15, 'fizz', -16), dict(t=a + .3, file='sfx/gulp.wav', gain=-15), C(a + .6, 'impact_soft', -14), C(a + .95, 'land', -15, pitch=k % 3)]
cues += [C(9.6, 'uhoh', -11), C(9.8, 'impact_soft', -10), dict(t=10.4, file='sfx/snore.wav', gain=-13), dict(t=12.0, file='sfx/snore.wav', gain=-13)]
for k in range(10): a = 1.0 + k * 1.3; cues += [dict(t=a + .7, file='sfx/gulp.wav', gain=-17), C(a + .9, 'chime_up', -12, pitch=min(k, 8))]
cues += [C(7.4, 'shimmer', -12)]
fp_sound.write(here, cues, 3)
