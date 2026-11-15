# cue sheet mirroring index.html T (stick-4skill)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# yellow: play all day once (frantic strums, tape, snap, fall)
t = 1.0
while t < 8.6: cues.append(C(t, 'file:strum', -22 if t > 4 else -19, pitch=int(t * 3) % 3)); t += .5
cues += [C(1.2, 'pop', -12), C(3.4, 'fizz', -16)] + [C(a, 'soft_tap', -12) for a in (4.6, 5.6, 6.6)] + [C(7.4, 'uhoh', -14)]
cues += [C(8.6, 'file:clang', -6), C(8.62, 'impact_soft', -10), C(9.0, 'whoosh_long', -12), C(9.4, 'impact_hard', -6), C(9.45, 'uhoh', -10), C(10.6, 'pop', -12)]
# blue: watch tutorials (a card pops each video), nods, asleep
cues += [C(1.0 + k * .7, 'ui_tap', -15, pitch=k % 4) for k in range(12)] + [C(6.4, 'whoosh_long', -19, pitch=-5), C(9.0, 'impact_soft', -14), C(9.3, 'file:snore', -7), C(12.2, 'file:snore', -10)]
# red: wait to feel ready (reach, pull back, not yet, calendar flips, beard)
cues += [C(a, 'whoosh_short', -16, pitch=3) for a in (1.0, 4.0, 6.8)] + [C(a, 'uhoh', -17) for a in (1.5, 4.5, 7.3)] + [C(2.0, 'pop', -12)]
cues += [C(5.0 + k * .45, 'whoosh_short', -21, pitch=6) for k in range(14)] + [C(6.0, 'swell', -20), C(9.0, 'fizz', -14), C(9.3, 'file:snore', -9)]
# purple: a short session every day, tick + calendar check; sounds get better
for k in range(8):
    a = 1.0 + k * 1.5
    cues += [C(a, 'file:strum', -18 if k >= 2 else -21, pitch=(-2 if k < 2 else k % 3)), C(a + .5, 'file:strum', -19, pitch=(-3 if k < 2 else 2)), C(a + 1.0, 'soft_chime', -12, pitch=k % 5), C(a + 1.05, 'pop', -17)]
cues += [C(13.0 + k * .45, 'file:strum', -17, pitch=k % 4) for k in range(4)] + [C(13.0, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 5)
