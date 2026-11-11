# cue sheet mirroring index.html T (stick-4hustle)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = [C(1.0, 'whoosh_short', -11), C(1.05, 'pop', -12), C(1.8, 'chime_up', -12), C(2.8, 'pop', -13)]
cues += [C(3.4 + k * .45, 'file:coin', -14) for k in range(10)] + [C(7.8, 'uhoh', -10), C(8.6, 'impact_soft', -10), C(9.4, 'whoosh_short', -12), C(9.6, 'impact_hard', -7), C(9.65, 'pop', -10)]
cues += [C(1.0 + k * .6, 'file:scribble', -17) for k in range(13)] + [C(1.4 + k * .6, 'soft_tap', -17, pitch=3) for k in range(13)] + [C(4.0, 'pop', -13), C(7.0, 'pop', -13), C(4.2, 'fizz', -17), C(9.2, 'whoosh_long', -17, pitch=-6), C(9.6, 'file:snore', -2)]
for k in range(7): a = 1.0 + k * 1.1; cues += [C(a, 'pop', -12, pitch=k % 5), C(a + .65, 'whoosh_short', -16, pitch=4), C(a + .9, 'impact_soft', -15)]
cues += [C(4.3, 'pop', -12), C(8.8, 'whoosh_long', -11), C(8.9, 'impact_hard', -6), C(8.95, 'uhoh', -10)]
for k in range(10): c = 1.0 + k * 1.2; cues += [C(c, 'soft_tap', -18), C(c + .7, 'pop', -15, pitch=3), C(c + .85, 'file:coin', -12), C(c + .8, 'soft_chime', -13, pitch=k % 5)]
cues += [C(13.0, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 6)
