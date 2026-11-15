# cue sheet mirroring index.html T (stick-4mealprep)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
# fancy recipes
cues = [C(1.0 + k * .6 + .5, 'impact_soft', -17, pitch=k % 5) for k in range(10)] + [C(1.0 + k * .6, 'whoosh_short', -19, pitch=5) for k in range(10)]
cues += [C(1.1, 'pop', -12), C(2.6, 'pop', -14, pitch=-3), C(4.2, 'pop', -14, pitch=-3), C(5.0, 'file:sizzle', -16), C(5.2, 'pop', -12), C(7.0, 'file:sizzle', -12), C(7.4, 'uhoh', -12)]
cues += [C(8.8, 'impact_hard', -5), C(8.8, 'file:zap', -14), C(9.0, 'whoosh_long', -14, pitch=-5)]
# whole month
cues += [C(1.0 + k * .28 + .15, 'soft_tap', -16, pitch=k % 6) for k in range(18)] + [C(6.2, 'chime_up', -14), C(6.2, 'pop', -12), C(6.8, 'fizz', -14, pitch=-6), C(7.2, 'whoosh_long', -18, pitch=8)]
cues += [C(8.3, 'pop', -12), C(8.3, 'uhoh', -11), C(9.0, 'whoosh_short', -12), C(9.35, 'impact_hard', -8)]
# wing it
for a in (1.0, 3.6, 6.2): cues += [C(a + .1, 'whoosh_short', -16, pitch=-3), C(a + .5, 'pop', -13, pitch=-5), C(a + 1.4, 'impact_soft', -15)]
cues += [C(1.5, 'pop', -12), C(2.5, 'whoosh_long', -14, pitch=-12), C(5.0, 'pop', -12), C(5.1, 'whoosh_long', -14, pitch=-12), C(8.0, 'air', -14), C(9.2, 'whoosh_short', -12), C(9.55, 'impact_hard', -8), C(9.6, 'uhoh', -11)]
# a few simple meals
cues += [C(1.0, 'file:sizzle', -18), C(1.2, 'pop', -12)] + [C(1.0 + k * .45, 'pop', -15, pitch=k % 5) for k in range(8)] + [C(1.4 + k * .45, 'soft_tap', -17) for k in range(8)]
for k in range(7): d = 5.0 + k * 1.1; cues += [C(d + .2, 'soft_tap', -16), C(d + .5, 'soft_chime', -12, pitch=k % 5), C(d + .5, 'pop', -16, pitch=3)]
cues += [C(12.8, 'file:sizzle', -18), C(13.0, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 5)
