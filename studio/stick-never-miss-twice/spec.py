P = dict(title='Never Miss Twice', ec='b', cut='QUIT', cutsize=200,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 heads=['<div data-max="130">MISSED ONE WORKOUT,</div><div data-max="130">SO YOU QUIT THE <i class="pk">WHOLE</i> <i class="pk">PLAN?</i></div>',
        '<div data-max="130">ONE MISS TURNS INTO A WEEK.</div><div data-max="150">THEN IT’S <i class="pk">OVER.</i></div>',
        '<div data-max="180"><i class="cy">NO</i> <i class="cy">WAY.</i></div>',
        '<div data-max="130">MISSING ONCE IS LIFE.</div><div data-max="140">JUST <i class="cy">NEVER</i> <i class="cy">MISS</i> <i class="cy">TWICE.</i></div>',
        '<div data-max="150">NEVER MISS</div>', '<div data-max="170"><i class="or">TWICE.</i></div>'],
 keys=dict(h1=('hook', 1.5), pk=('prob', 1.8), f1=('fix', .5), f2=('fix', 1.9)),
 h1sfx='uhoh', sfx=[('prob', .3, 'pop', -14), ('prob', .55, 'pop', -14), ('prob', .8, 'pop', -14), ('prob', 1.05, 'pop', -14), ('prob', 1.3, 'pop', -14), ('fix', 1.1, 'hop', -12)],
 js=r'''
const hookTL = S.ninja.timeline([[0, 'pushup'], [.9, 'flat', {}, .15], [K.h1, 'shrug', {}, .15]]);
function drawHook(ctx, t) { const k = oBack(seg(t, K.h1 - .3, K.h1), 2);
  if (k > 0) { S.calPage(ctx, 820, 1050, .6 * k, 'MON', { rot: 6 }); ctx.save(); ctx.strokeStyle = '#ff4f8b'; ctx.lineWidth = 16; ctx.lineCap = 'round'; const p = seg(t, K.h1, K.h1 + .25), r = 60;
    ctx.beginPath(); ctx.moveTo(820 - r, 1050 - r + 20); ctx.lineTo(820 - r + 2 * r * p, 1050 - r + 20 + 2 * r * p); ctx.stroke(); ctx.restore(); }
  D(ctx, nin(t, hookTL(t), { x: 520, y: 1500, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'sitBack'], [A.prob + 1.0, 'slump', {}, .2], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) {
  for (let i = 0; i < 5; i++) { const a = A.prob + .3 + i * .25, k = oBack(seg(t, a, a + .2), 2); if (k <= 0) continue;
    const x = 600 + (i % 3) * 140, y = 960 + Math.floor(i / 3) * 190; S.calPage(ctx, x, y, .45 * k, 'DAY ' + (i + 2), { rot: (i - 2) * 5, col: '#ff6fae' }); }
  D(ctx, nin(t, probTL(t), { x: 320, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'pushup'], [A.fix + 1.1, 'jump', { ph: .5 }, .1], [A.fix + 1.5, 'pump', {}, .1], [K.f2 + .3, 'cheer', {}, .12]]);
function drawFix(ctx, t) {
  glow(ctx, 520, 1250, 260, 'rgba(62,230,255,A)', .3 + .4 * seg(t, K.f1, K.f2));
  S.calPage(ctx, 760, 1000, .5 * oBack(seg(t, A.fix, A.fix + .3), 2), 'MISS', { rot: -5, col: '#ff6fae' });
  S.calPage(ctx, 920, 1060, .5 * oBack(seg(t, K.f1, K.f1 + .3), 2), 'BACK', { rot: 6, col: '#3ee6ff' });
  S.check(ctx, 930, 1100, .55, seg(t, K.f2, K.f2 + .35));
  D(ctx, nin(t, fixTL(t), { x: 470, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f2, 930, 1080, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
