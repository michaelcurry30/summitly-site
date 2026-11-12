#!/usr/bin/env python3
"""gen_short.py <spec.json-module.py> — builds index.html + sound.json for a short planner-channel stick video
from the 5-scene template (hook / problem / roof WORD CUT / fix / payoff + endCardPlanner). Run measure first."""
import json, re, sys, importlib.util, subprocess, os
EC = {
 'a': ('<div data-max="160"><i class="cy">START</i></div><div data-max="160">TONIGHT</div>', [.35, .7], '<span class="chip dark" style="font-size:40px">FREE TRACKER · LINK IN <b>BIO</b></span>'),
 'b': ('<div data-max="140">DON’T WATCH IT.</div><div data-max="160"><i class="cy">TRACK</i> <i class="cy">IT.</i></div>', [.35, .5, .65, 1.15, 1.35], '<span class="chip dark" style="font-size:46px">FREE TRACKER IN <b>BIO</b></span>'),
 'c': ('<div data-max="140">DAY ONE</div><div data-max="160"><i class="cy">STARTS</i> <i class="cy">NOW</i></div>', [.35, .55, .8, 1.0], '<span class="chip dark" style="font-size:40px">FREE TRACKER · LINK IN <b>BIO</b></span>'),
 'd': ('<div data-max="140">SMALL STEPS</div><div data-max="160"><i class="cy">ADD</i> <i class="cy">UP</i></div>', [.35, .55, .85, 1.0], '<span class="chip dark" style="font-size:46px">FREE TRACKER IN <b>BIO</b></span>'),
 'e': ('<div data-max="120">STOP WASTING</div><div data-max="140"><i class="cy">YOUR</i> <i class="cy">POTENTIAL</i></div>', [.35, .6, .9, 1.15], '<span class="chip dark" style="font-size:34px">FREE PLANNER PAGES · LINK IN <b>BIO</b></span>'),
}
def words(h): return len(re.sub(r'<[^>]+>', ' ', h).split())
def beats(a, b, n): return [round(a + i * (b - a) / max(1, n - 1), 2) for i in range(n)] if n > 1 else [round(a, 2)]

name = sys.argv[1]; spec = importlib.util.spec_from_file_location('s', f'{name}/spec.py'); m = importlib.util.module_from_spec(spec); spec.loader.exec_module(m); P = m.P
out = subprocess.run(['python3', 'kit/sound/mix.py', 'measure', name], capture_output=True, text=True).stdout
L = [(float(r[1]), float(r[3])) for r in (l.split() for l in out.splitlines()) if len(r) > 4 and r[0].isdigit()]
(s0, e0), (s1, e1), (sn, en), (s3, e3), (s4, e4), (s5, e5) = L
A = dict(hook=0, prob=round(s1 - .1, 2), roof=round(sn - .2, 2), fix=round(sn + 1.1, 2), pay=round(s4 - .2, 2))
EC0 = round(s5 - .3, 2); DUR = round(max(EC0 + 3.4, e5 + .4), 2)
K = dict(TH=round(sn + .7, 2), land=round(A['roof'] + .13, 2), EC0=EC0, DUR=DUR)
K.update({k: round(A[v[0]] + v[1], 2) for k, v in P['keys'].items()})
head, eb, chip = EC[P['ec']]
H = P['heads']  # hook, prob, ninja, fix, pay1, pay2
def hb(h, a, b, first_line_hold=False):
    n = words(h)
    if first_line_hold:
        n1 = words(h.split('</div>')[0]); return [0] * n1 + beats(a, b, n - n1)
    return beats(a, b, n)
hookB = hb(H[0], round(e0 - 1.0, 2), round(e0 - .35, 2), True)
probB = hb(H[1], s1 + .02, e1 - .45)
ninB = hb(H[2], sn + .02, en - .2)
fixB = hb(H[3], s3 + .02, e3 - .45)
p1n = words(H[4]); payB = beats(s4 + .02, s4 + .25, p1n)
pay2t = round(min(s4 + .55, e4 - .25), 2)
html = f'''<!doctype html>
<html><head><meta charset="utf-8"><title>{P['title']}</title>
<script src="variant.js"></script>
<script src="kit/stick.js"></script>
</head>
<body><div id="stage"></div>
<script>
// STICK NINJA — "{P['title'].upper()}" (planner channel). Short (≈{DUR} s). Built from gen_short.py template. Ending: lesson + endCardPlanner (CTA {P['ec']}).
const EC0 = {EC0}, DUR = {DUR};
const A = {json.dumps(A)};
const K = {json.dumps(K)};
const SCENES = {{ hook: [0, A.prob], prob: [A.prob, A.roof], roof: [A.roof, A.fix], fix: [A.fix, A.pay], pay: [A.pay, DUR] }};
const S = Stick, {{ seg, oC, io, oBack, lerp, clamp, tri, hash }} = S;
const stage = S.stage();
const E = {{ e1: {P['envs'][0]}, e2: {P['envs'][1]}, roof: S.env(stage, 'rooftop'), e4: {P['envs'][2]}, mtn: S.env(stage, 'mountain') }};
const W = S.world(stage);
const hookH = S.kin(stage, '{H[0]}', {{ top: 262 }});
const probH = S.kin(stage, '{H[1]}', {{ top: 262 }});
const ninH = S.kin(stage, '{H[2]}', {{ top: 262 }});
const fixH = S.kin(stage, '{H[3]}', {{ top: 262 }});
const pay1 = S.kin(stage, '{H[4]}', {{ top: 290 }});
const pay2 = S.kin(stage, '{H[5]}', {{ top: {P.get('pay2top', 470)} }});
S.safeGuide(stage);
const endCard = S.endCardPlanner(stage, {{ dur: +(DUR - EC0).toFixed(2), head: '{head}', beats: {json.dumps(eb)}, chip: '{chip}' }});
const D = S.ninja.draw, nin = (t, J, o) => S.ninja.pose(t, Object.assign({{ J }}, o));
const sk = n => S.ninja.skel(n), W2 = (n, p) => S.ninja.toWorld(n, p), hand = n => W2(n, sk(n).armF[2]);
function glow(ctx, x, y, r, col, k) {{
  if (k <= 0) return; const g = ctx.createRadialGradient(x, y, 0, x, y, r); g.addColorStop(0, col.replace('A', (.5 * k).toFixed(3))); g.addColorStop(1, col.replace('A', '0'));
  ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
}}
const EW = {P.get('wc_colors', "{ color: '#ff9ec7', color2: '#ff6fae', side: '#6a1736', depth: 16 }")};
const HA = -64, TS = K.TH - S.ninja.SLASH.uAt(HA);
const roofTr = S.track([[A.roof, 160, 1500, 1.2, 0], [K.land, 200, 1500, 1.2, 0], [TS - .02, 200, 1500, 1.2, 0], [TS + .62, 640, 1500, 1.2, 260], [99, 640, 1500, 1.2, 0]]);
const roofTL = S.ninja.timeline([[A.roof, 'jump', {{ ph: .5 }}], [K.land, 'crouch', {{}}, .1], [TS, 'slash', {{}}, .08], [TS + 1.25, 'ready', {{}}, .25]]);
const hitN = nin(K.TH, roofTL(K.TH), roofTr(K.TH)), RC = S.ninja.reach(hitN);
const WC = S.wordcut(Object.assign({{ text: '{P['cut']}', x: RC.cx + RC.R * Math.cos(HA * Math.PI / 180), y: RC.cy + RC.R * Math.sin(HA * Math.PI / 180), size: {P.get('cutsize', 160)}, angle: HA + 90, seed: 7 }}, EW));
const payTL = S.ninja.timeline([[A.pay, 'walk'], [A.pay + .5, 'idle', {{}}, .2], [A.pay + .6, 'flourish', {{ aim: -8 }}, .1], [{pay2t} + .4, 'proud', {{}}, .25]]);
const payTr = S.track([[A.pay, 250, 1500, 1.15, 0], [A.pay + .5, 470, 1500, 1.15, 0]]);
{P['js']}
const span = (k, a, b) => seg(k, a, b);
const SC = [
  {{ a: 0, b: A.prob, env: E.e1, envOpt: {P.get('envOpt1', '() => ({ lamp: .6 })')}, cam: t => ({{ x: lerp({P.get('cam1x', '560, 620')}, seg(t, 0, A.prob)), y: 1150, z: lerp(1.3, 1.42, io(seg(t, 0, A.prob))) + .03 * tri(t, K.h1, K.h1 + .3) }}), draw: drawHook }},
  {{ a: A.prob, b: A.roof, env: E.e2, whip: 'left', envOpt: {P.get('envOpt2', '() => ({})')}, cam: t => ({{ x: lerp(540, 600, seg(t, A.prob, A.roof)), y: 1120, z: lerp(1.18, 1.28, io(seg(t, A.prob, A.roof))) + .04 * tri(t, K.pk, K.pk + .3), r: -1.5 }}), draw: drawProb }},
  {{ a: A.roof, b: A.fix, env: E.roof, whip: 'up', cam: t => {{ const push = io(seg(t, A.roof + .1, K.TH)) * .07, punch = .05 * tri(t, K.TH, K.TH + .25);
      return {{ x: lerp(545, 575, seg(t, A.roof, A.fix)), y: lerp(900, 880, seg(t, A.roof, A.fix)), z: 1.2 + push + punch }}; }},
    draw(ctx, t) {{ WC.draw(ctx, t, {{ in: A.roof + .05, mode: '{P.get('cutmode', 'drop')}', h: 240, cut: K.TH, wob: .6, kick: 1.2, fadeAt: A.fix - .1 }}); D(ctx, nin(t, roofTL(t), Object.assign({{ ground: 1500 }}, roofTr(t)))); }} }},
  {{ a: A.fix, b: A.pay, env: E.e4, whip: 'left', envOpt: {P.get('envOpt4', '() => ({})')}, cam: t => ({{ x: lerp(560, 620, seg(t, A.fix, A.pay)), y: 1120, z: lerp(1.25, 1.33, io(seg(t, A.fix, A.pay))) + .03 * tri(t, K.f2, K.f2 + .3) }}), draw: drawFix }},
  {{ a: A.pay, b: DUR + 1, env: E.mtn, whip: 'left', cam: t => ({{ x: 540, y: lerp(960, 985, seg(t, A.pay, EC0)), z: lerp(1.16, 1.24, io(seg(t, A.pay, EC0))) + .03 * tri(t, {pay2t}, {pay2t} + .3) }}),
    envOpt: t => ({{ rise: .3 + .6 * io(seg(t, A.pay, EC0 - .2)) }}),
    draw(ctx, t) {{ D(ctx, nin(t, payTL(t), Object.assign({{ vx: t < A.pay + .5 ? 300 : 0 }}, payTr(t)))); S.sparks(ctx, t, {pay2t}, 470, 1000, {{ n: 14, seed: 9, speed: 700, dir: -Math.PI / 2, spread: 2.6, life: .5, g: 900 }}); }} }},
];
function seek(t) {{
  const sh = WC.shake(t, K.TH), imp = (a, amp) => t >= a && t < a + .22 ? Math.round(amp * (1 - (t - a) / .22) * Math.sin(t * 120)) : 0;
  W.seek(t, SC, {{ shake: [sh[0], sh[1] + imp(K.pk, 6) + imp(K.f2, 4)], flash: WC.flash(t, K.TH), flashColor: '#ff6fae' }});
  S.kinShow(hookH, t, 0, A.prob - .15, {{ hold0: true, beats: {json.dumps(hookB)} }});
  S.kinShow(probH, t, {s1 + .02:.2f}, A.roof - .3, {{ beats: {json.dumps(probB)} }});
  S.kinShow(ninH, t, {sn + .02:.2f}, A.fix - .1, {{ beats: {json.dumps(ninB)}, style: 'slam' }});
  S.kinShow(fixH, t, {s3 + .02:.2f}, A.pay - .15, {{ beats: {json.dumps(fixB)} }});
  S.kinShow(pay1, t, {s4 + .02:.2f}, EC0 - .3, {{ beats: {json.dumps(payB)}, style: 'slam' }});
  S.kinShow(pay2, t, {pay2t}, EC0 - .3, {{ beats: {json.dumps(beats(pay2t, pay2t + .3, words(H[5])))}, style: 'slam' }});
  endCard(t, EC0);
  S.hideInvisible(stage);
}}
S.boot({{ duration: DUR, fps: 30, seek }});
</script></body></html>
'''
open(f'{name}/index.html', 'w').write(html)
r = lambda x: round(x, 2)
sfx = [dict(t=.05, name='whoosh_long', gain=-9, align='start'), dict(t=K['h1'], name=P.get('h1sfx', 'uhoh'), gain=-12),
       dict(t=A['prob'], name='whoosh_long', gain=-8), dict(t=K['pk'], name='impact_soft', gain=-10),
       dict(t=A['roof'], name='whoosh_long', gain=-8), dict(t=K['land'], name='land', gain=-8), dict(t=r(sn + .2), name='shing', gain=-6),
       dict(t=r(K['TH'] - .25), name='riser', gain=-12, align='end'), dict(t=K['TH'], name='whoosh_short', gain=-8), dict(t=K['TH'], name='slice', gain=-5), dict(t=K['TH'], name='impact_hard', gain=-11),
       dict(t=A['fix'], name='whoosh_long', gain=-8), dict(t=K['f1'], name='chime_up', gain=-12), dict(t=K['f2'], name='chime_up', gain=-11, pitch=2),
       dict(t=A['pay'], name='whoosh_long', gain=-8), dict(t=r(s4 + .02), name='pop', gain=-13), dict(t=pay2t, name='shing', gain=-10),
       dict(t=EC0, name='whoosh_short', gain=-7), dict(t=r(EC0 + .25), name='sting', gain=-6), dict(t=r(EC0 + .4), name='land', gain=-10), dict(t=r(EC0 + 1.2), name='pop', gain=-11)] + [
       dict(t=r(A[a] + o), name=n, gain=g) for a, o, n, g in P.get('sfx', [])]
d = json.load(open(f'{name}/sound.json'))
d['sfx'] = sorted(sfx, key=lambda x: x['t'])
d['music'] = [dict(mood='hype', bpm=118, key='A minor', **{'from': 0, 'to': A['fix']}, hit=K['TH'], stops=[[r(sn + .25), r(K['TH'] - .02)]], gain=-10),
              dict(mood='chill', bpm=90, key='C major', **{'from': A['fix'], 'to': A['pay']}, gain=-11),
              dict(mood='hype', bpm=118, key='C major', **{'from': A['pay']}, hit=EC0, gain=-11)]
json.dump(d, open(f'{name}/sound.json', 'w'), indent=1)
print('A', A, 'K', K)
