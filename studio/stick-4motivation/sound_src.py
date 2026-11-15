# cue sheet mirroring index.html T (stick-4motivation)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# vision board: pin pop per picture, admire chime, wobble, crash
for k in range(6): a = 1.0 + k * 1.0; cues += [C(a, 'whoosh_short', -17, pitch=3), C(a + .3, 'pop', -12, pitch=k % 4)]
cues += [C(6.6, 'soft_chime', -12), C(8.2, 'uhoh', -11), C(8.75, 'whoosh_long', -13), C(9.0, 'impact_hard', -6), C(9.05, 'pop', -12)]
# hype videos: buzz + charge per burst, ready, drain, flop
for k in range(5): a = 1.0 + k * 1.1; cues += [C(a, 'soft_tap', -16), C(a + .55, 'file:charge', -13), C(a + .58, 'chime_up', -18, pitch=k)]
cues += [C(6.6, 'impact_soft', -12), C(7.5, 'whoosh_short', -16), C(7.9, 'file:drain', -9), C(8.5, 'uhoh', -11), C(9.6, 'impact_soft', -8)]
# treat first: crunch per donut, food coma snore
for k in range(7): a = 1.0 + k * 1.05; cues += [C(a + .1, 'soft_tap', -17, pitch=2), C(a + .4, 'file:crunch', -12)]
cues += [C(1.3, 'pop', -14), C(6.25, 'pop', -14), C(8.6, 'whoosh_long', -14, pitch=-4), C(8.8, 'impact_soft', -8), C(9.4, 'file:snore', -4), C(11.6, 'file:snore', -6)]
# start small: rep tap + chime per check, charge
for k in range(11): d = 1.0 + k * 1.1; cues += [C(d + .1, 'soft_tap', -18), C(d + .85, 'soft_chime', -13, pitch=k % 5), C(d + .87, 'file:charge', -18)]
cues += [C(13.3, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 6)
