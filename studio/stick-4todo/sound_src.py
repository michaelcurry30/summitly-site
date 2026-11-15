# cue sheet mirroring index.html T (stick-4todo)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# easy stuff: polish squeak + tiny chime per easy task, smoke, fire, boom
for k in range(8): a = 1.0 + k * .95; cues += [C(a + .1, 'soft_tap', -17, pitch=4), C(a + .6, 'pop', -15, pitch=k % 5)]
cues += [C(2.6, 'pop', -13), C(3.0, 'fizz', -16), C(5.5, 'file:sizzle', -16), C(7.2, 'file:sizzle', -14), C(8.4, 'uhoh', -10), C(8.45, 'pop', -12), C(9.1, 'impact_hard', -6), C(9.15, 'whoosh_long', -12)]
# make it perfect: scribble, crumple, toss; nodding, snore
for k in range(6): a = 1.0 + k * 1.2; cues += [C(a, 'file:rustle', -17), C(a + .9, 'file:rustle', -13), C(a + 1.2, 'whoosh_short', -18, pitch=5), C(a + 1.6, 'impact_soft', -20)]
cues += [C(2.8, 'pop', -14), C(6.4, 'pop', -14), C(7.8, 'whoosh_long', -18, pitch=-5), C(9.0, 'impact_soft', -12), C(9.4, 'file:snore', -4), C(11.6, 'file:snore', -6)]
# all at once: whoosh per added task, wobble, drop, crash
for k in range(5): cues += [C(1.0 + k * 1.3, 'whoosh_short', -14, pitch=k), C(1.05 + k * 1.3, 'pop', -14, pitch=k)]
cues += [C(2.5, 'pop', -13), C(7.6, 'uhoh', -11), C(8.6, 'whoosh_long', -12), C(8.8, 'impact_soft', -10), C(9.0, 'impact_hard', -6), C(9.1, 'file:coin', -16)]
# top 3 first: pick pops, scribble + chime per task, bonus chimes
for k, a in enumerate((1.4, 1.9, 2.4)): cues += [C(a, 'pop', -12, pitch=k * 2)]
for k, a in enumerate((3.0, 5.0, 7.0)): cues += [C(a, 'file:rustle', -16), C(a + .7, 'file:rustle', -17), C(a + 1.5, 'soft_chime', -10, pitch=k * 2), C(a + 1.5, 'chime_up', -17)]
cues += [C(9.0, 'pop', -12), C(9.05, 'soft_chime', -12, pitch=7), C(11.5, 'soft_chime', -12, pitch=4), C(13.1, 'soft_chime', -12, pitch=6), C(13.3, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 6)
