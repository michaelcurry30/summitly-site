# cue sheet mirroring index.html T (stick-4takeout)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# buy healthy food: fridge door, rustle + pop per bag, tired, doorbell + pizza, stink blast, KO
cues += [C(0.95, 'soft_tap', -14)]
for k in range(5): a = 1.0 + k * .9; cues += [C(a, 'file:rustle', -15), C(a + .55, 'pop', -14, pitch=k)]
cues += [C(5.6, 'soft_chime', -12), C(5.65, 'impact_soft', -16), C(7.0, 'whoosh_long', -18, pitch=-6), C(7.6, 'file:doorbell', -12), C(8.0, 'pop', -13), C(8.3, 'file:crunch', -12),
         C(9.0, 'whoosh_long', -10), C(9.05, 'uhoh', -10), C(9.4, 'impact_hard', -6)]
# fancy meal: toss + splash per ingredient, bubbling, masterpiece, shake, boom
for k in range(6): a = 1.0 + k * .9; cues += [C(a + .1, 'whoosh_short', -17, pitch=3), C(a + .55, 'file:gulp', -13)]
cues += [C(3.0, 'file:sizzle', -18), C(5.0, 'file:sizzle', -16), C(6.6, 'pop', -13), C(7.6, 'uhoh', -11), C(7.7, 'file:sizzle', -12), C(8.5, 'impact_hard', -5), C(8.55, 'pop', -9), C(9.7, 'pop', -14)]
# just willpower: buzz + pop per craving, snap, mash, bags land, coins fly
for k in range(7): cues += [C(1.0 + k * 1.05, 'pop', -14, pitch=k % 5), C(1.02 + k * 1.05, 'soft_tap', -18)]
cues += [C(8.3, 'impact_soft', -10), C(8.32, 'ui_tap', -12), C(8.45, 'ui_tap', -12), C(8.6, 'ui_tap', -12)]
cues += [C(a, 'impact_soft', -8) for a in (8.8, 9.05, 9.3)] + [C(8.9, 'file:cashreg', -9)] + [C(8.9 + k * .3, 'file:coin', -16) for k in range(10)] + [C(9.6, 'file:crunch', -13), C(10.6, 'file:crunch', -15)]
# cook simple: tap, sizzle, crunch, coin + chime per meal
for k in range(6): c = 1.0 + k * 2.1; cues += [C(c + .1, 'soft_tap', -16), C(c + .6, 'file:sizzle', -18), C(c + 1.4, 'file:crunch', -16), C(c + 1.95, 'file:coin', -12), C(c + 1.95, 'soft_chime', -13, pitch=k % 5)]
cues += [C(1.3, 'pop', -14), C(8.6, 'pop', -14), C(13.3, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 4)
