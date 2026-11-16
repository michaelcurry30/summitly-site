#!/usr/bin/env python3
"""mk_short.py <name> — writes <name>/sound.json from spec.py P['vo'] (5 lines: hook, problem, NINJA line, fix, lesson),
auto-spaces the lines from measured TTS lengths, then runs gen_short2.py. Sets up kit symlink + variant.js."""
import json, sys, os, subprocess, importlib.util
name = sys.argv[1]
spec = importlib.util.spec_from_file_location('s', f'{name}/spec.py'); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); P = m.P
if not os.path.exists(f'{name}/kit'): os.symlink('../kit', f'{name}/kit')
open(f'{name}/variant.js', 'w').write('window.APP_VERSION = 0; window.PLANNER = 0;\n')
def write(ts):
    vo = [dict(t=round(t, 2), text=x) for t, x in zip(ts, P['vo'])]; vo[2]['who'] = 'NINJA'
    json.dump(dict(voice='af_heart', speed=1.1, cast=dict(NINJA=dict(voice='blend:am_michael:0.6,am_puck:0.4', speed=1.0)), vo=vo, sfx=[], music=[]), open(f'{name}/sound.json', 'w'), indent=1)
def measure():
    out = subprocess.run(['python3', 'kit/sound/mix.py', 'measure', name], capture_output=True, text=True).stdout
    return [float(r[2]) for r in (l.split() for l in out.splitlines()) if len(r) > 4 and r[0].isdigit()]
write([.15, 4, 8, 10, 14]); d = measure()
g = P.get('gaps', [.45, .4, .55])
t0 = .15; t1 = t0 + d[0] + g[0]; t2 = t1 + d[1] + g[1]; t3 = t2 + max(1.3, d[2] + .6); t4 = t3 + d[3] + g[2]
write([t0, t1, t2, t3, t4])
print('VO end', round(t4 + d[4], 2), 'words', sum(len(x.split()) for x in P['vo']))
subprocess.run(['python3', 'gen_short2.py', name], check=True)
