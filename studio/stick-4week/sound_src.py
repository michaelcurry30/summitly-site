# cue sheet mirroring index.html T (stick-4week)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
# no plan: notes fly in and stick
cues = [C(1.0 + k * .42, 'whoosh_short', -20, pitch=6) for k in range(19)] + [C(1.0 + k * .42 + .35, 'soft_tap', -14, pitch=k % 6) for k in range(19)]
cues += [C(1.1, 'pop', -12), C(5.6, 'pop', -11), C(5.6, 'uhoh', -13), C(9.0, 'whoosh_short', -12), C(9.35, 'impact_hard', -8)]
# every minute: scroll, phone ring, rip, sob
cues += [C(1.0, 'whoosh_long', -16, pitch=-3), C(1.2, 'pop', -13)] + [C(1.4 + k * .5, 'file:scribble', -19) for k in range(10)]
cues += [C(6.8, 'notif_ding', -11), C(7.1, 'notif_ding', -12), C(7.4, 'pop', -12), C(7.5, 'uhoh', -12), C(8.3, 'file:crumple', -8), C(8.3, 'impact_soft', -9), C(9.0, 'whoosh_long', -16, pitch=-8)]
# in your head
cues += [C(1.0 + k * .4, 'pop', -14, pitch=k % 5) for k in range(6)] + [C(2.4, 'pop', -13)]
for k in range(6): b = 3.6 + k * .85; cues += [C(b, 'whoosh_short', -17, pitch=-4), C(b + .55, 'impact_soft', -15, pitch=-2)]
cues += [C(8.8, 'pop', -11, pitch=-5), C(9.3, 'file:alarm', -14), C(9.3, 'pop', -12), C(9.4, 'uhoh', -11)]
# short Sunday plan
cues += [C(1.0, 'file:scribble', -15), C(1.5, 'file:scribble', -15), C(2.0, 'file:scribble', -15), C(1.1, 'pop', -12)]
for d in range(7):
    a = 2.6 + d * 1.45; cues += [C(a + .25 + j * .35, 'soft_chime', -14, pitch=(d + j) % 5) for j in range(3)] + [C(a + 1.0, 'pop', -16, pitch=3)]
cues += [C(13.0, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 7)
