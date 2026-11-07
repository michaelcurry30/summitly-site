#!/usr/bin/env python3
"""app_version.py - derive the APP-version cue sheet from a brand-neutral one (STICK NINJA series).

    python3 kit/sound/app_version.py <project> <EC0> [--src sound.json] [--out <project>-app/sound.json]

Copies <project>/sound.json, drops the "Follow for more." VO line and every SFX cue at or after EC0 - 0.1 s
(the neutral sign-off), ends the last music bed at EC0 and adds a hype bed whose downbeat hits the icon reveal,
then adds the end-card cues of Stick.endCardApp (kit/stick.js) relative to EC0:
  VO   EC0+.30  "Download Summitly. Free on the App Store." (narrator)
  SFX  whoosh_long (the slash wipe), hop, sting (icon reveal, EC0+.50), land, whoosh_short (twirl), shing (point), pop (chip)
"""
import json, os, sys

END_VO = "Download Summitly. Free on the App Store."
END_SFX = [(.16, 'whoosh_long', -5, {}), (.12, 'hop', -11, {}), (.5, 'sting', -2, {}), (.62, 'land', -8, {}),
           (1.2, 'whoosh_short', -13, {'align': 'start'}), (1.72, 'shing', -10, {'v': 2}), (2.05, 'pop', -12, {})]


def build(cues, ec0, follow_re='follow for more'):
    c = json.loads(json.dumps(cues))
    c['vo'] = [l for l in c.get('vo', []) if follow_re not in l['text'].lower()]
    for l in c['vo']:
        if l['t'] >= ec0 - .1:
            raise SystemExit(f"VO line at {l['t']} starts after the end card ({ec0})")
    c['vo'].append({'t': round(ec0 + .3, 3), 'text': END_VO})
    c['sfx'] = [s for s in c.get('sfx', []) if s['t'] < ec0 - .1]
    for dt, name, g, extra in END_SFX:
        c['sfx'].append(dict({'t': round(ec0 + dt, 3), 'name': name, 'gain': g}, **extra))
    m = c.get('music')
    beds = m if isinstance(m, list) else ([m] if m else [])
    for b in beds:
        if b.get('to') is None or b['to'] > ec0:
            b['to'] = ec0
    beds = [b for b in beds if b.get('from', 0) < ec0 - .2]
    beds.append({'mood': 'hype', 'bpm': 118, 'key': 'C major', 'from': ec0, 'hit': round(ec0 + .5, 3), 'gain': -10, 'xfade': .4})
    c['music'] = beds
    return c


if __name__ == '__main__':
    a = sys.argv[1:]
    proj, ec0 = a[0].rstrip('/'), float(a[1])
    src = a[a.index('--src') + 1] if '--src' in a else os.path.join(proj, 'sound.json')
    out = a[a.index('--out') + 1] if '--out' in a else os.path.join(proj + '-app', 'sound.json')
    c = build(json.load(open(src)), ec0)
    os.makedirs(os.path.dirname(out) or '.', exist_ok=True)
    json.dump(c, open(out, 'w'), indent=1)
    print('wrote', out)


def with_app_beat(cues, ins, ab, vo=None, sfx=(), music_split=True):
    """Insert an app beat of `ab` seconds at `ins` (neutral time): every VO/SFX cue and music edge at or after `ins`
    shifts by `ab`; adds the beat's own VO line and SFX (times relative to ins). Returns new cues (no end card yet)."""
    c = json.loads(json.dumps(cues))
    sh = lambda x: round(x + ab, 3) if x >= ins - 1e-6 else x
    for l in c.get('vo', []):
        l['t'] = sh(l['t'])
    for s in c.get('sfx', []):
        s['t'] = sh(s['t'])
    if vo:
        c['vo'].append({'t': round(ins + vo[0], 3), 'text': vo[1]})
        c['vo'].sort(key=lambda l: l['t'])
    for dt, name, g, extra in sfx:
        c['sfx'].append(dict({'t': round(ins + dt, 3), 'name': name, 'gain': g}, **extra))
    m = c.get('music')
    for b in (m if isinstance(m, list) else [m] if m else []):
        for k in ('from', 'to', 'hit'):
            if b.get(k) is not None and not (k == 'to' and abs(b[k] - ins) < 1e-6):
                b[k] = sh(b[k])
            elif k == 'to' and b.get(k) is not None:
                b[k] = round(ins + ab, 3)          # the bed playing into the beat carries through it
        if b.get('stops'):
            b['stops'] = [[sh(a), sh(z)] for a, z in b['stops']]
    return c
