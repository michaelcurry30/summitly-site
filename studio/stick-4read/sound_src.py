# cue sheet mirroring index.html T (stick-4read)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
for k in range(26): cues.append(C(1.0 + k * .3, 'whoosh_short', -22, pitch=k % 4))   # speed reading pages
cues += [C(9.0, 'uhoh', -11), C(9.1, 'shimmer', -14), C(9.7, 'fall', -11), C(9.8, 'impact_hard', -9)]
for k in range(10): cues.append(C(1.5 + k * .8, 'notif_ding', -21, pitch=k % 3))      # couch
cues += [C(2.6, 'pop', -12), C(5.8, 'pop', -12), C(7.4, 'whoosh_short', -14), C(7.6, 'uhoh', -14), dict(t=9.8, file='sfx/snore.wav', gain=-13), dict(t=11.4, file='sfx/snore.wav', gain=-13), dict(t=13.0, file='sfx/snore.wav', gain=-14)]
cues += [C(1.0, 'whoosh_short', -14), C(1.4, 'land', -16), C(2.0, 'land', -16), C(3.1, 'impact_hard', -8), C(3.6, 'whoosh_long', -15), dict(t=6.0, file='sfx/snore.wav', gain=-15),
         C(8.2, 'ui_tap', -14), C(9.1, 'whoosh_short', -12), C(9.25, 'impact_hard', -7), C(9.3, 'uhoh', -12)]
for k in range(10): a = 1.0 + k * 1.3; cues += [C(a, 'soft_tap', -16), C(a + .9, 'chime_up', -12, pitch=min(k, 8))]
fp_sound.write(here, cues, 4)
