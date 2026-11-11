# shared cue helper for 4-panel videos (copied per project): common format cues + project cues -> sound.json
import json, os
def common(nwords, T=None):
    T = T or dict(go=1.0, POWER=15.0, stamps=[15.94, 16.41, 16.88, 17.34], les0=17.81, cta=19.4, reset=21.57, hookIn=21.8)
    c = [dict(t=T['go'], name='whoosh_short', gain=-11), dict(t=T['go'], name='ui_tap', gain=-16),
         dict(t=T['POWER'] - .5, file='sfx/powerup.wav', gain=-5), dict(t=T['POWER'], name='riser', gain=-9, align='end'),
         dict(t=T['POWER'], name='impact_hard', gain=-8)]
    for k, s in enumerate(T['stamps']):
        c += [dict(t=s, name='impact_soft', gain=-6), dict(t=s, name='uhoh', gain=-15)] if k < 3 else [dict(t=s, name='chime_up', gain=-5), dict(t=s, name='pop', gain=-8)]
    c += [dict(t=T['les0'], name='whoosh_short', gain=-9, align='cut'), dict(t=T['les0'], name='impact_hard', gain=-11),
          dict(t=round(T['les0'] + .22 * (nwords - 1), 2), name='impact_hard', gain=-11),
          dict(t=T['cta'], name='pop', gain=-6), dict(t=T['cta'], name='chime_up', gain=-12),
          dict(t=20.0, name='whoosh_short', gain=-15), dict(t=21.0, name='whoosh_short', gain=-15),
          dict(t=T['reset'], name='rewind', gain=-12), dict(t=T['hookIn'], name='whoosh_short', gain=-11)]
    return c
def write(here, cues, nwords, key='E minor'):
    sfx = sorted(common(nwords) + cues, key=lambda c: c['t'])
    for c in sfx: c['t'] = round(c['t'], 3)
    json.dump({'voice': 'af_heart', 'speed': 1.08, 'vo': [], 'sfx': sfx,
               'music': {'mood': 'hype', 'bpm': 128, 'key': key, 'stops': [[14.53, 15.0]], 'gain': -5}},
              open(os.path.join(here, 'sound.json'), 'w'), indent=1)
    print(len(sfx), 'cues')
