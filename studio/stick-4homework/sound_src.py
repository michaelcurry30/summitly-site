# cue sheet mirroring index.html T (stick-4homework)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# yellow: later tonight (couch games, 5 more min, nods off, asleep)
cues += [C(1.0 + k * .7, 'file:blip', -22, pitch=k % 4) for k in range(12) if not (2.2 <= 1.0 + k * .7 < 2.8 or 4.6 <= 1.0 + k * .7 < 5.2)]
cues += [C(2.2, 'chime_up', -15), C(4.6, 'chime_up', -15), C(3.2, 'pop', -13), C(6.2, 'pop', -13), C(7.6, 'whoosh_long', -18, pitch=-5), C(9.2, 'impact_soft', -13), C(9.5, 'file:snore', -6), C(12.0, 'file:snore', -9)]
# blue: easy stuff first, then the big book lands, panic
for k in range(6): a = 1.0 + k * .9; cues += [C(a, 'file:scribble', -18), C(a + .65, 'soft_chime', -14, pitch=k % 5), C(a + .8, 'whoosh_short', -19, pitch=4)]
cues += [C(6.6, 'impact_hard', -7), C(7.3, 'uhoh', -14), C(9.2, 'pop', -11), C(9.25, 'uhoh', -10)]
# red: phone on the desk (buzz, grab, notifications pile, buried)
cues += [C(1.8, 'file:buzz', -11), C(4.3, 'file:buzz', -11), C(2.1, 'whoosh_short', -16), C(4.5, 'whoosh_short', -16), C(3.6, 'file:scribble', -18)]
cues += [C(5.0 + k * .55, 'notif_ding', -19, pitch=k % 3) for k in range(8)] + [C(9.0, 'whoosh_long', -12), C(9.05, 'impact_hard', -8), C(9.1, 'uhoh', -11)]
cues += [C(9.5 + k * .6, 'notif_ding', -22) for k in range(8)]
# purple: phone tossed, hardest book first, easy pages zip
cues += [C(1.0, 'whoosh_short', -12), C(1.15, 'pop', -12), C(1.7, 'impact_soft', -11)]
cues += [C(a, 'soft_chime', -12, pitch=k) for k, a in enumerate([2.9, 3.9, 4.9])] + [C(5.8, 'chime_up', -10), C(6.1, 'whoosh_short', -16)]
for k in range(7): a = 6.6 + k * 1.0; cues += [C(a, 'file:scribble', -17), C(a + .7, 'soft_chime', -12, pitch=k % 5)]
cues += [C(13.0, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 5)
