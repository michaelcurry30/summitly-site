# cue sheet mirroring index.html T (stick-4backontrack)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
# wait for Monday
cues = [C(1.0 + k * .95, 'soft_tap', -14, pitch=-2) for k in range(8)] + [C(1.4, 'pop', -12), C(3.6, 'ui_tap', -14), C(5.0, 'soft_tap', -17)]
cues += [C(7.0, 'whoosh_long', -16, pitch=-6), C(8.2, 'file:alarm', -15), C(9.0, 'whoosh_short', -12), C(9.4, 'impact_hard', -8), C(9.5, 'pop', -12), C(9.9, 'file:snore', -4)]
# all at once
for k in range(8): a = 1.0 + k * .9; cues += [C(a, 'pop', -13, pitch=k % 5), C(a + .1, 'whoosh_short', -18, pitch=4)]
cues += [C(1.1, 'pop', -12), C(6.4, 'uhoh', -12), C(6.8, 'pop', -12), C(8.6, 'whoosh_long', -12), C(8.9, 'impact_hard', -6)] + [C(8.65 + k * .05, 'impact_soft', -16, pitch=k % 4) for k in range(6)]
# give up
cues += [C(1.0, 'whoosh_short', -16), C(1.8, 'file:crumple', -10), C(2.8, 'whoosh_short', -13), C(3.65, 'impact_soft', -11), C(3.8, 'pop', -12), C(5.0, 'whoosh_long', -15, pitch=-4)]
cues += [C(6.0, 'pop', -14, pitch=-4), C(7.0, 'file:rain', -15), C(8.9, 'file:rain', -15), C(9.6, 'file:zap', -8), C(9.6, 'impact_hard', -8), C(9.7, 'uhoh', -11)]
# a tiny bit today
for k in range(11): d = 1.0 + k * 1.1; cues += [C(d, 'soft_tap', -18), C(d + .8, 'soft_chime', -12, pitch=k % 5), C(d + .8, 'pop', -16, pitch=3)]
cues += [C(1.1, 'pop', -12), C(13.2, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 6)
