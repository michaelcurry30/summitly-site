"""timing.py — word onsets + mouth envelope for every VO line -> timing.json (read by index.html).
Run from studio/:  python3 talk-example/timing.py talk-example   (after mix.py measure)."""
import sys, os, re, json
import numpy as np
sys.path.insert(0, os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'kit', 'sound'))
import mix
proj = sys.argv[1] if len(sys.argv) > 1 else 'talk-example'
pdir, name, cache = mix.proj_paths(proj)
cues = mix.load_cues(pdir)
SR = mix.SR
out = []
for L in mix.vo_lines(cues, cache):
    a = L['audio']; hop = int(.01 * SR)
    n = len(a) // hop
    rms = np.array([np.sqrt(np.mean(a[i * hop:(i + 1) * hop] ** 2)) for i in range(n)])
    rms = rms / (rms.max() + 1e-9)
    voiced = rms > .06
    # speech segments separated by >= 90 ms of silence
    segs, i = [], 0
    while i < n:
        if voiced[i]:
            j = i
            while j < n:
                if not voiced[j]:
                    k = j
                    while k < n and not voiced[k]: k += 1
                    if k - j >= 9 or k >= n: break
                    j = k
                else: j += 1
            segs.append([i * .01, j * .01]); i = j
        else: i += 1
    # phrase groups split on punctuation
    groups = [g for g in re.split(r'(?<=[.?!,…])\s+', L['text'].strip()) if re.search(r'\w', g)]
    gw = [re.findall(r"[A-Za-z0-9'\-]+", g) for g in groups]
    weight = lambda w: 1 + len(re.findall(r'[aeiouyAEIOUY]+', w)) * 1.5 + len(w) * .15
    words = []
    if len(segs) == len(groups):
        for (s0, s1), ws in zip(segs, gw):
            tot = sum(weight(w) for w in ws); acc = 0
            for w in ws: words.append([w, round(L['t'] + s0 + (s1 - s0) * acc / tot, 3)]); acc += weight(w)
    else:
        allw = [w for ws in gw for w in ws]; s0, s1 = segs[0][0], segs[-1][1]
        tot = sum(weight(w) for w in allw); acc = 0
        # map "speech time" (only voiced segments) to real time so pauses are skipped
        spans = segs; total = sum(b - a_ for a_, b in spans)
        def at(u):
            x = u * total
            for a_, b in spans:
                if x <= b - a_: return a_ + x
                x -= b - a_
            return spans[-1][1]
        for w in allw: words.append([w, round(L['t'] + at(acc / tot), 3)]); acc += weight(w)
    # mouth envelope at 30 fps (0..1), smoothed
    fr = int(np.ceil(L['dur'] * 30))
    env = []
    for f in range(fr):
        i0, i1 = int(f / 30 / .01), int((f + 1) / 30 / .01)
        env.append(round(float(np.clip(rms[i0:max(i0 + 1, i1)].max() * 1.6, 0, 1)) if i0 < n else 0, 2))
    out.append(dict(t=L['t'], dur=round(L['dur'], 3), who=L['who'], text=L['text'], segs=len(segs), groups=len(groups), words=words, env=env))
json.dump(out, open(os.path.join(pdir, 'timing.json'), 'w'))
for o in out:
    print(f"{o['t']:6.2f} {o['dur']:5.2f} {o['who']:5s} seg {o['segs']} grp {o['groups']}  " + ' '.join(f"{w}@{t:.2f}" for w, t in o['words']))
