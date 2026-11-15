# cue sheet mirroring index.html T (stick-4morning)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# yellow: coffee on coffee
for k in range(7): a = 1.0 + k * 1.15; cues += [C(a - .1, 'pop', -14, pitch=k % 5), C(a + .15, 'file:gulp', -9), C(a + .7, 'whoosh_short', -17, pitch=4), C(a + 1.05, 'impact_soft', -15)]
cues += [C(5.25, 'pop', -11), C(3.5, 'fizz', -18), C(8.8, 'whoosh_long', -11), C(8.9, 'impact_hard', -6), C(8.95, 'uhoh', -10), C(9.8, 'file:snore', -4)]
# blue: phone first
cues += [C(1.0, 'ui_tap', -13), C(1.5, 'impact_soft', -15)] + [C(1.8 + k * .8, 'notif_ding', -17, pitch=k % 3) for k in range(8)]
cues += [C(8.0, 'impact_soft', -10), C(8.1, 'file:alarm', -12), C(8.4, 'pop', -9), C(8.45, 'uhoh', -11)]
# red: 10-step routine
cues += [C(a, 'hop', -15) for a in [1.0, 2.2, 3.4, 4.6, 5.8, 7.0]] + [C(a + .9, 'soft_chime', -15, pitch=k) for k, a in enumerate([1.0, 2.2, 3.4, 4.6, 5.8, 7.0])]
cues += [C(1.4 + k * .8, 'file:scribble', -19) for k in range(8)] + [C(8.2, 'fizz', -14), C(9.4, 'whoosh_long', -12), C(9.75, 'impact_hard', -6), C(9.8, 'uhoh', -11)]
# purple: simple routine
cues += [C(1.1, 'soft_tap', -13), C(1.4, 'impact_soft', -17), C(2.05, 'file:gulp', -11), C(3.1, 'whoosh_short', -16), C(3.6, 'whoosh_short', -16, pitch=3), C(4.6, 'air', -14), C(6.0, 'soft_tap', -16), C(6.45, 'soft_tap', -16)]
cues += [C(a, 'soft_chime', -12, pitch=k % 5) for k, a in enumerate([1.7, 2.9, 4.5, 5.9, 7.5, 9.6, 10.8, 12.0, 13.2])] + [C(13.0, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 6)
