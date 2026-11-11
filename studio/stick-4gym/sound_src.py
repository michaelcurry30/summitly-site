# cue sheet mirroring index.html T (stick-4gym)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# max weight: grab, plates clank, lift, strain, crash
cues += [C(1.0, 'impact_soft', -14)] + [C(a + .02, 'impact_hard', -14, pitch=2 + k) for k, a in enumerate([2.0, 3.0, 4.0, 5.0])] + [C(a, 'pop', -16, pitch=k) for k, a in enumerate([2.0, 3.0, 4.0, 5.0])]
cues += [C(6.0, 'whoosh_short', -12, pitch=-3), C(7.2, 'fizz', -14), C(8.0, 'uhoh', -10), C(8.65, 'impact_hard', -6), C(8.7, 'impact_soft', -8)]
# gear: items drop in, selfie flashes, tomorrow, snore
cues += [C(a + .3, 'pop', -13, pitch=3 + k) for k, a in enumerate([1.0, 1.9, 2.8, 3.7, 4.6])] + [C(a, 'chime_up', -19, pitch=k) for k, a in enumerate([1.0, 1.9, 2.8, 3.7, 4.6])]
cues += [C(5.8, 'ui_tap', -10, pitch=6), C(6.5, 'ui_tap', -10, pitch=6)] + [C(6.0 + k * .35 + .3, 'impact_soft', -14) for k in range(3)]
cues += [C(7.0, 'pop', -12), C(8.0, 'whoosh_short', -14), C(9.2, 'file:snore', 0)]
# influencer: jacks, phone checks, squats, pushups, backflip fail
cues += [C(1.0 + k * .42, 'soft_tap', -19) for k in range(4)] + [C(a + .1, 'notif_ding', -15, pitch=k) for k, a in enumerate([2.0, 3.8, 5.6])]
cues += [C(6.4, 'chime_up', -15), C(7.0, 'pop', -12), C(7.6, 'whoosh_long', -11, pitch=3), C(8.15, 'uhoh', -10), C(8.72, 'impact_hard', -6)] + [C(9.7 + k * .7, 'notif_ding', -21, pitch=-2) for k in range(6)]
# little every day: a chime per check, plate clinks
for k in range(11): d = 1.0 + k * 1.1; cues += [C(d + .8, 'soft_chime', -13, pitch=k % 5), C(d + .87, 'soft_tap', -14, pitch=4)]
cues += [C(13.3, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 6)
