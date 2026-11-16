P = dict(ninout=-.1, title='Keep Small Promises', cut='EXCUSES', cutsize=150,
 envs=["S.env(stage, 'bedroom')", "S.env(stage, 'hall')", "S.env(stage, 'library', { day: true })"],
 vo=['You promise yourself you’ll start Monday. Then Monday comes.', 'Break enough promises, and you stop trusting yourself.', 'Enough.',
     'Make one small promise today, and keep it. Tomorrow, make another.', 'Discipline is keeping small promises.'],
 heads=['<div data-max="130">“I’LL START MONDAY.”</div><div data-max="140">THEN MONDAY <i class="pk">COMES.</i></div>',
        '<div data-max="130">BREAK ENOUGH PROMISES,</div><div data-max="130">YOU STOP <i class="pk">TRUSTING</i> <i class="pk">YOURSELF.</i></div>',
        '<div data-max="190"><i class="cy">ENOUGH.</i></div>',
        '<div data-max="130">ONE SMALL PROMISE TODAY.</div><div data-max="140"><i class="cy">KEEP</i> <i class="cy">IT.</i> THEN ANOTHER.</div>',
        '<div data-max="140">DISCIPLINE IS KEEPING</div>', '<div data-max="160"><i class="or">SMALL</i> <i class="or">PROMISES.</i></div>'],
 keys=dict(h1=('hook', 1.7), pk=('prob', 2.2), f1=('fix', .5), f2=('fix', 2.2)),
 h1sfx='uhoh', sfx=[('hook', .5, 'pop', -14), ('prob', .3, 'impact_soft', -14), ('prob', .8, 'impact_soft', -14), ('prob', 1.3, 'impact_soft', -14), ('fix', .9, 'pop', -13), ('fix', 1.4, 'pop', -13)],
 js=r'''
function xmark(ctx, x, y, r, p) { if (p <= 0) return; ctx.save(); ctx.strokeStyle = '#ff4f8b'; ctx.lineWidth = 14; ctx.lineCap = 'round'; ctx.beginPath();
  const a = Math.min(1, p * 2), b = Math.max(0, p * 2 - 1); ctx.moveTo(x - r, y - r); ctx.lineTo(x - r + 2 * r * a, y - r + 2 * r * a);
  if (b > 0) { ctx.moveTo(x + r, y - r); ctx.lineTo(x + r - 2 * r * b, y - r + 2 * r * b); } ctx.stroke(); ctx.restore(); }
const hookTL = S.ninja.timeline([[0, 'point', { ang: -30 }], [1.0, 'proud', {}, .15], [K.h1, 'hide', { face: 'x' }, .15]]);
function drawHook(ctx, t) { S.calPage(ctx, 800, 1060 + 30 * oC(seg(t, K.h1 - .2, K.h1)), .6 * oBack(seg(t, .3, .6), 2), 'MON', { rot: 6 });
  D(ctx, nin(t, hookTL(t), { x: 440, y: 1500, s: 1 })); }
const probTL = S.ninja.timeline([[A.prob, 'shrug'], [A.prob + 1.0, 'slump', {}, .2], [K.pk, 'facepalm', {}, .12]]);
function drawProb(ctx, t) { ['MON', 'TUE', 'WED'].forEach((w, i) => { const a = A.prob + .2 + i * .5, k = oBack(seg(t, a, a + .2), 2); if (k <= 0) return;
    const x = 640 + i * 140, y = 1040 + (i % 2) * 90; S.calPage(ctx, x, y, .45 * k, w, { rot: (i - 1) * 6, col: '#ff6fae' }); xmark(ctx, x, y + 10, 48, seg(t, a + .2, a + .45)); });
  D(ctx, nin(t, probTL(t), { x: 330, y: 1500, s: 1 })); }
const fixTL = S.ninja.timeline([[A.fix, 'point', { ang: -30 }], [K.f1 + .6, 'pump', {}, .12], [K.f2 + .2, 'cheer', {}, .12]]);
function drawFix(ctx, t) { glow(ctx, 800, 1150, 260, 'rgba(62,230,255,A)', .3 + .4 * seg(t, K.f1, K.f2));
  [0, 1].forEach(i => { const a = K.f1 + i * .9, k = oBack(seg(t, a, a + .25), 2); if (k <= 0) return; const x = 700 + i * 170, y = 1060 + i * 40;
    S.note(ctx, x, y, .55 * k, (i ? 6 : -6), '', { col: '#ffe36b' }); S.check(ctx, x, y, .45, seg(t, a + .4, a + .7)); });
  D(ctx, nin(t, fixTL(t), { x: 420, y: 1500, s: 1 }));
  S.sparks(ctx, t, K.f2, 860, 1060, { n: 12, seed: 14, speed: 500, dir: -Math.PI / 2, spread: 2.4, life: .4, g: 900 }); }
''')
