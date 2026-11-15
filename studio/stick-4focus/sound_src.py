# cue sheet mirroring index.html T (stick-4focus)
import os, sys; here = os.path.dirname(os.path.abspath(__file__)); sys.path.insert(0, here); import fp_sound
C = lambda t, name, gain=-14, **k: dict(t=t, name=name, gain=gain, **k)
cues = []
# yellow: study in bed
cues += [C(1.0, 'file:page', -12), C(2.2, 'file:yawn', -9), C(3.2, 'impact_soft', -15), C(4.6, 'whoosh_short', -15, pitch=-3), C(4.8, 'pop', -12), C(6.2, 'soft_tap', -17), C(7.4, 'file:snore', -8),
         C(8.6, 'whoosh_short', -13), C(8.85, 'impact_hard', -7), C(8.9, 'uhoh', -11), C(10.0, 'file:snore', -4), C(12.6, 'file:snore', -6)]
# blue: multitask
for k in range(8): a = 1.0 + k * .8; cues += [C(a, 'pop', -12, pitch=k % 5), C(a + .05, 'notif_ding', -18, pitch=k % 3)]
cues += [C(8.4, 'whoosh_long', -14), C(9.0, 'uhoh', -10), C(9.35, 'impact_hard', -7), C(9.6, 'impact_soft', -9)]
# red: no breaks
cues += [C(1.0 + k * .55, 'file:scribble', -17) for k in range(8)] + [C(5.0, 'fizz', -14), C(6.4, 'soft_tap', -14), C(7.3, 'soft_tap', -14), C(7.2, 'file:steam', -10), C(8.2, 'file:steam', -12),
         C(9.2, 'impact_hard', -6), C(9.25, 'uhoh', -10)]
# purple: phone away + short blocks
cues += [C(1.0, 'ui_tap', -13), C(1.35, 'whoosh_short', -15), C(1.95, 'impact_soft', -13)]
for k, (a, b) in enumerate([(1.7, 4.6), (5.8, 8.8), (10.0, 13.0), (14.0, 15.0)]):
    cues += [C(a, 'soft_tap', -14), C(a + .5, 'file:scribble', -20), C(a + 1.5, 'file:scribble', -20)]
    if k < 3: cues += [C(b, 'file:ding', -11), C(b + .05, 'soft_chime', -12, pitch=k), C(b + .3, 'whoosh_short', -17, pitch=4)]
cues += [C(13.0, 'swell', -14)]
for c in cues:
    if c['name'].startswith('file:'): c['file'] = 'sfx/' + c.pop('name')[5:] + '.wav'
fp_sound.write(here, cues, 6)
