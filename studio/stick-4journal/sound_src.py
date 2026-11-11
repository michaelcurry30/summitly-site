# cue sheet mirroring index.html T (stick-4journal)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
cues += [C(1.0 + k * .55, 'file:scribble', -16) for k in range(12)] + [C(1.4 + k * .55, 'whoosh_short', -20, pitch=6) for k in range(12)] + [C(1.1, 'pop', -13)]
cues += [C(7.6, 'fizz', -13), C(7.65, 'pop', -11), C(8.6, 'impact_hard', -7), C(8.65, 'whoosh_long', -11), C(9.6, 'impact_soft', -10), C(9.8, 'file:snore', -2)]
cues += [C(1.0, 'shimmer', -12), C(1.0, 'chime_up', -15), C(2.2, 'ui_tap', -9, pitch=6), C(2.8, 'ui_tap', -9, pitch=6), C(5.0, 'pop', -12), C(7.0, 'pop', -13), C(7.4, 'air', -15), C(9.0, 'whoosh_long', -17, pitch=-6)]
cues += [C(2.0, 'swell', -15), C(3.0, 'file:scribble', -11), C(3.4, 'file:scribble', -12), C(3.3, 'impact_soft', -13)] + [C(a + .2, 'file:scribble', -10) for a in [4.6, 6.0, 7.4]] + [C(a + .9, 'impact_soft', -15) for a in [4.6, 6.0, 7.4]]
cues += [C(5.8, 'pop', -13), C(7.2, 'pop', -13), C(8.8, 'pop', -10), C(8.9, 'impact_hard', -8), C(9.0, 'uhoh', -11)]
for k in range(11): d = 1.0 + k * 1.1; cues += [C(d, 'file:scribble', -17), C(d + .55, 'soft_chime', -12, pitch=k % 5)]
cues += [C(13.3, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 5)
