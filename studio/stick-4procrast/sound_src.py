# cue sheet mirroring index.html T (stick-4procrast)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
for k in range(9):                                   # to-do notes fly to the wall
    a = 1.15 + k * .88; cues += [dict(t=a - .5, file='sfx/scribble.wav', gain=-18), C(a, 'pop', -14, pitch=k % 4)]
cues += [C(9.0, 'uhoh', -11), C(9.05, 'whoosh_long', -12), C(9.35, 'impact_hard', -9), C(9.5, 'land', -14), C(10.4, 'impact_soft', -14)]
cues += [C(1.0, 'ui_tap', -15), C(1.3, 'notif_ding', -19)]   # quick break
for k in range(12):
    a = 2.1 + k * .82
    if a + 1 < 9.4: cues.append(C(a, 'notif_ding', -21, pitch=k % 3))
for p in [2.2, 4.6, 7.0]: cues += [C(p, 'pop', -13, pitch=-2), C(p + .9, 'ui_tap', -17)]
cues += [C(9.3, 'notif_ding', -10, pitch=5), C(9.8, 'uhoh', -10), C(9.8, 'impact_soft', -10), C(10.2, 'land', -14)]
for k in range(16): cues.append(C(1.25 + k * .5, 'whoosh_short', -21, pitch=k % 3))   # all at once: papers
for d in [2.4, 5.0, 7.4]: cues += [dict(t=d + .15, file='sfx/gulp.wav', gain=-14), C(d + .65, 'impact_soft', -13)]
cues += [C(9.5, 'fizz', -12), C(10.3, 'fall', -12), C(10.5, 'impact_hard', -10), dict(t=11.0, file='sfx/snore.wav', gain=-12), dict(t=12.6, file='sfx/snore.wav', gain=-12)]
for k, a in enumerate([1.0, 2.6, 4.2, 5.8, 7.4, 9.0, 10.6, 12.2]):  # just 5 min: timer rounds
    cues += [C(a, 'soft_tap', -14), C(a + 1.45, 'chime_up', -12, pitch=min(k, 7))]
cues += [C(13.8, 'whoosh_short', -12)]
fp_sound.write(here, cues, 4)
