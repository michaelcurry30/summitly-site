# cue sheet mirroring index.html T (stick-4walk)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# yellow: walk to the fridge (steps, fridge door, crunch, wrapper toss; 4th trip trips)
for k in range(3):
    a = 1.0 + k * 2.4
    cues += [C(a + d, 'file:step', -19) for d in (0, .35)] + [C(a + .65, 'whoosh_short', -18, pitch=-4), C(a + .9, 'pop', -14)]
    cues += [C(a + 1.1 + d, 'file:step', -19) for d in (0, .35)] + [C(a + 1.85, 'file:scribble', -16, pitch=-6), C(a + 2.3, 'soft_tap', -16)]
cues += [C(1.2, 'pop', -12), C(8.2, 'file:step', -19), C(8.5, 'file:step', -19), C(8.7, 'whoosh_long', -12), C(9.2, 'impact_hard', -6), C(9.25, 'uhoh', -10)]
# blue: wait for nice weather (each weather change, sighs, tomorrow, cobweb)
for k, a in enumerate([1.5, 2.6, 3.3, 4.4, 5.5, 6.6, 7.7, 8.8, 9.9, 11.0, 12.1, 13.2, 14.3]): cues.append(C(a, 'whoosh_short' if k % 2 else 'fizz', -17 if k < 8 else -21, pitch=k % 4 - 2))
cues += [C(1.0, 'pop', -13), C(2.6, 'chime_up', -15), C(3.3, 'uhoh', -14), C(6.6, 'uhoh', -16), C(9.0, 'pop', -12), C(9.05, 'uhoh', -11)]
# red: treadmill turns into a clothes rack (toss whoosh + soft landing), today!, buried
for k in range(9): a = 1.0 + k * .8; cues += [C(a + .15, 'whoosh_short', -17, pitch=3), C(a + .45, 'soft_tap', -14)]
cues += [C(8.0, 'chime_up', -14), C(8.0, 'pop', -12), C(8.8, 'whoosh_long', -11), C(8.85, 'impact_hard', -6), C(8.9, 'uhoh', -10)]
# purple: eat, then a short walk after every meal, check
for k in range(7):
    a = 1.0 + k * 2.0; cues += [C(a + .1, 'file:scribble', -18, pitch=-5)]
    s = a + .7
    while s < a + 1.8: cues.append(C(s, 'file:step', -19)); s += .3
    if k < 6: cues += [C(a + 1.8, 'soft_chime', -12, pitch=k % 5), C(a + 1.85, 'pop', -17)]
cues += [C(13.0, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 6)
