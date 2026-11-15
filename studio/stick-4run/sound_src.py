# cue sheet mirroring index.html T (stick-4run)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# yellow: sprint on day one (fast steps, sweat, slows, limps, falls, wrecked)
t = 1.0
while t < 5.5: cues.append(C(t, 'file:step', -17)); t += .18
t = 5.5
while t < 7.6: cues.append(C(t, 'file:step', -19)); t += .32
cues += [C(1.6, 'pop', -12), C(4.6, 'fizz', -15), C(6.4, 'uhoh', -13), C(7.6, 'whoosh_long', -12), C(8.2, 'impact_hard', -6), C(8.25, 'uhoh', -10)]
# blue: buy all the gear (boxes thud, pile wobbles, topples)
for k in range(9): a = 1.0 + k * .8; cues += [C(a + .28, 'impact_soft', -13), C(a + .4, 'pop', -14, pitch=k % 5)]
cues += [C(8.1, 'chime_up', -14), C(8.5, 'whoosh_short', -15, pitch=-3), C(9.0, 'whoosh_long', -11), C(9.4, 'impact_hard', -6), C(9.45, 'uhoh', -10)]
# red: run once, then quit (happy jog, done, lie down, calendar Xs, cobweb, snore)
t = 1.0
while t < 3.2: cues.append(C(t, 'file:step', -19)); t += .26
cues += [C(3.2, 'chime_up', -13), C(3.25, 'pop', -12), C(4.4, 'impact_soft', -14)]
cues += [C(5.0 + k * .55, 'soft_tap', -15, pitch=-2) for k in range(12)] + [C(9.0, 'uhoh', -12), C(9.4, 'file:snore', -7), C(12.0, 'file:snore', -10)]
# purple: short jogs, each a little longer, tick + bar after each
for k in range(9):
    a = 1.0 + .95 * k + .05 * k * (k - 1); L = .45 + .1 * k; s = a
    while s < a + L: cues.append(C(s, 'file:step', -20)); s += .26
    cues += [C(a + L, 'soft_chime', -12, pitch=k % 5), C(a + L + .05, 'pop', -17)]
s = 13.15
while s < 14.9: cues.append(C(s, 'file:step', -19)); s += .26
cues += [C(13.0, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 6)
